import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GRID_BACKGROUND_PATTERNS, GridBackground } from "./GridBackground";

const layer = (container: HTMLElement) =>
  container.querySelector('[aria-hidden="true"]') as HTMLElement;

describe("GridBackground", () => {
  it("renders a decorative grid with configurable spacing, opacity and fade", () => {
    const { container } = render(<GridBackground size={48} opacity={0.25} fade="radial" />);
    const grid = layer(container);
    expect(grid.style.backgroundSize).toBe("48px 48px");
    expect(grid.style.opacity).toBe("0.25");
    expect(grid.style.maskImage).toContain("radial-gradient");
  });

  it("draws crossing lines unless a pattern is asked for", () => {
    const { container } = render(<GridBackground />);
    expect(GRID_BACKGROUND_PATTERNS).toEqual(["grid", "dots"]);
    const image = layer(container).style.backgroundImage;
    expect(image).toContain("linear-gradient");
    expect(image).not.toContain("radial-gradient");
  });

  it("drops dots on the lines' cardinal points, on the same lattice", () => {
    const { container } = render(<GridBackground size={48} pattern="dots" dotSize={2} />);
    const grid = layer(container);
    // `at 0 0` is the alignment: each tile paints the quarter of a dot at its
    // origin and the neighbours complete it, so a dot lands where the lines
    // used to cross. Same backgroundSize for both patterns — switching
    // pattern in place keeps every crossing where it was.
    expect(grid.style.backgroundImage).toContain("radial-gradient(circle at 0 0");
    expect(grid.style.backgroundImage).toContain("2px");
    expect(grid.style.backgroundImage).not.toContain("linear-gradient");
    expect(grid.style.backgroundSize).toBe("48px 48px");
  });

  it("clamps the dot radius to something that still reads as a point", () => {
    const dots = (dotSize: number, size = 48) =>
      layer(render(<GridBackground size={size} pattern="dots" dotSize={dotSize} />).container).style
        .backgroundImage;
    expect(dots(0)).toContain("0.25px"); // floor: below this it disappears
    expect(dots(Number.NaN)).toContain("1px"); // guarded, not emitted as NaNpx
    expect(dots(48)).toContain("24px"); // half the cell, before it collides with its neighbour
  });

  it("fades dots and lines alike", () => {
    const { container } = render(<GridBackground pattern="dots" opacity={0.4} fade="vertical" />);
    const grid = layer(container);
    expect(grid.style.maskImage).toContain("linear-gradient");
    expect(grid.style.opacity).toBe("0.4");
  });
});
