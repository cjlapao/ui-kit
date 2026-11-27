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

const OPENING: PlaygroundState = {
  size: "lg",
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

const attributes = (code: string): string[] => {
  const element = code.slice(code.indexOf("<AvatarGroup"), code.indexOf("/>"));
  return [...element.matchAll(/(?:^|\s)([A-Za-z]+)=/g)].map((match) => match[1]);
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
  it("prints the diff, not the whole prop list", () => {
    const code = snippet();
    expect(code).toContain('size="lg"');
    for (const leftAtItsDefault of ["tone", "rounded", "border", "expandOn", "maxVisible", "defaultExpanded", "singleRow"]) {
      expect(code).not.toContain(`${leftAtItsDefault}=`);
    }
  });

  it("prints what the reader switched on", () => {
    const code = snippet({ singleRow: true, maxVisible: "3", tone: "rose" });
    expect(code).toContain("singleRow");
    expect(code).toContain("maxVisible={3}");
    expect(code).toContain('tone="rose"');
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
    const printed = attributes(snippet({ singleRow: true, maxVisible: "8", tone: "rose" }));
    expect(printed.length).toBeGreaterThan(3);
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
