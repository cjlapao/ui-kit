/**
 * Tests for the shared input surface tokens in common/theme/Theme.ts.
 *
 * `Input`, `Textarea` and `SearchBar` all read their surface, copy and icon
 * classes from `getInputVariantTokens`, so these assertions are the contract
 * that keeps the three controls from drifting apart.
 */

import { describe, it, expect } from "vitest";
import {
  CONTROL_SIZES,
  DEFAULT_SURFACE_CORNER,
  INPUT_VARIANTS,
  SURFACE_CORNERS,
  SURFACE_PADDINGS,
  getInputVariantTokens,
  getSurfaceCornerClass,
  getSurfaceCornerRem,
  getSurfacePaddingClass,
  getSurfaceTextTokens,
} from "../../../common/theme/Theme";
import type { InputVariant } from "../../../common/theme/Theme";

/** Tailwind neutral step used by a class, e.g. "text-neutral-900" -> 900. */
const step = (classes: string, prefix: string): number | undefined => {
  const match = new RegExp(`(?:^|\\s)${prefix}-neutral-(\\d+)`).exec(classes);
  return match ? Number(match[1]) : undefined;
};

describe("input variant tokens", () => {
  it("covers every declared variant", () => {
    for (const variant of INPUT_VARIANTS) {
      const tokens = getInputVariantTokens(variant);
      expect(tokens.surface).toBeTruthy();
      expect(tokens.text).toBeTruthy();
      expect(tokens.icon).toBeTruthy();
      expect(typeof tokens.translucent).toBe("boolean");
    }
  });

  it("falls back to elevated for an unknown variant", () => {
    expect(getInputVariantTokens("nope" as InputVariant)).toEqual(
      getInputVariantTokens("elevated"),
    );
  });

  // Variants with little or no fill composite their text over whatever the
  // app puts behind them — a glass panel, a photo backdrop — so they must use
  // the high-contrast copy, not the solid set tuned for an opaque field.
  // `gradient` is excluded on purpose: its fill is 80%/70%, near enough to
  // opaque that the solid copy still reads.
  const seeThroughVariants = ["underline", "glass"] as const;

  it("marks the see-through variants translucent", () => {
    for (const variant of seeThroughVariants) {
      expect(getInputVariantTokens(variant).translucent).toBe(true);
    }
  });

  it("has no background fill on underline", () => {
    expect(getInputVariantTokens("underline").surface).toContain(
      "bg-transparent",
    );
  });

  it.each(seeThroughVariants)(
    "%s uses higher-contrast copy than the solid variants",
    (variant) => {
      const translucent = getInputVariantTokens(variant);
      const solid = getInputVariantTokens("flat");

      // Light scheme: darker placeholder (a higher neutral step).
      expect(step(translucent.text, "placeholder:text")!).toBeGreaterThan(
        step(solid.text, "placeholder:text")!,
      );
      expect(step(translucent.icon, "text")!).toBeGreaterThan(
        step(solid.icon, "text")!,
      );

      // Dark scheme: lighter body copy and placeholder (a lower step).
      expect(step(translucent.text, "dark:text")!).toBeLessThan(
        step(solid.text, "dark:text")!,
      );
      expect(step(translucent.text, "dark:placeholder:text")!).toBeLessThan(
        step(solid.text, "dark:placeholder:text")!,
      );
      expect(step(translucent.icon, "dark:text")!).toBeLessThan(
        step(solid.icon, "dark:text")!,
      );
    },
  );
});

describe("container surface tokens", () => {
  it("gives every corner token a radius class and a documented radius", () => {
    for (const corner of SURFACE_CORNERS) {
      expect(getSurfaceCornerClass(corner)).toMatch(/^rounded-/);
      expect(getSurfaceCornerRem(corner)).toBeTruthy();
    }
  });

  it("has a distinct class per corner, apart from the two capsules", () => {
    const classes = SURFACE_CORNERS.map(getSurfaceCornerClass);
    // `pill` and `rounded-full` are the same capsule on purpose; everything
    // else must be its own step. `pill` used to duplicate `rounded-lg`, which
    // made two different-sounding options render identically.
    expect(new Set(classes).size).toBe(SURFACE_CORNERS.length - 1);
    expect(getSurfaceCornerClass("pill")).toBe(
      getSurfaceCornerClass("rounded-full"),
    );
  });

  it("defaults to a corner that is in the list", () => {
    expect(SURFACE_CORNERS).toContain(DEFAULT_SURFACE_CORNER);
    expect(getSurfaceCornerClass(DEFAULT_SURFACE_CORNER)).toBe("rounded-2xl");
  });

  it("covers every padding token, and none is a no-op but `none`", () => {
    for (const padding of SURFACE_PADDINGS) {
      const value = getSurfacePaddingClass(padding);
      expect(value).toBeTruthy();
      if (padding !== "none") {
        expect(value).not.toBe("p-0");
      }
    }
  });

  it("uses the shared control scale for padding", () => {
    expect([...SURFACE_PADDINGS]).toEqual(["none", ...CONTROL_SIZES]);
  });

  // Same rule as the input variants: a surface with no reliable substrate must
  // not use the copy colours tuned for an opaque card.
  it("treats the fill-less container variants as translucent", () => {
    for (const variant of [
      "glass",
      "liquid-glass",
      "default",
      "simple",
    ] as const) {
      expect(getSurfaceTextTokens(variant).translucent).toBe(true);
    }
    for (const variant of ["elevated", "outlined"] as const) {
      expect(getSurfaceTextTokens(variant).translucent).toBe(false);
    }
  });
});
