// POST /api/send-order-mail
//
// Called by checkout.html right after an order is saved to Supabase.
// Sends:
//   1. Order confirmation to the customer
//   2. New-order alert to the admin
//   3. A gift-voucher email for each voucher line item (to the customer)
//
// Body (JSON):
//   {
//     id, customer_name, customer_email, customer_phone, customer_city,
//     customer_address, delivery_method, payment_method, total,
//     items: [{ name, sub, sz, qty, price, type }]
//   }

import { randomBytes } from 'node:crypto';
import { sendMail, getAdminEmail } from './_mailer.js';
import {
  customerConfirmation,
  adminAlert,
  voucherDelivery
} from './_templates.js';

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function randomVoucherCode() {
  // e.g. KIN-7F3A-9C2E — crypto-random, no ambiguous chars (0/O, 1/I).
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = () =>
    Array.from(randomBytes(4), (b) => alphabet[b % alphabet.length]).join('');
  return `KIN-${block()}-${block()}`;
}

// Persist a voucher in Supabase so the emailed code is actually redeemable.
// Returns true on success; on failure we log and still email (best-effort),
// but the code won't be redeemable until issuance succeeds.
async function issueVoucher({ code, amount, orderId, recipientEmail }) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('SUPABASE_URL / SUPABASE_ANON_KEY not set — voucher not persisted');
    return false;
  }
  const res = await fetch(`${url}/rest/v1/rpc/issue_voucher`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      p_code: code,
      p_amount: amount,
      p_order_id: orderId && orderId !== 'N/A' ? orderId : null,
      p_recipient_email: recipientEmail || null
    })
  });
  if (!res.ok) {
    console.error('issue_voucher failed:', res.status, await res.text().catch(() => ''));
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let order = req.body;
  if (typeof order === 'string') {
    try {
      order = JSON.parse(order);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  if (!order || typeof order !== 'object') {
    return res.status(400).json({ error: 'Missing order payload' });
  }
  if (!isEmail(order.customer_email)) {
    return res.status(400).json({ error: 'Invalid customer_email' });
  }

  const items = Array.isArray(order.items) ? order.items.slice(0, 50) : [];
  const normalized = { ...order, items };

  const results = { customer: null, admin: null, vouchers: [] };
  const errors = [];

  // 1. Customer confirmation
  try {
    const { subject, html } = customerConfirmation(normalized);
    const r = await sendMail({ to: order.customer_email, subject, html });
    results.customer = r.id || 'sent';
  } catch (err) {
    console.error('customer confirmation failed:', err.message);
    errors.push('customer');
  }

  // 2. Admin alert
  try {
    const { subject, html } = adminAlert(normalized);
    const r = await sendMail({
      to: getAdminEmail(),
      subject,
      html,
      replyTo: order.customer_email
    });
    results.admin = r.id || 'sent';
  } catch (err) {
    console.error('admin alert failed:', err.message);
    errors.push('admin');
  }

  // 3. Vouchers: issue (persist) then email each code (one per qty)
  for (const item of items.filter((i) => i.type === 'voucher')) {
    const count = Math.min(Number(item.qty) || 1, 10);
    for (let i = 0; i < count; i++) {
      const code = randomVoucherCode();
      try {
        const issued = await issueVoucher({
          code,
          amount: item.price,
          orderId: order.id,
          recipientEmail: order.customer_email
        });
        if (!issued) errors.push('voucher-issue');

        const { subject, html } = voucherDelivery({
          code,
          amount: item.price,
          recipientName: item.recipientName,
          message: item.message
        });
        const r = await sendMail({ to: order.customer_email, subject, html });
        results.vouchers.push({ code, mail: r.id || 'sent', issued });
      } catch (err) {
        console.error('voucher email failed:', err.message);
        errors.push('voucher');
      }
    }
  }

  // The order is already saved; never fail the checkout because of email.
  // Report partial success so the client can log it.
  return res.status(200).json({ ok: errors.length === 0, results, errors });
}
