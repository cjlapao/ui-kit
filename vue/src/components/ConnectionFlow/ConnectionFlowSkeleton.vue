<script setup lang="ts">
import { computed } from "vue";
import { getHeaderSurface } from "../../connectionFlow";
import type { NodeMetrics } from "../../connectionFlow";
import type { SurfaceVariant } from "../../theme/Theme";

/**
 * Placeholder cards in a plain chain, at the real card size.
 *
 * Shaped from `NodeMetrics` rather than guessed, so the frame holds the height
 * a real graph would need and nothing jumps when the data lands.
 */
const props = withDefaults(
  defineProps<{
    variant: SurfaceVariant;
    metrics: NodeMetrics;
    /** Placeholder cards to draw. @default 4 */
    count?: number;
  }>(),
  { count: 4 },
);

const surface = computed(() => getHeaderSurface(props.variant));
const cards = computed(() => Array.from({ length: props.count }, (_, i) => i));
const gap = computed(() => props.metrics.width / 4);
</script>

<template>
  <div
    class="flex h-full animate-pulse items-center motion-reduce:animate-none"
    :style="{ gap: `${gap}px`, padding: `${metrics.padding * 2}px` }"
    aria-hidden="true"
  >
    <template v-for="(index, position) in cards" :key="index">
      <span
        v-if="position > 0"
        class="h-px shrink-0"
        :class="surface.chip"
        :style="{ width: `${gap}px` }"
      />
      <div
        class="flex shrink-0 flex-col justify-center rounded-lg border"
        :class="surface.divider"
        :style="{
          width: `${metrics.width}px`,
          height: `${metrics.height}px`,
          padding: `${metrics.padding}px`,
          gap: `${metrics.gap}px`,
        }"
      >
        <span class="block h-3 w-[70%] rounded-full bg-black/10 dark:bg-white/10" />
        <span class="block h-2.5 w-[45%] rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    </template>
  </div>
</template>
