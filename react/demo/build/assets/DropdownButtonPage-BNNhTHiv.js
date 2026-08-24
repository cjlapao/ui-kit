import{r as a,j as e,v as l,M as m,w as B,n as C,k as P}from"./index-B-ieYLXc.js";import{P as E,S as h,C as y,T as c,a as I,E as s}from"./PlaygroundPanel-CkWfNJii.js";import{q as z,n as V,t as U,B as R}from"./options-C8y5quvx.js";const A=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),L=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"},{label:"Advanced…",value:"advanced",description:"Pick a specific version or channel"}],_=()=>{const[n,v]=a.useState("solid"),[p,f]=a.useState("md"),[d,w]=a.useState("blue"),[i,S]=a.useState("trigger"),[u,j]=a.useState(!0),[x,O]=a.useState(!1),[g,N]=a.useState(!1),[o,D]=a.useState(0),[r,T]=a.useState(""),k=o>0||r?[o>0?`primary: ${o}`:null,r?`selected: ${r}`:null].filter(Boolean).join(" · "):"— nothing yet —";return e.jsx(E,{controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Variant",options:z,value:n,onChange:t=>v(t)}),e.jsx(y,{label:"Size",children:e.jsx(m,{fullWidth:!0,size:"sm",options:V,value:p,onChange:t=>f(t)})}),e.jsx(h,{label:"Tone",options:U,value:d,onChange:t=>w(t)}),e.jsx(y,{label:"Menu width",children:e.jsx(m,{fullWidth:!0,size:"sm",options:R,value:i,onChange:t=>S(t)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"Split trigger",checked:u,onChange:j}),e.jsx(c,{label:"Full width",checked:x,onChange:O}),e.jsx(c,{label:"Disabled",checked:g,onChange:N})]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Split trigger"})," gives the caret its own button width; without it the caret collapses into a compact trigger. An empty menu hides the caret entirely, so the control renders as a plain button."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:"rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900",children:e.jsx(l,{label:"Deploy",options:L,variant:n,color:d,size:p,disabled:g,fullWidth:x,split:u,menuWidth:i==="trigger"?"trigger":Number(i),onPrimaryClick:()=>D(t=>t+1),onOptionSelect:t=>T(t.value)})}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(A,{children:"What happened"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:k})]})]})})},W=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"},{label:"Advanced…",value:"advanced",description:"Pick a specific version or channel"}],M=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:B.map(n=>e.jsx(l,{label:n,options:W,variant:n},n))}),$=`import { BUTTON_VARIANTS, DropdownButton } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
  {
    label: "Advanced…",
    value: "advanced",
    description: "Pick a specific version or channel",
  },
];

const EveryVariant = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2">
    {BUTTON_VARIANTS.map((variant) => (
      <DropdownButton
        key={variant}
        label={variant}
        options={OPTIONS}
        variant={variant}
      />
    ))}
  </div>
);

export default EveryVariant;
`,F=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"}],Z=()=>e.jsx("div",{className:"flex w-full flex-wrap items-center gap-3",children:C.map(n=>e.jsx(l,{label:n,options:F,variant:"solid",size:n},n))}),q=`import { CONTROL_SIZES, DropdownButton } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
];

const SizeLadder = () => (
  <div className="flex w-full flex-wrap items-center gap-3">
    {CONTROL_SIZES.map((size) => (
      <DropdownButton
        key={size}
        label={size}
        options={OPTIONS}
        variant="solid"
        size={size}
      />
    ))}
  </div>
);

export default SizeLadder;
`,H=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"}],Y=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:P.map(n=>e.jsx(l,{label:n,options:H,variant:"solid",color:n},n))}),G=`import { DropdownButton, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
];

const EveryTone = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {TRUE_COLORS.map((color) => (
      <DropdownButton
        key={color}
        label={color}
        options={OPTIONS}
        variant="solid"
        color={color}
      />
    ))}
  </div>
);

export default EveryTone;
`,b=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"}],J=()=>e.jsxs("div",{className:"flex w-full max-w-xs flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"Split (default)"}),e.jsx(l,{label:"Deploy",options:b})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"Single trigger"}),e.jsx(l,{label:"Deploy",options:b,split:!1})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"Empty menu"}),e.jsx(l,{label:"Deploy",options:[]})]})]}),K=`import { DropdownButton } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
];

const SplitVersusSingle = () => (
  <div className="flex w-full max-w-xs flex-col gap-5">
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Split (default)
      </span>
      <DropdownButton label="Deploy" options={OPTIONS} />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Single trigger
      </span>
      <DropdownButton label="Deploy" options={OPTIONS} split={false} />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Empty menu
      </span>
      <DropdownButton label="Deploy" options={[]} />
    </div>
  </div>
);

export default SplitVersusSingle;
`,ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(I,{name:"Dropdown Button",description:"A Button with an optional caret trigger that opens a menu. The trigger keeps the full Button language — variant, size and tone — while the menu takes its positioning from DropdownMenu, and an empty menu hides the caret entirely."}),e.jsx(_,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(s,{title:"Every variant",description:"All button variants at one tone and size, each with a working menu.",code:$,filename:"EveryVariant.tsx",children:e.jsx(M,{})}),e.jsx(s,{title:"Size ladder",description:"The shared control scale, solid blue.",code:q,filename:"SizeLadder.tsx",children:e.jsx(Z,{})}),e.jsx(s,{title:"Every tone",description:"All 21 true colours, solid at one size.",code:G,filename:"EveryTone.tsx",children:e.jsx(Y,{})}),e.jsx(s,{title:"Split versus single",description:"The default split trigger, the collapsed single trigger, and an empty menu that hides the caret.",code:K,filename:"SplitVersusSingle.tsx",children:e.jsx(J,{})})]})]});export{ne as DropdownButtonPage,ne as default};
