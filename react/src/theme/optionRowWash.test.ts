import { describe, it, expect } from "vitest";
import {
  TRUE_COLORS,
  POPUP_ROW_WASH,
  getOptionRowWashClasses,
  getOptionSelectedClasses,
  resolveOptionRowWash,
} from "./Theme";

/**
 * The popup family's toned row washes, resolved in one place.
 *
 * `POPUP_ROW_WASH` retired the per-component hover steps (`2d024d52`) and said
 * the wash is a blend, never a step. These helpers are its toned twins: a
 * caller who asks for rose rows gets the rose arithmetic — `-{c}-500/15` in
 * light, `-{c}-500/20` dark — and the keyboard cursor stays the hover class
 * with the `hover:` prefix shaved off, because the cursor "is the same whisper
 * as hover" by definition, not by copy-paste.
 *
 * The literal shapes are asserted per tone because they are exactly what
 * `scripts/generate-safelist.mjs` must declare and what the row classes must
 * actually carry — a drift here is a drift into the stylesheet contract test.
 */
describe("getOptionRowWashClasses — the toned twin of POPUP_ROW_WASH", () => {
  for (const tone of TRUE_COLORS) {
    it(`${tone}: blend alphas, cursor is hover minus the prefix`, () => {
      const wash = getOptionRowWashClasses(tone);
      expect(wash.hover).toBe(
        `hover:bg-${tone}-500/15 dark:hover:bg-${tone}-500/20`,
      );
      expect(wash.cursor).toBe(`bg-${tone}-500/15 dark:bg-${tone}-500/20`);
      expect(wash.cursor).toBe(
        wash.hover
          .split(" ")
          .map((cls) => cls.replace(/(^|:)hover:/g, "$1"))
          .join(" "),
      );
    });
  }
});

describe("getOptionSelectedClasses — the lifted optionSelected triple", () => {
  for (const tone of TRUE_COLORS) {
    it(`${tone}: fill, copy and checkmark ink move together`, () => {
      expect(getOptionSelectedClasses(tone)).toEqual({
        bg: `bg-${tone}-50 dark:bg-${tone}-900/20`,
        text: `text-${tone}-700 dark:text-${tone}-300`,
        icon: `text-${tone}-500 dark:text-${tone}-400`,
      });
    });
  }
});

describe("resolveOptionRowWash — the precedence table, in one place", () => {
  it("both props unset: the neutral constants verbatim, selected stays tone", () => {
    const w = resolveOptionRowWash({ tone: "blue" });
    expect(w.hover).toBe(POPUP_ROW_WASH.hover);
    expect(w.cursor).toBe(POPUP_ROW_WASH.cursor);
    expect(w.selected).toEqual(getOptionSelectedClasses("blue"));
  });

  it("optionSelectedTone paints the selected rows; the wash stays neutral", () => {
    const w = resolveOptionRowWash({ tone: "blue", optionSelectedTone: "emerald" });
    expect(w.hover).toBe(POPUP_ROW_WASH.hover);
    expect(w.cursor).toBe(POPUP_ROW_WASH.cursor);
    expect(w.selected).toEqual(getOptionSelectedClasses("emerald"));
  });

  it("an explicit optionHoverTone tints the wash; selected still follows tone", () => {
    const w = resolveOptionRowWash({ tone: "blue", optionHoverTone: "rose" });
    expect(w.hover).toBe("hover:bg-rose-500/15 dark:hover:bg-rose-500/20");
    expect(w.cursor).toBe("bg-rose-500/15 dark:bg-rose-500/20");
    expect(w.selected).toEqual(getOptionSelectedClasses("blue"));
  });

  it('"selected" follows optionSelectedTone when given', () => {
    const w = resolveOptionRowWash({
      tone: "blue",
      optionSelectedTone: "emerald",
      optionHoverTone: "selected",
    });
    expect(w.hover).toBe("hover:bg-emerald-500/15 dark:hover:bg-emerald-500/20");
    expect(w.selected).toEqual(getOptionSelectedClasses("emerald"));
  });

  it('"selected" follows the field tone when optionSelectedTone is unset', () => {
    const w = resolveOptionRowWash({ tone: "cyan", optionHoverTone: "selected" });
    expect(w.hover).toBe("hover:bg-cyan-500/15 dark:hover:bg-cyan-500/20");
    expect(w.selected).toEqual(getOptionSelectedClasses("cyan"));
  });
});
