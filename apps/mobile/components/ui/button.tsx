import { Pressable, Text } from "react-native";
import { cn } from "@/lib/cn";

// Mobile Button — parity with apps/web button.tsx. Semantic tokens only. Brand
// blue / neutral; no clinical status colours. `danger` (if added later) must
// stay neutral, never red.
type Variant = "primary" | "secondary" | "ghost";

const box: Record<Variant, string> = {
  primary: "bg-brand-primary active:opacity-90",
  secondary: "bg-surface-primary border border-line-strong active:bg-surface-secondary",
  ghost: "bg-transparent active:bg-surface-secondary",
};

const label: Record<Variant, string> = {
  primary: "text-content-on-brand",
  secondary: "text-content-primary",
  ghost: "text-content-secondary",
};

export function Button({
  title,
  onPress,
  variant = "primary",
  className,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      className={cn("h-12 items-center justify-center rounded-md px-6", box[variant], className)}
    >
      <Text className={cn("text-sm font-medium", label[variant])}>{title}</Text>
    </Pressable>
  );
}
