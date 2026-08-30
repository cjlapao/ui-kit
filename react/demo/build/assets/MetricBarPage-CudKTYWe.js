import{r as a,j as e,bn as r,o as h}from"./index-p9Bv1Pn1.js";import{P as g}from"./PageHeader-DCZtzAyX.js";import{E as i}from"./ExampleCard-BS13YSEO.js";import{P as f,S as c,C as d,T as j}from"./PlaygroundPanel-BDClNSzf.js";import{C as b}from"./ControlAccordion-CydkdljU.js";import{n as v,t as w}from"./options-Bqu3_N-h.js";const C=()=>{const[s,m]=a.useState("sm"),[o,p]=a.useState("blue"),[t,u]=a.useState(62),[l,x]=a.useState(!0);return e.jsx(f,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(b,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Size",options:v,value:s,onChange:n=>m(n)}),e.jsx(c,{label:"Tone",options:w,value:o,onChange:n=>p(n)}),e.jsx(d,{label:"Fill",children:e.jsx("input",{type:"range",min:0,max:100,value:t,className:"w-full",onChange:n=>u(Number(n.target.value))})})]})},{id:"content",title:"Content",controls:e.jsx(d,{label:"Content",children:e.jsx(j,{label:"Free-form reading",checked:l,onChange:x})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The caption is the bar's accessible name. This component renders"," ",e.jsx("code",{children:"Progress"})," rather than drawing its own header — the hand-rolled one published no name, so the"," ",e.jsx("code",{children:'role="progressbar"'}),' under it was announced as just "progress bar".']})]}),preview:e.jsx("div",{className:"w-full max-w-md",children:e.jsx(r,{label:"Disk usage",value:l?`${Math.round(t*.2)} / 20 GB`:void 0,percentage:t,size:s,tone:o})})})};function S(){return e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:h.map(s=>e.jsx(r,{label:s,value:"12 / 20 GB",percentage:60,size:s},s))})}const T=`import { CONTROL_SIZES, MetricBar } from "@cjlapao/ui-kit";

/** The full shared control scale. It used to be pinned to \`sm\`. */
export default function Sizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {CONTROL_SIZES.map((size) => (
        <MetricBar key={size} label={size} value="12 / 20 GB" percentage={60} size={size} />
      ))}
    </div>
  );
}
`;function N(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:["emerald","amber","rose","violet"].map(s=>e.jsx(r,{label:s,value:"60%",percentage:60,tone:s},s))})}const y=`import { MetricBar } from "@cjlapao/ui-kit";

/** Any tone from the shared scale. It used to take only a \`SpinnerColor\`. */
export default function Tones() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["emerald", "amber", "rose", "violet"] as const).map((tone) => (
        <MetricBar key={tone} label={tone} value={\`\${60}%\`} percentage={60} tone={tone} />
      ))}
    </div>
  );
}
`,O=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(g,{name:"Metric Bar",description:"A labelled progress row: caption on the left, free-form reading on the right, bar underneath. It renders Progress rather than drawing its own header, so the caption becomes the bar's accessible name."}),e.jsx(C,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Sizes",description:"The full shared control scale. The component used to pin the bar underneath it to `sm`.",code:T,filename:"Sizes.tsx",children:e.jsx(S,{})}),e.jsx(i,{title:"Tones",description:"Any tone from the shared scale — it previously accepted only a `SpinnerColor`.",code:y,filename:"Tones.tsx",children:e.jsx(N,{})})]})]});export{O as MetricBarPage,O as default};
