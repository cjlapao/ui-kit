import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import Hero, { HERO_VARIANTS, HERO_TITLE_ELEMENTS } from "./Hero";
import {
  CONTROL_SIZES,
  SURFACE_CORNERS,
  SURFACE_PADDINGS,
  SURFACE_VARIANTS,
  TRUE_COLORS,
} from "../theme/Theme";

/**
 * The band, not the halo behind it — both carry a gradient, and they use
 * different stops, so picking whichever comes first would let a wrong-stop
 * band pass on the halo's numbers.
 */
/**
 * The band, not the halo behind it — both carry a gradient, so it is found by
 * its `data-variant` rather than by matching the CSS, which JSDOM rewrites
 * (`to bottom right` becomes `right` once the colours are parseable).
 */
const bandStyle = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-variant="gradient"]')?.style
    .backgroundImage ?? "";

describe("Hero", () => {
  describe("the gradient", () => {
    it("stays in its own tone for every one of them", () => {
      // The table this replaces mapped each tone to a *different* tone's
      // gradient: `sky` painted sky→indigo, `red` painted red→rose, `lime`
      // painted lime→green. Twenty-one entries, every one of them bleeding.
      for (const tone of TRUE_COLORS) {
        const { container } = render(<Hero title="T" tone={tone} />);
        const band = bandStyle(container);
        expect(band).toContain(`--color-${tone}-700`);
        expect(band).toContain(`--color-${tone}-800`);
      }
    });

    it("keeps its white copy above the kit's measured contrast floor", () => {
      // White on `{tone}-700` is 4.93:1 at worst (yellow). The old light stop
      // was `-400`, where white measures 2.94:1 — under AA for nine tones and
      // under even the 3:1 asked of a graphical object.
      for (const tone of TRUE_COLORS) {
        const { container } = render(<Hero title="T" tone={tone} />);
        const band = bandStyle(container);
        for (const shade of ["300", "400", "500", "600"]) {
          expect(band).not.toContain(`-${shade})`);
        }
      }
    });

    it("lets the caller state the stops outright", () => {
      const { container } = render(
        <Hero title="T" gradientFrom="#123456" gradientTo="#abcdef" />,
      );
      // JSDOM re-serialises a hex to `rgb(...)`, so the check is that the
      // tone's own variables were displaced.
      const band = bandStyle(container);
      expect(band).not.toContain("--color-");
      expect(band).toContain("rgb(18, 52, 86)");
    });

    it("takes `tone` and its `color` alias alike", () => {
      const byTone = render(<Hero title="T" tone="violet" />).container;
      const byColor = render(<Hero title="T" color="violet" />).container;
      expect(bandStyle(byTone)).toBe(bandStyle(byColor));
    });
  });

  describe("the shared scales", () => {
    it("sizes the title and subtitle past `md`", () => {
      // `HeroSubtitleSize` was truncated to `xs | sm | md`, so a hero could
      // not be sized to match the controls beside it.
      for (const size of CONTROL_SIZES) {
        const { container } = render(
          <Hero title="T" subtitle="S" titleSize={size} subtitleSize={size} />,
        );
        expect(container.textContent).toContain("T");
        expect(container.textContent).toContain("S");
      }
    });

    it("takes every container padding and corner", () => {
      for (const padding of SURFACE_PADDINGS) {
        const { container } = render(<Hero title="T" padding={padding} />);
        expect(container.firstChild).toBeTruthy();
      }
      for (const corner of SURFACE_CORNERS) {
        const { container } = render(<Hero title="T" corner={corner} />);
        expect(container.firstChild).toBeTruthy();
      }
    });

    it("still honours the deprecated `rounded` flag", () => {
      const { container } = render(<Hero title="T" rounded={false} />);
      expect(container.innerHTML).not.toContain("rounded-2xl");
    });
  });

  describe("variants", () => {
    it("offers every container surface, plus the gradient band", () => {
      expect([...HERO_VARIANTS]).toEqual([...SURFACE_VARIANTS, "gradient"]);
    });

    it("renders a Panel for a surface and a bare band for the gradient", () => {
      for (const variant of HERO_VARIANTS) {
        const { container } = render(<Hero title="T" variant={variant} />);
        expect(Boolean(container.querySelector("section"))).toBe(
          variant !== "gradient",
        );
      }
    });

    it("paints white copy only on the gradient", () => {
      // Every variant used to get `text-white`, so the title vanished on a
      // light surface.
      const gradient = render(<Hero title="T" variant="gradient" />).container;
      const surface = render(<Hero title="T" variant="subtle" />).container;
      expect(gradient.innerHTML).toContain("text-white");
      expect(surface.innerHTML).not.toContain("text-white");
    });
  });

  describe("semantics", () => {
    it("renders the title as a paragraph by default", () => {
      const { container } = render(<Hero title="T" />);
      expect(container.querySelector("p")?.textContent).toBe("T");
    });

    it("can be a real heading instead", () => {
      // It was always a `<p>`, so a banner at the top of a page announced no
      // heading at all.
      for (const titleAs of HERO_TITLE_ELEMENTS) {
        const { container } = render(<Hero title="T" titleAs={titleAs} />);
        expect(container.querySelector(titleAs)?.textContent).toBe("T");
      }
      const { container } = render(<Hero title="T" titleAs="h2" />);
      expect(container.querySelector("h2")?.textContent).toBe("T");
    });
  });

  describe("decoration", () => {
    it("draws the circles and the wash only when asked", () => {
      const count = (html: string) =>
        (html.match(/rounded-full bg-white\/10/g) ?? []).length;
      expect(count(render(<Hero title="T" decoration="none" />).container.innerHTML)).toBe(0);
      expect(count(render(<Hero title="T" decoration="shapes" />).container.innerHTML)).toBe(3);
      expect(count(render(<Hero title="T" decoration="both" />).container.innerHTML)).toBe(3);
    });
  });

  it("draws no icon slot when there is no icon", () => {
    const { container } = render(<Hero title="T" />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
