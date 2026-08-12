begin;

-- Switch withdrawal gate from min users → min amount (NGN 5000 default)
insert into public.platform_settings (key, value)
values ('marketer_withdrawal_min_amount', '5000'::jsonb)
on conflict (key) do nothing;

-- Prefer amount-based setting going forward
delete from public.platform_settings
where key = 'marketer_withdrawal_min_users';

commit;
