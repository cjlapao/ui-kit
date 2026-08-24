/**
 * Conservative SVG sanitiser.
 *
 * `DynamicImg` injects caller-supplied SVG with `dangerouslySetInnerHTML` /
 * `v-html`. SVG is not an inert image format — it can carry `<script>`, `on*`
 * event attributes, `<foreignObject>` holding arbitrary HTML, SMIL animations
 * that set event handlers, and `<image>`/`href` pointing at a remote URL. A
 * "dynamic image" is by definition data the app did not author, so every one
 * of those is a live stored-XSS or exfiltration vector.
 *
 * This walks the parsed document and rebuilds it from an allowlist: anything
 * not named here is dropped. An allowlist fails closed — an unknown element or
 * attribute is discarded rather than passed through.
 */

/** Elements that only describe geometry, paint or structure. */
const ALLOWED_ELEMENTS = new Set([
  "svg",
  "g",
  "defs",
  "symbol",
  "use",
  "title",
  "desc",
  "path",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "rect",
  "linearGradient",
  "radialGradient",
  "stop",
  "clipPath",
  "mask",
  "pattern",
  "marker",
  "text",
  "tspan",
  "textPath",
]);

/**
 * Never allowed, and worth naming so the reason is on the record:
 * - `script`        — arbitrary JS
 * - `foreignObject` — arbitrary HTML, including `<script>`
 * - `a`             — `javascript:` targets
 * - `style`         — CSS can carry `url()` and `@import`
 * - `image`         — fetches a remote URL, leaking that the SVG rendered
 * - `animate*`/`set` — SMIL can animate an attribute into an event handler
 * - `iframe`/`embed`/`object`/`handler` — obvious
 */

/** Attributes safe on any element. Anything else is dropped. */
const ALLOWED_ATTRIBUTES = new Set([
  // structure
  "id",
  "class",
  "viewBox",
  "xmlns",
  "version",
  "preserveAspectRatio",
  "transform",
  "gradientTransform",
  "patternTransform",
  // geometry
  "d",
  "pathLength",
  "points",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "fx",
  "fy",
  "dx",
  "dy",
  "width",
  "height",
  "offset",
  "rotate",
  // paint
  "fill",
  "fill-opacity",
  "fill-rule",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-opacity",
  "stroke-miterlimit",
  "stop-color",
  "stop-opacity",
  "opacity",
  "color",
  "paint-order",
  "vector-effect",
  // units and references that stay inside the document
  "gradientUnits",
  "patternUnits",
  "patternContentUnits",
  "clipPathUnits",
  "maskUnits",
  "maskContentUnits",
  "markerUnits",
  "markerWidth",
  "markerHeight",
  "refX",
  "refY",
  "orient",
  "spreadMethod",
  "clip-path",
  "clip-rule",
  "mask",
  "display",
  "visibility",
  "overflow",
  // text
  "text-anchor",
  "dominant-baseline",
  "alignment-baseline",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "letter-spacing",
  "word-spacing",
  "writing-mode",
  "xml:space",
]);

/** Only same-document references survive — never a URL. */
const REFERENCE_ATTRIBUTES = new Set(["href", "xlink:href"]);

