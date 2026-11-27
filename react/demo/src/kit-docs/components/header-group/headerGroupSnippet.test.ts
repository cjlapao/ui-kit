import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { headerGroupConfig } from "./headerGroupPlayground";
import { headerGroupCode } from "./HeaderGroupPlayground";
import { HEADERGROUP_PROPS } from "./HeaderGroupPage";
import { CLUSTERS } from "./headerGroupFixture";
import { GAP_PX, RULE_PX, separatorOffset } from "./headerGroupStage";
import type { PlaygroundState, PlaygroundValue } from "../../shared/playground/schema";

/**
 * Header Group's snippet.
 *
 * Three things are worth defending here, all of them things a hand-written demo
 * gets wrong sooner or later:
 *
 *   - the printed clusters ARE the rendered clusters (`headerGroupFixture.tsx`,
 *     printed through `h.jsx`), so a fixture edit cannot leave the Code view
 *     describing buttons the preview never mounted;
 *   - the stage's own levers (how many clusters, how tall the bar, which
 *     direction, which surface, whether the rule is toned) are `prop: null` and
 *     must never appear as attributes;
 *   - the props that do print must print the way the union asks — `separatorSize`
 *     quoted for a named step, bare for a number (:88).
 */

/** The controls open on the config's own defaults, which are the component's. */
const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of headerGroupConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(headerGroupConfig, state);
  return headerGroupCode({ state, data: {}, h });
};

/** The `<HeaderGroup …>` opening tag, quote-aware so `{…}` values cannot end it. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<HeaderGroup");
  expect(start, "the element is printed").toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<HeaderGroup".length;
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

/** Attribute names on the printed element, in printed order. */
const attributes = (code: string): string[] => {
  const tag = openingTag(code);
  const named = [...tag.matchAll(/([A-Za-z][\w-]*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z][\w-]*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z][\w-]*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "HeaderGroup");
  return [...named, ...(flags ?? [])];
};

/** Every prop name the page documents, composite rows split apart. */
const documented = (): string[] =>
  HEADERGROUP_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/\s*\(inherited\)$/, ""))
      .filter((part) => part && part !== "…"),
  );

describe("the element", () => {
  it("opens with the key React wants and the name the group needs", () => {
    const code = snippet();
    // gap, itemGap, divider and separatorSize all sit on the component's own
    // defaults (:101-104), so the only lines left are the two that carry meaning.
    expect(attributes(code)).toEqual(["key", "label"]);
    expect(code).toContain("key={group.label}");
    expect(code).toContain("label={group.label}");
    expect(code).toContain("{group.content}");
  });

  it("opens on the values the component destructures", () => {
    const field = (id: string) =>
      headerGroupConfig.fields.find((candidate) => candidate.id === id);
    expect(field("gap")?.default).toBe("sm"); // :101
    expect(field("itemGap")?.default).toBe("xs"); // :102
    expect(field("divider")?.default).toBe(true); // :103
    expect(field("separatorSize")?.default).toBe("xs"); // :104
    // `tone` has no default at all (:105) — untoned is the component's answer, so
    // the docs' blue must not be presented as one. It has no `docDefault` for the
    // same reason: its own emit owns the bar.
    expect(field("tone")?.docDefault).toBeUndefined();
    expect(field("toned")?.prop, "toning is not a prop").toBeNull();
    expect(field("toned")?.default).toBe(false);
  });

  it("keeps the stage's levers out of the attributes", () => {
    const code = snippet({
      groups: 2,
      barHeight: 96,
      direction: "rtl",
      surface: "glass",
      toned: true,
      labelling: "unnamed",
      gap: "xl",
    });
    const tag = openingTag(code);
    for (const lever of [
      "groups",
      "barHeight",
      "direction",
      "surface",
      "toned",
      "labelling",
      "minWidth",
    ]) {
      expect(tag, lever).not.toMatch(new RegExp(`\\b${lever}=`, "i"));
    }
    // …but the bar they shape is printed, because the group is `h-full` (:153)
    // inside a flex row and a snippet without the bar is not runnable.
    expect(code).toContain('dir="rtl"');
    expect(code).toContain("style={{ height: 96 }}");
    expect(code).toContain('<Panel variant="glass" tone="neutral" padding="none">');
  });

  it("prints one attribute per prop the reader moved", () => {
    expect(attributes(snippet({ gap: "lg" }))).toEqual(["key", "gap", "label"]);
    expect(attributes(snippet({ divider: false }))).toEqual([
      "key",
      "divider",
      "label",
    ]);
    expect(snippet({ divider: false })).toContain("divider={false}");
    // Default-true prints nothing: the component already does this (:103).
    expect(openingTag(snippet({ divider: true }))).not.toMatch(/\bdivider/);
  });
});

