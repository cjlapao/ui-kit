import { createElement } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundState,
} from "../../shared/playground/schema";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";
import {
  ALT_EXAMPLE,
  BATCH_DEFAULT,
  GLYPH_NAMES,
  MISSING_EXAMPLE,
  SIZE_DEFAULT,
  textValue,
  TARGET_DEFAULT,
  batchCount,
  batchNames,
  glyphComponent,
  hasAlt,
  hasTone,
  isStacked,
  isOverride,
  isAfterPaint,
  needsOverride,
  sizeValue,
  stackedGlyph,
  target,
} from "./iconsRegistryStage";

/** The 21 accents `TrueColor` accepts — the same list `tone` types. */
export const TONE_OPTIONS = trueColorOptions;

const renderSwatches = (
  value: string,
  onSelect: (next: string) => void,
): ReturnType<typeof createElement> =>
  createElement(ColorSwatches, {
    selectable: true,
    size: "sm",
    defaultExpanded: true,
    // No tone is a real answer — `value` is optional precisely so a picker can
    // start with nothing selected and the glyph keeps its inherited colour.
    value: value === "" ? undefined : (value as TrueColor),
    onSelect: (next: TrueColor) => onSelect(next),
  });

/**
 * The Icon Registry config. It drives a workbench, not a component: the four
 * registry levers decide what gets registered and when, the last four are the
 * props of the `<CustomIcon>` that resolves the result. Field order *is* print
 * order for the tag, so the registry levers — which emit nothing onto it — come
 * first and the tag attributes follow the order `CustomIconProps` declares them.
 */
export const iconsRegistryConfig: PlaygroundConfig = {
  groups: [
    { id: "registry", title: "Register", defaultOpen: true },
    { id: "resolve", title: "Resolve", defaultOpen: true },
    { id: "preview", title: "Preview" },
  ],
  data: [],
  fields: [
    // ── Register ────────────────────────────────────────────────────────────
    {
      id: "batch",
      group: "registry",
      label: "Glyphs in the batch (:40)",
      kind: "number",
      prop: null,
      // Not a prop of anything — it is how many entries the reader puts in the
      // one call, so the emitter prints it into the `registerIcons` decl instead.
      emit: () => null,
      default: BATCH_DEFAULT,
      min: 0,
      max: GLYPH_NAMES.length,
      step: 1,
    },
    {
      id: "stack",
      group: "registry",
      label: "Claim the target name too (:26,:50)",
      kind: "toggle",
      prop: null,
      emit: () => null,
      default: false,
    },
    {
      id: "override",
      group: "registry",
      label: "{ override: true } (:38,:44)",
      kind: "toggle",
      prop: null,
      emit: () => null,
      default: false,
      // Only shown where the registry would otherwise say "already registered":
      // a name the generated registry owns, or a name the first call just took.
      when: needsOverride,
    },
    {
      id: "afterPaint",
      group: "registry",
      label: "Register after first paint (:12-15,:78)",
      kind: "toggle",
      prop: null,
      emit: () => null,
      default: false,
    },
    // ── Resolve ─────────────────────────────────────────────────────────────
    {
      id: "target",
      group: "resolve",
      label: "Resolve this name (:24-28)",
      kind: "choice",
      prop: null,
      // Always printed: `icon` has no default to fall back to (:14), and which
      // map answers for it is the whole subject of this page.
      emit: (value, _state, h) => `icon=${h.lit(String(value))}`,
      default: TARGET_DEFAULT,
      options: [
        { value: "Pulse", label: "Pulse — a registered glyph" },
        { value: "Ring", label: "Ring — maybe registered" },
        { value: "Bars", label: "Bars — maybe registered" },
        { value: "Star", label: "Star — a built-in" },
        { value: MISSING_EXAMPLE, label: "Unicorn — nobody owns it" },
      ],
    },
    // ── Preview ─────────────────────────────────────────────────────────────
    {
      id: "alt",
      group: "preview",
      label: "alt (:20,:125-128)",
      kind: "text",
      prop: null,
      // Only printed once there is a name to print — an empty `alt` is how you
      // say "decoration", and the component drops `role` with it (:125-128).
      emit: (value, state) =>
        hasAlt(state) ? `alt=${JSON.stringify(String(value).trim())}` : null,
      default: "",
      placeholder: ALT_EXAMPLE,
    },
    {
      id: "size",
      group: "preview",
      label: "Size (:24,:51-57,:105-106)",
      kind: "choice",
      prop: "size",
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
      options: controlSizeOptions,
    },
    {
      id: "tone",
      group: "preview",
      label: "Tone (:26,:108-111)",
      kind: "custom",
      prop: null,
      // `tone` has no documented default, and an empty swatch strip must print
      // nothing — `emit` owns this attribute outright.
      emit: (value, state, h) =>
        hasTone(state) ? `tone=${h.lit(value)}` : null,
      default: "",
      render: ({ state, set }) =>
        renderSwatches(textValue(state, "tone"), (next) => set("tone", next)),
    },
  ],
};

