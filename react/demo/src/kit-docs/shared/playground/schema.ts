import type { ComponentType, ReactNode } from "react";
import type { MultiToggleOption } from "@cjlapao/ui-kit";

/**
 * The playground's declarative layer: **one** description of a component's
 * options, which produces the controls column, the preview's state and the
 * source the Code view prints.
 *
 * Nothing in this file renders or prints. The pieces are:
 *   `state.ts`              — `usePlayground`, the one hook that owns the values
 *   `PlaygroundControls.tsx`— schema → the left-hand controls column
 *   `emit.ts`               — state → source text
 *   `Playground.tsx`        — the page-level composition
 *
 * The rule the whole design leans on: a control, the value it edits and the
 * line of code it produces are the same entry. Three hand-written descriptions
 * of one option is how docs drift; one entry cannot.
 */

/** What a field may hold. Richer shapes go through `kind: "custom"`. */
export type PlaygroundValue = string | number | boolean;

/** Field id → current value. Flat on purpose: it is also the diff we print. */
export type PlaygroundState = Record<string, PlaygroundValue>;

/**
 * A choice entry. Stricter than `MultiToggleOption` (both members required)
 * while staying assignable to it, so the shared `options.ts` lists and a
 * page-local `[{ label, value }]` literal both drop straight in.
 */
export type PlaygroundOption = MultiToggleOption & { value: string; label: string };

/** What a `custom` control is handed, so it can render itself and write back. */
export interface PlaygroundControlContext {
  state: PlaygroundState;
  set: (id: string, value: PlaygroundValue) => void;
}

interface PlaygroundFieldBase {
  /** State key, and the prop name unless `prop` says otherwise. */
  id: string;
  /** Control label. */
  label: string;
  /** Which `PlaygroundConfig.groups` entry this control sits in. */
  group: string;
  /**
   * The component's documented default — the bar for *is this worth printing?*
   * Deliberately not `default`: a playground may open a toast deck at 22.5rem
   * while `ToastViewport` defaults to 18.75rem, and the snippet must still say
   * the width the reader is looking at. Falls back to `default`.
   */
  docDefault?: PlaygroundValue;
  /** Prop name; `null` = a preview-only lever that must never reach the code. */
  prop?: string | null;
  /**
   * Emission subset. `props`/`payload` take one, so a page with two targets —
   * a message payload *and* a viewport — keeps one field list. @default "props"
   */
  set?: string;
  /** Hide the control — and, with it, its line of code. Always consistent. */
  when?: (state: PlaygroundState) => boolean;
  /**
   * Print this field as the returned text instead of `name=value` / `name: value`.
   * `null` skips it. For the cases where one control owes the reader more than
   * one literal — or where a `prop: null` lever still says something.
   */
  emit?: (
    value: PlaygroundValue,
    state: PlaygroundState,
    h: EmitHelpers,
  ) => string | null;
  /** Print the line even when the value equals `docDefault`. */
  alwaysEmit?: boolean;
}

export type PlaygroundField =
  | (PlaygroundFieldBase & {
      kind: "choice";
      default: string;
      options: PlaygroundOption[];
      /**
       * Which control the choice gets. `"auto"` takes the segmented
       * `MultiToggle` for a short list and a `Select` once segments would be
       * unreadably narrow — the same rule `ChoiceControl` applies.
       * @default "auto"
       */
      control?: "auto" | "segments" | "select";
      /**
       * How the value prints: quoted, or bare. `"number"` is what a numeric
       * ladder (`maxVisible`, `limit`) needs, since a `choice` value is a string.
       * @default "string"
       */
      valueType?: "string" | "number";
    })
  | (PlaygroundFieldBase & { kind: "toggle"; default: boolean })
  | (PlaygroundFieldBase & {
      kind: "text";
      default: string;
      /** `Textarea` instead of `Input`. @default false */
      multiline?: boolean;
      placeholder?: string;
    })
  | (PlaygroundFieldBase & {
      kind: "number";
      default: number;
      min?: number;
      max?: number;
      step?: number;
    })
  | (PlaygroundFieldBase & {
      /** The escape hatch: a control the union cannot type. Prints nothing unless `emit` says so. */
      kind: "custom";
      default?: PlaygroundValue;
      render: (context: PlaygroundControlContext) => ReactNode;
    });

/** One accordion group in the controls column. */
export interface PlaygroundGroup {
  id: string;
  title: string;
  /** Open on mount. Groups start collapsed, like `ControlAccordion`. */
  defaultOpen?: boolean;
}

/**
 * The data behind a preview. The value the component renders and the value the
 * snippet prints are resolved from the same call, once per render — which is why
 * a fixture may not be random: `Math.random()` in here paints pixels the code
 * view cannot account for.
 */
export interface PlaygroundDataSource {
  /** Lookup key: `preview` reads `data[id]`. */
  id: string;
  /** Identifier in the snippet. @default id */
  constName?: string;
  /**
   * Attribute it fills, for the default `<Tag … />` emission; `null` = the page's
   * own `code` places it (Toast's action row) or it is documentation only.
   * @default id
   */
  prop?: string | null;
  /** Emission subset, as `PlaygroundField.set`. @default "props" */
  set?: string;
  /**
   * Drop the fixture from the printed source — its `const` and its attribute go
   * together, so a hidden fixture can never leave a dangling declaration behind.
   * The preview still receives `data[id]`, which is how an optional zone says
   * "off" without its content vanishing from state. Same rule as a field's
   * `when`: what the reader cannot see on screen, the Code view does not print.
   */
  when?: (state: PlaygroundState) => boolean;
  /** Printed above the declaration as `// label — note`. */
  label: string;
  /** The how-was-this-made line. This is the reader's only clue for synthetic data. */
  note?: string;
  /** Deterministic in `state`. */
  value: (state: PlaygroundState) => unknown;
  /**
   * `"literal"` prints the resolved value; `"source"` prints `source()` instead,
   * so a generated fixture shows the generator that made it.
   */
  emit: "literal" | "source";
  /** Verbatim TypeScript, indented for column 0. Required when `emit: "source"`. */
  source?: (state: PlaygroundState, h: EmitHelpers) => string;
  /** Hoist the declaration above the component. @default true */
  hoist?: boolean;
}

