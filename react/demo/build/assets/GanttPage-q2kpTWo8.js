import{b5 as q,b6 as W,b7 as B,r as t,j as e,b8 as s,b9 as M}from"./index-CASQDqc_.js";import{P as $}from"./PageHeader-DxnWpf-v.js";import{E as l}from"./ExampleCard-D_CxWJdb.js";import{P as O,C as j,S as A,T as p}from"./PlaygroundPanel-B62eNAMn.js";const H=[{id:"design",label:"Design",color:"violet",description:"UX & visual"},{id:"eng",label:"Engineering",color:"blue",description:"Build & QA"},{id:"launch",label:"Launch",color:"emerald",description:"Ship it"}];function Q(i=new Date){const n=d=>q(W(B(i.getTime()),d));return[{id:"research",name:"User research",lane:"design",start:n(-12),end:n(-7),progress:1,color:"violet",owner:"Mira"},{id:"wireframes",name:"Wireframes",lane:"design",start:n(-9),end:n(-3),progress:1,color:"violet",owner:"Mira"},{id:"visual",name:"Visual design",lane:"design",start:n(-5),end:n(3),progress:.65,color:"purple",owner:"Jonas"},{id:"visual-tokens",name:"Design tokens",lane:"design",parent:"visual",start:n(-4),end:n(-1),progress:1,color:"purple",owner:"Jonas"},{id:"visual-flow",name:"Flow mockups",lane:"design",parent:"visual",start:n(-2),end:n(2),progress:.5,color:"purple",owner:"Jonas"},{id:"api",name:"API contracts",lane:"eng",start:n(-4),end:n(1),progress:1,color:"blue",owner:"Aiko"},{id:"webapp",name:"Web app",lane:"eng",start:n(0),end:n(12),progress:.3,color:"blue",owner:"Aiko"},{id:"webapp-shell",name:"App shell",lane:"eng",parent:"webapp",start:n(0),end:n(4),progress:.9,color:"sky",owner:"Aiko"},{id:"webapp-screens",name:"Screens",lane:"eng",parent:"webapp",start:n(3),end:n(9),progress:.2,color:"sky",owner:"Petra"},{id:"webapp-polish",name:"Polish & a11y",lane:"eng",parent:"webapp",start:n(8),end:n(12),progress:0,color:"sky",owner:"Petra"},{id:"qa",name:"QA pass",lane:"eng",start:n(10),end:n(14),progress:0,color:"cyan",owner:"Sam"},{id:"docs",name:"Docs & changelog",lane:"launch",start:n(6),end:n(11),progress:0,color:"emerald",owner:"Mira"},{id:"beta",name:"Beta",lane:"launch",start:n(12),end:n(15),progress:0,color:"teal",owner:"Sam"},{id:"ship",name:"GA release",lane:"launch",type:"milestone",start:n(16),end:n(16),color:"emerald",owner:"All"}]}function V(){return[{id:"l1",source:"research",target:"wireframes",type:"fs"},{id:"l2",source:"wireframes",target:"visual",type:"fs"},{id:"l3",source:"api",target:"webapp",type:"fs"},{id:"l4",source:"visual",target:"webapp",type:"ff",color:"violet"},{id:"l5",source:"webapp",target:"qa",type:"fs"},{id:"l6",source:"qa",target:"beta",type:"fs"},{id:"l7",source:"docs",target:"beta",type:"ss",color:"emerald"},{id:"l8",source:"beta",target:"ship",type:"fs"}]}const r={lanes:H,tasks:Q,links:V},F=["blue","emerald","violet","amber","rose","cyan"],J=[{label:"Free (no snap)",value:"none"},{label:"Hour",value:"hour"},{label:"Day",value:"day"},{label:"Week",value:"week"}],U=[{label:"Elevated",value:"elevated"},{label:"Outlined",value:"outlined"},{label:"Subtle",value:"subtle"},{label:"Tonal",value:"tonal"},{label:"Default (glassy)",value:"default"},{label:"Glass",value:"glass"},{label:"Liquid glass",value:"liquid-glass"},{label:"Simple",value:"simple"}],_=r.lanes,G=r.tasks(),N=r.links(),X=()=>{const[i,n]=t.useState(G),[d,u]=t.useState(N),[T,g]=t.useState(void 0),[m,C]=t.useState("blue"),[h,f]=t.useState("elevated"),[b,L]=t.useState("day"),[x,E]=t.useState(!0),[w,D]=t.useState(!0),[y,P]=t.useState(!0),[K,k]=t.useState({}),[v,S]=t.useState([]),[R,I]=t.useState(0),o=a=>{I(c=>c+1),S(c=>[{id:R+1,label:a},...c].slice(0,6))},z=()=>{n(G),u(N),g(void 0),f("elevated"),k({}),S([])};return e.jsx(O,{controls:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(j,{label:"Accent",children:e.jsx("div",{className:"flex flex-wrap gap-1.5",children:F.map(a=>e.jsx("button",{type:"button","aria-label":`Accent ${a}`,onClick:()=>C(a),className:`h-6 w-6 rounded-full ring-2 ring-offset-1 transition dark:ring-offset-neutral-900 ${m===a?"ring-neutral-400 dark:ring-neutral-500":"ring-transparent"}`,style:{backgroundColor:`var(--color-${a}-500)`}},a))})}),e.jsx(A,{label:"Surface variant",options:U,value:h,onChange:a=>f(a)}),e.jsx(A,{label:"Snap",options:J,value:b,onChange:a=>L(a)}),e.jsxs("div",{className:"flex flex-col gap-2.5",children:[e.jsx(p,{label:"Editable (drag / resize / reorder)",checked:x,onChange:E}),e.jsx(p,{label:"Today marker",checked:w,onChange:D}),e.jsx(p,{label:"Resizable columns (drag a header edge)",checked:y,onChange:P})]}),e.jsx("button",{type:"button",onClick:z,className:"self-start rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",children:"Reset sample data"}),e.jsx(j,{label:"Event log",children:e.jsxs("ul",{className:"flex h-[168px] flex-col gap-1 overflow-y-auto",children:[v.length===0&&e.jsx("li",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"Interact with the chart to see events."}),v.map(a=>e.jsx("li",{className:"rounded-md bg-neutral-50 px-2 py-1 font-mono text-[11px] text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300",children:a.label},a.id))]})})]}),preview:e.jsxs("div",{className:"w-full",children:[e.jsx(s,{tasks:i,links:d,lanes:_,rowOrder:T,color:m,variant:h,snap:b,editable:x,showToday:w,resizableColumns:y,columnWidths:K,onColumnWidthChange:a=>{k(a),o("Columns resized")},height:440,icon:e.jsx(M,{className:"h-5 w-5 text-blue-600 dark:text-blue-400"}),subtitle:"VENDOR ONBOARDING · REQ-4128",title:"Northwind Logistics GmbH",actions:e.jsxs("div",{className:"flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",children:[e.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"LIVE · read-only view"]}),onTasksChange:a=>{n(a),o("Dates / progress edited")},onLinksChange:a=>{u(a),o(`Dependencies → ${a.length}`)},onReorder:a=>{g(a),o("Rows reordered")},onSelect:a=>o(a?`Selected “${a}”`:"Selection cleared")}),e.jsx("p",{className:"px-1 pt-2 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500",children:"Hover a bar to reveal resize / progress / link handles · drag the right-edge handle to draw a dependency · drag the row grip to reorder · Ctrl/Cmd + scroll to pinch zoom."})]})})};function Y(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:r.tasks(),links:r.links(),lanes:r.lanes,color:"blue",height:420})})}const Z=`import { Gantt, sampleGantt } from "@cjlapao/ui-kit";

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
`,ee=[{id:"a",name:"Kickoff",start:"2026-08-03",end:"2026-08-07",color:"violet",progress:1},{id:"b",name:"Prototype",start:"2026-08-07",end:"2026-08-14",color:"blue",progress:.6},{id:"c",name:"Review",start:"2026-08-14",end:"2026-08-21",color:"blue",progress:0},{id:"d",name:"Handoff",start:"2026-08-21",end:"2026-08-28",color:"emerald",progress:0}],ne=[{id:"fs",source:"a",target:"b",type:"fs"},{id:"ff",source:"b",target:"c",type:"ff"},{id:"ss",source:"c",target:"d",type:"ss",color:"amber"},{id:"sf",source:"a",target:"c",type:"sf",color:"rose"}];function ae(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:ee,links:ne,color:"slate",snap:"day",height:300})})}const te=`import { Gantt, type GanttLink, type GanttTask } from "@cjlapao/ui-kit";

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
`,re=[{id:"platform",name:"Platform rebuild",start:"2026-08-03",end:"2026-08-21",color:"indigo",owner:"Lena"},{id:"auth",name:"Auth service",parent:"platform",start:"2026-08-03",end:"2026-08-10",progress:1,color:"indigo",owner:"Lena"},{id:"billing",name:"Billing",parent:"platform",start:"2026-08-06",end:"2026-08-16",progress:.5,color:"indigo",owner:"Theo"},{id:"notify",name:"Notifications",parent:"platform",start:"2026-08-11",end:"2026-08-21",progress:.2,color:"indigo",owner:"Theo"},{id:"migration",name:"Data migration",parent:"platform",start:"2026-08-14",end:"2026-08-21",progress:0,color:"indigo",owner:"Lena"},{id:"docs",name:"Docs",start:"2026-08-17",end:"2026-08-24",color:"emerald",owner:"Mira"}];function se(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:re,color:"indigo",snap:"day",height:300})})}const oe=`import { Gantt, type GanttTask } from "@cjlapao/ui-kit";

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
`,le=[{id:"plan",name:"Plan",start:"2026-08-03",end:"2026-08-08",color:"violet",progress:1},{id:"freeze",name:"Feature freeze",start:"2026-08-12",end:"2026-08-12",type:"milestone",color:"amber"},{id:"build",name:"Build",start:"2026-08-10",end:"2026-08-20",color:"blue",progress:.4},{id:"rc",name:"Release candidate",start:"2026-08-24",end:"2026-08-24",type:"milestone",color:"rose"},{id:"qa",name:"QA",start:"2026-08-20",end:"2026-08-27",color:"cyan",progress:0},{id:"ga",name:"GA",start:"2026-08-31",end:"2026-08-31",type:"milestone",color:"emerald"}];function ie(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:le,color:"blue",snap:"day",height:300})})}const de=`import { Gantt, type GanttTask } from "@cjlapao/ui-kit";

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
`,ce=[{id:"design",label:"Design"},{id:"eng",label:"Engineering"},{id:"launch",label:"Launch"}],pe=[{id:"d1",name:"Research",lane:"design",start:"2026-08-03",end:"2026-08-07",color:"violet",progress:1},{id:"d2",name:"Wireframes",lane:"design",start:"2026-08-05",end:"2026-08-10",color:"violet",progress:.8},{id:"d3",name:"Visuals",lane:"design",start:"2026-08-09",end:"2026-08-15",color:"violet",progress:.3},{id:"e1",name:"API",lane:"eng",start:"2026-08-07",end:"2026-08-13",color:"blue",progress:1},{id:"e2",name:"Web app",lane:"eng",start:"2026-08-10",end:"2026-08-20",color:"blue",progress:.5},{id:"e3",name:"QA",lane:"eng",start:"2026-08-18",end:"2026-08-22",color:"cyan",progress:0},{id:"l1",name:"Docs",lane:"launch",start:"2026-08-15",end:"2026-08-20",color:"emerald",progress:0},{id:"l2",name:"Beta",lane:"launch",start:"2026-08-20",end:"2026-08-24",color:"teal",progress:0}];function ue(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:pe,lanes:ce,color:"blue",snap:"day",height:340})})}const ge=`import { Gantt, type GanttLane, type GanttTask } from "@cjlapao/ui-kit";

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
`,xe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($,{name:"Gantt Chart",description:"A fully interactive, feature-rich Gantt. Drag bars to move, drag the edges to resize, drag the right-edge handle to draw a dependency, drag the row grip to reorder, and drag the progress knob to set percent complete. Swimlanes group rows into collapsible bands, parent tasks roll up their children's span and progress, and a multi-scale header (day → week → month → quarter) stays anchored as you zoom with the toolbar or Ctrl/Cmd + scroll."}),e.jsx(X,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Full sample",description:"Three swimlanes, two parent groups with roll-up progress, a milestone, and eight dependencies. Everything is editable out of the box: drag a bar, resize an edge, reorder a row, or draw a dependency from a bar's right handle.",code:Z,filename:"Default.tsx",children:e.jsx(Y,{})}),e.jsx(l,{title:"Dependency types",description:"Every connector reads *source's right → target's left* — a task's **left** port is where its **parents** (predecessors) plug in and its **right** port is where its **children** (successors) plug out. The four constraint types (`fs`, `ff`, `ss`, `sf`) still show: `ff`/`sf` render dashed and hovering a connector names the exact type, while an optional `color` tints one edge. Overlapping tasks route through the clear space between their rows instead of folding back over the bars. Click an arrow to select it, then press Delete to remove it.",code:te,filename:"Dependencies.tsx",children:e.jsx(ae,{})}),e.jsx(l,{title:"Groups & roll-up",description:"Children reference a `parent`, indent under it, and drive its roll-up: the parent bar spans the children's span and its progress is the duration-weighted average. Click the caret to collapse a group — the children hide but the roll-up bar and its progress stay put.",code:oe,filename:"Groups.tsx",children:e.jsx(se,{})}),e.jsx(l,{title:"Milestones & per-task colour",description:"`type: 'milestone'` collapses a bar to a single diamond at its date for deadlines that carry no duration. Per-task `color` is honoured independently of the chart's accent, so a mix of colours reads as a status map without extra props.",code:de,filename:"Milestones.tsx",children:e.jsx(ie,{})}),e.jsx(l,{title:"Swimlanes & reorder",description:"`lanes` group rows into bands with a title header each, and are the unit for drag-to-reorder: the grip on the left of a row reorders within its lane only, so a swimlane stays a coherent block. Lanes can be collapsed from their header too.",code:ge,filename:"Lanes.tsx",children:e.jsx(ue,{})})]})]});export{xe as GanttPage,xe as default};
