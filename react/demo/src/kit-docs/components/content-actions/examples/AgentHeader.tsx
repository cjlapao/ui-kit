import { useState } from "react";
import { ContentActions, ExpandableButton } from "@cjlapao/ui-kit";

export default function AgentHeader() {
  const [width, setWidth] = useState(720);
  return (
    <div className="w-full min-w-0 space-y-4">
      <label className="flex items-center gap-3 text-sm">
        Available width
        <input type="range" min={120} max={900} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
        <span>{width}px</span>
      </label>
      <div
        data-slot="content-actions-demo"
        className="max-w-full resize-x overflow-hidden rounded-xl border border-neutral-300 p-4 dark:border-neutral-700"
        style={{ width, minWidth: 120 }}
      >
        <ContentActions
          contentClassName="overflow-hidden"
          actions={
            <>
              <ExpandableButton icon="Edit" label="Edit agent" variant="soft" />
              <ExpandableButton icon="Copy" label="Duplicate agent" variant="soft" />
              <ExpandableButton icon="Trash" label="Delete agent" variant="soft" color="rose" />
            </>
          }
        >
          <h3 className="truncate text-lg font-semibold">Brainstormer</h3>
          <p className="line-clamp-3 text-sm opacity-70">
            Turns an idea into a reviewable plan. Hover the actions: this text
            yields width while the buttons stay together on the same row.
          </p>
        </ContentActions>
      </div>
    </div>
  );
}
