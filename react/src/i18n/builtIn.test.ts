// Built-in kit catalogs (spec §4.3): key-set parity, default resolution,
// user overrides, and the ICU strings inside the catalog.
import { describe, expect, it } from "vitest";
import {
  BUILT_IN_CATALOGS,
  CURATED_LOCALES,
  EN_KIT_CATALOG,
} from "../../../common/i18n/builtIn";
import { flattenCatalog } from "../../../common/i18n/catalog";
import { createI18n } from "../../../common/i18n/createI18n";

const enKeys = Object.keys(flattenCatalog(EN_KIT_CATALOG));

describe("built-in kit catalogs", () => {
  it("ships a non-empty en reference catalog", () => {
    expect(enKeys.length).toBeGreaterThan(40);
  });

  it("every curated locale has exactly the en key set", () => {
    for (const locale of CURATED_LOCALES) {
      const keys = Object.keys(flattenCatalog(BUILT_IN_CATALOGS[locale])).sort();
      expect(keys).toEqual([...enKeys].sort());
    }
  });

  it("every value is a non-empty string (flattened)", () => {
    for (const locale of CURATED_LOCALES) {
      for (const [key, value] of Object.entries(flattenCatalog(BUILT_IN_CATALOGS[locale]))) {
        expect(typeof value, `${locale} ${key}`).toBe("string");
        expect((value as string).length, `${locale} ${key}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("createI18n kit-catalog defaults", () => {
  const bare = () => createI18n({ locales: {} });

  it("resolves kit.* keys with no user catalogs at all", () => {
    const i18n = bare();
    expect(i18n.t("kit.datepicker.today")).toBe("Today");
    expect(i18n.has("kit.combobox.emptyMessage")).toBe(true);
    // Unknown keys still render as the key.
    expect(i18n.t("kit.doesnotexist")).toBe("kit.doesnotexist");
  });

  it("curated locales render their kit strings (fr apostrophes included)", () => {
    const i18n = bare();
    i18n.setLocale("fr");
    expect(i18n.t("kit.datepicker.today")).toBe("Aujourd'hui");
    expect(i18n.t("kit.help.show")).toBe("Afficher l'aide");
    expect(i18n.t("kit.modal.cancel")).toBe("Annuler");
  });

  it("es/de/pt curated strings resolve", () => {
    const i18n = bare();
    i18n.setLocale("es");
    expect(i18n.t("kit.datepicker.today")).toBe("Hoy");
    i18n.setLocale("de");
    expect(i18n.t("kit.spinner.loading")).toBe("Wird geladen");
    i18n.setLocale("pt");
    expect(i18n.t("kit.variablepicker.close")).toBe("Fechar");
  });

  it("unknown locales fall back to the en kit catalog", () => {
    const i18n = bare();
    i18n.setLocale("ja");
    expect(i18n.t("kit.datepicker.today")).toBe("Today");
  });

  it("user keys override kit keys per locale", () => {
    const i18n = createI18n({
      locales: {
        fr: { "kit.datepicker.today": "Jour courant" },
        en: { "kit.datepicker.today": "Right now" },
      },
    });
    i18n.setLocale("fr");
    expect(i18n.t("kit.datepicker.today")).toBe("Jour courant");
    i18n.setLocale("en");
    expect(i18n.t("kit.datepicker.today")).toBe("Right now");
    // Untouched keys stay kit values.
    expect(i18n.t("kit.modal.cancel")).toBe("Cancel");
  });

  it("ICU messages in the kit catalog interpolate", () => {
    const i18n = bare();
    i18n.setLocale("fr");
    expect(i18n.t("kit.sidemenu.toggleSubmenu", { verb: "Réduire", label: "Fichiers" })).toBe(
      "Réduire le sous-menu Fichiers",
    );
    i18n.setLocale("en");
    expect(i18n.t("kit.sidemenu.toggleSubmenu", { verb: "Expand", label: "Files" })).toBe(
      "Expand Files submenu",
    );
  });
});
