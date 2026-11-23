import { forwardRef, type SVGProps } from "react";

export const PieChart = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <g transform="translate(-518.000000, -153.000000)">
        <path
          d="M533,153 L533,170.3 L548.947,175.084 C549.568,173.543 550,171.688 550,169.571 C550,160.419 541.453,153 533,153 L533,153 Z M531,156 C524.029,156.728 518,163.026 518,170.5 C518,178.508 524.492,185 532.5,185 C538.397,185 543.463,181.474 545.729,176.418 L531,172 L531,156 L531,156 Z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
);

PieChart.displayName = "PieChart";
