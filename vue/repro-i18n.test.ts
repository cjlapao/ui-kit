import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import { I18nProvider, Select, useI18n } from "./src/index";

describe("repro vue", () => {
  it("select renders options", () => {
    const Preview = () => {
      const { locale, setLocale, locales } = useI18n();
      return h("div", null, [
        h(Select, { "aria-label": "Locale", modelValue: locale.value, "onUpdate:modelValue": (v: string) => setLocale(v) }, () =>
          locales.value.map((tag) => h("option", { key: tag, value: tag }, tag))
        ),
        h("span", null, `locale=${locale.value}`),
      ]);
    };
    const w = mount(() => h(I18nProvider, { locale: "en", locales: { en: {}, fr: {}, es: {} } }, () => h(Preview)));
    const opts = w.findAll("option");
    console.log("VUEOPTS>>", opts.length, opts.map((o) => o.attributes("value")).join(","));
    expect(opts.length).toBeGreaterThanOrEqual(3);
  });
});
