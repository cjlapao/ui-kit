# Theme System — Architecture

> Source of truth for the ui-kit theme: how colors, sizes, and glass styling work across both the React (`@cjlapao/ui-kit`) and Vue (`@cjlapao/ui-kit-vue`) packages.

## Overview

The theme system lives in `common/theme/` and is the single source of truth for both frameworks. Each framework package re-exports everything from `common/theme/` through thin stub files (e.g. `react/src/theme/Theme.ts` → `../../../common/theme/Theme`). Components in both `react/src/components/` and `vue/src/components/` consume the theme via these re-exports.

**Key principle:** every dynamic class string uses template literals like `` `bg-${color}-500` ``. Because Tailwind v4's JIT compiler only scans static source strings, a generated safelist in `common/safelist.css` is required to expose all possible combinations at build time.

---

## 1. Color Taxonomy — TrueColor

### The only valid color type

**`TrueColor`** is the single color type for the entire ui-kit. It contains **21 Tailwind palette color names** — every named color from Tailwind's palette.

```ts
// common/theme/Theme.ts
export type TrueColor =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone";
```

### Shade range

Every TrueColor supports **9 Tailwind shades**: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `900`. No `white` or `black` shades exist in the color system — for light backgrounds, use `slate-50` or `neutral-50`.

### Complete color list

| # | Color name | Typical use |
|---|------------|-------------|
| 1 | `red` | Destructive, urgent |
| 2 | `orange` | Attention, caution |
| 3 | `amber` | Warning, moderate attention |
| 4 | `yellow` | Highlight, emphasis |
| 5 | `lime` | Fresh, energetic accents |
| 6 | `green` | Success, positive states |
| 7 | `emerald` | Premium success, nature themes |
| 8 | `teal` | Calm, professional |
| 9 | `cyan` | Info, secondary data |
| 10 | `sky` | Friendly info, secondary accent |
| 11 | `blue` | **Primary brand color** (default for most components) |
| 12 | `indigo` | Depth, enterprise feel |
| 13 | `violet` | Creativity, premium |
| 14 | `purple` | Rich, distinctive |
| 15 | `fuchsia` | Vibrant, bold |
| 16 | `rose` | Error, destructive, love |
| 17 | `slate` | Neutral, UI chrome |
| 18 | `gray` | Neutral fallback |
| 19 | `zinc` | Cool neutral, modern |
| 20 | `neutral` | Warm neutral, default fallback |
| 21 | `stone` | Earthy neutral |

### Classes generated per color

For each TrueColor, the theme generates class strings for 17+ component types. Each component variant produces patterns like:

```text
bg-{color}-500 text-white shadow-sm hover:bg-{color}-400 focus-visible:ring-2 focus-visible:ring-{color}-500 dark:bg-{color}-400
```

The full set of utility patterns covered in the safelist:

| Pattern group | Shades used | Example |
|---------------|-------------|---------|
| `bg-{color}-*` | 50–900 | `bg-blue-500` |
| `text-{color}-*` | 50–900 | `text-blue-600` |
| `border-{color}-*` | 200, 300, 500 | `border-blue-200` |
| `hover:bg-{color}-*` | 100, 400 | `hover:bg-blue-100` |
| `hover:text-{color}-*` | 500 | `hover:text-blue-500` |
| `hover:border-{color}-*` | 200 | `hover:border-blue-200` |
| `dark:bg-{color}-*` | 300–900 | `dark:bg-blue-400` |
| `dark:text-{color}-*` | 50–700, 900 | `dark:text-blue-200` |
| `dark:border-{color}-*` | 300, 500, 700 | `dark:border-blue-500` |
| `focus-visible:ring-{color}-*` | 400, 500 | `focus-visible:ring-blue-500` |
| `dark:hover:bg-{color}-*` | 300, 500 | `dark:hover:bg-blue-500` |
| `dark:hover:text-{color}-*` | 100–300 | `dark:hover:text-blue-300` |
| `peer-checked:bg-{color}-*` | 500 | `peer-checked:bg-blue-500` |
| `accent-{color}-*` | 600 | `accent-blue-600` |
| `after:bg-{color}-*` | 500 | `after:bg-blue-500` |

### Removed semantic aliases

The following semantic color names were **removed entirely** from the system. They previously mapped to TrueColor values via `resolveColor()`:

