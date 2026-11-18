import { useState } from "react";
import { AgentMap, ColorSwatches, GridBackground, Slider, type AgentMapProject, type PanelTone, type PanelVariant, type TrueColor } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { PropsTable } from "../../shared/A11ySections";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { surfaceVariantOptions } from "../../shared/options";
import { SurfaceToneControl } from "../../shared/SurfaceToneControl";

const projects: AgentMapProject[] = [
  { id: "atlas", name: "Atlas", agents: [{ id: "a1", name: "Builder", status: "working", activity: "Implementing checkout" }, { id: "a2", name: "Reviewer", status: "attention", activity: "Waiting for approval" }, { id: "a3", name: "Researcher", status: "working", activity: "Checking sources" }, { id: "a4", name: "Tester", status: "working", activity: "Running tests" }, { id: "a5", name: "Planner", status: "working", activity: "Planning release" }, { id: "a6", name: "Analyst", status: "idle", activity: "Waiting for results" }, { id: "a7", name: "Writer", status: "completed", activity: "Documentation complete" }, { id: "a8", name: "Auditor", status: "working", activity: "Checking changes" }] },
  { id: "horizon", name: "Horizon", agents: [{ id: "h1", name: "Planner", status: "working", activity: "Planning migration" }, { id: "h2", name: "Builder", status: "working", activity: "Writing code" }, { id: "h3", name: "Tester", status: "idle", activity: "Waiting for build" }, ...Array.from({ length: 7 }, (_, i) => ({ id: `h${i + 4}`, name: `Agent ${i + 4}`, status: "working" as const, activity: "Working on migration" }))] },
  { id: "orbit", name: "Orbit", agents: [{ id: "o1", name: "Builder", status: "completed", activity: "Implementation complete" }, { id: "o2", name: "Reviewer", status: "completed", activity: "Review complete" }, { id: "o3", name: "Tester", status: "completed", activity: "Tests passed" }] },
  ...["Northstar", "Meridian", "Lumen", "Canvas", "Beacon"].map((name, i) => ({ id: `p${i}`, name, agents: Array.from({ length: [14, 18, 26, 4, 4][i] }, (_, j) => ({ id: `p${i}-${j}`, name: `${["Planner", "Builder", "Reviewer", "Tester"][j % 4]} ${Math.floor(j / 4) + 1}`, status: (i === 4 ? "completed" : i === 1 && j % 4 === 2 ? "attention" : j % 6 === 5 ? "idle" : "working") as "working" | "completed" | "attention" | "idle", activity: i === 4 ? "Work complete" : "Working on project" })) })),
];
const inactiveProjects: AgentMapProject[] = projects.slice(0, 3).map(project => ({ ...project, agents: project.agents.map(agent => ({ ...agent, status: agent.status === "attention" ? "attention" : agent.status === "completed" ? "completed" : "idle" })) }));
const unassignedProjects: AgentMapProject[] = [{ id: "unassigned", name: "New project", agents: [] }];

