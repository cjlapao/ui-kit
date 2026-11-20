import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AgentMap, type AgentMapProject } from "./AgentMap";
import { layoutProjects, layoutProjectsHorizontally, scatterProjects } from "./layout";

const projects: AgentMapProject[] = [{ id: "atlas", name: "Atlas", agents: [{ id: "builder", name: "Builder", activity: "Writing code", status: "working" }, { id: "reviewer", name: "Reviewer", activity: "Waiting for approval", status: "attention" }] }, { id: "orbit", name: "Orbit", agents: [{ id: "done", name: "Tester", activity: "Tests passed", status: "completed" }] }];

describe("AgentMap", () => {
  it("retains the full project title for tooltips and assistive technology", () => {
    const name = "A very long project title with SupercalifragilisticUnbrokenIdentifier";
    const project: AgentMapProject = { id: "long", name, agents: [] };
    render(<AgentMap projects={[project]} />);
    const hub = screen.getByRole("button", { name: `${name}, 0 agents` });
    expect(hub.getAttribute("title")).toBe(name);
    expect(hub.querySelector("strong")?.textContent).toBe(name);
  });
  it("shows a dedicated empty-project state and restores the map when projects arrive", () => {
    const { rerender } = render(<AgentMap projects={[]} />);
    expect(screen.getByText("No projects to display")).toBeTruthy();
    expect(screen.queryByText("Selected agent")).toBeNull();
    rerender(<AgentMap projects={projects} />);
    expect(screen.queryByText("No projects to display")).toBeNull();
    expect(screen.getByRole("button", { name: /Atlas, 2 agents/ })).toBeTruthy();
  });
  it("reports no working agents without hiding completed or attention-needed work", () => {
    const inactive: AgentMapProject[] = [{ id: "a", name: "Atlas", agents: [{ id: "review", name: "Reviewer", status: "attention", activity: "Waiting for approval" }, { id: "done", name: "Builder", status: "completed", activity: "Finished" }] }];
    render(<AgentMap projects={inactive} defaultExpandedProjectId="a" />);
    expect(screen.getByRole("status").textContent).toBe("No agents are currently working.");
    expect(screen.getByRole("button", { name: /Reviewer, Atlas, Needs attention/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Builder, Atlas, Completed/ })).toBeTruthy();
  });
  it("distinguishes projects with no assigned agents and supports custom empty copy", () => {
    const unassigned: AgentMapProject[] = [{ id: "new", name: "New project", agents: [] }];
    const { rerender } = render(<AgentMap projects={unassigned} />);
    expect(screen.getByRole("status").textContent).toBe("No agents are assigned to these projects yet.");
    expect(screen.getByRole("button", { name: /New project, 0 agents/ })).toBeTruthy();
    rerender(<AgentMap projects={unassigned} noActiveAgentsMessage="Nothing running" />);
    expect(screen.getByRole("status").textContent).toBe("Nothing running");
    rerender(<AgentMap projects={[]} emptyProjects={<span>Custom empty view</span>} />);
    expect(screen.getByText("Custom empty view")).toBeTruthy();
  });
  it("expands projects and selects an agent", () => {
    render(<AgentMap projects={projects} />);
    fireEvent.click(screen.getByRole("button", { name: /Atlas, 2 agents/ }));
    fireEvent.click(screen.getByRole("button", { name: /Reviewer, Atlas/ }));
    expect(screen.getByText("Waiting for approval")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Reviewer, Atlas/ }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: /Reviewer, Atlas/ }).querySelector(".cj-agent-map__attention-ring")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Builder, Atlas/ }).querySelector(".cj-agent-map__attention-ring")).toBeNull();
  });
  it("supports controlled expansion and selection", () => {
    const onExpandedProjectChange = vi.fn(); const onAgentSelect = vi.fn();
    render(<AgentMap projects={projects} expandedProjectId="atlas" selectedAgentId={null} onExpandedProjectChange={onExpandedProjectChange} onAgentSelect={onAgentSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /Atlas, 2 agents/ }));
    expect(onExpandedProjectChange).toHaveBeenCalledWith(null);
    fireEvent.click(screen.getByRole("button", { name: /Builder, Atlas/ }));
    expect(onAgentSelect).toHaveBeenCalledWith(projects[0].agents[0], projects[0]);
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("opens the inspector for a valid selection and hides it again when cleared", () => {
    const { container, rerender } = render(<AgentMap projects={projects} selectedAgentId={null} inspectorTitle="Agent details" />);
    const inspector = container.querySelector(".cj-agent-map__inspector")!;
    expect(inspector.getAttribute("aria-hidden")).toBe("true");
    expect(inspector.hasAttribute("inert")).toBe(true);
    expect(screen.queryByText("Agent details")).toBeNull();
    rerender(<AgentMap projects={projects} selectedAgentId="reviewer" inspectorTitle="Agent details" />);
    expect(inspector.getAttribute("aria-hidden")).toBe("false");
    expect(inspector.hasAttribute("inert")).toBe(false);
    expect(screen.getByText("Agent details")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Reviewer" })).toBeTruthy();
    // The agent name carries the robot glyph; solid is the default variant.
    expect(screen.getByRole("heading", { name: "Reviewer" }).querySelector("svg")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Reviewer" }).querySelector("[mask]")).toBeTruthy();
    rerender(<AgentMap projects={projects} selectedAgentId="reviewer" inspectorTitle="Agent details" robotVariant="outline" />);
    expect(screen.getByRole("heading", { name: "Reviewer" }).querySelector("[mask]")).toBeNull();
    rerender(<AgentMap projects={projects} selectedAgentId="missing" />);
    expect(inspector.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByText("Agent details")).toBeNull();
  });
  it("uses Inspector as the default title", () => {
    render(<AgentMap projects={projects} defaultSelectedAgentId="builder" />);
    expect(screen.getByText("Inspector")).toBeTruthy();
  });
  it("dismisses the inspector on outside clicks but keeps it open inside the inspector", () => {
    const { container } = render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" defaultSelectedAgentId="builder" />);
    fireEvent.pointerDown(screen.getByText("Current activity"));
    fireEvent.pointerUp(screen.getByText("Current activity"));
    expect(screen.getByText("Inspector")).toBeTruthy();
    fireEvent.pointerDown(screen.getByRole("button", { name: /Reviewer, Atlas/ }));
    fireEvent.pointerUp(screen.getByRole("button", { name: /Reviewer, Atlas/ }));
    fireEvent.click(screen.getByRole("button", { name: /Reviewer, Atlas/ }));
    expect(screen.getByRole("heading", { name: "Reviewer" })).toBeTruthy();
    fireEvent.pointerDown(container.querySelector(".cj-agent-map__canvas")!);
    fireEvent.pointerUp(container.querySelector(".cj-agent-map__canvas")!);
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("opens the other project's agents and clears the prior selection", () => {
    render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" defaultSelectedAgentId="builder" />);
    fireEvent.click(screen.getByRole("button", { name: /Orbit, 1 agents/ }));
    expect(screen.getByRole("button", { name: /Tester, Orbit/ })).toBeTruthy();
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("requests clearing controlled selection on an outside click", () => {
    const onSelectionClear = vi.fn();
    const { rerender } = render(<AgentMap projects={projects} selectedAgentId="builder" onSelectionClear={onSelectionClear} />);
    fireEvent.pointerDown(document.body);
    fireEvent.pointerUp(document.body);
    expect(onSelectionClear).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Inspector")).toBeTruthy();
    rerender(<AgentMap projects={projects} selectedAgentId={null} onSelectionClear={onSelectionClear} />);
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("requests clearing controlled selection when changing projects", () => {
    const onSelectionClear = vi.fn();
    const onExpandedProjectChange = vi.fn();
    render(<AgentMap projects={projects} selectedAgentId="builder" expandedProjectId="atlas" onSelectionClear={onSelectionClear} onExpandedProjectChange={onExpandedProjectChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Orbit, 1 agents/ }));
    expect(onSelectionClear).toHaveBeenCalledTimes(1);
    expect(onExpandedProjectChange).toHaveBeenCalledWith("orbit");
  });
  it("offers a project list in a narrow container", () => {
    const measure = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 320 } as DOMRect);
    try {
      render(<AgentMap projects={projects} />);
      fireEvent.click(screen.getByRole("button", { name: /Atlas/ }));
      expect(screen.getByRole("button", { name: /Atlas/ }).querySelector(".cj-agent-map__attention-ring")).toBeTruthy();
      expect(screen.getByRole("button", { name: /Reviewer.*Needs attention/ }).querySelector(".cj-agent-map__attention-ring")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: /Reviewer.*Needs attention/ }));
      expect(screen.getByRole("heading", { name: "Reviewer" })).toBeTruthy();
    } finally { measure.mockRestore(); }
  });
  it("never breaks on height — a short full-height container keeps the map", () => {
    const measure = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 800, height: 180 } as DOMRect);
    try {
      const { container } = render(<AgentMap projects={projects} fullHeight />);
      expect(container.querySelector(".cj-agent-map__orbs-scroll")).toBeTruthy();
      expect(container.querySelector(".cj-agent-map__projects-scroll")).toBeNull();
    } finally { measure.mockRestore(); }
  });
  it("lets narrowBelow retarget the compact-list break", () => {
    const measure = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 360 } as DOMRect);
    try {
      const { container, rerender } = render(<AgentMap projects={projects} />);
      expect(container.querySelector(".cj-agent-map__projects-scroll")).toBeTruthy();
      rerender(<AgentMap projects={projects} narrowBelow={300} />);
      expect(container.querySelector(".cj-agent-map__projects-scroll")).toBeNull();
      expect(container.querySelector(".cj-agent-map__orbs-scroll")).toBeTruthy();
    } finally { measure.mockRestore(); }
  });
  it("applies the requested panel variants", () => {
    const measure = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 320 } as DOMRect);
    try {
      const { container } = render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" panelVariant="outlined" detailsVariant="simple" listVariant="subtle" panelTone="blue" detailsTone="rose" listTone="green" />);
      expect(container.querySelector(".cj-agent-map__panel")?.getAttribute("data-variant")).toBe("outlined");
      expect(container.querySelector(".cj-agent-map__details")?.getAttribute("data-variant")).toBe("simple");
      expect(container.querySelector(".cj-agent-map__project-list")?.getAttribute("data-variant")).toBe("subtle");
      expect(container.querySelector(".cj-agent-map__agent-list")?.getAttribute("data-variant")).toBe("subtle");
      expect(container.querySelector(".cj-agent-map__panel")?.getAttribute("data-tone")).toBe("blue");
      expect(container.querySelector(".cj-agent-map__details")?.getAttribute("data-tone")).toBe("rose");
      expect(container.querySelector(".cj-agent-map__project-list")?.getAttribute("data-tone")).toBe("green");
      expect(container.querySelector(".cj-agent-map__agent-list")?.getAttribute("data-tone")).toBe("green");
    } finally { measure.mockRestore(); }
  });
  it("applies independent grid and glow tones and honors a custom grid color", () => {
    const { container, rerender } = render(<AgentMap projects={projects} gridTone="blue" glowTone="rose" />);
    const viewport = container.querySelector(".cj-agent-map__viewport") as HTMLElement;
    expect(viewport.style.getPropertyValue("--cj-agent-map-grid-color")).toBe("var(--color-blue-500)");
    expect(viewport.style.getPropertyValue("--cj-agent-map-glow-color")).toBe("var(--color-rose-500)");
    const grid = viewport.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(grid.style.backgroundImage).toContain("--cj-agent-map-grid-color");
    rerender(<AgentMap projects={projects} gridTone="blue" glowTone="rose" grid={{ lineColor: "red" }} />);
    expect((viewport.querySelector('[aria-hidden="true"]') as HTMLElement).style.backgroundImage).toContain("red");
  });
  it("renders the map lattice as dots by default and lines when asked", () => {
    const { container, rerender } = render(<AgentMap projects={projects} />);
    const lattice = () => (container.querySelector(".cj-agent-map__viewport [aria-hidden='true']") as HTMLElement).style.backgroundImage;
    // NetworkGraph parity: dots on a 32px lattice are the default.
    expect(lattice()).toContain("radial-gradient(circle at 0 0");
    expect(lattice()).toContain("1.5px");
    rerender(<AgentMap projects={projects} grid={{ pattern: "grid" }} />);
    expect(lattice()).toContain("linear-gradient");
  });
  it("lists agents when an expanded project has more than twenty", () => {
    const large: AgentMapProject = { id: "large", name: "Large", agents: Array.from({ length: 21 }, (_, i) => ({ id: `agent-${i}`, name: `Agent ${i}`, activity: "Working", status: "working" })) };
    render(<AgentMap projects={[large]} defaultExpandedProjectId="large" />);
    expect(document.querySelector(".cj-agent-map__agent-list [data-slot='scrollarea-viewport']")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Agent 8/ }));
    expect(screen.getByRole("heading", { name: "Agent 8" })).toBeTruthy();
  });
  it("focuses a large project and returns to the project overview", () => {
    const large: AgentMapProject = { id: "large", name: "Large", agents: Array.from({ length: 14 }, (_, i) => ({ id: `agent-${i}`, name: `Agent ${i}`, activity: "Working", status: "working" })) };
    render(<AgentMap projects={[...projects, large]} defaultExpandedProjectId="large" />);
    fireEvent.click(screen.getByRole("button", { name: /Agent 13, Large/ }));
    expect(screen.getByRole("heading", { name: "Agent 13" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "← All projects" }));
    expect(screen.getByRole("button", { name: /Atlas, 2 agents/ })).toBeTruthy();
  });
  it("keeps a ten-agent project on the map with scaled orbs", () => {
    const medium: AgentMapProject = { id: "medium", name: "Medium", agents: Array.from({ length: 10 }, (_, i) => ({ id: `medium-${i}`, name: `Agent ${i}`, activity: "Working", status: "working" })) };
    const { container } = render(<AgentMap projects={[medium]} defaultExpandedProjectId="medium" />);
    expect(screen.getByRole("button", { name: /Agent 9, Medium/ })).toBeTruthy();
    expect(container.querySelectorAll(".cj-agent-map__orb")).toHaveLength(10);
    expect(container.querySelector(".cj-agent-map__agent")?.getAttribute("style")).toContain("--agent-scale: 0.8");
    expect(screen.queryByRole("button", { name: "← All projects" })).toBeNull();
  });
  it("packs full project footprints inside the available width without overlap", () => {
    for (const width of [400, 600, 1000]) {
      const { circles, height } = layoutProjects([{ id: "a", radius: 62 }, { id: "b", radius: 164 }, { id: "c", radius: 62 }, { id: "d", radius: 62 }], width);
      for (const [i, a] of circles.entries()) {
        expect(a.x - a.radius).toBeGreaterThanOrEqual(0); expect(a.x + a.radius).toBeLessThanOrEqual(width);
        expect(a.y + a.radius).toBeLessThanOrEqual(height);
        for (const b of circles.slice(i + 1)) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(a.radius + b.radius);
      }
    }
  });
  it("grows the project layout horizontally without crossing its height or overlapping", () => {
    const items = Array.from({ length: 14 }, (_, i) => ({ id: `project-${i}`, radius: i === 3 ? 164 : 62 }));
    for (const scattered of [false, true]) {
      const { circles, width } = layoutProjectsHorizontally(items, 420, 18, scattered);
      expect(width).toBeGreaterThan(420);
      for (const [i, circle] of circles.entries()) {
        expect(circle.x - circle.radius).toBeGreaterThanOrEqual(0);
        expect(circle.x + circle.radius).toBeLessThanOrEqual(width);
        expect(circle.y - circle.radius).toBeGreaterThanOrEqual(0);
        expect(circle.y + circle.radius).toBeLessThanOrEqual(420);
        for (const other of circles.slice(i + 1)) expect(Math.hypot(circle.x - other.x, circle.y - other.y)).toBeGreaterThanOrEqual(circle.radius + other.radius);
      }
    }
  });
  it("uses a horizontal-only ScrollArea and exposes sizing options", () => {
    const { container } = render(<AgentMap projects={projects} fullHeight fullWidth={false} />);
    const root = container.querySelector(".cj-agent-map")!;
    expect(root.classList.contains("cj-agent-map--full-height")).toBe(true);
    expect(root.classList.contains("cj-agent-map--intrinsic-width")).toBe(true);
    const scroll = container.querySelector(".cj-agent-map__orbs-scroll")!;
    expect(scroll.querySelector('[data-slot="scrollarea-viewport"]')?.getAttribute("style")).toContain("overflow-y: hidden");
    expect(scroll.querySelector('[data-orientation="vertical"]')).toBeNull();
    expect(scroll.querySelector('[data-orientation="horizontal"]')).toBeTruthy();
  });
  it("scatters busy project layouts deterministically without collisions", () => {
    const items = ["atlas", "horizon", "orbit", "northstar", "meridian", "lumen", "canvas", "beacon"].map((id, i) => ({ id, radius: i === 3 ? 164 : 62 }));
    for (const width of [400, 650, 1000]) {
      const result = layoutProjects(items, width, 18, true);
      expect(result).toEqual(layoutProjects(items, width, 18, true));
      expect(result.circles).not.toEqual(layoutProjects(items, width, 18, false).circles);
      for (const [i, circle] of result.circles.entries()) {
        expect(circle.x - circle.radius).toBeGreaterThanOrEqual(0);
        expect(circle.x + circle.radius).toBeLessThanOrEqual(width);
        expect(circle.y - circle.radius).toBeGreaterThanOrEqual(0);
        expect(circle.y + circle.radius).toBeLessThanOrEqual(result.height);
        for (const other of result.circles.slice(i + 1)) expect(Math.hypot(circle.x - other.x, circle.y - other.y)).toBeGreaterThanOrEqual(circle.radius + other.radius);
      }
    }
  });

  const insideBox = (circles: { radius: number; x: number; y: number }[], width: number, height: number) => {
    for (const [i, circle] of circles.entries()) {
      expect(circle.x - circle.radius).toBeGreaterThanOrEqual(-0.05);
      expect(circle.x + circle.radius).toBeLessThanOrEqual(width + 0.05);
      expect(circle.y - circle.radius).toBeGreaterThanOrEqual(-0.05);
      expect(circle.y + circle.radius).toBeLessThanOrEqual(height + 0.05);
      for (const other of circles.slice(i + 1)) expect(Math.hypot(circle.x - other.x, circle.y - other.y)).toBeGreaterThanOrEqual(circle.radius + other.radius - 0.05);
    }
  };

  it("fills the whole scatter box leaving no empty quadrant", () => {
    const items = ["atlas", "horizon", "orbit", "northstar", "meridian", "lumen", "canvas", "beacon", "quartz", "delta", "vertex", "prism"].map(id => ({ id, radius: 62 }));
    const width = 1200, height = 420;
    const result = scatterProjects(items, width, height, 18);
    expect(result.scale).toBe(1);
    expect(result.width).toBe(width);
    insideBox(result.circles, width, height);
    const quadrants = [0, 0, 0, 0];
    for (const circle of result.circles) quadrants[(circle.y < height / 2 ? 0 : 2) + (circle.x < width / 2 ? 0 : 1)] += 1;
    expect(quadrants.every(count => count > 0)).toBe(true);
    const xs = result.circles.map(circle => circle.x), ys = result.circles.map(circle => circle.y);
    expect(Math.min(...xs)).toBeLessThanOrEqual(150);
    expect(Math.max(...xs)).toBeGreaterThanOrEqual(width - 150);
    expect(Math.min(...ys)).toBeLessThanOrEqual(150);
    expect(Math.max(...ys)).toBeGreaterThanOrEqual(height - 150);
  });
  it("scatters deterministically so repeated layouts are identical", () => {
    const items = ["atlas", "horizon", "orbit", "northstar", "meridian"].map(id => ({ id, radius: 62 }));
    expect(scatterProjects(items, 900, 420, 18)).toEqual(scatterProjects(items, 900, 420, 18));
  });
  it("shrinks the scattered group as one when the box cannot hold full hubs", () => {
    const items = Array.from({ length: 20 }, (_, i) => ({ id: `project-${i}`, radius: 62 }));
    const result = scatterProjects(items, 700, 420, 18);
    expect(result.scale).toBeLessThan(1);
    expect(result.scale).toBeGreaterThanOrEqual(0.7);
    expect(result.width).toBeGreaterThanOrEqual(700);
    insideBox(result.circles, result.width, 420);
  });
  it("never scales scattered hubs beyond full size when they fit", () => {
    const items = Array.from({ length: 4 }, (_, i) => ({ id: `project-${i}`, radius: 62 }));
    const result = scatterProjects(items, 1000, 420, 18);
    expect(result.scale).toBe(1);
    expect(result.width).toBe(1000);
  });
  it("keeps an expanded footprint at full size while neighbours shrink", () => {
    const items = [{ id: "expanded", radius: 164 }, ...Array.from({ length: 18 }, (_, i) => ({ id: `project-${i}`, radius: 62 }))];
    const result = scatterProjects(items, 700, 420, 18);
    expect(result.scale).toBeLessThan(1);
    expect(result.circles.find(circle => circle.id === "expanded")?.radius).toBe(164);
    insideBox(result.circles, result.width, 420);
  });
  it("falls back to the compact pack when even the scale floor cannot fit", () => {
    const items = Array.from({ length: 60 }, (_, i) => ({ id: `project-${i}`, radius: 62 }));
    const result = scatterProjects(items, 400, 420, 18);
    expect(result.scale).toBe(1);
    expect(result.width).toBeGreaterThan(400);
    insideBox(result.circles, result.width, 420);
  });
  it("applies the scatter scale to hubs and overflow labels", () => {
    const many: AgentMapProject[] = Array.from({ length: 20 }, (_, i) => ({ id: `busy-${i}`, name: `Busy ${i}`, agents: [{ id: `agent-${i}`, name: `Agent ${i}`, activity: "Working", status: "working" as const }] }));
    const { container } = render(<AgentMap projects={many} scattered />);
    const expected = scatterProjects(many.map(project => ({ id: project.id, radius: 62 })), 720, 420, 18);
    expect(expected.scale).toBeLessThan(1);
    const hub = container.querySelector(".cj-agent-map__hub") as HTMLElement;
    expect(hub.getAttribute("style")).toContain(`--hub-scale: ${expected.scale}`);
    const project = container.querySelector(".cj-agent-map__project") as HTMLElement;
    expect(project.getAttribute("style")).toContain(`--overflow-offset: ${58 * expected.scale}px`);
  });
  it("adds no phantom horizontal scroll when scattered hubs fit the panel", () => {
    const few: AgentMapProject[] = Array.from({ length: 8 }, (_, i) => ({ id: `easy-${i}`, name: `Easy ${i}`, agents: [{ id: `helper-${i}`, name: `Helper ${i}`, activity: "Working", status: "working" as const }] }));
    const { container } = render(<AgentMap projects={few} scattered />);
    const canvas = container.querySelector(".cj-agent-map__canvas") as HTMLElement;
    expect(canvas.style.width).toBe("720px");
  });
});

