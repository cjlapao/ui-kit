import{r as l,j as e,Y as t,e as o,M as i}from"./index-8i9ZNynb.js";import{P as w}from"./PageHeader-CO5k_SQv.js";import{E as a}from"./ExampleCard-LdxcpmX_.js";import{P as I,C as u,S as y,T as d}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as z}from"./ControlAccordion-Bqp-1oBj.js";import{V as N,t as V}from"./options-yAU-f7tt.js";const P=[{label:"4",value:"4"},{label:"6",value:"6"},{label:"8",value:"8"}],B=[{label:"Small",value:"sm"},{label:"Medium",value:"md"},{label:"Large",value:"lg"}],M=()=>{const[n,r]=l.useState(6),[c,j]=l.useState("outlined"),[p,v]=l.useState("md"),[x,k]=l.useState("blue"),[m,C]=l.useState(!1),[h,O]=l.useState(!1),[f,S]=l.useState(!1),[g,b]=l.useState("");return e.jsx(I,{controls:e.jsx(z,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Length",children:e.jsx(i,{fullWidth:!0,size:"sm",options:P,value:String(n),onChange:s=>r(Number(s))})}),e.jsx(u,{label:"Variant",children:e.jsx(i,{fullWidth:!0,size:"sm",options:N,value:c,onChange:s=>j(s)})}),e.jsx(u,{label:"Size",children:e.jsx(i,{fullWidth:!0,size:"sm",options:B,value:p,onChange:s=>v(s)})}),e.jsx(y,{label:"Tone",options:V,value:x,onChange:s=>k(s)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(d,{label:"Mask",checked:m,onChange:C}),e.jsx(d,{label:"Integer only",checked:h,onChange:O}),e.jsx(d,{label:"Disabled",checked:f,onChange:S})]})}]}),preview:e.jsxs("div",{className:"flex w-full max-w-sm flex-col items-center gap-3",children:[e.jsx(t,{length:n,variant:c,size:p,tone:x,mask:m,integerOnly:h,disabled:f,value:g,onChange:b}),e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:g||"—"})]}),e.jsx(o,{variant:"soft",size:"sm",onClick:()=>b(""),children:"Reset"})]})]})})};function A(){return e.jsx(t,{length:6})}const T=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Basic() {
  return <InputOtp length={6} />;
}
`;function D(){const[n,r]=l.useState("");return e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(t,{length:4,value:n,onChange:r}),e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:n||""})]}),e.jsx(o,{variant:"soft",size:"sm",onClick:()=>r(""),children:"Reset"})]})]})}const R=`import { useState } from "react";
import { Button, InputOtp } from "@cjlapao/ui-kit";

export default function Controlled() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col items-center gap-4">
      <InputOtp length={4} value={value} onChange={setValue} />
      <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
        <span>
          Value:{" "}
          <strong className="text-neutral-900 dark:text-neutral-100">
            {value || ""}
          </strong>
        </span>
        <Button variant="soft" size="sm" onClick={() => setValue("")}>
          Reset
        </Button>
      </div>
    </div>
  );
}
`;function E(){return e.jsx(t,{length:6,mask:!0,defaultValue:"482913"})}const F=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Mask() {
  return <InputOtp length={6} mask defaultValue="482913" />;
}
`;function L(){return e.jsx(t,{length:4,integerOnly:!0})}const W=`import { InputOtp } from "@cjlapao/ui-kit";

export default function IntegerOnly() {
  return <InputOtp length={4} integerOnly />;
}
`;function Y(){return e.jsx(t,{length:6,variant:"filled",defaultValue:"4829"})}const H=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Filled() {
  return <InputOtp length={6} variant="filled" defaultValue="4829" />;
}
`;function U(){return e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(t,{length:4,size:"sm"}),e.jsx(t,{length:4,size:"md"}),e.jsx(t,{length:4,size:"lg"})]})}const q=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <InputOtp length={4} size="sm" />
      <InputOtp length={4} size="md" />
      <InputOtp length={4} size="lg" />
    </div>
  );
}
`;function G(){return e.jsx(t,{length:6,disabled:!0,defaultValue:"482913"})}const J=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Disabled() {
  return <InputOtp length={6} disabled defaultValue="482913" />;
}
`;function K(){return e.jsx(t,{length:4,defaultValue:"48",renderCell:n=>e.jsx("input",{...n.inputProps,className:"h-14 w-10 appearance-none rounded-none border-0 border-b-2 border-neutral-300 bg-transparent p-0 text-center text-2xl font-semibold text-neutral-900 outline-none transition-colors focus:border-blue-400 dark:border-neutral-600 dark:text-neutral-50 dark:focus:border-blue-400"})})}const Q=`import { InputOtp } from "@cjlapao/ui-kit";
import type { InputOtpCellContext } from "@cjlapao/ui-kit";

export default function Custom() {
  return (
    <InputOtp
      length={4}
      defaultValue="48"
      renderCell={(cell: InputOtpCellContext) => (
        <input
          {...cell.inputProps}
          className="h-14 w-10 appearance-none rounded-none border-0 border-b-2 border-neutral-300 bg-transparent p-0 text-center text-2xl font-semibold text-neutral-900 outline-none transition-colors focus:border-blue-400 dark:border-neutral-600 dark:text-neutral-50 dark:focus:border-blue-400"
        />
      )}
    />
  );
}
`;function X(){const[n,r]=l.useState("");return e.jsxs("div",{className:"flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/60",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-xl font-bold text-neutral-900 dark:text-neutral-50",children:"Authenticate Your Account"}),e.jsx("p",{className:"mt-1 text-sm text-neutral-500 dark:text-neutral-400",children:"Please enter the code sent to your phone."})]}),e.jsx(t,{length:6,size:"lg",value:n,onChange:r,ariaLabel:"Authentication code"}),e.jsxs("div",{className:"flex w-full items-center justify-between",children:[e.jsx(o,{variant:"link",size:"sm",children:"Resend Code"}),e.jsx(o,{variant:"solid",size:"sm",disabled:n.length<6,children:"Submit Code"})]})]})}const Z=`import { useState } from "react";
import { Button, InputOtp } from "@cjlapao/ui-kit";

export default function Sample() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/60">
      <div className="text-center">
        <div className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Authenticate Your Account
        </div>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Please enter the code sent to your phone.
        </p>
      </div>
      <InputOtp
        length={6}
        size="lg"
        value={value}
        onChange={setValue}
        ariaLabel="Authentication code"
      />
      <div className="flex w-full items-center justify-between">
        <Button variant="link" size="sm">
          Resend Code
        </Button>
        <Button variant="solid" size="sm" disabled={value.length < 6}>
          Submit Code
        </Button>
      </div>
    </div>
  );
}
`,ae=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(w,{name:"Input OTP",description:"Single-character cells for one-time codes — typed, pasted or autocompleted, with masking, integer-only input and an onComplete callback."}),e.jsx(M,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(a,{title:"Basic",description:"Uncontrolled, with the cell count set by `length`. Each cell takes one character and focus advances as you type.",code:T,filename:"Basic.tsx",children:e.jsx(A,{})}),e.jsx(a,{title:"Controlled",description:"Drive the code from your own state — the value readout and reset button follow `onChange`.",code:R,filename:"Controlled.tsx",children:e.jsx(D,{})}),e.jsx(a,{title:"Mask",description:"`mask` switches the cells to password inputs so the characters are hidden behind the browser's mask.",code:F,filename:"Mask.tsx",children:e.jsx(E,{})}),e.jsx(a,{title:"Integer Only",description:"`integerOnly` filters everything but 0–9 and hints a numeric keyboard to mobile browsers.",code:W,filename:"IntegerOnly.tsx",children:e.jsx(L,{})}),e.jsx(a,{title:"Filled",description:"The `filled` variant trades the outline for a higher-emphasis surface.",code:H,filename:"Filled.tsx",children:e.jsx(Y,{})}),e.jsx(a,{title:"Sizes",description:"Small, medium and large on the shared control scale, so an OTP lines up with the inputs beside it.",code:q,filename:"Sizes.tsx",children:e.jsx(U,{})}),e.jsx(a,{title:"Disabled",description:"`disabled` freezes the cells — the existing code stays visible but untouchable.",code:J,filename:"Disabled.tsx",children:e.jsx(G,{})}),e.jsx(a,{title:"Custom",description:"`renderCell` replaces the default box. Spread the provided `inputProps` onto your own `<input>` to keep the value, events and aria wiring.",code:Q,filename:"Custom.tsx",children:e.jsx(K,{})}),e.jsx(a,{title:"Sample",description:"A sign-in flow: a 6-digit code, a resend action and a submit button that unlocks only when the code is complete.",code:Z,filename:"Sample.tsx",children:e.jsx(X,{})})]})]});export{ae as InputOtpPage,ae as default};
