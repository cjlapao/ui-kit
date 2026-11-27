import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { scrollAreaConfig } from "./scrollAreaPlayground";
import { scrollAreaCode } from "./ScrollAreaPlayground";
import { SCROLLAREA_PROPS } from "./ScrollAreaPage";
import { SCENARIOS, VIRTUAL, FRAME_DEFAULT, FRAME_NONE } from "./scrollAreaStage";
import { CITIES } from "./scrollAreaFixture";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is the docs' claim about `ScrollArea.tsx`, so it is tested as a
 * claim: at rest the region prints only the class that gives it a height, every
 * control that changes something is legible in the tag, and no control speaks
 * where the component has already decided — which on this page means the two
 * axes under `virtualScroll` (:161-162) and anything the reader cannot scroll.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of scrollAreaConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(scrollAreaConfig, state);
  return scrollAreaCode({ state, data: {}, h });
};

/** The `<ScrollArea …>` tag itself, so assertions cannot hit a fixture's props. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<ScrollArea");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<ScrollArea".length;
  let depth = 0;
  for (let index = head; index < tag.length; index += 1) {
    const char = tag[index];
    if (char === "{") depth += 1;
    else if (char === "}") depth -= 1;
    else if (char === ">" && depth === 0) return tag.slice(0, index + 1);
  }
  throw new Error(`no closing > in ${tag}`);
};

/**
 * Attribute names on the opening tag, read by a scanner that knows about JSX
 * braces and string literals — a flat regex dive would find the `className` of a
 * tile inside the hoisted fixture and report it as the region's own.
 */
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

