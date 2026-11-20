import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Panel, { SkeletonBar, type PanelTone, type PanelVariant } from "../Panel";
import Loader from "../Loader";
import type { TrueColor } from "../../theme/Theme";
import { AiRobot, type AiRobotVariant } from "../AiRobot";
import { GridBackground, type GridBackgroundProps } from "../GridBackground";
import { ScrollArea } from "../ScrollArea";
import EmptyState from "../EmptyState";
import { agentPositions, layoutProjectsHorizontally, scatterProjects, type MapCircle } from "./layout";
import "./agent-map.css";

export type AgentMapStatus = "working" | "attention" | "idle" | "completed";
/**
 * The three loading styles an AgentMap can show, matching Table and Panel.
 * `"spinner"` and `"progress"` draw a Loader overlay pinned to the map;
 * `"skeleton"` replaces the map with pulsing placeholders shaped like the fleet.
 */
export type AgentMapLoaderType = "spinner" | "progress" | "skeleton";
/** Agent IDs must be unique across all projects in a map. */
export interface AgentMapAgent { id: string; name: string; status: AgentMapStatus; activity: string; }
export interface AgentMapProject { id: string; name: string; agents: readonly AgentMapAgent[]; }
export interface AgentMapProps {
  projects: readonly AgentMapProject[];
  expandedProjectId?: string | null;
  defaultExpandedProjectId?: string | null;
  onExpandedProjectChange?: (id: string | null) => void;
  selectedAgentId?: string | null;
  defaultSelectedAgentId?: string | null;
  onAgentSelect?: (agent: AgentMapAgent, project: AgentMapProject) => void;
  /** Fired when an outside click or project selection requests clearing the inspector. */
  onSelectionClear?: () => void;
  /** Consumer-owned detail content, for example a project-chat link. */
  renderAgentDetails?: (agent: AgentMapAgent, project: AgentMapProject) => ReactNode;
  ariaLabel?: string;
  /** Show a live indicator when the consumer supplies live data. */
  live?: boolean;
  /** Deterministically scatter the project hubs to fill the available area, shrinking them as one group when crowded. */
  scattered?: boolean;
  /** Configure the lattice — crossing lines, or dots on their cardinal points — or hide it with false. */
  grid?: false | Pick<GridBackgroundProps, "pattern" | "size" | "lineColor" | "dotSize" | "opacity" | "fade" | "fadeStart">;
  /** Surface variants for the map, details, and project/agent lists. */
  panelVariant?: PanelVariant;
  detailsVariant?: PanelVariant;
  listVariant?: PanelVariant;
  /** Surface tones for the map, details, and project/agent lists. */
  panelTone?: PanelTone;
  detailsTone?: PanelTone;
  listTone?: PanelTone;
  /** Theme colors for the grid lines and ambient background glow. @default "blue" — the NetworkGraph accent */
  gridTone?: TrueColor;
  glowTone?: TrueColor;
  /** Override the empty-project view or the message shown when nothing is working. */
  emptyProjects?: ReactNode;
  noActiveAgentsMessage?: ReactNode;
  /** Robot glyph variant for every robot in the map — orbs, list avatars and the built-in empty state. @default "solid" */
  robotVariant?: AiRobotVariant;
  /** Show a loading treatment while the fleet is fetched. */
  loading?: boolean;
  /**
   * Style of the loading indicator, matching Table:
   * - `"spinner"` / `"progress"` — a Loader overlay pinned to the map (it
   *   covers the whole viewport while the content stays behind it),
   * - `"skeleton"` — the map is replaced by pulsing placeholders shaped
   *   like project hubs.
   * @default "spinner"
   */
  loaderType?: AgentMapLoaderType;
  /** Names the loading overlay for assistive technology. */
  loadingMessage?: string;
  /** `"progress"` overlay only — the bar's 0–100 value. */
  loaderProgress?: number;
  /**
   * Placeholder project hubs drawn by `loaderType="skeleton"`.
   * @default 3
   */
  skeletonProjects?: number;
  /** Title shown above the selected agent's details. */
  inspectorTitle?: ReactNode;
  /**
   * Agent-map column floor behind the dock/stack decision: the inspector docks
   * beside the map only while the component is at least
   * `INSPECTOR_WIDTH + 16 + inspectorMinMainWidth` wide, and stacks under it below
   * that. Raise it if the map needs more room to stay legible. @default 360
   */
  inspectorMinMainWidth?: number;
  /**
   * Escape hatch for the dock/stack decision: stack while the component is narrower
   * than this many CSS pixels, instead of the fit-derived threshold. `0` always
   * docks beside the map; a large value always stacks below it.
   */
  inspectorStackBelow?: number;
  /** Fill the height of a parent with a defined height. */
  fullHeight?: boolean;
  /** Fill the available width. @default true */
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
}

