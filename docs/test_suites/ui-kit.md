# Test Suite — UI Kit (Glass Variant for Button & IconButton)

> Long-lived. Append cases; never delete. Each case has a stable ID.

## TC-UIK-001 — Glass types exported from React barrel
- area: exports/react
- preconditions: react/src/components/index.ts exists
- steps:
  1. Read react/src/components/index.ts
  2. Verify `GlassVibrancy`, `GlassOpacity`, `SpecularMode` are re-exported from the glass module
- data: N/A
- expected: All three type names appear in the barrel exports
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-002 — Glass types exported from Vue barrel
- area: exports/vue
- preconditions: vue/src/components/index.ts exists
- steps:
  1. Read vue/src/components/index.ts
  2. Verify `GlassVibrancy`, `GlassOpacity`, `SpecularMode` are re-exported from the glass module
- data: N/A
- expected: All three type names appear in the Vue barrel exports
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-003 — React Button has glass-related props in ButtonProps interface
- area: types/react
- preconditions: react/src/components/Button.tsx exists
- steps:
  1. Read react/src/components/Button.tsx lines 37-65
  2. Verify props: `glass?: boolean`, `vibrancy?: GlassVibrancy`, `glassOpacity?: GlassOpacity`, `specularMode?: SpecularMode`
- data: N/A
- expected: All four glass props present in ButtonProps with correct types
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-004 — Vue Button has glass-related props in ButtonProps interface
- area: types/vue
- preconditions: vue/src/components/Button.vue exists
- steps:
  1. Read vue/src/components/Button.vue lines 18-45
  2. Verify props: `glass?: boolean`, `vibrancy?: GlassVibrancy`, `glassOpacity?: GlassOpacity`, `specularMode?: SpecularMode`
- data: N/A
- expected: All four glass props present in Vue ButtonProps
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-005 — React IconButton has glass-related props with correct defaults
- area: types/react
- preconditions: react/src/components/IconButton.tsx exists
- steps:
  1. Read react/src/components/IconButton.tsx lines 51-78 (interface) and 80-106 (defaults)
  2. Verify props: `glass?: boolean`, `vibrancy?: GlassVibrancy`, `glassOpacity?: GlassOpacity`, `specularMode?: SpecularMode`
  3. Verify defaults: `glass = false`, `vibrancy = "medium"`, `glassOpacity = "clear"`, `specularMode = "none"`
- data: N/A
- expected: All four props present; IconButton defaults to glassOpacity="clear" and specularMode="none"
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-006 — Vue IconButton has glass-related props with correct defaults
- area: types/vue
- preconditions: vue/src/components/IconButton.vue exists
- steps:
  1. Read vue/src/components/IconButton.vue lines 39-66 (interface) and 88-101 (defaults)
  2. Verify props: `glass?: boolean`, `vibrancy?: GlassVibrancy`, `glassOpacity?: GlassOpacity`, `specularMode?: SpecularMode`
  3. Verify defaults: `glass: false`, `vibrancy: "medium"`, `glassOpacity: "clear"`, `specularMode: "none"`
- data: N/A
- expected: All four props present; IconButton defaults to glassOpacity="clear" and specularMode="none"
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-007 — getGlassFillClass returns correct frosted fill
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getGlassFillClass} = require('./common/theme/glass.ts'); console.log(getGlassFillClass('blue', 'frosted'))"`
  2. Verify output matches expected
