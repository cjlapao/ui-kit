import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { CondensedStepperPlayground } from "./CondensedStepperPlayground";
import RunCards from "./examples/RunCards";
import runCardsCode from "./examples/RunCards.tsx?raw";
import WatchRun from "./examples/WatchRun";
import watchRunCode from "./examples/WatchRun.tsx?raw";

export const CondensedStepperPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="CondensedStepper"
      description="The stepper that fits on one line: the current step anchored in the middle, the walked steps compressed left, the queue compressed right — and each flank an accordion on ExpandableButton's spring table. Hover to peek, click to pin, Esc to close; the flanks are exclusive and the centre pill squishes to make room. The card and the panel are the same component — the container decides how much condenses, never the behaviour."
    />
    <CondensedStepperPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Watch the run"
        description="The strip tells the truth at every scale: the quiet motif (three ticks, two dots) only indicates, the summaries count, and the revealed six nearest the anchor walk — complete a step and the newcomer springs in while the oldest drifts out. Hover an item to expand its title on the same spring."
        code={watchRunCode}
        filename="WatchRun.tsx"
      >
        <WatchRun />
      </ExampleCard>
      <ExampleCard
        title="Run cards"
        description="Card size (size='sm'): three runs of the same component — idle-ready, gate-halted (the rose ring is the error status speaking, not a bespoke border), and a longer queue folded into +N."
        code={runCardsCode}
        filename="RunCards.tsx"
      >
        <RunCards />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "steps",
          type: "StepperStep[]",
          description:
            "The same StepperStep the Stepper wears — id, title, optional status. Position, not status, draws the flanks: everything left of the anchor is walked, everything right is queued; statuses only colour what is there.",
        },
        {
          name: "currentIndex / currentStepId",
          type: "number / string",
          description:
            "Where the anchor sits. The id wins when both are given; the index clamps into range; with neither, the first step not yet completed — and when every step is done, the last one, so the strip ends on its final ✓ rather than on nothing.",
        },
        {
          name: "openZone / onOpenChange / expandOn",
          type: '"past" | "future" | null / (zone) => void / "hover" | "click"',
          description:
            "The flanks are exclusive by construction — one value owns the reveal either way. Hover peeks, click pins, Esc closes the pin. Controlled (openZone set), interactions only report the ask. A flank of three or fewer shows everything it has: no button, no tooltip, no reveal — not even a controlled ask forces open nothing to reveal.",
        },
        {
          name: "pastSummary / futureSummary / actionLabel",
          type: "ReactNode",
          default: "auto counts / —",
          description:
            "The true counts (✓ 9 done, +2 pending) unless overridden. actionLabel dresses the centre chip when the anchor needs attention — its rose is the status speaking, never a bespoke border.",
        },
        {
          name: "tone / doneColor / nextColor",
          type: "TrueColor",
          default: '"blue" / "emerald" / "gray"',
          description:
            "tone dresses the centre pill (and the surface borders); doneColor fills the walked ticks, nextColor the queue dots — solid swatches with their own diffusion, the ColorSwatches language. The signals stay semantic: error is rose, completed is emerald, whatever the dress.",
        },
        {
          name: "size / mode / variant",
          type: "ControlSize / 'panel' | 'card' / SurfaceVariant",
          default: '"md" / "panel" / "outlined"',
          description:
            "mode is the condensation: the panel reveals titled items, the card is the chip (one disc per flank, expansion folds the anchor to its index). variant is the shared surface vocabulary the Panel wears — the centre pill and every revealed badge dress from it; the glass pair takes the Pill's own recipe (a control's blur and frosted fill, not a card's).",
        },
        {
          name: "stretch / maxSteps",
          type: "boolean / number",
          default: "panel: true / 6",
          description:
            "The panel is a ruler: five tracks — flank, dash, anchor, dash, flank — and the squeeze is one spring transition on the template: the open side's dash runs to its 15px floor first, the anchor yields next, the far dash last. maxSteps caps what a flank may reveal (the nearest six; +N carries the rest).",
        },
        {
          name: "interactive / onStepSelect",
          type: "boolean / (step, index) => void",
          description:
            "interactive={false} is a readout: no buttons, nothing opens, spans only. Revealed items are buttons only when onStepSelect is wired — otherwise they stay selectable text.",
        },
        {
          name: "onDoneHover / onCurrentHover / onNextHover",
          type: "(boolean) => void",
          description:
            "Pure observation on the two flanks and the anchor — they report what the user is doing and command nothing; they keep firing even on flanks too small to expand.",
        },
        {
          name: "spring / springDuration / animated",
          type: "ExpandableButtonSpring / number / boolean",
          default: '"bouncy" / table / true',
          description:
            "The one shared spring table ExpandableButton reads from, delivered as inline custom properties the stylesheet defaults — reveal, template squeeze and the conveyor's fido all ride it. animated={false} drops the variables and the stylesheet drops the transitions; reduced motion settles at 200ms.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The strip is a <C>group</C> whose label names the anchor and its
          place: <C>step 10 of 12</C>. The centre wears <C>aria-current</C>;
          a flank that can reveal is a real <C>button</C> with{" "}
          <C>aria-expanded</C> and <C>aria-controls</C> — the closed accordion
          is <C>aria-hidden</C> and <C>inert</C>, so a screen reader never
          walks content the eye cannot see. A flank of three or fewer is a
          plain read span: no button promising a reveal with nothing to
          reveal. Revealed items are <C>button</C>s only when{" "}
          <C>onStepSelect</C> is wired; otherwise selectable spans.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          <C>Tab</C> reaches the flank buttons; <C>←</C>/<C>→</C> jump between
          them; <C>Enter</C>/<C>Space</C> pin (hover still peeks,{" "}
          <C>Esc</C> releases the pin). Focusing a badge expands its title the
          same way hovering does — <C>:focus-visible</C> rides the same grid
          track, so the keyboard reads what the mouse reveals. The strip
          delegates <C>Esc</C> and the arrows without trapping keys it does
          not own.
        </p>
      </A11yTopic>
      <A11yTopic title="Motion">
        <p>
          Every fold — accordion, template squeeze, conveyor — rides one
          spring table delivered as inline custom properties.{" "}
          <C>prefers-reduced-motion</C> retunes the curve to a 200ms Material
          settle rather than deleting it (the conveyor skips its ghost
          entirely); <C>animated={"{"}false{"}"}</C> removes the variables and the
          stylesheet removes the transitions. Nothing animates a number:
          widths spring, content arrives complete.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default CondensedStepperPage;
