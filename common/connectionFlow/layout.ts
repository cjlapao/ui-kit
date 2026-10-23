import { layoutCaptions, captionSpacing } from "./captions";
import { separateAnchors } from "./anchors";
import type { TrueColor } from "../theme/Theme";
import {
  nodeOutline,
  port,
  routeLength,
  portAt,
  routePorts,
  routeBetween,
  segmentsCrossBoxes,
  createLaneUse,
  routeCrossings,
  selectSides,
  routingLaneSpacing,
  type Box,
  type OutlineBulge,
  type Port,
  type PortSide,
  type Route,
} from "./router";
import {
  CONNECTOR_BULGE_MIN,
  CONNECTOR_RING_RADIUS,
  DEFAULT_LAYOUT_OPTIONS,
  STATUS_TONE,
  connectorDotRadius,
  nodeHasFailed,
  nodeIsActive,
  nodeIsSkipped,
  nodeTone,
  toRows,
  type ConnectionFlowBranch,
  type ConnectionFlowConnection,
  type ConnectionFlowConnectorConfig,
  type ConnectionFlowEdgeStyle,
  type ConnectionFlowLayout,
  type ConnectionFlowLayoutOptions,
  type ConnectionFlowNode,
  type ConnectionState,
  type LaidOutConnector,
  type LaidOutEdge,
  type LaidOutNode,
} from "./types";
import { measureNode, nodeScrolls } from "./measure";

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
  if (nodes.length && nodes.every(n => n.gridPosition &&
    Number.isInteger(n.gridPosition.column) && Number.isInteger(n.gridPosition.row))) {
    const cells = new Map<number, ConnectionFlowNode[]>();
    for (const node of nodes) {
      const column = node.gridPosition!.column;
      cells.set(column, [...(cells.get(column) ?? []), node]);
    }
    return [...cells].sort(([a], [b]) => a - b).map(([, entries]) => ({
      nodes: entries.sort((a, b) => a.gridPosition!.row - b.gridPosition!.row),
      parallel: entries.length > 1,
    }));
  }
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
  /** When supplied, draw only these connections, including an empty array. */
  connections?: readonly ConnectionFlowConnection[];
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
export const layoutConnectionFlow = (input: LayoutInput): ConnectionFlowLayout =>
  layoutWithRowSpace(input, new Map(), 0);

/** Anchor overflow is known only after routing. Reflow affected seams using
 * those real terminals, retaining per-row budgets until the layout settles. */