- data: color="blue", opacity="frosted"
- expected: `"bg-blue-50/45 dark:bg-blue-500/15"`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-008 — getGlassFillClass returns correct light fill
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getGlassFillClass} = require('./common/theme/glass.ts'); console.log(getGlassFillClass('brand', 'light'))"`
- data: color="brand", opacity="light"
- expected: `"bg-blue-50/70 dark:bg-blue-500/25"` (brand resolves to blue)
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-009 — getGlassFillClass returns correct clear fill
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getGlassFillClass} = require('./common/theme/glass.ts'); console.log(getGlassFillClass('red', 'clear'))"`
- data: color="red", opacity="clear"
- expected: `"bg-red-50/20 dark:bg-red-500/5"`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-010 — getGlassFillClass handles numeric opacity
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getGlassFillClass} = require('./common/theme/glass.ts'); console.log(getGlassFillClass('green', 0.6))"`
- data: color="green", opacity=0.6
- expected: `"bg-green-50/60 dark:bg-green-500/18"` (lit=60, dark=min(60*30/100,30)=18)
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-011 — getGlassVibrancyClass returns correct presets
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getGlassVibrancyClass} = require('./common/theme/glass.ts'); console.log(getGlassVibrancyClass('low'), getGlassVibrancyClass('medium'), getGlassVibrancyClass('high'))"`
- data: vibrancy="low", "medium", "high"
- expected: `"backdrop-saturate-[1]"`, `"backdrop-saturate-[1.2]"`, `"backdrop-saturate-[1.4]"`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-012 — getGlassVibrancyClass handles numeric vibrancy
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getGlassVibrancyClass} = require('./common/theme/glass.ts'); console.log(getGlassVibrancyClass(1.3))"`
- data: vibrancy=1.3
- expected: `"backdrop-saturate-[1.3]"`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-013 — getSpecularClasses returns null for "none"
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getSpecularClasses} = require('./common/theme/glass.ts'); console.log(getSpecularClasses('none'))"`
- data: mode="none"
- expected: `null`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-014 — getSpecularClasses returns classic gradient string
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getSpecularClasses} = require('./common/theme/glass.ts'); const c=getSpecularClasses('classic'); console.log(c.includes('bg-gradient-to-r from-transparent via-white/40 to-transparent'))"`
- data: mode="classic"
- expected: `true` — string contains classic gradient pattern
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-015 — getSpecularClasses returns halo gradient string
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Run: `node -e "const {getSpecularClasses} = require('./common/theme/glass.ts'); const c=getSpecularClasses('halo'); console.log(c.includes('rounded-tl-[inherit]') && c.includes('rounded-tr-[inherit]') && c.includes('h-[28%]') && c.includes('h-[15%]'))"`
- data: mode="halo"
- expected: `true` — string contains all halo elements (corner caps + diffuse band + bottom darken)
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-016 — React Button variant="glass" renders glass classes
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "glass"` in react/ directory
  2. Verify all glass-related tests pass
- data: Button variant="glass" color="blue"
- expected: All glass variant tests pass (glass classes, fill, vibrancy, specular present)
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-017 — Vue Button variant="glass" renders glass classes
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "glass"` in vue/ directory
  2. Verify all glass-related tests pass
- data: Button variant="glass" color="blue"
- expected: All glass variant tests pass (glass classes, fill, vibrancy, specular present)
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-018 — React IconButton glass with defaults
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/IconButton.test.tsx -t "glass"` in react/ directory
  2. Verify glass tests pass with correct defaults
- data: IconButton icon="Search" glass color="blue"
- expected: Glass fill uses "clear" (20%/5%), specularMode="none" (no overlay), vibrancy="medium"
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-019 — Vue IconButton glass with defaults
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/IconButton.test.ts -t "glass"` in vue/ directory
  2. Verify glass tests pass with correct defaults
- data: IconButton icon="Search" glass color="blue"
- expected: Glass fill uses "clear" (20%/5%), specularMode="none" (no overlay), vibrancy="medium"
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-020 — React Button disabled glass renders opacity-50
- area: state/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "disabled.*glass\|glass.*disabled"` in react/ directory
  2. Verify disabled glass button has disabled:opacity-50
- data: Button variant="glass" color="blue" disabled
- expected: Button is disabled with opacity-50; glass classes still present
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-021 — Vue Button disabled glass renders opacity-50
- area: state/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "disabled.*glass\|glass.*disabled"` in vue/ directory
  2. Verify disabled glass button has disabled:opacity-50
- data: Button variant="glass" color="blue" disabled
- expected: Button is disabled with opacity-50; glass classes still present
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-022 — React Button solid+glass composes correctly
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "solid.*glass\|glass.*solid"` in react/ directory
  2. Verify solid button with glass prop renders both solid and glass classes
- data: Button variant="solid" glass color="brand"
- expected: Button has solid color classes + glass overlay (relative, backdrop-blur-sm, glass fill)
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-023 — Vue Button solid+glass composes correctly
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "solid.*glass\|glass.*solid"` in vue/ directory
  2. Verify solid button with glass prop renders both solid and glass classes
