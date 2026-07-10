# Test Suite — theme-refactor

> Long-lived. Append cases; never delete. Each case has a stable ID.

## TC {CAP}-001 — React package build
- area: build/react
- preconditions: feature/theme-refactor-core branch checked out, dependencies installed
- steps:
  1. cd react && npm run build
- data: N/A
- expected: exits 0; dist/index.js, dist/index.cjs, DTS generated
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-002 — Vue package build
- area: build/vue
- preconditions: feature/theme-refactor-core branch checked out, dependencies installed
- steps:
  1. cd vue && npm run build
- data: N/A
- expected: exits 0; vite build 375 modules, vue-tsc clean, tailwindcss dist generated
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-003 — React typecheck (tsc --noEmit)
- area: typecheck/react
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. cd react && npx tsc --noEmit
- data: N/A
- expected: exits 0, zero errors
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-004 — Vue typecheck (vue-tsc --noEmit)
- area: typecheck/vue
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. cd vue && npx vue-tsc --noEmit
- data: N/A
- expected: exits 0, zero errors
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-005 — TrueColor has 21 Tailwind palette colors
- area: core/types
- preconditions: N/A
- steps:
  1. Read common/theme/Theme.ts
  2. Count members of TrueColor union type
- data: N/A
- expected: TrueColor = 21 members: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, rose, slate, gray, zinc, neutral, stone
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-006 — Size type has correct values
- area: core/types
- preconditions: N/A
- steps:
  1. Read common/theme/Theme.ts
  2. Count members of Size union type
- data: N/A
- expected: Size = 10 values: xs, sm, md, lg, xl, xxl, xxxl, 2xl, 3xl, full
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-007 — Removed types not exported
- area: core/types
- preconditions: N/A
- steps:
  1. Grep Theme.ts for exports of ThemeColor, ThemeSize, ModalSize, resolveColor
  2. Grep react/src/theme/ and vue/src/theme/ for any of these names
- data: N/A
- expected: Zero exports or references to ThemeColor, ThemeSize, ModalSize, or resolveColor in theme module or re-export chains
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-008 — colors array uses TrueColor type
- area: core/types
- preconditions: N/A
- steps:
  1. Read common/theme/Theme.ts
  2. Verify `const colors: TrueColor[]` has exactly 21 values in order (red through stone)
- data: N/A
- expected: colors: TrueColor[] with exactly 21 TrueColor values in correct Tailwind palette order
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-009 — ButtonTypes imports TrueColor
- area: core/types
- preconditions: N/A
- steps:
  1. Read common/theme/ButtonTypes.ts
  2. Verify import and usage of TrueColor
- data: N/A
- expected: ButtonTypes.ts imports TrueColor from Theme.ts; icon accent maps keyed by TrueColor
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-010 — randomThemeColor imports TrueColor
- area: core/types
- preconditions: N/A
- steps:
  1. Read common/theme/randomThemeColor.ts
  2. Verify import and usage of TrueColor
- data: N/A
- expected: randomThemeColor.ts imports TrueColor; RANDOM_THEME_COLORS contains 19 TrueColor values (excludes slate/neutral)
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-011 — Safelist generation works
- area: build/safelist
- preconditions: N/A
- steps:
  1. node scripts/generate-safelist.mjs
  2. Check exit code and output file
- data: N/A
- expected: exits 0; common/safelist.css generated (766 lines)
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-012 — Dead safelist files removed
- area: build/safelist
- preconditions: N/A
- steps:
  1. Check common/theme/tailwind-safelist.ts does not exist
  2. Check common/theme/tailwindPaletteSafelist.ts does not exist
- data: N/A
- expected: Both files confirmed deleted
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-013 — glass.ts uses TrueColor
- area: core/glass
- preconditions: N/A
- steps:
  1. Read common/theme/glass.ts
  2. Verify imports, getGlassFillClass signature, GLASS_COLOR_SAFELIST
  3. Verify no resolveColor or SEMANTIC_MAP
