import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { A11ySection, A11yTopic, PropsTable } from "../../shared/A11ySections";
import { TraceGraphPlayground } from "./TraceGraphPlayground";
import SinglePath from "./examples/SinglePath";
import singlePathCode from "./examples/SinglePath.tsx?raw";
import AgentFlow from "./examples/AgentFlow";
import agentFlowCode from "./examples/AgentFlow.tsx?raw";

export default function TraceGraphPage() {
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="Trace Graph" description="A canvas-rendered history of points, forks and merges. WebGL2 animates activity and camera motion; Canvas 2D provides labels and a fallback renderer. Timeline and dependency layouts share selection, consumer details and live follow mode." />
    <TraceGraphPlayground />
    <ExampleCard title="One path, no branches" description="A simple sequence is a complete use case. Timeline order is based on time, order, or input order, with compact even spacing rather than proportional wall-clock gaps." code={singlePathCode} filename="SinglePath.tsx"><SinglePath /></ExampleCard>
    <ExampleCard title="Agent turns, tools and merges" description="Two concurrent agents branch from each turn, call tools and return to the same orchestrator. Both active frontiers are framed when following. Node selection drives an external panel and a consumer-provided popup." code={agentFlowCode} filename="AgentFlow.tsx"><AgentFlow /></ExampleCard>
    <A11ySection>
      <A11yTopic title="Keyboard and details"><p>The named graph is one focusable spatial application. Arrow keys browse points; Home and End jump to the first and last point; Enter or Space selects; Escape clears details. Plus and minus zoom. Search gives a bounded, keyboard-accessible list of matching points instead of thousands of hidden DOM controls. Detail popups use a named dialog with an explicit close button.</p></A11yTopic>
      <A11yTopic title="Follow mode and reduced motion"><p>Follow frames the active frontier and nearby connections. Drag, scroll, pinch, toolbar zoom/fit, or a manual focus command pauses following immediately. Resume following returns to current activity. Selecting a point alone does not pause it. Reduced motion removes pulses, moving particles and animated camera/layout transitions. Offscreen or hidden graphs suspend animation work.</p></A11yTopic>
      <A11yTopic title="Internationalization"><p>Toolbar and help copy use kit.traceGraph catalog keys in all built-in locales. labels and ariaLabel provide local overrides. Node labels and consumer detail content belong to the app. A selected point keeps its external selection when its popup anchor moves offscreen.</p></A11yTopic>
    </A11ySection>
    <PropsTable props={[
      { name: "nodes / edges", type: "readonly TraceGraphNode[] / TraceGraphEdge[]", description: "Stable ids and explicit source/target connections. Optional labels, time/order, lane, status, tone and metadata. Single chains, multiple roots, forks and merges are valid." },
      { name: "layout", type: '"timeline" | "dependency"', default: '"dependency"', description: "Timeline orders by time/order; dependency uses graph depth. Optional lane names group agents. Existing lanes are retained during append updates." },
      { name: "activeNodeIds / activeEdgeIds", type: "readonly string[]", description: "Explicit activity overrides status=running inference. Edges animate only when explicitly active or running; they are not inferred from source-node activity." },
      { name: "followMode / defaultFollowMode / onFollowModeChange", type: '"off" | "following" | "paused" / callback', default: '— / "off"', description: "Controlled or uncontrolled following. Manual camera changes pause follow; resume re-frames current active work. No active targets holds the current camera." },
      { name: "onNodeSelect / onEdgeSelect", type: "(node | null) => void / (edge | null) => void", description: "External selection/detail integration. selectedNodeId controls node selection; defaultSelectedNodeId seeds it." },
      { name: "renderNodeTooltip / renderNodePopover", type: "(node) => ReactNode", description: "Consumer markup for hover information and selected details. Graph geometry remains canvas-rendered; these overlays use DOM and follow projected point positions." },
      { name: "renderer / onRendererChange", type: '"auto" | "canvas" / callback', default: '"auto"', description: "WebGL2 with automatic Canvas fallback. Reports the active backend. WebGL context loss temporarily falls back; restoration recreates resources with current data." },
      { name: "glow", type: '"all" | "active" | "none" | boolean', default: '"all"', description: "Colored halos on all geometry, only active nodes/connections, or none. Explicit active ids override running status. Legacy true/false map to all/none. Supported in WebGL2 and Canvas." },
      { name: "junctionGlowIntensity", type: "number", default: "1", description: "Point halo strength, clamped to 0–3, including active junctions. Zero hides point halos without hiding dots or line glow. Halo radius shrinks as you zoom out and is capped at normal zoom. Activity pulses remain controlled separately by sparkleIntensity and pulseScale. Respects the glow mode." },
      { name: "sparkles", type: "boolean", default: "true", description: "Soft expanding circular pulses around active points and two traveling pulses on each active path. Requires glow and animation; disabled for reduced motion. Shared Canvas effects layer works with both renderers." },
      { name: "sparkleIntensity / sparkleSpeed / pulseScale", type: "number", default: "1 / 1 / 2.5", description: "Pulse strength (0–3), motion multiplier (0–4; zero freezes pulses), and radius relative to the dot (0–6; 2.5 means 250%). Pulses shrink when zooming out and stop growing above normal zoom. Legacy flareSize is converted to pulseScale by dividing by four." },
      { name: "animation / showLabels / showControls", type: "boolean", default: "true", description: "Animation respects reduced motion. Label visibility depends on zoom and collision avoidance; selected/focused labels take priority." },
      { name: "height / minZoom / maxZoom", type: "number", default: "480 / 0.001 / 8", description: "Viewport height in CSS pixels and zoom limits. A small minimum allows fitting thousands of ordered events. Pixel ratio is capped at two." },
      { name: "onDiagnostics", type: "(diagnostics) => void", description: "Reports duplicate ids, missing endpoints and cyclic/unresolved dependency ordering. Valid geometry still renders." },
      { name: "ref", type: "TraceGraphHandle", description: "fit, zoomTo, focusNodes, pauseFollowing, resumeFollowing, getViewport. Manual camera commands pause follow. Animate arguments default to true." },
      { name: "variant / tone / corner / padding / transparency", type: 'PanelProps; tone also accepts "none"', description: 'Regular Panel properties are forwarded, including backgroundColor, borderColor, body styles, header slots and loading options. tone="none" gives an untinted neutral surface while preserving graph colors. Combine with variant="simple" for white in light mode, neutral in dark mode, without borders or shadows. corner and padding use the shared Panel scales.' },
    ]} />
  </div>;
}
