import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DropdownButton, { type DropdownButtonOption } from "./DropdownButton.vue";

// The tip has to be the real one here — the point is the interaction between a
// visible tooltip and the popup, which a mock could only pretend at.
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => () => null,
}));

const OPTIONS: DropdownButtonOption[] = [
  { value: "archive", label: "Archive" },
  { value: "delete", label: "Delete" },
];

// Both the tooltip and the menu teleport to `document.body`.
const tip = () => document.querySelector('[role="tooltip"]');
const menu = () => document.querySelector('[role="menu"]');

const mountButton = (props: Record<string, unknown> = {}) =>
  mount(DropdownButton, {
    props: { label: "Actions", options: OPTIONS, tooltip: "Batch actions", ...props },
    attachTo: document.body,
  });

describe("DropdownButton", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("renders the label and opens the popup from the caret", async () => {
    const w = mountButton();
    expect(w.find("button").text()).toBe("Actions");
    expect(menu()).toBeNull();
    await w.find("[data-dropdown-caret]").trigger("click");
    expect(menu()).not.toBeNull();
    w.unmount();
  });

  it("keeps the trigger tooltip out of the way while the menu is open", async () => {
    vi.useFakeTimers();
    const w = mountButton();
    const main = () => w.find("button");

    // Hover long enough for the kit's 1s default and the tip is there.
    await main().trigger("mouseenter");
    await vi.advanceTimersByTimeAsync(1000);
    await nextTick();
    expect(tip()).not.toBeNull();

    // Opening the popup hands that space to the rows: the tip has to leave,
    // even though the pointer never left the trigger.
    await w.find("[data-dropdown-caret]").trigger("click");
    await nextTick();
    expect(menu()).not.toBeNull();
    expect(tip()).toBeNull();

    // Close it and the tip is available again.
    await w.find("[data-dropdown-caret]").trigger("click");
    await nextTick();
    expect(menu()).toBeNull();
    await main().trigger("mouseenter");
    await vi.advanceTimersByTimeAsync(1000);
    await nextTick();
    expect(tip()).not.toBeNull();
    w.unmount();
  });

  it("cannot be argued with: tooltipDisabled false does not force the tip open", async () => {
    // A caller's `false` means "no suppression of its own", not "show it while
    // the menu is up" — the popup owns the space under the trigger.
    vi.useFakeTimers();
    const w = mountButton({ tooltipDisabled: false });
    await w.find("[data-dropdown-caret]").trigger("click");
    await nextTick();
    await w.find("button").trigger("mouseenter");
    await vi.advanceTimersByTimeAsync(1500);
    await nextTick();
    expect(menu()).not.toBeNull();
    expect(tip()).toBeNull();
    w.unmount();
  });

  it("pins the control width and lets the label ellipsize", () => {
    // The width sits on the container: the control is two buttons, and
    // `menuWidth="trigger"` measures this same element.
    const w = mountButton({ width: 220, label: "Deploy to the production cluster" });
    expect(w.find("div").attributes("style")).toContain("width: 220px");
    const main = w.findAll("button")[0];
    expect(main.classes()).toContain("min-w-0");
    const label = main.find("span.truncate");
    expect(label.exists()).toBe(true);
    expect(label.classes()).toContain("min-w-0");
    w.unmount();
  });

  it("maxWidth caps a content-sized control and a CSS length rides through", () => {
    const w = mountButton({ maxWidth: "16rem" });
    expect(w.find("div").attributes("style")).toContain("max-width: 16rem");
    w.unmount();
  });

  it("leaves the control's DOM alone when no width is given", () => {
    // The shrink chain is an opt-in cost — an unsized control renders exactly
    // what it rendered before, span-free and style-free.
    const w = mountButton();
    expect(w.find("div").attributes("style")).toBeUndefined();
    const main = w.findAll("button")[0];
    expect(main.classes()).not.toContain("min-w-0");
    expect(main.find("span.truncate").exists()).toBe(false);
    w.unmount();
  });

  it("never reaches the DOM as an HTML width attribute", () => {
    const w = mountButton({ width: 200, maxWidth: 300 });
    for (const button of w.findAll("button")) {
      const names = button.element.getAttributeNames().map((n) => n.toLowerCase());
      expect(names).not.toContain("width");
      expect(names).not.toContain("maxwidth");
    }
    w.unmount();
  });
});
