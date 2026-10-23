import { NetworkGraph } from "@cjlapao/ui-kit";
import { communities, makeNetwork } from "../data";

const graph = makeNetwork(2000);
export default function LargeNetwork() {
  return (
    <NetworkGraph
      {...graph}
      communities={communities}
      height={460}
      variant="subtle"
    />
  );
}
