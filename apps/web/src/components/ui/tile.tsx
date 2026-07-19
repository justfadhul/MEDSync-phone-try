import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Categorical "area" tile — a soft pastel surface for wayfinding (which area of
// care this is), NOT a status. Tints/accents come from the @medsync/tokens
// wayfinding set; they are deliberately desaturated so they never read as the
// clinical red/green/amber channel (that stays reserved for StatusPill/charts).
export type TileTone =
  | "rose"
  | "peach"
  | "lavender"
  | "mint"
  | "coral"
  | "sky";

// Static class strings (no interpolation) so Tailwind keeps them in the build.
const TONE: Record<TileTone, { surface: string; icon: string; accent: string }> =
  {
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
  href = "#",
  className,
}: {
  tone: TileTone;
  icon: ReactNode;
  title: string;
  meta?: string;
  href?: string;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <a
      href={href}
      className={cn(
        "flex min-h-[104px] flex-col gap-2.5 rounded-lg border border-line-subtle p-3.5 no-underline transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md",
        t.surface,
        className,
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-[9px] text-content-on-brand [&_svg]:h-[17px] [&_svg]:w-[17px]",
          t.icon,
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="text-content-primary text-[13px] font-semibold">
        {title}
      </span>
      {meta && (
        <span className={cn("-mt-1 text-[11.5px] tabular-nums", t.accent)}>
          {meta}
        </span>
      )}
    </a>
  );
}
