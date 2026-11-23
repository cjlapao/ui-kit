import { forwardRef, type SVGProps } from "react";

/** A three-sparkle mark for general AI features. */
export const AiSparkles = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props} ref={ref}>
      <path d="M27.2 8.4a3 3 0 0 1 5.6 0l4.6 12.2 12.2 4.6a3 3 0 0 1 0 5.6l-12.2 4.6-4.6 12.2a3 3 0 0 1-5.6 0l-4.6-12.2-12.2-4.6a3 3 0 0 1 0-5.6l12.2-4.6 4.6-12.2Z" />
      <path d="M50.6 4.5a1.5 1.5 0 0 1 2.8 0l1.8 4.3 4.3 1.8a1.5 1.5 0 0 1 0 2.8l-4.3 1.8-1.8 4.3a1.5 1.5 0 0 1-2.8 0l-1.8-4.3-4.3-1.8a1.5 1.5 0 0 1 0-2.8l4.3-1.8 1.8-4.3ZM49.2 42.3a2 2 0 0 1 3.6 0l2 4.9 4.9 2a2 2 0 0 1 0 3.6l-4.9 2-2 4.9a2 2 0 0 1-3.6 0l-2-4.9-4.9-2a2 2 0 0 1 0-3.6l4.9-2 2-4.9Z" />
    </svg>
  ),
);
AiSparkles.displayName = "AiSparkles";
