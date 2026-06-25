// Shared Mailgun helper for Kinora serverless functions.
//
// Uses the Mailgun Messages API directly over fetch (no SDK needed on Node 18+).
// All secrets come from Vercel environment variables — never hardcode them.
//
//   MAILGUN_API_KEY   private API key (starts with "key-" or similar)
//   MAILGUN_DOMAIN    sending domain, e.g. "mg.kinorabg.com"
//   MAILGUN_REGION    "eu" (default) or "us"
//   MAIL_FROM         default From header, e.g. "Kinora <hello@kinorabg.com>"
//   ADMIN_EMAIL       where new-order alerts go, e.g. "hello@kinorabg.com"

const REGION_HOSTS = {
  eu: 'https://api.eu.mailgun.net',
  us: 'https://api.mailgun.net'
};

function getConfig() {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey) throw new Error('MAILGUN_API_KEY is not configured');
  if (!domain) throw new Error('MAILGUN_DOMAIN is not configured');

  const region = (process.env.MAILGUN_REGION || 'eu').toLowerCase();
  const host = REGION_HOSTS[region] || REGION_HOSTS.eu;

  return {
    apiKey,
    domain,
    host,
    from: process.env.MAIL_FROM || `Kinora <hello@${domain}>`,
    adminEmail: process.env.ADMIN_EMAIL || `hello@${domain}`
  };
}

/**
 * Send a single email through Mailgun.
 * @param {{to:string,subject:string,html:string,text?:string,from?:string,replyTo?:string}} msg
 * @returns {Promise<{id:string,message:string}>}
 */
export async function sendMail(msg) {
  const { to, subject, html } = msg;
  if (!to || !subject || !html) {
    throw new Error('sendMail requires "to", "subject" and "html"');
  }

  const cfg = getConfig();

  const form = new URLSearchParams();
  form.set('from', msg.from || cfg.from);
  form.set('to', to);
  form.set('subject', subject);
  form.set('html', html);
  form.set('text', msg.text || htmlToText(html));
  if (msg.replyTo) form.set('h:Reply-To', msg.replyTo);

  const auth = Buffer.from(`api:${cfg.apiKey}`).toString('base64');

  const res = await fetch(`${cfg.host}/v3/${cfg.domain}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form.toString()
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Mailgun ${res.status}: ${body}`);
  }
  return res.json();
}

export function getAdminEmail() {
  return getConfig().adminEmail;
}

// Very small HTML→text fallback so emails always have a plain-text part.
function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
