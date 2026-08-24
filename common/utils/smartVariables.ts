import type {
  SmartVariable,
  SmartVariableDefinition,
  SmartVariableGroup,
  SmartVariableResolution,
  SmartVariableResolver,
  SmartVariableSource,
  SmartVariableType,
} from "../types/Variables";

/**
 * Matches `{{ type::source::name }}`.
 * Captures: 1 = type, 2 = source, 3 = name.
 *
 * `source` is an open identifier now — it used to be the literal alternation
 * `global|system|service`, so a caller with its own groups produced tokens the
 * kit silently refused to recognise.
 */
export const SMART_VAR_REGEX =
  /\{\{\s*(var|env)::([a-zA-Z0-9_\-.]+)::([a-zA-Z0-9_\-.]+)\s*\}\}/g;

/** The same pattern anchored, for testing one token in isolation. */
const SINGLE_VAR_REGEX =
  /^\{\{\s*(var|env)::([a-zA-Z0-9_\-.]+)::([a-zA-Z0-9_\-.]+)\s*\}\}$/;

export const createSmartToken = (
  type: SmartVariableType,
  source: SmartVariableSource,
  name: string,
): string => `{{ ${type}::${source}::${name} }}`;

export const parseSmartVariable = (token: string): SmartVariable | null => {
  const match = token.match(SINGLE_VAR_REGEX);
  if (!match) return null;
  return {
    fullToken: token,
    type: match[1] as SmartVariableType,
    source: match[2],
    name: match[3],
  };
};

/**
 * A fresh regex per call. `SMART_VAR_REGEX` carries the `g` flag, so sharing
 * one instance across calls leaks `lastIndex` between them and matches get
 * skipped.
 */
const matcher = (): RegExp => new RegExp(SMART_VAR_REGEX.source, "gi");

/** Every distinct token in a string, in order of first appearance. */
export const extractVariables = (text: string): SmartVariable[] => {
  const variables: SmartVariable[] = [];
  const seen = new Set<string>();
  const regex = matcher();

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const fullToken = match[0];
    if (seen.has(fullToken)) continue;
    seen.add(fullToken);
    variables.push({
      fullToken,
      type: match[1].toLowerCase() as SmartVariableType,
      source: match[2],
      name: match[3],
    });
  }

  return variables;
};

export const hasSmartVariables = (text: string): boolean =>
  matcher().test(text ?? "");

// ── Splitting ─────────────────────────────────────────────────────────────────

export type SmartValuePart =
  | { kind: "text"; text: string; index: number }
  | { kind: "token"; variable: SmartVariable; index: number };

/**
 * Splits a value into literal text and tokens, once, for every renderer.
 *
 * `SmartInput`, `SmartValue`, `MarkdownEditor` and the Vue twins each carried
 * their own copy of this `while (regex.exec(...))` loop plus its own badge
 * palette, and they had already drifted — one required the token's type to
 * match the definition's, another ignored it.
 */
export const splitSmartValue = (value: string): SmartValuePart[] => {
  const parts: SmartValuePart[] = [];
  if (!value) return parts;

  const regex = matcher();
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        kind: "text",
        text: value.slice(lastIndex, match.index),
        index: lastIndex,
      });
    }
    parts.push({
      kind: "token",
      index: match.index,
      variable: {
        fullToken: match[0],
        type: match[1].toLowerCase() as SmartVariableType,
        source: match[2],
        name: match[3],
      },
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < value.length) {
    parts.push({ kind: "text", text: value.slice(lastIndex), index: lastIndex });
  }

  return parts;
};

// ── Groups ────────────────────────────────────────────────────────────────────

/** Turns one group's definitions into insertable tokens. */
export const groupToVariables = (
  group: SmartVariableGroup,
): SmartVariable[] =>
  group.variables.map((definition) => toSmartVariable(group.id, definition));

