import React, { useState } from "react";
import {
  MultiToggle,
  Select,
  SideMenu,
  Toggle,
  type SidebarCollapsible,
  type SidebarSide,
  type SidebarVariant,
  type SideMenuItem,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import { trueColorOptions } from "../constants";

const variantOptions: { label: string; value: SidebarVariant }[] = [
  { label: "Sidebar", value: "sidebar" },
  { label: "Inset", value: "inset" },
  { label: "Floating", value: "floating" },
  { label: "Glass", value: "glass" },
];

const collapsibleOptions: { label: string; value: SidebarCollapsible }[] = [
  { label: "Icon", value: "icon" },
  { label: "Offcanvas", value: "offcanvas" },
  { label: "None", value: "none" },
];

const sideOptions: { label: string; value: SidebarSide }[] = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

const ITEMS: SideMenuItem[] = [
  { slug: "overview", label: "Overview", path: "/overview", icon: "Dashboard" },
  {
    slug: "jobs",
    label: "Jobs",
    path: "/jobs",
    icon: "Jobs",
    badge: (
      <span className="rounded-full bg-blue-500 px-1.5 text-[10px] font-semibold leading-4 text-white">
        4
      </span>
    ),
    description: "running and queued jobs",
  },
  {
    slug: "infra",
    label: "Infrastructure",
    path: "/infra",
    icon: "Host",
    children: [
      { slug: "hosts", label: "Hosts", path: "/infra/hosts", icon: "Host" },
      { slug: "pods", label: "Pods", path: "/infra/pods", icon: "Container" },
    ],
  },
  { slug: "deploy", type: "group", label: "Deploy" },
  {
    slug: "containers",
    label: "Containers",
    path: "/containers",
    icon: "Container",
    groupName: "deploy",
  },
  { slug: "settings", label: "Settings", path: "/settings", icon: "Settings" },
];

const WORKSPACE_MENU = [
  { value: "acme", label: "ACME Corp" },
  { value: "globex", label: "Globex" },
];

const USER_MENU = [
  { value: "profile", label: "Profile" },
  { value: "sign-out", label: "Sign out" },
];

const Filler: React.FC = () => (
  <div className="flex-1 space-y-3 p-6">
    <div className="h-24 rounded-xl bg-white/50 dark:bg-neutral-800/50" />
    <div className="h-16 rounded-xl bg-white/40 dark:bg-neutral-800/40" />
    <div className="h-16 rounded-xl bg-white/40 dark:bg-neutral-800/40" />
  </div>
);

export const SideMenuDemo: React.FC = () => {
  const [variant, setVariant] = useState<SidebarVariant>("sidebar");
  const [collapsible, setCollapsible] = useState<SidebarCollapsible>("icon");
  const [side, setSide] = useState<SidebarSide>("left");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [openOnHover, setOpenOnHover] = useState(false);
  const [search, setSearch] = useState(false);
  const [topItem, setTopItem] = useState(true);
  const [footerItem, setFooterItem] = useState(false);

  const menu = (
    <SideMenu
      fullHeight
      title="Side Menu"
      color={tone}
      variant={variant}
      side={side}
      collapsible={collapsible}
      openOnHover={openOnHover}
      search={search}
      searchPlaceholder="Search menu"
      topItem={
        topItem ? { label: "ACME Corp", icon: "Users", menu: WORKSPACE_MENU } : undefined
      }
      footerItem={
        footerItem ? { label: "Ada Lovelace", icon: "User", menu: USER_MENU } : undefined
      }
      items={ITEMS}
    />
  );

  return (
    <PlaygroundSection
      title="Side Menu"
      label="Layout"
      description="Four surface treatments, icon-rail and offcanvas collapse, a hover rail, nested items, search and top/footer menus. Toggle the background image to see the glass variant over content."
      controls={
        <>
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Variant
            </span>
            <Select
              size="sm"
              value={variant}
              onChange={(event) => setVariant(event.target.value as SidebarVariant)}
            >
              {variantOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Collapsible
            </span>
            <Select
              size="sm"
              value={collapsible}
              onChange={(event) =>
                setCollapsible(event.target.value as SidebarCollapsible)
              }
            >
              {collapsibleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Side
            </span>
            <MultiToggle
              size="sm"
              options={sideOptions}
              value={side}
              onChange={(value) => setSide(value as SidebarSide)}
            />
          </div>
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tone
            </span>
            <Select
              size="sm"
              value={tone}
              onChange={(event) => setTone(event.target.value as TrueColor)}
            >
              {trueColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Toggle
              size="sm"
              alignLabel="left"
              color="blue"
              label="Open on hover"
              checked={openOnHover}
              onChange={(event) => setOpenOnHover(event.target.checked)}
            />
            <Toggle
              size="sm"
              alignLabel="left"
              color="blue"
              label="Search"
              checked={search}
              onChange={(event) => setSearch(event.target.checked)}
            />
            <Toggle
              size="sm"
              alignLabel="left"
              color="blue"
              label="Top item (workspace)"
              checked={topItem}
              onChange={(event) => setTopItem(event.target.checked)}
            />
            <Toggle
              size="sm"
              alignLabel="left"
              color="blue"
              label="Footer item (user)"
              checked={footerItem}
              onChange={(event) => setFooterItem(event.target.checked)}
            />
          </div>
        </>
      }
      preview={
        <div className="flex h-[28rem] overflow-hidden rounded-xl">
          {side === "left" && menu}
          <Filler />
          {side === "right" && menu}
        </div>
      }
    />
  );
};
