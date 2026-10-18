import React, { useState } from "react";
import { Button, ColorSwatches, Panel, Rating } from "@cjlapao/ui-kit";
import type { RatingOrientation, RatingSize, TrueColor } from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  ratingOrientationOptions,
} from "../../shared/options";

const starCountOptions = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
];

const formatValue = (value: number) =>
  value % 1 === 0 ? String(value) : value.toFixed(1);

export const RatingPlayground: React.FC = () => {
  const [starCount, setStarCount] = useState(5);
  const [size, setSize] = useState<RatingSize>("md");
  const [tone, setTone] = useState<TrueColor>("amber");
  const [orientation, setOrientation] =
    useState<RatingOrientation>("horizontal");
  const [allowHalf, setAllowHalf] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [value, setValue] = useState(3);
  const [log, pushLog] = useEventLog();

  const handleChange = (next: number) => {
    setValue(next);
    pushLog(`${formatValue(next)} of ${starCount}`);
  };

  const field = (
    <Rating
      stars={starCount}
      size={size}
      tone={tone}
      orientation={orientation}
      allowHalf={allowHalf}
      readOnly={readOnly}
      disabled={disabled}
      invalid={invalid}
      value={value}
      onChange={handleChange}
      ariaLabel="Playground rating"
    />
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
                      label="Stars"
                      options={starCountOptions}
                      value={String(starCount)}
                      onChange={(v) => setStarCount(Number(v))}
                    />
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as RatingSize)}
                    />
                    <ChoiceControl
                      label="Orientation"
                      options={ratingOrientationOptions}
                      value={orientation}
                      onChange={(v) => setOrientation(v as RatingOrientation)}
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
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Half stars"
                      checked={allowHalf}
                      onChange={setAllowHalf}
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
                      label="Invalid"
                      checked={invalid}
                      onChange={setInvalid}
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
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Every star (or half star) is a real <strong>radio</strong> — Tab
            lands on the current value and the arrow keys move it natively,
            because it is a native radio group, not a simulation. Hover only
            previews; nothing is committed until a click or Space.
          </p>
          <EventLogControl log={log} emptyText="No events yet — pick a star." />
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
                starCount={starCount}
                onReset={() => setValue(3)}
              >
                {field}
              </Preview>
            </Panel>
          ) : (
            <Preview
              value={value}
              starCount={starCount}
              onReset={() => setValue(3)}
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
  value: number;
  starCount: number;
  onReset: () => void;
  children: React.ReactNode;
}> = ({ value, starCount, onReset, children }) => (
  <div className="flex w-full flex-col items-center gap-3 py-2">
    {children}
    <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
      <span>
        Value:{" "}
        <strong className="text-neutral-900 dark:text-neutral-100">
          {value ? formatValue(value) : "—"}
          {" / "}
          {starCount}
        </strong>
      </span>
      <Button variant="soft" size="sm" onClick={onReset}>
        Reset
      </Button>
    </div>
  </div>
);
