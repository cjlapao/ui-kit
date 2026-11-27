import { describe, it, expect } from "vitest";
import { fireEvent, render, within } from "@testing-library/react";
import SplitViewPlayground from "./SplitViewPlayground";

/**
 * The preview is the half of the page's claim that has to survive a browser, so it
 * is read from the DOM the component produced: the rows it mounted, the roles it
 * gave them, the strings it took from the catalog, and the affordances it hides
 * from a keyboard.
 */

const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector(".min-h-44");
  if (!node) throw new Error("the preview column is not mounted");
  return node as HTMLElement;
};

/**
 * One control, found by the label the config writes. The chrome renders its
 * captions as plain `<span>`s — a `Select` and a number box carry no accessible
 * name of their own — so the label is the way in.
 */
/**
 * The controls column prints a field label in a `<span>`, and an accordion
 * group title is a `<span>` too — so a field named "Source" and a group named
 * "Source" are otherwise interchangeable. The group title lives inside the
 * disclosure button (`Accordion.tsx:343`, `:383`); a field label never does.
 */
const CONTROL_ROW =
  'select, input, textarea, [role="switch"], [role="radiogroup"], [role="group"]';

const labelBoxes = (view: ReturnType<typeof render>, label: string): HTMLElement[] =>
  Array.from(view.container.querySelectorAll("span"))
    .filter(
      (node) =>
        (node.textContent ?? "").trim() === label &&
        !node.closest("button") &&
        !node.closest("[aria-expanded]"),
    )
    .map((span) => span.parentElement)
    .filter((box): box is HTMLElement => box !== null);

/** The box holding a field's control, preferring one that actually has a control. */
const controlBox = (
  view: ReturnType<typeof render>,
  label: string,
): HTMLElement | undefined => {
  const boxes = labelBoxes(view, label);
  return boxes.find((box) => box.querySelector(CONTROL_ROW)) ?? boxes[0];
};

const fieldBox = (view: ReturnType<typeof render>, label: string): HTMLElement => {
  const box = controlBox(view, label);
  if (!box) throw new Error(`no control labelled "${label}" in the controls`);
  return box;
};

/** A choice, however the chrome chose to render it: a `MultiToggle` or a `Select`. */
const choose = (
  view: ReturnType<typeof render>,
  label: string,
  value: string,
): void => {
  const box = fieldBox(view, label);
  const select = box.querySelector("select");
  if (select) {
    fireEvent.change(select, { target: { value } });
    return;
  }
  const button = Array.from(box.querySelectorAll("button")).find(
    (node) => (node.textContent ?? "").trim() === value,
  );
  if (!button) throw new Error(`"${value}" is not an option of "${label}"`);
  fireEvent.click(button);
};

const flip = (view: ReturnType<typeof render>, label: string): void => {
  fireEvent.click(within(view.container).getByRole("switch", { name: label }));
};

const type = (
  view: ReturnType<typeof render>,
  label: string,
  value: string,
): void => {
  const input = fieldBox(view, label).querySelector("input");
  if (!input) throw new Error(`no text box for "${label}"`);
  fireEvent.change(input, { target: { value } });
};

const expandAll = (view: ReturnType<typeof render>): void => {
  fireEvent.click(
    within(view.container).getByRole("button", { name: "Expand all" }),
  );
};

/** A row: the `role="button"` div that carries this label (:1188-1204). */
const row = (view: ReturnType<typeof render>, name: string): HTMLElement => {
  const found = Array.from(stage(view).querySelectorAll('[role="button"]')).find(
    (node) => (node.textContent ?? "").includes(name),
  );
  if (!found) throw new Error(`no row named "${name}"`);
  return found as HTMLElement;
};

const rows = (view: ReturnType<typeof render>): HTMLElement[] =>
  Array.from(stage(view).querySelectorAll('[role="button"]'));

/** The kit's search field, inside the preview column only (SearchBar.tsx:343). */
const searchField = (view: ReturnType<typeof render>): HTMLInputElement => {
  const input = stage(view).querySelector('input[type="text"]');
  if (!input) throw new Error("no search field in the preview");
  return input as HTMLInputElement;
};

