import{r as t,D as B,j as e,h as r,e as S,M as o}from"./index-8i9ZNynb.js";import{P as _}from"./PageHeader-CO5k_SQv.js";import{E as c}from"./ExampleCard-LdxcpmX_.js";import{P as $,S as p,C as i,T as a}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as z}from"./ControlAccordion-Bqp-1oBj.js";import{d as G,t as R,p as V,e as W,j as M,k as U,l as F}from"./options-yAU-f7tt.js";const H=["glass","liquid-glass","default"],K=Array.from({length:14},(l,s)=>`[12:0${s%10}:31] step ${s+1} — pulling layer sha256:${(s*7919).toString(16).padStart(6,"0")}`),q=()=>{const[l,s]=t.useState("elevated"),[d,w]=t.useState("neutral"),[u,E]=t.useState(B),[h,P]=t.useState("md"),[g,x]=t.useState(!0),[f,k]=t.useState(!1),[m,N]=t.useState(!0),[b,A]=t.useState(!0),[j,O]=t.useState(!1),[C,L]=t.useState("classic"),[y,D]=t.useState("medium"),[v,T]=t.useState("frosted"),I=H.includes(l);return e.jsx($,{controls:e.jsx(z,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Variant",options:G,value:l,onChange:n=>s(n)}),e.jsx(p,{label:"Tone",options:R,value:d,onChange:n=>w(n)}),e.jsx(p,{label:"Corner",options:V,value:u,onChange:n=>E(n)}),e.jsx(i,{label:"Padding",children:e.jsx(o,{fullWidth:!0,size:"sm",options:W,value:h,onChange:n=>P(n)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(a,{label:"Expanded",checked:g,onChange:x}),e.jsx(a,{label:"Disabled",checked:f,onChange:k}),e.jsx(a,{label:"Header action",checked:m,onChange:N}),e.jsx(a,{label:"Subtitle",checked:b,onChange:A}),e.jsx(a,{label:"Long content",checked:j,onChange:O})]})},...I?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",children:e.jsx(o,{fullWidth:!0,size:"sm",options:M,value:C,onChange:n=>L(n)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(o,{fullWidth:!0,size:"sm",options:U,value:y,onChange:n=>D(n)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(o,{fullWidth:!0,size:"sm",options:F,value:v,onChange:n=>T(n)})})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(r,{title:"Deployment logs",subtitle:b?"Last updated 5 minutes ago":void 0,actions:m?e.jsx(S,{size:"xs",variant:"ghost",color:d,children:"Refresh"}):void 0,expanded:g,onToggle:x,disabled:f,variant:l,tone:d,corner:u,padding:h,glassOpacity:v,vibrancy:y,specularMode:C,children:j?e.jsx("pre",{className:"whitespace-pre-wrap font-mono text-xs",children:K.join(`
`)}):e.jsx("p",{children:"Showing the latest deployment output. Errors and status logs appear here while we run automated checks against the new release."})})})})})},J=Array.from({length:14},(l,s)=>`[12:0${s%10}:31] step ${s+1} — pulling layer sha256:${(s*7919).toString(16).padStart(6,"0")}`);function Q(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{title:"Deployment logs",subtitle:"Last updated 5 minutes ago",defaultExpanded:!0,actions:e.jsx(S,{size:"xs",variant:"ghost",color:"neutral",children:"Copy logs"}),children:e.jsx("pre",{className:"whitespace-pre-wrap font-mono text-xs",children:J.join(`
`)})})})}const X=`import { Button, CollapsiblePanel } from "@cjlapao/ui-kit";

const LOG_LINES = Array.from(
  { length: 14 },
  (_, index) =>
    \`[12:0\${index % 10}:31] step \${index + 1} — pulling layer sha256:\${(
      index * 7919
    )
      .toString(16)
      .padStart(6, "0")}\`,
);

export default function DeploymentLogs() {
  return (
    <div className="w-full">
      <CollapsiblePanel
        title="Deployment logs"
        subtitle="Last updated 5 minutes ago"
        defaultExpanded
        actions={
          <Button size="xs" variant="ghost" color="neutral">
            Copy logs
          </Button>
        }
      >
        <pre className="whitespace-pre-wrap font-mono text-xs">
          {LOG_LINES.join("\\n")}
        </pre>
      </CollapsiblePanel>
    </div>
  );
}
`;function Y(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{title:"Build configuration",subtitle:"3 overrides",defaultExpanded:!1,children:e.jsxs("p",{children:["An uncontrolled panel, driven by ",e.jsx("code",{children:"defaultExpanded"})," — it starts collapsed and opens when the header is clicked."]})})})}const Z=`import { CollapsiblePanel } from "@cjlapao/ui-kit";

export default function BuildConfiguration() {
  return (
    <div className="w-full">
      <CollapsiblePanel
        title="Build configuration"
        subtitle="3 overrides"
        defaultExpanded={false}
      >
        <p>
          An uncontrolled panel, driven by <code>defaultExpanded</code> — it
          starts collapsed and opens when the header is clicked.
        </p>
      </CollapsiblePanel>
    </div>
  );
}
`,ee=[{title:"Authentication",subtitle:"OAuth 2.0 · PKCE",body:"Tokens are exchanged at the redirect URI and refreshed silently in the background."},{title:"Billing",subtitle:"Card on file",body:"Invoices are issued on the 1st of each month. Prorations apply on plan changes."},{title:"Danger zone",subtitle:"Irreversible",body:"Deleting the workspace removes all repositories, issues and billing history."}];function ne(){return e.jsx("div",{className:"flex w-full flex-col gap-3",children:ee.map((l,s)=>e.jsx(r,{title:l.title,subtitle:l.subtitle,defaultExpanded:s===0,children:e.jsx("p",{children:l.body})},l.title))})}const te=`import { CollapsiblePanel } from "@cjlapao/ui-kit";

const SECTIONS: { title: string; subtitle: string; body: string }[] = [
  {
    title: "Authentication",
    subtitle: "OAuth 2.0 · PKCE",
    body: "Tokens are exchanged at the redirect URI and refreshed silently in the background.",
  },
  {
    title: "Billing",
    subtitle: "Card on file",
    body: "Invoices are issued on the 1st of each month. Prorations apply on plan changes.",
  },
  {
    title: "Danger zone",
    subtitle: "Irreversible",
    body: "Deleting the workspace removes all repositories, issues and billing history.",
  },
];

export default function Accordion() {
  return (
    <div className="flex w-full flex-col gap-3">
      {SECTIONS.map((section, index) => (
        <CollapsiblePanel
          key={section.title}
          title={section.title}
          subtitle={section.subtitle}
          defaultExpanded={index === 0}
        >
          <p>{section.body}</p>
        </CollapsiblePanel>
      ))}
    </div>
  );
}
`,de=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Collapsible Panel",description:"Accordion-style panel built on Panel, so it takes every container surface, tone, corner and padding. Controlled or uncontrolled, with a header action, a scrollable content cap and independent ids per panel."}),e.jsx(q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Deployment logs",description:"An open panel with a subtitle and a header action. The log output exceeds `contentMaxHeight`, so the body scrolls instead of growing.",code:X,filename:"DeploymentLogs.tsx",children:e.jsx(Q,{})}),e.jsx(c,{title:"Build configuration",description:"Uncontrolled and collapsed: `defaultExpanded` sets the starting state, and each panel keeps its own ids, so several can coexist.",code:Z,filename:"BuildConfiguration.tsx",children:e.jsx(Y,{})}),e.jsx(c,{title:"Accordion",description:"Three uncontrolled panels stacked — each toggles independently, and their header ids stay distinct.",code:te,filename:"Accordion.tsx",children:e.jsx(ne,{})})]})]});export{de as CollapsiblePanelPage,de as default};
