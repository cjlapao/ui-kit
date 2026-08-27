import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import Hero, { HERO_VARIANTS, HERO_TITLE_ELEMENTS } from "./Hero.vue";
import {
  CONTROL_SIZES,
  SURFACE_CORNERS,
  SURFACE_PADDINGS,
  SURFACE_VARIANTS,
  TRUE_COLORS,
} from "../theme/Theme";

/** The band, not the halo behind it — both carry a gradient. */
const band = (w: ReturnType<typeof mount>) =>
  w.find('[data-variant="gradient"]').attributes("style") ?? "";

describe("Hero", () => {
  describe("the gradient", () => {
    it("stays in its own tone for every one of them", () => {
      // The table this replaces mapped each tone to a *different* tone's
      // gradient: `sky` painted sky→indigo, `red` painted red→rose.
      for (const tone of TRUE_COLORS) {
        const w = mount(Hero, { props: { title: "T", tone } });
        expect(band(w)).toContain(`--color-${tone}-700`);
        expect(band(w)).toContain(`--color-${tone}-800`);
      }
    });

    it("keeps its white copy above the kit's measured contrast floor", () => {
      // White on `{tone}-700` is 4.93:1 at worst. The old light stop was
      // `-400`, where white measures 2.94:1 — under AA for nine tones.
      for (const tone of TRUE_COLORS) {
        const style = band(mount(Hero, { props: { title: "T", tone } }));
        for (const shade of ["300", "400", "500", "600"]) {
          expect(style).not.toContain(`-${shade})`);
        }
      }
    });

    it("lets the caller state the stops outright", () => {
      const style = band(
        mount(Hero, {
          props: { title: "T", gradientFrom: "#123456", gradientTo: "#abcdef" },
        }),
      );
      // JSDOM re-serialises a hex to `rgb(...)`, so the check is that the
      // tone's own variables were displaced.
      expect(style).not.toContain("--color-");
      expect(style).toContain("rgb(18, 52, 86)");
    });

    it("takes `tone` and its `color` alias alike", () => {
      expect(band(mount(Hero, { props: { title: "T", tone: "violet" } }))).toBe(
        band(mount(Hero, { props: { title: "T", color: "violet" } })),
      );
    });
  });

  describe("the shared scales", () => {
    it("sizes the title and subtitle past `md`", () => {
      // `HeroSubtitleSize` was truncated to `xs | sm | md`.
      for (const size of CONTROL_SIZES) {
        const w = mount(Hero, {
          props: { title: "T", subtitle: "S", titleSize: size, subtitleSize: size },
        });
        expect(w.text()).toContain("T");
        expect(w.text()).toContain("S");
      }
    });

    it("takes every container padding and corner", () => {
      for (const padding of SURFACE_PADDINGS) {
        expect(mount(Hero, { props: { title: "T", padding } }).html()).toBeTruthy();
      }
      for (const corner of SURFACE_CORNERS) {
        expect(mount(Hero, { props: { title: "T", corner } }).html()).toBeTruthy();
      }
    });

    it("still honours the deprecated `rounded` flag", () => {
      expect(
        mount(Hero, { props: { title: "T", rounded: false } }).html(),
      ).not.toContain("rounded-2xl");
    });
  });

  describe("variants", () => {
    it("offers every container surface, plus the gradient band", () => {
      expect([...HERO_VARIANTS]).toEqual([...SURFACE_VARIANTS, "gradient"]);
    });

    it("renders a Panel for a surface and a bare band for the gradient", () => {
      for (const variant of HERO_VARIANTS) {
        const w = mount(Hero, { props: { title: "T", variant } });
        expect(w.find("section").exists()).toBe(variant !== "gradient");
      }
    });

    it("paints white copy only on the gradient", () => {
      // Every variant used to get `text-white`, so the title vanished on a
      // light surface.
      expect(
        mount(Hero, { props: { title: "T", variant: "gradient" } }).html(),
      ).toContain("text-white");
      expect(
        mount(Hero, { props: { title: "T", variant: "subtle" } }).html(),
      ).not.toContain("text-white");
    });
  });

  describe("semantics", () => {
    it("can be a real heading instead of a paragraph", () => {
      // It was always a `<p>`, so a banner at the top of a page announced no
      // heading at all.
      for (const titleAs of HERO_TITLE_ELEMENTS) {
        const w = mount(Hero, { props: { title: "T", titleAs } });
        expect(w.get(titleAs).text()).toBe("T");
      }
    });
  });

  describe("decoration", () => {
    it("draws the circles only when asked", () => {
      const count = (html: string) =>
        (html.match(/rounded-full bg-white\/10/g) ?? []).length;
      expect(
        count(mount(Hero, { props: { title: "T", decoration: "none" } }).html()),
      ).toBe(0);
      expect(
        count(mount(Hero, { props: { title: "T", decoration: "shapes" } }).html()),
      ).toBe(3);
    });
  });
});
