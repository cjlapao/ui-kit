import { useState } from "react";
import { NetworkGraph } from "@cjlapao/ui-kit";
import { communities, sample } from "../data";

export default function Communities() {
  const [visible, setVisible] = useState(communities.map((c) => c.id));
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <NetworkGraph
      {...sample}
      communities={communities}
      height={380}
      variant="glass"
      visibleCommunityIds={visible}
      onVisibleCommunitiesChange={setVisible}
      selectedNodeId={selected}
      onNodeSelect={(node) => setSelected(node?.id ?? null)}
    />
  );
}
