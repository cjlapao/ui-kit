import{r as a,D as P,aw as c,j as e,ax as i,M as r,C as X}from"./index-BqiwG-pR.js";import{P as Z,C as d,S as s,T as o,a as ee,E as b}from"./PlaygroundPanel-DuiPtEP5.js";import{_ as te,c as ae,t as A,p as T,d as ne,i as se,j as oe,k as le}from"./options-CD99P1yv.js";const ie=["glass","liquid-glass","default"],re=[{label:"Vendor onboarding",value:"vendor"},{label:"Release pipeline",value:"release"},{label:"Empty",value:"empty"}],de={eyebrow:"NO PIPELINE",title:"Nothing running",steps:[]},ce=()=>{const[n,p]=a.useState("vendor"),[l,O]=a.useState("outlined"),[x,R]=a.useState("neutral"),[u,L]=a.useState("blue"),[f,D]=a.useState(P),[h,V]=a.useState(P),[k,M]=a.useState("none"),[v,B]=a.useState(!1),[g,U]=a.useState(!1),[S,z]=a.useState(!0),[w,F]=a.useState(!0),[j,G]=a.useState(!0),[y,H]=a.useState(!1),[C,$]=a.useState("classic"),[I,q]=a.useState("medium"),[N,K]=a.useState("light"),[E,Y]=a.useState({}),[_,W]=a.useState(null),J={...n==="vendor"?c:n==="release"?te:de,...E[n]?{activeStepId:E[n]}:{},icon:S?e.jsx(X,{icon:"Rocket",customSize:22,tone:u}):void 0},Q=ie.includes(l);return e.jsx(Z,{controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Data set",children:e.jsx(r,{fullWidth:!0,size:"sm",options:re,value:n,onChange:t=>p(t)})}),e.jsx(s,{label:"Card variant",options:ae,value:l,onChange:t=>O(t)}),e.jsx(s,{label:"Card tone",options:A,value:x,onChange:t=>R(t)}),e.jsx(s,{label:"Accent",options:A,value:u,onChange:t=>L(t)}),e.jsx(s,{label:"Corner",options:T,value:f,onChange:t=>D(t)}),e.jsx(s,{label:"Icon corner",options:T,value:h,onChange:t=>V(t)}),e.jsx(s,{label:"Padding",options:ne,value:k,onChange:t=>M(t)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(o,{label:"Loading",checked:v,onChange:B}),e.jsx(o,{label:"Interactive",checked:g,onChange:U}),e.jsx(o,{label:"Title icon",checked:S,onChange:z}),e.jsx(o,{label:"Legend",checked:w,onChange:F}),e.jsx(o,{label:"Header",checked:j,onChange:G}),e.jsx(o,{label:"Sticky rail",checked:y,onChange:H})]}),Q&&e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Specular",children:e.jsx(r,{fullWidth:!0,size:"sm",options:se,value:C,onChange:t=>$(t)})}),e.jsx(d,{label:"Vibrancy",children:e.jsx(r,{fullWidth:!0,size:"sm",options:oe,value:I,onChange:t=>q(t)})}),e.jsx(d,{label:"Glass opacity",children:e.jsx(r,{fullWidth:!0,size:"sm",options:le,value:N,onChange:t=>K(t)})})]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsxs("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:[e.jsx(i,{data:J,loading:v,accentColor:u,variant:l,cardTone:x,corner:f,iconCorner:h,padding:k,glassOpacity:N,vibrancy:I,specularMode:C,showLegend:w,showHeader:j,stickyRail:y,onStepSelect:g?t=>{Y(m=>({...m,[n]:t})),W(`step "${t}" selected`)}:void 0,onSubStepSelect:g?(t,m)=>W(`sub-step "${m}" of "${t}"`):void 0}),_&&e.jsx("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:_})]})})})};function pe(){const[n,p]=a.useState(c.activeStepId),l={...c,activeStepId:n};return e.jsx("div",{className:"w-full",children:e.jsx(i,{data:l,onStepSelect:p})})}const ue=`import { useState } from "react";
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
`,ge={eyebrow:"RELEASE PIPELINE · v2.14.0",title:"orchestrator-api",live:!0,activeStepId:"integration_tests",steps:[{id:"commit",label:"Commit pushed",status:"done",meta:"0m"},{id:"lint",label:"Lint & typecheck",status:"done",meta:"1m 12s"},{id:"unit_tests",label:"Unit tests",status:"done",meta:"3m 41s · 812 passed"},{id:"sbom",label:"SBOM generation",status:"skipped",badge:"Not needed",meta:"Unchanged dependency tree"},{id:"integration_tests",label:"Integration tests",status:"in_progress",badge:"In progress",meta:"6m · 2 of 4 suites",elapsed:"6m",description:"Suites run against an ephemeral stack. A suite is promoted only once its fixtures have been torn down cleanly.",owner:"CI · runner-07",startedAt:"19 Aug · 14:02",sla:"Budget 15m",subSteps:[{id:"api_suite",label:"API contract suite",status:"done",badge:"Passed",badgeTone:"emerald",duration:"2m"},{id:"db_suite",label:"Database migration suite",status:"done",badge:"Passed",badgeTone:"emerald",duration:"1m 50s"},{id:"e2e_suite",label:"End-to-end suite",status:"running",badge:"Running",note:"Shard 2 of 3 — 148 of 210 specs"},{id:"perf_suite",label:"Performance smoke",status:"not_started"}]},{id:"image_scan",label:"Container image scan",status:"attention",badge:"Needs attention",meta:"1 high CVE in base image"},{id:"approval",label:"Release approval",status:"blocked",badge:"Blocked",meta:"Waiting on release manager"},{id:"deploy_staging",label:"Deploy to staging",status:"not_started"},{id:"deploy_prod",label:"Deploy to production",status:"not_started"}]};function me(){return e.jsx("div",{className:"w-full",children:e.jsx(i,{data:ge})})}const be=`import { WorkflowTracker } from "@cjlapao/ui-kit";
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
`,xe={eyebrow:"NO PIPELINE",title:"Nothing running",steps:[]};function fe(){return e.jsxs("div",{className:"grid w-full gap-4 xl:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(i,{data:xe}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Empty steps — the built-in placeholder."})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(i,{data:c,loading:!0}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Loading — the rail and cards swap for skeletons."})]})]})}const he=`import { sampleWorkflow, WorkflowTracker } from "@cjlapao/ui-kit";
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
`,je=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ee,{name:"Workflow Tracker",description:"A pipeline tracker driven by one data object: a status timeline rail, a detail panel for the active step with sub-steps, and roll-up cards for progress, flagged and skipped steps."}),e.jsx(ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Vendor onboarding",description:"The bundled sampleWorkflow: a live pipeline with a blocked step, an attention flag and an in-progress step whose sub-steps fill the detail panel. Rows are buttons — the parent owns `data.activeStepId`.",code:ue,filename:"VendorOnboarding.tsx",children:e.jsx(pe,{})}),e.jsx(b,{title:"Release pipeline",description:"The same data shape in another domain — a CI release pipeline with running sub-steps, a skipped stage, an attention flag and a blocked approval.",code:be,filename:"ReleasePipeline.tsx",children:e.jsx(me,{})}),e.jsx(b,{title:"States",description:"Empty steps show the built-in placeholder; `loading` swaps the rail and cards for skeletons.",code:he,filename:"States.tsx",children:e.jsx(fe,{})})]})]});export{je as WorkflowTrackerPage,je as default};
