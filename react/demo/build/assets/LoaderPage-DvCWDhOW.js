import{r as a,j as e,P as v,bt as r,M as g,o as I,l as R}from"./index-BBK6HA-D.js";import{P as V}from"./PageHeader-BcBcU29I.js";import{E as o}from"./ExampleCard-BVwGIEPO.js";import{P as G,C as H,a as d,S as U,T as t}from"./ControlAccordion-DallGojj.js";import{bc as W,n as _,t as D,bd as A}from"./options-D-FMIizr.js";const B=()=>{const[s,S]=a.useState("spinner"),[c,N]=a.useState("md"),[m,O]=a.useState("blue"),[l,j]=a.useState(40),[i,C]=a.useState(!1),[h,L]=a.useState(!0),[p,z]=a.useState(!0),[u,k]=a.useState(!1),[x,T]=a.useState(!1),[f,E]=a.useState(!0),[y,P]=a.useState("medium");return a.useEffect(()=>{if(!u)return;const n=window.setInterval(()=>j(b=>b>=100?0:b+7),600);return()=>window.clearInterval(n)},[u]),e.jsx(G,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(H,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Variant",children:e.jsx(g,{fullWidth:!0,size:"sm",options:W,value:s,onChange:n=>S(n)})}),e.jsx(d,{label:"Size",children:e.jsx(g,{fullWidth:!0,size:"sm",options:_,value:c,onChange:n=>N(n)})}),e.jsx(U,{label:"Tone",options:D,value:m,onChange:n=>O(n)})]})},...s==="progress"?[{id:"progress",title:"Progress",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(d,{label:`Progress — ${Math.round(l)}%`,children:e.jsx("input",{type:"range",min:0,max:100,value:l,disabled:i,onChange:n=>j(Number(n.target.value)),className:"w-full accent-blue-500 disabled:opacity-50","aria-label":"Loader progress"})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(t,{label:"Indeterminate",checked:i,onChange:C}),e.jsx(t,{label:"Animate the value",checked:u,onChange:k})]})]})}]:[],...x?[{id:"glass",title:"Glass",controls:e.jsx(d,{label:"Glass blur",children:e.jsx(g,{fullWidth:!0,size:"sm",options:A,value:y,onChange:n=>P(n)})})}]:[],{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(t,{label:"Title",checked:h,onChange:L}),e.jsx(t,{label:"Label",checked:p,onChange:z}),e.jsx(t,{label:"Overlay",checked:x,onChange:T}),e.jsx(t,{label:"Glass overlay",checked:f,onChange:E})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Indeterminate"})," sweeps the bar and drops"," ",e.jsx("code",{children:"aria-valuenow"})," — its absence is what tells a screen reader the extent is unknown, not a zero. The overlay covers the nearest positioned ancestor, so it is hosted in a card here."]})]}),preview:e.jsx("div",{className:"w-full",children:x?e.jsxs("div",{className:"relative h-56 overflow-hidden",children:[e.jsx(v,{variant:"outlined",padding:"sm",children:e.jsxs("div",{className:"space-y-2 text-sm opacity-80",children:[e.jsx("p",{children:"Quarterly revenue, by region"}),e.jsx("p",{className:"opacity-70",children:"The overlay fills this card — blur and scrim included — while the content behind stays in place."})]})}),e.jsx(r,{variant:s,size:c,color:m,progress:l,indeterminate:i,title:h?"Syncing workspace":void 0,label:p?"Uploading files":void 0,overlay:!0,glass:f,glassBlurIntensity:y})]}):e.jsx(v,{variant:"outlined",padding:"md",children:e.jsx("div",{className:"flex w-full max-w-md justify-center",children:e.jsx(r,{variant:s,size:c,color:m,progress:l,indeterminate:i,title:h?"Syncing workspace":void 0,label:p?"Uploading files":void 0})})})})})},M=()=>e.jsx("div",{className:"flex w-full flex-wrap items-end gap-6",children:I.map(s=>e.jsx(r,{size:s,label:s},s))}),Q=`import { CONTROL_SIZES, Loader } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full flex-wrap items-end gap-6">
    {CONTROL_SIZES.map((size) => (
      <Loader key={size} size={size} label={size} />
    ))}
  </div>
);

export default SizeLadder;
`,Z=()=>e.jsxs("div",{className:"grid w-full gap-6 md:grid-cols-2",children:[e.jsx(r,{variant:"progress",size:"md",progress:45,label:"Known extent"}),e.jsx(r,{variant:"progress",size:"md",indeterminate:!0,label:"Unknown extent"})]}),K=`import { Loader } from "@cjlapao/ui-kit";

const DeterminateVersusIndeterminate = () => (
  <div className="grid w-full gap-6 md:grid-cols-2">
    <Loader variant="progress" size="md" progress={45} label="Known extent" />
    <Loader variant="progress" size="md" indeterminate label="Unknown extent" />
  </div>
);

export default DeterminateVersusIndeterminate;
`,w=({children:s})=>e.jsxs("div",{className:"relative h-44 overflow-hidden",children:[e.jsx(v,{variant:"outlined",padding:"sm",children:e.jsxs("div",{className:"space-y-2 text-sm opacity-80",children:[e.jsx("p",{children:"Quarterly revenue, by region"}),e.jsx("p",{className:"opacity-70",children:"The overlay fills this card — blur and scrim included — while the content behind stays in place."})]})}),s]}),F=()=>e.jsxs("div",{className:"grid w-full gap-6 md:grid-cols-2",children:[e.jsx(w,{children:e.jsx(r,{overlay:!0,title:"Working…",size:"md"})}),e.jsx(w,{children:e.jsx(r,{overlay:!0,title:"Working…",size:"md",glass:!0})})]}),$=`import { Loader, Panel } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const OverlayHost = ({ children }: { children: ReactNode }) => (
  <div className="relative h-44 overflow-hidden">
    <Panel variant="outlined" padding="sm">
      <div className="space-y-2 text-sm opacity-80">
        <p>Quarterly revenue, by region</p>
        <p className="opacity-70">
          The overlay fills this card — blur and scrim included — while the
          content behind stays in place.
        </p>
      </div>
    </Panel>
    {children}
  </div>
);

const OverlayScrimVersusGlass = () => (
  <div className="grid w-full gap-6 md:grid-cols-2">
    <OverlayHost>
      <Loader overlay title="Working…" size="md" />
    </OverlayHost>
    <OverlayHost>
      <Loader overlay title="Working…" size="md" glass />
    </OverlayHost>
  </div>
);

export default OverlayScrimVersusGlass;
`,q=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:R.map(s=>e.jsx("div",{className:"flex items-center gap-3",children:e.jsx(r,{size:"sm",color:s,label:s})},s))}),J=`import { Loader, TRUE_COLORS } from "@cjlapao/ui-kit";

const EveryTone = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {TRUE_COLORS.map((color) => (
      <div key={color} className="flex items-center gap-3">
        <Loader size="sm" color={color} label={color} />
      </div>
    ))}
  </div>
);

export default EveryTone;
`,ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(V,{name:"Loader",description:"A loading state that can be a spinner, a progress bar, or an overlay covering its card. Size comes from the shared control scale and drives the ring, the bar, and the type together; the glass overlay takes its fill from the shared theme."}),e.jsx(B,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Size ladder",description:"The shared control scale drives the ring, the bar, and the type together.",code:Q,filename:"SizeLadder.tsx",children:e.jsx(M,{})}),e.jsx(o,{title:"Determinate versus indeterminate",description:"The same bar with and without a known extent — the indeterminate one sweeps and publishes no aria-valuenow.",code:K,filename:"DeterminateVersusIndeterminate.tsx",children:e.jsx(Z,{})}),e.jsx(o,{title:"Overlay — scrim versus glass",description:"The overlay covers the nearest positioned ancestor; the glass one takes its fill and blur from the shared theme.",code:$,filename:"OverlayScrimVersusGlass.tsx",children:e.jsx(F,{})}),e.jsx(o,{title:"Every tone",description:"All 21 true colours on the same sm loader.",code:J,filename:"EveryTone.tsx",children:e.jsx(q,{})})]})]});export{ne as LoaderPage,ne as default};
