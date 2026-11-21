import { forwardRef, type SVGProps } from "react";

export const ShiftManual = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path
        d="M3 12H19.5C20.3284 12 21 12.6716 21 13.5V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <circle
        cx="12"
        cy="3"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
      <circle
        cx="3"
        cy="3"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
      <circle
        cx="12"
        cy="21"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
      <circle
        cx="21"
        cy="21"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
      <circle
        cx="3"
        cy="21"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
      <path
        d="M3 8V12V14.25V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 7.5V12V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  ),
);

ShiftManual.displayName = "ShiftManual";
