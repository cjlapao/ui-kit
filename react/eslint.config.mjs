// React kit a11y gate — jsx-a11y (recommended set + the P0 rules from the
// 2026-08-30 accessibility audit) as part of `npm run lint`.
//
// Target standard: WCAG 2.1 AA (ARIA Authoring Practices as companion).
// Spec: docs/superpowers/specs/2026-08-30-react-a11y-audit.md
//
// Conventions:
// - New a11y violations fail `npm run lint` (errors).
// - Legitimate patterns (APG composites, hit-area wrappers over a native
//   control, propagation guards, focusable anchors) are exempted with an
//   inline disable THAT STATES THE REASON:
//       // eslint-disable-next-line jsx-a11y/… -- <reason>
//   In a JSX children position the directive must live in an expression
//   comment:  {/* eslint-disable-next-line jsx-a11y/… -- <reason> */}
// - `label-has-associated-control` runs at warn: its static association
//   check cannot verify labels wrapping the kit's own (custom) controls and
//   has a high false-positive rate in the demo pages. The reliable direction
//   — `control-has-associated-label` — stays an error.
// - Test files are excluded: fixture markup is not product surface.

import jsxA11y from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";

const rules = {
  ...jsxA11y.configs.recommended.rules,
  // P0-4 from the audit — not part of the recommended set.
  "jsx-a11y/no-aria-hidden-on-focusable": "error",
  // See header: static-association false positives on kit controls.
  "jsx-a11y/label-has-associated-control": "warn",
};

export default [
  {
    files: ["**/*.tsx", "**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    plugins: { "jsx-a11y": jsxA11y },
    rules,
    // Stale disables are hygiene, not violations — visible but not fatal.
    linterOptions: { reportUnusedDisableDirectives: "warn" },
  },
  {
    // The codebase carries pre-existing `eslint-disable-next-line
    // react-hooks/…` / `@typescript-eslint/…` directives. Those plugins are
    // intentionally not part of this a11y gate, but the directives must
    // still resolve — register no-op stubs with the rules kept off.
    plugins: {
      "react-hooks": {
        rules: { "exhaustive-deps": { create: () => ({}) } },
      },
      "@typescript-eslint": {
        rules: { "no-explicit-any": { create: () => ({}) } },
      },
    },
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "**/*.test.*"],
  },
];
