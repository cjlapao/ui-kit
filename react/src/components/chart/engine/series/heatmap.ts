/**
 * Heatmap engine — cell indexing, grid layout, and color-scale sampling.
 *
 * A heatmap is self-contained (no cartesian scales): the series owns a
 * row-label gutter, the cell grid, a column-label row, and an optional
 * gradient legend inside the plot area. This module computes the pure
 * parts: which datum lands in which (row, col) cell, where the grid sits,
 * and which color a value maps to on a multi-stop scale.
 */

export interface HeatmapCellDatum {
  /** Row category (y). */
  row: string;
  /** Column category (x). */
  col: string;
  /** Cell value, or null when the datum is missing/non-finite. */
  value: number | null;
  /** The raw data row that produced this cell (undefined for gaps). */
  data: unknown;
  /** Index of the raw data row (-1 for gaps). */
  index: number;
}

export interface HeatmapCells {
  /** One entry per (row, col) pair, row-major order. */
  cells: HeatmapCellDatum[];
  /** Value lookup keyed `${row}\u0000${col}`. */
  byKey: Map<string, number | null>;
  /** Min over non-null values (0 when all values are ≥ 0). */
  min: number;
  /** Max over non-null values (0 when no data). */
  max: number;
}

/**
 * Index a flat data array into a rows × cols cell grid. Every (row, col)
 * pair yields a cell; missing or non-finite values are null cells (gaps),
 * so explicit `rows`/`cols` orderings render holes.
 */
export function computeHeatmapCells(
  rows: string[],
  cols: string[],
  data: unknown[],
  rowField: (item: unknown, index: number) => string,
  colField: (item: unknown, index: number) => string,
  valueField: (item: unknown, index: number) => number | null | undefined,
): HeatmapCells {
  const byKey = new Map<string, number | null>();
  const byData = new Map<string, { data: unknown; index: number }>();
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const r = String(rowField(item, i));
    const c = String(colField(item, i));
    const v = valueField(item, i);
    const key = `${r}\u0000${c}`;
    const value = v == null || !Number.isFinite(v as number) ? null : (v as number);
    // First occurrence wins (stable for repeated cells).
    if (!byKey.has(key)) {
      byKey.set(key, value);
      byData.set(key, { data: item, index: i });
    }
  }
  const cells: HeatmapCellDatum[] = [];
  let min = Infinity;
  let max = -Infinity;
  for (const r of rows) {
    for (const c of cols) {
      const key = `${r}\u0000${c}`;
      const value = byKey.has(key) ? (byKey.get(key) ?? null) : null;
      const entry = byData.get(key);
      if (value !== null) {
        if (value < min) min = value;
        if (value > max) max = value;
      }
      cells.push({
        row: r,
        col: c,
        value,
        data: entry?.data,
        index: entry?.index ?? -1,
      });
    }
  }
  if (!Number.isFinite(min)) {
    min = 0;
    max = 0;
  } else if (min > 0) {
    min = 0;
  }
  return { cells, byKey, min, max };
}

export interface HeatmapArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeatmapLayoutOptions {
  area: HeatmapArea;
  /** Width of the row-label gutter (px, including padding). */
  rowLabelWidth: number;
  /** Number of columns in the grid. */
  colsCount: number;
  /** Number of rows in the grid. */
  rowsCount: number;
  showColLabels: boolean;
  showLegend: boolean;
  colLabelHeight?: number;
  legendHeight?: number;
}

export interface HeatmapLayout {
  /** Origin (top-left) of the cell grid. */
  gridX: number;
  gridY: number;
  gridW: number;
  gridH: number;
  cellW: number;
  cellH: number;
  /** Top of the gradient legend (null when hidden). */
  legendY: number | null;
  legendH: number;
}

/**
 * Lay the grid out inside the plot area: row-label gutter on the left,
 * column-label row and optional legend below the grid.
 */
export function computeHeatmapLayout(opts: HeatmapLayoutOptions): HeatmapLayout {
  const { area, rowLabelWidth, colsCount, rowsCount, showColLabels, showLegend } = opts;
  const colLabelHeight = opts.colLabelHeight ?? 24;
  const legendHeight = opts.legendHeight ?? 40;
  const bottom =
    (showColLabels ? colLabelHeight : 0) + (showLegend ? legendHeight : 0);
  const gridX = area.x + rowLabelWidth;
  const gridY = area.y;
  const gridW = Math.max(area.width - rowLabelWidth, 1);
  const gridH = Math.max(area.height - bottom, 1);
  return {
    gridX,
    gridY,
    gridW,
    gridH,
    cellW: gridW / Math.max(colsCount, 1),
    cellH: gridH / Math.max(rowsCount, 1),
    legendY: showLegend ? area.y + gridH + (showColLabels ? colLabelHeight : 0) : null,
    legendH: legendHeight,
  };
}

// ── Color scale ──────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) =>
    Math.round(Math.max(0, Math.min(255, v)))
      .toString(16)
      .padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/**
 * Sample a multi-stop color scale at `t` (0–1): piecewise-linear RGB
 * interpolation across the stops at equal intervals, clamped to the ends.
 */
export function sampleColorStops(stops: string[], t: number): string {
  if (stops.length === 0) return "#888888";
  if (stops.length === 1) return stops[0];
  const tt = Math.max(0, Math.min(1, t));
  const seg = tt * (stops.length - 1);
  const i = Math.min(Math.floor(seg), stops.length - 2);
  const f = seg - i;
  const a = hexToRgb(stops[i]);
  const b = hexToRgb(stops[i + 1]);
  return rgbToHex(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
}

/** Relative luminance of a hex color (0–1). */
export function relLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Choose a readable text color for a given background hex. */
export function contrastTextColor(bg: string): string {
  return relLuminance(bg) >= 0.4 ? "#0b1020" : "#ffffff";
}