export default function AgentMapPage() {
  const [scenario, setScenario] = useState("small");
  const [expanded, setExpanded] = useState<string | null>("atlas");
  const [gridSize, setGridSize] = useState(24);
  const [gridFade, setGridFade] = useState<"none" | "radial" | "vertical">("radial");
  const [gridOpacity, setGridOpacity] = useState(20);
  const [fadeStart, setFadeStart] = useState(15);
  const [showGrid, setShowGrid] = useState(true);
  const [scattered, setScattered] = useState(false);
  const [live, setLive] = useState(false);
  const [panelVariant, setPanelVariant] = useState<PanelVariant>("elevated");
  const [detailsVariant, setDetailsVariant] = useState<PanelVariant>("elevated");
  const [listVariant, setListVariant] = useState<PanelVariant>("subtle");
  const [panelTone, setPanelTone] = useState<PanelTone>("none");
  const [detailsTone, setDetailsTone] = useState<PanelTone>("none");
  const [listTone, setListTone] = useState<PanelTone>("none");
  const [gridTone, setGridTone] = useState<TrueColor>("cyan");
  const [glowTone, setGlowTone] = useState<TrueColor>("cyan");
  const grid = showGrid ? { size: gridSize, fade: gridFade, opacity: gridOpacity / 100, fadeStart } : false as const;
  const visibleProjects = scenario === "empty" ? [] : scenario === "unassigned" ? unassignedProjects : scenario === "inactive" ? inactiveProjects : scenario === "busy" ? projects : projects.slice(0, 3);
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8">
    <PageHeader name="Agent Map" description="Monitor agents across projects, with room to expand without overlapping neighboring projects." />
    <PlaygroundPanel controls={<ControlAccordion groups={[
      { id: "fleet", title: "Fleet and layout", defaultOpen: true, controls: <>
        <SelectControl label="Example" value={scenario} options={[{ value: "small", label: "Three projects" }, { value: "busy", label: "Busy fleet" }, { value: "empty", label: "No projects" }, { value: "unassigned", label: "No agents assigned" }, { value: "inactive", label: "No agents working" }]} onChange={value => { setScenario(value); setExpanded(value === "small" || value === "inactive" ? "atlas" : value === "unassigned" ? "unassigned" : null); }} />
        <ToggleRow label="Scattered layout" checked={scattered} onChange={setScattered} />
        <ToggleRow label="Live indicator" checked={live} onChange={setLive} />
      </> },
      { id: "grid", title: "Grid background", defaultOpen: true, controls: <>
        <ToggleRow label="Show grid" checked={showGrid} onChange={setShowGrid} />
        <Control label={`Square size: ${gridSize}px`}><Slider ariaLabel="Grid square size" min={12} max={80} value={gridSize} onChange={value => setGridSize(value as number)} /></Control>
        <Control label={`Opacity: ${gridOpacity}%`}><Slider ariaLabel="Grid opacity" min={0} max={100} value={gridOpacity} onChange={value => setGridOpacity(value as number)} /></Control>
        <SelectControl label="Fade" value={gridFade} options={[{ value: "none", label: "None" }, { value: "radial", label: "Radial" }, { value: "vertical", label: "Vertical" }]} onChange={value => setGridFade(value as typeof gridFade)} />
        {gridFade !== "none" && <Control label={`Fade start: ${fadeStart}%`}><Slider ariaLabel="Grid fade start" min={0} max={85} value={fadeStart} onChange={value => setFadeStart(value as number)} /></Control>}
      </> },
      { id: "surfaces", title: "Panel variants", defaultOpen: true, controls: <>
        <SelectControl label="Map panel" value={panelVariant} options={surfaceVariantOptions} onChange={value => setPanelVariant(value as PanelVariant)} />
        <SelectControl label="Details panel" value={detailsVariant} options={surfaceVariantOptions} onChange={value => setDetailsVariant(value as PanelVariant)} />
        <SelectControl label="List panels" value={listVariant} options={surfaceVariantOptions} onChange={value => setListVariant(value as PanelVariant)} />
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
    ]} />} preview={<AgentMap className="w-full" projects={visibleProjects} expandedProjectId={expanded} onExpandedProjectChange={setExpanded} defaultSelectedAgentId="a2" scattered={scattered} live={live} grid={grid} panelVariant={panelVariant} detailsVariant={detailsVariant} listVariant={listVariant} panelTone={panelTone} detailsTone={detailsTone} listTone={listTone} gridTone={gridTone} glowTone={glowTone} renderAgentDetails={(_agent, project) => <p className="mt-4 text-sm">Project: {project.name}</p>} />} />
    <section><h2 className="mb-3 text-xl font-semibold">Reusable grid background</h2><div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-700">{grid !== false && <GridBackground {...grid} lineColor={`var(--color-${gridTone}-500)`} />}<span className="relative">The same grid settings can be used independently.</span></div></section>
    <PropsTable props={[
      { name: "projects", type: "readonly AgentMapProject[]", default: "required", description: "Project IDs and agent IDs must be unique. Agents carry a status and current activity." },
      { name: "expandedProjectId / onExpandedProjectChange", type: "string | null / callback", default: "uncontrolled", description: "Control which project is expanded. Projects with 13–20 agents use a focused layer; larger projects use a list." },
      { name: "selectedAgentId / onAgentSelect", type: "string | null / callback", default: "uncontrolled", description: "Control agent selection and receive the selected agent and project." },
      { name: "renderAgentDetails", type: "(agent, project) => ReactNode", default: "undefined", description: "Add consumer-owned actions or details to the selection panel." },
      { name: "scattered", type: "boolean", default: "false", description: "Scatter the project hubs deterministically while avoiding collisions." },
      { name: "grid", type: "false | GridBackground settings", default: "radial grid", description: "Configure the map grid or set false to hide it." },
      { name: "panelVariant / detailsVariant / listVariant", type: "PanelVariant", default: "elevated / elevated / subtle", description: "Set the map, selection, and list panel surfaces independently." },
      { name: "panelTone / detailsTone / listTone", type: "PanelTone", default: "none", description: "Set the tone of each panel surface independently." },
      { name: "gridTone / glowTone", type: "TrueColor", default: "undefined", description: "Choose independent theme colors for grid lines and ambient glow. grid.lineColor overrides gridTone." },
      { name: "emptyProjects / noActiveAgentsMessage", type: "ReactNode", default: "built-in messages", description: "Override the empty-project view or the message shown when no agents are working." },
      { name: "GridBackground: size / lineColor / opacity / fade / fadeStart", type: "number / string / number / fade / number", default: "32 / currentColor / 0.12 / none / 15", description: "Configure a decorative grid with optional radial or vertical edge fade." },
    ]} />
  </div>;
}
