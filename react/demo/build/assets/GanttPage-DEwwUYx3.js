import{gk as ae,gl as ne,gm as te,r as t,j as e,gn as r,go as se,gp as re}from"./index-dkEsqyUy.js";import{P as oe}from"./PageHeader-Cqxw9jAs.js";import{E as o}from"./ExampleCard-SmeeyhOh.js";import{S as le}from"./SurfaceToneControl-CptLUoZR.js";import{P as ie,C as F,S as l,T as i}from"./PlaygroundPanel-CD4VThIT.js";const de=[{id:"design",label:"Design",color:"violet",description:"UX & visual"},{id:"eng",label:"Engineering",color:"blue",description:"Build & QA"},{id:"launch",label:"Launch",color:"emerald",description:"Ship it"}];function ce(s=new Date){const n=c=>ae(ne(te(s.getTime()),c));return[{id:"research",name:"User research",lane:"design",start:n(-12),end:n(-7),progress:1,color:"violet",owner:"Mira"},{id:"wireframes",name:"Wireframes",lane:"design",start:n(-9),end:n(-3),progress:1,color:"violet",owner:"Mira"},{id:"visual",name:"Visual design",lane:"design",start:n(-5),end:n(3),progress:.65,color:"purple",owner:"Jonas"},{id:"visual-tokens",name:"Design tokens",lane:"design",parent:"visual",start:n(-4),end:n(-1),progress:1,color:"purple",owner:"Jonas"},{id:"visual-flow",name:"Flow mockups",lane:"design",parent:"visual",start:n(-2),end:n(2),progress:.5,color:"purple",owner:"Jonas"},{id:"api",name:"API contracts",lane:"eng",start:n(-4),end:n(1),progress:1,color:"blue",owner:"Aiko"},{id:"webapp",name:"Web app",lane:"eng",start:n(0),end:n(12),progress:.3,color:"blue",owner:"Aiko"},{id:"webapp-shell",name:"App shell",lane:"eng",parent:"webapp",start:n(0),end:n(4),progress:.9,color:"sky",owner:"Aiko"},{id:"webapp-screens",name:"Screens",lane:"eng",parent:"webapp",start:n(3),end:n(9),progress:.2,color:"sky",owner:"Petra"},{id:"webapp-polish",name:"Polish & a11y",lane:"eng",parent:"webapp",start:n(8),end:n(12),progress:0,color:"sky",owner:"Petra"},{id:"qa",name:"QA pass",lane:"eng",start:n(10),end:n(14),progress:0,color:"cyan",owner:"Sam"},{id:"docs",name:"Docs & changelog",lane:"launch",start:n(6),end:n(11),progress:0,color:"emerald",owner:"Mira"},{id:"beta",name:"Beta",lane:"launch",start:n(12),end:n(15),progress:0,color:"teal",owner:"Sam"},{id:"ship",name:"GA release",lane:"launch",type:"milestone",start:n(16),end:n(16),color:"emerald",owner:"All"}]}function pe(){return[{id:"l1",source:"research",target:"wireframes",type:"fs"},{id:"l2",source:"wireframes",target:"visual",type:"fs"},{id:"l3",source:"api",target:"webapp",type:"fs"},{id:"l4",source:"visual",target:"webapp",type:"ff",color:"violet"},{id:"l5",source:"webapp",target:"qa",type:"fs"},{id:"l6",source:"qa",target:"beta",type:"fs"},{id:"l7",source:"docs",target:"beta",type:"ss",color:"emerald"},{id:"l8",source:"beta",target:"ship",type:"fs"}]}const d={lanes:de,tasks:ce,links:pe},ue=["blue","emerald","violet","amber","rose","cyan"],ge=[{label:"Free (no snap)",value:"none"},{label:"Hour",value:"hour"},{label:"Day",value:"day"},{label:"Week",value:"week"}],M=[{label:"None (no card)",value:"none"},{label:"Elevated",value:"elevated"},{label:"Outlined",value:"outlined"},{label:"Subtle",value:"subtle"},{label:"Tonal",value:"tonal"},{label:"Default (glassy)",value:"default"},{label:"Glass",value:"glass"},{label:"Liquid glass",value:"liquid-glass"},{label:"Simple",value:"simple"}],me=[{label:"Follow chart",value:"auto"},...M],he=[{label:"Follow chart",value:"auto"},...re.map(s=>({label:s==="none"?"None — no tint":s[0].toUpperCase()+s.slice(1),value:s}))],fe=[{label:"Sharp (none)",value:"none"},{label:"Slight (rounded)",value:"rounded"},{label:"Soft (rounded-sm)",value:"rounded-sm"},{label:"Medium (rounded-md)",value:"rounded-md"},{label:"Large (rounded-lg)",value:"rounded-lg"},{label:"Extra (rounded-xl)",value:"rounded-xl"}],be=[{label:"None",value:"none"},{label:"Extra small",value:"xs"},{label:"Small",value:"sm"},{label:"Medium",value:"md"},{label:"Large",value:"lg"},{label:"Extra large",value:"xl"}],ye=d.lanes,W=d.tasks(),B=d.links(),xe=()=>{const[s,n]=t.useState("none"),[c,u]=t.useState(W),[V,b]=t.useState(B),[_,y]=t.useState(void 0),[x,$]=t.useState("blue"),[v,w]=t.useState("elevated"),[g,k]=t.useState("auto"),[m,S]=t.useState("auto"),[h,T]=t.useState(!1),[j,C]=t.useState(!1),[N,A]=t.useState(!1),[L,G]=t.useState("rounded-sm"),[E,I]=t.useState("none"),[D,H]=t.useState("day"),[R,Q]=t.useState(!0),[P,U]=t.useState(!0),[K,J]=t.useState(!0),[X,z]=t.useState({}),[q,O]=t.useState([]),[Y,Z]=t.useState(0),p=a=>{Z(f=>f+1),O(f=>[{id:Y+1,label:a},...f].slice(0,6))},ee=()=>{u(W),b(B),y(void 0),w("elevated"),k("auto"),S("auto"),T(!1),C(!1),A(!1),G("rounded-sm"),I("none"),z({}),O([])};return e.jsx(ie,{controls:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(le,{label:"Surface tone",value:s,onChange:n}),e.jsx(F,{label:"Accent",children:e.jsx("div",{className:"flex flex-wrap gap-1.5",children:ue.map(a=>e.jsx("button",{type:"button","aria-label":`Accent ${a}`,onClick:()=>$(a),className:`h-6 w-6 rounded-full ring-2 ring-offset-1 transition dark:ring-offset-neutral-900 ${x===a?"ring-neutral-400 dark:ring-neutral-500":"ring-transparent"}`,style:{backgroundColor:`var(--color-${a}-500)`}},a))})}),e.jsx(l,{label:"Surface variant",options:M,value:v,onChange:a=>w(a)}),e.jsx(l,{label:"Controls variant (zoom pill)",options:me,value:g,onChange:a=>k(a)}),e.jsx(l,{label:"Controls tone (zoom pill)",options:he,value:m,onChange:a=>S(a)}),e.jsx(l,{label:"Snap",options:ge,value:D,onChange:a=>H(a)}),e.jsx(l,{label:"Corner",options:fe,value:L,onChange:a=>G(a)}),e.jsx(l,{label:"Padding",options:be,value:E,onChange:a=>I(a)}),e.jsxs("div",{className:"flex flex-col gap-2.5",children:[e.jsx(i,{label:"Editable (drag / resize / reorder)",checked:R,onChange:Q}),e.jsx(i,{label:"Today marker",checked:P,onChange:U}),e.jsx(i,{label:"Full height (fill parent, height = min)",checked:h,onChange:T}),e.jsx(i,{label:"Full width",checked:j,onChange:C}),e.jsx(i,{label:"Column edges (box the fixed table)",checked:N,onChange:A}),e.jsx(i,{label:"Resizable columns (drag a header edge)",checked:K,onChange:J})]}),e.jsx("button",{type:"button",onClick:ee,className:"self-start rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",children:"Reset sample data"}),e.jsx(F,{label:"Event log",children:e.jsxs("ul",{className:"flex h-[168px] flex-col gap-1 overflow-y-auto",children:[q.length===0&&e.jsx("li",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"Interact with the chart to see events."}),q.map(a=>e.jsx("li",{className:"rounded-md bg-neutral-50 px-2 py-1 font-mono text-[11px] text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300",children:a.label},a.id))]})})]}),preview:e.jsxs("div",{className:"w-full",children:[e.jsx("div",{className:h?"h-[560px]":void 0,children:e.jsx(r,{tone:s,tasks:c,links:V,lanes:ye,rowOrder:_,color:x,variant:v,controlsVariant:g==="auto"?void 0:g,controlsTone:m==="auto"?void 0:m,fullHeight:h,fullWidth:j,columnEdges:N,corner:L,padding:E,snap:D,editable:R,showToday:P,resizableColumns:K,columnWidths:X,onColumnWidthChange:a=>{z(a),p("Columns resized")},height:440,icon:e.jsx(se,{className:"h-5 w-5 text-blue-600 dark:text-blue-400"}),subtitle:"VENDOR ONBOARDING · REQ-4128",title:"Northwind Logistics GmbH",actions:e.jsxs("div",{className:"flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",children:[e.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"LIVE · read-only view"]}),onTasksChange:a=>{u(a),p("Dates / progress edited")},onLinksChange:a=>{b(a),p(`Dependencies → ${a.length}`)},onReorder:a=>{y(a),p("Rows reordered")},onSelect:a=>p(a?`Selected “${a}”`:"Selection cleared")})}),e.jsx("p",{className:"px-1 pt-2 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500",children:"Hover a bar to reveal resize / progress / link handles · drag the right-edge handle to draw a dependency · drag the row grip to reorder · Ctrl/Cmd + scroll to pinch zoom · click the chart, then use ↑/↓ · Home/End to walk rows and +/− to zoom."})]})})};function ve(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{tasks:d.tasks(),links:d.links(),lanes:d.lanes,color:"blue",height:420})})}const we=`import { Gantt, sampleGantt } from "@cjlapao/ui-kit";

/**
 * The full sample: three swimlanes, two parent groups with roll-up progress,
 * a milestone, and eight dependencies — all interactive.
 */
export default function DefaultExample() {
  return (
    <div className="w-full">
      <Gantt
        tasks={sampleGantt.tasks()}
        links={sampleGantt.links()}
        lanes={sampleGantt.lanes}
        color="blue"
        height={420}
      />
    </div>
  );
}
`,ke=[{id:"a",name:"Kickoff",start:"2026-08-03",end:"2026-08-07",color:"violet",progress:1},{id:"b",name:"Prototype",start:"2026-08-07",end:"2026-08-14",color:"blue",progress:.6},{id:"c",name:"Review",start:"2026-08-14",end:"2026-08-21",color:"blue",progress:0},{id:"d",name:"Handoff",start:"2026-08-21",end:"2026-08-28",color:"emerald",progress:0}],Se=[{id:"fs",source:"a",target:"b",type:"fs"},{id:"ff",source:"b",target:"c",type:"ff"},{id:"ss",source:"c",target:"d",type:"ss",color:"amber"},{id:"sf",source:"a",target:"c",type:"sf",color:"rose"}];function Te(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{tasks:ke,links:Se,color:"slate",snap:"day",height:300})})}const je=`import { Gantt, type GanttLink, type GanttTask } from "@cjlapao/ui-kit";

/**
 * All four dependency types on one chart. Every connector reads "source's
 * right → target's left" (left port = parents/predecessors, right port =
 * children/successors); the type is shown by the line style (\`ff\` and \`sf\`
 * render dashed) and the tooltip. An optional \`color\` overrides the accent for
 * a single edge.
 */
const TASKS: GanttTask[] = [
  { id: "a", name: "Kickoff", start: "2026-08-03", end: "2026-08-07", color: "violet", progress: 1 },
  { id: "b", name: "Prototype", start: "2026-08-07", end: "2026-08-14", color: "blue", progress: 0.6 },
  { id: "c", name: "Review", start: "2026-08-14", end: "2026-08-21", color: "blue", progress: 0 },
  { id: "d", name: "Handoff", start: "2026-08-21", end: "2026-08-28", color: "emerald", progress: 0 },
];

const LINKS: GanttLink[] = [
  { id: "fs", source: "a", target: "b", type: "fs" },
  { id: "ff", source: "b", target: "c", type: "ff" },
  { id: "ss", source: "c", target: "d", type: "ss", color: "amber" },
  { id: "sf", source: "a", target: "c", type: "sf", color: "rose" },
];

export default function DependenciesExample() {
  return (
    <div className="w-full">
      <Gantt tasks={TASKS} links={LINKS} color="slate" snap="day" height={300} />
    </div>
  );
}
`,Ce=[{id:"platform",name:"Platform rebuild",start:"2026-08-03",end:"2026-08-21",color:"indigo",owner:"Lena"},{id:"auth",name:"Auth service",parent:"platform",start:"2026-08-03",end:"2026-08-10",progress:1,color:"indigo",owner:"Lena"},{id:"billing",name:"Billing",parent:"platform",start:"2026-08-06",end:"2026-08-16",progress:.5,color:"indigo",owner:"Theo"},{id:"notify",name:"Notifications",parent:"platform",start:"2026-08-11",end:"2026-08-21",progress:.2,color:"indigo",owner:"Theo"},{id:"migration",name:"Data migration",parent:"platform",start:"2026-08-14",end:"2026-08-21",progress:0,color:"indigo",owner:"Lena"},{id:"docs",name:"Docs",start:"2026-08-17",end:"2026-08-24",color:"emerald",owner:"Mira"}];function Ne(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{tasks:Ce,color:"indigo",snap:"day",height:300})})}const Ae=`import { Gantt, type GanttTask } from "@cjlapao/ui-kit";

/**
 * Hierarchy: children reference a \`parent\`, indent under it, and inherit its
 * roll-up. The parent's bar spans the children's span and its progress is the
 * weighted average of the children — both computed by the engine. Click the
 * caret to collapse a group (its children hide but the roll-up stays).
 */
const TASKS: GanttTask[] = [
  {
    id: "platform",
    name: "Platform rebuild",
    start: "2026-08-03",
    end: "2026-08-21",
    color: "indigo",
    owner: "Lena",
    // open: true is the default; set false to ship it collapsed.
  },
  {
    id: "auth",
    name: "Auth service",
    parent: "platform",
    start: "2026-08-03",
    end: "2026-08-10",
    progress: 1,
    color: "indigo",
    owner: "Lena",
  },
  {
    id: "billing",
    name: "Billing",
    parent: "platform",
    start: "2026-08-06",
    end: "2026-08-16",
    progress: 0.5,
    color: "indigo",
    owner: "Theo",
  },
  {
    id: "notify",
    name: "Notifications",
    parent: "platform",
    start: "2026-08-11",
    end: "2026-08-21",
    progress: 0.2,
    color: "indigo",
    owner: "Theo",
  },
  {
    id: "migration",
    name: "Data migration",
    parent: "platform",
    start: "2026-08-14",
    end: "2026-08-21",
    progress: 0,
    color: "indigo",
    owner: "Lena",
  },
  {
    id: "docs",
    name: "Docs",
    start: "2026-08-17",
    end: "2026-08-24",
    color: "emerald",
    owner: "Mira",
  },
];

export default function GroupsExample() {
  return (
    <div className="w-full">
      <Gantt tasks={TASKS} color="indigo" snap="day" height={300} />
    </div>
  );
}
`,Le=[{id:"plan",name:"Plan",start:"2026-08-03",end:"2026-08-08",color:"violet",progress:1},{id:"freeze",name:"Feature freeze",start:"2026-08-12",end:"2026-08-12",type:"milestone",color:"amber"},{id:"build",name:"Build",start:"2026-08-10",end:"2026-08-20",color:"blue",progress:.4},{id:"rc",name:"Release candidate",start:"2026-08-24",end:"2026-08-24",type:"milestone",color:"rose"},{id:"qa",name:"QA",start:"2026-08-20",end:"2026-08-27",color:"cyan",progress:0},{id:"ga",name:"GA",start:"2026-08-31",end:"2026-08-31",type:"milestone",color:"emerald"}];function Ge(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{tasks:Le,color:"blue",snap:"day",height:300})})}const Ee=`import { Gantt, type GanttTask } from "@cjlapao/ui-kit";

/**
 * \`type: "milestone"\` collapses a bar to a single diamond at its date — ideal
 * for fixed deadlines that carry no duration. Per-task \`color\` is honoured
 * independently of the chart's accent, so a mix of colours reads as a status
 * map without extra props.
 */
const TASKS: GanttTask[] = [
  { id: "plan", name: "Plan", start: "2026-08-03", end: "2026-08-08", color: "violet", progress: 1 },
  { id: "freeze", name: "Feature freeze", start: "2026-08-12", end: "2026-08-12", type: "milestone", color: "amber" },
  { id: "build", name: "Build", start: "2026-08-10", end: "2026-08-20", color: "blue", progress: 0.4 },
  { id: "rc", name: "Release candidate", start: "2026-08-24", end: "2026-08-24", type: "milestone", color: "rose" },
  { id: "qa", name: "QA", start: "2026-08-20", end: "2026-08-27", color: "cyan", progress: 0 },
  { id: "ga", name: "GA", start: "2026-08-31", end: "2026-08-31", type: "milestone", color: "emerald" },
];

export default function MilestonesExample() {
  return (
    <div className="w-full">
      <Gantt tasks={TASKS} color="blue" snap="day" height={300} />
    </div>
  );
}
`,Ie=[{id:"design",label:"Design"},{id:"eng",label:"Engineering"},{id:"launch",label:"Launch"}],De=[{id:"d1",name:"Research",lane:"design",start:"2026-08-03",end:"2026-08-07",color:"violet",progress:1},{id:"d2",name:"Wireframes",lane:"design",start:"2026-08-05",end:"2026-08-10",color:"violet",progress:.8},{id:"d3",name:"Visuals",lane:"design",start:"2026-08-09",end:"2026-08-15",color:"violet",progress:.3},{id:"e1",name:"API",lane:"eng",start:"2026-08-07",end:"2026-08-13",color:"blue",progress:1},{id:"e2",name:"Web app",lane:"eng",start:"2026-08-10",end:"2026-08-20",color:"blue",progress:.5},{id:"e3",name:"QA",lane:"eng",start:"2026-08-18",end:"2026-08-22",color:"cyan",progress:0},{id:"l1",name:"Docs",lane:"launch",start:"2026-08-15",end:"2026-08-20",color:"emerald",progress:0},{id:"l2",name:"Beta",lane:"launch",start:"2026-08-20",end:"2026-08-24",color:"teal",progress:0}];function Re(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{tasks:De,lanes:Ie,color:"blue",snap:"day",height:340})})}const Pe=`import { Gantt, type GanttLane, type GanttTask } from "@cjlapao/ui-kit";

/**
 * Swimlanes group rows into bands (a \`title\` header per lane) and are the unit
 * for drag-to-reorder: the grip on the left of a row reorders within its lane
 * only, so a swimlane stays a coherent block. Lanes can be collapsed too.
 */
const LANES: GanttLane[] = [
  { id: "design", label: "Design" },
  { id: "eng", label: "Engineering" },
  { id: "launch", label: "Launch" },
];

const TASKS: GanttTask[] = [
  { id: "d1", name: "Research", lane: "design", start: "2026-08-03", end: "2026-08-07", color: "violet", progress: 1 },
  { id: "d2", name: "Wireframes", lane: "design", start: "2026-08-05", end: "2026-08-10", color: "violet", progress: 0.8 },
  { id: "d3", name: "Visuals", lane: "design", start: "2026-08-09", end: "2026-08-15", color: "violet", progress: 0.3 },
  { id: "e1", name: "API", lane: "eng", start: "2026-08-07", end: "2026-08-13", color: "blue", progress: 1 },
  { id: "e2", name: "Web app", lane: "eng", start: "2026-08-10", end: "2026-08-20", color: "blue", progress: 0.5 },
  { id: "e3", name: "QA", lane: "eng", start: "2026-08-18", end: "2026-08-22", color: "cyan", progress: 0 },
  { id: "l1", name: "Docs", lane: "launch", start: "2026-08-15", end: "2026-08-20", color: "emerald", progress: 0 },
  { id: "l2", name: "Beta", lane: "launch", start: "2026-08-20", end: "2026-08-24", color: "teal", progress: 0 },
];

export default function LanesExample() {
  return (
    <div className="w-full">
      <Gantt tasks={TASKS} lanes={LANES} color="blue" snap="day" height={340} />
    </div>
  );
}
`,Ke=[{id:"brief",name:"Brief",start:"2026-08-03",end:"2026-08-07",progress:1,color:"violet"},{id:"security",name:"Security review",start:"2026-08-17",end:"2026-08-21",progress:.4,color:"amber"},{id:"prototype",name:"Prototype",start:"2026-08-08",end:"2026-08-11",progress:.8,color:"cyan"},{id:"release",name:"Release",start:"2026-08-22",end:"2026-08-26",progress:0,color:"emerald"},{id:"copy",name:"Copy review",start:"2026-08-05",end:"2026-08-09",progress:.7,color:"rose"},{id:"legal",name:"Legal approval",start:"2026-08-18",end:"2026-08-23",progress:.2,color:"slate"},{id:"qa",name:"QA pass",start:"2026-08-12",end:"2026-08-16",progress:.3,color:"blue"},{id:"launch",name:"Launch gate",start:"2026-08-27",end:"2026-08-27",type:"milestone",color:"emerald"}],ze=[{id:"brief-release",source:"brief",target:"release",type:"fs",color:"violet"},{id:"security-prototype",source:"security",target:"prototype",type:"fs",color:"amber"},{id:"copy-legal",source:"copy",target:"legal",type:"fs",color:"rose"},{id:"prototype-legal",source:"prototype",target:"legal",type:"fs",color:"cyan"},{id:"qa-release",source:"qa",target:"release",type:"fs",color:"blue"},{id:"legal-launch",source:"legal",target:"launch",type:"fs",color:"slate"},{id:"release-launch",source:"release",target:"launch",type:"fs",color:"emerald"}];function qe(){const[s,n]=t.useState(Ke),[c,u]=t.useState(ze);return e.jsx("div",{className:"w-full",children:e.jsx(r,{tasks:s,links:c,color:"blue",snap:"day",height:430,resizableColumns:!0,onTasksChange:n,onLinksChange:u})})}const Oe=`import { useState } from "react";
import { Gantt, type GanttLink, type GanttTask } from "@cjlapao/ui-kit";

const INITIAL_TASKS: GanttTask[] = [
  { id: "brief", name: "Brief", start: "2026-08-03", end: "2026-08-07", progress: 1, color: "violet" },
  { id: "security", name: "Security review", start: "2026-08-17", end: "2026-08-21", progress: 0.4, color: "amber" },
  { id: "prototype", name: "Prototype", start: "2026-08-08", end: "2026-08-11", progress: 0.8, color: "cyan" },
  { id: "release", name: "Release", start: "2026-08-22", end: "2026-08-26", progress: 0, color: "emerald" },
  { id: "copy", name: "Copy review", start: "2026-08-05", end: "2026-08-09", progress: 0.7, color: "rose" },
  { id: "legal", name: "Legal approval", start: "2026-08-18", end: "2026-08-23", progress: 0.2, color: "slate" },
  { id: "qa", name: "QA pass", start: "2026-08-12", end: "2026-08-16", progress: 0.3, color: "blue" },
  { id: "launch", name: "Launch gate", start: "2026-08-27", end: "2026-08-27", type: "milestone", color: "emerald" },
];

const INITIAL_LINKS: GanttLink[] = [
  { id: "brief-release", source: "brief", target: "release", type: "fs", color: "violet" },
  { id: "security-prototype", source: "security", target: "prototype", type: "fs", color: "amber" },
  { id: "copy-legal", source: "copy", target: "legal", type: "fs", color: "rose" },
  { id: "prototype-legal", source: "prototype", target: "legal", type: "fs", color: "cyan" },
  { id: "qa-release", source: "qa", target: "release", type: "fs", color: "blue" },
  { id: "legal-launch", source: "legal", target: "launch", type: "fs", color: "slate" },
  { id: "release-launch", source: "release", target: "launch", type: "fs", color: "emerald" },
];

export default function DenseRoutingExample() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [links, setLinks] = useState(INITIAL_LINKS);

  return (
    <div className="w-full">
      <Gantt
        tasks={tasks}
        links={links}
        color="blue"
        snap="day"
        height={430}
        resizableColumns
        onTasksChange={setTasks}
        onLinksChange={setLinks}
      />
    </div>
  );
}
`,_e=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(oe,{name:"Gantt Chart",description:"A fully interactive, feature-rich Gantt. Drag bars to move, drag the edges to resize, drag the right-edge handle to draw a dependency, drag the row grip to reorder, and drag the progress knob to set percent complete. Swimlanes group rows into collapsible bands, parent tasks roll up their children's span and progress, and a multi-scale header (hour → day → week → month → quarter) stays anchored as you zoom with the toolbar or Ctrl/Cmd + scroll."}),e.jsx(xe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Full sample",description:"Three swimlanes, two parent groups with roll-up progress, a milestone, and eight dependencies. Everything is editable out of the box: drag a bar, resize an edge, reorder a row, or draw a dependency from a bar's right handle.",code:we,filename:"Default.tsx",children:e.jsx(ve,{})}),e.jsx(o,{title:"Dependency types",description:"Every connector reads *source's right → target's left* — a task's **left** port is where its **parents** (predecessors) plug in and its **right** port is where its **children** (successors) plug out. The four constraint types (`fs`, `ff`, `ss`, `sf`) still show: `ff`/`sf` render dashed and hovering a connector names the exact type, while an optional `color` tints one edge. Overlapping tasks route through the clear space between their rows instead of folding back over the bars. Click an arrow to select it, then press Delete to remove it.",code:je,filename:"Dependencies.tsx",children:e.jsx(Te,{})}),e.jsx(o,{title:"Dense dependency routing",description:"Independent dependencies reserve adjacent lanes instead of disappearing into one shared stroke. Unavoidable perpendicular crossings use a small bridge on the horizontal route, and outside detours extend the scrollable drawing area automatically. Drag or resize a connected task to watch the routes update live.",code:Oe,filename:"DenseRouting.tsx",children:e.jsx(qe,{})}),e.jsx(o,{title:"Groups & roll-up",description:"Children reference a `parent`, indent under it, and drive its roll-up: the parent bar spans the children's span and its progress is the duration-weighted average. Click the caret to collapse a group — the children hide but the roll-up bar and its progress stay put.",code:Ae,filename:"Groups.tsx",children:e.jsx(Ne,{})}),e.jsx(o,{title:"Milestones & per-task colour",description:"`type: 'milestone'` collapses a bar to a single diamond at its date for deadlines that carry no duration. Per-task `color` is honoured independently of the chart's accent, so a mix of colours reads as a status map without extra props.",code:Ee,filename:"Milestones.tsx",children:e.jsx(Ge,{})}),e.jsx(o,{title:"Swimlanes & reorder",description:"`lanes` group rows into bands with a title header each, and are the unit for drag-to-reorder: the grip on the left of a row reorders within its lane only, so a swimlane stays a coherent block. Lanes can be collapsed from their header too.",code:Pe,filename:"Lanes.tsx",children:e.jsx(Re,{})})]})]});export{_e as GanttPage,_e as default};
