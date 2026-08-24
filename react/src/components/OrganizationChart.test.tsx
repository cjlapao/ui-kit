import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OrganizationChart, {
  type OrgChartNode,
} from "./OrganizationChart";

const nodes: OrgChartNode[] = [
  {
    id: "ceo",
    label: "Founder & CEO",
    children: [
      {
        id: "product",
        label: "Product Lead",
        children: [
          { id: "ux", label: "UX Designer" },
          { id: "pm", label: "Product Manager" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        children: [{ id: "fe", label: "Frontend Developer" }],
      },
    ],
  },
];

const nodeLabel = (label: string) =>
  screen.getByRole("treeitem", { name: label });

const toggleOf = (card: HTMLElement) =>
  card.querySelector("button[aria-expanded]") as HTMLButtonElement;

describe("OrganizationChart — rendering and expansion", () => {
  it("renders the full hierarchy expanded by default", () => {
    render(<OrganizationChart nodes={nodes} ariaLabel="Company" />);
    expect(nodeLabel("Founder & CEO")).toBeTruthy();
    expect(nodeLabel("Product Lead")).toBeTruthy();
    expect(nodeLabel("UX Designer")).toBeTruthy();
    expect(nodeLabel("Frontend Developer")).toBeTruthy();
  });

  it("exposes a tree with labelled items, levels and groups", () => {
    render(<OrganizationChart nodes={nodes} ariaLabel="Company" />);
    expect(screen.getByRole("tree", { name: "Company" })).toBeTruthy();
    const root = nodeLabel("Founder & CEO");
    expect(root).toHaveAttribute("aria-level", "1");
    expect(root).toHaveAttribute("aria-expanded", "true");
    expect(nodeLabel("Product Lead")).toHaveAttribute("aria-level", "2");
    expect(nodeLabel("UX Designer")).toHaveAttribute("aria-level", "3");
    expect(nodeLabel("UX Designer")).toHaveAttribute("aria-setsize", "2");
    expect(nodeLabel("UX Designer")).toHaveAttribute("aria-posinset", "1");
    expect(screen.getAllByRole("group").length).toBeGreaterThan(0);
  });

  it("collapses a branch when its toggle is clicked", () => {
    render(<OrganizationChart nodes={nodes} />);
    const root = nodeLabel("Founder & CEO");
    fireEvent.click(toggleOf(root));
    expect(root).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("treeitem", { name: "Product Lead" })).toBeNull();
    // Re-expanding brings the whole branch back.
    fireEvent.click(toggleOf(root));
    expect(nodeLabel("Product Lead")).toBeTruthy();
  });

  it("shows a child-count badge on collapsed toggles", () => {
    render(
      <OrganizationChart nodes={nodes} defaultExpandedIds={[]} />,
    );
    const badge = screen.getByText("2");
    expect(badge.closest("button")).toBeTruthy();
  });

  it("hides toggles when collapsible is false", () => {
    render(<OrganizationChart nodes={nodes} collapsible={false} />);
    expect(nodeLabel("Founder & CEO").querySelector("button")).toBeNull();
    expect(nodeLabel("Product Lead")).toBeTruthy();
  });

  it("honours defaultExpandedIds on first render", () => {
    render(
      <OrganizationChart nodes={nodes} defaultExpandedIds={["ceo"]} />,
    );
    expect(nodeLabel("Product Lead")).toBeTruthy();
    expect(screen.queryByRole("treeitem", { name: "UX Designer" })).toBeNull();
  });

  it("stays controlled: internal toggles only report back", () => {
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <OrganizationChart
        nodes={nodes}
        expandedIds={["ceo"]}
        onExpandedChange={onExpandedChange}
      />,
    );
    fireEvent.click(toggleOf(nodeLabel("Product Lead")));
    expect(onExpandedChange).toHaveBeenCalledWith(["ceo", "product"]);
    // The prop still wins over the internal state.
    expect(
      screen.queryByRole("treeitem", { name: "UX Designer" }),
    ).toBeNull();

    rerender(
      <OrganizationChart
        nodes={nodes}
        expandedIds={[]}
        onExpandedChange={onExpandedChange}
      />,
    );
    expect(screen.queryByRole("treeitem", { name: "Product Lead" })).toBeNull();
  });

  it("fires onToggle with the node and its new state", () => {
    const onToggle = vi.fn();
    render(<OrganizationChart nodes={nodes} onToggle={onToggle} />);
    fireEvent.click(toggleOf(nodeLabel("Founder & CEO")));
    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: "ceo" }),
      false,
    );
  });

  it("renders multiple roots side by side", () => {
    render(
      <OrganizationChart
        nodes={[
          { id: "a", label: "Team A" },
          { id: "b", label: "Team B" },
        ]}
      />,
    );
    expect(nodeLabel("Team A")).toHaveAttribute("aria-setsize", "2");
    expect(nodeLabel("Team B")).toHaveAttribute("aria-posinset", "2");
  });

  it("shows the empty message when there are no nodes", () => {
    render(
      <OrganizationChart nodes={[]} emptyMessage="No organisation data" />,
    );
    expect(screen.getByText("No organisation data")).toBeTruthy();
  });
});

