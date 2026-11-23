import React, { useState } from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

/**
 * The same group twice, once with the pills hugging the title and once pinned
 * to the trailing edge of the row.
 *
 * `tonal` is the case that matters: a flat card shows every layer it draws, so
 * the disabled card here is dimmed by its own `Checkbox` and nothing else —
 * a sheet over the body would read as a panel inside the panel.
 */
const OPTIONS: MultiSelectPanelOption[] = [
  {
    value: "draft",
    title: "Draft",
    subtitle: "Fast, one token stream",
    icon: "File",
    labels: ["Default"],
  },
  {
    value: "research",
    title: "Research",
    subtitle: "Searches, cites, takes its time",
    icon: "Search",
    labels: ["Beta", "Paid"],
  },
  {
    value: "structured",
    title: "Structured",
    subtitle: "Validated against your schema",
    icon: "List",
    labels: ["Schema"],
  },
  {
    value: "vision",
    title: "Vision",
    subtitle: "Retired in favour of Research",
    icon: "Image",
    labels: ["Legacy"],
    disabled: true,
  },
];

export const LabelAlignExample: React.FC = () => {
  const [left, setLeft] = useState<string[]>(["draft"]);
  const [right, setRight] = useState<string[]>(["research"]);

  return (
    <div className="flex flex-col gap-6">
      <MultiSelectPanel
        name="mode_left"
        label="Pills beside the title"
        description="labelAlign defaults to left — title and label read as one phrase."
        options={OPTIONS}
        value={left}
        onChange={setLeft}
        columns={2}
        variant="tonal"
        tone="blue"
      />
      <MultiSelectPanel
        name="mode_right"
        label="Pills at the trailing edge"
        description='labelAlign="right" pins them, so a column of cards lines its labels up.'
        options={OPTIONS}
        value={right}
        onChange={setRight}
        columns={2}
        variant="tonal"
        tone="blue"
        labelAlign="right"
      />
    </div>
  );
};

export default LabelAlignExample;