export const toSmartVariable = (
  source: SmartVariableSource,
  definition: SmartVariableDefinition,
): SmartVariable => {
  const type: SmartVariableType = definition.type ?? "var";
  return {
    fullToken: createSmartToken(type, source, definition.key),
    type,
    source,
    name: definition.key,
    label: definition.label,
    description: definition.description,
    value: definition.value,
    defaultValue: definition.defaultValue,
    secret: definition.secret,
  };
};

/**
 * Finds the definition a token refers to. Matches on the group id and key,
 * falling back to a case-insensitive key match — token names are typed by
 * hand and case slips are the common failure.
 */
export const findDefinition = (
  groups: SmartVariableGroup[],
  variable: SmartVariable,
): { group: SmartVariableGroup; definition: SmartVariableDefinition } | null => {
  const group = groups.find((candidate) => candidate.id === variable.source);
  if (!group) return null;

  const definition =
    group.variables.find((entry) => entry.key === variable.name) ??
    group.variables.find(
      (entry) => entry.key.toLowerCase() === variable.name.toLowerCase(),
    );

  return definition ? { group, definition } : null;
};

// ── Resolution ────────────────────────────────────────────────────────────────

/**
 * The resolver used when the caller supplies none: looks the token up in the
 * groups and reports its `value`, then its `defaultValue`, then `missing`.
 *
 * Product rules — derived values, environment lookups, host names — belong in
 * a caller-supplied resolver, not here. The kit used to hard-code one
 * product's domain name and runtime-variable allow-list into this function.
 */
export const createDefaultResolver =
  (groups: SmartVariableGroup[]): SmartVariableResolver =>
  (variable: SmartVariable): SmartVariableResolution => {
    const found = findDefinition(groups, variable);
    if (!found) {
      return { value: "", state: "missing" };
    }

    const { definition } = found;
    if (definition.runtime) {
      return { value: `[${definition.key}]`, state: "runtime" };
    }

    const value = definition.value ?? definition.defaultValue ?? "";
    return value
      ? { value, state: "resolved" }
      : { value: "", state: "missing" };
  };

/** Resolves every token in a value, for counters and validation. */
export const resolveSmartValue = (
  value: string,
  resolve: SmartVariableResolver,
): { text: string; missing: SmartVariable[] } => {
  const missing: SmartVariable[] = [];
  const text = splitSmartValue(value)
    .map((part) => {
      if (part.kind === "text") return part.text;
      const resolution = resolve(part.variable);
      if (resolution.state === "missing") missing.push(part.variable);
      return resolution.value;
    })
    .join("");
  return { text, missing };
};

// ── Migration helper ──────────────────────────────────────────────────────────

/**
 * Builds the three groups the components used to hard-code, from the old
 * `globalParameters` / `serviceNames` props.
 *
 * @deprecated Pass `groups` directly. Kept so call sites written against the
 * previous API keep working while they migrate.
 */
export const createLegacyGroups = (options: {
  globalParameters?: Array<{
    key: string;
    name?: string;
    type?: string;
    help?: string;
    default?: unknown;
    default_value?: string;
    [extra: string]: unknown;
  }>;
  serviceNames?: string[];
  systemVariables?: SmartVariable[];
}): SmartVariableGroup[] => {
  const { globalParameters = [], serviceNames = [], systemVariables = [] } =
    options;

  return [
    {
      id: "global",
      label: "Global",
      icon: "Globe",
      tone: "indigo",
      variables: globalParameters.map((parameter) => ({
        key: parameter.key,
        label: parameter.name,
        description: parameter.help,
        type: parameter.type === "env" ? "env" : "var",
        defaultValue:
          parameter.default_value ??
          (parameter.default == null ? undefined : String(parameter.default)),
      })),
    },
    {
      id: "system",
      label: "System",
      icon: "Cog",
      tone: "amber",
      variables: systemVariables.map((variable) => ({
        key: variable.name,
        label: variable.label,
        description: variable.description,
        type: variable.type,
        defaultValue: variable.defaultValue,
      })),
    },
    {
      id: "service",
      label: "Services",
      icon: "Container",
      tone: "emerald",
      variables: serviceNames.map((name) => ({
        key: name,
        description: `Reference to service: ${name}`,
        value: name,
      })),
    },
  ];
};
