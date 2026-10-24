import React from "react";
import { A11yCode, A11ySection, A11yTopic, C, KeyboardSupportTable, PropsTable } from "../../shared/A11ySections";

const modelCode = `import type { ConnectionFlowNode, ConnectionFlowConnection } from "@cjlapao/ui-kit";

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
];`;

const commitCode = `// Handler excerpt from an application using the EditMode.tsx state pattern.
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
}`;

export const ConnectionFlowEditGuide: React.FC = () => (
  <section id="connection-flow-edit-guide" className="flex flex-col gap-5">
    <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Building an editor</h2>
    <A11yTopic title="Start with controlled nodes and connections">
      <p>Keep <C>nodes</C> and <C>connections</C> in your application state. Supplying <C>connections</C>, even an empty array, makes it the complete list of links. Omitting it enables the automatic workflow connections used by the other examples. Row placement alone must not create links in an editor.</p>
      <p>Give every top-level editor node a unique <C>gridPosition</C> cell with integer <C>column</C> and <C>row</C> values. Negative indices allow adding above or to the left. Rows align across columns, and their spacing grows for card height, captions and connector clearance. A new card can sit beside Review while being connected only to a card in the row below.</p>
      <A11yCode code={modelCode} filename="EditorModel.ts" />
    </A11yTopic>
    <A11yTopic title="From a drag to a saved node">
      <ol className="list-decimal space-y-2 pl-5">
        <li>Set <C>editMode</C>. Hover the outer 10% of a card to reveal a ghost connector, then drag into empty space. The source side follows the direction of the drag; the ghost snaps to a free row and column.</li>
        <li>On release, <C>onNodeCreate(ghostId, placement)</C> requests creation. Store the ID and placement and open your own SidePanel, Modal or form. <C>placement</C> includes <C>sourceId</C>, <C>side</C> and, for a grid-based graph, <C>gridPosition</C>.</li>
        <li>Validate the form, then append a real node using the same ghost ID and requested cell. Append the intended source-to-new-node connection separately. The component replaces the ghost when it receives that real node.</li>
        <li>On Cancel, call <C>ref.current.dismissGhost(ghostId)</C> and close your form. A completed draft stays visible until it is resolved or dismissed; Escape cancels an active drag.</li>
        <li>Drop onto an existing card to request <C>onConnect</C> instead. Append the requested connection in your state; no node or ghost is created. Self-links, duplicate directed links and disabled targets are rejected.</li>
      </ol>
      <p>The live Edit mode example below includes the complete SidePanel and form. This save-handler excerpt shows where the application commits the new node and its link.</p>
      <A11yCode code={commitCode} filename="SaveDraft.tsx" />
    </A11yTopic>
    <A11yTopic title="Selecting, editing and removing a connection">
      <p>In edit mode, click an explicit connection or its caption to select it. Bind <C>selectedConnectionId</C> and <C>onConnectionSelect</C> for controlled selection; omit the ID prop to use internal selection. The callback receives the original connection, including your metadata, or <C>null</C> when a selection is cleared.</p>
      <p>Double-click a line or press Enter while it is focused to request <C>onConnectionEdit(connection)</C>. Your application opens its form, then replaces that connection in <C>connections</C> when saved. Delete or Backspace on a focused line requests <C>onConnectionRemove(connection)</C>; filter that ID out of your state to commit removal. These callbacks never modify the arrays automatically. Removing a link does not remove either endpoint node.</p>
      <p>Use <C>tone</C> for a connection color; it inherits the source node’s tone when omitted. <C>sourceTone</C> and <C>targetTone</C> override individual endpoints. <C>type</C> is a free-text category, <C>description</C> explains the link and <C>data</C> carries your condition or rule model. None of these metadata fields executes a rule. Compose any condition builder from your application schema and existing kit form controls. Set <C>editable=false</C> or <C>deletable=false</C> to suppress the corresponding interaction request.</p>
    </A11yTopic>
    <A11yTopic title="What the component supplies">
      <p>The component supplies card layout, free connector anchors, routing, crossing hops, captions, path highlighting, pan and zoom. In edit mode it also supplies side actions, drag previews, a dashed destination card, existing-card targeting, connection selection and creation/edit/removal requests. It does not mutate your node or connection arrays.</p>
    </A11yTopic>
    <A11yTopic title="What your application supplies">
      <p>You supply the editing toggle, SidePanel or Modal, fields, validation, save/cancel actions and persistence. Use <C>onNodeClick</C> to open an existing card’s editor. The demo’s title, subtitle, tone, height and connection selector are application UI; the component does not create that form for you. Committing deletion, permissions, undo/redo, server requests and domain rules also belong to your application. Use your chosen panel or dialog’s focus management when opening it and returning to the flow.</p>
      <p>Card content comes from <C>title</C>, <C>subtitle</C>, <C>description</C>, <C>icon</C>, <C>status</C>, <C>progress</C> and <C>items</C>. Item rows are content inside one card, not separate graph nodes. Put your domain record or identifier in <C>data</C>; the component returns it with click and hover callbacks.</p>
      <p>Use <C>renderNode(laidOutNode)</C> for a custom React body and declare an appropriate node <C>height</C>, since the routing engine does not measure arbitrary DOM content. It replaces the body; the component still draws the card surface and connections. Use buttons and inputs for actions, label them, and keep their events from activating the surrounding card when needed.</p>
    </A11yTopic>
  </section>
);

