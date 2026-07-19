import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KpiTile } from "@/components/ui/kpi-tile";
import { ControlsDemo } from "./controls-demo";

// Internal design-system reference. Renders the real shared primitives that
// consume @medsync/tokens — no clinical engine involved (engine-first law holds).
export const metadata = { title: "MedSync — Components" };

export default function DesignPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="text-content-tertiary font-mono text-xs tracking-widest uppercase">
        MedSync · Components
      </p>
      <h1 className="text-content-primary mt-1 text-3xl font-semibold tracking-tight">
        Shared primitives
      </h1>
      <p className="text-content-secondary mt-2 max-w-prose text-sm">
        The real components, token-driven from{" "}
        <span className="font-mono">@medsync/tokens</span>. Same source as the
        design system; no raw hex.
      </p>

      <section className="mt-10">
        <h2 className="text-content-primary text-sm font-semibold">Buttons</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button>Admit patient</Button>
          <Button variant="cta">Start ward round</Button>
          <Button variant="secondary">Assign clinician</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Discharge</Button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-content-primary text-sm font-semibold">
          Clinical status
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusPill status="stable" />
          <StatusPill status="critical" />
          <StatusPill status="caution" />
          <StatusPill status="admitted" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-content-primary text-sm font-semibold">Tags</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Tag active>Cardiology</Tag>
          <Tag>Diabetic</Tag>
          <Tag>Observation</Tag>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-content-primary text-sm font-semibold">Inputs</h2>
        <div className="mt-3 grid max-w-md gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mrn" className="text-sm font-medium">
              Medical record number
            </label>
            <Input id="mrn" inputMode="numeric" placeholder="e.g. MUL-004821" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dose" className="text-sm font-medium">
              Dose (mg)
            </label>
            <Input id="dose" defaultValue="900" invalid />
            <span className="text-feedback-error text-xs font-medium">
              Above the usual range — confirm before saving.
            </span>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-content-primary text-sm font-semibold">Controls</h2>
        <div className="mt-3">
          <ControlsDemo />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-content-primary text-sm font-semibold">
          Analytics tiles
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiTile
            label="Bed occupancy"
            value="86"
            unit="%"
            delta="4 vs last week"
            spark={[70, 72, 71, 74, 78, 80, 83, 86]}
            selected
          />
          <KpiTile
            label="Median wait"
            value="42"
            unit="min"
            delta="6 vs last week"
            deltaDir="down"
            spark={[58, 54, 49, 50, 47, 45, 44, 42]}
          />
          <KpiTile
            label="Admissions"
            value="18"
            delta="3 vs yesterday"
            spark={[12, 15, 11, 14, 16, 13, 17, 18]}
          />
          <KpiTile
            label="Critical now"
            value="3"
            critical
            footnote="on the ward"
            spark={[1, 1, 2, 1, 2, 2, 3, 3]}
            sparkTone="critical"
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-content-primary text-sm font-semibold">
          Operational surface · dark
        </h2>
        <p className="text-content-tertiary mt-1 text-xs">
          Analytics / admin / audit may opt into dark by wrapping in{" "}
          <span className="font-mono">.theme-dark</span>. Clinical surfaces
          never do — the same components simply render light.
        </p>
        <div className="theme-dark bg-surface-page border-line-subtle mt-3 flex flex-col gap-4 rounded-md border p-6">
          <div className="flex flex-wrap gap-3">
            <Button>Export</Button>
            <Button variant="secondary">Add filter</Button>
            <Button variant="ghost">Reset</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill status="stable" />
            <StatusPill status="critical" />
            <StatusPill status="caution" />
          </div>
          <Card className="max-w-sm gap-2">
            <p className="text-content-primary text-sm font-semibold">
              Median wait
            </p>
            <p className="text-content-secondary font-mono text-2xl">42 min</p>
            <p className="text-content-tertiary text-xs">▼ 6 vs last week</p>
          </Card>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-content-primary text-sm font-semibold">Card</h2>
        <Card className="mt-3 max-w-sm gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-content-primary text-sm font-semibold">
                Bed 12 · A. Nakato
              </p>
              <p className="text-content-tertiary font-mono text-xs">
                MUL-004821
              </p>
            </div>
            <StatusPill status="critical" />
          </div>
          <p className="text-content-secondary font-mono text-xs">
            BP 168/104 · HR 122 · SpO₂ 91%
          </p>
          <div className="flex gap-3">
            <Button size="sm">Open chart</Button>
            <Button size="sm" variant="secondary">
              Escalate
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
