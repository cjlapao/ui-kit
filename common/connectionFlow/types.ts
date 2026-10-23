import { CONTROL_SIZES, SURFACE_CORNERS } from "../theme/Theme";
import type { ControlSize, SurfaceCorner, TrueColor } from "../theme/Theme";
import type { PortSide } from "./router";

/**
 * How an edge is behaving. `flowing` animates, `stopped` is a solid traversed
 * edge, `disabled` is a dashed not-yet-reached one.
 */
export const CONNECTION_STATES = ["flowing", "stopped", "disabled"] as const;
export type ConnectionState = (typeof CONNECTION_STATES)[number];

/** Shape of the edge drawn between two nodes. */
export const CONNECTION_FLOW_EDGE_STYLES = [
  "orthogonal",
  "curved",
  "straight",
] as const;
export type ConnectionFlowEdgeStyle =
  (typeof CONNECTION_FLOW_EDGE_STYLES)[number];

/**
 * How a card's children attach — the elbow fan, or the walked grid.
 * @see ConnectionFlowNode.childLayout
 */
export const CONNECTION_FLOW_CHILD_LAYOUTS = ["fan", "chain"] as const;
export type ConnectionFlowChildLayout =
  (typeof CONNECTION_FLOW_CHILD_LAYOUTS)[number];

/**
 * How the whole component reports that it is loading.
 *
 * `skeleton` is the default because it is the only one that holds the card's
 * shape: a spinner or a bar collapses the frame and the layout jumps when the
 * real graph arrives.
 */
export const CONNECTION_FLOW_LOADERS = [
  "skeleton",
  "spinner",
  "progress",
] as const;
export type ConnectionFlowLoader = (typeof CONNECTION_FLOW_LOADERS)[number];

/** What the in-progress indicator looks like. Only one is ever shown. */
export const CONNECTION_FLOW_PROGRESS_TYPES = ["none", "bar", "spinner"] as const;
export type ConnectionFlowProgressType =
  (typeof CONNECTION_FLOW_PROGRESS_TYPES)[number];

/**
 * How a node relates to the one before it — the "connection type" borrowed
 * from `TreeView`, so a flow can express structure as well as sequence.
 */
export const CONNECTION_FLOW_NODE_KINDS = [
  /** Follows the previous node on the main horizontal track. */
  "step",
  /** Runs at the same time as its siblings; drawn stacked, fanned in and out. */
  "parallel",
  /** Hangs vertically below its parent, TreeView-style. */
  "child",
  /** A decision point — successors are alternatives, not a sequence. */
  "branch",
] as const;
export type ConnectionFlowNodeKind =
  (typeof CONNECTION_FLOW_NODE_KINDS)[number];

/**
 * Size of the bulge a node's border takes around a connector. `fit` drops the
 * bulge entirely, leaving the core dot alone on the border. The rest are the
 * shared control scale, so a terminal and the controls beside it are described
 * in one language.
 */
export const CONNECTION_FLOW_RING_SIZES = [...CONTROL_SIZES, "fit"] as const;
export type ConnectionFlowRingSize =
  (typeof CONNECTION_FLOW_RING_SIZES)[number];

/**
 * Radius of the border's bulge, in px, per ring size.
 *
 * A terminal is the node's border detouring around the port — a half-circle
 * springing from the border line — with a solid core dot at the centre that
 * the edge attaches to. The two radii are related rather than independent so
 * the proportion holds at every size.
 */
export const CONNECTOR_RING_RADIUS: Record<ConnectionFlowRingSize, number> = {
  fit: 2,
  xs: 4,
  sm: 5,
  md: 6,
  lg: 7,
  xl: 9,
};

/** Radius of the solid core dot for a given bulge radius. */
export const connectorDotRadius = (ringRadius: number): number =>
  Math.max(1.75, ringRadius * 0.45);

/**
 * Below this the bulge is indistinguishable from the dot sitting in it, so the
 * outline stays straight and only the dot is drawn. This is what `fit` means.
 */
export const CONNECTOR_BULGE_MIN = 2.5;

