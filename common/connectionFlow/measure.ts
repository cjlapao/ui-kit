import {
  STATUS_ICON,
  STATUS_TONE,
  type ConnectionFlowItemProgress,
  type ConnectionFlowLayoutOptions,
  type ConnectionFlowNode,
  type ConnectionFlowNodeItem,
  type NodeMetrics,
  type TrueColorLike,
} from "./types";

/**
 * How tall a card is, worked out rather than measured.
 *
 * The layout is pure — no DOM, no `getBoundingClientRect` — because the card
 * silhouette, the ports, the routes and `fit` all depend on geometry that has
 * to exist before the first paint. That means every part of a card's body must
 * be arithmetic, and it is the reason a list of items and a caller-supplied
 * template are two different things: a list has predictable parts, a template
 * has to declare its own height.
 *
 * Everything here reads the same `NodeMetrics` the renderers style themselves
 * from, so the height computed here and the height the DOM produces are the
 * same number.
 */

/** The glyph column plus the text beside it, for a title/subtitle pair. */
const rowHeight = (
  metrics: NodeMetrics,
  hasGlyph: boolean,
  hasSubtitle: boolean,
): number => {
  const text = metrics.titleLine + (hasSubtitle ? metrics.bodyLine : 0);
  return hasGlyph ? Math.max(metrics.glyph, text) : text;
};

/** The node's own title/subtitle line, when it has one. */
export const measureHeader = (
  node: ConnectionFlowNode,
  metrics: NodeMetrics,
): number => {
  if (!node.title && !node.subtitle) return 0;
  return rowHeight(
    metrics,
    Boolean(node.icon ?? node.status),
    Boolean(node.subtitle),
  );
};

// ── Items ───────────────────────────────────────────────────────────────────

/** What occupies an item's leading slot right now. */
export type ItemGlyph =
  | { kind: "spinner"; value: number }
  | { kind: "icon"; name: string }
  | { kind: "none" };

/**
 * The leading slot of an item.
 *
 * A spinner takes the icon's place rather than sitting beside it, and gives it
 * back at 100% — so a row shows what is happening while it happens and what
 * happened once it has. The slot is the same size either way, which is why the
 * glyph metrics are pinned to the range where `CustomIcon` and
 * `ProgressSpinner` render identically.
 */
export const itemGlyph = (
  item: ConnectionFlowNodeItem,
  fallbackProgress: ConnectionFlowItemProgress,
): ItemGlyph => {
  const progressType = item.progressType ?? fallbackProgress;
  if (
    progressType === "spinner" &&
    item.progress !== undefined &&
    item.progress < 1
  ) {
    return { kind: "spinner", value: item.progress };
  }
  const name = item.icon ?? (item.status ? STATUS_ICON[item.status] : undefined);
  return name ? { kind: "icon", name } : { kind: "none" };
};

/**
 * An item's tone: its own if set, else its status's, else the card's.
 *
 * Resolved here rather than in each renderer — the first version fell through
 * to the node's tone unconditionally, so a `failed` row inside a `succeeded`
 * card came out green.
 */
export const itemTone = (
  item: ConnectionFlowNodeItem,
  fallback: TrueColorLike,
): TrueColorLike =>
  item.tone ?? (item.status ? STATUS_TONE[item.status] : fallback);

/** Whether an item draws a full-width bar under its text. */
export const itemHasBar = (
  item: ConnectionFlowNodeItem,
  fallbackProgress: ConnectionFlowItemProgress,
): boolean =>
  (item.progressType ?? fallbackProgress) === "bar" &&
  item.progress !== undefined;

/**
 * Whether the list reserves a leading column.
 *
 * Decided for the whole list, not per row: with it per row, a list where only
 * some items carry a glyph had its titles stepping in and out, and a row whose
 * spinner finished would shift sideways as the slot vanished.
 */
export const itemsReserveGlyph = (
  items: ConnectionFlowNodeItem[],
  fallbackProgress: ConnectionFlowItemProgress,
): boolean =>
  items.some((item) => itemGlyph(item, fallbackProgress).kind !== "none");

export const measureItem = (
  item: ConnectionFlowNodeItem,
  metrics: NodeMetrics,
  fallbackProgress: ConnectionFlowItemProgress,
  reserveGlyph: boolean,
): number =>
  rowHeight(metrics, reserveGlyph, Boolean(item.subtitle)) +
  (itemHasBar(item, fallbackProgress) ? metrics.gap + metrics.barHeight : 0);

export interface VisibleItems {
  items: ConnectionFlowNodeItem[];
  /** Rows folded away behind the "show more" row. */
  hidden: number;
}

/**
 * The rows a card actually shows. Expanding changes the card's height, and so
 * the ports, the silhouette and every route — which is why the expanded set is
 * an input to the layout rather than state the renderer keeps to itself.
 */
