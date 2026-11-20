import{r as a,j as e,gO as s}from"./index-dkEsqyUy.js";import{P as z}from"./PageHeader-Cqxw9jAs.js";import{E as k}from"./ExampleCard-SmeeyhOh.js";import{S as J}from"./SurfaceToneControl-CptLUoZR.js";import{P as K,T as l,S as o}from"./PlaygroundPanel-CD4VThIT.js";import{C as Q}from"./ControlAccordion-BM7PEMt8.js";import{s as L,t as C,p as U}from"./options-DH3jBuHJ.js";const X=[{value:"",label:"Auto"},...L],S=[{value:"",label:"Auto"},{value:"solid",label:"Solid"},{value:"soft",label:"Soft"},{value:"outline",label:"Outline"},{value:"ghost",label:"Ghost"},{value:"link",label:"Link"}],Y=[{id:"1",title:"rotated the signing keys",actor:"Ada",timestamp:"2m ago",tone:"amber",category:"security",onClick:()=>{}},{id:"2",title:"closed as won",actor:"Sales Bot",timestamp:"18m ago",tone:"green",category:"crm",code:"DEAL-2211",onClick:()=>{}},{id:"3",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3,onClick:()=>{}},{id:"4",title:"flagged a slow query",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",description:"GET /api/invoices p95 crossed 1.2s on eu-west.",onClick:()=>{}},{id:"5",title:"invited two reviewers",actor:"Grace",timestamp:"3h ago",tone:"neutral",category:"crm",onClick:()=>{}}],Z=[{label:"Deploys",value:"deploys"},{label:"CRM",value:"crm"},{label:"Security",value:"security"},{label:"Alerts",value:"alerts"}],A=["CI","Ada","Grace","Watchdog"],T=["restarted a pod","pruned stale branches","archived an audit export","cleared the feature flag"],ee=()=>{const[i,F]=a.useState(Y),[r,M]=a.useState(!0),[c,N]=a.useState(!0),[d,V]=a.useState(!0),[m,E]=a.useState(!0),[u,P]=a.useState("scroll"),[h,I]=a.useState(!0),[g,D]=a.useState(!1),[p,O]=a.useState("outlined"),[x,R]=a.useState("none"),[y,G]=a.useState(""),[f,W]=a.useState(""),[v,q]=a.useState(""),[b,B]=a.useState("md"),[j,_]=a.useState(""),[w,H]=a.useState(""),$=async()=>{await new Promise(t=>setTimeout(t,600)),F(t=>[...t,...Array.from({length:3},(ie,n)=>({id:`x${t.length+n}`,title:T[(t.length+n)%T.length],actor:A[(t.length+n)%A.length],timestamp:`${t.length+n+1}h ago`,tone:["neutral","blue","slate"][n%3]}))])};return e.jsx(K,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Q,{groups:[{id:"parts",title:"Parts",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"filters",checked:r,onChange:M}),e.jsx(l,{label:"tag",checked:c,onChange:N}),e.jsx(l,{label:"link",checked:d,onChange:V}),e.jsx(l,{label:"hasMore",checked:m,onChange:E}),e.jsx(o,{label:"Load mode",options:[{value:"scroll",label:"Scroll (infinite)"},{value:"button",label:"Button"}],value:u,onChange:t=>P(t)}),e.jsx(l,{label:"scroll (max-h)",checked:h,onChange:I}),e.jsx(l,{label:"loading",checked:g,onChange:D})]})},{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Variant",options:L,value:p,onChange:t=>O(t)}),e.jsx(J,{label:"Surface tone",value:x,onChange:R}),e.jsx(o,{label:"Controls tone",options:[{value:"",label:"(inherit)"},...C],value:j,onChange:t=>_(t)}),e.jsx(o,{label:"CTA variant",options:S,value:y,onChange:G}),e.jsx(o,{label:"Load more variant",options:S,value:f,onChange:W}),e.jsx(o,{label:"Filter variant",options:X,value:v,onChange:q}),e.jsx(o,{label:"Filter tone",options:[{value:"",label:"(inherit)"},...C],value:w,onChange:t=>H(t)}),e.jsx(o,{label:"Padding",options:U,value:b,onChange:t=>B(t)})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Filters match an item's ",e.jsx("code",{children:"category"}),", falling back to its"," ",e.jsx("code",{children:"tone"})," — an item with neither only ever shows under All. With ",e.jsx("strong",{children:"scroll"})," on, ",e.jsx("code",{children:"maxHeight"})," caps the body in a ",e.jsx("code",{children:"ScrollArea"}),": Load more grows the list, the card doesn't."]})]}),preview:e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(s,{title:"Workspace activity",tag:c?"live":"",items:i,filters:r?Z:[],linkLabel:d?"Full audit log":"",totalCount:98,loading:g,hasMore:m&&i.length<26,onLoadMore:$,loadMode:u,maxHeight:h?280:void 0,variant:p,tone:x,ctaVariant:y||void 0,loadMoreVariant:f||void 0,filterVariant:v||void 0,padding:b,controlsTone:j||void 0,filterTone:w||void 0})})})},te=[{id:"1",title:"rotated the signing keys",actor:"Ada",timestamp:"2m ago",tone:"amber",category:"security"},{id:"2",title:"closed as won",actor:"Sales Bot",timestamp:"18m ago",tone:"green",category:"crm",code:"DEAL-2211"},{id:"3",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3},{id:"4",title:"flagged a slow query",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",description:"GET /api/invoices p95 crossed 1.2s on eu-west."},{id:"5",title:"invited two reviewers",actor:"Grace",timestamp:"3h ago",tone:"neutral",category:"crm"},{id:"6",title:"paused the nightly job",actor:"Ops",timestamp:"5h ago",tone:"slate",category:"deploys"}],ae=[{label:"Deploys",value:"deploys"},{label:"CRM",value:"crm"},{label:"Security",value:"security"},{label:"Alerts",value:"alerts"}];function oe(){return e.jsx("div",{className:"mx-auto w-full max-w-2xl",children:e.jsx(s,{title:"Workspace activity",tag:"last 24h",items:te,filters:ae,linkLabel:"Full audit log",totalCount:98,hasMore:!0})})}const le=`import { ActivityFeed, type ActivityFeedItem } from "@cjlapao/ui-kit";

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
`;function ne(){return e.jsx("div",{className:"mx-auto w-full max-w-sm",children:e.jsx(s,{title:"Deploys",items:[{id:"a",title:"shipped v2.14.0 to production",timestamp:"now",tone:"green"},{id:"b",title:"canary promoted",timestamp:"4m",tone:"emerald"},{id:"c",title:"rollback armed on checkout-api",timestamp:"12m",tone:"amber"},{id:"d",title:"staging rebuilt",timestamp:"31m",tone:"blue"}]})})}const se=`import { ActivityFeed } from "@cjlapao/ui-kit";

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
`,pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(z,{name:"Activity Feed",description:"The audit log as a living feed: newest first, toned dots for what happened, a segment control for who or what kind, count badges for what aggregated, and a tail that says there is more. Rows are dense on purpose — feeds are skimmed, not read. `maxHeight` caps the body in a `ScrollArea`, so Load more grows the list while the card and the tail button stay put."}),e.jsx(ee,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(k,{title:"Audit Log",description:"The full trail — filterable, counted, with a door to the long form.",code:le,filename:"AuditLog.tsx",children:e.jsx(oe,{})}),e.jsx(k,{title:"Deploy Stream",description:"No filters, no link, just events and a tail — the leanest the component gets.",code:se,filename:"DeployStream.tsx",children:e.jsx(ne,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsx("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"title"}),", ",e.jsx("code",{children:"items"})," ","(",e.jsx("code",{children:"{ id, title, description?, code?, actor?, timestamp, tone?, category?, count? }"}),"),"," ",e.jsx("code",{children:"filters"})," with ",e.jsx("code",{children:"defaultFilter"})," /"," ",e.jsx("code",{children:"onFilterChange"})," (the ",e.jsx("code",{children:"filterChange"})," event in Vue), ",e.jsx("code",{children:"tag"}),", ",e.jsx("code",{children:"linkLabel"})," / ",e.jsx("code",{children:"onLink"}),","," ",e.jsx("code",{children:"hasMore"})," / ",e.jsx("code",{children:"onLoadMore"})," /"," ",e.jsx("code",{children:"loadMoreLabel"}),", ",e.jsx("code",{children:"loading"})," (the feed's own row rhythm in placeholder ink — filters and tail waiting quietly until the events land), ",e.jsx("code",{children:"totalCount"}),","," ",e.jsx("code",{children:"ctaVariant"})," / ",e.jsx("code",{children:"loadMoreVariant"})," /"," ",e.jsx("code",{children:"filterVariant"})," — every control on the card follows the card's own variant by default (the filter track speaks the same surface vocabulary) unless told otherwise — and the usual card surface. The card's"," ",e.jsx("code",{children:"tone"})," is not only the surface: untoned entries inherit it for their dots, and the filters, the link and the tail button all wear it, while a neutral card stays quiet. The All segment is implicit and always first; filters match ",e.jsx("code",{children:"category"})," first and ",e.jsx("code",{children:"tone"})," second, and"," ",e.jsx("code",{children:"timestamp"})," is deliberately pre-formatted — feeds show what the server said, not what the clock is doing. An empty filter result is a state, not an error: the feed shows a quiet empty state."]})})]})]});export{pe as ActivityFeedPage,pe as default};
