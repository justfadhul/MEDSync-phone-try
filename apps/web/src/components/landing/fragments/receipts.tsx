import { F7_RECEIPTS } from "@/lib/landing-fixtures";

// F7 — engineering receipts. Each trust claim is tied to a real file in this
// repo (paths verified). Governance shown, not asserted; no badges. Neutral +
// mono only.
export function Receipts({ className }: { className?: string }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${className ?? ""}`}>
      {F7_RECEIPTS.map((r, i) => (
        <li key={r.file} className="border-line-subtle bg-surface-primary flex flex-col gap-1.5 rounded-lg border p-4 shadow-sm">
          <span className="flex items-center gap-2">
            <span className="text-content-tertiary font-mono text-[10px] tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-content-primary text-sm font-semibold">{r.mechanism}</span>
          </span>
          <span className="text-content-secondary text-xs">{r.detail}</span>
          <span className="text-content-tertiary bg-surface-secondary mt-1 self-start rounded px-2 py-1 font-mono text-[11px]">
            {r.file}
          </span>
        </li>
      ))}
    </ul>
  );
}
