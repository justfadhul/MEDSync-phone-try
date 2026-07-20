# 0008 — Marketing-scoped display serif

## Status
Accepted.

## Context
Public marketing surfaces (the landing page) benefit from an editorial register
closer to a medical journal than a SaaS product — a display serif with occasional
italic accent phrases carries credibility that the product's system sans does not.
The shipped design system has no display face, and the clinical product UI must
not change: its typography (system sans for UI/prose, mono for data/codes/MRNs)
is a deliberate, tested choice.

## Decision
Add exactly one new font token — `font-display`, a **system serif stack**
(`Iowan Old Style, Palatino, Book Antiqua, Georgia, "Times New Roman", serif`) —
defined in `packages/tokens/src/fonts.cjs` and exposed through the Tailwind preset
as the `font-display` utility.

It is **fenced to marketing code only**: an ESLint `no-restricted-syntax` rule
flags any `font-display` string outside `components/landing/**`,
`components/marketing/**`, and the public marketing routes (`app/page.tsx`,
`app/get-started/**`). Product surfaces stay on `font-sans` / `font-mono`.

## Rationale
- Editorial credibility on public surfaces without touching clinical typography.
- A **system** serif stack — no paid licence, no webfont weight on 3G.
- Fencing keeps the amendment from leaking into the product, so the clinical
  surface reads exactly as before.

## Consequences
- Marketing headlines may use `font-display`; nothing else may.
- The fence is proven by test: using `font-display` in a product component fails
  lint. Removing the marketing scope would require deleting the fence knowingly.
