import { Panel } from "@cjlapao/ui-kit";
import type { PanelMediaPlacement } from "@cjlapao/ui-kit";

const placements: PanelMediaPlacement[] = ["top", "start", "end", "overlay"];

const media = (
  <div className="h-24 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400" />
);

export default function MediaPlacements() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {placements.map((placement) => (
        <Panel
          key={placement}
          variant="elevated"
          padding="sm"
          title={placement}
          media={
            placement === "overlay" ? (
              <div className="h-full min-h-32 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400" />
            ) : (
              media
            )
          }
          mediaPlacement={placement}
          subtitle={
            placement === "overlay" ? "Text over the image" : undefined
          }
        >
          {placement === "overlay"
            ? "The media fills the card and the copy sits on top."
            : "The media takes this slot around the content."}
        </Panel>
      ))}
    </div>
  );
}
