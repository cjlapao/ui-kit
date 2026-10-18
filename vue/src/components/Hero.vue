<script lang="ts">
import type { VNode } from "vue";
import {
  SURFACE_VARIANTS,
  type ControlSize,
  type GlowIntensity,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import type { PanelDecoration } from "./Panel.vue";
import type { IconName } from "../icons/registry";

/**
 * Every container surface, plus the saturated `gradient` band that is the
 * component's own reason to exist — the same shape `EmptyState` uses for its
 * extra `plain`.
 */
export const HERO_VARIANTS = [...SURFACE_VARIANTS, "gradient"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

/** The shared control scale. Both were bespoke unions, and the subtitle's was
 *  truncated to three members, so a hero could not be sized past `md`. */
export type HeroTitleSize = ControlSize;
export type HeroSubtitleSize = ControlSize;
/** The shared container padding scale. */
export type HeroPadding = SurfacePadding;

/** Elements a hero's title may be rendered as. */
export const HERO_TITLE_ELEMENTS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
] as const;
export type HeroTitleElement = (typeof HERO_TITLE_ELEMENTS)[number];

export interface HeroProps {
  /** Main heading. */
  title: string;
  /** Supporting line under the title. */
  subtitle?: string;
  /**
   * What the title is rendered as. It was always a `<p>`, so a banner that
   * reads as the top of a page announced nothing to a screen reader.
   * @default "p"
   */
  titleAs?: HeroTitleElement;
  /** Registry icon name, or a node. Omit it and the slot is not drawn. */
  icon?: IconName | VNode;
  /** @default "blue" */
  tone?: TrueColor;
  /** Alias for `tone`, matching the rest of the kit. */
  color?: TrueColor;
  /** @default "gradient" */
  variant?: HeroVariant;
  /** @default "sm" */
  titleSize?: HeroTitleSize;
  /** @default "xs" */
  subtitleSize?: HeroSubtitleSize;
  /** @default "sm" */
  padding?: HeroPadding;
  /** Corner radius on the shared container scale. */
  corner?: SurfaceCorner;
  /** @deprecated Use `corner`. Ignored when `corner` is set. */
  rounded?: boolean;
  /**
   * Decorative layer inside the banner: floating circles, a diagonal wash,
   * both, or neither. @default "both"
   */
  decoration?: PanelDecoration;
  /** Start colour of the gradient. Defaults to the tone's 700 shade. */
  gradientFrom?: string;
  /** End colour of the gradient. Defaults to the tone's 800 shade. */
  gradientTo?: string;
  /** Halo behind the banner. @default "soft" */
  glowIntensity?: GlowIntensity;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import Panel from "./Panel.vue";
import CustomIcon from "./CustomIcon.vue";
import {
  DEFAULT_SURFACE_CORNER,
  getGlowTokens,
  getSurfaceCornerClass,
  getSurfacePaddingClass,
  resolveGlowGradient,
} from "../theme/Theme";

/**
 * A banner: an icon, a heading and a supporting line, on a saturated gradient
 * or on any of the kit's container surfaces.
 *
 * The gradient stops are the tone's **700 and 800** shades, read from
 * Tailwind's own palette variables. They used to be a hand-written table of 21
 * pairs in which every tone bled into its neighbour — `sky` painted
 * sky→indigo, `red` painted red→rose — and the light end sat at `-400`, where
 * the white copy this component insists on measures 2.94:1 on yellow. White on
 * `{tone}-700` is the kit's measured floor at 4.93:1.
 */
defineOptions({ name: "Hero", inheritAttrs: false });

const props = withDefaults(defineProps<HeroProps>(), {
  titleAs: "p",
  variant: "gradient",
  titleSize: "sm",
  subtitleSize: "xs",
  padding: "sm",
  rounded: true,
  decoration: "both",
  glowIntensity: "soft",
});

const TITLE_SIZES: Record<ControlSize, string> = {
  xs: "text-xs font-bold",
  sm: "text-sm font-bold",
  md: "text-base font-bold",
  lg: "text-lg font-semibold",
  xl: "text-xl font-semibold",
};

const SUBTITLE_SIZES: Record<ControlSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

/** Icon chip, scaled with the title rather than pinned at 48px. */
const CHIP_SIZES: Record<ControlSize, { box: string; glyph: number }> = {
  xs: { box: "h-8 w-8", glyph: 16 },
  sm: { box: "h-10 w-10", glyph: 18 },
  md: { box: "h-12 w-12", glyph: 22 },
  lg: { box: "h-14 w-14", glyph: 26 },
  xl: { box: "h-16 w-16", glyph: 30 },
};

const accent = computed<TrueColor>(() => props.tone ?? props.color ?? "blue");
const effectiveCorner = computed<SurfaceCorner>(
  () => props.corner ?? (props.rounded ? DEFAULT_SURFACE_CORNER : "none"),
);
const onGradient = computed(() => props.variant === "gradient");
/** The Panel branch never sees `gradient`, but the template cannot narrow the
 *  union through a computed, so it is stated here. */
const panelVariant = computed<SurfaceVariant>(() =>
  props.variant === "gradient" ? "elevated" : props.variant,
);
const chip = computed(() => CHIP_SIZES[props.titleSize] ?? CHIP_SIZES.sm);
const showShapes = computed(
  () => props.decoration === "shapes" || props.decoration === "both",
);
const showWash = computed(
  () => props.decoration === "gradient" || props.decoration === "both",
);

const glow = computed(() => getGlowTokens(props.glowIntensity));
const haloStops = computed(() =>
  resolveGlowGradient(accent.value, props.gradientFrom, props.gradientTo),
);
const haloStyle = computed(() => ({
  background: `linear-gradient(to right, ${haloStops.value[0]}, ${haloStops.value[1]})`,
  opacity: String(glow.value.idleOpacity),
}));

// The tone's own palette variables rather than a literal class pair, so a tone
// can never be missing and no two tones can drift apart.
const bandStyle = computed(() => ({
  backgroundImage: `linear-gradient(to bottom right, ${
    props.gradientFrom ?? `var(--color-${accent.value}-700)`
  }, ${props.gradientTo ?? `var(--color-${accent.value}-800)`})`,
}));

const titleClass = computed(() =>
  classNames(
    "leading-tight",
    TITLE_SIZES[props.titleSize] ?? TITLE_SIZES.sm,
    // Vue has no SurfaceProvider, so the non-gradient variants take the
    // solid-surface tokens spelled out.
    onGradient.value
      ? "text-white"
      : "text-neutral-900 dark:text-neutral-100",
  ),
);

const subtitleClass = computed(() =>
  classNames(
    "mt-0.5 leading-relaxed",
    SUBTITLE_SIZES[props.subtitleSize] ?? SUBTITLE_SIZES.xs,
    onGradient.value
      ? "text-white/75"
      : "text-neutral-600 dark:text-neutral-300",
  ),
);

const chipClass = computed(() =>
  classNames(
    "flex shrink-0 items-center justify-center rounded-xl border shadow-inner backdrop-blur-sm",
    chip.value.box,
    onGradient.value
      ? "border-white/20 bg-white/15"
      : "border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/10",
  ),
);
</script>

<template>
  <!-- Every non-gradient variant is a Panel, which brings its own fill, ring
       and glass props. -->
  <Panel
    v-if="!onGradient"
    class="w-full"
    :variant="panelVariant"
    :tone="accent"
    :corner="effectiveCorner"
    :padding="padding"
    :decoration="decoration"
    :scrollable="false"
    v-bind="$attrs"
  >
    <div class="relative flex items-center gap-4">
      <div v-if="icon" :class="chipClass">
        <CustomIcon
          v-if="typeof icon === 'string'"
          :icon="icon as IconName"
          :custom-size="chip.glyph"
          class="text-neutral-900 dark:text-neutral-100"
        />
        <component :is="icon" v-else />
      </div>
      <div class="min-w-0 flex-1">
        <component :is="titleAs" :class="titleClass">{{ title }}</component>
        <p v-if="subtitle" :class="subtitleClass">{{ subtitle }}</p>
      </div>
    </div>
  </Panel>

  <div v-else :class="classNames('relative w-full', glow.pad)">
    <!-- Halo behind the band. Inset inside the reserved padding so an ancestor
         with `overflow: auto` cannot clip it — the same rule the gradient
         inputs follow. -->
    <div
      aria-hidden="true"
      :class="
        classNames(
          'pointer-events-none absolute rounded-[inherit]',
          glow.inset,
          glow.blur,
        )
      "
      :style="haloStyle"
    />
    <div
      :class="
        classNames(
          'relative flex items-center gap-4 overflow-hidden shadow-lg',
          getSurfacePaddingClass(padding),
          getSurfaceCornerClass(effectiveCorner),
        )
      "
      :style="bandStyle"
      data-variant="gradient"
      :data-tone="accent"
      v-bind="$attrs"
    >
      <template v-if="showShapes">
        <div
          class="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -left-8 -bottom-10 h-36 w-36 rounded-full bg-white/10 opacity-70"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute right-10 bottom-8 h-16 w-16 rounded-full bg-white/10 opacity-50"
          aria-hidden="true"
        />
      </template>
      <div
        v-if="showWash"
        class="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/10 to-transparent"
        aria-hidden="true"
      />

      <div class="relative flex min-w-0 flex-1 items-center gap-4">
        <div v-if="icon" :class="chipClass">
          <CustomIcon
            v-if="typeof icon === 'string'"
            :icon="icon as IconName"
            :custom-size="chip.glyph"
            class="text-white"
          />
          <component :is="icon" v-else />
        </div>
        <div class="min-w-0 flex-1">
          <component :is="titleAs" :class="titleClass">{{ title }}</component>
          <p v-if="subtitle" :class="subtitleClass">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
