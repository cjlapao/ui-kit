import{j as e,r as n,M as P,S as _,a as l,b as L,C as y,c as v}from"./index-B-ieYLXc.js";import{P as U,S as g,C as M,T as c,a as F,E as t}from"./PlaygroundPanel-CkWfNJii.js";import{s as J,a as B,b as V,t as G}from"./options-C8y5quvx.js";const u=a=>e.jsx("span",{className:"rounded-full bg-blue-500 px-1.5 text-[10px] font-semibold leading-4 text-white",children:a}),f=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:u("4"),description:"running and queued jobs"},{slug:"infra",label:"Infrastructure",path:"/infra",icon:"Host",description:"hosts and containers",children:[{slug:"hosts",label:"Hosts",path:"/infra/hosts",icon:"Host"},{slug:"pods",label:"Pods",path:"/infra/pods",icon:"Container"}]},{slug:"deploy",type:"group",label:"Deploy"},{slug:"containers",label:"Containers",path:"/containers",icon:"Container",groupName:"deploy"},{slug:"images",label:"Images",path:"/images",icon:"Image",groupName:"deploy"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings",description:"preferences and API keys"}],i=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:u("4")},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],W=[{slug:"docs",label:"Documentation",path:"/docs",icon:"Library",defaultOpen:!0,children:[{slug:"start",label:"Getting Started",path:"/docs/start",icon:"Rocket"},{slug:"guides",label:"Guides",path:"/docs/guides",icon:"Log"},{slug:"api",label:"API Reference",path:"/docs/api",icon:"Script",children:[{slug:"rest",label:"REST",path:"/docs/api/rest",icon:"Globe"},{slug:"graphql",label:"GraphQL",path:"/docs/api/graphql",icon:"Key"}]}]},{slug:"changelog",label:"Changelog",path:"/changelog",icon:"Calendar"}],I=[{value:"acme",label:"ACME Corp"},{value:"globex",label:"Globex"},{value:"initech",label:"Initech"}],w=[{value:"profile",label:"Profile"},{value:"sign-out",label:"Sign out"}],Y=()=>{const[a,s]=n.useState("sidebar"),[r,C]=n.useState("icon"),[d,E]=n.useState("left"),[h,T]=n.useState("blue"),[m,A]=n.useState(!1),[p,H]=n.useState(250),[N,D]=n.useState(!1),[j,R]=n.useState(!0),[S,O]=n.useState(!1),k=e.jsx(l,{fullHeight:!0,title:"Playground",color:h,variant:a,side:d,collapsible:r,openOnHover:m,hoverTransitionMs:p,search:N,searchPlaceholder:"Search menu",topItem:j?{label:"ACME Corp",icon:"Users",menu:I}:void 0,footerItem:S?{label:"Ada Lovelace",icon:"User",menu:w}:void 0,items:f});return e.jsx(U,{controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:J,value:a,onChange:o=>s(o)}),e.jsx(g,{label:"Collapsible",options:B,value:r,onChange:o=>C(o)}),e.jsx(M,{label:"Side",children:e.jsx(P,{size:"sm",options:V,value:d,onChange:o=>E(o)})}),e.jsx(g,{label:"Tone",options:G,value:h,onChange:o=>T(o)}),e.jsx(c,{label:"Open on hover (hover rail)",checked:m,onChange:A}),m&&e.jsx(M,{label:"Hover transition",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(_,{min:0,max:600,step:25,value:p,onChange:o=>H(o),color:h,className:"min-w-0 flex-1"}),e.jsxs("span",{className:"w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400",children:[p," ms"]})]})}),e.jsx(c,{label:"Search",checked:N,onChange:D}),e.jsx(c,{label:"Top item (workspace menu)",checked:j,onChange:R}),e.jsx(c,{label:"Footer item (user menu)",checked:S,onChange:O})]}),preview:e.jsx("div",{className:"h-[26rem] w-full overflow-hidden rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[d==="left"&&k,e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]}),d==="right"&&k]})})})};function q(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"blue",title:"Demo",items:f}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const K=`import { SideMenu } from "@cjlapao/ui-kit";
import { DEMO_ITEMS } from "../demoData";

export default function Basic() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu fullHeight color="blue" title="Demo" items={DEMO_ITEMS} />
        <div className="flex-1 space-y-3 p-6">
          <div className="h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60" />
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
`,$=L;function z(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:$.map(a=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:a}),e.jsx("div",{className:"h-80 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,variant:a,title:a.charAt(0).toUpperCase()+a.slice(1),items:i}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},a))})}const Q=`import { SideMenu, SIDEBAR_VARIANTS } from "@cjlapao/ui-kit";
import { MINI_ITEMS } from "../demoData";

const VARIANTS = SIDEBAR_VARIANTS;

export default function Variants() {
  return (
    <div className="flex w-full max-w-5xl flex-wrap items-start justify-center gap-4">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex w-56 flex-col gap-2">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {variant}
          </span>
          <div className="h-80 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <div className="flex h-full">
              <SideMenu
                fullHeight
                variant={variant}
                title={variant.charAt(0).toUpperCase() + variant.slice(1)}
                items={MINI_ITEMS}
              />
              <div className="flex-1 p-4">
                <div className="h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50" />
                <div className="mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
`,x=({label:a,children:s,wide:r=!1})=>e.jsxs("div",{className:`flex flex-col gap-2 ${r?"w-80":"w-56"}`,children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:a}),e.jsx("div",{className:"h-80 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[s,e.jsx("div",{className:"flex-1 p-4",children:e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"})})]})})]}),X=()=>{const[a,s]=n.useState(!0);return e.jsx(l,{fullHeight:!0,color:"blue",collapsed:a,onToggleCollapse:()=>s(r=>!r),items:i})},Z=()=>{const[a,s]=n.useState(!0);return e.jsx(l,{fullHeight:!0,color:"emerald",collapsible:"offcanvas",collapsed:a,onToggleCollapse:()=>s(r=>!r),items:i})};function ee(){return e.jsxs("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[e.jsx(x,{label:"Icon rail — collapsed, toggle at the bottom",children:e.jsx(X,{})}),e.jsx(x,{label:"Offcanvas — collapsed, click the handle at the edge",children:e.jsx(Z,{})}),e.jsx(x,{label:"Hover — openOnHover, the rail expands on hover",wide:!0,children:e.jsx(l,{fullHeight:!0,color:"violet",openOnHover:!0,items:i})})]})}const ae=`import React, { useState, type ReactNode } from "react";
import { SideMenu } from "@cjlapao/ui-kit";
import { MINI_ITEMS } from "../demoData";

const Panel: React.FC<{
  label: string;
  children: ReactNode;
  wide?: boolean;
}> = ({ label, children, wide = false }) => (
  <div className={\`flex flex-col gap-2 \${wide ? "w-80" : "w-56"}\`}>
    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
      {label}
    </span>
    <div className="h-80 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        {children}
        <div className="flex-1 p-4">
          <div className="h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50" />
        </div>
      </div>
    </div>
  </div>
);

const RailDemo: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <SideMenu
      fullHeight
      color="blue"
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed((value) => !value)}
      items={MINI_ITEMS}
    />
  );
};

const OffcanvasDemo: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <SideMenu
      fullHeight
      color="emerald"
      collapsible="offcanvas"
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed((value) => !value)}
      items={MINI_ITEMS}
    />
  );
};

export default function Collapse() {
  return (
    <div className="flex w-full max-w-4xl flex-wrap items-start justify-center gap-4">
      <Panel label="Icon rail — collapsed, toggle at the bottom">
        <RailDemo />
      </Panel>
      <Panel label="Offcanvas — collapsed, click the handle at the edge">
        <OffcanvasDemo />
      </Panel>
      <Panel label="Hover — openOnHover, the rail expands on hover" wide>
        <SideMenu fullHeight color="violet" openOnHover items={MINI_ITEMS} />
      </Panel>
    </div>
  );
}
`;function ne(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"emerald",title:"Nested",items:W}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const te=`import { SideMenu } from "@cjlapao/ui-kit";
import { NESTED_ITEMS } from "../demoData";

export default function Nested() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="emerald"
          title="Nested"
          items={NESTED_ITEMS}
        />
        <div className="flex-1 space-y-3 p-6">
          <div className="h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60" />
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
`;function le(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"amber",title:"Search",search:!0,searchPlaceholder:"Search menu",items:f}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Try “hosts”, “jobs” or “keys” — the search also matches each item’s description, and opens nested branches that contain a match."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const se=`import { SideMenu } from "@cjlapao/ui-kit";
import { DEMO_ITEMS } from "../demoData";

export default function Search() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="amber"
          title="Search"
          search
          searchPlaceholder="Search menu"
          items={DEMO_ITEMS}
        />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Try “hosts”, “jobs” or “keys” — the search also matches each
            item’s description, and opens nested branches that contain a
            match.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
`;function oe(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"indigo",title:"Menus",topItem:{label:"ACME Corp",icon:"Users",menu:I},footerItem:{label:"Ada Lovelace",icon:"User",menu:w},items:i}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The top row opens a workspace switcher; the footer row is pinned above the collapse control with the user menu."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const re=`import { SideMenu } from "@cjlapao/ui-kit";
import { MINI_ITEMS, USER_MENU, WORKSPACE_MENU } from "../demoData";

export default function TopFooter() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="indigo"
          title="Menus"
          topItem={{ label: "ACME Corp", icon: "Users", menu: WORKSPACE_MENU }}
          footerItem={{ label: "Ada Lovelace", icon: "User", menu: USER_MENU }}
          items={MINI_ITEMS}
        />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The top row opens a workspace switcher; the footer row is pinned
            above the collapse control with the user menu.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
`,b=({icon:a,label:s})=>e.jsx("button",{type:"button","aria-label":s,className:"inline-flex items-center justify-center rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-700/40 dark:hover:text-neutral-200",children:e.jsx(y,{icon:a,className:"h-3.5 w-3.5"})}),ie=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:u("4"),actions:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(b,{icon:"Edit",label:"Edit Jobs"}),e.jsx(b,{icon:"Trash",label:"Delete Jobs"})]})},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host",actionsOnHover:!0,actions:e.jsx(b,{icon:"Dots",label:"Host options"})},{slug:"images",label:"Images",path:"/images",icon:"Image"}];function de(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"rose",title:"Actions",items:ie}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Jobs keeps its actions always visible; Hosts only reveals its on hover. Actions are hidden in the icon rail."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const ce=`import React from "react";
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
`,ue=[{slug:"proj",label:"Projects",path:"/projects",icon:"Container"},{slug:"docs",label:"Docs",path:"/docs",icon:"Library"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],he=[{slug:"all",label:"All",path:"/all",icon:"Dots"},{slug:"active",label:"Active",path:"/active",icon:"Run"},{slug:"failed",label:"Failed",path:"/failed",icon:"Error"}];function me(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl bg-white dark:bg-slate-950",children:e.jsx(v,{sideMenuProps:{title:"Workspace",color:"blue",items:ue},rightSideMenuProps:{title:"Filters",color:"emerald",items:he},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"})]})})})}const pe=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

const LEFT_ITEMS: SideMenuItem[] = [
  { slug: "proj", label: "Projects", path: "/projects", icon: "Container" },
  { slug: "docs", label: "Docs", path: "/docs", icon: "Library" },
  { slug: "settings", label: "Settings", path: "/settings", icon: "Settings" },
];

const RIGHT_ITEMS: SideMenuItem[] = [
  { slug: "all", label: "All", path: "/all", icon: "Dots" },
  { slug: "active", label: "Active", path: "/active", icon: "Run" },
  { slug: "failed", label: "Failed", path: "/failed", icon: "Error" },
];

export default function DualLayout() {
  return (
    <div className="h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl bg-white dark:bg-slate-950">
      <SideMenuLayout
        sideMenuProps={{
          title: "Workspace",
          color: "blue",
          items: LEFT_ITEMS,
        }}
        rightSideMenuProps={{
          title: "Filters",
          color: "emerald",
          items: RIGHT_ITEMS,
        }}
      >
        <div className="space-y-3 p-6">
          <div className="h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60" />
          <div className="h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40" />
          <div className="h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40" />
        </div>
      </SideMenuLayout>
    </div>
  );
}
`,ge=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs"},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],xe=[{slug:"all",label:"All items",path:"/all",icon:"Dots"},{slug:"favorites",label:"Favorites",path:"/favorites",icon:"Star"},{slug:"recent",label:"Recent",path:"/recent",icon:"Calendar"}];function be(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl bg-white dark:bg-slate-950",children:e.jsx(v,{sideMenuProps:{title:"Primary",color:"blue",items:ge},secondarySideMenuProps:{title:"Secondary",color:"violet",items:xe},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The primary menu is pinned to a hover rail: it stays collapsed and expands as an overlay while you hover it. The secondary menu keeps its own collapse control."}),e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"})]})})})}const ve=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
`,fe=[{slug:"alice",label:"Alice",path:"/chat/alice",icon:"User",badge:u("2")},{slug:"bob",label:"Bob",path:"/chat/bob",icon:"User"},{slug:"design",label:"Design Team",path:"/chat/design",icon:"Users"}];function we(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl bg-white dark:bg-slate-950",children:e.jsx(v,{sideMenuProps:{title:"Chats",color:"violet",search:!0,searchPlaceholder:"Search chats",items:fe,footerItem:{label:"Ada Lovelace",icon:"User",menu:w}},header:e.jsxs("header",{className:"flex h-12 items-center gap-3 border-b border-neutral-200 px-5 dark:border-neutral-800",children:[e.jsx(y,{icon:"Chat",className:"h-4 w-4 text-violet-500"}),e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"Alice"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"online"})]}),children:e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"flex flex-1 flex-col gap-3 overflow-y-auto p-5",children:[e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"Hey — have you seen the new glass variants?"}),e.jsx("div",{className:"max-w-[70%] self-end rounded-2xl bg-violet-500 px-3 py-2 text-sm text-white",children:"Just shipped them. Try the Side Menu page."}),e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"The hover rail is a nice touch."})]}),e.jsx("div",{className:"border-t border-neutral-200 p-3 dark:border-neutral-800",children:e.jsx("input",{type:"text",placeholder:"Write a message…",className:"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400/60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"})})]})})})}const Ne=`import {
  CustomIcon,
  SideMenuLayout,
  type SideMenuItem,
} from "@cjlapao/ui-kit";
import { demoBadge, USER_MENU } from "../demoData";

