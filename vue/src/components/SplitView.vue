<script lang="ts">
import type { VNodeChild } from "vue";
import type { TrueColor } from "../theme/Theme";
import type { IconName } from "../icons/registry";
import type { HelpButtonProps } from "./HelpButton.vue";
import type { PanelDecoration, PanelVariant } from "./Panel.vue";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SplitViewSize = "sm" | "md" | "lg";

export interface SplitViewItemBadge {
  label: VNodeChild;
  tone?: TrueColor;
  variant?: "solid" | "soft" | "outline";
}

export interface SplitViewItem {
  id: string;
  /** Primary label */
  label: VNodeChild;
  /** Secondary line shown below the label */
  subtitle?: VNodeChild;
  /** Badges/pills rendered after the subtitle */
  badges?: SplitViewItemBadge[];
  /** Content to render in the detail pane when this item is selected */
  panel: VNodeChild;
  /** Disable selection */
  disabled?: boolean;
  /** Hide the item entirely */
  hidden?: boolean;
  /** Optional icon rendered before the label */
  icon?: IconName;
  /** Action buttons shown on the right side of the item row (visible on hover) */
  actions?: VNodeChild;
  /** Extra content rendered below the item row when it is the active selection */
  subContent?: VNodeChild;
  tags?: string[];
  /** When true, renders the item with an intense accent background and a pulsing dot to signal new content */
  highlight?: boolean;
}

export type SplitViewHeaderSlot<T> = T | ((activeItem: SplitViewItem) => T);

export interface SplitViewHeaderDetails {
  title?: VNodeChild;
  subtitle?: VNodeChild;
  description?: VNodeChild;
  /** Right-aligned tag/badge area. Accepts any node(s). */
  tags?: VNodeChild;
  /**
   * Custom body content rendered as the Panel children.
   * When provided, it overrides title/subtitle/description/tags content.
   */
  headerBody?: VNodeChild;
  tone?: TrueColor;
  variant?: PanelVariant;
  /** Alias for `variant` */
  variants?: PanelVariant;
  decoration?: PanelDecoration;
  /** Alias for `decoration` */
  decorations?: PanelDecoration;
  /** Optional divider between header row and details block (default: true). */
  bordered?: boolean;
  className?: string;
}

export interface SplitViewPanelHeaderProps {
  /** Full icon node (left side) */
  icon?: SplitViewHeaderSlot<VNodeChild>;
  /** Defaults to the active item's label when omitted */
  title?: SplitViewHeaderSlot<VNodeChild>;
  subtitle?: SplitViewHeaderSlot<VNodeChild>;
  /** Right side actions in the main row */
  actions?: SplitViewHeaderSlot<VNodeChild>;
  /** Extra customizable content rendered between identity and search */
  body?: SplitViewHeaderSlot<VNodeChild>;
  search?: SplitViewHeaderSlot<VNodeChild>;
  searchWidth?: string;
  /** Second row, right-aligned actions */
  bottomActions?: SplitViewHeaderSlot<VNodeChild>;
  /** Optional details block rendered below the header row and styled like a Panel. */
  headerDetails?: SplitViewHeaderSlot<
    SplitViewHeaderDetails | null | undefined
  >;
  /** Optional help button inserted after title */
  helper?: SplitViewHeaderSlot<HelpButtonProps | undefined>;
  border?: boolean;
  className?: string;
}

export interface SplitViewProps {
  items: SplitViewItem[];
  /** Controlled selected id (v-model) */
  modelValue?: string;
  /** Uncontrolled default */
  defaultValue?: string;

  /** Title shown above the item list (e.g. "LIBRARIES (3)") */
  listTitle?: VNodeChild;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Width of the list panel – Tailwind class (when not resizable) or initial px value for resizable */
  listWidth?: string;
  /** Accent color used for active item highlight */
  color?: TrueColor;
  size?: SplitViewSize;

  /** Deprecated: one visible item is now always shown as detail-only (list hidden). */
  autoHideList?: boolean;

  /** Allow collapsing the list panel */
  collapsible?: boolean;
  /** Controlled collapsed state (v-model:collapsed) */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state */
  defaultCollapsed?: boolean;

  /** Allow drag-to-resize the list panel */
  resizable?: boolean;
  /** Minimum list width in px when resizable (default: 180) */
  minListWidth?: number;
  /** Maximum list width in px when resizable (default: 50% of container) */
  maxListWidth?: number;

  /** Extra class for the list panel */
  listClassName?: string;
  /** Extra class for the detail panel */
  panelClassName?: string;
  /** Content rendered above the detail panel (header area) */
  panelHeader?: VNodeChild | ((activeItem: SplitViewItem) => VNodeChild);
  /**
   * Built-in SplitView header renderer (PageHeader-like) with support for dynamic slots.
   * When provided, this takes precedence over `panelHeader`.
   */
  panelHeaderProps?:
    | SplitViewPanelHeaderProps
    | ((
        activeItem: SplitViewItem,
      ) => SplitViewPanelHeaderProps | null | undefined);
  /** Rendered when no items match the search filter in the list */
  emptyState?: VNodeChild;
  /** Action buttons rendered in the list header row (e.g. an "Add" button) */
  listActions?: VNodeChild;
  /** Content shown in the detail panel when no item is selected. Defaults to a generic EmptyState. Pass `null` to render nothing. */
  panelEmptyState?: VNodeChild | null;

