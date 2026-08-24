import{r as i,j as e,P as C,M as a,A as t}from"./index-B-ieYLXc.js";import{P as O,C as l,S as P,T as d,a as D,E as o}from"./PlaygroundPanel-CkWfNJii.js";import{m as I,n as y,o as L,t as R}from"./options-C8y5quvx.js";const E=[{label:"Vertical",value:"vertical"},{label:"Horizontal",value:"horizontal"}],V=[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"}],H=()=>{const[n,g]=i.useState("vertical"),[c,j]=i.useState("solid"),[p,b]=i.useState(!1),[x,S]=i.useState("blue"),[u,N]=i.useState("xs"),[m,k]=i.useState("sm"),[h,w]=i.useState(!1),[f,A]=i.useState("center"),[v,z]=i.useState(!1),r=e.jsx(t,{orientation:n,variant:c,tone:p?x:void 0,size:u,spacing:m,label:h?"OR":void 0,labelPosition:f}),T=n==="vertical"?e.jsxs("div",{className:"flex h-16 items-center",children:[e.jsx("span",{children:"Item 1"}),r,e.jsx("span",{children:"Item 2"}),r,e.jsx("span",{children:"Item 3"})]}):e.jsxs("div",{className:"w-full",children:[e.jsx("p",{children:"Sign in with your work account."}),r,e.jsx("p",{children:"Continue with a single-use link instead."})]});return e.jsx(O,{controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Orientation",children:e.jsx(a,{fullWidth:!0,size:"sm",options:E,value:n,onChange:s=>g(s)})}),e.jsx(l,{label:"Variant",children:e.jsx(a,{fullWidth:!0,size:"sm",options:I,value:c,onChange:s=>j(s)})}),e.jsx(l,{label:"Thickness",children:e.jsx(a,{fullWidth:!0,size:"sm",options:y,value:u,onChange:s=>N(s)})}),e.jsx(l,{label:"Spacing",children:e.jsx(a,{fullWidth:!0,size:"sm",options:L,value:m,onChange:s=>k(s)})}),e.jsx(P,{label:"Tone",options:R,value:x,onChange:s=>S(s)}),e.jsx(l,{label:"Label position",children:e.jsx(a,{fullWidth:!0,size:"sm",options:V,value:f,onChange:s=>A(s)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(d,{label:"Use tone",checked:p,onChange:b}),e.jsx(d,{label:"Label",checked:h,onChange:w}),e.jsx(d,{label:"On a glass panel",checked:v,onChange:z})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("strong",{children:"Use tone"})," off, the rule reads the surrounding surface's divider colour — switch ",e.jsx("strong",{children:"On a glass panel"})," ","on to see it adapt. A labelled divider is announced as a"," ",e.jsx("code",{children:"separator"}),"; an unlabelled one is decoration and hidden from assistive tech."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(C,{variant:v?"liquid-glass":"outlined",tone:"neutral",padding:"md",children:T})})})})};function W(){return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsxs("div",{className:"flex h-16 items-center justify-between",children:[e.jsx("span",{className:"font-medium",children:"Home"}),e.jsx(t,{orientation:"vertical",size:"sm"}),e.jsx("span",{className:"font-medium",children:"Reports"}),e.jsx(t,{orientation:"vertical",size:"sm"}),e.jsx("span",{className:"font-medium",children:"Settings"})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("p",{children:"Sign in with your work account."}),e.jsx(t,{orientation:"horizontal",label:"OR"}),e.jsx("p",{children:"Continue with a single-use link instead."})]})]})}const B=`import { AppDivider } from "@cjlapao/ui-kit";

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
`,G=["solid","dashed","dotted","gradient"],U={solid:"Solid",dashed:"Dashed",dotted:"Dotted",gradient:"Gradient — fades out at both ends"};function Z(){return e.jsx("div",{className:"flex w-full flex-col gap-4",children:G.map(n=>e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:U[n]}),e.jsx(t,{orientation:"horizontal",variant:n})]},n))})}const _=`import { AppDivider } from "@cjlapao/ui-kit";
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
`,M=["xs","sm","md","lg","xl"],q={xs:1,sm:2,md:3,lg:4,xl:6};function F(){return e.jsx("div",{className:"flex w-full flex-col gap-4",children:M.map(n=>e.jsxs("div",{children:[e.jsxs("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:[n," — ",q[n],"px"]}),e.jsx(t,{orientation:"horizontal",size:n,spacing:"xs"})]},n))})}const J=`import { AppDivider } from "@cjlapao/ui-kit";
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
`,K=["start","center","end"];function Q(){return e.jsx("div",{className:"flex w-full flex-col gap-5",children:K.map(n=>e.jsx(t,{orientation:"horizontal",variant:"dashed",label:"OR",labelPosition:n},n))})}const X=`import { AppDivider } from "@cjlapao/ui-kit";
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
`,ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(D,{name:"App Divider",description:"A rule between sections — vertical or horizontal, optionally labelled. Takes the surrounding surface's divider colour unless given a tone, so it adapts on glass."}),e.jsx(H,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Header sections",description:"The canonical case: vertical rules between toolbar items, and a labelled horizontal rule between two sign-in options. A labelled divider is announced as a separator.",code:B,filename:"HeaderSections.tsx",children:e.jsx(W,{})}),e.jsx(o,{title:"Variants",description:"Solid, dashed, dotted, and gradient — the gradient fades out at both ends.",code:_,filename:"Variants.tsx",children:e.jsx(Z,{})}),e.jsx(o,{title:"Thicknesses",description:"The shared control scale as line thickness, from a 1px hairline to 6px.",code:J,filename:"Thicknesses.tsx",children:e.jsx(F,{})}),e.jsx(o,{title:"Label positions",description:"The label can sit at the start, the center, or the end of the rule — start and end keep a short stub on the far side.",code:X,filename:"LabelPositions.tsx",children:e.jsx(Q,{})})]})]});export{ne as AppDividerPage,ne as default};
