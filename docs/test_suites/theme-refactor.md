# Test Suite — theme-refactor

> Long-lived. Append cases; never delete. Each case has a stable ID.

## TC-001 — React package builds successfully
- area: build/react
- preconditions: Dependencies installed (node_modules present)
- steps:
  1. Run `npm run build` in react/ directory
  2. Verify exit code is 0
  3. Verify dist/ directory contains built artifacts
- data: n/a
- expected: Build completes with exit code 0; dist/index.js, dist/index.cjs, dist/index.d.ts generated
- added: 2026-07-07 (loop theme-refactor-core)

## TC-002 — Vue package builds successfully
- area: build/vue
- preconditions: Dependencies installed (node_modules present)
- steps:
  1. Run `npm run build` in vue/ directory
  2. Verify exit code is 0
  3. Verify dist/ directory contains built artifacts
- data: n/a
- expected: Build completes with exit code 0; dist/index.js, dist/index.cjs, dist/index.css generated
- added: 2026-07-07 (loop theme-refactor-core)

## TC-003 — React typecheck passes
- area: typecheck/react
- preconditions: Dependencies installed
- steps:
  1. Run `npm run lint` (tsc --noEmit) in react/ directory
  2. Verify exit code is 0
  3. Verify zero type errors
- data: n/a
- expected: tsc --noEmit exits cleanly with zero errors
- added: 2026-07-07 (loop theme-refactor-core)

## TC-004 — Vue typecheck passes
- area: typecheck/vue
- preconditions: Dependencies installed
- steps:
  1. Run `npm run lint` (vue-tsc --noEmit) in vue/ directory
  2. Verify exit code is 0
  3. Verify zero type errors
- data: n/a
- expected: vue-tsc --noEmit exits cleanly with zero errors
- added: 2026-07-07 (loop theme-refactor-core)

## TC-005 — TrueColor type exported with 21 values
- area: types/theme
- preconditions: common/theme/Theme.ts exists
- steps:
  1. Read common/theme/Theme.ts
  2. Count TrueColor union members
  3. Verify exact values: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, rose, slate, gray, zinc, neutral, stone
- data: n/a
- expected: TrueColor type exported with exactly 21 Tailwind palette color names
- added: 2026-07-07 (loop theme-refactor-core)

## TC-006 — Size type exported with correct values
- area: types/theme
- preconditions: common/theme/Theme.ts exists
- steps:
  1. Read common/theme/Theme.ts
  2. Count Size union members
  3. Verify values: xs, sm, md, lg, xl, xxl, xxxl, 2xl, 3xl, full
- data: n/a
- expected: Size type exported with 10 values
- added: 2026-07-07 (loop theme-refactor-core)

## TC-007 — Removed types not exported from Theme.ts
- area: types/theme
- preconditions: common/theme/Theme.ts exists
- steps:
  1. Search common/theme/Theme.ts for exports of: ThemeColor, ThemeSize, ModalSize, resolveColor
  2. Verify none are exported
- data: n/a
- expected: No export of ThemeColor, ThemeSize, ModalSize, or resolveColor from Theme.ts
- added: 2026-07-07 (loop theme-refactor-core)

## TC-008 — Colors array contains only TrueColor values
- area: types/theme
- preconditions: common/theme/Theme.ts exists
- steps:
  1. Read common/theme/Theme.ts
  2. Read the `colors` array definition
  3. Verify all entries are valid TrueColor values
- data: n/a
- expected: colors array contains exactly 21 TrueColor values in correct order
- added: 2026-07-07 (loop theme-refactor-core)

## TC-009 — ButtonTypes.ts imports TrueColor
- area: types/button
- preconditions: common/theme/ButtonTypes.ts exists
- steps:
  1. Read common/theme/ButtonTypes.ts
  2. Verify import statement imports TrueColor from Theme.ts
  3. Verify no import of ThemeColor
- data: n/a
- expected: ButtonTypes.ts imports TrueColor, icon accent maps keyed by TrueColor
- added: 2026-07-07 (loop theme-refactor-core)

## TC-010 — randomThemeColor.ts imports TrueColor
- area: types/theme
- preconditions: common/theme/randomThemeColor.ts exists
- steps:
  1. Read common/theme/randomThemeColor.ts
  2. Verify import of TrueColor from Theme.ts
  3. Verify RANDOM_THEME_COLORS array contains only TrueColor values
  4. Verify no semantic aliases (brand, info, success, warning, danger, parallels)
- data: n/a
- expected: Uses TrueColor type; RANDOM_THEME_COLORS has 19 TrueColor values (excludes slate, neutral)
- added: 2026-07-07 (loop theme-refactor-core)

## TC-011 — Safelist generation script runs successfully
- area: build/safelist
- preconditions: Node.js available, scripts/generate-safelist.mjs exists
- steps:
  1. Run `node scripts/generate-safelist.mjs`
  2. Verify exit code is 0
  3. Verify common/safelist.css is generated and written
  4. Check output line count
- data: n/a
- expected: Script exits 0; common/safelist.css generated with TrueColor-based entries
- added: 2026-07-07 (loop theme-refactor-core)

## TC-012 — Dead safelist files removed
- area: cleanup
- preconditions: Files should not exist
- steps:
  1. Check that common/theme/tailwind-safelist.ts does NOT exist
  2. Check that common/theme/tailwindPaletteSafelist.ts does NOT exist
- data: n/a
- expected: Both files are deleted
- added: 2026-07-07 (loop theme-refactor-core)

