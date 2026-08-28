import{r as n,j as e,bO as r,e as R,M as l,l as K}from"./index-8i9ZNynb.js";import{P as Q}from"./PageHeader-CO5k_SQv.js";import{E as d}from"./ExampleCard-LdxcpmX_.js";import{P as X,S as c,C as i,T as o}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as Y}from"./ControlAccordion-Bqp-1oBj.js";import{d as Z,t as ee,n as te,bi as ne,bj as se,bk as oe,bl as ae,bm as le,bn as ie}from"./options-yAU-f7tt.js";const p=[{id:"plan",title:"Plan Changes",subtitle:"Resolve diffs",description:"Review the pending infrastructure changes."},{id:"apply",title:"Apply Changes",subtitle:"Run terraform apply",description:"Provision the resources."},{id:"verify",title:"Verify",subtitle:"Smoke tests",description:"Confirm the deployment is healthy."},{id:"complete",title:"Complete",description:"Notify stakeholders and archive the run."}],re=()=>{const[s,a]=n.useState("elevated"),[g,I]=n.useState("blue"),[f,z]=n.useState("md"),[v,O]=n.useState("horizontal"),[b,L]=n.useState("full"),[y,E]=n.useState("spinner"),[j,V]=n.useState("progress"),[C,A]=n.useState("center"),[S,D]=n.useState("bottom"),[w,W]=n.useState(!0),[k,B]=n.useState(!0),[N,$]=n.useState(!1),[P,M]=n.useState(!1),[T,U]=n.useState(!1),[u,_]=n.useState(!1),[h,F]=n.useState(!1),[G,x]=n.useState(1),[H,m]=n.useState(["plan"]),q=t=>{h||u||(x(t),m(p.slice(0,t).map(J=>J.id??"")))};return e.jsx(X,{previewClassName:"w-full",controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Y,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Variant",options:Z,value:s,onChange:t=>a(t)}),e.jsx(c,{label:"Tone",options:ee,value:g,onChange:t=>I(t)}),e.jsx(c,{label:"Size",options:te,value:f,onChange:t=>z(t)}),e.jsx(i,{label:"Orientation",children:e.jsx(l,{fullWidth:!0,size:"sm",options:ne,value:v,onChange:t=>O(t)})}),e.jsx(c,{label:"Node corner",options:se,value:b,onChange:t=>L(t)})]})},{id:"loader",title:"Loader",controls:e.jsx(i,{label:"Loader type",children:e.jsx(l,{fullWidth:!0,size:"sm",options:oe,value:y,onChange:t=>E(t)})})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Connector",children:e.jsx(l,{fullWidth:!0,size:"sm",options:ae,value:j,onChange:t=>V(t)})}),e.jsx(i,{label:"Connector align",children:e.jsx(l,{fullWidth:!0,size:"sm",options:le,value:C,onChange:t=>A(t)})}),e.jsx(i,{label:"Progress bar position",children:e.jsx(l,{fullWidth:!0,size:"sm",options:ie,value:S,onChange:t=>D(t)})})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Interactive",checked:w,onChange:W}),e.jsx(o,{label:"Animated",checked:k,onChange:B}),e.jsx(o,{label:"Connect nodes",checked:N,onChange:$}),e.jsx(o,{label:"Progress bar",checked:P,onChange:M}),e.jsx(o,{label:"Progress summary",checked:T,onChange:U}),e.jsx(o,{label:"Loading",checked:u,onChange:_}),e.jsx(o,{label:"Disabled",checked:h,onChange:F})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Spinner"})," and ",e.jsx("strong",{children:"progress"})," overlay the node (and the Panel when the whole stepper loads);"," ",e.jsx("strong",{children:"skeleton"})," replaces the content with pulsing discs and lines. Click a step to complete every step before it."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(r,{steps:p,variant:s,tone:g,size:f,orientation:v,nodeCorner:b,connector:j,connectorAlign:C,progressBarPosition:S,connectNodes:N,interactive:w,animated:k,loaderType:y,disabled:h,currentIndex:G,completedStepIds:H,loading:u,showProgressBar:P,showProgressSummary:T,onChange:q}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(R,{size:"sm",variant:"outline",onClick:()=>{x(0),m([])},children:"Reset"}),e.jsx(R,{size:"sm",variant:"outline",onClick:()=>{x(p.length-1),m(p.map(t=>t.id??""))},children:"Mark all complete"})]})]})})},de=()=>e.jsx(r,{steps:[{id:"plan",title:"Plan",subtitle:"Review the diff",description:"Nothing is touched yet — just the plan."},{id:"apply",title:"Apply",subtitle:"Run the migration",description:"3 tables · 2 indexes · 40k rows"},{id:"verify",title:"Verify",subtitle:"Smoke tests",description:"Confirm the target is healthy and logs are clean."}],orientation:"vertical",size:"sm",variant:"outlined",defaultCurrentIndex:1,completedStepIds:["plan"],interactive:!1}),ce=`import { Stepper } from "@cjlapao/ui-kit";

const Vertical = () => (
  <Stepper
    steps={[
      {
        id: "plan",
        title: "Plan",
        subtitle: "Review the diff",
        description: "Nothing is touched yet — just the plan.",
      },
      {
        id: "apply",
        title: "Apply",
        subtitle: "Run the migration",
        description: "3 tables · 2 indexes · 40k rows",
      },
      {
        id: "verify",
        title: "Verify",
        subtitle: "Smoke tests",
        description: "Confirm the target is healthy and logs are clean.",
      },
    ]}
    orientation="vertical"
    size="sm"
    variant="outlined"
    defaultCurrentIndex={1}
    completedStepIds={["plan"]}
    interactive={false}
  />
);

export default Vertical;
`,pe=[{id:"draft",title:"Draft"},{id:"review",title:"Review"},{id:"ship",title:"Ship"}],ue=[{connector:"progress",label:"Progress — runs edge-to-edge and fills up to the active step."},{connector:"line",label:"Line — a static track with a breathing gap around every node."},{connector:"none",label:"None — the nodes only."}],he=()=>e.jsx("div",{className:"flex w-full flex-col gap-4",children:ue.map(({connector:s,label:a})=>e.jsxs("div",{children:[e.jsxs("p",{className:"mb-2 text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{className:"font-semibold text-neutral-700 dark:text-neutral-200",children:s})," ","— ",a]}),e.jsx(r,{steps:pe,connector:s,size:"sm",variant:"outlined",defaultCurrentIndex:1,completedStepIds:["draft"],interactive:!1})]},s))}),xe=`import { Stepper, type StepperConnector } from "@cjlapao/ui-kit";

const steps = [
  { id: "draft", title: "Draft" },
  { id: "review", title: "Review" },
  { id: "ship", title: "Ship" },
];

const rows: { connector: StepperConnector; label: string }[] = [
  {
    connector: "progress",
    label: "Progress — runs edge-to-edge and fills up to the active step.",
  },
  {
    connector: "line",
    label: "Line — a static track with a breathing gap around every node.",
  },
  { connector: "none", label: "None — the nodes only." },
];

const Connectors = () => (
  <div className="flex w-full flex-col gap-4">
    {rows.map(({ connector, label }) => (
      <div key={connector}>
        <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
          <code className="font-semibold text-neutral-700 dark:text-neutral-200">
            {connector}
          </code>{" "}
          — {label}
        </p>
        <Stepper
          steps={steps}
          connector={connector}
          size="sm"
          variant="outlined"
          defaultCurrentIndex={1}
          completedStepIds={["draft"]}
          interactive={false}
        />
      </div>
    ))}
  </div>
);

export default Connectors;
`,me=[{id:"a",title:"Draft"},{id:"b",title:"Review"},{id:"c",title:"Ship"}],ge=()=>e.jsx("div",{className:"grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",children:K.map(s=>e.jsx(r,{steps:me,tone:s,size:"xs",variant:"outlined",padding:"sm",defaultCurrentIndex:1,completedStepIds:["a"],interactive:!1},s))}),fe=`import { Stepper, TRUE_COLORS } from "@cjlapao/ui-kit";

const steps = [
  { id: "a", title: "Draft" },
  { id: "b", title: "Review" },
  { id: "c", title: "Ship" },
];

/**
 * The full 21-colour tone set. Each card is the same three-step workflow in a
 * different tone — the node fill, the completed connector and the active ring
 * all track the tone, on the shared surface.
 */
const EveryTone = () => (
  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {TRUE_COLORS.map((tone) => (
      <Stepper
        key={tone}
        steps={steps}
        tone={tone}
        size="xs"
        variant="outlined"
        padding="sm"
        defaultCurrentIndex={1}
        completedStepIds={["a"]}
        interactive={false}
      />
    ))}
  </div>
);

export default EveryTone;
`,ve=[{id:"a",title:"Draft",subtitle:"Write the spec"},{id:"b",title:"Review",subtitle:"Get sign-off"},{id:"c",title:"Ship",subtitle:"Deploy"}],be=[{loaderType:"spinner",label:"Spinner — the Panel shows a ring overlay."},{loaderType:"progress",label:"Progress — the Panel shows a bar overlay."},{loaderType:"skeleton",label:"Skeleton — the content is replaced by pulsing discs and lines."}],ye=()=>e.jsx("div",{className:"grid w-full grid-cols-1 gap-4 xl:grid-cols-3",children:be.map(({loaderType:s,label:a})=>e.jsxs("div",{className:"min-w-0",children:[e.jsxs("p",{className:"mb-2 text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{className:"font-semibold text-neutral-700 dark:text-neutral-200",children:s})," ","— ",a]}),e.jsx(r,{steps:ve,size:"sm",variant:"outlined",loading:!0,loaderType:s,defaultCurrentIndex:0,interactive:!1})]},s))}),je=`import { Stepper, type StepperLoaderType } from "@cjlapao/ui-kit";

const steps = [
  { id: "a", title: "Draft", subtitle: "Write the spec" },
  { id: "b", title: "Review", subtitle: "Get sign-off" },
  { id: "c", title: "Ship", subtitle: "Deploy" },
];

const rows: { loaderType: StepperLoaderType; label: string }[] = [
  { loaderType: "spinner", label: "Spinner — the Panel shows a ring overlay." },
  { loaderType: "progress", label: "Progress — the Panel shows a bar overlay." },
  {
    loaderType: "skeleton",
    label: "Skeleton — the content is replaced by pulsing discs and lines.",
  },
];

const Loaders = () => (
  <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
    {rows.map(({ loaderType, label }) => (
      <div key={loaderType} className="min-w-0">
        <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
          <code className="font-semibold text-neutral-700 dark:text-neutral-200">
            {loaderType}
          </code>{" "}
          — {label}
        </p>
        <Stepper
          steps={steps}
          size="sm"
          variant="outlined"
          loading
          loaderType={loaderType}
          defaultCurrentIndex={0}
          interactive={false}
        />
      </div>
    ))}
  </div>
);

export default Loaders;
`,Te=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Q,{name:"Stepper",description:"A multi-step workflow on the shared panel surface — clickable steps with a line or progress connector, the full tone set, per-step and whole-stepper loaders (including a skeleton), an optional progress bar, and both orientations."}),e.jsx(re,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Vertical",description:"The same workflow stacked — each step carries its own copy beside the node rail.",code:ce,filename:"Vertical.tsx",children:e.jsx(de,{})}),e.jsx(d,{title:"Connectors",description:"progress fills edge-to-edge up to the active step; line is a static track with a gap around every node; none drops the line entirely.",code:xe,filename:"Connectors.tsx",children:e.jsx(he,{})}),e.jsx(d,{title:"Every tone",description:"The full 21-colour tone set — the node fill, the completed connector and the active ring all track the tone.",code:fe,filename:"EveryTone.tsx",children:e.jsx(ge,{})}),e.jsx(d,{title:"Loaders",description:"spinner and progress overlay the content; skeleton replaces it with pulsing discs and lines.",code:je,filename:"Loaders.tsx",children:e.jsx(ye,{})})]})]});export{Te as StepperPage,Te as default};
