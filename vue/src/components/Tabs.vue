<script lang="ts">
import type { VNode } from "vue";
import classNames from "classnames";
import { getTabsColorTokens, type TrueColor } from "../theme/Theme";

export type TabsVariant =
  | "underline"
  | "soft"
  | "pill"
  | "segmented"
  | "minimal";
export type TabsSize = "sm" | "md" | "lg";
export type TabsOrientation = "horizontal" | "vertical";
export type TabsJustify = "start" | "center" | "end" | "between";

export interface TabItemAction {
  id?: string;
  label?: string | VNode;
  /** Render a fully custom node in the tab bar. When set, `icon` and `onClick` are ignored. */
  node?: VNode;
  icon?: string | VNode;
  onClick?: () => void;
  color?: TrueColor;
  active?: boolean;
}

export interface TabItem {
  id: string;
  label: string | VNode;
  icon?: string | VNode;
  description?: string | VNode;
  badge?: string | number;
  disabled?: boolean;
  panel?: string | VNode;
  badgeColor?: TrueColor;
  actions?: TabItemAction[];
}

export interface TabsProps {
  items: TabItem[];
  modelValue?: string;
  defaultValue?: string;
  variant?: TabsVariant;
  size?: TabsSize;
  color?: TrueColor;
  orientation?: TabsOrientation;
  justify?: TabsJustify;
  fullWidth?: boolean;
  listClassName?: string;
  allowReselect?: boolean;
  panelIdPrefix?: string;
  showDividers?: boolean;
  hideUnderlineContainer?: boolean;
  /** Override the variant's container class (e.g. to customise the underline border color). Takes precedence over hideUnderlineContainer. */
  containerClassName?: string;
  panelClassName?: string;
  /**
   * When true, renders a gradient fade at the top of each panel's scroll area so
   * content doesn't hard-clip against the tab bar when scrolled. Default: true.
   * Pass a Tailwind `from-*` colour to match your panel background (default: white / neutral-900 dark).
   */
  scrollFade?: boolean;
  scrollFadeFrom?: string;
}

const joinClasses = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

const baseTabClasses =
  "group relative inline-flex items-center transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60";

const focusOffset =
  "focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0";

const focusRing = (color: TrueColor) => getTabsColorTokens(color).focusRing;

const sizeStyles: Record<
  TabsSize,
  { padding: string; text: string; gap: string; icon: string }
> = {
  sm: {
    padding: "px-3 py-1.5",
    text: "text-sm font-medium",
    gap: "gap-1.5",
    icon: "h-4 w-4",
  },
  md: {
    padding: "px-4 py-2",
    text: "text-md",
    gap: "gap-2",
    icon: "h-5 w-5",
  },
  lg: {
    padding: "px-5 py-2.5",
    text: "text-base",
    gap: "gap-2.5",
    icon: "h-5 w-5",
  },
};

type VariantConfig = {
  container?: string;
  list?: string;
  base: string;
  active: string;
  inactive: string;
  disabled: string;
  badge?: string;
  badgeActive?: string;
  badgeInactive?: string;
};

const neutralTextInactive = "text-neutral-600 dark:text-neutral-300";

