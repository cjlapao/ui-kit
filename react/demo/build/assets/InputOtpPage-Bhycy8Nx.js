import{r as a,j as e,P as Y,C as H,cp as s,i as c}from"./index-B9JeX19j.js";import{P as $,A as K,a as f,C as n}from"./A11ySections-C9rTCDac.js";import{P as U}from"./PageHeader-D-LFwZLT.js";import{E as o}from"./ExampleCard-BwESxlwz.js";import{P as W,C as d,a as Z,S as J,T as i}from"./PlaygroundPanel-CZvYEX_V.js";import{C as Q}from"./ControlAccordion-rp4gabXb.js";import{u as X,E as _}from"./EventLog-EYY1E4QF.js";import{Y as ee,d as te,C as ne,R as ae}from"./options-Blq0niUd.js";const le=[{label:"4",value:"4"},{label:"6",value:"6"},{label:"8",value:"8"}],se=()=>{const[l,r]=a.useState(6),[u,T]=a.useState("flat"),[g,V]=a.useState("md"),[b,P]=a.useState("auto"),[p,B]=a.useState("blue"),[j,R]=a.useState("subtle"),[v,A]=a.useState(!1),[y,L]=a.useState(!1),[k,E]=a.useState(!1),[C,D]=a.useState(!1),[w,G]=a.useState(!1),[O,S]=a.useState(!1),[h,M]=a.useState(!1),[x,m]=a.useState(""),[F,I]=X(),q=t=>{m(t),I(t?`value "${t}"`:"cleared")},N=e.jsx(s,{length:l,variant:u,size:g,corner:b,tone:p,glowIntensity:j,mask:v,integerOnly:y,disabled:k,readOnly:C,invalid:w,value:x,onChange:q,onComplete:t=>I(`complete — ${t}`)});return e.jsx(W,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Length",options:le,value:String(l),onChange:t=>r(Number(t))}),e.jsx(d,{label:"Variant",options:ee,value:u,onChange:t=>T(t)}),e.jsx(d,{label:"Size",options:te,value:g,onChange:t=>V(t)}),e.jsx(Z,{label:"Tone",children:e.jsx(H,{selectable:!0,size:"sm",value:p,onSelect:B,defaultExpanded:!0})}),e.jsx(J,{label:"Corner",options:[{label:"Auto (follow size)",value:"auto"},...ne],value:b,onChange:t=>P(t)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Mask",checked:v,onChange:A}),e.jsx(i,{label:"Integer only",checked:y,onChange:L}),e.jsx(i,{label:"Disabled",checked:k,onChange:E}),e.jsx(i,{label:"Read only",checked:C,onChange:D})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Invalid",checked:w,onChange:G}),e.jsx(i,{label:"In a panel",checked:O,onChange:S}),e.jsx(i,{label:"On a glass panel",checked:h,onChange:t=>{M(t),t&&S(!0)}})]})},...u==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(d,{label:"Glow",options:ae,value:j,onChange:t=>R(t)})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Typing advances, Backspace on an empty cell steps back, arrows walk, and a paste distributes across the row. The first cell carries"," ",e.jsx("code",{children:'autocomplete="one-time-code"'}),", so a phone offers the code the OS received. ",e.jsx("strong",{children:"Invalid"})," paints every cell with the error border instead of the tone focus pair."]}),e.jsx(_,{log:F,emptyText:"No events yet — type a code."})]}),preview:e.jsx("div",{className:"w-full",children:O?e.jsx(Y,{corner:"none",variant:h?"liquid-glass":"outlined",tone:h?p:"neutral",padding:"md",scrollable:!1,children:e.jsxs("div",{className:"flex flex-col items-center gap-3 py-2",children:[N,e.jsx(z,{value:x,onReset:()=>m("")})]})}):e.jsxs("div",{className:"flex flex-col items-center gap-3 py-2",children:[N,e.jsx(z,{value:x,onReset:()=>m("")})]})})})},z=({value:l,onReset:r})=>e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:l||"—"})]}),e.jsx(c,{variant:"soft",size:"sm",onClick:r,children:"Reset"})]});function oe(){return e.jsx(s,{length:6})}const re=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Basic() {
  return <InputOtp length={6} />;
}
`;function ie(){const[l,r]=a.useState("");return e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(s,{length:4,value:l,onChange:r}),e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:l||""})]}),e.jsx(c,{variant:"soft",size:"sm",onClick:()=>r(""),children:"Reset"})]})]})}const de=`import { useState } from "react";
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
`;function ce(){return e.jsx(s,{length:6,mask:!0,defaultValue:"482913"})}const ue=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Mask() {
  return <InputOtp length={6} mask defaultValue="482913" />;
}
`;function pe(){return e.jsx(s,{length:4,integerOnly:!0})}const he=`import { InputOtp } from "@cjlapao/ui-kit";

export default function IntegerOnly() {
  return <InputOtp length={4} integerOnly />;
}
`;function xe(){return e.jsx(s,{length:6,variant:"ghost",defaultValue:"4829"})}const me=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Filled() {
  // \`ghost\` — the soft, tone-tinted surface the old \`filled\` variant is now
  // an alias for.
  return <InputOtp length={6} variant="ghost" defaultValue="4829" />;
}
`;function fe(){return e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(s,{length:4,size:"sm"}),e.jsx(s,{length:4,size:"md"}),e.jsx(s,{length:4,size:"lg"})]})}const ge=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <InputOtp length={4} size="sm" />
      <InputOtp length={4} size="md" />
      <InputOtp length={4} size="lg" />
    </div>
  );
}
`;function be(){return e.jsx(s,{length:6,disabled:!0,defaultValue:"482913"})}const je=`import { InputOtp } from "@cjlapao/ui-kit";

export default function Disabled() {
  return <InputOtp length={6} disabled defaultValue="482913" />;
}
`;function ve(){return e.jsx(s,{length:4,defaultValue:"48",renderCell:l=>e.jsx("input",{...l.inputProps,className:"h-14 w-10 appearance-none rounded-none border-0 border-b-2 border-neutral-300 bg-transparent p-0 text-center text-2xl font-semibold text-neutral-900 outline-none transition-colors focus:border-blue-400 dark:border-neutral-600 dark:text-neutral-50 dark:focus:border-blue-400"})})}const ye=`import { InputOtp } from "@cjlapao/ui-kit";
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
`;function ke(){const[l,r]=a.useState("");return e.jsxs("div",{className:"flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/60",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-xl font-bold text-neutral-900 dark:text-neutral-50",children:"Authenticate Your Account"}),e.jsx("p",{className:"mt-1 text-sm text-neutral-500 dark:text-neutral-400",children:"Please enter the code sent to your phone."})]}),e.jsx(s,{length:6,size:"lg",value:l,onChange:r,ariaLabel:"Authentication code"}),e.jsxs("div",{className:"flex w-full items-center justify-between",children:[e.jsx(c,{variant:"link",size:"sm",children:"Resend Code"}),e.jsx(c,{variant:"solid",size:"sm",disabled:l.length<6,children:"Submit Code"})]})]})}const Ce=`import { useState } from "react";
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
`,Pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(U,{name:"Input OTP",description:"Single-character cells for one-time codes — typed, pasted or autocompleted, with masking, integer-only input and an onComplete callback. The cells are ordinary fields, so they wear the same six surfaces, tones and focus rings as every other input."}),e.jsx(se,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Basic",description:"Uncontrolled, with the cell count set by `length`. Each cell takes one character and focus advances as you type.",code:re,filename:"Basic.tsx",children:e.jsx(oe,{})}),e.jsx(o,{title:"Controlled",description:"Drive the code from your own state — the value readout and reset button follow `onChange`.",code:de,filename:"Controlled.tsx",children:e.jsx(ie,{})}),e.jsx(o,{title:"Mask",description:"`mask` switches the cells to password inputs so the characters are hidden behind the browser’s mask.",code:ue,filename:"Mask.tsx",children:e.jsx(ce,{})}),e.jsx(o,{title:"Integer Only",description:"`integerOnly` filters everything but 0–9 and hints a numeric keyboard to mobile browsers.",code:he,filename:"IntegerOnly.tsx",children:e.jsx(pe,{})}),e.jsx(o,{title:"Ghost fill",description:"The soft, tone-tinted surface of the shared family — the whole input surface set (flat, elevated, ghost, underline, glass, gradient) reaches the cells, `glass` blurring and `gradient` glowing behind the group.",code:me,filename:"Ghost.tsx",children:e.jsx(xe,{})}),e.jsx(o,{title:"Sizes",description:"The shared control scale, so an OTP lines up with the inputs beside it.",code:ge,filename:"Sizes.tsx",children:e.jsx(fe,{})}),e.jsx(o,{title:"Disabled",description:"`disabled` freezes the cells — the existing code stays visible but untouchable.",code:je,filename:"Disabled.tsx",children:e.jsx(be,{})}),e.jsx(o,{title:"Custom",description:"`renderCell` replaces the default box. Spread the provided `inputProps` onto your own `<input>` to keep the value, events and aria wiring.",code:ye,filename:"Custom.tsx",children:e.jsx(ve,{})}),e.jsx(o,{title:"Sample",description:"A sign-in flow: a 6-digit code, a resend action and a submit button that unlocks only when the code is complete.",code:Ce,filename:"Sample.tsx",children:e.jsx(ke,{})})]}),e.jsx($,{props:[{name:"value / defaultValue",type:"string",description:"The full code, one character per cell — controlled and uncontrolled, exactly as on an `<input>`."},{name:"onChange / onComplete",type:"(value: string) => void",description:"`onChange` fires on every change; `onComplete` once, when the last cell transitions to filled."},{name:"length",type:"number",default:"4",description:"Cell count, clamped to 1–20 so a typo in `length` cannot render a wall."},{name:"variant",type:"InputVariant",default:'"flat"',description:"The shared input surface family for the cells — they are fields. `glass` really blurs; `gradient` puts one glow behind the whole group, not one per cell. The old `outlined` / `filled` resolve to `flat` / `ghost`."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale drives the cell square and the gap between cells."},{name:"corner",type:'"auto" | PillCorner',default:'"auto"',description:"Cell radius. `auto` keeps the size ladder&rsquo;s own rounding; the explicit tokens ride the pill corner scale — the card scale would turn a 28px square into a blob, the reason `Pill` gives for its own scale."},{name:"tone",type:"TrueColor",default:'"blue"',description:"The shared field focus pair (border + inset ring, on every tone), the ghost tint and the gradient glow."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / the tone’s 600 → 400 shades',description:"The focus halo of the `gradient` variant, identical to `Input`, `Textarea` and `SearchBar` — but centred on the group."},{name:"mask",type:"boolean",default:"false",description:'Cells become `type="password"`.'},{name:"integerOnly",type:"boolean",default:"false",description:"Filters to 0–9 and hints a numeric keyboard (`inputMode`/`pattern`)."},{name:"invalid / disabled / readOnly",type:"boolean",default:"false",description:"`invalid` swaps the tone focus for the error border and sets `aria-invalid` on every cell."},{name:"name",type:"string",description:"The form field name, set on the first cell — the code submits as one value."},{name:"ariaLabel",type:"string",default:'"One-time password" (`kit.inputotp.label`)',description:"Names the group and, through `kit.inputotp.cell`, each cell — “Authentication code, character 3 of 6”."},{name:"renderCell",type:"(cell: InputOtpCellContext) => ReactNode",description:"Replaces the default box. Spreading `cell.inputProps` keeps the value, events, aria labels and focus wiring."},{name:"className / ref",type:"string / Ref<HTMLDivElement>",description:"Land on the group."}]}),e.jsxs(K,{children:[e.jsx(f,{title:"Screen reader",children:e.jsxs("p",{children:["One ",e.jsx(n,{children:'role="group"'})," named by ",e.jsx(n,{children:"ariaLabel"}),", holding one ",e.jsx(n,{children:"textbox"})," per cell named through the catalog —"," ",e.jsx("em",{children:"“One-time password, character 3 of 6”"}),", so position is spoken, not guessed. ",e.jsx(n,{children:"invalid"})," sets"," ",e.jsx(n,{children:"aria-invalid"})," on every cell. ",e.jsx(n,{children:"disabled"})," and ",e.jsx(n,{children:"readOnly"})," ","are the real input attributes, not lookalikes."]})}),e.jsx(f,{title:"Keyboard support",children:e.jsxs("p",{children:["Typing fills the cell and advances focus; a keystroke on a filled cell replaces it (the content is selected on focus, so ",e.jsx(n,{children:"maxLength"})," ","never silently drops it). Backspace clears the cell or steps back to clear the previous one, ",e.jsx(n,{children:"ArrowLeft"}),"/",e.jsx(n,{children:"ArrowRight"})," walk the row, and a paste distributes across cells, focus parking at the end. The first cell carries ",e.jsx(n,{children:'autocomplete="one-time-code"'}),", so mobile autofill delivers the whole code — and keystrokes past the last filled cell land at the end, because the value is a contiguous string the component can actually express."]})}),e.jsx(f,{title:"Internationalization",children:e.jsxs("p",{children:["The group name (",e.jsx(n,{children:"kit.inputotp.label"}),") and the per-cell position string (",e.jsx(n,{children:"kit.inputotp.cell"})," — ",e.jsx(n,{children:"Zeichen 3 von 6"}),","," ",e.jsx(n,{children:"caractère 3 sur 6"}),") ride the catalog in five locales; a caller-given ",e.jsx(n,{children:"ariaLabel"})," flows into the translated sentence rather than replacing it. What stays put: the digits themselves."]})})]})]});export{Pe as InputOtpPage,Pe as default};
