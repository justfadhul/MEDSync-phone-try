import { Tile } from "@/components/ui/tile";
import { F4_AREAS } from "@/lib/landing-fixtures";

// F4 — the care areas as pastel wayfinding tiles. This is the ONLY fragment
// permitted the pastel tint-*/accent-* tones (they carry category, not state).
const ICONS: Record<string, React.ReactNode> = {
  Vitals: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2 5 4-12 2 7h6" />
    </svg>
  ),
  Medications: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 12v4M10 14h4" />
    </svg>
  ),
  Appointments: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  ),
};

export function CareAreaTiles({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-3">
        {F4_AREAS.map((a) => (
          <Tile key={a.title} tone={a.tone} title={a.title} meta={a.meta} icon={ICONS[a.title]} />
        ))}
      </div>
    </div>
  );
}
