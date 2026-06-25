-- Kinora: admin feature additions. Run in Supabase → SQL Editor. Safe to re-run.

-- 1. Order: tracking number (shipped) + cancellation reason.
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists cancel_reason   text;

-- 2. void_voucher(): admins mark a voucher void so it can't be redeemed.
create or replace function public.void_voucher(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  update public.vouchers set status = 'void' where code = upper(trim(p_code));
  if not found then
    raise exception 'voucher not found';
  end if;
  return p_code;
end;
$$;
revoke all on function public.void_voucher(text) from public;
grant execute on function public.void_voucher(text) to authenticated;

-- 3. Allow admins to issue a voucher directly from the panel.
--    (issue_voucher already exists, granted to anon; ensure authenticated too.)
grant execute on function public.issue_voucher(text, numeric, uuid, text) to authenticated;
