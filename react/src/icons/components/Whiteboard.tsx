import { forwardRef, type SVGProps } from "react";

export const Whiteboard = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path
        d="M16,15l2,6M8,15,6,21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <rect
        x="3"
        y="3"
        width="18"
        height="12"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></rect>
    </svg>
  ),
);

Whiteboard.displayName = "Whiteboard";
