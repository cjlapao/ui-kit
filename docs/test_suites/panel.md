# Test Suite — Panel (Liquid-Glass Specular Highlight Options)

> Long-lived. Append cases; never delete. Each case has a stable ID.

## TC-PNL-001 — React PanelSpecularMode type exported from Panel.tsx
- area: types/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read react/src/components/Panel.tsx line 34
  2. Verify type alias `PanelSpecularMode = "none" | "classic" | "halo"` exists
- data: N/A
- expected: Line contains `export type PanelSpecularMode = "none" | "classic" | "halo";`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-002 — Vue PanelSpecularMode type exported from Panel.vue
- area: types/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read vue/src/components/Panel.vue line 30
  2. Verify type alias `PanelSpecularMode = "none" | "classic" | "halo"` exists
- data: N/A
- expected: Line contains `export type PanelSpecularMode = "none" | "classic" | "halo";`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-003 — React specularHighlight prop has @deprecated JSDoc
- area: types/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read lines 125-133 of react/src/components/Panel.tsx
  2. Verify @deprecated JSDoc comment precedes specularHighlight prop
- data: N/A
- expected: JSDoc contains `@deprecated Use specularMode instead`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-004 — Vue specularHighlight prop has @deprecated JSDoc
- area: types/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read lines 120-124 of vue/src/components/Panel.vue
  2. Verify @deprecated JSDoc comment precedes specularHighlight prop
- data: N/A
- expected: JSDoc contains `@deprecated Use specularMode instead`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-005 — React specularMode prop defined with PanelSpecularMode type
- area: types/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read line 139 of react/src/components/Panel.tsx
  2. Verify `specularMode?: PanelSpecularMode` prop exists
- data: N/A
- expected: Line contains `specularMode?: PanelSpecularMode;`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-006 — Vue specularMode prop defined with PanelSpecularMode type
- area: types/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read line 130 of vue/src/components/Panel.vue
  2. Verify `specularMode?: PanelSpecularMode` prop exists
- data: N/A
- expected: Line contains `specularMode?: PanelSpecularMode;`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-007 — React specularHighlight defaults to true
- area: defaults/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read line 235 of react/src/components/Panel.tsx
  2. Verify destructuring default `specularHighlight = true`
- data: N/A
- expected: Line contains `specularHighlight = true,`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-008 — Vue specularHighlight defaults to true
- area: defaults/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read line 212 of vue/src/components/Panel.vue
  2. Verify `specularHighlight: true` in withDefaults
- data: N/A
- expected: Line contains `specularHighlight: true,`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-009 — Vue specularMode defaults to "classic"
- area: defaults/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read line 213 of vue/src/components/Panel.vue
  2. Verify `specularMode: "classic"` in withDefaults
- data: N/A
- expected: Line contains `specularMode: "classic",`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-010 — React specularMode default "classic"
- area: defaults/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read lines 235-236 of react/src/components/Panel.tsx
  2. Verify specularMode destructuring (no explicit default — resolution logic provides fallback)
- data: N/A
- expected: Resolution logic at lines 243-247 returns "classic" when specularMode is undefined and specularHighlight !== false
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-011 — React resolution logic: specularMode takes precedence
- area: logic/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read lines 243-247 of react/src/components/Panel.tsx
  2. Verify: if specularMode !== undefined, return specularMode
- data: N/A
- expected: `if (specularMode !== undefined) return specularMode;`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-012 — Vue resolution logic: specularMode takes precedence
- area: logic/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read lines 488-492 of vue/src/components/Panel.vue
  2. Verify: if props.specularMode !== undefined, return props.specularMode
- data: N/A
- expected: `if (props.specularMode !== undefined) return props.specularMode;`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-013 — React resolution logic: specularHighlight === false → "none"
- area: logic/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read line 245 of react/src/components/Panel.tsx
  2. Verify: if specularHighlight === false, return "none"
