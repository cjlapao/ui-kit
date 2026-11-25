import{r as t,j as e,hG as d,c as Me,P as Oe,t as m,B as A,M as Be,I as De}from"./index-CQwZVYnB.js";import{P as Ge}from"./PageHeader-BhZxEVHt.js";import{E as u}from"./ExampleCard-BZsKA5_g.js";import{S}from"./SurfaceToneControl-LH37fS9y.js";import{P as qe,T as o,a as ze,S as s}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as _e}from"./ControlAccordion-C7vC6faF.js";import{t as N,s as p,f as K,p as Q}from"./options-Byh1yOHz.js";const We=[{value:"",label:"Auto"},...p],X=[{value:"",label:"Auto"},{value:"solid",label:"Solid"},{value:"soft",label:"Soft"},{value:"outline",label:"Outline"},{value:"ghost",label:"Ghost"},{value:"link",label:"Link"}],He=[{id:"1",title:"rotated the signing keys",actor:"Ada",timestamp:"2m ago",tone:"amber",category:"security",onClick:()=>{}},{id:"2",title:"closed as won",actor:"Sales Bot",timestamp:"18m ago",tone:"green",category:"crm",code:"DEAL-2211",onClick:()=>{}},{id:"3",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3,onClick:()=>{}},{id:"4",title:"flagged a slow query",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",description:"GET /api/invoices p95 crossed 1.2s on eu-west.",onClick:()=>{}},{id:"5",title:"invited two reviewers",actor:"Grace",timestamp:"3h ago",tone:"neutral",category:"crm",onClick:()=>{}}],Ue=[{label:"Deploys",value:"deploys"},{label:"CRM",value:"crm"},{label:"Security",value:"security"},{label:"Alerts",value:"alerts"}],Z=["CI","Ada","Grace","Watchdog"],ee=["restarted a pod","pruned stale branches","archived an audit export","cleared the feature flag"],x=(i,g)=>e.jsx(Be,{popup:!0,items:g,trigger:e.jsx(De,{icon:"DotsVertical",variant:"ghost",size:"xs",srLabel:i})}),Ye=[{id:"view",label:"View deployment",icon:"Eye"},{id:"copy",label:"Copy id",icon:"Copy"},{id:"sep",type:"separator"},{id:"archive",label:"Archive",icon:"Archive",danger:!0}],$e=[{id:"logs",label:"View logs",icon:"Code"},{id:"restart",label:"Restart pods",icon:"Restart",danger:!0}],Je=[{id:"pause",label:"Pause warm-up",icon:"Settings"},{id:"skip",label:"Skip",icon:"Close1"}],Ke=[{id:"rotate",label:"Rotate now",icon:"Refresh"},{id:"revoke",label:"Revoke key",icon:"Trash",danger:!0}],Qe=[{actor:"api",title:"rolled 4 pods",count:4,code:"svc/api",timestamp:"58m ago",actions:x("Pod actions",$e)},{actor:"web",title:"rolled 3 pods",count:3,code:"svc/web",timestamp:"57m ago",onClick:()=>{}},{hoverTone:"emerald",actions:x("Cache actions",Je),body:e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"min-w-0 truncate text-sm font-medium",children:[e.jsx("span",{className:"font-semibold",children:"cache "}),"warming up"]}),e.jsx("span",{className:"ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500",children:"82%"})]}),e.jsx("div",{className:"mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800",children:e.jsx("div",{className:"h-full w-4/5 rounded-full bg-emerald-500"})})]})}],Xe=[{title:"staging keys rotated",code:"env/staging",timestamp:"2m ago",onClick:()=>{}},{title:"production keys queued",description:"awaiting the approval window",code:"env/prod",timestamp:"1m ago",tone:"amber"}],Ze=()=>{const[i,g]=t.useState(He),[T,te]=t.useState(!0),[I,ne]=t.useState(!0),[P,se]=t.useState(""),[w,ae]=t.useState(!0),[E,oe]=t.useState(!0),[R,ie]=t.useState(!0),[L,le]=t.useState("scroll"),[F,re]=t.useState(!0),[b,de]=t.useState(!1),[l,ce]=t.useState(!1),[v,he]=t.useState(""),[V,ue]=t.useState(!1),[f,me]=t.useState("skeleton"),[c,pe]=t.useState(!1),[h,xe]=t.useState(!1),[y,ge]=t.useState(!0),[j,we]=t.useState("elevated"),[k,be]=t.useState("none"),[M,ve]=t.useState("outlined"),[O,fe]=t.useState("none"),[B,ye]=t.useState(!1),[D,je]=t.useState("none"),[G,ke]=t.useState("none"),[C,Ce]=t.useState(!0),[q,Se]=t.useState("rounded"),[z,Ne]=t.useState("rounded-sm"),[_,Ae]=t.useState("md"),[W,Te]=t.useState(""),[H,Ie]=t.useState(""),[U,Pe]=t.useState(""),[Y,Ee]=t.useState("md"),[$,Re]=t.useState(""),[J,Le]=t.useState(""),Fe=async()=>{await new Promise(n=>setTimeout(n,600)),g(n=>[...n,...Array.from({length:3},(a,r)=>({id:`x${n.length+r}`,title:ee[(n.length+r)%ee.length],actor:Z[(n.length+r)%Z.length],timestamp:`${n.length+r+1}h ago`,tone:["neutral","blue","slate"][r%3]}))])},Ve=t.useMemo(()=>{const n=a=>e.jsx(Oe,{variant:j,tone:k,padding:"sm",className:"min-w-0 flex-1",children:e.jsxs("div",{className:"flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1",children:[e.jsxs("span",{className:"min-w-0 truncate text-sm",children:[e.jsx("span",{className:"font-semibold",children:a.actor})," ",e.jsx("span",{className:"font-medium",children:a.title})]}),e.jsx(m,{tone:a.tone??"neutral",size:"sm",children:a.code??a.category??"custom"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"body override"}),e.jsx(A,{variant:"ghost",size:"sm",className:"ms-auto",onClick:()=>{},children:"Open"})]})});return i.map(a=>({...a,active:b&&a.id==="1",attention:l&&a.id==="4",attentionTone:l&&a.id==="4"&&v||void 0,...h?a.id==="3"?{onClick:void 0,defaultExpanded:y,subItems:Qe,actions:x("Deployment actions",Ye)}:a.id==="1"?{subItems:Xe,actions:x("Security actions",Ke)}:{}:{},...c?{body:n(a)}:{}}))},[i,c,j,k,b,l,v,h,y]);return e.jsx(qe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(_e,{groups:[{id:"parts",title:"Parts",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"filters",checked:T,onChange:te}),e.jsx(o,{label:"tag",checked:I,onChange:ne}),e.jsx(o,{label:"count label",checked:w,onChange:ae}),w&&e.jsx(ze,{label:"Count noun",children:e.jsx(Me,{size:"sm",value:P,placeholder:"events (default)",onChange:n=>se(n.target.value)})}),e.jsx(o,{label:"link",checked:E,onChange:oe}),e.jsx(o,{label:"hasMore",checked:R,onChange:ie}),e.jsx(s,{label:"Load mode",options:[{value:"scroll",label:"Scroll (infinite)"},{value:"button",label:"Button"}],value:L,onChange:n=>le(n)}),e.jsx(o,{label:"scroll (max-h)",checked:F,onChange:re}),e.jsx(o,{label:"active row",checked:b,onChange:de}),e.jsx(o,{label:"attention row",checked:l,onChange:ce}),l&&e.jsx(s,{label:"Attention tone",options:[{value:"",label:"(follow row tone)"},...N],value:v,onChange:he}),e.jsx(o,{label:"loading",checked:V,onChange:ue}),e.jsx(s,{label:"Loader type",options:[{value:"skeleton",label:"Skeleton (default)"},{value:"spinner",label:"Spinner"},{value:"progress",label:"Progress"}],value:f,onChange:n=>me(n)}),e.jsx(o,{label:"custom body",checked:c,onChange:pe}),c&&e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Body variant",options:p,value:j,onChange:n=>we(n)}),e.jsx(S,{label:"Body tone",value:k,onChange:be})]}),e.jsx(o,{label:"sub-items",checked:h,onChange:xe}),h&&e.jsx(o,{label:"sub-items open",checked:y,onChange:ge})]})},{id:"surface",title:"Surface",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Variant",options:p,value:M,onChange:n=>ve(n)}),e.jsx(S,{label:"Surface tone",value:O,onChange:fe}),e.jsx(s,{label:"Item variant",options:p,value:D,onChange:n=>je(n)}),e.jsx(s,{label:"Item corner",options:K,value:q,onChange:n=>Se(n)}),e.jsx(s,{label:"Sub-row corner",options:K,value:z,onChange:n=>Ne(n)}),e.jsx(s,{label:"Sub-row padding",options:Q,value:_,onChange:n=>Ae(n)}),e.jsx(o,{label:"item tone follows card",checked:C,onChange:Ce}),!C&&e.jsx(S,{label:"Item tone",value:G,onChange:ke}),e.jsx(s,{label:"Controls tone",options:[{value:"",label:"(inherit)"},...N],value:$,onChange:n=>Re(n)}),e.jsx(s,{label:"CTA variant",options:X,value:W,onChange:Te}),e.jsx(s,{label:"Load more variant",options:X,value:H,onChange:Ie}),e.jsx(s,{label:"Filter variant",options:We,value:U,onChange:Pe}),e.jsx(s,{label:"Filter tone",options:[{value:"",label:"(inherit)"},...N],value:J,onChange:n=>Le(n)}),e.jsx(s,{label:"Padding",options:Q,value:Y,onChange:n=>Ee(n)}),e.jsx(o,{label:"Raised surface",checked:B,onChange:ye})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Filters match an item's ",e.jsx("code",{children:"category"}),", falling back to its"," ",e.jsx("code",{children:"tone"})," — an item with neither only ever shows under All. With ",e.jsx("strong",{children:"scroll"})," on, ",e.jsx("code",{children:"maxHeight"})," caps the body in a ",e.jsx("code",{children:"ScrollArea"}),": Load more grows the list, the card doesn't. ",e.jsx("strong",{children:"Custom body"})," hands every row's whole content to ",e.jsx("code",{children:"item.body"})," — the kit keeps the wrapper, while each row brings a ",e.jsx("code",{children:"Panel"})," of its own variant and tone. The kit's own rows are Panels too:"," ",e.jsx("strong",{children:"Item variant"})," and ",e.jsx("strong",{children:"Item tone"}),"drive ",e.jsx("code",{children:"rowVariant"})," / ",e.jsx("code",{children:"rowTone"})," /",e.jsx("code",{children:"rowCorner"}),", so the row surface can move under the card — hover wash included. Away from ",e.jsx("code",{children:"none"}),", the list dividers make way for a vertical gap. ",e.jsx("strong",{children:"Active row"})," and"," ",e.jsx("strong",{children:"attention row"})," hand the row Panel its"," ",e.jsx("code",{children:"active"})," rim and ",e.jsx("code",{children:"pulse"})," glow — selection and demand, layering with the hover and with each other — and"," ",e.jsx("strong",{children:"attention tone"})," moves that hue the Panel's own way: ",e.jsx("code",{children:"borderColor ?? tone"}),", blue floor, one hue for rim and glow. ",e.jsx("strong",{children:"Sub-items"})," opens the security row around its existing click — the chevron takes the disclosure as a button of its own — and the deploy row hands its click to the toggle, so the whole row folds open with InfoRow's grid-rows animation; ",e.jsx("strong",{children:"sub-items open"})," seeds that row expanded, and its third line is a custom ",e.jsx("code",{children:"body"}),"."]})]}),preview:e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(d,{title:"Workspace activity",tag:I?"live":"",items:Ve,filters:T?Ue:[],linkLabel:E?"Full audit log":"",totalCount:98,countLabel:w?P||void 0:!1,loading:V,loaderType:f,loaderProgress:f==="progress"?62:void 0,hasMore:R&&i.length<26,onLoadMore:Fe,loadMode:L,maxHeight:F?280:void 0,variant:M,tone:O,raisedSurface:B,rowVariant:D,rowTone:C?void 0:G,rowCorner:q,subRowCorner:z,subRowPadding:_,ctaVariant:W||void 0,loadMoreVariant:H||void 0,filterVariant:U||void 0,padding:Y,controlsTone:$||void 0,filterTone:J||void 0})})})},et=[{id:"1",title:"rotated the signing keys",actor:"Ada",timestamp:"2m ago",tone:"amber",category:"security"},{id:"2",title:"closed as won",actor:"Sales Bot",timestamp:"18m ago",tone:"green",category:"crm",code:"DEAL-2211"},{id:"3",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3},{id:"4",title:"flagged a slow query",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",description:"GET /api/invoices p95 crossed 1.2s on eu-west."},{id:"5",title:"invited two reviewers",actor:"Grace",timestamp:"3h ago",tone:"neutral",category:"crm"},{id:"6",title:"paused the nightly job",actor:"Ops",timestamp:"5h ago",tone:"slate",category:"deploys"}],tt=[{label:"Deploys",value:"deploys"},{label:"CRM",value:"crm"},{label:"Security",value:"security"},{label:"Alerts",value:"alerts"}];function nt(){return e.jsx("div",{className:"mx-auto w-full max-w-2xl",children:e.jsx(d,{title:"Workspace activity",tag:"last 24h",items:et,filters:tt,linkLabel:"Full audit log",totalCount:98,hasMore:!0})})}const st=`import { ActivityFeed, type ActivityFeedItem } from "@cjlapao/ui-kit";

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
`;function at(){return e.jsx("div",{className:"mx-auto w-full max-w-sm",children:e.jsx(d,{title:"Deploys",items:[{id:"a",title:"shipped v2.14.0 to production",timestamp:"now",tone:"green"},{id:"b",title:"canary promoted",timestamp:"4m",tone:"emerald"},{id:"c",title:"rollback armed on checkout-api",timestamp:"12m",tone:"amber"},{id:"d",title:"staging rebuilt",timestamp:"31m",tone:"blue"}]})})}const ot=`import { ActivityFeed } from "@cjlapao/ui-kit";

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
`;function it(){const i=[{id:"sev",title:"checkout-api error rate spiked",timestamp:"2m ago",category:"incidents",body:e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(m,{size:"sm",tone:"rose",children:"SEV-2"}),e.jsx("span",{className:"min-w-0 truncate text-sm font-medium",children:"checkout-api error rate spiked"}),e.jsx("span",{className:"ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500",children:"2m ago"})]}),e.jsx("p",{className:"mt-1 text-xs text-neutral-500 dark:text-neutral-400",children:"5xx ratio at 11.4% in eu-west — mitigation in progress."}),e.jsx("div",{className:"mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800",children:e.jsx("div",{className:"h-full w-2/3 rounded-full bg-rose-500"})}),e.jsxs("div",{className:"mt-2 flex items-center gap-2",children:[e.jsx(A,{size:"xs",variant:"outline",color:"rose",children:"Acknowledge"}),e.jsx(A,{size:"xs",variant:"link",children:"Open incident"})]})]})},{id:"pr",title:"requested your review",timestamp:"26m ago",category:"reviews",onClick:()=>{},body:e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"min-w-0 truncate text-sm font-medium",children:[e.jsx("span",{className:"font-semibold",children:"Ada "}),"requested your review"]}),e.jsx("code",{className:"shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] tracking-tighter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",children:"#413"}),e.jsx("span",{className:"ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500",children:"26m ago"})]}),e.jsxs("div",{className:"mt-1 flex items-center gap-1.5",children:[e.jsx(m,{size:"sm",tone:"emerald",children:"+312"}),e.jsx(m,{size:"sm",tone:"rose",children:"−44"}),e.jsx("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"14 files · payments-service"})]})]})},{id:"plain",title:"merged the release branch",actor:"CI",timestamp:"1h ago",tone:"green",category:"incidents",code:"#412"}];return e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(d,{title:"On-call",items:i,filters:[{label:"Incidents",value:"incidents"},{label:"Reviews",value:"reviews"}]})})}const lt=`import {
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
`;function rt(){const i=[{id:"deploy",title:"deployed the release",actor:"CI",timestamp:"1h ago",tone:"blue",category:"deploys",code:"#412",count:3,defaultExpanded:!0,subItems:[{actor:"api",title:"rolled 4 pods",count:4,code:"svc/api",timestamp:"59m ago"},{actor:"web",title:"rolled 3 pods",count:3,code:"svc/web",timestamp:"58m ago",hoverTone:"amber",onClick:()=>{}},{hoverTone:"emerald",body:e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"min-w-0 truncate text-sm font-medium",children:[e.jsx("span",{className:"font-semibold",children:"cache "}),"warming up"]}),e.jsx("span",{className:"ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500",children:"82%"})]}),e.jsx("div",{className:"mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800",children:e.jsx("div",{className:"h-full w-4/5 rounded-full bg-emerald-500"})})]})}]},{id:"alerts",title:"flagged three slow queries",actor:"Watchdog",timestamp:"2h ago",tone:"rose",category:"alerts",onClick:()=>{},subItems:[{title:"GET /api/invoices",code:"p95 1.2s",timestamp:"2h ago",onClick:()=>{}},{title:"POST /api/checkout",code:"p95 940ms",timestamp:"2h ago"},{title:"GET /api/search",description:"cross-region fan-out, eu-west → us-east",code:"p95 870ms",timestamp:"1h ago"}]},{id:"plain",title:"merged the release branch",actor:"Grace",timestamp:"3h ago",tone:"green",category:"deploys",code:"#411"}];return e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(d,{title:"Release night",items:i,filters:[{label:"Deploys",value:"deploys"},{label:"Alerts",value:"alerts"}]})})}const dt=`import {
  ActivityFeed,
  type ActivityFeedItem,
} from "@cjlapao/ui-kit";

/**
 * Some events have a story under them. \`subItems\` opens a row into a
 * disclosure — InfoRow's grid-rows animation, one level deep —
 * and each entry is either the feed's own row template or a custom \`body\`
 * node, sitting one indent in. A sub may carry its own \`onClick\`: the wash
 * turns into a real button and the click fires alone — it never folds the
 * parent nor reaches the row's action, while a sub without one still
 * reads as the row's own context.
 * Sub-row dots sit one step off the parent's
 * in both themes — darker on light, lighter on dark — each sub rests one
 * depth step off the surface it nestles in, the nested panels' own ladder,
 * so subs read as their own rows; and every sub-row washes under the
 * pointer, in its own tone or a \`hoverTone\` of its own; the custom sub
 * wears emerald to match its bar. The toggle is hybrid: the
 * deploy row has no \`onClick\` of its own, so the whole row is the control
 * and the chevron is decoration; the alert row keeps its action, so the
 * chevron becomes a separate button and the two never interfere.
 * \`defaultExpanded\` seeds the open row; the feed remembers the rest per
 * row id.
 */
export default function SubItems() {
  const items: ActivityFeedItem[] = [
    {
      id: "deploy",
      title: "deployed the release",
      actor: "CI",
      timestamp: "1h ago",
      tone: "blue",
      category: "deploys",
      code: "#412",
      count: 3,
      defaultExpanded: true,
      // No \`onClick\`: the row is the toggle, chevron and all.
      subItems: [
        {
          actor: "api",
          title: "rolled 4 pods",
          count: 4,
          code: "svc/api",
          timestamp: "59m ago",
        },
        {
          actor: "web",
          title: "rolled 3 pods",
          count: 3,
          code: "svc/web",
          timestamp: "58m ago",
          // Hover in a hue of its own; the row above washes in its own
          // tone by default, so only this one needs the field.
          hoverTone: "amber",
          // Its own \`onClick\`: the wash is a real button, and the click
          // fires alone — the row, which is the toggle here, stays open.
          onClick: () => {},
        },
        {
          // A sub-row may be any node — the indent column holds it the
          // same, so a custom sub sits in the same rhythm as the
          // template ones. The wash is the wrapper's, so even a custom
          // sub gets one: emerald, to match its bar.
          hoverTone: "emerald",
          body: (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="min-w-0 truncate text-sm font-medium">
                  <span className="font-semibold">cache </span>
                  warming up
                </span>
                <span className="ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
                  82%
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div className="h-full w-4/5 rounded-full bg-emerald-500" />
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "alerts",
      title: "flagged three slow queries",
      actor: "Watchdog",
      timestamp: "2h ago",
      tone: "rose",
      category: "alerts",
      // The row has its own action, so the chevron takes the disclosure
      // as a button of its own — clicking the row opens the report,
      // clicking the chevron opens the list.
      onClick: () => {},
      subItems: [
        {
          title: "GET /api/invoices",
          code: "p95 1.2s",
          timestamp: "2h ago",
          // A sub's own click stays separate from the row's: clicking this
          // opens the query, not the report the row's \`onClick\` opens.
          onClick: () => {},
        },
        { title: "POST /api/checkout", code: "p95 940ms", timestamp: "2h ago" },
        {
          title: "GET /api/search",
          description: "cross-region fan-out, eu-west → us-east",
          code: "p95 870ms",
          timestamp: "1h ago",
        },
      ],
    },
    {
      id: "plain",
      title: "merged the release branch",
      actor: "Grace",
      timestamp: "3h ago",
      tone: "green",
      category: "deploys",
      code: "#411",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-xl">
      <ActivityFeed
        title="Release night"
        items={items}
        filters={[
          { label: "Deploys", value: "deploys" },
          { label: "Alerts", value: "alerts" },
        ]}
      />
    </div>
  );
}
`,wt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Ge,{name:"Activity Feed",description:"The audit log as a living feed: newest first, toned dots for what happened, a segment control for who or what kind, count badges for what aggregated, and a tail that says there is more. Rows fold open into one level of sub-items — InfoRow's own animation — when an event has a story under them. Rows are dense on purpose — feeds are skimmed, not read. `maxHeight` caps the body in a `ScrollArea`, so Load more grows the list while the card and the tail button stay put."}),e.jsx(Ze,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(u,{title:"Audit Log",description:"The full trail — filterable, counted, with a door to the long form.",code:st,filename:"AuditLog.tsx",children:e.jsx(nt,{})}),e.jsx(u,{title:"Deploy Stream",description:"No filters, no link, just events and a tail — the leanest the component gets.",code:ot,filename:"DeployStream.tsx",children:e.jsx(at,{})}),e.jsx(u,{title:"Custom Rows",description:"An item's body replaces the row's whole content — the feed keeps drawing the row itself, so complex UI sits in the same rhythm as the default rows.",code:lt,filename:"CustomRows.tsx",children:e.jsx(it,{})}),e.jsx(u,{title:"Sub-items",description:"Some events have a story under them: subItems opens a row into a disclosure — one level — each entry either the feed's own row template or a custom body. A sub may carry its own onClick: the hover wash becomes a real button and its click fires alone, folding nothing and never reaching the row's action, while a plain sub stays the row's context. Sub-row dots sit one step off the parent's in both themes, each sub rests on the nested panels' depth step so the rows read as unique, and every sub-row washes under the pointer in its own tone or a hoverTone of its own. The row itself is the toggle when it has no onClick; with one, the chevron becomes a separate button.",code:dt,filename:"SubItems.tsx",children:e.jsx(rt,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsx("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"title"}),", ",e.jsx("code",{children:"items"})," ","(",e.jsx("code",{children:"{ id, title, description?, code?, actor?, timestamp, tone?, category?, count?, body?, actions?, onClick?, active?, attention?, attentionTone?, subItems?, defaultExpanded?, expanded? }"}),"),"," ","where ",e.jsx("code",{children:"body"})," — a node in React, a VNode in Vue — replaces the row's entire content (dot, text and timestamp all stop being drawn) while the feed keeps drawing the row itself — a"," ",e.jsx("code",{children:"Panel"})," on surface ",e.jsx("code",{children:"none"})," at the component's tone, ",e.jsx("code",{children:"rounded"})," corner, ",e.jsx("code",{children:"xs"})," padding — and an"," ",e.jsx("code",{children:"onClick"})," hands that Panel its card-action API: the cursor, the toned hover wash, and (React) the button semantics,"," ","while ",e.jsx("code",{children:"rowVariant"})," / ",e.jsx("code",{children:"rowTone"})," /",e.jsx("code",{children:"rowCorner"})," set that row Panel's surface (default"," ",e.jsx("code",{children:'"none"'}),", the card's own tone, and the corner scale's xs step, ",e.jsx("code",{children:'"rounded"'}),") — ",e.jsx("code",{children:"subRowCorner"})," and"," ",e.jsx("code",{children:"subRowPadding"})," dial the sub-row washes, resting on the corner scale's sm step (",e.jsx("code",{children:'"rounded-sm"'}),") and the padding ladder's ",e.jsx("code",{children:'"md"'})," rung, with bleed, row gap, the column's gutter, and clip room moving in lockstep — and the row's own"," ",e.jsx("code",{children:"active"})," / ",e.jsx("code",{children:"attention"})," hand it the Panel's"," ",e.jsx("code",{children:"active"})," rim and ",e.jsx("code",{children:"pulse"})," glow — with"," ",e.jsx("code",{children:"attentionTone"})," the Panel's own hue override (the row"," ",e.jsx("code",{children:"borderColor"}),": ",e.jsx("code",{children:"borderColor ?? tone"}),", blue floor), shared by rim and glow so a selected-and-pulsing row always agrees,"," ",e.jsx("code",{children:"subItems"})," with ",e.jsx("code",{children:"defaultExpanded"})," /"," ",e.jsx("code",{children:"expanded"})," / ",e.jsx("code",{children:"onToggle"})," (the"," ",e.jsx("code",{children:"toggle(id, expanded)"})," event in Vue) — InfoRow's grid-rows disclosure, one level deep: each sub-item — ",e.jsx("code",{children:"{ title?, description?, code?, actor?, timestamp?, tone?, hoverTone?, onClick?, count?, body?, actions? }"})," — is either the feed's own row template (dot, actor, title, description, code, time, count badge) or a custom"," ",e.jsx("code",{children:"body"})," node, indented to the title's edge and never its own filter match; an ",e.jsx("code",{children:"onClick"})," turns the wash into its own button — the click fires alone, never folding the parent nor reaching the row's action, while a sub without one stays the row's own context and its clicks keep bubbling to the parent card; its dot sits one step off the parent's in both themes — darker on light, lighter on dark — each sub rests one depth step off the surface it nestles in, the nested panels' own ladder, so subs read as their own rows — and the row washes under the pointer in its resolved tone, or a"," ",e.jsx("code",{children:"hoverTone"})," of its own; ",e.jsx("code",{children:"actions"})," paints a right-aligned zone — menus, icon buttons, anything — after the content and before the caret (after a sub-row's time), and its clicks and keys never activate the row or fold its disclosure — with no"," ",e.jsx("code",{children:"onClick"})," the row itself is the toggle (chevron as decoration, the"," ",e.jsx("code",{children:"aria-expanded"})," pair riding the row's Panel), with one the row's action stays untouched and the chevron becomes a real button; ",e.jsx("code",{children:"defaultExpanded"})," seeds the uncontrolled open state, which the feed remembers per row id across filter switches, while ",e.jsx("code",{children:"expanded"})," keeps a row controlled and clicks only report intent,"," ",e.jsx("code",{children:"filters"})," with ",e.jsx("code",{children:"defaultFilter"})," /"," ",e.jsx("code",{children:"onFilterChange"})," (the ",e.jsx("code",{children:"filterChange"})," event in Vue), ",e.jsx("code",{children:"tag"}),", ",e.jsx("code",{children:"linkLabel"})," / ",e.jsx("code",{children:"onLink"}),","," ",e.jsx("code",{children:"hasMore"})," / ",e.jsx("code",{children:"onLoadMore"})," /"," ",e.jsx("code",{children:"loadMoreLabel"}),", ",e.jsx("code",{children:"loading"})," (the feed's own row rhythm in placeholder ink — filters and tail waiting quietly until the events land), whose style ",e.jsx("code",{children:"loaderType"})," picks —"," ",e.jsx("code",{children:"skeleton"})," (the default) rewrites the body, while"," ",e.jsx("code",{children:"spinner"})," / ",e.jsx("code",{children:"progress"})," dim the real rows under a labelled Loader; either way the header tag, the count and the filters yield until the events land,"," ",e.jsx("code",{children:"loaderProgress"})," filling the bar,"," ",e.jsx("code",{children:"loadingMessage"}),' labelling the overlay (defaults to "Loading") and'," ",e.jsx("code",{children:"skeletonRows"})," pinning the placeholder count —"," ",e.jsx("code",{children:"totalCount"})," with ",e.jsx("code",{children:"countLabel"})," beside it (the header's noun is ",e.jsx("code",{children:'"events"'})," — or ",e.jsx("code",{children:'"event"'})," at one — unless a string names it verbatim, ",e.jsx("code",{children:'""'})," leaves the number alone and ",e.jsx("code",{children:"false"})," drops the count from the header entirely),"," ",e.jsx("code",{children:"ctaVariant"})," / ",e.jsx("code",{children:"loadMoreVariant"})," /"," ",e.jsx("code",{children:"filterVariant"})," — every control on the card follows the card's own variant by default (the filter track speaks the same surface vocabulary) unless told otherwise — and the usual card surface, plus ",e.jsx("code",{children:"raisedSurface"}),", which forces the first nested-panels depth step — the tinted-card-on-matching-background fix. The card's"," ",e.jsx("code",{children:"tone"})," is not only the surface: untoned entries inherit it for their dots, and the filters, the link and the tail button all wear it, while a neutral card stays quiet. The All segment is implicit and always first; filters match ",e.jsx("code",{children:"category"})," first and ",e.jsx("code",{children:"tone"})," second, and"," ",e.jsx("code",{children:"timestamp"})," is deliberately pre-formatted — feeds show what the server said, not what the clock is doing. An empty filter result is a state, not an error: the feed shows a quiet empty state."]})})]})]});export{wt as ActivityFeedPage,wt as default};
