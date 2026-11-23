import React from "react";
import { StatCard } from "@cjlapao/ui-kit";
import { PlaygroundPanel } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { useStatBaseControls } from "../../shared/StatBaseControls";

/**
 * The base card's own playground.
 *
 * Its controls come from `useStatBaseControls`, shared with the Stat Tiles
 * page — every tile inherits `StatCardProps`, so the two playgrounds must
 * offer the same base options, and one copy of the controls is the only way
 * that stays true as the card grows.
 *
 * Every choice uses `ChoiceControl`, which renders a full-width segmented
 * `MultiToggle` for short lists and a full-width `Select` once there are four
 * or more options.
 */
export const StatCardPlayground: React.FC = () => {
  const {
    groups,
    statProps,
    previewClassName,
    previewItemClassName,
    previewStageRef,
  } = useStatBaseControls();

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion groups={groups} />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Sync to value</strong> drives the bar from the card's own
            figure, so a percentage metric is written once. The decoration comes
            from <code>Panel</code> now — the old hand-rolled quarter-circle cut
            a hard arc across the corner and was silently implied by the icon.
            <strong> Selected</strong> and <strong>Pulse</strong> are the
            surface's state half — <code>Panel</code>'s own <code>active</code>{" "}
            and <code>pulse</code>, forwarded whole — and the two swatch rows are
            the licence to let those states wear hues the card does not. On a{" "}
            <strong>Gradient wash</strong> card the selection arrives as rim and
            glow only, because the card's own background outranks the wash.
          </p>
        </div>
      }
      preview={
        <div
          ref={previewStageRef}
          className={previewClassName ?? "w-full max-w-xs"}
        >
          <div className={previewItemClassName}>
            <StatCard {...statProps} label="Quota used" value={72} />
          </div>
        </div>
      }
    />
  );
};
