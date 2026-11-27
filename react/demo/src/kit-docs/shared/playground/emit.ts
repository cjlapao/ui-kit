import { Fragment } from "react";
import type {
  EmitHelpers,
  PlaygroundConfig,
  PlaygroundDataSource,
  PlaygroundField,
  PlaygroundState,
  PlaygroundValue,
} from "./schema";

/**
 * State → source text. Pure: no React, no DOM, nothing but the config and the
 * values, so the whole Code view is testable as a string.
 *
 * What the printer promises:
 *   - **What it prints is what renders.** `props`/`payload` read the same state
 *     the preview was handed, and a data source prints the value it was asked
 *     to render — never a re-derivation.
 *   - **The snippet is the diff.** A value equal to its `docDefault` is not
 *     printed, so the block reads as *what you changed*, not as a wall of
 *     attributes that happen to be on.
 *   - **No silent truncation.** A literal is printed in full: a copy-pasteable
 *     block that hides half its rows is worse than a long one. A large literal
 *     is instead called out in dev, where the page author — not the reader —
 *     decides whether that fixture should say `emit: "source"`.
 */

/** Column the printer wraps at. */
const MAX_WIDTH = 80;
const INDENT = "  ";
/** Fields and data sources with no `set` belong to the default element. */
const DEFAULT_SET = "props";
/** Past this, a `literal` fixture is a generator wearing a mask. */
const LITERAL_WARN_CHARS = 600;

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const isReactElement = (value: unknown): boolean =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as { $$typeof?: symbol }).$$typeof === "symbol";

/** Prefix **every** line, so a multi-line fragment can be nested. */
const indentLines = (text: string, levels: number): string =>
  text
    .split("\n")
    .map((line) => (line.length > 0 ? INDENT.repeat(levels) + line : line))
    .join("\n");

/**
 * `[a, b]` when it fits, one entry per line when it does not. Returned lines
 * are relative — the first starts at column 0 — so the caller owns the column.
 */
const block = (
  parts: string[],
  open: string,
  close: string,
  level: number,
): string => {
  if (parts.length === 0) return `${open}${close}`;
  // The house style, and the one that reads: `{ a: 1 }`, not `{a: 1}` — while
  // an array keeps its tight `[1, 2]`.
  const pad = open === "{" ? " " : "";
  const flat = `${open}${pad}${parts.join(", ")}${pad}${close}`;
  if (!flat.includes("\n") && flat.length + level * 2 <= MAX_WIDTH) return flat;
  return `${open}\n${parts.map((part) => indentLines(part, 1)).join(",\n")},\n${close}`;
};

const devWarn = (message: string) => {
  if (import.meta.env?.DEV) console.warn(message);
};

/** One value as a JavaScript literal. */
const format = (value: unknown, level: number): string => {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`playground: cannot print ${String(value)} — a fixture must be finite.`);
    }
    return String(value);
  }
  if (typeof value === "boolean" || value === null) return String(value);
  if (typeof value === "bigint") return `${value}n`;
  if (value === undefined) {
    throw new Error(
      "playground: undefined has no literal. Omit the value instead — return null from `emit`, or leave the field at its `docDefault`.",
    );
  }
  if (value instanceof Date) return `new Date(${JSON.stringify(value.toISOString())})`;
  if (isReactElement(value)) {
    throw new Error(
      "playground: a React element has no literal. Give that data source `emit: \"source\"` and print the JSX.",
    );
  }
  if (typeof value === "function") {
    throw new Error(
      "playground: a function has no literal. Give that data source `emit: \"source\"` and print the handler.",
    );
  }
  if (Array.isArray(value)) {
    return block(value.map((item) => format(item, level + 1)), "[", "]", level);
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, item]) => item !== undefined,
    );
    return block(
      entries.map(
        ([key, item]) =>
          `${IDENTIFIER.test(key) ? key : JSON.stringify(key)}: ${format(item, level + 1)}`,
      ),
      "{",
      "}",
      level,
    );
  }
  throw new Error(`playground: cannot print a ${typeof value}.`);
};

const commentOf = (label?: string, note?: string): string => {
  const text = [label, note].filter(Boolean).join(" — ");
  return text.length > 0 ? `// ${text}\n` : "";
};

