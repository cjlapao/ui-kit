import React, { useState } from "react";
import { ColorSwatches, Combobox } from "@cjlapao/ui-kit";
import type {
  ComboboxValidationStatus,
  ComboboxVariant,
  ControlSize,
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
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  inputVariantOptions,
  panelCornerOptions,
  surfaceVariantOptions,
  validationStatusOptions,
} from "../../shared/options";

const OPTIONS = [
  {
    value: "eu-west-1",
    label: "Ireland",
    description: "eu-west-1",
    icon: "Globe",
  },
  {
    value: "eu-central-1",
    label: "Frankfurt",
    description: "eu-central-1",
    icon: "Globe",
  },
  {
    value: "us-east-1",
    label: "N. Virginia",
    description: "us-east-1",
    icon: "Globe",
  },
  {
    value: "us-west-2",
    label: "Oregon",
    description: "us-west-2",
    icon: "Globe",
  },
  {
    value: "ap-northeast-1",
    label: "Tokyo",
    description: "ap-northeast-1",
    icon: "Globe",
  },
  {
    value: "ap-southeast-2",
    label: "Sydney",
    description: "Not enabled for this account",
    icon: "Globe",
    disabled: true,
  },
];

export const ComboboxPlayground: React.FC = () => {
  const [value, setValue] = useState("");
  const [log, pushLog] = useEventLog();

  const [size, setSize] = useState<ControlSize>("md");
  const [variant, setVariant] = useState<ComboboxVariant>("flat");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<ComboboxValidationStatus>("none");

  const [panelVariant, setPanelVariant] = useState<"auto" | SurfaceVariant>(
    "auto",
  );
  const [panelCorner, setPanelCorner] = useState<SurfaceCorner>("auto");

  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [withIcon, setWithIcon] = useState(true);

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
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Variant"
                      options={inputVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as ComboboxVariant)}
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
                      label="Popup surface"
                      options={[
                        {
                          label: "Auto (follows the field)",
                          value: "auto",
                        },
                        ...surfaceVariantOptions,
                      ]}
                      value={panelVariant}
                      onChange={(v) =>
                        setPanelVariant(v as "auto" | SurfaceVariant)
                      }
                    />
                    <SelectControl
                      label="Popup corner"
                      options={panelCornerOptions}
                      value={panelCorner}
                      onChange={(v) => setPanelCorner(v as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Validation"
                      options={validationStatusOptions}
                      value={validationStatus}
                      onChange={(v) =>
                        setValidationStatus(v as ComboboxValidationStatus)
                      }
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <Control label="State">
                    <div className="space-y-1.5">
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
                        label="Read-only"
                        checked={readOnly}
                        onChange={setReadOnly}
                      />
                      <ToggleRow
                        label="Clearable"
                        checked={clearable}
                        onChange={setClearable}
                      />
                      <ToggleRow
                        label="Leading icon"
                        checked={withIcon}
                        onChange={setWithIcon}
                      />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Focus the field and use <strong>↑ ↓</strong> to move,{" "}
            <strong>Home</strong> / <strong>End</strong> to jump,{" "}
            <strong>Enter</strong> to choose and <strong>Esc</strong> to close —
            the cursor skips the disabled row. The trailing control clears while
            there is something to clear, and opens the list otherwise.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-md space-y-2">
          <Combobox
            options={OPTIONS}
            value={value}
            onChange={(next) => {
              setValue(next);
              if (next === "") pushLog("onChange → cleared");
            }}
            onSelect={(option) =>
              pushLog(
                `onSelect → ${option.value}${option.disabled ? " (blocked)" : ""}`,
              )
            }
            size={size}
            variant={variant}
            tone={tone}
            panelVariant={panelVariant}
            panelCorner={panelCorner}
            validationStatus={validationStatus}
            disabled={disabled}
            readOnly={readOnly}
            loading={loading}
            clearable={clearable}
            leadingIcon={withIcon ? "Search" : undefined}
            placeholder="Search regions…"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Typed: <code>{value || "—"}</code> — the popup is portaled and
            placed against the viewport, so it survives the nearest
            scroller&rsquo;s edge; <strong>Auto</strong> pairs its surface with
            the field (a glass field opens a glass popup).
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — callbacks report through here."
          />
        </div>
      }
    />
  );
};
