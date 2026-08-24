import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import EmptyState, { EMPTY_STATE_VARIANTS } from "./EmptyState";
import { TRUE_COLORS } from "../theme/Theme";

describe("EmptyState", () => {
  describe("tones", () => {
    it("paints every tone from the scale, with no gaps", () => {
      // Both kits carried a hand-written map: React had five static neutral
      // entries plus a builder, Vue had one entry in which `neutral` resolved
      // to *slate* classes. So the same tone rendered differently per kit.
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(
          <EmptyState tone={tone} title="t" />,
        );
        expect(container.innerHTML).toContain(`text-${tone}-500`);
        unmount();
      }
    });

    it("resolves `neutral` to neutral, not slate", () => {
      const { container } = render(<EmptyState tone="neutral" title="t" />);
      expect(container.innerHTML).toContain("neutral-500");
      expect(container.innerHTML).not.toContain("slate-500");
    });

    it("accepts `color` as an alias for `tone`", () => {
      // `SplitView` passed `color` at three call sites; it was not a prop, so
      // it landed on the DOM as an attribute and tinted nothing.
      const { container } = render(<EmptyState color="violet" title="t" />);
      expect(container.innerHTML).toContain("text-violet-500");
    });

    it("tints only the glyph with `iconColor`", () => {
      const { container } = render(
        <EmptyState tone="blue" iconColor="rose" title="t" />,
      );
      expect(container.innerHTML).toContain("text-rose-500");
      expect(container.innerHTML).not.toContain("text-blue-500");
    });
  });

  describe("surface", () => {
    it("renders every variant", () => {
      for (const variant of EMPTY_STATE_VARIANTS) {
        const { container, unmount } = render(
          <EmptyState variant={variant} title="t" />,
        );
        expect(container.firstElementChild).not.toBeNull();
        unmount();
      }
    });

    it("draws no card at all for `plain`", () => {
      const { container } = render(<EmptyState variant="plain" title="t" />);
      const root = container.firstElementChild!;
      expect(root.className).not.toMatch(/\bborder\b/);
      expect(root.className).not.toContain("outline-dashed");
      expect(root.className).not.toContain("bg-");
    });

    it("draws the dashed rule as an outline, not a border", () => {
      // A `border-2` layered on Panel's own `border` is a same-specificity
      // collision decided by emission order. An outline sits on top of any
      // variant and takes no space in the box model.
      const { container } = render(
        <EmptyState tone="emerald" title="t" dashed />,
      );
      const root = container.firstElementChild!;
      expect(root.className).toContain("outline-dashed");
      expect(root.className).toContain("outline-emerald-300");
    });

    it("can drop the dashed rule", () => {
      const { container } = render(<EmptyState title="t" dashed={false} />);
      expect(container.firstElementChild!.className).not.toContain(
        "outline-dashed",
      );
    });

    it("treats the two deprecated flags together as `plain`", () => {
      const { container } = render(
        <EmptyState title="t" disableBorder transparentBackground />,
      );
      expect(container.firstElementChild!.className).not.toContain(
        "outline-dashed",
      );
    });
  });

  describe("content", () => {
    it("renders without a title", () => {
      // `title` was required in React and optional in Vue.
      render(<EmptyState subtitle="Nothing here yet" />);
      expect(screen.getByText("Nothing here yet")).toBeTruthy();
    });

    it("names the region with its title", () => {
      const { container } = render(<EmptyState title="No results" />);
      const root = container.firstElementChild!;
      const labelId = root.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      expect(root.querySelector(`[id="${labelId}"]`)?.textContent).toBe(
        "No results",
      );
    });

    it("breaks long words without shredding prose", () => {
      // It was `break-all`, which splits ordinary sentences mid-word.
      const { container } = render(<EmptyState title="t" subtitle="s" />);
      expect(container.innerHTML).toContain("break-words");
      expect(container.innerHTML).not.toContain("break-all");
    });
  });

  describe("action", () => {
    it("renders from a label alone", () => {
      // It used to require `actionLabel` *and* `onAction`, so a label whose
      // handler was resolved conditionally rendered nothing.
      render(<EmptyState title="t" actionLabel="Create" />);
      expect(screen.getByRole("button", { name: "Create" })).toBeTruthy();
    });

    it("calls the handler", () => {
      const onAction = vi.fn();
      render(<EmptyState title="t" actionLabel="Create" onAction={onAction} />);
      fireEvent.click(screen.getByRole("button", { name: "Create" }));
      expect(onAction).toHaveBeenCalledOnce();
    });

    it("takes arbitrary footer content instead", () => {
      render(
        <EmptyState
          title="t"
          actionLabel="Ignored"
          actions={<button type="button">Custom</button>}
        />,
      );
      expect(screen.getByRole("button", { name: "Custom" })).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Ignored" })).toBeNull();
    });

    it("defaults the button tone to the empty state's", () => {
      const { container } = render(
        <EmptyState title="t" tone="amber" actionLabel="Create" />,
      );
      expect(container.querySelector("button")!.getAttribute("data-color")).toBe(
        "amber",
      );
    });
  });

  describe("size", () => {
    it("scales the icon, type and action together", () => {
      const { container: small } = render(<EmptyState size="xs" title="t" actionLabel="a" />);
      const { container: large } = render(<EmptyState size="xl" title="t" actionLabel="a" />);

      expect(small.innerHTML).toContain("h-8 w-8");
      expect(small.innerHTML).toContain("text-sm");
      expect(small.querySelector("button")!.getAttribute("data-size")).toBe("xs");

      expect(large.innerHTML).toContain("h-16 w-16");
      expect(large.innerHTML).toContain("text-2xl");
      expect(large.querySelector("button")!.getAttribute("data-size")).toBe("md");
    });

    it("still honours the deprecated `textSize`", () => {
      const { container } = render(<EmptyState textSize="xl" title="t" />);
      expect(container.innerHTML).toContain("text-2xl");
    });

    it("lets `size` win over `textSize`", () => {
      const { container } = render(
        <EmptyState size="xs" textSize="xl" title="t" />,
      );
      expect(container.innerHTML).toContain("h-8 w-8");
    });
  });

  describe("icon", () => {
    it("sizes the glyph once", () => {
      // The old code passed the explicit dimensions *and* the icon scale, and
      // its `isValidElement` branch applied neither.
      const { container } = render(<EmptyState title="t" />);
      const glyphBox = container.querySelector("svg")!.parentElement!;
      expect(glyphBox.className).toContain("h-12 w-12");
      expect(glyphBox.className.split(" ").filter((c) => /^h-\d/.test(c))).toHaveLength(1);
    });

    it("sizes a node icon too", () => {
      const { container } = render(
        <EmptyState title="t" icon={<svg data-testid="custom" />} />,
      );
      expect(container.querySelector("svg")!.getAttribute("class")).toContain(
        "h-12 w-12",
      );
    });

    it("gives the disc a partner in both themes", () => {
      // It was `dark:bg-white/5` with nothing in light mode, and square.
      const { container } = render(<EmptyState title="t" tone="sky" />);
      const disc = container.querySelector("svg")!.closest("div")!.className;
      expect(disc).toContain("bg-sky-100/70");
      expect(disc).toContain("dark:bg-sky-500/15");
      expect(disc).toContain("rounded-full");
    });

    it("can drop the disc and the glyph", () => {
      const { container: noDisc } = render(
        <EmptyState title="t" iconBackground={false} />,
      );
      expect(
        noDisc.querySelector("svg")!.closest("div")!.className,
      ).not.toContain("bg-");

      const { container: noIcon } = render(
        <EmptyState title="t" showIcon={false} />,
      );
      expect(noIcon.querySelector("svg")).toBeNull();
    });
  });
});
