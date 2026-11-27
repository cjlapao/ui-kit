import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { appDividerConfig } from "./appDividerPlayground";
import { appDividerCode } from "./AppDividerPlayground";
import { APP_DIVIDER_PROPS } from "./AppDividerPage";
import { LABEL_NODE_JSX, LABEL_TEXT } from "./appDividerStage";
import type { PlaygroundState, PlaygroundValue } from "../../shared/playground/schema";

/**
 * App Divider's snippet.
 *
 * A divider has almost nothing to print, which makes the few decisions it does
 * make worth pinning: that the opening is one attribute wide because the label is
 * the only thing the defaults disagree with, that `length` is an expression (a
 * quoted `length="24"` is the wrong type — AppDivider.tsx:89 takes `string |
 * number`), that `decorative` keeps its three states instead of collapsing into a
 * flag, and that a placement cannot be printed for a label that is not there,
 * because :199-204 only run inside the labelled layout. Each assertion fails if a
 * default drifts or if the stage's furniture leaks into the reader's source.
 */

/** The controls open on the config's own defaults, which are the component's. */
const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of appDividerConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(appDividerConfig, state);
  // No data sources: a divider's only content is its label, and both sides of
  // that come from the same stage constants the preview renders.
  return appDividerCode({ state, data: {}, h });
};

/** The element itself, comment and imports excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<AppDivider");
  // Self-closing (`h.element` with no children) and the label node holds no
  // `/>`, so this is the whole tag rather than the first nested one.
  return code.slice(open, code.indexOf("/>", open) + 2);
};

/** Attribute names on the printed `<AppDivider …>`, in printed order. */
const attributes = (code: string): string[] => {
  const tag = tagOf(code);
  const named = [...tag.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "AppDivider");
  return [...named, ...(flags ?? [])];
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  APP_DIVIDER_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/\s*\(inherited\)$/, ""))
      .filter((part) => part && part !== "…"),
  );

describe("the opening", () => {
  it("prints nothing but the label", () => {
    const code = snippet();
    // Everything else opens on the value AppDivider.tsx:94-108 destructures;
    // the label is a docs choice, and its presence is what makes the rule a
    // separator (:130), so it has to be said.
    expect(attributes(code)).toEqual(["label"]);
    expect(tagOf(code)).toContain(`label="${LABEL_TEXT}"`);
    for (const untouched of [
      "orientation",
      "variant",
      "tone",
      "size",
      "spacing",
      "length",
      "labelPosition",
      "decorative",
      "className",
    ]) {
      expect(tagOf(code), untouched).not.toContain(`${untouched}=`);
    }
    expect(code).toContain('import { AppDivider } from "@cjlapao/ui-kit";');
  });

  it("opens on the values the component destructures", () => {
    const field = (id: string) => appDividerConfig.fields.find((f) => f.id === id);
    expect(field("orientation")?.default).toBe("vertical"); // :56
    expect(field("variant")?.default).toBe("solid"); // :66
    expect(field("size")?.default).toBe("xs"); // :98
    expect(field("spacing")?.default).toBe("sm"); // :103
    expect(field("labelPosition")?.default).toBe("center"); // :107
    // Both three-state props open on absence, not on a value.
    expect(field("length")?.default).toBe("auto"); // :117
    expect(field("decorative")?.default).toBe("auto"); // :130
    // An untoned rule is the useful default (:170), and the swatch row spells
    // that out instead of passing tone="none", which is not in TrueColor.
    expect(field("tone")?.default).toBe("none");
    expect(field("tone")?.prop).toBe("tone");
    // The stage's own decisions are not props and must never print.
    for (const lever of ["withLabel", "labelKind", "context"]) {
      expect(field(lever)?.prop, lever).toBeNull();
    }
  });

  it("keeps the preview's card out of the reader's source", () => {
    const code = snippet({ context: "liquid-glass", labelKind: "badge" });
    // `Sits on` is a stage decision: the Panel is how the docs show the rule
    // adapting, not part of using a divider.
    expect(code).not.toContain("Panel");
    expect(tagOf(code)).not.toMatch(/\bcontext=/);
  });
});

