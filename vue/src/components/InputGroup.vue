<script lang="ts">
import type { ButtonColor } from "./Button.vue";

type InputGroupSize = "sm" | "md" | "lg";
type InputGroupValidationStatus = "none" | "error" | "success";

const sizeTokens: Record<
  InputGroupSize,
  {
    text: string;
    padding: string;
  }
> = {
  sm: {
    text: "text-sm",
    padding: "px-3",
  },
  md: {
    text: "text-sm",
    padding: "px-3.5",
  },
  lg: {
    text: "text-base",
    padding: "px-4",
  },
};

type ToneTokens = {
  focusRing: string;
  ring: string;
  background: string;
  addonBackground: string;
  addonBorder: string;
  addonText: string;
  darkBackground: string;
  darkRing: string;
  darkAddonBackground: string;
  darkAddonBorder: string;
  darkAddonText: string;
};

const toneTokens: Partial<Record<ButtonColor, ToneTokens>> = {
  indigo: {
    focusRing: "focus-within:ring-indigo-400",
    ring: "ring-indigo-200/70",
    background: "bg-white",
    addonBackground: "bg-indigo-50/80",
    addonBorder: "border-indigo-200",
    addonText: "text-indigo-600",
    darkBackground: "dark:bg-neutral-900",
    darkRing: "dark:ring-indigo-500/30",
    darkAddonBackground: "dark:bg-indigo-500/15",
    darkAddonBorder: "dark:border-indigo-500/40",
    darkAddonText: "dark:text-indigo-200",
  },
  blue: {
    focusRing: "focus-within:ring-blue-400",
    ring: "ring-blue-200/70",
    background: "bg-white",
    addonBackground: "bg-blue-50/80",
    addonBorder: "border-blue-200",
    addonText: "text-blue-600",
    darkBackground: "dark:bg-neutral-900",
    darkRing: "dark:ring-blue-500/30",
    darkAddonBackground: "dark:bg-blue-500/15",
    darkAddonBorder: "dark:border-blue-500/40",
    darkAddonText: "dark:text-blue-200",
  },
  emerald: {
    focusRing: "focus-within:ring-emerald-400",
    ring: "ring-emerald-200/70",
    background: "bg-white",
    addonBackground: "bg-emerald-50/80",
    addonBorder: "border-emerald-200",
    addonText: "text-emerald-600",
    darkBackground: "dark:bg-neutral-900",
    darkRing: "dark:ring-emerald-500/30",
    darkAddonBackground: "dark:bg-emerald-500/15",
    darkAddonBorder: "dark:border-emerald-500/40",
    darkAddonText: "dark:text-emerald-200",
  },
  amber: {
    focusRing: "focus-within:ring-amber-400",
    ring: "ring-amber-200/70",
    background: "bg-white",
    addonBackground: "bg-amber-50/80",
    addonBorder: "border-amber-200",
    addonText: "text-amber-600",
    darkBackground: "dark:bg-neutral-900",
    darkRing: "dark:ring-amber-400/30",
    darkAddonBackground: "dark:bg-amber-500/20",
    darkAddonBorder: "dark:border-amber-500/40",
    darkAddonText: "dark:text-amber-200",
  },
  rose: {
    focusRing: "focus-within:ring-rose-400",
    ring: "ring-rose-200/70",
    background: "bg-white",
    addonBackground: "bg-rose-50/80",
    addonBorder: "border-rose-200",
    addonText: "text-rose-600",
    darkBackground: "dark:bg-neutral-900",
    darkRing: "dark:ring-rose-500/30",
    darkAddonBackground: "dark:bg-rose-500/15",
    darkAddonBorder: "dark:border-rose-500/40",
    darkAddonText: "dark:text-rose-200",
  },
  slate: {
    focusRing: "focus-within:ring-slate-500",
    ring: "ring-slate-200/70",
    background: "bg-white",
    addonBackground: "bg-slate-100",
    addonBorder: "border-slate-200",
    addonText: "text-slate-700",
    darkBackground: "dark:bg-neutral-900",
    darkRing: "dark:ring-slate-500/40",
    darkAddonBackground: "dark:bg-slate-800/70",
    darkAddonBorder: "dark:border-slate-700",
    darkAddonText: "dark:text-slate-200",
  },
  white: {
    focusRing: "focus-within:ring-slate-400",
    ring: "ring-slate-200/70",
    background: "bg-white",
    addonBackground: "bg-slate-100",
    addonBorder: "border-slate-200",
    addonText: "text-slate-700",
    darkBackground: "dark:bg-neutral-900",
    darkRing: "dark:ring-slate-500/40",
    darkAddonBackground: "dark:bg-slate-800/70",
    darkAddonBorder: "dark:border-slate-700",
    darkAddonText: "dark:text-slate-200",
  },
  theme: {
    focusRing:
      "focus-within:ring-neutral-400 dark:focus-within:ring-neutral-500 focus-within:ring-2",
    ring: "ring-neutral-200/80",
    background: "bg-white",
    addonBackground: "bg-neutral-50",
    addonBorder: "border-neutral-200",
    addonText: "text-neutral-600",
    darkBackground: "dark:bg-neutral-900",
    darkRing: "dark:ring-neutral-700",
    darkAddonBackground: "dark:bg-neutral-800/70",
    darkAddonBorder: "dark:border-neutral-700",
    darkAddonText: "dark:text-neutral-200",
  },
};

