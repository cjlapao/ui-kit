import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { NetworkGraph } from "./NetworkGraph";
import type { NetworkGraphProps } from "./types";

const nodes = [
  { id: "a", label: "Alpha", community: "one", x: -50, y: 0 },
  { id: "b", label: "Beta", community: "two", x: 50, y: 0 },
  { id: "c", label: "Gamma", x: 0, y: 50 },
];
const edges = [{ id: "ab", source: "a", target: "b" }];
const communities = [
  { id: "one", label: "First" },
  { id: "two", label: "Second" },
];
const props = { nodes, edges, communities };
let frames: Map<number, FrameRequestCallback>;
let frameId = 0;
beforeEach(() => {
  frames = new Map();
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    frames.set(++frameId, fn);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("NetworkGraph interactions", () => {
  it("uses Panel variants and supports keyboard selection and clearing", () => {
    const onNodeSelect = vi.fn();
    const { container } = render(
      <NetworkGraph
        {...props}
        tone="teal"
        variant="liquid-glass"
        onNodeSelect={onNodeSelect}
      />,
    );
    expect(container.querySelector("section")).toHaveAttribute(
      "data-variant",
      "liquid-glass",
    );
    expect(container.querySelector("section")).toHaveAttribute(
      "data-tone",
      "teal",
    );
    const graph = screen.getByRole("application");
    fireEvent.keyDown(graph, { key: "ArrowRight" });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Alpha · 1 connections",
    );
    fireEvent.keyDown(graph, { key: "Enter" });
    expect(onNodeSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "a" }),
    );
    fireEvent.keyDown(graph, { key: "Escape" });
    expect(onNodeSelect).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole("status")).toHaveTextContent(
      "3 nodes · 1 connections",
    );
  });
  it("filters communities and incident edges, retaining ungrouped nodes", () => {
    render(<NetworkGraph {...props} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "First" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "2 nodes · 0 connections",
    );
    expect(
      screen.getByRole("checkbox", { name: "Select all" }),
    ).toBePartiallyChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "3 nodes · 1 connections",
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "1 nodes · 0 connections",
    );
  });
  it("does not mutate controlled filters or selection", () => {
    const change = vi.fn(),
      select = vi.fn();
    render(
      <NetworkGraph
        {...props}
        selectedNodeId="b"
        visibleCommunityIds={["one", "two"]}
        onVisibleCommunitiesChange={change}
        onNodeSelect={select}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "First" }));
    expect(change).toHaveBeenCalledWith(["two"]);
    expect(screen.getByRole("checkbox", { name: "First" })).toBeChecked();
    fireEvent.keyDown(screen.getByRole("application"), { key: "Escape" });
    expect(select).toHaveBeenCalledWith(null);
    expect(screen.getByRole("status")).toHaveTextContent("Beta");
  });
  it("skips hidden nodes during keyboard traversal", () => {
    render(<NetworkGraph {...props} visibleCommunityIds={["two"]} />);
    fireEvent.keyDown(screen.getByRole("application"), { key: "ArrowRight" });
    expect(screen.getByRole("status")).toHaveTextContent("Beta");
  });
  it("blocks interaction while disabled", () => {
    const select = vi.fn();
    render(<NetworkGraph {...props} disabled onNodeSelect={select} />);
    expect(screen.getByRole("application")).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(screen.getByRole("application"), { key: "ArrowRight" });
    fireEvent.keyDown(screen.getByRole("application"), { key: "Enter" });
    expect(select).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "First" })).toBeDisabled();
  });
  it("handles empty data and schedules drawing after loading ends", () => {
    const { rerender } = render(<NetworkGraph nodes={[]} edges={[]} loading />);
    expect(screen.queryByRole("application")).toBeNull();
    rerender(<NetworkGraph nodes={[]} edges={[]} />);
    expect(screen.getByRole("application")).toBeInTheDocument();
    expect(screen.getByText("No visible nodes")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("application"), { key: "ArrowRight" });
    expect(frames.size).toBeGreaterThan(0);
  });
  it("reports bounded zoom, fits, and cancels frames on unmount", () => {
    const change = vi.fn();
    const { unmount } = render(
      <NetworkGraph {...props} onViewportChange={change} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    const current = change.mock.lastCall![0];
    expect(current.zoom).toBeGreaterThanOrEqual(0.05);
    fireEvent.keyDown(screen.getByRole("application"), { key: "Home" });
    expect(change).toHaveBeenCalled();
    unmount();
    expect(frames.size).toBe(0);
  });
});

