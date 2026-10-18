import React, { useState } from "react";
import { Checkbox, ColorSwatches, Input, Panel } from "@cjlapao/ui-kit";
import type {
  CheckboxAlign,
  CheckboxDescriptionPlacement,
  CheckboxSize,
  CheckboxValidationStatus,
  CheckboxVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  checkboxAlignOptions,
  checkboxDescriptionPlacementOptions,
  checkboxValidationOptions,
  controlSizeOptions,
  inputVariantOptions,
} from "../../shared/options";

export const CheckboxPlayground: React.FC = () => {
  const [size, setSize] = useState<CheckboxSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<CheckboxVariant>("flat");
  const [controlAlign, setControlAlign] = useState<CheckboxAlign>("left");
  const [descriptionPlacement, setDescriptionPlacement] =
    useState<CheckboxDescriptionPlacement>("bottom");
  const [validationStatus, setValidationStatus] =
    useState<CheckboxValidationStatus>("none");
  const [validationMessage, setValidationMessage] = useState(
    "This field is required",
  );
  const [label, setLabel] = useState("Accept the terms");
  const [description, setDescription] = useState(
    "You can withdraw consent at any time.",
  );
  const [showLabel, setShowLabel] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [checked, setChecked] = useState(true);
  const [log, pushLog] = useEventLog();
  const [indeterminate, setIndeterminate] = useState(false);
  const [required, setRequired] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [glassPanel, setGlassPanel] = useState(false);

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
                      onChange={(value) => setVariant(value as CheckboxVariant)}
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(value) => setSize(value as CheckboxSize)}
                    />
                    {/* Colour is a palette, not a list — never a dropdown of
                        colour names. `tone` is the kit-wide name; the `md`
                        box stands on the kit's rounded-md default. */}
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
                      label="Control side"
                      options={checkboxAlignOptions}
                      value={controlAlign}
                      onChange={(value) =>
                        setControlAlign(value as CheckboxAlign)
                      }
                    />
                    <SelectControl
                      label="Description"
                      options={checkboxDescriptionPlacementOptions}
                      value={descriptionPlacement}
                      onChange={(value) =>
                        setDescriptionPlacement(
                          value as CheckboxDescriptionPlacement,
                        )
                      }
                    />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
                    <Control label="Label">
                      <Input
                        size="sm"
                        value={label}
                        onChange={(event) => setLabel(event.target.value)}
                      />
                    </Control>
                    <Control label="Description text">
                      <Input
                        size="sm"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "validation",
                title: "Validation",
                controls: (
                  <>
                    <SelectControl
                      label="Validation"
                      options={checkboxValidationOptions}
                      value={validationStatus}
                      onChange={(value) =>
                        setValidationStatus(value as CheckboxValidationStatus)
                      }
                    />
                    <Control label="Validation message">
                      <Input
                        size="sm"
                        value={validationMessage}
                        disabled={validationStatus === "none"}
                        onChange={(event) =>
                          setValidationMessage(event.target.value)
                        }
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
                      label="Checked"
                      checked={checked}
                      onChange={(value) => {
                        setChecked(value);
                        setIndeterminate(false);
                      }}
                    />
                    <ToggleRow
                      label="Indeterminate"
                      checked={indeterminate}
                      onChange={setIndeterminate}
                    />
                    <ToggleRow
                      label="Label"
                      checked={showLabel}
                      onChange={setShowLabel}
                    />
                    <ToggleRow
                      label="Description"
                      checked={showDescription}
                      onChange={setShowDescription}
                    />
                    <ToggleRow
                      label="Required"
                      checked={required}
                      onChange={setRequired}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Full width"
                      checked={fullWidth}
                      onChange={setFullWidth}
                    />
                    <ToggleRow
                      label="Glass panel"
                      checked={glassPanel}
                      onChange={setGlassPanel}
                    />
                  </div>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — tick the box."
          />
          <p className="text-xs opacity-70">
            <strong>Variant</strong> styles the rest surface — the box when it
            is <em>unchecked</em>: ghost sits flush, elevated lifts a shadow,
            glass and gradient blur what is behind. The checked fill is the
            tone&rsquo;s in every variant but <code>glass</code>, which tints
            like Toggle&rsquo;s glass track (<code>500/40</code>, frost edge
            kept) — an opaque fill would hide its own blur. Flip{" "}
            <strong>Checked</strong> off in the States group to see the rest
            surfaces apart. <strong>Indeterminate</strong> wins over checked, as
            it does on the native control, and is announced as{" "}
            <code>aria-checked=&quot;mixed&quot;</code>. The checked fill steps
            to <code>-700</code> in light and <code>-400</code> in dark so the
            tick clears WCAG contrast on every tone.{" "}
            <strong>Glass panel</strong> swaps the preview host between the
            kit&rsquo;s default <code>elevated</code> surface and{" "}
            <code>glass</code> — pair it with the playground&rsquo;s
            background-image toggle to give the blur something to blur.
          </p>
        </div>
      }
      preview={
        /*
          The row sits on a real `Panel` — `elevated`, the kit default.
          "Glass panel" in the States group swaps the host to `glass`; the
          question under test is whether the box and its tick read on a
          translucent surface, not the checkbox's own variant.
        */
        <div className="w-full">
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
            <Checkbox
              size={size}
              tone={tone}
              variant={variant}
              controlAlign={controlAlign}
              descriptionPlacement={descriptionPlacement}
              label={showLabel ? label : undefined}
              description={showDescription ? description : undefined}
              checked={checked}
              indeterminate={indeterminate}
              required={required}
              fullWidth={fullWidth}
              disabled={disabled}
              validationStatus={validationStatus}
              validationMessage={
                validationStatus === "none" ? undefined : validationMessage
              }
              onChange={(event) => {
                setChecked(event.target.checked);
                setIndeterminate(false);
                pushLog(`checked → ${event.target.checked}`);
              }}
            />
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
