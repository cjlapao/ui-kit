import { forwardRef, type SVGProps } from "react";

export const Investigator = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <ellipse cx="32" cy="33.32" rx="24" ry="6.22" fill="currentColor"></ellipse>
    <path
      d="M40.73,11.14c-0.27-1.45-1.51-2.51-2.95-2.51c0,0,0,0,0,0c-0.79,0-1.56,0.33-2.12,0.93 c-0.51,0.55-1.03,1.09-1.55,1.64c-1.17,1.25-3.07,1.25-4.24,0c-0.52-0.55-1.03-1.1-1.55-1.64c-0.56-0.6-1.32-0.93-2.12-0.93 c-1.44,0-2.67,1.06-2.95,2.51c-1.48,7.87-2.96,13.35-4.41,20.63c8.64,2.07,17.64,2.07,26.28,0C43.69,24.49,42.21,19.01,40.73,11.14 z"
      fill="currentColor"
    ></path>
    <path
      d="M36.11,49.75c-2.27-2.27-5.96-2.27-8.23,0l-1.66-1.66c3.18-3.18,8.36-3.18,11.54,0L36.11,49.75z"
      fill="currentColor"
    ></path>
    <circle cx="23.51" cy="48.92" r="6.45" fill="currentColor"></circle>
    <circle cx="40.49" cy="48.92" r="6.45" fill="currentColor"></circle>
  </svg>
));

Investigator.displayName = "Investigator";
