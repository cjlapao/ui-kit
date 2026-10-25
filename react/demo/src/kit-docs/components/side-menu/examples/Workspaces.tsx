import { useState } from "react";
import { SideMenu, type SideMenuItem } from "@cjlapao/ui-kit";
import { GroupAction, sessionsFor } from "../demoData";

/**
 * A workspace navigator built from the kit's own props:
 * - the Workspaces group carries `actions` (search, filter, add) and a `tag`;
 * - a running session swaps its icon for a spinner with `loading`;
 * - each workspace shows its sessions a page at a time (`childrenPageSize`),
 *   and fetches more from the "server" when the loaded ones run out
 *   (`childrenTotal` + `onLoadMoreChildren` + `loadingChildren`).
 */
const TOTAL = 18;
const PAGE = 3;

export default function Workspaces() {
  const [sessions, setSessions] = useState(() => sessionsFor("ui-kit", PAGE));
  const [fetching, setFetching] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const loadMore = () => {
    setFetching(true);
    // Stand-in for an API call: the next page arrives after a moment.
    setTimeout(() => {
      setSessions((prev) => [...prev, ...sessionsFor("ui-kit", Math.min(PAGE, TOTAL - prev.length), prev.length)]);
      setFetching(false);
    }, 800);
  };

  const items: SideMenuItem[] = [
    { slug: "plugins", label: "Plugins", path: "/plugins", icon: "Library" },
    { slug: "automation", label: "Automation tasks", path: "/automation", icon: "Jobs" },
    {
      slug: "workspaces",
      type: "group",
      label: "Workspaces",
      tag: "violet",
      actionsOnHover: true,
      actions: (
        <>
          <GroupAction icon="Search" label="Search workspaces" />
          <GroupAction icon="Settings" label="Filter workspaces" />
          <GroupAction icon="Add" label="New workspace" />
        </>
      ),
    },
    {
      slug: "new-agents",
      label: "new_agents",
      path: "/ws/new_agents",
      icon: "Folder",
      groupName: "workspaces",
      defaultOpen: true,
      children: [
        { slug: "s31-run", label: "S31: Workspace Implementation", path: "/ws/new_agents/1", loading: true, meta: "38min" },
        { slug: "s31", label: "S31: Workspace Implementation", path: "/ws/new_agents/2", meta: "4h" },
        { slug: "greeting", label: "Simple Greeting", path: "/ws/new_agents/3", meta: "7d" },
      ],
    },
    { slug: "coffee", label: "ikea-coffee-code-generator", path: "/ws/coffee", icon: "Folder", groupName: "workspaces" },
    {
      slug: "ui-kit",
      label: "ui-kit",
      path: "/ws/ui-kit",
      icon: "Folder",
      groupName: "workspaces",
      defaultOpen: true,
      children: sessions,
      childrenPageSize: PAGE,
      childrenTotal: TOTAL,
      onLoadMoreChildren: loadMore,
      loadingChildren: fetching,
      moreChildrenLabel: (n) => `Show ${n} more sessions`,
    },
  ];

  return (
    <div className="h-[34rem] w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          variant="sidebar"
          color="violet"
          title="Claude"
          items={items}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <div className="flex-1 p-6 text-sm text-neutral-500 dark:text-neutral-400">
          Hover the Workspaces header for its actions. ui-kit loads {PAGE} sessions at a time from a
          fake server — {sessions.length} of {TOTAL} fetched so far.
        </div>
      </div>
    </div>
  );
}
