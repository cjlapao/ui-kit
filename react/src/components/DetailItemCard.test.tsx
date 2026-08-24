import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DetailItemCard from "./DetailItemCard";
import { SURFACE_VARIANTS } from "../theme/Theme";

const detail = <p>Expanded detail</p>;

describe("DetailItemCard", () => {
  describe("surfaces", () => {
    it.each(SURFACE_VARIANTS)("renders on the %s surface", (variant) => {
      const { container } = render(
        <DetailItemCard title="Item" variant={variant} />,
      );
      expect(
        container.querySelector(`section[data-variant="${variant}"]`),
      ).not.toBeNull();
    });

    it("renders no card by default — it is a row in a list", () => {
      const { container } = render(<DetailItemCard title="Item" />);
      expect(container.querySelector("section[data-variant]")).toBeNull();
      expect(screen.getByText("Item")).toBeTruthy();
    });
  });

  describe("expansion", () => {
    it("shows no toggle without detail", () => {
      render(<DetailItemCard title="Item" />);
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("uses a rotating chevron, not a +/− glyph", () => {
      // The old toggle rendered "+"/"−" with a `rotate-0 : rotate-0` ternary —
      // a transition that could never move.
      const { container } = render(
        <DetailItemCard title="Item">{detail}</DetailItemCard>,
      );
      expect(container.textContent).not.toContain("+");
      expect(container.textContent).not.toContain("−");
      expect(container.querySelector(".rotate-180")).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Expand details" }));
      expect(container.querySelector(".rotate-180")).not.toBeNull();
    });

    it("is uncontrolled by default", () => {
      render(
        <DetailItemCard title="Item" defaultExpanded>
          {detail}
        </DetailItemCard>,
      );
      const toggle = screen.getByRole("button", { name: "Collapse details" });
      expect(toggle.getAttribute("aria-expanded")).toBe("true");

      fireEvent.click(toggle);
      expect(
        screen.getByRole("button", { name: "Expand details" }).getAttribute(
          "aria-expanded",
        ),
      ).toBe("false");
    });

    it("stays controlled when `expanded` is supplied", () => {
      const onToggle = vi.fn();
      render(
        <DetailItemCard title="Item" expanded={false} onToggle={onToggle}>
          {detail}
        </DetailItemCard>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Expand details" }));
      expect(onToggle).toHaveBeenCalledWith(true);
      // The parent owns the state, so nothing moves until it says so.
      expect(
        screen.getByRole("button", { name: "Expand details" }),
      ).toBeTruthy();
    });

    it("keeps the region inert while collapsed rather than unmounting it", () => {
      const { container, rerender } = render(
        <DetailItemCard title="Item" expanded={false}>
          {detail}
        </DetailItemCard>,
      );
      const region = () => container.querySelector('[role="region"]')!;
      expect(region().hasAttribute("inert")).toBe(true);
      expect(region().getAttribute("aria-hidden")).toBe("true");

      rerender(
        <DetailItemCard title="Item" expanded>
          {detail}
        </DetailItemCard>,
      );
      expect(region().hasAttribute("inert")).toBe(false);
    });

    it("points aria-controls at the region", () => {
      const { container } = render(
        <DetailItemCard title="Item">{detail}</DetailItemCard>,
      );
      const id = screen.getByRole("button").getAttribute("aria-controls");
      expect(container.querySelector(`#${CSS.escape(id!)}`)).not.toBeNull();
    });

    it("gives each card its own ids", () => {
      const { container } = render(
        <>
          <DetailItemCard title="One">{detail}</DetailItemCard>
          <DetailItemCard title="Two">{detail}</DetailItemCard>
        </>,
      );
      const ids = [...container.querySelectorAll("[aria-controls]")].map((el) =>
        el.getAttribute("aria-controls"),
      );
      expect(new Set(ids).size).toBe(2);
    });
  });

  describe("row activation", () => {
    it("is reachable by keyboard when clickable", () => {
      // `onClick` used to sit on a plain div: no role, no tabindex, no key
      // handler — the whole row was unreachable without a mouse.
      const onClick = vi.fn();
      render(<DetailItemCard title="Item" onClick={onClick} />);
      const row = screen.getByRole("button", { name: "Item" });
      expect(row.getAttribute("tabindex")).toBe("0");

      fireEvent.keyDown(row, { key: "Enter" });
      fireEvent.keyDown(row, { key: " " });
      fireEvent.click(row);
      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it("is not a button when it does nothing", () => {
      render(<DetailItemCard title="Item" />);
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("does not activate the row when the toggle is used", () => {
      const onClick = vi.fn();
      render(
        <DetailItemCard title="Item" onClick={onClick}>
          {detail}
        </DetailItemCard>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Expand details" }));
      expect(onClick).not.toHaveBeenCalled();

      // And a key press inside the toggle must not bubble into the row's own
      // handler either.
      fireEvent.keyDown(screen.getByRole("button", { name: "Collapse details" }), {
        key: "Enter",
      });
      expect(onClick).not.toHaveBeenCalled();
    });

    it("does nothing while disabled", () => {
      const onClick = vi.fn();
      render(<DetailItemCard title="Item" onClick={onClick} disabled />);
      expect(screen.queryByRole("button", { name: "Item" })).toBeNull();
    });
  });

  describe("badges", () => {
    it.each(["right", "bottom", "bottom-end"] as const)(
      "places badges %s",
      (badgesAlignment) => {
        render(
          <DetailItemCard
            title="Item"
            badgesAlignment={badgesAlignment}
            badges={<span>Badge</span>}
          />,
        );
        expect(screen.getByText("Badge")).toBeTruthy();
      },
    );

    it("renders no badge container when there are none", () => {
      const { container } = render(<DetailItemCard title="Item" />);
      expect(container.querySelectorAll("div").length).toBeLessThan(6);
    });
  });
});
