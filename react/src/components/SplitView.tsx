import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import {
  SURFACE_VARIANTS,
  TRUE_COLORS,
  getPanelToneStyles,
  getPillColorClasses,
  getSurfaceTextTokens,
  getSurfaceVariantClasses,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import CustomIcon from "./CustomIcon";
import EmptyState from "./EmptyState";
import { type IconName } from "../icons/registry";
import { useResizable } from "../hooks/useResizable";
import Loader from "./Loader";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";
import HelpButton, { type HelpButtonProps } from "./HelpButton";
import Panel, { type PanelDecoration, type PanelVariant } from "./Panel";
import type { InputVariant } from "../theme/Theme";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SplitViewSize = "sm" | "md" | "lg";

/**
 * The shared surface family, same as `Panel`. The component used to paint a
 * hardcoded `bg-gray-50/80 dark:bg-gray-900/80` list beside a `bg-white`
 * detail pane — the latter with no dark-mode partner at all, so the whole
 * right-hand side stayed a white slab in dark mode.
 */
export { SURFACE_VARIANTS as SPLIT_VIEW_VARIANTS };
export type SplitViewVariant = SurfaceVariant;

/**
 * The kit's three loader treatments, `skeleton` by default — a placeholder
 * shaped like the two panes keeps the layout, where an overlay spinner hides
 * it and the content jumps when the data lands.
 */
export const SPLIT_VIEW_LOADERS = ["skeleton", "spinner", "progress"] as const;
export type SplitViewLoader = (typeof SPLIT_VIEW_LOADERS)[number];

/**
 * Which `InputVariant` the built-in search takes for a given surface, so the
 * field reads as part of the pane it sits on rather than a stray control. It
 * was pinned to `gradient` with a `subtle` glow on every surface.
 */
const SEARCH_VARIANT_FOR_SURFACE: Record<SurfaceVariant, InputVariant> = {
  elevated: "elevated",
  outlined: "flat",
  subtle: "ghost",
  tonal: "ghost",
  default: "flat",
  simple: "ghost",
  glass: "glass",
  "liquid-glass": "glass",
};

export interface SplitViewItemBadge {
  label: React.ReactNode;
  tone?: TrueColor;
  variant?: "solid" | "soft" | "outline";
}

export interface SplitViewItem {
  id: string;
  /** Primary label */
  label: React.ReactNode;
  /** Secondary line shown below the label */
  subtitle?: React.ReactNode;
  /** Badges/pills rendered after the subtitle */
  badges?: SplitViewItemBadge[];
  /** Content to render in the detail pane when this item is selected */
  panel: React.ReactNode;
  /** Disable selection */
  disabled?: boolean;
  /** Hide the item entirely */
  hidden?: boolean;
  /** Optional icon rendered before the label */
  icon?: IconName;
  /** Action buttons shown on the right side of the item row (visible on hover) */
  actions?: React.ReactNode;
  /** Extra content rendered below the item row when it is the active selection */
  subContent?: React.ReactNode;
  tags?: string[];
  /** When true, renders the item with an intense accent background and a pulsing dot to signal new content */
  highlight?: boolean;
}

export type SplitViewHeaderSlot<T> = T | ((activeItem: SplitViewItem) => T);

export interface SplitViewHeaderDetails {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned tag/badge area. Accepts any React node(s). */
  tags?: React.ReactNode;
  /**
   * Custom body content rendered as the Panel children.
   * When provided, it overrides title/subtitle/description/tags content.
   */
  headerBody?: React.ReactNode;
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
  icon?: SplitViewHeaderSlot<React.ReactNode>;
  /** Defaults to the active item's label when omitted */
  title?: SplitViewHeaderSlot<React.ReactNode>;
  subtitle?: SplitViewHeaderSlot<React.ReactNode>;
  /** Right side actions in the main row */
  actions?: SplitViewHeaderSlot<React.ReactNode>;
  /** Extra customizable content rendered between identity and search */
  body?: SplitViewHeaderSlot<React.ReactNode>;
  search?: SplitViewHeaderSlot<React.ReactNode>;
  searchWidth?: string;
  /** Second row, right-aligned actions */
  bottomActions?: SplitViewHeaderSlot<React.ReactNode>;
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
  /** Controlled selected id */
  value?: string;
  /** Uncontrolled default */
  defaultValue?: string;
  onChange?: (id: string, item: SplitViewItem) => void;

  /** Title shown above the item list (e.g. "LIBRARIES (3)") */
  listTitle?: React.ReactNode;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Width of the list panel – Tailwind class (when not resizable) or initial px value for resizable */
  listWidth?: string;
  /** Accent for the active row, the resizer and the search field. */
  tone?: TrueColor;
  /** @deprecated Use `tone`, which is what every other component calls it. */
  color?: TrueColor;
  /** The surface family, shared with `Panel`. @default "subtle" */
  variant?: SplitViewVariant;
  /**
   * Tone of the *surface* — kept separate from `tone`, which is the accent.
   * A full-height two-pane layout tinted in the accent colour is a lot of
   * colour, and the accent's whole job is to stand out against the surface
   * rather than match it. Set this to tint the panes deliberately.
   * @default "neutral"
   */
  surfaceTone?: TrueColor;
  /**
   * Surface for the built-in search field. Defaults to whichever `InputVariant`
   * suits `variant`, so the field belongs to the pane it sits on.
   */
  searchVariant?: InputVariant;
  size?: SplitViewSize;
  /**
   * Draws the pulsing dot on rows with `highlight`. Turn it off to keep the
   * accent tint but drop the notification cue — useful once the user has been
   * told, or on a list where most rows are new and the dots become noise.
   * @default true
   */
  showHighlightIndicator?: boolean;

  /** Deprecated: one visible item is now always shown as detail-only (list hidden). */
  autoHideList?: boolean;

  /** Allow collapsing the list panel */
  collapsible?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state */
  defaultCollapsed?: boolean;
  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;

  /** Allow drag-to-resize the list panel */
  resizable?: boolean;
  /** Minimum list width in px when resizable (default: 180) */
  minListWidth?: number;
  /** Maximum list width in px when resizable (default: 50% of container) */
  maxListWidth?: number;

  /** Extra class for the root container */
  className?: string;
  /** Extra class for the list panel */
  listClassName?: string;
  /** Extra class for the detail panel */
  panelClassName?: string;
  /** Content rendered above the detail panel (header area) */
  panelHeader?:
    | React.ReactNode
    | ((activeItem: SplitViewItem) => React.ReactNode);
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
  emptyState?: React.ReactNode;
  /** Action buttons rendered in the list header row (e.g. an "Add" button) */
  listActions?: React.ReactNode;
  /** Content shown in the detail panel when no item is selected. Defaults to a generic EmptyState. Pass `null` to render nothing. */
  panelEmptyState?: React.ReactNode | null;

  /** When true, shows a loading state instead of the normal content */
  loading?: boolean;
  /** How `loading` is drawn. @default "skeleton" */
  loaderType?: SplitViewLoader;
  /** Determinate value for `loaderType="progress"`, 0–100. */
  loadingProgress?: number;
  /** Custom loading content, replacing whichever `loaderType` would draw. */
  loadingState?: React.ReactNode;

  /** When truthy, shows an error state instead of the normal content. Pass a string to use as the error subtitle. */
  error?: React.ReactNode;
  /** Custom error content. Defaults to a danger-toned EmptyState. */
  errorState?: React.ReactNode;
  /** Callback for the default error state's retry button */
  onRetry?: () => void;

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
  /** Callback fired when the expanded item changes (only when autoExpand=false) */
  onExpand?: (id: string, item: SplitViewItem) => void;
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

/**
 * Generated from `TRUE_COLORS`, not hand-written.
 *
 * The literal maps this replaces aliased **both `neutral` and `stone`** to one
 * shared `neutralActive` / `neutralHighlight` object — so a `stone` SplitView
 * silently rendered neutral, and `neutral` itself used `border-l-neutral-500`
 * where every other tone used `-600`. Because the literals were also what
 * Tailwind scanned, `border-l-stone-600` had never been emitted at all. The
 * shapes are declared in `scripts/generate-safelist.mjs`.
 */
type ActiveColorTokens = {
  bg: string;
  border: string;
  text: string;
  subtitle: string;
  resizer: string;
};

const activeColors: Record<TrueColor, ActiveColorTokens> = Object.fromEntries(
  TRUE_COLORS.map((c) => [
    c,
    {
      bg: `bg-${c}-50 dark:bg-${c}-900/30`,
      border: `border-l-${c}-600`,
      text: `text-${c}-900 dark:text-${c}-100`,
      subtitle: `text-${c}-600 dark:text-${c}-400`,
      resizer: `bg-${c}-400`,
    },
  ]),
) as Record<TrueColor, ActiveColorTokens>;

type HighlightTokens = { bg: string; dot: string };

const highlightColors: Record<TrueColor, HighlightTokens> = Object.fromEntries(
  TRUE_COLORS.map((c) => [
    c,
    { bg: `bg-${c}-100 dark:bg-${c}-900/50`, dot: `bg-${c}-500` },
  ]),
) as Record<TrueColor, HighlightTokens>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const SplitView: React.FC<SplitViewProps> = ({
  items,
  value,
  defaultValue,
  onChange,
  listTitle,
  searchPlaceholder = "Search...",
  listWidth,
  tone,
  color,
  variant = "subtle",
  surfaceTone = "neutral",
  searchVariant,
  size = "md",
  showHighlightIndicator = true,
  autoHideList = true,
  collapsible = false,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  resizable = false,
  minListWidth = 180,
  maxListWidth: maxListWidthProp,
  className,
  listClassName,
  panelClassName,
  panelHeader,
  panelHeaderProps,
  emptyState,
  listActions,
  panelEmptyState,
  loading = false,
  loaderType = "skeleton",
  loadingProgress,
  loadingState,
  error,
  errorState,
  onRetry,
  borderLeft = false,
  autoExpand = true,
  expandedValue,
  onExpand,
  panelScrollable = true,
}) => {
  const effectiveTone = tone ?? color ?? "blue";
  // The container owns the surface; the two panes are differentiated by a
  // *tint that composites over it* rather than a fill that replaces it — so a
  // glass or liquid-glass SplitView keeps its backdrop instead of being
  // painted over with an opaque slab.
  const surfaceClasses = getSurfaceVariantClasses(variant, surfaceTone);
  const surfaceText = getSurfaceTextTokens(variant);
  const tonePalette = getPanelToneStyles(surfaceTone);
  const resolvedSearchVariant =
    searchVariant ?? SEARCH_VARIANT_FOR_SURFACE[variant] ?? "flat";

  const visibleItems = useMemo(() => items.filter((i) => !i.hidden), [items]);
  const isSingleVisibleItem = visibleItems.length === 1;
  const isNoVisibleItems = visibleItems.length === 0;
  // Single-item mode is now always detail-only; keep autoHideList reference for backward compatibility.
  const shouldHideList =
    isSingleVisibleItem ||
    (autoHideList && visibleItems.length === 1) ||
    isNoVisibleItems;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue ?? visibleItems[0]?.id,
  );
  const activeId = value ?? internalValue;

  // When autoExpand=false, the detail panel is driven by a separate "expanded" id.
  // When autoExpand=true it always mirrors activeId.
  const [internalExpandedId, setInternalExpandedId] = useState<
    string | undefined
  >(autoExpand ? (defaultValue ?? visibleItems[0]?.id) : undefined);
  const expandedId = autoExpand
    ? activeId
    : (expandedValue ?? internalExpandedId);

  const [filter, setFilter] = useState("");

  /* ---- Collapse state (controlled / uncontrolled) ---- */
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsedControlled = typeof controlledCollapsed === "boolean";
  const isCollapsed =
    collapsible &&
    !shouldHideList &&
    (isCollapsedControlled ? controlledCollapsed : internalCollapsed);

  const toggleCollapsed = useCallback(() => {
    const next = !isCollapsed;
    if (!isCollapsedControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }, [isCollapsed, isCollapsedControlled, onCollapsedChange]);

  /* ---- Resizable ---- */
  const containerRef = useRef<HTMLDivElement>(null);

  const getMaxWidth = useCallback(() => {
    if (maxListWidthProp) return maxListWidthProp;
    if (containerRef.current)
      return Math.floor(containerRef.current.offsetWidth * 0.5);
    return 600;
  }, [maxListWidthProp]);

  const initialPxWidth = listWidth ? parseInt(listWidth, 10) : 288; // 288px = w-72
  const validInitialWidth = isNaN(initialPxWidth) ? 288 : initialPxWidth;

  const {
    width: resizableWidth,
    isDragging,
    handleProps,
  } = useResizable({
    initialWidth: validInitialWidth,
    minWidth: minListWidth,
    maxWidth: getMaxWidth,
    enabled: resizable && !isCollapsed && !shouldHideList,
  });

  // Keep selection in sync when items change
  useEffect(() => {
    if (value !== undefined) return;
    if (!visibleItems.some((i) => i.id === internalValue)) {
      setInternalValue(visibleItems[0]?.id);
    }
  }, [visibleItems, value, internalValue]);

  useEffect(() => {
    if (shouldHideList && visibleItems[0] && activeId !== visibleItems[0].id) {
      if (value === undefined) {
        setInternalValue(visibleItems[0].id);
      }
    }
  }, [shouldHideList, visibleItems, activeId, value]);

  const filteredItems = useMemo(() => {
    if (!filter) return visibleItems;
    const lower = filter.toLowerCase();
    return visibleItems.filter((item) => {
      const labelText = typeof item.label === "string" ? item.label : "";
      const subtitleText =
        typeof item.subtitle === "string" ? item.subtitle : "";
      return (
        labelText.toLowerCase().includes(lower) ||
        subtitleText.toLowerCase().includes(lower)
      );
    });
  }, [visibleItems, filter]);

  // The right-hand detail panel always follows the selected row (activeId), in both modes.
  // expandedId is only used to control subContent (inline expansion) when autoExpand=false.
  const activeItem = visibleItems.find((i) => i.id === activeId);

  const tokens = sizeTokens[size];
  const accent = activeColors[effectiveTone] ?? activeColors.blue;
  const highlightAccent = highlightColors[effectiveTone] ?? highlightColors.blue;
  const resizerColor = accent.resizer;

  const handleSelect = (item: SplitViewItem) => {
    if (item.disabled) return;
    if (value === undefined) {
      setInternalValue(item.id);
    }
    onChange?.(item.id, item);
  };

  const handleExpand = (item: SplitViewItem) => {
    if (item.disabled) return;
    const isAlreadyExpanded = expandedId === item.id;
    if (isAlreadyExpanded) {
      // Collapse
      if (expandedValue === undefined) setInternalExpandedId(undefined);
      onExpand?.(item.id, item);
      return;
    }
    // Expand — also select the item
    if (value === undefined) setInternalValue(item.id);
    onChange?.(item.id, item);
    if (expandedValue === undefined) setInternalExpandedId(item.id);
    onExpand?.(item.id, item);
  };

  const listWidthClass = listWidth ?? "w-72";

  const renderBadge = (badge: SplitViewItemBadge, idx: number) => {
    const pillTokens = getPillColorClasses(
      badge.tone ?? "sky",
      badge.variant ?? "soft",
    );
    return (
      <span
        key={idx}
        className={classNames(
          "inline-flex items-center rounded-full font-medium leading-none",
          tokens.badge,
          pillTokens.base,
          pillTokens.border,
        )}
      >
        {badge.label}
      </span>
    );
  };

  const resolveHeaderSlot = <T,>(
    slot: SplitViewHeaderSlot<T> | undefined,
    item: SplitViewItem,
  ): T | undefined => {
    if (typeof slot === "function") {
      return (slot as (activeItem: SplitViewItem) => T)(item);
    }
    return slot;
  };

  const renderBuiltInHeader = (
    item: SplitViewItem,
    options?: { promoteItemActions?: boolean },
  ) => {
    if (panelHeaderProps === undefined) return null;

    const headerProps =
      typeof panelHeaderProps === "function"
        ? panelHeaderProps(item)
        : panelHeaderProps;
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
    const promotedActions = options?.promoteItemActions
      ? item.actions
      : undefined;
    const promotedListActions = options?.promoteItemActions
      ? listActions
      : undefined;
    const mergedActions =
      customActions || promotedActions || promotedListActions ? (
        <>
          {customActions}
          {promotedActions}
          {promotedListActions}
        </>
      ) : undefined;
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

    return (
      <div className={classNames("flex-none", border, headerProps.className)}>
        <div className="flex items-center gap-3 px-4 py-3">
          {icon && <div className="shrink-0">{icon}</div>}
          <div className="flex-1 min-w-0">
            <h2 className="flex items-center gap-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              <span>{title}</span>
              {helper && <HelpButton {...helper} />}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {body && <div className="shrink-0">{body}</div>}
          {search && (
            <div className={classNames("shrink-0", headerProps.searchWidth)}>
              {search}
            </div>
          )}
          {mergedActions && (
            <div className="flex items-center gap-1 shrink-0">
              {mergedActions}
            </div>
          )}
        </div>
        {bottomActions && (
          <div className="flex items-center justify-end gap-2 px-4 pb-3">
            {bottomActions}
          </div>
        )}
        {headerDetails && hasHeaderDetailsContent && (
          <div
            className={classNames(
              isDetailsBordered &&
                "border-t border-b border-neutral-200 dark:border-neutral-700",
            )}
          >
            <Panel
              variant={detailsVariant}
              tone={detailsTone}
              decoration={detailsDecoration}
              corner="none"
              padding="none"
              className={classNames(
                "w-full shadow-none px-3 py-4",
                headerDetails.className,
              )}
            >
              {hasCustomHeaderBody ? (
                headerDetails.headerBody
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {headerDetails.title && (
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                        {headerDetails.title}
                      </div>
                    )}
                    {headerDetails.subtitle && (
                      <div className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {headerDetails.subtitle}
                      </div>
                    )}
                    {headerDetails.description && (
                      <div className="mt-1 text-[12px] text-neutral-600 dark:text-neutral-400">
                        {headerDetails.description}
                      </div>
                    )}
                  </div>
                  {headerDetails.tags && (
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {headerDetails.tags}
                    </div>
                  )}
                </div>
              )}
            </Panel>
          </div>
        )}
      </div>
    );
  };

  const renderPanelHeader = (
    item: SplitViewItem,
    options?: { promoteItemActions?: boolean },
  ) => {
    if (panelHeaderProps !== undefined) {
      return renderBuiltInHeader(item, options);
    }
    if (!panelHeader) return null;
    return typeof panelHeader === "function" ? panelHeader(item) : panelHeader;
  };
  const singleItem = shouldHideList ? visibleItems[0] : undefined;
  const singleHeader = singleItem
    ? renderPanelHeader(singleItem, { promoteItemActions: true })
    : null;
  const activeHeader = activeItem
    ? renderPanelHeader(activeItem, { promoteItemActions: false })
    : null;

  /* ---- List panel width ---- */
  const listPanelStyle: React.CSSProperties | undefined = isCollapsed
    ? { width: 48 }
    : resizable
      ? { width: resizableWidth }
      : undefined;

  const listPanelWidthClass =
    isCollapsed || resizable ? undefined : listWidthClass;

  /* ---- Loading and error treatments ---- */

  /**
   * A placeholder shaped like the two panes. The overlay treatments cover the
   * layout, so the content jumps when the data lands and the list width is
   * anybody's guess until it does; the skeleton holds both.
   */
  const SKELETON =
    "animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10";

  const renderSkeleton = (withList: boolean) => (
    <div className="flex h-full min-h-0 w-full" aria-hidden="true">
      {withList && (
        <div
          className={classNames(
            // Capped: the list width is a fixed `w-72` by default, which in a
            // container narrower than that eats the whole view and leaves the
            // detail half of the skeleton with nowhere to draw.
            "flex shrink-0 flex-col gap-3 border-r p-4 max-w-[45%]",
            listPanelWidthClass ?? "w-72",
            tonePalette.border,
          )}
        >
          <div className={classNames(SKELETON, "h-3 w-24 rounded")} />
          <div className={classNames(SKELETON, "h-8 w-full rounded-lg")} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5 py-1">
              <div className={classNames(SKELETON, "h-3 w-2/3 rounded")} />
              <div className={classNames(SKELETON, "h-2.5 w-1/2 rounded")} />
            </div>
          ))}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-6">
        <div className={classNames(SKELETON, "h-4 w-40 rounded")} />
        <div className={classNames(SKELETON, "h-3 w-64 rounded")} />
        <div className={classNames(SKELETON, "mt-4 h-32 w-full rounded-lg")} />
      </div>
    </div>
  );

  const renderOverlay = () => {
    // `skeleton` replaces the content rather than covering it, so it is handled
    // where the panes are rendered, not here.
    if (loading && loaderType !== "skeleton") {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[inherit] bg-white/60 backdrop-blur-md dark:bg-neutral-900/50">
          {loadingState ?? (
            <Loader
              size="lg"
              label="Please wait..."
              color={effectiveTone}
              variant={loaderType === "progress" ? "progress" : "spinner"}
              progress={loadingProgress}
              title="Loading..."
              spinnerThickness="thick"
              spinnerVariant="segments"
            />
          )}
        </div>
      );
    }
    if (error) {
      return (
        <div className="absolute inset-0 z-40 flex items-center justify-center rounded-[inherit] bg-white/60 backdrop-blur-md p-6 dark:bg-neutral-900/50">
          {errorState ?? (
            <EmptyState
              icon="Error"
              title="Something went wrong"
              subtitle={
                typeof error === "string"
                  ? error
                  : "An unexpected error occurred."
              }
              showIcon
              actionLabel={onRetry ? "Retry" : undefined}
              onAction={onRetry}
              actionVariant="solid"
              actionColor={effectiveTone}
              variant="plain"
              iconColor="rose"
              size="lg"
            />
          )}
        </div>
      );
    }
    return null;
  };

  const showSkeleton = loading && loaderType === "skeleton" && !loadingState;
  const skeletonOverride = loading && loaderType === "skeleton" && loadingState;

  /* ---- Auto-hide: just render the detail panel ---- */
  if (shouldHideList) {
    return (
      <div
        className={classNames(
          "relative flex h-full min-h-0 overflow-hidden",
          surfaceClasses,
          borderLeft && classNames("border-l", tonePalette.border),
          className,
        )}
      >
        {renderOverlay()}
        {showSkeleton && renderSkeleton(false)}
        {skeletonOverride && loadingState}
        <div
          className={classNames(
            "flex flex-1 flex-col min-w-0 h-full overflow-hidden",
            panelClassName,
          )}
        >
          {singleItem ? (
            <>
              {singleHeader ? (
                <div className="shrink-0">{singleHeader}</div>
              ) : listActions ? (
                <div className={classNames("shrink-0 flex items-center justify-end gap-1 px-4 py-2 border-b", tonePalette.border)}>
                  {listActions}
                </div>
              ) : null}
              <div
                className={classNames(
                  "flex-1",
                  panelScrollable ? "overflow-y-auto" : "overflow-hidden",
                )}
              >
                {singleItem.panel}
              </div>
            </>
          ) : (
            panelEmptyState !== null && (
              <div className="flex flex-1 items-center justify-center p-6">
                {panelEmptyState ?? (
                  <EmptyState
                    icon="Info"
                    title="No items"
                    subtitle="There are no items to display."
                    showIcon
                    variant="plain"
                    color={effectiveTone}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={classNames(
        "relative flex h-full min-h-0 overflow-hidden",
        surfaceClasses,
        borderLeft && classNames("border-l", tonePalette.border),
        className,
      )}
    >
      {renderOverlay()}
      {skeletonOverride && loadingState}
      {showSkeleton ? (
        renderSkeleton(true)
      ) : (
        <>
      {/* ---- List Panel ---- */}
      <div
        style={listPanelStyle}
        className={classNames(
          // A translucent tint rather than `bg-gray-50/80 dark:bg-gray-900/80`:
          // an opaque fill replaces the container's surface, so a glass or
          // liquid-glass SplitView lost its backdrop entirely on this half.
          "flex h-full shrink-0 flex-col overflow-hidden border-r bg-black/[0.025] dark:bg-white/[0.025]",
          tonePalette.border,
          isCollapsed && "transition-[width] duration-300 ease-in-out",
          listPanelWidthClass,
          listClassName,
        )}
      >
        {isCollapsed ? (
          /* ---- Collapsed: just an expand button ---- */
          <div className="flex items-center justify-center pt-3">
            <IconButton
              tooltip="Expand View"
              icon="ArrowChevronRight"
              variant="ghost"
              color={effectiveTone}
              size="xs"
              onClick={toggleCollapsed}
              aria-label="Expand list"
            />
          </div>
        ) : (
          <>
            {/* Title + Actions */}
            {(listTitle || listActions || collapsible) && (
              <div className="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between gap-2">
                {listTitle && (
                  <h3 className={classNames("text-xs font-semibold uppercase tracking-wider", surfaceText.muted)}>
                    {listTitle}
                  </h3>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  {listActions}
                  {collapsible && (
                    <IconButton
                      tooltip="Collapse View"
                      icon="ArrowChevronLeft"
                      variant="ghost"
                      color={effectiveTone}
                      size="xs"
                      onClick={toggleCollapsed}
                      aria-label="Collapse list"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Search — hidden when only one item since there is nothing to filter */}
            {visibleItems.length > 1 && (
              <div className="shrink-0 px-3 pb-2 pt-1">
                <SearchBar
                  placeholder={searchPlaceholder}
                  variant={resolvedSearchVariant}
                  glowIntensity="subtle"
                  color={effectiveTone}
                  size={size === "lg" ? "md" : "sm"}
                  onSearch={setFilter}
                />
              </div>
            )}

            {/* Item list */}
            <div className="flex-1 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className={classNames("px-4 py-6 text-center text-sm", surfaceText.muted)}>
                  {emptyState ?? "No items found"}
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isActive = item.id === activeId;
                  const isExpanded = item.id === expandedId;
                  const hasExpandControl =
                    !autoExpand && item.subContent !== undefined;
                  return (
                    <div key={item.id}>
                      {/* Row wrapper – uses a div so that action/expand buttons inside are not nested buttons */}
                      <div
                        role="button"
                        tabIndex={item.disabled ? -1 : 0}
                        aria-disabled={item.disabled}
                        onClick={() => {
                          if (!item.disabled) handleSelect(item);
                        }}
                        onKeyDown={(e) => {
                          if (
                            !item.disabled &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            handleSelect(item);
                          }
                        }}
                        className={classNames(
                          "group/item w-full text-left border-l-3 transition-all duration-150 outline-none cursor-default",
                          item.disabled &&
                            "opacity-50 cursor-not-allowed pointer-events-none",
                          tokens.item,
                          isActive
                            ? classNames(
                                accent.bg,
                                accent.border,
                                "border-l-[3px]",
                              )
                            : item.highlight
                              ? classNames(
                                  highlightAccent.bg,
                                  accent.border,
                                  "border-l-[3px]",
                                )
                              // Composites over whatever surface is beneath, so hover
                              // still reads on glass.
                              : "border-l-[3px] border-l-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                        )}
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          {/* Item content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex min-w-0 items-start gap-2">
                              {item.icon && (
                                <div className="flex items-start">
                                  <CustomIcon
                                    icon={item.icon}
                                    className={classNames(
                                      "shrink-0",
                                      iconSizeClasses[size],
                                    )}
                                  />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div
                                  className={classNames(
                                    "font-semibold leading-tight truncate",
                                    tokens.label,
                                    isActive || item.highlight
                                      ? accent.text
                                      : surfaceText.heading,
                                  )}
                                >
                                  {item.label}
                                </div>
                                {item.subtitle && (
                                  <div
                                    className={classNames(
                                      "mt-0.5 leading-tight truncate",
                                      tokens.subtitle,
                                      isActive
                                        ? accent.subtitle
                                        : surfaceText.muted,
                                    )}
                                  >
                                    {item.subtitle}
                                  </div>
                                )}
                                {item.badges && item.badges.length > 0 && (
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {item.badges.map((badge, idx) =>
                                      renderBadge(badge, idx),
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Right rail order: actions, highlight dot, expand/collapse */}
                          {(item.actions ||
                            hasExpandControl ||
                            (item.highlight && showHighlightIndicator)) && (
                            <div className="shrink-0 flex items-center gap-0.5">
                              {item.actions && (
                                // Not an interaction: this stops clicks on
                                // the action buttons from selecting the row.
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation guard only
                                <div
                                  className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  {item.actions}
                                </div>
                              )}
                              {item.highlight && showHighlightIndicator && (
                                <span
                                  className={classNames(
                                    "h-2 w-2 shrink-0 rounded-full",
                                    highlightAccent.dot,
                                    !isActive && "animate-pulse",
                                  )}
                                />
                              )}
                              {/* Expand button – only when autoExpand=false */}
                              {hasExpandControl && (
                                // Not an interaction: this stops clicks on
                                // the expand button from selecting the row.
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation guard only
                                <div
                                  className="flex items-center"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    disabled={item.disabled}
                                    onClick={() => handleExpand(item)}
                                    title={
                                      isExpanded
                                        ? "Collapse details"
                                        : "Expand details"
                                    }
                                    aria-label={
                                      isExpanded
                                        ? "Collapse details"
                                        : "Expand details"
                                    }
                                    aria-expanded={isExpanded}
                                    className={classNames(
                                      "rounded p-1 transition-colors duration-150",
                                      isExpanded
                                        ? classNames(accent.text, "opacity-100")
                                        : classNames(
                                            surfaceText.muted,
                                            // Dimmed, not hidden. At `opacity-0`
                                            // the only cue that a row *has*
                                            // sub-items was hovering it, so the
                                            // feature was undiscoverable on a
                                            // list where only some rows expand.
                                            "opacity-60 group-hover/item:opacity-100",
                                          ),
                                    )}
                                  >
                                    <svg
                                      className={classNames(
                                        "h-4 w-4 transition-transform duration-200 ease-in-out",
                                        isExpanded ? "rotate-90" : "rotate-0",
                                      )}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.subContent !== undefined && (
                        <div
                          className={classNames(
                            "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                            // When autoExpand=false, subContent is gated by the expand button (isExpanded),
                            // not by row selection (isActive) — fixes both the auto-expand and sticky-collapse bugs.
                            (autoExpand ? isActive : isExpanded)
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <div className="overflow-hidden">
                            <div
                              className={classNames(
                                "border-l-[3px]",
                                (autoExpand ? isActive : isExpanded)
                                  ? accent.border
                                  : "border-l-transparent",
                              )}
                            >
                              {item.subContent}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* ---- Resize Handle ---- */}
      {resizable && !isCollapsed && (
        <div
          {...handleProps}
          className={classNames(
            // The handle is invisible at rest; keyboard focus must reveal it
            // (WCAG 2.4.7) — useResizable supplies role="separator",
            // aria-value* and arrow-key resizing.
            "w-1.5 shrink-0 cursor-col-resize transition-all duration-150 focus-visible:opacity-100",
            resizerColor,
            isDragging
              ? "opacity-100"
              : "opacity-0 hover:opacity-30 active:opacity-100",
          )}
        />
      )}

      {/* ---- Detail Panel ---- */}
      <div
        className={classNames(
          // No fill of its own: it inherits the container's surface. It was a
          // bare `bg-white` with no `dark:` partner, so the whole detail half
          // stayed a white slab in dark mode.
          "flex h-full min-w-0 flex-1 flex-col overflow-hidden",
          panelClassName,
        )}
      >
        {activeItem ? (
          <>
            {/* Panel Header */}
            {activeHeader && <div className="shrink-0">{activeHeader}</div>}
            {/* Panel Body */}
            <div
              className={classNames(
                "flex-1",
                panelScrollable ? "overflow-y-auto" : "overflow-hidden",
              )}
            >
              {activeItem.panel}
            </div>
          </>
        ) : (
          panelEmptyState !== null && (
            <div className="flex flex-1 items-center justify-center p-6">
              {panelEmptyState ?? (
                <EmptyState
                  icon="Info"
                  title="No item selected"
                  subtitle="Select an item from the list to view its details."
                  showIcon
                  variant="plain"
                  color={effectiveTone}
                />
              )}
            </div>
          )
        )}
      </div>
        </>
      )}
    </div>
  );
};

SplitView.displayName = "SplitView";

export default SplitView;