const layoutWithRowSpace = (
  input: LayoutInput,
  rowSpace: ReadonlyMap<string, number>,
  pass: number,
): ConnectionFlowLayout => {
  const options = { ...DEFAULT_LAYOUT_OPTIONS, ...input.options };
  const spacing = captionSpacing(input.nodes, options);
  const rowSeams: {
    key: string;
    before: readonly ConnectionFlowNode[];
    after: readonly ConnectionFlowNode[];
    size: number;
  }[] = [];
  const gap = (
    before: readonly ConnectionFlowNode[],
    after: readonly ConnectionFlowNode[],
    axis: "horizontal" | "vertical",
    minimum: number,
  ) => {
    const key = JSON.stringify([before.map((n) => n.id), after.map((n) => n.id)]);
    const beforeIds = new Set(before.map(n => n.id));
    const afterIds = new Set(after.map(n => n.id));
    const laneCount = input.connections === undefined ? before.length * after.length :
      input.connections.filter(c => (beforeIds.has(c.fromId) && afterIds.has(c.toId)) ||
        (afterIds.has(c.fromId) && beforeIds.has(c.toId))).length;
    const size = Math.max(
      minimum,
      axis === "vertical" ? rowSpace.get(key) ?? 0 : 0,
      // Pack lane centres between the two terminal runs. N lanes need
      // N - 1 spacers; counting both outer margins as lanes wastes two slots.
      axis === "horizontal" && laneCount > 1
        ? 48 +
          (laneCount - 1) *
            routingLaneSpacing(options.pathClearance, options.cornerRadius)
        : 0,
      ...before.map((n) => spacing.after.get(n.id)?.[axis] ?? 0),
      ...after.map((n) => spacing.before.get(n.id)?.[axis] ?? 0),
    );
    if (axis === "vertical" && before.length && after.length)
      rowSeams.push({ key, before, after, size });
    return size;
  };
  const columns = buildColumns(input.nodes);
  const skipped = resolveSkipped(columns, input.autoState ?? false);
  // Explicit cells share row baselines across columns. Keep the same caption
  // and terminal feedback budgets as automatic rows, including uneven gaps.
  const gridRows = new Map<number, number>();
  if (input.nodes.length && input.nodes.every(n => n.gridPosition &&
    Number.isInteger(n.gridPosition.column) && Number.isInteger(n.gridPosition.row))) {
    const rows = new Map<number, ConnectionFlowNode[]>();
    for (const node of input.nodes) {
      const row = node.gridPosition!.row;
      rows.set(row, [...(rows.get(row) ?? []), node]);
    }
    const ordered = [...rows].sort(([a], [b]) => a - b);
    let rowY = options.padding;
    ordered.forEach(([index, nodes], i) => {
      gridRows.set(index, rowY);
      rowY += Math.max(...nodes.map(n => measureNode(n, options, input.expanded))) +
        gap(nodes, ordered[i + 1]?.[1] ?? [], "vertical", Math.max(72, options.laneGap));
    });
  }

  const laidOut: LaidOutNode[] = [];
  const byId = new Map<string, LaidOutNode>();

  /**
   * Chained child grids, keyed by parent id. Placed with the parent (their
   * rows hang below its card), walked row-major by the chain pass, and read
   * by the track pass so the grid's last card — not the parent — carries the
   * connection onward.
   */
  interface ChainInfo {
    parentNode: ConnectionFlowNode;
    walk: { card: LaidOutNode; row: number }[];
    /** Last non-skipped card of the grid — the onward connector. */
    exitCard: LaidOutNode | null;
    /** True when the exit card names its own successor. */
    exitHasBranch: boolean;
    gridWidth: number;
  }
  const chains = new Map<string, ChainInfo>();

  // ── Pass 1: place every node ──────────────────────────────────────────
  let x = options.padding;
  const columnBounds: { start: number; end: number; centre: number }[] = [];

  columns.forEach((column, columnIndex) => {
    let y = options.padding;
    column.nodes.forEach((node, laneIndex) => {
      y = gridRows.get(node.gridPosition?.row ?? NaN) ?? y;
      const branchStart = laidOut.length;
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

      // Children hang below their parent, indented — unless the parent
      // chains: then `rows` (or one card per row from `children`) form a
      // grid under it, walked rightward and downward by the chain pass.
      let childY =
        y +
        ownHeight +
        gap(
          [node],
          node.children?.slice(0, 1) ?? [],
          "vertical",
          options.childGap,
        );
      const placeChildren = (
        parent: ConnectionFlowNode,
        depth: number,
        indentX: number,
      ) => {
        (parent.children ?? []).forEach((child, childIndex) => {
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
          childY +=
            childHeight +
            gap(
              [child],
              parent.children?.slice(childIndex + 1, childIndex + 2) ?? [],
              "vertical",
              options.childGap,
            );
          placeChildren(child, depth + 1, indentX + options.childIndent);
        });
      };
      if (node.childLayout === "chain") {
        const rows = toRows(node);
        if (rows.length > 0) {
          const cardWidth = options.metrics.width;
          const gridX = x + options.gridIndent;
          // The parent→first-row seam carries a real connector with ports
          // at both ends, exactly like a row handoff — so it hangs by the
          // row gap, not by the fan children's gap.
          let rowY =
            y + ownHeight + gap([node], rows[0], "vertical", options.rowGap);
          const walk: ChainInfo["walk"] = [];
          let gridWidth = cardWidth;
          rows.forEach((row, rowIdx) => {
            let rowBottom = rowY;
            let cardX = gridX;
            row.forEach((card, col) => {
              const cardHeight = measureNode(card, options, input.expanded);
              const cardEntry: LaidOutNode = {
                id: card.id,
                node: card,
                outline: "",
                x: cardX,
                y: rowY,
                width: cardWidth,
                height: cardHeight,
                anchorY: cardHeight / 2,
                column: columnIndex,
                depth: 1,
                tone: toneOf(card),
                scrollable: nodeScrolls(card, options, input.expanded),
              };
              laidOut.push(cardEntry);
              byId.set(card.id, cardEntry);
              walk.push({ card: cardEntry, row: rowIdx });
              rowBottom = Math.max(rowBottom, rowY + cardHeight);
              gridWidth = Math.max(gridWidth, cardX - gridX + cardWidth);
              cardX +=
                cardWidth +
                gap(
                  [card],
                  row.slice(col + 1, col + 2),
                  "horizontal",
                  options.connectorWidth,
                );
            });
            rowY =
              rowBottom +
              gap(row, rows[rowIdx + 1] ?? [], "vertical", options.rowGap);
          });
          const live = walk.filter((w) => !nodeIsSkipped(w.card.node));
          const exitCard = live.length > 0 ? live[live.length - 1].card : null;
          chains.set(node.id, {
            parentNode: node,
            walk,
            exitCard,
            exitHasBranch: Boolean(exitCard?.node.success?.to),
            gridWidth: options.gridIndent + gridWidth,
          });
        } else {
          placeChildren(node, 1, x + options.childIndent);
        }
      } else {
        placeChildren(node, 1, x + options.childIndent);
      }

      const branchBottom = Math.max(
        ...laidOut.slice(branchStart).map((n) => n.y + n.height),
      );
      y = gridRows.size ? branchBottom :
        branchBottom +
        gap(
          [node],
          column.nodes.slice(laneIndex + 1, laneIndex + 2),
          "vertical",
          options.laneGap,
        );
    });

    // A chained column is as wide as its widest row, so the next top-level
    // column starts clear of the grid rather than on top of it.
    const chainInfo = column.parallel
      ? undefined
      : chains.get(column.nodes[0].id);
    const columnWidth = Math.max(
      options.metrics.width,
      chainInfo?.gridWidth ?? 0,
    );
    columnBounds.push({
      start: x,
      end: x + columnWidth,
      centre:
        (options.padding +
          Math.max(
            ...laidOut
              .filter((n) => n.column === columnIndex)
              .map((n) => n.y + n.height),
          )) /
        2,
    });
    x +=
      columnWidth +
      gap(
        column.nodes,
        columns[columnIndex + 1]?.nodes ?? [],
        "horizontal",
        options.connectorWidth,
      );
  });

  // ── Pass 2: edges along the main track ────────────────────────────────
  const edges: LaidOutEdge[] = [];

  /**
   * Terminals, collected as edges are routed and keyed by position.
   *
   * Initial routes may request the same position. Collect those requests
   * here; separateAnchors allocates independent endpoints before rendering.
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
      if (STATE_RANK[state] > STATE_RANK[existing.state])
        existing.state = state;
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

  /** The connection line a port sits on, as a fraction of its own card. */
  const tOf = (box: Box, p: Port): number =>
    p.side === "left" || p.side === "right"
      ? box.height === 0
        ? 0.5
        : (p.y - box.y) / box.height
      : box.width === 0
        ? 0.5
        : (p.x - box.x) / box.width;

  // Everything the path engine needs about the board. The cards are fixed
  // by this point — pass 1 measured and placed every one and nothing below
  // moves them — so the obstacles are the real boxes, and one lane ledger
  // is shared by every route this run asks the engine for: two retry loops
  // into the same stack then land side by side instead of drawing one
  // line twice.
  const obstacles = laidOut.map(boxOf);
  const laneUses = createLaneUse();

  /**
   * The naive route first; the engine only when it touches a card.
   *
   * This order is what keeps every existing route byte-identical: an edge
   * the layout parks in a corridor — a track hop, a fan spine, a bypass
   * lift — passes the check and keeps its exact points. Only edges that
   * were cutting across card faces get re-routed, and then the engine
   * chooses the sides as freely as the way.
   */
  const routeWithEngine = (o: {
    fromPort: Port;
    toPort: Port;
    fromBox: Box;
    toBox: Box;
    style: ConnectionFlowEdgeStyle;
    stub: number;
    trim: number;
    via?: { x?: number; y?: number };
    prefer?: { from?: PortSide[]; to?: PortSide[] };
  }): Route & { fromPort: Port; toPort: Port } => {
    const naive = routePorts(o.fromPort, o.toPort, {
      style: o.style,
      stub: o.stub,
      radius: options.cornerRadius,
      trim: o.trim,
      via: o.via,
    });
    const keep = { ...naive, fromPort: o.fromPort, toPort: o.toPort };
    if (!segmentsCrossBoxes(naive.points, obstacles)) return keep;
    const routed = routeBetween(
      {
        box: o.fromBox,
        t: tOf(o.fromBox, o.fromPort),
        preferSides: o.prefer?.from,
      },
      { box: o.toBox, t: tOf(o.toBox, o.toPort), preferSides: o.prefer?.to },
      obstacles,
      {
        style: o.style,
        stub: o.stub,
        radius: options.cornerRadius,
        trim: o.trim,
        clearance: options.pathClearance,
        laneUse: laneUses,
      },
    );
    return routed ?? keep;
  };

  columns.forEach((column, columnIndex) => {
    if (input.connections !== undefined) return;
    if (columnIndex === 0) return;
    const sourceIndex = lastLiveBefore(columnIndex);
    if (sourceIndex < 0) return;
    if (columnIsTerminal(sourceIndex)) return;
    if (skipped.has(columnIndex)) return;

    const isBypass = sourceIndex !== columnIndex - 1;
    // The onward connector of a chained column is the grid's last live card,
    // not the parent: the parent is a container the flow enters and leaves
    // through its children. An exit card that names its own successor has
    // that edge drawn by the branch pass instead.
    const chainSrc = columns[sourceIndex].parallel
      ? undefined
      : chains.get(columns[sourceIndex].nodes[0].id);
    if (chainSrc && (!chainSrc.exitCard || chainSrc.exitHasBranch)) return;
    if (chainSrc?.exitCard?.node.terminal === true) return;
    const sourceNodes = chainSrc?.exitCard
      ? [chainSrc.exitCard.node]
      : columns[sourceIndex].nodes;
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
    const sourceSpan = chainSrc?.exitCard
      ? boxOf(chainSrc.exitCard)
      : columnBox(sourceIndex);
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
        const toPort = port(
          targetBox,
          sides.to,
          target.anchorY / target.height,
        );
        const route = routeWithEngine({
          fromPort,
          toPort,
          fromBox: sourceBox,
          toBox: targetBox,
          style: styleFor(cfg),
          stub: Math.min(18, options.connectorWidth / 3),
          trim: trimFor(cfg),
          via,
        });

        const edgeId = `${sourceNode.id}->${targetNode.id}`;
        const edgeAnimated = animatedFor(cfg, edgeState);
        const sourceTone = cfg?.sourceTone ?? toneOf(sourceNode);
        const targetTone = cfg?.targetTone ?? toneOf(targetNode);
        addConnector(
          sourceNode.id,
          route.fromPort,
          sourceTone,
          edgeState,
          edgeAnimated,
          edgeId,
          cfg,
        );
        addConnector(
          targetNode.id,
          route.toPort,
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
          style: styleFor(cfg),
        });
      });
    });
  });

  // ── Pass 3: edges down into children ──────────────────────────────────
  // These used to be a hard-coded three-point L, which is precisely why
  // `edgeStyle: "curved"` curved the main track and left every child edge as
  // a square elbow. They go through the same router as everything else now.
  // Chained parents opt out here — their children form a grid walked by the
  // chain pass below rather than one elbow per child.
  const childEdges = (parent: ConnectionFlowNode) => {
    if (parent.childLayout === "chain") return;
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
      const route = routeWithEngine({
        fromPort,
        toPort,
        fromBox: parentBox,
        toBox: childBox,
        style: styleFor(cfg),
        stub: 10,
        trim: trimFor(cfg),
      });

      const edgeId = `${parent.id}v>${child.id}`;
      const edgeAnimated =
        (cfg?.animated ?? input.animated ?? true) && nodeIsActive(child);
      addConnector(
        parent.id,
        route.fromPort,
        toneOf(parent),
        edgeState,
        edgeAnimated,
        edgeId,
        cfg,
      );
      addConnector(
        child.id,
        route.toPort,
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
        style: styleFor(cfg),
      });
      childEdges(child);
    });
  };
  if (input.connections === undefined) input.nodes.forEach(childEdges);

  // ── Pass 3b: chain walks + outcome branches ───────────────────────────
  // The chain reads a grid the way a runner reads a lane: in at the top,
  // rightward along a row, down at its last card, onward from the grid's
  // last card. Both outcome edges are always drawn — a retry loop you can
  // only see when it fires is a topology diagram, not a flow. Which one is
  // *alive* follows the source's status: a failed card lights its rose edge
  // and dims its success, and the walk edges leading out of it stop.
  const emitFlowEdge = (o: {
    id: string;
    fromEntry: LaidOutNode;
    toEntry: LaidOutNode;
    fromPort: Port;
    toPort: Port;
    via?: { x?: number; y?: number };
    state: ConnectionState;
    sourceTone: TrueColor;
    targetTone: TrueColor;
    label?: string;
    cfg?: ConnectionFlowConnectorConfig;
    kind?: "chain" | "branch";
    branchKind?: "success" | "failure";
    /** Visual-idiom preference for the engine — see `PathEndpoint`. */
    prefer?: { from?: PortSide[]; to?: PortSide[] };
  }) => {
    const route = routeWithEngine({
      fromPort: o.fromPort,
      toPort: o.toPort,
      fromBox: boxOf(o.fromEntry),
      toBox: boxOf(o.toEntry),
      style: o.cfg?.edgeStyle ?? options.edgeStyle,
      stub: Math.min(18, options.connectorWidth / 3),
      trim: trimFor(o.cfg),
      via: o.via,
      prefer: o.prefer,
    });
    const animated =
      (o.cfg?.animated ?? input.animated ?? true) &&
      (o.state === "flowing" ||
        (o.state === "stopped" && (o.cfg?.animateCompleted ?? false)));
    addConnector(
      o.fromEntry.id,
      route.fromPort,
      o.sourceTone,
      o.state,
      animated,
      o.id,
      o.cfg,
    );
    addConnector(
      o.toEntry.id,
      route.toPort,
      o.targetTone,
      o.state,
      animated,
      o.id,
      o.cfg,
    );
    edges.push({
      id: o.id,
      fromId: o.fromEntry.id,
      toId: o.toEntry.id,
      state: o.state,
      points: route.points,
      d: route.d,
      sourceTone: o.sourceTone,
      targetTone: o.targetTone,
      bypass: false,
      emitIndex: 0,
      emitCount: 1,
      emitSpan: 0,
      animated,
      ringSize: o.cfg?.ringSize,
      label: o.label,
      kind: o.kind,
      branchKind: o.branchKind,
      style: o.cfg?.edgeStyle ?? options.edgeStyle,
    });
  };

  /** A port at the card's connection line on the given side. */
  const sidePort = (entry: LaidOutNode, side: PortSide): Port =>
    port(boxOf(entry), side, entry.anchorY / entry.height);

  const branchToneOf = (
    branch: ConnectionFlowBranch,
    kind: "success" | "failure",
  ): TrueColor =>
    branch.tone ??
    (kind === "success" ? STATUS_TONE.succeeded : STATUS_TONE.failed);

  /**
   * One outcome edge. A target that sits upstream — above or left of the
   * source, which is what a retry loop is — leaves the source's left side
   * and runs down a lane clear of the cards before turning up into the
   * target's top, so the loop visibly re-enters the way a chain drop does
   * rather than cutting a diagonal through the grid.
   */
  const emitBranch = (
    fromEntry: LaidOutNode,
    branch: ConnectionFlowBranch,
    kind: "success" | "failure",
  ) => {
    if (!branch.to) return;
    const target = byId.get(branch.to);
    if (!target || target.id === fromEntry.id) return;
    const tone = branchToneOf(branch, kind);
    const state: ConnectionState =
      kind === "failure"
        ? nodeHasFailed(fromEntry.node)
          ? "flowing"
          : "stopped"
        : nodeHasFailed(fromEntry.node)
          ? "stopped"
          : "flowing";
    const srcBox = boxOf(fromEntry);
    const tgtBox = boxOf(target);
    const upstream =
      tgtBox.y + tgtBox.height <= srcBox.y + 1 ||
      tgtBox.x + tgtBox.width <= srcBox.x + 1;
    if (upstream && kind === "failure") {
      emitFlowEdge({
        id: `${fromEntry.id}~fail>${target.id}`,
        fromEntry,
        toEntry: target,
        fromPort: port(srcBox, "left", fromEntry.anchorY / fromEntry.height),
        toPort: port(tgtBox, "top", 0.5),
        via: { x: Math.min(srcBox.x, tgtBox.x) - options.bypassLift },
        prefer: { from: ["left"], to: ["top"] },
        state,
        sourceTone: tone,
        targetTone: tone,
        label: branch.label,
        kind: "branch",
        branchKind: kind,
      });
      return;
    }
    const sides = selectSides(srcBox, tgtBox);
    emitFlowEdge({
      id: `${fromEntry.id}~${kind === "failure" ? "fail" : "ok"}>${target.id}`,
      fromEntry,
      toEntry: target,
      fromPort: sidePort(fromEntry, sides.from),
      toPort: sidePort(target, sides.to),
      state,
      sourceTone: tone,
      targetTone: tone,
      label: branch.label,
      kind: "branch",
      branchKind: kind,
    });
  };

  chains.forEach((chain) => {
    if (input.connections !== undefined) return;
    const parentEntry = byId.get(chain.parentNode.id);
    if (!parentEntry) return;
    if (nodeIsSkipped(chain.parentNode) === true) return;
    const live = chain.walk.filter((w) => !nodeIsSkipped(w.card.node));
    if (live.length === 0) return;

    // In: the parent's bottom, above the first card, straight down into its
    // top. The grid hangs under the parent, so this is the flow arriving.
    const first = live[0].card;
    const parentBox = boxOf(parentEntry);
    const firstBox = boxOf(first);
    emitFlowEdge({
      id: `${parentEntry.id}~in>${first.id}`,
      fromEntry: parentEntry,
      toEntry: first,
      fromPort: portAt(
        parentBox,
        "bottom",
        firstBox.x + firstBox.width / 2 - parentBox.x,
      ),
      toPort: port(firstBox, "top", 0.5),
      state:
        first.node.connector?.state ??
        (nodeHasFailed(parentEntry.node)
          ? "stopped"
          : nodeIsActive(first.node)
            ? "flowing"
            : "stopped"),
      sourceTone: toneOf(parentEntry.node),
      targetTone: toneOf(first.node),
      cfg: first.node.connector,
      kind: "chain",
    });

    // Along: rightward within a row with the track's own connector style,
    // dropping from a row's last card into the next row's first. A card
    // that names its own successor replaces the implicit step — the card
    // it stepped over simply never gets an incoming edge.
    live.forEach((w, i) => {
      const src = w.card;
      if (src.node.success?.to) {
        emitBranch(src, src.node.success, "success");
        return;
      }
      const next = live[i + 1];
      if (!next) return; // the handoff onward is the track pass's job
      const tgt = next.card;
      const srcBox = boxOf(src);
      const tgtBox = boxOf(tgt);
      const sameRow = next.row === w.row;
      const gapStart = srcBox.x + srcBox.width;
      const gapEnd = tgtBox.x;
      emitFlowEdge({
        id: `${src.id}~walk>${tgt.id}`,
        fromEntry: src,
        toEntry: tgt,
        fromPort: sameRow
          ? port(srcBox, "right", src.anchorY / src.height)
          : port(srcBox, "bottom", 0.5),
        toPort: sameRow
          ? port(tgtBox, "left", tgt.anchorY / tgt.height)
          : port(tgtBox, "top", 0.5),
        via:
          sameRow && gapEnd > gapStart
            ? { x: (gapStart + gapEnd) / 2 }
            : undefined,
        state:
          tgt.node.connector?.state ??
          (nodeHasFailed(src.node)
            ? "stopped"
            : nodeIsActive(tgt.node)
              ? "flowing"
              : "stopped"),
        sourceTone: src.node.success
          ? branchToneOf(src.node.success, "success")
          : toneOf(src.node),
        targetTone: toneOf(tgt.node),
        cfg: tgt.node.connector,
        label: src.node.success?.label ?? tgt.node.connector?.label,
        kind: "chain",
      });
    });

    // Out: the failure edges, drawn for every card that declares one —
    // even a skipped card, whose loop is still part of the story.
    chain.walk.forEach((w) => {
      if (w.card.node.failure)
        emitBranch(w.card, w.card.node.failure, "failure");
    });
  });

  // Outcome edges on cards outside any grid (track, parallel lanes, fan
  // children) come through the same emitter.
  const chainCardIds = new Set<string>();
  chains.forEach((chain) =>
    chain.walk.forEach((w) => chainCardIds.add(w.card.id)),
  );
  laidOut.forEach((entry) => {
    if (input.connections !== undefined) return;
    if (chainCardIds.has(entry.id)) return;
    if (entry.node.success?.to)
      emitBranch(entry, entry.node.success, "success");
    if (entry.node.failure?.to)
      emitBranch(entry, entry.node.failure, "failure");
  });

  const connectionIds = new Set<string>();
  const connectionPairs = new Set<string>();
  for (const connection of input.connections ?? []) {
    const from = byId.get(connection.fromId), to = byId.get(connection.toId);
    const pair = JSON.stringify([connection.fromId, connection.toId]);
    if (!from || !to || from === to || !connection.id ||
      connectionIds.has(connection.id) || connectionPairs.has(pair)) continue;
    connectionIds.add(connection.id);
    connectionPairs.add(pair);
    const sides = selectSides(boxOf(from), boxOf(to));
    const fromSide = connection.fromSide ?? sides.from;
    const toSide = connection.toSide ?? sides.to;
    emitFlowEdge({
      id: connection.id, fromEntry: from, toEntry: to,
      fromPort: sidePort(from, fromSide), toPort: sidePort(to, toSide),
      prefer: { from: [fromSide], to: [toSide] },
      state: connection.state ?? (input.autoState
        ? toneOf(from.node) !== "neutral" ? nodeIsActive(to.node) ? "flowing" : "stopped" : "disabled"
        : input.flowState ?? "flowing"),
      sourceTone: connection.sourceTone ?? toneOf(from.node),
      targetTone: connection.targetTone ?? toneOf(to.node),
      label: connection.label, cfg: connection,
    });
  }

  separateAnchors(laidOut, edges, connectors, options);
  if (pass < 4 && rowSeams.length) {
    const nextSpace = new Map(rowSpace);
    for (const seam of rowSeams) {
      const above = new Set(seam.before.map((n) => n.id));
      const below = new Set(seam.after.map((n) => n.id));
      const terminals = [...connectors.values()].filter(
        (c) => (c.side === "bottom" && above.has(c.nodeId)) ||
          (c.side === "top" && below.has(c.nodeId)),
      );
      if (!terminals.length) continue;
      const lanes = new Set(terminals.flatMap((c) => c.edgeIds)).size;
      // Room for the terminal runs, corner rounding and each additional lane.
      const required =
        48 + (lanes - 1) *
          routingLaneSpacing(options.pathClearance, options.cornerRadius);
      const top = Math.min(...seam.after.map((n) => byId.get(n.id)!.y));
      const bottom = top - seam.size;
      const missing = Math.max(
        0,
        ...terminals.map((c) =>
          required - (c.side === "bottom" ? top - c.y : c.y - bottom),
        ),
      );
      if (missing > 0.01)
        nextSpace.set(seam.key, seam.size + missing);
    }
    if ([...nextSpace].some(([key, size]) => size > (rowSpace.get(key) ?? 0)))
      return layoutWithRowSpace(input, nextSpace, pass + 1);
  }
  layoutCaptions(laidOut, edges, connectors, options);

  // ── Crossing hops ─────────────────────────────────────────────────────
  // Crossings are legal topology, but they have to read as crossings: where
  // a vertical runs through a horizontal, the horizontal hops over it — and
  // the travelling dots, which follow this same path, hop with it. Edges
  // with nothing crossing them keep their path byte-identical.
  const hopPaths = routeCrossings(
    edges.map((e) => ({
      id: e.id,
      points: e.points,
      style: e.style ?? options.edgeStyle,
    })),
    { cornerRadius: options.cornerRadius },
  );
  for (const e of edges) {
    const d = hopPaths.get(e.id);
    if (d) e.d = d;
  }

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
  edges.forEach((e) => {
    if (e.caption) {
      cover(e.caption.x, e.caption.y);
      cover(e.caption.x + e.caption.width, e.caption.y + e.caption.height);
    }
  });
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
