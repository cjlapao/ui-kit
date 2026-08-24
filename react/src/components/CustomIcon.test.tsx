import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CustomIcon from "./CustomIcon";
import { TRUE_COLORS } from "../theme/Theme";

const root = (container: HTMLElement) =>
  container.firstElementChild as HTMLElement;

afterEach(() => vi.restoreAllMocks());

describe("CustomIcon", () => {
  describe("colour props that used to do nothing", () => {
    // `color` and `hoverColor` set `--icon-color` / `--icon-hover-color`
    // custom properties that nothing in either kit ever read. The icons paint
    // with `currentColor`, so the CSS `color` property is what tints them.
    it("applies color as the CSS colour", () => {
      const { container } = render(<CustomIcon icon="Add" color="#ff0000" />);
      expect(root(container).style.color).toBe("rgb(255, 0, 0)");
    });

    it("hands the hover colour to a rule that consumes it", () => {
      const { container } = render(
        <CustomIcon icon="Add" hoverColor="#00ff00" />,
      );
      expect(
        root(container).style.getPropertyValue("--icon-hover-color"),
      ).toBe("#00ff00");
      expect(root(container).className).toContain("custom-icon");
    });

    it("adds no hover class when there is no hover colour", () => {
      const { container } = render(<CustomIcon icon="Add" />);
      expect(root(container).className).not.toContain("custom-icon");
    });

    it("leaves the icon alone when colored", () => {
      const { container } = render(
        <CustomIcon icon="Add" colored color="#ff0000" tone="rose" />,
      );
      expect(root(container).style.color).toBe("");
      expect(root(container).className).not.toContain("text-rose-500");
    });
  });

  describe("tone", () => {
    it.each(TRUE_COLORS)("accepts tone %s", (tone) => {
      const { container } = render(<CustomIcon icon="Add" tone={tone} />);
      expect(root(container).className).toContain(`text-${tone}-500`);
    });

    it("lets a raw colour win over the tone", () => {
      const { container } = render(
        <CustomIcon icon="Add" tone="rose" color="#123456" />,
      );
      expect(root(container).className).not.toContain("text-rose-500");
    });
  });

  describe("sizing", () => {
    it("steps with size", () => {
      const seen = new Set<string>();
      for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
        const { container, unmount } = render(
          <CustomIcon icon="Add" size={size} />,
        );
        seen.add(root(container).className.match(/h-\d+/)![0]);
        unmount();
      }
      expect(seen.size).toBe(5);
    });

    it("customSize overrides the class ladder", () => {
      const { container } = render(<CustomIcon icon="Add" customSize={40} />);
      expect(root(container).style.width).toBe("40px");
      expect(root(container).className).not.toMatch(/\bh-\d/);
    });

    it("defers to an explicit size in className", () => {
      const { container } = render(<CustomIcon icon="Add" className="h-12 w-12" />);
      expect(root(container).className).toContain("h-12");
      expect(root(container).className).not.toContain("h-6");
    });
  });

  describe("accessibility", () => {
    it("is decoration without an alt", () => {
      const { container } = render(<CustomIcon icon="Add" />);
      expect(root(container).getAttribute("aria-hidden")).toBe("true");
      expect(root(container).getAttribute("role")).toBeNull();
    });

    it("is an image with one", () => {
      // `alt` defaulted to `""`, which was then set as `aria-label=""` — the
      // icon was neither hidden nor named.
      render(<CustomIcon icon="Add" alt="Add item" />);
      const el = screen.getByRole("img", { name: "Add item" });
      expect(el.getAttribute("aria-hidden")).toBeNull();
    });

    it("renders a real button when clickable", () => {
      // `onClick` used to sit on a plain span: no role, no tabindex, no key
      // handler — unreachable by keyboard.
      const onClick = vi.fn();
      render(<CustomIcon icon="Add" alt="Add item" onClick={onClick} />);
      const button = screen.getByRole("button", { name: "Add item" });

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(button.tagName).toBe("BUTTON");
    });

    it("disables the button", () => {
      const onClick = vi.fn();
      render(
        <CustomIcon icon="Add" alt="Add" onClick={onClick} disabled />,
      );
      const button = screen.getByRole("button", { name: "Add" });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("missing icons", () => {
    it("keeps its size and warns once, not once per render", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      // The fallback used to drop every computed class, so it had no size at
      // all and collapsed the layout around it.
      const { container, rerender } = render(
        <CustomIcon icon={"NotAnIcon" as never} size="lg" />,
      );
      expect(root(container).className).toContain("h-7");
      expect(container.textContent).toBe("N");

      rerender(<CustomIcon icon={"NotAnIcon" as never} size="lg" />);
      render(<CustomIcon icon={"NotAnIcon" as never} />);
      expect(warn).toHaveBeenCalledTimes(1);
      warn.mockRestore();
    });
  });

  it("spins on request, and stops for reduced motion", () => {
    const { container } = render(<CustomIcon icon="Add" spin />);
    expect(root(container).className).toContain("animate-spin");
    expect(root(container).className).toContain("motion-reduce:animate-none");
  });
});
