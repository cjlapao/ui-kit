import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nProvider } from "../i18n";
import { VariablePicker } from "./VariablePicker";
import type { SmartVariableGroup } from "../types/Variables";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "app",
    label: "App",
    variables: [{ key: "REGION", value: "eu-west-1" }],
  },
];

const card = (container: HTMLElement) => container.firstChild as HTMLElement;

describe("VariablePicker (surfaces)", () => {
  it("is a lifted card by default", () => {
    const { container } = render(
      <VariablePicker groups={GROUPS} onSelect={() => {}} />,
    );
    expect(card(container).className).toContain("shadow-xl");
    expect(card(container).className).not.toContain("backdrop-blur");
  });

  it("takes any container surface, not just its own one", () => {
    const { container } = render(
      <VariablePicker groups={GROUPS} variant="outlined" onSelect={() => {}} />,
    );
    expect(card(container).className).toContain("border");
    expect(card(container).className).not.toContain("shadow-xl");
  });

  it("pulls its search box into the glass when the card is glass", () => {
    // The pairing rule from the other side: an input inside glass is glass.
    // A flat search box on a blurred card is a slab punched through it.
    const { container } = render(
      <VariablePicker groups={GROUPS} variant="glass" onSelect={() => {}} />,
    );
    expect(card(container).className).toContain("backdrop-blur-xl");
    expect(
      container.querySelectorAll('[class*="backdrop-blur"]').length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("scrolls its rows with the kit ScrollArea, not a native bar", () => {
    // No more `overflow-y-auto` div with a browser-default scrollbar (or a
    // `-webkit-` hope) — the rows scroll on the same overlay bars every
    // other kit surface uses, capped at the picker's 16rem.
    const { container } = render(
      <VariablePicker groups={GROUPS} onSelect={() => {}} />,
    );
    expect(
      container.querySelector('[data-slot="scrollarea"][class*="max-h-64"]'),
    ).not.toBeNull();
    expect(container.querySelector(".overflow-y-auto")).toBeNull();
  });

  it("rides the shared corner scale like every other card", () => {
    const { container } = render(
      <VariablePicker groups={GROUPS} onSelect={() => {}} />,
    );
    // auto → the theme's container corner (`rounded-md` token → rounded-2xl).
    expect(card(container).className).toContain("rounded-2xl");
    const { container: pinned } = render(
      <VariablePicker groups={GROUPS} corner="none" onSelect={() => {}} />,
    );
    expect(card(pinned).className).toContain("rounded-none");
  });
});

describe("VariablePicker (behaviours)", () => {
  const GROUPS: SmartVariableGroup[] = [
    {
      id: "app",
      label: "App",
      tone: "violet",
      variables: [
        { key: "REGION", label: "Region", value: "eu-west-1" },
        { key: "KEY", label: "API key", value: "abc", secret: true },
      ],
    },
    { id: "secrets", label: "Vault", variables: [] },
  ];

  const search = () => screen.getByPlaceholderText("Search variables...");

  it("titles the card and honours a custom title", () => {
    render(<VariablePicker groups={GROUPS} onSelect={() => {}} />);
    expect(screen.getByText("Insert variable")).toBeInTheDocument();
    render(
      <VariablePicker
        groups={GROUPS}
        title="Dock a token"
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText("Dock a token")).toBeInTheDocument();
  });

  it("renders one tab per group with a live count badge", () => {
    render(<VariablePicker groups={GROUPS} onSelect={() => {}} />);
    expect(screen.getByRole("tab", { name: /App/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Vault/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /Vault/ }));
    expect(screen.getByText("No vault variables.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /App/ }));
    expect(screen.getByText("Region")).toBeInTheDocument();
  });

  it("filters across tabs, updating the badges and the empty message", async () => {
    render(<VariablePicker groups={GROUPS} onSelect={() => {}} />);
    fireEvent.change(search(), { target: { value: "KEY" } });
    await waitFor(() =>
      expect(screen.queryByText("Region")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("API key")).toBeInTheDocument();
    fireEvent.change(search(), { target: { value: "nothing" } });
    await waitFor(() =>
      expect(
        screen.getAllByText(/Nothing matches .nothing./).length,
      ).toBeGreaterThan(0),
    );
  });

  it("rows wash neutral on hover - not their group tone", () => {
    render(<VariablePicker groups={GROUPS} onSelect={() => {}} />);
    const row = screen.getByRole("button", { name: /Region/ });
    const classes = row.className.split(" ");
    expect(classes).toContain("hover:bg-neutral-50");
    // The focus-visible ring legitimately carries the group's violet;
    // only a violet HOVER wash would be the tone-tinted-menu bug.
    expect(
      classes.some((c) => c.startsWith("hover:") && c.includes("violet")),
    ).toBe(false);
  });

  it("selects the variable object", () => {
    const onSelect = vi.fn();
    render(<VariablePicker groups={GROUPS} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /Region/ }));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        fullToken: "{{ var::app::REGION }}",
        name: "REGION",
      }),
    );
  });

  it("shows resolved values - masked for secrets, rose when missing", () => {
    const resolve = vi.fn((v) =>
      v.name === "KEY"
        ? { state: "resolved" as const, value: v.value ?? "" }
        : { state: "missing" as const, value: "" },
    );
    render(
      <VariablePicker groups={GROUPS} onSelect={() => {}} resolve={resolve} />,
    );
    // Secrets never print their value.
    expect(screen.getByText("••••••")).toBeInTheDocument();
    const missing = screen.getByText("—");
    expect(missing.className.split(" ")).toContain("text-rose-500");
  });

  it("says so when there are no groups at all", () => {
    render(<VariablePicker groups={[]} onSelect={() => {}} />);
    expect(screen.getByText("No variables available.")).toBeInTheDocument();
  });

  it("closes from the header button", () => {
    const onClose = vi.fn();
    render(
      <VariablePicker groups={GROUPS} onSelect={() => {}} onClose={onClose} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("Escape closes when the search box is empty, and defers to its clear otherwise", async () => {
    const onClose = vi.fn();
    render(
      <VariablePicker groups={GROUPS} onSelect={() => {}} onClose={onClose} />,
    );
    fireEvent.keyDown(screen.getByText("Insert variable"), {
      key: "Escape",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    onClose.mockClear();
    fireEvent.change(search(), { target: { value: "REGION" } });
    // Wait for the debounced onSearch to land in the picker's own state -
    // the input's value runs ahead of it.
    await waitFor(() =>
      expect(screen.queryByText("API key")).not.toBeInTheDocument(),
    );
    // Text in the box: Escape belongs to SearchBar's clear, not to us.
    fireEvent.keyDown(screen.getByText("Insert variable"), {
      key: "Escape",
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("prefills from initialSearch", () => {
    render(
      <VariablePicker
        groups={GROUPS}
        initialSearch="KEY"
        onSelect={() => {}}
      />,
    );
    expect(search().getAttribute("value")).toBe("KEY");
    expect(screen.getByText("API key")).toBeInTheDocument();
    expect(screen.queryByText("Region")).not.toBeInTheDocument();
  });

  it("localises title, close and empty text", () => {
    render(
      <I18nProvider locales={{}} locale="de" detect={false} storageKey={null}>
        <VariablePicker
          groups={GROUPS}
          onSelect={() => {}}
          onClose={() => {}}
        />
      </I18nProvider>,
    );
    expect(screen.getByText("Variable einfügen")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Schließen" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /Vault/ }));
    expect(screen.getByText("Keine vault-Variablen.")).toBeInTheDocument();
  });
});
