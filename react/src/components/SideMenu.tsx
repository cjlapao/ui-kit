import { Link, useLocation } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomIcon from "./CustomIcon";
import { useKitT } from "../i18n";
import { type IconName } from "../icons/registry";
import DropdownMenu, { type DropdownMenuOption } from "./DropdownMenu";
import Input from "./Input";
import Loader, { type LoaderColor, type LoaderProps } from "./Loader";
import ScrollArea from "./ScrollArea";
import Spinner from "./Spinner";
import Panel, { SkeletonBar } from "./Panel";
import Pill, { type PillCorner, type PillVariant } from "./Pill";
import Button, { getButtonLinkClasses } from "./Button";
import {
  SIDEBAR_IDLE_COPY,
  SIDEBAR_MOBILE_QUERY,
  SIDE_MENU_HEADER_FILL,
  SIDE_MENU_HEADER_HEIGHT,
  SIDE_MENU_HEADER_SEAM,
  getSideMenuItemTokens,
  getSidebarSurfaceTokens,
  getTrueColorTextClass,
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
  /**
   * Optional badge rendered to the right of the label (e.g. active job count).
   * In the icon rail it rides the icon's corner.
   */
  badge?: React.ReactNode;
  /**
   * Trailing metadata — a time ("38min"), a size, a status word. Muted at the
   * row end when expanded; hidden in the icon rail, where it is not a badge
   * and has no room.
   */
  meta?: React.ReactNode;
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
  /**
   * Work in progress on this row: a spinner takes the icon's place (in the
   * rail too) and the link is marked `aria-busy`.
   */
  loading?: boolean;
  /**
   * Show the children a page at a time: this many at first, then a
   * "Show N more" row reveals the next page. Searching shows every match, and
   * an active child past the page is always revealed.
   */
  childrenPageSize?: number;
  /**
   * How many children exist in all, when only some are loaded (lazy). The
   * "Show N more" count uses it, and paging past the loaded ones calls
   * `onLoadMoreChildren`.
   */
  childrenTotal?: number;
  /** Fetch the next children — called when "Show more" needs ones not loaded yet. */
  onLoadMoreChildren?: () => void;
  /** The next children are being fetched: the "Show more" row spins and waits. */
  loadingChildren?: boolean;
  /**
   * The "Show more" row's text — name what is being loaded, e.g.
   * `(n) => "Show " + n + " more sessions"`. @default "Show {count} more"
   */
  moreChildrenLabel?: (remaining: number) => React.ReactNode;
}

