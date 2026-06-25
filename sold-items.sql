-- Kinora: expose SOLD product ids to the public storefront WITHOUT leaking orders.
-- Run this in Supabase → SQL Editor → New query → Run. Safe to re-run.
--
-- Why a function: the anon key cannot (and must not) read public.orders — that
-- table holds customer PII. This security-definer function returns ONLY the set
-- of product ids that appear in non-cancelled orders, nothing else.

-- An item counts as sold as soon as it appears in ANY order that is not cancelled.
-- COD/card orders mark the 1/1 item sold immediately and KEEP it sold. If a buyer
-- never pays (e.g. refuses the COD parcel), set that order's status to 'cancelled'
-- in the admin panel to return the item to stock.
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
    where (item ->> 'id') ~ '^[0-9]+$'   -- skip voucher ids like "voucher-50"
      and coalesce(o.status, '') <> 'cancelled'
  ) s
  where pid is not null;
$$;

revoke all on function public.sold_product_ids() from public;
grant execute on function public.sold_product_ids() to anon, authenticated;
