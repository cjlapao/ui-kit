import{r as t,j as e,z as s,M as i,l as K}from"./index-p9Bv1Pn1.js";import{P as q}from"./PageHeader-DCZtzAyX.js";import{E as l}from"./ExampleCard-BS13YSEO.js";import{P as W,S as c,C as o,T as r}from"./PlaygroundPanel-BDClNSzf.js";import{C as F}from"./ControlAccordion-CydkdljU.js";import{E as $,F as U,t as H,G as J,H as Z,k as Q,l as X,j as Y,I as ee}from"./options-Bqu3_N-h.js";const ae=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),ne="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",te=()=>{const[n,w]=t.useState("underline"),[d,A]=t.useState("md"),[p,C]=t.useState("blue"),[x,R]=t.useState("horizontal"),[m,E]=t.useState("start"),[u,O]=t.useState(!1),[b,z]=t.useState(!1),[g,M]=t.useState(!0),[h,G]=t.useState(!0),[f,_]=t.useState("medium"),[v,V]=t.useState("frosted"),[j,L]=t.useState("none"),[S,B]=t.useState("md"),[T,P]=t.useState("deployments"),N=n==="glass"||n==="liquid-glass",D=[{id:"deployments",label:"Deployments",icon:"Run",description:"Active release rings",badge:"Live",actions:h?[{id:"create",icon:"Add",label:"Create release",active:!0},{id:"sync",icon:"Reset",label:"Sync status"}]:void 0,panel:e.jsxs("div",{className:"grid gap-3 md:grid-cols-2",children:[e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Production"}),e.jsx("p",{className:"text-xl font-bold text-neutral-900 dark:text-white",children:"v2.18.4"}),e.jsx("p",{className:"text-xs text-neutral-500",children:"Healthy · deployed 3m ago"})]}),e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Staging"}),e.jsx("p",{className:"text-xl font-bold text-neutral-900 dark:text-white",children:"v2.19.0-rc1"}),e.jsx("p",{className:"text-xs text-amber-600 dark:text-amber-400",children:"2 checks queued"})]})]})},{id:"analytics",label:"Analytics",icon:"ViewGrid",description:"Usage and adoption",panel:e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Active seats"}),e.jsx("p",{className:"text-2xl font-bold text-neutral-900 dark:text-white",children:"247"}),e.jsx("p",{className:"text-xs text-emerald-600 dark:text-emerald-400",children:"+12 new this week"})]})},{id:"alerts",label:"Alerts",icon:"Notification",badge:"2",description:"Incidents & reviews",panel:e.jsx("div",{className:"space-y-2",children:["Database latency spike","API rate limit warning"].map(a=>e.jsxs("div",{className:"flex items-center justify-between rounded-lg border border-neutral-200 bg-white/80 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("span",{className:"font-medium text-neutral-900 dark:text-white",children:a}),e.jsx("span",{className:"text-xs text-neutral-500",children:"just now"})]},a))})}];return e.jsx(W,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(F,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Variant",options:$,value:n,onChange:a=>w(a)}),e.jsx(o,{label:"Size",children:e.jsx(i,{fullWidth:!0,size:"sm",options:U,value:d,onChange:a=>A(a)})}),e.jsx(c,{label:"Tone",options:H,value:p,onChange:a=>C(a)}),e.jsx(o,{label:"Orientation",children:e.jsx(i,{fullWidth:!0,size:"sm",options:J,value:x,onChange:a=>R(a)})}),e.jsx(o,{label:"Justify",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Z,value:m,onChange:a=>E(a)})})]})},...N?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(o,{label:"Vibrancy",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Q,value:f,onChange:a=>_(a)})}),e.jsx(o,{label:"Fill opacity",children:e.jsx(i,{fullWidth:!0,size:"sm",options:X,value:v,onChange:a=>V(a)})}),e.jsx(o,{label:"Specular",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Y,value:j,onChange:a=>L(a)})}),e.jsx(c,{label:"Radius",options:ee,value:S,onChange:a=>B(a)})]})}]:[],{id:"layout",title:"Layout",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Full width",checked:u,onChange:O}),e.jsx(r,{label:"Dividers",checked:b,onChange:z}),e.jsx(r,{label:"Actions",checked:h,onChange:G}),e.jsx(r,{label:"Scroll fade",checked:g,onChange:M})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Contextual ",e.jsx("strong",{children:"actions"})," pin to whichever tab is active.",e.jsx("strong",{children:" Dividers"})," only apply to underline and minimal. The ",e.jsx("strong",{children:"scroll fade"})," softens panel content against the bar when it scrolls."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:`flex h-72 flex-col ${ne}`,children:e.jsx(s,{items:D,value:T,onChange:a=>P(a),variant:n,size:d,color:p,orientation:x,justify:m,fullWidth:u,showDividers:b,scrollFade:g,vibrancy:f,glassOpacity:v,specularMode:N?j:"none",radius:S})}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(ae,{children:"Active tab"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:T})]})]})})},se=["underline","soft","pill","segmented","minimal","glass","liquid-glass"],ie=[{id:"a",label:"Alpha"},{id:"b",label:"Beta"}],le="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";function oe(){return e.jsx("div",{className:le,children:e.jsx("div",{className:"grid gap-4 md:grid-cols-2",children:se.map(n=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-xs opacity-60",children:n}),e.jsx(s,{items:ie,variant:n,color:"blue",size:"sm"})]},n))})})}const re=`import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem, TabsVariant } from "@cjlapao/ui-kit";

const VARIANTS: TabsVariant[] = [
  "underline",
  "soft",
  "pill",
  "segmented",
  "minimal",
  "glass",
  "liquid-glass",
];

const MINI_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

const GLASS_BACKDROP =
  "rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function EveryVariant() {
  return (
    <div className={GLASS_BACKDROP}>
      <div className="grid gap-4 md:grid-cols-2">
        {VARIANTS.map((each) => (
          <div key={each} className="flex flex-col gap-1.5">
            <span className="text-xs opacity-60">{each}</span>
            <Tabs items={MINI_ITEMS} variant={each} color="blue" size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
`,ce=["sm","md","lg"],de=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}];function pe(){return e.jsx("div",{className:"flex flex-wrap items-end gap-6",children:ce.map(n=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(s,{items:de,variant:"underline",color:"blue",size:n}),e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]},n))})}const xe=`import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem, TabsSize } from "@cjlapao/ui-kit";

const SIZES: TabsSize[] = ["sm", "md", "lg"];

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

export default function SizeLadder() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {SIZES.map((each) => (
        <div key={each} className="flex flex-col gap-1.5">
          <Tabs
            items={TRIO_ITEMS}
            variant="underline"
            color="blue"
            size={each}
          />
          <span className="text-[10px] uppercase tracking-wide opacity-60">
            {each}
          </span>
        </div>
      ))}
    </div>
  );
}
`,me=[{id:"a",label:"Alpha"},{id:"b",label:"Beta"}];function ue(){return e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:K.map(n=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(s,{items:me,variant:"underline",color:n,size:"sm"}),e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]},n))})}const be=`import { Tabs, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const MINI_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

export default function EveryTone() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {TRUE_COLORS.map((each) => (
        <div key={each} className="flex flex-col gap-1.5">
          <Tabs
            items={MINI_ITEMS}
            variant="underline"
            color={each}
            size="sm"
          />
          <span className="text-[10px] uppercase tracking-wide opacity-60">
            {each}
          </span>
        </div>
      ))}
    </div>
  );
}
`,y=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}],k=({children:n})=>e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n});function ge(){return e.jsxs("div",{className:"flex flex-wrap items-start gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(s,{items:y,variant:"soft",color:"blue",size:"sm",orientation:"horizontal"}),e.jsx(k,{children:"horizontal"})]}),e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(s,{items:y,variant:"soft",color:"blue",size:"sm",orientation:"vertical"}),e.jsx(k,{children:"vertical"})]})]})}const he=`import type { ReactNode } from "react";
import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[10px] uppercase tracking-wide opacity-60">{children}</span>
);

export default function Orientation() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col gap-1.5">
        <Tabs
          items={TRIO_ITEMS}
          variant="soft"
          color="blue"
          size="sm"
          orientation="horizontal"
        />
        <Caption>horizontal</Caption>
      </div>
      <div className="flex flex-col gap-1.5">
        <Tabs
          items={TRIO_ITEMS}
          variant="soft"
          color="blue"
          size="sm"
          orientation="vertical"
        />
        <Caption>vertical</Caption>
      </div>
    </div>
  );
}
`,fe=[{id:"a",label:"Deploy",icon:"Run",description:"Active rings",badge:"Live",actions:[{id:"create",icon:"Add",label:"Create release",active:!0},{id:"sync",icon:"Reset",label:"Sync status"}]},{id:"b",label:"Analytics",icon:"ViewGrid",description:"Usage"},{id:"c",label:"Locked",icon:"Key",disabled:!0,badge:"3"}];function ve(){return e.jsx(s,{items:fe,variant:"soft",color:"blue",size:"md"})}const je=`import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const STATE_ITEMS: TabItem[] = [
  {
    id: "a",
    label: "Deploy",
    icon: "Run",
    description: "Active rings",
    badge: "Live",
    actions: [
      { id: "create", icon: "Add", label: "Create release", active: true },
      { id: "sync", icon: "Reset", label: "Sync status" },
    ],
  },
  { id: "b", label: "Analytics", icon: "ViewGrid", description: "Usage" },
  { id: "c", label: "Locked", icon: "Key", disabled: true, badge: "3" },
];

