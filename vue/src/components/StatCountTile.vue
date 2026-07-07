<script lang="ts">
import type { TrueColor } from "../theme";
import type { IconName } from "../icons/registry";

export interface StatCountTileBreakdown {
  label: string;
  value: string | number;
  color?: TrueColor;
}

export interface StatCountTileProps {
  title?: string;
  count?: string | number;
  breakdown?: StatCountTileBreakdown[];
  icon?: IconName;
  color?: TrueColor;
  onClick?: () => void;
  withDecoration?: boolean;
  withHoverEffect?: boolean;
  textColor?: TrueColor;
  loading?: boolean;
  spinnerVariant?: "solid" | "segments";
  spinnerThickness?: "thin" | "normal" | "thick";
  spinnerColor?: TrueColor;
  error?: {
    icon?: IconName;
    message?: string;
    onRetry?: () => void;
    variant?: "text" | "badge";
  } | null;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import Panel from "./Panel.vue";
import Loader from "./Loader.vue";
import CustomIcon from "./CustomIcon.vue";
import { getStatTileColorClasses } from "../theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "StatCountTile", inheritAttrs: false });

const props = withDefaults(defineProps<StatCountTileProps>(), {
  color: "blue",
  withDecoration: false,
  withHoverEffect: false,
  loading: false,
});

const { classAttr, restAttrs } = useClassAttrs();

const styles = computed(() => getStatTileColorClasses(props.color));
const showDecoration = computed(() => props.withDecoration || !!props.icon);
const effectiveTextColor = computed(() => props.textColor || "neutral");

const panelClass = computed(() =>
  classNames("relative overflow-hidden transition-all duration-200", classAttr.value, {
    "cursor-pointer": !!props.onClick,
    "hover:shadow-md": !!props.onClick && !props.withHoverEffect,
    "hover:-translate-y-1 hover:shadow-lg": props.withHoverEffect,
  }),
);

const panelBindings = computed(() => ({
  onClick: props.onClick,
  ...restAttrs.value,
}));

const decorationClass = computed(() =>
  classNames(
    "absolute -top-px -right-px w-24 h-24 rounded-bl-[100px] pointer-events-none transition-colors duration-200 z-0 flex items-start justify-end p-5",
    styles.value.decorationBg,
  ),
);

const iconWrapClass = computed(() =>
  classNames("z-10 mt-px mr-px", styles.value.iconColor),
);

const headerClass = computed(() =>
  classNames(
    "flex justify-between items-start min-h-[28px]",
    !showDecoration.value
      ? `mb-3 pb-2 border-b-2 border-${effectiveTextColor.value}-100 dark:border-${effectiveTextColor.value}-800`
      : "mb-4",
  ),
);

const titleClass = computed(() =>
  classNames(
    "text-sm font-medium uppercase tracking-wide line-clamp-2",
    props.textColor
      ? `text-${props.textColor}-500 dark:text-${props.textColor}-400`
      : "text-neutral-500 dark:text-neutral-400",
  ),
);

const countWrapperClass = computed(() =>
  classNames(
    "mt-1 mb-6 transition-all duration-500 ease-out delay-75",
    props.loading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
  ),
);

const countClass = computed(() =>
  classNames(
    "text-5xl font-black tracking-tight",
    props.textColor
      ? `text-${props.textColor}-700 dark:text-${props.textColor}-100`
      : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent",
  ),
);
</script>

<template>
  <Panel
    variant="default"
    corner="rounded"
    padding="none"
    :flex-body="true"
    :class="panelClass"
    v-bind="panelBindings"
  >
    <!-- Loading Overlay -->
    <Loader
      v-if="loading"
      :overlay="true"
      :glass="true"
      size="md"
      :color="spinnerColor || 'blue'"
      :spinner-variant="spinnerVariant || 'segments'"
      :spinner-thickness="spinnerThickness || 'normal'"
      variant="spinner"
    />

    <!-- Decorative Corner & Icon -->
    <div v-if="showDecoration" :class="decorationClass">
      <div v-if="icon" :class="iconWrapClass">
        <CustomIcon :icon="icon" size="lg" />
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col h-full relative z-10">
      <!-- Header -->
      <div :class="headerClass">
        <div :class="classNames('flex-1 min-w-0', showDecoration ? 'pr-12' : '')">
          <h3 :class="titleClass">
            <slot name="title">{{ title }}</slot>
          </h3>
        </div>
      </div>

      <!-- Main Body -->
      <div
        v-if="error"
        class="flex flex-col items-center justify-center flex-grow py-2 text-center"
      >
        <div v-if="error.icon" class="text-rose-500 mb-2">
          <CustomIcon :icon="error.icon" size="md" />
        </div>
        <p
          :class="
            classNames(
              'text-sm text-neutral-600 dark:text-neutral-400',
              error.onRetry ? 'mb-3' : '',
            )
          "
        >
          {{ error.message || "Failed to load data" }}
        </p>
        <button
          v-if="error.onRetry"
          class="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
          @click.stop="error.onRetry?.()"
        >
          Try Again
        </button>
      </div>
      <template v-else>
        <div :class="countWrapperClass">
          <span :class="countClass">
            <slot name="count">{{ count }}</slot>
          </span>
        </div>

        <!-- Breakdown -->
        <div v-if="breakdown && breakdown.length > 0" class="mt-auto space-y-3">
          <div
            v-for="(item, idx) in breakdown"
            :key="idx"
            class="flex items-center justify-between text-sm"
          >
            <span class="text-neutral-500 dark:text-neutral-400 font-medium">
              {{ item.label }}
            </span>
            <div class="flex items-center gap-2">
              <span
                :class="
                  classNames(
                    'font-semibold',
                    item.color
                      ? `text-${item.color}-600 dark:text-${item.color}-400`
                      : 'text-neutral-700 dark:text-neutral-200',
                  )
                "
              >
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </Panel>
</template>
