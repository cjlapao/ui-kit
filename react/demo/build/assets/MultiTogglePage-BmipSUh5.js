import{r as s,j as e,M as r,P as N,C as R,v as G,ez as D,eA as W}from"./index-gt012o8E.js";import{P as U,A as q,a as u,C as t}from"./A11ySections-zw3_3X-2.js";import{P as B}from"./PageHeader-CzVhyXQL.js";import{E as p}from"./ExampleCard-V3REeYJ5.js";import{P as F,C as d,a as H,T as i}from"./PlaygroundPanel-Czrs7oXC.js";import{C as Z}from"./ControlAccordion-DIXHht2n.js";import{u as $,E as K}from"./EventLog-Dx0vbma4.js";import{e as J,d as Q}from"./options-CtADNKbm.js";const X=[{label:"solid",value:"solid"},{label:"soft",value:"soft"},{label:"tonal",value:"tonal"}],Y=["none","xs","sm","md","lg","xl","full"].map(l=>({label:l,value:l})),y=[{value:"day",label:"Day"},{value:"week",label:"Week"},{value:"month",label:"Month"}],ee=()=>{const[l,o]=s.useState("week"),[a,S]=s.useState("md"),[c,C]=s.useState("blue"),[g,I]=s.useState("subtle"),[m,O]=s.useState("solid"),[x,f]=s.useState(!1),[h,P]=s.useState(!1),[v,E]=s.useState("lg"),[b,L]=s.useState(!1),[j,A]=s.useState(!1),[w,M]=s.useState(!1),[z,V]=$(),T=e.jsx(r,{options:w?y.map((n,_)=>({...n,icon:["Calendar","ChartLine","Clock"][_]})):y,value:l,onChange:n=>{o(n),V(`change → ${n}`)},size:a,tone:c,variant:g,indicator:m,rounded:v,fullWidth:b,disabled:j});return e.jsx(F,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Z,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Track variant",options:J,value:g,onChange:n=>I(n)}),e.jsx(d,{label:"Indicator",options:X,value:m,onChange:n=>O(n)}),e.jsx(H,{label:"Tone",children:e.jsx(R,{selectable:!0,size:"sm",value:c,onSelect:C,defaultExpanded:!0})}),e.jsx(d,{label:"Corner",options:Y,value:v,onChange:n=>E(n)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Full width",checked:b,onChange:L}),e.jsx(i,{label:"Icons",checked:w,onChange:M}),e.jsx(i,{label:"Disabled",checked:j,onChange:A}),e.jsx(d,{label:"Size",options:Q,value:a,onChange:n=>S(n)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"In a panel",checked:x,onChange:f}),e.jsx(i,{label:"On a glass panel",checked:h,onChange:n=>{P(n),n&&f(!0)}})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Focus a segment and use the ",e.jsx("strong",{children:"arrow keys"}),", Home and End. The track is a surface from the Panel family — switch"," ",e.jsx("strong",{children:"Track variant"})," to ",e.jsx("code",{children:"glass"})," and the ladder below stops being a demo trick; the indicator is the separate knob the old ",e.jsx("code",{children:"variant"})," union actually described."]}),e.jsx(K,{log:z,emptyText:"No events yet — the selected value reports through here."})]}),preview:e.jsx("div",{className:"w-full",children:x?e.jsx(N,{corner:"none",variant:h?"liquid-glass":"outlined",tone:h?c:"neutral",padding:"md",scrollable:!1,children:e.jsx("div",{className:"flex justify-center",children:T})}):e.jsx("div",{className:"flex justify-center",children:T})})})};function ae(){const[l,o]=s.useState("b");return e.jsx("div",{className:"flex flex-col items-start gap-3",children:G.map(a=>e.jsx(r,{size:a,value:l,onChange:o,options:[{value:"a",label:"One"},{value:"b",label:"Two"},{value:"c",label:"Three"}]},a))})}const te=`import { useState } from "react";
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
`,k=[{value:"a",label:"Day"},{value:"b",label:"Week"}];function ne(){const[l,o]=s.useState("b");return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-4",children:D.map(a=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-50",children:a}),e.jsx(N,{variant:a,tone:"violet",padding:"sm",corner:"rounded-lg",children:e.jsx("span",{className:"text-xs",children:"Panel"})}),e.jsx(r,{options:k,value:l,onChange:o,variant:a,tone:"violet",size:"sm"})]},a))}),e.jsx("div",{className:"flex flex-wrap gap-6",children:W.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(r,{options:k,value:l,onChange:o,indicator:a,tone:"violet"}),e.jsxs("span",{className:"text-[10px] uppercase tracking-wide opacity-50",children:["indicator: ",a]})]},a))})]})}const se=`import { useState } from "react";
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
`;function le(){const[l,o]=s.useState("b");return e.jsx("div",{className:"flex flex-wrap gap-4",children:["red","green","blue","violet","amber"].map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(r,{tone:a,value:l,onChange:o,options:[{value:"a",label:"A"},{value:"b",label:"B"}]}),e.jsx("span",{className:"text-[11px] opacity-60",children:a})]},a))})}const oe=`import { useState } from "react";
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
`,me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(B,{name:"Multi Toggle",description:"A segmented control — a radiogroup with a sliding indicator. The track takes the same eight surface variants as Panel, so it sits flush beside a card; the indicator is its own scale. Arrow keys, Home and End move the selection and skip disabled options."}),e.jsx(ee,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Track variants and indicators",description:"The track is a surface, so it takes the Panel family — each toggle here is paired with the Panel it matches. The indicator is separate: it is what the old `theme | solid | soft` variant was really describing.",code:se,filename:"Variants.tsx",children:e.jsx(ne,{})}),e.jsx(p,{title:"Sizes",description:"The full shared control scale. It used to declare its own `sm | md | lg`, so a toggle could not line up with the `xs` or `xl` Button beside it.",code:te,filename:"Sizes.tsx",children:e.jsx(ae,{})}),e.jsx(p,{title:"Tones",description:"Generated from the theme. The 21-entry map this replaced had `green` painting emerald classes and `red` painting rose, so those two tones rendered as their neighbours.",code:oe,filename:"Tones.tsx",children:e.jsx(le,{})})]}),e.jsx(U,{props:[{name:"options",type:"MultiToggleOption[]",description:"`value`, `label`, `icon` (registry name or element), `disabled`, and an optional fixed `width` for icon-only segments. Labels are ReactNodes and entirely the caller&rsquo;s — this component owns no strings."},{name:"value",type:"string",description:"The selected option&rsquo;s value. Selection always lives up here — one option is always the radio that is checked."},{name:"onChange",type:"(value: string) => void",description:"Fires with the new value — from clicks and from the arrow keys alike, which is the whole point of a radiogroup that handles keys."},{name:"variant",type:"SurfaceVariant",default:'"subtle"',description:"The track, from the Panel family — eight surfaces that read identically beside a `Panel` at the same tone. (The old union described the indicator and is deprecated.)"},{name:"indicator",type:'"solid" | "soft" | "tonal"',default:'"solid"',description:"How the active segment is drawn, independent of the track — `solid` is a raised card with a full-strength hairline, `tonal` the most washed. All three carry a tone-following edge, because a white pill on a light track is nearly invisible."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Accent for the indicator edge, the active label and the focus ring — generated from the theme, so `green` is green. `color` is the deprecated alias; `tone` wins when both are set."},{name:"accentTone",type:"TrueColor",description:"Overrides only the active label&rsquo;s colour, leaving the edge on the tone. `accentColor` is the deprecated alias."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale — an `xs` or `xl` toggle lines up with the Button of the same size beside it. It used to declare its own three sizes."},{name:"rounded",type:"MultiToggleShape",default:'"lg"',description:"Track corner, with the indicator&rsquo;s corner lagging one step behind so the pill never pokes through the track."},{name:"disabled",type:"boolean",default:"false",description:"Disables the whole group — `aria-disabled` on the radiogroup, `tabIndex` pulled from every segment."},{name:"showOnlyActiveLabel",type:"boolean",default:"false",description:"Icon-only segments that widen to show the label only on the active one. The widths are measured, not guessed, so the pill lands where the text actually is."},{name:"fullWidth",type:"boolean",default:"false",description:"Segments share the width evenly."}]}),e.jsxs(q,{children:[e.jsx(u,{title:"Screen reader",children:e.jsxs("p",{children:["A real ",e.jsx(t,{children:'role="radiogroup"'})," of"," ",e.jsx(t,{children:'role="radio"'})," segments announcing state once, as"," ",e.jsx(t,{children:"aria-checked"}),". It used to also carry ",e.jsx(t,{children:"aria-pressed"})," — a radio’s state and a toggle button’s state on one element, in two vocabularies, so screen readers narrated the selection twice in different grammars. Disabled segments stay in the a11y tree as unchecked radios, which is how a user learns the option exists but is not available. Native props (",e.jsx(t,{children:"id"}),", ",e.jsx(t,{children:"aria-label"}),","," ",e.jsx(t,{children:"data-*"}),") land on the group, not once per option — they used to be spread onto every segment, so an ",e.jsx(t,{children:"id"})," appeared three times and an ",e.jsx(t,{children:"onClick"})," replaced each segment’s own handler."]})}),e.jsx(u,{title:"Keyboard support",children:e.jsxs("p",{children:["One ",e.jsx(t,{children:"Tab"})," stop — the selected segment — then ",e.jsx(t,{children:"←"})," ",e.jsx(t,{children:"→"})," ","(or ",e.jsx(t,{children:"↑"})," ",e.jsx(t,{children:"↓"}),") move the selection itself, not just the focus, wrapping at both ends; ",e.jsx(t,{children:"Home"})," and ",e.jsx(t,{children:"End"})," jump. Steps skip disabled options, so a keyboard user never has to arrow through an option that cannot be chosen. The stop tracks the ",e.jsx("em",{children:"selection"})," — the same ",e.jsx(t,{children:"value"})," the pill is drawn under — so there is never a split state where the pill says one segment and the keyboard enters at another."]})}),e.jsx(u,{title:"Internationalization",children:e.jsxs("p",{children:["Nothing to translate — deliberately. Every visible word is a label in"," ",e.jsx(t,{children:"options"}),", which is the caller’s content rendered as ReactNodes. What is ",e.jsx("em",{children:"not"})," language-neutral is order, and the kit keeps its hands off it: segments render in the order you pass, which means an RTL host flips them the way the arrow-key handling expects."]})})]})]});export{me as MultiTogglePage,me as default};
