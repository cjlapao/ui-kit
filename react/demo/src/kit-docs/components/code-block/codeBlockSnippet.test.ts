import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { defaultDeclarations } from "../../shared/playground";
import { codeBlockConfig } from "./codeBlockPlayground";
import { codeBlockCode } from "./CodeBlockPlayground";
import { CODEBLOCK_PROPS } from "./CodeBlockPage";
import { SAMPLES, DEFAULT_SAMPLE } from "./codeBlockStage";
import type { PlaygroundState, PlaygroundValue } from "../../shared/playground/schema";

/**
 * Code Block's snippet.
 *
 * The interesting claims here are all about *absence*: that a read-only block
 * prints no `onChange` (a handler nothing can call — the only call site is the
 * textarea at CodeBlock.tsx:135), that the editor-only label cannot speak while
 * the block is a `<pre>` (:131-137), that `readOnly` is only ever printed as
 * `readOnly={false}` because `true` is what the component destructures (:76), and
 * that the printed `SOURCE` is the text on screen rather than whatever the sample
 * table holds. Each assertion fails if a default drifts or a stage-only lever
 * leaks into the reader's source.
 */

/** The controls open on the config's own defaults, which are the component's. */
const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of codeBlockConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(codeBlockConfig, state);
  // The same function the preview reads: what is on screen is what gets printed.
  return codeBlockCode({ state, data: { source: state.draft }, h });
};

/** The element itself, imports and declarations excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<CodeBlock");
  return code.slice(open, code.indexOf("/>", open) + 2);
};

/** Attribute names on the printed `<CodeBlock …>`, in printed order. */
const attributes = (code: string): string[] => {
  const tag = tagOf(code);
  const named = [...tag.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "CodeBlock");
  return [...named, ...(flags ?? [])];
};

/** The printed fixture, comment excluded. */
const sourceConst = (code: string): string => {
  const start = code.indexOf("const SOURCE");
  if (start < 0) return "";
  // The literal itself is full of semicolons, so the declaration ends where the
  // snippet's own `export default function Demo` begins.
  const end = code.indexOf("export default function", start);
  return code.slice(start, end < 0 ? undefined : end).trim();
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  CODEBLOCK_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/\s*\(inherited\)$/, ""))
      .filter((part) => part && part !== "…"),
  );

