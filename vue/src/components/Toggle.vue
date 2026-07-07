<script lang="ts">
import type { VNode } from "vue";
import type { ThemeColor } from "../theme/Theme";
import type { TooltipPosition } from "./Tooltip.vue";
import type { GlassVibrancy, GlassOpacity, SpecularMode } from "../../../common/theme/glass";

export type ToggleSize = "sm" | "md" | "lg";
export type ToggleAlign = "left" | "right";
export type ToggleDescriptionPlacement = "inline" | "stacked";
export type TogglePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type ToggleVariant = "default" | "glass";

const paddingStyles: Record<TogglePadding, string> = {
  none: "",
  xs: "p-0.5",
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
  xl: "p-3",
};

export interface ToggleProps {
  /** Controlled checked state (v-model). */
  modelValue?: boolean;
  id?: string;
  label?: string;
  description?: string;
  descriptionPlacement?: ToggleDescriptionPlacement;
  size?: ToggleSize;
  padding?: TogglePadding;
  color?: ThemeColor;
  alignLabel?: ToggleAlign;
  iconOn?: string | VNode;
  iconOff?: string | VNode;
  fullWidth?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  /** When set, a styled tooltip is shown on hover. */
  tooltip?: string;
  /** Position of the tooltip relative to the toggle. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
  /** Visual variant of the toggle track. */
  variant?: ToggleVariant;
  /** Backdrop vibrancy level for glass surfaces. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for glass surfaces. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for glass surfaces. */
  specularMode?: SpecularMode;
}

const sizeTokens: Record<
  ToggleSize,
  {
    track: string;
    thumb: string;
    thumbOffset: string;
    thumbTranslate: string;
    gap: string;
    font: string;
    description: string;
  }
> = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-4 w-4",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-4",
    gap: "gap-2",
    font: "text-sm",
    description: "text-xs",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-5",
    gap: "gap-3",
    font: "text-sm",
    description: "text-xs",
  },
  lg: {
    track: "h-7 w-14",
    thumb: "h-6 w-6",
    thumbOffset: "top-1 left-1",
    thumbTranslate: "peer-checked:translate-x-6",
    gap: "gap-3.5",
    font: "text-base",
    description: "text-sm",
  },
};

const iconWrapSize: Record<ToggleSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};
</script>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import classNames from "classnames";
import { getToggleColorClasses } from "../theme/Theme";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import TooltipWrapper from "./TooltipWrapper.vue";
import VNodeRenderer from "./internal/VNodeRenderer";
import {
  getGlassFillClass as _getGlassFillClass,
  getGlassVibrancyClass as _getGlassVibrancyClass,
  getSpecularClasses as _getSpecularClasses,
  resolveColor as _resolveColor,
} from "../../../common/theme/glass";

defineOptions({ name: "Toggle", inheritAttrs: false });

const props = withDefaults(defineProps<ToggleProps>(), {
  descriptionPlacement: "stacked",
  size: "md",
  padding: "sm",
  color: "blue",
  alignLabel: "right",
  fullWidth: false,
  disabled: false,
  readonly: false,
  variant: "default",
  vibrancy: "medium",
  glassOpacity: "frosted",
  specularMode: "none",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", event: Event): void;
}>();

const slots = defineSlots<{
  label?: () => unknown;
  description?: () => unknown;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const generatedId = useId();
const toggleId = computed(() => props.id ?? generatedId);

const el = ref<HTMLInputElement | null>(null);
defineExpose({ el });

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label));
const hasDescription = computed(
  () => Boolean(props.description) || Boolean(slots.description),
);
const descriptionId = computed(() =>
  hasDescription.value ? `${toggleId.value}-description` : undefined,
);

const sizeStyles = computed(() => sizeTokens[props.size] ?? sizeTokens.md);
const colorStyles = computed(() => getToggleColorClasses(props.color));
const isGlass = computed(() => props.variant === "glass");

const rootClass = computed(() =>
  classNames(
    "group flex select-none items-center",
    props.alignLabel === "left" ? "flex-row-reverse" : "flex-row",
    sizeStyles.value.gap,
    paddingStyles[props.padding],
    props.fullWidth && "w-full",
    props.disabled && "cursor-not-allowed opacity-60",
    props.readonly && !props.disabled && "cursor-default",
    !props.disabled && !props.readonly && "cursor-pointer",
    classAttr.value,
  ),
);

const inputClass = computed(() =>
  classNames(
    "peer sr-only peer-focus:ring-0",
    props.disabled
      ? "cursor-not-allowed"
      : props.readonly
        ? "cursor-default"
        : "cursor-pointer",
  ),
);

const trackClass = computed(() =>
  classNames(
    "block relative rounded-full overflow-hidden border border-transparent bg-neutral-200 dark:bg-neutral-600 transition-colors duration-200 ease-in-out peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2",
    sizeStyles.value.track,
    isGlass.value
      ? classNames(
          "backdrop-blur-sm",
          _getGlassFillClass(props.color, props.glassOpacity),
          _getGlassVibrancyClass(props.vibrancy),
          `peer-focus:ring-${_resolveColor(props.color)}-400/50`,
        )
      : colorStyles.value,
    props.disabled && "opacity-70 peer-checked:opacity-70 dark:opacity-50",
  ),
);

