import { parseImageSource, sanitizeSvg } from "@cjlapao/ui-kit";
import type { PlaygroundState } from "../../shared/playground/schema";

/*
  Shared vocabulary for the Dynamic Image playground. A `.ts` file so the config
  can import it without JSX. The interesting half of this component is not its
  props but what it does to untrusted markup, so the questions the preview asks
  are asked of the *real* parser and the *real* sanitizer — the page reports
  what they did rather than what the copy claims.
*/

const svg = (inner: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`;

/** A 1×1 PNG, so the raster branch is a real image without shipping a file. */
const PIXEL_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const toDataUrl = (markup: string): string =>
  `data:image/svg+xml;base64,${btoa(markup)}`;

export type SampleId =
  | "filled"
  | "outline"
  | "gradient"
  | "dataUrl"
  | "raster"
  | "hostile"
  | "broken"
  | "none";

export interface Sample {
  /** What the control calls it. */
  label: string;
  /** The name the snippet gives the constant holding the value. */
  constName: string;
  /** The value handed to `src`. */
  value: string;
  /** Why this sample is in the set. */
  note: string;
}

/**
 * One sample per branch of the component: the two recolouring paths, the two
 * parsers, the sanitizer, and the two ways to have nothing to render.
 */
export const SAMPLES: Record<SampleId, Sample> = {
  filled: {
    label: "Filled shape",
    constName: "BADGE_SVG",
    value: svg('<circle cx="12" cy="12" r="10" fill="#2563eb" />'),
    note: "Its own fill is replaced, so it follows the tone (:75-80).",
  },
  outline: {
    label: "Outline only",
    constName: "PLUS_SVG",
    value: svg(
      '<path d="M4 12h16M12 4v16" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" />',
    ),
    note: "fill=\"none\" is left alone — recolouring it would turn an outline into a solid blob (:150-152,:211).",
  },
  gradient: {
    label: "Gradient",
    constName: "TILE_SVG",
    value: svg(
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e" /><stop offset="1" stop-color="#8b5cf6" /></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)" />',
    ),
    note: "Stops keep their colours (:208-210), but a paint is a paint: recoloured, the shape using url(#g) becomes a flat block. colored brings the gradient back (:77-78).",
  },
  dataUrl: {
    label: "Base64 SVG data URL",
    constName: "CHECK_DATA_URL",
    value: toDataUrl(
      svg('<path d="M5 13l4 4L19 7" fill="none" stroke="#16a34a" stroke-width="2" />'),
    ),
    note: "Decoded with atob, which throws on malformed input — guarded, or it took the tree down (:298-305).",
  },
  raster: {
    label: "Raster (PNG)",
    constName: "PIXEL_PNG",
    value: PIXEL_PNG,
    note: "Not SVG, so no sanitizer and no recolouring — an <img> with the size ladder applied (:90-105).",
  },
  hostile: {
    label: "Hostile SVG",
    constName: "HOSTILE_SVG",
    value: svg(
      '<script>alert("xss")</script><image href="https://evil.example/track.png" /><a href="javascript:alert(1)"><foreignObject><style>body{background:url("https://evil.example")}</style></foreignObject></a><circle onload="fetch(\'//evil.example\')" cx="12" cy="12" r="10" fill="#22c55e" />',
    ),
    note: "Everything that can execute, fetch or embed is gone before injection; the geometry that remains still paints (:17-42,:44-53,:168-171,:179-182).",
  },
  broken: {
    label: "Not an image",
    constName: "NOT_AN_IMAGE",
    value: "<p>Somebody saved HTML where an image belonged.</p>",
    note: "Neither raw markup nor a data URL, so parseImageSource returns null and the placeholder paints (:281-290,:85-88).",
  },
  none: {
    label: "Nothing at all",
    constName: "",
    value: "",
    note: "An empty src is the same story as a broken one — and the snippet drops the attribute (:64,:85-88).",
  },
};

export const SAMPLE_IDS = Object.keys(SAMPLES) as SampleId[];

/** The sample the playground opens on: the plainest recolouring case. */
export const SAMPLE_DEFAULT: SampleId = "filled";

/** The documented size default (:34-35). */
export const SIZE_DEFAULT = "md";

/** The documented fallback icon (:52). */
export const FALLBACK_DEFAULT = "Image";

/** Icon names the control offers for the placeholder. */
export const FALLBACK_CHOICES = ["Image", "Warning", "Search", "Trash"] as const;

/** Example `alt` text. */
export const ALT_EXAMPLE = "Quarterly report";

/** Example tooltip text. */
export const TITLE_EXAMPLE = "Quarterly report, updated today";

/** Example raw colours. */
export const FILL_EXAMPLE = "#f97316";
export const STROKE_EXAMPLE = "#0f172a";

/** The classes the stage row wears — also the test selector. */
export const STAGE_CLASS = "flex w-full max-w-md flex-col items-start gap-4";

/** A trimmed text-field value, or "" when nothing was typed. */
export const textValue = (state: PlaygroundState, id: string): string =>
  typeof state[id] === "string" ? (state[id] as string).trim() : "";

export const sampleId = (state: PlaygroundState): SampleId => {
  const raw = state.sample;
  return typeof raw === "string" && raw in SAMPLES ? (raw as SampleId) : SAMPLE_DEFAULT;
};

export const sample = (state: PlaygroundState): Sample => SAMPLES[sampleId(state)];

/** True while the reader has typed their own source into the workbench. */
export const hasCustomSource = (state: PlaygroundState): boolean =>
  textValue(state, "customSource") !== "";

/** What actually reaches `src`: the typed markup, or the chosen sample. */
export const sourceValue = (state: PlaygroundState): string =>
  hasCustomSource(state) ? textValue(state, "customSource") : sample(state).value;

/** The constant the snippet names, or "" when there is no source to declare. */
export const sourceConst = (state: PlaygroundState): string =>
  sourceValue(state) === "" ? "" : hasCustomSource(state) ? "SOURCE" : sample(state).constName;

export const altText = (state: PlaygroundState): string => textValue(state, "alt");
export const hasAlt = (state: PlaygroundState): boolean => altText(state) !== "";
/** The component's own rule: no name means decoration (:83). */
export const isDecorative = (state: PlaygroundState): boolean => !hasAlt(state);

export const titleText = (state: PlaygroundState): string => textValue(state, "title");
export const hasTitle = (state: PlaygroundState): boolean => titleText(state) !== "";

export const toneName = (state: PlaygroundState): string =>
  typeof state.tone === "string" ? state.tone : "";

export const isColored = (state: PlaygroundState): boolean => state.colored === true;

export const fillText = (state: PlaygroundState): string => textValue(state, "fill");
export const hasFill = (state: PlaygroundState): boolean => fillText(state) !== "";

export const strokeText = (state: PlaygroundState): string => textValue(state, "stroke");
export const hasStroke = (state: PlaygroundState): boolean => strokeText(state) !== "";

export const sizeValue = (state: PlaygroundState): string =>
  typeof state.size === "string" && state.size ? state.size : SIZE_DEFAULT;

export const fallbackIconValue = (state: PlaygroundState): string => {
  const raw = state.fallbackIcon;
  return typeof raw === "string" && raw ? raw : FALLBACK_DEFAULT;
};

/**
 * Whether a `tone` can be seen: the component only paints the tone class when
 * neither `colored` nor a raw `fill` is in play (:67).
 */
export const toneShows = (state: PlaygroundState): boolean =>
  hasTone(state) && !isColored(state) && !hasFill(state);

export const hasTone = (state: PlaygroundState): boolean => toneName(state) !== "";

/** The options the component would hand the sanitizer (:75-80). */
export const recolourOptions = (
  state: PlaygroundState,
): Record<string, string> =>
  isColored(state)
    ? {}
    : {
        fill: fillText(state) || "currentColor",
        stroke: strokeText(state) || "currentColor",
      };

/** The sanitizer's real answer for the current source and recolouring. */
export const sanitizedMarkup = (state: PlaygroundState): string | null => {
  const parsed = parseImageSource(sourceValue(state));
  if (!parsed || parsed.kind !== "svg" || !parsed.markup) return null;
  return sanitizeSvg(parsed.markup, recolourOptions(state));
};

export type SourceKind = "svg" | "raster" | "rejected";

/** Which branch of the component the current source takes. */
export const sourceKind = (state: PlaygroundState): SourceKind => {
  const parsed = parseImageSource(sourceValue(state));
  if (!parsed) return "rejected";
  if (parsed.kind === "raster") return "raster";
  return sanitizedMarkup(state) ? "svg" : "rejected";
};

/** True when the placeholder is what paints (:85-88). */
export const showsFallback = (state: PlaygroundState): boolean =>
  sourceKind(state) === "rejected";

const TAGS = /<([a-zA-Z][a-zA-Z0-9:-]*)/g;

const tagsIn = (markup: string): string[] => {
  const names = new Set<string>();
  let match: RegExpExecArray | null;
  TAGS.lastIndex = 0;
  while ((match = TAGS.exec(markup)) !== null) names.add(match[1]);
  return [...names];
};

export interface SanitizerReport {
  /** Elements the rebuilt document still contains. */
  readonly kept: string[];
  /** Elements the allowlist removed. */
  readonly dropped: string[];
  /** `on*` attributes that were removed wholesale (:179-182). */
  readonly droppedAttributes: string[];
}

/**
 * What the allowlist did to this source, measured by asking it — never by
 * repeating a list the copy happens to like.
 */
export const sanitizerReport = (state: PlaygroundState): SanitizerReport => {
  const parsed = parseImageSource(sourceValue(state));
  const markup = parsed?.kind === "svg" ? (parsed.markup ?? "") : "";
  const kept = sanitizedMarkup(state) ?? "";
  const keptTags = tagsIn(kept);
  const before = tagsIn(markup);
  const handlers = new Set<string>();
  for (const match of markup.matchAll(/\s(on[a-z]+)\s*=/gi)) {
    handlers.add(match[1].toLowerCase());
  }
  return {
    kept: keptTags,
    dropped: before.filter((name) => !keptTags.includes(name)),
    droppedAttributes: [...handlers],
  };
};

/** The stage's first line: what the parser made of the source. */
export const kindCaption = (state: PlaygroundState): string => {
  const kind = sourceKind(state);
  if (kind === "raster") {
    return "A raster data URL: an <img> with the size ladder on it. No sanitizer runs — the bytes are a PNG's own business, and so is their colour (:90-105).";
  }
  if (kind === "rejected") {
    const name = fallbackIconValue(state);
    return parseImageSource(sourceValue(state)) === null
      ? `Nothing to render: no raw markup and no data URL, so parseImageSource returned null (:281,:290) and ${name} paints instead. Rejected input is never rendered raw (:85-88).`
      : `Nothing to render: the parser found SVG, the allowlist could not rebuild it, and a sanitizer that answers null means the placeholder — never the original string (:237-259,:85-88) — so ${name} paints instead.`;
  }
  const report = sanitizerReport(state);
  return `Parsed as SVG (:285-287), rebuilt element by element from the allowlist, then injected (:71-81,:128). Kept: ${
    report.kept.join(", ") || "nothing"
  }.`;
};

/** The stage's second line: what the allowlist removed, if anything. */
export const droppedCaption = (state: PlaygroundState): string | null => {
  const report = sanitizerReport(state);
  if (report.dropped.length === 0 && report.droppedAttributes.length === 0) {
    return null;
  }
  const parts = [
    report.dropped.length
      ? `dropped ${report.dropped.length} element${
          report.dropped.length === 1 ? "" : "s"
        } (${report.dropped.join(", ")})`
      : "",
    report.droppedAttributes.length
      ? `dropped ${report.droppedAttributes.length} attribute${
          report.droppedAttributes.length === 1 ? "" : "s"
        } (${report.droppedAttributes.join(", ")})`
      : "",
  ].filter(Boolean);
  return `The allowlist fails closed: ${parts.join(", ")}, because anything not named in it is discarded rather than passed through (:11-13,:168-171,:179-182).`;
};

/** The stage's third line: what happened to the colours. */
export const recolourCaption = (state: PlaygroundState): string => {
  if (sourceKind(state) !== "svg") {
    return "Recolouring is an SVG affair; there is no markup to paint here (:71-81).";
  }
  if (isColored(state)) {
    return "colored is on, so the sanitizer was handed no options at all and the drawing kept every colour it arrived with (:77-78).";
  }
  const parts = [
    hasFill(state) ? `fill → ${fillText(state)}` : "",
    hasStroke(state) ? `stroke → ${strokeText(state)}` : "",
    !hasFill(state) && !hasStroke(state) ? "fill and stroke → currentColor" : "",
  ].filter(Boolean);
  const tone = toneShows(state)
    ? ` The wrapper carries text-${toneName(state)}-500 dark:text-${
        toneName(state)
      }-400, and currentColor picks it up (:67,:118).`
    : hasTone(state)
      ? ` tone is set but invisible here: a raw fill (or colored) wins, so the tone class is never applied at all (:67).`
      : "";
  return `Recoloured on the way in: ${parts.join(", ")} — except fill="none" and gradient stops, and only on shapes that already declare the attribute (:75-80,:150-152,:208-221).${tone}`;
};

/** The stage's fourth line: what an assistive technology is told. */
export const a11yCaption = (state: PlaygroundState): string => {
  if (showsFallback(state)) {
    return `The placeholder is decoration by construction: renderIcon hands ${fallbackIconValue(
      state,
    )} to CustomIcon, which marks it aria-hidden (:63,:87 → CustomIcon.tsx:131).`;
  }
  const tooltip = hasTitle(state)
    ? ` title goes on whichever element rendered (:98,:122) as a native tooltip — a hover-only affordance on an element that takes no tab stop, so it can never carry anything a reader needs.`
    : "";
  if (isDecorative(state)) {
    return `No alt, so this is decoration: aria-hidden on the element that rendered (:97,:125). Whatever <title> the SVG itself carried is the only thing a reader may still announce — <title> is on the element allowlist (:23).${tooltip}`;
  }
  return `Named: alt "${altText(
    state,
  )}" becomes aria-label on a role="img" span, or the alt of the <img> on the raster branch (:96,:123-124).${tooltip}`;
};
