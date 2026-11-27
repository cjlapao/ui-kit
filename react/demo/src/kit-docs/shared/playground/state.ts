import { useCallback, useMemo, useState } from "react";
import type {
  PlaygroundConfig,
  PlaygroundField,
  PlaygroundHandle,
  PlaygroundState,
  PlaygroundValue,
} from "./schema";
import { createEmitter } from "./emit";

/**
 * The single owner of a playground's values.
 *
 * A page declares its `PlaygroundConfig` — groups, fields, data — calls this
 * once, and hands the handle to `<Playground>`. Controls, preview and the
 * printed source all read the same object, which is the only reason the three
 * can stay honest with each other.
 */

const initialValues = (config: PlaygroundConfig): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of config.fields) {
    if (field.kind === "custom") {
      if (field.default !== undefined) state[field.id] = field.default;
      continue;
    }
    state[field.id] = field.default;
  }
  return state;
};

const kindMatches = (field: PlaygroundField, value: PlaygroundValue): boolean => {
  switch (field.kind) {
    case "choice":
      return typeof value === "string";
    case "toggle":
      return typeof value === "boolean";
    case "text":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "custom":
      return true;
  }
};

/**
 * A mis-declared schema is a bug in the docs page, and the failure it produces
 * is a control that renders nothing or a line of code that silently vanishes —
 * both of which read as "the component is broken". Fail loudly, once, on mount.
 */
const validate = (config: PlaygroundConfig): void => {
  const seen = new Set<string>();
  const groupIds = new Set(config.groups.map((group) => group.id));

  for (const field of config.fields) {
    if (seen.has(field.id)) {
      throw new Error(`playground: two fields share the id "${field.id}".`);
    }
    seen.add(field.id);
    if (!groupIds.has(field.group)) {
      throw new Error(
        `playground: field "${field.id}" sits in group "${field.group}", which is not in config.groups.`,
      );
    }
    /*
     * A non-`custom` field must declare a default. The type says so — which is
     * why the check reads through a loose view: TypeScript narrows the field to
     * `never` on a condition the declaration already rules out, and this guard
     * exists for the schema that arrives from JS or a generator, not for this file.
     */
    const declared = field as { default?: PlaygroundValue };
    if (field.kind !== "custom" && declared.default === undefined) {
      throw new Error(`playground: field "${field.id}" (${field.kind}) has no default.`);
    }
    if (field.default !== undefined && !kindMatches(field, field.default)) {
      throw new Error(
        `playground: field "${field.id}" has a ${typeof field.default} default, which its kind ("${field.kind}") cannot hold.`,
      );
    }
    if (field.docDefault !== undefined && !kindMatches(field, field.docDefault)) {
      throw new Error(
        `playground: field "${field.id}" has a ${typeof field.docDefault} docDefault, which its kind ("${field.kind}") cannot hold.`,
      );
    }
    if (field.kind === "choice" && !field.options.some((option) => option.value === field.default)) {
      throw new Error(
        `playground: field "${field.id}" opens on "${field.default}", which is not one of its options.`,
      );
    }
  }

  const dataIds = new Set<string>();
  for (const source of config.data ?? []) {
    if (dataIds.has(source.id)) {
      throw new Error(`playground: two data sources share the id "${source.id}".`);
    }
    dataIds.add(source.id);
    if (source.emit === "source" && !source.source) {
      throw new Error(
        `playground: data source "${source.id}" says emit: "source" but has no source().`,
      );
    }
  }
};

/**
 * A controlled value the preview owns that no *component* takes as a prop — a
 * Picker's selection, a dismissed card. The playground's state is the knob
 * values; this is for what the menu itself holds. `code` prints whatever the
 * current value implies, so the two cannot drift.
 */
export function useControlled<T>(initial: T): [
  T,
  (next: T | ((previous: T) => T)) => void,
] {
  return useState(initial) as [T, (next: T | ((previous: T) => T)) => void];
}

export function usePlayground(config: PlaygroundConfig): PlaygroundHandle {
  useMemo(() => validate(config), [config]);

  const initial = useMemo(() => initialValues(config), [config]);
  const [state, setState] = useState<PlaygroundState>(initial);

  const set = useCallback(
    (id: string, value: PlaygroundValue) => {
      if (!(id in initial)) {
        throw new Error(
          `playground: set("${id}") names no field — the ids in the config are the only writable ones.`,
        );
      }
      setState((current) =>
        current[id] === value ? current : { ...current, [id]: value },
      );
    },
    [initial],
  );

  const reset = useCallback(() => setState(initial), [initial]);

  const isDirty = useMemo(
    () => Object.keys(initial).some((id) => state[id] !== initial[id]),
    [initial, state],
  );

  const data = useMemo(() => {
    const resolved: Record<string, unknown> = {};
    for (const source of config.data ?? []) resolved[source.id] = source.value(state);
    return resolved;
  }, [config, state]);

  const visibleFields = useCallback(
    () => config.fields.filter((field) => !field.when || field.when(state)),
    [config, state],
  );

  const emitter = useMemo(() => createEmitter(config, state), [config, state]);

  return { config, state, set, reset, isDirty, data, visibleFields, emitter };
}
