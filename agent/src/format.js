// Single-quote a JS string the way the existing PRODUCTS rows are written,
// escaping backslashes and single quotes only.
function q(str) {
  return `'${String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function arr(items) {
  return `[${items.map(q).join(',')}]`
}

/**
 * Render a validated product as a one-line PRODUCTS object string, matching the
 * field order and quoting of the existing rows in index.html so it pastes 1:1.
 * `img` is always '' (no photo wired in yet); `id` is the provided value or a
 * marker the owner must replace.
 */
export function formatProduct(product, { id } = {}) {
  const idField = id != null ? String(id) : '/* set id */'

  return (
    `{id:${idField},type:${q(product.type)},lbl:${q(product.lbl)},` +
    `cat:${q(product.cat)},name:${q(product.name)},sub:${q(product.sub)},` +
    `price:${product.price},colors:${arr(product.colors)},` +
    `desc:${q(product.desc)},sizes:${arr(product.sizes)},` +
    `details:${arr(product.details)},bg:${q(product.bg)},` +
    `acc:${q(product.acc)},img:''},`
  )
}
