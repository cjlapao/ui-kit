import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import InputGroup from "./InputGroup.vue";
import Input from "./Input.vue";
import Select from "./Select.vue";
import {
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
  getInputVariantTokens,
} from "../theme/Theme";

const mountGroup = (props: Record<string, unknown> = {}, slots?: object) =>
  mount(InputGroup, {
    props,
    slots: slots ?? { default: () => h(Input, { placeholder: "p" }) },
  });

const group = (wrapper: ReturnType<typeof mountGroup>) =>
  wrapper.find("[data-status]").classes().join(" ");

describe("InputGroup", () => {
  describe("tones", () => {
    it("renders every tone without crashing", () => {
      // The map had six entries — indigo, blue, emerald, amber, rose, slate —
      // and fell back to `toneTokens.neutral`, which was not one of them. The
      // other fifteen threw `Cannot read properties of undefined (reading
      // 'ring')` on render: a crash, not a wrong colour.
      for (const tone of TRUE_COLORS) {
        expect(group(mountGroup({ tone, leadingAddon: "@" }))).toContain(
          `outline-${tone}-200/70`,
        );
      }
    });

    it("tints the addon with the tone", () => {
      const wrapper = mountGroup({ tone: "violet", leadingAddon: "https://" });
      const addon = wrapper.find("span").classes().join(" ");
      expect(addon).toContain("bg-violet-50/80");
      expect(addon).toContain("border-violet-200");
      expect(addon).toContain("text-violet-700");
    });

    it("accepts `color` as an alias for `tone`", () => {
      expect(group(mountGroup({ color: "teal" }))).toContain(
        "outline-teal-200/70",
      );
    });
  });

  describe("variant", () => {
    it("offers the same surfaces as Input and SearchBar", () => {
      for (const variant of INPUT_VARIANTS) {
        const classes = group(mountGroup({ variant }));
        for (const expected of getInputVariantTokens(variant).surface.split(
          /\s+/,
        )) {
          expect(classes).toContain(expected);
        }
      }
    });
  });

  describe("size", () => {
    it("offers the whole shared control scale", () => {
      for (const size of CONTROL_SIZES) {
        expect(group(mountGroup({ size, leadingAddon: "@" }))).not.toBe("");
      }
    });

    it("gives the addon one type size, not two", () => {
      // The base class string carried a fixed `text-sm` next to the size
      // token's own `text-*`; at `lg` the winner was decided by emission order.
      const tokens = mountGroup({ size: "lg", leadingAddon: "@" })
        .find("span")
        .classes()
        .filter((token) => /^text-(xs|sm|base|lg)$/.test(token));
      expect(tokens).toEqual(["text-base"]);
    });
  });

  describe("children", () => {
    it("strips the child's own surface so the group owns the box", () => {
      const wrapper = mountGroup();
      expect(wrapper.find("input").classes().join(" ")).not.toContain(
        "border-neutral-300",
      );
    });

    it("passes the size down, and lets the group own the focus ring", () => {
      const wrapper = mountGroup({ tone: "amber", size: "xs" });
      const field = wrapper.find("span.group").classes().join(" ");
      expect(field).toContain("px-2");
      // The child is `unstyled`, so it paints no ring of its own — two nested
      // focus rings on the same click would read as a double border.
      expect(field).not.toContain("focus-within:ring");
      expect(group(wrapper)).toContain("focus-within:outline-amber-400");
    });

    it("actually disables the children, not just the opacity", () => {
      // `disabled` used to stop at the group's `opacity-60`, leaving a dimmed
      // field the user could still type into.
      const wrapper = mountGroup({ disabled: true });
      expect(wrapper.find("input").element.disabled).toBe(true);
    });

    it("lets one child stay disabled inside an enabled group", () => {
      const wrapper = mountGroup(
        {},
        { default: () => h(Input, { placeholder: "p", disabled: true }) },
      );
      expect(wrapper.find("input").element.disabled).toBe(true);
    });

    it("leaves a non-field child alone", () => {
      const wrapper = mountGroup(
        {},
        { default: () => h("span", { "data-testid": "plain" }, "not a field") },
      );
      expect(wrapper.find('[data-testid="plain"]').text()).toBe("not a field");
    });

    it("attaches to a Select too", () => {
      const wrapper = mountGroup(
        { tone: "rose" },
        { default: () => h(Select, {}, () => h("option", "a")) },
      );
      expect(wrapper.find("select").exists()).toBe(true);
    });
  });

  describe("focus indicator", () => {
    it("draws the edge as an outline, not a ring", () => {
      // A ring is painted in the element's own background layer, so the addons
      // — flush against the edges with opaque fills of their own — painted
      // straight over it. The focus showed only in the gap between them, as a
      // bar across the middle rather than an edge around the control.
      const classes = group(mountGroup({ leadingAddon: "@" }));
      expect(classes).toContain("focus-within:outline-2");
      expect(classes).not.toMatch(/\bring-\d/);
    });

    it("insets the outline so it follows the rounded corner", () => {
      const classes = group(mountGroup());
      expect(classes).toContain("-outline-offset-1");
      expect(classes).toContain("focus-within:-outline-offset-2");
    });

    it("puts underline's focus on its bottom rule instead", () => {
      // A full rectangle around an underline group contradicts the variant —
      // it is what a standalone underline field deliberately avoids.
      const classes = group(
        mountGroup({ variant: "underline", tone: "violet" }),
      );
      expect(classes).not.toContain("outline");
      expect(classes).toContain("focus-within:border-violet-400");
    });

    it("gives underline a bottom-rule error too", () => {
      const classes = group(
        mountGroup({ variant: "underline", validationStatus: "error" }),
      );
      expect(classes).toContain("border-rose-500");
      expect(classes).not.toContain("outline-rose");
    });
  });

  describe("validation", () => {
    it("replaces the tone ring rather than stacking on it", () => {
      const classes = group(
        mountGroup({ tone: "violet", validationStatus: "error" }),
      );
      expect(classes).toContain("outline-rose-400/70");
      expect(classes).not.toContain("outline-violet-200/70");
    });

    it("records the state for styling hooks", () => {
      const root = mountGroup({
        validationStatus: "success",
        disabled: true,
      }).find("[data-status]");
      expect(root.attributes("data-status")).toBe("success");
      expect(root.attributes("data-disabled")).toBe("true");
    });
  });
});
