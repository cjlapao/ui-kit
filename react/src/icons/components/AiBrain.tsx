import { forwardRef, type SVGProps } from "react";

/** A solid brain with simplified folds for AI navigation. */
export const AiBrain = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props} ref={ref}>
      <path d="M29 8a8 8 0 0 0-13 5.1A9 9 0 0 0 8.4 26 10 10 0 0 0 8 41.4a9 9 0 0 0 9.1 11.8A8 8 0 0 0 29 57V39h-3a5 5 0 0 1-5-5 2 2 0 1 1 4 0 1 1 0 0 0 1 1h3V23h-3a5 5 0 0 1-5-5 2 2 0 1 1 4 0 1 1 0 0 0 1 1h3V8Zm6 0a8 8 0 0 1 13 5.1A9 9 0 0 1 55.6 26a10 10 0 0 1 .4 15.4 9 9 0 0 1-9.1 11.8A8 8 0 0 1 35 57V39h3a5 5 0 0 0 5-5 2 2 0 1 0-4 0 1 1 0 0 1-1 1h-3V23h3a5 5 0 0 0 5-5 2 2 0 1 0-4 0 1 1 0 0 1-1 1h-3V8Z" />
    </svg>
  ),
);
AiBrain.displayName = "AiBrain";
