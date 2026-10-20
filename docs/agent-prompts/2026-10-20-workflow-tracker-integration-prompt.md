# Agent Prompt: Integrate the Workflow Tracker (quick-action gates + composable parts)

> Copy everything below this line into your coding agent, plus the paths of the
> screens in **your app** that show (or should show) workflow/pipeline status.
> The agent must satisfy the Acceptance checklist at the end before reporting done.

---

## Mission

Update this app to use the `WorkflowTracker` family from **`@cjlapao/ui-kit`**
(peer deps: `react` `^18.0.0 || ^19.1.0`, `react-dom` likewise, and
`react-router-dom` `^6 || ^7` for other kit components — the tracker itself
needs no router) for all multi-step workflow/pipeline status UI. Two
capabilities must be adopted, not just one:

1. **The all-in-one `<WorkflowTracker>`**, including its newer features:
   per-step **quick-action buttons** (`actions` + `onStepAction`), the
   scrollable **details card** (`details`), and `fillHeight` for app-shell pages.
2. **The composable parts** — `WorkflowTrackerRail`,
   `WorkflowTrackerStepDetails`, `WorkflowTrackerDetails` — for any place the
   app shows only *one* of those panels (a sidebar rail, a run-view card, a
   details column), instead of hand-rolling its own markup.

Delete any bespoke tracker/timeline UI the app used to render for these
screens; it must go through the kit components.

If you don't know where the workflow screens are, or which steps are
"approval gates" needing buttons, **ask the human before writing code**.

## Install / verify

```bash
npm install @cjlapao/ui-kit   # or bump to the version whose exports include
                              # WorkflowTrackerRail / WorkflowTrackerStepDetails
                              # / WorkflowTrackerDetails
```

If your app resolves the kit through a local link (e.g. `file:..` / symlink),
the bundle it serves may be the kit's prebuilt `dist` — rebuild the kit
(`npm run build` in the kit repo) whenever you change the installed copy, and
never assume the linked package picked up source edits.

Import surface (all from the package root):

```ts
import {
  WorkflowTracker,            // all-in-one: header + rail + step card + details card + roll-ups
  WorkflowTrackerRail,        // progress header + vertical timeline + legend
  WorkflowTrackerStepDetails, // active-step card (title, badge, meta, sub-steps, quick actions)
  WorkflowTrackerDetails,     // scrollable caller-content card
  WorkflowTrackerRollups,     // "Needs attention" / "Skipped steps" roll-up grid
  sampleWorkflow,             // fixture — great for a storybook/page skeleton, not for prod data
} from "@cjlapao/ui-kit";

import type {
  WorkflowData, WorkflowStep, WorkflowSubStep, WorkflowAction,
  WorkflowStatus, WorkflowTrackerProps, WorkflowTrackerRailProps,
  WorkflowTrackerStepDetailsProps, WorkflowTrackerDetailsProps,
  WorkflowTrackerRollupsProps, WorkflowTrackerLabels,
} from "@cjlapao/ui-kit";
```

## Core concepts (violating these is the #1 integration mistake)

- **One data object.** Everything — progress %, tallies, legend, the two
  roll-up cards, which sub-steps nest, which step is active — is **derived**
  from `data: WorkflowData`. You never pass counts, percentages or "is
  active" flags. The tracker never mutates it.
- **Stateless.** The tracker owns no selection. The **parent owns
  `data.activeStepId`** and re-renders with a new one when the user clicks a
  step (`onStepSelect`). For the parts, the *same* parent state must be
  spread into every part's `data`, or they desync.
- **Read-only unless you pass callbacks.** No callback → no interactive
  affordance is rendered anywhere: no row buttons, no action buttons. This is
  a deliberate contract; never fake interactivity with `className` hacks.
  - `onStepSelect(stepId)` → rail rows become buttons.
  - `onSubStepSelect(stepId, subStepId)` → sub-step rows become buttons.
  - `onStepAction(stepId, actionId)` → steps' `actions` render as buttons.
    **Without it, `actions` data renders nothing.**