| Old name | Resolved to | Role |
|----------|-------------|------|
| `brand` | `blue` | Primary brand accent (was the default `color` prop on most components) |
| `info` | `sky` | Informational state |
| `success` | `emerald` | Success / positive state |
| `warning` | `amber` | Warning state |
| `danger` | `rose` | Error / destructive state |
| `theme` | `neutral` | Neutral UI chrome |
| `parallels` | `red` | Product-specific accent |
| `white` | *(none)* | Not a real Tailwind color — had no shade scale |

These aliases no longer exist in any type, constant, or component. If you encounter them in old code, replace them with the corresponding TrueColor value (see the migration guide below).

---

## 2. Size System

### Shared `Size` type

A single `Size` type with **10 values** is defined in `common/theme/Theme.ts`. It serves as the shared vocabulary across all components and both frameworks:

```ts
export type Size =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl"
  | "2xl"
  | "3xl"
  | "full";
```

### Component usage

Not every component accepts every size value or padding option. The table below shows each component's accepted `Size` values alongside its `Padding` support (if any). Components use either the shared `Size` type directly, or a component-local subset that remains assignable to `Size`.

| Component | Size | Padding | Notes |
|-----------|------|---------|-------|
| **Button** | `xs`, `sm`, `md`, `lg`, `xl` | — | Controls padding, text size, icon dimensions |
| **IconButton** | `xs`, `sm`, `md`, `lg`, `xl` | — | Reuses ButtonSize |
| **Spinner** | `xs`, `sm`, `md`, `lg`, `xl` | — | Controls spinner diameter |
| **Toggle** | `sm`, `md`, `lg` | `none`–`xl` | Uses shared `Size` + `Padding` types |
| **CollapsiblePanel** | — | `none`–`xl` | Accepts `Padding`; delegates to child Panel |
| **Modal** | All 10 values | — | Dialog width presets; `full` = full-screen |
| **Hero** | Title: `xs`–`xl`<br/>Subtitle: `xs`–`md` | `none`–`xl` | Typography sizes; local `HeroPadding` |
| **Pill** | `xs`, `sm`, `md`, `lg` | — | Chip sizing |
| **Badge** | N/A | — | Always small; no size prop |
| **Section / SectionCard** | `xs`, `sm`, `md`, `lg` | — | Padding presets via tokens |
| **InfoRow** | `xs`, `sm`, `md`, `lg` | `none`–`lg` | Row height + text size; local `InfoRowPadding` |
| **Input / Textarea / Select** | `sm`, `md`, `lg` | — | Form field heights |
| **InputGroup** | `sm`, `md`, `lg` | — | Input group heights |
| **MultiToggle** | `sm`, `md`, `lg` | — | Segmented control height; uses shared `Size` |
| **Accordion** | `sm`, `md`, `lg` | — | Header height + text size |
| **Stepper** | `sm`, `md`, `lg` | — | Step indicator size |
| **StatGraphTile** | `xs`, `sm`, `md`, `lg` | — | Chart area size |
| **SplitView** | `sm`, `md`, `lg` | — | Panel size |
| **Tabs** | `sm`, `md`, `lg` | — | Tab bar height |
| **Loader** | `sm`, `md`, `lg` | — | Loader diameter |
| **StatusSpinner** | `xs`, `sm`, `md`, `lg` | — | Inline spinner size |
| **EmptyState** | `xs`, `sm`, `md`, `lg`, `xl` | — | Title/subtitle text |
| **Icon** | `xs`, `sm`, `md`, `lg`, `xl` | — | Icon dimensions |
| **Progress** | `xs`, `sm`, `md`, `lg` | — | Bar thickness |

### Adding a new size

The shared `Size` type lives in `common/theme/Theme.ts`. To add a new size value (e.g. `"4xl"`):

1. Add the value to the `Size` union in `common/theme/Theme.ts`:
   ```ts
   export type Size =
     | "xs" | "sm" | "md" | "lg" | "xl"
     | "xxl" | "xxxl" | "2xl" | "3xl" | "4xl" | "full";
   ```

2. In the target component, add the new value to the component's local size type (e.g. `ButtonSize` in `react/src/components/Button.tsx`).

3. Add the corresponding size style entry in the component's size mapping record. For Button, this is the `sizeStyles` record:
   ```ts
   sizeStyles: Record<ButtonSize, { ... }> = {
     // ...existing sizes...
     "4xl": {
       base: "px-12 py-5 text-xl",
       iconOnly: "p-5 text-xl",
       gap: "gap-4",
       icon: "h-8 w-8",
       spinner: "h-8 w-8",
     },
   };
   ```

