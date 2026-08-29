import { describe, expect, it } from "vitest";
import {
  baseLanguage,
  isRTLLocale,
  matchTag,
  resolveInitialLocale,
  resetWarned,
} from "../../../common/i18n";

const available = new Set(["en", "fr", "de"]);

describe("baseLanguage / isRTLLocale", () => {
  it("extracts the base language (lowercased)", () => {
    expect(baseLanguage("fr-CA")).toBe("fr");
    expect(baseLanguage("en")).toBe("en");
    expect(baseLanguage("pt-BR-x-variant")).toBe("pt");
  });

  it("flags RTL prefixes", () => {
    expect(isRTLLocale("ar")).toBe(true);
    expect(isRTLLocale("ar-MA")).toBe(true);
    expect(isRTLLocale("he-IL")).toBe(true);
    expect(isRTLLocale("fa")).toBe(true);
    expect(isRTLLocale("en")).toBe(false);
    expect(isRTLLocale("fr")).toBe(false);
  });
});

describe("matchTag", () => {
  it("exact match, then base language", () => {
    expect(matchTag(["fr-CA", "en"], available)).toBe("fr");
    expect(matchTag(["de"], available)).toBe("de");
    expect(matchTag(["xx", "yy"], available)).toBeUndefined();
    expect(matchTag(["en-US"], available)).toBe("en");
  });
});

describe("resolveInitialLocale", () => {
  const base = {
    detect: true,
    stored: null as string | null,
    languages: [] as string[],
    available,
    fallback: "en",
  };

  it("explicit wins when valid (exact or base-language)", () => {
    expect(resolveInitialLocale({ ...base, explicit: "fr" })).toBe("fr");
    expect(resolveInitialLocale({ ...base, explicit: "fr-CA" })).toBe("fr");
  });

  it("an invalid explicit falls through the chain", () => {
    resetWarned();
    expect(resolveInitialLocale({ ...base, explicit: "zz", languages: ["de-DE"] })).toBe("de");
  });

  it("stored beats navigator", () => {
    expect(resolveInitialLocale({ ...base, stored: "fr", languages: ["de"] })).toBe("fr");
  });

  it("an invalid stored falls through to navigator", () => {
    expect(resolveInitialLocale({ ...base, stored: "zz", languages: ["de"] })).toBe("de");
  });

  it("navigator base-language match", () => {
    expect(resolveInitialLocale({ ...base, languages: ["fr-CA", "en-US"] })).toBe("fr");
  });

  it("detect=false skips navigator", () => {
    expect(resolveInitialLocale({ ...base, detect: false, languages: ["de"] })).toBe("en");
  });

  it("falls back to the fallback locale, then to en", () => {
    expect(resolveInitialLocale({ ...base, languages: ["xx"] })).toBe("en");
    expect(resolveInitialLocale({ ...base, fallback: "de", languages: ["xx"] })).toBe("de");
  });
});