describe("NetworkGraph pointer navigation", () => {
  it("pans without selecting a node and zooms around the pointer", () => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    const selected = vi.fn(),
      changed = vi.fn();
    render(
      <NetworkGraph
        {...props}
        onNodeSelect={selected}
        onViewportChange={changed}
      />,
    );
    const graph = screen.getByRole("application");
    graph.setPointerCapture = vi.fn();
    graph.hasPointerCapture = () => true;
    graph.releasePointerCapture = vi.fn();
    const before = changed.mock.lastCall![0];
    fireEvent.pointerDown(graph, { clientX: 10, clientY: 10, button: 0 });
    fireEvent.pointerMove(graph, { clientX: 60, clientY: 35 });
    fireEvent.pointerUp(graph, { clientX: 60, clientY: 35 });
    expect(changed.mock.lastCall![0]).toMatchObject({
      x: before.x + 50,
      y: before.y + 25,
    });
    expect(selected).not.toHaveBeenCalled();
    const oldZoom = changed.mock.lastCall![0].zoom;
    fireEvent.wheel(graph, {
      clientX: 20,
      clientY: 20,
      deltaY: -100,
      ctrlKey: true,
    });
    expect(changed.mock.lastCall![0].zoom).toBeGreaterThan(oldZoom);
  });
  it("keeps the normal cursor and switches to the drag cursor only while panning", () => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    render(<NetworkGraph {...props} />);
    const graph = screen.getByRole("application");
    graph.setPointerCapture = vi.fn();
    graph.hasPointerCapture = () => true;
    graph.releasePointerCapture = vi.fn();
    expect(graph.className).toContain("cursor-default");
    expect(graph.className).not.toContain("cursor-grabbing");
    fireEvent.pointerDown(graph, { clientX: 10, clientY: 10, button: 0 });
    // Pressing alone — a plain click to select — stays on the normal cursor.
    expect(graph.className).not.toContain("cursor-grabbing");
    // Below the 4px pan threshold the drag has not really started yet.
    fireEvent.pointerMove(graph, { clientX: 12, clientY: 12 });
    expect(graph.className).not.toContain("cursor-grabbing");
    fireEvent.pointerMove(graph, { clientX: 60, clientY: 35 });
    expect(graph.className).toContain("cursor-grabbing");
    fireEvent.pointerUp(graph, { clientX: 60, clientY: 35 });
    expect(graph.className).not.toContain("cursor-grabbing");
    expect(graph.className).toContain("cursor-default");
  });
  it("starts backwards traversal at the last visible node", () => {
    render(<NetworkGraph {...props} />);
    fireEvent.keyDown(screen.getByRole("application"), { key: "ArrowLeft" });
    expect(screen.getByRole("status")).toHaveTextContent("Gamma");
  });
  it("clicks a node through world coordinates and ignores cancelled gestures", () => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    const select = vi.fn(),
      change = vi.fn();
    render(
      <NetworkGraph
        {...props}
        onNodeSelect={select}
        onViewportChange={change}
      />,
    );
    const graph = screen.getByRole("application");
    graph.setPointerCapture = vi.fn();
    graph.hasPointerCapture = () => true;
    graph.releasePointerCapture = vi.fn();
    const view = change.mock.lastCall![0];
    const point = {
      clientX: -50 * view.zoom + view.x,
      clientY: view.y,
      button: 0,
    };
    fireEvent.pointerDown(graph, point);
    fireEvent.pointerUp(graph, point);
    expect(select).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }));
    select.mockClear();
    fireEvent.pointerDown(graph, point);
    fireEvent.pointerCancel(graph);
    fireEvent.pointerUp(graph, point);
    expect(select).not.toHaveBeenCalled();
  });
});

