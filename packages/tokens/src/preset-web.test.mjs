import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const preset = require("./preset-web.cjs");
const { cssVars } = require("./theme.cjs");
const { primitives } = require("./primitives.cjs");

const RED_600 = "#DC2626";
const RED_PRIMS = new Set(Object.values(primitives.red));

test("web preset colours are var() references, not raw hex", () => {
  assert.equal(preset.theme.colors.surface.primary, "var(--ms-surface-primary)");
  assert.equal(preset.theme.colors.status.critical, "var(--ms-status-critical)");
});

test("web preset injects :root (light) and .theme-dark (dark) vars via addBase", () => {
  const bases = [];
  preset.plugins.forEach((pl) => {
    const fn = pl.handler || pl;
    fn({ addBase: (o) => bases.push(o) });
  });
  const merged = Object.assign({}, ...bases);
  assert.ok(merged[":root"], "expected :root vars");
  assert.ok(merged[".theme-dark"], "expected .theme-dark vars");
  assert.equal(merged[":root"]["--ms-surface-primary"], "#FFFFFF");
  assert.equal(merged[".theme-dark"]["--ms-surface-primary"], primitives.gray[900]);
});

test("status-critical stays red-600 in BOTH themes; nothing else uses red", () => {
  for (const mode of ["light", "dark"]) {
    const vars = cssVars(mode);
    assert.equal(vars["--ms-status-critical"], RED_600, `critical red in ${mode}`);
    for (const [name, value] of Object.entries(vars)) {
      if (RED_PRIMS.has(value)) {
        assert.ok(
          name.startsWith("--ms-status-critical"),
          `red primitive leaked into ${name} (${mode})`,
        );
      }
    }
  }
});
