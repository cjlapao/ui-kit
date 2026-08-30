// I18nProvider + composables (plan task 4.3): mount, template reactivity on
// setLocale, locale ref reactivity, persistence, SSR-safety, no-provider
// contract.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { renderToString } from "@vue/server-renderer";
import { I18nProvider, useI18n, type UseI18n } from "./index";
import { resetWarned } from "../../../common/i18n/warn";

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

beforeEach(() => {
  resetWarned();
});

/** A provider + child that shows `t("greeting")`, the locale, and a switch. */
function mountSwitcher(locales: Record<string, Record<string, string>>) {
  const Child = defineComponent({
    setup() {
      const i18n = useI18n();
      return () =>
        h("div", null, [
          h("span", { "data-testid": "greeting" }, i18n.t("greeting")),
          h(
            "button",
            {
              "data-testid": "switch",
              onClick: () =>
                i18n.setLocale(i18n.locale.value === "en" ? "fr" : "en"),
            },
            "switch",
          ),
          h("span", { "data-testid": "locale" }, i18n.locale.value),
        ]);
    },
  });
  return mount(() => h(I18nProvider, { locales }, () => h(Child)));
}

describe("I18nProvider", () => {
  it("renders user-catalog values and re-renders on setLocale", async () => {
    const w = mountSwitcher({ en: { greeting: "Hello" }, fr: { greeting: "Bonjour" } });
    expect(w.get('[data-testid="greeting"]').text()).toBe("Hello");
    await w.get('[data-testid="switch"]').trigger("click");
    expect(w.get('[data-testid="greeting"]').text()).toBe("Bonjour");
    expect(w.get('[data-testid="locale"]').text()).toBe("fr");
  });

  it("the locale ref tracks the engine", async () => {
    let i18n: UseI18n | null = null;
    const Child = defineComponent({
      setup() {
        i18n = useI18n();
        return () => h("span", i18n.t("greeting"));
      },
    });
    mount(
      () =>
        h(
          I18nProvider,
          { locale: "en", locales: { en: { greeting: "Hello" }, fr: { greeting: "Bonjour" } } },
          () => h(Child),
        ),
    );
    expect(i18n!.locale.value).toBe("en");
    i18n!.setLocale("fr");
    await nextTick();
    expect(i18n!.locale.value).toBe("fr");
  });

  it("reads the persisted locale from storage when no explicit locale is set", () => {
    window.localStorage.setItem("ui-kit:locale", "fr");
    const w = mountSwitcher({ fr: { greeting: "Bonjour" } });
    expect(w.get('[data-testid="locale"]').text()).toBe("fr");
    expect(w.get('[data-testid="greeting"]').text()).toBe("Bonjour");
  });

  it("persists setLocale and updates <html lang/dir> (RTL)", async () => {
    const Child = defineComponent({
      setup() {
        const i18n = useI18n();
        return () =>
          h("button", {
            "data-testid": "to-ar",
            onClick: () => i18n.setLocale("ar"),
          });
      },
    });
    const w = mount(() => h(I18nProvider, { locales: { ar: { greeting: "مرحبا" } } }, () => h(Child)));
    await w.get('[data-testid="to-ar"]').trigger("click");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(window.localStorage.getItem("ui-kit:locale")).toBe("ar");
  });
});

describe("no-provider contract", () => {
  it("useI18n outside a provider: kit engine, one-time warn, no throw", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = mount({
      setup: () => {
        const i18n = useI18n();
        return () => h("span", i18n.t("kit.datepicker.today"));
      },
    });
    expect(w.text()).toBe("Today");
    mount({
      setup: () => {
        useI18n();
        return () => h("span", "x");
      },
    });
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

describe("SSR-safety", () => {
  it("provider + template render without document", async () => {
    vi.stubGlobal("document", undefined);
    const SsrApp = defineComponent({
      setup() {
        const i18n = useI18n();
        return () =>
          h("span", `${i18n.t("greeting")}:${i18n.locale.value}`);
      },
    });
    const html = await renderToString(
      h(I18nProvider, { locales: { en: { greeting: "Hello" } } }, () => h(SsrApp)),
    );
    expect(html).toContain("Hello:en");
  });
});

// Re-exported for type consumers of the suite.
export type { UseI18n };
