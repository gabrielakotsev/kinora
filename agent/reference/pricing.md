# Kinora pricing — how to set the EUR price

Price is in **EUR**, a single positive integer (no cents, no currency symbol).

## Method: price by similarity to the catalog

You are given real, priced catalog examples (`examples.json`) with `cues`
describing why each sits at its price. To price a new garment:

1. Identify its **type** (haori vs kimono) and formality (`sub`: Хаори / Комон /
   Фурисоде / Томесоде / Учикаке …).
2. Find the 1–2 closest examples by visual quality and construction.
3. Place the new price near those comparables, nudged up or down by the signals
   below.

## Observed ranges (anchors, not hard limits)

- **Haori**: roughly **90–980 €**. Simple/casual at the low end; metallic
  thread, hand-painting, or full-back embroidery at the top.
- **Kimono**: roughly **740–2400 €**. Casual komon lowest; formal furisode/
  tomesode higher; genuine antique ceremonial uchikake highest.

## Signals that move price up

- Silk grade and weight (Ниши-джин брокат, цумуги, муга > plain/blend)
- Hand-painting or hand-embroidery (vs woven or printed motif)
- Metallic gold/silver thread or leaf
- Scale of decoration (full-back motif > small accent)
- Formality of a kimono (учикаке/томесоде/фурисоде > комон)
- Genuine vintage/antique with visible age and period character
- Evident scarcity (only price a "limited" premium if you were told so)
- Condition: pristine > minor wear

## Signals that move price down

- Plain or sparse decoration, casual register
- Visible wear, staining, repairs, fading
- Blended/synthetic-looking fabric

## Output

- One integer EUR price.
- A short `priceRationale` (1–2 sentences, may be in English) naming the
  comparable(s) you anchored on and the signals that moved the price. This is
  for the owner to sanity-check — it is stripped from the final PRODUCTS object.
- When genuinely unsure between two tiers, lean to the **lower** price; the owner
  can raise it.
