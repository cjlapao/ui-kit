import{r as s,j as e,P as G,C as U,i as _,S as i,cr as W,I as K,M as J}from"./index-B9JeX19j.js";import{P as Q,A as X,a as S,C as t}from"./A11ySections-C9rTCDac.js";import{P as Y}from"./PageHeader-D-LFwZLT.js";import{E as u}from"./ExampleCard-BwESxlwz.js";import{P as Z,C as h,a as ee,T as c}from"./PlaygroundPanel-CZvYEX_V.js";import{C as ae}from"./ControlAccordion-rp4gabXb.js";import{u as ne,E as te}from"./EventLog-EYY1E4QF.js";import{_ as se,$ as le}from"./options-Blq0niUd.js";const re=[{label:"1",value:"1"},{label:"5",value:"5"},{label:"10",value:"10"}],ie=[{label:"None",value:"0"},{label:"10",value:"10"},{label:"25",value:"25"}],w=a=>Array.isArray(a)?`${a[0]} – ${a[1]}`:String(a),oe=()=>{const[a,l]=s.useState(!1),[n,o]=s.useState("horizontal"),[d,m]=s.useState(1),[x,p]=s.useState("solid"),[f,L]=s.useState("blue"),[N,M]=s.useState(0),[C,P]=s.useState(!1),[V,H]=s.useState(!1),[y,O]=s.useState(!1),[E,T]=s.useState(!1),[g,I]=s.useState(!1),[z,v]=s.useState(50),[F,j]=s.useState([20,80]),[$,D]=ne(),b=a?F:z,q=r=>{a?j(r):v(r),D(w(r))},B=e.jsx("div",{className:n==="vertical"?"py-2":"py-4",children:e.jsx(i,{orientation:n,step:d,variant:x,tone:f,range:a,minStepsBetweenHandles:N,invalid:C,readOnly:V,disabled:y,value:b,onChange:q,onSlideEnd:r=>D(`slide end → ${w(r)}`),ariaLabel:"Playground slider",className:n==="vertical"?"h-48":void 0})});return e.jsx(Z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ae,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Orientation",options:se,value:n,onChange:r=>o(r)}),e.jsx(h,{label:"Step",options:re,value:String(d),onChange:r=>m(Number(r))}),e.jsx(h,{label:"Variant",options:le,value:x,onChange:r=>p(r)}),e.jsx(ee,{label:"Tone",children:e.jsx(U,{selectable:!0,size:"sm",value:f,onSelect:L,defaultExpanded:!0})})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[a&&e.jsx(h,{label:"Min. steps apart",options:ie,value:String(N),onChange:r=>M(Number(r))}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"Range mode",checked:a,onChange:l}),e.jsx(c,{label:"Invalid",checked:C,onChange:P}),e.jsx(c,{label:"Read only",checked:V,onChange:H}),e.jsx(c,{label:"Disabled",checked:y,onChange:O}),e.jsx(c,{label:"In a panel",checked:E,onChange:T}),e.jsx(c,{label:"On a glass panel",checked:g,onChange:r=>{I(r),r&&T(!0)}})]})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The handle is a real ",e.jsx("strong",{children:"slider"})," role — arrows step, PageUp/PageDown jump ten steps, Home/End go to the bounds. Clicking the track grabs the nearest handle; in range mode the handles can be pinned apart and frozen one at a time."]}),e.jsx(te,{log:$,emptyText:"No events yet — drag or key a handle."})]}),preview:e.jsx("div",{className:"w-full",children:E?e.jsx(G,{corner:"none",variant:g?"liquid-glass":"outlined",tone:g?f:"neutral",padding:"md",scrollable:!1,children:e.jsx(A,{value:b,onReset:()=>a?j([20,80]):v(50),children:B})}):e.jsx(A,{value:b,onReset:()=>a?j([20,80]):v(50),children:B})})})},A=({value:a,onReset:l,children:n})=>e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[n,e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:w(a)})]}),e.jsx(_,{variant:"soft",size:"sm",onClick:l,children:"Reset"})]})]});function de(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(i,{defaultValue:50}),e.jsx("span",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Drag the handle, or focus it and use the arrow, Home/End and Page keys."})]})}const ue=`import { Slider } from "@cjlapao/ui-kit";

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
`,ce="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100",me={solid:"Solid",soft:"Soft",outline:"Outline",ghost:"Ghost",glass:"Glass"};function xe(){return e.jsx("div",{className:"grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2",children:W.map(a=>e.jsxs("div",{children:[e.jsx("h4",{className:ce,children:me[a]??a}),e.jsx(i,{variant:a,defaultValue:50})]},a))})}const he=`import { Slider, SLIDER_VARIANTS } from "@cjlapao/ui-kit";

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
`;function pe(){const[a,l]=s.useState(20);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(i,{value:a,onChange:n=>l(n),step:20}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:["Value:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:a})]})]})}const fe=`import { useState } from "react";
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
        <strong className="text-neutral-900 dark:text-neutral-100">
          {value}
        </strong>
      </span>
    </div>
  );
}
`;function ge(){const[a,l]=s.useState([20,80]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(i,{range:!0,value:a,onChange:n=>l(n)}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[a[0]," – ",a[1]]})]})}const ve=`import { useState } from "react";
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
`;function je(){const[a,l]=s.useState([20,80]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(i,{range:!0,value:a,onChange:n=>l(n),minStepsBetweenHandles:20}),e.jsxs("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[a[0]," – ",a[1]," (handles never sit closer than 20 steps)"]})]})}const be=`import { useState } from "react";
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
`,R=[{label:"Bass",value:40},{label:"Mid",value:70},{label:"Treble",value:55}];function Se(){const[a,l]=s.useState(R.map(n=>n.value));return e.jsx("div",{className:"flex items-end justify-center gap-6",children:R.map((n,o)=>e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx(i,{value:a[o],onChange:d=>l(m=>m.map((x,p)=>p===o?d:x)),orientation:"vertical",className:"h-56",ariaLabel:n.label}),e.jsx("span",{className:"font-mono text-xs uppercase text-neutral-500 dark:text-neutral-400",children:n.label})]},n.label))})}const ke=`import { useState } from "react";
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
`,k="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100";function we(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-8",children:[e.jsxs("div",{children:[e.jsx("h4",{className:k,children:"Disabled slider"}),e.jsx(i,{defaultValue:50,disabled:!0})]}),e.jsxs("div",{children:[e.jsx("h4",{className:k,children:"Disabled range"}),e.jsx(i,{range:!0,defaultValue:[20,80],disabled:!0})]}),e.jsxs("div",{children:[e.jsx("h4",{className:k,children:"Disabled start handle"}),e.jsx(i,{range:!0,defaultValue:[20,80],disabledMinHandle:!0})]})]})}const Ne=`import { Slider } from "@cjlapao/ui-kit";

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
`;function Ce(){const[a,l]=s.useState(50);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[e.jsx(K,{type:"number",min:0,max:100,value:a,onChange:n=>{const o=Number(n.target.value);n.target.value!==""&&Number.isFinite(o)&&l(Math.min(100,Math.max(0,o)))},"aria-label":"Value"}),e.jsx(i,{value:a,onChange:n=>l(n)})]})}const Ve=`import { useState } from "react";
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
`;function ye(){const[a,l]=s.useState(50),[n,o]=s.useState(50);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-4",children:[e.jsxs("div",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("div",{children:["change:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:a})]}),e.jsxs("div",{children:["slideend:"," ",e.jsx("strong",{className:"text-neutral-900 dark:text-neutral-100",children:n})]})]}),e.jsx(i,{value:a,onChange:d=>l(d),onSlideEnd:d=>o(d)})]})}const Ee=`import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function ValueChange() {
  const [value, setValue] = useState(50);
  const [endValue, setEndValue] = useState(50);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        <div>
          change:{" "}
          <strong className="text-neutral-900 dark:text-neutral-100">
            {value}
          </strong>
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
`,Te=[{label:"Contrast",value:"Contrast"},{label:"Brightness",value:"Brightness"},{label:"Sepia",value:"Sepia"}];function De(){const[a,l]=s.useState("Contrast"),[n,o]=s.useState({Contrast:100,Brightness:100,Sepia:0});return e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx("div",{className:"h-44 w-64 rounded-xl bg-linear-to-br from-sky-300 via-indigo-400 to-rose-400 dark:from-sky-700 dark:via-indigo-800 dark:to-rose-900",style:{filter:`contrast(${n.Contrast}%) brightness(${n.Brightness}%) sepia(${n.Sepia}%)`},"aria-hidden":"true"}),e.jsx(J,{size:"sm",options:Te,value:a,onChange:l,truncateOverflow:!1}),e.jsx("div",{className:"w-64",children:e.jsx(i,{min:0,max:200,value:n[a],onChange:d=>o(m=>({...m,[a]:d}))})}),e.jsxs("span",{className:"font-mono text-xs text-neutral-500 dark:text-neutral-400",children:[a,": ",n[a],"%"]})]})}const Be=`import { useState } from "react";
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
`,ze=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Y,{name:"Slider",description:"Drag a handle along a track — solid, soft, outline, ghost and glass variants, range mode, steps, vertical layout and full keyboard support."}),e.jsx(oe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(u,{title:"Basic",description:"Uncontrolled, with the value set by `defaultValue`. The handle can be dragged, or focused and moved with the keyboard.",code:ue,filename:"Basic.tsx",children:e.jsx(de,{})}),e.jsx(u,{title:"Variants",description:"The `variant` treatments from `Button`'s vocabulary that make sense for a track. `tone` takes any of the palette tones.",code:he,filename:"Variants.tsx",children:e.jsx(xe,{})}),e.jsx(u,{title:"Step",description:"The size of each movement is defined with `step` — values snap to the step grid.",code:fe,filename:"Step.tsx",children:e.jsx(pe,{})}),e.jsx(u,{title:"Range",description:"`range` adds a second handle, and the value becomes a `[min, max]` pair.",code:ve,filename:"Range.tsx",children:e.jsx(ge,{})}),e.jsx(u,{title:"Handles Distance",description:"`minStepsBetweenHandles` keeps the two range handles a minimum number of steps apart.",code:be,filename:"HandlesDistance.tsx",children:e.jsx(je,{})}),e.jsx(u,{title:"Vertical",description:'orientation="vertical" turns the track into a column — a natural fit for equalizer-style controls.',code:ke,filename:"Vertical.tsx",children:e.jsx(Se,{})}),e.jsx(u,{title:"Disabled",description:"`disabled` freezes the whole slider; `disabledMinHandle` / `disabledMaxHandle` freeze a single range handle.",code:Ne,filename:"Disabled.tsx",children:e.jsx(we,{})}),e.jsx(u,{title:"Controlled",description:"The slider and a number input share one state, so either can drive the value.",code:Ve,filename:"Controlled.tsx",children:e.jsx(Ce,{})}),e.jsx(u,{title:"Value Change",description:"`onChange` fires while the value moves; `onSlideEnd` fires once when the drag is released.",code:Ee,filename:"ValueChange.tsx",children:e.jsx(ye,{})}),e.jsx(u,{title:"Filter",description:"Multiple sliders driving a CSS filter — the image updates as each handle moves.",code:Be,filename:"Filter.tsx",children:e.jsx(De,{})})]}),e.jsx(Q,{props:[{name:"value / defaultValue",type:"SliderValue | null",description:"A number — or a `[min, max]` pair in range mode. Uncontrolled defaults to the bounds (`[min, max]` in range mode)."},{name:"onChange / onSlideEnd",type:"(value: SliderValue) => void",description:"`onChange` fires on every move — drag, track click, keyboard; `onSlideEnd` once when a pointer drag is released."},{name:"min / max / step",type:"number",default:"0 / 100 / 1",description:"The value axis. Everything snaps to the step grid; non-finite values fall back to the defaults."},{name:"range",type:"boolean",default:"false",description:"Two handles that cannot cross, picking a `[min, max]` pair."},{name:"minStepsBetweenHandles",type:"number",default:"0",description:"Range mode: the handles may not come closer than this many steps apart."},{name:"orientation",type:"Orientation",default:'"horizontal"',description:"The shared orientation family; vertical grows a `h-64` default unless a height is given."},{name:"variant",type:"SliderVariant",default:'"solid"',description:"The same eight treatments `Button` offers, resolved through the shared slider token map."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Fill and handle colour. `color` still works as a deprecated alias — the kit standardized on `tone`."},{name:"invalid",type:"boolean",default:"false",description:"Paints fill, handle and focus ring with the error colour."},{name:"disabled / disabledMinHandle / disabledMaxHandle",type:"boolean",default:"false",description:"Whole-control freeze, or a single range handle frozen while the other stays live — frozen handles leave the tab order."},{name:"readOnly",type:"boolean",default:"false",description:"Focusable but not editable — announced via `aria-readonly`, visually unchanged."},{name:"ariaLabel",type:"string",default:'"Slider" (`kit.slider.label`)',description:"Names the handle(s). In range mode it flows into the translated phrases — &ldquo;Volume min&rdquo; / &ldquo;Volume max&rdquo;."},{name:"className / ref",type:"string / Ref<HTMLDivElement>",description:"Land on the root."}]}),e.jsxs(X,{children:[e.jsx(S,{title:"Screen reader",children:e.jsxs("p",{children:["Each handle is a real ",e.jsx(t,{children:'role="slider"'})," with ",e.jsx(t,{children:"aria-valuemin"}),"/",e.jsx(t,{children:"aria-valuemax"}),"/",e.jsx(t,{children:"aria-valuenow"})," and ",e.jsx(t,{children:"aria-orientation"})," ","— range mode is two sliders, named through the catalog (“Minimum”/“Maximum”, or the translated phrase around an ",e.jsx(t,{children:"ariaLabel"}),"). ",e.jsx(t,{children:"readOnly"}),"announces ",e.jsx(t,{children:"aria-readonly"})," without pretending the handle is gone; frozen handles get ",e.jsx(t,{children:"aria-disabled"})," and leave the tab order. The fill and track are decoration."]})}),e.jsx(S,{title:"Keyboard support",children:e.jsxs("p",{children:["The standard slider key set, all of it: ",e.jsx(t,{children:"ArrowLeft"}),"/",e.jsx(t,{children:"ArrowRight"})," and ",e.jsx(t,{children:"ArrowDown"}),"/",e.jsx(t,{children:"ArrowUp"})," step (so both axes work regardless of orientation), ",e.jsx(t,{children:"PageDown"}),"/",e.jsx(t,{children:"PageUp"})," ","jump ten steps, ",e.jsx(t,{children:"Home"}),"/",e.jsx(t,{children:"End"})," go to the bounds. A track click drags the nearest handle — and focus parks on that handle, so the keyboard story continues from where the pointer left off."]})}),e.jsx(S,{title:"Internationalization",children:e.jsxs("p",{children:["The handle names ride the catalog in five locales —",e.jsx(t,{children:"kit.slider.label"})," plus ",e.jsx(t,{children:"kit.slider.min"}),"/",e.jsx(t,{children:"max"})," for bare range handles and ",e.jsx(t,{children:"minOf"}),"/",e.jsx(t,{children:"maxOf"})," when the caller named the group (",e.jsx(t,{children:"Lautstärke: Mindestwert"}),"). No English glue is ever bolted onto a user-provided name. What stays put: the number itself —"," ",e.jsx(t,{children:"aria-valuenow"})," is spoken raw (there is no",e.jsx(t,{children:"aria-valuetext"})," hook to the handles), so carry a unit in the",e.jsx(t,{children:"ariaLabel"})," instead — “Volume, percent”."]})})]})]});export{ze as SliderPage,ze as default};
