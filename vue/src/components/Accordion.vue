<script lang="ts">
import type { VNode } from "vue";
import type { LoaderProps } from "./Loader.vue";
import type { PanelTone } from "./Panel.vue";

export type AccordionVariant =
  | "default"
  | "bordered"
  | "minimal"
  | "tonal"
  | "ghost";
export type AccordionSize = "sm" | "md" | "lg";
export type AccordionIndicator = "chevron" | "plus-minus" | "caret" | "none";
export type AccordionChevronPlacement = "left" | "right";

export interface AccordionItem {
  id: string;
  title: string | VNode;
  subtitle?: string | VNode;
  description?: string | VNode;
  icon?: string | VNode;
  badge?: string | VNode;
  actions?: string | VNode;
  content: string | VNode;
  disabled?: boolean;
  loading?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  variant?: AccordionVariant;
  tone?: PanelTone;
  size?: AccordionSize;
  indicator?: AccordionIndicator;
  chevronPlacement?: AccordionChevronPlacement;
  divider?: boolean;
  animated?: boolean;
  transitionMs?: number;
  iconClassName?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  ariaLabel?: string;
  loading?: boolean;
  loaderTitle?: string;
  loaderMessage?: string;
  loaderType?: LoaderProps["variant"];
  loaderProgress?: number;
  loaderColor?: LoaderProps["color"];
  defaultOpenIds?: string[];
  openIds?: string[];
  multiple?: boolean;
}

const sizeTokens: Record<
  AccordionSize,
  {
    header: string;
    title: string;
    subtitle: string;
    description: string;
    content: string;
    badge: string;
    iconSize: number;
  }
> = {
  sm: {
    header: "px-4 py-3 gap-3",
    title: "text-sm font-semibold",
    subtitle: "text-xs font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-xs text-neutral-500 dark:text-neutral-400",
    content: "px-4 pb-4",
    badge: "text-xs",
    iconSize: 16,
  },
  md: {
    header: "px-5 py-4 gap-3",
    title: "text-base font-semibold",
    subtitle: "text-sm font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-sm text-neutral-500 dark:text-neutral-400",
    content: "px-5 pb-5",
    badge: "text-xs",
    iconSize: 20,
  },
  lg: {
    header: "px-6 py-5 gap-4",
    title: "text-lg font-semibold",
    subtitle: "text-base font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-sm text-neutral-500 dark:text-neutral-400",
    content: "px-6 pb-6",
    badge: "text-sm",
    iconSize: 24,
  },
};

const variantClasses: Record<
  AccordionVariant,
  {
    root: string;
    item: string;
    header: string;
    content: string;
  }
> = {
  default: {
    root: "rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900/90",
    item: "border-b border-neutral-200 last:border-0 dark:border-neutral-800",
    header:
      "hover:bg-neutral-50/80 dark:hover:bg-neutral-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-neutral-50/60 dark:bg-neutral-900/40",
  },
  bordered: {
    root: "rounded-2xl border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
    item: "border-t first:border-t-0 border-neutral-300 dark:border-neutral-700",
    header:
      "hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-white dark:bg-neutral-900/60",
  },
  minimal: {
    root: "rounded-xl border border-transparent bg-transparent",
    item: "border-b border-neutral-200 last:border-0 dark:border-neutral-800",
    header:
      "hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-transparent",
  },
  tonal: {
    root: "rounded-2xl border border-transparent bg-neutral-50/80 dark:bg-neutral-900/80",
    item: "border-b border-neutral-200 last:border-0 dark:border-neutral-800/80",
    header:
      "hover:bg-white/60 dark:hover:bg-neutral-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-white/60 dark:bg-neutral-900/60",
  },
  ghost: {
    root: "rounded-xl border border-transparent bg-transparent",
    item: "border-b border-transparent",
    header:
      "hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-transparent",
  },
};

const toneClasses: Partial<
  Record<
    PanelTone,
    { header: string; indicator: string; icon: string; badge: string }
  >
