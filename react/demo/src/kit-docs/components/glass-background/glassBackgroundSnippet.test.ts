import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import {
  DERIVED,
  glassBackgroundConfig,
} from "./glassBackgroundPlayground";
import { glassBackgroundCode } from "./GlassBackgroundPlayground";
import { GLASS_BACKGROUND_PROPS } from "./GlassBackgroundPage";
import { STAGE_CLASS, overlayFor } from "./glassStage";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Glass Background's snippet.
 *
 * The page's claim is that the Code view says **nothing** on load: every
 * control opens on the value `GlassBackground.tsx:49-61` destructures, the two
 * derived stops are not colours at all, and the only thing printed is the panel
 * the stage is mounting. Each assertion here fails if a `default` drifts from
 * the source, if a stop is printed as a colour nobody chose — the exact way the
 * hand-rolled version of this playground used to lie, by seeding `indigo` and
 * `violet` — or if the frame around the backdrop disappears from the source
 * that claims to reproduce the screen.
 */

/** The controls open on the config's own defaults, which are the component's. */
const OPENING: PlaygroundState = {};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign({}, OPENING, changes) as PlaygroundState;
  const h = createEmitter(glassBackgroundConfig, state);
  // The same function the stage mounts, so the snippet cannot describe a panel
  // that is not on screen.
  return glassBackgroundCode({ state, data: { overlay: overlayFor(state) }, h });
};

/** The element itself, comment and children excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<GlassBackground");
  return code.slice(open, code.indexOf(">", open) + 1);
};

/** Attribute names on the printed `<GlassBackground …>`, in printed order. */
const attributes = (code: string): string[] => {
  const tag = tagOf(code);
  const named = [...tag.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "GlassBackground");
  return [...named, ...(flags ?? [])];
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  GLASS_BACKGROUND_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/\s*\(inherited\)$/, ""))
      .filter(Boolean),
  );

describe("the opening", () => {
  it("prints no prop at all", () => {
    const code = snippet();
    expect(attributes(code)).toEqual([]);
    for (const untouched of [
      "position",
      "color",
      "colorSecondary",
      "colorDeep",
      "direction",
      "shimmer",
      "ambient",
    ]) {
      expect(tagOf(code), untouched).not.toContain(`${untouched}=`);
    }
    expect(code).toContain(
      'import { GlassBackground, Panel } from "@cjlapao/ui-kit";',
    );
  });

  it("opens on the values GlassBackground.tsx destructures", () => {
    // GB:50 position "absolute" · :51 color "blue" · :54 direction "br" ·
    // :55 shimmer false · :56 ambient true. colorSecondary / colorDeep have no
    // default in the component (:63-64 derive them), so the fields open at a
    // value that is not a colour and prints nothing.
    const field = (id: string) =>
      glassBackgroundConfig.fields.find((f) => f.id === id);
    expect(field("position")?.default).toBe("absolute");
    expect(field("color")?.default).toBe("blue");
    expect(field("direction")?.default).toBe("br");
    expect(field("shimmer")?.default).toBe(false);
    expect(field("ambient")?.default).toBe(true);
    expect(field("colorSecondary")?.default).toBe(DERIVED);
    expect(field("colorDeep")?.default).toBe(DERIVED);
  });

  it("prints the panel it is mounting, in the frame that holds it", () => {
    const code = snippet();
    expect(code).toContain('<Panel variant="liquid-glass" corner="rounded-lg" padding="sm">');
    expect(code).toContain(STAGE_CLASS);
    expect(code).toContain('style={{ transform: "translateZ(0)" }}');
    // Children, not an invented attribute list.
    expect(code).toContain("<GlassBackground>");
    expect(code).toContain("</GlassBackground>");
  });
});

describe("a stop the kit decides", () => {
  it("names no colour it did not choose", () => {
    const code = snippet();
    // The hand-rolled playground seeded the derived values, so the derivation
    // path could never be seen — and the snippet claimed tones nobody picked.
    expect(code).not.toContain("indigo");
    expect(code).not.toContain("violet");
    expect(code).toContain("derived");
    expect(code).toContain("getGlassBackgroundSecondaryTone");
  });

  it("prints a stop the moment the reader picks one, and not before", () => {
    expect(snippet({ colorSecondary: "teal" })).toContain('colorSecondary="teal"');
    expect(snippet({ colorSecondary: DERIVED })).not.toContain("colorSecondary=");
    expect(snippet({ colorDeep: "cyan" })).toContain('colorDeep="cyan"');
    expect(snippet({ colorDeep: DERIVED })).not.toContain("colorDeep=");
  });

  it("says the stops are derived only while both of them are", () => {
    expect(snippet({ colorSecondary: "teal", colorDeep: "cyan" })).not.toContain(
      "getGlassBackgroundSecondaryTone",
    );
    // One chosen, one still derived: the comment still owes the reader the truth.
    expect(snippet({ colorDeep: "cyan" })).toContain("getGlassBackgroundSecondaryTone");
  });
});

describe("the levers", () => {
  it("prints the positioning mode it was not given by default", () => {
    expect(snippet({ position: "fixed" })).toContain('position="fixed"');
    // The comment above the snippet names position="fixed" to explain the
    // transform, so only the element itself may be searched for the attribute.
    expect(tagOf(snippet({ position: "absolute" }))).not.toContain("position=");
  });

  it("prints the tone only once it is off blue, and never as a colour object", () => {
    expect(snippet({ color: "emerald" })).toContain('color="emerald"');
    expect(snippet({ color: "blue" })).not.toContain("color=");
  });

  it("prints direction as a code, and the two effects as flags", () => {
    expect(snippet({ direction: "tl" })).toContain('direction="tl"');
    expect(snippet({ direction: "br" })).not.toContain("direction=");
    expect(snippet({ shimmer: true })).toContain("shimmer");
    expect(snippet({ shimmer: false })).not.toContain("shimmer");
    // ambient is default-on, so off is the one that has to say so.
    expect(snippet({ ambient: false })).toContain("ambient={false}");
    expect(snippet({ ambient: true })).not.toContain("ambient");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { position: "fixed", color: "teal", direction: "bl" },
      { colorSecondary: "amber", colorDeep: "rose", shimmer: true, ambient: false },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      glassBackgroundConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("keeps the overlay out of the attribute list", () => {
    // Children are content, not a prop: the data source places itself inside the
    // tag, so nothing named `overlay` may reach the source.
    expect(snippet()).not.toContain("overlay");
    expect(snippet({ shimmer: true })).not.toContain("overlay=");
  });
});
