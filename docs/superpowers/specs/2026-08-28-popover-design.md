# Popover — design

Port of the [PrimeVue Popover](https://primevue.dev/popover/) into the kit's
UI language, React first (Vue explicitly out of scope for this pass). The
surface is a real `Panel` — all eight `SURFACE_VARIANTS`, tone, corner,
padding, glass props — with PrimeVue's signature arrow, its anchored-overlay
animation, and the kit's shared loader language.

Approved in conversation on 2026-08-28 (trigger API: element prop).

## PrimeVue reference behaviour (from `.primevue/.../popover/`)

- `toggle(event, target)` / `show` / `hide`; portal to `body`; absolute
  position against the target.
- Flips above the target when there is no room below
  (`p-popover-flipped`); the **arrow** tracks the target's offset so it keeps
  pointing at it after any clamping.
- `dismissable` (default `true`) — outside click closes; `closeOnEscape`
  (default `true`); `breakpoints` — responsive widths via an injected
  `<style>` tag; `baseZIndex` / `autoZIndex`; scroll/resize **close** the
  overlay; `[autofocus]` focus on show; `show` / `hide` events;
  `role="dialog"`, focus trap.
- Enter/leave motion: the `p-anchored-overlay` transition — scale + fade
  (the same family the kit already implements as the DatePicker overlay:
  300 ms, `scale(0.93)`, `cubic-bezier(0.19, 1, 0.22, 1)`).

## Approach

**Compose the kit's existing overlay machinery** (chosen over factoring a
shared primitive out of `HelpButton`, and over a literal port of PrimeVue's
JS):

- placement geometry: `resolveTooltipPlacement` from
  `common/tooltip/placement.ts` (pure flip → opposite → perpendiculars,
  viewport clamp, and `caret` — the arrow offset that keeps pointing at the
  trigger after clamping);
- animation: the DatePicker overlay pattern (class-driven keyframes +
  `animationend` phase machine, reduced-motion = 1 ms, never `none`);
- dismissal/focus: `HelpButton`/`DropdownMenu` conventions (document
  `mousedown` owns pointer dismissal; body-portaled `fixed` box collides
  against the **viewport**, full stop — the DropdownMenu lesson);
- scroll/resize: **reposition**, not close — the kit's deliberate deviation
  from PrimeVue (documented in `useOverlayPosition`).

## API

`react/src/components/Popover.tsx`:

```tsx
export const POPOVER_PLACEMENTS = ["auto", "top", "bottom", "left", "right"] as const;
export type PopoverPlacement = (typeof POPOVER_PLACEMENTS)[number];
export type PopoverLoaderType = PanelLoaderType; // "spinner" | "progress" | "skeleton"

export interface PopoverProps {
  /** Anchor element. Cloned: onClick wraps (toggle), aria-haspopup/expanded/controls set. */
  trigger: ReactElement;
  children?: ReactNode;
  /** @default "auto" (canonical side: bottom) */
  placement?: PopoverPlacement;
  /** @default "elevated" */
  variant?: SurfaceVariant;
  /** @default "neutral" */
  tone?: TrueColor;
  /** @default DEFAULT_SURFACE_CORNER */
  corner?: SurfaceCorner;
  /** @default "sm" — popover copy is compact */
  padding?: SurfacePadding;
  /** @default 320, capped at viewport − 16 */
  maxWidth?: number;
  /** @default true */
  arrow?: boolean;
  /** @default true — close on outside click */
  dismissable?: boolean;
  /** @default true — Escape closes */
  closeOnEscape?: boolean;
  /** Controlled open state. Uncontrolled by default. */
  visible?: boolean;
  /** Intent changes (trigger click, outside click, Escape) — the controlled-mode contract. */
  onOpenChange?: (open: boolean) => void;
  /** Overlay starts showing. */
  onShow?: () => void;
  /** Overlay actually hides (leave completes / unmounts). */
  onHide?: () => void;
  /** @default false */
  loading?: boolean;
  /** @default "spinner" */
  loaderType?: PopoverLoaderType;
  loaderTitle?: ReactNode;
  loaderMessage?: ReactNode;
  loaderProgress?: number;
  loaderColor?: LoaderProps["color"];
  /** @default 3 */
  skeletonLines?: number;
  /** Glass family, forwarded to the Panel. */
  vibrancy?: GlassVibrancy;
  glassOpacity?: GlassOpacity;
  specularMode?: PanelSpecularMode;
  className?: string;
}
```

