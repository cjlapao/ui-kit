import React, { useState } from "react";
import { VariablePicker } from "@cjlapao/ui-kit";
import type { ControlSize, SmartVariableGroup, TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "app",
    label: "Environment",
    tone: "violet",
    variables: [
      { key: "REGION", label: "Region", description: "Where the capsule runs", value: "eu-west-1" },
      { key: "STAGE", label: "Stage", value: "prod" },
    ],
  },
  {
    id: "secrets",
    label: "Secrets",
    tone: "rose",
    variables: [{ key: "API_KEY", label: "API key", value: "abc", secret: true }],
  },
];

export const VariablePickerPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [withResolve, setWithResolve] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

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
                    <SelectControl label="Size" options={controlSizeOptions} value={size}
                      onChange={(v) => setSize(v as ControlSize)} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <Control label="Content">
                      <div className="space-y-1.5">
                        <ToggleRow label="Show resolved values" checked={withResolve} onChange={setWithResolve} />
                        <ToggleRow label="No groups" checked={empty} onChange={setEmpty} />
                      </div>
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            One tab per group, with a count badge and a live search.{" "}
            <code>size</code> is on the shared control scale so the search
            field matches whatever opened the picker — it was a component-local{" "}
            <code>sm | md | lg</code>.
            {picked && <> Last picked: <code>{picked}</code>.</>}
          </p>
        </div>
      }
      preview={
        <VariablePicker
          groups={empty ? [] : GROUPS}
          size={size}
          tone={tone}
          onSelect={(v) => setPicked(v.fullToken)}
          onClose={() => {}}
          resolve={
            withResolve
              ? (v) => ({ state: v.value ? "resolved" : "missing", value: v.value ?? "" })
              : undefined
          }
        />
      }
    />
  );
};
