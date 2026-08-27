import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import ConnectionFlow from "./ConnectionFlow";
import {
  flowProgress,
  getNodeSurface,
  headerGlyph,
  headerReservesGlyph,
  nodeProgress,
  type ConnectionFlowNode,
} from "../../connectionFlow";

const NODES: ConnectionFlowNode[] = [
  { id: "a", title: "A", progress: 0.5 },
  { id: "b", title: "B", progress: 1 },
];

describe("ConnectionFlow header", () => {
  it("renders the eyebrow, title, subtitle and tag", () => {
    const { getByText } = render(
      <ConnectionFlow
        nodes={NODES}
        eyebrow="release · REQ-4128"
        title="Northwind Logistics"
        subtitle="on: workflow_dispatch"
        tag="LIVE"
      />,
    );
    expect(getByText("release · REQ-4128")).toBeTruthy();
    expect(getByText("Northwind Logistics")).toBeTruthy();
    expect(getByText("on: workflow_dispatch")).toBeTruthy();
    expect(getByText("LIVE")).toBeTruthy();
  });

  it("draws the bar under the title, inside the header", () => {
    const { container } = render(
      <ConnectionFlow nodes={NODES} title="Flow" progressType="bar" />,
    );
    const heading = container.querySelector("h3")!;
    const bar = container.querySelector('[role="progressbar"]')!;
    // The bar follows the title in document order, and both are in the header
    // — above the graph frame rather than floating over it.
    expect(
      heading.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container.querySelector(".overscroll-contain")!.contains(bar)).toBe(
      false,
    );
  });

  it("renders the header with no Panel around it", () => {
    const { getByText } = render(
      <ConnectionFlow nodes={NODES} variant="plain" title="Plain" />,
    );
    expect(getByText("Plain")).toBeTruthy();
  });

  describe("variant", () => {
    it("gives the cards the surface of the panel they sit in", () => {
      // One decision, not two: a card inside a panel is part of that panel,
      // not a second surface language layered on top of it.
      const read = (variant: "subtle" | "tonal") => {
        const { container } = render(
          <ConnectionFlow nodes={NODES} variant={variant} />,
        );
        return container.querySelector<SVGPathElement>("path[d^='M']")!;
      };
      const subtle = getNodeSurface("blue", "subtle");
      const tonal = getNodeSurface("blue", "tonal");
      expect(subtle.fill).not.toBe(tonal.fill);

      const cards = (variant: "subtle" | "tonal") => {
        const { container } = render(
          <ConnectionFlow nodes={[{ id: "a", title: "A", tone: "blue" }]} variant={variant} />,
        );
        return [...container.querySelectorAll("path")].map((p) => p.getAttribute("class"));
      };
      expect(cards("subtle").some((c) => c?.includes(subtle.fill))).toBe(true);
      expect(cards("tonal").some((c) => c?.includes(tonal.fill))).toBe(true);
      void read;
    });

    it("falls back to a real surface when the frame is plain", () => {
      // `plain` draws no Panel, so the cards take the nearest real surface
      // rather than inventing a scale of their own.
      const simple = getNodeSurface("blue", "simple");
      const { container } = render(
        <ConnectionFlow
          nodes={[{ id: "a", title: "A", tone: "blue" }]}
          variant="plain"
        />,
      );
      const classes = [...container.querySelectorAll("path")].map((p) =>
        p.getAttribute("class"),
      );
      expect(classes.some((c) => c?.includes(simple.fill))).toBe(true);
    });
  });

  describe("the glyph slot", () => {
    it("gives the icon's place to a spinner while the flow runs", () => {
      expect(headerGlyph(true, "spinner", 0.4)).toEqual({
        kind: "spinner",
        value: 0.4,
      });
    });

    it("hands it back at 100%", () => {
      expect(headerGlyph(true, "spinner", 1)).toEqual({ kind: "icon" });
    });

    it("holds the slot open even with no icon behind it", () => {
      // Otherwise the title steps sideways the moment the flow finishes.
      expect(headerReservesGlyph(false, "spinner")).toBe(true);
      expect(headerGlyph(false, "spinner", 1)).toEqual({ kind: "none" });
      expect(headerReservesGlyph(false, "bar")).toBe(false);
    });

    it("leaves the slot to the icon when progress is a bar", () => {
      expect(headerGlyph(true, "bar", 0.4)).toEqual({ kind: "icon" });
    });
  });

  describe("the reported percentage", () => {
    it("averages what the nodes report", () => {
      expect(flowProgress(NODES)).toBeCloseTo(0.75, 5);
    });

    it("lets the caller state it outright, clamped", () => {
      expect(flowProgress(NODES, 0.1)).toBe(0.1);
      expect(flowProgress(NODES, 4)).toBe(1);
      expect(flowProgress(NODES, -1)).toBe(0);
    });

    it("counts a card built from items, which reports none of its own", () => {
      const card: ConnectionFlowNode = {
        id: "c",
        title: "C",
        items: [
          { id: "1", title: "one", progress: 0.5 },
          { id: "2", title: "two", progress: 1 },
        ],
      };
      expect(nodeProgress(card)).toBeCloseTo(0.75, 5);
      expect(flowProgress([card])).toBeCloseTo(0.75, 5);
    });

    it("reports nothing when nothing reports anything", () => {
      expect(flowProgress([{ id: "a", title: "A" }])).toBeUndefined();
    });
  });

  describe("loading", () => {
    it("holds the frame with a skeleton by default", () => {
      const { container } = render(
        <ConnectionFlow nodes={NODES} title="Flow" loading />,
      );
      // A skeleton, not the graph.
      expect(container.querySelector(".overscroll-contain")).toBeNull();
      expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
        0,
      );
    });

    it("shows a spinner or a bar when asked", () => {
      const spinner = render(
        <ConnectionFlow nodes={NODES} loading loaderType="spinner" />,
      );
      expect(
        spinner.container.querySelector('[aria-label="Loading flow"]'),
      ).toBeTruthy();

      const bar = render(
        <ConnectionFlow nodes={NODES} loading loaderType="progress" />,
      );
      const track = bar.container.querySelector('[role="progressbar"]')!;
      // Indeterminate: the absence of a value is what says so.
      expect(track.getAttribute("aria-valuenow")).toBeNull();
    });

    it("keeps the header block, so the card does not collapse", () => {
      // The header stays, drawn as a placeholder shaped like the real one —
      // the same reason `PanelSkeleton` mirrors the slots it was given.
      const { container } = render(
        <ConnectionFlow nodes={NODES} title="Flow" loading loaderType="spinner" />,
      );
      expect(container.querySelector(".border-b")).toBeTruthy();
      const placeholder = container.querySelector('[aria-hidden="true"]')!;
      expect(placeholder.className).toContain("animate-pulse");
    });
  });
});
