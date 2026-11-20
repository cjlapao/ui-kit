import{r as t,j as e,P as D,I as P,C as K,ho as i,d as H}from"./index-dkEsqyUy.js";import{P as W,A as J,a as x,C as n}from"./A11ySections-Ciyz8RbP.js";import{P as Q}from"./PageHeader-Cqxw9jAs.js";import{E as f}from"./ExampleCard-SmeeyhOh.js";import{P as X,a as g,C as Y,T as r}from"./PlaygroundPanel-CD4VThIT.js";import{P as Z}from"./PanelSurfaceControls-BSP9RkAF.js";import{C as ee}from"./ControlAccordion-BM7PEMt8.js";import{u as ae,E as te}from"./EventLog-CkW2wQ_v.js";import{I as ne,c as se,bk as re,a0 as ie}from"./options-DH3jBuHJ.js";import"./SurfaceToneControl-CptLUoZR.js";const le=[{id:"prod",label:"prod"},{id:"staging",label:"staging"},{id:"gpu",label:"gpu"},{id:"docker",label:"docker",tags:[{label:"container"}]},{id:"beta",label:"beta"}],oe=()=>{const[s,d]=t.useState(["prod"]),[l,E]=t.useState("blue"),[c,V]=t.useState("md"),[o,A]=t.useState("flat"),[w,O]=t.useState("auto"),[b,R]=t.useState("auto"),[p,q]=t.useState("none"),[h,L]=t.useState("subtle"),[j,z]=t.useState(!0),[y,M]=t.useState(!0),[k,G]=t.useState(!1),[C,_]=t.useState(!1),[m,U]=t.useState(!0),[S,T]=t.useState(!1),[u,B]=t.useState(!1),[F,N]=ae(),I=e.jsx(i,{items:le,value:s,onChange:a=>{d(a),N(`${a.length} selected`)},onCreateItem:a=>{d($=>[...$,a]),N(`create → ${a}`)},tone:l,size:c,variant:o,panelVariant:w,panelTone:b,validationStatus:p,glowIntensity:h,multi:j,allowCreate:y,readOnly:k,loading:C});return e.jsx(X,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ee,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:ne,value:o,onChange:a=>A(a)}),e.jsx(Y,{label:"Tone",children:e.jsx(K,{selectable:!0,size:"sm",value:l,onSelect:E,defaultExpanded:!0})}),e.jsx(g,{label:"Size",options:se,value:c,onChange:a=>V(a)}),e.jsx(g,{label:"Validation",options:re,value:p,onChange:a=>q(a)}),e.jsx(Z,{panelVariant:w,onPanelVariant:O,panelTone:b,onPanelTone:R})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Multi-select",checked:j,onChange:z}),e.jsx(r,{label:"Allow create",checked:y,onChange:M}),e.jsx(r,{label:"Read-only",checked:k,onChange:G}),e.jsx(r,{label:"Loading",checked:C,onChange:_}),e.jsx(r,{label:"Compare with Input",checked:m,onChange:U})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"In a panel",checked:S,onChange:T}),e.jsx(r,{label:"On a glass panel",checked:u,onChange:a=>{B(a),a&&T(!0)}})]})},...o==="gradient"||u?[{id:"glow",title:"Glow",controls:e.jsx(g,{label:"Glow",options:ie,value:h,onChange:a=>L(a)})}]:[]]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The surface, padding, type scale and focus treatment come from the shared field system — the same one ",e.jsx("code",{children:"Input"}),","," ",e.jsx("code",{children:"Select"})," and ",e.jsx("code",{children:"Picker"})," use. Type something that matches nothing to see the create row; items added this session are flagged ",e.jsx("strong",{children:"new"}),". The dropdown is portaled and scrolls through the kit’s own ",e.jsx("code",{children:"ScrollArea"}),", so a panel host never clips or repositions it."]}),e.jsx(te,{log:F,emptyText:"No events yet — selections and creates report through here."})]}),preview:e.jsx("div",{className:"w-full",children:S?e.jsx(D,{corner:"none",variant:u?"liquid-glass":"outlined",tone:u?l:"neutral",padding:"md",scrollable:!1,children:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[I,m&&e.jsx(P,{placeholder:"An Input, same size and variant",tone:l,size:c,variant:o,validationStatus:p,glowIntensity:h})]})}):e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[I,m&&e.jsx(P,{placeholder:"An Input, same size and variant",tone:l,size:c,variant:o,validationStatus:p,glowIntensity:h})]})})})};function de(){const[s,d]=t.useState(["prod"]);return e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(i,{allowCreate:!0,items:[{id:"prod",label:"prod"},{id:"staging",label:"staging"}],value:s,onChange:d})})}const ce=`import { useState } from "react";
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
`,pe=[{id:"prod",label:"prod"},{id:"gpu",label:"gpu"}];function he(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:H.map(s=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:s}),e.jsx(i,{items:pe,value:["prod"],onChange:()=>{},variant:s})]},s))})}const ue=`import { TagPicker } from "@cjlapao/ui-kit";
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
`,v=[{id:"prod",label:"prod"},{id:"gpu",label:"gpu"}];function ge(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Loading (trigger disabled)"}),e.jsx(i,{items:[],value:[],onChange:()=>{},loading:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Disabled"}),e.jsx(i,{items:v,value:["prod"],onChange:()=>{},disabled:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Read-only"}),e.jsx(i,{items:v,value:["prod","gpu"],onChange:()=>{},readOnly:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Error"}),e.jsx(i,{items:v,value:[],onChange:()=>{},validationStatus:"error"})]})]})}const me=`import { TagPicker } from "@cjlapao/ui-kit";

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
`,Te=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Q,{name:"Tag Picker",description:"A multi-select that renders its selection as removable pills, with optional free-text creation. Arrow keys and Enter drive the list; Backspace on an empty query removes the last tag."}),e.jsx(oe,{}),e.jsx(W,{props:[{name:"items / value / onChange",type:"TagPickerItem[] / string[] / (values) => void",description:"Known options and the controlled selection. A value with no matching item is a free-text entry and renders with its raw text as the pill label."},{name:"multi",type:"boolean",default:"true",description:"Off, the picker behaves as single-select: a pick replaces the value and the dropdown closes."},{name:"allowCreate / onCreateItem",type:"boolean / (label) => void",default:"false / —",description:"A query matching nothing (case-insensitively, against both labels and current values) offers a create row. Provided onCreateItem takes over persistence — the component only reports the confirmed label and the owner must store it; without it the text lands in value directly."},{name:"normalizeValue",type:"(value: string) => string",description:"Applied to creations and known-item picks alike, before the value is stored — e.g. (v) => v.toUpperCase()."},{name:"tagLimit",type:"number",default:"3",description:"Pills shown before a +N pill appears; clicking it expands, Show less collapses. 0 shows all."},{name:"highlightNew",type:"boolean",default:"true",description:'Values added during this session (absent from the first value) get an emerald pill and a new flag in the list — the cue for "what I just did"'},{name:"tone / itemColor",type:"TrueColor",default:'"blue" / falls back to tone',description:"tone accents the focus, open state and selected rows; itemColor re-tints the pills alone. color is a deprecated alias for tone."},{name:"size / variant / validationStatus",type:"ControlSize / InputVariant / ValidationStatus",description:"Straight from the field system shared with Input, Select, SearchBar and Picker — same surfaces, same scale, same focus treatment, so a TagPicker stacked beside an Input lines up."},{name:"panelVariant / panelCorner",type:'"auto" | SurfaceVariant / SurfaceCorner',default:'"auto"',description:"The dropdown card&rsquo;s surface and radius. auto follows the field&rsquo;s variant through SURFACE_VARIANT_FOR_FIELD — the mapping SmartInput&rsquo;s suggestion card uses — and resolves the corner through the theme&rsquo;s scale. The popup used to be a hardcoded white box."},{name:"readOnly / disabled / loading",type:"boolean",default:"false",description:"Read-only hides the remove buttons and dims rather than repainting — a neutral background override used to turn a glass trigger into a grey slab. Loading shows a spinner row and the chevron reports aria-busy."},{name:"escapeBoundary",type:"boolean",default:"—",description:"@deprecated — accepted and ignored. The dropdown is portaled to the document root, so it always positions against the viewport; inside a panel or modal the popup lands below the field either way."}]}),e.jsxs(J,{children:[e.jsx(x,{title:"Screen reader",children:e.jsxs("p",{children:["The trigger is a plain container — pills each carry their own named remove button (",e.jsx(n,{children:"Remove prod"}),"), so an interactive container would nest controls. The chevron is the named opener (",e.jsx(n,{children:"Toggle options"}),") with ",e.jsx(n,{children:'aria-haspopup="listbox"'}),"; while open, the search input is the combobox driving the listbox through ",e.jsx(n,{children:"aria-activedescendant"}),", and rows carry ",e.jsx(n,{children:"aria-selected"})," — true for checked rows, false otherwise, as a multi-selectable listbox requires."]})}),e.jsx(x,{title:"Keyboard support",children:e.jsxs("p",{children:[e.jsx(n,{children:"Enter"})," or ",e.jsx(n,{children:"Space"})," on the chevron opens; opening lights the first checked row (single mode lights the selection so it announces) — an empty multi list opens unlit until an arrow key asks for a cursor, because a lone lit row reads as picked. ",e.jsx(n,{children:"↑"})," ",e.jsx(n,{children:"↓"})," move,"," ",e.jsx(n,{children:"Enter"})," toggles (staying open in multi), ",e.jsx(n,{children:"Backspace"})," on an empty query removes the last pill, ",e.jsx(n,{children:"Escape"})," closes only the dropdown."]})}),e.jsx(x,{title:"Internationalization",children:e.jsxs("p",{children:["Every default and label routes through the kit catalogs — placeholders, empty and loading rows, the create row, the ",e.jsx(n,{children:"new"})," ","flag, Show ","{count}"," more tags, and all aria names. A German page gets ",e.jsx(n,{children:"Optionen umschalten"})," and ",e.jsx(n,{children:"prod entfernen"})," with no English leaking through destructuring defaults."]})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(f,{title:"Variants",description:"Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable.",code:ue,filename:"Variants.tsx",children:e.jsx(he,{})}),e.jsx(f,{title:"Loading, disabled, read-only and error",description:"Loading disables the trigger as well as showing the spinner — there is nothing to pick yet. Read-only dims rather than repainting the surface, which used to turn a glass trigger into a grey slab.",code:me,filename:"States.tsx",children:e.jsx(ge,{})}),e.jsx(f,{title:"Creating values",description:"A query matching nothing offers a create row, and values added this session are flagged so the user can see what they just did.",code:ce,filename:"Create.tsx",children:e.jsx(de,{})})]})]});export{Te as TagPickerPage,Te as default};
