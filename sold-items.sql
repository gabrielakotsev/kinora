-- Kinora: expose SOLD product ids to the public storefront WITHOUT leaking orders.
-- Run this in Supabase → SQL Editor → New query → Run. Safe to re-run.
--
-- Why a function: the anon key cannot (and must not) read public.orders — that
-- table holds customer PII. This security-definer function returns ONLY the set
-- of product ids that appear in non-cancelled orders, nothing else.

create or replace function public.sold_product_ids()
returns integer[]
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(array_agg(distinct pid), '{}')
  from (
    select (item ->> 'id')::int as pid
    from public.orders o,
         lateral jsonb_array_elements(o.items::jsonb) as item
    where o.status in ('paid','shipped','completed','awaiting_payment','pending')
      and (item ->> 'id') ~ '^[0-9]+$'   -- skip voucher ids like "voucher-50"
  ) s
  where pid is not null;
$$;

revoke all on function public.sold_product_ids() from public;
grant execute on function public.sold_product_ids() to anon, authenticated;
