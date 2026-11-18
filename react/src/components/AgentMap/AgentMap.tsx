import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Panel, { type PanelTone, type PanelVariant } from "../Panel";
import type { TrueColor } from "../../theme/Theme";
import { AiRobot } from "../AiRobot";
import { GridBackground, type GridBackgroundProps } from "../GridBackground";
import { ScrollArea } from "../ScrollArea";
import EmptyState from "../EmptyState";
import { agentPositions, layoutProjectsHorizontally, scatterProjects, type MapCircle } from "./layout";
import "./agent-map.css";

export type AgentMapStatus = "working" | "attention" | "idle" | "completed";
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
  /** Configure the grid or hide it with false. */
  grid?: false | Pick<GridBackgroundProps, "size" | "lineColor" | "opacity" | "fade" | "fadeStart">;
  /** Surface variants for the map, details, and project/agent lists. */
  panelVariant?: PanelVariant;
  detailsVariant?: PanelVariant;
  listVariant?: PanelVariant;
  /** Surface tones for the map, details, and project/agent lists. */
  panelTone?: PanelTone;
  detailsTone?: PanelTone;
  listTone?: PanelTone;
  /** Theme colors for the grid lines and ambient background glow. */
  gridTone?: TrueColor;
  glowTone?: TrueColor;
  /** Override the empty-project view or the message shown when nothing is working. */
  emptyProjects?: ReactNode;
  noActiveAgentsMessage?: ReactNode;
  /** Title shown above the selected agent's details. */
  inspectorTitle?: ReactNode;
  /** Fill the height of a parent with a defined height. */
  fullHeight?: boolean;
  /** Fill the available width. @default true */
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
}

const COLORS: Record<AgentMapStatus, string> = { working: "#44c9e3", attention: "#efb65f", idle: "#8a9ba9", completed: "#53c994" };
const TONES = { working: "cyan", attention: "amber", idle: "neutral", completed: "green" } as const;
const LABELS: Record<AgentMapStatus, string> = { working: "Working", attention: "Needs attention", idle: "Idle", completed: "Completed" };
const MAX_ORBIT_AGENTS = 12;
const MAX_FOCUS_AGENTS = 20;
const EXPANDED_RADIUS = 164;
const COLLAPSED_RADIUS = 62;

