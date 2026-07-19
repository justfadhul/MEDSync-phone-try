import {
  VitalsTrend,
  ThresholdBreach,
  StatusRow,
  CareAreaTiles,
  CareTeamFeed,
  IllustrativeChip,
} from "@/components/landing/fragments";

// Isolation route — renders the five landing fragments on their own so they can
// be judged before the page is built around them (Gate L2). Not linked from the
// product; internal reference only.
export const metadata = { title: "MedSync — Landing fragments" };

function Frame({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-content-tertiary font-mono text-xs">{id}</span>
        <h2 className="text-content-primary text-sm font-semibold">{title}</h2>
        <IllustrativeChip />
      </div>
      <div className="bg-surface-secondary flex flex-wrap items-start gap-6 rounded-lg p-8">
        {children}
      </div>
    </section>
  );
}

export default function FragmentsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <p className="text-content-tertiary font-mono text-xs tracking-widest uppercase">
        MedSync · Landing fragments
      </p>
      <h1 className="text-content-primary mt-1 text-3xl font-semibold tracking-tight">
        Product fragments
      </h1>
      <p className="text-content-secondary mt-2 max-w-prose text-sm">
        Real components from <span className="font-mono">@medsync/tokens</span>{" "}
        rendering marketing fixtures — cropped, glance-legible, no full
        screenshots. The saturated status trio appears only inside F2/F3, where
        the components do their designed job.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        <Frame id="F1" title="Vitals trend">
          <VitalsTrend className="w-56" />
        </Frame>
        <Frame id="F2" title="Threshold breach">
          <ThresholdBreach className="w-full max-w-sm" />
        </Frame>
        <Frame id="F3" title="Status row">
          <StatusRow className="w-full max-w-xs" />
        </Frame>
        <Frame id="F4" title="Care-area tiles">
          <CareAreaTiles className="w-full max-w-md" />
        </Frame>
        <Frame id="F5" title="Care-team feed">
          <CareTeamFeed className="w-full max-w-md" />
        </Frame>
      </div>
    </main>
  );
}
