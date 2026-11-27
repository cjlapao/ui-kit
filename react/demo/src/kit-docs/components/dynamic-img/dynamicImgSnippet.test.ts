import { describe, expect, it } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { dynamicImgCode, dynamicImgConfig } from "./dynamicImgPlayground";
import { DYNAMIC_IMG_PROPS } from "./DynamicImgPage";
import {
  ALT_EXAMPLE,
  FALLBACK_DEFAULT,
  SAMPLES,
  SAMPLE_IDS,
  SIZE_DEFAULT,
  STROKE_EXAMPLE,
  TITLE_EXAMPLE,
} from "./dynamicImgStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a value the app did not author, so it is
 * tested as a claim: at rest one `<DynamicImg>` is handed one thing — the source —
 * every attribute on it is a row of this page's own table, the source lives in a
 * constant rather than inlined into the tag, and none of the machinery the page
 * insists belongs to the component (`aria-hidden`, the size classes, the tone class,
 * `dangerouslySetInnerHTML`) ever reaches the code a reader is handed.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of dynamicImgConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(dynamicImgConfig, state);
  return dynamicImgCode({ state, data: {}, h });
};

/** The `<DynamicImg …>` tag itself, so the wrapper's markup cannot read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<DynamicImg");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<DynamicImg".length;
  let depth = 0;
  for (let index = head; index < tag.length; index += 1) {
    const char = tag[index];
    if (char === "{") depth += 1;
    else if (char === "}") depth -= 1;
    else if (char === ">" && depth === 0) return tag.slice(0, index + 1);
  }
  throw new Error(`no closing > in ${tag}`);
};

/** Attribute names on the opening tag, braced- and quote-aware. */
const attributes = (code: string): string[] => {
  const tag = openingTag(code);
  const names: string[] = [];
  let depth = 0;
  let quote = "";
  let token = "";
  let precededBySpace = true;
  const push = () => {
    if (token && precededBySpace && /^[A-Za-z][A-Za-z0-9-]*$/.test(token)) {
      names.push(token);
    }
    token = "";
  };
  for (let index = 0; index < tag.length; index += 1) {
    const char = tag[index];
    if (quote) {
      if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "{") {
      push();
      depth += 1;
      continue;
    }
    if (char === "}") {
      push();
      depth -= 1;
      continue;
    }
    if (depth === 0 && /[A-Za-z0-9-]/.test(char)) {
      token += char;
      continue;
    }
    if (depth === 0 && char === "=") {
      push();
      continue;
    }
    if (depth === 0 && /\s/.test(char)) {
      push();
      precededBySpace = true;
      continue;
    }
    precededBySpace = false;
  }
  push();
  return names;
};

/** What this page's own table documents — an undocumented attribute is a lie. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const prop of DYNAMIC_IMG_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

const TYPED = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24"/></svg>';

/** One decision per knob — the states a reader can actually arrive at. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["raster", { sample: "raster" }],
  ["base64 svg", { sample: "dataUrl" }],
  ["hostile", { sample: "hostile" }],
  ["not an image", { sample: "broken" }],
  ["nothing", { sample: "none" }],
  ["alt", { alt: ALT_EXAMPLE }],
  ["title", { title: TITLE_EXAMPLE }],
  ["size", { size: "xl" }],
  ["tone", { tone: "emerald" }],
  ["fill", { fill: "#f97316" }],
  ["stroke", { stroke: STROKE_EXAMPLE }],
  ["colored", { colored: true }],
  ["placeholder named", { sample: "broken", fallbackIcon: "Warning" }],
  ["typed source", { customSource: TYPED }],
];

/** Every lever at once, which is also the only tag long enough to wrap. */
const HEAVY: Partial<PlaygroundState> = {
  sample: "hostile",
  // Long enough that the tag cannot fit on one line: the emitter must break it.
  alt: "Quarterly report for the emergency-department ward board",
  title: "Updated at 06:00 by the night desk",
  size: "xl",
  tone: "emerald",
  fill: "#f97316",
  stroke: STROKE_EXAMPLE,
  colored: true,
};

/** Every state a reader can reach, plus the one that overflows a line. */
const ALL_STATES: Array<[string, Partial<PlaygroundState>]> = [
  ...EVERY_STATE,
  ["heavy", HEAVY],
];

