// Marketing fixtures. Illustrative only. Must never be imported outside
// `components/landing/`. Not a data layer.
//
// Plain hardcoded constants — no fetch, no async, no mock service, no hook.
// A lint rule (no-restricted-imports) forbids importing this from anywhere
// except components/landing/. Values are clinically plausible; there are NO
// dose values and NO real patient identities (initials / role labels only).

import type { ClinicalStatus } from "@/components/ui/status-pill";
import type { TileTone } from "@/components/ui/tile";

// F1 — Vitals trend (KpiTile + Sparkline). A reading, not a dose.
export const F1_VITALS = {
  label: "Fasting glucose",
  value: "6.4",
  unit: "mmol/L",
  delta: "0.3 vs last week",
  deltaDir: "up" as const,
  spark: [6.9, 6.7, 6.8, 6.5, 6.6, 6.3, 6.5, 6.4],
};

// F2 — Threshold breach (ThresholdChart). Temperature °C over 24h; two readings
// cross the 38° line. The breach is coloured by the chart AND labelled in text.
export const F2_TEMP = {
  values: [
    36.6, 36.8, 37, 36.9, 37.2, 37.5, 38.2, 37.8, 37.4, 37.1, 37.6, 38.6, 39.1,
    38.4, 37.9, 37.5, 37.2, 37, 36.9, 37.3, 37.7, 38.1, 37.6, 37.4,
  ],
  threshold: 38,
  yMin: 36,
  yMax: 40,
  ticks: [
    { i: 0, label: "00" },
    { i: 6, label: "06" },
    { i: 12, label: "12" },
    { i: 18, label: "18" },
    { i: 23, label: "now" },
  ],
  breachLabel: "4 readings above the 38 °C threshold",
};

// F3 — Status row (StatusPill list). Initials only, never a full name.
export const F3_STATUS: { bed: string; who: string; status: ClinicalStatus }[] = [
  { bed: "Bed 12", who: "A.N.", status: "critical" },
  { bed: "Bed 07", who: "J.O.", status: "caution" },
  { bed: "Bed 03", who: "S.A.", status: "stable" },
];

// F4 — Care-area tiles (pastel wayfinding tones — used ONLY in this fragment).
export const F4_AREAS: { tone: TileTone; title: string; meta: string }[] = [
  { tone: "rose", title: "Vitals", meta: "42 streaming" },
  { tone: "mint", title: "Medications", meta: "7 due" },
  { tone: "peach", title: "Appointments", meta: "12 today" },
];

// F5 — Care-team feed = the audit trail made visible. Attributed actions with
// mono timestamps. Actors are roles/initials, actions carry no dose.
export const F5_FEED: { actor: string; action: string; ref: string; time: string }[] = [
  { actor: "Dr. K.", action: "reviewed vitals", ref: "Bed 12", time: "08:14" },
  { actor: "Nurse J.", action: "logged a BP reading", ref: "Bed 07", time: "07:52" },
  { actor: "System", action: "flagged a threshold breach", ref: "Bed 12", time: "07:50" },
];
