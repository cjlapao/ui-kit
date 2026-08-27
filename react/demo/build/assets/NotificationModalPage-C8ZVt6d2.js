import{j as e,bv as h,e as c,a5 as k,a7 as v,r as i}from"./index-BBK6HA-D.js";import{P as b}from"./PageHeader-BcBcU29I.js";import{E as O}from"./ExampleCard-BVwGIEPO.js";import{P as S,C as E,S as x,a as I,T as P}from"./ControlAccordion-DallGojj.js";import{t as M}from"./options-D-FMIizr.js";const g=["success","error","warning","info"],m={success:{icon:"CheckCircle",tone:"emerald"},error:{icon:"Error",tone:"rose"},warning:{icon:"Warning",tone:"amber"},info:{icon:"Info",tone:"blue"}},A=({children:n})=>{const t=k();return e.jsx("div",{className:v("text-sm",t.body),children:n})},y=({isOpen:n,onClose:t,title:o,message:d,type:r="info",actionLabel:p="Close",onAction:s,secondaryActionLabel:l,onSecondaryAction:a,icon:j,tone:T,size:N="sm",...w})=>{const u=m[r]??m.info,f=T??u.tone,C=()=>{s?s():t()};return e.jsx(h,{...w,isOpen:n,onClose:t,title:o,size:N,tone:f,icon:j??u.icon,actions:e.jsxs(h.Actions,{children:[l&&e.jsx(c,{variant:"soft",color:"slate",onClick:a||t,children:l}),e.jsx(c,{onClick:C,color:f,children:p})]}),children:e.jsx(A,{children:d})})},F=g.map(n=>({label:n,value:n})),B=()=>{const[n,t]=i.useState(!1),[o,d]=i.useState("info"),[r,p]=i.useState(""),[s,l]=i.useState(!1);return e.jsx(S,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(E,{groups:[{id:"options",title:"Options",controls:e.jsxs(e.Fragment,{children:[e.jsx(x,{label:"Type",options:F,value:o,onChange:a=>d(a)}),e.jsx(x,{label:"Tone override",options:[{label:"(from type)",value:""},...M],value:r,onChange:a=>p(a)}),e.jsx(I,{label:"Actions",children:e.jsx(P,{label:"Secondary action",checked:s,onChange:l})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{children:"error"})," and ",e.jsx("code",{children:"warning"})," now use different glyphs — both mapped to ",e.jsx("code",{children:"Warning"}),", so a failure and a caution were indistinguishable. The message takes its colour from the surface; it was a bare ",e.jsx("code",{children:"text-gray-600"})," with no dark-mode partner."]})]}),preview:e.jsxs(e.Fragment,{children:[e.jsx(c,{onClick:()=>t(!0),children:"Open notification"}),e.jsx(y,{isOpen:n,onClose:()=>t(!1),type:o,tone:r||void 0,title:"Deployment finished",message:"All three capsules are running in eu-west-1.",secondaryActionLabel:s?"View logs":void 0})]})})};function W(){const[n,t]=i.useState(null);return e.jsxs("div",{className:"flex flex-wrap gap-2",children:[g.map(o=>e.jsx(c,{variant:"soft",onClick:()=>t(o),children:o},o)),n&&e.jsx(y,{isOpen:!0,onClose:()=>t(null),type:n,title:`This is a ${n} notification`,message:"The message takes its colour from the surface it sits on."})]})}const Y=`import { useState } from "react";
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
`,H=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(b,{name:"Notification Modal",description:"A small Modal for a single outcome — a glyph, a title, a message and one or two actions. The type picks the glyph and tone; both are overridable, and the rest of Modal's props pass through."}),e.jsx(B,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(O,{title:"Every type",description:"error and warning now use different glyphs — both mapped to Warning, so a failure and a caution were indistinguishable at a glance.",code:Y,filename:"Types.tsx",children:e.jsx(W,{})})]})]});export{H as NotificationModalPage,H as default};
