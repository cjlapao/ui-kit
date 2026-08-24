import{r as a,j as e,P as L,aG as t,M as i,ak as T,n as C}from"./index-B-ieYLXc.js";import{P as $,C as o,S as b,T as l,a as _,E as d}from"./PlaygroundPanel-CkWfNJii.js";import{n as B,t as D,a8 as G,a9 as A,aa as Z,ab as W}from"./options-C8y5quvx.js";const U=()=>{const[s,r]=a.useState(45),[p,O]=a.useState("md"),[c,M]=a.useState("blue"),[h,N]=a.useState("shimmer"),[f,P]=a.useState("normal"),[g,z]=a.useState("forward"),[v,k]=a.useState("full"),[m,y]=a.useState(!1),[j,E]=a.useState(!0),[w,R]=a.useState(!0),[u,I]=a.useState(!1),[x,V]=a.useState(!1);return a.useEffect(()=>{if(!u)return;const n=window.setInterval(()=>r(S=>S>=100?0:S+7),600);return()=>window.clearInterval(n)},[u]),e.jsx($,{controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:`Value — ${s}`,children:e.jsx("input",{type:"range",min:0,max:100,value:s,disabled:m,onChange:n=>r(Number(n.target.value)),className:"w-full accent-blue-500 disabled:opacity-50","aria-label":"Progress value"})}),e.jsx(o,{label:"Size",children:e.jsx(i,{fullWidth:!0,size:"sm",options:B,value:p,onChange:n=>O(n)})}),e.jsx(b,{label:"Tone",options:D,value:c,onChange:n=>M(n)}),e.jsx(b,{label:"Motion",options:G,value:h,onChange:n=>N(n)}),e.jsx(o,{label:"Speed",children:e.jsx(i,{fullWidth:!0,size:"sm",options:A,value:f,onChange:n=>P(n)})}),e.jsx(o,{label:"Direction",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Z,value:g,onChange:n=>z(n)})}),e.jsx(o,{label:"Corner",children:e.jsx(i,{fullWidth:!0,size:"sm",options:W,value:v,onChange:n=>k(n)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Indeterminate",checked:m,onChange:y}),e.jsx(l,{label:"Label",checked:j,onChange:E}),e.jsx(l,{label:"Show value",checked:w,onChange:R}),e.jsx(l,{label:"Animate the value",checked:u,onChange:I}),e.jsx(l,{label:"On a glass panel",checked:x,onChange:V})]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Indeterminate"})," drops ",e.jsx("code",{children:"aria-valuenow"})," ","entirely — that absence is what tells a screen reader the extent is unknown. A ",e.jsx("strong",{children:"label"})," also becomes the bar's accessible name; without one, the progress bar is announced as just “progress bar”."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(L,{variant:x?"liquid-glass":"outlined",tone:x?c:"neutral",padding:"md",children:e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:e.jsx(t,{size:p,color:c,corner:v,motion:h,motionSpeed:f,motionDirection:g,value:s,indeterminate:m,label:j?"Restoring snapshot":void 0,showValue:w})})})})})},q=()=>e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:T.map(s=>e.jsx(t,{motion:s,value:45,label:s,showValue:!0},s))}),F=`import { PROGRESS_MOTIONS, Progress } from "@cjlapao/ui-kit";

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
`,H=()=>e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:C.map(s=>e.jsx(t,{size:s,value:45},s))}),J=`import { CONTROL_SIZES, Progress } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    {CONTROL_SIZES.map((size) => (
      <Progress key={size} size={size} value={45} />
    ))}
  </div>
);

export default SizeLadder;
`,K=()=>e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:C.map(s=>e.jsx(t,{size:s,indeterminate:!0,label:`Size ${s}`,showValue:!0},s))}),Q=`import { CONTROL_SIZES, Progress } from "@cjlapao/ui-kit";

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
`,X=()=>e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[e.jsx(t,{value:640,min:0,max:1024,label:"Disk image",showValue:!0,formatValue:(s,r)=>`${s} MB of 1024 MB (${Math.round(r)}%)`}),e.jsx(t,{value:128,min:0,max:1024,color:"violet",motion:"stripes",label:"Upload buffer",showValue:!0,formatValue:s=>`${s} MB`})]}),Y=`import { Progress } from "@cjlapao/ui-kit";

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
`,ae=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Progress",description:"A determinate or indeterminate progress bar. Size and tone come from the shared scales; the motion overlays are driven by classes so a reduced-motion preference can switch them off."}),e.jsx(U,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Every motion",description:"All six overlays — none, shimmer, pulse, shimmer-pulse, stripes and stripes-shimmer — at the same value.",code:F,filename:"EveryMotion.tsx",children:e.jsx(q,{})}),e.jsx(d,{title:"Size ladder",description:"The shared control scale — the track runs from a hairline to a chunky bar.",code:J,filename:"SizeLadder.tsx",children:e.jsx(H,{})}),e.jsx(d,{title:"Indeterminate",description:"Extent unknown, so the bar sweeps and no percentage is shown — and no aria-valuenow is published.",code:Q,filename:"Indeterminate.tsx",children:e.jsx(K,{})}),e.jsx(d,{title:"Custom range",description:"An arbitrary min–max with its own units, formatted for the label and for aria-valuetext.",code:Y,filename:"CustomRange.tsx",children:e.jsx(X,{})})]})]});export{ae as ProgressPage,ae as default};