describe("OrganizationChart — selection", () => {
  it("keeps exactly one node in single mode", () => {
    const onSelectionChange = vi.fn();
    render(
      <OrganizationChart
        nodes={nodes}
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(nodeLabel("Product Lead"));
    expect(onSelectionChange).toHaveBeenCalledWith(["product"]);

    fireEvent.click(nodeLabel("UX Designer"));
    expect(onSelectionChange).toHaveBeenCalledWith(["ux"]);
    expect(nodeLabel("UX Designer")).toHaveAttribute("aria-selected", "true");
    expect(nodeLabel("Product Lead")).toHaveAttribute("aria-selected", "false");
  });

  it("toggles nodes independently in multiple mode", () => {
    const onSelectionChange = vi.fn();
    render(
      <OrganizationChart
        nodes={nodes}
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
      />,
    );
    const tree = screen.getByRole("tree");
    expect(tree).toHaveAttribute("aria-multiselectable", "true");

    fireEvent.click(nodeLabel("Product Lead"));
    fireEvent.click(nodeLabel("Engineering Lead"));
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "product",
      "engineering",
    ]);
    fireEvent.click(nodeLabel("Product Lead"));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["engineering"]);
  });

  it("ignores clicks in none mode", () => {
    const onSelectionChange = vi.fn();
    render(
      <OrganizationChart nodes={nodes} onSelectionChange={onSelectionChange} />,
    );
    fireEvent.click(nodeLabel("Product Lead"));
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(nodeLabel("Product Lead")).not.toHaveAttribute("aria-selected");
  });

  it("cascades checkbox selection over the whole branch", () => {
    const onSelectionChange = vi.fn();
    render(
      <OrganizationChart
        nodes={nodes}
        selectionMode="checkbox"
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(nodeLabel("Product Lead"));
    expect(onSelectionChange).toHaveBeenCalledWith(["product", "ux", "pm"]);

    // Clicking the (visually) checked branch again clears the whole branch.
    fireEvent.click(nodeLabel("Product Lead"));
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it("derives the mixed state for partially checked ancestors", () => {
    render(
      <OrganizationChart
        nodes={nodes}
        selectionMode="checkbox"
        selectedIds={["ux"]}
      />,
    );
    expect(nodeLabel("UX Designer")).toHaveAttribute("aria-checked", "true");
    expect(nodeLabel("Product Lead")).toHaveAttribute("aria-checked", "mixed");
    expect(nodeLabel("Founder & CEO")).toHaveAttribute("aria-checked", "mixed");
  });

  it("derives a checked ancestor once every descendant is selected", () => {
    render(
      <OrganizationChart
        nodes={nodes}
        selectionMode="checkbox"
        selectedIds={["ux", "pm", "fe"]}
      />,
    );
    expect(nodeLabel("Product Lead")).toHaveAttribute("aria-checked", "true");
    expect(nodeLabel("Founder & CEO")).toHaveAttribute("aria-checked", "true");
  });

  it("selects the focused node with Enter and Space", () => {
    const onSelectionChange = vi.fn();
    render(
      <OrganizationChart
        nodes={nodes}
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      />,
    );
    const card = nodeLabel("Engineering Lead");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelectionChange).toHaveBeenLastCalledWith(["engineering"]);
    fireEvent.keyDown(card, { key: " " });
    expect(onSelectionChange).toHaveBeenCalledTimes(2);
  });

  it("keeps disabled nodes out of the selection", () => {
    const onSelectionChange = vi.fn();
    render(
      <OrganizationChart
        nodes={[{ id: "a", label: "Locked", disabled: true }]}
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      />,
    );
    const card = nodeLabel("Locked");
    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card).toHaveAttribute("tabindex", "-1");
    fireEvent.click(card);
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});

describe("OrganizationChart — custom content", () => {
  it("renders renderNode content while keeping the structure", () => {
    render(
      <OrganizationChart
        nodes={nodes}
        ariaLabel="Company"
        renderNode={({ node, level }) => (
          <span data-testid={`custom-${node.id}`}>
            L{level}:{node.label}
          </span>
        )}
      />,
    );
    expect(screen.getByTestId("custom-ceo")).toHaveTextContent("L1:Founder & CEO");
    expect(screen.getByTestId("custom-ux")).toHaveTextContent("L3:UX Designer");
    // The default label is not rendered alongside the custom content,
    // and the toggle still works.
    expect(screen.queryByText("UX Designer")).toBeNull();
    fireEvent.click(toggleOf(nodeLabel("Product Lead")));
    expect(screen.queryByTestId("custom-ux")).toBeNull();
  });
});
