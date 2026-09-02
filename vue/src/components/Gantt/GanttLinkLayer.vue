<script lang="ts">
import type { GanttLink, GanttLinkPath, TrueColor } from "../../../../common/gantt";
import type { GanttRubberPreview } from "./types";
export interface GanttLinkLayerProps {
  width: number;
  height: number;
  paths: GanttLinkPath[];
  color: TrueColor;
  selected: GanttLink | null;
  rubber: GanttRubberPreview | null;
  interactive: boolean;
  /** Remove the currently-selected link (floating delete control / dbl-click). */
  onDeleteLink?: (link: GanttLink) => void;
}
export interface GanttLinkLayerEmits {
  (e: "select-link", link: GanttLink | null): void;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getGanttLinkTokens, pickLinkAt, LINK_HIT_RADIUS } from "../../../../common/gantt";

/**
 * GanttLinkLayer — the SVG that draws dependency arrows. It is positioned by
 * the parent inside an absolutely-positioned overlay div (the timeline origin)
 * so the parent owns the ref used to resolve drag coordinates.
 *
 * Pointer model: the layer is `pointer-events: none`; each link gets a wide
 * transparent hit path (`pointer-events: stroke`, ~LINK_HIT_RADIUS px on each
 * side of the 1.5px stroke) so arrows can be selected without pixel-perfect
 * aiming. A click resolves to the NEAREST route within the radius (engine
 * `pickLinkAt`), so two close connectors never fight over the same pointer
 * and nothing blocks the bars underneath. Arrowheads are polygons computed in
 * the engine (no SVG markers).
 */
defineOptions({ name: "GanttLinkLayer" });
const props = defineProps<GanttLinkLayerProps>();
const emit = defineEmits<GanttLinkLayerEmits>();
const svgRef = ref<SVGSVGElement | null>(null);

/** Resolve a pointer event to the link the pointer is aiming at (nearest within radius). */
function pickFromEvent(e: MouseEvent): GanttLinkPath | null {
  const svg = svgRef.value;
  if (!svg) return null;
  const rect = svg.getBoundingClientRect();
  return pickLinkAt(props.paths, e.clientX - rect.left, e.clientY - rect.top);
}

/**
 * Toggle selection of the aimed-at link (clicking the selected one clears
 * it). Falls back to the path that received the click when the pointer
 * resolves to no route (e.g. coordinate-less synthetic clicks).
 */
function handlePick(e: MouseEvent, clicked: GanttLinkPath) {
  e.stopPropagation();
  const pick = pickFromEvent(e) ?? clicked;
  emit("select-link", pick.link === props.selected ? null : pick.link);
}

/** Remove the aimed-at link (double-click). */
function handleDelete(e: MouseEvent, clicked: GanttLinkPath) {
  e.stopPropagation();
  const pick = pickFromEvent(e) ?? clicked;
  if (props.interactive && props.onDeleteLink) props.onDeleteLink(pick.link);
}

const selPath = computed(
  () => (props.selected ? props.paths.find((p) => p.link === props.selected) : undefined),
);
const selColor = computed(() => selPath.value?.color ?? props.color);
const selMid = computed(() =>
  selPath.value
    ? { x: (selPath.value.from.x + selPath.value.to.x) / 2, y: (selPath.value.from.y + selPath.value.to.y) / 2 }
    : null,
);
const canDelete = computed(() => Boolean(props.interactive && props.onDeleteLink && selPath.value));
</script>

