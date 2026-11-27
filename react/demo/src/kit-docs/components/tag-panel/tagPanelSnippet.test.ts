import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { tagPanelConfig } from "./tagPanelPlayground";
import { tagPanelCode } from "./TagPanelPlayground";
import { TAGPANEL_PROPS } from "./TagPanelPage";
import { EMPTY_BLOCK, HEADER_ACTIONS, TAG_UNIVERSE } from "./tagPanelFixture";
import { TAG_LIMIT_DEFAULT } from "./tagPanelStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about `TagPanel.tsx`, so it is tested as a
 * claim: the required `tags` always arrives, the fold's two levers print and
 * nothing that the component has already decided prints — no chip tone without a
 * chip, no header props without a header, and no `expanded` at all, because there
 * is no such prop to give.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of tagPanelConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(tagPanelConfig, state);
  return tagPanelCode({ state, data: {}, h });
};

/** The `<TagPanel …>` tag itself, so assertions cannot hit a fixture's props. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<TagPanel");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<TagPanel".length;
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
 * braces and string literals — a flat regex would find `label` inside the tags
 * const and report it as the panel's own prop.
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

/** The props the API table vouches for, including the rows that share a line. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const prop of TAGPANEL_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** Every lever at a value that differs from its default, so nothing hides. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["at rest", {}],
  ["three tags", { tagCount: "3" }],
  ["plain deck", { deck: "plain" }],
  ["mixed deck", { deck: "mixed" }],
  ["no header", { header: "without", subtitle: "in use", noPadding: true, actions: true }],
  ["no title", { title: "   " }],
  ["limit off", { tagLimit: 0, overflowTone: "rose" }],
  ["tight fold", { tagLimit: 2, overflowTone: "amber" }],
  ["big pills", { tagSize: "lg" }],
  ["big header", { size: "lg", variant: "bordered", noPadding: true }],
  ["with actions", { actions: true }],
  ["empty", { body: "empty" }],
  ["empty with copy", { body: "empty", emptyMessage: " Nothing yet " }],
  ["empty with a block", { body: "empty", emptyState: true }],
  ["classes", { className: " max-w-sm ", bodyClassName: " gap-0 " }],
];

describe("tagPanel snippet", () => {
  it("always passes the tags it is showing", () => {
    for (const [name, changes] of EVERY_STATE) {
      expect(attributes(snippet(changes)), name).toContain("tags");
    }
    expect(openingTag(snippet())).toContain("tags={TAGS}");
  });

  it("hoists the entries the preview mounted, not a paraphrase of them", () => {
    const code = snippet({ deck: "mixed" });
    expect(code).toContain("const TAGS = [");
    expect(code).toContain(`label: "prod"`);
    expect(code).toContain(`label: "gpu"`);
    expect(code).toContain(`icon: <CustomIcon icon="Server" size="xs" />`);
    expect(code).toMatch(/\/\/ The caller's own entries/);
  });

  it("prints plain entries when the deck is plain", () => {
    const code = snippet({ deck: "plain" });
    expect(code).toContain('{ label: "prod" }');
    expect(code).not.toContain("tone:");
    expect(code).not.toContain("CustomIcon");
  });

  it("draws every tag the reader counted, and no more", () => {
    expect(snippet({ tagCount: "3" }).split('{ label: "').length - 1).toBe(3);
    expect(snippet({ tagCount: "3" })).not.toContain('"canary"');
    expect(snippet({ tagCount: "8" }).split('{ label: "').length - 1).toBe(
      TAG_UNIVERSE,
    );
  });

  it("makes no tags an empty array, which is the only way to the empty state", () => {
    const code = snippet({ body: "empty", deck: "mixed" });
    expect(code).toContain("const TAGS = [];");
    expect(code).not.toContain("tone:");
    expect(openingTag(code)).toContain("tags={TAGS}");
  });

  it("prints the limit as a number in braces, and leaves 5 out (:96)", () => {
    expect(TAG_LIMIT_DEFAULT).toBe(5);
    expect(attributes(snippet())).not.toContain("tagLimit");
    expect(openingTag(snippet({ tagLimit: 3 }))).toContain("tagLimit={3}");
    expect(openingTag(snippet({ tagLimit: 0 }))).toContain("tagLimit={0}");
  });

  it("gives the chip a tone only while there is a chip to give it to (:139)", () => {
    // A fold of three out of eight is a chip, so its tone is a real prop.
    expect(attributes(snippet())).not.toContain("overflowTone");
    expect(openingTag(snippet({ tagLimit: 3, overflowTone: "rose" }))).toContain(
      'overflowTone="rose"',
    );
    // A limit of 0 folds nothing, so the tone the reader left behind is not a
    // prop the code should claim.
    expect(attributes(snippet({ tagLimit: 0, overflowTone: "rose" }))).not.toContain(
      "overflowTone",
    );
    expect(
      attributes(snippet({ tagCount: "3", overflowTone: "rose" })),
    ).not.toContain("overflowTone");
    // A limit at the count folds nothing, so it draws no chip either (:139).
    expect(
      attributes(snippet({ tagLimit: 8, overflowTone: "rose" })),
    ).not.toContain("overflowTone");
  });

  it("keeps the documented sizes and header style out of the tag", () => {
    expect(attributes(snippet())).not.toContain("tagSize");
    expect(openingTag(snippet({ tagSize: "lg" }))).toContain('tagSize="lg"');
    expect(attributes(snippet())).not.toContain("size");
    expect(openingTag(snippet({ size: "lg" }))).toContain('size="lg"');
    expect(attributes(snippet())).not.toContain("variant");
    expect(openingTag(snippet({ variant: "bordered" }))).toContain(
      'variant="bordered"',
    );
  });

  it("prints noPadding as the bare name it is", () => {
    expect(attributes(snippet())).not.toContain("noPadding");
    expect(openingTag(snippet({ noPadding: true }))).toMatch(/\snoPadding(?!=)/);
  });

  it("hides every header prop when there is no header (:216)", () => {
    const codes = attributes(
      snippet({
        header: "without",
        title: "Labels",
        subtitle: "in use",
        noPadding: true,
        actions: true,
      }),
    );
    for (const name of ["title", "subtitle", "noPadding", "actions"]) {
      expect(codes, name).not.toContain(name);
    }
  });

  it("drops a blank title, subtitle or class rather than printing empty strings", () => {
    expect(attributes(snippet({ title: "   " }))).not.toContain("title");
    expect(attributes(snippet({ subtitle: "  " }))).not.toContain("subtitle");
    expect(attributes(snippet({ className: "  " }))).not.toContain("className");
    expect(openingTag(snippet({ title: "  Labels  " }))).toContain(
      'title="Labels"',
    );
    expect(openingTag(snippet({ bodyClassName: "  gap-0  " }))).toContain(
      'bodyClassName="gap-0"',
    );
  });

  it("hoists the header actions it prints a reference to", () => {
    const code = snippet({ actions: true });
    expect(openingTag(code)).toContain("actions={HEADER_ACTIONS}");
    expect(code).toContain("const HEADER_ACTIONS = ");
    expect(code).toContain("Manage tags");
    expect(code).toContain("Button");
    // Without the toggle there is nothing to hoist and nothing to import.
    expect(snippet()).not.toContain("HEADER_ACTIONS");
  });

  it("lets a caller bring their own empty block, copy included", () => {
    const code = snippet({
      body: "empty",
      emptyState: true,
      emptyMessage: "Nope",
    });
    expect(openingTag(code)).toContain("emptyState={EMPTY_BLOCK}");
    expect(code).toContain("const EMPTY_BLOCK = ");
    expect(code).toContain("Nothing tagged");
    // The block replaces the whole thing, so the copy the reader typed has no
    // prop left to sit on (:242-248).
    expect(attributes(code)).not.toContain("emptyMessage");
  });

  it("prints the translated copy's absence, not the copy itself (:246)", () => {
    expect(openingTag(snippet({ body: "empty" }))).not.toContain("emptyMessage");
    expect(openingTag(snippet({ body: "empty", emptyMessage: "  Nope  " }))).toContain(
      'emptyMessage="Nope"',
    );
  });

  it("keeps the attributes in the order the controls are listed", () => {
    expect(
      attributes(
        snippet({
          title: "Labels",
          subtitle: "in use",
          tagLimit: 3,
          overflowTone: "amber",
          tagSize: "lg",
          size: "lg",
          variant: "bordered",
          noPadding: true,
          actions: true,
          className: "max-w-sm",
          bodyClassName: "gap-0",
        }),
      ),
    ).toEqual([
      "tags",
      "title",
      "subtitle",
      "tagLimit",
      "overflowTone",
      "tagSize",
      "size",
      "variant",
      "noPadding",
      "actions",
      "className",
      "bodyClassName",
    ]);
  });

  it("names the panel and only what it actually used", () => {
    expect(snippet()).toContain('import { TagPanel } from "@cjlapao/ui-kit";');
    expect(snippet({ deck: "mixed" })).toContain("CustomIcon");
    expect(snippet({ actions: true })).toContain("Button");
    for (const [, changes] of EVERY_STATE) {
      const imports = snippet(changes).match(/import \{([^}]*)\} from "@cjlapao\/ui-kit";/);
      expect(imports, "one import line").not.toBeNull();
      expect(imports![1].split(",").map((name) => name.trim())).toContain("TagPanel");
    }
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
    for (const field of tagPanelConfig.fields) {
      if (typeof field.prop !== "string") continue;
      expect(table.has(field.prop), `undocumented prop ${field.prop}`).toBe(true);
    }
  });

  it("keeps what the component owns out of the tag", () => {
    // The fold is internal state, and the chip's semantics are the kit's
    // (:112-118,:266-297) — a caller can neither ask for nor override them.
    const never = [
      "expanded",
      "defaultExpanded",
      "onExpandedChange",
      "collapsing",
      "role",
      "aria-expanded",
      "aria-controls",
      "aria-label",
      "tone",
      "icon",
      "loop",
    ];
    for (const [, changes] of EVERY_STATE) {
      const tag = openingTag(snippet(changes));
      for (const name of never) {
        expect(tag, `${name} leaked`).not.toContain(`${name}=`);
      }
      expect(attributes(snippet(changes))).not.toContain("expanded");
      expect(attributes(snippet(changes))).not.toContain("icon");
    }
  });

  it("mounts and prints the same blocks it hoists", () => {
    // The two blocks the Code view hoists are the very elements the preview
    // passes, so a drift in the fixture is a drift in the claim.
    expect(typeof HEADER_ACTIONS).toBe("object");
    expect(typeof EMPTY_BLOCK).toBe("object");
    expect(snippet({ body: "empty", emptyState: true })).toContain(
      "const EMPTY_BLOCK = ",
    );
  });
});
