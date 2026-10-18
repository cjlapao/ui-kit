import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeaderGroup from "./HeaderGroup";
import { TRUE_COLORS } from "../theme/Theme";

const root = (container: HTMLElement) =>
  container.firstElementChild as HTMLElement;

describe("HeaderGroup", () => {
  it("is a labelled group, not an anonymous div", () => {
    // It had no semantics at all — a cluster of related header controls should
    // announce itself as one.
    render(<HeaderGroup label="View controls">x</HeaderGroup>);
    expect(screen.getByRole("group", { name: "View controls" })).toBeTruthy();
  });

  describe("separator", () => {
    it("is on by default and can be turned off", () => {
      const { container } = render(<HeaderGroup>x</HeaderGroup>);
      expect(root(container).className).toContain("[&+&]:ml-");

      const { container: without } = render(
        <HeaderGroup divider={false}>x</HeaderGroup>,
      );
      expect(without.firstElementChild!.className).not.toContain("[&+&]:ml-");
    });

    it("derives its offset from the gap rather than a second hardcoded value", () => {
      // `ml-2` and `left-[-4px]` were separate literals that had to be kept in
      // sync by hand; both now read one custom property.
      const { container } = render(<HeaderGroup gap="xl">x</HeaderGroup>);
      const style = root(container).style;
      expect(style.getPropertyValue("--header-group-gap")).toBe("24px");
      // Offset comes from the same gap (rounded to whole pixels), not a
      // second hardcoded value.
      expect(style.getPropertyValue("--header-group-sep-x")).toBe("-13px");
      expect(root(container).className).toContain(
        "[&+&::before]:left-[var(--header-group-sep-x)]",
      );
    });

    it("steps with gap", () => {
      const seen = new Set<string>();
      for (const gap of ["xs", "sm", "md", "lg", "xl"] as const) {
        const { container, unmount } = render(
          <HeaderGroup gap={gap}>x</HeaderGroup>,
        );
        seen.add(root(container).style.getPropertyValue("--header-group-gap"));
        unmount();
      }
      expect(seen.size).toBe(5);
    });

    it("derives its colour from the text colour when untoned", () => {
      // The old rule was a flat `bg-neutral-300` with no dark partner, so it
      // all but vanished on a dark header.
      const { container } = render(<HeaderGroup>x</HeaderGroup>);
      expect(
        root(container).style.getPropertyValue("--header-group-divider"),
      ).toContain("currentColor");
    });

    it.each(TRUE_COLORS)("accepts tone %s without a safelist entry", (tone) => {
      const { container } = render(<HeaderGroup tone={tone}>x</HeaderGroup>);
      expect(
        root(container).style.getPropertyValue("--header-group-divider"),
      ).toBe(`var(--color-${tone}-400)`);
    });
  });

  describe("item spacing", () => {
    it("separates its own items, which it never used to", () => {
      const { container } = render(
        <HeaderGroup itemGap="lg">
          <span>a</span>
          <span>b</span>
        </HeaderGroup>,
      );
      const inner = root(container).firstElementChild as HTMLElement;
      expect(inner.className).toContain("gap-4");
    });

    it("steps with itemGap", () => {
      const seen = new Set<string>();
      for (const itemGap of ["xs", "sm", "md", "lg", "xl"] as const) {
        const { container, unmount } = render(
          <HeaderGroup itemGap={itemGap}>x</HeaderGroup>,
        );
        seen.add(
          (root(container).firstElementChild as HTMLElement).className.match(
            /gap-\d+/,
          )![0],
        );
        unmount();
      }
      expect(seen.size).toBe(5);
    });
  });

  describe("separatorSize", () => {
    it("defaults to a 1px rule centred in the gutter", () => {
      const { container } = render(<HeaderGroup gap="sm">x</HeaderGroup>);
      const style = root(container).style;
      expect(style.getPropertyValue("--header-group-sep-w")).toBe("1px");
      // −round((8 + 1) / 2) = −5px: centred with whole-pixel edges.
      expect(style.getPropertyValue("--header-group-sep-x")).toBe("-5px");
    });

    it("steps on the shared control scale", () => {
      const seen: Record<string, string> = {};
      for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
        const { container, unmount } = render(
          <HeaderGroup separatorSize={size}>x</HeaderGroup>,
        );
        seen[size] = root(container).style.getPropertyValue(
          "--header-group-sep-w",
        );
        unmount();
      }
      expect(seen).toEqual({
        xs: "1px",
        sm: "2px",
        md: "3px",
        lg: "4px",
        xl: "6px",
      });
    });

    it("accepts raw pixels", () => {
      const { container } = render(
        <HeaderGroup gap="md" separatorSize={2}>
          x
        </HeaderGroup>,
      );
      const style = root(container).style;
      expect(style.getPropertyValue("--header-group-sep-w")).toBe("2px");
      expect(style.getPropertyValue("--header-group-sep-x")).toBe("-7px");
    });

    it("draws with no transform, so browsers pixel-snap the rule", () => {
      // A transform would take the 1px rule out of paint-time snapping and
      // make its thickness depend on where the header happens to land.
      const { container } = render(<HeaderGroup>x</HeaderGroup>);
      expect(root(container).className).not.toMatch(/translate/);
    });
  });

  it("takes its copy colour from the surface", () => {
    const { container } = render(<HeaderGroup>x</HeaderGroup>);
    // Was `text-black dark:text-white`, which ignores the surface it sits on.
    expect(root(container).className).not.toContain("text-black");
    expect(root(container).className).toContain("text-neutral-900");
  });

  it("keeps the caller's className and children", () => {
    const { container } = render(
      <HeaderGroup className="shrink-0">
        <span>content</span>
      </HeaderGroup>,
    );
    expect(root(container).className).toContain("shrink-0");
    expect(screen.getByText("content")).toBeTruthy();
  });
});
