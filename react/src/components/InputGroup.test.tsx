import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InputGroup from "./InputGroup";
import Input from "./Input";
import Select from "./Select";
import { getInputVariantTokens } from "../theme/Theme";
import {
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "../../../common/theme/Theme";

const group = (container: HTMLElement) =>
  container.querySelector("[data-status]")!.className;

describe("InputGroup", () => {
  describe("tones", () => {
    it("renders every tone without crashing", () => {
      // The map had six entries — indigo, blue, emerald, amber, rose, slate —
      // and fell back to `toneTokens.neutral`, which was not one of them. The
      // other fifteen threw `Cannot read properties of undefined (reading
      // 'ring')` on render: a crash, not a wrong colour.
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(
          <InputGroup tone={tone} leadingAddon="@">
            <Input />
          </InputGroup>,
        );
        expect(group(container)).toContain(`outline-${tone}-200/70`);
        unmount();
      }
    });

    it("tints the addon with the tone", () => {
      render(
        <InputGroup tone="violet" leadingAddon="https://">
          <Input />
        </InputGroup>,
      );
      const addon = screen.getByText("https://").className;
      expect(addon).toContain("bg-violet-50/80");
      expect(addon).toContain("border-violet-200");
      expect(addon).toContain("text-violet-700");
    });

    it("accepts `color` as an alias for `tone`", () => {
      const { container } = render(
        <InputGroup color="teal">
          <Input />
        </InputGroup>,
      );
      expect(group(container)).toContain("outline-teal-200/70");
    });
  });

  describe("variant", () => {
    it("offers the same surfaces as Input and SearchBar", () => {
      // The group owns the box — its children render `unstyled` — so without a
      // variant here a group could only ever be an opaque white card.
      for (const variant of INPUT_VARIANTS) {
        const { container, unmount } = render(
          <InputGroup variant={variant}>
            <Input />
          </InputGroup>,
        );
        const tokens = getInputVariantTokens(variant);
        for (const expected of tokens.surface.split(/\s+/)) {
          expect(group(container).split(/\s+/)).toContain(expected);
        }
        unmount();
      }
    });
  });

  describe("size", () => {
    it("offers the whole shared control scale", () => {
      // Was a local "sm" | "md" | "lg", so a group could not match an `xs` or
      // `xl` Button beside it.
      for (const size of CONTROL_SIZES) {
        const { unmount } = render(
          <InputGroup size={size} leadingAddon="@">
            <Input />
          </InputGroup>,
        );
        unmount();
      }
    });

    it("gives the addon one type size, not two", () => {
      // The base class string carried a fixed `text-sm` next to the size
      // token's own `text-*`; at `lg` the winner was decided by emission order.
      render(
        <InputGroup size="lg" leadingAddon="@">
          <Input />
        </InputGroup>,
      );
      const tokens = screen
        .getByText("@")
        .className.split(/\s+/)
        .filter((token) => token.startsWith("text-") && !token.includes("-500"));
      expect(tokens.filter((t) => /^text-(xs|sm|base|lg)$/.test(t))).toEqual([
        "text-base",
      ]);
    });
  });

  describe("children", () => {
    it("strips the child's own surface so the group owns the box", () => {
      render(
        <InputGroup>
          <Input placeholder="p" />
        </InputGroup>,
      );
      expect(screen.getByPlaceholderText("p").className).not.toContain(
        "border-neutral-300",
      );
    });

    it("passes the size down, and lets the group own the focus ring", () => {
      const { container } = render(
        <InputGroup tone="amber" size="xs">
          <Input placeholder="p" />
        </InputGroup>,
      );
      const field = container.querySelector("span.group")!.className;
      expect(field).toContain("px-2");
      // The child is `unstyled`, so it paints no ring of its own — two nested
      // focus rings on the same click would read as a double border.
      expect(field).not.toContain("focus-within:ring");
      expect(group(container)).toContain("focus-within:outline-amber-400");
    });

    it("actually disables the children, not just the opacity", () => {
      // `disabled` used to stop at the group's `opacity-60`, leaving a dimmed
      // field the user could still type into.
      render(
        <InputGroup disabled>
          <Input placeholder="p" />
        </InputGroup>,
      );
      expect(
        (screen.getByPlaceholderText("p") as HTMLInputElement).disabled,
      ).toBe(true);
    });

    it("lets one child stay disabled inside an enabled group", () => {
      render(
        <InputGroup>
          <Input placeholder="p" disabled />
        </InputGroup>,
      );
      expect(
        (screen.getByPlaceholderText("p") as HTMLInputElement).disabled,
      ).toBe(true);
    });

    it("leaves a non-field child alone", () => {
      render(
        <InputGroup>
          <span data-testid="plain">not a field</span>
        </InputGroup>,
      );
      expect(screen.getByTestId("plain").textContent).toBe("not a field");
    });

    it("attaches to a Select too", () => {
      render(
        <InputGroup tone="rose">
          <Select aria-label="s">
            <option>a</option>
          </Select>
        </InputGroup>,
      );
      expect(screen.getByLabelText("s")).toBeTruthy();
    });
  });

  describe("focus indicator", () => {
    it("draws the edge as an outline, not a ring", () => {
      // A ring is painted in the element's own background layer, so the addons
      // — flush against the edges with opaque fills of their own — painted
      // straight over it. The focus showed only in the gap between them, as a
      // bar across the middle rather than an edge around the control.
      const { container } = render(
        <InputGroup leadingAddon="@">
          <Input />
        </InputGroup>,
      );
      expect(group(container)).toContain("focus-within:outline-2");
      expect(group(container)).not.toMatch(/\bring-\d/);
    });

    it("insets the outline so it follows the rounded corner", () => {
      const { container } = render(
        <InputGroup>
          <Input />
        </InputGroup>,
      );
      expect(group(container)).toContain("-outline-offset-1");
      expect(group(container)).toContain("focus-within:-outline-offset-2");
    });

    it("puts underline's focus on its bottom rule instead", () => {
      // A full rectangle around an underline group contradicts the variant —
      // it is what a standalone underline field deliberately avoids.
      const { container } = render(
        <InputGroup variant="underline" tone="violet">
          <Input />
        </InputGroup>,
      );
      expect(group(container)).not.toContain("outline");
      expect(group(container)).toContain("focus-within:border-violet-400");
    });

    it("gives underline a bottom-rule error too", () => {
      const { container } = render(
        <InputGroup variant="underline" validationStatus="error">
          <Input />
        </InputGroup>,
      );
      expect(group(container)).toContain("border-rose-500");
      expect(group(container)).not.toContain("outline-rose");
    });
  });

  describe("validation", () => {
    it("replaces the tone ring rather than stacking on it", () => {
      const { container } = render(
        <InputGroup tone="violet" validationStatus="error">
          <Input />
        </InputGroup>,
      );
      expect(group(container)).toContain("outline-rose-400/70");
      expect(group(container)).not.toContain("outline-violet-200/70");
    });

    it("records the state for styling hooks", () => {
      const { container } = render(
        <InputGroup validationStatus="success" disabled>
          <Input />
        </InputGroup>,
      );
      const root = container.querySelector("[data-status]")!;
      expect(root.getAttribute("data-status")).toBe("success");
      expect(root.getAttribute("data-disabled")).toBe("true");
    });
  });
});