describe("the opening", () => {
  it("prints the source and the two labels that name it", () => {
    const code = snippet();
    // Everything else opens on the value CodeBlock.tsx:73-78 destructures.
    expect(attributes(code)).toEqual(["value", "language", "filename"]);
    expect(code).toContain("value={SOURCE}");
    expect(code).toContain(`language="${SAMPLES[DEFAULT_SAMPLE].language}"`);
    expect(code).toContain('filename="theme.ts"');
    expect(code).toContain('import { CodeBlock } from "@cjlapao/ui-kit";');
    for (const untouched of [
      "readOnly",
      "onChange",
      "editorLabel",
      "showTitle",
      "showCopy",
      "showLineNumbers",
      "wrapLines",
      "maxHeight",
      "tone",
      "variant",
      "corner",
      "color",
      "raisedSurface",
    ]) {
      expect(tagOf(code), untouched).not.toContain(`${untouched}=`);
    }
  });

  it("opens on the values the component destructures", () => {
    const field = (id: string) => codeBlockConfig.fields.find((f) => f.id === id);
    expect(field("readOnly")?.default).toBe(true); // :76
    expect(field("showTitle")?.default).toBe(true); // :76
    expect(field("showCopy")?.default).toBe(true); // :76
    expect(field("showLineNumbers")?.default).toBe(false); // :75
    expect(field("wrapLines")?.default).toBe(false); // :75
    expect(field("tone")?.default).toBe("none"); // :76
    expect(field("variant")?.default).toBe("subtle"); // :76
    expect(field("corner")?.default).toBe("rounded-md"); // :76
    expect(field("color")?.default).toBe("blue"); // :76
    expect(field("raisedSurface")?.default).toBe(false); // :77
    // Absent is the honest default for anything the component leaves undefined.
    expect(field("maxHeight")?.default).toBe("auto"); // :124
    // The stage's own decisions are not props: `sample` carries no prop at all and
    // `edited`/`draft` are not fields, only state the preview writes.
    expect(field("sample")?.prop, "sample").toBeNull();
    for (const lever of ["edited", "draft"]) {
      expect(field(lever), lever).toBeUndefined();
    }
  });

  it("keeps the fixture above the element", () => {
    const code = snippet();
    expect(code).toMatch(/const SOURCE = `type Theme = /);
    // The trailing newline is part of the fixture, and the copy button writes this
    // exact string (:101), so the printed literal has to keep it.
    const printed = sourceConst(code);
    expect(printed).toContain('exact-source copying.";');
    expect(printed.endsWith("`;" )).toBe(true);
  });
});

describe("the editor branch", () => {
  it("prints a handler and the label only once the block is editable", () => {
    const code = snippet({ readOnly: false });
    expect(attributes(code)).toEqual([
      "value",
      "language",
      "filename",
      "readOnly",
      "onChange",
      "editorLabel",
    ]);
    expect(code).toContain("readOnly={false}");
    expect(code).toContain("onChange={handleChange}");
    expect(code).toContain('editorLabel="Change the theme colour"');
    // Handlers before fixtures, so the copied snippet has no dead zone.
    expect(code.indexOf("const handleChange")).toBeLessThan(
      code.indexOf("const SOURCE"),
    );
  });

  it("prints no handler while nothing can call one", () => {
    // A read-only block renders a <pre> (:130); onChange's only call site is the
    // textarea (:135), so the prop would describe a callback that never fires.
    for (const state of [{}, { onChange: "none" }, { onChange: "handler" }] as const) {
      const code = snippet({ ...state });
      expect(tagOf(code)).not.toMatch(/\bonChange=/);
      expect(code).not.toContain("handleChange");
    }
  });

  it("keeps the editor label out of the display branch", () => {
    const code = snippet({ editorLabel: "Edit the theme settings" });
    expect(tagOf(code)).not.toMatch(/\beditorLabel=/);
    // Omitting onChange freezes the textarea — the snippet says so by saying
    // nothing about a handler.
    const frozen = snippet({ readOnly: false, onChange: "none" });
    expect(tagOf(frozen)).not.toMatch(/\bonChange=/);
    expect(frozen).not.toContain("const handleChange");
    expect(frozen).toContain("readOnly={false}");
  });
});

describe("the source it prints", () => {
  it("prints what is on screen, not the sample table", () => {
    const typed = snippet({ edited: true, draft: "const x = 1;\n" });
    expect(typed).toContain("const x = 1;");
    expect(typed).not.toContain("export const description");
    // An emptied editor is still an edited editor: no silent reload of the
    // fixture, because the copy button would then promise bytes it does not have.
    expect(sourceConst(snippet({ edited: true, draft: "" }))).toBe(
      "const SOURCE = ``;",
    );
  });

  it("escapes what a template literal cannot carry raw", () => {
    const tricky = "const a = `x`; // ${notInterpolated}\n";
    const printed = sourceConst(snippet({ edited: true, draft: tricky }));
    expect(printed).toContain("\\`x\\`");
    expect(printed).toContain("\\${notInterpolated}");
  });

  it("keeps a language the component cannot highlight", () => {
    // The catch (:93-95) decides at runtime, so the snippet says what was asked
    // for rather than guessing the outcome.
    expect(snippet({ language: "svelte" })).toContain('language="svelte"');
    expect(tagOf(snippet({ language: "   " }))).not.toMatch(/\blanguage=/);
    expect(tagOf(snippet({ filename: "" }))).not.toMatch(/\bfilename=/);
  });
});

describe("the switches", () => {
  it("prints only the flip away from the destructured default", () => {
    expect(snippet({ showTitle: false })).toContain("showTitle={false}");
    // A bare `showTitle` would mean true, which is already the default (:76).
    expect(tagOf(snippet({ showTitle: true }))).not.toMatch(/\bshowTitle/);
    const bare = snippet({ showTitle: false, showCopy: false });
    expect(bare).toContain("showTitle={false}");
    expect(bare).toContain("showCopy={false}");
    expect(snippet({ showLineNumbers: true })).toContain("showLineNumbers");
    expect(snippet({ wrapLines: true })).toContain("wrapLines");
    expect(snippet({ raisedSurface: true })).toContain("raisedSurface");
  });

  it("prints numeric props as expressions", () => {
    // :29 `maxHeight?: number | string` — a quoted number is the wrong shape.
    expect(snippet({ maxHeight: "320" })).toContain("maxHeight={320}");
    expect(tagOf(snippet({ maxHeight: "320" }))).not.toContain('maxHeight="320"');
    expect(tagOf(snippet({ maxHeight: "auto" }))).not.toMatch(/\bmaxHeight=/);
  });

  it("prints a tint the reader chose and none otherwise", () => {
    expect(snippet({ tone: "amber" })).toContain('tone="amber"');
    // `none` is the component's own default (:76), so it is not worth printing.
    expect(tagOf(snippet({ tone: "none" }))).not.toMatch(/\btone=/);
    expect(snippet({ color: "emerald" })).toContain('color="emerald"');
    expect(tagOf(snippet({ color: "blue" }))).not.toMatch(/\bcolor=/);
  });

  it("never prints the stage's own levers", () => {
    const code = snippet({
      sample: "json",
      edited: true,
      draft: "{}\n",
      readOnly: false,
      tone: "blue",
      maxHeight: "240",
    });
    for (const lever of ["sample", "edited", "draft"]) {
      expect(tagOf(code), lever).not.toMatch(new RegExp(`\\b${lever}=`));
    }
    expect(code).not.toContain("Playground");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { readOnly: false },
      { readOnly: false, onChange: "none" },
      { showTitle: false, showCopy: false, showLineNumbers: true, wrapLines: true },
      { tone: "violet", variant: "glass", corner: "rounded-none", color: "sky" },
      { maxHeight: "480", language: "plaintext", filename: "notes.txt" },
      { edited: true, draft: "x\n" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      codeBlockConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    // The fixture is a data source, and the API table has to speak for it too.
    for (const source of codeBlockConfig.data ?? []) {
      if (source.prop !== null) printed.add(source.prop ?? source.id);
    }
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("hoists the fixture exactly once", () => {
    const state = seeds() as PlaygroundState;
    const h = createEmitter(codeBlockConfig, state);
    expect(defaultDeclarations(codeBlockConfig, state, h)).toHaveLength(1);
    expect(defaultDeclarations(codeBlockConfig, state, h)[0]).toContain(
      "const SOURCE = ",
    );
  });
});