const COLORS: Record<AgentMapStatus, string> = { working: "#3b82f6", attention: "#efb65f", idle: "#8a9ba9", completed: "#53c994" };
const TONES = { working: "blue", attention: "amber", idle: "neutral", completed: "green" } as const;
const LABELS: Record<AgentMapStatus, string> = { working: "Working", attention: "Needs attention", idle: "Idle", completed: "Completed" };
const MAX_ORBIT_AGENTS = 12;
const MAX_FOCUS_AGENTS = 20;
const EXPANDED_RADIUS = 164;
const COLLAPSED_RADIUS = 62;
/** Docked inspector column and its gap — must match agent-map.css. */
const INSPECTOR_WIDTH = 280;
const INSPECTOR_GAP = 16;
/** Map-column floor behind the derived dock threshold. */
const INSPECTOR_MIN_MAIN_WIDTH_DEFAULT = 360;

/**
 * Placeholder drawn by `loaderType="skeleton"`: project hubs with name and
 * roster bars beneath, so the card keeps the map's shape while the fleet loads.
 */
const AgentMapSkeleton = ({ projects: count }: { projects: number }) => (
  <div aria-hidden="true" className="cj-agent-map__skeleton animate-pulse motion-reduce:animate-none">
    {Array.from({ length: Math.max(1, count) }).map((_, i) => (
      <div key={i} className="cj-agent-map__skeleton-project">
        <span className="cj-agent-map__skeleton-hub" />
        <SkeletonBar width="4.5rem" />
        <SkeletonBar width="3rem" height="h-2.5" />
      </div>
    ))}
  </div>
);

