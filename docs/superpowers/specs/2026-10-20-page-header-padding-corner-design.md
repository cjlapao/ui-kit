# Design: PageHeader outer-gutter padding and Panel-scale corner props

**Date:** 2026-10-20
**Status:** Approved by user. First pass read `padding` as the inner
left/right inset; the user corrected it ("the padding is the external
padding, the space we leave for the floating one") and approved the
revised design: outer gutter, flush (`"none"`) by default, `"xs"`
reproducing the floating menu's `m-2` exactly. "Only to the page header":
the component takes both props; the SideMenu and its seam constants are
untouched.
**Follows:** `2026-10-20-page-header-floating-variants-design.md`.

## Background

`PageHeader` had no corner control and its detached-card margin was welded
to the SideMenu token (`m-2`). Apps want the floating card flush, or with
a wider gutter, and want the radius on the same scale Panel uses. Panel
already speaks the vocabulary: `padding` on `"none" | "xs" | … | "xl"` and
`corner` on `"auto" | "none" | "rounded" | "rounded-sm" | "rounded-md" |
"rounded-lg" | "rounded-xl"` via `getSurfaceCornerClass`, default
`DEFAULT_SURFACE_CORNER` = `"rounded-md"` (produces `rounded-2xl`).

## Decisions (user-confirmed)

- **`padding` = the OUTER gutter** — the space the card leaves around
  itself (`m-*`), not the inner inset. Default `"none"` (flush): the
  floating card sits against the container edges until the caller opens
  the gutter. `"xs"` = `m-2`, the floating SideMenu's token offset, so
  `"padding": "xs"` pairs exactly with it. The bar's inner `px-5` stays
  pinned to the seam language, untouched by the prop.
- **`corner`** on Panel's corner scale with Panel's same default; the
  floating variants take it instead of the token radius — at the default
  it produces the identical class, so the pairing guard stays green and
  the card only drifts when asked.
- **All variants carry both props**; the flush variant at `padding="none"`
  is byte-for-byte today's bar (`m-0` is a no-op there).
- **SideMenu untouched** — its logo header and `SIDE_MENU_HEADER_*`
  constants stay as they are.

## Changes

### Shared theme — `common/theme/Theme.ts`

New gutter scale spelled once beside the padding scale:
`surfaceGutterClasses` = `none: "m-0"`, `xs: "m-2"`, `sm: "m-4"`,
`md: "m-6"`, `lg: "m-8"`, `xl: "m-10"` — one step smaller per token than
`surfacePaddingClasses` so `xs` IS the shared `m-2` — deliberately WITHOUT
the padding scale's `sm:` steps (a gutter must be one predictable number
all the way down or the paired cards stop aligning). Accessors
`getSurfaceGutterClass` / `getSurfaceGutterClasses`,
`DEFAULT_SURFACE_GUTTER: "none"`.

### `PageHeader.tsx`

- `padding?: SurfacePadding` (default `"none"`) → `getSurfaceGutterClass(padding)`
  on the root in every variant, replacing the floating branch's
  `surface.offset`.
- `corner?: SurfaceCorner` (default `DEFAULT_SURFACE_CORNER`) →
  `getSurfaceCornerClass(corner)` on the root in every variant, replacing
  `surface.radius` for the floating card.
- `px-5`, `SIDE_MENU_HEADER_HEIGHT`, the fill/seam/`border-b` constants and
  region anatomy unchanged.

### Tests — `PageHeader.test.tsx`

- Default: `m-0` + `px-5` + `rounded-2xl` (corner default).
- Gutter walk: `sm` → `m-4` (inner `px-5` survives), `md` → `m-6`.
- Pairing drift guard: floating still contains the token's `border`,
  `shadow`, `fill` and (via the corner default) exact `radius`;
  `padding="xs"` emits the token's `offset` (`m-2`) to the letter.
- `corner="rounded-lg"` → `rounded-3xl`, `"none"` → `rounded-none`,
  `"auto"` tracks the theme default.

### Demo

- `Basic` / `WithSideMenu`: no `padding` (default none + `px-5` = the old
  look, byte-identical).
- `FloatingShell`: `padding="xs"` — the paired `m-2` with the floating
  menu, as before.
- Playground: "Surface" group gains `padding` (labeled "outer gutter";
  `none — flush`, `xs — the menu's m-2`, …) and `corner` selects.
- Props table and caption carry the gutter wording.

## Revision (same day) — per-axis gutters

The user asked to control all four axes individually, with the floating
card's defaults: **left 0 and bottom 0, top and right the SideMenu
floating's `m-2`**. (A full-width seam bar cannot float, so the flush
variant's default stays closed on every side — the per-axis props still
apply there when passed explicitly.)

- `padding` remains the uniform shorthand; `paddingTop`, `paddingRight`,
  `paddingBottom`, `paddingLeft` (same `SurfacePadding` tokens) win per
  axis. Resolution per axis: axis prop → uniform prop → variant default
  (`floating`: `xs` top/right, `none` left/bottom; `default`: `none`
  everywhere).
- Theme: the gutter scale becomes per-axis —
  `surfaceGutterClasses: Record<SurfaceGutterAxis, Record<SurfacePadding, string>>`
  emitting `mt-*/mr-*/mb-*/ml-*` on the same one-number-per-step rule;
  `SURFACE_GUTTER_AXES`/`SurfaceGutterAxis` exported; `getSurfaceGutterClass(axis, gutter)`.
- Pairing drift guard re-anchored: floating by default must contain
  `mt-2`/`mr-2`/`mb-0`/`ml-0`, and the test pins `surface.offset === "m-2"`
  so a token change fails loudly instead of drifting quietly. The uniform
  chain is tested both ways (explicit `padding="none"` beats the floating
  pair default).
- Demo: `FloatingShell` drops `padding="xs"` — the defaults ARE the shell
  pairing now; the playground replaces the single gutter select with four
  axis selects (`default — variant` returns an axis to its default); props
  table carries the axis story.

## Non-goals

- Inner left/right padding prop (the seam's own; `className` is the escape hatch).
- SideMenu taking either prop.
- Responsive gutter steps (one number, breakpoint-stable).
