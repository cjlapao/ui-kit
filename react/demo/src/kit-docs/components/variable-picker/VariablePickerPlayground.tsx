import React, { useState } from "react";
import { ColorSwatches, VariablePicker } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  SmartVariableGroup,
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
  panelCornerOptions,
  surfaceVariantOptions,
} from "../../shared/options";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "app",
    label: "Environment",
    tone: "violet",
    variables: [
      {
        key: "REGION",
        label: "Region",
        description: "Where the capsule runs",
        value: "eu-west-1",
      },
      { key: "STAGE", label: "Stage", value: "prod" },
    ],
  },
  {
    id: "secrets",
    label: "Secrets",
    tone: "rose",
    variables: [
      { key: "API_KEY", label: "API key", value: "abc", secret: true },
    ],
  },
];

export const VariablePickerPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("md");
  const [variant, setVariant] = useState<SurfaceVariant>("elevated");
  const [corner, setCorner] = useState<SurfaceCorner>("auto");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [withResolve, setWithResolve] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [log, pushLog] = useEventLog();

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "options",
                title: "Options",
                controls: (
                  <>
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Card surface"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)}
                    />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
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
                    <Control label="Content">
                      <div className="space-y-1.5">
                        <ToggleRow
                          label="Show resolved values"
                          checked={withResolve}
                          onChange={setWithResolve}
                        />
                        <ToggleRow
                          label="No groups"
                          checked={empty}
                          onChange={setEmpty}
                        />
                      </div>
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — pick a variable."
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            One tab per group, with a count badge and a live search.{" "}
            <code>size</code> is on the shared control scale so the search field
            matches whatever opened the picker — it was a component-local{" "}
            <code>sm | md | lg</code>. A picker is never standalone furniture:{" "}
            <code>SmartInput</code> docks it above or below the field and keeps
            the caret&rsquo;s seat — resolving its surface first, so a glass
            field opens a glass picker.
          </p>
        </div>
      }
      preview={
        <VariablePicker
          groups={empty ? [] : GROUPS}
          size={size}
          variant={variant}
          corner={corner}
          tone={tone}
          onSelect={(v) => pushLog(`selected \`${v.fullToken}\` — onSelect`)}
          onClose={() => pushLog("closed — onClose")}
          resolve={
            withResolve
              ? (v) => ({
                  state: v.value ? "resolved" : "missing",
                  value: v.value ?? "",
                })
              : undefined
          }
        />
      }
    />
  );
};
