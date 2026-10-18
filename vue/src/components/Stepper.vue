<script lang="ts">
import type { CSSProperties, VNode, VNodeChild } from "vue";
import type { PanelLoaderType, PanelProps } from "./Panel.vue";
import type { IconName } from "../icons/registry";
import type { ControlSize, Orientation, SurfaceCorner } from "../theme/Theme";

export type StepStatus = "pending" | "active" | "completed" | "error";

export interface StepperStep {
  id?: string;
  title: string | VNode;
  subtitle?: string | VNode;
  description?: string | VNode;
  content?: string | VNode;
  icon?: IconName | VNode;
  optionalLabel?: string | VNode;
  status?: StepStatus;
  disabled?: boolean;
}

export type Step = StepperStep;

export type StepperOrientation = Orientation;
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
 * It renders `Panel` (like `Accordion`), so `variant`, `tone`, `corner`,
 * `padding` and every glass prop come from the same scales as every other
 * card. The Vue kit has no surface-text provider, so the copy, hover wash and
 * recessed fill are read straight from the shared theme with this component's
 * own `variant`/`tone` — the same call `Panel` makes internally.
 *
 * `size` is the shared `ControlSize` scale and `variant` the shared surface
 * family; the old local `"card" | "minimal"` and `"sm" | "md" | "lg"` unions
 * are gone.
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
    "title" | "subtitle" | "actions" | "loaderType"
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
   * "progress" runs edge-to-edge between the node circles and fills up to
   * the active step; "line" draws a static track with a breathing gap
   * around every circle. Both in every orientation. @default "progress"
   */
  connector?: StepperConnector;
  /** @default true */
  interactive?: boolean;
  /** @default true */
  animated?: boolean;
  showProgressSummary?: boolean;
  showProgressBar?: boolean;
  /** Where the progress bar/summary sits relative to the steps. @default "bottom" */
  progressBarPosition?: StepperProgressBarPosition;
  progressPrecision?: number;
  progressLabel?: string | VNode;
  /** Per-step actions rendered under the step's copy. */
  renderActions?: (step: StepperStep, index: number) => VNodeChild;
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

const STATUS_ICON: Record<StepStatus, IconName | undefined> = {
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
</script>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
  type ComponentPublicInstance,
} from "vue";
import classNames from "classnames";
import EmptyState from "./EmptyState.vue";
import Loader from "./Loader.vue";
import Panel from "./Panel.vue";
import { useStepper } from "../composables/useStepper";
import {
  DEFAULT_SURFACE_CORNER,
  getLoaderProgressColors,
  getPanelToneStyles,
  getStepperTonePalette,
  getSurfaceCornerClass,
  getSurfaceTextTokens,
  getSurfaceTriggerTokens,
} from "../theme/Theme";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Stepper", inheritAttrs: false });

const props = withDefaults(defineProps<StepperProps>(), {
  orientation: "horizontal",
  variant: "elevated",
  tone: "neutral",
  size: "md",
  nodeCorner: "full",
  padding: "md",
  corner: DEFAULT_SURFACE_CORNER,
  connector: "progress",
  interactive: true,
  animated: true,
  showProgressSummary: false,
  showProgressBar: false,
  progressBarPosition: "bottom",
  progressPrecision: 0,
  connectNodes: false,
  connectorAlign: "center",
  showStepUnderline: false,
  disabled: false,
  loading: false,
  loaderType: "spinner",
  scrollable: undefined,
});

