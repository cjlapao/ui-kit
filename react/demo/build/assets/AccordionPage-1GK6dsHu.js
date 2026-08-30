import{r as t,D as B,u as O,j as e,e as T,A as p,M as a}from"./index-p9Bv1Pn1.js";import{P as Q}from"./PageHeader-DCZtzAyX.js";import{E as b}from"./ExampleCard-BS13YSEO.js";import{P as Y,S as y,C as i,T as l}from"./PlaygroundPanel-BDClNSzf.js";import{C as $}from"./ControlAccordion-CydkdljU.js";import{d as J,t as K,p as X,e as Z,n as ee,j as ne,k as te,l as se}from"./options-Bqu3_N-h.js";const ae=["glass","liquid-glass","default"],ie=[{label:"Chevron",value:"chevron"},{label:"Plus/Minus",value:"plus-minus"},{label:"None",value:"none"}],oe=[{label:"Left",value:"left"},{label:"Right",value:"right"}],le=[{id:"region-us",title:"United States",subtitle:"us-east-1 · N. Virginia",description:"Low latency for east coast workloads.",badge:"Primary",content:"Availability zones: 3 — average latency 22 ms. GPU instances and spot capacity are available."},{id:"region-eu",title:"Europe",subtitle:"eu-central-1 · Frankfurt",description:"Ideal for GDPR-compliant workloads.",badge:"High demand",content:"Availability zones: 2 — average latency 39 ms. Maintenance window Sundays 02:00–04:00 CET."},{id:"region-apac",title:"Asia Pacific",subtitle:"ap-southeast-1 · Singapore",description:"Great for APAC users and low-latency APIs.",badge:"New",content:"Availability zones: 3 — average latency 55 ms. Dedicated bare-metal hosts available on request."}],re=()=>{const[r,c]=t.useState("elevated"),[o,g]=t.useState("neutral"),[s,d]=t.useState(B),[u,z]=t.useState("md"),[x,E]=t.useState("md"),[v,G]=t.useState("chevron"),[j,R]=t.useState("right"),[h,q]=t.useState(!1),[w,D]=t.useState(!0),[S,L]=t.useState(!1),[m,F]=t.useState(!0),[A,M]=t.useState(!0),[k,f]=t.useState(!1),[C,W]=t.useState("classic"),[I,U]=t.useState("medium"),[P,V]=t.useState("frosted"),N=O({defaultOpenIds:["region-us"],multiple:h}),H=ae.includes(r),_=le.map(n=>({id:n.id,title:n.title,subtitle:n.subtitle,description:n.description,icon:m?"Globe":void 0,badge:m?n.badge:void 0,content:e.jsx("p",{children:n.content}),actions:A&&n.id==="region-us"?e.jsx(T,{size:"xs",variant:"ghost",color:o,onClick:()=>{f(!0),setTimeout(()=>f(!1),1200)},children:"Refresh"}):void 0}));return e.jsx(Y,{controls:e.jsx($,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(y,{label:"Variant",options:J,value:r,onChange:n=>c(n)}),e.jsx(y,{label:"Tone",options:K,value:o,onChange:n=>g(n)}),e.jsx(y,{label:"Corner",options:X,value:s,onChange:n=>d(n)}),e.jsx(i,{label:"Padding",children:e.jsx(a,{fullWidth:!0,size:"sm",options:Z,value:u,onChange:n=>z(n)})}),e.jsx(i,{label:"Size",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ee,value:x,onChange:n=>E(n)})}),e.jsx(i,{label:"Indicator",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ie,value:v,onChange:n=>G(n)})}),e.jsx(i,{label:"Indicator placement",children:e.jsx(a,{fullWidth:!0,size:"sm",options:oe,value:j,onChange:n=>R(n)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(l,{label:"Multiple open",checked:h,onChange:q}),e.jsx(l,{label:"Animated",checked:w,onChange:D}),e.jsx(l,{label:"Disabled",checked:S,onChange:L}),e.jsx(l,{label:"Icons and badges",checked:m,onChange:F}),e.jsx(l,{label:"Header action",checked:A,onChange:M}),e.jsx(l,{label:"Loading",checked:k,onChange:f})]})},...H?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ne,value:C,onChange:n=>W(n)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(a,{fullWidth:!0,size:"sm",options:te,value:I,onChange:n=>U(n)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(a,{fullWidth:!0,size:"sm",options:se,value:P,onChange:n=>V(n)})})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(p,{items:_,variant:r,tone:o,corner:s,padding:u,size:x,indicator:v,indicatorPlacement:j,multiple:h,animated:w,disabled:S,loading:k,openIds:N.openIds,onChange:N.setOpenIds,glassOpacity:P,vibrancy:I,specularMode:C,ariaLabel:"Cloud regions"})})})})},de=[{id:"region-us",title:"United States",subtitle:"us-east-1 · N. Virginia",description:"Low latency for east coast workloads.",badge:"Primary",content:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{children:["Availability zones: ",e.jsx("strong",{children:"3"})]}),e.jsx("p",{children:"Average latency: 22 ms"}),e.jsxs("ul",{className:"list-disc pl-5",children:[e.jsx("li",{children:"GPU instances available"}),e.jsx("li",{children:"Supports spot capacity"})]})]})},{id:"region-eu",title:"Europe",subtitle:"eu-central-1 · Frankfurt",description:"Ideal for GDPR-compliant workloads.",badge:"High demand",content:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{children:"Availability zones: 2"}),e.jsx("p",{children:"Average latency: 39 ms"}),e.jsx("p",{children:"Maintenance window: Sundays 02:00–04:00 CET"})]})},{id:"region-apac",title:"Asia Pacific",subtitle:"ap-southeast-1 · Singapore",description:"Great for APAC users and low-latency APIs.",content:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{children:"Availability zones: 3"}),e.jsx("p",{children:"Average latency: 55 ms"}),e.jsx("p",{children:"Dedicated bare-metal hosts available on request."})]})}];function ce(){const[r,c]=t.useState([]),o=O({defaultOpenIds:["region-us"],multiple:!0}),g=s=>{c(d=>[...d,s]),setTimeout(()=>{c(d=>d.filter(u=>u!==s))},1500)};return e.jsx(p,{tone:"blue",size:"sm",items:de.map(s=>({...s,icon:"Globe",content:s.content,actions:s.id==="region-us"?e.jsx(T,{size:"xs",variant:"ghost",color:"blue",onClick:()=>g(s.id),children:"Refresh"}):void 0,loading:r.includes(s.id)})),openIds:o.openIds,onChange:o.setOpenIds,ariaLabel:"Cloud regions"})}const ue=`import { useState } from "react";
import { Accordion, Button, useAccordion } from "@cjlapao/ui-kit";

const REGIONS = [
  {
    id: "region-us",
    title: "United States",
    subtitle: "us-east-1 · N. Virginia",
    description: "Low latency for east coast workloads.",
    badge: "Primary",
    content: (
      <div className="space-y-2">
        <p>
          Availability zones: <strong>3</strong>
        </p>
        <p>Average latency: 22 ms</p>
        <ul className="list-disc pl-5">
          <li>GPU instances available</li>
          <li>Supports spot capacity</li>
        </ul>
      </div>
    ),
  },
  {
    id: "region-eu",
    title: "Europe",
    subtitle: "eu-central-1 · Frankfurt",
    description: "Ideal for GDPR-compliant workloads.",
    badge: "High demand",
    content: (
      <div className="space-y-2">
        <p>Availability zones: 2</p>
        <p>Average latency: 39 ms</p>
        <p>Maintenance window: Sundays 02:00–04:00 CET</p>
      </div>
    ),
  },
  {
    id: "region-apac",
    title: "Asia Pacific",
    subtitle: "ap-southeast-1 · Singapore",
    description: "Great for APAC users and low-latency APIs.",
    content: (
      <div className="space-y-2">
        <p>Availability zones: 3</p>
        <p>Average latency: 55 ms</p>
        <p>Dedicated bare-metal hosts available on request.</p>
      </div>
    ),
  },
];

export default function CloudRegions() {
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const accordion = useAccordion({
    defaultOpenIds: ["region-us"],
    multiple: true,
  });

  const refresh = (id: string) => {
    setLoadingIds((ids) => [...ids, id]);
    setTimeout(() => {
      setLoadingIds((ids) => ids.filter((item) => item !== id));
    }, 1500);
  };

  return (
    <Accordion
      tone="blue"
      size="sm"
      items={REGIONS.map((region) => ({
        ...region,
        icon: "Globe",
        content: region.content,
        actions: region.id === "region-us" ? (
          <Button
            size="xs"
            variant="ghost"
            color="blue"
            onClick={() => refresh(region.id)}
          >
            Refresh
          </Button>
        ) : undefined,
        loading: loadingIds.includes(region.id),
      }))}
      openIds={accordion.openIds}
      onChange={accordion.setOpenIds}
      ariaLabel="Cloud regions"
    />
  );
}
`,pe=[{id:"q-1",title:"How do billing cycles work?",content:"Invoices are issued on the 1st of each month. Prorations apply automatically when you change plans mid-cycle."},{id:"q-2",title:"Can I change regions later?",content:"Yes. Workloads can be migrated between regions from the console. Data is replicated during the migration window."},{id:"q-3",title:"What happens when a region is down?",content:"Requests are rerouted to the nearest healthy region automatically. A status incident is opened and tracked here."},{id:"q-4",title:"Do you offer a free tier?",content:"New workspaces get 30 days of the Pro plan. After that you can stay on the free tier or upgrade."}];function ge(){return e.jsx(p,{variant:"outlined",size:"md",defaultOpenIds:["q-1"],items:pe,ariaLabel:"Frequently asked questions"})}const he=`import { Accordion } from "@cjlapao/ui-kit";

const QUESTIONS = [
  {
    id: "q-1",
    title: "How do billing cycles work?",
    content:
      "Invoices are issued on the 1st of each month. Prorations apply automatically when you change plans mid-cycle.",
  },
  {
    id: "q-2",
    title: "Can I change regions later?",
    content:
      "Yes. Workloads can be migrated between regions from the console. Data is replicated during the migration window.",
  },
  {
    id: "q-3",
    title: "What happens when a region is down?",
    content:
      "Requests are rerouted to the nearest healthy region automatically. A status incident is opened and tracked here.",
  },
  {
    id: "q-4",
    title: "Do you offer a free tier?",
    content:
      "New workspaces get 30 days of the Pro plan. After that you can stay on the free tier or upgrade.",
  },
];

export default function Faq() {
  return (
    <Accordion
      variant="outlined"
      size="md"
      defaultOpenIds={["q-1"]}
      items={QUESTIONS}
      ariaLabel="Frequently asked questions"
    />
  );
}
`,me=[{id:"appearance",title:"Appearance",subtitle:"Theme, density, fonts",content:"Choose light or dark, set the interface density, and preview font pairing. Changes apply instantly."},{id:"notifications",title:"Notifications",subtitle:"Email, in-app, digest",content:"Decide what lands in your inbox and what stays in-app. Daily digest by default, real-time optional."},{id:"security",title:"Security",subtitle:"2FA, sessions, API keys",content:"Manage two-factor authentication, active sessions and API keys. Revoking a key is immediate."}];function fe(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-200 via-sky-100 to-rose-200 p-4 dark:from-indigo-950 dark:via-slate-950 dark:to-rose-950",children:e.jsx(p,{variant:"glass",tone:"indigo",padding:"sm",defaultOpenIds:["appearance"],items:me,ariaLabel:"Settings"})})}const be=`import { Accordion } from "@cjlapao/ui-kit";

const SETTINGS = [
  {
    id: "appearance",
    title: "Appearance",
    subtitle: "Theme, density, fonts",
    content:
      "Choose light or dark, set the interface density, and preview font pairing. Changes apply instantly.",
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Email, in-app, digest",
    content:
      "Decide what lands in your inbox and what stays in-app. Daily digest by default, real-time optional.",
  },
  {
    id: "security",
    title: "Security",
    subtitle: "2FA, sessions, API keys",
    content:
      "Manage two-factor authentication, active sessions and API keys. Revoking a key is immediate.",
  },
];

export default function GlassSettings() {
  return (
    <div className="w-full rounded-lg bg-gradient-to-br from-indigo-200 via-sky-100 to-rose-200 p-4 dark:from-indigo-950 dark:via-slate-950 dark:to-rose-950">
      <Accordion
        variant="glass"
        tone="indigo"
        padding="sm"
        defaultOpenIds={["appearance"]}
        items={SETTINGS}
        ariaLabel="Settings"
      />
    </div>
  );
}
`,Ae=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Q,{name:"Accordion",description:"A stacked disclosure list built on Panel — every container surface, tone, corner and padding, on the shared control size. Independent ids per instance, inert collapsed content, arrow-key navigation and per-row loaders."}),e.jsx(re,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Cloud regions",description:"Dense rows with icons, badges and a per-row refresh action. The action's click never toggles the row, and the row shows its own loader while it refreshes.",code:ue,filename:"CloudRegions.tsx",children:e.jsx(ce,{})}),e.jsx(b,{title:"Faq",description:"Plain rows in the outlined surface — one open by default, the rest collapsed and inert.",code:he,filename:"Faq.tsx",children:e.jsx(ge,{})}),e.jsx(b,{title:"Glass settings",description:"A glass accordion over a busy backdrop: the surface tints with the tone and the copy keeps its contrast from the surface's text tokens.",code:be,filename:"GlassSettings.tsx",children:e.jsx(fe,{})})]})]});export{Ae as AccordionPage,Ae as default};