describe("NetworkGraph hover highlight", () => {
  const setup = (extra = {}) => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    const select = vi.fn(),
      change = vi.fn();
    render(
      <NetworkGraph
        {...props}
        onNodeSelect={select}
        onViewportChange={change}
        {...extra}
      />,
    );
    const graph = screen.getByRole("application");
    graph.setPointerCapture = vi.fn();
    graph.hasPointerCapture = () => true;
    graph.releasePointerCapture = vi.fn();
    // Node "a" sits at world (-50, 0) after fit, matching the click tests.
    const view = change.mock.lastCall![0];
    return {
      graph,
      select,
      overA: { clientX: -50 * view.zoom + view.x, clientY: view.y },
      overEmpty: { clientX: view.x + 900, clientY: view.y + 900 },
    };
  };
  it("previews the node under the pointer without selecting it", () => {
    const { graph, select, overA, overEmpty } = setup();
    fireEvent.pointerMove(graph, overA);
    expect(graph).toHaveAttribute("data-hovered", "a");
    fireEvent.pointerMove(graph, overEmpty);
    expect(graph).not.toHaveAttribute("data-hovered");
    fireEvent.pointerMove(graph, overA);
    fireEvent.pointerLeave(graph);
    expect(graph).not.toHaveAttribute("data-hovered");
    expect(select).not.toHaveBeenCalled();
  });
  it("clears and suppresses hover while panning", () => {
    const { graph, overA } = setup();
    fireEvent.pointerMove(graph, overA);
    expect(graph).toHaveAttribute("data-hovered", "a");
    fireEvent.pointerDown(graph, { ...overA, button: 0 });
    fireEvent.pointerMove(graph, { clientX: overA.clientX + 60, clientY: overA.clientY + 40 });
    expect(graph).not.toHaveAttribute("data-hovered");
    fireEvent.pointerUp(graph, { clientX: overA.clientX + 60, clientY: overA.clientY + 40 });
    expect(graph).not.toHaveAttribute("data-hovered");
  });
  it("stays off with hoverHighlight={false}", () => {
    const { graph, overA } = setup({ hoverHighlight: false });
    fireEvent.pointerMove(graph, overA);
    expect(graph).not.toHaveAttribute("data-hovered");
  });
  it("stays off while disabled", () => {
    const { graph, overA } = setup({ disabled: true });
    fireEvent.pointerMove(graph, overA);
    expect(graph).not.toHaveAttribute("data-hovered");
  });
});

describe("NetworkGraph legend placement and wheel ownership", () => {
  it("leaves plain scrolling to the page and captures only Ctrl-wheel", () => {
    const change = vi.fn();
    render(<NetworkGraph {...props} onViewportChange={change} />);
    const graph = screen.getByRole("application");
    change.mockClear();
    expect(fireEvent.wheel(graph, { deltaY: 100 })).toBe(true);
    expect(fireEvent.wheel(graph, { deltaY: 100, metaKey: true })).toBe(true);
    expect(change).not.toHaveBeenCalled();
    expect(fireEvent.wheel(graph, { deltaY: -100, ctrlKey: true })).toBe(false);
    expect(change).toHaveBeenCalled();
  });
  it("adapts auto to component width and honours forced placement", () => {
    let width = 800;
    const callbacks: (() => void)[] = [];
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () => ({
        width,
        height: 480,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: 480,
        toJSON() {},
      }),
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          callbacks.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );
    const { container, rerender } = render(<NetworkGraph {...props} />);
    const position = () =>
      container
        .querySelector("[data-legend-position]")
        ?.getAttribute("data-legend-position");
    expect(position()).toBe("right");
    width = 400;
    act(() => callbacks.forEach((callback) => callback()));
    expect(position()).toBe("bottom");
    rerender(<NetworkGraph {...props} legendPosition="right" />);
    expect(position()).toBe("right");
    width = 900;
    rerender(<NetworkGraph {...props} legendPosition="bottom" />);
    expect(position()).toBe("bottom");
  });
});

describe("NetworkGraph legend panel", () => {
  it("inherits the parent surface and tone, supports overrides, and preserves filters", () => {
    const { container, rerender } = render(
      <NetworkGraph {...props} legendPanel variant="glass" tone="teal" />,
    );
    const legendPanel = () => container.querySelector("section section");
    expect(legendPanel()).toHaveAttribute("data-variant", "glass");
    expect(legendPanel()).toHaveAttribute("data-tone", "teal");
    fireEvent.click(screen.getByRole("checkbox", { name: "First" }));
    expect(screen.getByRole("status")).toHaveTextContent("2 nodes");
    rerender(
      <NetworkGraph {...props} legendPanel variant="tonal" tone="rose" />,
    );
    expect(legendPanel()).toHaveAttribute("data-variant", "tonal");
    expect(legendPanel()).toHaveAttribute("data-tone", "rose");
    rerender(
      <NetworkGraph
        {...props}
        legendPanel
        variant="glass"
        tone="teal"
        legendVariant="outlined"
        legendTone="amber"
      />,
    );
    expect(legendPanel()).toHaveAttribute("data-variant", "outlined");
    expect(legendPanel()).toHaveAttribute("data-tone", "amber");
    rerender(<NetworkGraph {...props} />);
    expect(legendPanel()).toBeNull();
    expect(screen.getByRole("checkbox", { name: "First" })).toBeInTheDocument();
  });
});

