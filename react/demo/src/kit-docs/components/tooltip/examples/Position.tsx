import { Button, Tooltip, TOOLTIP_POSITIONS } from "@cjlapao/ui-kit";

/**
 * Four sides. `left` and `right` did not exist before — the type was
 * `"top" | "bottom"` only.
 *
 * Each is a *preference*: the tooltip flips to the opposite side when there is
 * no room, then to a perpendicular one if neither vertical side fits, and
 * clamps inside the viewport either way.
 */
export default function Position() {
  return (
    <div className="flex flex-wrap gap-3">
      {TOOLTIP_POSITIONS.map((position) => (
        <Tooltip key={position} text={`Preferred side: ${position}`} position={position} delay={200}>
          <Button variant="soft" color="blue">
            {position}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
