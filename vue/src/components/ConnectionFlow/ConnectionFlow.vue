<script lang="ts">
import {
  CONNECTION_FLOW_EDGE_STYLES,
  CONNECTION_FLOW_PROGRESS_TYPES,
  CONNECTION_FLOW_ITEM_PROGRESS,
  CONNECTION_FLOW_RING_SIZES,
  CONNECTION_STATES,
  type ConnectionFlowEdgeStyle,
  type ConnectionFlowItemProgress,
  type ConnectionFlowLoader,
  type ConnectionFlowNode,
  type ConnectionFlowProgressType,
  type ConnectionFlowRingSize,
  type ConnectionState,
} from "../../connectionFlow";
import type {
  ControlSize,
  PlainSurfaceVariant,
  SurfaceCorner,
  SurfaceVariant,
  TrueColor,
} from "../../theme/Theme";
import type { PillVariant } from "../Pill.vue";

export {
  CONNECTION_FLOW_EDGE_STYLES,
  CONNECTION_FLOW_ITEM_PROGRESS,
  CONNECTION_FLOW_PROGRESS_TYPES,
  CONNECTION_FLOW_RING_SIZES,
  CONNECTION_STATES,
};

export interface ConnectionFlowProps {
  /** The graph. */
  nodes: ConnectionFlowNode[];
  /** Surface treatment of the frame. @default "outlined" */
  variant?: PlainSurfaceVariant;
  /** @default "neutral" */
  tone?: TrueColor;
  /** Node box scale, on the shared control scale. @default "md" */
  size?: ControlSize;
  /** Node corner radius, on the shared container scale. */
  corner?: SurfaceCorner;
  /** Shape of the edges. @default "orthogonal" */
  edgeStyle?: ConnectionFlowEdgeStyle;
  /**
   * Surface treatment for the node cards, on the same container scale `Panel`
   * takes. A node's own `variant` overrides it. @default "subtle"
   */
  /**
   * Rows a card shows before the rest collapse behind a "show more" row.
   * A node's own `maxItems` overrides it. @default 2
   */
  maxVisibleItems?: number;
  /**
   * Where an item draws its progress: a bar under its text, or a spinner in
   * place of its glyph. A node's `itemProgress`, then an item's
   * `progressType`, override it. @default "bar"
   */
  itemProgress?: ConnectionFlowItemProgress;
  /**
   * Size of the ring drawn where an edge meets a node. `fit` collapses the
   * ring onto its core dot. @default "md"
   */
  ringSize?: ConnectionFlowRingSize;
  /** Fallback state for edges that do not declare one. @default "flowing" */
  flowState?: ConnectionState;
  /** Derive edge state and bypasses from each node's tone. @default false */
  autoState?: boolean;
  /** @default true */
  animated?: boolean;
  /** Target px between travelling dots. @default 40 */
  /**
   * How fast a travelling dot moves, in px per second. One speed for the whole
   * graph: a dot's flight time comes from its route's own length, so a short
   * hop and a long bypass arc move at the same pace. @default 120
   */
  dotSpeed?: number;
  /**
   * Milliseconds between one dot leaving a source and the next. A source
   * releases one dot at a time, taking its outgoing edges in turn, so a fan
   * reads as one source feeding its targets rather than as a swarm.
   * @default 700
   */
  dotInterval?: number;
  /** Which in-progress indicator nodes draw. Only one is ever shown. @default "bar" */
  progressType?: ConnectionFlowProgressType;
  /** Dim everything that is not on the path to the hovered node. @default true */
  highlightPath?: boolean;
  /** Show the zoom / fit toolbar. @default true */
  showControls?: boolean;
  /** Scale the graph to fit on mount and on resize. @default true */
  fitOnLoad?: boolean;
  /**
   * Scale the graph to fit on first paint instead of opening at 100%.
   *
   * The viewport scrolls, so a graph larger than its frame is reachable
   * without shrinking it to illegibility — which is what fitting a tall flow
   * into a short frame does. @default false
   */
  /** Allow scroll-wheel and drag panning. @default true */
  interactive?: boolean;
  minZoom?: number;
  maxZoom?: number;
  /** Fixed height of the viewport. @default 320 */
  height?: number | string;
  /** Header title. Rendered by the flow, not by the wrapping Panel. */
  title?: string;
  subtitle?: string;
  /** Small uppercase line above the title. */
  eyebrow?: string;
  /** Registry icon name for the chip beside the title. */
  icon?: string;
  /** Corner of that chip, on the shared container scale. */
  iconCorner?: SurfaceCorner;
  /** Pill at the right of the header. */
  tag?: string;
  tagTone?: TrueColor;
  tagVariant?: PillVariant;
  /** Draw the header at all. @default true */
  showHeader?: boolean;
  /**
   * The flow's completion, 0–1. Defaults to the mean of whatever the nodes
   * report — which a pipeline usually knows better than the average of its
   * cards does.
   */
  progress?: number;
  /**
   * How `loading` is shown. `skeleton` is the default because it is the only
   * one that holds the card's shape. @default "skeleton"
   */
  loaderType?: ConnectionFlowLoader;
  loading?: boolean;
  /** Message shown when `nodes` is empty. */
  emptyMessage?: string;
}
</script>

