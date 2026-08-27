import { Link, useLocation } from "react-router-dom";
import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomIcon from "./CustomIcon";
import { type IconName } from "../icons/registry";
import DropdownMenu, { type DropdownMenuOption } from "./DropdownMenu";
import Input from "./Input";
import Loader, { type LoaderColor, type LoaderProps } from "./Loader";
import { SkeletonBar } from "./Panel";
import {
  SIDEBAR_IDLE_COPY,
  SIDEBAR_MOBILE_QUERY,
  getSideMenuItemTokens,
  getSidebarSurfaceTokens,
  type SidebarCollapsible,
  type SidebarIdleCopyKind,
  type SidebarSide,
  type SidebarVariant,
  TrueColor,
} from "../theme";

export type SideMenuItemType = "link" | "group" | "divider";

/**
 * The loading treatments a `SideMenu` can show. The same set as `Panel`
 * (`spinner` / `progress` from the shared `Loader`, plus a skeleton): a
 * skeleton replaces the rows with a pulsing placeholder shaped like the menu,
 * while spinner / progress overlay the loader on top of the (dimmed) content.
 */
export type SideMenuLoaderType = Exclude<LoaderProps["variant"], undefined> |
  "skeleton";

export interface SideMenuGuardClaim {
  type: "claim";
  claim: string;
}
export interface SideMenuGuardAnyClaim {
  type: "anyClaim";
  claims: string[];
}
export interface SideMenuGuardAllClaims {
  type: "allClaims";
  claims: string[];
}
export interface SideMenuGuardRole {
  type: "role";
  role: string;
}
export interface SideMenuGuardAnyRole {
  type: "anyRole";
  roles: string[];
}
export interface SideMenuGuardModule {
  type: "module";
  module: string;
}
export interface SideMenuGuardAnyModule {
  type: "anyModule";
  modules: string[];
}
export interface SideMenuGuardCustom {
  type: "custom";
  fn: () => boolean;
}

export type SideMenuItemGuard =
  | SideMenuGuardClaim
  | SideMenuGuardAnyClaim
  | SideMenuGuardAllClaims
  | SideMenuGuardRole
  | SideMenuGuardAnyRole
  | SideMenuGuardModule
  | SideMenuGuardAnyModule
  | SideMenuGuardCustom;

export interface SideMenuItemBase {
  /** When true, the item is not rendered in the menu */
  hidden?: boolean;
  slug: string;
  /** Guard rules — ALL must pass (AND logic). */
  guards?: SideMenuItemGuard[];
}

export interface SideMenuSettings {
  /** When true, the menu is collapsed */
  collapsed?: boolean;
}

export interface SideMenuItemLink extends SideMenuItemBase {
  color?: TrueColor;
  type?: "link";
  label: string;
  path: string;
  icon?: IconName;
  groupName?: string;
  /** Optional badge rendered to the right of the label (e.g. active job count). */
  badge?: React.ReactNode;
  /** Short copy, matched alongside `label` by the menu search. */
  description?: string;
  /** Actions rendered at the end of the row (e.g. edit / delete buttons). */
  actions?: React.ReactNode;
  /** Show `actions` only while the row is hovered or focused. */
  actionsOnHover?: boolean;
  /** Nested sub-items. Presence makes the row collapsible. */
  children?: SideMenuItemLink[];
  /** Open the sub-tree initially. */
  defaultOpen?: boolean;
}

export interface SideMenuItemGroup extends SideMenuItemBase {
  type: "group";
  label: string;
  /** When true, renders a divider line immediately before the group header. */
  hasDivider?: boolean;
}

export interface SideMenuItemDivider extends SideMenuItemBase {
  type: "divider";
  groupName?: string;
}

export type SideMenuItem =
  | SideMenuItemLink
  | SideMenuItemGroup
  | SideMenuItemDivider;

/**
 * A full row above the navigation (top) or pinned above the collapse control
 * (footer). Renders like a link row; when `menu` is present, clicking it opens
 * the menu instead of navigating.
 */
export interface SideMenuDropdownItem {
  label: string;
  /** Registry icon name. Ignored when `media` is set. */
  icon?: IconName;
  /** Rendered instead of `icon` — e.g. an avatar. */
  media?: React.ReactNode;
  color?: TrueColor;
  /** Route to navigate to when `menu` is absent. */
  path?: string;
  /** When present, clicking the row opens this menu instead of navigating. */
  menu?: DropdownMenuOption[];
  /** Called with the selected option. The menu also closes. */
  onSelect?: (item: DropdownMenuOption) => void;
  badge?: React.ReactNode;
}

