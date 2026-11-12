import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
});