const emit = defineEmits<{
  (e: "change", index: number, stepId?: string): void;
  (e: "stepClick", step: StepperStep, index: number): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();
const progressLabelId = useId();

const state = useStepper<StepperStep>(() => props.steps, {
  defaultCurrentIndex: props.defaultCurrentIndex,
  defaultCurrentStepId: props.defaultCurrentStepId,
  currentIndex: () => props.currentIndex,
  currentStepId: () => props.currentStepId,
  completedStepIds: () => props.completedStepIds,
  onChange: (index, stepId) => emit("change", index, stepId),
});

const surface = computed(() => getSurfaceTextTokens(props.variant ?? "elevated"));
const trigger = computed(() => getSurfaceTriggerTokens(props.tone ?? "neutral"));
const palette = computed(() => getStepperTonePalette(props.tone ?? "neutral"));
const panelTone = computed(() => getPanelToneStyles(props.tone ?? "neutral"));
const progressColors = computed(() =>
  getLoaderProgressColors(props.tone ?? "neutral"),
);
const tokens = computed(
  () => SIZE_TOKENS[props.size ?? "md"] ?? SIZE_TOKENS.md,
);
const nodeCornerClass = computed(() =>
  props.nodeCorner === "full"
    ? "rounded-full"
    : getSurfaceCornerClass(props.nodeCorner),
);
const clickable = computed(() => props.interactive && !props.disabled);
const loaderSet = computed(() => new Set(props.loaderStepIds ?? []));
const horizontal = computed(() => props.orientation === "horizontal");

const nodeTransition = computed(
  () =>
    props.animated
      ? "transition-all duration-200 motion-reduce:transition-none"
      : "",
);
const lineTransition = computed(
  () =>
    props.animated
      ? "transition-colors duration-200 motion-reduce:transition-none"
      : "",
);
const fillTransition = computed(
  () =>
    props.animated
      ? "transition-all duration-300 ease-out motion-reduce:transition-none"
      : "",
);

const progressPercent = computed(() =>
  Math.min(100, Math.max(0, state.progressPercent.value)),
);
const formattedProgress = computed(
  () =>
    Math.round(
      progressPercent.value * Math.pow(10, props.progressPrecision),
    ) / Math.pow(10, props.progressPrecision),
);

const activeStep = computed(() => props.steps[state.currentIndex.value]);
const activeStepLoading = computed(() => {
  const step = activeStep.value;
  return (
    step !== undefined &&
    loaderSet.value.has(step.id ?? String(state.currentIndex.value))
  );
});

// The recessed detail region. On a solid surface it takes the tone's subtle
// fill and hairline; on a translucent one an opaque fill would punch a slab
// through the glass, so it takes the surface's own divider plus a faint wash.
const contentRegionClass = computed(() =>
  surface.value.translucent
    ? classNames("border", surface.value.divider, "bg-white/40 dark:bg-black/20")
    : classNames("border", panelTone.value.outlineBorder, panelTone.value.subtleBg),
);

interface StepMeta {
  step: StepperStep;
  index: number;
  resolvedId: string;
  status: StepStatus;
  isCompleted: boolean;
  statusClasses: string[];
  hoverClass: string;
  underlineClasses: string;
  textStyle: CSSProperties | undefined;
  nodeIcon: IconName | VNode | undefined;
  isLoadingStep: boolean;
  actions: VNodeChild | undefined;
}

const stepMeta = computed<StepMeta[]>(() =>
  props.steps.map((step, index) => {
    const resolvedId = step.id ?? String(index);
    const derivedActive = state.isActive(resolvedId, index);
    const derivedCompleted = state.isCompleted(resolvedId, index);
    const status: StepStatus =
      step.status ??
      (derivedActive ? "active" : derivedCompleted ? "completed" : "pending");

    // A step that is active never fills the connector, even if completed.
    const isCompleted =
      (step.status ? step.status === "completed" : derivedCompleted) &&
      !derivedActive;

    const statusClasses: string[] =
      status === "active"
        ? [
            palette.value.activeBg,
            palette.value.activeText,
            "border-transparent shadow-sm",
          ]
        : status === "completed"
          ? [
              palette.value.completedBg,
              palette.value.completedText,
              "border-transparent shadow-sm",
            ]
          : status === "error"
            ? [ERROR_NODE, "border-transparent shadow-sm"]
            : // No fill: a pending node is just its tone border and number, so
              // it stays see-through on a glass surface instead of painting an
              // opaque slab.
              ["bg-transparent", palette.value.pendingBorder, palette.value.pendingText];

    // Filled nodes darken on hover; a transparent pending node takes the
    // surface's tone wash instead (brightness-95 on nothing paints nothing).
    const hoverClass =
      status === "pending" ? trigger.value.hover : "hover:brightness-95";

    const underlineClasses =
      props.connector !== "none"
        ? classNames(
            "w-full rounded-full",
            lineTransition.value,
            tokens.value.underline,
            palette.value.underlineBase,
          )
        : "";

    const textStyle: CSSProperties | undefined =
      props.stepMaxHeight !== undefined
        ? {
            maxHeight:
              typeof props.stepMaxHeight === "number"
                ? `${props.stepMaxHeight}px`
                : props.stepMaxHeight,
          }
        : undefined;

    const nodeIcon = step.icon ?? STATUS_ICON[status];
    const isLoadingStep = loaderSet.value.has(resolvedId);
    const actions = props.renderActions?.(step, index);

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
      actions,
    };
  }),
);

