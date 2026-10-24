import{r as t,j as e,e7 as n}from"./index-gt012o8E.js";import{P as R}from"./PageHeader-CzVhyXQL.js";import{E as f}from"./ExampleCard-V3REeYJ5.js";import{P as O,T as s,S as o}from"./PlaygroundPanel-Czrs7oXC.js";import{C as G}from"./ControlAccordion-DIXHht2n.js";import{e as w,a0 as W,f as q}from"./options-CtADNKbm.js";const _=[{value:"",label:"Auto"},...w],v=[{value:"",label:"Auto"},{value:"solid",label:"Solid"},{value:"soft",label:"Soft"},{value:"outline",label:"Outline"},{value:"ghost",label:"Ghost"},{value:"link",label:"Link"}],B=[{id:"1",title:"rotated the signing keys",actor:"Ada",timestamp:"2m ago",tone:"amber",category:"security"},{id:"2",title:"closed as won",actor:"Sales Bot",timestamp:"18m ago",tone:"green",category:"crm",code:"DEAL-2211"},{id:"3",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3},{id:"4",title:"flagged a slow query",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",description:"GET /api/invoices p95 crossed 1.2s on eu-west."},{id:"5",title:"invited two reviewers",actor:"Grace",timestamp:"3h ago",tone:"neutral",category:"crm"}],H=[{label:"Deploys",value:"deploys"},{label:"CRM",value:"crm"},{label:"Security",value:"security"},{label:"Alerts",value:"alerts"}],j=["CI","Ada","Grace","Watchdog"],b=["restarted a pod","pruned stale branches","archived an audit export","cleared the feature flag"],$=()=>{const[k,A]=t.useState(B),[i,S]=t.useState(!0),[r,C]=t.useState(!0),[d,F]=t.useState(!0),[c,L]=t.useState(!0),[m,T]=t.useState(!1),[u,N]=t.useState("outlined"),[h,V]=t.useState("neutral"),[g,M]=t.useState(""),[p,E]=t.useState(""),[x,I]=t.useState(""),[y,P]=t.useState("md"),D=()=>A(a=>[...a,...Array.from({length:3},(Y,l)=>({id:`x${a.length+l}`,title:b[(a.length+l)%b.length],actor:j[(a.length+l)%j.length],timestamp:`${a.length+l+1}h ago`,tone:["neutral","blue","slate"][l%3]}))]);return e.jsx(O,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(G,{groups:[{id:"parts",title:"Parts",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"filters",checked:i,onChange:S}),e.jsx(s,{label:"tag",checked:r,onChange:C}),e.jsx(s,{label:"link",checked:d,onChange:F}),e.jsx(s,{label:"hasMore",checked:c,onChange:L}),e.jsx(s,{label:"loading",checked:m,onChange:T})]})},{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Variant",options:w,value:u,onChange:a=>N(a)}),e.jsx(o,{label:"Tone",options:W,value:h,onChange:V}),e.jsx(o,{label:"CTA variant",options:v,value:g,onChange:M}),e.jsx(o,{label:"Load more variant",options:v,value:p,onChange:E}),e.jsx(o,{label:"Filter variant",options:_,value:x,onChange:I}),e.jsx(o,{label:"Padding",options:q,value:y,onChange:a=>P(a)})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Filters match an item's ",e.jsx("code",{children:"category"}),", falling back to its"," ",e.jsx("code",{children:"tone"})," — an item with neither only ever shows under All."]})]}),preview:e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(n,{title:"Workspace activity",tag:r?"live":"",items:k,filters:i?H:[],linkLabel:d?"Full audit log":"",totalCount:98,loading:m,hasMore:c,onLoadMore:D,variant:u,tone:h,ctaVariant:g||void 0,loadMoreVariant:p||void 0,filterVariant:x||void 0,padding:y})})})},z=[{id:"1",title:"rotated the signing keys",actor:"Ada",timestamp:"2m ago",tone:"amber",category:"security"},{id:"2",title:"closed as won",actor:"Sales Bot",timestamp:"18m ago",tone:"green",category:"crm",code:"DEAL-2211"},{id:"3",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3},{id:"4",title:"flagged a slow query",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",description:"GET /api/invoices p95 crossed 1.2s on eu-west."},{id:"5",title:"invited two reviewers",actor:"Grace",timestamp:"3h ago",tone:"neutral",category:"crm"},{id:"6",title:"paused the nightly job",actor:"Ops",timestamp:"5h ago",tone:"slate",category:"deploys"}],J=[{label:"Deploys",value:"deploys"},{label:"CRM",value:"crm"},{label:"Security",value:"security"},{label:"Alerts",value:"alerts"}];function K(){return e.jsx("div",{className:"mx-auto w-full max-w-2xl",children:e.jsx(n,{title:"Workspace activity",tag:"last 24h",items:z,filters:J,linkLabel:"Full audit log",totalCount:98,hasMore:!0})})}const Q=`import { ActivityFeed, type ActivityFeedItem } from "@cjlapao/ui-kit";

