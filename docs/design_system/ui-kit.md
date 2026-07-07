# Design System — ui-kit (`@cjlapao/ui-kit`)

> Long-lived. Append tokens/recipes/variants; never delete. The `ui-design-engineer-loop` and
> `ui-designer` agents read this to stay consistent and **extend the kit, not reinvent it**.
>
> **This documents the REAL kit** at `@cjlapao/ui-kit` (inventoried 2026-06-30). Where it says
> "TARGET / decision needed", that's design direction layered on top — see "Target design direction".

## Stack (confirmed from the repo)

- **Package:** `@cjlapao/ui-kit` (published to GitHub Packages). React 18/19 + `react-router-dom`.
- **Styling:** **Tailwind v4** — CSS-first. `src/styles.css` is just:
  `@layer theme, base, components, utilities; @import "tailwindcss/theme.css"; @import "tailwindcss/utilities.css"; @source "./src/**/*.{ts,tsx}";`
  There is **no `tailwind.config.js`**. Class strings are composed in TS (`classnames` / `clsx` / `tailwind-merge`), with an auto-generated **safelist** in `common/safelist.css` (run `node scripts/generate-safelist.mjs` to regenerate).
- **Charts:** `recharts` (+ the `Stat*Tile` components).
- **Build/lint:** `npm run build` = `tsup`; `npm run lint` = `tsc --noEmit`. (No unit-test runner configured — visual + typecheck is the gate.)
- **Dark mode:** yes — `dark:` variants throughout (66+ components).
- **Editor:** `@uiw/react-md-editor` (the `MarkdownEditor` component). Icons via `react-icons` + `src/icons`.

## Color model — `TrueColor` (the only valid color type)

Components take a **`color` / `tone` prop of type `TrueColor`**, not raw hex. `TrueColor` comprises
the **21 Tailwind palette color names** (`red` through `stone`, including `fuchsia` and `rose`).
See [theme.md](./theme.md) for the complete color taxonomy, shade range, glass system, and migration
guide from the old semantic alias system.

There is also a **runtime `theme-*` surface set** consumed as Tailwind colors: `theme-background`,
`theme-foreground`, `theme-surface`, `theme-border`, `theme-muted`, `theme-secondary`,
`theme-primary` (light + `dark:` pairs). Surfaces/text/borders use these so the whole kit re-themes
(incl. dark mode) without touching components.

**To restyle: pass a different `color`/`tone` from the TrueColor set, or change the `theme-*` tokens — never hand-edit hex in a component.**

## Variant conventions (match these when adding variants)

Components are configured by **`variant` + `color`/`tone` + `size`** props. Observed:

- **Button** — `variant: solid | soft | outline | ghost | link | clear | icon`; `color: TrueColor` (default `blue`); `size: xs|sm|md|lg|xl`; `fullWidth`, `loading`, `iconOnly`, an "active/on" state (`accentColor`). Base radius **`rounded-md`** (NOT pill by default).
- **Pill** — `tone: PillTone`, `variant: PillVariant`, `size`, `dot`; `rounded-full`.
- **Badge** — `tone: TrueColor` (default neutral), dot/count; `rounded-full`; tiny count badge.
- **Panel** — `corner: rounded | rounded-sm | rounded-md | rounded-lg | rounded-full`; header + `actions` (full `ButtonProps`); built-in loader (`Loader`).
- **Stat tiles** — `StatTile`, `StatCountTile` (label + count + breakdowns, `color: TrueColor`, corner rounding, decorative corner blob), `StatChartTile`, `StatGoalTile`, `StatGraphTile` — the dashboard stat cards.

When you add a variant, extend the existing `variant`/`color`/`tone` enums and the safelist — don't invent a parallel styling mechanism.

## Component catalog (real exports, grouped)

> Inventory of `src/components` (2026-06-30). Fill variant specifics as you touch each.

