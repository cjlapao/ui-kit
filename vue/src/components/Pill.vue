<script lang="ts">
import type { VNode } from "vue";
import type { ControlSize, TrueColor } from "../theme/Theme";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
} from "../theme/glass";

export const PILL_VARIANTS = [
  "solid",
  "soft",
  "outline",
  "glass",
  "liquid-glass",
] as const;
export type PillVariant = (typeof PILL_VARIANTS)[number];
/** The shared control scale — it used to be its own four-step union. */
export type PillSize = ControlSize;
export type PillTone = TrueColor;

/**
 * Corner scale for a pill. Deliberately not `SurfaceCorner` — that scale is
 * tuned for cards, where `rounded-md` means 16px, which on a 24px-tall pill is
 * almost a capsule anyway.
 */
export const PILL_CORNERS = ["none", "sm", "md", "lg", "full"] as const;
export type PillCorner = (typeof PILL_CORNERS)[number];

const CORNER_CLASSES: Record<PillCorner, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const SIZE_STYLES: Record<PillSize, string> = {
  xs: "text-[11px] h-4 px-2 gap-1",
  sm: "text-[12px] h-5 px-2.5 gap-1",
  md: "text-xs h-6 px-3 gap-1.5",
  lg: "text-sm h-7 px-4 gap-1.5",
  xl: "text-sm h-8 px-5 gap-2",
};

/** Matches `Badge`'s dot ladder, so the two line up at the same size. */
const DOT_STYLES: Record<PillSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
};

const ICON_SIZE: Record<PillSize, "xs" | "sm"> = {
  xs: "xs",
  sm: "xs",
  md: "xs",
  lg: "sm",
  xl: "sm",
};

export interface PillProps {
  tone?: PillTone;
  /** @default "soft" */
  variant?: PillVariant;
  /** @default "md" */
  size?: PillSize;
  /** @default "full" */
  corner?: PillCorner;
  uppercase?: boolean;
  /** Glass fill transparency, for the see-through variants. @default "frosted" */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, for the see-through variants. */
  vibrancy?: GlassVibrancy;
  /**
   * Specular highlight. `liquid-glass` defaults to `classic`; plain `glass`
   * defaults to none, which is the difference between the two.
   */
  specularMode?: SpecularMode;
  /** Icon before the label. A registry name, or a node via the slot. */
  icon?: string | VNode;
  /** Icon after the label. */
  trailingIcon?: string | VNode;
  /**
   * Renders as a bare status dot with no label. Any content, icon or remove
   * button is dropped, so it stays a dot.
   */
  dot?: boolean;
  /** Shows a remove button, which emits `remove`. */
  removable?: boolean;
  /** Accessible name for that button. @default "Remove" */
  removeLabel?: string;
  /** Makes the whole pill activatable — it renders as a real `<button>`. */
  clickable?: boolean;
  disabled?: boolean;
  /** Truncates a long label instead of stretching the pill. */
  maxWidth?: number | string;
  /**
   * Accessible name for a `dot`, which has no text of its own. Without one the
   * dot is treated as decoration and hidden.
   */
  label?: string;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { useKitT } from "../i18n";
import CustomIcon from "./CustomIcon.vue";
import { getPillColorClasses } from "../theme/Theme";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
} from "../theme/glass";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Pill", inheritAttrs: false });

const props = withDefaults(defineProps<PillProps>(), {
  tone: "blue",
  variant: "soft",
  size: "md",
  corner: "full",
  uppercase: false,
  glassOpacity: "frosted",
  vibrancy: "medium",
  dot: false,
  removable: false,
  clickable: false,
  disabled: false,
});

const t = useKitT();