<script setup lang="ts">
import {
  computed,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import classNames from "classnames";
import Panel from "../Panel.vue";
import IconButton from "../IconButton.vue";
import EmptyState from "../EmptyState.vue";
import Progress from "../Progress.vue";
import ProgressSpinner from "../ProgressSpinner.vue";
import ConnectionFlowSvg from "./ConnectionFlowSvg.vue";
import ConnectionFlowHeader from "./ConnectionFlowHeader.vue";
import ConnectionFlowSkeleton from "./ConnectionFlowSkeleton.vue";
import {
  DEFAULT_LAYOUT_OPTIONS,
  NODE_CORNER_RADIUS,
  NODE_METRICS,
  fitToViewport,
  flowProgress,
  getHeaderSurface,
  layoutConnectionFlow,
  tracePathTo,
  type LaidOutNode,
} from "../../connectionFlow";
import { DEFAULT_SURFACE_CORNER } from "../../theme/Theme";
import { useClassAttrs } from "../../utils/attrsUtils";

defineOptions({ name: "ConnectionFlow", inheritAttrs: false });

const props = withDefaults(defineProps<ConnectionFlowProps>(), {
  variant: "outlined",
  tone: "neutral",
  size: "md",
  corner: DEFAULT_SURFACE_CORNER,
  edgeStyle: "orthogonal",
  iconCorner: "rounded-md",
  tagVariant: "soft",
  showHeader: true,
  loaderType: "skeleton",
  maxVisibleItems: 2,
  itemProgress: "bar",
  ringSize: "md",
  flowState: "flowing",
  autoState: false,
  animated: true,
  dotSpeed: 120,
  dotInterval: 700,
  progressType: "bar",
  highlightPath: true,
  showControls: true,
  fitOnLoad: false,
  interactive: true,
  minZoom: 0.25,
  maxZoom: 2,
  height: 320,
  loading: false,
});

const emit = defineEmits<{
  nodeClick: [node: ConnectionFlowNode];
  nodeHover: [node: ConnectionFlowNode | null];
  zoomChange: [scale: number];
}>();

const { classAttr, restAttrs } = useClassAttrs();

const viewportRef = ref<HTMLDivElement | null>(null);
const viewport = ref({ width: 0, height: 0 });

const hoveredId = ref<string | null>(null);
const selectedId = ref<string | null>(null);

const scale = ref(1);

const metrics = computed(() => NODE_METRICS[props.size] ?? NODE_METRICS.md);
const radius = computed(
  () => NODE_CORNER_RADIUS[props.corner] ?? NODE_CORNER_RADIUS["rounded-md"],
);

const layoutOptions = computed(() => ({
  ...DEFAULT_LAYOUT_OPTIONS,
  metrics: metrics.value,
  edgeStyle: props.edgeStyle,
  ringSize: props.ringSize,
  maxVisibleItems: props.maxVisibleItems,
  itemProgress: props.itemProgress,
  // The card silhouette is geometry, so the corner radius belongs to the
  // layout rather than to the renderer that draws it.
  nodeCornerRadius: radius.value,
}));

/**
 * Nodes whose item list is expanded. Held here rather than in the renderer
 * because expanding changes a card's height, and so its ports, its silhouette
 * and every route touching it.
 */
const expanded = ref<ReadonlySet<string>>(new Set<string>());

const onToggleExpanded = (id: string) => {
  const next = new Set(expanded.value);
  if (!next.delete(id)) next.add(id);
  expanded.value = next;
};

const layout = computed(() =>
  layoutConnectionFlow({
    nodes: props.nodes,
    flowState: props.flowState,
    autoState: props.autoState,
    animated: props.animated,
    expanded: expanded.value,
    options: layoutOptions.value,
  }),
);

// ── Path highlight ─────────────────────────────────────────────────────────
// The lit set is the ancestry of whatever the pointer is on: everything that
// had to happen for that node to be reached. Empty means "no highlight", which
// the renderers read as "draw everything at full opacity" — so the default
// state costs nothing.
const highlight = computed(() => {
  const focus = hoveredId.value ?? selectedId.value;
  if (!props.highlightPath || !focus) {
    return { nodes: new Set<string>(), edges: new Set<string>() };
  }
  return tracePathTo(layout.value, focus);
});

// ── Zoom and pan ───────────────────────────────────────────────────────────
const clampZoom = (value: number) =>
  Math.min(props.maxZoom, Math.max(props.minZoom, value));

/**
 * A scroll position to apply once the canvas has been re-sized for the new
 * scale. Setting `scrollLeft` before the content grows just clamps against the
 * old extent, so the adjustment waits for the next tick.
 */
const applyPendingScroll = (apply: (el: HTMLElement) => void) => {
  nextTick(() => {
    const el = viewportRef.value;
    if (el) apply(el);
  });
};

const setZoom = (value: number, anchor?: { x: number; y: number }) => {
  const next = clampZoom(value);
  if (next === scale.value) return;
  const el = viewportRef.value;
  if (el) {
    // Zoom about a point, so the graph does not slide away from the cursor.
    // The canvas grows by `ratio`, so the distance from the scroll origin to
    // that point grows by the same factor.
    const point = anchor ?? {
      x: el.clientWidth / 2,
      y: el.clientHeight / 2,
    };
    const ratio = next / scale.value;
    const { scrollLeft, scrollTop } = el;
    applyPendingScroll((element) => {
      element.scrollLeft = (scrollLeft + point.x) * ratio - point.x;
      element.scrollTop = (scrollTop + point.y) * ratio - point.y;
    });
  }
  scale.value = next;
  emit("zoomChange", next);
};

const zoomIn = () => setZoom(scale.value * 1.2);
const zoomOut = () => setZoom(scale.value / 1.2);

const fit = () => {
  const el = viewportRef.value;
  if (!el || !el.clientWidth || !el.clientHeight) return;
  scale.value = clampZoom(
    fitToViewport(layout.value, el.clientWidth, el.clientHeight, props.maxZoom)
      .scale,
  );
  // Everything is visible at this scale, so the origin is the right place to
  // be looking.
  applyPendingScroll((element) => {
    element.scrollLeft = 0;
    element.scrollTop = 0;
  });
  emit("zoomChange", scale.value);
};

const onWheel = (event: WheelEvent) => {
  if (!props.interactive) return;
  // A card that scrolls its own body keeps its wheel: without this the canvas
  // zooms and the card can never be scrolled.
  if ((event.target as HTMLElement).closest("[data-scrolls]")) return;
  event.preventDefault();
  const rect = viewportRef.value?.getBoundingClientRect();
  const anchor = rect
    ? { x: event.clientX - rect.left, y: event.clientY - rect.top }
    : undefined;
  setZoom(scale.value * (event.deltaY < 0 ? 1.1 : 1 / 1.1), anchor);
};

// Drag to pan. Pointer capture rather than a document-level listener so the
// gesture survives the pointer leaving the viewport mid-drag.
const panning = ref(false);
let panStart = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };

