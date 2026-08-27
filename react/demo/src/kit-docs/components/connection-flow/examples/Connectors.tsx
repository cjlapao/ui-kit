import { CONNECTION_FLOW_RING_SIZES, ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const PAIR: ConnectionFlowNode[] = [
  {
    id: "listen",
    title: "LISTENING",
    subtitle: "0.0.0.0:40900",
    icon: "Globe",
    tone: "sky",
    active: true,
  },
  { id: "target", title: "TARGET", subtitle: "6c6620…", icon: "Host" },
];

/**
 * A terminal is the card itself bulging. The node's silhouette is one path — a
 * rounded rectangle that detours around each of its ports — so the bulge takes
 * the same fill as the rest of the card and no border crosses it. A solid dot
 * at the centre is what the edge attaches to. `ringSize` sizes the bulge on the
 * shared control scale, and `fit` leaves the outline straight. Terminals belong
 * to the port, not to the edge, so a fan-out draws one — not one per line.
 */
export default function Connectors() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {CONNECTION_FLOW_RING_SIZES.filter((size) =>
        ["fit", "sm", "xl"].includes(size),
      ).map((ringSize) => (
        <div key={ringSize} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {ringSize}
          </span>
          <ConnectionFlow
      fitOnLoad
            nodes={PAIR}
            ringSize={ringSize}
            size="sm"
            progressType="none"
            showControls={false}
            height={160}
          />
        </div>
      ))}
    </div>
  );
}
