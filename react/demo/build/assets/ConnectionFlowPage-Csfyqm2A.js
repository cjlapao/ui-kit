import{r as s,j as e,b9 as o,au as K,ba as Q,f as J,ax as X}from"./index-BBK6HA-D.js";import{P as ee}from"./PageHeader-BcBcU29I.js";import{E as a}from"./ExampleCard-BVwGIEPO.js";import{P as te,C as ne,S as i,a as se,T as l}from"./ControlAccordion-DallGojj.js";import{n as ie,t as oe,aL as ae,p as le,aM as re,aN as de,aO as ce,aP as ue,aQ as pe,aR as he,aS as ge}from"./options-D-FMIizr.js";const d=[{id:"release",title:"Release Canary version",subtitle:"10s",icon:"Rocket",status:"succeeded",progress:1},{id:"matrix-mac",group:"build",title:"Matrix: Release Go Binary (macOS)",subtitle:"2 jobs completed",icon:"Apple",status:"succeeded",kind:"parallel",items:[{id:"mac-arm",title:"darwin/arm64",subtitle:"1m 20s",status:"succeeded"},{id:"mac-x64",title:"darwin/amd64",subtitle:"1m 44s",status:"succeeded"},{id:"mac-uni",title:"darwin/universal",subtitle:"58s",status:"succeeded"},{id:"mac-sign",title:"codesign",subtitle:"12s",status:"succeeded"},{id:"mac-notary",title:"notarize",subtitle:"queued",status:"pending"}]},{id:"matrix-win",group:"build",title:"Matrix: Release Go Binary (Windows)",subtitle:"6 jobs completed",icon:"Windows",status:"succeeded",kind:"parallel",itemProgress:"spinner",items:[{id:"win-x64",title:"windows/amd64",subtitle:"signing",progress:.62,status:"running"},{id:"win-arm",title:"windows/arm64",subtitle:"3m 02s",progress:1,status:"succeeded"}]},{id:"docker",group:"build",title:"Build Docker Images",subtitle:"13m 13s",icon:"Docker",status:"running",kind:"parallel",items:[{id:"dk-amd",title:"linux/amd64",subtitle:"pushing",progress:.8},{id:"dk-arm",title:"linux/arm64",subtitle:"pushing",progress:.35}]},{id:"staging",group:"publish",title:"Deploy to Staging",subtitle:"eu-west-1 · 4s",icon:"Host",status:"running",kind:"parallel",progress:.55,connector:{label:"on: main"}},{id:"announce",group:"publish",title:"Announce on Discord",icon:"Notification",status:"succeeded",kind:"parallel",maxHeight:120,items:[{id:"an-1",title:"#releases",subtitle:"posted",status:"succeeded"},{id:"an-2",title:"#engineering",subtitle:"posted",status:"succeeded"},{id:"an-3",title:"#support",subtitle:"posted",status:"succeeded"},{id:"an-4",title:"#changelog",subtitle:"posted",status:"succeeded"}],maxItems:0},{id:"scan",title:"Security Scan",subtitle:"govulncheck",icon:"Key",status:"skipped"},{id:"cleanup",title:"Remove old canary release",subtitle:"waiting",icon:"Trash",status:"pending",connector:{state:"disabled"}}],me=()=>{const[n,r]=s.useState("md"),[c,E]=s.useState("neutral"),[u,I]=s.useState("rounded-md"),[p,L]=s.useState("outlined"),[h,P]=s.useState("orthogonal"),[g,A]=s.useState("md"),[m,D]=s.useState("flowing"),[f,_]=s.useState("bar"),[b,R]=s.useState("bar"),[x,z]=s.useState(2),[w,H]=s.useState("skeleton"),[v,W]=s.useState(!1),[y,V]=s.useState(!0),[S,G]=s.useState(120),[k,B]=s.useState(700),[C,q]=s.useState(!0),[N,M]=s.useState(!0),[j,U]=s.useState(!0),[O,Z]=s.useState(!0),[F,$]=s.useState(!0),[T,Y]=s.useState(null);return e.jsx(te,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ne,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Size",options:ie,value:n,onChange:t=>r(t)}),e.jsx(i,{label:"Tone",options:oe,value:c,onChange:t=>E(t)}),e.jsx(i,{label:"Variant",options:ae,value:p,onChange:t=>L(t)}),e.jsx(i,{label:"Corner",options:le,value:u,onChange:t=>I(t)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Loader",options:re,value:w,onChange:t=>H(t)}),e.jsx(i,{label:"Flow state",options:de,value:m,onChange:t=>D(t)}),e.jsx(se,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(l,{label:"Loading",checked:v,onChange:W}),e.jsx(l,{label:"Header",checked:y,onChange:V}),e.jsx(l,{label:"Auto state",checked:C,onChange:q}),e.jsx(l,{label:"Animated",checked:N,onChange:M}),e.jsx(l,{label:"Highlight path",checked:j,onChange:U}),e.jsx(l,{label:"Zoom controls",checked:O,onChange:Z}),e.jsx(l,{label:"Zoom / pan",checked:F,onChange:$})]})})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Edge style",options:ce,value:h,onChange:t=>P(t)}),e.jsx(i,{label:"Ring size",options:ue,value:g,onChange:t=>A(t)}),e.jsx(i,{label:"Progress",options:pe,value:f,onChange:t=>_(t)}),e.jsx(i,{label:"Item progress",options:he,value:b,onChange:t=>R(t)}),e.jsx(i,{label:"Rows before “show more”",options:ge,value:String(x),onChange:t=>z(Number(t))})]})},{id:"motion",title:"Motion",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Dot speed",options:[{label:"60 px/s",value:"60"},{label:"120 px/s",value:"120"},{label:"180 px/s",value:"180"},{label:"240 px/s",value:"240"},{label:"360 px/s",value:"360"},{label:"480 px/s",value:"480"}],value:String(S),onChange:t=>G(Number(t))}),e.jsx(i,{label:"Dot interval",options:[{label:"250 ms",value:"250"},{label:"450 ms",value:"450"},{label:"700 ms",value:"700"},{label:"1200 ms",value:"1200"}],value:String(k),onChange:t=>B(Number(t))})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Every edge — track, fan, child and bypass alike — is routed by one port-and-shape engine, so ",e.jsx("strong",{children:"edge style"})," applies to all of them at once. Scroll to zoom, drag to pan, and hover a node to light the path that reached it. ",e.jsx("strong",{children:"Variant"})," is one decision, not two: the cards take the surface of the panel they sit in rather than a scale of their own. Every dot moves at one"," ",e.jsx("strong",{children:"speed"}),", and each source releases one at a time — first target, second, third, then round again — so a fan reads as one source feeding its targets rather than as a swarm. The matrix cards are built from"," ",e.jsx("strong",{children:"items"}),": one runs past the cap so the rest fold behind “show more”, one shows a spinner in place of its glyph until it finishes, and “Announce on Discord” is capped with"," ",e.jsx("code",{children:"maxHeight"})," so its body scrolls."]})]}),preview:e.jsxs("div",{className:"w-full space-y-2",children:[e.jsx(o,{nodes:d,variant:p,eyebrow:"release_canary.yml",title:"Release Canary version",subtitle:"on: workflow_dispatch",icon:"Rocket",tag:"LIVE",tagTone:"emerald",showHeader:y,loading:v,loaderType:w,size:n,tone:c,corner:u,edgeStyle:h,ringSize:g,flowState:m,progressType:f,itemProgress:b,dotSpeed:S,dotInterval:k,maxVisibleItems:x,autoState:C,animated:N,highlightPath:j,showControls:O,interactive:F,height:520,onNodeClick:t=>Y(t.id)}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:T?`Selected: ${T}`:"Click a node to select it."})]})})};function fe(){return e.jsx("div",{className:"grid w-full gap-4",children:K.map(n=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),e.jsx(o,{fitOnLoad:!0,nodes:d,edgeStyle:n,variant:"outlined",autoState:!0,height:260})]},n))})}const be=`import { CONNECTION_FLOW_EDGE_STYLES, ConnectionFlow } from "@cjlapao/ui-kit";
import { CI_FLOW } from "./sampleFlow";

