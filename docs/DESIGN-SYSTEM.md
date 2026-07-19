# MedSync Design System

> A calm, clinical operating system. Minimal by default, colour-disciplined by law, identical across web and mobile.

The design system is **code first**. Everything below is generated from one source
of truth — `@medsync/tokens` — which both `apps/web` and `apps/mobile` consume. There
is no separate spec that can drift from the app; this document describes what the tokens
already enforce.

---

## 1. The one law: colour is a clinical signal

MedSync is a hospital operating system, not a consumer app. The saturated
**red / green / amber** trio is reserved for clinical status and nothing else:

| Colour | Meaning | Token |
| --- | --- | --- |
| 🔴 Red `#DC2626` | Clinical emergency / critical **only** | `status-critical` |
| 🟢 Green `#16A34A` | Stable / success | `status-stable` |
| 🟡 Amber `#F59E0B` | Caution / non-emergency warning | `status-caution` |

This is enforced, not just documented:

- `status-critical` is the **only** semantic token that may resolve to red-600.
- Non-emergency UI states (form errors, warnings, destructive actions) use amber or
  neutral — **never** red.
- Automated tests fail the build if red leaks into any non-clinical token.

Everything else on screen is neutral, brand blue, or a soft decorative pastel.

---

## 2. Token architecture

```
primitives.cjs   raw values (the ONLY file allowed to hold hex)
      │
      ▼
semantic.cjs     meaning-bearing tokens, each with { light, dark }
      │
      ▼
theme.cjs        resolves tokens → CSS vars / Tailwind colour groups
      │
      ├─ preset.cjs        baked light preset  → apps/mobile (NativeWind)
      └─ preset-web.cjs    CSS-variable preset → apps/web (dual-theme)
```

- Components reference **semantic tokens only** — never a primitive, never a raw hex.
  A lint rule blocks raw hex outside `primitives.cjs`, and the Tailwind preset removes
  the default palette so `bg-red-500` etc. simply don't exist.
- Web and mobile resolve the **same** semantic token to the **same** value.

---

## 3. Colour

### Brand — blue
Centred on the reference primary `#5A81FA`. Marks intent and interaction.

| Token | Light | Dark |
| --- | --- | --- |
| `brand-primary` | `#3E63DD` | `#5A81FA` |
| `brand-cta` | `#2C3D8F` | `#293F99` |
| `brand-subtle` | `#EEF2FF` | `#1B2559` |

### Neutrals
A single gray ramp (`#F9FAFB` → `#030712`) carries surfaces, text, and lines in both
themes via `surface-*`, `content-*`, and `line-*` tokens.

### Wayfinding pastels (new)
Soft, categorical tints that tell you **which area of care** you're in — decorative
only, and deliberately desaturated so they never read as the clinical trio. Each hue
has a `tint-*` (card background) and `accent-*` (icon chip / label).

| Tone | `tint-*` (light) | `accent-*` (light) | Typical use |
| --- | --- | --- | --- |
| rose | `#F8DEDE` | `#C97B7B` | Vitals |
| peach | `#FBE7D2` | `#D2914E` | Appointments |
| lavender | `#E0DBF4` | `#7E70CE` | Messages |
| mint | `#D3EDE2` | `#489C80` | Medications |
| coral | `#F8CFC4` | `#D9765F` | Care team |
| sky | `#D8E7F6` | `#4D86BE` | Records |

In operational dark mode the tints become low-alpha translucent fills over the dark
surface, with a brighter accent — same six hues, tuned for contrast.

**Rule:** pastels carry *category*, status pills carry *state*. A card is never
coloured by how sick a patient is; that is always the pill's job.

---

## 4. Typography

- **Sans:** Helvetica Neue / system stack — UI and prose.
- **Mono:** SF Mono / system mono — data, codes (MRN), timestamps, KPI labels.
- Tight tracking on large headings (`-0.02em`), tabular numerals for all metrics.

---

## 5. Spacing & radius

