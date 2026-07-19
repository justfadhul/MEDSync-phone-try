import Svg, { Polyline } from "react-native-svg";
import { tokens } from "@medsync/tokens";

// Tiny trend line for KPI tiles, mirroring the web Sparkline. Stroke colour is
// pulled from the resolved token map (not a raw hex) so it matches web exactly.
// `neutral` deltas stay grey — colour is spent only where it carries meaning.
export function Sparkline({
  values,
  tone = "brand",
  width = 120,
  height = 26,
}: {
  values: number[];
  tone?: "brand" | "critical" | "neutral";
  width?: number;
  height?: number;
}) {
  const stroke =
    tone === "critical"
      ? tokens["status-critical"]
      : tone === "neutral"
        ? tokens["content-tertiary"]
        : tokens["brand-primary"];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 3;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = pad + (height - pad * 2) * (1 - (v - min) / span);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={pts} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}