// ── Vertical connector measurement ──────────────────────────────────────────

const nodeRefs: (HTMLElement | null)[] = [];
const verticalContainerRef = ref<HTMLDivElement | null>(null);
const verticalSegments = ref<number[]>([]);
let resizeObserver: ResizeObserver | undefined;

const setNodeRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  nodeRefs[index] = el as HTMLElement | null;
};

const measure = () => {
  const container = verticalContainerRef.value;
  if (!container) return;
  nodeRefs.length = stepMeta.value.length;
  const nodes = nodeRefs;
  if (nodes.length < 2) {
    verticalSegments.value = [];
    return;
  }
  const containerRect = container.getBoundingClientRect();
  const centers: number[] = [];
  for (const node of nodes) {
    if (!node) return;
    const rect = node.getBoundingClientRect();
    centers.push(rect.top + rect.height / 2 - containerRect.top);
  }
  const segments = centers
    .slice(0, -1)
    .map((value, idx) => centers[idx + 1] - value);
  const prev = verticalSegments.value;
  if (
    prev.length === segments.length &&
    prev.every((value, idx) => value === segments[idx])
  ) {
    return;
  }
  verticalSegments.value = segments;
};

// Observe the container, not just the window: a stepper in a resizable split
// resizes while the window does not. Re-created on every orientation change so
// the (conditionally rendered) container element is always the one watched.
const syncVertical = () => {
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  if (props.orientation !== "vertical") {
    if (verticalSegments.value.length !== 0) {
      verticalSegments.value = [];
    }
    return;
  }
  const container = verticalContainerRef.value;
  if (container && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
  }
  measure();
};

watch(
  [
    () => props.orientation,
    () => props.steps,
    () => state.currentIndex.value,
    () => props.loaderStepIds,
  ],
  () => syncVertical(),
  { flush: "post" },
);

const handleResize = () => {
  if (props.orientation === "vertical") measure();
};

onMounted(() => {
  syncVertical();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", handleResize);
});

// ── Node row layout (horizontal) ────────────────────────────────────────────

type ConnectorStyle = Record<string, string>;

interface NodeRowItem {
  meta: StepMeta;
  leftStyle: ConnectorStyle | null;
  rightStyle: ConnectorStyle | null;
  previousCompleted: boolean;
  currentCompleted: boolean;
}