  /** When true, shows a loading state instead of the normal content */
  loading?: boolean;
  /** Custom loading content. Defaults to a centered Spinner with "Loading..." label. */
  loadingState?: VNodeChild;

  /** When truthy, shows an error state instead of the normal content. Pass a string to use as the error subtitle. */
  error?: VNodeChild;
  /** Custom error content. Defaults to a danger-toned EmptyState. */
  errorState?: VNodeChild;

  /** When true, renders a left border on the SplitView container to visually separate it from adjacent content (e.g. a side menu) */
  borderLeft?: boolean;

  /**
   * When true (default), the detail panel body scrolls automatically — panels can render
   * content of any height and the wrapper handles overflow.
   * When false, the panel body uses `overflow-hidden` so that panels which manage their
   * own internal scroll (e.g. a sticky-header + scrollable table layout) fill the space
   * correctly without a double-scroll or broken `h-full` percentage height.
   */
  panelScrollable?: boolean;

  /**
   * When true (default), clicking a list item immediately opens its detail panel —
   * the current behaviour.
   * When false, clicking a row only highlights it; the detail panel only opens when
   * the user explicitly clicks the expand (→) button on that row.
   */
  autoExpand?: boolean;
  /** Controlled expanded id (only meaningful when autoExpand=false) */
  expandedValue?: string;
}

/* ------------------------------------------------------------------ */
/*  Style tokens                                                       */
/* ------------------------------------------------------------------ */

const sizeTokens: Record<
  SplitViewSize,
  { item: string; label: string; subtitle: string; badge: string }
> = {
  sm: {
    item: "px-4 py-2.5",
    label: "text-sm",
    subtitle: "text-xs",
    badge: "text-[10px] px-1.5 py-0",
  },
  md: {
    item: "px-4 py-3",
    label: "text-sm",
    subtitle: "text-xs",
    badge: "text-[11px] px-2 py-0.5",
  },
  lg: {
    item: "px-5 py-4",
    label: "text-base",
    subtitle: "text-sm",
    badge: "text-xs px-2.5 py-0.5",
  },
};

const iconSizeClasses: Record<SplitViewSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

type ActiveColorTokens = {
  bg: string;
  border: string;
  text: string;
  subtitle: string;
  resizer: string;
};

// All class names must be written out as full strings so Tailwind's JIT scanner can detect them.
const neutralActive: ActiveColorTokens = {
  bg: "bg-neutral-100 dark:bg-neutral-800/40",
  border: "border-l-neutral-500",
  text: "text-neutral-900 dark:text-neutral-100",
  subtitle: "text-neutral-600 dark:text-neutral-400",
  resizer: "bg-neutral-400/40",
};

const activeColors: Record<TrueColor, ActiveColorTokens> = {
  red: {
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-l-red-600",
    text: "text-red-900 dark:text-red-100",
    subtitle: "text-red-600 dark:text-red-400",
    resizer: "bg-red-400",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/30",
    border: "border-l-orange-600",
    text: "text-orange-900 dark:text-orange-100",
    subtitle: "text-orange-600 dark:text-orange-400",
    resizer: "bg-orange-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-l-amber-600",
    text: "text-amber-900 dark:text-amber-100",
    subtitle: "text-amber-600 dark:text-amber-400",
    resizer: "bg-amber-400",
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
    border: "border-l-yellow-600",
    text: "text-yellow-900 dark:text-yellow-100",
    subtitle: "text-yellow-600 dark:text-yellow-400",
    resizer: "bg-yellow-400",
  },
  lime: {
    bg: "bg-lime-50 dark:bg-lime-900/30",
    border: "border-l-lime-600",
    text: "text-lime-900 dark:text-lime-100",
    subtitle: "text-lime-600 dark:text-lime-400",
    resizer: "bg-lime-400",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/30",
    border: "border-l-green-600",
    text: "text-green-900 dark:text-green-100",
    subtitle: "text-green-600 dark:text-green-400",
    resizer: "bg-green-400",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-l-emerald-600",
    text: "text-emerald-900 dark:text-emerald-100",
    subtitle: "text-emerald-600 dark:text-emerald-400",
    resizer: "bg-emerald-400",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/30",
    border: "border-l-teal-600",
    text: "text-teal-900 dark:text-teal-100",
    subtitle: "text-teal-600 dark:text-teal-400",
    resizer: "bg-teal-400",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-900/30",
    border: "border-l-cyan-600",
    text: "text-cyan-900 dark:text-cyan-100",
    subtitle: "text-cyan-600 dark:text-cyan-400",
    resizer: "bg-cyan-400",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-900/30",
    border: "border-l-sky-600",
    text: "text-sky-900 dark:text-sky-100",
    subtitle: "text-sky-600 dark:text-sky-400",
    resizer: "bg-sky-400",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-l-blue-600",
    text: "text-blue-900 dark:text-blue-100",
    subtitle: "text-blue-600 dark:text-blue-400",
    resizer: "bg-blue-400",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/30",
    border: "border-l-indigo-600",
    text: "text-indigo-900 dark:text-indigo-100",
    subtitle: "text-indigo-600 dark:text-indigo-400",
    resizer: "bg-indigo-400",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/30",
    border: "border-l-violet-600",
    text: "text-violet-900 dark:text-violet-100",
    subtitle: "text-violet-600 dark:text-violet-400",
    resizer: "bg-violet-400",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/30",
    border: "border-l-purple-600",
    text: "text-purple-900 dark:text-purple-100",
    subtitle: "text-purple-600 dark:text-purple-400",
    resizer: "bg-purple-400",
  },
  fuchsia: {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30",
    border: "border-l-fuchsia-600",
    text: "text-fuchsia-900 dark:text-fuchsia-100",
    subtitle: "text-fuchsia-600 dark:text-fuchsia-400",
    resizer: "bg-fuchsia-400",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/30",
    border: "border-l-rose-600",
    text: "text-rose-900 dark:text-rose-100",
    subtitle: "text-rose-600 dark:text-rose-400",
    resizer: "bg-rose-400",
  },
  slate: {
    bg: "bg-slate-50 dark:bg-slate-900/30",
    border: "border-l-slate-600",
    text: "text-slate-900 dark:text-slate-100",
    subtitle: "text-slate-600 dark:text-slate-400",
    resizer: "bg-slate-400",
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-900/30",
    border: "border-l-gray-600",
    text: "text-gray-900 dark:text-gray-100",
    subtitle: "text-gray-600 dark:text-gray-400",
    resizer: "bg-gray-400",
  },
  zinc: {
    bg: "bg-zinc-50 dark:bg-zinc-900/30",
    border: "border-l-zinc-600",
    text: "text-zinc-900 dark:text-zinc-100",
    subtitle: "text-zinc-600 dark:text-zinc-400",
    resizer: "bg-zinc-400",
  },
  neutral: neutralActive,
  stone: neutralActive,
};

