import React, { useState } from "react";
import { Button, CustomIcon, PageHeader, SideMenu } from "@cjlapao/ui-kit";
import type { PageHeaderVariant, TrueColor } from "@cjlapao/ui-kit";
import {
  PlaygroundPanel,
  Control,
  ChoiceControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { DEMO_ITEMS } from "../side-menu/demoData";

const startGroup = (
  <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
    Reports <span className="mx-1 text-neutral-300">/</span>
    <span className="text-neutral-900 dark:text-neutral-50">Quarterly</span>
  </span>
);

const centerGroup = (
  <span className="text-sm text-neutral-400 dark:text-neutral-500">
    Q3 · draft
  </span>
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
  const [variant, setVariant] = useState<PageHeaderVariant>("default");
  const [tone, setTone] = useState<TrueColor>("blue");

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
                      <ToggleRow
                        label="start — trail"
                        checked={hasStart}
                        onChange={setHasStart}
                      />
                      <ToggleRow
                        label="center — note"
                        checked={hasCenter}
                        onChange={setHasCenter}
                      />
                      <ToggleRow
                        label="end — controls"
                        checked={hasEnd}
                        onChange={setHasEnd}
                      />
                      <ToggleRow
                        label="extra children group"
                        checked={hasExtra}
                        onChange={setHasExtra}
                      />
                    </div>
                  </Control>
                ),
              },
              {
                id: "surface",
                title: "Surface",
                controls: (
                  <>
                    <ChoiceControl
                      label="variant"
                      value={variant}
                      onChange={(v) => setVariant(v as PageHeaderVariant)}
                      options={[
                        { value: "default", label: "default" },
                        { value: "floating", label: "floating" },
                        { value: "floating-glass", label: "floating-glass" },
                      ]}
                    />
                    <ChoiceControl
                      label="accent — frosted tint"
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                      options={[
                        { value: "blue", label: "blue" },
                        { value: "emerald", label: "emerald" },
                        { value: "violet", label: "violet" },
                        { value: "amber", label: "amber" },
                      ]}
                    />
                  </>
                ),
              },
              {
                id: "shell",
                title: "Shell",
                controls: (
                  <Control label="Sidebar">
                    <ToggleRow
                      label="collapse the SideMenu"
                      checked={collapsed}
                      onChange={setCollapsed}
                    />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            In <em>default</em> the seam line — height, colour, fill — is
            shared with the sidebar through the <code>SIDE_MENU_HEADER_*</code>{" "}
            constants, so collapsing the menu (the whole bar shifts left,
            nothing stretches) or emptying a region never breaks it. An empty
            region still holds its place, so an <em>end</em>-only header still
            parks right. The <em>floating</em> pairings borrow the menu&apos;s
            card geometry from the shared sidebar tokens — both cards inset by
            the same margin, and the frosted tint follows <em>accent</em>.
          </p>
        </div>
      }
      preview={
        <div className="h-80 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex h-full">
            <SideMenu
              fullHeight
              variant={variant === "default" ? "sidebar" : variant}
              color={tone}
              logoIcon={
                <CustomIcon icon="UX" className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
              }
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
                variant={variant}
                accentColor={tone}
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
