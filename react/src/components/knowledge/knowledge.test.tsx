import { createEvent, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryCard } from "./MemoryCard";
import { MemoryDetail } from "./MemoryDetail";
import { MemoryLibrary } from "./MemoryLibrary";
import { KnowledgeMap } from "./KnowledgeMap";
import { KnowledgeExplorer } from "./KnowledgeExplorer";
import { buildKnowledgeScene, filterMemories, safeMemoryHref } from "../../../../common/knowledge/model";
import type { MemoryRecord } from "./types";
import type { TraceGraphProps } from "../TraceGraph/types";

vi.mock("../TraceGraph/TraceGraph", () => ({ TraceGraph: ({ nodes, onNodeSelect, selectedNodeId }: TraceGraphProps) => <div aria-label="Mock trace">{nodes.map(node => <button key={node.id} type="button" data-tone={node.tone} aria-pressed={node.id === selectedNodeId} onClick={() => onNodeSelect?.(node)}>{node.label}</button>)}</div> }));
const records: MemoryRecord[] = [
  { id: "lock", title: "Share refresh lock", summary: "Avoid concurrent refresh.", kind: "lesson", topic: "Auth", scope: "packages/auth", relatedIds: ["retry", "missing"], usage: { retrievalCount: 3 } },
  { id: "retry", title: "Retry reads only", summary: "Mutations require keys.", kind: "decision", topic: "Transport", status: "needs-review", sources: [{ id: "source", label: "ADR", location: "docs/retry.md" }] },
  { id: "old", title: "Old refresh policy", summary: "Replaced.", kind: "convention", topic: "Auth", status: "superseded" },
];
beforeEach(() => { vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null); });

describe("knowledge model", () => {
  it("combines case-insensitive search terms with filters and source locations", () => {
    expect(filterMemories(records, "REFRESH packages", { kind: "lesson", status: "active" }).map(record => record.id)).toEqual(["lock"]);
    expect(filterMemories(records, "docs/retry.md").map(record => record.id)).toEqual(["retry"]);
    expect(filterMemories(records, "refresh", { topic: "Transport" })).toEqual([]);
  });
  it("preserves stable illustrative coordinates when records are reordered or appended", () => {
    const first = buildKnowledgeScene(records);
    const reordered = buildKnowledgeScene([...records].reverse());
    expect(first.projected).toBe(false);
    expect(first.points.find(point => point.memoryId === "lock")).toEqual(reordered.points.find(point => point.memoryId === "lock"));
    expect(buildKnowledgeScene([...records, { ...records[0], id: "new", topic: "New topic" }]).points[0]).toEqual(first.points[0]);
  });
  it("reports invalid supplied points, duplicate ids, and missing memories", () => {
    const scene = buildKnowledgeScene([...records, records[0]], [{ memoryId: "lock", x: NaN, y: 1 }, { memoryId: "retry", x: 1, y: 2 }, { memoryId: "retry", x: 2, y: 3 }, { memoryId: "missing", x: 0, y: 0 }]);
    expect(scene.points.map(point => point.memoryId)).toEqual(["retry"]);
    expect(scene.diagnostics.map(item => item.code)).toEqual(["duplicate-id", "invalid-coordinate", "duplicate-id", "missing-memory"]);
    expect(buildKnowledgeScene(records, []).points).toEqual([]);
  });
  it("rejects executable, protocol-relative, control-character, and backslash URLs", () => {
    for (const href of ["javascript:alert(1)", "data:text/html,hi", "//example.com", "/\\example.com", "https://example.com\n"]) expect(safeMemoryHref(href)).toBeUndefined();
    for (const href of ["https://example.com/source", "http://localhost:3000", "/source", "#source"]) expect(safeMemoryHref(href)).toBe(href);
  });
});

describe("memory components", () => {
  it("keeps actions independent from card selection", () => {
    const select = vi.fn(), pin = vi.fn();
    render(<MemoryCard memory={records[0]} onSelect={select} onPinChange={pin} />);
    fireEvent.click(screen.getByRole("button", { name: "Pin" }));
    expect(pin).toHaveBeenCalledWith(records[0], true); expect(select).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Share refresh lock/ }));
    expect(select).toHaveBeenCalledWith(records[0]);
  });
  it("omits unprovided actions and preserves plain-text content", () => {
    render(<MemoryDetail memory={{ ...records[0], content: "<script>bad()</script>", sources: [{ id: "bad", label: "Unsafe source", href: "javascript:bad()" }] }} />);
    expect(screen.getByText("<script>bad()</script>")).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.getByText(/access, not usefulness/)).toBeVisible();
  });
  it("renders missing selection and related navigation", () => {
    const related = vi.fn();
    const { rerender } = render(<MemoryDetail />);
    expect(screen.getByText(/Select a memory/)).toBeVisible();
    rerender(<MemoryDetail memory={records[0]} relatedMemories={[records[1]]} onRelatedSelect={related} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry reads only" }));
    expect(related).toHaveBeenCalledWith("retry");
  });
  it("searches, filters, and clears a library without external state", () => {
    render(<MemoryLibrary memories={records} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "refresh" } });
    expect(screen.queryByRole("button", { name: /Retry reads only/ })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "superseded" } });
    expect(screen.queryByRole("button", { name: /Share refresh lock/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Old refresh policy/ })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("button", { name: /Retry reads only/ })).toBeVisible();
  });
  it("does not mutate controlled selection or query", () => {
    const select = vi.fn(), query = vi.fn();
    render(<MemoryLibrary memories={records} selectedId="lock" onSelectionChange={select} query="" onQueryChange={query} />);
    const retry = screen.getByRole("button", { name: /Retry reads only/ });
    fireEvent.click(retry); expect(select).toHaveBeenCalledWith("retry"); expect(retry).toHaveAttribute("aria-pressed", "false");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "refresh" } });
    expect(query).toHaveBeenCalledWith("refresh"); expect(screen.getByRole("searchbox")).toHaveValue("");
  });
  it("leaves server-filtered records intact in remote mode", () => {
    render(<MemoryLibrary memories={records} remote query="no local matches" filters={{ topic: "Unknown" }} />);
    expect(screen.getByRole("button", { name: /Share refresh lock/ })).toBeVisible();
  });
  it("renders loading and empty states without stale cards", () => {
    const { rerender } = render(<MemoryLibrary memories={records} loading />);
    expect(screen.queryByRole("button", { name: /Share refresh lock/ })).not.toBeInTheDocument();
    rerender(<MemoryLibrary memories={[]} />);
    expect(screen.getByText("No memories yet.")).toBeVisible();
  });
});

