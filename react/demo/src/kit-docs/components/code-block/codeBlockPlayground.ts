import { createElement } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { MultiToggleOption, SurfaceTone, TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
} from "../../shared/playground/schema";
import { ChoiceControl } from "../../shared/PlaygroundPanel";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import { panelCornerOptions, surfaceVariantOptions } from "../../shared/options";
import {
  DEFAULT_SAMPLE,
  hasHandler,
  isEditable,
  SAMPLE_LABELS,
  SAMPLE_ORDER,
  SAMPLES,
  sampleId,
  sourceText,
} from "./codeBlockStage";

/**
 * Code Block's controls.
 *
 * Three of these props are about *whether a prop exists* rather than what it
 * holds, and each gets a printing rule that says so:
 *
 *   - `readOnly` is the component's own `true` (:76), so the snippet only ever
 *     prints `readOnly={false}` — the flip that swaps the highlighted `<pre>` for
 *     a native textarea (:129-137).
 *   - `onChange` is gated on that flip. A handler on a read-only block is a prop
 *     nothing ever calls: the display branch renders a `<pre>` (:130) and the only
 *     call site is the textarea's `onChange` (:135). So it is a two-way choice that
 *     disappears entirely while the block is read-only, and it prints a named
 *     `handleChange` rather than an inline arrow the reader would copy blind.
 *   - `editorLabel` is the same story: meaningful only in the editor branch, where
 *     it replaces the localized default (:135).
 *
 * `language` always prints when filled in, because there is no default to compare
 * against (:19) and its presence is the difference between a highlighted block and
 * a verbatim one (:89-96).
 */

/*
 * `MultiToggleOption`'s members are all optional and its `label` is a ReactNode,
 * while `PlaygroundOption` requires both and narrows `label` to a string — so the
 * shared lists arrive as the loose shape and leave as the strict one.
 */
const options = (list: readonly MultiToggleOption[]): PlaygroundOption[] =>
  list as unknown as PlaygroundOption[];

const SAMPLE_CHOICES = options(
  SAMPLE_ORDER.map((id) => ({ label: SAMPLE_LABELS[id], value: id })),
);

/** The fixture, as a template literal that keeps the trailing newline. */
const literal = (text: string): string => `\`${text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\``;

