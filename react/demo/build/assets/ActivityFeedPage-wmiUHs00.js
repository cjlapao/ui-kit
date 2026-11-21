import{r as t,j as e,h5 as m,c as ke,P as Ce,a4 as c,B as k}from"./index-ChbzYKtA.js";import{P as Se}from"./PageHeader-CORco2N-.js";import{E as j}from"./ExampleCard-Db5NXgWv.js";import{S as y}from"./SurfaceToneControl-BpIV0XpL.js";import{P as Ne,T as o,a as Ae,S as a}from"./PlaygroundPanel-CZxrTOj5.js";import{C as Te}from"./ControlAccordion-DoyyLWlc.js";import{t as b,s as h,f as Pe,p as Le}from"./options-C-rzDbtC.js";const Ie=[{value:"",label:"Auto"},...h],W=[{value:"",label:"Auto"},{value:"solid",label:"Solid"},{value:"soft",label:"Soft"},{value:"outline",label:"Outline"},{value:"ghost",label:"Ghost"},{value:"link",label:"Link"}],Fe=[{id:"1",title:"rotated the signing keys",actor:"Ada",timestamp:"2m ago",tone:"amber",category:"security",onClick:()=>{}},{id:"2",title:"closed as won",actor:"Sales Bot",timestamp:"18m ago",tone:"green",category:"crm",code:"DEAL-2211",onClick:()=>{}},{id:"3",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3,onClick:()=>{}},{id:"4",title:"flagged a slow query",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",description:"GET /api/invoices p95 crossed 1.2s on eu-west.",onClick:()=>{}},{id:"5",title:"invited two reviewers",actor:"Grace",timestamp:"3h ago",tone:"neutral",category:"crm",onClick:()=>{}}],Ve=[{label:"Deploys",value:"deploys"},{label:"CRM",value:"crm"},{label:"Security",value:"security"},{label:"Alerts",value:"alerts"}],_=["CI","Ada","Grace","Watchdog"],H=["restarted a pod","pruned stale branches","archived an audit export","cleared the feature flag"],Re=()=>{const[l,$]=t.useState(Fe),[C,U]=t.useState(!0),[S,J]=t.useState(!0),[N,K]=t.useState(""),[u,Q]=t.useState(!0),[A,X]=t.useState(!0),[T,Y]=t.useState(!0),[P,Z]=t.useState("scroll"),[L,ee]=t.useState(!0),[x,te]=t.useState(!1),[i,ne]=t.useState(!1),[p,ae]=t.useState(""),[I,se]=t.useState(!1),[g,oe]=t.useState("skeleton"),[d,le]=t.useState(!1),[v,ie]=t.useState("elevated"),[w,re]=t.useState("none"),[F,de]=t.useState("outlined"),[V,ce]=t.useState("none"),[R,he]=t.useState("none"),[M,me]=t.useState("none"),[f,ue]=t.useState(!0),[E,xe]=t.useState("rounded"),[B,pe]=t.useState(""),[O,ge]=t.useState(""),[z,ve]=t.useState(""),[D,we]=t.useState("md"),[q,fe]=t.useState(""),[G,je]=t.useState(""),ye=async()=>{await new Promise(n=>setTimeout(n,600)),$(n=>[...n,...Array.from({length:3},(s,r)=>({id:`x${n.length+r}`,title:H[(n.length+r)%H.length],actor:_[(n.length+r)%_.length],timestamp:`${n.length+r+1}h ago`,tone:["neutral","blue","slate"][r%3]}))])},be=t.useMemo(()=>{const n=s=>e.jsx(Ce,{variant:v,tone:w,padding:"sm",className:"min-w-0 flex-1",children:e.jsxs("div",{className:"flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1",children:[e.jsxs("span",{className:"min-w-0 truncate text-sm",children:[e.jsx("span",{className:"font-semibold",children:s.actor})," ",e.jsx("span",{className:"font-medium",children:s.title})]}),e.jsx(c,{tone:s.tone??"neutral",size:"sm",children:s.code??s.category??"custom"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"body override"}),e.jsx(k,{variant:"ghost",size:"sm",className:"ms-auto",onClick:()=>{},children:"Open"})]})});return l.map(s=>({...s,active:x&&s.id==="1",attention:i&&s.id==="4",attentionTone:i&&s.id==="4"&&p||void 0,...d?{body:n(s)}:{}}))},[l,d,v,w,x,i,p]);return e.jsx(Ne,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Te,{groups:[{id:"parts",title:"Parts",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"filters",checked:C,onChange:U}),e.jsx(o,{label:"tag",checked:S,onChange:J}),e.jsx(o,{label:"count label",checked:u,onChange:Q}),u&&e.jsx(Ae,{label:"Count noun",children:e.jsx(ke,{size:"sm",value:N,placeholder:"events (default)",onChange:n=>K(n.target.value)})}),e.jsx(o,{label:"link",checked:A,onChange:X}),e.jsx(o,{label:"hasMore",checked:T,onChange:Y}),e.jsx(a,{label:"Load mode",options:[{value:"scroll",label:"Scroll (infinite)"},{value:"button",label:"Button"}],value:P,onChange:n=>Z(n)}),e.jsx(o,{label:"scroll (max-h)",checked:L,onChange:ee}),e.jsx(o,{label:"active row",checked:x,onChange:te}),e.jsx(o,{label:"attention row",checked:i,onChange:ne}),i&&e.jsx(a,{label:"Attention tone",options:[{value:"",label:"(follow row tone)"},...b],value:p,onChange:ae}),e.jsx(o,{label:"loading",checked:I,onChange:se}),e.jsx(a,{label:"Loader type",options:[{value:"skeleton",label:"Skeleton (default)"},{value:"spinner",label:"Spinner"},{value:"progress",label:"Progress"}],value:g,onChange:n=>oe(n)}),e.jsx(o,{label:"custom body",checked:d,onChange:le}),d&&e.jsxs(e.Fragment,{children:[e.jsx(a,{label:"Body variant",options:h,value:v,onChange:n=>ie(n)}),e.jsx(y,{label:"Body tone",value:w,onChange:re})]})]})},{id:"surface",title:"Surface",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(a,{label:"Variant",options:h,value:F,onChange:n=>de(n)}),e.jsx(y,{label:"Surface tone",value:V,onChange:ce}),e.jsx(a,{label:"Item variant",options:h,value:R,onChange:n=>he(n)}),e.jsx(a,{label:"Item corner",options:Pe,value:E,onChange:n=>xe(n)}),e.jsx(o,{label:"item tone follows card",checked:f,onChange:ue}),!f&&e.jsx(y,{label:"Item tone",value:M,onChange:me}),e.jsx(a,{label:"Controls tone",options:[{value:"",label:"(inherit)"},...b],value:q,onChange:n=>fe(n)}),e.jsx(a,{label:"CTA variant",options:W,value:B,onChange:pe}),e.jsx(a,{label:"Load more variant",options:W,value:O,onChange:ge}),e.jsx(a,{label:"Filter variant",options:Ie,value:z,onChange:ve}),e.jsx(a,{label:"Filter tone",options:[{value:"",label:"(inherit)"},...b],value:G,onChange:n=>je(n)}),e.jsx(a,{label:"Padding",options:Le,value:D,onChange:n=>we(n)})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Filters match an item's ",e.jsx("code",{children:"category"}),", falling back to its"," ",e.jsx("code",{children:"tone"})," — an item with neither only ever shows under All. With ",e.jsx("strong",{children:"scroll"})," on, ",e.jsx("code",{children:"maxHeight"})," caps the body in a ",e.jsx("code",{children:"ScrollArea"}),": Load more grows the list, the card doesn't. ",e.jsx("strong",{children:"Custom body"})," hands every row's whole content to ",e.jsx("code",{children:"item.body"})," — the kit keeps the wrapper, while each row brings a ",e.jsx("code",{children:"Panel"})," of its own variant and tone. The kit's own rows are Panels too:"," ",e.jsx("strong",{children:"Item variant"})," and ",e.jsx("strong",{children:"Item tone"}),"drive ",e.jsx("code",{children:"rowVariant"})," / ",e.jsx("code",{children:"rowTone"})," /",e.jsx("code",{children:"rowCorner"}),", so the row surface can move under the card — hover wash included. Away from ",e.jsx("code",{children:"none"}),", the list dividers make way for a vertical gap. ",e.jsx("strong",{children:"Active row"})," and"," ",e.jsx("strong",{children:"attention row"})," hand the row Panel its"," ",e.jsx("code",{children:"active"})," rim and ",e.jsx("code",{children:"pulse"})," glow — selection and demand, layering with the hover and with each other — and"," ",e.jsx("strong",{children:"attention tone"})," moves that hue the Panel's own way: ",e.jsx("code",{children:"borderColor ?? tone"}),", blue floor, one hue for rim and glow."]})]}),preview:e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(m,{title:"Workspace activity",tag:S?"live":"",items:be,filters:C?Ve:[],linkLabel:A?"Full audit log":"",totalCount:98,countLabel:u?N||void 0:!1,loading:I,loaderType:g,loaderProgress:g==="progress"?62:void 0,hasMore:T&&l.length<26,onLoadMore:ye,loadMode:P,maxHeight:L?280:void 0,variant:F,tone:V,rowVariant:R,rowTone:f?void 0:M,rowCorner:E,ctaVariant:B||void 0,loadMoreVariant:O||void 0,filterVariant:z||void 0,padding:D,controlsTone:q||void 0,filterTone:G||void 0})})})},Me=[{id:"1",title:"rotated the signing keys",actor:"Ada",timestamp:"2m ago",tone:"amber",category:"security"},{id:"2",title:"closed as won",actor:"Sales Bot",timestamp:"18m ago",tone:"green",category:"crm",code:"DEAL-2211"},{id:"3",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3},{id:"4",title:"flagged a slow query",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",description:"GET /api/invoices p95 crossed 1.2s on eu-west."},{id:"5",title:"invited two reviewers",actor:"Grace",timestamp:"3h ago",tone:"neutral",category:"crm"},{id:"6",title:"paused the nightly job",actor:"Ops",timestamp:"5h ago",tone:"slate",category:"deploys"}],Ee=[{label:"Deploys",value:"deploys"},{label:"CRM",value:"crm"},{label:"Security",value:"security"},{label:"Alerts",value:"alerts"}];function Be(){return e.jsx("div",{className:"mx-auto w-full max-w-2xl",children:e.jsx(m,{title:"Workspace activity",tag:"last 24h",items:Me,filters:Ee,linkLabel:"Full audit log",totalCount:98,hasMore:!0})})}const Oe=`import { ActivityFeed, type ActivityFeedItem } from "@cjlapao/ui-kit";

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
`;function ze(){return e.jsx("div",{className:"mx-auto w-full max-w-sm",children:e.jsx(m,{title:"Deploys",items:[{id:"a",title:"shipped v2.14.0 to production",timestamp:"now",tone:"green"},{id:"b",title:"canary promoted",timestamp:"4m",tone:"emerald"},{id:"c",title:"rollback armed on checkout-api",timestamp:"12m",tone:"amber"},{id:"d",title:"staging rebuilt",timestamp:"31m",tone:"blue"}]})})}const De=`import { ActivityFeed } from "@cjlapao/ui-kit";

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
`;function qe(){const l=[{id:"sev",title:"checkout-api error rate spiked",timestamp:"2m ago",category:"incidents",body:e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(c,{size:"sm",tone:"rose",children:"SEV-2"}),e.jsx("span",{className:"min-w-0 truncate text-sm font-medium",children:"checkout-api error rate spiked"}),e.jsx("span",{className:"ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500",children:"2m ago"})]}),e.jsx("p",{className:"mt-1 text-xs text-neutral-500 dark:text-neutral-400",children:"5xx ratio at 11.4% in eu-west — mitigation in progress."}),e.jsx("div",{className:"mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800",children:e.jsx("div",{className:"h-full w-2/3 rounded-full bg-rose-500"})}),e.jsxs("div",{className:"mt-2 flex items-center gap-2",children:[e.jsx(k,{size:"xs",variant:"outline",color:"rose",children:"Acknowledge"}),e.jsx(k,{size:"xs",variant:"link",children:"Open incident"})]})]})},{id:"pr",title:"requested your review",timestamp:"26m ago",category:"reviews",onClick:()=>{},body:e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"min-w-0 truncate text-sm font-medium",children:[e.jsx("span",{className:"font-semibold",children:"Ada "}),"requested your review"]}),e.jsx("code",{className:"shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] tracking-tighter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",children:"#413"}),e.jsx("span",{className:"ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500",children:"26m ago"})]}),e.jsxs("div",{className:"mt-1 flex items-center gap-1.5",children:[e.jsx(c,{size:"sm",tone:"emerald",children:"+312"}),e.jsx(c,{size:"sm",tone:"rose",children:"−44"}),e.jsx("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"14 files · payments-service"})]})]})},{id:"plain",title:"merged the release branch",actor:"CI",timestamp:"1h ago",tone:"green",category:"incidents",code:"#412"}];return e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(m,{title:"On-call",items:l,filters:[{label:"Incidents",value:"incidents"},{label:"Reviews",value:"reviews"}]})})}const Ge=`import {
  ActivityFeed,
  Button,
  Pill,
  type ActivityFeedItem,
} from "@cjlapao/ui-kit";

/**
 * Events the fixed row can't express. An item's \`body\` replaces the row's
 * entire content — dot, text and timestamp all stop being drawn and you
 * draw whatever the event deserves instead. The feed keeps drawing the
 * row itself: same padding, same dividers, and with \`onClick\` the same
 * clickable grammar — so custom rows sit in the feed's rhythm next to the
 * default ones instead of fighting it.
 */
export default function CustomRows() {
  const items: ActivityFeedItem[] = [
    {
      id: "sev",
      title: "checkout-api error rate spiked",
      timestamp: "2m ago",
      category: "incidents",
      body: (
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Pill size="sm" tone="rose">
              SEV-2
            </Pill>
            <span className="min-w-0 truncate text-sm font-medium">
              checkout-api error rate spiked
            </span>
            <span className="ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
              2m ago
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            5xx ratio at 11.4% in eu-west — mitigation in progress.
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div className="h-full w-2/3 rounded-full bg-rose-500" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Button size="xs" variant="outline" color="rose">
              Acknowledge
            </Button>
            <Button size="xs" variant="link">
              Open incident
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "pr",
      title: "requested your review",
      timestamp: "26m ago",
      category: "reviews",
      onClick: () => {},
      body: (
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="min-w-0 truncate text-sm font-medium">
              <span className="font-semibold">Ada </span>
              requested your review
            </span>
            <code className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] tracking-tighter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              #413
            </code>
            <span className="ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
              26m ago
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <Pill size="sm" tone="emerald">
              +312
            </Pill>
            <Pill size="sm" tone="rose">
              −44
            </Pill>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              14 files · payments-service
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "plain",
      title: "merged the release branch",
      actor: "CI",
      timestamp: "1h ago",
      tone: "green",
      category: "incidents",
      code: "#412",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-xl">
      <ActivityFeed
        title="On-call"
        items={items}
        filters={[
          { label: "Incidents", value: "incidents" },
          { label: "Reviews", value: "reviews" },
        ]}
      />
    </div>
  );
}
`,Qe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Se,{name:"Activity Feed",description:"The audit log as a living feed: newest first, toned dots for what happened, a segment control for who or what kind, count badges for what aggregated, and a tail that says there is more. Rows are dense on purpose — feeds are skimmed, not read. `maxHeight` caps the body in a `ScrollArea`, so Load more grows the list while the card and the tail button stay put."}),e.jsx(Re,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(j,{title:"Audit Log",description:"The full trail — filterable, counted, with a door to the long form.",code:Oe,filename:"AuditLog.tsx",children:e.jsx(Be,{})}),e.jsx(j,{title:"Deploy Stream",description:"No filters, no link, just events and a tail — the leanest the component gets.",code:De,filename:"DeployStream.tsx",children:e.jsx(ze,{})}),e.jsx(j,{title:"Custom Rows",description:"An item's body replaces the row's whole content — the feed keeps drawing the row itself, so complex UI sits in the same rhythm as the default rows.",code:Ge,filename:"CustomRows.tsx",children:e.jsx(qe,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsx("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"title"}),", ",e.jsx("code",{children:"items"})," ","(",e.jsx("code",{children:"{ id, title, description?, code?, actor?, timestamp, tone?, category?, count?, body?, onClick?, active?, attention?, attentionTone? }"}),"),"," ","where ",e.jsx("code",{children:"body"})," — a node in React, a VNode in Vue — replaces the row's entire content (dot, text and timestamp all stop being drawn) while the feed keeps drawing the row itself — a"," ",e.jsx("code",{children:"Panel"})," on surface ",e.jsx("code",{children:"none"})," at the component's tone, ",e.jsx("code",{children:"rounded"})," corner, ",e.jsx("code",{children:"xs"})," padding — and an"," ",e.jsx("code",{children:"onClick"})," hands that Panel its card-action API: the cursor, the toned hover wash, and (React) the button semantics,"," ","while ",e.jsx("code",{children:"rowVariant"})," / ",e.jsx("code",{children:"rowTone"})," /",e.jsx("code",{children:"rowCorner"})," set that row Panel's surface (default"," ",e.jsx("code",{children:'"none"'}),", the card's own tone, and the corner scale's xs step, ",e.jsx("code",{children:'"rounded"'}),") and the row's own"," ",e.jsx("code",{children:"active"})," / ",e.jsx("code",{children:"attention"})," hand it the Panel's"," ",e.jsx("code",{children:"active"})," rim and ",e.jsx("code",{children:"pulse"})," glow — with"," ",e.jsx("code",{children:"attentionTone"})," the Panel's own hue override (the row"," ",e.jsx("code",{children:"borderColor"}),": ",e.jsx("code",{children:"borderColor ?? tone"}),", blue floor), shared by rim and glow so a selected-and-pulsing row always agrees,"," ",e.jsx("code",{children:"filters"})," with ",e.jsx("code",{children:"defaultFilter"})," /"," ",e.jsx("code",{children:"onFilterChange"})," (the ",e.jsx("code",{children:"filterChange"})," event in Vue), ",e.jsx("code",{children:"tag"}),", ",e.jsx("code",{children:"linkLabel"})," / ",e.jsx("code",{children:"onLink"}),","," ",e.jsx("code",{children:"hasMore"})," / ",e.jsx("code",{children:"onLoadMore"})," /"," ",e.jsx("code",{children:"loadMoreLabel"}),", ",e.jsx("code",{children:"loading"})," (the feed's own row rhythm in placeholder ink — filters and tail waiting quietly until the events land), whose style ",e.jsx("code",{children:"loaderType"})," picks —"," ",e.jsx("code",{children:"skeleton"})," (the default) rewrites the body, while"," ",e.jsx("code",{children:"spinner"})," / ",e.jsx("code",{children:"progress"})," dim the real rows under a labelled Loader; either way the header tag, the count and the filters yield until the events land,"," ",e.jsx("code",{children:"loaderProgress"})," filling the bar,"," ",e.jsx("code",{children:"loadingMessage"}),' labelling the overlay (defaults to "Loading") and'," ",e.jsx("code",{children:"skeletonRows"})," pinning the placeholder count —"," ",e.jsx("code",{children:"totalCount"})," with ",e.jsx("code",{children:"countLabel"})," beside it (the header's noun is ",e.jsx("code",{children:'"events"'})," — or ",e.jsx("code",{children:'"event"'})," at one — unless a string names it verbatim, ",e.jsx("code",{children:'""'})," leaves the number alone and ",e.jsx("code",{children:"false"})," drops the count from the header entirely),"," ",e.jsx("code",{children:"ctaVariant"})," / ",e.jsx("code",{children:"loadMoreVariant"})," /"," ",e.jsx("code",{children:"filterVariant"})," — every control on the card follows the card's own variant by default (the filter track speaks the same surface vocabulary) unless told otherwise — and the usual card surface. The card's"," ",e.jsx("code",{children:"tone"})," is not only the surface: untoned entries inherit it for their dots, and the filters, the link and the tail button all wear it, while a neutral card stays quiet. The All segment is implicit and always first; filters match ",e.jsx("code",{children:"category"})," first and ",e.jsx("code",{children:"tone"})," second, and"," ",e.jsx("code",{children:"timestamp"})," is deliberately pre-formatted — feeds show what the server said, not what the clock is doing. An empty filter result is a state, not an error: the feed shows a quiet empty state."]})})]})]});export{Qe as ActivityFeedPage,Qe as default};
