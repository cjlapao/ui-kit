<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import ConnectionFlowNodeBody from "./ConnectionFlowNodeBody.vue";
import {
  connectorVisual,
  dotTiming,
  getNodeSurface,
  getToneClasses,
  labelAnchor,
  routeLength,
} from "../../connectionFlow";
import type {
  ConnectionFlowLayout,
  LaidOutConnector,
  LaidOutEdge,
  ConnectionFlowLayoutOptions,
  LaidOutNode,
  NodeMetrics,
} from "../../connectionFlow";
import type { SurfaceVariant } from "../../theme/Theme";

const props = defineProps<{
  layout: ConnectionFlowLayout;
  /** Px per second every dot travels at. */
  dotSpeed: number;
  /** Milliseconds between one dot leaving a source and the next. */
  dotInterval: number;
  /** Every number the card body is built from. */
  metrics: NodeMetrics;
  /** The resolved layout options, for the item cap. */
  options: ConnectionFlowLayoutOptions;
  /** Nodes whose item list is expanded. */
  expanded: ReadonlySet<string>;
  /**
   * The surface the cards take. Resolved from the flow's own `variant` — a
   * card sitting inside a panel is part of that panel, not a second surface
   * language layered on top of it.
   */
  variant: SurfaceVariant;
  showProgress: boolean;
  animated: boolean;
  highlightNodes: Set<string>;
  highlightEdges: Set<string>;
  hoveredId: string | null;
  selectedId: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
}>();

const emit = defineEmits<{
  hover: [node: LaidOutNode | null];
  select: [node: LaidOutNode];
  toggleExpanded: [id: string];
}>();

/**
 * Dimming is by opacity so the tone classes stay untouched. The dimmed edges
 * go in a group of their own rather than carrying the opacity each: a fan's
 * lines overlap on the run they share, and six translucent strokes laid over
 * each other composite back to nearly opaque — so the "dimmed" spine came out
 * barely darker than a lit one. One group, one opacity, and it also puts the
 * dimmed edges behind the lit ones where they belong.
 */
const isLit = (edge: LaidOutEdge) =>
  props.highlightEdges.size === 0 || props.highlightEdges.has(edge.id);

const edgeLayers = computed(() =>
  [false, true].map((lit) => ({
    lit,
    edges: props.layout.edges.filter((edge) => isLit(edge) === lit),
  })),
);

const nodeOpacity = (node: LaidOutNode) =>
  props.highlightNodes.size === 0 || props.highlightNodes.has(node.id)
    ? 1
    : 0.22;

/**
 * A terminal is lit when any edge meeting it is, so a connector never
 * outshines the line it belongs to. `state` dims on top of that, which is how
 * a not-yet-reached port reads as pending without a second shade table.
 */
const connectorOpacity = (connector: LaidOutConnector) =>
  props.highlightEdges.size === 0 ||
  connector.edgeIds.some((id) => props.highlightEdges.has(id))
    ? 1
    : 0.22;

/** Resolved once per connector rather than once per attribute binding. */
const connectorViews = computed(() =>
  props.layout.connectors.map((connector) => {
    const visual = connectorVisual(connector);
    return {
      connector,
      dotRadius: visual.dotRadius,
      dotClass: visual.dotClass,
      opacity: connectorOpacity(connector) * visual.opacity,
    };
  }),
);

/** Likewise for the cards: one class string per node, not one per binding. */
const nodeShapes = computed(() =>
  props.layout.nodes.map((laid) => {
    const tone = getToneClasses(laid.tone);
    const surface = getNodeSurface(laid.tone, props.variant);
    const selected = props.selectedId === laid.id;
    return {
      laid,
      class: [
        surface.fill,
        surface.effect,
        // A selected card takes the tone at full strength whatever its
        // variant, so the selection reads on `tonal` and `simple` too — they
        // carry no rim of their own.
        selected ? tone.shapeStrokeSelected : surface.stroke,
      ],
      strokeWidth: selected ? 2 : props.hoveredId === laid.id ? 1.5 : 1,
      opacity: nodeOpacity(laid),
    };
  }),
);

/**
 * One travelling dot per edge, released on its turn in its source's
 * round-robin and moving at the graph's single speed. Returns `null` when the
 * edge carries no dot, so the template can skip it.
 */
const edgeDot = (edge: LaidOutEdge) => {
  if (!props.animated || !edge.animated) return null;
  const timing = dotTiming(
    routeLength(edge.points),
    edge.emitIndex,
    edge.emitCount,
    edge.emitSpan,
    props.dotSpeed,
    props.dotInterval / 1000,
  );
  return {
    dur: `${timing.cycle.toFixed(3)}s`,
    begin: `${timing.begin.toFixed(3)}s`,
    keyTimes: `0;${timing.arrival.toFixed(4)};1`,
    opacityKeyTimes: `0;${timing.arrival.toFixed(4)}`,
  };
};

/**
 * Edge labels sit on the middle of the route's longest straight run. Halfway
 * along the route lands wherever the arithmetic puts it — on a corner, or hard
 * against a card — because a route's midpoint has nothing to do with where
 * there is room to write.
 */
const labelPoint = (edge: LaidOutEdge) => labelAnchor(edge.points);

const transform = computed(
  () => `translate(${props.offsetX}, ${props.offsetY}) scale(${props.scale})`,
);

const nodeClasses = (laid: LaidOutNode) =>
  classNames(
    "pointer-events-auto absolute overflow-hidden outline-none",
    laid.node.disabled ? "cursor-default" : "cursor-pointer",
  );
</script>

