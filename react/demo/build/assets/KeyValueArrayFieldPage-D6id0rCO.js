import{r as t,j as e,P as le,C as re,I as ie,ce as u}from"./index-B9JeX19j.js";import{P as oe,A as de,a as f,C as n}from"./A11ySections-C9rTCDac.js";import{P as ce}from"./PageHeader-D-LFwZLT.js";import{E as b}from"./ExampleCard-BwESxlwz.js";import{P as ue,S as h,a as D,C as p,T as l}from"./PlaygroundPanel-CZvYEX_V.js";import{C as he}from"./ControlAccordion-rp4gabXb.js";import{u as pe,E as me}from"./EventLog-EYY1E4QF.js";import{V as ye,x as ge,p as xe,f as ve,d as fe,l as be,m as we,n as je}from"./options-Blq0niUd.js";const ke=["glass","liquid-glass","default"],Ce=[{key:"ENV",value:"production"},{key:"DEBUG",value:"false"},{key:"host",value:"localhost"},{key:"port",value:"27017"}],Se=()=>{const[s,r]=t.useState(Ce),[o,m]=t.useState("outlined"),[y,O]=t.useState("blue"),[w,q]=t.useState("auto"),[j,G]=t.useState("sm"),[k,z]=t.useState("auto"),[C,H]=t.useState("sm"),[S,M]=t.useState(""),[P,U]=t.useState(!0),[V,$]=t.useState(!0),[N,B]=t.useState(!1),[A,W]=t.useState(!1),[I,_]=t.useState(!0),[E,J]=t.useState(!1),[g,Q]=t.useState(!1),[x,X]=t.useState(!1),[K,Y]=t.useState("classic"),[T,Z]=t.useState("medium"),[L,ee]=t.useState("frosted"),ae=ke.includes(o),[te,v]=pe(),R=t.useRef(s),se=a=>{const d=R.current;if(a.length>d.length)v("row added — onChange fired");else if(a.length<d.length){const i=d.find(c=>!a.includes(c));v(`row removed${i?.key?` — \`${i.key}\``:""} — onChange fired`)}else{const i=a.findIndex((c,ne)=>c!==d[ne]);if(i>=0){const c=a[i].key!==d[i].key;v(`${c?"key":"value"} edited on row ${i+1} — onChange fired`)}}R.current=a,r(a)},F=e.jsx(u,{label:"Metadata",hint:P?"Store extra settings via key/value pairs":void 0,help:V?"Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised.":void 0,error:N?"At least one entry is required.":void 0,value:s,onChange:se,addLabel:S||void 0,variant:o,tone:y,corner:w,padding:j,inputVariant:k,size:C,disabled:A,flagDuplicateKeys:I,maxRows:E?5:void 0,glassOpacity:L,vibrancy:T,specularMode:K});return e.jsx(ue,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(he,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Variant",options:ye,value:o,onChange:a=>m(a)}),e.jsx(D,{label:"Tone",children:e.jsx(re,{selectable:!0,size:"sm",value:y,onSelect:O,defaultExpanded:!0})}),e.jsx(h,{label:"Controls variant",options:[{label:"Auto (follow variant)",value:"auto"},...ge],value:k,onChange:a=>z(a)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(h,{label:"Corner",options:xe,value:w,onChange:a=>q(a)}),e.jsx(h,{label:"Padding",options:ve,value:j,onChange:a=>G(a)})]}),e.jsx(p,{label:"Size",options:fe,value:C,onChange:a=>H(a)})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(D,{label:"Add button label",children:e.jsx(ie,{size:"sm",placeholder:"Add entry (translated)",value:S,onChange:a=>M(a.target.value)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(l,{label:"Hint",checked:P,onChange:U}),e.jsx(l,{label:"Help text",checked:V,onChange:$}),e.jsx(l,{label:"Error",checked:N,onChange:B}),e.jsx(l,{label:"Disabled",checked:A,onChange:W}),e.jsx(l,{label:"Flag duplicate keys",checked:I,onChange:_}),e.jsx(l,{label:"Cap at 5 rows",checked:E,onChange:J})]})]})},...ae?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Specular",options:be,value:K,onChange:a=>Y(a)}),e.jsx(p,{label:"Vibrancy",options:we,value:T,onChange:a=>Z(a)}),e.jsx(p,{label:"Glass opacity",options:je,value:L,onChange:a=>ee(a)})]})}]:[],{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"In a panel",checked:g,onChange:Q}),g&&e.jsx(l,{label:"On a glass panel",checked:x,onChange:X})]})}]}),e.jsx(me,{log:te,emptyText:"No events yet — edit a row."}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Every change — a keystroke, a row added or removed — arrives through the same ",e.jsx("code",{children:"onChange"})," as the whole array; the log reads the delta it carried. With a ",e.jsx("code",{children:"plain"})," card surface the field is bare furniture, meant to sit inside a card you already have — the toggles above show exactly that. The add button follows the inputs’ variant (a glass card wins), and every string, down to a row’s ",e.jsx("em",{children:"Remove key 1"}),", rides the catalog."]})]}),preview:e.jsx("div",{className:"w-full",children:g?e.jsx(le,{corner:"none",variant:x?"liquid-glass":"outlined",tone:x?y:"neutral",padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full py-2",children:F})}):e.jsx("div",{className:"w-full py-2",children:F})})})},Pe=[{key:"ENV",value:"production"},{key:"DEBUG",value:"false"},{key:"host",value:"localhost"},{key:"port",value:"27017"}];function Ve(){const[s,r]=t.useState(Pe);return e.jsx("div",{className:"w-full",children:e.jsx(u,{label:"Metadata",hint:"Store extra settings via key/value pairs",help:"Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised.",value:s,onChange:r,tone:"blue",variant:"outlined"})})}const Ne=`import { useState } from "react";
import { KeyValueArrayField } from "@cjlapao/ui-kit";
import type { KeyValuePair } from "@cjlapao/ui-kit";

const INITIAL: KeyValuePair[] = [
  { key: "ENV", value: "production" },
  { key: "DEBUG", value: "false" },
  { key: "host", value: "localhost" },
  { key: "port", value: "27017" },
];

export default function EnvironmentVariables() {
  const [pairs, setPairs] = useState(INITIAL);

  return (
    <div className="w-full">
      <KeyValueArrayField
        label="Metadata"
        hint="Store extra settings via key/value pairs"
        help="Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised."
        value={pairs}
        onChange={setPairs}
        tone="blue"
        variant="outlined"
      />
    </div>
  );
}
`,Ae=[{key:"region",value:"eu-west-1"},{key:"REPLICAS",value:"3"},{key:"region",value:"us-east-1"}];function Ie(){const[s,r]=t.useState(Ae);return e.jsxs("div",{className:"w-full",children:[e.jsx(u,{label:"Deployment config",value:s,onChange:r,tone:"amber",variant:"tonal"}),e.jsxs("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:["Two rows share the key ",e.jsx("code",{children:"region"})," — both are flagged, because the second one would silently win when the map is serialised."]})]})}const Ee=`import { useState } from "react";
import { KeyValueArrayField } from "@cjlapao/ui-kit";
import type { KeyValuePair } from "@cjlapao/ui-kit";

const INITIAL: KeyValuePair[] = [
  { key: "region", value: "eu-west-1" },
  { key: "REPLICAS", value: "3" },
  { key: "region", value: "us-east-1" },
];

export default function DuplicateKeys() {
  const [pairs, setPairs] = useState(INITIAL);

  return (
    <div className="w-full">
      <KeyValueArrayField
        label="Deployment config"
        value={pairs}
        onChange={setPairs}
        tone="amber"
        variant="tonal"
      />
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        Two rows share the key <code>region</code> — both are flagged, because
        the second one would silently win when the map is serialised.
      </p>
    </div>
  );
}
`;function Ke(){const[s,r]=t.useState([]),[o,m]=t.useState([{key:"A",value:"1"},{key:"B",value:"2"},{key:"C",value:"3"}]);return e.jsxs("div",{className:"grid w-full gap-4 xl:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{label:"Headers",value:s,onChange:r,emptyState:"No custom headers yet."}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Empty — the dashed placeholder, with a custom message."})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{label:"Limits",value:o,onChange:m,maxRows:3,error:"At least one entry is required."}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Capped at three rows — the add button disables at the limit — with a field-level error."})]})]})}const Te=`import { useState } from "react";
import { KeyValueArrayField } from "@cjlapao/ui-kit";
import type { KeyValuePair } from "@cjlapao/ui-kit";

export default function States() {
  const [emptyPairs, setEmptyPairs] = useState<KeyValuePair[]>([]);
  const [cappedPairs, setCappedPairs] = useState([
    { key: "A", value: "1" },
    { key: "B", value: "2" },
    { key: "C", value: "3" },
  ]);

  return (
    <div className="grid w-full gap-4 xl:grid-cols-2">
      <div className="flex flex-col gap-2">
        <KeyValueArrayField
          label="Headers"
          value={emptyPairs}
          onChange={setEmptyPairs}
          emptyState="No custom headers yet."
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Empty — the dashed placeholder, with a custom message.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <KeyValueArrayField
          label="Limits"
          value={cappedPairs}
          onChange={setCappedPairs}
          maxRows={3}
          error="At least one entry is required."
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Capped at three rows — the add button disables at the limit — with a
          field-level error.
        </p>
      </div>
    </div>
  );
}
`,He=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ce,{name:"Key/Value Array",description:"Collect arbitrary metadata pairs. Renders a Panel, so it takes every container surface, and its inputs take every input surface — with duplicate-key flagging, a row cap and collapsible help."}),e.jsx(Se,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Environment variables",description:"The canonical case: a hint under the label, collapsible help, and a few seeded pairs. Add, edit and remove rows freely.",code:Ne,filename:"EnvironmentVariables.tsx",children:e.jsx(Ve,{})}),e.jsx(b,{title:"Duplicate keys",description:"Two rows share the key `region` — both are flagged, because the second would silently win when the map is serialised.",code:Ee,filename:"DuplicateKeys.tsx",children:e.jsx(Ie,{})}),e.jsx(b,{title:"States",description:"The empty placeholder with a custom message, and a field capped at three rows — the add button disables at the limit — with a field-level error.",code:Te,filename:"States.tsx",children:e.jsx(Ke,{})})]}),e.jsx(oe,{props:[{name:"label / hint / help",type:"ReactNode / ReactNode / string",description:"The label names the whole group; `help` is the collapsible explainer (plain surface, tone-tinted, so it never stacks a second card)."},{name:"value / onChange",type:"KeyValuePair[]",description:"Always controlled — `{ key, value }` pairs in, the whole array back out on every change. Rows keep stable ids internally, so typing never remounts an input."},{name:"error",type:"string",description:'Field-level message; `role="alert"`, wired as the group&rsquo;s `aria-describedby`.'},{name:"keyLabel / valueLabel / addLabel / emptyState",type:"string / string / string / ReactNode",default:'"Key" / "Value" / "Add entry" / "No entries yet." (all translated)',description:"Copy overrides — the defaults come from the catalog, and `keyLabel`/`valueLabel` double as placeholders, column headings and row names (`Remove key 1`)."},{name:"flagDuplicateKeys",type:"boolean",default:"true",description:"Rows whose key repeats an earlier one are both flagged with the shared error field state — a map with two of the same key silently loses data on the way out."},{name:"maxRows / disabled / isVisible",type:"number / boolean / boolean",default:"— / false / true",description:"The add button disables at the cap with a &ldquo;limit reached&rdquo; note; `isVisible={false}` renders nothing (form builders)."},{name:"variant / tone / corner / padding",type:"PlainSurfaceVariant / TrueColor / SurfaceCorner / ControlSize",default:'"outlined" / "blue" / "auto" / "sm"',description:"The card renders a real `Panel`, so every container surface comes for free; `plain` drops the card and keeps the rows."},{name:"inputVariant / size",type:'"auto" | InputVariant / ControlSize',default:'"auto" / "sm"',description:"Row inputs&rsquo; variant — `auto` follows the card (glass card → glass inputs, tinted → ghost, boxed → flat), an explicit choice overrides — and the shared control scale for inputs and buttons. The add button follows the inputs&rsquo; variant (solid for boxed, ghost for ghost, glass for glass), and a glass card turns it glass regardless."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / PanelSpecularMode",description:"Passed through to the Panel when the surface is glass."}]}),e.jsxs(de,{children:[e.jsx(f,{title:"Screen reader",children:e.jsxs("p",{children:["The whole field is a ",e.jsx(n,{children:'role="group"'})," labelled by its heading and described by the field error. Inputs have no ",e.jsx(n,{children:"id"})," to point at,"," ",e.jsx("em",{children:"so they carry explicit"})," ",e.jsx(n,{children:"aria-label"}),"s built from the column copy — ",e.jsx(n,{children:"Schlüssel 2"}),", ",e.jsx(n,{children:"Wert 2"})," — and each row’s remove button is named, not just iconed. Duplicate keys publish the shared ",e.jsx(n,{children:"aria-invalid"}),". The aria-hidden column headings are decoration over that naming, not a substitute for it."]})}),e.jsx(f,{title:"Keyboard support",children:e.jsx("p",{children:"Plain tabbing — no grid trap: every input, both per row, and the remove button of the row it stands in, then Add. Adding focuses nothing new automatically: the new row’s key input arrives at the end of the tab order below the button. Delete happens through the row’s button; there is no row-deletion shortcut."})}),e.jsx(f,{title:"Internationalization",children:e.jsxs("p",{children:["Column defaults, the add button, the duplicate warning, the empty placeholder, the limit note and the remove names all ride the catalog under ",e.jsx(n,{children:"kit.keyValueArrayField.*"}),", byte-identical in English. The row names interpolate the (lower-cased) column copy and the row number, so a German row answers to"," ",e.jsx("em",{children:"„Schlüssel schlüssel 1 entfernen”"})," — pass"," ",e.jsx(n,{children:"keyLabel"})," if you want the name to read differently from the heading."]})})]})]});export{He as KeyValueArrayFieldPage,He as default};
