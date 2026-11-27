import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { contentActionsConfig } from "./contentActionsPlayground";
import { contentActionsCode } from "./ContentActionsPlayground";
import { CONTENTACTIONS_PROPS } from "./ContentActionsPage";
import { ACTION_SETS, DEFAULT_TITLE } from "./contentActionsStage";
import type { PlaygroundState, PlaygroundValue } from "../../shared/playground/schema";

/**
 * Content Actions' snippet.
 *
 * The component has four props and one behavioural quirk worth defending in a
 * test: the actions region either exists or does not (`actions != null &&
 * typeof actions !== "boolean"`, ContentActions.tsx:25), and the Code view must
 * fall silent when it does not — printing `actions={null}` would describe a
 * region the preview is not showing. The other assertions hold the snippet to
 * the preview: same actions, same order, same classes on the children.
 */

/** The controls open on the config's own defaults, which are the component's. */
const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of contentActionsConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(contentActionsConfig, state);
  return contentActionsCode({ state, data: {}, h });
};

/**
 * The opening tag, quote-aware: attribute values may legitimately contain `>`
 * (`actionsClassName="[&>*]:shrink-0"`), so the tag cannot end at the first one.
 */
const openingTag = (code: string): string => {
  const start = code.indexOf("<ContentActions");
  expect(start, "the element is printed").toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<ContentActions".length;
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

/** Attribute names on the printed `<ContentActions …>`, in printed order. */
const attributes = (code: string): string[] => {
  const tag = openingTag(code);
  const named = [...tag.matchAll(/([A-Za-z][\w-]*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z][\w-]*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z][\w-]*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "ContentActions");
  return [...named, ...(flags ?? [])];
};

/** Every prop name the page documents, composite rows split apart. */
const documented = (): string[] =>
  CONTENTACTIONS_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/\s*\(inherited\)$/, ""))
      .filter((part) => part && part !== "…"),
  );

describe("the opening", () => {
  it("prints the content class and the row of actions", () => {
    const code = snippet();
    // gap, align and the root aria-label all open on the component's own values
    // (:18-19), so only the two class hooks and the region's existence print.
    expect(attributes(code)).toEqual(["contentClassName", "actions"]);
    expect(code).toContain('contentClassName="overflow-hidden"');
    expect(code).toContain("actions={ACTIONS}");
    expect(code).toContain('import { ContentActions, ExpandableButton } from "@cjlapao/ui-kit";');
    for (const untouched of ["gap", "align", "actionsClassName", "aria-label"]) {
      expect(openingTag(code), untouched).not.toContain(`${untouched}=`);
    }
  });

  it("opens on the values the component destructures", () => {
    const field = (id: string) => contentActionsConfig.fields.find((f) => f.id === id);
    expect(field("gap")?.default).toBe("md"); // :18
    expect(field("align")?.default).toBe("start"); // :19
    // Not the component's defaults, and still printed: their own emit owns the bar.
    expect(field("contentClassName")?.default).toBe("overflow-hidden"); // :32 adds no class
    expect(field("contentClassName")?.docDefault).toBeUndefined();
    expect(field("actionsClassName")?.default).toBe(""); // :41 adds no class
    expect(field("ariaLabel")?.default).toBe("absent"); // :26-47 applies no name
    // Stage levers are not props: the box width and the two strings live nowhere
    // in the API (:9-12), so they must never reach the reader's snippet.
    for (const lever of ["width", "title", "summary"]) {
      expect(field(lever)?.prop, lever).toBeNull();
    }
  });

  it("prints the children the preview renders, classes included", () => {
    const code = snippet();
    expect(code).toContain(
      `<h3 className="truncate text-lg font-semibold">${DEFAULT_TITLE}</h3>`,
    );
    expect(code).toContain('<p className="line-clamp-3 text-sm opacity-70">');
    expect(code).toContain("</ContentActions>");
    // Children, not a prop: the content region renders whatever it is given.
    expect(openingTag(code)).not.toMatch(/\bchildren=/);
  });
});

