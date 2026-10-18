import { useState } from "react";
import { Button, Tooltip } from "@cjlapao/ui-kit";

/**
 * Every trigger asks for `top`. Only the ones with room above get it.
 *
 * The `boundary` prop is what makes this demonstrable on a page: collision is
 * measured against the viewport by default, so triggers sitting at the corners
 * of a box in the middle of a tall page have room in every direction and
 * nothing ever flips. Passing the box as the boundary makes the tooltip flip
 * and clamp against *that* edge instead — which is also what you want for a
 * tooltip inside a scroll container, a panel or a modal.
 *
 * The boundary is intersected with the viewport, so a bounded tooltip still
 * never leaves the screen.
 */
export default function Collision() {
  // A callback ref in state, not `useRef`: a ref's `.current` is null during
  // the first render, so passing it straight to `boundary` would silently do
  // nothing until an unrelated re-render happened to fill it in.
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [bounded, setBounded] = useState(true);

  const corners = [
    ["left-2 top-2", "top-left"],
    ["right-2 top-2", "top-right"],
    ["bottom-2 left-2", "bottom-left"],
    ["bottom-2 right-2", "bottom-right"],
  ] as const;

  return (
    <div className="flex w-full flex-col gap-3">
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={bounded}
          onChange={(e) => setBounded(e.target.checked)}
        />
        Constrain to the dashed box
        <span className="opacity-60">
          — off, collision is measured against the whole window, so nothing flips
        </span>
      </label>

      <div
        ref={setBox}
        className="relative h-56 w-full rounded-lg border border-dashed border-neutral-400 dark:border-neutral-500"
      >
        {corners.map(([pos, label]) => (
          <div key={label} className={`absolute ${pos}`}>
            <Tooltip
              text={`${label} — asked for top`}
              position="top"
              delay={150}
              boundary={bounded ? box : undefined}
            >
              <Button variant="soft" size="sm">
                {label}
              </Button>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