export interface ConnectionFlowConnectorConfig {
  state?: ConnectionState;
  animated?: boolean;
  /** Size of the border bulge on both ends of this edge. */
  ringSize?: ConnectionFlowRingSize;
  /** Edge shape override for this one edge. */
  edgeStyle?: ConnectionFlowEdgeStyle;
  /** Force the source-side tone instead of inheriting it from the source node. */
  sourceTone?: TrueColor;
  /** Force the target-side tone instead of inheriting it from this node. */
  targetTone?: TrueColor;
  /** Draw travelling dots on a `stopped` edge as well as a `flowing` one. */
  animateCompleted?: boolean;
  /** Caption rendered along the edge. */
  label?: string;
}

/**
 * One of a card's two outcomes, as an edge. `success` without a `to` is the
 * implicit next step and draws nothing extra — it only restyles the walk
 * edge. `failure` always names its target: there is no implicit failure.
 */
export interface ConnectionFlowBranch {
  /** Target node id. */
  to?: string;
  /** @default emerald for success, rose for failure (`STATUS_TONE`). */
  tone?: TrueColor;
  /** Caption along the edge (no default text — the kit ships no strings). */
  label?: string;
}

/**
 * What happened to a step, as opposed to what colour it is.
 *
 * A flow almost always has a status per node already; before this it had to be
 * hand-translated into a tone at every call site, which is how a demo ends up
 * with `red` on one card and `rose` on the next. `tone` still wins when it is
 * set, so a status is a default rather than a constraint.
 */
export const CONNECTION_FLOW_STATUSES = [
  "succeeded",
  "running",
  "failed",
  "pending",
  "skipped",
] as const;
export type ConnectionFlowStatus = (typeof CONNECTION_FLOW_STATUSES)[number];

export const STATUS_TONE: Record<ConnectionFlowStatus, TrueColor> = {
  succeeded: "emerald",
  running: "blue",
  failed: "rose",
  pending: "neutral",
  skipped: "neutral",
};

/**
 * Glyph for a status, used only when the node names no icon of its own.
 *
 * A status that showed as colour alone would be invisible to anyone who
 * cannot separate emerald from rose, and `pending` and `skipped` share a tone
 * outright — the same reason `MultiSelectPills` offers a check mark.
 */
export const STATUS_ICON: Record<ConnectionFlowStatus, string> = {
  succeeded: "CheckCircle",
  running: "Run",
  failed: "Error",
  pending: "Pause",
  skipped: "Close",
};

/** Alias used where a tone is threaded through helpers. */
export type TrueColorLike = TrueColor;

/** How an item shows its progress. */
export const CONNECTION_FLOW_ITEM_PROGRESS = ["none", "bar", "spinner"] as const;
export type ConnectionFlowItemProgress =
  (typeof CONNECTION_FLOW_ITEM_PROGRESS)[number];

/**
 * One row inside a node card.
 *
 * Deliberately a fixed shape rather than free content: the layout is pure, so
 * a card's height has to be arithmetic, and a list of known parts can be
 * measured where a caller-supplied template cannot. A node that needs
 * arbitrary content uses the template slot and declares its own `height`.
 */
export interface ConnectionFlowNodeItem {
  id: string;
  title: string;
  subtitle?: string;
  /** Registry icon name. A spinner takes this slot while progress is running. */
  icon?: string;
  /** Picks the tone and, with no icon, the glyph — as it does on a node. */
  status?: ConnectionFlowStatus;
  tone?: TrueColor;
  /** 0–1. */
  progress?: number;
  /** Where that progress is drawn. Defaults to the node's `itemProgress`. */
  progressType?: ConnectionFlowItemProgress;
}

