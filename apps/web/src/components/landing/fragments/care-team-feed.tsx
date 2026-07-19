import { Card } from "@/components/ui/card";
import { F5_FEED } from "@/lib/landing-fixtures";

// F5 — the care-team feed: attributed actions with mono timestamps. This IS the
// audit trail made visible — every action has an actor and a time. Actors are
// roles/initials; no dose appears in any action.
export function CareTeamFeed({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <span className="text-content-tertiary mb-1 font-mono text-[10px] tracking-wider uppercase">
        Activity · attributed
      </span>
      <ul className="flex flex-col">
        {F5_FEED.map((e, i) => (
          <li
            key={`${e.actor}-${e.time}`}
            className={`flex items-center justify-between gap-4 py-2.5 ${
              i > 0 ? "border-line-subtle border-t" : ""
            }`}
          >
            <span className="text-sm">
              <span className="text-content-primary font-medium">{e.actor}</span>{" "}
              <span className="text-content-secondary">{e.action}</span>{" "}
              <span className="text-content-tertiary">· {e.ref}</span>
            </span>
            <span className="text-content-tertiary font-mono text-xs tabular-nums">
              {e.time}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
