import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";

// Mobile Card — parity with apps/web card.tsx. Same semantic tokens
// (@medsync/tokens), so a card looks identical on web and mobile.
export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn(
        "bg-surface-primary border border-line-subtle rounded-md p-4",
        className,
      )}
      {...props}
    />
  );
}