export interface ConnectionFlowNode {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  /** Registry icon name. A node icon in canvas mode must be a name, not a node. */
  icon?: string;
  /**
   * What happened to this step. Picks the tone and, when the node names no
   * icon, the glyph — and implies `active` for `running` and `skipped` for
   * `skipped`, so the semantics are stated once rather than three times.
   */
  status?: ConnectionFlowStatus;
  /** Overrides whatever tone `status` would have chosen. */
  tone?: TrueColor;
  /** Currently executing — drives the flow animation and the pulse. */
  active?: boolean;
  /** 0–1. Draws the node's own progress indicator. */
  progress?: number;
  /** Overrides the flow-level progress indicator for this node. */
  progressType?: ConnectionFlowProgressType;
  /** Bypassed — a arc is drawn over it from its last live predecessor. */
  skipped?: boolean;
  /** Emits no edge to the following node. */
  terminal?: boolean;
  /** How this node attaches to the flow. @default "step" */
  kind?: ConnectionFlowNodeKind;
  /**
   * Which parallel column this lane belongs to.
   *
   * Consecutive `parallel` nodes form one column, which left no way to put two
   * multi-lane columns next to each other — five lanes in a row became one
   * column of five rather than three lanes feeding two. A change of `group`
   * starts a new column. Nodes that do not set it all share the same
   * (undefined) group, so a single run behaves exactly as before.
   */
  group?: string;
  /**
   * Rows inside the card, below the title and subtitle.
   *
   * Measurable, unlike the template slot — which is why they are a fixed shape
   * and why a card built from them needs no declared height.
   */
  items?: ConnectionFlowNodeItem[];
  /** Where an item's progress is drawn, unless the item overrides it. */
  itemProgress?: ConnectionFlowItemProgress;
  /**
   * Rows shown before the "show more" row appears. Overrides the flow's
   * `maxVisibleItems`.
   */
  maxItems?: number;
  /** Nodes hanging vertically below this one. */
  children?: ConnectionFlowNode[];
  /**
   * How `children` attach.
   *
   * - `"fan"` (default) is today: every child gets its own elbow from the
   *   parent, hanging below it, indented.
   * - `"chain"` reads `rows` (or `children`, one card per row) as a grid:
   *   the flow enters the first card, walks each row left→right, and drops
   *   from the last card of a row into the first card of the next. The
   *   parent becomes a pure container — it emits no edge onward; the grid's
   *   last card carries the connection to the parent's next sibling.
   *
   * @default "fan"
   */
  childLayout?: ConnectionFlowChildLayout;
  /**
   * Rows for `childLayout: "chain"` — each row walks left→right, rows are
   * walked top→bottom. Cards keep the standard size; a longer row widens
   * the grid (longer connectors), never the cards.
   */
  rows?: ConnectionFlowNode[][];
  /**
   * Where this card goes when it succeeds. Without `to` it follows the
   * implicit next step (the track, or the chain walk); with `to` the
   * successor points there instead. Emerald unless `tone` says otherwise.
   */
  success?: ConnectionFlowBranch;
  /**
   * Where this card goes when it fails — usually upstream (a loop-back
   * that re-enters the target from the top, so the flow can run the chain
   * down again). Rose unless `tone` says otherwise. Always drawn: topology
   * stays visible while the flow runs; only its liveliness follows status.
   */
  failure?: ConnectionFlowBranch;
  /** Config for the edge leading *into* this node. */
  connector?: ConnectionFlowConnectorConfig;
  /**
   * Exact card height, in px.
   *
   * A caller-supplied body cannot be measured — the layout is pure, and the
   * card's silhouette has to exist before the first paint — so a templated
   * node says how much room it needs and its content scrolls inside that.
   * Ignored for a node whose body is built from `items`, which is measurable.
   */
  height?: number;
  /**
   * Caps the card's height and scrolls the body past it.
   *
   * A measurable body (`items`, or a title and subtitle) can outgrow the room
   * you want to give it; this is how you say so without having to work out the
   * exact height yourself. Ignored when `height` is set, which is already
   * exact.
   */
  maxHeight?: number;
  /**
   * Whether the body scrolls. Defaults to true when the card is capped —
   * a cap with no scroll is content you have hidden rather than contained.
   */
  scrollable?: boolean;
  /** Excluded from hit-testing, hover and selection. */
  disabled?: boolean;
  /** Arbitrary payload handed back on click and hover. */
  data?: unknown;
}

