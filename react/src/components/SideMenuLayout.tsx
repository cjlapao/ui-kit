import React, { useState } from "react";
import classNames from "classnames";
import SideMenu, {
  useSidebarIsMobile,
  type SideMenuProps,
} from "./SideMenu";
import CustomIcon from "./CustomIcon";
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
   * set, the primary is pinned to the hover rail (always collapsed, expands on
   * hover) so the pair reads as one multi-sidebar rail.
   */
  secondarySideMenuProps?: SideMenuProps;
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
  header,
  children,
  className,
  headerClassName,
  bodyClassName,
  sideItemActions,
  sidePanelActions,
}: SideMenuLayoutProps) => {
  const isMobile = useSidebarIsMobile(sideMenuProps.responsive ?? true);
  const isMulti = !!secondarySideMenuProps;

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
    // collapse wiring is not passed through.
    ...(isMulti
      ? { openOnHover: true }
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
  };

  return (
    <SideMenuActionsProvider
      initialSideItemActions={sideItemActions}
      initialSidePanelActions={sidePanelActions}
    >
      <div
        className={classNames(
          "flex h-full w-full overflow-hidden bg-gray-50",
          className,
        )}
      >
        {/* Side Menu (primary) */}
        <SideMenu {...primaryProps} />

        {/* Secondary menu (multi sidebars) */}
        {secondarySideMenuProps && <SideMenu {...secondaryProps} />}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0 h-full">
          {/* Mobile menu toggle — same breakpoint as the menu's offcanvas mode */}
          {isMobile && (
            <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-white">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="Open menu"
              >
                <CustomIcon icon="ViewRows" className="w-5 h-5" />
              </button>
              {rightSideMenuProps && (
                <button
                  onClick={() => setRightMobileOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
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
