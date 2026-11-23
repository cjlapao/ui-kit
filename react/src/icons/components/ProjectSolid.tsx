import { forwardRef, type SVGProps } from "react";

export const ProjectSolid = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <path
      d="M2,9H9V2H2Zm0,9H9V11H2ZM18,2H11V9h7Zm-8,9,5,8,5-8Z"
      fill="currentColor"
    ></path>
  </svg>
));

ProjectSolid.displayName = "ProjectSolid";