/** The props the API table vouches for, `…html props` included for the rest. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const prop of SCROLLAREA_PROPS) {
    if (prop.name.startsWith("…")) {
      // The spread row (:36,:440) is what vouches for a rest attribute.
      names.add("aria-label");
      continue;
    }
    names.add(prop.name);
  }
  return names;
};

/** Every lever at a value that differs from its default, so nothing hides. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["at rest", {}],
  ["each variant", { variant: "always" }],
  ["masked", { mask: true }],
  ["lane refunded", { gutter: false }],
  ["one axis", { horizontal: false }],
  ["other axis", { vertical: false }],
  ["virtual", { virtualScroll: true, horizontal: false, vertical: false }],
  ["tab stop", { tabIndex: 2 }],
  ["a role on the scroller", { viewportRole: "rowgroup" }],
  ["named", { ariaLabel: "  Quarterly reports  " }],
  ["class hooks", { viewportClassName: "overscroll-contain", contentClassName: " max-w-prose " }],
  ["capped frame", { className: "max-h-56 w-full" }],
  ["no frame", { className: FRAME_NONE }],
  ["wide content", { content: "tiles" }],
  ["both axes", { content: "grid" }],
  ["fitting content", { content: "fits" }],
];

describe("scrollArea snippet", () => {
  it("prints the frame's height and nothing else at rest", () => {
    expect(attributes(snippet())).toEqual(["className"]);
    // A region always has content, so the tag is open, not self-closed.
    expect(openingTag(snippet())).toBe(`<ScrollArea className="${FRAME_DEFAULT}">`);
  });

  it("keeps the content lever out of the tag", () => {
    const code = snippet({ content: "grid" });
    expect(attributes(code)).toEqual(["className"]);
    expect(code).toContain("{GRID}");
  });

  it("says variant only when it is not auto", () => {
    expect(attributes(snippet())).not.toContain("variant");
    expect(openingTag(snippet({ variant: "hover" }))).toContain('variant="hover"');
    expect(openingTag(snippet({ variant: "hidden" }))).toContain('variant="hidden"');
  });

  it("writes booleans the JSX way — bare for true, ={false} for false", () => {
    const masked = openingTag(snippet({ mask: true }));
    expect(masked).toMatch(/\smask(?!=)/);
    expect(masked).not.toContain("mask={true}");
    expect(openingTag(snippet({ gutter: false }))).toContain("gutter={false}");
    expect(attributes(snippet({ gutter: true }))).not.toContain("gutter");
  });

  it("keeps the axes silent while they are the default", () => {
    expect(attributes(snippet())).not.toContain("horizontal");
    expect(attributes(snippet())).not.toContain("vertical");
    expect(openingTag(snippet({ horizontal: false }))).toContain("horizontal={false}");
    expect(openingTag(snippet({ vertical: false }))).toContain("vertical={false}");
  });

  it("cannot print an axis virtualScroll has already decided (:161-162)", () => {
    const code = snippet({
      virtualScroll: true,
      horizontal: false,
      vertical: false,
    });
    expect(attributes(code)).toEqual(["className", "virtualScroll"]);
  });

  it("prints tabIndex only when it is not the component's own 0", () => {
    expect(attributes(snippet())).not.toContain("tabIndex");
    expect(openingTag(snippet({ tabIndex: 2 }))).toContain("tabIndex={2}");
    expect(openingTag(snippet({ tabIndex: -1 }))).toContain("tabIndex={-1}");
  });

  it("prints a viewport role only when the reader chose one", () => {
    expect(attributes(snippet())).not.toContain("viewportRole");
    expect(openingTag(snippet({ viewportRole: "rowgroup" }))).toContain(
      'viewportRole="rowgroup"',
    );
  });

  it("trims the free-text controls and drops the blank ones", () => {
    expect(openingTag(snippet({ ariaLabel: "  Quarterly reports  " }))).toContain(
      'aria-label="Quarterly reports"',
    );
    expect(attributes(snippet({ ariaLabel: "   " }))).not.toContain("aria-label");
    expect(openingTag(snippet({ contentClassName: "  max-w-prose " }))).toContain(
      'contentClassName="max-w-prose"',
    );
    expect(attributes(snippet({ contentClassName: "" }))).not.toContain(
      "contentClassName",
    );
    expect(attributes(snippet({ viewportClassName: "" }))).not.toContain(
      "viewportClassName",
    );
  });

  it("always carries a height, even the frame that has none", () => {
    expect(openingTag(snippet({ className: FRAME_NONE }))).toContain(
      'className="w-full"',
    );
  });

  it("hoists the content the preview mounts, by name", () => {
    for (const [id, spec] of Object.entries(SCENARIOS)) {
      const code = snippet({ content: id });
      expect(code).toContain(`const ${spec.constName} = (`);
      expect(code).toContain(`{${spec.constName}}`);
      expect(code).toContain(`// ${spec.label}`);
    }
  });

  it("prints the fixture's own markup, not a paraphrase of it", () => {
    const code = snippet({ content: "rows" });
    expect(code).toContain(`<span className="block text-sm">${CITIES[0]}</span>`);
    expect(code).toContain(`<span className="block text-sm">${CITIES[15]}</span>`);
  });

  it("prints the engine's measurements as the stage drives them", () => {
    const code = snippet({ virtualScroll: true });
    expect(code).toContain("const VIRTUAL = {");
    expect(code).toContain(`contentSize: ${VIRTUAL.contentSize}`);
    expect(code).toContain(`viewportSize: ${VIRTUAL.viewportSize}`);
    expect(code).toContain("onScroll: (next) => {}");
    expect(openingTag(code)).toContain("virtualScroll={VIRTUAL}");
  });

  it("says who owns the offset in the same breath as the object", () => {
    const code = snippet({ virtualScroll: true });
    expect(code).toMatch(/\/\/ the engine's own measurements/);
    expect(code).toMatch(/the host keeps the offset/);
  });

  it("imports only the region, whatever the reader changed", () => {
    for (const [, changes] of EVERY_STATE) {
      expect(snippet(changes)).toContain(
        'import { ScrollArea } from "@cjlapao/ui-kit";',
      );
    }
  });

  it("keeps the attributes in the order the controls are listed", () => {
    expect(
      attributes(
        snippet({
          variant: "hover",
          mask: true,
          gutter: false,
          tabIndex: 2,
          ariaLabel: "Reports",
          viewportRole: "list",
        }),
      ),
    ).toEqual([
      "className",
      "variant",
      "mask",
      "gutter",
      "tabIndex",
      "viewportRole",
      "aria-label",
    ]);
  });

  it("documents everything it prints, in every state", () => {
    const table = documented();
    for (const [name, changes] of EVERY_STATE) {
      for (const attribute of attributes(snippet(changes))) {
        expect(table.has(attribute), `${name} prints ${attribute}`).toBe(true);
      }
    }
  });

  it("gives every config prop a row in the table", () => {
    const table = documented();
    for (const field of scrollAreaConfig.fields) {
      if (typeof field.prop !== "string") continue;
      expect(table.has(field.prop), `undocumented prop ${field.prop}`).toBe(true);
    }
  });

  it("keeps what the component owns out of the tag", () => {
    const never = [
      "viewportRef",
      "aria-hidden",
      "aria-valuenow",
      "data-slot",
      "style",
      "onScroll",
    ];
    for (const [, changes] of EVERY_STATE) {
      const tag = openingTag(snippet(changes));
      for (const name of never) {
        expect(tag, `${name} leaked`).not.toContain(`${name}=`);
      }
      expect(tag).not.toMatch(/\srole(?!=)/);
      expect(tag).not.toMatch(/\sonScroll(?!=)/);
    }
  });
});
