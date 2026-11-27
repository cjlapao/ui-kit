import type { AiRobotVariant } from "./AiRobot";

/** Spark's face and body details remain transparent in the solid style. */
export function Spark({ variant, maskId }: { variant: AiRobotVariant; maskId: string }) {
  return <>
    {variant === "solid" && <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="white" />
        <g className="cj-ai-robot-eyes" fill="black">
          <polygon points="10.5,6.5 9,7.5 7.5,6.5 7.5,5 9,4 10.5,5" />
          <polygon points="13.5,6.5 15,7.5 16.5,6.5 16.5,5 15,4 13.5,5" />
        </g>
        <path d="M7.6 21.5h8.8" stroke="black" strokeWidth="1" />
      </mask>
    </defs>}
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10.5v3" />
      <g className="cj-ai-robot-spark-head">
        <path className="cj-ai-robot-antenna" d="M12 .5v1" />
        <polygon points="16,10.5 20.5,6 16,1.5 8,1.5 3.5,6 8,10.5" />
        {variant === "solid" ? <polygon points="8.33,2.35 15.67,2.35 19.3,6 15.67,9.65 8.33,9.65 4.7,6" fill="currentColor" stroke="none" mask={`url(#${maskId})`} /> :
          <g className="cj-ai-robot-eyes">
            <polygon points="10.5,6.5 9,7.5 7.5,6.5 7.5,5 9,4 10.5,5" />
            <polygon points="13.5,6.5 15,7.5 16.5,6.5 16.5,5 15,4 13.5,5" />
          </g>}
      </g>
      <polygon points="16,23.5 8,23.5 6.5,16 9,13.5 15,13.5 17.5,16" />
      <g className="cj-ai-robot-spark-left"><path d="m2.5 16 .5 3 3.844-1.281M.5 12v2l2 2 2-2v-2" /></g>
      <g className="cj-ai-robot-spark-right"><path d="m21.5 16-.5 3-3.844-1.281M23.5 12v2l-2 2-2-2v-2" /></g>
      {variant === "solid" ? <polygon points="9.35,14.35 14.65,14.35 16.58,16.28 15.3,22.65 8.7,22.65 7.42,16.28" fill="currentColor" stroke="none" mask={`url(#${maskId})`} /> :
        <path d="M7.6 21.5h8.8" />}
    </g>
  </>;
}
