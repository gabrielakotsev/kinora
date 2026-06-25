// HTML email templates for Kinora. Inline styles only (email clients ignore <style>).
// All copy is in Bulgarian to match the storefront.

const COLORS = {
  navy: '#3a0814',
  navy2: '#4a0c1a',
  cream: '#e4d8c0',
  gold: '#c4a464',
  line: 'rgba(228,216,192,0.12)',
  muted: 'rgba(228,216,192,0.55)'
};

const eur = (n) => `${Number(n || 0).toLocaleString('bg-BG')} €`;

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemRows(items) {
  return items
    .map((it) => {
      const meta =
        it.type === 'voucher'
          ? `${esc(it.sub || '')} · Дигитален`
          : `${esc(it.sub || '')}${it.sz ? ` · Размер ${esc(it.sz)}` : ''}`;
      return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${COLORS.line};color:${COLORS.cream};font-size:14px">
          ${esc(it.name)}<br>
          <span style="color:${COLORS.muted};font-size:12px">${meta} · Бр. ${esc(it.qty || 1)}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid ${COLORS.line};color:${COLORS.cream};font-size:14px;text-align:right;white-space:nowrap">
          ${eur((it.price || 0) * (it.qty || 1))}
        </td>
      </tr>`;
    })
    .join('');
}

function shell(innerHtml) {
  return `
  <div style="margin:0;padding:0;background:#2a0610">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#2a0610;padding:32px 0">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.navy};border:1px solid ${COLORS.line}">
          <tr><td style="padding:36px 40px 24px;text-align:center;border-bottom:1px solid ${COLORS.line}">
            <div style="font-family:'Tenor Sans',Georgia,serif;font-size:26px;letter-spacing:.32em;color:${COLORS.cream}">KINORA</div>
            <div style="font-size:10px;letter-spacing:.3em;color:${COLORS.gold};text-transform:uppercase;margin-top:6px">Японски винтидж</div>
          </td></tr>
          <tr><td style="padding:36px 40px;font-family:Arial,Helvetica,sans-serif">
            ${innerHtml}
          </td></tr>
          <tr><td style="padding:24px 40px 36px;border-top:1px solid ${COLORS.line};text-align:center">
            <div style="color:${COLORS.muted};font-size:12px;line-height:1.7">
              Kinora · hello@kinorabg.com<br>
              Благодарим, че пазарувате при нас.
            </div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;
}

function summaryTable(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const deliveryLabels = {
    econt_office: 'Еконт офис',
    econt_address: 'Еконт до адрес',
    speedy_office: 'Спиди офис',
    speedy_address: 'Спиди до адрес'
  };
  const delivery = deliveryLabels[order.delivery_method] || order.delivery_method || '—';
  const payment = order.payment_method === 'cod' ? 'Наложен платеж' : 'Карта';

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px">
      ${itemRows(items)}
      <tr>
        <td style="padding:16px 0 4px;color:${COLORS.cream};font-size:16px;font-weight:bold">Общо</td>
        <td style="padding:16px 0 4px;color:${COLORS.gold};font-size:16px;font-weight:bold;text-align:right">${eur(order.total)}</td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:${COLORS.muted}">
      <tr><td style="padding:3px 0">Доставка</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(delivery)}</td></tr>
      <tr><td style="padding:3px 0">Плащане</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(payment)}</td></tr>
    </table>`;
}

// ── Customer order confirmation ───────────────────────────────────────────────
export function customerConfirmation(order) {
  const name = esc((order.customer_name || '').split(' ')[0] || 'клиент');
  const shortId = order.id ? String(order.id).slice(0, 8) : '';
  const subject = `Потвърждение на поръчка${shortId ? ` #${shortId}` : ''} — Kinora`;
  const html = shell(`
    <h1 style="font-family:'Tenor Sans',Georgia,serif;font-size:22px;color:${COLORS.cream};margin:0 0 12px;font-weight:normal">
      Благодарим, ${name}!
    </h1>
    <p style="color:${COLORS.muted};font-size:14px;line-height:1.7;margin:0 0 8px">
      Получихме Вашата поръчка${shortId ? ` <strong style="color:${COLORS.cream}">#${shortId}</strong>` : ''} и вече я обработваме.
      ${order.payment_method === 'cod' ? 'Ще платите при доставка.' : 'Плащането е прието.'}
    </p>
    ${summaryTable(order)}
  `);
  return { subject, html };
}

// ── Admin new-order alert ──────────────────────────────────────────────────────
export function adminAlert(order) {
  const shortId = order.id ? String(order.id).slice(0, 8) : '';
  const subject = `Нова поръчка${shortId ? ` #${shortId}` : ''} — ${eur(order.total)}`;
  const html = shell(`
    <h1 style="font-family:'Tenor Sans',Georgia,serif;font-size:22px;color:${COLORS.cream};margin:0 0 16px;font-weight:normal">
      Нова поръчка
    </h1>
    ${summaryTable(order)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;font-size:13px;color:${COLORS.muted}">
      <tr><td style="padding:3px 0">Клиент</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(order.customer_name)}</td></tr>
      <tr><td style="padding:3px 0">Имейл</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(order.customer_email)}</td></tr>
      <tr><td style="padding:3px 0">Телефон</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(order.customer_phone)}</td></tr>
      <tr><td style="padding:3px 0">Град</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(order.customer_city)}</td></tr>
      <tr><td style="padding:3px 0">Адрес</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(order.customer_address)}</td></tr>
    </table>
  `);
  return { subject, html };
}

// ── Order shipped ──────────────────────────────────────────────────────────────
export function orderShipped(order, tracking) {
  const name = esc((order.customer_name || '').split(' ')[0] || 'клиент');
  const shortId = order.id ? String(order.id).slice(0, 8) : '';
  const subject = `Поръчката е изпратена${shortId ? ` #${shortId}` : ''} — Kinora`;
  const courier = (order.delivery_method || '').startsWith('speedy') ? 'Спиди' : 'Еконт';
  const html = shell(`
    <h1 style="font-family:'Tenor Sans',Georgia,serif;font-size:22px;color:${COLORS.cream};margin:0 0 12px;font-weight:normal">
      Поръчката Ви е на път, ${name}!
    </h1>
    <p style="color:${COLORS.muted};font-size:14px;line-height:1.7;margin:0 0 16px">
      Изпратихме поръчката Ви${shortId ? ` <strong style="color:${COLORS.cream}">#${shortId}</strong>` : ''} чрез ${courier}.
    </p>
    ${tracking ? `
    <div style="border:1px solid ${COLORS.gold};padding:20px;text-align:center;margin:0 0 20px">
      <div style="color:${COLORS.muted};font-size:11px;letter-spacing:.25em;text-transform:uppercase">Номер за проследяване</div>
      <div style="color:${COLORS.cream};font-size:20px;letter-spacing:.12em;font-family:monospace;margin-top:8px">${esc(tracking)}</div>
    </div>` : ''}
    ${summaryTable(order)}
  `);
  return { subject, html };
}

// ── Order cancelled ──────────────────────────────────────────────────────────────
export function orderCancelled(order) {
  const name = esc((order.customer_name || '').split(' ')[0] || 'клиент');
  const shortId = order.id ? String(order.id).slice(0, 8) : '';
  const subject = `Поръчката е отказана${shortId ? ` #${shortId}` : ''} — Kinora`;
  const html = shell(`
    <h1 style="font-family:'Tenor Sans',Georgia,serif;font-size:22px;color:${COLORS.cream};margin:0 0 12px;font-weight:normal">
      Здравейте, ${name}
    </h1>
    <p style="color:${COLORS.muted};font-size:14px;line-height:1.7;margin:0 0 16px">
      Поръчката Ви${shortId ? ` <strong style="color:${COLORS.cream}">#${shortId}</strong>` : ''} беше отказана.
      ${order.cancel_reason ? `Причина: <span style="color:${COLORS.cream}">${esc(order.cancel_reason)}</span>.` : ''}
      Ако смятате, че това е грешка, или имате въпрос, пишете ни на hello@kinorabg.com.
    </p>
    ${summaryTable(order)}
  `);
  return { subject, html };
}

// ── Gift voucher delivery ──────────────────────────────────────────────────────
export function voucherDelivery({ code, amount, recipientName, message }) {
  const subject = `Вашият подаръчен ваучер Kinora — ${eur(amount)}`;
  const html = shell(`
    <h1 style="font-family:'Tenor Sans',Georgia,serif;font-size:22px;color:${COLORS.cream};margin:0 0 12px;font-weight:normal">
      Подаръчен ваучер
    </h1>
    ${recipientName ? `<p style="color:${COLORS.muted};font-size:14px;margin:0 0 12px">За: <strong style="color:${COLORS.cream}">${esc(recipientName)}</strong></p>` : ''}
    ${message ? `<p style="color:${COLORS.muted};font-size:14px;line-height:1.7;font-style:italic;margin:0 0 20px">„${esc(message)}“</p>` : ''}
    <div style="border:1px solid ${COLORS.gold};padding:28px;text-align:center;margin:8px 0 20px">
      <div style="color:${COLORS.muted};font-size:11px;letter-spacing:.25em;text-transform:uppercase">Стойност</div>
      <div style="color:${COLORS.gold};font-family:'Tenor Sans',Georgia,serif;font-size:34px;margin:8px 0 16px">${eur(amount)}</div>
      <div style="color:${COLORS.muted};font-size:11px;letter-spacing:.25em;text-transform:uppercase">Код</div>
      <div style="color:${COLORS.cream};font-size:22px;letter-spacing:.18em;font-family:monospace;margin-top:6px">${esc(code)}</div>
    </div>
    <p style="color:${COLORS.muted};font-size:13px;line-height:1.7;margin:0">
      Въведете кода при плащане на kinorabg.com. Ваучерът не изтича.
    </p>
  `);
  return { subject, html };
}

// ── Contact / general message (sent to admin) ─────────────────────────────────
export function contactMessage({ name, email, message, topic }) {
  const subject = `Запитване от сайта${topic ? ` · ${topic}` : ''} — ${name || email}`;
  const html = shell(`
    <h1 style="font-family:'Tenor Sans',Georgia,serif;font-size:22px;color:${COLORS.cream};margin:0 0 16px;font-weight:normal">
      Ново запитване
    </h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:${COLORS.muted};margin-bottom:16px">
      <tr><td style="padding:3px 0">Име</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(name)}</td></tr>
      <tr><td style="padding:3px 0">Имейл</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(email)}</td></tr>
      ${topic ? `<tr><td style="padding:3px 0">Тема</td><td style="padding:3px 0;text-align:right;color:${COLORS.cream}">${esc(topic)}</td></tr>` : ''}
    </table>
    <div style="background:${COLORS.navy2};border:1px solid ${COLORS.line};padding:18px;color:${COLORS.cream};font-size:14px;line-height:1.7;white-space:pre-wrap">${esc(message)}</div>
  `);
  return { subject, html };
}
