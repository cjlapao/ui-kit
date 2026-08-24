import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Progress from "./Progress";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

const bar = (container: HTMLElement) =>
  container.querySelector('[role="progressbar"]')!;

const fill = (container: HTMLElement) =>
  bar(container).firstElementChild as HTMLElement;

describe("Progress", () => {
  describe("value", () => {
    it("clamps into the range", () => {
      const { container: over } = render(<Progress value={140} />);
      expect(fill(over).style.width).toBe("100%");

      const { container: under } = render(<Progress value={-20} />);
      expect(fill(under).style.width).toBe("0%");
    });

    it("maps an arbitrary min/max onto the fill", () => {
      // The bar used to assume 0–100, so a byte counter or a step index had to
      // be converted by the caller before it could be shown.
      const { container } = render(<Progress value={75} min={50} max={100} />);
      expect(fill(container).style.width).toBe("50%");
      expect(bar(container).getAttribute("aria-valuemin")).toBe("50");
      expect(bar(container).getAttribute("aria-valuemax")).toBe("100");
      expect(bar(container).getAttribute("aria-valuenow")).toBe("75");
    });

    it("survives a zero-width range instead of dividing by zero", () => {
      const { container } = render(<Progress value={5} min={5} max={5} />);
      expect(fill(container).style.width).toBe("0%");
    });
  });

  describe("indeterminate", () => {
    it("omits aria-valuenow, which is what signals it", () => {
      const { container } = render(<Progress indeterminate />);
      expect(bar(container).getAttribute("aria-valuenow")).toBeNull();
      expect(bar(container).getAttribute("aria-valuemax")).toBe("100");
    });

    it("sweeps instead of filling", () => {
      const { container } = render(<Progress indeterminate value={40} />);
      expect(fill(container).className).toContain("progress-indeterminate");
      expect(fill(container).style.width).toBe("");
    });

    it("drops the shimmer and pulse, which fight the sweep", () => {
      const { container } = render(
        <Progress indeterminate motion="shimmer-pulse" />,
      );
      expect(container.querySelector(".progress-shimmer")).toBeNull();
      expect(fill(container).className).not.toContain("animate-pulse");
    });
  });

  describe("motion", () => {
    it("drives duration and direction through custom properties", () => {
      // They used to be an inline `animation` shorthand, which a
      // `prefers-reduced-motion` media query cannot override — so the bar
      // animated regardless of the user's setting.
      const { container } = render(
        <Progress motion="shimmer" motionSpeed="fast" motionDirection="reverse" />,
      );
      const style = bar(container).getAttribute("style")!;
      expect(style).toContain("--progress-duration: 1.2s");
      expect(style).toContain("--progress-direction: reverse");
      expect(container.querySelector(".progress-shimmer")).not.toBeNull();
      expect(bar(container).getAttribute("style")).not.toContain("animation:");
    });

    it("names the keyframes through a class, so the stylesheet owns them", () => {
      const { container } = render(<Progress motion="stripes" />);
      expect(container.querySelector(".progress-stripes")).not.toBeNull();
    });

    it("still honours the deprecated showShimmer", () => {
      const { container: on } = render(<Progress showShimmer />);
      expect(on.querySelector(".progress-shimmer")).not.toBeNull();

      const { container: off } = render(<Progress showShimmer={false} />);
      expect(off.querySelector(".progress-shimmer")).toBeNull();
    });

    it("hides the decorative overlays from assistive tech", () => {
      const { container } = render(<Progress motion="stripes-shimmer" />);
      for (const overlay of container.querySelectorAll("span")) {
        expect(overlay.getAttribute("aria-hidden")).toBe("true");
      }
    });
  });

  describe("label and value", () => {
    it("names the bar with its label", () => {
      // `role="progressbar"` with no accessible name is announced as just
      // "progress bar".
      const { container } = render(<Progress label="Uploading" value={30} />);
      const id = bar(container).getAttribute("aria-labelledby");
      expect(id).toBeTruthy();
      expect(container.querySelector(`[id="${id}"]`)!.textContent).toBe(
        "Uploading",
      );
    });

    it("shows the value and publishes it as aria-valuetext", () => {
      const { container } = render(<Progress value={30} showValue />);
      expect(screen.getByText("30%")).toBeTruthy();
      expect(bar(container).getAttribute("aria-valuetext")).toBe("30%");
    });

    it("takes a custom formatter", () => {
      const { container } = render(
        <Progress
          value={512}
          max={1024}
          showValue
          formatValue={(value, percent) =>
            `${value} MB (${Math.round(percent)}%)`
          }
        />,
      );
      expect(screen.getByText("512 MB (50%)")).toBeTruthy();
      expect(bar(container).getAttribute("aria-valuetext")).toBe(
        "512 MB (50%)",
      );
    });

    it("renders the bare track when there is no header", () => {
      const { container } = render(<Progress value={30} />);
      expect(container.firstElementChild!.getAttribute("role")).toBe(
        "progressbar",
      );
    });
  });

  describe("appearance", () => {
    it("offers the whole shared control scale", () => {
      // Was a local "xs" | "sm" | "md" | "lg"; `xl` was unreachable.
      const heights: string[] = [];
      for (const size of CONTROL_SIZES) {
        const { container, unmount } = render(<Progress size={size} />);
        heights.push(
          bar(container).className.split(/\s+/).find((c) => /^h-/.test(c))!,
        );
        unmount();
      }
      expect(new Set(heights).size).toBe(CONTROL_SIZES.length);
    });

    it("renders every tone", () => {
      for (const color of TRUE_COLORS) {
        const { container, unmount } = render(<Progress color={color} value={50} />);
        expect(fill(container).className).toContain(`bg-${color}-500`);
        unmount();
      }
    });

    it("accepts `tone` as an alias for `color`", () => {
      const { container } = render(<Progress tone="violet" value={50} />);
      expect(fill(container).className).toContain("bg-violet-500");
    });

    it("squares off on request", () => {
      const { container } = render(<Progress corner="none" />);
      expect(bar(container).className).toContain("rounded-none");
      expect(bar(container).className).not.toContain("rounded-full");
    });
  });
});
