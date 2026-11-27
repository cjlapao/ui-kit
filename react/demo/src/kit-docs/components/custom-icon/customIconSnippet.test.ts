import { describe, expect, it } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { customIconConfig } from "./customIconPlayground";
import { customIconCode } from "./CustomIconPlayground";
import { CUSTOM_ICON_PROPS } from "./CustomIconPage";
import {
  CLASS_EXAMPLE,
  COLOR_EXAMPLE,
  CUSTOM_SIZE_EXAMPLE,
  HOVER_COLOR_EXAMPLE,
  ICON_DEFAULT,
  SIZE_DEFAULT,
} from "./customIconStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a 176-line component, so it is tested as a
 * claim: an icon at rest asks for one thing — the name of the glyph — every attribute
 * that appears is a row of the API table, and nothing the component decides for
 * itself (the `role` it stamps, the `aria-hidden` on its own drawings, the
 * `animate-spin` and `custom-icon` classes it merges) leaks into the tag a reader is
 * handed.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of customIconConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(customIconConfig, state);
  return customIconCode({ state, data: {}, h });
};

/** The `<CustomIcon …>` tag itself, so the wrapper's markup cannot read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<CustomIcon");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<CustomIcon".length;
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

/** The props the API table vouches for, including the rows that share a line. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const prop of CUSTOM_ICON_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** One decision per knob — the states a reader can actually arrive at. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["icon", { icon: "Search" }],
  ["alt", { alt: "Mark everything as read" }],
  ["customSize (pixels)", { customSize: CUSTOM_SIZE_EXAMPLE }],
  ["customSize (length)", { customSize: "2.5rem" }],
  ["size", { size: "xl" }],
  ["className", { className: CLASS_EXAMPLE }],
  ["tone", { tone: "emerald" }],
  ["color", { color: COLOR_EXAMPLE }],
  ["hoverColor", { hoverColor: HOVER_COLOR_EXAMPLE }],
  ["colored", { colored: true }],
  ["spin", { spin: true }],
  ["onClick", { activatable: true }],
  ["disabled", { disabled: true }],
];

/** Every lever at once, which is also the only tag long enough to wrap. */
const HEAVY: Partial<PlaygroundState> = {
  icon: "Trash",
  alt: "Delete the draft",
  customSize: CUSTOM_SIZE_EXAMPLE,
  size: "xl",
  className: CLASS_EXAMPLE,
  tone: "emerald",
  color: COLOR_EXAMPLE,
  hoverColor: HOVER_COLOR_EXAMPLE,
  colored: true,
  spin: true,
  activatable: true,
  disabled: true,
};

