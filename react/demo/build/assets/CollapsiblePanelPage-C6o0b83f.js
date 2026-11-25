import{r as a,a1 as _,j as e,a4 as c,B as u,h as H}from"./index-CQwZVYnB.js";import{P as F}from"./PageHeader-BhZxEVHt.js";import{E as p}from"./ExampleCard-BZsKA5_g.js";import{A as G,a as h,C as n,b as $,K as z,P as M}from"./A11ySections-BXfanEck.js";import{a as V}from"./SurfaceToneControl-LH37fS9y.js";import{P as U,C as i,a as K,T as r}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as q}from"./ControlAccordion-C7vC6faF.js";import{s as W,f as J,p as Q,A as X,B as Y,C as Z}from"./options-Byh1yOHz.js";const ee=["glass","liquid-glass","default"],ne=Array.from({length:14},(s,t)=>`[12:0${t%10}:31] step ${t+1} — pulling layer sha256:${(t*7919).toString(16).padStart(6,"0")}`),te=()=>{const[s,t]=a.useState("elevated"),[l,g]=a.useState("none"),[d,N]=a.useState(_),[x,E]=a.useState("sm"),[m,P]=a.useState(!1),[b,f]=a.useState(!0),[y,T]=a.useState(!1),[j,A]=a.useState(!0),[v,L]=a.useState(!0),[C,O]=a.useState(!1),[w,B]=a.useState("classic"),[S,I]=a.useState("medium"),[k,R]=a.useState("frosted"),D=ee.includes(s);return e.jsx(U,{controls:e.jsx(q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Variant",options:W,value:s,onChange:o=>t(o)}),e.jsx(K,{label:"Tone",children:e.jsx(V,{value:l,onSelect:g})}),e.jsx(i,{label:"Corner",options:J,value:d,onChange:o=>N(o)}),e.jsx(i,{label:"Padding",options:Q,value:x,onChange:o=>E(o)}),e.jsx(r,{label:"Raised surface",checked:m,onChange:P})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(r,{label:"Expanded",checked:b,onChange:f}),e.jsx(r,{label:"Disabled",checked:y,onChange:T}),e.jsx(r,{label:"Header action",checked:j,onChange:A}),e.jsx(r,{label:"Subtitle",checked:v,onChange:L}),e.jsx(r,{label:"Long content",checked:C,onChange:O})]})},...D?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",options:X,value:w,onChange:o=>B(o)}),e.jsx(i,{label:"Vibrancy",options:Y,value:S,onChange:o=>I(o)}),e.jsx(i,{label:"Glass opacity",options:Z,value:k,onChange:o=>R(o)})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(c,{title:"Deployment logs",subtitle:v?"Last updated 5 minutes ago":void 0,actions:j?e.jsx(u,{size:"xs",variant:"ghost",color:H(l),children:"Refresh"}):void 0,expanded:b,onToggle:f,disabled:y,variant:s,tone:l,corner:d,padding:x,raisedSurface:m,glassOpacity:k,vibrancy:S,specularMode:w,children:C?e.jsx("pre",{className:"whitespace-pre-wrap font-mono text-xs",children:ne.join(`
`)}):e.jsx("p",{children:"Showing the latest deployment output. Errors and status logs appear here while we run automated checks against the new release."})})})})},ae=Array.from({length:14},(s,t)=>`[12:0${t%10}:31] step ${t+1} — pulling layer sha256:${(t*7919).toString(16).padStart(6,"0")}`);function se(){return e.jsx("div",{className:"w-full",children:e.jsx(c,{title:"Deployment logs",subtitle:"Last updated 5 minutes ago",defaultExpanded:!0,actions:e.jsx(u,{size:"xs",variant:"ghost",color:"neutral",children:"Copy logs"}),children:e.jsx("pre",{className:"whitespace-pre-wrap font-mono text-xs",children:ae.join(`
`)})})})}const oe=`import { Button, CollapsiblePanel } from "@cjlapao/ui-kit";

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
`;function le(){return e.jsx("div",{className:"w-full",children:e.jsx(c,{title:"Build configuration",subtitle:"3 overrides",defaultExpanded:!1,children:e.jsxs("p",{children:["An uncontrolled panel, driven by ",e.jsx("code",{children:"defaultExpanded"})," — it starts collapsed and opens when the header is clicked."]})})})}const ie=`import { CollapsiblePanel } from "@cjlapao/ui-kit";

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
`,re=[{title:"Authentication",subtitle:"OAuth 2.0 · PKCE",body:"Tokens are exchanged at the redirect URI and refreshed silently in the background."},{title:"Billing",subtitle:"Card on file",body:"Invoices are issued on the 1st of each month. Prorations apply on plan changes."},{title:"Danger zone",subtitle:"Irreversible",body:"Deleting the workspace removes all repositories, issues and billing history."}];function de(){return e.jsx("div",{className:"flex w-full flex-col gap-3",children:re.map((s,t)=>e.jsx(c,{title:s.title,subtitle:s.subtitle,defaultExpanded:t===0,children:e.jsx("p",{children:s.body})},s.title))})}const ce=`import { CollapsiblePanel } from "@cjlapao/ui-kit";

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
`;function pe(){const[s,t]=a.useState(!0);return e.jsxs("div",{className:"w-full space-y-4",children:[e.jsx(u,{size:"sm",variant:"outline",onClick:()=>t(l=>!l),children:s?"Collapse overflowing content":"Expand overflowing content"}),e.jsx(c,{title:"Scrollable task lists",subtitle:"40 items across two nested scroll areas",expanded:s,onToggle:t,contentMaxHeight:180,minExpandedHeight:100,children:e.jsx("div",{className:"space-y-4",children:["Build tasks","Review tasks"].map(l=>e.jsxs("section",{className:"space-y-2",children:[e.jsx("h3",{className:"font-semibold",children:l}),e.jsx("div",{tabIndex:0,role:"region","aria-label":l,className:"max-h-40 overflow-y-auto rounded-md border border-neutral-200 dark:border-neutral-700",children:Array.from({length:20},(g,d)=>e.jsxs("div",{className:"border-b border-neutral-100 px-3 py-2 last:border-b-0 dark:border-neutral-800",children:[l," · item ",d+1]},d))})]},l))})}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"This marker should move upward immediately when collapsing. The panel should never grow to reveal all items first."})]})}const he=`import { useState } from "react";
import { Button, CollapsiblePanel } from "@cjlapao/ui-kit";

export default function OverflowCollapse() {
  const [expanded, setExpanded] = useState(true);

  return <div className="w-full space-y-4">
    <Button size="sm" variant="outline" onClick={() => setExpanded(value => !value)}>
      {expanded ? "Collapse overflowing content" : "Expand overflowing content"}
    </Button>
    <CollapsiblePanel title="Scrollable task lists" subtitle="40 items across two nested scroll areas"
      expanded={expanded} onToggle={setExpanded} contentMaxHeight={180} minExpandedHeight={100}>
      <div className="space-y-4">
        {["Build tasks", "Review tasks"].map(section => <section key={section} className="space-y-2">
          <h3 className="font-semibold">{section}</h3>
          <div tabIndex={0} role="region" aria-label={section}
            className="max-h-40 overflow-y-auto rounded-md border border-neutral-200 dark:border-neutral-700">
            {Array.from({ length: 20 }, (_, index) => <div key={index}
              className="border-b border-neutral-100 px-3 py-2 last:border-b-0 dark:border-neutral-800">
              {section} · item {index + 1}
            </div>)}
          </div>
        </section>)}
      </div>
    </CollapsiblePanel>
    <p className="text-xs text-neutral-500 dark:text-neutral-400">
      This marker should move upward immediately when collapsing. The panel should never grow to reveal all items first.
    </p>
  </div>;
}
`,Ce=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(F,{name:"Collapsible Panel",description:"Accordion-style panel built on Panel, so it takes every container surface, tone, corner and padding — and the container standard for its defaults: elevated, tone blue, sm padding, medium corner. Controlled or uncontrolled, with a header action, a scrollable content cap and independent ids per panel."}),e.jsx(te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Collapse overflowing content",description:"Two nested scroll areas inside a body capped at 180px. Scroll the lists, then collapse using the header or external button. The panel should shrink directly without first expanding to its full content height.",code:he,filename:"OverflowCollapse.tsx",children:e.jsx(pe,{})}),e.jsx(p,{title:"Deployment logs",description:"An open panel with a subtitle and a header action. The log output exceeds `contentMaxHeight`, so the body scrolls instead of growing.",code:oe,filename:"DeploymentLogs.tsx",children:e.jsx(se,{})}),e.jsx(p,{title:"Build configuration",description:"Uncontrolled and collapsed: `defaultExpanded` sets the starting state, and each panel keeps its own ids, so several can coexist.",code:ie,filename:"BuildConfiguration.tsx",children:e.jsx(le,{})}),e.jsx(p,{title:"Accordion",description:"Three uncontrolled panels stacked — each toggles independently, and their header ids stay distinct.",code:ce,filename:"Accordion.tsx",children:e.jsx(de,{})})]}),e.jsxs(G,{children:[e.jsxs(h,{title:"Screen reader",children:[e.jsxs("p",{children:["The header is a ",e.jsx(n,{children:'role="button"'})," element (not a native"," ",e.jsx(n,{children:"<button>"}),", because header actions may contain buttons — nesting those would be invalid markup) carrying"," ",e.jsx(n,{children:"aria-expanded"})," and ",e.jsx(n,{children:"aria-controls"})," into the content. Its accessible name is computed from the header content — title, subtitle, even the action labels — so when the title is anything richer than a string, or actions sit in the header, pass"," ",e.jsx(n,{children:"headerLabel"})," to say the name plainly. The content is a"," ",e.jsx(n,{children:'role="region"'})," labelled by the header, so it is discoverable by landmark navigation; while collapsed it is ",e.jsx(n,{children:"inert"})," and"," ",e.jsx(n,{children:"aria-hidden"})," rather than ",e.jsx(n,{children:"hidden"})," — not announced, not focusable, yet still able to animate open. Ids come from"," ",e.jsx(n,{children:"useId"}),", so any number of panels can coexist on one page without their ",e.jsx(n,{children:"aria-controls"})," crossing wires."]}),e.jsx($,{filename:"Naming.tsx",code:ue})]}),e.jsxs(h,{title:"Keyboard support",children:[e.jsxs("p",{children:["The header is a real tab stop (removed from the order when"," ",e.jsx(n,{children:"disabled"}),"). Its Enter/Space handling fires only when the header itself is focused — key events from header actions are stopped one element earlier, so activating a button never double-toggles the panel. Once expanded, header actions and the content pick up their own tab stops; collapsed content is ",e.jsx(n,{children:"inert"})," and skipped entirely."]}),e.jsx(z,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Moves focus to the header."})},{keys:["enter"],action:e.jsx(e.Fragment,{children:"Toggles the panel while the header is focused."})},{keys:["space"],action:e.jsx(e.Fragment,{children:"Toggles too — and prevents the page scroll it would otherwise cause."})}]})]}),e.jsx(h,{title:"Internationalization",children:e.jsxs("p",{children:["The component speaks no strings of its own: ",e.jsx(n,{children:"title"}),","," ",e.jsx(n,{children:"subtitle"}),", ",e.jsx(n,{children:"actions"})," and ",e.jsx(n,{children:"headerLabel"})," are all yours to feed from your translations — ",e.jsx(n,{children:"headerLabel"})," is the one to localise the region's name with, since the region is announced by it. The chevron is an ",e.jsx(n,{children:"aria-hidden"})," arrow that rotates down/up rather than flipping, so it needs no RTL mirroring; text direction otherwise follows the document."]})})]}),e.jsx(M,{props:[{name:"title",type:"ReactNode",description:"Header line. Required — it forms the region's accessible name together with the subtitle, unless headerLabel overrides."},{name:"subtitle",type:"ReactNode",description:"Second header line, in muted copy."},{name:"actions",type:"ReactNode",description:"Right of the header, before the chevron. Clicks and key presses inside it do not toggle the panel."},{name:"headerLabel",type:"string",description:"Accessible name of the header. Use it when title is not a plain string or actions sit in the header."},{name:"defaultExpanded",type:"boolean",default:"false",description:"Starting state, uncontrolled."},{name:"expanded",type:"boolean",description:"Controlled mode — pass it and the component stops keeping its own state."},{name:"onToggle",type:"(expanded: boolean) => void",description:"Fires after every toggle, controlled or not."},{name:"children",type:"ReactNode",description:"The content. Announced as a region labelled by the header."},{name:"contentMaxHeight",type:"number",default:"320",description:"Content grows to here, then scrolls. Never exceeds 65vh."},{name:"minExpandedHeight",type:"number | string",description:"Floor for the content while expanded."},{name:"fillHeight",type:"boolean",default:"false",description:"Expanded content stretches to fill the available height instead of scrolling."},{name:"contentClassName",type:"string",description:"Extra classes on the content box."},{name:"disabled",type:"boolean",default:"false",description:"Toggling off, header out of the tab order, aria-disabled on."},{name:"loading",type:"boolean",default:"false",description:"The Panel skeleton over the card."},{name:"…Panel props",type:"PanelProps",description:"variant, tone, padding, corner, className and the rest forward to the underlying Panel — standing on the container standard: elevated, tone blue, sm padding, medium corner."},{name:"raisedSurface",type:"boolean",default:"false",description:"Forces the underlying Panel's first nested-panels depth step — the tinted-card-on-matching-background fix."}]})]}),ue=`// The plain case — the header names itself from its content.
<CollapsiblePanel title="Deployment logs">
  <LogOutput />
</CollapsiblePanel>

// A rich title or header actions muddy the computed name —
// say it plainly.
<CollapsiblePanel
  title={<span>Logs <Badge>3 errors</Badge></span>}
  headerLabel="Deployment logs"
  actions={<Button onClick={refresh}>Refresh</Button>}
>
  <LogOutput />
</CollapsiblePanel>
`;export{Ce as CollapsiblePanelPage,Ce as default};
