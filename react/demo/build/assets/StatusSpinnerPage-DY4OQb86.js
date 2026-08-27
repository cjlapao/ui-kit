import{r as a,j as e,P as x,bJ as n,M as b,I as v,o as w,l as z}from"./index-BBK6HA-D.js";import{P as y}from"./PageHeader-BcBcU29I.js";import{E as l}from"./ExampleCard-BVwGIEPO.js";import{P as N,C as k,a as m,S as C,T as d}from"./ControlAccordion-DallGojj.js";import{n as O,t as T}from"./options-D-FMIizr.js";const L=()=>{const[s,u]=a.useState("md"),[i,g]=a.useState("blue"),[c,f]=a.useState(!0),[o,h]=a.useState(!0),[p,S]=a.useState("Deploying update"),[r,j]=a.useState(!1);return e.jsx(N,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(k,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Size",children:e.jsx(b,{fullWidth:!0,size:"sm",options:O,value:s,onChange:t=>u(t)})}),e.jsx(C,{label:"Tone",options:T,value:i,onChange:t=>g(t)})]})},{id:"options",title:"Options",controls:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(d,{label:"Animate",checked:c,onChange:f}),e.jsx(d,{label:"Label",checked:o,onChange:h}),e.jsx(d,{label:"On a glass panel",checked:r,onChange:j})]}),o&&e.jsx(m,{label:"Label text",children:e.jsx(v,{size:"sm",value:p,onChange:t=>S(t.target.value)})})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Without a label the circle announces “Loading”; with one, the visible text is the announcement. The ring stops spinning under"," ",e.jsx("code",{children:"prefers-reduced-motion"}),"."]})]}),preview:e.jsx(x,{variant:r?"liquid-glass":"outlined",tone:r?i:"neutral",padding:"md",children:e.jsx(n,{size:s,tone:i,animated:c,label:o&&p||void 0})})})},E=()=>e.jsx("div",{className:"flex w-full flex-wrap items-end gap-5",children:w.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(n,{size:s,tone:"blue"}),e.jsx("span",{className:"text-[11px] opacity-60",children:s})]},s))}),P=`import { CONTROL_SIZES, StatusSpinner } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full flex-wrap items-end gap-5">
    {CONTROL_SIZES.map((size) => (
      <div key={size} className="flex flex-col items-center gap-2">
        <StatusSpinner size={size} tone="blue" />
        <span className="text-[11px] opacity-60">{size}</span>
      </div>
    ))}
  </div>
);

export default SizeLadder;
`,R=()=>e.jsxs("div",{className:"flex w-full flex-wrap items-center justify-center gap-6",children:[e.jsx(n,{size:"md",tone:"blue",animated:!0,label:"Working"}),e.jsx(n,{size:"md",tone:"blue",animated:!1,label:"Idle"}),e.jsx(n,{size:"md",tone:"emerald",label:"Healthy"}),e.jsx(n,{size:"md",tone:"amber",label:"Pending"}),e.jsx(n,{size:"md",tone:"rose",animated:!1,label:"Failed"})]}),G=`import { StatusSpinner } from "@cjlapao/ui-kit";

const States = () => (
  <div className="flex w-full flex-wrap items-center justify-center gap-6">
    <StatusSpinner size="md" tone="blue" animated label="Working" />
    <StatusSpinner size="md" tone="blue" animated={false} label="Idle" />
    <StatusSpinner size="md" tone="emerald" label="Healthy" />
    <StatusSpinner size="md" tone="amber" label="Pending" />
    <StatusSpinner size="md" tone="rose" animated={false} label="Failed" />
  </div>
);

export default States;
`,I=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:z.map(s=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{size:"sm",tone:s}),e.jsx("span",{className:"text-xs opacity-70",children:s})]},s))}),A=`import { StatusSpinner, TRUE_COLORS } from "@cjlapao/ui-kit";

const EveryTone = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {TRUE_COLORS.map((tone) => (
      <div key={tone} className="flex items-center gap-3">
        <StatusSpinner size="sm" tone={tone} />
        <span className="text-xs opacity-70">{tone}</span>
      </div>
    ))}
  </div>
);

export default EveryTone;
`,_=()=>e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(x,{variant:"liquid-glass",tone:"blue",padding:"md",children:e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(n,{label:"Deploying update",tone:"blue"}),e.jsx(n,{size:"sm",tone:"emerald"})]})})}),F=`import { Panel, StatusSpinner } from "@cjlapao/ui-kit";

const OnGlass = () => (
  <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
    <Panel variant="liquid-glass" tone="blue" padding="md">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <StatusSpinner label="Deploying update" tone="blue" />
        <StatusSpinner size="sm" tone="emerald" />
      </div>
    </Panel>
  </div>
);

export default OnGlass;
`,Z=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(y,{name:"Status Spinner",description:"A spinner with a glowing centre dot for async states. The ring rides the shared control scale, so it lines up with the Spinner or Button beside it; the tone is any of the 21 true colours, and the label is announced once, in the surface's own copy colour."}),e.jsx(L,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Size ladder",description:"The shared control scale — from a 16 px hairline ring to a 40 px one.",code:P,filename:"SizeLadder.tsx",children:e.jsx(E,{})}),e.jsx(l,{title:"Async states",description:"Working and idle share a tone; terminal states pick their own. Finished work stops spinning.",code:G,filename:"States.tsx",children:e.jsx(R,{})}),e.jsx(l,{title:"Every tone",description:"All 21 true colours, each with its own centre dot and glow.",code:A,filename:"EveryTone.tsx",children:e.jsx(I,{})}),e.jsx(l,{title:"On glass",description:"The label takes its colour from the surface it sits on; the unlabelled ring announces “Loading”.",code:F,filename:"OnGlass.tsx",children:e.jsx(_,{})})]})]});export{Z as StatusSpinnerPage,Z as default};