const onPointerDown = (event: PointerEvent) => {
  if (!props.interactive || event.button !== 0) return;
  // A press that starts on a control belongs to the control. Capturing the
  // pointer here redirects its `pointerup` to the viewport, so the control
  // never sees a click at all — which is why the zoom buttons and "show more"
  // did nothing.
  if (
    (event.target as HTMLElement).closest(
      "button, a, input, select, textarea, [data-no-pan]",
    )
  ) {
    return;
  }
  const el = viewportRef.value;
  if (!el) return;
  panning.value = true;
  panStart = {
    x: event.clientX,
    y: event.clientY,
    scrollLeft: el.scrollLeft,
    scrollTop: el.scrollTop,
  };
  el.setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  if (!panning.value) return;
  const el = viewportRef.value;
  if (!el) return;
  el.scrollLeft = panStart.scrollLeft - (event.clientX - panStart.x);
  el.scrollTop = panStart.scrollTop - (event.clientY - panStart.y);
};

const onPointerUp = (event: PointerEvent) => {
  if (!panning.value) return;
  panning.value = false;
  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
};

// ── Wiring ─────────────────────────────────────────────────────────────────
const onHover = (node: LaidOutNode | null) => {
  hoveredId.value = node?.id ?? null;
  emit("nodeHover", node?.node ?? null);
};

