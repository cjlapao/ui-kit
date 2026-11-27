import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { collapsiblePanelConfig } from "./collapsiblePanelPlayground";
import { collapsiblePanelCode } from "./CollapsiblePanelPlayground";
import { COLLAPSIBLE_PANEL_PROPS } from "./CollapsiblePanelPage";
import {
  LOG_LINES,
  RICH_TITLE_JSX,
  SUBTITLE_TEXT,
  TITLE_TEXT,
} from "./collapsiblePanelStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * Collapsible Panel's snippet.
 *
 * The component is one of two, decided at :267 by `typeof expanded === "boolean"`
 * — an absent `expanded` is the uncontrolled card, `expanded={false}` is the
 * controlled one — and a second axis decides whether the body scrolls under
 * `contentMaxHeight` at all (:216-223). Both are facts the controls encode and
 * the props cannot state on their own, so the printed snippet has to keep them
 * apart: no `defaultExpanded` beside a controlled card, no height cap beside
 * `fillHeight`. These tests are the guard.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  // Every field carries the component's own default (:238-260); the cast is for
  // the type, which has no undefined, not for the data.
  for (const field of collapsiblePanelConfig.fields)
    state[field.id] = field.default as PlaygroundValue;
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const data = Object.fromEntries(
    (collapsiblePanelConfig.data ?? []).map((source) => [
      source.id,
      source.when ? (source.when(state) ? source.value(state) : "") : source.value(state),
    ]),
  );
  return collapsiblePanelCode({
    state,
    data,
    h: createEmitter(collapsiblePanelConfig, state),
  });
};

/** The element itself — comments, declarations and children excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<CollapsiblePanel");
  return code.slice(open, code.indexOf(">", open) + 1);
};

/** Attribute names on the printed element, in printed order. */
const attributes = (code: string): string[] => {
  const tag = tagOf(code);
  const named = [...tag.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "CollapsiblePanel");
  return [...named, ...(flags ?? [])];
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  COLLAPSIBLE_PANEL_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/[^A-Za-z]\w*$/, ""))
      .filter((part) => part && !part.startsWith("…")),
  );

describe("the opening", () => {
  it("prints the header and the action, and nothing the component already answers", () => {
    // elevated, tone none, rounded-md, sm, no transparency, 320, uncontrolled
    // and closed-by-default are all the component's own answers (:238-260), so
    // the honest opening carries only what the docs chose and what is required.
    expect(attributes(snippet())).toEqual(["actions", "title", "subtitle"]);
  });

  it("declares the header action as a node and points the prop at it", () => {
    const code = snippet();
    expect(code).toContain(
      'const ACTIONS = <Button size="xs" variant="ghost">Refresh</Button>;',
    );
    expect(tagOf(code)).toContain("actions={ACTIONS}");
    expect(code).toContain("Button");
    // The markup appears once: the tag references the const.
    expect(code.split(">Refresh<").length - 1).toBe(1);
  });

  it("keeps the card's surface answers out while they are still the defaults", () => {
    const tag = tagOf(snippet());
    for (const prop of [
      "variant",
      "tone",
      "corner",
      "padding",
      "raisedSurface",
      "hoverable",
      "transparency",
    ]) {
      expect(tag, prop).not.toContain(prop);
    }
  });

  it("prints the content it renders, not the control that picked it", () => {
    const short = snippet();
    expect(short).toContain("<p>");
    expect(short).not.toMatch(/\bcontent=/);
    const long = snippet({ content: "long" });
    expect((long.match(/<li>/g) ?? []).length).toBe(LOG_LINES.length);
    expect(long).toContain("</CollapsiblePanel>");
  });
});

