import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { WorkflowTrackerPlayground } from "./WorkflowTrackerPlayground";
import VendorOnboarding from "./examples/VendorOnboarding";
import vendorOnboardingCode from "./examples/VendorOnboarding.tsx?raw";
import ReleasePipeline from "./examples/ReleasePipeline";
import releasePipelineCode from "./examples/ReleasePipeline.tsx?raw";
import DetailsCard from "./examples/DetailsCard";
import detailsCardCode from "./examples/DetailsCard.tsx?raw";
import ComposableParts from "./examples/ComposableParts";
import composablePartsCode from "./examples/ComposableParts.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import CollapsibleRail from "./examples/CollapsibleRail";
import collapsibleRailCode from "./examples/CollapsibleRail.tsx?raw";
import LockedStages from "./examples/LockedStages";
import lockedStagesCode from "./examples/LockedStages.tsx?raw";
import SubStepCap from "./examples/SubStepCap";
import subStepCapCode from "./examples/SubStepCap.tsx?raw";
import { PropsTable } from "../../shared/A11ySections";

export const WorkflowTrackerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Workflow Tracker"
      description="A pipeline tracker driven by one data object: a status timeline rail, a detail panel for the active step with sub-steps, a scrollable details card under it for caller-supplied content, quick-action buttons for gate-type steps, and roll-up cards for progress, flagged and skipped steps. Usable as a whole or panel-by-panel through the standalone parts."
    />
    <WorkflowTrackerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Vendor onboarding"
        description="The bundled sampleWorkflow: a live pipeline with a blocked step, an attention flag and an in-progress step whose sub-steps fill the detail panel. Rows are buttons — the parent owns `data.activeStepId`."
        code={vendorOnboardingCode}
        filename="VendorOnboarding.tsx"
      >
        <VendorOnboarding />
      </ExampleCard>
      <ExampleCard
        title="Release pipeline"
        description="The same data shape in another domain — a CI release pipeline with running sub-steps, a skipped stage, an attention flag and a blocked approval."
        code={releasePipelineCode}
        filename="ReleasePipeline.tsx"
      >
        <ReleasePipeline />
      </ExampleCard>
      <ExampleCard
        title="Step details card"
        description="A step's `details` node renders in its own card below the step card, framed by the tracker and wrapped in a `ScrollArea`. The `approve` gate uses `actions` + `onStepAction` for its Approve/Decline quick actions — quiet `xs` soft buttons in the rail row and the step card header. `fillHeight` (see the playground) stretches the details card to the viewport bottom so the page never scrolls."
        code={detailsCardCode}
        filename="DetailsCard.tsx"
      >
        <DetailsCard />
      </ExampleCard>
      <ExampleCard
        title="Composable parts"
        description="The composite is a layout of three parts the kit also exports on its own: `WorkflowTrackerRail`, `WorkflowTrackerStepDetails` and `WorkflowTrackerDetails`. Each derives from the same `data` object and stays stateless — one parent-owned `activeStepId` keeps them in sync wherever they are drawn."
        code={composablePartsCode}
        filename="ComposableParts.tsx"
      >
        <ComposableParts />
      </ExampleCard>
      <ExampleCard
        title="Collapsible standalone rail"
        description="Use `collapsible` for an animated compact rail, with `defaultCollapsed` for internal state or `collapsed` + `onCollapsedChange` for controlled state. `fillHeight` fills a parent with a defined height and scrolls the timeline internally. Set `style.width` to customize the expanded width. Select a status node in either mode to update the details. `renderStepPopover(step)` supplies custom hover/focus content when collapsed; `stepPopoverProps` customizes its presentation. `renderControls={({ collapsed }) => ...}` adds a separately scrolling footer below the steps, with compact and expanded layouts. Put its heading in `renderControlsHeader` so the title stays fixed above the scrolling content. In a height-constrained rail it starts at 30% of the steps/footer space. Enable `footerResizable` to drag the divider or resize with ArrowUp/ArrowDown, Home and End. Use `defaultFooterHeight` for initial sizing, or `footerHeight` + `onFooterHeightChange` for controlled percentages (10–80). Without fillHeight the sections keep their natural document flow. The compact header retains the progress percentage. Set side='left' or side='right' to round the content-facing corners, mirror the toggle and place step popovers toward the body; corner sets the radius. Compact status tiles highlight only on hover and use smaller, flat status icons."
        code={collapsibleRailCode}
        filename="CollapsibleRail.tsx"
      >
        <CollapsibleRail />
      </ExampleCard>
      <ExampleCard
        title="Capped sub-steps"
        description="`maxVisibleSubSteps` caps the rail's nested box; the rest fold away behind `subStepLoadMode`. `scroll` (default) turns the box into a `ScrollArea` capped at the height of the first page — the kit's shared infinite-scroll watch reveals the next rows as you near the fold, so the rail never grows. `button` reveals one page per click behind a counting `Show N more` / `Show less` tail. `subStepOrder` decides which end the first page keeps: `reverse` (default) opens on the newest tail and reveals the past (scroll up / Show more), `forward` opens on the oldest head and reveals the future. Labels truncate to one line. The step detail panel's table is never capped."
        code={subStepCapCode}
        filename="SubStepCap.tsx"
      >
        <SubStepCap />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Empty steps show the built-in placeholder; `loading` swaps the rail and cards for skeletons."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard title="Lock future stages" description="disableFutureSteps prevents not_started stages from being selected or previewed. step.disabled explicitly locks any stage. Neither responds to hover or keyboard focus, in expanded or collapsed mode."
        code={lockedStagesCode} filename="LockedStages.tsx"><LockedStages /></ExampleCard>
    </section>
    <PropsTable props={[
      { name: "renderControlsHeader", type: "({ collapsed }) => ReactNode", description: "WorkflowTrackerRail: render a fixed footer title or header above the controls scroll area. Header and controls receive the same collapse state; only renderControls content scrolls." },
      { name: "footerResizable", type: "boolean", default: "false", description: "WorkflowTrackerRail: enable a pointer- and keyboard-accessible horizontal separator between the steps and renderControls footer. Requires fillHeight (or cardScrollable in a constrained layout) and footer content." },
      { name: "defaultFooterHeight / footerHeight / onFooterHeightChange", type: "number / number / (percent: number) => void", default: "30 / uncontrolled", description: "Footer share of available steps/footer height, in percent. Bounded to 10–80 so both independently scrolling sections remain usable. Controlled sizing can reset or persist the user's choice. Collapse and loading preserve footer content and size." },
      { name: "footerLabel / footerResizeLabel", type: "string", default: "Workflow footer / Resize workflow footer", description: "WorkflowTrackerRail: accessible names for the footer scroll region and resizing separator." },
      { name: "disableFutureSteps", type: "boolean", default: "false", description: "WorkflowTracker and WorkflowTrackerRail: disable stages with normalized status not_started. Running, completed, skipped, blocked and attention stages remain available unless explicitly disabled." },
      { name: "step.disabled", type: "boolean", default: "false", description: "Disable an individual stage regardless of status. Disables rail selection, hover/focus previews and rail quick actions. The status remains visible; controlled activeStepId is not changed." },
      { name: "maxVisibleSubSteps", type: "number", default: "all", description: "WorkflowTracker and WorkflowTrackerRail: sub-steps the rail's nested box shows before the rest fold away. Unset, or set past the count, every sub-step renders. The step detail panel's table is never capped." },
      { name: "subStepLoadMode", type: '"scroll" | "button"', default: '"scroll"', description: 'How rows past maxVisibleSubSteps are revealed. "scroll" caps the nested box at the height of the first page and scrolls inside a ScrollArea, the shared infinite-scroll watch revealing the next rows near the fold (it degrades to the button without an IntersectionObserver). "button" reveals one page per click behind a Show N more / Show less tail, localized via the showMore/showLess labels — showMore carries a {count} placeholder.' },
      { name: "subStepOrder", type: '"reverse" | "forward"', default: '"reverse"', description: 'Which end of the list the first page keeps. "reverse" is the live-tail reading: the newest sub-steps stay visible, the box opens at the bottom, and both tails reveal the past (scroll up / Show more); rows appended by a live run keep the reader pinned at the bottom. "forward" is the chronological reading — the oldest head first, tails revealing the future.' },
    ]} />
  </div>
);

export default WorkflowTrackerPage;
