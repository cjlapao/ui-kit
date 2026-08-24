import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DropdownMenu, {
  type DropdownMenuOption,
} from "./DropdownMenu.vue";

const ITEMS: DropdownMenuOption[] = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
];

// Mount closed, then open via setProps. This mirrors the real user flow (the
// menu is positioned when it OPENS) and, importantly, reliably triggers the
// positioning watcher — VTU does not fire an `immediate` + `flush: "post"`
// watcher's initial callback on mount, so mounting already-open would leave the
// menu unpositioned.
const mountMenu = async (
  items: DropdownMenuOption[] = ITEMS,
  extra: Record<string, unknown> = {},
) => {
  const wrapper = mount(DropdownMenu, {
    props: {
      anchorRef: document.createElement("div"),
      open: false,
      items,
      ...extra,
    },
  });
  await nextTick();
  return wrapper;
};

type MenuWrapper = Awaited<ReturnType<typeof mountMenu>>;

const openMenu = async (wrapper: MenuWrapper) => {
  await wrapper.setProps({ open: true });
  await nextTick();
};

// The menu is teleported to document.body, so it is queried off the document
// rather than the wrapper.
const menu = () => document.querySelector('[role="menu"]') as HTMLElement | null;
const itemEls = () =>
  Array.from(document.querySelectorAll('[role="menuitem"]')) as HTMLButtonElement[];
const activeStop = () => itemEls().find((el) => el.getAttribute("tabindex") === "0");

const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
};

// jsdom lays nothing out, so the anchor and menu boxes are faked. The menu is
// recognised by its `role="menu"`; everything else is treated as the anchor.
const mockLayout = (anchor: Partial<DOMRect>, menuRect: Partial<DOMRect>) =>
  vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      const isMenu = this.getAttribute?.("role") === "menu";
      return {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        ...(isMenu ? menuRect : anchor),
        toJSON: () => ({}),
      } as DOMRect;
    });

const press = (key: string) => {
  menu()!.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
};

// The menu teleports to the real document.body, and VTU removes teleported
// content asynchronously on unmount. Sweep any leftovers so a test never sees
// another test's menu (which would defeat the document-level queries).
const clearMenus = () =>
  document.body.querySelectorAll('[role="menu"]').forEach((el) => el.remove());

beforeEach(clearMenus);
afterEach(() => {
  clearMenus();
  vi.restoreAllMocks();
});

describe("DropdownMenu — collision detection (viewport boundary)", () => {
  it("flips UP when the anchor is near the bottom of the viewport", async () => {
    setViewport(1000, 1000);
    mockLayout(
      { top: 880, left: 400, right: 520, bottom: 900, width: 120, height: 20 },
      { top: 0, left: 0, right: 220, bottom: 120, width: 220, height: 120 },
    );
    const wrapper = await mountMenu();
    await openMenu(wrapper);

    const top = parseFloat(menu()!.style.top);
    // Anchor bottom is 900 in a 1000px viewport — no room below — so the menu
    // opens above the anchor: 880 - 8 (offset) - 120 (menu height) = 752.
    expect(top).toBe(752);
    expect(top).toBeLessThan(880);
    wrapper.unmount();
  });

  it("drops DOWN when the anchor is near the top of the viewport", async () => {
    setViewport(1000, 1000);
    mockLayout(
      { top: 100, left: 400, right: 520, bottom: 120, width: 120, height: 20 },
      { top: 0, left: 0, right: 220, bottom: 120, width: 220, height: 120 },
    );
    const wrapper = await mountMenu();
    await openMenu(wrapper);

    const top = parseFloat(menu()!.style.top);
    // Anchor bottom is 120 with plenty of room below — menu opens underneath:
    // 120 + 8 (offset) = 128.
    expect(top).toBe(128);
    expect(top).toBeGreaterThan(120);
    wrapper.unmount();
  });

  it("honours an explicit side='top'", async () => {
    setViewport(1000, 1000);
    mockLayout(
      { top: 100, left: 400, right: 520, bottom: 120, width: 120, height: 20 },
      { top: 0, left: 0, right: 220, bottom: 120, width: 220, height: 120 },
    );
    const wrapper = await mountMenu(ITEMS, { side: "top" });
    await openMenu(wrapper);

    // Forced above even though there is room below: 100 - 8 - 120 = -28,
    // clamped to the viewport top margin of 8.
    expect(parseFloat(menu()!.style.top)).toBe(8);
    wrapper.unmount();
  });
});

