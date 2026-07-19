import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";
import { tokens } from "@medsync/tokens";
import { Card } from "@/components/ui/card";
import { KpiTile } from "@/components/ui/kpi-tile";
import { StatusPill, type ClinicalStatus } from "@/components/ui/status-pill";
import { Tile, type TileTone } from "@/components/ui/tile";

// Mobile ward dashboard — parity with the web reference at /design/dashboard.
// Assembles the shared mobile primitives (Tile, KpiTile, StatusPill, Card) over
// the SAME @medsync/tokens, so the two platforms look and behave alike. Static
// sample data only — no clinical engine (engine-first law holds).

const ICON = tokens["content-on-brand"]; // white, on the pastel accent chips

function IconVitals() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 12h4l2 5 4-12 2 7h6" />
    </Svg>
  );
}
function IconMeds() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={8} width={18} height={12} rx={2} />
      <Path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 12v4M10 14h4" />
    </Svg>
  );
}
function IconAppts() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={4} width={18} height={17} rx={2} />
      <Path d="M3 9h18M8 2v4M16 2v4" />
    </Svg>
  );
}
function IconMessages() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  );
}
function IconRecords() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <Path d="M14 3v5h5M9 13h6M9 17h4" />
    </Svg>
  );
}
function IconTeam() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={9} cy={8} r={3} />
      <Path d="M2 21a7 7 0 0 1 14 0M17 11a3 3 0 0 0 0-6M22 21a7 7 0 0 0-5-6.7" />
    </Svg>
  );
}

const AREAS: { tone: TileTone; title: string; meta: string; icon: ReactNode }[] = [
  { tone: "rose", title: "Vitals", meta: "42 streaming", icon: <IconVitals /> },
  { tone: "mint", title: "Medications", meta: "7 due", icon: <IconMeds /> },
  { tone: "peach", title: "Appointments", meta: "12 today", icon: <IconAppts /> },
  { tone: "lavender", title: "Messages", meta: "4 unread", icon: <IconMessages /> },
  { tone: "sky", title: "Records", meta: "all synced", icon: <IconRecords /> },
  { tone: "coral", title: "Care team", meta: "6 on shift", icon: <IconTeam /> },
];

const WATCHLIST: {
  bed: string;
  name: string;
  mrn: string;
  vitals: string;
  status: ClinicalStatus;
}[] = [
  { bed: "B-12", name: "A. Nakato", mrn: "MUL-004821", vitals: "HR 122 · SpO₂ 91%", status: "critical" },
  { bed: "B-07", name: "J. Okello", mrn: "MUL-004795", vitals: "HR 96 · Temp 38.4°", status: "caution" },
  { bed: "B-03", name: "S. Auma", mrn: "MUL-004770", vitals: "HR 74 · SpO₂ 98%", status: "stable" },
  { bed: "B-15", name: "M. Ssebunya", mrn: "MUL-004833", vitals: "awaiting workup", status: "admitted" },
];

const HR = [78, 80, 82, 90, 100, 110, 122];

function HrChart() {
  const W = 300;
  const H = 96;
  const min = 60;
  const max = 130;
  const y = (v: number) => 8 + (H - 16) * (1 - (v - min) / (max - min));
  const x = (i: number) => 4 + ((W - 8) * i) / (HR.length - 1);
  const pts = HR.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const lastIdx = HR.length - 1;
  const lastVal = HR[lastIdx] ?? min;
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Line x1={4} y1={y(100)} x2={W - 4} y2={y(100)} stroke={tokens["status-critical"]} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      <Polyline points={pts} fill="none" stroke={tokens["brand-primary"]} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
      <Circle cx={x(lastIdx)} cy={y(lastVal)} r={4.5} fill={tokens["status-critical"]} stroke={tokens["surface-primary"]} strokeWidth={2} />
    </Svg>
  );
}

export default function MobileDashboard() {
  return (
    <ScrollView className="bg-surface-page flex-1">
      <View className="gap-5 px-5 py-8">
        <View>
          <Text className="text-content-tertiary font-mono text-[10px] uppercase">
            Tuesday · 19 Nov · 08:14
          </Text>
          <Text className="text-content-primary mt-1 text-2xl font-semibold">
            Good morning, Dr. Kato
          </Text>
          <Text className="text-content-secondary mt-1 text-sm">
            3 patients need review before the ward round. One is critical.
          </Text>
        </View>

        <View className="gap-3">
          <View className="flex-row gap-3">
            <KpiTile label="Bed occupancy" value="86" unit="%" delta="4 vs last week" spark={[70, 72, 71, 74, 78, 80, 83, 86]} selected />
            <KpiTile label="Median wait" value="42" unit="min" delta="6 vs last week" deltaDir="down" sparkTone="neutral" spark={[58, 54, 49, 50, 47, 45, 44, 42]} />
          </View>
          <View className="flex-row gap-3">
            <KpiTile label="Admissions" value="18" delta="3 vs yesterday" sparkTone="neutral" spark={[12, 15, 11, 14, 16, 13, 17, 18]} />
            <KpiTile label="Critical now" value="3" critical footnote="on the ward" spark={[1, 1, 2, 1, 2, 2, 3, 3]} sparkTone="critical" />
          </View>
        </View>

        <View className="gap-3">
          <View className="flex-row items-baseline gap-2.5">
            <Text className="text-content-primary text-sm font-semibold">Care areas</Text>
            <Text className="text-content-tertiary text-xs">colour-coded for wayfinding</Text>
          </View>
          {[0, 2, 4].map((start) => (
            <View key={start} className="flex-row gap-3">
              {AREAS.slice(start, start + 2).map((a) => (
                <Tile key={a.title} tone={a.tone} title={a.title} meta={a.meta} icon={a.icon} />
              ))}
            </View>
          ))}
        </View>

        <Card className="gap-0 p-0">
          <View className="border-line-subtle flex-row items-center justify-between border-b px-4 py-3">
            <Text className="text-content-primary text-[13px] font-semibold">Patient watchlist</Text>
            <Text className="text-brand-primary text-xs font-semibold">Open ward →</Text>
          </View>
          {WATCHLIST.map((p, i) => (
            <View
              key={p.bed}
              className={cnRow(i === WATCHLIST.length - 1)}
            >
              <Text className="text-content-tertiary w-9 font-mono text-[11px]">{p.bed}</Text>
              <View className="flex-1">
                <Text className="text-content-primary text-[13px] font-semibold" numberOfLines={1}>
                  {p.name}
                </Text>
                <Text className="text-content-tertiary font-mono text-[10px]" numberOfLines={1}>
                  {p.vitals}
                </Text>
              </View>
              <StatusPill status={p.status} className="ml-2" />
            </View>
          ))}
        </Card>

        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-content-primary text-[13px] font-semibold">Heart rate · Bed 12</Text>
            <Text className="text-content-tertiary font-mono text-[11px]">last 6h</Text>
          </View>
          <HrChart />
        </Card>

        <Text className="text-content-tertiary text-[11px]">
          Same @medsync/tokens as web. Pastel surfaces do wayfinding; red, green
          and amber stay reserved for clinical status — the pills are the only
          saturated hues on the screen.
        </Text>
      </View>
    </ScrollView>
  );
}

function cnRow(last: boolean) {
  return `flex-row items-center gap-3 px-4 py-3 ${last ? "" : "border-b border-line-subtle"}`;
}
