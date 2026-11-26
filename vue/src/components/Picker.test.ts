import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";

import Picker from "./Picker.vue";
import TagPicker from "./TagPicker.vue";
import SplitView from "./SplitView.vue";
import { POPUP_ROW_WASH, TRUE_COLORS } from "../theme/Theme";

const ITEMS = [
  { id: "a", title: "Alpha" },
  { id: "b", title: "Beta" },
];

describe("Picker", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("paints every tone in its own tone, with no drift", async () => {
    // The 21-entry literal had `red` spelling every class with *rose* and
    // `green` with *emerald*, so those two rendered as their neighbours.
    for (const tone of TRUE_COLORS) {
      const w = mount(Picker, {
        props: { items: ITEMS, color: tone },
        attachTo: document.body,
      });
      await w.get("button").trigger("click");
      expect(document.body.innerHTML).toContain(`ring-${tone}-500/20`);
      w.unmount();
      document.body.innerHTML = "";
    }
  });

  it("resolves `red` to red and `green` to green", async () => {
    const red = mount(Picker, {
      props: { items: ITEMS, color: "red" },
      attachTo: document.body,
    });
    await red.get("button").trigger("click");
    expect(document.body.innerHTML).toContain("border-red-500");
    expect(document.body.innerHTML).not.toContain("border-rose-500");
    red.unmount();
    document.body.innerHTML = "";

    const green = mount(Picker, {
      props: { items: ITEMS, color: "green" },
      attachTo: document.body,
    });
    await green.get("button").trigger("click");
    expect(document.body.innerHTML).toContain("border-green-500");
    expect(document.body.innerHTML).not.toContain("border-emerald-500");
  });
});

describe("TagPicker", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("paints every tone in its own tone, with no drift", async () => {
    for (const tone of TRUE_COLORS) {
      const w = mount(TagPicker, {
        props: {
          items: [{ id: "a", label: "A" }],
          // Vue's TagPicker is v-model based (`modelValue`), where React's
          // takes `value` + `onChange`.
          modelValue: [],
          color: tone,
        },
        attachTo: document.body,
      });
      await w.get("button").trigger("click");
      expect(document.body.innerHTML).toContain(`ring-${tone}-500/20`);
      w.unmount();
      document.body.innerHTML = "";
    }
  });
});

describe("SplitView", () => {
  const items = [
    { id: "a", label: "Alpha", panel: h("p", "A panel") },
    { id: "b", label: "Beta", panel: h("p", "B panel") },
  ];

  it("paints every tone in its own tone", () => {
    for (const tone of TRUE_COLORS) {
      const w = mount(SplitView, { props: { items, color: tone } });
      expect(w.html()).toContain(`border-l-${tone}-600`);
      w.unmount();
    }
  });

  it("no longer aliases stone and neutral to one shared palette", () => {
    // Both used to point at the same `neutralActive` object, so a `stone`
    // SplitView silently rendered neutral — and `neutral` used
    // `border-l-neutral-500` where every other tone used `-600`.
    const stone = mount(SplitView, { props: { items, color: "stone" } });
    expect(stone.html()).toContain("border-l-stone-600");
    expect(stone.html()).not.toContain("border-l-neutral-500");
    expect(stone.html()).not.toContain("border-l-neutral-600");

    const neutral = mount(SplitView, { props: { items, color: "neutral" } });
    expect(neutral.html()).toContain("border-l-neutral-600");
  });
});

