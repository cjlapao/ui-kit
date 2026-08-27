import React, { useMemo, useState } from "react";
import { MultiToggle, SmartInput, SmartValue } from "@cjlapao/ui-kit";
import type {
  InputVariant,
  SmartInputSize,
  SmartVariable,
  SmartVariableResolution,
  SmartVariableResolver,
  SmartViewMode,
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
  inputVariantOptions,
  SMART_INPUT_SAMPLES,
  SMART_VARIABLE_GROUPS,
  smartInputSizeOptions,
  trueColorOptions,
} from "../../shared/options";

const SAMPLE_OPTIONS = [
  { label: "URL", value: "url" },
  { label: "Env", value: "env" },
  { label: "With missing", value: "missing" },
  { label: "Multiline", value: "multiline" },
];

const VIEW_OPTIONS = [
  { label: "Tokens", value: "token" },
  { label: "Values", value: "value" },
];

export const SmartInputPlayground: React.FC = () => {
  const [sample, setSample] = useState<keyof typeof SMART_INPUT_SAMPLES>(
    "missing",
  );
  const [value, setValue] = useState(SMART_INPUT_SAMPLES.missing);
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<SmartInputSize>("md");
  const [defaultView, setDefaultView] = useState<SmartViewMode>("token");
  const [multiline, setMultiline] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [autocomplete, setAutocomplete] = useState(true);
  const [flagMissing, setFlagMissing] = useState(true);
  const [customResolver, setCustomResolver] = useState(false);

  /**
   * A caller-supplied resolver. Product rules — derived values, host names,
   * runtime placeholders — live here rather than in the kit.
   */
  const resolve = useMemo<SmartVariableResolver | undefined>(() => {
    if (!customResolver) return undefined;
    return (variable: SmartVariable): SmartVariableResolution => {
      if (variable.source === "deploy" && variable.name === "BUILD_ID") {
        return { value: "build-4821", state: "resolved" };
      }
      if (variable.name === "FEATURE_FLAGS") {
        return { value: "beta,metrics", state: "resolved" };
      }
      const group = SMART_VARIABLE_GROUPS.find(
        (entry) => entry.id === variable.source,
      );
      const definition = group?.variables.find(
        (entry) => entry.key === variable.name,
      );
      if (!definition) return { value: "", state: "missing" };
      const resolved = definition.value ?? definition.defaultValue ?? "";
      return resolved
        ? { value: resolved, state: "resolved" }
        : { value: "", state: "missing" };
    };
  }, [customResolver]);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label="Sample value">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={SAMPLE_OPTIONS}
                      value={sample}
                      onChange={(next) => {
                        const key = next as keyof typeof SMART_INPUT_SAMPLES;
                        setSample(key);
                        setValue(SMART_INPUT_SAMPLES[key]);
                        setMultiline(key === "multiline");
                      }}
                    />
                  </Control>
                ),
              },
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <Control label="Surface">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={inputVariantOptions}
                        value={variant}
                        onChange={(next) => setVariant(next as InputVariant)}
                      />
                    </Control>
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={smartInputSizeOptions}
                        value={size}
                        onChange={(next) => setSize(next as SmartInputSize)}
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "preview",
                title: "Preview",
                controls: (
                  <Control label="Preview opens in">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={VIEW_OPTIONS}
                      value={defaultView}
                      onChange={(next) => setDefaultView(next as SmartViewMode)}
                    />
                  </Control>
                ),
              },
              {
                id: "behavior",
                title: "Behavior",
                controls: (
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow
                      label="Multiline"
                      checked={multiline}
                      onChange={setMultiline}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label={`Autocomplete on {{`}
                      checked={autocomplete}
                      onChange={setAutocomplete}
                    />
                    <ToggleRow
                      label="Flag missing"
                      checked={flagMissing}
                      onChange={setFlagMissing}
                    />
                    <ToggleRow
                      label="Custom resolver"
                      checked={customResolver}
                      onChange={setCustomResolver}
                    />
                  </div>
                ),
              },
            ]}
          />
          {customResolver && (
            <p className="text-xs opacity-70">
              The custom resolver gives <code>BUILD_ID</code> and{" "}
              <code>FEATURE_FLAGS</code> values the default lookup cannot know
              — that is where product rules live.{" "}
              <code>NOT_A_VARIABLE</code> stays missing either way.
            </p>
          )}
        </div>
      }
      preview={
        <div className="w-full">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <div className="flex flex-col gap-4">
              <SmartInput
                value={value}
                onChange={setValue}
                groups={SMART_VARIABLE_GROUPS}
                resolve={resolve}
                variant={variant}
                tone={tone}
                size={size}
                defaultViewMode={defaultView}
                multiline={multiline}
                disabled={disabled}
                autocomplete={autocomplete}
                flagMissing={flagMissing}
                placeholder="Type a value, or press + to insert a variable"
                aria-label="Smart value"
              />
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
                  SmartValue — the read-only twin
                </p>
                <SmartValue
                  value={value}
                  groups={SMART_VARIABLE_GROUPS}
                  resolve={resolve}
                  tone={tone}
                  flagMissing={flagMissing}
                  alwaysShowToggle
                />
              </div>
              <div className="rounded-lg border border-black/10 p-3 font-mono text-xs break-all dark:border-white/10">
                {value || <span className="opacity-60">(empty)</span>}
              </div>
            </div>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