export const codeBlockConfig: PlaygroundConfig = {
  groups: [
    { id: "source", title: "Source", defaultOpen: true },
    { id: "chrome", title: "Header", defaultOpen: true },
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "editing", title: "Editing", defaultOpen: true },
  ],
  fields: [
    // ── What is displayed, and how. ──────────────────────────────────────────
    {
      // The sample is not a prop: it is the decision that fills `value`,
      // `language` and `filename` in one move, the way the legacy playground's
      // language picker loaded a new fixture.
      id: "sample",
      label: "Sample",
      group: "source",
      kind: "custom",
      prop: null,
      default: DEFAULT_SAMPLE,
      render: ({ state, set }) =>
        createElement(ChoiceControl, {
          label: "Sample",
          options: SAMPLE_CHOICES,
          value: sampleId(state),
          onChange: (next: string) => {
            const loaded = SAMPLES[next] ?? SAMPLES[DEFAULT_SAMPLE];
            set("sample", next);
            set("language", loaded.language);
            set("filename", loaded.filename);
            // A new fixture discards whatever was typed into the editor.
            set("edited", false);
            set("draft", "");
          },
        }),
    },
    {
      id: "language",
      label: "Language",
      group: "source",
      kind: "text",
      prop: "language",
      // The grammar name is lowercased before refractor is asked (:92), and a
      // name it has never heard throws — the catch paints the source verbatim
      // (:93-95), exactly like asking for a grammar with no tokens at all.
      default: SAMPLES[DEFAULT_SAMPLE].language,
      emit: (value, _state, h) =>
        String(value).trim() === "" ? null : `language=${h.lit(String(value))}`,
    },
    {
      id: "filename",
      label: "Filename",
      group: "source",
      kind: "text",
      prop: "filename",
      // Names the header *and* the region's accessible name (:116,:127); the
      // fallbacks are the language, then the localized "Code".
      default: SAMPLES[DEFAULT_SAMPLE].filename,
      emit: (value, _state, h) =>
        String(value).trim() === "" ? null : `filename=${h.lit(String(value))}`,
    },
    {
      id: "showLineNumbers",
      label: "Line numbers",
      group: "source",
      kind: "toggle",
      prop: "showLineNumbers",
      // Display mode only (:25-26): the gutter is CSS content, `aria-hidden`, and
      // never part of the copied source (:66, CodeBlock.css:29-30).
      default: false,
    },
    {
      id: "wrapLines",
      label: "Wrap lines",
      group: "source",
      kind: "toggle",
      prop: "wrapLines",
      // `pre-wrap` + `overflow-wrap: anywhere` in display (:130) and
      // `wrap="soft"` in the editor (:135); the `[data-wrap]` rules then let the
      // code shrink instead of scrolling sideways (CodeBlock.css:27,:33).
      default: false,
    },
    {
      id: "maxHeight",
      label: "Max height",
      group: "source",
      kind: "choice",
      prop: "maxHeight",
      // Absent means the block is as tall as its source (:124).
      default: "auto",
      options: options([
        { label: "Auto", value: "auto" },
        { label: "240 px", value: "240" },
        { label: "320 px", value: "320" },
        { label: "480 px", value: "480" },
      ]),
      emit: (value) =>
        value === "auto" ? null : `maxHeight={${Number(value)}}`,
    },

    // ── The header, which is really the copy button's row. ───────────────────
    {
      id: "showTitle",
      label: "Show title",
      group: "chrome",
      kind: "toggle",
      prop: "showTitle",
      // Off keeps the copy button and drops the label and the hairline (:115).
      default: true,
    },
    {
      id: "showCopy",
      label: "Show copy",
      group: "chrome",
      kind: "toggle",
      prop: "showCopy",
      // With both off there is no header row at all (:114).
      default: true,
    },

    // ── The Panel the whole thing is wrapped in. ─────────────────────────────
    {
      id: "tone",
      label: "Tone",
      group: "surface",
      kind: "custom",
      prop: "tone",
      // `none` is the component's own answer (:76) — an untinted card whose copy
      // button is still coloured by `color`.
      default: "none",
      emit: (value) => (value === "none" ? null : `tone=${JSON.stringify(value)}`),
      render: ({ state, set }) =>
        createElement(SurfaceToneSwatches, {
          value: String(state.tone ?? "none") as SurfaceTone,
          onSelect: (next: SurfaceTone) => set("tone", next),
        }),
    },
    {
      id: "variant",
      label: "Variant",
      group: "surface",
      kind: "choice",
      prop: "variant",
      default: "subtle",
      options: options(surfaceVariantOptions),
    },
    {
      id: "corner",
      label: "Corner",
      group: "surface",
      kind: "choice",
      prop: "corner",
      default: "rounded-md",
      options: options(panelCornerOptions),
    },
    {
      id: "color",
      label: "Copy colour",
      group: "surface",
      kind: "custom",
      prop: "color",
      // The copy button's accent (:117) — deliberately separate from `tone`, so
      // an untinted card can still have a blue action.
      default: "blue",
      render: ({ state, set }) =>
        createElement(ColorSwatches, {
          selectable: true,
          size: "sm",
          defaultExpanded: true,
          value: String(state.color ?? "blue") as TrueColor,
          onSelect: (next: TrueColor) => set("color", next),
        }),
    },
    {
      id: "raisedSurface",
      label: "Raised surface",
      group: "surface",
      kind: "toggle",
      prop: "raisedSurface",
      // Forwarded to the body Panel (:113): the forced first nesting step that
      // keeps a card tinted the same colour as its page readable.
      default: false,
    },

    // ── The editor branch. ───────────────────────────────────────────────────
    {
      id: "readOnly",
      label: "Read only",
      group: "editing",
      kind: "toggle",
      prop: "readOnly",
      // The display branch (:129-130) versus the textarea plus its sizing mirror
      // (:131-137). Only the `false` flip is ever printed.
      default: true,
    },
    {
      id: "onChange",
      label: "onChange",
      group: "editing",
      kind: "choice",
      prop: "onChange",
      // Without it the textarea is frozen: `value` is still controlled (:135), so
      // typing changes nothing and React says so in the console.
      default: "handler",
      options: options([
        { label: "A handler", value: "handler" },
        { label: "Omitted", value: "none" },
      ]),
      emit: (_value, state) =>
        hasHandler(state) ? "onChange={handleChange}" : null,
      when: (state) => isEditable(state),
    },
    {
      id: "editorLabel",
      label: "Editor label",
      group: "editing",
      kind: "text",
      prop: "editorLabel",
      // Replaces the localized `kit.codeBlock.edit` name on the textarea (:135).
      default: "Change the theme colour",
      emit: (value, _state, h) =>
        String(value).trim() === "" ? null : `editorLabel=${h.lit(String(value))}`,
      when: (state) => isEditable(state),
    },
  ],
  data: [
    {
      id: "source",
      prop: "value",
      label: "The source being displayed",
      // Must stay state-independent: the emitter prints it as one comment.
      note: "Copied verbatim by the copy button (:101), trailing newline included.",
      constName: "SOURCE",
      emit: "source",
      value: (state) => sourceText(state),
      source: (state) => literal(sourceText(state)),
    },
  ],
};
