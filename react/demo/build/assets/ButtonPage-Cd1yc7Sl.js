import{r as n,j as e,e as t,M as r,k as X}from"./index-B-ieYLXc.js";import{P as Y,S as N,C as l,T as o,a as Z,E as i}from"./PlaygroundPanel-CkWfNJii.js";import{q as $,r as ee,u as ne,t as te,j as se,k as oe,i as ae}from"./options-C8y5quvx.js";const le=()=>{const[a,O]=n.useState("solid"),[g,w]=n.useState("md"),[p,A]=n.useState("normal"),[m,T]=n.useState("blue"),[f,E]=n.useState(!1),[v,L]=n.useState(!1),[j,R]=n.useState(!1),[c,V]=n.useState(!1),[b,W]=n.useState(!1),[d,G]=n.useState(!1),[S,P]=n.useState(!1),[u,D]=n.useState(!1),[C,M]=n.useState(!1),[x,F]=n.useState(!1),[h,U]=n.useState("#ef4444"),[B,_]=n.useState(!1),[k,q]=n.useState(!1),[y,H]=n.useState("medium"),[z,J]=n.useState("frosted"),[I,K]=n.useState("none"),Q=d?u?"Search":"Star":u?"Search":void 0;return e.jsx(Y,{controls:e.jsxs(e.Fragment,{children:[e.jsx(N,{label:"Variant",options:$,value:a,onChange:s=>O(s)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(l,{label:"Size",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ee,value:g,onChange:s=>w(s)})}),e.jsx(l,{label:"Weight",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ne,value:p,onChange:s=>A(s)})})]}),e.jsx(N,{label:"Color",options:te,value:m,onChange:s=>T(s)}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Loading",checked:f,onChange:E}),e.jsx(o,{label:"Disabled",checked:v,onChange:L}),e.jsx(o,{label:"Active",checked:j,onChange:R}),e.jsx(o,{label:"Glass",checked:c,onChange:V}),e.jsx(o,{label:"Accent",checked:b,onChange:W}),e.jsx(o,{label:"Icon only",checked:d,onChange:G}),e.jsx(o,{label:"Full width",checked:S,onChange:P}),e.jsx(o,{label:"Leading icon",checked:u,onChange:D}),e.jsx(o,{label:"Trailing icon",checked:C,onChange:M}),e.jsx(o,{label:"Icon color",checked:x,onChange:F}),e.jsx(o,{label:"Tooltip",checked:B,onChange:_}),e.jsx(o,{label:"On a glass panel",checked:k,onChange:q})]}),x&&e.jsx(l,{label:"Icon color (override)",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"color",value:h,onChange:s=>U(s.target.value),className:"h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent p-1 dark:border-neutral-600","aria-label":"Icon color"}),e.jsx("span",{className:"font-mono text-sm opacity-70",children:h})]})}),c&&e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{label:"Vibrancy",children:e.jsx(r,{fullWidth:!0,size:"sm",options:se,value:y,onChange:s=>H(s)})}),e.jsx(l,{label:"Fill",children:e.jsx(r,{fullWidth:!0,size:"sm",options:oe,value:z,onChange:s=>J(s)})}),e.jsx(l,{label:"Specular",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ae,value:I,onChange:s=>K(s)})})]})]}),preview:e.jsx("div",{className:k?"rounded-2xl bg-gradient-to-br from-sky-400 via-violet-400 to-rose-300 p-6 dark:from-sky-600 dark:via-violet-600 dark:to-rose-500":"rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900",children:e.jsx(t,{variant:a,size:g,weight:p,color:m,loading:f,disabled:v,active:j,glass:c,accent:b,iconOnly:d,fullWidth:S,vibrancy:y,glassOpacity:z,specularMode:I,leadingIcon:Q,trailingIcon:C?"ArrowRight":void 0,iconColor:x?h:void 0,tooltip:B?"A button with a tooltip":void 0,children:"Button Label"})})})};function ie(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(t,{variant:"solid",color:"blue",children:"Solid"}),e.jsx(t,{variant:"soft",color:"blue",children:"Soft"}),e.jsx(t,{variant:"outline",color:"blue",children:"Outline"}),e.jsx(t,{variant:"ghost",color:"blue",children:"Ghost"}),e.jsx(t,{variant:"link",color:"blue",children:"Link"}),e.jsx(t,{variant:"clear",color:"blue",children:"Clear"})]})}const re=`import { Button } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid" color="blue">
        Solid
      </Button>
      <Button variant="soft" color="blue">
        Soft
      </Button>
      <Button variant="outline" color="blue">
        Outline
      </Button>
      <Button variant="ghost" color="blue">
        Ghost
      </Button>
      <Button variant="link" color="blue">
        Link
      </Button>
      <Button variant="clear" color="blue">
        Clear
      </Button>
    </div>
  );
}
`;function ce(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(t,{size:"xs",children:"Extra small"}),e.jsx(t,{size:"sm",children:"Small"}),e.jsx(t,{size:"md",children:"Medium"}),e.jsx(t,{size:"lg",children:"Large"}),e.jsx(t,{size:"xl",children:"Extra large"})]})}const de=`import { Button } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  );
}
`;function ue(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(t,{loading:!0,children:"Saving…"}),e.jsx(t,{disabled:!0,children:"Disabled"}),e.jsx(t,{variant:"soft",color:"rose",disabled:!0,children:"Disabled soft"})]})}const xe=`import { Button } from "@cjlapao/ui-kit";

