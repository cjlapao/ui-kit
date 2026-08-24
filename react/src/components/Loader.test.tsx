import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Loader from "./Loader";
import { TRUE_COLORS } from "../theme/Theme";
import { SurfaceProvider } from "../contexts/SurfaceContext";

const container = (w: { container: HTMLElement }) => w.container.firstElementChild as HTMLElement;
const bar = (w: { container: HTMLElement }) =>
  w.container.querySelector('[role="progressbar"]') as HTMLElement;

describe("Loader", () => {
  it("is a status region", () => {
    const { container: c } = render(<Loader title="Syncing" />);
    expect(c.querySelector('[role="status"]')).toBeTruthy();
  });

  describe("variants", () => {
    it("renders a spinner by default", () => {
      const { container: c } = render(<Loader />);
      expect(c.querySelector('[role="status"] [class*="animate"]')).toBeTruthy();
    });

    it("renders a progress bar on demand", () => {
      const { container: c } = render(<Loader variant="progress" progress={40} />);
      expect(bar({ container: c })).toBeTruthy();
    });
  });

  describe("size", () => {
    it("drives the progress bar height, not just the spinner", () => {
      // The bar was hardcoded to size="md" before: `size` was a dead prop on
      // the progress variant.
      const { container: c } = render(<Loader variant="progress" size="xl" />);
      expect(bar({ container: c }).className).toContain("h-4");

      const { container: sm } = render(
        <Loader variant="progress" size="sm" />,
      );
      expect(bar({ container: sm }).className).toContain("h-1.5");
    });

    it("scales the title and label type with the same prop", () => {
      const { container: c } = render(
        <Loader size="xs" title="T" label="L" />,
      );
      const [title, , label] = Array.from(c.children[0].children);
      expect((title as HTMLElement).className).toContain("text-xs");
      expect((label as HTMLElement).className).toContain("text-xs");
    });
  });

  describe("progress", () => {
    it("publishes the value", () => {
      const { container: c } = render(
        <Loader variant="progress" progress={40} />,
      );
      expect(bar({ container: c }).getAttribute("aria-valuenow")).toBe("40");
    });

    it("indeterminate sweeps and omits aria-valuenow", () => {
      const { container: c } = render(
        <Loader variant="progress" indeterminate />,
      );
      expect(bar({ container: c }).getAttribute("aria-valuenow")).toBeNull();
    });
  });

  describe("overlay", () => {
    it("covers the positioned ancestor with a solid scrim by default", () => {
      const { container: c } = render(<Loader overlay title="Busy" />);
      const cls = container({ container: c }).className;
      expect(cls).toContain("absolute");
      expect(cls).toContain("inset-0");
      expect(cls).toContain("z-50");
      expect(cls).toContain("bg-white/85");
      expect(cls).toContain("dark:bg-neutral-900/80");
    });

    it("takes its glass fill from the shared theme scale, tinted with its tone", () => {
      const { container: c } = render(
        <Loader overlay glass color="blue" title="Busy" />,
      );
      const cls = container({ container: c }).className;
      expect(cls).toContain("bg-blue-50/70");
      expect(cls).toContain("dark:bg-blue-500/25");
    });

    it("emits the glass fill for every one of the 21 tones", () => {
      for (const color of TRUE_COLORS) {
        const { container: c } = render(
          <Loader overlay glass color={color} title="Busy" />,
        );
        const cls = container({ container: c }).className;
        expect(cls).toContain(`bg-${color}-50/70`);
        expect(cls).toContain(`dark:bg-${color}-500/25`);
      }
    });

    it("publishes the surface it draws, so the copy survives it", () => {
      const { container: glass } = render(
        <Loader overlay glass title="Busy" label="Hang tight" />,
      );
      expect(glass.textContent).toContain("Hang tight");
      const label = glass.querySelectorAll("[role=status] div")[1] as HTMLElement;
      expect(label.className).toContain("text-neutral-800");

      const { container: scrim } = render(
        <Loader overlay title="Busy" label="Hang tight" />,
      );
      const scrimLabel = scrim.querySelectorAll("[role=status] div")[1] as HTMLElement;
      expect(scrimLabel.className).toContain("text-neutral-600 dark:text-neutral-300");
    });

    it("inherits the surrounding surface when it is not an overlay", () => {
      const { container: c } = render(
        <SurfaceProvider variant="glass">
          <Loader title="Busy" label="Hang tight" />
        </SurfaceProvider>,
      );
      const label = c.querySelectorAll("[role=status] div")[1] as HTMLElement;
      expect(label.className).toContain("text-neutral-800");
    });
  });
});
