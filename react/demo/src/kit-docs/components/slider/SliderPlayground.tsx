import React, { useState } from "react";
import { Button, ColorSwatches, Panel, Slider } from "@cjlapao/ui-kit";
import type {
  SliderOrientation,
  SliderValue,
  SliderVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  sliderOrientationOptions,
  sliderVariantOptions,
} from "../../shared/options";

const stepOptions = [
  { label: "1", value: "1" },
  { label: "5", value: "5" },
  { label: "10", value: "10" },
];

const minStepsOptions = [
  { label: "None", value: "0" },
  { label: "10", value: "10" },
  { label: "25", value: "25" },
];

const formatValue = (value: SliderValue) =>
  Array.isArray(value) ? `${value[0]} – ${value[1]}` : String(value);

export const SliderPlayground: React.FC = () => {
  const [rangeMode, setRangeMode] = useState(false);
  const [orientation, setOrientation] =
    useState<SliderOrientation>("horizontal");
  const [step, setStep] = useState(1);
  const [variant, setVariant] = useState<SliderVariant>("solid");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [minSteps, setMinSteps] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [singleValue, setSingleValue] = useState(50);
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);
  const [log, pushLog] = useEventLog();

  const value: SliderValue = rangeMode ? rangeValue : singleValue;

  const onChange = (next: SliderValue) => {
    if (rangeMode) setRangeValue(next as [number, number]);
    else setSingleValue(next as number);
    pushLog(formatValue(next));
  };

  const field = (
    <div className={orientation === "vertical" ? "py-2" : "py-4"}>
      <Slider
        orientation={orientation}
        step={step}
        variant={variant}
        tone={tone}
        range={rangeMode}
        minStepsBetweenHandles={minSteps}
        invalid={invalid}
        readOnly={readOnly}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onSlideEnd={(v) => pushLog(`slide end → ${formatValue(v)}`)}
        ariaLabel="Playground slider"
        className={orientation === "vertical" ? "h-48" : undefined}
      />
    </div>
  );

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <ChoiceControl
                      label="Orientation"
                      options={sliderOrientationOptions}
                      value={orientation}
                      onChange={(v) => setOrientation(v as SliderOrientation)}
                    />
                    <ChoiceControl
                      label="Step"
                      options={stepOptions}
                      value={String(step)}
                      onChange={(v) => setStep(Number(v))}
                    />
                    <ChoiceControl
                      label="Variant"
                      options={sliderVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as SliderVariant)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    {rangeMode && (
                      <ChoiceControl
                        label="Min. steps apart"
                        options={minStepsOptions}
                        value={String(minSteps)}
                        onChange={(v) => setMinSteps(Number(v))}
                      />
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <ToggleRow
                        label="Range mode"
                        checked={rangeMode}
                        onChange={setRangeMode}
                      />
                      <ToggleRow
                        label="Invalid"
                        checked={invalid}
                        onChange={setInvalid}
                      />
                      <ToggleRow
                        label="Read only"
                        checked={readOnly}
                        onChange={setReadOnly}
                      />
                      <ToggleRow
                        label="Disabled"
                        checked={disabled}
                        onChange={setDisabled}
                      />
                      <ToggleRow
                        label="In a panel"
                        checked={inPanel}
                        onChange={setInPanel}
                      />
                      <ToggleRow
                        label="On a glass panel"
                        checked={onGlass}
                        onChange={(v) => {
                          setOnGlass(v);
                          if (v) setInPanel(true);
                        }}
                      />
                    </div>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            The handle is a real <strong>slider</strong> role — arrows step,
            PageUp/PageDown jump ten steps, Home/End go to the bounds. Clicking
            the track grabs the nearest handle; in range mode the handles can be
            pinned apart and frozen one at a time.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — drag or key a handle."
          />
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              // Corner-free: the control is the furniture; a rounded host
              // hugging a bare control reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <Preview
                value={value}
                onReset={() =>
                  rangeMode ? setRangeValue([20, 80]) : setSingleValue(50)
                }
              >
                {field}
              </Preview>
            </Panel>
          ) : (
            <Preview
              value={value}
              onReset={() =>
                rangeMode ? setRangeValue([20, 80]) : setSingleValue(50)
              }
            >
              {field}
            </Preview>
          )}
        </div>
      }
    />
  );
};

const Preview: React.FC<{
  value: SliderValue;
  onReset: () => void;
  children: React.ReactNode;
}> = ({ value, onReset, children }) => (
  <div className="flex w-full flex-col gap-3">
    {children}
    <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
      <span>
        Value:{" "}
        <strong className="text-neutral-900 dark:text-neutral-100">
          {formatValue(value)}
        </strong>
      </span>
      <Button variant="soft" size="sm" onClick={onReset}>
        Reset
      </Button>
    </div>
  </div>
);
