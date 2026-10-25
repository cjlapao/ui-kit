import React from "react";
import { CustomIcon } from "@cjlapao/ui-kit";
import type {
  IconName,
  SideMenuCta,
  SideMenuDetailItem,
  SideMenuItem,
  TrueColor,
} from "@cjlapao/ui-kit";

export const demoBadge = (value: string) => (
  <span className="rounded-full bg-blue-500 px-1.5 text-[10px] font-semibold leading-4 text-white">
    {value}
  </span>
);

/** The playground's sample navigation — groups, nesting, badges and search copy. */
export const DEMO_ITEMS: SideMenuItem[] = [
  { slug: "overview", label: "Overview", path: "/overview", icon: "Dashboard" },
  {
    slug: "jobs",
    label: "Jobs",
    path: "/jobs",
    icon: "Jobs",
    badge: demoBadge("4"),
    description: "running and queued jobs",
  },
  {
    slug: "infra",
    label: "Infrastructure",
    path: "/infra",
    icon: "Host",
    description: "hosts and containers",
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
  {
    slug: "images",
    label: "Images",
    path: "/images",
    icon: "Image",
    groupName: "deploy",
  },
  {
    slug: "settings",
    label: "Settings",
    path: "/settings",
    icon: "Settings",
    description: "preferences and API keys",
  },
];

/** A short list for side-by-side mini panels. */
export const MINI_ITEMS: SideMenuItem[] = [
  { slug: "overview", label: "Overview", path: "/overview", icon: "Dashboard" },
  { slug: "jobs", label: "Jobs", path: "/jobs", icon: "Jobs", badge: demoBadge("4") },
  { slug: "hosts", label: "Hosts", path: "/hosts", icon: "Host" },
  { slug: "settings", label: "Settings", path: "/settings", icon: "Settings" },
];

/** A three-level hierarchy for the nested-items example. */
export const NESTED_ITEMS: SideMenuItem[] = [
  {
    slug: "docs",
    label: "Documentation",
    path: "/",
    icon: "Library",
    defaultOpen: true,
    children: [
      { slug: "start", label: "Getting Started", path: "/start", icon: "Rocket" },
      { slug: "guides", label: "Guides", path: "/guides", icon: "Log" },
      {
        slug: "api",
        label: "API Reference",
        path: "/api",
        icon: "Script",
        children: [
          { slug: "rest", label: "REST", path: "/api/rest", icon: "Globe" },
          { slug: "graphql", label: "GraphQL", path: "/api/graphql", icon: "Key" },
        ],
      },
    ],
  },
  { slug: "changelog", label: "Changelog", path: "/changelog", icon: "Calendar" },
];

export const WORKSPACE_MENU = [
  { value: "acme", label: "ACME Corp" },
  { value: "globex", label: "Globex" },
  { value: "initech", label: "Initech" },
];

export const USER_MENU = [
  { value: "profile", label: "Profile" },
  { value: "sign-out", label: "Sign out" },
];

/**
 * The playground's CTA cards. Three stacked on purpose: the zone caps at
 * `max-h-64`, so the stack overflows and the zone's own scroll is
 * demonstrable. The capacity card declares `onDismiss` (a placeholder here —
 * the playground replaces it with real dismiss state, like an app owning
 * localStorage) and a `path` action, which renders the router-link flavour of
 * the button recipe; the other two exercise the callback flavour.
 */
export const DEMO_CTAS: SideMenuCta[] = [
  {
    slug: "cta-fresh-content",
    title: "Fresh content",
    description:
      "HTML, CSS, JS and Design portfolio courses will be released soon!",
    media: (
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-sm">
        <CustomIcon icon="Rocket" className="h-7 w-7" />
      </div>
    ),
    action: { label: "Join Waitlist", onClick: () => undefined },
  },
  {
    slug: "cta-ai-era",
    title: "Skyrocket company growth",
    description: "The AI era is here — let the assistant carry the busywork.",
    media: (
      <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-fuchsia-300 via-purple-300 to-cyan-200 shadow-inner dark:from-fuchsia-600 dark:via-purple-600 dark:to-cyan-700" />
    ),
    action: { label: "Try for Free", onClick: () => undefined },
    tone: "violet",
  },
  {
    slug: "cta-capacity",
    title: "Used capacity",
    description: "You are already using 60% of your capacity.",
    media: (
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background:
            "conic-gradient(#6366f1 0 60%, rgba(99,102,241,0.15) 60% 100%)",
        }}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xs font-semibold text-indigo-700 dark:bg-neutral-900 dark:text-indigo-300">
          60%
        </span>
      </div>
    ),
    // `path` wins over `onClick` — this card proves the Link branch. It
    // points at this very docs page so the demo never navigates away.
    action: { label: "Upgrade plan", path: "/side-menu" },
    tone: "indigo",
    onDismiss: () => undefined,
  },
];

