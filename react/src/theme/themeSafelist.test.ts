import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  TRUE_COLORS,
  getBadgeColorClasses,
  getMultiToggleColorTokens,
  getMultiToggleVariantTokens,
  getPanelToneStyles,
  getPillColorClasses,
  getStatTileColorClasses,
  getStepperTonePalette,
  getSurfaceTriggerTokens,
  getTabsColorTokens,
} from "./Theme";

/**
 * The theme builds its per-tone classes with template literals
 * (`bg-${color}-500`), which Tailwind's scanner can never see. They exist in
 * the stylesheet **only** if `scripts/generate-safelist.mjs` declares their
 * shape — and when it does not, the class is simply absent and the property
 * silently falls back.
 *
 * That failure is invisible in review and mostly invisible on screen: a
 * missing `border-{c}-400/40` leaves `border` resolving to `currentColor`,
 * which painted a near-black rule around a blue pill. Sixteen shapes were
 * missing for all 21 tones when this test was written, including Panel's
 * `muted` copy, its overlay gradient and decoration, StatCard's decoration
 * corner and Tabs' segmented container.
 *
 * This reads the built stylesheet, so it only runs after a build.
 */
const DIST = resolve(process.cwd(), "dist/index.css");

const collect = (value: unknown, into: Set<string>): void => {
  if (typeof value === "string") {
    for (const cls of value.split(/\s+/)) if (cls) into.add(cls);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) collect(v, into);
  }
};

/** Every class the theme generates, across every tone. */
const generatedClasses = (): Set<string> => {
  const out = new Set<string>();
  for (const tone of TRUE_COLORS) {
    collect(getPanelToneStyles(tone), out);
    collect(getMultiToggleColorTokens(tone), out);
    collect(getMultiToggleVariantTokens(tone), out);
    collect(getStatTileColorClasses(tone), out);
    collect(getTabsColorTokens(tone), out);
    collect(getStepperTonePalette(tone), out);
    collect(getBadgeColorClasses(tone), out);
    collect(getSurfaceTriggerTokens(tone), out);
    for (const variant of ["solid", "soft", "outline"] as const) {
      collect(getPillColorClasses(tone, variant), out);
    }
  }
  return out;
};

/** Tailwind escapes `:` and `/` in the selector it emits. */
const escapeClass = (cls: string): string =>
  cls.replace(/:/g, "\\:").replace(/\//g, "\\/");

describe("theme tokens are safelisted", () => {
  it.runIf(existsSync(DIST))(
    "every generated per-tone class exists in the built stylesheet",
    () => {
      const css = readFileSync(DIST, "utf8");
      const toned = new RegExp(`-(${TRUE_COLORS.join("|")})-`);

      const missing = [...generatedClasses()]
        // Only tone-bearing classes are the safelist's business; static ones
        // are scanned straight out of the component source.
        .filter((cls) => toned.test(cls))
        .filter((cls) => !css.includes(escapeClass(cls)));

      // Report the shape, not 21 near-identical lines.
      const shapes = [...new Set(missing.map((cls) => cls.replace(toned, "-{tone}-")))];
      expect(shapes).toEqual([]);
    },
  );

  it("collects a meaningful number of classes to check", () => {
    expect(generatedClasses().size).toBeGreaterThan(500);
  });
});