// ── Layout output ───────────────────────────────────────────────────────────
// Pure geometry. No DOM, no framework: both kits and both renderers consume it.

export interface LaidOutNode {
  id: string;
  node: ConnectionFlowNode;
  /**
   * The card's silhouette: a rounded rectangle detouring around each of its
   * ports. The card is painted from this path rather than from a CSS border,
   * because a terminal is the node bulging — no chord across it, and the same
   * fill inside — which no border can express.
   */
  outline: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Y of the horizontal connection point, relative to the node's own top. */
  anchorY: number;
  /** Column index on the main track. */
  column: number;
  /** Depth below the main track: 0 for the track itself. */
  depth: number;
  tone: TrueColor;
  /**
   * Whether this card's body scrolls. Resolved in the layout, because the
   * answer depends on the height it was measured to — not something a
   * renderer should work out for itself, twice.
   */
  scrollable: boolean;
}

export interface LaidOutEdge {
  id: string;
  fromId: string | null;
  toId: string;
  state: ConnectionState;
  /** Waypoints in layout space, for label placement and measurement. */
  points: { x: number; y: number }[];
  /**
   * The SVG path. The travelling dots follow this same string, so the dots
   * and the line they sit on can never disagree about the route.
   */
  d: string;
  /** Measured, collision-free caption bounds in layout coordinates. */
  caption?: { x: number; y: number; width: number; height: number; lines: string[]; lineHeight: number };
  sourceTone: TrueColor;
  targetTone: TrueColor;
  /** A bypass arc travels *over* skipped nodes rather than between neighbours. */
  bypass: boolean;
  /**
   * The style this edge's corners are drawn in. The crossing-hop pass
   * rebuilds a crossing edge's path exactly as the router would have drawn
   * it, which needs the style the edge was routed with — `edgeStyle`
   * governs corners only, so hops are round on every style.
   */
  style?: ConnectionFlowEdgeStyle;
  /**
   * Position in its source's emission round-robin, and how many edges share
   * that round-robin.
   *
   * A source releases one dot at a time — to its first target, then its
   * second, and so on before coming round again — so a fan reads as a source
   * feeding its targets in turn rather than as a swarm of independent streams.
   * Only animated edges take a slot.
   */
  emitIndex: number;
  emitCount: number;
  /**
   * The longest route in that round-robin, in px.
   *
   * The cycle is a property of the *group*, not of one edge: derive it from
   * each edge's own length and a group containing one long route falls out of
   * step with itself. Sizing it to the longest route keeps the rhythm shared
   * and every dot at the same speed — the emitter simply waits for its
   * furthest target.
   */
  emitSpan: number;
  animated: boolean;
  label?: string;
  /**
   * What kind of connection this is. Optional for backward compatibility —
   * renderers treat everything as the track edge it always drew; the tests
   * and the chain/branch passes are explicit.
   */
  kind?: "track" | "chain" | "branch";
  /** Set when `kind` is `"branch"`. */
  branchKind?: "success" | "failure";
}

/** A distinct terminal for one edge endpoint, allocated on a node border.
 * Fan-in and fan-out edges retain independent anchors and highlight states.
 */
export interface LaidOutConnector {
  id: string;
  /** The node this connector sits on. */
  nodeId: string;
  x: number;
  y: number;
  /** Which border of the node it sits on. */
  side: PortSide;
  tone: TrueColor;
  /** State of the edge attached to this terminal. */
  state: ConnectionState;
  /** Something is flowing through this terminal. */
  active: boolean;
  /** The single edge attached here; retained as an array for API compatibility. */
  edgeIds: string[];
  /** Radius of the border's bulge, in px. */
  radius: number;
}

export interface ConnectionFlowLayout {
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  connectors: LaidOutConnector[];
  width: number;
  height: number;
  /**
   * How far the content overhangs the origin, as a negative number or zero.
   * A bypass arc lifts above `y = 0`, so a renderer that starts drawing at the
   * origin clips it; shifting by this puts the whole graph back in view.
   */
  offsetX: number;
  offsetY: number;
}

