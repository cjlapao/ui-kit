import{j as e,r as s,n as pe,el as c,i as R,e1 as he,I as H,cc as Y,d1 as me,em as ge,k as fe,d4 as be}from"./index-B9JeX19j.js";import{P as we}from"./PageHeader-D-LFwZLT.js";import{E as p}from"./ExampleCard-BwESxlwz.js";import{a as v,C as n,b as A,A as xe,K as ve,P as F}from"./A11ySections-C9rTCDac.js";import{P as ye,S as l,a as Ce,T as b}from"./PlaygroundPanel-CZvYEX_V.js";import{C as Se}from"./ControlAccordion-rp4gabXb.js";import{d as je,a0 as Q,aW as ke,p as Ne,aX as Ie,aY as Fe,aZ as Te,a_ as Ee,a$ as Oe,b0 as Pe,b1 as De}from"./options-Blq0niUd.js";const Re=`import type { ConnectionFlowNode, ConnectionFlowConnection } from "@cjlapao/ui-kit";

const nodes: ConnectionFlowNode[] = [
  { id: "start", title: "Start", gridPosition: { column: 0, row: 0 } },
  { id: "review", title: "Review", gridPosition: { column: 1, row: 0 } },
  {
    id: "build", title: "Build", gridPosition: { column: 0, row: 1 },
    items: [{ id: "compile", title: "Compile", status: "running" }],
    data: { taskId: "task-42" },
  },
];
const connections: ConnectionFlowConnection[] = [
  { id: "start-review", fromId: "start", toId: "review" },
  { id: "start-build", fromId: "start", toId: "build",
    fromSide: "bottom", toSide: "top" },
];`,Ae=`// Handler excerpt from an application using the EditMode.tsx state pattern.
// Call this after your panel validates the new node's fields.
function createNode(properties: Pick<ConnectionFlowNode, "title" | "subtitle" | "tone" | "height">) {
  if (!editor?.placement) return;
  const { id, placement } = editor;
  const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

  setNodes(current => [...current, {
    id, ...properties, gridPosition: placement.gridPosition,
  }]);
  setConnections(current => [...current, {
    id: \`link-\${id}\`, fromId: placement.sourceId, toId: id,
    fromSide: placement.side, toSide: opposite[placement.side],
  }]);
  setEditor(null); // The real node with this ID replaces its ghost.
}

function cancelCreation() {
  if (editor?.placement) flow.current?.dismissGhost(editor.id);
  setEditor(null);
}`,Le=()=>e.jsxs("section",{id:"connection-flow-edit-guide",className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Building an editor"}),e.jsxs(v,{title:"Start with controlled nodes and connections",children:[e.jsxs("p",{children:["Keep ",e.jsx(n,{children:"nodes"})," and ",e.jsx(n,{children:"connections"})," in your application state. Supplying ",e.jsx(n,{children:"connections"}),", even an empty array, makes it the complete list of links. Omitting it enables the automatic workflow connections used by the other examples. Row placement alone must not create links in an editor."]}),e.jsxs("p",{children:["Give every top-level editor node a unique ",e.jsx(n,{children:"gridPosition"})," cell with integer ",e.jsx(n,{children:"column"})," and ",e.jsx(n,{children:"row"})," values. Negative indices allow adding above or to the left. Rows align across columns, and their spacing grows for card height, captions and connector clearance. A new card can sit beside Review while being connected only to a card in the row below."]}),e.jsx(A,{code:Re,filename:"EditorModel.ts"})]}),e.jsxs(v,{title:"From a drag to a saved node",children:[e.jsxs("ol",{className:"list-decimal space-y-2 pl-5",children:[e.jsxs("li",{children:["Set ",e.jsx(n,{children:"editMode"}),". Hover the outer 10% of a card to reveal a ghost connector, then drag into empty space. The source side follows the direction of the drag; the ghost snaps to a free row and column."]}),e.jsxs("li",{children:["On release, ",e.jsx(n,{children:"onNodeCreate(ghostId, placement)"})," requests creation. Store the ID and placement and open your own SidePanel, Modal or form. ",e.jsx(n,{children:"placement"})," includes ",e.jsx(n,{children:"sourceId"}),", ",e.jsx(n,{children:"side"})," and, for a grid-based graph, ",e.jsx(n,{children:"gridPosition"}),"."]}),e.jsx("li",{children:"Validate the form, then append a real node using the same ghost ID and requested cell. Append the intended source-to-new-node connection separately. The component replaces the ghost when it receives that real node."}),e.jsxs("li",{children:["On Cancel, call ",e.jsx(n,{children:"ref.current.dismissGhost(ghostId)"})," and close your form. A completed draft stays visible until it is resolved or dismissed; Escape cancels an active drag."]}),e.jsxs("li",{children:["Drop onto an existing card to request ",e.jsx(n,{children:"onConnect"})," instead. Append the requested connection in your state; no node or ghost is created. Self-links, duplicate directed links and disabled targets are rejected."]})]}),e.jsx("p",{children:"The live Edit mode example below includes the complete SidePanel and form. This save-handler excerpt shows where the application commits the new node and its link."}),e.jsx(A,{code:Ae,filename:"SaveDraft.tsx"})]}),e.jsx(v,{title:"What the component supplies",children:e.jsx("p",{children:"The component supplies card layout, free connector anchors, routing, crossing hops, captions, path highlighting, pan and zoom. In edit mode it also supplies side actions, drag previews, a dashed destination card, existing-card targeting and creation/connection callbacks. It does not mutate your node or connection arrays."})}),e.jsxs(v,{title:"What your application supplies",children:[e.jsxs("p",{children:["You supply the editing toggle, SidePanel or Modal, fields, validation, save/cancel actions and persistence. Use ",e.jsx(n,{children:"onNodeClick"})," to open an existing card’s editor. The demo’s title, subtitle, tone, height and connection selector are application UI; the component does not create that form for you. Deletion, permissions, undo/redo, server requests and domain rules also belong to your application. Use your chosen panel or dialog’s focus management when opening it and returning to the flow."]}),e.jsxs("p",{children:["Card content comes from ",e.jsx(n,{children:"title"}),", ",e.jsx(n,{children:"subtitle"}),", ",e.jsx(n,{children:"description"}),", ",e.jsx(n,{children:"icon"}),", ",e.jsx(n,{children:"status"}),", ",e.jsx(n,{children:"progress"})," and ",e.jsx(n,{children:"items"}),". Item rows are content inside one card, not separate graph nodes. Put your domain record or identifier in ",e.jsx(n,{children:"data"}),"; the component returns it with click and hover callbacks."]}),e.jsxs("p",{children:["Use ",e.jsx(n,{children:"renderNode(laidOutNode)"})," for a custom React body and declare an appropriate node ",e.jsx(n,{children:"height"}),", since the routing engine does not measure arbitrary DOM content. It replaces the body; the component still draws the card surface and connections. Use buttons and inputs for actions, label them, and keep their events from activating the surrounding card when needed."]})]})]}),ze=()=>e.jsxs(e.Fragment,{children:[e.jsxs(xe,{children:[e.jsxs(v,{title:"Screen reader",children:[e.jsxs("p",{children:["Cards expose ",e.jsx(n,{children:'role="button"'}),", take their accessible name from their rendered content, and show a focus ring. Disabled cards are excluded from the tab order. Focusing a card highlights its incoming path, as hovering does. Edit side actions are named buttons describing the direction and source card; a polite live region announces draft creation, cancellation and connection requests."]}),e.jsx("p",{children:"The visual routes do not provide a complete spoken graph description. Wrap the flow in a named section and supply a text description or connection list when relationships matter to the task. Custom card bodies and your configuration form need their own meaningful labels."}),e.jsx(A,{filename:"LabelledFlow.tsx",code:`<section aria-labelledby="workflow-title" aria-describedby="workflow-summary">
  <h2 id="workflow-title">Release workflow</h2>
  <p id="workflow-summary">Start connects to Review and Build. Review has no outgoing link.</p>
  <ConnectionFlow nodes={nodes} connections={connections} />
</section>`})]}),e.jsxs(v,{title:"Keyboard support",children:[e.jsx(ve,{bindings:[{keys:["Tab"],action:"Move through enabled cards, edit side actions, item expansion buttons and visible zoom controls. Shift + Tab moves backward."},{keys:["Enter"],action:"Activate a focused card through onNodeClick, or request a draft from a focused edit side action. Native buttons also support Space."},{keys:["Space"],action:"Activate a focused card. Focused native buttons perform their own action."},{keys:["Escape"],action:"Cancel an active connector drag. Closing a configuration panel or dismissing an already-created draft is handled by your application."}]}),e.jsx("p",{children:"There is no arrow-key graph navigation or keyboard drag mode. Existing-card connections use pointer dragging; supply a keyboard-accessible alternative such as the demo’s “Add connection to” Select. The focusable Fit, Zoom in, Zoom out and Reset buttons are the keyboard alternative to canvas gestures."}),e.jsxs("p",{children:["Drag the background to pan. Plain wheel scrolling stays with the page; Ctrl/⌘ + wheel or a trackpad pinch zooms when ",e.jsx(n,{children:"interactive"})," is enabled. Set ",e.jsx(n,{children:"animated=false"})," when your application’s motion preference requires still paths."]})]}),e.jsxs(v,{title:"Internationalization",children:[e.jsxs("p",{children:["Translate the header, node and item text, edge captions, custom bodies and application form yourself. ",e.jsx(n,{children:"I18nProvider"})," resolves edit-mode side labels and live announcements through ",e.jsx(n,{children:"kit.connectionFlowEdit"}),": ",e.jsx(n,{children:"add"}),", ",e.jsx(n,{children:"top"}),", ",e.jsx(n,{children:"right"}),", ",e.jsx(n,{children:"bottom"}),", ",e.jsx(n,{children:"left"}),", ",e.jsx(n,{children:"created"}),", ",e.jsx(n,{children:"canceled"})," and ",e.jsx(n,{children:"connected"}),". The add message accepts ",e.jsx(n,{children:"{side}"})," and ",e.jsx(n,{children:"{label}"}),". Built-in catalogs cover English, French, Spanish, German and Portuguese; application catalogs can override these keys."]}),e.jsxs("p",{children:["Localization is currently partial: zoom control labels, loading text, item “Show more / Show less” labels and default empty-state copy are English literals. ",e.jsx(n,{children:"emptyMessage"})," overrides the empty title, but not its subtitle. The zoom percentage uses a rounded number with a literal percent sign. RTL does not mirror graph coordinates or connector sides: ",e.jsx(n,{children:"left"})," and ",e.jsx(n,{children:"right"})," remain physical directions."]}),e.jsx(A,{filename:"LocalizedFlow.tsx",code:`<I18nProvider locale="fr" locales={{
  fr: { kit: { connectionFlowEdit: {
    created: "Brouillon ajouté. Configurez-le ou annulez-le.",
  } } },
}}>
  <ConnectionFlow nodes={translatedNodes} connections={translatedConnections}
    title="Flux de publication" emptyMessage="Aucune étape" editMode />
</I18nProvider>`})]})]}),e.jsx(F,{title:"ConnectionFlow",props:[{name:"nodes",type:"ConnectionFlowNode[]",description:"Required graph data. Node IDs must be unique, including nested children and rows."},{name:"connections",type:"readonly ConnectionFlowConnection[]",description:"Complete explicit topology when supplied, including []. Omit to infer workflow links from node structure."},{name:"editMode",type:"boolean",default:"false",description:"Enable side actions, ghost creation and dragging onto existing cards. Your application commits all data changes."},{name:"onNodeCreate",type:"(ghostId: string, placement: ConnectionFlowPlacement) => void",description:"Request a new node after an empty-space drop or keyboard side action. Placement contains sourceId, side and optional gridPosition."},{name:"onConnect",type:"(request: ConnectionFlowConnectRequest) => void",description:"Existing-card drop request: sourceId, targetId, sourceSide and targetSide. Append the desired connection yourself."},{name:"variant / tone / size / corner",type:"PlainSurfaceVariant / TrueColor / ControlSize / SurfaceCorner",default:'"outlined" / "neutral" / "md" / "rounded-md"',description:"Shared surface, accent, metrics and corner scales. The panel and cards follow the same surface variant; plain omits the panel."},{name:"edgeStyle / ringSize",type:"ConnectionFlowEdgeStyle / ConnectionFlowRingSize",default:'"orthogonal" / "md"',description:"Edge corner treatment: orthogonal, curved or straight. Ring size uses xs–xl or fit. Connections can override both."},{name:"maxVisibleItems / itemProgress",type:'number / "bar" | "spinner"',default:'2 / "bar"',description:"Visible item rows before expansion and their progress display. Nodes and individual items can override the applicable defaults."},{name:"flowState / autoState",type:"ConnectionState / boolean",default:'"flowing" / false',description:"Fallback edge state: flowing, stopped or disabled. autoState derives activity and bypasses from node tone/status."},{name:"animated / dotSpeed / dotInterval",type:"boolean / number / number",default:"true / 120 / 700",description:"Animate paths; dot speed is pixels per second and interval is milliseconds between departures from one source."},{name:"progressType / progress",type:'"none" | "bar" | "spinner" / number',default:'"bar" / derived',description:"Header/node progress display and optional overall completion override from 0 to 1. Otherwise completion is derived from nodes."},{name:"highlightPath",type:"boolean",default:"true",description:"Highlight incoming paths on hover or focus and dim unrelated cards and links."},{name:"showControls / fitOnLoad / interactive",type:"boolean / boolean / boolean",default:"true / false / true",description:"Show in-canvas zoom controls, fit initially, and enable drag pan plus modified-wheel zoom. Controls and ref methods remain usable when interactive is false."},{name:"minZoom / maxZoom",type:"number / number",default:"0.25 / 2",description:"Zoom bounds as scale factors; 1 means 100%."},{name:"height",type:"number | string",default:"320",description:"Drawing viewport height in pixels or a CSS height value."},{name:"title / subtitle / eyebrow / icon",type:"ReactNode",description:"Header title, supporting line, uppercase eyebrow and icon content. A registry icon name is also accepted."},{name:"iconCorner",type:"SurfaceCorner",default:'"rounded-md"',description:"Header icon chip corner treatment."},{name:"tag / tagTone / tagVariant",type:"ReactNode / TrueColor / PillVariant",default:'— / tone / "soft"',description:"Header badge content, accent and pill surface."},{name:"showHeader",type:"boolean",default:"true",description:"Allow the header. It renders when there is header content or progressType is not none."},{name:"loading / loaderType",type:'boolean / "skeleton" | "spinner" | "progress"',default:'false / "skeleton"',description:"Replace graph content with the selected loading treatment."},{name:"emptyMessage / className",type:"string / string",default:'"Nothing to show" / —',description:"Override the empty-state title and append classes to the outer container."},{name:"onNodeClick / onNodeHover",type:"(node: ConnectionFlowNode) => void / (node: ConnectionFlowNode | null) => void",description:"Selection/activation and hover/focus notifications. Use onNodeClick to open your editor; hover reports null on exit."},{name:"onZoomChange",type:"(scale: number) => void",description:"Reports the current zoom scale when it changes."},{name:"renderNode",type:"(node: LaidOutNode) => ReactNode",description:"Replace the card body with React content. Read domain data from node.node.data and declare height for custom content."}]}),e.jsx(F,{title:"ConnectionFlowNode",props:[{name:"id / gridPosition",type:"string / { column: number; row: number }",description:"Unique identity and optional logical cell. Supply a distinct integer cell for every top-level node to enable grid placement. Cell placement does not create a connection."},{name:"title / subtitle / description / icon",type:"string",description:"Default body text and registry icon name. Translate these in your application."},{name:"status / tone / active",type:"ConnectionFlowStatus / TrueColor / boolean",description:"Status supplies default tone/icon and implies running activity or skipping. Explicit tone and active values can override defaults."},{name:"progress / progressType",type:'number / "none" | "bar" | "spinner"',description:"Node completion from 0 to 1 and a per-node display override."},{name:"items / itemProgress / maxItems",type:"ConnectionFlowNodeItem[] / ConnectionFlowItemProgress / number",description:"Measurable card-body rows and overrides for item progress display and visible-row cap."},{name:"kind / group",type:'"step" | "parallel" | "child" | "branch" / string',default:'"step" / —',description:"Automatic layout structure. Consecutive parallel nodes with the same group form a column."},{name:"children / childLayout / rows",type:'ConnectionFlowNode[] / "fan" | "chain" / ConnectionFlowNode[][]',default:'— / "fan" / —',description:"Nested nodes: fan children below a parent or walk a chain grid row by row."},{name:"success / failure / connector",type:"ConnectionFlowBranch / ConnectionFlowBranch / ConnectionFlowConnectorConfig",description:"Inferred workflow outcomes and incoming edge settings. Explicit connections replace inferred outcome and structural links."},{name:"skipped / terminal",type:"boolean / boolean",description:"Skip with a bypass, or stop inferred onward links. These do not remove an explicit connection supplied by the application."},{name:"height / maxHeight / scrollable",type:"number / number / boolean",description:"Exact card height, measured-body cap and scrolling policy. A declared height takes precedence; otherwise content is measured and maxHeight caps it."},{name:"disabled / data",type:"boolean / unknown",description:"Exclude interaction, or attach a domain payload returned in node callbacks."}]}),e.jsx(F,{title:"ConnectionFlowNodeItem",props:[{name:"id / title / subtitle / icon",type:"string",description:"Required id and title; optional supporting text and registry icon. An item is a row inside its node, not a graph endpoint."},{name:"status / tone",type:"ConnectionFlowStatus / TrueColor",description:"Status-derived appearance or an explicit tone override."},{name:"progress / progressType",type:'number / "bar" | "spinner"',description:"Completion from 0 to 1 and item progress treatment. Falls back to the node, then the flow default."}]}),e.jsx(F,{title:"ConnectionFlowConnection",props:[{name:"id / fromId / toId",type:"string",description:"Required stable edge ID and source/target node IDs. Missing endpoints, duplicate IDs, duplicate directed pairs and self-links are ignored."},{name:"fromSide / toSide",type:'"top" | "right" | "bottom" | "left"',default:"automatic",description:"Preferred source and target sides. The shared anchor allocator can use an adjacent side when a side is full."},{name:"label",type:"string",description:"Caption along the route. Wraps with padding and reserves space in routing and fit bounds."},{name:"state / animated / animateCompleted",type:"ConnectionState / boolean / boolean",description:"Override edge state/animation; animateCompleted permits travelling dots on stopped edges."},{name:"edgeStyle / ringSize",type:"ConnectionFlowEdgeStyle / ConnectionFlowRingSize",default:"flow defaults",description:"Per-edge corner treatment and connector-ring size."},{name:"sourceTone / targetTone",type:"TrueColor",default:"endpoint tones",description:"Override the source and target colors along this connection."}]}),e.jsx(F,{title:"ConnectionFlowHandle (ref)",props:[{name:"dismissGhost(ghostId)",type:"(string) => void",description:"Remove an unresolved draft, for example when your configuration form is canceled. Does not delete real nodes."},{name:"zoomIn() / zoomOut()",type:"() => void",description:"Increase or decrease the current scale within the zoom bounds."},{name:"fit()",type:"() => void",description:"Fit the drawing, including pending ghosts and caption bounds, to the viewport."},{name:"setZoom(scale)",type:"(number) => void",description:"Set a bounded zoom scale; pass 1 for 100%."}]})]}),L=[{id:"release",title:"Release Canary version",subtitle:"10s",icon:"Rocket",status:"succeeded",progress:1},{id:"matrix-mac",group:"build",title:"Matrix: Release Go Binary (macOS)",subtitle:"2 jobs completed",icon:"Apple",status:"succeeded",kind:"parallel",items:[{id:"mac-arm",title:"darwin/arm64",subtitle:"1m 20s",status:"succeeded"},{id:"mac-x64",title:"darwin/amd64",subtitle:"1m 44s",status:"succeeded"},{id:"mac-uni",title:"darwin/universal",subtitle:"58s",status:"succeeded"},{id:"mac-sign",title:"codesign",subtitle:"12s",status:"succeeded"},{id:"mac-notary",title:"notarize",subtitle:"queued",status:"pending"}]},{id:"matrix-win",group:"build",title:"Matrix: Release Go Binary (Windows)",subtitle:"6 jobs completed",icon:"Windows",status:"succeeded",kind:"parallel",itemProgress:"spinner",items:[{id:"win-x64",title:"windows/amd64",subtitle:"signing",progress:.62,status:"running"},{id:"win-arm",title:"windows/arm64",subtitle:"3m 02s",progress:1,status:"succeeded"}]},{id:"docker",group:"build",title:"Build Docker Images",subtitle:"13m 13s",icon:"Docker",status:"running",kind:"parallel",items:[{id:"dk-amd",title:"linux/amd64",subtitle:"pushing",progress:.8},{id:"dk-arm",title:"linux/arm64",subtitle:"pushing",progress:.35}]},{id:"staging",group:"publish",title:"Deploy to Staging",subtitle:"eu-west-1 · 4s",icon:"Host",status:"running",kind:"parallel",progress:.55,connector:{label:"on: main"}},{id:"announce",group:"publish",title:"Announce on Discord",icon:"Notification",status:"succeeded",kind:"parallel",maxHeight:120,items:[{id:"an-1",title:"#releases",subtitle:"posted",status:"succeeded"},{id:"an-2",title:"#engineering",subtitle:"posted",status:"succeeded"},{id:"an-3",title:"#support",subtitle:"posted",status:"succeeded"},{id:"an-4",title:"#changelog",subtitle:"posted",status:"succeeded"}],maxItems:0},{id:"scan",title:"Security Scan",subtitle:"govulncheck",icon:"Key",status:"skipped"},{id:"cleanup",title:"Remove old canary release",subtitle:"waiting",icon:"Trash",status:"pending",connector:{state:"disabled"}}],$e=(a,r)=>[[{id:"dk-pull",title:"Pull base image",icon:"Download",status:"succeeded"}],[{id:"dk-compile",title:"Compile",icon:"Edit",status:"succeeded"},{id:"dk-vendor",title:"Vendor deps",icon:"Clone",status:"succeeded"}],[{id:"dk-test",title:"Smoke test image",icon:"Bug",status:a?"failed":"running",failure:{to:"dk-compile",label:"rebuild",...r?{tone:r}:{}}}],[{id:"dk-amd",title:"linux/amd64",subtitle:"pushing",progress:.8,icon:"Container"},{id:"dk-arm",title:"linux/arm64",subtitle:"pushing",progress:.35,icon:"Container"}]],_e=()=>{const[a,r]=s.useState("md"),[y,z]=s.useState("neutral"),[C,T]=s.useState(pe),[k,S]=s.useState("outlined"),[i,m]=s.useState("orthogonal"),[w,E]=s.useState("md"),[N,t]=s.useState("flowing"),[u,I]=s.useState("bar"),[j,x]=s.useState("bar"),[d,O]=s.useState(2),[h,g]=s.useState("skeleton"),[$,_]=s.useState(!1),[f,J]=s.useState(!0),[M,ee]=s.useState(120),[W,te]=s.useState(700),[B,ne]=s.useState("fan"),[P,ie]=s.useState(!0),[D,oe]=s.useState("default"),[q,se]=s.useState(!0),[V,ae]=s.useState(!0),[G,re]=s.useState(!0),[U,le]=s.useState(!0),[Z,de]=s.useState(!0),[K,ce]=s.useState(null),ue=s.useMemo(()=>B==="chain"?L.map(o=>o.id==="docker"?{id:"docker",title:"Build Docker Images",subtitle:"13m 13s",icon:"Docker",status:P?"failed":"running",childLayout:"chain",rows:$e(P,D==="default"?void 0:D)}:o):L,[B,P,D]);return e.jsx(ye,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Se,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Size",options:je,value:a,onChange:o=>r(o)}),e.jsx(l,{label:"Tone",options:Q,value:y,onChange:o=>z(o)}),e.jsx(l,{label:"Variant",options:ke,value:k,onChange:o=>S(o)}),e.jsx(l,{label:"Corner",options:Ne,value:C,onChange:o=>T(o)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Loader",options:Ie,value:h,onChange:o=>g(o)}),e.jsx(l,{label:"Flow state",options:Fe,value:N,onChange:o=>t(o)}),e.jsx(Ce,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(b,{label:"Loading",checked:$,onChange:_}),e.jsx(b,{label:"Header",checked:f,onChange:J}),e.jsx(b,{label:"Auto state",checked:q,onChange:se}),e.jsx(b,{label:"Animated",checked:V,onChange:ae}),e.jsx(b,{label:"Highlight path",checked:G,onChange:re}),e.jsx(b,{label:"Zoom controls",checked:U,onChange:le}),e.jsx(b,{label:"Zoom / pan",checked:Z,onChange:de})]})})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Edge style",options:Te,value:i,onChange:o=>m(o)}),e.jsx(l,{label:"Ring size",options:Ee,value:w,onChange:o=>E(o)}),e.jsx(l,{label:"Progress",options:Oe,value:u,onChange:o=>I(o)}),e.jsx(l,{label:"Item progress",options:Pe,value:j,onChange:o=>x(o)}),e.jsx(l,{label:"Rows before “show more”",options:De,value:String(d),onChange:o=>O(Number(o))})]})},{id:"branching",title:"Branching",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Child layout",options:[{label:"Fan (elbows)",value:"fan"},{label:"Chain (walked grid)",value:"chain"}],value:B,onChange:o=>ne(o)}),e.jsx(b,{label:"Sub-step failed",checked:P,onChange:ie}),e.jsx(l,{label:"Failure tone",options:[{label:"Default — rose",value:"default"},...Q],value:D,onChange:oe})]})},{id:"motion",title:"Motion",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Dot speed",options:[{label:"60 px/s",value:"60"},{label:"120 px/s",value:"120"},{label:"180 px/s",value:"180"},{label:"240 px/s",value:"240"},{label:"360 px/s",value:"360"},{label:"480 px/s",value:"480"}],value:String(M),onChange:o=>ee(Number(o))}),e.jsx(l,{label:"Dot interval",options:[{label:"250 ms",value:"250"},{label:"450 ms",value:"450"},{label:"700 ms",value:"700"},{label:"1200 ms",value:"1200"}],value:String(W),onChange:o=>te(Number(o))})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Every edge — track, fan, child and bypass alike — is routed by one port-and-shape engine, so ",e.jsx("strong",{children:"edge style"})," applies to all of them at once. Scroll to move through the flow, ",e.jsx("strong",{children:"Ctrl/⌘ -scroll"})," (or a pinch) to zoom, drag to pan, and hover a node to light the path that reached it."," ",e.jsx("strong",{children:"Variant"})," is one decision, not two: the cards take the surface of the panel they sit in rather than a scale of their own. Every dot moves at one"," ",e.jsx("strong",{children:"speed"}),", and each source releases one at a time — first target, second, third, then round again — so a fan reads as one source feeding its targets rather than as a swarm. The matrix cards are built from ",e.jsx("strong",{children:"items"}),": one runs past the cap so the rest fold behind “show more”, one shows a spinner in place of its glyph until it finishes, and “Announce on Discord” is capped with ",e.jsx("code",{children:"maxHeight"})," so its body scrolls. Switching"," ",e.jsx("strong",{children:"child layout"})," to chain re-casts the Docker build as a container walked rightward and downward — and while the smoke test is failed, its rose ",e.jsx("strong",{children:"failure"})," edge flows back into “Compile”, the loop that runs the grid down again, while the way forward sits dim."]})]}),preview:e.jsxs("div",{className:"w-full space-y-2",children:[e.jsx(c,{nodes:ue,variant:k,eyebrow:"release_canary.yml",title:"Release Canary version",subtitle:"on: workflow_dispatch",icon:"Rocket",tag:"LIVE",tagTone:"emerald",showHeader:f,loading:$,loaderType:h,size:a,tone:y,corner:C,edgeStyle:i,ringSize:w,flowState:N,progressType:u,itemProgress:j,dotSpeed:M,dotInterval:W,maxVisibleItems:d,autoState:q,animated:V,highlightPath:G,showControls:U,interactive:Z,height:520,onNodeClick:o=>ce(o.id)}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:K?`Selected: ${K}`:"Click a node to select it."})]})})},X=[{id:"start",gridPosition:{column:0,row:0},title:"Start",subtitle:"Drag near any border to add a step",tone:"blue",height:112},{id:"review",gridPosition:{column:1,row:0},title:"Review",subtitle:"Click the middle to edit this node",tone:"amber",height:112}],Be=["blue","emerald","amber","rose","violet","neutral"];function He(){const a=s.useRef(null),r=s.useId(),[y,z]=s.useState(!0),[C,T]=s.useState(X),[k,S]=s.useState([{id:"start-review",fromId:"start",toId:"review"}]),[i,m]=s.useState(null),w=()=>{i?.placement&&a.current?.dismissGhost(i.id),m(null)},E=!!i?.title.trim()&&Number.isFinite(i.height)&&i.height>=72&&i.height<=240,N=()=>{if(!i||!E)return;const{id:t,title:u,subtitle:I,tone:j,height:x,placement:d}=i,O={title:u.trim(),subtitle:I.trim(),tone:j,height:x};T(h=>{if(!d)return h.map(f=>f.id===t?{...f,...O}:f);const g=[...h];if(g.findIndex(f=>f.id===d.sourceId)<0)return h;const _={id:t,...O,gridPosition:d.gridPosition};return g.push(_),g}),!d&&i.connectTo&&S(h=>h.some(g=>g.fromId===t&&g.toId===i.connectTo)?h:[...h,{id:`${t}->${i.connectTo}`,fromId:t,toId:i.connectTo}]),d&&S(h=>[...h,{id:`link-${t}`,fromId:d.sourceId,toId:t,fromSide:d.side,toSide:{top:"bottom",bottom:"top",left:"right",right:"left"}[d.side]}]),m(null)};return e.jsxs("div",{className:"relative w-full min-w-0 space-y-3 overflow-hidden rounded-xl",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(R,{variant:"outline",color:"blue",size:"sm",onClick:()=>z(t=>!t),children:y?"Finish editing":"Edit flow"}),e.jsx(R,{variant:"ghost",size:"sm",onClick:()=>{w(),T(X),S([{id:"start-review",fromId:"start",toId:"review"}])},children:"Reset example"}),e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Drag from an edge into empty space to add a node, or onto another card to connect it. Click the middle to edit."})]}),e.jsx(c,{ref:a,nodes:C,connections:k,editMode:y,tone:"blue",height:460,title:"Build your flow",progressType:"none",onConnect:({sourceId:t,targetId:u,sourceSide:I,targetSide:j})=>S(x=>x.some(d=>d.fromId===t&&d.toId===u)?x:[...x,{id:`${t}->${u}`,fromId:t,toId:u,fromSide:I,toSide:j}]),onNodeClick:t=>{y&&m({id:t.id,title:typeof t.title=="string"?t.title:"",subtitle:typeof t.subtitle=="string"?t.subtitle:"",tone:t.tone??"blue",height:t.height??112})},onNodeCreate:(t,u)=>m({id:t,placement:u,title:"New step",subtitle:"",tone:"blue",height:112})}),e.jsx(he,{isOpen:!!i,onClose:w,title:i?.placement?"Create node":"Edit node",subtitle:i?.placement?`Connected ${i.placement.side} of ${C.find(t=>t.id===i.placement.sourceId)?.title??i.placement.sourceId}`:"Update this node’s appearance",width:340,overlay:!0,tone:"blue",variant:"floating",onKeyDown:t=>{t.key==="Escape"&&w()},footer:e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(R,{variant:"ghost",onClick:w,children:"Cancel"}),e.jsx(R,{color:"blue",disabled:!E,onClick:N,children:i?.placement?"Create node":"Save changes"})]}),children:i&&e.jsxs("form",{onSubmit:t=>{t.preventDefault(),N()},className:"space-y-4 p-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:`${r}-title`,className:"text-sm font-medium",children:"Title"}),e.jsx(H,{id:`${r}-title`,value:i.title,onChange:t=>m({...i,title:t.target.value})})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:`${r}-subtitle`,className:"text-sm font-medium",children:"Subtitle"}),e.jsx(H,{id:`${r}-subtitle`,value:i.subtitle,onChange:t=>m({...i,subtitle:t.target.value})})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:`${r}-tone`,className:"text-sm font-medium",children:"Tone"}),e.jsx(Y,{id:`${r}-tone`,value:i.tone,onChange:t=>m({...i,tone:t.target.value}),children:Be.map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:`${r}-height`,className:"text-sm font-medium",children:"Height (72–240px)"}),e.jsx(H,{id:`${r}-height`,type:"number",min:72,max:240,value:i.height,onChange:t=>m({...i,height:Number(t.target.value)})})]}),!i.placement&&e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:`${r}-connect`,className:"text-sm font-medium",children:"Add connection to"}),e.jsxs(Y,{id:`${r}-connect`,value:i.connectTo??"",onChange:t=>m({...i,connectTo:t.target.value}),children:[e.jsx("option",{value:"",children:"No additional connection"}),C.filter(t=>t.id!==i.id&&!k.some(u=>u.fromId===i.id&&u.toId===t.id)).map(t=>e.jsx("option",{value:t.id,children:t.title},t.id))]})]}),i.placement&&e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"The dashed node remains a draft until you create it. Cancel removes it."}),e.jsx("button",{type:"submit",className:"sr-only",tabIndex:-1,children:"Save node"})]})})]})}const Me=`import { useId, useRef, useState } from "react";
import { Button, ConnectionFlow, Input, Select, SidePanel } from "@cjlapao/ui-kit";
import type { ConnectionFlowConnection, ConnectionFlowHandle, ConnectionFlowNode, ConnectionFlowPlacement, TrueColor } from "@cjlapao/ui-kit";

const INITIAL_NODES: ConnectionFlowNode[] = [
  { id: "start", gridPosition: { column: 0, row: 0 }, title: "Start", subtitle: "Drag near any border to add a step", tone: "blue", height: 112 },
  { id: "review", gridPosition: { column: 1, row: 0 }, title: "Review", subtitle: "Click the middle to edit this node", tone: "amber", height: 112 },
];
const TONES: TrueColor[] = ["blue", "emerald", "amber", "rose", "violet", "neutral"];
type Editor = { id: string; placement?: ConnectionFlowPlacement; title: string; subtitle: string; tone: TrueColor; height: number; connectTo?: string };

export default function EditMode() {
  const flow = useRef<ConnectionFlowHandle>(null);
  const fieldId = useId();
  const [editing, setEditing] = useState(true);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState<ConnectionFlowConnection[]>([
    { id: "start-review", fromId: "start", toId: "review" },
  ]);
  const [editor, setEditor] = useState<Editor | null>(null);
  const close = () => {
    if (editor?.placement) flow.current?.dismissGhost(editor.id);
    setEditor(null);
  };
  const valid = !!editor?.title.trim() && Number.isFinite(editor.height) && editor.height >= 72 && editor.height <= 240;
  const save = () => {
    if (!editor || !valid) return;
    const { id, title, subtitle, tone, height, placement } = editor;
    const properties = { title: title.trim(), subtitle: subtitle.trim(), tone, height };
    setNodes(current => {
      if (!placement) return current.map(node => node.id === id ? { ...node, ...properties } : node);
      const next = [...current];
      const index = next.findIndex(node => node.id === placement.sourceId);
      if (index < 0) return current;
      const newNode: ConnectionFlowNode = { id, ...properties, gridPosition: placement.gridPosition };
      next.push(newNode);
      return next;
    });
    if (!placement && editor.connectTo) setConnections(current =>
      current.some(c => c.fromId === id && c.toId === editor.connectTo) ? current : [...current, {
        id: \`\${id}->\${editor.connectTo}\`, fromId: id, toId: editor.connectTo!,
      }]);
    if (placement) setConnections(current => [...current, {
      id: \`link-\${id}\`, fromId: placement.sourceId, toId: id,
      fromSide: placement.side,
      toSide: ({ top: "bottom", bottom: "top", left: "right", right: "left" } as const)[placement.side],
    }]);
    setEditor(null);
  };
  return <div className="relative w-full min-w-0 space-y-3 overflow-hidden rounded-xl">
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" color="blue" size="sm" onClick={() => setEditing(value => !value)}>
        {editing ? "Finish editing" : "Edit flow"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { close(); setNodes(INITIAL_NODES); setConnections([{ id: "start-review", fromId: "start", toId: "review" }]); }}>Reset example</Button>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Drag from an edge into empty space to add a node, or onto another card to connect it. Click the middle to edit.</p>
    </div>
    <ConnectionFlow ref={flow} nodes={nodes} connections={connections} editMode={editing} tone="blue" height={460}
      title="Build your flow" progressType="none"
      onConnect={({ sourceId, targetId, sourceSide, targetSide }) => setConnections(current =>
        current.some(c => c.fromId === sourceId && c.toId === targetId) ? current : [...current, {
          id: \`\${sourceId}->\${targetId}\`, fromId: sourceId, toId: targetId, fromSide: sourceSide, toSide: targetSide,
        }])}
      onNodeClick={node => {
        if (!editing) return;
        setEditor({ id: node.id, title: typeof node.title === "string" ? node.title : "", subtitle: typeof node.subtitle === "string" ? node.subtitle : "", tone: node.tone ?? "blue", height: node.height ?? 112 });
      }}
      onNodeCreate={(id, placement) => setEditor({ id, placement, title: "New step", subtitle: "", tone: "blue", height: 112 })} />
    <SidePanel isOpen={!!editor} onClose={close} title={editor?.placement ? "Create node" : "Edit node"}
      subtitle={editor?.placement ? \`Connected \${editor.placement.side} of \${nodes.find(node => node.id === editor.placement!.sourceId)?.title ?? editor.placement.sourceId}\` : "Update this node’s appearance"}
      width={340} overlay tone="blue" variant="floating"
      onKeyDown={event => { if (event.key === "Escape") close(); }}
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={close}>Cancel</Button><Button color="blue" disabled={!valid} onClick={save}>{editor?.placement ? "Create node" : "Save changes"}</Button></div>}>
      {editor && <form onSubmit={event => { event.preventDefault(); save(); }} className="space-y-4 p-4">
        <div className="space-y-1"><label htmlFor={\`\${fieldId}-title\`} className="text-sm font-medium">Title</label>
          <Input id={\`\${fieldId}-title\`} value={editor.title} onChange={event => setEditor({ ...editor, title: event.target.value })} /></div>
        <div className="space-y-1"><label htmlFor={\`\${fieldId}-subtitle\`} className="text-sm font-medium">Subtitle</label>
          <Input id={\`\${fieldId}-subtitle\`} value={editor.subtitle} onChange={event => setEditor({ ...editor, subtitle: event.target.value })} /></div>
        <div className="space-y-1"><label htmlFor={\`\${fieldId}-tone\`} className="text-sm font-medium">Tone</label>
          <Select id={\`\${fieldId}-tone\`} value={editor.tone} onChange={event => setEditor({ ...editor, tone: event.target.value as TrueColor })}>
            {TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
          </Select></div>
        <div className="space-y-1"><label htmlFor={\`\${fieldId}-height\`} className="text-sm font-medium">Height (72–240px)</label>
          <Input id={\`\${fieldId}-height\`} type="number" min={72} max={240} value={editor.height} onChange={event => setEditor({ ...editor, height: Number(event.target.value) })} /></div>
        {!editor.placement && <div className="space-y-1">
          <label htmlFor={\`\${fieldId}-connect\`} className="text-sm font-medium">Add connection to</label>
          <Select id={\`\${fieldId}-connect\`} value={editor.connectTo ?? ""}
            onChange={event => setEditor({ ...editor, connectTo: event.target.value })}>
            <option value="">No additional connection</option>
            {nodes.filter(node => node.id !== editor.id && !connections.some(c => c.fromId === editor.id && c.toId === node.id))
              .map(node => <option key={node.id} value={node.id}>{node.title}</option>)}
          </Select>
        </div>}
        {editor.placement && <p className="text-xs text-neutral-500 dark:text-neutral-400">The dashed node remains a draft until you create it. Cancel removes it.</p>}
        <button type="submit" className="sr-only" tabIndex={-1}>Save node</button>
      </form>}
    </SidePanel>
  </div>;
}
`;function We(){return e.jsx("div",{className:"grid w-full min-w-0 gap-4",children:me.map(a=>e.jsxs("div",{className:"flex min-w-0 flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),e.jsx(c,{fitOnLoad:!0,nodes:L,edgeStyle:a,variant:"outlined",autoState:!0,height:260})]},a))})}const qe=`import { CONNECTION_FLOW_EDGE_STYLES, ConnectionFlow } from "@cjlapao/ui-kit";
import { CI_FLOW } from "./sampleFlow";

/**
 * All three styles route the same way — out along each port's normal, then an
 * axis-aligned turn, with a separate corridor for each connection. They differ only at
 * the corners: \`straight\` mitres them, \`orthogonal\` rounds them by a fixed
 * radius, \`curved\` rounds them as far as the segments allow.
 */
export default function EdgeStyles() {
  return (
    <div className="grid w-full min-w-0 gap-4">
      {CONNECTION_FLOW_EDGE_STYLES.map((edgeStyle) => (
        <div key={edgeStyle} className="flex min-w-0 flex-col gap-1">
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
`,Ve=[{id:"build",title:"Matrix: Build",subtitle:"5 jobs",items:[{id:"a",title:"darwin/arm64",subtitle:"1m 20s",status:"succeeded"},{id:"b",title:"darwin/amd64",subtitle:"1m 44s",status:"succeeded"},{id:"c",title:"linux/amd64",subtitle:"58s",status:"succeeded"},{id:"d",title:"windows/amd64",subtitle:"queued",status:"pending"},{id:"e",title:"notarize",subtitle:"queued",status:"pending"}]},{id:"publish",title:"Publish",itemProgress:"spinner",items:[{id:"p1",title:"ghcr.io",subtitle:"pushing",progress:.6,status:"running"},{id:"p2",title:"docker.io",subtitle:"3m 02s",progress:1,status:"succeeded"}]},{id:"notify",title:"Notify",maxHeight:130,maxItems:0,items:[{id:"n1",title:"#releases",subtitle:"posted",status:"succeeded"},{id:"n2",title:"#engineering",subtitle:"posted",status:"succeeded"},{id:"n3",title:"#support",subtitle:"posted",status:"succeeded"},{id:"n4",title:"#changelog",subtitle:"posted",status:"succeeded"}]}];function Ge(){return e.jsx(c,{fitOnLoad:!0,nodes:Ve,height:300,progressType:"none"})}const Ue=`import { ConnectionFlow } from "@cjlapao/ui-kit";
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
`,Ze=[...ge.map((a,r)=>({id:a,title:a,status:a,skipped:!1,kind:r===0?void 0:"parallel",group:"statuses"})),{id:"override",title:"failed, but violet",status:"failed",tone:"violet",skipped:!1,kind:"parallel",group:"statuses"}];function Ke(){return e.jsx(c,{fitOnLoad:!0,nodes:Ze,size:"sm",progressType:"none",showControls:!1,height:280})}const Ye=`import { CONNECTION_FLOW_STATUSES, ConnectionFlow } from "@cjlapao/ui-kit";
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
`,Qe=[{id:"a",title:"Build",subtitle:"13m 13s",icon:"Docker",tone:"emerald"},{id:"b",title:"Deploy",subtitle:"eu-west-1",icon:"Host",tone:"blue"},{id:"c",title:"Announce",subtitle:"waiting",icon:"Notification"}];function Xe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:fe.map(a=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),e.jsx(c,{fitOnLoad:!0,nodes:Qe,variant:a,title:a,size:"sm",progressType:"none",showControls:!1,height:150})]},a))})}const Je=`import { SURFACE_VARIANTS, ConnectionFlow } from "@cjlapao/ui-kit";
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
`,et=[{id:"listen",title:"LISTENING",subtitle:"0.0.0.0:40900",icon:"Globe",tone:"sky",active:!0},{id:"target",title:"TARGET",subtitle:"6c6620…",icon:"Host"}];function tt(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:be.filter(a=>["fit","sm","xl"].includes(a)).map(a=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),e.jsx(c,{fitOnLoad:!0,nodes:et,ringSize:a,size:"sm",progressType:"none",showControls:!1,height:160})]},a))})}const nt=`import { CONNECTION_FLOW_RING_SIZES, ConnectionFlow } from "@cjlapao/ui-kit";
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
`,it=[{id:"root",title:"Plan",icon:"Blueprint",tone:"violet"},{id:"provision",title:"Provision",icon:"Cog",tone:"violet",children:[{id:"net",title:"Network",tone:"violet"},{id:"db",title:"Database",tone:"violet"}]},{id:"api",title:"API",kind:"parallel",tone:"sky"},{id:"worker",title:"Worker",kind:"parallel",tone:"sky"},{id:"web",title:"Web",kind:"parallel",tone:"sky"},{id:"smoke",title:"Smoke test",icon:"Bug",tone:"emerald"}];function ot(){return e.jsx(c,{fitOnLoad:!0,nodes:it,variant:"outlined",height:300,flowState:"stopped"})}const st=`import { ConnectionFlow } from "@cjlapao/ui-kit";
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
`;function at(){return e.jsx(c,{fitOnLoad:!0,nodes:L,autoState:!0,highlightPath:!0,height:280,variant:"outlined"})}const rt=`import { ConnectionFlow } from "@cjlapao/ui-kit";
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
`,lt=[{id:"a",title:"Fetch",tone:"emerald",progress:1,icon:"Download"},{id:"b",title:"Transform",tone:"blue",progress:.6,active:!0,icon:"Cog"},{id:"c",title:"Load",tone:"neutral",progress:0,icon:"Save"}];function dt(){return e.jsx("div",{className:"grid w-full gap-4",children:["bar","spinner"].map(a=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:['progressType="',a,'"']}),e.jsx(c,{fitOnLoad:!0,nodes:lt,progressType:a,variant:"outlined",height:200})]},a))})}const ct=`import { ConnectionFlow } from "@cjlapao/ui-kit";
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
`,ut=[{id:"a",title:"Lint",tone:"emerald"},{id:"b",title:"Integration tests",tone:"neutral"},{id:"c",title:"Publish",tone:"emerald"}];function pt(){return e.jsx(c,{fitOnLoad:!0,nodes:ut,autoState:!0,variant:"outlined",height:200})}const ht=`import { ConnectionFlow } from "@cjlapao/ui-kit";
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
`,mt=[{id:"clarify",title:"Clarify",height:104},{id:"answers",title:"Clarify answers",height:104,tone:"amber",connector:{label:"clarify · max 2 · then escalate"}},{id:"discovery",title:"Discovery",height:104,failure:{to:"clarify",label:"Review the answers and return to clarification before another attempt"}}];function gt(){return e.jsx(c,{nodes:mt,title:"Wrapped captions",variant:"outlined",tone:"blue",height:380,fitOnLoad:!0})}const ft=`import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const nodes: ConnectionFlowNode[] = [
  { id: "clarify", title: "Clarify", height: 104 },
  {
    id: "answers",
    title: "Clarify answers",
    height: 104,
    tone: "amber",
    connector: { label: "clarify · max 2 · then escalate" },
  },
  {
    id: "discovery",
    title: "Discovery",
    height: 104,
    failure: {
      to: "clarify",
      label:
        "Review the answers and return to clarification before another attempt",
    },
  },
];

export default function Captions() {
  return (
    <ConnectionFlow
      nodes={nodes}
      title="Wrapped captions"
      variant="outlined"
      tone="blue"
      height={380}
      fitOnLoad
    />
  );
}
`,bt=[{id:"implement",title:"Implement",subtitle:"Model step",items:[{id:"agent",title:"Agent",subtitle:"Developer"}]},{id:"offer-review",title:"Offer review",tone:"amber",items:[{id:"decision",title:"Decision",subtitle:"Review before pushing?"}]},{id:"review",title:"Inline review",items:[{id:"agent",title:"Agent",subtitle:"Code reviewer"}],failure:{to:"implement",label:"Implement · retry"}},{id:"offer-security",title:"Offer security",tone:"amber",items:[{id:"decision",title:"Decision",subtitle:"Scan sensitive changes?"}]},{id:"security",title:"Security",items:[{id:"agent",title:"Agent",subtitle:"Security engineer"}],failure:{to:"implement",label:"Implement · retry"}}];function wt(){return e.jsx(c,{nodes:bt,title:"Review and security retries",variant:"glass",tone:"blue",height:340})}const xt=`import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const nodes: ConnectionFlowNode[] = [
  {
    id: "implement",
    title: "Implement",
    subtitle: "Model step",
    items: [{ id: "agent", title: "Agent", subtitle: "Developer" }],
  },
  {
    id: "offer-review",
    title: "Offer review",
    tone: "amber",
    items: [
      { id: "decision", title: "Decision", subtitle: "Review before pushing?" },
    ],
  },
  {
    id: "review",
    title: "Inline review",
    items: [{ id: "agent", title: "Agent", subtitle: "Code reviewer" }],
    failure: { to: "implement", label: "Implement · retry" },
  },
  {
    id: "offer-security",
    title: "Offer security",
    tone: "amber",
    items: [
      {
        id: "decision",
        title: "Decision",
        subtitle: "Scan sensitive changes?",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [{ id: "agent", title: "Agent", subtitle: "Security engineer" }],
    failure: { to: "implement", label: "Implement · retry" },
  },
];

export default function RetryPaths() {
  return (
    <ConnectionFlow
      nodes={nodes}
      title="Review and security retries"
      variant="glass"
      tone="blue"
      height={340}
    />
  );
}
`,vt=[{id:"plan",title:"Plan",icon:"Edit",status:"succeeded"},{id:"plan-gate",title:"Plan gate",subtitle:"Approval gate",icon:"Verified",status:"succeeded",failure:{to:"plan",label:"max 2 · then escalate"}},{id:"build",title:"Build",subtitle:"Ladder · 7 steps",icon:"Docker",status:"running",childLayout:"chain",rows:[[{id:"create-pr",title:"Create PR",icon:"Pull",status:"succeeded"}],[{id:"create-code",title:"Create code",icon:"Edit",status:"succeeded"},{id:"unit-tests",title:"Unit tests",icon:"CheckCircle",status:"succeeded"}],[{id:"lint",title:"Lint",icon:"Clean",status:"succeeded"}],[{id:"secure-code",title:"Secure code",icon:"Key",status:"succeeded"},{id:"scan-deps",title:"Scan deps",icon:"Search",status:"succeeded"}],[{id:"review-code",title:"Review code",icon:"EyeOpen",status:"failed",failure:{to:"create-code",label:"max 2 · retry"}}],[{id:"merge-code",title:"Merge code",icon:"Push",status:"pending",success:{label:"ship"}}]]},{id:"qa",title:"QA",icon:"Bug",status:"failed",failure:{to:"plan",label:"max 2 · then escalate"}},{id:"deploy",title:"Deploy",icon:"Rocket",status:"pending"},{id:"done",title:"Done",icon:"Complete",status:"pending",terminal:!0}];function yt(){return e.jsx(c,{fitOnLoad:!0,nodes:vt,variant:"outlined",height:600})}const Ct=`import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * \`childLayout: "chain"\` turns a card's \`rows\` into a grid the flow walks
 * rightward and downward: it enters the first card from the parent's bottom,
 * links each row with the track's own connectors, and hands off onward from
 * the grid's last card — the parent itself is a pure container. Any card can
 * carry \`success\` and \`failure\`; both are always drawn, and which one is
 * alive follows the card's status.
 *
 * The reject paths are drawn by the path engine: every edge first tries the
 * plain route through the corridors the layout already leaves free, and only
 * the ones that would cut across a card get re-routed around them — \`review
 * code\` fails all the way back up the ladder without crossing a face, and
 * \`qa\`'s rejection leaves the grid and returns to \`plan\` over the cards,
 * never through them.
 */
const NODES: ConnectionFlowNode[] = [
  { id: "plan", title: "Plan", icon: "Edit", status: "succeeded" },
  {
    id: "plan-gate",
    title: "Plan gate",
    subtitle: "Approval gate",
    icon: "Verified",
    status: "succeeded",
    failure: { to: "plan", label: "max 2 · then escalate" },
  },
  {
    id: "build",
    title: "Build",
    subtitle: "Ladder · 7 steps",
    icon: "Docker",
    status: "running",
    childLayout: "chain",
    rows: [
      [{ id: "create-pr", title: "Create PR", icon: "Pull", status: "succeeded" }],
      [
        { id: "create-code", title: "Create code", icon: "Edit", status: "succeeded" },
        { id: "unit-tests", title: "Unit tests", icon: "CheckCircle", status: "succeeded" },
      ],
      [{ id: "lint", title: "Lint", icon: "Clean", status: "succeeded" }],
      [
        { id: "secure-code", title: "Secure code", icon: "Key", status: "succeeded" },
        { id: "scan-deps", title: "Scan deps", icon: "Search", status: "succeeded" },
      ],
      [
        {
          id: "review-code",
          title: "Review code",
          icon: "EyeOpen",
          status: "failed",
          failure: { to: "create-code", label: "max 2 · retry" },
        },
      ],
      [
        {
          id: "merge-code",
          title: "Merge code",
          icon: "Push",
          status: "pending",
          success: { label: "ship" },
        },
      ],
    ],
  },
  {
    id: "qa",
    title: "QA",
    icon: "Bug",
    status: "failed",
    failure: { to: "plan", label: "max 2 · then escalate" },
  },
  { id: "deploy", title: "Deploy", icon: "Rocket", status: "pending" },
  { id: "done", title: "Done", icon: "Complete", status: "pending", terminal: true },
];

export default function Pipeline() {
  return (
    <ConnectionFlow
      fitOnLoad
      nodes={NODES}
      variant="outlined"
      height={600}
    />
  );
}
`,Et=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(we,{name:"Connection Flow",description:"A pipeline graph: steps along a track, parallel lanes that fan out and back in, children hanging below their parent, and arcs over the steps that were skipped. Every edge comes from one port-and-route engine — each connection has its own anchors and corridor, and the edge style changes only how the corners are drawn. Drag to move through it (bars appear on hover); plain scrolling continues through the page, Ctrl/⌘-scroll or pinch to zoom, and hover any node to light the path that reached it."}),e.jsx(_e,{}),e.jsx(Le,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Edit mode",description:"Drag from a card’s edge into empty space to add a node, or onto another card to connect it. Click the middle to edit. This example supplies its own SidePanel, fields and save/cancel handlers; the component supplies the ghost previews and requests. See Building an editor above for the data model and creation lifecycle.",code:Me,filename:"EditMode.tsx",children:e.jsx(He,{})}),e.jsx(p,{title:"Wrapped captions",description:"Connector captions wrap inside their route with margins on both sides. Each card gap and row boundary grows independently when needed; shorter captions reserve less space than longer captions. Measured caption bounds reserve corridor space; other paths avoid the caption, and fit includes its full bounds. Solid surfaces use a neutral gray treatment for contrast.",code:ft,filename:"Captions.tsx",children:e.jsx(gt,{})}),e.jsx(p,{title:"Separate retry anchors",description:"Failure paths and normal handoffs use separate anchors. Full sides spill onto the nearest available adjacent side; independent return paths use separate lanes. Direct handoffs stay in the gap between their cards. Drag to pan; plain wheel scrolling stays with the page.",code:xt,filename:"RetryPaths.tsx",children:e.jsx(wt,{})}),e.jsx(p,{title:"Edge styles",description:"All three styles route the same way — out along each port's normal, then an axis-aligned turn, with separate anchors and corridors for each edge. They differ only at the corners: `straight` mitres them, `orthogonal` rounds them by a fixed radius, `curved` rounds them as far as the segments allow. Routing and corner treatment are separate concerns, so a bypass arcs over the skipped step in every style.",code:qe,filename:"EdgeStyles.tsx",children:e.jsx(We,{})}),e.jsx(p,{title:"Items",description:"A card's body can be a list of `items` — a fixed shape rather than free content, because the layout is pure and a card's height has to be arithmetic. Progress has two homes: a `bar` under the row's text, or a `spinner` in place of its glyph, given back at 100%. Past `maxVisibleItems` the rest fold behind “show more”; expanding re-measures the card and re-routes its edges. `maxHeight` caps a card instead and scrolls its body.",code:Ue,filename:"Items.tsx",children:e.jsx(Ge,{})}),e.jsx(p,{title:"Status",description:"`status` says what happened to a step — succeeded, running, failed, pending, skipped — and the tone and the glyph follow from it. An explicit `tone` still wins, so a status is a default rather than a constraint; `running` implies `active` and `skipped` implies bypassing, so the semantics are stated once instead of three times.",code:Ye,filename:"Status.tsx",children:e.jsx(Ke,{})}),e.jsx(p,{title:"Variants",description:"`variant` is one decision, not two: the panel and the cards inside it take the same surface, painted from the same shade table `Panel` uses. A card sitting in a panel is part of that panel, not a second surface language layered on top of it. The card is drawn as an SVG path (a terminal is the card bulging), so the glass variants keep their translucent fill and light rim but cannot carry a backdrop blur.",code:Je,filename:"Variants.tsx",children:e.jsx(Xe,{})}),e.jsx(p,{title:"Connectors",description:"Where an edge meets a node, the card bulges. The silhouette is one path — a rounded rectangle detouring around each of its ports — so the bulge carries the same fill as the rest of the card and no border crosses it; a solid dot at its centre is what the edge attaches to. `ringSize` sizes the bulge on the shared control scale; `fit` leaves the outline straight.",code:nt,filename:"Connectors.tsx",children:e.jsx(tt,{})}),e.jsx(p,{title:"Structure",description:"`kind` borrows TreeView's connection types — step, parallel and child — so a flow can express shape as well as sequence.",code:st,filename:"Structure.tsx",children:e.jsx(ot,{})}),e.jsx(p,{title:"Chains & branches",description:"`childLayout: chain` turns a card's `rows` into a grid the flow walks rightward and downward — in from the parent's bottom, along each row with the track's own connectors, and onward from the grid's last card, so the parent reads as one container of sub-steps. Cards keep the standard size; a longer row only means longer connectors. Any card can carry `success` and `failure`, each with its own tone (emerald/rose by default) and label; both edges are always drawn, and which one flows follows the card's status — a failed step lights its rose edge into the card it retries and dims the way forward, the closed loop that runs the chain down again. The long way round is the engine's job: an edge that would cross a card is re-routed around the cards, on lanes that clear every face — and where two edges must cross, the horizontal one hops over the other, dots mid-travel included.",code:Ct,filename:"Pipeline.tsx",children:e.jsx(yt,{})}),e.jsx(p,{title:"Path highlight",description:"Hover or focus a node and everything that had to happen for it to be reached stays lit; the rest dims.",code:rt,filename:"PathHighlight.tsx",children:e.jsx(at,{})}),e.jsx(p,{title:"Progress",description:"A bar across the foot of each card, or a spinner at its end. They are alternatives — only one is ever shown.",code:ct,filename:"Progress.tsx",children:e.jsx(dt,{})}),e.jsx(p,{title:"Skipped steps",description:"A bypassed step is arched over rather than connected through. `autoState` infers it from tone.",code:ht,filename:"Skipped.tsx",children:e.jsx(pt,{})})]}),e.jsx(ze,{})]});export{Et as ConnectionFlowPage,Et as default};
