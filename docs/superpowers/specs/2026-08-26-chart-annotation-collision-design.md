# Chart annotation collision detection — design

Date: 2026-08-26 · Status: approved (proceed as designed)

## Problem

Each `<Chart.Annotation>` resolves its callout card independently: `resolveCard`
in `features/Annotation.tsx` uses only its own marker point, its own requested
placement and the plot bounds. When two annotated points are close together
(the Blockbuster ROI example: "Joker · 7.2× ROI" and "Top Gun: Mav · 8.8× ROI"),
the cards render on top of each other. There is no cross-annotation awareness.

Goal: annotation cards must not overlap each other. Cards keep their requested
placement when possible; otherwise they move. The leader line always connects
the marker dot to the card that ends up on screen.

## Scope

In scope (v1):

- Card-vs-card collision resolution, deterministic and order-stable.
- Resolved positions drive both SVG and canvas rendering.
- Leader lines re-anchor to the resolved card.
- The Blockbuster ROI example (and any chart) self-resolves with no new props.

Out of scope (v1):

- Card-vs-data avoidance (a card may still sit over bubbles/points — the
  complaint is card-on-card).
- Real text measurement (canvas `measureText`); the existing
  char-count heuristic (`PAD_X * 2 + max(title, value).length * 7.2`) is kept —
  it is deterministic and testable in jsdom.
- Animation for card movement (cards fade in with the chart as today).

## Architecture

Follows the established engine pattern for series (element token → root-level
layout pass → component reads its own entry).

### 1. Engine: `engine/annotation-layout.ts` (new, pure)

```ts
export interface AnnotationCardInput {
  /** Marker pixel position (already mapped through the scales). */
  px: number;
  py: number;
  /** Requested side; "auto" when the prop is absent. */
  placement: "auto" | "top" | "bottom" | "left" | "right";
  /** Card width (char heuristic). */
  cardW: number;
  title?: string;
  value?: string;
}

export interface AnnotationCardRect {
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
  /** The side the card ended up on (leader-line anchoring hint). */
  side: "top" | "bottom" | "left" | "right";
}

export function layoutAnnotationCards(
  inputs: AnnotationCardInput[],
  area: { x: number; y: number; width: number; height: number },
  width: number,
  height: number,
): AnnotationCardRect[]
```

Pure function, same index in → out. Fixed `CARD_H` (two rows) matches the
component constants (`PAD_Y * 2 + TITLE_H + VALUE_H` = 50).

**Algorithm** (greedy, DOM order = input order):

1. For annotation `i`, build candidates: the requested side first (for
   `auto`: right, left, top, bottom), each candidate rect = current
   `resolveCard` geometry for that side (offset 14px from the marker, centered
   on the point on the cross axis), clamped into the plot area.
2. Accept the first candidate whose rect does not intersect any rect already
   placed (rects inflated by a 6px gap on all sides).
3. If no candidate is clean, take the first candidate and shift it vertically
   into a free lane: step the rect by `CARD_H + 6` away from the point (down
   for bottom/right-side cards, up for top/left-side), stopping when clear or
   the plot edge is reached. (The horizontal mirror is unnecessary for v1 —
   vertical stacking is the failure mode seen in practice and is what keeps
   leader lines short.)
4. If still overlapping (plot too full), keep the shifted rect as-is (least
   disruption, still clamped into the plot) — degenerate, deterministic.
5. `side` records where the card landed (used to anchor the leader line).

The existing single-card edge logic (flip below the point when the card would
leave the top of the plot; clamp into the chart box) is preserved inside each
candidate, so behaviour with one annotation is unchanged.

### 2. Root: `ChartRoot.tsx`

- `annotationTokens` memo — same shape as `seriesTokens`: a
  `Map<object, number>` (element → index) over `flattenChartChildren`,
  matching `reg.Annotation` elements.
- `plotChildren` split: stamp `<Annotation>` elements with
  `__chartAnnotationToken: c` (like series).
- `annotationLayout` memo (after `xScale`/`yScale`/`area`): for each
  annotated element, map its `x`/`y` props through the scales (band center
  for categorical x — same `xPixelOf` logic, hoisted or duplicated), skip
  annotations whose point cannot be mapped, and call `layoutAnnotationCards`.
  Expose the resulting `Map<object, AnnotationCardRect | null>` on the chart
  context as `annotationLayout`.
- Deps: `elements`, `reg`, `xScale`, `yScale`, `area`, `width`, `height`.

### 3. Context: `ChartContext.tsx`

```ts
/** Resolved annotation card rects (element identity → rect). */
annotationLayout: Map<object, AnnotationCardRect | null>;
```

### 4. Component: `features/Annotation.tsx`

- Reads `ctx.annotationLayout.get(token)` (token = the stamped
  `__chartAnnotationToken` prop, `any`-typed through the element like series).
- When a resolved rect exists, it replaces the local `resolveCard` result
  (both SVG and the canvas draw fn); the local `resolveCard` remains as the
  fallback for the (unsupported) standalone usage and keeps single-card edge
  behaviour identical.
- Leader line: drawn from the marker to the nearest card edge — for a
  resolved rect the anchor is the edge facing the marker (left/right card →
  vertical edge midpoint; top/bottom card → horizontal edge midpoint), which
  generalizes the current corner logic and keeps the line short after shifts.
- Canvas id: stable per annotation index (`feature:annotation:${index}`) so
  multiple annotations never collide on the same id (today the id is built
  from `x`/`y`, which can repeat).

## Error handling / edge cases

- Annotation with an unmappable point (no scale, or `x`/`y` missing):
  skipped by the layout pass, component renders nothing (current behaviour).
- Categorical (band) x: band center, current behaviour preserved.
- Right-axis y: annotations use the left y scale (current behaviour).
- More annotations than vertical room: last resort places clamped rects
  (step 4) — deterministic, no infinite loops.
- Zero annotations: empty map, zero cost.

## Testing

Engine (`engine/annotation-layout.test.ts`):

- Non-overlapping inputs keep their requested placement and positions.
- Two inputs at the same point: the second is shifted by at least
  `CARD_H + 6` and the two rects (inflated by 6px) do not intersect.
- A card that would leave the top of the plot flips below the point.
- DOM order: swapping input order swaps which card moves (order-stable).
- `auto` placement with a collision picks the first clean candidate side.
- Plot too small: all rects clamped inside the plot area.

Component (`chart-components.test.tsx`):

- Chart with two annotations at the same (x, y): the two annotation `rect`s
  do not intersect (compare attributes).
- Single annotation: position matches the pre-change behaviour (leader line
  still present, card rect at the expected place).

Live QA (5176, `/docs/charts-scatter` ROI example): Joker / Top Gun / Endgame
cards no longer overlap; leader lines connect dot → card; other examples
(Annotations page) unchanged visually.

## Files

- `react/src/components/chart/engine/annotation-layout.ts` (new)
- `react/src/components/chart/engine/annotation-layout.test.ts` (new)
- `react/src/components/chart/engine/index.ts` (export)
- `react/src/components/chart/react/ChartRoot.tsx` (tokens, layout memo,
  context wiring, child stamping)
- `react/src/components/chart/react/ChartContext.tsx` (context field)
- `react/src/components/chart/react/features/Annotation.tsx` (consume
  resolved rect, leader anchoring, stable canvas id)
- `react/src/components/chart/react/chart-components.test.tsx` (component
  tests)
- Demo: no changes needed (the ROI example exercises it); live verification
  only.
