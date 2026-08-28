import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  DatePicker,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  DATEPICKER_LOADER_TYPES,
  DATEPICKER_SELECTION_MODES,
  TRUE_COLORS,
  type DatePickerLoaderType,
  type DatePickerSelectionMode,
  type DatePickerValue,
  type GlowIntensity,
  type InputSize,
  type InputValidationStatus,
  type InputVariant,
  type MultiToggleOption,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  controlSizeOptions,
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../constants";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const selectionModeOptions: MultiToggleOption[] = DATEPICKER_SELECTION_MODES.map(
  (mode) => ({ label: mode === "single" ? "Single" : "Range", value: mode }),
);
const loaderTypeOptions: MultiToggleOption[] = DATEPICKER_LOADER_TYPES.map(
  (each) => ({
    label: each.charAt(0).toUpperCase() + each.slice(1),
    value: each,
  }),
);

const today = new Date();
const startOfToday = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
);
const addDays = (days: number) =>
  new Date(startOfToday.getFullYear(), startOfToday.getMonth(), startOfToday.getDate() + days);

export const DatePickerDemo: React.FC = () => {
  const [selectionMode, setSelectionMode] =
    useState<DatePickerSelectionMode>("single");
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<InputSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<InputValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [loaderType, setLoaderType] =
    useState<DatePickerLoaderType>("spinner");

  const [showClear, setShowClear] = useState(true);
  const [showButtonBar, setShowButtonBar] = useState(false);
  const [inline, setInline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weekendsOff, setWeekendsOff] = useState(false);
  const [bookingWindow, setBookingWindow] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const [singleValue, setSingleValue] = useState<DatePickerValue>(
    addDays(3),
  );
  const [rangeValue, setRangeValue] = useState<DatePickerValue>([
    addDays(-2),
    addDays(5),
  ]);

  const constraints = bookingWindow
    ? { minDate: addDays(0), maxDate: addDays(30) }
    : undefined;

  const shared = {
    variant,
    size,
    tone,
    validationStatus,
    glowIntensity,
    showClear,
    showButtonBar,
    disabledDays: weekendsOff ? [0, 6] : undefined,
    ...constraints,
  } as const;

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        {selectionMode === "single" ? (
          <DatePicker
            {...shared}
            inline={inline}
            loading={loading}
            loaderType={loaderType}
            placeholder="Pick a date"
            value={singleValue}
            onChange={setSingleValue}
          />
        ) : (
          <DatePicker
            {...shared}
            selectionMode="range"
            inline={inline}
            loading={loading}
            loaderType={loaderType}
            placeholder="Pick a range"
            value={rangeValue}
            onChange={setRangeValue}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Both selection modes side by side</Caption>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-xs opacity-70">Single</span>
            <DatePicker
              {...shared}
              placeholder="Single"
              defaultValue={addDays(7)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs opacity-70">
              Range — click a second day earlier than the start to restart it
            </span>
            <DatePicker
              {...shared}
              selectionMode="range"
              placeholder="Range"
              defaultValue={[addDays(1), addDays(4)]}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder</Caption>
        <div className="space-y-3">
          {CONTROL_SIZES.map((each) => (
            <DatePicker
              key={each}
              {...shared}
              size={each}
              placeholder={`Size ${each}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Validation</Caption>
        <div className="grid gap-3 md:grid-cols-3">
          <DatePicker {...shared} validationStatus="none" placeholder="Neutral" />
          <DatePicker {...shared} validationStatus="error" placeholder="Error" />
          <DatePicker
            {...shared}
            validationStatus="success"
            placeholder="Success"
            defaultValue={addDays(2)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every tone — open one and pick a day to see its fill</Caption>
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
          {TRUE_COLORS.map((each) => (
            <DatePicker
              key={each}
              variant={variant}
              size="sm"
              tone={each}
              placeholder={each}
              defaultValue={startOfToday}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="DatePicker"
      label="[DatePicker]"
      description="The date field: a text input that parses formatted dates plus a real Panel calendar with single and range selection, month/year views, constraints and keyboard navigation."
      controls={
        <div className="space-y-5 text-sm">
          <Field label="Selection mode">
            <MultiToggle
              fullWidth
              size="sm"
              options={selectionModeOptions}
              value={selectionMode}
              onChange={(value) =>
                setSelectionMode(value as DatePickerSelectionMode)
              }
            />
          </Field>

          <Field label="Variant">
            <MultiToggle
              fullWidth
              size="sm"
              options={inputVariantOptions}
              value={variant}
              onChange={(value) => setVariant(value as InputVariant)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as InputSize)}
              />
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Validation">
              <MultiToggle
                fullWidth
                size="sm"
                options={inputValidationOptions}
                value={validationStatus}
                onChange={(value) =>
                  setValidationStatus(value as InputValidationStatus)
                }
              />
            </Field>
            <Field label="Loader type">
              <MultiToggle
                fullWidth
                size="sm"
                options={loaderTypeOptions}
                value={loaderType}
                onChange={(value) =>
                  setLoaderType(value as DatePickerLoaderType)
                }
              />
            </Field>
          </div>

          {variant === "gradient" && (
            <Field label="Glow intensity">
              <MultiToggle
                fullWidth
                size="sm"
                options={glowIntensityOptions}
                value={glowIntensity}
                onChange={(value) =>
                  setGlowIntensity(value as GlowIntensity)
                }
              />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Toggle
              size="sm"
              label="Clear icon"
              checked={showClear}
              onChange={(event) => setShowClear(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Button bar"
              checked={showButtonBar}
              onChange={(event) => setShowButtonBar(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Inline"
              checked={inline}
              onChange={(event) => setInline(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Loading"
              checked={loading}
              onChange={(event) => setLoading(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Weekends off"
              checked={weekendsOff}
              onChange={(event) => setWeekendsOff(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="30-day window"
              checked={bookingWindow}
              onChange={(event) => setBookingWindow(event.target.checked)}
            />
          </div>

          <Toggle
            size="sm"
            label="On a glass panel"
            checked={onGlass}
            onChange={(event) => setOnGlass(event.target.checked)}
          />

          <p className="text-xs opacity-70">
            Values are real <code>Date</code> objects (single) or{" "}
            <code>[start, end | null]</code> (range) — a range whose end is
            still <code>null</code> is open. Typing is parsed with the{" "}
            <code>format</code> pattern; unparseable text is flagged and
            reset on blur, matching PrimeVue&apos;s behaviour.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};
