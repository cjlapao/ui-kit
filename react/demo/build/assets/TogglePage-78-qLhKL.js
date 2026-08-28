import{r as s,j as e,T as l,M as n,m as M}from"./index-Bw7SVFgV.js";import{P as I}from"./PageHeader-CQm-NnZo.js";import{E as o}from"./ExampleCard-BR4461qP.js";import{P,S as C,C as i,T as r}from"./PlaygroundPanel-efOYSasM.js";import{C as B}from"./ControlAccordion-BDKCdIsF.js";import{w as R,n as W,t as F,k as _,l as q,j as H}from"./options-CREM8uYu.js";const U=[{label:"Left",value:"left"},{label:"Right",value:"right"}],J=[{label:"Stacked",value:"stacked"},{label:"Inline",value:"inline"}],K=()=>{const[a,w]=s.useState("solid"),[u,S]=s.useState("md"),[f,T]=s.useState("left"),[g,y]=s.useState("stacked"),[h,O]=s.useState("blue"),[c,z]=s.useState(!0),[m,N]=s.useState(!0),[d,L]=s.useState(!1),[x,E]=s.useState(!1),[b,D]=s.useState(!1),[p,A]=s.useState("medium"),[j,V]=s.useState("frosted"),[v,G]=s.useState("none"),k={variant:a,size:u,color:h,alignLabel:f,descriptionPlacement:g,fullWidth:x,vibrancy:p,glassOpacity:j,specularMode:v,iconOn:d?"Sun":void 0,iconOff:d?"Moon":void 0,disabled:b};return e.jsx(P,{controls:e.jsx(B,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(C,{label:"Variant",options:R,value:a,onChange:t=>w(t)}),e.jsx(i,{label:"Size",children:e.jsx(n,{fullWidth:!0,size:"sm",options:W,value:u,onChange:t=>S(t)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(i,{label:"Label alignment",children:e.jsx(n,{fullWidth:!0,size:"sm",options:U,value:f,onChange:t=>T(t)})}),e.jsx(i,{label:"Description",children:e.jsx(n,{fullWidth:!0,size:"sm",options:J,value:g,onChange:t=>y(t)})})]}),e.jsx(C,{label:"Color",options:F,value:h,onChange:t=>O(t)})]})},...a==="glass"?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{label:"Vibrancy",children:e.jsx(n,{fullWidth:!0,size:"sm",options:_,value:p,onChange:t=>A(t)})}),e.jsx(i,{label:"Fill",children:e.jsx(n,{fullWidth:!0,size:"sm",options:q,value:j,onChange:t=>V(t)})}),e.jsx(i,{label:"Specular",children:e.jsx(n,{fullWidth:!0,size:"sm",options:H,value:v,onChange:t=>G(t)})})]})}]:[],{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Label",checked:c,onChange:z}),e.jsx(r,{label:"Description",checked:m,onChange:N}),e.jsx(r,{label:"Icons",checked:d,onChange:L}),e.jsx(r,{label:"Full width",checked:x,onChange:E}),e.jsx(r,{label:"Disabled",checked:b,onChange:D})]})}]}),preview:e.jsx("div",{className:"w-full",children:e.jsxs("div",{className:"flex flex-col gap-4 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:[e.jsx(l,{...k,label:c?"Two-factor authentication":void 0,description:m?"Require a code from your phone to sign in.":void 0,defaultChecked:!0}),e.jsx(l,{...k,label:c?"Marketing emails":void 0})]})})})};function Q(){return e.jsx(l,{color:"blue",label:"Enable notifications",defaultChecked:!0})}const X=`import { Toggle } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <Toggle color="blue" label="Enable notifications" defaultChecked />
  );
}
`,Y={solid:"Solid",soft:"Soft",outline:"Outline",ghost:"Ghost",glass:"Glass"},Z="flex items-center justify-between gap-6 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";function $(){return e.jsx("div",{className:"grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2",children:M.map(a=>e.jsxs("div",{className:Z,children:[e.jsx("span",{className:"text-sm font-medium text-neutral-900 dark:text-neutral-100",children:Y[a]??a}),e.jsxs("span",{className:"flex items-center gap-4",children:[e.jsx(l,{variant:a}),e.jsx(l,{variant:a,defaultChecked:!0})]})]},a))})}const ee=`import { TOGGLE_VARIANTS, Toggle } from "@cjlapao/ui-kit";

const LABELS: Record<string, string> = {
  solid: "Solid",
  soft: "Soft",
  outline: "Outline",
  ghost: "Ghost",
  glass: "Glass",
};

// The gradient stands in for real page content, so the translucent
// treatments (ghost, glass) read the way they will in the wild.
const rowClass =
  "flex items-center justify-between gap-6 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function Variants() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {TOGGLE_VARIANTS.map((variant) => (
        <div key={variant} className={rowClass}>
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {LABELS[variant] ?? variant}
          </span>
          <span className="flex items-center gap-4">
            <Toggle variant={variant} />
            <Toggle variant={variant} defaultChecked />
          </span>
        </div>
      ))}
    </div>
  );
}
`;function le(){return e.jsxs("div",{className:"flex w-full max-w-xs flex-col items-start gap-3",children:[e.jsx(l,{iconOn:"Sun",iconOff:"Moon",defaultChecked:!0,label:"Light mode"}),e.jsx(l,{iconOn:"Sun",iconOff:"Moon",label:"Dark mode"})]})}const te=`import { Toggle } from "@cjlapao/ui-kit";

export default function Icons() {
  return (
    <div className="flex w-full max-w-xs flex-col items-start gap-3">
      <Toggle iconOn="Sun" iconOff="Moon" defaultChecked label="Light mode" />
      <Toggle iconOn="Sun" iconOff="Moon" label="Dark mode" />
    </div>
  );
}
`;function se(){return e.jsxs("div",{className:"flex w-full max-w-xs flex-col gap-4",children:[e.jsx(l,{color:"blue",label:"Receive email digests",description:"A summary of activity, once a day.",defaultChecked:!0}),e.jsx(l,{color:"emerald",label:"Compact view",description:"Fit more rows on screen.",descriptionPlacement:"inline"})]})}const ae=`import { Toggle } from "@cjlapao/ui-kit";

export default function Labeled() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Toggle
        color="blue"
        label="Receive email digests"
        description="A summary of activity, once a day."
        defaultChecked
      />
      <Toggle
        color="emerald"
        label="Compact view"
        description="Fit more rows on screen."
        descriptionPlacement="inline"
      />
    </div>
  );
}
`;function ne(){return e.jsxs("div",{className:"flex flex-col items-start gap-3",children:[e.jsx(l,{size:"xs",color:"blue",label:"Extra small",defaultChecked:!0}),e.jsx(l,{size:"sm",color:"blue",label:"Small",defaultChecked:!0}),e.jsx(l,{size:"md",color:"blue",label:"Medium",defaultChecked:!0}),e.jsx(l,{size:"lg",color:"blue",label:"Large",defaultChecked:!0}),e.jsx(l,{size:"xl",color:"blue",label:"Extra large",defaultChecked:!0})]})}const oe=`import { Toggle } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle size="xs" color="blue" label="Extra small" defaultChecked />
      <Toggle size="sm" color="blue" label="Small" defaultChecked />
      <Toggle size="md" color="blue" label="Medium" defaultChecked />
      <Toggle size="lg" color="blue" label="Large" defaultChecked />
      <Toggle size="xl" color="blue" label="Extra large" defaultChecked />
    </div>
  );
}
`;function ie(){return e.jsxs("div",{className:"flex flex-col items-start gap-3",children:[e.jsx(l,{color:"blue",label:"Enabled",defaultChecked:!0}),e.jsx(l,{color:"blue",label:"Disabled on",defaultChecked:!0,disabled:!0}),e.jsx(l,{color:"blue",label:"Disabled off",disabled:!0})]})}const re=`import { Toggle } from "@cjlapao/ui-kit";

export default function Disabled() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle color="blue" label="Enabled" defaultChecked />
      <Toggle color="blue" label="Disabled on" defaultChecked disabled />
      <Toggle color="blue" label="Disabled off" disabled />
    </div>
  );
}
`,me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(I,{name:"Toggle",description:"A switch for a single on/off setting. Five treatments from Button's vocabulary — solid, soft, outline, ghost and glass — labels and descriptions live with the control, and the whole row is the click target. Works uncontrolled out of the box."}),e.jsx(K,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Basic",description:"Uncontrolled: defaultChecked seeds the state and the control toggles on its own.",code:X,filename:"Basic.tsx",children:e.jsx(Q,{})}),e.jsx(o,{title:"Variants",description:"The five `variant` treatments from `Button`'s vocabulary — each row shows the off and the on state. The off-state track is neutral in every variant; the on-state fill carries the treatment. `color` takes any of the 21 palette tones.",code:ee,filename:"Variants.tsx",children:e.jsx($,{})}),e.jsx(o,{title:"Icons",description:"`iconOn` and `iconOff` each live in the half of the track the thumb is not in — `iconOn` on the left (visible while checked), `iconOff` on the right (visible while unchecked) — centered in that half with breathing room to both the thumb and the wall, scaled to the toggle's size, and cross-fading with the thumb.",code:te,filename:"Icons.tsx",children:e.jsx(le,{})}),e.jsx(o,{title:"Labeled",description:"A label plus a description, stacked under the label or inline beside it.",code:ae,filename:"Labeled.tsx",children:e.jsx(se,{})}),e.jsx(o,{title:"Sizes",description:"Five sizes — the shared control scale every input, button and search bar offers — from dense settings lists to onboarding screens. The thumb always travels the full track, landing flush against the far wall.",code:oe,filename:"Sizes.tsx",children:e.jsx(ne,{})}),e.jsx(o,{title:"Disabled",description:"Both disabled states stay legible — the position, not the fill, carries the meaning.",code:re,filename:"Disabled.tsx",children:e.jsx(ie,{})})]})]});export{me as TogglePage,me as default};
