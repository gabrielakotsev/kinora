# Kinora Email API (Mailgun)

Serverless functions that send transactional email via **Mailgun**. They run on
Vercel alongside the static storefront — the Mailgun private key stays server-side
and is never exposed to the browser.

## Endpoints

| Route                  | Method | Purpose                                                        |
| ---------------------- | ------ | -------------------------------------------------------------- |
| `/api/send-order-mail` | POST   | Customer confirmation + admin alert + a voucher email per voucher item |
| `/api/contact`         | POST   | Generic contact / enquiry → admin inbox (Reply-To = visitor)   |

Shared code: `_mailer.js` (Mailgun transport) and `_templates.js` (HTML emails).
Files prefixed with `_` are helpers, not routes.

## Required environment variables

Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable          | Required | Example                          | Notes                                   |
| ----------------- | -------- | -------------------------------- | --------------------------------------- |
| `MAILGUN_API_KEY` | yes      | `key-xxxxxxxx…`                  | Mailgun **private** API key. Keep secret. |
| `MAILGUN_DOMAIN`  | yes      | `mg.kinorabg.com`                | Verified sending domain in Mailgun.     |
| `MAILGUN_REGION`  | no       | `eu`                             | `eu` (default) or `us`. Match your Mailgun account region. |
| `MAIL_FROM`       | no       | `Kinora <hello@kinorabg.com>`    | Default From header.                    |
| `ADMIN_EMAIL`     | no       | `hello@kinorabg.com`             | Where new-order alerts & contact messages go. |
| `SUPABASE_URL`    | vouchers | `https://xxxx.supabase.co`       | Needed so purchased vouchers are persisted (redeemable). |
| `SUPABASE_ANON_KEY` | vouchers | `eyJhbGci…`                    | Anon key; used to call the `issue_voucher` RPC. |

> Voucher persistence: run `vouchers-schema.sql` in Supabase first. Without
> `SUPABASE_URL` / `SUPABASE_ANON_KEY`, voucher **emails** still send but the codes
> won't be redeemable (the function logs a warning).

## Mailgun setup

1. Create/verify a sending domain in Mailgun (e.g. `mg.kinorabg.com`) and add the
   DNS records it gives you (SPF, DKIM, MX, tracking CNAME).
2. Copy the **private API key** from Mailgun → Settings → API Keys.
3. Note your account **region** (EU accounts use `api.eu.mailgun.net`).
4. Add the env vars above in Vercel and redeploy.

## Local testing

```bash
vercel dev        # serves the static site + /api functions
# then POST to http://localhost:3000/api/contact
```

Without `MAILGUN_API_KEY`/`MAILGUN_DOMAIN` the functions return a clear error and
send nothing — checkout still completes (order email is best-effort).
