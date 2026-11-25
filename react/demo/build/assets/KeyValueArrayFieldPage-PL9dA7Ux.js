import{r as t,j as e,P as ie,c as oe,gE as u}from"./index-CQwZVYnB.js";import{P as de,A as ce,a as f,C as l}from"./A11ySections-BXfanEck.js";import{P as ue}from"./PageHeader-BhZxEVHt.js";import{E as b}from"./ExampleCard-BZsKA5_g.js";import{a as he}from"./SurfaceToneControl-LH37fS9y.js";import{P as pe,S as h,a as O,T as s,C as p}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as me}from"./ControlAccordion-C7vC6faF.js";import{u as ye,E as ge}from"./EventLog-B3ejPngN.js";import{a4 as xe,I as ve,f as fe,p as be,c as we,A as je,B as ke,C as Ce}from"./options-Byh1yOHz.js";const Se=["glass","liquid-glass","default"],Pe=[{key:"ENV",value:"production"},{key:"DEBUG",value:"false"},{key:"host",value:"localhost"},{key:"port",value:"27017"}],Ne=()=>{const[n,r]=t.useState(Pe),[o,m]=t.useState("outlined"),[y,q]=t.useState("none"),[w,G]=t.useState("auto"),[j,z]=t.useState("sm"),[k,H]=t.useState(!1),[C,M]=t.useState("auto"),[S,B]=t.useState("sm"),[P,U]=t.useState(""),[N,$]=t.useState(!0),[V,W]=t.useState(!0),[A,_]=t.useState(!1),[I,J]=t.useState(!1),[E,Q]=t.useState(!0),[K,X]=t.useState(!1),[g,Y]=t.useState(!1),[x,Z]=t.useState(!1),[T,ee]=t.useState("classic"),[L,ae]=t.useState("medium"),[R,te]=t.useState("frosted"),se=Se.includes(o),[ne,v]=ye(),F=t.useRef(n),le=a=>{const d=F.current;if(a.length>d.length)v("row added — onChange fired");else if(a.length<d.length){const i=d.find(c=>!a.includes(c));v(`row removed${i?.key?` — \`${i.key}\``:""} — onChange fired`)}else{const i=a.findIndex((c,re)=>c!==d[re]);if(i>=0){const c=a[i].key!==d[i].key;v(`${c?"key":"value"} edited on row ${i+1} — onChange fired`)}}F.current=a,r(a)},D=e.jsx(u,{label:"Metadata",hint:N?"Store extra settings via key/value pairs":void 0,help:V?"Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised.":void 0,error:A?"At least one entry is required.":void 0,value:n,onChange:le,addLabel:P||void 0,variant:o,tone:y,corner:w,padding:j,raisedSurface:k,inputVariant:C,size:S,disabled:I,flagDuplicateKeys:E,maxRows:K?5:void 0,glassOpacity:R,vibrancy:L,specularMode:T});return e.jsx(pe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(me,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Variant",options:xe,value:o,onChange:a=>m(a)}),e.jsx(O,{label:"Tone",children:e.jsx(he,{value:y,onSelect:q})}),e.jsx(h,{label:"Controls variant",options:[{label:"Auto (follow variant)",value:"auto"},...ve],value:C,onChange:a=>M(a)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(h,{label:"Corner",options:fe,value:w,onChange:a=>G(a)}),e.jsx(h,{label:"Padding",options:be,value:j,onChange:a=>z(a)})]}),e.jsx(s,{label:"Raised surface",checked:k,onChange:H}),e.jsx(p,{label:"Size",options:we,value:S,onChange:a=>B(a)})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(O,{label:"Add button label",children:e.jsx(oe,{size:"sm",placeholder:"Add entry (translated)",value:P,onChange:a=>U(a.target.value)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(s,{label:"Hint",checked:N,onChange:$}),e.jsx(s,{label:"Help text",checked:V,onChange:W}),e.jsx(s,{label:"Error",checked:A,onChange:_}),e.jsx(s,{label:"Disabled",checked:I,onChange:J}),e.jsx(s,{label:"Flag duplicate keys",checked:E,onChange:Q}),e.jsx(s,{label:"Cap at 5 rows",checked:K,onChange:X})]})]})},...se?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Specular",options:je,value:T,onChange:a=>ee(a)}),e.jsx(p,{label:"Vibrancy",options:ke,value:L,onChange:a=>ae(a)}),e.jsx(p,{label:"Glass opacity",options:Ce,value:R,onChange:a=>te(a)})]})}]:[],{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"In a panel",checked:g,onChange:Y}),g&&e.jsx(s,{label:"On a glass panel",checked:x,onChange:Z})]})}]}),e.jsx(ge,{log:ne,emptyText:"No events yet — edit a row."}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Every change — a keystroke, a row added or removed — arrives through the same ",e.jsx("code",{children:"onChange"})," as the whole array; the log reads the delta it carried. With a ",e.jsx("code",{children:"plain"})," card surface the field is bare furniture, meant to sit inside a card you already have — the toggles above show exactly that. The add button follows the inputs’ variant (a glass card wins), and every string, down to a row’s ",e.jsx("em",{children:"Remove key 1"}),", rides the catalog."]})]}),preview:e.jsx("div",{className:"w-full",children:g?e.jsx(ie,{corner:"none",variant:x?"liquid-glass":"outlined",tone:x?y:"neutral",padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full py-2",children:D})}):e.jsx("div",{className:"w-full py-2",children:D})})})},Ve=[{key:"ENV",value:"production"},{key:"DEBUG",value:"false"},{key:"host",value:"localhost"},{key:"port",value:"27017"}];function Ae(){const[n,r]=t.useState(Ve);return e.jsx("div",{className:"w-full",children:e.jsx(u,{label:"Metadata",hint:"Store extra settings via key/value pairs",help:"Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised.",value:n,onChange:r,tone:"blue",variant:"outlined"})})}const Ie=`import { useState } from "react";
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
`,Ee=[{key:"region",value:"eu-west-1"},{key:"REPLICAS",value:"3"},{key:"region",value:"us-east-1"}];function Ke(){const[n,r]=t.useState(Ee);return e.jsxs("div",{className:"w-full",children:[e.jsx(u,{label:"Deployment config",value:n,onChange:r,tone:"amber",variant:"tonal"}),e.jsxs("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:["Two rows share the key ",e.jsx("code",{children:"region"})," — both are flagged, because the second one would silently win when the map is serialised."]})]})}const Te=`import { useState } from "react";
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
`;function Le(){const[n,r]=t.useState([]),[o,m]=t.useState([{key:"A",value:"1"},{key:"B",value:"2"},{key:"C",value:"3"}]);return e.jsxs("div",{className:"grid w-full gap-4 xl:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{label:"Headers",value:n,onChange:r,emptyState:"No custom headers yet."}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Empty — the dashed placeholder, with a custom message."})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{label:"Limits",value:o,onChange:m,maxRows:3,error:"At least one entry is required."}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Capped at three rows — the add button disables at the limit — with a field-level error."})]})]})}const Re=`import { useState } from "react";
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
`,Ue=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ue,{name:"Key/Value Array",description:"Collect arbitrary metadata pairs. Renders a Panel, so it takes every container surface, and its inputs take every input surface — with duplicate-key flagging, a row cap and collapsible help."}),e.jsx(Ne,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Environment variables",description:"The canonical case: a hint under the label, collapsible help, and a few seeded pairs. Add, edit and remove rows freely.",code:Ie,filename:"EnvironmentVariables.tsx",children:e.jsx(Ae,{})}),e.jsx(b,{title:"Duplicate keys",description:"Two rows share the key `region` — both are flagged, because the second would silently win when the map is serialised.",code:Te,filename:"DuplicateKeys.tsx",children:e.jsx(Ke,{})}),e.jsx(b,{title:"States",description:"The empty placeholder with a custom message, and a field capped at three rows — the add button disables at the limit — with a field-level error.",code:Re,filename:"States.tsx",children:e.jsx(Le,{})})]}),e.jsx(de,{props:[{name:"label / hint / help",type:"ReactNode / ReactNode / string",description:"The label names the whole group; `help` is the collapsible explainer (plain surface, tone-tinted, so it never stacks a second card)."},{name:"value / onChange",type:"KeyValuePair[]",description:"Always controlled — `{ key, value }` pairs in, the whole array back out on every change. Rows keep stable ids internally, so typing never remounts an input."},{name:"error",type:"string",description:'Field-level message; `role="alert"`, wired as the group&rsquo;s `aria-describedby`.'},{name:"keyLabel / valueLabel / addLabel / emptyState",type:"string / string / string / ReactNode",default:'"Key" / "Value" / "Add entry" / "No entries yet." (all translated)',description:"Copy overrides — the defaults come from the catalog, and `keyLabel`/`valueLabel` double as placeholders, column headings and row names (`Remove key 1`)."},{name:"flagDuplicateKeys",type:"boolean",default:"true",description:"Rows whose key repeats an earlier one are both flagged with the shared error field state — a map with two of the same key silently loses data on the way out."},{name:"maxRows / disabled / isVisible",type:"number / boolean / boolean",default:"— / false / true",description:"The add button disables at the cap with a &ldquo;limit reached&rdquo; note; `isVisible={false}` renders nothing (form builders)."},{name:"variant / tone / corner / padding / raisedSurface",type:"PlainSurfaceVariant / TrueColor / SurfaceCorner / ControlSize / boolean",default:'"outlined" / "blue" / "auto" / "sm" / false',description:"The card renders a real `Panel`, so every container surface comes for free; `plain` drops the card and keeps the rows. `raisedSurface` forces the first nested-panels depth step on that Panel — the tinted-card-on-matching-background fix."},{name:"inputVariant / size",type:'"auto" | InputVariant / ControlSize',default:'"auto" / "sm"',description:"Row inputs&rsquo; variant — `auto` follows the card (glass card → glass inputs, tinted → ghost, boxed → flat), an explicit choice overrides — and the shared control scale for inputs and buttons. The add button follows the inputs&rsquo; variant (solid for boxed, ghost for ghost, glass for glass), and a glass card turns it glass regardless."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / PanelSpecularMode",description:"Passed through to the Panel when the surface is glass."}]}),e.jsxs(ce,{children:[e.jsx(f,{title:"Screen reader",children:e.jsxs("p",{children:["The whole field is a ",e.jsx(l,{children:'role="group"'})," labelled by its heading and described by the field error. Inputs have no ",e.jsx(l,{children:"id"})," to point at,"," ",e.jsx("em",{children:"so they carry explicit"})," ",e.jsx(l,{children:"aria-label"}),"s built from the column copy — ",e.jsx(l,{children:"Schlüssel 2"}),", ",e.jsx(l,{children:"Wert 2"})," — and each row’s remove button is named, not just iconed. Duplicate keys publish the shared ",e.jsx(l,{children:"aria-invalid"}),". The aria-hidden column headings are decoration over that naming, not a substitute for it."]})}),e.jsx(f,{title:"Keyboard support",children:e.jsx("p",{children:"Plain tabbing — no grid trap: every input, both per row, and the remove button of the row it stands in, then Add. Adding focuses nothing new automatically: the new row’s key input arrives at the end of the tab order below the button. Delete happens through the row’s button; there is no row-deletion shortcut."})}),e.jsx(f,{title:"Internationalization",children:e.jsxs("p",{children:["Column defaults, the add button, the duplicate warning, the empty placeholder, the limit note and the remove names all ride the catalog under ",e.jsx(l,{children:"kit.keyValueArrayField.*"}),", byte-identical in English. The row names interpolate the (lower-cased) column copy and the row number, so a German row answers to"," ",e.jsx("em",{children:"„Schlüssel schlüssel 1 entfernen”"})," — pass"," ",e.jsx(l,{children:"keyLabel"})," if you want the name to read differently from the heading."]})})]})]});export{Ue as KeyValueArrayFieldPage,Ue as default};
