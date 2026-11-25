import{r as n,j as e,iA as i,B as I,bf as l,bg as X}from"./index-CQwZVYnB.js";import{P as Y}from"./PageHeader-BhZxEVHt.js";import{E as d}from"./ExampleCard-BZsKA5_g.js";import{S as Z}from"./SurfaceToneControl-LH37fS9y.js";import{P as ee,S as g,T as a,a as r}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as te}from"./ControlAccordion-C7vC6faF.js";import{s as ne,c as se,bC as ae,bD as oe,bE as le,bF as re,bG as ie,bH as de}from"./options-Byh1yOHz.js";const c=[{id:"plan",title:"Plan Changes",subtitle:"Resolve diffs",description:"Review the pending infrastructure changes."},{id:"apply",title:"Apply Changes",subtitle:"Run terraform apply",description:"Provision the resources."},{id:"verify",title:"Verify",subtitle:"Smoke tests",description:"Confirm the deployment is healthy."},{id:"complete",title:"Complete",description:"Notify stakeholders and archive the run."}],ce=()=>{const[s,o]=n.useState("elevated"),[m,z]=n.useState("none"),[f,L]=n.useState(!1),[v,O]=n.useState("md"),[b,E]=n.useState("horizontal"),[y,A]=n.useState("full"),[S,D]=n.useState("spinner"),[C,V]=n.useState("progress"),[j,B]=n.useState("center"),[w,W]=n.useState("bottom"),[k,$]=n.useState(!0),[N,F]=n.useState(!0),[P,G]=n.useState(!1),[T,U]=n.useState(!1),[R,_]=n.useState(!1),[p,H]=n.useState(!1),[u,M]=n.useState(!1),[q,h]=n.useState(1),[J,x]=n.useState(["plan"]),K=t=>{u||p||(h(t),x(c.slice(0,t).map(Q=>Q.id??"")))};return e.jsx(ee,{previewClassName:"w-full",controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(te,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:ne,value:s,onChange:t=>o(t)}),e.jsx(Z,{label:"Tone",value:m,onChange:z}),e.jsx(a,{label:"Raised surface",checked:f,onChange:L}),e.jsx(g,{label:"Size",options:se,value:v,onChange:t=>O(t)}),e.jsx(r,{label:"Orientation",children:e.jsx(l,{fullWidth:!0,size:"sm",options:ae,value:b,onChange:t=>E(t)})}),e.jsx(g,{label:"Node corner",options:oe,value:y,onChange:t=>A(t)})]})},{id:"loader",title:"Loader",controls:e.jsx(r,{label:"Loader type",children:e.jsx(l,{fullWidth:!0,size:"sm",options:le,value:S,onChange:t=>D(t)})})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Connector",children:e.jsx(l,{fullWidth:!0,size:"sm",options:re,value:C,onChange:t=>V(t)})}),e.jsx(r,{label:"Connector align",children:e.jsx(l,{fullWidth:!0,size:"sm",options:ie,value:j,onChange:t=>B(t)})}),e.jsx(r,{label:"Progress bar position",children:e.jsx(l,{fullWidth:!0,size:"sm",options:de,value:w,onChange:t=>W(t)})})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(a,{label:"Interactive",checked:k,onChange:$}),e.jsx(a,{label:"Animated",checked:N,onChange:F}),e.jsx(a,{label:"Connect nodes",checked:P,onChange:G}),e.jsx(a,{label:"Progress bar",checked:T,onChange:U}),e.jsx(a,{label:"Progress summary",checked:R,onChange:_}),e.jsx(a,{label:"Loading",checked:p,onChange:H}),e.jsx(a,{label:"Disabled",checked:u,onChange:M})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Spinner"})," and ",e.jsx("strong",{children:"progress"})," overlay the node (and the Panel when the whole stepper loads);"," ",e.jsx("strong",{children:"skeleton"})," replaces the content with pulsing discs and lines. Click a step to complete every step before it."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(i,{steps:c,variant:s,tone:m,raisedSurface:f,size:v,orientation:b,nodeCorner:y,connector:C,connectorAlign:j,progressBarPosition:w,connectNodes:P,interactive:k,animated:N,loaderType:S,disabled:u,currentIndex:q,completedStepIds:J,loading:p,showProgressBar:T,showProgressSummary:R,onChange:K}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(I,{size:"sm",variant:"outline",onClick:()=>{h(0),x([])},children:"Reset"}),e.jsx(I,{size:"sm",variant:"outline",onClick:()=>{h(c.length-1),x(c.map(t=>t.id??""))},children:"Mark all complete"})]})]})})},pe=()=>e.jsx(i,{steps:[{id:"plan",title:"Plan",subtitle:"Review the diff",description:"Nothing is touched yet — just the plan."},{id:"apply",title:"Apply",subtitle:"Run the migration",description:"3 tables · 2 indexes · 40k rows"},{id:"verify",title:"Verify",subtitle:"Smoke tests",description:"Confirm the target is healthy and logs are clean."}],orientation:"vertical",size:"sm",variant:"outlined",defaultCurrentIndex:1,completedStepIds:["plan"],interactive:!1}),ue=`import { Stepper } from "@cjlapao/ui-kit";

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
`,he=[{id:"draft",title:"Draft"},{id:"review",title:"Review"},{id:"ship",title:"Ship"}],xe=[{connector:"progress",label:"Progress — runs edge-to-edge and fills up to the active step."},{connector:"line",label:"Line — a static track with a breathing gap around every node."},{connector:"none",label:"None — the nodes only."}],ge=()=>e.jsx("div",{className:"flex w-full flex-col gap-4",children:xe.map(({connector:s,label:o})=>e.jsxs("div",{children:[e.jsxs("p",{className:"mb-2 text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{className:"font-semibold text-neutral-700 dark:text-neutral-200",children:s})," ","— ",o]}),e.jsx(i,{steps:he,connector:s,size:"sm",variant:"outlined",defaultCurrentIndex:1,completedStepIds:["draft"],interactive:!1})]},s))}),me=`import { Stepper, type StepperConnector } from "@cjlapao/ui-kit";

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
`,fe=[{id:"a",title:"Draft"},{id:"b",title:"Review"},{id:"c",title:"Ship"}],ve=()=>e.jsx("div",{className:"grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",children:X.map(s=>e.jsx(i,{steps:fe,tone:s,size:"xs",variant:"outlined",padding:"sm",defaultCurrentIndex:1,completedStepIds:["a"],interactive:!1},s))}),be=`import { Stepper, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,ye=[{id:"a",title:"Draft",subtitle:"Write the spec"},{id:"b",title:"Review",subtitle:"Get sign-off"},{id:"c",title:"Ship",subtitle:"Deploy"}],Se=[{loaderType:"spinner",label:"Spinner — the Panel shows a ring overlay."},{loaderType:"progress",label:"Progress — the Panel shows a bar overlay."},{loaderType:"skeleton",label:"Skeleton — the content is replaced by pulsing discs and lines."}],Ce=()=>e.jsx("div",{className:"grid w-full grid-cols-1 gap-4 xl:grid-cols-3",children:Se.map(({loaderType:s,label:o})=>e.jsxs("div",{className:"min-w-0",children:[e.jsxs("p",{className:"mb-2 text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{className:"font-semibold text-neutral-700 dark:text-neutral-200",children:s})," ","— ",o]}),e.jsx(i,{steps:ye,size:"sm",variant:"outlined",loading:!0,loaderType:s,defaultCurrentIndex:0,interactive:!1})]},s))}),je=`import { Stepper, type StepperLoaderType } from "@cjlapao/ui-kit";

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
`,ze=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Y,{name:"Stepper",description:"A multi-step workflow on the shared panel surface — clickable steps with a line or progress connector, the full tone set, per-step and whole-stepper loaders (including a skeleton), an optional progress bar, both orientations, and `raisedSurface` for the first nested-panels depth step (the tinted-card-on-matching-background fix)."}),e.jsx(ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Vertical",description:"The same workflow stacked — each step carries its own copy beside the node rail.",code:ue,filename:"Vertical.tsx",children:e.jsx(pe,{})}),e.jsx(d,{title:"Connectors",description:"progress fills edge-to-edge up to the active step; line is a static track with a gap around every node; none drops the line entirely.",code:me,filename:"Connectors.tsx",children:e.jsx(ge,{})}),e.jsx(d,{title:"Every tone",description:"The full 21-colour tone set — the node fill, the completed connector and the active ring all track the tone.",code:be,filename:"EveryTone.tsx",children:e.jsx(ve,{})}),e.jsx(d,{title:"Loaders",description:"spinner and progress overlay the content; skeleton replaces it with pulsing discs and lines.",code:je,filename:"Loaders.tsx",children:e.jsx(Ce,{})})]})]});export{ze as StepperPage,ze as default};
