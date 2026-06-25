// POST /api/contact
//
// Generic contact / enquiry endpoint. Sends the message to the admin inbox
// with the visitor's address as Reply-To so replies go straight to them.
//
// Body (JSON): { name, email, message, topic? }

import { sendMail, getAdminEmail } from './_mailer.js';
import { contactMessage } from './_templates.js';

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const clamp = (s, n) => String(s == null ? '' : s).slice(0, n).trim();

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

  const name = clamp(body?.name, 120);
  const email = clamp(body?.email, 200);
  const topic = clamp(body?.topic, 80);
  const message = clamp(body?.message, 5000);

  if (!isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const { subject, html } = contactMessage({ name, email, topic, message });
    await sendMail({ to: getAdminEmail(), subject, html, replyTo: email });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact send failed:', err.message);
    return res.status(502).json({ error: 'Could not send message' });
  }
}