/**
 * All three styles route the same way — out along each port's normal, then an
 * axis-aligned turn, with a whole fan sharing one spine. They differ only at
 * the corners: \`straight\` mitres them, \`orthogonal\` rounds them by a fixed
 * radius, \`curved\` rounds them as far as the segments allow.
 */
export default function EdgeStyles() {
  return (
    <div className="grid w-full gap-4">
      {CONNECTION_FLOW_EDGE_STYLES.map((edgeStyle) => (
        <div key={edgeStyle} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {edgeStyle}
          </span>
          <ConnectionFlow
      fitOnLoad
            nodes={CI_FLOW}
            edgeStyle={edgeStyle}
            variant="outlined"
            autoState
            height={260}
          />
        </div>
      ))}
    </div>
  );
}
`,xe=[{id:"build",title:"Matrix: Build",subtitle:"5 jobs",items:[{id:"a",title:"darwin/arm64",subtitle:"1m 20s",status:"succeeded"},{id:"b",title:"darwin/amd64",subtitle:"1m 44s",status:"succeeded"},{id:"c",title:"linux/amd64",subtitle:"58s",status:"succeeded"},{id:"d",title:"windows/amd64",subtitle:"queued",status:"pending"},{id:"e",title:"notarize",subtitle:"queued",status:"pending"}]},{id:"publish",title:"Publish",itemProgress:"spinner",items:[{id:"p1",title:"ghcr.io",subtitle:"pushing",progress:.6,status:"running"},{id:"p2",title:"docker.io",subtitle:"3m 02s",progress:1,status:"succeeded"}]},{id:"notify",title:"Notify",maxHeight:130,maxItems:0,items:[{id:"n1",title:"#releases",subtitle:"posted",status:"succeeded"},{id:"n2",title:"#engineering",subtitle:"posted",status:"succeeded"},{id:"n3",title:"#support",subtitle:"posted",status:"succeeded"},{id:"n4",title:"#changelog",subtitle:"posted",status:"succeeded"}]}];function we(){return e.jsx(o,{fitOnLoad:!0,nodes:xe,height:300,progressType:"none"})}const ve=`import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * A card's body can be a list of \`items\` — a fixed shape (title, subtitle,
 * glyph, progress) rather than free content, because the layout is pure and a
 * card's height has to be arithmetic. That is what lets a card grow to fit its
 * rows and the edges re-route around it, with nothing measured from the DOM.
 *
 * Progress has two homes: a \`bar\` under the row's text, or a \`spinner\` in
 * place of its glyph. The spinner gives the slot back at 100%, and the column
 * is reserved for the whole list, so a row never shifts as its neighbour
 * finishes.
 */
const NODES: ConnectionFlowNode[] = [
  {
    id: "build",
    title: "Matrix: Build",
    subtitle: "5 jobs",
    // Past the cap, so the rest fold behind "show more". Expanding re-measures
    // the card, which re-cuts its silhouette and re-routes its edges.
    items: [
      { id: "a", title: "darwin/arm64", subtitle: "1m 20s", status: "succeeded" },
      { id: "b", title: "darwin/amd64", subtitle: "1m 44s", status: "succeeded" },
      { id: "c", title: "linux/amd64", subtitle: "58s", status: "succeeded" },
      { id: "d", title: "windows/amd64", subtitle: "queued", status: "pending" },
      { id: "e", title: "notarize", subtitle: "queued", status: "pending" },
    ],
  },
  {
    id: "publish",
    title: "Publish",
    itemProgress: "spinner",
    items: [
      { id: "p1", title: "ghcr.io", subtitle: "pushing", progress: 0.6, status: "running" },
      { id: "p2", title: "docker.io", subtitle: "3m 02s", progress: 1, status: "succeeded" },
    ],
  },
  {
    id: "notify",
    title: "Notify",
    // Capped rather than measured: the body outgrows the room we want to give
    // it, so it scrolls inside the cap instead of the card growing.
    maxHeight: 130,
    maxItems: 0,
    items: [
      { id: "n1", title: "#releases", subtitle: "posted", status: "succeeded" },
      { id: "n2", title: "#engineering", subtitle: "posted", status: "succeeded" },
      { id: "n3", title: "#support", subtitle: "posted", status: "succeeded" },
      { id: "n4", title: "#changelog", subtitle: "posted", status: "succeeded" },
    ],
  },
];

export default function Items() {
  return <ConnectionFlow
      fitOnLoad nodes={NODES} height={300} progressType="none" />;
}
`,ye=[...Q.map((n,r)=>({id:n,title:n,status:n,skipped:!1,kind:r===0?void 0:"parallel",group:"statuses"})),{id:"override",title:"failed, but violet",status:"failed",tone:"violet",skipped:!1,kind:"parallel",group:"statuses"}];function Se(){return e.jsx(o,{fitOnLoad:!0,nodes:ye,size:"sm",progressType:"none",showControls:!1,height:280})}const ke=`import { CONNECTION_FLOW_STATUSES, ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * \`status\` says what happened to a step; the tone and the glyph follow from it.
 * A CI already knows this, and hand-translating it to a tone at every call site
 * is how a flow ends up with \`red\` on one card and \`rose\` on the next.
 *
 * \`tone\` still wins where it is set — the last node here is \`failed\` painted
 * violet — so a status is a default, not a constraint. \`running\` also implies
 * \`active\` and \`skipped\` implies bypassing, so the semantics are stated once.
 */
const NODES: ConnectionFlowNode[] = [
  ...CONNECTION_FLOW_STATUSES.map((status, index) => ({
    id: status,
    title: status,
    status,
    // \`skipped\` would otherwise be arched over rather than shown.
    skipped: false,
    kind: index === 0 ? undefined : ("parallel" as const),
    group: "statuses",
  })),
  {
    id: "override",
    title: "failed, but violet",
    status: "failed" as const,
    tone: "violet" as const,
    skipped: false,
    kind: "parallel" as const,
    group: "statuses",
  },
];

export default function Status() {
  return (
    <ConnectionFlow
      fitOnLoad
      nodes={NODES}
      size="sm"
      progressType="none"
      showControls={false}
      height={280}
    />
  );
}
`,Ce=[{id:"a",title:"Build",subtitle:"13m 13s",icon:"Docker",tone:"emerald"},{id:"b",title:"Deploy",subtitle:"eu-west-1",icon:"Host",tone:"blue"},{id:"c",title:"Announce",subtitle:"waiting",icon:"Notification"}];function Ne(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:J.map(n=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),e.jsx(o,{fitOnLoad:!0,nodes:Ce,variant:n,title:n,size:"sm",progressType:"none",showControls:!1,height:150})]},n))})}const je=`import { SURFACE_VARIANTS, ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const TRIO: ConnectionFlowNode[] = [
  { id: "a", title: "Build", subtitle: "13m 13s", icon: "Docker", tone: "emerald" },
  { id: "b", title: "Deploy", subtitle: "eu-west-1", icon: "Host", tone: "blue" },
  { id: "c", title: "Announce", subtitle: "waiting", icon: "Notification" },
];

/**
 * \`variant\` is one decision, not two. The panel and the cards inside it take
 * the same surface, painted from the same shade table \`Panel\` uses — a card
 * sitting in a panel is part of that panel, not a second surface language
 * layered on top of it.
 *
 * The card is drawn as an SVG path (a terminal is the card bulging), so the
 * glass variants keep their translucent fill and light rim but cannot carry a
 * backdrop blur.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {SURFACE_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {variant}
          </span>
          <ConnectionFlow
            fitOnLoad
            nodes={TRIO}
            variant={variant}
            title={variant}
            size="sm"
            progressType="none"
            showControls={false}
            height={150}
          />
        </div>
      ))}
    </div>
  );
}
`,Oe=[{id:"listen",title:"LISTENING",subtitle:"0.0.0.0:40900",icon:"Globe",tone:"sky",active:!0},{id:"target",title:"TARGET",subtitle:"6c6620…",icon:"Host"}];function Fe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:X.filter(n=>["fit","sm","xl"].includes(n)).map(n=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),e.jsx(o,{fitOnLoad:!0,nodes:Oe,ringSize:n,size:"sm",progressType:"none",showControls:!1,height:160})]},n))})}const Te=`import { CONNECTION_FLOW_RING_SIZES, ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const PAIR: ConnectionFlowNode[] = [
  {
    id: "listen",
    title: "LISTENING",
    subtitle: "0.0.0.0:40900",
    icon: "Globe",
    tone: "sky",
    active: true,
  },
  { id: "target", title: "TARGET", subtitle: "6c6620…", icon: "Host" },
];

/**
 * A terminal is the card itself bulging. The node's silhouette is one path — a
 * rounded rectangle that detours around each of its ports — so the bulge takes
 * the same fill as the rest of the card and no border crosses it. A solid dot
 * at the centre is what the edge attaches to. \`ringSize\` sizes the bulge on the
 * shared control scale, and \`fit\` leaves the outline straight. Terminals belong
 * to the port, not to the edge, so a fan-out draws one — not one per line.
 */
export default function Connectors() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {CONNECTION_FLOW_RING_SIZES.filter((size) =>
        ["fit", "sm", "xl"].includes(size),
      ).map((ringSize) => (
        <div key={ringSize} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {ringSize}
          </span>
          <ConnectionFlow
      fitOnLoad
            nodes={PAIR}
            ringSize={ringSize}
            size="sm"
            progressType="none"
            showControls={false}
            height={160}
          />
        </div>
      ))}
    </div>
  );
}
`,Ee=[{id:"root",title:"Plan",icon:"Blueprint",tone:"violet"},{id:"provision",title:"Provision",icon:"Cog",tone:"violet",children:[{id:"net",title:"Network",tone:"violet"},{id:"db",title:"Database",tone:"violet"}]},{id:"api",title:"API",kind:"parallel",tone:"sky"},{id:"worker",title:"Worker",kind:"parallel",tone:"sky"},{id:"web",title:"Web",kind:"parallel",tone:"sky"},{id:"smoke",title:"Smoke test",icon:"Bug",tone:"emerald"}];function Ie(){return e.jsx(o,{fitOnLoad:!0,nodes:Ee,variant:"outlined",height:300,flowState:"stopped"})}const Le=`import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * \`kind\` borrows TreeView's idea of connection type: \`step\` follows the track,
 * \`parallel\` stacks into lanes that fan out and back in, and \`children\` hang
 * vertically below their parent.
 */
const NODES: ConnectionFlowNode[] = [
  { id: "root", title: "Plan", icon: "Blueprint", tone: "violet" },
  {
    id: "provision",
    title: "Provision",
    icon: "Cog",
    tone: "violet",
    children: [
      { id: "net", title: "Network", tone: "violet" },
      { id: "db", title: "Database", tone: "violet" },
    ],
  },
  { id: "api", title: "API", kind: "parallel", tone: "sky" },
  { id: "worker", title: "Worker", kind: "parallel", tone: "sky" },
  { id: "web", title: "Web", kind: "parallel", tone: "sky" },
  { id: "smoke", title: "Smoke test", icon: "Bug", tone: "emerald" },
];

export default function Structure() {
  return (
    <ConnectionFlow
      fitOnLoad nodes={NODES} variant="outlined" height={300} flowState="stopped" />
  );
}
`;function Pe(){return e.jsx(o,{fitOnLoad:!0,nodes:d,autoState:!0,highlightPath:!0,height:280,variant:"outlined"})}const Ae=`import { ConnectionFlow } from "@cjlapao/ui-kit";
import { CI_FLOW } from "./sampleFlow";

/**
 * Hover or focus any node: everything that had to happen for it to be reached
 * stays lit, and the rest dims.
 */
export default function PathHighlight() {
  return (
    <ConnectionFlow
      fitOnLoad
      nodes={CI_FLOW}
      autoState
      highlightPath
      height={280}
      variant="outlined"
    />
  );
}
`,De=[{id:"a",title:"Fetch",tone:"emerald",progress:1,icon:"Download"},{id:"b",title:"Transform",tone:"blue",progress:.6,active:!0,icon:"Cog"},{id:"c",title:"Load",tone:"neutral",progress:0,icon:"Save"}];function _e(){return e.jsx("div",{className:"grid w-full gap-4",children:["bar","spinner"].map(n=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:['progressType="',n,'"']}),e.jsx(o,{fitOnLoad:!0,nodes:De,progressType:n,variant:"outlined",height:200})]},n))})}const Re=`import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const NODES: ConnectionFlowNode[] = [
  { id: "a", title: "Fetch", tone: "emerald", progress: 1, icon: "Download" },
  { id: "b", title: "Transform", tone: "blue", progress: 0.6, active: true, icon: "Cog" },
  { id: "c", title: "Load", tone: "neutral", progress: 0, icon: "Save" },
];

/** The bar and the spinner are alternatives — only one is ever shown. */
export default function ProgressExample() {
  return (
    <div className="grid w-full gap-4">
      {(["bar", "spinner"] as const).map((progressType) => (
        <div key={progressType} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            progressType=&quot;{progressType}&quot;
          </span>
          <ConnectionFlow
      fitOnLoad
            nodes={NODES}
            progressType={progressType}
            variant="outlined"
            height={200}
          />
        </div>
      ))}
    </div>
  );
}
`,ze=[{id:"a",title:"Lint",tone:"emerald"},{id:"b",title:"Integration tests",tone:"neutral"},{id:"c",title:"Publish",tone:"emerald"}];function He(){return e.jsx(o,{fitOnLoad:!0,nodes:ze,autoState:!0,variant:"outlined",height:200})}const We=`import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * A bypassed step is arched over rather than connected through. With
 * \`autoState\`, an untouched (neutral) step that something later passed is
 * detected as skipped without being flagged.
 */
const NODES: ConnectionFlowNode[] = [
  { id: "a", title: "Lint", tone: "emerald" },
  { id: "b", title: "Integration tests", tone: "neutral" },
  { id: "c", title: "Publish", tone: "emerald" },
];

export default function Skipped() {
  return <ConnectionFlow
      fitOnLoad nodes={NODES} autoState variant="outlined" height={200} />;
}
`,Ue=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ee,{name:"Connection Flow",description:"A pipeline graph: steps along a track, parallel lanes that fan out and back in, children hanging below their parent, and arcs over the steps that were skipped. Every edge comes from one port-and-route engine — a fan shares a single spine, and the edge style changes only how the corners are drawn. Zoom, pan, fit, and hover any node to light the path that reached it."}),e.jsx(me,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(a,{title:"Edge styles",description:"All three styles route the same way — out along each port's normal, then an axis-aligned turn, with a whole fan sharing one spine. They differ only at the corners: `straight` mitres them, `orthogonal` rounds them by a fixed radius, `curved` rounds them as far as the segments allow. Routing and corner treatment are separate concerns, so a bypass arcs over the skipped step in every style.",code:be,filename:"EdgeStyles.tsx",children:e.jsx(fe,{})}),e.jsx(a,{title:"Items",description:"A card's body can be a list of `items` — a fixed shape rather than free content, because the layout is pure and a card's height has to be arithmetic. Progress has two homes: a `bar` under the row's text, or a `spinner` in place of its glyph, given back at 100%. Past `maxVisibleItems` the rest fold behind “show more”; expanding re-measures the card and re-routes its edges. `maxHeight` caps a card instead and scrolls its body.",code:ve,filename:"Items.tsx",children:e.jsx(we,{})}),e.jsx(a,{title:"Status",description:"`status` says what happened to a step — succeeded, running, failed, pending, skipped — and the tone and the glyph follow from it. An explicit `tone` still wins, so a status is a default rather than a constraint; `running` implies `active` and `skipped` implies bypassing, so the semantics are stated once instead of three times.",code:ke,filename:"Status.tsx",children:e.jsx(Se,{})}),e.jsx(a,{title:"Variants",description:"`variant` is one decision, not two: the panel and the cards inside it take the same surface, painted from the same shade table `Panel` uses. A card sitting in a panel is part of that panel, not a second surface language layered on top of it. The card is drawn as an SVG path (a terminal is the card bulging), so the glass variants keep their translucent fill and light rim but cannot carry a backdrop blur.",code:je,filename:"Variants.tsx",children:e.jsx(Ne,{})}),e.jsx(a,{title:"Connectors",description:"Where an edge meets a node, the card bulges. The silhouette is one path — a rounded rectangle detouring around each of its ports — so the bulge carries the same fill as the rest of the card and no border crosses it; a solid dot at its centre is what the edge attaches to. `ringSize` sizes the bulge on the shared control scale; `fit` leaves the outline straight.",code:Te,filename:"Connectors.tsx",children:e.jsx(Fe,{})}),e.jsx(a,{title:"Structure",description:"`kind` borrows TreeView's connection types — step, parallel and child — so a flow can express shape as well as sequence.",code:Le,filename:"Structure.tsx",children:e.jsx(Ie,{})}),e.jsx(a,{title:"Path highlight",description:"Hover or focus a node and everything that had to happen for it to be reached stays lit; the rest dims.",code:Ae,filename:"PathHighlight.tsx",children:e.jsx(Pe,{})}),e.jsx(a,{title:"Progress",description:"A bar across the foot of each card, or a spinner at its end. They are alternatives — only one is ever shown.",code:Re,filename:"Progress.tsx",children:e.jsx(_e,{})}),e.jsx(a,{title:"Skipped steps",description:"A bypassed step is arched over rather than connected through. `autoState` infers it from tone.",code:We,filename:"Skipped.tsx",children:e.jsx(He,{})})]})]});export{Ue as ConnectionFlowPage,Ue as default};
