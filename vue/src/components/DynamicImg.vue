<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

export type DynamicImgSize = ControlSize;

export interface DynamicImgProps {
  /**
   * A data URL (`data:image/svg+xml;base64,…`, PNG, JPEG, GIF, WebP, AVIF) or
   * raw `<svg>` markup.
   */
  src?: string;
  /** @deprecated Use `src`. Accepts the same values. */
  base64?: string;
  /**
   * Accessible name. Omit it and the image is treated as decoration and hidden
   * from assistive technology — the old `alt="Dynamic Image"` was neither a
   * useful name nor a way to opt out.
   */
  alt?: string;
  /** Icon shown when there is nothing to render, or the SVG is rejected. */
  fallbackIcon?: string;
  /** @default "md" */
  size?: DynamicImgSize;
  /** Theme colour for a recoloured SVG. */
  tone?: TrueColor;
  /** Raw fill colour for an SVG. Defaults to `currentColor`. */
  fill?: string;
  /** Raw stroke colour for an SVG. Defaults to `currentColor`. */
  stroke?: string;
  /** Keep the SVG's own colours instead of recolouring it. */
  colored?: boolean;
  title?: string;
}

const SIZE_CLASSES: Record<DynamicImgSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import CustomIcon from "./CustomIcon.vue";
import { parseImageSource, sanitizeSvg } from "../utils/sanitizeSvg";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "DynamicImg", inheritAttrs: false });

const props = withDefaults(defineProps<DynamicImgProps>(), {
  fallbackIcon: "Image",
  size: "md",
  colored: false,
});

const { classAttr, restAttrs } = useClassAttrs();

const value = computed(() => props.src ?? props.base64 ?? "");
const sizeClass = computed(() => SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md);
const toneClass = computed(() =>
  !props.colored && !props.fill && props.tone
    ? `text-${props.tone}-500 dark:text-${props.tone}-400`
    : undefined,
);

const parsed = computed(() => parseImageSource(value.value));

const markup = computed(() => {
  const source = parsed.value;
  if (!source || source.kind !== "svg" || !source.markup) return null;
  // Every path here is caller data, so it goes through the allowlist sanitiser
  // before it can reach `v-html`.
  return sanitizeSvg(
    source.markup,
    props.colored
      ? {}
      : {
          fill: props.fill ?? "currentColor",
          stroke: props.stroke ?? "currentColor",
        },
  );
});

const decorative = computed(() => !props.alt);

// Rejected markup falls back to the placeholder. It is never rendered raw.
const showFallback = computed(
  () => !parsed.value || (parsed.value.kind === "svg" && !markup.value),
);

const svgClass = computed(() =>
  classNames(
    // No `text-current` here: it sets `color: currentColor`, which is what
    // inheritance already does, and it collides with the tone class at the same
    // specificity — so which one wins is decided by whichever Tailwind happened
    // to emit last.
    "inline-flex select-none items-center justify-center",
    "[&>svg]:h-full [&>svg]:w-full",
    sizeClass.value,
    toneClass.value,
    classAttr.value,
  ),
);

// The raster branch used to ignore `size` entirely, so a PNG rendered at its
// natural dimensions while an SVG respected the scale.
const imgClass = computed(() =>
  classNames("object-contain", sizeClass.value, classAttr.value),
);
</script>

<template>
  <CustomIcon
    v-if="showFallback"
    :icon="fallbackIcon as never"
    :size="size"
    :alt="alt"
  />
  <img
    v-else-if="parsed!.kind === 'raster'"
    v-bind="restAttrs"
    :src="parsed!.src"
    :alt="alt ?? ''"
    :aria-hidden="decorative || undefined"
    :title="title"
    :class="imgClass"
  />
  <!-- Sanitised above: allowlisted elements and attributes only, no script, no
       event handlers, no external references. -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span
    v-else
    v-bind="restAttrs"
    :class="svgClass"
    :title="title"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : alt"
    :aria-hidden="decorative || undefined"
    v-html="markup"
  />
</template>
