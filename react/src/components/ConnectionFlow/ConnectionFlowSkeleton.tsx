import React from "react";
import classNames from "classnames";

import { SkeletonBar } from "../Panel";
import { getHeaderSurface, type NodeMetrics } from "../../connectionFlow";
import type { SurfaceVariant } from "../../theme/Theme";

export interface ConnectionFlowSkeletonProps {
  variant: SurfaceVariant;
  metrics: NodeMetrics;
  /** Placeholder cards to draw. @default 4 */
  count?: number;
}

/**
 * Placeholder cards in a plain chain, at the real card size.
 *
 * Shaped from `NodeMetrics` rather than guessed, so the frame holds the height
 * a real graph would need and nothing jumps when the data lands — the same
 * reason `PanelSkeleton` mirrors the slots its caller actually passed.
 */
const ConnectionFlowSkeleton: React.FC<ConnectionFlowSkeletonProps> = ({
  variant,
  metrics,
  count = 4,
}) => {
  const surface = getHeaderSurface(variant);
  return (
    <div
      className="flex h-full animate-pulse items-center motion-reduce:animate-none"
      style={{ gap: metrics.width / 4, padding: metrics.padding * 2 }}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span
              className={classNames("h-px shrink-0", surface.chip)}
              style={{ width: metrics.width / 4 }}
            />
          )}
          <div
            className={classNames(
              "flex shrink-0 flex-col justify-center rounded-lg border",
              surface.divider,
            )}
            style={{
              width: metrics.width,
              height: metrics.height,
              padding: metrics.padding,
              gap: metrics.gap,
            }}
          >
            <SkeletonBar width="70%" className="h-3" />
            <SkeletonBar width="45%" className="h-2.5" />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

ConnectionFlowSkeleton.displayName = "ConnectionFlowSkeleton";

export default ConnectionFlowSkeleton;
