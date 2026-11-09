import React, { useMemo } from "react";
import classNames from "classnames";
import { getNodeSurface, type ConnectionFlowLayout, type NodeMetrics } from "../../connectionFlow";
import { getSkeletonLayout, skeletonCardBars, skeletonViewBox } from "../../../../common/connectionFlow/skeleton";
import type { SurfaceVariant } from "../../theme/Theme";

export interface ConnectionFlowSkeletonProps {
  variant: SurfaceVariant;
  metrics: NodeMetrics;
  /** Known graph topology to mirror while refreshing. */
  layout?: ConnectionFlowLayout;
  /** Placeholder cards when no topology is available. @default 6 */
  count?: number;
}

/** A fitted flow preview with connected cards, glyphs and varied body rows. */
const ConnectionFlowSkeleton: React.FC<ConnectionFlowSkeletonProps> = ({
  variant,
  metrics,
  layout,
  count = 6,
}) => {
  const preview = useMemo(() => getSkeletonLayout(metrics, layout, count), [metrics, layout, count]);
  const surface = getNodeSurface("neutral", variant);
  return (
    <div
      className="h-full w-full min-h-0 min-w-0 overflow-hidden animate-pulse motion-reduce:animate-none"
      data-slot="connection-flow-skeleton"
      aria-hidden="true"
    >
      <svg className="block h-full w-full" viewBox={skeletonViewBox(preview, metrics.padding * 2)} preserveAspectRatio="xMidYMid meet">
        <g fill="none" className="stroke-neutral-300 dark:stroke-neutral-600" strokeWidth={1.5}>
          {preview.edges.map(edge => <path key={edge.id} d={edge.d} vectorEffect="non-scaling-stroke" />)}
        </g>
        {preview.nodes.map(node => (
          <g key={node.id} transform={`translate(${node.x} ${node.y})`} data-skeleton-card="">
            <rect width={node.width} height={node.height} rx={8}
              className={classNames(surface.fill, surface.stroke || "stroke-neutral-300 dark:stroke-neutral-600")}
              strokeWidth={1} vectorEffect="non-scaling-stroke" />
            {skeletonCardBars(node.width, node.height, metrics).map((bar, index) => (
              <rect key={index} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx={bar.radius}
                className="fill-neutral-300/70 dark:fill-neutral-600/70" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};

ConnectionFlowSkeleton.displayName = "ConnectionFlowSkeleton";
export default ConnectionFlowSkeleton;