- **Actions/inputs:** `Button`, `IconButton`, `DropdownButton`, `DropdownMenu`, `Input`, `InputGroup`, `PasswordInput`, `SmartInput`, `Textarea`, `Checkbox`, `Toggle`, `MultiToggle`, `Select`, `Combobox`, `MultiSelectPills`, `ButtonSelector`, `Picker`, `TagPicker`, `VariablePicker`, `SearchBar`, `KeyValueArrayField`.
- **Forms:** `FormField`, `FormLayout`, `FormSection`, `DynamicFormField`, `SmartValue`.
- **Surfaces/layout:** `GlassBackground`, `Panel`, `InlinePanel`, `CollapsiblePanel`, `SidePanel`, `PagedPanel`, `InfiniteScrollPanel`, `Section`, `SectionCard`, `DetailItemCard`, `SmartGridLayout`, `SplitView`, `SideMenu`, `SideMenuLayout`, `AppDivider`, `HeaderGroup`, `Hero`, `Tabs`, `Accordion`, `TagPanel`, `TimelinePanel`.
- **Data/stat:** `StatTile`, `StatCountTile`, `StatChartTile`, `StatGoalTile`, `StatGraphTile`, `MetricBar`, `Progress`, `MultiProgressBar`, `Table`, `AccessMatrix`, `InfoRow`.
- **Feedback/status:** `Alert`, `Badge`, `BadgeIcon`, `Pill`, `Loader`, `Spinner`, `StatusSpinner`, `Tooltip`, `TooltipWrapper`, `EmptyState`, `ApiErrorState`, `Modal`, `NotificationModal`, `Stepper`, `StartupStageStepper`, `CollapsibleHelpText`, `HelpButton`.
- **Content/util:** `MarkdownEditor`, `TruncatedText`, `TreeView`, `UserAvatar`, `CustomIcon`, `DynamicImg`, `Toggle`, `ConnectionFlow`.

## Component: `GlassBackground`

> **Purpose:** Provides a configurable gradient background layer with ambient glows and optional shimmer.
> Used wherever a colorful, atmospheric backdrop is needed — full-viewport pages or scoped to a container.
>
> **Import:** `import { GlassBackground } from "@cjlapao/ui-kit";`
>
> **Source:** `react/src/components/GlassBackground.tsx`

### What it does

1. **3-stop gradient** computed from the Tailwind palette via `ThemeColor` props (light + dark pairs).
2. **Ambient glows** — two large `blur-3xl` circles positioned at opposite corners, with a subtle pulse animation.
3. **Shimmer overlay** — a slow horizontal sweep of a faint white gradient (opt-in).
4. **`children`** rendered in a `relative z-10` wrapper so panels, cards, and other surfaces sit above.

Gradient shade ranges:

| mode | stop 1 | stop 2 | stop 3 |
|---|---|---|---|
| Light | `{color}-300` | `{colorSecondary}-200` | `{colorDeep}-50` |
| Dark | `{color}-700` | `{colorSecondary}-600` | `{colorDeep}-800` |

Ambient glow shades:

| mode | color |
|---|---|
| Light | `{color}-400` at 12% opacity |
| Dark | `{color}-500` at 15% opacity |

### Props (complete list)

| prop | type | default | description |
|---|---|---|---|
| `color` | `TrueColor` | `"purple"` | Primary gradient color. See [theme.md](./theme.md) for the full color list. |
| `colorSecondary` | `TrueColor` | *auto-derived* | Middle gradient stop. If omitted, a neighboring hue is chosen (e.g. `purple` → `blue`). |
| `colorDeep` | `TrueColor` | *auto-derived* | Final gradient stop. If omitted, a deeper hue is chosen (e.g. `purple` → `indigo`). |
| `direction` | `GradientDirection` | `"br"` | Gradient angle. Values: `"t"`, `"tr"`, `"r"`, `"br"`, `"b"`, `"bl"`, `"l"`, `"tl"`. |
| `position` | `"fixed" \| "absolute"` | `"fixed"` | `"fixed"` covers the full viewport. `"absolute"` fills a `position: relative` parent (useful inside `PlaygroundSection` previews). |
| `shimmer` | `boolean` | `false` | Enable a slow horizontal shimmer sweep. Off by default; opt-in. |
| `ambient` | `boolean` | `true` | Show the two blurred ambient glow circles. Turn off for a pure gradient. |
| `className` | `string` | — | Applied to the root container. |
| `style` | `React.CSSProperties` | — | Inline styles on the root container. |
| `children` | `ReactNode` | — | Rendered in a `relative z-10` layer on top of the background. |

### Auto-derivation logic

When `colorSecondary` or `colorDeep` are not provided, the component chooses neighboring hues:

```
color        → secondary (neighbor)  → deep (deeper neighbor)
purple       → blue                  → indigo
blue         → indigo                → violet
rose         → pink                  → red
emerald      → teal                  → cyan
amber        → orange                → red
... (full map in component source)
```

