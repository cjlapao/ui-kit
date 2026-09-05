import React, { useState } from "react";
import {
  Button,
  CustomIcon,
  PageHeader,
  SideMenu,
} from "@cjlapao/ui-kit";
import { PlaygroundPanel, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { DEMO_ITEMS } from "../side-menu/demoData";

const startGroup = (
  <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
    Reports <span className="mx-1 text-neutral-300">/</span>
    <span className="text-neutral-900 dark:text-neutral-50">Quarterly</span>
  </span>
);

const centerGroup = (
  <span className="text-sm text-neutral-400 dark:text-neutral-500">Q3 · draft</span>
);

const endGroup = (
  <Button size="sm" leadingIcon="Download" variant="soft">
    Export
  </Button>
);

export const PageHeaderPlayground: React.FC = () => {
  const [hasStart, setHasStart] = useState(true);
  const [hasCenter, setHasCenter] = useState(false);
  const [hasEnd, setHasEnd] = useState(true);
  const [hasExtra, setHasExtra] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "regions",
                title: "Regions",
                controls: (
                  <Control label="Groups">
                    <div className="space-y-1.5">
                      <ToggleRow label="start — trail" checked={hasStart} onChange={setHasStart} />
                      <ToggleRow label="center — note" checked={hasCenter} onChange={setHasCenter} />
                      <ToggleRow label="end — controls" checked={hasEnd} onChange={setHasEnd} />
                      <ToggleRow label="extra children group" checked={hasExtra} onChange={setHasExtra} />
                    </div>
                  </Control>
                ),
              },
              {
                id: "shell",
                title: "Shell",
                controls: (
                  <Control label="Sidebar">
                    <ToggleRow label="collapse the SideMenu" checked={collapsed} onChange={setCollapsed} />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The seam line — height, colour, fill — is shared with the sidebar
            through the <code>SIDE_MENU_HEADER_*</code> constants, so
            collapsing the menu (the whole bar shifts left, nothing stretches)
            or emptying a region never breaks it. An empty region still holds
            its place, so an <em>end</em>-only header still parks right.
          </p>
        </div>
      }
      preview={
        <div className="h-80 w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex h-full">
            <SideMenu
              fullHeight
              color="blue"
              logoIcon={<CustomIcon icon="UX" className="h-6 w-6 text-blue-500" />}
              logoText={
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  ui-kit
                </span>
              }
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed((c) => !c)}
              items={DEMO_ITEMS}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <PageHeader
                aria-label="Preview header"
                start={hasStart ? startGroup : undefined}
                center={hasCenter ? centerGroup : undefined}
                end={hasEnd ? endGroup : undefined}
              >
                {hasExtra ? (
                  <Button variant="ghost" size="sm" leadingIcon="Refresh">
                    Regenerate
                  </Button>
                ) : undefined}
              </PageHeader>
              <div className="flex-1 space-y-3 p-6">
                <div className="h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};
