import{r as t,j as e,M as i,a6 as L,bn as T,bo as j,o as V,P as E}from"./index-8i9ZNynb.js";import{P as G}from"./PageHeader-CO5k_SQv.js";import{E as d}from"./ExampleCard-LdxcpmX_.js";import{P as _,S as o,C as z,T as r}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as A}from"./ControlAccordion-Bqp-1oBj.js";import{n as R,t as D}from"./options-yAU-f7tt.js";const U=T.map(n=>({label:n,value:n})),W=j.map(n=>({label:n,value:n})),B=["none","xs","sm","md","lg","xl","full"].map(n=>({label:n,value:n})),f=[{value:"day",label:"Day"},{value:"week",label:"Week"},{value:"month",label:"Month"}],F=()=>{const[n,l]=t.useState("week"),[a,w]=t.useState("md"),[u,k]=t.useState("blue"),[p,N]=t.useState("subtle"),[h,S]=t.useState("solid"),[x,C]=t.useState(!1),[m,y]=t.useState("lg"),[c,O]=t.useState(!1),[g,I]=t.useState(!1),[v,P]=t.useState(!1);return e.jsx(_,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(A,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Size",options:R,value:a,onChange:s=>w(s)}),e.jsx(o,{label:"Tone",options:D,value:u,onChange:s=>k(s)}),e.jsx(o,{label:"Track variant",options:U,value:p,onChange:s=>N(s)}),e.jsx(o,{label:"Indicator",options:W,value:h,onChange:s=>S(s)}),e.jsx(o,{label:"Corner",options:B,value:m,onChange:y})]})},{id:"layout",title:"Layout",controls:e.jsx(z,{label:"Layout",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(r,{label:"Full width",checked:c,onChange:O}),e.jsx(r,{label:"Icons",checked:v,onChange:P}),e.jsx(r,{label:"Disabled",checked:g,onChange:I}),e.jsx(r,{label:"On a photo backdrop",checked:x,onChange:C})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Focus a segment and use the ",e.jsx("strong",{children:"arrow keys"}),", Home and End. The group had a roving tabindex but handled no keys at all, so a keyboard user could reach it and never change the selection — the one interaction a radiogroup exists for."]})]}),preview:e.jsx("div",{className:L("rounded-2xl p-6",x&&"bg-gradient-to-br from-sky-300 via-violet-300 to-rose-300 dark:from-sky-800 dark:via-violet-800 dark:to-rose-800",c&&"w-full"),children:e.jsx(i,{options:v?f.map((s,M)=>({...s,icon:["Calendar","ChartLine","Clock"][M]})):f,value:n,onChange:l,size:a,tone:u,variant:p,indicator:h,rounded:m,fullWidth:c,disabled:g})})})};function H(){const[n,l]=t.useState("b");return e.jsx("div",{className:"flex flex-col items-start gap-3",children:V.map(a=>e.jsx(i,{size:a,value:n,onChange:l,options:[{value:"a",label:"One"},{value:"b",label:"Two"},{value:"c",label:"Three"}]},a))})}const Z=`import { useState } from "react";
import { CONTROL_SIZES, MultiToggle } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. It used to declare its own
 * \`"sm" | "md" | "lg"\`, so a toggle could not line up with the \`xs\` or \`xl\`
 * Button beside it.
 */
export default function Sizes() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex flex-col items-start gap-3">
      {CONTROL_SIZES.map((size) => (
        <MultiToggle
          key={size}
          size={size}
          value={value}
          onChange={setValue}
          options={[
            { value: "a", label: "One" },
            { value: "b", label: "Two" },
            { value: "c", label: "Three" },
          ]}
        />
      ))}
    </div>
  );
}
`,b=[{value:"a",label:"Day"},{value:"b",label:"Week"}];function $(){const[n,l]=t.useState("b");return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-4",children:T.map(a=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-50",children:a}),e.jsx(E,{variant:a,tone:"violet",padding:"sm",corner:"rounded-lg",children:e.jsx("span",{className:"text-xs",children:"Panel"})}),e.jsx(i,{options:b,value:n,onChange:l,variant:a,tone:"violet",size:"sm"})]},a))}),e.jsx("div",{className:"flex flex-wrap gap-6",children:j.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(i,{options:b,value:n,onChange:l,indicator:a,tone:"violet"}),e.jsxs("span",{className:"text-[10px] uppercase tracking-wide opacity-50",children:["indicator: ",a]})]},a))})]})}const q=`import { useState } from "react";
import {
  MultiToggle,
  Panel,
  MULTI_TOGGLE_VARIANTS,
  MULTI_TOGGLE_INDICATORS,
} from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "a", label: "Day" },
  { value: "b", label: "Week" },
];

/**
 * The **track** takes the Panel surface family — the same eight variants, so a
 * toggle reads identically beside a card at the same tone. Each row here pairs
 * the toggle with the \`Panel\` it is matching.
 *
 * The **indicator** is a separate scale. It is what the old \`variant\` union
 * (\`theme | solid | soft\`) was actually describing: how the *active segment*
 * is drawn, which has nothing to do with the surface underneath it.
 */
export default function Variants() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MULTI_TOGGLE_VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide opacity-50">
              {variant}
            </span>
            <Panel variant={variant} tone="violet" padding="sm" corner="rounded-lg">
              <span className="text-xs">Panel</span>
            </Panel>
            <MultiToggle
              options={OPTIONS}
              value={value}
              onChange={setValue}
              variant={variant}
              tone="violet"
              size="sm"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6">
        {MULTI_TOGGLE_INDICATORS.map((indicator) => (
          <div key={indicator} className="flex flex-col items-center gap-1">
            <MultiToggle
              options={OPTIONS}
              value={value}
              onChange={setValue}
              indicator={indicator}
              tone="violet"
            />
            <span className="text-[10px] uppercase tracking-wide opacity-50">
              indicator: {indicator}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
`;function J(){const[n,l]=t.useState("b");return e.jsx("div",{className:"flex flex-wrap gap-4",children:["red","green","blue","violet","amber"].map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(i,{tone:a,value:n,onChange:l,options:[{value:"a",label:"A"},{value:"b",label:"B"}]}),e.jsx("span",{className:"text-[11px] opacity-60",children:a})]},a))})}const K=`import { useState } from "react";
import { MultiToggle } from "@cjlapao/ui-kit";

/**
 * \`tone\` is the accent — it used to be \`color\`, which is the name no other
 * control in the kit uses. \`color\` still works and is deprecated.
 *
 * The tokens are generated from the theme. The 21-entry map they replaced had
 * \`green\` painting **emerald** classes and \`red\` painting **rose**, so those
 * two rendered as their neighbours while the other nineteen were correct.
 */
export default function Tones() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex flex-wrap gap-4">
      {(["red", "green", "blue", "violet", "amber"] as const).map((color) => (
        <div key={color} className="flex flex-col items-center gap-1">
          <MultiToggle
            tone={color}
            value={value}
            onChange={setValue}
            options={[
              { value: "a", label: "A" },
              { value: "b", label: "B" },
            ]}
          />
          <span className="text-[11px] opacity-60">{color}</span>
        </div>
      ))}
    </div>
  );
}
`,te=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(G,{name:"Multi Toggle",description:"A segmented control — a radiogroup with a sliding indicator. The track takes the same eight surface variants as Panel, so it sits flush beside a card; the indicator is its own scale. Arrow keys, Home and End move the selection and skip disabled options."}),e.jsx(F,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Track variants and indicators",description:"The track is a surface, so it takes the Panel family — each toggle here is paired with the Panel it matches. The indicator is separate: it is what the old `theme | solid | soft` variant was really describing.",code:q,filename:"Variants.tsx",children:e.jsx($,{})}),e.jsx(d,{title:"Sizes",description:"The full shared control scale. It used to declare its own `sm | md | lg`, so a toggle could not line up with the `xs` or `xl` Button beside it.",code:Z,filename:"Sizes.tsx",children:e.jsx(H,{})}),e.jsx(d,{title:"Tones",description:"Generated from the theme. The 21-entry map this replaced had `green` painting emerald classes and `red` painting rose, so those two tones rendered as their neighbours.",code:K,filename:"Tones.tsx",children:e.jsx(J,{})})]})]});export{te as MultiTogglePage,te as default};