- **Theming is CSS-only.** The kit styles dark mode with Tailwind `dark:`
  utilities driven by a `.dark` class on `<html>` (or any ancestor). You never
  tell the tracker which theme is active, and you never hardcode colors in
  `details` content — pass nodes that themselves use the kit's components or
  `dark:`-paired utilities.
- **Unknown status values degrade safely**: any unrecognized `status` becomes
  `not_started`; don't pre-sanitize.

## Data model (verbatim from the kit types)

```ts
type WorkflowStatus =
  | "done" | "in_progress" | "running" | "skipped"
  | "blocked" | "attention" | "not_started";

interface WorkflowSubStep {
  id: string;
  label: React.ReactNode;
  status: WorkflowStatus;
  note?: React.ReactNode;      // secondary line, e.g. "2 of 3 files received"
  badge?: React.ReactNode;     // pill text (tint follows status unless badgeTone)
  badgeTone?: TrueColor;
  duration?: React.ReactNode;  // right-aligned; em dash when omitted
}

interface WorkflowAction {     // the quick-action buttons — the new feature
  id: string;
  label: React.ReactNode;
  tone?: TrueColor;            // button tint; default: the tracker's accentColor
  variant?: ButtonVariant;     // default "soft"; strengthen per-action if needed
  leadingIcon?: string | React.ReactElement; // kit icon name or your element
  disabled?: boolean;
}

interface WorkflowStep {
  id: string;
  label: React.ReactNode;
  status: WorkflowStatus;
  badge?: React.ReactNode;
  badgeTone?: TrueColor;
  meta?: React.ReactNode;      // rail secondary line, e.g. "12m · 3 of 3"
  elapsed?: React.ReactNode;   // detail card, top-right, while active
  description?: React.ReactNode;
  owner?: React.ReactNode;
  startedAt?: React.ReactNode;
  sla?: React.ReactNode;
  subSteps?: WorkflowSubStep[];
  details?: React.ReactNode;   // free-form body for the details card (see below)
  actions?: WorkflowAction[];  // gate-type steps: approve/decline/nudge…
}

interface WorkflowData {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  icon?: React.ReactNode;      // any node; clipped to iconCorner, so <img> fills it
  live?: boolean;              // shows the "LIVE · read-only view" chip
  activeStepId?: string;       // else falls back: first in_progress step, else first step
  steps: WorkflowStep[];
}
```

## Part 1 — the all-in-one, with gates and details

Use `<WorkflowTracker>` when the screen wants the whole composed view.
A gate step (waiting on a human decision) is `status: "attention"` +
`actions`, and the page becomes interactive by supplying `onStepAction`:

```tsx
import { useState } from "react";
import { WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

function RunView({ run, approve, decline }: Props) {
  // `run` comes from your API shaped into WorkflowData.
  const data: WorkflowData = {
    ...run,
    steps: run.steps.map((s) =>
      s.id === "approve"
        ? {
            ...s,
            status: "attention",
            badge: "Waiting",
            actions: [
              { id: "approve", label: "Approve", tone: "emerald" },
              { id: "decline", label: "Decline", tone: "rose", variant: "soft" },
            ],
          }
        : s,
    ),
  };

  return (
    <WorkflowTracker
      data={data}
      fillHeight                      // page never scrolls; details card scrolls internally
      fillHeightOffset={64}           // your sticky app header's height (number = px)
      onStepSelect={(stepId) => setRun((r) => ({ ...r, activeStepId: stepId }))}
      onStepAction={(stepId, actionId) => {
        if (stepId === "approve" && actionId === "approve") approve();
        if (stepId === "approve" && actionId === "decline") decline();
      }}
    />
  );
}
```

Notes that matter in review:

- **`actions` render in two places** automatically: under the step's meta line
  in the **rail**, and in the **step card header**. That duplication is the
  design (act from wherever the user is looking) — don't "fix" it by hiding one.
- Buttons are `xs` `soft`-variant kit `Button`s; `tone` accepts any kit
  `TrueColor`. Reserve stronger variants (e.g. `"solid"`) for the one action
  that must dominate.
