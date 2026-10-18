import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Pill, { PILL_VARIANTS } from "./Pill";
import { TRUE_COLORS } from "../theme/Theme";

const root = (container: HTMLElement) =>
  container.firstElementChild as HTMLElement;

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

describe("Pill", () => {
  describe("dot", () => {
    it("is a dot, not a full-size lozenge", () => {
      // `dot` used to apply the size token *and* `h-2 px-0` to cancel it. Two
      // utilities at the same specificity, so emission order decided — and
      // `.h-6` is emitted after `.h-2`, so the pill kept its full height.
      const { container } = render(<Pill dot size="md" />);
      const classes = root(container).className;
      expect(classes).toContain("h-2.5");
      expect(classes).not.toContain("h-6");
      expect(classes).not.toContain("px-3");
    });

    it("steps with size", () => {
      const seen = new Set<string>();
      for (const size of SIZES) {
        const { container, unmount } = render(<Pill dot size={size} />);
        seen.add(root(container).className.match(/h-[\d.]+/)![0]);
        unmount();
      }
      expect(seen.size).toBe(5);
    });

    it("drops content so it stays a dot", () => {
      const { container } = render(
        <Pill dot icon="Add" onRemove={() => {}}>
          Label
        </Pill>,
      );
      expect(container.textContent).toBe("");
      expect(container.querySelector("button")).toBeNull();
    });

    it("is decoration unless given a label", () => {
      const { container } = render(<Pill dot />);
      expect(root(container).getAttribute("aria-hidden")).toBe("true");

      render(<Pill dot label="Online" />);
      expect(screen.getByRole("img", { name: "Online" })).toBeTruthy();
    });
  });

  describe("variants, tones and sizes", () => {
    it.each(PILL_VARIANTS)("renders the %s variant", (variant) => {
      const { container } = render(
        <Pill variant={variant} tone="violet">
          x
        </Pill>,
      );
      const classes = root(container).className;
      if (variant === "solid") expect(classes).toContain("bg-violet-500");
      if (variant === "soft") expect(classes).toContain("bg-violet-50");
      if (variant === "outline") expect(classes).toContain("border-violet-200");
    });

    it.each(TRUE_COLORS)("accepts tone %s", (tone) => {
      expect(() => render(<Pill tone={tone}>x</Pill>)).not.toThrow();
    });

    it("gained xl on the shared control scale", () => {
      const { container } = render(<Pill size="xl">x</Pill>);
      expect(root(container).className).toContain("h-8");
    });
  });

  describe("glass variants", () => {
    it.each(["glass", "liquid-glass"] as const)(
      "%s drops the opaque tone fill for a glass surface",
      (variant) => {
        const { container } = render(
          <Pill variant={variant} tone="violet">
            x
          </Pill>,
        );
        const classes = root(container).className.split(/\s+/);
        // The tone map paints a solid fill, so it is skipped entirely. Token
        // check: the glass dark step legitimately carries
        // `dark:bg-violet-500/25` — a substring test would trip on it.
        expect(classes).not.toContain("bg-violet-500");
        expect(classes.some((c) => /^bg-violet-\d+$/.test(c))).toBe(false);
        expect(classes.some((c) => c.startsWith("backdrop-blur"))).toBe(true);
        expect(classes.some((c) => /^bg-violet-200\/\d+$/.test(c))).toBe(true);
      },
    );

    it("gives liquid-glass the heavier blur", () => {
      const { container: glass } = render(<Pill variant="glass">x</Pill>);
      const { container: liquid } = render(
        <Pill variant="liquid-glass">x</Pill>,
      );
      expect(root(glass).className).toContain("backdrop-blur-sm");
      expect(root(liquid).className).toContain("backdrop-blur-md");
    });

    it("gives liquid-glass a specular highlight and plain glass none", () => {
      const { container: liquid } = render(
        <Pill variant="liquid-glass">x</Pill>,
      );
      expect(liquid.querySelector("[aria-hidden='true']")).not.toBeNull();

      const { container: glass } = render(<Pill variant="glass">x</Pill>);
      expect(glass.querySelector("[aria-hidden='true']")).toBeNull();
    });

    it("lets the specular mode be overridden either way", () => {
      const { container: on } = render(
        <Pill variant="glass" specularMode="halo">
          x
        </Pill>,
      );
      expect(on.querySelector("[aria-hidden='true']")).not.toBeNull();

      const { container: off } = render(
        <Pill variant="liquid-glass" specularMode="none">
          x
        </Pill>,
      );
      expect(off.querySelector("[aria-hidden='true']")).toBeNull();
    });

    it("adds hover and focus chrome only when the pill is interactive", () => {
      // A rim that ignites in the tone under the cursor on something you
      // cannot click reads as a broken affordance.
      const { container: staticPill } = render(<Pill variant="glass">x</Pill>);
      expect(root(staticPill).className).not.toContain("hover:border-blue-500");

      const { container: clickable } = render(
        <Pill variant="glass" onClick={() => {}}>
          x
        </Pill>,
      );
      expect(root(clickable).className).toContain("hover:border-blue-500");
      expect(root(clickable).className).toContain("focus-visible:ring-2");
    });

    it("applies to a dot too", () => {
      const { container } = render(<Pill variant="liquid-glass" dot />);
      expect(root(container).className).toContain("backdrop-blur");
    });

    it.each(TRUE_COLORS)("tints a glass pill with tone %s", (tone) => {
      const { container } = render(
        <Pill variant="glass" tone={tone}>
          x
        </Pill>,
      );
      expect(root(container).className).toContain(`bg-${tone}-200/`);
    });
  });

  describe("hover affordance for clickable pills", () => {
    // A pill has no button chrome of its own — the tone hover step IS the
    // affordance. It used to exist only on the glass variants (rim ignite),
    // so a clickable solid/soft/outline pill gave no feedback at all.
    it("solid darkens one step when clickable", () => {
      const { container } = render(
        <Pill variant="solid" tone="blue" onClick={() => {}} />,
      );
      const classes = root(container).className;
      expect(classes).toContain("hover:bg-blue-400");
      expect(classes).toContain("dark:hover:bg-blue-300");
    });

    it("soft and outline gain a translucent wash when clickable", () => {
      const { container } = render(
        <Pill variant="soft" tone="rose" onClick={() => {}} />,
      );
      expect(root(container).className).toContain("hover:bg-rose-100");
      expect(root(container).className).toContain("dark:hover:bg-rose-500/20");

      const { container: outline } = render(
        <Pill variant="outline" tone="amber" onClick={() => {}} />,
      );
      expect(outline.firstElementChild!.className).toContain(
        "hover:bg-amber-100",
      );
    });

    it("never shows the wash when the pill is not activatable", () => {
      const { container } = render(<Pill variant="soft" tone="blue" />);
      expect(root(container).className).not.toMatch(/hover:bg-/);
    });

    it("a removable-but-inert pill stays quiet", () => {
      // `onRemove` alone does not make the WHOLE pill clickable — lighting it
      // up under the cursor would promise a click that does nothing. The
      // remove button carries its own hover.
      const { container } = render(<Pill onRemove={() => {}} />);
      expect(root(container).className).not.toMatch(/hover:bg-/);
      const { container: glass } = render(
        <Pill variant="glass" onRemove={() => {}} />,
      );
      expect(root(glass).className).not.toMatch(/hover:border-blue-500/);
    });

    it("glass still ignites its rim — and only when clickable", () => {
      const { container } = render(
        <Pill variant="glass" tone="blue" onClick={() => {}} />,
      );
      expect(root(container).className).toContain("hover:border-blue-500");

      const { container: plain } = render(<Pill variant="glass" tone="blue" />);
      expect(root(plain).className).not.toMatch(/hover:border-/);
    });

    it("every tone has a hover step", () => {
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(
          <Pill variant="solid" tone={tone} onClick={() => {}} />,
        );
        expect(
          root(container).className,
          `${tone} has no solid hover`,
        ).toContain(`hover:bg-${tone}-400`);
        unmount();
      }
    });
  });

  describe("content", () => {
    it("renders a leading and trailing icon", () => {
      const { container } = render(
        <Pill
          icon={<i data-testid="lead" />}
          trailingIcon={<i data-testid="tail" />}
        >
          Label
        </Pill>,
      );
      expect(container.querySelector('[data-testid="lead"]')).not.toBeNull();
      expect(container.querySelector('[data-testid="tail"]')).not.toBeNull();
      expect(container.textContent).toContain("Label");
    });

    it("truncates when a maxWidth is set", () => {
      const { container } = render(
        <Pill maxWidth={120}>A very long label</Pill>,
      );
      expect(root(container).style.maxWidth).toBe("120px");
      expect(container.querySelector(".truncate")).not.toBeNull();
    });
  });

  describe("interaction", () => {
    it("renders a real button when clickable", () => {
      const onClick = vi.fn();
      render(<Pill onClick={onClick}>Tag</Pill>);
      const button = screen.getByRole("button", { name: "Tag" });
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("is a span otherwise", () => {
      const { container } = render(<Pill>Tag</Pill>);
      expect(root(container).tagName).toBe("SPAN");
    });

    it("removing does not also activate the pill", () => {
      const onClick = vi.fn();
      const onRemove = vi.fn();
      render(
        <Pill onClick={onClick} onRemove={onRemove}>
          Tag
        </Pill>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Remove" }));
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it("disables both the pill and its remove button", () => {
      render(
        <Pill onClick={() => {}} onRemove={() => {}} disabled>
          Tag
        </Pill>,
      );
      expect(screen.getByRole("button", { name: "Tag" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Remove" })).toBeDisabled();
    });
  });
});
