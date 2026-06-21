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

## `desc` — the description

- **1–2 sentences.** Lyrical but concise. ~15–40 words.
- Structure: an evocative hook + the craft/technique + origin or material.
  Optionally a heritage / limited-edition note **only if visually evident**.
- Examples of the register (do not copy — match the tone):
  - "Смел хаори от Ниши-джин нощна коприна, ръчно рисуван с мотив на жерав в сребърен лист."
  - "Вдъхновен от шинтоистките горски светилища — маслиненозелен хаори с фини ирисови мотиви."
  - "Злато върху тъмно — най-впечатляващото хаори в колекцията."
- **No markdown.** Plain prose. No bullet points inside `desc`.

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
