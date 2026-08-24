import{r as l,j as e,P as L,I as a,M as p,F as r,n as R,k as G,y as b}from"./index-BqiwG-pR.js";import{P as U,S as I,C as o,T as i,a as _,E as t}from"./PlaygroundPanel-DuiPtEP5.js";import{w as W,n as D,I as q,t as B,J as Z}from"./options-CD99P1yv.js";const K=()=>{const[s,S]=l.useState("flat"),[h,T]=l.useState("md"),[d,C]=l.useState("blue"),[x,F]=l.useState("none"),[m,y]=l.useState("soft"),[f,k]=l.useState("ada@example.com"),[N,g]=l.useState(""),[j,P]=l.useState(!1),[c,z]=l.useState(!1),[v,E]=l.useState(!1),[w,O]=l.useState(!1),[u,V]=l.useState(!1);return e.jsx(U,{controls:e.jsxs(e.Fragment,{children:[e.jsx(I,{label:"Variant",options:W,value:s,onChange:n=>S(n)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(o,{label:"Size",children:e.jsx(p,{fullWidth:!0,size:"sm",options:D,value:h,onChange:n=>T(n)})}),e.jsx(o,{label:"Validation",children:e.jsx(p,{fullWidth:!0,size:"sm",options:q,value:x,onChange:n=>F(n)})})]}),e.jsx(I,{label:"Tone",options:B,value:d,onChange:n=>C(n)}),e.jsx(o,{label:"Placeholder",children:e.jsx(a,{size:"sm",value:f,onChange:n=>k(n.target.value)})}),s==="gradient"&&e.jsx(o,{label:"Glow intensity",children:e.jsx(p,{fullWidth:!0,size:"sm",options:Z,value:m,onChange:n=>y(n)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Leading icon",checked:j,onChange:P}),e.jsx(i,{label:"Trailing icon",checked:c,onChange:z}),e.jsx(i,{label:"Trailing is a button",checked:v,onChange:E}),e.jsx(i,{label:"Disabled",checked:w,onChange:O}),e.jsx(i,{label:"On a glass panel",checked:u,onChange:V})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The surface sits on the field's wrapper, not the"," ",e.jsx("code",{children:"<input>"})," — same structure as"," ",e.jsx("strong",{children:"SearchBar"}),", so icons are flex siblings. The focus ring is ",e.jsx("code",{children:"ring-inset"}),": an outer ring is painted outside the border box and any scrolling ancestor clips it."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(L,{variant:u?"liquid-glass":"outlined",tone:u?d:"neutral",padding:"md",children:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(a,{variant:s,size:h,tone:d,validationStatus:x,glowIntensity:m,placeholder:f,value:N,onChange:n=>g(n.target.value),leadingIcon:j?"Search":void 0,trailingIcon:c?"Info":void 0,onTrailingIconClick:c&&v?()=>g(""):void 0,trailingIconLabel:"Clear the field",disabled:w})})})})})};function M(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(a,{variant:"flat",placeholder:"Flat"}),e.jsx(a,{variant:"elevated",placeholder:"Elevated"}),e.jsx(a,{variant:"ghost",placeholder:"Ghost"}),e.jsx(a,{variant:"underline",placeholder:"Underline"}),e.jsx(a,{variant:"glass",placeholder:"Glass"}),e.jsx(a,{variant:"gradient",placeholder:"Gradient"})]})}const Y=`import { Input } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input variant="flat" placeholder="Flat" />
      <Input variant="elevated" placeholder="Elevated" />
      <Input variant="ghost" placeholder="Ghost" />
      <Input variant="underline" placeholder="Underline" />
      <Input variant="glass" placeholder="Glass" />
      <Input variant="gradient" placeholder="Gradient" />
    </div>
  );
}
`;function $(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(r,{label:"Workspace name",description:"This is how the workspace appears to every member.",children:e.jsx(a,{placeholder:"acme-inc"})}),e.jsx(r,{label:"Search",hint:"Tip: use quotes for exact matches.",children:e.jsx(a,{placeholder:"Search projects…",leadingIcon:"Search"})})]})}const A=`import { FormField, Input } from "@cjlapao/ui-kit";

export default function Labeled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FormField
        label="Workspace name"
        description="This is how the workspace appears to every member."
      >
        <Input placeholder="acme-inc" />
      </FormField>
      <FormField label="Search" hint="Tip: use quotes for exact matches.">
        <Input placeholder="Search projects…" leadingIcon="Search" />
      </FormField>
    </div>
  );
}
`;function H(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(r,{label:"Email",error:"That address does not look valid.",children:e.jsx(a,{type:"email",defaultValue:"jane@",validationStatus:"error"})}),e.jsx(r,{label:"Username",helpText:"You can change this later.",children:e.jsx(a,{defaultValue:"jane-doe",validationStatus:"success"})})]})}const J=`import { FormField, Input } from "@cjlapao/ui-kit";

export default function Validation() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FormField label="Email" error="That address does not look valid.">
        <Input type="email" defaultValue="jane@" validationStatus="error" />
      </FormField>
      <FormField label="Username" helpText="You can change this later.">
        <Input defaultValue="jane-doe" validationStatus="success" />
      </FormField>
    </div>
  );
}
`;function Q(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(a,{placeholder:"Search",leadingIcon:"Search"}),e.jsx(a,{type:"password",placeholder:"Password",leadingIcon:"Key",trailingIcon:"EyeOpen"})]})}const X=`import { Input } from "@cjlapao/ui-kit";

export default function Icons() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input placeholder="Search" leadingIcon="Search" />
      <Input
        type="password"
        placeholder="Password"
        leadingIcon="Key"
        trailingIcon="EyeOpen"
      />
    </div>
  );
}
`;function ee(){return e.jsx("div",{className:"flex flex-col gap-3",children:R.map(s=>e.jsx(a,{color:"blue",size:s,placeholder:`Size ${s}`},s))})}const ae=`import { CONTROL_SIZES, Input } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <Input
          key={each}
          color="blue"
          size={each}
          placeholder={\`Size \${each}\`}
        />
      ))}
    </div>
  );
}
`;function ne(){return e.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:G.map(s=>e.jsx(a,{size:"sm",color:s,placeholder:s},s))})}const le=`import { Input, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <Input key={each} size="sm" color={each} placeholder={each} />
      ))}
    </div>
  );
}
`;function se(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsx(b,{color:"blue",placeholder:"Password",defaultValue:"correct-horse"}),e.jsx(b,{color:"blue",placeholder:"Disabled",disabled:!0})]})}const te=`import { PasswordInput } from "@cjlapao/ui-kit";

export default function Password() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <PasswordInput
        color="blue"
        placeholder="Password"
        defaultValue="correct-horse"
      />
      <PasswordInput color="blue" placeholder="Disabled" disabled />
    </div>
  );
}
`,de=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Input",description:"The text field. Surface, size and tone all come from the shared scales, so it lines up with the SearchBar, Select and Button beside it. Pair with FormField for labels, hints and errors."}),e.jsx(K,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(t,{title:"Variants",description:"Six surfaces for the same control — from a flat field in a dense form to a glowing gradient on a landing page.",code:Y,filename:"Variants.tsx",children:e.jsx(M,{})}),e.jsx(t,{title:"Labeled",description:"FormField wires the label to the input, and carries the description and hint copy.",code:A,filename:"Labeled.tsx",children:e.jsx($,{})}),e.jsx(t,{title:"Validation",description:"The validation status paints the field; FormField explains why, in the right place.",code:J,filename:"Validation.tsx",children:e.jsx(H,{})}),e.jsx(t,{title:"Icons",description:"Registry icons by name, leading or trailing — search fields and password inputs in particular.",code:X,filename:"Icons.tsx",children:e.jsx(Q,{})}),e.jsx(t,{title:"Size ladder",description:"The shared xs–xl scale — height, text and icon size step together.",code:ae,filename:"SizeLadder.tsx",children:e.jsx(ee,{})}),e.jsx(t,{title:"Every tone",description:"All 21 true colours — focus one to see its border and ring.",code:le,filename:"EveryTone.tsx",children:e.jsx(ne,{})}),e.jsx(t,{title:"Password",description:"PasswordInput is the same field with a built-in reveal toggle.",code:te,filename:"Password.tsx",children:e.jsx(se,{})})]})]});export{de as InputPage,de as default};
