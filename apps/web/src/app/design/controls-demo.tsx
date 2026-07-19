"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { Chip } from "@/components/ui/chip";

// Client island for the interactive controls (state + handlers live here so the
// /design page itself can stay a server component with metadata).
export function ControlsDemo() {
  const [range, setRange] = useState("24h");
  const [chips, setChips] = useState([
    "Ward: Internal Medicine",
    "Status: Critical",
    "Assigned to me",
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-content-tertiary font-mono text-[10px] tracking-wider uppercase">
          Segmented · {range}
        </span>
        <Segmented
          value={range}
          onValueChange={setRange}
          options={[
            { label: "6h", value: "6h" },
            { label: "12h", value: "12h" },
            { label: "24h", value: "24h" },
            { label: "7d", value: "7d" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-content-tertiary font-mono text-[10px] tracking-wider uppercase">
          Toggles
        </span>
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Show axis labels</span>
          <Switch defaultChecked />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Compare to previous shift</span>
          <Switch defaultChecked />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Show all readings</span>
          <Switch />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-content-tertiary font-mono text-[10px] tracking-wider uppercase">
          Filter chips
        </span>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <Chip
              key={c}
              onRemove={() => setChips((cur) => cur.filter((x) => x !== c))}
            >
              {c}
            </Chip>
          ))}
          {chips.length === 0 && (
            <span className="text-content-tertiary text-sm">
              All filters cleared.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
