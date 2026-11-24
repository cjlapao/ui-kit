import React, { useState } from "react";
import { StatCard } from "@cjlapao/ui-kit";
import { PlaygroundPanel, ToggleRow } from "../../shared/PlaygroundPanel";
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

  // The shared base controls own everything StatCard defines; this one
  // arrives playground-side and rides the card's Panel like the rest.
  const [raisedSurface, setRaisedSurface] = useState(false);
  const surfaceGroups = groups.map((group) =>
    group.id === "core"
      ? {
          ...group,
          controls: (
            <>
              {group.controls}
              <ToggleRow
                label="Raised surface"
                checked={raisedSurface}
                onChange={setRaisedSurface}
              />
            </>
          ),
        }
      : group,
  );

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion groups={surfaceGroups} />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Sync to value</strong> drives the bar from the card's own
            figure, so a percentage metric is written once. The decoration comes
            from <code>Panel</code> now — the old hand-rolled quarter-circle cut
            a hard arc across the corner and was silently implied by the icon.
            <strong> Selected</strong> and <strong>Pulse</strong> are the
            surface's state half — <code>Panel</code>'s own <code>active</code>{" "}
            and <code>pulse</code>, forwarded whole — and the two swatch rows are
            the licence to let those states wear hues the card does not. Turn on{" "}
            <strong>Hoverable</strong> to put a pointer on a card that is not
            clickable — and <strong>Selected</strong> with it: leave{" "}
            <strong>Hover hue</strong> on Auto and the wash arrives in the hue the
            selection wears, while an unselected card keeps hovering in its own
            tone. On a <strong>Gradient wash</strong> card the
            selection arrives as rim and glow only, because the card's own
            background outranks the wash.
          </p>
        </div>
      }
      preview={
        <div
          ref={previewStageRef}
          className={previewClassName ?? "w-full max-w-xs"}
        >
          <div className={previewItemClassName}>
            <StatCard {...statProps} raisedSurface={raisedSurface} label="Quota used" value={72} />
          </div>
        </div>
      }
    />
  );
};
