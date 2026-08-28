import{r as t,j as e,e as n,M as r,l as X}from"./index-Bw7SVFgV.js";import{P as Y}from"./PageHeader-CQm-NnZo.js";import{E as l}from"./ExampleCard-BR4461qP.js";import{P as Z,S as z,C as i,T as o}from"./PlaygroundPanel-efOYSasM.js";import{C as $}from"./ControlAccordion-BDKCdIsF.js";import{r as ee,u as te,v as ne,t as se,k as oe,l as ae,j as le}from"./options-CREM8uYu.js";const ie=()=>{const[a,O]=t.useState("solid"),[g,w]=t.useState("md"),[p,A]=t.useState("normal"),[m,T]=t.useState("blue"),[f,L]=t.useState(!1),[j,E]=t.useState(!1),[v,R]=t.useState(!1),[c,V]=t.useState(!1),[b,W]=t.useState(!1),[d,G]=t.useState(!1),[S,P]=t.useState(!1),[u,D]=t.useState(!1),[C,F]=t.useState(!1),[x,M]=t.useState(!1),[h,U]=t.useState("#ef4444"),[B,_]=t.useState(!1),[k,H]=t.useState(!1),[y,q]=t.useState("medium"),[I,J]=t.useState("frosted"),[N,K]=t.useState("none"),Q=d?u?"Search":"Star":u?"Search":void 0;return e.jsx(Z,{controls:e.jsx($,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(z,{label:"Variant",options:ee,value:a,onChange:s=>O(s)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(i,{label:"Size",children:e.jsx(r,{fullWidth:!0,size:"sm",options:te,value:g,onChange:s=>w(s)})}),e.jsx(i,{label:"Weight",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ne,value:p,onChange:s=>A(s)})})]}),e.jsx(z,{label:"Color",options:se,value:m,onChange:s=>T(s)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Loading",checked:f,onChange:L}),e.jsx(o,{label:"Disabled",checked:j,onChange:E}),e.jsx(o,{label:"Active",checked:v,onChange:R}),e.jsx(o,{label:"Glass",checked:c,onChange:V}),e.jsx(o,{label:"Accent",checked:b,onChange:W}),e.jsx(o,{label:"Tooltip",checked:B,onChange:_})]})},{id:"icons",title:"Icons",controls:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Icon only",checked:d,onChange:G}),e.jsx(o,{label:"Leading icon",checked:u,onChange:D}),e.jsx(o,{label:"Trailing icon",checked:C,onChange:F}),e.jsx(o,{label:"Icon color",checked:x,onChange:M})]}),x&&e.jsx(i,{label:"Icon color (override)",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"color",value:h,onChange:s=>U(s.target.value),className:"h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent p-1 dark:border-neutral-600","aria-label":"Icon color"}),e.jsx("span",{className:"font-mono text-sm opacity-70",children:h})]})})]})},{id:"layout",title:"Layout",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Full width",checked:S,onChange:P}),e.jsx(o,{label:"On a glass panel",checked:k,onChange:H})]})},...c?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{label:"Vibrancy",children:e.jsx(r,{fullWidth:!0,size:"sm",options:oe,value:y,onChange:s=>q(s)})}),e.jsx(i,{label:"Fill",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ae,value:I,onChange:s=>J(s)})}),e.jsx(i,{label:"Specular",children:e.jsx(r,{fullWidth:!0,size:"sm",options:le,value:N,onChange:s=>K(s)})})]})}]:[]]}),preview:e.jsx("div",{className:k?"rounded-2xl bg-gradient-to-br from-sky-400 via-violet-400 to-rose-300 p-6 dark:from-sky-600 dark:via-violet-600 dark:to-rose-500":"rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900",children:e.jsx(n,{variant:a,size:g,weight:p,color:m,loading:f,disabled:j,active:v,glass:c,accent:b,iconOnly:d,fullWidth:S,vibrancy:y,glassOpacity:I,specularMode:N,leadingIcon:Q,trailingIcon:C?"ArrowRight":void 0,iconColor:x?h:void 0,tooltip:B?"A button with a tooltip":void 0,children:"Button Label"})})})};function re(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(n,{variant:"solid",color:"blue",children:"Solid"}),e.jsx(n,{variant:"soft",color:"blue",children:"Soft"}),e.jsx(n,{variant:"outline",color:"blue",children:"Outline"}),e.jsx(n,{variant:"ghost",color:"blue",children:"Ghost"}),e.jsx(n,{variant:"link",color:"blue",children:"Link"}),e.jsx(n,{variant:"clear",color:"blue",children:"Clear"})]})}const ce=`import { Button } from "@cjlapao/ui-kit";

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
`;function de(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(n,{size:"xs",children:"Extra small"}),e.jsx(n,{size:"sm",children:"Small"}),e.jsx(n,{size:"md",children:"Medium"}),e.jsx(n,{size:"lg",children:"Large"}),e.jsx(n,{size:"xl",children:"Extra large"})]})}const ue=`import { Button } from "@cjlapao/ui-kit";

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
`;function xe(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(n,{loading:!0,children:"Saving…"}),e.jsx(n,{disabled:!0,children:"Disabled"}),e.jsx(n,{variant:"soft",color:"rose",disabled:!0,children:"Disabled soft"})]})}const he=`import { Button } from "@cjlapao/ui-kit";

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
`;function ge(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(n,{leadingIcon:"Search",children:"Search"}),e.jsx(n,{trailingIcon:"ArrowRight",variant:"soft",children:"Continue"}),e.jsx(n,{variant:"icon",leadingIcon:"Close","aria-label":"Close"})]})}const pe=`import { Button } from "@cjlapao/ui-kit";

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
`;function me(){return e.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:X.map(a=>e.jsx(n,{variant:"solid",color:a,children:a},a))})}const fe=`import { Button, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,je=["solid","soft","outline","ghost"];function ve(){return e.jsx("div",{className:"grid gap-3 md:grid-cols-2",children:je.map(a=>e.jsx(n,{variant:a,active:!0,children:a},a))})}const be=`import { Button } from "@cjlapao/ui-kit";

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
`,Ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Y,{name:"Button",description:"The primary action control. Eight variants, five sizes, four label weights and every true color — plus loading, disabled and icon states, all on one component."}),e.jsx(ie,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Variants",description:"From the loudest solid primary to a nearly invisible clear button.",code:ce,filename:"Variants.tsx",children:e.jsx(re,{})}),e.jsx(l,{title:"Sizes",description:"The shared control scale, from xs for dense toolbars up to xl for empty states.",code:ue,filename:"Sizes.tsx",children:e.jsx(de,{})}),e.jsx(l,{title:"States",description:"Loading keeps the spinner bright while blocking input; disabled dims the label and the control.",code:he,filename:"States.tsx",children:e.jsx(xe,{})}),e.jsx(l,{title:"Icons",description:"Leading and trailing icons from the registry by name, and the icon-only variant for compact toolbars.",code:pe,filename:"Icons.tsx",children:e.jsx(ge,{})}),e.jsx(l,{title:"All tones",description:"Every one of the 21 true colours as a solid button, fixed size.",code:fe,filename:"AllTones.tsx",children:e.jsx(me,{})}),e.jsx(l,{title:"Pressed",description:"The active prop is the persistent “on” state — a toggle that stays lit, distinct from the hover and focus styles.",code:be,filename:"Active.tsx",children:e.jsx(ve,{})})]})]});export{Ne as ButtonPage,Ne as default};
