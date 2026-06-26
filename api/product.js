// GET /product/:id  →  rewritten to  /api/product?id=:id
//
// Server-renders a single product page with real per-product SEO meta tags
// (title, description, Open Graph, canonical) injected into the static
// product.html template, so crawlers and social unfurls see real content.
// The interactive parts (size selector, add-to-cart, modal) hydrate
// client-side via app.js, which re-fetches the full catalogue.
//
// Supabase is queried with the public anon key — the same key already
// embedded in app.js for the browser, so it is safe to use here too.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SUPABASE_URL = 'https://owkoprksrvjlebonaehj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93a29wcmtzcnZqbGVib25hZWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTIxNzgsImV4cCI6MjA5NjIyODE3OH0.UZdyvXOmEJTZ6r54fSlVgNNBja98qx-dpJqu9yGNlFA';

const SITE_URL = 'https://kinorabg.com';
const FALLBACK_DESC = 'Автентични японски хаори и кимона от KINORA — ръчно изтъкани в Киото. Доставка в цяла България.';

// Escape values before injecting into HTML attributes / text.
const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Collapse whitespace and clamp a description to a sane meta length.
const metaText = (s, n = 200) =>
  String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);

function readTemplate() {
  return readFileSync(join(process.cwd(), 'product.html'), 'utf8');
}

async function fetchProduct(id) {
  const url =
    `${SUPABASE_URL}/rest/v1/products` +
    `?id=eq.${id}&is_active=eq.true` +
    `&select=name,sub,description,price,img,type&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error('supabase fetch failed: ' + res.status);
  const rows = await res.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

// Replace the meta-tag tokens in product.html with real per-product values.
function injectMeta(html, { title, desc, url, img }) {
  const imageTag = img
    ? `<meta property="og:image" content="${esc(img)}"/>\n<meta name="twitter:card" content="summary_large_image"/>`
    : '';
  return html
    .replaceAll('__OG_TITLE__', esc(title))
    .replaceAll('__OG_DESC__', esc(desc))
    .replaceAll('__OG_URL__', esc(url))
    .replace('<!--__OG_IMAGE__-->', imageTag);
}

export default async function handler(req, res) {
  const rawId = req.query?.id;
  const id = Number.parseInt(rawId, 10);

  let html = readTemplate();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // Invalid id → serve template with generic meta. The page still works
  // client-side (renderProductPage shows a graceful "not found").
  if (!Number.isInteger(id) || id <= 0) {
    res.setHeader('Cache-Control', 's-maxage=60');
    return res.status(200).send(
      injectMeta(html, {
        title: 'KINORA — Продукт',
        desc: FALLBACK_DESC,
        url: `${SITE_URL}/product/${esc(rawId || '')}`,
        img: ''
      })
    );
  }

  const url = `${SITE_URL}/product/${id}`;

  let product = null;
  try {
    product = await fetchProduct(id);
  } catch (err) {
    console.error('product fetch failed:', err.message);
    // Fall through with generic meta; client will retry the catalogue.
  }

  if (!product) {
    res.setHeader('Cache-Control', 's-maxage=60');
    return res.status(200).send(
      injectMeta(html, {
        title: 'KINORA — Продукт',
        desc: FALLBACK_DESC,
        url,
        img: ''
      })
    );
  }

  const title = `KINORA — ${product.name}${product.sub ? ' · ' + product.sub : ''}`;
  const desc = metaText(product.description) || FALLBACK_DESC;

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(
    injectMeta(html, { title, desc, url, img: product.img || '' })
  );
}
