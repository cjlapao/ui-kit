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

  it("tints the group-header row and sticky cell in the table tone", () => {
    const { container } = render(
      <AccessMatrix permissions={PERMS} tone="rose" hoverable />,
    );
    const headerRow = Array.from(
      container.querySelectorAll("tbody tr"),
    ).find((t) => t.textContent?.includes("G1"))!;
    // group header sits darker than the zebra wash, hover sits darkest
    expect(headerRow.className).toContain("bg-rose-100");
    expect(headerRow.className).toContain("hover:bg-rose-300");
    expect(headerRow.className).toContain("border-rose-100");
    expect(headerRow.className).toContain("dark:border-rose-500/20");
    // the sticky Resource cell keeps the same tone base fill (opaque enough to scroll under)
    const headerCell = Array.from(container.querySelectorAll("td")).find(
      (td) => td.textContent?.includes("G1"),
    )!;
    expect(headerCell.className).toContain("bg-rose-100");
    expect(headerCell.className).toContain("dark:bg-rose-500/20");
    // and paints the bold GROUP hover (not a data-row hover) so the whole
    // row shifts as one
    expect(headerCell.className).toContain("group-hover:bg-rose-300");
    expect(headerCell.className).toContain(
      "dark:group-hover:bg-rose-500/35",
    );
  });

  it("keeps the group-row hover uniform on the sticky cell even when not hoverable", () => {
    // hoverable defaults to false: data rows get no hover fill, but the
    // group row is a control and must still shift as one — its sticky cell
    // carries the group-hover fill so the tr's hover doesn't only show
    // through the transparent cells to its right.
    const { container } = render(
      <AccessMatrix permissions={PERMS} tone="rose" />,
    );
    const headerCell = Array.from(container.querySelectorAll("td")).find(
      (td) => td.textContent?.includes("G1"),
    )!;
    expect(headerCell.className).toContain("bg-rose-100");
    expect(headerCell.className).toContain("group-hover:bg-rose-300");
    expect(headerCell.className).toContain("dark:group-hover:bg-rose-500/35");
    // the cell must transition in lockstep with the row (same class the tr
    // uses) or the two paint layers tear during the 150ms hover fill
    expect(headerCell.className).toContain("transition-colors");
    expect(headerCell.className).toContain("ease-out");
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

  it("forwards loaderType=progress with loaderProgress to the table", () => {
    const { container } = render(
      <AccessMatrix
        permissions={PERMS}
        loading
        loaderType="progress"
        loaderProgress={42}
      />,
    );
    // the progress bar reports its value to the accessibility tree
    expect(container.querySelector('[aria-valuenow="42"]')).toBeTruthy();
  });

  it("forwards loaderType=skeleton and renders the matrix-shaped skeleton", () => {
    const { container } = render(
      <AccessMatrix permissions={PERMS} loading loaderType="skeleton" />,
    );
    expect(container.querySelector("table")).toBeNull();
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });
});
