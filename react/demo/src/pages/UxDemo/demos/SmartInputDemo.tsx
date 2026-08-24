import React, { useMemo, useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  SmartInput,
  SmartValue,
  MultiToggle,
  Select,
  Toggle,
  Panel,
} from "@cjlapao/ui-kit";
import type {
  InputVariant,
  SmartInputSize,
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolution,
  SmartVariableResolver,
  TrueColor,
} from "@cjlapao/ui-kit";
import { trueColorOptions } from "../constants";

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

/**
 * The groups are entirely the caller's — id, label, icon and tone. `id`
 * becomes the token's middle segment, so `deploy` here yields
 * `{{ var::deploy::REGION }}`.
 */
const GROUPS: SmartVariableGroup[] = [
  {
    id: "global",
    label: "Global",
    icon: "Globe",
    tone: "indigo",
    variables: [
      {
        key: "APP_NAME",
        label: "Application name",
        description: "Shown in the UI and in log lines.",
        value: "orchestrator-api",
      },
      {
        key: "DB_HOST",
        label: "Database host",
        description: "Hostname of the primary database.",
        defaultValue: "db.internal",
      },
      {
        key: "API_TOKEN",
        label: "API token",
        description: "Used to authenticate outbound calls.",
        type: "env",
        value: "sk-live-9f2b7c",
        secret: true,
      },
      {
        key: "FEATURE_FLAGS",
        label: "Feature flags",
        description: "Comma-separated list. No default — resolves to nothing.",
      },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    icon: "Rocket",
    tone: "violet",
    variables: [
      {
        key: "REGION",
        label: "Region",
        description: "Where the workload runs.",
        value: "eu-west-1",
      },
      {
        key: "BUILD_ID",
        label: "Build id",
        description: "Only known once the pipeline runs.",
        runtime: true,
      },
      {
        key: "REPLICAS",
        label: "Replicas",
        defaultValue: "3",
      },
    ],
  },
  {
    id: "service",
    label: "Services",
    icon: "Container",
    tone: "emerald",
    variables: [
      { key: "postgres", description: "Reference to service: postgres", value: "postgres" },
      { key: "redis", description: "Reference to service: redis", value: "redis" },
      { key: "caddy", description: "Reference to service: caddy", value: "caddy" },
    ],
  },
];

const SAMPLES: Record<string, string> = {
  url: "https://{{ var::global::APP_NAME }}.{{ var::deploy::REGION }}.example.com/health",
  env: "DATABASE_URL=postgres://{{ var::service::postgres }}:5432/{{ var::global::APP_NAME }}",
  missing:
    "Deploying {{ var::global::APP_NAME }} build {{ var::deploy::BUILD_ID }} — flags: {{ var::global::FEATURE_FLAGS }}, owner {{ var::global::NOT_A_VARIABLE }}",
  multiline:
    "server {\n  host = {{ var::global::DB_HOST }}\n  token = {{ env::global::API_TOKEN }}\n  replicas = {{ var::deploy::REPLICAS }}\n}",
};

const inputVariantOptions: { label: string; value: InputVariant }[] = [
  { label: "Flat", value: "flat" },
  { label: "Elevated", value: "elevated" },
  { label: "Ghost", value: "ghost" },
  { label: "Underline", value: "underline" },
  { label: "Glass", value: "glass" },
];

export const SmartInputDemo: React.FC = () => {
  const [sample, setSample] = useState<keyof typeof SAMPLES>("missing");
  const [value, setValue] = useState(SAMPLES.missing);
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<SmartInputSize>("md");
  const [multiline, setMultiline] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [autocomplete, setAutocomplete] = useState(true);
  const [flagMissing, setFlagMissing] = useState(true);
  const [customResolver, setCustomResolver] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

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
      const group = GROUPS.find((entry) => entry.id === variable.source);
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

  const input = (
    <SmartInput
      value={value}
      onChange={setValue}
      groups={GROUPS}
      resolve={resolve}
      variant={variant}
      tone={tone}
      size={size}
      multiline={multiline}
      disabled={disabled}
      autocomplete={autocomplete}
      flagMissing={flagMissing}
      placeholder="Type a value, or press + to insert a variable"
      aria-label="Smart value"
    />
  );

  return (
    <PlaygroundSection
      title="Smart Input"
      label="[SmartInput]"
      description="A value that can embed variable tokens. Click to edit, toggle the eye to swap every token for what it resolves to, and press + — or type {{ — to insert one."
      controls={
        <div className="space-y-5 text-sm">
          <Field label="Sample value">
            <MultiToggle
              fullWidth
              size="sm"
              options={[
                { label: "URL", value: "url" },
                { label: "Env", value: "env" },
                { label: "With missing", value: "missing" },
                { label: "Multiline", value: "multiline" },
              ]}
              value={sample}
              onChange={(next) => {
                setSample(next as keyof typeof SAMPLES);
                setValue(SAMPLES[next as keyof typeof SAMPLES]);
                setMultiline(next === "multiline");
              }}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Surface">
              <MultiToggle
                fullWidth
                size="sm"
                options={inputVariantOptions}
                value={variant}
                onChange={(next) => setVariant(next as InputVariant)}
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

          <Field label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={[
                { label: "SM", value: "sm" },
                { label: "MD", value: "md" },
                { label: "LG", value: "lg" },
              ]}
              value={size}
              onChange={(next) => setSize(next as SmartInputSize)}
            />
          </Field>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Multiline"
              checked={multiline}
              onChange={(event) => setMultiline(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Autocomplete on {{"
              checked={autocomplete}
              onChange={(event) => setAutocomplete(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Flag missing"
              checked={flagMissing}
              onChange={(event) => setFlagMissing(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Custom resolver"
              checked={customResolver}
              onChange={(event) => setCustomResolver(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            The <strong>custom resolver</strong> gives <code>BUILD_ID</code> and{" "}
            <code>FEATURE_FLAGS</code> values that the default lookup cannot
            know — that is where product rules live. <code>NOT_A_VARIABLE</code>{" "}
            stays missing either way.
          </p>

          <div className="rounded-lg border border-black/10 p-3 font-mono text-xs break-all dark:border-white/10">
            {value || <span className="opacity-60">(empty)</span>}
          </div>
        </div>
      }
      preview={
        <div className="space-y-6 p-4">
          {onGlass ? (
            <Panel variant="liquid-glass" tone={tone} padding="sm">
              {input}
            </Panel>
          ) : (
            input
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
              SmartValue — the read-only twin
            </p>
            <SmartValue
              value={value}
              groups={GROUPS}
              resolve={resolve}
              tone={tone}
              flagMissing={flagMissing}
              alwaysShowToggle
            />
          </div>
        </div>
      }
    />
  );
};