export function AgentMap({ projects, expandedProjectId, defaultExpandedProjectId = null, onExpandedProjectChange, selectedAgentId, defaultSelectedAgentId = null, onAgentSelect, onSelectionClear, renderAgentDetails, ariaLabel = "Agent activity", live = false, scattered = false, grid, panelVariant = "elevated", detailsVariant = "elevated", listVariant = "subtle", panelTone = "none", detailsTone = "none", listTone = "none", gridTone = "blue", glowTone = "blue", emptyProjects, noActiveAgentsMessage, robotVariant = "solid", loading = false, loadingMessage, loaderType = "spinner", loaderProgress, skeletonProjects = 3, inspectorTitle = "Inspector", inspectorMinMainWidth = INSPECTOR_MIN_MAIN_WIDTH_DEFAULT, inspectorStackBelow, fullHeight = false, fullWidth = true, className, style }: AgentMapProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpandedProjectId);
  const [internalSelected, setInternalSelected] = useState(defaultSelectedAgentId);
  const [width, setWidth] = useState(720);
  const [viewportHeight, setViewportHeight] = useState(420);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [stacked, setStacked] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const orbsViewportRef = useRef<HTMLDivElement>(null);
  const expanded = expandedProjectId === undefined ? internalExpanded : expandedProjectId;
  const selected = selectedAgentId === undefined ? internalSelected : selectedAgentId;
  const narrow = width < 400 || (fullHeight && viewportHeight < 364);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => { const rect = el.getBoundingClientRect(); if (rect.width > 0) setWidth(rect.width); if (fullHeight && rect.height > 0) { const notice = el.querySelector(".cj-agent-map__inactive"); setViewportHeight(Math.max(0, rect.height - (notice ? notice.getBoundingClientRect().height + 12 : 0))); } };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure); observer.observe(el);
    return () => observer.disconnect();
  }, [fullHeight, projects]);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Fit-based rather than a magic number: dock the inspector beside the map only
    // while the map keeps its floor after the inspector column and its gap are
    // taken from the component. `inspectorStackBelow` replaces the comparison.
    const threshold = inspectorStackBelow ?? INSPECTOR_WIDTH + INSPECTOR_GAP + inspectorMinMainWidth;
    const measure = () => { const w = el.getBoundingClientRect().width; if (w > 0) setStacked(w < threshold); };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure); observer.observe(el);
    return () => observer.disconnect();
  }, [inspectorMinMainWidth, inspectorStackBelow]);
  const expandedProject = projects.find(project => project.id === expanded);
  const focused = !narrow && !!expandedProject && expandedProject.agents.length > MAX_ORBIT_AGENTS && expandedProject.agents.length <= MAX_FOCUS_AGENTS;
  const showLargeAgentList = !!expandedProject && expandedProject.agents.length > MAX_FOCUS_AGENTS;
  const graphHeight = fullHeight && !narrow ? (showLargeAgentList ? Math.max(160, Math.floor(viewportHeight * 0.45)) : Math.max(364, viewportHeight)) : 420;
  const layout = useMemo<{ circles: MapCircle[]; width: number; scale: number }>(() => {
    const items = projects.map(p => ({ id: p.id, radius: p.id === expanded && p.agents.length <= MAX_ORBIT_AGENTS ? EXPANDED_RADIUS : COLLAPSED_RADIUS }));
    return scattered && !narrow ? scatterProjects(items, width, graphHeight, 18) : { ...layoutProjectsHorizontally(items, graphHeight, 18, scattered), scale: 1 };
  }, [projects, expanded, graphHeight, scattered, narrow, width]);
  const canvasWidth = Math.max(width, layout.width, focused ? scrollLeft + width : 0);
  useEffect(() => {
    const viewport = orbsViewportRef.current;
    if (!viewport) return;
    const onScroll = () => setScrollLeft(viewport.scrollLeft);
    onScroll(); viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", onScroll);
  }, [narrow, projects.length]);
  const selection = projects.flatMap(project => project.agents.map(agent => ({ project, agent }))).find(item => item.agent.id === selected);
  useEffect(() => {
    if (!selection) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const root = rootRef.current;
      if (root?.contains(target) && (target.closest(".cj-agent-map__inspector") || target.closest(".cj-agent-map__agent, .cj-agent-map__list-agent, .cj-agent-map__hub, .cj-agent-map__list-project"))) return;
      if (selectedAgentId === undefined) setInternalSelected(null);
      onSelectionClear?.();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [selection, selectedAgentId, onSelectionClear]);
  const agents = projects.flatMap(project => project.agents);
  const activeCount = agents.filter(agent => agent.status === "working").length;
  const attentionCount = agents.filter(agent => agent.status === "attention").length;
  // Skeleton mode replaces the map with placeholders instead of overlaying a
  // Loader, mirroring Table's `showSkeleton`.
  const showSkeleton = loading && loaderType === "skeleton";
  function toggle(project: AgentMapProject) { const next = expanded === project.id ? null : project.id; if (selection) { if (selectedAgentId === undefined) setInternalSelected(null); onSelectionClear?.(); } if (expandedProjectId === undefined) setInternalExpanded(next); onExpandedProjectChange?.(next); }
  function select(agent: AgentMapAgent, project: AgentMapProject) { if (selectedAgentId === undefined) setInternalSelected(agent.id); onAgentSelect?.(agent, project); }
  function agentList(project: AgentMapProject) { return <Panel variant={listVariant} tone={listTone} padding="sm" scrollable={false} flexBody className="cj-agent-map__agent-list"><div className="cj-agent-map__list-heading"><strong>{project.name} agents</strong><span>{project.agents.length} total</span></div><ScrollArea variant="auto" horizontal={false} className="cj-agent-map__list-scroll" aria-label={`${project.name} agents`}><div className="cj-agent-map__list-rows">{project.agents.length === 0 && <p className="cj-agent-map__list-empty">No agents assigned to this project.</p>}{project.agents.map(agent => <button type="button" className="cj-agent-map__list-agent" key={agent.id} aria-pressed={selected === agent.id} onClick={() => select(agent, project)}><span className={["cj-agent-map__list-avatar", agent.status === "attention" && "cj-agent-map__attention-ring"].filter(Boolean).join(" ")} style={{ "--agent-color": COLORS[agent.status] } as CSSProperties}><AiRobot size={26} tone={TONES[agent.status]} variant={robotVariant} paused={agent.status !== "working"} /></span><span className="cj-agent-map__list-content"><strong>{agent.name}</strong><small>{agent.activity}</small></span><span className="cj-agent-map__list-status"><i style={{ background: COLORS[agent.status] }} />{LABELS[agent.status]}</span></button>)}</div></ScrollArea></Panel>; }
  const inactiveMessage = noActiveAgentsMessage === undefined ? (agents.length === 0 ? "No agents are assigned to these projects yet." : "No agents are currently working.") : noActiveAgentsMessage;
  return <div ref={rootRef} className={["cj-agent-map", (stacked || projects.length === 0) && "cj-agent-map--stacked", selection && "cj-agent-map--inspector-open", fullHeight && "cj-agent-map--full-height", fullWidth ? "cj-agent-map--full-width" : "cj-agent-map--intrinsic-width", className].filter(Boolean).join(" ")} style={style}>
    <Panel variant={panelVariant} tone={panelTone} padding="none" scrollable={false} flexBody className="cj-agent-map__panel">
      <div className="cj-agent-map__header"><strong>{ariaLabel}</strong>{live && <span className="cj-agent-map__live">● Live</span>}{loading ? <span className="cj-agent-map__counts"><SkeletonBar width="12rem" className="animate-pulse motion-reduce:animate-none" /></span> : <span className="cj-agent-map__counts">{activeCount} active · {projects.length} projects · {attentionCount} need attention</span>}</div>
      <div ref={viewportRef} className="cj-agent-map__viewport" aria-busy={loading || undefined} style={{ ...(gridTone ? { "--cj-agent-map-grid-color": `var(--color-${gridTone}-500)` } : {}), ...(glowTone ? { "--cj-agent-map-glow-color": `var(--color-${glowTone}-500)` } : {}) } as CSSProperties}>
        {grid !== false && <GridBackground pattern="dots" size={32} lineColor="var(--cj-agent-map-grid-color, var(--color-blue-500, #3b82f6))" dotSize={1.5} opacity={0.35} fade="radial" {...grid} />}
        {loading && loaderType !== "skeleton" && <Loader overlay variant={loaderType} label={loadingMessage} progress={loaderProgress} className="rounded-none" />}
        {projects.length > 0 && activeCount === 0 && !loading && inactiveMessage != null && <div className="cj-agent-map__inactive" role="status">{inactiveMessage}</div>}
        {showSkeleton ? <AgentMapSkeleton projects={skeletonProjects} /> : projects.length === 0 ? <div className="cj-agent-map__empty">{emptyProjects === undefined ? <EmptyState variant="plain" dashed={false} icon={<AiRobot size="md" tone={glowTone ?? "blue"} variant={robotVariant} paused />} iconBackground={false} title="No projects to display" subtitle="Agent activity will appear here when projects are available." /> : emptyProjects}</div> : narrow ? <div className="cj-agent-map__list"><ScrollArea horizontal={false} className="cj-agent-map__projects-scroll" aria-label="Projects"><Panel variant={listVariant} tone={listTone} padding="sm" scrollable={false} className="cj-agent-map__project-list"><div className="cj-agent-map__list-heading"><strong>Projects</strong><span>{projects.length} total</span></div><div className="cj-agent-map__project-rows">{projects.map(project => { const attention = project.agents.filter(agent => agent.status === "attention").length; const completed = project.agents.filter(agent => agent.status === "completed").length; const working = project.agents.some(agent => agent.status === "working"); const color = attention ? COLORS.attention : completed === project.agents.length && completed > 0 ? COLORS.completed : working ? COLORS.working : COLORS.idle; return <div key={project.id}><button type="button" className="cj-agent-map__list-project" title={project.name} aria-expanded={expanded === project.id} onClick={() => toggle(project)}><span className={["cj-agent-map__project-avatar", attention && "cj-agent-map__attention-ring"].filter(Boolean).join(" ")} style={{ "--agent-color": color } as CSSProperties} aria-hidden="true">{project.name.slice(0, 1).toUpperCase()}</span><span className="cj-agent-map__list-content"><strong>{project.name}</strong><small>{project.agents.length} agents</small></span><span className="cj-agent-map__list-status"><i style={{ background: color }} />{attention ? `${attention} need attention` : completed === project.agents.length && completed > 0 ? "Completed" : working ? "Working" : project.agents.length ? "Idle" : "No agents"}</span><span className="cj-agent-map__project-chevron" aria-hidden="true">{expanded === project.id ? "⌃" : "⌄"}</span></button>{expanded === project.id && agentList(project)}</div>; })}</div></Panel></ScrollArea></div> : <ScrollArea vertical={false} variant="auto" className="cj-agent-map__orbs-scroll" contentClassName="cj-agent-map__orbs-content" viewportRef={orbsViewportRef} aria-label="Project map" style={{ height: graphHeight }}><div className="cj-agent-map__canvas" style={{ width: canvasWidth, height: graphHeight }}>
          {projects.map((project, i) => {
            const pos = layout.circles[i]; const open = expanded === project.id; const orbit = open && project.agents.length <= MAX_FOCUS_AGENTS; const attention = project.agents.filter(a => a.status === "attention").length; const completed = project.agents.filter(a => a.status === "completed").length;
            const points = orbit ? agentPositions(project.agents.length, focused) : [];
            const scale = focused ? 0.7 : project.agents.length > 8 ? Math.max(0.72, 8 / project.agents.length) : 1;
            const hubScale = open ? scale : layout.scale;
            const color = attention ? COLORS.attention : completed === project.agents.length && completed > 0 ? COLORS.completed : COLORS.working;
            return <div key={project.id} className={["cj-agent-map__project", focused && !open && "cj-agent-map__project--background", focused && open && "cj-agent-map__project--focused"].filter(Boolean).join(" ")} style={{ left: focused && open ? scrollLeft + width / 2 : pos.x, top: focused && open ? graphHeight / 2 : pos.y, ...(open ? {} : { "--overflow-offset": `${58 * layout.scale}px` }) } as CSSProperties} aria-hidden={focused && !open ? true : undefined}>
              {orbit && <svg className="cj-agent-map__lines" aria-hidden="true" viewBox="-164 -164 328 328">{project.agents.map((agent, j) => <line key={agent.id} x1="0" y1="0" x2={points[j].x} y2={points[j].y} stroke={COLORS[agent.status]} />)}</svg>}
              <button type="button" className={["cj-agent-map__hub", attention && "cj-agent-map__hub--attention"].filter(Boolean).join(" ")} style={{ "--agent-color": color, "--hub-scale": hubScale } as CSSProperties} disabled={focused && !open} title={project.name} aria-expanded={open} aria-label={`${project.name}, ${project.agents.length} agents${attention ? `, ${attention} need attention` : ""}`} onClick={() => toggle(project)}><strong>{project.name}</strong><span>{project.agents.length} agents</span></button>
              {!open && <span className="cj-agent-map__overflow">{attention ? `${attention} need attention` : completed ? `${completed} completed` : "Select to expand"}</span>}
              {orbit && project.agents.map((agent, j) => <button key={agent.id} type="button" className="cj-agent-map__agent" style={{ left: points[j].x, top: points[j].y, "--agent-color": COLORS[agent.status], "--agent-scale": scale } as CSSProperties} aria-label={`${agent.name}, ${project.name}, ${LABELS[agent.status]}: ${agent.activity}`} aria-pressed={selected === agent.id} onClick={() => select(agent, project)}><span className={["cj-agent-map__orb", agent.status === "attention" && "cj-agent-map__attention-ring"].filter(Boolean).join(" ")}><AiRobot size={24} tone={TONES[agent.status]} variant={robotVariant} paused={agent.status !== "working"} /></span><strong>{agent.name}</strong><small>{LABELS[agent.status]}</small></button>)}
              {open && !orbit && <span className="cj-agent-map__overflow">See agents below</span>}
            </div>;
          })}
          {focused && expandedProject && <button type="button" className="cj-agent-map__exit-focus" style={{ left: scrollLeft + 14 }} onClick={() => toggle(expandedProject)}>← All projects</button>}
        </div></ScrollArea>}
        {!loading && !narrow && expandedProject && expandedProject.agents.length > MAX_FOCUS_AGENTS && <div className="cj-agent-map__list">{agentList(expandedProject)}</div>}
      </div>
      {!loading && projects.length > 0 && <div className="cj-agent-map__legend">{(Object.keys(LABELS) as AgentMapStatus[]).map(status => <span key={status}><i style={{ background: COLORS[status] }} />{LABELS[status]}</span>)}</div>}
    </Panel>
    {!loading && projects.length > 0 && <div className="cj-agent-map__inspector" aria-hidden={!selection} inert={!selection}><div className="cj-agent-map__inspector-inner"><Panel variant={detailsVariant} tone={detailsTone} scrollable={false} className="cj-agent-map__details">{selection && <><div className="cj-agent-map__eyebrow">{inspectorTitle}</div><h3 className="cj-agent-map__details-name"><AiRobot size={24} tone={TONES[selection.agent.status]} variant={robotVariant} paused={selection.agent.status !== "working"} />{selection.agent.name}</h3><p>{selection.project.name}</p><span className="cj-agent-map__status"><i style={{ background: COLORS[selection.agent.status] }} />{LABELS[selection.agent.status]}</span><div className="cj-agent-map__activity"><small>Current activity</small><p>{selection.agent.activity}</p></div>{renderAgentDetails?.(selection.agent, selection.project)}</>}</Panel></div></div>}
  </div>;
}

export default AgentMap;
