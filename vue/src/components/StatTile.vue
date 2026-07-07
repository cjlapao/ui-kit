<script lang="ts">
import type { VNode } from "vue";
import type { TrueColor } from "../theme";
import type { IconName } from "../icons/registry";

export interface StatTileTrend {
  value: string | number;
  direction: "up" | "down" | "neutral";
  label?: string;
}

export interface StatTileMeta {
  text: string | number | VNode;
  icon?: IconName;
  variant?: "text" | "badge";
  color?: TrueColor;
}

export interface StatTileError {
  icon?: IconName;
  message?: string;
  onRetry?: () => void;
}

export interface StatTileProgress {
  value: number;
  label?: string;
  color?: TrueColor;
}

export interface StatTileProps {
  title?: string;
  value?: string | number;
  subtitle?: string;
  icon?: IconName;
  color?: TrueColor;
  trend?: StatTileTrend;
  progress?: StatTileProgress;
  meta?: StatTileMeta[];
  footer?: string;
  actions?: string;
  onClick?: () => void;
  withDecoration?: boolean;
  withHoverEffect?: boolean;
  textColor?: TrueColor;
  loading?: boolean;
  spinnerVariant?: "solid" | "segments";
  spinnerThickness?: "thin" | "normal" | "thick";
  spinnerColor?: TrueColor;
  error?: StatTileError | null;
}
</script>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import classNames from "classnames";
import Panel from "./Panel.vue";
import Loader from "./Loader.vue";
import CustomIcon from "./CustomIcon.vue";
import { getStatTileColorClasses } from "../theme";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "StatTile", inheritAttrs: false });

const props = withDefaults(defineProps<StatTileProps>(), {
  color: "blue",
  withDecoration: false,
  withHoverEffect: false,
  loading: false,
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const styles = computed(() => getStatTileColorClasses(props.color));
const showDecoration = computed(() => props.withDecoration || !!props.icon);
const effectiveTextColor = computed(() => props.textColor || "neutral");

const hasBody = computed(() => !!slots.body);
const hasTitle = computed(() => !!slots.title || !!props.title);
const hasActions = computed(() => !!slots.actions || !!props.actions);
const hasSubtitle = computed(() => !!slots.subtitle || !!props.subtitle);
const hasFooter = computed(() => !!slots.footer || !!props.footer);

// Determine value text color: use trend color if no textColor is set and trend exists
const valueTextColor = computed(() => {
  if (props.textColor) {
    return `text-${props.textColor}-700 dark:text-${props.textColor}-100`;
  }
  if (props.trend) {
    if (props.trend.direction === "up") {
      return "text-emerald-700 dark:text-emerald-400";
    } else if (props.trend.direction === "down") {
      return "text-rose-700 dark:text-rose-400";
    }
  }
  return "text-neutral-600 dark:text-neutral-400";
});

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
      : "mb-2",
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

const valueWrapperClass = computed(() =>
  classNames(
    "mt-1 mb-4 transition-all duration-500 ease-out delay-75",
    props.loading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
  ),
);

const trendIconName = computed(
  () =>
    (props.trend?.direction === "up"
      ? "ArrowUp"
      : props.trend?.direction === "down"
        ? "ArrowDown"
        : "Equal") as IconName,
);

const trendBadgeClass = computed(() =>
  classNames(
    "flex items-center justify-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full",
    props.trend?.direction === "up"
      ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
      : props.trend?.direction === "down"
        ? "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10"
        : "text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800",
  ),
);

const progressBarClass = computed(() =>
  classNames(
    "h-full rounded-full transition-all duration-500",
    // Let's use simpler map:
    props.progress?.color === "blue"
      ? "bg-blue-500"
      : props.progress?.color
        ? `bg-${props.progress.color}-500`
        : `bg-${props.color}-500`,
  ),
);

const metaSectionClass = computed(() =>
  classNames("mt-4 pt-4 border-t", styles.value.divider),
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
      <div v-if="!hasBody || hasTitle || hasActions" :class="headerClass">
        <div :class="classNames('flex-1 min-w-0', showDecoration ? 'pr-12' : '')">
          <h3 :class="titleClass">
            <slot name="title">{{ title }}</slot>
          </h3>
        </div>
        <div v-if="hasActions" class="flex-none -mr-1">
          <slot name="actions">{{ actions }}</slot>
        </div>
      </div>

      <!-- Error State -->
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
      <slot v-else-if="hasBody" name="body" />
      <template v-else>
        <div :class="valueWrapperClass">
          <div class="flex items-baseline gap-3">
            <span
              :class="
                classNames(
                  'text-3xl font-bold tracking-tight translate-y-[3px]',
                  valueTextColor,
                )
              "
            >
              <slot name="value">{{ value }}</slot>
            </span>
            <div v-if="trend" :class="trendBadgeClass">
              <CustomIcon :icon="trendIconName" size="xs" />
              <span class="translate-y-[0.5px]">{{ trend.value }}</span>
            </div>
          </div>
          <div
            v-if="trend?.label"
            class="mt-1 text-xs text-neutral-400 dark:text-neutral-500"
          >
            {{ trend.label }}
          </div>
          <div
            v-if="hasSubtitle"
            class="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
          >
            <slot name="subtitle">{{ subtitle }}</slot>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="progress !== undefined" class="mt-auto pt-2">
          <div class="flex justify-between text-xs mb-1.5">
            <span class="font-medium text-neutral-600 dark:text-neutral-300">
              {{ progress.label || "Progress" }}
            </span>
            <span class="text-neutral-500">{{ progress.value }}%</span>
          </div>
          <div
            class="h-1.5 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden"
          >
            <div
              :class="progressBarClass"
              :style="{
                width: `${Math.min(100, Math.max(0, progress.value))}%`,
              }"
            />
          </div>
        </div>

        <!-- Meta Items or Footer -->
        <div v-if="meta || hasFooter" :class="metaSectionClass">
          <div v-if="meta" class="flex flex-wrap gap-3">
            <div
              v-for="(item, idx) in meta"
              :key="idx"
              class="flex items-center text-sm text-neutral-600 dark:text-neutral-300"
            >
              <CustomIcon
                v-if="item.icon"
                :icon="item.icon"
                size="sm"
                class="mr-1.5 text-neutral-400"
              />
              <VNodeRenderer :nodes="item.text" />
            </div>
          </div>
          <div v-if="hasFooter" class="mt-2">
            <slot name="footer">{{ footer }}</slot>
          </div>
        </div>
      </template>
    </div>
  </Panel>
</template>