const effectiveSpecularMode = computed(() =>
  isGlass.value ? props.specularMode : "none",
);

const specularOverlayClasses = computed(() =>
  _getSpecularClasses(effectiveSpecularMode.value),
);

const iconOffClass = computed(() =>
  classNames(
    "pointer-events-none absolute inset-y-0 left-1 flex items-center text-neutral-400 transition-opacity duration-200 ease-in-out",
    iconWrapSize[props.size],
    "peer-checked:opacity-0",
  ),
);

const iconOnClass = computed(() =>
  classNames(
    "pointer-events-none text-black absolute inset-y-0 right-1 flex items-center text-black opacity-0 transition-opacity duration-200 ease-in-out",
    iconWrapSize[props.size],
    "peer-checked:opacity-100",
  ),
);

const thumbClass = computed(() =>
  classNames(
    "pointer-events-none absolute transform rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ease-in-out dark:ring-white/10 dark:bg-neutral-200",
    "translate-x-0",
    sizeStyles.value.thumb,
    sizeStyles.value.thumbOffset,
    sizeStyles.value.thumbTranslate,
  ),
);

const labelTextClass = computed(() =>
  classNames(
    sizeStyles.value.font,
    "font-medium leading-tight text-neutral-900 dark:text-neutral-100 mt-0.5",
    props.disabled && "text-neutral-400 dark:text-neutral-300",
  ),
);

const descriptionTextClass = computed(() =>
  classNames(
    sizeStyles.value.description,
    "text-neutral-400 dark:text-neutral-300",
    props.descriptionPlacement === "stacked" && "mt-1",
    props.disabled && "text-neutral-300 dark:text-neutral-400",
  ),
);

const labelBlockClass = computed(() =>
  classNames(
    "min-w-0",
    props.descriptionPlacement === "inline"
      ? "flex flex-wrap items-center gap-2 text-neutral-900 dark:text-neutral-100"
      : "flex flex-col",
    props.descriptionPlacement === "inline" &&
      !hasLabel.value &&
      "text-neutral-400 dark:text-neutral-300",
  ),
);

const handleLabelClick = (e: MouseEvent) => {
  if (props.readonly) {
    e.preventDefault();
  }
};

const handleInputClick = (e: MouseEvent) => {
  if (props.readonly) {
    e.preventDefault();
  }
};

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
  emit("change", e);
};
</script>

<template>
  <TooltipWrapper v-if="tooltip" :text="tooltip" :position="tooltipPosition">
    <label
      :data-glass="isGlass"
      :class="rootClass"
      @click="handleLabelClick"
    >
      <span class="relative inline-flex shrink-0">
        <input
          :id="toggleId"
          ref="el"
          type="checkbox"
          role="switch"
          :class="inputClass"
          :aria-describedby="descriptionId"
          :disabled="disabled"
          :readonly="readonly"
          :checked="modelValue"
          v-bind="restAttrs"
          @change="handleChange"
          @click="handleInputClick"
        />

        <span aria-hidden="true" :class="trackClass">
          <div
            v-if="isGlass && specularOverlayClasses"
            aria-hidden="true"
            :class="specularOverlayClasses"
          />
        </span>

        <span v-if="iconOff" :class="iconOffClass">
          <VNodeRenderer :nodes="renderIcon(iconOff, 'sm')" />
        </span>

        <span v-if="iconOn" :class="iconOnClass">
          <VNodeRenderer :nodes="renderIcon(iconOn, 'sm')" />
        </span>

        <span :class="thumbClass" />
      </span>
      <span v-if="hasLabel || hasDescription" :class="labelBlockClass">
        <span v-if="hasLabel" :class="labelTextClass">
          <slot name="label">{{ label }}</slot>
        </span>
        <span
          v-if="hasDescription"
          :id="descriptionId"
          :class="descriptionTextClass"
        >
          <slot name="description">{{ description }}</slot>
        </span>
      </span>
    </label>
  </TooltipWrapper>
  <label
    v-else
    :data-glass="isGlass"
    :class="rootClass"
    @click="handleLabelClick"
  >
    <span class="relative inline-flex shrink-0">
      <input
        :id="toggleId"
        ref="el"
        type="checkbox"
        role="switch"
        :class="inputClass"
        :aria-describedby="descriptionId"
        :disabled="disabled"
        :readonly="readonly"
        :checked="modelValue"
        v-bind="restAttrs"
        @change="handleChange"
        @click="handleInputClick"
      />

      <span aria-hidden="true" :class="trackClass">
        <div
          v-if="isGlass && specularOverlayClasses"
          aria-hidden="true"
          :class="specularOverlayClasses"
        />
      </span>

      <span v-if="iconOff" :class="iconOffClass">
        <VNodeRenderer :nodes="renderIcon(iconOff, 'sm')" />
      </span>

      <span v-if="iconOn" :class="iconOnClass">
        <VNodeRenderer :nodes="renderIcon(iconOn, 'sm')" />
      </span>

      <span :class="thumbClass" />
    </span>
    <span v-if="hasLabel || hasDescription" :class="labelBlockClass">
      <span v-if="hasLabel" :class="labelTextClass">
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="hasDescription"
        :id="descriptionId"
        :class="descriptionTextClass"
      >
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </label>
</template>