const nodeRowItems = computed<NodeRowItem[]>(() => {
  const nodeRadius = tokens.value.nodeRadius;
  // The node row uses gap-2 (8px) while the nodes are detached; a negative
  // offset of the same size lets a span bridge the gap and reach the
  // previous cell's edge. Keep in sync with the gap-2 class below.
  const nodeGap = props.connectNodes ? 0 : 8;
  // "progress" runs edge-to-edge (node edge to node edge); "line" keeps a
  // breathing gap around every circle, in every orientation.
  const lineInset = props.connector === "line" ? 8 : 0;
  // The px offsets are folded in JS (one term per calc): jsdom's CSSOM
  // mis-signs 3+-term calcs, and pre-folded calcs render identically in real
  // browsers.
  const bothEndsPx = nodeGap - nodeRadius * 2 - lineInset * 2;
  const bothEnds = `calc(100% ${bothEndsPx < 0 ? "-" : "+"} ${Math.abs(bothEndsPx)}px)`;
  const centerLeftPx = nodeGap - nodeRadius - lineInset;
  const centerLeft = `calc(50% ${centerLeftPx < 0 ? "-" : "+"} ${Math.abs(centerLeftPx)}px)`;
  const centerRightPx = -(nodeRadius + lineInset);
  const centerRight = `calc(50% ${centerRightPx < 0 ? "-" : "+"} ${Math.abs(centerRightPx)}px)`;
  return stepMeta.value.map((meta, idx) => {
    // Connector geometry. Each gap between two nodes is drawn so the line
    // runs from one node's far edge to the other node's near edge
    // (edge-to-edge for "progress"), or stops `lineInset` short of each
    // circle ("line") — never entering a circle, solid or transparent. A
    // single-span gap (left/right align) insets BOTH ends; the split-span
    // gap (center) insets one end per span. The left span (this cell) joins
    // THIS step to the previous one; the right span (this cell) joins it to
    // the next.
    let leftStyle: ConnectorStyle | null = null;
    let rightStyle: ConnectorStyle | null = null;
    if (props.connector !== "none") {
      if (props.connectorAlign === "left") {
        // Node at the cell's left edge: one right span per cell runs from
        // this node's right edge across the gap to the next node's left edge.
        if (idx < stepMeta.value.length - 1) {
          rightStyle = {
            right: `${lineInset - nodeGap}px`,
            width: bothEnds,
          };
        }
      } else if (props.connectorAlign === "right") {
        // Node at the cell's right edge: one left span per cell starts one
        // gap before the cell (= previous node's right edge) and runs to
        // this node's left edge.
        if (idx > 0) {
          leftStyle = {
            left: `${lineInset - nodeGap}px`,
            width: bothEnds,
          };
        }
      } else {
        // Centered node: the gap splits at the cell boundary — this cell's
        // right span covers node→cell edge (inset on the node side), the
        // next cell's left span covers cell edge→node (inset on its node
        // side). The two spans meet at a point, so their junction-side
        // corners are squared — a rounded-full cap on each would pinch the
        // line into a visible notch. The node-side corners stay rounded.
        // Both spans are always the same color (both key off the left
        // step's completion), so the square-to-square meeting reads as one
        // continuous line.
        if (idx > 0) {
          leftStyle = {
            left: `-${nodeGap}px`,
            width: centerLeft,
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          };
        }
        if (idx < stepMeta.value.length - 1) {
          rightStyle = {
            right: "0px",
            width: centerRight,
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
          };
        }
      }
    }
    const previousStep = stepMeta.value[idx - 1];

    return {
      meta,
      leftStyle,
      rightStyle,
      previousCompleted: previousStep?.isCompleted ?? false,
      currentCompleted: meta.isCompleted,
    };
  });
});

// ── Handlers ────────────────────────────────────────────────────────────────

const handleStepClick = (step: StepperStep, index: number) => {
  if (!clickable.value || step.disabled) return;
  state.goToIndex(index);
  emit("stepClick", step, index);
};

const handleNodeKeyDown = (event: KeyboardEvent, index: number) => {
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
  const enabled = props.steps
    .map((_, i) => i)
    .filter((i) => !props.steps[i].disabled);
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
  nodeRefs[enabled[next]]?.focus();
};

const nodeAttrs = (meta: StepMeta) => {
  const isDisabled = Boolean(meta.step.disabled);
  const isButton = clickable.value && !isDisabled;
  return {
    isButton,
    classes: classNames(
      "relative z-10 flex items-center justify-center border font-semibold",
      nodeCornerClass.value,
      tokens.value.node,
      tokens.value.nodeText,
      nodeTransition.value,
      isDisabled && "opacity-60",
      meta.statusClasses,
      isButton && meta.hoverClass,
      isButton && trigger.value.focusRing,
    ),
  };
};

// Typed so the template's dynamic `<component :is>` (button | div) does not
// widen the ref/event parameters to implicit `any`.
const nodeRefFor = (index: number) => {
  return (el: Element | ComponentPublicInstance | null) =>
    setNodeRef(el, index);
};
// Direct function reference (not a per-item closure factory): the template
// compiler wraps `@keydown="onNodeKeydown(meta, idx)"` as a fire-and-forget
// statement and silently drops the returned handler, so the index is read
// from a data attribute on the focused node instead.
const onNodeKeydown = (event: KeyboardEvent) => {
  const raw = (event.currentTarget as HTMLElement | null)?.dataset.stepIndex;
  const index = raw === undefined ? -1 : Number(raw);
  if (!Number.isInteger(index) || index < 0 || index >= props.steps.length) {
    return;
  }
  if (!clickable.value || props.steps[index].disabled) return;
  handleNodeKeyDown(event, index);
};

