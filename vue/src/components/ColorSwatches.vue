<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";
import {
  TRUE_COLORS,
  getSurfacePaddingClass,
  type ControlSize,
  type SurfacePadding,
  type TrueColor,
} from "../theme";

defineOptions({ name: "ColorSwatches", inheritAttrs: false });

/**
 * Colours on display: a strip of dots for the theme's tones, condensed into
 * an overlapping stack with a `+N` chip whenever the count (or the width)
 * outgrows the row, and expanded by *unfolding* — the stacked dots spread
 * apart, the rest pop in one by one, and the strip grows exactly as far as
 * the new lines need. One layout, clipped or whole; nothing replaces
 * anything.
 *
 * (Notes live here rather than in the template because a template comment is
 * a real node, and a comment beside the root makes the component multi-root
 * — which silently breaks attribute inheritance.)
 */

interface ColorSwatchesProps {
  /** @default TRUE_COLORS */
  colors?: readonly TrueColor[];
  /** Dot diameter, on the shared control scale. @default "md" */
  size?: ControlSize;
  /** Inset around the group, on the shared container scale. @default "none" */
  padding?: SurfacePadding;
  /** Dots shown before the `+N` chip while condensed. @default 5 */
  maxVisible?: number;
  /** @default "click" */
  expandOn?: "click" | "hover";
  /** @default false */
  defaultExpanded?: boolean;
  /** @default "circle" */
  shape?: "circle" | "square";
  /** Tone names under the dots, revealed with the expansion. @default false */
  showNames?: boolean;
}

const props = withDefaults(defineProps<ColorSwatchesProps>(), {
  colors: () => TRUE_COLORS,
  size: "md",
  padding: "none",
  maxVisible: 5,
  expandOn: "click",
  defaultExpanded: false,
  shape: "circle",
  showNames: false,
});

const { classAttr, restAttrs } = useClassAttrs();
const regionId = useId();
const rootEl = ref<HTMLElement>();
const contentEl = ref<HTMLElement>();
const expanded = ref(props.defaultExpanded);
// The retract mirrors the unfold: the expanded layout is held while the
// dots step away right to left, and the condensed geometry — zeroed
// widths, overlap margins — commits only when the hold ends.
const collapsing = ref(false);
let hold: ReturnType<typeof setTimeout> | undefined;
const width = ref(0);
const contentH = ref(0);
let observer: ResizeObserver | undefined;

// Geometry constants copied from the React kit's `ColorSwatches.tsx`.
const OVERLAP_RATIO = 0.3;
const CHIP_PX = 34;
// The label block a `showNames` swatch adds to a row: gap-1 over a
// `leading-4` 10px label.
const LABEL_PX = 20;
const CASCADE_MS = 20;
// Retracting is swift: a tighter ripple and a shorter hold.
const RETRACT_MS = 8;
const HOLD_MS = 300;
const GROW_MS = 400;
// Inner breathing room so hover growth stays inside the clip.
const PAD_RATIO = 0.25;

// Declared as literals, never `bg-${tone}-500`: Tailwind only emits the
// class strings it can see in sources.
const swatchFill: Record<TrueColor, string> = {
  red: "bg-red-500 dark:bg-red-400",
  orange: "bg-orange-500 dark:bg-orange-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  yellow: "bg-yellow-500 dark:bg-yellow-400",
  lime: "bg-lime-500 dark:bg-lime-400",
  green: "bg-green-500 dark:bg-green-400",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  teal: "bg-teal-500 dark:bg-teal-400",
  cyan: "bg-cyan-500 dark:bg-cyan-400",
  sky: "bg-sky-500 dark:bg-sky-400",
  blue: "bg-blue-500 dark:bg-blue-400",
  indigo: "bg-indigo-500 dark:bg-indigo-400",
  violet: "bg-violet-500 dark:bg-violet-400",
  purple: "bg-purple-500 dark:bg-purple-400",
  fuchsia: "bg-fuchsia-500 dark:bg-fuchsia-400",
  rose: "bg-rose-500 dark:bg-rose-400",
  slate: "bg-slate-500 dark:bg-slate-400",
  gray: "bg-gray-500 dark:bg-gray-400",
  zinc: "bg-zinc-500 dark:bg-zinc-400",
  neutral: "bg-neutral-500 dark:bg-neutral-400",
  stone: "bg-stone-500 dark:bg-stone-400",
};

const dotClass: Record<ControlSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
  xl: "size-9",
};
const dotPx: Record<ControlSize, number> = { xs: 12, sm: 16, md: 20, lg: 28, xl: 36 };
const gapPx: Record<ControlSize, number> = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16 };

const count = computed(() => props.colors.length);
const dot = computed(() => dotPx[props.size]);
const gap = computed(() => gapPx[props.size]);
const overlap = computed(() => Math.round(dot.value * OVERLAP_RATIO));
const step = computed(() => dot.value - overlap.value);