- data: N/A
- expected: `if (specularHighlight === false) return "none";`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-014 — Vue resolution logic: specularHighlight === false → "none"
- area: logic/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read line 490 of vue/src/components/Panel.vue
  2. Verify: if props.specularHighlight === false, return "none"
- data: N/A
- expected: `if (props.specularHighlight === false) return "none";`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-015 — React resolution logic: else default to "classic"
- area: logic/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read line 246 of react/src/components/Panel.tsx
  2. Verify: default return is "classic"
- data: N/A
- expected: `return "classic";`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-016 — React classic rendering: single hairline
- area: rendering/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read lines 667-675 of react/src/components/Panel.tsx
  2. Verify single <div> with classes: pointer-events-none, absolute, inset-x-0, top-0, h-px, rounded-t-[inherit], bg-gradient-to-r from-transparent via-white/40 to-transparent, dark:via-white/10, aria-hidden="true"
- data: N/A
- expected: Single div element with all expected Tailwind classes for classic hairline
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-017 — Vue classic rendering: single hairline
- area: rendering/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read lines 571-581 of vue/src/components/Panel.vue
  2. Verify single <div> with classNames binding for: pointer-events-none, absolute, inset-x-0, top-0, h-px, rounded-t-[inherit], bg-gradient-to-r from-transparent via-white/40 to-transparent, dark:via-white/10, aria-hidden="true"
- data: N/A
- expected: Single div element with all expected Tailwind classes for classic hairline
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-018 — React halo rendering: 4 elements
- area: rendering/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read lines 677-699 of react/src/components/Panel.tsx
  2. Verify exactly 4 div elements inside the halo fragment
  3. Verify TL corner cap: w-24 h-12 rounded-tl-[inherit], TR cap: w-24 h-12 rounded-tr-[inherit], diffuse band: h-[28%], bottom darken: h-[15%]
  4. Verify all 4 have pointer-events-none and aria-hidden="true"
- data: N/A
- expected: 4 div elements with correct Tailwind classes and accessibility attributes
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-019 — Vue halo rendering: 4 elements
- area: rendering/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read lines 583-604 of vue/src/components/Panel.vue
  2. Verify exactly 4 div elements inside the halo template
  3. Verify TL corner cap: w-24 h-12 rounded-tl-[inherit], TR cap: w-24 h-12 rounded-tr-[inherit], diffuse band: h-[28%], bottom darken: h-[15%]
  4. Verify all 4 have pointer-events-none and aria-hidden="true"
- data: N/A
- expected: 4 div elements with correct Tailwind classes and accessibility attributes
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-020 — React specular rendering only for liquid-glass variant
- area: rendering/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read line 665 of react/src/components/Panel.tsx
  2. Verify conditional: `variant === "liquid-glass" && resolvedSpecularMode !== "none"`
- data: N/A
- expected: Specular rendering is gated on liquid-glass variant AND resolved mode !== "none"
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-021 — Vue specular rendering only for liquid-glass variant
- area: rendering/vue
- preconditions: vue/src/components/Panel.vue exists
- steps:
  1. Read line 569 of vue/src/components/Panel.vue
  2. Verify conditional: `v-if="variant === 'liquid-glass' && resolvedSpecularMode !== 'none'"`
- data: N/A
- expected: Specular rendering is gated on liquid-glass variant AND resolved mode !== "none"
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-022 — React PanelSpecularMode exported from barrel
- area: exports/react
- preconditions: react/src/components/index.ts exists
- steps:
  1. Read lines 144-150 of react/src/components/index.ts
  2. Verify `type PanelSpecularMode` is in the Panel export block
- data: N/A
- expected: `type PanelSpecularMode,` appears in Panel export block
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-023 — Vue PanelSpecularMode exported from barrel
- area: exports/vue
- preconditions: vue/src/components/index.ts exists
- steps:
  1. Read lines 150-156 of vue/src/components/index.ts
  2. Verify `type PanelSpecularMode` is in the Panel export block
