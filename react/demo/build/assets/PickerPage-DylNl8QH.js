import{r as a,j as e,P as F,I as y,C as U,ca as o,c8 as _}from"./index-gt012o8E.js";import{P as $,A as H,a as b,C as t}from"./A11ySections-zw3_3X-2.js";import{P as W}from"./PageHeader-CzVhyXQL.js";import{E as v}from"./ExampleCard-V3REeYJ5.js";import{P as K,C as m,a as J,T as l}from"./PlaygroundPanel-Czrs7oXC.js";import{C as Q}from"./ControlAccordion-DIXHht2n.js";import{u as X,E as Y}from"./EventLog-Dx0vbma4.js";import{x as Z,d as ee,ba as te,R as se}from"./options-CtADNKbm.js";const ae=[{id:"a",title:"api-gateway",subtitle:"eu-west-1",tags:[{label:"running"}]},{id:"b",title:"worker-pool",subtitle:"us-east-1",tags:[{label:"paused"}]},{id:"c",title:"batch-runner",subtitle:"ap-south-1",tags:[{label:"stopped"}]}],ne=()=>{const[n,x]=a.useState("a"),[f,r]=a.useState([]),[i,E]=a.useState("blue"),[c,A]=a.useState("md"),[d,M]=a.useState("flat"),[h,z]=a.useState("none"),[p,V]=a.useState("subtle"),[k,L]=a.useState(!1),[S,O]=a.useState(!1),[u,R]=a.useState(!1),[I,G]=a.useState(!1),[w,q]=a.useState(!0),[N,T]=a.useState(!1),[g,D]=a.useState(!1),[B,P]=X(),C=e.jsx(o,{items:ae,tone:i,size:c,variant:d,validationStatus:h,glowIntensity:p,loading:S,disabled:u,multi:k,selectedId:n,onSelect:s=>{x(s.id),P(`select → ${s.title}`)},selectedIds:f,onMultiChange:s=>{r(s),P(`multi → ${s.length} selected`)},defaultFilter:I?{label:"Running",predicate:s=>s.tags?.[0]?.label==="running"}:void 0});return e.jsx(K,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Variant",options:Z,value:d,onChange:s=>M(s)}),e.jsx(J,{label:"Tone",children:e.jsx(U,{selectable:!0,size:"sm",value:i,onSelect:E,defaultExpanded:!0})}),e.jsx(m,{label:"Size",options:ee,value:c,onChange:s=>A(s)}),e.jsx(m,{label:"Validation",options:te,value:h,onChange:s=>z(s)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Multi-select",checked:k,onChange:L}),e.jsx(l,{label:"Default filter",checked:I,onChange:G}),e.jsx(l,{label:"Loading",checked:S,onChange:O}),e.jsx(l,{label:"Disabled",checked:u,onChange:R}),e.jsx(l,{label:"Compare with Input",checked:w,onChange:q})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"In a panel",checked:N,onChange:T}),e.jsx(l,{label:"On a glass panel",checked:g,onChange:s=>{D(s),s&&T(!0)}})]})},...d==="gradient"||g?[{id:"glow",title:"Glow",controls:e.jsx(m,{label:"Glow",options:se,value:p,onChange:s=>V(s)})}]:[]]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The surface, padding, type scale and focus treatment all come from the shared field system in the theme — the same one"," ",e.jsx("code",{children:"Input"}),", ",e.jsx("code",{children:"Select"})," and ",e.jsx("code",{children:"SearchBar"})," ","use. Turn on ",e.jsx("strong",{children:"Compare with Input"})," and change the size: the two stay aligned, which they could not before, when this control had a two-entry size scale and a hardcoded white box. The dropdown itself is portaled, so a panel host never clips it."]}),e.jsx(Y,{log:B,emptyText:"No events yet — selections report through here."})]}),preview:e.jsx("div",{className:"w-full",children:N?e.jsx(F,{corner:"none",variant:g?"liquid-glass":"outlined",tone:g?i:"neutral",padding:"md",scrollable:!1,children:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[C,w&&e.jsx(y,{placeholder:"An Input, same size and variant",tone:i,size:c,variant:d,validationStatus:h,glowIntensity:p,disabled:u})]})}):e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[C,w&&e.jsx(y,{placeholder:"An Input, same size and variant",tone:i,size:c,variant:d,validationStatus:h,glowIntensity:p,disabled:u})]})})})};function ie(){const[n,x]=a.useState("a"),f=[{id:"a",title:"api-gateway"},{id:"b",title:"worker-pool"}];return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:["red","green","blue","violet"].map(r=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wide opacity-60",children:r}),e.jsx(o,{items:f,color:r,selectedId:n,onSelect:i=>x(i.id)})]},r))})}const le=`import { useState } from "react";
import { Picker } from "@cjlapao/ui-kit";

/**
 * Open each one: the trigger ring, the selected row and the filter chip all
 * come from tokens generated off \`TRUE_COLORS\`.
 *
 * The literal map this replaced spelled \`red\` with **rose** and \`green\` with
 * **emerald**. Because those literals were also what Tailwind scanned,
 * \`ring-red-500/20\` had never been emitted — so fixing the map alone would
 * have rendered those tones with no colour at all until the safelist gained
 * the shape too.
 */
export default function Tones() {
  const [id, setId] = useState("a");
  const items = [
    { id: "a", title: "api-gateway" },
    { id: "b", title: "worker-pool" },
  ];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["red", "green", "blue", "violet"] as const).map((color) => (
        <div key={color} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide opacity-60">
            {color}
          </span>
          <Picker
            items={items}
            color={color}
            selectedId={id}
            onSelect={(i) => setId(i.id)}
          />
        </div>
      ))}
    </div>
  );
}
`,oe=[{id:"a",title:"api-gateway",subtitle:"eu-west-1"}];function re(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:_.map(n=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:n}),e.jsx(o,{items:oe,selectedId:"a",variant:n})]},n))})}const de=`import { Picker } from "@cjlapao/ui-kit";
import { INPUT_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [{ id: "a", title: "api-gateway", subtitle: "eu-west-1" }];

/**
 * Every \`InputVariant\` the other fields offer. The trigger used to paint a
 * hardcoded \`bg-white dark:bg-neutral-900\` with a \`border-neutral-300\`, so
 * none of these were reachable — a Picker could not be glass, ghost,
 * underlined, elevated or gradient while every sibling field could.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">
            {variant}
          </span>
          <Picker items={ITEMS} selectedId="a" variant={variant} />
        </div>
      ))}
    </div>
  );
}
`,j=[{id:"a",title:"api-gateway",subtitle:"eu-west-1"},{id:"b",title:"worker-pool",subtitle:"us-east-1"}];function ce(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Loading (trigger disabled)"}),e.jsx(o,{items:[],loading:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Disabled"}),e.jsx(o,{items:j,selectedId:"a",disabled:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Error"}),e.jsx(o,{items:j,validationStatus:"error"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Beside an Input"}),e.jsx(o,{items:j,selectedId:"a"}),e.jsx(y,{placeholder:"Same size, same variant"})]})]})}const he=`import { Input, Picker } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "a", title: "api-gateway", subtitle: "eu-west-1" },
  { id: "b", title: "worker-pool", subtitle: "us-east-1" },
];

/**
 * Every state comes from the shared field system, so a Picker and an Input
 * side by side agree on all of them — the surface, the padding, the error
 * border, the disabled treatment.
 *
 * The loading row is the one that used to be wrong: the spinner and copy had
 * no \`flex-1\` between them, so the chevron sat against the word "Loading…"
 * instead of at the trailing edge where every other state puts it.
 *
 * \`loading\` also disables the trigger — there is nothing to pick yet, and
 * opening onto an empty list reads as "no results" rather than "not ready". It
 * takes a wait cursor rather than the disabled dim, because the spinner
 * already says why the control is inert.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Loading (trigger disabled)
        </span>
        <Picker items={[]} loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Disabled
        </span>
        <Picker items={ITEMS} selectedId="a" disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Error
        </span>
        <Picker items={ITEMS} validationStatus="error" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Beside an Input
        </span>
        <Picker items={ITEMS} selectedId="a" />
        <Input placeholder="Same size, same variant" />
      </div>
    </div>
  );
}
`,ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(W,{name:"Picker",description:"A searchable single- or multi-select over rich rows — icon, title, subtitle, description and pills. The list is portaled and flips above the trigger when there is no room below."}),e.jsx(ne,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(v,{title:"Variants",description:"Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable.",code:de,filename:"Variants.tsx",children:e.jsx(re,{})}),e.jsx(v,{title:"Loading, disabled and error",description:"All three come from the shared field system, so a Picker and an Input agree on them. The loading row's chevron now sits at the trailing edge — it used to sit against the word Loading.",code:he,filename:"States.tsx",children:e.jsx(ce,{})}),e.jsx(v,{title:"Tones",description:"Generated from the palette. The literal map this replaced spelled red as rose and green as emerald — and since those literals were also what Tailwind scanned, the correct classes had never been emitted.",code:le,filename:"Tones.tsx",children:e.jsx(ie,{})})]}),e.jsx($,{props:[{name:"items",type:"PickerItem[]",description:"Rich rows: `title`, `subtitle`, `description`, `icon`, `tags`. This is why the widget is an ARIA listbox rather than a native <select> — native options cannot carry this content."},{name:"selectedId",type:"string",description:"Single-select selection. Omit for uncontrolled none; the trigger shows `placeholder` until something is picked."},{name:"onSelect",type:"(item: PickerItem) => void",description:"Fires with the whole item — the row, not just its id, so callers rarely need a lookup."},{name:"multi / selectedIds / onMultiChange",type:"boolean / string[] / (ids) => void",description:"Multi-select mode: `aria-multiselectable` on the listbox, pills on the trigger, and a `3 selected / Clear` summary when they overflow `maxPillsShown`."},{name:"defaultFilter",type:"{ label, predicate }",description:"A pre-applied slice of the list with a toggle in the search row — the search placeholder names the active slice (&ldquo;Search running items…&rdquo;) so users never wonder what they are searching."},{name:"placeholder / emptyMessage / loadingMessage",type:"string",description:"All optional — and their defaults now live in the kit catalogue, so leaving them out gets the user&rsquo;s language, not English."},{name:"loading",type:"boolean",default:"false",description:"Disables the trigger (a loading picker must not be re-opened) with a wait cursor rather than the disabled dim, and shows a spinner row while keeping the list browsable."},{name:"tone / color",type:"TrueColor",default:'"blue"',description:"The shared field tone. `color` is the deprecated alias and `tone` wins when both are set — the family rule."},{name:"variant / size / validationStatus / glow trio",type:"InputVariant / ControlSize / ValidationStatus / …",description:"Straight from the field system shared with Input, Select and SearchBar — same surfaces, same scale, same focus treatment, so a Picker stacked beside an Input lines up."},{name:"escapeBoundary",type:"boolean",default:"—",description:"@deprecated — accepted and ignored. The dropdown is portaled to the document root, so it always positions against the viewport: inside a scrollable Panel or a Modal the popup lands below the field either way, the way the DatePicker&rsquo;s overlay has since been fixed. And Escape was never this flag&rsquo;s business: while the dropdown is open its Escape handler consumes the key, so only the dropdown closes and the Modal behind it survives — no flag needed."},{name:"fullWidth / fullHeight / maxPillsShown",type:"boolean / boolean / number",description:"Layout knobs: fill the container, let the list grow past the capped dropdown height, and how many pills before the count summary."}]}),e.jsxs(H,{children:[e.jsx(b,{title:"Screen reader",children:e.jsxs("p",{children:["A deliberate ARIA implementation: the search field is a"," ",e.jsx(t,{children:'role="combobox"'})," driving a"," ",e.jsx(t,{children:'role="listbox"'})," of ",e.jsx(t,{children:'role="option"'})," ","rows, with the keyboard highlight announced through"," ",e.jsx(t,{children:"aria-activedescendant"})," — focus never leaves the field, so the typed query survives. A native ",e.jsx(t,{children:"<select>"})," cannot host icon-subtitle-tag rows, so the pattern is not laziness; the localized names (“Search options”, “Options”) come from the kit catalogue, not from hardcoded English."]})}),e.jsx(b,{title:"Keyboard support",children:e.jsxs("p",{children:[e.jsx(t,{children:"Enter"})," or ",e.jsx(t,{children:"Space"})," opens; opening highlights and announces the first option (or the selected one); ",e.jsx(t,{children:"↑"})," ",e.jsx(t,{children:"↓"})," move the highlight, ",e.jsx(t,{children:"Home"}),"/",e.jsx(t,{children:"End"})," jump, ",e.jsx(t,{children:"Enter"})," confirms,"," ",e.jsx(t,{children:"Escape"})," closes ",e.jsx("em",{children:"only"})," the dropdown — the key is consumed while it is open, so the Modal behind it survives. Clicking the filter pill toggles the slice without moving focus out of the search field, so keyboard state survives."]})}),e.jsx(b,{title:"Internationalization",children:e.jsxs("p",{children:["Everything visible by default is a kit string —"," ",e.jsx(t,{children:"kit.picker.placeholder"}),", ",e.jsx(t,{children:"empty"}),", ",e.jsx(t,{children:"loading"}),", the three search placeholders (including the interpolated ",e.jsx(t,{children:"searchIn"}),", “Search ","{group}"," items…”), ",e.jsx(t,{children:"selectedCount"})," and the accessible names — so an untouched ",e.jsx(t,{children:"<Picker items />"})," ","renders in the user’s language. The items themselves are caller content, translated upstream. The German tests assert “Wird geladen…” and the German listbox names, because these defaults used to be English baked into the component — the kind of bug no one sees until they are wrong in front of a user."]})})]})]});export{ve as PickerPage,ve as default};
