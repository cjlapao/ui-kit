import{r as t,j as e,S as l,e as M,M as m,_ as T,I as H}from"./index-p9Bv1Pn1.js";import{P as L}from"./PageHeader-DCZtzAyX.js";import{E as d}from"./ExampleCard-BS13YSEO.js";import{P as O,C as f,S as V,T as p}from"./PlaygroundPanel-BDClNSzf.js";import{C as I}from"./ControlAccordion-CydkdljU.js";import{X as z,Y as F,t as P}from"./options-Bqu3_N-h.js";const $=[{label:"1",value:"1"},{label:"5",value:"5"},{label:"10",value:"10"}],G=[{label:"None",value:"0"},{label:"10",value:"10"},{label:"25",value:"25"}],_=n=>Array.isArray(n)?`${n[0]} – ${n[1]}`:String(n),W=()=>{const[n,s]=t.useState(!1),[a,i]=t.useState("horizontal"),[o,u]=t.useState(1),[c,x]=t.useState("solid"),[v,w]=t.useState("blue"),[g,y]=t.useState(0),[S,B]=t.useState(!1),[b,D]=t.useState(!1),[R,j]=t.useState(50),[E,N]=t.useState([20,80]),C=n?E:R,A=r=>{n?N(r):j(r)};return e.jsx(O,{controls:e.jsx(I,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(f,{label:"Orientation",children:e.jsx(m,{fullWidth:!0,size:"sm",options:z,value:a,onChange:r=>i(r)})}),e.jsx(f,{label:"Step",children:e.jsx(m,{fullWidth:!0,size:"sm",options:$,value:String(o),onChange:r=>u(Number(r))})}),e.jsx(V,{label:"Variant",options:F,value:c,onChange:r=>x(r)}),e.jsx(V,{label:"Color",options:P,value:v,onChange:r=>w(r)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[n&&e.jsx(f,{label:"Min. steps apart",children:e.jsx(m,{fullWidth:!0,size:"sm",options:G,value:String(g),onChange:r=>y(Number(r))})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(p,{label:"Range mode",checked:n,onChange:s}),e.jsx(p,{label:"Read only",checked:S,onChange:B}),e.jsx(p,{label:"Disabled",checked:b,onChange:D})]})]})}]}),preview:e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{orientation:a,step:o,variant:c,color:v,range:n,minStepsBetweenHandles:g,readOnly:S,disabled:b,value:C,onChange:A,ariaLabel:"Playground slider",className:a==="vertical"?"h-48":void 0}),e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:_(C)})]}),e.jsx(M,{variant:"soft",size:"sm",onClick:()=>n?N([20,80]):j(50),children:"Reset"})]})]})})};function q(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{defaultValue:50}),e.jsx("span",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Drag the handle, or focus it and use the arrow, Home/End and Page keys."})]})}const U=`import { Slider } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <Slider defaultValue={50} />
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Drag the handle, or focus it and use the arrow, Home/End and Page keys.
      </span>
    </div>
  );
}
`,X="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100",Y={solid:"Solid",soft:"Soft",outline:"Outline",ghost:"Ghost",glass:"Glass"};function J(){return e.jsx("div",{className:"grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2",children:T.map(n=>e.jsxs("div",{children:[e.jsx("h4",{className:X,children:Y[n]??n}),e.jsx(l,{variant:n,defaultValue:50})]},n))})}const K=`import { Slider, SLIDER_VARIANTS } from "@cjlapao/ui-kit";

const headingClass =
  "mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100";

const LABELS: Record<string, string> = {
  solid: "Solid",
  soft: "Soft",
  outline: "Outline",
  ghost: "Ghost",
  glass: "Glass",
};

export default function Variants() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      {SLIDER_VARIANTS.map((variant) => (
        <div key={variant}>
          <h4 className={headingClass}>{LABELS[variant] ?? variant}</h4>
          <Slider variant={variant} defaultValue={50} />
        </div>
      ))}
    </div>
  );
}
`;function Q(){const[n,s]=t.useState(20);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{value:n,onChange:a=>s(a),step:20}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:n})]})]})}const Z=`import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function Step() {
  const [value, setValue] = useState(20);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <Slider
        value={value}
        onChange={(next) => setValue(next as number)}
        step={20}
      />
      <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        Value:{" "}
        <strong className="text-neutral-900 dark:text-neutral-100">{value}</strong>
      </span>
    </div>
  );
}
`;function ee(){const[n,s]=t.useState([20,80]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{range:!0,value:n,onChange:a=>s(a)}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[n[0]," – ",n[1]]})]})}const ne=`import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function Range() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <Slider
        range
        value={value}
        onChange={(next) => setValue(next as [number, number])}
      />
      <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        {value[0]} – {value[1]}
      </span>
    </div>
  );
}
`;function ae(){const[n,s]=t.useState([20,80]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{range:!0,value:n,onChange:a=>s(a),minStepsBetweenHandles:20}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[n[0]," – ",n[1]," (handles never sit closer than 20 steps)"]})]})}const te=`import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function HandlesDistance() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <Slider
        range
        value={value}
        onChange={(next) => setValue(next as [number, number])}
        minStepsBetweenHandles={20}
      />
      <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        {value[0]} – {value[1]} (handles never sit closer than 20 steps)
      </span>
    </div>
  );
}
`,k=[{label:"Bass",value:40},{label:"Mid",value:70},{label:"Treble",value:55}];function se(){const[n,s]=t.useState(k.map(a=>a.value));return e.jsx("div",{className:"flex items-end justify-center gap-6",children:k.map((a,i)=>e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx(l,{value:n[i],onChange:o=>s(u=>u.map((c,x)=>x===i?o:c)),orientation:"vertical",className:"h-56",ariaLabel:a.label}),e.jsx("span",{className:"font-mono text-xs uppercase text-neutral-500 dark:text-neutral-400",children:a.label})]},a.label))})}const le=`import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

