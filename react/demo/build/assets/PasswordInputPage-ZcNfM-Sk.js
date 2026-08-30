import{r as t,j as e,P as E,E as l,F as s,I,o as R}from"./index-p9Bv1Pn1.js";import{P as $}from"./PageHeader-DCZtzAyX.js";import{E as g}from"./ExampleCard-BS13YSEO.js";import{P as A,S as i,C as w,T as d}from"./PlaygroundPanel-BDClNSzf.js";import{C as D}from"./ControlAccordion-CydkdljU.js";import{x as L,n as G,t as K,J as Z,K as _}from"./options-Bqu3_N-h.js";const B=()=>{const[n,r]=t.useState("flat"),[o,F]=t.useState("md"),[u,S]=t.useState("blue"),[c,P]=t.useState("none"),[h,k]=t.useState("soft"),[p,C]=t.useState("Your password"),[x,N]=t.useState(!1),[m,V]=t.useState(!1),[f,O]=t.useState(!1),[v,z]=t.useState(!1),[b,T]=t.useState(!0),[j,y]=t.useState("correct-horse-battery-staple");return e.jsx(A,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(D,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Variant",options:L,value:n,onChange:a=>r(a)}),e.jsx(i,{label:"Size",options:G,value:o,onChange:a=>F(a)}),e.jsx(i,{label:"Tone",options:K,value:u,onChange:a=>S(a)}),e.jsx(i,{label:"Validation",options:Z,value:c,onChange:a=>P(a)}),e.jsx(i,{label:"Glow intensity",options:_,value:h,onChange:a=>k(a)}),e.jsx(w,{label:"Placeholder",children:e.jsx("input",{value:p,onChange:a=>C(a.target.value),className:"w-full rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-xs dark:border-neutral-600"})})]})},{id:"states",title:"States",controls:e.jsx(w,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(d,{label:"Leading icon",checked:x,onChange:N}),e.jsx(d,{label:"Disabled",checked:m,onChange:V}),e.jsx(d,{label:"Read-only",checked:f,onChange:O}),e.jsx(d,{label:"On a glass panel",checked:v,onChange:z})]})})},{id:"behaviour",title:"Behaviour",controls:e.jsx(w,{label:"Password behaviour",children:e.jsx(d,{label:"Revealable",checked:b,onChange:T})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Every control above the last group is one the"," ",e.jsx("code",{children:"Input"})," playground has, and behaves identically —"," ",e.jsx("code",{children:"PasswordInput"})," is an ",e.jsx("code",{children:"Input"})," with a masked type and a reveal button. The toggle withdraws on"," ",e.jsx("strong",{children:"Disabled"})," and ",e.jsx("strong",{children:"Read-only"}),": a password the user cannot edit should not be readable back either."]})]}),preview:e.jsx("div",{className:v?"w-full max-w-sm rounded-2xl bg-gradient-to-br from-sky-300 via-violet-300 to-rose-300 p-6 dark:from-sky-800 dark:via-violet-800 dark:to-rose-800":"w-full max-w-sm",children:v?e.jsx(E,{variant:"glass",padding:"md",children:e.jsx(l,{variant:n,size:o,tone:u,validationStatus:c,glowIntensity:h,placeholder:p,leadingIcon:x?"Key":void 0,disabled:m,readOnly:f,revealable:b,value:j,onChange:a=>y(a.target.value)})}):e.jsx(l,{variant:n,size:o,tone:u,validationStatus:c,glowIntensity:h,placeholder:p,leadingIcon:x?"Key":void 0,disabled:m,readOnly:f,revealable:b,value:j,onChange:a=>y(a.target.value)})})})};function H(){const n=[{variant:"flat",label:"flat"},{variant:"elevated",label:"elevated"},{variant:"underline",label:"underline"}];return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[n.map(({variant:r,label:o})=>e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(s,{label:`Input — ${o}`,children:e.jsx(I,{variant:r,tone:"violet",placeholder:"text"})}),e.jsx(s,{label:`Password — ${o}`,children:e.jsx(l,{variant:r,tone:"violet",defaultValue:"hunter2"})})]},r)),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(s,{label:"Input — error",children:e.jsx(I,{validationStatus:"error",placeholder:"text"})}),e.jsx(s,{label:"Password — error",children:e.jsx(l,{validationStatus:"error",defaultValue:"hunter2"})})]})]})}const J=`import { FormField, Input, PasswordInput } from "@cjlapao/ui-kit";

/**
 * \`PasswordInput\` **is** an \`Input\` — same variants, sizes, tones, validation
 * treatment, icons and native attributes — with a masked type and a reveal
 * button in the trailing slot.
 *
 * Each row below pairs the two at identical settings. The field markup is
 * asserted to be byte-identical in the tests; the only differences you should
 * see are the mask and the eye.
 *
 * (In the Vue kit this was not true until recently: because
 * \`PasswordInputProps extends InputProps\`, Vue declared every Input prop on
 * PasswordInput and stripped it from \`$attrs\`, and the template forwarded only
 * \`$attrs\` — so \`size\`, \`variant\` and \`tone\` were silently dropped.)
 */
export default function AsInput() {
  const settings = [
    { variant: "flat", label: "flat" },
    { variant: "elevated", label: "elevated" },
    { variant: "underline", label: "underline" },
  ] as const;

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {settings.map(({ variant, label }) => (
        <div key={variant} className="grid grid-cols-2 gap-3">
          <FormField label={\`Input — \${label}\`}>
            <Input variant={variant} tone="violet" placeholder="text" />
          </FormField>
          <FormField label={\`Password — \${label}\`}>
            <PasswordInput variant={variant} tone="violet" defaultValue="hunter2" />
          </FormField>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Input — error">
          <Input validationStatus="error" placeholder="text" />
        </FormField>
        <FormField label="Password — error">
          <PasswordInput validationStatus="error" defaultValue="hunter2" />
        </FormField>
      </div>
    </div>
  );
}
`;function W(){return e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:R.map(n=>e.jsx(s,{label:n,children:e.jsx(l,{size:n,defaultValue:"hunter2"})},n))})}const Y=`import { CONTROL_SIZES, FormField, PasswordInput } from "@cjlapao/ui-kit";

/**
 * The reveal glyph now comes from the icon registry, so it scales with the
 * field. It used to be a raw icon component with a hardcoded \`w-4 h-4\`, which
 * stayed 16px at every size.
 *
 * \`Input\` draws no label of its own — \`FormField\` is the shell that does, and
 * it wires the label to the control for you.
 */
export default function Sizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {CONTROL_SIZES.map((size) => (
        <FormField key={size} label={size}>
          <PasswordInput size={size} defaultValue="hunter2" />
        </FormField>
      ))}
    </div>
  );
}
`;function q(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsx(s,{label:"Normal",children:e.jsx(l,{defaultValue:"hunter2"})}),e.jsx(s,{label:"Not revealable",children:e.jsx(l,{revealable:!1,defaultValue:"hunter2"})}),e.jsx(s,{label:"Disabled",children:e.jsx(l,{disabled:!0,defaultValue:"hunter2"})}),e.jsx(s,{label:"Read-only",children:e.jsx(l,{readOnly:!0,defaultValue:"hunter2"})})]})}const M=`import { FormField, PasswordInput } from "@cjlapao/ui-kit";

/**
 * The toggle is offered only where revealing makes sense. On a \`disabled\` or
 * \`readOnly\` field it used to stay live, so a password the user could not edit
 * could still be read back; \`revealable={false}\` opts out entirely.
 */
export default function States() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <FormField label="Normal">
        <PasswordInput defaultValue="hunter2" />
      </FormField>
      <FormField label="Not revealable">
        <PasswordInput revealable={false} defaultValue="hunter2" />
      </FormField>
      <FormField label="Disabled">
        <PasswordInput disabled defaultValue="hunter2" />
      </FormField>
      <FormField label="Read-only">
        <PasswordInput readOnly defaultValue="hunter2" />
      </FormField>
    </div>
  );
}
`,ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($,{name:"Password Input",description:"An Input that masks its value, with a reveal toggle in the trailing slot. It is the same control: every variant, size, tone, validation state, icon and native attribute behaves identically, and the field markup is asserted to match a bare Input at the same settings."}),e.jsx(B,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(g,{title:"It is an Input",description:"Each row pairs the two at identical settings. The field markup is byte-identical in the tests — the only differences you should see are the mask and the eye.",code:J,filename:"AsInput.tsx",children:e.jsx(H,{})}),e.jsx(g,{title:"Sizes",description:"The reveal glyph is a registry icon, so it scales with the field. It used to be a raw component with a hardcoded `w-4 h-4` that stayed 16px at every size.",code:Y,filename:"Sizes.tsx",children:e.jsx(W,{})}),e.jsx(g,{title:"When the toggle is offered",description:"Not on a disabled or read-only field — it used to stay live there, so a password the user could not edit could still be read back.",code:M,filename:"States.tsx",children:e.jsx(q,{})})]})]});export{ne as PasswordInputPage,ne as default};
