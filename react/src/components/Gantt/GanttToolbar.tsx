/**
 * GanttToolbar — the zoom control in the detached header.
 *
 * A compact pill: the four discrete zoom presets (Day / Week / Month /
 * Quarter) as a segmented control, plus fine zoom-out / zoom-in buttons.
 * The active preset is whichever is closest to the current zoom. The pill's
 * chrome (fill, border, backdrop) follows the Gantt's Panel surface variant,
 * via the shared surface-variant class set so it sits flush beside the
 * container.
 */

import React, { useMemo } from "react";
import classNames from "classnames";
import { getSurfaceVariantClasses } from "../../theme/Theme";
import type { SurfaceVariant } from "../../theme/Theme";
import type { GANTT_ZOOM_PRESET } from "../../../../common/gantt";
import Button from "../Button";

interface GanttToolbarProps {
  /** Gantt surface variant the pill should match. @default "elevated" */
  variant?: SurfaceVariant;
  zoom: number;
  presets: GANTT_ZOOM_PRESET[];
  /** Set the zoom to an absolute value (preset jumps). */
  onZoomTo: (value: number) => void;
  /** Multiply the current zoom by a factor (fine +/−). */
  onZoomBy: (factor: number) => void;
}

/** Nearest preset to a zoom value, by relative distance. */
function nearestPreset(zoom: number, presets: GANTT_ZOOM_PRESET[]): number | null {
  let best: GANTT_ZOOM_PRESET | null = null;
  let bestDist = Infinity;
  for (const p of presets) {
    const dist = Math.abs(Math.log(p.value / zoom)); // log distance = zoom symmetry
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  }
  // Only snap the label when we're close (within ~15% of the preset).
  return best && bestDist < 0.15 ? best.value : null;
}

export const GanttToolbar: React.FC<GanttToolbarProps> = ({
  variant = "elevated",
  zoom,
  presets,
  onZoomTo,
  onZoomBy,
}) => {
  const active = useMemo(() => nearestPreset(zoom, presets), [zoom, presets]);
  const chrome = useMemo(
    () => getSurfaceVariantClasses(variant, "neutral"),
    [variant],
  );

  return (
    <div
      className={classNames(
        "pointer-events-auto flex items-center gap-1 rounded-lg p-1",
        chrome,
      )}
    >
      <div className="flex items-center rounded-md bg-neutral-100 p-0.5 dark:bg-neutral-800">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onZoomTo(p.value)}
            className={classNames(
              "rounded px-1.5 py-0.5 text-[10.5px] font-semibold transition-colors",
              active === p.value
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-600 dark:text-white"
                : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="mx-0.5 h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
      <Button variant="ghost" size="xs" onClick={() => onZoomBy(1 / 1.25)} aria-label="Zoom out">
        <span className="text-xs font-semibold leading-none">−</span>
      </Button>
      <Button variant="ghost" size="xs" onClick={() => onZoomBy(1.25)} aria-label="Zoom in">
        <span className="text-xs font-semibold leading-none">+</span>
      </Button>
    </div>
  );
};

GanttToolbar.displayName = "GanttToolbar";