type HighlightTokens = { bg: string; dot: string };

const neutralHighlight: HighlightTokens = {
  bg: "bg-neutral-100 dark:bg-neutral-700/50",
  dot: "bg-neutral-500",
};

// All class names are written as full strings so Tailwind's JIT scanner can detect them.
const highlightColors: Record<TrueColor, HighlightTokens> = {
  red: { bg: "bg-red-100 dark:bg-red-900/50", dot: "bg-red-500" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900/50", dot: "bg-orange-500" },
  amber: { bg: "bg-amber-100 dark:bg-amber-900/50", dot: "bg-amber-500" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/50", dot: "bg-yellow-500" },
  lime: { bg: "bg-lime-100 dark:bg-lime-900/50", dot: "bg-lime-500" },
  green: { bg: "bg-green-100 dark:bg-green-900/50", dot: "bg-green-500" },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
    dot: "bg-emerald-500",
  },
  teal: { bg: "bg-teal-100 dark:bg-teal-900/50", dot: "bg-teal-500" },
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/50", dot: "bg-cyan-500" },
  sky: { bg: "bg-sky-100 dark:bg-sky-900/50", dot: "bg-sky-500" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/50", dot: "bg-blue-500" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/50", dot: "bg-indigo-500" },
  violet: { bg: "bg-violet-100 dark:bg-violet-900/50", dot: "bg-violet-500" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/50", dot: "bg-purple-500" },
  fuchsia: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/50",
    dot: "bg-fuchsia-500",
  },
  rose: { bg: "bg-rose-100 dark:bg-rose-900/50", dot: "bg-rose-500" },
  slate: { bg: "bg-slate-100 dark:bg-slate-800/50", dot: "bg-slate-500" },
  gray: { bg: "bg-gray-100 dark:bg-gray-800/50", dot: "bg-gray-500" },
  zinc: { bg: "bg-zinc-100 dark:bg-zinc-800/50", dot: "bg-zinc-500" },
  neutral: neutralHighlight,
  stone: neutralHighlight,
};
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, useSlots, watchEffect } from "vue";
import classNames from "classnames";
import { getPillColorClasses } from "../theme/Theme";
import { useResizable } from "../composables/useResizable";
import { useClassAttrs } from "../utils/attrsUtils";
import CustomIcon from "./CustomIcon.vue";
import EmptyState from "./EmptyState.vue";
import Loader from "./Loader.vue";
import IconButton from "./IconButton.vue";
import SearchBar from "./SearchBar.vue";
import HelpButton from "./HelpButton.vue";
import Panel from "./Panel.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "SplitView", inheritAttrs: false });

const props = withDefaults(defineProps<SplitViewProps>(), {
  searchPlaceholder: "Search...",
  color: "blue",
  size: "md",
  autoHideList: true,
  collapsible: false,
  collapsed: undefined,
  defaultCollapsed: false,
  resizable: false,
  minListWidth: 180,
  listTitle: undefined,
  panelHeader: undefined,
  emptyState: undefined,
  listActions: undefined,
  panelEmptyState: undefined,
  loading: false,
  loadingState: undefined,
  error: undefined,
  errorState: undefined,
  borderLeft: false,
  autoExpand: true,
  panelScrollable: true,
});

const emit = defineEmits<{
  "update:modelValue": [id: string];
  change: [id: string, item: SplitViewItem];
  /** Callback when collapsed state changes */
  "update:collapsed": [collapsed: boolean];
  collapsedChange: [collapsed: boolean];
  /** Callback fired when the expanded item changes (only when autoExpand=false) */
  "update:expandedValue": [id: string | undefined];
  expand: [id: string, item: SplitViewItem];
  /** Callback for the default error state's retry button */
  retry: [];
}>();

