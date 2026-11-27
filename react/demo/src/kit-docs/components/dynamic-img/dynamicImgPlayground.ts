import { createElement } from "react";
import type { ChangeEvent } from "react";
import { ColorSwatches, Textarea } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundCodeContext,
  PlaygroundConfig,
  PlaygroundState,
} from "../../shared/playground/schema";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";
import {
  ALT_EXAMPLE,
  FALLBACK_CHOICES,
  FALLBACK_DEFAULT,
  SAMPLES,
  SAMPLE_DEFAULT,
  SIZE_DEFAULT,
  TITLE_EXAMPLE,
  altText,
  fillText,
  hasAlt,
  hasFill,
  hasStroke,
  hasTitle,
  sampleId,
  showsFallback,
  sourceConst,
  sourceValue,
  strokeText,
  titleText,
  toneName,
  toneShows,
} from "./dynamicImgStage";

/** The 21 accents `TrueColor` accepts — the same list `tone` types (:37). */
export const TONE_OPTIONS = trueColorOptions;

const renderSwatches = (
  value: string,
  onSelect: (next: string) => void,
): ReturnType<typeof createElement> =>
  createElement(ColorSwatches, {
    selectable: true,
    size: "sm",
    defaultExpanded: true,
    // No tone is a real answer: `tone` is optional, and an SVG with its own
    // colours should keep them (:37,:67).
    value: value === "" ? undefined : (value as TrueColor),
    onSelect: (next: TrueColor) => onSelect(next),
  });

const renderSourceBox = (
  value: string,
  onChange: (next: string) => void,
): ReturnType<typeof createElement> =>
  createElement(Textarea, {
    rows: 6,
    value,
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value),
    placeholder: "…or paste your own <svg> markup, data URL, or anything else",
    className: "font-mono text-xs",
  });

/**
 * The Dynamic Image config. Field order *is* print order for the tag, and it
 * follows `DynamicImgProps` (:23-45): what to render, what to call it, then how
 * big and what colour. `customSource` and `glass` are workbench levers — they
 * own no prop and say nothing to the snippet.
 */
