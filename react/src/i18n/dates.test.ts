import { describe, expect, it } from "vitest";
import { getLocalizedParseNames, getMonthNames, getWeekdayNames } from "../../../common/i18n";
import { MONTH_NAMES, MONTH_NAMES_SHORT, WEEKDAY_LABELS } from "../../../common/utils/dates";

describe("locale-aware date names (engine)", () => {
  it("derives en names matching the kit constants", () => {
    expect(getMonthNames("en")).toEqual(MONTH_NAMES);
    expect(getWeekdayNames("en")).toEqual(WEEKDAY_LABELS);
  });

  it("derives other locales from Intl (no shipped data)", () => {
    const fr = getMonthNames("fr");
    expect(fr).toHaveLength(12);
    expect(fr[0]).toBe("janvier");
    expect(getMonthNames("fr", true)[0]).toMatch(/^jan/);
    expect(getMonthNames("ja")[0]).toBe("1月");
    expect(getWeekdayNames("de")).toHaveLength(7);
    expect(getWeekdayNames("de")[0]).toBe("Sonntag");
    expect(getWeekdayNames("de", true)).toEqual(["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]);
    expect(getWeekdayNames("fr")).toEqual([
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ]);
  });

  it("catalog overrides win when complete (kit.date.* keys)", () => {
    const overrides: Record<string, string> = {};
    MONTH_NAMES.forEach((_, i) => {
      overrides[`kit.date.months.${i}`] = `M${i}`;
    });
    expect(getMonthNames("fr", false, overrides)[0]).toBe("M0");
    expect(getMonthNames("fr", false, overrides)).toHaveLength(12);
  });

  it("a partial catalog override falls through to Intl", () => {
    expect(getMonthNames("fr", false, { "kit.date.months.0": "XXX" })[0]).toBe("janvier");
  });

  it("an invalid tag degrades to the English constants", () => {
    expect(getMonthNames("not a tag")).toEqual(MONTH_NAMES);
    expect(getMonthNames("not a tag", true)).toEqual(MONTH_NAMES_SHORT);
  });

  it("getLocalizedParseNames returns full + short sets", () => {
    const names = getLocalizedParseNames("fr");
    expect(names.monthFull).toHaveLength(12);
    expect(names.monthShort).toHaveLength(12);
    expect(names.weekdayFull).toHaveLength(7);
    expect(names.weekdayShort).toHaveLength(7);
    expect(names.weekdayFull[0]).toBe("dimanche");
  });
});
