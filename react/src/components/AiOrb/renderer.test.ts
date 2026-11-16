import { afterEach, describe, expect, it, vi } from "vitest";
import { createOrbRenderer } from "../../../../common/aiOrb/renderer";

function context() {
  return {
    clearRect: vi.fn(), createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    fillRect: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), drawImage: vi.fn(),
    setTransform: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(),
    stroke: vi.fn(), save: vi.fn(), restore: vi.fn(), translate: vi.fn(), rotate: vi.fn(),
    ellipse: vi.fn(), clip: vi.fn(), globalAlpha: 1,
  };
}
afterEach(() => vi.restoreAllMocks());

describe("AiOrb Canvas renderer", () => {
  it("keeps compact waves visible in CSS pixels regardless of pixel density", () => {
    const ctx = { ...context(), lineWidth: 0 };
    const strokes: number[] = [];
    ctx.stroke.mockImplementation(() => { strokes.push(ctx.lineWidth); });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    const canvas = document.createElement("canvas");
    const renderer = createOrbRenderer(canvas, { state: "listening", preset: "solar", quality: "high" })!;
    renderer.resize(64, 1); renderer.draw(0, false);
    expect(strokes[0] * 64 / 480).toBeGreaterThanOrEqual(1);
    const width = strokes[0]; strokes.length = 0;
    renderer.resize(64, 2); renderer.draw(0, false);
    expect(strokes[0]).toBe(width);
    expect(canvas.width).toBe(128);
    strokes.length = 0;
    renderer.update({ state: "listening", preset: "solar", quality: "high", appearance: { definition: 0 } });
    renderer.draw(0, false);
    expect(strokes[0]).toBe(1.4);
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(2);
  });
  it("uses fewer, larger flares and particles at compact sizes without raising work budgets", () => {
    const ctx = context();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    const renderer = createOrbRenderer(document.createElement("canvas"), { state: "speaking", preset: "solar", quality: "high" })!;
    renderer.resize(64, 2); ctx.ellipse.mockClear(); ctx.arc.mockClear();
    renderer.draw(1 / 60, true);
    expect(ctx.ellipse.mock.calls.length).toBeLessThan(24);
    expect(ctx.arc.mock.calls.length).toBeLessThan(25);
    // Inspect geometry through a typed view: the context stub records Canvas calls.
    const arcs = ctx.arc.mock.calls as unknown as number[][];
    expect(arcs[0][2] * 64 / 480).toBeGreaterThanOrEqual(0.8);
  });
  it("uses cached textures and enforces bounded work at high quality", () => {
    const ctx = context();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    const renderer = createOrbRenderer(document.createElement("canvas"), { state: "speaking", preset: "solar", quality: "high" })!;
    const audio = { waveform: new Float32Array(128), sample: vi.fn(() => 0.5), dispose: vi.fn() };
    ctx.ellipse.mockClear(); ctx.arc.mockClear();
    renderer.draw(1 / 60, true, audio);
    expect(ctx.ellipse).toHaveBeenCalledTimes(24); // 14 flares + 10 surface loops.
    expect(ctx.arc).toHaveBeenCalledTimes(25); // 24 particles + core clip.
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(2);
    renderer.draw(1 / 60, true, audio);
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(2);
    renderer.draw(0, false, audio);
    expect(audio.sample).toHaveBeenCalledTimes(2);
    expect(ctx.globalAlpha).toBe(1);
  });
  it("draws listening waveform with fixed sample count and skips idle sampling", () => {
    const ctx = context();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    const canvas = document.createElement("canvas");
    const renderer = createOrbRenderer(canvas, { state: "listening", preset: "ion", quality: "low" })!;
    renderer.resize(4000, 4);
    expect(canvas.width).toBe(1024);
    const audio = { waveform: new Float32Array(128).fill(0.4), sample: vi.fn(() => 0.8), dispose: vi.fn() };
    renderer.draw(1 / 24, true, audio);
    expect(ctx.lineTo).toHaveBeenCalledTimes(256);
    renderer.update({ state: "idle", preset: "ember", quality: "low" });
    renderer.draw(1 / 24, true, audio);
    expect(audio.sample).toHaveBeenCalledOnce();
  });
  it("keeps a state transition gradual while animated", () => {
    const ctx = context();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    const renderer = createOrbRenderer(document.createElement("canvas"), { state: "idle", preset: "solar", quality: "balanced" })!;
    renderer.update({ state: "listening", preset: "solar", quality: "balanced" });
    renderer.draw(0, true);
    expect(ctx.lineTo).not.toHaveBeenCalled();
    renderer.draw(1 / 30, true);
    expect(ctx.lineTo).toHaveBeenCalledTimes(384);
  });
  it("returns a static fallback signal when Canvas is unavailable", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(createOrbRenderer(document.createElement("canvas"), { state: "idle", preset: "ember", quality: "low" })).toBeNull();
  });
});