/**
 * Every number the node body is built from, per shared control size.
 *
 * One table, read by both the arithmetic and the CSS. The previous version
 * declared `padding`, `title` and `body` and nothing read them: the renderers
 * hardcoded `padding: 10`, `text-[13px]` and `text-[11px]`, so an `xs` flow and
 * an `xl` flow had identical type and inset while only the box changed size.
 * That was cosmetic while a card held two fixed lines. It is structural the
 * moment a card holds a measured list, because the height the layout computes
 * and the height the DOM renders have to be the same number.
 */
export interface NodeMetrics {
  width: number;
  /** Inset on all four sides. */
  padding: number;
  /** Title type size and the line box it occupies. */
  title: number;
  titleLine: number;
  /** Subtitle and description type size, and their line box. */
  body: number;
  bodyLine: number;
  /** Space between the header, the item list and a progress bar. */
  gap: number;
  /** Space between one item and the next. */
  itemGap: number;
  /** The leading glyph box — an icon, or the spinner that replaces it. */
  glyph: number;
  /**
   * Control size for that glyph. Restricted to the range where `CustomIcon`
   * and `ProgressSpinner` render the same px (16 / 20 / 24), so a spinner can
   * take the icon's place without the row shifting under it.
   */
  glyphSize: ControlSize;
  /** Control size for a progress bar, and the height it actually renders at. */
  barSize: ControlSize;
  barHeight: number;
  /** The "show more" row. */
  moreRow: number;
  /** A card holding a title and a subtitle and nothing else. Derived. */
  height: number;
}

const nodeMetrics = (m: Omit<NodeMetrics, "height">): NodeMetrics => ({
  ...m,
  // Derived rather than written down, so the base height and the type it has
  // to hold cannot disagree.
  height: m.padding * 2 + m.titleLine + m.bodyLine,
});

export const NODE_METRICS: Record<ControlSize, NodeMetrics> = {
  xs: nodeMetrics({
    width: 190, padding: 10, title: 11, titleLine: 15, body: 9, bodyLine: 13,
    gap: 4, itemGap: 5, glyph: 16, glyphSize: "xs", barSize: "xs",
    barHeight: 4, moreRow: 16,
  }),
  sm: nodeMetrics({
    width: 230, padding: 12, title: 12, titleLine: 16, body: 10, bodyLine: 14,
    gap: 5, itemGap: 6, glyph: 20, glyphSize: "sm", barSize: "xs",
    barHeight: 4, moreRow: 18,
  }),
  md: nodeMetrics({
    width: 270, padding: 14, title: 13, titleLine: 19, body: 11, bodyLine: 16,
    gap: 6, itemGap: 8, glyph: 20, glyphSize: "sm", barSize: "sm",
    barHeight: 6, moreRow: 20,
  }),
  lg: nodeMetrics({
    width: 310, padding: 16, title: 15, titleLine: 21, body: 12, bodyLine: 18,
    gap: 7, itemGap: 9, glyph: 24, glyphSize: "md", barSize: "sm",
    barHeight: 6, moreRow: 22,
  }),
  xl: nodeMetrics({
    width: 350, padding: 18, title: 17, titleLine: 24, body: 13, bodyLine: 20,
    gap: 8, itemGap: 10, glyph: 24, glyphSize: "md", barSize: "md",
    barHeight: 8, moreRow: 24,
  }),
};

