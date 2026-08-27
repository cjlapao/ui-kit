import { describe, expect, it } from "vitest";
import {
  computeHeatmapCells,
  computeHeatmapLayout,
  contrastTextColor,
  sampleColorStops,
} from "./heatmap";

describe("computeHeatmapCells", () => {
  const data = [
    { row: "A", col: "1", value: 10 },
    { row: "A", col: "2", value: 20 },
    { row: "B", col: "1", value: null },
    { row: "B", col: "3", value: 30 },
  ];
  const rows = ["A", "B"];
  const cols = ["1", "2", "3"];

  it("indexes every (row, col) pair row-major with values from the data", () => {
    const out = computeHeatmapCells(
      rows,
      cols,
      data,
      (d) => (d as { row: string }).row,
      (d) => (d as { col: string }).col,
      (d) => (d as { value: number | null }).value,
    );
    expect(out.cells.length).toBe(6);
    expect(out.cells.map((c) => [c.row, c.col, c.value])).toEqual([
      ["A", "1", 10],
      ["A", "2", 20],
      ["A", "3", null],
      ["B", "1", null],
      ["B", "2", null],
      ["B", "3", 30],
    ]);
  });

  it("computes min (floored at 0 for non-negative data) and max", () => {
    const out = computeHeatmapCells(
      rows,
      cols,
      data,
      (d) => (d as { row: string }).row,
      (d) => (d as { col: string }).col,
      (d) => (d as { value: number | null }).value,
    );
    expect(out.min).toBe(0);
    expect(out.max).toBe(30);
  });

  it("keeps negative min when values go below zero", () => {
    const out = computeHeatmapCells(
      ["A"],
      ["1"],
      [{ row: "A", col: "1", value: -5 }],
      (d) => (d as { row: string }).row,
      (d) => (d as { col: string }).col,
      (d) => (d as { value: number }).value,
    );
    expect(out.min).toBe(-5);
    expect(out.max).toBe(-5);
  });

  it("treats non-finite values as null cells", () => {
    const out = computeHeatmapCells(
      ["A"],
      ["1"],
      [{ row: "A", col: "1", value: NaN }],
      (d) => (d as { row: string }).row,
      (d) => (d as { col: string }).col,
      (d) => (d as { value: number }).value,
    );
    expect(out.cells[0].value).toBeNull();
    expect(out.max).toBe(0);
  });
});

describe("computeHeatmapLayout", () => {
  const area = { x: 60, y: 40, width: 800, height: 400 };

  it("reserves the left gutter and bottom label/legend space", () => {
    const l = computeHeatmapLayout({
      area,
      rowLabelWidth: 100,
      colsCount: 4,
      rowsCount: 5,
      showColLabels: true,
      showLegend: true,
    });
    expect(l.gridX).toBe(160);
    expect(l.gridY).toBe(40);
    expect(l.gridW).toBe(700);
    // 400 - 24 (col labels) - 40 (legend)
    expect(l.gridH).toBe(336);
    expect(l.cellW).toBeCloseTo(700 / 4);
    expect(l.cellH).toBeCloseTo(336 / 5);
    expect(l.legendY).toBe(40 + 336 + 24);
  });

  it("omits the legend row when hidden", () => {
    const l = computeHeatmapLayout({
      area,
      rowLabelWidth: 80,
      colsCount: 7,
      rowsCount: 2,
      showColLabels: true,
      showLegend: false,
    });
    expect(l.legendY).toBeNull();
    expect(l.gridH).toBe(376);
  });
});

describe("sampleColorStops", () => {
  it("returns the endpoint colors at t=0 and t=1", () => {
    expect(sampleColorStops(["#000000", "#ffffff"], 0)).toBe("#000000");
    expect(sampleColorStops(["#000000", "#ffffff"], 1)).toBe("#ffffff");
  });

  it("interpolates the midpoint of a 2-stop scale", () => {
    expect(sampleColorStops(["#000000", "#ffffff"], 0.5)).toBe("#808080");
  });

  it("clamps outside the range", () => {
    expect(sampleColorStops(["#00ff00", "#0000ff"], -2)).toBe("#00ff00");
    expect(sampleColorStops(["#00ff00", "#0000ff"], 2)).toBe("#0000ff");
  });

  it("walks a 3-stop scale across equal segments", () => {
    const stops = ["#000000", "#0000ff", "#ff0000"];
    expect(sampleColorStops(stops, 0.25)).toBe("#000080");
    expect(sampleColorStops(stops, 0.5)).toBe("#0000ff");
    expect(sampleColorStops(stops, 0.75)).toBe("#800080");
  });

  it("returns the single stop for a 1-stop scale", () => {
    expect(sampleColorStops(["#123456"], 0.7)).toBe("#123456");
  });
});

describe("contrastTextColor", () => {
  it("picks dark text on light backgrounds", () => {
    expect(contrastTextColor("#f8fafc")).toBe("#0b1020");
  });
  it("picks light text on dark backgrounds", () => {
    expect(contrastTextColor("#1e3a8a")).toBe("#ffffff");
  });
});
