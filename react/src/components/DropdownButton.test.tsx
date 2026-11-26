import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import DropdownButton, { type DropdownButtonOption } from "./DropdownButton";

vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn(),
}));

const OPTIONS: DropdownButtonOption[] = [
  { value: "save", label: "Save" },
  { value: "save-as", label: "Save as…" },
  { value: "export", label: "Export", disabled: true },
];

const caret = (container: HTMLElement) =>
  container.querySelector<HTMLButtonElement>("[data-dropdown-caret]");

describe("DropdownButton", () => {
  // Auto-cleanup is not on in this vitest config; manual cleanup unmounts the
  // tree and its body-teleported menu together. (Blanking document.body by
  // hand instead tears the portal out from under React's unmount — that
  // "NotFoundError" took out every test after it.)
  afterEach(cleanup);

  it("renders a primary button and a caret", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} />,
    );
    expect(screen.getByRole("button", { name: "Deploy" })).toBeInTheDocument();
    expect(caret(container)).not.toBeNull();
  });

  it("the caret exposes menu semantics", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} />,
    );
    const trigger = caret(container)!;
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a real menu on caret click and updates aria-expanded", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} />,
    );
    fireEvent.click(caret(container)!);
    expect(caret(container)).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Save as…" }),
    ).toBeInTheDocument();
  });

  it("the caret click never fires the primary action", () => {
    const onPrimaryClick = vi.fn();
    const { container } = render(
      <DropdownButton
        label="Deploy"
        options={OPTIONS}
        onPrimaryClick={onPrimaryClick}
      />,
    );
    fireEvent.click(caret(container)!);
    expect(onPrimaryClick).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("the primary button never opens the menu", () => {
    const onPrimaryClick = vi.fn();
    render(
      <DropdownButton
        label="Deploy"
        options={OPTIONS}
        onPrimaryClick={onPrimaryClick}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Deploy" }));
    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("selecting an option reports it and closes the menu", () => {
    const onOptionSelect = vi.fn();
    const { container } = render(
      <DropdownButton
        label="Deploy"
        options={OPTIONS}
        onOptionSelect={onOptionSelect}
      />,
    );
    fireEvent.click(caret(container)!);
    fireEvent.click(screen.getByRole("menuitem", { name: "Save as…" }));
    expect(onOptionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "save-as" }),
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(caret(container)).toHaveAttribute("aria-expanded", "false");
  });

  it("disabled options are announced and inert", () => {
    const onOptionSelect = vi.fn();
    const { container } = render(
      <DropdownButton
        label="Deploy"
        options={OPTIONS}
        onOptionSelect={onOptionSelect}
      />,
    );
    fireEvent.click(caret(container)!);
    const item = screen.getByRole("menuitem", { name: "Export" });
    // Native disabled (the roving tabindex already skips disabled items, so
    // they never need to receive focus).
    expect(item).toBeDisabled();
    fireEvent.click(item);
    expect(onOptionSelect).not.toHaveBeenCalled();
  });

  it("Escape closes and restores focus to the caret", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} />,
    );
    const trigger = caret(container)!;
    // Focus the trigger first — the menu restores focus to whatever was
    // focused when it opened, and a synthetic click does not move focus.
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("ArrowDown moves through enabled items only", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} />,
    );
    fireEvent.click(caret(container)!);
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Save as…" })).toHaveFocus();
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    // Export is disabled — focus skips to the wrap-around or stays; either way
    // it must not land on the disabled item.
    expect(screen.getByRole("menuitem", { name: "Export" })).not.toHaveFocus();
  });

  it("no options hides the caret entirely — a single clean button", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={[]} />,
    );
    expect(caret(container)).toBeNull();
    expect(screen.getByRole("button", { name: "Deploy" })).toBeInTheDocument();
  });

  it("empty options can keep the caret when asked", () => {
    const { container } = render(
      <DropdownButton
        label="Deploy"
        options={[]}
        hideDropdownTriggerWhenEmpty={false}
      />,
    );
    const trigger = caret(container)!;
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("disabled disables both halves", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} disabled />,
    );
    expect(screen.getByRole("button", { name: "Deploy" })).toBeDisabled();
    expect(caret(container)).toBeDisabled();
  });

  it("the caret is named via i18n and can be overridden", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} />,
    );
    expect(caret(container)).toHaveAccessibleName("Toggle dropdown menu");

    const { container: custom } = render(
      <DropdownButton
        label="Deploy"
        options={OPTIONS}
        caretLabel="Deploy options"
      />,
    );
    expect(caret(custom)).toHaveAccessibleName("Deploy options");
  });

  it("split (default) joins the halves; single keeps them separate", () => {
    const { container, unmount } = render(
      <DropdownButton label="Deploy" options={OPTIONS} />,
    );
    expect(container.firstElementChild!.className).not.toContain("gap-");
    expect(screen.getByRole("button", { name: "Deploy" }).className).toContain(
      "rounded-r-none",
    );
    expect(caret(container)!.className).toContain("rounded-l-none");
    unmount();

    render(<DropdownButton label="Deploy" options={OPTIONS} split={false} />);
    expect(
      screen.getByRole("button", { name: "Deploy" }).className,
    ).not.toContain("rounded-r-none");
  });

  it("coerces the borderless clear variant to ghost — never a seam-less split", () => {
    // `clear` is excluded by the type; a JS caller passing it must still get
    // a control whose caret has a surface to join.
    const { container, rerender } = render(
      <DropdownButton
        label="Deploy"
        options={OPTIONS}
        variant={"clear" as never}
      />,
    );
    const clearish = container.firstElementChild!.innerHTML;
    rerender(
      <DropdownButton label="Deploy" options={OPTIONS} variant="ghost" />,
    );
    expect(container.firstElementChild!.innerHTML).toBe(clearish);
  });

  it("spreads extra button props onto the primary button", () => {
    render(
      <DropdownButton
        label="Deploy"
        options={OPTIONS}
        title="Ship it"
        data-testid="primary"
      />,
    );
    expect(screen.getByTestId("primary")).toHaveAttribute("title", "Ship it");
  });

  it("keeps the trigger tooltip out of the way while the menu is open", () => {
    vi.useFakeTimers();
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} tooltip="Ship it" />,
    );
    const trigger = screen.getByRole("button", { name: "Deploy" });
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    fireEvent.click(caret(container)!);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    // The popup opens right under the trigger; a tip still floating there
    // (portal, z 9999) would sit on top of the rows.
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    // Closing brings it back on the next hover.
    fireEvent.click(caret(container)!);
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    vi.useRealTimers();
  });
});

