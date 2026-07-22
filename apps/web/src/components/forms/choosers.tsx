"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Field, controlBase } from "./field";

export type Option = { value: string; label: string; hint?: string };

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4", className)} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// --- Select — styled native select (accessible, least code, no typing) --------
export function Select({
  label, options, value, onChange, required, hint, error, placeholder = "Select…", disabled,
}: {
  label: string; options: Option[]; value: string; onChange: (v: string) => void;
  required?: boolean; hint?: string; error?: string; placeholder?: string; disabled?: boolean;
}) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id} required={required} hint={hint} error={error}>
      <div className="relative">
        <select
          id={id} value={value} disabled={disabled} aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className={cn(controlBase, "appearance-none pr-10", !value && "text-content-tertiary", error && "border-feedback-error")}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value} className="text-content-primary">{o.label}</option>)}
        </select>
        <Chevron className="text-content-tertiary pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
      </div>
    </Field>
  );
}

// --- Combobox — typeahead single-select for long lists (districts, hospitals) -
export function Combobox({
  label, options, value, onChange, required, hint, error, placeholder = "Start typing…", disabled,
}: {
  label: string; options: Option[]; value: string; onChange: (v: string) => void;
  required?: boolean; hint?: string; error?: string; placeholder?: string; disabled?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const pick = (o: Option) => { onChange(o.value); setQuery(""); setOpen(false); };

  return (
    <Field label={label} htmlFor={id} required={required} hint={hint} error={error}>
      <div className="relative">
        <input
          id={id} role="combobox" aria-expanded={open} aria-controls={`${id}-list`} autoComplete="off"
          disabled={disabled} aria-invalid={!!error}
          value={open ? query : selected?.label ?? ""}
          placeholder={selected ? selected.label : placeholder}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter" && open && filtered[active]) { e.preventDefault(); pick(filtered[active]); }
            else if (e.key === "Escape") setOpen(false);
          }}
          className={cn(controlBase, "pr-10", error && "border-feedback-error")}
        />
        <Chevron className="text-content-tertiary pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
        {open && filtered.length > 0 && (
          <ul id={`${id}-list`} role="listbox" className="border-line-subtle bg-surface-primary absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border py-1 shadow-lg">
            {filtered.map((o, i) => (
              <li key={o.value} role="option" aria-selected={o.value === value}
                onMouseDown={(e) => { e.preventDefault(); pick(o); }}
                onMouseEnter={() => setActive(i)}
                className={cn("cursor-pointer px-4 py-2.5 text-[15px]", i === active ? "bg-brand-subtle text-brand-primary" : "text-content-primary")}
              >
                {o.label}
                {o.hint && <span className="text-content-tertiary block text-xs">{o.hint}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Field>
  );
}

// --- CascadingCombobox — child options depend on the chosen parent -----------
export function CascadingCombobox({
  parentLabel, parentOptions, childLabel, childOptionsByParent,
  value, onChange, required,
}: {
  parentLabel: string; parentOptions: Option[]; childLabel: string;
  childOptionsByParent: Record<string, Option[]>;
  value: { parent: string; child: string }; onChange: (v: { parent: string; child: string }) => void;
  required?: boolean;
}) {
  const childOpts = childOptionsByParent[value.parent] ?? [];
  return (
    <div className="flex flex-col gap-4">
      <Combobox label={parentLabel} options={parentOptions} value={value.parent} required={required}
        onChange={(p) => onChange({ parent: p, child: "" })} />
      <Combobox label={childLabel} options={childOpts} value={value.child} required={required}
        disabled={!value.parent} placeholder={value.parent ? "Start typing…" : "Choose above first"}
        onChange={(c) => onChange({ ...value, child: c })} />
    </div>
  );
}

// --- Segmented — a compact single-choice control (full-time/visiting/locum) ---
export function Segmented({
  label, options, value, onChange, required,
}: { label: string; options: Option[]; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <Field label={label} required={required}>
      <div role="radiogroup" className="border-line-default bg-surface-secondary inline-flex w-full rounded-xl border p-1">
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn("h-9 flex-1 rounded-lg text-sm font-medium transition-colors",
              value === o.value ? "bg-surface-primary text-content-primary shadow-sm" : "text-content-secondary")}
          >{o.label}</button>
        ))}
      </div>
    </Field>
  );
}

// --- RadioCards — a taller single-choice with descriptions (care-context) -----
export function RadioCards({
  label, options, value, onChange, required,
}: { label: string; options: Option[]; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <Field label={label} required={required}>
      <div role="radiogroup" className="flex flex-col gap-2.5">
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn("rounded-xl border px-4 py-3 text-left transition-colors",
              value === o.value ? "border-brand-primary bg-brand-subtle" : "border-line-default bg-surface-primary")}
          >
            <span className="text-content-primary block text-sm font-medium">{o.label}</span>
            {o.hint && <span className="text-content-secondary mt-0.5 block text-xs">{o.hint}</span>}
          </button>
        ))}
      </div>
    </Field>
  );
}

// --- MultiSelect — chip-based multi-choice (qualifications) -------------------
export function MultiSelect({
  label, options, value, onChange, required, hint,
}: { label: string; options: Option[]; value: string[]; onChange: (v: string[]) => void; required?: boolean; hint?: string }) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <Field label={label} required={required} hint={hint}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <button key={o.value} type="button" aria-pressed={on} onClick={() => toggle(o.value)}
              className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                on ? "border-brand-primary bg-brand-subtle text-brand-primary" : "border-line-default bg-surface-primary text-content-secondary")}
            >{o.label}</button>
          );
        })}
      </div>
    </Field>
  );
}