export const visibleItems = (
  node: ConnectionFlowNode,
  options: ConnectionFlowLayoutOptions,
  expanded?: ReadonlySet<string>,
): VisibleItems => {
  const items = node.items ?? [];
  const max = node.maxItems ?? options.maxVisibleItems;
  if (expanded?.has(node.id) || max <= 0 || items.length <= max) {
    return { items, hidden: 0 };
  }
  return { items: items.slice(0, max), hidden: items.length - max };
};

export const measureItems = (
  node: ConnectionFlowNode,
  options: ConnectionFlowLayoutOptions,
  expanded?: ReadonlySet<string>,
): number => {
  const metrics = options.metrics;
  const all = node.items ?? [];
  if (all.length === 0) return 0;
  const fallback = node.itemProgress ?? options.itemProgress;
  const reserve = itemsReserveGlyph(all, fallback);
  const { items, hidden } = visibleItems(node, options, expanded);

  let height = items.reduce(
    (sum, item, index) =>
      sum +
      measureItem(item, metrics, fallback, reserve) +
      (index > 0 ? metrics.itemGap : 0),
    0,
  );
  if (hidden > 0) height += metrics.itemGap + metrics.moreRow;
  return height;
};

export const measureNodeBody = (
  node: ConnectionFlowNode,
  metrics: NodeMetrics,
): number => {
  let height = 0;
  if (node.description) height += metrics.gap + metrics.bodyLine;
  if (node.progress !== undefined) {
    height += metrics.gap + metrics.barHeight;
  }
  return height;
};

/**
 * Height of a node box.
 *
 * A node that declares its own `height` gets exactly that: a caller-supplied
 * template cannot be measured, so it says how much room it needs and scrolls
 * inside it.
 */
export const measureNode = (
  node: ConnectionFlowNode,
  options: ConnectionFlowLayoutOptions,
  expanded?: ReadonlySet<string>,
): number => {
  const metrics = options.metrics;
  if (node.height !== undefined) return node.height;

  const header = measureHeader(node, metrics);
  const items = measureItems(node, options, expanded);
  const body = measureNodeBody(node, metrics);
  const content =
    header + (header > 0 && items > 0 ? metrics.gap : 0) + items + body;
  // A card never comes out shorter than the base height for its size, so a
  // sparse row still lines up with the ones beside it.
  const natural = Math.max(metrics.height, metrics.padding * 2 + content);
  return node.maxHeight !== undefined
    ? Math.min(natural, node.maxHeight)
    : natural;
};

/**
 * Whether a card's body scrolls: explicit if stated, otherwise whenever the
 * card has been capped below what its contents need.
 */
export const nodeScrolls = (
  node: ConnectionFlowNode,
  options: ConnectionFlowLayoutOptions,
  expanded?: ReadonlySet<string>,
): boolean => {
  if (node.scrollable !== undefined) return node.scrollable;
  if (node.height !== undefined) return true;
  if (node.maxHeight === undefined) return false;
  const uncapped = measureNode(
    { ...node, maxHeight: undefined },
    options,
    expanded,
  );
  return uncapped > node.maxHeight;
};

/** Total vertical space a node needs, including its child sub-tree. */
export const measureBranch = (
  node: ConnectionFlowNode,
  options: ConnectionFlowLayoutOptions,
  expanded?: ReadonlySet<string>,
): number => {
  const own = measureNode(node, options, expanded);
  const children = node.children ?? [];
  if (children.length === 0) return own;
  const childHeight = children.reduce(
    (sum, child, index) =>
      sum +
      measureBranch(child, options, expanded) +
      (index > 0 ? options.childGap : 0),
    0,
  );
  return own + options.childGap + childHeight;
};


// ── Travelling dots ─────────────────────────────────────────────────────────

/**
 * When a dot leaves, how long it is in flight, and how long until the next
 * one leaves the same source.
 *
 * Every dot in the graph moves at the same speed, so its flight time comes
 * from the route's own length. Before this every edge used a fixed 2.4s
 * whatever its length, which made a short track hop crawl while a long bypass
 * arc raced — the two read as unrelated animations rather than one flow.
 */
export interface DotTiming {
  /** Seconds for one full cycle of this edge's dot. */
  cycle: number;
  /** Where in that cycle the dot arrives, 0–1. */
  arrival: number;
  /** Seconds of phase offset, negative so the cycle is already under way. */
  begin: number;
}

export const dotTiming = (
  length: number,
  /** Position in its source's round-robin, how many share it, and its span. */
  emitIndex: number,
  emitCount: number,
  emitSpan: number,
  /** Px per second. */
  speed: number,
  /** Seconds between one dot leaving a source and the next. */
  interval: number,
): DotTiming => {
  const rate = Math.max(1, speed);
  // The cycle belongs to the group, not to one edge: derived per edge, a
  // round-robin containing one long route falls out of step with itself.
  // Sized to the longest route, the rhythm is shared and every dot keeps the
  // same speed — the emitter just waits for its furthest target.
  const cycle = Math.max(interval * Math.max(1, emitCount), emitSpan / rate);
  return {
    cycle,
    arrival: Math.min(1, length / rate / cycle),
    begin: -(emitIndex * interval),
  };
};
