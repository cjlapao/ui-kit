import React, { useState } from "react";
import { DatePicker, MultiToggle, Panel } from "@cjlapao/ui-kit";
import type {
  DatePickerAppendTo,
  DatePickerLoaderType,
  DatePickerSelectionMode,
  DatePickerValue,
  GlowIntensity,
  InputSize,
  InputValidationStatus,
  InputVariant,
  SurfaceCorner,
  SurfaceVariant,
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
  datePickerAppendToOptions,
  datePickerLoaderTypeOptions,
  datePickerSelectionModeOptions,
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  panelCornerOptions,
  surfaceVariantOptions,
  trueColorOptions,
  weekStartsOnOptions,
} from "../../shared/options";

const start = new Date();
const inDays = (n: number) =>
  new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);

export const DatePickerPlayground: React.FC = () => {
  const [selectionMode, setSelectionMode] =
    useState<DatePickerSelectionMode>("single");
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<InputSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<InputValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [panelVariant, setPanelVariant] = useState<SurfaceVariant>(
    "elevated",
  );
  const [panelTone, setPanelTone] = useState<TrueColor>("neutral");
  const [panelCorner, setPanelCorner] = useState<SurfaceCorner>("rounded-lg");
  const [appendTo, setAppendTo] = useState<DatePickerAppendTo>("body");
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(1);
  const [loaderType, setLoaderType] =
    useState<DatePickerLoaderType>("spinner");

  const [showClear, setShowClear] = useState(true);
  const [showButtonBar, setShowButtonBar] = useState(false);
  const [hideOnSelect, setHideOnSelect] = useState(false);
  const [hideOnRangeSelection, setHideOnRangeSelection] = useState(false);
  const [showOtherMonths, setShowOtherMonths] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const [singleValue, setSingleValue] = useState<DatePickerValue>(inDays(3));
  const [rangeValue, setRangeValue] = useState<DatePickerValue>([
    inDays(-2),
    inDays(4),
  ]);

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
                    <Control label="Selection mode">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={datePickerSelectionModeOptions}
                        value={selectionMode}
                        onChange={(value) =>
                          setSelectionMode(value as DatePickerSelectionMode)
                        }
                      />
                    </Control>
                    <SelectControl
                      label="Variant"
                      options={inputVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as InputVariant)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Control label="Size">
                        <MultiToggle
                          fullWidth
                          size="sm"
                          options={controlSizeOptions}
                          value={size}
                          onChange={(value) => setSize(value as InputSize)}
                        />
                      </Control>
                      <Control label="Validation">
                        <MultiToggle
                          fullWidth
                          size="sm"
                          options={inputValidationOptions}
                          value={validationStatus}
                          onChange={(value) =>
                            setValidationStatus(value as InputValidationStatus)
                          }
                        />
                      </Control>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <SelectControl
                        label="Tone"
                        options={trueColorOptions}
                        value={tone}
                        onChange={(value) => setTone(value as TrueColor)}
                      />
                      <SelectControl
                        label="Week starts on"
                        options={weekStartsOnOptions}
                        value={String(weekStartsOn)}
                        onChange={(value) =>
                          setWeekStartsOn(Number(value) as 0 | 1)
                        }
                      />
                    </div>
                  </>
                ),
              },
              ...(variant === "gradient"
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <Control label="Glow intensity">
                          <MultiToggle
                            fullWidth
                            size="sm"
                            options={glowIntensityOptions}
                            value={glowIntensity}
                            onChange={(value) =>
                              setGlowIntensity(value as GlowIntensity)
                            }
                          />
                        </Control>
                      ),
                    },
                  ]
                : []),
              {
                id: "panel",
                title: "Calendar panel",
                controls: (
                  <>
                    <SelectControl
                      label="Surface"
                      options={surfaceVariantOptions}
                      value={panelVariant}
                      onChange={(value) =>
                        setPanelVariant(value as SurfaceVariant)
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <SelectControl
                        label="Panel tone"
                        options={trueColorOptions}
                        value={panelTone}
                        onChange={(value) => setPanelTone(value as TrueColor)}
                      />
                      <SelectControl
                        label="Corner"
                        options={panelCornerOptions}
                        value={panelCorner}
                        onChange={(value) =>
                          setPanelCorner(value as SurfaceCorner)
                        }
                      />
                    </div>
                    <SelectControl
                      label="Append to"
                      options={datePickerAppendToOptions}
                      value={appendTo}
                      onChange={(value) =>
                        setAppendTo(value as DatePickerAppendTo)
                      }
                    />
                    <Control label="Loader type">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={datePickerLoaderTypeOptions}
                        value={loaderType}
                        onChange={(value) =>
                          setLoaderType(value as DatePickerLoaderType)
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
                    <ToggleRow
                      label="Clear icon"
                      checked={showClear}
                      onChange={setShowClear}
                    />
                    <ToggleRow
                      label="Button bar"
                      checked={showButtonBar}
                      onChange={setShowButtonBar}
                    />
                    <ToggleRow
                      label="Hide on select"
                      checked={hideOnSelect}
                      onChange={setHideOnSelect}
                    />
                    {selectionMode === "range" && (
                      <ToggleRow
                        label="Hide on range end"
                        checked={hideOnRangeSelection}
                        onChange={setHideOnRangeSelection}
                      />
                    )}
                    <ToggleRow
                      label="Show other months"
                      checked={showOtherMonths}
                      onChange={setShowOtherMonths}
                    />
                    <ToggleRow
                      label="Loading"
                      checked={loading}
                      onChange={setLoading}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="On a glass panel"
                      checked={onGlass}
                      onChange={setOnGlass}
                    />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Values are <code>Date</code> objects — <code>[start, end | null]</code>{" "}
            for ranges. The field&apos;s tone tints selection and focus; the
            panel keeps its own surface, tone and corner.
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
            <div className="flex w-full flex-col gap-3">
              <DatePicker
                selectionMode={selectionMode}
                variant={variant}
                size={size}
                tone={tone}
                validationStatus={validationStatus}
                glowIntensity={glowIntensity}
                panelVariant={panelVariant}
                panelTone={panelTone}
                panelCorner={panelCorner}
                appendTo={appendTo}
                weekStartsOn={weekStartsOn}
                loaderType={loaderType}
                showClear={showClear}
                showButtonBar={showButtonBar}
                hideOnSelect={hideOnSelect}
                hideOnRangeSelection={hideOnRangeSelection}
                showOtherMonths={showOtherMonths}
                loading={loading}
                disabled={disabled}
                placeholder={
                  selectionMode === "single"
                    ? "Pick a date"
                    : "Pick a range"
                }
                value={selectionMode === "single" ? singleValue : rangeValue}
                onChange={(value) =>
                  selectionMode === "single"
                    ? setSingleValue(value)
                    : setRangeValue(value)
                }
              />
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
