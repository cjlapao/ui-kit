# Chart.Group / synced charts — Design (Round 27)

PrimeVue Pro reference: https://vue.primeuipro.dev/charts/types/synced
Reference code (user-pasted): a `<ChartGroup>` wraps a CSS grid of
`ChartSvg :sync="true"` cards — two smooth line series (temp Max/Min, °C),
a bar chart (rainfall, mm), a radar (UV index) and a heatmap (solar W/m²)
— all sharing the same month categories. Hovering any card drives
crosshair + tooltip on the others at the same month.

This is a **grouping/sync layer**, not a new series type.

## 1. API

- `Chart.Group` — wrapper component, renders children verbatim (no
  chrome): `<Chart.Group>{cards…}</Chart.Group>`.
- `Chart.Svg` / `Chart.Canvas` — new prop `sync?: boolean` (default
  `false`). Only meaningful inside a `Chart.Group`.
- **Sync unit = the shared categorical `rawX`** (e.g. the month name),
  not pixels: members may have different y scales, sizes, and series
  types as long as they share category values.
- Scope: **cartesian members only** (line/bar/range/scatter/radar/
  waterfall…). Non-cartesian members (pie/gauge/heatmap/treemap) are
  excluded from the broadcast in v1 — they render normally and keep
  local hover. Documented in the props JSDoc and demo copy (the
  reference's solar heatmap is the known divergence).

## 2. Context — `react/ChartGroup.tsx`

```ts
interface SyncMember { apply: (rawX: string | number | null) => void; }
interface ChartGroupContextValue {
  register(id: string, apply: SyncMember["apply"]): void;
  unregister(id: string): void;
  /** Broadcast a category (or null = clear) to all members except sourceId. */
  broadcast(rawX: string | number | null, sourceId: string): void;
}
export const ChartGroupContext = createContext<ChartGroupContextValue | null>(null);
export function ChartGroup({ children }: { children?: ReactNode })
```

- Provider holds a `Map<string, apply>` in a ref (no re-render churn);
  `broadcast` iterates and skips `sourceId`.
- `ChartGroup` renders children in a `<div>` (grid layouts live in the
  demo markup, matching the reference).

## 3. ChartRoot wiring

- `ChartRootProps` += `sync?: boolean` (JSDoc: inside `Chart.Group`,
  syncs hover to sibling sync charts by category).
- `ChartRootImpl`:
  - `group = useContext(ChartGroupContext)`; `syncId = useId()` when
    `sync && group`.
  - **Broadcast (outbound):** in `handlePointerMove`, after a successful
    `setHover(h)` where `h?.rawX != null`, `group.broadcast(h.rawX, syncId)`
    (guarded: only when it differs from the last broadcast rawX). In
    `handlePointerLeave` (and out-of-area clears), `group.broadcast(null, syncId)`.
  - **Apply (inbound):** `useEffect` registers
    `apply = (rawX) => { if (rawX == null) setHover(null); else { const px = resolveX(rawX); setHover(px == null ? null : computeHoverRef.current(px, areaCenterY)); } }`
    with refs to the latest `computeHover`/`area`/`xScale` (avoids
    stale closures and re-registration loops); `unregister` on cleanup.
    `apply` never broadcasts (no feedback loops).
  - **Category → pixel:** `resolveX(rawX)`: categorical scale →
    `xScale.center(String(rawX))` only when
    `xScale.domain.includes(String(rawX))` (unknown categories resolve
    to null, never px 0); continuous/time → the scale's `map`.
    Members with no cartesian x scale ignore inbound broadcasts.
- Radar member: `rawX` resolution via its own category scale (radar uses
  the shared categorical x) — same path.

## 4. Export

`chart/index.ts`: `Chart.Group = ChartGroup`, type export for the
component (no props beyond children). Not part of the series registry /
`describeSeries` (it wraps `Chart.Svg` roots, not a child series).

## 5. Demo — new page `/docs/charts-synced`

`SyncedChartPage.tsx`:

- `PageHeader` "Synced charts" + a short **How it works** section (plain
  docs block in the page): what `Chart.Group` + `sync` do, the shared-
  category requirement, cartesian-only v1 scope, clear-on-leave.
- Example 1 **"Climate overview"** (reference parity, one card, a 2×2
  responsive grid inside `Chart.Group`):
  1. Two smooth `Line` series `tempMax`/`tempMin` (°C, markers,
     `mode="crosshair"` tooltip, top legend).
  2. `Bar` `rainfall` (mm, rounded top corners).
  3. `Radar` `uv` (UV index, translucent fill, markers).
  4. `Heatmap` `solar` (month × hour, 5-stop warm `#fff7ed → #b23b4b`,
     legend) — with copy noting heatmap hover stays local in v1.
- Example 2 **"Two scales, one axis"**: two synced line cards with
  different y domains ($K revenue vs % growth, same months) showing sync
  is category-based, not scale-based.
- `data.ts`: `syncedMonthly` (12 months: `month, tempMax, tempMin,
  rainfall, uv`), `syncedSolar` (months × hours 7–20, W/m² values).
- Registry `charts-synced` (icon `ChartLine`) + `ChartsPage` TYPE_LINKS
  card. No playground kind (the page is a how-it-works page).

## 6. Tests

`chart-components.test.tsx` — `describe("synced charts")`:

- two synced line charts in a `Chart.Group`: `pointerMove` on chart A →
  chart B's tooltip DOM contains the shared category; `pointerLeave` on
  A → B's tooltip is removed.
- a non-`sync` chart in the same group renders no tooltip when A is
  hovered.
- `ChartGroup` unit: `broadcast` skips the source member (fake applies).

## 7. Verification

- Kit tsc (WIP-filtered) + full vitest (baseline 2374 / 105).
- Demo tsc (WIP-filtered).
- Playwright on :5176 `docs/charts-synced`: hover the line card →
  crosshair/tooltip visible on the bar + radar cards; leave → all clear;
  heatmap card hover still local; dark + light screenshots reviewed.

## 8. Out of scope (v1)

- Pixel-perfect y-sync (charts share category, not pixel position).
- Non-cartesian members in the broadcast (heatmap/pie/gauge/treemap).
- Multiple independent groups with explicit group ids (single context
  per page is enough; nested groups would be supported by context
  scoping naturally).
- Touch/drag scrubbing.
