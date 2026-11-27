import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { panelHeroConfig } from "./panelHeroPlayground";
import { panelHeroCode } from "./PanelHeroPlayground";
import { PANELHERO_PROPS } from "./PanelHeroPage";
import { ARTWORK_CLASS, CLIP_CLASS } from "./panelHeroStage";
import type { PlaygroundState, PlaygroundValue } from "../../shared/playground/schema";

/**
 * Panel Hero's snippet.
 *
 * The banner has twenty-two controls and most of them must be *silent*: the
 * component carries real defaults (:237-255) and a snippet that restated them
 * would read like a type definition. So the tests below are mostly about
 * absence — what does not print at rest, what does not print once a control is
 * hidden, and what never prints at all.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of panelHeroConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(panelHeroConfig, state);
  return panelHeroCode({ state, data: {}, h });
};

/** The `<PanelHero …>` opening tag, quote-aware so `{…}` values cannot end it. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<PanelHero");
  expect(start, "the banner is printed").toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<PanelHero".length;
  let until: string | null = null;
  for (let index = head; index < tag.length; index += 1) {
    const char = tag[index];
    if (until) {
      if (char === until) until = null;
      continue;
    }
    if (char === '"') until = '"';
    else if (char === "{") until = "}";
    else if (char === ">") return tag.slice(0, index + 1);
  }
  throw new Error("unterminated opening tag");
};

/**
 * Attribute names on the printed element, in printed order — one depth-aware
 * pass, because `icon={<CustomIcon customSize={18} />}` carries another
 * component's props inside a value and those are not PanelHero's API.
 */
const attributes = (code: string): string[] => {
  const tag = openingTag(code);
  const head = "<PanelHero".length;
  const names: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let index = head;
  while (index < tag.length) {
    const char = tag[index];
    if (quote) {
      if (char === quote) quote = null;
      index += 1;
      continue;
    }
    if (char === '"') quote = '"';
    else if (char === "{") depth += 1;
    else if (char === "}") depth -= 1;
    else if (depth === 0 && /[A-Za-z]/.test(char)) {
      const word = /^[A-Za-z][\w-]*/.exec(tag.slice(index))?.[0] ?? "";
      const before = index > head ? tag[index - 1] : " ";
      if (/[\s]/.test(before) && word !== "PanelHero") names.push(word);
      index += Math.max(word.length, 1);
      continue;
    }
    index += 1;
  }
  return names;
};

/** Every prop name the page documents, composite rows split apart. */
const documented = (): string[] =>
  PANELHERO_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/\s*\(inherited\)$/, ""))
      .filter((part) => part && part !== "…"),
  );

describe("the banner at rest", () => {
  it("prints only what the component has no opinion about", () => {
    // variant, titleAs, titleSize, subtitleSize, padding, corner, decoration and
    // glowIntensity all sit on the component's own defaults, and `tone` on the
    // fall-through at :260 — so three attributes is the whole story.
    expect(attributes(snippet())).toEqual(["icon", "title", "subtitle"]);
  });

  it("opens on the values the component destructures", () => {
    const field = (id: string) =>
      panelHeroConfig.fields.find((candidate) => candidate.id === id);
    expect(field("variant")?.default).toBe("gradient"); // :241
    expect(field("titleAs")?.default).toBe("p"); // :237,:155
    expect(field("titleSize")?.default).toBe("sm"); // :242
    expect(field("subtitleSize")?.default).toBe("xs"); // :243
    expect(field("padding")?.default).toBe("sm"); // :244
    expect(field("decoration")?.default).toBe("both"); // :247
    expect(field("glowIntensity")?.default).toBe("soft"); // :250
    expect(field("raisedSurface")?.default).toBe(false); // :255
    expect(field("corner")?.default).toBe("rounded-md"); // :261-262, Theme.ts:1531
  });

  it("does not claim a tone the component never picks", () => {
    // :73-74 says `@default "blue"`; :239 destructures nothing and :260 falls
    // through "none" to neutral (Theme.ts:69). The docs follow the code.
    const tone = panelHeroConfig.fields.find((f) => f.id === "tone");
    expect(tone?.default).toBe("none");
    expect(tone?.docDefault, "no component default to compare against").toBeUndefined();
    expect(openingTag(snippet())).not.toMatch(/\btone=/);
    expect(snippet({ tone: "violet" })).toContain('tone="violet"');
  });

  it("keeps the required title on the tag even when emptied", () => {
    expect(snippet({ title: "" })).toContain('title=""'); // :62 has no default
    expect(snippet({ subtitle: "" })).not.toMatch(/\bsubtitle=/); // :64 does
    // …and it is the *element's* className that stays off, not the children's.
    expect(openingTag(snippet({ className: "   " }))).not.toMatch(/\bclassName=/);
  });
});