const gridColumns = computed(() => Math.max(1, props.steps.length));

// ── Panel bindings ──────────────────────────────────────────────────────────

const isSkeletonLoading = computed(
  () => props.loading && props.loaderType === "skeleton",
);

// The per-step node overlay variant. "skeleton" loads the content, not the
// node, so it shows no overlay. Kept in the script (not the template) so the
// `StepperLoaderType` → `LoaderVariant` narrowing stays type-safe.
const nodeOverlayVariant = computed(() =>
  props.loaderType === "skeleton" ? undefined : props.loaderType,
);

// Whole-stepper skeleton: pulsing discs + ONE connector segment per gap that
// stops 8px short of each disc (like the "line" connector), so the line never
// runs into the translucent discs. Thickness matches the live connector.
const skeletonDiscClass = computed(() =>
  classNames(
    "relative z-10 shrink-0 rounded-full bg-black/10 dark:bg-white/10 animate-pulse motion-reduce:animate-none",
    tokens.value.node,
  ),
);
const skeletonBarHorizontalClass = computed(() =>
  classNames(
    "mx-2 flex-1 rounded-full bg-black/10 dark:bg-white/10 animate-pulse motion-reduce:animate-none",
    tokens.value.connector,
  ),
);
const skeletonBarVerticalClass = computed(() =>
  classNames(
    "my-2 min-h-6 flex-1 rounded-full bg-black/10 dark:bg-white/10 animate-pulse motion-reduce:animate-none",
    tokens.value.connectorVertical,
  ),
);

const panelBindings = computed(() => {
  const {
    steps: _steps,
    currentIndex: _ci,
    currentStepId: _csid,
    defaultCurrentIndex: _dci,
    defaultCurrentStepId: _dcsid,
    completedStepIds: _completed,
    orientation: _orientation,
    size: _size,
    connector: _connector,
    interactive: _interactive,
    animated: _animated,
    showProgressSummary: _sps,
    showProgressBar: _spb,
    progressBarPosition: _pbp,
    progressPrecision: _pp,
    progressLabel: _pl,
    renderActions: _ra,
    loaderStepIds: _lsi,
    headerClassName: _hc,
    stepClassName: _sc,
    contentClassName: _cc,
    stepMaxHeight: _smh,
    connectNodes: _cn,
    connectorAlign: _ca,
    showStepUnderline: _ssu,
    variant,
    tone,
    padding,
    corner,
    disabled,
    // "skeleton" is the Stepper's own placeholder, not a Panel loader — coerce
    // it before the Panel sees it (its `loaderType` scale stops at "progress").
    loading: _loading,
    loaderType: _loaderType,
    ...panelProps
  } = props;
  const definedPanelProps = Object.fromEntries(
    Object.entries(panelProps).filter(([, value]) => value !== undefined),
  );
  return {
    class: classNames("w-full", classAttr.value),
    variant,
    tone,
    padding,
    corner,
    disabled,
    scrollable: false,
    ...definedPanelProps,
    loaderType: _loaderType === "skeleton" ? "spinner" : _loaderType,
    loading: _loading && !isSkeletonLoading.value,
    ...restAttrs.value,
  };
});
</script>

