import{r as i,j as e,P as T,M as a,i as t}from"./index-Bw7SVFgV.js";import{P as O}from"./PageHeader-CQm-NnZo.js";import{E as l}from"./ExampleCard-BR4461qP.js";import{P,C as o,S as D,T as d}from"./PlaygroundPanel-efOYSasM.js";import{C as I}from"./ControlAccordion-BDKCdIsF.js";import{o as y,n as L,q as R,t as E}from"./options-CREM8uYu.js";const V=[{label:"Vertical",value:"vertical"},{label:"Horizontal",value:"horizontal"}],H=[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"}],W=()=>{const[n,g]=i.useState("vertical"),[c,j]=i.useState("solid"),[p,b]=i.useState(!1),[x,S]=i.useState("blue"),[u,N]=i.useState("xs"),[m,k]=i.useState("sm"),[h,w]=i.useState(!1),[f,A]=i.useState("center"),[v,C]=i.useState(!1),r=e.jsx(t,{orientation:n,variant:c,tone:p?x:void 0,size:u,spacing:m,label:h?"OR":void 0,labelPosition:f}),z=n==="vertical"?e.jsxs("div",{className:"flex h-16 items-center",children:[e.jsx("span",{children:"Item 1"}),r,e.jsx("span",{children:"Item 2"}),r,e.jsx("span",{children:"Item 3"})]}):e.jsxs("div",{className:"w-full",children:[e.jsx("p",{children:"Sign in with your work account."}),r,e.jsx("p",{children:"Continue with a single-use link instead."})]});return e.jsx(P,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(I,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Orientation",children:e.jsx(a,{fullWidth:!0,size:"sm",options:V,value:n,onChange:s=>g(s)})}),e.jsx(o,{label:"Variant",children:e.jsx(a,{fullWidth:!0,size:"sm",options:y,value:c,onChange:s=>j(s)})}),e.jsx(o,{label:"Thickness",children:e.jsx(a,{fullWidth:!0,size:"sm",options:L,value:u,onChange:s=>N(s)})}),e.jsx(o,{label:"Spacing",children:e.jsx(a,{fullWidth:!0,size:"sm",options:R,value:m,onChange:s=>k(s)})}),e.jsx(D,{label:"Tone",options:E,value:x,onChange:s=>S(s)})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Label position",children:e.jsx(a,{fullWidth:!0,size:"sm",options:H,value:f,onChange:s=>A(s)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(d,{label:"Use tone",checked:p,onChange:b}),e.jsx(d,{label:"Label",checked:h,onChange:w}),e.jsx(d,{label:"On a glass panel",checked:v,onChange:C})]})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("strong",{children:"Use tone"})," off, the rule reads the surrounding surface's divider colour — switch ",e.jsx("strong",{children:"On a glass panel"})," ","on to see it adapt. A labelled divider is announced as a"," ",e.jsx("code",{children:"separator"}),"; an unlabelled one is decoration and hidden from assistive tech."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(T,{variant:v?"liquid-glass":"outlined",tone:"neutral",padding:"md",children:z})})})})};function B(){return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsxs("div",{className:"flex h-16 items-center justify-between",children:[e.jsx("span",{className:"font-medium",children:"Home"}),e.jsx(t,{orientation:"vertical",size:"sm"}),e.jsx("span",{className:"font-medium",children:"Reports"}),e.jsx(t,{orientation:"vertical",size:"sm"}),e.jsx("span",{className:"font-medium",children:"Settings"})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("p",{children:"Sign in with your work account."}),e.jsx(t,{orientation:"horizontal",label:"OR"}),e.jsx("p",{children:"Continue with a single-use link instead."})]})]})}const G=`import { AppDivider } from "@cjlapao/ui-kit";

