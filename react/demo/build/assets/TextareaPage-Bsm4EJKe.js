import{r as s,c5 as B,j as e,P as K,b_ as i,C as U,c8 as W}from"./index-gt012o8E.js";import{P as $}from"./PageHeader-CzVhyXQL.js";import{E as l}from"./ExampleCard-V3REeYJ5.js";import{P as Q,A as C,a as d,C as t,b as k,K as z}from"./A11ySections-zw3_3X-2.js";import{P as Y,S as m,C as h,a as J,T as u}from"./PlaygroundPanel-Czrs7oXC.js";import{C as X}from"./ControlAccordion-DIXHht2n.js";import{x as Z,d as ee,R as te,l as ne,m as ae,n as se,Q as ie}from"./options-CtADNKbm.js";const re=[{label:"None",value:"none"},{label:"Vertical",value:"vertical"},{label:"Horizontal",value:"horizontal"},{label:"Both",value:"both"}],oe={none:"Markdown is supported.",error:"This field is required.",success:"Looks good."},le=()=>{const[n,r]=s.useState("elevated"),[o,A]=s.useState("md"),[p,V]=s.useState("blue"),[g,I]=s.useState(B),[x,L]=s.useState("none"),[f,F]=s.useState("vertical"),[j,R]=s.useState(!0),[b,G]=s.useState(!0),[w,M]=s.useState(!0),[v,O]=s.useState(!1),[c,D]=s.useState(!1),[y,P]=s.useState("classic"),[T,E]=s.useState("medium"),[S,H]=s.useState("frosted"),[q,_]=s.useState("");return e.jsx(Y,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(X,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Variant",options:Z,value:n,onChange:a=>r(a)}),e.jsx(h,{label:"Size",options:ee,value:o,onChange:a=>A(a)}),e.jsx(J,{label:"Tone",children:e.jsx(U,{selectable:!0,size:"sm",value:p,onSelect:V,defaultExpanded:!0})})]})},...n==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(m,{label:"Glow intensity",options:te,value:g,onChange:a=>I(a)})}]:[],...c?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Specular",options:ne,value:y,onChange:a=>P(a)}),e.jsx(h,{label:"Vibrancy",options:ae,value:T,onChange:a=>E(a)}),e.jsx(h,{label:"Glass opacity",options:se,value:S,onChange:a=>H(a)})]})}]:[],{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Validation",options:ie,value:x,onChange:a=>L(a)}),e.jsx(h,{label:"Resize",options:re,value:f,onChange:a=>F(a)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(u,{label:"Label",checked:j,onChange:R}),e.jsx(u,{label:"Help text",checked:b,onChange:G}),e.jsx(u,{label:"Character count",checked:w,onChange:M}),e.jsx(u,{label:"Disabled",checked:v,onChange:O}),e.jsx(u,{label:"On a glass panel",checked:c,onChange:D})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The counter is digits-only ",e.jsx("code",{children:"used/maxLength"})," and turns rose at the limit; help text is ",e.jsx("em",{children:"wired"})," to the field with"," ",e.jsx("code",{children:"aria-describedby"})," and its colour follows the validation state, so the error says ",e.jsx("em",{children:"why"})," in the screen reader’s announcement, not just in the border colour. No event log here — the only callbacks are the native ",e.jsx("code",{children:"onChange"})," /"," ",e.jsx("code",{children:"onFocus"})," the ",e.jsx("code",{children:"<textarea>"})," already speaks."]})]}),preview:e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(K,{variant:c?"liquid-glass":"outlined",tone:c?p:"neutral",specularMode:c?y:"none",vibrancy:T,glassOpacity:S,padding:"md",children:e.jsx(i,{size:o,variant:n,tone:p,validationStatus:x,resize:f,disabled:v,label:j?"Description":void 0,helpText:b?oe[x]:void 0,showCount:w,maxLength:200,glowIntensity:g,value:q,onChange:a=>_(a.target.value),placeholder:"Enter your text here…"})})})})};function de(){const[n,r]=s.useState("A short intro shown on your profile.");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(i,{label:"Description",helpText:"Markdown is supported.",maxLength:200,showCount:!0,value:n,onChange:o=>r(o.target.value),placeholder:"Tell people about yourself…"})})}const ce=`import { useState } from "react";
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
`;function he(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:W.map(n=>e.jsx(i,{size:"sm",variant:n,resize:"none",label:n,placeholder:`${n} variant`},n))})}const ue=`import { INPUT_VARIANTS, Textarea } from "@cjlapao/ui-kit";

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
`,pe=[{status:"none",help:"Markdown is supported."},{status:"error",help:"This field is required."},{status:"success",help:"Looks good."}];function xe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:pe.map(({status:n,help:r})=>e.jsx(i,{size:"sm",resize:"none",validationStatus:n,helpText:r,defaultValue:n==="none"?"":"Some entered text"},n))})}const me=`import { Textarea } from "@cjlapao/ui-kit";
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
`,ge=["none","vertical","horizontal","both"];function fe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:ge.map(n=>e.jsx(i,{size:"sm",resize:n,label:n,placeholder:"Drag the corner to resize"},n))})}const je=`import { Textarea } from "@cjlapao/ui-kit";
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
`;function be(){const[n,r]=s.useState("A bio with a hard limit of 120 characters.");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(i,{label:"Bio",helpText:"The counter turns red once you hit the limit.",maxLength:120,showCount:!0,value:n,onChange:o=>r(o.target.value)})})}const we=`import { useState } from "react";
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
`;function ve(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(i,{variant:"gradient",size:"sm",resize:"none",tone:"indigo",glowIntensity:"soft",label:"soft",placeholder:"A gentle glow"}),e.jsx(i,{variant:"gradient",size:"sm",resize:"none",tone:"indigo",glowIntensity:"strong",label:"strong",placeholder:"A bold glow"})]})}const ye=`import { Textarea } from "@cjlapao/ui-kit";

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
`,Ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($,{name:"Textarea",description:"A multi-line text input with the same surfaces, sizes and focus treatment as Input, plus a built-in label, status-aware help text and a character counter. Help text is linked to the field with aria-describedby, and its colour follows the validation state."}),e.jsx(le,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Description field",description:"The everyday form field: label, help text and a live `used / maxLength` counter under the control.",code:ce,filename:"Description.tsx",children:e.jsx(de,{})}),e.jsx(l,{title:"All variants",description:"The shared input variant set — `flat`, `elevated`, `ghost`, `underline`, `glass`, `gradient` — so a Textarea never looks out of place next to an Input.",code:ue,filename:"Variants.tsx",children:e.jsx(he,{})}),e.jsx(l,{title:"Validation states",description:"`validationStatus` tints the border and ring, and the help text under the field follows the state — error in rose, success in emerald.",code:me,filename:"ValidationStates.tsx",children:e.jsx(xe,{})}),e.jsx(l,{title:"Resize modes",description:"`resize` maps straight onto the CSS resize property — `none`, `vertical` (default), `horizontal` or `both`.",code:je,filename:"ResizeModes.tsx",children:e.jsx(fe,{})}),e.jsx(l,{title:"Character count",description:"`showCount` needs `maxLength`; the counter turns red the moment the value hits the limit.",code:we,filename:"CharacterCount.tsx",children:e.jsx(be,{})}),e.jsx(l,{title:"Gradient glow",description:"The gradient variant glows with a two-lobe shadow — the tone's 600 shade from the left, its 400 from the right — brightening on focus; `glowIntensity` sets the shadow's geometry.",code:ye,filename:"GradientGlow.tsx",children:e.jsx(ve,{})})]}),e.jsx(Q,{props:[{name:"size",type:'"xs" | "sm" | "md" | "lg" | "xl"',default:'"md"',description:"Control height and padding, on the shared size scale."},{name:"variant",type:'"flat" | "elevated" | "ghost" | "underline" | "glass" | "gradient"',default:'"elevated"',description:"Surface treatment, identical to Input's variant set."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Accent colour of the focus indicator."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'"none"',description:"Tints border, ring and help text; error also sets aria-invalid."},{name:"resize",type:'"none" | "vertical" | "horizontal" | "both"',default:'"vertical"',description:"Maps straight onto the CSS resize property."},{name:"label",type:"ReactNode",description:"Rendered above the control, wired with htmlFor to a generated id."},{name:"helpText",type:"ReactNode",description:"Shown under the field and linked with aria-describedby."},{name:"showCount",type:"boolean",default:"false",description:"used/maxLength counter under the field; needs maxLength. Turns red at the limit."},{name:"maxLength",type:"number",description:"Hard character limit; enables the counter when paired with showCount."},{name:"fullWidth",type:"boolean",default:"true",description:"Stretch to the container's full width."},{name:"gradientFrom",type:"string",description:"Gradient glow start colour. Defaults to the tone's 600 shade."},{name:"gradientTo",type:"string",description:"Gradient glow end colour. Defaults to the tone's 400 shade."},{name:"glowIntensity",type:'"subtle" | "soft" | "medium" | "strong"',default:'"subtle"',description:"How prominent the gradient glow is."},{name:"…rest",type:"React.TextareaHTMLAttributes",description:"Everything else (id, placeholder, dir, aria-*, value/defaultValue, handlers) spreads onto the native <textarea>."}]}),e.jsxs(C,{children:[e.jsxs(d,{title:"Screen reader",children:[e.jsxs("p",{children:[e.jsx(t,{children:"Textarea"})," renders a native ",e.jsx(t,{children:"<textarea>"})," element, so it already carries the implicit textbox role and every screen reader's native announcement. What the field is ",e.jsx("em",{children:"for"})," has to come from you, and there are three equally good ways to say it: the ",e.jsx(t,{children:"label"})," ","prop (wired to the control with ",e.jsx(t,{children:"htmlFor"})," and a generated id), a separate ",e.jsx(t,{children:"<label htmlFor>"})," paired with an ",e.jsx(t,{children:"id"})," you pass, or ",e.jsx(t,{children:"aria-labelledby"})," / ",e.jsx(t,{children:"aria-label"})," when the name lives in another element. Help text is announced automatically — it is linked with ",e.jsx(t,{children:"aria-describedby"})," — and"," ",e.jsx(t,{children:'validationStatus="error"'})," sets ",e.jsx(t,{children:"aria-invalid"})," so the error rides along with the field name."]}),e.jsx(k,{filename:"Labeling.tsx",code:N})]}),e.jsxs(d,{title:"Keyboard support",children:[e.jsx("p",{children:"The component adds no key handling of its own — everything below is the native element doing its job, which is exactly what screen reader and power users expect from a multi-line field."}),e.jsx(z,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Moves focus to the field."})},{keys:["shift","tab"],action:e.jsx(e.Fragment,{children:"Moves focus out of the field, backwards."})},{keys:["enter"],action:e.jsxs(e.Fragment,{children:["Inserts a newline — multi-line by design, nothing is submitted (submit is the enclosing ",e.jsx(t,{children:"<form>"}),"'s business)."]})},{keys:["↑","↓"],action:e.jsx(e.Fragment,{children:"Moves the caret — native selection and editing keys all work."})}]})]}),e.jsx(d,{title:"Internationalization",children:e.jsxs("p",{children:["The component itself speaks no strings: ",e.jsx(t,{children:"label"}),", ",e.jsx(t,{children:"helpText"}),","," ",e.jsx(t,{children:"placeholder"})," and any ARIA names are props you feed from your translations. The character counter is the only text it draws, and it is digits only (",e.jsx(t,{children:"12/200"}),", tabular figures), so nothing there needs localising. Text direction comes from the document — pass"," ",e.jsx(t,{children:"dir"})," like any other prop and it lands on the"," ",e.jsx(t,{children:"<textarea>"}),"."]})})]}),e.jsxs(C,{children:[e.jsxs(d,{title:"Screen reader",children:[e.jsxs("p",{children:[e.jsx(t,{children:"Textarea"})," renders a native ",e.jsx(t,{children:"<textarea>"})," element, so it already carries the implicit textbox role and every screen reader's native announcement. What the field is ",e.jsx("em",{children:"for"})," has to come from you, and there are three equally good ways to say it: the ",e.jsx(t,{children:"label"})," ","prop (wired to the control with ",e.jsx(t,{children:"htmlFor"})," and a generated id), a separate ",e.jsx(t,{children:"<label htmlFor>"})," paired with an ",e.jsx(t,{children:"id"})," you pass, or ",e.jsx(t,{children:"aria-labelledby"})," / ",e.jsx(t,{children:"aria-label"})," when the name lives in another element. Help text is announced automatically — it is linked with ",e.jsx(t,{children:"aria-describedby"})," — and"," ",e.jsx(t,{children:'validationStatus="error"'})," sets ",e.jsx(t,{children:"aria-invalid"})," so the error rides along with the field name."]}),e.jsx(k,{filename:"Labeling.tsx",code:N})]}),e.jsxs(d,{title:"Keyboard support",children:[e.jsx("p",{children:"The component adds no key handling of its own — everything below is the native element doing its job, which is exactly what screen reader and power users expect from a multi-line field."}),e.jsx(z,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Moves focus to the field."})},{keys:["shift","tab"],action:e.jsx(e.Fragment,{children:"Moves focus out of the field, backwards."})},{keys:["enter"],action:e.jsxs(e.Fragment,{children:["Inserts a newline — multi-line by design, nothing is submitted (submit is the enclosing ",e.jsx(t,{children:"<form>"}),"'s business)."]})},{keys:["↑","↓"],action:e.jsx(e.Fragment,{children:"Moves the caret — native selection and editing keys all work."})}]})]}),e.jsx(d,{title:"Internationalization",children:e.jsxs("p",{children:["The component itself speaks no strings: ",e.jsx(t,{children:"label"}),", ",e.jsx(t,{children:"helpText"}),","," ",e.jsx(t,{children:"placeholder"})," and any ARIA names are props you feed from your translations. The character counter is the only text it draws, and it is digits only (",e.jsx(t,{children:"12/200"}),", tabular figures), so nothing there needs localising. Text direction comes from the document — pass"," ",e.jsx(t,{children:"dir"})," like any other prop and it lands on the"," ",e.jsx(t,{children:"<textarea>"}),"."]})})]}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["The label is part of the component when you pass it — a real"," ",e.jsx(t,{children:"<label htmlFor>"})," against a generated id, no FormField required — and everything the wrapper does not claim spreads onto the native"," ",e.jsx(t,{children:"<textarea>"}),", which is also what ",e.jsx(t,{children:"forwardRef"})," hands out."]})]}),N=`// The built-in way — label element wired to the control with a generated id.
<Textarea label="Address" />

// Or bring your own label element, with an id you control.
<label htmlFor="address-2">Address</label>
<Textarea id="address-2" />

// Or name it from another element — or directly.
<Textarea aria-labelledby="address-summary" />
<Textarea aria-label="Address" />
`;export{Ve as TextareaPage,Ve as default};
