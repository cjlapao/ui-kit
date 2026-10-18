import React, { useState } from "react";
import {
  ColorSwatches,
  DatePicker,
  DEFAULT_GLOW_INTENSITY,
  Panel,
} from "@cjlapao/ui-kit";
import type {
  DatePickerAppendTo,
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
  datePickerAppendToOptions,
  datePickerSelectionModeOptions,
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  panelCornerOptions,
  surfaceVariantOptions,
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
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>(
    DEFAULT_GLOW_INTENSITY,
  );
  const [panelVariant, setPanelVariant] = useState<"auto" | SurfaceVariant>(
    "auto",
  );
  const [panelTone, setPanelTone] = useState<"auto" | TrueColor>("auto");
  const [panelCorner, setPanelCorner] = useState<SurfaceCorner>("auto");
  const [appendTo, setAppendTo] = useState<DatePickerAppendTo>("body");
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(1);

  const [showClear, setShowClear] = useState(true);
  const [showButtonBar, setShowButtonBar] = useState(false);
  const [hideOnSelect, setHideOnSelect] = useState(false);
  const [hideOnRangeSelection, setHideOnRangeSelection] = useState(false);
  const [showOtherMonths, setShowOtherMonths] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const [log, pushLog] = useEventLog();
  const [singleValue, setSingleValue] = useState<DatePickerValue>(inDays(3));
  const [rangeValue, setRangeValue] = useState<DatePickerValue>([
    inDays(-2),
    inDays(4),
  ]);

  const handleChange = (value: DatePickerValue) => {
    if (selectionMode === "single") setSingleValue(value);
    else setRangeValue(value);
    pushLog(
      value == null
        ? "cleared — onChange with null"
        : Array.isArray(value)
          ? `range committed — ${value[0]?.toLocaleDateString()} → ${value[1]?.toLocaleDateString() ?? "…"}`
          : `date committed — ${(value as Date).toLocaleDateString()}`,
    );
  };

  const picker = (
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
      showClear={showClear}
      showButtonBar={showButtonBar}
      hideOnSelect={hideOnSelect}
      hideOnRangeSelection={hideOnRangeSelection}
      showOtherMonths={showOtherMonths}
      disabled={disabled}
      placeholder={selectionMode === "single" ? "Pick a date" : "Pick a range"}
      value={selectionMode === "single" ? singleValue : rangeValue}
      onChange={handleChange}
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
                      label="Selection mode"
                      options={datePickerSelectionModeOptions}
                      value={selectionMode}
                      onChange={(value) =>
                        setSelectionMode(value as DatePickerSelectionMode)
                      }
                    />
                    <SelectControl
                      label="Variant"
                      options={inputVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as InputVariant)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <ChoiceControl
                        label="Size"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(value) => setSize(value as InputSize)}
                      />
                      <SelectControl
                        label="Validation"
                        options={inputValidationOptions}
                        value={validationStatus}
                        onChange={(value) =>
                          setValidationStatus(value as InputValidationStatus)
                        }
                      />
                    </div>
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
                      label="Week starts on"
                      options={weekStartsOnOptions}
                      value={String(weekStartsOn)}
                      onChange={(value) =>
                        setWeekStartsOn(Number(value) as 0 | 1)
                      }
                    />
                  </>
                ),
              },
              ...(variant === "gradient"
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <SelectControl
                          label="Glow intensity"
                          options={glowIntensityOptions}
                          value={glowIntensity}
                          onChange={(value) =>
                            setGlowIntensity(value as GlowIntensity)
                          }
                        />
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
                      options={[
                        { label: "Auto (follow field)", value: "auto" },
                        ...surfaceVariantOptions,
                      ]}
                      value={panelVariant}
                      onChange={(value) =>
                        setPanelVariant(value as "auto" | SurfaceVariant)
                      }
                    />
                    <Control label="Panel tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={panelTone === "auto" ? "neutral" : panelTone}
                        onSelect={setPanelTone}
                        defaultExpanded
                      />
                    </Control>
                    {/* The swatches cannot show "auto" — this drives it. */}
                    <ToggleRow
                      label="Panel tone follows field"
                      checked={panelTone === "auto"}
                      onChange={(v) => setPanelTone(v ? "auto" : "neutral")}
                    />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={panelCorner}
                      onChange={(value) =>
                        setPanelCorner(value as SurfaceCorner)
                      }
                    />
                    <SelectControl
                      label="Append to"
                      options={datePickerAppendToOptions}
                      value={appendTo}
                      onChange={(value) =>
                        setAppendTo(value as DatePickerAppendTo)
                      }
                    />
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
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="In a panel"
                      checked={inPanel}
                      onChange={setInPanel}
                    />
                    {inPanel && (
                      <ToggleRow
                        label="On a glass panel"
                        checked={onGlass}
                        onChange={setOnGlass}
                      />
                    )}
                  </div>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — pick or type a date."
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Values are <code>Date</code> objects —{" "}
            <code>[start, end | null]</code> for ranges. The log shows what the
            field <em>committed</em>: picks, a valid typed date, Today, and
            Clear all arrive through the same <code>onChange</code>. The
            field&rsquo;s tone tints selection and focus; the calendar panel
            keeps its own surface, tone and corner — and while{" "}
            <code>appendTo</code> is <code>body</code> the overlay escapes the
            host panel entirely.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <div className="flex w-full justify-center py-4">{picker}</div>
            </Panel>
          ) : (
            <div className="flex w-full justify-center py-4">{picker}</div>
          )}
        </div>
      }
    />
  );
};