/** A `style` value carrying any of these is dropped wholesale. */
const UNSAFE_STYLE = /url\s*\(|expression\s*\(|javascript:|@import/i;

export interface SanitizeSvgOptions {
  /**
   * Replaces every fill that is not `none`. `none` is left alone — recolouring
   * it turns an outline-only shape into a solid blob.
   */
  fill?: string;
  /** Replaces every stroke that is not `none`. */
  stroke?: string;
}

const isAllowedReference = (value: string): boolean =>
  value.trim().startsWith("#");

const sanitizeElement = (
  element: Element,
  options: SanitizeSvgOptions,
): void => {
  // `localName` ignores any namespace prefix, so `<svg:script>` cannot slip by.
  const name = element.localName;

  if (!ALLOWED_ELEMENTS.has(name)) {
    element.remove();
    return;
  }

  for (const attribute of [...element.attributes]) {
    const attributeName = attribute.name;
    const lower = attributeName.toLowerCase();
    const value = attribute.value;

    // Every event handler, in one rule, before any allowlist lookup.
    if (lower.startsWith("on")) {
      element.removeAttribute(attributeName);
      continue;
    }

    if (REFERENCE_ATTRIBUTES.has(lower)) {
      if (!isAllowedReference(value)) element.removeAttribute(attributeName);
      continue;
    }

    if (lower === "style") {
      if (UNSAFE_STYLE.test(value)) element.removeAttribute(attributeName);
      continue;
    }

    // `xmlns:*` declarations are inert and needed for the document to parse.
    if (lower.startsWith("xmlns")) continue;

    if (!ALLOWED_ATTRIBUTES.has(attributeName)) {
      element.removeAttribute(attributeName);
      continue;
    }

    // A `url(...)` in a paint attribute may point outside the document.
    if (/url\s*\(/i.test(value) && !/url\s*\(\s*['"]?#/i.test(value)) {
      element.removeAttribute(attributeName);
    }
  }

  // Gradient stops keep their own colours — recolouring them collapses a
  // gradient to a flat block.
  if (name !== "stop") {
    if (options.fill && element.getAttribute("fill") !== "none") {
      if (element.hasAttribute("fill")) {
        element.setAttribute("fill", options.fill);
      }
    }
    if (options.stroke && element.getAttribute("stroke") !== "none") {
      if (element.hasAttribute("stroke")) {
        element.setAttribute("stroke", options.stroke);
      }
    }
  }

  for (const child of [...element.children]) {
    sanitizeElement(child, options);
  }
};

/**
 * Returns sanitised `<svg>` markup, or `null` when the input is not an SVG or
 * cannot be parsed. Callers must treat `null` as "show the fallback" — never
 * as "render the original".
 */
export const sanitizeSvg = (
  markup: string,
  options: SanitizeSvgOptions = {},
): string | null => {
  if (!markup || typeof markup !== "string") return null;
  // No DOMParser during SSR. Refusing is the safe answer: the caller falls
  // back to an inert `<img>` or a placeholder icon.
  if (typeof DOMParser === "undefined") return null;

  let root: Element | null = null;
  try {
    const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
    if (parsed.getElementsByTagName("parsererror").length > 0) return null;
    root = parsed.documentElement;
  } catch {
    return null;
  }

  if (!root || root.localName !== "svg") return null;

  sanitizeElement(root, options);

  // `sanitizeElement` may have removed the root itself.
  if (!root.isConnected && root.localName !== "svg") return null;

  const serialised = new XMLSerializer().serializeToString(root);
  return serialised.trim().startsWith("<svg") ? serialised : null;
};

/** Data URLs this component knows how to render. */
const DATA_URL = /^data:image\/(svg\+xml|png|jpeg|jpg|gif|webp|avif|bmp)\s*(;[^,]*)?,/i;

export interface ParsedImageSource {
  kind: "svg" | "raster";
  /** The original data URL, for the raster case. */
  src: string;
  /** Decoded markup, for the SVG case. */
  markup?: string;
}

/**
 * Works out what a caller handed over: a raster data URL, an SVG data URL
 * (base64 or URL-encoded), or raw `<svg>` markup.
 *
 * The old check was `base64.includes("data:image/png;base64,")` — `includes`,
 * not `startsWith`, so the marker only had to appear *somewhere* in the string.
 */
export const parseImageSource = (value: string): ParsedImageSource | null => {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();

  if (trimmed.startsWith("<svg") || trimmed.startsWith("<?xml")) {
    return { kind: "svg", src: trimmed, markup: trimmed };
  }

  const match = DATA_URL.exec(trimmed);
  if (!match) return null;

  const isSvg = match[1].toLowerCase() === "svg+xml";
  if (!isSvg) return { kind: "raster", src: trimmed };

  const payload = trimmed.slice(match[0].length);
  const isBase64 = (match[2] ?? "").toLowerCase().includes("base64");

  try {
    // `atob` throws on malformed input; unguarded it took the whole render
    // tree down rather than showing a placeholder.
    const markup = isBase64 ? atob(payload) : decodeURIComponent(payload);
    return { kind: "svg", src: trimmed, markup };
  } catch {
    return null;
  }
};
