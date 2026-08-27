import{r as t,j as e,aW as i,C as o,M as a}from"./index-BBK6HA-D.js";import{P as W}from"./PageHeader-BcBcU29I.js";import{E as u}from"./ExampleCard-BVwGIEPO.js";import{P as F,C as $,S as r,a as l,T as s}from"./ControlAccordion-DallGojj.js";import{d as q,t as _,p as J,e as K,i as Q,n as U,j as X,k as Y,l as Z}from"./options-D-FMIizr.js";const ee=["glass","liquid-glass","default"],ne=[{id:"snap-a",icon:e.jsx(o,{icon:"Save",customSize:16}),iconBackground:!0,title:"Snapshot A",subtitle:"2 days ago · 128 MB",isRoot:!0,actions:[{label:"Revert",variant:"outline",color:"blue"},{label:"Delete",variant:"ghost",color:"rose",disabled:!0}],overflowActions:[{label:"Export",value:"export"},{label:"Rename",value:"rename"}]},{id:"snap-b",icon:e.jsx(o,{icon:"Image",customSize:16}),iconBackground:!0,title:"Snapshot B",subtitle:"1 day ago · 134 MB",depth:1},{id:"snap-c",icon:e.jsx(o,{icon:"Rocket",customSize:16}),title:"Snapshot C",subtitle:"Running · live environment",isCurrent:!0}],te=()=>{const[c,T]=t.useState("simple"),[d,w]=t.useState("neutral"),[m,P]=t.useState("none"),[p,R]=t.useState("sm"),[h,I]=t.useState("spinner"),[g,B]=t.useState("sm"),[b,D]=t.useState(!1),[x,N]=t.useState(!1),[v,A]=t.useState(!0),[S,L]=t.useState(!1),[j,M]=t.useState(!1),[y,E]=t.useState(!1),[f,O]=t.useState("classic"),[k,V]=t.useState("medium"),[C,H]=t.useState("frosted"),G=ee.includes(c);return e.jsx(F,{controls:e.jsx($,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Variant",options:q,value:c,onChange:n=>T(n)}),e.jsx(r,{label:"Tone",options:_,value:d,onChange:n=>w(n)}),e.jsx(r,{label:"Corner",options:J,value:m,onChange:n=>P(n)}),e.jsx(r,{label:"Padding",options:K,value:p,onChange:n=>R(n)})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Loader type",children:e.jsx(a,{fullWidth:!0,size:"sm",options:Q,value:h,onChange:n=>I(n)})}),e.jsx(l,{label:"Action size",children:e.jsx(a,{fullWidth:!0,size:"sm",options:U,value:g,onChange:n=>B(n)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(s,{label:"Loading",checked:b,onChange:D}),e.jsx(s,{label:"Empty",checked:x,onChange:N}),e.jsx(s,{label:"Animate",checked:v,onChange:A}),e.jsx(s,{label:"Trunk dots",checked:S,onChange:L}),e.jsx(s,{label:"Custom line color",checked:j,onChange:M}),e.jsx(s,{label:"Hover shadow",checked:y,onChange:E})]})},...G?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Specular",children:e.jsx(a,{fullWidth:!0,size:"sm",options:X,value:f,onChange:n=>O(n)})}),e.jsx(l,{label:"Vibrancy",children:e.jsx(a,{fullWidth:!0,size:"sm",options:Y,value:k,onChange:n=>V(n)})}),e.jsx(l,{label:"Glass opacity",children:e.jsx(a,{fullWidth:!0,size:"sm",options:Z,value:C,onChange:n=>H(n)})})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(i,{title:"Snapshots",headerAction:{label:"New Snapshot",variant:"solid",color:"blue",size:"sm",leadingIcon:e.jsx(o,{icon:"Save",customSize:14})},items:x?[]:ne,variant:c,tone:d,corner:m,padding:p,lineColor:j?"#8b5cf6":void 0,showTrunkDots:S,actionSize:g,animate:v,loading:b,loaderType:h,emptyState:"Nothing to show yet — create a snapshot.",hoverShadow:y,vibrancy:k,glassOpacity:C,specularMode:f})})})})},oe=[{id:"snap-1",icon:e.jsx(o,{icon:"Save",customSize:16}),iconBackground:!0,title:"Initial snapshot",subtitle:"2 days ago · 128 MB",isRoot:!0,actions:[{label:"Revert",variant:"outline",color:"blue",size:"sm"},{label:"Delete",variant:"ghost",color:"rose",size:"sm",disabled:!0}],overflowActions:[{label:"Export",value:"export"},{label:"Rename",value:"rename"},{label:"Delete…",value:"delete",danger:!0}]},{id:"snap-2",icon:e.jsx(o,{icon:"Image",customSize:16}),iconBackground:!0,title:"Post-migration",subtitle:"28 hours ago · 134 MB",depth:1},{id:"snap-3",icon:e.jsx(o,{icon:"Docker",customSize:16}),iconBackground:!0,title:"Container baseline",subtitle:"27 hours ago · 96 MB",depth:2,actions:[{label:"Restore",variant:"outline",color:"blue",size:"sm"}]},{id:"current",icon:e.jsx(o,{icon:"Rocket",customSize:16}),title:"Live environment",subtitle:"Running · v2.4.1",isCurrent:!0,actions:[{label:"Snapshot",variant:"solid",color:"blue",size:"sm"}]}];function se(){return e.jsx("div",{className:"w-full",children:e.jsx(i,{title:"Snapshots",headerAction:{label:"New Snapshot",variant:"solid",color:"blue",size:"sm",leadingIcon:e.jsx(o,{icon:"Save",customSize:14})},items:oe,tone:"blue",variant:"elevated"})})}const ie=`import { CustomIcon, TimelinePanel } from "@cjlapao/ui-kit";
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
`,ae=[{id:"deploy-1",icon:e.jsx(o,{icon:"Rocket",customSize:16}),iconBackground:!0,title:"Production deploy",subtitle:"1 day ago · build #482",actions:[{label:"Rollback",variant:"outline",color:"blue",size:"sm"},{label:"View Logs",variant:"ghost",color:"neutral",size:"sm"}]},{id:"deploy-2",icon:e.jsx(o,{icon:"Database",customSize:16}),iconBackground:!0,title:"Database migration",subtitle:"23 hours ago · schema v18",depth:1},{id:"current",icon:e.jsx(o,{icon:"CheckCircle",customSize:16}),title:"v2.4.0 — Live",subtitle:"All systems operational",isCurrent:!0}];function le(){return e.jsx("div",{className:"w-full",children:e.jsx(i,{title:"Deployment History",headerAction:e.jsx("span",{className:"text-xs font-medium text-neutral-400 dark:text-neutral-500",children:"Last 24 hours"}),items:ae,tone:"blue",showTrunkDots:!0})})}const re=`import { CustomIcon, TimelinePanel } from "@cjlapao/ui-kit";
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
`,z=[{id:"snap-1",icon:e.jsx(o,{icon:"Save",customSize:16}),iconBackground:!0,title:"Initial snapshot",subtitle:"2 days ago · 128 MB",isRoot:!0},{id:"current",icon:e.jsx(o,{icon:"Rocket",customSize:16}),title:"Live environment",subtitle:"Running · v2.4.1",isCurrent:!0}];function ce(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:[e.jsx(i,{title:"Empty",items:[],tone:"blue",emptyState:"No snapshots yet — create one."}),e.jsx(i,{title:"Skeleton",items:z,tone:"blue",loading:!0,loaderType:"skeleton",skeletonRows:3}),e.jsx(i,{title:"Refreshing",items:z,tone:"blue",loading:!0,loaderType:"spinner",loaderProps:{title:"Syncing…"}})]})}const ue=`import { CustomIcon, TimelinePanel } from "@cjlapao/ui-kit";
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
`,be=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(W,{name:"Timeline Panel",description:"A Panel with a vertical timeline: an SVG trunk and L-shaped branch connectors, root and current-state anchors, nested depth, inline actions and an overflow menu, plus skeleton, spinner and progress loaders and an empty state."}),e.jsx(te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(u,{title:"Snapshots",description:"The full anatomy: a root anchor, nested branches at depth 1 and 2, a current-state anchor, inline action buttons and the overflow (⋮) menu.",code:ie,filename:"Snapshots.tsx",children:e.jsx(se,{})}),e.jsx(u,{title:"Deployment history",description:"`showTrunkDots` drops a dot on the solid trunk between anchors, and the header takes a plain ReactNode instead of a button.",code:re,filename:"DeploymentHistory.tsx",children:e.jsx(le,{})}),e.jsx(u,{title:"States",description:"The empty message, a skeleton shaped like the timeline itself, and a spinner overlay while refreshing over existing items.",code:ue,filename:"States.tsx",children:e.jsx(ce,{})})]})]});export{be as TimelinePanelPage,be as default};
