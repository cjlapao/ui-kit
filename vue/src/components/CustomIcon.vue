<script lang="ts">
import type { IconName } from "../icons/registry";
import type { IconSize } from "../types/Icon";
import type { TrueColor } from "../theme/Theme";

export interface CustomIconProps {
  /** Name of the icon to display. */
  icon: IconName;
  /**
   * Accessible name. Omit it and the icon is treated as decoration and hidden
   * from assistive technology — which is right for an icon sitting beside a
   * label, and wrong for one standing on its own.
   */
  alt?: string;
  /** Explicit size in pixels or any CSS length, overriding `size`. */
  customSize?: number | string;
  /** Size on the shared control scale. @default "md" */
  size?: IconSize;
  /** Theme colour. Ignored when `colored` is set. */
  tone?: TrueColor;
  /**
   * Raw CSS colour, for a value outside the palette. Wins over `tone`.
   * Ignored when `colored` is set.
   */
  color?: string;
  /** Raw CSS colour on hover. Ignored when `colored` is set. */
  hoverColor?: string;
  /** Keep the icon's own colours instead of tinting it. */
  colored?: boolean;
  /** Spins the icon. Respects `prefers-reduced-motion`. */
  spin?: boolean;
  /**
   * Makes the icon activatable. It renders as a real `<button>` so it is
   * reachable by keyboard.
   */
  clickable?: boolean;
  disabled?: boolean;
}

const SIZE_CLASS_MAP: Record<IconSize, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
  xl: "h-8 w-8",
};

/** Warn once per missing name, not once per render. */
const warned = new Set<string>();
</script>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { iconRegistry } from "../icons/registry";
import { mergeClassTokens, hasExplicitSize } from "../utils/iconUtils";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "CustomIcon", inheritAttrs: false });

const props = withDefaults(defineProps<CustomIconProps>(), {
  size: "md",
  colored: false,
  spin: false,
  clickable: false,
  disabled: false,
});

const emit = defineEmits<{ (event: "click", payload: MouseEvent): void }>();

const { classAttr, restAttrs } = useClassAttrs();

const IconComponent = computed(() => iconRegistry[props.icon]);

watchEffect(() => {
  if (!IconComponent.value && props.icon && !warned.has(props.icon)) {
    warned.add(props.icon);
    console.warn(`Icon not found in registry: ${props.icon}`);
  }
});

const dimension = computed(() => {
  if (!props.customSize) return undefined;
  return typeof props.customSize === "number"
    ? `${props.customSize}px`
    : props.customSize;
});

const baseStyle = computed(() => {
  const style: Record<string, string> = {};
  if (dimension.value) {
    style.width = dimension.value;
    style.height = dimension.value;
  }
  if (!props.colored) {
    // The icons paint with `fill="currentColor"` / `stroke="currentColor"`, so
    // the CSS `color` property is what tints them. This used to set an
    // `--icon-color` custom property that nothing anywhere consumed, making
    // `color` and `hoverColor` two more props that did nothing.
    if (props.color) style.color = props.color;
    if (props.hoverColor) style["--icon-hover-color"] = props.hoverColor;
  }
  return style;
});

const sizeClass = computed(() =>
  !dimension.value && !hasExplicitSize(classAttr.value)
    ? SIZE_CLASS_MAP[props.size]
    : undefined,
);

const toneClass = computed(() =>
  !props.colored && !props.color && props.tone
    ? `text-${props.tone}-500 dark:text-${props.tone}-400`
    : undefined,
);

const sharedClass = computed(() =>
  mergeClassTokens(
    "inline-flex shrink-0 items-center justify-center",
    sizeClass.value,
    toneClass.value,
    // An inline style cannot express `:hover`, so the hover colour travels as
    // a custom property and `.custom-icon` consumes it.
    props.hoverColor && !props.colored
      ? "custom-icon transition-colors"
      : undefined,
    props.spin ? "animate-spin motion-reduce:animate-none" : undefined,
    props.disabled ? "pointer-events-none opacity-50" : undefined,
    classAttr.value,
  ),
);

const buttonClass = computed(() =>
  mergeClassTokens(
    sharedClass.value,
    "cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
  ),
);

const decorative = computed(() => !props.alt);
</script>

<template>
  <button
    v-if="clickable"
    v-bind="restAttrs"
    type="button"
    :class="buttonClass"
    :style="baseStyle"
    :disabled="disabled"
    :aria-label="alt"
    @click="(event: MouseEvent) => emit('click', event)"
  >
    <component
      :is="IconComponent"
      v-if="IconComponent"
      class="h-full w-full"
      aria-hidden="true"
      focusable="false"
    />
    <span
      v-else
      class="grid h-full w-full place-items-center rounded bg-neutral-100 text-[0.6em] font-bold uppercase text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
    >
      {{ icon?.charAt(0) || "?" }}
    </span>
  </button>
  <span
    v-else
    v-bind="restAttrs"
    :class="sharedClass"
    :style="baseStyle"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : alt"
    :aria-hidden="decorative || undefined"
  >
    <component
      :is="IconComponent"
      v-if="IconComponent"
      class="h-full w-full"
      aria-hidden="true"
      focusable="false"
    />
    <!-- The fallback used to drop every computed class, so a missing icon had
         no size at all unless `customSize` was given. -->
    <span
      v-else
      class="grid h-full w-full place-items-center rounded bg-neutral-100 text-[0.6em] font-bold uppercase text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
    >
      {{ icon?.charAt(0) || "?" }}
    </span>
  </span>
</template>
