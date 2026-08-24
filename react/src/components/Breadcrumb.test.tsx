import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";
import { TRUE_COLORS } from "../../../common/theme/Theme";
import { Badge } from "./Badge";

const PRODUCTS: BreadcrumbItem[] = [
  { label: "Products", to: "/products" },
  { icon: "Cog", label: "Electronics", to: "/products/electronics" },
  { label: "Laptops", to: "/products/electronics/laptops" },
  { label: "Dell", current: true },
];

const HOME: BreadcrumbItem = {
  icon: "Dashboard",
  to: "/",
  ariaLabel: "Home",
};

const renderBreadcrumb = (
  props: Partial<React.ComponentProps<typeof Breadcrumb>> = {},
) =>
  render(
    <MemoryRouter initialEntries={["/products/electronics/laptops/dell"]}>
      <Breadcrumb home={HOME} items={PRODUCTS} {...props} />
    </MemoryRouter>,
  );

const separators = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('li[aria-hidden="true"]'));

describe("Breadcrumb", () => {
  describe("structure", () => {
    it("renders a labelled nav landmark with an ordered list", () => {
      const { container } = renderBreadcrumb();
      const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
      expect(nav).toBe(container.querySelector("nav"));
      expect(nav.querySelector("ol")).not.toBeNull();
    });

    it("uses the custom ariaLabel", () => {
      renderBreadcrumb({ ariaLabel: "You are here" });
      expect(screen.getByRole("navigation", { name: "You are here" })).toBeDefined();
    });

    it("renders home first, one list item per crumb", () => {
      const { container } = renderBreadcrumb();
      const items = Array.from(
        container.querySelectorAll("ol > li:not([aria-hidden])"),
      );
      expect(items).toHaveLength(5);
      expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    });

    it("renders one separator between adjacent items, hidden from screen readers", () => {
      const { container } = renderBreadcrumb();
      const list = separators(container);
      expect(list).toHaveLength(4);
      list.forEach((li) => expect(li).toHaveAttribute("aria-hidden", "true"));
    });

    it("renders a custom separator", () => {
      const { container } = renderBreadcrumb({ separator: "/" });
      const list = separators(container);
      expect(list.map((li) => li.textContent)).toEqual(["/", "/", "/", "/"]);
    });

    it("renders an icon before the label when the item has one", () => {
      renderBreadcrumb();
      const electronics = screen.getByRole("link", { name: "Electronics" });
      expect(electronics.querySelector("svg")).not.toBeNull();
    });

    it("renders badge content after the label", () => {
      renderBreadcrumb({
        items: [{ label: "Laptops", to: "/laptops", badge: <Badge count={5} /> }],
      });
      expect(screen.getByRole("link", { name: /Laptops/ }).textContent).toContain("5");
    });
  });

  describe("crumb rendering", () => {
    it("renders a router link for items with a path", () => {
      renderBreadcrumb();
      const link = screen.getByRole("link", { name: "Products" });
      expect(link).toHaveAttribute("href", "/products");
    });

    it("renders a plain anchor for items with an href", () => {
      renderBreadcrumb({
        items: [{ label: "External", href: "https://example.com" }],
      });
      const link = screen.getByRole("link", { name: "External" });
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("renders a button for items with only onClick and fires it", () => {
      const onClick = vi.fn();
      renderBreadcrumb({ items: [{ label: "Filter", onClick }] });
      fireEvent.click(screen.getByRole("button", { name: "Filter" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("renders the current crumb as text with aria-current=page", () => {
      const { container } = renderBreadcrumb();
      const dell = screen.getByText("Dell").parentElement as HTMLElement;
      expect(dell).toHaveAttribute("aria-current", "page");
      expect(dell.closest("a")).toBeNull();
      expect(dell.closest("button")).toBeNull();
      expect(container.querySelector('span[aria-current="page"]')).not.toBeNull();
    });

    it("marks an item without any navigation mechanism as plain text", () => {
      const { container } = renderBreadcrumb({
        items: [{ label: "Static" }],
      });
      const static_ = screen.getByText("Static");
      expect(static_.tagName).toBe("SPAN");
      expect(static_.getAttribute("aria-current")).toBeNull();
      expect(container.querySelector('a[href*="static" i]')).toBeNull();
    });

    it("gives icon-only items their accessible name", () => {
      renderBreadcrumb({
        items: [{ icon: "Dots", to: "/more", ariaLabel: "More" }],
      });
      expect(screen.getByRole("link", { name: "More" })).toHaveAttribute(
        "href",
        "/more",
      );
    });

    it("tints link hover and the current crumb with the colour", () => {
      for (const color of ["blue", "emerald", "rose"] as const) {
        const { unmount } = renderBreadcrumb({ color });
        const products = screen.getByRole("link", { name: "Products" });
        expect(products.className).toContain(`hover:text-${color}-600`);
        expect(products.className).toContain(`focus-visible:ring-${color}-400`);
        expect((screen.getByText("Dell").parentElement as HTMLElement).className).toContain(
          `text-${color}-700`,
        );
        unmount();
      }
    });

    it("keeps the full 21-tone set resolvable", () => {
      for (const color of TRUE_COLORS) {
        const { unmount } = renderBreadcrumb({ color });
        expect(
          screen.getByRole("link", { name: "Products" }).className,
        ).toContain(`hover:text-${color}-600`);
        unmount();
      }
    });
  });
});
