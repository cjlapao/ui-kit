import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ColorSwatches from "./ColorSwatches";

describe("ColorSwatches", () => {
  it("shows the full TrueColors set (condensed) when given nothing", () => {
    const { container } = render(<ColorSwatches />);
    // One layout: all 21 dots mounted, the clip what changes.
    expect(container.querySelectorAll("[title]")).toHaveLength(21);
    expect(screen.getByLabelText("Show 16 more colours")).toBeTruthy();
  });

  it("condenses to maxVisible dots plus a +N chip", () => {
    render(<ColorSwatches colors={["red", "orange", "amber", "yellow", "lime", "green"]} />);
    const chip = screen.getByLabelText("Show 1 more colours");
    expect(chip.getAttribute("aria-expanded")).toBe("false");
  });

  it("is plain and unexpandable when everything fits the count rule", () => {
    render(<ColorSwatches colors={["red", "green", "blue"]} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("the chip expands and collapses, announcing the state", () => {
    const { container } = render(
      <ColorSwatches colors={["red", "green", "blue", "yellow"]} maxVisible={2} />,
    );
    const root = container.firstChild as HTMLElement;
    fireEvent.click(screen.getByLabelText("Show 2 more colours"));
    expect(root.hasAttribute("data-expanded")).toBe(true);
    for (const chip of screen.getAllByRole("button"))
      expect(chip.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByLabelText("Collapse colours"));
    expect(root.hasAttribute("data-expanded")).toBe(false);
  });

  it("opens on hover when expandOn is hover", () => {
    const { container } = render(
      <ColorSwatches expandOn="hover" colors={["red", "green", "blue", "yellow"]} maxVisible={2} />,
    );
    const root = container.firstChild as HTMLElement;
    fireEvent.pointerEnter(root);
    expect(root.hasAttribute("data-expanded")).toBe(true);
    fireEvent.pointerLeave(root);
    expect(root.hasAttribute("data-expanded")).toBe(false);
  });

  it("starts expanded with defaultExpanded", () => {
    const { container } = render(
      <ColorSwatches defaultExpanded colors={["red", "green", "blue", "yellow"]} maxVisible={2} />,
    );
    expect((container.firstChild as HTMLElement).hasAttribute("data-expanded")).toBe(true);
  });

  it("maps size to dot classes and shape to rounding", () => {
    const { container } = render(<ColorSwatches size="lg" shape="square" colors={["red"]} />);
    expect(container.querySelector(".size-7.rounded-md")).toBeTruthy();
  });

  it("shows names only in the expansion, but offers the chip to reveal them", () => {
    render(<ColorSwatches showNames colors={["teal"]} />);
    expect(screen.getByLabelText("Expand colours")).toBeTruthy();
    expect(screen.getAllByText("teal")).toHaveLength(1);
  });

  it("passes attributes through and merges the class", () => {
    render(<ColorSwatches data-testid="cs" className="rounded-lg" colors={["red"]} />);
    const element = screen.getByTestId("cs");
    expect(element.className).toContain("rounded-lg");
    expect(element.className).toContain("relative");
  });
});
