import React, { useState } from "react";
import { Button, ColorSwatches, InputOtp, Panel } from "@cjlapao/ui-kit";
import type {
  GlowIntensity,
  InputOtpSize,
  InputOtpVariant,
  PillCorner,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  glowIntensityOptions,
  otpVariantOptions,
  pillCornerOptions,
} from "../../shared/options";

const lengthOptions = [
  { label: "4", value: "4" },
  { label: "6", value: "6" },
  { label: "8", value: "8" },
];

export const InputOtpPlayground: React.FC = () => {
  const [length, setLength] = useState(6);
  const [variant, setVariant] = useState<InputOtpVariant>("flat");
  const [size, setSize] = useState<InputOtpSize>("md");
  const [corner, setCorner] = useState<PillCorner | "auto">("auto");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("subtle");
  const [mask, setMask] = useState(false);
  const [integerOnly, setIntegerOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [value, setValue] = useState("");
  const [log, pushLog] = useEventLog();

  const handleChange = (next: string) => {
    setValue(next);
    pushLog(next ? `value "${next}"` : "cleared");
  };

  const field = (
    <InputOtp
      length={length}
      variant={variant}
      size={size}
      corner={corner}
      tone={tone}
      glowIntensity={glowIntensity}
      mask={mask}
      integerOnly={integerOnly}
      disabled={disabled}
      readOnly={readOnly}
      invalid={invalid}
      value={value}
      onChange={handleChange}
      onComplete={(code) => pushLog(`complete — ${code}`)}
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
                      label="Length"
                      options={lengthOptions}
                      value={String(length)}
                      onChange={(v) => setLength(Number(v))}
                    />
                    <ChoiceControl
                      label="Variant"
                      options={otpVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as InputOtpVariant)}
                    />
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as InputOtpSize)}
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
                    <SelectControl
                      label="Corner"
                      options={[
                        { label: "Auto (follow size)", value: "auto" },
                        ...pillCornerOptions,
                      ]}
                      value={corner}
                      onChange={(v) => setCorner(v as PillCorner | "auto")}
                    />
                  </>
                ),
              },
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow label="Mask" checked={mask} onChange={setMask} />
                    <ToggleRow
                      label="Integer only"
                      checked={integerOnly}
                      onChange={setIntegerOnly}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Read only"
                      checked={readOnly}
                      onChange={setReadOnly}
                    />
                  </div>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
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
              ...(variant === "gradient"
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <ChoiceControl
                          label="Glow"
                          options={glowIntensityOptions}
                          value={glowIntensity}
                          onChange={(v) => setGlowIntensity(v as GlowIntensity)}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <p className="text-xs opacity-70">
            Typing advances, Backspace on an empty cell steps back, arrows walk,
            and a paste distributes across the row. The first cell carries{" "}
            <code>autocomplete=&quot;one-time-code&quot;</code>, so a phone
            offers the code the OS received. <strong>Invalid</strong> paints
            every cell with the error border instead of the tone focus pair.
          </p>
          <EventLogControl log={log} emptyText="No events yet — type a code." />
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              // Corner-free: the field is the furniture; a rounded host
              // hugging a bare input reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <div className="flex flex-col items-center gap-3 py-2">
                {field}
                <ValueLine value={value} onReset={() => setValue("")} />
              </div>
            </Panel>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              {field}
              <ValueLine value={value} onReset={() => setValue("")} />
            </div>
          )}
        </div>
      }
    />
  );
};

const ValueLine: React.FC<{ value: string; onReset: () => void }> = ({
  value,
  onReset,
}) => (
  <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
    <span>
      Value:{" "}
      <strong className="text-neutral-900 dark:text-neutral-100">
        {value || "—"}
      </strong>
    </span>
    <Button variant="soft" size="sm" onClick={onReset}>
      Reset
    </Button>
  </div>
);