> = {
  neutral: {
    header:
      "bg-neutral-50/50 text-neutral-900 shadow-sm hover:bg-neutral-100/80 dark:bg-neutral-900/40 dark:text-neutral-100 dark:hover:bg-neutral-800/60",
    indicator: "text-neutral-400 dark:text-neutral-500",
    icon: "text-neutral-500 dark:text-neutral-400",
    badge:
      "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300",
  },
  blue: {
    header:
      "bg-blue-50/50 text-blue-900 shadow-sm hover:bg-blue-100/60 ring-1 ring-blue-100/50 dark:bg-blue-950/20 dark:text-blue-100 dark:ring-blue-900/30 dark:hover:bg-blue-900/30",
    indicator: "text-blue-400 dark:text-blue-500",
    icon: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  },
};

const indicatorIconMap: Record<AccordionIndicator, string | undefined> = {
  chevron: "ArrowDown",
  caret: "ArrowDown",
  "plus-minus": "Plus",
  none: undefined,
};

const indicatorRotationClass: Record<AccordionIndicator, string> = {
  chevron: "transition-transform duration-200",
  caret: "transition-transform duration-200",
  "plus-minus": "transition-transform duration-200",
  none: "",
};

const contentTransitionClass = "transition-all duration-200 ease-out";
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import Loader from "./Loader.vue";
import { useAccordion } from "../composables/useAccordion";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Accordion", inheritAttrs: false });

const props = withDefaults(defineProps<AccordionProps>(), {
  variant: "default",
  tone: "neutral",
  size: "md",
  indicator: "chevron",
  chevronPlacement: "right",
  divider: false,
  animated: true,
  transitionMs: 220,
  loading: false,
  loaderType: "spinner",
});

const emit = defineEmits<{
  (e: "change", openIds: string[]): void;
  (e: "itemToggle", id: string, isOpen: boolean): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const accordion = useAccordion({
  defaultOpenIds: props.defaultOpenIds,
  openIds: () => props.openIds,
  onChange: (openIds) => emit("change", openIds),
  multiple: props.multiple,
});

const sizeToken = computed(() => sizeTokens[props.size]);
const variantToken = computed(() => variantClasses[props.variant]);
const toneToken = computed(
  () => (toneClasses[props.tone] ?? toneClasses.neutral)!,
);

const indicatorIcon = computed(() => indicatorIconMap[props.indicator]);
const showIndicator = computed(() => props.indicator !== "none");
const isIndicator = computed(
  () => showIndicator.value && indicatorIcon.value,
);

const computedItems = computed(() => props.items ?? []);

const rootClass = computed(() =>
  classNames(
    "relative flex w-full flex-col overflow-hidden",
    variantToken.value.root,
    props.divider && "divide-y divide-neutral-200 dark:divide-neutral-800",
    classAttr.value,
  ),
);

const indicatorSizeConfig = computed(() =>
  props.size === "sm"
    ? { width: 32, height: 32, icon: 16 }
    : props.size === "lg"
      ? { width: 36, height: 36, icon: 20 }
      : { width: 32, height: 32, icon: 16 },
);

const indicatorRotation = (isOpen: boolean) =>
  props.indicator === "plus-minus"
    ? isOpen
      ? "rotate-45"
      : ""
    : isOpen
      ? "-rotate-180"
      : "";

const indicatorClass = (isOpen: boolean) =>
  classNames(
    `mt-1 flex h-${indicatorSizeConfig.value.height} w-${indicatorSizeConfig.value.width} flex-shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700`,
    "pointer-events-none",
    toneToken.value.indicator,
    indicatorRotationClass[props.indicator],
    indicatorRotation(isOpen),
  );

const headerClass = (item: AccordionItem) =>
  classNames(
    "flex w-full items-start gap-4 text-left transition-colors duration-150",
    sizeToken.value.header,
    variantToken.value.header,
    toneToken.value.header,
    props.headerClassName,
    item.disabled && "cursor-not-allowed",
  );

const handleToggle = (item: AccordionItem) => {
  const isOpen = accordion.isOpen(item.id);
  accordion.toggle(item.id);
  emit("itemToggle", item.id, !isOpen);
};

const handleHeaderKeyDown = (event: KeyboardEvent, item: AccordionItem) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleToggle(item);
  }
};
</script>

