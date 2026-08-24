import React, { useState } from "react";
import {
  MultiToggle,
  SideMenu,
  Slider,
  type SidebarCollapsible,
  type SidebarSide,
  type SidebarVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  sidebarCollapsibleOptions,
  sidebarSideOptions,
  sidebarVariantOptions,
  trueColorOptions,
} from "../../shared/options";
import { DEMO_ITEMS, USER_MENU, WORKSPACE_MENU } from "./demoData";

export const SideMenuPlayground: React.FC = () => {
  const [variant, setVariant] = useState<SidebarVariant>("sidebar");
  const [collapsible, setCollapsible] = useState<SidebarCollapsible>("icon");
  const [side, setSide] = useState<SidebarSide>("left");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [openOnHover, setOpenOnHover] = useState(false);
  const [hoverTransitionMs, setHoverTransitionMs] = useState(250);
  const [search, setSearch] = useState(false);
  const [topItem, setTopItem] = useState(true);
  const [footerItem, setFooterItem] = useState(false);

  const menu = (
    <SideMenu
      fullHeight
      title="Playground"
      color={tone}
      variant={variant}
      side={side}
      collapsible={collapsible}
      openOnHover={openOnHover}
      hoverTransitionMs={hoverTransitionMs}
      search={search}
      searchPlaceholder="Search menu"
      topItem={
        topItem ? { label: "ACME Corp", icon: "Users", menu: WORKSPACE_MENU } : undefined
      }
      footerItem={
        footerItem ? { label: "Ada Lovelace", icon: "User", menu: USER_MENU } : undefined
      }
      items={DEMO_ITEMS}
    />
  );

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Variant"
            options={sidebarVariantOptions}
            value={variant}
            onChange={(value) => setVariant(value as SidebarVariant)}
          />
          <SelectControl
            label="Collapsible"
            options={sidebarCollapsibleOptions}
            value={collapsible}
            onChange={(value) => setCollapsible(value as SidebarCollapsible)}
          />
          <Control label="Side">
            <MultiToggle
              size="sm"
              options={sidebarSideOptions}
              value={side}
              onChange={(value) => setSide(value as SidebarSide)}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(value) => setTone(value as TrueColor)}
          />
          <ToggleRow
            label="Open on hover (hover rail)"
            checked={openOnHover}
            onChange={setOpenOnHover}
          />
          {openOnHover && (
            <Control label="Hover transition">
              <div className="flex items-center gap-3">
                <Slider
                  min={0}
                  max={600}
                  step={25}
                  value={hoverTransitionMs}
                  onChange={(value) => setHoverTransitionMs(value as number)}
                  color={tone}
                  className="min-w-0 flex-1"
                />
                <span className="w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                  {hoverTransitionMs} ms
                </span>
              </div>
            </Control>
          )}
          <ToggleRow label="Search" checked={search} onChange={setSearch} />
          <ToggleRow
            label="Top item (workspace menu)"
            checked={topItem}
            onChange={setTopItem}
          />
          <ToggleRow
            label="Footer item (user menu)"
            checked={footerItem}
            onChange={setFooterItem}
          />
        </>
      }
      preview={
        <div className="h-[26rem] w-full overflow-hidden rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
          <div className="flex h-full">
            {side === "left" && menu}
            <div className="flex-1 space-y-3 p-6">
              <div className="h-20 rounded-lg bg-white/60 dark:bg-neutral-800/60" />
              <div className="h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
              <div className="h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
            </div>
            {side === "right" && menu}
          </div>
        </div>
      }
    />
  );
};
