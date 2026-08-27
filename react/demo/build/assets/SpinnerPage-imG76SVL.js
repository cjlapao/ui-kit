import{r as a,j as e,P as h,bI as l,M as c,o as N,aM as b,aN as k,l as w}from"./index-BBK6HA-D.js";import{P as T}from"./PageHeader-BcBcU29I.js";import{E as t}from"./ExampleCard-BVwGIEPO.js";import{P as E,C as y,a as d,S as C,T as u}from"./ControlAccordion-DallGojj.js";import{n as O,t as z,ba as R,bb as P}from"./options-D-FMIizr.js";const I=()=>{const[s,i]=a.useState("md"),[o,g]=a.useState("blue"),[p,f]=a.useState("solid"),[x,v]=a.useState("normal"),[m,S]=a.useState(!0),[r,j]=a.useState(!1);return e.jsx(E,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(y,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Size",children:e.jsx(c,{fullWidth:!0,size:"sm",options:O,value:s,onChange:n=>i(n)})}),e.jsx(C,{label:"Tone",options:z,value:o,onChange:n=>g(n)}),e.jsx(d,{label:"Variant",children:e.jsx(c,{fullWidth:!0,size:"sm",options:R,value:p,onChange:n=>f(n)})}),e.jsx(d,{label:"Thickness",children:e.jsx(c,{fullWidth:!0,size:"sm",options:P,value:x,onChange:n=>v(n)})})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(u,{label:"Label",checked:m,onChange:S}),e.jsx(u,{label:"On a glass panel",checked:r,onChange:j})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Without a ",e.jsx("strong",{children:"label"})," the ring announces “Loading”; with one, the visible text is the announcement — the old sr-only copy would have said it twice. The ring stops spinning under ",e.jsx("code",{children:"prefers-reduced-motion"}),"."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(h,{variant:r?"liquid-glass":"outlined",tone:r?o:"neutral",padding:"md",children:e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:e.jsx(l,{size:s,color:o,variant:p,thickness:x,label:m?"Deploying update":void 0})})})})})},L=()=>e.jsx("div",{className:"flex w-full flex-wrap items-end gap-5",children:N.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{size:s}),e.jsx("span",{className:"text-[11px] opacity-60",children:s})]},s))}),A=`import { CONTROL_SIZES, Spinner } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full flex-wrap items-end gap-5">
    {CONTROL_SIZES.map((size) => (
      <div key={size} className="flex flex-col items-center gap-2">
        <Spinner size={size} />
        <span className="text-[11px] opacity-60">{size}</span>
      </div>
    ))}
  </div>
);

export default SizeLadder;
`,_=()=>e.jsx("div",{className:"flex w-full max-w-md flex-col gap-5",children:b.map(s=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s}),e.jsx("div",{className:"flex flex-wrap items-center gap-4",children:k.map(i=>e.jsx(l,{size:"lg",variant:s,thickness:i},i))})]},s))}),V=`import { SPINNER_THICKNESSES, SPINNER_VARIANTS, Spinner } from "@cjlapao/ui-kit";

const VariantsAndThicknesses = () => (
  <div className="flex w-full max-w-md flex-col gap-5">
    {SPINNER_VARIANTS.map((variant) => (
      <div key={variant} className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          {variant}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          {SPINNER_THICKNESSES.map((thickness) => (
            <Spinner key={thickness} size="lg" variant={variant} thickness={thickness} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default VariantsAndThicknesses;
`,G=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:w.map(s=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(l,{size:"sm",color:s}),e.jsx("span",{className:"text-xs opacity-70",children:s})]},s))}),H=`import { Spinner, TRUE_COLORS } from "@cjlapao/ui-kit";

const EveryTone = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {TRUE_COLORS.map((color) => (
      <div key={color} className="flex items-center gap-3">
        <Spinner size="sm" color={color} />
        <span className="text-xs opacity-70">{color}</span>
      </div>
    ))}
  </div>
);

export default EveryTone;
`,W=()=>e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(h,{variant:"liquid-glass",tone:"blue",padding:"md",children:e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(l,{label:"Deploying update",color:"blue"}),e.jsx(l,{size:"sm",color:"emerald"})]})})}),q=`import { Panel, Spinner } from "@cjlapao/ui-kit";

const OnGlass = () => (
  <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
    <Panel variant="liquid-glass" tone="blue" padding="md">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Spinner label="Deploying update" color="blue" />
        <Spinner size="sm" color="emerald" />
      </div>
    </Panel>
  </div>
);

export default OnGlass;
`,B=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(T,{name:"Spinner",description:"An indeterminate ring. Size comes from the shared control scale so it lines up with the Button beside it; the label is announced once and takes its copy colour from the surface it sits on."}),e.jsx(I,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(t,{title:"Size ladder",description:"The shared control scale — the ring runs from a 16 px hairline to a 40 px one.",code:A,filename:"SizeLadder.tsx",children:e.jsx(L,{})}),e.jsx(t,{title:"Variants and thicknesses",description:"Solid versus segments, each at the three border weights.",code:V,filename:"VariantsAndThicknesses.tsx",children:e.jsx(_,{})}),e.jsx(t,{title:"Every tone",description:"All 21 true colours on the same sm ring.",code:H,filename:"EveryTone.tsx",children:e.jsx(G,{})}),e.jsx(t,{title:"On glass",description:"The label takes its colour from the surface it sits on; the second ring has no label, so it announces “Loading”.",code:q,filename:"OnGlass.tsx",children:e.jsx(W,{})})]})]});export{B as SpinnerPage,B as default};
