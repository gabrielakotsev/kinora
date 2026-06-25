-- Kinora: expose SOLD product ids to the public storefront WITHOUT leaking orders.
-- Run this in Supabase → SQL Editor → New query → Run. Safe to re-run.
--
-- Why a function: the anon key cannot (and must not) read public.orders — that
-- table holds customer PII. This security-definer function returns ONLY the set
-- of product ids that appear in non-cancelled orders, nothing else.

-- An item counts as sold when:
--   * it's in a CONFIRMED order (paid/shipped/completed) — counts forever, OR
--   * it's in an UNPAID order (pending COD / awaiting_payment card) created in the
--     last hour — a short reservation so two buyers can't grab the same 1/1 during
--     checkout. Abandoned unpaid orders stop counting automatically after 1 hour.
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
      and (
        o.status in ('paid','shipped','completed')
        or (o.status in ('pending','awaiting_payment') and o.created_at > now() - interval '1 hour')
      )
  ) s
  where pid is not null;
$$;

revoke all on function public.sold_product_ids() from public;
grant execute on function public.sold_product_ids() to anon, authenticated;
