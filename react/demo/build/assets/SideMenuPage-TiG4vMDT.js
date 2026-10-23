import{r as a,j as e,C as X,S as Z,a as l,b as ee,c as w,d as N}from"./index-B9JeX19j.js";import{P as te}from"./PageHeader-D-LFwZLT.js";import{E as o}from"./ExampleCard-BwESxlwz.js";import{P as ae,C as h,a as A,T as c}from"./PlaygroundPanel-CZvYEX_V.js";import{C as ne}from"./ControlAccordion-rp4gabXb.js";import{s as se,a as le,b as oe,c as ie}from"./options-Blq0niUd.js";import{D as H,a as k,b,U as j,W as _,M as r,N as re,d as O}from"./demoData-Cze-5Ou8.js";const de=()=>{const[t,n]=a.useState("sidebar"),[i,d]=a.useState("icon"),[u,R]=a.useState("left"),[m,P]=a.useState("blue"),[g,L]=a.useState(!1),[p,F]=a.useState(250),[S,U]=a.useState(!1),[M,B]=a.useState(!0),[y,J]=a.useState(!1),[I,V]=a.useState(!1),[T,W]=a.useState(!1),[z,Y]=a.useState(()=>new Set),G=I?H.filter(s=>!z.has(s.slug)).map(s=>s.onDismiss?{...s,onDismiss:()=>Y(Q=>new Set(Q).add(s.slug))}:s):void 0,[E,K]=a.useState(!1),[x,q]=a.useState(!1),[C,$]=a.useState("skeleton"),D=e.jsx(l,{fullHeight:!0,title:"Playground",color:m,variant:t,side:u,collapsible:i,openOnHover:g,hoverTransitionMs:p,noise:E,loading:x,loaderType:C,search:S,searchPlaceholder:"Search menu",topItem:M?{label:"ACME Corp",icon:"Users",menu:_}:void 0,footerItem:y?{label:"Ada Lovelace",icon:"User",menu:j}:void 0,ctas:G,footerDetails:T?b:void 0,items:k});return e.jsx(ae,{controls:e.jsx(ne,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Variant",options:se,value:t,onChange:s=>n(s)}),e.jsx(h,{label:"Collapsible",options:le,value:i,onChange:s=>d(s)}),e.jsx(h,{label:"Side",options:oe,value:u,onChange:s=>R(s)}),e.jsx(A,{label:"Tone",children:e.jsx(X,{selectable:!0,size:"sm",value:m,onSelect:P,defaultExpanded:!0})})]})},{id:"behavior",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Open on hover (hover rail)",checked:g,onChange:L}),g&&e.jsx(A,{label:"Hover transition",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(Z,{min:0,max:600,step:25,value:p,onChange:s=>F(s),color:m,className:"min-w-0 flex-1"}),e.jsxs("span",{className:"w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400",children:[p," ms"]})]})})]})},{id:"features",title:"Features",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Search",checked:S,onChange:U}),e.jsx(c,{label:"Dither noise",checked:E,onChange:K})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Loading",checked:x,onChange:q}),x&&e.jsx(h,{label:"Loader type",options:ie,value:C,onChange:s=>$(s)})]})},{id:"menu-items",title:"Menu items",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Top item (workspace menu)",checked:M,onChange:B}),e.jsx(c,{label:"Footer item (user menu)",checked:y,onChange:J}),e.jsx(c,{label:"Call-to-action cards",checked:I,onChange:V}),e.jsx(c,{label:"Detail footer",checked:T,onChange:W})]})}]}),preview:e.jsx("div",{className:"h-[26rem] w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[u==="left"&&D,e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]}),u==="right"&&D]})})})};function ce(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"blue",title:"Demo",items:k}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const ue=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,he=ee;function me(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:he.map(t=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:t}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,variant:t,title:t.charAt(0).toUpperCase()+t.slice(1),items:r}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},t))})}const ge=`import { SideMenu, SIDEBAR_VARIANTS } from "@cjlapao/ui-kit";
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
`;function pe(){return e.jsx("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[!1,!0].map(t=>e.jsxs("div",{className:"flex w-64 flex-col gap-2",children:[e.jsxs("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:["noise=",String(t)]}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,variant:"sidebar",title:"Noise",noise:t,items:r}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},String(t)))})}const xe=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,fe=[{label:"skeleton",type:"skeleton"},{label:"spinner",type:"spinner"},{label:"progress",type:"progress"}];function ve(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:fe.map(({label:t,type:n})=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:t}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,title:"Loading",loading:!0,loaderType:n,loaderMessage:n==="progress"?"Fetching menu…":void 0,loaderProgress:n==="progress"?60:void 0,items:r}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},n))})}const be=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,f=({label:t,children:n,wide:i=!1})=>e.jsxs("div",{className:`flex flex-col gap-2 ${i?"w-80":"w-56"}`,children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:t}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[n,e.jsx("div",{className:"flex-1 p-4",children:e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"})})]})})]}),we=()=>{const[t,n]=a.useState(!0);return e.jsx(l,{fullHeight:!0,color:"blue",collapsed:t,onToggleCollapse:()=>n(i=>!i),items:r})},Ne=()=>{const[t,n]=a.useState(!0);return e.jsx(l,{fullHeight:!0,color:"emerald",collapsible:"offcanvas",collapsed:t,onToggleCollapse:()=>n(i=>!i),items:r})};function ke(){return e.jsxs("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[e.jsx(f,{label:"Icon rail — collapsed, toggle at the bottom",children:e.jsx(we,{})}),e.jsx(f,{label:"Offcanvas — collapsed, click the handle at the edge",children:e.jsx(Ne,{})}),e.jsx(f,{label:"Hover — openOnHover, the rail expands on hover",wide:!0,children:e.jsx(l,{fullHeight:!0,color:"violet",openOnHover:!0,items:r})})]})}const je=`import React, { useState, type ReactNode } from "react";
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
`;function Se(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"emerald",title:"Nested",items:re}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Me=`import { SideMenu } from "@cjlapao/ui-kit";
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
`;function ye(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"amber",title:"Search",search:!0,searchPlaceholder:"Search menu",items:k}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Try “hosts”, “jobs” or “keys” — the search also matches each item’s description, and opens nested branches that contain a match."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Ie=`import { SideMenu } from "@cjlapao/ui-kit";
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
`;function Te(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"indigo",title:"Menus",topItem:{label:"ACME Corp",media:e.jsx(w,{icon:"Users",size:"xl",className:"text-indigo-500"}),menu:_},footerItem:{label:"Ada Lovelace",media:e.jsx("span",{className:"grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",children:"AL"}),menu:j},items:r}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The top row opens a workspace switcher; the footer row is pinned above the collapse control with the user menu."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Ee=`import { CustomIcon, SideMenu } from "@cjlapao/ui-kit";
import { MINI_ITEMS, USER_MENU, WORKSPACE_MENU } from "../demoData";

export default function TopFooter() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="indigo"
          title="Menus"
          topItem={{
            label: "ACME Corp",
            media: <CustomIcon icon="Users" size="xl" className="text-indigo-500" />,
            menu: WORKSPACE_MENU,
          }}
          footerItem={{
            label: "Ada Lovelace",
            media: (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                AL
              </span>
            ),
            menu: USER_MENU,
          }}
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
`;function Ce(){const[t,n]=a.useState(()=>new Set),i=H.filter(d=>!t.has(d.slug)).map(d=>d.onDismiss?{...d,onDismiss:()=>n(u=>new Set(u).add(d.slug))}:d);return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"violet",title:"Upgrades",items:r,ctas:i}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["Pitch cards — media, title, description and one action — are pinned under the navigation. The stack is taller than the zone's cap, so the zone scrolls on its own while the nav keeps its own scroll. The capacity card's ✕ opts in through"," ",e.jsx("code",{children:"onDismiss"}),": dismissed slugs are kept in component state, so it is gone for good."]}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const De=`import { useState } from "react";
import { SideMenu } from "@cjlapao/ui-kit";
import { DEMO_CTAS, MINI_ITEMS } from "../demoData";

export default function CallToActions() {
  // The kit only calls onDismiss — persistence is the app's. Here the
  // dismissed slugs live in component state.
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const ctas = DEMO_CTAS.filter((cta) => !dismissed.has(cta.slug)).map(
    (cta) =>
      cta.onDismiss
        ? {
            ...cta,
            onDismiss: () =>
              setDismissed((prev) => new Set(prev).add(cta.slug)),
          }
        : cta,
  );

  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="violet"
          title="Upgrades"
          items={MINI_ITEMS}
          ctas={ctas}
        />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Pitch cards — media, title, description and one action — are
            pinned under the navigation. The stack is taller than the
            zone&apos;s cap, so the zone scrolls on its own while the nav
            keeps its own scroll. The capacity card&apos;s ✕ opts in through{" "}
            <code>onDismiss</code>: dismissed slugs are kept in component
            state, so it is gone for good.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
`;function Ae(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"blue",title:"Dock",items:r,footerDetails:b}),e.jsx(l,{fullHeight:!0,variant:"floating-glass",color:"blue",title:"Dock · glass",items:r,footerDetails:b,footerDetailsTone:"green"}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["The detail footer is a flat status box pinned above the collapse control: rows of wrapping text with a soft ",e.jsx("code",{children:"Pill"})," or tinted value on the right. Solid variants keep it a neutral grey step off the sidebar; the see-through ones tint it with"," ",e.jsx("code",{children:"footerDetailsTone"}),", independently of the menu tone. Nothing here is removable — the array is the whole contract."]}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const He=`import { SideMenu } from "@cjlapao/ui-kit";
import { DEMO_DETAILS, MINI_ITEMS } from "../demoData";

export default function DetailFooter() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        {/* Solid variants keep the box a neutral grey step off the sidebar. */}
        <SideMenu
          fullHeight
          color="blue"
          title="Dock"
          items={MINI_ITEMS}
          footerDetails={DEMO_DETAILS}
        />
        {/* Only the see-through variants tint — there the tone wash is what
            holds the box together over the blur. */}
        <SideMenu
          fullHeight
          variant="floating-glass"
          color="blue"
          title="Dock · glass"
          items={MINI_ITEMS}
          footerDetails={DEMO_DETAILS}
          footerDetailsTone="green"
        />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The detail footer is a flat status box pinned above the collapse
            control: rows of wrapping text with a soft <code>Pill</code> or
            tinted value on the right. Solid variants keep it a neutral grey
            step off the sidebar; the see-through ones tint it with{" "}
            <code>footerDetailsTone</code>, independently of the menu tone.
            Nothing here is removable — the array is the whole contract.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
`,v=({icon:t,label:n})=>e.jsx("button",{type:"button","aria-label":n,className:"inline-flex items-center justify-center rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-700/40 dark:hover:text-neutral-200",children:e.jsx(w,{icon:t,className:"h-3.5 w-3.5"})}),_e=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:O("4"),actions:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(v,{icon:"Edit",label:"Edit Jobs"}),e.jsx(v,{icon:"Trash",label:"Delete Jobs"})]})},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host",actionsOnHover:!0,actions:e.jsx(v,{icon:"Dots",label:"Host options"})},{slug:"images",label:"Images",path:"/images",icon:"Image"}];function Oe(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(l,{fullHeight:!0,color:"rose",title:"Actions",items:_e}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Jobs keeps its actions always visible; Hosts only reveals its on hover. Actions are hidden in the icon rail."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Re=`import React from "react";
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
`,Pe=[{slug:"proj",label:"Projects",path:"/projects",icon:"Container"},{slug:"docs",label:"Docs",path:"/docs",icon:"Library"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],Le=[{slug:"all",label:"All",path:"/all",icon:"Dots"},{slug:"active",label:"Active",path:"/active",icon:"Run"},{slug:"failed",label:"Failed",path:"/failed",icon:"Error"}];function Fe(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(N,{sideMenuProps:{title:"Workspace",color:"blue",items:Pe},rightSideMenuProps:{title:"Filters",color:"emerald",items:Le},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"})]})})})}const Ue=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
`,Be=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs"},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],Je=[{slug:"all",label:"All items",path:"/all",icon:"Dots"},{slug:"favorites",label:"Favorites",path:"/favorites",icon:"Star"},{slug:"recent",label:"Recent",path:"/recent",icon:"Calendar"}];function Ve(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(N,{sideMenuProps:{title:"Primary",color:"blue",items:Be},secondarySideMenuProps:{title:"Secondary",color:"violet",items:Je},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The primary menu is pinned to a hover rail: it stays collapsed and expands as an overlay while you hover it. The secondary menu keeps its own collapse control."}),e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"})]})})})}const We=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
`,ze=[{slug:"alice",label:"Alice",path:"/chat/alice",icon:"User",badge:O("2")},{slug:"bob",label:"Bob",path:"/chat/bob",icon:"User"},{slug:"design",label:"Design Team",path:"/chat/design",icon:"Users"}];function Ye(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(N,{sideMenuProps:{title:"Chats",color:"violet",search:!0,searchPlaceholder:"Search chats",items:ze,footerItem:{label:"Ada Lovelace",icon:"User",menu:j}},header:e.jsxs("header",{className:"flex h-12 items-center gap-3 border-b border-neutral-200 px-5 dark:border-neutral-800",children:[e.jsx(w,{icon:"Chat",className:"h-4 w-4 text-violet-500"}),e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"Alice"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"online"})]}),children:e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"flex flex-1 flex-col gap-3 overflow-y-auto p-5",children:[e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"Hey — have you seen the new glass variants?"}),e.jsx("div",{className:"max-w-[70%] self-end rounded-2xl bg-violet-500 px-3 py-2 text-sm text-white",children:"Just shipped them. Try the Side Menu page."}),e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"The hover rail is a nice touch."})]}),e.jsx("div",{className:"border-t border-neutral-200 p-3 dark:border-neutral-800",children:e.jsx("input",{type:"text",placeholder:"Write a message…",className:"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400/60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"})})]})})})}const Ge=`import {
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
`,tt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(te,{name:"Side Menu",description:"App navigation with five surface treatments (sidebar, inset, floating, floating-glass, glass), icon-rail and offcanvas collapse, hover-to-expand rails, nested items, item search and top/footer dropdown menus. Pinned call-to-action cards — media, title, one action, and a scroll of their own when the stack overflows — and a tone-washed detail footer fill the space under the navigation. SideMenuLayout composes it into dual and multi-sidebar app shells, and both stay responsive — below 1024px the panel becomes an offcanvas drawer. Everything inside follows the kit's scales: the tone (default blue) paints rows, hovers and loaders, and every hairline and label takes the surface treatment."}),e.jsx(de,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Basic",description:"The standing look: a translucent blur pushed into the layout, groups, badges and active-state matching that also lights up a parent while any descendant is active.",code:ue,filename:"Basic.tsx",children:e.jsx(ce,{})}),e.jsx(o,{title:"Surface variants",description:"sidebar is the standing look; inset is a flat panel with a hairline, floating a detached rounded card, floating-glass that card in the kit's liquid-glass language, and glass the liquid-glass look flush in the layout — both glass treatments tinted with the menu's tone. Rows inside take the matching treatment automatically.",code:ge,filename:"Variants.tsx",children:e.jsx(me,{})}),e.jsx(o,{title:"Dither noise",description:"An opt-in film-grain texture over the panel background (off by default). It blends with the surface and reads most clearly on dark fills — the right panel has noise enabled.",code:xe,filename:"Noise.tsx",children:e.jsx(pe,{})}),e.jsx(o,{title:"Loading states",description:"The same loader set as Panel: skeleton (the default) replaces the rows with a pulsing placeholder shaped like the menu's own chrome, while spinner and progress overlay the shared loader on top of the content.",code:be,filename:"Loading.tsx",children:e.jsx(ve,{})}),e.jsx(o,{title:"Collapse modes",description:"icon shrinks to an icon rail, offcanvas removes the panel entirely (a handle at the edge opens it again) and openOnHover keeps a rail that expands as an overlay on hover — with no collapse control at all.",code:je,filename:"Collapse.tsx",children:e.jsx(ke,{})}),e.jsx(o,{title:"Nested items",description:"Children render as an indented sub-tree with its own chevron toggle. A parent that contains the active route carries the active tone, and defaultOpen pre-opens a branch.",code:Me,filename:"Nested.tsx",children:e.jsx(Se,{})}),e.jsx(o,{title:"Search",description:"A toggleable search below the top item matches each label and description, hides non-matching branches and auto-expands the parents of nested matches.",code:Ie,filename:"Search.tsx",children:e.jsx(ye,{})}),e.jsx(o,{title:"Top and footer menus",description:"A full row above the navigation (workspace switcher) and one pinned above the collapse control (user menu), each with its own dropdown.",code:Ee,filename:"TopFooter.tsx",children:e.jsx(Te,{})}),e.jsx(o,{title:"Call-to-action cards",description:"Structured pitch cards pinned between the navigation and the footer — media, title, description and one action (router path or callback). More cards than the zone's cap leaves for and the stack scrolls on its own, independently of the nav; the ✕ on the capacity card is opt-in through onDismiss, with dismissed slugs kept in component state.",code:De,filename:"CallToActions.tsx",children:e.jsx(Ce,{})}),e.jsx(o,{title:"Detail footer",description:"A tone-washed status box above the collapse control: rows of wrapping text with a soft Pill or tinted value on the right. footerDetailsTone tints the box independently of the menu tone; nothing is removable — the array is the whole contract.",code:He,filename:"DetailFooter.tsx",children:e.jsx(Ae,{})}),e.jsx(o,{title:"Row actions and badges",description:"Actions render at the end of a row — always, or only on hover via actionsOnHover — and badges ride along next to the label or as a dot in the icon rail.",code:Re,filename:"Actions.tsx",children:e.jsx(Oe,{})}),e.jsx(o,{title:"Dual sidebars (layout)",description:"SideMenuLayout with a rightSideMenuProps renders a second menu on the opposite edge; each menu keeps its own collapse and mobile-drawer state.",code:Ue,filename:"DualLayout.tsx",children:e.jsx(Fe,{})}),e.jsx(o,{title:"Multi sidebars (layout)",description:"With a secondarySideMenuProps the primary is pinned to the hover rail — always collapsed, expanding on hover — so the pair reads as one multi-sidebar rail.",code:We,filename:"MultiLayout.tsx",children:e.jsx(Ve,{})}),e.jsx(o,{title:"Chat layout",description:"The building blocks composed into a chat shell: conversation list with search, a user menu in the footer and the message pane in the layout body.",code:Ge,filename:"Chat.tsx",children:e.jsx(Ye,{})})]})]});export{tt as SideMenuPage,tt as default};
