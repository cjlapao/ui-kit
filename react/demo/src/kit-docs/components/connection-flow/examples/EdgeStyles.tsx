import { CONNECTION_FLOW_EDGE_STYLES, ConnectionFlow } from "@cjlapao/ui-kit";
import { CI_FLOW } from "./sampleFlow";

/**
 * All three styles route the same way — out along each port's normal, then an
 * axis-aligned turn, with a whole fan sharing one spine. They differ only at
 * the corners: `straight` mitres them, `orthogonal` rounds them by a fixed
 * radius, `curved` rounds them as far as the segments allow.
 */
export default function EdgeStyles() {
  return (
    <div className="grid w-full gap-4">
      {CONNECTION_FLOW_EDGE_STYLES.map((edgeStyle) => (
        <div key={edgeStyle} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {edgeStyle}
          </span>
          <ConnectionFlow
      fitOnLoad
            nodes={CI_FLOW}
            edgeStyle={edgeStyle}
            variant="outlined"
            autoState
            height={260}
          />
        </div>
      ))}
    </div>
  );
}
