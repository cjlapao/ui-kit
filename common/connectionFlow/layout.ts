import type { TrueColor } from "../theme/Theme";
import {
  nodeOutline,
  port,
  routeLength,
  portAt,
  routePorts,
  selectSides,
  type Box,
  type OutlineBulge,
  type Port,
} from "./router";
import {
  CONNECTOR_BULGE_MIN,
  CONNECTOR_RING_RADIUS,
  DEFAULT_LAYOUT_OPTIONS,
  connectorDotRadius,
  nodeIsActive,
  nodeIsSkipped,
  nodeTone,
  type ConnectionFlowConnectorConfig,
  type ConnectionFlowLayout,
  type ConnectionFlowLayoutOptions,
  type ConnectionFlowNode,
  type ConnectionState,
  type LaidOutConnector,
  type LaidOutEdge,
  type LaidOutNode,
} from "./types";
import { measureBranch, measureNode, nodeScrolls } from "./measure";

/**
 * How lively a state is. Where several edges meet at one terminal the
 * connector takes the liveliest of them — a port that still has something
 * running through it should not read as finished because a second, completed
 * edge also lands on it.
 */
const STATE_RANK: Record<ConnectionState, number> = {
  disabled: 0,
  stopped: 1,
  flowing: 2,
};

/**
 * A column on the main track: one `step`/`branch` node, or a stack of
 * consecutive `parallel` ones.
 */
interface Column {
  nodes: ConnectionFlowNode[];
  parallel: boolean;
}

/**
 * Tone, activity and bypassing all come from the same reader, so a node's
 * `status` means the same thing to the layout as it does to the renderers.
 */
const toneOf = nodeTone;

/**
 * Groups consecutive `parallel` nodes into one column. The old implementation
 * did this three separate times per render — once for the groups, once for the
 * auto-skipped set and once for the bypass arcs — from the same input, so the
 * three could disagree if any of the three copies were edited. It happens once
 * here and the result is threaded through.
 */
export const buildColumns = (nodes: ConnectionFlowNode[]): Column[] => {
  const columns: Column[] = [];
  let i = 0;
  while (i < nodes.length) {
    if (nodes[i].kind === "parallel") {
      const batch: ConnectionFlowNode[] = [];
      // A run ends at a change of `group`, which is what lets two multi-lane
      // columns sit next to each other. Without it, three lanes feeding two
      // became a single column of five.
      const group = nodes[i].group;
      while (
        i < nodes.length &&
        nodes[i].kind === "parallel" &&
        nodes[i].group === group
      ) {
        batch.push(nodes[i]);
        i += 1;
      }
      columns.push({ nodes: batch, parallel: true });
    } else {
      columns.push({ nodes: [nodes[i]], parallel: false });
      i += 1;
    }
  }
  return columns;
};

/**
 * Which columns are bypassed.
 *
 * A column is skipped when it says so, or — under `autoSkip` — when it is
 * untouched (neutral) but something after it has run. An explicit
 * `skipped: false` always wins: a node that executed but happens to be neutral
 * must not be arched over.
 */
export const resolveSkipped = (
  columns: Column[],
  autoSkip: boolean,
): Set<number> => {
  const skipped = new Set<number>();
  columns.forEach((column, index) => {
    if (column.nodes.every((n) => nodeIsSkipped(n) === true)) {
      skipped.add(index);
      return;
    }
    if (!autoSkip) return;
    if (column.nodes.some((n) => nodeIsSkipped(n) === false)) return;
    if (toneOf(column.nodes[0]) !== "neutral") return;
    const laterRan = columns
      .slice(index + 1)
      .some((later) => toneOf(later.nodes[0]) !== "neutral");
    if (laterRan) skipped.add(index);
  });
  return skipped;
};

