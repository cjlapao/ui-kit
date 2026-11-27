import { describe, it, expect } from "vitest";
import { fireEvent, render, within } from "@testing-library/react";
import SidePanelPlayground from "./SidePanelPlayground";
import { ROWS } from "./sidePanelFixture";

/**
 * The preview is the half of the page's claim that has to survive the browser, so
 * it is read out of the DOM the kit produced: what mounted, what role it was given,
 * what the keyboard can reach, and what disappears when the panel says it is closed.
 * Everything is read from the preview column — the controls on its left are buttons
 * and switches too, and reading across both columns would only test the chrome.
 */

const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector(".min-h-44");
  if (!node) throw new Error("the preview column is not mounted");
  return node as HTMLElement;
};

/**
 * One control, found by the label the config writes. The chrome renders its
 * captions as plain `<span>`s — a `Select` and a number box carry no accessible
 * name of their own — so the label is the only way in, and the walk from it is
 * how a reader finds the control too.
 */
const fieldBox = (view: ReturnType<typeof render>, label: RegExp): HTMLElement => {
  const span = Array.from(view.container.querySelectorAll("span")).find((node) =>
    label.test(node.textContent ?? ""),
  );
  const box = span?.parentElement;
  if (!box) throw new Error(`no control labelled ${label.source} in the controls`);
  return box;
};

/** The segmented option a reader would click (a `MultiToggle` button). */
/**
 * A choice, however the chrome chose to render it: a `MultiToggle` for a short
 * list, a `Select` for a long one — the config decides, the test should not care.
 */
const choose = (
  view: ReturnType<typeof render>,
  label: RegExp,
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
  if (!button) throw new Error(`"${value}" is not an option of ${label.source}`);
  fireEvent.click(button);
};

/** A number box, set the way a reader types into it. */
const type = (
  view: ReturnType<typeof render>,
  label: RegExp,
  value: string,
): void => {
  const input = fieldBox(view, label).querySelector("input");
  if (!input) throw new Error(`no number box for ${label.source}`);
  fireEvent.change(input, { target: { value } });
};

const expandAll = (view: ReturnType<typeof render>): void => {
  fireEvent.click(within(view.container).getByRole("button", { name: "Expand all" }));
};

const flip = (view: ReturnType<typeof render>, label: RegExp): void => {
  fireEvent.click(within(view.container).getByRole("switch", { name: label }));
};

const shell = (view: ReturnType<typeof render>): HTMLElement | null =>
  stage(view).querySelector("[data-sp-shell]");

const content = (view: ReturnType<typeof render>): HTMLElement | null =>
  stage(view).querySelector("[data-sp-content]");

/** The scrim, found by the classes the component writes (:1166). */
/**
 * The kit unmounts a closing panel when the width transition reports back
 * (:613-623,:944) — a browser fires that event, jsdom does not, so the test has
 * to say it out loud. Omitting it is also a fact worth asserting: without the
 * report the panel keeps its (zero-width) shell mounted.
 */
const reportClose = (view: ReturnType<typeof render>): void => {
  const node = shell(view);
  if (!node) throw new Error("the panel is already unmounted");
  fireEvent.transitionEnd(node, { propertyName: "width" });
};

const scrim = (view: ReturnType<typeof render>): HTMLElement | null =>
  Array.from(stage(view).querySelectorAll("div")).find((node) =>
    node.className.includes("bg-black/20"),
  ) ?? null;