defineSlots<{
  listTitle?: () => unknown;
  listActions?: () => unknown;
  emptyState?: () => unknown;
  panelHeader?: (props: { item: SplitViewItem }) => unknown;
  panelEmptyState?: () => unknown;
  loadingState?: () => unknown;
  errorState?: () => unknown;
}>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

// Presence of an @retry listener gates the default error state's Retry button
// (mirrors the React `onRetry ? "Retry" : undefined` check).
const instance = getCurrentInstance();
const hasRetryListener = computed(() =>
  Boolean(instance?.vnode.props?.onRetry),
);

const visibleItems = computed(() => props.items.filter((i) => !i.hidden));
const isSingleVisibleItem = computed(() => visibleItems.value.length === 1);
const isNoVisibleItems = computed(() => visibleItems.value.length === 0);
// Single-item mode is now always detail-only; keep autoHideList reference for backward compatibility.
const shouldHideList = computed(
  () =>
    isSingleVisibleItem.value ||
    (props.autoHideList && visibleItems.value.length === 1) ||
    isNoVisibleItems.value,
);
const internalValue = ref<string | undefined>(
  props.defaultValue ?? visibleItems.value[0]?.id,
);
const activeId = computed(() => props.modelValue ?? internalValue.value);

// When autoExpand=false, the detail panel is driven by a separate "expanded" id.
// When autoExpand=true it always mirrors activeId.
const internalExpandedId = ref<string | undefined>(
  props.autoExpand ? (props.defaultValue ?? visibleItems.value[0]?.id) : undefined,
);
const expandedId = computed(() =>
  props.autoExpand
    ? activeId.value
    : (props.expandedValue ?? internalExpandedId.value),
);

const filter = ref("");

/* ---- Collapse state (controlled / uncontrolled) ---- */
const internalCollapsed = ref(props.defaultCollapsed);
const isCollapsedControlled = computed(
  () => typeof props.collapsed === "boolean",
);
const isCollapsed = computed(
  () =>
    props.collapsible &&
    !shouldHideList.value &&
    (isCollapsedControlled.value
      ? (props.collapsed as boolean)
      : internalCollapsed.value),
);

const toggleCollapsed = () => {
  const next = !isCollapsed.value;
  if (!isCollapsedControlled.value) internalCollapsed.value = next;
  emit("update:collapsed", next);
  emit("collapsedChange", next);
};

/* ---- Resizable ---- */
const containerRef = ref<HTMLDivElement | null>(null);

const getMaxWidth = () => {
  if (props.maxListWidth) return props.maxListWidth;
  if (containerRef.value)
    return Math.floor(containerRef.value.offsetWidth * 0.5);
  return 600;
};

const initialPxWidth = props.listWidth ? parseInt(props.listWidth, 10) : 288; // 288px = w-72
const validInitialWidth = isNaN(initialPxWidth) ? 288 : initialPxWidth;

const {
  width: resizableWidth,
  isDragging,
  handleProps,
} = useResizable({
  initialWidth: validInitialWidth,
  minWidth: props.minListWidth,
  maxWidth: getMaxWidth,
  enabled: () => props.resizable && !isCollapsed.value && !shouldHideList.value,
});

// Keep selection in sync when items change
watchEffect(() => {
  if (props.modelValue !== undefined) return;
  if (!visibleItems.value.some((i) => i.id === internalValue.value)) {
    internalValue.value = visibleItems.value[0]?.id;
  }
});

watchEffect(() => {
  if (
    shouldHideList.value &&
    visibleItems.value[0] &&
    activeId.value !== visibleItems.value[0].id
  ) {
    if (props.modelValue === undefined) {
      internalValue.value = visibleItems.value[0].id;
    }
  }
});

const filteredItems = computed(() => {
  if (!filter.value) return visibleItems.value;
  const lower = filter.value.toLowerCase();
  return visibleItems.value.filter((item) => {
    const labelText = typeof item.label === "string" ? item.label : "";
    const subtitleText = typeof item.subtitle === "string" ? item.subtitle : "";
    return (
      labelText.toLowerCase().includes(lower) ||
      subtitleText.toLowerCase().includes(lower)
    );
  });
});

// The right-hand detail panel always follows the selected row (activeId), in both modes.
// expandedId is only used to control subContent (inline expansion) when autoExpand=false.
const activeItem = computed(() =>
  visibleItems.value.find((i) => i.id === activeId.value),
);

const tokens = computed(() => sizeTokens[props.size]);
const accent = computed(() => activeColors[props.color]);
const highlightAccent = computed(() => highlightColors[props.color]);
const resizerColor = computed(() => accent.value.resizer);

const handleSelect = (item: SplitViewItem) => {
  if (item.disabled) return;
  if (props.modelValue === undefined) {
    internalValue.value = item.id;
  }
  emit("update:modelValue", item.id);
  emit("change", item.id, item);
};

const handleExpand = (item: SplitViewItem) => {
  if (item.disabled) return;
  const isAlreadyExpanded = expandedId.value === item.id;
  if (isAlreadyExpanded) {
    // Collapse
    if (props.expandedValue === undefined) internalExpandedId.value = undefined;
    emit("update:expandedValue", undefined);
    emit("expand", item.id, item);
    return;
  }
  // Expand — also select the item
  if (props.modelValue === undefined) internalValue.value = item.id;
  emit("update:modelValue", item.id);
  emit("change", item.id, item);
  if (props.expandedValue === undefined) internalExpandedId.value = item.id;
  emit("update:expandedValue", item.id);
  emit("expand", item.id, item);
};

