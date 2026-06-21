# Kinora Agent

Turns **photos of a haori/kimono** into a **ready-to-paste `PRODUCTS` object**
for `index.html` — a generated Bulgarian name, a EUR price, a description, spec
details, and matching palette colours, in the established Kinora house voice.
It prices by learning from your existing catalog.

Two ways to use it, same engine underneath:

- **Web page** (`npm run web`) — drag-drop photos, see the styled card preview
  next to the copy-paste object. Recommended.
- **CLI** (`node src/cli.js`) — prints the object to your terminal.

This folder is self-contained and is **not** part of the static site or the
Vercel build. It runs on your machine; your API key never leaves it.

## Setup

```sh
cd agent
npm install
export ANTHROPIC_API_KEY=sk-ant-...
```

## Web page (recommended)

```sh
npm run web
```

Then open **http://127.0.0.1:4317** in your browser. Drag in photos of one
garment, optionally pick the type, and click **Генерирай**. You get:

- a **styled preview card** (the real site's SVG, fonts and palette) so you can
  see how the item will look,
- the **pricing rationale** (a sanity-check),
- the **`PRODUCTS` object** with a one-click **Копирай** button.

Copy the object, paste it into the `PRODUCTS` array in `index.html`, replace
`/* set id */` with a unique number, and add an `img` path when you have a photo
hosted. The server binds to `127.0.0.1` only — it is not reachable from other
machines. Override the port with `PORT=5000 npm run web`. Press Ctrl+C to stop.

## CLI

```sh
node src/cli.js <photo...> [--type haori|kimono] [--id N] [--explain]
```

- `<photo...>` — one or more images of a **single** garment (jpg/png/webp/gif,
  ≤5MB each). Pass front + back if you have them.
- `--type` — optional hint (`haori` or `kimono`); inferred from the photos if
  omitted.
- `--id` — numeric `PRODUCTS` id to embed; if omitted the output uses a
  `/* set id */` marker for you to fill in.
- `--explain` — print the pricing rationale to stdout too (default: stderr, so
  piping stdout gives you a clean object).

### Example

```sh
node src/cli.js ./haori-front.jpg ./haori-back.jpg --type haori --id 9
```

**stdout** (paste into the `PRODUCTS` array in `index.html`):

```js
{id:9,type:'haori',lbl:'Ново',cat:'Хаори яке',name:'…',sub:'Хаори',price:280,colors:['#…','#…','#…'],desc:'…',sizes:['Универсален (XS–XL)'],details:['…','…','…'],bg:'#…',acc:'#…',img:''},
```

**stderr** (a sanity-check, not pasted):

```
price: 280 € — anchored on ГОРСКИ ДУХ (760 €) but simpler weave, no metallic…
```

## Tuning pricing and voice

Everything the model learns from lives in `reference/` — **edit these, no code
change needed**:

- `reference/examples.json` — the priced catalog the agent anchors on. Seeded
  from the described items in `index.html`. As your real catalog firms up, edit
  prices and `cues`, or add entries; the suggestions follow.
- `reference/style.md` — the description voice (Bulgarian + Japanese terms,
  uppercase names, honesty rules).
- `reference/pricing.md` — how price is reasoned about (ranges, signals).

## Notes

- Uses Claude Opus 4.8 vision with a forced structured tool call, so output
  always matches the schema or fails loudly.
- `img` is always `''` — the card renders its SVG fallback until you add a photo
  path. Image hosting is out of scope for this tool.