<template>
  <div class="relative h-full w-full overflow-hidden">
    <!-- Edges. Behind the cards, so a card covers the stub where its edge
         meets it. The terminals go in a third layer *above* the cards — a ring
         straddles the border, and drawn down here its inner half sat under a
         translucent card fill and came out muddy. -->
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      :style="{ overflow: 'visible' }"
    >
      <g
        v-for="layer in edgeLayers"
        :key="String(layer.lit)"
        :transform="transform"
        :opacity="layer.lit ? 1 : 0.22"
      >
        <g v-for="edge in layer.edges" :key="edge.id">
          <path
            :d="edge.d"
            fill="none"
            :class="getToneClasses(edge.targetTone).line"
            :stroke-width="edge.state === 'disabled' ? 1 : 1.75"
            :stroke-dasharray="edge.state === 'disabled' ? '4 4' : undefined"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- One travelling dot, released on its turn.
               `keyPoints`/`keyTimes` run the motion over the first `arrival`
               of the cycle and park the dot at the end for the rest; the
               opacity animation hides it while it waits. Same weight and
               shade as a terminal's core, so what flows along the line reads
               as the same material as what it flows into. -->
          <circle
            v-if="edgeDot(edge)"
            r="2"
            opacity="0"
            :class="getToneClasses(edge.targetTone).dot"
          >
            <animateMotion
              :path="edge.d"
              :dur="edgeDot(edge)!.dur"
              :begin="edgeDot(edge)!.begin"
              repeatCount="indefinite"
              calcMode="linear"
              keyPoints="0;1;1"
              :keyTimes="edgeDot(edge)!.keyTimes"
            />
            <animate
              attributeName="opacity"
              :dur="edgeDot(edge)!.dur"
              :begin="edgeDot(edge)!.begin"
              repeatCount="indefinite"
              calcMode="discrete"
              values="1;0"
              :keyTimes="edgeDot(edge)!.opacityKeyTimes"
            />
          </circle>
        </g>
      </g>

      <!-- Captions, in a pass of their own over the whole edge layer. Drawn
           inside each edge's group they were crossed by the *next* edge's
           line — a fan shares one spine, and that spine is a different edge
           from the one carrying the label. -->
      <g :transform="transform">
        <template v-for="edge in layout.edges" :key="`label-${edge.id}`">
          <g v-if="edge.label" :opacity="isLit(edge) ? 1 : 0.22">
            <rect
              :x="labelPoint(edge).x - (edge.label.length * 3.4 + 8)"
              :y="labelPoint(edge).y - 9"
              :width="edge.label.length * 6.8 + 16"
              :height="18"
              rx="4"
              class="fill-white dark:fill-neutral-900"
            />
            <text
              :x="labelPoint(edge).x"
              :y="labelPoint(edge).y"
              text-anchor="middle"
              dominant-baseline="central"
              class="fill-neutral-500 text-[10px] dark:fill-neutral-400"
            >
              {{ edge.label }}
            </text>
          </g>
        </template>
      </g>
    </svg>

    <!-- The cards themselves. Painted as paths rather than as CSS boxes,
         because a terminal is the card *bulging* — no chord across it, and the
         same fill inside — which a border cannot express. The elements below
         carry only content. -->
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      :style="{ overflow: 'visible' }"
    >
      <g :transform="transform">
        <path
          v-for="shape in nodeShapes"
          :key="shape.laid.id"
          :d="shape.laid.outline"
          :opacity="shape.opacity"
          :stroke-width="shape.strokeWidth"
          :class="shape.class"
        />
      </g>
    </svg>

    <!-- Card content. The silhouette above owns fill, border and selection, so
         this element is transparent and exists for the text, the slot and the
         hit target. -->
    <div class="absolute inset-0">
      <div
        v-for="laid in layout.nodes"
        :key="laid.id"
        :class="nodeClasses(laid)"
        :style="{
          left: `${offsetX + laid.x * scale}px`,
          top: `${offsetY + laid.y * scale}px`,
          width: `${laid.width * scale}px`,
          height: `${laid.height * scale}px`,
          opacity: nodeOpacity(laid),
        }"
        role="button"
        :tabindex="laid.node.disabled ? -1 : 0"
        @mouseenter="emit('hover', laid)"
        @mouseleave="emit('hover', null)"
        @focus="emit('hover', laid)"
        @blur="emit('hover', null)"
        @click="emit('select', laid)"
        @keydown.enter.prevent="emit('select', laid)"
        @keydown.space.prevent="emit('select', laid)"
      >
        <!-- The body is laid out at its natural size and scaled by one
             transform, so type, padding, gaps and the progress bar zoom
             together — and the height the DOM produces is the number
             `measureNode` computed, at any zoom. -->
        <div
          :data-scrolls="laid.scrollable ? '' : undefined"
          :class="
            laid.scrollable
              ? 'overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent'
              : undefined
          "
          :style="{
            width: `${laid.width}px`,
            height: `${laid.height}px`,
            padding: `${metrics.padding}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }"
          @wheel="laid.scrollable && $event.stopPropagation()"
        >
          <slot name="node" :node="laid">
            <ConnectionFlowNodeBody
              :node="laid"
              :metrics="metrics"
              :show-progress="showProgress"
              :options="options"
              :scrollable="laid.scrollable"
              :expanded="expanded"
              @toggle-expanded="emit('toggleExpanded', $event)"
            />
          </slot>
        </div>
      </div>
    </div>

    <!-- Terminals, above the cards. One per port, not one per edge — the
         bulge around each is part of the card's own outline. -->
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      :style="{ overflow: 'visible' }"
    >
      <g :transform="transform">
        <circle
          v-for="view in connectorViews"
          :key="view.connector.id"
          :cx="view.connector.x"
          :cy="view.connector.y"
          :r="view.dotRadius"
          :opacity="view.opacity"
          :class="view.dotClass"
        />
      </g>
    </svg>
  </div>
</template>