/* -------------------------------------------------------------------------- *
 * JSX
 *
 * `format` prints data. Most fixtures are not data: a badge is a `<Pill>`, a
 * group's actions are three buttons, a CTA's media is an image. `jsx` prints
 * those — the *same* element the preview mounts, walked and written out — so a
 * fixture never needs a second, hand-typed description that can drift from the
 * pixels. Two rules keep it honest rather than clever:
 *   - a component is printed by an identifier the page **names**, never by
 *     `fn.name`, which a production bundle would mangle into `o`;
 *   - a prop that cannot be expressed — a callback — makes it **throw** rather
 *     than quietly drop the prop that makes the fixture work. The page says what
 *     to print for it through `replace`.
 * -------------------------------------------------------------------------- */

interface JsxContext {
  names: Record<string, unknown>;
  /** Prop name → the verbatim attribute text to print in its place. */
  replace: Record<string, string>;
  omit: Set<string>;
}

const childrenOf = (children: unknown): unknown[] => {
  if (children === null || children === undefined || children === false) return [];
  const list = Array.isArray(children) ? children.flat(Infinity) : [children];
  return list.filter((child) => child !== null && child !== undefined && child !== false);
};

const nameOf = (type: unknown, ctx: JsxContext): string => {
  if (typeof type === "string") return type;
  const found = Object.entries(ctx.names).find(([, component]) => component === type);
  const guess =
    typeof type === "function" && type.name ? ` (${type.name})` : "";
  if (!found) {
    throw new Error(
      `playground: jsx() has no identifier for that component${guess} — add it to \`names\`, \`{ GroupAction: GroupAction }\`. Printing fn.name would print a mangled name in a built docs site.`,
    );
  }
  return found[0];
};

/** `<Tag … />` or `<Tag …>`, stacked once the attributes no longer fit. */
const tagOpen = (
  tag: string,
  attributes: string[],
  level: number,
  selfClosing: boolean,
): string => {
  const close = selfClosing ? " />" : ">";
  if (attributes.length === 0) return selfClosing ? `<${tag} />` : `<${tag}>`;
  const flat = `<${tag} ${attributes.join(" ")}${close}`;
  if (!flat.includes("\n") && flat.length + level * 2 <= MAX_WIDTH) return flat;
  return `<${tag}\n${attributes.map((attribute) => indentLines(attribute, 1)).join("\n")}\n${close.trim()}`;
};

/** One React element, walked. */
const printElement = (
  element: { type: unknown; props: Record<string, unknown> },
  level: number,
  ctx: JsxContext,
): string => {
  const children = childrenOf(element.props?.children);
  // A fragment is markup with no tag: `<>…</>`, so a fixture's `actions` reads
  // exactly as it was written.
  if (element.type === (Fragment as unknown as symbol)) {
    if (children.length === 0) return "<></>";
    const printed = children.map((child) => print(child, level + 1, ctx));
    return block(printed, "<>", "</>", level);
  }

  const tag = nameOf(element.type, ctx);
  const attributes = attributesOf(element.props ?? {}, ctx);

  if (children.length === 0) return tagOpen(tag, attributes, level, true);

  const printed = children.map((child) =>
    typeof child === "string" || typeof child === "number"
      ? String(child).trim()
      : print(child, level + 1, ctx),
  );
  const open = tagOpen(tag, attributes, level, false);
  const flat = `${open}${printed.join("")}</${tag}>`;
  if (!flat.includes("\n") && flat.length + level * 2 <= MAX_WIDTH) return flat;
  return `${open}\n${printed.map((line) => indentLines(line, 1)).join("\n")}\n</${tag}>`;
};

/** One element's props as attribute text, in declaration order. */
const attributesOf = (
  props: Record<string, unknown>,
  ctx: JsxContext,
): string[] => {
  const attributes: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || ctx.omit.has(key) || value === undefined) continue;
    if (key in ctx.replace) {
      attributes.push(ctx.replace[key]);
      continue;
    }
    if (value === true) {
      attributes.push(key);
      continue;
    }
    if (typeof value === "string") {
      attributes.push(`${key}=${JSON.stringify(value)}`);
      continue;
    }
    if (typeof value === "function") {
      throw new Error(
        `playground: jsx() cannot print the ${key}={fn} prop on its own — say what to print with \`replace: { ${key}: "${key}={…}" }\`.`,
      );
    }
    attributes.push(`${key}={${print(value, 1, ctx)}}`);
  }
  return attributes;
};

