import React, { useState } from "react";
import classNames from "classnames";
import SideMenu, {
  useSidebarIsMobile,
  type SideMenuProps,
} from "./SideMenu";
import CustomIcon from "./CustomIcon";
import { useKitT } from "../i18n";
import { getSidebarSurfaceTokens } from "../theme/Theme";
import { SideMenuActionsProvider } from "../contexts/SideMenuActionsContext";

export interface SideMenuLayoutProps {
  /** Props passed to the SideMenu component (including color). */
  sideMenuProps: SideMenuProps;
  /**
   * A second SideMenu on the right edge (dual sidebars). Its collapse and
   * mobile-drawer state are managed by the layout.
   */
  rightSideMenuProps?: SideMenuProps;
  /**
   * Multi sidebars: an extra menu rendered next to the primary. While this is
   * set, the primary defaults to a hover rail. Use multiMenuMode="joined"
   * for a permanent icon rail next to a permanently expanded panel.
   */
  secondarySideMenuProps?: SideMenuProps;
  /** Multi-menu presentation. Joined pins the primary to an icon rail and
   * the secondary expanded, combining both in one responsive shell.
   * @default "hover" */
  multiMenuMode?: "hover" | "joined";
  /** Content rendered in the fixed header bar at the top of the main area */
  header?: React.ReactNode;
  /** Main scrollable body content */
  children?: React.ReactNode;
  /** Additional class name for the root container */
  className?: string;
  /** Additional class name for the header section */
  headerClassName?: string;
  /** Additional class name for the scrollable body */
  bodyClassName?: string;
  /**
   * Per-item actions from the list/sidebar (e.g. edit/delete buttons for the active item).
   * Consumed by the header via `useSideMenuActions`.
   */
  sideItemActions?: React.ReactNode;
  /**
   * Actions from the detail/side panel (e.g. PageHeader action buttons).
   * Consumed by the header via `useSideMenuActions`.
   */
  sidePanelActions?: React.ReactNode;
}