describe("the rule", () => {
  it("quotes a step of the scale and leaves a number bare", () => {
    // `separatorSize?: ControlSize | number` (:88) — the wrong quotes here are a
    // type error in the reader's file.
    expect(snippet({ separatorSize: "md" })).toContain('separatorSize="md"');
    expect(snippet({ separatorSize: "2" })).toContain("separatorSize={2}");
    expect(snippet({ separatorSize: "5" })).toContain("separatorSize={5}");
    expect(openingTag(snippet({ separatorSize: "xs" }))).not.toMatch(
      /\bseparatorSize/,
    );
  });

  it("only mentions a tone once the reader asks for one", () => {
    // Untoned is not a colour the docs get to invent (:105,:177).
    expect(openingTag(snippet())).not.toMatch(/\btone=/);
    expect(openingTag(snippet({ toned: true }))).not.toMatch(/\btoned=/);
    expect(snippet({ toned: true, tone: "rose" })).toContain('tone="rose"');
    expect(headerGroupConfig.fields.find((f) => f.id === "tone")?.when).toBeDefined();
  });

  it("states the same arithmetic the component computes", () => {
    // The hint quotes these numbers, so they had better be the component's own.
    expect(GAP_PX.sm).toBe(8); // :7-13
    expect(RULE_PX.xs).toBe(1); // :28-34
    expect(separatorOffset("sm", "xs")).toBe(-5); // −round((8 + 1) / 2), :165-167
    expect(separatorOffset("xl", "xs")).toBe(-13); // the kit's own test agrees (:36)
    expect(separatorOffset("md", 2)).toBe(-7); // raw pixels, test :137
  });
});

describe("the fixture", () => {
  it("prints the clusters the preview mounts", () => {
    const code = snippet();
    for (const cluster of CLUSTERS) {
      expect(code, cluster.label).toContain(`label: ${JSON.stringify(cluster.label)}`);
    }
    // Walked from the rendered elements, not restated: an edit to the fixture has
    // to show up in the Code view or this fails.
    const printed = code.match(/<(IconButton|CustomIcon|Badge|Button)\b/g) ?? [];
    // Two + one + two + one: the count is restated on purpose, so an edit to the
    // fixture has to be an intentional one.
    expect(printed).toHaveLength(6);
    expect(code).toContain('<IconButton icon="Back"');
    expect(code).toContain('srLabel="Forward"');
    expect(code).toContain('<CustomIcon icon="ViewGrid"');
    expect(code).toContain("count={4}");
    expect(code).toContain(">Deploy</Button>");
    expect(code).toContain('import { Badge, Button, CustomIcon, HeaderGroup, IconButton, Panel } from "@cjlapao/ui-kit";');
  });

  it("prints the map, so a cluster is never hand-copied", () => {
    const code = snippet({ groups: 2 });
    expect(code).toContain("{GROUPS.slice(0, 2).map((group) => (");
    expect(code).toContain("export default function Demo() {");
    expect(code).not.toContain("GROUPS.slice(0, 4)");
    // The lever clamps: the fixture has four clusters, no more.
    expect(snippet({ groups: 99 })).toContain("GROUPS.slice(0, 4)");
    expect(snippet({ groups: 0 })).toContain("GROUPS.slice(0, 1)");
  });

  it("keeps the labels in the fixture even when the prop is off", () => {
    const code = snippet({ labelling: "unnamed" });
    expect(openingTag(code)).not.toMatch(/\blabel=/);
    // The data still carries them; the reader is told which is which by the tag.
    expect(code).toContain('label: "Navigation"');
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    // `key` is React's own, not one of the component's props (:72-97).
    const exempt = new Set(["key"]);
    for (const state of [
      {},
      { gap: "xl", itemGap: "lg" },
      { divider: false, separatorSize: "3" },
      { toned: true, tone: "emerald" },
      { labelling: "unnamed", className: "shrink-0" },
      { groups: 4, barHeight: 120, direction: "rtl", surface: "subtle" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        if (exempt.has(attribute)) continue;
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const rows = documented();
    for (const field of headerGroupConfig.fields) {
      if (field.prop === null) continue;
      expect(rows, field.prop ?? field.id).toContain(field.prop ?? field.id);
    }
  });

  it("never leaks the playground's own vocabulary", () => {
    const code = snippet({ toned: true, tone: "rose", labelling: "named" });
    expect(code).not.toContain("Playground");
    expect(code).not.toContain("state.");
    expect(code).not.toContain("undefined");
  });
});