export interface SideMenuProps {
  color?: TrueColor;
  title?: string;
  /** Icon element shown in the logo area (always visible, collapsed or expanded) */
  logoIcon?: React.ReactNode;
  /** Text element shown next to the logoIcon when expanded */
  logoText?: React.ReactNode;
  items: SideMenuItem[];
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  /** When true, the desktop sidebar uses h-full instead of a fixed calc height. */
  fullHeight?: boolean;
  /** Called with item.guards; return true = show. Omit to show all. */
  guardEvaluator?: (guards: SideMenuItemGuard[]) => boolean;
  /**
   * Active module view filter (e.g. 'all' | 'host' | 'orchestrator').
   * When set to a non-'all' value, items whose module/anyModule guards reference
   * a module listed in `moduleViewOptions` must match this value to be shown.
   * Modules NOT in `moduleViewOptions` (e.g. 'reverse_proxy', 'api') are never
   * subject to the view filter and behave as before.
   * Items with no module guard are always shown.
   */
  activeModuleView?: string;
  /**
   * The set of module names that are treated as view-selectable
   * (e.g. ['host', 'orchestrator']). Only module guards whose value appears
   * in this list are subject to the activeModuleView filter.
   * Defaults to [] (no view filtering on any module).
   */
  moduleViewOptions?: readonly string[];
  /**
   * Surface treatment of the panel. `sidebar` is the standing look; the rows
   * inside take the matching treatment automatically.
   * @default "sidebar"
   */
  variant?: SidebarVariant;
  /** Which edge of the layout the panel sits on. @default "left" */
  side?: SidebarSide;
  /**
   * How the desktop panel collapses: `icon` (rail), `offcanvas` (hidden, a
   * handle at the edge opens it) or `none`. Ignored while `openOnHover` is on.
   * @default "icon"
   */
  collapsible?: SidebarCollapsible;
  /**
   * The desktop panel stays a collapsed icon rail; hovering the rail opens the
   * full menu as an overlay. The collapse control is hidden while this is on.
   * @default false
   */
  openOnHover?: boolean;
  /**
   * Duration in ms of the hover-rail panel's grow/shrink (its width
   * transition). Only meaningful while `openOnHover` is on. @default 250
   */
  hoverTransitionMs?: number;
  /**
   * Below 1024px the panel becomes an offcanvas overlay with a backdrop; at or
   * above that, `collapsible` applies. @default true
   */
  responsive?: boolean;
  /** A row above the navigation with its own dropdown menu (workspace, user…). */
  topItem?: SideMenuDropdownItem;
  /** A row pinned above the collapse control with its own dropdown menu. */
  footerItem?: SideMenuDropdownItem;
  /**
   * Paint a subtle dither-noise (film-grain) texture over the panel
   * background, behind the content. Reads best on dark surfaces.
   * @default false
   */
  noise?: boolean;
  /**
   * Show a loading state in place of (or over) the content.
   * @default false
   */
  loading?: boolean;
  /**
   * Which loader to show while `loading`. `skeleton` replaces the rows with a
   * pulsing placeholder shaped like the menu; `spinner` and `progress` overlay
   * the shared `Loader` on top of the content. The same set `Panel` offers.
   * @default "skeleton"
   */
  loaderType?: SideMenuLoaderType;
  /** Title line above the spinner / progress loader. */
  loaderTitle?: React.ReactNode;
  /** Message line under the spinner / progress loader. */
  loaderMessage?: React.ReactNode;
  /** Filled extent (0–100) for the progress loader. @default 0 */
  loaderProgress?: number;
  /** Tone of the spinner / progress loader. Defaults to the menu's `color`. */
  loaderColor?: LoaderColor;
  /**
   * Navigation placeholder rows rendered by `loaderType="skeleton"`.
   * @default 4
   */
  skeletonLines?: number;
  /** Show the item search (matches `label` and `description`) below `topItem`. */
  search?: boolean;
  /** Controlled value for the menu search. */
  searchValue?: string;
  /** Called with the new search text as the user types. */
  onSearchChange?: (value: string) => void;
  /** Placeholder for the search input. @default "Search menu" */
  searchPlaceholder?: string;
}

const EMPTY_VIEW_OPTIONS: readonly string[] = [];

const NOISE_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
};

const PANEL_WIDTH = "w-64";
const RAIL_WIDTH = "w-[68px]";

/** Row indent per nesting depth. Capped so deeper trees do not run off-screen. */
const ROW_INDENT = ["px-3", "pl-9 pr-3", "pl-14 pr-3", "pl-20 pr-3"];

const indentClass = (depth: number): string =>
  ROW_INDENT[Math.min(depth, ROW_INDENT.length - 1)];

