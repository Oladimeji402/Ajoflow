-- Must-fix security locks:
-- 1) Profiles: authenticated cannot UPDATE money/privilege columns
-- 2) Money RPCs: execute only for service_role
-- 3) payment_records: drop authenticated INSERT/UPDATE
-- 4) Groups: no open authenticated SELECT; join_group service_role only

begin;

-- ---------------------------------------------------------------------------
-- 1) Profiles column privileges
-- ---------------------------------------------------------------------------
revoke update on public.profiles from authenticated;

-- Safe self-edit columns only (settings UI). Money, role, VA, passbook, etc. stay revoked.
grant update (
  name,
  phone,
  avatar_url,
  nin,
  bvn,
  bank_account,
  bank_name,
  bank_account_name
) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Money RPCs → service_role only
-- ---------------------------------------------------------------------------
revoke execute on function public.credit_wallet_balance(uuid, numeric) from public, anon, authenticated;
grant execute on function public.credit_wallet_balance(uuid, numeric) to service_role;

revoke execute on function public.debit_wallet_balance(uuid, numeric) from public, anon, authenticated;
grant execute on function public.debit_wallet_balance(uuid, numeric) to service_role;

revoke execute on function public.finalize_wallet_funding(text, text, text, jsonb, text) from public, anon, authenticated;
grant execute on function public.finalize_wallet_funding(text, text, text, jsonb, text) to service_role;

revoke execute on function public.pay_individual_savings_from_wallet(uuid, uuid, bigint, text, integer, date, text, text)
  from public, anon, authenticated;
grant execute on function public.pay_individual_savings_from_wallet(uuid, uuid, bigint, text, integer, date, text, text)
  to service_role;

revoke execute on function public.pay_general_savings_from_wallet(uuid, uuid, bigint, text, text)
  from public, anon, authenticated;
grant execute on function public.pay_general_savings_from_wallet(uuid, uuid, bigint, text, text)
  to service_role;

revoke execute on function public.pay_bulk_from_wallet(uuid, bigint, text, jsonb, text)
  from public, anon, authenticated;
grant execute on function public.pay_bulk_from_wallet(uuid, bigint, text, jsonb, text)
  to service_role;

revoke execute on function public.activate_passbook_from_wallet(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.activate_passbook_from_wallet(uuid, text, text)
  to service_role;

-- ---------------------------------------------------------------------------
-- 3) payment_records: no authenticated write
-- ---------------------------------------------------------------------------
drop policy if exists payment_records_insert_own_or_admin on public.payment_records;
drop policy if exists payment_records_update_own_or_admin on public.payment_records;

-- ---------------------------------------------------------------------------
-- 4) Groups leftover lock + join_group
-- ---------------------------------------------------------------------------
drop policy if exists groups_select_authenticated on public.groups;
drop policy if exists groups_select_admin_only on public.groups;
create policy groups_select_admin_only
on public.groups
for select
to authenticated
using (public.is_admin(auth.uid()));

revoke execute on function public.join_group(uuid, uuid) from public, anon, authenticated;
grant execute on function public.join_group(uuid, uuid) to service_role;

commit;
