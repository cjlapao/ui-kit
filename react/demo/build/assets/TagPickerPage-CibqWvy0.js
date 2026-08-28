import{r as a,j as e,by as s,I as E,J as V}from"./index-Bw7SVFgV.js";import{P as A}from"./PageHeader-CQm-NnZo.js";import{E as u}from"./ExampleCard-BR4461qP.js";import{P as M,a as l,C as O,T as i}from"./PlaygroundPanel-efOYSasM.js";import{C as R}from"./ControlAccordion-BDKCdIsF.js";import{x as L,t as z,n as q,b2 as B,K as G}from"./options-CREM8uYu.js";const U=[{id:"prod",label:"prod"},{id:"staging",label:"staging"},{id:"gpu",label:"gpu"},{id:"docker",label:"docker"},{id:"beta",label:"beta"}],_=()=>{const[n,o]=a.useState(["prod"]),[d,w]=a.useState("blue"),[c,b]=a.useState("md"),[r,k]=a.useState("flat"),[p,C]=a.useState("none"),[g,y]=a.useState("soft"),[h,N]=a.useState(!0),[m,S]=a.useState(!0),[f,T]=a.useState(!1),[v,I]=a.useState(!1),[j,P]=a.useState(!0);return e.jsx(M,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(R,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Variant",options:L,value:r,onChange:t=>k(t)}),e.jsx(l,{label:"Tone",options:z,value:d,onChange:t=>w(t)}),e.jsx(l,{label:"Size",options:q,value:c,onChange:t=>b(t)}),e.jsx(l,{label:"Validation",options:B,value:p,onChange:t=>C(t)})]})},...r==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(l,{label:"Glow",options:G,value:g,onChange:t=>y(t)})}]:[],{id:"behaviour",title:"Behaviour",controls:e.jsx(O,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Multi-select",checked:h,onChange:N}),e.jsx(i,{label:"Allow create",checked:m,onChange:S}),e.jsx(i,{label:"Read-only",checked:f,onChange:T}),e.jsx(i,{label:"Loading",checked:v,onChange:I}),e.jsx(i,{label:"Compare with Input",checked:j,onChange:P})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Type something that does not match to see the create row, and use the arrow keys and Enter. Items added this session are flagged"," ",e.jsx("strong",{children:"new"}),". The surface, padding, type scale and focus treatment come from the shared field system — the same one"," ",e.jsx("code",{children:"Input"}),", ",e.jsx("code",{children:"Select"})," and ",e.jsx("code",{children:"Picker"})," use."]})]}),preview:e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsx(s,{items:U,value:n,onChange:o,tone:d,size:c,variant:r,validationStatus:p,glowIntensity:g,multi:h,allowCreate:m,readOnly:f,loading:v}),j&&e.jsx(E,{placeholder:"An Input, same size and variant",tone:d,size:c,variant:r,validationStatus:p,glowIntensity:g})]})})};function D(){const[n,o]=a.useState(["prod"]);return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(s,{allowCreate:!0,items:[{id:"prod",label:"prod"},{id:"staging",label:"staging"}],value:n,onChange:o})})}const $=`import { useState } from "react";
import { TagPicker } from "@cjlapao/ui-kit";

/**
 * With \`allowCreate\`, a query matching nothing offers a create row. Values
 * added during this session are highlighted so the user can see what they just
 * did — both in the trigger pills and in the list.
 */
export default function Create() {
  const [value, setValue] = useState<string[]>(["prod"]);
  return (
    <div className="w-full max-w-sm">
      <TagPicker
        allowCreate
        items={[
          { id: "prod", label: "prod" },
          { id: "staging", label: "staging" },
        ]}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
`,F=[{id:"prod",label:"prod"},{id:"gpu",label:"gpu"}];function H(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:V.map(n=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:n}),e.jsx(s,{items:F,value:["prod"],onChange:()=>{},variant:n})]},n))})}const J=`import { TagPicker } from "@cjlapao/ui-kit";
import { INPUT_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "gpu", label: "gpu" },
];

/**
 * Every \`InputVariant\` the other fields offer. The trigger painted a hardcoded
 * \`bg-white dark:bg-neutral-900\` before, so none of these were reachable.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <TagPicker
            items={ITEMS}
            value={["prod"]}
            onChange={() => {}}
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
}
`,x=[{id:"prod",label:"prod"},{id:"gpu",label:"gpu"}];function K(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Loading (trigger disabled)"}),e.jsx(s,{items:[],value:[],onChange:()=>{},loading:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Disabled"}),e.jsx(s,{items:x,value:["prod"],onChange:()=>{},disabled:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Read-only"}),e.jsx(s,{items:x,value:["prod","gpu"],onChange:()=>{},readOnly:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Error"}),e.jsx(s,{items:x,value:[],onChange:()=>{},validationStatus:"error"})]})]})}const W=`import { TagPicker } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "gpu", label: "gpu" },
];

/**
 * \`loading\` disables the trigger as well as showing the spinner: there is
 * nothing to pick yet, and opening onto an empty list reads as "no results"
 * rather than "not ready". It takes a wait cursor rather than the disabled
 * dim, because the spinner already says why the control is inert.
 *
 * \`readOnly\` dims instead of repainting the surface — a neutral fill here was
 * a same-specificity fight with the variant's own, and turned a glass or
 * underline trigger into an opaque grey slab.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Loading (trigger disabled)</span>
        <TagPicker items={[]} value={[]} onChange={() => {}} loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Disabled</span>
        <TagPicker items={ITEMS} value={["prod"]} onChange={() => {}} disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Read-only</span>
        <TagPicker items={ITEMS} value={["prod", "gpu"]} onChange={() => {}} readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Error</span>
        <TagPicker items={ITEMS} value={[]} onChange={() => {}} validationStatus="error" />
      </div>
    </div>
  );
}
`,te=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(A,{name:"Tag Picker",description:"A multi-select that renders its selection as removable pills, with optional free-text creation. Arrow keys and Enter drive the list; Backspace on an empty query removes the last tag."}),e.jsx(_,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(u,{title:"Variants",description:"Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable.",code:J,filename:"Variants.tsx",children:e.jsx(H,{})}),e.jsx(u,{title:"Loading, disabled, read-only and error",description:"Loading disables the trigger as well as showing the spinner — there is nothing to pick yet. Read-only dims rather than repainting the surface, which used to turn a glass trigger into a grey slab.",code:W,filename:"States.tsx",children:e.jsx(K,{})}),e.jsx(u,{title:"Creating values",description:"A query matching nothing offers a create row, and values added this session are flagged so the user can see what they just did.",code:$,filename:"Create.tsx",children:e.jsx(D,{})})]})]});export{te as TagPickerPage,te as default};
