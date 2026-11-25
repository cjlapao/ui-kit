import{r as n,j as e,h2 as i,H as o,bf as a}from"./index-CQwZVYnB.js";import{P as $}from"./PageHeader-BhZxEVHt.js";import{E as c}from"./ExampleCard-BZsKA5_g.js";import{S as q}from"./SurfaceToneControl-LH37fS9y.js";import{P as _,S as u,T as s,a as l}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as J}from"./ControlAccordion-C7vC6faF.js";import{s as K,f as Q,p as U,e as X,c as Y,A as Z,B as ee,C as ne}from"./options-Byh1yOHz.js";const te=["glass","liquid-glass","default"],oe=[{id:"snap-a",icon:e.jsx(o,{icon:"Save",customSize:16}),iconBackground:!0,title:"Snapshot A",subtitle:"2 days ago · 128 MB",isRoot:!0,actions:[{label:"Revert",variant:"outline",color:"blue"},{label:"Delete",variant:"ghost",color:"rose",disabled:!0}],overflowActions:[{label:"Export",value:"export"},{label:"Rename",value:"rename"}]},{id:"snap-b",icon:e.jsx(o,{icon:"Image",customSize:16}),iconBackground:!0,title:"Snapshot B",subtitle:"1 day ago · 134 MB",depth:1},{id:"snap-c",icon:e.jsx(o,{icon:"Rocket",customSize:16}),title:"Snapshot C",subtitle:"Running · live environment",isCurrent:!0}],se=()=>{const[r,w]=n.useState("simple"),[d,R]=n.useState("none"),[m,P]=n.useState("none"),[p,I]=n.useState("sm"),[h,B]=n.useState(!1),[g,D]=n.useState("spinner"),[b,N]=n.useState("sm"),[x,A]=n.useState(!1),[v,L]=n.useState(!1),[S,M]=n.useState(!0),[f,E]=n.useState(!1),[j,O]=n.useState(!1),[y,H]=n.useState(!1),[k,V]=n.useState("classic"),[C,G]=n.useState("medium"),[z,W]=n.useState("frosted"),F=te.includes(r);return e.jsx(_,{controls:e.jsx(J,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Variant",options:K,value:r,onChange:t=>w(t)}),e.jsx(q,{label:"Tone",value:d,onChange:R}),e.jsx(u,{label:"Corner",options:Q,value:m,onChange:t=>P(t)}),e.jsx(u,{label:"Padding",options:U,value:p,onChange:t=>I(t)}),e.jsx(s,{label:"Raised surface",checked:h,onChange:B})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Loader type",children:e.jsx(a,{fullWidth:!0,size:"sm",options:X,value:g,onChange:t=>D(t)})}),e.jsx(l,{label:"Action size",children:e.jsx(a,{fullWidth:!0,size:"sm",options:Y,value:b,onChange:t=>N(t)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(s,{label:"Loading",checked:x,onChange:A}),e.jsx(s,{label:"Empty",checked:v,onChange:L}),e.jsx(s,{label:"Animate",checked:S,onChange:M}),e.jsx(s,{label:"Trunk dots",checked:f,onChange:E}),e.jsx(s,{label:"Custom line color",checked:j,onChange:O}),e.jsx(s,{label:"Hover shadow",checked:y,onChange:H})]})},...F?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Specular",children:e.jsx(a,{fullWidth:!0,size:"sm",options:Z,value:k,onChange:t=>V(t)})}),e.jsx(l,{label:"Vibrancy",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ee,value:C,onChange:t=>G(t)})}),e.jsx(l,{label:"Glass opacity",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ne,value:z,onChange:t=>W(t)})})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(i,{title:"Snapshots",headerAction:{label:"New Snapshot",variant:"solid",color:"blue",size:"sm",leadingIcon:e.jsx(o,{icon:"Save",customSize:14})},items:v?[]:oe,variant:r,tone:d,corner:m,padding:p,raisedSurface:h,lineColor:j?"#8b5cf6":void 0,showTrunkDots:f,actionSize:b,animate:S,loading:x,loaderType:g,emptyState:"Nothing to show yet — create a snapshot.",hoverShadow:y,vibrancy:C,glassOpacity:z,specularMode:k})})})})},ie=[{id:"snap-1",icon:e.jsx(o,{icon:"Save",customSize:16}),iconBackground:!0,title:"Initial snapshot",subtitle:"2 days ago · 128 MB",isRoot:!0,actions:[{label:"Revert",variant:"outline",color:"blue",size:"sm"},{label:"Delete",variant:"ghost",color:"rose",size:"sm",disabled:!0}],overflowActions:[{label:"Export",value:"export"},{label:"Rename",value:"rename"},{label:"Delete…",value:"delete",danger:!0}]},{id:"snap-2",icon:e.jsx(o,{icon:"Image",customSize:16}),iconBackground:!0,title:"Post-migration",subtitle:"28 hours ago · 134 MB",depth:1},{id:"snap-3",icon:e.jsx(o,{icon:"Docker",customSize:16}),iconBackground:!0,title:"Container baseline",subtitle:"27 hours ago · 96 MB",depth:2,actions:[{label:"Restore",variant:"outline",color:"blue",size:"sm"}]},{id:"current",icon:e.jsx(o,{icon:"Rocket",customSize:16}),title:"Live environment",subtitle:"Running · v2.4.1",isCurrent:!0,actions:[{label:"Snapshot",variant:"solid",color:"blue",size:"sm"}]}];function ae(){return e.jsx("div",{className:"w-full",children:e.jsx(i,{title:"Snapshots",headerAction:{label:"New Snapshot",variant:"solid",color:"blue",size:"sm",leadingIcon:e.jsx(o,{icon:"Save",customSize:14})},items:ie,tone:"blue",variant:"elevated"})})}const le=`import { CustomIcon, TimelinePanel } from "@cjlapao/ui-kit";
import type { TimelinePanelItem } from "@cjlapao/ui-kit";

const items: TimelinePanelItem[] = [
  {
    id: "snap-1",
    icon: <CustomIcon icon="Save" customSize={16} />,
    iconBackground: true,
    title: "Initial snapshot",
    subtitle: "2 days ago · 128 MB",
    isRoot: true,
    actions: [
      { label: "Revert", variant: "outline", color: "blue", size: "sm" },
      {
        label: "Delete",
        variant: "ghost",
        color: "rose",
        size: "sm",
        disabled: true,
      },
    ],
    overflowActions: [
      { label: "Export", value: "export" },
      { label: "Rename", value: "rename" },
      { label: "Delete…", value: "delete", danger: true },
    ],
  },
  {
    id: "snap-2",
    icon: <CustomIcon icon="Image" customSize={16} />,
    iconBackground: true,
    title: "Post-migration",
    subtitle: "28 hours ago · 134 MB",
    depth: 1,
  },
  {
    id: "snap-3",
    icon: <CustomIcon icon="Docker" customSize={16} />,
    iconBackground: true,
    title: "Container baseline",
    subtitle: "27 hours ago · 96 MB",
    depth: 2,
    actions: [
      { label: "Restore", variant: "outline", color: "blue", size: "sm" },
    ],
  },
  {
    id: "current",
    icon: <CustomIcon icon="Rocket" customSize={16} />,
    title: "Live environment",
    subtitle: "Running · v2.4.1",
    isCurrent: true,
    actions: [
      { label: "Snapshot", variant: "solid", color: "blue", size: "sm" },
    ],
  },
];

export default function Snapshots() {
  return (
    <div className="w-full">
      <TimelinePanel
        title="Snapshots"
        headerAction={{
          label: "New Snapshot",
          variant: "solid",
          color: "blue",
          size: "sm",
          leadingIcon: <CustomIcon icon="Save" customSize={14} />,
        }}
        items={items}
        tone="blue"
        variant="elevated"
      />
    </div>
  );
}
`,re=[{id:"deploy-1",icon:e.jsx(o,{icon:"Rocket",customSize:16}),iconBackground:!0,title:"Production deploy",subtitle:"1 day ago · build #482",actions:[{label:"Rollback",variant:"outline",color:"blue",size:"sm"},{label:"View Logs",variant:"ghost",color:"neutral",size:"sm"}]},{id:"deploy-2",icon:e.jsx(o,{icon:"Database",customSize:16}),iconBackground:!0,title:"Database migration",subtitle:"23 hours ago · schema v18",depth:1},{id:"current",icon:e.jsx(o,{icon:"CheckCircle",customSize:16}),title:"v2.4.0 — Live",subtitle:"All systems operational",isCurrent:!0}];function ce(){return e.jsx("div",{className:"w-full",children:e.jsx(i,{title:"Deployment History",headerAction:e.jsx("span",{className:"text-xs font-medium text-neutral-400 dark:text-neutral-500",children:"Last 24 hours"}),items:re,tone:"blue",showTrunkDots:!0})})}const ue=`import { CustomIcon, TimelinePanel } from "@cjlapao/ui-kit";
import type { TimelinePanelItem } from "@cjlapao/ui-kit";

const items: TimelinePanelItem[] = [
  {
    id: "deploy-1",
    icon: <CustomIcon icon="Rocket" customSize={16} />,
    iconBackground: true,
    title: "Production deploy",
    subtitle: "1 day ago · build #482",
    actions: [
      { label: "Rollback", variant: "outline", color: "blue", size: "sm" },
      { label: "View Logs", variant: "ghost", color: "neutral", size: "sm" },
    ],
  },
  {
    id: "deploy-2",
    icon: <CustomIcon icon="Database" customSize={16} />,
    iconBackground: true,
    title: "Database migration",
    subtitle: "23 hours ago · schema v18",
    depth: 1,
  },
  {
    id: "current",
    icon: <CustomIcon icon="CheckCircle" customSize={16} />,
    title: "v2.4.0 — Live",
    subtitle: "All systems operational",
    isCurrent: true,
  },
];

export default function DeploymentHistory() {
  return (
    <div className="w-full">
      <TimelinePanel
        title="Deployment History"
        headerAction={
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
            Last 24 hours
          </span>
        }
        items={items}
        tone="blue"
        showTrunkDots
      />
    </div>
  );
}
`,T=[{id:"snap-1",icon:e.jsx(o,{icon:"Save",customSize:16}),iconBackground:!0,title:"Initial snapshot",subtitle:"2 days ago · 128 MB",isRoot:!0},{id:"current",icon:e.jsx(o,{icon:"Rocket",customSize:16}),title:"Live environment",subtitle:"Running · v2.4.1",isCurrent:!0}];function de(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:[e.jsx(i,{title:"Empty",items:[],tone:"blue",emptyState:"No snapshots yet — create one."}),e.jsx(i,{title:"Skeleton",items:T,tone:"blue",loading:!0,loaderType:"skeleton",skeletonRows:3}),e.jsx(i,{title:"Refreshing",items:T,tone:"blue",loading:!0,loaderType:"spinner",loaderProps:{title:"Syncing…"}})]})}const me=`import { CustomIcon, TimelinePanel } from "@cjlapao/ui-kit";
import type { TimelinePanelItem } from "@cjlapao/ui-kit";

const items: TimelinePanelItem[] = [
  {
    id: "snap-1",
    icon: <CustomIcon icon="Save" customSize={16} />,
    iconBackground: true,
    title: "Initial snapshot",
    subtitle: "2 days ago · 128 MB",
    isRoot: true,
  },
  {
    id: "current",
    icon: <CustomIcon icon="Rocket" customSize={16} />,
    title: "Live environment",
    subtitle: "Running · v2.4.1",
    isCurrent: true,
  },
];

export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <TimelinePanel
        title="Empty"
        items={[]}
        tone="blue"
        emptyState="No snapshots yet — create one."
      />
      <TimelinePanel
        title="Skeleton"
        items={items}
        tone="blue"
        loading
        loaderType="skeleton"
        skeletonRows={3}
      />
      <TimelinePanel
        title="Refreshing"
        items={items}
        tone="blue"
        loading
        loaderType="spinner"
        loaderProps={{ title: "Syncing…" }}
      />
    </div>
  );
}
`,fe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($,{name:"Timeline Panel",description:"A Panel with a vertical timeline: an SVG trunk and L-shaped branch connectors, root and current-state anchors, nested depth, inline actions and an overflow menu, plus skeleton, spinner and progress loaders and an empty state. Being a Panel down to its fill, `raisedSurface` forces the first nested-panels depth step — the tinted-card-on-matching-background fix."}),e.jsx(se,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Snapshots",description:"The full anatomy: a root anchor, nested branches at depth 1 and 2, a current-state anchor, inline action buttons and the overflow (⋮) menu.",code:le,filename:"Snapshots.tsx",children:e.jsx(ae,{})}),e.jsx(c,{title:"Deployment history",description:"`showTrunkDots` drops a dot on the solid trunk between anchors, and the header takes a plain ReactNode instead of a button.",code:ue,filename:"DeploymentHistory.tsx",children:e.jsx(ce,{})}),e.jsx(c,{title:"States",description:"The empty message, a skeleton shaped like the timeline itself, and a spinner overlay while refreshing over existing items.",code:me,filename:"States.tsx",children:e.jsx(de,{})})]})]});export{fe as TimelinePanelPage,fe as default};
