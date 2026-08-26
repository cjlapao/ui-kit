<template>
  <span
    v-if="max > 0"
    class="flex shrink-0 items-center gap-1.5"
    :title="`${short(used)} / ${short(max)} tokens in context`"
    data-testid="context-gauge"
  >
    <svg viewBox="0 0 36 36" class="h-6 w-6" aria-hidden="true">
      <g transform="rotate(-90 18 18)">
        <circle cx="18" cy="18" :r="radius" fill="none" class="stroke-slate-200 dark:stroke-slate-700" :stroke-width="4" />
        <circle
          cx="18"
          cy="18"
          :r="radius"
          fill="none"
          :stroke="color"
          :stroke-width="4"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="offset"
        />
      </g>
    </svg>
    <span class="text-[11px] tabular-nums text-slate-500 dark:text-slate-400" data-testid="context-percent">
      {{ percent }}%
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ used: number; max: number }>();

const radius = 15;
const circumference = 2 * Math.PI * radius;

const pct = computed(() =>
  props.max > 0 ? Math.min(1, Math.max(0, (props.used || 0) / props.max)) : 0,
);
const percent = computed(() => Math.round(pct.value * 100));
const offset = computed(() => circumference * (1 - pct.value));
const color = computed(() =>
  pct.value < 0.6 ? "#34d399" : pct.value < 0.85 ? "#fbbf24" : "#f87171",
);

const short = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${Math.round(n)}`;
</script>
