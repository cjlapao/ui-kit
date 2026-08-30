import{r as a,j as e,L as n,I as k,J as A}from"./index-p9Bv1Pn1.js";import{P as z}from"./PageHeader-DCZtzAyX.js";import{E as m}from"./ExampleCard-BS13YSEO.js";import{P as L,a as r,C as O,T as o}from"./PlaygroundPanel-BDClNSzf.js";import{C as R}from"./ControlAccordion-CydkdljU.js";import{x as B,t as D,n as F,b2 as G,K as U}from"./options-Bqu3_N-h.js";const _=[{id:"a",title:"api-gateway",subtitle:"eu-west-1",tags:[{label:"running"}]},{id:"b",title:"worker-pool",subtitle:"us-east-1",tags:[{label:"paused"}]},{id:"c",title:"batch-runner",subtitle:"ap-south-1",tags:[{label:"stopped"}]}],$=()=>{const[s,c]=a.useState("a"),[p,i]=a.useState([]),[l,I]=a.useState("blue"),[h,S]=a.useState("md"),[d,N]=a.useState("flat"),[u,y]=a.useState("none"),[x,T]=a.useState("soft"),[w,C]=a.useState(!1),[b,P]=a.useState(!1),[g,E]=a.useState(!1),[v,V]=a.useState(!1),[j,M]=a.useState(!0);return e.jsx(L,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(R,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Variant",options:B,value:d,onChange:t=>N(t)}),e.jsx(r,{label:"Tone",options:D,value:l,onChange:t=>I(t)}),e.jsx(r,{label:"Size",options:F,value:h,onChange:t=>S(t)}),e.jsx(r,{label:"Validation",options:G,value:u,onChange:t=>y(t)})]})},...d==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(r,{label:"Glow",options:U,value:x,onChange:t=>T(t)})}]:[],{id:"behaviour",title:"Behaviour",controls:e.jsx(O,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{label:"Multi-select",checked:w,onChange:C}),e.jsx(o,{label:"Default filter",checked:v,onChange:V}),e.jsx(o,{label:"Loading",checked:b,onChange:P}),e.jsx(o,{label:"Disabled",checked:g,onChange:E}),e.jsx(o,{label:"Compare with Input",checked:j,onChange:M})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The surface, padding, type scale and focus treatment all come from the shared field system in the theme — the same one"," ",e.jsx("code",{children:"Input"}),", ",e.jsx("code",{children:"Select"})," and ",e.jsx("code",{children:"SearchBar"})," ","use. Turn on ",e.jsx("strong",{children:"Compare with Input"})," and change the size: the two stay aligned, which they could not before, when this control had a two-entry size scale and a hardcoded white box."]})]}),preview:e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsx(n,{items:_,tone:l,size:h,variant:d,validationStatus:u,glowIntensity:x,loading:b,disabled:g,multi:w,selectedId:s,onSelect:t=>c(t.id),selectedIds:p,onMultiChange:i,defaultFilter:v?{label:"Running",predicate:t=>t.tags?.[0]?.label==="running"}:void 0}),j&&e.jsx(k,{placeholder:"An Input, same size and variant",tone:l,size:h,variant:d,validationStatus:u,glowIntensity:x,disabled:g})]})})};function H(){const[s,c]=a.useState("a"),p=[{id:"a",title:"api-gateway"},{id:"b",title:"worker-pool"}];return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:["red","green","blue","violet"].map(i=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wide opacity-60",children:i}),e.jsx(n,{items:p,color:i,selectedId:s,onSelect:l=>c(l.id)})]},i))})}const J=`import { useState } from "react";
import { Picker } from "@cjlapao/ui-kit";

/**
 * Open each one: the trigger ring, the selected row and the filter chip all
 * come from tokens generated off \`TRUE_COLORS\`.
 *
 * The literal map this replaced spelled \`red\` with **rose** and \`green\` with
 * **emerald**. Because those literals were also what Tailwind scanned,
 * \`ring-red-500/20\` had never been emitted — so fixing the map alone would
 * have rendered those tones with no colour at all until the safelist gained
 * the shape too.
 */
export default function Tones() {
  const [id, setId] = useState("a");
  const items = [
    { id: "a", title: "api-gateway" },
    { id: "b", title: "worker-pool" },
  ];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["red", "green", "blue", "violet"] as const).map((color) => (
        <div key={color} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide opacity-60">{color}</span>
          <Picker items={items} color={color} selectedId={id} onSelect={(i) => setId(i.id)} />
        </div>
      ))}
    </div>
  );
}
`,K=[{id:"a",title:"api-gateway",subtitle:"eu-west-1"}];function W(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:A.map(s=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:s}),e.jsx(n,{items:K,selectedId:"a",variant:s})]},s))})}const q=`import { Picker } from "@cjlapao/ui-kit";
import { INPUT_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [{ id: "a", title: "api-gateway", subtitle: "eu-west-1" }];

/**
 * Every \`InputVariant\` the other fields offer. The trigger used to paint a
 * hardcoded \`bg-white dark:bg-neutral-900\` with a \`border-neutral-300\`, so
 * none of these were reachable — a Picker could not be glass, ghost,
 * underlined, elevated or gradient while every sibling field could.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <Picker items={ITEMS} selectedId="a" variant={variant} />
        </div>
      ))}
    </div>
  );
}
`,f=[{id:"a",title:"api-gateway",subtitle:"eu-west-1"},{id:"b",title:"worker-pool",subtitle:"us-east-1"}];function Q(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Loading (trigger disabled)"}),e.jsx(n,{items:[],loading:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Disabled"}),e.jsx(n,{items:f,selectedId:"a",disabled:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Error"}),e.jsx(n,{items:f,validationStatus:"error"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Beside an Input"}),e.jsx(n,{items:f,selectedId:"a"}),e.jsx(k,{placeholder:"Same size, same variant"})]})]})}const X=`import { Input, Picker } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "a", title: "api-gateway", subtitle: "eu-west-1" },
  { id: "b", title: "worker-pool", subtitle: "us-east-1" },
];

/**
 * Every state comes from the shared field system, so a Picker and an Input
 * side by side agree on all of them — the surface, the padding, the error
 * border, the disabled treatment.
 *
 * The loading row is the one that used to be wrong: the spinner and copy had
 * no \`flex-1\` between them, so the chevron sat against the word "Loading…"
 * instead of at the trailing edge where every other state puts it.
 *
 * \`loading\` also disables the trigger — there is nothing to pick yet, and
 * opening onto an empty list reads as "no results" rather than "not ready". It
 * takes a wait cursor rather than the disabled dim, because the spinner
 * already says why the control is inert.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Loading (trigger disabled)</span>
        <Picker items={[]} loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Disabled</span>
        <Picker items={ITEMS} selectedId="a" disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Error</span>
        <Picker items={ITEMS} validationStatus="error" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Beside an Input</span>
        <Picker items={ITEMS} selectedId="a" />
        <Input placeholder="Same size, same variant" />
      </div>
    </div>
  );
}
`,ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(z,{name:"Picker",description:"A searchable single- or multi-select over rich rows — icon, title, subtitle, description and pills. The list is portaled and flips above the trigger when there is no room below."}),e.jsx($,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(m,{title:"Variants",description:"Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable.",code:q,filename:"Variants.tsx",children:e.jsx(W,{})}),e.jsx(m,{title:"Loading, disabled and error",description:"All three come from the shared field system, so a Picker and an Input agree on them. The loading row's chevron now sits at the trailing edge — it used to sit against the word Loading.",code:X,filename:"States.tsx",children:e.jsx(Q,{})}),e.jsx(m,{title:"Tones",description:"Generated from the palette. The literal map this replaced spelled red as rose and green as emerald — and since those literals were also what Tailwind scanned, the correct classes had never been emitted.",code:J,filename:"Tones.tsx",children:e.jsx(H,{})})]})]});export{ne as PickerPage,ne as default};
