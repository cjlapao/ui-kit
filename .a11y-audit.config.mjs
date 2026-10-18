// Scratch jsx-a11y audit config — all rules enabled at "error" to surface
// the FULL gap list (recommended-severity subset is reported separately).
import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";

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
      globals: {
        React: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        NodeJS: "readonly",
      },
    },
  },
  js.configs.recommended,
  {
    plugins: { "jsx-a11y": jsxA11y },
    rules: Object.fromEntries(
      Object.entries(jsxA11y.rules).map(([name]) => [
        `jsx-a11y/${name}`,
        "error",
      ]),
    ),
  },
  {
    ignores: ["node_modules/**", "**/*.test.*", "dist/**"],
  },
];
