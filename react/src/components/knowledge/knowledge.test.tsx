import { act, createEvent, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryCard } from "./MemoryCard";
import { MemoryDetail } from "./MemoryDetail";
import { MemoryLibrary } from "./MemoryLibrary";
import { MemoryToolbar } from "./MemoryToolbar";
import { MemoryFilterBar } from "./MemoryFilterBar";
import { MemoryGrid } from "./MemoryGrid";
import { MemoryLoadMore, MemoryLimitNote, MemoryScrollTail } from "./MemoryPagingTail";
import { KnowledgeMap } from "./KnowledgeMap";
import { KnowledgeExplorer } from "./KnowledgeExplorer";
import { buildKnowledgeScene, filterMemories, safeMemoryHref } from "../../../../common/knowledge/model";
import type { MemoryRecord } from "./types";

const records: MemoryRecord[] = [
  { id: "lock", title: "Share refresh lock", summary: "Avoid concurrent refresh.", kind: "lesson", topic: "Auth", scope: "packages/auth", relatedIds: ["retry", "missing"], usage: { retrievalCount: 3 } },
  { id: "retry", title: "Retry reads only", summary: "Mutations require keys.", kind: "decision", topic: "Transport", status: "needs-review", sources: [{ id: "source", label: "ADR", location: "docs/retry.md" }] },
  { id: "old", title: "Old refresh policy", summary: "Replaced.", kind: "convention", topic: "Auth", status: "superseded" },
];
beforeEach(() => { vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null); });

describe("knowledge model", () => {
  it("combines case-insensitive search terms with filters and source locations", () => {
    expect(filterMemories(records, "REFRESH packages", { kind: ["lesson"], status: ["active"] }).map(record => record.id)).toEqual(["lock"]);
    expect(filterMemories(records, "docs/retry.md").map(record => record.id)).toEqual(["retry"]);
    expect(filterMemories(records, "refresh", { topic: ["Transport"] })).toEqual([]);
    // Facets are OR-within and AND-across; an empty array means "not applied".
    expect(filterMemories(records, "", { kind: ["lesson", "decision"], status: [] }).map(record => record.id)).toEqual(["lock", "retry"]);
    expect(filterMemories(records, "", { kind: ["lesson"], status: ["needs-review"] })).toEqual([]);
  });
  it("preserves stable illustrative coordinates when records are reordered or appended", () => {
    const first = buildKnowledgeScene(records);
    const reordered = buildKnowledgeScene([...records].reverse());
    expect(first.projected).toBe(false);
    expect(first.points.find(point => point.memoryId === "lock")).toEqual(reordered.points.find(point => point.memoryId === "lock"));
    expect(buildKnowledgeScene([...records, { ...records[0], id: "new", topic: "New topic" }]).points[0]).toEqual(first.points[0]);
  });
  it("reports invalid supplied points, duplicate ids, and missing memories", () => {
    const scene = buildKnowledgeScene([...records, records[0]], [{ memoryId: "lock", x: NaN, y: 1 }, { memoryId: "retry", x: 1, y: 2 }, { memoryId: "retry", x: 2, y: 3 }, { memoryId: "missing", x: 0, y: 0 }]);
    expect(scene.points.map(point => point.memoryId)).toEqual(["retry"]);
    expect(scene.diagnostics.map(item => item.code)).toEqual(["duplicate-id", "invalid-coordinate", "duplicate-id", "missing-memory"]);
    expect(buildKnowledgeScene(records, []).points).toEqual([]);
  });
  it("rejects executable, protocol-relative, control-character, and backslash URLs", () => {
    for (const href of ["javascript:alert(1)", "data:text/html,hi", "//example.com", "/\\example.com", "https://example.com\n"]) expect(safeMemoryHref(href)).toBeUndefined();
    for (const href of ["https://example.com/source", "http://localhost:3000", "/source", "#source"]) expect(safeMemoryHref(href)).toBe(href);
  });
});