export interface ConnectionFlowLayoutOptions {
  /**
   * Everything the card body is built from. Held whole rather than copied
   * field by field, so the layout and the renderers measure from one table.
   */
  metrics: NodeMetrics;
  connectorWidth: number;
  /** Vertical gap between stacked parallel nodes. */
  laneGap: number;
  /** Vertical gap between a node and its children. */
  childGap: number;
  /** Horizontal indent for child nodes. */
  childIndent: number;
  /**
   * Vertical gap between the rows of a chained child grid. Wider than the
   * child gap on purpose: the ladder has to read as a ladder, and the
   * engine's crossing hops need air in the corridors the rows define.
   * @default 20
   */
  rowGap: number;
  /** Left inset of a chained child grid under its parent. @default childIndent */
  gridIndent: number;
  edgeStyle: ConnectionFlowEdgeStyle;
  /** Corner radius on an orthogonal edge. */
  cornerRadius: number;
  /** How far above everything in the way a bypass arc travels. */
  bypassLift: number;
  /**
   * How far outside a card the path engine will route. An edge whose naive
   * route crosses a card is re-routed through lanes at least this far from
   * every card face, so it clears the terminal bulges too. @default 12
   */
  pathClearance: number;
  /** Default size of the border bulge where an edge meets a node. */
  ringSize: ConnectionFlowRingSize;
  /** Rows a card shows before the rest collapse behind "show more". */
  maxVisibleItems: number;
  /** Where an item draws its progress, unless the item or its node says. */
  itemProgress: ConnectionFlowItemProgress;
  /** Corner radius of a node card, in px. Drives the outline path. */
  nodeCornerRadius: number;
  padding: number;
}

export const DEFAULT_LAYOUT_OPTIONS: ConnectionFlowLayoutOptions = {
  metrics: NODE_METRICS.md,
  connectorWidth: 72,
  laneGap: 16,
  childGap: 12,
  childIndent: 28,
  rowGap: 20,
  gridIndent: 28,
  edgeStyle: "orthogonal",
  cornerRadius: 8,
  bypassLift: 18,
  pathClearance: 12,
  ringSize: "md",
  maxVisibleItems: 2,
  itemProgress: "bar",
  nodeCornerRadius: 10,
  padding: 24,
};

/**
 * Corner radius in px per shared surface corner.
 *
 * Derived from `SURFACE_CORNERS` rather than written out, so a member added to
 * or removed from the shared scale is a compile error here instead of a silent
 * `undefined` radius. (`rounded-full` and `pill` were in the scale when this
 * component was first written and are not now.)
 */
const CORNER_RADIUS_PX: Record<string, number> = {
  none: 0,
  rounded: 2,
  "rounded-sm": 6,
  "rounded-md": 10,
  "rounded-lg": 14,
  "rounded-xl": 18,
  "rounded-full": 999,
  pill: 999,
};

export const NODE_CORNER_RADIUS = Object.fromEntries(
  SURFACE_CORNERS.map((corner) => [corner, CORNER_RADIUS_PX[corner] ?? 10]),
) as Record<SurfaceCorner, number>;


// ── Reading a node ──────────────────────────────────────────────────────────
// `status` is a shorthand for a tone, a glyph, and two flags. These resolve it
// consistently so the layout and both renderers cannot disagree about what a
// node means.

/** The node's tone: its own if set, else its status's, else neutral. */
export const nodeTone = (node: ConnectionFlowNode | undefined): TrueColor =>
  node?.tone ?? (node?.status ? STATUS_TONE[node.status] : "neutral");

/** The node's glyph: its own if set, else its status's. */
export const nodeIcon = (
  node: ConnectionFlowNode | undefined,
): string | undefined =>
  node?.icon ?? (node?.status ? STATUS_ICON[node.status] : undefined);

/** Whether the node is executing. `status: "running"` implies it. */
export const nodeIsActive = (node: ConnectionFlowNode | undefined): boolean =>
  node?.active ?? node?.status === "running";

/** Whether the node failed — what makes its failure edge the live one. */
export const nodeHasFailed = (node: ConnectionFlowNode | undefined): boolean =>
  node?.status === "failed";

/**
 * The chain grid's rows, however they were written: `rows` verbatim, or a
 * flat `children` array promoted to one card per row. Fan callers never
 * call this.
 */
export const toRows = (node: ConnectionFlowNode): ConnectionFlowNode[][] =>
  node.rows ?? (node.children ?? []).map((child) => [child]);

/**
 * Whether the node is bypassed. Tri-state on purpose: `undefined` means "no
 * opinion", which is what lets `autoState` infer it, while an explicit
 * `skipped: false` overrides even `status: "skipped"`.
 */
export const nodeIsSkipped = (
  node: ConnectionFlowNode | undefined,
): boolean | undefined =>
  node?.skipped ?? (node?.status === "skipped" ? true : undefined);
