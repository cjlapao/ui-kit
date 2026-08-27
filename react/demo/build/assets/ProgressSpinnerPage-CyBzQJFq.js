import{r as t,j as e,bK as n,M as d,b4 as k}from"./index-BBK6HA-D.js";import{P as z}from"./PageHeader-BcBcU29I.js";import{E as i}from"./ExampleCard-BVwGIEPO.js";import{P as C,C as N,a as m,S as h,T as u}from"./ControlAccordion-DallGojj.js";import{n as P,bb as T,t as L}from"./options-D-FMIizr.js";const D=[{label:"Indeterminate",value:"indeterminate"},{label:"Determinate",value:"determinate"}],y=[0,25,50,62,75,100].map(a=>({label:`${a}%`,value:String(a)})),E=()=>{const[a,g]=t.useState("indeterminate"),[r,f]=t.useState("xl"),[o,S]=t.useState("normal"),[l,v]=t.useState("blue"),[x,w]=t.useState(62),[p,j]=t.useState(!0),[c,b]=t.useState(!1);return e.jsx(C,{controls:e.jsx(N,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Mode",children:e.jsx(d,{fullWidth:!0,size:"sm",options:D,value:a,onChange:s=>g(s)})}),e.jsx(m,{label:"Size",children:e.jsx(d,{fullWidth:!0,size:"sm",options:P,value:r,onChange:s=>f(s)})}),e.jsx(m,{label:"Thickness",children:e.jsx(d,{fullWidth:!0,size:"sm",options:T,value:o,onChange:s=>S(s)})}),e.jsx(h,{label:"Color",options:L,value:l,onChange:s=>v(s)}),e.jsx(h,{label:"Value",options:y,value:String(x),onChange:s=>w(Number(s))})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Show value",checked:p,onChange:j}),e.jsx(u,{label:"Slow tempo",checked:c,onChange:b})]})}]}),preview:a==="determinate"?e.jsx(n,{value:x,size:r,thickness:o,color:l,showValue:p,animationDuration:c?"4s":"2s",ariaLabel:"Demo progress"}):e.jsx(n,{size:r,thickness:o,color:l,animationDuration:c?"4s":"2s",ariaLabel:"Demo progress"})})},I=()=>e.jsxs("div",{className:"flex flex-wrap items-center gap-4",children:[e.jsx(n,{}),e.jsx(n,{color:"emerald",ariaLabel:"Syncing"}),e.jsx(n,{color:"violet",size:"lg",ariaLabel:"Processing"}),e.jsx(n,{color:"amber",size:"xl",thickness:"thick",ariaLabel:"Uploading"})]}),O=`import { ProgressSpinner } from "@cjlapao/ui-kit";

export const Indeterminate = () => (
  <div className="flex flex-wrap items-center gap-4">
    <ProgressSpinner />
    <ProgressSpinner color="emerald" ariaLabel="Syncing" />
    <ProgressSpinner color="violet" size="lg" ariaLabel="Processing" />
    <ProgressSpinner
      color="amber"
      size="xl"
      thickness="thick"
      ariaLabel="Uploading"
    />
  </div>
);

export default Indeterminate;
`,V=()=>e.jsxs("div",{className:"flex flex-wrap items-center gap-4",children:[e.jsx(n,{value:25,size:"lg",ariaLabel:"Downloading"}),e.jsx(n,{value:50,size:"lg",color:"emerald",ariaLabel:"Downloading"}),e.jsx(n,{value:75,size:"lg",color:"violet",ariaLabel:"Downloading"}),e.jsx(n,{value:100,size:"lg",color:"amber",ariaLabel:"Downloading"})]}),W=`import { ProgressSpinner } from "@cjlapao/ui-kit";

export const Determinate = () => (
  <div className="flex flex-wrap items-center gap-4">
    <ProgressSpinner value={25} size="lg" ariaLabel="Downloading" />
    <ProgressSpinner value={50} size="lg" color="emerald" ariaLabel="Downloading" />
    <ProgressSpinner value={75} size="lg" color="violet" ariaLabel="Downloading" />
    <ProgressSpinner value={100} size="lg" color="amber" ariaLabel="Downloading" />
  </div>
);

export default Determinate;
`,A=["xs","sm","md","lg","xl"],Z=()=>e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:A.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(n,{value:62,size:a,ariaLabel:`Size ${a}`}),e.jsx("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:a})]},a))}),$=`import { ProgressSpinner } from "@cjlapao/ui-kit";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const Sizes = () => (
  <div className="flex flex-wrap items-end gap-4">
    {SIZES.map((size) => (
      <div key={size} className="flex flex-col items-center gap-2">
        <ProgressSpinner value={62} size={size} ariaLabel={\`Size \${size}\`} />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{size}</span>
      </div>
    ))}
  </div>
);

export default Sizes;
`,M=["blue","emerald","amber","rose","violet","cyan","orange"],F=()=>e.jsx("div",{className:"flex flex-wrap items-center gap-4",children:M.map(a=>e.jsx(n,{color:a,size:"lg",ariaLabel:`Tone ${a}`},a))}),K=`import { ProgressSpinner } from "@cjlapao/ui-kit";

const TONES = [
  "blue",
  "emerald",
  "amber",
  "rose",
  "violet",
  "cyan",
  "orange",
] as const;

export const Tones = () => (
  <div className="flex flex-wrap items-center gap-4">
    {TONES.map((color) => (
      <ProgressSpinner key={color} color={color} size="lg" ariaLabel={\`Tone \${color}\`} />
    ))}
  </div>
);

export default Tones;
`,R=()=>e.jsxs("div",{className:"flex flex-wrap items-center gap-4",children:[e.jsx(n,{value:20,min:0,max:80,size:"lg",ariaLabel:"Custom range"}),e.jsx(n,{value:62,size:"lg",showValue:!1,thickness:"thin",animationDuration:"600ms",ariaLabel:"Quiet"}),e.jsx(n,{size:"lg",color:"emerald",thickness:"thick",animationDuration:"4s",ariaLabel:"Slow"})]}),B=`import { ProgressSpinner } from "@cjlapao/ui-kit";

export const Custom = () => (
  <div className="flex flex-wrap items-center gap-4">
    {/* A custom range: 20 of 80 units is 25%. */}
    <ProgressSpinner value={20} min={0} max={80} size="lg" ariaLabel="Custom range" />
    {/* No centre readout, a quick tempo, a thin ring. */}
    <ProgressSpinner
      value={62}
      size="lg"
      showValue={false}
      thickness="thin"
      animationDuration="600ms"
      ariaLabel="Quiet"
    />
    {/* The tempo prop also sets the indeterminate speed. */}
    <ProgressSpinner
      size="lg"
      color="emerald"
      thickness="thick"
      animationDuration="4s"
      ariaLabel="Slow"
    />
  </div>
);

export default Custom;
`,G=()=>e.jsx(k,{gradient:!0,tone:"emerald",size:"xl",corner:"rounded-xl",progress:!0,className:"min-h-80 w-full max-w-xs",label:"Game completed",value:e.jsxs(e.Fragment,{children:["100",e.jsx("span",{className:"text-2xl align-baseline",children:"%"})]}),children:e.jsxs("div",{className:"text-sm",children:[e.jsxs("div",{className:"truncate text-white/90",children:["The legend of ",e.jsx("span",{className:"font-semibold",children:"Zelda"})]}),e.jsx("div",{className:"text-white/60",children:"Tears of the Kingdom"})]})}),Q=`import { StatCard } from "@cjlapao/ui-kit";

export const WithStatCard = () => (
  // The PrimeVue showcase, straight from the kit: the dark \`gradient\` wash,
  // white copy, and a bottom-right \`progress\` spinner tinted by the tone.
  <StatCard
    gradient
    tone="emerald"
    size="xl"
    corner="rounded-xl"
    progress
    className="min-h-80 w-full max-w-xs"
    label="Game completed"
    value={
      <>
        100<span className="text-2xl align-baseline">%</span>
      </>
    }
  >
    <div className="text-sm">
      <div className="truncate text-white/90">
        The legend of <span className="font-semibold">Zelda</span>
      </div>
      <div className="text-white/60">Tears of the Kingdom</div>
    </div>
  </StatCard>
);

export default WithStatCard;
`,Y=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(z,{name:"Progress Spinner",description:"A circular process status indicator — an animated ring when the work has no measurable end, a filled arc with a centre readout when it does. One component, two ARIA modes, on the shared control scale."}),e.jsx(E,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Indeterminate",description:'Omit `value` for the classic chasing-arc animation. The ring reads as a status region announcing its `ariaLabel` (default "Loading"); the whole tempo is one prop — `animationDuration`.',code:O,filename:"Indeterminate.tsx",children:e.jsx(I,{})}),e.jsx(i,{title:"Determinate",description:"Pass a `value` and the ring becomes a filled arc with a centre percentage readout, announced through `aria-valuenow` and friends. The arc animates smoothly between values; `showValue={false}` hides the readout.",code:W,filename:"Determinate.tsx",children:e.jsx(V,{})}),e.jsx(i,{title:"Sizes",description:'The shared control scale — `xs` through `xl` — so a spinner lines up with the Button or Spinner next to it at every size. The stroke weight is kept in physical px, not viewBox units, so "normal" is the same thickness everywhere.',code:$,filename:"Sizes.tsx",children:e.jsx(Z,{})}),e.jsx(i,{title:"Tones",description:"Any of the 21 kit tones. The arc reads the tone's own CSS variable and the idle track is derived from it with `color-mix`, so a tone can never render as another colour.",code:K,filename:"Tones.tsx",children:e.jsx(F,{})}),e.jsx(i,{title:"Custom",description:"`min`/`max` for a range that is not 0-100, `thickness` for the ring weight, `animationDuration` for the tempo, and `showValue` for the readout.",code:B,filename:"Custom.tsx",children:e.jsx(R,{})}),e.jsx(i,{title:"With Stat Card",description:"The PrimeVue showcase, straight from the kit: a dark emerald `gradient` `StatCard` with a big white 100% value, and `progress` pinning a same-tone indeterminate spinner to the bottom-right corner — the title row rides its free-form slot on the same row. The dark wash is what lets the light arc read.",code:Q,filename:"WithStatCard.tsx",children:e.jsx(G,{})})]})]});export{Y as ProgressSpinnerPage,Y as default};