describe("memory components", () => {
  it("inks the kind word in the card's own tone", () => {
    const { container, rerender } = render(<MemoryCard memory={records[0]} />);
    const badge = container.querySelector<HTMLElement>("[data-kind]")!;
    // The family's floor is the kit's default blue — the badge wears it.
    expect(badge).toHaveAttribute("data-tone", "blue");
    expect(badge.className).toContain("text-blue-500");
    // An explicit "none" is the way back to the untinted accent floor.
    rerender(<MemoryCard memory={records[0]} tone="none" />);
    expect(badge).not.toHaveAttribute("data-tone");
    expect(badge.className).toBe("");
    rerender(<MemoryCard memory={records[0]} tone="amber" />);
    expect(badge).toHaveAttribute("data-tone", "amber");
    expect(badge.className).toContain("text-amber-500");
    expect(badge.className).toContain("dark:text-amber-400");
  });
  it("keeps actions independent from card selection", () => {
    const select = vi.fn(), pin = vi.fn();
    render(<MemoryCard memory={records[0]} onSelect={select} actions={[
      { id: "pin", label: m => m.pinned ? "Unpin" : "Pin", pressed: m => !!m.pinned, onClick: pin },
    ]} />);
    const pinButton = screen.getByRole("button", { name: "Pin" });
    fireEvent.click(pinButton);
    expect(pin).toHaveBeenCalledWith(records[0]); expect(select).not.toHaveBeenCalled();
    // Panel's actions slot stays out of the card's select hit target; the
    // resolved `pressed` reaches the Button as aria-pressed.
    expect(pinButton).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: /Share refresh lock/ }));
    expect(select).toHaveBeenCalledWith(records[0]);
  });
  it("resolves a consumer action array against the record — type, size and hidden", () => {
    const edit = vi.fn();
    const { container } = render(<MemoryCard memory={records[0]} actions={[
      { id: "edit", label: "Edit", variant: "solid", size: "sm", onClick: edit },
      { id: "archive", label: "Archive", hidden: m => m.id === "lock", onClick: vi.fn() },
    ]} />);
    const editButton = screen.getByRole("button", { name: "Edit" });
    // The chosen Button type and size ride through to the Panel slot.
    expect(editButton).toHaveAttribute("data-variant", "solid");
    expect(screen.queryByRole("button", { name: "Archive" })).not.toBeInTheDocument();
    fireEvent.click(editButton);
    expect(edit).toHaveBeenCalledWith(records[0]);
    // The buttons live in Panel's own actions section, not the body.
    expect(container.querySelector('[data-panel-actions]')).toBeTruthy();
  });
  it("omits unprovided actions and preserves plain-text content", () => {
    render(<MemoryDetail memory={{ ...records[0], content: "<script>bad()</script>", sources: [{ id: "bad", label: "Unsafe source", href: "javascript:bad()" }] }} />);
    expect(screen.getByText("<script>bad()</script>")).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.getByText(/access, not usefulness/)).toBeVisible();
  });
  it("renders the detail's inline action row from the array", () => {
    const edit = vi.fn();
    const { container } = render(<MemoryDetail memory={records[0]} actions={[{ id: "edit", label: "Edit", onClick: edit }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(edit).toHaveBeenCalledWith(records[0]);
    // The detail keeps the row inline in its body, as kit Buttons.
    expect(container.querySelector(".kit-knowledge-actions > [data-variant]")).toBeTruthy();
  });
  it("renders missing selection and related navigation", () => {
    const related = vi.fn();
    const { rerender } = render(<MemoryDetail />);
    expect(screen.getByText(/Select a memory/)).toBeVisible();
    rerender(<MemoryDetail memory={records[0]} relatedMemories={[records[1]]} onRelatedSelect={related} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry reads only" }));
    expect(related).toHaveBeenCalledWith("retry");
  });
  it("searches through the filter bar's search section", async () => {
    render(<MemoryLibrary memories={records} />);
    // The search field lives inside the bar, collapsed behind its trigger.
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    fireEvent.change(screen.getByPlaceholderText("Search memories"), { target: { value: "refresh" } });
    await waitFor(() => expect(screen.queryByRole("button", { name: /Retry reads only/ })).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: /Share refresh lock/ })).toBeVisible();
    // The field's own clear restores everything.
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    await waitFor(() => expect(screen.getByRole("button", { name: /Retry reads only/ })).toBeVisible());
  });
  it("filters through the Add filter menus — OR within a facet, AND across", async () => {
    render(<MemoryLibrary memories={records} />);
    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: /^Status/ }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /^Superseded/ }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("button", { name: /Share refresh lock/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Old refresh policy/ })).toBeVisible();
    // A second value in the same facet widens the set rather than narrowing it.
    fireEvent.click(screen.getByRole("button", { name: "Status: Superseded" }));
    fireEvent.click(await screen.findByRole("menuitemcheckbox", { name: /^Needs review/ }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getByRole("button", { name: /Retry reads only/ })).toBeVisible();
    // A second facet then intersects the first.
    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: /^Type/ }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /^Lesson/ }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("button", { name: /Retry reads only/ })).not.toBeInTheDocument();
    // Clear all empties the facets in one gesture.
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByRole("button", { name: /Retry reads only/ })).toBeVisible();
  });
  it("hides the search section when the library turns it off", () => {
    render(<MemoryLibrary memories={records} showSearch={false} />);
    expect(screen.queryByRole("button", { name: "Search" })).not.toBeInTheDocument();
    // The filter half of the bar stays usable.
    expect(screen.getByRole("button", { name: "Add filter" })).toBeEnabled();
  });
  it("hides the whole filter section — search and facets together", () => {
    const { container } = render(<MemoryLibrary memories={records} showFilterBar={false} />);
    expect(container.querySelector(".kit-memory-filter-bar")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add filter" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Search$/ })).not.toBeInTheDocument();
    // The view row leads the panel and the results line still reports.
    expect(container.querySelector(".kit-memory-view-row")).toBeTruthy();
    expect(within(container.querySelector<HTMLElement>(".kit-memory-view-row")!).getByRole("radio", { name: "List" })).toBeEnabled();
  });
  it("sits the results count beside the view toggle", () => {
    const { container } = render(<MemoryLibrary memories={records} />);
    const row = container.querySelector<HTMLElement>(".kit-memory-view-row")!;
    // One row: the aria-live count on the left, the icon toggle on the right.
    expect(within(row).getByText("3 / 3")).toHaveAttribute("aria-live", "polite");
    // The switch is the kit IconToggleGroup — radio semantics, icon options
    // named by their labels.
    expect(within(row).getAllByRole("radio").map(button => button.getAttribute("aria-label"))).toEqual(["Cards", "List"]);
  });
  it("does not mutate controlled selection or query", async () => {
    const select = vi.fn(), query = vi.fn();
    render(<MemoryLibrary memories={records} selectedId="lock" onSelectionChange={select} query="" onQueryChange={query} />);
    const retry = screen.getByRole("button", { name: /Retry reads only/ });
    fireEvent.click(retry); expect(select).toHaveBeenCalledWith("retry"); expect(retry).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    fireEvent.change(screen.getByPlaceholderText("Search memories"), { target: { value: "refresh" } });
    await waitFor(() => expect(query).toHaveBeenCalledWith("refresh"));
    // The host kept the query empty — nothing filtered.
    expect(screen.getByRole("button", { name: /Retry reads only/ })).toBeVisible();
  });
  it("leaves server-filtered records intact in remote mode", () => {
    render(<MemoryLibrary memories={records} remote query="no local matches" filters={{ topic: ["Unknown"] }} />);
    expect(screen.getByRole("button", { name: /Share refresh lock/ })).toBeVisible();
  });
  it("renders loading and empty states without stale cards", () => {
    const { container, rerender } = render(<MemoryLibrary memories={records} loading />);
    expect(screen.queryByRole("button", { name: /Share refresh lock/ })).not.toBeInTheDocument();
    expect(container.querySelectorAll(".kit-memory-skeleton-card")).toHaveLength(6);
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    rerender(<MemoryLibrary memories={records} loading loaderType="spinner" />);
    expect(container.querySelector(".kit-memory-skeleton")).toBeNull();
    expect(screen.queryByRole("button", { name: /Share refresh lock/ })).toBeNull();
    expect(screen.getAllByText("Loading memories…").length).toBeGreaterThan(0);
    rerender(<MemoryLibrary memories={records} loading loaderType="progress" loaderProgress={45} />);
    // The bar mirrors the body, so both the panel scrim and the bar wear the progress fill.
    for (const bar of screen.getAllByRole("progressbar")) expect(bar).toHaveAttribute("aria-valuenow", "45");
    rerender(<MemoryLibrary memories={[]} />);
    expect(screen.getByText("No memories yet.")).toBeVisible();
  });
  it("loads the filter bar with the body — same state, same loader type", () => {
    const { container, rerender } = render(<MemoryLibrary memories={records} loading />);
    const bar = container.querySelector<HTMLElement>(".kit-memory-filter-bar > [aria-busy]") ?? container.querySelector<HTMLElement>(".kit-memory-filter-bar [aria-busy]")!;
    expect(bar).toHaveAttribute("aria-busy", "true");
    // Skeleton: the bar's own pieces are rewritten in placeholder ink.
    expect(bar.querySelector(".animate-pulse")).not.toBeNull();
    // Spinner: the real controls return under the bar's own pinned Loader.
    rerender(<MemoryLibrary memories={records} loading loaderType="spinner" />);
    expect(bar.querySelector(".animate-pulse")).toBeNull();
    expect(bar.querySelector('[role="status"]')).not.toBeNull();
    expect(bar).toHaveAttribute("aria-busy", "true");
  });
  it("shows map-shaped skeleton, spinner and progress loading states", () => {
    const { container, rerender } = render(<KnowledgeMap memories={records} loading />);
    expect(container.querySelectorAll(".kit-knowledge-map-skeleton span")).toHaveLength(15);
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Knowledge map" })).toBeNull();
    rerender(<KnowledgeMap memories={records} loading loaderType="spinner" />);
    expect(container.querySelector(".kit-knowledge-map-skeleton")).toBeNull();
    expect(screen.getByText("Loading memories…")).toBeInTheDocument();
    rerender(<KnowledgeMap memories={records} loading loaderType="progress" loaderProgress={45} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "45");
    rerender(<KnowledgeMap memories={records} />);
    expect(container.querySelector(".kit-knowledge-map-skeleton")).toBeNull();
    expect(screen.getByRole("img", { name: "Knowledge map" })).toBeVisible();
  });
  it("forwards loader settings to either explorer view", () => {
    const { container, rerender } = render(<KnowledgeExplorer memories={records} loading loaderType="progress" loaderProgress={60} view="library" />);
    // Panel and filter bar mirror each other — both fills track the same progress.
    for (const bar of screen.getAllByRole("progressbar")) expect(bar).toHaveAttribute("aria-valuenow", "60");
    rerender(<KnowledgeExplorer memories={records} loading loaderType="skeleton" view="map" />);
    expect(container.querySelectorAll(".kit-knowledge-map-skeleton span")).toHaveLength(15);
  });
  it("appends pages through the button tail when the body is uncapped", () => {
    const loadMore = vi.fn();
    render(<MemoryLibrary memories={records} hasMore onLoadMore={loadMore} />);
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(loadMore).toHaveBeenCalledTimes(1);
  });
  it("honours an explicit button load mode inside a capped body", () => {
    const loadMore = vi.fn();
    render(<MemoryLibrary memories={records} maxHeight={220} hasMore loadMode="button" onLoadMore={loadMore} loadMoreLabel="Older memories" />);
    fireEvent.click(screen.getByRole("button", { name: "Older memories" }));
    expect(loadMore).toHaveBeenCalledTimes(1);
  });
  it("leaves the tail to the sentinel once scroll mode has a scroller to watch", () => {
    const loadMore = vi.fn();
    const { container } = render(<MemoryLibrary memories={records} maxHeight={220} hasMore onLoadMore={loadMore} />);
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
    expect(container.querySelector(".kit-memory-groups")).toBeTruthy();
  });
  it("keeps the tail hidden without hasMore or while the first page loads", () => {
    const { rerender } = render(<MemoryLibrary memories={records} hasMore={false} onLoadMore={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
    rerender(<MemoryLibrary memories={records} hasMore onLoadMore={vi.fn()} loading />);
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
  });
  it("caps the presentation at the limit and closes the tail with a note", () => {
    const loadMore = vi.fn();
    render(<MemoryLibrary memories={records} maxHeight={220} hasMore limit={2} onLoadMore={loadMore} />);
    expect(screen.getByRole("button", { name: /Share refresh lock/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry reads only/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Old refresh policy/ })).not.toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByText("Showing at most 2 memories")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
  });
  it("keeps paging while the limit still has room", () => {
    const loadMore = vi.fn();
    render(<MemoryLibrary memories={records} hasMore limit={5} onLoadMore={loadMore} />);
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    expect(screen.queryByText("Showing at most 5 memories")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(loadMore).toHaveBeenCalledTimes(1);
  });
  it("switches presentation through the kit view toggle", () => {
    render(<MemoryLibrary memories={records} />);
    fireEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(document.querySelector('.kit-memory-grid[data-view="list"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Cards" }));
    expect(document.querySelector('.kit-memory-grid[data-view="cards"]')).toBeTruthy();
  });
});

describe("knowledge map and composition", () => {
  it("carries no list chrome — selection lives on the canvas, filtering on the legend", () => {
    const topic = vi.fn();
    const many = Array.from({ length: 30 }, (_, i) => ({ ...records[0], id: `memory-${i}`, title: `Memory ${i}` }));
    const { container } = render(<KnowledgeMap memories={many} onTopicSelect={topic} />);
    expect(container.querySelector("details")).toBeNull();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    // The legend's checkboxes are the only filter: everything starts on, and
    // unchecking the one cluster emits the empty enabled set.
    const auth = screen.getByRole("checkbox", { name: "Auth" });
    expect(auth).toBeChecked();
    fireEvent.click(auth);
    expect(topic).toHaveBeenCalledWith([]);
  });
  it("mirrors the enabled set in the checkboxes, partial and empty", () => {
    const { rerender } = render(<KnowledgeMap memories={records} selectedTopic={["Transport"]} onTopicSelect={() => { /* legend writes here */ }} />);
    expect(screen.getByRole("checkbox", { name: "Transport" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Auth" })).not.toBeChecked();
    // [] is every box empty — an all-off legend, not an unconstrained map.
    rerender(<KnowledgeMap memories={records} selectedTopic={[]} onTopicSelect={() => { /* legend writes here */ }} />);
    expect(screen.getByRole("checkbox", { name: "Transport" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Select all" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Select all" })).not.toHaveAttribute("aria-checked", "mixed");
  });
  it("gates the legend on the callback and filters through its checkboxes", () => {
    const topic = vi.fn();
    const { container, rerender } = render(<KnowledgeMap memories={records} />);
    // No callback, no legend — a plain map stays a plain map.
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    // showLegend={false} opts out explicitly, callback or not.
    rerender(<KnowledgeMap memories={records} onTopicSelect={topic} showLegend={false} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    rerender(<KnowledgeMap memories={records} selectedTopic={["Auth"]} onTopicSelect={topic} />);
    // The NetworkGraph communities legend verbatim: uppercase fieldset
    // heading, tri-state Select all, one checkbox row per cluster with the
    // count riding right in tabular figures.
    const fieldset = container.querySelector("fieldset")!;
    expect(fieldset.querySelector("legend")!.textContent).toBe("Topic");
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute("aria-checked", "mixed");
    expect(screen.getByRole("checkbox", { name: "Transport" })).not.toBeChecked();
    expect([...fieldset.querySelectorAll("span.tabular-nums")].map(row => row.textContent)).toEqual(["2", "1"]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Transport" }));
    expect(topic).toHaveBeenCalledWith(["Auth", "Transport"]);
    // From mixed, Select all lights the whole set.
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all" }));
    expect(topic).toHaveBeenLastCalledWith(["Auth", "Transport"]);
  });
  it("reports broken relationships and distinguishes topic layout from projections", () => {
    const diagnostics = vi.fn();
    const { rerender } = render(<KnowledgeMap memories={records} relationships={[{ id: "broken", source: "lock", target: "missing", label: "replaces" }]} onDiagnostics={diagnostics} />);
    expect(diagnostics).toHaveBeenCalledWith([{ code: "missing-endpoint", id: "broken" }]);
    expect(screen.getByText(/Illustrative topic layout/)).toBeVisible();
    rerender(<KnowledgeMap memories={records} points={[{ memoryId: "lock", x: 1, y: 2 }]} />);
    expect(screen.getByText(/Projected distances/)).toBeVisible();
  });
  it("keeps the title row bare and draws the divider only on request", () => {
    const { container, rerender } = render(<KnowledgeMap memories={records} />);
    const toolbar = container.querySelector<HTMLElement>(".kit-knowledge-toolbar")!;
    expect(toolbar.classList.contains("kit-knowledge-toolbar--bare")).toBe(true);
    rerender(<KnowledgeMap memories={records} showTitleDivider />);
    expect(container.querySelector<HTMLElement>(".kit-knowledge-toolbar")!.classList.contains("kit-knowledge-toolbar--bare")).toBe(false);
  });
  it("wears the NetworkGraph camera pill — fit, zoom steps, percent readout, reset — and showControls strips it", () => {
    const select = vi.fn();
    const { rerender } = render(<KnowledgeMap memories={records} selectedId="lock" onSelectionChange={select} />);
    expect(screen.getByRole("button", { name: "Fit" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Reset view" })).toBeEnabled();
    expect(screen.getByText("100%")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("130%")).toBeVisible();
    // Reset answers the pointer like the graph's: selection cleared, camera refit.
    fireEvent.click(screen.getByRole("button", { name: "Reset view" }));
    expect(select).toHaveBeenCalledWith(null);
    expect(screen.getByText("100%")).toBeVisible();
    rerender(<KnowledgeMap memories={records} selectedId="lock" onSelectionChange={select} showControls={false} />);
    expect(screen.queryByRole("button", { name: "Zoom in" })).not.toBeInTheDocument();
    expect(screen.queryByText("100%")).not.toBeInTheDocument();
  });
  it("previews the point under the pointer without selecting, and hoverHighlight={false} keeps the canvas static", () => {
    // A single record pins the topic-layout point dead-center of the canvas:
    // bounds collapse onto it, so screen (width/2, height/2) is its position.
    const [only] = records;
    const select = vi.fn();
    const { rerender } = render(<KnowledgeMap memories={[only]} onSelectionChange={select} />);
    const host = document.querySelector<HTMLElement>(".kit-knowledge-canvas")!;
    const canvas = host.querySelector<HTMLCanvasElement>("canvas")!;
    fireEvent.pointerMove(canvas, { clientX: 0.5, clientY: 180 });
    expect(host).toHaveAttribute("data-hovered", "lock");
    expect(select).not.toHaveBeenCalled();
    fireEvent.pointerMove(canvas, { clientX: 0.5, clientY: 900 });
    expect(host).not.toHaveAttribute("data-hovered");
    rerender(<KnowledgeMap memories={[only]} onSelectionChange={select} hoverHighlight={false} />);
    fireEvent.pointerMove(canvas, { clientX: 0.5, clientY: 180 });
    expect(host).not.toHaveAttribute("data-hovered");
  });
  it("has no trace region of its own — traces live in the standalone kit component", () => {
    const { container } = render(<KnowledgeExplorer memories={records} defaultSelectedId="retry" />);
    expect(container.querySelector('[aria-label="Trace"]')).toBeNull();
    expect(container.querySelector(".kit-knowledge-region-trace")).toBeNull();
    expect(container.querySelector(".kit-knowledge-linked-traces")).toBeNull();
  });
  it("handles a disappeared selected memory and custom regions", () => {
    const { rerender } = render(<KnowledgeExplorer memories={records} defaultSelectedId="lock" regions={{ library: false, map: false }} renderRegion={{ detail: context => <button type="button" onClick={() => context.selectMemory("retry")}>{context.selectedMemory?.title ?? "No selection"}</button> }} />);
    const detail = screen.getByRole("region", { name: "Memory details" });
    // The detail override owns only the body — the shell keeps its panel,
    // pinned title and scroll area, and its padded body wraps the custom node.
    expect(detail.querySelector(".kit-memory-detail")).toBeTruthy();
    expect(detail.querySelector(".kit-memory-detail-eyebrow")!.textContent).toBe("Inspector");
    expect(detail.querySelector(".kit-memory-detail-scroll .kit-memory-detail-body button")).toBeTruthy();
    // The default body is gone with its summary — only the override renders.
    expect(detail).not.toHaveTextContent("Avoid concurrent refresh.");
    fireEvent.click(screen.getByRole("button", { name: "Share refresh lock" }));
    expect(screen.getByRole("button", { name: "Retry reads only" })).toBeVisible();
    rerender(<KnowledgeExplorer memories={[]} regions={{ library: false, map: false }} />);
    // The selected record vanished with the list — the inspector follows it closed.
    expect(screen.getByRole("region", { name: "Memory details" })).toHaveAttribute("inert");
  });
  it("switches the main column between the map and the library with the inspector common", () => {
    const view = vi.fn();
    const { container } = render(<KnowledgeExplorer memories={records} onViewChange={view} />);
    expect(container.querySelector(".kit-memory-library")).toBeTruthy();
    expect(container.querySelector(".kit-knowledge-map")).not.toBeTruthy();
    // One kit MultiToggle picks the view; the inspector never competes for it.
    fireEvent.click(screen.getByRole("radio", { name: "Knowledge map" }));
    expect(view).toHaveBeenCalledWith("map");
    expect(container.querySelector(".kit-knowledge-map")).toBeTruthy();
    expect(container.querySelector(".kit-memory-library")).not.toBeTruthy();
    // Nothing selected — the common inspector column is mounted but shut.
    expect(container.querySelector(".kit-knowledge-explorer-grid--inspector-open")).toBeNull();
    expect(screen.getByRole("region", { name: "Memory details" })).toHaveAttribute("inert");
    fireEvent.click(screen.getByRole("radio", { name: "Memory library" }));
    expect(container.querySelector(".kit-memory-library")).toBeTruthy();
    // Selecting opens it, and it stays common to both views.
    fireEvent.click(screen.getByRole("button", { name: /Retry reads only/ }));
    expect(container.querySelector(".kit-knowledge-explorer-grid--inspector-open")).toBeTruthy();
    const inspector = screen.getByRole("region", { name: "Memory details" });
    expect(inspector).not.toHaveAttribute("inert");
    expect(within(inspector).getByText("Retry reads only")).toBeVisible();
  });
  it("hides the view switch when only one view is enabled", () => {
    render(<KnowledgeExplorer memories={records} regions={{ map: false }} />);
    expect(screen.queryByRole("radio", { name: "Knowledge map" })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: "Memory library" })).not.toBeInTheDocument();
    expect(screen.queryByRole("radiogroup", { name: "View" })).not.toBeInTheDocument();
  });
  it("opens the inspector only for a selection and moves it down when it stops fitting", () => {
    const callbacks: ((width: number) => void)[] = [];
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: (entries: { contentRect: { width: number; height: number } }[]) => void) {
        // One stub shape feeds both observers: the grid reads `width` for the
        // dock/stack switch, the view section reads `height` for the parity.
        callbacks.push(width => callback([{ contentRect: { width, height: Math.round(width / 2) } }]));
      }
      observe() {}
      disconnect() {}
    });
    const { container } = render(<KnowledgeExplorer memories={records} defaultSelectedId="retry" />);
    const root = container.querySelector<HTMLElement>(".kit-knowledge-explorer-grid")!;
    const inspector = container.querySelector(".kit-knowledge-inspector")!;
    // Wide enough for the inspector column plus the view's floor: docked.
    act(() => callbacks.forEach(callback => callback(1200)));
    expect(root).toHaveClass("kit-knowledge-explorer-grid--inspector-open");
    expect(root).not.toHaveClass("kit-knowledge-explorer-grid--stacked");
    expect(inspector).not.toHaveAttribute("inert");
    // Docked parity: the measured view height drives the inspector's column
    // height, the way NetworkGraph pins its inspector to the graph height.
    expect(root.style.getPropertyValue("--kit-knowledge-inspector-height")).toBe("600px");
    // Below the fit threshold the same rule moves the inspector under the view.
    act(() => callbacks.forEach(callback => callback(600)));
    expect(root).toHaveClass("kit-knowledge-explorer-grid--stacked");
    // No selection means no inspector, same as NetworkGraph's.
    const { container: idle } = render(<KnowledgeExplorer memories={records} />);
    expect(idle.querySelector(".kit-knowledge-explorer-grid--inspector-open")).toBeNull();
    expect(idle.querySelector(".kit-knowledge-inspector")).toHaveAttribute("inert");
    vi.unstubAllGlobals();
  });
  it("hides the inspector while the workspace loads", () => {
    const { container, rerender } = render(<KnowledgeExplorer memories={records} defaultSelectedId="retry" />);
    const root = () => container.querySelector<HTMLElement>(".kit-knowledge-explorer-grid")!;
    expect(root()).toHaveClass("kit-knowledge-explorer-grid--inspector-open");
    expect(container.querySelector(".kit-knowledge-inspector")).not.toHaveAttribute("inert");
    // Loading hides the inspector outright: the column unmounts, so even
    // with a selection held and the record in hand, the busy view is the
    // only story — no collapsed remnant, no detail text in the DOM.
    rerender(<KnowledgeExplorer memories={records} defaultSelectedId="retry" loading />);
    expect(root()).not.toHaveClass("kit-knowledge-explorer-grid--inspector-open");
    expect(container.querySelector(".kit-knowledge-inspector")).toBeNull();
    expect(container.textContent).not.toContain("Retry reads only");
    expect(container.textContent).not.toContain("Inspector");
    // The emptied-records flavour is hidden just the same.
    rerender(<KnowledgeExplorer memories={[]} defaultSelectedId="retry" loading loaderType="spinner" />);
    expect(root()).not.toHaveClass("kit-knowledge-explorer-grid--inspector-open");
    expect(container.querySelector(".kit-knowledge-inspector")).toBeNull();
    // Once loading lifts, the selection reopens the inspector as before.
    rerender(<KnowledgeExplorer memories={records} defaultSelectedId="retry" />);
    expect(root()).toHaveClass("kit-knowledge-explorer-grid--inspector-open");
    expect(container.querySelector(".kit-knowledge-inspector")).not.toHaveAttribute("inert");
    expect(container.querySelector(".kit-knowledge-inspector")).toHaveTextContent("Retry reads only");
  });
  it("re-mirrors the inspector panel chrome live while it stays auto", () => {
    const { container, rerender } = render(<KnowledgeExplorer memories={records} defaultSelectedId="retry" variant="glass" corner="rounded-lg" tone="cyan" />);
    const detail = container.querySelector(".kit-memory-detail")!;
    // Glass rim and radius flow into the inspector while it follows the view.
    // Corner tokens map up the Tailwind scale (Theme.surfaceCornerClasses).
    expect(detail.className).toContain("backdrop-blur-xl");
    expect(detail.className).toContain("rounded-3xl"); // the "rounded-lg" token
    expect(detail).toHaveAttribute("data-tone", "cyan");
    rerender(<KnowledgeExplorer memories={records} defaultSelectedId="retry" variant="elevated" corner="rounded-xl" />);
    expect(detail.className).toContain("shadow-xl");
    expect(detail.className).toContain("rounded-4xl"); // the "rounded-xl" token
    // Pinning the inspector decouples it from the view panel again.
    rerender(<KnowledgeExplorer memories={records} defaultSelectedId="retry" variant="glass" corner="rounded-lg" tone="cyan" inspectorVariant="tonal" inspectorTone="red" inspectorCorner="rounded-xl" />);
    expect(detail.className).toContain("shadow-sm");
    expect(detail.className).not.toContain("backdrop-blur");
    expect(detail.className).toContain("rounded-4xl");
    expect(detail).toHaveAttribute("data-tone", "red");
  });
  it("uses Panel padding independently of the main view and permits overrides", () => {
    const { container, rerender } = render(<KnowledgeExplorer memories={records} defaultSelectedId="retry" padding="none" />);
    const detail = container.querySelector(".kit-memory-detail")!;
    expect(detail).toHaveClass("p-0");
    expect(detail.querySelector(".kit-memory-detail-eyebrow")).toHaveClass("p-4", "sm:p-5");
    expect(detail.querySelector(".kit-memory-detail-body")).toHaveClass("p-4", "sm:p-5", "kit-memory-detail-body--titled");
    rerender(<KnowledgeExplorer memories={records} defaultSelectedId="retry" padding="none" inspectorPadding="lg" />);
    expect(detail).toHaveClass("p-0");
    expect(detail.querySelector(".kit-memory-detail-eyebrow")).toHaveClass("p-8", "sm:p-10");
    expect(detail.querySelector(".kit-memory-detail-body")).toHaveClass("p-8", "sm:p-10");
    rerender(<KnowledgeExplorer memories={records} defaultSelectedId="retry" padding="lg" inspectorPadding="none" />);
    expect(detail.querySelector(".kit-memory-detail-eyebrow")).toHaveClass("p-0");
    expect(detail.querySelector(".kit-memory-detail-body")).toHaveClass("p-0");
  });
  it("lets a user template replace the default body inside the scroll area", () => {
    const { container } = render(<MemoryDetail memory={records[1]!} renderBody={(memory) => <p>custom body for {memory.id}</p>} />);
    const scroll = container.querySelector(".kit-memory-detail-scroll");
    expect(scroll).toBeTruthy();
    expect(scroll!.textContent).toContain("custom body for retry");
    // The default template is gone; the title stays the shell's pinned job.
    expect(screen.queryByText("Mutations require keys.")).toBeNull();
    expect(screen.queryByText("Sources")).toBeNull();
  });

  it("paints source links with the detail card's tone ink", () => {
    const linked: MemoryRecord = { ...records[1]!, sources: [{ id: "source", label: "ADR", href: "https://example.com/adr", location: "docs/retry.md" }] };
    const { rerender } = render(<MemoryDetail tone="blue" memory={linked} />);
    const link = screen.getByRole("link", { name: "ADR" });
    // Tinted: the card's own true colour, not the static teal accent.
    expect(link).toHaveAttribute("data-tone", "blue");
    expect(link.className).toContain("text-blue-500");
    // The data-tone escape hatch opts the link out of the accent rule.
    // Explicit "none": no ink of its own — the stylesheet's accent floor applies.
    rerender(<MemoryDetail memory={linked} tone="none" />);
    expect(screen.getByRole("link", { name: "ADR" })).not.toHaveAttribute("data-tone");
  });

  it("titles the inspector with an eyebrow, NetworkGraph-style", () => {
    const { rerender } = render(<KnowledgeExplorer memories={records} defaultSelectedId="retry" />);
    const detail = screen.getByRole("region", { name: "Memory details" });
    const eyebrow = detail.querySelector(".kit-memory-detail-eyebrow");
    // Default copy, same word NetworkGraph's inspector wears.
    expect(eyebrow).toBeTruthy();
    expect(eyebrow!.textContent).toBe("Inspector");
    // Pinned title: the whole body scrolls inside the kit ScrollArea and the
    // eyebrow stays outside the viewport, in the panel's header slot.
    const scroll = detail.querySelector(".kit-memory-detail-scroll");
    expect(scroll).toBeTruthy();
    expect(scroll!.querySelector(".kit-memory-detail-body")).toBeTruthy();
    expect(scroll!.querySelector(".kit-memory-detail-eyebrow")).toBeNull();
    // All detail sections scroll together below the title.
    expect(detail.querySelectorAll('[data-slot="scrollarea"]')).toHaveLength(1);
    rerender(<KnowledgeExplorer memories={records} defaultSelectedId="retry" inspectorTitle="Session log" />);
    expect(detail.querySelector(".kit-memory-detail-eyebrow")!.textContent).toBe("Session log");
  });
  it("blocks disabled card actions and selection", () => {
    const select = vi.fn(), pin = vi.fn();
    render(<MemoryCard memory={records[0]} disabled onSelect={select} actions={[
      { id: "pin", label: "Pin", onClick: pin },
    ]} />);
    fireEvent.click(screen.getByRole("button", { name: /Share refresh lock/ }));
    const pinButton = screen.getByRole("button", { name: "Pin" });
    expect(pinButton).toBeDisabled();
    fireEvent.click(pinButton);
    expect(select).not.toHaveBeenCalled(); expect(pin).not.toHaveBeenCalled();
  });
  it("captures modified-wheel zoom without blocking ordinary page scrolling", () => {
    const { container } = render(<KnowledgeMap memories={records} />);
    const canvas = container.querySelector("canvas")!;
    const ordinary = createEvent.wheel(canvas, { deltaY: 100, cancelable: true });
    fireEvent(canvas, ordinary); expect(ordinary.defaultPrevented).toBe(false);
    const zoom = createEvent.wheel(canvas, { deltaY: -100, ctrlKey: true, cancelable: true });
    fireEvent(canvas, zoom); expect(zoom.defaultPrevented).toBe(true);
  });
  it("disconnects the map resize observer when unmounted", () => {
    const disconnect = vi.fn();
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect = disconnect; });
    const { unmount } = render(<KnowledgeMap memories={records} />); unmount();
    expect(disconnect).toHaveBeenCalled(); vi.unstubAllGlobals();
  });
});

describe("knowledge map grid background", () => {
  const lattice = (container: HTMLElement) => container.querySelector<HTMLElement>(".kit-knowledge-map-grid > div");
  it("paints a blue dot lattice behind the canvas by default", () => {
    const { container } = render(<KnowledgeMap memories={records} />);
    const grid = lattice(container);
    expect(grid).not.toBeNull();
    // NetworkGraph's defaults: dots on a 32px lattice, edge-faded, tone ink
    // through the CSS variable the canvas box carries.
    expect(grid?.style.backgroundImage).toContain("radial-gradient(circle at 0 0");
    expect(grid?.style.backgroundImage).toContain("--color-blue-500");
    expect(grid?.style.backgroundImage).toContain("1.5px");
    expect(grid?.style.backgroundSize).toBe("32px 32px");
    expect(grid?.style.opacity).toBe("0.35");
    expect(grid?.style.maskImage).toContain("radial-gradient");
  });
  it("hides with grid=false and follows gridTone", () => {
    const { container, rerender } = render(<KnowledgeMap memories={records} grid={false} />);
    expect(container.querySelector(".kit-knowledge-map-grid")).toBeNull();
    rerender(<KnowledgeMap memories={records} gridTone="emerald" />);
    // The tone lands on the canvas box as the CSS variable the dots consume.
    const box = container.querySelector<HTMLElement>(".kit-knowledge-map-grid")!.closest<HTMLElement>("[style*='--kit-knowledge-map-grid-color']");
    expect(box?.style.getPropertyValue("--kit-knowledge-map-grid-color")).toBe("var(--color-emerald-500)");
  });
  it("accepts GridBackground overrides", () => {
    const { container } = render(<KnowledgeMap memories={records} grid={{ pattern: "grid", size: 48, opacity: 0.1 }} />);
    const grid = lattice(container)!;
    expect(grid.style.backgroundImage).toContain("linear-gradient");
    expect(grid.style.backgroundSize).toBe("48px 48px");
    expect(grid.style.opacity).toBe("0.1");
  });
});

describe("knowledge parts", () => {
  it("renders the toolbar standalone with its own click events", () => {
    const view = vi.fn();
    render(<MemoryToolbar view="cards" onViewChange={view} />);
    // Icon-only segments keep their accessible names.
    expect(screen.getByRole("radio", { name: "Cards" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(view).toHaveBeenCalledWith("list");
  });
  it("renders the filters standalone through the kit filter bar", async () => {
    const filters = vi.fn(), query = vi.fn();
    render(<MemoryFilterBar filters={{ topic: ["Auth"] }} onFiltersChange={filters} memories={records} query="" onQueryChange={query} />);
    // Topics are derived from the records; the menu opens with the applied
    // ones pre-checked, so picking a second one widens the facet.
    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: /^Topic/ }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /^Transport/ }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(filters).toHaveBeenCalledWith({ kind: undefined, status: undefined, topic: ["Auth", "Transport"] });
    // The search section belongs to the bar; its field edits the host query.
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    fireEvent.change(screen.getByPlaceholderText("Search memories"), { target: { value: "refresh" } });
    await waitFor(() => expect(query).toHaveBeenCalledWith("refresh"));
    // And it can be switched off entirely.
    const { unmount } = render(<MemoryFilterBar filters={{}} onFiltersChange={filters} memories={records} showSearch={false} />);
    expect(screen.queryByRole("button", { name: "Search" })).not.toBeInTheDocument();
    unmount();
  });
  it("renders the grid standalone under topic groups with selection and action events", () => {
    const select = vi.fn(), pin = vi.fn();
    const { container } = render(<MemoryGrid records={records} view="cards" selectedId="lock" onSelect={select} actions={[
      { id: "pin", label: "Pin", onClick: pin },
    ]} />);
    expect(container.querySelectorAll(".kit-memory-card")).toHaveLength(3);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2); // Auth, Transport
    const cards = [...container.querySelectorAll<HTMLElement>(".kit-memory-card")];
    const retryCard = cards.find(card => card.textContent?.includes("Retry reads only"))!;
    const lockCard = cards.find(card => card.textContent?.includes("Share refresh lock"))!;
    fireEvent.click(within(retryCard).getByRole("button", { name: /Retry reads only/ }));
    expect(select).toHaveBeenCalledWith(records[1]);
    fireEvent.click(within(lockCard).getByRole("button", { name: "Pin" }));
    expect(pin).toHaveBeenCalledWith(records[0]);
    // Selection rides Panel's `active` prop — the rim it publishes for CSS.
    expect(container.querySelector('.kit-memory-card[data-active="true"]')).toBeTruthy();
  });
  it("wires the paging tail parts", () => {
    const load = vi.fn();
    render(<><MemoryLoadMore onLoadMore={load} /><MemoryLimitNote limit={7} /><MemoryScrollTail sentinelRef={{ current: null }} error={new Error("offline")} onRetry={load} /></>);
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(load).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Showing at most 7 memories")).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: "Loading more" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(load).toHaveBeenCalledTimes(2);
  });
});
