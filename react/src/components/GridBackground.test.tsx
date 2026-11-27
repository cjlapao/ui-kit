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
    // A full dot is centered in each tile; shifting by half a tile puts its
    // center on the same crossing as the grid lines.
    expect(grid.style.backgroundImage).toContain("radial-gradient(circle");
    expect(grid.style.backgroundImage).not.toContain("at 0 0");
    expect(grid.style.backgroundPosition).toBe("-24px -24px");
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

  it("adds a lattice-aligned shimmer only when enabled for dots", () => {
    const { container, rerender } = render(<GridBackground pattern="dots" />);
    expect(container.querySelector(".cj-grid-background-shimmer")).toBeNull();
    rerender(<GridBackground pattern="dots" shimmer size={48} dotSize={2} fade="radial" />);
    const grid = layer(container);
    const shimmer = container.querySelector(".cj-grid-background-shimmer") as HTMLElement;
    expect(shimmer.style.backgroundImage).toBe(grid.style.backgroundImage);
    expect(shimmer.style.backgroundSize).toBe(grid.style.backgroundSize);
    expect(shimmer.style.backgroundPosition).toBe(grid.style.backgroundPosition);
    // The highlight must composite over the base, not inside its opacity group.
    expect(shimmer.parentElement?.parentElement).toBe(grid.parentElement);
    expect(shimmer.parentElement?.style.opacity).toBe("0.48");
    expect(grid.style.maskImage).toContain("radial-gradient");
    rerender(<GridBackground pattern="grid" shimmer />);
    expect(container.querySelector(".cj-grid-background-shimmer")).toBeNull();
  });
});
