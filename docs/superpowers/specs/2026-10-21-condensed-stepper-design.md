# CondensedStepper — design

Date: 2026-10-21
Status: approved by user (ASCII understanding confirmed; five API questions
answered, all recommended picks; approach A approved)
References: `Stepper` (step vocabulary), `ExpandableButton` (spring physics,
React-only), `ColorSwatches` (condensation + `expandOn` idiom)

## Why

The full `Stepper` is a panel with content areas, progress bars and per-step
copy. The workflows that need a progress readout most — run cards, side
panels, dashboards — have a single line of space and do not need the detail.
The designer mocks (two widths of one component) show the shape: **the
current step is the anchor in the middle, what's done compresses to the left,
what's to come compresses to the right**, and each flank is an accordion that
springs open on demand. The wide panel and the card strip are the *same
component* — the container width decides how much condenses, never the
behaviour.

## Decisions taken in conversation

- Name: **CondensedStepper** (sits next to Stepper, says what it is).
- Vocabulary: **reuse `StepperStep` + `StepStatus`** from Stepper — consumers
  feed the same `steps` array to both components.
- Expansion is **exclusive**: one zone open at a time, structurally (one
  `open` value, not two booleans).
- Trigger: **hover reveals, click pins** (ColorSwatches' `expandOn` idiom;
  focus is the keyboard's hover).
- Quiet summaries are **auto-generated and overridable**.
- **React only**: the springs it rides (`springTokens`) live only in the
  React kit; a Vue sibling waits until the physics crosses over.
- Approach **A**: measured-width flex accordion on the spring; the squish is
  declarative (flexbox + `min-width: 0`), not animated. FLIP and
  `grid-template-columns` animation were considered and rejected (complexity
  / browser support).

## Public API

```tsx
export interface CondensedStepperProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  steps: StepperStep[];              // Stepper's type, unchanged
  currentIndex?: number;             // default: first non-completed step
  currentStepId?: string;            // wins over the index
  /** What opens a flank: hover (click always pins) or click only. @default "hover" */
  expandOn?: "hover" | "click";
  /** Quiet-state summaries; auto by default: "✓ {n} done" / "+{n} pending". */
  pastSummary?: ReactNode;           // e.g. "8 passed · 1m"
  futureSummary?: ReactNode;
  /** The chip on the active pill — "ACTION REQUIRED" in the mock. */
  actionLabel?: ReactNode;
  /** Circle/pill density, shared control scale. @default "md" */
  size?: ControlSize;
  /** Revealed items per flank before `+N` carries the rest. @default 5 */
  maxVisible?: number;
  /** @default true */ interactive?: boolean;
  onStepSelect?: (step: StepperStep, index: number) => void;
  /** Controlled reveal — when set, owns `open`; hover/click stop mutating
   *  it and report through `onOpenChange` instead. Lets a host (or the demo
   *  playground's Expand Left/Right presets) force a flank open, e.g. the
   *  queue auto-revealing while a gate is blocked. */
  openZone?: "past" | "future" | null;
  onOpenChange?: (open: "past" | "future" | null) => void;
  /** @default true */ animated?: boolean;
  spring?: ExpandableButtonSpring;   // @default "bouncy" — the same table
  springDuration?: number;
}
```

No `onChange` and no internal pointer: the strip *reports* progress, it does
not own it. `onStepSelect` is the only path in. The only change to
`ExpandableButton` is additive: export `springTokens` as
`EXPANDABLE_BUTTON_SPRING_TOKENS`, so the kit keeps **one** physics table and
CondensedStepper imports the curves rather than copying them.

## Zones, quiet and revealed

Quiet state (left to right):

- **Past zone** — overlapping ✓-discs (ColorSwatches' trick: condensed dots
  hold their place behind the chip), capped at 3, plus the summary chip
  (`✓ 9 done`). The whole cluster is one reveal button.
- **Centre pill** — `(10) Approve Gate` + optional `actionLabel` chip. Ring
  and dot speak Stepper's status tones: active = sky with a running dot,
  error = **rose ring** (the halted gate), completed (all done) = emerald ✓,
  no active = neutral. Label truncates (`min-w-0`, ellipsis).
- **Future zone** — the next two as dim discs + `+N pending` chip.
- Decorative `– –` dashes join the zones (aria-hidden).

Revealed state:

- **Past** — the summary chip stays; numbered discs ①… enter *after* it
  (completed = number on emerald, error = rose ✕), each a button
  (`onStepSelect`, name "Step {n}: {title}").
- **Future** — numbered label pills `⑪ Sign Key` (each label caps at
  `max-w`, truncates), `+N` chip stays for whatever `maxVisible` left out.
- Reveal is an accordion: the flank's width transitions `0 ↔ measured` on
  the spring (measured once from the hidden intrinsic content — one frame,
  invisible), items stagger in (scale 0.8→1 + fade, 30 ms apart) riding the
  same easing.
- **Squish**: the centre pill is `flex 1 1 auto; min-width: 0` — as a flank
  grows, the label ellipsizes for free; the action chip fades to 40 % while
  any zone is open. The other flank stays quiet; opening it closes this one.
- `interactive={false}`: flanks render as plain containers (no reveal
  buttons, no hover open — the strip is a readout), revealed items render as
  spans; `onStepSelect` and `expandOn` become inert.

Degenerate cases: zero completed → no past zone or dash; zero pending → no
future zone; all completed → centre is the final step with emerald ✓; ≤1
step → the pill alone, no zones.

## Condensation — pure plan

`condenseStepperPlan(steps, currentIndex, options) → plan` is a pure,
DOM-free module (the `measure.ts` pattern): given counts, `maxVisible`,
size metrics and the measured widths, it decides per flank — discs-while-
quiet, how many items the reveal can show, `+N` remainder — plus the
degenerate rulings above. The component measures once (hidden pass +
ResizeObserver, as ColorSwatches measures its fit) and feeds the plan. Unit
tests cover the plan without a DOM.

## State and physics

`open: "past" | "future" | null` + `pinned: boolean`. Hover opens while
unpinned (pointer-leave closes); click pins, click again unpins and closes;
Esc closes; focusing a flank opens it (hover's keyboard equal). One `open`
value *is* the exclusivity. When `openZone` is supplied it owns `open`
(uncontrolled otherwise) and interactions only report through
`onOpenChange` — this is also how the demo's Expand Left/Right presets work. Spring delivery matches ExpandableButton: inline
`--cs-spring-easing` / `--cs-spring-duration` custom properties resolved from
the shared token table; the transition list lives in `styles.css` (no
`transition-colors` on the element classes — the CSS owns the list);
`animated={false}` drops the transition classes rather than pausing them, and
`prefers-reduced-motion` keeps the width change but strips the overshoot.

## Accessibility

- Strip: `role="group"`, `aria-label="Step progress — {active title}, step
  {i} of {n}"`; centre pill `aria-current="step"`.
- Flanks: `<button aria-expanded aria-controls>` with a name that says what
  opens ("Reveal 9 completed steps"); the mock's tooltip
  ("Hover to accordion reveal 9 completed steps") uses the kit tooltip idiom.
- Revealed items: real buttons, accessible name "Step {n}: {title}",
  click/Enter/Space fire `onStepSelect`; ←/→ move focus between the flanks.
- Dashes, discs' decorative fills: `aria-hidden`.

## Files

- `react/src/components/CondensedStepper.tsx` — component.
- `react/src/components/condenseStepperPlan.ts` — pure plan (tested alone).
- `react/src/components/CondensedStepper.test.tsx` — RTL suite.
- `react/src/styles.css` — `.cs-*` transition list + reduced-motion block.
- `react/src/components/ExpandableButton.tsx` — export the token table
  (one additive line).
- `react/src/index.ts` — value + type exports (Stepper's section).
- `react/demo/src/kit-docs/registry.ts` +
  `react/demo/src/kit-docs/components/condensed-stepper/` — docs page.

## Demo

The kit-docs page mirrors the designer's playground: **Default Quiet /
Expand Left (Done) / Expand Right (Pending)** preset buttons over the 12-step
gate scenario, a **container-width slider** proving card size and panel size
behave identically, and a row of three mini strips inside cards — one
gate-halted with the rose ring, per the mocks.

## Tests

Plan (DOM-free): counts, caps, `+N`, every degenerate ruling. RTL: quiet
render; `aria-expanded` toggles; exclusivity (open past ⇒ future closed);
hover vs pin (leave closes only when unpinned); **controlled `openZone`
renders the reveal regardless of pointer state**; auto summaries
(`✓ 9 done`, `+2 pending`) and overrides; `onStepSelect` from a revealed
disc; spring custom properties present, and dropped when `animated={false}`;
zero-width container falls back to dots + `+N` without crashing.

## Non-goals

- Orientation (vertical), progress bars, per-step content areas — that is
  `Stepper`; this component is horizontal and strip-only.
- Owning the current step (no `onChange`/pointer state).
- Touch gestures beyond click — hover-only refinements stay optional via
  `expandOn: "click"`.
- Vue port until `springTokens` crosses to a shared module.

## Addendum — demo round (2026-10-21, post-implementation)

Four corrections from the first demo pass, each committed with code:

- **The quiet state leaked the whole reveal.** The `0fr→1fr` clip shared an
  element with `width: max-content` — and an element that declares its own
  width refuses to shrink to the zero track. The clip (`.cs-flank-clip`) and
  the content row (`.cs-flank-row`) are now separate elements, exactly as in
  ExpandableButton; a structure test pins it.
- **`variant: "panel" | "card"`.** The spec's promise that "the card and the
  panel are the same component" was wrong about *expansion meaning*, not just
  width. Panel keeps the 3+2 quiet discs and the accordion reveal; the card's
  mock shows one solid disc per flank quiet, and expansion there reveals only
  the count — while the anchor compresses to `(n)` alone (its label and chip
  on a third `0fr→1fr` track; one trick, three uses, one shared curve).
- **Quiet discs are ColorSwatches**: solid `TRUE_COLOR_DOT_CLASSES` fills,
  stacked on `-ml`, separated by a lighter wash of the background (the dark
  border read as black), each diffusing its own colour (per-tone inline
  `box-shadow`, `DISC_DIFFUSION`). `doneColor` / `nextColor` take the flanks
  individually — `emerald` left, `gray` right by default.
- **Zone hover as observation**: `onDoneHover` / `onCurrentHover` /
  `onNextHover`, `(hovered: boolean) => void`, fire on pointer enter/leave
  whether or not expansion is enabled and even while `openZone` is
  controlled — the strip always knows who is being looked at.

### Round two (same day)

- **`stretch`** (default: panel `true`, card `false` — the panel's design
  is a ruler across its container; a card keeps its compact dashes):
  the strip becomes a five-track grid — flank, dash, anchor, dash, flank
  — and the squeeze is choreography, not mush, because the whole sequence
  is ONE spring transition on `grid-template-columns`: opening the done
  side drives its dash `1fr → 0fr` against a 15 px floor (the push,
  stage one); the anchor's `minmax(0, auto)` track yields next — label
  ellipsizes, chip fades, until the anchor is just its index (stage
  two); the far dash, still `1fr`, gives way last (stage three). The
  overshoot curve is clamped by the track floors, so the bounce settles
  on 15 px instead of breathing through the layout. Hovering the queue
  side mirrors it.
- **`maxSteps`** (renamed from the interim `maxVisible`, default **6**):
  how many steps a flank may reveal when expanded on the panel; the
  remainder rides `+N`.
- **Rename**: the condensation `variant` is now **`mode`**
  (`"panel" | "card"` — panel is the full strip with the accordion
  reveal, card the condensed chip), freeing **`variant?:
  SurfaceVariant`** — the kit's shared surface vocabulary, the same one
  Panel wears — to dress the centre pill and every revealed item (past
  discs, future pills). The quiet discs keep their solid tone fills:
  the variant speaks to dressed surfaces, not to signal dots. The
  `outlined` default is Panel's own outlined base with the tone-soft
  `pendingBorder` passed through, so the default look is the one the
  mocks established. Every other variant is the helper's own tone
  palette, untouched — `tonal` is the kit-wide tone tint
  (`bg-{tone}-100/80` light, `bg-{tone}-500/15` dark), the exact fill a
  Pill or Badge wears at the same variant. A demo round caught the one
  way to break this standard: a blanket `bgClass` override silences the
  tint and renders tonal as a white slab. Overrides belong to a single
  variant, never to the call. And the standard is per **family**:
  `glass` and `liquid-glass` take the *Pill's* glass recipe —
  `backdrop-blur-sm/md` (proportionate to a pill; Panel's xl/2xl are
  for cards), `getGlassFillClass(tone, "frosted")` (the 65% fill tuned
  to carry a control's label), vibrancy and the neutral white rim —
  because the strip dresses pills, not panels.
- The anchor pill wears its tone's diffusion (equal perceived height
  with the glowing discs), and items enter static — centred from the
  first frame, no scale/fade audition (the width spring is the motion).

### Round three (same day) — the motif indicates, the reveal walks

An earlier reading of "make it realistic" made the quiet discs mirror
the true count — seven ticks for nine done. Rejected: the quiet flank
is a MOTIF, not an inventory. Corrected:

- **The quiet motif is fixed: three ticks left, two dots right**, solid,
  whatever the numbers — three ✓s say "work is done here", two dots say
  "there is a queue". The true counts live in the summaries
  (`✓ 9 done`, `+2 pending`) and in the reveal. With three or fewer
  steps on a flank, the motif simply *is* the truth — one done is one
  tick — and the reveal (button, tooltip, accordion) is withheld: with
  nothing left to reveal, promising one is theatre. A `controlled`
  `openZone` cannot force such a flank open; the demoted zone is a read
  span and the pure-observation hover callbacks keep firing.
- **The reveal window is the six nearest the anchor**: the past shows
  the most recently walked steps (nine done → 4…9, the +N carries the
  rest), the queue shows the next-up six. That window is the one that
  walks.
- **The conveyor — the fido — lives in the reveal.** When the run moves
  (step 10 completes → the window slides 4…9 → 5…10), the six do a
  fido: the newcomer springs in from the centre side on the shared
  spring, the oldest becomes a ghost — out of flow the instant it is
  born, drifting out left and fading at the row's edge — so the live
  six never lurch. Both flanks drift LEFT: the past walks away from the
  anchor, the queue is consumed by it. `animated={false}` and reduced
  motion skip the animation and the ghost entirely.
- The demo gained **◀ ▶ run stepper** buttons: pin a flank and advance
  the run to watch the six walk.
