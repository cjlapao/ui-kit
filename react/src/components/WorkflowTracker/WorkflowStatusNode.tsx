import React from "react";
import classNames from "classnames";

import { Check } from "../../icons/components/Check";
import { Pause } from "../../icons/components/Pause";
import { getStatusTokens, type WorkflowPalette } from "./statusTokens";
import type { WorkflowStatus } from "./types";

export type WorkflowNodeSize = "sm" | "md" | "lg";

const sizeTokens: Record<WorkflowNodeSize, { node: string; glyph: string }> = {
  sm: { node: "h-4 w-4", glyph: "h-2.5 w-2.5" },
  md: { node: "h-5 w-5", glyph: "h-3 w-3" },
  lg: { node: "h-9 w-9", glyph: "h-5 w-5" },
};

/** Dashed ring for `skipped` — drawn as SVG so the dashes stay even at 16px. */
const DashedRing: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
    <circle
      cx="10"
      cy="10"
      r="8.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeDasharray="3 2.7"
      strokeLinecap="round"
    />
  </svg>
);

/** The exclamation used by `attention` — the icon set has no bare "!" glyph. */
const AlertGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12 6.5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm0 9.25a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"
      fill="currentColor"
    />
  </svg>
);

export interface WorkflowStatusNodeProps {
  status: WorkflowStatus;
  palette: WorkflowPalette;
  size?: WorkflowNodeSize;
  className?: string;
}

/**
 * The status glyph shared by the rail, the nested list, the sub-step table,
 * the summary cards and the legend. Purely decorative — the status is always
 * spelled out in adjacent text.
 */
export const WorkflowStatusNode: React.FC<WorkflowStatusNodeProps> = ({
  status,
  palette,
  size = "md",
  className,
}) => {
  const tokens = getStatusTokens(status, palette);
  const { node, glyph } = sizeTokens[size];

  return (
    <span
      aria-hidden="true"
      className={classNames("relative inline-flex shrink-0", node, className)}
    >
      {tokens.pulse && (
        <span
          className={classNames(
            "absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:hidden",
            `bg-${tokens.tone}-300 dark:bg-${tokens.tone}-500`,
          )}
        />
      )}
      <span
        className={classNames(
          "relative inline-flex h-full w-full items-center justify-center rounded-full",
          tokens.node,
        )}
      >
        {tokens.glyph === "check" && (
          <Check className={classNames(glyph, tokens.glyphClass)} />
        )}
        {tokens.glyph === "pause" && (
          <Pause className={classNames(glyph, tokens.glyphClass)} />
        )}
        {tokens.glyph === "alert" && (
          <AlertGlyph className={classNames(glyph, tokens.glyphClass)} />
        )}
        {tokens.glyph === "dashed" && (
          <DashedRing className={classNames("h-full w-full", tokens.glyphClass)} />
        )}
      </span>
    </span>
  );
};

export default WorkflowStatusNode;
