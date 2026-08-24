import type { TrueColor } from "../theme/Theme";

/** Whether a token expands to a plain value or an environment reference. */
export type SmartVariableType = "var" | "env";

/**
 * Which group a token belongs to — the middle segment of
 * `{{ type::source::name }}`.
 *
 * An open string, not a fixed union. It used to be
 * `"global" | "system" | "service"`, which hardcoded one product's taxonomy
 * into the kit; the caller now names its own groups.
 */
export type SmartVariableSource = string;

/** A token found in, or about to be inserted into, a value. */
export interface SmartVariable {
  fullToken: string;
  type: SmartVariableType;
  source: SmartVariableSource;
  name: string;
  label?: string;
  description?: string;
  /** Concrete value, when the caller already knows it. */
  value?: string;
  defaultValue?: string;
  /** Masks the value in the preview. */
  secret?: boolean;
}

/**
 * One variable a caller offers in the picker. Replaces the
 * `CapsuleBlueprintParameter` shape the component used to require.
 */
export interface SmartVariableDefinition {
  /** Token name — the third segment. */
  key: string;
  /** Display name. Falls back to `key`. */
  label?: string;
  description?: string;
  /** @default "var" */
  type?: SmartVariableType;
  /** Concrete value, if known now. */
  value?: string;
  defaultValue?: string;
  /** Renders the resolved value masked. */
  secret?: boolean;
  /** Resolves to a value only at run time — shown as a distinct state. */
  runtime?: boolean;
}

/** A named set of variables, rendered as one tab in the picker. */
export interface SmartVariableGroup {
  /** Becomes the token's `source` segment. */
  id: SmartVariableSource;
  label: string;
  /** Icon name from the kit's registry. */
  icon?: string;
  /** Accent colour for badges from this group. */
  tone?: TrueColor;
  variables: SmartVariableDefinition[];
  /** Shown when the group is empty or filtered to nothing. */
  emptyMessage?: string;
}

/**
 * How a token turned out.
 * - `resolved` — a concrete value is known
 * - `runtime`  — valid, but only gets a value when the thing actually runs
 * - `missing`  — no such variable, or it resolved to nothing
 */
export type SmartVariableState = "resolved" | "runtime" | "missing";

export interface SmartVariableResolution {
  value: string;
  state: SmartVariableState;
}

/**
 * Turns a token into a display value. Supplied by the caller, so product rules
 * — derived values, environment lookups, runtime placeholders — live in the
 * app rather than in the kit.
 */
export type SmartVariableResolver = (
  variable: SmartVariable,
) => SmartVariableResolution;

/**
 * @deprecated Parallels-specific sample data. Pass your own
 * `SmartVariableGroup[]` instead; kept so existing call sites keep compiling.
 */
export const SYSTEM_VARIABLES: SmartVariable[] = [
  {
    fullToken: "{{ var::system::capsule_id }}",
    type: "var",
    source: "system",
    name: "capsule_id",
    description: "The unique identifier of the capsule instance.",
  },
  {
    fullToken: "{{ var::system::capsule_name }}",
    type: "var",
    source: "system",
    name: "capsule_name",
    description: "The name of the capsule.",
  },
  {
    fullToken: "{{ var::system::host_ip }}",
    type: "var",
    source: "system",
    name: "host_ip",
    description: "The IP address of the host machine.",
  },
  {
    fullToken: "{{ var::system::app_url }}",
    type: "var",
    source: "system",
    name: "app_url",
    description: "The main URL for the application.",
  },
  {
    fullToken: "{{ var::system::name }}",
    type: "var",
    source: "system",
    name: "name",
    description: "Capsule Name (Runtime)",
  },
  {
    fullToken: "{{ var::system::reverse_proxy_host }}",
    type: "var",
    source: "system",
    name: "reverse_proxy_host",
    description: "IP of the caddy reverse host (Runtime)",
  },
  {
    fullToken: "{{ var::system::ip_address }}",
    type: "var",
    source: "system",
    name: "ip_address",
    description: "IP of the VM (Runtime)",
  },
  {
    fullToken: "{{ var::system::host_gateway_ip }}",
    type: "var",
    source: "system",
    name: "host_gateway_ip",
    description: "IP of the docker gateway (Runtime)",
  },
  {
    fullToken: "{{ var::system::sub_domain }}",
    type: "var",
    source: "system",
    name: "sub_domain",
    description: "The subdomain value (derived from slug)",
  },
  {
    fullToken: "{{ var::system::domain }}",
    type: "var",
    source: "system",
    name: "domain",
    description: "The domain suffix",
  },
  {
    fullToken: "{{ var::system::host_url }}",
    type: "var",
    source: "system",
    name: "host_url",
    description: "The full URL (derived from sub_domain and domain)",
  },
];
