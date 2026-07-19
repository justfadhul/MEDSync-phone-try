import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { primitives } = require("./primitives.cjs");
const { semantic } = require("./semantic.cjs");
const { resolveTheme } = require("./theme.cjs");
const preset = require("./preset.cjs");

const RED_600 = "#DC2626";
const RED_PRIMITIVES = new Set(Object.values(primitives.red));

test("every semantic token defines BOTH light and dark (dark is complete)", () => {
  for (const [name, entry] of Object.entries(semantic)) {
    assert.ok(entry.light, `${name} missing light value`);
    assert.ok(entry.dark, `${name} missing dark value`);
  }
});

test("status-critical is the ONLY semantic token that resolves to red-600", () => {
  const light = resolveTheme("light");
  const dark = resolveTheme("dark");
  for (const [name, value] of Object.entries(light)) {
    if (value === RED_600) {
      assert.ok(
        name.startsWith("status-critical"),
        `red-600 leaked into non-critical token "${name}" (light)`,
      );
    }
  }
  for (const [name, value] of Object.entries(dark)) {
    if (value === RED_600) {
      assert.ok(
        name.startsWith("status-critical"),
        `red-600 leaked into non-critical token "${name}" (dark)`,
      );
    }
  }
});

test("no non-emergency token resolves to ANY red primitive", () => {
  const forbidden = ["feedback-error", "feedback-warning", "action-destructive"];
  for (const mode of ["light", "dark"]) {
    const resolved = resolveTheme(mode);
    for (const [name, value] of Object.entries(resolved)) {
      const isNonEmergency = forbidden.some((f) => name.startsWith(f));
      if (isNonEmergency) {
        assert.ok(
          !RED_PRIMITIVES.has(value),
          `non-emergency token "${name}" uses red primitive ${value} (${mode})`,
        );
      }
    }
  }
});

test("error/destructive/danger/warning names never resolve to red-600", () => {
  for (const mode of ["light", "dark"]) {
    const resolved = resolveTheme(mode);
    for (const [name, value] of Object.entries(resolved)) {
      if (/error|destructive|danger|warning/.test(name)) {
        assert.notEqual(
          value,
          RED_600,
          `"${name}" resolves to red-600 (${mode}) — red is clinical-only`,
        );
      }
    }
  }
});

test("Tailwind preset removes the default palette (no raw gray/emerald/red groups)", () => {
  const colors = preset.theme.colors;
  // Only semantic groups + transparent/current are allowed.
  const allowed = new Set([
    "transparent",
    "current",
    "surface",
    "content",
    "line",
    "brand",
    "focus",
    "status",
    "feedback",
    "action",
    "tint", // categorical wayfinding pastels (decorative, non-clinical)
    "accent",
  ]);
  for (const key of Object.keys(colors)) {
    assert.ok(allowed.has(key), `unexpected colour group "${key}" in preset`);
  }
  assert.equal(colors.emerald, undefined);
  assert.equal(colors.zinc, undefined);
  assert.equal(colors.gray, undefined);
});

test("preset exposes the clinical status channel with red-600 for critical", () => {
  assert.equal(preset.theme.colors.status.critical, RED_600);
  assert.equal(preset.theme.colors.status.stable, primitives.green[600]);
  assert.equal(preset.theme.colors.status.caution, primitives.amber[500]);
});