describe("DropdownMenu — accessibility", () => {
  it("marks the container as a vertical menu and each option as a menuitem", async () => {
    const wrapper = await mountMenu();
    await openMenu(wrapper);
    expect(menu()!.getAttribute("role")).toBe("menu");
    expect(menu()!.getAttribute("aria-orientation")).toBe("vertical");
    const items = itemEls();
    expect(items).toHaveLength(3);
    for (const item of items) {
      expect(item.getAttribute("role")).toBe("menuitem");
    }
    wrapper.unmount();
  });

  it("makes the first option the active roving stop on open", async () => {
    const wrapper = await mountMenu();
    await openMenu(wrapper);
    const items = itemEls();
    expect(items[0].getAttribute("tabindex")).toBe("0");
    expect(items[1].getAttribute("tabindex")).toBe("-1");
    expect(items[2].getAttribute("tabindex")).toBe("-1");
    wrapper.unmount();
  });

  it("moves the active stop with ArrowDown / ArrowUp / Home / End (with wrap)", async () => {
    const wrapper = await mountMenu();
    await openMenu(wrapper);
    const items = itemEls();

    expect(activeStop()).toBe(items[0]);
    press("ArrowDown");
    await nextTick();
    expect(activeStop()).toBe(items[1]);
    press("End");
    await nextTick();
    expect(activeStop()).toBe(items[2]);
    press("Home");
    await nextTick();
    expect(activeStop()).toBe(items[0]);
    // ArrowUp from the first wraps to the last.
    press("ArrowUp");
    await nextTick();
    expect(activeStop()).toBe(items[2]);
    wrapper.unmount();
  });

  it("skips disabled options while navigating", async () => {
    const wrapper = await mountMenu([
      { value: "1", label: "One" },
      { value: "2", label: "Two", disabled: true },
      { value: "3", label: "Three" },
    ]);
    await openMenu(wrapper);
    const items = itemEls();
    press("ArrowDown");
    await nextTick();
    // Skips the disabled middle option and lands on the last.
    expect(items[2].getAttribute("tabindex")).toBe("0");
    wrapper.unmount();
  });
});

describe("DropdownMenu — behaviour", () => {
  it("closes on Tab (the menu is not a modal trap)", async () => {
    const wrapper = await mountMenu();
    await openMenu(wrapper);
    press("Tab");
    expect(wrapper.emitted("close")).toHaveLength(1);
    wrapper.unmount();
  });

  it("closes on Escape", async () => {
    const wrapper = await mountMenu();
    await openMenu(wrapper);
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(wrapper.emitted("close")).toHaveLength(1);
    wrapper.unmount();
  });

  it("selects an enabled option and closes", async () => {
    const wrapper = await mountMenu();
    await openMenu(wrapper);
    await itemEls()[0].click();
    expect(wrapper.emitted("select")).toHaveLength(1);
    expect(wrapper.emitted("close")).toHaveLength(1);
    wrapper.unmount();
  });

  it("ignores a disabled option", async () => {
    const wrapper = await mountMenu([{ value: "1", label: "One", disabled: true }]);
    await openMenu(wrapper);
    await itemEls()[0].click();
    expect(wrapper.emitted("select")).toBeUndefined();
    expect(wrapper.emitted("close")).toBeUndefined();
    wrapper.unmount();
  });
});
