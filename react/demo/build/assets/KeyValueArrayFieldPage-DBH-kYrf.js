import{r as a,D as q,j as e,U as u,M as i,I as M}from"./index-p9Bv1Pn1.js";import{P as B}from"./PageHeader-DCZtzAyX.js";import{E as c}from"./ExampleCard-BS13YSEO.js";import{P as _,S as p,C as n,T as r}from"./PlaygroundPanel-BDClNSzf.js";import{C as $}from"./ControlAccordion-CydkdljU.js";import{P as Q,t as J,p as X,e as Y,x as Z,Q as ee,j as ae,k as te,l as se}from"./options-Bqu3_N-h.js";const le=["glass","liquid-glass","default"],ne=[{key:"ENV",value:"production"},{key:"DEBUG",value:"false"},{key:"host",value:"localhost"},{key:"port",value:"27017"}],ie=()=>{const[s,l]=a.useState(ne),[o,d]=a.useState("outlined"),[h,V]=a.useState("blue"),[m,A]=a.useState(q),[x,E]=a.useState("sm"),[y,I]=a.useState("flat"),[v,K]=a.useState("sm"),[g,T]=a.useState("Add entry"),[f,F]=a.useState(!0),[b,D]=a.useState(!0),[j,L]=a.useState(!1),[k,O]=a.useState(!1),[C,R]=a.useState(!0),[w,z]=a.useState(!1),[S,H]=a.useState("classic"),[P,U]=a.useState("medium"),[N,W]=a.useState("frosted"),G=le.includes(o);return e.jsx(_,{controls:e.jsx($,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Variant",options:Q,value:o,onChange:t=>d(t)}),e.jsx(p,{label:"Tone",options:J,value:h,onChange:t=>V(t)}),e.jsx(p,{label:"Corner",options:X,value:m,onChange:t=>A(t)}),e.jsx(n,{label:"Padding",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Y,value:x,onChange:t=>E(t)})}),e.jsx(n,{label:"Input surface",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Z,value:y,onChange:t=>I(t)})}),e.jsx(n,{label:"Size",children:e.jsx(i,{fullWidth:!0,size:"sm",options:ee,value:v,onChange:t=>K(t)})})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Add button label",children:e.jsx(M,{size:"sm",value:g,onChange:t=>T(t.target.value)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(r,{label:"Hint",checked:f,onChange:F}),e.jsx(r,{label:"Help text",checked:b,onChange:D}),e.jsx(r,{label:"Error",checked:j,onChange:L}),e.jsx(r,{label:"Disabled",checked:k,onChange:O}),e.jsx(r,{label:"Flag duplicate keys",checked:C,onChange:R}),e.jsx(r,{label:"Cap at 5 rows",checked:w,onChange:z})]})]})},...G?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Specular",children:e.jsx(i,{fullWidth:!0,size:"sm",options:ae,value:S,onChange:t=>H(t)})}),e.jsx(n,{label:"Vibrancy",children:e.jsx(i,{fullWidth:!0,size:"sm",options:te,value:P,onChange:t=>U(t)})}),e.jsx(n,{label:"Glass opacity",children:e.jsx(i,{fullWidth:!0,size:"sm",options:se,value:N,onChange:t=>W(t)})})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(u,{label:"Metadata",hint:f?"Store extra settings via key/value pairs":void 0,help:b?"Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised.":void 0,error:j?"At least one entry is required.":void 0,value:s,onChange:l,addLabel:g,variant:o,tone:h,corner:m,padding:x,inputVariant:y,size:v,disabled:k,flagDuplicateKeys:C,maxRows:w?5:void 0,glassOpacity:N,vibrancy:P,specularMode:S})})})})},re=[{key:"ENV",value:"production"},{key:"DEBUG",value:"false"},{key:"host",value:"localhost"},{key:"port",value:"27017"}];function oe(){const[s,l]=a.useState(re);return e.jsx("div",{className:"w-full",children:e.jsx(u,{label:"Metadata",hint:"Store extra settings via key/value pairs",help:"Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised.",value:s,onChange:l,tone:"blue",variant:"outlined"})})}const ue=`import { useState } from "react";
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
`,de=[{key:"region",value:"eu-west-1"},{key:"REPLICAS",value:"3"},{key:"region",value:"us-east-1"}];function ce(){const[s,l]=a.useState(de);return e.jsxs("div",{className:"w-full",children:[e.jsx(u,{label:"Deployment config",value:s,onChange:l,tone:"amber",variant:"tonal"}),e.jsxs("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:["Two rows share the key ",e.jsx("code",{children:"region"})," — both are flagged, because the second one would silently win when the map is serialised."]})]})}const pe=`import { useState } from "react";
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
`;function he(){const[s,l]=a.useState([]),[o,d]=a.useState([{key:"A",value:"1"},{key:"B",value:"2"},{key:"C",value:"3"}]);return e.jsxs("div",{className:"grid w-full gap-4 xl:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{label:"Headers",value:s,onChange:l,emptyState:"No custom headers yet."}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Empty — the dashed placeholder, with a custom message."})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{label:"Limits",value:o,onChange:d,maxRows:3,error:"At least one entry is required."}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Capped at three rows — the add button disables at the limit — with a field-level error."})]})]})}const me=`import { useState } from "react";
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
`,je=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(B,{name:"Key/Value Array",description:"Collect arbitrary metadata pairs. Renders a Panel, so it takes every container surface, and its inputs take every input surface — with duplicate-key flagging, a row cap and collapsible help."}),e.jsx(ie,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Environment variables",description:"The canonical case: a hint under the label, collapsible help, and a few seeded pairs. Add, edit and remove rows freely.",code:ue,filename:"EnvironmentVariables.tsx",children:e.jsx(oe,{})}),e.jsx(c,{title:"Duplicate keys",description:"Two rows share the key `region` — both are flagged, because the second would silently win when the map is serialised.",code:pe,filename:"DuplicateKeys.tsx",children:e.jsx(ce,{})}),e.jsx(c,{title:"States",description:"The empty placeholder with a custom message, and a field capped at three rows — the add button disables at the limit — with a field-level error.",code:me,filename:"States.tsx",children:e.jsx(he,{})})]})]});export{je as KeyValueArrayFieldPage,je as default};