describe("AgentMap inspector docking", () => {
  /** Render at a fixed component width and report whether the inspector stacked. */
  const stackedAt = (width: number, extra: Partial<Parameters<typeof AgentMap>[0]> = {}) => {
    const callbacks: (() => void)[] = [];
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ width, height: 420, x: 0, y: 0, top: 0, left: 0, right: width, bottom: 420, toJSON() {} }));
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: () => void) { callbacks.push(callback); }
      observe() {}
      disconnect() {}
    });
    const { container } = render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" {...extra} />);
    act(() => callbacks.forEach((callback) => callback()));
    return !!container.querySelector(".cj-agent-map--stacked");
  };

  // Docked while the map keeps its 360px floor beside 280px + 16px gap = 656; the
  // old fixed 800px rule stacked here, which is why the docs playground always
  // showed the inspector under the map.
  it("docks the inspector beside the map once the map keeps its floor", () => {
    expect(stackedAt(700)).toBe(false);
    expect(stackedAt(600)).toBe(true);
  });
  it("honours inspectorMinMainWidth and the inspectorStackBelow override", () => {
    expect(stackedAt(700, { inspectorMinMainWidth: 600 })).toBe(true);
    expect(stackedAt(600, { inspectorStackBelow: 0 })).toBe(false);
    expect(stackedAt(1200, { inspectorStackBelow: 1400 })).toBe(true);
  });
});

