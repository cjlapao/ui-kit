import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONTROL_CORNER,
  DEFAULT_SURFACE_CORNER,
  SURFACE_VARIANT_FOR_FIELD,
  getInputVariantTokens,
  isGlassSurface,
  getSurfaceCornerClass,
  getSurfaceCornerRem,
} from "./index";

describe("the auto corner", () => {
  it("resolves to the theme's container corner, not a lookup miss", () => {
    // "auto" is a request, not a radius — it must never fall through to an
    // undefined class the way an unknown token would.
    expect(getSurfaceCornerClass("auto")).toBe(
      getSurfaceCornerClass(DEFAULT_SURFACE_CORNER),
    );
    expect(getSurfaceCornerRem("auto")).toBe(
      getSurfaceCornerRem(DEFAULT_SURFACE_CORNER),
    );
    expect(getSurfaceCornerClass("auto")).toBe("rounded-2xl");
  });
});

describe("SURFACE_VARIANT_FOR_FIELD", () => {
  it("covers every field variant with a container surface", () => {
    // The composite controls index this exhaustively for panelVariant="auto";
    // a new InputVariant without a row fails here as a type error too.
    expect(SURFACE_VARIANT_FOR_FIELD).toEqual({
      flat: "outlined",
      elevated: "elevated",
      gradient: "elevated",
      ghost: "subtle",
      underline: "subtle",
      glass: "glass",
    });
  });
});

describe("the theme corner ladder", () => {
  it("sits controls one step looser than containers", () => {
    expect(DEFAULT_CONTROL_CORNER).toBe("rounded-lg");
    expect(DEFAULT_SURFACE_CORNER).toBe("rounded-md");
    // Both are real radii, never the "auto" request itself.
    expect(DEFAULT_CONTROL_CORNER).not.toBe("auto");
  });
});

describe("the glass-surface test", () => {
  it("is one shared truth, not a copy per composite", () => {
    // Calendar buttons, array-field add buttons and the variable picker all
    // ask this one question; a per-file copy is how one of them ends up
    // rendering a solid chip on a blurred card.
    expect(isGlassSurface("glass")).toBe(true);
    expect(isGlassSurface("liquid-glass")).toBe(true);
    for (const variant of [
      "elevated",
      "outlined",
      "subtle",
      "tonal",
      "default",
      "simple",
      "plain",
    ] as const) {
      expect(isGlassSurface(variant)).toBe(false);
    }
  });
});

describe("the field corner", () => {
  it("auto keeps the control corner baked into the tokens", () => {
    // `auto` on a control means the CONTROL corner (rounded-lg) — not the
    // container default; the ladder keeps fields a step proud of cards.
    const flat = getInputVariantTokens("flat");
    expect(flat.surface).toContain("rounded-lg");
    expect(flat.surface).not.toContain("rounded-2xl");
  });

  it("an explicit token swaps the radius — on the tone-tinted path too", () => {
    // The corner token `rounded-md` is a scaled name; the class it produces
    // is rounded-2xl.
    expect(
      getInputVariantTokens("flat", "blue", "rounded-md").surface,
    ).toContain("rounded-2xl");
    // Ghost rebuilds its surface for the tone; the corner must survive that.
    const ghost = getInputVariantTokens("ghost", "violet", "none");
    expect(ghost.surface).toContain("rounded-none");
    expect(ghost.surface).toContain("bg-violet-50");
  });

  it("underline has no box for a corner to land on", () => {
    const underline = getInputVariantTokens("underline", "blue", "rounded-xl");
    expect(underline.surface).toContain("border-b");
  });
});