export const dynamicImgConfig: PlaygroundConfig = {
  groups: [
    { id: "source", title: "Source", defaultOpen: true },
    { id: "label", title: "Label", defaultOpen: true },
    { id: "paint", title: "Paint", defaultOpen: true },
    { id: "demo", title: "Workbench" },
  ],
  data: [],
  fields: [
    // ── Source ──────────────────────────────────────────────────────────────
    {
      id: "sample",
      group: "source",
      label: "Source",
      kind: "choice",
      prop: null,
      // Not a value of its own: the reader picked *which* string reaches `src`.
      // The constant it names is printed, never the string itself.
      emit: (_value, state) => {
        const name = sourceConst(state);
        return name === "" ? null : `src={${name}}`;
      },
      default: SAMPLE_DEFAULT,
      options: Object.entries(SAMPLES).map(([value, entry]) => ({
        value,
        label: entry.label,
      })),
    },
    // ── Label ───────────────────────────────────────────────────────────────
    {
      id: "alt",
      group: "label",
      label: "alt",
      kind: "text",
      prop: null,
      // Blank is a real answer — it is what makes the image decoration (:83) —
      // and whitespace is not a name, so the trimmed value is what counts.
      emit: (_value, state, h) => (hasAlt(state) ? `alt=${h.lit(altText(state))}` : null),
      default: "",
      placeholder: ALT_EXAMPLE,
    },
    {
      id: "fallbackIcon",
      group: "label",
      label: "fallbackIcon",
      kind: "choice",
      prop: "fallbackIcon",
      emit: (value, state, h) => {
        const name = typeof value === "string" ? value : FALLBACK_DEFAULT;
        // Nothing is rendering the placeholder, or the name is the default.
        if (!showsFallback(state) || name === FALLBACK_DEFAULT) return null;
        return `fallbackIcon=${h.lit(name)}`;
      },
      default: FALLBACK_DEFAULT,
      options: FALLBACK_CHOICES.map((name) => ({
        value: name,
        label: name === FALLBACK_DEFAULT ? `${name} (the default)` : name,
      })),
      // Only asked for when the placeholder is what actually paints (:85-88).
      when: showsFallback,
    },
    // ── Paint ───────────────────────────────────────────────────────────────
    {
      id: "size",
      group: "paint",
      label: "size",
      kind: "choice",
      prop: "size",
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
      options: controlSizeOptions,
    },
    {
      id: "tone",
      group: "paint",
      label: "tone",
      kind: "custom",
      prop: null,
      emit: (_value, state, h) =>
        toneShows(state) ? `tone=${h.lit(toneName(state))}` : null,
      default: "",
      render: ({ state, set }) =>
        renderSwatches(typeof state.tone === "string" ? state.tone : "", (next) =>
          set("tone", next),
        ),
    },
    {
      id: "fill",
      group: "paint",
      label: "fill",
      kind: "text",
      prop: null,
      emit: (_value, state, h) => (hasFill(state) ? `fill=${h.lit(fillText(state))}` : null),
      default: "",
      placeholder: "#f97316",
    },
    {
      id: "stroke",
      group: "paint",
      label: "stroke",
      kind: "text",
      prop: null,
      emit: (_value, state, h) =>
        hasStroke(state) ? `stroke=${h.lit(strokeText(state))}` : null,
      default: "",
      placeholder: "#0f172a",
    },
    {
      id: "colored",
      group: "paint",
      label: "colored — keep its own colours",
      kind: "toggle",
      prop: "colored",
      default: false,
    },
    // ── Meta ────────────────────────────────────────────────────────────────
    {
      id: "title",
      group: "label",
      label: "title",
      kind: "text",
      prop: null,
      emit: (_value, state, h) =>
        hasTitle(state) ? `title=${h.lit(titleText(state))}` : null,
      default: "",
      placeholder: TITLE_EXAMPLE,
    },
    // ── Workbench ───────────────────────────────────────────────────────────
    {
      id: "customSource",
      group: "source",
      label: "…or type a source of your own",
      kind: "custom",
      prop: null,
      // Whatever is typed becomes the value of the `src` constant, which the
      // `sample` field's emitter prints — one attribute, one owner.
      emit: () => null,
      default: "",
      render: ({ state, set }) =>
        renderSourceBox(
          typeof state.customSource === "string" ? state.customSource : "",
          (next) => set("customSource", next),
        ),
    },
    {
      id: "glass",
      group: "demo",
      label: "Show it on glass",
      kind: "toggle",
      prop: null,
      // Workbench chrome: an image has no opinion about its backdrop.
      emit: () => null,
      default: false,
    },
  ],
};

/** The comment that introduces the source constant, if there is one. */
const sourceComment = (state: PlaygroundState): string => {
  if (typeof state.customSource === "string" && state.customSource.trim() !== "") {
    return "// Pasted into the workbench: caller data, so the component sanitises it (:71-81).";
  }
  const note = SAMPLES[sampleId(state)].note;
  return `// ${SAMPLES[sampleId(state)].label}: ${note}`;
};

/** The declarations the snippet needs — one constant, holding the source. */
export const sourceDecls = (state: PlaygroundState): string[] => {
  const value = sourceValue(state);
  const name = sourceConst(state);
  if (value === "" || name === "") return [];
  return [sourceComment(state), `const ${name} = ${JSON.stringify(value)};`];
};

/** What the size control bought, in the rungs this component actually ships. */
export const sizeStory = (state: PlaygroundState): string => {
  const size = typeof state.size === "string" && state.size ? state.size : SIZE_DEFAULT;
  const px: Record<string, number> = { xs: 12, sm: 16, md: 24, lg: 32, xl: 40 };
  return `${size} here is ${px[size] ?? 24}px — the same names as CustomIcon's ladder, a different ladder: md agrees at 24px, xl does not (:9-15 vs CustomIcon.tsx:51-57). Both branches get it, which they did not use to (:99-101).`;
};

/** The snippet: one constant, one element, nothing invented around it. */
export const dynamicImgCode = ({ state, h }: PlaygroundCodeContext): string => {
  const body = h.element("DynamicImg", h.props(), 1);
  return h.snippet({
    imports: ["DynamicImg"],
    decls: sourceDecls(state),
    body: h.demo(body),
  });
};
