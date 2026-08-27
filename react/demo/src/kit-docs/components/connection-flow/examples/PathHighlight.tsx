import { ConnectionFlow } from "@cjlapao/ui-kit";
import { CI_FLOW } from "./sampleFlow";

/**
 * Hover or focus any node: everything that had to happen for it to be reached
 * stays lit, and the rest dims.
 */
export default function PathHighlight() {
  return (
    <ConnectionFlow
      fitOnLoad
      nodes={CI_FLOW}
      autoState
      highlightPath
      height={280}
      variant="outlined"
    />
  );
}
