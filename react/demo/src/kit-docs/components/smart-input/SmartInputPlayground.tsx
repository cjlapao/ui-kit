import React, { useMemo, useRef, useState } from "react";
import { ColorSwatches, Panel, SmartInput, SmartValue } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  GlowIntensity,
  InputVariant,
  PanelSpecularMode,
  SmartInputSize,
  SmartVariable,
  SmartVariableResolution,
  SmartVariableResolver,
  SmartViewMode,
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
  glassOpacityOptions,
  glassVibrancyOptions,
  glowIntensityOptions,
  inputVariantOptions,
  panelCornerOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
  SMART_INPUT_SAMPLES,
  SMART_VARIABLE_GROUPS,
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

/** Matches complete tokens, so the log can tell an edit from an insert. */
const TOKEN_RE = /\{\{\s*(?:var|env)::[^}]+\}\}/g;

const countTokens = (value: string) => (value.match(TOKEN_RE) ?? []).length;

export const SmartInputPlayground: React.FC = () => {
  const [sample, setSample] = useState<string>("missing");
  const [value, setValue] = useState(SMART_INPUT_SAMPLES.missing);
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<SurfaceCorner>("auto");
  const [size, setSize] = useState<SmartInputSize>("md");
  const [panelVariant, setPanelVariant] = useState<"auto" | SurfaceVariant>(
    "auto",
  );
  const [panelCorner, setPanelCorner] = useState<SurfaceCorner>("auto");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("subtle");
  const [defaultView, setDefaultView] = useState<SmartViewMode>("token");
  const [multiline, setMultiline] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [autocomplete, setAutocomplete] = useState(true);
  const [flagMissing, setFlagMissing] = useState(true);
  const [customResolver, setCustomResolver] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");

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

  const [log, pushLog] = useEventLog();
  const prev = useRef(value);
  const handleChange = (next: string) => {
    const before = prev.current;
    if (countTokens(next) > countTokens(before))
      pushLog("token inserted — onChange fired");
    else if (countTokens(next) < countTokens(before))
      pushLog("token removed — onChange fired");
    else if (next !== before) pushLog("text edited — onChange fired");
    prev.current = next;
    setValue(next);
  };

  const field = (
    <SmartInput
      value={value}
      onChange={handleChange}
      groups={SMART_VARIABLE_GROUPS}
      resolve={resolve}
      variant={variant}
      tone={tone}
      corner={corner}
      size={size}
      panelVariant={panelVariant}
      panelCorner={panelCorner}
      glowIntensity={glowIntensity}
      defaultViewMode={defaultView}
      multiline={multiline}
      disabled={disabled}
      autocomplete={autocomplete}
      flagMissing={flagMissing}
      placeholder="Type a value, or press + to insert a variable"
      aria-label="Smart value"
    />
  );

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
                  <ChoiceControl
                    label="Sample value"
                    options={SAMPLE_OPTIONS}
                    value={sample}
                    onChange={(next) => {
                      setSample(next);
                      setValue(SMART_INPUT_SAMPLES[next] ?? next);
                      setMultiline(next === "multiline");
                    }}
                  />
                ),
              },
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <ChoiceControl
                      label="Variant"
                      options={inputVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as InputVariant)}
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
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as SmartInputSize)}
                    />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Picker surface"
                      options={[
                        { label: "Auto (follow variant)", value: "auto" },
                        ...surfaceVariantOptions,
                      ]}
                      value={panelVariant}
                      onChange={(v) =>
                        setPanelVariant(v as "auto" | SurfaceVariant)
                      }
                    />
                    <SelectControl
                      label="Picker corner"
                      options={panelCornerOptions}
                      value={panelCorner}
                      onChange={(v) => setPanelCorner(v as SurfaceCorner)}
                    />
                  </>
                ),
              },
              {
                id: "preview",
                title: "Preview",
                controls: (
                  <ChoiceControl
                    label="Preview opens in"
                    options={VIEW_OPTIONS}
                    value={defaultView}
                    onChange={(v) => setDefaultView(v as SmartViewMode)}
                  />
                ),
              },
              ...(variant === "gradient"
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <ChoiceControl
                          label="Glow"
                          options={glowIntensityOptions}
                          value={glowIntensity}
                          onChange={(v) => setGlowIntensity(v as GlowIntensity)}
                        />
                      ),
                    },
                  ]
                : []),
              ...(variant === "glass" || onGlass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <>
                          <ChoiceControl
                            label="Specular"
                            options={panelSpecularOptions}
                            value={specularMode}
                            onChange={(v) =>
                              setSpecularMode(v as PanelSpecularMode)
                            }
                          />
                          <ChoiceControl
                            label="Vibrancy"
                            options={glassVibrancyOptions}
                            value={vibrancy as string}
                            onChange={(v) => setVibrancy(v as GlassVibrancy)}
                          />
                          <ChoiceControl
                            label="Glass opacity"
                            options={glassOpacityOptions}
                            value={glassOpacity as string}
                            onChange={(v) => setGlassOpacity(v as GlassOpacity)}
                          />
                        </>
                      ),
                    },
                  ]
                : []),
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
              {
                id: "states",
                title: "States",
                controls: (
                  <>
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
                  </>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — edit the value."
          />
          {customResolver && (
            <p className="text-xs opacity-70">
              The custom resolver gives <code>BUILD_ID</code> and{" "}
              <code>FEATURE_FLAGS</code> values the default lookup cannot know —
              that is where product rules live. <code>NOT_A_VARIABLE</code>{" "}
              stays missing either way.
            </p>
          )}
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The log reads the delta the callback carried — a token inserted, a
            token removed, or the prose around them edited. Both corners run on
            the theme&rsquo;s corner ladder: the field&rsquo;s <em>auto</em> is
            the control default (one step looser than a card, so it sits proud
            of it), the picker&rsquo;s <em>auto</em> the container default — pin
            either token to break the pair deliberately. This is otherwise the
            same box as the <code>Input</code> beside it, down to the shared
            padding scale and focus ring. The <code>gradient</code> variant
            glows, the <code>glass</code> variant blurs — and the picker card
            follows the field&rsquo;s surface the way the{" "}
            <code>DatePicker</code> calendar does, through{" "}
            <code>panelVariant</code>. Every string — down to <em>1 missing</em>{" "}
            — rides the catalog.
          </p>
        </div>
      }
      preview={
        <div className="w-full space-y-4">
          {inPanel ? (
            <Panel
              // Corner-free: the field is the furniture; a rounded host
              // hugging a bare input reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              specularMode={onGlass ? specularMode : "none"}
              vibrancy={vibrancy}
              glassOpacity={glassOpacity}
              padding="md"
              scrollable={false}
            >
              <div className="w-full py-2">{field}</div>
            </Panel>
          ) : (
            <div className="w-full py-2">{field}</div>
          )}
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
      }
    ></PlaygroundPanel>
  );
};
