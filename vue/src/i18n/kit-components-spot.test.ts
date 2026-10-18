// Kit component localization spot tests (plan task 4.3, Vue half):
// Spanish Combobox empty state, German Modal close aria-label, French
// SearchBar placeholder.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import { I18nProvider } from "./index";
import Combobox from "../components/Combobox.vue";
import Modal from "../components/Modal.vue";
import SearchBar from "../components/SearchBar.vue";

afterEach(() => {
  window.localStorage.clear();
});

const withLocale = (locale: string, child: () => unknown) =>
  mount(() => h(I18nProvider, { locale, locales: {} }, child));

describe("ES Combobox", () => {
  it("shows the Spanish empty state for no matches", async () => {
    const w = withLocale(
      "es",
      () =>
        h(Combobox, {
          options: [] as string[],
          "aria-label": "pick",
        }),
    );
    const input = w.get('[role="combobox"]');
    await input.trigger("focus");
    expect(w.html()).toContain("No hay opciones coincidentes");
  });
});

describe("DE Modal", () => {
  it("uses the German close aria-label", () => {
    // The Vue Modal teleports to <body>, so query the document, not the
    // wrapper root.
    withLocale(
      "de",
      () =>
        h(
          Modal,
          { isOpen: true, title: "T", onClose: () => {} },
          () => h("p", "content"),
        ),
    );
    const close = [...document.body.querySelectorAll("button")]
      .map((b) => b.getAttribute("aria-label"))
      .find((label) => label?.startsWith("Dialog"));
    expect(close).toBe("Dialog schließen");
  });
});

describe("FR SearchBar", () => {
  it("uses the French placeholder", () => {
    const w = withLocale(
      "fr",
      () => h(SearchBar, { "aria-label": "search" }),
    );
    const input = w.get("input");
    expect(input.attributes("placeholder")).toBe("Rechercher...");
  });
});
