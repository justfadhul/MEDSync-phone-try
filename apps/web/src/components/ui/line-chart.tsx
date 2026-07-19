"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface LinePoint {
  label: string;
  value: number;
  reference?: number;
}

// One accent series vs a neutral dashed reference, a recessive grid, an
// emphasised latest point, and an optional threshold. A value at/above the
// threshold turns the reserved clinical red — with a tooltip, never colour
// alone (design system §7). Colours come from tokens via Tailwind classes, so
// the chart is theme-reactive with no JS colour reading.
export function LineChart({
  data,
  threshold,
  yMin,
  yMax,
  unit = "",
  gridValues,
  className,
}: {
  data: LinePoint[];
  threshold?: number;
  yMin: number;
  yMax: number;
  unit?: string;
  gridValues?: number[];
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 320;
  const H = 190;
  const P = { l: 30, r: 12, t: 12, b: 26 };
  const n = Math.max(data.length - 1, 1);
  const x = (i: number) => P.l + (W - P.l - P.r) * (i / n);
  const y = (v: number) =>
    P.t + (H - P.t - P.b) * (1 - (v - yMin) / (yMax - yMin));
  const grid = gridValues ?? [];
  const path = (get: (p: LinePoint) => number | undefined) =>
    data
      .map((p, i) => {
        const v = get(p);
        return v === undefined
          ? ""
          : `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
      })
      .filter(Boolean)
      .join(" ");

  const hasRef = data.some((p) => p.reference !== undefined);
  const active = hover !== null ? data[hover] : undefined;

  return (
    <div className={cn("relative", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img">
        {grid.map((g) => (
          <g key={g}>
            <line
              x1={P.l}
              x2={W - P.r}
              y1={y(g)}
              y2={y(g)}
              className="stroke-line-subtle"
              strokeWidth={1}
            />
            <text
              x={P.l - 6}
              y={y(g) + 3}
              textAnchor="end"
              className="fill-content-tertiary font-mono"
              fontSize={9}
            >
              {g}
            </text>
          </g>
        ))}

        {threshold !== undefined && (
          <>
            <line
              x1={P.l}
              x2={W - P.r}
              y1={y(threshold)}
              y2={y(threshold)}
              className="stroke-status-critical"
              strokeWidth={1}
              strokeDasharray="2 3"
              opacity={0.6}
            />
            <text
              x={P.l + 3}
              y={y(threshold) - 4}
              className="fill-status-critical font-mono"
              fontSize={8.5}
            >
              threshold
            </text>
          </>
        )}

        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={P.t}
            y2={H - P.b}
            className="stroke-line-strong"
            strokeWidth={1}
          />
        )}

        {data.map((p, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            className="fill-content-tertiary font-mono"
            fontSize={8.5}
          >
            {p.label}
          </text>
        ))}

        {hasRef && (
          <path
            d={path((p) => p.reference)}
            fill="none"
            className="stroke-line-strong"
            strokeWidth={1.6}
            strokeDasharray="3 3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        <path
          d={path((p) => p.value)}
          fill="none"
          className="stroke-brand-primary"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((p, i) => {
          const over = threshold !== undefined && p.value >= threshold;
          const last = i === data.length - 1;
          return (
            <g key={i}>
              <circle
                cx={x(i)}
                cy={y(p.value)}
                r={last ? 4.5 : 3.5}
                className={cn(
                  over ? "fill-status-critical" : "fill-brand-primary",
                  "stroke-surface-primary",
                )}
                strokeWidth={2}
              />
              <circle
                cx={x(i)}
                cy={y(p.value)}
                r={15}
                fill="transparent"
                className="cursor-pointer"
                onPointerEnter={() => setHover(i)}
                onPointerMove={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              />
            </g>
          );
        })}
      </svg>

      {active && hover !== null && (
        <div
          className="bg-surface-inverse text-content-inverse pointer-events-none absolute z-10 min-w-[112px] -translate-x-1/2 rounded border px-2.5 py-2 text-xs shadow-md"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            top: `${(y(active.value) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 10px))",
          }}
        >
          <div className="opacity-70">{active.label}</div>
          <div className="flex items-center justify-between gap-3 tabular-nums">
            <span>
              {active.value}
              {unit && ` ${unit}`}
            </span>
            {active.reference !== undefined && (
              <span className="opacity-70">
                Δ {active.value - active.reference}
              </span>
            )}
          </div>
          {threshold !== undefined && active.value >= threshold && (
            <div className="text-status-critical mt-1">Above threshold</div>
          )}
        </div>
      )}
    </div>
  );
}
