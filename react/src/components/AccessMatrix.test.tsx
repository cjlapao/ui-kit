import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AccessMatrix from "./AccessMatrix";
import type { AccessMatrixPermission } from "./AccessMatrix";
import { SURFACE_VARIANTS } from "../theme";

const PERMS: AccessMatrixPermission[] = [
  { group: "G1", resource: "ResA", action: "View", enabled: true },
  { group: "G1", resource: "ResA", action: "Delete", enabled: false },
  { group: "G1", resource: "ResB", action: "View", enabled: true },
  { group: "G2", resource: "ResA", action: "View", enabled: false },
];

const resACount = () => screen.getAllByText("ResA").length;

describe("AccessMatrix", () => {
  it("renders group headers, rows, and one column per unique action", () => {
    const { container } = render(<AccessMatrix permissions={PERMS} />);
    expect(screen.getByText("G1")).toBeTruthy();
    expect(screen.getByText("G2")).toBeTruthy();
    // "ResA" appears once under G1 and once under G2
    expect(resACount()).toBe(2);
    // action column headers
    expect(screen.getByText("View")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
    // it renders through Table → Panel
    expect(container.querySelector("section")).not.toBeNull();
  });

  it("renders every surface variant and forwards it to the panel", () => {
    for (const variant of SURFACE_VARIANTS) {
      const { container, unmount } = render(
        <AccessMatrix permissions={PERMS} variant={variant} />,
      );
      expect(
        container.querySelector("section")?.getAttribute("data-variant"),
      ).toBe(variant);
      unmount();
    }
  });

  it("forwards tone to the panel", () => {
    const { container } = render(<AccessMatrix permissions={PERMS} tone="blue" />);
    expect(container.querySelector("section")?.getAttribute("data-tone")).toBe(
      "blue",
    );
  });

  it("collapses a group when its header is clicked, and expands again", () => {
    render(<AccessMatrix permissions={PERMS} />);
    expect(resACount()).toBe(2); // G1::ResA + G2::ResA
    fireEvent.click(screen.getByText("G1"));
    // G1's rows hidden → only G2::ResA remains
    expect(resACount()).toBe(1);
    fireEvent.click(screen.getByText("G1"));
    expect(resACount()).toBe(2);
  });

  it("limits visible groups and reveals the rest via the Show more button", () => {
    render(<AccessMatrix permissions={PERMS} limit={1} />);
    expect(screen.getByText("G1")).toBeTruthy();
    expect(screen.queryByText("G2")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /show 1 more group/i }));
    expect(screen.getByText("G2")).toBeTruthy();
  });

  it("shows the empty state when there are no permissions", () => {
    render(<AccessMatrix permissions={[]} />);
    expect(screen.getByText("No permissions to display")).toBeTruthy();
  });

  it("applies the stickyBackground prop to normal-row sticky cells (regression)", () => {
    const { container } = render(
      <AccessMatrix permissions={PERMS} stickyBackground="bg-fuchsia-100" />,
    );
    const normalCell = Array.from(container.querySelectorAll("td")).find(
      (td) => td.textContent?.trim() === "ResA",
    );
    expect(normalCell).toBeTruthy();
    expect(normalCell?.className).toContain("bg-fuchsia-100");
    // group-header rows keep their own translucent background, not the prop
    const headerCell = Array.from(container.querySelectorAll("td")).find(
      (td) => td.textContent?.includes("G1"),
    );
    expect(headerCell?.className).not.toContain("bg-fuchsia-100");
  });

  it("accepts density, bordered, corner, and loading without crashing", () => {
    const { container } = render(
      <AccessMatrix
        permissions={PERMS}
        density="compact"
        bordered
        corner="rounded-lg"
        loading
        loadingMessage="Loading matrix…"
      />,
    );
    expect(container.querySelector("section")).not.toBeNull();
    expect(screen.getByText("Loading matrix…")).toBeTruthy();
  });
});
