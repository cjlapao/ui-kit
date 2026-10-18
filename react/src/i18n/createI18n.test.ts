import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createI18n,
  IcuParseError,
  resetWarned,
  type LocaleTag,
  type MessageCatalog,
} from "../../../common/i18n";

const CATALOGS: Record<LocaleTag, MessageCatalog> = {
  en: { hello: "Hello {name}" },
  fr: { hello: "Bonjour {name} !" },
  ar: { hello: "مرحبا {name}" },
};

const setLanguages = (languages: string[]): void => {
  Object.defineProperty(window.navigator, "languages", {
    value: languages,
    configurable: true,
  });
};

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  setLanguages(["en-US"]);
  resetWarned();
});

describe("createI18n", () => {
  it("resolves keys with the active locale and switches", () => {
    const i18n = createI18n({ locales: CATALOGS, locale: "en" });
    expect(i18n.locale).toBe("en");
    expect(i18n.t("hello", { name: "Ada" })).toBe("Hello Ada");
    i18n.setLocale("fr");
    expect(i18n.locale).toBe("fr");
    expect(i18n.t("hello", { name: "Ada" })).toBe("Bonjour Ada !");
  });

  it("setLocale matches base languages; invalid tags are a warned no-op", () => {
    const i18n = createI18n({ locales: CATALOGS, locale: "en" });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    i18n.setLocale("fr-CA");
    expect(i18n.locale).toBe("fr");
    i18n.setLocale("zz");
    expect(i18n.locale).toBe("fr");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("notifies subscribers once per change and bumps the version", () => {
    const i18n = createI18n({ locales: CATALOGS, locale: "en" });
    const listener = vi.fn();
    const unsubscribe = i18n.subscribe(listener);
    const before = i18n.getVersion();
    i18n.setLocale("fr");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(i18n.getVersion()).toBe(before + 1);
    i18n.setLocale("fr"); // same locale: no notify
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    i18n.setLocale("en");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("missing key: renders the key, warns once, calls onFallbackKey", () => {
    const onFallbackKey = vi.fn();
    const i18n = createI18n({ locales: CATALOGS, locale: "en", onFallbackKey });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(i18n.t("nope")).toBe("nope");
    expect(i18n.t("nope")).toBe("nope");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(onFallbackKey).toHaveBeenCalledWith("nope", "en", "en");
  });

  it("object form: t({ id, defaultMessage, values })", () => {
    const i18n = createI18n({ locales: CATALOGS, locale: "fr" });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(i18n.t({ id: "unknown", defaultMessage: "Default {n}", values: { n: 3 } })).toBe(
      "Default 3",
    );
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("has() and locales()", () => {
    const i18n = createI18n({ locales: CATALOGS, locale: "en" });
    expect(i18n.has("hello")).toBe(true);
    expect(i18n.has("hello", "fr")).toBe(true);
    expect(i18n.has("nope")).toBe(false);
    // Kit locales (fr/es/de/pt/en) join the union with user locales.
    expect(i18n.locales).toEqual(["ar", "de", "en", "es", "fr", "pt"]);
  });

  it("detects from navigator.languages (jsdom default en-US → en)", () => {
    setLanguages(["fr-CA", "en-US"]);
    const i18n = createI18n({ locales: CATALOGS });
    expect(i18n.locale).toBe("fr");
  });

  it("is SSR-safe without a navigator", () => {
    const realNavigator = window.navigator;
    vi.stubGlobal("navigator", undefined);
    try {
      const i18n = createI18n({ locales: CATALOGS });
      expect(i18n.locale).toBe("en");
      expect(i18n.t("hello", { name: "X" })).toBe("Hello X");
    } finally {
      vi.stubGlobal("navigator", realNavigator);
    }
  });

  it("formatNumber/formatDate use the active locale", () => {
    const i18n = createI18n({ locales: CATALOGS, locale: "fr" });
    expect(i18n.formatNumber(1234.5)).toBe(new Intl.NumberFormat("fr").format(1234.5));
    const d = new Date(2026, 7, 29);
    expect(i18n.formatDate(d)).toBe(new Intl.DateTimeFormat("fr").format(d));
  });

  it("monthNames/weekdayNames resolve locale-aware names", () => {
    const i18n = createI18n({ locales: CATALOGS, locale: "fr" });
    expect(i18n.monthNames()[0]).toBe("janvier");
    // API is (locale?, short?) — reaching `short` requires passing the locale slot.
    expect(i18n.weekdayNames(undefined, true)).toEqual([
      "dim.",
      "lun.",
      "mar.",
      "mer.",
      "jeu.",
      "ven.",
      "sam.",
    ]);
    expect(i18n.monthNames("en")[0]).toBe("January");
  });

  it("isRTL follows the active locale", () => {
    const i18n = createI18n({ locales: CATALOGS, locale: "en" });
    expect(i18n.isRTL).toBe(false);
    i18n.setLocale("ar");
    expect(i18n.isRTL).toBe(true);
    i18n.setLocale("en");
    expect(i18n.isRTL).toBe(false);
  });

  it("invalid ICU in a catalog: dev throws with key+position", () => {
    const i18n = createI18n({ locales: { en: { bad: "Hello {name" } }, locale: "en" });
    expect(() => i18n.t("bad")).toThrow(IcuParseError);
  });

  it("a structurally bad user locale tag degrades instead of throwing", () => {
    const i18n = createI18n({ locales: { "bad tag": { a: "A" } }, locale: "bad tag" });
    expect(() => i18n.formatNumber(1)).not.toThrow();
    expect(i18n.t("a")).toBe("A");
    expect(i18n.monthNames()[0]).toBe("January"); // Intl rejects the tag → English
  });
});
