import{dE as H,dF as O,dG as $,r as t,j as e,dH as s,dI as Q}from"./index-gt012o8E.js";import{P as V}from"./PageHeader-CzVhyXQL.js";import{E as l}from"./ExampleCard-V3REeYJ5.js";import{P as F,a as C,S as i,T as u}from"./PlaygroundPanel-Czrs7oXC.js";const J=[{id:"design",label:"Design",color:"violet",description:"UX & visual"},{id:"eng",label:"Engineering",color:"blue",description:"Build & QA"},{id:"launch",label:"Launch",color:"emerald",description:"Ship it"}];function U(d=new Date){const n=c=>H(O($(d.getTime()),c));return[{id:"research",name:"User research",lane:"design",start:n(-12),end:n(-7),progress:1,color:"violet",owner:"Mira"},{id:"wireframes",name:"Wireframes",lane:"design",start:n(-9),end:n(-3),progress:1,color:"violet",owner:"Mira"},{id:"visual",name:"Visual design",lane:"design",start:n(-5),end:n(3),progress:.65,color:"purple",owner:"Jonas"},{id:"visual-tokens",name:"Design tokens",lane:"design",parent:"visual",start:n(-4),end:n(-1),progress:1,color:"purple",owner:"Jonas"},{id:"visual-flow",name:"Flow mockups",lane:"design",parent:"visual",start:n(-2),end:n(2),progress:.5,color:"purple",owner:"Jonas"},{id:"api",name:"API contracts",lane:"eng",start:n(-4),end:n(1),progress:1,color:"blue",owner:"Aiko"},{id:"webapp",name:"Web app",lane:"eng",start:n(0),end:n(12),progress:.3,color:"blue",owner:"Aiko"},{id:"webapp-shell",name:"App shell",lane:"eng",parent:"webapp",start:n(0),end:n(4),progress:.9,color:"sky",owner:"Aiko"},{id:"webapp-screens",name:"Screens",lane:"eng",parent:"webapp",start:n(3),end:n(9),progress:.2,color:"sky",owner:"Petra"},{id:"webapp-polish",name:"Polish & a11y",lane:"eng",parent:"webapp",start:n(8),end:n(12),progress:0,color:"sky",owner:"Petra"},{id:"qa",name:"QA pass",lane:"eng",start:n(10),end:n(14),progress:0,color:"cyan",owner:"Sam"},{id:"docs",name:"Docs & changelog",lane:"launch",start:n(6),end:n(11),progress:0,color:"emerald",owner:"Mira"},{id:"beta",name:"Beta",lane:"launch",start:n(12),end:n(15),progress:0,color:"teal",owner:"Sam"},{id:"ship",name:"GA release",lane:"launch",type:"milestone",start:n(16),end:n(16),color:"emerald",owner:"All"}]}function _(){return[{id:"l1",source:"research",target:"wireframes",type:"fs"},{id:"l2",source:"wireframes",target:"visual",type:"fs"},{id:"l3",source:"api",target:"webapp",type:"fs"},{id:"l4",source:"visual",target:"webapp",type:"ff",color:"violet"},{id:"l5",source:"webapp",target:"qa",type:"fs"},{id:"l6",source:"qa",target:"beta",type:"fs"},{id:"l7",source:"docs",target:"beta",type:"ss",color:"emerald"},{id:"l8",source:"beta",target:"ship",type:"fs"}]}const r={lanes:J,tasks:U,links:_},X=["blue","emerald","violet","amber","rose","cyan"],Y=[{label:"Free (no snap)",value:"none"},{label:"Hour",value:"hour"},{label:"Day",value:"day"},{label:"Week",value:"week"}],Z=[{label:"Elevated",value:"elevated"},{label:"Outlined",value:"outlined"},{label:"Subtle",value:"subtle"},{label:"Tonal",value:"tonal"},{label:"Default (glassy)",value:"default"},{label:"Glass",value:"glass"},{label:"Liquid glass",value:"liquid-glass"},{label:"Simple",value:"simple"}],ee=[{label:"Sharp (none)",value:"none"},{label:"Slight (rounded)",value:"rounded"},{label:"Soft (rounded-sm)",value:"rounded-sm"},{label:"Medium (rounded-md)",value:"rounded-md"},{label:"Large (rounded-lg)",value:"rounded-lg"},{label:"Extra (rounded-xl)",value:"rounded-xl"}],ne=[{label:"None",value:"none"},{label:"Extra small",value:"xs"},{label:"Small",value:"sm"},{label:"Medium",value:"md"},{label:"Large",value:"lg"},{label:"Extra large",value:"xl"}],ae=r.lanes,E=r.tasks(),L=r.links(),te=()=>{const[d,n]=t.useState(E),[c,g]=t.useState(L),[D,m]=t.useState(void 0),[h,P]=t.useState("blue"),[f,b]=t.useState("elevated"),[x,w]=t.useState("rounded-sm"),[v,y]=t.useState("none"),[k,R]=t.useState("day"),[S,I]=t.useState(!0),[j,K]=t.useState(!0),[A,z]=t.useState(!0),[M,N]=t.useState({}),[G,T]=t.useState([]),[q,W]=t.useState(0),o=a=>{W(p=>p+1),T(p=>[{id:q+1,label:a},...p].slice(0,6))},B=()=>{n(E),g(L),m(void 0),b("elevated"),w("rounded-sm"),y("none"),N({}),T([])};return e.jsx(F,{controls:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(C,{label:"Accent",children:e.jsx("div",{className:"flex flex-wrap gap-1.5",children:X.map(a=>e.jsx("button",{type:"button","aria-label":`Accent ${a}`,onClick:()=>P(a),className:`h-6 w-6 rounded-full ring-2 ring-offset-1 transition dark:ring-offset-neutral-900 ${h===a?"ring-neutral-400 dark:ring-neutral-500":"ring-transparent"}`,style:{backgroundColor:`var(--color-${a}-500)`}},a))})}),e.jsx(i,{label:"Surface variant",options:Z,value:f,onChange:a=>b(a)}),e.jsx(i,{label:"Snap",options:Y,value:k,onChange:a=>R(a)}),e.jsx(i,{label:"Corner",options:ee,value:x,onChange:a=>w(a)}),e.jsx(i,{label:"Padding",options:ne,value:v,onChange:a=>y(a)}),e.jsxs("div",{className:"flex flex-col gap-2.5",children:[e.jsx(u,{label:"Editable (drag / resize / reorder)",checked:S,onChange:I}),e.jsx(u,{label:"Today marker",checked:j,onChange:K}),e.jsx(u,{label:"Resizable columns (drag a header edge)",checked:A,onChange:z})]}),e.jsx("button",{type:"button",onClick:B,className:"self-start rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",children:"Reset sample data"}),e.jsx(C,{label:"Event log",children:e.jsxs("ul",{className:"flex h-[168px] flex-col gap-1 overflow-y-auto",children:[G.length===0&&e.jsx("li",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"Interact with the chart to see events."}),G.map(a=>e.jsx("li",{className:"rounded-md bg-neutral-50 px-2 py-1 font-mono text-[11px] text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300",children:a.label},a.id))]})})]}),preview:e.jsxs("div",{className:"w-full",children:[e.jsx(s,{tasks:d,links:c,lanes:ae,rowOrder:D,color:h,variant:f,corner:x,padding:v,snap:k,editable:S,showToday:j,resizableColumns:A,columnWidths:M,onColumnWidthChange:a=>{N(a),o("Columns resized")},height:440,icon:e.jsx(Q,{className:"h-5 w-5 text-blue-600 dark:text-blue-400"}),subtitle:"VENDOR ONBOARDING · REQ-4128",title:"Northwind Logistics GmbH",actions:e.jsxs("div",{className:"flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",children:[e.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"LIVE · read-only view"]}),onTasksChange:a=>{n(a),o("Dates / progress edited")},onLinksChange:a=>{g(a),o(`Dependencies → ${a.length}`)},onReorder:a=>{m(a),o("Rows reordered")},onSelect:a=>o(a?`Selected “${a}”`:"Selection cleared")}),e.jsx("p",{className:"px-1 pt-2 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500",children:"Hover a bar to reveal resize / progress / link handles · drag the right-edge handle to draw a dependency · drag the row grip to reorder · Ctrl/Cmd + scroll to pinch zoom · click the chart, then use ↑/↓ · Home/End to walk rows and +/− to zoom."})]})})};function re(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:r.tasks(),links:r.links(),lanes:r.lanes,color:"blue",height:420})})}const se=`import { Gantt, sampleGantt } from "@cjlapao/ui-kit";

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
`,oe=[{id:"a",name:"Kickoff",start:"2026-08-03",end:"2026-08-07",color:"violet",progress:1},{id:"b",name:"Prototype",start:"2026-08-07",end:"2026-08-14",color:"blue",progress:.6},{id:"c",name:"Review",start:"2026-08-14",end:"2026-08-21",color:"blue",progress:0},{id:"d",name:"Handoff",start:"2026-08-21",end:"2026-08-28",color:"emerald",progress:0}],le=[{id:"fs",source:"a",target:"b",type:"fs"},{id:"ff",source:"b",target:"c",type:"ff"},{id:"ss",source:"c",target:"d",type:"ss",color:"amber"},{id:"sf",source:"a",target:"c",type:"sf",color:"rose"}];function ie(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:oe,links:le,color:"slate",snap:"day",height:300})})}const de=`import { Gantt, type GanttLink, type GanttTask } from "@cjlapao/ui-kit";

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
`,ce=[{id:"platform",name:"Platform rebuild",start:"2026-08-03",end:"2026-08-21",color:"indigo",owner:"Lena"},{id:"auth",name:"Auth service",parent:"platform",start:"2026-08-03",end:"2026-08-10",progress:1,color:"indigo",owner:"Lena"},{id:"billing",name:"Billing",parent:"platform",start:"2026-08-06",end:"2026-08-16",progress:.5,color:"indigo",owner:"Theo"},{id:"notify",name:"Notifications",parent:"platform",start:"2026-08-11",end:"2026-08-21",progress:.2,color:"indigo",owner:"Theo"},{id:"migration",name:"Data migration",parent:"platform",start:"2026-08-14",end:"2026-08-21",progress:0,color:"indigo",owner:"Lena"},{id:"docs",name:"Docs",start:"2026-08-17",end:"2026-08-24",color:"emerald",owner:"Mira"}];function pe(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:ce,color:"indigo",snap:"day",height:300})})}const ue=`import { Gantt, type GanttTask } from "@cjlapao/ui-kit";

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
`,ge=[{id:"plan",name:"Plan",start:"2026-08-03",end:"2026-08-08",color:"violet",progress:1},{id:"freeze",name:"Feature freeze",start:"2026-08-12",end:"2026-08-12",type:"milestone",color:"amber"},{id:"build",name:"Build",start:"2026-08-10",end:"2026-08-20",color:"blue",progress:.4},{id:"rc",name:"Release candidate",start:"2026-08-24",end:"2026-08-24",type:"milestone",color:"rose"},{id:"qa",name:"QA",start:"2026-08-20",end:"2026-08-27",color:"cyan",progress:0},{id:"ga",name:"GA",start:"2026-08-31",end:"2026-08-31",type:"milestone",color:"emerald"}];function me(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:ge,color:"blue",snap:"day",height:300})})}const he=`import { Gantt, type GanttTask } from "@cjlapao/ui-kit";

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
`,fe=[{id:"design",label:"Design"},{id:"eng",label:"Engineering"},{id:"launch",label:"Launch"}],be=[{id:"d1",name:"Research",lane:"design",start:"2026-08-03",end:"2026-08-07",color:"violet",progress:1},{id:"d2",name:"Wireframes",lane:"design",start:"2026-08-05",end:"2026-08-10",color:"violet",progress:.8},{id:"d3",name:"Visuals",lane:"design",start:"2026-08-09",end:"2026-08-15",color:"violet",progress:.3},{id:"e1",name:"API",lane:"eng",start:"2026-08-07",end:"2026-08-13",color:"blue",progress:1},{id:"e2",name:"Web app",lane:"eng",start:"2026-08-10",end:"2026-08-20",color:"blue",progress:.5},{id:"e3",name:"QA",lane:"eng",start:"2026-08-18",end:"2026-08-22",color:"cyan",progress:0},{id:"l1",name:"Docs",lane:"launch",start:"2026-08-15",end:"2026-08-20",color:"emerald",progress:0},{id:"l2",name:"Beta",lane:"launch",start:"2026-08-20",end:"2026-08-24",color:"teal",progress:0}];function xe(){return e.jsx("div",{className:"w-full",children:e.jsx(s,{tasks:be,lanes:fe,color:"blue",snap:"day",height:340})})}const we=`import { Gantt, type GanttLane, type GanttTask } from "@cjlapao/ui-kit";

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
`,je=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(V,{name:"Gantt Chart",description:"A fully interactive, feature-rich Gantt. Drag bars to move, drag the edges to resize, drag the right-edge handle to draw a dependency, drag the row grip to reorder, and drag the progress knob to set percent complete. Swimlanes group rows into collapsible bands, parent tasks roll up their children's span and progress, and a multi-scale header (day → week → month → quarter) stays anchored as you zoom with the toolbar or Ctrl/Cmd + scroll."}),e.jsx(te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Full sample",description:"Three swimlanes, two parent groups with roll-up progress, a milestone, and eight dependencies. Everything is editable out of the box: drag a bar, resize an edge, reorder a row, or draw a dependency from a bar's right handle.",code:se,filename:"Default.tsx",children:e.jsx(re,{})}),e.jsx(l,{title:"Dependency types",description:"Every connector reads *source's right → target's left* — a task's **left** port is where its **parents** (predecessors) plug in and its **right** port is where its **children** (successors) plug out. The four constraint types (`fs`, `ff`, `ss`, `sf`) still show: `ff`/`sf` render dashed and hovering a connector names the exact type, while an optional `color` tints one edge. Overlapping tasks route through the clear space between their rows instead of folding back over the bars. Click an arrow to select it, then press Delete to remove it.",code:de,filename:"Dependencies.tsx",children:e.jsx(ie,{})}),e.jsx(l,{title:"Groups & roll-up",description:"Children reference a `parent`, indent under it, and drive its roll-up: the parent bar spans the children's span and its progress is the duration-weighted average. Click the caret to collapse a group — the children hide but the roll-up bar and its progress stay put.",code:ue,filename:"Groups.tsx",children:e.jsx(pe,{})}),e.jsx(l,{title:"Milestones & per-task colour",description:"`type: 'milestone'` collapses a bar to a single diamond at its date for deadlines that carry no duration. Per-task `color` is honoured independently of the chart's accent, so a mix of colours reads as a status map without extra props.",code:he,filename:"Milestones.tsx",children:e.jsx(me,{})}),e.jsx(l,{title:"Swimlanes & reorder",description:"`lanes` group rows into bands with a title header each, and are the unit for drag-to-reorder: the grip on the left of a row reorders within its lane only, so a swimlane stays a coherent block. Lanes can be collapsed from their header too.",code:we,filename:"Lanes.tsx",children:e.jsx(xe,{})})]})]});export{je as GanttPage,je as default};