const BANDS = [
  { label: "Bass", value: 40 },
  { label: "Mid", value: 70 },
  { label: "Treble", value: 55 },
];

export default function Vertical() {
  const [values, setValues] = useState(BANDS.map((band) => band.value));
  return (
    <div className="flex items-end justify-center gap-6">
      {BANDS.map((band, index) => (
        <div key={band.label} className="flex flex-col items-center gap-3">
          <Slider
            value={values[index]}
            onChange={(next) =>
              setValues((prev) =>
                prev.map((v, i) => (i === index ? (next as number) : v)),
              )
            }
            orientation="vertical"
            className="h-56"
            ariaLabel={band.label}
          />
          <span className="font-mono text-xs uppercase text-neutral-500 dark:text-neutral-400">
            {band.label}
          </span>
        </div>
      ))}
    </div>
  );
}
`,h="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100";function re(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-8",children:[e.jsxs("div",{children:[e.jsx("h4",{className:h,children:"Disabled slider"}),e.jsx(l,{defaultValue:50,disabled:!0})]}),e.jsxs("div",{children:[e.jsx("h4",{className:h,children:"Disabled range"}),e.jsx(l,{range:!0,defaultValue:[20,80],disabled:!0})]}),e.jsxs("div",{children:[e.jsx("h4",{className:h,children:"Disabled start handle"}),e.jsx(l,{range:!0,defaultValue:[20,80],disabledMinHandle:!0})]})]})}const ie=`import { Slider } from "@cjlapao/ui-kit";

const headingClass =
  "mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100";

export default function Disabled() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div>
        <h4 className={headingClass}>Disabled slider</h4>
        <Slider defaultValue={50} disabled />
      </div>
      <div>
        <h4 className={headingClass}>Disabled range</h4>
        <Slider range defaultValue={[20, 80]} disabled />
      </div>
      <div>
        <h4 className={headingClass}>Disabled start handle</h4>
        <Slider range defaultValue={[20, 80]} disabledMinHandle />
      </div>
    </div>
  );
}
`;function oe(){const[n,s]=t.useState(50);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[e.jsx(H,{type:"number",min:0,max:100,value:n,onChange:a=>{const i=Number(a.target.value);a.target.value!==""&&Number.isFinite(i)&&s(Math.min(100,Math.max(0,i)))},"aria-label":"Value"}),e.jsx(l,{value:n,onChange:a=>s(a)})]})}const de=`import { useState } from "react";
import { Input, Slider } from "@cjlapao/ui-kit";

