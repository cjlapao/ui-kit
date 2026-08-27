# Chart loaders (skeleton / spinner / progress) — Design (Round 28)

Reference pattern: `react/src/components/Panel.tsx` — `loading` +
`loaderType` (`spinner | progress | skeleton`), a content-replacing
skeleton, an overlay `<Loader>` for the other two, `aria-busy`.
User requirement: the chart's **default loader type is `skeleton`**, and
every chart demo page with a playground gets a **Loading toggle + loader
type selector** so all three can be tested.

## 1. Props — `ChartRootProps` (applies to `Chart.Svg` and `Chart.Canvas`)

| Prop | Default | Notes |
|---|---|---|
| `loading?: boolean \| ReactNode` | — | existing prop, semantics unchanged: node → custom loading node |
| `loaderType?: "skeleton" \| "spinner" \| "progress"` | `"skeleton"` | built-in loader kind (only used when `loading` is `true`) |
| `loaderTitle?: ReactNode` | — | title line for spinner/progress overlay |
| `loaderMessage?: ReactNode` | — | label line for spinner/progress overlay |
| `loaderProgress?: number` | `0` | progress variant only |
| `loaderColor?: SpinnerColor` | `"blue"` | spinner/progress tone (re-exported type) |

## 2. ChartRoot rendering (`ChartRootImpl`)

- `boolLoading = loading === true`.
- **Skeleton** (`boolLoading && loaderType === "skeleton"`): render
  `<ChartSkeleton>` **instead of** the svg/canvas block (like Panel's
  skeleton — the chart has no data yet). Container keeps its fixed
  height so layout doesn't jump; `data-chart-loading="skeleton"`;
  `aria-busy="true"` on the container.
- **Spinner / progress** (`boolLoading && loaderType !== "skeleton"`):
  render the chart normally and overlay
  `<Loader overlay variant={loaderType} title={loaderTitle}
  label={loaderMessage} progress={loaderProgress}
  color={loaderColor} />` (the container is already `position:
  relative`; the overlay covers it).
- Node `loading` → existing custom node (unchanged).
- `aria-busy={boolLoading}` on the container div.

## 3. `ChartSkeleton` (new, in `react/series/ChartSkeleton.tsx`)

A plain-div placeholder shaped like a chart (the chart is inline-styled,
not Tailwind, so no `SkeletonBar` import — self-contained inline styles):

```
┌────────────────────────────┐
│ ▂▂▂▂▂ (55%)  ▂▂▂ (35%)     │  title/subtitle bars (when hasTitle)
│ (◦ legend · legend)        │  legend pills (when hasLegend, horizontal)
│ ┌────────────────────────┐ │
│ │ ────────────────────── │ │  plot: subtle rounded rect
│ │ ────────────────────── │ │  with 4 horizontal gridline bars
│ │ ────────────────────── │ │
│ │ ▬▬▬▬▬ (baseline)       │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

- Props: `height`, `hasTitle`, `hasSubtitle`, `hasLegend`,
  `legendPosition`, `isDark`, `gridColor`.
- Bars use a muted fill derived from the theme grid color (light
  `rgba(100,116,139,0.18)` / dark `rgba(203,213,225,0.14)`, plot rect
  at half strength); wrapper `aria-hidden="true"`,
  `animation: dsh-chart-pulse 1.6s ease-in-out infinite` (opacity
  1 → 0.55), `motion-reduce: animation none` via a media-query class
  fallback (plain CSS in the injected keyframe block).

## 4. Keyframe injection (bug fix included)

`@keyframes dsh-chart-spin` is **referenced by `defaultLoadingNode` but
defined nowhere** — the built-in boolean spinner is currently a static
ring. Fix: a module-level `ensureChartKeyframes()` injects one
`<style id="dsh-chart-keyframes">` (once, guarded) containing:

```css
@keyframes dsh-chart-spin { to { transform: rotate(360deg); } }
@keyframes dsh-chart-pulse { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
@media (prefers-reduced-motion: reduce) {
  [data-chart-loading], .dsh-chart-anim { animation: none !important; }
}
```

Called from `ChartRootImpl` render (idempotent, SSR-safe via
`document` guard). Fixes the dead spinner animation as a side fix.

## 5. Playground (shared by all chart pages)

`ChartPlayground.tsx` — one change covers every chart page that has a
playground (line/bar/pie/radar/polar/scatter/gauge/nightingale/
candlestick/range/waterfall/combo/heatmap/treemap + the main charts
page):

- State: `lgLoading` (default `false`), `lgType`
  (`"skeleton" | "spinner" | "progress"`, default `"skeleton"`).
- Controls (added to the shared controls block): `ToggleRow
  label="Loading"` + `<Control label="Loader type">` with a
  `MultiToggle` (Skeleton / Spinner / Progress).
- Preview `<Chart.Svg>`: `loading={lgLoading || undefined}`
  `loaderType={lgType}`.

## 6. Tests — `chart-components.test.tsx`, `describe("loading state")`

- skeleton (default): `loading` + `Chart.Title` child → no
  `[data-chart-series]` rendered, `[data-chart-loading="skeleton"]`
  present, container `aria-busy="true"`.
- spinner: `loading loaderType="spinner"` → `role="status"` overlay
  present **and** the chart structure still renders beneath.
- progress: `loading loaderType="progress"` → `role="status"` present.
- custom node: `loading={<div data-custom-loading />}` → the custom
  node renders (existing behavior regression guard).
- keyframes: after a loading render, `#dsh-chart-keyframes` style tag
  exists with both keyframes.

## 7. Verification

- Kit tsc (WIP-filtered) + full vitest (baseline 2392 / 105).
- Demo tsc (WIP-filtered).
- Playwright on :5176 (e.g. `docs/charts-line`): toggle Loading →
  skeleton screenshot; Loader type → Spinner and Progress → overlay
  screenshots; untoggle → chart back. Dark + light.

## 8. Out of scope

- Per-series skeletons, data-driven skeleton shapes (e.g. exact bar
  heights). The skeleton is a generic chart-shaped placeholder.
- `indeterminate` progress exposure (the overlay progress default is a
  known-extent bar; can be added later).
- Loading state on individual demo example cards (only the playground,
  as requested).
