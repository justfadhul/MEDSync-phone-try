import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { cn } from "@/lib/cn";

// Categorical "area" tile — soft pastel surface for wayfinding, mirroring
// apps/web tile.tsx. Tints/accents come from the @medsync/tokens wayfinding set
// and are deliberately desaturated: they never read as the clinical red/green/
// amber channel (reserved for StatusPill).
export type TileTone = "rose" | "peach" | "lavender" | "mint" | "coral" | "sky";

// Static class strings (no interpolation) so NativeWind keeps them in the build.
const TONE: Record<TileTone, { surface: string; icon: string; accent: string }> = {
  rose: { surface: "bg-tint-rose", icon: "bg-accent-rose", accent: "text-accent-rose" },
  peach: { surface: "bg-tint-peach", icon: "bg-accent-peach", accent: "text-accent-peach" },
  lavender: { surface: "bg-tint-lavender", icon: "bg-accent-lavender", accent: "text-accent-lavender" },
  mint: { surface: "bg-tint-mint", icon: "bg-accent-mint", accent: "text-accent-mint" },
  coral: { surface: "bg-tint-coral", icon: "bg-accent-coral", accent: "text-accent-coral" },
  sky: { surface: "bg-tint-sky", icon: "bg-accent-sky", accent: "text-accent-sky" },
};

export function Tile({
  tone,
  icon,
  title,
  meta,
  onPress,
  className,
}: {
  tone: TileTone;
  icon: ReactNode;
  title: string;
  meta?: string;
  onPress?: () => void;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "border-line-subtle flex-1 gap-2.5 rounded-lg border p-3.5",
        t.surface,
        className,
      )}
    >
      <View className={cn("h-8 w-8 items-center justify-center rounded-[9px]", t.icon)}>
        {icon}
      </View>
      <Text className="text-content-primary text-[13px] font-semibold">{title}</Text>
      {meta ? <Text className={cn("text-[11px]", t.accent)}>{meta}</Text> : null}
    </Pressable>
  );
}
