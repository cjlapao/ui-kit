import{r as s,n as Q,u as O,j as e,i as E,A as h,C as Y}from"./index-gt012o8E.js";import{P as $}from"./PageHeader-CzVhyXQL.js";import{E as b}from"./ExampleCard-V3REeYJ5.js";import{A as J,a as y,C as n,b as X,K as Z,P as ee}from"./A11ySections-zw3_3X-2.js";import{P as ne,C as i,a as te,T as r}from"./PlaygroundPanel-Czrs7oXC.js";import{C as se}from"./ControlAccordion-DIXHht2n.js";import{e as ae,p as ie,f as oe,d as re,j as le,l as de,m as ce,n as pe}from"./options-CtADNKbm.js";const he=["glass","liquid-glass","default"],ue=[{label:"Chevron",value:"chevron"},{label:"Plus/Minus",value:"plus-minus"},{label:"None",value:"none"}],ge=[{label:"Left",value:"left"},{label:"Right",value:"right"}],me=[{id:"region-us",title:"United States",subtitle:"us-east-1 · N. Virginia",description:"Low latency for east coast workloads.",badge:"Primary",content:"Availability zones: 3 — average latency 22 ms. GPU instances and spot capacity are available."},{id:"region-eu",title:"Europe",subtitle:"eu-central-1 · Frankfurt",description:"Ideal for GDPR-compliant workloads.",badge:"High demand",content:"Availability zones: 2 — average latency 39 ms. Maintenance window Sundays 02:00–04:00 CET."},{id:"region-apac",title:"Asia Pacific",subtitle:"ap-southeast-1 · Singapore",description:"Great for APAC users and low-latency APIs.",badge:"New",content:"Availability zones: 3 — average latency 55 ms. Dedicated bare-metal hosts available on request."}],xe=()=>{const[l,c]=s.useState("elevated"),[o,u]=s.useState("blue"),[a,d]=s.useState(Q),[p,F]=s.useState("sm"),[f,G]=s.useState("md"),[j,R]=s.useState("chevron"),[w,L]=s.useState("right"),[g,q]=s.useState(!1),[v,z]=s.useState(!0),[k,D]=s.useState(!1),[m,M]=s.useState(!0),[A,U]=s.useState(!0),[S,x]=s.useState(!1),[C,V]=s.useState("skeleton"),[I,H]=s.useState("classic"),[P,W]=s.useState("medium"),[N,_]=s.useState("frosted"),T=O({defaultOpenIds:["region-us"],multiple:g}),B=he.includes(l),K=me.map(t=>({id:t.id,title:t.title,subtitle:t.subtitle,description:t.description,icon:m?"Globe":void 0,badge:m?t.badge:void 0,content:e.jsx("p",{children:t.content}),actions:A&&t.id==="region-us"?e.jsx(E,{size:"xs",variant:"ghost",color:o,onClick:()=>{x(!0),setTimeout(()=>x(!1),1200)},children:"Refresh"}):void 0}));return e.jsx(ne,{controls:e.jsx(se,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Variant",options:ae,value:l,onChange:t=>c(t)}),e.jsx(te,{label:"Tone",children:e.jsx(Y,{selectable:!0,size:"sm",value:o,onSelect:u,defaultExpanded:!0})}),e.jsx(i,{label:"Corner",options:ie,value:a,onChange:t=>d(t)}),e.jsx(i,{label:"Padding",options:oe,value:p,onChange:t=>F(t)}),e.jsx(i,{label:"Size",options:re,value:f,onChange:t=>G(t)}),e.jsx(i,{label:"Indicator",options:ue,value:j,onChange:t=>R(t)}),e.jsx(i,{label:"Indicator placement",options:ge,value:w,onChange:t=>L(t)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(r,{label:"Multiple open",checked:g,onChange:q}),e.jsx(r,{label:"Animated",checked:v,onChange:z}),e.jsx(r,{label:"Disabled",checked:k,onChange:D}),e.jsx(r,{label:"Icons and badges",checked:m,onChange:M}),e.jsx(r,{label:"Header action",checked:A,onChange:U}),e.jsx(r,{label:"Loading",checked:S,onChange:x}),e.jsx(i,{label:"Loader type",options:le,value:C,onChange:t=>V(t)})]})},...B?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",options:de,value:I,onChange:t=>H(t)}),e.jsx(i,{label:"Vibrancy",options:ce,value:P,onChange:t=>W(t)}),e.jsx(i,{label:"Glass opacity",options:pe,value:N,onChange:t=>_(t)})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(h,{items:K,variant:l,tone:o,corner:a,padding:p,size:f,indicator:j,indicatorPlacement:w,multiple:g,animated:v,disabled:k,loading:S,loaderType:C,openIds:T.openIds,onChange:T.setOpenIds,glassOpacity:N,vibrancy:P,specularMode:I,ariaLabel:"Cloud regions"})})})},be=[{id:"region-us",title:"United States",subtitle:"us-east-1 · N. Virginia",description:"Low latency for east coast workloads.",badge:"Primary",content:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{children:["Availability zones: ",e.jsx("strong",{children:"3"})]}),e.jsx("p",{children:"Average latency: 22 ms"}),e.jsxs("ul",{className:"list-disc pl-5",children:[e.jsx("li",{children:"GPU instances available"}),e.jsx("li",{children:"Supports spot capacity"})]})]})},{id:"region-eu",title:"Europe",subtitle:"eu-central-1 · Frankfurt",description:"Ideal for GDPR-compliant workloads.",badge:"High demand",content:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{children:"Availability zones: 2"}),e.jsx("p",{children:"Average latency: 39 ms"}),e.jsx("p",{children:"Maintenance window: Sundays 02:00–04:00 CET"})]})},{id:"region-apac",title:"Asia Pacific",subtitle:"ap-southeast-1 · Singapore",description:"Great for APAC users and low-latency APIs.",content:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{children:"Availability zones: 3"}),e.jsx("p",{children:"Average latency: 55 ms"}),e.jsx("p",{children:"Dedicated bare-metal hosts available on request."})]})}];function ye(){const[l,c]=s.useState([]),o=O({defaultOpenIds:["region-us"],multiple:!0}),u=a=>{c(d=>[...d,a]),setTimeout(()=>{c(d=>d.filter(p=>p!==a))},1500)};return e.jsx(h,{tone:"blue",size:"sm",items:be.map(a=>({...a,icon:"Globe",content:a.content,actions:a.id==="region-us"?e.jsx(E,{size:"xs",variant:"ghost",color:"blue",onClick:()=>u(a.id),children:"Refresh"}):void 0,loading:l.includes(a.id)})),openIds:o.openIds,onChange:o.setOpenIds,ariaLabel:"Cloud regions"})}const fe=`import { useState } from "react";
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
`,je=[{id:"q-1",title:"How do billing cycles work?",content:"Invoices are issued on the 1st of each month. Prorations apply automatically when you change plans mid-cycle."},{id:"q-2",title:"Can I change regions later?",content:"Yes. Workloads can be migrated between regions from the console. Data is replicated during the migration window."},{id:"q-3",title:"What happens when a region is down?",content:"Requests are rerouted to the nearest healthy region automatically. A status incident is opened and tracked here."},{id:"q-4",title:"Do you offer a free tier?",content:"New workspaces get 30 days of the Pro plan. After that you can stay on the free tier or upgrade."}];function we(){return e.jsx(h,{variant:"outlined",size:"md",defaultOpenIds:["q-1"],items:je,ariaLabel:"Frequently asked questions"})}const ve=`import { Accordion } from "@cjlapao/ui-kit";

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
`,ke=[{id:"appearance",title:"Appearance",subtitle:"Theme, density, fonts",content:"Choose light or dark, set the interface density, and preview font pairing. Changes apply instantly."},{id:"notifications",title:"Notifications",subtitle:"Email, in-app, digest",content:"Decide what lands in your inbox and what stays in-app. Daily digest by default, real-time optional."},{id:"security",title:"Security",subtitle:"2FA, sessions, API keys",content:"Manage two-factor authentication, active sessions and API keys. Revoking a key is immediate."}];function Ae(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-200 via-sky-100 to-rose-200 p-4 dark:from-indigo-950 dark:via-slate-950 dark:to-rose-950",children:e.jsx(h,{variant:"glass",tone:"indigo",padding:"sm",defaultOpenIds:["appearance"],items:ke,ariaLabel:"Settings"})})}const Se=`import { Accordion } from "@cjlapao/ui-kit";

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
`,Ge=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($,{name:"Accordion",description:"A stacked disclosure list built on Panel — every container surface, tone, corner and padding, on the shared control size, and standing on the container standard: elevated, tone blue, sm padding, medium corner. Independent ids per instance, inert collapsed content, APG arrow-key navigation and per-row loaders."}),e.jsx(xe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Cloud regions",description:"Dense rows with icons, badges and a per-row refresh action. The action's click never toggles the row, and the row shows its own loader while it refreshes.",code:fe,filename:"CloudRegions.tsx",children:e.jsx(ye,{})}),e.jsx(b,{title:"Faq",description:"Plain rows in the outlined surface — one open by default, the rest collapsed and inert.",code:ve,filename:"Faq.tsx",children:e.jsx(we,{})}),e.jsx(b,{title:"Glass settings",description:"A glass accordion over a busy backdrop: the surface tints with the tone and the copy keeps its contrast from the surface's text tokens.",code:Se,filename:"GlassSettings.tsx",children:e.jsx(Ae,{})})]}),e.jsxs(J,{children:[e.jsxs(y,{title:"Screen reader",children:[e.jsxs("p",{children:["Each header is a ",e.jsx(n,{children:'role="button"'})," element (a ",e.jsx(n,{children:"div"}),", not a native ",e.jsx(n,{children:"<button>"}),", because row actions may themselves be buttons — nesting those would be invalid markup) carrying"," ",e.jsx(n,{children:"aria-expanded"})," and ",e.jsx(n,{children:"aria-controls"})," into the content. The content is a ",e.jsx(n,{children:'role="region"'})," labelled by its header, so each row is reachable by landmark navigation; while collapsed it is"," ",e.jsx(n,{children:"inert"})," and ",e.jsx(n,{children:"aria-hidden"}),", so it is neither announced nor focusable. The list itself is a ",e.jsx(n,{children:'role="group"'})," — pass"," ",e.jsx(n,{children:"ariaLabel"})," to name it, and with several accordions on one page the ",e.jsx(n,{children:"useId"}),"-based ids keep their ",e.jsx(n,{children:"aria-controls"})," from colliding. An empty ",e.jsx(n,{children:"items"})," list announces a built-in"," ",e.jsx("em",{children:"No items"})," state; a loading row announces a built-in"," ",e.jsx("em",{children:"Loading"})," label."]}),e.jsx(X,{filename:"Naming.tsx",code:Ce})]}),e.jsxs(y,{title:"Keyboard Support",children:[e.jsxs("p",{children:["Follows the WAI-ARIA APG accordion pattern: arrows move between headers and never toggle, activation is explicit. Disabled rows are skipped by both ",e.jsx(n,{children:"Tab"})," (out of the tab order) and the arrow walk."]}),e.jsx(Z,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Move between headers; disabled rows are skipped."})},{keys:["enter"],action:e.jsx(e.Fragment,{children:"Toggle the focused row."})},{keys:["space"],action:e.jsx(e.Fragment,{children:"Toggle the focused row."})},{keys:["down"],action:e.jsx(e.Fragment,{children:"Focus the next header, wrapping at the end. Disabled rows are skipped."})},{keys:["up"],action:e.jsx(e.Fragment,{children:"Focus the previous header, wrapping at the start."})},{keys:["home"],action:e.jsx(e.Fragment,{children:"Focus the first enabled header."})},{keys:["end"],action:e.jsx(e.Fragment,{children:"Focus the last enabled header."})}]}),e.jsxs("p",{children:[e.jsx(n,{children:"Right"})," and ",e.jsx(n,{children:"Left"})," map to the same next/previous moves as",e.jsx(n,{children:"Down"})," and ",e.jsx(n,{children:"Up"}),". And Enter/Space only fire when the header itself is focused — activating a row ",e.jsx("em",{children:"action"})," button does not also toggle the row, and the action area stops propagation on both click and keydown."]})]}),e.jsx(y,{title:"Internationalization",children:e.jsxs("p",{children:["Every string the component speaks itself — the ",e.jsx("em",{children:"No items"})," ","empty-list title and the ",e.jsx("em",{children:"Loading"})," row label — comes from the built-in kit catalog, shipped in English, Spanish, French, German and Portuguese, and is overridable through the i18n provider like any other ",e.jsx(n,{children:"kit.accordion.*"})," key. Titles, subtitles, descriptions and content are plain caller-supplied React nodes, so their translation is the application’s business. Row order and the arrow walk follow the visual list, so in RTL locales the reading order stays correct; both arrow pairs map to previous/next, not to physical screen sides."]})})]}),e.jsx(ee,{props:[{name:"items",type:"AccordionItem[]",description:e.jsxs(e.Fragment,{children:["The rows: ",e.jsx(n,{children:"id"}),", ",e.jsx(n,{children:"title"}),", optional ",e.jsx(n,{children:"subtitle"})," /"," ",e.jsx(n,{children:"description"})," / ",e.jsx(n,{children:"icon"})," / ",e.jsx(n,{children:"badge"})," / ",e.jsx(n,{children:"actions"}),", required ",e.jsx(n,{children:"content"}),", plus per-row ",e.jsx(n,{children:"disabled"})," and"," ",e.jsx(n,{children:"loading"}),"."]})},{name:"size",type:"ControlSize",default:"md",description:e.jsxs(e.Fragment,{children:["Density of row type, icons and the indicator — the inset is"," ",e.jsx(n,{children:"padding"}),"’s job."]})},{name:"indicator",type:'"chevron" | "plus-minus" | "none"',default:"chevron",description:e.jsxs(e.Fragment,{children:["The expand affordance; ",e.jsx(n,{children:"aria-hidden"})," — the header state carries the meaning."]})},{name:"indicatorPlacement",type:'"left" | "right"',default:"right",description:"Where the indicator sits in the header."},{name:"animated",type:"boolean",default:"true",description:e.jsxs(e.Fragment,{children:["Height transition via ",e.jsx(n,{children:"grid-template-rows"}),"; ",e.jsx(n,{children:"false"})," ","drops the transition class, and motion-reduce users never get it."]})},{name:"multiple",type:"boolean",default:"false",description:e.jsxs(e.Fragment,{children:["Allow several open rows; with ",e.jsx(n,{children:"false"})," opening one closes the others."]})},{name:"defaultOpenIds",type:"string[]",description:"Initially open rows (uncontrolled)."},{name:"openIds",type:"string[]",description:e.jsxs(e.Fragment,{children:["Controlled mode — pass it and the component stops keeping its own state; pair with ",e.jsx(n,{children:"onChange"}),", or reuse ",e.jsx(n,{children:"useAccordion"}),"."]})},{name:"onChange",type:"(openIds: string[]) => void",description:"Fires with the new open set after every change."},{name:"onItemToggle",type:"(id, isOpen) => void",description:"Per-row convenience callback."},{name:"ariaLabel",type:"string",description:"Accessible name for the group of rows."},{name:"itemClassName",type:"string",description:"Extra classes on each row wrapper."},{name:"headerClassName",type:"string",description:"Extra classes on each header."},{name:"contentClassName",type:"string",description:"Extra classes inside the content region."},{name:"iconClassName",type:"string",description:"Extra classes on the icon chip."},{name:"disabled",type:"boolean",default:"false",description:"Disables every row; rows stay visible at 60% opacity."},{name:"loading",type:"boolean",default:"false",description:e.jsxs(e.Fragment,{children:["Replaces the list with the Panel skeleton; switch the style with"," ",e.jsx(n,{children:"loaderType"})," (",e.jsx(n,{children:'"skeleton"'})," | ",e.jsx(n,{children:'"spinner"'})," |"," ",e.jsx(n,{children:'"progress"'}),"). Per-row loaders go in the item’s own"," ",e.jsx(n,{children:"loading"})," field — those overlay the row with a spinner."]})},{name:"…Panel props",type:"PanelProps",description:"variant, tone, padding, corner, hoverable, glass props and the rest forward to the underlying Panel — standing on the container standard: elevated, tone blue, sm padding, medium corner."}]})]}),Ce=`// Name the group, and the rows are already announced correctly:
// each header gets role=button + aria-expanded, each content a labelled region.
<Accordion
  items={regions}
  ariaLabel="Cloud regions"
  multiple
  defaultOpenIds={["region-us"]}
/>`;export{Ge as AccordionPage,Ge as default};
