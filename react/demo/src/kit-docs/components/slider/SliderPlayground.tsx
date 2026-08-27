import React, { useState } from "react";
import { Button, MultiToggle, Slider } from "@cjlapao/ui-kit";
import type {
  SliderOrientation,
  SliderValue,
  SliderVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  sliderOrientationOptions,
  sliderVariantOptions,
  trueColorOptions,
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
  const [color, setColor] = useState<TrueColor>("blue");
  const [minSteps, setMinSteps] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [singleValue, setSingleValue] = useState(50);
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);

  const value: SliderValue = rangeMode ? rangeValue : singleValue;

  const onChange = (next: SliderValue) => {
    if (rangeMode) setRangeValue(next as [number, number]);
    else setSingleValue(next as number);
  };

  return (
    <PlaygroundPanel
      controls={
        <ControlAccordion
          groups={[
            {
              id: "core",
              title: "Core",
              controls: (
                <>
                  <Control label="Orientation">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={sliderOrientationOptions}
                      value={orientation}
                      onChange={(v) => setOrientation(v as SliderOrientation)}
                    />
                  </Control>
                  <Control label="Step">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={stepOptions}
                      value={String(step)}
                      onChange={(v) => setStep(Number(v))}
                    />
                  </Control>
                  <SelectControl
                    label="Variant"
                    options={sliderVariantOptions}
                    value={variant}
                    onChange={(v) => setVariant(v as SliderVariant)}
                  />
                  <SelectControl
                    label="Color"
                    options={trueColorOptions}
                    value={color}
                    onChange={(v) => setColor(v as TrueColor)}
                  />
                </>
              ),
            },
            {
              id: "states",
              title: "States",
              controls: (
                <>
                  {rangeMode && (
                    <Control label="Min. steps apart">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={minStepsOptions}
                        value={String(minSteps)}
                        onChange={(v) => setMinSteps(Number(v))}
                      />
                    </Control>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow
                      label="Range mode"
                      checked={rangeMode}
                      onChange={setRangeMode}
                    />
                    <ToggleRow label="Read only" checked={readOnly} onChange={setReadOnly} />
                    <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                  </div>
                </>
              ),
            },
          ]}
        />
      }
      preview={
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <Slider
            orientation={orientation}
            step={step}
            variant={variant}
            color={color}
            range={rangeMode}
            minStepsBetweenHandles={minSteps}
            readOnly={readOnly}
            disabled={disabled}
            value={value}
            onChange={onChange}
            ariaLabel="Playground slider"
            className={orientation === "vertical" ? "h-48" : undefined}
          />
          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span>
              Value:{" "}
              <strong className="text-neutral-900 dark:text-neutral-100">
                {formatValue(value)}
              </strong>
            </span>
            <Button
              variant="soft"
              size="sm"
              onClick={() =>
                rangeMode ? setRangeValue([20, 80]) : setSingleValue(50)
              }
            >
              Reset
            </Button>
          </div>
        </div>
      }
    />
  );
};
