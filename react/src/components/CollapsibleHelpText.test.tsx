import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CollapsibleHelpText, {
  COLLAPSIBLE_HELP_VARIANTS,
} from "./CollapsibleHelpText";
import { TRUE_COLORS, getSurfacePaddingClass } from "../theme/Theme";

const LONG =
  "We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds and workspace sharing.";
const SHORT = "Short enough that nothing truncates.";

describe("CollapsibleHelpText", () => {
  describe("tones", () => {
    // The tone map was hand-written and covered 6 of the 21 colours, falling
    // back to `toneTokens.neutral` — which was not in the map either. Every
    // other tone dereferenced undefined and threw.
    it.each(TRUE_COLORS)("renders with tone %s", (tone) => {
      expect(() =>
        render(<CollapsibleHelpText text={SHORT} tone={tone} showIcon />),
      ).not.toThrow();
    });
  });

  describe("surfaces", () => {
    it.each(COLLAPSIBLE_HELP_VARIANTS)("renders the %s variant", (variant) => {
      const { container } = render(
        <CollapsibleHelpText text={SHORT} variant={variant} />,
      );
      expect(screen.getByText(SHORT)).toBeTruthy();

      const panel = container.querySelector("section[data-variant]");
      if (variant === "plain") {
        // `plain` deliberately has no card, so it inherits whatever surface the
        // app put it on.
        expect(panel).toBeNull();
      } else {
        expect(panel).not.toBeNull();
      }
    });

    it("keeps `card` as an alias of the outlined Panel", () => {
      const { container } = render(
        <CollapsibleHelpText text={SHORT} variant="card" />,
      );
      expect(
        container.querySelector("section[data-variant]")?.getAttribute(
          "data-variant",
        ),
      ).toBe("outlined");
    });
  });

  describe("truncation", () => {
    it("shows no toggle when the copy fits", () => {
      render(<CollapsibleHelpText text={SHORT} maxLength={160} />);
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("cuts on a word boundary, not mid-word", () => {
      render(<CollapsibleHelpText text={LONG} maxLength={60} />);
      const shown = screen.getByRole("button").textContent ?? "";
      const summary = shown.replace(/…$/, "").trim();
      // The summary is a prefix of the source, and it stops on a boundary —
      // the next character is never another letter. The old version sliced at
      // the exact character limit, so summaries ended "…configu...".
      expect(LONG.startsWith(summary)).toBe(true);
      expect(LONG[summary.length]).toMatch(/[^A-Za-z]/);
      expect(shown.endsWith("…")).toBe(true);
    });

    it("expands to the full copy and back", () => {
      render(<CollapsibleHelpText text={LONG} maxLength={60} />);
      const button = screen.getByRole("button");
      expect(button.textContent).not.toContain("workspace sharing");

      fireEvent.click(button);
      expect(button.textContent).toContain("workspace sharing");

      fireEvent.click(button);
      expect(button.textContent).not.toContain("workspace sharing");
    });
  });

  describe("accessibility", () => {
    it("gives the trigger a stable name instead of the whole paragraph", () => {
      render(<CollapsibleHelpText text={LONG} maxLength={60} />);
      const button = screen.getByRole("button", { name: "Show more" });
      expect(button.getAttribute("aria-expanded")).toBe("false");

      fireEvent.click(button);
      expect(
        screen.getByRole("button", { name: "Show less" }).getAttribute(
          "aria-expanded",
        ),
      ).toBe("true");
    });

    it("points aria-controls at the region it toggles", () => {
      const { container } = render(
        <CollapsibleHelpText text={LONG} maxLength={60} />,
      );
      const id = screen.getByRole("button").getAttribute("aria-controls");
      expect(id).toBeTruthy();
      expect(container.querySelector(`#${CSS.escape(id!)}`)).not.toBeNull();
    });

    it("gives the trigger a focus ring with an actual width", () => {
      render(<CollapsibleHelpText text={LONG} maxLength={60} />);
      // The old tokens set a ring colour but never `ring-2`, so there was no
      // visible focus indicator at all.
      const classes = screen.getByRole("button").className;
      expect(classes).toContain("focus-visible:ring-2");
      expect(classes).toMatch(/focus-visible:ring-[a-z]+-400/);
    });
  });

  describe("layout", () => {
    it("puts the inset on the trigger so its hover wash is full-bleed", () => {
      const { container } = render(
        <CollapsibleHelpText text={LONG} maxLength={60} padding="md" />,
      );
      const button = screen.getByRole("button");
      // The card must carry no padding of its own, or the wash floats inside it.
      expect(button.className).toContain(getSurfacePaddingClass("md"));
      expect(button.className).toContain("rounded-[inherit]");
      expect(
        container.querySelector("section[data-variant]")?.className,
      ).toContain("p-0");
    });

    it("does not round off mid-surface when children follow", () => {
      render(
        <CollapsibleHelpText text={LONG} maxLength={60}>
          <span>More</span>
        </CollapsibleHelpText>,
      );
      expect(screen.getByRole("button").className).toContain("rounded-b-none");
      expect(screen.getByText("More")).toBeTruthy();
    });
  });
});
