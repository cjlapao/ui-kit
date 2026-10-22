# Implementation Plan — SideMenu CTA cards & detail footer

**Spec:** `docs/superpowers/specs/2026-10-22-side-menu-call-to-action-footer-design.md` (committed `a2743b0`)
**Date:** 2026-10-22
**Scope:** React only (user's call — Vue sibling deferred).

**Dev loop:** `make dev-react` → http://localhost:5174/docs/components/side-menu (Vite aliases `@cjlapao/ui-kit` to kit source, no rebuild needed)
**Test loop:** `cd react && npm test` (vitest, jsdom; `SideMenu.test.tsx` uses the `MemoryRouter` harness already there)
**Type check:** `npm run lint` at root; demo typechecks via its own `tsc` (Learnings: `tsc -p` aborts silently on a misconfigured referenced project — confirm sources were actually checked)

**Grounding facts (verified 2026-10-22):**

- `SideMenu.tsx` (1355 lines): `renderContent(contentCollapsed, isMobileView)` lays out the column; `search` already demonstrates the `!contentCollapsed` gate; `sideMenuItemTokens`/`SIDEBAR_IDLE_COPY`/`surface.divider`/`surface.muted` available; local `passesGuard` closure inside `visibleItems`' `useMemo` (extract to a component-scope helper so `ctas` reuse it — guard + moduleView logic stays identical).
- `SideMenuSkeleton` takes `skeletonSlots`; add `hasCtas`/`hasFooterDetails` exactly like `hasFooterItem`.
- `Panel` (verified): `title/titleClassName`, `description/descriptionClassName`, `media`, `mediaPlacement`, `tone`, `variant`, `padding`, `clickable`, `scrollable`, `bodyClassName` — the CTA card is `<Panel variant="outlined" | "glass" … clickable={false} scrollable={false} mediaPlacement="top">`; the ✕ absolute button rides the Panel root (`relative` via `className`).
- `Pill`: `tone`, `variant` (soft default), `uppercase`, `icon` — pass the detail item's config through.
- `ScrollArea`: `variant="hover"`, `horizontal={false}`, `viewportClassName` (for `overscroll-contain`), `max-h-*` on the frame `className`.
- `Button`: plain button element, no router prop — `path` actions render `<Link to>` with `getButtonColorClasses/getButtonHoverClasses/getButtonBaseClasses` (exported at Theme.ts:2033+) so it matches the `onClick` `Button`.
- `getTrueColorTextClass` (Theme.ts:127) for tinted `value` text.
- Wash/hairline shapes `bg-{c}-50 dark:bg-{c}-500/10` + `border-{c}-200/60 dark:border-{c}-500/20`: the first pair is exactly `sideMenuItemTokens.bg` (emitted); the `/20`,`/60` opacity border shapes must be **verified in `dist/index.css` after `npm run build:react`** and added to `scripts/generate-safelist.mjs` (via `@source inline`, never hand-written CSS) if missing.
- i18n: `common/i18n/builtIn/{en,es,fr,de,pt}.ts`, `sidemenu:` block — add `dismissCta` to all five (en: "Dismiss").
- Barrel: `react/src/components/index.ts` exports the `SideMenu*` types (line ~611) — add `SideMenuCta`, `SideMenuCtaAction`, `SideMenuDetailItem`.
- Demo: `demoData.tsx` holds `DEMO_ITEMS`/`WORKSPACE_MENU`/`USER_MENU`; playground groups via `ControlAccordion` + `ToggleRow`; examples are self-contained files imported into `SideMenuPage.tsx` with `?raw` code (pattern: `TopFooter.tsx`).

## Work packages

### P1 — Kit core (lead) — `react/src`, `common/i18n`

1. `common/i18n/builtIn/*.ts`: `sidemenu.dismissCta` ×5.
2. `SideMenu.tsx`:
   - New exported types `SideMenuCtaAction`, `SideMenuCta`, `SideMenuDetailItem` + 3 new props (`ctas`, `footerDetails`, `footerDetailsTone`).
   - Extract `passesGuard` (hidden + guards + moduleView) from the `visibleItems` memo to component scope; reuse for `visibleCtas = ctas?.filter(passesGuard)` (and keep `hidden` honored).
   - `SideMenuCtaCard` internal component (Panel-based, per spec §Tone & surfaces: glass swap on `surface.idleCopy === "glass"`, resting-copy description, full-width solid Button / Link action, absolute ✕ iff `onDismiss`).
   - CTA zone rendered in `renderContent` between the nav `ScrollArea` and `footerItem`: `!contentCollapsed && visibleCtas?.length` → `<div className="shrink-0 px-3 pt-1 pb-1"><ScrollArea variant="hover" horizontal={false} className="max-h-64" viewportClassName="overscroll-contain" contentClassName="space-y-2">…cards</ScrollArea></div>`.
   - `SideMenuDetailPanel` internal component (Panel root carries wash+hairline `className`; rows `px-3 py-2 flex items-start justify-between gap-2`; explicit `border-t ${surface.divider}` separators; Pill or tinted value; left copy resting-color `min-w-0 break-words leading-snug`).
   - Detail zone between `footerItem` and the collapse control, gated `!contentCollapsed && footerDetails?.length`.
   - `SideMenuSkeleton`: `hasCtas` (media/title/2×text/button bars) + `hasFooterDetails` (boxed two-row block).
3. `react/src/components/index.ts`: export the new types.

### P2 — Tests (lead) — `react/src/components/SideMenu.test.tsx`

Cases per spec §Tests (expansion gating both zones × panel/drawer/rail; card anatomy incl. `path`-wins and click firing; ✕ iff `onDismiss` + aria-label + called; guard filtering + zone unmount; structural overflow assertions — frame `max-h-64`, viewport `overscroll-contain`; detail rows pill/value/separator; skeleton slots).

### P3 — Demo & docs (demo-docs teammate) — `react/demo/**` only

`demoData.tsx`: `DEMO_CTAS` (3 cards — 2 "Fresh content / Join Waitlist"-style + 1 dismissible w/ capacity copy) + `DEMO_DETAILS` (ENGINE V2.4 + green uppercase SYNCED pill; daemon:8088 + blue `0.4 ms` value). `SideMenuPlayground`: *Call-to-action cards* / *Detail footer* `ToggleRow`s in "Menu items". Examples `CallToActions.tsx` (component-state dismiss persistence) + `DetailFooter.tsx` w/ `?raw` wiring in `SideMenuPage.tsx`, cards in the Examples grid, page description updated to mention both. Code against the spec's API verbatim; kit-side drift is fixed by the lead in P4.

### P4 — Integration & verification (lead)

`cd react && npm test` (whole suite), `npm run lint`, demo `tsc`, `npm run build:react` + grep `dist/index.css` for every dynamic wash/hairline class shape (add safelist generator entries + rebuild if any miss), demo screenshot pass (playground, both toggles on, light/dark, glass variant), final diff review.

## Acceptance criteria (definition of done)

1. `ctas`/`footerDetails`/`footerDetailsTone` typed + exported; no changes to any existing prop's behaviour (existing `SideMenu.test.tsx` cases untouched and green).
2. Cards and detail rows appear only when expanded (incl. mobile drawer + hover overlay); absent in rail/offcanvas-hidden; vanish entirely when arrays are empty/filtered.
3. CTA zone scrolls within `max-h-64` with `overscroll-contain`; nav scroll independent.
4. ✕ iff `onDismiss`, labelled with `kit.sidemenu.dismissCta` in all five locales.
5. Card/detail surfaces follow the sidebar variant (outlined/glass swap); tone washes visible in light **and** dark, verified in `dist/index.css`.
6. Playground + both examples render in the docs page; lint/tsc/tests green.
