import { cn } from "@/lib/cn";

// Tiny trend line. tone stays neutral to the metric — `critical` only for a
// genuinely clinical series (a count of the critical), never up/down business.
export function Sparkline({
  values,
  tone = "brand",
  className,
}: {
  values: number[];
  tone?: "brand" | "critical";
  className?: string;
}) {
  const w = 100;
  const h = 26;
  const pad = 3;
  const mn = Math.min(...values);
  const mx = Math.max(...values);
  const rng = mx - mn || 1;
  const n = Math.max(values.length - 1, 1);
  const sx = (i: number) => pad + (w - 2 * pad) * (i / n);
  const sy = (v: number) => pad + (h - 2 * pad) * (1 - (v - mn) / rng);
  const d = values
    .map((v, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`)
    .join(" ");
  const last = values.at(-1) ?? 0;
  const stroke =
    tone === "critical" ? "stroke-status-critical" : "stroke-brand-primary";
  const fill =
    tone === "critical" ? "fill-status-critical" : "fill-brand-primary";
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("block h-[26px] w-full", className)}
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        className={stroke}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={sx(values.length - 1)}
        cy={sy(last)}
        r={2.4}
        className={fill}
      />
    </svg>
  );
}
