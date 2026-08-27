/**
 * Treemap engine — squarified layout (Bruls, Huizing, van Wijk) and
 * grouped-region layout. Pure geometry: no scales, no drawing.
 *
 * A treemap is self-contained (no cartesian scales): the series owns
 * the tile grid inside the plot area. This module computes the layout —
 * one region per group (by group total), a header band per group, and
 * squarified child tiles per region.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TreemapGroupLayout {
  name: string;
  /** Outer region of the group (includes the header band). */
  rect: Rect;
  /** Header band height (0 for the flat layout). */
  headerH: number;
  /** Region below the header band where the tiles are laid out. */
  body: Rect;
  /** One rect per child, in child (descending-sorted) order. */
  tiles: Rect[];
}

/**
 * Squarify `values` (already descending, positive) into `area`. Returns
 * one rect per value in input order; the tiles tile the area exactly.
 * Degenerate (zero/negative area or total): all rects are zero-sized at
 * the area origin.
 */
export function squarifyArea(area: Rect, values: number[]): Rect[] {
  const n = values.length;
  const out: Rect[] = new Array(n);
  if (n === 0) return out;
  const total = values.reduce((a, b) => a + b, 0);
  if (total <= 0 || area.width <= 0 || area.height <= 0) {
    for (let i = 0; i < n; i++) out[i] = { x: area.x, y: area.y, width: 0, height: 0 };
    return out;
  }
  // Scale so that the whole area is filled exactly.
  const scale = (area.width * area.height) / total;
  let x = area.x;
  let y = area.y;
  let w = area.width;
  let h = area.height;
  let i = 0;
  let row: number[] = [];
  let rowIdx: number[] = [];
  let alongWidth = w >= h;

  const worst = (row: number[], side: number): number => {
    // Standard squarified worst-aspect-ratio for a row of values laid
    // along a side of length `side`.
    let lo = Infinity;
    let hi = -Infinity;
    let s = 0;
    for (const v of row) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
      s += v;
    }
    return Math.max((side * side * hi) / (s * s), (s * s) / (side * side * lo));
  };

  const closeRow = () => {
    if (row.length === 0) return;
    const s = row.reduce((a, b) => a + b, 0);
    if (alongWidth) {
      // Row across the width: thickness t = s / w, tiles left -> right.
      const t = s / w;
      let cx = x;
      for (let k = 0; k < row.length; k++) {
        const tw = (row[k] / s) * w;
        out[rowIdx[k]] = { x: cx, y: y, width: tw, height: t };
        cx += tw;
      }
      y += t;
      h -= t;
    } else {
      // Row down the height (left-anchored strip): thickness t = s / h,
      // tiles top -> bottom.
      const t = s / h;
      let cy = y;
      for (let k = 0; k < row.length; k++) {
        const th = (row[k] / s) * h;
        out[rowIdx[k]] = { x: x, y: cy, width: t, height: th };
        cy += th;
      }
      x += t;
      w -= t;
    }
    row = [];
    rowIdx = [];
    alongWidth = w >= h;
  };

  while (i < n) {
    const v = values[i] * scale;
    row.push(v);
    rowIdx.push(i);
    const side = alongWidth ? w : h;
    if (i + 1 < n) {
      const next = values[i + 1] * scale;
      if (worst([...row, next], side) > worst(row, side)) closeRow();
    }
    i++;
  }
  closeRow();
  return out;
}

export interface TreemapGroupInput {
  name: string;
  /** Child values in display (descending) order. */
  values: number[];
}

export interface TreemapLayout {
  groups: TreemapGroupLayout[];
}

/**
 * Lay out grouped treemap regions: regions are squarified by group
 * total; each group keeps a `headerHeight` band on top and squarifies
 * its children in the remaining body. Flat data is a single group with
 * headerHeight 0.
 */
export function computeTreemapLayout(
  area: Rect,
  groups: TreemapGroupInput[],
  headerHeight: number,
): TreemapLayout {
  const n = groups.length;
  const totals = groups.map((g) => g.values.reduce((a, b) => a + b, 0));
  // Descending order of groups (stable for equal totals).
  const order = groups
    .map((_, i) => i)
    .sort((a, b) => totals[b] - totals[a]);
  const sorted = order.map((i) => totals[i]);
  const regionRects = squarifyArea(area, sorted);

  const out: TreemapGroupLayout[] = new Array(n);
  for (let k = 0; k < n; k++) {
    const gi = order[k];
    const g = groups[gi];
    const region = regionRects[k];
    const hh = n === 1 ? 0 : Math.min(headerHeight, region.height / 2);
    const body: Rect =
      hh > 0
        ? { x: region.x, y: region.y + hh, width: region.width, height: Math.max(region.height - hh, 0) }
        : { ...region };
    const childOrder = g.values.map((_, i2) => i2).sort((a, b) => g.values[b] - g.values[a]);
    const childSorted = childOrder.map((i2) => g.values[i2]);
    const childRects = squarifyArea(body, childSorted);
    const tiles = new Array<Rect>(g.values.length);
    for (let t = 0; t < childOrder.length; t++) tiles[childOrder[t]] = childRects[t];
    out[gi] = {
      name: g.name,
      rect: region,
      headerH: hh,
      body,
      tiles,
    };
  }
  return { groups: out };
}

export interface TreemapHit {
  group: number;
  /** Child index, or -1 when the header band is hit. */
  tile: number;
}

/** Point hit-test over a grouped layout. */
export function hitTestTreemap(
  layout: TreemapLayout,
  px: number,
  py: number,
): TreemapHit | null {
  for (let g = 0; g < layout.groups.length; g++) {
    const gr = layout.groups[g];
    const r = gr.rect;
    if (px < r.x || px >= r.x + r.width || py < r.y || py >= r.y + r.height)
      continue;
    if (gr.headerH > 0 && py < r.y + gr.headerH) return { group: g, tile: -1 };
    for (let t = 0; t < gr.tiles.length; t++) {
      const c = gr.tiles[t];
      if (c.width <= 0 || c.height <= 0) continue;
      if (px >= c.x && px < c.x + c.width && py >= c.y && py < c.y + c.height)
        return { group: g, tile: t };
    }
    // Inside the region but between tiles (gaps): closest tile? No —
    // gaps are intentionally not hoverable.
    return null;
  }
  return null;
}
