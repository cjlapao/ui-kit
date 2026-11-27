import type { AiRobotVariant } from "./AiRobot";

/** Hex uses transparent animated facial cutouts in its solid style. */
export function Hex({ variant, maskId }: { variant: AiRobotVariant; maskId: string }) {
  return <>
    {variant === "solid" && <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="white" />
        <g className="cj-ai-robot-eyes" fill="black"><circle cx="7.5" cy="12" r="2" /><circle cx="16.5" cy="12" r="2" /></g>
        <path className="cj-ai-robot-bit-mouth" d="M10 16c0 .55.9 1 2 1s2-.45 2-1" fill="none" stroke="black" strokeWidth="1" strokeLinecap="round" />
      </mask>
    </defs>}
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <g className="cj-ai-robot-antenna" strokeLinecap="round"><path d="M7.5 7.5v-2M16.5 7.5v-2" /></g>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      {variant === "solid" ? <rect x="4.85" y="8.85" width="14.3" height="9.3" rx="1.15" fill="currentColor" stroke="none" mask={`url(#${maskId})`} /> : <>
        <g className="cj-ai-robot-eyes"><circle cx="7.5" cy="12" r="1.5" /><circle cx="16.5" cy="12" r="1.5" /></g>
        <path className="cj-ai-robot-bit-mouth" d="M10 16c0 .55.9 1 2 1s2-.45 2-1" strokeLinecap="round" />
      </>}
    </g>
  </>;
}