describe("knowledge map and composition", () => {
  it("offers paginated list selection and topic filtering without canvas support", () => {
    const select = vi.fn(), topic = vi.fn();
    const many = Array.from({ length: 30 }, (_, i) => ({ ...records[0], id: `memory-${i}`, title: `Memory ${i}` }));
    render(<KnowledgeMap memories={many} onSelectionChange={select} onTopicSelect={topic} />);
    fireEvent.click(screen.getByText("List · 30"));
    fireEvent.click(screen.getByRole("button", { name: "Memory 0" }));
    expect(select).toHaveBeenCalledWith("memory-0");
    expect(screen.queryByRole("button", { name: "Memory 29" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Memory 29" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Auth" }));
    expect(topic).toHaveBeenCalledWith("Auth");
  });
  it("reports broken relationships and distinguishes topic layout from projections", () => {
    const diagnostics = vi.fn();
    const { rerender } = render(<KnowledgeMap memories={records} relationships={[{ id: "broken", source: "lock", target: "missing", label: "replaces" }]} onDiagnostics={diagnostics} />);
    expect(diagnostics).toHaveBeenCalledWith([{ code: "missing-endpoint", id: "broken" }]);
    expect(screen.getByText(/Illustrative topic layout/)).toBeVisible();
    rerender(<KnowledgeMap memories={records} points={[{ memoryId: "lock", x: 1, y: 2 }]} />);
    expect(screen.getByText(/Projected distances/)).toBeVisible();
  });
  it("links trace retrievals to multiple memories without choosing an arbitrary memory", () => {
    const select = vi.fn();
    const { container } = render(<KnowledgeExplorer memories={records} onSelectionChange={select} regions={{ map: false }} trace={{ nodes: [{ id: "retrieve", label: "Retrieve" }], edges: [] }} traceLinks={[{ memoryId: "lock", traceNodeId: "retrieve" }, { memoryId: "retry", traceNodeId: "retrieve" }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Retrieve" }));
    expect(select).not.toHaveBeenCalled();
    expect(container.querySelectorAll('[data-highlighted="true"]')).toHaveLength(2);
    expect(screen.getByText(/Select a memory/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Share refresh lock/ }));
    const detail = screen.getByRole("region", { name: "Memory details" });
    expect(within(detail).getByText("Share refresh lock")).toBeVisible();
    expect(within(detail).getByRole("button", { name: "Retrieve" })).toBeVisible();
    expect(within(screen.getByLabelText("Mock trace")).getByRole("button", { name: "Retrieve" })).toHaveAttribute("data-tone", "cyan");
  });
  it("handles a disappeared selected memory and custom regions", () => {
    const { rerender } = render(<KnowledgeExplorer memories={records} defaultSelectedId="lock" regions={{ library: false, map: false, trace: false }} renderRegion={{ detail: context => <button type="button" onClick={() => context.selectMemory("retry")}>{context.selectedMemory?.title ?? "No selection"}</button> }} />);
    fireEvent.click(screen.getByRole("button", { name: "Share refresh lock" }));
    expect(screen.getByRole("button", { name: "Retry reads only" })).toBeVisible();
    rerender(<KnowledgeExplorer memories={[]} regions={{ library: false, map: false, trace: false }} />);
    expect(screen.getByText(/Select a memory/)).toBeVisible();
  });
  it("blocks disabled card actions and selection", () => {
    const select = vi.fn(), pin = vi.fn();
    render(<MemoryCard memory={records[0]} disabled onSelect={select} onPinChange={pin} />);
    fireEvent.click(screen.getByRole("button", { name: /Share refresh lock/ }));
    fireEvent.click(screen.getByRole("button", { name: "Pin" }));
    expect(select).not.toHaveBeenCalled(); expect(pin).not.toHaveBeenCalled();
  });
  it("captures modified-wheel zoom without blocking ordinary page scrolling", () => {
    const { container } = render(<KnowledgeMap memories={records} />);
    const canvas = container.querySelector("canvas")!;
    const ordinary = createEvent.wheel(canvas, { deltaY: 100, cancelable: true });
    fireEvent(canvas, ordinary); expect(ordinary.defaultPrevented).toBe(false);
    const zoom = createEvent.wheel(canvas, { deltaY: -100, ctrlKey: true, cancelable: true });
    fireEvent(canvas, zoom); expect(zoom.defaultPrevented).toBe(true);
  });
  it("disconnects the map resize observer when unmounted", () => {
    const disconnect = vi.fn();
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect = disconnect; });
    const { unmount } = render(<KnowledgeMap memories={records} />); unmount();
    expect(disconnect).toHaveBeenCalled(); vi.unstubAllGlobals();
  });
});