- **4px grid** (Tailwind's default scale: `1` = 4px).
- Radii: `sm 4px · DEFAULT 6px · md 8px · lg 12px · full`.
- Cards: `lg` corners, 1px `line-subtle` border, soft shadow.

---

## 6. Dark mode — operational only

Dark mode exists but is **opt-in per surface**, never global:

- Web: wrap a subtree in `.theme-dark`. Analytics, admin, and audit surfaces may opt
  in; **clinical surfaces never do** — they always render light.
- Mobile: light only for now (clinical-first).
- Clinical status tokens keep their meaning in both themes.

---

## 7. Components

All primitives are token-driven and shared in spirit across platforms (web in
`apps/web/src/components/ui`, mobile in `apps/mobile/components/ui`).

| Component | Purpose | Notes |
| --- | --- | --- |
| `Button` | Actions | variants: cta / secondary / ghost / danger (danger is **neutral**, not red) |
| `StatusPill` | Clinical state | the **only** component allowed the saturated status palette |
| `Tag` / `Chip` | Labels / filters | neutral + brand |
| `Tile` | Pastel area card | wayfinding; `tone` = rose…sky |
| `Card` | Container | |
| `Input` / `Switch` / `Segmented` | Controls | invalid state uses amber, not red |
| `KpiTile` + `Sparkline` | Analytics stat | deltas are **neutral ▲/▼**, never red/green |
| `LineChart` / `ThresholdChart` | Time series | a value crossing a clinical threshold turns red **with a label**, never colour alone |

**Reference surfaces**
- `/design` — component showcase
- `/design/dashboard` — a full ward dashboard assembled from the real primitives
- Mobile `/dashboard` — the same view, same tokens, on Expo/NativeWind

---

## 8. Analytics & charts

- One accent series against a neutral dashed reference; recessive grid.
- Up/down is shown with a **neutral arrow**, not colour — green/red stay clinical.
- Thresholds: the breaching portion turns `status-critical` red **and** is labelled,
  so meaning never depends on colour perception alone (accessibility + safety).

---

## 9. Do / Don't

✅ **Do**
- Use `status-*` for clinical state, `tint-*/accent-*` for wayfinding.
- Reach for neutral or brand blue for everything decorative.
- Let charts show direction with arrows and labels.

❌ **Don't**
- Use red/green/amber for anything non-clinical (including "delta up/down").
- Colour a card by patient acuity — use a `StatusPill`.
- Hardcode hex in a component, or use a raw Tailwind palette class.
- Opt a clinical surface into dark mode.

---

## 10. File map

```
packages/tokens/src/
  primitives.cjs     raw values (hex lives ONLY here)
  semantic.cjs       semantic tokens (light + dark)
  theme.cjs          resolution helpers
  preset.cjs         mobile (baked light)
  preset-web.cjs     web (CSS variables, dual-theme)
  *.test.mjs         safety invariants (red-is-clinical, no raw palette)

apps/web/src/components/ui/     web primitives
apps/mobile/components/ui/      mobile primitives
apps/web/src/app/design/        showcase + reference dashboard
apps/mobile/app/dashboard.tsx   mobile reference dashboard
```

---

## Amendment (ADR-0008) — marketing-scoped display serif

Public marketing surfaces may use one display serif, `font-display` (a system
serif stack — no paid licence). It is **fenced to marketing code only**
(`components/landing/**`, `components/marketing/**`, `app/page.tsx`) by an ESLint
rule; product UI stays on `font-sans` (UI/prose) and `font-mono` (data, codes,
MRNs, timestamps). Rationale: editorial credibility on public surfaces without
changing the clinical surface typography.

## Amendment — glass materials (marketing chrome only)

A conservative Apple-style "liquid glass" material is available to marketing
chrome — the sticky nav, the announcement bar, and one floating hero element —
via the `.material-glass-nav` / `.material-glass-panel` utilities (values in
`primitives.cjs` → CSS vars). Implementation is `backdrop-filter` + `rgba()`
only (no SVG/WebGL, no `opacity`), solid by default, translucent only where
supported and where the viewer hasn't asked to reduce transparency. **Glass is
forbidden on any `StatusPill`, `ThresholdChart`, clinical fragment, or any
surface carrying body copy** — translucency makes a clinical status colour's
contrast depend on the backdrop, which is a safety regression, not an aesthetic.