const onSelect = (node: LaidOutNode) => {
  selectedId.value = selectedId.value === node.id ? null : node.id;
  emit("nodeClick", node.node);
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    const box = entries[0]?.contentRect;
    if (!box) return;
    const first = viewport.value.width === 0;
    viewport.value = { width: box.width, height: box.height };
    if (first && props.fitOnLoad) fit();
  });
  if (viewportRef.value) observer.observe(viewportRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

watch(
  () => props.nodes,
  () => {
    if (props.fitOnLoad) fit();
  },
);

// ── Overall progress ───────────────────────────────────────────────────────
// The mean of every node that declares one. Shown on the frame, not per node.
// Stated outright if the caller says so, else the mean of what the nodes
// report — including cards built from items, which have no `progress` of their
// own and used not to count at all.
const overallProgress = computed(() =>
  flowProgress(props.nodes, props.progress),
);

// `plain` draws no Panel, so the cards and the header take the nearest real
// surface rather than inventing a second scale of their own.
const surfaceVariant = computed<SurfaceVariant>(() =>
  props.variant === "plain" ? "simple" : (props.variant as SurfaceVariant),
);
const headerSurface = computed(() => getHeaderSurface(surfaceVariant.value));
const showHeaderBlock = computed(
  () =>
    props.showHeader &&
    Boolean(
      props.eyebrow ||
        props.title ||
        props.subtitle ||
        props.icon ||
        props.tag ||
        props.progressType !== "none",
    ),
);

const isEmpty = computed(() => props.nodes.length === 0);
const isPlain = computed(() => props.variant === "plain");

const frameStyle = computed(() => ({
  height:
    typeof props.height === "number" ? `${props.height}px` : props.height,
}));

const viewportStyle = computed(() => ({
  cursor: panning.value ? "grabbing" : undefined,
}));

/** What the scroll area contains, including anything overhanging the origin. */
const canvasStyle = computed(() => ({
  width: `${(layout.value.width - layout.value.offsetX) * scale.value}px`,
  height: `${(layout.value.height - layout.value.offsetY) * scale.value}px`,
}));

const zoomLabel = computed(() => `${Math.round(scale.value * 100)}%`);

const resetZoom = () => setZoom(1);

/**
 * The registry has no "fit to view" or "minus" glyph. Rather than press a
 * wrong-but-present icon into service — a balance-scale for "fit" and an
 * equals sign for "zoom out" both read as something else entirely — these two
 * are inline paths. `IconButton` takes a node as readily as a name, so the
 * buttons keep the kit's sizing, hover and focus treatment.
 */
const FIT_ICON = h(
  "svg",
  { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" },
  [
    h("path", { d: "M4 9V5a1 1 0 0 1 1-1h4" }),
    h("path", { d: "M15 4h4a1 1 0 0 1 1 1v4" }),
    h("path", { d: "M20 15v4a1 1 0 0 1-1 1h-4" }),
    h("path", { d: "M9 20H5a1 1 0 0 1-1-1v-4" }),
  ],
);

const MINUS_ICON = h(
  "svg",
  { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round" },
  [h("path", { d: "M6 12h12" })],
);

defineExpose({ zoomIn, zoomOut, fit, setZoom });
</script>

<template>
  <component
    :is="isPlain ? 'div' : Panel"
    v-bind="
      isPlain
        ? { class: classNames('w-full', classAttr) }
        : {
            class: classNames('w-full', classAttr),
            variant,
            tone,
            corner,
            padding: 'none',
            // Title, subtitle and loading are drawn by the flow's own header
            // (Panel's carries no icon chip and no progress, and the plain
            // variant renders no Panel at all), and the graph manages its own
            // scrolling — Panel's body scroller would sit outside it and take
            // the gesture first.
            scrollable: false,
          }
    "
    v-bind:="restAttrs"
  >
    <div class="relative w-full">
      <template v-if="showHeaderBlock">
        <div class="px-4 pt-4 pb-3">
          <ConnectionFlowHeader
            :variant="surfaceVariant"
            :tone="tone"
            :eyebrow="eyebrow"
            :title="title"
            :subtitle="subtitle"
            :icon="icon"
            :icon-corner="iconCorner"
            :tag="tag"
            :tag-tone="tagTone"
            :tag-variant="tagVariant"
            :progress="overallProgress"
            :progress-type="progressType"
            :animated="animated"
            :loading="loading"
          />
        </div>
        <div class="border-b" :class="headerSurface.divider" />
      </template>

      <!-- The graph frame, or whichever loader is standing in for it. -->
      <div
        v-if="loading && loaderType !== 'skeleton'"
        class="flex w-full items-center justify-center"
        :style="frameStyle"
      >
        <ProgressSpinner
          v-if="loaderType === 'spinner'"
          size="xl"
          :color="tone === 'neutral' ? 'blue' : tone"
          aria-label="Loading flow"
        />
        <div v-else class="w-1/2 max-w-sm">
          <Progress
            size="sm"
            :color="tone === 'neutral' ? 'blue' : tone"
            indeterminate
            label="Loading flow"
          />
        </div>
      </div>

      <div
        v-else-if="loading"
        class="w-full overflow-hidden"
        :style="frameStyle"
      >
        <ConnectionFlowSkeleton :variant="surfaceVariant" :metrics="metrics" />
      </div>

      <EmptyState
        v-else-if="isEmpty"
        variant="plain"
        size="sm"
        icon="ViewGrid"
        :title="emptyMessage ?? 'Nothing to show'"
        subtitle="No steps have been reported for this flow."
      />

      <div v-else class="relative w-full" :style="frameStyle">
      <div
        ref="viewportRef"
        class="h-full w-full select-none overflow-auto overscroll-contain [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent"
        :style="viewportStyle"
        @wheel="onWheel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <!-- Sized to the content so the viewport can scroll to it natively.
             The renderers draw into this, not into the viewport. -->
        <div class="relative" :style="canvasStyle">
        <ConnectionFlowSvg
          :layout="layout"
          :dot-speed="dotSpeed"
          :dot-interval="dotInterval"
          :metrics="metrics"
          :options="layoutOptions"
          :expanded="expanded"
          @toggle-expanded="onToggleExpanded"
          :variant="surfaceVariant"
          :show-progress="progressType !== 'none'"
          :animated="animated"
          :highlight-nodes="highlight.nodes"
          :highlight-edges="highlight.edges"
          :hovered-id="hoveredId"
          :selected-id="selectedId"
          :scale="scale"
          :offset-x="-layout.offsetX * scale"
          :offset-y="-layout.offsetY * scale"
          @hover="onHover"
          @select="onSelect"
        >
          <template v-if="$slots.node" #node="slotProps">
            <slot name="node" v-bind="slotProps" />
          </template>
        </ConnectionFlowSvg>
        </div>
      </div>

        <!-- Zoom controls, bottom-right, matching the placement GitHub Actions
             uses for the same job. The registry has no "fit" or "minus" glyph,
             so those two are inline paths handed to `IconButton` — the button
             keeps the kit's sizing, hover and focus ring either way, which a
             hand-rolled <button> would not. -->
        <div
          v-if="showControls"
          data-no-pan
          class="absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90"
        >
          <IconButton
            :icon="FIT_ICON"
            size="xs"
            variant="ghost"
            color="slate"
            sr-label="Fit to view"
            tooltip="Fit to view"
            @click="fit"
          />
          <IconButton
            :icon="MINUS_ICON"
            size="xs"
            variant="ghost"
            color="slate"
            sr-label="Zoom out"
            tooltip="Zoom out"
            :disabled="scale <= minZoom"
            @click="zoomOut"
          />
          <!-- A readout, not a control. The reset it used to carry was
               invisible — nothing about a percentage says "click me" — so it
               is a button of its own now. -->
          <span
            class="min-w-[3.5ch] px-1 text-center text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
            title="Zoom level"
          >
            {{ zoomLabel }}
          </span>
          <IconButton
            icon="Add"
            size="xs"
            variant="ghost"
            color="slate"
            sr-label="Zoom in"
            tooltip="Zoom in"
            :disabled="scale >= maxZoom"
            @click="zoomIn"
          />
          <IconButton
            icon="Reset"
            size="xs"
            variant="ghost"
            color="slate"
            sr-label="Reset zoom to 100%"
            tooltip="Reset zoom"
            :disabled="scale === 1"
            @click="resetZoom"
          />
        </div>
      </div>
    </div>
  </component>
</template>