<template>
  <svg ref="svgRef" :width="width" :height="height" class="block overflow-visible">
    <g
      v-for="(p, i) in paths"
      :key="`${p.link.source}->${p.link.target}-${p.type}-${i}`"
      :style="selected != null && p.link === selected ? { filter: `drop-shadow(0 0 3px var(--color-${p.color ?? color}-500))` } : undefined"
    >
      <!-- Wide invisible hit target: makes the 1.5px stroke selectable without
           pixel-perfect aiming. Clicks resolve to the NEAREST route within the
           radius (engine pickLinkAt), so close connectors never fight over a
           pointer. -->
      <path
        :d="p.d"
        data-gantt-link-hit
        data-gantt-keep-link-selection
        fill="none"
        stroke="transparent"
        stroke-linejoin="round"
        :stroke-width="LINK_HIT_RADIUS * 2"
        :style="{
          pointerEvents: interactive ? 'stroke' : 'none',
          cursor: interactive ? 'pointer' : 'default',
        }"
        @click="handlePick($event, p)"
        @dblclick="handleDelete($event, p)"
      >
        <title>{{ `${p.link.source} → ${p.link.target} (${p.type.toUpperCase()})` }}</title>
      </path>
      <path
        :d="p.d"
        data-gantt-keep-link-selection
        :class="getGanttLinkTokens(p.color ?? color).stroke"
        fill="none"
        stroke-linejoin="round"
        :stroke-width="selected != null && p.link === selected ? 2.5 : 1.5"
        :stroke-dasharray="p.type === 'ff' || p.type === 'sf' ? '4 3' : undefined"
        :style="{
          pointerEvents: interactive ? 'stroke' : 'none',
          cursor: interactive ? 'pointer' : 'default',
        }"
        @click="handlePick($event, p)"
        @dblclick="handleDelete($event, p)"
      >
        <title>{{ `${p.link.source} → ${p.link.target} (${p.type.toUpperCase()})` }}</title>
      </path>
      <polygon v-if="p.arrow" :points="p.arrow" :class="getGanttLinkTokens(p.color ?? color).fill" />
      <!-- Port (connection) nodes: a pale halo + a solid dot at each bar edge. -->
      <circle
        :cx="p.from.x"
        :cy="p.from.y"
        :r="(selected != null && p.link === selected ? 4.5 : 3.5) + 2.5"
        :class="getGanttLinkTokens(p.color ?? color).halo"
      />
      <circle
        :cx="p.from.x"
        :cy="p.from.y"
        :r="selected != null && p.link === selected ? 4.5 : 3.5"
        :class="getGanttLinkTokens(p.color ?? color).fill"
      />
      <circle
        :cx="p.to.x"
        :cy="p.to.y"
        :r="(selected != null && p.link === selected ? 4.5 : 3.5) + 2.5"
        :class="getGanttLinkTokens(p.color ?? color).halo"
      />
      <circle
        :cx="p.to.x"
        :cy="p.to.y"
        :r="selected != null && p.link === selected ? 4.5 : 3.5"
        :class="getGanttLinkTokens(p.color ?? color).fill"
      />
    </g>
    <g v-if="rubber">
      <path
        :d="rubber.d"
        :class="getGanttLinkTokens(rubber.color).stroke"
        fill="none"
        stroke-linejoin="round"
        stroke-width="1.5"
        stroke-dasharray="5 3"
      />
      <polygon v-if="rubber.arrow" :points="rubber.arrow" :class="getGanttLinkTokens(rubber.color).fill" />
      <circle :cx="rubber.from.x" :cy="rubber.from.y" r="6" :class="getGanttLinkTokens(rubber.color).halo" />
      <circle :cx="rubber.from.x" :cy="rubber.from.y" r="3.5" :class="getGanttLinkTokens(rubber.color).fill" />
      <circle :cx="rubber.to.x" :cy="rubber.to.y" r="6" :class="getGanttLinkTokens(rubber.color).halo" />
      <circle :cx="rubber.to.x" :cy="rubber.to.y" r="3.5" :class="getGanttLinkTokens(rubber.color).fill" />
    </g>
    <!-- Floating delete control for the selected link (mouse affordance; the
         Delete/Backspace key also works once the chart has focus). -->
    <foreignObject
      v-if="canDelete && selMid"
      :x="selMid.x - 44"
      :y="selMid.y - 32"
      width="88"
      height="24"
      class="pointer-events-auto overflow-visible"
    >
      <button
        type="button"
        tabindex="-1"
        data-gantt-keep-link-selection
        class="pointer-events-auto absolute left-0 top-0 inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[11px] font-semibold shadow-sm outline-none transition-transform hover:scale-105"
        :style="{
          backgroundColor: 'var(--color-white, #ffffff)',
          borderColor: `var(--color-${selColor}-300)`,
          color: `var(--color-${selColor}-700)`,
        }"
        title="Remove this dependency (or press Delete)"
        @click="selected && onDeleteLink && onDeleteLink(selected)"
      >
        <span aria-hidden="true">✕</span> Delete
      </button>
    </foreignObject>
  </svg>
</template>
