import React from "react";
import classNames from "classnames";
import TooltipWrapper from "./TooltipWrapper";
import type { TooltipPosition } from "../../../common/tooltip/placement";
import type { TooltipVariant } from "../../../common/tooltip/tokens";

export type { TooltipPosition, TooltipVariant };
export {
  TOOLTIP_POSITIONS,
} from "../../../common/tooltip/placement";
export { TOOLTIP_VARIANTS } from "../../../common/tooltip/tokens";

export interface TooltipProps {
  /** Text shown in the tooltip. When omitted the component renders children as-is. */
  text?: string;
  /** How long to wait (ms) before showing the tooltip. @default 500 */
  delay?: number;
  /**
   * Preferred side. The tooltip flips when there is no room, so this is a
   * preference rather than a guarantee. @default "top"
   */
  position?: TooltipPosition;
  /** How the tooltip is painted. @default "surface" */
  variant?: TooltipVariant;
  /** Gap between trigger and tooltip, in px. @default 8 */
  offset?: number;
  /** Minimum distance kept from every viewport edge, in px. @default 8 */
  margin?: number;
  /**
   * Keep the tooltip inside this element instead of the whole viewport — a
   * scroll container, a panel, a modal.
   */
  boundary?: HTMLElement | null;
  /** Extra classes applied to the outer wrapper element. */
  wrapperClassName?: string;
  children: React.ReactNode;
}

/**
 * A tooltip attached to an inline wrapper element.
 *
 * The positioning and the collision handling live in `TooltipWrapper` — this
 * component is the variant that supplies its own wrapper element, for callers
 * whose children are not a single handler-accepting element (plain text, a
 * fragment, several nodes).
 */
const Tooltip: React.FC<TooltipProps> = ({
  text,
  delay = 500,
  position = "top",
  variant = "surface",
  offset,
  margin,
  boundary,
  wrapperClassName,
  children,
}) => {
  if (!text) return <>{children}</>;

  return (
    <TooltipWrapper
      text={text}
      delay={delay}
      position={position}
      variant={variant}
      offset={offset}
      margin={margin}
      boundary={boundary}
    >
      <div
        // `tabIndex` so the focus path TooltipWrapper offers is reachable: the
        // wrapper is a plain div, so without it a keyboard user can never
        // surface the tooltip.
        tabIndex={0}
        className={classNames(
          "relative inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
          wrapperClassName,
        )}
      >
        {children}
      </div>
    </TooltipWrapper>
  );
};

export default Tooltip;
