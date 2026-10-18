// Kit component localization spot tests (plan task 3.3):
// FR DatePicker (button bar + weekday header), ES Combobox (empty state),
// DE Modal (close aria).
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createElement as h } from "react";
import { I18nProvider } from "./I18nContext";
import DatePicker from "../components/DatePicker/DatePicker";
import Combobox from "../components/Combobox";
import Modal from "../components/Modal";

afterEach(() => {
  window.localStorage.clear();
});

const withLocale = (locale: string, child: React.ReactElement) =>
  h(I18nProvider, { locale, locales: {} }, child);

describe("FR DatePicker", () => {
  it("renders the French Today button and weekday headers when open", () => {
    const input = render(
      withLocale(
        "fr",
        h(DatePicker, {
          showButtonBar: true,
          value: null,
          onChange: () => {},
          "aria-label": "date",
        }),
      ),
    );
    const inputEl = screen.getByRole("textbox");
    fireEvent.focus(inputEl);
    fireEvent.click(inputEl);
    // Button bar (CalendarPanel)
    expect(screen.getByText("Aujourd'hui")).toBeTruthy();
    expect(screen.getByText("Effacer")).toBeTruthy();
    // DayGrid weekday header (CLDR short forms for fr)
    expect(screen.getByText("lun.")).toBeTruthy();
    expect(screen.getByText("mar.")).toBeTruthy();
    expect(input).toBeTruthy();
  });
});

describe("ES Combobox", () => {
  it("shows the Spanish empty state for no matches", () => {
    render(
      withLocale(
        "es",
        h(Combobox, {
          options: [],
          onChange: () => {},
          "aria-label": "pick",
        }),
      ),
    );
    const inputEl = screen.getByRole("combobox");
    fireEvent.focus(inputEl);
    expect(
      screen.getByText(/No hay opciones coincidentes/),
    ).toBeTruthy();
  });
});

describe("DE Modal", () => {
  it("uses the German close aria-label", () => {
    render(
      withLocale(
        "de",
        h(Modal, {
          isOpen: true,
          title: "T",
          onClose: () => {},
          children: h("p", null, "content"),
        }),
      ),
    );
    expect(
      screen.getByRole("button", { name: "Dialog schließen" }),
    ).toBeTruthy();
  });
});
