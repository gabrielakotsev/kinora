-- Kinora: orders table + access control.
-- Run this in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: uses "if not exists" / "create or replace" / "drop policy if exists".

-- 1. The table used by checkout.html (write) and admin.html (read/update).
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  customer_name         text,
  customer_email        text,
  customer_phone        text,
  customer_city         text,
  customer_address      text,
  delivery_method       text,        -- econt_office | econt_address | speedy_office | speedy_address
  payment_method        text,        -- cod | card
  items                 text,        -- JSON string of cart items
  total                 numeric,
  status                text default 'pending',  -- pending | awaiting_payment | paid | shipped ...
  stripe_payment_method text
);

alter table public.orders enable row level security;

-- 2. Allowlist of admin emails. ONLY emails in this table can read/update orders,
--    even if someone else manages to sign up. >>> PUT YOUR ADMIN EMAIL HERE <<<
create table if not exists public.admins (
  email text primary key
);
insert into public.admins (email) values ('admin@kinorabg.com')
  on conflict (email) do nothing;

alter table public.admins enable row level security;  -- no policies = not readable by users directly

-- 3. is_admin(): true when the signed-in user's email is in the allowlist.
--    security definer lets it read public.admins past that table's RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins where email = (auth.jwt() ->> 'email')
  );
$$;
grant execute on function public.is_admin() to authenticated;

-- 4. The public storefront uses the anon (public) key. It must NOT read orders
--    (that would expose every customer's name, email, phone and address).
revoke all on table public.orders from anon;
grant select, update on table public.orders to authenticated;

drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5. Checkout creates orders through this function instead of inserting directly.
--    security definer => the anon key can create an order and get its id back
--    WITHOUT any read access to the orders table.
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
  p_stripe_payment_method text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  v_items jsonb;
  it jsonb;
  v_real_price numeric;
  v_claimed_subtotal numeric := 0;  -- sum of item prices the client sent
  v_real_subtotal numeric := 0;     -- sum recomputed from the products table
begin
  -- SECURITY: never trust client-sent item prices. Recompute each physical
  -- product's price from the catalog; if the client undercharged any item,
  -- reject the order. Vouchers (string id, type='voucher') are skipped — they
  -- have their own server-side balance checks (check_voucher/redeem_voucher).
  begin
    v_items := p_items::jsonb;
  exception when others then
    raise exception 'invalid items payload';
  end;

  if jsonb_typeof(v_items) = 'array' then
    for it in select * from jsonb_array_elements(v_items) loop
      if coalesce(it->>'type','') = 'voucher' then
        continue;  -- voucher line: validated elsewhere
      end if;
      -- physical product: id must reference an active product
      select price into v_real_price
        from public.products
        where id = (it->>'id')::int and is_active = true;
      if v_real_price is null then
        raise exception 'unknown or inactive product in order: %', it->>'id';
      end if;
      v_real_subtotal   := v_real_subtotal   + v_real_price * coalesce((it->>'qty')::numeric, 1);
      v_claimed_subtotal := v_claimed_subtotal + coalesce((it->>'price')::numeric,0) * coalesce((it->>'qty')::numeric, 1);
    end loop;

    -- Reject if the client claimed cheaper prices than the real catalog
    -- (1 cent tolerance for float rounding). Overpaying is allowed.
    if v_claimed_subtotal < v_real_subtotal - 0.01 then
      raise exception 'order total mismatch: claimed % < real %', v_claimed_subtotal, v_real_subtotal;
    end if;
  end if;

  insert into public.orders (
    customer_name, customer_email, customer_phone, customer_city, customer_address,
    delivery_method, payment_method, items, total, status, stripe_payment_method
  ) values (
    p_customer_name, p_customer_email, p_customer_phone, p_customer_city, p_customer_address,
    p_delivery_method, p_payment_method, p_items, p_total, p_status, p_stripe_payment_method
  ) returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.create_order(
  text, text, text, text, text, text, text, text, numeric, text, text
) from public;
grant execute on function public.create_order(
  text, text, text, text, text, text, text, text, numeric, text, text
) to anon;
