import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MultiToggle from "./MultiToggle";
import { MULTI_TOGGLE_INDICATORS } from "./MultiToggle";
import {
  CONTROL_SIZES,
  SURFACE_VARIANTS,
  TRUE_COLORS,
  getMultiToggleVariantTokens,
  getSurfaceVariantClasses,
} from "../theme/Theme";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
];

const setup = (props: Record<string, unknown> = {}) => {
  const onChange = vi.fn();
  const utils = render(
    <MultiToggle
      options={OPTIONS}
      value={(props.value as string) ?? "a"}
      onChange={onChange}
      {...props}
    />,
  );
  return { ...utils, onChange };
};

describe("MultiToggle", () => {
  describe("tones", () => {
    it("takes every tone from the generated theme tokens, with no drift", () => {
      // The 21-entry local map had `green` painting *emerald* classes and
      // `red` painting *rose* — so those two tones rendered as their
      // neighbours while every other tone was correct.
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = setup({ tone });
        const tokens = getMultiToggleVariantTokens(tone);
        expect(container.innerHTML).toContain(tokens.activeText.split(" ")[0]);
        unmount();
      }
    });

    it("resolves `green` to green and `red` to red", () => {
      const { container: green, unmount } = setup({ tone: "green" });
      expect(green.innerHTML).toContain("text-green-600");
      expect(green.innerHTML).not.toContain("text-emerald-600");
      unmount();
      const { container: red } = setup({ tone: "red" });
      expect(red.innerHTML).toContain("text-red-600");
      expect(red.innerHTML).not.toContain("text-rose-600");
    });

    it("still accepts `color` as the old name for `tone`", () => {
      const { container } = setup({ color: "fuchsia" });
      expect(container.innerHTML).toContain("fuchsia");
    });
  });

  describe("variants", () => {
    it("takes the Panel surface family, matching Panel at the same tone", () => {
      // The track is a surface, so it belongs to the same family — it used to
      // have a component-local `theme | solid | soft` that described the
      // *indicator* and matched nothing else in the kit.
      expect(SURFACE_VARIANTS).toContain("glass");
      for (const variant of SURFACE_VARIANTS) {
        const { container, unmount } = setup({ variant, tone: "violet" });
        const track = container.querySelector('[role="radiogroup"]')!;
        // Every class Panel would put on this surface is present.
        for (const cls of getSurfaceVariantClasses(variant, "violet").split(" ")) {
          if (cls) expect(track.className).toContain(cls);
        }
        unmount();
      }
    });

    it("draws the active segment three ways, independently of the track", () => {
      const { container: solid, unmount } = setup({ indicator: "solid" });
      expect(solid.innerHTML).toContain("bg-white");
      unmount();
      const { container: soft, unmount: u2 } = setup({
        indicator: "soft",
        tone: "violet",
      });
      expect(soft.innerHTML).toContain("bg-violet-100");
      u2();
      const { container: tonal } = setup({ indicator: "tonal", tone: "violet" });
      expect(tonal.innerHTML).toContain("bg-violet-500/15");
    });

    it("gives every indicator a tone-following edge", () => {
      // A white pill on a light track with only a soft shadow was nearly
      // invisible — the selection read as "the blue label" rather than as a
      // moved pill. And `border` with no colour behind it resolves to
      // `currentColor`, which painted a near-black rule around a blue pill.
      for (const indicator of MULTI_TOGGLE_INDICATORS) {
        const { container, unmount } = setup({ indicator, tone: "violet" });
        const pill = container.querySelector<HTMLElement>(
          ".pointer-events-none > span",
        )!;
        expect(pill.className).toContain("border");
        // The colour is always spelled out, never left to currentColor.
        expect(pill.className).toMatch(/border-violet-\d{3}/);
        unmount();
      }
    });

    it("never leaves a border width without a colour", () => {
      // The failure mode this guards: `border` present, `border-{tone}-*`
      // absent, so the rule falls back to the inherited text colour.
      for (const indicator of MULTI_TOGGLE_INDICATORS) {
        for (const tone of ["blue", "red", "emerald"] as const) {
          const { container, unmount } = setup({ indicator, tone });
          const pill = container.querySelector<HTMLElement>(
            ".pointer-events-none > span",
          )!;
          const classes = pill.className.split(" ");
          if (classes.includes("border")) {
            expect(
              classes.some((c) => c.startsWith(`border-${tone}-`)),
            ).toBe(true);
          }
          unmount();
        }
      }
    });

    it("takes its copy colour from the surface, so glass stays readable", () => {
      // Was a hardcoded `text-neutral-600 dark:text-neutral-300`, which is
      // unreadable on a glass track over a photo.
      const { container } = setup({ variant: "glass" });
      expect(container.innerHTML).toContain("text-neutral-800");
    });
  });

  describe("sizes", () => {
    it("takes every control size", () => {
      for (const size of CONTROL_SIZES) {
        const { unmount } = setup({ size });
        expect(screen.getAllByRole("radio")).toHaveLength(3);
        unmount();
      }
      expect(CONTROL_SIZES).toContain("xs");
      expect(CONTROL_SIZES).toContain("xl");
    });
  });

  describe("a11y", () => {
    it("announces state once, as a radio", () => {
      // It carried `aria-checked` *and* `aria-pressed` — a radio's state and a
      // toggle button's state, in two vocabularies, on one element.
      setup();
      const radios = screen.getAllByRole("radio");
      expect(radios[0].getAttribute("aria-checked")).toBe("true");
      expect(radios[0].hasAttribute("aria-pressed")).toBe(false);
    });

    it("moves the selection with the arrow keys", () => {
      // The roving tabindex was already there, but no key handler was — so a
      // keyboard user could focus the group and never change the selection.
      const { onChange } = setup({ value: "a" });
      fireEvent.keyDown(screen.getAllByRole("radio")[0], {
        key: "ArrowRight",
      });
      expect(onChange).toHaveBeenCalledWith("b");
    });

    it("wraps at both ends", () => {
      const { onChange } = setup({ value: "a" });
      fireEvent.keyDown(screen.getAllByRole("radio")[0], { key: "ArrowLeft" });
      expect(onChange).toHaveBeenCalledWith("c");
    });

    it("jumps with Home and End", () => {
      const { onChange } = setup({ value: "b" });
      const radios = screen.getAllByRole("radio");
      fireEvent.keyDown(radios[1], { key: "End" });
      expect(onChange).toHaveBeenCalledWith("c");
      fireEvent.keyDown(radios[1], { key: "Home" });
      expect(onChange).toHaveBeenCalledWith("a");
    });

    it("steps over a disabled option", () => {
      const onChange = vi.fn();
      render(
        <MultiToggle
          options={[
            { value: "a", label: "A" },
            { value: "b", label: "B", disabled: true },
            { value: "c", label: "C" },
          ]}
          value="a"
          onChange={onChange}
        />,
      );
      fireEvent.keyDown(screen.getAllByRole("radio")[0], { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith("c");
    });
  });

  describe("native props", () => {
    it("puts an id on the group, not on every option", () => {
      // Spread onto each button, an `id` was duplicated once per option and a
      // caller's `onClick` replaced each option's own handler.
      const { container } = setup({ id: "toggle-1" });
      expect(container.querySelectorAll("#toggle-1")).toHaveLength(1);
      expect(
        container.querySelector('[role="radiogroup"]')!.getAttribute("id"),
      ).toBe("toggle-1");
    });

    it("keeps each option's own click handler", () => {
      const { onChange } = setup();
      fireEvent.click(screen.getAllByRole("radio")[1]);
      expect(onChange).toHaveBeenCalledWith("b");
    });
  });
});
