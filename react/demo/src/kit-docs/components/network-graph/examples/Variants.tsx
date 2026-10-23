import { NetworkGraph } from "@cjlapao/ui-kit";
import { communities, makeNetwork } from "../data";

const graph = makeNetwork(48);
export default function Variants() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(["outlined", "tonal", "glass", "liquid-glass"] as const).map(
        (variant) => (
          <NetworkGraph
            key={variant}
            {...graph}
            communities={communities}
            title={variant}
            variant={variant}
            tone="violet"
            height={220}
            showCommunities={false}
            showControls={false}
          />
        ),
      )}
    </div>
  );
}