- Disable an action while its request is in flight (`disabled: true` on the
  action, re-derived from your pending state) — don't overlay spinners yourself;
  `loading` swaps the whole tracker to skeletons for initial fetch.
- **`details`** is caller-owned free-form content (audit log, files, findings)
  shown in its own card below the step card **only while its step is active**,
  and only when non-empty; `null`/`undefined`/`""` omit the card entirely.
  The kit frames it (card surface + `ScrollArea` + `role="region"` named by
  `labels.details`); your node brings its own headings. Keep it to kit
  primitives (`Pill`, `Panel`, `Button`, `Loader`…) for design-language parity.
- `fillHeight` claims the viewport from the tracker's top on wide containers;
  `fillHeightOffset` subtracts chrome above it. Below the `@4xl` container
  breakpoint it steps back and the page scrolls normally — leave that alone.
- Composite-only props you may need: `railWidth`, `stickyRail`, `maxWidth`,
  `showHeader`, `showLegend`, `emptyState`, `loadingRows`, `labels`
  (copy overrides — use for i18n; the kit ships no strings).

## Part 2 — the parts, drawn in different places

The composite is a layout of four exported parts; using a part standalone
renders **pixel-identically** to the same panel inside the composite. Use them
when your design splits the view — rail in a sidebar, step card in a run view,
details in a right-hand column, roll-ups wherever the page wants them.

```tsx
import { useState } from "react";
import {
  WorkflowTrackerRail,
  WorkflowTrackerStepDetails,
  WorkflowTrackerDetails,
  WorkflowTrackerRollups,
} from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

function SplitRunView({ run }: { run: Omit<WorkflowData, "activeStepId"> }) {
  const [activeStepId, setActiveStepId] = useState<string | undefined>(
    run.steps.find((s) => s.status === "in_progress")?.id ?? run.steps[0]?.id,
  );
  const data: WorkflowData = { ...run, activeStepId };

  return (
    <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-start">
      {/* Rail as a compact sidebar card */}
      <div className="w-full xl:w-80 xl:shrink-0">
        <WorkflowTrackerRail
          data={data}
          showLegend={false}
          onStepSelect={setActiveStepId}
          onStepAction={runItemAction}
        />
      </div>

      {/* Step card + details body + roll-ups, wherever they fit */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <WorkflowTrackerStepDetails data={data} onStepAction={runItemAction} />
        <WorkflowTrackerDetails data={data} />
        <WorkflowTrackerRollups data={data} />
      </div>
    </div>
  );
}
```

Part contract — follow exactly:

- Every part takes the **whole `data` object** (plus styling props relevant to
  it and `labels`) and derives its slice itself: rail = progress/tallies/
  active-with-fallback, step card = active step + sub-steps, details = active
  step's `details` (mounts on the same non-empty rule, `null` while `loading`),
  roll-ups = the attention + skipped lists (its own `@xl:grid-cols-2` grid of
  `Panel` cards; `null` while `loading` or when no step qualifies — never an
  empty shell).
- **All parts are stateless and must be fed the same `data`** — including the
  same `data.activeStepId` from one parent state. Never give a part its own
  local selection state.
- Callbacks are per-slice: the rail takes `onStepSelect`, `onSubStepSelect`
  (nested rows) and `onStepAction`; the step card takes `onSubStepSelect` and
  `onStepAction`; the details and roll-ups parts take none (roll-up rows are
  static summaries — action affordances live on the steps themselves).
- **Styling props** shared by all three: `accentColor`, `attentionColor`,
  `blockedColor`, `mutedColor`, `variant` (Panel surface: `outlined`, `tonal`,
  `subtle`, `glass`, `liquid-glass`…), `cardTone`, `corner`, `glassOpacity`,
  `vibrancy`, `specularMode`, `padding`, `translucentSurfaces`, `className`,
  `style`. Defaults match the composite (`blue`/`rose`/`amber`/`neutral`,
  `outlined`, `cardTone: "neutral"`), so a part on its own looks like the
  composite without passing anything.
