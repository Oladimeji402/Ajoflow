begin;

-- Key/value platform settings (admin-configurable)
create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.platform_settings enable row level security;

drop policy if exists "Authenticated users can read platform settings" on public.platform_settings;
create policy "Authenticated users can read platform settings"
  on public.platform_settings
  for select
  to authenticated
  using (true);

-- Seed default passbook activation fee (NGN 500)
insert into public.platform_settings (key, value)
values ('passbook_activation_fee', '500'::jsonb)
on conflict (key) do nothing;

-- Activation fee helper — falls back to 500 if unset/invalid
create or replace function public.get_passbook_activation_fee()
returns numeric(12,2)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_fee numeric(12,2);
begin
  select nullif(trim(both '"' from (value #>> '{}')), '')::numeric(12,2)
  into v_fee
  from public.platform_settings
  where key = 'passbook_activation_fee';

  if v_fee is null or v_fee <= 0 then
    return 500::numeric(12,2);
  end if;

  return v_fee;
end;
$$;

-- Charge activation from wallet using the live configured fee
create or replace function public.activate_passbook_from_wallet(
  p_user_id uuid,
  p_reference text,
  p_request_id text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before numeric(12,2);
  v_after numeric(12,2);
  v_passbook_activated boolean;
  v_now timestamptz := timezone('utc', now());
  v_payment_id uuid;
  v_fee numeric(12,2) := public.get_passbook_activation_fee();
begin
  if p_reference is null or length(trim(p_reference)) = 0 then
    return 'invalid_reference';
  end if;

  select wallet_balance, passbook_activated
  into v_before, v_passbook_activated
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    return 'user_not_found';
  end if;

  if coalesce(v_passbook_activated, false) then
    return 'already_active';
  end if;

  if coalesce(v_before, 0) < v_fee then
    return 'insufficient_balance';
  end if;

  v_after := v_before - v_fee;

  update public.profiles
  set wallet_balance = v_after,
      passbook_activated = true,
      passbook_activated_at = v_now,
      passbook_reference = p_reference,
      updated_at = v_now
  where id = p_user_id;

  insert into public.payment_records (
    user_id, group_id, contribution_id, provider, type, amount, currency, status,
    reference, paid_at, metadata, request_id, pending_reason, expires_at
  )
  values (
    p_user_id, null, null, 'wallet', 'passbook_activation', v_fee, 'NGN', 'success',
    p_reference, v_now,
    jsonb_build_object('fundedFromWallet', true, 'requestId', p_request_id),
    p_request_id, null, null
  )
  returning id into v_payment_id;

  insert into public.passbook_entries (
    user_id, entry_type, source_id, source_table, amount, direction, status,
    reference, description, happened_at
  )
  select
    p_user_id, 'passbook_activation', v_payment_id, 'payment_records', v_fee, 'debit', 'success',
    p_reference, 'One-time passbook activation fee (wallet)', v_now
  where not exists (
    select 1 from public.passbook_entries pbe where pbe.reference = p_reference
  );

  insert into public.wallet_ledger (
    user_id, direction, amount, balance_before, balance_after, reason, payment_record_id,
    reference, idempotency_key, actor_type, metadata
  )
  values (
    p_user_id, 'debit', v_fee, v_before, v_after, 'passbook_activation', v_payment_id,
    p_reference, 'wallet_spend:' || p_reference, 'system',
    jsonb_build_object('requestId', p_request_id)
  );

  return 'activated';
end;
$$;

commit;