4. If the component's size type is a subset of `Size`, it should remain assignable to `Size`. If you need a size that is genuinely component-specific, keep it in the component-local type.

---

## 3. Padding Type

### Shared `Padding` type

A single `Padding` type with **6 values** is defined in `common/theme/Theme.ts`. It provides a uniform vocabulary for padding across Toggle, CollapsiblePanel, and any future component that needs structured padding control:

```ts
// common/theme/Theme.ts
export type Padding =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";
```

### Mapping to Tailwind classes

| Value | Tailwind class | Spacing |
|-------|---------------|---------|
| `"none"` | *(empty string)* | No padding |
| `"xs"` | `p-0.5` | 2px (0.125rem) |
| `"sm"` | `p-1` | 4px (0.25rem) |
| `"md"` | `p-1.5` | 6px (0.375rem) |
| `"lg"` | `p-2` | 8px (0.5rem) |
| `"xl"` | `p-3` | 12px (0.75rem) |

### Helper function — `getPaddingClass(padding)`

Returns the corresponding Tailwind padding class string for a given `Padding` value. Used internally by components to compose the final `className`:

```ts
import { getPaddingClass, type Padding } from "@cjlapao/ui-kit";

getPaddingClass("none") // → ""
getPaddingClass("xs")   // → "p-0.5"
getPaddingClass("sm")   // → "p-1"
getPaddingClass("md")   // → "p-1.5"
getPaddingClass("lg")   // → "p-2"
getPaddingClass("xl")   // → "p-3"
```

**Parameters:**
- `padding` (`Padding`) — One of `"none"`, `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`

**Return value:** A Tailwind class string (or `""` for `"none"`). The return type is `string`.

### Component usage

Only a subset of components accept the shared `Padding` type. Others define local padding types (e.g. `PanelPadding`, `HeroPadding`) or omit padding entirely:

| Component | Padding prop | Accepted values | Notes |
|-----------|-------------|-----------------|-------|
| **Toggle** | `padding?: Padding` | `none`, `xs`, `sm`, `md`, `lg`, `xl` | Default: `undefined` (no padding) |
| **CollapsiblePanel** | `padding?: Padding` | `none`, `xs`, `sm`, `md`, `lg`, `xl` | Passes resolved class to child Panel |
| **Panel** | `padding?: PanelPadding` | `none`, `xs`, `sm`, `md`, `lg` | Local type; does not include `"xl"` |
| **Hero** | `padding?: HeroPadding` | `none`, `xs`, `sm`, `md`, `lg`, `xl` | Local type with its own mapping |
| **InfoRow** | `padding?: InfoRowPadding` | `none`, `xs`, `sm`, `md`, `lg` | Local type with default padding tokens |
| **TimelinePanel** | `padding?: TimelinePanelPadding` | `none`, `xs`, `sm`, `md`, `lg` | Re-exports `PanelPadding` |
| Other components | — | (no padding prop) | Omit padding entirely |

---

## 4. Glass System

The glass system lives in `common/theme/glass.ts` and provides framework-agnostic utilities for frosted-glass styling. It is used by the Button `glass` variant, the Panel glass variant, and any other component that needs a glass surface.

### Types

#### GlassVibrancy

Controls how much the background behind the glass is saturated:

```ts
export type GlassVibrancy = "low" | "medium" | "high" | number;
```

| Value | Multiplier | Result |
|-------|------------|--------|
| `"low"` | 1.0× | Baseline saturation |
| `"medium"` | 1.2× | Subtle boost (default) |
| `"high"` | 1.4× | Strong color pop |
| `number` | N× | Arbitrary multiplier (0–2 recommended) |

#### GlassOpacity

Controls the fill transparency of the glass surface:

```ts
export type GlassOpacity = "frosted" | "light" | "clear" | number;
```

| Value | Light opacity | Dark opacity | Visual effect |
|-------|---------------|--------------|---------------|
| `"frosted"` | 55% | 25% | Standard frosted glass (default) |
| `"light"` | 75% | 35% | More translucent, lighter |
| `"clear"` | 30% | 10% | Minimal tint, nearly clear |
| `number` | `round(frac × 100)`% | `min(round(frac × 30), 30)`% | Custom fraction (0–1) |