const CONVERSATIONS: SideMenuItem[] = [
  {
    slug: "alice",
    label: "Alice",
    path: "/chat/alice",
    icon: "User",
    badge: demoBadge("2"),
  },
  { slug: "bob", label: "Bob", path: "/chat/bob", icon: "User" },
  { slug: "design", label: "Design Team", path: "/chat/design", icon: "Users" },
];

export default function Chat() {
  return (
    <div className="h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl bg-white dark:bg-slate-950">
      <SideMenuLayout
        sideMenuProps={{
          title: "Chats",
          color: "violet",
          search: true,
          searchPlaceholder: "Search chats",
          items: CONVERSATIONS,
          footerItem: { label: "Ada Lovelace", icon: "User", menu: USER_MENU },
        }}
        header={
          <header className="flex h-12 items-center gap-3 border-b border-neutral-200 px-5 dark:border-neutral-800">
            <CustomIcon icon="Chat" className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Alice
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              online
            </span>
          </header>
        }
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
            <div className="max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
              Hey — have you seen the new glass variants?
            </div>
            <div className="max-w-[70%] self-end rounded-2xl bg-violet-500 px-3 py-2 text-sm text-white">
              Just shipped them. Try the Side Menu page.
            </div>
            <div className="max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
              The hover rail is a nice touch.
            </div>
          </div>
          <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
            <input
              type="text"
              placeholder="Write a message…"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400/60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      </SideMenuLayout>
    </div>
  );
}
`,Me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(F,{name:"Side Menu",description:"App navigation with four surface treatments (sidebar, inset, floating, glass), icon-rail and offcanvas collapse, hover-to-expand rails, nested items, item search and top/footer dropdown menus. SideMenuLayout composes it into dual and multi-sidebar app shells, and both stay responsive — below 1024px the panel becomes an offcanvas drawer."}),e.jsx(Y,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(t,{title:"Basic",description:"The standing look: a translucent blur pushed into the layout, groups, badges and active-state matching that also lights up a parent while any descendant is active.",code:K,filename:"Basic.tsx",children:e.jsx(q,{})}),e.jsx(t,{title:"Surface variants",description:"sidebar is the standing look; inset is a flat panel with a hairline, floating a detached rounded card, and glass the kit's liquid-glass language tinted with the menu's tone. Rows inside take the matching treatment automatically.",code:Q,filename:"Variants.tsx",children:e.jsx(z,{})}),e.jsx(t,{title:"Collapse modes",description:"icon shrinks to an icon rail, offcanvas removes the panel entirely (a handle at the edge opens it again) and openOnHover keeps a rail that expands as an overlay on hover — with no collapse control at all.",code:ae,filename:"Collapse.tsx",children:e.jsx(ee,{})}),e.jsx(t,{title:"Nested items",description:"Children render as an indented sub-tree with its own chevron toggle. A parent that contains the active route carries the active tone, and defaultOpen pre-opens a branch.",code:te,filename:"Nested.tsx",children:e.jsx(ne,{})}),e.jsx(t,{title:"Search",description:"A toggleable search below the top item matches each label and description, hides non-matching branches and auto-expands the parents of nested matches.",code:se,filename:"Search.tsx",children:e.jsx(le,{})}),e.jsx(t,{title:"Top and footer menus",description:"A full row above the navigation (workspace switcher) and one pinned above the collapse control (user menu), each with its own dropdown.",code:re,filename:"TopFooter.tsx",children:e.jsx(oe,{})}),e.jsx(t,{title:"Row actions and badges",description:"Actions render at the end of a row — always, or only on hover via actionsOnHover — and badges ride along next to the label or as a dot in the icon rail.",code:ce,filename:"Actions.tsx",children:e.jsx(de,{})}),e.jsx(t,{title:"Dual sidebars (layout)",description:"SideMenuLayout with a rightSideMenuProps renders a second menu on the opposite edge; each menu keeps its own collapse and mobile-drawer state.",code:pe,filename:"DualLayout.tsx",children:e.jsx(me,{})}),e.jsx(t,{title:"Multi sidebars (layout)",description:"With a secondarySideMenuProps the primary is pinned to the hover rail — always collapsed, expanding on hover — so the pair reads as one multi-sidebar rail.",code:ve,filename:"MultiLayout.tsx",children:e.jsx(be,{})}),e.jsx(t,{title:"Chat layout",description:"The building blocks composed into a chat shell: conversation list with search, a user menu in the footer and the message pane in the layout body.",code:Ne,filename:"Chat.tsx",children:e.jsx(we,{})})]})]});export{Me as SideMenuPage,Me as default};
