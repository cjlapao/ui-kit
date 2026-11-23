import { forwardRef, type SVGProps } from "react";

/** Stacked layers representing a language model. */
export const LlmModel = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props} ref={ref}>
      <path d="M29.8 5.5a5 5 0 0 1 4.4 0l24 12a3 3 0 0 1 0 5.4l-24 12a5 5 0 0 1-4.4 0l-24-12a3 3 0 0 1 0-5.4l24-12Z" />
      <path d="M5.5 29a3 3 0 0 1 4-1.3L32 39l22.5-11.3a3 3 0 0 1 2.7 5.4l-23 11.5a5 5 0 0 1-4.4 0l-23-11.5a3 3 0 0 1-1.3-4.1Z" />
      <path d="M5.5 40a3 3 0 0 1 4-1.3L32 50l22.5-11.3a3 3 0 0 1 2.7 5.4l-23 11.5a5 5 0 0 1-4.4 0l-23-11.5A3 3 0 0 1 5.5 40Z" />
    </svg>
  ),
);
LlmModel.displayName = "LlmModel";
