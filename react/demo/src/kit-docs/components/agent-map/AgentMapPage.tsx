import { useState } from "react";
import { Link } from "react-router-dom";
import { AgentMap, AiRobot, Button, ColorSwatches, EmptyState, GridBackground, Input, Slider, type AgentMapLoaderType, type AgentMapProject, type AiRobotVariant, type GridBackgroundPattern, type PanelTone, type PanelVariant, type TrueColor } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { PropsTable } from "../../shared/A11ySections";
import { ChoiceControl, Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { gridBackgroundPatternOptions, surfaceVariantOptions } from "../../shared/options";
import { SurfaceToneControl } from "../../shared/SurfaceToneControl";

const projects: AgentMapProject[] = [
  { id: "atlas", name: "Atlas", agents: [{ id: "a1", name: "Builder", status: "working", activity: "Implementing checkout" }, { id: "a2", name: "Reviewer", status: "attention", activity: "Waiting for approval" }, { id: "a3", name: "Researcher", status: "working", activity: "Checking sources" }, { id: "a4", name: "Tester", status: "blocked", activity: "Blocked on failing CI" }, { id: "a5", name: "Planner", status: "working", activity: "Planning release" }, { id: "a6", name: "Analyst", status: "idle", activity: "Waiting for results" }, { id: "a7", name: "Writer", status: "completed", activity: "Documentation complete" }, { id: "a8", name: "Auditor", status: "working", activity: "Checking changes" }] },
  { id: "horizon", name: "Horizon", agents: [{ id: "h1", name: "Planner", status: "working", activity: "Planning migration" }, { id: "h2", name: "Builder", status: "working", activity: "Writing code" }, { id: "h3", name: "Tester", status: "idle", activity: "Waiting for build" }, ...Array.from({ length: 7 }, (_, i) => ({ id: `h${i + 4}`, name: `Agent ${i + 4}`, status: "working" as const, activity: "Working on migration" }))] },
  { id: "orbit", name: "Orbit", agents: [{ id: "o1", name: "Builder", status: "completed", activity: "Implementation complete" }, { id: "o2", name: "Reviewer", status: "completed", activity: "Review complete" }, { id: "o3", name: "Tester", status: "completed", activity: "Tests passed" }] },
  ...["Northstar", "Meridian", "Lumen", "Canvas", "Beacon"].map((name, i) => ({ id: `p${i}`, name, agents: Array.from({ length: [14, 18, 26, 4, 4][i] }, (_, j) => ({ id: `p${i}-${j}`, name: `${["Planner", "Builder", "Reviewer", "Tester"][j % 4]} ${Math.floor(j / 4) + 1}`, status: (i === 4 ? "completed" : i === 1 && j % 4 === 2 ? "attention" : j % 6 === 5 ? "idle" : "working") as "working" | "completed" | "attention" | "idle", activity: i === 4 ? "Work complete" : "Working on project" })) })),
  ...["Delta", "Harbor", "Summit", "Willow", "Pioneer", "Vertex"].map((name, i) => ({ id: `extra-${i}`, name, agents: [{ id: `extra-${i}-agent`, name: "Builder", status: "working" as const, activity: "Working on project" }] })),
];
const inactiveProjects: AgentMapProject[] = projects.slice(0, 3).map(project => ({ ...project, agents: project.agents.map(agent => ({ ...agent, status: agent.status === "attention" ? "attention" : agent.status === "completed" ? "completed" : "idle" })) }));
const unassignedProjects: AgentMapProject[] = [{ id: "unassigned", name: "New project", agents: [] }];
const longTitleProjects: AgentMapProject[] = projects.slice(0, 3).map((project, index) => ({ ...project, name: ["Add a small greeting package to the hello project", "Clarify Greeting CLI Requirements and acceptance criteria", "ExtremelyLongUnbrokenProjectIdentifierForTestingOverflow"][index] }));

export default function AgentMapPage() {
  const [scenario, setScenario] = useState("small");
  const [expanded, setExpanded] = useState<string | null>("atlas");
  const [selected, setSelected] = useState<string | null>(null);
  const [inspectorTitle, setInspectorTitle] = useState("Inspector");
  const [gridSize, setGridSize] = useState(32);
  const [gridFade, setGridFade] = useState<"none" | "radial" | "vertical">("radial");
  const [gridOpacity, setGridOpacity] = useState(35);
  const [fadeStart, setFadeStart] = useState(15);
  const [showGrid, setShowGrid] = useState(true);
  const [scattered, setScattered] = useState(false);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<AgentMapLoaderType>("spinner");
  const [loaderProgress, setLoaderProgress] = useState(50);
  const [skeletonProjects, setSkeletonProjects] = useState(3);
  const [customEmpty, setCustomEmpty] = useState(false);
  const [emptyTitle, setEmptyTitle] = useState("Nothing to monitor");
  const [emptySubtitle, setEmptySubtitle] = useState("Projects will join the map shortly.");
  const [noActiveMessage, setNoActiveMessage] = useState("");
  const [robotVariant, setRobotVariant] = useState<AiRobotVariant>("solid");
  const [fullHeight, setFullHeight] = useState(false);
  const [narrowBelow, setNarrowBelow] = useState(400);
  const [zoomable, setZoomable] = useState(true);
  const [fullWidth, setFullWidth] = useState(true);
  const [panelVariant, setPanelVariant] = useState<PanelVariant>("elevated");
  const [detailsVariant, setDetailsVariant] = useState<PanelVariant>("elevated");
  const [listVariant, setListVariant] = useState<PanelVariant>("subtle");
  const [panelTone, setPanelTone] = useState<PanelTone>("none");
  const [detailsTone, setDetailsTone] = useState<PanelTone>("none");
  const [listTone, setListTone] = useState<PanelTone>("none");
  // The map's body Panel on a background of its own tint needs the forced
  // first nesting step before the card reads as a card.
  const [raisedSurface, setRaisedSurface] = useState(false);
  const [gridTone, setGridTone] = useState<TrueColor>("blue");
  const [glowTone, setGlowTone] = useState<TrueColor>("blue");
  const [gridPattern, setGridPattern] = useState<GridBackgroundPattern>("dots");
  const [gridDotSize, setGridDotSize] = useState(1.5);
  const grid = showGrid ? { pattern: gridPattern, size: gridSize, dotSize: gridDotSize, fade: gridFade, opacity: gridOpacity / 100, fadeStart } : false as const;
  const visibleProjects = scenario === "empty" ? [] : scenario === "unassigned" ? unassignedProjects : scenario === "inactive" ? inactiveProjects : scenario === "long" ? longTitleProjects : scenario === "busy" ? projects : projects.slice(0, 3);
  return <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-6 px-4 py-8 sm:px-8">
    <PageHeader name="Agent Map" description="Monitor agents across projects, with room to expand without overlapping neighboring projects." />
    <PlaygroundPanel controls={<ControlAccordion groups={[
      { id: "fleet", title: "Fleet and layout", defaultOpen: true, controls: <>
        <SelectControl label="Example" value={scenario} options={[{ value: "small", label: "Three projects" }, { value: "busy", label: "Busy fleet" }, { value: "long", label: "Long project titles" }, { value: "empty", label: "No projects" }, { value: "unassigned", label: "No agents assigned" }, { value: "inactive", label: "No agents working" }]} onChange={value => { setScenario(value); setSelected(null); setExpanded(value === "small" || value === "inactive" ? "atlas" : value === "unassigned" ? "unassigned" : null); }} />
        <ToggleRow label="Scattered layout" checked={scattered} onChange={setScattered} />
        <ToggleRow label="Live indicator" checked={live} onChange={setLive} />
        <ChoiceControl label="Robot style" options={[{ value: "outline", label: "Outline" }, { value: "solid", label: "Solid" }]} value={robotVariant} onChange={value => setRobotVariant(value as AiRobotVariant)} />
        <ToggleRow label="Full height" checked={fullHeight} onChange={setFullHeight} />
        <ToggleRow label="Zoom controls" checked={zoomable} onChange={setZoomable} />
        <Control label={`Compact list below: ${narrowBelow}px`}><Slider ariaLabel="Compact list width threshold" min={280} max={720} step={10} value={narrowBelow} onChange={value => setNarrowBelow(value as number)} /></Control>
        <ToggleRow label="Full width" checked={fullWidth} onChange={setFullWidth} />
        <Control label="Inspector title"><Input size="sm" aria-label="Inspector title" value={inspectorTitle} onChange={event => setInspectorTitle(event.target.value)} /></Control>
        <Button size="sm" variant="outline" disabled={!selected} onClick={() => setSelected(null)}>Clear selection</Button>
      </> },
      { id: "loader", title: "Loading", defaultOpen: true, controls: <>
        <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
        <ChoiceControl label="Loader (while loading)" options={[{ value: "spinner", label: "Spinner" }, { value: "progress", label: "Progress" }, { value: "skeleton", label: "Skeleton" }]} value={loaderType} onChange={value => setLoaderType(value as AgentMapLoaderType)} />
        {loaderType === "progress" && <Control label={`Progress: ${loaderProgress}%`}><Slider ariaLabel="Loader progress" min={0} max={100} value={loaderProgress} onChange={value => setLoaderProgress(value as number)} /></Control>}
        {loaderType === "skeleton" && <Control label="Placeholder hubs"><Input size="sm" aria-label="Placeholder hubs" inputMode="numeric" value={String(skeletonProjects)} onChange={event => setSkeletonProjects(Math.max(1, Number(event.target.value.replace(/\D/g, "")) || 1))} /></Control>}
        <p className="text-xs opacity-70">Spinner and progress pin a Loader over the map while the content stays behind it; skeleton swaps the map for pulsing hub placeholders and hides the counts, legend and inspector.</p>
      </> },
      { id: "empty", title: "Empty state", defaultOpen: true, controls: <>
        <p className="text-xs opacity-70">Built in already: choose <em>Example → No projects</em> for the full empty view, <em>No agents assigned</em> for the per-project message, or <em>No agents working</em> for the status bar. Toggle custom copy to override the map-level ones.</p>
        <ToggleRow label="Custom copy" checked={customEmpty} onChange={setCustomEmpty} />
        {customEmpty && <>
          <Control label="Empty projects title"><Input size="sm" aria-label="Empty projects title" value={emptyTitle} onChange={event => setEmptyTitle(event.target.value)} /></Control>
          <Control label="Empty projects subtitle"><Input size="sm" aria-label="Empty projects subtitle" value={emptySubtitle} onChange={event => setEmptySubtitle(event.target.value)} /></Control>
          <Control label="No agents working message"><Input size="sm" aria-label="No agents working message" placeholder="Built-in message" value={noActiveMessage} onChange={event => setNoActiveMessage(event.target.value)} /></Control>
        </>}
      </> },
      { id: "grid", title: "Lattice background", defaultOpen: true, controls: <>
        <ToggleRow label="Show grid" checked={showGrid} onChange={setShowGrid} />
        <ChoiceControl label="Pattern" options={gridBackgroundPatternOptions} value={gridPattern} onChange={value => setGridPattern(value as GridBackgroundPattern)} />
        {gridPattern === "dots" && <Control label={`Dot radius: ${gridDotSize}px`}><Slider ariaLabel="Grid dot radius" min={0.5} max={8} step={0.25} value={gridDotSize} onChange={value => setGridDotSize(value as number)} /></Control>}
        <Control label={`Square size: ${gridSize}px`}><Slider ariaLabel="Grid square size" min={12} max={80} value={gridSize} onChange={value => setGridSize(value as number)} /></Control>
        <Control label={`Opacity: ${gridOpacity}%`}><Slider ariaLabel="Grid opacity" min={0} max={100} value={gridOpacity} onChange={value => setGridOpacity(value as number)} /></Control>
        <SelectControl label="Fade" value={gridFade} options={[{ value: "none", label: "None" }, { value: "radial", label: "Radial" }, { value: "vertical", label: "Vertical" }]} onChange={value => setGridFade(value as typeof gridFade)} />
        {gridFade !== "none" && <Control label={`Fade start: ${fadeStart}%`}><Slider ariaLabel="Grid fade start" min={0} max={85} value={fadeStart} onChange={value => setFadeStart(value as number)} /></Control>}
      </> },
      { id: "surfaces", title: "Panel variants", defaultOpen: true, controls: <>
        <SelectControl label="Map panel" value={panelVariant} options={surfaceVariantOptions} onChange={value => setPanelVariant(value as PanelVariant)} />
        <SelectControl label="Details panel" value={detailsVariant} options={surfaceVariantOptions} onChange={value => setDetailsVariant(value as PanelVariant)} />
        <SelectControl label="List panels" value={listVariant} options={surfaceVariantOptions} onChange={value => setListVariant(value as PanelVariant)} />
        <ToggleRow label="Raised surface (map panel)" checked={raisedSurface} onChange={setRaisedSurface} />
      </> },
      { id: "panel-tones", title: "Panel tones", controls: <>
        <SurfaceToneControl label="Map panel tone" value={panelTone} onChange={setPanelTone} />
        <SurfaceToneControl label="Details panel tone" value={detailsTone} onChange={setDetailsTone} />
        <SurfaceToneControl label="List panels tone" value={listTone} onChange={setListTone} />
      </> },
      { id: "background-tones", title: "Grid and glow tones", controls: <>
        <Control label="Grid tone"><ColorSwatches selectable size="sm" value={gridTone} onSelect={setGridTone} defaultExpanded /></Control>
        <Control label="Glow tone"><ColorSwatches selectable size="sm" value={glowTone} onSelect={setGlowTone} defaultExpanded /></Control>
      </> },
    ]} />} preview={<div className="w-full" style={{ height: fullHeight ? 640 : undefined }}><AgentMap fullHeight={fullHeight} fullWidth={fullWidth} narrowBelow={narrowBelow} zoomable={zoomable} projects={visibleProjects} expandedProjectId={expanded} onExpandedProjectChange={setExpanded} selectedAgentId={selected} onAgentSelect={agent => setSelected(agent.id)} onSelectionClear={() => setSelected(null)} inspectorTitle={inspectorTitle} scattered={scattered} live={live} grid={grid} panelVariant={panelVariant} raisedSurface={raisedSurface} detailsVariant={detailsVariant} listVariant={listVariant} panelTone={panelTone} detailsTone={detailsTone} listTone={listTone} gridTone={gridTone} glowTone={glowTone} loading={loading} loaderType={loaderType} loadingMessage="Loading fleet…" loaderProgress={loaderType === "progress" ? loaderProgress : undefined} skeletonProjects={skeletonProjects} robotVariant={robotVariant} emptyProjects={customEmpty ? <EmptyState variant="plain" dashed={false} icon={<AiRobot size="md" tone={glowTone ?? "blue"} variant={robotVariant} paused />} iconBackground={false} title={emptyTitle} subtitle={emptySubtitle} /> : undefined} noActiveAgentsMessage={customEmpty && noActiveMessage ? noActiveMessage : undefined} renderAgentDetails={(_agent, project) => <p className="mt-4 text-sm">Project: {project.name}</p>} /></div>} />
    <section><h2 className="mb-3 text-xl font-semibold">Reusable lattice background</h2><p className="mb-3 max-w-3xl text-sm text-neutral-500 dark:text-neutral-400">The map's lattice is the standalone <Link to="/grid-background" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Grid Background</Link> component, so the strip below mirrors whatever the playground above is set to — lines or dots, size, opacity and fade alike.</p><div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-700">{grid !== false && <GridBackground {...grid} lineColor={`var(--color-${gridTone}-500)`} />}<span className="relative">The same grid settings can be used independently.</span></div></section>
    <PropsTable props={[
      { name: "projects", type: "readonly AgentMapProject[]", default: "required", description: "Project IDs and agent IDs must be unique. Agents carry a status and current activity." },
      { name: "expandedProjectId / onExpandedProjectChange", type: "string | null / callback", default: "uncontrolled", description: "Control which project is expanded. Projects with 13–20 agents use a focused layer; larger projects use a list." },
      { name: "selectedAgentId / onAgentSelect", type: "string | null / callback", default: "uncontrolled", description: "Control agent selection and receive the selected agent and project." },
      { name: "onSelectionClear", type: "() => void", default: "undefined", description: "Clear controlled selection when an outside click or project selection dismisses the inspector." },
      { name: "renderAgentDetails", type: "(agent, project) => ReactNode", default: "undefined", description: "Add consumer-owned actions or details to the selection panel." },
      { name: "inspectorTitle", type: "ReactNode", default: '"Inspector"', description: "Customize the selected agent's inspector title." },
      { name: "inspectorMinMainWidth", type: "number", default: "360", description: "The map column's floor behind the width-only dock/stack decision, measured on the map alone: the docked inspector's 280px + 16px gap is predicted, never measured, so the inspector's own width never counts. The inspector docks beside the map while the map keeps this floor underneath the dock, and stacks underneath below that. Raise it when the map needs more room to stay legible." },
      { name: "inspectorStackBelow", type: "number", default: "fit-derived", description: "Replace that comparison outright — stack while the map column's docked width falls below this many pixels. 0 always docks beside the map; a large value always stacks below it." },
      { name: "narrowBelow", type: "number", default: "400", description: "Width in pixels below which the map breaks into the compact project list. Only width breaks the layout — short containers keep the map and scroll vertically." },
      { name: "zoomable", type: "boolean", default: "true", description: "Show the zoom pill (Fit, −, %, +) over the map and honor ctrl/⌘ + wheel. Zoom scales the canvas inside a fixed-size frame and keeps the scroll center; the map gains vertical panning while zoomed in." },
      { name: "fullHeight / fullWidth", type: "boolean", default: "false / true", description: "Fill the parent height (which must be defined) or available width." },
      { name: "scattered", type: "boolean", default: "false", description: "Deterministically scatter the project hubs to fill the available area, shrinking them as one group when crowded." },
      { name: "grid", type: "false | GridBackground settings", default: "radial grid", description: "Configure the map lattice — crossing lines, or dots on their cardinal points — or set false to hide it." },
      { name: "panelVariant / detailsVariant / listVariant", type: "PanelVariant", default: "elevated / elevated / subtle", description: "Set the map, selection, and list panel surfaces independently." },
      { name: "panelTone / detailsTone / listTone", type: "PanelTone", default: "none", description: "Set the tone of each panel surface independently." },
      { name: "raisedSurface", type: "boolean", default: "false", description: "Forwarded to the map's body Panel — forces at least the first nested-panels depth step, the tinted-card-on-matching-background fix." },
      { name: "gridTone / glowTone", type: "TrueColor", default: '"blue"', description: "Choose independent theme colors for grid lines and ambient glow — blue matches the NetworkGraph accent. grid.lineColor overrides gridTone." },
      { name: "emptyProjects / noActiveAgentsMessage", type: "ReactNode", default: "built-in messages", description: "Override the empty-project view or the message shown when no agents are working." },
      { name: "robotVariant", type: '"outline" | "solid"', default: '"solid"', description: "Style for every robot in the map — agent orbs, list avatars and the built-in empty state." },
      { name: "loading / loaderType", type: "boolean / \"spinner\" | \"progress\" | \"skeleton\"", default: "false / \"spinner\"", description: "Panel-style loading: the spinner and progress overlay pins a Loader over the map (aria-busy marks the region), while skeleton swaps the map for pulsing hub placeholders and hides the counts, legend and inspector." },
      { name: "loadingMessage", type: "string", default: "undefined", description: "Names the loading overlay for screen readers." },
      { name: "loaderProgress", type: "number", default: "undefined", description: "The 0–100 value of the progress bar under loaderType=\"progress\"." },
      { name: "skeletonProjects", type: "number", default: "3", description: "How many hub-shaped placeholders skeleton mode draws." },
      { name: "GridBackground: pattern / size / lineColor / dotSize / opacity / fade / fadeStart", type: '"grid" | "dots" / number / string / number / number / fade / number', default: '"dots" / 32 / blue-500 / 1.5 / 0.35 / "radial" / 15', description: "The standalone Grid Background component's props, passed through. Dots land on the crossings of the same lattice, so switching pattern keeps the map aligned; gridTone colours either one." },
    ]} />
  </div>;
}
