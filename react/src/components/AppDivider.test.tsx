import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppDivider, { APP_DIVIDER_VARIANTS } from "./AppDivider";
import { TRUE_COLORS } from "../theme/Theme";

const rule = (container: HTMLElement) =>
  container.querySelector<HTMLElement>("span[aria-hidden] > span, span > span[aria-hidden]") ??
  container.querySelector<HTMLElement>("span[aria-hidden='true']")!;

const root = (container: HTMLElement) =>
  container.firstElementChild as HTMLElement;

describe("AppDivider", () => {
  describe("props that used to do nothing", () => {
    // `height`, `width` and `margin` were declared in the props interface and
    // never destructured — three documented props with no effect whatsoever.
    it("honours the deprecated height as a length", () => {
      const { container } = render(<AppDivider height={80} />);
      expect(root(container).style.height).toBe("80px");
    });

    it("honours the deprecated width as a thickness", () => {
      const { container } = render(<AppDivider width={5} />);
      expect(rule(container).style.borderLeftWidth).toBe("5px");
    });

    it("honours the deprecated margin as spacing", () => {
      const { container } = render(<AppDivider margin="2rem" />);
      expect(root(container).style.marginInline).toBe("2rem");
    });
  });

  describe("geometry", () => {
    it("defaults to a vertical hairline", () => {
      const { container } = render(<AppDivider />);
      expect(root(container).style.height).toBe("1.5rem");
      // `w-[1.2px]` rounded unpredictably across displays.
      expect(rule(container).style.borderLeftWidth).toBe("1px");
      expect(rule(container).style.borderTopWidth).toBe("0px");
    });

    it("switches axis when horizontal", () => {
      const { container } = render(<AppDivider orientation="horizontal" />);
      expect(root(container).style.width).toBe("100%");
      expect(rule(container).style.borderTopWidth).toBe("1px");
      expect(rule(container).style.borderLeftWidth).toBe("0px");
    });

    it("steps the thickness with size", () => {
      const seen = new Set<string>();
      for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
        const { container, unmount } = render(<AppDivider size={size} />);
        seen.add(rule(container).style.borderLeftWidth);
        unmount();
      }
      expect(seen.size).toBe(5);
    });
  });

  describe("the rule actually has size", () => {
    // The line span carried only `self-stretch`, which stretches on the cross
    // axis — so a horizontal rule had zero width and painted nothing.
    it("fills its wrapper across when horizontal", () => {
      const { container } = render(<AppDivider orientation="horizontal" />);
      expect(rule(container).className).toContain("w-full");
    });

    it("stretches along its wrapper when vertical", () => {
      const { container } = render(<AppDivider />);
      expect(rule(container).className).toContain("self-stretch");
      expect(rule(container).className).not.toContain("w-full");
    });
  });

  describe("appearance", () => {
    it.each(APP_DIVIDER_VARIANTS)("renders the %s variant", (variant) => {
      const { container } = render(<AppDivider variant={variant} />);
      if (variant === "gradient") {
        expect(rule(container).style.backgroundImage).toContain(
          "linear-gradient",
        );
      } else {
        expect(rule(container).style.borderStyle).toBe(variant);
      }
    });

    it.each(TRUE_COLORS)("accepts tone %s", (tone) => {
      const { container } = render(<AppDivider tone={tone} />);
      expect(rule(container).className).toContain(`border-${tone}-400`);
    });

    it("falls back to the surface's divider colour with no tone", () => {
      const { container } = render(<AppDivider />);
      // Not a hardcoded pair: this is the token the surrounding surface
      // publishes, so it adapts on glass.
      expect(rule(container).className).toContain("border-neutral-200");
    });

    it("builds the gradient from the tone's colour variable", () => {
      const { container } = render(
        <AppDivider variant="gradient" tone="violet" />,
      );
      expect(rule(container).style.backgroundImage).toContain(
        "var(--color-violet-400)",
      );
    });
  });

  describe("label", () => {
    it("renders no label by default", () => {
      render(<AppDivider />);
      expect(screen.queryByText("OR")).toBeNull();
    });

    it("sets a label between two rules", () => {
      const { container } = render(<AppDivider label="OR" />);
      expect(screen.getByText("OR")).toBeTruthy();
      expect(container.querySelectorAll("span[aria-hidden='true']")).toHaveLength(
        2,
      );
    });
  });

  describe("accessibility", () => {
    it("is decoration when unlabelled", () => {
      const { container } = render(<AppDivider />);
      expect(root(container).getAttribute("aria-hidden")).toBe("true");
      expect(root(container).getAttribute("role")).toBeNull();
    });

    it("is a separator when labelled", () => {
      const { container } = render(
        <AppDivider label="OR" orientation="horizontal" />,
      );
      expect(root(container).getAttribute("role")).toBe("separator");
      expect(root(container).getAttribute("aria-orientation")).toBe(
        "horizontal",
      );
    });

    it("lets the caller override either way", () => {
      const { container } = render(<AppDivider decorative={false} />);
      expect(root(container).getAttribute("role")).toBe("separator");
    });
  });

  it("does not concatenate className into a bogus class", () => {
    // The inner line used `${className}-line`, so passing "mx-4" emitted the
    // nonsense class "mx-4-line" — and "-line" when no class was given.
    const { container } = render(<AppDivider className="mx-4" />);
    expect(container.innerHTML).not.toContain("mx-4-line");
    expect(container.innerHTML).not.toContain('"-line"');
    expect(root(container).className).toContain("mx-4");
  });
});