/**
 * The `registerIcons` calls the workbench is making, written the way a consumer
 * writes them. One call per registration; a stack is a second call, never a
 * second argument — `{ override: true }` is per call, not per entry (:38).
 */
export const registryDecls = (state: PlaygroundState): string[] => {
  const decls: string[] = [];
  const names = batchNames(state);
  const options = isOverride(state) ? ", { override: true }" : "";
  if (isAfterPaint(state)) {
    decls.push(
      "// Deferred, so the mounted icons repaint when the batch lands (:12-15,:78).",
    );
  } else {
    decls.push("// Once, at app startup — before the first render (:31-33).");
  }
  if (names.length === 0) {
    decls.push("registerIcons({}); // an empty batch notifies nobody (:53)");
    return decls;
  }
  const entries = names.map((name) => `${name}: ${glyphComponent(name)}`);
  decls.push(
    `registerIcons({ ${entries.join(", ")} }${options});`,
  );
  if (isStacked(state)) {
    const glyph = stackedGlyph(state);
    decls.push("");
    decls.push(
      `// The newest registration for a name is the one that paints (:26,:50);`,
      `// cleanup of this call hands ${target(state)} back to the one underneath (:60-62).`,
    );
    decls.push(
      `registerIcons({ ${target(state)}: ${glyphComponent(glyph)} }${
        isOverride(state) ? ", { override: true }" : ""
      });`,
    );
  }
  return decls;
};

/**
 * The consumer components the emitted code refers to, in the order they appear in
 * the import line. Only what is actually used: a batch of one should not import the
 * other two glyphs, and a stack that reuses a glyph must not import it twice.
 */
export const usedGlyphComponents = (state: PlaygroundState): string[] => {
  const names = [...batchNames(state)];
  if (isStacked(state)) names.push(stackedGlyph(state));
  const seen = new Set<string>();
  for (const name of names) seen.add(glyphComponent(name));
  return [...seen].sort((a, b) => (a < b ? -1 : 1));
};

/** One sentence under the preview about the size the reader picked. */
export const sizeStory = (state: PlaygroundState): string => {
  const size = sizeValue(state);
  const px = { xs: 16, sm: 20, md: 24, lg: 28, xl: 32 }[size] ?? 24;
  return `The preview sits on the ${size} rung — ${px}px from a Tailwind class, not an inline width (:51-57,:105-106).`;
};

/** The stage's own summary line, so the preview and the tests say the same thing. */
export const stageCaption = (state: PlaygroundState): string =>
  isStacked(state)
    ? `${batchCount(state)} glyph${
        batchCount(state) === 1 ? "" : "s"
      } registered, then ${stackedGlyph(state)} registered over ${target(
        state,
      )}${isOverride(state) ? " with { override: true }" : " — which the registry refuses"}.`
    : `Resolving ${target(state)}${
        isAfterPaint(state) ? " after first paint" : " from startup"
      }.`;
