import { describe, it, expect, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";

import ConnectionFlowNodeBody from "./ConnectionFlowNodeBody";
import {
  DEFAULT_LAYOUT_OPTIONS,
  NODE_METRICS,
  type ConnectionFlowNode,
  type LaidOutNode,
  type NodeMetrics,
} from "../../connectionFlow";
import { CONTROL_SIZES } from "../../theme/Theme";

const laid = (node: Partial<ConnectionFlowNode> = {}): LaidOutNode => ({
  id: "a",
  node: { id: "a", title: "Build", subtitle: "13m", ...node },
  outline: "",
  x: 0,
  y: 0,
  width: 200,
  height: 60,
  anchorY: 30,
  column: 0,
  depth: 0,
  tone: "blue",
  scrollable: false,
});

const renderBody = (
  node: LaidOutNode,
  metrics: NodeMetrics = NODE_METRICS.md,
  extra: {
    showProgress?: boolean;
    expanded?: ReadonlySet<string>;
    onToggleExpanded?: (id: string) => void;
  } = {},
) =>
  render(
    <ConnectionFlowNodeBody
      node={node}
      metrics={metrics}
      showProgress={extra.showProgress ?? false}
      options={DEFAULT_LAYOUT_OPTIONS}
      expanded={extra.expanded ?? new Set<string>()}
      onToggleExpanded={extra.onToggleExpanded ?? (() => {})}
    />,
  );

const items = (count: number, over: Partial<ConnectionFlowNode> = {}) => ({
  items: Array.from({ length: count }, (_, i) => ({
    id: `i${i}`,
    title: `Item ${i}`,
  })),
  ...over,
});

/**
 * The body has to style itself from the same table the layout measured from,
 * or the height the DOM produces stops matching the height the card was cut
 * to. JSDOM has no layout engine, so this asserts the numbers reaching the
 * style attributes rather than the resulting box — which is the drift that
 * actually happens.
 */
describe("ConnectionFlowNodeBody", () => {
  it("takes its type from the metrics it was given", () => {
    for (const size of CONTROL_SIZES) {
      const metrics = NODE_METRICS[size];
      const { container } = renderBody(laid(), metrics);
      const title = container.querySelector<HTMLElement>(".font-semibold")!;
      expect(title.style.fontSize).toBe(`${metrics.title}px`);
      expect(title.style.lineHeight).toBe(`${metrics.titleLine}px`);

      const subtitle = title.nextElementSibling as HTMLElement;
      expect(subtitle.style.fontSize).toBe(`${metrics.body}px`);
      expect(subtitle.style.lineHeight).toBe(`${metrics.bodyLine}px`);
    }
  });

  it("differs between the smallest and largest size", () => {
    // The point of the table: `size` used to change the box and nothing in it.
    const read = (size: "xs" | "xl") =>
      renderBody(laid(), NODE_METRICS[size]).container.querySelector<HTMLElement>(
        ".font-semibold",
      )!.style.fontSize;
    expect(read("xs")).not.toBe(read("xl"));
  });

  it("uses the metrics gap between the glyph and the text", () => {
    const metrics = NODE_METRICS.lg;
    const { container } = renderBody(laid({ icon: "Rocket" }), metrics);
    const row = container.querySelector<HTMLElement>(".items-center")!;
    expect(row.style.gap).toBe(`${metrics.gap}px`);
  });

  it("falls back to the status glyph when the node names no icon", () => {
    const { container } = renderBody(laid({ status: "succeeded" }));
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("draws the node's progress bar only when asked", () => {
    const on = renderBody(laid({ progress: 0.4 }), NODE_METRICS.md, {
      showProgress: true,
    });
    const off = renderBody(laid({ progress: 0.4 }));
    expect(on.container.querySelector('[role="progressbar"]')).toBeTruthy();
    expect(off.container.querySelector('[role="progressbar"]')).toBeNull();
  });

  it("starts a scrolling body at the top instead of centring it", () => {
    // Centring content that overflows its scroll container puts the first row
    // above the scrollable area, where it can never be reached.
    const fixed = renderBody(laid()).container.firstElementChild as HTMLElement;
    expect(fixed.className).toContain("justify-center");
    expect(fixed.className).toContain("h-full");

    const scrolling = render(
      <ConnectionFlowNodeBody
        node={laid()}
        metrics={NODE_METRICS.md}
        showProgress={false}
        options={DEFAULT_LAYOUT_OPTIONS}
        scrollable
        expanded={new Set<string>()}
        onToggleExpanded={() => {}}
      />,
    ).container.firstElementChild as HTMLElement;
    expect(scrolling.className).toContain("justify-start");
    expect(scrolling.className).toContain("h-auto");
  });

  describe("items", () => {
    it("shows the cap and folds the rest behind a button", () => {
      const { getByRole, queryByText } = renderBody(laid(items(5)));
      expect(queryByText("Item 0")).toBeTruthy();
      expect(queryByText("Item 1")).toBeTruthy();
      expect(queryByText("Item 2")).toBeNull();
      expect(getByRole("button").textContent).toBe("Show 3 more");
    });

    it("shows everything once expanded, and offers to collapse", () => {
      const { getByRole, queryByText } = renderBody(
        laid(items(5)),
        NODE_METRICS.md,
        { expanded: new Set(["a"]) },
      );
      expect(queryByText("Item 4")).toBeTruthy();
      expect(getByRole("button").textContent).toBe("Show less");
    });

    it("draws no button when everything already fits", () => {
      const { queryByRole } = renderBody(laid(items(2)));
      expect(queryByRole("button")).toBeNull();
    });

    it("does not select the card when the button is clicked", () => {
      // `stopPropagation` rather than lifting the card out of `role="button"`.
      const onToggleExpanded = vi.fn();
      const onCardClick = vi.fn();
      const { getByRole } = render(
        <div onClick={onCardClick}>
          <ConnectionFlowNodeBody
            node={laid(items(5))}
            metrics={NODE_METRICS.md}
            showProgress={false}
            options={DEFAULT_LAYOUT_OPTIONS}
            expanded={new Set<string>()}
            onToggleExpanded={onToggleExpanded}
          />
        </div>,
      );
      fireEvent.click(getByRole("button"));
      expect(onToggleExpanded).toHaveBeenCalledWith("a");
      expect(onCardClick).not.toHaveBeenCalled();
    });

    it("puts a spinner in the glyph slot while progress is running", () => {
      const { container } = renderBody(
        laid({
          items: [
            { id: "i", title: "Running", progress: 0.5, progressType: "spinner" },
          ],
        }),
      );
      // The spinner is a progressbar; a bar would be one too, so check there
      // is no full-width track under the text.
      expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(1);
      expect(container.querySelector(".relative.inline-flex")).toBeTruthy();
    });

    it("gives the slot back to the icon at 100%", () => {
      const { container } = renderBody(
        laid({
          items: [
            {
              id: "i",
              title: "Done",
              icon: "Rocket",
              progress: 1,
              progressType: "spinner",
            },
          ],
        }),
      );
      expect(container.querySelector('[role="progressbar"]')).toBeNull();
      expect(container.querySelector("svg")).toBeTruthy();
    });

    it("reserves the glyph column for the whole list", () => {
      // Per row, a title stepped sideways when its neighbour's spinner ended.
      const metrics = NODE_METRICS.md;
      const { container } = renderBody(
        laid({
          items: [
            { id: "a", title: "With", icon: "Rocket" },
            { id: "b", title: "Without" },
          ],
        }),
        metrics,
      );
      const slots = [
        ...container.querySelectorAll<HTMLElement>("div.shrink-0"),
      ].filter((el) => el.style.width === `${metrics.glyph}px`);
      expect(slots).toHaveLength(2);
      // The row with no glyph still reserves the column, and holds nothing.
      expect(slots.filter((el) => el.childElementCount === 0)).toHaveLength(1);
    });
  });
});
