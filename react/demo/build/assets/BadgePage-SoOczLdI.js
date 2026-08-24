import{r as s,j as e,P as E,d as a,M as h,aB as v,k as R,i as j}from"./index-BqiwG-pR.js";import{P as T,S as A,C as c,T as o,a as I,E as l}from"./PlaygroundPanel-DuiPtEP5.js";import{t as L}from"./options-CD99P1yv.js";const P=[{label:"Xs",value:"xs"},{label:"Sm",value:"sm"},{label:"Md",value:"md"},{label:"Lg",value:"lg"},{label:"Xl",value:"xl"}],D=v.map(n=>({label:n.charAt(0).toUpperCase()+n.slice(1),value:n})),V=()=>{const[n,N]=s.useState("rose"),[u,b]=s.useState("solid"),[p,B]=s.useState("sm"),[i,w]=s.useState(7),[d,y]=s.useState(99),[r,C]=s.useState(!1),[m,S]=s.useState(!0),[g,k]=s.useState(!1),[f,O]=s.useState(!1),[x,z]=s.useState(!1);return e.jsx(T,{controls:e.jsxs(e.Fragment,{children:[e.jsx(A,{label:"Tone",options:L,value:n,onChange:t=>N(t)}),e.jsx(c,{label:"Variant",children:e.jsx(h,{fullWidth:!0,size:"sm",options:D,value:u,onChange:t=>b(t)})}),e.jsx(c,{label:"Size",children:e.jsx(h,{fullWidth:!0,size:"sm",options:P,value:p,onChange:t=>B(t)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(c,{label:`Count — ${i}`,children:e.jsx("input",{type:"range",min:0,max:250,value:i,onChange:t=>w(Number(t.target.value)),className:"w-full accent-blue-500","aria-label":"Badge count"})}),e.jsx(c,{label:`Max count — ${d}`,children:e.jsx("input",{type:"range",min:5,max:999,value:d,onChange:t=>y(Number(t.target.value)),className:"w-full accent-blue-500","aria-label":"Badge max count"})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Dot only",checked:r,onChange:C}),e.jsx(o,{label:"Show zero",checked:f,onChange:O}),e.jsx(o,{label:"Ring",checked:m,onChange:S}),e.jsx(o,{label:"Pulse",checked:g,onChange:k}),e.jsx(o,{label:"On a glass panel",checked:x,onChange:z})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Drop the count to ",e.jsx("strong",{children:"0"})," — the badge disappears unless"," ",e.jsx("strong",{children:"Show zero"})," is on. A count badge is announced by screen readers; a bare dot is treated as decoration unless you give it a ",e.jsx("code",{children:"label"}),"."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(E,{variant:x?"liquid-glass":"outlined",tone:x?n:"neutral",padding:"md",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{count:r?void 0:i,dot:r,tone:n,variant:u,size:p,maxCount:d,showZero:f,ring:m,pulse:g}),e.jsx("span",{className:"text-xs opacity-60",children:r?"dot":`count ${i}`})]})})})})};function M(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(a,{count:1}),e.jsx(a,{count:7}),e.jsx(a,{count:23,tone:"amber"}),e.jsx(a,{count:150,tone:"rose"}),e.jsx(a,{count:0,showZero:!0,tone:"emerald"})]})}const Z=`import { Badge } from "@cjlapao/ui-kit";

export default function Counts() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge count={1} />
      <Badge count={7} />
      <Badge count={23} tone="amber" />
      <Badge count={150} tone="rose" />
      <Badge count={0} showZero tone="emerald" />
    </div>
  );
}
`;function _(){return e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("span",{className:"flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300",children:[e.jsx(a,{dot:!0,tone:"emerald","aria-label":"Online"}),"Online"]}),e.jsxs("span",{className:"flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300",children:[e.jsx(a,{dot:!0,tone:"amber","aria-label":"Away"}),"Away"]}),e.jsxs("span",{className:"flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300",children:[e.jsx(a,{dot:!0,tone:"rose","aria-label":"Busy"}),"Busy"]})]})}const G=`import { Badge } from "@cjlapao/ui-kit";

export default function Dots() {
  return (
    <div className="flex items-center gap-6">
      <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <Badge dot tone="emerald" aria-label="Online" />
        Online
      </span>
      <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <Badge dot tone="amber" aria-label="Away" />
        Away
      </span>
      <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <Badge dot tone="rose" aria-label="Busy" />
        Busy
      </span>
    </div>
  );
}
`;function U(){return e.jsx("div",{className:"flex flex-wrap items-center gap-4",children:v.map(n=>e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(a,{variant:n,tone:"rose",count:7}),e.jsx("span",{className:"text-xs opacity-60",children:n})]},n))})}const $=`import { Badge, BADGE_VARIANTS } from "@cjlapao/ui-kit";

export default function EveryVariant() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {BADGE_VARIANTS.map((each) => (
        <span key={each} className="flex items-center gap-1.5">
          <Badge variant={each} tone="rose" count={7} />
          <span className="text-xs opacity-60">{each}</span>
        </span>
      ))}
    </div>
  );
}
`;function W(){return e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:R.map(n=>e.jsx(a,{tone:n,count:7},n))})}const X=`import { Badge, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TRUE_COLORS.map((each) => (
        <Badge key={each} tone={each} count={7} />
      ))}
    </div>
  );
}
`,q=["xs","sm","md","lg","xl"];function F(){return e.jsx("div",{className:"flex flex-wrap items-center gap-6",children:q.map(n=>e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(a,{size:n,tone:"rose",count:7}),e.jsx(a,{size:n,tone:"rose",dot:!0}),e.jsx("span",{className:"text-xs opacity-60",children:n})]},n))})}const H=`import { Badge } from "@cjlapao/ui-kit";
import type { BadgeSize } from "@cjlapao/ui-kit";

const SIZES: BadgeSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function SizeLadder() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {SIZES.map((each) => (
        <span key={each} className="flex items-center gap-1.5">
          <Badge size={each} tone="rose" count={7} />
          <Badge size={each} tone="rose" dot />
          <span className="text-xs opacity-60">{each}</span>
        </span>
      ))}
    </div>
  );
}
`;function J(){return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("div",{className:"flex flex-wrap items-center gap-3",children:[1,98,99,100,2e3].map(n=>e.jsx(a,{count:n,maxCount:99,tone:"rose"},n))}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{count:"new",tone:"emerald"}),e.jsx("span",{className:"text-xs opacity-60",children:"a non-numeric value is left alone"})]})]})}const K=`import { Badge } from "@cjlapao/ui-kit";

export default function Overflow() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {[1, 98, 99, 100, 2000].map((n) => (
          <Badge key={n} count={n} maxCount={99} tone="rose" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Badge count="new" tone="emerald" />
        <span className="text-xs opacity-60">
          a non-numeric value is left alone
        </span>
      </div>
    </div>
  );
}
`;function Q(){return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("span",{className:"relative inline-flex",children:[e.jsx(j,{icon:"Notification",variant:"soft",color:"blue",srLabel:"Notifications"}),e.jsx(a,{count:4,size:"xs",tone:"rose",className:"absolute -right-1.5 -top-1.5"})]}),e.jsxs("span",{className:"relative inline-flex",children:[e.jsx(j,{icon:"Chat",variant:"soft",color:"blue",srLabel:"Messages"}),e.jsx(a,{dot:!0,size:"sm",tone:"emerald",className:"absolute right-0 top-0"})]})]})}const Y=`import { Badge, IconButton } from "@cjlapao/ui-kit";

export default function OnIconButtons() {
  return (
    <div className="flex items-center gap-4">
      <span className="relative inline-flex">
        <IconButton icon="Notification" variant="soft" color="blue" srLabel="Notifications" />
        <Badge
          count={4}
          size="xs"
          tone="rose"
          className="absolute -right-1.5 -top-1.5"
        />
      </span>
      <span className="relative inline-flex">
        <IconButton icon="Chat" variant="soft" color="blue" srLabel="Messages" />
        <Badge dot size="sm" tone="emerald" className="absolute right-0 top-0" />
      </span>
    </div>
  );
}
`;function ee(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-8",children:[e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"relative inline-flex",children:[e.jsx("span",{className:"h-9 w-9 rounded-lg bg-blue-500"}),e.jsx("span",{className:"absolute -right-1.5 -top-1.5",children:e.jsx(a,{ring:!0,count:7,tone:"rose"})})]}),e.jsx("span",{className:"text-xs opacity-60",children:"Ring on"})]}),e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"relative inline-flex",children:[e.jsx("span",{className:"h-9 w-9 rounded-lg bg-blue-500"}),e.jsx("span",{className:"absolute -right-1.5 -top-1.5",children:e.jsx(a,{ring:!1,count:7,tone:"rose"})})]}),e.jsx("span",{className:"text-xs opacity-60",children:"Ring off"})]})]})}const ne=`import { Badge } from "@cjlapao/ui-kit";

export default function RingOverlap() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <span className="flex items-center gap-2">
        <span className="relative inline-flex">
          <span className="h-9 w-9 rounded-lg bg-blue-500" />
          <span className="absolute -right-1.5 -top-1.5">
            <Badge ring count={7} tone="rose" />
          </span>
        </span>
        <span className="text-xs opacity-60">Ring on</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="relative inline-flex">
          <span className="h-9 w-9 rounded-lg bg-blue-500" />
          <span className="absolute -right-1.5 -top-1.5">
            <Badge ring={false} count={7} tone="rose" />
          </span>
        </span>
        <span className="text-xs opacity-60">Ring off</span>
      </span>
    </div>
  );
}
`,le=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(I,{name:"Badge",description:"Counts and status indicators. Three variants, the full tone set, five sizes, a ring that keeps it legible where it overlaps something, and a pulse for attention."}),e.jsx(V,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Counts",description:"Plain counts with maxCount overflow and an opt-in zero state.",code:Z,filename:"Counts.tsx",children:e.jsx(M,{})}),e.jsx(l,{title:"Dots",description:"State without a number — the dot is decorative unless given a label.",code:G,filename:"Dots.tsx",children:e.jsx(_,{})}),e.jsx(l,{title:"Every variant",description:"Solid, soft and outline at one tone and size.",code:$,filename:"EveryVariant.tsx",children:e.jsx(U,{})}),e.jsx(l,{title:"Every tone",description:"All 21 true colours, solid at sm.",code:X,filename:"EveryTone.tsx",children:e.jsx(W,{})}),e.jsx(l,{title:"Size ladder",description:"The shared xs–xl scale, count and dot at each step.",code:H,filename:"SizeLadder.tsx",children:e.jsx(F,{})}),e.jsx(l,{title:"Overflow",description:"maxCount collapses to “99+”, and a non-numeric value passes straight through.",code:K,filename:"Overflow.tsx",children:e.jsx(J,{})}),e.jsx(l,{title:"On icon buttons",description:"The notification pattern: a corner count, and a status dot, anchored to the control.",code:Y,filename:"OnIconButtons.tsx",children:e.jsx(Q,{})}),e.jsx(l,{title:"Ring overlap",description:"The ring is painted in the page background colour, so the badge stays legible where it overlaps something.",code:ne,filename:"RingOverlap.tsx",children:e.jsx(ee,{})})]})]});export{le as BadgePage,le as default};
