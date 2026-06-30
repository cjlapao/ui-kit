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
  There is **no `tailwind.config.js`**. Class strings are composed in TS (`classnames` / `clsx` / `tailwind-merge`), with a large **safelist** in `src/theme/tailwind*Safelist.ts` so dynamic `color`-driven classes survive the build.
- **Charts:** `recharts` (+ the `Stat*Tile` components).
- **Build/lint:** `npm run build` = `tsup`; `npm run lint` = `tsc --noEmit`. (No unit-test runner configured — visual + typecheck is the gate.)
- **Dark mode:** yes — `dark:` variants throughout (66+ components).
- **Editor:** `@uiw/react-md-editor` (the `MarkdownEditor` component). Icons via `react-icons` + `src/icons`.

## Color model — semantic `ThemeColor` (THIS is the system; don't hardcode hex)

Components take a **`color` / `tone` prop of type `ThemeColor`**, not raw hex. `ThemeColor` = the full
Tailwind palette (`red`…`rose`, `slate`…`stone`, `white`) **plus semantic aliases** resolved by
`resolveColor()` in `src/theme/Theme.ts`:

| semantic | resolves to | role |
|---|---|---|
| `brand` | **blue** | primary brand accent (component default `color`) |
| `info` | sky | informational |
| `success` | emerald | success / positive |
| `warning` | amber | warning |
| `danger` | rose | error / destructive |
| `theme` | neutral | neutral chrome |
| `parallels` | red | (product-specific accent) |

There is also a **runtime `theme-*` surface set** consumed as Tailwind colors: `theme-background`,
`theme-foreground`, `theme-surface`, `theme-border`, `theme-muted`, `theme-secondary`,
`theme-primary` (light + `dark:` pairs). Surfaces/text/borders use these so the whole kit re-themes
(incl. dark mode) without touching components.

**To restyle: pass a different `color`/`tone`, or change the `theme-*` / `brand` mapping — never hand-edit hex in a component.**

## Variant conventions (match these when adding variants)

Components are configured by **`variant` + `color`/`tone` + `size`** props. Observed:

- **Button** — `variant: solid | soft | outline | ghost | link | clear | icon`; `color: ThemeColor` (default `brand`); `size: xs|sm|md|lg|xl`; `fullWidth`, `loading`, `iconOnly`, an "active/on" state (`accentColor`). Base radius **`rounded-md`** (NOT pill by default).
- **Pill** — `tone: PillTone`, `variant: PillVariant`, `size`, `dot`; `rounded-full`.
- **Badge** — `tone: ThemeColor` (default neutral), dot/count; `rounded-full`; tiny count badge.
- **Panel** — `corner: rounded | rounded-sm | rounded-md | rounded-lg | rounded-full`; header + `actions` (full `ButtonProps`); built-in loader (`Loader`).
- **Stat tiles** — `StatTile`, `StatCountTile` (label + count + breakdowns, `color: ThemeColor`, corner rounding, decorative corner blob), `StatChartTile`, `StatGoalTile`, `StatGraphTile` — the dashboard stat cards.

When you add a variant, extend the existing `variant`/`color`/`tone` enums and the safelist — don't invent a parallel styling mechanism.

## Component catalog (real exports, grouped)

> Inventory of `src/components` (2026-06-30). Fill variant specifics as you touch each.

- **Actions/inputs:** `Button`, `IconButton`, `DropdownButton`, `DropdownMenu`, `Input`, `InputGroup`, `PasswordInput`, `SmartInput`, `Textarea`, `Checkbox`, `Toggle`, `MultiToggle`, `Select`, `Combobox`, `MultiSelectPills`, `ButtonSelector`, `Picker`, `TagPicker`, `VariablePicker`, `SearchBar`, `KeyValueArrayField`.
- **Forms:** `FormField`, `FormLayout`, `FormSection`, `DynamicFormField`, `SmartValue`.
- **Surfaces/layout:** `Panel`, `InlinePanel`, `CollapsiblePanel`, `SidePanel`, `PagedPanel`, `InfiniteScrollPanel`, `Section`, `SectionCard`, `DetailItemCard`, `SmartGridLayout`, `SplitView`, `SideMenu`, `SideMenuLayout`, `AppDivider`, `HeaderGroup`, `Hero`, `Tabs`, `Accordion`, `TagPanel`, `TimelinePanel`.
- **Data/stat:** `StatTile`, `StatCountTile`, `StatChartTile`, `StatGoalTile`, `StatGraphTile`, `MetricBar`, `Progress`, `MultiProgressBar`, `Table`, `AccessMatrix`, `InfoRow`.
- **Feedback/status:** `Alert`, `Badge`, `BadgeIcon`, `Pill`, `Loader`, `Spinner`, `StatusSpinner`, `Tooltip`, `TooltipWrapper`, `EmptyState`, `ApiErrorState`, `Modal`, `NotificationModal`, `Stepper`, `StartupStageStepper`, `CollapsibleHelpText`, `HelpButton`.
- **Content/util:** `MarkdownEditor`, `TruncatedText`, `TreeView`, `UserAvatar`, `CustomIcon`, `DynamicImg`, `Toggle`, `ConnectionFlow`.

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
