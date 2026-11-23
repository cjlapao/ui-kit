import { forwardRef, type SVGProps } from "react";

export const Trigger = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <polygon
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points="4 14 10 14 7 23 9 23 20 9 14 9 18 1 7 1"
      ></polygon>
    </svg>
  ),
);

Trigger.displayName = "Trigger";