export default function Controlled() {
  const [value, setValue] = useState(50);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (event.target.value !== "" && Number.isFinite(next)) {
            setValue(Math.min(100, Math.max(0, next)));
          }
        }}
        aria-label="Value"
      />
      <Slider value={value} onChange={(next) => setValue(next as number)} />
    </div>
  );
}
`;function ue(){const[n,s]=t.useState(50),[a,i]=t.useState(50);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-4",children:[e.jsxs("div",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("div",{children:["change:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:n})]}),e.jsxs("div",{children:["slideend:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:a})]})]}),e.jsx(l,{value:n,onChange:o=>s(o),onSlideEnd:o=>i(o)})]})}const ce=`import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function ValueChange() {
  const [value, setValue] = useState(50);
  const [endValue, setEndValue] = useState(50);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        <div>
          change:{" "}
          <strong className="text-neutral-900 dark:text-neutral-100">{value}</strong>
        </div>
        <div>
          slideend:{" "}
          <strong className="text-neutral-900 dark:text-neutral-100">
            {endValue}
          </strong>
        </div>
      </div>
      <Slider
        value={value}
        onChange={(next) => setValue(next as number)}
        onSlideEnd={(next) => setEndValue(next as number)}
      />
    </div>
  );
}
`,me=[{label:"Contrast",value:"Contrast"},{label:"Brightness",value:"Brightness"},{label:"Sepia",value:"Sepia"}];function xe(){const[n,s]=t.useState("Contrast"),[a,i]=t.useState({Contrast:100,Brightness:100,Sepia:0});return e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx("div",{className:"h-44 w-64 rounded-xl bg-linear-to-br from-sky-300 via-indigo-400 to-rose-400 dark:from-sky-700 dark:via-indigo-800 dark:to-rose-900",style:{filter:`contrast(${a.Contrast}%) brightness(${a.Brightness}%) sepia(${a.Sepia}%)`},"aria-hidden":"true"}),e.jsx(m,{size:"sm",options:me,value:n,onChange:s,truncateOverflow:!1}),e.jsx("div",{className:"w-64",children:e.jsx(l,{min:0,max:200,value:a[n],onChange:o=>i(u=>({...u,[n]:o}))})}),e.jsxs("span",{className:"font-mono text-xs text-neutral-500 dark:text-neutral-400",children:[n,": ",a[n],"%"]})]})}const fe=`import { useState } from "react";
import { MultiToggle, Slider } from "@cjlapao/ui-kit";

const FILTERS = [
  { label: "Contrast", value: "Contrast" },
  { label: "Brightness", value: "Brightness" },
  { label: "Sepia", value: "Sepia" },
];

export default function Filter() {
  const [active, setActive] = useState("Contrast");
  const [values, setValues] = useState<Record<string, number>>({
    Contrast: 100,
    Brightness: 100,
    Sepia: 0,
  });
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="h-44 w-64 rounded-xl bg-linear-to-br from-sky-300 via-indigo-400 to-rose-400 dark:from-sky-700 dark:via-indigo-800 dark:to-rose-900"
        style={{
          filter: \`contrast(\${values.Contrast}%) brightness(\${values.Brightness}%) sepia(\${values.Sepia}%)\`,
        }}
        aria-hidden="true"
      />
      <MultiToggle
        size="sm"
        options={FILTERS}
        value={active}
        onChange={setActive}
        truncateOverflow={false}
      />
      <div className="w-64">
        <Slider
          min={0}
          max={200}
          value={values[active]}
          onChange={(next) =>
            setValues((prev) => ({ ...prev, [active]: next as number }))
          }
        />
      </div>
      <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
        {active}: {values[active]}%
      </span>
    </div>
  );
}
`,je=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(L,{name:"Slider",description:"Drag a handle along a track — solid, soft, outline, ghost and glass variants, range mode, steps, vertical layout and full keyboard support."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Basic",description:"Uncontrolled, with the value set by `defaultValue`. The handle can be dragged, or focused and moved with the keyboard.",code:U,filename:"Basic.tsx",children:e.jsx(q,{})}),e.jsx(d,{title:"Variants",description:"The `variant` treatments from `Button`'s vocabulary that make sense for a track. `color` takes any of the 21 palette tones.",code:K,filename:"Variants.tsx",children:e.jsx(J,{})}),e.jsx(d,{title:"Step",description:"The size of each movement is defined with `step` — values snap to the step grid.",code:Z,filename:"Step.tsx",children:e.jsx(Q,{})}),e.jsx(d,{title:"Range",description:"`range` adds a second handle, and the value becomes a `[min, max]` pair.",code:ne,filename:"Range.tsx",children:e.jsx(ee,{})}),e.jsx(d,{title:"Handles Distance",description:"`minStepsBetweenHandles` keeps the two range handles a minimum number of steps apart.",code:te,filename:"HandlesDistance.tsx",children:e.jsx(ae,{})}),e.jsx(d,{title:"Vertical",description:'orientation="vertical" turns the track into a column — a natural fit for equalizer-style controls.',code:le,filename:"Vertical.tsx",children:e.jsx(se,{})}),e.jsx(d,{title:"Disabled",description:"`disabled` freezes the whole slider; `disabledMinHandle` / `disabledMaxHandle` freeze a single range handle.",code:ie,filename:"Disabled.tsx",children:e.jsx(re,{})}),e.jsx(d,{title:"Controlled",description:"The slider and a number input share one state, so either can drive the value.",code:de,filename:"Controlled.tsx",children:e.jsx(oe,{})}),e.jsx(d,{title:"Value Change",description:"`onChange` fires while the value moves; `onSlideEnd` fires once when the drag is released.",code:ce,filename:"ValueChange.tsx",children:e.jsx(ue,{})}),e.jsx(d,{title:"Filter",description:"Multiple sliders driving a CSS filter — the image updates as each handle moves.",code:fe,filename:"Filter.tsx",children:e.jsx(xe,{})})]})]});export{je as SliderPage,je as default};
