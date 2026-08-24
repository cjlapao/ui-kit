import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Tree, { collectExpandableIds, type TreeItem } from "./Tree";

const items: TreeItem[] = [
  {
    id: "docs",
    label: "Documents",
    children: [
      { id: "report", label: "Report.pdf" },
      { id: "notes", label: "Notes.txt" },
    ],
  },
  { id: "music", label: "Music" },
];

const rowLabel = (label: string) =>
  screen.getByRole("treeitem", { name: label });

const chevronOf = (row: HTMLElement) =>
  row.querySelector("button") as HTMLButtonElement;

describe("Tree — rendering and expansion", () => {
  it("renders top-level items and hides collapsed children", () => {
    render(<Tree items={items} ariaLabel="Files" />);
    expect(rowLabel("Documents")).toBeTruthy();
    expect(rowLabel("Music")).toBeTruthy();
    expect(screen.queryByRole("treeitem", { name: "Report.pdf" })).toBeNull();
  });

  it("expands a branch when its chevron is clicked", () => {
    render(<Tree items={items} />);
    const row = rowLabel("Documents");
    expect(row).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(chevronOf(row));
    expect(row).toHaveAttribute("aria-expanded", "true");
    expect(rowLabel("Report.pdf")).toBeTruthy();
    expect(rowLabel("Notes.txt")).toBeTruthy();
  });

  it("hides children of a leaf and exposes no toggle for it", () => {
    render(<Tree items={items} />);
    const row = rowLabel("Music");
    expect(row.querySelector("button")).toBeNull();
    expect(row).not.toHaveAttribute("aria-expanded");
  });

  it("honours defaultExpandedIds on first render", () => {
    render(<Tree items={items} defaultExpandedIds={["docs"]} />);
    expect(rowLabel("Report.pdf")).toBeTruthy();
  });

  it("stays controlled: internal toggles only report back", () => {
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <Tree
        items={items}
        expandedIds={[]}
        onExpandedChange={onExpandedChange}
      />,
    );
    fireEvent.click(chevronOf(rowLabel("Documents")));
    expect(onExpandedChange).toHaveBeenCalledWith(["docs"]);
    expect(screen.queryByRole("treeitem", { name: "Report.pdf" })).toBeNull();

    rerender(
      <Tree items={items} expandedIds={["docs"]} onExpandedChange={onExpandedChange} />,
    );
    expect(rowLabel("Report.pdf")).toBeTruthy();
  });

  it("fires onToggle with the node and its new state", () => {
    const onToggle = vi.fn();
    render(<Tree items={items} onToggle={onToggle} />);
    fireEvent.click(chevronOf(rowLabel("Documents")));
    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: "docs" }),
      true,
    );
  });
});