describe("controlled and uncontrolled are different components", () => {
  it("hands the uncontrolled card a bare flag and no handler", () => {
    const tag = tagOf(snippet({ defaultExpanded: true }));
    expect(attributes(snippet({ defaultExpanded: true }))).toContain(
      "defaultExpanded",
    );
    expect(tag).not.toMatch(/expanded=|onToggle/);
  });

  it("prints neither starting prop when the card opens closed", () => {
    // false is the component's own default (:242), so the tag stays silent.
    expect(tagOf(snippet())).not.toMatch(/defaultExpanded|expanded=|onToggle/);
  });

  it("pairs the controlled value with the handler that lets it move", () => {
    const code = snippet({ mode: "controlled" });
    expect(code).toContain("expanded={true}");
    expect(code).toContain("onToggle={handleToggle}");
    expect(code).toMatch(/const handleToggle = \(next: boolean\) => \{/);
  });

  it("prints expanded={false} as an answer, not an absence", () => {
    // :267 tests the type, so leaving the prop out is a different card.
    expect(snippet({ mode: "controlled", expanded: "closed" })).toContain(
      "expanded={false}",
    );
  });

  it("still prints the value when the handler is dropped", () => {
    const code = snippet({ mode: "controlled", onToggle: false });
    expect(code).toContain("expanded={true}");
    expect(code).not.toContain("handleToggle");
  });

  it("never lets the two modes speak at once", () => {
    // A printed `defaultExpanded` beside a controlled card would be a prop
    // :266-268 never reads; a printed `expanded` beside an uncontrolled one
    // would switch the component the snippet claims to be.
    const uncontrolled = tagOf(
      snippet({ mode: "uncontrolled", expanded: "closed", onToggle: true }),
    );
    expect(uncontrolled).not.toMatch(/expanded=|onToggle/);
    const controlled = tagOf(
      snippet({ mode: "controlled", defaultExpanded: true }),
    );
    expect(controlled).not.toContain("defaultExpanded");
  });
});

describe("the content box", () => {
  it("prints the cap as a number, and not at all at the component's 320", () => {
    expect(tagOf(snippet())).not.toContain("contentMaxHeight");
    const code = snippet({ contentMaxHeight: 240 });
    expect(code).toContain("contentMaxHeight={240}");
    expect(code).not.toContain('contentMaxHeight="240"');
  });

  it("retires the cap the moment fillHeight stops reading it", () => {
    // :216-223 — the maxHeight branch is gone entirely under fillHeight.
    const code = snippet({ fillHeight: true, contentMaxHeight: 240 });
    expect(code).toContain("fillHeight");
    expect(code).not.toContain("contentMaxHeight");
  });

  it("takes a floor only when the reader asks for one", () => {
    expect(tagOf(snippet({ minExpandedHeight: 0 }))).not.toContain(
      "minExpandedHeight",
    );
    expect(snippet({ minExpandedHeight: 96 })).toContain(
      "minExpandedHeight={96}",
    );
  });
});

describe("the header", () => {
  it("prints a string title as a string and a node title as a node", () => {
    expect(tagOf(snippet())).toContain(`title="${TITLE_TEXT}"`);
    expect(snippet()).not.toContain("headerLabel");
    const rich = snippet({ richTitle: true });
    expect(rich).toContain(`title={${RICH_TITLE_JSX}}`);
    // The node drags a status glyph and an environment tag into the computed
    // name, which is the only reason `headerLabel` exists (:121).
    expect(rich).toContain(`headerLabel="Deployment logs"`);
  });

  it("drops the subtitle with the text that owns it", () => {
    expect(tagOf(snippet({ subtitle: "   " }))).not.toContain("subtitle");
    expect(snippet({ subtitle: "" })).not.toContain("subtitle={undefined}");
    expect(snippet()).toContain(`subtitle="${SUBTITLE_TEXT}"`);
  });

  it("drops the action and its declaration together", () => {
    const code = snippet({ showActions: false });
    expect(tagOf(code)).not.toContain("actions");
    expect(code).not.toContain("const ACTIONS");
    expect(code).not.toMatch(/import \{[^}]*Button/);
  });
});

describe("the surface the card is handed", () => {
  it("asks for the variant that reads each glass knob", () => {
    // vibrancy and glassOpacity are consumed in Panel's liquid branch alone
    // (Panel.tsx:958,1011-1012); specularMode covers three variants (:391).
    for (const variant of ["glass", "elevated", "outlined"] as const) {
      const tag = tagOf(
        snippet({ variant, vibrancy: "high", glassOpacity: "clear" }),
      );
      expect(tag, variant).not.toMatch(/vibrancy|glassOpacity/);
    }
    const liquid = snippet({
      variant: "liquid-glass",
      vibrancy: "high",
      glassOpacity: "clear",
    });
    expect(liquid).toContain('vibrancy="high"');
    expect(liquid).toContain('glassOpacity="clear"');
  });

  it("shows specularMode on the three glass-aware variants only", () => {
    for (const variant of ["elevated", "outlined", "subtle"] as const) {
      expect(tagOf(snippet({ variant, specularMode: "halo" })), variant).not.toContain(
        "specularMode",
      );
    }
    for (const variant of ["glass", "liquid-glass", "default"] as const) {
      expect(snippet({ variant, specularMode: "halo" }), variant).toContain(
        'specularMode="halo"',
      );
    }
  });

  it("prints nothing for an auto knob, and nothing for an untinted card", () => {
    const tag = tagOf(snippet());
    expect(tag).not.toMatch(/transparency|specularMode|vibrancy|glassOpacity|tone/);
    expect(snippet({ tone: "amber" })).toContain('tone="amber"');
    expect(snippet({ transparency: "high" })).toContain('transparency="high"');
  });

  it("says so when the card answers to the pointer", () => {
    // Panel would default hoverable to Boolean(onClick) (Panel.tsx:725); this
    // component's own answer is false (:258), so `hoverable` is a change.
    expect(tagOf(snippet())).not.toContain("hoverable");
    expect(snippet({ hoverable: true })).toContain("hoverable");
    expect(snippet({ disabled: true })).toContain("disabled");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { mode: "controlled" },
      { mode: "controlled", expanded: "closed", onToggle: false },
      { mode: "uncontrolled", defaultExpanded: true, content: "long" },
      {
        variant: "liquid-glass",
        tone: "amber",
        vibrancy: "high",
        glassOpacity: "clear",
        specularMode: "halo",
        transparency: "medium",
        raisedSurface: true,
      },
      { fillHeight: true, minExpandedHeight: 96, contentMaxHeight: 200 },
      { showActions: false, disabled: true, hoverable: true, subtitle: "" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, `${attribute} from ${JSON.stringify(state)}`).toContain(
          attribute,
        );
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      collapsiblePanelConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    for (const source of collapsiblePanelConfig.data ?? []) {
      if (source.prop !== null) printed.add(source.prop ?? source.id);
    }
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("keeps the playground's own vocabulary out of the source", () => {
    const code = snippet({
      mode: "controlled",
      content: "long",
      richTitle: true,
      showActions: true,
      expanded: "open",
    });
    // Levers, not props: they never reach the reader's code as attributes.
    for (const lever of ["mode", "content", "richTitle", "showActions"]) {
      expect(code, lever).not.toMatch(new RegExp(`\\b${lever}=`));
    }
    // The docs' captions are not strings in the reader's code.
    expect(code).not.toContain("Auto —");
  });
});
