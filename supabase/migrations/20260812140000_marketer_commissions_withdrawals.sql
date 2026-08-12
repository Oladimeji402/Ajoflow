begin;

-- Ensure settings table exists (also created by passbook fee migration)
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

-- Commission / withdrawal config (admin-editable)
insert into public.platform_settings (key, value)
values
  ('marketer_commission_per_user', '250'::jsonb),
  ('marketer_withdrawal_min_amount', '5000'::jsonb)
on conflict (key) do nothing;

-- Withdrawal requests from marketers
create table if not exists public.marketer_withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  marketer_id uuid not null references public.marketers (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'paid', 'rejected', 'cancelled')),
  user_count integer not null check (user_count > 0),
  rate_per_user numeric(12,2) not null check (rate_per_user > 0),
  amount numeric(12,2) not null check (amount > 0),
  bank_name text not null,
  bank_account_number text not null,
  bank_account_name text not null,
  notes text,
  rejection_reason text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_marketer_withdrawals_marketer
  on public.marketer_withdrawal_requests (marketer_id, created_at desc);

create index if not exists idx_marketer_withdrawals_status
  on public.marketer_withdrawal_requests (status, created_at desc);

drop trigger if exists set_marketer_withdrawal_requests_updated_at on public.marketer_withdrawal_requests;
create trigger set_marketer_withdrawal_requests_updated_at
before update on public.marketer_withdrawal_requests
for each row
execute function public.update_updated_at_column();

-- Users included in a withdrawal (prevents double-paying the same activation)
create table if not exists public.marketer_withdrawal_items (
  id uuid primary key default gen_random_uuid(),
  withdrawal_id uuid not null references public.marketer_withdrawal_requests (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  unique (withdrawal_id, user_id)
);

create index if not exists idx_marketer_withdrawal_items_withdrawal
  on public.marketer_withdrawal_items (withdrawal_id);

create index if not exists idx_marketer_withdrawal_items_user
  on public.marketer_withdrawal_items (user_id);

-- Enforce: user_id not already in a pending/approved/paid withdrawal
create or replace function public.enforce_marketer_withdrawal_item_unique()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.marketer_withdrawal_items i
    join public.marketer_withdrawal_requests r on r.id = i.withdrawal_id
    where i.user_id = new.user_id
      and r.status in ('pending', 'approved', 'paid')
      and i.withdrawal_id is distinct from new.withdrawal_id
  ) then
    raise exception 'User already included in an active marketer withdrawal';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_marketer_withdrawal_item_unique on public.marketer_withdrawal_items;
create trigger trg_enforce_marketer_withdrawal_item_unique
before insert on public.marketer_withdrawal_items
for each row
execute function public.enforce_marketer_withdrawal_item_unique();

alter table public.marketer_withdrawal_requests enable row level security;
alter table public.marketer_withdrawal_items enable row level security;

drop policy if exists marketer_withdrawals_admin_all on public.marketer_withdrawal_requests;
create policy marketer_withdrawals_admin_all
on public.marketer_withdrawal_requests
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists marketer_withdrawals_own_select on public.marketer_withdrawal_requests;
create policy marketer_withdrawals_own_select
on public.marketer_withdrawal_requests
for select
to authenticated
using (
  exists (
    select 1 from public.marketers m
    where m.id = marketer_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

drop policy if exists marketer_withdrawals_own_insert on public.marketer_withdrawal_requests;
create policy marketer_withdrawals_own_insert
on public.marketer_withdrawal_requests
for insert
to authenticated
with check (
  exists (
    select 1 from public.marketers m
    where m.id = marketer_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

drop policy if exists marketer_withdrawal_items_admin_all on public.marketer_withdrawal_items;
create policy marketer_withdrawal_items_admin_all
on public.marketer_withdrawal_items
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists marketer_withdrawal_items_own_select on public.marketer_withdrawal_items;
create policy marketer_withdrawal_items_own_select
on public.marketer_withdrawal_items
for select
to authenticated
using (
  exists (
    select 1
    from public.marketer_withdrawal_requests r
    join public.marketers m on m.id = r.marketer_id
    where r.id = withdrawal_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

commit;