- data: N/A
- expected: `type PanelSpecularMode,` appears in Panel export block
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-024 — React demo: PanelSpecularMode imported from kit
- area: demo/react
- preconditions: react demo files exist
- steps:
  1. Read line 14 of react/demo/src/pages/UxDemo/demos/PanelDemo.tsx
  2. Read line 14 of react/src/pages/UxDemo/demos/PanelDemo.tsx
  3. Verify `type PanelSpecularMode` imported from `@cjlapao/ui-kit` (published) and `../../..` (source)
- data: N/A
- expected: Both files import `type PanelSpecularMode` from kit
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-025 — Vue demo: PanelSpecularMode imported from kit
- area: demo/vue
- preconditions: vue demo file exists
- steps:
  1. Read line 5 of vue/demo/src/pages/UxDemo/demos/PanelDemo.vue
  2. Verify `PanelSpecularMode` imported from `@cjlapao/ui-kit-vue`
- data: N/A
- expected: `type { PanelProps, PanelTone, PanelSpecularMode }` imported from `@cjlapao/ui-kit-vue`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-026 — React demo: state is useState<PanelSpecularMode>("classic")
- area: demo/react
- preconditions: react demo files exist
- steps:
  1. Read line 71 of react/demo/src/pages/UxDemo/demos/PanelDemo.tsx
  2. Read line 71 of react/src/pages/UxDemo/demos/PanelDemo.tsx
  3. Verify `useState<PanelSpecularMode>("classic")`
- data: N/A
- expected: Both files use `useState<PanelSpecularMode>("classic")` for specularMode state
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-027 — Vue demo: state is ref<PanelSpecularMode>("classic")
- area: demo/vue
- preconditions: vue demo file exists
- steps:
  1. Read line 70 of vue/demo/src/pages/UxDemo/demos/PanelDemo.vue
  2. Verify `ref<PanelSpecularMode>("classic")`
- data: N/A
- expected: `const specularMode = ref<PanelSpecularMode>("classic");`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-028 — React demo: MultiToggle with 3 options
- area: demo/react
- preconditions: react demo files exist
- steps:
  1. Read lines 337-346 of react/demo/src/pages/UxDemo/demos/PanelDemo.tsx
  2. Read lines 341-350 of react/src/pages/UxDemo/demos/PanelDemo.tsx
  3. Verify MultiToggle with options: None/none, Classic/classic, Halo/halo
- data: N/A
- expected: MultiToggle with 3 options, value bound to specularMode, onChange casts to PanelSpecularMode
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-029 — Vue demo: MultiToggle with 3 options
- area: demo/vue
- preconditions: vue demo file exists
- steps:
  1. Read lines 115-119 of vue/demo/src/pages/UxDemo/demos/PanelDemo.vue (options)
  2. Read lines 253-261 of vue/demo/src/pages/UxDemo/demos/PanelDemo.vue (selector)
  3. Verify 3 options: None/none, Classic/classic, Halo/halo
- data: N/A
- expected: specularModeOptions array with 3 entries, MultiToggle bound to specularMode
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-030 — React demo: specularMode prop on Panel instances
- area: demo/react
- preconditions: react demo files exist
- steps:
  1. Read line 100 of react/demo/src/pages/UxDemo/demos/PanelDemo.tsx
  2. Read line 132 of react/demo/src/pages/UxDemo/demos/PanelDemo.tsx
  3. Read line 100 of react/src/pages/UxDemo/demos/PanelDemo.tsx
  4. Read line 132 of react/src/pages/UxDemo/demos/PanelDemo.tsx
  5. Verify `specularMode={specularMode}` on both Panel instances in both files
- data: N/A
- expected: 4 total occurrences of `specularMode={specularMode}` (2 per file)
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-031 — Vue demo: specular-mode prop on Panel instances
- area: demo/vue
- preconditions: vue demo file exists
- steps:
  1. Read line 291 of vue/demo/src/pages/UxDemo/demos/PanelDemo.vue
  2. Read line 322 of vue/demo/src/pages/UxDemo/demos/PanelDemo.vue
  3. Verify `:specular-mode="specularMode"` on both Panel instances
