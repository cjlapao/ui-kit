import type { SurfaceTone, ButtonVariant, ButtonWeight } from "../../theme/Theme";
import type { PanelProps } from "../Panel";
import type { TrueColor } from "../../theme/Theme";
import type { GridBackgroundProps } from "../GridBackground";

export interface NetworkGraphNode {
  id: string;
  label?: string;
  community?: string;
  tone?: TrueColor;
  /** World coordinates. Supply both to bypass automatic placement. */
  x?: number;
  y?: number;
  /** Radius in world units, clamped to 1–40. Default: 4. */
  radius?: number;
}
export interface NetworkGraphEdge {
  id: string;
  source: string;
  target: string;
  tone?: TrueColor;
}
export interface NetworkGraphCommunity {
  id: string;
  label: string;
  tone?: TrueColor;
}
export interface NetworkGraphViewport {
  x: number;
  y: number;
  zoom: number;
}
/** Derived details about the selected node, handed to inspector renderers. */
export interface NetworkGraphSelectionInfo {
  /** Node label, falling back to the id. */
  label: string;
  /** Community metadata when the node belongs to a community. */
  community?: NetworkGraphCommunity;
  /** Number of visible and hidden connections the node has. */
  connectionCount: number;
  /** Direct neighbours, in declaration order. */
  neighbors: readonly NetworkGraphNode[];
}
/** Helpers the built-in inspector actions use, also passed to custom action renderers. */
export interface NetworkGraphInspectorHelpers {
  /** Pan the canvas so the selected node sits in the middle of the viewport. */
  centerOnNode: () => void;
  /** Clear the selection, closing the inspector. */
  close: () => void;
}
export interface NetworkGraphProps extends Pick<
  PanelProps,
  | "variant"
  | "tone"
  | "corner"
  | "glassOpacity"
  | "vibrancy"
  | "specularMode"
  | "className"
  | "style"
  | "loading"
  | "disabled"
  | "title"
  | "description"
> {
  nodes: readonly NetworkGraphNode[];
  edges: readonly NetworkGraphEdge[];
  communities?: readonly NetworkGraphCommunity[];
  /** Height of the graph viewport, in CSS pixels. Default: 480. */
  height?: number;
  selectedNodeId?: string | null;
  defaultSelectedNodeId?: string | null;
  onNodeSelect?: (node: NetworkGraphNode | null) => void;
  /** Omit for internal filtering. Unknown communities are inferred from nodes. */
  visibleCommunityIds?: readonly string[];
  onVisibleCommunitiesChange?: (ids: string[]) => void;
  highlightedEdgeIds?: readonly string[];
  showCommunities?: boolean;
  /** Wrap the legend in a Panel. Default: false. */
  legendPanel?: boolean;
  /** Legend Panel surface; auto follows the graph variant. Default: auto. */
  legendVariant?: "auto" | NonNullable<PanelProps["variant"]>;
  /** Legend Panel tone; auto follows the graph tone. Default: auto. */
  legendTone?: "auto" | SurfaceTone;
  /** Auto places the legend right at 600px available width, otherwise below. */
  legendPosition?: "auto" | "right" | "bottom";
  /** Reveal a details inspector alongside the graph when a node is selected. Default: false. */
  inspector?: boolean;
  /** Inspector Panel surface; auto follows the graph variant. Default: auto. */
  inspectorVariant?: "auto" | NonNullable<PanelProps["variant"]>;
  /** Inspector Panel tone; auto follows the graph tone. Default: auto. */
  inspectorTone?: "auto" | SurfaceTone;
  /** Inspector column width in CSS pixels, when alongside the graph. Default: 280. */
  inspectorWidth?: number;
  /**
   * The graph column's floor, used to derive where the inspector stops fitting: it
   * docks beside the graph only while the component is at least
   * `inspectorWidth + 16 + inspectorMinMainWidth` wide, and stacks under it below
   * that. Raised when the graph needs more room to stay legible. Default: 320.
   */
  inspectorMinMainWidth?: number;
  /**
   * Escape hatch for the dock/stack decision: stack while the component is narrower
   * than this many CSS pixels, instead of the fit-derived threshold. `0` always
   * docks beside the graph; a large value always stacks below it.
   */
  inspectorStackBelow?: number;
  /** Eyebrow label above the selected node's name. Uses the kit "Inspector" string by default. */
  inspectorTitle?: React.ReactNode;
  /** Variant for the built-in inspector buttons. Default: "solid". */
  inspectorButtonVariant?: ButtonVariant;
  /** Colour for the built-in inspector buttons. Default: "slate". */
  inspectorButtonTone?: TrueColor;
  /** Weight for the built-in inspector buttons. */
  inspectorButtonWeight?: ButtonWeight;
  /** Replace the standard details body (label, community, id, connections, neighbours). */
  renderInspectorBody?: (
    node: NetworkGraphNode,
    info: NetworkGraphSelectionInfo,
  ) => React.ReactNode;
  /** Replace the built-in "Center on node" / "Close" footer buttons. */
  renderInspectorActions?: (
    node: NetworkGraphNode,
    info: NetworkGraphSelectionInfo,
    helpers: NetworkGraphInspectorHelpers,
  ) => React.ReactNode;
  showLabels?: boolean;
  showControls?: boolean;
  /**
   * Decorative lattice behind the canvas, mirroring AgentMap's. Default: a
   * blue dot pattern. Set false to hide it; pass an object to override the
   * GridBackground settings — `grid.lineColor` overrides `gridTone`.
   */
  grid?:
    | boolean
    | Pick<
        GridBackgroundProps,
        "pattern" | "size" | "lineColor" | "dotSize" | "opacity" | "fade" | "fadeStart"
      >;
  /** Theme color of the grid lattice. Default: "blue". */
  gridTone?: TrueColor;
  /**
   * Preview-highlight the node under the pointer — a thin tone ring, its
   * label and full opacity even while a selection dims the rest. Purely
   * visual: never selects, fires no callbacks or touches the inspector.
   * Default: true. Set false for a static canvas.
   */
  hoverHighlight?: boolean;
  /** Fill the height of a parent with a defined height (overrides `height`). */
  fullHeight?: boolean;
  /** Fill the available width. @default true */
  fullWidth?: boolean;
  /** Localized graph name. Other chrome uses the kit catalogs. */
  ariaLabel?: string;
  emptyMessage?: React.ReactNode;
  onViewportChange?: (viewport: NetworkGraphViewport) => void;
}