describe("NetworkGraph inspector", () => {
  const selectAlpha = () => {
    const graph = screen.getByRole("application");
    fireEvent.keyDown(graph, { key: "ArrowRight" });
    fireEvent.keyDown(graph, { key: "Enter" });
  };
  it("stays opt-in: no inspector markup without the prop", () => {
    const { container } = render(<NetworkGraph {...props} />);
    selectAlpha();
    expect(container.querySelector(".cj-network-graph")).toBeNull();
    expect(container.querySelector(".cj-network-graph__inspector")).toBeNull();
  });
  it("opens on selection with the standard body and closes via the Close button", () => {
    const onNodeSelect = vi.fn();
    const { container } = render(
      <NetworkGraph {...props} inspector onNodeSelect={onNodeSelect} />,
    );
    const root = container.querySelector(".cj-network-graph");
    const inspector = container.querySelector(".cj-network-graph__inspector");
    expect(root).not.toHaveClass("cj-network-graph--inspector-open");
    expect(inspector).toHaveAttribute("aria-hidden", "true");
    selectAlpha();
    expect(root).toHaveClass("cj-network-graph--inspector-open");
    expect(inspector).not.toHaveAttribute("aria-hidden");
    expect(inspector).toHaveTextContent("Inspector");
    expect(inspector).toHaveTextContent("Alpha");
    expect(inspector).toHaveTextContent("First");
    expect(inspector).toHaveTextContent("a");
    expect(inspector).toHaveTextContent("Beta");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onNodeSelect).toHaveBeenLastCalledWith(null);
    expect(root).not.toHaveClass("cj-network-graph--inspector-open");
  });
  it("follows the graph surface by default and honours inspector variants and tones", () => {
    const { container, rerender } = render(
      <NetworkGraph {...props} inspector variant="glass" tone="teal" />,
    );
    selectAlpha();
    const details = () =>
      container.querySelector(".cj-network-graph__details");
    expect(details()).toHaveAttribute("data-variant", "glass");
    expect(details()).toHaveAttribute("data-tone", "teal");
    rerender(
      <NetworkGraph
        {...props}
        inspector
        variant="glass"
        tone="teal"
        inspectorVariant="outlined"
        inspectorTone="amber"
      />,
    );
    expect(details()).toHaveAttribute("data-variant", "outlined");
    expect(details()).toHaveAttribute("data-tone", "amber");
  });
  it("styles the built-in buttons and replaces them through renderInspectorActions", () => {
    const { container, rerender } = render(
      <NetworkGraph
        {...props}
        inspector
        inspectorButtonVariant="soft"
        inspectorButtonTone="sky"
      />,
    );
    selectAlpha();
    const center = screen.getByRole("button", { name: "Center on node" });
    expect(center).toHaveAttribute("data-variant", "soft");
    expect(center).toHaveAttribute("data-color", "sky");
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
      "data-variant",
      "soft",
    );
    rerender(
      <NetworkGraph
        {...props}
        inspector
        renderInspectorActions={(_node, _info, helpers) => (
          <button type="button" onClick={helpers.close}>
            Custom action
          </button>
        )}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Center on node" }),
    ).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Custom action" }));
    expect(container.querySelector(".cj-network-graph")).not.toHaveClass(
      "cj-network-graph--inspector-open",
    );
  });
  it("replaces the standard body through renderInspectorBody", () => {
    const { container } = render(
      <NetworkGraph
        {...props}
        inspector
        renderInspectorBody={(_node, info) => (
          <div>
            Custom body for {info.label} ({info.connectionCount}) with{" "}
            {info.community?.label}
          </div>
        )}
      />,
    );
    selectAlpha();
    expect(container.querySelector(".cj-network-graph__inspector")).toHaveTextContent(
      "Custom body for Alpha (1) with First",
    );
    expect(
      container.querySelector(".cj-network-graph__neighbor-rows"),
    ).toBeNull();
    // Footer buttons remain available alongside a custom body.
    expect(
      screen.getByRole("button", { name: "Center on node" }),
    ).toBeInTheDocument();
  });
  it("selects a neighbour from the inspector list", () => {
    const onNodeSelect = vi.fn();
    const { container } = render(
      <NetworkGraph {...props} inspector onNodeSelect={onNodeSelect} />,
    );
    selectAlpha();
    fireEvent.click(
      container.querySelector(".cj-network-graph__neighbor")!,
    );
    expect(onNodeSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "b" }),
    );
    expect(
      container.querySelector(".cj-network-graph__details"),
    ).toHaveTextContent("Beta");
  });
  it("keeps the AgentMap layout: inspector outside the graph card with a pinned footer", () => {
    const { container } = render(
      <NetworkGraph {...props} inspector height={360} />,
    );
    selectAlpha();
    const root = container.querySelector(".cj-network-graph");
    expect(root?.getAttribute("style")).toContain(
      "--cj-network-graph-inspector-width",
    );
    // The inspector is a sibling of the graph card, not nested inside it.
    expect(root?.firstElementChild).toHaveClass("cj-network-graph__main");
    expect(root?.lastElementChild).toHaveClass("cj-network-graph__inspector");
    const graphPanel = container.querySelector(
      ".cj-network-graph__main section",
    );
    expect(graphPanel).toBeInTheDocument();
    expect(
      graphPanel?.querySelector(".cj-network-graph__inspector"),
    ).toBeNull();
    const body = container.querySelector(".cj-network-graph__body");
    const actions = container.querySelector(".cj-network-graph__actions");
    expect(body).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
    // Details scroll above the footer; the buttons live in the footer only.
    expect(body?.querySelector(".cj-network-graph__eyebrow")).not.toBeNull();
    expect(actions?.querySelector(".cj-network-graph__eyebrow")).toBeNull();
    expect(actions?.querySelector("[data-variant]")).not.toBeNull();
    expect(body?.querySelector('[data-variant="solid"]')).toBeNull();
  });
  it("wraps a long neighbour list in a scroll area", () => {
    const hubbed = [
      { id: "hub", label: "Hub" },
      ...Array.from({ length: 30 }, (_, index) => ({
        id: `mate-${index}`,
        label: `Mate ${index}`,
      })),
    ];
    const hubbedEdges = hubbed
      .slice(1)
      .map((node) => ({ id: `e-${node.id}`, source: "hub", target: node.id }));
    const { container } = render(
      <NetworkGraph
        nodes={hubbed}
        edges={hubbedEdges}
        inspector
        height={240}
      />,
    );
    const graph = screen.getByRole("application");
    fireEvent.keyDown(graph, { key: "ArrowRight" });
    fireEvent.keyDown(graph, { key: "Enter" });
    expect(
      container.querySelector(".cj-network-graph__inspector"),
    ).toHaveTextContent("Hub");
    expect(
      container.querySelector(".cj-network-graph__neighbor-scroll"),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".cj-network-graph__neighbor")).toHaveLength(30);
  });
});

