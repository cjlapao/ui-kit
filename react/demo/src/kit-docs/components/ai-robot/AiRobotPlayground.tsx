import { useState } from "react";
import { AiRobot, ColorSwatches, type AiRobotIdentity, type AiRobotSize, type AiRobotVariant, type TrueColor } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions } from "../../shared/options";

export function AiRobotPlayground() {
  const [size, setSize] = useState<AiRobotSize>("xl");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [identity, setIdentity] = useState<AiRobotIdentity>("bop");
  const [variant, setVariant] = useState<AiRobotVariant>("outline");
  const [paused, setPaused] = useState(false);
  return <PlaygroundPanel controls={<ControlAccordion groups={[
    { id: "appearance", title: "Appearance", controls: <>
      <SelectControl label="Identity" value={identity} options={[{ value: "bop", label: "Bop" }, { value: "bip", label: "Bip" }, { value: "bit", label: "Bit" }, { value: "hex", label: "Hex" }, { value: "io", label: "Io" }]} onChange={value => setIdentity(value as AiRobotIdentity)} />
      <SelectControl label="Size" value={size} options={controlSizeOptions} onChange={value => setSize(value as AiRobotSize)} />
      <SelectControl label="Variant" value={variant} options={[{ value: "outline", label: "Outline" }, { value: "solid", label: "Solid" }]} onChange={value => setVariant(value as AiRobotVariant)} />
      <Control label="Tone"><ColorSwatches selectable size="sm" value={tone} onSelect={setTone} defaultExpanded /></Control>
    </> },
    { id: "motion", title: "Motion", controls: <ToggleRow label="Pause animation" checked={paused} onChange={setPaused} /> },
  ]} />} preview={<div className="flex min-h-64 flex-col items-center justify-center gap-4 py-8">
    <AiRobot identity={identity} size={size} tone={tone} variant={variant} paused={paused} label={`${identity === "bip" ? "Bip" : identity === "bit" ? "Bit" : identity === "hex" ? "Hex" : identity === "io" ? "Io" : "Bop"} AI assistant`} />
    <p className="text-sm text-neutral-500">{paused ? "Paused" : "Animated"}</p>
  </div>} />;
}