- data: N/A
- expected: glass.ts imports TrueColor; getGlassFillClass() takes TrueColor; GLASS_COLOR_SAFELIST has 21 TrueColor values; no resolveColor/SEMANTIC_MAP exports
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-014 — No removed type imports in React components
- area: components/react
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Grep all react/src/components/*.tsx for imports of ThemeColor, ThemeSize, ModalSize, resolveColor
  2. Grep for resolveColor() call sites
- data: N/A
- expected: Zero references to removed type imports; Modal.tsx uses `type Size as ModalSize` alias (not a removed type)
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-015 — React tone maps TrueColor-only
- area: components/react
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Grep react/src/components/ for semantic color keys ("brand", "info", "success", "warning", "danger", "parallels", "theme")
  2. Filter out non-tone-context matches (validation status types, variant names)
- data: N/A
- expected: Zero semantic color keys in tone maps or default color assignments. Matches only in validation status types and variant names (not tone colors).
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-016 — Vue tone maps TrueColor-only
- area: components/vue
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Grep vue/src/components/*.vue for semantic color keys
  2. Grep for tone/default color assignments with semantic values
- data: N/A
- expected: Zero semantic color keys in tone maps or default color assignments
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-017 — Vue no removed type imports
- area: components/vue
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Grep all vue/src/components/*.vue for imports of ThemeColor, ThemeSize, ModalSize, resolveColor
  2. Grep for removeColor() call sites
- data: N/A
- expected: Zero Vue component files import ThemeColor, ThemeSize, ModalSize, or resolveColor from theme modules
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-018 — React Button default is "blue"
- area: components/react/defaults
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Read react/src/components/Button.tsx
  2. Find default color prop value
- data: N/A
- expected: Button default color = "blue"
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-019 — React default colors correct
- area: components/react/defaults
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Check default colors in Button, Textarea, Stepper, Hero, Modal
- data: N/A
- expected: Button="blue", Textarea="neutral", Stepper="blue", Hero="blue", Modal confirmColor="blue"/"rose"
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-020 — Vue default colors correct
- area: components/vue/defaults
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Check default colors in Button, Textarea, Stepper, Hero, Modal, InlinePanel
- data: N/A
- expected: Button="blue", Textarea="neutral", Stepper="blue", Hero="blue", Modal confirmColor="rose"/"blue", InlinePanel confirmColor="rose"
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-021 — Modal uses shared Size type
- area: components/modal
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Check Modal.tsx and Modal.vue for Size type usage
- data: N/A
- expected: Both React and Vue Modal use shared Size type (aliased as ModalSize if needed); no separate ModalSize import or definition
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-022 — Documentation: theme.md exists and comprehensive
- area: docs
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Check docs/design_system/theme.md exists
  2. Verify sections: TrueColor taxonomy, Size system, glass system, how-to-add, migration guide
- data: N/A
- expected: theme.md exists with all required sections covering TrueColor taxonomy (21 colors), Size system (10 values), glass system overview, how-to-add color/size procedures, migration guide
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-023 — Documentation: ui-kit.md updated
- area: docs
- preconditions: feature/theme-refactor-core branch checked out
- steps:
  1. Check docs/design_system/ui-kit.md
  2. Verify semantic alias table removed, TrueColor references added, redirect to theme.md
- data: N/A
- expected: ui-kit.md exists, semantic alias table removed, references TrueColor and redirects to theme.md
- added: 2026-07-07 (loop theme-refactor-core)

## TC {CAP}-024 — Padding type exported from Theme.ts
- area: core/types
- preconditions: N/A
- steps:
  1. Read common/theme/Theme.ts
  2. Verify `export type Padding` with exactly 6 values
- data: N/A
- expected: `export type Padding = "none" | "xs" | "sm" | "md" | "lg" | "xl"` present in Theme.ts
- added: 2026-07-10 (loop toggle-type-unification)
- new: true

## TC {CAP}-025 — getPaddingClass() returns correct Tailwind classes
- area: core/types
- preconditions: N/A
- steps:
  1. Read common/theme/Theme.ts
  2. Verify getPaddingClass switch-case mapping for all 6 Padding values
- data: N/A
- expected: getPaddingClass("none") → "", getPaddingClass("xs") → "p-0.5", getPaddingClass("sm") → "p-1", getPaddingClass("md") → "p-1.5", getPaddingClass("lg") → "p-2", getPaddingClass("xl") → "p-3"
- added: 2026-07-10 (loop toggle-type-unification)
- new: true

## TC {CAP}-026 — No ToggleSize/MultiToggleSize/TogglePadding type refs in source
- area: components/react
- preconditions: feature/toggle-type-unification branch checked out
- steps:
  1. Grep react/src/ for `ToggleSize`, `MultiToggleSize`, `TogglePadding` as type names or imports
  2. Distinguish local variable names (e.g. `toggleSize`) from type references
- data: N/A
- expected: Zero type-level references to ToggleSize, MultiToggleSize, or TogglePadding. Local state variable names like `toggleSize` are acceptable; they must use shared Size type annotation.
- added: 2026-07-10 (loop toggle-type-unification)
- new: true

## TC {CAP}-027 — No ToggleSize/MultiToggleSize/TogglePadding type refs in Vue source
- area: components/vue
- preconditions: feature/toggle-type-unification branch checked out
- steps:
  1. Grep vue/src/ for `ToggleSize`, `MultiToggleSize`, `TogglePadding` as type names or imports
  2. Distinguish internal impl aliases (e.g. `ToggleSizeImpl = Extract<Size, ...>`) from public type references
- data: N/A
- expected: Zero references to removed public types. Internal implementation aliases using Extract<> for Record keying are acceptable.
- added: 2026-07-10 (loop toggle-type-unification)
- new: true

## TC {CAP}-028 — React Toggle uses shared Size type
- area: components/react/toggle
- preconditions: feature/toggle-type-unification branch checked out
- steps:
  1. Read react/src/components/Toggle.tsx
  2. Verify size prop typed as Size (or subset), import from Theme
  3. Verify no ToggleSize definition or export remains
- data: N/A
- expected: Toggle.tsx imports Size from Theme; uses Size for size prop; default "md"; no ToggleSize type definition or export
- added: 2026-07-10 (loop toggle-type-unification)
- new: true

## TC {CAP}-029 — Vue Toggle uses shared Size type
- area: components/vue/toggle
- preconditions: feature/toggle-type-unification branch checked out
- steps:
  1. Read vue/src/components/Toggle.vue
  2. Verify size prop typed as Size (or Extract<> subset), import from Theme
  3. Verify no ToggleSize definition or export remains
- data: N/A
- expected: Toggle.vue imports Size from Theme; uses Size (or Extract<Size, "sm"|"md"|"lg"> via impl alias) for size prop; default "md"; no ToggleSize type definition or export
- added: 2026-07-10 (loop toggle-type-unification)
- new: true

## TC {CAP}-030 — theme.md documents Padding type and migration guide
- area: docs
- preconditions: feature/toggle-type-unification branch checked out
- steps:
  1. Read docs/design_system/theme.md
  2. Verify Section 3 "Padding Type" exists with type definition, mapping table, getPaddingClass() docs
  3. Verify Migration Guide includes entries for ToggleSize→Size, MultiToggleSize→Size, TogglePadding→Padding
- data: N/A
- expected: theme.md has dedicated Padding section (type + mapping + helper function + component usage table); Migration Guide items cover all three old type migrations
- added: 2026-07-10 (loop toggle-type-unification)
- new: true