describe("DropdownButton — trigger width", () => {
  afterEach(cleanup);

  it("pins the control and lets the label ellipsize", () => {
    // The width lives on the container, because the control is two buttons:
    // pinning only the main one would leave the caret outside the number the
    // caller asked for (and `menuWidth="trigger"` measures this same element).
    const { container } = render(
      <DropdownButton
        label="Deploy to the production cluster"
        options={OPTIONS}
        width={220}
      />,
    );
    const control = container.firstElementChild as HTMLElement;
    expect(control.style.width).toBe("220px");
    const main = screen.getByRole("button", { name: /Deploy/ });
    expect(main).toHaveClass("min-w-0");
    const label = main.querySelector("span")!;
    expect(label).toHaveClass("min-w-0");
    expect(label).toHaveClass("truncate");
  });

  it("leaves the control's DOM alone when no width is given", () => {
    // The shrink chain is an opt-in cost: an unsized control renders exactly
    // what it rendered before, span-free and style-free.
    const { container } = render(<DropdownButton label="Deploy" options={OPTIONS} />);
    const control = container.firstElementChild as HTMLElement;
    expect(control.getAttribute("style")).toBeNull();
    const main = screen.getByRole("button", { name: "Deploy" });
    expect(main).not.toHaveClass("min-w-0");
    expect(main.querySelector("span.truncate")).toBeNull();
  });

  it("maxWidth caps a content-sized control and a CSS length rides through", () => {
    const { container } = render(
      <DropdownButton label="Deploy" options={OPTIONS} maxWidth="16rem" />,
    );
    expect((container.firstElementChild as HTMLElement).style.maxWidth).toBe(
      "16rem",
    );
  });

  it("never reaches the DOM as an HTML width attribute", () => {
    // A bare `width` used to fall through to `<button width="220">`, which the
    // browser ignores — the silent no-op these props replace.
    render(
      <DropdownButton label="Deploy" options={OPTIONS} width={200} maxWidth={300} />,
    );
    for (const button of screen.getAllByRole("button")) {
      expect(button.hasAttribute("width")).toBe(false);
      expect(button.hasAttribute("maxwidth")).toBe(false);
    }
  });
});