const handleItemKeydown = (e: KeyboardEvent, item: SplitViewItem) => {
  if (!item.disabled && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    handleSelect(item);
  }
};

const listWidthClass = computed(() => props.listWidth ?? "w-72");

const badgeClass = (badge: SplitViewItemBadge) => {
  const pillTokens = getPillColorClasses(
    badge.tone ?? "blue",
    badge.variant ?? "soft",
  );
  return classNames(
    "inline-flex items-center rounded-full font-medium leading-none",
    tokens.value.badge,
    pillTokens.base,
    pillTokens.border,
  );
};

function resolveHeaderSlot<T>(
  slot: SplitViewHeaderSlot<T> | undefined,
  item: SplitViewItem,
): T | undefined {
  if (typeof slot === "function") {
    return (slot as (activeItem: SplitViewItem) => T)(item);
  }
  return slot;
}

const hasListActions = computed(() =>
  Boolean(slots.listActions || props.listActions),
);

/* ---- Panel header resolution ---- */
// Single-item ("auto-hide") mode promotes item/list actions into the header.
const singleItem = computed(() =>
  shouldHideList.value ? visibleItems.value[0] : undefined,
);
const headerItem = computed(() =>
  shouldHideList.value ? singleItem.value : activeItem.value,
);
const promoteItemActions = computed(() => shouldHideList.value);

interface ResolvedBuiltInHeader {
  icon?: VNodeChild;
  title: VNodeChild;
  subtitle?: VNodeChild;
  body?: VNodeChild;
  search?: VNodeChild;
  searchWidth?: string;
  helper?: HelpButtonProps;
  bottomActions?: VNodeChild;
  headerDetails?: SplitViewHeaderDetails | null;
  customActions?: VNodeChild;
  promotedActions?: VNodeChild;
  promoteListActions: boolean;
  hasMergedActions: boolean;
  border: boolean;
  className?: string;
  detailsVariant: PanelVariant;
  detailsDecoration: PanelDecoration;
  detailsTone: TrueColor;
  hasCustomHeaderBody: boolean;
  hasHeaderDetailsContent: boolean;
  isDetailsBordered: boolean;
}

const builtInHeader = computed<ResolvedBuiltInHeader | null>(() => {
  const item = headerItem.value;
  if (item === undefined) return null;
  if (props.panelHeaderProps === undefined) return null;

  const headerProps =
    typeof props.panelHeaderProps === "function"
      ? props.panelHeaderProps(item)
      : props.panelHeaderProps;
  if (!headerProps) return null;

  const icon = resolveHeaderSlot(headerProps.icon, item);
  const title = resolveHeaderSlot(headerProps.title, item) ?? item.label;
  const subtitle = resolveHeaderSlot(headerProps.subtitle, item);
  const body = resolveHeaderSlot(headerProps.body, item);
  const search = resolveHeaderSlot(headerProps.search, item);
  const helper = resolveHeaderSlot(headerProps.helper, item);
  const bottomActions = resolveHeaderSlot(headerProps.bottomActions, item);
  const headerDetails = resolveHeaderSlot(headerProps.headerDetails, item);
  const customActions = resolveHeaderSlot(headerProps.actions, item);
  const promotedActions = promoteItemActions.value ? item.actions : undefined;
  const promoteListActions = promoteItemActions.value && hasListActions.value;
  const hasMergedActions = Boolean(
    customActions || promotedActions || promoteListActions,
  );
  const border = headerProps.border ?? true;
  const detailsVariant =
    headerDetails?.variant ?? headerDetails?.variants ?? "subtle";
  const detailsDecoration =
    headerDetails?.decoration ?? headerDetails?.decorations ?? "none";
  const detailsTone = headerDetails?.tone ?? "neutral";
  const hasCustomHeaderBody =
    headerDetails?.headerBody !== undefined &&
    headerDetails?.headerBody !== null;
  const hasHeaderDetailsContent = Boolean(
    hasCustomHeaderBody ||
      headerDetails?.title ||
      headerDetails?.subtitle ||
      headerDetails?.description ||
      headerDetails?.tags,
  );
  const isDetailsBordered = headerDetails?.bordered ?? true;

  return {
    icon,
    title,
    subtitle,
    body,
    search,
    searchWidth: headerProps.searchWidth,
    helper,
    bottomActions,
    headerDetails,
    customActions,
    promotedActions,
    promoteListActions,
    hasMergedActions,
    border,
    className: headerProps.className,
    detailsVariant,
    detailsDecoration,
    detailsTone,
    hasCustomHeaderBody,
    hasHeaderDetailsContent,
    isDetailsBordered,
  };
});

const customPanelHeader = computed<VNodeChild | null>(() => {
  if (props.panelHeaderProps !== undefined) return null;
  const item = headerItem.value;
  if (item === undefined) return null;
  if (slots.panelHeader) return null; // rendered directly as a scoped slot
  if (!props.panelHeader) return null;
  return typeof props.panelHeader === "function"
    ? props.panelHeader(item)
    : props.panelHeader;
});

