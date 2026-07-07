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

// Placeholder component — full template is in the app that consumes this kit.
const SplitView = {} as import("vue").Component;

export default SplitView;
</script>
