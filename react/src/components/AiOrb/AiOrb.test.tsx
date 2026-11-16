import { Profiler, StrictMode } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiOrb } from "./AiOrb";
import { renderToString } from "react-dom/server";

const mocks = vi.hoisted(() => ({ draw: vi.fn(), update: vi.fn(), resize: vi.fn(), sample: vi.fn(), dispose: vi.fn() }));
vi.mock("../../../../common/aiOrb/renderer", () => ({ createOrbRenderer: () => ({ draw: mocks.draw, update: mocks.update, resize: mocks.resize }) }));
vi.mock("../../../../common/aiOrb/audio", () => ({ createOrbAudio: () => ({ sample: mocks.sample, dispose: mocks.dispose }) }));

let frames: Map<number, FrameRequestCallback>;
let next: number;
let intersect: (entries: { isIntersecting: boolean }[]) => void;
let motion: () => void;
let reduced: boolean;

beforeEach(() => {
  vi.clearAllMocks(); frames = new Map(); next = 0; reduced = false;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++next, callback); return next; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: typeof intersect) { intersect = callback; }
    observe() {} disconnect() {}
  });
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("matchMedia", () => ({ get matches() { return reduced; }, addEventListener: (_: string, cb: () => void) => { motion = cb; }, removeEventListener: vi.fn() }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function frame(timestamp: number) {
  const callbacks = [...frames.values()]; frames.clear();
  act(() => callbacks.forEach(callback => callback(timestamp)));
}

describe("AiOrb lifecycle", () => {
  it("renders on the server without browser APIs", () => {
    vi.stubGlobal("window", undefined);
    expect(renderToString(<AiOrb state="listening" label="Assistant" />)).toContain('aria-label="Assistant"');
    vi.unstubAllGlobals();
  });
  it("throttles balanced drawing to 30 FPS", () => {
    render(<AiOrb />);
    mocks.draw.mockClear();
    frame(0); frame(10); frame(20); frame(34);
    expect(mocks.draw).toHaveBeenCalledTimes(2);
  });
  it("keeps one loop under Strict Mode and never commits React on animation frames", () => {
    const commit = vi.fn();
    const view = render(<StrictMode><Profiler id="orb" onRender={commit}><AiOrb label="Assistant listening" state="listening" /></Profiler></StrictMode>);
    expect(screen.getByRole("img", { name: "Assistant listening" })).toBeTruthy();
    expect(frames.size).toBe(1);
    const commits = commit.mock.calls.length;
    frame(0); frame(40); frame(80);
    expect(frames.size).toBe(1);
    expect(commit).toHaveBeenCalledTimes(commits);
    view.unmount(); expect(frames.size).toBe(0);
  });
  it("stops and restarts on pause, viewport, document visibility, and reduced motion", () => {
    const view = render(<AiOrb />);
    act(() => intersect([{ isIntersecting: false }])); expect(frames.size).toBe(0);
    act(() => intersect([{ isIntersecting: true }])); expect(frames.size).toBe(1);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => document.dispatchEvent(new Event("visibilitychange"))); expect(frames.size).toBe(0);
    vi.restoreAllMocks();
    act(() => document.dispatchEvent(new Event("visibilitychange"))); expect(frames.size).toBe(1);
    reduced = true; act(() => motion()); expect(frames.size).toBe(0);
    expect(mocks.draw).toHaveBeenLastCalledWith(0, false);
    reduced = false; act(() => motion()); expect(frames.size).toBe(1);
    view.rerender(<AiOrb paused />); expect(frames.size).toBe(0);
    view.rerender(<AiOrb />); expect(frames.size).toBe(1);
  });
  it("replaces audio adapters only when the source changes and disposes on unmount", () => {
    const source = {} as AnalyserNode;
    const view = render(<AiOrb audioSource={source} />);
    view.rerender(<AiOrb audioSource={source} preset="ion" />);
    expect(mocks.dispose).not.toHaveBeenCalled();
    view.rerender(<AiOrb audioSource={{} as AnalyserNode} />);
    expect(mocks.dispose).toHaveBeenCalledOnce();
    view.unmount(); expect(mocks.dispose).toHaveBeenCalledTimes(2);
  });
  it("renders a decorative static orb without browser observers or animation APIs", () => {
    vi.stubGlobal("IntersectionObserver", undefined); vi.stubGlobal("ResizeObserver", undefined);
    vi.stubGlobal("requestAnimationFrame", undefined); vi.stubGlobal("matchMedia", undefined);
    const { container } = render(<AiOrb size={NaN} />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
    expect((container.firstElementChild as HTMLElement).style.width).toBe("240px");
    expect(frames.size).toBe(0);
    expect(mocks.draw).toHaveBeenLastCalledWith(0, false);
  });
  it("uses a static fallback when visibility observers are unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<AiOrb />);
    expect(frames.size).toBe(0);
    expect(mocks.draw).toHaveBeenLastCalledWith(0, false);
  });
});