/** The typed filter, committed with Enter so the 400ms debounce is skipped. */
const filterBy = (view: ReturnType<typeof render>, term: string): void => {
  const input = searchField(view);
  fireEvent.change(input, { target: { value: term } });
  fireEvent.keyDown(input, { key: "Enter" });
};

describe("SplitViewPlayground preview", () => {
  it("mounts the rows the snippet prints and never the hidden one (:573)", () => {
    const view = render(<SplitViewPlayground />);
    for (const name of ["api-gateway", "worker-pool", "batch-runner", "edge-cache"]) {
      expect(row(view, name)).toBeTruthy();
    }
    // Read from the rows, not from the caption: the caption is the page's own
    // prose and it names the hidden row on purpose.
    expect(
      rows(view)
        .map((node) => node.textContent ?? "")
        .join("|"),
    ).not.toContain("legacy-sidecar");
    // The title is an <h3> the component only renders when the prop is set (:1126).
    const heading = within(stage(view)).getByRole("heading", { level: 3 });
    expect(heading.textContent).toBe("CAPSULES (4)");
    expect(rows(view)).toHaveLength(4);
  });

  it("moves aria-current with the click, and refuses a disabled row (:677,:1192)", () => {
    const view = render(<SplitViewPlayground />);
    expect(row(view, "api-gateway").getAttribute("aria-current")).toBe("true");
    fireEvent.click(row(view, "worker-pool"));
    expect(row(view, "worker-pool").getAttribute("aria-current")).toBe("true");
    expect(row(view, "api-gateway").getAttribute("aria-current")).toBeNull();

    const cache = row(view, "edge-cache");
    expect(cache.getAttribute("aria-disabled")).toBe("true");
    expect(cache.getAttribute("tabindex")).toBe("-1");
    fireEvent.click(cache);
    expect(row(view, "worker-pool").getAttribute("aria-current")).toBe("true");
  });

  it("is a stack of buttons with no listbox and no aria-selected (:1188-1204)", () => {
    const view = render(<SplitViewPlayground />);
    expect(stage(view).querySelector('[role="listbox"]')).toBeNull();
    expect(stage(view).querySelector("[aria-selected]")).toBeNull();
    expect(stage(view).querySelector("[aria-live]")).toBeNull();
  });

  it("shows the catalog's no-selection pair when nothing is selected (:1538-1547)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    expect(stage(view).textContent).toContain("Gateway build 412");
    choose(view, "Selected row", "__none");
    expect(stage(view).textContent).toContain("No item selected");
    expect(stage(view).textContent).toContain(
      "Select an item from the list to view its details.",
    );
    expect(stage(view).textContent).not.toContain("Gateway build 412");
  });

  it("selects nothing at all when the id it is given names a hidden row (:669)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    choose(view, "Selected row", "sidecar");
    expect(stage(view).textContent).toContain("No item selected");
    expect(stage(view).textContent).not.toContain("Sidecar build 3");
  });

  it("reveals a row's actions on hover only — a keyboard never finds them (:1286)", () => {
    const view = render(<SplitViewPlayground />);
    const logs = within(stage(view)).getByText("Logs", { exact: true });
    const wrapper = logs.parentElement;
    if (!wrapper) throw new Error("the action has no wrapper");
    expect(wrapper.className).toContain("opacity-0");
    expect(wrapper.className).toContain("group-hover/item:opacity-100");
    // The one class the overflow menu's wrapper has and this one does not.
    expect(wrapper.className).not.toContain("focus-within");
  });

  it("does give the overflow dots a focus path, unlike the row actions (:547)", () => {
    const view = render(<SplitViewPlayground />);
    const dots = within(stage(view)).getAllByRole("button", { name: "More options" });
    const wrapper = dots[0]?.parentElement;
    if (!wrapper) throw new Error("the dots button has no wrapper");
    expect(wrapper.className).toContain("focus-within:opacity-100");
    expect(dots[0]?.getAttribute("aria-haspopup")).toBe("menu");
    expect(dots[0]?.getAttribute("aria-expanded")).toBe("false");
  });

  it("makes a child row a button only when it can do something (:1411-1419)", () => {
    const view = render(<SplitViewPlayground />);
    fireEvent.click(row(view, "batch-runner"));
    const clickable = within(stage(view)).queryByText("batch-nightly-2f");
    const inert = within(stage(view)).queryByText("batch-nightly-8a");
    expect(clickable).toBeTruthy();
    expect(inert).toBeTruthy();
    // The clickable one is a real <button>; the other sits in a <div> row.
    const buttonRow = (clickable as HTMLElement).closest("button");
    const divRow = (inert as HTMLElement).closest("button");
    expect(buttonRow).not.toBeNull();
    expect(divRow).toBeNull();
    expect((inert as HTMLElement).closest("div")).toBeTruthy();
  });

  it("paints the new-item dot while the row is not the active one (:1294-1302)", () => {
    const view = render(<SplitViewPlayground />);
    const dot = row(view, "batch-runner").querySelector(".animate-pulse");
    expect(dot).toBeTruthy();
    expandAll(view);
    flip(view, "New-item dot");
    expect(row(view, "batch-runner").querySelector(".animate-pulse")).toBeNull();
    // The tint stays — only the dot is gated by the prop.
    expect(row(view, "batch-runner")).toBeTruthy();
  });

  it("replaces the list with an aria-hidden skeleton and says nothing (:910,:994)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    flip(view, "Loading");
    expect(rows(view)).toHaveLength(0);
    expect(stage(view).querySelector('[aria-hidden="true"]')).toBeTruthy();
    expect(stage(view).querySelector("[role=status]")).toBeNull();
    expect(stage(view).querySelector("[aria-live]")).toBeNull();
  });

  it("speaks the catalog when a loader covers the content (:954,:958)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    flip(view, "Loading");
    choose(view, "Loader", "spinner");
    expect(stage(view).textContent).toContain("Please wait...");
    expect(stage(view).textContent).toContain("Loading...");
    // The rows are still mounted underneath an overlay — unlike the skeleton.
    expect(rows(view)).toHaveLength(4);
  });

  it("hands the loader slot to the page when asked (:951)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    flip(view, "Loading");
    flip(view, "Custom loader");
    expect(stage(view).textContent).toContain("Contacting the registry…");
    expect(stage(view).textContent).not.toContain("Please wait...");
  });

  it("turns the error string into the EmptyState subtitle (:974-978)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    flip(view, "Error state");
    expect(stage(view).textContent).toContain("Something went wrong");
    expect(stage(view).textContent).toContain("Could not reach the registry");
    // No Retry without the prop — the reader has a message and no way out (:980).
    expect(within(stage(view)).queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("adds the translated Retry action and clears on click (:980)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    flip(view, "Error state");
    flip(view, "Retry action");
    const retry = within(stage(view)).getByRole("button", { name: "Retry" });
    fireEvent.click(retry);
    expect(stage(view).textContent).not.toContain("Something went wrong");
    expect(rows(view)).toHaveLength(4);
  });

  it("keeps the catalog placeholder until the page writes its own (:1157)", () => {
    const view = render(<SplitViewPlayground />);
    expect(searchField(view).getAttribute("placeholder")).toBe("Search...");
    expandAll(view);
    type(view, "Search placeholder", "Find a capsule");
    expect(searchField(view).getAttribute("placeholder")).toBe("Find a capsule");
  });

  it("filters with Enter and shows its own empty node when nothing matches (:1177)", () => {
    const view = render(<SplitViewPlayground />);
    filterBy(view, "worker");
    expect(rows(view)).toHaveLength(1);
    filterBy(view, "nothing-matches");
    expect(rows(view)).toHaveLength(0);
    // The fallback is a hardcoded English string, not a catalog entry (:1177).
    expect(stage(view).textContent).toContain("No items found");
    expandAll(view);
    flip(view, "Filter-empty node");
    expect(stage(view).textContent).toContain("Nothing matches that filter.");
  });

  it("folds the list to a 48px rail that keeps only its expand button (:890-894)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    flip(view, "Collapsible list");
    fireEvent.click(within(stage(view)).getByRole("button", { name: "Collapse list" }));
    const rail = Array.from(stage(view).querySelectorAll("div")).find(
      (node) => node.style.width === "48px",
    );
    if (!rail) throw new Error("the list did not fold to its rail");
    expect(rail.textContent).not.toContain("Add capsule");
    expect(rail.textContent).not.toContain("CAPSULES");
    // The rail's button answers to the catalog label; the English tooltip the
    // component hardwires (:1110) never reaches the accessibility tree.
    const expand = within(rail).getByRole("button", { name: "Expand list" });
    expect(expand.getAttribute("aria-label")).toBe("Expand list");
    expect(rail.textContent).not.toContain("Expand View");
    fireEvent.click(expand);
    expect(rows(view)).toHaveLength(4);
  });

  it("reports the fold to the host when asked to (:605-609)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    flip(view, "Collapsible list");
    flip(view, "Report collapse");
    const collapseField = fieldBox(view, "Collapse state");
    const folded = within(collapseField).getByRole("radio", {
      name: "host says folded",
    });
    const owns = within(collapseField).getByRole("radio", { name: "list owns it" });
    expect(owns.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(within(stage(view)).getByRole("button", { name: "Collapse list" }));
    // The rail's click wrote through to the page's own choice (:605-609).
    expect(folded.getAttribute("aria-checked")).toBe("true");
  });

  it("gives the divider a separator contract only when it can be dragged (:1490)", () => {
    const view = render(<SplitViewPlayground />);
    expect(stage(view).querySelector('[role="separator"]')).toBeNull();
    expandAll(view);
    flip(view, "Draggable divider");
    const divider = stage(view).querySelector('[role="separator"]');
    if (!divider) throw new Error("no separator in the preview");
    expect(divider.getAttribute("aria-orientation")).toBe("vertical");
    expect(divider.getAttribute("tabindex")).toBe("0");
    // 288 = the w-72 seed; 600 is the cap when there is no container to measure.
    expect(divider.getAttribute("aria-valuenow")).toBe("288");
    expect(divider.getAttribute("aria-valuemin")).toBe("180");
    expect(divider.getAttribute("aria-valuemax")).toBe("600");
    fireEvent.keyDown(divider, { key: "ArrowRight" });
    expect(divider.getAttribute("aria-valuenow")).toBe("308");
    fireEvent.keyDown(divider, { key: "ArrowLeft" });
    expect(divider.getAttribute("aria-valuenow")).toBe("288");
    // The separator answers no other key (useResizable:112-114).
    fireEvent.keyDown(divider, { key: "Home" });
    expect(divider.getAttribute("aria-valuenow")).toBe("288");
  });

  it("lets the built-in header win the slot over a custom node (:875-879)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    expect(stage(view).textContent).toContain("api-gateway · build");
    flip(view, "panelHeader node");
    expect(stage(view).textContent).toContain("api-gateway · build");
    expect(stage(view).textContent).not.toContain("Registry entry");
    flip(view, "Built-in header");
    expect(stage(view).textContent).toContain("Registry entry");
    expect(stage(view).textContent).not.toContain("api-gateway · build");
  });

  it("paints the header details block, which is where tags actually render (:857)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    expect(stage(view).textContent).toContain("Region");
    expect(stage(view).textContent).toContain("healthy");
    flip(view, "Header details block");
    expect(stage(view).textContent).not.toContain("Region");
    expect(stage(view).textContent).not.toContain("healthy");
  });

  it("replaces the catalog's no-panel placeholder when the page fills it (:1532)", () => {
    const view = render(<SplitViewPlayground />);
    expandAll(view);
    choose(view, "Selected row", "cache");
    // The disabled row still has a panel of its own, so the placeholder is not used.
    expect(stage(view).textContent).toContain("Cache build 12");
    flip(view, "Detail placeholder");
    expect(stage(view).textContent).toContain("Cache build 12");
    choose(view, "Selected row", "__none");
    expect(stage(view).textContent).toContain("Pick a capsule to see its build.");
    expect(stage(view).textContent).not.toContain("No item selected");
  });
});
