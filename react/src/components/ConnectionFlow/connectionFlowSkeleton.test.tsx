import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ConnectionFlow from "./ConnectionFlow";
import ConnectionFlowSkeleton from "./ConnectionFlowSkeleton";
import { NODE_METRICS, layoutConnectionFlow } from "../../connectionFlow";
import { getSkeletonLayout, skeletonViewBox } from "../../../../common/connectionFlow/skeleton";

describe("ConnectionFlow loading preview", () => {
  it("shows a branch and merge when the graph has not arrived", () => {
    const { container } = render(<ConnectionFlow nodes={[]} loading height={320} />);
    expect(container.querySelectorAll("[data-skeleton-card]")).toHaveLength(6);
    expect(container.querySelectorAll("svg path").length).toBeGreaterThan(5);
    const skeleton = container.querySelector('[data-slot="connection-flow-skeleton"]')!;
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton.parentElement).toHaveClass("flex-auto", "min-h-0");
    expect(skeleton.parentElement!.style.height).toBe("320px");
    expect(skeleton.querySelector("svg")).toHaveAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  it("mirrors known nested topology and includes every card in its fitting bounds", () => {
    const layout = layoutConnectionFlow({ nodes: [
      { id: "a", title: "Start", children: [{ id: "child", title: "Child" }] },
      { id: "b", title: "Finish", failure: { to: "a", label: "Retry" } },
    ] });
    const { container } = render(<ConnectionFlowSkeleton variant="glass" metrics={NODE_METRICS.md} layout={layout} />);
    expect(container.querySelectorAll("[data-skeleton-card]")).toHaveLength(layout.nodes.length);
    const [x, y, width, height] = container.querySelector("svg")!.getAttribute("viewBox")!.split(" ").map(Number);
    for (const node of layout.nodes) {
      expect(node.x).toBeGreaterThan(x);
      expect(node.y).toBeGreaterThan(y);
      expect(node.x + node.width).toBeLessThan(x + width);
      expect(node.y + node.height).toBeLessThan(y + height);
    }
  });

  it("fits all control sizes without fixed-width HTML cards overflowing the frame", () => {
    for (const metrics of Object.values(NODE_METRICS)) {
      const layout = getSkeletonLayout(metrics);
      const bounds = skeletonViewBox(layout, metrics.padding * 2).split(" ").map(Number);
      expect(bounds.every(Number.isFinite)).toBe(true);
      const { container, unmount } = render(<ConnectionFlowSkeleton variant="subtle" metrics={metrics} />);
      expect(container.querySelectorAll("[data-skeleton-card]")).toHaveLength(6);
      expect(container.querySelector("svg")).toHaveClass("h-full", "w-full");
      unmount();
    }
  });
});
