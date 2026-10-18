import { forwardRef, type SVGProps } from "react";

/**
 * Three stacked dots — the overflow ("more actions") affordance. `Dots` is the
 * horizontal sibling; the vertical form is what docks to the right edge of a
 * row, where a horizontal triple would crowd the trailing controls.
 */
export const DotsVertical = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <circle cx="12" cy="5" r="1.7" fill="currentColor" />
    <circle cx="12" cy="12" r="1.7" fill="currentColor" />
    <circle cx="12" cy="19" r="1.7" fill="currentColor" />
  </svg>
));

DotsVertical.displayName = "DotsVertical";