export default function HeaderSections() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <span className="font-medium">Home</span>
        <AppDivider orientation="vertical" size="sm" />
        <span className="font-medium">Reports</span>
        <AppDivider orientation="vertical" size="sm" />
        <span className="font-medium">Settings</span>
      </div>
      <div className="flex flex-col gap-3">
        <p>Sign in with your work account.</p>
        <AppDivider orientation="horizontal" label="OR" />
        <p>Continue with a single-use link instead.</p>
      </div>
    </div>
  );
}
`,U=["solid","dashed","dotted","gradient"],Z={solid:"Solid",dashed:"Dashed",dotted:"Dotted",gradient:"Gradient — fades out at both ends"};function _(){return e.jsx("div",{className:"flex w-full flex-col gap-4",children:U.map(n=>e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:Z[n]}),e.jsx(t,{orientation:"horizontal",variant:n})]},n))})}const q=`import { AppDivider } from "@cjlapao/ui-kit";
import type { AppDividerVariant } from "@cjlapao/ui-kit";

const VARIANTS: AppDividerVariant[] = [
  "solid",
  "dashed",
  "dotted",
  "gradient",
];

const LABELS: Record<AppDividerVariant, string> = {
  solid: "Solid",
  dashed: "Dashed",
  dotted: "Dotted",
  gradient: "Gradient — fades out at both ends",
};

export default function Variants() {
  return (
    <div className="flex w-full flex-col gap-4">
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
            {LABELS[variant]}
          </p>
          <AppDivider orientation="horizontal" variant={variant} />
        </div>
      ))}
    </div>
  );
}
`,F=["xs","sm","md","lg","xl"],M={xs:1,sm:2,md:3,lg:4,xl:6};function J(){return e.jsx("div",{className:"flex w-full flex-col gap-4",children:F.map(n=>e.jsxs("div",{children:[e.jsxs("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:[n," — ",M[n],"px"]}),e.jsx(t,{orientation:"horizontal",size:n,spacing:"xs"})]},n))})}const K=`import { AppDivider } from "@cjlapao/ui-kit";
import type { ControlSize } from "@cjlapao/ui-kit";

const SIZES: ControlSize[] = ["xs", "sm", "md", "lg", "xl"];

const PITCH: Record<ControlSize, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

export default function Thicknesses() {
  return (
    <div className="flex w-full flex-col gap-4">
      {SIZES.map((size) => (
        <div key={size}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
            {size} — {PITCH[size]}px
          </p>
          <AppDivider orientation="horizontal" size={size} spacing="xs" />
        </div>
      ))}
    </div>
  );
}
`,Q=["start","center","end"];function X(){return e.jsx("div",{className:"flex w-full flex-col gap-5",children:Q.map(n=>e.jsx(t,{orientation:"horizontal",variant:"dashed",label:"OR",labelPosition:n},n))})}const Y=`import { AppDivider } from "@cjlapao/ui-kit";
import type { AppDividerLabelPosition } from "@cjlapao/ui-kit";

const POSITIONS: AppDividerLabelPosition[] = ["start", "center", "end"];

export default function LabelPositions() {
  return (
    <div className="flex w-full flex-col gap-5">
      {POSITIONS.map((position) => (
        <AppDivider
          key={position}
          orientation="horizontal"
          variant="dashed"
          label="OR"
          labelPosition={position}
        />
      ))}
    </div>
  );
}
`,ae=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(O,{name:"App Divider",description:"A rule between sections — vertical or horizontal, optionally labelled. Takes the surrounding surface's divider colour unless given a tone, so it adapts on glass."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Header sections",description:"The canonical case: vertical rules between toolbar items, and a labelled horizontal rule between two sign-in options. A labelled divider is announced as a separator.",code:G,filename:"HeaderSections.tsx",children:e.jsx(B,{})}),e.jsx(l,{title:"Variants",description:"Solid, dashed, dotted, and gradient — the gradient fades out at both ends.",code:q,filename:"Variants.tsx",children:e.jsx(_,{})}),e.jsx(l,{title:"Thicknesses",description:"The shared control scale as line thickness, from a 1px hairline to 6px.",code:K,filename:"Thicknesses.tsx",children:e.jsx(J,{})}),e.jsx(l,{title:"Label positions",description:"The label can sit at the start, the center, or the end of the rule — start and end keep a short stub on the far side.",code:Y,filename:"LabelPositions.tsx",children:e.jsx(X,{})})]})]});export{ae as AppDividerPage,ae as default};
