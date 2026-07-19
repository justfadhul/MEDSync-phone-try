import { cn } from "@/lib/cn";

// Thin monospace column chart with a threshold; the portion of any bar that
// breaches the threshold is drawn in the reserved clinical red. Pure/static —
// no interactivity needed (the design system's temperature pattern).
export function ThresholdChart({
  values,
  threshold,
  yMin,
  yMax,
  ticks = [],
  className,
}: {
  values: number[];
  threshold: number;
  yMin: number;
  yMax: number;
  ticks?: { i: number; label: string }[];
  className?: string;
}) {
  const W = 320;
  const H = 150;
  const P = { l: 26, r: 8, t: 10, b: 22 };
  const by = (v: number) =>
    P.t + (H - P.t - P.b) * (1 - (v - yMin) / (yMax - yMin));
  const n = values.length;
  const span = (W - P.l - P.r) / n;
  const bw = Math.min(3, span * 0.5);
  const base = by(yMin);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full", className)}
      role="img"
    >
      <line
        x1={P.l}
        x2={W - P.r}
        y1={by(threshold)}
        y2={by(threshold)}
        className="stroke-status-critical"
        strokeWidth={1}
        strokeDasharray="2 3"
        opacity={0.6}
      />
      {[
        { v: yMax, crit: false },
        { v: threshold, crit: true },
        { v: yMin, crit: false },
      ].map((t) => (
        <text
          key={t.v}
          x={P.l - 5}
          y={by(t.v) + 3}
          textAnchor="end"
          className={cn(
            "font-mono",
            t.crit ? "fill-status-critical" : "fill-content-tertiary",
          )}
          fontSize={8.5}
        >
          {t.v}
        </text>
      ))}

      {values.map((v, i) => {
        const cx = P.l + span * (i + 0.5);
        const over = v >= threshold;
        const topInk = by(Math.min(v, threshold));
        return (
          <g key={i}>
            <rect
              x={cx - bw / 2}
              y={topInk}
              width={bw}
              height={Math.max(0, base - topInk)}
              rx={1}
              className="fill-content-primary"
            />
            {over && (
              <rect
                x={cx - bw / 2}
                y={by(v)}
                width={bw}
                height={by(threshold) - by(v)}
                rx={1}
                className="fill-status-critical"
              />
            )}
          </g>
        );
      })}

      {ticks.map((t) => (
        <text
          key={t.i}
          x={P.l + span * (t.i + 0.5)}
          y={H - 7}
          textAnchor="middle"
          className="fill-content-tertiary font-mono"
          fontSize={8}
        >
          {t.label}
        </text>
      ))}
    </svg>
  );
}