const hasPanelHeader = computed(() =>
  Boolean(
    builtInHeader.value ||
      (props.panelHeaderProps === undefined &&
        headerItem.value !== undefined &&
        (slots.panelHeader || props.panelHeader)),
  ),
);

const hasExpandControl = (item: SplitViewItem) =>
  !props.autoExpand && item.subContent !== undefined;

const hasListHeaderRow = computed(() =>
  Boolean(
    props.listTitle ||
      slots.listTitle ||
      hasListActions.value ||
      props.collapsible,
  ),
);

/* ---- List panel width ---- */
const listPanelStyle = computed(() =>
  isCollapsed.value
    ? { width: "48px" }
    : props.resizable
      ? { width: `${resizableWidth.value}px` }
      : undefined,
);

const listPanelWidthClass = computed(() =>
  isCollapsed.value || props.resizable ? undefined : listWidthClass.value,
);

const rootClass = computed(() =>
  classNames(
    "relative flex h-full min-h-0 overflow-hidden",
    props.borderLeft && "border-l border-gray-200 dark:border-gray-700",
    classAttr.value,
  ),
);
</script>

<template>
  <div ref="containerRef" :class="rootClass" v-bind="restAttrs">
    <!-- ---- Overlay ---- -->
    <div
      v-if="loading"
      class="absolute inset-0 z-50 flex items-center justify-center rounded-[inherit] bg-white/60 backdrop-blur-md dark:bg-neutral-900/50"
    >
      <slot name="loadingState">
        <VNodeRenderer v-if="loadingState != null" :nodes="loadingState" />
        <Loader
          v-else
          size="lg"
          label="Please wait..."
          :color="color"
          variant="spinner"
          title="Loading..."
          spinner-thickness="thick"
          spinner-variant="segments"
        />
      </slot>
    </div>
    <div
      v-else-if="error"
      class="absolute inset-0 z-40 flex items-center justify-center rounded-[inherit] bg-white/60 backdrop-blur-md p-6 dark:bg-neutral-900/50"
    >
      <slot name="errorState">
        <VNodeRenderer v-if="errorState != null" :nodes="errorState" />
        <EmptyState
          v-else
          icon="Error"
          title="Something went wrong"
          :subtitle="
            typeof error === 'string' ? error : 'An unexpected error occurred.'
          "
          show-icon
          :action-label="hasRetryListener ? 'Retry' : undefined"
          action-variant="solid"
          :action-color="color"
          disable-border
          transparent-background
          icon-color="rose"
          size="lg"
          @action="emit('retry')"
        />
      </slot>
    </div>

    <template v-if="!shouldHideList">
      <!-- ---- List Panel ---- -->
      <div
        :style="listPanelStyle"
        :class="
          classNames(
            'flex flex-col shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/80 h-full overflow-hidden',
            isCollapsed && 'transition-[width] duration-300 ease-in-out',
            listPanelWidthClass,
            listClassName,
          )
        "
      >
        <!-- ---- Collapsed: just an expand button ---- -->
        <div v-if="isCollapsed" class="flex items-center justify-center pt-3">
          <IconButton
            tooltip="Expand View"
            icon="ArrowChevronRight"
            variant="ghost"
            :color="color"
            size="xs"
            aria-label="Expand list"
            @click="toggleCollapsed"
          />
        </div>
        <template v-else>
          <!-- Title + Actions -->
          <div
            v-if="hasListHeaderRow"
            class="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between gap-2"
          >
            <h3
              v-if="listTitle || $slots.listTitle"
              class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              <slot name="listTitle">
                <VNodeRenderer :nodes="listTitle" />
              </slot>
            </h3>
            <div class="flex items-center gap-1 ml-auto">
              <slot name="listActions">
                <VNodeRenderer :nodes="listActions" />
              </slot>
              <IconButton
                v-if="collapsible"
                tooltip="Collapse View"
                icon="ArrowChevronLeft"
                variant="ghost"
                :color="color"
                size="xs"
                aria-label="Collapse list"
                @click="toggleCollapsed"
              />
            </div>
          </div>

          <!-- Search — hidden when only one item since there is nothing to filter -->
          <div v-if="visibleItems.length > 1" class="shrink-0 px-3 pb-2 pt-1">
            <SearchBar
              :placeholder="searchPlaceholder"
              variant="gradient"
              glow-intensity="subtle"
              :color="color"
              @search="filter = $event"
            />
          </div>

          <!-- Item list -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-if="filteredItems.length === 0"
              class="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500"
            >
              <slot name="emptyState">
                <VNodeRenderer :nodes="emptyState ?? 'No items found'" />
              </slot>
            </div>
            <template v-else>
              <div v-for="item in filteredItems" :key="item.id">
                <!-- Row wrapper – uses a div so that action/expand buttons inside are not nested buttons -->
                <div
                  role="button"
                  :tabindex="item.disabled ? -1 : 0"
                  :aria-disabled="item.disabled"
                  :class="
                    classNames(
                      'group/item w-full text-left border-l-3 transition-all duration-150 outline-none cursor-default',
                      item.disabled &&
                        'opacity-50 cursor-not-allowed pointer-events-none',
                      tokens.item,
                      item.id === activeId
                        ? classNames(accent.bg, accent.border, 'border-l-[3px]')
                        : item.highlight
                          ? classNames(
                              highlightAccent.bg,
                              accent.border,
                              'border-l-[3px]',
                            )
                          : 'border-l-[3px] border-l-transparent hover:bg-gray-100/80 dark:hover:bg-gray-800/60',
                    )
                  "
                  @click="!item.disabled && handleSelect(item)"
                  @keydown="handleItemKeydown($event, item)"
                >
                  <div class="flex items-start gap-2 min-w-0">
                    <!-- Item content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex min-w-0 items-start gap-2">
                        <div v-if="item.icon" class="flex items-start">
                          <CustomIcon
                            :icon="item.icon"
                            :class="
                              classNames('shrink-0', iconSizeClasses[size])
                            "
                          />
                        </div>
                        <div class="min-w-0 flex-1">
                          <div
                            :class="
                              classNames(
                                'font-semibold leading-tight truncate',
                                tokens.label,
                                item.id === activeId || item.highlight
                                  ? accent.text
                                  : 'text-gray-900 dark:text-gray-100',
                              )
                            "
                          >
                            <VNodeRenderer :nodes="item.label" />
                          </div>
                          <div
                            v-if="item.subtitle"
                            :class="
                              classNames(
                                'mt-0.5 leading-tight truncate',
                                tokens.subtitle,
                                item.id === activeId
                                  ? accent.subtitle
                                  : 'text-gray-500 dark:text-gray-400',
                              )
                            "
                          >
                            <VNodeRenderer :nodes="item.subtitle" />
                          </div>
                          <div
                            v-if="item.badges && item.badges.length > 0"
                            class="mt-1.5 flex flex-wrap gap-1.5"
                          >
                            <span
                              v-for="(badge, idx) in item.badges"
                              :key="idx"
                              :class="badgeClass(badge)"
                            >
                              <VNodeRenderer :nodes="badge.label" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Right rail order: actions, highlight dot, expand/collapse -->
                    <div
                      v-if="
                        item.actions || hasExpandControl(item) || item.highlight
                      "
                      class="shrink-0 flex items-center gap-0.5"
                    >
                      <div
                        v-if="item.actions"
                        class="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150"
                        @click.stop
                        @mousedown.stop
                      >
                        <VNodeRenderer :nodes="item.actions" />
                      </div>
                      <span
                        v-if="item.highlight"
                        :class="
                          classNames(
                            'h-2 w-2 shrink-0 rounded-full',
                            highlightAccent.dot,
                            item.id !== activeId && 'animate-pulse',
                          )
                        "
                      />
                      <!-- Expand button – only when autoExpand=false -->
                      <div
                        v-if="hasExpandControl(item)"
                        class="flex items-center"
                        @click.stop
                        @mousedown.stop
                      >
                        <button
                          type="button"
                          :disabled="item.disabled"
                          :title="
                            item.id === expandedId
                              ? 'Collapse details'
                              : 'Expand details'
                          "
                          :aria-label="
                            item.id === expandedId
                              ? 'Collapse details'
                              : 'Expand details'
                          "
                          :aria-expanded="item.id === expandedId"
                          :class="
                            classNames(
                              'rounded p-1 transition-colors duration-150',
                              item.id === expandedId
                                ? classNames(accent.text, 'opacity-100')
                                : 'text-gray-400 opacity-0 group-hover/item:opacity-100 hover:text-gray-700 dark:hover:text-gray-200',
                            )
                          "
                          @click="handleExpand(item)"
                        >
                          <svg
                            :class="
                              classNames(
                                'h-4 w-4 transition-transform duration-200 ease-in-out',
                                item.id === expandedId
                                  ? 'rotate-90'
                                  : 'rotate-0',
                              )
                            "
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="item.subContent !== undefined"
                  :class="
                    classNames(
                      'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
                      // When autoExpand=false, subContent is gated by the expand button (isExpanded),
                      // not by row selection (isActive) — fixes both the auto-expand and sticky-collapse bugs.
                      (
                        autoExpand
                          ? item.id === activeId
                          : item.id === expandedId
                      )
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                    )
                  "
                >
                  <div class="overflow-hidden">
                    <div
                      :class="
                        classNames(
                          'border-l-[3px]',
                          (
                            autoExpand
                              ? item.id === activeId
                              : item.id === expandedId
                          )
                            ? accent.border
                            : 'border-l-transparent',
                        )
                      "
                    >
                      <VNodeRenderer :nodes="item.subContent" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>

      <!-- ---- Resize Handle ---- -->
      <div
        v-if="resizable && !isCollapsed"
        v-bind="handleProps"
        :class="
          classNames(
            'w-1.5 shrink-0 cursor-col-resize transition-all duration-150',
            resizerColor,
            isDragging
              ? 'opacity-100'
              : 'opacity-0 hover:opacity-30 active:opacity-100',
          )
        "
      />
    </template>

    <!-- ---- Detail Panel ---- -->
    <div
      :class="
        classNames(
          shouldHideList
            ? 'flex flex-1 flex-col min-w-0 h-full overflow-hidden'
            : 'flex flex-1 flex-col min-w-0 h-full bg-white overflow-hidden',
          panelClassName,
        )
      "
    >
      <template v-if="headerItem">
        <!-- Panel Header -->
        <div v-if="hasPanelHeader" class="shrink-0">
          <div
            v-if="builtInHeader"
            :class="
              classNames(
                'flex-none',
                builtInHeader.border,
                builtInHeader.className,
              )
            "
          >
            <div class="flex items-center gap-3 px-4 py-3">
              <div v-if="builtInHeader.icon" class="shrink-0">
                <VNodeRenderer :nodes="builtInHeader.icon" />
              </div>
              <div class="flex-1 min-w-0">
                <h2
                  class="flex items-center gap-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                >
                  <span><VNodeRenderer :nodes="builtInHeader.title" /></span>
                  <HelpButton
                    v-if="builtInHeader.helper"
                    v-bind="builtInHeader.helper"
                  />
                </h2>
                <p
                  v-if="builtInHeader.subtitle"
                  class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 truncate"
                >
                  <VNodeRenderer :nodes="builtInHeader.subtitle" />
                </p>
              </div>
              <div v-if="builtInHeader.body" class="shrink-0">
                <VNodeRenderer :nodes="builtInHeader.body" />
              </div>
              <div
                v-if="builtInHeader.search"
                :class="classNames('shrink-0', builtInHeader.searchWidth)"
              >
                <VNodeRenderer :nodes="builtInHeader.search" />
              </div>
              <div
                v-if="builtInHeader.hasMergedActions"
                class="flex items-center gap-1 shrink-0"
              >
                <VNodeRenderer :nodes="builtInHeader.customActions" />
                <VNodeRenderer :nodes="builtInHeader.promotedActions" />
                <template v-if="builtInHeader.promoteListActions">
                  <slot name="listActions">
                    <VNodeRenderer :nodes="listActions" />
                  </slot>
                </template>
              </div>
            </div>
            <div
              v-if="builtInHeader.bottomActions"
              class="flex items-center justify-end gap-2 px-4 pb-3"
            >
              <VNodeRenderer :nodes="builtInHeader.bottomActions" />
            </div>
            <div
              v-if="
                builtInHeader.headerDetails &&
                builtInHeader.hasHeaderDetailsContent
              "
              :class="
                classNames(
                  builtInHeader.isDetailsBordered &&
                    'border-t border-b border-neutral-200 dark:border-neutral-700',
                )
              "
            >
              <Panel
                :variant="builtInHeader.detailsVariant"
                :tone="builtInHeader.detailsTone"
                :decoration="builtInHeader.detailsDecoration"
                corner="none"
                padding="none"
                :class="
                  classNames(
                    'w-full shadow-none px-3 py-4',
                    builtInHeader.headerDetails.className,
                  )
                "
              >
                <VNodeRenderer
                  v-if="builtInHeader.hasCustomHeaderBody"
                  :nodes="builtInHeader.headerDetails.headerBody"
                />
                <div v-else class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <div
                      v-if="builtInHeader.headerDetails.title"
                      class="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400"
                    >
                      <VNodeRenderer
                        :nodes="builtInHeader.headerDetails.title"
                      />
                    </div>
                    <div
                      v-if="builtInHeader.headerDetails.subtitle"
                      class="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100"
                    >
                      <VNodeRenderer
                        :nodes="builtInHeader.headerDetails.subtitle"
                      />
                    </div>
                    <div
                      v-if="builtInHeader.headerDetails.description"
                      class="mt-1 text-[12px] text-neutral-600 dark:text-neutral-400"
                    >
                      <VNodeRenderer
                        :nodes="builtInHeader.headerDetails.description"
                      />
                    </div>
                  </div>
                  <div
                    v-if="builtInHeader.headerDetails.tags"
                    class="flex items-center justify-end gap-2 flex-wrap"
                  >
                    <VNodeRenderer :nodes="builtInHeader.headerDetails.tags" />
                  </div>
                </div>
              </Panel>
            </div>
          </div>
          <slot
            v-else-if="$slots.panelHeader"
            name="panelHeader"
            :item="headerItem"
          />
          <VNodeRenderer v-else :nodes="customPanelHeader" />
        </div>
        <div
          v-else-if="shouldHideList && hasListActions"
          class="shrink-0 flex items-center justify-end gap-1 px-4 py-2 border-b border-neutral-200 dark:border-neutral-700"
        >
          <slot name="listActions">
            <VNodeRenderer :nodes="listActions" />
          </slot>
        </div>
        <!-- Panel Body -->
        <div
          :class="
            classNames(
              'flex-1',
              panelScrollable ? 'overflow-y-auto' : 'overflow-hidden',
            )
          "
        >
          <VNodeRenderer :nodes="headerItem.panel" />
        </div>
      </template>
      <div
        v-else-if="panelEmptyState !== null || $slots.panelEmptyState"
        class="flex flex-1 items-center justify-center p-6"
      >
        <slot name="panelEmptyState">
          <VNodeRenderer
            v-if="panelEmptyState != null"
            :nodes="panelEmptyState"
          />
          <EmptyState
            v-else-if="shouldHideList"
            icon="Info"
            title="No items"
            subtitle="There are no items to display."
            show-icon
            disable-border
            :color="color"
          />
          <EmptyState
            v-else
            icon="Info"
            title="No item selected"
            subtitle="Select an item from the list to view its details."
            show-icon
            disable-border
            :color="color"
          />
        </slot>
      </div>
    </div>
  </div>
</template>