<template>
  <div
    :class="rootClass"
    :aria-busy="loading"
    role="presentation"
    v-bind="restAttrs"
  >
    <div role="group" :aria-label="ariaLabel" class="flex flex-col">
      <div
        v-for="item in computedItems"
        :key="item.id"
        :data-item-id="item.id"
        :class="
          classNames(
            'relative flex flex-col',
            variantToken.item,
            item.disabled && 'opacity-60',
            itemClassName,
          )
        "
      >
        <div
          role="button"
          :tabindex="item.disabled ? -1 : 0"
          :class="headerClass(item)"
          :aria-expanded="accordion.isOpen(item.id)"
          :aria-controls="`${item.id}-content`"
          :id="`${item.id}-trigger`"
          @click="handleToggle(item)"
          @keydown="handleHeaderKeyDown($event, item)"
        >
          <div
            v-if="chevronPlacement === 'left' && isIndicator"
            class="mt-1 flex items-center"
          >
            <span
              :class="indicatorClass(accordion.isOpen(item.id))"
              aria-hidden="true"
              tabindex="-1"
            >
              <VNodeRenderer :nodes="renderIcon(indicatorIcon, 'xs')" />
            </span>
          </div>
          <div class="flex flex-1 items-start gap-3">
            <div
              v-if="item.icon"
              :class="
                classNames(
                  'mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800',
                  toneToken.icon,
                  iconClassName,
                )
              "
            >
              <VNodeRenderer :nodes="renderIcon(item.icon, 'md')" />
            </div>
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <div class="flex flex-wrap items-center gap-2">
                <span :class="sizeToken.title">
                  <VNodeRenderer :nodes="item.title" />
                </span>
                <span
                  v-if="item.badge"
                  :class="
                    classNames(
                      'inline-flex items-center rounded-full px-2 py-0.5 font-medium',
                      sizeToken.badge,
                      toneToken.badge,
                    )
                  "
                >
                  <VNodeRenderer :nodes="item.badge" />
                </span>
              </div>
              <div v-if="item.subtitle" :class="classNames(sizeToken.subtitle)">
                <VNodeRenderer :nodes="item.subtitle" />
              </div>
              <div
                v-if="item.description"
                :class="classNames(sizeToken.description)"
              >
                <VNodeRenderer :nodes="item.description" />
              </div>
            </div>
          </div>
          <div
            v-if="item.actions"
            class="flex shrink-0 items-center gap-2 text-neutral-500 dark:text-neutral-300"
          >
            <VNodeRenderer :nodes="item.actions" />
          </div>
          <div
            v-if="chevronPlacement === 'right' && isIndicator"
            class="mt-1 flex items-center"
          >
            <span
              :class="indicatorClass(accordion.isOpen(item.id))"
              aria-hidden="true"
              tabindex="-1"
            >
              <VNodeRenderer :nodes="renderIcon(indicatorIcon, 'xs')" />
            </span>
          </div>
        </div>
        <div
          :id="`${item.id}-content`"
          role="region"
          :aria-labelledby="`${item.id}-trigger`"
          :class="
            classNames(
              'overflow-hidden',
              animated && contentTransitionClass,
              contentClassName,
              animated && `duration-[${transitionMs}ms]`,
            )
          "
          :data-open="accordion.isOpen(item.id)"
        >
          <div
            :class="
              classNames(
                'grid transition-all duration-200 ease-out',
                accordion.isOpen(item.id)
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0',
              )
            "
          >
            <div :class="classNames('min-h-0', variantToken.content)">
              <div
                :class="
                  classNames(
                    'overflow-hidden',
                    sizeToken.content,
                    'text-sm leading-6 text-neutral-600 dark:text-neutral-300',
                  )
                "
              >
                <VNodeRenderer :nodes="item.content" />
              </div>
            </div>
          </div>
        </div>
        <Loader
          v-if="item.loading"
          overlay
          title="Loading"
          class="rounded-none"
          size="md"
          color="blue"
        />
      </div>
    </div>
    <Loader
      v-if="loading"
      overlay
      :title="loaderTitle"
      :label="loaderMessage"
      :variant="loaderType"
      :progress="loaderProgress"
      :color="loaderColor"
    />
  </div>
</template>
