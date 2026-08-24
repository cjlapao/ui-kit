import{r as n,D as Y,j as e,g as l,M as i,P as W}from"./index-B-ieYLXc.js";import{P as E,S as c,C as t,T as o,a as V,E as u}from"./PlaygroundPanel-CkWfNJii.js";import{l as q,t as L,p as _,d as z,i as F,j as M,k as Q}from"./options-C8y5quvx.js";const $=["glass","liquid-glass","default"],D="We encrypt your API tokens client-side using the session keys you configure here.",K="We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.",U=()=>{const[a,k]=n.useState("card"),[p,j]=n.useState("emerald"),[x,C]=n.useState(Y),[h,P]=n.useState("sm"),[m,N]=n.useState(!0),[g,S]=n.useState(!0),[r,T]=n.useState(!0),[f,O]=n.useState(!1),[d,A]=n.useState(130),[v,H]=n.useState("classic"),[y,I]=n.useState("medium"),[w,G]=n.useState("frosted"),R=$.includes(a);return e.jsx(E,{controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Variant",options:q,value:a,onChange:s=>k(s)}),e.jsx(c,{label:"Tone",options:L,value:p,onChange:s=>j(s)}),e.jsx(c,{label:"Corner",options:_,value:x,onChange:s=>C(s)}),e.jsx(t,{label:"Padding",children:e.jsx(i,{fullWidth:!0,size:"sm",options:z,value:h,onChange:s=>P(s)})}),e.jsx(t,{label:`Max length — ${d} characters`,children:e.jsx("input",{type:"range",min:40,max:340,value:d,onChange:s=>A(Number(s.target.value)),className:"w-full accent-blue-500"})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(o,{label:"Title",checked:g,onChange:S}),e.jsx(o,{label:"Icon",checked:m,onChange:N}),e.jsx(o,{label:"Long copy",checked:r,onChange:T}),e.jsx(o,{label:"Extra children",checked:f,onChange:O})]}),R&&e.jsxs(e.Fragment,{children:[e.jsx(t,{label:"Specular",children:e.jsx(i,{fullWidth:!0,size:"sm",options:F,value:v,onChange:s=>H(s)})}),e.jsx(t,{label:"Vibrancy",children:e.jsx(i,{fullWidth:!0,size:"sm",options:M,value:y,onChange:s=>I(s)})}),e.jsx(t,{label:"Glass opacity",children:e.jsx(i,{fullWidth:!0,size:"sm",options:Q,value:w,onChange:s=>G(s)})})]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(l,{title:g?r?"Why we ask for reviews":"Secret tokens":void 0,text:r?K:D,showIcon:m,tone:p,variant:a,corner:x,padding:h,maxLength:d,glassOpacity:w,vibrancy:y,specularMode:v,children:f?e.jsxs("span",{children:["Extra content passed as ",e.jsx("code",{children:"children"})," — always visible, whether or not the summary is expanded."]}):void 0})})})})},B="We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.";function J(){return e.jsx("div",{className:"w-full max-w-2xl",children:e.jsx(l,{title:"Why we ask for reviews",text:B,showIcon:!0,tone:"emerald",variant:"card"})})}const X=`import { CollapsibleHelpText } from "@cjlapao/ui-kit";

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
`,Z=["card","elevated","outlined","subtle","tonal","default","glass","liquid-glass","simple","plain"],ee="We encrypt your API tokens client-side using the session keys you configure here. Keys never leave your browser in clear text.";function se(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:Z.map(a=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:a}),e.jsx(l,{text:ee,tone:"emerald",variant:a,padding:"sm"})]},a))})}const ne=`import { CollapsibleHelpText } from "@cjlapao/ui-kit";
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
`,b="Session keys rotate every 30 days. After a rotation, older sessions keep working until they expire, so no one is signed out mid-task.";function ae(){return e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(W,{variant:"liquid-glass",tone:"emerald",padding:"sm",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm font-semibold",children:"Session keys"}),e.jsxs("p",{className:"text-sm opacity-80",children:["A ",e.jsx("code",{children:"liquid-glass"})," variant blends into the panel it lives in, while ",e.jsx("code",{children:"plain"})," has no card of its own and inherits the surface — including its copy colours."]}),e.jsx(l,{text:b,tone:"emerald",variant:"liquid-glass",padding:"sm"}),e.jsx(l,{title:"Plain, always-visible children below",text:b,tone:"emerald",variant:"plain",children:e.jsxs("span",{children:["Extra content passed as ",e.jsx("code",{children:"children"})," — always visible, whether or not the summary is expanded."]})})]})})})})}const te=`import { CollapsibleHelpText, Panel } from "@cjlapao/ui-kit";

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
`,re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(V,{name:"Collapsible Help Text",description:"Inline helper copy that truncates to a word-boundary summary and expands for more context. Renders a Panel, so it takes every container surface — plus a `plain` variant for no card at all."}),e.jsx(U,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(u,{title:"Review question",description:"The canonical case: a title, an icon, and copy long enough to truncate. The summary cuts on a word boundary; the chevron toggles the full text.",code:X,filename:"ReviewQuestion.tsx",children:e.jsx(J,{})}),e.jsx(u,{title:"All surfaces",description:"Every variant — the eight Panel surfaces, the `card` alias of `outlined`, and `plain`, which has no card of its own.",code:ne,filename:"Surfaces.tsx",children:e.jsx(se,{})}),e.jsx(u,{title:"Inside a glass panel",description:"A `liquid-glass` variant blends into the panel it lives in, and `plain` inherits the surface — including its copy colours. `children` stay visible whether or not the summary is expanded.",code:te,filename:"InsideGlassPanel.tsx",children:e.jsx(ae,{})})]})]});export{re as CollapsibleHelpTextPage,re as default};