describe("what the variant decides", () => {
  it("prints the glass knobs only for a surface that can show them", () => {
    // :292-295 forwards them to Panel, and Panel washes on those four variants
    // (Theme.ts:1119-1124). Everywhere else the control is hidden, so an
    // attribute for it would be a leftover.
    const moved = { vibrancy: "high", specularMode: "halo", glassOpacity: "clear" };
    expect(attributes(snippet({ variant: "glass", ...moved }))).toEqual([
      "variant",
      "icon",
      "title",
      "subtitle",
      "glassOpacity",
      "vibrancy",
      "specularMode",
    ]);
    const tag = openingTag(snippet({ variant: "elevated", ...moved }));
    expect(tag).not.toMatch(/\bvibrancy/);
    expect(tag).not.toMatch(/\bspecularMode/);
    expect(tag).not.toMatch(/\bglassOpacity/);
  });

  it("leaves the band's paint off a Panel surface", () => {
    const tag = openingTag(
      snippet({
        variant: "subtle",
        glowIntensity: "strong",
        gradientFrom: "#123456",
        gradientTo: "#abcdef",
        raisedSurface: true,
      }),
    );
    expect(tag).not.toMatch(/\bglowIntensity/); // :305 — only the band draws a halo
    expect(tag).not.toMatch(/\bgradientFrom/); // :309-312
    expect(tag).not.toMatch(/\bgradientTo/);
    expect(tag).toContain("raisedSurface"); // :296 — and this one is a Panel prop
    expect(tag).not.toMatch(/raisedSurface=\{/); // bare is true; only false takes braces
  });

  it("keeps the halo intensity quiet at the component's own answer", () => {
    expect(openingTag(snippet())).not.toMatch(/\bglowIntensity/);
    expect(snippet({ glowIntensity: "subtle" })).toContain('glowIntensity="subtle"');
  });
});

describe("the slot contents", () => {
  it("draws no icon attribute when there is no icon", () => {
    // :181 — the chip is not rendered, and the kit tests for the missing svg
    // (PanelHero.test.tsx:196-199).
    expect(openingTag(snippet({ icon: "none" }))).not.toMatch(/\bicon=/);
    expect(snippet({ icon: "Rocket" })).toContain('icon="Rocket"');
  });

  it("prints a node verbatim, sizing included", () => {
    const code = snippet({ icon: "node" });
    // :168-172 sizes a registry name with the title; :174 renders a node as it
    // was written, so the snippet must show the caller's own sizing.
    expect(code).toContain('icon={<CustomIcon icon="Rocket" customSize={18}');
    expect(code).toContain("CustomIcon,");
    // Sorted, and it carries Button too: the actions are still mounted.
    expect(code).toContain(
      'import { Button, CustomIcon, PanelHero } from "@cjlapao/ui-kit";',
    );
  });

  it("mounts and prints the same two buttons", () => {
    const code = snippet();
    expect(code).toContain('<div className="flex gap-2">');
    expect(code).toContain('<Button variant="outline" size="sm">View logs</Button>');
    expect(code).toContain('<Button variant="soft" size="sm">Re-run job</Button>');
    expect(code).toContain("Button, PanelHero");
  });

  it("closes the tag when the reader drops the actions", () => {
    const code = snippet({ actions: false });
    expect(code).toContain("/>");
    expect(code).not.toMatch(/View logs/);
    expect(code).not.toMatch(/\bButton\b/); // not imported for nothing
    // `actions` is children, never an attribute (:56-60).
    expect(openingTag(code)).not.toMatch(/\bactions/);
  });
});

describe("the stage", () => {
  it("hoists the backdrop only when there is one", () => {
    const plain = snippet();
    expect(plain).not.toMatch(/BACKDROP_CLASS/);
    expect(plain).toContain("return (\n    <PanelHero");

    const art = snippet({ backdrop: "artwork" });
    expect(art).toContain("const BACKDROP_CLASS =");
    expect(art).toContain(ARTWORK_CLASS);
    expect(art).toContain("<div className={BACKDROP_CLASS}>");
    expect(art).not.toContain(CLIP_CLASS);
  });

  it("folds the clip switch into the same class list the preview uses", () => {
    const code = snippet({ backdrop: "artwork", clipped: true });
    expect(code).toContain(`${ARTWORK_CLASS} p-5 ${CLIP_CLASS}"`);
    // …and the switches themselves are never attributes (:52-109 has no such prop).
    const tag = openingTag(code);
    for (const lever of ["backdrop", "clipped", "actions", "state"]) {
      expect(tag, lever).not.toMatch(new RegExp(`\\b${lever}=`, "i"));
    }
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { tone: "rose", titleAs: "h1" },
      { variant: "glass", vibrancy: "high", transparency: "high" },
      { variant: "elevated", raisedSurface: true, corner: "none" },
      { gradientFrom: "#123", gradientTo: "#abc", glowIntensity: "medium" },
      { icon: "node", actions: false, className: "shadow-xl" },
      { backdrop: "artwork", clipped: true, subtitle: "" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const rows = documented();
    for (const field of panelHeroConfig.fields) {
      if (field.prop === null) continue;
      expect(rows, field.prop ?? field.id).toContain(field.prop ?? field.id);
    }
  });

  it("never leaks the playground's own vocabulary", () => {
    const code = snippet({ backdrop: "artwork", clipped: true, tone: "teal" });
    expect(code).not.toContain("Playground");
    expect(code).not.toContain("state.");
    expect(code).not.toContain("undefined");
    expect(code).toContain("export default function Demo() {");
  });
});
