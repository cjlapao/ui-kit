<script lang="ts">
import type { VNode } from "vue";
import type { ThemeColor } from "../theme/Theme";

export type AlertVariant = "subtle" | "solid" | "outline";

export interface AlertProps {
  // @deprecated Use color instead
  tone?: ThemeColor;
  color?: ThemeColor;
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: string | VNode | false;
  actions?: string;
  dismissible?: boolean;
}

const defaultIcons: Partial<Record<ThemeColor, string>> = {
  neutral: "Info",
  info: "Info",
  success: "CheckCircle",
  warning: "Chat",
  danger: "Error",
  theme: "Info",
};
</script>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { getAlertColorClasses } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Alert", inheritAttrs: false });

const props = withDefaults(defineProps<AlertProps>(), {
  variant: "subtle",
  dismissible: false,
});

const emit = defineEmits<{
  (e: "dismiss"): void;
}>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const el = ref<HTMLDivElement | null>(null);
defineExpose({ el });

const effectiveColor = computed(() => props.color ?? props.tone ?? "neutral");
const tokens = computed(() => getAlertColorClasses(effectiveColor.value));

const base = computed(() =>
  classNames(
    "relative flex w-full gap-3 rounded-2xl border px-4 py-3 shadow-sm transition",
    props.variant === "subtle" && tokens.value.subtle,
    props.variant === "solid" && tokens.value.solid,
    props.variant === "outline" && [tokens.value.outline, tokens.value.border],
    classAttr.value,
  ),
);

const resolvedIcon = computed(() =>
  props.icon === false ? null : (props.icon ?? defaultIcons[effectiveColor.value]),
);

const iconWrapperClass = computed(() =>
  classNames("flex-shrink-0 pt-1", tokens.value.icon),
);

const descriptionClass = computed(() =>
  classNames("leading-relaxed", tokens.value.text),
);

const dismissClass = computed(() =>
  classNames(
    "ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    tokens.value.dismiss,
  ),
);

const hasActions = computed(() => Boolean(props.actions) || Boolean(slots.actions));
</script>

<template>
  <div ref="el" :class="base" role="alert" v-bind="restAttrs">
    <div v-if="resolvedIcon" :class="iconWrapperClass">
      <VNodeRenderer :nodes="renderIcon(resolvedIcon, 'md')" />
    </div>
    <div class="flex flex-1 flex-col gap-1 text-sm">
      <div v-if="title" class="text-sm font-semibold leading-tight text-current">
        {{ title }}
      </div>
      <div v-if="description" :class="descriptionClass">
        {{ description }}
      </div>
      <div v-if="hasActions" class="pt-2 text-sm">
        <slot name="actions">{{ actions }}</slot>
      </div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      :class="dismissClass"
      aria-label="Dismiss alert"
      @click="emit('dismiss')"
    >
      <VNodeRenderer :nodes="renderIcon('Close', 'sm')" />
    </button>
  </div>
</template>
