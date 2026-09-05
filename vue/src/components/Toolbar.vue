<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import {
  DEFAULT_SURFACE_CORNER,
  getPanelToneStyles,
  getSurfaceCornerClass,
  getSurfacePaddingClass,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import {
  getGlassVibrancyClass,
  getSurfaceGlassFillClass,
  type GlassOpacity,
  type GlassVibrancy,
} from "../theme/glass";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Toolbar", inheritAttrs: false });

/**
 * A bar that groups the actions for the content beside it — PrimeVue's
 * Toolbar: `start` / `center` / `end` slots, one row, `role="toolbar"` —
 * wearing the kit's shared Panel surface.
 *
 * The bar names itself PrimeVue's way: nothing. A `role="toolbar"` without a
 * name announces fine, but on a page with several toolbars the name is the
 * only thing that tells "Formatting" from "Filters" — pass `aria-label` or
 * `aria-labelledby` (they arrive as attrs) to say which.
 *
 * (These notes live here rather than in the template because a template
 * comment is a real node, and a comment beside the root makes the component
 * multi-root — which silently breaks attribute inheritance.)
 */

interface ToolbarProps {
  /**
   * Surface treatment — Panel's shared variant set, from an invisible
   * `simple` bar to `liquid-glass`. @default "outlined"
   */
  variant?: SurfaceVariant;
  /** Accent for the tinted and translucent variants. @default "neutral" */
  tone?: TrueColor;
  /**
   * Inset around the regions, on the shared container scale. A bar wants it
   * small; `none` lets a toolbar bleed flush into the content it serves.
   * @default "xs"
   */
  padding?: SurfacePadding;
  /** Corner rounding, the shared container scale. @default "rounded-md" */
  corner?: SurfaceCorner;
  /** Backdrop vibrancy for the `liquid-glass` variant. @default "medium" */
  vibrancy?: GlassVibrancy;
  /** Glass fill opacity for the `liquid-glass` variant. @default "frosted" */
  glassOpacity?: GlassOpacity;
}

const props = withDefaults(defineProps<ToolbarProps>(), {
  variant: "outlined",
  tone: "neutral",
  padding: "xs",
  corner: DEFAULT_SURFACE_CORNER,
  vibrancy: "medium",
  glassOpacity: "frosted",
});

const { classAttr, restAttrs } = useClassAttrs();

// Chrome copied verbatim from the React kit's `Panel.tsx` `variantBaseStyles`
// map (vue/CONVENTIONS.md), minus the text tokens Panel layers separately —
// a bar paints no text of its own.
const variantBaseStyles: Record<SurfaceVariant, string> = {
  elevated:
    "bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",
  outlined: "border bg-white/90 dark:bg-neutral-900/80",
  subtle: "shadow-sm ring-1 ring-transparent dark:ring-white/5",
  tonal: "shadow-sm ring-1 ring-transparent dark:ring-white/5",
  default:
    "border bg-white/80 backdrop-blur-xl shadow-2xl dark:bg-neutral-900/70",
  glass:
    "border backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20",
  "liquid-glass": "border backdrop-blur-2xl",
  simple: "ring-transparent dark:ring-white/5",
};

// Deliberately tone-independent — the Panel rim: a light bevel, not an
// outline, so a saturated edge never fights the backdrop glass sits over.
const GLASS_RIM = "border-white/50 dark:border-white/10";

const variantClasses = computed(() => {
  const palette = getPanelToneStyles(props.tone);
  switch (props.variant) {
    case "outlined":
      return classNames(variantBaseStyles.outlined, palette.outlineBorder);
    case "subtle":
      return classNames(
        variantBaseStyles.subtle,
        palette.border,
        palette.subtleBg,
      );
    case "tonal":
      return classNames(variantBaseStyles.tonal, palette.tonalBg);
    case "default":
      return classNames(variantBaseStyles.default, GLASS_RIM);
    case "glass":
      return classNames(
        variantBaseStyles.glass,
        GLASS_RIM,
        palette.glassBg,
      );
    case "liquid-glass":
      return classNames(
        variantBaseStyles["liquid-glass"],
        getGlassVibrancyClass(props.vibrancy),
        getSurfaceGlassFillClass(props.tone, props.glassOpacity),
        palette.liquidBorder,
        palette.liquidShadow,
      );
    case "simple":
      return classNames(variantBaseStyles.simple, palette.tonalBg);
    // `elevated` is Panel's fallback branch too.
    case "elevated":
    default:
      return variantBaseStyles.elevated;
  }
});

const rootClass = computed(() =>
  classNames(
    "flex flex-wrap items-center justify-between gap-2",
    variantClasses.value,
    getSurfaceCornerClass(props.corner),
    getSurfacePaddingClass(props.padding),
    classAttr.value,
  ),
);

const groupClass = "flex min-w-0 flex-wrap items-center gap-2";
</script>

<template>
  <div v-bind="restAttrs" role="toolbar" :class="rootClass">
    <!-- The regions stay in the DOM when empty (as in PrimeVue), so an
         `end`-only toolbar still parks its actions on the right. -->
    <div :class="groupClass">
      <slot name="start" />
    </div>
    <div :class="groupClass">
      <slot name="center" />
    </div>
    <div :class="groupClass">
      <slot name="end" />
    </div>
    <div v-if="$slots.default" :class="groupClass">
      <slot />
    </div>
  </div>
</template>
