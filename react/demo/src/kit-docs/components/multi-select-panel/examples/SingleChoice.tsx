import React, { useState } from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

const MODES: MultiSelectPanelOption[] = [
  {
    value: "fast",
    title: "Fast",
    subtitle: "One pass, no verification step",
    icon: "Rocket",
  },
  {
    value: "balanced",
    title: "Balanced",
    subtitle: "Drafts, then a single review pass over the answer",
    icon: "Settings",
    labels: ["Default"],
  },
  {
    value: "deep",
    title: "Deep",
    subtitle: "Plans, checks its own work and shows the reasoning",
    icon: "Brain",
    labels: ["Premium", "Slow"],
  },
];

/**
 * `selectionMode="single"` turns the group into a radiogroup: one tab stop,
 * and the arrow keys — <em>Home</em> and <em>End</em> included — walk the cards
 * and pick as they go. With `allowDeselect` off there is always exactly one
 * mode selected, the way a required radio group behaves.
 */
export const SingleChoice: React.FC = () => {
  const [mode, setMode] = useState<string[]>(["balanced"]);

  return (
    <div className="w-full space-y-3">
      <MultiSelectPanel
        name="mode"
        label="Reasoning mode"
        description="One mode per run — arrows pick, click deselects."
        columns={3}
        selectionMode="single"
        allowDeselect={false}
        value={mode}
        onChange={setMode}
        options={MODES}
      />
      <p className="text-xs opacity-70">
        Submitting sends <code>mode={mode[0] ?? "—"}</code>; nothing else is
        ever selected.
      </p>
    </div>
  );
};

export default SingleChoice;
