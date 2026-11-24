import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Panel from "./Panel";

describe("nested panel surfaces", () => {
  it.each(["simple", "tonal", "subtle", "glass", "liquid-glass"] as const)("steps matching %s panels and bounds deep nesting", (variant) => {
    const { container } = render(<Panel variant={variant} tone="neutral"><Panel variant={variant} tone="neutral"><Panel variant={variant} tone="neutral"><Panel variant={variant} tone="neutral"><Panel variant={variant} tone="neutral">Leaf</Panel></Panel></Panel></Panel></Panel>);
    const panels = [...container.querySelectorAll("section")];
    const wash = (n: number) => panels[n].querySelector(":scope > [data-nested-panel-wash]");
    expect(wash(0)).toBeNull();
    expect(wash(1)?.className).toContain("bg-black/[0.04]");
    expect(wash(2)?.className).toContain("bg-black/[0.08]");
    expect(wash(3)?.className).toContain("bg-black/[0.12]");
    expect(wash(4)?.className).toContain("bg-black/[0.12]");
    expect(wash(1)).toHaveAttribute("aria-hidden", "true");
  });

  it("resets on differences, opt-outs and background overrides", () => {
    const { container } = render(<Panel variant="simple" tone="blue"><Panel variant="simple" tone="rose" /><Panel variant="tonal" tone="blue" /><Panel variant="simple" tone="blue" nestedSurface={false}><Panel variant="simple" tone="blue" /></Panel><Panel variant="simple" tone="blue" backgroundColor="rose" /><Panel variant="simple" tone="blue" /></Panel>);
    const panels = [...container.querySelectorAll("section")];
    expect(panels.slice(0, 6).every(p => !p.querySelector(":scope > [data-nested-panel-wash]"))).toBe(true);
    expect(panels[6].querySelector(":scope > [data-nested-panel-wash]")).not.toBeNull();
  });

  it.each(["simple", "tonal", "subtle", "glass", "liquid-glass"] as const)("raisedSurface forces the first depth step on %s without a parent", (variant) => {
    const { container } = render(<Panel variant={variant} tone="neutral" raisedSurface>Raised</Panel>);
    const wash = container.querySelector("section > [data-nested-panel-wash]");
    expect(wash?.className).toContain("bg-black/[0.04]");
    expect(wash).toHaveAttribute("aria-hidden", "true");
  });

  it("raisedSurface survives nestedSurface opt-outs and background overrides", () => {
    const { container } = render(<Panel variant="tonal" tone="neutral" raisedSurface nestedSurface={false} />);
    expect(container.querySelector("section > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.04]");
    const { container: painted } = render(<Panel variant="tonal" tone="neutral" raisedSurface backgroundColor="neutral" />);
    expect(painted.querySelector("section > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.04]");
  });

  it("raisedSurface is a no-op outside the ladder's tinted variants", () => {
    const { container } = render(<div><Panel variant="elevated" tone="neutral" raisedSurface /><Panel variant="outlined" tone="neutral" raisedSurface /><Panel variant="none" raisedSurface /></div>);
    expect(container.querySelector("[data-nested-panel-wash]")).toBeNull();
  });

  it("raisedSurface floors, never lowers — auto-nested cards keep their step", () => {
    const { container } = render(<Panel variant="tonal" tone="neutral"><Panel variant="tonal" tone="neutral"><Panel variant="tonal" tone="neutral" raisedSurface>Leaf</Panel></Panel></Panel>);
    const panels = [...container.querySelectorAll("section")];
    expect(panels[2].querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.08]");
  });

  it("the ladder continues off a raised parent — a matching child steps to depth 2", () => {
    const { container } = render(<Panel variant="tonal" tone="neutral" raisedSurface><Panel variant="tonal" tone="neutral">Child</Panel></Panel>);
    const panels = [...container.querySelectorAll("section")];
    expect(panels[0].querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.04]");
    expect(panels[1].querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.08]");
  });
});
