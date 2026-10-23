import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { NetworkGraph } from "./NetworkGraph";

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