interface SideMenuSkeletonProps {
  /** Icon-rail state: only the icon placeholders show. */
  collapsed: boolean;
  hasLogo: boolean;
  hasTopItem: boolean;
  hasSearch: boolean;
  hasTitle: boolean;
  hasFooterItem: boolean;
  showCollapse: boolean;
  /** Number of navigation placeholder rows. */
  lines: number;
}

/**
 * Placeholder shaped like the menu's own chrome: only the slots the caller
 * actually passed get a bar, so the skeleton keeps the panel's real height
 * instead of collapsing or over-reserving. Mirrors `PanelSkeleton`.
 */
const SideMenuSkeleton: React.FC<SideMenuSkeletonProps> = ({
  collapsed,
  hasLogo,
  hasTopItem,
  hasSearch,
  hasTitle,
  hasFooterItem,
  showCollapse,
  lines,
}) => (
  <div
    className="flex h-full w-full animate-pulse flex-col motion-reduce:animate-none"
    aria-hidden="true"
  >
    {/* Logo header */}
    {hasLogo && (
      <div
        className={`flex items-center gap-3 border-b border-neutral-200/60 px-4 py-4 dark:border-neutral-700/60 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <SkeletonBar className="h-6 w-6 rounded-md" />
        {!collapsed && <SkeletonBar width="8rem" className="h-3" />}
      </div>
    )}

    {/* Top item */}
    {hasTopItem && (
      <div
        className={`flex items-center gap-3 px-3 pt-2 ${collapsed ? "justify-center" : ""}`}
      >
        <SkeletonBar className="h-5 w-5 rounded-md" />
        {!collapsed && <SkeletonBar width="9rem" className="h-3" />}
      </div>
    )}

    {/* Search */}
    {hasSearch && !collapsed && (
      <div className="px-3 pb-1 pt-2">
        <SkeletonBar width="100%" className="h-8 rounded-lg" />
      </div>
    )}

    {/* Title */}
    {hasTitle && !collapsed && (
      <div className="px-6 pb-2 pt-4">
        <SkeletonBar width="7rem" className="h-3" />
      </div>
    )}

    {/* Navigation rows */}
    <div className="flex-1 space-y-1 overflow-hidden px-3 py-1">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <SkeletonBar className="h-5 w-5 rounded-md" />
          {!collapsed && (
            <SkeletonBar
              width={index === lines - 1 ? "55%" : index % 2 ? "72%" : "85%"}
              className="h-3"
            />
          )}
        </div>
      ))}
    </div>

    {/* Footer item */}
    {hasFooterItem && (
      <div
        className={`flex items-center gap-3 px-3 pb-1 ${collapsed ? "justify-center" : ""}`}
      >
        <SkeletonBar className="h-5 w-5 rounded-md" />
        {!collapsed && <SkeletonBar width="8rem" className="h-3" />}
      </div>
    )}

    {/* Collapse control */}
    {showCollapse && !collapsed && (
      <div className="border-t border-neutral-200/60 px-3 py-3 dark:border-neutral-700/60">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <SkeletonBar className="h-4 w-4" />
          <SkeletonBar width="6rem" className="h-3" />
        </div>
      </div>
    )}
  </div>
);

/**
 * Whether the responsive `SideMenu` is in its offcanvas (mobile) mode.
 * Shared with `SideMenuLayout`, so the layout's mobile toggle and the menu's
 * own breakpoint can never disagree.
 */
export const useSidebarIsMobile = (enabled = true): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(
    () =>
      enabled &&
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(SIDEBAR_MOBILE_QUERY).matches,
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(SIDEBAR_MOBILE_QUERY);
    const onChange = (event: MediaQueryListEvent) =>
      setIsMobile(enabled && event.matches);
    setIsMobile(enabled && mql.matches);
    if (!enabled) {
      return;
    }
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [enabled]);

  return isMobile;
};

// ---------------------------------------------------------------------------
// Top / footer dropdown row
// ---------------------------------------------------------------------------

interface DropdownRowProps {
  item: SideMenuDropdownItem;
  placement: "top" | "footer";
  collapsed: boolean;
  side: SidebarSide;
  idleCopy: SidebarIdleCopyKind;
}

const SideMenuDropdownRow: React.FC<DropdownRowProps> = ({
  item,
  placement,
  collapsed,
  side,
  idleCopy,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const idle = SIDEBAR_IDLE_COPY[idleCopy];
  const hasMenu = !!item.menu?.length;

  // A left sidebar's menus grow to the right (into the content), a right
  // sidebar's grow to the left — regardless of the collapsed state.
  const align = side === "left" ? "start" : "end";

  const media =
    item.media ??
    (item.icon ? (
      <CustomIcon icon={item.icon} className={`h-5 w-5 shrink-0 ${idle.icon}`} />
    ) : null);

  const labelSpan = (
    <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">
      {item.label}
    </span>
  );

  const rowClasses = `relative group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
    collapsed ? "justify-center" : "gap-3"
  } ${idle.text}`;

  if (!hasMenu) {
    const hoverClasses =
      item.path &&
      "hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40";

    const content = (
      <>
        {media}
        {!collapsed && labelSpan}
        {!collapsed && item.badge && (
          <span className="ml-auto shrink-0 pl-2">{item.badge}</span>
        )}
      </>
    );

    if (item.path) {
      return (
        <Link
          to={item.path}
          title={collapsed ? item.label : undefined}
          className={`${rowClasses} ${hoverClasses}`}
        >
          {content}
        </Link>
      );
    }
    return <div className={rowClasses}>{content}</div>;
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        title={collapsed ? item.label : undefined}
        className={`${rowClasses} hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40`}
      >
        {media}
        {!collapsed && (
          <>
            {labelSpan}
            {item.badge && (
              <span className="ml-auto shrink-0 pl-2">{item.badge}</span>
            )}
            <CustomIcon
              icon="ChevronRight"
              className="h-4 w-4 shrink-0 rotate-90 text-neutral-400 dark:text-neutral-500"
            />
          </>
        )}
        {collapsed && item.badge && (
          <span className="absolute -top-1 -right-1">{item.badge}</span>
        )}
      </button>
      <DropdownMenu
        anchorRef={triggerRef}
        open={open}
        onClose={() => setOpen(false)}
        items={item.menu ?? []}
        onSelect={item.onSelect}
        align={align}
        side={placement === "top" ? "bottom" : "top"}
        width={240}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// SideMenu
// ---------------------------------------------------------------------------

export const SideMenu = ({
  title,
  logoIcon,
  logoText,
  items,
  className = "",
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  fullHeight = false,
  guardEvaluator,
  activeModuleView,
  moduleViewOptions = EMPTY_VIEW_OPTIONS,
  color = "blue",
  variant = "sidebar",
  side = "left",
  collapsible = "icon",
  openOnHover = false,
  hoverTransitionMs = 250,
  responsive = true,
  topItem,
  footerItem,
  noise = false,
  loading = false,
  loaderType = "skeleton",
  loaderTitle,
  loaderMessage,
  loaderProgress,
  loaderColor,
  skeletonLines = 4,
  search = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search menu",
}: SideMenuProps) => {
  const location = useLocation();
  const panelId = useId();
  const isMobile = useSidebarIsMobile(responsive);

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [hoverOpen, setHoverOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  const searchQuery = searchValue ?? internalSearch;
  const setSearchQuery = (value: string) => {
    setInternalSearch(value);
    onSearchChange?.(value);
  };

  const searchActive = search && searchQuery.trim().length > 0;

  // Collapse state: controlled via `onToggleCollapse`, internal otherwise.
  const collapsedState = onToggleCollapse ? collapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((value) => !value);
    }
  };

  // `openOnHover` owns the desktop state: the rail is always collapsed and the
  // full panel is a hover overlay, so `collapsible` no longer applies.
  const effectiveMode: SidebarCollapsible = openOnHover ? "icon" : collapsible;
  const expanded = isMobile
    ? true
    : openOnHover
      ? false
      : effectiveMode === "none"
        ? true
        : !collapsedState;

  const showCollapseControl =
    !isMobile && !openOnHover && effectiveMode !== "none";
  const showOffcanvasHandle =
    !isMobile && effectiveMode === "offcanvas" && !expanded;

  const surface = getSidebarSurfaceTokens(variant, color);
  const idle = SIDEBAR_IDLE_COPY[surface.idleCopy];

  const showSkeleton = loading && loaderType === "skeleton";
  const skeletonSlots = {
    hasLogo: Boolean(logoIcon || logoText),
    hasTopItem: Boolean(topItem),
    hasSearch: search,
    hasTitle: Boolean(title),
    hasFooterItem: Boolean(footerItem),
    showCollapse: showCollapseControl,
    lines: skeletonLines,
  };
  // Written as one expression so `loaderType` narrows to the Loader's own
  // variants for the overlay (skeleton replaces the content instead).
  const loaderOverlay =
    loading && loaderType !== "skeleton" ? (
      <Loader
        overlay
        variant={loaderType}
        title={loaderTitle}
        label={loaderMessage}
        progress={loaderProgress}
        color={loaderColor ?? color}
      />
    ) : null;

  // ── Hover overlay (openOnHover) ─────────────────────────────────────────
  const cancelHoverClose = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  const scheduleHoverClose = () => {
    cancelHoverClose();
    hoverTimer.current = setTimeout(() => setHoverOpen(false), 150);
  };
  const closeHover = () => {
    cancelHoverClose();
    setHoverOpen(false);
  };
  const handleRailEnter = () => {
    if (!openOnHover || isMobile) return;
    cancelHoverClose();
    setHoverOpen(true);
  };
  const handleRailLeave = () => {
    if (!openOnHover || isMobile) return;
    scheduleHoverClose();
  };
  useEffect(() => {
    if (!openOnHover) setHoverOpen(false);
  }, [openOnHover]);

  // ── Active path ─────────────────────────────────────────────────────────
  // Exact match or a descendant: "/dashboard" must not light up on
  // "/dashboardx" the way a bare startsWith does.
  const isActivePath = (path: string): boolean => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const hasActiveDescendant = (link: SideMenuItemLink): boolean =>
    !!link.children?.some(
      (child) => isActivePath(child.path) || hasActiveDescendant(child),
    );

  // ── Nested submenus ─────────────────────────────────────────────────────
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const walk = (list: SideMenuItemLink[]) => {
      for (const link of list) {
        if (link.children?.length) {
          if (link.defaultOpen) initial.add(link.slug);
          walk(link.children);
        }
      }
    };
    walk(
      items.filter(
        (item): item is SideMenuItemLink =>
          item.type !== "group" && item.type !== "divider",
      ),
    );
    return initial;
  });

  const toggleSubmenu = (slug: string) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  // ── Visible items (guards + module view + search) ───────────────────────
  const query = searchQuery.trim().toLowerCase();

  const matchesItem = (item: SideMenuItemLink): boolean =>
    !query ||
    item.label.toLowerCase().includes(query) ||
    (item.description ?? "").toLowerCase().includes(query);

  const matchesSubtree = (item: SideMenuItemLink): boolean =>
    matchesItem(item) || (item.children ?? []).some(matchesSubtree);

  const visibleItems = useMemo(() => {
    const isViewFiltered = !!activeModuleView && activeModuleView !== "all";

    const passesModuleViewFilter = (guards: SideMenuItemGuard[]): boolean => {
      if (!isViewFiltered || moduleViewOptions.length === 0) return true;
      for (const guard of guards) {
        if (guard.type === "module") {
          // Only view-filter this guard if the module is a known view option
          if (
            moduleViewOptions.includes(guard.module) &&
            guard.module !== activeModuleView
          )
            return false;
        } else if (guard.type === "anyModule") {
          // Only look at the subset of modules that are view options
          const viewModulesInGuard = guard.modules.filter((m) =>
            moduleViewOptions.includes(m),
          );
          if (
            viewModulesInGuard.length > 0 &&
            !viewModulesInGuard.includes(activeModuleView!)
          )
            return false;
        }
      }
      return true;
    };

    const passesGuard = (item: SideMenuItem): boolean => {
      if (item.hidden) return false;
      if (item.guards?.length) {
        if (!passesModuleViewFilter(item.guards)) return false;
        if (guardEvaluator) return guardEvaluator(item.guards);
      }
      return true;
    };

    // Which group slugs have ≥1 visible link?
    const groupsWithVisibleLinks = new Set<string>();
    items.forEach((item) => {
      if (
        item.type !== "group" &&
        item.type !== "divider" &&
        passesGuard(item) &&
        matchesSubtree(item)
      ) {
        if (item.groupName) groupsWithVisibleLinks.add(item.groupName);
      }
    });

    return items.filter((item) => {
      if (!passesGuard(item)) return false;
      if (item.type !== "group" && item.type !== "divider" && !matchesSubtree(item)) {
        return false;
      }
      if (item.type === "group") return groupsWithVisibleLinks.has(item.slug);
      // Standalone dividers: hide if groupName set but that group has no visible links
      if (item.type === "divider")
        return !item.groupName || groupsWithVisibleLinks.has(item.groupName);
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, guardEvaluator, activeModuleView, moduleViewOptions, query]);

  const hasVisibleLink = visibleItems.some(
    (item) => item.type !== "group" && item.type !== "divider",
  );

  // ── Shell classes ───────────────────────────────────────────────────────
  const heightClass = fullHeight ? "h-full" : "sticky top-16 h-[calc(100vh-64px)]";
  const isLeft = side === "left";
  // The hover-rail grows the panel itself — one solid div whose width
  // transitions 68px → 256px on hover (PrimeVue-style) — instead of a separate
  // overlay fading in over the rail, which read as a second, see-through layer.
  const isHoverMode = openOnHover && !isMobile;

  const borderClasses = surface.border
    ? `${surface.border} ${
        surface.borderSides === "all"
          ? "border"
          : isLeft
            ? "border-r"
            : "border-l"
      }`
    : "";

  // The aside's own width is the collapse mechanism: 256px expanded, a 68px
  // rail in icon mode, 0 in offcanvas. In hover mode the rail grows to 256px
  // while hovered. Content reflows with it (icon mode, as in the standing
  // menu) or stays a fixed 256px box that the aside clips (offcanvas).
  const asideWidth =
    effectiveMode === "offcanvas"
      ? expanded
        ? PANEL_WIDTH
        : "w-0"
      : isHoverMode
        ? hoverOpen
          ? PANEL_WIDTH
          : RAIL_WIDTH
        : expanded
          ? PANEL_WIDTH
          : RAIL_WIDTH;

  const panelPosition = isLeft ? "left-0" : "right-0";
  const offcanvasHidden = effectiveMode === "offcanvas" && !expanded;

  // In hover mode the wrapper keeps a fixed 68px in-flow footprint so the main
  // content does not shift; the aside grows over it (absolute) instead.
  const desktopClasses = `
    relative flex-shrink-0 ${heightClass} ${isHoverMode ? RAIL_WIDTH : ""} ${surface.offset}
  `;

  const asideClasses = isHoverMode
    ? `
      absolute inset-y-0 ${panelPosition} z-40 overflow-hidden transition-[width] ease-in-out ${asideWidth}
      ${surface.radius} ${borderClasses} ${isLeft ? surface.shadow : surface.shadowRight}
      ${className}
    `
    : `
      relative h-full overflow-hidden transition-all duration-300 ${asideWidth}
      ${surface.radius} ${borderClasses} ${isLeft ? surface.shadow : surface.shadowRight}
      ${className}
    `;

  // The hover-rail panel is solid so the rail, sibling menus and page content
  // it grows over do not show through a translucent fill.
  const panelFill = isHoverMode ? surface.solidFill : surface.fill;

  // The panel's own content is collapsed in the rail, expanded in the panel —
  // in hover mode that is driven by the hover state, not the collapse state.
  const contentCollapsed = isHoverMode ? !hoverOpen : !expanded;

  const contentClasses =
    effectiveMode === "offcanvas"
      ? `absolute inset-y-0 ${panelPosition} ${PANEL_WIDTH} flex flex-col`
      : "relative h-full w-full flex flex-col";

  // Mobile drawer — always the standing translucent look.
  const mobileClasses = `
    fixed inset-y-0 ${panelPosition} z-[60] w-64 bg-white/90 dark:bg-neutral-900/95 backdrop-blur-xl transition-transform duration-300 ease-in-out
    ${mobileOpen ? "translate-x-0" : isLeft ? "-translate-x-full" : "translate-x-full"}
    ${className}
  `;

  // ── Content ─────────────────────────────────────────────────────────────
  const logoSection =
    logoIcon || logoText
      ? (contentCollapsed: boolean) => (
          <div
            className={`relative z-50 flex h-15 items-center border-b px-4 py-4 ${
              variant === "glass" || variant === "floating-glass"
                ? "bg-white/20 border-white/30 dark:bg-white/5 dark:border-white/10"
                : "bg-white border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
            } ${contentCollapsed ? "justify-center" : ""}`}
          >
            {logoIcon && <div className="shrink-0">{logoIcon}</div>}
            {logoText && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  contentCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
                }`}
              >
                <div className="whitespace-nowrap">{logoText}</div>
              </div>
            )}
          </div>
        )
      : null;

  const renderLinkRow = (
    link: SideMenuItemLink,
    depth: number,
    key: string,
    contentCollapsed: boolean,
  ): React.ReactNode => {
    const hasChildren = !!link.children?.length;
    const selfActive = isActivePath(link.path);
    const childActive = hasChildren ? hasActiveDescendant(link) : false;
    // While searching, only matching branches stay visible under a parent.
    const visibleChildren = searchActive
      ? (link.children ?? []).filter(matchesSubtree)
      : (link.children ?? []);
    const showChildren =
      hasChildren &&
      (searchActive || openSubmenus.has(link.slug)) &&
      visibleChildren.length > 0;
    const tokens = getSideMenuItemTokens(link.color || color);

    const rowClasses = `group relative flex items-center rounded-lg transition-all duration-150 ${indentClass(depth)} ${
      selfActive
        ? `${tokens.bg} ${tokens.text} shadow-sm`
        : childActive
          ? tokens.text
          : `${idle.text} ${tokens.hoverBg} ${tokens.hoverText}`
    }`;

    return (
      <div key={key}>
        <div className={rowClasses}>
          <Link
            to={link.path}
            onClick={() => {
              if (mobileOpen) onCloseMobile?.();
              if (hoverOpen) closeHover();
            }}
            aria-current={selfActive ? "page" : undefined}
            title={contentCollapsed ? link.label : undefined}
            className={`flex min-w-0 flex-1 items-center gap-3 py-2.5 text-sm font-medium ${
              contentCollapsed ? "justify-center" : ""
            }`}
          >
            {link.icon && (
              <div className="flex items-center justify-center relative shrink-0">
                <CustomIcon
                  icon={link.icon}
                  className={`h-5 w-5 transition-colors duration-150 ${
                    selfActive
                      ? tokens.iconActive
                      : `${idle.icon} ${tokens.iconHover}`
                  }`}
                />
                {/* Badge in collapsed mode: small dot over the icon */}
                {contentCollapsed && link.badge && (
                  <span className="absolute -top-1 -right-1">{link.badge}</span>
                )}
              </div>
            )}
            {!contentCollapsed && (
              <>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                  {link.label}
                </span>
                {/* Badge in expanded mode: right-aligned next to label */}
                {link.badge && (
                  <span className="ml-auto flex shrink-0 items-center pl-2">
                    {link.badge}
                  </span>
                )}
              </>
            )}
          </Link>
          {/* Actions at the end of the row (hidden in the icon rail) */}
          {!contentCollapsed && link.actions && (
            <span
              className={`flex shrink-0 items-center gap-1 ${
                link.actionsOnHover
                  ? "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                  : ""
              }`}
            >
              {link.actions}
            </span>
          )}
          {/* Submenu toggle (hidden in the icon rail) */}
          {hasChildren && !contentCollapsed && (
            <button
              type="button"
              aria-expanded={showChildren}
              aria-label={`${showChildren ? "Collapse" : "Expand"} ${link.label} submenu`}
                onClick={() => toggleSubmenu(link.slug)}
                className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-700/40 dark:hover:text-neutral-300"
            >
              <CustomIcon
                icon="ChevronRight"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  showChildren ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </div>
        {showChildren && (
          <div
            className="space-y-1"
            role="group"
            aria-label={`${link.label} submenu`}
          >
            {visibleChildren.map((child, index) =>
              renderLinkRow(
                child,
                depth + 1,
                `${key}-child-${index}`,
                contentCollapsed,
              ),
            )}
          </div>
        )}
      </div>
    );
  };

  const renderContent = (contentCollapsed: boolean, isMobileView: boolean) => (
    <>
      {/* Logo Header */}
      {logoSection && logoSection(contentCollapsed)}

      {/* Top item (above the navigation, with its own dropdown) */}
      {topItem && (
        <div className="shrink-0 px-3 pt-2">
          <SideMenuDropdownRow
            item={topItem}
            placement="top"
            collapsed={contentCollapsed}
            side={side}
            idleCopy={surface.idleCopy}
          />
        </div>
      )}

      {/* Search — below the top item, matches label + description */}
      {search && !contentCollapsed && (
        <div className="shrink-0 px-3 pb-1 pt-2">
          <Input
            size="sm"
            variant="ghost"
            tone={color}
            leadingIcon="Search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search menu items"
            className="w-full"
          />
        </div>
      )}

      {/* Title + Mobile Close */}
      {(title || isMobileView) && (
        <div
          className={`px-6 pt-4 pb-2 flex items-center ${
            contentCollapsed && !isMobileView
              ? "justify-center px-3"
              : "justify-between"
          }`}
        >
          {title && !(contentCollapsed && !isMobileView) && (
            <h2 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider whitespace-nowrap">
              {title}
            </h2>
          )}
          {/* Mobile Close Button */}
          {isMobileView && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-neutral-700/50 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors ml-auto"
              aria-label="Close menu"
            >
              <CustomIcon icon="Close" className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-1 overflow-y-auto w-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent">
        <nav aria-label={title || "Side menu"} className="space-y-1 w-full">
          {visibleItems.map((item, index) => {
            // Divider
            if (item.type === "divider") {
              return (
                <div
                  key={`divider-${index}-${item.slug}`}
                  className={`my-2 border-t border-neutral-200/60 dark:border-neutral-700/60 ${
                    contentCollapsed && !isMobileView ? "mx-1" : "mx-0"
                  }`}
                />
              );
            }

            // Group Header
            if (item.type === "group") {
              if (contentCollapsed && !isMobileView) return null;
              return (
                <React.Fragment key={`group-${index}-${item.slug}`}>
                  {item.hasDivider && (
                    <div
                      className={`my-2 border-t border-neutral-200/60 dark:border-neutral-700/60 ${
                        contentCollapsed && !isMobileView ? "mx-1" : "mx-0"
                      }`}
                    />
                  )}
                  <div
                    className={`px-3 py-1 mb-1 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider ${
                      index === 0 ? "mt-1" : "mt-4"
                    }`}
                  >
                    {item.label}
                  </div>
                </React.Fragment>
              );
            }

            // Link (Default)
            return renderLinkRow(
              item,
              0,
              `link-${index}-${item.slug}`,
              contentCollapsed,
            );
          })}
          {searchActive && !hasVisibleLink && (
            <p className="px-3 py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
              No results for "{searchQuery.trim()}"
            </p>
          )}
        </nav>
      </div>

      {/* Footer item (pinned above the collapse control) */}
      {footerItem && (
        <div className="shrink-0 px-3 pb-1">
          <SideMenuDropdownRow
            item={footerItem}
            placement="footer"
            collapsed={contentCollapsed}
            side={side}
            idleCopy={surface.idleCopy}
          />
        </div>
      )}

      {/* Collapse Toggle (desktop only, hidden with openOnHover) */}
      {!isMobileView && showCollapseControl && (
        <div className="shrink-0 border-t border-neutral-200/60 dark:border-neutral-700/60 px-3 py-3">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-expanded={expanded}
            aria-controls={panelId}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors ${
              !expanded ? "justify-center" : ""
            }`}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <CustomIcon
              icon={
                expanded
                  ? isLeft
                    ? "ArrowChevronLeft"
                    : "ArrowChevronRight"
                  : isLeft
                    ? "ArrowChevronRight"
                    : "ArrowChevronLeft"
              }
              className="w-4 h-4 shrink-0"
            />
            {expanded && (
              <span className="ml-3 whitespace-nowrap">Collapse</span>
            )}
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {isMobile ? (
        // Mobile Sidebar (offcanvas overlay)
        <aside className={mobileClasses} inert={!mobileOpen} aria-busy={loading}>
          <div className="relative h-full flex flex-col w-full">
            {showSkeleton ? (
              <SideMenuSkeleton collapsed={false} {...skeletonSlots} />
            ) : (
              renderContent(false, true)
            )}
            {loaderOverlay}
          </div>
        </aside>
      ) : (
        // Desktop Sidebar
        <div
          className={desktopClasses}
          onKeyDown={(event) => {
            if (event.key === "Escape" && hoverOpen) closeHover();
          }}
        >
          {/* In hover mode this aside IS the panel: it grows 68 → 256px on
              hover (duration via `hoverTransitionMs`) and is solid, so nothing
              behind it shows through. The hover handlers live on the growing
              box, not the 68px wrapper, so the pointer can travel from the
              rail into the expanded part without leaving. */}
          <aside
            className={asideClasses}
            aria-busy={loading}
            style={
              isHoverMode ? { transitionDuration: `${hoverTransitionMs}ms` } : undefined
            }
            onMouseEnter={handleRailEnter}
            onMouseLeave={handleRailLeave}
          >
            {/* Fill / blur layer — kept on a separate absolute element so the
                outer wrapper does not create a stacking context. */}
            <div
              className={`absolute inset-0 pointer-events-none ${panelFill} ${surface.radius}`}
            />
            {noise && (
              <div
                className={`absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay ${surface.radius}`}
                style={NOISE_STYLE}
              />
            )}
            <div
              id={panelId}
              inert={offcanvasHidden || undefined}
              className={contentClasses}
            >
              {showSkeleton ? (
                <SideMenuSkeleton collapsed={contentCollapsed} {...skeletonSlots} />
              ) : (
                renderContent(contentCollapsed, false)
              )}
            </div>
            {loaderOverlay}
          </aside>
          {/* Offcanvas handle — the way back in once the panel is hidden.
              Sibling of the (clipping) aside so it is not cut off at w-0. */}
          {showOffcanvasHandle && (
            <button
              type="button"
              onClick={toggleCollapse}
              aria-expanded={false}
              aria-label="Open sidebar"
              title="Open sidebar"
              className={`absolute top-1/2 -translate-y-1/2 z-20 flex h-14 w-6 items-center justify-center border border-neutral-200 bg-white/95 text-neutral-500 shadow-md backdrop-blur transition-colors hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-400 dark:hover:text-neutral-100 ${
                isLeft ? "left-0 rounded-r-lg" : "right-0 rounded-l-lg"
              }`}
            >
              <CustomIcon
                icon={isLeft ? "ArrowChevronRight" : "ArrowChevronLeft"}
                className="h-4 w-4"
              />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default SideMenu;