describe("Tree — selection", () => {
  it("ignores row clicks in none mode", () => {
    const onSelectionChange = vi.fn();
    render(<Tree items={items} onSelectionChange={onSelectionChange} />);
    fireEvent.click(rowLabel("Music"));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("keeps a single node selected in single mode", () => {
    const onSelectionChange = vi.fn();
    render(
      <Tree
        items={items}
        selectionMode="single"
        defaultExpandedIds={["docs"]}
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(rowLabel("Report.pdf"));
    expect(rowLabel("Report.pdf")).toHaveAttribute("aria-selected", "true");
    fireEvent.click(rowLabel("Notes.txt"));
    expect(rowLabel("Notes.txt")).toHaveAttribute("aria-selected", "true");
    expect(rowLabel("Report.pdf")).toHaveAttribute("aria-selected", "false");
    expect(onSelectionChange).toHaveBeenLastCalledWith(["notes"]);
  });

  it("toggles members in and out in multiple mode", () => {
    const onSelectionChange = vi.fn();
    render(
      <Tree
        items={items}
        selectionMode="multiple"
        defaultExpandedIds={["docs"]}
        onSelectionChange={onSelectionChange}
      />,
    );
    expect(screen.getByRole("tree")).toHaveAttribute(
      "aria-multiselectable",
      "true",
    );
    fireEvent.click(rowLabel("Report.pdf"));
    fireEvent.click(rowLabel("Notes.txt"));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["report", "notes"]);
    fireEvent.click(rowLabel("Report.pdf"));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["notes"]);
    expect(rowLabel("Report.pdf")).toHaveAttribute("aria-selected", "false");
  });

  it("marks checkbox rows and derives the parent indeterminate state", () => {
    render(
      <Tree
        items={items}
        selectionMode="checkbox"
        defaultExpandedIds={["docs"]}
        defaultSelectedIds={["report"]}
      />,
    );
    expect(rowLabel("Report.pdf")).toHaveAttribute("aria-checked", "true");
    expect(rowLabel("Notes.txt")).toHaveAttribute("aria-checked", "false");
    expect(rowLabel("Documents")).toHaveAttribute("aria-checked", "mixed");
  });

  it("reads a parent as checked once every child is checked", () => {
    render(
      <Tree
        items={items}
        selectionMode="checkbox"
        defaultExpandedIds={["docs"]}
        defaultSelectedIds={["report"]}
      />,
    );
    fireEvent.click(rowLabel("Notes.txt"));
    expect(rowLabel("Documents")).toHaveAttribute("aria-checked", "true");
    expect(rowLabel("Report.pdf")).toHaveAttribute("aria-checked", "true");
  });

  it("does not select disabled rows", () => {
    const onSelectionChange = vi.fn();
    render(
      <Tree
        items={[{ id: "locked", label: "Locked", disabled: true }]}
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(rowLabel("Locked"));
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(rowLabel("Locked")).toHaveAttribute("aria-disabled", "true");
  });
});

describe("Tree — filter", () => {
  it("keeps only matching branches and renders them expanded", () => {
    render(<Tree items={items} filter="report" />);
    expect(rowLabel("Documents")).toBeTruthy();
    expect(rowLabel("Report.pdf")).toBeTruthy();
    expect(screen.queryByRole("treeitem", { name: "Notes.txt" })).toBeNull();
    expect(screen.queryByRole("treeitem", { name: "Music" })).toBeNull();
  });

  it("matches case-insensitively", () => {
    render(<Tree items={items} filter="rEpOrT" />);
    expect(rowLabel("Report.pdf")).toBeTruthy();
  });

  it("renders the empty message when nothing matches", () => {
    render(
      <Tree items={items} filter="zzz" emptyMessage="No items found." />,
    );
    expect(screen.getByText("No items found.")).toBeTruthy();
    expect(screen.queryAllByRole("treeitem")).toHaveLength(0);
  });
});

describe("Tree — keyboard", () => {
  it("moves focus with the arrow keys and skips collapsed branches", () => {
    render(<Tree items={items} defaultExpandedIds={["docs"]} />);
    const docs = rowLabel("Documents");
    docs.focus();
    expect(docs).toHaveFocus();

    fireEvent.keyDown(docs, { key: "ArrowDown" });
    expect(rowLabel("Report.pdf")).toHaveFocus();

    fireEvent.keyDown(rowLabel("Report.pdf"), { key: "ArrowUp" });
    expect(rowLabel("Documents")).toHaveFocus();

    fireEvent.keyDown(rowLabel("Documents"), { key: "End" });
    expect(rowLabel("Music")).toHaveFocus();

    fireEvent.keyDown(rowLabel("Music"), { key: "Home" });
    expect(rowLabel("Documents")).toHaveFocus();
  });

  it("expands with ArrowRight and collapses with ArrowLeft", () => {
    render(<Tree items={items} />);
    const docs = rowLabel("Documents");
    docs.focus();

    fireEvent.keyDown(docs, { key: "ArrowRight" });
    expect(docs).toHaveAttribute("aria-expanded", "true");
    expect(rowLabel("Report.pdf")).toBeTruthy();

    fireEvent.keyDown(docs, { key: "ArrowLeft" });
    expect(docs).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("treeitem", { name: "Report.pdf" })).toBeNull();
  });

  it("moves to the parent with ArrowLeft from a child", () => {
    render(<Tree items={items} defaultExpandedIds={["docs"]} />);
    const report = rowLabel("Report.pdf");
    report.focus();
    fireEvent.keyDown(report, { key: "ArrowLeft" });
    expect(rowLabel("Documents")).toHaveFocus();
  });

  it("selects the focused row with Space and Enter", () => {
    render(
      <Tree items={items} selectionMode="single" defaultExpandedIds={["docs"]} />,
    );
    const report = rowLabel("Report.pdf");
    report.focus();

    fireEvent.keyDown(report, { key: " " });
    expect(report).toHaveAttribute("aria-selected", "true");

    const music = rowLabel("Music");
    music.focus();
    fireEvent.keyDown(music, { key: "Enter" });
    expect(music).toHaveAttribute("aria-selected", "true");
    expect(report).toHaveAttribute("aria-selected", "false");
  });
});

describe("Tree — shape", () => {
  it("collectExpandableIds lists branch ids in tree order", () => {
    expect(collectExpandableIds(items)).toEqual(["docs"]);
    expect(
      collectExpandableIds([
        { id: "a", label: "A", children: [{ id: "b", label: "B" }] },
        { id: "c", label: "C" },
      ]),
    ).toEqual(["a"]);
  });

  it("renders the empty message for an empty tree", () => {
    render(<Tree items={[]} emptyMessage="Nothing here." />);
    expect(screen.getByText("Nothing here.")).toBeTruthy();
  });

  it("stamps ARIA position attributes on the rows", () => {
    render(<Tree items={items} defaultExpandedIds={["docs"]} />);
    const report = rowLabel("Report.pdf");
    expect(report).toHaveAttribute("aria-level", "2");
    expect(report).toHaveAttribute("aria-setsize", "2");
    expect(report).toHaveAttribute("aria-posinset", "1");
  });
});
