import{j as e,V as m,r as n,P as Y,a as Se,a1 as G,gf as Ie,t as Pe,bf as L,H as Le,Y as me,B as De}from"./index-CQwZVYnB.js";import{P as $e}from"./PageHeader-BhZxEVHt.js";import{E as W}from"./ExampleCard-BZsKA5_g.js";import{S as Ee}from"./SurfaceToneControl-LH37fS9y.js";import{a as _e,b as Me,n as le,c as ze,S as oe,d as he,e as xe,f as Oe,M as He,g as je,h as Fe,s as y,u as ie,r as Q,i as re,j as ye,k as Ve,l as Ue,m as Be,W as $}from"./WorkflowTrackerRail-B4KdGyQV.js";import{P as qe,a as D,S as R,T as j}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as Ye}from"./ControlAccordion-C7vC6faF.js";import{ai as Ge,s as Qe,t as Ke,f as fe,p as Je,A as Xe,B as Ze,C as et}from"./options-Byh1yOHz.js";import{P as tt}from"./A11ySections-BXfanEck.js";const st=({active:t,totalSteps:i,palette:a,customStatuses:r,surfaces:s,labels:l,loading:p,onSubStepSelect:h,onStepAction:x})=>{if(p)return e.jsx(_e,{});if(!t)return e.jsx(Me,{title:l.noActiveStep,palette:a,surfaces:s});const{step:o,index:f}=t,c=le(o.status,r),b=o.subSteps??[],g=ze(b),k=[o.owner?{label:l.owner,value:o.owner}:void 0,o.startedAt?{label:l.started,value:o.startedAt}:void 0,o.sla?{label:l.sla,value:o.sla}:void 0].filter(Boolean);return e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("div",{className:"px-5 pb-6 pt-5 sm:px-6",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-x-4 gap-y-2",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsxs(oe,{surfaces:s,children:[l.step," ",f," ",l.of," ",i]}),o.badge&&e.jsx(he,{status:c,palette:a,customStatuses:r,tone:o.badgeTone,children:o.badge})]}),e.jsxs("div",{className:"flex flex-wrap items-center justify-end gap-x-4 gap-y-2",children:[o.elapsed&&e.jsxs(xe,{surfaces:s,children:[l.elapsed," ",o.elapsed]}),e.jsx(Oe,{stepId:o.id,actions:o.actions??[],palette:a,groupLabel:l.quickActions,onAction:x})]})]}),e.jsx("h3",{className:"mt-3 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl",children:o.label}),o.description&&e.jsx("p",{className:m("mt-2 max-w-3xl text-sm leading-6",s.mutedText),children:o.description}),k.length>0&&e.jsx("div",{className:"mt-5 flex flex-wrap gap-x-10 gap-y-4",children:k.map(u=>e.jsx(He,{label:u.label,value:u.value,surfaces:s},u.label))})]}),b.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:m("flex flex-wrap items-center justify-between gap-2 border-y px-5 py-2.5 sm:px-6",s.border,s.strip),children:[e.jsx(oe,{surfaces:s,children:l.subSteps}),e.jsxs(xe,{surfaces:s,children:[g.accepted," ",l.accepted," · ",g.skipped," ",l.skipped," · ",g.open," ",l.open]})]}),e.jsx("ul",{className:m("m-0 list-none divide-y p-0",s.divider),children:b.map(u=>{const N=le(u.status,r),_=N==="running",v=e.jsxs(e.Fragment,{children:[e.jsx(je,{status:N,palette:a,customStatuses:r}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"text-sm font-medium text-neutral-800 dark:text-neutral-100",children:u.label}),u.note&&e.jsx("p",{className:m("mt-0.5 text-xs leading-5",s.mutedText),children:u.note})]}),u.badge&&e.jsx(he,{status:N,palette:a,customStatuses:r,tone:u.badgeTone,children:u.badge}),e.jsx("span",{className:m("w-10 shrink-0 text-right text-xs tabular-nums",s.faintText),children:u.duration??"—"})]}),I=m("flex w-full items-center gap-3 px-5 py-3 text-left sm:px-6",_&&Fe(a.accent,s.translucent));return e.jsx("li",{children:h?e.jsx("button",{type:"button",onClick:()=>h(o.id,u.id),className:m(I,"focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500"),children:v}):e.jsx("div",{className:I,children:v})},u.id)})})]})]})},de=({data:t=y,loading:i=!1,labels:a,cardClassName:r,onSubStepSelect:s,onStepAction:l,className:p,style:h,...x})=>{const o=t?.steps??[],{palette:f,surfaces:c,customStatuses:b}=ie(x),g=n.useMemo(()=>Q(a),[a]),k=re(x),u=n.useMemo(()=>ye(o,t?.activeStepId),[o,t?.activeStepId]);return e.jsx(Y,{...k,className:m(p,r),style:h,children:e.jsx(st,{active:u,totalSteps:o.length,palette:f,customStatuses:b,surfaces:c,labels:g,loading:i,onSubStepSelect:s,onStepAction:l})})},at=({details:t,ariaLabel:i,cardProps:a,className:r,style:s})=>e.jsx(Y,{...a,flexBody:!0,className:m("flex-1",r),style:s,children:e.jsx(Se,{variant:"hover",className:"h-full",mask:!0,role:"region","aria-label":i,children:t})}),Ne=({data:t=y,loading:i=!1,labels:a,cardClassName:r,className:s,style:l,...p})=>{const h=t?.steps??[],x=n.useMemo(()=>Q(a),[a]),o=re(p),c=n.useMemo(()=>ye(h,t?.activeStepId),[h,t?.activeStepId])?.step.details;return i||c==null||c===""?null:e.jsx(at,{details:c,ariaLabel:x.details,cardProps:o,className:m(s,r),style:l})},be=({title:t,steps:i,palette:a,customStatuses:r,surfaces:s})=>e.jsxs("div",{className:"px-5 py-4",children:[e.jsx(oe,{surfaces:s,children:t}),e.jsx("ul",{className:"mt-3 space-y-3",children:i.map(l=>e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx(je,{status:le(l.status,r),palette:a,customStatuses:r,className:"mt-0.5"}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"text-sm font-medium text-neutral-800 dark:text-neutral-100",children:l.label}),l.meta&&e.jsx("p",{className:m("mt-0.5 text-xs leading-5",s.mutedText),children:l.meta})]})]},l.id))})]}),Ce=({data:t=y,loading:i=!1,labels:a,className:r,style:s,...l})=>{const p=t?.steps??[],{palette:h,surfaces:x,customStatuses:o}=ie(l),f=n.useMemo(()=>Q(a),[a]),c=re(l),b=n.useMemo(()=>Ve(p,o),[p,o]),g=n.useMemo(()=>Ue(p),[p]);return i||b.length===0&&g.length===0?null:e.jsxs("div",{className:m("grid grid-cols-1 gap-5 @xl:grid-cols-2",r),style:s,children:[b.length>0&&e.jsx(Y,{...c,children:e.jsx(be,{title:f.needsAttention,steps:b,palette:h,customStatuses:o,surfaces:x})}),g.length>0&&e.jsx(Y,{...c,children:e.jsx(be,{title:f.skippedSteps,steps:g,palette:h,customStatuses:o,surfaces:x})})]})},E=({data:t=y,accentColor:i="blue",attentionColor:a="rose",blockedColor:r="amber",failedColor:s="red",customStatuses:l,mutedColor:p="neutral",variant:h="outlined",cardTone:x="none",translucentSurfaces:o,glassOpacity:f="light",vibrancy:c,specularMode:b,raisedSurface:g=!1,corner:k=G,iconCorner:u=G,padding:N="none",maxWidth:_=1180,railWidth:v=360,stickyRail:I=!1,fillHeight:C=!1,fillHeightOffset:M=0,loading:w=!1,loadingRows:K=6,maxVisibleSubSteps:F,subStepLoadMode:J="scroll",subStepOrder:V="reverse",emptyState:X,showHeader:P=!0,showLegend:Z=!0,labels:S,onStepSelect:ee,disableFutureSteps:T=!1,onSubStepSelect:U,onStepAction:z,className:te,style:B,...se})=>{const A={accentColor:i,attentionColor:a,blockedColor:r,failedColor:s,customStatuses:l,mutedColor:p,variant:h,cardTone:x,corner:k,glassOpacity:f,vibrancy:c,specularMode:b,raisedSurface:g,padding:N,translucentSurfaces:o},{surfaces:O}=ie(A),q=n.useMemo(()=>Q(S),[S]),ae={"--wt-rail-width":typeof v=="number"?`${v}px`:v,"--wt-fill-offset":typeof M=="number"?`${M}px`:M};return e.jsxs("div",{className:m("@container w-full",te),style:{maxWidth:_,...ae,...B},"aria-busy":w||void 0,...se,children:[P&&w&&e.jsx(Be,{hasIcon:!!t?.icon,iconCorner:u}),P&&!w&&e.jsxs("header",{className:"mb-5 flex flex-wrap items-start justify-between gap-3",children:[e.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[t?.icon&&e.jsx("span",{className:m("flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover",Ie(u),O.chip),children:t.icon}),e.jsxs("div",{className:"min-w-0",children:[t?.eyebrow&&e.jsx("p",{className:m("text-[11px] font-semibold uppercase tracking-widest",O.faintText),children:t.eyebrow}),e.jsx("h2",{className:"mt-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl",children:t?.title})]})]}),t?.live&&e.jsxs(Pe,{size:"md",tone:p,variant:"outline",className:m("tracking-wide",O.chip),children:[e.jsx("span",{"aria-hidden":"true",className:m("mr-2 inline-block h-1.5 w-1.5 rounded-full",`bg-${i}-500 dark:bg-${i}-400`)}),q.live]})]}),e.jsxs("div",{className:m("grid grid-cols-1 items-start gap-5 @4xl:grid-cols-[var(--wt-rail-width)_minmax(0,1fr)]",C&&"@4xl:h-[calc(100dvh-var(--wt-fill-offset))]"),children:[e.jsx($,{...A,data:t,loading:w,loadingRows:K,maxVisibleSubSteps:F,subStepLoadMode:J,subStepOrder:V,showLegend:Z,emptyState:X,labels:S,cardScrollable:C,cardClassName:m(I&&!C&&"@4xl:sticky @4xl:top-6",C&&"@4xl:min-h-0 @4xl:self-stretch"),onStepSelect:ee,disableFutureSteps:T,onSubStepSelect:U,onStepAction:z}),e.jsxs("div",{className:m("@container flex min-w-0 flex-col gap-5",C&&"@4xl:min-h-0 @4xl:self-stretch"),children:[e.jsx(de,{...A,data:t,loading:w,labels:S,onSubStepSelect:U,onStepAction:z}),e.jsx(Ne,{...A,data:t,loading:w,labels:S}),e.jsx(Ce,{...A,data:t,loading:w,labels:S})]})]})]})},nt=["glass","liquid-glass","default"],lt=[{label:"Vendor onboarding",value:"vendor"},{label:"Release pipeline",value:"release"},{label:"Empty",value:"empty"}],ot={eyebrow:"NO PIPELINE",title:"Nothing running",steps:[]},it=[{label:"0",value:"0px"},{label:"88px",value:"88px"},{label:"10vh",value:"10vh"}],rt=[{label:"All",value:""},{label:"2",value:"2"},{label:"4",value:"4"}],dt=[{label:"Scroll",value:"scroll"},{label:"Button",value:"button"}],ct=[{label:"Newest first",value:"reverse"},{label:"Oldest first",value:"forward"}],pt=()=>{const[t,i]=n.useState("vendor"),[a,r]=n.useState("outlined"),[s,l]=n.useState("none"),[p,h]=n.useState("blue"),[x,o]=n.useState(G),[f,c]=n.useState(G),[b,g]=n.useState("none"),[k,u]=n.useState(!1),[N,_]=n.useState(!1),[v,I]=n.useState(!1),[C,M]=n.useState(!0),[w,K]=n.useState(!0),[F,J]=n.useState(!0),[V,X]=n.useState(!1),[P,Z]=n.useState(!1),[S,ee]=n.useState("0px"),[T,U]=n.useState(""),[z,te]=n.useState("scroll"),[B,se]=n.useState("reverse"),[A,O]=n.useState("classic"),[q,ae]=n.useState("medium"),[ce,Ae]=n.useState("light"),[pe,We]=n.useState({}),[ue,ne]=n.useState(null),Te={...t==="vendor"?y:t==="release"?Ge:ot,...pe[t]?{activeStepId:pe[t]}:{},icon:C?e.jsx(Le,{icon:"Rocket",customSize:22,tone:p}):void 0},Re=nt.includes(a);return e.jsx(qe,{controls:e.jsx(Ye,{groups:[{id:"content",title:"Content",controls:e.jsx(D,{label:"Data set",children:e.jsx(L,{fullWidth:!0,size:"sm",options:lt,value:t,onChange:d=>i(d)})})},{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(R,{label:"Card variant",options:Qe,value:a,onChange:d=>r(d)}),e.jsx(Ee,{label:"Card tone",value:s,onChange:l}),e.jsx(R,{label:"Accent",options:Ke,value:p,onChange:d=>h(d)}),e.jsx(R,{label:"Corner",options:fe,value:x,onChange:d=>o(d)}),e.jsx(R,{label:"Icon corner",options:fe,value:f,onChange:d=>c(d)}),e.jsx(R,{label:"Padding",options:Je,value:b,onChange:d=>g(d)}),e.jsx(j,{label:"Raised surface",checked:k,onChange:u})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(j,{label:"Loading",checked:N,onChange:_}),e.jsx(j,{label:"Interactive",checked:v,onChange:I}),e.jsx(j,{label:"Title icon",checked:C,onChange:M}),e.jsx(j,{label:"Legend",checked:w,onChange:K}),e.jsx(j,{label:"Header",checked:F,onChange:J}),e.jsx(j,{label:"Sticky rail",checked:V,onChange:X}),e.jsx(j,{label:"Fill height",checked:P,onChange:Z}),P&&e.jsx(R,{label:"Fill offset",options:it,value:S,onChange:ee}),e.jsx(R,{label:"Rail sub-step cap",options:rt,value:T,onChange:U}),T!==""&&e.jsx(D,{label:"Sub-step reveal",children:e.jsx(L,{fullWidth:!0,size:"sm",options:dt,value:z,onChange:d=>te(d)})}),T!==""&&e.jsx(D,{label:"Sub-step order",children:e.jsx(L,{fullWidth:!0,size:"sm",options:ct,value:B,onChange:d=>se(d)})})]})},...Re?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(D,{label:"Specular",children:e.jsx(L,{fullWidth:!0,size:"sm",options:Xe,value:A,onChange:d=>O(d)})}),e.jsx(D,{label:"Vibrancy",children:e.jsx(L,{fullWidth:!0,size:"sm",options:Ze,value:q,onChange:d=>ae(d)})}),e.jsx(D,{label:"Glass opacity",children:e.jsx(L,{fullWidth:!0,size:"sm",options:et,value:ce,onChange:d=>Ae(d)})})]})}]:[]]}),preview:e.jsxs("div",{className:"w-full",children:[e.jsx(E,{data:Te,loading:N,accentColor:p,variant:a,cardTone:s,corner:x,iconCorner:f,padding:b,raisedSurface:k,glassOpacity:ce,vibrancy:q,specularMode:A,showLegend:w,showHeader:F,stickyRail:V,fillHeight:P,fillHeightOffset:S,maxVisibleSubSteps:T===""?void 0:Number(T),subStepLoadMode:z,subStepOrder:B,onStepSelect:v?d=>{We(H=>({...H,[t]:d})),ne(`step "${d}" selected`)}:void 0,onSubStepSelect:v?(d,H)=>ne(`sub-step "${H}" of "${d}"`):void 0,onStepAction:v?(d,H)=>ne(`action "${H}" on step "${d}"`):void 0}),ue&&e.jsx("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:ue})]})})};function ut(){const[t,i]=n.useState(y.activeStepId),a={...y,activeStepId:t};return e.jsx("div",{className:"w-full",children:e.jsx(E,{data:a,onStepSelect:i})})}const mt=`import { useState } from "react";
import { sampleWorkflow, WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

export default function VendorOnboarding() {
  const [activeStepId, setActiveStepId] = useState<string | undefined>(
    sampleWorkflow.activeStepId,
  );
  const data: WorkflowData = { ...sampleWorkflow, activeStepId };

  return (
    <div className="w-full">
      <WorkflowTracker data={data} onStepSelect={setActiveStepId} />
    </div>
  );
}
`,ht={eyebrow:"RELEASE PIPELINE · v2.14.0",title:"orchestrator-api",live:!0,activeStepId:"integration_tests",steps:[{id:"commit",label:"Commit pushed",status:"done",meta:"0m"},{id:"lint",label:"Lint & typecheck",status:"done",meta:"1m 12s"},{id:"unit_tests",label:"Unit tests",status:"done",meta:"3m 41s · 812 passed"},{id:"sbom",label:"SBOM generation",status:"skipped",badge:"Not needed",meta:"Unchanged dependency tree"},{id:"integration_tests",label:"Integration tests",status:"in_progress",badge:"In progress",meta:"6m · 2 of 4 suites",elapsed:"6m",description:"Suites run against an ephemeral stack. A suite is promoted only once its fixtures have been torn down cleanly.",owner:"CI · runner-07",startedAt:"19 Aug · 14:02",sla:"Budget 15m",subSteps:[{id:"api_suite",label:"API contract suite",status:"done",badge:"Passed",badgeTone:"emerald",duration:"2m"},{id:"db_suite",label:"Database migration suite",status:"done",badge:"Passed",badgeTone:"emerald",duration:"1m 50s"},{id:"e2e_suite",label:"End-to-end suite",status:"running",badge:"Running",note:"Shard 2 of 3 — 148 of 210 specs"},{id:"perf_suite",label:"Performance smoke",status:"not_started"}]},{id:"image_scan",label:"Container image scan",status:"attention",badge:"Needs attention",meta:"1 high CVE in base image"},{id:"approval",label:"Release approval",status:"blocked",badge:"Blocked",meta:"Waiting on release manager"},{id:"deploy_staging",label:"Deploy to staging",status:"not_started"},{id:"deploy_prod",label:"Deploy to production",status:"not_started"}]};function xt(){return e.jsx("div",{className:"w-full",children:e.jsx(E,{data:ht})})}const ft=`import { WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

/** The same data shape in another domain — a CI release pipeline. */
const releaseWorkflow: WorkflowData = {
  eyebrow: "RELEASE PIPELINE · v2.14.0",
  title: "orchestrator-api",
  live: true,
  activeStepId: "integration_tests",
  steps: [
    { id: "commit", label: "Commit pushed", status: "done", meta: "0m" },
    { id: "lint", label: "Lint & typecheck", status: "done", meta: "1m 12s" },
    {
      id: "unit_tests",
      label: "Unit tests",
      status: "done",
      meta: "3m 41s · 812 passed",
    },
    {
      id: "sbom",
      label: "SBOM generation",
      status: "skipped",
      badge: "Not needed",
      meta: "Unchanged dependency tree",
    },
    {
      id: "integration_tests",
      label: "Integration tests",
      status: "in_progress",
      badge: "In progress",
      meta: "6m · 2 of 4 suites",
      elapsed: "6m",
      description:
        "Suites run against an ephemeral stack. A suite is promoted only once its fixtures have been torn down cleanly.",
      owner: "CI · runner-07",
      startedAt: "19 Aug · 14:02",
      sla: "Budget 15m",
      subSteps: [
        {
          id: "api_suite",
          label: "API contract suite",
          status: "done",
          badge: "Passed",
          badgeTone: "emerald",
          duration: "2m",
        },
        {
          id: "db_suite",
          label: "Database migration suite",
          status: "done",
          badge: "Passed",
          badgeTone: "emerald",
          duration: "1m 50s",
        },
        {
          id: "e2e_suite",
          label: "End-to-end suite",
          status: "running",
          badge: "Running",
          note: "Shard 2 of 3 — 148 of 210 specs",
        },
        { id: "perf_suite", label: "Performance smoke", status: "not_started" },
      ],
    },
    {
      id: "image_scan",
      label: "Container image scan",
      status: "attention",
      badge: "Needs attention",
      meta: "1 high CVE in base image",
    },
    {
      id: "approval",
      label: "Release approval",
      status: "blocked",
      badge: "Blocked",
      meta: "Waiting on release manager",
    },
    { id: "deploy_staging", label: "Deploy to staging", status: "not_started" },
    { id: "deploy_prod", label: "Deploy to production", status: "not_started" },
  ],
};

export default function ReleasePipeline() {
  return (
    <div className="w-full">
      <WorkflowTracker data={releaseWorkflow} />
    </div>
  );
}
`,ge=({files:t})=>e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Artifacts and changes"}),e.jsx("ul",{className:"mt-2 flex flex-wrap gap-2",children:t.map(i=>e.jsx("li",{className:"rounded-full border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300",children:i},i))})]}),bt=[{id:"survey",label:"survey",status:"done",badge:"ok",meta:"Cost $0.001262 · Step time 13s",elapsed:"13s",description:"Model step · Outcome: ok · Produces: SURVEY.md",details:e.jsxs("div",{className:"space-y-4 px-5 py-4 sm:px-6",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-x-10 gap-y-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Status"}),e.jsx("p",{className:"mt-1 text-sm text-neutral-800 dark:text-neutral-100",children:"done · ok"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Cost"}),e.jsx("p",{className:"mt-1 text-sm tabular-nums text-neutral-800 dark:text-neutral-100",children:"$0.001262"})]})]}),e.jsx(ge,{files:["SURVEY.md"]})]})},{id:"approve",label:"approve",status:"attention",badge:"Waiting",meta:"No model cost · queued 40m",elapsed:"40m",description:"Human gate · Outcome: pending",actions:[{id:"approve",label:"Approve",tone:"emerald"},{id:"decline",label:"Decline",tone:"rose"}],details:e.jsx("p",{className:"px-5 py-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:px-6",children:"The run owner is deciding on the digest. The gate carries no model cost and its wall time is measured by the runner, not the step. Approving releases the queued summarise step."})},{id:"summarise",label:"summarise",status:"not_started",meta:"Queued behind the gate",description:"Model step · Produces: SUMMARY.md",details:e.jsxs("div",{className:"space-y-4 px-5 py-4 sm:px-6",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"Will stream the digest from SURVEY.md once the gate approves. The final artifact appears in the list below when the model finishes."}),e.jsx(ge,{files:["SURVEY.md","SUMMARY.md (queued)"]})]})}];function gt(){const[t,i]=n.useState("approve"),[a,r]=n.useState(null);return e.jsxs("div",{className:"w-full",children:[e.jsx(E,{data:{eyebrow:"MODEL RUN · REQ-8841",title:"Quarterly digest",live:!0,activeStepId:t,steps:bt},accentColor:"emerald",onStepSelect:i,onStepAction:(s,l)=>r(`"${l}" on step "${s}"`)}),a&&e.jsx("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:a})]})}const vt=`import { useState } from "react";
import { WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowStep } from "@cjlapao/ui-kit";

/** Chips row shared by the details nodes. */
const Artifacts = ({ files }: { files: string[] }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
      Artifacts and changes
    </p>
    <ul className="mt-2 flex flex-wrap gap-2">
      {files.map((file) => (
        <li
          key={file}
          className="rounded-full border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
        >
          {file}
        </li>
      ))}
    </ul>
  </div>
);

const steps: WorkflowStep[] = [
  {
    id: "survey",
    label: "survey",
    status: "done",
    badge: "ok",
    meta: "Cost $0.001262 · Step time 13s",
    elapsed: "13s",
    description: "Model step · Outcome: ok · Produces: SURVEY.md",
    details: (
      <div className="space-y-4 px-5 py-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Status
            </p>
            <p className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">
              done · ok
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Cost
            </p>
            <p className="mt-1 text-sm tabular-nums text-neutral-800 dark:text-neutral-100">
              $0.001262
            </p>
          </div>
        </div>
        <Artifacts files={["SURVEY.md"]} />
      </div>
    ),
  },
  {
    id: "approve",
    label: "approve",
    status: "attention",
    badge: "Waiting",
    meta: "No model cost · queued 40m",
    elapsed: "40m",
    description: "Human gate · Outcome: pending",
    actions: [
      { id: "approve", label: "Approve", tone: "emerald" },
      { id: "decline", label: "Decline", tone: "rose" },
    ],
    details: (
      <p className="px-5 py-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:px-6">
        The run owner is deciding on the digest. The gate carries no model
        cost and its wall time is measured by the runner, not the step.
        Approving releases the queued summarise step.
      </p>
    ),
  },
  {
    id: "summarise",
    label: "summarise",
    status: "not_started",
    meta: "Queued behind the gate",
    description: "Model step · Produces: SUMMARY.md",
    details: (
      <div className="space-y-4 px-5 py-4 sm:px-6">
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Will stream the digest from SURVEY.md once the gate approves. The
          final artifact appears in the list below when the model finishes.
        </p>
        <Artifacts files={["SURVEY.md", "SUMMARY.md (queued)"]} />
      </div>
    ),
  },
];

export default function DetailsCard() {
  // The parent owns the active step; whichever one it picks shows its
  // \`details\` node in the scrollable card below the step card. The gate's
  // quick actions come from \`actions\` + \`onStepAction\` — supplied here,
  // so they render in the rail row and the step card header.
  const [activeStepId, setActiveStepId] = useState("approve");
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="w-full">
      <WorkflowTracker
        data={{
          eyebrow: "MODEL RUN · REQ-8841",
          title: "Quarterly digest",
          live: true,
          activeStepId,
          steps,
        }}
        accentColor="emerald"
        onStepSelect={setActiveStepId}
        onStepAction={(stepId, actionId) =>
          setLastAction(\`"\${actionId}" on step "\${stepId}"\`)
        }
      />
      {lastAction && (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {lastAction}
        </p>
      )}
    </div>
  );
}
`;function wt(){const[t,i]=n.useState("insurance_certificates"),[a,r]=n.useState(null),s={...y,activeStepId:t};return e.jsxs("div",{className:"flex w-full flex-col gap-4 xl:flex-row xl:items-start",children:[e.jsx("div",{className:"w-full xl:w-80 xl:shrink-0",children:e.jsx($,{data:s,showLegend:!1,onStepSelect:i,onStepAction:(l,p)=>r(`"${p}" on step "${l}"`)})}),e.jsxs("div",{className:"flex min-w-0 flex-1 flex-col gap-4",children:[e.jsx(de,{data:s,onStepAction:(l,p)=>r(`"${p}" on step "${l}"`)}),e.jsx(Ne,{data:s}),e.jsx(Ce,{data:s}),a&&e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:a})]})]})}const kt=`import { useState } from "react";
import {
  sampleWorkflow,
  WorkflowTrackerDetails,
  WorkflowTrackerRail,
  WorkflowTrackerRollups,
  WorkflowTrackerStepDetails,
} from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

/**
 * The composite is a layout of the same four parts exported individually:
 * the rail, the step details, the scrollable details body and the roll-up
 * grid. They are stateless — one \`activeStepId\` in the parent's state
 * drives all of them, so they can be drawn wherever the page wants them.
 */
export default function ComposableParts() {
  const [activeStepId, setActiveStepId] = useState<string | undefined>(
    "insurance_certificates",
  );
  const [lastAction, setLastAction] = useState<string | null>(null);

  const data: WorkflowData = { ...sampleWorkflow, activeStepId };

  return (
    <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-start">
      {/* The rail, as a compact sidebar card. */}
      <div className="w-full xl:w-80 xl:shrink-0">
        <WorkflowTrackerRail
          data={data}
          showLegend={false}
          onStepSelect={setActiveStepId}
          onStepAction={(stepId, actionId) =>
            setLastAction(\`"\${actionId}" on step "\${stepId}"\`)
          }
        />
      </div>

      {/* Step details and the details body, stacked wherever they fit. */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <WorkflowTrackerStepDetails
          data={data}
          onStepAction={(stepId, actionId) =>
            setLastAction(\`"\${actionId}" on step "\${stepId}"\`)
          }
        />
        <WorkflowTrackerDetails data={data} />
        <WorkflowTrackerRollups data={data} />
        {lastAction && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {lastAction}
          </p>
        )}
      </div>
    </div>
  );
}
`,St={eyebrow:"NO PIPELINE",title:"Nothing running",steps:[]};function jt(){return e.jsxs("div",{className:"grid w-full gap-4 xl:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(E,{data:St}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Empty steps — the built-in placeholder."})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(E,{data:y,loading:!0}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Loading — the rail and cards swap for skeletons."})]})]})}const yt=`import { sampleWorkflow, WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

const empty: WorkflowData = {
  eyebrow: "NO PIPELINE",
  title: "Nothing running",
  steps: [],
};

export default function States() {
  return (
    <div className="grid w-full gap-4 xl:grid-cols-2">
      <div className="flex flex-col gap-2">
        <WorkflowTracker data={empty} />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Empty steps — the built-in placeholder.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <WorkflowTracker data={sampleWorkflow} loading />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Loading — the rail and cards swap for skeletons.
        </p>
      </div>
    </div>
  );
}
`,Nt={title:"Release pipeline",steps:[{id:"build",label:"Build",status:"done",description:"Application bundles are ready."},{id:"test",label:"Tests",status:"running",description:"Integration tests are running."},{id:"approve",label:"Approval",status:"blocked",description:"Waiting for release approval."},{id:"deploy",label:"Deploy",status:"not_started",description:"Deployment starts after approval."}]},Ct=[{id:"surveyor",initial:"S",name:"surveyor",note:"analyzing file hierarchy",status:"running",color:"bg-indigo-500"},{id:"linter",initial:"L",name:"linter",note:"vetting code styles",status:"running",color:"bg-teal-600"},{id:"summariser",initial:"M",name:"summariser",note:"awaiting review gate",status:"idle",color:"bg-neutral-400"}];function At({collapsed:t}){return e.jsxs("div",{className:`flex items-center ${t?"justify-center":"justify-between gap-2"}`,children:[e.jsx("h3",{className:t?"text-[8px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400":"text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300",children:t?"Agents":"Orchestrated agents"}),!t&&e.jsx("span",{className:"text-xs text-blue-600 dark:text-blue-300",children:"3 Total"})]})}function Wt({collapsed:t}){const[i,a]=n.useState("all"),r=[{id:"all",initial:"◎",name:"Loop view — all activity",note:"unified stream",status:"running",color:"bg-blue-600"},...Ct];return e.jsxs("section",{"aria-label":"Orchestrated agents",className:"min-w-0",children:[e.jsx("div",{className:"space-y-2",children:r.map(s=>e.jsxs("button",{type:"button","aria-label":`${s.name}, ${s.status}`,"aria-pressed":i===s.id,title:t?`${s.name} — ${s.status}`:void 0,onClick:()=>a(s.id),className:`relative flex w-full items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${t?"justify-center py-1":"gap-2 p-2 text-left"} ${i===s.id?"bg-blue-600 text-white":"text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"}`,children:[e.jsx("span",{className:`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${s.color}`,children:s.initial}),t?e.jsx("span",{"aria-hidden":"true",className:`absolute right-0 top-0 h-1.5 w-1.5 rounded-full ${s.status==="running"?"bg-emerald-400":"bg-neutral-400"}`}):e.jsxs("span",{className:"min-w-0 flex-1",children:[e.jsxs("span",{className:"flex items-center justify-between gap-2 text-xs",children:[e.jsx("span",{className:"truncate font-semibold",children:s.name}),s.id!=="all"&&e.jsx("span",{className:"text-[10px]",children:s.status})]}),e.jsx("span",{className:"mt-0.5 block truncate text-[10px] opacity-80",children:s.note})]})]},s.id))}),!t&&e.jsxs("figure",{className:"mt-5 rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950",children:[e.jsxs("figcaption",{className:"flex justify-between text-[10px] font-semibold uppercase text-neutral-600 dark:text-neutral-300",children:["Loop footprint"," ",e.jsx("span",{className:"text-blue-600 dark:text-blue-300",children:"Live"})]}),e.jsx("div",{"aria-hidden":"true",className:"mt-3 flex h-10 items-end gap-1",children:[35,60,28,80,55,95].map((s,l)=>e.jsx("span",{className:"flex-1 rounded-t bg-blue-500",style:{height:`${s}%`,opacity:.35+l*.13}},l))}),e.jsxs("p",{className:"mt-2 flex justify-between text-[10px] text-neutral-500 dark:text-neutral-400",children:[e.jsx("span",{children:"Tokens: 14.8k"}),e.jsx("span",{children:"$0.0011"})]})]})]})}function Tt(){const[t,i]=n.useState("test"),[a,r]=n.useState(!0),s={...Nt,activeStepId:t},[l,p]=n.useState(!0),[h,x]=n.useState(30),[o,f]=n.useState("layout");return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(me,{label:"Resizable agents footer",size:"sm",checked:l,onChange:c=>p(c.target.checked)}),e.jsx(me,{label:"motion=slide",size:"sm",checked:o==="slide",onChange:c=>f(c.target.checked?"slide":"layout")}),e.jsxs("span",{className:"text-xs text-neutral-500",children:["Footer: ",Math.round(h),"%"]}),e.jsx(De,{size:"xs",variant:"ghost",onClick:()=>x(30),children:"Reset to 30%"})]}),e.jsxs("div",{className:"flex h-[480px] w-full min-w-0 gap-4",children:[e.jsx($,{data:s,side:"left",corner:"rounded-lg",collapsible:!0,collapsed:a,onCollapsedChange:r,motion:o,fillHeight:!0,footerResizable:l,footerHeight:h,onFooterHeightChange:x,footerLabel:"Orchestrated agents",style:{width:"min(320px, 65vw)"},onStepSelect:i,renderStepPopover:c=>e.jsxs("div",{className:"max-w-64 space-y-2",children:[e.jsx("p",{className:"font-semibold",children:c.label}),e.jsx("p",{className:"text-sm",children:c.description}),e.jsx("button",{type:"button",className:"text-sm underline",onClick:()=>i(c.id),children:"View step details"})]}),stepPopoverProps:{maxWidth:300},renderControlsHeader:({collapsed:c})=>e.jsx(At,{collapsed:c}),renderControls:({collapsed:c})=>e.jsx(Wt,{collapsed:c})}),e.jsx(Se,{variant:"hover",className:"min-w-0 flex-1",children:e.jsx(de,{data:s})})]})]})}const Rt=`import { useState } from "react";
import {
  WorkflowTrackerRail,
  WorkflowTrackerStepDetails,
  ScrollArea,
  Toggle,
  Button,
  type WorkflowData,
} from "@cjlapao/ui-kit";

const workflow: WorkflowData = {
  title: "Release pipeline",
  steps: [
    {
      id: "build",
      label: "Build",
      status: "done",
      description: "Application bundles are ready.",
    },
    {
      id: "test",
      label: "Tests",
      status: "running",
      description: "Integration tests are running.",
    },
    {
      id: "approve",
      label: "Approval",
      status: "blocked",
      description: "Waiting for release approval.",
    },
    {
      id: "deploy",
      label: "Deploy",
      status: "not_started",
      description: "Deployment starts after approval.",
    },
  ],
};

const agents = [
  {
    id: "surveyor",
    initial: "S",
    name: "surveyor",
    note: "analyzing file hierarchy",
    status: "running",
    color: "bg-indigo-500",
  },
  {
    id: "linter",
    initial: "L",
    name: "linter",
    note: "vetting code styles",
    status: "running",
    color: "bg-teal-600",
  },
  {
    id: "summariser",
    initial: "M",
    name: "summariser",
    note: "awaiting review gate",
    status: "idle",
    color: "bg-neutral-400",
  },
];

function AgentControlsHeader({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={\`flex items-center \${collapsed ? "justify-center" : "justify-between gap-2"}\`}
    >
      <h3
        className={
          collapsed
            ? "text-[8px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
            : "text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300"
        }
      >
        {collapsed ? "Agents" : "Orchestrated agents"}
      </h3>
      {!collapsed && (
        <span className="text-xs text-blue-600 dark:text-blue-300">
          3 Total
        </span>
      )}
    </div>
  );
}


// Consumer-owned UI and state. The rail only supplies its effective collapse state.
function AgentControls({ collapsed }: { collapsed: boolean }) {
  const [selected, setSelected] = useState("all");
  const entries = [
    {
      id: "all",
      initial: "◎",
      name: "Loop view — all activity",
      note: "unified stream",
      status: "running",
      color: "bg-blue-600",
    },
    ...agents,
  ];
  return (
    <section aria-label="Orchestrated agents" className="min-w-0">
      <div className="space-y-2">
        {entries.map((agent) => (
          <button
            key={agent.id}
            type="button"
            aria-label={\`\${agent.name}, \${agent.status}\`}
            aria-pressed={selected === agent.id}
            title={collapsed ? \`\${agent.name} — \${agent.status}\` : undefined}
            onClick={() => setSelected(agent.id)}
            className={\`relative flex w-full items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 \${collapsed ? "justify-center py-1" : "gap-2 p-2 text-left"} \${selected === agent.id ? "bg-blue-600 text-white" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"}\`}
          >
            <span
              className={\`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white \${agent.color}\`}
            >
              {agent.initial}
            </span>
            {collapsed ? (
              <span
                aria-hidden="true"
                className={\`absolute right-0 top-0 h-1.5 w-1.5 rounded-full \${agent.status === "running" ? "bg-emerald-400" : "bg-neutral-400"}\`}
              />
            ) : (
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-semibold">{agent.name}</span>
                  {agent.id !== "all" && (
                    <span className="text-[10px]">{agent.status}</span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[10px] opacity-80">
                  {agent.note}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>
      {!collapsed && (
        <figure className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
          <figcaption className="flex justify-between text-[10px] font-semibold uppercase text-neutral-600 dark:text-neutral-300">
            Loop footprint{" "}
            <span className="text-blue-600 dark:text-blue-300">Live</span>
          </figcaption>
          <div aria-hidden="true" className="mt-3 flex h-10 items-end gap-1">
            {[35, 60, 28, 80, 55, 95].map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t bg-blue-500"
                style={{ height: \`\${height}%\`, opacity: 0.35 + index * 0.13 }}
              />
            ))}
          </div>
          <p className="mt-2 flex justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
            <span>Tokens: 14.8k</span>
            <span>$0.0011</span>
          </p>
        </figure>
      )}
    </section>
  );
}

export default function CollapsibleRail() {
  const [activeStepId, setActiveStepId] = useState("test");
  const [collapsed, setCollapsed] = useState(true);
  const data = { ...workflow, activeStepId };
  const [footerResizable, setFooterResizable] = useState(true);
  const [footerHeight, setFooterHeight] = useState(30);
  // \`layout\` sweeps the rail's width on SidePanel's shared curve — one
  // property, the card inset riding inside the shell's containment. \`slide\`
  // takes the final width in a single layout and sweeps the content on the
  // compositor; the space beside the rail snaps to its new size at once.
  const [motion, setMotion] = useState<"layout" | "slide">("layout");

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Toggle label="Resizable agents footer" size="sm" checked={footerResizable} onChange={event => setFooterResizable(event.target.checked)} />
        <Toggle label="motion=slide" size="sm" checked={motion === "slide"} onChange={event => setMotion(event.target.checked ? "slide" : "layout")} />
        <span className="text-xs text-neutral-500">Footer: {Math.round(footerHeight)}%</span>
        <Button size="xs" variant="ghost" onClick={() => setFooterHeight(30)}>Reset to 30%</Button>
      </div>
      <div className="flex h-[480px] w-full min-w-0 gap-4">
      <WorkflowTrackerRail
        data={data}
        side="left"
        corner="rounded-lg"
        collapsible
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        motion={motion}
        fillHeight
        footerResizable={footerResizable}
        footerHeight={footerHeight}
        onFooterHeightChange={setFooterHeight}
        footerLabel="Orchestrated agents"
        style={{ width: "min(320px, 65vw)" }}
        onStepSelect={setActiveStepId}
        renderStepPopover={(step) => (
          <div className="max-w-64 space-y-2">
            <p className="font-semibold">{step.label}</p>
            <p className="text-sm">{step.description}</p>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setActiveStepId(step.id)}
            >
              View step details
            </button>
          </div>
        )}
        stepPopoverProps={{ maxWidth: 300 }}
        renderControlsHeader={({ collapsed }) => (
          <AgentControlsHeader collapsed={collapsed} />
        )}
        renderControls={({ collapsed }) => (
          <AgentControls collapsed={collapsed} />
        )}
      />
      <ScrollArea variant="hover" className="min-w-0 flex-1">
        <WorkflowTrackerStepDetails data={data} />
      </ScrollArea>
      </div>
    </div>
  );
}
`;function It(){const[t,i]=n.useState(!0),[a,r]=n.useState("build"),s={title:"Release pipeline",activeStepId:a,steps:[{id:"prepare",label:"Prepare",status:"done"},{id:"build",label:"Build",status:"running"},{id:"review",label:"Review",status:"not_started",meta:"Waiting for the build"},{id:"deploy",label:"Deploy",status:"not_started"},{id:"archive",label:"Archive",status:"done",disabled:!0,meta:"Explicitly disabled by the app"}]};return e.jsxs("div",{className:"w-full max-w-sm space-y-4",children:[e.jsx(j,{label:"Disable future stages",checked:t,onChange:i}),e.jsx($,{data:s,collapsible:!0,disableFutureSteps:t,onStepSelect:r,renderStepPopover:l=>e.jsx("span",{children:l.label})}),e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:"Try both expanded and collapsed views. Running and completed stages stay selectable; Archive is always disabled."})]})}const Pt=`import { useState } from "react";
import { WorkflowTrackerRail, type WorkflowData } from "@cjlapao/ui-kit";
import { ToggleRow } from "../../../shared/PlaygroundPanel";

export default function LockedStages() {
  const [locked, setLocked] = useState(true);
  const [activeStepId, setActiveStepId] = useState("build");
  const data: WorkflowData = {
    title: "Release pipeline", activeStepId,
    steps: [
      { id: "prepare", label: "Prepare", status: "done" },
      { id: "build", label: "Build", status: "running" },
      { id: "review", label: "Review", status: "not_started", meta: "Waiting for the build" },
      { id: "deploy", label: "Deploy", status: "not_started" },
      { id: "archive", label: "Archive", status: "done", disabled: true, meta: "Explicitly disabled by the app" },
    ],
  };
  return <div className="w-full max-w-sm space-y-4">
    <ToggleRow label="Disable future stages" checked={locked} onChange={setLocked} />
    <WorkflowTrackerRail data={data} collapsible disableFutureSteps={locked} onStepSelect={setActiveStepId}
      renderStepPopover={step => <span>{step.label}</span>} />
    <p className="text-xs text-neutral-600 dark:text-neutral-400">Try both expanded and collapsed views. Running and completed stages stay selectable; Archive is always disabled.</p>
  </div>;
}
`,ve=["done","done","done","running","failed"],we=t=>Array.from({length:t},(i,a)=>({id:`call-${a+1}`,label:a%3===0?`bash: npm test -- --filter pkg-${a+1}`:a%3===1?`read: src/components/Widget${a+1}.tsx`:`write: src/components/Widget${a+1}.test.tsx`,status:a===t-1?"running":ve[a%ve.length]})),ke=t=>({title:"Nightly build",activeStepId:"build",steps:[{id:"checkout",label:"Checkout",status:"done"},{id:"build",label:"build",status:"running",badge:"RUNNING",meta:"1 agent · 5m 50s · 26 calls",subSteps:t},{id:"publish",label:"Publish",status:"not_started"}]});function Lt(){return e.jsxs("div",{className:"flex w-full flex-wrap gap-4",children:[e.jsx($,{data:ke(we(18)),maxVisibleSubSteps:4,subStepLoadMode:"scroll",style:{width:340}}),e.jsx($,{data:ke(we(18)),maxVisibleSubSteps:4,subStepLoadMode:"button",subStepOrder:"forward",style:{width:340}})]})}const Dt=`import {
  WorkflowTrackerRail,
  type WorkflowData,
  type WorkflowSubStep,
} from "@cjlapao/ui-kit";

// The agent-run shape: one long build step whose tool calls pile up as
// sub-steps. Past the cap they fold away.
//
// Left: \`scroll\` + the default \`reverse\` order — the box opens on the
// newest tail (scrolled to the bottom), capped at the height of the first
// page; scrolling up reveals the past, page by page, without the rows
// under the viewport ever jumping.
//
// Right: \`button\` + \`forward\` order — the chronological reading: open on
// the oldest head, each \`Show N more\` click reveals one more page of the
// future, and \`Show less\` folds back.
const statuses: WorkflowSubStep["status"][] = [
  "done",
  "done",
  "done",
  "running",
  "failed",
];

const buildSteps = (count: number): WorkflowSubStep[] =>
  Array.from({ length: count }, (_, index) => ({
    id: \`call-\${index + 1}\`,
    label:
      index % 3 === 0
        ? \`bash: npm test -- --filter pkg-\${index + 1}\`
        : index % 3 === 1
          ? \`read: src/components/Widget\${index + 1}.tsx\`
          : \`write: src/components/Widget\${index + 1}.test.tsx\`,
    status:
      index === count - 1
        ? "running"
        : statuses[index % statuses.length],
  }));

const data = (subSteps: WorkflowSubStep[]): WorkflowData => ({
  title: "Nightly build",
  activeStepId: "build",
  steps: [
    { id: "checkout", label: "Checkout", status: "done" },
    {
      id: "build",
      label: "build",
      status: "running",
      badge: "RUNNING",
      meta: "1 agent · 5m 50s · 26 calls",
      subSteps,
    },
    { id: "publish", label: "Publish", status: "not_started" },
  ],
});

export default function SubStepCap() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <WorkflowTrackerRail
        data={data(buildSteps(18))}
        maxVisibleSubSteps={4}
        subStepLoadMode="scroll"
        style={{ width: 340 }}
      />
      <WorkflowTrackerRail
        data={data(buildSteps(18))}
        maxVisibleSubSteps={4}
        subStepLoadMode="button"
        subStepOrder="forward"
        style={{ width: 340 }}
      />
    </div>
  );
}
`,Bt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($e,{name:"Workflow Tracker",description:"A pipeline tracker driven by one data object: a status timeline rail, a detail panel for the active step with sub-steps, a scrollable details card under it for caller-supplied content, quick-action buttons for gate-type steps, and roll-up cards for progress, flagged and skipped steps. Usable as a whole or panel-by-panel through the standalone parts."}),e.jsx(pt,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(W,{title:"Vendor onboarding",description:"The bundled sampleWorkflow: a live pipeline with a blocked step, an attention flag and an in-progress step whose sub-steps fill the detail panel. Rows are buttons — the parent owns `data.activeStepId`.",code:mt,filename:"VendorOnboarding.tsx",children:e.jsx(ut,{})}),e.jsx(W,{title:"Release pipeline",description:"The same data shape in another domain — a CI release pipeline with running sub-steps, a skipped stage, an attention flag and a blocked approval.",code:ft,filename:"ReleasePipeline.tsx",children:e.jsx(xt,{})}),e.jsx(W,{title:"Step details card",description:"A step's `details` node renders in its own card below the step card, framed by the tracker and wrapped in a `ScrollArea`. The `approve` gate uses `actions` + `onStepAction` for its Approve/Decline quick actions — quiet `xs` soft buttons in the rail row and the step card header. `fillHeight` (see the playground) stretches the details card to the viewport bottom so the page never scrolls.",code:vt,filename:"DetailsCard.tsx",children:e.jsx(gt,{})}),e.jsx(W,{title:"Composable parts",description:"The composite is a layout of three parts the kit also exports on its own: `WorkflowTrackerRail`, `WorkflowTrackerStepDetails` and `WorkflowTrackerDetails`. Each derives from the same `data` object and stays stateless — one parent-owned `activeStepId` keeps them in sync wherever they are drawn.",code:kt,filename:"ComposableParts.tsx",children:e.jsx(wt,{})}),e.jsx(W,{title:"Collapsible standalone rail",description:"Use `collapsible` for an animated compact rail, with `defaultCollapsed` for internal state or `collapsed` + `onCollapsedChange` for controlled state. `fillHeight` fills a parent with a defined height and scrolls the timeline internally. Set `style.width` to customize the expanded width. Select a status node in either mode to update the details. `renderStepPopover(step)` supplies custom hover/focus content when collapsed; `stepPopoverProps` customizes its presentation. `renderControls={({ collapsed }) => ...}` adds a separately scrolling footer below the steps, with compact and expanded layouts. Put its heading in `renderControlsHeader` so the title stays fixed above the scrolling content. In a height-constrained rail it starts at 30% of the steps/footer space. Enable `footerResizable` to drag the divider or resize with ArrowUp/ArrowDown, Home and End. Use `defaultFooterHeight` for initial sizing, or `footerHeight` + `onFooterHeightChange` for controlled percentages (10–80). Without fillHeight the sections keep their natural document flow. The compact header retains the progress percentage. Set side='left' or side='right' to round the content-facing corners, mirror the toggle and place step popovers toward the body; corner sets the radius. Compact status tiles highlight only on hover and use smaller, flat status icons.",code:Rt,filename:"CollapsibleRail.tsx",children:e.jsx(Tt,{})}),e.jsx(W,{title:"Capped sub-steps",description:"`maxVisibleSubSteps` caps the rail's nested box; the rest fold away behind `subStepLoadMode`. `scroll` (default) turns the box into a `ScrollArea` capped at the height of the first page — the kit's shared infinite-scroll watch reveals the next rows as you near the fold, so the rail never grows. `button` reveals one page per click behind a counting `Show N more` / `Show less` tail. `subStepOrder` decides which end the first page keeps: `reverse` (default) opens on the newest tail and reveals the past (scroll up / Show more), `forward` opens on the oldest head and reveals the future. Labels truncate to one line. The step detail panel's table is never capped.",code:Dt,filename:"SubStepCap.tsx",children:e.jsx(Lt,{})}),e.jsx(W,{title:"States",description:"Empty steps show the built-in placeholder; `loading` swaps the rail and cards for skeletons.",code:yt,filename:"States.tsx",children:e.jsx(jt,{})}),e.jsx(W,{title:"Lock future stages",description:"disableFutureSteps prevents not_started stages from being selected or previewed. step.disabled explicitly locks any stage. Neither responds to hover or keyboard focus, in expanded or collapsed mode.",code:Pt,filename:"LockedStages.tsx",children:e.jsx(It,{})})]}),e.jsx(tt,{props:[{name:"renderControlsHeader",type:"({ collapsed }) => ReactNode",description:"WorkflowTrackerRail: render a fixed footer title or header above the controls scroll area. Header and controls receive the same collapse state; only renderControls content scrolls."},{name:"footerResizable",type:"boolean",default:"false",description:"WorkflowTrackerRail: enable a pointer- and keyboard-accessible horizontal separator between the steps and renderControls footer. Requires fillHeight (or cardScrollable in a constrained layout) and footer content."},{name:"defaultFooterHeight / footerHeight / onFooterHeightChange",type:"number / number / (percent: number) => void",default:"30 / uncontrolled",description:"Footer share of available steps/footer height, in percent. Bounded to 10–80 so both independently scrolling sections remain usable. Controlled sizing can reset or persist the user's choice. Collapse and loading preserve footer content and size."},{name:"footerLabel / footerResizeLabel",type:"string",default:"Workflow footer / Resize workflow footer",description:"WorkflowTrackerRail: accessible names for the footer scroll region and resizing separator."},{name:"disableFutureSteps",type:"boolean",default:"false",description:"WorkflowTracker and WorkflowTrackerRail: disable stages with normalized status not_started. Running, completed, skipped, blocked and attention stages remain available unless explicitly disabled."},{name:"step.disabled",type:"boolean",default:"false",description:"Disable an individual stage regardless of status. Disables rail selection, hover/focus previews and rail quick actions. The status remains visible; controlled activeStepId is not changed."},{name:"maxVisibleSubSteps",type:"number",default:"all",description:"WorkflowTracker and WorkflowTrackerRail: sub-steps the rail's nested box shows before the rest fold away. Unset, or set past the count, every sub-step renders. The step detail panel's table is never capped."},{name:"subStepLoadMode",type:'"scroll" | "button"',default:'"scroll"',description:'How rows past maxVisibleSubSteps are revealed. "scroll" caps the nested box at the height of the first page and scrolls inside a ScrollArea, the shared infinite-scroll watch revealing the next rows near the fold (it degrades to the button without an IntersectionObserver). "button" reveals one page per click behind a Show N more / Show less tail, localized via the showMore/showLess labels — showMore carries a {count} placeholder.'},{name:"subStepOrder",type:'"reverse" | "forward"',default:'"reverse"',description:'Which end of the list the first page keeps. "reverse" is the live-tail reading: the newest sub-steps stay visible, the box opens at the bottom, and both tails reveal the past (scroll up / Show more); rows appended by a live run keep the reader pinned at the bottom. "forward" is the chronological reading — the oldest head first, tails revealing the future.'},{name:"raisedSurface",type:"boolean",default:"false",description:"Forwards to each card's Panel — forces at least the first nested-panels depth step, so a tinted card stays visible on a matching background (the tinted-card-on-matching-background fix). See Panel's `raisedSurface`."}]})]});export{Bt as WorkflowTrackerPage,Bt as default};
