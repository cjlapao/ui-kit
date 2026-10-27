import { useState } from "react";
import { ColorSwatches, DotStepper, Slider, type ControlSize, type DotStepperProps, type DotStepperStep, type SurfacePadding, type SurfaceVariant, type TrueColor } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { controlSizeOptions, panelCornerOptions, panelPaddingOptions, surfaceVariantOptions } from "../../shared/options";

export const workflowNames = ["Prepare workspace", "Read sources", "Plan changes", "Implement", "Build", "Unit tests", "Review", "Package", "Publish", "Verify deployment"];
export const makeSteps = (total: number): DotStepperStep[] => Array.from({ length: total }, (_, index) => ({ id: `step-${index}`, title: workflowNames[index] ?? `Step ${index + 1}` }));
const counts = (max: number) => Array.from({ length: max }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));

export function DotStepperPlayground() {
  const [total, setTotal] = useState(10);
  const [current, setCurrent] = useState(4);
  const [max, setMax] = useState(5);
  const [size, setSize] = useState<ControlSize>("sm");
  const [variant, setVariant] = useState<SurfaceVariant>("tonal");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [doneColor, setDoneColor] = useState<TrueColor>("emerald");
  const [nextColor, setNextColor] = useState<TrueColor>("neutral");
  const [errorColor, setErrorColor] = useState<TrueColor>("rose");
  const [padding, setPadding] = useState<SurfacePadding>("none");
  const [corner, setCorner] = useState<DotStepperProps["corner"]>("full");
  const [animated, setAnimated] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [complete, setComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showPopover, setShowPopover] = useState(true);
  const [log, pushLog] = useEventLog();
  const active = Math.min(current, total - 1);
  const steps = makeSteps(total).map((step, index) => ({ ...step, status: complete ? "completed" as const : failed && index === active ? "error" as const : undefined }));
  return <PlaygroundPanel controls={<ControlAccordion groups={[
    { id: "flow", title: "Progress", controls: <>
      <SelectControl label="Total steps" value={String(total)} options={counts(20)} onChange={value => setTotal(Number(value))} />
      <SelectControl label="Visible steps" value={String(max)} options={counts(10)} onChange={value => setMax(Number(value))} />
      <Control label={`Current step · ${active + 1} of ${total}`}><Slider ariaLabel="Current step" min={1} max={Math.max(2, total)} value={active + 1} disabled={complete || total === 1} onChange={value => setCurrent(Number(value) - 1)} /></Control>
      <ToggleRow label="All completed" checked={complete} onChange={setComplete} />
      <ToggleRow label="Current step failed" checked={failed} onChange={setFailed} />
    </> },
    { id: "surface", title: "Appearance", controls: <>
      <SelectControl label="Size" value={size} options={controlSizeOptions} onChange={value => setSize(value as ControlSize)} />
      <SelectControl label="Variant" value={variant} options={surfaceVariantOptions} onChange={value => setVariant(value as SurfaceVariant)} />
      <SelectControl label="Padding" value={padding} options={panelPaddingOptions} onChange={value => setPadding(value as SurfacePadding)} />
      <SelectControl label="Corners" value={corner ?? "full"} options={[{ value: "full", label: "Full / pill" }, ...panelCornerOptions]} onChange={value => setCorner(value as DotStepperProps["corner"])} />
    </> },
    { id: "colours", title: "Colours", controls: <>
      <Control label="Active / surface"><ColorSwatches size="sm" selectable value={tone} onSelect={setTone} /></Control>
      <Control label="Completed"><ColorSwatches size="sm" selectable value={doneColor} onSelect={setDoneColor} /></Control>
      <Control label="Pending"><ColorSwatches size="sm" selectable value={nextColor} onSelect={setNextColor} /></Control>
      <Control label="Error"><ColorSwatches size="sm" selectable value={errorColor} onSelect={setErrorColor} /></Control>
    </> },
    { id: "behavior", title: "Behavior", controls: <>
      <ToggleRow label="Pulse active step" checked={animated} onChange={setAnimated} />
      <ToggleRow label="Active popover" checked={showPopover} onChange={setShowPopover} />
      <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
    </> },
  ]} />} preview={<div className="flex w-full flex-col items-center gap-8 py-8">
    <div className="space-y-2 text-center"><p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Workflow progress</p><p className="text-sm">{complete ? "All steps completed" : `${active + 1} / ${total} · ${steps[active].title}`}</p></div>
    <DotStepper steps={steps} currentIndex={active} maxVisible={max} size={size} variant={variant} padding={padding} corner={corner} tone={tone} doneColor={doneColor} nextColor={nextColor} errorColor={errorColor} animated={animated} disabled={disabled}
      onStepSelect={(step, index) => pushLog(`Step ${index + 1}: ${step.title}`)}
      renderActiveContent={showPopover ? (step, index) => <div className="space-y-2"><p className="text-xs text-neutral-500">Step {index + 1} of {total}</p><p className="font-semibold">{step.title}</p><p className="text-sm">Your app supplies this content. Add progress, logs or actions for the running step.</p></div> : undefined}
      popoverProps={{ placement: "bottom", onOpenChange: open => pushLog(`Popover ${open ? "opened" : "closed"}`) }} />
    <p className="max-w-xs text-center text-xs text-neutral-500">Hover or focus a dot for its name. Click the running dot for details. Overflow stacks sit outside the {max} visible steps.</p>
    <div className="w-full"><EventLogControl log={log} /></div>
  </div>} />;
}
