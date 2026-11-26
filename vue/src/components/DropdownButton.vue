<script lang="ts">
import type { ButtonProps, ButtonSize } from "./Button.vue";
import type { DropdownMenuOption } from "./DropdownMenu.vue";

export interface DropdownButtonOption extends DropdownMenuOption {
  value: string;
}

export interface DropdownButtonProps
  extends Omit<
    ButtonProps,
    "leadingIcon" | "trailingIcon" | "iconOnly" | "fullWidth"
  > {
  label?: string;
  options: DropdownButtonOption[];
  dropdownIcon?: ButtonProps["leadingIcon"];
  fullWidth?: boolean;
  split?: boolean;
  /**
   * Hide the dropdown caret trigger when there are no menu options.
   * Defaults to true so empty split buttons render as a single clean button.
   */
  hideDropdownTriggerWhenEmpty?: boolean;
  menuWidth?: number | "trigger";
  menuClassName?: string;
  /**
   * CSS width of the whole control — main button and caret together. A number
   * is px, a string any CSS length. The label ellipsizes inside it rather than
   * pushing the control wider, so a toolbar row of split buttons keeps one
   * clean edge; pair it with `menuWidth="trigger"` to floor the popup at that
   * width. Applied as an inline style on the container, over any `class`
   * width. (The HTML `width` attribute a bare `width` prop used to reach is
   * meaningless on a `<button>`, which is why this is the only width here.)
   */
  width?: number | string;
  /**
   * Cap on a content-sized control — a number is px. Long labels ellipize at
   * this width instead of widening the control past the row it belongs to.
   */
  maxWidth?: number | string;
}

const caretWidthMap: Record<ButtonSize, string> = {
  xs: "min-w-[2rem]",
  sm: "min-w-[2.25rem]",
  md: "min-w-[2.5rem]",
  lg: "min-w-[2.75rem]",
  xl: "min-w-[3rem]",
};

const caretIconClassMap: Record<ButtonSize, string> = {
  xs: "[&>svg]:h-3 [&>svg]:w-3 [&>svg]:min-w-[0.75rem]",
  sm: "[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:min-w-[0.875rem]",
  md: "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:min-w-4",
  lg: "[&>svg]:h-4.5 [&>svg]:w-4.5 [&>svg]:min-w-[1.125rem]",
  xl: "[&>svg]:h-5 [&>svg]:w-5 [&>svg]:min-w-[1.25rem]",
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import classNames from "classnames";
import { cssLength, hasCssLength } from "../../../common/utils/cssLength";
import { useClassAttrs } from "../utils/attrsUtils";
import Button from "./Button.vue";
import DropdownMenu from "./DropdownMenu.vue";

defineOptions({ name: "DropdownButton", inheritAttrs: false });

const props = withDefaults(defineProps<DropdownButtonProps>(), {
  dropdownIcon: "ArrowDown",
  variant: "solid",
  color: "blue",
  size: "md",
  fullWidth: false,
  split: true,
  hideDropdownTriggerWhenEmpty: true,
  menuWidth: 220,
});

const emit = defineEmits<{
  primaryClick: [event: MouseEvent];
  optionSelect: [option: DropdownButtonOption];
}>();

const { classAttr, restAttrs } = useClassAttrs();

const open = ref(false);
const anchorEl = ref<HTMLDivElement | null>(null);

const containerClasses = computed(() =>
  classNames(
    "inline-flex items-stretch",
    props.fullWidth && "w-full",
    classAttr.value,
  ),
);

const handleSelect = (option: DropdownMenuOption) => {
  emit("optionSelect", option as DropdownButtonOption);
  open.value = false;
};

// Fallthrough `onClick` mirrors React's intercepted rest `onClick`.
const mainButtonAttrs = computed(() => {
  const { onClick: _onClick, ...rest } = restAttrs.value;
  return rest;
});

const handlePrimaryClick = (event: MouseEvent) => {
  const restOnClick = restAttrs.value.onClick as
    | ((e: MouseEvent) => void)
    | Array<(e: MouseEvent) => void>
    | undefined;
  if (Array.isArray(restOnClick)) {
    restOnClick.forEach((handler) => handler(event));
  } else {
    restOnClick?.(event);
  }
  emit("primaryClick", event);
};

const handleCaretToggle = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  open.value = !open.value;
};

