import{r as a,D as P,aZ as c,j as e,a_ as i,M as r,C as Q}from"./index-Bw7SVFgV.js";import{P as X}from"./PageHeader-CQm-NnZo.js";import{E as b}from"./ExampleCard-BR4461qP.js";import{P as ee,C as d,S as s,T as o}from"./PlaygroundPanel-efOYSasM.js";import{C as te}from"./ControlAccordion-BDKCdIsF.js";import{a3 as ae,d as ne,t as A,p as T,e as se,j as oe,k as le,l as ie}from"./options-CREM8uYu.js";const re=["glass","liquid-glass","default"],de=[{label:"Vendor onboarding",value:"vendor"},{label:"Release pipeline",value:"release"},{label:"Empty",value:"empty"}],ce={eyebrow:"NO PIPELINE",title:"Nothing running",steps:[]},pe=()=>{const[n,p]=a.useState("vendor"),[l,O]=a.useState("outlined"),[f,R]=a.useState("neutral"),[u,L]=a.useState("blue"),[x,D]=a.useState(P),[h,V]=a.useState(P),[k,M]=a.useState("none"),[v,B]=a.useState(!1),[g,U]=a.useState(!1),[S,z]=a.useState(!0),[w,F]=a.useState(!0),[j,G]=a.useState(!0),[C,H]=a.useState(!1),[y,$]=a.useState("classic"),[I,q]=a.useState("medium"),[N,K]=a.useState("light"),[E,Y]=a.useState({}),[_,W]=a.useState(null),Z={...n==="vendor"?c:n==="release"?ae:ce,...E[n]?{activeStepId:E[n]}:{},icon:S?e.jsx(Q,{icon:"Rocket",customSize:22,tone:u}):void 0},J=re.includes(l);return e.jsx(ee,{controls:e.jsx(te,{groups:[{id:"content",title:"Content",controls:e.jsx(d,{label:"Data set",children:e.jsx(r,{fullWidth:!0,size:"sm",options:de,value:n,onChange:t=>p(t)})})},{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Card variant",options:ne,value:l,onChange:t=>O(t)}),e.jsx(s,{label:"Card tone",options:A,value:f,onChange:t=>R(t)}),e.jsx(s,{label:"Accent",options:A,value:u,onChange:t=>L(t)}),e.jsx(s,{label:"Corner",options:T,value:x,onChange:t=>D(t)}),e.jsx(s,{label:"Icon corner",options:T,value:h,onChange:t=>V(t)}),e.jsx(s,{label:"Padding",options:se,value:k,onChange:t=>M(t)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(o,{label:"Loading",checked:v,onChange:B}),e.jsx(o,{label:"Interactive",checked:g,onChange:U}),e.jsx(o,{label:"Title icon",checked:S,onChange:z}),e.jsx(o,{label:"Legend",checked:w,onChange:F}),e.jsx(o,{label:"Header",checked:j,onChange:G}),e.jsx(o,{label:"Sticky rail",checked:C,onChange:H})]})},...J?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Specular",children:e.jsx(r,{fullWidth:!0,size:"sm",options:oe,value:y,onChange:t=>$(t)})}),e.jsx(d,{label:"Vibrancy",children:e.jsx(r,{fullWidth:!0,size:"sm",options:le,value:I,onChange:t=>q(t)})}),e.jsx(d,{label:"Glass opacity",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ie,value:N,onChange:t=>K(t)})})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsxs("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:[e.jsx(i,{data:Z,loading:v,accentColor:u,variant:l,cardTone:f,corner:x,iconCorner:h,padding:k,glassOpacity:N,vibrancy:I,specularMode:y,showLegend:w,showHeader:j,stickyRail:C,onStepSelect:g?t=>{Y(m=>({...m,[n]:t})),W(`step "${t}" selected`)}:void 0,onSubStepSelect:g?(t,m)=>W(`sub-step "${m}" of "${t}"`):void 0}),_&&e.jsx("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:_})]})})})};function ue(){const[n,p]=a.useState(c.activeStepId),l={...c,activeStepId:n};return e.jsx("div",{className:"w-full",children:e.jsx(i,{data:l,onStepSelect:p})})}const ge=`import { useState } from "react";
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
`,me={eyebrow:"RELEASE PIPELINE · v2.14.0",title:"orchestrator-api",live:!0,activeStepId:"integration_tests",steps:[{id:"commit",label:"Commit pushed",status:"done",meta:"0m"},{id:"lint",label:"Lint & typecheck",status:"done",meta:"1m 12s"},{id:"unit_tests",label:"Unit tests",status:"done",meta:"3m 41s · 812 passed"},{id:"sbom",label:"SBOM generation",status:"skipped",badge:"Not needed",meta:"Unchanged dependency tree"},{id:"integration_tests",label:"Integration tests",status:"in_progress",badge:"In progress",meta:"6m · 2 of 4 suites",elapsed:"6m",description:"Suites run against an ephemeral stack. A suite is promoted only once its fixtures have been torn down cleanly.",owner:"CI · runner-07",startedAt:"19 Aug · 14:02",sla:"Budget 15m",subSteps:[{id:"api_suite",label:"API contract suite",status:"done",badge:"Passed",badgeTone:"emerald",duration:"2m"},{id:"db_suite",label:"Database migration suite",status:"done",badge:"Passed",badgeTone:"emerald",duration:"1m 50s"},{id:"e2e_suite",label:"End-to-end suite",status:"running",badge:"Running",note:"Shard 2 of 3 — 148 of 210 specs"},{id:"perf_suite",label:"Performance smoke",status:"not_started"}]},{id:"image_scan",label:"Container image scan",status:"attention",badge:"Needs attention",meta:"1 high CVE in base image"},{id:"approval",label:"Release approval",status:"blocked",badge:"Blocked",meta:"Waiting on release manager"},{id:"deploy_staging",label:"Deploy to staging",status:"not_started"},{id:"deploy_prod",label:"Deploy to production",status:"not_started"}]};function be(){return e.jsx("div",{className:"w-full",children:e.jsx(i,{data:me})})}const fe=`import { WorkflowTracker } from "@cjlapao/ui-kit";
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
`,xe={eyebrow:"NO PIPELINE",title:"Nothing running",steps:[]};function he(){return e.jsxs("div",{className:"grid w-full gap-4 xl:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(i,{data:xe}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Empty steps — the built-in placeholder."})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(i,{data:c,loading:!0}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Loading — the rail and cards swap for skeletons."})]})]})}const ke=`import { sampleWorkflow, WorkflowTracker } from "@cjlapao/ui-kit";
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
`,Ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(X,{name:"Workflow Tracker",description:"A pipeline tracker driven by one data object: a status timeline rail, a detail panel for the active step with sub-steps, and roll-up cards for progress, flagged and skipped steps."}),e.jsx(pe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Vendor onboarding",description:"The bundled sampleWorkflow: a live pipeline with a blocked step, an attention flag and an in-progress step whose sub-steps fill the detail panel. Rows are buttons — the parent owns `data.activeStepId`.",code:ge,filename:"VendorOnboarding.tsx",children:e.jsx(ue,{})}),e.jsx(b,{title:"Release pipeline",description:"The same data shape in another domain — a CI release pipeline with running sub-steps, a skipped stage, an attention flag and a blocked approval.",code:fe,filename:"ReleasePipeline.tsx",children:e.jsx(be,{})}),e.jsx(b,{title:"States",description:"Empty steps show the built-in placeholder; `loading` swaps the rail and cards for skeletons.",code:ke,filename:"States.tsx",children:e.jsx(he,{})})]})]});export{Ne as WorkflowTrackerPage,Ne as default};
