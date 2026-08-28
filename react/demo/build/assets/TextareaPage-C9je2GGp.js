import{r as a,j as e,t as s,M as r,J as I}from"./index-8i9ZNynb.js";import{P as L}from"./PageHeader-CO5k_SQv.js";import{E as i}from"./ExampleCard-LdxcpmX_.js";import{P as R,S as w,C as d,T as u}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as D}from"./ControlAccordion-Bqp-1oBj.js";import{x as G,n as M,t as P,K as E}from"./options-yAU-f7tt.js";const H=[{label:"None",value:"none"},{label:"Error",value:"error"},{label:"Success",value:"success"}],O=[{label:"None",value:"none"},{label:"Vertical",value:"vertical"},{label:"Horizontal",value:"horizontal"},{label:"Both",value:"both"}],B={none:"Markdown is supported.",error:"This field is required.",success:"Looks good."},W=()=>{const[t,o]=a.useState("elevated"),[l,j]=a.useState("md"),[h,b]=a.useState("blue"),[p,z]=a.useState("soft"),[c,T]=a.useState("none"),[x,C]=a.useState("vertical"),[m,S]=a.useState(!0),[g,k]=a.useState(!0),[f,y]=a.useState(!0),[v,V]=a.useState(!1),[N,A]=a.useState("");return e.jsx(R,{controls:e.jsx(D,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(w,{label:"Variant",options:G,value:t,onChange:n=>o(n)}),e.jsx(d,{label:"Size",children:e.jsx(r,{fullWidth:!0,size:"sm",options:M,value:l,onChange:n=>j(n)})}),e.jsx(w,{label:"Tone",options:P,value:h,onChange:n=>b(n)})]})},...t==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(d,{label:"Glow intensity",children:e.jsx(r,{fullWidth:!0,size:"sm",options:E,value:p,onChange:n=>z(n)})})}]:[],{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Validation",children:e.jsx(r,{fullWidth:!0,size:"sm",options:H,value:c,onChange:n=>T(n)})}),e.jsx(d,{label:"Resize",children:e.jsx(r,{fullWidth:!0,size:"sm",options:O,value:x,onChange:n=>C(n)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(u,{label:"Label",checked:m,onChange:S}),e.jsx(u,{label:"Help text",checked:g,onChange:k}),e.jsx(u,{label:"Character count",checked:f,onChange:y}),e.jsx(u,{label:"Disabled",checked:v,onChange:V})]})]})}]}),preview:e.jsx("div",{className:"w-full max-w-sm",children:e.jsx("div",{className:"rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(s,{size:l,variant:t,tone:h,validationStatus:c,resize:x,disabled:v,label:m?"Description":void 0,helpText:g?B[c]:void 0,showCount:f,maxLength:200,glowIntensity:p,value:N,onChange:n=>A(n.target.value),placeholder:"Enter your text here…"})})})})};function q(){const[t,o]=a.useState("A short intro shown on your profile.");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(s,{label:"Description",helpText:"Markdown is supported.",maxLength:200,showCount:!0,value:t,onChange:l=>o(l.target.value),placeholder:"Tell people about yourself…"})})}const U=`import { useState } from "react";
import { Textarea } from "@cjlapao/ui-kit";

export default function Description() {
  const [value, setValue] = useState("A short intro shown on your profile.");

  return (
    <div className="w-full max-w-sm">
      <Textarea
        label="Description"
        helpText="Markdown is supported."
        maxLength={200}
        showCount
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tell people about yourself…"
      />
    </div>
  );
}
`;function _(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:I.map(t=>e.jsx(s,{size:"sm",variant:t,resize:"none",label:t,placeholder:`${t} variant`},t))})}const F=`import { INPUT_VARIANTS, Textarea } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <Textarea
          key={variant}
          size="sm"
          variant={variant}
          resize="none"
          label={variant}
          placeholder={\`\${variant} variant\`}
        />
      ))}
    </div>
  );
}
`,$=[{status:"none",help:"Markdown is supported."},{status:"error",help:"This field is required."},{status:"success",help:"Looks good."}];function J(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:$.map(({status:t,help:o})=>e.jsx(s,{size:"sm",resize:"none",validationStatus:t,helpText:o,defaultValue:t==="none"?"":"Some entered text"},t))})}const K=`import { Textarea } from "@cjlapao/ui-kit";
import type { TextareaValidationStatus } from "@cjlapao/ui-kit";

const states: { status: TextareaValidationStatus; help: string }[] = [
  { status: "none", help: "Markdown is supported." },
  { status: "error", help: "This field is required." },
  { status: "success", help: "Looks good." },
];

export default function ValidationStates() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {states.map(({ status, help }) => (
        <Textarea
          key={status}
          size="sm"
          resize="none"
          validationStatus={status}
          helpText={help}
          defaultValue={status === "none" ? "" : "Some entered text"}
        />
      ))}
    </div>
  );
}
`,Q=["none","vertical","horizontal","both"];function X(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:Q.map(t=>e.jsx(s,{size:"sm",resize:t,label:t,placeholder:"Drag the corner to resize"},t))})}const Y=`import { Textarea } from "@cjlapao/ui-kit";
import type { TextareaResize } from "@cjlapao/ui-kit";

const modes: TextareaResize[] = ["none", "vertical", "horizontal", "both"];

export default function ResizeModes() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {modes.map((resize) => (
        <Textarea
          key={resize}
          size="sm"
          resize={resize}
          label={resize}
          placeholder="Drag the corner to resize"
        />
      ))}
    </div>
  );
}
`;function Z(){const[t,o]=a.useState("A bio with a hard limit of 120 characters.");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(s,{label:"Bio",helpText:"The counter turns red once you hit the limit.",maxLength:120,showCount:!0,value:t,onChange:l=>o(l.target.value)})})}const ee=`import { useState } from "react";
import { Textarea } from "@cjlapao/ui-kit";

export default function CharacterCount() {
  const [value, setValue] = useState("A bio with a hard limit of 120 characters.");

  return (
    <div className="w-full max-w-sm">
      <Textarea
        label="Bio"
        helpText="The counter turns red once you hit the limit."
        maxLength={120}
        showCount
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
`;function te(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(s,{variant:"gradient",size:"sm",resize:"none",tone:"indigo",glowIntensity:"soft",label:"soft",placeholder:"A gentle glow"}),e.jsx(s,{variant:"gradient",size:"sm",resize:"none",tone:"indigo",glowIntensity:"strong",label:"strong",placeholder:"A bold glow"})]})}const ne=`import { Textarea } from "@cjlapao/ui-kit";

export default function GradientGlow() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Textarea
        variant="gradient"
        size="sm"
        resize="none"
        tone="indigo"
        glowIntensity="soft"
        label="soft"
        placeholder="A gentle glow"
      />
      <Textarea
        variant="gradient"
        size="sm"
        resize="none"
        tone="indigo"
        glowIntensity="strong"
        label="strong"
        placeholder="A bold glow"
      />
    </div>
  );
}
`,de=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(L,{name:"Textarea",description:"A multi-line text input with the same surfaces, sizes and focus treatment as Input, plus a built-in label, status-aware help text and a character counter. Help text is linked to the field with aria-describedby, and its colour follows the validation state."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Description field",description:"The everyday form field: label, help text and a live `used / maxLength` counter under the control.",code:U,filename:"Description.tsx",children:e.jsx(q,{})}),e.jsx(i,{title:"All variants",description:"The shared input variant set — `flat`, `elevated`, `ghost`, `underline`, `glass`, `gradient` — so a Textarea never looks out of place next to an Input.",code:F,filename:"Variants.tsx",children:e.jsx(_,{})}),e.jsx(i,{title:"Validation states",description:"`validationStatus` tints the border and ring, and the help text under the field follows the state — error in rose, success in emerald.",code:K,filename:"ValidationStates.tsx",children:e.jsx(J,{})}),e.jsx(i,{title:"Resize modes",description:"`resize` maps straight onto the CSS resize property — `none`, `vertical` (default), `horizontal` or `both`.",code:Y,filename:"ResizeModes.tsx",children:e.jsx(X,{})}),e.jsx(i,{title:"Character count",description:"`showCount` needs `maxLength`; the counter turns red the moment the value hits the limit.",code:ee,filename:"CharacterCount.tsx",children:e.jsx(Z,{})}),e.jsx(i,{title:"Gradient glow",description:"The gradient variant puts a coloured halo behind the field that brightens on focus; `glowIntensity` sets how prominent it is.",code:ne,filename:"GradientGlow.tsx",children:e.jsx(te,{})})]})]});export{de as TextareaPage,de as default};