const buildVariantConfig = (
  variant: TabsVariant,
  color: TrueColor,
  orientation: TabsOrientation,
  hideUnderlineContainer?: boolean,
): VariantConfig => {
  const tokens = getTabsColorTokens(color);
  const hoverAccentText = tokens.hoverText;
  const activeAccentText = tokens.activeText;
  const activeOnAccent = tokens.onAccentText;
  const accentBgStrong = tokens.accentBg;
  const subtleBg = tokens.subtleBg;
  const subtleHoverBg = tokens.subtleHoverBg;
  const badgeSubtle = tokens.badgeSubtle;
  const badgeStrong = tokens.badgeStrong;
  const badgeOnAccent = tokens.badgeOnAccent;
  const underlineActive = tokens.underlineActive;
  const segmentedContainer = tokens.segmentedContainer;

  switch (variant) {
    case "soft":
      return {
        container: joinClasses(
          "rounded-full",
          subtleBg,
          orientation === "vertical" ? "p-1.5" : "p-1",
        ),
        list: "gap-1",
        base: joinClasses(
          "rounded-full font-medium",
          neutralTextInactive,
          hoverAccentText,
          "hover:bg-white/70 dark:hover:bg-white/10",
        ),
        active: joinClasses("shadow-sm", accentBgStrong, activeOnAccent),
        inactive: "",
        disabled: "text-slate-300 dark:text-slate-600",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle,
      };
    case "pill":
      return {
        container: "gap-2",
        list: "gap-2",
        base: joinClasses(
          "rounded-full border border-transparent font-medium",
          neutralTextInactive,
          hoverAccentText,
          "hover:border-current",
        ),
        active: joinClasses(
          accentBgStrong,
          activeOnAccent,
          "shadow-sm border-transparent",
        ),
        inactive: "border-slate-200 dark:border-slate-700",
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle,
      };
    case "segmented":
      return {
        container: joinClasses("rounded-lg border", segmentedContainer),
        list: classNames(
          "gap-0 overflow-hidden",
          orientation === "vertical" ? "flex-col" : "flex-row",
        ),
        base: joinClasses(
          "font-medium border border-transparent first:rounded-l-lg last:rounded-r-lg first:rounded-t-lg last:rounded-b-lg",
          neutralTextInactive,
          hoverAccentText,
          orientation === "horizontal"
            ? "-ml-px first:ml-0"
            : "-mt-px first:mt-0",
        ),
        active: joinClasses(
          accentBgStrong,
          activeOnAccent,
          "shadow-sm border-transparent dark:shadow-none",
        ),
        inactive: joinClasses("bg-transparent", subtleHoverBg),
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle,
      };
    case "minimal":
      return {
        container: "gap-2",
        list: "gap-0",
        base: joinClasses(
          "font-medium rounded-lg",
          neutralTextInactive,
          hoverAccentText,
          "hover:bg-neutral-900/5 dark:hover:bg-neutral-100/10",
          "px-2 py-1",
        ),
        active: joinClasses(activeAccentText, "font-medium "),
        inactive: "text-neutral-900/20 dark:text-neutral-500",
        disabled: "text-slate-300 dark:text-slate-600",
        badge: badgeSubtle,
        badgeActive: badgeStrong,
        badgeInactive: badgeSubtle,
      };
    case "underline":
    default:
      return {
        container: hideUnderlineContainer ? undefined : "",
        list: classNames("gap-3", orientation === "vertical" && "gap-3"),
        base: joinClasses(
          "rounded-none font-medium",
          "pb-3 pt-2",
          "border-b-2 border-transparent",
          "after:absolute after:inset-x-1.5 after:bottom-0 after:h-[3px] after:rounded-full after:opacity-0 after:transition-all after:duration-200",
          tokens.underlineActive,
          "group-hover:after:opacity-100",
          neutralTextInactive,
          hoverAccentText,
        ),
        active: joinClasses(
          activeAccentText,
          underlineActive,
          "after:opacity-100",
        ),
        inactive: "",
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeStrong,
        badgeInactive: badgeSubtle,
      };
  }
};
</script>

<script setup lang="ts">
import {
  cloneVNode,
  computed,
  h,
  isVNode,
  normalizeClass,
  ref,
  watch,
  type VNodeChild,
} from "vue";
import { useIconRenderer } from "../contexts/IconContext";
import { iconAccentActive } from "../theme/ButtonTypes";
import { useClassAttrs } from "../utils/attrsUtils";
import IconButton from "./IconButton.vue";
import Badge from "./Badge.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Tabs", inheritAttrs: false });

