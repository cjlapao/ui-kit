import { describe, expect, it } from "vitest";
import {
  TRUE_COLORS,
  TRUE_COLOR_CHIP_CLASSES,
  getTrueColorChipClasses,
  type TrueColor,
} from "./Theme";

/**
 * `TRUE_COLOR_CHIP_CLASSES` is literal-per-colour on purpose — the scanner
 * reads Theme.ts directly, and an interpolated string there would silently
 * drop the class from the stylesheet. This is the guard against a copy/paste
 * drift: the tone embedded in a line drifting from the tone keying it, or a
 * skin going missing when a colour joins `TRUE_COLORS`.
 */
describe("TRUE_COLOR_CHIP_CLASSES", () => {
  it("carries all four skins for every TrueColor, keyed by the same colour", () => {
    for (const tone of TRUE_COLORS) {
      const chip = TRUE_COLOR_CHIP_CLASSES[tone];
      expect(chip, `missing entry for ${tone}`).toBeTruthy();
      for (const key of ["fill", "ink", "wash", "washInk"] as const) {
        expect(chip[key], `${tone}.${key}`).toBeTruthy();
      }
    }
    expect(Object.keys(TRUE_COLOR_CHIP_CLASSES)).toHaveLength(TRUE_COLORS.length);
  });

  it("paints every class in the tone it is keyed by, in the documented recipe", () => {
    for (const tone of TRUE_COLORS) {
      const chip = getTrueColorChipClasses(tone);
      expect(chip.fill).toBe(`bg-${tone}-700 dark:bg-${tone}-400`);
      expect(chip.ink).toBe(`text-white dark:text-${tone}-950`);
      expect(chip.wash).toBe(`bg-${tone}-500/10 dark:bg-${tone}-500/15`);
      expect(chip.washInk).toBe(`text-${tone}-700 dark:text-${tone}-100`);
    }
  });

  it("is a per-tone map of TrueColor keys", () => {
    const tones: TrueColor[] = [...TRUE_COLORS];
    expect(tones.every((tone) => getTrueColorChipClasses(tone) === TRUE_COLOR_CHIP_CLASSES[tone])).toBe(true);
  });
});
