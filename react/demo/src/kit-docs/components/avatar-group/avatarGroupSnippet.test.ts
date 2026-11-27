import { describe, it, expect } from "vitest";
import { createEmitter, defaultDeclarations } from "../../shared/playground/emit";
import { avatarGroupConfig } from "./avatarGroupPlayground";
import { AVATAR_GROUP_PROPS } from "./AvatarGroupPage";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * AvatarGroup's snippet: the declarative shape every remaining docs page will
 * take, and the one place the engine's honesty is checked against the component
 * itself rather than against itself — every attribute the Code view prints has
 * to be a row of the page's own API table.
 */

/** What the controls show on load: `AvatarGroup`'s own defaults, unedited. */
const OPENING: PlaygroundState = {
  size: "md",
  padding: "none",
  tone: "blue",
  rounded: "full",
  border: true,
  expandOn: "click",
  maxVisible: "5",
  defaultExpanded: false,
  singleRow: false,
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  // `Partial` of a Record adds `undefined` to every member, which the engine
  // never sees: a change names a declared option or `set` throws.
  const state = Object.assign({}, OPENING, changes) as PlaygroundState;
  const h = createEmitter(avatarGroupConfig, state);
  return h.snippet({
    imports: ["AvatarGroup"],
    decls: defaultDeclarations(avatarGroupConfig, state, h),
    body: h.demo(h.element("AvatarGroup", h.props(), 2)),
  });
};

/** Every attribute the element prints, `singleRow` shorthand included. */
const attributes = (code: string): string[] => {
  const element = code.slice(code.indexOf("<AvatarGroup") + "<AvatarGroup".length, code.indexOf("/>"));
  const named = [...element.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = element
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|$)/g)
    ?.map((flag) => flag.trim());
  return [...named, ...(flags ?? [])];
};

describe("the roster", () => {
  it("is declared as data, with the line that says how it was made", () => {
    const code = snippet();
    expect(code).toContain("// The roster — seven people and two app chips");
    expect(code).toContain("const ROSTER = [");
    expect(code).toContain('{ name: "Ada Lovelace" }');
    expect(code).toContain('{ name: "PostgreSQL", icon: "Database", tone: "emerald" }');
  });

  it("is handed to the component by name, not spelled out inside the element", () => {
    const code = snippet();
    expect(code).toContain("items={ROSTER}");
    // Nine chips inline would make the element unreadable, and it is not what
    // the reader came to see.
    expect(code.slice(code.indexOf("<AvatarGroup"))).not.toContain("Ada Lovelace");
  });
});

describe("the element", () => {
  it("opens as minimal as the component's own defaults", () => {
    // The controls open on the kit's defaults, so the Code view has nothing to
    // say yet beyond the data it was handed.
    const code = snippet();
    expect(attributes(code)).toEqual(["items"]);
    for (const untouched of ["size", "tone", "rounded", "border", "expandOn", "maxVisible", "defaultExpanded", "singleRow", "padding"]) {
      expect(code).not.toContain(`${untouched}=`);
    }
  });

  it("prints what the reader switched on", () => {
    const code = snippet({ size: "lg", singleRow: true, maxVisible: "3", tone: "rose", padding: "md" });
    expect(code).toContain('size="lg"');
    expect(code).toContain("singleRow");
    expect(code).toContain("maxVisible={3}");
    expect(code).toContain('tone="rose"');
    expect(code).toContain('padding="md"');
    // A prop left at its default stays out, even next to one that moved.
    expect(code).not.toContain("expandOn=");
  });

  it("stacks its attributes once they no longer fit", () => {
    const code = snippet({
      singleRow: true,
      defaultExpanded: true,
      border: false,
      maxVisible: "8",
      tone: "fuchsia",
      rounded: "md",
      expandOn: "hover",
    });
    const element = code.slice(code.indexOf("<AvatarGroup"), code.indexOf("/>"));
    expect(element.split("\n").length).toBeGreaterThan(3);
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const documented = AVATAR_GROUP_PROPS.map((row) => row.name);
    const printed = attributes(snippet({ singleRow: true, maxVisible: "8", tone: "rose", size: "lg", padding: "md" }));
    expect(printed).toEqual(expect.arrayContaining(["items", "singleRow", "maxVisible", "tone", "size", "padding"]));
    expect(printed.filter((name) => !documented.includes(name))).toEqual([]);
  });

  it("covers every prop the playground can speak for", () => {
    // A field whose id is neither a prop nor an intentional lever is a typo
    // waiting to render nothing; the switch above catches the printing half.
    const documented = AVATAR_GROUP_PROPS.map((row) => row.name);
    for (const field of avatarGroupConfig.fields) {
      if (field.prop === null) continue;
      expect(documented, `field "${field.id}"`).toContain(field.prop ?? field.id);
    }
  });
});
