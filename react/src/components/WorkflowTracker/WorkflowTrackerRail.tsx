import React, { useId, useMemo, useState } from "react";
import classNames from "classnames";

import Panel from "../Panel";
import { CollapseToggleButton } from "../CollapseToggleButton";
import { COLLAPSED_RAIL_WIDTH, panelSlideTransition } from "../../theme/Theme";
import type { PopoverProps } from "../Popover";
import WorkflowTimeline from "./WorkflowTimeline";
import {
  buildCardProps,
  resolveLabels,
  useWorkflowChrome,
  type WorkflowTrackerStyleProps,
} from "./chrome";
import { computeProgress, computeTallies, resolveActiveStep } from "./derive";
import { sampleWorkflow } from "./sampleWorkflow";
import type {
  WorkflowData,
  WorkflowStep,
  WorkflowTrackerLabels,
} from "./types";

export interface WorkflowTrackerRailControlsContext {
  /** Effective rail state, including internally managed collapse state. */
  collapsed: boolean;
}

export interface WorkflowTrackerRailProps extends WorkflowTrackerStyleProps {
  /** Disable not_started stage selection and hover previews. @default false */
  disableFutureSteps?: boolean;
  /** Docked edge. With `collapsible` (and `flush`), only the corners facing
   * the content round. Also mirrors the toggle and step popovers. */
  side?: "left" | "right";
  /** Content below the steps, inside the rail's scroll area. Render a component
   * here to preserve its local state as `collapsed` changes. The consumer owns
   * its expanded/compact layout and accessible labels. Also available while loading. */
  renderControls?: (
    context: WorkflowTrackerRailControlsContext,
  ) => React.ReactNode;
  /** Enables the animated collapse toggle. Expanded width defaults to 360px;
   * override it with `style.width`. @default false */
  collapsible?: boolean;
  /** Controlled collapse state; only applies when `collapsible` is true. */
  collapsed?: boolean;
  /** Initial uncontrolled collapse state. @default false */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Fills a parent with a defined height and scrolls the timeline internally. */
  fillHeight?: boolean;
  /**
   * A `collapsible` rail is docked to `side`: square the corners on that edge,
   * expanded and collapsed, so only the corners facing the content round —
   * the same shape as an overlay `SidePanel`. Turn off when the rail is a
   * free-standing card (for example in `PageBodyLayout`'s gutter, beside
   * docked SidePanels that round every corner). @default true
   */
  flush?: boolean;
  /** Accessible toggle copy. @default "Expand workflow rail" */
  expandLabel?: string;
  /** Accessible toggle copy. @default "Collapse workflow rail" */
  collapseLabel?: string;
  /** Custom hover/focus popup content for collapsed steps only. Return null to omit. */
  renderStepPopover?: (step: WorkflowStep) => React.ReactNode;
  /** Popup presentation overrides. Defaults to the rail's surface and right placement. */
  stepPopoverProps?: Pick<
    PopoverProps,
    | "placement"
    | "variant"
    | "tone"
    | "corner"
    | "padding"
    | "maxWidth"
    | "arrow"
    | "className"
  >;
  /** The whole view. Defaults to the bundled `sampleWorkflow` fixture. */
  data?: WorkflowData;
  /** Swaps the rail for its skeleton placeholder. */
  loading?: boolean;
  /** Rows in the rail skeleton. @default 6 */
  loadingRows?: number;
  /** @default true */
  showLegend?: boolean;
  /** Replaces the built-in placeholder shown when `steps` is empty. */
  emptyState?: React.ReactNode;
  /** Partial copy overrides. */
  labels?: Partial<WorkflowTrackerLabels>;
  /**
   * Advanced: classes the composite forwards for its grid mechanics (sticky
   * rail, fill-mode stretch). Prefer `className` for everyday styling.
   */
  cardClassName?: string;
  /**
   * Advanced: scroll the rail body inside its card — the composite turns
   * this on in `fillHeight` mode so a long rail never pushes the page.
   */
  cardScrollable?: boolean;
  /** When provided, timeline rows become buttons. */
  onStepSelect?: (stepId: string) => void;
  /** When provided, the active step's nested sub-step rows become buttons. */
  onSubStepSelect?: (stepId: string, subStepId: string) => void;
  /** When provided, steps' `actions` render as quick-action buttons. */
  onStepAction?: (stepId: string, actionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The tracker's "main" panel — progress header, vertical timeline with the
 * active step's nested sub-steps, and the legend — as a standalone
 * consumable. It derives progress, tallies and the active step (with the
 * same fallback rule as the composite) from `data`. The parent owns
 * `data.activeStepId`; collapse state can be internal or controlled.
 */
export const WorkflowTrackerRail: React.FC<WorkflowTrackerRailProps> = ({
  side = "left",
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  fillHeight = false,
  flush = true,
  expandLabel = "Expand workflow rail",
  collapseLabel = "Collapse workflow rail",
  renderStepPopover,
  renderControls,
  stepPopoverProps,
  data = sampleWorkflow,
  loading = false,
  loadingRows = 6,
  showLegend = true,
  emptyState,
  labels: labelOverrides,
  cardClassName,
  cardScrollable,
  onStepSelect,
  disableFutureSteps = false,
  onSubStepSelect,
  onStepAction,
  className,
  style,
  ...styleProps
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsible && (collapsed ?? internalCollapsed);
  const timelineId = useId();
  const scrollBody = fillHeight || (cardScrollable ?? false);
  const steps = data?.steps ?? [];
  const { palette, surfaces, customStatuses } = useWorkflowChrome(styleProps);
  const labels = useMemo(() => resolveLabels(labelOverrides), [labelOverrides]);
  const cardProps = buildCardProps(styleProps);

  const active = useMemo(
    () => resolveActiveStep(steps, data?.activeStepId),
    [steps, data?.activeStepId],
  );
  const progress = useMemo(() => computeProgress(steps), [steps]);
  const tallies = useMemo(() => computeTallies(steps, customStatuses), [steps, customStatuses]);

  return (
    <Panel
      {...cardProps}
      padding={isCollapsed ? "none" : cardProps.padding}
      scrollable={false}
      flexBody={scrollBody}
      className={classNames(
        collapsible && "max-w-full shrink-0",
        fillHeight && "h-full min-h-0 self-stretch",
        className,
        cardClassName,
      )}
      style={
        collapsible
          ? {
              // SidePanel's curve, not `duration-200 ease-in-out` (which read
              // as a snap). Padding rides it too: collapsing drops it to none,
              // and snapping it mid-sweep was a visible jump.
              transition: panelSlideTransition("width", "padding"),
              ...style,
              width: isCollapsed ? COLLAPSED_RAIL_WIDTH : (style?.width ?? 360),
              ...(flush ? side === "left"
                ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                : { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
                : {}),
            }
          : style
      }
      aria-busy={loading || undefined}
      data-collapsed={collapsible ? isCollapsed : undefined}
    >
      {collapsible && (
        <div
          className={classNames(
            "absolute z-20 flex",
            isCollapsed ? "inset-x-0 top-2 justify-center" : side === "left" ? "right-4 top-4" : "left-4 top-4",
          )}
        >
          {/* The kit's one collapse toggle — the same button and chevron as
              SidePanel's. The rail folds toward its left edge. */}
          <CollapseToggleButton
            collapsed={isCollapsed}
            edge={side}
            srLabel={isCollapsed ? expandLabel : collapseLabel}
            tooltip={isCollapsed ? expandLabel : collapseLabel}
            tooltipPosition={side === "left" ? "right" : "left"}
            aria-controls={timelineId}
            onClick={() => {
              const next = !isCollapsed;
              if (collapsed === undefined) setInternalCollapsed(next);
              onCollapsedChange?.(next);
            }}
          />
        </div>
      )}
      {collapsible && (isCollapsed || loading || steps.length === 0) && (
        <div className="h-10 shrink-0" />
      )}
      <div
        id={timelineId}
        className={scrollBody ? "flex min-h-0 flex-1 flex-col" : undefined}
      >
        <WorkflowTimeline
          controls={renderControls?.({ collapsed: isCollapsed })}
          collapsed={isCollapsed}
          side={side}
          hasCollapseToggle={collapsible}
          renderStepPopover={renderStepPopover}
          stepPopoverProps={{
            placement: side === "left" ? "right" : "left",
            variant: cardProps.variant,
            tone: cardProps.tone,
            corner: cardProps.corner,
            glassOpacity: cardProps.glassOpacity,
            vibrancy: cardProps.vibrancy,
            specularMode: cardProps.specularMode,
            ...stepPopoverProps,
          }}
          fillHeight={scrollBody}
          steps={steps}
          activeStepId={active?.step.id}
          palette={palette}
          customStatuses={customStatuses}
          surfaces={surfaces}
          labels={labels}
          progress={progress}
          tallies={tallies}
          showLegend={showLegend && !loading}
          loading={loading}
          loadingRows={loadingRows}
          emptyState={emptyState}
          onStepSelect={onStepSelect}
          disableFutureSteps={disableFutureSteps}
          onSubStepSelect={onSubStepSelect}
          onStepAction={onStepAction}
        />
      </div>
    </Panel>
  );
};

export default WorkflowTrackerRail;