describe("NetworkGraph inspector docking", () => {
  /** Render at a fixed component width and report whether the inspector stacked. */
  const stackedAt = (width: number, extra: Partial<NetworkGraphProps> = {}) => {
    const callbacks: (() => void)[] = [];
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () => ({
        width,
        height: 480,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: 480,
        toJSON() {},
      }),
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          callbacks.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );
    const { container } = render(
      <NetworkGraph {...props} inspector defaultSelectedNodeId="a" {...extra} />,
    );
    act(() => callbacks.forEach((callback) => callback()));
    return !!container.querySelector(".cj-network-graph--stacked");
  };

  // The breakpoint is the main column's floor alone — width is the only
  // input and the inspector's own width never moves it.
  it("docks beside the graph while the component keeps the main floor", () => {
    expect(stackedAt(700)).toBe(false);
    expect(stackedAt(400)).toBe(false); // 400 ≥ 320: docked even though the inspector squeezes main
    expect(stackedAt(310)).toBe(true);
  });
  it("keeps the inspector width out of the breakpoint but honors the floor", () => {
    expect(stackedAt(700, { inspectorWidth: 480 })).toBe(false);
    expect(stackedAt(700, { inspectorMinMainWidth: 600 })).toBe(false); // 700 still clears the floor
    expect(stackedAt(550, { inspectorMinMainWidth: 600 })).toBe(true);
  });
  it("re-evaluates the dock when the component is resized", () => {
    let width = 700;
    const callbacks: (() => void)[] = [];
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () => ({
        width,
        height: 480,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: 480,
        toJSON() {},
      }),
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          callbacks.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );
    const { container } = render(
      <NetworkGraph {...props} inspector defaultSelectedNodeId="a" />,
    );
    act(() => callbacks.forEach((callback) => callback()));
    expect(container.querySelector(".cj-network-graph--stacked")).toBeNull();
    width = 200;
    act(() => callbacks.forEach((callback) => callback()));
    expect(container.querySelector(".cj-network-graph--stacked")).not.toBeNull();
  });
  it("lets inspectorStackBelow replace the decision", () => {
    expect(stackedAt(500, { inspectorStackBelow: 0 })).toBe(false);
    expect(stackedAt(1200, { inspectorStackBelow: 1400 })).toBe(true);
  });
});

