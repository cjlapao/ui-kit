import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import Panel from "../Panel";
import { CollapseToggleButton } from "../CollapseToggleButton";
import {
  COLLAPSED_RAIL_WIDTH,
  PANEL_SLIDE_DURATION_MS,
  PANEL_SLIDE_EASING,
  getSurfacePaddingPx,
  panelSlideTransition,
  prefersReducedMotion,
  type PanelMotion,
} from "../../theme/Theme";
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
  /** Content below the steps, in its own scroll area. Render a component
   * here to preserve its local state as `collapsed` changes. The consumer owns
   * its expanded/compact layout and accessible labels. Also available while loading. */
  renderControls?: (
    context: WorkflowTrackerRailControlsContext,
  ) => React.ReactNode;
  /** Fixed footer heading, outside the controls scroll area. Receives the same collapse state as renderControls. */
  renderControlsHeader?: (
    context: WorkflowTrackerRailControlsContext,
  ) => React.ReactNode;
  /** Enable the horizontal resize handle between steps and footer in a height-constrained rail. @default false */
  footerResizable?: boolean;
  /** Initial footer share of the steps/footer space, in percent (10–80). @default 30 */
  defaultFooterHeight?: number;
  /** Controlled footer share in percent (10–80). */
  footerHeight?: number;
  onFooterHeightChange?: (height: number) => void;
  /** Accessible name of the footer region. @default "Workflow footer" */
  footerLabel?: string;
  /** Accessible name of the separator. @default "Resize workflow footer" */
  footerResizeLabel?: string;
  /** Enables the animated collapse toggle. Expanded width defaults to 360px;
   * override it with `style.width`. @default false */
  collapsible?: boolean;
  /** Controlled collapse state; only applies when `collapsible` is true. */
  collapsed?: boolean;
  /** Initial uncontrolled collapse state. @default false */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * How the rail takes and gives back its space when collapsing.
   *
   * `"layout"` (default, historical): the rail's width sweeps on the shared
   * panel curve — one property, the inset now rides inside as its own bounded
   * animation. `"slide"`: the width snaps to its final value in a single
   * layout and the timeline counter-animates `transform` + `opacity`, which
   * WebKitGTK composites — the centre snaps to its new width instead of
   * easing, the rail still appears to sweep. `prefers-reduced-motion` makes
   * both modes instant. See `SidePanel`'s `motion` for the full trade.
   * @default "layout"
   */
  motion?: PanelMotion;
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
  motion = "layout",
  fillHeight = false,
  flush = true,
  expandLabel = "Expand workflow rail",
  collapseLabel = "Collapse workflow rail",
  renderStepPopover,
  renderControls,
  renderControlsHeader,
  footerResizable = false,
  defaultFooterHeight = 30,
  footerHeight,
  onFooterHeightChange,
  footerLabel = "Workflow footer",
  footerResizeLabel = "Resize workflow footer",
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

  // ── Collapse motion ──────────────────────────────────────────────────────
  // One swept property on the rail itself (width). The card inset rides along
  // on an INNER wrapper inside the shell's containment: the old version asked
  // the shared curve for `width` AND `padding` — two layout properties where
  // one carries the motion — and dropping the inset to `none` mid-sweep was
  // the visible jump this still avoids. A class cannot transition (and would
  // drag `space-y`/gutter classes with it), so the inset is the token's base
  // px inline: the `sm:` bump of container padding is given up here in
  // exchange for one property per sweep, bounded by containment (≤8px on the
  // widest token, only for rails that opt into an inset at all — the rail's
  // own padding default is `none`).
  const reduced = prefersReducedMotion();
  const slide = motion === "slide";
  const padPx = getSurfacePaddingPx(cardProps.padding ?? "none");
  // The expanded width as a plain number — the floor publish and the sweep
  // distance both need one; a non-numeric `style.width` keeps the 360 default.
  const expandedWidth = typeof style?.width === "number" ? style.width : 360;

  // Slide mode: the width snaps, the timeline sweeps in/out with the
  // composited `kit-sp-sweep-x-*` keyframes (see styles.css), displaced
  // toward the docked edge by exactly the distance the width no longer
  // animates. Numbers the rail already owns — never measured back.
  const [sweepDir, setSweepDir] = useState<"in" | "out" | null>(null);
  const sweepKeyRef = useRef(isCollapsed);
  useEffect(() => {
    const prev = sweepKeyRef.current;
    sweepKeyRef.current = isCollapsed;
    if (!slide || reduced || prev === isCollapsed) return;
    setSweepDir(isCollapsed ? "out" : "in");
  }, [slide, reduced, isCollapsed]);

  // Zone-floor publish (see PageBodyLayout): the rail knows its own width, so
  // it writes that number up into the row's `calc()` floor. Custom properties
  // only inherit downward, so publishing *up* is this one direct style write;
  // the layout still measures and stores nothing.
  const railRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!collapsible) return;
    const prop =
      side === "left" ? "--page-zone-min-left" : "--page-zone-min-right";
    const row = railRef.current?.closest<HTMLElement>("[data-page-row]");
    if (!row) return;
    row.style.setProperty(
      prop,
      `${isCollapsed ? COLLAPSED_RAIL_WIDTH : expandedWidth}px`,
    );
    return () => {
      row.style.removeProperty(prop);
    };
  }, [collapsible, side, isCollapsed, expandedWidth]);

  // The single property the sweep animates, named through a variable: one
  // property per sweep is the contract (see Learnings — a layout animation is
  // a measurement driver, and each extra swept property multiplies it).
  const sweepProperty = "width";

  return (
    <Panel
      {...cardProps}
      ref={railRef}
      // Only a collapsible rail moves the inset inside the shell as an
      // animated inline value; a static rail keeps the responsive class.
      padding={collapsible ? "none" : cardProps.padding}
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
              // as a snap), and ONE property: the width carries the sweep,
              // the inset rides inside the containment on its own element.
              // Slide mode snaps the flow size (the timeline sweeps instead);
              // reduced motion takes both off — an instant collapse is the
              // point, and no 450 ms layout animation to observe per frame.
              ...(slide || reduced
                ? null
                : { transition: panelSlideTransition(sweepProperty) }),
              // Layout containment bounds the per-frame relayout the sweep
              // triggers; `paint` deliberately absent — step popovers and
              // tooltips render outside this box, and paint containment would
              // amputate them invisibly until someone opened one.
              contain: "layout style",
              containIntrinsicSize: "auto",
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
      {/* The card inset, inside the containment: the rail sweeps one property,
          this element lets the inset ride the same curve without widening the
          swept set on the animating shell. The absolute toggle above is
          unaffected by padding either way (abspos insets resolve against the
          padding box). */}
      <div
        data-rail-inset
        className={classNames("min-w-0", scrollBody && "flex min-h-0 flex-1 flex-col")}
        style={{
          padding: collapsible && !isCollapsed ? padPx : 0,
          ...(collapsible && !slide && !reduced
            ? { transition: panelSlideTransition("padding") }
            : null),
          ...(slide && sweepDir && !reduced
            ? ({
                "--sp-sweep-x": `${
                  (side === "left" ? -1 : 1) *
                  Math.max(1, expandedWidth - COLLAPSED_RAIL_WIDTH)
                }px`,
                animation: `kit-sp-sweep-x-${sweepDir} ${PANEL_SLIDE_DURATION_MS}ms ${PANEL_SLIDE_EASING} both`,
              } as React.CSSProperties)
            : null),
        }}
      >
      {collapsible && (isCollapsed || loading || steps.length === 0) && (
        <div className="h-10 shrink-0" />
      )}
      <div
        id={timelineId}
        className={scrollBody ? "flex min-h-0 flex-1 flex-col" : undefined}
      >
        <WorkflowTimeline
          controls={renderControls?.({ collapsed: isCollapsed })}
          controlsHeader={renderControlsHeader?.({ collapsed: isCollapsed })}
          footerResizable={footerResizable}
          defaultFooterHeight={defaultFooterHeight}
          footerHeight={footerHeight}
          onFooterHeightChange={onFooterHeightChange}
          footerLabel={footerLabel}
          footerResizeLabel={footerResizeLabel}
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
      </div>
    </Panel>
  );
};

export default WorkflowTrackerRail;
