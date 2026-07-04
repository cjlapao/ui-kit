<script lang="ts">
import type { VNode } from "vue";
import type { ThemeColor } from "../theme/Theme";

// Mirrors React's `(Select as ...).__UI_SELECT = true` marker used by InputGroup.
export default {
  name: "Select",
  inheritAttrs: false,
  __UI_SELECT: true,
};

type SelectSize = "sm" | "md" | "lg";
type SelectValidationStatus = "none" | "error" | "success";

const sizeStyles: Record<
  SelectSize,
  {
    select: string;
    iconSize: string;
    iconRight: string;
  }
> = {
  sm: {
    select: "px-3 py-1.5 text-sm pr-9",
    iconSize: "h-4 w-4",
    iconRight: "right-3",
  },
  md: {
    select: "px-3.5 py-2.5 text-sm pr-10",
    iconSize: "h-5 w-5",
    iconRight: "right-3.5",
  },
  lg: {
    select: "px-4 py-3 text-base pr-11",
    iconSize: "h-5 w-5",
    iconRight: "right-4",
  },
};

type SelectToneTokens = {
  focusRing: string;
  icon: string;
};

const toneTokens: Partial<Record<ThemeColor, SelectToneTokens>> = {
  parallels: {
    focusRing: "focus:border-red-400 focus:ring-2 focus:ring-red-400/60",
    icon: "text-red-500 dark:text-red-300",
  },
  theme: {
    focusRing: "focus:border-red-400 focus:ring-2 focus:ring-red-400/60",
    icon: "text-red-500 dark:text-red-300",
  },
  brand: {
    focusRing: "focus:border-red-400 focus:ring-2 focus:ring-red-400/60",
    icon: "text-red-500 dark:text-red-300",
  },
  red: {
    focusRing: "focus:border-red-400 focus:ring-2 focus:ring-red-400/60",
    icon: "text-red-500 dark:text-red-300",
  },
  orange: {
    focusRing: "focus:border-orange-400 focus:ring-2 focus:ring-orange-400/60",
    icon: "text-orange-500 dark:text-orange-300",
  },
  amber: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    icon: "text-amber-500 dark:text-amber-300",
  },
  yellow: {
    focusRing: "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/60",
    icon: "text-yellow-500 dark:text-yellow-300",
  },
  lime: {
    focusRing: "focus:border-lime-400 focus:ring-2 focus:ring-lime-400/60",
    icon: "text-lime-500 dark:text-lime-300",
  },
  green: {
    focusRing: "focus:border-green-400 focus:ring-2 focus:ring-green-400/60",
    icon: "text-green-500 dark:text-green-300",
  },
  emerald: {
    focusRing:
      "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    icon: "text-emerald-500 dark:text-emerald-300",
  },
  teal: {
    focusRing: "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/60",
    icon: "text-teal-500 dark:text-teal-300",
  },
  cyan: {
    focusRing: "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/60",
    icon: "text-cyan-500 dark:text-cyan-300",
  },
  sky: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    icon: "text-sky-500 dark:text-sky-300",
  },
  blue: {
    focusRing: "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/60",
    icon: "text-blue-500 dark:text-blue-300",
  },
  indigo: {
    focusRing: "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60",
    icon: "text-indigo-500 dark:text-indigo-300",
  },
  violet: {
    focusRing: "focus:border-violet-400 focus:ring-2 focus:ring-violet-400/60",
    icon: "text-violet-500 dark:text-violet-300",
  },
  purple: {
    focusRing: "focus:border-purple-400 focus:ring-2 focus:ring-purple-400/60",
    icon: "text-purple-500 dark:text-purple-300",
  },
  fuchsia: {
    focusRing:
      "focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/60",
    icon: "text-fuchsia-500 dark:text-fuchsia-300",
  },
  pink: {
    focusRing: "focus:border-pink-400 focus:ring-2 focus:ring-pink-400/60",
    icon: "text-pink-500 dark:text-pink-300",
  },
  rose: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    icon: "text-rose-500 dark:text-rose-300",
  },
  slate: {
    focusRing: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/60",
    icon: "text-slate-500 dark:text-slate-200",
  },
  gray: {
    focusRing:
      "focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/60",
    icon: "text-neutral-500 dark:text-neutral-200",
  },
  zinc: {
    focusRing:
      "focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/60",
    icon: "text-neutral-500 dark:text-neutral-200",
  },
  neutral: {
    focusRing:
      "focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/60",
    icon: "text-neutral-500 dark:text-neutral-200",
  },
  stone: {
    focusRing:
      "focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/60",
    icon: "text-neutral-500 dark:text-neutral-200",
  },
  white: {
    focusRing: "focus:border-slate-400 focus:ring-2 focus:ring-slate-400/60",
    icon: "text-slate-400 dark:text-slate-200",
  },
  success: {
    focusRing:
      "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    icon: "text-emerald-500 dark:text-emerald-300",
  },
  warning: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    icon: "text-amber-500 dark:text-amber-300",
  },
  danger: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    icon: "text-rose-500 dark:text-rose-300",
  },
  info: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    icon: "text-sky-500 dark:text-sky-300",
  },
};

