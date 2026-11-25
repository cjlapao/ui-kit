import{r as n,a1 as E,j as e,a3 as i,P as V}from"./index-CQwZVYnB.js";import{P as q}from"./PageHeader-BhZxEVHt.js";import{E as c}from"./ExampleCard-BZsKA5_g.js";import{a as L}from"./SurfaceToneControl-LH37fS9y.js";import{P as W,C as t,a as w,T as l}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as F}from"./ControlAccordion-C7vC6faF.js";import{D as _,f as M,p as Q,A as z,B as $,C as D}from"./options-Byh1yOHz.js";const K=["glass","liquid-glass","default"],U="We encrypt your API tokens client-side using the session keys you configure here.",B="We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.",J=()=>{const[a,k]=n.useState("card"),[d,j]=n.useState("none"),[u,C]=n.useState(E),[p,S]=n.useState("sm"),[x,P]=n.useState(!1),[h,N]=n.useState(!0),[m,T]=n.useState(!0),[o,O]=n.useState(!0),[f,A]=n.useState(!1),[r,H]=n.useState(130),[g,I]=n.useState("classic"),[v,R]=n.useState("medium"),[y,G]=n.useState("frosted"),Y=K.includes(a);return e.jsx(W,{controls:e.jsx(F,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(t,{label:"Variant",options:_,value:a,onChange:s=>k(s)}),e.jsx(w,{label:"Tone",children:e.jsx(L,{value:d,onSelect:j})}),e.jsx(t,{label:"Corner",options:M,value:u,onChange:s=>C(s)}),e.jsx(t,{label:"Padding",options:Q,value:p,onChange:s=>S(s)}),e.jsx(l,{label:"Raised surface",checked:x,onChange:P})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(w,{label:`Max length — ${r} characters`,children:e.jsx("input",{type:"range",min:40,max:340,value:r,onChange:s=>H(Number(s.target.value)),className:"w-full accent-blue-500"})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(l,{label:"Title",checked:m,onChange:T}),e.jsx(l,{label:"Icon",checked:h,onChange:N}),e.jsx(l,{label:"Long copy",checked:o,onChange:O}),e.jsx(l,{label:"Extra children",checked:f,onChange:A})]})]})},...Y?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(t,{label:"Specular",options:z,value:g,onChange:s=>I(s)}),e.jsx(t,{label:"Vibrancy",options:$,value:v,onChange:s=>R(s)}),e.jsx(t,{label:"Glass opacity",options:D,value:y,onChange:s=>G(s)})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(i,{title:m?o?"Why we ask for reviews":"Secret tokens":void 0,text:o?B:U,showIcon:h,tone:d,variant:a,corner:u,padding:p,raisedSurface:x,maxLength:r,glassOpacity:y,vibrancy:v,specularMode:g,children:f?e.jsxs("span",{children:["Extra content passed as ",e.jsx("code",{children:"children"})," — always visible, whether or not the summary is expanded."]}):void 0})})})},X="We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.";function Z(){return e.jsx("div",{className:"w-full max-w-2xl",children:e.jsx(i,{title:"Why we ask for reviews",text:X,showIcon:!0,tone:"emerald",variant:"card"})})}const ee=`import { CollapsibleHelpText } from "@cjlapao/ui-kit";

const LONG_COPY =
  "We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.";

export default function ReviewQuestion() {
  return (
    <div className="w-full max-w-2xl">
      <CollapsibleHelpText
        title="Why we ask for reviews"
        text={LONG_COPY}
        showIcon
        tone="emerald"
        variant="card"
      />
    </div>
  );
}
`,se=["card","elevated","outlined","subtle","tonal","default","glass","liquid-glass","simple","plain"],ne="We encrypt your API tokens client-side using the session keys you configure here. Keys never leave your browser in clear text.";function ae(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:se.map(a=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:a}),e.jsx(i,{text:ne,tone:"emerald",variant:a,padding:"sm"})]},a))})}const te=`import { CollapsibleHelpText } from "@cjlapao/ui-kit";
import type { CollapsibleHelpTextVariant } from "@cjlapao/ui-kit";

const VARIANTS: CollapsibleHelpTextVariant[] = [
  "card",
  "elevated",
  "outlined",
  "subtle",
  "tonal",
  "default",
  "glass",
  "liquid-glass",
  "simple",
  "plain",
];

const COPY =
  "We encrypt your API tokens client-side using the session keys you configure here. Keys never leave your browser in clear text.";

export default function Surfaces() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            {variant}
          </span>
          <CollapsibleHelpText
            text={COPY}
            tone="emerald"
            variant={variant}
            padding="sm"
          />
        </div>
      ))}
    </div>
  );
}
`,b="Session keys rotate every 30 days. After a rotation, older sessions keep working until they expire, so no one is signed out mid-task.";function le(){return e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(V,{variant:"liquid-glass",tone:"emerald",padding:"sm",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm font-semibold",children:"Session keys"}),e.jsxs("p",{className:"text-sm opacity-80",children:["A ",e.jsx("code",{children:"liquid-glass"})," variant blends into the panel it lives in, while ",e.jsx("code",{children:"plain"})," has no card of its own and inherits the surface — including its copy colours."]}),e.jsx(i,{text:b,tone:"emerald",variant:"liquid-glass",padding:"sm"}),e.jsx(i,{title:"Plain, always-visible children below",text:b,tone:"emerald",variant:"plain",children:e.jsxs("span",{children:["Extra content passed as ",e.jsx("code",{children:"children"})," — always visible, whether or not the summary is expanded."]})})]})})})})}const ie=`import { CollapsibleHelpText, Panel } from "@cjlapao/ui-kit";

const COPY =
  "Session keys rotate every 30 days. After a rotation, older sessions keep working until they expire, so no one is signed out mid-task.";

export default function InsideGlassPanel() {
  return (
    <div className="w-full">
      <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
        <Panel variant="liquid-glass" tone="emerald" padding="sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold">Session keys</p>
            <p className="text-sm opacity-80">
              A <code>liquid-glass</code> variant blends into the panel it
              lives in, while <code>plain</code> has no card of its own and
              inherits the surface — including its copy colours.
            </p>
            <CollapsibleHelpText
              text={COPY}
              tone="emerald"
              variant="liquid-glass"
              padding="sm"
            />
            <CollapsibleHelpText
              title="Plain, always-visible children below"
              text={COPY}
              tone="emerald"
              variant="plain"
            >
              <span>
                Extra content passed as <code>children</code> — always visible,
                whether or not the summary is expanded.
              </span>
            </CollapsibleHelpText>
          </div>
        </Panel>
      </div>
    </div>
  );
}
`,he=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(q,{name:"Collapsible Help Text",description:"Inline helper copy that truncates to a word-boundary summary and expands for more context. Renders a Panel, so it takes every container surface — including `raisedSurface` (forces the first nested-panels depth step — the tinted-card-on-matching-background fix) — plus a `plain` variant for no card at all."}),e.jsx(J,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Review question",description:"The canonical case: a title, an icon, and copy long enough to truncate. The summary cuts on a word boundary; the chevron toggles the full text.",code:ee,filename:"ReviewQuestion.tsx",children:e.jsx(Z,{})}),e.jsx(c,{title:"All surfaces",description:"Every variant — the eight Panel surfaces, the `card` alias of `outlined`, and `plain`, which has no card of its own.",code:te,filename:"Surfaces.tsx",children:e.jsx(ae,{})}),e.jsx(c,{title:"Inside a glass panel",description:"A `liquid-glass` variant blends into the panel it lives in, and `plain` inherits the surface — including its copy colours. `children` stay visible whether or not the summary is expanded.",code:ie,filename:"InsideGlassPanel.tsx",children:e.jsx(le,{})})]})]});export{he as CollapsibleHelpTextPage,he as default};
