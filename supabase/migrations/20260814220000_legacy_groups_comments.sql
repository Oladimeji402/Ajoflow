-- Document groups as legacy (individual savings only).
-- Tables kept for historical FKs on contributions / payouts / payment_records / passbook_entries.
-- App APIs for groups have been removed; RLS already admin-only SELECT.

comment on table public.groups is
  'LEGACY: group rotating savings retired. Kept for historical foreign keys only. Do not create new groups.';

comment on table public.group_members is
  'LEGACY: group membership retired with group savings. Kept for historical foreign keys only.';
