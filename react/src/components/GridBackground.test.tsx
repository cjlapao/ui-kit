import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GridBackground } from "./GridBackground";

describe("GridBackground", () => {
  it("renders a decorative grid with configurable spacing, opacity and fade", () => {
    const { container } = render(<GridBackground size={48} opacity={0.25} fade="radial" />);
    const grid = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(grid.style.backgroundSize).toBe("48px 48px");
    expect(grid.style.opacity).toBe("0.25");
    expect(grid.style.maskImage).toContain("radial-gradient");
  });
});