// Remaining ButtonProps (weight, loading, accent, tooltip, ...) go to the
// main button only, mirroring React's `{...restButtonProps}`.
const mainButtonProps = computed(() => {
  const {
    label: _label,
    options: _options,
    dropdownIcon: _dropdownIcon,
    fullWidth: _fullWidth,
    split: _split,
    hideDropdownTriggerWhenEmpty: _hideDropdownTriggerWhenEmpty,
    menuWidth: _menuWidth,
    menuClassName: _menuClassName,
    width: _width,
    maxWidth: _maxWidth,
    variant: _variant,
    color: _color,
    size: _size,
    disabled: _disabled,
    ...restButtonProps
  } = props;
  return restButtonProps;
});

const menuOptions = computed(() => props.options ?? []);
const hasOptions = computed(() => menuOptions.value.length > 0);
const showCaret = computed(
  () => hasOptions.value || !props.hideDropdownTriggerWhenEmpty,
);
const menuOpen = computed(() => open.value && hasOptions.value && showCaret.value);

// True when the caller pinned a width — the trigger for the label-shrinks
// treatment below, so an unsized control keeps its exact DOM and wrapping.
const sized = computed(() => hasCssLength(props.width, props.maxWidth));

watch([hasOptions, open], () => {
  if (!hasOptions.value && open.value) {
    open.value = false;
  }
});

const mainButtonClass = computed(() =>
  classNames(
    props.split && showCaret.value && "rounded-r-none",
    props.fullWidth ? "flex-1" : "",
    // Only a sized control pays for the shrink chain: `min-w-0` on the main
    // button (the flex item) plus `truncate` on the label is what makes a long
    // label ellipize instead of widening the control past the row.
    sized.value && "min-w-0",
  ),
);

// The container carries the width, so `menuWidth="trigger"` — which measures
// this element — sees the same number the caller asked for.
const containerStyle = computed(() =>
  sized.value
    ? { width: cssLength(props.width), maxWidth: cssLength(props.maxWidth) }
    : undefined,
);

const caretButtonClass = computed(() =>
  classNames(
    "rounded-l-none border-l border-white/20 text-inherit dark:border-white/10",
    props.split && caretWidthMap[props.size],
    caretIconClassMap[props.size],
  ),
);
</script>

<template>
  <div ref="anchorEl" :class="containerClasses" :style="containerStyle">
    <!-- The open popup owns the space under the trigger now, so a tip left
         floating there (portal, z 9999) would sit over the rows. Same rule
         `MenuButton` follows in React — and `menuOpen` wins over a caller's
         `tooltip-disabled: false`, which cannot mean "show it anyway". -->
    <Button
      type="button"
      v-bind="{ ...mainButtonProps, ...mainButtonAttrs }"
      :tooltip-disabled="menuOpen || props.tooltipDisabled"
      :variant="variant"
      :color="color"
      :size="size"
      :class="mainButtonClass"
      :disabled="disabled"
      @click="handlePrimaryClick"
    >
      <!-- Two branches rather than one always-present span: an unsized control
           renders exactly what it rendered before, slot and all. -->
      <span v-if="sized" class="min-w-0 truncate"><slot>{{ label }}</slot></span>
      <slot v-else>{{ label }}</slot>
    </Button>
    <Button
      v-if="showCaret"
      type="button"
      :variant="variant"
      :color="color"
      :size="size"
      icon-only
      aria-label="Toggle dropdown menu"
      aria-haspopup="menu"
      :aria-expanded="menuOpen"
      :leading-icon="dropdownIcon"
      data-dropdown-caret
      :class="caretButtonClass"
      :disabled="disabled || options.length === 0"
      @click="handleCaretToggle"
    />
    <DropdownMenu
      :anchor-ref="anchorEl"
      :open="menuOpen"
      :items="menuOptions"
      :width="menuWidth"
      align="end"
      side="auto"
      :class="menuClassName"
      @close="open = false"
      @select="handleSelect"
    />
  </div>
</template>
