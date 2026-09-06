<script lang="ts">
/** One slice of the breakdown — its tone paints both the slice and the dot. */
export interface BreakdownItem {
  id: string;
  label: string;
  value: number;
  /** Shown instead of the raw value (a formatted count, a currency). */
  displayValue?: string;
  /** @default "blue" */
  tone?: TrueColor;
}

/** A label/value pair in the card's summary strip. */
export interface BreakdownStat {
  label: string;
  value: string;
}
</script>

<script setup lang="ts">
/**
 * A whole split into parts: the donut says *how much*, the labelled rows say
 * *of what*, and the summary strip says *so what* — one card for the
 * question "where did it all go".
 */
import { computed } from "vue";
import classNames from "classnames";
import Panel from "./Panel.vue";
import Button, { type ButtonVariant } from "./Button.vue";
import { useClassAttrs } from "../utils/attrsUtils";
import {
  getTrueColorDotClass,
  getTrueColorTextClass,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  SURFACE_TO_BUTTON_VARIANT,
  type TrueColor,
} from "../theme";

defineOptions({ name: "BreakdownCard", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    title: string;
    /** Small copy under the title. */
    caption?: string;
    items: BreakdownItem[];
    /** Summary strip along the bottom — totals that outlive the filter. */
    stats?: BreakdownStat[];
    ctaLabel?: string;
    /**
     * Draws the card's own shape in placeholder ink while the numbers are in
     * flight — the frame keeps its height, nothing jumps when data lands.
     */
    loading?: boolean;
    /**
     * The CTA's button variant. Follows the card's own `variant` by default —
     * an outlined card offers an outlined button.
     */
    ctaVariant?: ButtonVariant;
    /** Surface, as every card in the kit takes it. @default "outlined" */
    variant?: SurfaceVariant;
    /** @default "neutral" */
    tone?: TrueColor;
    /** @default "md" */
    padding?: SurfacePadding;
    corner?: SurfaceCorner;
  }>(),
  {
    caption: "",
    stats: () => [],
    ctaLabel: "",
    loading: false,
    variant: "outlined",
    tone: "neutral",
    padding: "md",
  },
);

const emit = defineEmits<{ (event: "cta"): void }>();

const skeletonRows = computed(() =>
  Array.from({ length: Math.min(Math.max(props.items.length, 3), 7) }, (_, i) => i),
);

const ctaVariantResolved = computed(
  () => props.ctaVariant ?? SURFACE_TO_BUTTON_VARIANT[props.variant],
);

const { classAttr, restAttrs } = useClassAttrs();

const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0));

// Donut geometry: one stroked circle per slice, offsets accumulated along
// the circumference. 2 units of gap between slices keep neighbours distinct.
const R = 60;
const C = 2 * Math.PI * R;
const arcs = computed(() => {
  let acc = 0;
  return props.items.map((item) => {
    const frac = total.value > 0 ? item.value / total.value : 0;
    const arc = { item, frac, offset: acc };
    acc += frac;
    return arc;
  });
});

const share = (value: number) => (total.value > 0 ? `${Math.round((value / total.value) * 100)}%` : "—");
</script>

