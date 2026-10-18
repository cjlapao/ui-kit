import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const NODES: ConnectionFlowNode[] = [
  { id: "a", title: "Fetch", tone: "emerald", progress: 1, icon: "Download" },
  { id: "b", title: "Transform", tone: "blue", progress: 0.6, active: true, icon: "Cog" },
  { id: "c", title: "Load", tone: "neutral", progress: 0, icon: "Save" },
];

/** The bar and the spinner are alternatives — only one is ever shown. */
export default function ProgressExample() {
  return (
    <div className="grid w-full gap-4">
      {(["bar", "spinner"] as const).map((progressType) => (
        <div key={progressType} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            progressType=&quot;{progressType}&quot;
          </span>
          <ConnectionFlow
      fitOnLoad
            nodes={NODES}
            progressType={progressType}
            variant="outlined"
            height={200}
          />
        </div>
      ))}
    </div>
  );
}
