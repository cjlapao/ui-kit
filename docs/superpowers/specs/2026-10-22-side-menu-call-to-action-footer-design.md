# SideMenu — call-to-action cards & detail footer — design

Date: 2026-10-22
Status: approved by user (five design sections confirmed; five API questions
answered, all recommended picks except kit scope; approach A approved)
References: `SideMenu` (chrome, `topItem`/`footerItem` slots, `passesGuard`),
`Panel` (card/box substrate, tone, glass swap), `Pill` (detail right side),
`ScrollArea` (CTA zone scroll), `SIDEBAR_IDLE_COPY` /
`getSideMenuItemTokens` / `getTrueColorTextClass` (tone + resting copy),
`skeletonSlots` idiom in `SideMenuSkeleton`

## Why

Two pieces of sidebar chrome the kit does not have, both from the user's
reference screenshots:

1. **Call-to-action cards** (Atheros sidebar reference): a card parked at the
   bottom of the menu — media, title, description, one action button ("Join
   Waitlist", "Upgrade plan"). The nav scroll region stays independent; the
   card pitch remains visible, which is the entire point of a CTA. There can
   be more than one; when they overflow the space between nav and footer the
   **zone itself** scrolls.
2. **Detail footer** (terminal-dock reference): a tone-washed status box
   pinned above the collapse control — stacked rows of left text (wrapping)
   with a right side that is either a pill (tone-tinted, e.g. `SYNCED`) or
   tinted text (e.g. `0.4 ms`). No buttons inside; cannot be removed by the
   user — the array is the whole contract.

## Decisions taken in conversation

- CTA zone: **pinned block with its own scroll** (not inside the nav scroll,
  not flex-share) — cards always visible, zone scrolls past the cap.
- CTA content: **structured fields** (no custom-node escape hatch) —
  predictable, themeable, portable to Vue later.
- CTA dismissal: **opt-in** — ✕ renders iff `onDismiss` is set (the
  originally-drafted `dismissible: boolean` flag was dropped in review: two
  props that must agree will disagree, and a ✕ without a handler is a dead
  control).
- Detail item: **structured pill-or-text union** rendered through the kit
  `Pill` (dots/icons/uppercase come free).
- Scope: **React only**; the Vue sibling is deferred (user's call; the
  parallel-kits norm resumes when it lands — nothing here blocks it).
- Approach **A**: data-driven props on `SideMenu`, card/box implemented on
  top of `Panel`. Hand-rolled parallel card surfaces (B) and slot render-
  props (C) were rejected — see Learnings entries for `FormSection` /
  `TimelinePanel` ("a container that is a Panel with extras should render a
  Panel") and the structured-fields pick.

## Public API (React)

```ts
export interface SideMenuCtaAction {
  label: string;
  /** Route — rendered as a react-router <Link> carrying Button's class
   *  recipe (`getButtonColorClasses` et al.), so it is indistinguishable
   *  from the `onClick` Button. `path` wins over `onClick`. */
  path?: string;
  /** Otherwise a solid tone Button (size "sm", full width) calling this. */
  onClick?: () => void;
  icon?: IconName;
}

export interface SideMenuCta {
  slug: string;                       // stable key, like SideMenuItem
  title: string;
  description?: string;
  /** Top media — any node (DynamicImg, illustration, icon…). Absent = text-only card. */
  media?: React.ReactNode;
  action?: SideMenuCtaAction;
  /** Accent tone. @default the menu's `color`. */
  tone?: TrueColor;
  hidden?: boolean;
  /** Same guard model as nav items — run through the shared `passesGuard`. */
  guards?: SideMenuItemGuard[];
  /** Corner ✕; rendered iff present. SideMenu only calls it — the app owns
   *  persistence (localStorage etc.). */
  onDismiss?: () => void;
}

export interface SideMenuDetailItem {
  slug: string;
  /** Left copy — wraps onto as many lines as it needs (`min-w-0`). */
  text: React.ReactNode;
  /** Right side: a pill through the kit Pill… */
  pill?: {
    label: React.ReactNode;
    tone?: TrueColor;                 // @default the menu's `color`
    variant?: PillVariant;            // @default "soft"
    uppercase?: boolean;
    icon?: IconName;
  };
  /** …or tinted text via getTrueColorTextClass(color). Ignored when pill set. */
  value?: {
    label: React.ReactNode;
    color?: TrueColor;                // @default the menu's `color`
  };
}
```

New `SideMenuProps`:

- `ctas?: SideMenuCta[]`
- `footerDetails?: SideMenuDetailItem[]`
- `footerDetailsTone?: TrueColor` — wash/hairline tone of the detail box,
  `@default` the menu's `color` ("lighter colour based on the tone",
  overridable per menu).

Exported from the kit barrel alongside the other `SideMenu*` types.

## Regions & layout

Panel column, top → bottom:

```
logo → topItem → search → title → nav (flex-1, own ScrollArea)
     → CTA zone (shrink-0) → footerItem → detail panel (shrink-0) → collapse control
```

**CTA zone** — `shrink-0 px-3 pt-1 pb-1` (matching the nav's `px-3` inset),
cards stacked `space-y-2`. Its own `ScrollArea variant="hover"
horizontal={false}` capped at `max-h-64` — 16rem as a real scale step (no
arbitrary value), which shows ~1.5 media cards or ~2 compact text cards and
scrolls beyond that (the cap's exact value is tuned in the visual pass,
staying on the scale), `overscroll-contain` on the viewport
(`viewportClassName`) so a wheel at the end of the cards does not chain to
the page. The nav is `flex-1 min-h-0` and yields space first: a long menu
never squeezes the cards; past the cap the zone scrolls.

**Detail panel** — one `Panel` (props in §Tone & surfaces) containing stacked
rows; `shrink-0 px-3 pb-1`, directly above the collapse control — the ENGINE
box over "Collapse Dock" in the reference. No scroll: status copy, the menu
already scrolled to reach it.

**Visibility** — both zones gated on `contentCollapsed` (the same gate
`search` uses): absent in the 68px rail, present when expanded, present in
the mobile drawer (always expanded), present inside the `openOnHover`
overlay (the overlay *is* the expanded panel).

**Skeleton** — `SideMenuSkeletonSlots` gains `hasCtas` (one card-shaped
placeholder: media bar, title bar, two text bars, button bar) and
`hasFooterDetails` (boxed two-row block), mirroring `hasFooterItem`, so the
loading panel keeps the real height. Empty or fully-guarded-away arrays
render nothing at all — no hairline, no padding stub.

## Tone & surfaces

**CTA card** — a real `Panel`: `variant="outlined"`,
`tone={cta.tone ?? color}`, `padding="sm"`, kit default corner,
`mediaPlacement="top"`, `clickable={false}` (the button owns interaction),
`scrollable={false}` (also dodges the `overflow-auto` focus-ring shear from
Learnings). When the sidebar surface is glass (`glass`, `floating-glass` —
i.e. `surface.idleCopy === "glass"`) the card switches to
`Panel variant="glass"` tinted with the card tone: glass containers get
glass children.

- **Title**: high-contrast copy (`text-neutral-900 dark:text-neutral-100`).
- **Description**: sidebar resting copy
  (`SIDEBAR_IDLE_COPY[surface.idleCopy].text`) so it survives see-through
  surfaces instead of collapsing like a bare `neutral-500`.
- **Action**: `onClick` → kit `Button` (`solid`, card tone, `size="sm"`,
  full width — the reference's "Join Waitlist"); `path` → router `<Link>`
  with Button's class recipe from the exported `getButtonColorClasses`
  getters. `path` wins over `onClick`; no action → no footer row.
- **✕ dismiss**: plain ghost button (same idiom as the mobile close button:
  `CustomIcon icon="Close"`, `surface.muted` + tone hover), top-right of the
  card, `aria-label` from `kit.sidemenu.dismissCta`.

**Detail panel** — a `Panel` (`clickable={false}`, `scrollable={false}`,
same glass swap rule) whose wash is explicit so it reads "lighter than the
surface" regardless of variant defaults: wash
`bg-{tone}-50 dark:bg-{tone}-500/10` and hairline
`border-{tone}-200/60 dark:border-{tone}-500/20` (the generated-token idiom
of `getSideMenuItemTokens`), applied as `className` on the `Panel` root —
the root owns the radius, so the wash clips with it. Rows: `px-3 py-2`,
`flex items-start justify-between gap-2`; separators are explicit
`border-t ${surface.divider}` elements between rows, like the nav's dividers
— **not** `divide-y`, whose colour needs `divide-*` classes the surface
tokens never emit.

- Left `text`: sidebar resting copy, wraps naturally (`min-w-0`,
  `break-words`, `leading-snug`, no truncation).
- Right element: `shrink-0 text-right` so long left copy never pushes it out
  of the panel. `Pill` (`variant="soft"` default, item tone @default menu
  tone) or tinted text via `getTrueColorTextClass(color)` — 500-step light /
  400-step dark, the "SYNCED / 0.4 ms" look.
- Font stays the kit default; `text`/`value` are `ReactNode`, so callers
  wanting the mono terminal vibe pass `<code>` themselves.

**Safelist discipline** (Learnings): no new dynamic class shapes — wash,
hairline and text pairs are composed only from shapes `scripts/
generate-safelist.mjs` already emits; anything genuinely new goes into the
generator and is verified in `dist/index.css`, never hand-written CSS.

## Behaviour & edge cases

- **Guards**: `ctas` run through the same `guardEvaluator` +
  `activeModuleView` filter as nav items — one shared `passesGuard` helper,
  not a copy.
- **Search**: never filters CTAs (it filters navigation; CTAs are chrome).
- **All cards gone** (dismissed/guarded/hidden/empty array/undefined): the
  whole zone unmounts. Same rule for the detail panel.
- **Row layout**: left `min-w-0`, right `shrink-0` (see above).
- **Keyboard/focus**: Tab order nav → CTA buttons → `footerItem` → static
  detail rows; CTA `ScrollArea` keeps `tabIndex={0}`; card buttons sit
  inside `px-3` so focus rings aren't sheared by the scroller edge.
- **a11y**: ✕ is a real button with `aria-label`; detail rows are static
  content — no roles, no fake landmarks.
- **i18n**: one new key, `kit.sidemenu.dismissCta`, added to all five
  built-ins (`en/es/fr/de/pt`); every other visible word is caller-supplied.
- **Loading**: skeleton slots per §Regions; the `spinner`/`progress` overlay
  dims the zones along with the rest, as today's chrome does.

## Tests (`SideMenu.test.tsx`)

- CTAs render only expanded: present in the panel and mobile drawer, absent
  from the icon rail; same gate asserted for `footerDetails`.
- Card anatomy: title/description/media render; `action.path` → `<Link>`
  with `href` (existing router harness); `action.onClick` → Button click
  fires; `path` wins when both set; no action → no footer row.
- Dismiss: ✕ exists iff `onDismiss`; click calls it; `aria-label` present.
- Guards: `guardEvaluator` filters `ctas` like `items` (shared helper);
  fully-filtered array → zone absent from the DOM.
- Overflow (structural — jsdom has no layout): CTA `ScrollArea` frame
  carries `max-h-64`, viewport carries `overscroll-contain`,
  `horizontal={false}`; stacked cards are siblings.
- Detail box: rows render `text` left + `Pill` right (soft, tone classes) or
  tinted value (`getTrueColorTextClass` classes); separator between rows;
  nothing when the prop is undefined.
- Skeleton: `loading` + `ctas` → card-shaped placeholder; same for
  `footerDetails`.

## Demo (react/demo, kit-docs)

- `demoData.tsx`: `DEMO_CTAS` — **three** reference-style cards ("Fresh
  content / Join Waitlist" ×2 + one dismissible), so the stack overflows the
  `max-h-64` cap and the zone scroll is demonstrable, and a second
  dismissible card shows dismissal mid-stack; `DEMO_DETAILS` — faithful dock
  content ("ENGINE V2.4" / "daemon:8088", green uppercase `SYNCED` pill,
  tinted `0.4 ms`).
- `SideMenuPlayground`: two `ToggleRow`s in the "Menu items" group —
  *Call-to-action cards* / *Detail footer*.
- `SideMenuPage` + `examples/`: `CallToActions.tsx` (with component-state
  dismiss persistence) and `DetailFooter.tsx`, named like the existing
  `TopFooter.tsx`.

## Verification

`npm run lint:react`, kit + demo `tsc`, react test run, and — because the
tints are dynamic — one `build:react` with `dist/index.css` grepped for the
exact wash/hairline class shapes. Headless-Chrome screenshots of the
playground with both toggles on (light + dark, glass variant included) for
the visual pass.

## Out of scope

Vue sibling (deferred by user; port later against this spec — the structured
API and shared helpers are deliberately framework-portable), CTA analytics
hooks, auto-dismiss timers, per-CTA custom rendering.
