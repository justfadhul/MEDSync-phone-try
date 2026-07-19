import { Card } from "@/components/ui/card";
import { KpiTile } from "@/components/ui/kpi-tile";
import { StatusPill, type ClinicalStatus } from "@/components/ui/status-pill";
import { Tile, type TileTone } from "@/components/ui/tile";
import { LineChart } from "@/components/ui/line-chart";

// Design-system reference dashboard. Assembles the real shared primitives into a
// realistic ward view so the pastel wayfinding surfaces and the reserved
// clinical status channel can be seen together. No clinical engine is involved
// (engine-first law holds) — every value below is static sample data.
export const metadata = { title: "MedSync — Dashboard (reference)" };

const AREAS: {
  tone: TileTone;
  title: string;
  meta: string;
  icon: React.ReactNode;
}[] = [
  {
    tone: "rose",
    title: "Vitals",
    meta: "42 streaming",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l2 5 4-12 2 7h6" />
      </svg>
    ),
  },
  {
    tone: "mint",
    title: "Medications",
    meta: "7 due",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="2" />
        <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 12v4M10 14h4" />
      </svg>
    ),
  },
  {
    tone: "peach",
    title: "Appointments",
    meta: "12 today",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </svg>
    ),
  },
  {
    tone: "lavender",
    title: "Messages",
    meta: "4 unread",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    tone: "sky",
    title: "Records",
    meta: "all synced",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    tone: "coral",
    title: "Care team",
    meta: "6 on shift",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M2 21a7 7 0 0 1 14 0M17 11a3 3 0 0 0 0-6M22 21a7 7 0 0 0-5-6.7" />
      </svg>
    ),
  },
];

const WATCHLIST: {
  bed: string;
  name: string;
  mrn: string;
  vitals: string;
  status: ClinicalStatus;
}[] = [
  { bed: "B-12", name: "A. Nakato", mrn: "MUL-004821", vitals: "BP 168/104 · HR 122 · SpO₂ 91%", status: "critical" },
  { bed: "B-07", name: "J. Okello", mrn: "MUL-004795", vitals: "BP 138/88 · HR 96 · Temp 38.4°", status: "caution" },
  { bed: "B-03", name: "S. Auma", mrn: "MUL-004770", vitals: "BP 122/78 · HR 74 · SpO₂ 98%", status: "stable" },
  { bed: "B-15", name: "M. Ssebunya", mrn: "MUL-004833", vitals: "newly admitted · awaiting workup", status: "admitted" },
  { bed: "B-09", name: "R. Namubiru", mrn: "MUL-004812", vitals: "BP 118/76 · HR 70 · SpO₂ 99%", status: "stable" },
];

const HR = [
  { label: "02", value: 78 },
  { label: "03", value: 80 },
  { label: "04", value: 82 },
  { label: "05", value: 90 },
  { label: "06", value: 100 },
  { label: "07", value: 110 },
  { label: "now", value: 122 },
];

export default function DashboardReferencePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <p className="text-content-tertiary font-mono text-[10px] tracking-widest uppercase">
        Tuesday · 19 Nov · 08:14
      </p>
      <h1 className="text-content-primary mt-1 text-2xl font-semibold tracking-tight">
        Good morning, Dr. Kato
      </h1>
      <p className="text-content-secondary mt-1 text-sm">
        3 patients need review before the ward round. One is critical.
      </p>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Bed occupancy" value="86" unit="%" delta="4 vs last week" spark={[70, 72, 71, 74, 78, 80, 83, 86]} selected />
        <KpiTile label="Median wait" value="42" unit="min" delta="6 vs last week" deltaDir="down" spark={[58, 54, 49, 50, 47, 45, 44, 42]} />
        <KpiTile label="Admissions" value="18" delta="3 vs yesterday" spark={[12, 15, 11, 14, 16, 13, 17, 18]} />
        <KpiTile label="Critical now" value="3" critical footnote="on the ward" spark={[1, 1, 2, 1, 2, 2, 3, 3]} sparkTone="critical" />
      </section>

      <section className="mt-8">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-content-primary text-sm font-semibold">Care areas</h2>
          <span className="text-content-tertiary text-xs">
            colour-coded for wayfinding
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {AREAS.map((a) => (
            <Tile key={a.title} tone={a.tone} title={a.title} meta={a.meta} icon={a.icon} />
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="gap-0 p-0">
          <div className="border-line-subtle flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-content-primary text-[13.5px] font-semibold">
              Patient watchlist
            </h3>
            <a className="text-brand-primary text-xs font-semibold no-underline" href="#">
              Open ward →
            </a>
          </div>
          {WATCHLIST.map((p) => (
            <div
              key={p.bed}
              className="border-line-subtle flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
            >
              <span className="text-content-tertiary w-11 flex-none font-mono text-[11px]">
                {p.bed}
              </span>
              <span>
                <span className="text-content-primary block text-[13px] font-semibold">
                  {p.name}
                </span>
                <span className="text-content-tertiary block font-mono text-[10.5px]">
                  {p.mrn}
                </span>
              </span>
              <span className="text-content-secondary ml-auto hidden font-mono text-[11.5px] whitespace-nowrap sm:block">
                {p.vitals}
              </span>
              <StatusPill status={p.status} className="flex-none px-2.5 py-0.5 text-[11.5px]" />
            </div>
          ))}
        </Card>

        <Card className="gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-content-primary text-[13.5px] font-semibold">
              Heart rate · Bed 12
            </h3>
            <span className="text-content-tertiary font-mono text-[11px]">
              last 6h
            </span>
          </div>
          <LineChart data={HR} threshold={100} yMin={60} yMax={130} unit="bpm" gridValues={[60, 80, 100, 120]} />
        </Card>
      </div>

      <p className="text-content-tertiary mt-6 text-[11.5px]">
        Surfaces use the <span className="font-mono">@medsync/tokens</span> pastel
        wayfinding set (rose · peach · lavender · mint · coral · sky). Red, green
        and amber stay reserved for clinical status only — the pills above are the
        sole saturated hues on the page.
      </p>
    </main>
  );
}