- data: Button variant="solid" glass color="brand"
- expected: Button has solid color classes + glass overlay (relative, backdrop-blur-sm, glass fill)
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-024 — React Button specularMode="classic" renders overlay div
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "classic"` in react/ directory
  2. Verify specular overlay div is rendered
- data: Button variant="glass" specularMode="classic"
- expected: Button contains a div with pointer-events-none, absolute, inset-0, and classic gradient classes
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-025 — Vue Button specularMode="classic" renders overlay div
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "classic"` in vue/ directory
  2. Verify specular overlay div is rendered
- data: Button variant="glass" specularMode="classic"
- expected: Button contains a div with pointer-events-none, absolute, inset-0, and classic gradient classes
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-026 — React Button specularMode="halo" renders overlay div
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "halo"` in react/ directory
  2. Verify specular overlay div is rendered
- data: Button variant="glass" specularMode="halo"
- expected: Button contains a div with pointer-events-none, absolute, inset-0, and halo gradient classes
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-027 — Vue Button specularMode="halo" renders overlay div
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "halo"` in vue/ directory
  2. Verify specular overlay div is rendered
- data: Button variant="glass" specularMode="halo"
- expected: Button contains a div with pointer-events-none, absolute, inset-0, and halo gradient classes
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-028 — React Button specularMode="none" renders no overlay
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "none.*specular\|specular.*none"` in react/ directory
  2. Verify no specular overlay div is rendered
- data: Button variant="glass" specularMode="none"
- expected: Button has no specular overlay div
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-029 — Vue Button specularMode="none" renders no overlay
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "none.*specular\|specular.*none"` in vue/ directory
  2. Verify no specular overlay div is rendered
- data: Button variant="glass" specularMode="none"
- expected: Button has no specular overlay div
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-030 — React Button variant="glass" auto-enables glass
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "variant.*glass"` in react/ directory
  2. Verify variant="glass" (without glass prop) renders glass classes
- data: Button variant="glass" color="blue"
- expected: Glass fill, vibrancy, and backdrop-blur-sm classes present
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-031 — Vue Button variant="glass" auto-enables glass
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "variant.*glass"` in vue/ directory
  2. Verify variant="glass" (without glass prop) renders glass classes
- data: Button variant="glass" color="blue"
- expected: Glass fill, vibrancy, and backdrop-blur-sm classes present
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-032 — React Button glassOpacity="frosted" produces 45/15
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "frosted"` in react/ directory
  2. Verify glass fill contains 45% light and 15% dark
- data: Button variant="glass" glassOpacity="frosted" color="blue"
- expected: className contains `bg-blue-50/45` and `dark:bg-blue-500/15`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-033 — Vue Button glassOpacity="frosted" produces 45/15
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "frosted"` in vue/ directory
  2. Verify glass fill contains 45% light and 15% dark
- data: Button variant="glass" glassOpacity="frosted" color="blue"
- expected: className contains `bg-blue-50/45` and `dark:bg-blue-500/15`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-034 — React Button glassOpacity="light" produces 70/25
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "light.*opacity\|opacity.*light"` in react/ directory
  2. Verify glass fill contains 70% light and 25% dark
- data: Button variant="glass" glassOpacity="light" color="blue"
- expected: className contains `bg-blue-50/70` and `dark:bg-blue-500/25`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-035 — Vue Button glassOpacity="light" produces 70/25
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "light.*opacity\|opacity.*light"` in vue/ directory
  2. Verify glass fill contains 70% light and 25% dark
- data: Button variant="glass" glassOpacity="light" color="blue"
- expected: className contains `bg-blue-50/70` and `dark:bg-blue-500/25`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-036 — React Button glassOpacity="clear" produces 20/5
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "clear"` in react/ directory
  2. Verify glass fill contains 20% light and 5% dark
- data: Button variant="glass" glassOpacity="clear" color="blue"
- expected: className contains `bg-blue-50/20` and `dark:bg-blue-500/5`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-037 — Vue Button glassOpacity="clear" produces 20/5
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "clear"` in vue/ directory
  2. Verify glass fill contains 20% light and 5% dark
