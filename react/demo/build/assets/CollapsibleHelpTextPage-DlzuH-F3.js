import{r as n,D as Y,j as e,g as l,M as i,P as W}from"./index-Bw7SVFgV.js";import{P as E}from"./PageHeader-CQm-NnZo.js";import{E as c}from"./ExampleCard-BR4461qP.js";import{P as V,S as u,C as t,T as o}from"./PlaygroundPanel-efOYSasM.js";import{C as q}from"./ControlAccordion-BDKCdIsF.js";import{m as L,t as F,p as _,e as z,j as M,k as Q,l as $}from"./options-CREM8uYu.js";const D=["glass","liquid-glass","default"],K="We encrypt your API tokens client-side using the session keys you configure here.",U="We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.",B=()=>{const[a,k]=n.useState("card"),[p,j]=n.useState("emerald"),[x,C]=n.useState(Y),[m,P]=n.useState("sm"),[h,N]=n.useState(!0),[g,S]=n.useState(!0),[r,T]=n.useState(!0),[f,O]=n.useState(!1),[d,A]=n.useState(130),[v,H]=n.useState("classic"),[y,I]=n.useState("medium"),[w,G]=n.useState("frosted"),R=D.includes(a);return e.jsx(V,{controls:e.jsx(q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Variant",options:L,value:a,onChange:s=>k(s)}),e.jsx(u,{label:"Tone",options:F,value:p,onChange:s=>j(s)}),e.jsx(u,{label:"Corner",options:_,value:x,onChange:s=>C(s)}),e.jsx(t,{label:"Padding",children:e.jsx(i,{fullWidth:!0,size:"sm",options:z,value:m,onChange:s=>P(s)})})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(t,{label:`Max length — ${d} characters`,children:e.jsx("input",{type:"range",min:40,max:340,value:d,onChange:s=>A(Number(s.target.value)),className:"w-full accent-blue-500"})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(o,{label:"Title",checked:g,onChange:S}),e.jsx(o,{label:"Icon",checked:h,onChange:N}),e.jsx(o,{label:"Long copy",checked:r,onChange:T}),e.jsx(o,{label:"Extra children",checked:f,onChange:O})]})]})},...R?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(t,{label:"Specular",children:e.jsx(i,{fullWidth:!0,size:"sm",options:M,value:v,onChange:s=>H(s)})}),e.jsx(t,{label:"Vibrancy",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Q,value:y,onChange:s=>I(s)})}),e.jsx(t,{label:"Glass opacity",children:e.jsx(i,{fullWidth:!0,size:"sm",options:$,value:w,onChange:s=>G(s)})})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(l,{title:g?r?"Why we ask for reviews":"Secret tokens":void 0,text:r?U:K,showIcon:h,tone:p,variant:a,corner:x,padding:m,maxLength:d,glassOpacity:w,vibrancy:y,specularMode:v,children:f?e.jsxs("span",{children:["Extra content passed as ",e.jsx("code",{children:"children"})," — always visible, whether or not the summary is expanded."]}):void 0})})})})},J="We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.";function X(){return e.jsx("div",{className:"w-full max-w-2xl",children:e.jsx(l,{title:"Why we ask for reviews",text:J,showIcon:!0,tone:"emerald",variant:"card"})})}const Z=`import { CollapsibleHelpText } from "@cjlapao/ui-kit";

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
`,ee=["card","elevated","outlined","subtle","tonal","default","glass","liquid-glass","simple","plain"],se="We encrypt your API tokens client-side using the session keys you configure here. Keys never leave your browser in clear text.";function ne(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:ee.map(a=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:a}),e.jsx(l,{text:se,tone:"emerald",variant:a,padding:"sm"})]},a))})}const ae=`import { CollapsibleHelpText } from "@cjlapao/ui-kit";
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
`,b="Session keys rotate every 30 days. After a rotation, older sessions keep working until they expire, so no one is signed out mid-task.";function te(){return e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(W,{variant:"liquid-glass",tone:"emerald",padding:"sm",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm font-semibold",children:"Session keys"}),e.jsxs("p",{className:"text-sm opacity-80",children:["A ",e.jsx("code",{children:"liquid-glass"})," variant blends into the panel it lives in, while ",e.jsx("code",{children:"plain"})," has no card of its own and inherits the surface — including its copy colours."]}),e.jsx(l,{text:b,tone:"emerald",variant:"liquid-glass",padding:"sm"}),e.jsx(l,{title:"Plain, always-visible children below",text:b,tone:"emerald",variant:"plain",children:e.jsxs("span",{children:["Extra content passed as ",e.jsx("code",{children:"children"})," — always visible, whether or not the summary is expanded."]})})]})})})})}const le=`import { CollapsibleHelpText, Panel } from "@cjlapao/ui-kit";

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
`,pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(E,{name:"Collapsible Help Text",description:"Inline helper copy that truncates to a word-boundary summary and expands for more context. Renders a Panel, so it takes every container surface — plus a `plain` variant for no card at all."}),e.jsx(B,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Review question",description:"The canonical case: a title, an icon, and copy long enough to truncate. The summary cuts on a word boundary; the chevron toggles the full text.",code:Z,filename:"ReviewQuestion.tsx",children:e.jsx(X,{})}),e.jsx(c,{title:"All surfaces",description:"Every variant — the eight Panel surfaces, the `card` alias of `outlined`, and `plain`, which has no card of its own.",code:ae,filename:"Surfaces.tsx",children:e.jsx(ne,{})}),e.jsx(c,{title:"Inside a glass panel",description:"A `liquid-glass` variant blends into the panel it lives in, and `plain` inherits the surface — including its copy colours. `children` stay visible whether or not the summary is expanded.",code:le,filename:"InsideGlassPanel.tsx",children:e.jsx(te,{})})]})]});export{pe as CollapsibleHelpTextPage,pe as default};
