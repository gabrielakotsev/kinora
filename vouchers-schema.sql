-- Kinora: gift vouchers — storage, issuance and redemption.
-- Run in Supabase → SQL Editor → New query → Run. Safe to re-run.
--
-- Security model mirrors orders-schema.sql:
--   * The anon (public) key NEVER reads the vouchers table directly
--     (that would let anyone enumerate codes and balances).
--   * Issuing and redeeming happen through security-definer RPCs that
--     return only what the caller is allowed to know.

-- 1. The vouchers table.
create table if not exists public.vouchers (
  code            text primary key,                 -- e.g. KIN-7F3A-9C2E
  created_at      timestamptz not null default now(),
  original_amount numeric not null check (original_amount > 0),
  balance         numeric not null check (balance >= 0),
  currency        text not null default 'EUR',
  order_id        uuid,                              -- the order that purchased it
  recipient_email text,
  status          text not null default 'active',    -- active | depleted | void
  last_used_at    timestamptz
);

alter table public.vouchers enable row level security;

-- Admins (from orders-schema.sql admins table) may read vouchers in the dashboard.
drop policy if exists "admins read vouchers" on public.vouchers;
create policy "admins read vouchers" on public.vouchers
  for select to authenticated using (public.is_admin());

-- No direct anon access. All public interaction goes through the RPCs below.
revoke all on table public.vouchers from anon;

-- 2. issue_voucher(): create a voucher and return its code.
--    Called by the /api/send-order-mail function (server-side) after an order
--    is saved, so the emailed code matches a real, redeemable record.
create or replace function public.issue_voucher(
  p_code            text,
  p_amount          numeric,
  p_order_id        uuid,
  p_recipient_email text
) returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'voucher amount must be positive';
  end if;

  insert into public.vouchers (code, original_amount, balance, order_id, recipient_email)
  values (p_code, p_amount, p_amount, p_order_id, p_recipient_email);

  return p_code;
end;
$$;

revoke all on function public.issue_voucher(text, numeric, uuid, text) from public;
grant execute on function public.issue_voucher(text, numeric, uuid, text) to anon;

-- 3. check_voucher(): read-only lookup used by checkout to show the available
--    balance WITHOUT exposing the whole table. Returns 0 / 'invalid' for unknown
--    or unusable codes so the client cannot tell "wrong" from "depleted".
create or replace function public.check_voucher(p_code text)
returns table (balance numeric, currency text, status text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select v.balance, v.currency, v.status
  from public.vouchers v
  where v.code = upper(trim(p_code)) and v.status = 'active';

  if not found then
    return query select 0::numeric, 'EUR'::text, 'invalid'::text;
  end if;
end;
$$;

revoke all on function public.check_voucher(text) from public;
grant execute on function public.check_voucher(text) to anon;

-- 4. redeem_voucher(): atomically apply up to p_requested of a voucher's balance.
--    Returns the amount actually applied and the remaining balance.
--    Row is locked (for update) so concurrent checkouts cannot double-spend.
create or replace function public.redeem_voucher(
  p_code      text,
  p_requested numeric,
  p_order_id  uuid default null
) returns table (applied numeric, remaining numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance numeric;
  v_apply   numeric;
begin
  if p_requested is null or p_requested <= 0 then
    raise exception 'requested amount must be positive';
  end if;

  select balance into v_balance
  from public.vouchers
  where code = upper(trim(p_code)) and status = 'active'
  for update;

  if not found then
    raise exception 'voucher not found or not active';
  end if;

  v_apply := least(v_balance, p_requested);

  update public.vouchers
  set balance      = balance - v_apply,
      status       = case when balance - v_apply <= 0 then 'depleted' else 'active' end,
      last_used_at = now()
  where code = upper(trim(p_code));

  return query select v_apply, (v_balance - v_apply);
end;
$$;

revoke all on function public.redeem_voucher(text, numeric, uuid) from public;
grant execute on function public.redeem_voucher(text, numeric, uuid) to anon;
