import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";

import Picker from "./Picker.vue";
import TagPicker from "./TagPicker.vue";
import SplitView from "./SplitView.vue";
import { TRUE_COLORS } from "../theme/Theme";

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
