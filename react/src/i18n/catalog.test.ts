import { describe, expect, it, vi } from "vitest";
import { buildResolution, flattenCatalog, resetWarned } from "../../../common/i18n";

describe("flattenCatalog", () => {
  it("flattens nested objects to dot-keys (string leaves only)", () => {
    expect(flattenCatalog({ a: "A", b: { c: "B", d: ["X", "Y"] } })).toEqual({
      a: "A",
      "b.c": "B",
      "b.d.0": "X",
      "b.d.1": "Y",
    });
  });

  it("keeps arrays as indexed keys (kit.date.* overrides)", () => {
    expect(flattenCatalog({ kit: { date: { months: ["Jan", "Feb"] } } })).toEqual({
      "kit.date.months.0": "Jan",
      "kit.date.months.1": "Feb",
    });
  });

  it("skips non-string leaves with a deduped warn", () => {
    resetWarned();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(flattenCatalog({ ok: "fine", n: 42, o: { bad: null } })).toEqual({ ok: "fine" });
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
});

describe("buildResolution", () => {
  const user = {
    en: { hello: "Hi", onlyEn: "EN-only" },
    fr: { hello: "Salut" },
  };
  const kit = {
    en: { "kit.close": "Close", "kit.only": "KitEN" },
    fr: { "kit.close": "Fermer" },
  };
  const r = buildResolution(user, kit, "en");

  it("chain: user[L] beats kit[L] beats kit[en]", () => {
    expect(r.lookup("hello", "fr")).toEqual({ value: "Salut", resolvedLocale: "fr" });
    expect(r.lookup("kit.close", "fr")).toEqual({ value: "Fermer", resolvedLocale: "fr" });
    expect(r.lookup("kit.only", "fr")).toEqual({ value: "KitEN", resolvedLocale: "en" });
    expect(r.lookup("hello", "en")).toEqual({ value: "Hi", resolvedLocale: "en" });
  });

  it("does not consult user[fallback] for a different active locale (spec §4.2)", () => {
    expect(r.lookup("onlyEn", "fr")).toBeUndefined();
    expect(r.lookup("onlyEn", "en")).toEqual({ value: "EN-only", resolvedLocale: "en" });
  });

  it("has() follows the same chain", () => {
    expect(r.has("kit.close", "fr")).toBe(true);
    expect(r.has("onlyEn", "fr")).toBe(false);
    expect(r.has("nope", "fr")).toBe(false);
  });

  it("availableLocales is the sorted union", () => {
    expect(r.availableLocales()).toEqual(["en", "fr"]);
  });

  it("catalogFor merges user[L] over kit[L] (user wins)", () => {
    expect(r.catalogFor("fr")).toEqual({ "kit.close": "Fermer", hello: "Salut" });
    expect(r.catalogFor("en")).toEqual({
      "kit.close": "Close",
      "kit.only": "KitEN",
      hello: "Hi",
      onlyEn: "EN-only",
    });
  });
});