#### SpecularMode

Controls the specular highlight overlay (the "light reflection" on the glass):

```ts
export type SpecularMode = "none" | "classic" | "halo";
```

| Mode | Effect |
|------|--------|
| `"none"` | No specular overlay |
| `"classic"` | Soft top-edge hairline reflection (single gradient band, 10px tall) |
| `"halo"` | Corner caps (top-left + top-right) + diffuse top glow band + bottom darken |

### Functions

#### `getGlassFillClass(color, opacity)`

Generates the Tailwind fill classes for a glass surface.

```ts
getGlassFillClass("blue", "frosted")
// → "bg-blue-100/55 hover:bg-blue-100/65 dark:bg-blue-600/25 dark:hover:bg-blue-600/35"
```

**Parameters:**
- `color` (`TrueColor`) — The color to use for the glass fill
- `opacity` (`GlassOpacity`) — Opacity preset or numeric fraction

**Behavior:**
- Light mode: `bg-{color}-100/{opacity%}` + `hover:bg-{color}-100/{opacity+10%}`
- Dark mode: `dark:bg-{color}-600/{darkOpacity%}` + `dark:hover:bg-{color}-600/{darkOpacity+10%}`
- Unknown colors fall back to `neutral` to prevent invalid CSS

#### `getGlassVibrancyClass(vibrancy)`

Maps a vibrancy setting to a Tailwind `backdrop-saturate` arbitrary value.

```ts
getGlassVibrancyClass("medium")
// → "backdrop-saturate-[1.2]"
```

**Note:** The `backdrop-saturate-[1]`, `backdrop-saturate-[1.2]`, and `backdrop-saturate-[1.4]` utilities must be declared in the Tailwind styles (in `react/src/styles.css` and `vue/src/styles.css` via `@layer utilities`) because Tailwind v4 does not auto-generate arbitrary backdrop filters.

#### `getSpecularClasses(mode)`

Returns class strings for specular highlight overlays, or `null` for `"none"`.

```ts
getSpecularClasses("classic")
// → "pointer-events-none absolute inset-x-0 top-0 h-[10px] bg-gradient-to-b from-white/12 via-white/4 to-transparent dark:from-white/5 dark:via-white/2"

getSpecularClasses("halo")
// → "pointer-events-none absolute top-0 left-0 w-[40%] h-[35%] rounded-tl-[inherit] bg-gradient-to-br from-white/10 via-white/4 to-transparent ..."
```

### Glass in components

Components that support glass styling (e.g. Button with `glass={true}`) compose these three functions together:

```tsx
// Button glass example
const fill = getGlassFillClass(color, glassOpacity ?? "frosted");
const vibrancy = getGlassVibrancyClass(vibrancy ?? "medium");
const specular = getSpecularClasses(specularMode ?? "classic");

// className = fill + " " + vibrancy + (specular ? " " + specular : "")
```

---

## 5. How to Add a New Color

Adding a new color to the ui-kit theme involves two steps: updating the type definition and regenerating the safelist.

### Step 1: Update TrueColor

Add the new color name to the `TrueColor` union in `common/theme/Theme.ts`:

```ts
export type TrueColor =
  | "red"
  | "orange"
  | "amber"
  // ... existing colors ...
  | "stone"
  | "myNewColor";  // ← add here
```

Then add it to the `colors` array (same order as the union):

```ts
const colors: TrueColor[] = [
  "red", "orange", "amber",
  // ... existing colors ...
  "stone",
  "myNewColor",  // ← add here
];
```

### Step 2: Update dependent modules

Add the new color to these files so they iterate over it:

| File | What to update |
|------|---------------|
| `common/theme/ButtonTypes.ts` | Add to the `colors` array |
| `common/theme/randomThemeColor.ts` | Add to `THEME_MULTI_COLORS` (and optionally `RANDOM_THEME_COLORS`) |
| `common/theme/glass.ts` | Add to `GLASS_COLOR_SAFELIST` |
| `scripts/generate-safelist.mjs` | Add to the `COLORS` array |

### Step 3: Regenerate the safelist

Run the safelist generator:

```bash
node scripts/generate-safelist.mjs
```

This regenerates `common/safelist.css` with all utility patterns for the new color across all 9 shades. The output file uses Tailwind v4's `@source inline()` with brace expansion for simple patterns and `@layer utilities` for non-standard opacity values (glass fills).

