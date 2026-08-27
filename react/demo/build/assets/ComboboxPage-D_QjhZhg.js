import{r as a,j as e,bE as l,J as A,aF as V}from"./index-BBK6HA-D.js";import{P as O}from"./PageHeader-BcBcU29I.js";import{E as d}from"./ExampleCard-BVwGIEPO.js";import{P as G,C as R,S as p,a as B,T as r}from"./ControlAccordion-DallGojj.js";import{n as E,x as P,t as F,a_ as z}from"./options-D-FMIizr.js";const U=[{value:"eu-west-1",label:"Ireland",description:"eu-west-1",icon:"Globe"},{value:"eu-central-1",label:"Frankfurt",description:"eu-central-1",icon:"Globe"},{value:"us-east-1",label:"N. Virginia",description:"us-east-1",icon:"Globe"},{value:"us-west-2",label:"Oregon",description:"us-west-2",icon:"Globe"},{value:"ap-northeast-1",label:"Tokyo",description:"ap-northeast-1",icon:"Globe"},{value:"ap-southeast-2",label:"Sydney",description:"Not enabled for this account",icon:"Globe",disabled:!0}],_=()=>{const[n,s]=a.useState(""),[t,i]=a.useState(null),[c,y]=a.useState("md"),[u,S]=a.useState("flat"),[h,j]=a.useState("blue"),[x,w]=a.useState("none"),[m,C]=a.useState(!1),[b,N]=a.useState(!1),[f,k]=a.useState(!1),[g,T]=a.useState(!0),[v,I]=a.useState(!0);return e.jsx(G,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(R,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Size",options:E,value:c,onChange:o=>y(o)}),e.jsx(p,{label:"Variant",options:P,value:u,onChange:o=>S(o)}),e.jsx(p,{label:"Tone",options:F,value:h,onChange:o=>j(o)}),e.jsx(p,{label:"Validation",options:z,value:x,onChange:o=>w(o)})]})},{id:"states",title:"States",controls:e.jsx(B,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(r,{label:"Loading",checked:f,onChange:k}),e.jsx(r,{label:"Disabled",checked:m,onChange:C}),e.jsx(r,{label:"Read-only",checked:b,onChange:N}),e.jsx(r,{label:"Clearable",checked:g,onChange:T}),e.jsx(r,{label:"Leading icon",checked:v,onChange:I})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Focus the field and use ",e.jsx("strong",{children:"↑ ↓"})," to move,"," ",e.jsx("strong",{children:"Home"})," / ",e.jsx("strong",{children:"End"})," to jump,"," ",e.jsx("strong",{children:"Enter"})," to choose and ",e.jsx("strong",{children:"Esc"})," to close — the cursor skips the disabled row. The trailing control clears while there is something to clear, and opens the list otherwise."]})]}),preview:e.jsxs("div",{className:"w-full max-w-md space-y-2",children:[e.jsx(l,{options:U,value:n,onChange:s,onSelect:o=>i(o.value),size:c,variant:u,tone:h,validationStatus:x,disabled:m,readOnly:b,loading:f,clearable:g,leadingIcon:v?"Search":void 0,placeholder:"Search regions…"}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Typed: ",e.jsx("code",{children:n||"—"})," · Chosen:"," ",e.jsx("code",{children:t??"—"})]})]})})},L=["Apple","Apricot","Banana","Blackberry","Cherry","Fig"];function D(){const[n,s]=a.useState(""),[t,i]=a.useState(null);return e.jsxs("div",{className:"w-full max-w-sm space-y-2",children:[e.jsx(l,{options:L,value:n,onChange:s,onSelect:c=>i(c.value),placeholder:"Search fruit…"}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Typed: ",e.jsx("code",{children:n||"—"})," · Chosen:"," ",e.jsx("code",{children:t??"—"})]})]})}const H=`import { useState } from "react";
import { Combobox } from "@cjlapao/ui-kit";

const FRUIT = ["Apple", "Apricot", "Banana", "Blackberry", "Cherry", "Fig"];

/**
 * A combobox suggests without preventing: the list filters as you type, and
 * whatever you leave in the field is the value — which is what separates it
 * from a \`Select\`.
 *
 * \`onChange\` fires on every keystroke; \`onSelect\` fires only when a row is
 * actually chosen, which is usually the one you want to act on.
 */
export default function Basics() {
  const [value, setValue] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="w-full max-w-sm space-y-2">
      <Combobox
        options={FRUIT}
        value={value}
        onChange={setValue}
        onSelect={(option) => setPicked(option.value)}
        placeholder="Search fruit…"
      />
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Typed: <code>{value || "—"}</code> · Chosen:{" "}
        <code>{picked ?? "—"}</code>
      </p>
    </div>
  );
}
`,J=[{value:"eu-west-1",label:"Ireland",description:"eu-west-1",icon:"Globe"},{value:"eu-central-1",label:"Frankfurt",description:"eu-central-1",icon:"Globe"},{value:"us-east-1",label:"N. Virginia",description:"us-east-1",icon:"Globe"},{value:"ap-southeast-2",label:"Sydney",description:"Not enabled for this account",icon:"Globe",disabled:!0}];function W(){const[n,s]=a.useState("eu-west-1");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(l,{options:J,value:n,onChange:s,leadingIcon:"Globe",placeholder:"Choose a region…"})})}const q=`import { useState } from "react";
import { Combobox } from "@cjlapao/ui-kit";
import type { ComboboxOption } from "@cjlapao/ui-kit";

/**
 * An option can be a bare string or an object with a label, a description, an
 * icon and a disabled flag. The keyboard skips a disabled row rather than
 * landing on it and refusing.
 */
const REGIONS: ComboboxOption[] = [
  { value: "eu-west-1", label: "Ireland", description: "eu-west-1", icon: "Globe" },
  { value: "eu-central-1", label: "Frankfurt", description: "eu-central-1", icon: "Globe" },
  { value: "us-east-1", label: "N. Virginia", description: "us-east-1", icon: "Globe" },
  {
    value: "ap-southeast-2",
    label: "Sydney",
    description: "Not enabled for this account",
    icon: "Globe",
    disabled: true,
  },
];

export default function RichOptions() {
  const [value, setValue] = useState("eu-west-1");
  return (
    <div className="w-full max-w-sm">
      <Combobox
        options={REGIONS}
        value={value}
        onChange={setValue}
        leadingIcon="Globe"
        placeholder="Choose a region…"
      />
    </div>
  );
}
`;function K(){const[n,s]=a.useState("");return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:A.map(t=>e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),e.jsx(l,{options:["Alpha","Beta","Gamma"],value:n,onChange:s,variant:t,placeholder:"Type to filter…"})]},t))})}const M=`import { useState } from "react";
import { INPUT_VARIANTS, Combobox } from "@cjlapao/ui-kit";

/**
 * It renders \`Input\`, so the box is the kit's entry box: every entry variant,
 * every control size, the same focus ring and the same validation treatment as
 * the \`Select\` beside it. The previous version drew its own \`border px-3 py-2
 * text-sm\` and had no size prop at all.
 */
export default function Variants() {
  const [value, setValue] = useState("");
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <label key={variant} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {variant}
          </span>
          <Combobox
            options={["Alpha", "Beta", "Gamma"]}
            value={value}
            onChange={setValue}
            variant={variant}
            placeholder="Type to filter…"
          />
        </label>
      ))}
    </div>
  );
}
`;function Q(){const[n,s]=a.useState(""),t=["Alpha","Beta","Gamma"];return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[V.map(i=>e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:i}),e.jsx(l,{options:t,value:n,onChange:s,validationStatus:i,placeholder:"Type to filter…"})]},i)),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"loading"}),e.jsx(l,{options:[],value:"",onChange:()=>{},loading:!0})]}),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"disabled"}),e.jsx(l,{options:t,value:"Alpha",onChange:()=>{},disabled:!0})]}),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"read-only"}),e.jsx(l,{options:t,value:"Beta",onChange:()=>{},readOnly:!0})]})]})}const X=`import { useState } from "react";
import { VALIDATION_STATUSES, Combobox } from "@cjlapao/ui-kit";

/**
 * \`validationStatus\` is the kit's one field-status scale — it used to be
 * declared six separate times across the form controls, so the day one changed
 * the other five would not have. \`loading\`, \`disabled\` and \`readOnly\` complete
 * the set.
 */
export default function States() {
  const [value, setValue] = useState("");
  const options = ["Alpha", "Beta", "Gamma"];

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {VALIDATION_STATUSES.map((validationStatus) => (
        <label key={validationStatus} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {validationStatus}
          </span>
          <Combobox
            options={options}
            value={value}
            onChange={setValue}
            validationStatus={validationStatus}
            placeholder="Type to filter…"
          />
        </label>
      ))}
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          loading
        </span>
        <Combobox options={[]} value="" onChange={() => {}} loading />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          disabled
        </span>
        <Combobox options={options} value="Alpha" onChange={() => {}} disabled />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          read-only
        </span>
        <Combobox options={options} value="Beta" onChange={() => {}} readOnly />
      </label>
    </div>
  );
}
`,ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(O,{name:"Combobox",description:"A text field that suggests without preventing: the list filters as you type, and whatever you leave in the field is the value. It renders `Input`, so the box, the sizes, the entry variants and the validation ring are the ones every other control in the kit uses — and it follows the ARIA combobox pattern, so the whole list is reachable from the keyboard."}),e.jsx(_,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Basics",description:"`onChange` fires on every keystroke — the field is free text. `onSelect` fires only when a row is actually chosen, which is usually the one to act on.",code:H,filename:"Basics.tsx",children:e.jsx(D,{})}),e.jsx(d,{title:"Rich options",description:"An option can be a bare string or an object with a label, a description, an icon and a disabled flag. The keyboard cursor steps over a disabled row rather than landing on it and refusing.",code:q,filename:"RichOptions.tsx",children:e.jsx(W,{})}),e.jsx(d,{title:"Variants and sizes",description:"Rendering `Input` rather than a second field implementation means every entry variant and every control size come for free, and the box lines up with the Button beside it.",code:M,filename:"Variants.tsx",children:e.jsx(K,{})}),e.jsx(d,{title:"States",description:"`validationStatus` is the kit's one field-status scale — it used to be declared six separate times across the form controls. `loading`, `disabled` and `readOnly` complete the set.",code:X,filename:"States.tsx",children:e.jsx(Q,{})})]})]});export{ne as ComboboxPage,ne as default};
