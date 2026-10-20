# Design: PageHeader floating and floating-glass variants

**Date:** 2026-10-20
**Status:** Approved by user ("Lets also update the demo" = go, demo work explicitly
confirmed on top of the presented design)
**Follows:** the SideMenu floating fix (`9df41c4`) — detached cards need to pair.

## Background

`PageHeader` deliberately exposes no `variant`: it paints the SideMenu's logo-header
chrome (`SIDE_MENU_HEADER_FILL/HEIGHT/SEAM`) so the horizontal seam runs unbroken
from a flush sidebar into the page header. That contract fits the flush world.
SideMenu's `floating`/`floating-glass` variants have no seam — the menu is a
detached `m-2` rounded card with a full rim and `shadow-xl` — and today the
opaque full-width bar next to a floating menu card reads as two systems.

The floating geometry is spelled once in the kit: `getSidebarSurfaceTokens`
(`common/theme/Theme.ts`) returns `offset` (`m-2`), `radius`
(`rounded-2xl` = `DEFAULT_SURFACE_CORNER`), the rim (`border` +
`borderSides: "all"`), `shadow` (`shadow-xl`) and `fill` (opaque for
`floating`; `backdrop-blur-2xl` + tone-tinted frosted for `floating-glass`),
and is what `SideMenu` itself consumes.

## Decisions (user-confirmed)

- **Variant API:** `variant?: "default" | "floating" | "floating-glass"`.
  Additive — `default` renders today's chrome byte-for-byte (the seam
  doctrine stays as the flush default); the two floating values opt into the
  detached card. Mirroring SideMenu's full variant list was declined (dead
  values), booleans declined (`glass` without `floating` is an undesigned
  state).
- **Glass tint:** `accentColor?: TrueColor` (default `"blue"`, same name,
  type and default as SideMenu's tone), painting via the shared token
  function — `SideMenu color="emerald"` + `PageHeader accentColor="emerald"`
  read as one card system.
- **Geometry source (approach):** PageHeader calls
  `getSidebarSurfaceTokens(variant, accentColor)` — the exact call SideMenu
  makes — and applies `offset`/`radius`/`border`/`shadow`/`fill`. Spelled
  once; the header can never drift from the menu (rejected: local class
  copies; routing through `Panel`, whose floating geometry is spelled
  independently).

## Changes

### `PageHeader.tsx`

- Add `variant` and `accentColor` props; doc-comment updates from "no
  variant props" to "the variant exists for the detached world the floating
  SideMenu created; `default` keeps the seam".
- `variant === "default"`: classes exactly as today — `flex w-full
  items-center justify-between gap-4 border-b px-5` + the three seam
  constants + `className`.
- Floating variants: drop `border-b` and the seam constants; apply from the
  tokens — `surface.offset` (`m-2`), `surface.radius` (`rounded-2xl`),
  `border` + `surface.border` (full rim), `surface.shadow`, `surface.fill`.
  Keep `h-15` and `px-5` so the header card matches the floating menu's
  logo-header card height; the shared `m-2` puts both cards on one inset
  grid.

### Tests — `PageHeader.test.tsx`

- Existing drift-guard test untouched (pins `default`).
- `floating`: has `m-2`, `rounded-2xl`, `shadow-xl`, `border`,
  `border-neutral-200/80 dark:border-neutral-700/80`, `bg-white
  dark:bg-neutral-900`; no `border-b`, no seam fill.
- `floating-glass`: `backdrop-blur-2xl` + `bg-blue-100/45
  dark:bg-blue-500/15` at the default tone; `accentColor="emerald"` →
  `bg-emerald-100/45 dark:bg-emerald-500/15`; rim `border-white/50
  dark:border-white/10`.
- Parity guard: the floating class sets equal the fields of
  `getSidebarSurfaceTokens("floating"|"floating-glass", tone)` — the same
  function the menu renders.

### Demo

- New `page-header/examples/FloatingShell.tsx`: two stacked shell frames —
  SideMenu + PageHeader both `floating`, then both `floating-glass` with a
  shared tone — the pairing story side by side.
- `PageHeaderPlayground`: `variant` select (default / floating /
  floating-glass) + `accentColor` follow for the frosted preview.
- `PageHeaderPage`: register the example; description mentions the detached
  pairing. Kit `dist` rebuilt so the running site serves it.

## Non-goals

- `inset`/`glass` (non-floating) header variants — the seam default covers
  the flush world.
- A `noise` prop on the header (SideMenu-only affordance; not requested).
- Any SideMenu changes (its floating fix landed in `9df41c4`).

## Post-implementation deliverable

Explain in the final report how `SideMenu` and `PageHeader` react to the
dark/light switch: the `.dark`-on-`<html>` class strategy with Tailwind's
`@custom-variant dark`, which utility pairs flip per component (seam fill,
rim colors, frosted tints, muted copy), and why the frosted translucent
layers need no separate logic (they stack on whatever the background is).
