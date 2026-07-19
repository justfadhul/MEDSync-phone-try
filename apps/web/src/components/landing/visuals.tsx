// Landing-page signature visuals. Pure, decorative SVG — no product screenshots.
// Colour is BRAND BLUE + NEUTRAL only (stroke-brand-primary / stroke-line-*).
// The clinical trio (red/green/amber) never appears here. Each is aria-hidden;
// the surrounding copy carries the meaning.

// Hero — one continuous line runs THROUGH the hospital gate and keeps going,
// ending at a pulse (the patient, still connected, at home).
export function ContinuityLine() {
  return (
    <svg
      viewBox="0 0 400 130"
      className="h-auto w-full"
      role="img"
      aria-label="A care signal continuing past the hospital gate."
    >
      {/* gate / building */}
      <g className="stroke-line-strong" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 92V54l26-16 26 16v38" />
        <path d="M84 92V74h24v18" />
      </g>
      {/* baseline */}
      <line x1="8" y1="92" x2="392" y2="92" className="stroke-line-subtle" strokeWidth={1.5} />
      {/* the continuous blue signal, with an ECG blip at the gate */}
      <path
        d="M8 92 H150 l8-30 8 44 6-14 H236 l10 22"
        className="stroke-brand-primary"
        fill="none"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M256 92 H384" className="stroke-brand-primary" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx="384" cy="92" r="5" className="fill-brand-primary" />
    </svg>
  );
}

// What's broken — the same line, but after the gate it decays into fading
// dashes and never reaches the far side. The signal goes dark.
export function BrokenLine() {
  return (
    <svg
      viewBox="0 0 400 90"
      className="h-auto w-full"
      role="img"
      aria-label="The care signal breaking into fading dashes after discharge."
    >
      <g className="stroke-line-strong" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 62V30l24-15 24 15v32" />
      </g>
      <path d="M8 62 H120" className="stroke-brand-primary" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx="8" cy="62" r="4.5" className="fill-brand-primary" />
      <path
        d="M150 62 H210 M226 62 H262 M278 62 H300 M314 62 H326"
        className="stroke-line-strong"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.55}
      />
    </svg>
  );
}

const STEPS = [
  { t: "Reading", s: "A glucose or BP reading, captured at home." },
  { t: "Threshold", s: "Checked against the patient’s own limits." },
  { t: "Alert", s: "The right clinician is notified — no watching." },
  { t: "Care team", s: "They see the whole trajectory, not one number." },
  { t: "Intervention", s: "A call, an adjustment, a visit." },
];

// The loop (signature). Five steps down a spine, then a return arc sweeping back
// from Intervention to Reading — the circle closes. Vertical so it stays legible
// on a phone. Nodes/among are brand; the spine + return are brand; text neutral.
export function LoopDiagram() {
  const x = 40;
  const y0 = 34;
  const gap = 74;
  const y = (i: number) => y0 + i * gap;
  const yLast = y(STEPS.length - 1);
  return (
    <svg
      viewBox={`0 0 320 ${yLast + 40}`}
      className="h-auto w-full"
      role="img"
      aria-label="A closed loop: reading, threshold, alert, care team, intervention, and back to the next reading."
    >
      {/* spine between nodes */}
      <line x1={x} y1={y0} x2={x} y2={yLast} className="stroke-brand-primary" strokeWidth={2} opacity={0.4} />
      {/* return arc: from last node, out left, up, back to first node */}
      <path
        d={`M${x} ${yLast} C 8 ${yLast}, 8 ${y0}, ${x} ${y0}`}
        className="stroke-brand-primary"
        fill="none"
        strokeWidth={2}
        strokeDasharray="3 4"
      />
      <path d={`M${x - 6} ${y0 + 9} L${x} ${y0} L${x + 6} ${y0 + 9}`} className="stroke-brand-primary" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {STEPS.map((step, i) => (
        <g key={step.t}>
          <circle cx={x} cy={y(i)} r={13} className="fill-brand-subtle stroke-brand-primary" strokeWidth={1.6} />
          <text x={x} y={y(i) + 4} textAnchor="middle" className="fill-brand-primary font-mono" fontSize={11} fontWeight={600}>
            {i + 1}
          </text>
          <text x={x + 26} y={y(i) - 2} className="fill-content-primary" fontSize={14} fontWeight={600}>
            {step.t}
          </text>
          <text x={x + 26} y={y(i) + 15} className="fill-content-secondary" fontSize={11.5}>
            {step.s}
          </text>
        </g>
      ))}
    </svg>
  );
}