export interface SideMenuItemGroup extends SideMenuItemBase {
  type: "group";
  label: string;
  /** When true, renders a divider line immediately before the group header. */
  hasDivider?: boolean;
  /** Controls at the end of the group header — search, filter, add… */
  actions?: React.ReactNode;
  /** Show `actions` only while the header is hovered or holds focus. */
  actionsOnHover?: boolean;
  /** A coloured vertical line before the label — tags the section with a tone. */
  tag?: TrueColor;
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

/**
 * A CTA card's single action. `path` and `onClick` are alternatives — the
 * route wins when both are set, since it's the stronger promise.
 */
export interface SideMenuCtaAction {
  label: string;
  /** Route — rendered as a router link carrying `Button`'s class recipe. */
  path?: string;
  /** Otherwise a solid `Button` of the card's tone calling this. */
  onClick?: () => void;
  /** Registry icon name shown before the label. */
  icon?: IconName;
}

/**
 * A promo/upsell card pinned between the navigation and the footer rows —
 * media, title, description and one action, built on `Panel`. Only rendered
 * while the panel is expanded; a stack taller than the (capped) zone
 * scrolls inside it, the nav keeping its own scroll.
 */
export interface SideMenuCta {
  slug: string;
  title: string;
  description?: string;
  /** Rendered above the title; any node (image, illustration, icon). */
  media?: React.ReactNode;
  action?: SideMenuCtaAction;
  /** Accent tone. @default the menu's `color`. */
  tone?: TrueColor;
  /** When true, the card is not rendered */
  hidden?: boolean;
  /** Guard rules — ALL must pass (AND logic), as with nav items. */
  guards?: SideMenuItemGuard[];
  /**
   * When set, the card gets a corner ✕ calling this — the app owns
   * persistence (dismissed slugs, localStorage…). The ✕ renders iff this
   * is provided: a dismiss button without a handler is a dead control.
   */
  onDismiss?: () => void;
}

/**
 * One row of the detail footer: left-hand copy (wraps freely) with a
 * right-hand pill or tinted value. `pill` wins when both are set.
 */
export interface SideMenuDetailItem {
  slug: string;
  /** Left-hand copy — wraps onto as many lines as it needs. */
  text: React.ReactNode;
  /** Right-hand pill, rendered through the kit `Pill`. */
  pill?: {
    label: React.ReactNode;
    /** @default the menu's `color` */
    tone?: TrueColor;
    /** @default "soft" */
    variant?: PillVariant;
    /**
     * Badge shape. The flat status box reads best with the squarer badge,
     * which is why this departs from `Pill`'s own full-round default.
     * @default "md"
     */
    corner?: PillCorner;
    uppercase?: boolean;
    /** Registry icon name. */
    icon?: IconName;
  };
  /** Right-hand tinted text, used when `pill` is absent. */
  value?: {
    label: React.ReactNode;
    /** @default the menu's `color` */
    color?: TrueColor;
  };
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
   * Whether — and how — the desktop panel may collapse. Opt-in: without it
   * the panel stays expanded, shows no collapse control, ignores `collapsed`
   * and does not open on hover. `true` is the icon rail (`"icon"`);
   * `"offcanvas"` hides the panel behind a handle at the edge. The mobile
   * drawer (`responsive`) is separate and unaffected.
   * @default "none"
   */
  collapsible?: SidebarCollapsible | boolean;
  /**
   * The desktop panel stays a collapsed icon rail; hovering the rail opens the
   * full menu as an overlay. The collapse control is hidden while this is on.
   * Needs `collapsible` — a menu that may not collapse has no rail to hover.
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
   * Call-to-action cards pinned between the navigation and the footer rows.
   * Expanded-only; when the stack is taller than the (capped) zone, the
   * zone itself scrolls while the nav keeps its own scroll.
   */
  ctas?: SideMenuCta[];
  /**
   * Status rows in a tone-washed panel pinned above the collapse control —
   * rows of left copy with a pill or tinted value on the right. Expanded-
   * only, and there is no per-row dismissal: the array is the whole
   * contract.
   */
  footerDetails?: SideMenuDetailItem[];
  /**
   * Tone of the detail panel. Only the see-through variants tint with it —
   * the solid ones keep the neutral grey box, where a tone wash fought the
   * sidebar. @default the menu's `color`
   */
  footerDetailsTone?: TrueColor;
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

// The logo header below paints the shared `SIDE_MENU_HEADER_*` seam constants
// (see `common/theme/Theme.ts`) — `PageHeader` continues the same line into
// the main column, so the height and colour of the horizontal seam crossing
// the shell are spelled once and cannot drift apart.

/** Row indent per nesting depth. Capped so deeper trees do not run off-screen. */
const ROW_INDENT = ["px-3", "pl-9 pr-3", "pl-14 pr-3", "pl-20 pr-3"];

/**
 * Initials for an icon-less row in the icon rail: the first letter of the
 * label's first two words ("Simple Greeting" → "SG", "S31: Workspace…" → "SW").
 */
export const sideMenuInitials = (label: string): string =>
  label
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

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
  hasCtas: boolean;
  hasFooterDetails: boolean;
  showCollapse: boolean;
  /** Number of navigation placeholder rows. */
  lines: number;
  /** The panel's surface-aware hairline. */
  dividerClass: string;
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
  hasCtas,
  hasFooterDetails,
  showCollapse,
  lines,
  dividerClass,
}) => (
  <div
    className="flex h-full w-full animate-pulse flex-col motion-reduce:animate-none"
    aria-hidden="true"
  >
    {/* Logo header */}
    {hasLogo && (
      <div
        className={`flex items-center gap-3 border-b px-4 py-4 ${dividerClass} ${
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

    {/* Call-to-action cards */}
    {hasCtas && !collapsed && (
      <div className="shrink-0 px-3 pb-1 pt-1">
        <div className={`space-y-2 rounded-xl border p-3 ${dividerClass}`}>
          <SkeletonBar className="mx-auto h-14 w-24 rounded-lg" />
          <SkeletonBar width="55%" className="mx-auto h-3" />
          <SkeletonBar width="100%" className="h-2.5" />
          <SkeletonBar width="75%" className="h-2.5" />
          <SkeletonBar className="h-7 w-full rounded-lg" />
        </div>
      </div>
    )}

    {/* Footer item */}
    {hasFooterItem && (
      <div
        className={`flex items-center gap-3 px-3 pb-1 ${collapsed ? "justify-center" : ""}`}
      >
        <SkeletonBar className="h-5 w-5 rounded-md" />
        {!collapsed && <SkeletonBar width="8rem" className="h-3" />}
      </div>
    )}

    {/* Detail footer */}
    {hasFooterDetails && !collapsed && (
      <div className="shrink-0 px-3 pb-1">
        {/* Flat wash placeholder — the box itself has no edge. */}
        <div className="space-y-2 rounded-lg bg-black/5 p-3 dark:bg-white/5">
          <div className="flex items-center justify-between gap-2">
            <SkeletonBar width="50%" className="h-3" />
            <SkeletonBar className="h-4 w-14 rounded-md" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <SkeletonBar width="40%" className="h-3" />
            <SkeletonBar width="15%" className="h-3" />
          </div>
        </div>
      </div>
    )}

    {/* Collapse control */}
    {showCollapse && !collapsed && (
      <div className={`border-t px-3 py-3 ${dividerClass}`}>
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
  /** Menu tone: the row hovers with the same tokens as the nav rows. */
  color: TrueColor;
}

const SideMenuDropdownRow: React.FC<DropdownRowProps> = ({
  item,
  placement,
  collapsed,
  side,
  idleCopy,
  color,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const idle = SIDEBAR_IDLE_COPY[idleCopy];
  const tokens = getSideMenuItemTokens(color);
  const hasMenu = !!item.menu?.length;

  // A left sidebar's menus grow to the right (into the content), a right
  // sidebar's grow to the left — regardless of the collapsed state.
  const align = side === "left" ? "start" : "end";

  const media =
    item.media ??
    (item.icon ? (
      <CustomIcon icon={item.icon} className={`h-5 w-5 shrink-0 ${idle.icon}`} />
    ) : null);

  // Custom `media` is the caller's markup, and a collapsed rail leaves the
  // trigger only ~20px of content box — a plain `w-8` flex child without
  // `shrink-0` gets squashed to that width (the icon renders at ~24px),
  // while kit icons survive because `CustomIcon` ships `shrink-0`. The
  // wrapper keeps every caller's media square at its intended size.
  const mediaEl = media ? (
    <span className="flex shrink-0 items-center justify-center">{media}</span>
  ) : null;

  // min-w-0: a flex item will not shrink below its text without it, so the
  // ellipsis never kicks in and a long label runs past the panel.
  const labelSpan = (
    <span className="min-w-0 flex-1 truncate" title={item.label}>
      {item.label}
    </span>
  );

  const rowClasses = `relative group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
    collapsed ? "justify-center" : "gap-3"
  } ${idle.text}`;

  if (!hasMenu) {
    const hoverClasses = item.path && `${tokens.hoverBg} ${tokens.hoverText}`;

    const content = (
      <>
        {mediaEl}
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
        className={`${rowClasses} ${tokens.hoverBg} ${tokens.hoverText}`}
      >
        {mediaEl}
        {!collapsed && (
          <>
            {labelSpan}
            {item.badge && (
              <span className="ml-auto shrink-0 pl-2">{item.badge}</span>
            )}
            <CustomIcon
              icon="ChevronRight"
              className={`h-4 w-4 shrink-0 rotate-90 ${idle.icon}`}
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
// Call-to-action card
// ---------------------------------------------------------------------------

interface SideMenuCtaCardProps {
  cta: SideMenuCta;
  /** Tone the card takes when it does not carry one of its own. */
  menuTone: TrueColor;
  /** The sidebar surface is see-through: the card takes the glass look. */
  glass: boolean;
  /** Resting copy for the dismiss glyph (surface-aware). */
  idleCopy: SidebarIdleCopyKind;
  /** Accessible name for the dismiss button. */
  dismissLabel: string;
}

/**
 * A promo/upsell card: media, title, description and one action, rendered
 * as a real `Panel` — tone, hairline, padding scale and the glass
 * treatments all come from the shared card definition (third copy of a
 * card is the third set of bugs). The action is the card's only
 * interaction, so the Panel itself stays inert.
 */
const SideMenuCtaCard: React.FC<SideMenuCtaCardProps> = ({
  cta,
  menuTone,
  glass,
  idleCopy,
  dismissLabel,
}) => {
  const tone = cta.tone ?? menuTone;
  const idle = SIDEBAR_IDLE_COPY[idleCopy];
  const tokens = getSideMenuItemTokens(tone);

  let action: React.ReactNode = null;
  if (cta.action) {
    const { label, path, onClick, icon } = cta.action;
    // `path` wins over `onClick`: the link carries the same class recipe
    // the solid Button assembles (getButtonLinkClasses), so the two are
    // indistinguishable; the handler is not also invoked.
    action = path ? (
      <Link to={path} className={`${getButtonLinkClasses(tone, "sm")} w-full`}>
        {icon && <CustomIcon icon={icon} className="h-4 w-4 shrink-0" />}
        {label}
      </Link>
    ) : (
      <Button
        variant="solid"
        color={tone}
        size="sm"
        fullWidth
        leadingIcon={icon}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }

  return (
    <Panel
      className={cta.onDismiss ? "relative" : undefined}
      variant={glass ? "glass" : "outlined"}
      tone={tone}
      padding="sm"
      mediaPlacement="top"
      media={cta.media}
      title={cta.title}
      description={cta.description}
      clickable={false}
      scrollable={false}
    >
      {action && <div className="mt-3">{action}</div>}
      {cta.onDismiss && (
        <button
          type="button"
          onClick={cta.onDismiss}
          aria-label={dismissLabel}
          className={`absolute right-1.5 top-1.5 z-10 rounded-md p-1 transition-colors ${idle.icon} ${tokens.hoverBg} ${tokens.hoverText}`}
        >
          <CustomIcon icon="Close" className="h-3.5 w-3.5" />
        </button>
      )}
    </Panel>
  );
};

// ---------------------------------------------------------------------------
// Detail footer
// ---------------------------------------------------------------------------

interface SideMenuDetailPanelProps {
  items: SideMenuDetailItem[];
  /** Tone of the box's wash. */
  tone: TrueColor;
  /** Fallback tone for pills/values that do not carry one. */
  menuTone: TrueColor;
  /** The sidebar surface is see-through: the box takes the glass look. */
  glass: boolean;
  /** Resting copy for the left-hand labels (surface-aware). */
  idleCopy: SidebarIdleCopyKind;
}

/**
 * The status box pinned above the collapse control — the dock's ENGINE
 * block. A flat surface: no border, hairline, ring or shadow, and rows
 * flush against each other. The solid variants keep it neutral — a grey
 * step off the sidebar's own fill (darker grey on the light surface,
 * lighter grey on the dark one, just enough to read as a distinct
 * region); only the see-through variants tint, where the tone wash is
 * what makes the box hold together over the blur. Left copy wraps
 * freely; the right element never shrinks, so a long label cannot push a
 * pill out of the box. The see-through surface also earns `Panel`'s
 * glass treatment — a translucent box needs the blur and rim.
 * Deliberately inert: no dismissal affordance by design, the caller's
 * array is the whole contract.
 */
const SideMenuDetailPanel: React.FC<SideMenuDetailPanelProps> = ({
  items,
  tone,
  menuTone,
  glass,
  idleCopy,
}) => {
  const idle = SIDEBAR_IDLE_COPY[idleCopy];
  const rows = items.map((item) => (
    <div
      key={item.slug}
      className="flex items-start justify-between gap-2 px-3 py-2 text-sm"
    >
      <span className={`min-w-0 break-words leading-snug ${idle.text}`}>
        {item.text}
      </span>
      {item.pill ? (
        <Pill
          className="shrink-0"
          tone={item.pill.tone ?? menuTone}
          variant={item.pill.variant ?? "soft"}
          corner={item.pill.corner ?? "md"}
          size="sm"
          uppercase={item.pill.uppercase}
          icon={item.pill.icon}
        >
          {item.pill.label}
        </Pill>
      ) : item.value ? (
        <span
          className={`shrink-0 text-right text-xs font-medium ${getTrueColorTextClass(
            item.value.color ?? menuTone,
          )}`}
        >
          {item.value.label}
        </span>
      ) : null}
    </div>
  ));
  if (glass) {
    return (
      <Panel
        variant="glass"
        tone={tone}
        // The container corner scale is historical, not Tailwind's: this
        // step emits `rounded-lg` — the same 0.5rem the flat solid box
        // carries — instead of the card-default `rounded-2xl`.
        corner="rounded-sm"
        padding="none"
        clickable={false}
        scrollable={false}
      >
        {rows}
      </Panel>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800/80">
      {rows}
    </div>
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
  collapsible = "none",
  openOnHover = false,
  hoverTransitionMs = 250,
  responsive = true,
  topItem,
  footerItem,
  ctas,
  footerDetails,
  footerDetailsTone,
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
  searchPlaceholder,
}: SideMenuProps) => {
  const t = useKitT();
  const location = useLocation();
  const panelId = useId();
  const isMobile = useSidebarIsMobile(responsive);

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [hoverOpen, setHoverOpen] = useState(false);
  // Collapsing is opt-in: `true` is the icon rail, and the hover rail needs a
  // menu that may collapse in the first place.
  const collapseMode: SidebarCollapsible =
    collapsible === true ? "icon" : collapsible === false ? "none" : collapsible;
  const hoverRail = openOnHover && collapseMode !== "none";
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  // The mobile off-canvas dismisses the same way a dialog does: the
  // backdrop click is a pointer-only extra, the labelled close button and
  // Escape cover keyboard users.
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseMobile?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobile, mobileOpen, onCloseMobile]);

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
  const effectiveMode: SidebarCollapsible = hoverRail ? "icon" : collapseMode;
  const expanded = isMobile
    ? true
    : hoverRail
      ? false
      : effectiveMode === "none"
        ? true
        : !collapsedState;

  const showCollapseControl =
    !isMobile && !hoverRail && effectiveMode !== "none";
  const showOffcanvasHandle =
    !isMobile && effectiveMode === "offcanvas" && !expanded;

  const surface = getSidebarSurfaceTokens(variant, color);
  const idle = SIDEBAR_IDLE_COPY[surface.idleCopy];
  /** The menu's own tone row-tokens, for chrome that follows the tone. */
  const toneTokens = getSideMenuItemTokens(color);

  const showSkeleton = loading && loaderType === "skeleton";
  const skeletonSlots = {
    hasLogo: Boolean(logoIcon || logoText),
    hasTopItem: Boolean(topItem),
    hasSearch: search,
    hasTitle: Boolean(title),
    hasFooterItem: Boolean(footerItem),
    hasCtas: Boolean(ctas?.length),
    hasFooterDetails: Boolean(footerDetails?.length),
    showCollapse: showCollapseControl,
    lines: skeletonLines,
    dividerClass: surface.divider,
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
    if (!hoverRail || isMobile) return;
    cancelHoverClose();
    setHoverOpen(true);
  };
  const handleRailLeave = () => {
    if (!hoverRail || isMobile) return;
    scheduleHoverClose();
  };
  useEffect(() => {
    if (!hoverRail) setHoverOpen(false);
  }, [hoverRail]);

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

  // ── Paged children: how many of each link's children are revealed ────────
  const [childReveal, setChildReveal] = useState<Record<string, number>>({});

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

  // Guard + module-view gate shared by the navigation items and the CTA
  // cards: one definition, so a card guarded like a link behaves exactly
  // like that link. `hidden` wins first; the module-view filter is a hard
  // veto; the app's evaluator judges what guards remain.
  const passesGuard = useCallback(
    (item: { hidden?: boolean; guards?: SideMenuItemGuard[] }): boolean => {
      if (item.hidden) return false;
      if (!item.guards?.length) return true;

      const isViewFiltered = !!activeModuleView && activeModuleView !== "all";
      if (isViewFiltered && moduleViewOptions.length > 0) {
        for (const guard of item.guards) {
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
      }

      if (guardEvaluator) return guardEvaluator(item.guards);
      return true;
    },
    [guardEvaluator, activeModuleView, moduleViewOptions],
  );

  const visibleItems = useMemo(() => {
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
  }, [items, passesGuard, query]);

  const visibleCtas = useMemo(
    () => (ctas ? ctas.filter(passesGuard) : []),
    [ctas, passesGuard],
  );

  const hasVisibleLink = visibleItems.some(
    (item) => item.type !== "group" && item.type !== "divider",
  );

  // ── Shell classes ───────────────────────────────────────────────────────
  // The detached card's `m-2` (floating variants only) sits outside the
  // height, so the height must give up both 8px margins — otherwise sticky
  // mode runs the card past the viewport bottom and fullHeight overflows
  // its container, leaving the top gap but no bottom one.
  const detached = Boolean(surface.offset);
  const heightClass = fullHeight
    ? detached
      ? "h-[calc(100%-1rem)]"
      : "h-full"
    : detached
      ? "sticky top-16 h-[calc(100vh-64px-1rem)]"
      : "sticky top-16 h-[calc(100vh-64px)]";
  const isLeft = side === "left";
  // The hover-rail grows the panel itself — one solid div whose width
  // transitions 68px → 256px on hover (PrimeVue-style) — instead of a separate
  // overlay fading in over the rail, which read as a second, see-through layer.
  const isHoverMode = hoverRail && !isMobile;

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

  // Mobile drawer — the panel's own surface treatment, carried into the
  // offcanvas overlay instead of a hardcoded blur that ignored the variant.
  const mobileClasses = `
    fixed inset-y-0 ${panelPosition} z-[60] w-64 ${surface.fill} transition-transform duration-300 ease-in-out
    ${mobileOpen ? "translate-x-0" : isLeft ? "-translate-x-full" : "translate-x-full"}
    ${className}
  `;

  // ── Content ─────────────────────────────────────────────────────────────
  const logoSection =
    logoIcon || logoText
      ? (contentCollapsed: boolean) => (
          <div
            className={`relative z-50 flex items-center border-b px-4 py-4 ${SIDE_MENU_HEADER_HEIGHT} ${
              variant === "glass" || variant === "floating-glass"
                ? "bg-white/20 border-white/30 dark:bg-white/5 dark:border-white/10"
                : `${SIDE_MENU_HEADER_FILL} ${SIDE_MENU_HEADER_SEAM}`
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
    // Paging: a page at a time, never while searching, and never hiding the
    // active row — it is revealed even when it sits past the page.
    const pageSize = link.childrenPageSize;
    const paged = !searchActive && pageSize !== undefined && pageSize > 0;
    let revealLimit = paged ? (childReveal[link.slug] ?? pageSize) : visibleChildren.length;
    if (paged) {
      const activeIndex = visibleChildren.findIndex(
        (child) => isActivePath(child.path) || hasActiveDescendant(child),
      );
      if (activeIndex >= revealLimit) revealLimit = activeIndex + 1;
    }
    const renderedChildren = visibleChildren.slice(0, revealLimit);
    const totalChildren = paged
      ? Math.max(link.childrenTotal ?? 0, visibleChildren.length)
      : visibleChildren.length;
    const remainingChildren = totalChildren - renderedChildren.length;
    const showMore = () => {
      if (!paged || link.loadingChildren) return;
      const next = renderedChildren.length + pageSize;
      setChildReveal((prev) => ({ ...prev, [link.slug]: next }));
      // Past what is loaded but not past what exists: ask for the rest.
      if (next > visibleChildren.length && (link.childrenTotal ?? 0) > visibleChildren.length) {
        link.onLoadMoreChildren?.();
      }
    };
    const tokens = getSideMenuItemTokens(link.color || color);
    // A loading row with no icon, nested deep enough to have an indent to
    // hang its spinner in (depth 0 has only the row's own 12px padding).
    const hangingSpinner = Boolean(link.loading && !link.icon && depth > 0 && !contentCollapsed);

    // The rail has no room for nesting: every row centres its icon (or
    // initials) at depth 0, or nested tiles would sit off the rail's axis.
    const rowClasses = `group relative flex items-center rounded-lg transition-all duration-150 ${indentClass(contentCollapsed ? 0 : depth)} ${
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
            aria-busy={link.loading || undefined}
            title={contentCollapsed ? link.label : undefined}
            className={`flex min-w-0 flex-1 items-center gap-3 py-2.5 text-sm font-medium ${
              contentCollapsed ? "justify-center" : ""
            }`}
          >
            {(link.icon || link.loading || contentCollapsed) && (
              <div
                className={`flex items-center justify-center relative shrink-0 ${
                  hangingSpinner ? "-ml-7" : ""
                }`}
              >
                {link.loading ? (
                  // The spinner takes the icon's slot. Hidden from assistive
                  // tech: the link's aria-busy says it, once, instead of a
                  // live region per loading row.
                  //
                  // An icon-less nested row has no slot to take: its spinner
                  // hangs in the indent instead (16px + the row's 12px gap
                  // pulled back), so its label stays aligned with its siblings.
                  <span
                    data-sidemenu-loading
                    data-hanging={hangingSpinner || undefined}
                    aria-hidden="true"
                    className={`inline-flex items-center justify-center ${
                      hangingSpinner ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  >
                    <Spinner size={hangingSpinner ? "xs" : "sm"} color={link.color || color} />
                  </span>
                ) : !link.icon ? (
                  // Icon-less row in the rail: initials keep it visible and
                  // clickable. Decorative — the link's name is its label.
                  <span
                    data-sidemenu-initials
                    aria-hidden="true"
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-md bg-black/5 text-[10px] font-semibold leading-none dark:bg-white/10 ${
                      selfActive ? tokens.iconActive : idle.icon
                    }`}
                  >
                    {sideMenuInitials(link.label)}
                  </span>
                ) : (
                  <CustomIcon
                    icon={link.icon!}
                    className={`h-5 w-5 transition-colors duration-150 ${
                      selfActive
                        ? tokens.iconActive
                        : `${idle.icon} ${tokens.iconHover}`
                    }`}
                  />
                )}
                {/* Badge in collapsed mode: small dot over the icon */}
                {contentCollapsed && link.badge && (
                  <span className="absolute -top-1 -right-1">{link.badge}</span>
                )}
              </div>
            )}
            {!contentCollapsed && (
              <>
                {/* min-w-0 lets the label shrink so the ellipsis can kick
                    in; the title carries the full name. */}
                <span className="min-w-0 flex-1 truncate" title={link.label}>
                  {link.label}
                </span>
                {/* Meta (a time, a size): muted at the row end. */}
                {link.meta != null && link.meta !== false && (
                  <span
                    data-sidemenu-meta
                    className={`ml-auto shrink-0 pl-2 text-[11px] tabular-nums ${surface.muted}`}
                  >
                    {link.meta}
                  </span>
                )}
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
                // Badge + actions share the row end: the badge's `pl-2`
                // only separates it from the label, so the pair needs its
                // own gap — and only when both are actually there.
                link.badge ? "ml-3" : ""
              } ${
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
              aria-label={t("kit.sidemenu.toggleSubmenu", {
                verb:
                  showChildren ? t("kit.sidemenu.verbCollapse") : t("kit.sidemenu.verbExpand"),
                label: link.label,
              })}
                onClick={() => toggleSubmenu(link.slug)}
                className={`inline-flex shrink-0 items-center justify-center rounded-md p-1.5 transition-colors ${surface.muted} ${tokens.hoverBg} ${tokens.hoverText}`}
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
            aria-label={t("kit.sidemenu.submenuAria", { label: link.label })}
          >
            {renderedChildren.map((child, index) =>
              renderLinkRow(
                child,
                depth + 1,
                `${key}-child-${index}`,
                contentCollapsed,
              ),
            )}
            {paged && remainingChildren > 0 && !contentCollapsed && (
              <button
                type="button"
                onClick={showMore}
                disabled={link.loadingChildren}
                aria-busy={link.loadingChildren || undefined}
                className={`flex w-full items-center gap-2 rounded-lg py-2 text-left text-xs font-medium transition-colors disabled:cursor-wait ${indentClass(depth + 1)} ${surface.muted} ${tokens.hoverBg} ${tokens.hoverText}`}
              >
                {link.loadingChildren && (
                  <span data-sidemenu-loading aria-hidden="true" className="inline-flex">
                    <Spinner size="xs" color={link.color || color} />
                  </span>
                )}
                {link.moreChildrenLabel?.(remainingChildren) ??
                  t("kit.sidemenu.showMore", { count: remainingChildren })}
              </button>
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
            color={color}
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
            placeholder={searchPlaceholder ?? t("kit.sidemenu.searchPlaceholder")}
            aria-label={t("kit.sidemenu.searchAria")}
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
            <h2 className={`text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${surface.muted}`}>
              {title}
            </h2>
          )}
          {/* Mobile Close Button */}
          {isMobileView && (
            <button
              onClick={onCloseMobile}
              className={`p-1 rounded-lg transition-colors ml-auto ${surface.muted} ${toneTokens.hoverBg} ${toneTokens.hoverText}`}
              aria-label={t("kit.sidemenu.closeAria")}
            >
              <CustomIcon icon="Close" className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Navigation Items — ScrollArea keeps the bar identical on every
          browser (the webkit pseudo paint was Chrome-only) and the
          hover variant parks it out of sight until the list is entered.
          `horizontal={false}`: a nav list has one axis. Its rows are flex
          with a truncating label, but a `shrink-0` badge (or any nowrap
          content a caller passes) still has a minimum width the list's
          content box will honour — and sideways, that is not a scroll the
          user asked for, it is the menu escaping its own panel. */}
      <ScrollArea
        variant="hover"
        horizontal={false}
        className="flex-1 w-full"
        // Padding on the content wrapper scrolls with the rows, as the old
        // scroll box's padding did, keeping the rows' inset from the edges.
        //
        // `table-fixed w-full`: the content box is a table, which widens to
        // fit its widest row. A long nowrap label then never shrank — no
        // ellipsis — and its badge was pushed past the panel and clipped.
        // A fixed layout at full width pins the rows to the panel.
        contentClassName="w-full table-fixed px-3 py-1"
      >
        <nav aria-label={title || t("kit.sidemenu.navAria")} className="space-y-1 w-full">
          {visibleItems.map((item, index) => {
            // Divider
            if (item.type === "divider") {
              return (
                <div
                  key={`divider-${index}-${item.slug}`}
                  className={`my-2 border-t ${surface.divider} ${
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
                      className={`my-2 border-t ${surface.divider} ${
                        contentCollapsed && !isMobileView ? "mx-1" : "mx-0"
                      }`}
                    />
                  )}
                  <div
                    data-sidemenu-group={item.slug}
                    className={`group/sm-group flex items-center gap-2 px-3 py-1 mb-1 ${
                      index === 0 ? "mt-1" : "mt-4"
                    }`}
                  >
                    {item.tag && (
                      <span
                        aria-hidden="true"
                        data-sidemenu-group-tag
                        className={`h-3.5 w-0.5 shrink-0 rounded-full bg-${item.tag}-500`}
                      />
                    )}
                    <span
                      className={`min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-wider ${surface.muted}`}
                    >
                      {item.label}
                    </span>
                    {item.actions && (
                      <span
                        className={`flex shrink-0 items-center gap-0.5 ${
                          item.actionsOnHover
                            ? "opacity-0 transition-opacity duration-150 group-hover/sm-group:opacity-100 group-focus-within/sm-group:opacity-100"
                            : ""
                        }`}
                      >
                        {item.actions}
                      </span>
                    )}
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
            <p className={`px-3 py-6 text-center text-xs ${surface.muted}`}>
              {t("kit.sidemenu.noResults", { query: searchQuery.trim() })}
            </p>
          )}
        </nav>
      </ScrollArea>

      {/* Call-to-action cards — pinned between the nav and the footer rows
          (expanded only; the rail has no room for a pitch). The zone owns
          its scroll, so the nav keeps its own and the card stays visible:
          past the cap the stack scrolls, never the menu. */}
      {!contentCollapsed && visibleCtas.length > 0 && (
        <div className="shrink-0 px-3 pb-1 pt-1">
          <ScrollArea
            variant="hover"
            horizontal={false}
            className="max-h-64"
            viewportClassName="overscroll-contain"
            contentClassName="space-y-2"
          >
            {visibleCtas.map((cta) => (
              <SideMenuCtaCard
                key={cta.slug}
                cta={cta}
                menuTone={color}
                glass={surface.idleCopy === "glass"}
                idleCopy={surface.idleCopy}
                dismissLabel={t("kit.sidemenu.dismissCta")}
              />
            ))}
          </ScrollArea>
        </div>
      )}

      {/* Footer item (pinned above the collapse control) */}
      {footerItem && (
        <div className="shrink-0 px-3 pb-1">
          <SideMenuDropdownRow
            item={footerItem}
            placement="footer"
            collapsed={contentCollapsed}
            side={side}
            idleCopy={surface.idleCopy}
            color={color}
          />
        </div>
      )}

      {/* Detail footer — a tone-washed status box directly above the
          collapse control, like the dock's ENGINE block over "Collapse
          Dock". No scroll region: status copy, and the menu has already
          scrolled to reach this far. */}
      {!contentCollapsed && footerDetails && footerDetails.length > 0 && (
        <div className="shrink-0 px-3 pb-1">
          <SideMenuDetailPanel
            items={footerDetails}
            tone={footerDetailsTone ?? color}
            menuTone={color}
            glass={surface.idleCopy === "glass"}
            idleCopy={surface.idleCopy}
          />
        </div>
      )}

      {/* Collapse Toggle (desktop only, hidden with openOnHover) */}
      {!isMobileView && showCollapseControl && (
        <div className={`shrink-0 border-t px-3 py-3 ${surface.divider}`}>
          <button
            type="button"
            onClick={toggleCollapse}
            aria-expanded={expanded}
            aria-controls={panelId}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${surface.muted} ${toneTokens.hoverBg} ${toneTokens.hoverText} ${
              !expanded ? "justify-center" : ""
            }`}
            title={expanded ? t("kit.sidemenu.collapseSidebar") : t("kit.sidemenu.expandSidebar")}
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
              <span className="ml-3 whitespace-nowrap">
                {t("kit.sidemenu.collapse")}
              </span>
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
        // Pointer-only dismiss affordance; keyboard users have the labelled
        // close button and Escape (effect above).
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop click is pointer-only; Escape + close button cover keyboard
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
        // The Escape handler only clears the pointer-driven hover state;
        // every control inside is a native, keyboard-operable element.
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- hover state is pointer-only; nav content is natively keyboard-accessible
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
            // Hover-rail expansion is a pointer-only enhancement; the nav
            // content is native and fully keyboard-operable without it.
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
              aria-label={t("kit.sidemenu.openSidebar")}
              title={t("kit.sidemenu.openSidebar")}
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
