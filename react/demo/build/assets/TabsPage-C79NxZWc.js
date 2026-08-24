import{r as t,j as e,x as s,M as i,k as K}from"./index-B-ieYLXc.js";import{P as q,S as c,C as l,T as r,a as W,E as o}from"./PlaygroundPanel-CkWfNJii.js";import{D as F,E as $,t as U,F as H,G as J,j as Z,k as Q,i as X,H as Y}from"./options-C8y5quvx.js";const ee=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),ae="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",ne=()=>{const[n,w]=t.useState("underline"),[d,A]=t.useState("md"),[p,C]=t.useState("blue"),[x,R]=t.useState("horizontal"),[m,E]=t.useState("start"),[u,O]=t.useState(!1),[b,z]=t.useState(!1),[g,M]=t.useState(!0),[h,G]=t.useState(!0),[f,_]=t.useState("medium"),[v,V]=t.useState("frosted"),[j,L]=t.useState("none"),[S,B]=t.useState("md"),[T,D]=t.useState("deployments"),N=n==="glass"||n==="liquid-glass",P=[{id:"deployments",label:"Deployments",icon:"Run",description:"Active release rings",badge:"Live",actions:h?[{id:"create",icon:"Add",label:"Create release",active:!0},{id:"sync",icon:"Reset",label:"Sync status"}]:void 0,panel:e.jsxs("div",{className:"grid gap-3 md:grid-cols-2",children:[e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Production"}),e.jsx("p",{className:"text-xl font-bold text-neutral-900 dark:text-white",children:"v2.18.4"}),e.jsx("p",{className:"text-xs text-neutral-500",children:"Healthy · deployed 3m ago"})]}),e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Staging"}),e.jsx("p",{className:"text-xl font-bold text-neutral-900 dark:text-white",children:"v2.19.0-rc1"}),e.jsx("p",{className:"text-xs text-amber-600 dark:text-amber-400",children:"2 checks queued"})]})]})},{id:"analytics",label:"Analytics",icon:"ViewGrid",description:"Usage and adoption",panel:e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Active seats"}),e.jsx("p",{className:"text-2xl font-bold text-neutral-900 dark:text-white",children:"247"}),e.jsx("p",{className:"text-xs text-emerald-600 dark:text-emerald-400",children:"+12 new this week"})]})},{id:"alerts",label:"Alerts",icon:"Notification",badge:"2",description:"Incidents & reviews",panel:e.jsx("div",{className:"space-y-2",children:["Database latency spike","API rate limit warning"].map(a=>e.jsxs("div",{className:"flex items-center justify-between rounded-lg border border-neutral-200 bg-white/80 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("span",{className:"font-medium text-neutral-900 dark:text-white",children:a}),e.jsx("span",{className:"text-xs text-neutral-500",children:"just now"})]},a))})}];return e.jsx(q,{controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Variant",options:F,value:n,onChange:a=>w(a)}),e.jsx(l,{label:"Size",children:e.jsx(i,{fullWidth:!0,size:"sm",options:$,value:d,onChange:a=>A(a)})}),e.jsx(c,{label:"Tone",options:U,value:p,onChange:a=>C(a)}),e.jsx(l,{label:"Orientation",children:e.jsx(i,{fullWidth:!0,size:"sm",options:H,value:x,onChange:a=>R(a)})}),e.jsx(l,{label:"Justify",children:e.jsx(i,{fullWidth:!0,size:"sm",options:J,value:m,onChange:a=>E(a)})}),N&&e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{label:"Vibrancy",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Z,value:f,onChange:a=>_(a)})}),e.jsx(l,{label:"Fill opacity",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Q,value:v,onChange:a=>V(a)})}),e.jsx(l,{label:"Specular",children:e.jsx(i,{fullWidth:!0,size:"sm",options:X,value:j,onChange:a=>L(a)})}),e.jsx(c,{label:"Radius",options:Y,value:S,onChange:a=>B(a)})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Full width",checked:u,onChange:O}),e.jsx(r,{label:"Dividers",checked:b,onChange:z}),e.jsx(r,{label:"Actions",checked:h,onChange:G}),e.jsx(r,{label:"Scroll fade",checked:g,onChange:M})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Contextual ",e.jsx("strong",{children:"actions"})," pin to whichever tab is active.",e.jsx("strong",{children:" Dividers"})," only apply to underline and minimal. The ",e.jsx("strong",{children:"scroll fade"})," softens panel content against the bar when it scrolls."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:`flex h-72 flex-col ${ae}`,children:e.jsx(s,{items:P,value:T,onChange:a=>D(a),variant:n,size:d,color:p,orientation:x,justify:m,fullWidth:u,showDividers:b,scrollFade:g,vibrancy:f,glassOpacity:v,specularMode:N?j:"none",radius:S})}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(ee,{children:"Active tab"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:T})]})]})})},te=["underline","soft","pill","segmented","minimal","glass","liquid-glass"],se=[{id:"a",label:"Alpha"},{id:"b",label:"Beta"}],ie="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";function le(){return e.jsx("div",{className:ie,children:e.jsx("div",{className:"grid gap-4 md:grid-cols-2",children:te.map(n=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-xs opacity-60",children:n}),e.jsx(s,{items:se,variant:n,color:"blue",size:"sm"})]},n))})})}const oe=`import { Tabs } from "@cjlapao/ui-kit";
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
`,re=["sm","md","lg"],ce=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}];function de(){return e.jsx("div",{className:"flex flex-wrap items-end gap-6",children:re.map(n=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(s,{items:ce,variant:"underline",color:"blue",size:n}),e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]},n))})}const pe=`import { Tabs } from "@cjlapao/ui-kit";
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
`,xe=[{id:"a",label:"Alpha"},{id:"b",label:"Beta"}];function me(){return e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:K.map(n=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(s,{items:xe,variant:"underline",color:n,size:"sm"}),e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]},n))})}const ue=`import { Tabs, TRUE_COLORS } from "@cjlapao/ui-kit";
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
`,y=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}],k=({children:n})=>e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n});function be(){return e.jsxs("div",{className:"flex flex-wrap items-start gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(s,{items:y,variant:"soft",color:"blue",size:"sm",orientation:"horizontal"}),e.jsx(k,{children:"horizontal"})]}),e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(s,{items:y,variant:"soft",color:"blue",size:"sm",orientation:"vertical"}),e.jsx(k,{children:"vertical"})]})]})}const ge=`import type { ReactNode } from "react";
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
`,he=[{id:"a",label:"Deploy",icon:"Run",description:"Active rings",badge:"Live",actions:[{id:"create",icon:"Add",label:"Create release",active:!0},{id:"sync",icon:"Reset",label:"Sync status"}]},{id:"b",label:"Analytics",icon:"ViewGrid",description:"Usage"},{id:"c",label:"Locked",icon:"Key",disabled:!0,badge:"3"}];function fe(){return e.jsx(s,{items:he,variant:"soft",color:"blue",size:"md"})}const ve=`import { Tabs } from "@cjlapao/ui-kit";
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
`,I=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}],je="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";function Se(){return e.jsx("div",{className:je,children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(s,{items:I,variant:"glass",color:"blue",size:"md",specularMode:"classic"}),e.jsx(s,{items:I,variant:"liquid-glass",color:"indigo",size:"md",specularMode:"halo"})]})})}const Te=`import { Tabs } from "@cjlapao/ui-kit";
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
`,Ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(W,{name:"Tabs",description:"Switch between panes with icons, descriptions, badges and contextual actions pinned to the active tab. Seven variants — including glass and liquid glass — plus size, tone, orientation, justify and scroll-fade controls."}),e.jsx(ne,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Every variant",description:"All seven variants at one tone and size, on a backdrop so the glass fills have something to blur.",code:oe,filename:"EveryVariant.tsx",children:e.jsx(le,{})}),e.jsx(o,{title:"Size ladder",description:"The shared sm / md / lg scale with icons, underline variant.",code:pe,filename:"SizeLadder.tsx",children:e.jsx(de,{})}),e.jsx(o,{title:"Every tone",description:"All 21 true colours, underline at sm.",code:ue,filename:"EveryTone.tsx",children:e.jsx(me,{})}),e.jsx(o,{title:"Orientation",description:"The same soft bar running horizontally and vertically.",code:ge,filename:"Orientation.tsx",children:e.jsx(be,{})}),e.jsx(o,{title:"States",description:"Icon, description, badge, a disabled tab and contextual actions on the active tab.",code:ve,filename:"States.tsx",children:e.jsx(fe,{})}),e.jsx(o,{title:"Glass",description:"Glass with a classic highlight and liquid glass with a halo — the active tab carries a tone ring.",code:Te,filename:"Glass.tsx",children:e.jsx(Se,{})})]})]});export{Ie as TabsPage,Ie as default};
