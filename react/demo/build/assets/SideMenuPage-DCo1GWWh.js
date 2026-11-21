import{r as t,j as e,O as r,C as Ce,b as Te,Q as Ae,q as y,R as j,U as Ee,V as De,W as X}from"./index-ChbzYKtA.js";import{A as Oe,a as Z,C as c,K as Pe,P as Le}from"./A11ySections-Ci0MCORB.js";import{P as He}from"./PageHeader-CORco2N-.js";import{E as i}from"./ExampleCard-Db5NXgWv.js";import{S as Re}from"./SurfaceToneControl-BpIV0XpL.js";import{h as _e,s as Fe,i as Ue,j as We,k as Be,l as Ge}from"./options-C-rzDbtC.js";import{P as Je,C as g,a as ee,T as h}from"./PlaygroundPanel-CZxrTOj5.js";import{C as ze}from"./ControlAccordion-DoyyLWlc.js";import{D as ae,a as _,E as Ve,b as R,U as M,W as se,c as $e,M as p,N as Ye,d as oe,s as te,G as O}from"./demoData-CxD2V06B.js";import{M as qe}from"./Menu-_CfOpFMd.js";const Ke=()=>{const[n,a]=t.useState("none"),[o,u]=t.useState("outlined"),[m,v]=t.useState("sidebar"),[f,x]=t.useState("icon"),[d,w]=t.useState("left"),[k,S]=t.useState("blue"),[l,b]=t.useState(!1),[I,le]=t.useState(250),[C,ie]=t.useState(!1),[F,re]=t.useState("all"),[U,de]=t.useState(!0),[W,ce]=t.useState(!1),[B,ue]=t.useState(!1),[G,he]=t.useState(!1),[pe,me]=t.useState(()=>new Set),ge=B?ae.filter(s=>!pe.has(s.slug)).map(s=>s.onDismiss?{...s,onDismiss:()=>me(Ie=>new Set(Ie).add(s.slug))}:s):void 0,[J,fe]=t.useState(!1),[T,xe]=t.useState("auto"),[z,be]=t.useState(!0),[A,ve]=t.useState(!0),[V,we]=t.useState(!0),[$,ke]=t.useState(!1),[Y,Se]=t.useState(!0),[q,Ne]=t.useState(!0),[E,ye]=t.useState("3"),[D,je]=t.useState(!1),[K,Me]=t.useState("skeleton"),Q=e.jsx(r,{fullHeight:!0,title:"Playground",color:k,variant:m,side:d,collapsible:f,openOnHover:l,hoverTransitionMs:I,noise:J,noiseScale:T==="auto"?void 0:Number(T),loading:D,loaderType:K,search:C,searchScope:F,searchPlaceholder:"Search menu",topItem:U?{label:"ACME Corp",icon:"Users",menu:se}:void 0,footerItem:W?{label:"Ada Lovelace",icon:"User",menu:M}:void 0,ctas:ge?.map(s=>({...s,surfaceTone:n,variant:o})),footerDetailsTone:n,footerDetailsVariant:o,footerDetails:G?R:void 0,items:[..._,...z?Ve:[],...A?$e({actions:V,actionsOnHover:$,tag:Y?k:void 0,loadingSession:q,pageSize:E==="all"?void 0:Number(E)}):[]]});return e.jsx(Je,{controls:e.jsx(ze,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:_e,value:m,onChange:s=>v(s)}),e.jsx(Re,{label:"Content panel tone",value:n,onChange:a}),e.jsx(g,{label:"Content panel variant",options:Fe,value:o,onChange:s=>u(s)}),e.jsx(g,{label:"Collapsible",options:Ue,value:f,onChange:s=>x(s)}),e.jsx(g,{label:"Side",options:We,value:d,onChange:s=>w(s)}),e.jsx(ee,{label:"Tone",children:e.jsx(Ce,{selectable:!0,size:"sm",value:k,onSelect:S,defaultExpanded:!0})})]})},{id:"behavior",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Open on hover (hover rail)",checked:l,onChange:b}),l&&f==="none"&&e.jsx("p",{className:"text-xs text-amber-600 dark:text-amber-400",children:"The hover rail needs a collapsible mode — pick one under Core."}),l&&e.jsx(ee,{label:"Hover transition",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(Te,{min:0,max:600,step:25,value:I,onChange:s=>le(s),color:k,className:"min-w-0 flex-1"}),e.jsxs("span",{className:"w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400",children:[I," ms"]})]})})]})},{id:"features",title:"Features",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Search",checked:C,onChange:ie}),C&&e.jsx(g,{label:"Search scope",options:Be,value:F,onChange:s=>re(s)}),e.jsx(h,{label:"Dither noise",checked:J,onChange:fe}),e.jsx(g,{label:"Grain scale",value:T,onChange:xe,options:[{value:"auto",label:"Auto (original)"},{value:"0.25",label:"0.25 — very fine"},{value:"0.5",label:"0.5 — fine"},{value:"1",label:"1 — 200px tile"},{value:"2",label:"2 — coarse"}]})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Loading",checked:D,onChange:je}),D&&e.jsx(g,{label:"Loader type",options:Ge,value:K,onChange:s=>Me(s)})]})},{id:"workspaces",title:"Workspaces section",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Show workspaces",checked:A,onChange:ve}),A&&e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Group actions",checked:V,onChange:we}),e.jsx(h,{label:"Actions on hover",checked:$,onChange:ke}),e.jsx(h,{label:"Group tag (tone line)",checked:Y,onChange:Se}),e.jsx(h,{label:"Loading session",checked:q,onChange:Ne}),e.jsx(g,{label:"Children per page",options:[{label:"3",value:"3"},{label:"5",value:"5"},{label:"All",value:"all"}],value:E,onChange:ye})]})]})},{id:"menu-items",title:"Menu items",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Top item (workspace menu)",checked:U,onChange:de}),e.jsx(h,{label:"Expand-only section (no route)",checked:z,onChange:be}),e.jsx(h,{label:"Footer item (user menu)",checked:W,onChange:ce}),e.jsx(h,{label:"Call-to-action cards",checked:B,onChange:ue}),e.jsx(h,{label:"Detail footer",checked:G,onChange:he})]})}]}),preview:e.jsx("div",{className:"h-[26rem] w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[d==="left"&&Q,e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]}),d==="right"&&Q]})})})};function Qe(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,color:"blue",title:"Demo",items:_}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Xe=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,Ze=Ae;function et(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:Ze.map(n=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:n}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,variant:n,title:n.charAt(0).toUpperCase()+n.slice(1),items:p}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},n))})}const tt=`import { SideMenu, SIDEBAR_VARIANTS } from "@cjlapao/ui-kit";
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
`;function nt(){return e.jsx("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[!1,!0].map(n=>e.jsxs("div",{className:"flex w-64 flex-col gap-2",children:[e.jsxs("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:["noise=",String(n)]}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,variant:"sidebar",title:"Noise",noise:n,items:p}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},String(n)))})}const at=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,st=[{label:"skeleton",type:"skeleton"},{label:"spinner",type:"spinner"},{label:"progress",type:"progress"}];function ot(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:st.map(({label:n,type:a})=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:n}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,title:"Loading",loading:!0,loaderType:a,loaderMessage:a==="progress"?"Fetching menu…":void 0,loaderProgress:a==="progress"?60:void 0,items:p}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},a))})}const lt=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,P=({label:n,children:a,wide:o=!1})=>e.jsxs("div",{className:`flex flex-col gap-2 ${o?"w-80":"w-56"}`,children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:n}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[a,e.jsx("div",{className:"flex-1 p-4",children:e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"})})]})})]}),it=()=>{const[n,a]=t.useState(!0);return e.jsx(r,{fullHeight:!0,color:"blue",collapsible:!0,collapsed:n,onToggleCollapse:()=>a(o=>!o),items:p})},rt=()=>{const[n,a]=t.useState(!0);return e.jsx(r,{fullHeight:!0,color:"emerald",collapsible:"offcanvas",collapsed:n,onToggleCollapse:()=>a(o=>!o),items:p})};function dt(){return e.jsxs("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[e.jsx(P,{label:"Icon rail — collapsed, toggle at the bottom",children:e.jsx(it,{})}),e.jsx(P,{label:"Offcanvas — collapsed, click the handle at the edge",children:e.jsx(rt,{})}),e.jsx(P,{label:"Hover — openOnHover, the rail expands on hover",wide:!0,children:e.jsx(r,{fullHeight:!0,color:"violet",collapsible:!0,openOnHover:!0,items:p})})]})}const ct=`import React, { useState, type ReactNode } from "react";
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
      collapsible
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
        <SideMenu fullHeight color="violet" collapsible openOnHover items={MINI_ITEMS} />
      </Panel>
    </div>
  );
}
`;function ut(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,color:"emerald",title:"Nested",items:Ye}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const ht=`import { SideMenu } from "@cjlapao/ui-kit";
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
`;function pt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,color:"amber",title:"Search",search:!0,searchPlaceholder:"Search menu",items:_}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Try “hosts”, “jobs” or “keys” — the search also matches each item’s description, and opens nested branches that contain a match."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const mt=`import { SideMenu } from "@cjlapao/ui-kit";
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
`;function gt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,color:"indigo",title:"Menus",topItem:{label:"ACME Corp",media:e.jsx(y,{icon:"Users",size:"xl",className:"text-indigo-500"}),menu:se},footerItem:{label:"Ada Lovelace",media:e.jsx("span",{className:"grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",children:"AL"}),menu:M},items:p}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The top row opens a workspace switcher; the footer row is pinned above the collapse control with the user menu."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const ft=`import { CustomIcon, SideMenu } from "@cjlapao/ui-kit";
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
`;function xt(){const[n,a]=t.useState(()=>new Set),o=ae.filter(u=>!n.has(u.slug)).map(u=>u.onDismiss?{...u,onDismiss:()=>a(m=>new Set(m).add(u.slug))}:u);return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,color:"violet",title:"Upgrades",items:p,ctas:o}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["Pitch cards — media, title, description and one action — are pinned under the navigation. The stack is taller than the zone's cap, so the zone scrolls on its own while the nav keeps its own scroll. The capacity card's ✕ opts in through"," ",e.jsx("code",{children:"onDismiss"}),": dismissed slugs are kept in component state, so it is gone for good."]}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const bt=`import { useState } from "react";
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
`;function vt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,color:"blue",title:"Dock",items:p,footerDetails:R}),e.jsx(r,{fullHeight:!0,variant:"floating-glass",color:"blue",title:"Dock · glass",items:p,footerDetails:R,footerDetailsTone:"green"}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["The detail footer is a flat status box pinned above the collapse control: rows of wrapping text with a soft ",e.jsx("code",{children:"Pill"})," or tinted value on the right. Solid variants keep it a neutral grey step off the sidebar; the see-through ones tint it with"," ",e.jsx("code",{children:"footerDetailsTone"}),", independently of the menu tone. Nothing here is removable — the array is the whole contract."]}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const wt=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,L=({icon:n,label:a})=>e.jsx("button",{type:"button","aria-label":a,className:"inline-flex items-center justify-center rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-700/40 dark:hover:text-neutral-200",children:e.jsx(y,{icon:n,className:"h-3.5 w-3.5"})}),kt=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:oe("4"),actions:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(L,{icon:"Edit",label:"Edit Jobs"}),e.jsx(L,{icon:"Trash",label:"Delete Jobs"})]})},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host",actionsOnHover:!0,actions:e.jsx(L,{icon:"Dots",label:"Host options"})},{slug:"images",label:"Images",path:"/images",icon:"Image"}];function St(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,collapsible:!0,color:"rose",title:"Actions",items:kt}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Jobs keeps its actions always visible; Hosts only reveals its on hover. Actions are hidden in the icon rail."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Nt=`import React from "react";
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
        <SideMenu fullHeight collapsible color="rose" title="Actions" items={ITEMS} />
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
`,yt=[{slug:"proj",label:"Projects",path:"/projects",icon:"Container"},{slug:"docs",label:"Docs",path:"/docs",icon:"Library"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],jt=[{slug:"all",label:"All",path:"/all",icon:"Dots"},{slug:"active",label:"Active",path:"/active",icon:"Run"},{slug:"failed",label:"Failed",path:"/failed",icon:"Error"}];function Mt(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(j,{sideMenuProps:{title:"Workspace",color:"blue",collapsible:!0,items:yt},rightSideMenuProps:{title:"Filters",color:"emerald",collapsible:!0,items:jt},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"})]})})})}const It=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
          collapsible: true,
          items: LEFT_ITEMS,
        }}
        rightSideMenuProps={{
          title: "Filters",
          color: "emerald",
          collapsible: true,
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
`,ne=[{slug:"projects",label:"Projects",icon:"Folder"},{slug:"activity",label:"Activity",icon:"Calendar"},{slug:"library",label:"Library",icon:"Library"},{slug:"home",label:"Home",icon:"Dashboard"}],Ct={projects:["UI kit","Design system","Customer portal","Documentation"],activity:["Panel variants updated","Workflow rail added","Design review","Release prepared"],library:["Components","Patterns","Brand assets","Saved templates"],home:[]};function Tt(){const{pathname:n}=Ee(),[a,o]=t.useState("projects"),[u,m]=t.useState("projects-0"),[v,f]=t.useState(""),[x,d]=t.useState(!0),w=ne.find(l=>l.slug===a),k=ne.map(l=>({...l,path:n})),S=Ct[a].map((l,b)=>({slug:`${a}-${b}`,label:l,path:n,icon:a==="projects"?"Folder":void 0}));return e.jsx("div",{className:"h-[32rem] w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800",children:e.jsx(j,{multiMenuMode:"joined",secondaryOpen:x,onSecondaryOpenChange:d,sideMenuProps:{title:"Workspace navigation",responsive:!1,color:"neutral",logoIcon:e.jsx(y,{icon:"Dashboard",className:"h-6 w-6"}),items:k,activeItemSlug:a,onItemSelect:(l,b)=>{b.preventDefault(),o(l.slug),m(`${l.slug}-0`),d(!0)},footerItem:{label:"Alex Morgan",media:e.jsx("span",{className:"grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-[10px] font-semibold text-neutral-950",children:"AM"}),menu:M,onSelect:l=>f(String(l.label))}},secondarySideMenuProps:a==="home"?void 0:{title:w.label,logoText:e.jsx("span",{className:"text-lg font-semibold",children:"Workspace"}),color:"neutral",items:S,activeItemSlug:u,onItemSelect:(l,b)=>{b.preventDefault(),m(l.slug)},search:!0,searchPlaceholder:`Search ${w.label.toLowerCase()}`,ctas:[{slug:"explore-library",title:"Make it yours",description:"One workspace, two levels of navigation.",action:{label:"Explore library",onClick:()=>{o("library"),m("library-0")}}}]},header:e.jsxs("div",{className:"flex items-center justify-between gap-3 px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400",children:[e.jsxs("span",{children:["Workspace / ",w.label]}),a!=="home"&&e.jsx("button",{type:"button",onClick:()=>d(l=>!l),"aria-expanded":x,className:"rounded-md px-2 py-1 hover:bg-black/5 focus-visible:outline-2 dark:hover:bg-white/10",children:x?"Hide navigation":"Show navigation"})]}),children:e.jsxs("div",{className:"space-y-4 p-6",children:[e.jsx("p",{className:"text-xs font-medium uppercase tracking-widest text-neutral-500",children:w.label}),e.jsx("h3",{className:"text-xl font-semibold text-neutral-900 dark:text-neutral-100",children:S.find(l=>l.slug===u)?.label??"Welcome home"}),e.jsx("p",{className:"text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:"Choose Home to use the app without secondary navigation, or toggle navigation above. The app expands into the available space while the rounded corners remain beside the rail. Escape inside the secondary menu also closes it."}),v&&e.jsxs("p",{role:"status",className:"text-sm text-neutral-500",children:["Account action: ",v]})]})})})}const At=`import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CustomIcon, SideMenuLayout, type SideMenuItem, type SideMenuItemLink } from "@cjlapao/ui-kit";
import { USER_MENU } from "../demoData";

const SECTIONS = [
  { slug: "projects", label: "Projects", icon: "Folder" as const },
  { slug: "activity", label: "Activity", icon: "Calendar" as const },
  { slug: "library", label: "Library", icon: "Library" as const },
  { slug: "home", label: "Home", icon: "Dashboard" as const },
];

const CONTENT: Record<string, string[]> = {
  projects: ["UI kit", "Design system", "Customer portal", "Documentation"],
  activity: ["Panel variants updated", "Workflow rail added", "Design review", "Release prepared"],
  library: ["Components", "Patterns", "Brand assets", "Saved templates"],
  home: [],
};

export default function JoinedLayout() {
  const { pathname } = useLocation();
  const [section, setSection] = useState("projects");
  const [selected, setSelected] = useState("projects-0");
  const [accountAction, setAccountAction] = useState("");
  const [secondaryOpen, setSecondaryOpen] = useState(true);
  const current = SECTIONS.find((item) => item.slug === section)!;
  const railItems: SideMenuItem[] = SECTIONS.map((item) => ({ ...item, path: pathname }));
  const panelItems: SideMenuItemLink[] = CONTENT[section].map((label, index) => ({
    slug: \`\${section}-\${index}\`, label, path: pathname,
    icon: section === "projects" ? "Folder" : undefined,
  }));

  return (
    <div className="h-[32rem] w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <SideMenuLayout
        multiMenuMode="joined"
        secondaryOpen={secondaryOpen}
        onSecondaryOpenChange={setSecondaryOpen}
        sideMenuProps={{
          title: "Workspace navigation",
          responsive: false,
          color: "neutral",
          logoIcon: <CustomIcon icon="Dashboard" className="h-6 w-6" />,
          items: railItems,
          activeItemSlug: section,
          onItemSelect: (item, event) => {
            event.preventDefault();
            setSection(item.slug);
            setSelected(\`\${item.slug}-0\`);
            setSecondaryOpen(true);
          },
          footerItem: {
            label: "Alex Morgan",
            media: <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-[10px] font-semibold text-neutral-950">AM</span>,
            menu: USER_MENU,
            onSelect: (item) => setAccountAction(String(item.label)),
          },
        }}
        secondarySideMenuProps={section === "home" ? undefined : {
          title: current.label,
          logoText: <span className="text-lg font-semibold">Workspace</span>,
          color: "neutral",
          items: panelItems,
          activeItemSlug: selected,
          onItemSelect: (item, event) => {
            event.preventDefault();
            setSelected(item.slug);
          },
          search: true,
          searchPlaceholder: \`Search \${current.label.toLowerCase()}\`,
          ctas: [{
            slug: "explore-library",
            title: "Make it yours",
            description: "One workspace, two levels of navigation.",
            action: { label: "Explore library", onClick: () => { setSection("library"); setSelected("library-0"); } },
          }],
        }}
        header={<div className="flex items-center justify-between gap-3 px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400">
          <span>Workspace / {current.label}</span>
          {section !== "home" && <button type="button" onClick={() => setSecondaryOpen(value => !value)}
            aria-expanded={secondaryOpen}
            className="rounded-md px-2 py-1 hover:bg-black/5 focus-visible:outline-2 dark:hover:bg-white/10">
            {secondaryOpen ? "Hide navigation" : "Show navigation"}
          </button>}
        </div>}
      >
        <div className="space-y-4 p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{current.label}</p>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{panelItems.find((item) => item.slug === selected)?.label ?? "Welcome home"}</h3>
          <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">Choose Home to use the app without secondary navigation, or toggle navigation above. The app expands into the available space while the rounded corners remain beside the rail. Escape inside the secondary menu also closes it.</p>
          {accountAction && <p role="status" className="text-sm text-neutral-500">Account action: {accountAction}</p>}
        </div>
      </SideMenuLayout>
    </div>
  );
}
`,Et=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs"},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],Dt=[{slug:"all",label:"All items",path:"/all",icon:"Dots"},{slug:"favorites",label:"Favorites",path:"/favorites",icon:"Star"},{slug:"recent",label:"Recent",path:"/recent",icon:"Calendar"}];function Ot(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(j,{sideMenuProps:{title:"Primary",color:"blue",items:Et},secondarySideMenuProps:{title:"Secondary",color:"violet",collapsible:!0,items:Dt},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The primary menu is pinned to a hover rail: it stays collapsed and expands as an overlay while you hover it. The secondary menu keeps its own collapse control."}),e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"})]})})})}const Pt=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
          collapsible: true,
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
`,H=18,N=3;function Lt(){const[n,a]=t.useState(()=>te("ui-kit",N)),[o,u]=t.useState(!1),[m,v]=t.useState(!1),f=()=>{u(!0),setTimeout(()=>{a(d=>[...d,...te("ui-kit",Math.min(N,H-d.length),d.length)]),u(!1)},800)},x=[{slug:"plugins",label:"Plugins",path:"/plugins",icon:"Library"},{slug:"automation",label:"Automation tasks",path:"/automation",icon:"Jobs"},{slug:"workspaces",type:"group",label:"Workspaces",tag:"violet",actionsOnHover:!0,actions:e.jsxs(e.Fragment,{children:[e.jsx(O,{icon:"Search",label:"Search workspaces"}),e.jsx(O,{icon:"Settings",label:"Filter workspaces"}),e.jsx(O,{icon:"Add",label:"New workspace"})]})},{slug:"new-agents",label:"new_agents",path:"/ws/new_agents",icon:"Folder",groupName:"workspaces",defaultOpen:!0,children:[{slug:"s31-run",label:"S31: Workspace Implementation",path:"/ws/new_agents/1",loading:!0,meta:"38min"},{slug:"s31",label:"S31: Workspace Implementation",path:"/ws/new_agents/2",meta:"4h"},{slug:"greeting",label:"Simple Greeting",path:"/ws/new_agents/3",meta:"7d"}]},{slug:"coffee",label:"ikea-coffee-code-generator",path:"/ws/coffee",icon:"Folder",groupName:"workspaces"},{slug:"ui-kit",label:"ui-kit",path:"/ws/ui-kit",icon:"Folder",groupName:"workspaces",defaultOpen:!0,children:n,childrenPageSize:N,childrenTotal:H,onLoadMoreChildren:f,loadingChildren:o,moreChildrenLabel:d=>`Show ${d} more sessions`}];return e.jsx("div",{className:"h-[34rem] w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(r,{fullHeight:!0,variant:"sidebar",color:"violet",title:"Claude",items:x,collapsible:!0,collapsed:m,onToggleCollapse:()=>v(d=>!d)}),e.jsxs("div",{className:"flex-1 p-6 text-sm text-neutral-500 dark:text-neutral-400",children:["Hover the Workspaces header for its actions. ui-kit loads ",N," sessions at a time from a fake server — ",n.length," of ",H," fetched so far."]})]})})}const Ht=`import { useState } from "react";
import { SideMenu, type SideMenuItem } from "@cjlapao/ui-kit";
import { GroupAction, sessionsFor } from "../demoData";

/**
 * A workspace navigator built from the kit's own props:
 * - the Workspaces group carries \`actions\` (search, filter, add) and a \`tag\`;
 * - a running session swaps its icon for a spinner with \`loading\`;
 * - each workspace shows its sessions a page at a time (\`childrenPageSize\`),
 *   and fetches more from the "server" when the loaded ones run out
 *   (\`childrenTotal\` + \`onLoadMoreChildren\` + \`loadingChildren\`).
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
      moreChildrenLabel: (n) => \`Show \${n} more sessions\`,
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
          collapsible
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
`,Rt=[{slug:"alice",label:"Alice",path:"/chat/alice",icon:"User",badge:oe("2")},{slug:"bob",label:"Bob",path:"/chat/bob",icon:"User"},{slug:"design",label:"Design Team",path:"/chat/design",icon:"Users"}];function _t(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(j,{sideMenuProps:{title:"Chats",color:"violet",collapsible:!0,search:!0,searchPlaceholder:"Search chats",items:Rt,footerItem:{label:"Ada Lovelace",icon:"User",menu:M}},header:e.jsxs("header",{className:"flex h-12 items-center gap-3 border-b border-neutral-200 px-5 dark:border-neutral-800",children:[e.jsx(y,{icon:"Chat",className:"h-4 w-4 text-violet-500"}),e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"Alice"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"online"})]}),children:e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"flex flex-1 flex-col gap-3 overflow-y-auto p-5",children:[e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"Hey — have you seen the new glass variants?"}),e.jsx("div",{className:"max-w-[70%] self-end rounded-2xl bg-violet-500 px-3 py-2 text-sm text-white",children:"Just shipped them. Try the Side Menu page."}),e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"The hover rail is a nice touch."})]}),e.jsx("div",{className:"border-t border-neutral-200 p-3 dark:border-neutral-800",children:e.jsx("input",{type:"text",placeholder:"Write a message…",className:"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400/60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"})})]})})})}const Ft=`import {
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
          collapsible: true,
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
`;function Ut(){const[n,a]=t.useState(!0);return e.jsxs("div",{className:"flex h-96 w-full max-w-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950",children:[e.jsx(r,{fullHeight:!0,responsive:!1,collapsible:!0,collapsed:n,onToggleCollapse:()=>a(o=>!o),items:p,footer:({side:o})=>e.jsxs(e.Fragment,{children:[e.jsx(De,{placement:o==="left"?"right":"left",trigger:e.jsx(X,{icon:"Notification",label:"Notifications",badge:e.jsx("span",{className:"h-2 w-2 rounded-full bg-blue-500"})}),children:e.jsxs("div",{className:"space-y-2 text-sm text-neutral-700 dark:text-neutral-200",children:[e.jsx("strong",{children:"Notifications"}),e.jsx("p",{children:"You’re all caught up."})]})}),e.jsx(qe,{placement:o==="left"?"right":"left",trigger:e.jsx(X,{icon:"User",label:"Account"}),items:[{id:"profile",label:"Profile",icon:"User"},{id:"settings",label:"Settings",icon:"Settings"}]})]})}),e.jsx("p",{className:"flex-1 p-6 text-sm text-neutral-600 dark:text-neutral-400",children:"Open notifications or the account menu from the footer. Expand the rail to reveal their labels. The entire rounded tile is the trigger."})]})}const Wt=`import { useState } from "react";
import { Menu, Popover, SideMenu, SideMenuIconButton } from "@cjlapao/ui-kit";
import { MINI_ITEMS } from "../demoData";

export default function FooterTriggers() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="flex h-96 w-full max-w-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <SideMenu
        fullHeight
        responsive={false}
        collapsible
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(value => !value)}
        items={MINI_ITEMS}
        footer={({ side }) => <>
          {/* Menu/Popover clone the trigger and attach handlers, ARIA and a ref.
              SideMenuIconButton forwards these to its single native button.
              Tone, surface copy and collapsed state come from SideMenu. */}
          <Popover placement={side === "left" ? "right" : "left"}
            trigger={<SideMenuIconButton icon="Notification" label="Notifications" badge={<span className="h-2 w-2 rounded-full bg-blue-500" />} />}>
            <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
              <strong>Notifications</strong>
              <p>You’re all caught up.</p>
            </div>
          </Popover>
          <Menu placement={side === "left" ? "right" : "left"}
            trigger={<SideMenuIconButton icon="User" label="Account" />}
            items={[
              { id: "profile", label: "Profile", icon: "User" },
              { id: "settings", label: "Settings", icon: "Settings" },
            ]} />
        </>}
      />
      <p className="flex-1 p-6 text-sm text-neutral-600 dark:text-neutral-400">
        Open notifications or the account menu from the footer. Expand the rail
        to reveal their labels. The entire rounded tile is the trigger.
      </p>
    </div>
  );
}
`,Xt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(He,{name:"Side Menu",description:"App navigation with five surface treatments (sidebar, inset, floating, floating-glass, glass), icon-rail and offcanvas collapse, hover-to-expand rails, nested items, item search and top/footer dropdown menus. Pinned call-to-action cards — media, title, one action, and a scroll of their own when the stack overflows — and a tone-washed detail footer fill the space under the navigation. SideMenuLayout composes it into dual and multi-sidebar app shells, and both stay responsive — below 1024px the panel becomes an offcanvas drawer. Everything inside follows the kit's scales: the tone (default blue) paints rows, hovers and loaders, and every hairline and label takes the surface treatment."}),e.jsx(Ke,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Basic",description:"The standing look: a translucent blur pushed into the layout, groups, badges and active-state matching that also lights up a parent while any descendant is active.",code:Xe,filename:"Basic.tsx",children:e.jsx(Qe,{})}),e.jsx(i,{title:"Custom footer triggers",description:"Use SideMenuIconButton as a native button trigger for Menu or Popover. The footer slot receives collapsed and side; buttons inherit menu styling and show labels when expanded. Custom avatar content, badges, active, disabled and loading states are supported.",code:Wt,filename:"FooterTriggers.tsx",children:e.jsx(Ut,{})}),e.jsx(i,{title:"Surface variants",description:"sidebar is the standing look; inset is a flat panel with a hairline, floating a detached rounded card, floating-glass that card in the kit's liquid-glass language, and glass the liquid-glass look flush in the layout — both glass treatments tinted with the menu's tone. Rows inside take the matching treatment automatically.",code:tt,filename:"Variants.tsx",children:e.jsx(et,{})}),e.jsx(i,{title:"Dither noise",description:"An opt-in film-grain texture over the panel background (off by default). It blends with the surface and reads most clearly on dark fills — the right panel has noise enabled.",code:at,filename:"Noise.tsx",children:e.jsx(nt,{})}),e.jsx(i,{title:"Loading states",description:"The same loader set as Panel: skeleton (the default) replaces the rows with a pulsing placeholder shaped like the menu's own chrome, while spinner and progress overlay the shared loader on top of the content.",code:lt,filename:"Loading.tsx",children:e.jsx(ot,{})}),e.jsx(i,{title:"Collapse modes",description:'Collapsing is opt-in: without collapsible the menu stays expanded, shows no collapse control and ignores openOnHover. collapsible (or "icon") shrinks to an icon rail, "offcanvas" removes the panel entirely (a handle at the edge opens it again), and collapsible + openOnHover keeps a rail that expands as an overlay on hover — with no collapse control at all.',code:ct,filename:"Collapse.tsx",children:e.jsx(dt,{})}),e.jsx(i,{title:"Nested items",description:"Children render as an indented sub-tree with its own chevron toggle. A parent that contains the active route carries the active tone, and defaultOpen pre-opens a branch.",code:ht,filename:"Nested.tsx",children:e.jsx(ut,{})}),e.jsx(i,{title:"Search",description:"A toggleable search below the top item matches each label and description, hides non-matching branches and auto-expands the parents of nested matches — the default searchScope='all'. searchScope='top' matches only the depth-0 rows, and shows a match with all of its children.",code:mt,filename:"Search.tsx",children:e.jsx(pt,{})}),e.jsx(i,{title:"Top and footer menus",description:"A full row above the navigation (workspace switcher) and one pinned above the collapse control (user menu), each with its own dropdown.",code:ft,filename:"TopFooter.tsx",children:e.jsx(gt,{})}),e.jsx(i,{title:"Call-to-action cards",description:"Structured pitch cards pinned between the navigation and the footer — media, title, description and one action (router path or callback). More cards than the zone's cap leaves for and the stack scrolls on its own, independently of the nav; the ✕ on the capacity card is opt-in through onDismiss, with dismissed slugs kept in component state.",code:bt,filename:"CallToActions.tsx",children:e.jsx(xt,{})}),e.jsx(i,{title:"Detail footer",description:"A tone-washed status box above the collapse control: rows of wrapping text with a soft Pill or tinted value on the right. footerDetailsTone tints the box independently of the menu tone; nothing is removable — the array is the whole contract.",code:wt,filename:"DetailFooter.tsx",children:e.jsx(vt,{})}),e.jsx(i,{title:"Row actions and badges",description:"Actions render at the end of a row — always, or only on hover via actionsOnHover — and badges ride along next to the label or as a dot in the icon rail.",code:Nt,filename:"Actions.tsx",children:e.jsx(St,{})}),e.jsx(i,{title:"Dual sidebars (layout)",description:"SideMenuLayout with a rightSideMenuProps renders a second menu on the opposite edge; each menu keeps its own collapse and mobile-drawer state.",code:It,filename:"DualLayout.tsx",children:e.jsx(Mt,{})}),e.jsx(i,{title:"Joined navigation rail and panel",description:'multiMenuMode="joined" pairs a permanent icon rail with contextual navigation. Hide navigation or select Home to animate the secondary menu to zero; the app expands while the inset corners remain. On mobile, available navigation opens in one drawer.',code:At,filename:"JoinedLayout.tsx",children:e.jsx(Tt,{})}),e.jsx(i,{title:"Multi sidebars (layout)",description:"With a secondarySideMenuProps the primary is pinned to the hover rail — always collapsed, expanding on hover — so the pair reads as one multi-sidebar rail.",code:Pt,filename:"MultiLayout.tsx",children:e.jsx(Ot,{})}),e.jsx(i,{title:"Workspaces (group actions, tag, loading rows, lazy children)",description:"A workspace navigator from the kit's own props — collapse it to see the rail: session times (`meta`) hide, and icon-less sessions show their initials. The group header carries `actions` (here only on hover) and a tone `tag`; a running session swaps its icon for a spinner with `loading`; each workspace shows its sessions a page at a time with `childrenPageSize`, and asks a (fake) server for the next page through `childrenTotal` + `onLoadMoreChildren` + `loadingChildren`.",code:Ht,filename:"Workspaces.tsx",children:e.jsx(Lt,{})}),e.jsx(i,{title:"Chat layout",description:"The building blocks composed into a chat shell: conversation list with search, a user menu in the footer and the message pane in the layout body.",code:Ft,filename:"Chat.tsx",children:e.jsx(_t,{})})]}),e.jsxs(Oe,{children:[e.jsxs(Z,{title:"Screen reader",children:[e.jsxs("p",{children:["The rows live in a ",e.jsx(c,{children:"nav"})," landmark named by ",e.jsx(c,{children:"title"})," (or ",e.jsx(c,{children:"kit.sidemenu.navAria"}),"). Every row is a real router link; the current one carries ",e.jsx(c,{children:'aria-current="page"'}),", and a ",e.jsx(c,{children:"loading"})," row carries"," ",e.jsx(c,{children:"aria-busy"})," — its spinner is hidden from assistive tech so a list of running rows does not chatter. A parent’s chevron is a separate button with ",e.jsx(c,{children:"aria-expanded"})," and a name built from the label (“Expand new_agents submenu”); its children sit in a ",e.jsx(c,{children:'role="group"'})," named after the parent."]}),e.jsxs("p",{children:["“Show N more” is a button, ",e.jsx(c,{children:"aria-busy"})," and disabled while ",e.jsx(c,{children:"loadingChildren"})," fetches. Group ",e.jsx(c,{children:"actions"})," are your own controls — give icon-only ones an ",e.jsx(c,{children:"aria-label"}),"; with"," ",e.jsx(c,{children:"actionsOnHover"})," they also appear when focus enters the header, so keyboard users can reach them."]})]}),e.jsx(Pe,{bindings:[{keys:["Tab"],action:"Moves through the top item, search, rows, submenu chevrons, group actions, Show more and the footer controls in document order."},{keys:["Enter"],action:"Follows a row's link; on a chevron, Show more or a group action, activates it."},{keys:["Space"],action:"Activates a focused button — chevron, Show more, group action, collapse control."},{keys:["Esc"],action:"Closes the mobile drawer; in hover-rail mode, closes the hovered panel."}]}),e.jsx(Z,{title:"Internationalization",children:e.jsxs("p",{children:["The menu’s own words are ",e.jsx(c,{children:"kit.sidemenu.*"})," catalog keys in all five locales: search placeholder and name, collapse / expand / close controls, the submenu toggle and group names, “Show ","{count}"," ","more”, the no-results line and the navigation’s fallback name. Labels, badges and"," ",e.jsx(c,{children:"moreChildrenLabel"})," are yours. ",e.jsx(c,{children:'side="right"'})," docks it on the other edge."]})})]}),e.jsx(Le,{props:[{name:"layout: secondarySideMenuProps / multiMenuMode",type:'SideMenuProps / "hover" | "joined"',default:'— / "hover"',description:"Adds an adjacent secondary menu. Joined mode pins the primary compact and the secondary expanded, shares surface geometry, and opens both levels in one mobile drawer. The primary variant sets the pair's surface family."},{name:"layout: secondaryOpen / defaultSecondaryOpen",type:"boolean",default:"— / true",description:"Joined secondary visibility, controlled or initially uncontrolled. Missing secondarySideMenuProps closes the secondary automatically while preserving the rail and rounded body surface. Width transitions respect reduced motion."},{name:"layout: onSecondaryOpenChange",type:"(open: boolean) => void",description:"Visibility change request. Escape inside the desktop secondary menu requests closure; controlled consumers update secondaryOpen. Focus moves into the app body if its focused secondary content is hidden."},{name:"activeItemSlug / onItemSelect",type:"string / (item, event) => void",description:"Optional local selection. activeItemSlug overrides route-based highlighting; onItemSelect runs before navigation. Prevent the event's default action to switch contextual menu content without navigating."},{name:"joinedRole",type:'"rail" | "panel"',description:"Advanced composition prop set by SideMenuLayout in joined mode. Pins the desktop width and removes hover expansion and collapse controls."},{name:"flush",type:"boolean",default:"true",description:"Collapsible desktop menus square their attached edge: left corners on the left, right corners on the right. Applies while expanded and collapsed, including hover rails. Set false for a fully rounded floating card. Joined shells retain their shared corner geometry."},{name:"items",type:"SideMenuItem[]",description:"A flat list of links, group headers and dividers. A link joins a group with groupName; a group with no visible link hides itself."},{name:"link: label / path / icon / color / description",type:"string / string? / IconName / TrueColor / string",description:'The row; description is matched by search. A long label ends in an ellipsis, with the full name on hover. In the icon rail an icon-less row shows its initials ("Simple Greeting" → SG). Omit path to make the row expand-only — with children the whole row toggles its sub-tree, without it the row renders inert.'},{name:"link: badge",type:"ReactNode",description:"A badge at the row end — a count, a status dot. In the icon rail it rides the icon's corner."},{name:"link: meta",type:"ReactNode",description:'Trailing metadata — "38min", "4h", a size. Muted at the row end when expanded; hidden in the icon rail, where it is copy, not a badge.'},{name:"link: actions / actionsOnHover",type:"ReactNode / boolean",description:"Controls at the row end; hover-only when actionsOnHover. Hidden in the icon rail."},{name:"link: children / defaultOpen",type:"SideMenuItemLink[] / boolean",description:"Nested rows make the row collapsible; defaultOpen opens it at first. With a path the row navigates and a chevron toggles; without one the row is the toggle — click expands, click again collapses."},{name:"link: loading",type:"boolean",default:"false",description:"A spinner takes the icon's place (in the rail too) and the link is aria-busy."},{name:"link: childrenPageSize",type:"number",description:'Show the children a page at a time with a "Show N more" row. Search shows every match; an active child past the page is always revealed.'},{name:"link: childrenTotal / onLoadMoreChildren / loadingChildren",type:"number / () => void / boolean",description:"Lazy children: the total that exists, the fetch for the next page (called when paging passes the loaded ones), and its in-flight state (the Show more row spins and waits)."},{name:"link: moreChildrenLabel",type:"(remaining) => ReactNode",default:'"Show {count} more"',description:'Name what is being loaded — "Show 15 more sessions".'},{name:"group: label / hasDivider",type:"string / boolean",description:"A section header; hasDivider draws a rule above it."},{name:"group: actions / actionsOnHover",type:"ReactNode / boolean",description:"Controls at the end of the header — search, filter, add. Hover-only reveals on hover or when focus enters the header."},{name:"group: tag",type:"TrueColor",description:"A coloured vertical line before the group label, tagging the section with a tone."},{name:"guards / hidden",type:"SideMenuItemGuard[] / boolean",description:"Per item: guard rules (all must pass, evaluated by guardEvaluator) or a plain hide."},{name:"variant / side / color",type:"SidebarVariant / SidebarSide / TrueColor",default:'"sidebar" / "left" / "blue"',description:"Surface treatment, docked edge and accent."},{name:"collapsible",type:"SidebarCollapsible | boolean",default:'"none"',description:'Opt-in collapsing. Without it the panel stays expanded, shows no collapse control, ignores collapsed and does not open on hover. true / "icon" is the icon rail; "offcanvas" hides the panel behind an edge handle. The mobile drawer (responsive) is separate.'},{name:"collapsed / onToggleCollapse",type:"boolean / () => void",description:"Controlled collapse state, when the menu is collapsible."},{name:"openOnHover / hoverTransitionMs",type:"boolean / number",default:"false / 250",description:"Keep a rail that grows into the full panel on hover. Needs collapsible."},{name:"mobileOpen / onCloseMobile / responsive",type:"boolean / () => void / boolean",default:"— / — / true",description:"Below 1024px the panel is an offcanvas drawer with a backdrop; Esc closes it."},{name:"search / searchValue / onSearchChange / searchPlaceholder",type:"boolean / string / (v) => void / string",description:"An item search over labels and descriptions; controlled or not."},{name:"searchScope",type:"SideMenuSearchScope",default:'"all"',description:'How deep that search reaches. "all" matches every depth and keeps the parents of a nested match visible; "top" matches only the depth-0 rows — a link in items, group header or no, since only children adds depth — and shows a match with its whole child list.'},{name:"topItem / footerItem",type:"SideMenuDropdownItem",description:"Rows above the navigation and above the collapse control, each with its own dropdown menu."},{name:"footer",type:"ReactNode | ({ collapsed, side }) => ReactNode",description:"Pinned custom controls above footerItem. SideMenuIconButton inherits tone, surface copy and collapsed state, and forwards its ref and native button attributes for overlay triggers."},{name:"ctas / footerDetails / footerDetailsTone",type:"SideMenuCta[] / SideMenuDetailItem[] / TrueColor",description:"Pinned call-to-action cards and the status detail footer."},{name:"loading / loaderType / skeletonLines",type:"boolean / SideMenuLoaderType / number",default:'false / "skeleton" / 4',description:"The whole menu's loading state — a skeleton shaped like the rows, or the shared Loader over them."},{name:"noiseScale",type:"number",description:"Positive grain scale based on a repeating 200px tile: 0.25 very fine, 0.5 fine, 2 coarse. Omit to preserve automatic sizing. Requires noise."},{name:"noise",type:"boolean",default:"false",description:"A dither-grain texture over the panel background."},{name:"title / logoIcon / logoText / fullHeight / className",type:"string / ReactNode / ReactNode / boolean / string",description:"Header and sizing."}]})]});export{Xt as SideMenuPage,Xt as default};
