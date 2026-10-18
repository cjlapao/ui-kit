// Locale-aware date parsing (spec §6 / plan task 2.4): date-fns parses
// English month names, so localized input is normalised locale → English.
import { describe, expect, it } from "vitest";
import { getLocalizedParseNames } from "../../../common/i18n/dates";
import { createI18n } from "../../../common/i18n/createI18n";
import { parseDateText, parseValueText } from "../../../common/utils/dates";

const REF = new Date(2026, 7, 15);
const FR = getLocalizedParseNames("fr");
const ES = getLocalizedParseNames("es");
const DE = getLocalizedParseNames("de");

describe("parseDateText (English baseline, no names)", () => {
  it("parses full English months", () => {
    const d = parseDateText("March 15, 2026", "MMMM d, yyyy", REF);
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2026);
    expect(d!.getMonth()).toBe(2);
    expect(d!.getDate()).toBe(15);
  });

  it("parses abbreviated English months (raw + full/abbr cross-normalisation)", () => {
    const d = parseDateText("March 5, 2026", "MMM d, yyyy", REF);
    expect(d!.getMonth()).toBe(2);
  });
});

describe("parseDateText with localized names", () => {
  it("parses French full month names", () => {
    const d = parseDateText("août 15, 2026", "MMMM d, yyyy", REF, FR);
    expect(d).not.toBeNull();
    expect(d!.getMonth()).toBe(7);
    expect(d!.getDate()).toBe(15);
  });

  it("parses French short month names (with the CLDR trailing dot)", () => {
    const d = parseDateText("15 janv. 2026", "d MMM yyyy", REF, FR);
    expect(d).not.toBeNull();
    expect(d!.getMonth()).toBe(0);
    expect(d!.getDate()).toBe(15);
  });

  it("parses French weekday + month names together", () => {
    // 2026-08-17 is a Monday.
    const d = parseDateText("lundi 17 août 2026", "EEEE d MMMM yyyy", REF, FR);
    expect(d).not.toBeNull();
    expect(d!.getDate()).toBe(17);
    expect(d!.getDay()).toBe(1);
  });

  it("parses Spanish month names", () => {
    const d = parseDateText("agosto 15, 2026", "MMMM d, yyyy", REF, ES);
    expect(d!.getMonth()).toBe(7);
  });

  it("parses German month names (umlauts)", () => {
    const d = parseDateText("1. Dezember 2026", "d. MMMM yyyy", REF, DE);
    expect(d).not.toBeNull();
    expect(d!.getMonth()).toBe(11);
    expect(d!.getDate()).toBe(1);
  });

  it("still parses English text when names are supplied (regression)", () => {
    const d = parseDateText("August 15, 2026", "MMMM d, yyyy", REF, FR);
    expect(d!.getMonth()).toBe(7);
  });

  it("returns null for unparseable text", () => {
    expect(parseDateText("pas une date", "MMMM d, yyyy", REF, FR)).toBeNull();
  });
});

describe("parseValueText with localized names", () => {
  // In range mode the result is always [start, end] — narrow the union.
  const rangeValue = (
    text: string,
  ): [Date, Date | null] | null =>
    parseValueText(text, "range", undefined, REF, FR) as [Date, Date | null] | null;

  it("parses a French range (default format)", () => {
    const value = rangeValue("août 1, 2026 - août 3, 2026");
    expect(value).not.toBeNull();
    const [start, end] = value!;
    expect(start.getDate()).toBe(1);
    expect(end!.getDate()).toBe(3);
    expect(end!.getMonth()).toBe(7);
  });

  it("parses an open French range", () => {
    const value = rangeValue("août 1, 2026 -");
    expect(value).toEqual([new Date(2026, 7, 1), null]);
  });

  it("rejects an end before the start (French)", () => {
    const value = rangeValue("août 5, 2026 - août 2, 2026");
    expect(value).toBeNull();
  });
});

describe("I18nEngine.parseNames", () => {
  it("exposes Intl-derived localized names for the active locale", () => {
    const i18n = createI18n({ locales: {} });
    i18n.setLocale("fr");
    const names = i18n.parseNames();
    expect(names.monthFull).toHaveLength(12);
    expect(names.monthFull![7]).toBe("août");
    expect(names.weekdayFull).toHaveLength(7);
    expect(names.monthShort!.some((m) => m.startsWith("janv"))).toBe(true);
  });

  it("honours kit.date.* catalog overrides for parsing names", () => {
    const i18n = createI18n({
      locales: {
        fr: {
          "kit.date.months": [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
          ],
        },
      },
    });
    i18n.setLocale("fr");
    const names = i18n.parseNames("fr");
    // Catalog values take priority over the Intl derivation.
    expect(names.monthFull![1]).toBe("Février");
    expect(names.monthFull![11]).toBe("Décembre");
  });
});