<template>
  <Panel v-bind="panelBindings">
    <!-- Empty state: the workflow has nothing to show yet. -->
    <div v-if="steps.length === 0" class="flex flex-col">
      <EmptyState
        variant="plain"
        :dashed="false"
        icon="ViewRows"
        title="No steps"
        subtitle="Add steps to show the workflow."
        :tone="tone"
        :size="size"
      />
    </div>
    <!-- Skeleton: the whole stepper is loading with `loaderType="skeleton"`. -->
    <div
      v-else-if="isSkeletonLoading"
      class="flex w-full"
      :class="horizontal ? 'flex-col gap-6' : 'gap-4'"
      aria-hidden="true"
    >
      <template v-if="horizontal">
        <div class="flex w-full items-center">
          <template v-for="i in steps.length" :key="i">
            <div :class="skeletonDiscClass"></div>
            <div
              v-if="i < steps.length"
              :class="skeletonBarHorizontalClass"
            ></div>
          </template>
        </div>
        <div
          class="rounded-xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/5 sm:p-5"
        >
          <div
            class="flex animate-pulse flex-col gap-2 motion-reduce:animate-none"
          >
            <span class="h-3 w-2/3 rounded-full bg-black/10 dark:bg-white/10"></span>
            <span class="h-2.5 w-full rounded-full bg-black/10 dark:bg-white/10"></span>
            <span class="h-2.5 w-5/6 rounded-full bg-black/10 dark:bg-white/10"></span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col items-center py-1">
          <template v-for="i in steps.length" :key="i">
            <div :class="skeletonDiscClass"></div>
            <div
              v-if="i < steps.length"
              :class="skeletonBarVerticalClass"
            ></div>
          </template>
        </div>
        <div
          class="flex-1 rounded-xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/5 sm:p-5"
        >
          <div
            class="flex animate-pulse flex-col gap-2 motion-reduce:animate-none"
          >
            <span class="h-3 w-2/3 rounded-full bg-black/10 dark:bg-white/10"></span>
            <span class="h-2.5 w-full rounded-full bg-black/10 dark:bg-white/10"></span>
            <span class="h-2.5 w-5/6 rounded-full bg-black/10 dark:bg-white/10"></span>
          </div>
        </div>
      </template>
    </div>
    <div
      v-else
      class="flex w-full flex-col"
      :class="horizontal ? 'gap-6' : 'gap-4'"
    >
      <!-- Progress block. Positioned above or below the steps with `order` so
           the markup is written once. -->
      <div
        v-if="showProgressBar || showProgressSummary"
        class="flex w-full flex-col gap-2"
        :class="progressBarPosition === 'bottom' && 'mt-6'"
        :style="{ order: progressBarPosition === 'top' ? 0 : 1 }"
      >
        <div
          v-if="showProgressSummary"
          :class="classNames('flex items-center justify-between text-sm font-medium', surface.muted)"
        >
          <span :id="progressLabelId">
            <VNodeRenderer :nodes="progressLabel ?? 'Progress'" />
          </span>
          <span>{{ formattedProgress }}%</span>
        </div>
        <div
          v-if="showProgressBar"
          role="progressbar"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="formattedProgress"
          :aria-labelledby="showProgressSummary ? progressLabelId : undefined"
          :aria-label="showProgressSummary ? undefined : 'Progress'"
          :class="
            classNames('relative h-1 w-full overflow-hidden rounded-full', progressColors.track)
          "
        >
          <div
            :class="
              classNames('absolute inset-y-0 left-0 rounded-full', fillTransition, progressColors.bar)
            "
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
      </div>

      <!-- ── Horizontal ──────────────────────────────────────────────────── -->
      <div
        v-if="horizontal"
        :class="classNames('relative flex flex-col', headerClassName)"
        :style="{ order: progressBarPosition === 'top' ? 1 : 0 }"
      >
        <!-- Node row -->
        <div
          :class="
            classNames('flex items-center', connectNodes ? 'gap-0' : 'gap-2')
          "
        >
          <div
            v-for="(item, idx) in nodeRowItems"
            :key="`${item.meta.resolvedId}-node`"
            :class="
              classNames(
                'relative flex flex-1',
                connectorAlign === 'left'
                  ? 'items-center'
                  : connectorAlign === 'right'
                    ? 'items-center justify-end'
                    : 'items-center justify-center',
              )
            "
          >
            <span
              v-if="item.leftStyle"
              :class="
                classNames(
                  'pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full',
                  tokens.connector,
                  lineTransition,
                  connector === 'progress' && item.previousCompleted
                    ? palette.activeBg
                    : palette.underlineBase,
                )
              "
              :style="item.leftStyle"
              aria-hidden="true"
            />
            <component
              :is="nodeAttrs(item.meta).isButton ? 'button' : 'div'"
              :type="nodeAttrs(item.meta).isButton ? 'button' : undefined"
              :class="nodeAttrs(item.meta).classes"
              :ref="nodeRefFor(idx)"
              :data-step-index="idx"
              :aria-current="
                state.isActive(item.meta.resolvedId, idx) ? 'step' : undefined
              "
              :aria-label="
                typeof item.meta.step.title === 'string'
                  ? item.meta.step.title
                  : undefined
              "
              @click="handleStepClick(item.meta.step, idx)"
              @keydown="onNodeKeydown"
            >
              <VNodeRenderer
                v-if="item.meta.nodeIcon"
                :nodes="renderIcon(item.meta.nodeIcon, tokens.icon)"
              />
              <template v-else>{{ idx + 1 }}</template>
              <Loader
                v-if="item.meta.isLoadingStep && nodeOverlayVariant"
                overlay
                :variant="nodeOverlayVariant"
                size="sm"
                class="rounded-full"
                :title="null"
                :label="null"
              />
            </component>
            <span
              v-if="item.rightStyle"
              :class="
                classNames(
                  'pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full',
                  tokens.connector,
                  lineTransition,
                  connector === 'progress' && item.currentCompleted
                    ? palette.activeBg
                    : palette.underlineBase,
                )
              "
              :style="item.rightStyle"
              aria-hidden="true"
            />
          </div>
        </div>

        <!-- Body grid -->
        <div
          class="mt-4 grid items-stretch gap-2"
          :style="{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          }"
        >
          <div
            v-for="meta in stepMeta"
            :key="`${meta.resolvedId}-body`"
            :class="
              classNames(
                'flex h-full flex-col justify-between rounded-xl px-2 text-left',
                clickable &&
                  !meta.step.disabled &&
                  classNames(
                    'cursor-pointer',
                    animated &&
                      'transition-colors duration-150 motion-reduce:transition-none',
                    trigger.hover,
                  ),
                meta.step.disabled && 'opacity-60',
                stepClassName,
              )
            "
            @click="handleStepClick(meta.step, meta.index)"
            :aria-current="
              state.isActive(meta.resolvedId, meta.index) ? 'step' : undefined
            "
          >
            <div
              class="flex min-w-0 flex-col gap-1 overflow-hidden break-words"
              :style="meta.textStyle"
            >
              <div :class="classNames(tokens.title, surface.heading)">
                <VNodeRenderer :nodes="meta.step.title" />
              </div>
              <div
                v-if="meta.step.subtitle"
                :class="classNames(tokens.subtitle, surface.muted)"
              >
                <VNodeRenderer :nodes="meta.step.subtitle" />
              </div>
              <div
                v-if="meta.step.description"
                :class="classNames(tokens.description, surface.description)"
              >
                <VNodeRenderer :nodes="meta.step.description" />
              </div>
            </div>
            <div class="mt-3 flex flex-col gap-1">
              <div
                v-if="meta.step.optionalLabel"
                :class="classNames(tokens.optional, surface.muted)"
              >
                <VNodeRenderer :nodes="meta.step.optionalLabel" />
              </div>
              <div
                v-if="meta.actions"
                class="flex flex-wrap items-center gap-1.5"
                @click.stop
                @keydown.stop
              >
                <VNodeRenderer :nodes="meta.actions" />
              </div>
              <div
                v-if="connector !== 'none' && showStepUnderline"
                :class="meta.underlineClasses"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ── Vertical ────────────────────────────────────────────────────── -->
      <div
        v-else
        ref="verticalContainerRef"
        :class="classNames('relative flex flex-col', headerClassName)"
        :style="{ order: progressBarPosition === 'top' ? 1 : 0 }"
      >
        <div
          v-for="(meta, index) in stepMeta"
          :key="meta.resolvedId"
          :class="
            classNames(
              'relative flex items-start gap-4 py-4',
              index === 0 && 'pt-0',
              index === stepMeta.length - 1 && 'pb-0',
              stepClassName,
            )
          "
        >
          <div class="relative flex flex-col items-center">
            <component
              :is="nodeAttrs(meta).isButton ? 'button' : 'div'"
              :type="nodeAttrs(meta).isButton ? 'button' : undefined"
              :class="nodeAttrs(meta).classes"
              :ref="nodeRefFor(index)"
              :data-step-index="index"
              :aria-current="
                state.isActive(meta.resolvedId, index) ? 'step' : undefined
              "
              :aria-label="
                typeof meta.step.title === 'string'
                  ? meta.step.title
                  : undefined
              "
              @click="handleStepClick(meta.step, index)"
              @keydown="onNodeKeydown"
            >
              <VNodeRenderer
                v-if="meta.nodeIcon"
                :nodes="renderIcon(meta.nodeIcon, tokens.icon)"
              />
              <template v-else>{{ index + 1 }}</template>
              <!-- "skeleton" loads the content, not the node — the node stays put. -->
              <Loader
                v-if="meta.isLoadingStep && nodeOverlayVariant"
                overlay
                :variant="nodeOverlayVariant"
                size="sm"
                class="rounded-full"
                :title="null"
                :label="null"
              />
            </component>
            <span
              v-if="
                connector !== 'none' &&
                index < stepMeta.length - 1 &&
                (verticalSegments[index] ?? 0) > 0
              "
              :class="
                classNames(
                  'pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full',
                  tokens.connectorVertical,
                  lineTransition,
                  connector === 'progress' && meta.isCompleted
                    ? palette.activeBg
                    : palette.underlineBase,
                )
              "
              :style="{
                // The measured segment is center-to-center; the line runs
                // from this node's bottom edge to the next node's top edge
                // (edge-to-edge for progress), or 8px short of each circle
                // (line) — never entering a circle.
                top: `${tokens.nodeRadius * 2 + (connector === 'line' ? 8 : 0)}px`,
                height: `${Math.max(
                  0,
                  (verticalSegments[index] ?? 0) - tokens.nodeRadius * 2 -
                    (connector === 'line' ? 16 : 0),
                )}px`,
              }"
              aria-hidden="true"
            />
          </div>
          <div
            :class="
              classNames(
                'flex min-w-0 flex-1 flex-col gap-0.5 text-left',
                clickable && !meta.step.disabled && 'cursor-pointer',
                meta.step.disabled && 'opacity-60',
              )
            "
            @click="handleStepClick(meta.step, index)"
          >
            <div
              :class="classNames(tokens.title, surface.heading)"
              :style="meta.textStyle"
            >
              <VNodeRenderer :nodes="meta.step.title" />
            </div>
            <div
              v-if="meta.step.subtitle"
              :class="classNames(tokens.subtitle, surface.muted)"
            >
              <VNodeRenderer :nodes="meta.step.subtitle" />
            </div>
            <div
              v-if="meta.step.description"
              :class="classNames(tokens.description, surface.description)"
            >
              <VNodeRenderer :nodes="meta.step.description" />
            </div>
            <div
              v-if="meta.step.optionalLabel"
              :class="classNames(tokens.optional, surface.muted)"
            >
              <VNodeRenderer :nodes="meta.step.optionalLabel" />
            </div>
            <div
              v-if="connector !== 'none' && showStepUnderline"
              :class="meta.underlineClasses"
            />
            <div
              v-if="meta.actions"
              class="mt-2 flex flex-wrap items-center gap-1.5"
              @click.stop
              @keydown.stop
            >
              <VNodeRenderer :nodes="meta.actions" />
            </div>
          </div>
        </div>
      </div>

      <!-- ── Content ─────────────────────────────────────────────────────── -->
      <div
        :class="
          classNames('rounded-xl p-4 sm:p-5', contentRegionClass, contentClassName)
        "
        style="order: 2"
      >
        <div
          v-if="activeStepLoading"
          class="flex animate-pulse flex-col gap-2 motion-reduce:animate-none"
          aria-hidden="true"
        >
          <span class="h-3 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
          <span class="h-2.5 w-full rounded-full bg-black/10 dark:bg-white/10" />
          <span class="h-2.5 w-5/6 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <VNodeRenderer
          v-else-if="activeStep?.content != null"
          :nodes="activeStep.content"
        />
        <div
          v-else
          :class="classNames('space-y-2 text-sm', surface.body)"
        >
          <VNodeRenderer :nodes="activeStep?.description" />
        </div>
      </div>
    </div>
  </Panel>
</template>
