import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Shimmer, { type ShimmerSpeed } from "./Shimmer";
import { TRUE_COLORS } from "../theme/Theme";

const span = (container: HTMLElement) =>
  container.querySelector(".shimmer-text") as HTMLElement;

describe("Shimmer", () => {
  it("renders its children inside a span carrying shimmer-text", () => {
    const { container } = render(<Shimmer>Thinking…</Shimmer>);
    expect(span(container).textContent).toBe("Thinking…");
    expect(span(container).classList).toContain("shimmer-text");
  });

  it("defaults to the normal sweep period", () => {
    const { container } = render(<Shimmer>Waiting</Shimmer>);
    expect(span(container).style.getPropertyValue("--shimmer-dur")).toBe(
      "2000ms",
    );
  });

  it("maps each speed to its period", () => {
    const periods: [ShimmerSpeed, string][] = [
      ["slow", "3200ms"],
      ["normal", "2000ms"],
      ["fast", "1200ms"],
    ];
    for (const [speed, duration] of periods) {
      const { container } = render(<Shimmer speed={speed}>x</Shimmer>);
      expect(span(container).style.getPropertyValue("--shimmer-dur")).toBe(
        duration,
      );
    }
  });

  it("reads a tone from its own Tailwind variable", () => {
    const { container } = render(<Shimmer tone="violet">x</Shimmer>);
    expect(span(container).style.getPropertyValue("--shimmer-c")).toBe(
      "var(--color-violet-400)",
    );
  });

  it("covers every tone with its own variable", () => {
    for (const tone of TRUE_COLORS) {
      const { container } = render(<Shimmer tone={tone}>x</Shimmer>);
      expect(span(container).style.getPropertyValue("--shimmer-c")).toBe(
        `var(--color-${tone}-400)`,
      );
    }
  });

  it("leaves --shimmer-c unset without a tone (inherit mode)", () => {
    const { container } = render(<Shimmer>x</Shimmer>);
    expect(span(container).style.getPropertyValue("--shimmer-c")).toBe("");
  });

  it("merges a caller className after the base class", () => {
    const { container } = render(
      <Shimmer className="font-semibold">x</Shimmer>,
    );
    expect(span(container).className).toBe("shimmer-text font-semibold");
  });

  it("passes status semantics through to the span", () => {
    const { container } = render(
      <Shimmer role="status" aria-live="polite">
        Thinking…
      </Shimmer>,
    );
    expect(span(container).getAttribute("role")).toBe("status");
    expect(span(container).getAttribute("aria-live")).toBe("polite");
  });
});