describe("NetworkGraph grid background", () => {
  const lattice = (container: HTMLElement) =>
    container.querySelector<HTMLElement>(".cj-network-graph__grid > div");
  it("paints a blue dot lattice behind the canvas by default", () => {
    const { container } = render(<NetworkGraph {...props} />);
    const grid = lattice(container);
    expect(grid).not.toBeNull();
    // Dots, on the same 32px lattice as AgentMap's, faded at the edges.
    // Slightly heavier than AgentMap's line defaults so isolated dots read
    // on the light Panel surfaces too (verified in a headless render).
    expect(grid?.style.backgroundImage).toContain("radial-gradient(circle at 0 0");
    expect(grid?.style.backgroundImage).toContain("--color-blue-500");
    expect(grid?.style.backgroundImage).toContain("1.5px");
    expect(grid?.style.backgroundSize).toBe("32px 32px");
    expect(grid?.style.opacity).toBe("0.35");
    expect(grid?.style.maskImage).toContain("radial-gradient");
  });
  it("hides with grid=false and follows gridTone", () => {
    const { container, rerender } = render(<NetworkGraph {...props} grid={false} />);
    expect(container.querySelector(".cj-network-graph__grid")).toBeNull();
    rerender(<NetworkGraph {...props} gridTone="emerald" />);
    // The tone lands on the graph box as the CSS variable the dots consume.
    const box = container
      .querySelector<HTMLElement>(".cj-network-graph__grid")!
      .closest<HTMLElement>("[style*='--cj-network-graph-grid-color']");
    expect(box).not.toBeNull();
    expect(box?.style.getPropertyValue("--cj-network-graph-grid-color")).toBe(
      "var(--color-emerald-500)",
    );
  });
  it("accepts GridBackground overrides", () => {
    const { container } = render(
      <NetworkGraph
        {...props}
        grid={{ pattern: "grid", size: 48, dotSize: 3, opacity: 0.4 }}
      />,
    );
    const grid = lattice(container);
    expect(grid?.style.backgroundImage).toContain("linear-gradient");
    expect(grid?.style.backgroundImage).not.toContain("radial-gradient(circle at 0 0");
    expect(grid?.style.backgroundSize).toBe("48px 48px");
    expect(grid?.style.opacity).toBe("0.4");
  });
  it("clamps a nonsense dot size instead of emitting NaN", () => {
    const { container } = render(
      <NetworkGraph {...props} grid={{ dotSize: Number.NaN }} />,
    );
    expect(lattice(container)?.style.backgroundImage).toContain("1px");
  });
  it("is decorative and never intercepts canvas pointer input", () => {
    const { container } = render(<NetworkGraph {...props} />);
    const host = container.querySelector<HTMLElement>(".cj-network-graph__grid");
    expect(host?.style.pointerEvents).toBe("none");
    expect(lattice(container)?.getAttribute("aria-hidden")).toBe("true");
    // The canvas paints above the lattice: it is positioned and follows the
    // lattice in DOM order within the same graph box.
    const canvas = container.querySelector("canvas");
    expect(canvas?.className).toContain("relative");
    expect(
      canvas?.compareDocumentPosition(
        container.querySelector(".cj-network-graph__grid")!,
      ),
    ).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });
});

describe("NetworkGraph full size modes", () => {
  it("keeps the fixed viewport height by default", () => {
    const { container } = render(<NetworkGraph {...props} />);
    const box = container.querySelector<HTMLElement>(
      ".cj-network-graph__graph-box",
    );
    expect(box?.style.height).toBe("480px");
    expect(box?.style.minHeight).toBe("480px");
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "cj-network-graph--full-width",
    );
  });
  it("hands the height to CSS with fullHeight", () => {
    const { container } = render(
      <NetworkGraph {...props} fullHeight inspector defaultSelectedNodeId="a" />,
    );
    const root = container.querySelector(".cj-network-graph")!;
    expect(root.className).toContain("cj-network-graph--full-height");
    const box = container.querySelector<HTMLElement>(
      ".cj-network-graph__graph-box",
    );
    expect(box?.style.height).toBe("");
    expect(box?.style.minHeight).toBe("");
    // The panel body becomes a flex column so the box can absorb the height.
    expect(root.querySelector("section")?.className).toContain("flex-col");
  });
  it("toggles the width classes with fullWidth", () => {
    const { container, rerender } = render(<NetworkGraph {...props} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("cj-network-graph--full-width");
    rerender(<NetworkGraph {...props} fullWidth={false} />);
    expect(root.className).toContain("cj-network-graph--intrinsic-width");
    expect(root.className).not.toContain("cj-network-graph--full-width");
  });
});

