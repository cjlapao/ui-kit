import React, { createContext, forwardRef, useContext } from "react";
import CustomIcon from "./CustomIcon";
import Spinner from "./Spinner";
import type { CustomIconProps } from "./CustomIcon";
import { SIDEBAR_IDLE_COPY, getSideMenuItemTokens, type SidebarIdleCopyKind, type SidebarSide, type TrueColor } from "../theme";

export interface SideMenuFooterContext {
  collapsed: boolean;
  side: SidebarSide;
}

export const SideMenuButtonContext = createContext({
  collapsed: true,
  color: "blue" as TrueColor,
  idleCopy: "solid" as SidebarIdleCopyKind,
});

/** Shared with collapsed navigation links so their complete tiles match. */
export function sideMenuTileClasses(active: boolean, color: TrueColor, idleCopy: SidebarIdleCopyKind, collapsed = true) {
  const tokens = getSideMenuItemTokens(color);
  const idle = SIDEBAR_IDLE_COPY[idleCopy];
  return `group relative flex w-full min-w-0 items-center ${collapsed ? "justify-center" : "justify-start"} gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
    active ? `${tokens.bg} ${tokens.text} shadow-sm` : `${idle.text} ${tokens.hoverBg} ${tokens.hoverText}`
  }`;
}

export interface SideMenuIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name; also visible when the surrounding SideMenu is expanded. */
  label: string;
  icon?: CustomIconProps["icon"];
  /** Custom avatar or icon. Prefer non-interactive content. */
  children?: React.ReactNode;
  active?: boolean;
  loading?: boolean;
  badge?: React.ReactNode;
  color?: TrueColor;
  collapsed?: boolean;
}

/** A native button suitable for Menu/Popover trigger cloning and ref anchoring. */
export const SideMenuIconButton = forwardRef<HTMLButtonElement, SideMenuIconButtonProps>(
  ({ label, icon, children, active = false, loading = false, badge, color, collapsed, disabled, className = "", ...props }, ref) => {
    const context = useContext(SideMenuButtonContext);
    const tone = color ?? context.color;
    const compact = collapsed ?? context.collapsed;
    const tokens = getSideMenuItemTokens(tone);
    const idle = SIDEBAR_IDLE_COPY[context.idleCopy];
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={compact ? label : undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...props}
        className={`${sideMenuTileClasses(active, tone, context.idleCopy, compact)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current disabled:pointer-events-none disabled:opacity-50 ${className}`}
      >
        <span className={`relative inline-flex h-5 w-5 shrink-0 items-center justify-center ${active ? tokens.iconActive : `${idle.icon} ${tokens.iconHover}`}`}>
          {loading ? <Spinner size="sm" color={tone} /> : children ?? (icon ? <CustomIcon icon={icon} className="h-5 w-5" /> : <span aria-hidden="true" className="text-[10px] font-semibold">{label.slice(0, 2).toUpperCase()}</span>)}
          {compact && badge != null && <span className="absolute -right-1 -top-1">{badge}</span>}
        </span>
        {!compact && <><span className="min-w-0 flex-1 truncate text-left">{label}</span>{badge}</>}
      </button>
    );
  },
);
SideMenuIconButton.displayName = "SideMenuIconButton";
