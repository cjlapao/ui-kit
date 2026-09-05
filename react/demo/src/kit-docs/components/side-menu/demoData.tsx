import type { SideMenuItem } from "@cjlapao/ui-kit";

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
