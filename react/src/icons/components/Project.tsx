import { forwardRef, type SVGProps } from "react";

export const Project = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path
        d="M1,5H5V1H1Zm0,6H5V7H1Zm6,0h4V7H7ZM7,1V5h4V1Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
);

Project.displayName = "Project";
