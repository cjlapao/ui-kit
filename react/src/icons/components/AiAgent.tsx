import { forwardRef, type SVGProps } from "react";

export const AiAgent = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" {...props} ref={ref}>
      <path d="M406 24c3-10 17-10 20 0l14 42 42 14c10 3 10 17 0 20l-42 14-14 42c-3 10-17 10-20 0l-14-42-42-14c-10-3-10-17 0-20l42-14 14-42Z"/>
      <path d="M232 64a24 24 0 0 1 24 24v56h48a16 16 0 0 1 0 32H144a48 48 0 0 0-48 48v160a48 48 0 0 0 48 48h224a48 48 0 0 0 48-48V224a48 48 0 0 0-48-48 16 16 0 0 1 0-32 80 80 0 0 1 80 80v24h8a24 24 0 0 1 24 24v64a24 24 0 0 1-24 24h-8v24a80 80 0 0 1-80 80H144a80 80 0 0 1-80-80v-24h-8a24 24 0 0 1-24-24v-64a24 24 0 0 1 24-24h8v-24a80 80 0 0 1 80-80h64V88a24 24 0 0 1 24-24Z"/>
      <path fillRule="evenodd" d="M144 192a32 32 0 0 0-32 32v160a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V224a32 32 0 0 0-32-32H144Zm56 56a24 24 0 1 0 0 48 24 24 0 0 0 0-48Zm112 0a24 24 0 1 0 0 48 24 24 0 0 0 0-48Zm-104 96a16 16 0 0 0 0 32h96a16 16 0 0 0 0-32h-96Z"/>
    </svg>
  ),
);

AiAgent.displayName = "AiAgent";