export const SideMenuLayout = ({
  sideMenuProps,
  rightSideMenuProps,
  secondarySideMenuProps,
  multiMenuMode = "hover",
  header,
  children,
  className,
  headerClassName,
  bodyClassName,
  sideItemActions,
  sidePanelActions,
}: SideMenuLayoutProps) => {
  const t = useKitT();
  const isMobile = useSidebarIsMobile(sideMenuProps.responsive ?? true);
  const isMulti = !!secondarySideMenuProps;
  const isJoined = isMulti && multiMenuMode === "joined";

  const [collapsed, setCollapsed] = useState(sideMenuProps.collapsed ?? false);
  const [rightCollapsed, setRightCollapsed] = useState(
    rightSideMenuProps?.collapsed ?? false,
  );
  const [secondaryCollapsed, setSecondaryCollapsed] = useState(
    secondarySideMenuProps?.collapsed ?? false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rightMobileOpen, setRightMobileOpen] = useState(false);

  const handleToggleCollapse = () => {
    if (sideMenuProps.onToggleCollapse) {
      sideMenuProps.onToggleCollapse();
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const isCollapsed = sideMenuProps.onToggleCollapse
    ? (sideMenuProps.collapsed ?? false)
    : collapsed;

  const handleCloseMobile = () => {
    if (sideMenuProps.onCloseMobile) {
      sideMenuProps.onCloseMobile();
    } else {
      setMobileOpen(false);
    }
  };

  const isMobileOpen = sideMenuProps.onCloseMobile
    ? (sideMenuProps.mobileOpen ?? false)
    : mobileOpen;

  // Right menu — its own collapse / drawer state, mirrored from the primary.
  const handleRightToggleCollapse = () => {
    if (rightSideMenuProps?.onToggleCollapse) {
      rightSideMenuProps.onToggleCollapse();
    } else {
      setRightCollapsed((prev) => !prev);
    }
  };

  const isRightCollapsed = rightSideMenuProps?.onToggleCollapse
    ? (rightSideMenuProps.collapsed ?? false)
    : rightCollapsed;

  const handleRightCloseMobile = () => {
    if (rightSideMenuProps?.onCloseMobile) {
      rightSideMenuProps.onCloseMobile();
    } else {
      setRightMobileOpen(false);
    }
  };

  const isRightMobileOpen = rightSideMenuProps?.onCloseMobile
    ? (rightSideMenuProps.mobileOpen ?? false)
    : rightMobileOpen;

  // Secondary (multi) menu — plain managed collapse.
  const handleSecondaryToggleCollapse = () => {
    if (secondarySideMenuProps?.onToggleCollapse) {
      secondarySideMenuProps.onToggleCollapse();
    } else {
      setSecondaryCollapsed((prev) => !prev);
    }
  };

  const isSecondaryCollapsed = secondarySideMenuProps?.onToggleCollapse
    ? (secondarySideMenuProps.collapsed ?? false)
    : secondaryCollapsed;

  const primaryProps: SideMenuProps = {
    ...sideMenuProps,
    side: "left",
    mobileOpen: isMobileOpen,
    onCloseMobile: handleCloseMobile,
    fullHeight: true,
    // Multi mode pins the primary to the hover rail: always collapsed,
    // expanding as an overlay on hover. `openOnHover` owns that state, so the
    // collapse wiring is not passed through — and since collapsing is opt-in
    // on SideMenu, the layout opts the rail in itself.
    ...(isJoined
      ? { joinedRole: "rail" as const, responsive: false, mobileOpen: false }
      : isMulti
        ? { collapsible: "icon" as const, openOnHover: true }
        : {
            collapsed: isCollapsed,
            onToggleCollapse: handleToggleCollapse,
          }),
  };

  const rightProps: SideMenuProps = {
    ...rightSideMenuProps!,
    side: "right",
    collapsed: isRightCollapsed,
    onToggleCollapse: handleRightToggleCollapse,
    mobileOpen: isRightMobileOpen,
    onCloseMobile: handleRightCloseMobile,
    fullHeight: true,
  };

  const secondaryProps: SideMenuProps = {
    ...secondarySideMenuProps!,
    side: "left",
    collapsed: isSecondaryCollapsed,
    onToggleCollapse: handleSecondaryToggleCollapse,
    fullHeight: true,
    ...(isJoined ? {
      joinedRole: "panel" as const,
      responsive: false,
      mobileOpen: isMobileOpen,
      onCloseMobile: handleCloseMobile,
      // Surface family comes from the primary; content/accent remain independent.
      variant: sideMenuProps.variant,
    } : {}),
  };

  const joinedSurface = isJoined && (
    <div
      aria-hidden="true"
      data-joined-surface
      className={classNames(
        "pointer-events-none absolute inset-y-2 left-[68px] right-0 rounded-l-2xl",
        getSidebarSurfaceTokens(sideMenuProps.variant ?? "sidebar", sideMenuProps.color ?? "blue").fill,
      )}
    />
  );

  return (
    <SideMenuActionsProvider
      initialSideItemActions={sideItemActions}
      initialSidePanelActions={sidePanelActions}
    >
      <div
        className={classNames(
          "relative flex h-full w-full overflow-hidden",
          isJoined ? "bg-neutral-100 dark:bg-neutral-950" : "bg-neutral-50 dark:bg-neutral-950",
          className,
        )}
      >
        {isJoined && !isMobile && joinedSurface}
        {isJoined ? (
          <>
            {isMobile && isMobileOpen && (
              // Pointer backdrop; the close button and Escape provide keyboard dismissal.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={handleCloseMobile} />
            )}
            {/* One drawer on mobile keeps both navigation levels reachable. */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- Escape dismissal for native controls inside */}
            <div
              data-joined-menu
              inert={(isMobile && !isMobileOpen) || undefined}
              onKeyDown={(event) => {
                if (isMobile && event.key === "Escape") handleCloseMobile();
              }}
              className={classNames(
                "flex w-[324px] max-w-[calc(100vw-1rem)] shrink-0",
                isMobile
                  ? "fixed inset-y-0 left-0 z-[60] flex-col bg-neutral-100 transition-transform duration-300 dark:bg-neutral-950"
                  : "h-full",
                isMobile && !isMobileOpen && "-translate-x-full",
              )}
            >
              {isMobile && (
                <div className="flex shrink-0 justify-end px-3 pt-2">
                  <button type="button" onClick={handleCloseMobile} aria-label={t("kit.sidemenu.closeAria")}
                    className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800">
                    <CustomIcon icon="Close" className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="relative flex h-full min-h-0 min-w-0 flex-1">
                {isMobile && joinedSurface}
                <SideMenu {...primaryProps} />
                <SideMenu {...secondaryProps} />
              </div>
            </div>
          </>
        ) : (
          <>
            <SideMenu {...primaryProps} />
            {secondarySideMenuProps && <SideMenu {...secondaryProps} />}
          </>
        )}

        {/* Main Content Area */}
        <div className={classNames(
          "relative flex min-w-0 flex-1 flex-col",
          isJoined && !isMobile ? "my-2 h-[calc(100%-1rem)]" : "h-full",
        )}>
          {/* Mobile menu toggle — same breakpoint as the menu's offcanvas mode */}
          {isMobile && (
            <div className="flex items-center gap-1 border-b border-neutral-200 bg-white px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                aria-label="Open menu"
              >
                <CustomIcon icon="ViewRows" className="w-5 h-5" />
              </button>
              {rightSideMenuProps && (
                <button
                  onClick={() => setRightMobileOpen(true)}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                  aria-label="Open right menu"
                >
                  <CustomIcon icon="ViewRows" className="w-5 h-5 rotate-180" />
                </button>
              )}
            </div>
          )}

          {/* Header */}
          {header && (
            <div className={classNames("flex-shrink-0", headerClassName)}>
              {header}
            </div>
          )}

          {/* Scrollable Body */}
          <main className={classNames("flex-1 overflow-y-auto", bodyClassName)}>
            {children}
          </main>
        </div>

        {/* Side Menu (right) */}
        {rightSideMenuProps && <SideMenu {...rightProps} />}
      </div>
    </SideMenuActionsProvider>
  );
};

export default SideMenuLayout;