export const ConnectionFlowReference: React.FC = () => (
  <>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>Cards expose <C>role="button"</C>, take their accessible name from their rendered content, and show a focus ring. Disabled cards are excluded from the tab order. Focusing a card highlights its incoming path, as hovering does. In edit mode explicit connections are focusable buttons with endpoint names, label/type text, an optional accessible description and aria-pressed selection state. Edit side actions are named buttons describing the direction and source card; a polite live region announces draft creation, cancellation and connection requests.</p>
        <p>The visual routes do not provide a complete spoken graph description. Wrap the flow in a named section and supply a text description or connection list when relationships matter to the task. Custom card bodies and your configuration form need their own meaningful labels.</p>
        <A11yCode filename="LabelledFlow.tsx" code={`<section aria-labelledby="workflow-title" aria-describedby="workflow-summary">
  <h2 id="workflow-title">Release workflow</h2>
  <p id="workflow-summary">Start connects to Review and Build. Review has no outgoing link.</p>
  <ConnectionFlow nodes={nodes} connections={connections} />
</section>`} />
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <KeyboardSupportTable bindings={[
          { keys: ["Tab"], action: "Move through enabled cards, explicit connection targets in edit mode, edit side actions, item expansion buttons and visible zoom controls. Shift + Tab moves backward." },
          { keys: ["Enter"], action: "Activate a card, request a draft from a side action, or select and request editing of a focused connection. Native buttons also support Space." },
          { keys: ["Space"], action: "Activate a focused card or select a focused connection. Focused native buttons perform their own action." },
          { keys: ["Delete"], action: "Request removal of the focused connection in edit mode (Backspace also works), when onConnectionRemove is supplied and deletable is not false. Keys typed in your form do not remove links." },
          { keys: ["Escape"], action: "Clear selection on a focused connection, or cancel an active connector drag. Closing a configuration panel or dismissing an already-created draft is handled by your application." },
        ]} />
        <p>There is no arrow-key graph navigation or keyboard drag mode. Existing-card connections use pointer dragging; supply a keyboard-accessible alternative such as the demo’s “Add connection to” Select. The focusable Fit, Zoom in, Zoom out and Reset buttons are the keyboard alternative to canvas gestures.</p>
        <p>Drag the background to pan. Plain wheel scrolling stays with the page; Ctrl/⌘ + wheel or a trackpad pinch zooms when <C>interactive</C> is enabled. Set <C>animated=false</C> when your application’s motion preference requires still paths.</p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>Translate the header, node and item text, edge captions, custom bodies and application form yourself. <C>I18nProvider</C> resolves edit-mode side labels and live announcements through <C>kit.connectionFlowEdit</C>: <C>add</C>, <C>top</C>, <C>right</C>, <C>bottom</C>, <C>left</C>, <C>created</C>, <C>canceled</C> and <C>connected</C>. The add message accepts <C>{"{side}"}</C> and <C>{"{label}"}</C>. Connection target names use <C>kit.connectionFlowConnection.label</C> with <C>{"{source}"}</C> and <C>{"{target}"}</C>. Built-in catalogs cover English, French, Spanish, German and Portuguese; application catalogs can override these keys.</p>
        <p>Localization is currently partial: zoom control labels, loading text, item “Show more / Show less” labels and default empty-state copy are English literals. <C>emptyMessage</C> overrides the empty title, but not its subtitle. The zoom percentage uses a rounded number with a literal percent sign. RTL does not mirror graph coordinates or connector sides: <C>left</C> and <C>right</C> remain physical directions.</p>
        <A11yCode filename="LocalizedFlow.tsx" code={`<I18nProvider locale="fr" locales={{
  fr: { kit: { connectionFlowEdit: {
    created: "Brouillon ajouté. Configurez-le ou annulez-le.",
  } } },
}}>
  <ConnectionFlow nodes={translatedNodes} connections={translatedConnections}
    title="Flux de publication" emptyMessage="Aucune étape" editMode />
</I18nProvider>`} />
      </A11yTopic>
    </A11ySection>
    <PropsTable title="ConnectionFlow" props={[
      { name: "nodes", type: "ConnectionFlowNode[]", description: "Required graph data. Node IDs must be unique, including nested children and rows." },
      { name: "connections", type: "readonly ConnectionFlowConnection[]", description: "Complete explicit topology when supplied, including []. Omit to infer workflow links from node structure." },
      { name: "selectedConnectionId / onConnectionSelect", type: "string | null / (connection: ConnectionFlowConnection | null) => void", default: "internal selection", description: "Control edit-mode connection selection by ID, or omit the ID for internal state. Click a line/caption to select; Escape on it, card selection or a background click clears it." },
      { name: "onConnectionEdit / onConnectionRemove", type: "(connection: ConnectionFlowConnection) => void", description: "Edit requests on double-click/Enter and removal requests on Delete/Backspace while a connection is focused in edit mode. Your app supplies the form and updates connections; endpoint nodes remain unchanged." },
      { name: "editMode", type: "boolean", default: "false", description: "Enable side actions, ghost creation and dragging onto existing cards. Your application commits all data changes." },
      { name: "onNodeCreate", type: "(ghostId: string, placement: ConnectionFlowPlacement) => void", description: "Request a new node after an empty-space drop or keyboard side action. Placement contains sourceId, side and optional gridPosition." },
      { name: "onConnect", type: "(request: ConnectionFlowConnectRequest) => void", description: "Existing-card drop request: sourceId, targetId, sourceSide and targetSide. Append the desired connection yourself." },
      { name: "variant / tone / size / corner", type: "PlainSurfaceVariant / TrueColor / ControlSize / SurfaceCorner", default: '"outlined" / "neutral" / "md" / "rounded-md"', description: "Shared surface, accent, metrics and corner scales. The panel and cards follow the same surface variant; plain omits the panel." },
      { name: "edgeStyle / ringSize", type: "ConnectionFlowEdgeStyle / ConnectionFlowRingSize", default: '"orthogonal" / "md"', description: "Edge corner treatment: orthogonal, curved or straight. Ring size uses xs–xl or fit. Connections can override both." },
      { name: "maxVisibleItems / itemProgress", type: 'number / "bar" | "spinner"', default: '2 / "bar"', description: "Visible item rows before expansion and their progress display. Nodes and individual items can override the applicable defaults." },
      { name: "flowState / autoState", type: "ConnectionState / boolean", default: '"flowing" / false', description: "Fallback edge state: flowing, stopped or disabled. autoState derives activity and bypasses from node tone/status." },
      { name: "animated / dotSpeed / dotInterval", type: "boolean / number / number", default: "true / 120 / 700", description: "Animate paths; dot speed is pixels per second and interval is milliseconds between departures from one source." },
      { name: "progressType / progress", type: '"none" | "bar" | "spinner" / number', default: '"bar" / derived', description: "Header/node progress display and optional overall completion override from 0 to 1. Otherwise completion is derived from nodes." },
      { name: "highlightPath", type: "boolean", default: "true", description: "Highlight incoming paths on hover or focus and dim unrelated cards and links." },
      { name: "showControls / fitOnLoad / interactive", type: "boolean / boolean / boolean", default: "true / false / true", description: "Show in-canvas zoom controls, fit initially, and enable drag pan plus modified-wheel zoom. Controls and ref methods remain usable when interactive is false." },
      { name: "minZoom / maxZoom", type: "number / number", default: "0.25 / 2", description: "Zoom bounds as scale factors; 1 means 100%." },
      { name: "height", type: "number | string", default: "320", description: "Drawing viewport height in pixels or a CSS height value." },
      { name: "title / subtitle / eyebrow / icon", type: "ReactNode", description: "Header title, supporting line, uppercase eyebrow and icon content. A registry icon name is also accepted." },
      { name: "iconCorner", type: "SurfaceCorner", default: '"rounded-md"', description: "Header icon chip corner treatment." },
      { name: "tag / tagTone / tagVariant", type: "ReactNode / TrueColor / PillVariant", default: '— / tone / "soft"', description: "Header badge content, accent and pill surface." },
      { name: "showHeader", type: "boolean", default: "true", description: "Allow the header. It renders when there is header content or progressType is not none." },
      { name: "loading / loaderType", type: 'boolean / "skeleton" | "spinner" | "progress"', default: 'false / "skeleton"', description: "Replace graph content with the selected loading treatment." },
      { name: "emptyMessage / className", type: "string / string", default: '"Nothing to show" / —', description: "Override the empty-state title and append classes to the outer container." },
      { name: "onNodeClick / onNodeHover", type: "(node: ConnectionFlowNode) => void / (node: ConnectionFlowNode | null) => void", description: "Selection/activation and hover/focus notifications. Use onNodeClick to open your editor; hover reports null on exit." },
      { name: "onZoomChange", type: "(scale: number) => void", description: "Reports the current zoom scale when it changes." },
      { name: "renderNode", type: "(node: LaidOutNode) => ReactNode", description: "Replace the card body with React content. Read domain data from node.node.data and declare height for custom content." },
    ]} />
    <PropsTable title="ConnectionFlowNode" props={[
      { name: "id / gridPosition", type: "string / { column: number; row: number }", description: "Unique identity and optional logical cell. Supply a distinct integer cell for every top-level node to enable grid placement. Cell placement does not create a connection." },
      { name: "title / subtitle / description / icon", type: "string", description: "Default body text and registry icon name. Translate these in your application." },
      { name: "status / tone / active", type: "ConnectionFlowStatus / TrueColor / boolean", description: "Status supplies default tone/icon and implies running activity or skipping. Explicit tone and active values can override defaults." },
      { name: "progress / progressType", type: 'number / "none" | "bar" | "spinner"', description: "Node completion from 0 to 1 and a per-node display override." },
      { name: "items / itemProgress / maxItems", type: "ConnectionFlowNodeItem[] / ConnectionFlowItemProgress / number", description: "Measurable card-body rows and overrides for item progress display and visible-row cap." },
      { name: "kind / group", type: '"step" | "parallel" | "child" | "branch" / string', default: '"step" / —', description: "Automatic layout structure. Consecutive parallel nodes with the same group form a column." },
      { name: "children / childLayout / rows", type: 'ConnectionFlowNode[] / "fan" | "chain" / ConnectionFlowNode[][]', default: '— / "fan" / —', description: "Nested nodes: fan children below a parent or walk a chain grid row by row." },
      { name: "success / failure / connector", type: "ConnectionFlowBranch / ConnectionFlowBranch / ConnectionFlowConnectorConfig", description: "Inferred workflow outcomes and incoming edge settings. Explicit connections replace inferred outcome and structural links." },
      { name: "skipped / terminal", type: "boolean / boolean", description: "Skip with a bypass, or stop inferred onward links. These do not remove an explicit connection supplied by the application." },
      { name: "height / maxHeight / scrollable", type: "number / number / boolean", description: "Exact card height, measured-body cap and scrolling policy. A declared height takes precedence; otherwise content is measured and maxHeight caps it." },
      { name: "disabled / data", type: "boolean / unknown", description: "Exclude interaction, or attach a domain payload returned in node callbacks." },
    ]} />
    <PropsTable title="ConnectionFlowNodeItem" props={[
      { name: "id / title / subtitle / icon", type: "string", description: "Required id and title; optional supporting text and registry icon. An item is a row inside its node, not a graph endpoint." },
      { name: "status / tone", type: "ConnectionFlowStatus / TrueColor", description: "Status-derived appearance or an explicit tone override." },
      { name: "progress / progressType", type: 'number / "bar" | "spinner"', description: "Completion from 0 to 1 and item progress treatment. Falls back to the node, then the flow default." },
    ]} />
    <PropsTable title="ConnectionFlowConnection" props={[
      { name: "id / fromId / toId", type: "string", description: "Required stable edge ID and source/target node IDs. Missing endpoints, duplicate IDs, duplicate directed pairs and self-links are ignored." },
      { name: "fromSide / toSide", type: '"top" | "right" | "bottom" | "left"', default: "automatic", description: "Preferred source and target sides. The shared anchor allocator can use an adjacent side when a side is full." },
      { name: "tone", type: "TrueColor", default: "source node tone", description: "Color for the complete explicit connection and its terminals. Per-endpoint sourceTone/targetTone overrides take precedence. Does not recolor either node." },
      { name: "type / description / data", type: "string / string / unknown", description: "Application-owned category, accessible supporting text and arbitrary condition/rule payload. Returned unchanged in selection/edit/removal callbacks; never interpreted as execution rules." },
      { name: "editable / deletable", type: "boolean / boolean", default: "true / true", description: "Allow edit/removal requests from connection interactions. A locked connection remains selectable. Your application still owns persistence and permission enforcement." },
      { name: "label", type: "string", description: "Caption along the route. Wraps with padding and reserves space in routing and fit bounds." },
      { name: "state / animated / animateCompleted", type: "ConnectionState / boolean / boolean", description: "Override edge state/animation; animateCompleted permits travelling dots on stopped edges." },
      { name: "edgeStyle / ringSize", type: "ConnectionFlowEdgeStyle / ConnectionFlowRingSize", default: "flow defaults", description: "Per-edge corner treatment and connector-ring size." },
      { name: "sourceTone / targetTone", type: "TrueColor", default: "tone or source node tone", description: "Override the source and target colors individually along this connection." },
    ]} />
    <PropsTable title="ConnectionFlowHandle (ref)" props={[
      { name: "dismissGhost(ghostId)", type: "(string) => void", description: "Remove an unresolved draft, for example when your configuration form is canceled. Does not delete real nodes." },
      { name: "zoomIn() / zoomOut()", type: "() => void", description: "Increase or decrease the current scale within the zoom bounds." },
      { name: "fit()", type: "() => void", description: "Fit the drawing, including pending ghosts and caption bounds, to the viewport." },
      { name: "setZoom(scale)", type: "(number) => void", description: "Set a bounded zoom scale; pass 1 for 100%." },
    ]} />
  </>
);