// Too narrow, too many — the two ways a strip condenses. A width of 0 means
// unmeasured (jsdom), where only the count rule can apply.
// Hover growth (the halo's 1.45x needs ~a quarter dot) has to stay inside
// the clip's box — a quarter dot of padding keeps it off the clip edges.
const pad = computed(() => Math.round(dot.value * PAD_RATIO));
const available = computed(() => width.value - pad.value * 2);
const fitsAll = computed(() => width.value === 0 || available.value >= count.value * dot.value + (count.value - 1) * gap.value);
const condense = computed(() => !fitsAll.value || count.value > props.maxVisible);
// Only a measured overflow may cut the count below `maxVisible`.
const widthFits = computed(() =>
  fitsAll.value ? count.value : Math.max(1, Math.floor((available.value - CHIP_PX + step.value) / step.value)),
);
const visibleCount = computed(() =>
  condense.value ? Math.min(count.value, props.maxVisible, widthFits.value) : count.value,
);
const layoutOpen = computed(() => expanded.value || collapsing.value);
const hiddenCount = computed(() => (layoutOpen.value ? 0 : count.value - visibleCount.value));
const expandable = computed(() => condense.value || props.showNames);

const rootClass = computed(() =>
  classNames("relative", getSurfacePaddingClass(props.padding), classAttr.value),
);
const expandedAttr = computed(() => (expanded.value ? "" : undefined));

// The clip animates between exactly one wrapping line — what the condensed
// strip is — and the measured height of the laid-out whole.
const rowPx = computed(() => pad.value * 2 + dot.value + (props.showNames ? LABEL_PX : 0) + gap.value);
const clipStyle = computed(() => ({
  overflow: "hidden",
  maxHeight: layoutOpen.value ? (contentH.value > 0 ? `${contentH.value}px` : "none") : `${rowPx.value}px`,
  transition: `max-height ${expanded.value ? GROW_MS : HOLD_MS}ms ease-out`,
}));

function cascadeMs(index: number) {
  return expanded.value ? index * CASCADE_MS : (count.value - 1 - index) * RETRACT_MS;
}

function cascadeDelay(index: number) {
  return `${cascadeMs(index)}ms`;
}

function dotStyle(index: number, hidden: boolean, leading: boolean, order?: number) {
  // Hidden dots keep their slot in the flow but zero their width, so the
  // clip shows a short condensed line while their layout never moves.
  return {
    width: hidden && !collapsing.value ? "0px" : undefined,
    minWidth: hidden && !collapsing.value ? "0px" : undefined,
    marginRight:
      hidden || layoutOpen.value || !condense.value
        ? `${gap.value}px`
        : leading
          ? `${-overlap.value}px`
          : `${gap.value}px`,
    marginBottom: `${gap.value}px`,
    // While condensed the overflow dots hold their place behind the chip;
    // expanded, they precede it — the chip always ends the sequence it
    // controls. (`order` is what makes the chip leap the fold when open.)
    order,
    // Expanding cascades everything left to right; retracting hides with a
    // swift right-to-left ripple and commits the condensed margins the
    // moment the hold ends — a continuous swift motion, never a wait.
    transition: `width 0s, margin-right ${expanded.value ? 200 : 150}ms ease-out, transform 200ms ease-out, opacity 200ms ease-out`,
    transitionDelay: `0ms, ${expanded.value ? `${index * CASCADE_MS}ms` : "0ms"}, ${cascadeMs(index)}ms, ${cascadeMs(index)}ms`,
    transform: hidden ? "scale(0)" : "scale(1)",
    opacity: hidden ? "0" : "1",
  };
}

const chipStyle = computed(() => ({
  height: `${Math.max(dot.value, 18)}px`,
  // A lone `+` wants a circle, not a tall pill; the count earns the pill
  // back.
  width: expanded.value ? `${Math.max(dot.value, 18)}px` : undefined,
  paddingLeft: expanded.value ? "0px" : undefined,
  paddingRight: expanded.value ? "0px" : undefined,
  // The last visible dot rides over by one overlap when condensed — the
  // chip pays that back; otherwise the dot's own margin is the whole gap.
  marginLeft: !layoutOpen.value && condense.value ? `${overlap.value + gap.value}px` : "0px",
  order: layoutOpen.value ? 3 : 1,
  marginBottom: `${gap.value}px`,
}));

const chipLabel = computed(() =>
  expanded.value
    ? "Collapse colours"
    : hiddenCount.value > 0
      ? `Show ${hiddenCount.value} more colours`
      : "Expand colours",
);

const dotClasses = (tone: TrueColor) =>
  classNames(
    swatchFill[tone],
    dotClass[props.size],
    props.shape === "circle" ? "rounded-full" : "rounded-md",
  );

