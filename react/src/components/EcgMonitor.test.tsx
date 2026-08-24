import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import EcgMonitor, {
  ECG_STATE_COLORS,
  sampleEcg,
  type EcgMonitorState,
} from "./EcgMonitor";

const canvasOf = (container: HTMLElement) =>
  container.querySelector("canvas") as HTMLCanvasElement;

describe("EcgMonitor — rendering", () => {
  it("renders a labelled canvas", () => {
    const { container } = render(<EcgMonitor />);
    const canvas = canvasOf(container);
    expect(canvas).not.toBeNull();
    expect(canvas.getAttribute("role")).toBe("img");
    expect(canvas.getAttribute("aria-label")).toBe(
      "ECG monitor, status: healthy",
    );
  });

  it("announces the current state", () => {
    const { container, rerender } = render(<EcgMonitor state="unhealthy" />);
    expect(canvasOf(container).getAttribute("aria-label")).toBe(
      "ECG monitor, status: unhealthy",
    );
    rerender(<EcgMonitor state="warning" />);
    expect(canvasOf(container).getAttribute("aria-label")).toBe(
      "ECG monitor, status: warning",
    );
  });

  it("uses the fixed width and height by default", () => {
    const { container } = render(<EcgMonitor width={320} height={96} />);
    const canvas = canvasOf(container);
    expect(canvas.style.width).toBe("320px");
    expect(canvas.style.height).toBe("96px");
    expect(canvas.className).not.toContain("w-full");
  });

  it("fills the parent when useFullWidth is set", () => {
    const { container } = render(<EcgMonitor useFullWidth height={120} />);
    const canvas = canvasOf(container);
    expect(canvas.style.width).toBe("100%");
    expect(canvas.style.height).toBe("120px");
    expect(canvas.className).toContain("w-full");
  });

  it("merges a caller className", () => {
    const { container } = render(<EcgMonitor className="rounded-xl" />);
    expect(canvasOf(container).className).toContain("rounded-xl");
  });

  it("has one state color each for healthy, warning and unhealthy", () => {
    expect(Object.keys(ECG_STATE_COLORS)).toHaveLength(3);
    expect(ECG_STATE_COLORS.healthy).not.toBe(ECG_STATE_COLORS.warning);
    expect(ECG_STATE_COLORS.warning).not.toBe(ECG_STATE_COLORS.unhealthy);
  });
});

describe("sampleEcg — the rhythm", () => {
  const peak = (state: EcgMonitorState, tMs = 0) =>
    Math.max(
      ...Array.from({ length: 101 }, (_, i) => sampleEcg(0.2 + i / 1000, state, tMs)),
    );

  it("peaks at the R wave just after phase 0.245", () => {
    let best = -Infinity;
    let bestPhase = 0;
    for (let i = 0; i <= 400; i++) {
      const phase = i / 400;
      const value = sampleEcg(phase, "healthy");
      if (value > best) {
        best = value;
        bestPhase = phase;
      }
    }
    expect(best).toBeGreaterThan(0.85);
    expect(bestPhase).toBeGreaterThanOrEqual(0.2);
    expect(bestPhase).toBeLessThanOrEqual(0.3);
  });

  it("has a visible P wave before the QRS", () => {
    const pPeak = Math.max(
      ...Array.from({ length: 41 }, (_, i) => sampleEcg(0.13 + i / 1000, "healthy")),
    );
    expect(pPeak).toBeGreaterThan(0.05);
    expect(pPeak).toBeLessThan(0.5);
  });

  it("sits near baseline between beats", () => {
    expect(Math.abs(sampleEcg(0.6, "healthy"))).toBeLessThan(0.05);
  });

  it("stays perfectly flat when unhealthy", () => {
    for (let i = 0; i < 100; i++) {
      expect(sampleEcg(i / 100, "unhealthy", i * 10)).toBe(0);
    }
  });

  it("jitters the baseline when warning", () => {
    const clean = sampleEcg(0.6, "healthy", 1234);
    const jittered = sampleEcg(0.6, "warning", 1234);
    expect(Math.abs(jittered - clean)).toBeGreaterThan(0.005);
  });

  it("keeps the R spike intact under warning noise", () => {
    expect(peak("healthy")).toBeGreaterThan(0.85);
    expect(Math.abs(peak("warning") - peak("healthy"))).toBeLessThan(0.1);
  });
});
