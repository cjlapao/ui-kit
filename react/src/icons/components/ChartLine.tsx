import { forwardRef, type SVGProps } from "react";

/** A line-chart glyph: baseline, rising trend line and two data dots. */
export const ChartLine = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path d="M3 3v18h18" />
      <path d="M6.5 15.5 10 11l3 2.5 4.5-6" />
      <circle cx="10" cy="11" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="7.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
);

ChartLine.displayName = "ChartLine";
