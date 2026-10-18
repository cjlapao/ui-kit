import { afterEach, describe, expect, it, vi } from "vitest";
import { createI18n, resetWarned, wrapEngineWithSideEffects } from "../../../common/i18n";

const CATALOGS = {
  en: { a: "A" },
  fr: { a: "B" },
  ar: { a: "C" },
};

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  document.documentElement.lang = "";
  document.documentElement.dir = "";
  resetWarned();
});

describe("wrapEngineWithSideEffects (provider wrapper)", () => {
  it("persists setLocale to the configured storage key", () => {
    const engine = wrapEngineWithSideEffects(
      createI18n({ locales: CATALOGS, locale: "en", storageKey: "test:locale" }),
      { locales: CATALOGS, storageKey: "test:locale" },
    );
    engine.setLocale("fr");
    expect(window.localStorage.getItem("test:locale")).toBe("fr");
  });

  it("reads the stored locale at init", () => {
    window.localStorage.setItem("test:locale", "fr");
    const i18n = createI18n({ locales: CATALOGS, storageKey: "test:locale" });
    expect(i18n.locale).toBe("fr");
    expect(i18n.t("a")).toBe("B");
  });

  it("storageKey null: never reads or writes", () => {
    // Seed a VALID tag: if the engine read storage it would activate it.
    window.localStorage.setItem("ui-kit:locale", "ar");
    const i18n = createI18n({ locales: CATALOGS, storageKey: null });
    expect(i18n.locale).toBe("en");
    const wrapped = wrapEngineWithSideEffects(i18n, { locales: CATALOGS, storageKey: null });
    wrapped.setLocale("fr");
    expect(wrapped.locale).toBe("fr");
    // Still the seeded value — never overwritten.
    expect(window.localStorage.getItem("ui-kit:locale")).toBe("ar");
  });

  it("updates <html lang> and dir on init and on change", () => {
    const wrapped = wrapEngineWithSideEffects(
      createI18n({ locales: CATALOGS, locale: "en" }),
      { locales: CATALOGS },
    );
    expect(document.documentElement.lang).toBe("en");
    expect(document.documentElement.dir).toBe("ltr");
    wrapped.setLocale("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    wrapped.setLocale("en");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("updateDocument=false leaves the document alone", () => {
    const wrapped = wrapEngineWithSideEffects(
      createI18n({ locales: CATALOGS, locale: "en", updateDocument: false }),
      { locales: CATALOGS, updateDocument: false },
    );
    expect(document.documentElement.lang).toBe("");
    wrapped.setLocale("ar");
    expect(document.documentElement.lang).toBe("");
    expect(wrapped.locale).toBe("ar");
  });

  it("works without a document (SSR-safe)", () => {
    const realDocument = document;
    vi.stubGlobal("document", undefined);
    try {
      const wrapped = wrapEngineWithSideEffects(
        createI18n({ locales: CATALOGS, locale: "en" }),
        { locales: CATALOGS },
      );
      expect(wrapped.locale).toBe("en");
      wrapped.setLocale("fr");
      expect(wrapped.locale).toBe("fr");
    } finally {
      vi.stubGlobal("document", realDocument);
    }
  });
});
