import React from "react";
import {
  CustomIcon,
  SideMenu,
  type IconName,
  type SideMenuItem,
} from "@cjlapao/ui-kit";
import { demoBadge } from "../demoData";

const ActionButton: React.FC<{ icon: IconName; label: string }> = ({
  icon,
  label,
}) => (
  <button
    type="button"
    aria-label={label}
    className="inline-flex items-center justify-center rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-700/40 dark:hover:text-neutral-200"
  >
    <CustomIcon icon={icon} className="h-3.5 w-3.5" />
  </button>
);

const ITEMS: SideMenuItem[] = [
  { slug: "overview", label: "Overview", path: "/overview", icon: "Dashboard" },
  {
    slug: "jobs",
    label: "Jobs",
    path: "/jobs",
    icon: "Jobs",
    badge: demoBadge("4"),
    actions: (
      <span className="flex items-center gap-1">
        <ActionButton icon="Edit" label="Edit Jobs" />
        <ActionButton icon="Trash" label="Delete Jobs" />
      </span>
    ),
  },
  {
    slug: "hosts",
    label: "Hosts",
    path: "/hosts",
    icon: "Host",
    actionsOnHover: true,
    actions: <ActionButton icon="Dots" label="Host options" />,
  },
  { slug: "images", label: "Images", path: "/images", icon: "Image" },
];

export default function Actions() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu fullHeight color="rose" title="Actions" items={ITEMS} />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Jobs keeps its actions always visible; Hosts only reveals its on
            hover. Actions are hidden in the icon rail.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
