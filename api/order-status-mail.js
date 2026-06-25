// POST /api/order-status-mail
//
// Sends a status-update email to the customer when an admin marks an order
// Shipped (with optional tracking number) or Cancelled.
//
// Body (JSON): { type: 'shipped'|'cancelled', order: {...}, tracking? }
//
// Best-effort: the order's status was already changed in Supabase by the admin
// panel; this endpoint only sends mail and never affects that.

import { sendMail } from './_mailer.js';
import { orderShipped, orderCancelled } from './_templates.js';

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const type = body?.type;
  const order = body?.order;
  const tracking = typeof body?.tracking === 'string' ? body.tracking.slice(0, 120).trim() : '';

  if (type !== 'shipped' && type !== 'cancelled') {
    return res.status(400).json({ error: 'Invalid type' });
  }
  if (!order || !isEmail(order.customer_email)) {
    return res.status(400).json({ error: 'Invalid order / customer_email' });
  }

  // Normalise items (may arrive as a JSON string from the DB row).
  let items = order.items;
  if (typeof items === 'string') {
    try { items = JSON.parse(items); } catch { items = []; }
  }
  const normalized = { ...order, items: Array.isArray(items) ? items : [] };

  try {
    const { subject, html } =
      type === 'shipped' ? orderShipped(normalized, tracking) : orderCancelled(normalized);
    await sendMail({ to: order.customer_email, subject, html });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('order-status-mail failed:', err.message);
    return res.status(502).json({ error: 'Could not send email' });
  }
}
