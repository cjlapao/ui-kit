import{j as e,r as t,M as J,S as V,a as s,b as G,C as T,c as v}from"./index-Bw7SVFgV.js";import{P as W}from"./PageHeader-CQm-NnZo.js";import{E as l}from"./ExampleCard-BR4461qP.js";import{P as Y,S as u,C,T as d}from"./PlaygroundPanel-efOYSasM.js";import{C as q}from"./ControlAccordion-BDKCdIsF.js";import{s as K,a as $,b as z,t as Q,c as X}from"./options-CREM8uYu.js";const h=a=>e.jsx("span",{className:"rounded-full bg-blue-500 px-1.5 text-[10px] font-semibold leading-4 text-white",children:a}),N=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:h("4"),description:"running and queued jobs"},{slug:"infra",label:"Infrastructure",path:"/infra",icon:"Host",description:"hosts and containers",children:[{slug:"hosts",label:"Hosts",path:"/infra/hosts",icon:"Host"},{slug:"pods",label:"Pods",path:"/infra/pods",icon:"Container"}]},{slug:"deploy",type:"group",label:"Deploy"},{slug:"containers",label:"Containers",path:"/containers",icon:"Container",groupName:"deploy"},{slug:"images",label:"Images",path:"/images",icon:"Image",groupName:"deploy"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings",description:"preferences and API keys"}],r=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:h("4")},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],Z=[{slug:"docs",label:"Documentation",path:"/docs",icon:"Library",defaultOpen:!0,children:[{slug:"start",label:"Getting Started",path:"/docs/start",icon:"Rocket"},{slug:"guides",label:"Guides",path:"/docs/guides",icon:"Log"},{slug:"api",label:"API Reference",path:"/docs/api",icon:"Script",children:[{slug:"rest",label:"REST",path:"/docs/api/rest",icon:"Globe"},{slug:"graphql",label:"GraphQL",path:"/docs/api/graphql",icon:"Key"}]}]},{slug:"changelog",label:"Changelog",path:"/changelog",icon:"Calendar"}],E=[{value:"acme",label:"ACME Corp"},{value:"globex",label:"Globex"},{value:"initech",label:"Initech"}],w=[{value:"profile",label:"Profile"},{value:"sign-out",label:"Sign out"}],ee=()=>{const[a,n]=t.useState("sidebar"),[i,A]=t.useState("icon"),[c,D]=t.useState("left"),[m,H]=t.useState("blue"),[g,R]=t.useState(!1),[p,O]=t.useState(250),[j,P]=t.useState(!1),[k,L]=t.useState(!0),[S,_]=t.useState(!1),[y,U]=t.useState(!1),[x,F]=t.useState(!1),[M,B]=t.useState("skeleton"),I=e.jsx(s,{fullHeight:!0,title:"Playground",color:m,variant:a,side:c,collapsible:i,openOnHover:g,hoverTransitionMs:p,noise:y,loading:x,loaderType:M,search:j,searchPlaceholder:"Search menu",topItem:k?{label:"ACME Corp",icon:"Users",menu:E}:void 0,footerItem:S?{label:"Ada Lovelace",icon:"User",menu:w}:void 0,items:N});return e.jsx(Y,{controls:e.jsx(q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Variant",options:K,value:a,onChange:o=>n(o)}),e.jsx(u,{label:"Collapsible",options:$,value:i,onChange:o=>A(o)}),e.jsx(C,{label:"Side",children:e.jsx(J,{size:"sm",options:z,value:c,onChange:o=>D(o)})}),e.jsx(u,{label:"Tone",options:Q,value:m,onChange:o=>H(o)})]})},{id:"behavior",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Open on hover (hover rail)",checked:g,onChange:R}),g&&e.jsx(C,{label:"Hover transition",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(V,{min:0,max:600,step:25,value:p,onChange:o=>O(o),color:m,className:"min-w-0 flex-1"}),e.jsxs("span",{className:"w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400",children:[p," ms"]})]})})]})},{id:"features",title:"Features",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Search",checked:j,onChange:P}),e.jsx(d,{label:"Dither noise",checked:y,onChange:U})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Loading",checked:x,onChange:F}),x&&e.jsx(u,{label:"Loader type",options:X,value:M,onChange:o=>B(o)})]})},{id:"menu-items",title:"Menu items",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Top item (workspace menu)",checked:k,onChange:L}),e.jsx(d,{label:"Footer item (user menu)",checked:S,onChange:_})]})}]}),preview:e.jsx("div",{className:"h-[26rem] w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[c==="left"&&I,e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]}),c==="right"&&I]})})})};function ae(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(s,{fullHeight:!0,color:"blue",title:"Demo",items:N}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const ne=`import { SideMenu } from "@cjlapao/ui-kit";
import { DEMO_ITEMS } from "../demoData";

export default function Basic() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
`,te=G;function le(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:te.map(a=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:a}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(s,{fullHeight:!0,variant:a,title:a.charAt(0).toUpperCase()+a.slice(1),items:r}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},a))})}const se=`import { SideMenu, SIDEBAR_VARIANTS } from "@cjlapao/ui-kit";
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
          <div className="h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
`;function oe(){return e.jsx("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[!1,!0].map(a=>e.jsxs("div",{className:"flex w-64 flex-col gap-2",children:[e.jsxs("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:["noise=",String(a)]}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(s,{fullHeight:!0,variant:"sidebar",title:"Noise",noise:a,items:r}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},String(a)))})}const ie=`import { SideMenu } from "@cjlapao/ui-kit";
import { MINI_ITEMS } from "../demoData";

export default function Noise() {
  return (
    <div className="flex w-full max-w-4xl flex-wrap items-start justify-center gap-4">
      {([false, true] as const).map((noise) => (
        <div key={String(noise)} className="flex w-64 flex-col gap-2">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            noise={String(noise)}
          </span>
          <div className="h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <div className="flex h-full">
              <SideMenu
                fullHeight
                variant="sidebar"
                title="Noise"
                noise={noise}
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
`,re=[{label:"skeleton",type:"skeleton"},{label:"spinner",type:"spinner"},{label:"progress",type:"progress"}];function de(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:re.map(({label:a,type:n})=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:a}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(s,{fullHeight:!0,title:"Loading",loading:!0,loaderType:n,loaderMessage:n==="progress"?"Fetching menu…":void 0,loaderProgress:n==="progress"?60:void 0,items:r}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},n))})}const ce=`import { SideMenu } from "@cjlapao/ui-kit";
import { MINI_ITEMS } from "../demoData";

const LOADERS = [
  { label: "skeleton", type: "skeleton" as const },
  { label: "spinner", type: "spinner" as const },
  { label: "progress", type: "progress" as const },
];

export default function Loading() {
  return (
    <div className="flex w-full max-w-5xl flex-wrap items-start justify-center gap-4">
      {LOADERS.map(({ label, type }) => (
        <div key={type} className="flex w-56 flex-col gap-2">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {label}
          </span>
          <div className="h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <div className="flex h-full">
              <SideMenu
                fullHeight
                title="Loading"
                loading
                loaderType={type}
                loaderMessage={type === "progress" ? "Fetching menu…" : undefined}
                loaderProgress={type === "progress" ? 60 : undefined}
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
`,f=({label:a,children:n,wide:i=!1})=>e.jsxs("div",{className:`flex flex-col gap-2 ${i?"w-80":"w-56"}`,children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:a}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[n,e.jsx("div",{className:"flex-1 p-4",children:e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"})})]})})]}),ue=()=>{const[a,n]=t.useState(!0);return e.jsx(s,{fullHeight:!0,color:"blue",collapsed:a,onToggleCollapse:()=>n(i=>!i),items:r})},he=()=>{const[a,n]=t.useState(!0);return e.jsx(s,{fullHeight:!0,color:"emerald",collapsible:"offcanvas",collapsed:a,onToggleCollapse:()=>n(i=>!i),items:r})};function me(){return e.jsxs("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[e.jsx(f,{label:"Icon rail — collapsed, toggle at the bottom",children:e.jsx(ue,{})}),e.jsx(f,{label:"Offcanvas — collapsed, click the handle at the edge",children:e.jsx(he,{})}),e.jsx(f,{label:"Hover — openOnHover, the rail expands on hover",wide:!0,children:e.jsx(s,{fullHeight:!0,color:"violet",openOnHover:!0,items:r})})]})}const ge=`import React, { useState, type ReactNode } from "react";
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
    <div className="h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
`;function pe(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(s,{fullHeight:!0,color:"emerald",title:"Nested",items:Z}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const xe=`import { SideMenu } from "@cjlapao/ui-kit";
import { NESTED_ITEMS } from "../demoData";

export default function Nested() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
`;function fe(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(s,{fullHeight:!0,color:"amber",title:"Search",search:!0,searchPlaceholder:"Search menu",items:N}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Try “hosts”, “jobs” or “keys” — the search also matches each item’s description, and opens nested branches that contain a match."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const be=`import { SideMenu } from "@cjlapao/ui-kit";
import { DEMO_ITEMS } from "../demoData";

export default function Search() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
`;function ve(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(s,{fullHeight:!0,color:"indigo",title:"Menus",topItem:{label:"ACME Corp",icon:"Users",menu:E},footerItem:{label:"Ada Lovelace",icon:"User",menu:w},items:r}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The top row opens a workspace switcher; the footer row is pinned above the collapse control with the user menu."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Ne=`import { SideMenu } from "@cjlapao/ui-kit";
import { MINI_ITEMS, USER_MENU, WORKSPACE_MENU } from "../demoData";

export default function TopFooter() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
`,b=({icon:a,label:n})=>e.jsx("button",{type:"button","aria-label":n,className:"inline-flex items-center justify-center rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-700/40 dark:hover:text-neutral-200",children:e.jsx(T,{icon:a,className:"h-3.5 w-3.5"})}),we=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:h("4"),actions:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(b,{icon:"Edit",label:"Edit Jobs"}),e.jsx(b,{icon:"Trash",label:"Delete Jobs"})]})},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host",actionsOnHover:!0,actions:e.jsx(b,{icon:"Dots",label:"Host options"})},{slug:"images",label:"Images",path:"/images",icon:"Image"}];function je(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(s,{fullHeight:!0,color:"rose",title:"Actions",items:we}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Jobs keeps its actions always visible; Hosts only reveals its on hover. Actions are hidden in the icon rail."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const ke=`import React from "react";
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
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
`,Se=[{slug:"proj",label:"Projects",path:"/projects",icon:"Container"},{slug:"docs",label:"Docs",path:"/docs",icon:"Library"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],ye=[{slug:"all",label:"All",path:"/all",icon:"Dots"},{slug:"active",label:"Active",path:"/active",icon:"Run"},{slug:"failed",label:"Failed",path:"/failed",icon:"Error"}];function Me(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(v,{sideMenuProps:{title:"Workspace",color:"blue",items:Se},rightSideMenuProps:{title:"Filters",color:"emerald",items:ye},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"})]})})})}const Ie=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
    <div className="h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950">
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
`,Ce=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs"},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],Te=[{slug:"all",label:"All items",path:"/all",icon:"Dots"},{slug:"favorites",label:"Favorites",path:"/favorites",icon:"Star"},{slug:"recent",label:"Recent",path:"/recent",icon:"Calendar"}];function Ee(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(v,{sideMenuProps:{title:"Primary",color:"blue",items:Ce},secondarySideMenuProps:{title:"Secondary",color:"violet",items:Te},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The primary menu is pinned to a hover rail: it stays collapsed and expands as an overlay while you hover it. The secondary menu keeps its own collapse control."}),e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"})]})})})}const Ae=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
    <div className="h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950">
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
`,De=[{slug:"alice",label:"Alice",path:"/chat/alice",icon:"User",badge:h("2")},{slug:"bob",label:"Bob",path:"/chat/bob",icon:"User"},{slug:"design",label:"Design Team",path:"/chat/design",icon:"Users"}];function He(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(v,{sideMenuProps:{title:"Chats",color:"violet",search:!0,searchPlaceholder:"Search chats",items:De,footerItem:{label:"Ada Lovelace",icon:"User",menu:w}},header:e.jsxs("header",{className:"flex h-12 items-center gap-3 border-b border-neutral-200 px-5 dark:border-neutral-800",children:[e.jsx(T,{icon:"Chat",className:"h-4 w-4 text-violet-500"}),e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"Alice"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"online"})]}),children:e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"flex flex-1 flex-col gap-3 overflow-y-auto p-5",children:[e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"Hey — have you seen the new glass variants?"}),e.jsx("div",{className:"max-w-[70%] self-end rounded-2xl bg-violet-500 px-3 py-2 text-sm text-white",children:"Just shipped them. Try the Side Menu page."}),e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"The hover rail is a nice touch."})]}),e.jsx("div",{className:"border-t border-neutral-200 p-3 dark:border-neutral-800",children:e.jsx("input",{type:"text",placeholder:"Write a message…",className:"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400/60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"})})]})})})}const Re=`import {
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
    <div className="h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950">
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
`,Be=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(W,{name:"Side Menu",description:"App navigation with five surface treatments (sidebar, inset, floating, floating-glass, glass), icon-rail and offcanvas collapse, hover-to-expand rails, nested items, item search and top/footer dropdown menus. SideMenuLayout composes it into dual and multi-sidebar app shells, and both stay responsive — below 1024px the panel becomes an offcanvas drawer."}),e.jsx(ee,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Basic",description:"The standing look: a translucent blur pushed into the layout, groups, badges and active-state matching that also lights up a parent while any descendant is active.",code:ne,filename:"Basic.tsx",children:e.jsx(ae,{})}),e.jsx(l,{title:"Surface variants",description:"sidebar is the standing look; inset is a flat panel with a hairline, floating a detached rounded card, floating-glass that card in the kit's liquid-glass language, and glass the liquid-glass look flush in the layout — both glass treatments tinted with the menu's tone. Rows inside take the matching treatment automatically.",code:se,filename:"Variants.tsx",children:e.jsx(le,{})}),e.jsx(l,{title:"Dither noise",description:"An opt-in film-grain texture over the panel background (off by default). It blends with the surface and reads most clearly on dark fills — the right panel has noise enabled.",code:ie,filename:"Noise.tsx",children:e.jsx(oe,{})}),e.jsx(l,{title:"Loading states",description:"The same loader set as Panel: skeleton (the default) replaces the rows with a pulsing placeholder shaped like the menu's own chrome, while spinner and progress overlay the shared loader on top of the content.",code:ce,filename:"Loading.tsx",children:e.jsx(de,{})}),e.jsx(l,{title:"Collapse modes",description:"icon shrinks to an icon rail, offcanvas removes the panel entirely (a handle at the edge opens it again) and openOnHover keeps a rail that expands as an overlay on hover — with no collapse control at all.",code:ge,filename:"Collapse.tsx",children:e.jsx(me,{})}),e.jsx(l,{title:"Nested items",description:"Children render as an indented sub-tree with its own chevron toggle. A parent that contains the active route carries the active tone, and defaultOpen pre-opens a branch.",code:xe,filename:"Nested.tsx",children:e.jsx(pe,{})}),e.jsx(l,{title:"Search",description:"A toggleable search below the top item matches each label and description, hides non-matching branches and auto-expands the parents of nested matches.",code:be,filename:"Search.tsx",children:e.jsx(fe,{})}),e.jsx(l,{title:"Top and footer menus",description:"A full row above the navigation (workspace switcher) and one pinned above the collapse control (user menu), each with its own dropdown.",code:Ne,filename:"TopFooter.tsx",children:e.jsx(ve,{})}),e.jsx(l,{title:"Row actions and badges",description:"Actions render at the end of a row — always, or only on hover via actionsOnHover — and badges ride along next to the label or as a dot in the icon rail.",code:ke,filename:"Actions.tsx",children:e.jsx(je,{})}),e.jsx(l,{title:"Dual sidebars (layout)",description:"SideMenuLayout with a rightSideMenuProps renders a second menu on the opposite edge; each menu keeps its own collapse and mobile-drawer state.",code:Ie,filename:"DualLayout.tsx",children:e.jsx(Me,{})}),e.jsx(l,{title:"Multi sidebars (layout)",description:"With a secondarySideMenuProps the primary is pinned to the hover rail — always collapsed, expanding on hover — so the pair reads as one multi-sidebar rail.",code:Ae,filename:"MultiLayout.tsx",children:e.jsx(Ee,{})}),e.jsx(l,{title:"Chat layout",description:"The building blocks composed into a chat shell: conversation list with search, a user menu in the footer and the message pane in the layout body.",code:Re,filename:"Chat.tsx",children:e.jsx(He,{})})]})]});export{Be as SideMenuPage,Be as default};
