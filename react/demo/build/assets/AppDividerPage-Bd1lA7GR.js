import{r as s,j as e,P as D,C as z,o as a}from"./index-B9JeX19j.js";import{P}from"./PageHeader-D-LFwZLT.js";import{E as r}from"./ExampleCard-BwESxlwz.js";import{A as O,a as c,C as i,b as I,P as L}from"./A11ySections-C9rTCDac.js";import{P as E,C as o,T as p,a as R}from"./PlaygroundPanel-CZvYEX_V.js";import{C as V}from"./ControlAccordion-rp4gabXb.js";import{q as H,d as F,r as B}from"./options-Blq0niUd.js";const G=[{label:"Vertical",value:"vertical"},{label:"Horizontal",value:"horizontal"}],_=[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"}],M=()=>{const[n,j]=s.useState("vertical"),[h,b]=s.useState("solid"),[l,S]=s.useState(!1),[x,w]=s.useState("blue"),[u,y]=s.useState("xs"),[m,N]=s.useState("sm"),[f,A]=s.useState(!1),[v,k]=s.useState("center"),[g,C]=s.useState(!1),d=e.jsx(a,{orientation:n,variant:h,tone:l?x:void 0,size:u,spacing:m,label:f?"OR":void 0,labelPosition:v}),T=n==="vertical"?e.jsxs("div",{className:"flex h-16 items-center",children:[e.jsx("span",{children:"Item 1"}),d,e.jsx("span",{children:"Item 2"}),d,e.jsx("span",{children:"Item 3"})]}):e.jsxs("div",{className:"w-full",children:[e.jsx("p",{children:"Sign in with your work account."}),d,e.jsx("p",{children:"Continue with a single-use link instead."})]});return e.jsx(E,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(V,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Orientation",options:G,value:n,onChange:t=>j(t)}),e.jsx(o,{label:"Variant",options:H,value:h,onChange:t=>b(t)}),e.jsx(o,{label:"Thickness",options:F,value:u,onChange:t=>y(t)}),e.jsx(o,{label:"Spacing",options:B,value:m,onChange:t=>N(t)})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Label position",options:_,value:v,onChange:t=>k(t)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(p,{label:"Use tone",checked:l,onChange:S}),l&&e.jsx(R,{label:"Tone",children:e.jsx(z,{selectable:!0,size:"sm",value:x,onSelect:w,defaultExpanded:!0})}),e.jsx(p,{label:"Label",checked:f,onChange:A}),e.jsx(p,{label:"On a glass panel",checked:g,onChange:C})]})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("strong",{children:"Use tone"})," off, the rule reads the surrounding surface's divider colour — switch ",e.jsx("strong",{children:"On a glass panel"})," ","on to see it adapt. A labelled divider is announced as a"," ",e.jsx("code",{children:"separator"}),"; an unlabelled one is decoration and hidden from assistive tech."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(D,{variant:g?"liquid-glass":"outlined",tone:"neutral",children:T})})})};function U(){return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsxs("div",{className:"flex h-16 items-center justify-between",children:[e.jsx("span",{className:"font-medium",children:"Home"}),e.jsx(a,{orientation:"vertical",size:"sm"}),e.jsx("span",{className:"font-medium",children:"Reports"}),e.jsx(a,{orientation:"vertical",size:"sm"}),e.jsx("span",{className:"font-medium",children:"Settings"})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("p",{children:"Sign in with your work account."}),e.jsx(a,{orientation:"horizontal",label:"OR"}),e.jsx("p",{children:"Continue with a single-use link instead."})]})]})}const W=`import { AppDivider } from "@cjlapao/ui-kit";

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
`,Z=["solid","dashed","dotted","gradient"],q={solid:"Solid",dashed:"Dashed",dotted:"Dotted",gradient:"Gradient — fades out at both ends"};function K(){return e.jsx("div",{className:"flex w-full flex-col gap-4",children:Z.map(n=>e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:q[n]}),e.jsx(a,{orientation:"horizontal",variant:n})]},n))})}const J=`import { AppDivider } from "@cjlapao/ui-kit";
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
`,Q=["xs","sm","md","lg","xl"],X={xs:1,sm:2,md:3,lg:4,xl:6};function Y(){return e.jsx("div",{className:"flex w-full flex-col gap-4",children:Q.map(n=>e.jsxs("div",{children:[e.jsxs("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:[n," — ",X[n],"px"]}),e.jsx(a,{orientation:"horizontal",size:n,spacing:"xs"})]},n))})}const $=`import { AppDivider } from "@cjlapao/ui-kit";
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
`,ee=["start","center","end"];function ne(){return e.jsx("div",{className:"flex w-full flex-col gap-5",children:ee.map(n=>e.jsx(a,{orientation:"horizontal",variant:"dashed",label:"OR",labelPosition:n},n))})}const ie=`import { AppDivider } from "@cjlapao/ui-kit";
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
`,pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(P,{name:"App Divider",description:"A rule between sections — vertical or horizontal, optionally labelled. Takes the surrounding surface's divider colour unless given a tone, so it adapts on glass."}),e.jsx(M,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Header sections",description:"The canonical case: vertical rules between toolbar items, and a labelled horizontal rule between two sign-in options. A labelled divider is announced as a separator.",code:W,filename:"HeaderSections.tsx",children:e.jsx(U,{})}),e.jsx(r,{title:"Variants",description:"Solid, dashed, dotted, and gradient — the gradient fades out at both ends.",code:J,filename:"Variants.tsx",children:e.jsx(K,{})}),e.jsx(r,{title:"Thicknesses",description:"The shared control scale as line thickness, from a 1px hairline to 6px.",code:$,filename:"Thicknesses.tsx",children:e.jsx(Y,{})}),e.jsx(r,{title:"Label positions",description:"The label can sit at the start, the center, or the end of the rule — start and end keep a short stub on the far side.",code:ie,filename:"LabelPositions.tsx",children:e.jsx(ne,{})})]}),e.jsxs(O,{children:[e.jsxs(c,{title:"Screen reader",children:[e.jsxs("p",{children:["The rule carries its semantic weight through the ",e.jsx(i,{children:"label"}),". An unlabelled divider is decoration — ",e.jsx(i,{children:"aria-hidden"}),", invisible to the accessibility tree — while a labelled one publishes"," ",e.jsx(i,{children:'role="separator"'})," with its ",e.jsx(i,{children:"aria-orientation"}),", so it is announced where it sits. ",e.jsx(i,{children:"decorative"})," overrides the choice either way. Nothing else is announced: the segments either side of a labelled rule are ordinary content and keep their own place in the reading order."]}),e.jsx(I,{filename:"Semantics.tsx",code:te})]}),e.jsx(c,{title:"Keyboard Support",children:e.jsx("p",{children:"None, by design — a divider is not interactive and must never land in the tab order. There are no key bindings to learn; keyboard and screen-reader users move through the content around it."})}),e.jsx(c,{title:"Internationalization",children:e.jsxs("p",{children:["The component speaks no strings of its own — the only text is the caller’s ",e.jsx(i,{children:"label"}),", so translation belongs to the application. Direction comes for free: the layout uses flexbox start/end and logical-order margins, so the whole rule (stub sides included) mirrors automatically under ",e.jsx(i,{children:'dir="rtl"'}),", and"," ",e.jsx(i,{children:"aria-orientation"})," describes the rule’s own axis, not a screen side."]})})]}),e.jsx(L,{props:[{name:"orientation",type:'"vertical" | "horizontal"',default:"vertical",description:e.jsxs(e.Fragment,{children:["Which way the rule runs — ",e.jsx(i,{children:"aria-orientation"})," when it is announced."]})},{name:"variant",type:'"solid" | "dashed" | "dotted" | "gradient"',default:"solid",description:"Line style; the gradient fades out at both ends, built from the tone's colour variable."},{name:"tone",type:"TrueColor",description:e.jsxs(e.Fragment,{children:["Accent colour. Omit it and the rule takes the surrounding surface’s ",e.jsx(i,{children:"divider"})," token, which adapts on glass."]})},{name:"size",type:"ControlSize",default:"xs",description:"Thickness on the shared scale — 1/2/3/4/6 px (xs–xl), applied as real pixels."},{name:"spacing",type:'"none" | ControlSize',default:"sm",description:"Margin on the rule's cross axis."},{name:"length",type:"number | string",description:"Along the rule's own axis. Defaults to 1.5rem vertical, full width horizontal."},{name:"label",type:"ReactNode",description:e.jsxs(e.Fragment,{children:["Text set into the rule — the switch between decoration and announced ",e.jsx(i,{children:"separator"}),"."]})},{name:"labelPosition",type:'"start" | "center" | "end"',default:"center",description:"Start and end keep a short stub on the far side."},{name:"decorative",type:"boolean",description:"Forces aria-hidden on (or off). Default: hidden unless a label is set."},{name:"height",type:"number | string",description:e.jsxs(e.Fragment,{children:["Deprecated — alias of ",e.jsx(i,{children:"length"}),"."]})},{name:"width",type:"number",description:e.jsxs(e.Fragment,{children:["Deprecated — alias of ",e.jsx(i,{children:"size"})," (as pixels)."]})},{name:"margin",type:"number | string",description:e.jsxs(e.Fragment,{children:["Deprecated — alias of ",e.jsx(i,{children:"spacing"}),"."]})},{name:"…div props",type:"HTMLAttributes",description:"className and the rest land on the wrapper div."}]})]}),te=`// Decoration — two toolbar items with a rule between them.
<AppDivider />

// Semantics — the rule names the break it makes.
<AppDivider label="OR" />`;export{pe as AppDividerPage,pe as default};
