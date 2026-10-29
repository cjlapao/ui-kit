import { createRef } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TraceGraph } from "./TraceGraph";
import type { TraceGraphHandle } from "./types";
import { screenPoint } from "../../../../common/traceGraph/camera";
import { tracePulseRadius } from "./effects";

const spies = vi.hoisted(() => ({ setScene: vi.fn(), draw: vi.fn(), dispose: vi.fn() }));
vi.mock("./renderer", () => ({ TraceRenderer: class {
  backend: string;
  constructor(_canvas: unknown, _text: unknown, fallback: boolean) { this.backend = fallback ? "canvas2d" : "webgl2"; }
  setScene = spies.setScene; draw = spies.draw; dispose = spies.dispose;
  projected = screenPoint;
} }));
const nodes = [{ id: "a", label: "First", status: "done" as const }, { id: "b", label: "Second", status: "running" as const }];
const edges = [{ id: "ab", source: "a", target: "b", status: "running" as const }];
let frames: Map<number, FrameRequestCallback>, frameId = 0;
const advance = (time = 500) => act(() => { const next = [...frames.values()]; frames.clear(); next.forEach(callback => callback(time)); });
beforeEach(() => {
  frames = new Map(); vi.clearAllMocks();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++frameId, callback); return frameId; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 800, height: 400, left: 0, top: 0, right: 800, bottom: 400 } as DOMRect);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("TraceGraph", () => {
  it.each([[0, 0], [2, 2], [8, 3], [-1, 0], [NaN, 1]])("normalizes junction glow intensity %s", (value, expected) => {
    render(<TraceGraph nodes={nodes} edges={edges} junctionGlowIntensity={value} />);
    expect(spies.setScene.mock.calls[spies.setScene.mock.calls.length - 1][1]).toEqual(expect.objectContaining({ junctionGlowIntensity: expected }));
  });
  it("keeps pulse radius proportional and reduces it in overviews", () => {
    expect(tracePulseRadius(4, 2.5, 1)).toBe(10);
    expect(tracePulseRadius(4, 2.5, .1)).toBe(1);
    expect(tracePulseRadius(4, 2.5, 8)).toBe(10);
    expect(tracePulseRadius(4, 0, 1)).toBe(0);
  });
  it("clamps sparkle settings and disables effects with animation", () => {
    const { rerender } = render(<TraceGraph nodes={nodes} edges={edges} sparkleIntensity={9} sparkleSpeed={-2} flareSize={80} />);
    expect(spies.setScene.mock.calls[spies.setScene.mock.calls.length - 1][1]).toEqual(expect.objectContaining({ sparkles: true, sparkleIntensity: 3, sparkleSpeed: 0, pulseScale: 6 }));
    rerender(<TraceGraph nodes={nodes} edges={edges} animation={false} sparkleIntensity={NaN} />);
    expect(spies.setScene.mock.calls[spies.setScene.mock.calls.length - 1][1]).toEqual(expect.objectContaining({ sparkles: false, sparkleIntensity: 1 }));
  });
  it.each([["all", "all"], ["active", "active"], ["none", "none"], [true, "all"], [false, "none"]] as const)("normalizes glow %s", (glow, expected) => {
    render(<TraceGraph nodes={nodes} edges={edges} glow={glow} />);
    expect(spies.setScene.mock.calls[spies.setScene.mock.calls.length - 1][1]).toEqual(expect.objectContaining({ glow: expected }));
  });
  it("supports untinted embedding and forwards Panel properties", () => {
    const { container } = render(<TraceGraph nodes={nodes} edges={edges} tone="none" variant="simple" corner="none" subtitle="Embedded graph" style={{ margin: 4 }} />);
    expect(screen.getByText("Embedded graph")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveStyle({ borderWidth: "0px", boxShadow: "none", margin: "4px" });
    expect(spies.setScene.mock.calls[spies.setScene.mock.calls.length - 1][1]).toEqual(expect.objectContaining({ tone: "blue" }));
  });
  it("selects by keyboard and renders both consumer detail content and callback", () => {
    const onNodeSelect = vi.fn();
    render(<TraceGraph nodes={nodes} edges={edges} onNodeSelect={onNodeSelect} renderNodePopover={node => <p>Details for {node.label}</p>} />);
    const graph = screen.getByRole("application");
    fireEvent.keyDown(graph, { key: "ArrowRight" });
    expect(screen.getByRole("status")).toHaveTextContent("First");
    fireEvent.keyDown(graph, { key: "Enter" });
    advance();
    expect(onNodeSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }));
    expect(screen.getByRole("dialog", { name: "First" })).toHaveTextContent("Details for First");
    fireEvent.keyDown(graph, { key: "Escape" });
    expect(onNodeSelect).toHaveBeenLastCalledWith(null);
  });
  it("pauses follow on wheel and resumes through the toolbar", () => {
    const onFollowModeChange = vi.fn();
    render(<TraceGraph nodes={nodes} edges={edges} defaultFollowMode="following" onFollowModeChange={onFollowModeChange} />);
    const graph = screen.getByRole("application"); advance();
    fireEvent.wheel(graph, { deltaY: 100, clientX: 300, clientY: 200 });
    expect(graph).toHaveAttribute("data-follow-mode", "paused");
    expect(onFollowModeChange).toHaveBeenLastCalledWith("paused");
    fireEvent.click(screen.getByRole("button", { name: "Resume following" }));
    expect(graph).toHaveAttribute("data-follow-mode", "following");
  });
  it("keeps selection independent of follow until a manual focus command", () => {
    const ref = createRef<TraceGraphHandle>();
    render(<TraceGraph ref={ref} nodes={nodes} edges={edges} defaultFollowMode="following" />);
    const graph = screen.getByRole("application");
    fireEvent.keyDown(graph, { key: "ArrowRight" }); fireEvent.keyDown(graph, { key: "Enter" });
    expect(graph).toHaveAttribute("data-follow-mode", "following");
    act(() => ref.current!.focusNodes(["a"]));
    expect(graph).toHaveAttribute("data-follow-mode", "paused");
  });
  it("supports controlled follow and selection requests", () => {
    const onFollowModeChange = vi.fn(), onNodeSelect = vi.fn();
    render(<TraceGraph nodes={nodes} edges={edges} followMode="following" selectedNodeId="b" onFollowModeChange={onFollowModeChange} onNodeSelect={onNodeSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "Pause following" }));
    expect(onFollowModeChange).toHaveBeenCalledWith("paused");
    expect(screen.getByRole("application")).toHaveAttribute("data-follow-mode", "following");
    fireEvent.keyDown(screen.getByRole("application"), { key: "Home" });
    fireEvent.keyDown(screen.getByRole("application"), { key: "Enter" });
    expect(onNodeSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }));
  });
  it("switches renderer on context loss and restores current data", () => {
    const { container, rerender } = render(<TraceGraph nodes={nodes} edges={edges} />);
    rerender(<TraceGraph nodes={[...nodes, { id: "c" }]} edges={edges} />);
    const canvas = container.querySelector("canvas")!;
    fireEvent(canvas, new Event("webglcontextlost", { cancelable: true }));
    expect(screen.getByRole("application")).toHaveAttribute("data-trace-renderer", "canvas2d");
    fireEvent(canvas, new Event("webglcontextrestored"));
    expect(screen.getByRole("application")).toHaveAttribute("data-trace-renderer", "webgl2");
    expect(spies.setScene.mock.calls[spies.setScene.mock.calls.length - 1]?.[0].nodes).toHaveLength(3);
  });
  it("offers bounded search results and valid-geometry diagnostics", () => {
    const onDiagnostics = vi.fn();
    render(<TraceGraph nodes={nodes} edges={[...edges, { id: "bad", source: "a", target: "unknown" }]} onDiagnostics={onDiagnostics} />);
    expect(onDiagnostics).toHaveBeenCalledWith([{ id: "bad", kind: "missing-endpoint" }]);
    fireEvent.change(screen.getByRole("textbox", { name: "Find a point" }), { target: { value: "Second" } });
    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByRole("status")).toHaveTextContent("Second");
  });
  it("keeps an empty frontier stable and releases renderer resources", () => {
    const { unmount } = render(<TraceGraph nodes={[]} edges={[]} defaultFollowMode="following" />);
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
    advance(); unmount();
    expect(spies.dispose).toHaveBeenCalled(); expect(frames.size).toBe(0);
  });
});
