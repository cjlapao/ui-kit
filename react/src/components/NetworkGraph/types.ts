import type { PanelProps } from "../Panel";
import type { TrueColor } from "../../theme/Theme";

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
  legendTone?: "auto" | TrueColor;
  /** Auto places the legend right at 600px available width, otherwise below. */
  legendPosition?: "auto" | "right" | "bottom";
  showLabels?: boolean;
  showControls?: boolean;
  /** Localized graph name. Other chrome uses the kit catalogs. */
  ariaLabel?: string;
  emptyMessage?: React.ReactNode;
  onViewportChange?: (viewport: NetworkGraphViewport) => void;
}