describe("custom icon snippet", () => {
  it("asks for one thing at rest — the glyph — and nothing else", () => {
    expect(attributes(snippet())).toEqual(["icon"]);
    expect(snippet()).toContain(`icon="${ICON_DEFAULT}"`);
  });

  it("prints the required prop even at the name the stage opened with", () => {
    // `icon` has no documented default to hide behind (:14), and without it the
    // snippet does not compile.
    expect(snippet()).toContain("icon=");
    expect(customIconConfig.fields.find((field) => field.id === "icon")?.docDefault).toBeUndefined();
  });

  it("does not print what the component decides for itself", () => {
    const code = snippet();
    for (const absent of [
      'size="',
      'alt="',
      "customSize",
      "className",
      'tone="',
      'color="',
      "hoverColor",
      "colored",
      "spin",
      "onClick",
      "disabled",
    ]) {
      expect(code, `default state prints ${absent}`).not.toContain(absent);
    }
  });

  it("prints a decision for each of them once it is made", () => {
    expect(snippet({ icon: "Search" })).toContain('icon="Search"');
    expect(snippet({ alt: "Mark everything as read" })).toContain(
      'alt="Mark everything as read"',
    );
    expect(snippet({ size: "xl" })).toContain('size="xl"');
    expect(snippet({ tone: "emerald" })).toContain('tone="emerald"');
    expect(snippet({ color: COLOR_EXAMPLE })).toContain(`color="${COLOR_EXAMPLE}"`);
    expect(snippet({ hoverColor: HOVER_COLOR_EXAMPLE })).toContain(
      `hoverColor="${HOVER_COLOR_EXAMPLE}"`,
    );
    expect(snippet({ className: CLASS_EXAMPLE })).toContain(
      `className="${CLASS_EXAMPLE}"`,
    );
  });

  it("sends a bare number through braces and a length through quotes", () => {
    // `48` is a pixel count to the component (:83); `2.5rem` is already a length.
    expect(snippet({ customSize: CUSTOM_SIZE_EXAMPLE })).toContain(
      "customSize={48}",
    );
    expect(snippet({ customSize: "2.5rem" })).toContain('customSize="2.5rem"');
    expect(snippet({ customSize: "" })).not.toContain("customSize");
  });

  it("prints a bare flag, never `={true}`", () => {
    for (const flagName of ["colored", "spin", "disabled"]) {
      const code = snippet({ [flagName]: true });
      expect(code, `${flagName}`).toMatch(
        new RegExp(`\\s${flagName}(?=[ \\/>])`),
      );
      expect(code, `${flagName}={true}`).not.toContain(`${flagName}={true}`);
      expect(code, `${flagName}=""`).not.toContain(`${flagName}=""`);
    }
  });

  it("hands onClick a handler the snippet actually declares", () => {
    const code = snippet({ activatable: true });
    expect(code).toContain("onClick={handlePress}");
    // A prop that only exists in the playground is a snippet that does not compile.
    expect(code).toContain("function handlePress(): void {");
    expect(code).toContain("<CustomIcon");
    expect(snippet()).not.toContain("onClick");
  });

  it("keeps decoration decoration — no alt, no aria", () => {
    const code = snippet();
    expect(code).not.toContain("alt=");
    expect(code).not.toContain("aria-label");
    expect(code).not.toContain("role=");
  });

  it("escapes the caller's strings and prints nothing else braced", () => {
    const code = snippet({ alt: 'Say "hi" to the icon' });
    expect(code).toContain('alt="Say \\"hi\\" to the icon"');
    expect(openingTag(code)).not.toContain("{");
  });

  it("says nothing the component decides for itself", () => {
    const printed = new Set(attributes(snippet(HEAVY)));
    for (const leak of ["role", "aria-hidden", "aria-label", "type", "style", "focusable"]) {
      expect([...printed], `HEAVY prints ${leak}`).not.toContain(leak);
    }
    const code = snippet(HEAVY);
    for (const leak of [
      'role="',
      'aria-hidden',
      'aria-label',
      'type="',
      'style=',
      "focusable",
      "animate-spin",
      "motion-reduce",
      "--icon-hover-color",
      "h-6 w-6",
      "text-emerald-500",
      "peer-",
    ]) {
      expect(code, `HEAVY prints ${leak}`).not.toContain(leak);
    }
  });

  it("keeps the attributes in the order the config lists them", () => {
    expect(attributes(snippet(HEAVY))).toEqual([
      "icon",
      "alt",
      "customSize",
      "size",
      "className",
      "tone",
      "color",
      "hoverColor",
      "colored",
      "spin",
      "onClick",
      "disabled",
    ]);
  });

  it("prints nothing the API table does not vouch for, in every state", () => {
    const rows = documented();
    const every: Array<[string, Partial<PlaygroundState>]> = [
      ...EVERY_STATE,
      ["everything", HEAVY],
    ];
    for (const [name, changes] of every) {
      for (const attribute of attributes(snippet(changes))) {
        expect(rows.has(attribute), `${name} prints ${attribute}`).toBe(true);
      }
    }
  });

  it("documents every prop the config is allowed to write", () => {
    const rows = documented();
    for (const field of customIconConfig.fields) {
      if (!field.prop) continue;
      expect(rows.has(field.prop), `${field.id} writes ${field.prop}`).toBe(true);
    }
  });

  it("pins each knob to the component's own default", () => {
    const byId = new Map(customIconConfig.fields.map((field) => [field.id, field]));
    const size = byId.get("size");
    expect(size, "size is a knob").toBeDefined();
    expect(size?.default, "size starts elsewhere").toBe(SIZE_DEFAULT);
    expect(size?.docDefault, "size is not pinned to the doc default").toBe(
      SIZE_DEFAULT,
    );
    // `tone`, `color` and friends have no documented default — absent means inherit
    // (:26,:31), so the stage starts them empty rather than inventing one.
    for (const id of ["tone", "color", "hoverColor", "customSize", "className", "alt"]) {
      const field = byId.get(id);
      expect(field?.default, `${id} starts with a value`).toBe("");
      expect(field?.docDefault, `${id} claims a default it does not have`).toBeUndefined();
    }
  });

  it("offers only real registry names, plus the two that are not", () => {
    const field = customIconConfig.fields.find((field) => field.id === "icon");
    const values = (field?.kind === "choice" ? field.options : []).map(
      (option) => option.value,
    );
    expect(values).toContain(ICON_DEFAULT);
    expect(values).toContain("Unicorn");
    expect(values).toContain("QuantumWidget");
    expect(new Set(values).size, "a name is offered twice").toBe(values.length);
  });

  it("gives the scratch lever no control and no printed trace", () => {
    const press = customIconConfig.fields.find((field) => field.id === "press");
    expect(press?.prop).toBeNull();
    expect(press?.when?.({} as PlaygroundState)).toBe(false);
    expect(snippet({ press: "pressed" })).toBe(snippet());
  });

  it("names only CustomIcon", () => {
    const code = snippet(HEAVY);
    expect(code).toContain('import { CustomIcon } from "@cjlapao/ui-kit";');
    expect(code.match(/<[A-Z][A-Za-z]*/g)).toEqual(["<CustomIcon"]);
  });

  it("wraps the tag rather than printing a wall of attributes", () => {
    const code = snippet(HEAVY);
    expect(code).toMatch(/\n\s+icon="Trash"/);
    expect(code).toMatch(/\n\s+disabled/);
    expect(code).not.toMatch(/ {10,}\w+=/);
  });
});
