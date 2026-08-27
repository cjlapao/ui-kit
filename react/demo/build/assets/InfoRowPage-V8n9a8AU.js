import{r as a,j as e,P as r,o as F}from"./index-BBK6HA-D.js";import{P as Z}from"./PageHeader-BcBcU29I.js";import{E as d}from"./ExampleCard-BVwGIEPO.js";import{a$ as n,b0 as M,t as G,n as $,e as q,p as J,b1 as K,b2 as Q}from"./options-D-FMIizr.js";import{P as U,C as X,S as i,a as I,T as t}from"./ControlAccordion-DallGojj.js";const Y="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",ee=()=>{const[o,S]=a.useState("plain"),[u,N]=a.useState("blue"),[p,k]=a.useState("md"),[c,P]=a.useState("auto"),[h,T]=a.useState("rounded-xl"),[f,E]=a.useState("skeleton"),[m,O]=a.useState(!0),[g,z]=a.useState(!1),[x,V]=a.useState(!1),[b,A]=a.useState(!1),[v,L]=a.useState(!1),[w,_]=a.useState(!1),[j,B]=a.useState(!1),[y,D]=a.useState(!1),[R,W]=a.useState(!1),[C,H]=a.useState(!1);return e.jsx(U,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(X,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Variant",options:M,value:o,onChange:s=>S(s)}),e.jsx(i,{label:"Tone",options:G,value:u,onChange:s=>N(s)}),e.jsx(i,{label:"Size",options:$,value:p,onChange:s=>k(s)}),e.jsx(i,{label:"Padding",options:[{label:"auto (from size)",value:"auto"},...q],value:c,onChange:s=>P(s)}),e.jsx(i,{label:"Corner",options:J,value:h,onChange:s=>T(s)}),e.jsx(i,{label:"Loader",options:K,value:f,onChange:s=>E(s)})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(I,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(t,{label:"Copyable",checked:m,onChange:O}),e.jsx(t,{label:"Mono",checked:g,onChange:z}),e.jsx(t,{label:"Wrap",checked:x,onChange:V}),e.jsx(t,{label:"Hoverable",checked:b,onChange:A}),e.jsx(t,{label:"No border",checked:v,onChange:L})]})})},{id:"states",title:"States",controls:e.jsx(I,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(t,{label:"Loading",checked:w,onChange:_}),e.jsx(t,{label:"Error",checked:j,onChange:B}),e.jsx(t,{label:"Long value",checked:y,onChange:D}),e.jsx(t,{label:"Empty value",checked:R,onChange:W}),e.jsx(t,{label:"Hide if empty",checked:C,onChange:H})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["A ",e.jsx("code",{children:"plain"})," row is its own root element, so the hairline's"," ",e.jsx("code",{children:"last:border-0"})," still matches among siblings. Any other variant wraps the row in a ",e.jsx("code",{children:"Panel"}),". Turn on"," ",e.jsx("strong",{children:"Long value"})," and hover or tab to the value to see the truncation tooltip — it is portaled, so a scrolling panel cannot clip it."]})]}),preview:e.jsx("div",{className:"w-full max-w-xl",children:e.jsx(r,{variant:"outlined",padding:"sm",children:["Image digest","Region","Replicas"].map((s,l)=>e.jsx(n,{label:s,value:R&&l===0?"":y&&l===0?Y:l===0?"sha256:9f86d0":l===1?"eu-west-1":3,variant:o,tone:u,size:p,padding:c==="auto"?void 0:c,corner:h,copyable:m,mono:g,wrap:x,hoverable:b,noBorder:v,loading:w&&l===0,loaderType:f,error:j&&l===0?"Registry unreachable":void 0,hideIfEmpty:C},s))})})})};function ae(){return e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:Q.map(o=>e.jsx(n,{variant:o,tone:"violet",label:o,value:"eu-west-1"},o))})}const ne=`import { INFO_ROW_VARIANTS, InfoRow } from "@cjlapao/ui-kit";

/**
 * \`plain\` draws no surface of its own — just the hairline — which is what a row
 * inside a card the app already owns wants. Every other member renders a
 * \`Panel\`, so the row can also stand on its own.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {INFO_ROW_VARIANTS.map((variant) => (
        <InfoRow
          key={variant}
          variant={variant}
          tone="violet"
          label={variant}
          value="eu-west-1"
        />
      ))}
    </div>
  );
}
`;function oe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:F.map(o=>e.jsxs(r,{variant:"outlined",padding:"sm",children:[e.jsx(n,{label:"Size",value:o,size:o}),e.jsx(n,{label:"Region",value:"eu-west-1",size:o}),e.jsx(n,{label:"Replicas",value:3,size:o})]},o))})}const se=`import { CONTROL_SIZES, InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. The component used to declare its own
 * \`xs | sm | md | lg\`, so it could not be set to \`xl\` beside an \`xl\` Button.
 */
export default function Sizes() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {CONTROL_SIZES.map((size) => (
        <Panel key={size} variant="outlined" padding="sm">
          <InfoRow label="Size" value={size} size={size} />
          <InfoRow label="Region" value="eu-west-1" size={size} />
          <InfoRow label="Replicas" value={3} size={size} />
        </Panel>
      ))}
    </div>
  );
}
`;function te(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs(r,{variant:"outlined",padding:"sm",children:[e.jsx(n,{label:"Digest",loading:!0,loaderType:"skeleton"}),e.jsx(n,{label:"Region",loading:!0,loaderType:"spinner"}),e.jsx(n,{label:"Replicas",value:3})]}),e.jsxs(r,{variant:"outlined",padding:"sm",children:[e.jsx(n,{label:"Digest",error:"Registry unreachable"}),e.jsx(n,{label:"Region",value:"",hideIfEmpty:!1}),e.jsx(n,{label:"Replicas",value:3})]})]})}const le=`import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * A row that is still loading, or that failed, has something to say even with
 * no value — so \`hideIfEmpty\` no longer wins over either. An error is
 * announced politely rather than left as an "—" indistinguishable from a value
 * that is genuinely empty.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Panel variant="outlined" padding="sm">
        <InfoRow label="Digest" loading loaderType="skeleton" />
        <InfoRow label="Region" loading loaderType="spinner" />
        <InfoRow label="Replicas" value={3} />
      </Panel>
      <Panel variant="outlined" padding="sm">
        <InfoRow label="Digest" error="Registry unreachable" />
        <InfoRow label="Region" value="" hideIfEmpty={false} />
        <InfoRow label="Replicas" value={3} />
      </Panel>
    </div>
  );
}
`;function ie(){return e.jsxs(r,{variant:"outlined",padding:"sm",className:"w-full",children:[e.jsx(n,{label:"Digest",mono:!0,value:"sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",onCopy:o=>console.log("copied",o.slice(0,12))}),e.jsx(n,{label:"Endpoint",value:"https://api.example.com/v1/capsules",mono:!0}),e.jsx(n,{label:"Verified",value:!0}),e.jsx(n,{label:"Notes",value:e.jsx("em",{children:"rendered node — no copy button"})})]})}const re=`import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The copy button is a real \`IconButton\`, so it carries the kit's focus ring
 * and hit area. It is revealed on hover *and* on keyboard focus — an
 * \`opacity-0\` button is still in the tab order, so a keyboard user used to land
 * on something invisible.
 *
 * A missing clipboard (any non-secure context) and a rejected write (the
 * document is not focused — very ordinary) both report a failure now instead
 * of throwing or leaving an unhandled rejection.
 */
export default function Copy() {
  return (
    <Panel variant="outlined" padding="sm" className="w-full">
      <InfoRow
        label="Digest"
        mono
        value="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
        onCopy={(text) => console.log("copied", text.slice(0, 12))}
      />
      <InfoRow label="Endpoint" value="https://api.example.com/v1/capsules" mono />
      <InfoRow label="Verified" value={true} />
      <InfoRow label="Notes" value={<em>rendered node — no copy button</em>} />
    </Panel>
  );
}
`,fe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Z,{name:"Info Row",description:"One label/value line in a details panel — with copy-to-clipboard, a tooltip when the value is truncated, and loading, empty and error states. Its copy colour and hairline come from the surface it sits on, so a row on glass reads as well as one on a white card."}),e.jsx(ee,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Variants",description:"`plain` is the default and draws no surface of its own — and stays the root element, so the hairline's `last:border-0` still matches among sibling rows. Every other member renders a `Panel`.",code:ne,filename:"Variants.tsx",children:e.jsx(ae,{})}),e.jsx(d,{title:"Sizes",description:"The full shared control scale. The component declared its own `xs | sm | md | lg`, so it could not be set to `xl` beside an `xl` Button — and `padding` had its own eight-member list where the kit has six.",code:se,filename:"Sizes.tsx",children:e.jsx(oe,{})}),e.jsx(d,{title:"Loading, empty and error",description:"A row that is loading or has failed stays visible even with no value — `hideIfEmpty` used to win over both, so a panel visibly jumped as values arrived. The skeleton bar is sized from the row's own scale.",code:le,filename:"States.tsx",children:e.jsx(te,{})}),e.jsx(d,{title:"Copy and truncation",description:"Copy is a real `IconButton`, revealed on hover and on keyboard focus. A missing clipboard or a rejected write reports a failure instead of throwing. The truncation tooltip is the shared portaled `TooltipWrapper`, so a scrolling panel cannot clip it — and it now answers to focus, not just to a pointer.",code:re,filename:"Copy.tsx",children:e.jsx(ie,{})})]})]});export{fe as InfoRowPage,fe as default};
