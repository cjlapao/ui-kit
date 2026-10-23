import{r as t,j as e,eT as r,C as B,c8 as F,db as z}from"./index-B9JeX19j.js";import{P as L,A as U,a as u,C as a}from"./A11ySections-C9rTCDac.js";import{P as _}from"./PageHeader-D-LFwZLT.js";import{E as h}from"./ExampleCard-BwESxlwz.js";import{P as D,S as c,a as C,T as d}from"./PlaygroundPanel-CZvYEX_V.js";import{C as H}from"./ControlAccordion-rp4gabXb.js";import{u as M,E as $}from"./EventLog-EYY1E4QF.js";import{d as q,x as K,e as W,p as J,ba as Q}from"./options-Blq0niUd.js";const X=[{value:"eu-west-1",label:"Ireland",description:"eu-west-1",icon:"Globe"},{value:"eu-central-1",label:"Frankfurt",description:"eu-central-1",icon:"Globe"},{value:"us-east-1",label:"N. Virginia",description:"us-east-1",icon:"Globe"},{value:"us-west-2",label:"Oregon",description:"us-west-2",icon:"Globe"},{value:"ap-northeast-1",label:"Tokyo",description:"ap-northeast-1",icon:"Globe"},{value:"ap-southeast-2",label:"Sydney",description:"Not enabled for this account",icon:"Globe",disabled:!0}],Y=()=>{const[s,l]=t.useState(""),[o,i]=M(),[p,k]=t.useState("md"),[x,N]=t.useState("flat"),[m,T]=t.useState("blue"),[b,A]=t.useState("none"),[f,V]=t.useState("auto"),[g,I]=t.useState("auto"),[v,O]=t.useState(!1),[y,E]=t.useState(!1),[w,R]=t.useState(!1),[j,G]=t.useState(!0),[S,P]=t.useState(!0);return e.jsx(D,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(H,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Size",options:q,value:p,onChange:n=>k(n)}),e.jsx(c,{label:"Variant",options:K,value:x,onChange:n=>N(n)}),e.jsx(C,{label:"Tone",children:e.jsx(B,{selectable:!0,size:"sm",value:m,onSelect:T,defaultExpanded:!0})}),e.jsx(c,{label:"Popup surface",options:[{label:"Auto (follows the field)",value:"auto"},...W],value:f,onChange:n=>V(n)}),e.jsx(c,{label:"Popup corner",options:J,value:g,onChange:n=>I(n)}),e.jsx(c,{label:"Validation",options:Q,value:b,onChange:n=>A(n)})]})},{id:"states",title:"States",controls:e.jsx(C,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(d,{label:"Loading",checked:w,onChange:R}),e.jsx(d,{label:"Disabled",checked:v,onChange:O}),e.jsx(d,{label:"Read-only",checked:y,onChange:E}),e.jsx(d,{label:"Clearable",checked:j,onChange:G}),e.jsx(d,{label:"Leading icon",checked:S,onChange:P})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Focus the field and use ",e.jsx("strong",{children:"↑ ↓"})," to move,"," ",e.jsx("strong",{children:"Home"})," / ",e.jsx("strong",{children:"End"})," to jump,"," ",e.jsx("strong",{children:"Enter"})," to choose and ",e.jsx("strong",{children:"Esc"})," to close — the cursor skips the disabled row. The trailing control clears while there is something to clear, and opens the list otherwise."]})]}),preview:e.jsxs("div",{className:"w-full max-w-md space-y-2",children:[e.jsx(r,{options:X,value:s,onChange:n=>{l(n),n===""&&i("onChange → cleared")},onSelect:n=>i(`onSelect → ${n.value}${n.disabled?" (blocked)":""}`),size:p,variant:x,tone:m,panelVariant:f,panelCorner:g,validationStatus:b,disabled:v,readOnly:y,loading:w,clearable:j,leadingIcon:S?"Search":void 0,placeholder:"Search regions…"}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Typed: ",e.jsx("code",{children:s||"—"})," — the popup is portaled and placed against the viewport, so it survives the nearest scroller’s edge; ",e.jsx("strong",{children:"Auto"})," pairs its surface with the field (a glass field opens a glass popup)."]}),e.jsx($,{log:o,emptyText:"No events yet — callbacks report through here."})]})})},Z=["Apple","Apricot","Banana","Blackberry","Cherry","Fig"];function ee(){const[s,l]=t.useState(""),[o,i]=t.useState(null);return e.jsxs("div",{className:"w-full max-w-sm space-y-2",children:[e.jsx(r,{options:Z,value:s,onChange:l,onSelect:p=>i(p.value),placeholder:"Search fruit…"}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Typed: ",e.jsx("code",{children:s||"—"})," · Chosen:"," ",e.jsx("code",{children:o??"—"})]})]})}const ae=`import { useState } from "react";
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
`,te=[{value:"eu-west-1",label:"Ireland",description:"eu-west-1",icon:"Globe"},{value:"eu-central-1",label:"Frankfurt",description:"eu-central-1",icon:"Globe"},{value:"us-east-1",label:"N. Virginia",description:"us-east-1",icon:"Globe"},{value:"ap-southeast-2",label:"Sydney",description:"Not enabled for this account",icon:"Globe",disabled:!0}];function ne(){const[s,l]=t.useState("eu-west-1");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(r,{options:te,value:s,onChange:l,leadingIcon:"Globe",placeholder:"Choose a region…"})})}const se=`import { useState } from "react";
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
`;function oe(){const[s,l]=t.useState("");return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:F.map(o=>e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:o}),e.jsx(r,{options:["Alpha","Beta","Gamma"],value:s,onChange:l,variant:o,placeholder:"Type to filter…"})]},o))})}const le=`import { useState } from "react";
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
`;function ie(){const[s,l]=t.useState(""),o=["Alpha","Beta","Gamma"];return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[z.map(i=>e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:i}),e.jsx(r,{options:o,value:s,onChange:l,validationStatus:i,placeholder:"Type to filter…"})]},i)),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"loading"}),e.jsx(r,{options:[],value:"",onChange:()=>{},loading:!0})]}),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"disabled"}),e.jsx(r,{options:o,value:"Alpha",onChange:()=>{},disabled:!0})]}),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"read-only"}),e.jsx(r,{options:o,value:"Beta",onChange:()=>{},readOnly:!0})]})]})}const re=`import { useState } from "react";
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
`,fe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Combobox",description:"A text field that suggests without preventing: the list filters as you type, and whatever you leave in the field is the value. It renders `Input`, so the box, the sizes, the entry variants and the validation ring are the ones every other control in the kit uses — and it follows the ARIA combobox pattern, so the whole list is reachable from the keyboard."}),e.jsx(Y,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Basics",description:"`onChange` fires on every keystroke — the field is free text. `onSelect` fires only when a row is actually chosen, which is usually the one to act on.",code:ae,filename:"Basics.tsx",children:e.jsx(ee,{})}),e.jsx(h,{title:"Rich options",description:"An option can be a bare string or an object with a label, a description, an icon and a disabled flag. The keyboard cursor steps over a disabled row rather than landing on it and refusing.",code:se,filename:"RichOptions.tsx",children:e.jsx(ne,{})}),e.jsx(h,{title:"Variants and sizes",description:"Rendering `Input` rather than a second field implementation means every entry variant and every control size come for free, and the box lines up with the Button beside it.",code:le,filename:"Variants.tsx",children:e.jsx(oe,{})}),e.jsx(h,{title:"States",description:"`validationStatus` is the kit's one field-status scale — it used to be declared six separate times across the form controls. `loading`, `disabled` and `readOnly` complete the set.",code:re,filename:"States.tsx",children:e.jsx(ie,{})})]}),e.jsx(L,{props:[{name:"value / onChange / onSelect",type:"string / (value) => void / (option) => void",description:"The field is free text - onChange fires on every keystroke and whatever you leave typed is the value. onSelect fires only when a row is chosen, through mouse or Enter, which is the one to act on."},{name:"options",type:"(string | ComboboxOption)[]",description:"A bare string is shorthand for `{ value }`. An option can carry a label, a description, a registry icon and a disabled flag - the keyboard cursor steps over a disabled row rather than landing on it and refusing."},{name:"size / variant",type:"ControlSize / InputVariant",default:'"md" / "flat"',description:"The shared scales, straight through to the Input it renders - so the box lines up with the Button beside it and every entry variant comes for free."},{name:"tone (color)",type:"TrueColor",default:'"blue"',description:"The kit default accent for the focus ring, the check, and the row wash - under the mouse and under the keyboard cursor alike (in tone on the selected row). The suggestion list is the field’s shadow: it tints like the field does."},{name:"panelVariant / panelCorner",type:'"auto" | SurfaceVariant / SurfaceCorner',default:'"auto" / "auto"',description:"The popup is a Panel from the container family, portaled to the body and placed against the viewport with a flip when there is more room above. Auto pairs its surface with the field through `SURFACE_VARIANT_FOR_FIELD` - a glass field opens a glass popup, not an opaque slab."},{name:"validationStatus (error)",type:"ValidationStatus / boolean",default:'"none"',description:"The kit's one field-status scale; the boolean error flag is its alias. A free-text field should rarely set it - typing anything is legal here."},{name:"loading / emptyMessage / clearable",type:"boolean / ReactNode / boolean",default:"false / localized / true",description:"Loading spins in the field's trailing slot (visible even with the list closed) and replaces the rows with a spinner inside; the keyboard cursor will not step through or commit rows hidden behind it. An unmatched filter says so instead of opening a blank box. Both messages route through the kit catalogs. Clearable swaps the caret affordance for a clear button while there is something to clear - the spinner outranks it mid-fetch."},{name:"visibleRows / listClassName",type:"number / string",default:"6 / —",description:"Rows before the ScrollArea starts scrolling, capped further by the room left in the viewport. listClassName rides onto the popup card."}]}),e.jsxs(U,{children:[e.jsx(u,{title:"Screen reader",children:e.jsxs("p",{children:["A real ",e.jsx(a,{children:"combobox"})," driving a ",e.jsx(a,{children:"listbox"}),": ",e.jsx(a,{children:"aria-expanded"}),","," ",e.jsx(a,{children:"aria-controls"})," and ",e.jsx(a,{children:"aria-activedescendant"})," name the row the cursor is on, and the listbox keeps its role even while it only holds a spinner or the empty message - the field never points at nothing. Rows carry ",e.jsx(a,{children:"aria-selected"})," and ",e.jsx(a,{children:"aria-disabled"}),"."]})}),e.jsx(u,{title:"Keyboard support",children:e.jsxs("p",{children:["Focus or ",e.jsx(a,{children:"↓"})," opens, ",e.jsx(a,{children:"↑ ↓"})," move the cursor (skipping disabled rows and wrapping), ",e.jsx(a,{children:"Home"}),"/",e.jsx(a,{children:"End"})," jump, ",e.jsx(a,{children:"Enter"})," commits only a real row - free text you leave in place is the value."," ",e.jsx(a,{children:"Esc"})," closes the list and consumes the key so a host’s own Escape ladder (a modal, a docked field) keeps its rung; the next Escape goes to the host. The cursor scrolls its own row into view - the list needs no tab stop to be traversed."]})}),e.jsx(u,{title:"Internationalization",children:e.jsxs("p",{children:["The loading line, the empty message and the two trailing-affordance labels (",e.jsx(a,{children:"Clear"}),", ",e.jsx(a,{children:"Show options"}),") resolve through the kit catalogs; ",e.jsx(a,{children:"loadingMessage"})," and ",e.jsx(a,{children:"emptyMessage"})," override per instance. Filter matching is case-insensitive substring - no locale collation, so callers with accented labels may want to filter upstream."]})})]})]});export{fe as ComboboxPage,fe as default};
