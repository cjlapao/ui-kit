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
});
