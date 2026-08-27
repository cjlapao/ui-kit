import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import HelpButton from "./HelpButton";
import {
  CONTROL_SIZES,
  SURFACE_VARIANTS,
  TRUE_COLORS,
} from "../theme/Theme";

// The panel is a `createPortal` to document.body, so it is NOT inside the
// render() container — query document (§5.9). It is always in the DOM (hidden
// via opacity when closed), so it can be read without a click.
const panel = () =>
  document.querySelector('[role="dialog"]') as HTMLElement | null;

describe("HelpButton", () => {
  describe("tones — generated from the theme, no hand-written map", () => {
    it.each(TRUE_COLORS)("renders a panel with tone %s without throwing", (tone) => {
      const { unmount } = render(<HelpButton content="x" color={tone} />);
      expect(panel()).not.toBeNull();
      unmount();
    });

    it.each(TRUE_COLORS)(
      "the header carries %s's own accent (not the neutral fallback)",
      (tone) => {
        const { unmount } = render(<HelpButton content="x" color={tone} />);
        const html = panel()!.innerHTML;
        // band tint + heading copy (light + dark) — all in the tone's own
        // family. The old 12-entry table fell through to a fixed neutral for
        // the other nine tones, so each tone must paint its own tint.
        expect(html).toContain(`bg-${tone}-50/80`);
        expect(html).toContain(`dark:bg-${tone}-500/10`);
        expect(html).toContain(`text-${tone}-700`);
        expect(html).toContain(`dark:text-${tone}-200`);
        unmount();
      },
    );
  });

  describe("surface variant", () => {
    it("defaults to the elevated surface", () => {
      const { unmount } = render(<HelpButton content="x" />);
      expect(panel()!.innerHTML).toContain("shadow-xl");
      unmount();
    });
    it.each(SURFACE_VARIANTS)("applies the %s surface", (variant) => {
      const { unmount } = render(<HelpButton content="x" variant={variant} />);
      expect(panel()).not.toBeNull();
      unmount();
    });
    it("glass carries a backdrop blur", () => {
      const { unmount } = render(<HelpButton content="x" variant="glass" />);
      expect(panel()!.innerHTML).toContain("backdrop-blur");
      unmount();
    });
  });

  describe("loading", () => {
    it("shows a skeleton body, not the copy, while loading", () => {
      const { unmount } = render(
        <HelpButton content="The real help copy" loading />,
      );
      const html = panel()!.innerHTML;
      expect(html).toContain("animate-pulse");
      expect(html).not.toContain("The real help copy");
      unmount();
    });
    it("shows the copy when not loading", () => {
      const { unmount } = render(<HelpButton content="The real help copy" />);
      const html = panel()!.innerHTML;
      expect(html).toContain("The real help copy");
      expect(html).not.toContain("animate-pulse");
      unmount();
    });
  });

  describe("size — the shared ControlSize scale", () => {
    it.each(CONTROL_SIZES)("accepts control size %s", (size) => {
      const { unmount } = render(<HelpButton content="x" size={size} />);
      expect(panel()).not.toBeNull();
      unmount();
    });
  });
});