No component-local unions: placement is a runtime list, variant/tone/corner/
padding/glass come from the theme. `breakpoints` is deliberately not ported
(style-tag injection is a React anti-pattern; `maxWidth` covers the need).
No `appendTo`/`baseZIndex`/`autoZIndex`/`ripple`/`pt`: the kit has one portal
strategy (body) and auto z-index from the anchor's layer.

### Trigger contract

The trigger is wrapped in a measuring `span` (inline-flex) **and** cloned
with:

- a composed `ref` (callers' ref preserved; falls back to the wrapper for
  non-forwarding elements),
- `onClick` — wrapped: outside/inside as applicable, then the caller's
  handler; the component's toggle runs first, the caller's handler still
  fires,
- `aria-haspopup="dialog"`, `aria-expanded={open}`, `aria-controls` (the
  overlay id while open).

Measurement uses the composed ref when attached, else the wrapper span —
so any DOM element works as a trigger.

## Architecture

- **Render:** `createPortal` → `document.body`. The wrapper div carries
  `position: fixed`, the placement style, the animation classes,
  `role="dialog"`, `aria-modal="false"`, `tabIndex={-1}`, `data-variant` /
  `data-tone` / `data-placement`. Inside: the arrow (when `arrow`) and a
  **passive** `Panel` (`padding="none"`, `scrollable={false}` — the
  HelpButton lesson: Panel's padded `overflow-auto` body double-scrolls and
  fights fixed positioning), whose body is
  `overflow-y-auto max-h-[55vh]` around a `getSurfacePaddingClass(padding)`
  content div.
- **Placement — two-pass.** Open → wrapper mounts with
  `{position: fixed, visibility: hidden, maxWidth: min(maxWidth,
  viewport − 16)}`. `useLayoutEffect` measures wrapper + anchor, calls
  `resolveTooltipPlacement` (preferred = `placement !== "auto" ?
  placement : "bottom"`, offset 8, margin 8, `caretInset` = the corner
  radius in px + 8, so the arrow never sits on the rounded part), sets the
  positioned style + `{side, caret, flipped}`, and the enter animation runs
  from the visible state. Scroll (capture) / resize / `ResizeObserver`
  (anchor + wrapper) re-run the same computation while visible — rAF
  scheduled.
- **z-index:** `resolveOverlayZIndex(anchor)` — walk the anchor's ancestor
  z-stacks, sit one above the max. The helper moves from
  `DatePicker/useOverlayPosition.ts` to `common/utils/overlayZIndex.ts` this
  pass (shared concept; all controls import it), and `useOverlayPosition`
  is updated to import it from there.
- **Animation:** `react/src/styles.css` gains `popover-overlay-enter/leave`
  keyframes + `.popover-overlay--enter/--leave` classes (same 300 ms
  `cubic-bezier(0.19, 1, 0.22, 1)` scale 0.93 + fade as the DatePicker
  overlay), `prefers-reduced-motion` shortens to 1 ms (never `none` — the
  state machine unmounts on `animationend`).
- **Phase machine:** `closed → entering → open → leaving → closed`
  (DatePicker pattern, guarded: `event.target === event.currentTarget` +
  animation-name check). `onShow` fires once when `entering` starts;
  `onHide` fires once when the leave completes; `onOpenChange` fires on
  every intent change (trigger, dismissal) in both modes.