describe("the label", () => {
  it("prints a text label as a string and a node label as an expression", () => {
    expect(tagOf(snippet({ label: "NEW" }))).toContain('label="NEW"');
    const badge = snippet({ labelKind: "badge" });
    expect(badge).toContain(`label={${LABEL_NODE_JSX}}`);
    expect(badge).toContain('import { AppDivider, Pill } from "@cjlapao/ui-kit";');
    // The node form must not be quoted, and the text form must not be braced.
    expect(tagOf(badge)).not.toContain('label="');
    expect(tagOf(snippet())).not.toContain("label={");
  });

  it("says nothing about a label that is not there", () => {
    const bare = snippet({ withLabel: false, labelPosition: "start" });
    expect(tagOf(bare)).not.toContain("label");
    // :199-204 only run inside the labelled layout, so a placement for a
    // missing label describes a prop the component cannot see.
    expect(tagOf(bare)).not.toContain("labelPosition");
    expect(tagOf(snippet({ label: "   " }))).not.toContain("label");
    expect(tagOf(snippet({ label: "", labelKind: "badge" }))).not.toContain("label=");
  });

  it("names a placement only while one applies", () => {
    expect(snippet({ labelPosition: "end" })).toContain('labelPosition="end"');
    expect(snippet({ labelPosition: "start" })).toContain('labelPosition="start"');
    // Center is the destructured default (:107), so it is not worth printing.
    expect(tagOf(snippet({ labelPosition: "center" }))).not.toContain(
      "labelPosition",
    );
  });
});

describe("the three-state props", () => {
  it("keeps decorative a tri-state instead of a flag", () => {
    // Absent means `!label` (:130), which is neither true nor false.
    expect(tagOf(snippet({ decorative: "auto" }))).not.toContain("decorative");
    expect(snippet({ decorative: "yes" })).toContain("decorative={true}");
    expect(snippet({ decorative: "no" })).toContain("decorative={false}");
    // A bare `decorative` would mean true, and `decorative={true}` on a labelled
    // rule is a real override — both are spelled out, never abbreviated.
    expect(tagOf(snippet({ decorative: "yes" }))).not.toMatch(/\sdecorative(?!=)/);
  });

  it("prints length as an expression and keeps auto absent", () => {
    // :89 `length?: string | number` — a quoted number is the wrong type.
    expect(snippet({ length: "24" })).toContain("length={24}");
    expect(tagOf(snippet({ length: "24" }))).not.toContain('length="24"');
    // Auto is the orientation-dependent fallback (:117): 1.5rem vertical,
    // 100% horizontal. Printing either would contradict the other orientation.
    expect(tagOf(snippet({ length: "auto" }))).not.toContain("length");
  });

  it("prints a tone the reader picked and no tone otherwise", () => {
    expect(tagOf(snippet({ tone: "amber" }))).toContain('tone="amber"');
    expect(tagOf(snippet({ tone: "none" }))).not.toContain("tone");
    // `tone="none"` is not a thing: tone is TrueColor, absence is the neutral.
    expect(snippet({ tone: "none" })).not.toContain('tone="none"');
  });
});

describe("the pass-through", () => {
  it("prints a class name only once there is one", () => {
    expect(tagOf(snippet({ className: "opacity-60" }))).toContain(
      'className="opacity-60"',
    );
    expect(tagOf(snippet({ className: "" }))).not.toContain("className");
    expect(tagOf(snippet({ className: "   " }))).not.toContain("className");
  });

  it("never prints the levers themselves", () => {
    const code = snippet({
      withLabel: true,
      labelKind: "badge",
      context: "plain",
      decorative: "no",
      length: "48",
    });
    for (const lever of ["withLabel", "labelKind", "context"]) {
      expect(tagOf(code), lever).not.toMatch(new RegExp(`\\b${lever}=`));
    }
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { orientation: "horizontal", variant: "gradient" },
      { tone: "blue", size: "lg", spacing: "none", length: "96" },
      { labelKind: "badge", labelPosition: "end", decorative: "yes" },
      { withLabel: false, decorative: "no", className: "mt-4" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      appDividerConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("leaves the deprecated aliases out of the playground", () => {
    // height / width / margin are honoured (:117-128) and documented, but the
    // playground prints the props a reader should write.
    for (const alias of ["height", "width", "margin"]) {
      expect(appDividerConfig.fields.map((f) => f.prop ?? f.id)).not.toContain(alias);
      expect(documented(), alias).toContain(alias);
    }
  });
});
