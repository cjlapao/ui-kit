import{r as n,n as I,j as e,eU as o,cB as P,eV as O}from"./index-gt012o8E.js";import{P as _}from"./PageHeader-CzVhyXQL.js";import{E as d}from"./ExampleCard-V3REeYJ5.js";import{P as z,S as r,a as K,T as a}from"./PlaygroundPanel-Czrs7oXC.js";import{C as V}from"./ControlAccordion-DIXHht2n.js";import{bg as q,bh as F,d as D,a0 as B,p as Y,f as L}from"./options-CtADNKbm.js";const M=()=>{const[t,i]=n.useState("unknown"),[p,b]=n.useState("outlined"),[u,v]=n.useState("md"),[l,k]=n.useState(""),[h,j]=n.useState(I),[g,S]=n.useState("lg"),[x,R]=n.useState(!0),[m,E]=n.useState(!1),[y,A]=n.useState(!0),[f,T]=n.useState(!0),[w,C]=n.useState(!0),[c,N]=n.useState(!0);return e.jsx(z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(V,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Kind",options:q,value:t,onChange:s=>i(s)}),e.jsx(r,{label:"Variant",options:F,value:p,onChange:s=>b(s)}),e.jsx(r,{label:"Size",options:D,value:u,onChange:s=>v(s)}),e.jsx(r,{label:"Tone override",options:[{label:"From the kind",value:""},...B],value:l,onChange:s=>k(s)}),e.jsx(r,{label:"Corner",options:Y,value:h,onChange:s=>j(s)}),e.jsx(r,{label:"Padding",options:L,value:g,onChange:s=>S(s)})]})},{id:"states",title:"States",controls:e.jsx(K,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(a,{label:"Retry button",checked:x,onChange:R}),e.jsx(a,{label:"Retrying",checked:m,onChange:E}),e.jsx(a,{label:"Dashed rule",checked:y,onChange:A}),e.jsx(a,{label:"Icon",checked:f,onChange:T}),e.jsx(a,{label:"Icon disc",checked:w,onChange:C}),e.jsx(a,{label:"Is error",checked:c,onChange:N})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Kind"})," picks the tone, the glyph and the copy from one table — anything you state explicitly still wins, which is what the tone override shows. ",e.jsx("strong",{children:"Retrying"})," spins the button and blocks it, so a slow request cannot be fired twice."," ",e.jsx("strong",{children:"Is error"})," renders nothing at all, for a call site that would otherwise need a ternary."]})]}),preview:e.jsxs("div",{className:"w-full",children:[e.jsx(o,{kind:t,variant:p,size:u,tone:l===""?void 0:l,corner:h,padding:g,dashed:y,showIcon:f,iconBackground:w,isError:c,retrying:m,onRetry:x?()=>{}:void 0}),!c&&e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Nothing rendered — `isError` is false."})]})})};function U(){return e.jsx("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:P.map(t=>e.jsx(o,{kind:t,size:"sm",onRetry:t==="forbidden"||t==="notFound"?void 0:()=>{}},t))})}const W=`import { API_ERROR_KINDS, ApiErrorState } from "@cjlapao/ui-kit";

/**
 * \`kind\` is what actually went wrong, and it picks the tone, the glyph and the
 * copy from one table — the same reasoning as \`Alert\`'s \`intent\`. Every caller
 * translating a status code into a colour *and* an icon *and* two strings is
 * how one screen ends up saying "Connection Error" for a 403.
 *
 * It also decides whether a retry is offered at all: a refusal does not clear
 * by pressing a button, so \`forbidden\` and \`notFound\` get no retry here.
 */
export default function Kinds() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      {API_ERROR_KINDS.map((kind) => (
        <ApiErrorState
          key={kind}
          kind={kind}
          size="sm"
          onRetry={
            kind === "forbidden" || kind === "notFound"
              ? undefined
              : () => {}
          }
        />
      ))}
    </div>
  );
}
`;function H(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(o,{kind:"forbidden",size:"sm",tone:"violet",icon:"Key",title:"Workspace locked",subtitle:"Ask an owner to grant you access to this workspace.",buttonText:"Request access",onRetry:()=>{}}),e.jsx(o,{kind:"rateLimited",size:"sm",variant:"tonal",dashed:!1,title:"Slow down",subtitle:"You've made too many requests. Try again in about a minute."})]})}const G=`import { ApiErrorState } from "@cjlapao/ui-kit";

/**
 * Everything the kind decides is a *default*. \`tone\`, \`icon\`, \`title\` and
 * \`subtitle\` are ordinary props — they used to be hardcoded and hidden behind
 * the wrapper, so a permission error had to be painted rose and drawn as a
 * disconnected cloud.
 */
export default function Overrides() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <ApiErrorState
        kind="forbidden"
        size="sm"
        tone="violet"
        icon="Key"
        title="Workspace locked"
        subtitle="Ask an owner to grant you access to this workspace."
        buttonText="Request access"
        onRetry={() => {}}
      />
      <ApiErrorState
        kind="rateLimited"
        size="sm"
        variant="tonal"
        dashed={false}
        title="Slow down"
        subtitle="You've made too many requests. Try again in about a minute."
      />
    </div>
  );
}
`;function J(){const[t,i]=n.useState(!1);return e.jsx(o,{kind:"server",retrying:t,buttonText:"Try again",onRetry:()=>{i(!0),setTimeout(()=>i(!1),2e3)}})}const Q=`import { useState } from "react";
import { ApiErrorState } from "@cjlapao/ui-kit";

/**
 * \`retrying\` puts the button in its loading state and blocks it, so a slow
 * request cannot be fired twice by an impatient second press.
 */
export default function Retry() {
  const [retrying, setRetrying] = useState(false);

  return (
    <ApiErrorState
      kind="server"
      retrying={retrying}
      buttonText="Try again"
      onRetry={() => {
        setRetrying(true);
        setTimeout(() => setRetrying(false), 2000);
      }}
    />
  );
}
`;function X(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:O.map(t=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),e.jsx(o,{variant:t,kind:"server",size:"xs",subtitle:"The server couldn't complete the request.",onRetry:()=>{}})]},t))})}const Z=`import { EMPTY_STATE_VARIANTS, ApiErrorState } from "@cjlapao/ui-kit";

/**
 * It renders \`EmptyState\`, so it inherits every container surface plus
 * \`plain\` — for an error dropped inside a card the app already owns.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {EMPTY_STATE_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {variant}
          </span>
          <ApiErrorState
            variant={variant}
            kind="server"
            size="xs"
            subtitle="The server couldn't complete the request."
            onRetry={() => {}}
          />
        </div>
      ))}
    </div>
  );
}
`,ae=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"API Error State",description:"The failure twin of Empty State: the same surfaces, sizes and tones, with the copy and the glyph chosen from what actually went wrong. A `kind` resolves the tone, the icon, the wording and whether retrying is even worth offering — and anything you state explicitly still wins."}),e.jsx(M,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Kinds",description:"`kind` is what went wrong, and it picks the tone, the glyph and the copy from one table — the same reasoning as `Alert`'s `intent`. It also decides whether a retry is offered: a refusal does not clear by pressing a button, so `forbidden` and `notFound` get none.",code:W,filename:"Kinds.tsx",children:e.jsx(U,{})}),e.jsx(d,{title:"Overrides",description:"Everything the kind decides is a default. `tone`, `icon`, `title` and `subtitle` are ordinary props — they used to be hardcoded and hidden behind the wrapper, so a permission error had to be painted rose and drawn as a disconnected cloud.",code:G,filename:"Overrides.tsx",children:e.jsx(H,{})}),e.jsx(d,{title:"Retrying",description:"`retrying` puts the action in its loading state and blocks it, so a slow request cannot be fired twice by an impatient second press.",code:Q,filename:"Retry.tsx",children:e.jsx(J,{})}),e.jsx(d,{title:"Variants",description:"It renders `EmptyState`, so it inherits every container surface plus `plain` — for an error dropped inside a card the app already owns, which used to need `disableBorder` and `transparentBackground` set together.",code:Z,filename:"Variants.tsx",children:e.jsx(X,{})})]})]});export{ae as ApiErrorStatePage,ae as default};