describe("NetworkGraph loading skeleton", () => {
  it("mirrors the real layout while loading", () => {
    const { container } = render(<NetworkGraph {...props} loading />);
    expect(screen.queryByRole("application")).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Loading graph…");
    const skeleton = container.querySelector(".cj-network-graph__skeleton");
    expect(skeleton).not.toBeNull();
    expect(skeleton?.getAttribute("aria-hidden")).toBe("true");
    // Search bar, canvas surface with the zoom pill, legend column, captions.
    expect(skeleton?.querySelectorAll("span.block")).not.toHaveLength(0);
    expect(
      skeleton?.querySelector(".cj-network-graph__graph-box > div"),
    ).not.toBeNull();
    expect(
      skeleton?.querySelector(".cj-network-graph__skeleton-controls"),
    ).not.toBeNull();
    expect(
      skeleton?.querySelectorAll(".cj-network-graph__skeleton-legend-row"),
    ).toHaveLength(3); // select all + the two communities
    expect(
      skeleton?.querySelector(".cj-network-graph__skeleton-legend"),
    ).not.toBeNull();
  });
  it("drops the legend column with showCommunities={false}", () => {
    const { container } = render(
      <NetworkGraph {...props} loading showCommunities={false} />,
    );
    expect(
      container.querySelector(".cj-network-graph__skeleton-legend"),
    ).toBeNull();
  });
  it("gives way to the real graph when loading ends", () => {
    const { container, rerender } = render(<NetworkGraph {...props} loading />);
    rerender(<NetworkGraph {...props} />);
    expect(container.querySelector(".cj-network-graph__skeleton")).toBeNull();
    expect(screen.getByRole("application")).toBeInTheDocument();
  });
});

