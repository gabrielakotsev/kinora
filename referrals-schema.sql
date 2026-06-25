-- Kinora: referral / influencer discount codes. Run in Supabase → SQL Editor. Idempotent.
--
-- A code gives a percentage off the products subtotal. Codes are NOT readable by the
-- anon key (so they can't be enumerated); validation/redemption go through RPCs that
-- expose only what the checkout needs.

-- 1. Table
create table if not exists public.referral_codes (
  code            text primary key,
  influencer_name text,
  percent         int not null check (percent between 1 and 100),
  active          boolean not null default true,
  expires_at      timestamptz,
  max_uses        int,
  uses            int not null default 0,
  total_sales     numeric not null default 0,
  created_at      timestamptz not null default now()
);

alter table public.referral_codes enable row level security;

-- Admins manage codes from the panel (mirror vouchers/products).
drop policy if exists "admins read referral_codes" on public.referral_codes;
create policy "admins read referral_codes" on public.referral_codes
  for select to authenticated using (public.is_admin());
drop policy if exists "admins insert referral_codes" on public.referral_codes;
create policy "admins insert referral_codes" on public.referral_codes
  for insert to authenticated with check (public.is_admin());
drop policy if exists "admins update referral_codes" on public.referral_codes;
create policy "admins update referral_codes" on public.referral_codes
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete referral_codes" on public.referral_codes;
create policy "admins delete referral_codes" on public.referral_codes
  for delete to authenticated using (public.is_admin());

-- No direct anon access. Public interaction only through the RPCs below.
revoke all on table public.referral_codes from anon;

-- 2. check_referral(): validate a code, return only the percent (or valid=false).
create or replace function public.check_referral(p_code text)
returns table (percent int, valid boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select r.percent, true
  from public.referral_codes r
  where r.code = upper(trim(p_code))
    and r.active = true
    and (r.expires_at is null or r.expires_at > now())
    and (r.max_uses is null or r.uses < r.max_uses);
  if not found then
    return query select 0, false;
  end if;
end;
$$;
revoke all on function public.check_referral(text) from public;
grant execute on function public.check_referral(text) to anon, authenticated;

-- 3. redeem_referral(): atomically count a use + add to total_sales. Re-checks validity
--    under a row lock so concurrent orders cannot exceed max_uses.
create or replace function public.redeem_referral(p_code text, p_order_total numeric)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare r public.referral_codes%rowtype;
begin
  select * into r from public.referral_codes
  where code = upper(trim(p_code)) for update;
  if not found then return false; end if;
  if not r.active then return false; end if;
  if r.expires_at is not null and r.expires_at <= now() then return false; end if;
  if r.max_uses is not null and r.uses >= r.max_uses then return false; end if;

  update public.referral_codes
  set uses = uses + 1,
      total_sales = total_sales + coalesce(p_order_total, 0)
  where code = r.code;
  return true;
end;
$$;
revoke all on function public.redeem_referral(text, numeric) from public;
grant execute on function public.redeem_referral(text, numeric) to anon, authenticated;

-- 4. Order linkage: record which referral code was used + the discount amount.
alter table public.orders add column if not exists referral_code     text;
alter table public.orders add column if not exists referral_discount numeric;

-- 5. create_order overload with referral params (the old signature stays intact).
create or replace function public.create_order(
  p_customer_name         text,
  p_customer_email        text,
  p_customer_phone        text,
  p_customer_city         text,
  p_customer_address      text,
  p_delivery_method       text,
  p_payment_method        text,
  p_items                 text,
  p_total                 numeric,
  p_status                text,
  p_stripe_payment_method text,
  p_referral_code         text,
  p_referral_discount     numeric
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare new_id uuid;
begin
  insert into public.orders (
    customer_name, customer_email, customer_phone, customer_city, customer_address,
    delivery_method, payment_method, items, total, status, stripe_payment_method,
    referral_code, referral_discount
  ) values (
    p_customer_name, p_customer_email, p_customer_phone, p_customer_city, p_customer_address,
    p_delivery_method, p_payment_method, p_items, p_total, p_status, p_stripe_payment_method,
    nullif(upper(trim(coalesce(p_referral_code,''))), ''), p_referral_discount
  ) returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.create_order(
  text, text, text, text, text, text, text, text, numeric, text, text, text, numeric
) from public;
grant execute on function public.create_order(
  text, text, text, text, text, text, text, text, numeric, text, text, text, numeric
) to anon, authenticated;
