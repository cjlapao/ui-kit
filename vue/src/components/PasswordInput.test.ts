import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import PasswordInput from "./PasswordInput.vue";
import Input from "./Input.vue";
import { CONTROL_SIZES } from "../theme/Theme";

const mountField = (props: Record<string, unknown> = {}, attrs = {}) =>
  mount(PasswordInput, { props, attrs, attachTo: document.body });

const toggle = (w: ReturnType<typeof mountField>, label: string) =>
  w.findAll("button").find((b) => b.attributes("aria-label") === label);

describe("PasswordInput", () => {
  it("starts masked and reveals on the toggle", async () => {
    const w = mountField();
    expect(w.get("input").attributes("type")).toBe("password");
    await toggle(w, "Show password")!.trigger("click");
    expect(w.get("input").attributes("type")).toBe("text");
    await toggle(w, "Hide password")!.trigger("click");
    expect(w.get("input").attributes("type")).toBe("password");
  });

  it("can be controlled", async () => {
    const w = mountField({ revealed: true });
    expect(w.get("input").attributes("type")).toBe("text");
    await toggle(w, "Hide password")!.trigger("click");
    expect(w.emitted("update:revealed")?.[0]).toEqual([false]);
    // Still controlled: it did not flip itself.
    expect(w.get("input").attributes("type")).toBe("text");
  });

  it("drops the toggle when not revealable", () => {
    const w = mountField({ revealable: false });
    expect(toggle(w, "Show password")).toBeUndefined();
  });

  it("drops the toggle on a disabled or read-only field", () => {
    // It used to stay live there, so a disabled password could still be read.
    expect(toggle(mountField({ disabled: true }), "Show password")).toBeUndefined();
    expect(
      toggle(mountField({}, { readonly: true }), "Show password"),
    ).toBeUndefined();
  });

  describe("behaves exactly like Input", () => {
    it("forwards every declared Input prop, not just native attrs", () => {
      // `PasswordInputProps extends InputProps`, so Vue declares all of
      // Input's props on *this* component and strips them from `$attrs`. The
      // template forwarded only `$attrs`, so `size`, `variant`, `tone` and the
      // rest were silently swallowed and Input fell back to its defaults —
      // while `placeholder` still worked, because a native attr falls through.
      const w = mount(PasswordInput, {
        props: {
          size: "xl",
          variant: "underline",
          tone: "rose",
          validationStatus: "error",
        },
      });
      const inner = w.findComponent(Input).props() as Record<string, unknown>;
      expect(inner.size).toBe("xl");
      expect(inner.variant).toBe("underline");
      expect(inner.tone).toBe("rose");
      expect(inner.validationStatus).toBe("error");
    });

    it("still lets Input apply its own defaults for props not passed", () => {
      const w = mount(PasswordInput, {});
      const inner = w.findComponent(Input).props() as Record<string, unknown>;
      expect(inner.size).toBe("md");
      expect(inner.variant).toBe("flat");
    });

    it("still forwards native attributes", () => {
      const w = mount(PasswordInput, {
        props: { placeholder: "Secret" },
        attrs: { autocomplete: "current-password", name: "pw" },
      });
      const field = w.get("input");
      expect(field.attributes("placeholder")).toBe("Secret");
      expect(field.attributes("autocomplete")).toBe("current-password");
      expect(field.attributes("name")).toBe("pw");
    });

    it("renders the same field markup as a bare Input at the same settings", () => {
      // The only intended differences are the type and the reveal button.
      const pw = mount(PasswordInput, {
        props: { size: "lg", variant: "elevated", tone: "violet", revealable: false },
      });
      const plain = mount(Input, {
        props: { size: "lg", variant: "elevated", tone: "violet", type: "password" },
      });
      expect(pw.get("input").attributes("class")).toBe(
        plain.get("input").attributes("class"),
      );
    });
  });

  it("uses a registry glyph that scales with the field", () => {
    for (const size of CONTROL_SIZES) {
      const w = mountField({ size });
      expect(w.html()).not.toContain("w-4 h-4");
      w.unmount();
    }
  });
});
