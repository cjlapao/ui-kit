import type React from "react";
import type { PanelProps } from "../Panel";
import type { TraceDiagnostic, TraceGraphEdge, TraceGraphLayout, TraceGraphNode } from "../../../../common/traceGraph/model";
import type { TraceFollowMode, TraceGraphViewport } from "../../../../common/traceGraph/camera";
export type { TraceDiagnostic, TraceGraphEdge, TraceGraphLayout, TraceGraphNode, TraceGraphStatus } from "../../../../common/traceGraph/model";
export type { TraceFollowMode, TraceGraphViewport } from "../../../../common/traceGraph/camera";

export interface TraceGraphHandle {
  fit: (animate?: boolean) => void;
  zoomTo: (zoom: number, animate?: boolean) => void;
  focusNodes: (ids: readonly string[], animate?: boolean) => void;
  pauseFollowing: () => void;
  resumeFollowing: () => void;
  getViewport: () => TraceGraphViewport;
}
export type TraceGraphGlow = "all" | "active" | "none";
export interface TraceGraphProps extends Omit<PanelProps, "children" | "tone"> {
  /** Untinted neutral panel chrome; node and edge tones are preserved. */
  tone?: PanelProps["tone"] | "none";
  nodes: readonly TraceGraphNode[];
  edges: readonly TraceGraphEdge[];
  layout?: TraceGraphLayout;
  height?: number;
  /** Explicit ids override status-derived running nodes/edges. */
  activeNodeIds?: readonly string[];
  activeEdgeIds?: readonly string[];
  selectedNodeId?: string | null;
  defaultSelectedNodeId?: string | null;
  onNodeSelect?: (node: TraceGraphNode | null) => void;
  onEdgeSelect?: (edge: TraceGraphEdge | null) => void;
  renderNodeTooltip?: (node: TraceGraphNode) => React.ReactNode;
  renderNodePopover?: (node: TraceGraphNode) => React.ReactNode;
  followMode?: TraceFollowMode;
  defaultFollowMode?: TraceFollowMode;
  onFollowModeChange?: (mode: TraceFollowMode) => void;
  onViewportChange?: (viewport: TraceGraphViewport) => void;
  onDiagnostics?: (diagnostics: readonly TraceDiagnostic[]) => void;
  onRendererChange?: (backend: "webgl2" | "canvas2d") => void;
  renderer?: "auto" | "canvas";
  minZoom?: number;
  maxZoom?: number;
  animation?: boolean;
  /** Boolean values remain supported: true means all, false means none. */
  glow?: TraceGraphGlow | boolean;
  /** Point halo strength for both idle and active junctions, 0–3. Default 1.
   * Halo radius shrinks with zoom; does not change dot or selection size. */
  junctionGlowIntensity?: number;
  /** Animated sparks on active points/paths; requires glow and animation. */
  sparkles?: boolean;
  /** Spark opacity/strength, clamped to 0–3. Default 1. */
  sparkleIntensity?: number;
  /** Spark travel and flare speed multiplier, clamped to 0–4. Default 1. */
  sparkleSpeed?: number;
  /** Maximum pulse radius as a multiple of dot radius. 2.5 = 250%. Range 0–6. */
  pulseScale?: number;
  /** @deprecated Use pulseScale. Converted to a dot-relative scale (value / 4). */
  flareSize?: number;
  showLabels?: boolean;
  showControls?: boolean;
  ariaLabel?: string;
  emptyState?: React.ReactNode;
  /** Copy overrides; all built-in copy is also available in kit.traceGraph. */
  labels?: Partial<Record<"fit" | "zoomIn" | "zoomOut" | "search" | "follow" | "resume" | "pause" | "details" | "close" | "help" | "empty", string>>;
}
