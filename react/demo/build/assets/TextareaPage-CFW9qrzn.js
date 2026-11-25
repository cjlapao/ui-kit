import{r as a,gw as U,j as e,P as W,f9 as i,C as $,g as Y}from"./index-CQwZVYnB.js";import{P as J}from"./PageHeader-BhZxEVHt.js";import{E as l}from"./ExampleCard-BZsKA5_g.js";import{P as Q,A as k,a as d,C as t,b as z,K as N}from"./A11ySections-BXfanEck.js";import{P as X,S as m,C as h,a as Z,T as u}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as ee}from"./ControlAccordion-C7vC6faF.js";import{H as te}from"./HueControl-B9PfQcfP.js";import{I as ne,c as ae,a0 as se,A as ie,B as oe,C as re,$ as le}from"./options-Byh1yOHz.js";const de=[{label:"None",value:"none"},{label:"Vertical",value:"vertical"},{label:"Horizontal",value:"horizontal"},{label:"Both",value:"both"}],ce={none:"Markdown is supported.",error:"This field is required.",success:"Looks good."},he=()=>{const[n,o]=a.useState("elevated"),[r,V]=a.useState("md"),[p,I]=a.useState("blue"),[g,L]=a.useState(void 0),[f,F]=a.useState(U),[x,G]=a.useState("none"),[b,M]=a.useState("vertical"),[j,R]=a.useState(!0),[w,O]=a.useState(!0),[v,D]=a.useState(!0),[y,P]=a.useState(!1),[c,E]=a.useState(!1),[T,H]=a.useState("classic"),[C,q]=a.useState("medium"),[S,B]=a.useState("frosted"),[_,K]=a.useState("");return e.jsx(X,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ee,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Variant",options:ne,value:n,onChange:s=>o(s)}),e.jsx(h,{label:"Size",options:ae,value:r,onChange:s=>V(s)}),e.jsx(Z,{label:"Tone",children:e.jsx($,{selectable:!0,size:"sm",value:p,onSelect:I,defaultExpanded:!0})}),e.jsx(te,{label:"Fill hue",value:g,onChange:L,autoLabel:"None — the variant’s own fill"})]})},...n==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(m,{label:"Glow intensity",options:se,value:f,onChange:s=>F(s)})}]:[],...c?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Specular",options:ie,value:T,onChange:s=>H(s)}),e.jsx(h,{label:"Vibrancy",options:oe,value:C,onChange:s=>q(s)}),e.jsx(h,{label:"Glass opacity",options:re,value:S,onChange:s=>B(s)})]})}]:[],{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Validation",options:le,value:x,onChange:s=>G(s)}),e.jsx(h,{label:"Resize",options:de,value:b,onChange:s=>M(s)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(u,{label:"Label",checked:j,onChange:R}),e.jsx(u,{label:"Help text",checked:w,onChange:O}),e.jsx(u,{label:"Character count",checked:v,onChange:D}),e.jsx(u,{label:"Disabled",checked:y,onChange:P}),e.jsx(u,{label:"On a glass panel",checked:c,onChange:E})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The counter is digits-only ",e.jsx("code",{children:"used/maxLength"})," and turns rose at the limit; help text is ",e.jsx("em",{children:"wired"})," to the field with"," ",e.jsx("code",{children:"aria-describedby"})," and its colour follows the validation state, so the error says ",e.jsx("em",{children:"why"})," in the screen reader’s announcement, not just in the border colour. No event log here — the only callbacks are the native ",e.jsx("code",{children:"onChange"})," /"," ",e.jsx("code",{children:"onFocus"})," the ",e.jsx("code",{children:"<textarea>"})," already speaks."]})]}),preview:e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(W,{variant:c?"liquid-glass":"outlined",tone:c?p:"neutral",specularMode:c?T:"none",vibrancy:C,glassOpacity:S,padding:"md",children:e.jsx(i,{size:r,variant:n,tone:p,backgroundColor:g,validationStatus:x,resize:b,disabled:y,label:j?"Description":void 0,helpText:w?ce[x]:void 0,showCount:v,maxLength:200,glowIntensity:f,value:_,onChange:s=>K(s.target.value),placeholder:"Enter your text here…"})})})})};function ue(){const[n,o]=a.useState("A short intro shown on your profile.");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(i,{label:"Description",helpText:"Markdown is supported.",maxLength:200,showCount:!0,value:n,onChange:r=>o(r.target.value),placeholder:"Tell people about yourself…"})})}const pe=`import { useState } from "react";
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
`;function xe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:Y.map(n=>e.jsx(i,{size:"sm",variant:n,resize:"none",label:n,placeholder:`${n} variant`},n))})}const me=`import { INPUT_VARIANTS, Textarea } from "@cjlapao/ui-kit";

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
`,ge=[{status:"none",help:"Markdown is supported."},{status:"error",help:"This field is required."},{status:"success",help:"Looks good."}];function fe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:ge.map(({status:n,help:o})=>e.jsx(i,{size:"sm",resize:"none",validationStatus:n,helpText:o,defaultValue:n==="none"?"":"Some entered text"},n))})}const be=`import { Textarea } from "@cjlapao/ui-kit";
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
`,je=["none","vertical","horizontal","both"];function we(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:je.map(n=>e.jsx(i,{size:"sm",resize:n,label:n,placeholder:"Drag the corner to resize"},n))})}const ve=`import { Textarea } from "@cjlapao/ui-kit";
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
`;function ye(){const[n,o]=a.useState("A bio with a hard limit of 120 characters.");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(i,{label:"Bio",helpText:"The counter turns red once you hit the limit.",maxLength:120,showCount:!0,value:n,onChange:r=>o(r.target.value)})})}const Te=`import { useState } from "react";
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
`;function Ce(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(i,{variant:"gradient",size:"sm",resize:"none",tone:"indigo",glowIntensity:"soft",label:"soft",placeholder:"A gentle glow"}),e.jsx(i,{variant:"gradient",size:"sm",resize:"none",tone:"indigo",glowIntensity:"strong",label:"strong",placeholder:"A bold glow"})]})}const Se=`import { Textarea } from "@cjlapao/ui-kit";

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
`,Ge=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(J,{name:"Textarea",description:"A multi-line text input with the same surfaces, sizes and focus treatment as Input, plus a built-in label, status-aware help text and a character counter. Help text is linked to the field with aria-describedby, and its colour follows the validation state."}),e.jsx(he,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Description field",description:"The everyday form field: label, help text and a live `used / maxLength` counter under the control.",code:pe,filename:"Description.tsx",children:e.jsx(ue,{})}),e.jsx(l,{title:"All variants",description:"The shared input variant set — `flat`, `elevated`, `ghost`, `underline`, `glass`, `gradient` — so a Textarea never looks out of place next to an Input.",code:me,filename:"Variants.tsx",children:e.jsx(xe,{})}),e.jsx(l,{title:"Validation states",description:"`validationStatus` tints the border and ring, and the help text under the field follows the state — error in rose, success in emerald.",code:be,filename:"ValidationStates.tsx",children:e.jsx(fe,{})}),e.jsx(l,{title:"Resize modes",description:"`resize` maps straight onto the CSS resize property — `none`, `vertical` (default), `horizontal` or `both`.",code:ve,filename:"ResizeModes.tsx",children:e.jsx(we,{})}),e.jsx(l,{title:"Character count",description:"`showCount` needs `maxLength`; the counter turns red the moment the value hits the limit.",code:Te,filename:"CharacterCount.tsx",children:e.jsx(ye,{})}),e.jsx(l,{title:"Gradient glow",description:"The gradient variant glows with a two-lobe shadow — the tone's 600 shade from the left, its 400 from the right — brightening on focus; `glowIntensity` sets the shadow's geometry.",code:Se,filename:"GradientGlow.tsx",children:e.jsx(Ce,{})})]}),e.jsx(Q,{props:[{name:"size",type:'"xs" | "sm" | "md" | "lg" | "xl"',default:'"md"',description:"Control height and padding, on the shared size scale."},{name:"variant",type:'"flat" | "elevated" | "ghost" | "underline" | "glass" | "gradient"',default:'"elevated"',description:"Surface treatment, identical to Input's variant set."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Accent colour of the focus indicator."},{name:"backgroundColor",type:"TrueColor",default:'"none"',description:"The hue the fill wears when it should disagree with tone — the focus border, ring, icons and the gradient glow keep following tone, so a rose-filled field still focuses blue. Each variant paints that fill with its own recipe rather than one fixed tone step (glass stays sheer, gradient keeps its blur); underline has no box to paint, so there it is a no-op, and neutral restores the variant's own resting fill."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'"none"',description:"Tints border, ring and help text; error also sets aria-invalid."},{name:"resize",type:'"none" | "vertical" | "horizontal" | "both"',default:'"vertical"',description:"Maps straight onto the CSS resize property."},{name:"label",type:"ReactNode",description:"Rendered above the control, wired with htmlFor to a generated id."},{name:"helpText",type:"ReactNode",description:"Shown under the field and linked with aria-describedby."},{name:"showCount",type:"boolean",default:"false",description:"used/maxLength counter under the field; needs maxLength. Turns red at the limit."},{name:"maxLength",type:"number",description:"Hard character limit; enables the counter when paired with showCount."},{name:"fullWidth",type:"boolean",default:"true",description:"Stretch to the container's full width."},{name:"gradientFrom",type:"string",description:"Gradient glow start colour. Defaults to the tone's 600 shade."},{name:"gradientTo",type:"string",description:"Gradient glow end colour. Defaults to the tone's 400 shade."},{name:"glowIntensity",type:'"subtle" | "soft" | "medium" | "strong"',default:'"subtle"',description:"How prominent the gradient glow is."},{name:"…rest",type:"React.TextareaHTMLAttributes",description:"Everything else (id, placeholder, dir, aria-*, value/defaultValue, handlers) spreads onto the native <textarea>."}]}),e.jsxs(k,{children:[e.jsxs(d,{title:"Screen reader",children:[e.jsxs("p",{children:[e.jsx(t,{children:"Textarea"})," renders a native ",e.jsx(t,{children:"<textarea>"})," element, so it already carries the implicit textbox role and every screen reader's native announcement. What the field is ",e.jsx("em",{children:"for"})," has to come from you, and there are three equally good ways to say it: the ",e.jsx(t,{children:"label"})," ","prop (wired to the control with ",e.jsx(t,{children:"htmlFor"})," and a generated id), a separate ",e.jsx(t,{children:"<label htmlFor>"})," paired with an ",e.jsx(t,{children:"id"})," you pass, or ",e.jsx(t,{children:"aria-labelledby"})," / ",e.jsx(t,{children:"aria-label"})," when the name lives in another element. Help text is announced automatically — it is linked with ",e.jsx(t,{children:"aria-describedby"})," — and"," ",e.jsx(t,{children:'validationStatus="error"'})," sets ",e.jsx(t,{children:"aria-invalid"})," so the error rides along with the field name."]}),e.jsx(z,{filename:"Labeling.tsx",code:A})]}),e.jsxs(d,{title:"Keyboard support",children:[e.jsx("p",{children:"The component adds no key handling of its own — everything below is the native element doing its job, which is exactly what screen reader and power users expect from a multi-line field."}),e.jsx(N,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Moves focus to the field."})},{keys:["shift","tab"],action:e.jsx(e.Fragment,{children:"Moves focus out of the field, backwards."})},{keys:["enter"],action:e.jsxs(e.Fragment,{children:["Inserts a newline — multi-line by design, nothing is submitted (submit is the enclosing ",e.jsx(t,{children:"<form>"}),"'s business)."]})},{keys:["↑","↓"],action:e.jsx(e.Fragment,{children:"Moves the caret — native selection and editing keys all work."})}]})]}),e.jsx(d,{title:"Internationalization",children:e.jsxs("p",{children:["The component itself speaks no strings: ",e.jsx(t,{children:"label"}),", ",e.jsx(t,{children:"helpText"}),","," ",e.jsx(t,{children:"placeholder"})," and any ARIA names are props you feed from your translations. The character counter is the only text it draws, and it is digits only (",e.jsx(t,{children:"12/200"}),", tabular figures), so nothing there needs localising. Text direction comes from the document — pass"," ",e.jsx(t,{children:"dir"})," like any other prop and it lands on the"," ",e.jsx(t,{children:"<textarea>"}),"."]})})]}),e.jsxs(k,{children:[e.jsxs(d,{title:"Screen reader",children:[e.jsxs("p",{children:[e.jsx(t,{children:"Textarea"})," renders a native ",e.jsx(t,{children:"<textarea>"})," element, so it already carries the implicit textbox role and every screen reader's native announcement. What the field is ",e.jsx("em",{children:"for"})," has to come from you, and there are three equally good ways to say it: the ",e.jsx(t,{children:"label"})," ","prop (wired to the control with ",e.jsx(t,{children:"htmlFor"})," and a generated id), a separate ",e.jsx(t,{children:"<label htmlFor>"})," paired with an ",e.jsx(t,{children:"id"})," you pass, or ",e.jsx(t,{children:"aria-labelledby"})," / ",e.jsx(t,{children:"aria-label"})," when the name lives in another element. Help text is announced automatically — it is linked with ",e.jsx(t,{children:"aria-describedby"})," — and"," ",e.jsx(t,{children:'validationStatus="error"'})," sets ",e.jsx(t,{children:"aria-invalid"})," so the error rides along with the field name."]}),e.jsx(z,{filename:"Labeling.tsx",code:A})]}),e.jsxs(d,{title:"Keyboard support",children:[e.jsx("p",{children:"The component adds no key handling of its own — everything below is the native element doing its job, which is exactly what screen reader and power users expect from a multi-line field."}),e.jsx(N,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Moves focus to the field."})},{keys:["shift","tab"],action:e.jsx(e.Fragment,{children:"Moves focus out of the field, backwards."})},{keys:["enter"],action:e.jsxs(e.Fragment,{children:["Inserts a newline — multi-line by design, nothing is submitted (submit is the enclosing ",e.jsx(t,{children:"<form>"}),"'s business)."]})},{keys:["↑","↓"],action:e.jsx(e.Fragment,{children:"Moves the caret — native selection and editing keys all work."})}]})]}),e.jsx(d,{title:"Internationalization",children:e.jsxs("p",{children:["The component itself speaks no strings: ",e.jsx(t,{children:"label"}),", ",e.jsx(t,{children:"helpText"}),","," ",e.jsx(t,{children:"placeholder"})," and any ARIA names are props you feed from your translations. The character counter is the only text it draws, and it is digits only (",e.jsx(t,{children:"12/200"}),", tabular figures), so nothing there needs localising. Text direction comes from the document — pass"," ",e.jsx(t,{children:"dir"})," like any other prop and it lands on the"," ",e.jsx(t,{children:"<textarea>"}),"."]})})]}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["The label is part of the component when you pass it — a real"," ",e.jsx(t,{children:"<label htmlFor>"})," against a generated id, no FormField required — and everything the wrapper does not claim spreads onto the native"," ",e.jsx(t,{children:"<textarea>"}),", which is also what ",e.jsx(t,{children:"forwardRef"})," hands out."]})]}),A=`// The built-in way — label element wired to the control with a generated id.
<Textarea label="Address" />

// Or bring your own label element, with an id you control.
<label htmlFor="address-2">Address</label>
<Textarea id="address-2" />

// Or name it from another element — or directly.
<Textarea aria-labelledby="address-summary" />
<Textarea aria-label="Address" />
`;export{Ge as TextareaPage,Ge as default};
