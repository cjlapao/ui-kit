# Agent Map — scattered layout fills the canvas

## Problem

With `scattered`, `layoutProjectsHorizontally` never sees the available width: it fixes the
vertical axis (`graphHeight`), derives the canvas width from how compact rows pack, then adds
±45 px hash jitter on top of a dense top-left grid. The panel stretches the canvas to the full
panel width, so orbs sit in a packed island on the left and the right/bottom stay empty (see the
12-project screenshot). Orb size is fixed (radius 62, 88 px hub) regardless of crowding, so a
crowded map can only grow the canvas, never compact.

## Goal

In scattered mode, deterministically distribute project hubs across the whole bounding box —
both width and height — avoiding empty regions; shrink hub size as one global scale until the
map is compact; keep horizontal scroll as the escape hatch when even the shrink floor is too
tight. Non-scattered mode is unchanged.

## Design

### 1. New entry point — `scatterProjects(items, width, height, gap = 18)` (layout.ts)

Receives the real box (measured panel width × `graphHeight`). Returns
`{ circles, width, scale }` in canvas coordinates; `width` equals the passed width whenever the
map fits, otherwise the grown width.

1. **Seed — jittered grid sampling.** Choose the column count (1…N) whose cells, given the box
   aspect, are closest to square; every orb gets one cell. Cells tile the whole box, so coverage
   is guaranteed by construction. Each orb is placed at its cell center plus a deterministic
   jitter derived from the FNV hash of its id, up to ±40 % of the half-cell, clamped inside the
   box.
2. **Relax.** Reuse the existing collision-relaxation loop (pairwise push-apart + boundary
   clamp), clamped to the real box on both axes.
3. **Fit / grow.** Run the scale search (§2) for the current width; if even the floor scale
   collides, grow the box width by +50 % of the original and repeat the search, up to 3 growth
   steps (this is the horizontal-scroll escape hatch). If it never fits, return today's
   `packProjects` fallback with `scale: 1`.

### 2. Shrink-to-fit scale

Binary-search a global scale `s ∈ [0.7, 1]` on a 0.05 grid: the smallest `s` whose relaxed
layout fits collision-free inside the box. Radii shrink as `r × s` for collapsed projects; the
project currently expanded keeps its full footprint. Never scale above 1. Floor 0.7 ≈ 62 px
hubs; the hub scales via `transform`, so label text shrinks with the circle and never clips.

### 3. Component + CSS integration

- `AgentMap.tsx`: when `scattered && !narrow`, the layout `useMemo` calls
  `scatterProjects(items, width, graphHeight, 18)`; otherwise the current
  `layoutProjectsHorizontally` path is untouched. `canvasWidth` already takes
  `max(width, layout.width)`, so a fitting scatter produces no phantom scroll.
- Collapsed hubs receive `--hub-scale: s` (the CSS hook and transform already exist; today the
  variable is only set for the open hub, `1` otherwise).
- The overflow label under each hub is fixed at `translate(-50%, 58px)`; it becomes
  `translate(-50%, var(--overflow-offset, 58px))` with `--overflow-offset: calc(58px * s)` set
  inline, so labels stay attached to shrunken hubs.
- Existing 650 ms `left/top` transitions make rescaling glide on resize.

### 4. Compatibility

- `layoutProjects` / `layoutProjectsHorizontally` keep signatures and behavior (public layout
  API + existing tests stay green); their `scattered` parameter remains the legacy path and the
  fallback used by `scatterProjects`.
- Demo props table: the `scattered` row reads "Deterministically scatter the project hubs to
  fill the available area, shrinking them as one group when crowded."

## Testing

New `scatterProjects` tests in AgentMap.test.tsx:

- All circles stay inside the box; no pair overlaps closer than `rA + rB`.
- Deterministic: two calls with the same input deep-equal.
- **Fills the box:** with 12 orbs at a full-width box, every quadrant contains at least one orb
  center (regression test for the empty-island bug).
- Crowded input returns `scale < 1`; extreme crowding clamps at `scale ≥ 0.7` before width
  growth; absurd crowding returns the legacy fallback with `scale: 1`.
- `scale` is never > 1 and equals 1 when the map already fits.

Manual: demo page "Scattered layout" toggle with Full height + Busy fleet; expand a project and
resize the window; labels stay attached, no empty island, scroll only when tight.

## Out of scope

- Random-organic or blue-noise distributions (considered, rejected for resize churn).
- Enlarging orbs beyond today's sizes when space is plentiful.
- Narrow (list) mode and the focused/orbit layers.