describe("AgentMap loading", () => {
  it("marks the map busy and pins a Loader overlay over the map while loading", () => {
    const { container } = render(<AgentMap projects={projects} loading loadingMessage="Loading fleet…" />);
    expect(container.querySelector(".cj-agent-map__viewport")?.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByText("Loading fleet…")).toBeTruthy();
    // Overlay mode keeps the map behind the scrim, like Table.
    expect(screen.getByRole("button", { name: /Atlas, 2 agents/ })).toBeTruthy();
  });
  it("draws a determinate progress bar for the progress loader", () => {
    render(<AgentMap projects={projects} loading loaderType="progress" loaderProgress={40} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("40");
  });
  it("replaces the map with pulsing hub placeholders in skeleton mode", () => {
    const { container } = render(<AgentMap projects={projects} loading loaderType="skeleton" skeletonProjects={4} />);
    expect(container.querySelectorAll(".cj-agent-map__skeleton-hub")).toHaveLength(4);
    expect(container.querySelector(".cj-agent-map__skeleton")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("button", { name: /Atlas, 2 agents/ })).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    // No stale counts, legend, or inspector while the fleet is loading.
    expect(screen.queryByText(/active · \d+ projects/)).toBeNull();
    expect(container.querySelector(".cj-agent-map__legend")).toBeNull();
    expect(container.querySelector(".cj-agent-map__inspector")).toBeNull();
  });
  it("draws one hub floor and hides the empty state while a skeleton loads", () => {
    const { container } = render(<AgentMap projects={[]} loading loaderType="skeleton" skeletonProjects={0} />);
    expect(container.querySelectorAll(".cj-agent-map__skeleton-hub")).toHaveLength(1);
    expect(screen.queryByText("No projects to display")).toBeNull();
  });
  it("restores the map, counts, legend and inspector when loading ends", () => {
    const { rerender, container } = render(<AgentMap projects={projects} loading loaderType="skeleton" />);
    rerender(<AgentMap projects={projects} />);
    expect(container.querySelector(".cj-agent-map__skeleton")).toBeNull();
    expect(container.querySelector(".cj-agent-map__viewport")?.hasAttribute("aria-busy")).toBe(false);
    expect(screen.getByText("1 active · 2 projects · 1 need attention")).toBeTruthy();
    expect(container.querySelector(".cj-agent-map__legend")).toBeTruthy();
    expect(container.querySelector(".cj-agent-map__inspector")).toBeTruthy();
  });
});

describe("AgentMap empty state", () => {
  it("uses the solid robot by default and the outline robot when asked", () => {
    const { rerender, container } = render(<AgentMap projects={[]} />);
    expect(screen.getByText("No projects to display")).toBeTruthy();
    // The solid variant paints its body through a mask; outline does not.
    expect(container.querySelector(".cj-agent-map__empty [mask]")).toBeTruthy();
    rerender(<AgentMap projects={[]} robotVariant="outline" />);
    expect(container.querySelector(".cj-agent-map__empty [mask]")).toBeNull();
  });
  it("paints agent orbs and list avatars with the solid robot too", () => {
    const { container } = render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" robotVariant="solid" />);
    expect(container.querySelector(".cj-agent-map__orb [mask]")).toBeTruthy();
    const many: AgentMapProject[] = [{ id: "horizon", name: "Horizon", agents: Array.from({ length: 30 }, (_, i) => ({ id: `h${i}`, name: `Agent ${i}`, status: "working" as const, activity: "Working" })) }];
    const list = render(<AgentMap projects={many} defaultExpandedProjectId="horizon" robotVariant="solid" />);
    expect(list.container.querySelector(".cj-agent-map__list-avatar [mask]")).toBeTruthy();
  });
});

describe("AgentMap zoom", () => {
  it("scales the canvas with the zoom pill without resizing the component", () => {
    const { container } = render(<AgentMap projects={projects} />);
    const pill = screen.getByRole("group", { name: "Map zoom controls" });
    const canvas = () => container.querySelector(".cj-agent-map__canvas") as HTMLElement;
    const scroll = () => container.querySelector(".cj-agent-map__orbs-scroll") as HTMLElement;
    const zoomLabel = () => pill.querySelector('[aria-label="Zoom level"]')?.textContent;
    const height = () => scroll().style.height;
    const initialHeight = height();
    expect(initialHeight).toBe("420px");
    expect(zoomLabel()).toBe("100%");
    expect(container.querySelector('[data-orientation="vertical"]')).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(canvas().style.transform).toBe("scale(1.25)");
    expect(zoomLabel()).toBe("125%");
    expect(height()).toBe(initialHeight); // component size never changes with zoom
    expect(container.querySelector('[data-orientation="vertical"]')).not.toBeNull(); // pan while zoomed
    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    expect(canvas().style.transform).toBe("scale(1)");
    expect(container.querySelector('[data-orientation="vertical"]')).toBeNull();
  });
  it("fits the canvas to the viewport and hides controls when zoomable is false", () => {
    const { container, rerender } = render(<AgentMap projects={projects} />);
    fireEvent.click(screen.getByRole("button", { name: "Fit map to view" }));
    expect((container.querySelector(".cj-agent-map__canvas") as HTMLElement).style.transform).toMatch(/^scale\(/);
    rerender(<AgentMap projects={projects} zoomable={false} />);
    expect(screen.queryByRole("group", { name: "Map zoom controls" })).toBeNull();
  });
  it("hides the zoom pill for the empty state", () => {
    render(<AgentMap projects={[]} />);
    expect(screen.queryByRole("group", { name: "Map zoom controls" })).toBeNull();
  });
});

describe("AgentMap drag navigation", () => {
  const mockOverflow = (vp: HTMLElement, sw: number, sh: number) => {
    Object.defineProperty(vp, "scrollWidth", { configurable: true, value: sw });
    Object.defineProperty(vp, "clientWidth", { configurable: true, value: 752 });
    Object.defineProperty(vp, "scrollHeight", { configurable: true, value: sh });
    Object.defineProperty(vp, "clientHeight", { configurable: true, value: 420 });
  };
  it("pans the map by dragging when the content overflows", () => {
    const { container } = render(<AgentMap projects={projects} />);
    const vp = container.querySelector('[data-slot="scrollarea-viewport"]') as HTMLElement;
    const frame = container.querySelector(".cj-agent-map__canvas-frame") as HTMLElement;
    // Nothing overflows in jsdom by default: the drag must stay inert.
    fireEvent.pointerDown(frame, { button: 0, pointerId: 1, clientX: 500, clientY: 200 });
    fireEvent.pointerMove(frame, { pointerId: 1, clientX: 400, clientY: 200 });
    fireEvent.pointerUp(frame, { pointerId: 1, clientX: 400, clientY: 200 });
    expect(vp.scrollLeft).toBe(0);
    mockOverflow(vp, 1200, 420);
    fireEvent.pointerDown(frame, { button: 0, pointerId: 2, clientX: 500, clientY: 200 });
    fireEvent.pointerMove(frame, { pointerId: 2, clientX: 440, clientY: 200 });
    expect(vp.scrollLeft).toBe(60);
    fireEvent.pointerUp(frame, { pointerId: 2, clientX: 440, clientY: 200 });
    // A small jitter under the 4px threshold must not count as a drag.
    fireEvent.pointerDown(frame, { button: 0, pointerId: 3, clientX: 500, clientY: 200 });
    fireEvent.pointerMove(frame, { pointerId: 3, clientX: 498, clientY: 201 });
    fireEvent.pointerUp(frame, { pointerId: 3, clientX: 498, clientY: 201 });
    expect(vp.scrollLeft).toBe(60);
    // The click that follows a real drag is swallowed, not delivered to hubs.
    fireEvent.pointerDown(frame, { button: 0, pointerId: 4, clientX: 500, clientY: 200 });
    fireEvent.pointerMove(frame, { pointerId: 4, clientX: 380, clientY: 260 });
    fireEvent.pointerUp(frame, { pointerId: 4, clientX: 380, clientY: 260 });
    expect(vp.scrollLeft).toBe(180);
    const hub = screen.getByRole("button", { name: /Orbit, 1 agents/ });
    fireEvent.click(hub);
    expect(hub.getAttribute("aria-expanded")).toBe("false");
  });
  it("keeps the inspector open while dragging and pans vertically", () => {
    const { container } = render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" defaultSelectedAgentId="builder" />);
    const vp = container.querySelector('[data-slot="scrollarea-viewport"]') as HTMLElement;
    const frame = container.querySelector(".cj-agent-map__canvas-frame") as HTMLElement;
    mockOverflow(vp, 800, 900);
    fireEvent.pointerDown(frame, { button: 0, pointerId: 1, clientX: 300, clientY: 300 });
    fireEvent.pointerMove(frame, { pointerId: 1, clientX: 300, clientY: 220 });
    fireEvent.pointerUp(frame, { pointerId: 1, clientX: 300, clientY: 220 });
    expect(vp.scrollTop).toBe(80);
    expect(screen.getByText("Inspector")).toBeTruthy(); // pan is not an outside click
    // A genuine click without movement still clears.
    fireEvent.pointerDown(container.querySelector(".cj-agent-map__canvas")!);
    fireEvent.pointerUp(container.querySelector(".cj-agent-map__canvas")!);
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("keeps the inspector open when the zoom pill is clicked", () => {
    render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" defaultSelectedAgentId="builder" />);
    const zoomIn = screen.getByRole("button", { name: "Zoom in" });
    fireEvent.pointerDown(zoomIn);
    fireEvent.pointerUp(zoomIn);
    expect(screen.getByText("Inspector")).toBeTruthy(); // pill clicks are not outside clicks
  });
});