- data: Button variant="glass" glassOpacity="clear" color="blue"
- expected: className contains `bg-blue-50/20` and `dark:bg-blue-500/5`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-038 — React Button vibrancy="high" produces backdrop-saturate-[1.4]
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "vibrancy"` in react/ directory
  2. Verify vibrancy="high" produces `backdrop-saturate-[1.4]`
- data: Button variant="glass" vibrancy="high"
- expected: className contains `backdrop-saturate-[1.4]`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-039 — Vue Button vibrancy="high" produces backdrop-saturate-[1.4]
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "vibrancy"` in vue/ directory
  2. Verify vibrancy="high" produces `backdrop-saturate-[1.4]`
- data: Button variant="glass" vibrancy="high"
- expected: className contains `backdrop-saturate-[1.4]`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-040 — React Button vibrancy="low" produces backdrop-saturate-[1]
- area: rendering/react
- preconditions: react package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.tsx -t "vibrancy"` in react/ directory
  2. Verify vibrancy="low" produces `backdrop-saturate-[1]`
- data: Button variant="glass" vibrancy="low"
- expected: className contains `backdrop-saturate-[1]`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-041 — Vue Button vibrancy="low" produces backdrop-saturate-[1]
- area: rendering/vue
- preconditions: vue package installed, vitest configured
- steps:
  1. Run `npx vitest run --reporter=verbose src/components/Button.test.ts -t "vibrancy"` in vue/ directory
  2. Verify vibrancy="low" produces `backdrop-saturate-[1]`
- data: Button variant="glass" vibrancy="low"
- expected: className contains `backdrop-saturate-[1]`
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-042 — React demo app builds without errors
- area: demo/react
- preconditions: react/demo/node_modules installed
- steps:
  1. Run `npx vite build` in react/demo/ directory
  2. Verify exit code 0, zero errors
- data: N/A
- expected: vite build exits 0 with zero errors/warnings
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-043 — Vue demo app builds without errors
- area: demo/vue
- preconditions: vue/demo/node_modules installed
- steps:
  1. Run `npx vite build` in vue/demo/ directory
  2. Verify exit code 0, zero errors
- data: N/A
- expected: vite build exits 0 with zero errors/warnings
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-044 — React TypeScript compilation passes
- area: types/react
- preconditions: react/package.json exists
- steps:
  1. Run `npx tsc --noEmit` in react/ directory
  2. Verify exit code 0
- data: N/A
- expected: tsc --noEmit exits 0 with zero errors
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-045 — Vue TypeScript compilation passes
- area: types/vue
- preconditions: vue/package.json exists
- steps:
  1. Run `npx vue-tsc --noEmit` in vue/ directory
  2. Verify exit code 0
- data: N/A
- expected: vue-tsc --noEmit exits 0 with zero errors
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-046 — React Button test suite passes
- area: test/react
- preconditions: react/vitest.config.ts exists
- steps:
  1. Run `npx vitest run` in react/ directory
  2. Verify all tests pass
- data: N/A
- expected: All Button + IconButton tests pass
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-047 — Vue Button test suite passes
- area: test/vue
- preconditions: vue/vitest.config.ts exists
- steps:
  1. Run `npx vitest run` in vue/ directory
  2. Verify all tests pass
- data: N/A
- expected: All Button + IconButton tests pass
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-048 — React Button demo shows disabled glass Button
- area: demo/react
- preconditions: react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx exists
- steps:
  1. Read react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx
  2. Verify a `<Button variant="glass" ... disabled>` element exists in the States section
- data: N/A
- expected: Disabled glass Button rendered in States section
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-049 — Vue Button demo shows disabled glass Button
- area: demo/vue
- preconditions: vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue exists
- steps:
  1. Read vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue
  2. Verify a `<Button variant="glass" ... disabled>` element exists in the States section
- data: N/A
- expected: Disabled glass Button rendered in States section
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-050 — React IconButton demo shows disabled glass IconButton
- area: demo/react
- preconditions: react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx exists
- steps:
  1. Read react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx
  2. Verify a `<IconButton ... variant="glass" ... disabled>` element exists in the States section
- data: N/A
- expected: Disabled glass IconButton rendered in States section
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-051 — Vue IconButton demo shows disabled glass IconButton
- area: demo/vue
- preconditions: vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue exists
- steps:
  1. Read vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue
  2. Verify a `<IconButton ... variant="glass" ... disabled>` element exists in the States section
- data: N/A
- expected: Disabled glass IconButton rendered in States section
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-052 — React Button glass renders with all 5 colors
- area: demo/react
- preconditions: react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx exists
- steps:
  1. Read react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx
  2. Verify COLORS array includes: blue, brand, red, green, purple
- data: N/A
- expected: COLORS = ["blue", "brand", "red", "green", "purple"]
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-053 — Vue Button glass renders with all 5 colors
- area: demo/vue
- preconditions: vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue exists
- steps:
  1. Read vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue
  2. Verify COLORS array includes: blue, brand, red, green, purple
- data: N/A
- expected: COLORS = ["blue", "brand", "red", "green", "purple"]
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-054 — React demo shows all 3 vibrancy levels
- area: demo/react
- preconditions: react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx exists
- steps:
  1. Read react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx
  2. Verify VIBRANCY_LEVELS = ["low", "medium", "high"]
- data: N/A
- expected: All three vibrancy levels present as selectable controls
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-055 — Vue demo shows all 3 vibrancy levels
- area: demo/vue
- preconditions: vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue exists
- steps:
  1. Read vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue
  2. Verify VIBRANCY_LEVELS = ["low", "medium", "high"]
- data: N/A
- expected: All three vibrancy levels present as selectable controls
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-056 — React demo shows all 3 opacity presets
- area: demo/react
- preconditions: react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx exists
- steps:
  1. Read react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx
  2. Verify OPACITY_PRESETS = ["frosted", "light", "clear"]
- data: N/A
- expected: All three opacity presets present as selectable controls
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-057 — Vue demo shows all 3 opacity presets
- area: demo/vue
- preconditions: vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue exists
- steps:
  1. Read vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue
  2. Verify OPACITY_PRESETS = ["frosted", "light", "clear"]
- data: N/A
- expected: All three opacity presets present as selectable controls
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-058 — React demo shows all 3 specular modes
- area: demo/react
- preconditions: react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx exists
- steps:
  1. Read react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx
  2. Verify SPECULAR_MODES = ["classic", "halo", "none"]
- data: N/A
- expected: All three specular modes present as selectable controls
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-059 — Vue demo shows all 3 specular modes
- area: demo/vue
- preconditions: vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue exists
- steps:
  1. Read vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue
  2. Verify SPECULAR_MODES = ["classic", "halo", "none"]
- data: N/A
- expected: All three specular modes present as selectable controls
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-060 — React Button demo shows all 3 sizes
- area: demo/react
- preconditions: react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx exists
- steps:
  1. Read react/demo/src/pages/UxDemo/demos/GlassButtonDemo.tsx
  2. Verify size controls include: sm, md, lg
- data: N/A
- expected: Size controls for sm, md, lg (plus xs, xl) present
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-061 — Vue Button demo shows all 3 sizes
- area: demo/vue
- preconditions: vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue exists
- steps:
  1. Read vue/demo/src/pages/UxDemo/demos/GlassButtonDemo.vue
  2. Verify size controls include: sm, md, lg
- data: N/A
- expected: Size controls for sm, md, lg (plus xs, xl) present
- added: 2026-07-04 (loop button-glass-variant)

## TC-UIK-062 — glass.ts is framework-agnostic (no React/Vue imports)
- area: utility/glass.ts
- preconditions: common/theme/glass.ts exists
- steps:
  1. Grep for `from "react"` or `from "vue"` in common/theme/glass.ts
  2. Grep for `import React` or `import * as Vue` in common/theme/glass.ts
- data: N/A
- expected: Zero React or Vue imports in glass.ts
- added: 2026-07-04 (loop button-glass-variant)