export interface LayoutInput {
  nodes: ConnectionFlowNode[];
  options?: Partial<ConnectionFlowLayoutOptions>;
  /** Fallback state for edges that do not declare one. */
  flowState?: ConnectionState;
  /** Derive edge state and bypasses from tone alone. */
  autoState?: boolean;
  /**
   * Nodes whose item list is fully expanded.
   *
   * Expanding changes a card's height, and so its ports, its silhouette and
   * every route touching it — so it belongs to the layout rather than to the
   * renderer that draws the button.
   */
  expanded?: ReadonlySet<string>;
  animated?: boolean;
}

/**
 * Turns a node list into absolute geometry.
 *
 * Deliberately pure: no measuring, no DOM, no framework. The previous
 * implementation derived every edge from `getBoundingClientRect()` inside a
 * `ResizeObserver`, which meant the arcs could only be computed *after* a
 * paint, needed a second paint to appear, and were re-measured on every
 * scroll. Geometry that can be computed should not be measured.
 */
export const layoutConnectionFlow = (
  input: LayoutInput,
): ConnectionFlowLayout => {
  const options = { ...DEFAULT_LAYOUT_OPTIONS, ...input.options };
  const columns = buildColumns(input.nodes);
  const skipped = resolveSkipped(columns, input.autoState ?? false);

  const laidOut: LaidOutNode[] = [];
  const byId = new Map<string, LaidOutNode>();

  // ── Pass 1: place every node ──────────────────────────────────────────
  let x = options.padding;
  const columnBounds: { start: number; end: number; centre: number }[] = [];

  columns.forEach((column, columnIndex) => {
    const heights = column.nodes.map((n) =>
      measureBranch(n, options, input.expanded),
    );
    const stackHeight =
      heights.reduce((a, b) => a + b, 0) +
      options.laneGap * Math.max(0, column.nodes.length - 1);

    let y = options.padding;
    column.nodes.forEach((node, laneIndex) => {
      const ownHeight = measureNode(node, options, input.expanded);
      const entry: LaidOutNode = {
        id: node.id,
        node,
        outline: "",
        x,
        y,
        width: options.metrics.width,
        height: ownHeight,
        anchorY: ownHeight / 2,
        column: columnIndex,
        depth: 0,
        tone: toneOf(node),
        scrollable: nodeScrolls(node, options, input.expanded),
      };
      laidOut.push(entry);
      byId.set(node.id, entry);

      // Children hang below their parent, indented.
      let childY = y + ownHeight + options.childGap;
      const placeChildren = (
        parent: ConnectionFlowNode,
        depth: number,
        indentX: number,
      ) => {
        (parent.children ?? []).forEach((child) => {
          const childHeight = measureNode(child, options, input.expanded);
          const childEntry: LaidOutNode = {
            id: child.id,
            node: child,
            outline: "",
            x: indentX,
            y: childY,
            width: options.metrics.width - (indentX - x),
            height: childHeight,
            anchorY: childHeight / 2,
            column: columnIndex,
            depth,
            tone: toneOf(child),
            scrollable: nodeScrolls(child, options, input.expanded),
          };
          laidOut.push(childEntry);
          byId.set(child.id, childEntry);
          childY += childHeight + options.childGap;
          placeChildren(child, depth + 1, indentX + options.childIndent);
        });
      };
      placeChildren(node, 1, x + options.childIndent);

      y += heights[laneIndex] + options.laneGap;
    });

    columnBounds.push({
      start: x,
      end: x + options.metrics.width,
      centre: options.padding + stackHeight / 2,
    });
    x += options.metrics.width + options.connectorWidth;
  });

  // ── Pass 2: edges along the main track ────────────────────────────────
  const edges: LaidOutEdge[] = [];

  /**
   * Terminals, collected as edges are routed and keyed by position.
   *
   * A fan-out shares one source port between every edge that leaves it, so
   * this is a map rather than a list: three edges arriving at the same point
   * describe one connector that three edges meet, not three connectors.
   */
  const connectors = new Map<string, LaidOutConnector>();

  /** Bulge radius for one edge, from its own config or the flow default. */
  const ringRadiusOf = (config: ConnectionFlowConnectorConfig | undefined) =>
    CONNECTOR_RING_RADIUS[config?.ringSize ?? options.ringSize] ??
    CONNECTOR_RING_RADIUS.md;

  /**
   * How far short of the port the line stops: the core dot's radius, so the
   * edge butts against the dot rather than running under it and out the far
   * side. It stops at the *dot*, not the bulge — the line is meant to reach
   * the terminal, and the border's detour arches over it on the way.
   */
  const trimFor = (config: ConnectionFlowConnectorConfig | undefined) =>
    connectorDotRadius(ringRadiusOf(config));

  const addConnector = (
    nodeId: string,
    at: Port,
    tone: TrueColor,
    state: ConnectionState,
    active: boolean,
    edgeId: string,
    config: ConnectionFlowConnectorConfig | undefined,
  ) => {
    const radius = ringRadiusOf(config);
    const key = `${nodeId}:${Math.round(at.x)}:${Math.round(at.y)}`;
    const existing = connectors.get(key);
    if (existing) {
      existing.edgeIds.push(edgeId);
      if (STATE_RANK[state] > STATE_RANK[existing.state]) existing.state = state;
      if (active) existing.active = true;
      if (radius > existing.radius) existing.radius = radius;
      return;
    }
    connectors.set(key, {
      id: key,
      nodeId,
      x: at.x,
      y: at.y,
      side: at.side,
      tone,
      state,
      active,
      edgeIds: [edgeId],
      radius,
    });
  };

  const columnIsTerminal = (index: number) =>
    columns[index].nodes[columns[index].nodes.length - 1]?.terminal === true;

  /** The last column before `index` that was not bypassed. */
  const lastLiveBefore = (index: number): number => {
    for (let i = index - 1; i >= 0; i -= 1) if (!skipped.has(i)) return i;
    return -1;
  };

  const boxOf = (entry: LaidOutNode): Box => ({
    x: entry.x,
    y: entry.y,
    width: entry.width,
    height: entry.height,
  });

  /** The bounding box of a whole column, used to route a bypass around it. */
  const columnBox = (index: number): Box | null => {
    const entries = columns[index].nodes
      .map((n) => byId.get(n.id))
      .filter((e): e is LaidOutNode => Boolean(e));
    if (entries.length === 0) return null;
    const left = Math.min(...entries.map((e) => e.x));
    const top = Math.min(...entries.map((e) => e.y));
    const right = Math.max(...entries.map((e) => e.x + e.width));
    const bottom = Math.max(...entries.map((e) => e.y + e.height));
    return { x: left, y: top, width: right - left, height: bottom - top };
  };

  const styleFor = (config: ConnectionFlowConnectorConfig | undefined) =>
    config?.edgeStyle ?? options.edgeStyle;

  columns.forEach((column, columnIndex) => {
    if (columnIndex === 0) return;
    const sourceIndex = lastLiveBefore(columnIndex);
    if (sourceIndex < 0) return;
    if (columnIsTerminal(sourceIndex)) return;
    if (skipped.has(columnIndex)) return;

    const isBypass = sourceIndex !== columnIndex - 1;
    const sourceNodes = columns[sourceIndex].nodes;
    const targetNodes = column.nodes;

    const state = (
      sourceNode: ConnectionFlowNode,
      targetNode: ConnectionFlowNode,
    ): ConnectionState =>
      targetNode.connector?.state ??
      (input.autoState
        ? toneOf(sourceNode) !== "neutral"
          ? nodeIsActive(targetNode)
            ? "flowing"
            : "stopped"
          : "disabled"
        : (input.flowState ?? "flowing"));

    const animatedFor = (
      cfg: ConnectionFlowConnectorConfig | undefined,
      edgeState: ConnectionState,
    ) =>
      (cfg?.animated ?? input.animated ?? true) &&
      (edgeState === "flowing" ||
        (edgeState === "stopped" && (cfg?.animateCompleted ?? false)));

    // ── Track edges, including fan-out and fan-in ─────────────────────────
    // A fan shares one connector config, so anything the config contributes
    // once — a label — is claimed by the first edge only.
    let labelUsed = false;
    const takeLabel = (label: string | undefined) => {
      if (!label || labelUsed) return undefined;
      labelUsed = true;
      return label;
    };

    // Sides are chosen once for the whole column pair, not per node pair.
    // Chosen per pair, a tall parallel column put the far lane further below
    // the source than the next column was to its right — so that one edge
    // left the source's *bottom* while its siblings left the right, and one
    // card grew two source terminals for what is a single fan.
    const sourceSpan = columnBox(sourceIndex);
    const targetSpan = columnBox(columnIndex);
    if (!sourceSpan || !targetSpan) return;
    const sides = selectSides(sourceSpan, targetSpan);

    // Where the whole fan turns. Measured once from the column boxes and
    // handed to every edge in it, so a single branch point in the graph is
    // drawn as one: turning at each pair's own midpoint put a wide card's
    // elbow at a different x from its narrower sibling's and the lines
    // stepped apart instead of gathering.
    //
    // A bypass is the same fan with the turn on the other axis — a horizontal
    // line lifted clear of the cards it passes over, instead of a vertical one
    // in the gap. That is the *only* thing that makes it different, so it is
    // no longer routed by a branch of its own. The version that was drew one
    // arc between the column bounding boxes, which left every lane but the
    // first with no edge at all: they looked orphaned, and `tracePathTo`
    // reported no ancestry for them because there was genuinely none.
    let via: { x?: number; y?: number } | undefined;
    if (isBypass) {
      const overflown = [sourceSpan, targetSpan];
      for (let i = sourceIndex + 1; i < columnIndex; i += 1) {
        const box = columnBox(i);
        if (box) overflown.push(box);
      }
      // Clear the tallest thing in the way, not the midpoint.
      const clearance = Math.min(...overflown.map((b) => b.y));
      via = { y: clearance - options.bypassLift };
    } else {
      const gapStart = sourceSpan.x + sourceSpan.width;
      const gapEnd = targetSpan.x;
      via = gapEnd > gapStart ? { x: (gapStart + gapEnd) / 2 } : undefined;
    }

    sourceNodes.forEach((sourceNode) => {
      const source = byId.get(sourceNode.id);
      if (!source) return;
      targetNodes.forEach((targetNode) => {
        const target = byId.get(targetNode.id);
        if (!target) return;

        const cfg = targetNode.connector;
        const edgeState = state(sourceNode, targetNode);
        const sourceBox = boxOf(source);
        const targetBox = boxOf(target);
        const fromPort = port(
          sourceBox,
          sides.from,
          source.anchorY / source.height,
        );
        const toPort = port(targetBox, sides.to, target.anchorY / target.height);
        const route = routePorts(fromPort, toPort, {
          style: styleFor(cfg),
          stub: Math.min(18, options.connectorWidth / 3),
          radius: options.cornerRadius,
          trim: trimFor(cfg),
          via,
        });

        const edgeId = `${sourceNode.id}->${targetNode.id}`;
        const edgeAnimated = animatedFor(cfg, edgeState);
        const sourceTone = cfg?.sourceTone ?? toneOf(sourceNode);
        const targetTone = cfg?.targetTone ?? toneOf(targetNode);
        addConnector(
          sourceNode.id,
          fromPort,
          sourceTone,
          edgeState,
          edgeAnimated,
          edgeId,
          cfg,
        );
        addConnector(
          targetNode.id,
          toPort,
          targetTone,
          edgeState,
          edgeAnimated,
          edgeId,
          cfg,
        );

        edges.push({
          id: edgeId,
          fromId: sourceNode.id,
          toId: targetNode.id,
          state: edgeState,
          points: route.points,
          d: route.d,
          sourceTone,
          targetTone,
          bypass: isBypass,
          // Filled in once every edge is known — see the pass below.
          emitIndex: 0,
          emitCount: 1,
          emitSpan: 0,
          animated: edgeAnimated,
          label: takeLabel(cfg?.label),
        });
      });
    });
  });

  // ── Pass 3: edges down into children ──────────────────────────────────
  // These used to be a hard-coded three-point L, which is precisely why
  // `edgeStyle: "curved"` curved the main track and left every child edge as
  // a square elbow. They go through the same router as everything else now.
  const childEdges = (parent: ConnectionFlowNode) => {
    const parentEntry = byId.get(parent.id);
    if (!parentEntry) return;
    (parent.children ?? []).forEach((child) => {
      const childEntry = byId.get(child.id);
      if (!childEntry) return;

      const parentBox = boxOf(parentEntry);
      const childBox = boxOf(childEntry);
      const cfg = child.connector;
      const edgeState =
        cfg?.state ?? (nodeIsActive(child) ? "flowing" : "stopped");

      // The parent's port sits over the child gutter rather than at its
      // centre, so the drop lines up with the indent instead of cutting
      // diagonally across the card below it.
      const fromPort = portAt(parentBox, "bottom", options.childIndent / 2);
      const toPort = port(
        childBox,
        "left",
        childEntry.anchorY / childEntry.height,
      );
      const route = routePorts(fromPort, toPort, {
        style: styleFor(cfg),
        stub: 10,
        radius: options.cornerRadius,
        trim: trimFor(cfg),
      });

      const edgeId = `${parent.id}v>${child.id}`;
      const edgeAnimated =
        (cfg?.animated ?? input.animated ?? true) && nodeIsActive(child);
      addConnector(
        parent.id,
        fromPort,
        toneOf(parent),
        edgeState,
        edgeAnimated,
        edgeId,
        cfg,
      );
      addConnector(
        child.id,
        toPort,
        toneOf(child),
        edgeState,
        edgeAnimated,
        edgeId,
        cfg,
      );

      edges.push({
        id: edgeId,
        fromId: parent.id,
        toId: child.id,
        state: edgeState,
        points: route.points,
        d: route.d,
        sourceTone: toneOf(parent),
        targetTone: toneOf(child),
        bypass: false,
        emitIndex: 0,
        emitCount: 1,
        emitSpan: 0,
        animated: edgeAnimated,
        label: cfg?.label,
      });
      childEdges(child);
    });
  };
  input.nodes.forEach(childEdges);

  // ── Emission order ────────────────────────────────────────────────────
  // Each source releases one dot at a time, taking its outgoing edges in
  // turn. Assigned here rather than in the renderers because it depends on
  // which edges ended up animated, which only the layout knows.
  const emittedBySource = new Map<string, LaidOutEdge[]>();
  edges.forEach((edge) => {
    if (!edge.animated) return;
    const key = edge.fromId ?? "";
    const list = emittedBySource.get(key) ?? [];
    list.push(edge);
    emittedBySource.set(key, list);
  });
  emittedBySource.forEach((list) => {
    const span = Math.max(...list.map((edge) => routeLength(edge.points)));
    list.forEach((edge, index) => {
      edge.emitIndex = index;
      edge.emitCount = list.length;
      edge.emitSpan = span;
    });
  });

  // ── Pass 4: node silhouettes ──────────────────────────────────────────
  // Built last, because a card's outline depends on where its ports ended up:
  // the terminal is the node bulging, not a marker laid on it, so the bulge
  // has to be part of the same path as the border it springs from.
  const bulgesByNode = new Map<string, OutlineBulge[]>();
  connectors.forEach((c) => {
    if (c.radius <= CONNECTOR_BULGE_MIN) return;
    const list = bulgesByNode.get(c.nodeId) ?? [];
    const horizontal = c.side === "top" || c.side === "bottom";
    list.push({ side: c.side, at: horizontal ? c.x : c.y, radius: c.radius });
    bulgesByNode.set(c.nodeId, list);
  });
  laidOut.forEach((entry) => {
    entry.outline = nodeOutline(
      boxOf(entry),
      options.nodeCornerRadius,
      bulgesByNode.get(entry.id) ?? [],
    );
  });

  // Bounds cover the edges as well as the nodes. A bypass arc travels *above*
  // the cards, so measuring nodes alone reported a box the arc did not fit in
  // — and `fitToViewport`, which trusts these numbers, then scaled the graph
  // so that the arc and its label sat outside the frame.
  let maxX = 0;
  let maxY = 0;
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  const cover = (x: number, y: number) => {
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
  };
  laidOut.forEach((n) => {
    cover(n.x, n.y);
    cover(n.x + n.width, n.y + n.height);
  });
  edges.forEach((e) => e.points.forEach((p) => cover(p.x, p.y)));
  // A ring straddles its node's border, so half of it hangs outside the box
  // the node reported. Left out, `fit` clips the outer half of every terminal
  // on the leftmost and topmost cards.
  connectors.forEach((c) => {
    cover(c.x - c.radius, c.y - c.radius);
    cover(c.x + c.radius, c.y + c.radius);
  });
  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
  }

  return {
    nodes: laidOut,
    edges,
    connectors: [...connectors.values()],
    width: maxX + options.padding,
    height: maxY + options.padding,
    // How far the content overhangs the origin — a bypass lifts above y=0,
    // and the renderer has to shift by this much or the arc is clipped.
    offsetX: Math.min(0, minX - options.padding),
    offsetY: Math.min(0, minY - options.padding),
  };
};