- data: N/A
- expected: 2 occurrences of `:specular-mode="specularMode"`
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-032 — Zero specularHighlight references in React demos
- area: demo/react
- preconditions: react demo files exist
- steps:
  1. Grep for `specularHighlight` in react/demo/src/pages/UxDemo/demos/PanelDemo.tsx
  2. Grep for `specularHighlight` in react/src/pages/UxDemo/demos/PanelDemo.tsx
- data: N/A
- expected: 0 matches in both files — all specularHighlight replaced with specularMode
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-033 — Zero specularHighlight references in Vue demo
- area: demo/vue
- preconditions: vue demo file exists
- steps:
  1. Grep for `specularHighlight` in vue/demo/src/pages/UxDemo/demos/PanelDemo.vue
- data: N/A
- expected: 0 matches — all specularHighlight replaced with specularMode
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-034 — React Panel has zero Panel-specific type errors
- area: types/react
- preconditions: react package installed
- steps:
  1. Run `npx tsc --noEmit` in react/ directory
  2. Filter output for "Panel" errors
- data: N/A
- expected: Zero Panel.tsx-specific type errors (pre-existing errors in DynamicFormField.tsx, SmartGridLayout.tsx, gravatar.ts are unrelated)
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-035 — Vue Panel has zero Panel-specific type errors
- area: types/vue
- preconditions: vue package installed
- steps:
  1. Run `npx vue-tsc --noEmit` in vue/ directory
  2. Filter output for "Panel" errors
- data: N/A
- expected: Zero Panel.vue-specific type errors (pre-existing errors in common/utils/gravatar.ts are unrelated)
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-036 — React demo PanelDemo has zero PanelDemo-specific type errors
- area: demo/react
- preconditions: react package installed
- steps:
  1. Run `npx tsc --noEmit` in react/ directory
  2. Filter output for "PanelDemo" errors in demo/src/pages/UxDemo/demos/PanelDemo.tsx
- data: N/A
- expected: Zero PanelDemo-specific type errors
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-037 — React demo PanelDemo (source) has zero PanelDemo-specific type errors
- area: demo/react
- preconditions: react package installed
- steps:
  1. Run `npx tsc --noEmit` in react/ directory
  2. Filter output for "PanelDemo" errors in src/pages/UxDemo/demos/PanelDemo.tsx
- data: N/A
- expected: Zero PanelDemo-specific type errors
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-038 — Backward compat: specularHighlight={false} → resolved mode "none"
- area: compatibility/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read lines 243-247 of react/src/components/Panel.tsx
  2. Trace: specularMode=undefined, specularHighlight=false → resolution returns "none"
  3. Verify line 665: `resolvedSpecularMode !== "none"` → false → no specular rendering
- data: specularMode=undefined, specularHighlight=false
- expected: resolvedSpecularMode = "none", specular rendering suppressed
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-039 — Backward compat: specularHighlight={true} → resolved mode "classic"
- area: compatibility/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read lines 243-247 of react/src/components/Panel.tsx
  2. Trace: specularMode=undefined, specularHighlight=true → resolution returns "classic"
  3. Verify line 667: classic rendering rendered
- data: specularMode=undefined, specularHighlight=true
- expected: resolvedSpecularMode = "classic", classic hairline rendered
- added: 2026-07-03 (loop specular-highlight-options)

## TC-PNL-040 — Backward compat: neither prop → resolved mode "classic"
- area: compatibility/react
- preconditions: react/src/components/Panel.tsx exists
- steps:
  1. Read lines 243-247 of react/src/components/Panel.tsx
  2. Trace: specularMode=undefined, specularHighlight=undefined (default true) → resolution returns "classic"
- data: specularMode=undefined, specularHighlight=undefined
- expected: resolvedSpecularMode = "classic" (default hairline behavior preserved)
- added: 2026-07-03 (loop specular-highlight-options)