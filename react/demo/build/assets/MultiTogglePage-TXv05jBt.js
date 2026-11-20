import{r as n,j as e,M as r,P as C,C as _,bk as G,hc as W,hd as D}from"./index-dkEsqyUy.js";import{P as F,A as H,a as g,C as a}from"./A11ySections-Ciyz8RbP.js";import{P as q}from"./PageHeader-Cqxw9jAs.js";import{E as h}from"./ExampleCard-SmeeyhOh.js";import{P as U,a as u,C as B,T as c}from"./PlaygroundPanel-CD4VThIT.js";import{C as Z}from"./ControlAccordion-BM7PEMt8.js";import{u as $,E as K}from"./EventLog-CkW2wQ_v.js";import{s as J,c as Q}from"./options-DH3jBuHJ.js";const X=[{label:"solid",value:"solid"},{label:"soft",value:"soft"},{label:"tonal",value:"tonal"}],Y=["none","xs","sm","md","lg","xl","full"].map(l=>({label:l,value:l})),k=[{value:"day",label:"Day"},{value:"week",label:"Week"},{value:"month",label:"Month"}],ee=()=>{const[l,o]=n.useState("week"),[t,p]=n.useState("md"),[d,i]=n.useState("blue"),[x,I]=n.useState("subtle"),[f,O]=n.useState("solid"),[v,b]=n.useState(!1),[m,P]=n.useState(!1),[w,L]=n.useState("lg"),[j,A]=n.useState(!1),[T,E]=n.useState(!1),[y,M]=n.useState(!1),[z,V]=$(),N=e.jsx(r,{options:y?k.map((s,R)=>({...s,icon:["Calendar","ChartLine","Clock"][R]})):k,value:l,onChange:s=>{o(s),V(`change → ${s}`)},size:t,tone:d,variant:x,indicator:f,rounded:w,fullWidth:j,disabled:T});return e.jsx(U,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Z,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Track variant",options:J,value:x,onChange:s=>I(s)}),e.jsx(u,{label:"Indicator",options:X,value:f,onChange:s=>O(s)}),e.jsx(B,{label:"Tone",children:e.jsx(_,{selectable:!0,size:"sm",value:d,onSelect:i,defaultExpanded:!0})}),e.jsx(u,{label:"Corner",options:Y,value:w,onChange:s=>L(s)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"Full width",checked:j,onChange:A}),e.jsx(c,{label:"Icons",checked:y,onChange:M}),e.jsx(c,{label:"Disabled",checked:T,onChange:E}),e.jsx(u,{label:"Size",options:Q,value:t,onChange:s=>p(s)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"In a panel",checked:v,onChange:b}),e.jsx(c,{label:"On a glass panel",checked:m,onChange:s=>{P(s),s&&b(!0)}})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Focus a segment and use the ",e.jsx("strong",{children:"arrow keys"}),", Home and End. The track is a surface from the Panel family — switch"," ",e.jsx("strong",{children:"Track variant"})," to ",e.jsx("code",{children:"glass"})," and the ladder below stops being a demo trick; the indicator is the separate knob the old ",e.jsx("code",{children:"variant"})," union actually described."]}),e.jsx(K,{log:z,emptyText:"No events yet — the selected value reports through here."})]}),preview:e.jsx("div",{className:"w-full",children:v?e.jsx(C,{corner:"none",variant:m?"liquid-glass":"outlined",tone:m?d:"neutral",padding:"md",scrollable:!1,children:e.jsx("div",{className:"flex justify-center",children:N})}):e.jsx("div",{className:"flex justify-center",children:N})})})};function te(){const[l,o]=n.useState("b");return e.jsx("div",{className:"flex flex-col items-start gap-3",children:G.map(t=>e.jsx(r,{size:t,value:l,onChange:o,options:[{value:"a",label:"One"},{value:"b",label:"Two"},{value:"c",label:"Three"}]},t))})}const ae=`import { useState } from "react";
import { CONTROL_SIZES, MultiToggle } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. It used to declare its own
 * \`"sm" | "md" | "lg"\`, so a toggle could not line up with the \`xs\` or \`xl\`
 * Button beside it.
 */
export default function Sizes() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex flex-col items-start gap-3">
      {CONTROL_SIZES.map((size) => (
        <MultiToggle
          key={size}
          size={size}
          value={value}
          onChange={setValue}
          options={[
            { value: "a", label: "One" },
            { value: "b", label: "Two" },
            { value: "c", label: "Three" },
          ]}
        />
      ))}
    </div>
  );
}
`,S=[{value:"a",label:"Day"},{value:"b",label:"Week"}];function ne(){const[l,o]=n.useState("b");return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-4",children:W.map(t=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-50",children:t}),e.jsx(C,{variant:t,tone:"violet",padding:"sm",corner:"rounded-lg",children:e.jsx("span",{className:"text-xs",children:"Panel"})}),e.jsx(r,{options:S,value:l,onChange:o,variant:t,tone:"violet",size:"sm"})]},t))}),e.jsx("div",{className:"flex flex-wrap gap-6",children:D.map(t=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(r,{options:S,value:l,onChange:o,indicator:t,tone:"violet"}),e.jsxs("span",{className:"text-[10px] uppercase tracking-wide opacity-50",children:["indicator: ",t]})]},t))})]})}const se=`import { useState } from "react";
import {
  MultiToggle,
  Panel,
  MULTI_TOGGLE_VARIANTS,
  MULTI_TOGGLE_INDICATORS,
} from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "a", label: "Day" },
  { value: "b", label: "Week" },
];

/**
 * The **track** takes the Panel surface family — the same eight variants, so a
 * toggle reads identically beside a card at the same tone. Each row here pairs
 * the toggle with the \`Panel\` it is matching.
 *
 * The **indicator** is a separate scale. It is what the old \`variant\` union
 * (\`theme | solid | soft\`) was actually describing: how the *active segment*
 * is drawn, which has nothing to do with the surface underneath it.
 */
export default function Variants() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MULTI_TOGGLE_VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide opacity-50">
              {variant}
            </span>
            <Panel
              variant={variant}
              tone="violet"
              padding="sm"
              corner="rounded-lg"
            >
              <span className="text-xs">Panel</span>
            </Panel>
            <MultiToggle
              options={OPTIONS}
              value={value}
              onChange={setValue}
              variant={variant}
              tone="violet"
              size="sm"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6">
        {MULTI_TOGGLE_INDICATORS.map((indicator) => (
          <div key={indicator} className="flex flex-col items-center gap-1">
            <MultiToggle
              options={OPTIONS}
              value={value}
              onChange={setValue}
              indicator={indicator}
              tone="violet"
            />
            <span className="text-[10px] uppercase tracking-wide opacity-50">
              indicator: {indicator}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
`,le=[{value:"once",label:"One step"},{value:"repeat",label:"Repeat for each item in the collection"},{value:"skip",label:"Skip"}];function oe(){const l=n.useId(),[o,t]=n.useState(300),[p,d]=n.useState("repeat");return e.jsxs("div",{className:"flex min-w-0 w-full flex-col gap-5",children:[e.jsxs("label",{htmlFor:l,className:"flex flex-col gap-2 text-sm",children:[e.jsxs("span",{children:["Parent width: ",o,"px"]}),e.jsx("input",{id:l,type:"range",min:180,max:640,step:10,value:o,onChange:i=>t(Number(i.target.value)),className:"w-full max-w-sm"})]}),[!1,!0].map(i=>e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("p",{className:"text-sm font-medium",children:i?"Full width: equal segments with ellipsis":"Auto width: natural label sizes"}),e.jsx("div",{style:{width:o,maxWidth:"100%"},className:"rounded-lg border border-dashed border-neutral-400 dark:border-neutral-500",children:e.jsx("div",{className:"min-w-0 py-3",children:e.jsx(r,{"aria-label":i?"Full width execution mode":"Auto width execution mode",options:le,value:p,onChange:d,fullWidth:i})})}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:i?"The control fits its parent. Hover or focus a shortened option to read it in full.":"The control grows up to the parent width, then shortens labels. Hover or focus an option to read its full label."})]},String(i)))]})}const ie=`import { useId, useState } from "react";
import { MultiToggle } from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "once", label: "One step" },
  { value: "repeat", label: "Repeat for each item in the collection" },
  { value: "skip", label: "Skip" },
];

export default function LongLabels() {
  const widthId = useId();
  const [width, setWidth] = useState(300);
  const [value, setValue] = useState("repeat");

  return (
    <div className="flex min-w-0 w-full flex-col gap-5">
      <label htmlFor={widthId} className="flex flex-col gap-2 text-sm">
        <span>Parent width: {width}px</span>
        <input
          id={widthId}
          type="range"
          min={180}
          max={640}
          step={10}
          value={width}
          onChange={(event) => setWidth(Number(event.target.value))}
          className="w-full max-w-sm"
        />
      </label>

      {[false, true].map((fullWidth) => (
        <div key={String(fullWidth)} className="flex min-w-0 flex-col gap-2">
          <p className="text-sm font-medium">
            {fullWidth ? "Full width: equal segments with ellipsis" : "Auto width: natural label sizes"}
          </p>
          <div
            style={{ width, maxWidth: "100%" }}
            className="rounded-lg border border-dashed border-neutral-400 dark:border-neutral-500"
          >
            <div className="min-w-0 py-3">
              <MultiToggle
                aria-label={fullWidth ? "Full width execution mode" : "Auto width execution mode"}
                options={OPTIONS}
                value={value}
                onChange={setValue}
                fullWidth={fullWidth}
              />
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {fullWidth
              ? "The control fits its parent. Hover or focus a shortened option to read it in full."
              : "The control grows up to the parent width, then shortens labels. Hover or focus an option to read its full label."}
          </p>
        </div>
      ))}
    </div>
  );
}
`;function re(){const[l,o]=n.useState("b");return e.jsx("div",{className:"flex flex-wrap gap-4",children:["red","green","blue","violet","amber"].map(t=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(r,{tone:t,value:l,onChange:o,options:[{value:"a",label:"A"},{value:"b",label:"B"}]}),e.jsx("span",{className:"text-[11px] opacity-60",children:t})]},t))})}const de=`import { useState } from "react";
import { MultiToggle } from "@cjlapao/ui-kit";

/**
 * \`tone\` is the accent — it used to be \`color\`, which is the name no other
 * control in the kit uses. \`color\` still works and is deprecated.
 *
 * The tokens are generated from the theme. The 21-entry map they replaced had
 * \`green\` painting **emerald** classes and \`red\` painting **rose**, so those
 * two rendered as their neighbours while the other nineteen were correct.
 */
export default function Tones() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex flex-wrap gap-4">
      {(["red", "green", "blue", "violet", "amber"] as const).map((color) => (
        <div key={color} className="flex flex-col items-center gap-1">
          <MultiToggle
            tone={color}
            value={value}
            onChange={setValue}
            options={[
              { value: "a", label: "A" },
              { value: "b", label: "B" },
            ]}
          />
          <span className="text-[11px] opacity-60">{color}</span>
        </div>
      ))}
    </div>
  );
}
`,ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(q,{name:"Multi Toggle",description:"A segmented control — a radiogroup with a sliding indicator. The track takes the same eight surface variants as Panel, so it sits flush beside a card; the indicator is its own scale. Arrow keys, Home and End move the selection and skip disabled options."}),e.jsx(ee,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Long labels in a narrow parent",description:"Resize the parent to compare natural label widths with full-width truncation. Select each option to check the indicator at both edges.",code:ie,filename:"LongLabels.tsx",children:e.jsx(oe,{})}),e.jsx(h,{title:"Track variants and indicators",description:"The track is a surface, so it takes the Panel family — each toggle here is paired with the Panel it matches. The indicator is separate: it is what the old `theme | solid | soft` variant was really describing.",code:se,filename:"Variants.tsx",children:e.jsx(ne,{})}),e.jsx(h,{title:"Sizes",description:"The full shared control scale. It used to declare its own `sm | md | lg`, so a toggle could not line up with the `xs` or `xl` Button beside it.",code:ae,filename:"Sizes.tsx",children:e.jsx(te,{})}),e.jsx(h,{title:"Tones",description:"Generated from the theme. The 21-entry map this replaced had `green` painting emerald classes and `red` painting rose, so those two tones rendered as their neighbours.",code:de,filename:"Tones.tsx",children:e.jsx(re,{})})]}),e.jsx(F,{props:[{name:"options",type:"MultiToggleOption[]",description:"`value`, `label`, `icon` (registry name or element), `disabled`, and an optional fixed `width` for icon-only segments. Labels are ReactNodes and entirely the caller&rsquo;s — this component owns no strings."},{name:"value",type:"string",description:"The selected option&rsquo;s value. Selection always lives up here — one option is always the radio that is checked."},{name:"onChange",type:"(value: string) => void",description:"Fires with the new value — from clicks and from the arrow keys alike, which is the whole point of a radiogroup that handles keys."},{name:"variant",type:"SurfaceVariant",default:'"subtle"',description:"The track, from the Panel family — eight surfaces that read identically beside a `Panel` at the same tone. (The old union described the indicator and is deprecated.)"},{name:"indicator",type:'"solid" | "soft" | "tonal"',default:'"solid"',description:"How the active segment is drawn, independent of the track — `solid` is a raised card with a full-strength hairline, `tonal` the most washed. All three carry a tone-following edge, because a white pill on a light track is nearly invisible."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Accent for the indicator edge, the active label and the focus ring — generated from the theme, so `green` is green. `color` is the deprecated alias; `tone` wins when both are set."},{name:"accentTone",type:"TrueColor",description:"Overrides only the active label&rsquo;s colour, leaving the edge on the tone. `accentColor` is the deprecated alias."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale — an `xs` or `xl` toggle lines up with the Button of the same size beside it. It used to declare its own three sizes."},{name:"rounded",type:"MultiToggleShape",default:'"lg"',description:"Track corner, with the indicator&rsquo;s corner lagging one step behind so the pill never pokes through the track."},{name:"disabled",type:"boolean",default:"false",description:"Disables the whole group — `aria-disabled` on the radiogroup, `tabIndex` pulled from every segment."},{name:"showOnlyActiveLabel",type:"boolean",default:"false",description:"Icon-only segments that widen to show the label only on the active one. The widths are measured, not guessed, so the pill lands where the text actually is."},{name:"fullWidth",type:"boolean",default:"false",description:"Segments share the width evenly."}]}),e.jsxs(H,{children:[e.jsx(g,{title:"Screen reader",children:e.jsxs("p",{children:["A real ",e.jsx(a,{children:'role="radiogroup"'})," of"," ",e.jsx(a,{children:'role="radio"'})," segments announcing state once, as"," ",e.jsx(a,{children:"aria-checked"}),". It used to also carry ",e.jsx(a,{children:"aria-pressed"})," — a radio’s state and a toggle button’s state on one element, in two vocabularies, so screen readers narrated the selection twice in different grammars. Disabled segments stay in the a11y tree as unchecked radios, which is how a user learns the option exists but is not available. Native props (",e.jsx(a,{children:"id"}),", ",e.jsx(a,{children:"aria-label"}),","," ",e.jsx(a,{children:"data-*"}),") land on the group, not once per option — they used to be spread onto every segment, so an ",e.jsx(a,{children:"id"})," appeared three times and an ",e.jsx(a,{children:"onClick"})," replaced each segment’s own handler."]})}),e.jsx(g,{title:"Keyboard support",children:e.jsxs("p",{children:["One ",e.jsx(a,{children:"Tab"})," stop — the selected segment — then ",e.jsx(a,{children:"←"})," ",e.jsx(a,{children:"→"})," ","(or ",e.jsx(a,{children:"↑"})," ",e.jsx(a,{children:"↓"}),") move the selection itself, not just the focus, wrapping at both ends; ",e.jsx(a,{children:"Home"})," and ",e.jsx(a,{children:"End"})," jump. Steps skip disabled options, so a keyboard user never has to arrow through an option that cannot be chosen. The stop tracks the ",e.jsx("em",{children:"selection"})," — the same ",e.jsx(a,{children:"value"})," the pill is drawn under — so there is never a split state where the pill says one segment and the keyboard enters at another."]})}),e.jsx(g,{title:"Internationalization",children:e.jsxs("p",{children:["Nothing to translate — deliberately. Every visible word is a label in"," ",e.jsx(a,{children:"options"}),", which is the caller’s content rendered as ReactNodes. What is ",e.jsx("em",{children:"not"})," language-neutral is order, and the kit keeps its hands off it: segments render in the order you pass, which means an RTL host flips them the way the arrow-key handling expects."]})})]})]});export{ve as MultiTogglePage,ve as default};
