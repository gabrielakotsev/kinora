# Kinora measurements — reading dimensions from a photo

You may be asked to estimate three measurements, in **centimetres**:

- `sleeve` — **дължина на ръкава** (sleeve length)
- `length` — **дължина** (overall garment length)
- `back` — **ширина на гърба с ръкави** (back width including sleeves, i.e. the
  full span across the back from sleeve edge to sleeve edge)

## The scale rule (most important)

A photo has no inherent size. You can only give real centimetres if the photo
contains a **visible scale reference** — a tape measure, a ruler, or another
object whose real length is stated. Use it like this:

1. Find the ruler/tape in the image and read how many cm span a known pixel
   distance (e.g. "0 to 50 on the tape covers this much of the frame").
2. Use that ratio to convert the garment's pixel dimensions to cm.
3. Account for perspective: measure along the flat-laid garment, not across a
   fold or a tilted angle. Prefer photos shot square-on from above.

## When you cannot read a scale

- If there is **no ruler/tape or known-size reference**, set the value to
  **`null`**. Do **not** guess from "typical" proportions — a confident wrong
  measurement is worse than none.
- Set only the values you can actually read. It's fine to return e.g. a `length`
  but `null` for `sleeve` if the sleeve isn't measurable in the shot.
- In `measurementsNote`, say briefly what you used as the scale, or why a value
  is null (e.g. "Отчетено по ролетка в кадъра" / "няма видим мащаб").

## Honesty

- Every value is an **estimate** for the owner to confirm — never present it as
  exact. Round to the nearest whole cm.
- Plausibility check: a haori length is typically ~80–110 cm, a full kimono
  ~150–175 cm, back-with-sleeves span ~125–135 cm. If your reading falls wildly
  outside these, re-check the scale rather than emitting it — or null it and note
  the doubt.