- **Dismissal:** document-level `mousedown` outside wrapper + trigger
  closes when `dismissable`; re-clicking the trigger toggles closed
  (PrimeVue's `isTargetClicked` guard). `Escape` closes when
  `closeOnEscape` and returns focus to the trigger.
- **Focus:** on open, focus `[autofocus]` in the content if present, else
  the wrapper (`tabIndex={-1}`); on close, focus returns to the trigger.
  Non-modal: no focus trap (that is `Modal`'s job).

## Visual language

- **Surface = Panel.** Variant/tone/corner/glass props forward to the
  rendered Panel; `data-variant`/`data-tone` on both wrapper and section.
- **Arrow:** 16 px rotated square (w-4 h-4, `rotate-45`) on the
  trigger-facing edge, centre on the panel edge (diamond tip ~11 px out,
  inner half hidden behind the panel), positioned by the placement `caret`
  (`left/top` = caret − 8). It must read as a continuation of the panel's
  own edge, so it wears the panel's chrome per variant — a new
  `getPanelEdgeChrome(variant, tone, glassOpacity)` helper **exported from
  `Panel.tsx`** (reusing `variantBaseStyles`, `GLASS_RIM`,
  `getPanelToneStyles`, `getSurfaceGlassFillClass`) returning
  `{ fill, rim, blur }`:
  - `elevated`: `bg-white dark:bg-neutral-900`, `ring-1 ring-black/5
    dark:ring-white/10`;
  - `outlined`: `bg-white/90 dark:bg-neutral-900/80`, `border
    ${palette.outlineBorder}`;
  - `subtle`: `palette.subtleBg`, `border ${palette.border}`;
  - `tonal` / `simple`: `palette.tonalBg`, no visible rim;
  - `default`: `bg-white/80 dark:bg-neutral-900/70`, `GLASS_RIM`,
    `backdrop-blur-xl`;
  - `glass`: `palette.glassBg`, `GLASS_RIM`, `backdrop-blur-xl`;
  - `liquid-glass`: `getSurfaceGlassFillClass(tone, glassOpacity)`,
    `palette.liquidBorder`, `backdrop-blur-2xl` + `getGlassVibrancyClass`.
  Border sides follow the edge: bottom-side → `border-t border-l`, top-side
  → `border-b border-r`, left-side → `border-t border-r`, right-side →
  `border-b border-l` (ring variants use the ring as the rim).
- **Size:** the shared container language — `padding: SurfacePadding` for
  the inset, `maxWidth` for the width cap (content-sized below it). No
  bespoke size union.
- New dynamic classes are expected to be **zero** (the arrow reuses
  Panel's already-safelisted tone/glass tokens); per-tone verification of
  the built CSS is still run.

## Loading / empty / error (matching Panel)

- `loading` + `loaderType="spinner" | "progress"` → the kit `Loader` in
  `overlay` mode covering the wrapper (the wrapper carries the corner
  radius class so `rounded-[inherit]` resolves); `loaderProgress` drives
  the bar.
- `loaderType="skeleton"` → the content is replaced by a skeleton shaped
  like popover content: a title bar + `skeletonLines` lines, built from
  Panel's exported `SkeletonBar` (`animate-pulse`,
  `motion-reduce:animate-none`), `aria-busy` on the wrapper.
- Empty/error: **none** — like `Panel`, Popover is a content container;
  callers render `EmptyState` / `ApiErrorState` inside.

## kit-docs

- **Registry:** `slug: "popover"`, name "Popover", icon `Chat`, category
  **Overlays** (after Help Button), lazy-loaded page.
- **`shared/options.ts`:** `popoverPlacementOptions = toOptions(POPOVER_PLACEMENTS)`
  (kit runtime list, per the brief).
- **`components/popover/`:** `PopoverPage.tsx` (PageHeader + playground +
  example cards, HelpButtonPage pattern), `PopoverPlayground.tsx`, and
  `examples/`:
  1. `Basic` — toggle button, simple copy.
  2. `RichContent` — icon + heading + text + an action inside.
  3. `EverySurface` — all eight variants, glass ones over a glass backdrop.
  4. `EveryTone` — 21 triggers, each opening its toned popover.
  5. `PlacementFlip` — explicit top/bottom/left/right + a 90 vh tall card
     whose bottom trigger flips up when the section is in view (the demo
     must actually produce the flip it describes).
  6. `LoadingStates` — spinner, progress, skeleton.
  7. `Controlled` — `visible` driven by buttons; `onShow` / `onHide` /
     `onOpenChange` events logged.
  8. `NonDismissable` — `dismissable={false}`: only the trigger or Escape
     closes it.
- **Playground:** MultiToggle for short lists (placement, padding, loader
  type), Select for long ones (variant, tone, corner, glass
  vibrancy/opacity/specular), toggles for every state (arrow, dismissable,
  closeOnEscape, loading), a glass backdrop for see-through variants, a
  "Current settings" block, and full matrices (the surface/tone examples).

## Tests & verification (brief §6, numbers reported)

- **Unit** (`react/src/components/Popover.test.tsx`, jsdom with mocked
  rects, the DatePicker `animationend` dispatch trick):
  - trigger aria (`haspopup` / `expanded` / `controls`) + caller onClick
    still fires;
  - open/close lifecycle: `onShow`, `onHide`, `onOpenChange`;
  - controlled `visible`: outside click → `onOpenChange(false)`, overlay
    stays; `visible={true}` opens;
  - outside-`mousedown` dismissal; `dismissable={false}` keeps it open;
  - `closeOnEscape` true/false; focus returns to the trigger;
  - variant × tone matrix: all 8 variants render (`data-variant`,
    edge-chrome classes present), sampled tones (`data-tone`);
  - arrow: present by default, absent with `arrow={false}`, positioned at
    the `caret` on the correct edge;
  - flip: anchor near the viewport bottom → overlay top < anchor top;
  - loading: spinner/progress overlay present; skeleton replaces children
    + `aria-busy`;
  - portaled node queried via `document` (Learnings).
- **Headless visual:** throwaway demo page over the real backdrop, light +
  dark, every variant, the padding ladder, all 21 tones, every state,
  opaque **and** glass; `--dump-dom` probe (arrow `left` = caret,
  `getAnimations()` + forced reduced motion); harness deleted after.
- **Build gate:** `cd react && npm run lint && npx vitest run && npm run
  build`; `cd react/demo && npx tsc --noEmit && npx vite build`; per-tone
  safelist grep of the built CSS; demo error count not increased.
- **Learnings.md** appended with new lessons (one row each, root cause +
  rule).

## Deliberately not doing (stated in the report)

- **Vue kit** — React only this pass; Vue is one step behind (user
  instruction).
- **`breakpoints`** — `maxWidth` covers the need.
- **`appendTo` / `baseZIndex` / `autoZIndex` / `ripple` / `pt`** — one
  portal strategy, auto z-index from the anchor layer.
- **Focus trap** — non-modal popover; `Modal` owns traps.
- **UxDemo playground section** — kit-docs only (HelpButton precedent);
  offered, not requested.
- **`borderColor` / `backgroundColor` Panel overrides** — the arrow chrome
  does not follow those overrides; documented.

## Files

| File | Change |
| --- | --- |
| `common/utils/overlayZIndex.ts` | new — shared z-index resolver |
| `react/src/components/DatePicker/useOverlayPosition.ts` | import the shared resolver |
| `react/src/components/Popover.tsx` | new — component + types |
| `react/src/components/Popover.test.tsx` | new — tests |
| `react/src/components/Panel.tsx` | export `getPanelEdgeChrome` |
| `react/src/styles.css` | popover overlay keyframes + reduced-motion |
| `react/src/components/index.ts` | barrel exports |
| `react/demo/src/kit-docs/registry.ts` | Overlays entry |
| `react/demo/src/kit-docs/shared/options.ts` | `popoverPlacementOptions` |
| `react/demo/src/kit-docs/components/popover/*` | page, playground, 8 examples |
| `Learnings.md` | appended lessons |
