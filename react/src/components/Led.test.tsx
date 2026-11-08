import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Led } from "./Led";

describe("Led", () => {
  it("exposes a named image only when labelled", () => {
    const { container, rerender } = render(<Led />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    rerender(<Led label="Connected" />);
    expect(screen.getByRole("img", { name: "Connected" })).not.toHaveAttribute("aria-hidden");
  });
  it("turns motion and glow off without losing the configured tone", () => {
    const { container } = render(<Led tone="rose" animation="pulse" lit={false} />);
    expect(container.firstElementChild).toHaveAttribute("data-animation", "none");
    expect(container.firstElementChild).toHaveClass("text-rose-500", "dark:text-rose-400");
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--led-glow")).toBe("0");
  });
  it("clamps unsafe settings and forwards ref and accessible name overrides", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Led ref={ref} glowIntensity={9} duration={10} label="Original" aria-label="Running" />);
    expect(ref.current).toBe(screen.getByRole("img", { name: "Running" }));
    expect(ref.current?.style.getPropertyValue("--led-glow")).toBe("3");
    expect(ref.current?.style.getPropertyValue("--led-duration")).toBe("600ms");
  });
});
