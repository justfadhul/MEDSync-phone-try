// =============================================================================
// ESLint rule: medsync/no-raw-hex
// -----------------------------------------------------------------------------
// Fails the build on any raw hex colour literal in app component/source code.
// Colours must come from semantic design tokens (@medsync/tokens) via Tailwind
// classes or the token API — never a hex literal. This enforces the design
// system's token discipline (design system §3.3) at the literal level; the
// Tailwind preset enforces it at the class level.
// =============================================================================

const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  rules: {
    "no-raw-hex": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow raw hex colour literals in components; use semantic design tokens.",
        },
        schema: [],
        messages: {
          rawHex:
            'Raw hex colour "{{hex}}" is forbidden in components. Use a semantic design token from @medsync/tokens.',
        },
      },
      create(context) {
        function check(node, text) {
          const m = typeof text === "string" && text.match(HEX);
          if (m) {
            context.report({ node, messageId: "rawHex", data: { hex: m[0] } });
          }
        }
        return {
          Literal(node) {
            if (typeof node.value === "string") check(node, node.value);
          },
          TemplateElement(node) {
            check(node, node.value.raw);
          },
          JSXText(node) {
            check(node, node.value);
          },
        };
      },
    },
  },
};

export default plugin;
