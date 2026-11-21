import React, { useState } from "react";
import { ColorSwatches, Input, Panel, SlugInput } from "@cjlapao/ui-kit";
import type {
  InputSize,
  InputValidationStatus,
  InputVariant,
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
  inputValidationOptions,
  inputVariantOptions,
} from "../../shared/options";

type Casing = "lower" | "upper" | "preserve";

const casingOptions = [
  { label: "lower", value: "lower" },
  { label: "UPPER", value: "upper" },
  { label: "PreSeRve", value: "preserve" },
];

const separatorOptions = [
  { label: "underscore _", value: "_" },
  { label: "dash -", value: "-" },
];

export const SlugInputPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<InputSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<InputValidationStatus>("none");
  const [value, setValue] = useState("Hello, World! Foo_Bar 2024");
  const [showSlug, setShowSlug] = useState(true);
  const [slugLabel, setSlugLabel] = useState("");
  const [separator, setSeparator] = useState("_");
  const [casing, setCasing] = useState<Casing>("lower");
  const [allowed, setAllowed] = useState("");
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [log, pushLog] = useEventLog(5);

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
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                  </>
                ),
              },
              {
                id: "slug",
                title: "Slug rules",
                controls: (
                  <>
                    <ChoiceControl
                      label="Separator"
                      options={separatorOptions}
                      value={separator}
                      onChange={setSeparator}
                    />
                    <ChoiceControl
                      label="Case"
                      options={casingOptions}
                      value={casing}
                      onChange={(value) => setCasing(value as Casing)}
                    />
                    <Control label="Allowed extra chars">
                      <Input
                        size="sm"
                        value={allowed}
                        placeholder="(none)"
                        onChange={(event) => setAllowed(event.target.value)}
                      />
                    </Control>
                    <Control label="Slug label">
                      <Input
                        size="sm"
                        value={slugLabel}
                        placeholder="Slug:"
                        onChange={(event) => setSlugLabel(event.target.value)}
                      />
                    </Control>
                    <ToggleRow
                      label="Show slug line"
                      checked={showSlug}
                      onChange={setShowSlug}
                    />
                  </>
                ),
              },
              {
                id: "notes",
                title: "Notes",
                controls: (
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow
                      label="Error"
                      checked={showError}
                      onChange={setShowError}
                    />
                    <ToggleRow
                      label="Hint"
                      checked={showHint}
                      onChange={setShowHint}
                    />
                    <ToggleRow
                      label="Help text"
                      checked={showHelpText}
                      onChange={setShowHelpText}
                    />
                  </div>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — type in the field."
          />
          <p className="text-xs opacity-70">
            The slug is derived on every keystroke and lands in the secondary
            text colour under the box; <code>onValueChange</code> hands you{" "}
            <code>(value, slug)</code> — the event log shows the pair. Notes
            stack under the slug line: <code>error</code> rose,{" "}
            <code>hint</code> status-aware, <code>helpText</code> always shown.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Panel variant="outlined" tone="neutral" padding="md">
            <div className="flex w-full flex-col gap-3">
              <SlugInput
                variant={variant}
                size={size}
                tone={tone}
                validationStatus={validationStatus}
                placeholder="My First Post!"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                showSlug={showSlug}
                slugLabel={slugLabel || undefined}
                slugifyOptions={{
                  separator,
                  case: casing,
                  allowed: allowed || undefined,
                }}
                error={showError ? "That slug is already taken." : undefined}
                hint={showHint ? "This becomes the public URL." : undefined}
                helpText={
                  showHelpText
                    ? "Edit the title and the slug follows."
                    : undefined
                }
                onValueChange={(next, slug) =>
                  pushLog(`"${next}" → ${slug || "(empty)"}`)
                }
                disabled={disabled}
              />
            </div>
          </Panel>
        </div>
      }
    />
  );
};

export default SlugInputPlayground;
