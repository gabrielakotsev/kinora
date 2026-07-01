# Kinora house voice — descriptions

Kinora sells Japanese vintage haori and kimono to a Bulgarian audience. Every
generated `name`, `desc`, and `details` must read as if written by the same hand
as the existing catalog.

## Language

- Write in **Bulgarian**. No English sentences.
- **Keep Japanese textile terms** untranslated where the catalog does:
  `nagajuban`, `seigaiha`, `yūzen`/`юзен`, `furisode`/`фурисоде`,
  `tomesode`/`томесоде`, `uchikake`/`учикаке`, `komon`/`комон`, `haori`/`хаори`,
  `obi`/`оби`, `katazome`/`катазоме`, `Ниши-джин` (Nishijin), `химо` (himo ties).
- `name` is in **UPPERCASE** Bulgarian, evocative and short (1–3 words), e.g.
  `ПОЛУНОЩЕН ЖЕРАВ`, `ЗЛАТЕН ФЕНИКС`, `ВЪЛНА ИНДИГО`. Name from the dominant
  motif, colour, or feeling of the garment — never a generic "ХАОРИ 12".

## `desc` — the description (rich, narrative)

Write an evocative **product story**, not a one-liner — atmosphere, what makes
the piece singular, and how it can be worn. Several sentences, can run to a short
multi-paragraph block (separate paragraphs with a blank line). Lyrical but
grounded in what the photos actually show.

**Structure to follow:**
1. **Evocative hook** — one striking opening line that captures the feeling
   ("Силно изразителна среща между тъмна елегантност и ярка чувственост.").
2. **Who it's for / what it does** — the intent ("създадено за визии, които не
   остават незабелязани").
3. **Visual walkthrough** — describe the colours, motifs, and finish you can
   actually see in the photos. This is the anchored part — name the dominant
   colour, the motif (florals, geometric, crane…), the finish (light-catching,
   matte, sheen).
4. **Cut & styling** — the free cut and how it wears: how/when to wear it, what
   it pairs with, the versatility. ("Свободната кройка придава естествен силует
   и комфорт.")

**Model the register on these (match the tone, do NOT copy the text):**

> Силно изразителна среща между тъмна елегантност и ярка чувственост. Това хаори
> е създадено за визии, които не остават незабелязани.
>
> Дълбоко черна основа, обогатена с тъмночервени флорални мотиви — мистично,
> изискано и леко драматично, с усещане за лукс и дълбочина.
>
> Свободната кройка придава естествен силует и комфорт и позволява лесно
> съчетаване — от изчистена дневна визия до изразителен акцент за вечерта.

> Елегантност, която се разкрива изтънчено. Това хаори е създадено за хора, които
> ценят детайла и универсалния стил. Дълбоко черна основа с брокатен ефект, който
> улавя светлината и придава луксозен завършек, без да нарушава минимализма.
> Свободната кройка осигурява комфорт и красиво падане върху силуета.

### Invent freely vs. never invent (the honesty line)

You MAY invent the **creative, subjective** layer — mood, atmosphere, why the
piece feels unique, styling ideas (how/when to wear, what to pair), poetic
framing of the visible motif.

You must NOT invent **factual, verifiable** claims: a specific fibre ("100%
коприна"), a certificate of authenticity, a named atelier ("семейство Мацуда"),
an exact historical period ("Мейджи, ~1895"), or scarcity ("само 12 в света").
Describe the **look** of the fabric, not its lab facts — "брокатен ефект",
"сатенен блясък", "луксозно падане" are fine; "100% коприна" is not unless the
owner told you.

### Reversible / two-sided garments

Default to a single cohesive description. **Only** describe two distinct sides
("двустранно — две визии в едно", with a per-side walkthrough and the
"transform your look" styling angle) when the owner explicitly says the garment
is reversible, or the photos unmistakably show two finished, different faces of
the same piece. Do not assume a second side you cannot see.

- **No markdown.** Plain prose with blank-line paragraph breaks only.

## `details` — the spec bullets

- **3–5 short Bulgarian strings.** Each is a fragment, not a sentence, e.g.
  `100% цумуги коприна`, `Феникс бродерия на гърба`, `Само химическо чистене`.
- Cover, where the photo supports it: material/fibre, the standout technique or
  motif, lining, and a care instruction (`Само химическо чистене`,
  `Ръчно пране при студено`).

## Honesty rules (important)

- **Describe only what the photos show.** Do not invent certificates of
  authenticity, named ateliers (e.g. "семейство Мори"), specific historical
  periods, fibre composition, or "limited — N в света" claims unless they are
  clearly visible or were given to you. Fabrication damages trust and resale.
- If a detail is uncertain, choose a safe, generic-but-true bullet
  (`Винтидж японска изработка`) rather than a specific false claim.

## Colour palette (for `colors`, `bg`, `acc`)

The site is a dark editorial palette. Derive `bg`/`acc`/`colors` from the
garment's dominant tones but stay within this range so the card matches the site:

- Darks / backgrounds: `#0c0608`, `#140a04`, `#1e2010`, `#2e3018`, `#2e0810`,
  `#3a0814`, `#4a0c1a`, `#0a1020`
- Accents (light/metallic): `#c4a464` (gold), `#dfc090`, `#e4d8c0` (cream),
  `#7c8240` (olive)
- `colors` is an array of 3 dark hex values (a small swatch trio).
- `bg` is the dominant dark; `acc` is the light/metallic accent that reads
  against it.
