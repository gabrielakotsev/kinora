// POST /api/send-voucher-mail
//
// Emails a gift-voucher code to a recipient. Used by the admin panel when an
// admin issues a voucher manually and opts to email it. The voucher itself is
// already persisted via the issue_voucher RPC; this only sends the email.
//
// Body (JSON): { code, amount, recipientEmail, recipientName?, message? }

import { sendMail } from './_mailer.js';
import { voucherDelivery } from './_templates.js';

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON body' }); }
  }

  const code = typeof body?.code === 'string' ? body.code.slice(0, 40) : '';
  const amount = Number(body?.amount);
  const to = body?.recipientEmail;

  if (!code) return res.status(400).json({ error: 'Missing code' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  if (!isEmail(to)) return res.status(400).json({ error: 'Invalid recipientEmail' });

  try {
    const { subject, html } = voucherDelivery({
      code,
      amount,
      recipientName: typeof body?.recipientName === 'string' ? body.recipientName.slice(0, 120) : '',
      message: typeof body?.message === 'string' ? body.message.slice(0, 1000) : ''
    });
    await sendMail({ to, subject, html });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-voucher-mail failed:', err.message);
    return res.status(502).json({ error: 'Could not send email' });
  }
}
