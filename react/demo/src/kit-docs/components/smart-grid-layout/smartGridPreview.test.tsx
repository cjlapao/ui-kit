import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, render, within } from "@testing-library/react";
import SmartGridLayoutPlayground from "./SmartGridLayoutPlayground";
import { editReports } from "./smartGridFixture";

/**
 * The preview is the half of the claim that has to survive the browser, so it is
 * read from the DOM the component produced: the tiles it mounted, the roles it
 * gave them, the live region it speaks through, and the toolbar it decides to
 * withhold.
 */

/**
 * The preview column, and only it: the controls on its left are buttons and
 * inputs too, and reading across both columns would test the chrome.
 */
const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector(".min-h-44");
  if (!node) throw new Error("the preview column is not mounted");
  return node as HTMLElement;
};

/** Tiles are `<article>` while editing, plain divs while not (:4462-4479). */
const tiles = (view: ReturnType<typeof render>): HTMLElement[] =>
  Array.from(stage(view).querySelectorAll("article"));

const numberInput = (view: ReturnType<typeof render>): HTMLInputElement => {
  const found = view.container.querySelector(
    'input[type="number"]',
  ) as HTMLInputElement | null;
  if (!found) throw new Error("no number control in the controls");
  return found;
};

/**
 * The hint above the board tells the reader to click <em>Edit layout</em>, so the
 * toolbar is found inside the preview column rather than across the page.
 */
const edit = (view: ReturnType<typeof render>): void => {
  fireEvent.click(within(stage(view)).getByText("Edit layout", { exact: true }));
};

describe("SmartGridLayoutPlayground preview", () => {
  beforeEach(() => {
    editReports.length = 0;
  });

  it("mounts the tiles the Code view's layout names, and no others", () => {
    const view = render(<SmartGridLayoutPlayground />);
    // Six catalogue entries, one left unplaced so "Add Item" has something to
    // offer: five tiles on the board, in the rows the snippet prints.
    expect(tiles(view)).toHaveLength(5);
    expect(view.container.textContent).toContain("Active capsules");
    expect(view.container.textContent).toContain("1.2M/h");
    expect(view.container.textContent).not.toContain("Queue depth");
  });

  it("mounts the StatCard the printed render builds (:40-51)", () => {
    const view = render(<SmartGridLayoutPlayground />);
    // The tile is the same element `tile()` returns, so the printed call and the
    // mounted widget cannot drift apart unnoticed.
    expect(view.getByText("99.98%", { exact: true })).toBeTruthy();
    expect(view.getByText("$8.4k", { exact: true })).toBeTruthy();
  });

  it("shows both sections when the reader asks for two", () => {
    const view = render(<SmartGridLayoutPlayground />);
    expect(view.queryByText("Detail", { exact: true })).toBeNull();
    fireEvent.click(view.getByText("Two sections", { exact: true }));
    expect(view.getByText("Overview", { exact: true })).toBeTruthy();
    expect(view.getByText("Detail", { exact: true })).toBeTruthy();
    expect(tiles(view)).toHaveLength(5);
  });

  it("hands the board to the reader when the grid owns edit mode", () => {
    const view = render(<SmartGridLayoutPlayground />);
    expect(tiles(view)[0].getAttribute("role")).toBeNull();
    edit(view);
    const first = tiles(view)[0];
    expect(first.getAttribute("role")).toBe("button");
    expect(first.getAttribute("tabIndex")).toBe("0");
    expect(first.getAttribute("aria-label")).toContain("Enter");
    // One polite region narrates the whole session (:3295-3302).
    const spoken = stage(view).querySelector('[role="status"][aria-live="polite"]');
    expect(spoken).not.toBeNull();
  });

  it("takes the toolbar away from a controlled host that cannot hear it (:3188-3192)", () => {
    const view = render(<SmartGridLayoutPlayground />);
    fireEvent.click(view.getByText("host says editing", { exact: true }));
    // The tiles are editable, because the host said so…
    expect(tiles(view)[0].getAttribute("role")).toBe("button");
    // …and there is no Done button, because nobody would receive the result.
    expect(within(stage(view)).queryByText("Done", { exact: true })).toBeNull();
    expect(stage(view).textContent).toContain("3188-3192");
  });

  it("reports edit mode whether or not the host controls it (:1289-1295)", () => {
    const view = render(<SmartGridLayoutPlayground />);
    fireEvent.click(view.getByText(/Report edit mode/));
    edit(view);
    expect(editReports).toContain(true);
  });

  it("forbids editing entirely in read-only mode (:1285-1287)", () => {
    const view = render(<SmartGridLayoutPlayground />);
    fireEvent.click(view.getByText(/^Read-only/));
    expect(within(stage(view)).queryByText("Edit layout", { exact: true })).toBeNull();
    expect(tiles(view)[0].getAttribute("role")).toBeNull();
    expect(tiles(view)[0].hasAttribute("tabIndex")).toBe(false);
    expect(stage(view).textContent).toContain("forbids editing");
  });

  it("puts the arrows in the hands of the tiles it lets be lifted", () => {
    const view = render(<SmartGridLayoutPlayground />);
    edit(view);
    const first = tiles(view)[0];
    // A tile that is not grabbed ignores the arrows (:2906); grabbing is the
    // Enter/Space pair, and the announcement that follows is the proof.
    fireEvent.keyDown(first, { key: "ArrowLeft" });
    fireEvent.keyDown(first, { key: "Enter" });
    const spoken = stage(view).querySelector(
      '[role="status"][aria-live="polite"]',
    ) as HTMLElement;
    expect(spoken.textContent).toContain("lifted");
    fireEvent.keyDown(first, { key: "ArrowRight" });
    fireEvent.keyDown(first, { key: "Enter" });
    expect(spoken.textContent).toContain("placed");
  });

  it("removes undo, redo and their buttons at zero (:1560-1569)", () => {
    const view = render(<SmartGridLayoutPlayground />);
    fireEvent.change(numberInput(view), { target: { value: "0" } });
    edit(view);
    expect(within(stage(view)).queryByText("Undo", { exact: true })).toBeNull();
    expect(within(stage(view)).queryByText("Redo", { exact: true })).toBeNull();
  });

  it("keeps undo where the grid can still reach it", () => {
    const view = render(<SmartGridLayoutPlayground />);
    edit(view);
    expect(within(stage(view)).queryByText("Undo", { exact: true })).not.toBeNull();
  });

  it("names the storage it would read, and says when it will not write (:1434-1442)", () => {
    const view = render(<SmartGridLayoutPlayground />);
    const key = view.container.querySelector('input[placeholder="playground-dashboard"]') as
      | HTMLInputElement
      | undefined;
    expect(key, "the storageKey control").not.toBeUndefined();
    fireEvent.change(key!, { target: { value: "board" } });
    expect(stage(view).textContent).toContain("ui-kit:grid:board");
    fireEvent.click(view.getByText(/Write on change/));
    expect(stage(view).textContent).toContain("no way to write");
  });
});
