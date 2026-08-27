import React, { useState } from "react";
import { MultiToggle, Panel, Select } from "@cjlapao/ui-kit";
import type {
  SelectSize,
  SelectValidationStatus,
  SelectVariant,
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
  controlSizeOptions,
  inputValidationOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

export const SelectPlayground: React.FC = () => {
  const [variant, setVariant] = useState<SelectVariant>("flat");
  const [size, setSize] = useState<SelectSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<SelectValidationStatus>("none");
  const [value, setValue] = useState("");
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [leadingIcon, setLeadingIcon] = useState(false);
  const [placeholder, setPlaceholder] = useState(true);
  const [hideCaret, setHideCaret] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const readout = multiple
    ? multiValue.length
      ? multiValue.map((region) => `region[]=${region}`).join("&")
      : "— nothing selected —"
    : value
      ? `region=${value}`
      : "— no selection —";

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
                    <SelectControl
                      label="Variant"
                      options={inputVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as SelectVariant)}
                    />
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as SelectSize)}
                      />
                    </Control>
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    <Control label="Validation">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={inputValidationOptions}
                        value={validationStatus}
                        onChange={(v) =>
                          setValidationStatus(v as SelectValidationStatus)
                        }
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow label="Leading icon" checked={leadingIcon} onChange={setLeadingIcon} />
                    <ToggleRow label="Placeholder" checked={placeholder} onChange={setPlaceholder} />
                    <ToggleRow label="Hide caret" checked={hideCaret} onChange={setHideCaret} />
                    <ToggleRow label="Multiple" checked={multiple} onChange={setMultiple} />
                    <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                    <ToggleRow label="On a glass panel" checked={onGlass} onChange={setOnGlass} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            The surface sits on the field&apos;s wrapper, not the{" "}
            <code>&lt;select&gt;</code> — same structure as{" "}
            <strong>Input</strong>, so the caret and leading icon are flex
            siblings. The <code>&lt;option&gt;</code> elements carry their own
            fill: the native dropdown is painted by the platform from the
            select&apos;s background, which is now transparent.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            <div className="flex w-full max-w-sm flex-col gap-4">
              <Select
                variant={variant}
                size={size}
                tone={tone}
                validationStatus={validationStatus}
                disabled={disabled}
                multiple={multiple}
                leadingIcon={leadingIcon ? "Globe" : undefined}
                hideCaret={hideCaret}
                placeholder={placeholder ? "Choose a region" : undefined}
                value={multiple ? multiValue : value}
                onChange={(event) => {
                  if (multiple) {
                    setMultiValue(
                      Array.from(
                        event.target.selectedOptions,
                        (option) => option.value,
                      ),
                    );
                  } else {
                    setValue(event.target.value);
                  }
                }}
                aria-label="Region"
              >
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Select>
              <div className="flex flex-col gap-2">
                <Caption>What a form submit would carry</Caption>
                <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
                  {readout}
                </code>
              </div>
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