describe("dynamic image snippet", () => {
  it("hands the component one thing at rest", () => {
    expect(attributes(snippet())).toEqual(["src"]);
    expect(openingTag(snippet())).toContain("src={BADGE_SVG}");
  });

  it("never prints a documented default onto the tag", () => {
    const code = snippet();
    for (const absent of ["size=", "tone=", "alt=", "title=", "fallbackIcon="]) {
      expect(code, `${absent} is the component's default`).not.toContain(absent);
    }
    expect(code).not.toMatch(/\scolored(?=[ \/>])/);
  });

  it("prints only attributes this page's table documents", () => {
    const rows = documented();
    for (const [label, changes] of ALL_STATES) {
      for (const name of attributes(snippet(changes))) {
        expect(rows.has(name), `${label} printed ${name}`).toBe(true);
      }
    }
  });

  it("prints the tag attributes in the order DynamicImgProps declares them", () => {
    expect(attributes(snippet(HEAVY))).toEqual([
      "src",
      "alt",
      "size",
      "fill",
      "stroke",
      "colored",
      "title",
    ]);
  });

  it("declares the source once, as data, and keeps it out of the tag", () => {
    const code = snippet();
    expect((code.match(/^const /gm) ?? []).length).toBe(1);
    expect(code).toContain('const BADGE_SVG = "<svg xmlns=');
    // The tag references the constant; the markup itself belongs to the constant.
    expect(openingTag(code)).not.toContain("<svg");
    expect(openingTag(code)).not.toContain("data:");
  });

  it("keeps a raster data URL a data URL, not a re-encoding of it", () => {
    expect(snippet({ sample: "raster" })).toContain('const PIXEL_PNG = "data:image/png;base64,');
  });

  it("shows a base64 SVG source exactly as the component receives it", () => {
    expect(snippet({ sample: "dataUrl" })).toContain(
      'const CHECK_DATA_URL = "data:image/svg+xml;base64,',
    );
  });

  it("prints hostile markup verbatim, because refusing it is the lesson", () => {
    const code = snippet({ sample: "hostile" });
    expect(code).toContain("<script>");
    expect(code).toContain("javascript:alert(1)");
    expect(code).toContain("onload=");
    // …and the reader is never shown a way to inject it themselves.
    expect(code).not.toContain("dangerouslySetInnerHTML");
    expect(code).not.toContain("sanitizeSvg");
  });

  it("names a typed source SOURCE and still prints it as data", () => {
    const code = snippet({ customSource: TYPED });
    expect(code).toContain("const SOURCE = ");
    expect(code).toContain("src={SOURCE}");
    expect(openingTag(code)).not.toContain("<svg");
  });

  it("drops src entirely when there is no source", () => {
    const code = snippet({ sample: "none" });
    expect(code).not.toContain("src=");
    expect(code).not.toContain("const ");
    expect(openingTag(code)).toBe("<DynamicImg />");
  });

  it("treats whitespace as no name at all", () => {
    // Scoped to the tag: the source constant legitimately contains `fill="…"`.
    const tag = openingTag(snippet({ alt: "   ", title: "  ", fill: " ", stroke: " " }));
    expect(tag).not.toContain("alt=");
    expect(tag).not.toContain("title=");
    expect(tag).not.toContain("fill=");
    expect(tag).not.toContain("stroke=");
  });

  it("suppresses tone exactly when the component does", () => {
    expect(snippet({ tone: "emerald" })).toContain('tone="emerald"');
    // :67 — a raw fill or `colored` has already decided the colour.
    expect(snippet({ tone: "emerald", fill: "#f97316" })).not.toContain("tone=");
    expect(snippet({ tone: "emerald", colored: true })).not.toContain("tone=");
  });

  it("prints colored as a bare flag, never colored={true}", () => {
    const code = snippet({ colored: true });
    expect(code).toMatch(/\scolored(?=[ \/>])/);
    expect(code).not.toContain("colored={true}");
  });

  it("offers the placeholder name only while the placeholder is what paints", () => {
    // A rendering SVG has no placeholder to name (:85-88).
    expect(snippet({ fallbackIcon: "Warning" })).not.toContain("fallbackIcon=");
    expect(snippet({ sample: "broken", fallbackIcon: "Warning" })).toContain(
      'fallbackIcon="Warning"',
    );
    // The default name is never printed, even when it is what paints.
    expect(snippet({ sample: "broken" })).not.toContain("fallbackIcon=");
    const field = dynamicImgConfig.fields.find((entry) => entry.id === "fallbackIcon");
    expect(field?.when?.(seeds())).toBe(false);
    expect(field?.when?.(Object.assign(seeds(), { sample: "broken" }))).toBe(true);
  });

  it("keeps the component's own decisions out of the tag", () => {
    const tag = openingTag(snippet(HEAVY));
    for (const leaked of [
      "role",
      "aria-hidden",
      "aria-label",
      "style",
      "className",
      "tabindex",
      "onError",
      "onLoad",
      "srcSet",
      "width",
      "height",
    ]) {
      expect(tag, `${leaked} is the component's business`).not.toContain(leaked);
    }
    const code = snippet(HEAVY);
    for (const classOfIt of [
      "h-10 w-10",
      "h-6 w-6",
      "text-emerald-500",
      "object-contain",
      "inline-flex",
      "dangerouslySetInnerHTML",
    ]) {
      expect(code, `${classOfIt} belongs to DynamicImg`).not.toContain(classOfIt);
    }
  });

  it("keeps fields that own no prop off the tag entirely", () => {
    for (const id of ["customSource", "glass"]) {
      const field = dynamicImgConfig.fields.find((entry) => entry.id === id);
      expect(field?.prop, `${id} must never reach the tag`).toBeNull();
      expect(
        field?.emit?.(field?.default as PlaygroundValue, seeds(), {
          lit: (value: string) => JSON.stringify(value),
        } as never),
        `${id} prints nothing onto the tag`,
      ).toBeNull();
    }
  });

  it("documents no default the component does not have", () => {
    // Only `size` is documented as having one (:34-35); the rest are emit-governed
    // or blank-is-meaningful, and a docDefault there would be a claim about nothing.
    for (const id of ["sample", "alt", "title", "fill", "stroke", "tone", "fallbackIcon"]) {
      const field = dynamicImgConfig.fields.find((entry) => entry.id === id);
      expect(field?.docDefault, `${id} has no documented default`).toBeUndefined();
    }
    const size = dynamicImgConfig.fields.find((entry) => entry.id === "size");
    expect(size?.default).toBe(SIZE_DEFAULT);
    expect(size?.docDefault).toBe(SIZE_DEFAULT);
    const colored = dynamicImgConfig.fields.find((entry) => entry.id === "colored");
    expect(colored?.default).toBe(false);
    const fallback = dynamicImgConfig.fields.find(
      (entry) => entry.id === "fallbackIcon",
    );
    expect(fallback?.default).toBe(FALLBACK_DEFAULT);
  });

  it("offers one option per sample, and opens on the plainest one", () => {
    const field = dynamicImgConfig.fields.find((entry) => entry.id === "sample");
    const values = (field?.kind === "choice" ? field.options : []).map(
      (option) => option.value,
    );
    expect(values).toEqual(SAMPLE_IDS);
    expect(field?.default).toBe("filled");
    expect(new Set(SAMPLE_IDS.map((id) => SAMPLES[id].value)).size).toBe(
      SAMPLE_IDS.length,
    );
  });

  it("imports the one public name the snippet uses", () => {
    expect(snippet(HEAVY)).toContain(
      'import { DynamicImg } from "@cjlapao/ui-kit";',
    );
  });

  it("renders exactly one component in the demo", () => {
    for (const [label, changes] of ALL_STATES) {
      const code = snippet(changes);
      expect(code.match(/<[A-Z][A-Za-z]*/g), label).toEqual(["<DynamicImg"]);
    }
  });

  it("wraps the tag rather than overflowing, once everything is on", () => {
    expect(snippet(HEAVY)).toMatch(/\n\s+src=\{HOSTILE_SVG\}/);
  });

  it("documents in the table every name the page tells a reader to use", () => {
    const rows = new Set(
      DYNAMIC_IMG_PROPS.filter((prop) => !prop.name.startsWith("…")).map((prop) =>
        prop.name.trim(),
      ),
    );
    for (const name of [
      "src",
      "base64",
      "alt",
      "fallbackIcon",
      "size",
      "tone",
      "fill",
      "stroke",
      "colored",
      "title",
      "className",
    ]) {
      expect(rows.has(name), `${name} has no row`).toBe(true);
    }
    const spread = DYNAMIC_IMG_PROPS.find((prop) => prop.name.startsWith("…"));
    expect(spread, "the spread of HTMLAttributes needs a row").toBeDefined();
    expect(String(spread?.type)).toContain("HTMLAttributes");
    expect(String(spread?.description)).toContain("spread");
  });
});