const props = withDefaults(defineProps<TabsProps>(), {
  variant: "underline",
  size: "md",
  color: "blue",
  orientation: "horizontal",
  justify: "start",
  fullWidth: false,
  allowReselect: false,
  panelIdPrefix: "tab-panel",
  showDividers: false,
  hideUnderlineContainer: false,
  scrollFade: true,
  scrollFadeFrom: "from-white dark:from-neutral-900",
});

const emit = defineEmits<{
  (e: "update:modelValue", id: string): void;
  (e: "change", id: string, item: TabItem): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const internalValue = ref<string | undefined>(
  props.defaultValue ?? props.items[0]?.id,
);
const activeId = computed(() => props.modelValue ?? internalValue.value);

watch(
  [() => props.items, () => props.modelValue, internalValue],
  () => {
    if (props.modelValue !== undefined) {
      return;
    }
    if (!props.items.some((item) => item.id === internalValue.value)) {
      internalValue.value = props.items[0]?.id;
    }
  },
);

const config = computed(() =>
  buildVariantConfig(
    props.variant,
    props.color,
    props.orientation,
    props.hideUnderlineContainer,
  ),
);

const sizeConfig = computed(() => sizeStyles[props.size] ?? sizeStyles.md);
const iconClasses = computed(() =>
  classNames("flex-shrink-0", sizeConfig.value.icon),
);

const shouldShowDividers = computed(
  () =>
    props.showDividers &&
    (props.variant === "underline" || props.variant === "minimal"),
);
const baseList = computed(() =>
  classNames(
    "relative flex",
    props.orientation === "vertical" ? "flex-col" : "items-center",
    props.justify === "center" &&
      props.orientation === "horizontal" &&
      "justify-center",
    props.justify === "end" &&
      props.orientation === "horizontal" &&
      "justify-end",
    props.justify === "between" &&
      props.orientation === "horizontal" &&
      "justify-between w-full",
    props.fullWidth && "w-full",
    config.value.list,
    shouldShowDividers.value && "gap-0",
    props.listClassName,
  ),
);

const resolvedContainer = computed(() =>
  props.containerClassName !== undefined
    ? props.containerClassName
    : config.value.container,
);

const rootClass = computed(() =>
  classNames(
    "tabs",
    "flex",
    props.orientation === "vertical" ? "flex-row h-full" : "flex-col h-full",
    "overflow-hidden min-h-0",
    resolvedContainer.value,
    classAttr.value,
  ),
);

// const badgeBase = config.badge ?? "bg-slate-100 text-slate-600";
// const badgeActive = config.badgeActive ?? badgeBase;
// const badgeInactive = config.badgeInactive ?? badgeBase;

const renderTabIcon = (icon: string | VNode | undefined): VNodeChild => {
  if (!icon) {
    return null;
  }

  if (typeof icon === "string") {
    return renderIcon(icon, undefined, iconClasses.value);
  }

  if (isVNode(icon)) {
    const clone = cloneVNode(icon);
    clone.props = {
      ...(clone.props ?? {}),
      class: classNames(
        iconClasses.value,
        normalizeClass(icon.props?.class) || undefined,
      ),
    };
    return clone;
  }

  return h("span", { class: iconClasses.value }, [icon]);
};

const tabButtonClass = (item: TabItem, isActive: boolean) =>
  classNames(
    baseTabClasses,
    sizeConfig.value.padding,
    sizeConfig.value.text,
    sizeConfig.value.gap,
    focusRing(props.color),
    focusOffset,
    config.value.base,
    isActive ? config.value.active : config.value.inactive,
    item.disabled && config.value.disabled,
    props.fullWidth && "flex-1 justify-center",
  );

const handleTabClick = (item: TabItem) => {
  if (item.disabled) {
    return;
  }
  if (!props.allowReselect && item.id === activeId.value) {
    return;
  }
  if (props.modelValue === undefined) {
    internalValue.value = item.id;
  }
  emit("update:modelValue", item.id);
  emit("change", item.id, item);
};

const activeActions = computed(
  () => props.items.find((item) => item.id === activeId.value)?.actions,
);

const panelClass = (isActive: boolean) =>
  classNames(
    "focus:outline-none flex-1 min-h-0",
    props.scrollFade
      ? "relative overflow-hidden"
      : "overflow-auto scrollbar-thin",
    isActive ? props.panelClassName : "hidden",
  );
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <div
      role="tablist"
      :aria-orientation="orientation"
      :class="classNames(baseList, 'flex-shrink-0 z-10')"
    >
      <template v-for="(item, index) in items" :key="item.id">
        <button
          type="button"
          role="tab"
          :id="`tab-${item.id}`"
          :aria-selected="item.id === activeId"
          :aria-controls="`${panelIdPrefix}-${item.id}`"
          :disabled="item.disabled"
          :class="tabButtonClass(item, item.id === activeId)"
          :tabindex="item.id === activeId ? 0 : -1"
          @click="handleTabClick(item)"
        >
          <VNodeRenderer :nodes="renderTabIcon(item.icon)" />
          <span class="flex min-w-0 flex-col text-left">
            <span class="truncate"><VNodeRenderer :nodes="item.label" /></span>
            <span
              v-if="item.description"
              class="mt-1 text-xs text-slate-500 dark:text-slate-400"
            >
              <VNodeRenderer :nodes="item.description" />
            </span>
          </span>
          <Badge v-if="item.badge" :count="item.badge" :tone="item.badgeColor" />
        </button>
        <span
          v-if="shouldShowDividers && index < items.length - 1"
          aria-hidden="true"
          :class="
            classNames(
              'pointer-events-none',
              orientation === 'vertical'
                ? 'mx-0 my-2 h-[2px] rounded-full w-full bg-slate-200 dark:bg-neutral-100/2'
                : 'mx-2 h-5 rounded-full w-[2px] bg-slate-300 dark:bg-neutral-400',
            )
          "
        />
      </template>
      <div class="flex-grow" />
      <div
        id="tab-item-actions-end"
        class="flex items-center gap-1 pr-2 text-neutral-400 dark:text-neutral-500"
      >
        <template
          v-for="(action, idx) in activeActions"
          :key="action.id ?? `tab-action-${idx}`"
        >
          <VNodeRenderer v-if="action.node" :nodes="action.node" />
          <IconButton
            v-else-if="action.icon"
            :accent="true"
            :color="action.color ?? color"
            :accent-color="action.color ?? color"
            :icon="action.icon"
            :size="size"
            :aria-pressed="action.active || undefined"
            :aria-label="
              typeof action.label === 'string'
                ? action.label
                : `Action ${idx + 1}`
            "
            :class="
              classNames(
                `${action.active && iconAccentActive[action.color ?? color]}`,
              )
            "
            @click="(action.onClick ?? (() => undefined))()"
          />
        </template>
      </div>
    </div>
    <template v-for="item in items" :key="`${panelIdPrefix}-${item.id}`">
      <div
        v-if="item.panel !== undefined"
        role="tabpanel"
        :id="`${panelIdPrefix}-${item.id}`"
        :aria-labelledby="`tab-${item.id}`"
        :hidden="item.id !== activeId"
        :aria-hidden="item.id !== activeId"
        :class="panelClass(item.id === activeId)"
      >
        <template v-if="scrollFade">
          <div
            aria-hidden="true"
            :class="
              classNames(
                'pointer-events-none absolute inset-x-0 top-0 h-8 z-10 bg-gradient-to-b to-transparent',
                scrollFadeFrom,
              )
            "
          />
          <div class="overflow-auto h-full scrollbar-thin">
            <VNodeRenderer :nodes="item.panel" />
          </div>
        </template>
        <VNodeRenderer v-else :nodes="item.panel" />
      </div>
    </template>
  </div>
</template>
