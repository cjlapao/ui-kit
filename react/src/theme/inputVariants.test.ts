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
  TRUE_COLORS,
  getInputVariantTokens,
  getSurfaceCornerClass,
  getSurfaceCornerRem,
  getSurfacePaddingClass,
  getSurfaceTextTokens,
  stripFillClass,
} from "../../../common/theme/Theme";
import type {
  InputVariant,
  InputVariantOptions,
} from "../../../common/theme/Theme";

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

// ── The background override ──────────────────────────────────────────────────
//
// `tone` used to be one knob for six decisions, and the fill was one of them:
// `ghost` tinted its ladder through the tone, tinted `glass` tinted through it,
// and the four variants with no tonal fill could not ask for one at any price.
// `InputVariantOptions.fillTone` separates the fill from the rest, and
// the two assertions that hold the change together are here rather than in a
// reviewer's head: omitting the option changes nothing whatsoever, and supplying
// it changes the fill and nothing else.

describe("field fill override", () => {
  /** A resting fill — `bg-rose-100/45`, `dark:bg-rose-500/10` — hover excluded. */
  const fillTokens = (surface: string): string[] =>
    surface
      .split(/\s+/)
      .filter((token) =>
        /^(?:dark:)?bg-(?:[a-z]+-\d{2,3}(?:\/\d+)?|white(?:\/\d+)?|black(?:\/\d+)?|transparent)$/.test(
          token,
        ),
      );

  /**
   * A surface with every token that *is* the background taken out: the resting
   * fills and the `ghost` hover wash, in both schemes.
   *
   * Those are the paint, and they are what the option moves. Everything that
   * survives this filter is what the override has no business touching — border
   * width and sides, the blur, the shadow, the radius, and the hover rim, which
   * is an affordance the pointer asks for and therefore stays in the tone.
   */
  const unpainted = (surface: string): string =>
    stripFillClass(surface)
      .split(/\s+/)
      .filter((token) => !/^(?:dark:|hover:)*bg-/.test(token))
      .join(" ");

  /**
   * The tone is held at `violet` throughout so that a fill which followed the
   * tone instead of the override is visible in the assertions as `violet`.
   */
  const tokens = (variant: InputVariant, options?: InputVariantOptions) =>
    getInputVariantTokens(variant, "violet", "auto", {
      explicitTone: "violet",
      ...options,
    });

  it("changes nothing at all when the option is absent", () => {
    for (const variant of INPUT_VARIANTS) {
      const before = tokens(variant);
      // `fillTone: undefined` is what every component that declares the
      // prop and has not been given one passes. It has to be the same field it
      // was before the option existed — that is the bar every caller already in
      // the product is standing on.
      expect(tokens(variant, { fillTone: undefined })).toEqual(before);
      expect(before.surface).not.toContain("bg-rose-");
    }
  });

  it("moves the fill and nothing else, for every variant and hue", () => {
    for (const variant of INPUT_VARIANTS) {
      const baseline = tokens(variant);
      for (const hue of TRUE_COLORS) {
        const painted = tokens(variant, { fillTone: hue });
        // Everything that is not part of the fill has to survive byte for byte,
        // and the copy goes untouched with it. Checked with the same stripper
        // the implementation leans on, so a stray `border-*` or `shadow-*` in
        // `fieldFillFor` fails here for all 21 hues at once instead of quietly
        // winning a specificity fight in the build.
        expect(unpainted(painted.surface)).toBe(unpainted(baseline.surface));
        expect(painted.text).toBe(baseline.text);
        expect(painted.icon).toBe(baseline.icon);
        expect(painted.translucent).toBe(baseline.translucent);
      }
    }
  });

  it("leaves exactly one fill standing per colour scheme", () => {
    for (const variant of INPUT_VARIANTS) {
      if (variant === "underline") continue; // paints no box, by design
      for (const hue of TRUE_COLORS) {
        const fills = fillTokens(tokens(variant, { fillTone: hue }).surface);
        // Two surviving fills is one fight over `background-color` whose winner
        // Tailwind's emission order picks — the exact failure `stripFillClass`
        // exists to make impossible.
        expect(fills.filter((token) => !token.startsWith("dark:"))).toHaveLength(1);
        expect(fills.filter((token) => token.startsWith("dark:"))).toHaveLength(1);
      }
    }
  });

  // The recipes are the variant's own, not one tone step imposed on six boxes.
  const recipes: Record<
    "flat" | "elevated" | "glass" | "gradient",
    (hue: string) => string
  > = {
    flat: (hue) => `bg-${hue}-50 dark:bg-${hue}-500/10`,
    elevated: (hue) => `bg-${hue}-50 dark:bg-${hue}-500/10`,
    glass: (hue) => `bg-${hue}-100/45 dark:bg-${hue}-500/10`,
    gradient: (hue) => `bg-${hue}-50/80 dark:bg-${hue}-500/15`,
  };

  it.each(Object.entries(recipes))(
    "%s keeps its own recipe and takes only the hue",
    (variant, recipe) => {
      for (const hue of TRUE_COLORS) {
        // `neutral` is not a hue here, it is a request for the variant's own
        // resting fill, and it has its own test below.
        if (hue === "neutral") continue;
        expect(
          tokens(variant as "flat" | "elevated" | "glass" | "gradient", {
            fillTone: hue,
          }).surface,
        ).toContain(recipe(hue));
      }
    },
  );

  it("moves ghost's washes to the fill hue and leaves its rim in the tone", () => {
    // Rest, hover and both dark steps are the paint and follow the override. The
    // hover rim is what the field says back to the pointer — the same family as
    // the focus border and ring — so it answers in `tone` (violet here). Moving
    // it with the fill is the bug this assertion exists to keep out.
    const surface = tokens("ghost", { fillTone: "rose" }).surface;
    expect(surface).toContain("bg-rose-100");
    expect(surface).toContain("hover:bg-rose-200");
    expect(surface).toContain("dark:bg-rose-500/10");
    expect(surface).toContain("dark:hover:bg-rose-500/20");
    expect(surface).toContain("hover:border-violet-300");
    expect(surface).not.toContain("border-rose-");
  });

  it("keeps ghost's hover rim in the tone for every background hue", () => {
    // The one-hue-per-side rule asserted across the whole palette rather than at
    // one hue, because the rung comes from `ghostFillShades(tone)` and a hue that
    // leaked into the rim would leak for the achromatic rungs too.
    for (const hue of TRUE_COLORS) {
      const surface = tokens("ghost", { fillTone: hue }).surface;
      expect(surface).toContain("hover:border-violet-300");
      expect(surface).not.toMatch(/hover:border-(?!violet-)/);
    }
  });

  it("keeps the achromatic rungs one step deeper when the background is achromatic", () => {
    // The five hueless tones are invisible at `-100` off white, so the ladder
    // rides a rung up for them — the override goes through the same function,
    // not a copy of its table. Only for the washes, though: the rim reads the
    // tone's ladder, violet's `-300` here rather than slate's `-400`.
    const surface = tokens("ghost", { fillTone: "slate" }).surface;
    expect(surface).toContain("bg-slate-200");
    expect(surface).toContain("hover:bg-slate-300");
    expect(surface).toContain("hover:border-violet-300");
    expect(surface).not.toContain("border-slate-");
  });

  it("reads neutral as the variant's own resting fill", () => {
    // Glass is the case that proves the ordering: the `explicitTone` branch has
    // already painted violet by this point, and the override is what puts the
    // untinted glass back. Apply it before that branch and this fails.
    expect(tokens("flat", { fillTone: "neutral" }).surface).toContain(
      "bg-white dark:bg-neutral-900",
    );
    expect(tokens("elevated", { fillTone: "neutral" }).surface).toContain(
      "bg-white dark:bg-neutral-900",
    );
    const glass = tokens("glass", { fillTone: "neutral" }).surface;
    expect(glass).toContain("bg-white/45 dark:bg-white/10");
    expect(glass).not.toContain("violet");
    expect(
      tokens("gradient", { fillTone: "neutral" }).surface,
    ).toContain("bg-white/80 dark:bg-neutral-900/70");
    const ghost = tokens("ghost", { fillTone: "neutral" }).surface;
    expect(ghost).toContain("bg-neutral-200");
    // `neutral` is the paint going back to the variant's own; the rim never left.
    expect(ghost).toContain("hover:border-violet-300");
  });

  it("does nothing to underline, which paints no box", () => {
    for (const hue of TRUE_COLORS) {
      expect(tokens("underline", { fillTone: hue })).toEqual(
        tokens("underline"),
      );
    }
  });

  it("never carries a state colour", () => {
    // Focus border, focus ring, icon accents and the glow are built by
    // `getFieldToneTokens(tone)`, which this function does not touch. A
    // `focus-within:` or `ring-` class showing up here would mean the fill
    // option had started answering for state as well.
    for (const variant of INPUT_VARIANTS) {
      for (const hue of TRUE_COLORS) {
        const surface = tokens(variant, { fillTone: hue }).surface;
        expect(surface).not.toMatch(/focus/);
        expect(surface).not.toMatch(/(?:^|\s)(?:dark:)?ring-/);
      }
    }
  });
});

describe("container surface tokens", () => {
  it("gives every corner token a radius class and a documented radius", () => {
    for (const corner of SURFACE_CORNERS) {
      expect(getSurfaceCornerClass(corner)).toMatch(/^rounded-/);
      expect(getSurfaceCornerRem(corner)).toBeTruthy();
    }
  });

  it("gives every corner its own distinct radius class", () => {
    const classes = SURFACE_CORNERS.filter((c) => c !== "auto").map(
      getSurfaceCornerClass,
    );
    // Every step must be its own radius. The capsules (`pill`,
    // `rounded-full`) were duplicates of each other and are no longer part of
    // the container scale — a capsule is a shape the `Pill` component owns.
    // `auto` is excluded for the same reason: it duplicates the theme default.
    expect(new Set(classes).size).toBe(
      SURFACE_CORNERS.filter((c) => c !== "auto").length,
    );
  });

  it("keeps no capsule entry in the container corner scale", () => {
    expect(SURFACE_CORNERS).not.toContain("pill");
    expect(SURFACE_CORNERS).not.toContain("rounded-full");
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
