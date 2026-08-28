import{r as s,j as e,bg as l,M as S}from"./index-8i9ZNynb.js";import{P as F}from"./PageHeader-CO5k_SQv.js";import{E as u}from"./ExampleCard-LdxcpmX_.js";import{P as G,C as a,T as x}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as k}from"./ControlAccordion-Bqp-1oBj.js";import{a$ as M}from"./options-yAU-f7tt.js";const L=()=>{const[m,f]=s.useState("healthy"),[n,j]=s.useState(60),[i,w]=s.useState(560),[o,N]=s.useState(160),[r,v]=s.useState(2),[d,b]=s.useState(.6),[c,C]=s.useState(!1),[g,y]=s.useState(!1),[h,W]=s.useState(!1),[p,E]=s.useState("#22d3ee");return e.jsx(G,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(k,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(a,{label:`Width (${i}px)`,children:e.jsx("input",{type:"range",min:240,max:960,step:20,value:i,disabled:c,onChange:t=>w(Number(t.target.value)),className:"w-full accent-blue-500 disabled:opacity-40"})}),e.jsx(a,{label:`Height (${o}px)`,children:e.jsx("input",{type:"range",min:80,max:320,step:8,value:o,onChange:t=>N(Number(t.target.value)),className:"w-full accent-blue-500"})}),e.jsx(a,{label:`Line width (${r}px)`,children:e.jsx("input",{type:"range",min:.5,max:8,step:.5,value:r,onChange:t=>v(Number(t.target.value)),className:"w-full accent-blue-500"})}),e.jsx(a,{label:`Glow (${Math.round(d*100)}%)`,children:e.jsx("input",{type:"range",min:0,max:1,step:.05,value:d,onChange:t=>b(Number(t.target.value)),className:"w-full accent-blue-500"})})]})},{id:"states",title:"States",controls:e.jsx(a,{label:"State",children:e.jsx(S,{fullWidth:!0,size:"sm",options:M,value:m,onChange:t=>f(t)})})},{id:"content",title:"Content",controls:e.jsx(a,{label:`BPM (${n})`,children:e.jsx("input",{type:"range",min:20,max:180,step:5,value:n,onChange:t=>j(Number(t.target.value)),className:"w-full accent-blue-500"})})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(x,{label:"Use full width",checked:c,onChange:C}),e.jsx(x,{label:"Show grid",checked:g,onChange:y}),e.jsx(x,{label:"Custom line colour",checked:h,onChange:W})]}),e.jsx(a,{label:"Line colour",children:e.jsx("input",{type:"color",value:p,disabled:!h,onChange:t=>E(t.target.value),className:"h-8 w-full cursor-pointer rounded border border-slate-200 bg-transparent disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"})})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The canvas exposes itself as an ",e.jsx("code",{children:"img"})," with a text description, so screen readers hear “Healthy, 60 beats per minute” instead of pixels."]})]}),preview:e.jsx("div",{className:"flex w-full flex-col gap-6",children:e.jsx(l,{state:m,width:i,height:o,lineColor:h?p:void 0,lineGlowIntensity:d,lineWidth:r,useFullWidth:c,bpm:n,showGrid:g,className:"rounded-xl"})})})},P=()=>e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-3",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-slate-500 dark:text-slate-400",children:"Healthy"}),e.jsx(l,{state:"healthy",height:96,useFullWidth:!0,className:"rounded-xl"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-slate-500 dark:text-slate-400",children:"Warning"}),e.jsx(l,{state:"warning",height:96,useFullWidth:!0,className:"rounded-xl"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-slate-500 dark:text-slate-400",children:"Unhealthy"}),e.jsx(l,{state:"unhealthy",height:96,useFullWidth:!0,className:"rounded-xl"})]})]}),H=`import { EcgMonitor } from "@cjlapao/ui-kit";

const States = () => (
  <div className="grid w-full gap-4 lg:grid-cols-3">
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Healthy
      </span>
      <EcgMonitor
        state="healthy"
        height={96}
        useFullWidth
        className="rounded-xl"
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Warning
      </span>
      <EcgMonitor
        state="warning"
        height={96}
        useFullWidth
        className="rounded-xl"
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Unhealthy
      </span>
      <EcgMonitor
        state="unhealthy"
        height={96}
        useFullWidth
        className="rounded-xl"
      />
    </div>
  </div>
);

export default States;
`,T=()=>e.jsx("div",{className:"w-full",children:e.jsx(l,{state:"healthy",height:160,useFullWidth:!0,showGrid:!0,bpm:72,className:"rounded-xl"})}),$=`import { EcgMonitor } from "@cjlapao/ui-kit";

const FullWidthGrid = () => (
  <div className="w-full">
    <EcgMonitor
      state="healthy"
      height={160}
      useFullWidth
      showGrid
      bpm={72}
      className="rounded-xl"
    />
  </div>
);

export default FullWidthGrid;
`,U=()=>e.jsx("div",{className:"w-full",children:e.jsx(l,{state:"warning",width:640,height:120,lineColor:"#22d3ee",lineGlowIntensity:.9,lineWidth:3,className:"rounded-xl"})}),I=`import { EcgMonitor } from "@cjlapao/ui-kit";

const CustomLine = () => (
  <div className="w-full">
    <EcgMonitor
      state="warning"
      width={640}
      height={120}
      lineColor="#22d3ee"
      lineGlowIntensity={0.9}
      lineWidth={3}
      className="rounded-xl"
    />
  </div>
);

export default CustomLine;
`,D=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(F,{name:"ECG Monitor",description:"A canvas ECG trace for service health — a steady rhythm when healthy, a jittered one when degraded, a flatline when down. The trace redraws every animation frame and falls back to a static frame under prefers-reduced-motion."}),e.jsx(L,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(u,{title:"States",description:"The three health states side by side — one trace generator, three rhythms and colours.",code:H,filename:"States.tsx",children:e.jsx(P,{})}),e.jsx(u,{title:"Full width with grid",description:"useFullWidth stretches the trace to its container; showGrid adds the ECG-paper lines behind it.",code:$,filename:"FullWidthGrid.tsx",children:e.jsx(T,{})}),e.jsx(u,{title:"Custom line",description:"Override the state colour with lineColor and push the glow and stroke weight for a bolder readout.",code:I,filename:"CustomLine.tsx",children:e.jsx(U,{})})]})]});export{D as EcgMonitorPage,D as default};
