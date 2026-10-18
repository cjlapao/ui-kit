import { SURFACE_VARIANTS, ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const TRIO: ConnectionFlowNode[] = [
  { id: "a", title: "Build", subtitle: "13m 13s", icon: "Docker", tone: "emerald" },
  { id: "b", title: "Deploy", subtitle: "eu-west-1", icon: "Host", tone: "blue" },
  { id: "c", title: "Announce", subtitle: "waiting", icon: "Notification" },
];

/**
 * `variant` is one decision, not two. The panel and the cards inside it take
 * the same surface, painted from the same shade table `Panel` uses — a card
 * sitting in a panel is part of that panel, not a second surface language
 * layered on top of it.
 *
 * The card is drawn as an SVG path (a terminal is the card bulging), so the
 * glass variants keep their translucent fill and light rim but cannot carry a
 * backdrop blur.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {SURFACE_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {variant}
          </span>
          <ConnectionFlow
            fitOnLoad
            nodes={TRIO}
            variant={variant}
            title={variant}
            size="sm"
            progressType="none"
            showControls={false}
            height={150}
          />
        </div>
      ))}
    </div>
  );
}
