import{r as a,j as e,P as L,bP as t,M as i,aO as T,o as C}from"./index-p9Bv1Pn1.js";import{P as $}from"./PageHeader-DCZtzAyX.js";import{E as d}from"./ExampleCard-BS13YSEO.js";import{P as _,C as o,S,T as l}from"./PlaygroundPanel-BDClNSzf.js";import{C as A}from"./ControlAccordion-CydkdljU.js";import{n as B,t as D,ba as G,bb as Z,bc as W,bd as U}from"./options-Bqu3_N-h.js";const q=()=>{const[s,r]=a.useState(45),[p,O]=a.useState("md"),[c,P]=a.useState("blue"),[h,N]=a.useState("shimmer"),[f,M]=a.useState("normal"),[g,z]=a.useState("forward"),[j,y]=a.useState("full"),[m,k]=a.useState(!1),[v,E]=a.useState(!0),[w,R]=a.useState(!0),[u,I]=a.useState(!1),[x,V]=a.useState(!1);return a.useEffect(()=>{if(!u)return;const n=window.setInterval(()=>r(b=>b>=100?0:b+7),600);return()=>window.clearInterval(n)},[u]),e.jsx(_,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(A,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:`Value — ${s}`,children:e.jsx("input",{type:"range",min:0,max:100,value:s,disabled:m,onChange:n=>r(Number(n.target.value)),className:"w-full accent-blue-500 disabled:opacity-50","aria-label":"Progress value"})}),e.jsx(o,{label:"Size",children:e.jsx(i,{fullWidth:!0,size:"sm",options:B,value:p,onChange:n=>O(n)})}),e.jsx(S,{label:"Tone",options:D,value:c,onChange:n=>P(n)}),e.jsx(S,{label:"Motion",options:G,value:h,onChange:n=>N(n)}),e.jsx(o,{label:"Speed",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Z,value:f,onChange:n=>M(n)})}),e.jsx(o,{label:"Direction",children:e.jsx(i,{fullWidth:!0,size:"sm",options:W,value:g,onChange:n=>z(n)})}),e.jsx(o,{label:"Corner",children:e.jsx(i,{fullWidth:!0,size:"sm",options:U,value:j,onChange:n=>y(n)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Indeterminate",checked:m,onChange:k}),e.jsx(l,{label:"Label",checked:v,onChange:E}),e.jsx(l,{label:"Show value",checked:w,onChange:R}),e.jsx(l,{label:"Animate the value",checked:u,onChange:I}),e.jsx(l,{label:"On a glass panel",checked:x,onChange:V})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Indeterminate"})," drops ",e.jsx("code",{children:"aria-valuenow"})," ","entirely — that absence is what tells a screen reader the extent is unknown. A ",e.jsx("strong",{children:"label"})," also becomes the bar's accessible name; without one, the progress bar is announced as just “progress bar”."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(L,{variant:x?"liquid-glass":"outlined",tone:x?c:"neutral",padding:"md",children:e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:e.jsx(t,{size:p,color:c,corner:j,motion:h,motionSpeed:f,motionDirection:g,value:s,indeterminate:m,label:v?"Restoring snapshot":void 0,showValue:w})})})})})},F=()=>e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:T.map(s=>e.jsx(t,{motion:s,value:45,label:s,showValue:!0},s))}),H=`import { PROGRESS_MOTIONS, Progress } from "@cjlapao/ui-kit";

const EveryMotion = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    {PROGRESS_MOTIONS.map((motion) => (
      <Progress
        key={motion}
        motion={motion}
        value={45}
        label={motion}
        showValue
      />
    ))}
  </div>
);

export default EveryMotion;
`,J=()=>e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:C.map(s=>e.jsx(t,{size:s,value:45},s))}),K=`import { CONTROL_SIZES, Progress } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    {CONTROL_SIZES.map((size) => (
      <Progress key={size} size={size} value={45} />
    ))}
  </div>
);

export default SizeLadder;
`,Q=()=>e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:C.map(s=>e.jsx(t,{size:s,indeterminate:!0,label:`Size ${s}`,showValue:!0},s))}),X=`import { CONTROL_SIZES, Progress } from "@cjlapao/ui-kit";

const Indeterminate = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    {CONTROL_SIZES.map((size) => (
      <Progress
        key={size}
        size={size}
        indeterminate
        label={\`Size \${size}\`}
        showValue
      />
    ))}
  </div>
);

export default Indeterminate;
`,Y=()=>e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[e.jsx(t,{value:640,min:0,max:1024,label:"Disk image",showValue:!0,formatValue:(s,r)=>`${s} MB of 1024 MB (${Math.round(r)}%)`}),e.jsx(t,{value:128,min:0,max:1024,color:"violet",motion:"stripes",label:"Upload buffer",showValue:!0,formatValue:s=>`${s} MB`})]}),ee=`import { Progress } from "@cjlapao/ui-kit";

const CustomRange = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    <Progress
      value={640}
      min={0}
      max={1024}
      label="Disk image"
      showValue
      formatValue={(v, percent) =>
        \`\${v} MB of 1024 MB (\${Math.round(percent)}%)\`
      }
    />
    <Progress
      value={128}
      min={0}
      max={1024}
      color="violet"
      motion="stripes"
      label="Upload buffer"
      showValue
      formatValue={(v) => \`\${v} MB\`}
    />
  </div>
);

export default CustomRange;
`,re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($,{name:"Progress",description:"A determinate or indeterminate progress bar. Size and tone come from the shared scales; the motion overlays are driven by classes so a reduced-motion preference can switch them off."}),e.jsx(q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Every motion",description:"All six overlays — none, shimmer, pulse, shimmer-pulse, stripes and stripes-shimmer — at the same value.",code:H,filename:"EveryMotion.tsx",children:e.jsx(F,{})}),e.jsx(d,{title:"Size ladder",description:"The shared control scale — the track runs from a hairline to a chunky bar.",code:K,filename:"SizeLadder.tsx",children:e.jsx(J,{})}),e.jsx(d,{title:"Indeterminate",description:"Extent unknown, so the bar sweeps and no percentage is shown — and no aria-valuenow is published.",code:X,filename:"Indeterminate.tsx",children:e.jsx(Q,{})}),e.jsx(d,{title:"Custom range",description:"An arbitrary min–max with its own units, formatted for the label and for aria-valuetext.",code:ee,filename:"CustomRange.tsx",children:e.jsx(Y,{})})]})]});export{re as ProgressPage,re as default};
