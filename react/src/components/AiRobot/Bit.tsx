import type { AiRobotVariant } from "./AiRobot";

/** Bit keeps the eyes and mouth transparent in its solid style. */
export function Bit({ variant, maskId }: { variant: AiRobotVariant; maskId: string }) {
  return <>
    {variant === "solid" && <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="15" height="15">
        <rect width="15" height="15" fill="white" />
        <g className="cj-ai-robot-eyes" fill="black"><circle cx="5.5" cy="8.5" r="1" /><circle cx="9.5" cy="8.5" r="1" /></g>
        <path className="cj-ai-robot-bit-mouth" d="M4.5 11.5h6" fill="none" stroke="black" strokeWidth=".8" strokeLinecap="round" />
      </mask>
    </defs>}
    <g fill="none" stroke="currentColor">
      <path className="cj-ai-robot-antenna" d="M7.5 2.5V0" />
      <path d="M7.5 2.5c2.7614 0 5 2.23858 5 5v6c0 .5523-.4477 1-1 1h-8c-.5523 0-1-.4477-1-1v-6c0-2.76142 2.23858-5 5-5ZM.5 8v4M14.5 8v4" />
      {variant === "solid" ? <path fill="currentColor" stroke="none" mask={`url(#${maskId})`} d="M7.5 3.35a4.15 4.15 0 0 1 4.15 4.15v5.85a.3.3 0 0 1-.3.3h-7.7a.3.3 0 0 1-.3-.3V7.5A4.15 4.15 0 0 1 7.5 3.35Z" /> : <>
        <g className="cj-ai-robot-eyes"><circle cx="5.5" cy="8.5" r="1" /><circle cx="9.5" cy="8.5" r="1" /></g>
        <path className="cj-ai-robot-bit-mouth" d="M4 11.5h7" />
      </>}
    </g>
  </>;
}