<template>
  <Panel
    v-bind="restAttrs"
    :variant="variant"
    :tone="tone"
    :padding="padding"
    :corner="corner"
    :class="classNames('w-full', classAttr)"
  >
    <div class="flex flex-col gap-5">
      <div>
        <h3 class="text-sm font-semibold">{{ title }}</h3>
        <p
          v-if="caption"
          class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400"
        >
          {{ caption }}
        </p>
      </div>
      <template v-if="loading">
        <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
          <div class="mt-5 flex flex-col items-center gap-5 sm:flex-row">
            <div class="size-44 shrink-0 rounded-full border-[24px] border-black/10 dark:border-white/10" />
            <ul class="flex w-full min-w-0 flex-1 flex-col gap-2.5">
              <li v-for="row in skeletonRows" :key="row" class="flex items-center gap-2">
                <span class="size-2.5 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
                <span
                  class="block h-3 flex-1 rounded-full bg-black/10 dark:bg-white/10"
                  :style="{ width: `${68 - row * 6}%` }"
                />
                <span class="h-3 w-10 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
                <span class="h-3 w-6 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
              </li>
            </ul>
          </div>
          <div
            v-if="stats.length"
            class="mt-5 grid gap-3 border-t border-neutral-200 pt-3 dark:border-neutral-800"
            :class="
              stats.length === 1
                ? 'grid-cols-1'
                : stats.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
            "
          >
            <div v-for="(stat, index) in stats" :key="stat.label || index">
              <span class="block h-2.5 w-12 rounded-full bg-black/10 dark:bg-white/10" />
              <span class="mt-1.5 block h-3 w-16 rounded-full bg-black/10 dark:bg-white/10" />
            </div>
          </div>
          <span
            v-if="ctaLabel"
            class="mt-5 block h-3 w-28 rounded-full bg-black/10 dark:bg-white/10"
          />
        </div>
      </template>
      <template v-else>

      <section class="flex flex-col items-center gap-5 sm:flex-row">
        <div class="relative h-44 w-44 shrink-0">
          <svg
            class="size-full -rotate-90"
            viewBox="0 0 160 160"
            role="img"
            :aria-label="title"
          >
            <circle
              v-if="!total"
              cx="80"
              cy="80"
              :r="R"
              fill="none"
              stroke-width="22"
              class="stroke-neutral-200 dark:stroke-neutral-800"
            />
            <circle
              v-for="arc in arcs"
              :key="arc.item.id"
              cx="80"
              cy="80"
              :r="R"
              fill="none"
              stroke-width="22"
              style="transform-box: fill-box"
              :class="
                classNames(
                  // The engine's hover, mirrored: the slice pops outward on
                  // the same 150ms ease the React pie's pop uses.
                  'origin-center stroke-current transition-[stroke-dasharray,transform] duration-150 ease-out hover:scale-[1.04]',
                  getTrueColorTextClass(arc.item.tone ?? 'blue'),
                )
              "
              :stroke-dasharray="`${Math.max(arc.frac * C - 2, 0.5)} ${C}`"
              :stroke-dashoffset="`${-(arc.offset * C) - 1}`"
            />
          </svg>
          <div
            class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span
              class="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >TOTAL</span
            >
            <span class="font-mono text-lg font-semibold tracking-tighter">{{
              total
            }}</span>
            <span class="text-[10px] text-neutral-400 dark:text-neutral-500">{{
              items.length
            }}
            parts</span>
          </div>
        </div>

        <ul class="flex w-full min-w-0 flex-1 flex-col gap-2">
          <li
            v-for="item in items"
            :key="item.id"
            class="flex items-center gap-2 text-sm"
          >
            <span
              :class="
                classNames(
                  getTrueColorDotClass(item.tone ?? 'blue'),
                  'size-2.5 shrink-0 rounded-full',
                )
              "
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
            <span class="font-medium tabular-nums">{{
              item.displayValue ?? item.value
            }}</span>
            <span
              class="w-10 text-right font-mono text-[11px] tabular-nums tracking-tighter text-neutral-400 dark:text-neutral-500"
              >{{ share(item.value) }}</span
            >
          </li>
        </ul>
      </section>

      <div
        v-if="stats.length"
        :class="
          classNames(
            'gap-3 border-t pt-3 dark:border-neutral-800 grid',
            stats.length === 1 ? 'grid-cols-1' : stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
          )
        "
      >
        <div v-for="stat in stats" :key="stat.label">
          <div
            class="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            {{ stat.label }}
          </div>
          <div
            class="mt-0.5 font-mono text-sm font-medium tracking-tighter"
          >
            {{ stat.value }}
          </div>
        </div>
      </div>

      <Button
        v-if="ctaLabel"
        :variant="ctaVariantResolved"
        size="sm"
        trailing-icon="ChevronRight"
        @click="emit('cta')"
      >
        {{ ctaLabel }}
      </Button>
      </template>
    </div>
  </Panel>
</template>