/** Everything `usePlayground` needs. Plain data, so a page can keep it in its own module. */
export interface PlaygroundConfig {
  groups: PlaygroundGroup[];
  fields: PlaygroundField[];
  data?: PlaygroundDataSource[];
}

/**
 * The printing toolkit a page's `code(state, h)` composes with. Bound to the
 * current state and config, so `props`/`payload`/`decl` know what is visible.
 */
/** How `jsx` should read a value. */
export interface PlaygroundJsxOptions {
  /**
   * Identifier → component, for every component the value mounts: `{ Pill }`.
   * The key is what gets printed, so a bundle cannot mangle it out from under the
   * page — an unmapped component is an error, not a mystery name in the snippet.
   */
  names?: Record<string, unknown>;
  /**
   * Prop name → verbatim attribute text, for the props no literal can say:
   * `{ onSelect: 'onSelect={(item) => pick(item.id)}' }`.
   */
  replace?: Record<string, string>;
  /** Prop names to leave out — the page has said about them elsewhere. */
  omit?: string[];
}

export interface EmitHelpers {
  /** A JavaScript literal. Throws in dev on anything only `emit: "source"` can say. */
  lit(value: unknown): string;
  /**
   * A React element — or an array/object holding them — as JSX. This is what
   * lets a fixture be printed rather than re-typed: the badge on screen and the
   * `<Pill>` in the snippet are one object, so they cannot disagree. Two rules
   * keep it honest: a component prints by an identifier the page **names** (a
   * bundle would mangle `fn.name`), and a prop that cannot be expressed — a
   * callback — throws instead of being quietly dropped.
   */
  jsx(value: unknown, options?: PlaygroundJsxOptions): string;
  /** JSX attributes, `name="value"` / `name={value}`, defaults omitted. */
  props(options?: { set?: string; fields?: PlaygroundField[] }): string[];
  /** Object entries, `name: value` — the body of a call like `toast.show({...})`. */
  payload(options?: { set?: string; fields?: PlaygroundField[] }): string[];
  /** `{ … }` around already-printed `name: value` entries. */
  object(entries: Iterable<string>): string;
  /** `<Tag … />`, one line when it fits, attributes stacked when it does not. */
  element(tag: string, attributes: string[], level?: number): string;
  /** `const NAME = …` for a data source, with its `// label — note` line above. */
  decl(id: string, options?: { note?: string; hoist?: boolean }): string;
  /** `const NAME = …` for anything the page wants hoisted. */
  const(
    name: string,
    body: { value?: unknown; source?: string; label?: string; note?: string },
  ): string;
  /** The verbatim `source` of a `"source"` data source. */
  source(id: string): string;
  /** The data source's hoisted name, for a page that places it itself. */
  constName(id: string): string;
  /** `export default function Demo() { return ( … ); }` */
  demo(body: string): string;
  /** Imports, then data declarations, then the body. */
  snippet(options: { imports?: string[]; decls?: string[]; body: string }): string;
  /** Pad every line of `text` by `spaces`. */
  indent(text: string, spaces: number): string;
}

/** What `usePlayground` hands back, and what `<Playground>` consumes. */
export interface PlaygroundHandle {
  config: PlaygroundConfig;
  state: PlaygroundState;
  set: (id: string, value: PlaygroundValue) => void;
  reset: () => void;
  /** Any value differs from its `default` — what lights the Reset button. */
  isDirty: boolean;
  /** Data source id → the value the preview is rendering right now. */
  data: Record<string, unknown>;
  /** `when` applied. */
  visibleFields: () => PlaygroundField[];
  /** Helpers bound to this state. */
  emitter: EmitHelpers;
}

/** What a page's `preview` component receives. A component, so it may use hooks. */
export interface PlaygroundPreviewProps {
  state: PlaygroundState;
  data: Record<string, unknown>;
  set: (id: string, value: PlaygroundValue) => void;
}

/** What a page's `code` receives. */
export interface PlaygroundCodeContext {
  state: PlaygroundState;
  data: Record<string, unknown>;
  h: EmitHelpers;
}

/** The page-level component's props. */
export interface PlaygroundProps {
  playground: PlaygroundHandle;
  /** The live demo. A component rather than a node, so it can call hooks. */
  preview: ComponentType<PlaygroundPreviewProps>;
  /** Default emission: the element to print. Ignored when `code` is given. */
  component?: { tag: string; imports?: string[] };
  /** Custom emission, for anything that is not one element. */
  code?: (context: PlaygroundCodeContext) => string;
  /** Code header. @default `<tag>.tsx` */
  filename?: string;
  /** The explanatory paragraph under the controls column. */
  hint?: ReactNode | ((state: PlaygroundState) => ReactNode);
  previewClassName?: string;
  hideBackgroundToggle?: boolean;
}