describe("NetworkGraph empty state", () => {
  it("shows an icon empty state and hides the legend when there is no data", () => {
    render(<NetworkGraph nodes={[]} edges={[]} communities={communities} />);
    expect(screen.getByText("No visible nodes")).toBeInTheDocument();
    expect(
      screen.getByText(/Load nodes into the graph/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Communities")).toBeNull();
    // Nothing to restore when there never were nodes.
    expect(screen.queryByRole("button", { name: "Select all" })).toBeNull();
  });
  it("hides the legend when every community is filtered out and offers a way back", () => {
    const onlyCommunities = [
      { id: "a", label: "Alpha", community: "one", x: -50, y: 0 },
      { id: "b", label: "Beta", community: "two", x: 50, y: 0 },
    ];
    render(
      <NetworkGraph nodes={onlyCommunities} edges={[]} communities={communities} />,
    );
    expect(screen.getByText("Communities")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all" }));
    // Empty graph, no legend — the EmptyState action is the way back.
    expect(screen.queryByText("Communities")).toBeNull();
    expect(screen.getByText("No visible nodes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Select all" }));
    expect(screen.getByText("Communities")).toBeInTheDocument();
    expect(screen.queryByText("No visible nodes")).toBeNull();
  });
  it("keeps the emptyMessage override", () => {
    render(
      <NetworkGraph
        nodes={[]}
        edges={[]}
        emptyMessage={<span>nothing here</span>}
      />,
    );
    expect(screen.getByText("nothing here")).toBeInTheDocument();
    expect(screen.queryByText("No visible nodes")).toBeNull();
  });
});

describe("NetworkGraph auto reveal and inspector fit", () => {
  const mockBox = () =>
    vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(
        () =>
          ({
            width: 400,
            height: 480,
            top: 0,
            left: 0,
            right: 400,
            bottom: 480,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }) as DOMRect,
      );
  const flushFrames = () => {
    let guard = 0;
    while (frames.size && guard++ < 60) {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback(0));
    }
  };
  const runTween = (total = 800, step = 60) => {
    for (let elapsed = 0; elapsed < total; elapsed += step)
      act(() => {
        vi.advanceTimersByTime(step);
        flushFrames();
      });
  };
  const zoomAway = (graph: HTMLElement, change: ReturnType<typeof vi.fn>) => {
    for (let i = 0; i < 4; i++)
      fireEvent.wheel(graph, {
        clientX: 350,
        clientY: 420,
        deltaY: -100,
        ctrlKey: true,
      });
    act(flushFrames);
    const before = change.mock.lastCall![0];
    change.mockClear();
    return before;
  };
  it("does not pan when the selected node is already centered", () => {
    vi.useFakeTimers();
    mockBox();
    const change = vi.fn();
    render(
      <NetworkGraph
        nodes={[{ id: "a", label: "Alpha", x: 0, y: 0 }]}
        edges={[]}
        inspector
        defaultSelectedNodeId="a"
        onViewportChange={change}
      />,
    );
    act(() => vi.advanceTimersByTime(300));
    runTween();
    expect(change).toHaveBeenCalled(); // the initial fit
    change.mockClear();
    act(() => vi.advanceTimersByTime(600));
    runTween();
    expect(change).not.toHaveBeenCalled(); // centering on an already-centered node is a no-op
    vi.useRealTimers();
  });
  it("eases to center on an off-screen selection by default", () => {
    vi.useFakeTimers();
    mockBox();
    const change = vi.fn();
    const { rerender } = render(
      <NetworkGraph {...props} inspector onViewportChange={change} />,
    );
    act(() => vi.advanceTimersByTime(10));
    const before = zoomAway(screen.getByRole("application"), change);
    rerender(
      <NetworkGraph
        {...props}
        inspector
        selectedNodeId="a"
        onViewportChange={change}
      />,
    );
    act(() => vi.advanceTimersByTime(300)); // reveal timer fires after the dock settles
    runTween();
    expect(change).toHaveBeenCalled();
    const last = change.mock.lastCall![0];
    expect(last.x).toBeGreaterThan(before.x);
    // Node "a" (world -50, 0) ends centered in the 400×480 box.
    expect(Math.abs(-50 * last.zoom + last.x - 200)).toBeLessThan(2);
    expect(Math.abs(last.y - 240)).toBeLessThan(2);
    vi.useRealTimers();
  });
  it("pans by the minimum with autoCenterSelected={false}", () => {
    vi.useFakeTimers();
    mockBox();
    const change = vi.fn();
    const { rerender } = render(
      <NetworkGraph {...props} inspector onViewportChange={change} />,
    );
    act(() => vi.advanceTimersByTime(10));
    const before = zoomAway(screen.getByRole("application"), change);
    rerender(
      <NetworkGraph
        {...props}
        inspector
        selectedNodeId="a"
        autoCenterSelected={false}
        onViewportChange={change}
      />,
    );
    act(() => vi.advanceTimersByTime(300));
    runTween();
    expect(change).toHaveBeenCalled();
    const last = change.mock.lastCall![0];
    expect(last.x).toBeGreaterThan(before.x);
    // Just inside the left margin — not centered.
    expect(-50 * last.zoom + last.x).toBeLessThan(100);
    vi.useRealTimers();
  });
  it("stays put with autoRevealSelected={false}", () => {
    vi.useFakeTimers();
    mockBox();
    const change = vi.fn();
    const { rerender } = render(
      <NetworkGraph {...props} inspector onViewportChange={change} />,
    );
    act(() => vi.advanceTimersByTime(10));
    zoomAway(screen.getByRole("application"), change);
    rerender(
      <NetworkGraph
        {...props}
        inspector
        selectedNodeId="a"
        autoRevealSelected={false}
        onViewportChange={change}
      />,
    );
    act(() => vi.advanceTimersByTime(300));
    runTween();
    expect(change).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
  it("animates a fit into the shrunken box with autoFitOnInspector", () => {
    vi.useFakeTimers();
    mockBox();
    const change = vi.fn();
    const { rerender } = render(
      <NetworkGraph {...props} inspector onViewportChange={change} />,
    );
    act(() => vi.advanceTimersByTime(10));
    const before = zoomAway(screen.getByRole("application"), change);
    expect(before.zoom).toBeGreaterThan(2.5);
    rerender(
      <NetworkGraph
        {...props}
        inspector
        selectedNodeId="a"
        autoFitOnInspector
        onViewportChange={change}
      />,
    );
    act(() => vi.advanceTimersByTime(300));
    runTween();
    expect(change).toHaveBeenCalled();
    expect(change.mock.lastCall![0].zoom).toBeLessThan(before.zoom);
    vi.useRealTimers();
  });
  it("jumps instantly under reduced motion", () => {
    vi.useFakeTimers();
    mockBox();
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query.includes("reduced-motion"),
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );
    const change = vi.fn();
    const { rerender } = render(
      <NetworkGraph {...props} inspector onViewportChange={change} />,
    );
    act(() => vi.advanceTimersByTime(10));
    const before = zoomAway(screen.getByRole("application"), change);
    rerender(
      <NetworkGraph
        {...props}
        inspector
        selectedNodeId="a"
        onViewportChange={change}
      />,
    );
    act(() => vi.advanceTimersByTime(10)); // 0ms timer + instant commit
    expect(change).toHaveBeenCalled();
    expect(change.mock.lastCall![0].x).toBeGreaterThan(before.x);
    vi.useRealTimers();
  });
});