const emit = defineEmits<{
  (event: "remove"): void;
  (event: "click", payload: MouseEvent): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

/** The two see-through variants, which take the glass props. */
const GLASS_VARIANTS = new Set(["glass", "liquid-glass"]);

const isGlass = computed(() => GLASS_VARIANTS.has(props.variant));
const isInteractive = computed(() => props.clickable || props.removable);

// The tone map only covers the opaque variants; a glass pill drops them
// entirely — they paint a solid fill — and takes its rim, copy colour and focus
// ring from the shared glass chrome instead.
const toneTokens = computed(() =>
  isGlass.value
    ? { base: undefined, border: undefined }
    : getPillColorClasses(
        props.tone,
        props.variant as "solid" | "soft" | "outline",
      ),
);

const glassClasses = computed(() =>
  isGlass.value
    ? classNames(
        // `liquid-glass` is the heavier treatment: more blur, and a specular
        // highlight by default. Proportionate to a pill — Panel uses xl/2xl
        // for a whole card.
        props.variant === "liquid-glass"
          ? "backdrop-blur-md"
          : "backdrop-blur-sm",
        getGlassFillClass(props.tone, props.glassOpacity),
        getGlassVibrancyClass(props.vibrancy),
        getGlassChromeClasses(props.tone, { interactive: isInteractive.value }),
      )
    : undefined,
);

const specularClasses = computed(() => {
  if (!isGlass.value) return null;
  const mode: SpecularMode =
    props.specularMode ??
    (props.variant === "liquid-glass" ? "classic" : "none");
  return getSpecularClasses(mode);
});
const iconSize = computed(() => ICON_SIZE[props.size] ?? "xs");

// The size token is left off entirely for a dot rather than overridden. It used
// to be applied and then "cancelled" by `h-2 px-0` in the same class list — two
// utilities at the same specificity, so emission order decided, and `h-6` won.
// A dot rendered as a full-size lozenge.
const dotClass = computed(() =>
  classNames(
    "inline-block shrink-0 rounded-full",
    DOT_STYLES[props.size] ?? DOT_STYLES.md,
    toneTokens.value.base,
    toneTokens.value.border,
    glassClasses.value,
    props.disabled && "opacity-50",
    classAttr.value,
  ),
);

const pillClass = computed(() =>
  classNames(
    "inline-flex max-w-full items-center justify-center leading-none",
    CORNER_CLASSES[props.corner] ?? CORNER_CLASSES.full,
    SIZE_STYLES[props.size] ?? SIZE_STYLES.md,
    toneTokens.value.base,
    toneTokens.value.border,
    isGlass.value && "relative overflow-hidden",
    glassClasses.value,
    props.uppercase && "uppercase tracking-wide",
    props.disabled && "opacity-50",
    props.clickable &&
      "cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
    classAttr.value,
  ),
);

const pillStyle = computed(() =>
  props.maxWidth === undefined
    ? undefined
    : {
        maxWidth:
          typeof props.maxWidth === "number"
            ? `${props.maxWidth}px`
            : props.maxWidth,
      },
);
</script>

<template>
  <span
    v-if="dot"
    v-bind="restAttrs"
    :class="dotClass"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
  />
  <component
    v-else
    :is="clickable ? 'button' : 'span'"
    v-bind="restAttrs"
    :type="clickable ? 'button' : undefined"
    :disabled="clickable ? disabled : undefined"
    :class="pillClass"
    :style="pillStyle"
    @click="clickable && emit('click', $event)"
  >
    <span
      v-if="specularClasses"
      aria-hidden="true"
      :class="
        classNames('pointer-events-none absolute inset-0 rounded-[inherit]', specularClasses)
      "
    />
    <span v-if="icon || $slots.icon" class="flex shrink-0 items-center text-inherit">
      <slot name="icon">
        <CustomIcon v-if="typeof icon === 'string'" :icon="icon as never" :size="iconSize" />
        <component :is="icon" v-else />
      </slot>
    </span>
    <span :class="maxWidth !== undefined && 'truncate'">
      <slot />
    </span>
    <span
      v-if="trailingIcon || $slots.trailingIcon"
      class="flex shrink-0 items-center text-inherit"
    >
      <slot name="trailingIcon">
        <CustomIcon
          v-if="typeof trailingIcon === 'string'"
          :icon="trailingIcon as never"
          :size="iconSize"
        />
        <component :is="trailingIcon" v-else />
      </slot>
    </span>
    <button
      v-if="removable"
      type="button"
      :disabled="disabled"
      :aria-label="removeLabel ?? t('kit.pill.remove')"
      class="-mr-1 flex shrink-0 items-center rounded-full p-0.5 opacity-70 transition hover:bg-black/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current disabled:pointer-events-none dark:hover:bg-white/20"
      @click.stop="emit('remove')"
    >
      <CustomIcon icon="Close" size="xs" />
    </button>
  </component>
</template>
