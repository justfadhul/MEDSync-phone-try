import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";

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
