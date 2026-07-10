<script lang="ts">
import type { PanelProps } from "./Panel.vue";

// Override specific props for CollapsiblePanel
export interface CollapsiblePanelProps
  extends Omit<PanelProps, "title" | "subtitle" | "actions"> {
  title?: string;
  subtitle?: string;

  defaultExpanded?: boolean;
  expanded?: boolean;
  minExpandedHeight?: number | string;

  contentClassName?: string;
  contentMaxHeight?: number;
  /** When true, the expanded content grows to fill available space instead of scrolling. */
  fillHeight?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import Panel from "./Panel.vue";
import { getPaddingClass } from "../theme/Theme";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "CollapsiblePanel", inheritAttrs: false });

const props = withDefaults(defineProps<CollapsiblePanelProps>(), {
  defaultExpanded: false,
  expanded: undefined,
  contentMaxHeight: 320,
  fillHeight: false,
  disabled: false,
  variant: "elevated",
  tone: "neutral",
  padding: "md",
  corner: "rounded-sm",
  hoverable: false,
  // Booleans passed through to Panel keep its own defaults when unset.
  fullWidth: undefined,
  flexBody: undefined,
  loading: undefined,
  hoverShadow: undefined,
  scrollable: undefined,
  specularHighlight: undefined,
});

const emit = defineEmits<{
  (e: "toggle", expanded: boolean): void;
  (e: "update:expanded", expanded: boolean): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const internalExpanded = ref(props.defaultExpanded);
const isControlled = computed(() => typeof props.expanded === "boolean");
const isExpanded = computed(() =>
  isControlled.value ? (props.expanded as boolean) : internalExpanded.value,
);

const handleToggle = () => {
  if (props.disabled) return;
  const next = !isExpanded.value;
  if (!isControlled.value) internalExpanded.value = next;
  emit("update:expanded", next);
  emit("toggle", next);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleToggle();
  }
};

const computedContentMaxHeight = computed(
  () => `min(${props.contentMaxHeight ?? 320}px, 65vh)`,
);
const resolvedPadding = computed(() => getPaddingClass(props.padding));

const panelBindings = computed(() => {
  const {
    title: _title,
    subtitle: _subtitle,
    defaultExpanded: _defaultExpanded,
    expanded: _expanded,
    minExpandedHeight: _minExpandedHeight,
    contentClassName: _contentClassName,
    contentMaxHeight: _contentMaxHeight,
    fillHeight,
    disabled,
    variant,
    tone,
    padding: _padding,
    corner,
    hoverable,
    ...panelProps
  } = props;
  const definedPanelProps = Object.fromEntries(
    Object.entries(panelProps).filter(([, value]) => value !== undefined),
  );
  return {
    class: classNames(
      "transition-all duration-300",
      fillHeight && isExpanded.value ? "flex flex-col min-h-0" : "shrink-0",
      classAttr.value,
    ),
    variant,
    tone,
    padding: "none" as const,
    corner,
    disabled,
    hoverable,
    scrollable: false,
    ...definedPanelProps,
    ...restAttrs.value,
  };
});

const bodyClass = computed(() =>
  classNames("flex flex-col w-full", props.fillHeight && isExpanded.value && "h-full"),
);

// Header — div with button roles keeps actions (which may render their own <button>) out of a native <button>.
const headerClass = computed(() =>
  classNames(
    "flex w-full items-center gap-3 text-left focus:outline-none transition-opacity",
    resolvedPadding.value,
    props.disabled
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer hover:opacity-80 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg",
  ),
);

const chevronClass = computed(() =>
  classNames(
    "transition-transform duration-300",
    isExpanded.value ? "rotate-180" : "rotate-0",
  ),
);

const contentWrapperClass = computed(() =>
  classNames(
    "overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-in-out",
    props.fillHeight && isExpanded.value && "flex-1 min-h-0",
    isExpanded.value ? "opacity-100" : "max-h-0 opacity-0 m-0",
  ),
);

const minExpandedHeightValue = computed(() =>
  typeof props.minExpandedHeight === "number"
    ? `${props.minExpandedHeight}px`
    : props.minExpandedHeight,
);

const contentWrapperStyle = computed(() => ({
  maxHeight:
    isExpanded.value && !props.fillHeight
      ? `calc(${computedContentMaxHeight.value} + ${typeof props.minExpandedHeight === "number" ? props.minExpandedHeight + "px" : props.minExpandedHeight || "0px"} + 4rem)`
      : isExpanded.value
        ? undefined
        : "0px",
}));

const contentClass = computed(() =>
  classNames(
    "text-sm leading-relaxed",
    resolvedPadding.value,
    "pt-0",
    isExpanded.value && !props.fillHeight
      ? "overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent"
      : "overflow-hidden",
    props.contentClassName,
  ),
);

const contentStyle = computed(() => ({
  maxHeight:
    isExpanded.value && !props.fillHeight
      ? computedContentMaxHeight.value
      : undefined,
  minHeight: isExpanded.value ? minExpandedHeightValue.value : undefined,
}));
</script>

<template>
  <Panel v-bind="panelBindings">
    <div :class="bodyClass">
      <!-- Header — div with button roles keeps actions (which may render their own <button>) out of a native <button>. -->
      <div
        role="button"
        :tabindex="disabled ? -1 : 0"
        :class="headerClass"
        :aria-expanded="isExpanded"
        aria-controls="collapsible-panel-content"
        @click="handleToggle"
        @keydown="handleKeyDown"
      >
        <div class="flex flex-1 flex-col gap-0.5">
          <span class="text-sm font-semibold">
            <slot name="title">{{ title }}</slot>
          </span>
          <span v-if="subtitle || $slots.subtitle" class="text-xs opacity-70">
            <slot name="subtitle">{{ subtitle }}</slot>
          </span>
        </div>

        <div v-if="$slots.actions" @click.stop>
          <slot name="actions" />
        </div>

        <span :class="chevronClass">
          <VNodeRenderer :nodes="renderIcon('ArrowDown', 'sm')" />
        </span>
      </div>

      <!-- Content Wrapper -->
      <div
        id="collapsible-panel-content"
        role="region"
        aria-label="panel content"
        :class="contentWrapperClass"
        :style="contentWrapperStyle"
      >
        <div :class="contentClass" :style="contentStyle">
          <slot />
        </div>
      </div>
    </div>
  </Panel>
</template>