/**
 * Every node on the path from the first node to `targetId`, walking the edge
 * list backwards. Drives the GitHub-Actions-style highlight: the ancestry of
 * the node under the pointer stays lit and everything else dims.
 */
export const tracePathTo = (
  layout: ConnectionFlowLayout,
  targetId: string,
): { nodes: Set<string>; edges: Set<string> } => {
  const nodes = new Set<string>([targetId]);
  const edges = new Set<string>();
  const incoming = new Map<string, LaidOutEdge[]>();
  layout.edges.forEach((edge) => {
    const list = incoming.get(edge.toId) ?? [];
    list.push(edge);
    incoming.set(edge.toId, list);
  });

  const queue = [targetId];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const id = queue.shift() as string;
    if (seen.has(id)) continue;
    seen.add(id);
    (incoming.get(id) ?? []).forEach((edge) => {
      edges.add(edge.id);
      if (edge.fromId && !nodes.has(edge.fromId)) {
        nodes.add(edge.fromId);
        queue.push(edge.fromId);
      }
    });
  }
  return { nodes, edges };
};

/** The node whose box contains the point, or `null`. Topmost wins. */
export const hitTestNode = (
  layout: ConnectionFlowLayout,
  x: number,
  y: number,
): LaidOutNode | null => {
  for (let i = layout.nodes.length - 1; i >= 0; i -= 1) {
    const node = layout.nodes[i];
    if (node.node.disabled) continue;
    if (
      x >= node.x &&
      x <= node.x + node.width &&
      y >= node.y &&
      y <= node.y + node.height
    ) {
      return node;
    }
  }
  return null;
};

