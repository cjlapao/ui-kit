import { describe, expect, it } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { iconsRegistryConfig } from "./iconsRegistryPlayground";
import { iconsRegistryCode } from "./IconsPlayground";
import { REGISTRY_PROPS } from "./IconsPage";
import { CUSTOM_ICON_PROPS } from "../custom-icon/CustomIconPage";
import { ALT_EXAMPLE, SIZE_DEFAULT } from "./iconsRegistryStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a module-level map, so it is tested as a
 * claim: at rest one `<CustomIcon>` asks for one thing — the name — every attribute
 * on it is a row of the *Custom Icon* page's table (that is where those props are
 * documented), the `registerIcons` calls are real calls in the order the registry
 * reads them, and none of the internals the page insists are internal
 * (`resolveIcon`, the subscription pair) ever reaches the code a reader is handed.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of iconsRegistryConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(iconsRegistryConfig, state);
  return iconsRegistryCode({ state, data: {}, h });
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

/**
 * The tag is a `CustomIcon`, so its attributes are owed to the page that documents
 * `CustomIcon` — a row that exists only on *this* page would be a prop the reader
 * cannot look up where they were sent.
 */
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
  ["batch", { batch: 3 }],
  ["batch (none)", { batch: 0 }],
  ["stack", { stack: true }],
  ["override", { override: true, stack: true }],
  ["afterPaint", { afterPaint: true }],
  ["target (built-in)", { target: "Star" }],
  ["target (nobody)", { target: "Unicorn" }],
  ["alt", { alt: ALT_EXAMPLE }],
  ["size", { size: "xl" }],
  ["tone", { tone: "emerald" }],
];

/** Every lever at once, which is also the only tag long enough to wrap. */
const HEAVY: Partial<PlaygroundState> = {
  batch: 3,
  stack: true,
  override: true,
  afterPaint: true,
  target: "Bars",
  // Long enough that the tag cannot fit on one line: the emitter must break it.
  alt: "Pulse-rate report for the ward overview",
  size: "xl",
  tone: "emerald",
};

/** Every state a reader can reach, plus the one that overflows a line. */
const ALL_STATES: Array<[string, Partial<PlaygroundState>]> = [
  ...EVERY_STATE,
  ["heavy", HEAVY],
];

