import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { tokens } from "@medsync/tokens";
import { Button } from "@/components/ui/button";

// Getting-started — three screens, one shown at a time (tap Next to advance;
// progress dots reflect position; Skip is always available). Each: one
// illustration (placeholder line-art at a fixed aspect until final assets
// land), one headline (≤6 words), one support line (≤20 words). The flow ENDS
// at the auth boundary: "Get started" → /sign-up, Skip → /sign-in. No
// registration is built here. Patient-facing tone is encouraging, never
// shaming. Brand blue on neutrals; no clinical status colours; light only.

const BRAND = tokens["brand-primary"];
const LINE = tokens["line-strong"];
const SUBTLE = tokens["brand-subtle"];

function ReadingArt() {
  return (
    <Svg width={240} height={150} viewBox="0 0 240 150" accessibilityLabel="A reading travelling from home to a care team">
      <Line x1={16} y1={96} x2={224} y2={96} stroke={LINE} strokeWidth={1.5} />
      <Path d="M28 78 h34 l7 4 v-14 l6 22 4-30 5 24 3-6 h30" fill="none" stroke={BRAND} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M132 96 h84" stroke={BRAND} strokeWidth={2.6} strokeLinecap="round" />
      <Circle cx={216} cy={96} r={9} fill={SUBTLE} stroke={BRAND} strokeWidth={2} />
      <Circle cx={216} cy={96} r={3} fill={BRAND} />
    </Svg>
  );
}

function OfflineArt() {
  return (
    <Svg width={240} height={150} viewBox="0 0 240 150" accessibilityLabel="A phone delivering an SMS reminder offline">
      <Rect x={92} y={26} width={56} height={98} rx={10} fill="none" stroke={BRAND} strokeWidth={2.4} />
      <Rect x={104} y={46} width={32} height={20} rx={4} fill={SUBTLE} />
      <Line x1={104} y1={82} x2={136} y2={82} stroke={LINE} strokeWidth={2} strokeLinecap="round" />
      <Line x1={104} y1={94} x2={128} y2={94} stroke={LINE} strokeWidth={2} strokeLinecap="round" />
      <Path d="M150 40 a8 8 0 0 1 12 0 M156 30 a16 16 0 0 1 22 0" fill="none" stroke={BRAND} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function TeamArt() {
  return (
    <Svg width={240} height={150} viewBox="0 0 240 150" accessibilityLabel="A care team sharing one view">
      <Circle cx={120} cy={60} r={16} fill={SUBTLE} stroke={BRAND} strokeWidth={2} />
      <Circle cx={80} cy={96} r={13} fill="none" stroke={BRAND} strokeWidth={2} />
      <Circle cx={160} cy={96} r={13} fill="none" stroke={BRAND} strokeWidth={2} />
      <Line x1={120} y1={76} x2={80} y2={83} stroke={LINE} strokeWidth={1.8} />
      <Line x1={120} y1={76} x2={160} y2={83} stroke={LINE} strokeWidth={1.8} />
    </Svg>
  );
}

const SCREENS = [
  { art: ReadingArt, title: "Your readings reach your team", body: "Log at home and your care team sees it — the record keeps going after discharge." },
  { art: OfflineArt, title: "Reminders that work offline", body: "A gentle nudge when it’s time — over SMS when the network won’t hold." },
  { art: TeamArt, title: "Your whole team, one picture", body: "Everyone caring for you sees one coordinated view — held by your care team." },
] as const;

export default function Onboarding() {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const screen = SCREENS[page];
  if (!screen) return null;
  const { art: Art, title, body } = screen;
  const last = page === SCREENS.length - 1;
  const next = () => (last ? router.push("/sign-up") : setPage((p) => p + 1));

  return (
    <View className="bg-surface-page flex-1">
      {/* skip — always available */}
      <View className="flex-row justify-end px-5 pt-14">
        <Pressable onPress={() => router.push("/sign-in")} accessibilityRole="button" hitSlop={12}>
          <Text className="text-content-secondary text-sm font-medium">Skip</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Art />
        <Text className="text-content-primary mt-10 text-center text-2xl font-semibold tracking-tight">
          {title}
        </Text>
        <Text className="text-content-secondary mt-3 max-w-xs text-center text-base">
          {body}
        </Text>
      </View>

      {/* progress dots */}
      <View className="flex-row justify-center gap-2 pb-6">
        {SCREENS.map((s, i) => (
          <View
            key={s.title}
            className={
              i === page
                ? "bg-brand-primary h-2 w-2 rounded-full"
                : "bg-line-strong h-2 w-2 rounded-full"
            }
          />
        ))}
      </View>

      <View className="px-6 pb-12">
        <Button title={last ? "Get started" : "Next"} onPress={next} />
      </View>
    </View>
  );
}
