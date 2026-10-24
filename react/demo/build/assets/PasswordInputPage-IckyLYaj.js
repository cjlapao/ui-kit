import{r as a,j as e,P as G,C as Z,c7 as o,c6 as n,I as F,v as _}from"./index-gt012o8E.js";import{P as H,A as K,a as p,C as l}from"./A11ySections-zw3_3X-2.js";import{P as W}from"./PageHeader-CzVhyXQL.js";import{E as m}from"./ExampleCard-V3REeYJ5.js";import{P as M,C as u,a as S,T as r}from"./PlaygroundPanel-Czrs7oXC.js";import{C as Q}from"./ControlAccordion-DIXHht2n.js";import{u as U,E as Y}from"./EventLog-Dx0vbma4.js";import{x as B,d as J,Q as X,R as ee}from"./options-CtADNKbm.js";const te=()=>{const[s,i]=a.useState("flat"),[d,P]=a.useState("md"),[h,C]=a.useState("blue"),[x,N]=a.useState("none"),[f,T]=a.useState("subtle"),[b,V]=a.useState("Your password"),[v,O]=a.useState(!1),[g,z]=a.useState(!1),[w,E]=a.useState(!1),[y,j]=a.useState(!1),[c,R]=a.useState(!1),[I,A]=a.useState(!0),[L,$]=a.useState("correct-horse-battery-staple"),[D,q]=U(),k=e.jsx(o,{variant:s,size:d,tone:h,validationStatus:x,glowIntensity:f,placeholder:b,leadingIcon:v?"Key":void 0,disabled:g,readOnly:w,revealable:I,value:L,onChange:t=>$(t.target.value),onRevealedChange:t=>q(t?"revealed":"masked")});return e.jsx(M,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Variant",options:B,value:s,onChange:t=>i(t)}),e.jsx(u,{label:"Size",options:J,value:d,onChange:t=>P(t)}),e.jsx(S,{label:"Tone",children:e.jsx(Z,{selectable:!0,size:"sm",value:h,onSelect:C,defaultExpanded:!0})}),e.jsx(u,{label:"Validation",options:X,value:x,onChange:t=>N(t)}),e.jsx(S,{label:"Placeholder",children:e.jsx("input",{value:b,onChange:t=>V(t.target.value),className:"w-full rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-xs dark:border-neutral-600"})})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Leading icon",checked:v,onChange:O}),e.jsx(r,{label:"Revealable",checked:I,onChange:A}),e.jsx(r,{label:"Disabled",checked:g,onChange:z}),e.jsx(r,{label:"Read-only",checked:w,onChange:E})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"In a panel",checked:y,onChange:j}),e.jsx(r,{label:"On a glass panel",checked:c,onChange:t=>{R(t),t&&j(!0)}})]})},...s==="gradient"||c?[{id:"glow",title:"Glow",controls:e.jsx(u,{label:"Intensity",options:ee,value:f,onChange:t=>T(t)})}]:[]]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Every control above the reveal toggle is one the ",e.jsx("code",{children:"Input"})," ","playground has, and behaves identically — ",e.jsx("code",{children:"PasswordInput"})," ","is an ",e.jsx("code",{children:"Input"})," with a masked type and a reveal button. The toggle withdraws on ",e.jsx("strong",{children:"Disabled"})," and"," ",e.jsx("strong",{children:"Read-only"}),": a password the user cannot edit should not be readable back either. What the event log shows is the toggle firing — never the secret being typed."]}),e.jsx(Y,{log:D,emptyText:"No events yet — reveal and hide report here."})]}),preview:e.jsx("div",{className:"w-full",children:y?e.jsx(G,{corner:"none",variant:c?"liquid-glass":"outlined",tone:c?h:"neutral",padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full max-w-sm py-2",children:k})}):e.jsx("div",{className:"mx-auto w-full max-w-sm py-2",children:k})})})};function ae(){const s=[{variant:"flat",label:"flat"},{variant:"elevated",label:"elevated"},{variant:"underline",label:"underline"}];return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[s.map(({variant:i,label:d})=>e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(n,{label:`Input — ${d}`,children:e.jsx(F,{variant:i,tone:"violet",placeholder:"text"})}),e.jsx(n,{label:`Password — ${d}`,children:e.jsx(o,{variant:i,tone:"violet",defaultValue:"hunter2"})})]},i)),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(n,{label:"Input — error",children:e.jsx(F,{validationStatus:"error",placeholder:"text"})}),e.jsx(n,{label:"Password — error",children:e.jsx(o,{validationStatus:"error",defaultValue:"hunter2"})})]})]})}const se=`import { FormField, Input, PasswordInput } from "@cjlapao/ui-kit";

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
            <PasswordInput
              variant={variant}
              tone="violet"
              defaultValue="hunter2"
            />
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
`;function ne(){return e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:_.map(s=>e.jsx(n,{label:s,children:e.jsx(o,{size:s,defaultValue:"hunter2"})},s))})}const le=`import { CONTROL_SIZES, FormField, PasswordInput } from "@cjlapao/ui-kit";

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
`;function oe(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsx(n,{label:"Normal",children:e.jsx(o,{defaultValue:"hunter2"})}),e.jsx(n,{label:"Not revealable",children:e.jsx(o,{revealable:!1,defaultValue:"hunter2"})}),e.jsx(n,{label:"Disabled",children:e.jsx(o,{disabled:!0,defaultValue:"hunter2"})}),e.jsx(n,{label:"Read-only",children:e.jsx(o,{readOnly:!0,defaultValue:"hunter2"})})]})}const re=`import { FormField, PasswordInput } from "@cjlapao/ui-kit";

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
`,fe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(W,{name:"Password Input",description:"An Input that masks its value, with a reveal toggle in the trailing slot. It is the same control: every variant, size, tone, validation state, icon and native attribute behaves identically, and the field markup is asserted to match a bare Input at the same settings."}),e.jsx(te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(m,{title:"It is an Input",description:"Each row pairs the two at identical settings. The field markup is byte-identical in the tests — the only differences you should see are the mask and the eye.",code:se,filename:"AsInput.tsx",children:e.jsx(ae,{})}),e.jsx(m,{title:"Sizes",description:"The reveal glyph is a registry icon, so it scales with the field. It used to be a raw component with a hardcoded `w-4 h-4` that stayed 16px at every size.",code:le,filename:"Sizes.tsx",children:e.jsx(ne,{})}),e.jsx(m,{title:"When the toggle is offered",description:"Not on a disabled or read-only field — it used to stay live there, so a password the user could not edit could still be read back.",code:re,filename:"States.tsx",children:e.jsx(oe,{})})]}),e.jsx(H,{props:[{name:"(Input props)",type:"InputProps",description:"Everything: `variant`, `size`, `tone`, `validationStatus`, the glow trio, icons, and every native attribute. The one omission is `type` — this component owns it, since &ldquo;mask it&rdquo; *is* the component. Markup is asserted byte-identical to a bare `Input` at the same settings, so a styling bug can&rsquo;t live here."},{name:"revealable",type:"boolean",default:"true",description:"Offer the toggle at all — off for a secret that should never read back (a key being re-entered). Also withdrawn by `disabled` and `readOnly`, which used to leave the mask off while the field itself was locked."},{name:"revealed",type:"boolean",description:"Controlled reveal state. Omit for uncontrolled — the component keeps its own flag and the eye just flips it."},{name:"onRevealedChange",type:"(revealed: boolean) => void",description:"Fires on every flip — the only callback the toggle has. Safe for a log: it reports the event, never the value."}]}),e.jsxs(K,{children:[e.jsx(p,{title:"Screen reader",children:e.jsxs("p",{children:["The mask is the browser’s job — ",e.jsx(l,{children:'type="password"'})," ","is what makes dots out of characters, and no assistive tech needs to be told more. The toggle is a real ",e.jsx(l,{children:"<button>"})," whose name describes the action it will take: “Show password” while masked, “Hide password” while revealed — so on refocus the name itself reports the state. It is deliberately not an"," ",e.jsx(l,{children:"aria-pressed"})," toggle button; a pressed state pairs with a static label, and the name-swap pattern avoids a “Show password, pressed” double-message. The accessible name comes from the kit’s catalogue, so it is the user’s language, not yours."]})}),e.jsx(p,{title:"Keyboard support",children:e.jsxs("p",{children:["There is nothing custom, which is the point: ",e.jsx(l,{children:"Tab"})," reaches the reveal button after the field, ",e.jsx(l,{children:"Enter"})," or ",e.jsx(l,{children:"Space"})," flips it, focus stays on the button either way, and the masked field behaves like every password field the browser knows — paste rules, autofill prompts, the lot. Revealing does not move focus, so the keyboard user sees the text where they left their hands."]})}),e.jsx(p,{title:"Internationalization",children:e.jsxs("p",{children:["Two strings, both in the kit catalogue: ",e.jsx(l,{children:"kit.passwordinput.show"})," ","and ",e.jsx(l,{children:"kit.passwordinput.hide"})," — the reveal button’s accessible name, flipped with the state. Everything else visible is the caller’s (placeholder, label) or the browser’s (autofill, the dots themselves). Under a non-English locale the button says “Passwort anzeigen”, not “Show password” — an untranslated eye-button is a screen-reader bug, not a cosmetic one, so the key is asserted in the tests."]})})]})]});export{fe as PasswordInputPage,fe as default};
