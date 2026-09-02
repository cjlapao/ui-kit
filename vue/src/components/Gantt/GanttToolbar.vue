<script lang="ts">
import type { GANTT_ZOOM_PRESET } from "../../../../common/gantt";
import type { SurfaceVariant } from "../../theme/Theme";
export interface GanttToolbarProps {
  /** Gantt surface variant the pill should match. @default "elevated" */
  variant?: SurfaceVariant;
  zoom: number;
  presets: GANTT_ZOOM_PRESET[];
}
export interface GanttToolbarEmits {
  (e: "zoom-to", value: number): void;
  (e: "zoom-by", factor: number): void;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { getSurfaceVariantClasses } from "../../theme/Theme";
import Button from "../Button.vue";

defineOptions({ name: "GanttToolbar" });
const props = withDefaults(defineProps<GanttToolbarProps>(), {
  variant: "elevated",
});
const emit = defineEmits<GanttToolbarEmits>();

/** Nearest preset to a zoom value, by relative distance. */
function nearestPreset(zoom: number, presets: GANTT_ZOOM_PRESET[]): number | null {
  let best: GANTT_ZOOM_PRESET | null = null;
  let bestDist = Infinity;
  for (const p of presets) {
    const dist = Math.abs(Math.log(p.value / zoom)); // log distance = zoom symmetry
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  }
  // Only snap the label when we're close (within ~15% of the preset).
  return best && bestDist < 0.15 ? best.value : null;
}

const active = computed(() => nearestPreset(props.zoom, props.presets));
// The shared surface-variant class set — the same combination the Panel
// renders, so the pill sits flush beside the container chrome.
const chrome = computed(() => getSurfaceVariantClasses(props.variant, "neutral"));
</script>

<template>
  <div
    :class="classNames('pointer-events-auto flex items-center gap-1 rounded-lg p-1', chrome)"
  >
    <div class="flex items-center rounded-md bg-neutral-100 p-0.5 dark:bg-neutral-800">
      <button
        v-for="p in presets"
        :key="p.label"
        type="button"
        :class="
          classNames(
            'rounded px-1.5 py-0.5 text-[10.5px] font-semibold transition-colors',
            active === p.value
              ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-600 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200',
          )
        "
        @click="emit('zoom-to', p.value)"
      >
        {{ p.label }}
      </button>
    </div>
    <div class="mx-0.5 h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
    <Button variant="ghost" size="xs" aria-label="Zoom out" @click="emit('zoom-by', 1 / 1.25)">
      <span class="text-xs font-semibold leading-none">−</span>
    </Button>
    <Button variant="ghost" size="xs" aria-label="Zoom in" @click="emit('zoom-by', 1.25)">
      <span class="text-xs font-semibold leading-none">+</span>
    </Button>
  </div>
</template>