const items: ActivityFeedItem[] = [
  { id: "1", title: "rotated the signing keys", actor: "Ada", timestamp: "2m ago", tone: "amber", category: "security" },
  { id: "2", title: "closed as won", actor: "Sales Bot", timestamp: "18m ago", tone: "green", category: "crm", code: "DEAL-2211" },
  { id: "3", title: "deployed the release", actor: "CI", timestamp: "1h ago", tone: "blue", category: "deploys", code: "#412", count: 3 },
  { id: "4", title: "flagged a slow query", actor: "Watchdog", timestamp: "2h ago", tone: "rose", category: "alerts", description: "GET /api/invoices p95 crossed 1.2s on eu-west." },
  { id: "5", title: "invited two reviewers", actor: "Grace", timestamp: "3h ago", tone: "neutral", category: "crm" },
  { id: "6", title: "paused the nightly job", actor: "Ops", timestamp: "5h ago", tone: "slate", category: "deploys" },
];

const filters = [
  { label: "Deploys", value: "deploys" },
  { label: "CRM", value: "crm" },
  { label: "Security", value: "security" },
  { label: "Alerts", value: "alerts" },
];

/**
 * The full audit trail, one panel: toned dots say what kind of thing it
 * was, the segment control says which kind to look at, and the tail says
 * there is more below.
 */
export default function AuditLog() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <ActivityFeed
        title="Workspace activity"
        tag="last 24h"
        items={items}
        filters={filters}
        linkLabel="Full audit log"
        totalCount={98}
        hasMore
      />
    </div>
  );
}
`;function U(){return e.jsx("div",{className:"mx-auto w-full max-w-sm",children:e.jsx(n,{title:"Deploys",items:[{id:"a",title:"shipped v2.14.0 to production",timestamp:"now",tone:"green"},{id:"b",title:"canary promoted",timestamp:"4m",tone:"emerald"},{id:"c",title:"rollback armed on checkout-api",timestamp:"12m",tone:"amber"},{id:"d",title:"staging rebuilt",timestamp:"31m",tone:"blue"}]})})}const X=`import { ActivityFeed } from "@cjlapao/ui-kit";

/**
 * A narrow deploy feed — no filters, no header link, just events and a
 * tail: the leanest the component gets.
 */
export default function DeployStream() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <ActivityFeed
        title="Deploys"
        items={[
          { id: "a", title: "shipped v2.14.0 to production", timestamp: "now", tone: "green" },
          { id: "b", title: "canary promoted", timestamp: "4m", tone: "emerald" },
          { id: "c", title: "rollback armed on checkout-api", timestamp: "12m", tone: "amber" },
          { id: "d", title: "staging rebuilt", timestamp: "31m", tone: "blue" },
        ]}
      />
    </div>
  );
}
`,se=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(R,{name:"Activity Feed",description:"The audit log as a living feed: newest first, toned dots for what happened, a segment control for who or what kind, count badges for what aggregated, and a tail that says there is more. Rows are dense on purpose — feeds are skimmed, not read."}),e.jsx($,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(f,{title:"Audit Log",description:"The full trail — filterable, counted, with a door to the long form.",code:Q,filename:"AuditLog.tsx",children:e.jsx(K,{})}),e.jsx(f,{title:"Deploy Stream",description:"No filters, no link, just events and a tail — the leanest the component gets.",code:X,filename:"DeployStream.tsx",children:e.jsx(U,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsx("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"title"}),", ",e.jsx("code",{children:"items"})," ","(",e.jsx("code",{children:"{ id, title, description?, code?, actor?, timestamp, tone?, category?, count? }"}),"),"," ",e.jsx("code",{children:"filters"})," with ",e.jsx("code",{children:"defaultFilter"})," /"," ",e.jsx("code",{children:"onFilterChange"})," (the ",e.jsx("code",{children:"filterChange"})," event in Vue), ",e.jsx("code",{children:"tag"}),", ",e.jsx("code",{children:"linkLabel"})," / ",e.jsx("code",{children:"onLink"}),","," ",e.jsx("code",{children:"hasMore"})," / ",e.jsx("code",{children:"onLoadMore"})," /"," ",e.jsx("code",{children:"loadMoreLabel"}),", ",e.jsx("code",{children:"loading"})," (the feed's own row rhythm in placeholder ink — filters and tail waiting quietly until the events land), ",e.jsx("code",{children:"totalCount"}),","," ",e.jsx("code",{children:"ctaVariant"})," / ",e.jsx("code",{children:"loadMoreVariant"})," /"," ",e.jsx("code",{children:"filterVariant"})," — every control on the card follows the card's own variant by default (the filter track speaks the same surface vocabulary) unless told otherwise — and the usual card surface. The card's"," ",e.jsx("code",{children:"tone"})," is not only the surface: untoned entries inherit it for their dots, and the filters, the link and the tail button all wear it, while a neutral card stays quiet. The All segment is implicit and always first; filters match ",e.jsx("code",{children:"category"})," first and ",e.jsx("code",{children:"tone"})," second, and"," ",e.jsx("code",{children:"timestamp"})," is deliberately pre-formatted — feeds show what the server said, not what the clock is doing. An empty filter result is a state, not an error: the feed shows a quiet empty state."]})})]})]});export{se as ActivityFeedPage,se as default};
