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

watch([hasOptions, open], () => {
  if (!hasOptions.value && open.value) {
    open.value = false;
  }
});

const mainButtonClass = computed(() =>
  classNames(
    props.split && showCaret.value && "rounded-r-none",
    props.fullWidth ? "flex-1" : "",
  ),
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
  <div ref="anchorEl" :class="containerClasses">
    <Button
      type="button"
      v-bind="{ ...mainButtonProps, ...mainButtonAttrs }"
      :variant="variant"
      :color="color"
      :size="size"
      :class="mainButtonClass"
      :disabled="disabled"
      @click="handlePrimaryClick"
    >
      <slot>{{ label }}</slot>
    </Button>
    <Button
      v-if="showCaret"
      type="button"
      :variant="variant"
      :color="color"
      :size="size"
      icon-only
      aria-label="Toggle dropdown menu"
      :leading-icon="dropdownIcon"
      data-dropdown-caret
      :class="caretButtonClass"
      :disabled="disabled || options.length === 0"
      @click="handleCaretToggle"
    />
    <DropdownMenu
      :anchor-ref="anchorEl"
      :open="open && hasOptions && showCaret"
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