export default function States() {
  return (
    <Tabs items={STATE_ITEMS} variant="soft" color="blue" size="md" />
  );
}
`,I=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}],Se="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";function Te(){return e.jsx("div",{className:Se,children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(s,{items:I,variant:"glass",color:"blue",size:"md",specularMode:"classic"}),e.jsx(s,{items:I,variant:"liquid-glass",color:"indigo",size:"md",specularMode:"halo"})]})})}const Ne=`import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

const GLASS_BACKDROP =
  "rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function Glass() {
  return (
    <div className={GLASS_BACKDROP}>
      <div className="flex flex-col gap-4">
        <Tabs
          items={TRIO_ITEMS}
          variant="glass"
          color="blue"
          size="md"
          specularMode="classic"
        />
        <Tabs
          items={TRIO_ITEMS}
          variant="liquid-glass"
          color="indigo"
          size="md"
          specularMode="halo"
        />
      </div>
    </div>
  );
}
`,Re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(q,{name:"Tabs",description:"Switch between panes with icons, descriptions, badges and contextual actions pinned to the active tab. Seven variants — including glass and liquid glass — plus size, tone, orientation, justify and scroll-fade controls."}),e.jsx(te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Every variant",description:"All seven variants at one tone and size, on a backdrop so the glass fills have something to blur.",code:re,filename:"EveryVariant.tsx",children:e.jsx(oe,{})}),e.jsx(l,{title:"Size ladder",description:"The shared sm / md / lg scale with icons, underline variant.",code:xe,filename:"SizeLadder.tsx",children:e.jsx(pe,{})}),e.jsx(l,{title:"Every tone",description:"All 21 true colours, underline at sm.",code:be,filename:"EveryTone.tsx",children:e.jsx(ue,{})}),e.jsx(l,{title:"Orientation",description:"The same soft bar running horizontally and vertically.",code:he,filename:"Orientation.tsx",children:e.jsx(ge,{})}),e.jsx(l,{title:"States",description:"Icon, description, badge, a disabled tab and contextual actions on the active tab.",code:je,filename:"States.tsx",children:e.jsx(ve,{})}),e.jsx(l,{title:"Glass",description:"Glass with a classic highlight and liquid glass with a halo — the active tab carries a tone ring.",code:Ne,filename:"Glass.tsx",children:e.jsx(Te,{})})]})]});export{Re as TabsPage,Re as default};
