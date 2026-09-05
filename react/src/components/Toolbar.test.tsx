import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Toolbar from "./Toolbar";

const regions = (root: HTMLElement) =>
  Array.from(root.children) as HTMLElement[];

describe("Toolbar", () => {
  it("is a toolbar", () => {
    render(<Toolbar start={<button>a</button>} />);
    expect(screen.getByRole("toolbar")).toBeTruthy();
  });

  it("can name itself for assistive tech", () => {
    render(<Toolbar aria-label="Formatting" start={<button>a</button>} />);
    expect(screen.getByRole("toolbar")).toHaveAccessibleName("Formatting");
  });

  it("lays out start, center and end in that order", () => {
    render(
      <Toolbar
        start={<span data-testid="s" />}
        center={<span data-testid="c" />}
        end={<span data-testid="e" />}
      />,
    );
    const groups = regions(screen.getByRole("toolbar"));
    expect(groups).toHaveLength(3);
    expect(groups[0].querySelector("[data-testid=s]")).toBeTruthy();
    expect(groups[1].querySelector("[data-testid=c]")).toBeTruthy();
    expect(groups[2].querySelector("[data-testid=e]")).toBeTruthy();
  });

  it("keeps the empty regions in the DOM, so `end` alone still parks right", () => {
    render(<Toolbar end={<span data-testid="e" />} />);
    const groups = regions(screen.getByRole("toolbar"));
    expect(groups).toHaveLength(3);
    expect(groups[0].childElementCount).toBe(0);
    expect(groups[2].querySelector("[data-testid=e]")).toBeTruthy();
  });

  it("appends children as a fourth group after the regions", () => {
    render(
      <Toolbar start={<span data-testid="s" />}>
        <span data-testid="x" />
      </Toolbar>,
    );
    const groups = regions(screen.getByRole("toolbar"));
    expect(groups).toHaveLength(4);
    expect(groups[0].querySelector("[data-testid=s]")).toBeTruthy();
    expect(groups[3].querySelector("[data-testid=x]")).toBeTruthy();
  });

  it("passes attributes through and merges the class", () => {
    render(
      <Toolbar
        id="tb"
        data-testid="tb"
        aria-label="Filters"
        className="border-0 bg-transparent"
      />,
    );
    const root = screen.getByTestId("tb");
    expect(root.id).toBe("tb");
    expect(root.className).toContain("border-0");
    expect(root.className).toContain("rounded-2xl");
  });

  // — Panel surface —

  it("wears the Panel variant set", () => {
    const { rerender } = render(<Toolbar />);
    expect(screen.getByRole("toolbar").className).toContain("bg-white/90");
    rerender(<Toolbar variant="elevated" />);
    expect(screen.getByRole("toolbar").className).toContain("shadow-xl");
    rerender(<Toolbar variant="simple" />);
    expect(screen.getByRole("toolbar").className).toContain("bg-neutral-100");
  });

  it("tints the surface by tone, Panel-style", () => {
    render(<Toolbar variant="tonal" tone="indigo" />);
    expect(screen.getByRole("toolbar").className).toContain("indigo");
  });

  it("takes the shared corner and padding scales", () => {
    const { rerender } = render(<Toolbar corner="none" />);
    expect(screen.getByRole("toolbar").className).toContain("rounded-none");
    rerender(<Toolbar corner="rounded-xl" />);
    expect(screen.getByRole("toolbar").className).toContain("rounded-4xl");
    rerender(<Toolbar padding="none" />);
    expect(screen.getByRole("toolbar").className).toContain("p-0");
    rerender(<Toolbar padding="sm" />);
    expect(screen.getByRole("toolbar").className).toContain("p-4");
  });
});