### Step 4: Update component tone maps

Any component with a hardcoded tone map (Record keyed by color) needs the new color added. For example, if the Alert component has a `toneTokens` map:

```ts
const toneTokens: Record<TrueColor, { ... }> = {
  // ... existing colors ...
  myNewColor: { subtle: "...", solid: "...", ... },
};
```

### Step 5: Build and verify

```bash
npm run build
```

The build should pass. If the component typechecks, the new color is integrated end-to-end.

---

## 6. How to Add a New Size

See the "Adding a new size" subsection in the [Size System](#2-size-system) section above. The complete procedure is:

1. Add the value to the `Size` union in `common/theme/Theme.ts`
2. Add the value to the target component's local size type (e.g. `ButtonSize`)
3. Add the corresponding style entries in the component's size mapping record
4. Build and verify: `npm run build`

---

## 7. Migration Guide — From ThemeColor to TrueColor

### What changed

| Before | After |
|--------|-------|
| `ThemeColor` — 29-member union (20 Tailwind colors + `white` + 7 semantic aliases) | `TrueColor` — 21-member union (all Tailwind palette colors, no aliases) |
| `resolveColor()` function — mapped semantic aliases to Tailwind colors | Removed — no aliases to resolve |
| Per-component local size types (`ButtonSize`, `ModalSize`, `SpinnerSize`, etc.) | Shared `Size` type (10 values) + component-local subsets |
| `ThemeSize` (11 values, never used) | Removed — replaced by shared `Size` |
| `ModalSize` (duplicate of `ThemeSize`) | Removed — replaced by shared `Size` |
| `SEMANTIC_MAP` / `resolveColor()` in `glass.ts` | Removed — glass now accepts `TrueColor` directly |
| Manual safelist (~10,900 lines across 4 files) | Auto-generated `common/safelist.css` (~766 lines) |
| Dead safelist files (`tailwind-safelist.ts`, `tailwindPaletteSafelist.ts`) | Deleted |

### Semantic color replacement table

Replace every occurrence of these old color names with their TrueColor equivalents:

| Old value | New value |
|-----------|-----------|
| `brand` | `blue` |
| `info` | `sky` |
| `success` | `emerald` |
| `warning` | `amber` |
| `danger` | `rose` |
| `theme` | `neutral` |
| `parallels` | `red` |
| `white` (as a color prop) | `slate-50` or `neutral-50` (for backgrounds), or use Tailwind's native `white` in class strings |

### Component default color changes

| Component | Old default | New default |
|-----------|-------------|-------------|
| `Button` | `color="brand"` | `color="blue"` |
| `Textarea` | `tone="theme"` | `tone="neutral"` |
| `Stepper` | `tone="brand"` | `tone="blue"` |
| `Hero` | `tone="parallels"` | `tone="blue"` |
| `Modal` (confirm) | `confirmColor="brand"` | `confirmColor="blue"` |
| `DeleteConfirmModal` | `confirmColor="danger"` | `confirmColor="rose"` |

### Migration checklist for component authors

1. **Find all `ThemeColor` imports** — replace with `TrueColor`
2. **Find all `resolveColor()` calls** — replace with the direct TrueColor value (see table above)
3. **Find all semantic color keys in tone maps** — replace with the corresponding TrueColor value
4. **Find all `white` used as a ThemeColor** — replace with `slate-50` or `neutral-50`
5. **Find `ModalSize` imports** — replace with `Size`
6. **Find `ThemeSize` imports** — replace with `Size` (it was dead code anyway)
7. **Find `ToggleSize` imports** — replace with `import { Size } from "@cjlapao/ui-kit"` and use `Size` instead
8. **Find `MultiToggleSize` imports** — replace with `import { Size } from "@cjlapao/ui-kit"` and use `Size` instead
9. **Find `TogglePadding` imports** — replace with `import { Padding, getPaddingClass } from "@cjlapao/ui-kit"` and use `Padding` + `getPaddingClass()` instead
10. **Find `SEMANTIC_MAP` or `resolveColor` imports from `glass.ts`** — remove; glass now accepts `TrueColor` directly
11. **Run `npm run build`** — verify typecheck passes in both `react/` and `vue/`

### Tone map example

```ts
// BEFORE (29-key map with semantic aliases)
const toneTokens: Record<ThemeColor, ToneConfig> = {
  red: { ... },
  // ... 20 palette colors ...
  stone: { ... },
  brand: { ... },      // → resolved to blue at runtime
  info: { ... },       // → resolved to sky at runtime
  success: { ... },    // → resolved to emerald at runtime
  warning: { ... },    // → resolved to amber at runtime
  danger: { ... },     // → resolved to rose at runtime
  theme: { ... },      // → resolved to neutral at runtime
  parallels: { ... },  // → resolved to red at runtime
  white: { ... },      // → special-case hardcoded classes
};

// AFTER (21-key map, TrueColor only)
const toneTokens: Record<TrueColor, ToneConfig> = {
  red: { ... },
  orange: { ... },
  amber: { ... },
  yellow: { ... },
  lime: { ... },
  green: { ... },
  emerald: { ... },
  teal: { ... },
  cyan: { ... },
  sky: { ... },
  blue: { ... },
  indigo: { ... },
  violet: { ... },
  purple: { ... },
  fuchsia: { ... },
  rose: { ... },
  slate: { ... },
  gray: { ... },
  zinc: { ... },
  neutral: { ... },
  stone: { ... },
};
```

---

## 8. Loop Record — Theme Refactor (Issue #79)

### Completed tasks

| Task | Description | PR | Status |
|------|-------------|-----|--------|
| **T1** | Core types: `TrueColor` (21 colors), `Size` (10 values), removed `ThemeColor`, `ThemeSize`, `ModalSize`, `resolveColor()` | [#70](https://github.com/cjlapao/ui-kit/pull/70) | Merged |
| **T2** | Safelist generation: created `scripts/generate-safelist.mjs`, regenerated `common/safelist.css` (766 lines from ~10,900), deleted 6 dead `.ts` safelist files | [#72](https://github.com/cjlapao/ui-kit/pull/72) | Merged |
| **T3** | Glass consolidation: removed duplicate `SEMANTIC_MAP` / `resolveColor()` from `glass.ts`, typed `getGlassFillClass()` as `TrueColor` | [#74](https://github.com/cjlapao/ui-kit/pull/74) | Merged |
| **T4** | React component migration: updated 51 React component files — tone maps to `TrueColor`, default colors updated (Button→`blue`, Textarea→`neutral`, Stepper→`blue`, Hero→`blue`, Modal→`rose`/`blue`), Modal uses `Size` | [#76](https://github.com/cjlapao/ui-kit/pull/76) | Merged |
| **T5** | Vue component migration: updated 50 Vue component files — same changes as T4 for Vue components | [#78](https://github.com/cjlapao/ui-kit/pull/78) | Merged |
| **T6** | Documentation: this file (`docs/design_system/theme.md`) + updated `docs/design_system/ui-kit.md` | — | In progress |

### Key decisions

1. **Semantic colors removed entirely** — no backward compatibility shim, no deprecated aliases. Components migrated directly to TrueColor.
2. **`white` removed** — use `slate-50` or `neutral-50` for light backgrounds. `white` has no Tailwind shade scale.
3. **Safelist auto-generated** — `scripts/generate-safelist.mjs` reads the TrueColor values and produces all required `@source inline()` and `@layer utilities` entries. Reduces safelist from ~10,900 lines across 4 files to 766 lines in a single file.
4. **Shared `Size` type** — one canonical type with 10 values (`xs` through `full`). Replaced both the dead `ThemeSize` and the duplicated `ModalSize`.

### Files changed (across all tasks)

| Category | Files |
|----------|-------|
| **Core types** | `common/theme/Theme.ts`, `common/theme/ButtonTypes.ts`, `common/theme/randomThemeColor.ts` |
| **Glass** | `common/theme/glass.ts` |
| **Safelist** | `scripts/generate-safelist.mjs` (new), `common/safelist.css` (regenerated) |
| **Deleted safelist** | `common/theme/tailwind-safelist.ts`, `common/theme/tailwindPaletteSafelist.ts`, 4 re-export stubs in `react/src/theme/` and `vue/src/theme/` |
| **React components** | 51 files in `react/src/components/` |
| **Vue components** | 50 files in `vue/src/components/` |
| **Documentation** | `docs/design_system/theme.md` (new), `docs/design_system/ui-kit.md` (updated) |

### Feature branch

`feature/theme-refactor-core` (merged to `main` via squashed commits)
