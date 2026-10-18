// I18nProvider behaviour (plan task 3.3): mount/switch re-renders,
// persistence, SSR-safety, the no-provider contract, warning dedupe.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import {
  I18nProvider,
  resetI18nProviderWarns,
  useI18n,
} from "./I18nContext";
import { resetWarned } from "../../../common/i18n/warn";

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

beforeEach(() => {
  resetI18nProviderWarns();
  resetWarned();
});

const ShowLocale = () => {
  const i18n = useI18n();
  return h("span", { "data-testid": "locale" }, i18n.locale);
};

describe("I18nProvider", () => {
  it("renders user-catalog values and re-renders on setLocale", () => {
    const App = () => {
      const i18n = useI18n();
      return h(
        "div",
        null,
        h("span", { "data-testid": "greeting" }, i18n.t("greeting")),
        h(
          "button",
          {
            "data-testid": "switch",
            onClick: () => i18n.setLocale(i18n.locale === "en" ? "fr" : "en"),
          },
          "switch",
        ),
      );
    };
    const { getByTestId } = render(
      h(
        I18nProvider,
        { locales: { en: { greeting: "Hello" }, fr: { greeting: "Bonjour" } } },
        h(App),
      ),
    );
    expect(getByTestId("greeting").textContent).toBe("Hello");
    fireEvent.click(getByTestId("switch"));
    expect(getByTestId("greeting").textContent).toBe("Bonjour");
  });

  it("reads the persisted locale from storage when no explicit locale is set", () => {
    window.localStorage.setItem("ui-kit:locale", "fr");
    render(
      h(I18nProvider, { locales: { fr: { greeting: "Bonjour" } } }, h(ShowLocale)),
    );
    expect(screen.getByTestId("locale").textContent).toBe("fr");
  });

  it("persists setLocale to storage and updates <html lang/dir> (RTL)", () => {
    const SetAr = () => {
      const i18n = useI18n();
      return h(
        "button",
        { "data-testid": "to-ar", onClick: () => i18n.setLocale("ar") },
        "go",
      );
    };
    const { getByTestId } = render(
      h(I18nProvider, { locales: { ar: { greeting: "مرحبا" } } }, h(SetAr)),
    );
    fireEvent.click(getByTestId("to-ar"));
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(window.localStorage.getItem("ui-kit:locale")).toBe("ar");
  });
});

describe("no-provider contract", () => {
  it("useI18n outside a provider: kit engine, one-time warn, no throw", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(h(ShowLocale));
    expect(screen.getByTestId("locale").textContent).toBe("en");
    // The kit engine still resolves kit strings.
    render(h(ShowLocale));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("outside <I18nProvider>");
    warn.mockRestore();
  });
});

describe("SSR-safety", () => {
  it("engine + provider render without document or navigator", () => {
    vi.stubGlobal("document", undefined);
    vi.stubGlobal("navigator", undefined);
    const Greeting = () => {
      const i18n = useI18n();
      return h("span", null, `${i18n.t("greeting")}:${i18n.locale}`);
    };
    const html = renderToString(
      h(
        I18nProvider,
        { locales: { en: { greeting: "Hello" } } },
        h(Greeting),
      ),
    );
    expect(html).toContain("Hello:en");
  });
});