const statusRing: Record<
  Exclude<InputGroupValidationStatus, "none">,
  string
> = {
  error:
    "focus-within:ring-rose-500 ring-rose-400/70 dark:ring-rose-400/40 dark:focus-within:ring-rose-400",
  success:
    "focus-within:ring-emerald-500 ring-emerald-400/70 dark:ring-emerald-400/40 dark:focus-within:ring-emerald-400",
};

export interface InputGroupProps {
  leadingAddon?: string;
  trailingAddon?: string;
  tone?: ButtonColor;
  size?: InputGroupSize;
  validationStatus?: InputGroupValidationStatus;
  disabled?: boolean;
}

const addonBaseClasses =
  "inline-flex min-w-0 items-center whitespace-nowrap border border-transparent text-sm font-medium";
</script>

<script setup lang="ts">
import {
  cloneVNode,
  computed,
  isVNode,
  useSlots,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "InputGroup" });

const props = withDefaults(defineProps<InputGroupProps>(), {
  tone: "blue",
  size: "md",
  validationStatus: "none",
  disabled: false,
});

const slots = useSlots();

const isAttachableChild = (child: VNodeChild) => {
  if (!isVNode(child)) {
    return false;
  }
  const type = child.type as { __UI_INPUT?: boolean; __UI_SELECT?: boolean };
  return Boolean(type && (type.__UI_INPUT || type.__UI_SELECT));
};

const attachChildProps = (child: VNodeChild): VNodeChild => {
  if (!isVNode(child) || !isAttachableChild(child)) {
    return child;
  }

  return cloneVNode(child, {
    tone: props.tone,
    size: props.size,
    unstyled: true,
  });
};

const enhancedChildren = (): VNodeChild[] =>
  (slots.default?.() ?? []).map(attachChildProps);

const toneToken = computed(
  () => (toneTokens[props.tone] ?? toneTokens.theme) as ToneTokens,
);
const sizeToken = computed(() => sizeTokens[props.size] ?? sizeTokens.md);

const ringClasses = computed(() =>
  props.validationStatus === "none"
    ? classNames(
        "ring-1 ring-inset transition focus-within:ring-2",
        toneToken.value.ring,
        toneToken.value.darkRing,
        toneToken.value.focusRing,
      )
    : statusRing[props.validationStatus],
);

const groupClasses = computed(() =>
  classNames(
    "flex w-full items-stretch overflow-hidden rounded-lg shadow-sm",
    ringClasses.value,
    toneToken.value.background,
    toneToken.value.darkBackground,
    props.disabled && "opacity-60 cursor-not-allowed",
  ),
);

const leadingAddonClasses = computed(() =>
  classNames(
    addonBaseClasses,
    sizeToken.value.text,
    sizeToken.value.padding,
    toneToken.value.addonBackground,
    toneToken.value.addonBorder,
    toneToken.value.addonText,
    toneToken.value.darkAddonBackground,
    toneToken.value.darkAddonBorder,
    toneToken.value.darkAddonText,
    "border-r sm:min-w-max",
  ),
);

const trailingAddonClasses = computed(() =>
  classNames(
    addonBaseClasses,
    sizeToken.value.text,
    sizeToken.value.padding,
    toneToken.value.addonBackground,
    toneToken.value.addonBorder,
    toneToken.value.addonText,
    toneToken.value.darkAddonBackground,
    toneToken.value.darkAddonBorder,
    toneToken.value.darkAddonText,
    "border-l sm:min-w-max",
  ),
);

const hasLeading = computed(
  () => props.leadingAddon !== undefined || Boolean(slots.leadingAddon),
);
const hasTrailing = computed(
  () => props.trailingAddon !== undefined || Boolean(slots.trailingAddon),
);
</script>

<template>
  <div
    :class="groupClasses"
    :data-disabled="String(disabled)"
    :data-status="validationStatus"
  >
    <span v-if="hasLeading" :class="leadingAddonClasses">
      <slot name="leadingAddon">{{ leadingAddon }}</slot>
    </span>
    <div class="flex min-w-0 flex-1 items-center">
      <VNodeRenderer :nodes="enhancedChildren()" />
    </div>
    <span v-if="hasTrailing" :class="trailingAddonClasses">
      <slot name="trailingAddon">{{ trailingAddon }}</slot>
    </span>
  </div>
</template>
