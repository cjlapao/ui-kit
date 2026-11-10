import { useState } from "react";
import { ContentActions, ExpandableButton, type ControlSize } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { controlSizeOptions } from "../../shared/options";

export function ContentActionsPlayground() {
  const [width, setWidth] = useState(560);
  const [gap, setGap] = useState<ControlSize>("md");
  const [align, setAlign] = useState<"start" | "center" | "end">("start");
  const [showActions, setShowActions] = useState(true);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-4">
          <Control label={`Available width — ${width}px`}>
            <input aria-label="Preview width" type="range" min={160} max={900} step={10} value={width} onChange={(event) => setWidth(Number(event.target.value))} className="w-full accent-blue-500" />
          </Control>
          <SelectControl label="Gap" options={controlSizeOptions} value={gap} onChange={(value) => setGap(value as ControlSize)} />
          <SelectControl
            label="Vertical alignment"
            options={[{ value: "start", label: "Start" }, { value: "center", label: "Center" }, { value: "end", label: "End" }]}
            value={align}
            onChange={(value) => setAlign(value as typeof align)}
          />
          <ToggleRow label="Show actions" checked={showActions} onChange={setShowActions} />
          <p className="text-xs opacity-70">Hover the buttons to expand their labels. Content yields width while actions stay on one row.</p>
        </div>
      }
      preview={
        <div className="w-full min-w-0">
          <div data-slot="content-actions-playground" className="max-w-full min-w-0 resize-x overflow-hidden rounded-xl border border-neutral-300 p-4 dark:border-neutral-700" style={{ width, minWidth: 160 }}>
            <ContentActions
              gap={gap}
              align={align}
              contentClassName="overflow-hidden"
              actions={showActions ? <>
                <ExpandableButton icon="Edit" label="Edit agent" variant="soft" />
                <ExpandableButton icon="Copy" label="Duplicate agent" variant="soft" />
                <ExpandableButton icon="Trash" label="Delete agent" variant="soft" color="rose" />
              </> : undefined}
            >
              <h3 className="truncate text-lg font-semibold">Brainstormer</h3>
              <p className="line-clamp-3 text-sm opacity-70">Turns an idea into a reviewable plan. Expand the actions and watch this content adapt to the remaining space.</p>
            </ContentActions>
          </div>
        </div>
      }
    />
  );
}
