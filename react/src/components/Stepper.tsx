import React, {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Panel, { type PanelLoaderType, type PanelProps } from "./Panel";
import {
  DEFAULT_SURFACE_CORNER,
  getLoaderProgressColors,
  getPanelToneStyles,
  getStepperTonePalette,
  getSurfaceCornerClass,
  getSurfaceTriggerTokens,
  type ControlSize,
  type Orientation,
  type SurfaceCorner,
  type TrueColor,
} from "../theme/Theme";
import { useStepper, type StepperState } from "../hooks";
import { useIconRenderer } from "../contexts/IconContext";
import { useSurfaceText } from "../contexts/SurfaceContext";

export type StepStatus = "pending" | "active" | "completed" | "error";

export interface StepperStep {
  id?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
  icon?: string | React.ReactElement;
  optionalLabel?: React.ReactNode;
  status?: StepStatus;
  disabled?: boolean;
}

export type Step = StepperStep;

export type StepperOrientation = Orientation;

/** How the line between nodes behaves. `progress` fills it as steps complete. */
export type StepperConnector = "line" | "progress" | "none";
export type StepperProgressBarPosition = "top" | "bottom";
export type StepperConnectorAlign = "left" | "center" | "right";

/**
 * Shape of the step node. The Panel corner scale (`none` → `rounded-xl`) gives
 * the usual card corners; `"full"` is the classic circle. @default "full"
 */
export type StepperNodeCorner = SurfaceCorner | "full";

/**
 * A multi-step workflow on the shared container surface.
 *
 * It renders `Panel` (like `Accordion` and `CollapsiblePanel`), so `variant`,
 * `tone`, `corner`, `padding`, `loading` and every glass prop come from the
 * same scales as every other card. Node and connector colour comes from
 * `getStepperTonePalette`, hover/focus from `getSurfaceTriggerTokens` and copy
 * colour from the surface's text tokens — nothing is a hardcoded
 * `text-neutral-*` pair, so the component reads correctly on glass.
 *
 * `size` is the shared `ControlSize` scale and drives node box, type, icons
 * and connector thickness; `variant` is the shared surface family — the old
 * local `"card" | "minimal"` and `"sm" | "md" | "lg"` unions are gone, and
 * density differences come from `size` + `padding` instead.
 */
/**
 * How the Stepper shows loading. "spinner"/"progress" overlay the node (and the
 * Panel when the whole stepper loads); "skeleton" replaces the content with
 * pulsing lines instead of a spinning overlay.
 */
export type StepperLoaderType = PanelLoaderType | "skeleton";

export interface StepperProps
  extends Omit<
    PanelProps,
    "title" | "subtitle" | "actions" | "children" | "onChange" | "loaderType"
  > {
  /** @default "spinner" */
  loaderType?: StepperLoaderType;
  steps: StepperStep[];
  currentIndex?: number;
  currentStepId?: string;
  defaultCurrentIndex?: number;
  defaultCurrentStepId?: string;
  completedStepIds?: string[];
  /** @default "horizontal" */
  orientation?: StepperOrientation;
  /** Density of the node, its type, icons and the connector. @default "md" */
  size?: ControlSize;
  /** Shape of the step node: a Panel corner scale or the classic circle. @default "full" */
  nodeCorner?: StepperNodeCorner;
  /**
   * "progress" runs edge-to-edge between the node circles and fills up to the
   * active step; "line" draws a static track with a breathing gap around
   * every circle. Both in every orientation. @default "progress"
   */
  connector?: StepperConnector;
  /** @default true */
  interactive?: boolean;
  /**
   * Animate connectors, fills and the progress bar. With `false` the
   * transition classes are dropped, not just paused. @default true
   */
  animated?: boolean;
  showProgressSummary?: boolean;
  showProgressBar?: boolean;
  /** Where the progress bar/summary sits relative to the steps. @default "bottom" */
  progressBarPosition?: StepperProgressBarPosition;
  progressPrecision?: number;
  progressLabel?: React.ReactNode;
  onChange?: (index: number, stepId?: string) => void;
  onStepClick?: (step: StepperStep, index: number) => void;
  /** Per-step actions rendered under the step's copy. */
  renderActions?: (step: StepperStep, index: number) => React.ReactNode;
  /** Step ids whose node shows a loader overlay (and whose content shows a skeleton). */
  loaderStepIds?: string[];
  headerClassName?: string;
  stepClassName?: string;
  contentClassName?: string;
  stepMaxHeight?: number | string;
  /** @default false */
  connectNodes?: boolean;
  /** @default "center" */
  connectorAlign?: StepperConnectorAlign;
  /** The underline bar beneath each step's title. @default false */
  showStepUnderline?: boolean;
}

/**
 * Type/icon/connector density only. Every class is a complete literal — the
 * previous version built `h-${n}` from a number and used `h-32` where it meant
 * 32px, which Tailwind reads as 8rem.
 */
const SIZE_TOKENS: Record<
  ControlSize,
  {
    node: string;
    nodeRadius: number;
    nodeText: string;
    title: string;
    subtitle: string;
    description: string;
    optional: string;
    icon: ControlSize;
    connector: string;
    connectorVertical: string;
    underline: string;
  }
> = {
  xs: {
    node: "h-8 w-8",
    nodeRadius: 16,
    nodeText: "text-xs",
    title: "text-xs font-semibold",
    subtitle: "text-[11px] font-medium",
    description: "text-[11px]",
    optional: "text-[11px] italic",
    icon: "xs",
    connector: "h-0.5",
    connectorVertical: "w-0.5",
    underline: "h-0.5",
  },
  sm: {
    node: "h-9 w-9",
    nodeRadius: 18,
    nodeText: "text-xs",
    title: "text-sm font-semibold",
    subtitle: "text-xs font-medium",
    description: "text-xs",
    optional: "text-[11px] italic",
    icon: "sm",
    connector: "h-[3px]",
    connectorVertical: "w-[3px]",
    underline: "h-0.5",
  },
  md: {
    node: "h-10 w-10",
    nodeRadius: 20,
    nodeText: "text-sm",
    title: "text-base font-semibold",
    subtitle: "text-sm font-medium",
    description: "text-sm",
    optional: "text-xs italic",
    icon: "md",
    connector: "h-1",
    connectorVertical: "w-1",
    underline: "h-[3px]",
  },
  lg: {
    node: "h-12 w-12",
    nodeRadius: 24,
    nodeText: "text-base",
    title: "text-lg font-semibold",
    subtitle: "text-sm font-medium",
    description: "text-sm",
    optional: "text-sm italic",
    icon: "lg",
    connector: "h-[5px]",
    connectorVertical: "w-[5px]",
    underline: "h-1",
  },
  xl: {
    node: "h-14 w-14",
    nodeRadius: 28,
    nodeText: "text-lg",
    title: "text-xl font-semibold",
    subtitle: "text-sm font-medium",
    description: "text-base",
    optional: "text-sm italic",
    icon: "xl",
    connector: "h-1.5",
    connectorVertical: "w-1.5",
    underline: "h-1",
  },
};

const STATUS_ICON: Record<StepStatus, string | undefined> = {
  pending: undefined,
  active: undefined,
  completed: "CheckCircle",
  error: "Error",
};

/**
 * Semantic, not tone-driven: an error step is always rose. Same `-700` light /
 * `-400` dark rule as every other fill that carries a glyph — the old
 * `bg-rose-500` under white measured ~3.9:1.
 */
const ERROR_NODE = "bg-rose-700 dark:bg-rose-400 text-white dark:text-rose-950";

interface StepMeta {
  step: StepperStep;
  index: number;
  resolvedId: string;
  status: StepStatus;
  /** A step that is active never fills the connector, even if completed. */
  isCompleted: boolean;
  statusClasses: string | string[];
  hoverClass: string;
  underlineClasses: string;
  textStyle: React.CSSProperties | undefined;
  nodeIcon: string | React.ReactElement | undefined;
  isLoadingStep: boolean;
}

interface StepperBodyProps {
  state: StepperState<StepperStep>;
  orientation: StepperOrientation;
  size: ControlSize;
  nodeCorner: StepperNodeCorner;
  tone: TrueColor;
  connector: StepperConnector;
  animated: boolean;
  loaderType: PanelLoaderType;
  /** `interactive && !disabled`, resolved by the parent. */
  clickable: boolean;
  showProgressSummary: boolean;
  showProgressBar: boolean;
  progressBarPosition: StepperProgressBarPosition;
  progressPrecision: number;
  progressLabel?: React.ReactNode;
  onStepClick?: (step: StepperStep, index: number) => void;
  renderActions?: (step: StepperStep, index: number) => React.ReactNode;
  loaderStepIds?: string[];
  headerClassName?: string;
  stepClassName?: string;
  contentClassName?: string;
  stepMaxHeight?: number | string;
  connectNodes: boolean;
  connectorAlign: StepperConnectorAlign;
  showStepUnderline: boolean;
}

/**
 * Split out so it can read the surface context `Panel` publishes — a component
 * cannot consume a provider it renders itself. That is how the copy, the
 * hover wash and the recessed content fill adapt to glass without a hardcoded
 * neutral pair.
 */
const StepperBody: React.FC<StepperBodyProps> = ({
  state,
  orientation,
  size,
  nodeCorner,
  tone,
  connector,
  animated,
  loaderType,
  clickable,
  showProgressSummary,
  showProgressBar,
  progressBarPosition,
  progressPrecision,
  progressLabel,
  onStepClick,
  renderActions,
  loaderStepIds,
  headerClassName,
  stepClassName,
  contentClassName,
  stepMaxHeight,
  connectNodes,
  connectorAlign,
  showStepUnderline,
}) => {
  const renderIcon = useIconRenderer();
  const surface = useSurfaceText();
  const trigger = getSurfaceTriggerTokens(tone);
  const palette = getStepperTonePalette(tone);
  const panelTone = getPanelToneStyles(tone);
  const progressColors = getLoaderProgressColors(tone);
  const tokens = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const nodeCornerClass =
    nodeCorner === "full" ? "rounded-full" : getSurfaceCornerClass(nodeCorner);
  const steps = state.steps;
  const progressLabelId = useId();
  const loaderSet = useMemo(
    () => new Set(loaderStepIds ?? []),
    [loaderStepIds],
  );
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const verticalContainerRef = useRef<HTMLDivElement | null>(null);
  const [verticalSegments, setVerticalSegments] = useState<number[]>([]);

  const nodeTransition = animated
    ? "transition-all duration-200 motion-reduce:transition-none"
    : "";
  const lineTransition = animated
    ? "transition-colors duration-200 motion-reduce:transition-none"
    : "";
  const fillTransition = animated
    ? "transition-all duration-300 ease-out motion-reduce:transition-none"
    : "";

  const stepMeta: StepMeta[] = steps.map((step, index) => {
    const resolvedId = step.id ?? String(index);
    const derivedActive = state.isActive(resolvedId, index);
    const derivedCompleted = state.isCompleted(resolvedId, index);
    const status: StepStatus =
      step.status ??
      (derivedActive ? "active" : derivedCompleted ? "completed" : "pending");

    const isCompleted =
      (step.status ? step.status === "completed" : derivedCompleted) &&
      !derivedActive;

    const statusClasses =
      status === "active"
        ? [palette.activeBg, palette.activeText, "border-transparent shadow-sm"]
        : status === "completed"
          ? [
              palette.completedBg,
              palette.completedText,
              "border-transparent shadow-sm",
            ]
          : status === "error"
            ? [ERROR_NODE, "border-transparent shadow-sm"]
            : // No fill: a pending node is just its tone border and number, so
              // it stays see-through on a glass surface instead of painting an
              // opaque slab.
              ["bg-transparent", palette.pendingBorder, palette.pendingText];

    // Filled nodes darken on hover; a transparent pending node takes the
    // surface's tone wash instead (brightness-95 on nothing paints nothing).
    const hoverClass =
      status === "pending" ? trigger.hover : "hover:brightness-95";

    const underlineClasses =
      connector !== "none"
        ? classNames(
            "w-full rounded-full",
            lineTransition,
            tokens.underline,
            palette.underlineBase,
          )
        : "";

    const textStyle =
      stepMaxHeight !== undefined
        ? {
            maxHeight:
              typeof stepMaxHeight === "number"
                ? `${stepMaxHeight}px`
                : stepMaxHeight,
          }
        : undefined;

    const nodeIcon = step.icon ?? STATUS_ICON[status];
    const isLoadingStep = loaderSet.has(resolvedId);

    return {
      step,
      index,
      resolvedId,
      status,
      isCompleted,
      statusClasses,
      hoverClass,
      underlineClasses,
      textStyle,
      nodeIcon,
      isLoadingStep,
    };
  });

  const goTo = (step: StepperStep, index: number) => {
    if (!clickable || step.disabled) return;
    state.goToIndex(index);
    onStepClick?.(step, index);
  };

  const handleNodeKeyDown = (
    event: React.KeyboardEvent,
    index: number,
  ) => {
    // Only when the node itself has focus.
    if (event.target !== event.currentTarget) {
      return;
    }
    if (
      ![
        "ArrowDown",
        "ArrowUp",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      return;
    }
    event.preventDefault();

    // Arrow keys move focus between steps without activating them (APG
    // disclosure pattern); Enter/Space activate via the native button.
    const enabled = steps
      .map((_, i) => i)
      .filter((i) => !steps[i].disabled);
    if (enabled.length === 0) return;
    const current = enabled.indexOf(index);
    if (current === -1) return;

    let next: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = (current + 1) % enabled.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = (current - 1 + enabled.length) % enabled.length;
        break;
      case "Home":
        next = 0;
        break;
      default:
        next = enabled.length - 1;
    }
    nodeRefs.current[enabled[next]]?.focus();
  };

  useLayoutEffect(() => {
    if (orientation !== "vertical") {
      if (verticalSegments.length !== 0) {
        setVerticalSegments([]);
      }
      return;
    }

    const measure = () => {
      const container = verticalContainerRef.current;
      if (!container) return;
      const nodes = nodeRefs.current;
      if (nodes.length < 2) {
        setVerticalSegments([]);
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const centers: number[] = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (!node) return;
        const rect = node.getBoundingClientRect();
        centers.push(rect.top + rect.height / 2 - containerRect.top);
      }
      const segments = centers
        .slice(0, -1)
        .map((value, idx) => centers[idx + 1] - value);
      setVerticalSegments((prev) => {
        if (
          prev.length === segments.length &&
          prev.every((value, idx) => value === segments[idx])
        ) {
          return prev;
        }
        return segments;
      });
    };

    measure();
    // Observe the container, not just the window: a stepper in a resizable
    // split resizes while the window does not.
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    if (observer && verticalContainerRef.current) {
      observer.observe(verticalContainerRef.current);
    }
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orientation, steps, state.currentIndex, loaderStepIds]);

  const progressPercent = Math.min(100, Math.max(0, state.progressPercent));
  const formattedProgress =
    Math.round(progressPercent * Math.pow(10, progressPrecision)) /
    Math.pow(10, progressPrecision);

  const progressBlock =
    showProgressBar || showProgressSummary ? (
      <div
        className={classNames(
          "flex w-full flex-col gap-2",
          progressBarPosition === "bottom" && "mt-6",
        )}
      >
        {showProgressSummary && (
          <div
            className={classNames(
              "flex items-center justify-between text-sm font-medium",
              surface.muted,
            )}
          >
            <span id={progressLabelId}>
              {progressLabel ?? "Progress"}
            </span>
            <span>{formattedProgress}%</span>
          </div>
        )}
        {showProgressBar && (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={formattedProgress}
            aria-labelledby={showProgressSummary ? progressLabelId : undefined}
            aria-label={showProgressSummary ? undefined : "Progress"}
            className={classNames(
              "relative h-1 w-full overflow-hidden rounded-full",
              progressColors.track,
            )}
          >
            <div
              className={classNames(
                "absolute inset-y-0 left-0 rounded-full",
                fillTransition,
                progressColors.bar,
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    ) : null;

  const renderNode = (
    meta: StepMeta,
    idx: number,
    cellClassName?: string,
  ) => {
    const { step, statusClasses, hoverClass, nodeIcon, isLoadingStep } =
      meta;
    const isDisabled = Boolean(step.disabled);
    const active = state.isActive(meta.resolvedId, idx);
    const NodeTag = clickable && !isDisabled ? "button" : "div";

    return (
      <NodeTag
        type={NodeTag === "button" ? "button" : undefined}
        ref={(el: HTMLElement | null) => {
          nodeRefs.current[idx] = el;
        }}
        className={classNames(
          "relative z-10 flex items-center justify-center border font-semibold",
          nodeCornerClass,
          tokens.node,
          tokens.nodeText,
          nodeTransition,
          isDisabled && "opacity-60",
          statusClasses,
          clickable && !isDisabled && hoverClass,
          clickable && !isDisabled && trigger.focusRing,
          cellClassName,
        )}
        onClick={() => goTo(step, idx)}
        onKeyDown={
          NodeTag === "button" ? (e) => handleNodeKeyDown(e, idx) : undefined
        }
        aria-current={active ? "step" : undefined}
        aria-label={typeof step.title === "string" ? step.title : undefined}
      >
        {nodeIcon ? renderIcon(nodeIcon, tokens.icon) : idx + 1}
        {/* "skeleton" loads the content, not the node — the node stays put. */}
        {isLoadingStep && loaderType !== "skeleton" && (
          <Loader
            overlay
            variant={loaderType}
            size="sm"
            className="rounded-full"
            title={null}
            label={null}
          />
        )}
      </NodeTag>
    );
  };

  const renderHorizontal = () => {
    const nodeRadius = tokens.nodeRadius;
    const gridColumns = Math.max(1, steps.length);
    // The node row uses gap-2 (8px) while the nodes are detached; a negative
    // offset of the same size lets a span bridge the gap and reach the
    // previous cell's edge. Keep in sync with the gap-2 class below.
    const nodeGap = connectNodes ? 0 : 8;
    // "progress" runs edge-to-edge (node edge to node edge); "line" keeps a
    // breathing gap around every circle, in every orientation.
    const lineInset = connector === "line" ? 8 : 0;

    return (
      <div className={classNames("relative flex flex-col", headerClassName)}>
        <div
          className={classNames(
            "flex items-center",
            connectNodes ? "gap-0" : "gap-2",
          )}
        >
          {stepMeta.map((meta, idx) => {
            const { resolvedId, isCompleted } = meta;

            // Connector geometry. Each gap between two nodes is drawn so the
            // line runs from one node's far edge to the other node's near edge
            // (edge-to-edge for "progress"), or stops `lineInset` short of
            // each circle ("line") — never entering a circle, solid or
            // transparent. A single-span gap (left/right align) insets BOTH
            // ends; the split-span gap (center) insets one end per span. The
            // left span (this cell) joins THIS step to the previous one; the
            // right span (this cell) joins it to the next.
            // The px offsets are folded in JS (one term per calc): jsdom's
            // CSSOM mis-signs 3+-term calcs, and pre-folded calcs render
            // identically in real browsers.
            const bothEndsPx = nodeGap - nodeRadius * 2 - lineInset * 2;
            const bothEnds = `calc(100% ${bothEndsPx < 0 ? "-" : "+"} ${Math.abs(bothEndsPx)}px)`;
            const centerLeftPx = nodeGap - nodeRadius - lineInset;
            const centerLeft = `calc(50% ${centerLeftPx < 0 ? "-" : "+"} ${Math.abs(centerLeftPx)}px)`;
            const centerRightPx = -(nodeRadius + lineInset);
            const centerRight = `calc(50% ${centerRightPx < 0 ? "-" : "+"} ${Math.abs(centerRightPx)}px)`;
            let leftStyle: React.CSSProperties | undefined;
            let rightStyle: React.CSSProperties | undefined;
            if (connector !== "none") {
              if (connectorAlign === "left") {
                // Node at the cell's left edge: one right span per cell runs
                // from this node's right edge across the gap to the next
                // node's left edge.
                if (idx < stepMeta.length - 1) {
                  rightStyle = {
                    right: `${lineInset - nodeGap}px`,
                    width: bothEnds,
                  };
                }
              } else if (connectorAlign === "right") {
                // Node at the cell's right edge: one left span per cell starts
                // one gap before the cell (= previous node's right edge) and
                // runs to this node's left edge.
                if (idx > 0) {
                  leftStyle = {
                    left: `${lineInset - nodeGap}px`,
                    width: bothEnds,
                  };
                }
              } else {
                // Centered node: the gap splits at the cell boundary — this
                // cell's right span covers node→cell edge (inset on the node
                // side), the next cell's left span covers cell edge→node
                // (inset on its node side). The two spans meet at a point, so
                // their junction-side corners are squared — a rounded-full cap
                // on each would pinch the line into a visible notch. The
                // node-side corners stay rounded. Both spans are always the
                // same color (both key off the left step's completion), so the
                // square-to-square meeting reads as one continuous line.
                if (idx > 0) {
                  leftStyle = {
                    left: `-${nodeGap}px`,
                    width: centerLeft,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  };
                }
                if (idx < stepMeta.length - 1) {
                  rightStyle = {
                    right: "0px",
                    width: centerRight,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  };
                }
              }
            }
            const previousCompleted =
              stepMeta[idx - 1]?.isCompleted ?? false;

            // The left connector joins THIS step to the previous one, so it
            // fills when the PREVIOUS step completed; the right connector joins
            // this step to the next, so it fills when THIS step completed. One
            // class set per direction, never a shared condition.
            const leftConnector = leftStyle ? (
              <span
                className={classNames(
                  "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full",
                  tokens.connector,
                  lineTransition,
                  connector === "progress" && previousCompleted
                    ? palette.activeBg
                    : palette.underlineBase,
                )}
                style={leftStyle}
                aria-hidden="true"
              />
            ) : null;

            const rightConnector = rightStyle ? (
              <span
                className={classNames(
                  "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full",
                  tokens.connector,
                  lineTransition,
                  connector === "progress" && isCompleted
                    ? palette.activeBg
                    : palette.underlineBase,
                )}
                style={rightStyle}
                aria-hidden="true"
              />
            ) : null;

            return (
              <div
                key={`${resolvedId}-node`}
                className={classNames(
                  "relative flex flex-1",
                  connectorAlign === "left"
                    ? "items-center"
                    : connectorAlign === "right"
                      ? "items-center justify-end"
                      : "items-center justify-center",
                )}
              >
                {leftConnector}
                {renderNode(meta, idx)}
                {rightConnector}
              </div>
            );
          })}
        </div>
        <div
          className="mt-4 grid items-stretch gap-2"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          }}
        >
          {stepMeta.map((meta) => {
            const {
              step,
              index,
              resolvedId,
              underlineClasses,
              textStyle,
            } = meta;
            const isDisabled = Boolean(step.disabled);
            const active = state.isActive(resolvedId, index);
            const actions = renderActions?.(step, index);

            return (
              <div
                key={`${resolvedId}-body`}
                className={classNames(
                  "flex h-full flex-col justify-between rounded-xl px-2 text-left",
                  clickable &&
                    !isDisabled &&
                    classNames(
                      "cursor-pointer",
                      animated &&
                        "transition-colors duration-150 motion-reduce:transition-none",
                      trigger.hover,
                    ),
                  isDisabled && "opacity-60",
                  stepClassName,
                )}
                // Pointer-only convenience: the step node (a native button in
                // clickable mode) is the single keyboard tab stop and already
                // activates on Enter/Space — a second stop per step would
                // double the tab path (see "one button per step" tests).
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- keyboard activation lives on the step node
                onClick={() => goTo(step, index)}
                aria-current={active ? "step" : undefined}
              >
                <div
                  className="flex min-w-0 flex-col gap-1 overflow-hidden break-words"
                  style={textStyle}
                >
                  <div className={classNames(tokens.title, surface.heading)}>
                    {step.title}
                  </div>
                  {step.subtitle && (
                    <div
                      className={classNames(tokens.subtitle, surface.muted)}
                    >
                      {step.subtitle}
                    </div>
                  )}
                  {step.description && (
                    <div
                      className={classNames(
                        tokens.description,
                        surface.description,
                      )}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  {step.optionalLabel && (
                    <div className={classNames(tokens.optional, surface.muted)}>
                      {step.optionalLabel}
                    </div>
                  )}
                  {actions && (
                    // Stops both activation paths, not just the pointer one.
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- propagation guard for nested actions, not an interactive element
                    <div
                      className="flex flex-wrap items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      {actions}
                    </div>
                  )}
                  {connector !== "none" && showStepUnderline && (
                    <div className={underlineClasses} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVertical = () => {
    // "progress" runs edge-to-edge between the circles; "line" keeps a
    // breathing gap around every circle.
    const lineInset = connector === "line" ? 8 : 0;
    return (
    <div
      ref={verticalContainerRef}
      className={classNames("relative flex flex-col", headerClassName)}
    >
      {stepMeta.map((meta, index) => {
        const {
          step,
          resolvedId,
          isCompleted,
          underlineClasses,
          textStyle,
        } = meta;
        const isDisabled = Boolean(step.disabled);
        const segmentLength = verticalSegments[index] ?? 0;
        const showConnector =
          connector !== "none" &&
          index < stepMeta.length - 1 &&
          segmentLength > 0;
        const actions = renderActions?.(step, index);

        return (
          <div
            key={resolvedId}
            className={classNames(
              "relative flex items-start gap-4 py-4",
              index === 0 && "pt-0",
              index === stepMeta.length - 1 && "pb-0",
              stepClassName,
            )}
          >
            <div className="relative flex flex-col items-center">
              {renderNode(meta, index)}
              {showConnector && (
                <span
                  className={classNames(
                    "pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full",
                    tokens.connectorVertical,
                    lineTransition,
                    connector === "progress" && isCompleted
                      ? palette.activeBg
                      : palette.underlineBase,
                  )}
                  // segmentLength is measured center-to-center; the line runs
                  // from this node's bottom edge to the next node's top edge
                  // (edge-to-edge for "progress"), or `lineInset` short of
                  // each circle ("line") — never entering a circle.
                  style={{
                    top: `${tokens.nodeRadius * 2 + lineInset}px`,
                    height: `${Math.max(
                      0,
                      segmentLength - tokens.nodeRadius * 2 - lineInset * 2,
                    )}px`,
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
            <div
              className={classNames(
                "flex min-w-0 flex-1 flex-col gap-0.5 text-left",
                clickable && !isDisabled && "cursor-pointer",
                isDisabled && "opacity-60",
              )}
              // Pointer-only convenience: keyboard activation lives on the
              // step node (the single tab stop per step).
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- keyboard activation lives on the step node
              onClick={() => goTo(step, index)}
            >
              <div
                className={classNames(tokens.title, surface.heading)}
                style={textStyle}
              >
                {step.title}
              </div>
              {step.subtitle && (
                <div className={classNames(tokens.subtitle, surface.muted)}>
                  {step.subtitle}
                </div>
              )}
              {step.description && (
                <div
                  className={classNames(tokens.description, surface.description)}
                >
                  {step.description}
                </div>
              )}
              {step.optionalLabel && (
                <div className={classNames(tokens.optional, surface.muted)}>
                  {step.optionalLabel}
                </div>
              )}
              {connector !== "none" && showStepUnderline && (
                <div className={underlineClasses} />
              )}
              {actions && (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- propagation guard for nested actions, not an interactive element
                <div
                  className="mt-2 flex flex-wrap items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  {actions}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
    );
  };

  const horizontal = orientation === "horizontal";

  const activeStep = steps[state.currentIndex];
  const activeStepLoading =
    activeStep !== undefined &&
    loaderSet.has(activeStep.id ?? String(state.currentIndex));

  const contentNode = activeStepLoading ? (
    // Shaped like the content it replaces: title line, then two body lines.
    <div
      className="flex animate-pulse flex-col gap-2 motion-reduce:animate-none"
      aria-hidden="true"
    >
      <span className="h-3 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
      <span className="h-2.5 w-full rounded-full bg-black/10 dark:bg-white/10" />
      <span className="h-2.5 w-5/6 rounded-full bg-black/10 dark:bg-white/10" />
    </div>
  ) : (
    activeStep?.content ?? (
      <div className={classNames("space-y-2 text-sm", surface.body)}>
        {activeStep?.description}
      </div>
    )
  );

  // The recessed detail region. On a solid surface it takes the tone's subtle
  // fill and hairline; on a translucent one an opaque fill would punch a slab
  // through the glass, so it takes the surface's own divider plus a faint
  // wash that works over a busy backdrop.
  const contentRegionClass = surface.translucent
    ? classNames("border", surface.divider, "bg-white/40 dark:bg-black/20")
    : classNames("border", panelTone.outlineBorder, panelTone.subtleBg);

  return (
    <div
      className={classNames(
        "flex w-full flex-col",
        horizontal ? "gap-6" : "gap-4",
      )}
    >
      {progressBarPosition === "top" && progressBlock}
      {horizontal ? renderHorizontal() : renderVertical()}
      {progressBarPosition === "bottom" && progressBlock}
      <div
        className={classNames(
          "rounded-xl p-4 sm:p-5",
          contentRegionClass,
          contentClassName,
        )}
      >
        {contentNode}
      </div>
    </div>
  );
};

interface StepperSkeletonProps {
  orientation: StepperOrientation;
  count: number;
  size: ControlSize;
}

/**
 * Whole-stepper loading placeholder shown when `loaderType` is "skeleton": the
 * step nodes as pulsing discs plus the content region as pulsing lines, shaped
 * like the stepper it replaces.
 */
const StepperSkeleton: React.FC<StepperSkeletonProps> = ({
  orientation,
  count,
  size,
}) => {
  const { node: nodeClass, connector, connectorVertical } = SIZE_TOKENS[size];
  const disc =
    "relative z-10 shrink-0 rounded-full bg-black/10 dark:bg-white/10 animate-pulse motion-reduce:animate-none";
  const nodes = Array.from({ length: Math.max(0, count) });
  // The connector is drawn as ONE segment per gap (disc to disc), stopping 8px
  // short of each disc (mx/my-2) — exactly how the "line" connector behaves — so
  // it never runs into the translucent discs. Thickness matches the live
  // connector (size-based), so the skeleton reads as a dimmed copy of it.
  const bar =
    "rounded-full bg-black/10 dark:bg-white/10 animate-pulse motion-reduce:animate-none";
  const contentLines = (
    <div
      className="flex animate-pulse flex-col gap-2 motion-reduce:animate-none"
      aria-hidden="true"
    >
      <span className="h-3 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
      <span className="h-2.5 w-full rounded-full bg-black/10 dark:bg-white/10" />
      <span className="h-2.5 w-5/6 rounded-full bg-black/10 dark:bg-white/10" />
    </div>
  );
  const region =
    "rounded-xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/5 sm:p-5";

  if (orientation === "vertical") {
    return (
      <div className="flex w-full gap-4" aria-hidden="true">
        <div className="flex flex-col items-center py-1">
          {nodes.map((_, i) => (
            <React.Fragment key={i}>
              <div className={classNames(disc, nodeClass)} />
              {i < nodes.length - 1 && (
                <div
                  className={classNames("my-2 min-h-6 flex-1", bar, connectorVertical)}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className={classNames("flex-1", region)}>{contentLines}</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6" aria-hidden="true">
      <div className="flex w-full items-center">
        {nodes.map((_, i) => (
          <React.Fragment key={i}>
            <div className={classNames(disc, nodeClass)} />
            {i < nodes.length - 1 && (
              <div className={classNames("mx-2 flex-1", bar, connector)} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className={region}>{contentLines}</div>
    </div>
  );
};

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentIndex,
  currentStepId,
  defaultCurrentIndex,
  defaultCurrentStepId,
  completedStepIds,
  orientation = "horizontal",
  variant = "elevated",
  tone = "neutral",
  size = "md",
  nodeCorner = "full",
  padding = "md",
  corner = DEFAULT_SURFACE_CORNER,
  connector = "progress",
  interactive = true,
  animated = true,
  loaderType = "spinner",
  loading = false,
  showProgressSummary = false,
  showProgressBar = false,
  progressBarPosition = "bottom",
  progressPrecision = 0,
  progressLabel,
  onChange,
  onStepClick,
  renderActions,
  loaderStepIds,
  connectNodes = false,
  connectorAlign = "center",
  showStepUnderline = false,
  headerClassName,
  stepClassName,
  contentClassName,
  stepMaxHeight,
  disabled,
  className,
  ...panelRest
}) => {
  const state = useStepper(steps, {
    currentIndex,
    currentStepId,
    defaultCurrentIndex,
    defaultCurrentStepId,
    completedStepIds,
    onChange,
  });
  const clickable = interactive && !disabled;
  const isSkeletonLoading = loading && loaderType === "skeleton";

  return (
    <Panel
      className={classNames("w-full", className)}
      variant={variant}
      tone={tone}
      padding={padding}
      corner={corner}
      loaderType={loaderType === "skeleton" ? "spinner" : loaderType}
      loading={loading && !isSkeletonLoading}
      disabled={disabled}
      scrollable={false}
      {...panelRest}
    >
      {steps.length === 0 ? (
        <EmptyState
          variant="plain"
          dashed={false}
          icon="ViewRows"
          title="No steps"
          subtitle="Add steps to show the workflow."
          tone={tone}
          size={size}
        />
      ) : isSkeletonLoading ? (
        <StepperSkeleton orientation={orientation} count={steps.length} size={size} />
      ) : (
        <StepperBody
          state={state}
          orientation={orientation}
          size={size}
          nodeCorner={nodeCorner}
          tone={tone}
          connector={connector}
          animated={animated}
          loaderType={loaderType}
          clickable={clickable}
          showProgressSummary={showProgressSummary}
          showProgressBar={showProgressBar}
          progressBarPosition={progressBarPosition}
          progressPrecision={progressPrecision}
          progressLabel={progressLabel}
          onStepClick={onStepClick}
          renderActions={renderActions}
          loaderStepIds={loaderStepIds}
          headerClassName={headerClassName}
          stepClassName={stepClassName}
          contentClassName={contentClassName}
          stepMaxHeight={stepMaxHeight}
          connectNodes={connectNodes}
          connectorAlign={connectorAlign}
          showStepUnderline={showStepUnderline}
        />
      )}
    </Panel>
  );
};

Stepper.displayName = "Stepper";

export default Stepper;
