import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { F3_STATUS } from "@/lib/landing-fixtures";

// F3 — a compact watchlist. Three StatusPills doing their designed job (the one
// place the saturated status palette is allowed). Initials only, no dose.
export function StatusRow({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <span className="text-content-tertiary mb-1 font-mono text-[10px] tracking-wider uppercase">
        Ward · Internal Medicine
      </span>
      <ul className="flex flex-col">
        {F3_STATUS.map((r, i) => (
          <li
            key={r.bed}
            className={`flex items-center justify-between gap-4 py-2.5 ${
              i > 0 ? "border-line-subtle border-t" : ""
            }`}
          >
            <span className="flex items-baseline gap-2">
              <span className="text-content-primary text-sm font-medium">{r.bed}</span>
              <span className="text-content-tertiary font-mono text-xs">{r.who}</span>
            </span>
            <StatusPill status={r.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