/**
 * The playground's detail footer — dock-status rows in kit vocabulary: the
 * right side is a soft uppercase Pill or tinted value text.
 */
export const DEMO_DETAILS: SideMenuDetailItem[] = [
  {
    slug: "engine",
    text: "ENGINE V2.4",
    pill: { label: "SYNCED", tone: "green", uppercase: true },
  },
  {
    slug: "daemon",
    text: "daemon:8088",
    value: { label: "0.4 ms", color: "blue" },
  },
];

// ── Workspaces section (group actions, tag, loading rows, paged children) ────

/** A quiet icon button for group headers — the search / filter / add row. */
export const GroupAction: React.FC<{ icon: IconName; label: string }> = ({ icon, label }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className="inline-flex items-center justify-center rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-700/40 dark:hover:text-neutral-200"
  >
    <CustomIcon icon={icon} className="h-3.5 w-3.5" />
  </button>
);

const AGES = ["38min", "4h", "7d", "2d", "2d", "2d", "2d", "7d", "9d", "12d", "2w", "3w"];

export const sessionsFor = (workspace: string, count: number, from = 0) =>
  Array.from({ length: count }, (_, i) => ({
    slug: `${workspace}-s${from + i + 1}`,
    label: `${workspace} session ${from + i + 1}`,
    path: `/ws/${workspace}/${from + i + 1}`,
    // Trailing "38min" / "4h" / "7d": `meta`, not a badge — it hides in the rail.
    meta: AGES[(from + i) % AGES.length],
  }));

export interface WorkspaceSectionOptions {
  actions?: boolean;
  actionsOnHover?: boolean;
  tag?: TrueColor;
  /** First session of the open workspace is running. */
  loadingSession?: boolean;
  /** Children per page; undefined shows them all. */
  pageSize?: number;
}

/** The screenshot's Workspaces section, built from the kit's own props. */
export const buildWorkspaceSection = (o: WorkspaceSectionOptions = {}): SideMenuItem[] => {
  const agents = sessionsFor("new_agents", 10);
  if (o.loadingSession) agents[0] = { ...agents[0], loading: true } as (typeof agents)[number];
  return [
    {
      slug: "workspaces",
      type: "group",
      label: "Workspaces",
      tag: o.tag,
      actionsOnHover: o.actionsOnHover,
      actions: o.actions ? (
        <>
          <GroupAction icon="Search" label="Search workspaces" />
          <GroupAction icon="Settings" label="Filter workspaces" />
          <GroupAction icon="Add" label="New workspace" />
        </>
      ) : undefined,
    },
    {
      slug: "new-agents",
      label: "new_agents",
      path: "/ws/new_agents",
      icon: "Folder",
      groupName: "workspaces",
      defaultOpen: true,
      children: agents,
      childrenPageSize: o.pageSize,
      moreChildrenLabel: (n: number) => `Show ${n} more sessions`,
    },
    {
      slug: "ui-kit",
      label: "ui-kit",
      path: "/ws/ui-kit",
      icon: "Folder",
      groupName: "workspaces",
      children: sessionsFor("ui-kit", 20),
      childrenPageSize: o.pageSize,
      moreChildrenLabel: (n: number) => `Show ${n} more sessions`,
    },
  ];
};