## TC-013 — glass.ts uses TrueColor, no resolveColor/SEMANTIC_MAP
- area: types/glass
- preconditions: common/theme/glass.ts exists
- steps:
  1. Read common/theme/glass.ts
  2. Verify getGlassFillClass() parameter typed as TrueColor
  3. Verify GLASS_COLOR_SAFELIST contains 21 TrueColor values
  4. Verify no export of resolveColor or SEMANTIC_MAP
- data: n/a
- expected: glass.ts imports TrueColor, getGlassFillClass takes TrueColor, no resolveColor/SEMANTIC_MAP
- added: 2026-07-07 (loop theme-refactor-core)

## TC-014 — No ThemeColor/ThemeSize/ModalSize/resolveColor in React component code
- area: type-integrity/react
- preconditions: react/src/components/ exists
- steps:
  1. Grep react/src/components/ for imports of: ThemeColor, ThemeSize, ModalSize, resolveColor
  2. Exclude Modal.tsx (which uses `type Size as ModalSize` alias — this is correct)
  3. Verify no other references exist
- data: n/a
- expected: Zero references to removed types in React component files (except correct Size alias in Modal.tsx)
- added: 2026-07-07 (loop theme-refactor-core)

## TC-015 — React component tone maps use TrueColor keys only
- area: type-integrity/react
- preconditions: react/src/components/ exists
- steps:
  1. Grep react/src/components/ for semantic color defaults: "brand", "info", "success", "warning", "danger", "parallels"
  2. Verify none found
- data: n/a
- expected: No semantic color keys in any React component tone maps or defaults
- added: 2026-07-07 (loop theme-refactor-core)

## TC-016 — Vue component tone maps use TrueColor keys only
- area: type-integrity/vue
- preconditions: vue/src/components/ exists
- steps:
  1. Grep vue/src/components/ for semantic color defaults: "brand", "info", "success", "warning", "danger", "parallels"
  2. Exclude test files (.test.ts)
  3. Verify none found in component source files
- data: n/a
- expected: No semantic color keys in any Vue component tone maps or defaults
- added: 2026-07-07 (loop theme-refactor-core)

## TC-017 — Vue components do not import removed types
- area: type-integrity/vue
- preconditions: vue/src/components/ exists
- steps:
  1. Grep vue/src/components/ for imports of: ThemeColor, ThemeSize, ModalSize, resolveColor
  2. Count total files with such imports
- data: n/a
- expected: Zero Vue component files import ThemeColor, ThemeSize, ModalSize, or resolveColor
- added: 2026-07-07 (loop theme-refactor-core)

## TC-018 — React Button default color is "blue"
- area: defaults/react
- preconditions: react/src/components/Button.tsx exists
- steps:
  1. Read react/src/components/Button.tsx
  2. Find the default value for `color` prop
  3. Verify it is "blue"
- data: n/a
- expected: Button default color = "blue" (not "brand")
- added: 2026-07-07 (loop theme-refactor-core)

## TC-019 — React component default colors verified
- area: defaults/react
- preconditions: React component files exist
- steps:
  1. Check Button.tsx default color = "blue"
  2. Check Textarea.tsx default tone = "neutral"
  3. Check Stepper.tsx default tone = "blue"
  4. Check Hero.tsx default tone = "blue"
  5. Check Modal.tsx confirmColor: DeleteConfirmModal = "rose", Modal = "blue"
- data: n/a
- expected: All default colors match TrueColor values per plan
- added: 2026-07-07 (loop theme-refactor-core)

## TC-020 — Vue component default colors verified
- area: defaults/vue
- preconditions: Vue component files exist
- steps:
  1. Check Button.vue default color = "blue"
  2. Check Textarea.vue default tone = "neutral"
  3. Check Stepper.vue default tone = "blue"
  4. Check Hero.vue default tone = "blue"
  5. Check Modal.vue confirmColor: DeleteConfirmModal = "rose", Modal = "blue"
- data: n/a
- expected: All default colors match TrueColor values per plan
- added: 2026-07-07 (loop theme-refactor-core)

## TC-021 — Modal uses shared Size type
- area: types/modal
- preconditions: Modal.tsx (react), Modal.vue (vue) exist
- steps:
  1. Check react/src/components/Modal.tsx uses Size type (aliased as ModalSize)
  2. Check vue/src/components/Modal.vue uses Size type (aliased as ModalSize)
  3. Verify neither imports ModalSize as a separate type from theme
- data: n/a
- expected: Both Modal files use the shared Size type
- added: 2026-07-07 (loop theme-refactor-core)

## TC-022 — Documentation: theme.md created with required sections
- area: docs
- preconditions: docs/design_system/ directory exists
- steps:
  1. Verify docs/design_system/theme.md exists
  2. Check for sections: TrueColor taxonomy, Size system, glass system overview, how to add colors, how to add sizes, migration guide
- data: n/a
- expected: theme.md exists with all required sections
- added: 2026-07-07 (loop theme-refactor-core)

## TC-023 — Documentation: ui-kit.md updated
- area: docs
- preconditions: docs/design_system/ui-kit.md exists
- steps:
  1. Read docs/design_system/ui-kit.md
  2. Verify semantic alias table removed from "Color model" section
  3. Verify redirect/reference to theme.md
- data: n/a
- expected: ui-kit.md no longer contains semantic alias table
- added: 2026-07-07 (loop theme-refactor-core)