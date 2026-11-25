import{r as t,j as e,$ as Ae,P as _,C as Ie,gS as c}from"./index-CQwZVYnB.js";import{P as Re,A as Le,a as v,C as a,b as Ve,K as Ee}from"./A11ySections-BXfanEck.js";import{P as Ge}from"./PageHeader-BhZxEVHt.js";import{E as h}from"./ExampleCard-BZsKA5_g.js";import{P as De,C as p,S as r,T as o,a as Fe}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as Be}from"./ControlAccordion-C7vC6faF.js";import{u as He,E as We}from"./EventLog-B3ejPngN.js";import{S as qe}from"./SurfaceToneControl-LH37fS9y.js";import{H as w}from"./HueControl-B9PfQcfP.js";import{c as K,I as ze,s as $e,f as _e,p as Ke,M as Ue,a7 as Je,A as Qe,B as Xe,C as Ye}from"./options-Byh1yOHz.js";const U=["glass","liquid-glass"],Ze=[{label:"Multiple",value:"multiple"},{label:"Single",value:"single"}],et=[1,2,3,4,5,6].map(s=>({label:String(s),value:String(s)})),tt=[{value:"text",title:"Text",subtitle:"Prompt in, prose out",icon:"File",labels:["Text"]},{value:"image",title:"Image",subtitle:"Generated stills up to 4K",icon:"Image",labels:["Beta"]},{value:"code",title:"Code",subtitle:"Syntax-aware completions",icon:"Code",labels:[]},{value:"structured",title:"Structured data",subtitle:"JSON validated against your schema",icon:"List",labels:["Schema"]},{value:"transcription",title:"Transcription Services",subtitle:"Audio to text in 24 languages",icon:"Chat",labels:["Premium"],disabled:!0}],nt=()=>{const[s,i]=t.useState(["text"]),[l,d]=t.useState("multiple"),[u,X]=t.useState(!0),[T,Y]=t.useState(2),[P,Z]=t.useState("md"),[O,ee]=t.useState("md"),[b,te]=t.useState("elevated"),[N,ne]=t.useState("blue"),[M,ae]=t.useState("rounded-sm"),[A,se]=t.useState("sm"),[I,oe]=t.useState(!1),[R,le]=t.useState("flat"),[L,ie]=t.useState(void 0),[V,re]=t.useState(void 0),[E,ce]=t.useState(void 0),[G,de]=t.useState(void 0),[D,ue]=t.useState("blue"),[F,he]=t.useState("outline"),[B,pe]=t.useState("left"),[y,be]=t.useState(!1),[H,me]=t.useState(!1),[S,ge]=t.useState(!0),[W,xe]=t.useState(!0),[k,fe]=t.useState(!0),[j,ve]=t.useState(!0),[m,we]=t.useState(!0),[g,ye]=t.useState(!1),[x,Se]=t.useState(!1),[q,ke]=t.useState("frosted"),[z,je]=t.useState("medium"),[$,Ce]=t.useState("classic"),[Te,Pe]=He(),C=l==="single",Oe=U.includes(b)||x&&g||g&&U.includes(b),Ne=t.useMemo(()=>tt.map(n=>({...n,icon:k?n.icon:void 0,subtitle:j?n.subtitle:void 0,labels:m?n.labels:void 0})),[k,j,m]),Me=n=>{i(n),Pe(n.length?`selected ${n.join(", ")}${C?"":` (${n.length})`}`:"cleared")},f=e.jsx(c,{name:"modality",options:Ne,value:s,onChange:Me,selectionMode:l,allowDeselect:u,disabled:H,columns:T,gap:P,size:O,variant:b,tone:N,corner:M,padding:A,raisedSurface:I,checkboxVariant:R,checkboxTone:L,activeTone:V,pulseTone:E,hoverColor:G,labelTone:D,labelVariant:F,labelAlign:B,pulse:y,glassOpacity:q,vibrancy:z,specularMode:$,label:S?"Input and output":void 0,description:S&&W?"What this run accepts and what it can produce.":void 0});return e.jsx(De,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Be,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Selection mode",options:Ze,value:l,onChange:n=>d(n)}),e.jsx(r,{label:"Columns",options:et,value:String(T),onChange:n=>Y(Number(n))}),e.jsx(r,{label:"Gap",options:K,value:P,onChange:n=>Z(n)}),e.jsx(p,{label:"Card size",options:K,value:O,onChange:n=>ee(n)}),e.jsx(r,{label:"Checkbox variant",options:ze,value:R,onChange:n=>le(n)})]})},{id:"surface",title:"Card surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Variant",options:$e,value:b,onChange:n=>te(n)}),e.jsx(qe,{label:"Tone",value:N,onChange:ne}),e.jsx(r,{label:"Corner",options:_e,value:M,onChange:n=>ae(n)}),e.jsx(r,{label:"Padding",options:Ke,value:A,onChange:n=>se(n)}),e.jsx(o,{label:"Raised surface",checked:I,onChange:oe}),e.jsxs("div",{className:"grid grid-cols-2 gap-2 pt-1",children:[e.jsx(o,{label:"Pulse",checked:y,onChange:be}),e.jsx(o,{label:"Disabled group",checked:H,onChange:me})]})]})},{id:"hues",title:"Hues of its own",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Every one of these is also a per-option prop: a single card may outvote the group on any of them."}),e.jsx(w,{label:"Checkbox hue",value:L,onChange:ie,autoLabel:"Auto — the card’s tone"}),s.length>0?e.jsx(w,{label:"Selected hue",value:V,onChange:re,autoLabel:"Auto — borderColor, then tone"}):null,y?e.jsx(w,{label:"Pulse hue",value:E,onChange:ce,autoLabel:"Auto — the selected hue"}):null,e.jsx(w,{label:"Hover hue",value:G,onChange:de,autoLabel:"Auto — the selected hue while selected, else the card’s tone"})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Group label",checked:S,onChange:ge}),e.jsx(o,{label:"Description",checked:W,onChange:xe}),e.jsx(o,{label:"Icons",checked:k,onChange:fe}),e.jsx(o,{label:"Subtitles",checked:j,onChange:ve}),e.jsx(o,{label:"Label pills",checked:m,onChange:we}),C&&e.jsx(o,{label:"Allow deselect",checked:u,onChange:X})]})},...m?[{id:"labels",title:"Label pills",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(Fe,{label:"Pill tone",children:e.jsx(Ie,{selectable:!0,size:"sm",value:D,onSelect:ue,defaultExpanded:!0})}),e.jsx(r,{label:"Pill variant",options:Ue,value:F,onChange:n=>he(n)}),e.jsx(r,{label:"Pill alignment",options:Je,value:B,onChange:n=>pe(n)})]})}]:[],{id:"backdrop",title:"Backdrop",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"On a gradient",checked:g,onChange:ye}),e.jsx(o,{label:"Inside a panel",checked:x,onChange:Se})]})},...Oe?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(p,{label:"Specular",options:Qe,value:$,onChange:n=>Ce(n)}),e.jsx(p,{label:"Vibrancy",options:Xe,value:z,onChange:n=>je(n)}),e.jsx(p,{label:"Glass opacity",options:Ye,value:q,onChange:n=>ke(n)})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The card is the control: click anywhere on it, or focus it and press"," ",e.jsx("em",{children:"Space"}),". In ",e.jsx("strong",{children:"single"})," mode the group is one tab stop and the arrow keys walk and pick; in ",e.jsx("strong",{children:"multiple"})," ","every card is its own tab stop. ",e.jsx("strong",{children:"Transcription Services"})," is disabled per option, so it never submits."]}),e.jsx(We,{log:Te,emptyText:"No events yet — pick a card, or arrow through single mode."})]}),preview:e.jsxs("div",{className:"w-full space-y-4",children:[g?e.jsx(Ae,{theme:"fog",noise:!0,className:"w-full rounded-xl p-4",children:x?e.jsx(_,{corner:"none",variant:"simple",padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full py-2",children:f})}):e.jsx("div",{className:"w-full py-2",children:f})}):x?e.jsx(_,{corner:"none",variant:"simple",padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full py-2",children:f})}):e.jsx("div",{className:"w-full py-2",children:f}),e.jsx("div",{className:"rounded-lg border border-black/10 px-3 py-2 font-mono text-xs break-all dark:border-white/10",children:s.length?C?`modality=${s[0]}`:s.map(n=>`modality[]=${n}`).join("&"):"— nothing selected —"})]})})},at=[{value:"text",title:"Text",subtitle:"Prompt in, prose out",icon:"File"},{value:"image",title:"Image",subtitle:"Generated stills up to 4K, transparent background optional",icon:"Image",labels:["Beta"]},{value:"code",title:"Code",subtitle:"Syntax-aware completions for 40 languages",icon:"Code"},{value:"web",title:"Web pages",subtitle:"Rendered HTML over any URL",icon:"Globe",labels:["Beta","Rate limited"]},{value:"structured",title:"Structured data",subtitle:"JSON validated against your schema",icon:"List"},{value:"transcription",title:"Transcription Services",subtitle:"Audio to text in 24 languages",icon:"Chat",labels:["Premium"],disabled:!0}],st=()=>{const[s,i]=t.useState("—");return e.jsxs("form",{className:"w-full space-y-4",onSubmit:l=>{l.preventDefault();const u=new FormData(l.currentTarget).getAll("modality[]");i(u.length?`modality[]=${u.join("&modality[]=")}`:"—")},children:[e.jsx(c,{name:"modality",label:"Input and output",description:"What this run accepts and what it can produce.",columns:2,gap:"md",tone:"blue",defaultValue:["text"],options:at}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{type:"submit",className:"rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700",children:"Submit"}),e.jsx("code",{className:"rounded-lg border border-black/10 bg-black/[0.03] px-2 py-1 font-mono text-xs break-all dark:border-white/10 dark:bg-white/[0.06]",children:s})]})]})},ot=`import React, { useState } from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

const OPTIONS: MultiSelectPanelOption[] = [
  {
    value: "text",
    title: "Text",
    subtitle: "Prompt in, prose out",
    icon: "File",
  },
  {
    value: "image",
    title: "Image",
    subtitle: "Generated stills up to 4K, transparent background optional",
    icon: "Image",
    labels: ["Beta"],
  },
  {
    value: "code",
    title: "Code",
    subtitle: "Syntax-aware completions for 40 languages",
    icon: "Code",
  },
  {
    value: "web",
    title: "Web pages",
    subtitle: "Rendered HTML over any URL",
    icon: "Globe",
    labels: ["Beta", "Rate limited"],
  },
  {
    value: "structured",
    title: "Structured data",
    subtitle: "JSON validated against your schema",
    icon: "List",
  },
  {
    value: "transcription",
    title: "Transcription Services",
    subtitle: "Audio to text in 24 languages",
    icon: "Chat",
    labels: ["Premium"],
    disabled: true,
  },
];

/**
 * The group as the reference draws it: an uppercase group label, two equal
 * columns, and cards whose only required part is the title — the icon, the
 * subtitle and the pills on the title row are each there or not, and the cards
 * stay the same size either way. \`Transcription Services\` is off, which is a
 * per-option flag rather than a different card.
 */
export const Capabilities: React.FC = () => {
  const [submitted, setSubmitted] = useState<string>("—");

  return (
    <form
      className="w-full space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const values = data.getAll("modality[]") as string[];
        setSubmitted(
          values.length ? \`modality[]=\${values.join("&modality[]=")}\` : "—",
        );
      }}
    >
      <MultiSelectPanel
        name="modality"
        label="Input and output"
        description="What this run accepts and what it can produce."
        columns={2}
        gap="md"
        tone="blue"
        defaultValue={["text"]}
        options={OPTIONS}
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Submit
        </button>
        <code className="rounded-lg border border-black/10 bg-black/[0.03] px-2 py-1 font-mono text-xs break-all dark:border-white/10 dark:bg-white/[0.06]">
          {submitted}
        </code>
      </div>
    </form>
  );
};

export default Capabilities;
`,J=[{value:"draft",title:"Draft",subtitle:"Fast, one token stream",icon:"File",labels:["Default"]},{value:"research",title:"Research",subtitle:"Searches, cites, takes its time",icon:"Search",labels:["Beta","Paid"]},{value:"structured",title:"Structured",subtitle:"Validated against your schema",icon:"List",labels:["Schema"]},{value:"vision",title:"Vision",subtitle:"Retired in favour of Research",icon:"Image",labels:["Legacy"],disabled:!0}],lt=()=>{const[s,i]=t.useState(["draft"]),[l,d]=t.useState(["research"]);return e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsx(c,{name:"mode_left",label:"Pills beside the title",description:"labelAlign defaults to left — title and label read as one phrase.",options:J,value:s,onChange:i,columns:2,variant:"tonal",tone:"blue"}),e.jsx(c,{name:"mode_right",label:"Pills at the trailing edge",description:'labelAlign="right" pins them, so a column of cards lines its labels up.',options:J,value:l,onChange:d,columns:2,variant:"tonal",tone:"blue",labelAlign:"right"})]})},it=`import React, { useState } from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

/**
 * The same group twice, once with the pills hugging the title and once pinned
 * to the trailing edge of the row.
 *
 * \`tonal\` is the case that matters: a flat card shows every layer it draws, so
 * the disabled card here is dimmed by its own \`Checkbox\` and nothing else —
 * a sheet over the body would read as a panel inside the panel.
 */
const OPTIONS: MultiSelectPanelOption[] = [
  {
    value: "draft",
    title: "Draft",
    subtitle: "Fast, one token stream",
    icon: "File",
    labels: ["Default"],
  },
  {
    value: "research",
    title: "Research",
    subtitle: "Searches, cites, takes its time",
    icon: "Search",
    labels: ["Beta", "Paid"],
  },
  {
    value: "structured",
    title: "Structured",
    subtitle: "Validated against your schema",
    icon: "List",
    labels: ["Schema"],
  },
  {
    value: "vision",
    title: "Vision",
    subtitle: "Retired in favour of Research",
    icon: "Image",
    labels: ["Legacy"],
    disabled: true,
  },
];

export const LabelAlignExample: React.FC = () => {
  const [left, setLeft] = useState<string[]>(["draft"]);
  const [right, setRight] = useState<string[]>(["research"]);

  return (
    <div className="flex flex-col gap-6">
      <MultiSelectPanel
        name="mode_left"
        label="Pills beside the title"
        description="labelAlign defaults to left — title and label read as one phrase."
        options={OPTIONS}
        value={left}
        onChange={setLeft}
        columns={2}
        variant="tonal"
        tone="blue"
      />
      <MultiSelectPanel
        name="mode_right"
        label="Pills at the trailing edge"
        description='labelAlign="right" pins them, so a column of cards lines its labels up.'
        options={OPTIONS}
        value={right}
        onChange={setRight}
        columns={2}
        variant="tonal"
        tone="blue"
        labelAlign="right"
      />
    </div>
  );
};

export default LabelAlignExample;
`,rt=[{value:"fast",title:"Fast",subtitle:"One pass, no verification step",icon:"Rocket"},{value:"balanced",title:"Balanced",subtitle:"Drafts, then a single review pass over the answer",icon:"Settings",labels:["Default"]},{value:"deep",title:"Deep",subtitle:"Plans, checks its own work and shows the reasoning",icon:"Brain",labels:["Premium","Slow"]}],ct=()=>{const[s,i]=t.useState(["balanced"]);return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(c,{name:"mode",label:"Reasoning mode",description:"One mode per run — arrows pick, click deselects.",columns:3,selectionMode:"single",allowDeselect:!1,value:s,onChange:i,options:rt}),e.jsxs("p",{className:"text-xs opacity-70",children:["Submitting sends ",e.jsxs("code",{children:["mode=",s[0]??"—"]}),"; nothing else is ever selected."]})]})},dt=`import React, { useState } from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

const MODES: MultiSelectPanelOption[] = [
  {
    value: "fast",
    title: "Fast",
    subtitle: "One pass, no verification step",
    icon: "Rocket",
  },
  {
    value: "balanced",
    title: "Balanced",
    subtitle: "Drafts, then a single review pass over the answer",
    icon: "Settings",
    labels: ["Default"],
  },
  {
    value: "deep",
    title: "Deep",
    subtitle: "Plans, checks its own work and shows the reasoning",
    icon: "Brain",
    labels: ["Premium", "Slow"],
  },
];

/**
 * \`selectionMode="single"\` turns the group into a radiogroup: one tab stop,
 * and the arrow keys — <em>Home</em> and <em>End</em> included — walk the cards
 * and pick as they go. With \`allowDeselect\` off there is always exactly one
 * mode selected, the way a required radio group behaves.
 */
export const SingleChoice: React.FC = () => {
  const [mode, setMode] = useState<string[]>(["balanced"]);

  return (
    <div className="w-full space-y-3">
      <MultiSelectPanel
        name="mode"
        label="Reasoning mode"
        description="One mode per run — arrows pick, click deselects."
        columns={3}
        selectionMode="single"
        allowDeselect={false}
        value={mode}
        onChange={setMode}
        options={MODES}
      />
      <p className="text-xs opacity-70">
        Submitting sends <code>mode={mode[0] ?? "—"}</code>; nothing else is
        ever selected.
      </p>
    </div>
  );
};

export default SingleChoice;
`,ut=[{value:"grouped",title:"Follows the group",subtitle:"Elevated, blue, small padding — the props on the group",icon:"File"},{value:"tonal",title:"Its own tone",subtitle:'tone="emerald" moves the box accent, the rim and the wash together',icon:"Database",tone:"emerald",labels:["Emerald"]},{value:"glass",title:"Its own surface, corner and box",subtitle:'variant="glass" with a larger corner and a ghost checkbox box, chosen per option while the rest of the group stays elevated',icon:"Cache",variant:"glass",corner:"rounded-md",padding:"md",checkboxVariant:"ghost",labels:["Glass","Ghost box","Wide padding"]},{value:"pulsing",title:"Pulsing and off",subtitle:"pulse glows from the rim; disabled beside it is inert and never submits",icon:"Shield",pulse:!0,disabled:!0}],ht=()=>e.jsxs("div",{className:"w-full space-y-4",children:[e.jsx(c,{name:"surfaces",label:"Surfaces",description:"Group defaults below; three cards override them.",columns:2,variant:"tonal",tone:"blue",corner:"rounded-sm",padding:"sm",checkboxVariant:"flat",labelVariant:"outline",labelTone:"amber",defaultValue:["tonal"],options:ut}),e.jsxs("p",{className:"text-xs opacity-70",children:["The third card carries a subtitle long enough to wrap, and the row is still two cards of the same height — ",e.jsx("code",{children:"grid-auto-rows"})," gives every row one height, so nothing hangs below its neighbours."]})]}),pt=`import React from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

const OPTIONS: MultiSelectPanelOption[] = [
  {
    value: "grouped",
    title: "Follows the group",
    subtitle: "Elevated, blue, small padding — the props on the group",
    icon: "File",
  },
  {
    value: "tonal",
    title: "Its own tone",
    subtitle: "tone=\\"emerald\\" moves the box accent, the rim and the wash together",
    icon: "Database",
    tone: "emerald",
    labels: ["Emerald"],
  },
  {
    value: "glass",
    title: "Its own surface, corner and box",
    subtitle:
      "variant=\\"glass\\" with a larger corner and a ghost checkbox box, chosen per option while the rest of the group stays elevated",
    icon: "Cache",
    variant: "glass",
    corner: "rounded-md",
    padding: "md",
    checkboxVariant: "ghost",
    labels: ["Glass", "Ghost box", "Wide padding"],
  },
  {
    value: "pulsing",
    title: "Pulsing and off",
    subtitle: "pulse glows from the rim; disabled beside it is inert and never submits",
    icon: "Shield",
    pulse: true,
    disabled: true,
  },
];

/**
 * Every card takes the group's surface props as defaults and may outvote them
 * one at a time: \`variant\`, \`tone\`, \`corner\`, \`padding\`, \`pulse\` and
 * \`checkboxVariant\` per option. The group's \`tone\` also drives the checkbox
 * box, so a card and its box never disagree. The fourth card is disabled —
 * dimmed, unfocusable, and absent from a submitted form.
 */
export const Overrides: React.FC = () => (
  <div className="w-full space-y-4">
    <MultiSelectPanel
      name="surfaces"
      label="Surfaces"
      description="Group defaults below; three cards override them."
      columns={2}
      variant="tonal"
      tone="blue"
      corner="rounded-sm"
      padding="sm"
      checkboxVariant="flat"
      labelVariant="outline"
      labelTone="amber"
      defaultValue={["tonal"]}
      options={OPTIONS}
    />
    <p className="text-xs opacity-70">
      The third card carries a subtitle long enough to wrap, and the row is
      still two cards of the same height — <code>grid-auto-rows</code> gives
      every row one height, so nothing hangs below its neighbours.
    </p>
  </div>
);

export default Overrides;
`,Q=[{value:"fast",title:"Fast",subtitle:"One token stream, no tools",icon:"Gauge"},{value:"research",title:"Research",subtitle:"Searches, cites, takes its time",icon:"Search",labels:["Beta"]},{value:"priority",title:"Priority queue",subtitle:"Runs ahead of the others",icon:"Rocket",labels:["Paid"],activeTone:"amber",pulse:!0,pulseTone:"rose"},{value:"endpoint",title:"Custom endpoint",subtitle:"Bring your own base URL",icon:"Globe",checkboxTone:"violet"}],bt=()=>{const[s,i]=t.useState(["research","priority"]),[l,d]=t.useState(["research","priority"]);return e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsx(c,{name:"hues_auto",label:"One hue for everything",description:"The default: tone is the card, its rim when selected, the wash and the box.",options:Q,value:s,onChange:i,columns:2,variant:"tonal",tone:"blue"}),e.jsx(c,{name:"hues_own",label:"Each hue to its own job",description:"Group checkboxTone emerald; the Priority card selected in amber and pulsing in rose; the last card keeping its own box.",options:Q,value:l,onChange:d,columns:2,variant:"tonal",tone:"blue",checkboxTone:"emerald"})]})},mt=`import React, { useState } from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

/**
 * One group left alone, one group told what each of its hues is for.
 *
 * The top group is the default, and the look the component has always had:
 * \`tone\` is the card, the selection rim, the active wash and the checkbox box,
 * all of them blue. The bottom group is the same \`tone="blue"\` with opinions at
 * both levels — the group puts every box in emerald, one card takes its own
 * selection hue in amber and its attention call in rose, and another card
 * outvotes the group on its box alone.
 *
 * None of it is carried by colour alone. The selection is an outline plus the
 * tick and \`aria-checked\`, and the pulse survives \`prefers-reduced-motion\` as a
 * static inner glow, so a hue that disagrees still means what it meant.
 */
const OPTIONS: MultiSelectPanelOption[] = [
  {
    value: "fast",
    title: "Fast",
    subtitle: "One token stream, no tools",
    icon: "Gauge",
  },
  {
    value: "research",
    title: "Research",
    subtitle: "Searches, cites, takes its time",
    icon: "Search",
    labels: ["Beta"],
  },
  {
    value: "priority",
    title: "Priority queue",
    subtitle: "Runs ahead of the others",
    icon: "Rocket",
    labels: ["Paid"],
    // The card with opinions of its own: selected in amber, asking in rose. It
    // is the only card pulsing, so the call stays a single voice.
    activeTone: "amber",
    pulse: true,
    pulseTone: "rose",
  },
  {
    value: "endpoint",
    title: "Custom endpoint",
    subtitle: "Bring your own base URL",
    icon: "Globe",
    // Outvotes the group's \`checkboxTone\` for this box only.
    checkboxTone: "violet",
  },
];

export const HuesExample: React.FC = () => {
  const [auto, setAuto] = useState<string[]>(["research", "priority"]);
  const [own, setOwn] = useState<string[]>(["research", "priority"]);

  return (
    <div className="flex flex-col gap-6">
      <MultiSelectPanel
        name="hues_auto"
        label="One hue for everything"
        description="The default: tone is the card, its rim when selected, the wash and the box."
        options={OPTIONS}
        value={auto}
        onChange={setAuto}
        columns={2}
        variant="tonal"
        tone="blue"
      />
      <MultiSelectPanel
        name="hues_own"
        label="Each hue to its own job"
        description="Group checkboxTone emerald; the Priority card selected in amber and pulsing in rose; the last card keeping its own box."
        options={OPTIONS}
        value={own}
        onChange={setOwn}
        columns={2}
        variant="tonal"
        tone="blue"
        checkboxTone="emerald"
      />
    </div>
  );
};

export default HuesExample;
`,Tt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Ge,{name:"Multi Select Panel",description:"A grid of selectable cards, built out of the kit's own Panel and Checkbox rather than a second implementation of either: Panel brings the surface, the pointer answer and the selection rim, Checkbox brings the drawn box, the form field and the card's type scale. Title, icon, subtitle and label pills are each optional — only the title is required — and every card in a row is the same size."}),e.jsx(nt,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Input and output",description:"Two equal columns under an uppercase group label, with icons, subtitles and pills on the title row, one card disabled per-option, and the values a real form submit carries.",code:ot,filename:"Capabilities.tsx",children:e.jsx(st,{})}),e.jsx(h,{title:"Where the label pills sit",description:"The same group twice: labelAlign hugs the pills to the title or pins them to the trailing edge of the row. Both groups are tonal and both carry a disabled card, which is dimmed by its own checkbox rather than by a sheet laid over the card.",code:it,filename:"LabelAlign.tsx",children:e.jsx(lt,{})}),e.jsx(h,{title:"Single choice",description:'selectionMode="single" turns the group into a radiogroup: one tab stop, arrows walk and pick, and with allowDeselect off there is always exactly one card selected.',code:dt,filename:"SingleChoice.tsx",children:e.jsx(ct,{})}),e.jsx(h,{title:"Per-card overrides",description:"Group surface props are defaults each card may outvote — variant, tone, corner, padding, pulse, checkboxVariant and the three hues below — while the group's tone is still what every card and box wears when nobody has an opinion.",code:pt,filename:"Overrides.tsx",children:e.jsx(ht,{})}),e.jsx(h,{title:"Hues of its own",description:"The same blue group twice. Top: the default, where tone is the card, its selection rim, the wash and the checkbox box. Bottom: checkboxTone puts the boxes in emerald, the Priority card selects in amber and pulses in rose, and one card outvotes the group on its box alone. The selection keeps its non-colour signals either way — an outline, the tick, aria-checked.",code:mt,filename:"Hues.tsx",children:e.jsx(bt,{})})]}),e.jsx(Re,{props:[{name:"name",type:"string",description:"Form field name. Multiple mode submits a checkbox field per selection, `name[]=…`; single mode submits a plain radio field, `name=…`."},{name:"options",type:"MultiSelectPanelOption[]",description:"`{ value, title, subtitle?, icon?, labels?, disabled?, variant?, tone?, corner?, padding?, pulse?, pulseTone?, activeTone?, hoverColor?, checkboxTone?, checkboxVariant? }`. `title` is the only required field; `icon` is a registry name or any node; `labels` are the pills on the title row. Every surface and hue field beats the group's equivalent for that card."},{name:"label / description",type:"ReactNode",description:"The group heading — an uppercase `<legend>`, which names the group for assistive tech — and the helper under it, wired through `aria-describedby`."},{name:"value / defaultValue",type:"string[]",description:"Controlled and uncontrolled selections, as on an `<input>`: `defaultValue` is the value at mount, and re-rendering with a fresh array of the same content does not reset a group in use."},{name:"onChange",type:"(selectedValues: string[]) => void",description:"Fires once per activation with the whole next selection — in click order for multiple mode, one item (or none) for single."},{name:"selectionMode",type:'"multiple" | "single"',default:'"multiple"',description:'Multiple is a checkbox group (`role="checkbox"`, every card its own tab stop); single is a radiogroup (`role="radio"`, one tab stop, arrows pick).'},{name:"allowDeselect",type:"boolean",default:"true",description:"In single mode, whether clicking the selected card clears the group. Off makes the choice required. Arrows never deselect either way."},{name:"columns",type:"number",default:"2",description:"Grid tracks, clamped to 1–6. Every card is then the same width, and `grid-auto-rows: 1fr` gives every row one height, so a card with a subtitle and three pills is exactly as tall as one with only a title."},{name:"gap",type:"ControlSize",default:'"md"',description:"Space between cards, on the shared control scale — the same map MultiSelectPills uses for the space between pills."},{name:"size",type:"ControlSize",default:'"md"',description:"Card typography, icon and checkbox box together: it is handed to `Checkbox`, so a card's type scale is the checkbox's own."},{name:"checkboxVariant",type:"InputVariant",default:'"flat"',description:"The textbox surface scale — `flat`, `elevated`, `ghost`, `underline`, `glass`, `gradient` — for the drawn box, the same `variant` `Input` and `Checkbox` wear. Per-option as `checkboxVariant`."},{name:"checkboxTone",type:"TrueColor",default:"the card’s tone",description:"The accent of the drawn box, allowed to disagree with the card it sits on — an emerald tick on a blue card. Omitted, each box wears its own card's tone, blue where the card is untinted. The box keeps the hue's contrast pair (`-{tone}-700` filled, `-{tone}-500` resting), so only the hue is yours, never the legibility. Per-option as `checkboxTone`."},{name:"variant / tone / corner / padding",type:"SurfaceVariant / SurfaceTone / SurfaceCorner / SurfacePadding",default:'"elevated" / "blue" / "rounded-sm" / "sm"',description:'The `Panel` surface every card wears, and the defaults an option may outvote with `variant`, `tone`, `corner`, `padding` and `pulse`. `tone` is one hue for the card, its rim when selected and the checkbox box, so a card and its box read as one thing; `tone="none"` leaves the card untinted and keeps the box readable. `raisedSurface` forces every card’s first nested-panels depth step — the tinted-card-on-matching-background fix.'},{name:"activeTone / pulseTone / hoverColor",type:"TrueColor",default:"the card’s hue / the selected hue / the selected hue, then the card’s tone",description:"The hues a card may keep to itself. `activeTone` dresses the whole selected state — rim and wash together — so a blue card can be selected in amber; `pulseTone` is the colour of the attention glow, which by default rides the selection so a selected-and-pulsing card says both things in one colour. Omitted, both fall back through `borderColor` to the card's own tone. `hoverColor` is the hue the card wears under the pointer, and by default that is the hue it is selected in — but only while it is: the selected card hovers in the colour of its own state while its neighbours keep hovering in their tone, rather than the whole grid wearing a state one card has. Give it a hue to keep a card hovering in its brand colour. Per-option as `activeTone` / `pulseTone` / `hoverColor`."},{name:"transparency / hoverable / hoverShadow / decoration / borderColor / backgroundColor",type:"as on Panel",description:"The rest of the `Panel` surface vocabulary, forwarded to every card. Panel’s own `title`, `subtitle`, `badge`, `media`, `actions` and `loading` are deliberately not exposed — the card’s copy comes from the option fields."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / SpecularMode",description:"Glass chrome, for the glass card variants."},{name:"labelTone / labelVariant",type:"TrueColor / PillVariant",default:'the card’s tone, "outline"',description:"The `labels` pills, rendered with the kit&rsquo;s `Pill` at `sm`. They wrap when they overflow, and are kept out of the card&rsquo;s accessible name."},{name:"labelAlign",type:'"left" | "right"',default:'"left"',description:"Which end of the title row the pills sit on. `left` hugs the title, so title and label read as one phrase; `right` pins them to the trailing edge, which lines a column of cards up. Logical, not physical — `right` means the end, so an RTL card pushes left."},{name:"disabled",type:"boolean",default:"false",description:"Disables the group through the `<fieldset>`, so every card is inert natively; `option.disabled` does the same for one card, which is then dimmed, unfocusable and absent from a submitted form. A card says it once, the way a lone disabled `Checkbox` does — `Panel`&rsquo;s own disabled sheet is switched off, because on a flat `simple` or `tonal` card a translucent rectangle inside the padding reads as a panel within the panel."},{name:"className",type:"string",description:"Lands on the `<fieldset>` around the grid."}]}),e.jsxs(Le,{children:[e.jsxs(v,{title:"Screen reader",children:[e.jsxs("p",{children:["The group is a real ",e.jsx(a,{children:"fieldset"})," with a ",e.jsx(a,{children:"legend"}),", so it is named natively; in single mode the fieldset also carries"," ",e.jsx(a,{children:'role="radiogroup"'}),". Each card is a ",e.jsx(a,{children:"Panel"})," section given"," ",e.jsx(a,{children:'role="checkbox"'})," (or ",e.jsx(a,{children:'role="radio"'}),") and a live"," ",e.jsx(a,{children:"aria-checked"})," — one announced control per card, named by"," ",e.jsx(a,{children:"aria-labelledby"})," pointing at the ",e.jsx("em",{children:"title only"}),", so the label pills never fold into the name, and described by"," ",e.jsx(a,{children:"aria-describedby"})," pointing at the subtitle. The"," ",e.jsx(a,{children:"Checkbox"})," inside is a form field and nothing else: its"," ",e.jsx(a,{children:"input"})," is ",e.jsx(a,{children:"display: none"})," and ",e.jsx(a,{children:"aria-hidden"}),", out of the tab order, so the value still travels to a submit without a second checkbox being announced inside the card. That is the deliberate tradeoff of this composition: the box is drawn, not a second tab stop — the card is the control."]}),e.jsx(Ve,{code:`<section role="checkbox" aria-checked="true"
         aria-labelledby="…-title" aria-describedby="…-subtitle" tabindex="0">
  <label>
    <input type="checkbox" name="modality[]" value="text"
           tabindex="-1" aria-hidden="true" style="display:none" />
    <span>…drawn box…</span>
    <span id="…-title">Text</span>   <!-- the card's whole name -->
    <span id="…-subtitle">Prompt in, prose out</span>
  </label>
</section>`,filename:"Rendered card"})]}),e.jsxs(v,{title:"Keyboard support",children:[e.jsxs("p",{children:["Multiple mode is a checkbox group, so every enabled card is its own tab stop and nothing is hijacked. Single mode is the radiogroup pattern the kit uses elsewhere: one tab stop — the selected card, or the first usable one while nothing is selected — and the arrow keys move"," ",e.jsx("em",{children:"and pick"}),", wrapping at both ends and stepping over disabled cards. Keys are read on the card itself, so a key that came from somewhere inside it is not the card being pressed."]}),e.jsx(Ee,{bindings:[{keys:["Tab"],action:"Multiple: every enabled card. Single: the selected card, or the first enabled one."},{keys:["Space"],action:"Toggles the focused card (single mode: picks it) and prevents the page scroll."},{keys:["Enter"],action:"Same as Space."},{keys:["↑","↓","←","→"],action:"Single mode only — move to the previous/next enabled card and select it, wrapping at both ends."},{keys:["Home","End"],action:"Single mode only — first/last enabled card, selected; a disabled end card is skipped."}]})]}),e.jsx(v,{title:"Colour that carries state",children:e.jsxs("p",{children:["A card’s hue is never the only thing saying what it is. Selection is an outline — a 2px inset rim, not a tint alone — plus the tick in the box and a live ",e.jsx(a,{children:"aria-checked"}),"; ",e.jsx(a,{children:"checkboxTone"}),","," ",e.jsx(a,{children:"activeTone"})," and ",e.jsx(a,{children:"pulseTone"})," move those colours, never the signals. A disabled card is dimmed ",e.jsx("em",{children:"and"})," inert natively, and the pulse survives ",e.jsx(a,{children:"prefers-reduced-motion"})," as a static inner glow, so which card is asking stays visible with no motion at all. Each hue is the theme’s own contrast pair for that tone —"," ",e.jsx(a,{children:"-{tone}-700"})," on a filled box, ",e.jsx(a,{children:"-{tone}-500"})," on its rim, the brighter step in the dark theme — so choosing a hue is not choosing a legibility risk."]})}),e.jsx(v,{title:"Internationalization",children:e.jsx("p",{children:"Nothing inside to translate: the group label, the helper, every title, subtitle and pill label is caller-supplied, and selection travels as ARIA attributes rather than prose. Icons are registry names, so host-level icon localisation reaches them the way it reaches every other component. Text wraps rather than truncating — a long translated title grows its card, and the row keeps every card the same height."})})]})]});export{Tt as MultiSelectPanelPage,Tt as default};
