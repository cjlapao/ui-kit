import{r as t,D as R,j as e,m as r,i as w,C as B}from"./index-gt012o8E.js";import{P as _}from"./PageHeader-CzVhyXQL.js";import{E as c}from"./ExampleCard-V3REeYJ5.js";import{A as G,a as p,C as n,b as $,K as F,P as z}from"./A11ySections-zw3_3X-2.js";import{P as H,C as l,a as V,T as i}from"./PlaygroundPanel-Czrs7oXC.js";import{C as M}from"./ControlAccordion-DIXHht2n.js";import{e as U,p as K,f as q,l as W,m as J,n as Q}from"./options-CtADNKbm.js";const X=["glass","liquid-glass","default"],Y=Array.from({length:14},(o,a)=>`[12:0${a%10}:31] step ${a+1} — pulling layer sha256:${(a*7919).toString(16).padStart(6,"0")}`),Z=()=>{const[o,a]=t.useState("elevated"),[d,S]=t.useState("blue"),[h,P]=t.useState(R),[u,k]=t.useState("sm"),[g,x]=t.useState(!0),[m,E]=t.useState(!1),[b,N]=t.useState(!0),[f,A]=t.useState(!0),[y,T]=t.useState(!1),[j,L]=t.useState("classic"),[C,O]=t.useState("medium"),[v,I]=t.useState("frosted"),D=X.includes(o);return e.jsx(H,{controls:e.jsx(M,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Variant",options:U,value:o,onChange:s=>a(s)}),e.jsx(V,{label:"Tone",children:e.jsx(B,{selectable:!0,size:"sm",value:d,onSelect:S,defaultExpanded:!0})}),e.jsx(l,{label:"Corner",options:K,value:h,onChange:s=>P(s)}),e.jsx(l,{label:"Padding",options:q,value:u,onChange:s=>k(s)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(i,{label:"Expanded",checked:g,onChange:x}),e.jsx(i,{label:"Disabled",checked:m,onChange:E}),e.jsx(i,{label:"Header action",checked:b,onChange:N}),e.jsx(i,{label:"Subtitle",checked:f,onChange:A}),e.jsx(i,{label:"Long content",checked:y,onChange:T})]})},...D?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Specular",options:W,value:j,onChange:s=>L(s)}),e.jsx(l,{label:"Vibrancy",options:J,value:C,onChange:s=>O(s)}),e.jsx(l,{label:"Glass opacity",options:Q,value:v,onChange:s=>I(s)})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(r,{title:"Deployment logs",subtitle:f?"Last updated 5 minutes ago":void 0,actions:b?e.jsx(w,{size:"xs",variant:"ghost",color:d,children:"Refresh"}):void 0,expanded:g,onToggle:x,disabled:m,variant:o,tone:d,corner:h,padding:u,glassOpacity:v,vibrancy:C,specularMode:j,children:y?e.jsx("pre",{className:"whitespace-pre-wrap font-mono text-xs",children:Y.join(`
`)}):e.jsx("p",{children:"Showing the latest deployment output. Errors and status logs appear here while we run automated checks against the new release."})})})})},ee=Array.from({length:14},(o,a)=>`[12:0${a%10}:31] step ${a+1} — pulling layer sha256:${(a*7919).toString(16).padStart(6,"0")}`);function ne(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{title:"Deployment logs",subtitle:"Last updated 5 minutes ago",defaultExpanded:!0,actions:e.jsx(w,{size:"xs",variant:"ghost",color:"neutral",children:"Copy logs"}),children:e.jsx("pre",{className:"whitespace-pre-wrap font-mono text-xs",children:ee.join(`
`)})})})}const te=`import { Button, CollapsiblePanel } from "@cjlapao/ui-kit";

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
`;function ae(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{title:"Build configuration",subtitle:"3 overrides",defaultExpanded:!1,children:e.jsxs("p",{children:["An uncontrolled panel, driven by ",e.jsx("code",{children:"defaultExpanded"})," — it starts collapsed and opens when the header is clicked."]})})})}const se=`import { CollapsiblePanel } from "@cjlapao/ui-kit";

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
`,oe=[{title:"Authentication",subtitle:"OAuth 2.0 · PKCE",body:"Tokens are exchanged at the redirect URI and refreshed silently in the background."},{title:"Billing",subtitle:"Card on file",body:"Invoices are issued on the 1st of each month. Prorations apply on plan changes."},{title:"Danger zone",subtitle:"Irreversible",body:"Deleting the workspace removes all repositories, issues and billing history."}];function le(){return e.jsx("div",{className:"flex w-full flex-col gap-3",children:oe.map((o,a)=>e.jsx(r,{title:o.title,subtitle:o.subtitle,defaultExpanded:a===0,children:e.jsx("p",{children:o.body})},o.title))})}const ie=`import { CollapsiblePanel } from "@cjlapao/ui-kit";

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
`,me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Collapsible Panel",description:"Accordion-style panel built on Panel, so it takes every container surface, tone, corner and padding — and the container standard for its defaults: elevated, tone blue, sm padding, medium corner. Controlled or uncontrolled, with a header action, a scrollable content cap and independent ids per panel."}),e.jsx(Z,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Deployment logs",description:"An open panel with a subtitle and a header action. The log output exceeds `contentMaxHeight`, so the body scrolls instead of growing.",code:te,filename:"DeploymentLogs.tsx",children:e.jsx(ne,{})}),e.jsx(c,{title:"Build configuration",description:"Uncontrolled and collapsed: `defaultExpanded` sets the starting state, and each panel keeps its own ids, so several can coexist.",code:se,filename:"BuildConfiguration.tsx",children:e.jsx(ae,{})}),e.jsx(c,{title:"Accordion",description:"Three uncontrolled panels stacked — each toggles independently, and their header ids stay distinct.",code:ie,filename:"Accordion.tsx",children:e.jsx(le,{})})]}),e.jsxs(G,{children:[e.jsxs(p,{title:"Screen reader",children:[e.jsxs("p",{children:["The header is a ",e.jsx(n,{children:'role="button"'})," element (not a native"," ",e.jsx(n,{children:"<button>"}),", because header actions may contain buttons — nesting those would be invalid markup) carrying"," ",e.jsx(n,{children:"aria-expanded"})," and ",e.jsx(n,{children:"aria-controls"})," into the content. Its accessible name is computed from the header content — title, subtitle, even the action labels — so when the title is anything richer than a string, or actions sit in the header, pass"," ",e.jsx(n,{children:"headerLabel"})," to say the name plainly. The content is a"," ",e.jsx(n,{children:'role="region"'})," labelled by the header, so it is discoverable by landmark navigation; while collapsed it is ",e.jsx(n,{children:"inert"})," and"," ",e.jsx(n,{children:"aria-hidden"})," rather than ",e.jsx(n,{children:"hidden"})," — not announced, not focusable, yet still able to animate open. Ids come from"," ",e.jsx(n,{children:"useId"}),", so any number of panels can coexist on one page without their ",e.jsx(n,{children:"aria-controls"})," crossing wires."]}),e.jsx($,{filename:"Naming.tsx",code:re})]}),e.jsxs(p,{title:"Keyboard support",children:[e.jsxs("p",{children:["The header is a real tab stop (removed from the order when"," ",e.jsx(n,{children:"disabled"}),"). Its Enter/Space handling fires only when the header itself is focused — key events from header actions are stopped one element earlier, so activating a button never double-toggles the panel. Once expanded, header actions and the content pick up their own tab stops; collapsed content is ",e.jsx(n,{children:"inert"})," and skipped entirely."]}),e.jsx(F,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Moves focus to the header."})},{keys:["enter"],action:e.jsx(e.Fragment,{children:"Toggles the panel while the header is focused."})},{keys:["space"],action:e.jsx(e.Fragment,{children:"Toggles too — and prevents the page scroll it would otherwise cause."})}]})]}),e.jsx(p,{title:"Internationalization",children:e.jsxs("p",{children:["The component speaks no strings of its own: ",e.jsx(n,{children:"title"}),","," ",e.jsx(n,{children:"subtitle"}),", ",e.jsx(n,{children:"actions"})," and ",e.jsx(n,{children:"headerLabel"})," are all yours to feed from your translations — ",e.jsx(n,{children:"headerLabel"})," is the one to localise the region's name with, since the region is announced by it. The chevron is an ",e.jsx(n,{children:"aria-hidden"})," arrow that rotates down/up rather than flipping, so it needs no RTL mirroring; text direction otherwise follows the document."]})})]}),e.jsx(z,{props:[{name:"title",type:"ReactNode",description:"Header line. Required — it forms the region's accessible name together with the subtitle, unless headerLabel overrides."},{name:"subtitle",type:"ReactNode",description:"Second header line, in muted copy."},{name:"actions",type:"ReactNode",description:"Right of the header, before the chevron. Clicks and key presses inside it do not toggle the panel."},{name:"headerLabel",type:"string",description:"Accessible name of the header. Use it when title is not a plain string or actions sit in the header."},{name:"defaultExpanded",type:"boolean",default:"false",description:"Starting state, uncontrolled."},{name:"expanded",type:"boolean",description:"Controlled mode — pass it and the component stops keeping its own state."},{name:"onToggle",type:"(expanded: boolean) => void",description:"Fires after every toggle, controlled or not."},{name:"children",type:"ReactNode",description:"The content. Announced as a region labelled by the header."},{name:"contentMaxHeight",type:"number",default:"320",description:"Content grows to here, then scrolls. Never exceeds 65vh."},{name:"minExpandedHeight",type:"number | string",description:"Floor for the content while expanded."},{name:"fillHeight",type:"boolean",default:"false",description:"Expanded content stretches to fill the available height instead of scrolling."},{name:"contentClassName",type:"string",description:"Extra classes on the content box."},{name:"disabled",type:"boolean",default:"false",description:"Toggling off, header out of the tab order, aria-disabled on."},{name:"loading",type:"boolean",default:"false",description:"The Panel skeleton over the card."},{name:"…Panel props",type:"PanelProps",description:"variant, tone, padding, corner, className and the rest forward to the underlying Panel — standing on the container standard: elevated, tone blue, sm padding, medium corner."}]})]}),re=`// The plain case — the header names itself from its content.
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
`;export{me as CollapsiblePanelPage,me as default};
