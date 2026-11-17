import { useState } from "react";
import { AiRobot, ColorSwatches, type AiRobotSize, type TrueColor } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions } from "../../shared/options";

export function AiRobotPlayground() {
  const [size, setSize] = useState<AiRobotSize>("xl");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [paused, setPaused] = useState(false);
  return <PlaygroundPanel controls={<ControlAccordion groups={[
    { id: "appearance", title: "Appearance", controls: <>
      <SelectControl label="Size" value={size} options={controlSizeOptions} onChange={value => setSize(value as AiRobotSize)} />
      <Control label="Tone"><ColorSwatches selectable size="sm" value={tone} onSelect={setTone} defaultExpanded /></Control>
    </> },
    { id: "motion", title: "Motion", controls: <ToggleRow label="Pause animation" checked={paused} onChange={setPaused} /> },
  ]} />} preview={<div className="flex min-h-64 flex-col items-center justify-center gap-4 py-8">
    <AiRobot size={size} tone={tone} paused={paused} label="AI assistant" />
    <p className="text-sm text-neutral-500">{paused ? "Paused" : "Animated"}</p>
  </div>} />;
}