describe("Picker — optionHoverTone / optionSelectedTone (popup row washes)", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const open = async (props: Record<string, unknown> = {}) => {
    const w = mount(Picker, {
      props: { items: ITEMS, selectedId: "b", ...props },
      attachTo: document.body,
    });
    await w.get("button").trigger("click");
    return w;
  };
  const rowByTitle = (title: string) =>
    Array.from(document.querySelectorAll("li")).find((li) =>
      li.textContent?.includes(title),
    )!;

  it("unconfigured rows wear the neutral constant, nothing toned", async () => {
    await open();
    const alpha = rowByTitle("Alpha");
    expect(alpha.className.split(" ")).toEqual(
      expect.arrayContaining(POPUP_ROW_WASH.hover.split(" ")),
    );
    expect(alpha.className).not.toMatch(/-500\/15|-50\/60/);
    expect(rowByTitle("Beta").className).toContain("bg-blue-50");
  });

  it("the multi clear row is a row of the list and follows the list", async () => {
    await open({ multi: true, selectedId: undefined, selectedIds: ["b"] });
    const clear = Array.from(document.querySelectorAll("li")).find((li) =>
      li.textContent?.includes("Clear"),
    )!;
    expect(clear.className.split(" ")).toEqual(
      expect.arrayContaining(POPUP_ROW_WASH.hover.split(" ")),
    );
    expect(clear.className).not.toContain("hover:bg-neutral-50");
  });

  it("optionHoverTone tints unchecked rows; the checked row keeps its fill", async () => {
    await open({ optionHoverTone: "rose" });
    const alpha = rowByTitle("Alpha");
    expect(alpha.className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-rose-500/15",
        "dark:hover:bg-rose-500/20",
      ]),
    );
    const beta = rowByTitle("Beta");
    expect(beta.className).toContain("bg-blue-50");
    expect(beta.classList.contains("bg-rose-500/15")).toBe(false);
  });

  it("optionSelectedTone moves fill, copy and ink — and only inside the popup", async () => {
    const w = await open({ optionSelectedTone: "emerald" });
    const beta = rowByTitle("Beta");
    expect(beta.className).toContain("bg-emerald-50");
    // Vue's Picker sets the row title on a <p>, TagPicker on a <span>.
    const label = Array.from(beta.querySelectorAll("p")).find(
      (el) => el.textContent === "Beta",
    )!;
    expect(label.className).toContain("text-emerald-700");
    expect(beta.querySelector('[class*="text-emerald-500"]')).not.toBeNull();
    const triggerClass = w.get("button").attributes("class") ?? "";
    expect(triggerClass).toContain("border-blue-500");
    expect(triggerClass).not.toContain("emerald");
  });

  it('"selected" follows optionSelectedTone, then the field colour', async () => {
    const first = await open({
      optionSelectedTone: "emerald",
      optionHoverTone: "selected",
    });
    expect(rowByTitle("Alpha").className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-emerald-500/15",
        "dark:hover:bg-emerald-500/20",
      ]),
    );
    first.unmount();
    document.body.innerHTML = "";
    await open({ optionHoverTone: "selected" });
    expect(rowByTitle("Alpha").className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-blue-500/15",
        "dark:hover:bg-blue-500/20",
      ]),
    );
  });
});

describe("TagPicker — optionHoverTone / optionSelectedTone (popup row washes)", () => {
  const TAG_ITEMS = [
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
  ];

  afterEach(() => {
    document.body.innerHTML = "";
  });

  const open = async (props: Record<string, unknown> = {}) => {
    const w = mount(TagPicker, {
      props: { items: TAG_ITEMS, modelValue: ["b"], ...props },
      attachTo: document.body,
    });
    await w.get("button").trigger("click");
    return w;
  };
  const optionRow = (label: string) =>
    Array.from(document.querySelectorAll('[role="option"]')).find((li) =>
      li.textContent?.includes(label),
    )!;

  it("unconfigured rows wear the neutral constant — no step, no tone wash", async () => {
    await open();
    const alpha = optionRow("Alpha");
    expect(alpha.className.split(" ")).toEqual(
      expect.arrayContaining(POPUP_ROW_WASH.hover.split(" ")),
    );
    expect(alpha.className).not.toMatch(/-500\/15|-50\/60|bg-neutral-50\b/);
    expect(optionRow("Beta").className).toContain("bg-blue-50");
  });

  it("the cursor wash is the hover wash minus the hover: prefix", async () => {
    const w = await open({ optionHoverTone: "rose" });
    await optionRow("Alpha").dispatchEvent(new Event("mouseenter"));
    await w.vm.$nextTick();
    expect(optionRow("Alpha").className.split(" ")).toEqual(
      expect.arrayContaining(["bg-rose-500/15", "dark:bg-rose-500/20"]),
    );
  });

  it("optionHoverTone tints unchecked rows; the checked row keeps its fill", async () => {
    await open({ optionHoverTone: "rose" });
    expect(optionRow("Alpha").className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-rose-500/15",
        "dark:hover:bg-rose-500/20",
      ]),
    );
    const beta = optionRow("Beta");
    expect(beta.className).toContain("bg-blue-50");
    expect(beta.classList.contains("bg-rose-500/15")).toBe(false);
  });

  it("optionSelectedTone moves fill, copy and ink — and only inside the popup", async () => {
    const w = await open({ optionSelectedTone: "emerald" });
    const beta = optionRow("Beta");
    expect(beta.className).toContain("bg-emerald-50");
    const label = Array.from(beta.querySelectorAll("span")).find(
      (el) => el.textContent === "Beta",
    )!;
    expect(label.className).toContain("text-emerald-700");
    expect(beta.querySelector('[class*="text-emerald-500"]')).not.toBeNull();
    const triggerClass = w.get("button").attributes("class") ?? "";
    expect(triggerClass).toContain("border-blue-500");
    expect(triggerClass).not.toContain("emerald");
  });

  it('"selected" follows optionSelectedTone, then the field colour', async () => {
    const first = await open({
      optionSelectedTone: "emerald",
      optionHoverTone: "selected",
    });
    expect(optionRow("Alpha").className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-emerald-500/15",
        "dark:hover:bg-emerald-500/20",
      ]),
    );
    first.unmount();
    document.body.innerHTML = "";
    await open({ optionHoverTone: "selected" });
    expect(optionRow("Alpha").className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-blue-500/15",
        "dark:hover:bg-blue-500/20",
      ]),
    );
  });
});
