import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";
import {
  SIDE_MENU_HEADER_FILL,
  SIDE_MENU_HEADER_HEIGHT,
  SIDE_MENU_HEADER_SEAM,
} from "../theme";

const header = () => document.querySelector("header") as HTMLElement;

describe("PageHeader", () => {
  it("renders a header element and passes attributes through", () => {
    render(
      <PageHeader id="ph" data-testid="ph" aria-label="Docs header" />,
    );
    const root = screen.getByTestId("ph");
    expect(root.tagName).toBe("HEADER");
    expect(root.id).toBe("ph");
    expect(root.getAttribute("aria-label")).toBe("Docs header");
  });

  it("lays out start / center / end groups in order", () => {
    render(
      <PageHeader
        start={<button type="button">Brand</button>}
        center={<span>Center</span>}
        end={<button type="button">Toggle</button>}
      />,
    );
    const groups = Array.from(header().children);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toHaveTextContent("Brand");
    expect(groups[1]).toHaveTextContent("Center");
    expect(groups[2]).toHaveTextContent("Toggle");
  });

  it("keeps empty regions in the DOM so an end-only header still parks right", () => {
    render(<PageHeader end={<button type="button">Settings</button>} />);
    const groups = Array.from(header().children);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toBeEmptyDOMElement();
    expect(groups[1]).toBeEmptyDOMElement();
    expect(groups[2]).toHaveTextContent("Settings");
    expect(header().className).toContain("justify-between");
  });

  it("appends children as a fourth group", () => {
    render(
      <PageHeader start={<span>S</span>}>
        <span>Extra</span>
      </PageHeader>,
    );
    const groups = Array.from(header().children);
    expect(groups).toHaveLength(4);
    expect(groups[3]).toHaveTextContent("Extra");
  });

  it("paints exactly the SideMenu header seam — the drift guard", () => {
    render(<PageHeader />);
    const root = header();
    expect(root.className).toContain(SIDE_MENU_HEADER_HEIGHT);
    expect(root.className).toContain(SIDE_MENU_HEADER_SEAM);
    expect(root.className).toContain(SIDE_MENU_HEADER_FILL);
    expect(root.className).toContain("border-b");
  });

  it("merges the caller's class", () => {
    render(<PageHeader className="shadow-sm" />);
    expect(header().className).toContain("shadow-sm");
  });
});