/** Scale and offset that fit the whole graph into a viewport. */
export const fitToViewport = (
  layout: ConnectionFlowLayout,
  viewportWidth: number,
  viewportHeight: number,
  maxScale = 1,
): { scale: number; offsetX: number; offsetY: number } => {
  if (!layout.width || !layout.height || !viewportWidth || !viewportHeight) {
    return { scale: 1, offsetX: 0, offsetY: 0 };
  }
  // The content box spans the overhang as well, so a graph whose bypass lifts
  // above the origin is measured — and then shifted — by its true extent.
  const contentWidth = layout.width - layout.offsetX;
  const contentHeight = layout.height - layout.offsetY;
  const scale = Math.min(
    maxScale,
    viewportWidth / contentWidth,
    viewportHeight / contentHeight,
  );
  return {
    scale,
    offsetX:
      (viewportWidth - contentWidth * scale) / 2 - layout.offsetX * scale,
    offsetY:
      (viewportHeight - contentHeight * scale) / 2 - layout.offsetY * scale,
  };
};

/** True when the layout contains anything that needs to keep moving. */
export const layoutIsAnimated = (layout: ConnectionFlowLayout): boolean =>
  layout.edges.some((edge) => edge.animated) ||
  layout.nodes.some((node) => nodeIsActive(node.node));
