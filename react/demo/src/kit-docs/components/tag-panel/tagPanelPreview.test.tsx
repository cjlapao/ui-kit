import { describe, it, expect } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { TagPanelPlayground } from "./TagPanelPlayground";

/**
 * The preview is the other half of the claim, so it is read from the DOM rather
 * than from the config: the group the chip controls, the name the chip carries,
 * what stays mounted while folded, and what the kit prints for a string this
 * page says is translated.
 */

/**
 * Everything is read inside the Stage's own column: the playground's control
 * accordion is a column of `role="group"` panels whose headers are
 * `button[aria-expanded]` too, and reading across both columns would test the
 * chrome instead of the component.
 */
const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector(".max-w-md");
  if (!node) throw new Error("the preview column is not mounted");
  return node as HTMLElement;
};

const group = (view: ReturnType<typeof render>): HTMLElement | null =>
  stage(view).querySelector('[role="group"]');

const chip = (view: ReturnType<typeof render>): HTMLButtonElement | null =>
  stage(view).querySelector('button[aria-expanded]');

const buttons = (view: ReturnType<typeof render>): HTMLButtonElement[] =>
  Array.from(stage(view).querySelectorAll("button"));

const textInput = (view: ReturnType<typeof render>): HTMLInputElement => {
  const found = Array.from(view.container.querySelectorAll("input")).find(
    // The kit's Input omits the attribute, so this reads the property.
    (node) => (node as HTMLInputElement).type === "text",
  ) as HTMLInputElement | undefined;
  if (!found) throw new Error("no text input in the controls");
  return found;
};

const numberInput = (view: ReturnType<typeof render>): HTMLInputElement => {
  // One number control exists at rest: `tagLimit`, in the open fold group.
  const found = view.container.querySelector(
    'input[type="number"]',
  ) as HTMLInputElement | null;
  if (!found) throw new Error("no number input in the controls");
  return found;
};

describe("TagPanelPlayground preview", () => {
  it("labels the group and points the chip at it (:109,:229-232,:270)", () => {
    const view = render(<TagPanelPlayground />);
    const region = group(view);
    expect(region).not.toBeNull();
    // t("kit.tagpanel.group") — en.ts:383, not a string this page wrote.
    expect(region!.getAttribute("aria-label")).toBe("Tags");
    const control = chip(view);
    expect(control).not.toBeNull();
    expect(control!.getAttribute("aria-controls")).toBe(region!.id);
    expect(region!.id.length).toBeGreaterThan(0);
  });

  it("names the chip by what it will reveal, and shows the same count", () => {
    const view = render(<TagPanelPlayground />);
    const control = chip(view)!;
    expect(control.getAttribute("aria-expanded")).toBe("false");
    expect(control.getAttribute("aria-label")).toBe("Show 3 more tags");
    expect(control.textContent).toContain("+3");
    // The `+`/`×` glyph is decoration and never spoken (:286-294).
    const glyph = control.querySelector('span[aria-hidden="true"]');
    expect(glyph, "the + that tilts into a ×").not.toBeNull();
    expect(glyph!.textContent).toBe("+3");
  });

  it("keeps folded pills mounted but out of the accessibility tree (:190-191,:307)", () => {
    const view = render(<TagPanelPlayground />);
    const folded = Array.from(
      group(view)!.querySelectorAll('span[aria-hidden="true"]'),
    ).filter((node) => node.textContent === "canary");
    expect(folded.length, "the eighth pill is mounted, hidden").toBe(1);
    expect(view.getByText("canary", { exact: true })).toBeTruthy();
  });

  it("opens the fold with the chip and closes it again", () => {
    const view = render(<TagPanelPlayground />);
    const control = chip(view)!;
    fireEvent.click(control);
    expect(control.getAttribute("aria-expanded")).toBe("true");
    expect(control.getAttribute("aria-label")).toBe("Collapse tags");
    expect(chipText(view)).toContain("canary");
    // Retract is deferred by the hold (CASCADE_EXPAND.holdMs), so the folded
    // spans are still not aria-hidden on this tick (:148-155, Theme.ts:1685).
    fireEvent.click(control);
    expect(control.getAttribute("aria-expanded")).toBe("false");
    expect(control.getAttribute("aria-label")).toBe("Show 3 more tags");
  });

  it("has exactly one stop in the fold, and none in the pills", () => {
    const view = render(<TagPanelPlayground />);
    expect(buttons(view)).toHaveLength(1);
    expect(buttons(view)[0].getAttribute("type")).toBe("button");
  });

  it("says the count without plural grammar, as the catalog is written (en.ts:384)", () => {
    const view = render(<TagPanelPlayground />);
    fireEvent.change(numberInput(view), { target: { value: "7" } });
    // One folded tag: the built-in copy interpolates {count} with no plural
    // branch, and the engine would support one (icu.ts:237-261).
    expect(chip(view)!.getAttribute("aria-label")).toBe("Show 1 more tags");
  });

  it("draws no chip at all when nothing is folded (:139)", () => {
    const view = render(<TagPanelPlayground />);
    fireEvent.change(numberInput(view), { target: { value: "0" } });
    expect(chip(view)).toBeNull();
    expect(buttons(view)).toHaveLength(0);
    expect(group(view)!.textContent).toContain("canary");
  });

  it("shows the kit's own empty copy, not one this page typed", () => {
    const view = render(<TagPanelPlayground />);
    fireEvent.click(view.getByText("No tags", { exact: true }));
    // t("kit.tagpanel.empty") — en.ts:386.
    expect(stage(view).textContent).toContain("No tags");
    expect(chip(view)).toBeNull();
  });

  it("swaps in a caller's own empty block wholesale", () => {
    const view = render(<TagPanelPlayground />);
    fireEvent.click(view.getByText("No tags", { exact: true }));
    fireEvent.click(view.getByText(/^emptyState — bring your own block/));
    expect(stage(view).textContent).toContain("Nothing tagged");
    expect(chip(view)).toBeNull();
  });

  it("hides the whole header when there is no title (:216)", () => {
    const view = render(<TagPanelPlayground />);
    expect(view.getByText("Labels", { exact: true })).toBeTruthy();
    fireEvent.change(textInput(view), { target: { value: "   " } });
    expect(view.queryByText("Labels", { exact: true })).toBeNull();
    // The pills stay: the header is the only thing the title gates.
    expect(group(view)!.textContent).toContain("prod");
  });

  it("gives the chip no focus styling of its own, as the keyboard section says", () => {
    const view = render(<TagPanelPlayground />);
    const control = chip(view)!;
    expect(control.className).not.toContain("focus-visible");
    expect(control.className).not.toContain("ring");
  });
});

const chipText = (view: ReturnType<typeof render>): string =>
  group(view)?.textContent ?? "";