describe("icon registry snippet", () => {
  it("asks the map for one thing at rest", () => {
    expect(attributes(snippet())).toEqual(["icon"]);
    expect(openingTag(snippet())).toContain('icon="Pulse"');
  });

  it("never prints a documented default onto the tag", () => {
    const code = snippet();
    expect(code).not.toContain("size=");
    expect(code).not.toContain("tone=");
    expect(code).not.toContain("alt=");
  });

  it("prints only attributes the Custom Icon page documents", () => {
    const rows = documented();
    for (const [label, changes] of ALL_STATES) {
      for (const name of attributes(snippet(changes))) {
        expect(rows.has(name), `${label} printed ${name}`).toBe(true);
      }
    }
  });

  it("registers the batch as one call, in registration order", () => {
    const code = snippet({ batch: 3 });
    expect(code).toContain(
      "registerIcons({ Pulse: PulseGlyph, Ring: RingGlyph, Bars: BarsGlyph });",
    );
    expect(code.match(/registerIcons\(/g)).toHaveLength(1);
  });

  it("keeps an empty batch a call, because the registry still runs it", () => {
    const code = snippet({ batch: 0 });
    expect(code).toContain("registerIcons({})");
    expect(code).toContain("notifies nobody");
    expect(code).not.toContain('"./glyphs"');
  });

  it("says where the batch is supposed to happen", () => {
    expect(snippet()).toContain("before the first render");
    expect(snippet({ afterPaint: true })).toContain("when the batch lands");
  });

  it("passes the override flag once, to the call that needs it", () => {
    expect(snippet({ stack: true })).not.toContain("override");
    const code = snippet({ stack: true, override: true });
    expect(code.match(/\{ override: true \}/g)).toHaveLength(2);
  });

  it("makes the claim a second call, never a second argument", () => {
    const code = snippet({ stack: true });
    expect(code.match(/registerIcons\(/g)).toHaveLength(2);
    // The claim takes the target name and the glyph the batch did not use.
    expect(code).toContain("registerIcons({ Pulse: RingGlyph }");
  });

  it("imports only the glyphs the emitted code names", () => {
    expect(snippet()).toContain('import { PulseGlyph } from "./glyphs";');
    expect(snippet({ batch: 2 })).toContain(
      'import { PulseGlyph, RingGlyph } from "./glyphs";',
    );
    expect(snippet({ stack: true })).toContain(
      'import { PulseGlyph, RingGlyph } from "./glyphs";',
    );
  });

  it("imports the two public names and none of the internals", () => {
    const code = snippet();
    expect(code).toContain(
      'import { CustomIcon, registerIcons } from "@cjlapao/ui-kit";',
    );
    for (const internal of [
      "resolveIcon",
      "subscribeIcons",
      "getIconRevision",
      "getServerIconRevision",
      "iconRegistry",
    ]) {
      expect(code, `${internal} is not public`).not.toContain(internal);
    }
  });

  it("prints the tag attributes in the order the props are declared", () => {
    expect(attributes(snippet(HEAVY))).toEqual([
      "icon",
      "alt",
      "size",
      "tone",
    ]);
  });

  it("keeps the component's own decisions out of the tag", () => {
    const code = snippet(HEAVY);
    const tag = openingTag(code);
    for (const leaked of [
      "role",
      "aria-hidden",
      "focusable",
      "className",
      "style",
      "width",
      "height",
      "colored",
      "spin",
      "customSize",
    ]) {
      expect(tag, `${leaked} is the component's business`).not.toContain(leaked);
    }
    for (const classOfIt of [
      "h-6 w-6",
      "animate-spin",
      "custom-icon",
      "--icon-hover-color",
      "text-emerald-500",
    ]) {
      expect(code, `${classOfIt} belongs to CustomIcon`).not.toContain(classOfIt);
    }
  });

  it("keeps a field that owns no prop off the tag entirely", () => {
    for (const id of ["batch", "stack", "override", "afterPaint"]) {
      const field = iconsRegistryConfig.fields.find((entry) => entry.id === id);
      expect(field?.prop, `${id} must never reach the tag`).toBeNull();
      expect(field?.emit?.(field?.default as PlaygroundValue, seeds(), {
        lit: (value: string) => JSON.stringify(value),
      } as never), `${id} prints nothing onto the tag`).toBeNull();
    }
  });

  it("documents no default the component does not have", () => {
    for (const id of ["alt", "tone", "target", "batch"]) {
      const field = iconsRegistryConfig.fields.find((entry) => entry.id === id);
      expect(field?.docDefault, `${id} has no documented default`).toBeUndefined();
    }
    const size = iconsRegistryConfig.fields.find((entry) => entry.id === "size");
    expect(size?.default).toBe(SIZE_DEFAULT);
    expect(size?.docDefault).toBe(SIZE_DEFAULT);
  });

  it("offers the five names a reader needs, and no duplicates", () => {
    const field = iconsRegistryConfig.fields.find((entry) => entry.id === "target");
    const values = (field?.kind === "choice" ? field.options : []).map(
      (option) => option.value,
    );
    expect(values).toEqual(["Pulse", "Ring", "Bars", "Star", "Unicorn"]);
    expect(new Set(values).size).toBe(values.length);
  });

  it("hides the override switch where no call would be refused", () => {
    const field = iconsRegistryConfig.fields.find((entry) => entry.id === "override");
    expect(field?.when?.(Object.assign(seeds(), { target: "Unicorn" }))).toBe(false);
    // Nobody holds `Unicorn`, so the claim goes through and no flag is needed.
    expect(
      field?.when?.(Object.assign(seeds(), { target: "Unicorn", stack: true })),
    ).toBe(false);
    // The batch has taken `Pulse` and the generated registry owns `Star` (:44).
    expect(field?.when?.(Object.assign(seeds(), { stack: true }))).toBe(true);
    expect(field?.when?.(Object.assign(seeds(), { target: "Star", stack: true }))).toBe(
      true,
    );
    // Asked with the flag already on, so the control does not unmount itself.
    expect(
      field?.when?.(Object.assign(seeds(), { target: "Star", stack: true, override: true })),
    ).toBe(true);
  });

  it("renders exactly one component in the demo", () => {
    for (const [label, changes] of ALL_STATES) {
      const code = snippet(changes);
      expect(code.match(/<[A-Z][A-Za-z]*/g), label).toEqual(["<CustomIcon"]);
    }
  });

  it("wraps the tag rather than overflowing, once everything is on", () => {
    expect(snippet(HEAVY)).toMatch(/\n\s+icon="Bars"/);
  });

  it("documents in the table every name the page tells a reader to use", () => {
    const rows = new Set(
      REGISTRY_PROPS.filter((prop) => !prop.name.startsWith("…")).map((prop) =>
        prop.name.trim(),
      ),
    );
    for (const name of [
      "iconRegistry",
      "IconName",
      "IconComponent",
      "registerIcons(icons, options?)",
      "icons",
      "options.override",
      "cleanup (return value)",
      "resolveIcon",
      "renderIcon",
    ]) {
      expect(rows.has(name), `${name} has no row`).toBe(true);
    }
  });

  it("says plainly which of those rows are not public", () => {
    const internal = REGISTRY_PROPS.filter((prop) =>
      /resolveIcon|subscribeIcons/.test(prop.name),
    );
    expect(internal.length).toBeGreaterThan(0);
    for (const row of internal) {
      expect(String(row.description)).toContain("Internal");
    }
  });
});