function reveal(open: boolean) {
  clearTimeout(hold);
  if (open) {
    collapsing.value = false;
    expanded.value = true;
  } else {
    expanded.value = false;
    collapsing.value = true;
    hold = setTimeout(() => (collapsing.value = false), HOLD_MS);
  }
}

function toggle(event: MouseEvent) {
  event.stopPropagation();
  reveal(!expanded.value);
}

function onPointerEnter(event: PointerEvent) {
  if (props.expandOn === "hover" && expandable.value) reveal(true);
  const handler = (restAttrs.value as Record<string, unknown>).onPointerenter as
    | ((event: PointerEvent) => void)
    | undefined;
  handler?.(event);
}

function onPointerLeave(event: PointerEvent) {
  if (props.expandOn === "hover" && expanded.value) reveal(false);
  const handler = (restAttrs.value as Record<string, unknown>).onPointerleave as
    | ((event: PointerEvent) => void)
    | undefined;
  handler?.(event);
}

onMounted(() => {
  width.value = rootEl.value?.getBoundingClientRect().width ?? 0;
  contentH.value = contentEl.value?.scrollHeight ?? 0;
  if (!rootEl.value || typeof ResizeObserver === "undefined") return;
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === rootEl.value) width.value = entry.contentRect.width;
      else contentH.value = (entry.target as HTMLElement).scrollHeight;
    }
  });
  observer.observe(rootEl.value);
  if (contentEl.value) observer.observe(contentEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  clearTimeout(hold);
});
</script>

<template>
  <div
    v-bind="restAttrs"
    ref="rootEl"
    :class="rootClass"
    :data-expanded="expandedAttr"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <div :style="clipStyle">
      <div ref="contentEl" :id="regionId" role="group" aria-label="Colour swatches" class="flex flex-wrap items-start" :style="{ padding: `${pad}px` }">
        <span
          v-for="(tone, index) in props.colors.slice(0, visibleCount)"
          :key="tone"
          :title="tone"
          class="flex shrink-0 flex-col items-center gap-1"
          :style="dotStyle(index, false, true)"
        >
          <span class="group relative block shrink-0 hover:z-10">
            <span
              aria-hidden="true"
              :class="
                classNames(
                  'absolute inset-0 scale-100 opacity-0 transition duration-200 ease-out',
                  'group-hover:scale-[1.45] group-hover:opacity-40',
                  swatchFill[tone],
                  props.shape === 'circle' ? 'rounded-full' : 'rounded-md',
                )
              "
            />
            <span :class="classNames(dotClasses(tone), 'relative block transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15]')" />
          </span>
          <span
            v-if="showNames"
            class="text-[10px] leading-4 text-neutral-500 dark:text-neutral-400"
            :style="{ opacity: expanded ? 1 : 0, transition: 'opacity 200ms ease-out', transitionDelay: cascadeDelay(index) }"
          >{{ tone }}</span>
        </span>
        <button
          v-if="expandable"
          type="button"
          :aria-expanded="expanded"
          :aria-controls="regionId"
          :aria-label="chipLabel"
          :class="
            classNames(
              'inline-flex shrink-0 items-center justify-center gap-0.5 self-start rounded-full px-1.5',
              'bg-neutral-100 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200',
              'dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
            )
          "
          :style="chipStyle"
          @click="toggle"
        >
          <span :class="classNames('text-sm leading-none transition-transform duration-300', expanded && 'rotate-45')" aria-hidden="true">+</span>
          <template v-if="hiddenCount > 0">{{ hiddenCount }}</template>
        </button>
        <span
          v-for="(tone, offset) in props.colors.slice(visibleCount)"
          :key="`rest-${tone}`"
          :title="tone"
          :class="classNames('flex shrink-0 flex-col items-center gap-1', !expanded && 'overflow-hidden')"
          :style="dotStyle(visibleCount + offset, !expanded, false, 2)"
        >
          <span class="group relative block shrink-0 hover:z-10">
            <span
              aria-hidden="true"
              :class="
                classNames(
                  'absolute inset-0 scale-100 opacity-0 transition duration-200 ease-out',
                  'group-hover:scale-[1.45] group-hover:opacity-40',
                  swatchFill[tone],
                  props.shape === 'circle' ? 'rounded-full' : 'rounded-md',
                )
              "
            />
            <span :class="classNames(dotClasses(tone), 'relative block transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15]')" />
          </span>
          <span
            v-if="showNames"
            class="text-[10px] leading-4 text-neutral-500 dark:text-neutral-400"
            :style="{ opacity: expanded ? 1 : 0, transition: 'opacity 200ms ease-out', transitionDelay: cascadeDelay(visibleCount + offset) }"
          >{{ tone }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