This means `<GlassBackground color="purple">` produces a purple→blue→indigo gradient automatically.

### Position modes

**`position="fixed"`** (default):
```
┌─────────────────────────────┐
│  GlassBackground (fixed)    │ ← covers full viewport, scrolls with page
│  ┌─────────────────────┐    │
│  │  children (z-10)    │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**`position="absolute"`** (inside a relative container):
```
┌─────────────────────────────┐
│  parent (relative)          │
│  ┌─────────────────────┐    │
│  │ GlassBackground     │    │ ← fills parent, does NOT escape
│  │ (absolute inset-0)  │    │
│  │ ┌───────────────┐   │    │
│  │ │ children (z-10)│   │    │
│  │ └───────────────┘   │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

The parent **must** have `position: relative` (or `absolute`/`fixed`) for `absolute` positioning to work correctly.

### Accessibility

- `prefers-reduced-motion` disables both the shimmer animation and the ambient pulse (defined in `src/styles.css`).
- The background is purely decorative; text contrast is ensured by the glass panels sitting on top.
- Ambient glows use low opacity (12–15%) so they don't interfere with readability.

### Usage patterns

**Full-page background:**
```tsx
<GlassBackground color="purple">
  <div className="relative z-10 p-8">
    <Panel variant="liquid-glass" title="Hello" />
  </div>
</GlassBackground>
```

**Scoped to a container (e.g. playground preview):**
```tsx
<div className="relative h-96 w-full overflow-hidden rounded-xl">
  <GlassBackground position="absolute" color="blue" shimmer>
    <Panel variant="liquid-glass" title="Preview" />
  </GlassBackground>
</div>
```

**Minimal (all defaults):**
```tsx
<GlassBackground>
  {children}
</GlassBackground>
```

## Target design direction (Liquid Glass) — recipes to ADD

The kit today is a **flat, semantic-theme** system — there are **no glass recipes in it yet**. "Liquid
Glass as the house style" means the agents **add** glass as new, opt-in variants/recipes on the existing
surfaces (e.g. a `glass` corner/variant on `Panel`, a frosted `StatTile`), built from the kit's
`theme-*` tokens + the glass tokens below — never a separate styling system.

### Glass tokens (to introduce, as `theme-*`-aligned CSS vars)
| token | value (starting point) | notes |
|---|---|---|
| --glass-blur | 16px | panel default; 8–10px for inline chips |
| --glass-fill | color-mix of `theme-surface` @ ~55% | frosted surface over light; darker pair for dark mode |
| --glass-rim | `theme-foreground` @ ~10–15% / white @ ~40% | specular inset rim / top-edge |
| --glass-saturate | 130% | vibrancy alongside blur |
| --glass-shadow | 0 8px 28px (theme-foreground @ ~8%) | soft float |

### recipe: glass panel
`backdrop-filter: blur(--glass-blur) saturate(--glass-saturate)` + `--glass-fill` + a 1px inset
`--glass-rim` (brighter top edge) + faint top→bottom gradient + `--glass-shadow`. Implement as a `Panel`
variant so it inherits header/actions/loader; keep dark-mode pairs.

## A11y guards (non-negotiable)

- Text/icon **contrast over the effective surface meets WCAG AA** (≥4.5:1 normal, ≥3:1 large/icons) — in
  both light and dark, and especially over any frosted glass (raise fill opacity / add a scrim if it dips).
- Honor **`prefers-reduced-transparency`** (opaque fallback) and **`prefers-reduced-motion`**.
- Don't convey state by color/translucency alone; keep focus rings visible (`focus-visible:ring-*` is the kit's pattern).

## Decisions (resolved)

1. **Accent: brand stays BLUE; green is opt-in per component.** Do NOT remap `brand` and do NOT recolor the
   kit. When a surface should be green (à la the reference dashboard), pass `color="emerald"` (or `"green"`)
   on that component; leave everything else on the default `brand` (blue). No kit-wide palette change.
2. **Glass scope: Liquid Glass is the house treatment, added on top.** It's net-new here — first glass work
   adds the `glass` `Panel` variant + the glass tokens above (built from `theme-*`), with dark-mode pairs, and
   records them in this catalog. Don't fork a separate styling system.
3. **No test runner.** `lint` is `tsc --noEmit` only. The visual gate (typecheck + build + Playwright
   screenshots + a11y) is the right verification for this kit; the ≥80% unit-coverage rule does not apply to
   pure styling here.
