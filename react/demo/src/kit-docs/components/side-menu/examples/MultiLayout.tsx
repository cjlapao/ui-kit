import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

const PRIMARY_ITEMS: SideMenuItem[] = [
  { slug: "overview", label: "Overview", path: "/overview", icon: "Dashboard" },
  { slug: "jobs", label: "Jobs", path: "/jobs", icon: "Jobs" },
  { slug: "hosts", label: "Hosts", path: "/hosts", icon: "Host" },
  { slug: "settings", label: "Settings", path: "/settings", icon: "Settings" },
];

const SECONDARY_ITEMS: SideMenuItem[] = [
  { slug: "all", label: "All items", path: "/all", icon: "Dots" },
  { slug: "favorites", label: "Favorites", path: "/favorites", icon: "Star" },
  { slug: "recent", label: "Recent", path: "/recent", icon: "Calendar" },
];

export default function MultiLayout() {
  return (
    <div className="h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl bg-white dark:bg-slate-950">
      <SideMenuLayout
        sideMenuProps={{
          title: "Primary",
          color: "blue",
          items: PRIMARY_ITEMS,
        }}
        secondarySideMenuProps={{
          title: "Secondary",
          color: "violet",
          items: SECONDARY_ITEMS,
        }}
      >
        <div className="space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The primary menu is pinned to a hover rail: it stays collapsed and
            expands as an overlay while you hover it. The secondary menu keeps
            its own collapse control.
          </p>
          <div className="h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60" />
        </div>
      </SideMenuLayout>
    </div>
  );
}
