import{r as t,j as e,z as d,C as et,b as tt,c as nt,G as at,H as j,J as M,K as st,N as ot,O as ce,M as lt}from"./index-CQwZVYnB.js";import{A as it,a as ue,C as u,K as rt,P as dt}from"./A11ySections-BXfanEck.js";import{P as ct}from"./PageHeader-BhZxEVHt.js";import{E as r}from"./ExampleCard-BZsKA5_g.js";import{S as ut}from"./SurfaceToneControl-LH37fS9y.js";import{k as ht,s as pt,l as mt,m as gt,n as xt,o as ft}from"./options-Byh1yOHz.js";import{P as vt,C as g,a as P,T as i}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as bt}from"./ControlAccordion-C7vC6faF.js";import{D as me,a as U,C as F,E as wt,b as W,U as C,W as ge,c as kt,M as m,N as St,d as xe,s as he,G as H}from"./demoData-D3zGr54A.js";const Nt=()=>{const[n,a]=t.useState("none"),[o,c]=t.useState("outlined"),[p,v]=t.useState("sidebar"),[b,x]=t.useState(!1),[h,w]=t.useState("icon"),[k,S]=t.useState("left"),[l,f]=t.useState("blue"),[N,fe]=t.useState(!1),[I,ve]=t.useState(250),[T,be]=t.useState(!1),[B,we]=t.useState("all"),[z,ke]=t.useState(!0),[G,Se]=t.useState(!1),[J,Ne]=t.useState(!1),[V,ye]=t.useState(!1),[je,Me]=t.useState(()=>new Set),Ce=J?me.filter(s=>!je.has(s.slug)).map(s=>s.onDismiss?{...s,onDismiss:()=>Me(Ze=>new Set(Ze).add(s.slug))}:s):void 0,[q,Ie]=t.useState(!1),[A,Te]=t.useState("auto"),[$,Ae]=t.useState(!0),[E,Ee]=t.useState(!0),[Y,De]=t.useState(!0),[K,Oe]=t.useState(!1),[X,Pe]=t.useState(!0),[Q,He]=t.useState(!0),[D,Le]=t.useState("3"),[O,_e]=t.useState(!1),[Z,Re]=t.useState("skeleton"),[ee,Fe]=t.useState(!0),[te,We]=t.useState(!0),[ne,Ue]=t.useState("sm"),[ae,Be]=t.useState(""),[se,ze]=t.useState(!1),[oe,Ge]=t.useState(!1),[le,Je]=t.useState(!1),[ie,Ve]=t.useState("new_agents"),[qe,$e]=t.useState("test-qa"),[Ye,Ke]=t.useState(["test-qa"]),re={items:F,size:ne,placeholder:ae||void 0,...se?{multi:!0,selectedIds:Ye,onMultiChange:Ke}:{selectedId:qe,onSelect:s=>$e(s.id)}},Xe={slug:"ctx-top",type:"select",label:"Environment",picker:re},Qe={slug:"ctx-nested",type:"select",label:"Current context",fullWidth:oe,picker:re},de=e.jsx(d,{fullHeight:!0,title:"Playground",color:l,variant:p,raisedSurface:b,side:k,collapsible:h,openOnHover:N,hoverTransitionMs:I,noise:q,noiseScale:A==="auto"?void 0:Number(A),loading:O,loaderType:Z,search:T,searchScope:B,searchPlaceholder:"Search menu",topItem:z?{label:"ACME Corp",icon:"Users",menu:ge}:void 0,footerItem:G?{label:"Ada Lovelace",icon:"User",menu:C}:void 0,ctas:Ce?.map(s=>({...s,surfaceTone:n,variant:o})),footerDetailsTone:n,footerDetailsVariant:o,footerDetails:V?W:void 0,items:[...U,...ee?[Xe]:[],...$?wt:[],...E?kt({actions:Y,actionsOnHover:K,tag:X?l:void 0,loadingSession:Q,pageSize:D==="all"?void 0:Number(D),contextSelect:te?Qe:void 0,contextSelectHost:ie,emojiIdentities:le}):[]]});return e.jsx(vt,{controls:e.jsx(bt,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:ht,value:p,onChange:s=>v(s)}),e.jsx(ut,{label:"Content panel tone",value:n,onChange:a}),e.jsx(g,{label:"Content panel variant",options:pt,value:o,onChange:s=>c(s)}),e.jsx(g,{label:"Collapsible",options:mt,value:h,onChange:s=>w(s)}),e.jsx(g,{label:"Side",options:gt,value:k,onChange:s=>S(s)}),e.jsx(P,{label:"Tone",children:e.jsx(et,{selectable:!0,size:"sm",value:l,onSelect:f,defaultExpanded:!0})}),e.jsx(i,{label:"Raised surface",checked:b,onChange:x})]})},{id:"behavior",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Open on hover (hover rail)",checked:N,onChange:fe}),N&&h==="none"&&e.jsx("p",{className:"text-xs text-amber-600 dark:text-amber-400",children:"The hover rail needs a collapsible mode — pick one under Core."}),N&&e.jsx(P,{label:"Hover transition",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(tt,{min:0,max:600,step:25,value:I,onChange:s=>ve(s),color:l,className:"min-w-0 flex-1"}),e.jsxs("span",{className:"w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400",children:[I," ms"]})]})})]})},{id:"features",title:"Features",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Search",checked:T,onChange:be}),T&&e.jsx(g,{label:"Search scope",options:xt,value:B,onChange:s=>we(s)}),e.jsx(i,{label:"Dither noise",checked:q,onChange:Ie}),e.jsx(g,{label:"Grain scale",value:A,onChange:Te,options:[{value:"auto",label:"Auto (original)"},{value:"0.25",label:"0.25 — very fine"},{value:"0.5",label:"0.5 — fine"},{value:"1",label:"1 — 200px tile"},{value:"2",label:"2 — coarse"}]})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Loading",checked:O,onChange:_e}),O&&e.jsx(g,{label:"Loader type",options:ft,value:Z,onChange:s=>Re(s)})]})},{id:"workspaces",title:"Workspaces section",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Show workspaces",checked:E,onChange:Ee}),E&&e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Group actions",checked:Y,onChange:De}),e.jsx(i,{label:"Actions on hover",checked:K,onChange:Oe}),e.jsx(i,{label:"Group tag (tone line)",checked:X,onChange:Pe}),e.jsx(i,{label:"Loading session",checked:Q,onChange:He}),e.jsx(g,{label:"Children per page",options:[{label:"3",value:"3"},{label:"5",value:"5"},{label:"All",value:"all"}],value:D,onChange:Le}),e.jsx(i,{label:"Nested select (inside a workspace)",checked:te,onChange:We}),e.jsx(g,{label:"Host workspace",options:[{label:"new_agents (opens by default)",value:"new_agents"},{label:"ui-kit (collapsed — expand to reveal)",value:"ui-kit"}],value:ie,onChange:s=>Ve(s)}),e.jsx(i,{label:"Current context full width",checked:oe,onChange:Ge}),e.jsx(i,{label:"Emoji identities (🤖 / 🎨)",checked:le,onChange:Je})]})]})},{id:"menu-items",title:"Menu items",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Top item (workspace menu)",checked:z,onChange:ke}),e.jsx(i,{label:"Expand-only section (no route)",checked:$,onChange:Ae}),e.jsx(i,{label:"Footer item (user menu)",checked:G,onChange:Se}),e.jsx(i,{label:"Call-to-action cards",checked:J,onChange:Ne}),e.jsx(i,{label:"Detail footer",checked:V,onChange:ye})]})},{id:"select-item",title:"Select item",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Top-level select",checked:ee,onChange:Fe}),e.jsx(g,{label:"Picker size",options:[{label:"xs",value:"xs"},{label:"sm",value:"sm"},{label:"md",value:"md"},{label:"lg",value:"lg"},{label:"xl",value:"xl"}],value:ne,onChange:s=>Ue(s)}),e.jsx(i,{label:"Multiselect",checked:se,onChange:ze}),e.jsx(P,{label:"Placeholder",children:e.jsx(nt,{size:"sm",value:ae,placeholder:"Pick a context",onChange:s=>Be(s.target.value)})}),e.jsx("p",{className:"text-xs text-neutral-400",children:"Both rows share one selection — pick in either and the other follows. Collapsing the rail hides them."})]})}]}),preview:e.jsx("div",{className:"h-[26rem] w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[k==="left"&&de,e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]}),k==="right"&&de]})})})};function yt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,color:"blue",title:"Demo",items:U}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const jt=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,Mt=at;function Ct(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:Mt.map(n=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:n}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,variant:n,title:n.charAt(0).toUpperCase()+n.slice(1),items:m}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},n))})}const It=`import { SideMenu, SIDEBAR_VARIANTS } from "@cjlapao/ui-kit";
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
`;function Tt(){return e.jsx("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[!1,!0].map(n=>e.jsxs("div",{className:"flex w-64 flex-col gap-2",children:[e.jsxs("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:["noise=",String(n)]}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,variant:"sidebar",title:"Noise",noise:n,items:m}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},String(n)))})}const At=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,Et=[{label:"skeleton",type:"skeleton"},{label:"spinner",type:"spinner"},{label:"progress",type:"progress"}];function Dt(){return e.jsx("div",{className:"flex w-full max-w-5xl flex-wrap items-start justify-center gap-4",children:Et.map(({label:n,type:a})=>e.jsxs("div",{className:"flex w-56 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:n}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,title:"Loading",loading:!0,loaderType:a,loaderMessage:a==="progress"?"Fetching menu…":void 0,loaderProgress:a==="progress"?60:void 0,items:m}),e.jsxs("div",{className:"flex-1 p-4",children:[e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"}),e.jsx("div",{className:"mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30"})]})]})})]},a))})}const Ot=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,L=({label:n,children:a,wide:o=!1})=>e.jsxs("div",{className:`flex flex-col gap-2 ${o?"w-80":"w-56"}`,children:[e.jsx("span",{className:"text-xs font-medium text-neutral-500 dark:text-neutral-400",children:n}),e.jsx("div",{className:"h-80 overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[a,e.jsx("div",{className:"flex-1 p-4",children:e.jsx("div",{className:"h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50"})})]})})]}),Pt=()=>{const[n,a]=t.useState(!0);return e.jsx(d,{fullHeight:!0,color:"blue",collapsible:!0,collapsed:n,onToggleCollapse:()=>a(o=>!o),items:m})},Ht=()=>{const[n,a]=t.useState(!0);return e.jsx(d,{fullHeight:!0,color:"emerald",collapsible:"offcanvas",collapsed:n,onToggleCollapse:()=>a(o=>!o),items:m})};function Lt(){return e.jsxs("div",{className:"flex w-full max-w-4xl flex-wrap items-start justify-center gap-4",children:[e.jsx(L,{label:"Icon rail — collapsed, toggle at the bottom",children:e.jsx(Pt,{})}),e.jsx(L,{label:"Offcanvas — collapsed, click the handle at the edge",children:e.jsx(Ht,{})}),e.jsx(L,{label:"Hover — openOnHover, the rail expands on hover",wide:!0,children:e.jsx(d,{fullHeight:!0,color:"violet",collapsible:!0,openOnHover:!0,items:m})})]})}const _t=`import React, { useState, type ReactNode } from "react";
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
`;function Rt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,color:"emerald",title:"Nested",items:St}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-white/60 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Ft=`import { SideMenu } from "@cjlapao/ui-kit";
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
`;function Wt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,color:"amber",title:"Search",search:!0,searchPlaceholder:"Search menu",items:U}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Try “hosts”, “jobs” or “keys” — the search also matches each item’s description, and opens nested branches that contain a match."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Ut=`import { SideMenu } from "@cjlapao/ui-kit";
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
`;function Bt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,color:"indigo",title:"Menus",topItem:{label:"ACME Corp",media:e.jsx(j,{icon:"Users",size:"xl",className:"text-indigo-500"}),menu:ge},footerItem:{label:"Ada Lovelace",media:e.jsx("span",{className:"grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",children:"AL"}),menu:C},items:m}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The top row opens a workspace switcher; the footer row is pinned above the collapse control with the user menu."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const zt=`import { CustomIcon, SideMenu } from "@cjlapao/ui-kit";
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
`;function Gt(){const[n,a]=t.useState(()=>new Set),o=me.filter(c=>!n.has(c.slug)).map(c=>c.onDismiss?{...c,onDismiss:()=>a(p=>new Set(p).add(c.slug))}:c);return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,color:"violet",title:"Upgrades",items:m,ctas:o}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["Pitch cards — media, title, description and one action — are pinned under the navigation. The stack is taller than the zone's cap, so the zone scrolls on its own while the nav keeps its own scroll. The capacity card's ✕ opts in through"," ",e.jsx("code",{children:"onDismiss"}),": dismissed slugs are kept in component state, so it is gone for good."]}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Jt=`import { useState } from "react";
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
`;function Vt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,color:"blue",title:"Dock",items:m,footerDetails:W}),e.jsx(d,{fullHeight:!0,variant:"floating-glass",color:"blue",title:"Dock · glass",items:m,footerDetails:W,footerDetailsTone:"green"}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["The detail footer is a flat status box pinned above the collapse control: rows of wrapping text with a soft ",e.jsx("code",{children:"Pill"})," or tinted value on the right. Solid variants keep it a neutral grey step off the sidebar; the see-through ones tint it with"," ",e.jsx("code",{children:"footerDetailsTone"}),", independently of the menu tone. Nothing here is removable — the array is the whole contract."]}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const qt=`import { SideMenu } from "@cjlapao/ui-kit";
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
`,_=({icon:n,label:a})=>e.jsx("button",{type:"button","aria-label":a,className:"inline-flex items-center justify-center rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-700/40 dark:hover:text-neutral-200",children:e.jsx(j,{icon:n,className:"h-3.5 w-3.5"})}),$t=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs",badge:xe("4"),actions:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(_,{icon:"Edit",label:"Edit Jobs"}),e.jsx(_,{icon:"Trash",label:"Delete Jobs"})]})},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host",actionsOnHover:!0,actions:e.jsx(_,{icon:"Dots",label:"Host options"})},{slug:"images",label:"Images",path:"/images",icon:"Image"}];function Yt(){return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,collapsible:!0,color:"rose",title:"Actions",items:$t}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Jobs keeps its actions always visible; Hosts only reveals its on hover. Actions are hidden in the icon rail."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const Kt=`import React from "react";
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
`,Xt=[{slug:"proj",label:"Projects",path:"/projects",icon:"Container"},{slug:"docs",label:"Docs",path:"/docs",icon:"Library"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],Qt=[{slug:"all",label:"All",path:"/all",icon:"Dots"},{slug:"active",label:"Active",path:"/active",icon:"Run"},{slug:"failed",label:"Failed",path:"/failed",icon:"Error"}];function Zt(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(M,{sideMenuProps:{title:"Workspace",color:"blue",collapsible:!0,items:Xt},rightSideMenuProps:{title:"Filters",color:"emerald",collapsible:!0,items:Qt},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800/40"})]})})})}const en=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
`,pe=[{slug:"projects",label:"Projects",icon:"Folder"},{slug:"activity",label:"Activity",icon:"Calendar"},{slug:"library",label:"Library",icon:"Library"},{slug:"home",label:"Home",icon:"Dashboard"}],tn={projects:["UI kit","Design system","Customer portal","Documentation"],activity:["Panel variants updated","Workflow rail added","Design review","Release prepared"],library:["Components","Patterns","Brand assets","Saved templates"],home:[]};function nn(){const{pathname:n}=st(),[a,o]=t.useState("projects"),[c,p]=t.useState("projects-0"),[v,b]=t.useState(""),[x,h]=t.useState(!0),w=pe.find(l=>l.slug===a),k=pe.map(l=>({...l,path:n})),S=tn[a].map((l,f)=>({slug:`${a}-${f}`,label:l,path:n,icon:a==="projects"?"Folder":void 0}));return e.jsx("div",{className:"h-[32rem] w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800",children:e.jsx(M,{multiMenuMode:"joined",secondaryOpen:x,onSecondaryOpenChange:h,sideMenuProps:{title:"Workspace navigation",responsive:!1,color:"neutral",logoIcon:e.jsx(j,{icon:"Dashboard",className:"h-6 w-6"}),items:k,activeItemSlug:a,onItemSelect:(l,f)=>{f.preventDefault(),o(l.slug),p(`${l.slug}-0`),h(!0)},footerItem:{label:"Alex Morgan",media:e.jsx("span",{className:"grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-[10px] font-semibold text-neutral-950",children:"AM"}),menu:C,onSelect:l=>b(String(l.label))}},secondarySideMenuProps:a==="home"?void 0:{title:w.label,logoText:e.jsx("span",{className:"text-lg font-semibold",children:"Workspace"}),color:"neutral",items:S,activeItemSlug:c,onItemSelect:(l,f)=>{f.preventDefault(),p(l.slug)},search:!0,searchPlaceholder:`Search ${w.label.toLowerCase()}`,ctas:[{slug:"explore-library",title:"Make it yours",description:"One workspace, two levels of navigation.",action:{label:"Explore library",onClick:()=>{o("library"),p("library-0")}}}]},header:e.jsxs("div",{className:"flex items-center justify-between gap-3 px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400",children:[e.jsxs("span",{children:["Workspace / ",w.label]}),a!=="home"&&e.jsx("button",{type:"button",onClick:()=>h(l=>!l),"aria-expanded":x,className:"rounded-md px-2 py-1 hover:bg-black/5 focus-visible:outline-2 dark:hover:bg-white/10",children:x?"Hide navigation":"Show navigation"})]}),children:e.jsxs("div",{className:"space-y-4 p-6",children:[e.jsx("p",{className:"text-xs font-medium uppercase tracking-widest text-neutral-500",children:w.label}),e.jsx("h3",{className:"text-xl font-semibold text-neutral-900 dark:text-neutral-100",children:S.find(l=>l.slug===c)?.label??"Welcome home"}),e.jsx("p",{className:"text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:"Choose Home to use the app without secondary navigation, or toggle navigation above. The app expands into the available space while the rounded corners remain beside the rail. Escape inside the secondary menu also closes it."}),v&&e.jsxs("p",{role:"status",className:"text-sm text-neutral-500",children:["Account action: ",v]})]})})})}const an=`import { useState } from "react";
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
`,sn=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"jobs",label:"Jobs",path:"/jobs",icon:"Jobs"},{slug:"hosts",label:"Hosts",path:"/hosts",icon:"Host"},{slug:"settings",label:"Settings",path:"/settings",icon:"Settings"}],on=[{slug:"all",label:"All items",path:"/all",icon:"Dots"},{slug:"favorites",label:"Favorites",path:"/favorites",icon:"Star"},{slug:"recent",label:"Recent",path:"/recent",icon:"Calendar"}];function ln(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(M,{sideMenuProps:{title:"Primary",color:"blue",items:sn},secondarySideMenuProps:{title:"Secondary",color:"violet",collapsible:!0,items:on},children:e.jsxs("div",{className:"space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"The primary menu is pinned to a hover rail: it stays collapsed and expands as an overlay while you hover it. The secondary menu keeps its own collapse control."}),e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60"})]})})})}const rn=`import { SideMenuLayout, type SideMenuItem } from "@cjlapao/ui-kit";

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
`,R=18,y=3;function dn(){const[n,a]=t.useState(()=>he("ui-kit",y)),[o,c]=t.useState(!1),[p,v]=t.useState(!1),b=()=>{c(!0),setTimeout(()=>{a(h=>[...h,...he("ui-kit",Math.min(y,R-h.length),h.length)]),c(!1)},800)},x=[{slug:"plugins",label:"Plugins",path:"/plugins",icon:"Library"},{slug:"automation",label:"Automation tasks",path:"/automation",icon:"Jobs"},{slug:"workspaces",type:"group",label:"Workspaces",tag:"violet",actionsOnHover:!0,actions:e.jsxs(e.Fragment,{children:[e.jsx(H,{icon:"Search",label:"Search workspaces"}),e.jsx(H,{icon:"Settings",label:"Filter workspaces"}),e.jsx(H,{icon:"Add",label:"New workspace"})]})},{slug:"new-agents",label:"new_agents",path:"/ws/new_agents",icon:"Folder",groupName:"workspaces",defaultOpen:!0,children:[{slug:"s31-run",label:"S31: Workspace Implementation",path:"/ws/new_agents/1",loading:!0,meta:"38min"},{slug:"s31",label:"S31: Workspace Implementation",path:"/ws/new_agents/2",meta:"4h"},{slug:"greeting",label:"Simple Greeting",path:"/ws/new_agents/3",meta:"7d"}]},{slug:"coffee",label:"ikea-coffee-code-generator",path:"/ws/coffee",icon:"Folder",groupName:"workspaces"},{slug:"ui-kit",label:"ui-kit",path:"/ws/ui-kit",icon:"Folder",groupName:"workspaces",defaultOpen:!0,children:n,childrenPageSize:y,childrenTotal:R,onLoadMoreChildren:b,loadingChildren:o,moreChildrenLabel:h=>`Show ${h} more sessions`}];return e.jsx("div",{className:"h-[34rem] w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,variant:"sidebar",color:"violet",title:"Claude",items:x,collapsible:!0,collapsed:p,onToggleCollapse:()=>v(h=>!h)}),e.jsxs("div",{className:"flex-1 p-6 text-sm text-neutral-500 dark:text-neutral-400",children:["Hover the Workspaces header for its actions. ui-kit loads ",y," sessions at a time from a fake server — ",n.length," of ",R," fetched so far."]})]})})}const cn=`import { useState } from "react";
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
`,un=[{slug:"alice",label:"Alice",path:"/chat/alice",icon:"User",badge:xe("2")},{slug:"bob",label:"Bob",path:"/chat/bob",icon:"User"},{slug:"design",label:"Design Team",path:"/chat/design",icon:"Users"}];function hn(){return e.jsx("div",{className:"h-[26rem] w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-950",children:e.jsx(M,{sideMenuProps:{title:"Chats",color:"violet",collapsible:!0,search:!0,searchPlaceholder:"Search chats",items:un,footerItem:{label:"Ada Lovelace",icon:"User",menu:C}},header:e.jsxs("header",{className:"flex h-12 items-center gap-3 border-b border-neutral-200 px-5 dark:border-neutral-800",children:[e.jsx(j,{icon:"Chat",className:"h-4 w-4 text-violet-500"}),e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"Alice"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"online"})]}),children:e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"flex flex-1 flex-col gap-3 overflow-y-auto p-5",children:[e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"Hey — have you seen the new glass variants?"}),e.jsx("div",{className:"max-w-[70%] self-end rounded-2xl bg-violet-500 px-3 py-2 text-sm text-white",children:"Just shipped them. Try the Side Menu page."}),e.jsx("div",{className:"max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",children:"The hover rail is a nice touch."})]}),e.jsx("div",{className:"border-t border-neutral-200 p-3 dark:border-neutral-800",children:e.jsx("input",{type:"text",placeholder:"Write a message…",className:"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400/60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"})})]})})})}const pn=`import {
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
`;function mn(){const[n,a]=t.useState(!0);return e.jsxs("div",{className:"flex h-96 w-full max-w-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950",children:[e.jsx(d,{fullHeight:!0,responsive:!1,collapsible:!0,collapsed:n,onToggleCollapse:()=>a(o=>!o),items:m,footer:({side:o})=>e.jsxs(e.Fragment,{children:[e.jsx(ot,{placement:o==="left"?"right":"left",trigger:e.jsx(ce,{icon:"Notification",label:"Notifications",badge:e.jsx("span",{className:"h-2 w-2 rounded-full bg-blue-500"})}),children:e.jsxs("div",{className:"space-y-2 text-sm text-neutral-700 dark:text-neutral-200",children:[e.jsx("strong",{children:"Notifications"}),e.jsx("p",{children:"You’re all caught up."})]})}),e.jsx(lt,{placement:o==="left"?"right":"left",trigger:e.jsx(ce,{icon:"User",label:"Account"}),items:[{id:"profile",label:"Profile",icon:"User"},{id:"settings",label:"Settings",icon:"Settings"}]})]})}),e.jsx("p",{className:"flex-1 p-6 text-sm text-neutral-600 dark:text-neutral-400",children:"Open notifications or the account menu from the footer. Expand the rail to reveal their labels. The entire rounded tile is the trigger."})]})}const gn=`import { useState } from "react";
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
`;function xn(){const[n,a]=t.useState("test-qa"),o={items:F,placeholder:"Pick a workspace",selectedId:n,onSelect:p=>a(p.id)},c=[{slug:"overview",label:"Overview",path:"/overview",icon:"Dashboard"},{slug:"environment",type:"select",label:"Environment",picker:o},{slug:"workspaces",type:"group",label:"Workspaces"},{slug:"test-qa",label:"Test QA",path:"/ws/test_qa",icon:"Folder",groupName:"workspaces",defaultOpen:!0,children:[{slug:"current-context",type:"select",label:"Current context",picker:o}]},{slug:"test",label:"Test",path:"/ws/test",icon:"Folder",groupName:"workspaces"}];return e.jsx("div",{className:"h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-neutral-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(d,{fullHeight:!0,collapsible:!0,color:"blue",title:"Select item",items:c}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:n?`Context: ${F.find(p=>p.id===n)?.title??n}`:"No context picked yet."}),e.jsx("p",{className:"text-xs text-neutral-400",children:"A select row carries a caption over a full-width Picker — at top level or inside an open parent. Selection is yours through picker.selectedId / onSelect; the menu search never hides them."}),e.jsx("div",{className:"h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40"})]})]})})}const fn=`import { useState } from "react";
import {
  SideMenu,
  type PickerItem,
  type SideMenuItem,
  type SideMenuSelectPicker,
} from "@cjlapao/ui-kit";
import { CONTEXT_OPTIONS } from "../demoData";

export default function SelectItem() {
  // The app owns the selection — both embedded selects are the same context
  // decision, so they share one controlled value.
  const [context, setContext] = useState<string | undefined>("test-qa");
  const picker: SideMenuSelectPicker = {
    items: CONTEXT_OPTIONS,
    placeholder: "Pick a workspace",
    selectedId: context,
    onSelect: (item: PickerItem) => setContext(item.id),
  };

  const items: SideMenuItem[] = [
    { slug: "overview", label: "Overview", path: "/overview", icon: "Dashboard" },
    { slug: "environment", type: "select", label: "Environment", picker },
    { slug: "workspaces", type: "group", label: "Workspaces" },
    {
      slug: "test-qa",
      label: "Test QA",
      path: "/ws/test_qa",
      icon: "Folder",
      groupName: "workspaces",
      defaultOpen: true,
      // The screenshot's row: the sub-list is nothing but the context picker.
      children: [
        {
          slug: "current-context",
          type: "select",
          label: "Current context",
          picker,
        },
      ],
    },
    {
      slug: "test",
      label: "Test",
      path: "/ws/test",
      icon: "Folder",
      groupName: "workspaces",
    },
  ];

  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-neutral-950">
      <div className="flex h-full">
        <SideMenu fullHeight collapsible color="blue" title="Select item" items={items} />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {context
              ? \`Context: \${CONTEXT_OPTIONS.find((o) => o.id === context)?.title ?? context}\`
              : "No context picked yet."}
          </p>
          <p className="text-xs text-neutral-400">
            A select row carries a caption over a full-width Picker — at top
            level or inside an open parent. Selection is yours through
            picker.selectedId / onSelect; the menu search never hides them.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
`,Cn=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ct,{name:"Side Menu",description:"App navigation with five surface treatments (sidebar, inset, floating, floating-glass, glass), icon-rail and offcanvas collapse, hover-to-expand rails, nested items, item search and top/footer dropdown menus. Pinned call-to-action cards — media, title, one action, and a scroll of their own when the stack overflows — and a tone-washed detail footer fill the space under the navigation. SideMenuLayout composes it into dual and multi-sidebar app shells, and both stay responsive — below 1024px the panel becomes an offcanvas drawer. Everything inside follows the kit's scales: the tone (default blue) paints rows, hovers and loaders, and every hairline and label takes the surface treatment."}),e.jsx(Nt,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Basic",description:"The standing look: a translucent blur pushed into the layout, groups, badges and active-state matching that also lights up a parent while any descendant is active.",code:jt,filename:"Basic.tsx",children:e.jsx(yt,{})}),e.jsx(r,{title:"Custom footer triggers",description:"Use SideMenuIconButton as a native button trigger for Menu or Popover. The footer slot receives collapsed and side; buttons inherit menu styling and show labels when expanded. Custom avatar content, badges, active, disabled and loading states are supported.",code:gn,filename:"FooterTriggers.tsx",children:e.jsx(mn,{})}),e.jsx(r,{title:"Surface variants",description:"sidebar is the standing look; inset is a flat panel with a hairline, floating a detached rounded card, floating-glass that card in the kit's liquid-glass language, and glass the liquid-glass look flush in the layout — both glass treatments tinted with the menu's tone. Rows inside take the matching treatment automatically.",code:It,filename:"Variants.tsx",children:e.jsx(Ct,{})}),e.jsx(r,{title:"Dither noise",description:"An opt-in film-grain texture over the panel background (off by default). It blends with the surface and reads most clearly on dark fills — the right panel has noise enabled.",code:At,filename:"Noise.tsx",children:e.jsx(Tt,{})}),e.jsx(r,{title:"Loading states",description:"The same loader set as Panel: skeleton (the default) replaces the rows with a pulsing placeholder shaped like the menu's own chrome, while spinner and progress overlay the shared loader on top of the content.",code:Ot,filename:"Loading.tsx",children:e.jsx(Dt,{})}),e.jsx(r,{title:"Collapse modes",description:'Collapsing is opt-in: without collapsible the menu stays expanded, shows no collapse control and ignores openOnHover. collapsible (or "icon") shrinks to an icon rail, "offcanvas" removes the panel entirely (a handle at the edge opens it again), and collapsible + openOnHover keeps a rail that expands as an overlay on hover — with no collapse control at all.',code:_t,filename:"Collapse.tsx",children:e.jsx(Lt,{})}),e.jsx(r,{title:"Nested items",description:"Children render as an indented sub-tree with its own chevron toggle. A parent that contains the active route carries the active tone, and defaultOpen pre-opens a branch.",code:Ft,filename:"Nested.tsx",children:e.jsx(Rt,{})}),e.jsx(r,{title:"Embedded select item",description:"A select row: a group-header caption over a full-width Picker, at top level or nested inside an open parent — one step taller than the rows around it. Selection is fully controlled through picker.selectedId and onSelect; the menu search never hides these rows, and the icon rail hides them.",code:fn,filename:"SelectItem.tsx",children:e.jsx(xn,{})}),e.jsx(r,{title:"Search",description:"A toggleable search below the top item matches each label and description, hides non-matching branches and auto-expands the parents of nested matches — the default searchScope='all'. searchScope='top' matches only the depth-0 rows, and shows a match with all of its children.",code:Ut,filename:"Search.tsx",children:e.jsx(Wt,{})}),e.jsx(r,{title:"Top and footer menus",description:"A full row above the navigation (workspace switcher) and one pinned above the collapse control (user menu), each with its own dropdown.",code:zt,filename:"TopFooter.tsx",children:e.jsx(Bt,{})}),e.jsx(r,{title:"Call-to-action cards",description:"Structured pitch cards pinned between the navigation and the footer — media, title, description and one action (router path or callback). More cards than the zone's cap leaves for and the stack scrolls on its own, independently of the nav; the ✕ on the capacity card is opt-in through onDismiss, with dismissed slugs kept in component state.",code:Jt,filename:"CallToActions.tsx",children:e.jsx(Gt,{})}),e.jsx(r,{title:"Detail footer",description:"A tone-washed status box above the collapse control: rows of wrapping text with a soft Pill or tinted value on the right. footerDetailsTone tints the box independently of the menu tone; nothing is removable — the array is the whole contract.",code:qt,filename:"DetailFooter.tsx",children:e.jsx(Vt,{})}),e.jsx(r,{title:"Row actions and badges",description:"Actions render at the end of a row — always, or only on hover via actionsOnHover — and badges ride along next to the label or as a dot in the icon rail.",code:Kt,filename:"Actions.tsx",children:e.jsx(Yt,{})}),e.jsx(r,{title:"Dual sidebars (layout)",description:"SideMenuLayout with a rightSideMenuProps renders a second menu on the opposite edge; each menu keeps its own collapse and mobile-drawer state.",code:en,filename:"DualLayout.tsx",children:e.jsx(Zt,{})}),e.jsx(r,{title:"Joined navigation rail and panel",description:'multiMenuMode="joined" pairs a permanent icon rail with contextual navigation. Hide navigation or select Home to animate the secondary menu to zero; the app expands while the inset corners remain. On mobile, available navigation opens in one drawer.',code:an,filename:"JoinedLayout.tsx",children:e.jsx(nn,{})}),e.jsx(r,{title:"Multi sidebars (layout)",description:"With a secondarySideMenuProps the primary is pinned to the hover rail — always collapsed, expanding on hover — so the pair reads as one multi-sidebar rail.",code:rn,filename:"MultiLayout.tsx",children:e.jsx(ln,{})}),e.jsx(r,{title:"Workspaces (group actions, tag, loading rows, lazy children)",description:"A workspace navigator from the kit's own props — collapse it to see the rail: session times (`meta`) hide, and icon-less sessions show their initials. The group header carries `actions` (here only on hover) and a tone `tag`; a running session swaps its icon for a spinner with `loading`; each workspace shows its sessions a page at a time with `childrenPageSize`, and asks a (fake) server for the next page through `childrenTotal` + `onLoadMoreChildren` + `loadingChildren`.",code:cn,filename:"Workspaces.tsx",children:e.jsx(dn,{})}),e.jsx(r,{title:"Chat layout",description:"The building blocks composed into a chat shell: conversation list with search, a user menu in the footer and the message pane in the layout body.",code:pn,filename:"Chat.tsx",children:e.jsx(hn,{})})]}),e.jsxs(it,{children:[e.jsxs(ue,{title:"Screen reader",children:[e.jsxs("p",{children:["The rows live in a ",e.jsx(u,{children:"nav"})," landmark named by ",e.jsx(u,{children:"title"})," (or ",e.jsx(u,{children:"kit.sidemenu.navAria"}),"). Every row is a real router link; the current one carries ",e.jsx(u,{children:'aria-current="page"'}),", and a ",e.jsx(u,{children:"loading"})," row carries"," ",e.jsx(u,{children:"aria-busy"})," — its spinner is hidden from assistive tech so a list of running rows does not chatter. A parent’s chevron is a separate button with ",e.jsx(u,{children:"aria-expanded"})," and a name built from the label (“Expand new_agents submenu”); its children sit in a ",e.jsx(u,{children:'role="group"'})," named after the parent."]}),e.jsxs("p",{children:["“Show N more” is a button, ",e.jsx(u,{children:"aria-busy"})," and disabled while ",e.jsx(u,{children:"loadingChildren"})," fetches. Group ",e.jsx(u,{children:"actions"})," are your own controls — give icon-only ones an ",e.jsx(u,{children:"aria-label"}),"; with"," ",e.jsx(u,{children:"actionsOnHover"})," they also appear when focus enters the header, so keyboard users can reach them."]})]}),e.jsx(rt,{bindings:[{keys:["Tab"],action:"Moves through the top item, search, rows, submenu chevrons, group actions, Show more and the footer controls in document order."},{keys:["Enter"],action:"Follows a row's link; on a chevron, Show more or a group action, activates it."},{keys:["Space"],action:"Activates a focused button — chevron, Show more, group action, collapse control."},{keys:["Esc"],action:"Closes the mobile drawer; in hover-rail mode, closes the hovered panel."}]}),e.jsx(ue,{title:"Internationalization",children:e.jsxs("p",{children:["The menu’s own words are ",e.jsx(u,{children:"kit.sidemenu.*"})," catalog keys in all five locales: search placeholder and name, collapse / expand / close controls, the submenu toggle and group names, “Show ","{count}"," ","more”, the no-results line and the navigation’s fallback name. Labels, badges and"," ",e.jsx(u,{children:"moreChildrenLabel"})," are yours. ",e.jsx(u,{children:'side="right"'})," docks it on the other edge."]})})]}),e.jsx(dt,{props:[{name:"layout: secondarySideMenuProps / multiMenuMode",type:'SideMenuProps / "hover" | "joined"',default:'— / "hover"',description:"Adds an adjacent secondary menu. Joined mode pins the primary compact and the secondary expanded, shares surface geometry, and opens both levels in one mobile drawer. The primary variant sets the pair's surface family."},{name:"layout: secondaryOpen / defaultSecondaryOpen",type:"boolean",default:"— / true",description:"Joined secondary visibility, controlled or initially uncontrolled. Missing secondarySideMenuProps closes the secondary automatically while preserving the rail and rounded body surface. Width transitions respect reduced motion."},{name:"layout: onSecondaryOpenChange",type:"(open: boolean) => void",description:"Visibility change request. Escape inside the desktop secondary menu requests closure; controlled consumers update secondaryOpen. Focus moves into the app body if its focused secondary content is hidden."},{name:"activeItemSlug / onItemSelect",type:"string / (item, event) => void",description:"Optional local selection. activeItemSlug overrides route-based highlighting; onItemSelect runs before navigation. Prevent the event's default action to switch contextual menu content without navigating."},{name:"joinedRole",type:'"rail" | "panel"',description:"Advanced composition prop set by SideMenuLayout in joined mode. Pins the desktop width and removes hover expansion and collapse controls."},{name:"flush",type:"boolean",default:"true",description:"Collapsible desktop menus square their attached edge: left corners on the left, right corners on the right. Applies while expanded and collapsed, including hover rails. Set false for a fully rounded floating card. Joined shells retain their shared corner geometry."},{name:"items",type:"SideMenuItem[]",description:"A flat list of links, group headers and dividers. A link joins a group with groupName; a group with no visible link hides itself."},{name:"link: label / path / icon / color / description",type:"string / string? / IconName / TrueColor / string",description:'The row; description is matched by search. A long label ends in an ellipsis, with the full name on hover. In the icon rail an icon-less row shows its initials ("Simple Greeting" → SG). Omit path to make the row expand-only — with children the whole row toggles its sub-tree, without it the row renders inert.'},{name:"link: badge",type:"ReactNode",description:"A badge at the row end — a count, a status dot. In the icon rail it rides the icon's corner."},{name:"link: meta",type:"ReactNode",description:'Trailing metadata — "38min", "4h", a size. Muted at the row end when expanded; hidden in the icon rail, where it is copy, not a badge.'},{name:"link: actions / actionsOnHover",type:"ReactNode / boolean",description:"Controls at the row end; hover-only when actionsOnHover. Hidden in the icon rail."},{name:"link: children / defaultOpen",type:"SideMenuItemLink[] / boolean",description:"Nested rows make the row collapsible; defaultOpen opens it at first. With a path the row navigates and a chevron toggles; without one the row is the toggle — click expands, click again collapses."},{name:"link: loading",type:"boolean",default:"false",description:"A spinner takes the icon's place (in the rail too) and the link is aria-busy."},{name:"link: childrenPageSize",type:"number",description:'Show the children a page at a time with a "Show N more" row. Search shows every match; an active child past the page is always revealed.'},{name:"link: childrenTotal / onLoadMoreChildren / loadingChildren",type:"number / () => void / boolean",description:"Lazy children: the total that exists, the fetch for the next page (called when paging passes the loaded ones), and its in-flight state (the Show more row spins and waits)."},{name:"link: moreChildrenLabel",type:"(remaining) => ReactNode",default:'"Show {count} more"',description:'Name what is being loaded — "Show 15 more sessions".'},{name:"group: label / hasDivider",type:"string / boolean",description:"A section header; hasDivider draws a rule above it."},{name:"group: actions / actionsOnHover",type:"ReactNode / boolean",description:"Controls at the end of the header — search, filter, add. Hover-only reveals on hover or when focus enters the header."},{name:"group: tag",type:"TrueColor",description:"A coloured vertical line before the group label, tagging the section with a tone."},{name:"guards / hidden",type:"SideMenuItemGuard[] / boolean",description:"Per item: guard rules (all must pass, evaluated by guardEvaluator) or a plain hide."},{name:"variant / side / color",type:"SidebarVariant / SidebarSide / TrueColor",default:'"sidebar" / "left" / "blue"',description:"Surface treatment, docked edge and accent. `raisedSurface` forces the first nested-panels depth step on the panel — the tinted-card-on-matching-background fix."},{name:"collapsible",type:"SidebarCollapsible | boolean",default:'"none"',description:'Opt-in collapsing. Without it the panel stays expanded, shows no collapse control, ignores collapsed and does not open on hover. true / "icon" is the icon rail; "offcanvas" hides the panel behind an edge handle. The mobile drawer (responsive) is separate.'},{name:"collapsed / onToggleCollapse",type:"boolean / () => void",description:"Controlled collapse state, when the menu is collapsible."},{name:"openOnHover / hoverTransitionMs",type:"boolean / number",default:"false / 250",description:"Keep a rail that grows into the full panel on hover. Needs collapsible."},{name:"mobileOpen / onCloseMobile / responsive",type:"boolean / () => void / boolean",default:"— / — / true",description:"Below 1024px the panel is an offcanvas drawer with a backdrop; Esc closes it."},{name:"search / searchValue / onSearchChange / searchPlaceholder",type:"boolean / string / (v) => void / string",description:"An item search over labels and descriptions; controlled or not."},{name:"searchScope",type:"SideMenuSearchScope",default:'"all"',description:'How deep that search reaches. "all" matches every depth and keeps the parents of a nested match visible; "top" matches only the depth-0 rows — a link in items, group header or no, since only children adds depth — and shows a match with its whole child list.'},{name:"topItem / footerItem",type:"SideMenuDropdownItem",description:"Rows above the navigation and above the collapse control, each with its own dropdown menu."},{name:"footer",type:"ReactNode | ({ collapsed, side }) => ReactNode",description:"Pinned custom controls above footerItem. SideMenuIconButton inherits tone, surface copy and collapsed state, and forwards its ref and native button attributes for overlay triggers."},{name:"ctas / footerDetails / footerDetailsTone",type:"SideMenuCta[] / SideMenuDetailItem[] / TrueColor",description:"Pinned call-to-action cards and the status detail footer."},{name:"loading / loaderType / skeletonLines",type:"boolean / SideMenuLoaderType / number",default:'false / "skeleton" / 4',description:"The whole menu's loading state — a skeleton shaped like the rows, or the shared Loader over them."},{name:"noiseScale",type:"number",description:"Positive grain scale based on a repeating 200px tile: 0.25 very fine, 0.5 fine, 2 coarse. Omit to preserve automatic sizing. Requires noise."},{name:"noise",type:"boolean",default:"false",description:"A dither-grain texture over the panel background."},{name:"title / logoIcon / logoText / fullHeight / className",type:"string / ReactNode / ReactNode / boolean / string",description:"Header and sizing."}]})]});export{Cn as SideMenuPage,Cn as default};
