import { useState } from "react";
import { Menu, Popover, SideMenu, SideMenuIconButton } from "@cjlapao/ui-kit";
import { MINI_ITEMS } from "../demoData";

export default function FooterTriggers() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="flex h-96 w-full max-w-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <SideMenu
        fullHeight
        responsive={false}
        collapsible
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(value => !value)}
        items={MINI_ITEMS}
        footer={({ side }) => <>
          {/* Menu/Popover clone the trigger and attach handlers, ARIA and a ref.
              SideMenuIconButton forwards these to its single native button.
              Tone, surface copy and collapsed state come from SideMenu. */}
          <Popover placement={side === "left" ? "right" : "left"}
            trigger={<SideMenuIconButton icon="Notification" label="Notifications" badge={<span className="h-2 w-2 rounded-full bg-blue-500" />} />}>
            <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
              <strong>Notifications</strong>
              <p>You’re all caught up.</p>
            </div>
          </Popover>
          <Menu placement={side === "left" ? "right" : "left"}
            trigger={<SideMenuIconButton icon="User" label="Account" />}
            items={[
              { id: "profile", label: "Profile", icon: "User" },
              { id: "settings", label: "Settings", icon: "Settings" },
            ]} />
        </>}
      />
      <p className="flex-1 p-6 text-sm text-neutral-600 dark:text-neutral-400">
        Open notifications or the account menu from the footer. Expand the rail
        to reveal their labels. The entire rounded tile is the trigger.
      </p>
    </div>
  );
}