/**
 * A value as source, JSX included. `format` with the one gap in it closed: a
 * React element is not a literal, it is markup, and markup can be printed.
 */
const print = (value: unknown, level: number, ctx: JsxContext): string => {
  if (isReactElement(value)) {
    return printElement(value as never, level, ctx);
  }
  if (Array.isArray(value)) {
    return block(value.map((item) => print(item, level + 1, ctx)), "[", "]", level);
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, item]) => item !== undefined,
    );
    return block(
      entries.map(([key, item]) => {
        // A callback inside a fixture is as unprintable as one on an element,
        // and the page says what to print either way.
        if (key in ctx.replace) return `${key}: ${ctx.replace[key]}`;
        if (typeof item === "function") {
          throw new Error(
            `playground: jsx() cannot print the ${key}={fn} entry on its own — say what to print with \`replace: { ${key}: "(…) => …" }\`.`,
          );
        }
        return `${IDENTIFIER.test(key) ? key : JSON.stringify(key)}: ${print(item, level + 1, ctx)}`;
      }),
      "{",
      "}",
      level,
    );
  }
  return format(value, level);
};

/**
 * A printer bound to one render's state and config. `Playground` builds it per
 * render and hands it to the page's `code(state, h)` as `h`.
 */
export const createEmitter = (
  config: PlaygroundConfig,
  state: PlaygroundState,
): EmitHelpers => {
  const dataSources = config.data ?? [];

  const findDataSource = (id: string): PlaygroundDataSource => {
    const found = dataSources.find((source) => source.id === id);
    if (!found) {
      throw new Error(
        `playground: no data source "${id}" — the page asked its emitter for data it never declared.`,
      );
    }
    return found;
  };

  const isVisible = (field: PlaygroundField): boolean =>
    !field.when || field.when(state);

  const inSet = (owner: { set?: string }, requested?: string): boolean =>
    (owner.set ?? DEFAULT_SET) === (requested ?? DEFAULT_SET);

  /** Fields the printer may speak for: visible, and in the requested subset. */
  const selectedFields = (options?: {
    set?: string;
    fields?: PlaygroundField[];
  }): PlaygroundField[] => {
    const fields = options?.fields ?? config.fields;
    return fields.filter(
      (field) => isVisible(field) && (options?.fields ? true : inSet(field, options?.set)),
    );
  };

  const valueOf = (field: PlaygroundField): PlaygroundValue | undefined =>
    state[field.id] ?? field.default;

  /** A field as one `name=value` attribute, or null when it is not worth printing. */
  const attributeOf = (field: PlaygroundField): string | null => {
    const value = valueOf(field);
    if (field.emit) return field.emit(value ?? ("" as string), state, helpers);
    if (field.prop === null || value === undefined) return null;
    const name = field.prop ?? field.id;
    if (!field.alwaysEmit && value === (field.docDefault ?? field.default)) return null;
    if (typeof value === "boolean") {
      // `flag` for on, `flag={false}` for the inverse of a default-true prop.
      return value ? name : `${name}={${value}}`;
    }
    /*
     * A number is an expression in JSX, not a string: `maxVisible={4}`, never
     * `maxVisible="4"` (wrong type) and never `maxVisible=4` (a parse error).
     * A `choice` carrying `valueType: "number"` holds its value as a string,
     * so it says so.
     */
    if (typeof value === "number" || (field.kind === "choice" && field.valueType === "number")) {
      return `${name}={${value}}`;
    }
    return `${name}=${format(value, 0)}`;
  };

  /** A field as one `name: value` object entry. No shorthand in an object literal. */
  const entryOf = (field: PlaygroundField): string | null => {
    const value = valueOf(field);
    if (field.emit) return field.emit(value ?? ("" as string), state, helpers);
    if (field.prop === null || value === undefined) return null;
    const name = field.prop ?? field.id;
    if (!field.alwaysEmit && value === (field.docDefault ?? field.default)) return null;
    if (typeof value === "boolean") return `${name}: ${value}`;
    if (field.kind === "choice" && field.valueType === "number") return `${name}: ${value}`;
    return `${name}: ${format(value, 0)}`;
  };

  const declarationOf = (source: PlaygroundDataSource, note?: string): string => {
    const name = source.constName ?? source.id;
    let body: string;
    if (source.emit === "source") {
      if (!source.source) {
        throw new Error(
          `playground: data source "${source.id}" says emit: "source" but has no source().`,
        );
      }
      body = source.source(state, helpers);
    } else {
      body = format(source.value(state), 0);
      if (body.length > LITERAL_WARN_CHARS) {
        devWarn(
          `playground: fixture "${source.id}" prints ${body.length} characters of literal. ` +
            "Give it `emit: \"source\"` and print the generator instead.",
        );
      }
    }
    return `${commentOf(source.label, note ?? source.note)}const ${name} = ${body};`;
  };

  const helpers: EmitHelpers = {
    lit: (value) => format(value, 0),

    jsx: (value, options) =>
      print(value, 0, {
        names: options?.names ?? {},
        replace: options?.replace ?? {},
        omit: new Set(options?.omit ?? []),
      }),

    props: (options) => {
      const attributes: string[] = [];
      // What it renders first, then the options that shape it.
      if (!options?.fields) {
        for (const source of dataSources) {
          if (!inSet(source, options?.set) || source.prop === null) continue;
          if (source.when && !source.when(state)) continue;
          attributes.push(`${source.prop ?? source.id}={${source.constName ?? source.id}}`);
        }
      }
      for (const field of selectedFields(options)) {
        const attribute = attributeOf(field);
        if (attribute !== null) attributes.push(attribute);
      }
      return attributes;
    },

    payload: (options) =>
      selectedFields(options)
        .map(entryOf)
        .filter((line): line is string => line !== null),

    object: (entries) => block([...entries], "{", "}", 0),

    element: (tag, attributes, level = 0) => {
      if (attributes.length === 0) return `<${tag} />`;
      const flat = `<${tag} ${attributes.join(" ")} />`;
      if (!flat.includes("\n") && flat.length + level * 2 <= MAX_WIDTH) return flat;
      return `<${tag}\n${attributes.map((attribute) => indentLines(attribute, 1)).join("\n")}\n/>`;
    },

    decl: (id, options) => {
      const source = findDataSource(id);
      return declarationOf(source, options?.note);
    },

    const: (name, body) => {
      if (body.source !== undefined) {
        return `${commentOf(body.label, body.note)}const ${name} = ${body.source};`;
      }
      return `${commentOf(body.label, body.note)}const ${name} = ${format(body.value, 0)};`;
    },

    source: (id) => {
      const source = findDataSource(id);
      if (!source.source) {
        throw new Error(
          `playground: data source "${id}" has no source() — it is a literal fixture.`,
        );
      }
      return source.source(state, helpers);
    },

    constName: (id) => {
      const source = findDataSource(id);
      return source.constName ?? source.id;
    },

    demo: (body) =>
      `export default function Demo() {\n  return (\n${indentLines(body, 2)}\n  );\n}`,

    snippet: ({ imports, decls, body }) => {
      const lines: string[] = [];
      const names = [...new Set(imports ?? [])].sort((a, b) => a.localeCompare(b));
      if (names.length > 0) {
        lines.push(`import { ${names.join(", ")} } from "@cjlapao/ui-kit";`);
      }
      for (const declaration of decls ?? []) {
        if (lines.length > 0) lines.push("");
        lines.push(declaration);
      }
      if (lines.length > 0) lines.push("");
      lines.push(body);
      return lines.join("\n");
    },

    indent: (text, spaces) => {
      const pad = " ".repeat(spaces);
      return text
        .split("\n")
        .map((line) => (line.length > 0 ? pad + line : line))
        .join("\n");
    },
  };

  return helpers;
};

/**
 * Hoisted declarations for the default element emission. The state rides along
 * so every printing rule reads the same way; the values themselves are already
 * resolved inside the emitter.
 */
export const defaultDeclarations = (
  config: PlaygroundConfig,
  state: PlaygroundState,
  h: EmitHelpers,
): string[] =>
  (config.data ?? [])
    .filter(
      (source) =>
        source.hoist !== false &&
        source.prop !== null &&
        (source.when ? source.when(state) : true) &&
        (source.set ?? "props") === "props",
    )
    .map((source) => h.decl(source.id));
