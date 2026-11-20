import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import IconToggleGroup from "./IconToggleGroup";
import {
  CONTROL_SIZES,
  SURFACE_VARIANTS,
  TRUE_COLORS,
  getButtonActiveClasses,
  getButtonColorClasses,
  getSurfaceVariantClasses,
} from "../theme/Theme";

// Same mock IconButton.test uses — the group renders IconButtons, and the
// icon names below are test fixtures, not registry entries.
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn((icon) => icon),
}));

const OPTIONS = [
  { value: "grid", icon: "GridView", label: "Grid" },
  { value: "list", icon: "List", label: "List" },
  { value: "board", icon: "Board", label: "Board" },
];

const setup = (props: Record<string, unknown> = {}) => {
  const onChange = vi.fn();
  const utils = render(
    <IconToggleGroup
      options={OPTIONS}
      value={(props.value as string) ?? "grid"}
      onChange={onChange}
      {...props}
    />,
  );
  return { ...utils, onChange };
};

describe("IconToggleGroup", () => {
  describe("selection", () => {
    it("renders a radiogroup whose active option is the only checked radio", () => {
      setup();
      const group = screen.getByRole("radiogroup");
      const radios = screen.getAllByRole("radio");
      expect(group).toBeInTheDocument();
      expect(radios).toHaveLength(3);
      expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual([
        "true",
        "false",
        "false",
      ]);
      // State is announced once, as a radio — never also as a toggle button.
      expect(radios[0].hasAttribute("aria-pressed")).toBe(false);
    });

    it("selects by clicking an inactive option", () => {
      const { onChange } = setup();
      fireEvent.click(screen.getAllByRole("radio")[1]);
      expect(onChange).toHaveBeenCalledWith("list");
    });

    it("is a no-op on the already-active option", () => {
      const { onChange } = setup();
      fireEvent.click(screen.getAllByRole("radio")[0]);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("is a no-op on a disabled option", () => {
      const { onChange } = setup({
        options: OPTIONS.map((o) =>
          o.value === "list" ? { ...o, disabled: true } : o,
        ),
      });
      const radios = screen.getAllByRole("radio");
      expect(radios[1]).toBeDisabled();
      fireEvent.click(radios[1]);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("disables the whole group", () => {
      setup({ disabled: true });
      expect(screen.getByRole("radiogroup")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      for (const radio of screen.getAllByRole("radio")) {
        expect(radio).toBeDisabled();
      }
    });
  });

  describe("keyboard", () => {
    it("has exactly one tab stop — the selected option", () => {
      setup();
      expect(screen.getAllByRole("radio").map((r) => r.tabIndex)).toEqual([
        0, -1, -1,
      ]);
    });

    it("moves the selection with the arrow keys", () => {
      const { onChange } = setup({ value: "grid" });
      fireEvent.keyDown(screen.getAllByRole("radio")[0], {
        key: "ArrowRight",
      });
      expect(onChange).toHaveBeenCalledWith("list");
    });

    it("wraps at both ends", () => {
      const { onChange } = setup({ value: "grid" });
      fireEvent.keyDown(screen.getAllByRole("radio")[0], { key: "ArrowLeft" });
      expect(onChange).toHaveBeenCalledWith("board");
    });

    it("jumps with Home and End", () => {
      const { onChange } = setup({ value: "list" });
      const radios = screen.getAllByRole("radio");
      fireEvent.keyDown(radios[1], { key: "End" });
      expect(onChange).toHaveBeenCalledWith("board");
      fireEvent.keyDown(radios[1], { key: "Home" });
      expect(onChange).toHaveBeenCalledWith("grid");
    });

    it("steps over a disabled option", () => {
      const { onChange } = setup({
        options: OPTIONS.map((o) =>
          o.value === "list" ? { ...o, disabled: true } : o,
        ),
      });
      fireEvent.keyDown(screen.getAllByRole("radio")[0], {
        key: "ArrowRight",
      });
      expect(onChange).toHaveBeenCalledWith("board");
    });
  });

  describe("the outside panel", () => {
    it("takes the Panel surface family, matching Panel at the same tone", () => {
      for (const variant of SURFACE_VARIANTS) {
        const { container, unmount } = setup({ variant, tone: "violet" });
        const track = container.querySelector('[role="radiogroup"]')!;
        if (variant === "none") {
          // On a track, `none` means no track at all — not the flat tinted
          // fill the shared getter reads it as for a Panel.
          const tokens = track.className.split(" ");
          expect(tokens.some((t) => t.startsWith("bg-"))).toBe(false);
          expect(tokens.some((t) => t.startsWith("ring-"))).toBe(false);
          expect(tokens.some((t) => t.startsWith("border"))).toBe(false);
          expect(tokens.some((t) => t.startsWith("shadow"))).toBe(false);
          unmount();
          continue;
        }
        for (const cls of getSurfaceVariantClasses(variant, "violet").split(
          " ",
        )) {
          if (cls) expect(track.className).toContain(cls);
        }
        unmount();
      }
    });

    it("renders the resting options as the chosen button variant", () => {
      const { unmount } = setup({ buttonVariant: "soft" });
      const [active, ...inactive] = screen.getAllByRole("radio");
      // The selection always wears the icon on-tile…
      expect(active).toHaveAttribute("data-variant", "icon");
      // …the resting row takes the chosen variant.
      for (const radio of inactive) {
        expect(radio).toHaveAttribute("data-variant", "soft");
      }
      unmount();
      setup();
      const [defaultActive, ...defaultInactive] = screen.getAllByRole("radio");
      expect(defaultActive).toHaveAttribute("data-variant", "icon");
      for (const radio of defaultInactive) {
        expect(radio).toHaveAttribute("data-variant", "ghost");
      }
    });

    it("carries no indicator, no spring and no measurement machinery", () => {
      // The whole point of the icon sibling: the selected IconButton paints
      // itself, so none of MultiToggle's geometry survives here.
      const { container } = setup();
      expect(container.querySelector(".multi-toggle-indicator")).toBeNull();
      const group = container.querySelector<HTMLElement>(
        '[role="radiogroup"]',
      )!;
      expect(group.style.getPropertyValue("--mt-spring-duration")).toBe("");
      expect(group.style.getPropertyValue("--mt-offset")).toBe("");
    });
  });

  describe("active state", () => {
    it("paints the active option from the shared theme, with no drift, on every tone", () => {
      for (const tone of TRUE_COLORS) {
        const { unmount } = setup({ tone });
        const active = screen.getAllByRole("radio")[0];
        for (const token of getButtonActiveClasses("icon", tone).split(" ")) {
          expect(active.className).toContain(token);
        }
        unmount();
      }
    });

    it("keeps the inactive options flat and out of the active paint", () => {
      setup({ tone: "blue" });
      const inactive = screen.getAllByRole("radio")[1];
      const tokens = inactive.className.split(" ");
      // Resting = the button variant's own classes (ghost: flat, tinted,
      // tone hover)…
      for (const token of getButtonColorClasses("ghost", "blue").split(" ")) {
        expect(tokens).toContain(token);
      }
      // …and none of the selected option's solid tile may leak onto them.
      expect(tokens).not.toContain("bg-blue-700");
      expect(tokens).not.toContain("dark:bg-blue-400");
      expect(tokens).not.toContain("text-white");
    });

    it("targets only the active option with accentTone", () => {
      setup({ accentTone: "orange" });
      const [active, ...inactive] = screen.getAllByRole("radio");
      expect(active.className).toContain(
        getButtonActiveClasses("icon", "orange").split(" ")[0],
      );
      for (const button of inactive) {
        expect(button.className).not.toContain("bg-orange-100");
      }
    });

    it("re-supplies a focus ring on the active option, which the active slot drops", () => {
      setup();
      const [active, inactive] = screen.getAllByRole("radio");
      expect(active.className).toMatch(/focus-visible:ring-/);
      // Inactive buttons keep the variant's own ring — the group must not
      // stack a second ring colour onto it.
      expect(inactive.className).toMatch(/focus-visible:ring-/);
    });
  });

  describe("sizes and layout", () => {
    it("takes every control size", () => {
      for (const size of CONTROL_SIZES) {
        const { unmount } = setup({ size });
        expect(screen.getAllByRole("radio")).toHaveLength(3);
        unmount();
      }
      expect(CONTROL_SIZES).toContain("xs");
      expect(CONTROL_SIZES).toContain("xl");
    });

    it("shares the parent width evenly under fullWidth", () => {
      setup({ fullWidth: true });
      for (const radio of screen.getAllByRole("radio")) {
        expect(radio.className).toContain("flex-1");
      }
    });
  });

  describe("naming", () => {
    it("names each option label → tooltip → value", () => {
      const { rerender } = setup();
      expect(screen.getAllByRole("radio")[0]).toHaveAttribute(
        "aria-label",
        "Grid",
      );

      rerender(
        <IconToggleGroup
          options={[{ value: "grid", icon: "GridView", tooltip: "Grid view" }]}
          value="grid"
          onChange={() => {}}
        />,
      );
      expect(screen.getAllByRole("radio")[0]).toHaveAttribute(
        "aria-label",
        "Grid view",
      );

      rerender(
        <IconToggleGroup
          options={[{ value: "grid", icon: "GridView" }]}
          value="grid"
          onChange={() => {}}
        />,
      );
      expect(screen.getAllByRole("radio")[0]).toHaveAttribute(
        "aria-label",
        "grid",
      );
    });
  });

  describe("native props", () => {
    it("puts an id on the group, not on every option", () => {
      setup({ id: "view-picker" });
      expect(document.querySelectorAll("#view-picker")).toHaveLength(1);
      expect(screen.getByRole("radiogroup")).toHaveAttribute(
        "id",
        "view-picker",
      );
    });
  });
});
