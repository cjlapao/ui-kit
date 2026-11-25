import{r as t,j as e,gC as r,C as _,g as D,fU as K,gz as M,gx as A,gA as H,B as $}from"./index-CQwZVYnB.js";import{P as q,A as W,a as m,C as n}from"./A11ySections-BXfanEck.js";import{P as J}from"./PageHeader-BhZxEVHt.js";import{E as u}from"./ExampleCard-BZsKA5_g.js";import{P as Q,S as p,a as x,T as c}from"./PlaygroundPanel-Dq0XbiQ9.js";import{a as X}from"./SurfaceToneControl-LH37fS9y.js";import{C as Y}from"./ControlAccordion-C7vC6faF.js";import{u as Z,E as ee}from"./EventLog-B3ejPngN.js";import{c as te,I as ae,s as ne,f as oe,bl as se}from"./options-Byh1yOHz.js";const le=[{value:"eu-west-1",label:"Ireland",description:"eu-west-1",icon:"Globe"},{value:"eu-central-1",label:"Frankfurt",description:"eu-central-1",icon:"Globe"},{value:"us-east-1",label:"N. Virginia",description:"us-east-1",icon:"Globe"},{value:"us-west-2",label:"Oregon",description:"us-west-2",icon:"Globe"},{value:"ap-northeast-1",label:"Tokyo",description:"ap-northeast-1",icon:"Globe"},{value:"ap-southeast-2",label:"Sydney",description:"Not enabled for this account",icon:"Globe",disabled:!0}],ie=()=>{const[o,l]=t.useState(""),[s,i]=Z(),[d,I]=t.useState("md"),[b,V]=t.useState("flat"),[g,R]=t.useState("blue"),[f,F]=t.useState("none"),[v,E]=t.useState("auto"),[h,w]=t.useState("auto"),[y,P]=t.useState("auto"),[j,O]=t.useState(!1),[S,B]=t.useState(!1),[k,G]=t.useState(!1),[C,z]=t.useState(!1),[N,L]=t.useState(!0),[T,U]=t.useState(!0);return e.jsx(Q,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Y,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Size",options:te,value:d,onChange:a=>I(a)}),e.jsx(p,{label:"Variant",options:ae,value:b,onChange:a=>V(a)}),e.jsx(x,{label:"Tone",children:e.jsx(_,{selectable:!0,size:"sm",value:g,onSelect:R,defaultExpanded:!0})}),e.jsx(p,{label:"Popup surface",options:[{label:"Auto (follows the field)",value:"auto"},...ne],value:v,onChange:a=>E(a)}),e.jsx(x,{label:"Popup tone",children:e.jsx(X,{value:h==="auto"?"none":h,onSelect:w})}),e.jsx(c,{label:"Popup tone follows field",checked:h==="auto",onChange:a=>w(a?"auto":"none")}),e.jsx(p,{label:"Popup corner",options:oe,value:y,onChange:a=>P(a)}),e.jsx(c,{label:"Raised surface",checked:j,onChange:O}),e.jsx(p,{label:"Validation",options:se,value:f,onChange:a=>F(a)})]})},{id:"states",title:"States",controls:e.jsx(x,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(c,{label:"Loading",checked:C,onChange:z}),e.jsx(c,{label:"Disabled",checked:S,onChange:B}),e.jsx(c,{label:"Read-only",checked:k,onChange:G}),e.jsx(c,{label:"Clearable",checked:N,onChange:L}),e.jsx(c,{label:"Leading icon",checked:T,onChange:U})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Focus the field and use ",e.jsx("strong",{children:"↑ ↓"})," to move,"," ",e.jsx("strong",{children:"Home"})," / ",e.jsx("strong",{children:"End"})," to jump,"," ",e.jsx("strong",{children:"Enter"})," to choose and ",e.jsx("strong",{children:"Esc"})," to close — the cursor skips the disabled row. The trailing control clears while there is something to clear, and opens the list otherwise."]})]}),preview:e.jsxs("div",{className:"w-full max-w-md space-y-2",children:[e.jsx(r,{options:le,value:o,onChange:a=>{l(a),a===""&&i("onChange → cleared")},onSelect:a=>i(`onSelect → ${a.value}${a.disabled?" (blocked)":""}`),size:d,variant:b,tone:g,panelVariant:v,panelTone:h,panelCorner:y,raisedSurface:j,validationStatus:f,disabled:S,readOnly:k,loading:C,clearable:N,leadingIcon:T?"Search":void 0,placeholder:"Search regions…"}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Typed: ",e.jsx("code",{children:o||"—"})," — the popup is portaled and placed against the viewport, so it survives the nearest scroller’s edge; ",e.jsx("strong",{children:"Auto"})," pairs its surface with the field (a glass field opens a glass popup)."]}),e.jsx(ee,{log:s,emptyText:"No events yet — callbacks report through here."})]})})},re=["Apple","Apricot","Banana","Blackberry","Cherry","Fig"];function ce(){const[o,l]=t.useState(""),[s,i]=t.useState(null);return e.jsxs("div",{className:"w-full max-w-sm space-y-2",children:[e.jsx(r,{options:re,value:o,onChange:l,onSelect:d=>i(d.value),placeholder:"Search fruit…"}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Typed: ",e.jsx("code",{children:o||"—"})," · Chosen:"," ",e.jsx("code",{children:s??"—"})]})]})}const de=`import { useState } from "react";
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
`,ue=[{value:"eu-west-1",label:"Ireland",description:"eu-west-1",icon:"Globe"},{value:"eu-central-1",label:"Frankfurt",description:"eu-central-1",icon:"Globe"},{value:"us-east-1",label:"N. Virginia",description:"us-east-1",icon:"Globe"},{value:"ap-southeast-2",label:"Sydney",description:"Not enabled for this account",icon:"Globe",disabled:!0}];function pe(){const[o,l]=t.useState("eu-west-1");return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(r,{options:ue,value:o,onChange:l,leadingIcon:"Globe",placeholder:"Choose a region…"})})}const he=`import { useState } from "react";
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
`;function me(){const[o,l]=t.useState("");return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:D.map(s=>e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s}),e.jsx(r,{options:["Alpha","Beta","Gamma"],value:o,onChange:l,variant:s,placeholder:"Type to filter…"})]},s))})}const xe=`import { useState } from "react";
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
`;function be(){const[o,l]=t.useState(""),s=["Alpha","Beta","Gamma"];return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[K.map(i=>e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:i}),e.jsx(r,{options:s,value:o,onChange:l,validationStatus:i,placeholder:"Type to filter…"})]},i)),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"loading"}),e.jsx(r,{options:[],value:"",onChange:()=>{},loading:!0})]}),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"disabled"}),e.jsx(r,{options:s,value:"Alpha",onChange:()=>{},disabled:!0})]}),e.jsxs("label",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"read-only"}),e.jsx(r,{options:s,value:"Beta",onChange:()=>{},readOnly:!0})]})]})}const ge=`import { useState } from "react";
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
`,fe=[{id:"aeon/cmd/aeon/action.go",title:"aeon/cmd/aeon/action.go",subtitle:"file · aeon/cmd/aeon/action.go:1",icon:"File"}];function ve(){const[o,l]=t.useState("aeon/cmd/aeon/action.go"),[s,i]=t.useState("");return e.jsx("div",{className:"w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:e.jsxs(M,{gap:"sm",children:[e.jsx(A,{label:"Symbol",className:"w-80 max-w-full",children:e.jsx(H,{items:fe,selectedId:o,onSelect:d=>l(d.id),variant:"ghost",tone:"neutral"})}),e.jsx(A,{label:"Kind",className:"w-40 shrink-0",children:e.jsx(r,{options:["function","method","type","file"],value:s,onChange:i,placeholder:"Any kind",variant:"ghost",tone:"neutral"})}),e.jsx($,{color:"blue",children:"Explore"})]})})}const we=`import { useState } from "react";
import {
  Button,
  Combobox,
  FieldRow,
  FormField,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const ITEMS: PickerItem[] = [
  {
    id: "aeon/cmd/aeon/action.go",
    title: "aeon/cmd/aeon/action.go",
    subtitle: "file · aeon/cmd/aeon/action.go:1",
    icon: "File",
  },
];

/**
 * The combobox in its natural habitat. The \`Picker\` next to it renders
 * title + subtitle, so its trigger is two lines tall — inside a \`FieldRow\`
 * the combobox grows to match without a single alignment prop; its clear
 * button and caret ride the box's vertical centre.
 */
export default function InRow() {
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [kind, setKind] = useState("");

  return (
    <div className="w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <FieldRow gap="sm">
        <FormField label="Symbol" className="w-80 max-w-full">
          <Picker
            items={ITEMS}
            selectedId={symbol}
            onSelect={(item) => setSymbol(item.id)}
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <FormField label="Kind" className="w-40 shrink-0">
          <Combobox
            options={["function", "method", "type", "file"]}
            value={kind}
            onChange={setKind}
            placeholder="Any kind"
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <Button color="blue">Explore</Button>
      </FieldRow>
    </div>
  );
}
`,Ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(J,{name:"Combobox",description:"A text field that suggests without preventing: the list filters as you type, and whatever you leave in the field is the value. It renders `Input`, so the box, the sizes, the entry variants and the validation ring are the ones every other control in the kit uses — and it follows the ARIA combobox pattern, so the whole list is reachable from the keyboard."}),e.jsx(ie,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(u,{title:"Basics",description:"`onChange` fires on every keystroke — the field is free text. `onSelect` fires only when a row is actually chosen, which is usually the one to act on.",code:de,filename:"Basics.tsx",children:e.jsx(ce,{})}),e.jsx(u,{title:"Rich options",description:"An option can be a bare string or an object with a label, a description, an icon and a disabled flag. The keyboard cursor steps over a disabled row rather than landing on it and refusing.",code:he,filename:"RichOptions.tsx",children:e.jsx(pe,{})}),e.jsx(u,{title:"Variants and sizes",description:"Rendering `Input` rather than a second field implementation means every entry variant and every control size come for free, and the box lines up with the Button beside it.",code:xe,filename:"Variants.tsx",children:e.jsx(me,{})}),e.jsx(u,{title:"States",description:"`validationStatus` is the kit's one field-status scale — it used to be declared six separate times across the form controls. `loading`, `disabled` and `readOnly` complete the set.",code:ge,filename:"States.tsx",children:e.jsx(be,{})}),e.jsx(u,{title:"In a row",description:"Beside a two-line Picker in a FieldRow: the taller control sets the control band, the combobox grows to match and its clear button and caret ride the vertical centre.",code:we,filename:"InRow.tsx",children:e.jsx(ve,{})})]}),e.jsx(q,{props:[{name:"value / onChange / onSelect",type:"string / (value) => void / (option) => void",description:"The field is free text - onChange fires on every keystroke and whatever you leave typed is the value. onSelect fires only when a row is chosen, through mouse or Enter, which is the one to act on."},{name:"options",type:"(string | ComboboxOption)[]",description:"A bare string is shorthand for `{ value }`. An option can carry a label, a description, a registry icon and a disabled flag - the keyboard cursor steps over a disabled row rather than landing on it and refusing."},{name:"size / variant",type:"ControlSize / InputVariant",default:'"md" / "flat"',description:"The shared scales, straight through to the Input it renders - so the box lines up with the Button beside it and every entry variant comes for free."},{name:"tone (color)",type:"TrueColor",default:'"blue"',description:"The kit default accent for the focus ring, the check, and the row wash - under the mouse and under the keyboard cursor alike (in tone on the selected row). The suggestion list is the field’s shadow: it tints like the field does."},{name:"panelVariant / panelCorner / raisedSurface",type:'"auto" | SurfaceVariant / SurfaceCorner / boolean',default:'"auto" / "auto" / false',description:"The popup is a Panel from the container family, portaled to the body and placed against the viewport with a flip when there is more room above. Auto pairs its surface with the field through `SURFACE_VARIANT_FOR_FIELD` - a glass field opens a glass popup, not an opaque slab. `raisedSurface` forwards to that card, forcing the first nested-panels depth step - the tinted-card-on-matching-background fix."},{name:"validationStatus (error)",type:"ValidationStatus / boolean",default:'"none"',description:"The kit's one field-status scale; the boolean error flag is its alias. A free-text field should rarely set it - typing anything is legal here."},{name:"loading / emptyMessage / clearable",type:"boolean / ReactNode / boolean",default:"false / localized / true",description:"Loading spins in the field's trailing slot (visible even with the list closed) and replaces the rows with a spinner inside; the keyboard cursor will not step through or commit rows hidden behind it. An unmatched filter says so instead of opening a blank box. Both messages route through the kit catalogs. Clearable swaps the caret affordance for a clear button while there is something to clear - the spinner outranks it mid-fetch."},{name:"visibleRows / listClassName",type:"number / string",default:"6 / —",description:"Rows before the ScrollArea starts scrolling, capped further by the room left in the viewport. listClassName rides onto the popup card."}]}),e.jsxs(W,{children:[e.jsx(m,{title:"Screen reader",children:e.jsxs("p",{children:["A real ",e.jsx(n,{children:"combobox"})," driving a ",e.jsx(n,{children:"listbox"}),": ",e.jsx(n,{children:"aria-expanded"}),","," ",e.jsx(n,{children:"aria-controls"})," and ",e.jsx(n,{children:"aria-activedescendant"})," name the row the cursor is on, and the listbox keeps its role even while it only holds a spinner or the empty message - the field never points at nothing. Rows carry ",e.jsx(n,{children:"aria-selected"})," and ",e.jsx(n,{children:"aria-disabled"}),"."]})}),e.jsx(m,{title:"Keyboard support",children:e.jsxs("p",{children:["Focus or ",e.jsx(n,{children:"↓"})," opens, ",e.jsx(n,{children:"↑ ↓"})," move the cursor (skipping disabled rows and wrapping), ",e.jsx(n,{children:"Home"}),"/",e.jsx(n,{children:"End"})," jump, ",e.jsx(n,{children:"Enter"})," commits only a real row - free text you leave in place is the value."," ",e.jsx(n,{children:"Esc"})," closes the list and consumes the key so a host’s own Escape ladder (a modal, a docked field) keeps its rung; the next Escape goes to the host. The cursor scrolls its own row into view - the list needs no tab stop to be traversed."]})}),e.jsx(m,{title:"Internationalization",children:e.jsxs("p",{children:["The loading line, the empty message and the two trailing-affordance labels (",e.jsx(n,{children:"Clear"}),", ",e.jsx(n,{children:"Show options"}),") resolve through the kit catalogs; ",e.jsx(n,{children:"loadingMessage"})," and ",e.jsx(n,{children:"emptyMessage"})," override per instance. Filter matching is case-insensitive substring - no locale collation, so callers with accented labels may want to filter upstream."]})})]})]});export{Ve as ComboboxPage,Ve as default};