export function AgentMap({ projects, expandedProjectId, defaultExpandedProjectId = null, onExpandedProjectChange, selectedAgentId, defaultSelectedAgentId = null, onAgentSelect, onSelectionClear, renderAgentDetails, ariaLabel = "Agent activity", live = false, scattered = false, grid, panelVariant = "elevated", detailsVariant = "elevated", listVariant = "subtle", panelTone = "none", detailsTone = "none", listTone = "none", gridTone, glowTone, emptyProjects, noActiveAgentsMessage, inspectorTitle = "Inspector", fullHeight = false, fullWidth = true, className, style }: AgentMapProps) {
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
    const measure = () => { const w = el.getBoundingClientRect().width; if (w > 0) setStacked(w < 800); };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure); observer.observe(el);
    return () => observer.disconnect();
  }, []);
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
  function toggle(project: AgentMapProject) { const next = expanded === project.id ? null : project.id; if (selection) { if (selectedAgentId === undefined) setInternalSelected(null); onSelectionClear?.(); } if (expandedProjectId === undefined) setInternalExpanded(next); onExpandedProjectChange?.(next); }
  function select(agent: AgentMapAgent, project: AgentMapProject) { if (selectedAgentId === undefined) setInternalSelected(agent.id); onAgentSelect?.(agent, project); }
  function agentList(project: AgentMapProject) { return <Panel variant={listVariant} tone={listTone} padding="sm" scrollable={false} flexBody className="cj-agent-map__agent-list"><div className="cj-agent-map__list-heading"><strong>{project.name} agents</strong><span>{project.agents.length} total</span></div><ScrollArea variant="auto" horizontal={false} className="cj-agent-map__list-scroll" aria-label={`${project.name} agents`}><div className="cj-agent-map__list-rows">{project.agents.length === 0 && <p className="cj-agent-map__list-empty">No agents assigned to this project.</p>}{project.agents.map(agent => <button type="button" className="cj-agent-map__list-agent" key={agent.id} aria-pressed={selected === agent.id} onClick={() => select(agent, project)}><span className={["cj-agent-map__list-avatar", agent.status === "attention" && "cj-agent-map__attention-ring"].filter(Boolean).join(" ")} style={{ "--agent-color": COLORS[agent.status] } as CSSProperties}><AiRobot size={26} tone={TONES[agent.status]} paused={agent.status !== "working"} /></span><span className="cj-agent-map__list-content"><strong>{agent.name}</strong><small>{agent.activity}</small></span><span className="cj-agent-map__list-status"><i style={{ background: COLORS[agent.status] }} />{LABELS[agent.status]}</span></button>)}</div></ScrollArea></Panel>; }
  const inactiveMessage = noActiveAgentsMessage === undefined ? (agents.length === 0 ? "No agents are assigned to these projects yet." : "No agents are currently working.") : noActiveAgentsMessage;
  return <div ref={rootRef} className={["cj-agent-map", (stacked || projects.length === 0) && "cj-agent-map--stacked", selection && "cj-agent-map--inspector-open", fullHeight && "cj-agent-map--full-height", fullWidth ? "cj-agent-map--full-width" : "cj-agent-map--intrinsic-width", className].filter(Boolean).join(" ")} style={style}>
    <Panel variant={panelVariant} tone={panelTone} padding="none" scrollable={false} flexBody className="cj-agent-map__panel">
      <div className="cj-agent-map__header"><strong>{ariaLabel}</strong>{live && <span className="cj-agent-map__live">● Live</span>}<span className="cj-agent-map__counts">{activeCount} active · {projects.length} projects · {attentionCount} need attention</span></div>
      <div ref={viewportRef} className="cj-agent-map__viewport" style={{ ...(gridTone ? { "--cj-agent-map-grid-color": `var(--color-${gridTone}-500)` } : {}), ...(glowTone ? { "--cj-agent-map-glow-color": `var(--color-${glowTone}-500)` } : {}) } as CSSProperties}>
        {grid !== false && <GridBackground size={32} lineColor="var(--cj-agent-map-grid-color, currentColor)" opacity={0.12} fade="radial" {...grid} />}
        {projects.length > 0 && activeCount === 0 && inactiveMessage != null && <div className="cj-agent-map__inactive" role="status">{inactiveMessage}</div>}
        {projects.length === 0 ? <div className="cj-agent-map__empty">{emptyProjects === undefined ? <EmptyState variant="plain" dashed={false} icon={<AiRobot size="md" tone={glowTone ?? "cyan"} paused />} iconBackground={false} title="No projects to display" subtitle="Agent activity will appear here when projects are available." /> : emptyProjects}</div> : narrow ? <div className="cj-agent-map__list"><ScrollArea horizontal={false} className="cj-agent-map__projects-scroll" aria-label="Projects"><Panel variant={listVariant} tone={listTone} padding="sm" scrollable={false} className="cj-agent-map__project-list"><div className="cj-agent-map__list-heading"><strong>Projects</strong><span>{projects.length} total</span></div><div className="cj-agent-map__project-rows">{projects.map(project => { const attention = project.agents.filter(agent => agent.status === "attention").length; const completed = project.agents.filter(agent => agent.status === "completed").length; const working = project.agents.some(agent => agent.status === "working"); const color = attention ? COLORS.attention : completed === project.agents.length && completed > 0 ? COLORS.completed : working ? COLORS.working : COLORS.idle; return <div key={project.id}><button type="button" className="cj-agent-map__list-project" title={project.name} aria-expanded={expanded === project.id} onClick={() => toggle(project)}><span className={["cj-agent-map__project-avatar", attention && "cj-agent-map__attention-ring"].filter(Boolean).join(" ")} style={{ "--agent-color": color } as CSSProperties} aria-hidden="true">{project.name.slice(0, 1).toUpperCase()}</span><span className="cj-agent-map__list-content"><strong>{project.name}</strong><small>{project.agents.length} agents</small></span><span className="cj-agent-map__list-status"><i style={{ background: color }} />{attention ? `${attention} need attention` : completed === project.agents.length && completed > 0 ? "Completed" : working ? "Working" : project.agents.length ? "Idle" : "No agents"}</span><span className="cj-agent-map__project-chevron" aria-hidden="true">{expanded === project.id ? "⌃" : "⌄"}</span></button>{expanded === project.id && agentList(project)}</div>; })}</div></Panel></ScrollArea></div> : <ScrollArea vertical={false} variant="auto" className="cj-agent-map__orbs-scroll" contentClassName="cj-agent-map__orbs-content" viewportRef={orbsViewportRef} aria-label="Project map" style={{ height: graphHeight }}><div className="cj-agent-map__canvas" style={{ width: canvasWidth, height: graphHeight }}>
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
              {orbit && project.agents.map((agent, j) => <button key={agent.id} type="button" className="cj-agent-map__agent" style={{ left: points[j].x, top: points[j].y, "--agent-color": COLORS[agent.status], "--agent-scale": scale } as CSSProperties} aria-label={`${agent.name}, ${project.name}, ${LABELS[agent.status]}: ${agent.activity}`} aria-pressed={selected === agent.id} onClick={() => select(agent, project)}><span className={["cj-agent-map__orb", agent.status === "attention" && "cj-agent-map__attention-ring"].filter(Boolean).join(" ")}><AiRobot size={24} tone={TONES[agent.status]} paused={agent.status !== "working"} /></span><strong>{agent.name}</strong><small>{LABELS[agent.status]}</small></button>)}
              {open && !orbit && <span className="cj-agent-map__overflow">See agents below</span>}
            </div>;
          })}
          {focused && expandedProject && <button type="button" className="cj-agent-map__exit-focus" style={{ left: scrollLeft + 14 }} onClick={() => toggle(expandedProject)}>← All projects</button>}
        </div></ScrollArea>}
        {!narrow && expandedProject && expandedProject.agents.length > MAX_FOCUS_AGENTS && <div className="cj-agent-map__list">{agentList(expandedProject)}</div>}
      </div>
      {projects.length > 0 && <div className="cj-agent-map__legend">{(Object.keys(LABELS) as AgentMapStatus[]).map(status => <span key={status}><i style={{ background: COLORS[status] }} />{LABELS[status]}</span>)}</div>}
    </Panel>
    {projects.length > 0 && <div className="cj-agent-map__inspector" aria-hidden={!selection} inert={!selection}><div className="cj-agent-map__inspector-inner"><Panel variant={detailsVariant} tone={detailsTone} scrollable={false} className="cj-agent-map__details">{selection && <><div className="cj-agent-map__eyebrow">{inspectorTitle}</div><h3>{selection.agent.name}</h3><p>{selection.project.name}</p><span className="cj-agent-map__status"><i style={{ background: COLORS[selection.agent.status] }} />{LABELS[selection.agent.status]}</span><div className="cj-agent-map__activity"><small>Current activity</small><p>{selection.agent.activity}</p></div>{renderAgentDetails?.(selection.agent, selection.project)}</>}</Panel></div></div>}
  </div>;
}

export default AgentMap;