- **Advanced only** (documented escape hatches — don't use for everyday
  styling): `cardClassName` (composite grid mechanics like sticky/stretch) and
  `cardScrollable` on the rail (used for fill-mode scrolling).
- Each part renders **its own `Panel` card** — never wrap one in your own
  card/`Panel`; wrap it in a plain `div` for width (as the `xl:w-80` above).
- Don't rebuild what the parts already do: no custom progress bars, step
  lists, sub-step tables, badges or action rows. If a part is *almost* right,
  you're holding it wrong — the same `data` drives it.

## Design-language and theme rules

- Tones are the kit's `TrueColor` union — set `accentColor` etc.; never inject
  custom hex colors into tracker chrome. Inside `details` content, prefer kit
  components; if raw markup is unavoidable, use neutral + `dark:`-paired
  utilities so the `.dark` class flip restyles everything with zero JS.
- Copy is overridable through `labels` (including `labels.details` — the
  accessible name of the details region — and `labels.quickActions`, the
  action group's accessible name). Route real i18n through them.
- Mixed content is fine: `React.ReactNode` is accepted for labels, badges,
  meta, owner… — but keep interactive elements out of `details` other than kit
  `Button`s, and never nest a button inside a step row (the kit's actions are
  siblings of the row button, by design).

## Acceptance checklist (report against this)

1. `rg` finds **zero** hand-rolled step/progress/timeline markup for the
   migrated screens; only kit imports remain.
2. Composite screens: gate steps show quick-action buttons in **both** the
   rail and the step card header, and clicking reports the right
   `(stepId, actionId)` pair (wire to real handlers with pending→`disabled`).
3. **Read-only rule**: removing `onStepAction` from the tree removes *all*
   action buttons; removing `onStepSelect`/`onSubStepSelect` removes row
   buttons. (Verify in a test or by toggling props.)
4. The details card appears only for the active step, hides for empty
   `details`, and the page does not double-scroll under `fillHeight`
   (details card and rail scroll inside their cards; `fillHeightOffset`
   matches the app header height).
5. Split screens use the **parts with one parent-owned
   `activeStepId`**; clicking a rail row updates step card and details body;
   no part is wrapped in a custom `Panel`; no local per-part selection state.
6. Light/dark: toggling the `.dark` class restyles both components fully with
   no flicker or hardcoded color left behind.
7. `data` arrives normalized from your API layer into `WorkflowData` in **one
   place** (adapter/mapper), not scattered across views; `activeStepId`
   fallback (first `in_progress`, else first step) is respected — don't
   re-implement it.
8. Typecheck and the app's tests pass; add tests mirroring 2–5 for the
   migrated screens (kit suite covers the components; yours covers wiring).

## Anti-patterns (reject in self-review)

- Passing `progress`, counts or `isActive` per step — derive from `steps`.
- Two sources of truth for the active step (parent state + part-local state).
- Rendering your own approve/decline buttons beside the tracker when the
  step's `actions` can carry them — or rendering `actions` data and never
  passing `onStepAction` (dead data: nothing shows).
- Wrapping parts in `Panel`/bordered divs, or restocking their card with
  `className` overrides of padding/rounding — use `cardTone`/`corner`/`padding`
  props instead.
- Hardcoded `bg-white` / `text-gray-…` inside `details` content (breaks dark).
- Assuming `sampleWorkflow` renders prod data — it's a fixture.

## Reference material (kit repo — read if available)

- `react/demo/src/kit-docs/components/workflow-tracker/examples/ComposableParts.tsx`
  — the split-view story (rail sidebar + stacked cards, one `activeStepId`).
- `.../examples/DetailsCard.tsx` — the approval-gate story (`attention` +
  Approve/Decline actions + details body).
- Specs: `docs/superpowers/specs/2026-10-20-workflow-tracker-details-panel-design.md`,
  `…-quick-actions-design.md`, `…-composable-parts-design.md`.
- Behavior is pinned by the kit suites (`WorkflowTracker.test.tsx` 49 tests,
  `WorkflowTrackerParts.test.tsx` 16 tests) — if your integration seems to
  fight the component, the component is right; re-read this brief.
