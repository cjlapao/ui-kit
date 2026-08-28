# Toast — design

Port of the [PrimeVue Toast](https://primevue.dev/toast/) — specifically the
4.5.5 **stacked** toast, where toasts pile as a deck of collapsed cards at a
screen corner and fan out into their full message cards on hover — into the
kit's UI language. React only; Vue is explicitly a step behind for this pass.

Approved in conversation on 2026-08-28: **provider + hook** API
(`<ToastProvider>` + `useToast()`), and the card speaks **Alert's status
family** (`intent` + `ALERT_VARIANTS` incl. `glass` / `liquid-glass`), not
Panel's container family.

## PrimeVue reference behaviour (from `.primevue/.../toast/` + live 4.5.5 CSS/JS)

Extracted from the checked-out 4.5.5 source and the compiled CSS/JS served on
primevue.dev (scratch notes in `.qa/toast-research/`):

- Viewport: `position: fixed`, 18.75rem wide, z-index 2000, one of **7
  positions** (`top-left`, `top-center`, `top-right`, `bottom-left`,
  `bottom-center`, `bottom-right`, `center`), 2rem inset (center is 50/50).
- Every message is **absolutely pinned to the corner**
  (`bottom:0; right:0` etc.), width 100% of the viewport. All geometry is CSS
  driven by custom properties:
  - container: `--px-gap` (default **12px**), `--px-front-toast-height`
    (the **newest** message's measured height), `--px-raise-factor`
    (−1 for bottom positions, +1 otherwise).
  - message: `--px-toast-index` (visible index, **newest = 0 / front**),
    `--px-toast-z-index` (`count − index`), `--px-initial-height` (its own
    measured height), `--px-toast-offset` (cumulative height of the newer
    messages), plus swipe deltas.
- **Stacked** (default `mode`): the front message sits at the corner at full
  height; every back message is clipped to the front toast's height
  (`overflow:hidden`), translated `index × gap` away from the corner and
  scaled `1 − index × 0.05` — the peeking deck.
- **Expanded** (`mode="expanded"`, or the stacked mode while the group is
  hovered/focused — the container publishes `data-expanded`): each card
  transitions to its own measured height, translated by
  `offset + index × gap` away from the corner — the fan-out. A `::after`
  spacer of `gap + 1px` keeps the seam honest during the transition.
- `limit` (default **3**): only the 3 newest are visible; older messages keep
  their slot in the math but get `opacity:0; pointer-events:none` +
  `aria-hidden` (they un-hide as older ones leave).
- Entry: opacity 0 + translated 100% off-screen → `data-mounted` (set after
  the first height measurement) → opacity 1 at the corner. Transition on
  transform/opacity/height at the theme duration.
- Removal: `data-removed` freezes the leaving card's offset
  (`offsetBeforeRemove`) so the stack behind reflows under it; the front
  slides ∓100% away, expanded backs slide past their offset, collapsed backs
  quick-fade (transform 500ms / opacity 200ms).
- **Timers**: `life` (ms) auto-dismisses with a `life-end` event; the timer
  **pauses** while the stack is expanded (hover/focus of the group) or the
  card is interacting (pointer down), resumes with the remaining time.
  `sticky` = no timer.
- **Swipe**: pointer/touch drag tracks live deltas (no transition while
  `data-swiping`); release past a threshold commits `data-swipe-out` +
  direction (up/down/left/right fly-off), otherwise spring back. Targets
  inside `[data-dismissible="false"]` are excluded from the interaction
  pause (e.g. a nested control).
- Groups: the service fans out `add` to every viewport whose `group` matches
  (or is unset); `remove`, `removeGroup`, `removeAllGroups`.
- a11y: per-severity roles in PrimeVue; the close button is `autofocus`-free
  but labelled; keyboard focus into the group expands the stack; hidden
  messages are untabbable.

## Approach

Compose the kit's existing machinery; no literal port of PrimeVue's JS:

- **Surface**: Alert's status family — `getAlertVariantTokens`
  (subtle/solid/outline/glass/liquid-glass), `ALERT_INTENT_CONFIG`
  (info/success/warning/danger/neutral → tone + registry icon + live-region
  politeness), glass.ts fills/rims, `DEFAULT_SURFACE_CORNER`. The card
  mirrors the tokens (the Popover "passive Panel" precedent) rather than
  rendering a full `Panel`: Panel's padding/scroll/provider machinery is
  wrong inside a height-animating, height-measured stack.
- **Geometry**: the PrimeVue data-attribute state machine, ported to
  `.kit-toast` scoped CSS in `react/src/styles.css` (brief §5.10: component
  CSS in `styles.css`; transitions in classes, parameters inline as custom
  properties so `prefers-reduced-motion` can override the duration).
- **Measurement**: `useLayoutEffect` + `ResizeObserver` per card reporting
  `{index, height, removed}` to the viewport's height registry; a card
  reveals only once measured (PrimeVue's `data-mounted` parity — no
  zero-height flash).
- **Service model**: a provider-scoped store (React `useSyncExternalStore`
  over a small emitter) so `useToast()` works anywhere under the provider;
  the store is also exported headless for tests and advanced callers.
- **z-index**: `DEFAULT_TOAST_Z_INDEX = 2000` (above Modal's 1600 — a toast
  raised while a modal is open must sit above it; PrimeVue parity).

## Theme additions (`common/theme/Theme.ts`, promoted in this pass per brief §2)

- `TOAST_POSITIONS` (the 7 above) + `ToastPosition` type
- `TOAST_MODES = ["stacked", "expanded"]` + `ToastMode`
- `TOAST_SIZE_STYLES` / `getToastSizeTokens(size: ControlSize)` — card
  padding, content gap, title/detail type sizes, icon box, close-button box,
  action-button size; derived off `CONTROL_SIZES`, the shared scale
- `DEFAULT_TOAST_POSITION = "top-right"`, `DEFAULT_TOAST_MODE = "stacked"`,
  `DEFAULT_TOAST_GAP_PX = 12`, `DEFAULT_TOAST_LIMIT = 3`,
  `DEFAULT_TOAST_LIFE_MS = 5000`, `DEFAULT_TOAST_Z_INDEX = 2000`,
  `TOAST_DEFAULT_WIDTH = "18.75rem"`
- Reuse, never re-declare: `ALERT_INTENTS`, `ALERT_INTENT_CONFIG`,
  `ALERT_VARIANTS`, `TrueColor`, `ControlSize`, glass helpers.

## API

```
react/src/components/Toast/
  types.ts            ToastMessageState, ToastInput, ToastEvents
  toastStore.ts       createToastStore(): messages, ids, life timers (pause/
                      resume/remaining), groups, limit bookkeeping, events
  ToastProvider.tsx   <ToastProvider>{…}</ToastProvider> — context for the
                      store + viewport registry
  ToastViewport.tsx   the fixed corner viewport (portal → document.body)
  ToastMessageCard.tsx  the card: Alert-family surface + measurement +
                      data-attribute states + swipe
  useToast.ts         useToast() / useToastStore()
  index.ts
```

`useToast()` returns `{ toast }`:

```tsx
toast.show(input)        // full form (below); returns the message id
toast.info(title, detail?, opts?)     // intent sugar, same for
toast.success(…)  toast.warning(…)  toast.danger(…)  toast.neutral(…)
toast.update(id, patch)  // e.g. { progress, detail, title } — needed for
                         // real progress toasts (PrimeVue re-adds instead)
toast.close(id)
toast.closeGroup(group)
toast.clear()
toast.onClose(cb) / toast.onLifeEnd(cb)   // store-level (all viewports),
                                          // PrimeVue service parity; return
                                          // unsubscribe. The viewport's own
                                          // onClose / onLifeEnd props fire
                                          // only for its group.
```

`ToastInput`:

```tsx
{
  intent?: ToastSeverity;      // AlertIntent alias; @default "neutral"
  title?: ReactNode;
  detail?: ReactNode;
  variant?: AlertVariant;      // subtle | solid | outline | glass | liquid-glass
                                // @default "glass" — the kit's see-through
                                // default (volt parity: a blurred card)
  color?: TrueColor;           // tone override (@default from intent)
  size?: ControlSize;          // @default "md"
  vibrancy?: GlassVibrancy;    // glass variants; @default "medium" (Panel parity)
  glassOpacity?: GlassOpacity; // glass variants; @default "frosted" (Panel parity)
  specularMode?: PanelSpecularMode; // glass variants; @default "classic"
  icon?: string | ReactElement | false;   // @default from intent
  life?: number;               // ms; @default DEFAULT_TOAST_LIFE_MS
                                // life: 0 = no timer (same as sticky: true)
  sticky?: boolean;            // @default false — no timer at all
  closable?: boolean;          // @default true
  progress?: number;           // 0..100 → kit Progress in the message tone
  loading?: boolean;           // kit Spinner replaces the intent icon
  group?: string;
  onClick?: (e) => void;
  actions?: { label: ReactNode; onClick?: () => void }[];  // kit Buttons,
                                                           // trigger-family sm
  meta?: unknown;              // opaque, echoed back in events
}
```

`<ToastViewport>`:

```tsx
{
  group?: string;        // filter
  position?: ToastPosition;   // @default DEFAULT_TOAST_POSITION
  mode?: ToastMode;            // @default DEFAULT_TOAST_MODE
  gap?: number;                // @default 12
  limit?: number;              // @default 3
  width?: string;              // @default TOAST_DEFAULT_WIDTH
  zIndex?: number;             // @default DEFAULT_TOAST_Z_INDEX
  breakpoints?: Record<string, { width?: string }>;  // PrimeVue parity —
                                                     // injected scoped <style>
  onClose?: (m) => void; onLifeEnd?: (m) => void;    // per-viewport events
}
```

Multiple viewports of the same group both render (PrimeVue parity). Group
matching is PrimeVue's strict equality: a viewport **without** `group`
renders only ungrouped messages; a grouped message reaches only viewports
whose `group` equals it.

**Deliberate divergences (documented in the report):**

1. `life` defaults to 5000ms in the kit (PrimeVue: no default). A toast that
   never dies is a trap; `sticky: true` or `life: 0` for persistent.
2. `toast.update()` for progress/detail changes (PrimeVue re-adds a message).
3. No `pt` passthrough, no `closeButtonProps`, no `templates` — kit pattern:
   tokens, not pass-through (same as Popover/DatePicker).
4. Default position stays `top-right` (PrimeVue parity); the demo's hero is
   bottom-right stacked, matching the target screenshots.

## The card (ToastMessageCard)

- Layout: intent icon (or Spinner when `loading`) + title/detail column +
  `Progress` (when `progress != null`) + actions row + absolutely-positioned
  close button (top-right, variant-token hover/focus, `aria-label`).
  `white-space: pre-line; word-break: break-word` (PrimeVue parity).
- Surface: `getAlertVariantTokens(color, variant)` for fill/border/icon/text/
  dismiss; glass variants take glass.ts fill + rim + blur (vibrancy/opacity/
  specular props on the viewport? **no** — card-level `vibrancy` /
  `glassOpacity` / `specularMode` props, defaulted like Panel: medium /
  frosted / classic). Corner: `DEFAULT_SURFACE_CORNER`. Copy colours from
  the variant tokens only (brief §4 — no hardcoded `text-neutral-*`).
- Size: `getToastSizeTokens(size)` — one record per `ControlSize`, no
  component-local `"sm" | "md" | "lg"` (brief §2).
- Data-attribute state machine (PrimeVue parity, kit-prefixed):
  `data-mounted`, `data-removed`, `data-front` (visibleIndex 0),
  `data-expanded` (container expanded), `data-visible` (within limit),
  `data-swiping`, `data-swiped`, `data-swipe-out`,
  `data-swipe-direction`, `data-dismissible="false"` on the actions row.
- Custom props per card: `--kt-toast-index` (visibleIndex; the stable pre-
  removal index while leaving), `--kt-toast-z-index`, `--kt-toast-height`,
  `--kt-toast-offset` (frozen at removal), `--kt-swipe-x`, `--kt-swipe-y`,
  `--kit-toast-duration` (300ms; 0 under `prefers-reduced-motion` via a
  class, §5.10).
- Swipe: pointer events on the card; live deltas as inline vars (transition
  off while `data-swiping`); threshold ≈ 40% of the drag axis; commit →
  fly-off class → removed after the transition; otherwise spring back.

## A11y (brief §5.6)

- `role`/`aria-live` from `ALERT_INTENT_CONFIG.live`: `role="alert"` +
  `assertive` for warning/danger; `role="status"` + `polite` for
  info/success/neutral. `aria-atomic="true"`.
- Close button: labelled ("Close notification"), tabbable **only** while
  `data-visible` (PrimeVue's `isTabbable` parity); `focus-visible` ring per
  variant tokens.
- Focus into the group expands the stack (`focusin`/`focusout` on the
  container — PrimeVue's keyboard parity).
- Over-limit messages: `aria-hidden="true"`, untabbable, `pointer-events:
  none` — but still rendered (they must un-hide and reflow when slots free).
- `progress` renders the kit `Progress` (carries `aria-valuenow`);
  `indeterminate`-style loading uses `Spinner` with `role="status"` copy.
- Contrast: inherited from the Alert token set (solid fills −700 light /
  −400 dark — already WCAG-checked there).

## CSS (`react/src/styles.css`, appended)

Scoped `.kit-toast` block: 7 position classes (inset 2rem; center 50/50),
per-position anchor + `--kt-raise-factor`, the message state selectors
(initial / mounted / stacked-collapsed / expanded / removed / swipe-out /
not-visible), transitions on transform/opacity/height at
`var(--kit-toast-duration, 300ms)`, the `::after` gap spacer for expanded
cards, close-button placement with `:dir(rtl)` flip (PrimeVue parity — the
portal escapes the app's RTL container, so the CSS is logical/RTL-aware per
brief §5.9), and the `@media (prefers-reduced-motion: reduce)` override
(durations → 0s; state machine still completes, no motion). No
`@keyframes` needed — every state change is a transition between the
attribute-driven states.

## Safelist (brief §5.5)

Dynamic classes come from `getAlertVariantTokens` (already covered — the
script generates per-tone Alert patterns; verify), `getToastSizeTokens`
(new static patterns → add to `scripts/generate-safelist.mjs`), glass.ts
helpers (existing). After building: per-tone
`for c in $TRUE_COLORS; do grep -c "$c" dist/index.css; done`.

## Tests (vitest)

- **Store**: id assignment; add/close/clear/closeGroup; limit bookkeeping
  (visibility set = 3 newest); life scheduling via fake timers
  (`life-end` event, no double-fire); pause/resume with correct remaining
  time; sticky never fires; `update` patches fields and re-renders.
- **Viewport**: all 7 positions → correct classes + raise-factor + anchor;
  `gap`/`limit`/`width`/`zIndex` custom props; mode `expanded` →
  `data-expanded` on the host; group filtering (grouped messages invisible to
  ungrouped viewports and vice-versa); `breakpoints` injects the style tag.
- **Card matrix**: 5 intents → intent icon + role/aria-live per
  `ALERT_INTENT_CONFIG` (no hand-typed maps — assertions import the config);
  5 variants × sampled tones → `getAlertVariantTokens` classes present, no
  same-specificity collision (brief §5.1); 5 sizes → size tokens;
  `progress` → `Progress` with value + tone; `loading` → `Spinner`;
  `closable: false` hides the button; `onClick` forwarding; actions render
  kit Buttons and carry `data-dismissible="false"`.
- **Regression tests for every bug found while in there** (brief §6.6),
  each with its root cause in the test name.

## Demo + kit-docs

- **UxDemo** `react/demo/src/pages/UxDemo/demos/ToastDemo.tsx`: position
  matrix (7 buttons, one viewport each), severities, mode toggle
  (stacked/expanded), life/sticky/limit/gap controls, fake download with
  live `toast.update` progress, glass backdrop block behind the hero
  viewport (so glass/liquid-glass prove see-through), "clear all". Options
  derived from the runtime lists via `constants.ts` — never hand-typed.
- **kit-docs** `react/demo/src/kit-docs/components/toast/`:
  - `ToastPage.tsx` + `ToastPlayground.tsx` (live settings: position, mode,
    gap, limit, life, sticky, variant, size, tone, progress; "current
    settings" block per brief §8)
  - `examples/`: `Basic` (one-liner success), `Severities` (5 intents with
    detail), `StackedAndExpanded` (the hero: 3–4 toasts, hover fans the
    stack out; notes the timer pause), `EveryPosition` (7 viewports),
    `ProgressAndLoading` (fake download + spinner toast),
    `StickyAndGroups` (sticky + two grouped viewports), `Surfaces`
    (5 variants over a gradient backdrop), `ActionsAndCustom` (actions row
    + custom icon)
  - registry entry: slug `toast`, name `Toast`, category **Feedback**, icon
    `Notification`.

## Verification (brief §6)

- `cd react && npm run lint && npx vitest run && npm run build`
- `cd react/demo && npx tsc --noEmit -p tsconfig.json && npx vite build`
  (pre-existing demo errors: 2 files — count before/after, never increase)
- Per-tone safelist check on `dist/index.css` (all 21 tones).
- Throwaway demo page over the real backdrop, headless Chrome, **light and
  dark**: the stacked deck, the hovered fan-out (forced via a class), all 7
  positions, glass over a gradient, a progress toast.
- `--dump-dom` probes: `getComputedStyle` transforms on stacked/expanded
  cards (offsets + scale), `getAnimations()` +
  `--force-prefers-reduced-motion` proving transitions run and stop.
- Delete the harness afterwards.

## Definition of done

- React kit: component + theme promotion + barrel exports
  (`ToastProvider`, `ToastViewport`, `useToast`, `useToastStore`,
  `TOAST_POSITIONS`, `TOAST_MODES`, `getToastSizeTokens`, types).
- No hand-written per-colour maps; scales from the theme.
- Variant family: Alert's status family; every omission stated (there are
  none of the 5 variants; `Panel` family deliberately not adopted — reason
  documented above).
- No same-specificity collisions in the new class strings.
- Every dynamic class safelisted, verified per tone in built CSS.
- Tests pass; typecheck/build clean; demo error count unchanged.
- Screenshotted light + dark; `Learnings.md` appended.
- Report states: bugs found (root causes), what is new, **breaking changes**
  (none — additive), and Vue's deliberate gap.

## Out of scope (this pass)

- Vue kit (explicitly React-first — stated in the report).
- `pt` passthrough / `closeButtonProps` / `templates` (kit: tokens, not
  pass-through).
- `unstyled` mode.
- Custom render-prop for the message body — `title`/`detail`/`actions`
  already accept nodes.
