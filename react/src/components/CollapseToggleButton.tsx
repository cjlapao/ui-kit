import React from "react";
import classNames from "classnames";
import IconButton, { type IconButtonProps } from "./IconButton";

/**
 * The collapse / expand chevron, drawn on the `Close` icon's own geometry so
 * the two read as one family at one size: a 24-unit box, arms at 45° spanning
 * the same 6.97 → 17.03 the × does, the same 1.5-unit weight, square ends.
 * The shared `ChevronRight` (20-unit box, 70% extent, 2-unit stroke) read
 * about 1.7× bigger and twice as heavy beside a close button.
 */
// SVG attributes without `ref`: nothing forwards one, and a `ref` in the prop
// type clashes when an app resolves a second copy of React's types.
export const CollapseChevron: React.FC<React.SVGAttributes<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-collapse-chevron
    {...props}
  >
    <path
      d="M9.5 6.97 14.53 12 9.5 17.03"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </svg>
);

export interface CollapseToggleButtonProps
  extends Omit<IconButtonProps, "icon" | "variant" | "color" | "aria-expanded"> {
  /** The region's current state. */
  collapsed: boolean;
  /**
   * The edge the region folds toward. The chevron points the way the region
   * will move: toward this edge to collapse, away from it to expand.
   * `top` / `bottom` are for regions that fold vertically (a docked
   * bottom panel collapsing to its header).
   */
  edge: "left" | "right" | "top" | "bottom";
}

/**
 * The kit's one collapse toggle — SidePanel's and the WorkflowTracker rail's.
 * A ghost, neutral icon button (chrome, not a call to action) with the
 * close-matched chevron, so it sits beside or in place of a close button at
 * exactly its size. `aria-expanded` follows `collapsed`.
 */
export const CollapseToggleButton: React.FC<CollapseToggleButtonProps> = ({
  collapsed,
  edge,
  size = "sm",
  ...rest
}) => {
  // The glyph points right at rest; each edge is a quarter turn of it.
  // Pointing toward the edge collapses, pointing away expands.
  const towardEdge = !collapsed;
  const rotation = {
    right: towardEdge ? "" : "rotate-180",
    left: towardEdge ? "rotate-180" : "",
    bottom: towardEdge ? "rotate-90" : "-rotate-90",
    top: towardEdge ? "-rotate-90" : "rotate-90",
  }[edge];
  return (
    <IconButton
      icon={
        <CollapseChevron
          className={classNames(
            "transition-transform duration-200 motion-reduce:transition-none",
            rotation,
          )}
        />
      }
      size={size}
      variant="ghost"
      color="neutral"
      aria-expanded={!collapsed}
      {...rest}
    />
  );
};

export default CollapseToggleButton;