const statusClasses: Record<Exclude<SelectValidationStatus, "none">, string> = {
  error:
    "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 text-neutral-900 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60 dark:text-neutral-100",
  success:
    "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/60 text-neutral-900 dark:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/60 dark:text-neutral-100",
};

const disabledClasses =
  "disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none dark:disabled:border-neutral-700 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500";

export interface SelectProps {
  modelValue?: string;
  size?: SelectSize;
  tone?: ThemeColor;
  validationStatus?: SelectValidationStatus;
  placeholder?: string;
  leadingIcon?: string | VNode;
  hideCaret?: boolean;
  unstyled?: boolean;
  disabled?: boolean;
  multiple?: boolean;
}
</script>

<script setup lang="ts">
import {
  cloneVNode,
  computed,
  h,
  isVNode,
  ref,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

const props = withDefaults(defineProps<SelectProps>(), {
  size: "md",
  tone: "blue",
  validationStatus: "none",
  hideCaret: false,
  unstyled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [event: Event];
}>();

const renderIconFn = useIconRenderer();
const { classAttr, restAttrs } = useClassAttrs();

const el = ref<HTMLSelectElement | null>(null);
defineExpose({ el });

const sizeToken = computed(() => sizeStyles[props.size] ?? sizeStyles.md);
const tokens = computed(
  () => (toneTokens[props.tone] ?? toneTokens.theme) as SelectToneTokens,
);
const hasLeadingIcon = computed(() => Boolean(props.leadingIcon));
const showCaret = computed(() => !props.hideCaret && !props.multiple);

const renderVisual = (
  visual: string | VNode | undefined,
  iconClassName: string,
): VNodeChild => {
  if (!visual) {
    return null;
  }
  if (typeof visual === "string") {
    return renderIconFn(visual, undefined, iconClassName);
  }
  if (isVNode(visual)) {
    // cloneVNode merges the extra class with the vnode's existing class,
    // mirroring React's cloneElement + classNames merge.
    return cloneVNode(visual, { class: iconClassName });
  }
  return h("span", { class: iconClassName }, [visual]);
};

const baseClasses = computed(() =>
  classNames(
    "block w-full appearance-none text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500",
    props.multiple ? "py-2 pr-3" : sizeToken.value.select,
    !props.unstyled &&
      "rounded-lg border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
    disabledClasses,
    classAttr.value,
  ),
);

const statusClass = computed(() =>
  props.validationStatus !== "none" && !props.unstyled
    ? statusClasses[props.validationStatus]
    : undefined,
);

const focusClass = computed(() =>
  !props.unstyled
    ? tokens.value.focusRing
    : "focus:ring-0 focus:border-transparent",
);

const computedClasses = computed(() =>
  classNames(
    baseClasses.value,
    focusClass.value,
    statusClass.value,
    props.multiple && "min-h-[3.25rem]",
  ),
);

const selectClass = computed(() =>
  classNames(
    computedClasses.value,
    hasLeadingIcon.value && !props.multiple && "pl-9",
    showCaret.value && !props.multiple && "pr-10",
  ),
);

const caretClass = computed(() =>
  classNames(
    "pointer-events-none absolute inset-y-0 flex items-center",
    sizeToken.value.iconRight,
    tokens.value.icon,
  ),
);

const selectAttrs = computed(() => {
  const attrs: Record<string, unknown> = {
    "aria-invalid":
      props.validationStatus === "error" ? "true" : undefined,
    ...restAttrs.value,
  };
  if (props.modelValue !== undefined) {
    attrs.value = props.modelValue;
  }
  return attrs;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
  emit("change", event);
};
</script>

<template>
  <span class="relative flex w-full items-center">
    <span
      v-if="hasLeadingIcon"
      class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400 dark:text-neutral-500"
    >
      <VNodeRenderer :nodes="renderVisual(leadingIcon, sizeToken.iconSize)" />
    </span>
    <select
      ref="el"
      :class="selectClass"
      :disabled="disabled"
      v-bind="selectAttrs"
      @change="handleChange"
    >
      <option
        v-if="placeholder !== undefined || $slots.placeholder"
        value=""
        disabled
        hidden
      >
        <slot name="placeholder">{{ placeholder }}</slot>
      </option>
      <slot />
    </select>
    <span v-if="showCaret" :class="caretClass">
      <VNodeRenderer
        :nodes="renderIconFn('ArrowDown', undefined, sizeToken.iconSize)"
      />
    </span>
  </span>
</template>