describe("the actions region", () => {
  it("falls silent when there are no actions", () => {
    // :25 rejects undefined, null and false alike and :35 skips the row, so the
    // honest snippet says nothing about actions at all.
    const code = snippet({ actions: "none" });
    expect(attributes(code)).toEqual(["contentClassName"]);
    expect(code).not.toContain("const ACTIONS");
    expect(code).not.toContain("actions=");
    expect(code).not.toContain("ExpandableButton");
    // The content region is untouched by the omission.
    expect(code).toContain("Brainstormer");
  });

  it("prints the same actions the preview renders, in the same order", () => {
    const code = snippet({ actions: "six" });
    const printed = code.match(/<ExpandableButton/g) ?? [];
    expect(printed).toHaveLength(ACTION_SETS.six.length);
    for (const action of ACTION_SETS.six) {
      expect(code, action.label).toContain(`label="${action.label}"`);
    }
    // Order preserved, not sorted: the row is reading order for a reason.
    expect(code.indexOf("Duplicate agent")).toBeLessThan(
      code.indexOf("Delete agent"),
    );
    expect(code).toContain('color="rose"');
    expect(code.indexOf("<ExpandableButton")).toBeLessThan(code.indexOf("<h3"));
  });

  it("keeps the destructive action the only tinted one", () => {
    const code = snippet({ actions: "three" });
    expect((code.match(/color="rose"/g) ?? []).length).toBe(1);
    expect(code).not.toContain('color="neutral"');
  });

  it("prints one action without inventing a list", () => {
    const code = snippet({ actions: "one" });
    expect((code.match(/<ExpandableButton/g) ?? [])).toHaveLength(1);
    expect(code).toContain("Edit agent");
    expect(code).not.toContain("Duplicate agent");
  });
});

describe("the two rows", () => {
  it("prints gap and align only when they leave the defaults", () => {
    expect(snippet({ gap: "xl" })).toContain('gap="xl"');
    expect(openingTag(snippet({ gap: "md" }))).not.toMatch(/\bgap=/);
    expect(snippet({ align: "center" })).toContain('align="center"');
    expect(openingTag(snippet({ align: "start" }))).not.toMatch(/\balign=/);
  });

  it("keeps the attribute order the page explains", () => {
    const code = snippet({
      gap: "lg",
      align: "end",
      actionsClassName: "px-2",
      ariaLabel: "Agent header",
    });
    expect(attributes(code)).toEqual([
      "gap",
      "align",
      "contentClassName",
      "actions",
      "actionsClassName",
      "aria-label",
    ]);
    expect(code).toContain('actionsClassName="px-2"');
    expect(code).toContain('aria-label="Agent header"');
  });

  it("treats a blank class as an absent prop", () => {
    // :32 and :41 add no classes of their own beyond the layout ones, so an empty
    // control must not print contentClassName="".
    expect(openingTag(snippet({ contentClassName: "   " }))).not.toMatch(
      /\bcontentClassName=/,
    );
    expect(openingTag(snippet({ actionsClassName: "" }))).not.toMatch(
      /\bactionsClassName=/,
    );
    expect(openingTag(snippet({ ariaLabel: "absent" }))).not.toMatch(/\baria-label=/);
  });

  it("prints an element with no children once both strings are cleared", () => {
    const code = snippet({ title: "", summary: "" });
    expect(code).not.toContain("<h3");
    expect(code).not.toContain("<p ");
    expect(code).not.toContain("</ContentActions>");
    expect(openingTag(code)).toMatch(/\/>$/);
  });

  it("keeps the paragraph when only the title is cleared", () => {
    const code = snippet({ title: "" });
    expect(code).not.toContain("<h3");
    expect(code).toContain("line-clamp-3");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { actions: "none" },
      { actions: "six", gap: "xl", align: "center" },
      { actions: "one", contentClassName: "", actionsClassName: "px-2" },
      { ariaLabel: "Agent header", title: "", summary: "" },
      { width: 200, gap: "xs" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const rows = documented();
    for (const field of contentActionsConfig.fields) {
      if (field.prop === null) continue;
      expect(rows, field.prop ?? field.id).toContain(field.prop ?? field.id);
    }
  });

  it("never prints the stage's own levers", () => {
    const code = snippet({
      width: 320,
      title: "Renamed",
      summary: "",
      actions: "six",
      gap: "lg",
    });
    const tag = openingTag(code);
    for (const lever of ["width", "title", "summary", "minWidth", "min-width"]) {
      expect(tag, lever).not.toMatch(new RegExp(`\\b${lever}=`, "i"));
    }
    expect(code).not.toContain("Playground");
    expect(code).not.toContain("resize-x");
  });
});
