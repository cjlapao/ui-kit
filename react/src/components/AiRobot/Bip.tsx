import type { AiRobotVariant } from "./AiRobot";

/** Bip's cutouts remain transparent against the surrounding surface. */
export function Bip({ variant, maskId }: { variant: AiRobotVariant; maskId: string }) {
  return <>
    {variant === "solid" && <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="white" />
        <g className="cj-ai-robot-eyes" fill="black"><circle cx="9" cy="16" r="1" /><circle cx="15" cy="16" r="1" /></g>
        <path d="M7.382 9h9.236l-1.447 2.894A2 2 0 0 1 13.382 13h-2.764a2 2 0 0 1-1.789-1.106Z" fill="black" />
      </mask>
    </defs>}
    <g fill="currentColor">
      <g className="cj-ai-robot-antenna"><path d="M11 4h2v3h-2z" /><circle cx="12" cy="3" r="2" /></g>
      <path fillRule="evenodd" clipRule="evenodd" d="M6 7h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3Zm-1 3c0-.552.448-1 1-1h1.382l1.447 2.894A2 2 0 0 0 10.618 13h2.764a2 2 0 0 0 1.789-1.106L16.618 9H18c.552 0 1 .448 1 1v10c0 .552-.448 1-1 1H6c-.552 0-1-.448-1-1V10Zm8.382 1 1-2H9.618l1 2h2.764Z" />
      {variant === "solid" ? <rect x="5.5" y="9.5" width="13" height="11" rx=".5" mask={`url(#${maskId})`} /> :
        <g className="cj-ai-robot-eyes"><circle cx="9" cy="16" r="1" /><circle cx="15" cy="16" r="1" /></g>}
      <rect x="0" y="14" width="2" height="4" rx="1" />
      <rect x="22" y="14" width="2" height="4" rx="1" />
    </g>
  </>;
}