describe("SidePanelPlayground preview", () => {
  it("mounts the panel, its header and the markup the Code view declares", () => {
    const view = render(<SidePanelPlayground />);
    const board = within(stage(view));
    // The header the snippet prints, and the body it prints with it.
    expect(board.getByText("Build 412")).toBeTruthy();
    expect(board.getByText("eu-west-1 · 4m 12s")).toBeTruthy();
    expect(board.getByText("Build details")).toBeTruthy();
    for (const row of ROWS) expect(board.getByText(row)).toBeTruthy();
    // The three slots that are on: two pills, three filters, two footer buttons.
    expect(board.getByText("3 new")).toBeTruthy();
    expect(board.getByText("Passing")).toBeTruthy();
    expect(board.getByText("Save")).toBeTruthy();
    // The page behind it stays on screen: the panel is out of flow, not a hole.
    expect(board.getByText(/Deployment 412/)).toBeTruthy();
    expect(shell(view)).toBeTruthy();
  });

  it("claims no dialog role and no name of its own", () => {
    const view = render(<SidePanelPlayground />);
    const root = stage(view);
    // The honest claim of the Screen-reader topic: it is a group of divs, not a
    // dialog — nothing in the component asks to be treated as one (:892,:1010).
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    expect(root.querySelector('[aria-modal]')).toBeNull();
    expect(root.querySelector('[role="complementary"]')).toBeNull();
    expect(shell(view)?.getAttribute("role")).toBeNull();
    // The only named parts are the ones the kit labels from the catalog.
    expect(within(root).getByRole("button", { name: "Close panel" })).toBeTruthy();
  });

  it("closes for real: the close button unmounts the panel once the sweep reports", () => {
    const view = render(<SidePanelPlayground />);
    const node = shell(view);
    if (!node) throw new Error("no panel to close");
    fireEvent.click(within(stage(view)).getByRole("button", { name: "Close panel" }));
    // Collapsed to nothing, still mounted: unmount waits for the width transition
    // to report (:613-623,:938-944), which a browser always does and jsdom never will.
    expect(node.style.width).toBe("0px");
    // A bubbling transition from a child is not the signal (:618-621).
    fireEvent.transitionEnd(node, { propertyName: "opacity" });
    expect(shell(view)).toBeTruthy();
    reportClose(view);
    // Gone, not hidden: `!mounted` returns null (:839).
    expect(shell(view)).toBeNull();
    expect(content(view)).toBeNull();
    expect(stage(view).textContent).not.toContain("Build details");
    // The page behind it was never removed, so the frame is not empty.
    expect(stage(view).textContent).toContain("Deployment 412");
  });

  it("trades the close button for a chevron and makes the content inert", () => {
    const view = render(<SidePanelPlayground />);
    flip(view, /Collapsible/);
    const board = within(stage(view));
    // `onClose && !collapsible` — the chevron takes the close button's place (:1080).
    expect(board.queryByRole("button", { name: "Close panel" })).toBeNull();
    const chevron = board.getByRole("button", { name: "Collapse panel" });
    fireEvent.click(chevron);
    const body = content(view);
    if (!body) throw new Error("the panel unmounted instead of collapsing");
    // The full panel stays mounted, pushed out of reach (:1014-1015).
    expect(body.hasAttribute("inert")).toBe(true);
    expect(body.getAttribute("aria-hidden")).toBe("true");
    expect(stage(view).textContent).toContain("Build details");
    expect(board.getByRole("button", { name: "Expand panel" })).toBeTruthy();
  });

  it("gives a collapsible panel a rail, and no scrim over it", () => {
    const view = render(<SidePanelPlayground />);
    flip(view, /Collapsible/);
    flip(view, /Overlay/);
    fireEvent.click(
      within(stage(view)).getByRole("button", { name: "Collapse panel" }),
    );
    // The scrim steps back with the rail (:1173,:1177) — the sheet is not covering
    // the page while the panel is a rail beside it.
    const sheet = scrim(view);
    if (!sheet) throw new Error("no scrim mounted with overlay on");
    expect(sheet.getAttribute("aria-hidden")).toBe("true");
    expect(sheet.style.pointerEvents).toBe("none");
    expect(sheet.style.opacity).toBe("0");
  });

  it("clicking the scrim is the same handler the close button has", () => {
    const view = render(<SidePanelPlayground />);
    flip(view, /Overlay/);
    const sheet = scrim(view);
    if (!sheet) throw new Error("no scrim mounted with overlay on");
    expect(sheet.style.pointerEvents).toBe("auto");
    fireEvent.click(sheet);
    expect(shell(view)?.style.width).toBe("0px");
    reportClose(view);
    expect(shell(view)).toBeNull();
  });

  it("never gives a docked panel a scrim", () => {
    const view = render(<SidePanelPlayground />);
    flip(view, /Overlay/);
    flip(view, /In the flow/);
    expect(scrim(view)).toBeNull();
    expect(shell(view)).toBeTruthy();
  });

  it("puts the keyboard on the separator, and only there", () => {
    const view = render(<SidePanelPlayground />);
    const board = within(stage(view));
    // No handle without `resizable` (:1195), and the panel body is not a tab stop.
    expect(board.queryByRole("separator")).toBeNull();
    expandAll(view);
    flip(view, /Resizable/);

    const separator = board.getByRole("separator");
    expect(separator.getAttribute("aria-label")).toBe("Resize panel");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    expect(separator.getAttribute("aria-valuenow")).toBe("420");
    expect(separator.getAttribute("aria-valuemin")).toBe("280");
    expect(separator.getAttribute("aria-valuemax")).toBe("900");
    expect(separator.getAttribute("tabindex")).toBe("0");

    // A right-docked panel grows on ArrowLeft — the key points away from the edge
    // the panel is docked to, mirroring the drag (:806-834).
    fireEvent.keyDown(separator, { key: "ArrowLeft" });
    expect(separator.getAttribute("aria-valuenow")).toBe("440");
    fireEvent.keyDown(separator, { key: "ArrowRight" });
    expect(separator.getAttribute("aria-valuenow")).toBe("420");
    fireEvent.keyDown(separator, { key: "Home" });
    expect(separator.getAttribute("aria-valuenow")).toBe("280");
    fireEvent.keyDown(separator, { key: "End" });
    expect(separator.getAttribute("aria-valuenow")).toBe("900");
    // Keys the separator does not answer leave the number alone (:809-834).
    fireEvent.keyDown(separator, { key: "Enter" });
    expect(separator.getAttribute("aria-valuenow")).toBe("900");
  });

  it("parks the handle rather than unmounting it, when the panel collapses", () => {
    const view = render(<SidePanelPlayground />);
    expandAll(view);
    flip(view, /Resizable/);
    flip(view, /Collapsible/);
    fireEvent.click(within(stage(view)).getByRole("button", { name: "Collapse panel" }));
    const handle = stage(view).querySelector("[data-sp-handle]");
    if (!handle) throw new Error("the handle vanished instead of parking");
    // Parked: no role, no aria, out of the tab order, click-through (:881-888).
    expect(handle.hasAttribute("role")).toBe(false);
    expect(handle.getAttribute("aria-hidden")).toBe("true");
    expect(handle.getAttribute("tabindex")).toBe("-1");
    expect(within(stage(view)).queryByRole("separator")).toBeNull();
  });

  it("moves the size to the height axis for a top panel", () => {
    const view = render(<SidePanelPlayground />);
    expandAll(view);
    flip(view, /Resizable/);
    choose(view, /Docked edge/, "top");
    const separator = within(stage(view)).getByRole("separator");
    // `vertical` swaps orientation and the reported value (:819-821,:1206-1210).
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
    expect(separator.getAttribute("aria-valuenow")).toBe("240");
    // The key that points away from the edge the panel is docked to grows it, so
    // the pair means the opposite thing here than on a left/right panel (:815-816).
    fireEvent.keyDown(separator, { key: "ArrowDown" });
    expect(separator.getAttribute("aria-valuenow")).toBe("260");
    fireEvent.keyDown(separator, { key: "ArrowUp" });
    expect(separator.getAttribute("aria-valuenow")).toBe("240");
  });

  it("shows a decorative scrim when there is nothing for it to call", () => {
    const view = render(<SidePanelPlayground />);
    flip(view, /Close affordance/);
    flip(view, /Overlay/);
    const board = within(stage(view));
    // No `onClose`: no close button, and a scrim that clicks through to nothing.
    expect(board.queryByRole("button", { name: "Close panel" })).toBeNull();
    const sheet = scrim(view);
    if (!sheet) throw new Error("no scrim mounted with overlay on");
    fireEvent.click(sheet);
    expect(shell(view)).toBeTruthy();
    expect(view.container.textContent).toContain("does nothing");
  });

  it("says out loud what the board cannot show once the panel is closed", () => {
    const view = render(<SidePanelPlayground />);
    flip(view, /Open/);
    reportClose(view);
    expect(shell(view)).toBeNull();
    // The caption carries the fact the empty frame cannot: closed is unmounted.
    expect(view.container.textContent).toContain("(:839)");
    flip(view, /Open/);
    expect(shell(view)).toBeTruthy();
  });

  it("warns that a size outside the bounds survives only until the handle is used", () => {
    const view = render(<SidePanelPlayground />);
    expandAll(view);
    flip(view, /Resizable/);
    type(view, /Width px/, "150");
    expect(view.container.textContent).toContain("outside the handle");
    const separator = within(stage(view)).getByRole("separator");
    // The clamp runs on the key press, not on the prop (:822-834): Home lands on
    // the 280 the component itself chose, not on the 120 the slider allows.
    fireEvent.keyDown(separator, { key: "ArrowLeft" });
    expect(separator.getAttribute("aria-valuenow")).toBe("280");
  });

  it("paints the surface on a layer of its own, not on the panel", () => {
    const view = render(<SidePanelPlayground />);
    const node = shell(view);
    if (!node) throw new Error("no shell");
    // A current variant has no border of its own: the shell only positions and
    // clips, and the whole fill is a nested `Panel` inside the fill layer (:956-979).
    expect(node.className).not.toMatch(/(^|\s)border(-y|-l|-r)?(\s|$)/);
    expect(node.className).toContain("rounded-l-2xl");
    expect(
      stage(view).querySelector('[data-sp-fill] section[data-variant="outlined"]'),
    ).toBeTruthy();
    // Grain is opt-in, painted between the fill and the content (:985-995).
    expect(stage(view).querySelector("[data-sp-noise]")).toBeNull();
    flip(view, /Noise layer/);
    expect(stage(view).querySelector("[data-sp-noise]")).toBeTruthy();
  });

  it("takes the older fill path for a legacy name, alias or not", () => {
    const view = render(<SidePanelPlayground />);
    // `floating` resolves to `elevated` for tokens and text (:45-50,:497) yet stays
    // a *legacy* name, so it paints the sidebar surface itself — bordered, no ring,
    // and no nested Panel at all (:906-907,:961,:965). The alias is a name, not a
    // rendering path: `elevated` beside it looks different.
    choose(view, /Variant/, "floating");
    const legacy = shell(view);
    if (!legacy) throw new Error("no shell");
    expect(legacy.className).toContain("border-y");
    expect(legacy.className).toContain("border-l");
    expect(legacy.className).not.toContain("ring-1");
    expect(stage(view).querySelector("[data-sp-fill] section")).toBeNull();

    choose(view, /Variant/, "elevated");
    const modern = shell(view);
    if (!modern) throw new Error("no shell");
    expect(modern.className).not.toContain("border-y");
    expect(modern.className).toContain("ring-1");
    expect(
      stage(view).querySelector('[data-sp-fill] section[data-variant="elevated"]'),
    ).toBeTruthy();
  });
});
