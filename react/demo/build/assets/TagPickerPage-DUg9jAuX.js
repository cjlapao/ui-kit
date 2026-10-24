import{r as s,j as e,P as U,I as N,C as B,eM as i,c8 as F}from"./index-gt012o8E.js";import{P as $,A as D,a as x,C as t}from"./A11ySections-zw3_3X-2.js";import{P as K}from"./PageHeader-CzVhyXQL.js";import{E as f}from"./ExampleCard-V3REeYJ5.js";import{P as H,C as g,a as W,T as r}from"./PlaygroundPanel-Czrs7oXC.js";import{C as J}from"./ControlAccordion-DIXHht2n.js";import{u as Q,E as X}from"./EventLog-Dx0vbma4.js";import{x as Y,d as Z,ba as ee,R as ae}from"./options-CtADNKbm.js";const te=[{id:"prod",label:"prod"},{id:"staging",label:"staging"},{id:"gpu",label:"gpu"},{id:"docker",label:"docker",tags:[{label:"container"}]},{id:"beta",label:"beta"}],se=()=>{const[n,d]=s.useState(["prod"]),[l,I]=s.useState("blue"),[c,P]=s.useState("md"),[o,E]=s.useState("flat"),[p,V]=s.useState("none"),[h,A]=s.useState("subtle"),[w,O]=s.useState(!0),[b,R]=s.useState(!0),[j,q]=s.useState(!1),[y,L]=s.useState(!1),[m,M]=s.useState(!0),[k,C]=s.useState(!1),[u,z]=s.useState(!1),[G,S]=Q(),T=e.jsx(i,{items:te,value:n,onChange:a=>{d(a),S(`${a.length} selected`)},onCreateItem:a=>{d(_=>[..._,a]),S(`create → ${a}`)},tone:l,size:c,variant:o,validationStatus:p,glowIntensity:h,multi:w,allowCreate:b,readOnly:j,loading:y});return e.jsx(H,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(J,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:Y,value:o,onChange:a=>E(a)}),e.jsx(W,{label:"Tone",children:e.jsx(B,{selectable:!0,size:"sm",value:l,onSelect:I,defaultExpanded:!0})}),e.jsx(g,{label:"Size",options:Z,value:c,onChange:a=>P(a)}),e.jsx(g,{label:"Validation",options:ee,value:p,onChange:a=>V(a)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Multi-select",checked:w,onChange:O}),e.jsx(r,{label:"Allow create",checked:b,onChange:R}),e.jsx(r,{label:"Read-only",checked:j,onChange:q}),e.jsx(r,{label:"Loading",checked:y,onChange:L}),e.jsx(r,{label:"Compare with Input",checked:m,onChange:M})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"In a panel",checked:k,onChange:C}),e.jsx(r,{label:"On a glass panel",checked:u,onChange:a=>{z(a),a&&C(!0)}})]})},...o==="gradient"||u?[{id:"glow",title:"Glow",controls:e.jsx(g,{label:"Glow",options:ae,value:h,onChange:a=>A(a)})}]:[]]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The surface, padding, type scale and focus treatment come from the shared field system — the same one ",e.jsx("code",{children:"Input"}),","," ",e.jsx("code",{children:"Select"})," and ",e.jsx("code",{children:"Picker"})," use. Type something that matches nothing to see the create row; items added this session are flagged ",e.jsx("strong",{children:"new"}),". The dropdown is portaled and scrolls through the kit’s own ",e.jsx("code",{children:"ScrollArea"}),", so a panel host never clips or repositions it."]}),e.jsx(X,{log:G,emptyText:"No events yet — selections and creates report through here."})]}),preview:e.jsx("div",{className:"w-full",children:k?e.jsx(U,{corner:"none",variant:u?"liquid-glass":"outlined",tone:u?l:"neutral",padding:"md",scrollable:!1,children:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[T,m&&e.jsx(N,{placeholder:"An Input, same size and variant",tone:l,size:c,variant:o,validationStatus:p,glowIntensity:h})]})}):e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[T,m&&e.jsx(N,{placeholder:"An Input, same size and variant",tone:l,size:c,variant:o,validationStatus:p,glowIntensity:h})]})})})};function ne(){const[n,d]=s.useState(["prod"]);return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(i,{allowCreate:!0,items:[{id:"prod",label:"prod"},{id:"staging",label:"staging"}],value:n,onChange:d})})}const re=`import { useState } from "react";
import { TagPicker } from "@cjlapao/ui-kit";

/**
 * With \`allowCreate\`, a query matching nothing offers a create row. Values
 * added during this session are highlighted so the user can see what they just
 * did — both in the trigger pills and in the list.
 */
export default function Create() {
  const [value, setValue] = useState<string[]>(["prod"]);
  return (
    <div className="w-full max-w-sm">
      <TagPicker
        allowCreate
        items={[
          { id: "prod", label: "prod" },
          { id: "staging", label: "staging" },
        ]}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
`,ie=[{id:"prod",label:"prod"},{id:"gpu",label:"gpu"}];function le(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:F.map(n=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:n}),e.jsx(i,{items:ie,value:["prod"],onChange:()=>{},variant:n})]},n))})}const oe=`import { TagPicker } from "@cjlapao/ui-kit";
import { INPUT_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "gpu", label: "gpu" },
];

/**
 * Every \`InputVariant\` the other fields offer. The trigger painted a hardcoded
 * \`bg-white dark:bg-neutral-900\` before, so none of these were reachable.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <TagPicker
            items={ITEMS}
            value={["prod"]}
            onChange={() => {}}
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
}
`,v=[{id:"prod",label:"prod"},{id:"gpu",label:"gpu"}];function de(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Loading (trigger disabled)"}),e.jsx(i,{items:[],value:[],onChange:()=>{},loading:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Disabled"}),e.jsx(i,{items:v,value:["prod"],onChange:()=>{},disabled:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Read-only"}),e.jsx(i,{items:v,value:["prod","gpu"],onChange:()=>{},readOnly:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Error"}),e.jsx(i,{items:v,value:[],onChange:()=>{},validationStatus:"error"})]})]})}const ce=`import { TagPicker } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "gpu", label: "gpu" },
];

/**
 * \`loading\` disables the trigger as well as showing the spinner: there is
 * nothing to pick yet, and opening onto an empty list reads as "no results"
 * rather than "not ready". It takes a wait cursor rather than the disabled
 * dim, because the spinner already says why the control is inert.
 *
 * \`readOnly\` dims instead of repainting the surface — a neutral fill here was
 * a same-specificity fight with the variant's own, and turned a glass or
 * underline trigger into an opaque grey slab.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Loading (trigger disabled)</span>
        <TagPicker items={[]} value={[]} onChange={() => {}} loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Disabled</span>
        <TagPicker items={ITEMS} value={["prod"]} onChange={() => {}} disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Read-only</span>
        <TagPicker items={ITEMS} value={["prod", "gpu"]} onChange={() => {}} readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Error</span>
        <TagPicker items={ITEMS} value={[]} onChange={() => {}} validationStatus="error" />
      </div>
    </div>
  );
}
`,we=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(K,{name:"Tag Picker",description:"A multi-select that renders its selection as removable pills, with optional free-text creation. Arrow keys and Enter drive the list; Backspace on an empty query removes the last tag."}),e.jsx(se,{}),e.jsx($,{props:[{name:"items / value / onChange",type:"TagPickerItem[] / string[] / (values) => void",description:"Known options and the controlled selection. A value with no matching item is a free-text entry and renders with its raw text as the pill label."},{name:"multi",type:"boolean",default:"true",description:"Off, the picker behaves as single-select: a pick replaces the value and the dropdown closes."},{name:"allowCreate / onCreateItem",type:"boolean / (label) => void",default:"false / —",description:"A query matching nothing (case-insensitively, against both labels and current values) offers a create row. Provided onCreateItem takes over persistence — the component only reports the confirmed label and the owner must store it; without it the text lands in value directly."},{name:"normalizeValue",type:"(value: string) => string",description:"Applied to creations and known-item picks alike, before the value is stored — e.g. (v) => v.toUpperCase()."},{name:"tagLimit",type:"number",default:"3",description:"Pills shown before a +N pill appears; clicking it expands, Show less collapses. 0 shows all."},{name:"highlightNew",type:"boolean",default:"true",description:'Values added during this session (absent from the first value) get an emerald pill and a new flag in the list — the cue for "what I just did"'},{name:"tone / itemColor",type:"TrueColor",default:'"blue" / falls back to tone',description:"tone accents the focus, open state and selected rows; itemColor re-tints the pills alone. color is a deprecated alias for tone."},{name:"size / variant / validationStatus",type:"ControlSize / InputVariant / ValidationStatus",description:"Straight from the field system shared with Input, Select, SearchBar and Picker — same surfaces, same scale, same focus treatment, so a TagPicker stacked beside an Input lines up."},{name:"panelVariant / panelCorner",type:'"auto" | SurfaceVariant / SurfaceCorner',default:'"auto"',description:"The dropdown card&rsquo;s surface and radius. auto follows the field&rsquo;s variant through SURFACE_VARIANT_FOR_FIELD — the mapping SmartInput&rsquo;s suggestion card uses — and resolves the corner through the theme&rsquo;s scale. The popup used to be a hardcoded white box."},{name:"readOnly / disabled / loading",type:"boolean",default:"false",description:"Read-only hides the remove buttons and dims rather than repainting — a neutral background override used to turn a glass trigger into a grey slab. Loading shows a spinner row and the chevron reports aria-busy."},{name:"escapeBoundary",type:"boolean",default:"—",description:"@deprecated — accepted and ignored. The dropdown is portaled to the document root, so it always positions against the viewport; inside a panel or modal the popup lands below the field either way."}]}),e.jsxs(D,{children:[e.jsx(x,{title:"Screen reader",children:e.jsxs("p",{children:["The trigger is a plain container — pills each carry their own named remove button (",e.jsx(t,{children:"Remove prod"}),"), so an interactive container would nest controls. The chevron is the named opener (",e.jsx(t,{children:"Toggle options"}),") with ",e.jsx(t,{children:'aria-haspopup="listbox"'}),"; while open, the search input is the combobox driving the listbox through ",e.jsx(t,{children:"aria-activedescendant"}),", and rows carry ",e.jsx(t,{children:"aria-selected"})," — true for checked rows, false otherwise, as a multi-selectable listbox requires."]})}),e.jsx(x,{title:"Keyboard support",children:e.jsxs("p",{children:[e.jsx(t,{children:"Enter"})," or ",e.jsx(t,{children:"Space"})," on the chevron opens; opening lights the first checked row (single mode lights the selection so it announces) — an empty multi list opens unlit until an arrow key asks for a cursor, because a lone lit row reads as picked. ",e.jsx(t,{children:"↑"})," ",e.jsx(t,{children:"↓"})," move,"," ",e.jsx(t,{children:"Enter"})," toggles (staying open in multi), ",e.jsx(t,{children:"Backspace"})," on an empty query removes the last pill, ",e.jsx(t,{children:"Escape"})," closes only the dropdown."]})}),e.jsx(x,{title:"Internationalization",children:e.jsxs("p",{children:["Every default and label routes through the kit catalogs — placeholders, empty and loading rows, the create row, the ",e.jsx(t,{children:"new"})," ","flag, Show ","{count}"," more tags, and all aria names. A German page gets ",e.jsx(t,{children:"Optionen umschalten"})," and ",e.jsx(t,{children:"prod entfernen"})," with no English leaking through destructuring defaults."]})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(f,{title:"Variants",description:"Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable.",code:oe,filename:"Variants.tsx",children:e.jsx(le,{})}),e.jsx(f,{title:"Loading, disabled, read-only and error",description:"Loading disables the trigger as well as showing the spinner — there is nothing to pick yet. Read-only dims rather than repainting the surface, which used to turn a glass trigger into a grey slab.",code:ce,filename:"States.tsx",children:e.jsx(de,{})}),e.jsx(f,{title:"Creating values",description:"A query matching nothing offers a create row, and values added this session are flagged so the user can see what they just did.",code:re,filename:"Create.tsx",children:e.jsx(ne,{})})]})]});export{we as TagPickerPage,we as default};
