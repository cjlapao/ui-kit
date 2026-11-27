import type { AiRobotVariant } from "./AiRobot";

/** Io's eyes stay transparent in its solid style. */
export function Io({ variant, maskId }: { variant: AiRobotVariant; maskId: string }) {
  return <>
    {variant === "solid" && <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="white" />
        <g className="cj-ai-robot-eyes" fill="black"><circle cx="9" cy="13" r="1.4" /><circle cx="15" cy="13" r="1.4" /></g>
      </mask>
    </defs>}
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <g className="cj-ai-robot-antenna"><path d="M12 6V3" /><circle cx="12" cy="2" r="1" /></g>
      <path d="M18.348 15.954A7 7 0 1 0 5.727 16.109" />
      {variant === "solid" ?
        <path fill="currentColor" stroke="none" mask={`url(#${maskId})`} d="M6.65 14.9A5.6 5.6 0 1 1 17.35 14.9c-1.08.54-2.8 1.1-5.35 1.1s-4.27-.56-5.35-1.1Z" />
        : <g className="cj-ai-robot-eyes"><circle cx="9" cy="13" r="1" /><circle cx="15" cy="13" r="1" /></g>}
      <path className="cj-ai-robot-io-mouth" d="M6 18.988 5 16s.072-.772.5-.5C6.431 16.091 8.574 17 12 17c3.554 0 5.618-.916 6.5-1.5.359-.238.5.5.5.5l-1 2.988S17.005 21 12 21s-6-2.012-6-2.012Z" />
      <circle cx="12" cy="22" r="1" />
    </g>
  </>;
}
