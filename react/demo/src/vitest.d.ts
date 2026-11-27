/*
 * The kit's vitest setup (`react/src/test-setup.ts`) installs the jest-dom
 * matchers at runtime, but it sits outside this tsconfig's `include`, so a
 * docs-page test that asserts `toBeInTheDocument()` would not typecheck. One
 * side-effect import pulls the same augmentation into this program; vitest's
 * `setupFiles` still does the real installing.
 */
import "@testing-library/jest-dom/vitest";
