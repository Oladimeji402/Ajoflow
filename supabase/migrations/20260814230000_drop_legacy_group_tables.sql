-- Intentionally NOT dropping groups / group_members / contributions / payouts.
-- Those tables are empty for product use (individual savings only) but still have
-- RLS helpers (e.g. is_group_member) and historical FK columns on payment_records /
-- passbook_entries. Dropping them is higher risk than benefit while unused.
--
-- App routes for group savings remain retired (410 / empty). Keep tables for now.

select 1;
