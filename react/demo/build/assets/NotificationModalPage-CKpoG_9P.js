import{u as k,j as e,hm as y,B as d,eA as b,n as O,r as s}from"./index-dkEsqyUy.js";import{P as E}from"./PageHeader-Cqxw9jAs.js";import{E as I}from"./ExampleCard-SmeeyhOh.js";import{S as P}from"./SurfaceToneControl-CptLUoZR.js";import{P as A,S as x,C as M,T as B}from"./PlaygroundPanel-CD4VThIT.js";import{C as F}from"./ControlAccordion-BM7PEMt8.js";import{s as W,t as V}from"./options-DH3jBuHJ.js";const T=["success","error","warning","info"],j={success:{icon:"CheckCircle",tone:"emerald"},error:{icon:"Error",tone:"rose"},warning:{icon:"Warning",tone:"amber"},info:{icon:"Info",tone:"blue"}},Y=({children:n})=>{const t=b();return e.jsx("div",{className:O("text-sm",t.body),children:n})},C=({isOpen:n,onClose:t,title:o,message:u,type:f="info",actionLabel:r,onAction:i,secondaryActionLabel:l,onSecondaryAction:c,icon:h,tone:p,surfaceTone:m="none",size:a="sm",...N})=>{const v=k(),g=j[f]??j.info,S=p??g.tone,w=()=>{i?i():t()};return e.jsx(y,{...N,isOpen:n,onClose:t,title:o,size:a,tone:m,icon:h??g.icon,actions:e.jsxs(y.Actions,{children:[l&&e.jsx(d,{variant:"soft",color:"slate",onClick:c||t,children:l}),e.jsx(d,{onClick:w,color:S,children:r??v("kit.notificationmodal.action")})]}),children:e.jsx(Y,{children:u})})},_=T.map(n=>({label:n,value:n})),R=()=>{const[n,t]=s.useState("elevated"),[o,u]=s.useState("none"),[f,r]=s.useState(!1),[i,l]=s.useState("info"),[c,h]=s.useState(""),[p,m]=s.useState(!1);return e.jsx(A,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(F,{groups:[{id:"options",title:"Options",controls:e.jsxs(e.Fragment,{children:[e.jsx(P,{label:"Surface tone",value:o,onChange:u}),e.jsx(x,{label:"Surface variant",options:W,value:n,onChange:a=>t(a)}),e.jsx(x,{label:"Type",options:_,value:i,onChange:a=>l(a)}),e.jsx(x,{label:"Tone override",options:[{label:"(from type)",value:""},...V],value:c,onChange:a=>h(a)}),e.jsx(M,{label:"Actions",children:e.jsx(B,{label:"Secondary action",checked:p,onChange:m})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{children:"error"})," and ",e.jsx("code",{children:"warning"})," now use different glyphs — both mapped to ",e.jsx("code",{children:"Warning"}),", so a failure and a caution were indistinguishable. The message takes its colour from the surface; it was a bare ",e.jsx("code",{children:"text-gray-600"})," with no dark-mode partner."]})]}),preview:e.jsxs(e.Fragment,{children:[e.jsx(d,{onClick:()=>r(!0),children:"Open notification"}),e.jsx(C,{surfaceTone:o,variant:n,isOpen:f,onClose:()=>r(!1),type:i,tone:c||void 0,title:"Deployment finished",message:"All three capsules are running in eu-west-1.",secondaryActionLabel:p?"View logs":void 0})]})})};function $(){const[n,t]=s.useState(null);return e.jsxs("div",{className:"flex flex-wrap gap-2",children:[T.map(o=>e.jsx(d,{variant:"soft",onClick:()=>t(o),children:o},o)),n&&e.jsx(C,{isOpen:!0,onClose:()=>t(null),type:n,title:`This is a ${n} notification`,message:"The message takes its colour from the surface it sits on."})]})}const D=`import { useState } from "react";
import { NotificationModal, NOTIFICATION_TYPES, Button } from "@cjlapao/ui-kit";
import type { NotificationType } from "@cjlapao/ui-kit";

/**
 * Each type picks a glyph and a tone. \`error\` and \`warning\` used to share the
 * \`Warning\` glyph, so a failure and a caution looked identical.
 *
 * Note: the kit's shared severity vocabulary is \`AlertIntent\`
 * (\`info | success | warning | danger | neutral\`); this component predates it
 * and ships \`error\` rather than \`danger\`.
 */
export default function Types() {
  const [open, setOpen] = useState<NotificationType | null>(null);
  return (
    <div className="flex flex-wrap gap-2">
      {NOTIFICATION_TYPES.map((type) => (
        <Button key={type} variant="soft" onClick={() => setOpen(type)}>
          {type}
        </Button>
      ))}
      {open && (
        <NotificationModal
          isOpen
          onClose={() => setOpen(null)}
          type={open}
          title={\`This is a \${open} notification\`}
          message="The message takes its colour from the surface it sits on."
        />
      )}
    </div>
  );
}
`,Q=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(E,{name:"Notification Modal",description:"A small Modal for a single outcome — a glyph, a title, a message and one or two actions. The type picks the glyph and tone; both are overridable, and the rest of Modal's props pass through."}),e.jsx(R,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(I,{title:"Every type",description:"error and warning now use different glyphs — both mapped to Warning, so a failure and a caution were indistinguishable at a glance.",code:D,filename:"Types.tsx",children:e.jsx($,{})})]})]});export{Q as NotificationModalPage,Q as default};
