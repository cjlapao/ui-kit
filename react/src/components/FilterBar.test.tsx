import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import FilterBar, { type FilterBarProps } from "./FilterBar";

afterEach(() => { cleanup(); vi.useRealTimers(); });
const filters = [
  { id: "status", label: "Status", options: [{ value: "online", label: "Online", count: 3 }, { value: "offline", label: "Offline", count: 8 }, { value: "disabled", label: "Disabled", disabled: true, count: 0 }] },
  { id: "user", label: "User", options: [{ value: "carlos", label: "Carlos", count: 0 }] },
];
function setup(props: Partial<FilterBarProps> = {}) {
  const onChange = vi.fn();
  const onSearch = vi.fn();
  const result = render(<FilterBar filters={filters} searchProps={{ onSearch }} onChange={onChange} filteredCount={3} totalCount={11} itemLabel="devices" {...props} />);
  return { ...result, onChange, onSearch };
}
function openStatus() {
  fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Status" }));
}

describe("FilterBar", () => {
  it("shows collapsed search, empty state and caller-owned result counts", () => {
    setup();
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("No filters applied")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("3 of 11 devices");
  });
  it("styles the search trigger with searchButtonVariant, pinning its icon-only footprint", () => {
    const { container } = setup();
    expect(container.querySelector(".fb-search-trigger")).toHaveAttribute("data-variant", "icon");
    const { container: outlined } = setup({ searchButtonVariant: "outline" });
    const trigger = outlined.querySelector(".fb-search-trigger")!;
    expect(trigger).toHaveAttribute("data-variant", "outline");
    // sizeConfig.iconOnly for md — the treatment changes, the compact footprint does not.
    expect(trigger).toHaveClass("p-2.5");
  });
  it("stages multiple checkbox selections and commits once on Done", () => {
    const { onChange } = setup(); openStatus();
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Online" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Offline" }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith({ status: ["online", "offline"] });
    expect(screen.getByRole("button", { name: "Status: Online, Offline" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add filter" })).toHaveFocus();
  });
  it.each(["Back", "Escape", "outside"])("discards drafts on %s", action => {
    const { onChange } = setup(); openStatus();
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Online" }));
    if (action === "Back") fireEvent.click(screen.getByRole("button", { name: "Back" }));
    else if (action === "Escape") fireEvent.keyDown(screen.getByRole("menuitemcheckbox", { name: "Online" }), { key: "Escape" });
    else fireEvent.pointerDown(document.body);
    expect(onChange).not.toHaveBeenCalled();
    if (action === "Back") fireEvent.click(screen.getByRole("menuitem", { name: "Status" }));
    else openStatus();
    expect(screen.getByRole("menuitemcheckbox", { name: "Online" })).toHaveAttribute("aria-checked", "false");
  });
  it("clears a category draft, preserves other categories and removes chips immediately", () => {
    const { onChange } = setup({ defaultValue: { status: ["online"], user: ["carlos"] } });
    fireEvent.click(screen.getByRole("button", { name: "Status: Online" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onChange).toHaveBeenLastCalledWith({ user: ["carlos"] });
    fireEvent.click(screen.getByRole("button", { name: "Remove User: Carlos filter" }));
    expect(onChange).toHaveBeenLastCalledWith({});
  });
  it("keeps controlled chips until caller updates value; normalizes invalid entries", () => {
    const onChange = vi.fn();
    const props = { filters, searchProps: { onSearch: vi.fn() }, filteredCount: 3, totalCount: 11, onChange };
    const { rerender } = render(<FilterBar {...props} value={{ status: ["online", "unknown"], missing: ["x"] }} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith({});
    expect(screen.getByRole("button", { name: "Status: Online" })).toBeInTheDocument();
    rerender(<FilterBar {...props} value={{ user: ["carlos"] }} />);
    expect(screen.getByRole("button", { name: "User: Carlos" })).toBeInTheDocument();
  });
  it("expands, focuses and retains the same SearchBar input and API", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    const { container } = setup({ searchProps: { onSearch, debounceMs: 50, placeholder: "Find devices" } });
    const input = screen.getByPlaceholderText("Find devices");
    expect(input.closest("[inert]")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(input).toHaveFocus();
    fireEvent.change(input, { target: { value: "mac" } });
    act(() => vi.advanceTimersByTime(50));
    expect(onSearch).toHaveBeenLastCalledWith("mac", expect.any(AbortSignal));
    fireEvent.blur(container.querySelector(".fb-search")!, { relatedTarget: document.body });
    expect(input.closest("[inert]")).toBeNull();
    fireEvent.keyDown(input, { key: "Escape" });
    fireEvent.blur(container.querySelector(".fb-search")!, { relatedTarget: document.body });
    expect(input.closest("[inert]")).not.toBeNull();
    expect(container.querySelector("input")).toBe(input);
  });
  it("forwards manual search, loading, clear and external clear without resetting filters", () => {
    const onSearch = vi.fn(); const onClear = vi.fn();
    const props = { filters, defaultValue: { status: ["online"] }, filteredCount: 1, totalCount: 11 };
    const { rerender } = render(<FilterBar {...props} searchProps={{ onSearch, onClear, autoSearch: false, initialValue: "mac", loading: true }} />);
    const input = screen.getByDisplayValue("mac");
    fireEvent.change(input, { target: { value: "server" } });
    expect(onSearch).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSearch).toHaveBeenLastCalledWith("server", expect.any(AbortSignal));
    rerender(<FilterBar {...props} searchProps={{ onSearch, onClear, autoSearch: false, shouldClear: true }} />);
    expect(input).toHaveValue("");
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Status: Online" })).toBeInTheDocument();
  });
  it("does not clear search on Clear all", () => {
    setup({ defaultValue: { status: ["online"] }, searchProps: { onSearch: vi.fn(), initialValue: "mac" } });
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByDisplayValue("mac")).toBeInTheDocument();
    expect(screen.getByText("No filters applied")).toBeInTheDocument();
  });
  it("disables controls and prevents disabled options from changing", () => {
    const { onChange, unmount } = setup(); openStatus();
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Disabled" }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onChange).toHaveBeenLastCalledWith({});
    unmount(); setup({ disabled: true });
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Add filter" })).toBeDisabled();
  });
  it("keeps the options open when Tab moves toward Clear and Done", () => {
    setup(); openStatus();
    fireEvent.keyDown(screen.getByRole("menuitemcheckbox", { name: "Online" }), { key: "Tab" });
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("button", { name: "Done" }), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button", { name: "Add filter" })).toHaveFocus();
  });
  it("discards the draft when keyboard focus leaves the popup", () => {
    const { onChange } = setup(); openStatus();
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Online" }));
    fireEvent.blur(screen.getByRole("button", { name: "Done" }), { relatedTarget: document.body });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
  it("allows zero-count options and preserves multiple categories", () => {
    const { onChange } = setup({ defaultValue: { status: ["online"] } });
    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "User" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Carlos" }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onChange).toHaveBeenLastCalledWith({ status: ["online"], user: ["carlos"] });
  });
  it("supports category IDs that overlap object prototype properties", () => {
    setup({ filters: [{ id: "toString", label: "Custom", options: [{ value: "yes", label: "Yes" }] }] });
    expect(screen.getByText("No filters applied")).toBeInTheDocument();
  });
  it("hides the result summary and its divider without changing applied filters", () => {
    const { onChange } = setup({ showResultCount: false, showClearAll: false, defaultValue: { status: ["online"] } });
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByText("3 of 11 devices")).toBeNull();
    expect(screen.queryByRole("button", { name: "Clear all" })).toBeNull();
    expect(screen.getByRole("button", { name: "Status: Online" })).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Remove Status: Online filter" }));
    expect(onChange).toHaveBeenLastCalledWith({});
  });
  it("preserves the mounted search query while hiding and showing search", () => {
    const props = { filters, searchProps: { onSearch: vi.fn(), initialValue: "mac", autoSearch: false }, filteredCount: 1, totalCount: 11 };
    const { rerender } = render(<FilterBar {...props} />);
    const input = screen.getByDisplayValue("mac");
    fireEvent.change(input, { target: { value: "server" } });
    rerender(<FilterBar {...props} showSearch={false} />);
    expect(input).not.toBeVisible();
    expect(input.closest("[inert]")).not.toBeNull();
    rerender(<FilterBar {...props} showSearch />);
    expect(input).toBeVisible();
    expect(input).toHaveValue("server");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(props.searchProps.onSearch).toHaveBeenLastCalledWith("server", expect.any(AbortSignal));
  });
  it("can hide labels and menu counts while retaining option selection", () => {
    const { onChange } = setup({ showFilterLabel: false, showEmptyState: false, showMenuCounts: false });
    expect(screen.queryByText("Filters")).toBeNull();
    expect(screen.queryByText("No filters applied")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
    expect(screen.queryByText("3")).toBeNull();
    fireEvent.click(screen.getByRole("menuitem", { name: "Status" }));
    expect(screen.queryByText("8")).toBeNull();
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Offline" }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onChange).toHaveBeenLastCalledWith({ status: ["offline"] });
  });
  it("supports keyboard category navigation and restores focus after cancellation", async () => {
    setup();
    fireEvent.keyDown(screen.getByRole("button", { name: "Add filter" }), { key: "ArrowDown" });
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Status" })).toHaveFocus());
    fireEvent.click(screen.getByRole("menuitem", { name: "Status" }));
    await waitFor(() => expect(screen.getByRole("menuitemcheckbox", { name: "Online" })).toHaveFocus());
    fireEvent.keyDown(screen.getByRole("menuitemcheckbox", { name: "Online" }), { key: "ArrowLeft" });
    expect(screen.getByRole("menu", { name: "Filter by" })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Status" }), { key: "Escape" });
    expect(screen.getByRole("button", { name: "Add filter" })).toHaveFocus();
  });

  describe("loading", () => {
    it("rests quiet by default — no overlay, no busy signal", () => {
      setup();
      expect(screen.queryByRole("status", { name: "Loading" })).toBeNull();
      expect(screen.getByRole("group", { name: "Filters" })).not.toHaveAttribute("aria-busy");
    });
    it("dims the live bar under a labelled status overlay", () => {
      setup({ loading: true, loaderType: "spinner" });
      expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
      expect(screen.getByRole("group", { name: "Filters" })).toHaveAttribute("aria-busy", "true");
      // The controls yield beneath the scrim, they don't vanish — the bar
      // holds its shape from the first frame to the last. (`status` takes
      // its name from the author, so the summary is asserted by text.)
      expect(screen.getByRole("button", { name: "Add filter" })).toBeInTheDocument();
      expect(screen.getByText("3 of 11 devices")).toBeInTheDocument();
    });
    it("names the overlay with loadingMessage", () => {
      setup({ loading: true, loaderType: "spinner", loadingMessage: "Fetching devices" });
      expect(screen.getByRole("status", { name: "Fetching devices" })).toBeInTheDocument();
    });
    it("fills the bar and publishes the value under loaderType=\"progress\"", () => {
      setup({ loading: true, loaderType: "progress", loaderProgress: 40 });
      const bar = within(screen.getByRole("status", { name: "Loading" })).getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuenow", "40");
    });
    it("defaults to rewriting the bar's pieces in placeholder ink", () => {
      const { container } = setup({
        loading: true, defaultValue: { status: ["online"] },
        searchProps: { onSearch: vi.fn(), initialValue: "mac", autoSearch: false },
      });
      expect(screen.queryByRole("button", { name: "Add filter" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Search" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Status: Online" })).toBeNull();
      // The skeleton carries no Loader overlay — the placeholders are the signal.
      expect(screen.queryByRole("status")).toBeNull();
      // The query survives the rewrite — the field is hidden, not unmounted,
      // the same contract collapse uses.
      expect(screen.getByDisplayValue("mac")).not.toBeVisible();
      const skeleton = container.querySelector(".animate-pulse[aria-hidden='true']");
      expect(skeleton).not.toBeNull();
      // Search capsule, divider, label bar, two chips, add ring, summary —
      // seven bars; the trailing flex spacer is not one.
      expect(skeleton?.querySelectorAll(".block")).toHaveLength(7);
    });
    it("closes an open popup when the bar goes busy", () => {
      const props = { filters, searchProps: { onSearch: vi.fn() }, filteredCount: 3, totalCount: 11, itemLabel: "devices" };
      const { rerender } = render(<FilterBar {...props} />);
      fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Status" }));
      fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Online" }));
      rerender(<FilterBar {...props} loading loaderType="spinner" />);
      // The overlay does not reach the portal — the popup cannot float over
      // a busy bar, so the popup state yields with the rest of the controls.
      expect(screen.queryByRole("menuitemcheckbox")).toBeNull();
      // Spinner mode keeps the controls mounted beneath the scrim…
      expect(screen.getByRole("button", { name: "Add filter" })).toBeInTheDocument();
      rerender(<FilterBar {...props} loading loaderType="skeleton" />);
      // …and skeleton replaces them outright.
      expect(screen.queryByRole("button", { name: "Add filter" })).toBeNull();
      rerender(<FilterBar {...props} />);
      expect(screen.getByRole("button", { name: "Add filter" })).toBeInTheDocument();
    });
  });

  const textFilters = [
    { id: "tag", label: "Tag", type: "text" as const, inputProps: { placeholder: "Tag" } },
    { id: "loop", label: "Source loop", type: "text" as const, display: "menu" as const, inputProps: { placeholder: "Source loop slug" } },
  ];
  function setupText(props: Partial<FilterBarProps> = {}, customFilters = textFilters) {
    const onChange = vi.fn();
    const result = render(<FilterBar filters={customFilters} searchProps={{ onSearch: vi.fn() }} onChange={onChange} filteredCount={2} totalCount={5} {...props} />);
    return { ...result, onChange };
  }
  function openLoop() {
    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Source loop" }));
  }

  describe("text filters", () => {
    it("renders the inline field, excludes it from the category list, lists the menu one", () => {
      setupText();
      expect(screen.getByPlaceholderText("Tag")).toBeInTheDocument();
      expect(screen.queryByPlaceholderText("Source loop slug")).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
      expect(screen.getByRole("menuitem", { name: "Source loop" })).toBeInTheDocument();
      expect(screen.queryByRole("menuitem", { name: "Tag" })).toBeNull();
    });
    it("disables Add filter when only inline text filters exist", () => {
      setupText({}, [textFilters[0]]);
      expect(screen.getByRole("button", { name: "Add filter" })).toBeDisabled();
    });
    it("disables the inline field with the bar", () => {
      setupText({ disabled: true });
      expect(screen.getByPlaceholderText("Tag")).toBeDisabled();
    });
    it("keeps typing local and commits the trimmed term once on Enter", () => {
      const { onChange } = setupText();
      const input = screen.getByPlaceholderText("Tag");
      fireEvent.change(input, { target: { value: "  auth  " } });
      expect(onChange).not.toHaveBeenCalled();
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onChange).toHaveBeenCalledExactlyOnceWith({ tag: ["auth"] });
      expect(screen.getByRole("button", { name: "Tag: auth" })).toBeInTheDocument();
    });
    it("commits on blur and omits the key when the term is blank", () => {
      const { onChange } = setupText({ defaultValue: { tag: ["auth"] } });
      const input = screen.getByPlaceholderText("Tag");
      expect(input).toHaveValue("auth");
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenLastCalledWith({});
      expect(input).toHaveValue("");
    });
    it("reverts the uncommitted draft on Escape without emitting", () => {
      const { onChange } = setupText({ defaultValue: { tag: ["auth"] } });
      const input = screen.getByPlaceholderText("Tag");
      fireEvent.change(input, { target: { value: "typo" } });
      fireEvent.keyDown(input, { key: "Escape" });
      expect(input).toHaveValue("auth");
      expect(onChange).not.toHaveBeenCalled();
    });
    it("focuses the field from the chip button and removes the value from its ✕", () => {
      const { onChange } = setupText({ defaultValue: { tag: ["auth"] } });
      fireEvent.click(screen.getByRole("button", { name: "Tag: auth" }));
      expect(screen.getByPlaceholderText("Tag")).toHaveFocus();
      fireEvent.click(screen.getByRole("button", { name: "Remove Tag: auth filter" }));
      expect(onChange).toHaveBeenLastCalledWith({});
      expect(screen.getByPlaceholderText("Tag")).toHaveValue("");
    });
    it("Clear all clears text values, chips and fields", () => {
      const { onChange } = setupText({ defaultValue: { tag: ["auth"], loop: ["loop-7"] } });
      fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith({});
      expect(screen.getByPlaceholderText("Tag")).toHaveValue("");
    });
    it("normalizes controlled values to the first term, trimmed; unknown ids drop", () => {
      const onChange = vi.fn();
      render(<FilterBar filters={textFilters} searchProps={{ onSearch: vi.fn() }} onChange={onChange} filteredCount={1} totalCount={5}
        value={{ tag: ["  auth ", "second"], unknown: ["x"] }} />);
      expect(screen.getByPlaceholderText("Tag")).toHaveValue("auth");
      expect(screen.getByRole("button", { name: "Tag: auth" })).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });
    it("drills into a seeded draft field; Done and Enter commit, Escape discards", () => {
      const { onChange } = setupText();
      openLoop();
      const input = screen.getByPlaceholderText("Source loop slug");
      fireEvent.change(input, { target: { value: "loop-7" } });
      fireEvent.click(screen.getByRole("button", { name: "Done" }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith({ loop: ["loop-7"] });
      expect(screen.getByRole("button", { name: "Source loop: loop-7" })).toBeInTheDocument();
      // Reopening seeds the draft from the applied value; Enter commits it.
      openLoop();
      const seeded = screen.getByPlaceholderText("Source loop slug");
      expect(seeded).toHaveValue("loop-7");
      fireEvent.change(seeded, { target: { value: "discarded" } });
      fireEvent.keyDown(seeded, { key: "Escape" });
      expect(onChange).toHaveBeenCalledTimes(1);
      openLoop();
      const again = screen.getByPlaceholderText("Source loop slug");
      expect(again).toHaveValue("loop-7");
      fireEvent.change(again, { target: { value: "loop-8" } });
      fireEvent.keyDown(again, { key: "Enter" });
      expect(onChange).toHaveBeenLastCalledWith({ loop: ["loop-8"] });
    });
    it("empties the draft on Clear; Done then omits the key; ArrowLeft keeps the caret", () => {
      const { onChange } = setupText({ defaultValue: { loop: ["loop-7"] } });
      openLoop();
      const input = screen.getByPlaceholderText("Source loop slug");
      fireEvent.keyDown(input, { key: "ArrowLeft" });
      // The Back shortcut must not steal the caret from a text field.
      expect(screen.getByPlaceholderText("Source loop slug")).toBeInTheDocument();
      fireEvent.change(input, { target: { value: "edited" } });
      fireEvent.click(screen.getByRole("button", { name: "Clear" }));
      expect(input).toHaveValue("");
      fireEvent.click(screen.getByRole("button", { name: "Done" }));
      expect(onChange).toHaveBeenLastCalledWith({});
    });
    it("opens the drill-down from the chip of a menu-mode filter", () => {
      setupText({ defaultValue: { loop: ["loop-7"] } });
      fireEvent.click(screen.getByRole("button", { name: "Source loop: loop-7" }));
      expect(screen.getByPlaceholderText("Source loop slug")).toHaveValue("loop-7");
    });
    it("keeps uncommitted typing mounted, hidden and inert under the skeleton", () => {
      const { rerender } = setupText();
      const input = screen.getByPlaceholderText("Tag");
      fireEvent.change(input, { target: { value: "half-typed" } });
      rerender(<FilterBar filters={textFilters} searchProps={{ onSearch: vi.fn() }} onChange={vi.fn()} filteredCount={2} totalCount={5} loading loaderType="skeleton" />);
      expect(screen.getByPlaceholderText("Tag")).toHaveValue("half-typed");
      expect(input.closest("[hidden]")).not.toBeNull();
      expect(input.closest("[inert]")).not.toBeNull();
    });
  });

  const singleFilters = [
    { id: "status", label: "Status", options: [{ value: "online", label: "Online", count: 3 }, { value: "offline", label: "Offline", count: 8 }] },
    { id: "enrollment", label: "Enrollment", type: "single" as const, options: [{ value: "enabled", label: "Enabled", count: 4 }, { value: "disabled", label: "Disabled", count: 1 }, { value: "unknown", label: "Unknown", disabled: true }] },
  ];
  function setupSingle(props: Partial<FilterBarProps> = {}, customFilters = singleFilters) {
    const onChange = vi.fn();
    const result = render(<FilterBar filters={customFilters} searchProps={{ onSearch: vi.fn() }} onChange={onChange} filteredCount={2} totalCount={5} {...props} />);
    return { ...result, onChange };
  }
  function openEnrollment() {
    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Enrollment" }));
  }

  describe("single-select filters", () => {
    it("lists the arm in the categories and drills into a radio group without a Done", () => {
      setupSingle();
      openEnrollment();
      expect(screen.getByRole("menuitemradio", { name: "Enabled" })).toHaveAttribute("aria-checked", "false");
      expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
      // Nothing is staged, so there is nothing for Done to confirm.
      expect(screen.queryByRole("button", { name: "Done" })).toBeNull();
    });
    it("applies the pick in one commit, closes the popup and restores focus", () => {
      const { onChange } = setupSingle();
      openEnrollment();
      fireEvent.click(screen.getByRole("menuitemradio", { name: "Enabled" }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith({ enrollment: ["enabled"] });
      expect(screen.queryByRole("menuitemradio")).toBeNull();
      expect(screen.getByRole("button", { name: "Add filter" })).toHaveFocus();
      expect(screen.getByRole("button", { name: "Enrollment: Enabled" })).toBeInTheDocument();
    });
    it("moves the check to the picked value and keeps every other category", () => {
      const { onChange } = setupSingle({ defaultValue: { enrollment: ["enabled"], status: ["online"] } });
      openEnrollment();
      expect(screen.getByRole("menuitemradio", { name: "Enabled" })).toHaveAttribute("aria-checked", "true");
      expect(screen.getByRole("menuitemradio", { name: "Disabled" })).toHaveAttribute("aria-checked", "false");
      fireEvent.click(screen.getByRole("menuitemradio", { name: "Disabled" }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith({ enrollment: ["disabled"], status: ["online"] });
    });
    it("re-clicking the checked row takes the category back to none", () => {
      const { onChange } = setupSingle({ defaultValue: { enrollment: ["enabled"] } });
      openEnrollment();
      fireEvent.click(screen.getByRole("menuitemradio", { name: "Enabled" }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith({});
      expect(screen.queryByRole("button", { name: "Enrollment: Enabled" })).toBeNull();
    });
    it("Clear removes the value and closes the drill-down", () => {
      const { onChange } = setupSingle({ defaultValue: { enrollment: ["enabled"] } });
      openEnrollment();
      fireEvent.click(screen.getByRole("button", { name: "Clear" }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith({});
      expect(screen.queryByRole("menuitemradio")).toBeNull();
      expect(screen.getByRole("button", { name: "Add filter" })).toHaveFocus();
    });
    it("paints a bare check on the selected row, keeping the checkbox arm's square", () => {
      setupSingle({ defaultValue: { enrollment: ["enabled"] } });
      openEnrollment();
      const gutter = (name: string) => screen.getByRole("menuitemradio", { name }).firstElementChild as HTMLElement;
      // The valueset drops the box: an empty gutter, or the check alone.
      expect(gutter("Enabled")).not.toHaveClass("border");
      expect(gutter("Enabled").firstChild).not.toBeNull();
      expect(gutter("Disabled")).not.toHaveClass("border");
      expect(gutter("Disabled").firstChild).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Status" }));
      expect(screen.getByRole("menuitemcheckbox", { name: "Online" }).firstElementChild).toHaveClass("border");
    });
    it("makes each value a real button, so Enter and Space activate it", () => {
      setupSingle();
      openEnrollment();
      expect(screen.getByRole("menuitemradio", { name: "Enabled" }).tagName).toBe("BUTTON");
    });
    it("never activates a disabled option", () => {
      const { onChange } = setupSingle();
      openEnrollment();
      const row = screen.getByRole("menuitemradio", { name: "Unknown" });
      expect(row).toHaveAttribute("aria-disabled", "true");
      fireEvent.click(row);
      expect(onChange).not.toHaveBeenCalled();
    });
    it("hides option counts with showMenuCounts", () => {
      setupSingle({ showMenuCounts: false });
      openEnrollment();
      expect(screen.queryByText("4")).toBeNull();
    });
    it("normalizes a controlled multi-value to the first matching option", () => {
      const onChange = vi.fn();
      render(<FilterBar filters={singleFilters} searchProps={{ onSearch: vi.fn() }} onChange={onChange} filteredCount={1} totalCount={5}
        value={{ enrollment: ["disabled", "enabled"], status: ["ghost"] }} />);
      expect(onChange).not.toHaveBeenCalled();
      // An unknown value drops the category outright; the first supplied
      // value of the valueset wins, not the first option declared.
      expect(screen.queryByRole("button", { name: /^Status:/ })).toBeNull();
      expect(screen.getByRole("button", { name: "Enrollment: Disabled" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Enrollment" }));
      // Two values in, one row checked.
      expect(screen.getByRole("menuitemradio", { name: "Disabled" })).toHaveAttribute("aria-checked", "true");
      expect(screen.getByRole("menuitemradio", { name: "Enabled" })).toHaveAttribute("aria-checked", "false");
    });
    it("opens the drill-down from the chip and removes the value from its ✕", () => {
      const { onChange } = setupSingle({ defaultValue: { enrollment: ["enabled"] } });
      fireEvent.click(screen.getByRole("button", { name: "Enrollment: Enabled" }));
      expect(screen.getByRole("menuitemradio", { name: "Enabled" })).toHaveAttribute("aria-checked", "true");
      fireEvent.click(screen.getByRole("button", { name: "Remove Enrollment: Enabled filter" }));
      expect(onChange).toHaveBeenLastCalledWith({});
    });
    it("Back and Escape leave the applied value untouched", () => {
      const { onChange } = setupSingle({ defaultValue: { enrollment: ["enabled"] } });
      openEnrollment();
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByRole("menuitem", { name: "Enrollment" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("menuitem", { name: "Enrollment" }));
      fireEvent.keyDown(screen.getByRole("menuitemradio", { name: "Disabled" }), { key: "Escape" });
      expect(screen.queryByRole("menuitemradio")).toBeNull();
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Enrollment: Enabled" })).toBeInTheDocument();
    });
    it("Clear all clears single values alongside the other arms", () => {
      const { onChange } = setupSingle({ defaultValue: { enrollment: ["enabled"], status: ["online"] } });
      fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith({});
    });
    it("closes an open drill-down when the bar goes busy", () => {
      const props = { filters: singleFilters, searchProps: { onSearch: vi.fn() }, filteredCount: 2, totalCount: 5 };
      const { rerender } = render(<FilterBar {...props} />);
      openEnrollment();
      expect(screen.getByRole("menuitemradio", { name: "Enabled" })).toBeInTheDocument();
      rerender(<FilterBar {...props} loading loaderType="spinner" />);
      expect(screen.queryByRole("menuitemradio")).toBeNull();
    });
  });

  describe("leading and trailing slots", () => {
    const slotProps: FilterBarProps = {
      filters: textFilters, searchProps: { onSearch: vi.fn() }, filteredCount: 1, totalCount: 5,
      leading: <button type="button">Provenance: any</button>,
      trailing: <button type="button">Include retracted</button>,
    };
    it("renders at both ends and nothing when omitted", () => {
      const { container } = render(<FilterBar {...slotProps} />);
      expect(screen.getByRole("button", { name: "Provenance: any" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Include retracted" })).toBeVisible();
      const { container: bare } = setupText();
      expect(bare.querySelector(".fb-slot")).toBeNull();
      expect(container.querySelector(".fb-slot")).not.toBeNull();
    });
    it("stays mounted, hidden and inert through the skeleton; visible under the spinner", () => {
      const { rerender, container } = render(<FilterBar {...slotProps} />);
      const prov = screen.getByRole("button", { name: "Provenance: any" });
      rerender(<FilterBar {...slotProps} loading loaderType="skeleton" />);
      expect(screen.queryByRole("button", { name: "Provenance: any" })).toBeNull();
      expect(container.contains(prov)).toBe(true);
      expect(prov.closest("[hidden]")).not.toBeNull();
      expect(prov.closest("[inert]")).not.toBeNull();
      rerender(<FilterBar {...slotProps} loading loaderType="spinner" />);
      expect(screen.getByRole("button", { name: "Provenance: any" })).toBeVisible();
    });
  });

  it("moves a chip once per event: a reflow animates nothing, the exit timer replays nothing", () => {
    // jsdom has no Element.animate and gives every element a zero rect, so both
    // are stubbed: `lefts` is the geometry the FLIP measures and each call's
    // keyframe is what the chip was seen travelling from. The bug this guards:
    // the FLIP measured on *every* render, so an unrelated reflow — and the
    // render the exit timer schedules after any chip change — replayed a slide
    // the row had already made, ~900ms after a chip had arrived.
    const lefts = new Map([["status", 100], ["user", 220]]);
    const rects = Element.prototype.getBoundingClientRect;
    const animate = vi.fn(() => null as unknown as Animation);
    Element.prototype.animate = animate as unknown as typeof Element.prototype.animate;
    Element.prototype.getBoundingClientRect = function () {
      const left = (this as HTMLElement).dataset?.chip ? lefts.get((this as HTMLElement).dataset.chip!) ?? 0 : 0;
      return { left, top: 0, right: left, bottom: 0, width: 0, height: 0, x: left, y: 0, toJSON: () => ({}) } as DOMRect;
    };
    try {
      const element = () => <FilterBar filters={filters} searchProps={{ onSearch: vi.fn() }} onChange={vi.fn()} filteredCount={2} totalCount={11} itemLabel="devices" defaultValue={{ status: ["online"], user: ["carlos"] }} />;
      vi.useFakeTimers();
      const { rerender, container } = render(element());
      expect(animate).not.toHaveBeenCalled();

      // The row slides 48px left with nothing about the chips changed: measuring
      // has to keep up with every frame, but a frame that changed no shape may
      // not move anything.
      lefts.set("status", 52); lefts.set("user", 172);
      rerender(element());
      expect(animate).not.toHaveBeenCalled();

      // Removing a chip *is* a shape change, so the survivor slides into its
      // slot — from the 172 the previous frame actually measured, not from the
      // 220 it mounted at, which is what a gated *measurement* would replay.
      lefts.set("user", 52);
      fireEvent.click(screen.getByRole("button", { name: "Remove Status: Online filter" }));
      expect(animate).toHaveBeenCalledTimes(1);
      expect((animate.mock.contexts[0] as HTMLElement).dataset.chip).toBe("user");
      expect((animate.mock.calls[0][0] as { transform: string }[])[0].transform).toBe("translateX(120px)");

      // The ghost unmounts one motion later and re-renders the row: it is
      // measured again, and measuring is not animating.
      lefts.set("user", 40);
      act(() => vi.advanceTimersByTime(460));
      expect(animate).toHaveBeenCalledTimes(1);
      expect(container.querySelectorAll("[data-chip]")).toHaveLength(1);
    } finally {
      Element.prototype.getBoundingClientRect = rects;
      delete (Element.prototype as unknown as { animate?: unknown }).animate;
    }
  });
});
