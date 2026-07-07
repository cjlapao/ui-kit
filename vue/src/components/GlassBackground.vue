<script lang="ts">
import type { CSSProperties } from "vue";
import type { TrueColor } from "../theme/Theme";

export type GradientDirection =
  | "t"
  | "tr"
  | "r"
  | "br"
  | "b"
  | "bl"
  | "l"
  | "tl";

export type GlassBackgroundPosition = "fixed" | "absolute";

export interface GlassBackgroundProps {
  /** Positioning mode.
   *  `"fixed"` (default) — covers the full viewport, always visible.
   *  `"absolute"` — fills a `position: relative` parent (e.g. a PlaygroundSection preview).
   *  Parent must be `relative` when `"absolute"`.
   */
  position?: GlassBackgroundPosition;
  /** Primary theme color driving the gradient (default: "purple"). */
  color?: TrueColor;
  /** Secondary color for the middle gradient stop. Derived from color if omitted. */
  colorSecondary?: TrueColor;
  /** Deep color for the final gradient stop. Derived if omitted. */
  colorDeep?: TrueColor;
  /** Gradient direction (default: "br" → bottom-right). */
  direction?: GradientDirection;
  /** Enable a slow-moving shimmer overlay (default: false). */
  shimmer?: boolean;
  /** Show ambient glow circles behind content (default: true). */
  ambient?: boolean;
  /** Additional CSS classes applied to the root element. */
  className?: string;
  /** Additional inline styles applied to the root element. */
  style?: CSSProperties;
}

/**
 * Derive a sensible secondary color based on the primary.
 */
export function getFallbackSecondary(color: TrueColor): TrueColor {
  const neighbors: Record<string, TrueColor> = {
    purple: "blue",
    blue: "indigo",
    indigo: "violet",
    violet: "purple",
    rose: "red",
    emerald: "teal",
    teal: "emerald",
    amber: "orange",
    orange: "amber",
    red: "rose",
    cyan: "sky",
    sky: "cyan",
    lime: "green",
    green: "lime",
    neutral: "zinc",
    zinc: "stone",
    stone: "neutral",
    gray: "zinc",
  };
  return neighbors[color] ?? color;
}

/**
 * Derive a deep color for the final gradient stop.
 */
export function getFallbackDeep(color: TrueColor): TrueColor {
  const deepMap: Record<string, TrueColor> = {
    purple: "indigo",
    blue: "violet",
    indigo: "purple",
    violet: "blue",
    rose: "red",
    emerald: "green",
    teal: "cyan",
    amber: "red",
    orange: "amber",
    red: "rose",
    cyan: "blue",
    sky: "indigo",
    lime: "emerald",
    green: "emerald",
    neutral: "stone",
    zinc: "neutral",
    stone: "gray",
    gray: "neutral",
  };
  return deepMap[color] ?? color;
}
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<GlassBackgroundProps>(), {
  position: "fixed",
  color: "purple",
  direction: "br",
  shimmer: false,
  ambient: true,
});

// Resolve semantic colors to Tailwind color names
const c = computed(() => props.color!);
const s = computed(() =>
  props.colorSecondary ?? getFallbackSecondary(props.color!),
);
const d = computed(() =>
  props.colorDeep ?? getFallbackDeep(props.color!),
);

// Map direction codes to CSS gradient angle strings
const directionMap: Record<GradientDirection, string> = {
  t: "to top",
  tr: "to top right",
  r: "to right",
  br: "to bottom right",
  b: "to bottom",
  bl: "to bottom left",
  l: "to left",
  tl: "to top left",
};

// Ambient glow positions as inline style objects
const glowPositions = [
  { top: "-25%", left: "-25%", width: "66.6667%", height: "66.6667%" },
  { bottom: "-25%", right: "-25%", width: "66.6667%", height: "66.6667%" },
] as const;
</script>

<template>
  <div
    :class="[
      position === 'fixed' ? 'fixed inset-0 z-0' : 'absolute inset-0 z-0',
      className,
    ]"
    :style="style"
  >
    <!-- Gradient background (light) -->
    <div
      class="absolute inset-0 transition-colors duration-300 dark:hidden glass-gradient"
      :style="{
        '--glass-from': `var(--color-${c}-300)`,
        '--glass-via': `var(--color-${s}-200)`,
        '--glass-to': `var(--color-${d}-50)`,
        '--glass-angle': directionMap[direction!],
      } as CSSProperties"
    />

    <!-- Gradient background (dark) -->
    <div
      class="absolute inset-0 hidden transition-colors duration-300 dark:block glass-gradient"
      :style="{
        '--glass-from': `var(--color-${c}-700)`,
        '--glass-via': `var(--color-${s}-600)`,
        '--glass-to': `var(--color-${d}-800)`,
        '--glass-angle': directionMap[direction!],
      } as CSSProperties"
    />

    <!-- Ambient glows -->
    <template v-if="ambient">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          v-for="(pos, idx) in glowPositions"
          :key="idx"
          class="absolute rounded-full blur-3xl ambient-pulse"
          :style="{
            ...pos,
            backgroundColor: `var(--color-${c}-400, rgba(168,85,247,0.12))`,
          }"
        />
      </div>
    </template>

    <!-- Shimmer overlay -->
    <template v-if="shimmer">
      <div
        class="pointer-events-none absolute inset-0 animate-shimmer"
        :style="{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
        }"
        aria-hidden="true"
      />
    </template>

    <!-- Children on top -->
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>