export default function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>
        Saving…
      </Button>
      <Button disabled>
        Disabled
      </Button>
      <Button variant="soft" color="rose" disabled>
        Disabled soft
      </Button>
    </div>
  );
}
`;function he(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(t,{leadingIcon:"Search",children:"Search"}),e.jsx(t,{trailingIcon:"ArrowRight",variant:"soft",children:"Continue"}),e.jsx(t,{variant:"icon",leadingIcon:"Close","aria-label":"Close"})]})}const ge=`import { Button } from "@cjlapao/ui-kit";

export default function Icons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leadingIcon="Search">
        Search
      </Button>
      <Button trailingIcon="ArrowRight" variant="soft">
        Continue
      </Button>
      <Button variant="icon" leadingIcon="Close" aria-label="Close" />
    </div>
  );
}
`;function pe(){return e.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:X.map(a=>e.jsx(t,{variant:"solid",color:a,children:a},a))})}const me=`import { Button, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function AllTones() {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <Button key={each} variant="solid" color={each}>
          {each}
        </Button>
      ))}
    </div>
  );
}
`,fe=["solid","soft","outline","ghost"];function ve(){return e.jsx("div",{className:"grid gap-3 md:grid-cols-2",children:fe.map(a=>e.jsx(t,{variant:a,active:!0,children:a},a))})}const je=`import { Button } from "@cjlapao/ui-kit";

const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;

export default function Active() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {VARIANTS.map((each) => (
        <Button key={each} variant={each} active>
          {each}
        </Button>
      ))}
    </div>
  );
}
`,Be=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Z,{name:"Button",description:"The primary action control. Eight variants, five sizes, four label weights and every true color — plus loading, disabled and icon states, all on one component."}),e.jsx(le,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Variants",description:"From the loudest solid primary to a nearly invisible clear button.",code:re,filename:"Variants.tsx",children:e.jsx(ie,{})}),e.jsx(i,{title:"Sizes",description:"The shared control scale, from xs for dense toolbars up to xl for empty states.",code:de,filename:"Sizes.tsx",children:e.jsx(ce,{})}),e.jsx(i,{title:"States",description:"Loading keeps the spinner bright while blocking input; disabled dims the label and the control.",code:xe,filename:"States.tsx",children:e.jsx(ue,{})}),e.jsx(i,{title:"Icons",description:"Leading and trailing icons from the registry by name, and the icon-only variant for compact toolbars.",code:ge,filename:"Icons.tsx",children:e.jsx(he,{})}),e.jsx(i,{title:"All tones",description:"Every one of the 21 true colours as a solid button, fixed size.",code:me,filename:"AllTones.tsx",children:e.jsx(pe,{})}),e.jsx(i,{title:"Pressed",description:"The active prop is the persistent “on” state — a toggle that stays lit, distinct from the hover and focus styles.",code:je,filename:"Active.tsx",children:e.jsx(ve,{})})]})]});export{Be as ButtonPage,Be as default};
