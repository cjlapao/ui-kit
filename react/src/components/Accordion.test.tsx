import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Accordion, { type AccordionItem } from "./Accordion";
import { CONTROL_SIZES, SURFACE_VARIANTS, TRUE_COLORS } from "../theme/Theme";

const ITEMS: AccordionItem[] = [
  {
    id: "a",
    title: "Alpha",
    subtitle: "First region",
    content: "Alpha content",
  },
  {
    id: "b",
    title: "Beta",
    content: "Beta content",
  },
];

const header = (title: string) =>
  screen.getByRole("button", { name: new RegExp(title) });

describe("Accordion", () => {
  describe("surfaces", () => {
    it.each(SURFACE_VARIANTS)("renders on the %s surface", (variant) => {
      const { container } = render(
        <Accordion items={ITEMS} variant={variant} />,
      );
      expect(container.querySelector(`section[data-variant="${variant}"]`)).not.toBeNull();
    });

    it.each(TRUE_COLORS)("renders with tone %s", (tone) => {
      expect(() => render(<Accordion items={ITEMS} tone={tone} />)).not.toThrow();
    });

    it.each(CONTROL_SIZES)("renders at size %s", (size) => {
      expect(() => render(<Accordion items={ITEMS} size={size} />)).not.toThrow();
    });
  });

  describe("tones actually apply", () => {
    it("drives the header hover and focus ring from the tone, not a neutral fallback", () => {
      // The old table only had a `neutral` entry and fell back to it with a
      // non-null assertion, so twenty of the twenty-one tones did nothing.
      const { container } = render(<Accordion items={ITEMS} tone="emerald" />);
      const headerEl = container.querySelector<HTMLElement>('[role="button"]')!;
      expect(headerEl.className).toContain("hover:bg-emerald-100/40");
      expect(headerEl.className).toContain("focus-visible:ring-emerald-400");
      expect(headerEl.className).not.toContain("bg-neutral-50/50");
    });

    it.each(["rose", "amber", "violet"] as const)(
      "tints the icon chip with %s",
      (tone) => {
        const { container } = render(
          <Accordion items={[{ ...ITEMS[0], icon: "Globe" }]} tone={tone} />,
        );
        const chip = container.querySelector<HTMLElement>(`.bg-${tone}-50`)!;
        expect(chip).not.toBeNull();
        expect(chip.className).toContain(`text-${tone}-700`);
      },
    );

    it("renders the badge as a tone-tinted Pill", () => {
      render(
        <Accordion
          items={[{ id: "a", title: "Alpha", badge: "Primary", content: "x" }]}
          tone="blue"
        />,
      );
      // The tint sits on the Pill's root span, one above the text node.
      const badge = screen.getByText("Primary").parentElement!;
      expect(badge.className).toContain("bg-blue-50");
    });
  });

  describe("toggling", () => {
    it("opens via defaultOpenIds and toggles on click", () => {
      const onItemToggle = vi.fn();
      render(
        <Accordion items={ITEMS} defaultOpenIds={["a"]} onItemToggle={onItemToggle} />,
      );
      const alpha = header("Alpha");
      expect(alpha.getAttribute("aria-expanded")).toBe("true");

      fireEvent.click(alpha);
      expect(alpha.getAttribute("aria-expanded")).toBe("false");
      expect(onItemToggle).toHaveBeenCalledWith("a", false);
    });

    it("is controlled via openIds", () => {
      const onChange = vi.fn();
      render(<Accordion items={ITEMS} openIds={[]} onChange={onChange} />);
      const alpha = header("Alpha");

      fireEvent.click(alpha);
      expect(onChange).toHaveBeenCalledWith(["a"]);
      // The parent owns the state, so nothing moves until it says so.
      expect(alpha.getAttribute("aria-expanded")).toBe("false");
    });

    it("keeps several rows open when multiple", () => {
      const { container } = render(
        <Accordion items={ITEMS} multiple defaultOpenIds={["a", "b"]} />,
      );
      const headers = container.querySelectorAll('[role="button"]');
      expect(headers[0].getAttribute("aria-expanded")).toBe("true");
      expect(headers[1].getAttribute("aria-expanded")).toBe("true");
    });

    it("closes the other row when not multiple", () => {
      const { container } = render(
        <Accordion items={ITEMS} defaultOpenIds={["a"]} />,
      );
      const headers = container.querySelectorAll('[role="button"]');
      fireEvent.click(headers[1]);
      expect(headers[0].getAttribute("aria-expanded")).toBe("false");
      expect(headers[1].getAttribute("aria-expanded")).toBe("true");
    });

    it("toggles on Enter and Space", () => {
      render(<Accordion items={ITEMS} />);
      const alpha = header("Alpha");

      fireEvent.keyDown(alpha, { key: "Enter" });
      expect(alpha.getAttribute("aria-expanded")).toBe("true");

      fireEvent.keyDown(alpha, { key: " " });
      expect(alpha.getAttribute("aria-expanded")).toBe("false");
    });

    it("does not toggle when an action button is activated", () => {
      // The old header had no stopPropagation and no target check, so a click
      // or an Enter on an action fired it AND toggled the row.
      const onAction = vi.fn();
      render(
        <Accordion
          items={[
            {
              id: "a",
              title: "Alpha",
              content: "x",
              actions: (
                <button type="button" onClick={onAction}>
                  Refresh
                </button>
              ),
            },
          ]}
        />,
      );
      const alpha = header("Alpha");
      const action = screen.getByRole("button", { name: "Refresh" });

      fireEvent.click(action);
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(alpha.getAttribute("aria-expanded")).toBe("false");

      fireEvent.keyDown(action, { key: "Enter" });
      expect(alpha.getAttribute("aria-expanded")).toBe("false");
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it("ignores clicks and keys while disabled", () => {
      const onItemToggle = vi.fn();
      render(<Accordion items={ITEMS} disabled onItemToggle={onItemToggle} />);
      const alpha = header("Alpha");
      expect(alpha.getAttribute("aria-disabled")).toBe("true");
      expect(alpha.getAttribute("tabindex")).toBe("-1");

      fireEvent.click(alpha);
      fireEvent.keyDown(alpha, { key: "Enter" });
      expect(onItemToggle).not.toHaveBeenCalled();
      expect(alpha.getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("keyboard navigation", () => {
    it("moves focus between headers with the arrow keys without toggling", () => {
      const onItemToggle = vi.fn();
      render(<Accordion items={ITEMS} onItemToggle={onItemToggle} />);
      const alpha = header("Alpha");
      const beta = header("Beta");

      alpha.focus();
      fireEvent.keyDown(alpha, { key: "ArrowDown" });
      expect(beta).toHaveFocus();

      fireEvent.keyDown(beta, { key: "ArrowUp" });
      expect(alpha).toHaveFocus();

      expect(onItemToggle).not.toHaveBeenCalled();
      expect(alpha.getAttribute("aria-expanded")).toBe("false");
    });

    it("wraps around and skips disabled rows", () => {
      const items = [
        { ...ITEMS[0], disabled: true },
        ITEMS[1],
        { id: "c", title: "Gamma", content: "Gamma content" },
      ];
      render(<Accordion items={items} />);
      const gamma = header("Gamma");
      const beta = header("Beta");

      gamma.focus();
      fireEvent.keyDown(gamma, { key: "ArrowDown" });
      expect(beta).toHaveFocus();
    });

    it("jumps to the first and last headers with Home and End", () => {
      const items = [...ITEMS, { id: "c", title: "Gamma", content: "Gamma content" }];
      render(<Accordion items={items} />);
      const gamma = header("Gamma");

      gamma.focus();
      fireEvent.keyDown(gamma, { key: "Home" });
      expect(header("Alpha")).toHaveFocus();

      fireEvent.keyDown(header("Alpha"), { key: "End" });
      expect(gamma).toHaveFocus();
    });
  });

  describe("content", () => {
    it("animates open with grid rows rather than a guessed max-height", () => {
      const { container } = render(
        <Accordion items={ITEMS} defaultOpenIds={["a"]} />,
      );
      const open = container.querySelector<HTMLElement>(
        '[data-item-id="a"] [data-open="true"]',
      )!;
      const closed = container.querySelector<HTMLElement>(
        '[data-item-id="b"] [data-open="false"]',
      )!;
      expect(open.style.gridTemplateRows).toBe("1fr");
      expect(closed.style.gridTemplateRows).toBe("0fr");
    });

    it("drops the transition entirely when animated={false}", () => {
      // The old code only gated the outer wrapper; the inner grid always
      // transitioned, so `animated={false}` still animated.
      const { container } = render(<Accordion items={ITEMS} animated={false} />);
      const grid = container.querySelector<HTMLElement>('[data-open="false"]')!;
      expect(grid.className).not.toContain("transition-[grid-template-rows,opacity]");
    });

    it("does not emit a dynamic duration class", () => {
      // `duration-[${transitionMs}ms]` is a class Tailwind never sees at build
      // time, so it was never in the stylesheet.
      const { container } = render(<Accordion items={ITEMS} />);
      expect(container.innerHTML).not.toContain("duration-[");
    });

    it("makes the collapsed region inert, not merely invisible", () => {
      const { container } = render(
        <Accordion items={ITEMS} defaultOpenIds={["a"]} />,
      );
      const closed = container.querySelector<HTMLElement>(
        '[data-item-id="b"] [role="region"]',
      )!;
      const open = container.querySelector<HTMLElement>(
        '[data-item-id="a"] [role="region"]',
      )!;
      expect(closed.hasAttribute("inert")).toBe(true);
      expect(closed.getAttribute("aria-hidden")).toBe("true");
      expect(open.hasAttribute("inert")).toBe(false);
      expect(open.getAttribute("aria-hidden")).toBeNull();
    });

    it("labels each region by its own header", () => {
      const { container } = render(<Accordion items={ITEMS} />);
      const regions = container.querySelectorAll('[role="region"]');
      expect(regions.length).toBe(2);
      for (const region of regions) {
        const labelBy = region.getAttribute("aria-labelledby")!;
        expect(labelBy).not.toBe("");
        expect(container.querySelector(`#${CSS.escape(labelBy)}`)).not.toBeNull();
      }
    });
  });

  describe("ids stay unique across instances", () => {
    it("two accordions with the same item ids do not collide", () => {
      // The ids were derived from `item.id` alone, so two instances duplicated
      // every id and each `aria-controls` pointed at the first accordion.
      const { container } = render(
        <>
          <Accordion items={ITEMS} />
          <Accordion items={ITEMS} />
        </>,
      );
      const controls = [
        ...container.querySelectorAll("[aria-controls]"),
      ].map((el) => el.getAttribute("aria-controls"));
      expect(controls.length).toBe(4);
      expect(new Set(controls).size).toBe(4);
      for (const id of controls) {
        expect(container.querySelector(`#${CSS.escape(id!)}`)).not.toBeNull();
      }
    });
  });

  describe("indicators", () => {
    it("is a plain glyph, not a 128px circle", () => {
      // The old version built `h-${32} w-${32}` from a number, and Tailwind's
      // `h-32` is 8rem — a 128px ring around every row.
      const { container } = render(<Accordion items={ITEMS} />);
      const indicator = container.querySelector<HTMLElement>(
        '[data-item-id="a"] [role="button"] > [aria-hidden="true"]',
      )!;
      expect(indicator).not.toBeNull();
      expect(indicator.className).not.toContain("rounded-full");
      expect(indicator.className).not.toMatch(/\bh-\d+/);
      expect(indicator.className).not.toContain("border");
    });

    it("hides the indicator when none", () => {
      const { container } = render(<Accordion items={ITEMS} indicator="none" />);
      expect(
        container.querySelector(
          '[data-item-id="a"] [role="button"] > [aria-hidden="true"]',
        ),
      ).toBeNull();
    });

    it("rotates the plus-minus into a cross when open", () => {
      const { container } = render(
        <Accordion items={ITEMS} indicator="plus-minus" defaultOpenIds={["a"]} />,
      );
      const open = container.querySelector<HTMLElement>(
        '[data-item-id="a"] [role="button"] > [aria-hidden="true"]',
      )!;
      const closed = container.querySelector<HTMLElement>(
        '[data-item-id="b"] [role="button"] > [aria-hidden="true"]',
      )!;
      expect(open.className).toContain("rotate-45");
      expect(closed.className).not.toContain("rotate-45");
    });
  });

  describe("states", () => {
    it("shows an empty state when there are no items", () => {
      render(<Accordion items={[]} />);
      expect(screen.getByText("No items")).toBeTruthy();
    });

    it("covers a loading row", () => {
      render(<Accordion items={[{ ...ITEMS[0], loading: true }]} />);
      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("covers the whole accordion while loading", () => {
      render(<Accordion items={ITEMS} loading />);
      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });
  });
});
