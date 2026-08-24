import{r as t,j as e,S as l,e as A,M as x,W as T,I as H}from"./index-BqiwG-pR.js";import{P as L,C as f,S as V,T as h,a as O,E as d}from"./PlaygroundPanel-DuiPtEP5.js";import{R as I,T as z,t as F}from"./options-CD99P1yv.js";const P=[{label:"1",value:"1"},{label:"5",value:"5"},{label:"10",value:"10"}],$=[{label:"None",value:"0"},{label:"10",value:"10"},{label:"25",value:"25"}],G=n=>Array.isArray(n)?`${n[0]} – ${n[1]}`:String(n),W=()=>{const[n,s]=t.useState(!1),[a,i]=t.useState("horizontal"),[o,u]=t.useState(1),[c,m]=t.useState("solid"),[v,w]=t.useState("blue"),[g,y]=t.useState(0),[S,B]=t.useState(!1),[b,D]=t.useState(!1),[R,j]=t.useState(50),[E,N]=t.useState([20,80]),C=n?E:R,M=r=>{n?N(r):j(r)};return e.jsx(L,{controls:e.jsxs(e.Fragment,{children:[e.jsx(f,{label:"Orientation",children:e.jsx(x,{fullWidth:!0,size:"sm",options:I,value:a,onChange:r=>i(r)})}),e.jsx(f,{label:"Step",children:e.jsx(x,{fullWidth:!0,size:"sm",options:P,value:String(o),onChange:r=>u(Number(r))})}),e.jsx(V,{label:"Variant",options:z,value:c,onChange:r=>m(r)}),e.jsx(V,{label:"Color",options:F,value:v,onChange:r=>w(r)}),n&&e.jsx(f,{label:"Min. steps apart",children:e.jsx(x,{fullWidth:!0,size:"sm",options:$,value:String(g),onChange:r=>y(Number(r))})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(h,{label:"Range mode",checked:n,onChange:s}),e.jsx(h,{label:"Read only",checked:S,onChange:B}),e.jsx(h,{label:"Disabled",checked:b,onChange:D})]})]}),preview:e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{orientation:a,step:o,variant:c,color:v,range:n,minStepsBetweenHandles:g,readOnly:S,disabled:b,value:C,onChange:M,ariaLabel:"Playground slider",className:a==="vertical"?"h-48":void 0}),e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:G(C)})]}),e.jsx(A,{variant:"soft",size:"sm",onClick:()=>n?N([20,80]):j(50),children:"Reset"})]})]})})};function _(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{defaultValue:50}),e.jsx("span",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Drag the handle, or focus it and use the arrow, Home/End and Page keys."})]})}const q=`import { Slider } from "@cjlapao/ui-kit";

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
`,U="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100",J={solid:"Solid",soft:"Soft",outline:"Outline",ghost:"Ghost",glass:"Glass"};function K(){return e.jsx("div",{className:"grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2",children:T.map(n=>e.jsxs("div",{children:[e.jsx("h4",{className:U,children:J[n]??n}),e.jsx(l,{variant:n,defaultValue:50})]},n))})}const Q=`import { Slider, SLIDER_VARIANTS } from "@cjlapao/ui-kit";

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
`;function X(){const[n,s]=t.useState(20);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{value:n,onChange:a=>s(a),step:20}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:n})]})]})}const Y=`import { useState } from "react";
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
`;function Z(){const[n,s]=t.useState([20,80]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{range:!0,value:n,onChange:a=>s(a)}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[n[0]," – ",n[1]]})]})}const ee=`import { useState } from "react";
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
`;function ne(){const[n,s]=t.useState([20,80]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(l,{range:!0,value:n,onChange:a=>s(a),minStepsBetweenHandles:20}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[n[0]," – ",n[1]," (handles never sit closer than 20 steps)"]})]})}const ae=`import { useState } from "react";
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
`,k=[{label:"Bass",value:40},{label:"Mid",value:70},{label:"Treble",value:55}];function te(){const[n,s]=t.useState(k.map(a=>a.value));return e.jsx("div",{className:"flex items-end justify-center gap-6",children:k.map((a,i)=>e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx(l,{value:n[i],onChange:o=>s(u=>u.map((c,m)=>m===i?o:c)),orientation:"vertical",className:"h-56",ariaLabel:a.label}),e.jsx("span",{className:"font-mono text-xs uppercase text-neutral-500 dark:text-neutral-400",children:a.label})]},a.label))})}const se=`import { useState } from "react";
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
`,p="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100";function le(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-8",children:[e.jsxs("div",{children:[e.jsx("h4",{className:p,children:"Disabled slider"}),e.jsx(l,{defaultValue:50,disabled:!0})]}),e.jsxs("div",{children:[e.jsx("h4",{className:p,children:"Disabled range"}),e.jsx(l,{range:!0,defaultValue:[20,80],disabled:!0})]}),e.jsxs("div",{children:[e.jsx("h4",{className:p,children:"Disabled start handle"}),e.jsx(l,{range:!0,defaultValue:[20,80],disabledMinHandle:!0})]})]})}const re=`import { Slider } from "@cjlapao/ui-kit";

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
`;function ie(){const[n,s]=t.useState(50);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[e.jsx(H,{type:"number",min:0,max:100,value:n,onChange:a=>{const i=Number(a.target.value);a.target.value!==""&&Number.isFinite(i)&&s(Math.min(100,Math.max(0,i)))},"aria-label":"Value"}),e.jsx(l,{value:n,onChange:a=>s(a)})]})}const oe=`import { useState } from "react";
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
`;function de(){const[n,s]=t.useState(50),[a,i]=t.useState(50);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-4",children:[e.jsxs("div",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("div",{children:["change:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:n})]}),e.jsxs("div",{children:["slideend:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:a})]})]}),e.jsx(l,{value:n,onChange:o=>s(o),onSlideEnd:o=>i(o)})]})}const ue=`import { useState } from "react";
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
`,ce=[{label:"Contrast",value:"Contrast"},{label:"Brightness",value:"Brightness"},{label:"Sepia",value:"Sepia"}];function xe(){const[n,s]=t.useState("Contrast"),[a,i]=t.useState({Contrast:100,Brightness:100,Sepia:0});return e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx("div",{className:"h-44 w-64 rounded-xl bg-linear-to-br from-sky-300 via-indigo-400 to-rose-400 dark:from-sky-700 dark:via-indigo-800 dark:to-rose-900",style:{filter:`contrast(${a.Contrast}%) brightness(${a.Brightness}%) sepia(${a.Sepia}%)`},"aria-hidden":"true"}),e.jsx(x,{size:"sm",options:ce,value:n,onChange:s,truncateOverflow:!1}),e.jsx("div",{className:"w-64",children:e.jsx(l,{min:0,max:200,value:a[n],onChange:o=>i(u=>({...u,[n]:o}))})}),e.jsxs("span",{className:"font-mono text-xs text-neutral-500 dark:text-neutral-400",children:[n,": ",a[n],"%"]})]})}const me=`import { useState } from "react";
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
`,ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(O,{name:"Slider",description:"Drag a handle along a track — solid, soft, outline, ghost and glass variants, range mode, steps, vertical layout and full keyboard support."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Basic",description:"Uncontrolled, with the value set by `defaultValue`. The handle can be dragged, or focused and moved with the keyboard.",code:q,filename:"Basic.tsx",children:e.jsx(_,{})}),e.jsx(d,{title:"Variants",description:"The `variant` treatments from `Button`'s vocabulary that make sense for a track. `color` takes any of the 21 palette tones.",code:Q,filename:"Variants.tsx",children:e.jsx(K,{})}),e.jsx(d,{title:"Step",description:"The size of each movement is defined with `step` — values snap to the step grid.",code:Y,filename:"Step.tsx",children:e.jsx(X,{})}),e.jsx(d,{title:"Range",description:"`range` adds a second handle, and the value becomes a `[min, max]` pair.",code:ee,filename:"Range.tsx",children:e.jsx(Z,{})}),e.jsx(d,{title:"Handles Distance",description:"`minStepsBetweenHandles` keeps the two range handles a minimum number of steps apart.",code:ae,filename:"HandlesDistance.tsx",children:e.jsx(ne,{})}),e.jsx(d,{title:"Vertical",description:'orientation="vertical" turns the track into a column — a natural fit for equalizer-style controls.',code:se,filename:"Vertical.tsx",children:e.jsx(te,{})}),e.jsx(d,{title:"Disabled",description:"`disabled` freezes the whole slider; `disabledMinHandle` / `disabledMaxHandle` freeze a single range handle.",code:re,filename:"Disabled.tsx",children:e.jsx(le,{})}),e.jsx(d,{title:"Controlled",description:"The slider and a number input share one state, so either can drive the value.",code:oe,filename:"Controlled.tsx",children:e.jsx(ie,{})}),e.jsx(d,{title:"Value Change",description:"`onChange` fires while the value moves; `onSlideEnd` fires once when the drag is released.",code:ue,filename:"ValueChange.tsx",children:e.jsx(de,{})}),e.jsx(d,{title:"Filter",description:"Multiple sliders driving a CSS filter — the image updates as each handle moves.",code:me,filename:"Filter.tsx",children:e.jsx(xe,{})})]})]});export{ve as SliderPage,ve as default};
