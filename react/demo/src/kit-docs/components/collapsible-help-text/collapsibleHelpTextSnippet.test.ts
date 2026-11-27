import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { collapsibleHelpConfig } from "./collapsibleHelpPlayground";
import { collapsibleHelpCode } from "./CollapsibleHelpTextPlayground";
import { COLLAPSIBLE_HELP_PROPS } from "./CollapsibleHelpTextPage";
import {
  CHILDREN_TEXT,
  DEFAULT_MAX_LENGTH,
  LONG_COPY,
  SHORT_COPY,
} from "./collapsibleHelpStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * Collapsible Help Text's snippet.
 *
 * The component decides between a `<button>` and a `<div>` from the *length* of
 * one string against `maxLength` (CollapsibleHelpText.tsx:277), and it renders a
 * `Panel` for every variant except `plain` (:305-311) — so two whole families of
 * props are conditional on facts the controls encode but the props themselves
 * never mention. A printed `expandLabel` beside copy that never truncates would
 * describe a button that does not exist, and a printed `corner` beside `plain`
 * would describe a card that is not rendered. These tests are the guard against
 * exactly that.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  // Every field carries the component's own default (:251-272); the cast is for
  // the type, which has no undefined, not for the data.
  for (const field of collapsibleHelpConfig.fields)
    state[field.id] = field.default as PlaygroundValue;
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const data = Object.fromEntries(
    (collapsibleHelpConfig.data ?? []).map((source) => [
      source.id,
      source.when ? (source.when(state) ? source.value(state) : "") : source.value(state),
    ]),
  );
  return collapsibleHelpCode({
    state,
    data,
    h: createEmitter(collapsibleHelpConfig, state),
  });
};

/** The element itself — comments, declarations and children excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<CollapsibleHelpText");
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
    .filter((flag) => flag !== "CollapsibleHelpText");
  return [...named, ...(flags ?? [])];
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  COLLAPSIBLE_HELP_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim())
      .filter((part) => part && !part.startsWith("…")),
  );

describe("the opening", () => {
  it("prints the copy and the title, and nothing that is a default", () => {
    // card, rounded-md, sm, 160 and no icon are the component's own answers
    // (:254-262), so the honest opening says only what the reader changed.
    expect(attributes(snippet())).toEqual(["text", "title"]);
  });

  it("declares the paragraph as a const and points the prop at it", () => {
    const code = snippet();
    expect(code).toContain(`const HELP_TEXT = ${JSON.stringify(LONG_COPY)}`);
    expect(tagOf(code)).toContain("text={HELP_TEXT}");
    // The string appears once: the tag references the const, it does not repeat it.
    expect(code.split(LONG_COPY).length - 1).toBe(1);
  });

  it("names the copy's length, not a mode, as the thing being edited", () => {
    // `copy` is a lever over the data source, never a prop or a const.
    const code = snippet({ copy: "short" });
    expect(code).toContain(`const HELP_TEXT = ${JSON.stringify(SHORT_COPY)}`);
    expect(code).not.toMatch(/\bcopy=/);
    expect(code).not.toContain("copyFor");
  });
});

describe("the toggle only exists while the copy is longer than maxLength", () => {
  it("leaves both labels out while they still say what the kit says", () => {
    // "Show more" / "Show less" are the component's own defaults (:144-145), so
    // printing them would be noise; they appear only when the reader changes one.
    expect(tagOf(snippet())).not.toMatch(/expandLabel|collapseLabel/);
    const renamed = tagOf(snippet({ expandLabel: "Read the whole thing" }));
    expect(renamed).toContain('expandLabel="Read the whole thing"');
    expect(snippet({ collapseLabel: "Tuck it away" })).toContain(
      'collapseLabel="Tuck it away"',
    );
  });

  it("prints neither once the summary fits — however it came to fit", () => {
    // Short copy (:277 false), and the long copy with the limit raised above it.
    // The labels are deliberately non-default here: with the kit's own strings
    // the assertion would pass for the wrong reason, and a printed label would
    // name a button that :229-232 never renders.
    for (const state of [
      { copy: "short", expandLabel: "Read the whole thing", collapseLabel: "Tuck it away" },
      { maxLength: 280, expandLabel: "Read the whole thing", collapseLabel: "Tuck it away" },
    ] as const) {
      const tag = tagOf(snippet(state as Partial<PlaygroundState>));
      expect(tag, JSON.stringify(state)).not.toMatch(/expandLabel|collapseLabel/);
    }
  });

  it("keeps maxLength a bare number, because it is one", () => {
    expect(snippet({ maxLength: 100 })).toContain("maxLength={100}");
    expect(snippet({ maxLength: 100 })).not.toContain('maxLength="100"');
    expect(tagOf(snippet())).not.toContain("maxLength");
    expect(DEFAULT_MAX_LENGTH).toBe(160);
  });
});

describe("plain renders no Panel", () => {
  const surface = {
    corner: "rounded-lg",
    padding: "md",
    raisedSurface: true,
    transparency: "high",
    specularMode: "halo",
    vibrancy: "high",
    glassOpacity: "clear",
  } as const;

  it("retires every prop the card was supposed to read", () => {
    // :305-311 returns a div; none of these reaches anything on that path.
    const names = attributes(snippet({ ...surface, variant: "plain" }));
    expect(names).toEqual(["text", "variant", "title"]);
    expect(names).not.toContain("corner");
    expect(names).not.toContain("padding");
    expect(names).not.toContain("raisedSurface");
    expect(names).not.toContain("transparency");
    expect(names).not.toContain("specularMode");
  });

  it("prints them all again for the card that does", () => {
    const names = attributes(snippet({ ...surface, variant: "liquid-glass" }));
    for (const prop of Object.keys(surface)) expect(names).toContain(prop);
  });
});

describe("the glass knobs, which only one variant reads", () => {
  it("asks for liquid-glass before vibrancy or glassOpacity", () => {
    // Panel computes both at :958-959 and consumes them only at :1011-1012.
    for (const variant of ["glass", "default", "elevated"] as const) {
      const tag = tagOf(
        snippet({ variant, vibrancy: "high", glassOpacity: "clear" }),
      );
      expect(tag, variant).not.toMatch(/vibrancy|glassOpacity/);
    }
    const liquid = tagOf(
      snippet({ variant: "liquid-glass", vibrancy: "high", glassOpacity: "clear" }),
    );
    expect(liquid).toContain('vibrancy="high"');
    expect(liquid).toContain('glassOpacity="clear"');
  });

  it("shows specularMode on the three glass-aware variants and hides it elsewhere", () => {
    // GLASS_VARIANTS is glass, liquid-glass and default (Panel.tsx:391,1431).
    for (const variant of ["card", "elevated", "subtle", "plain"] as const) {
      expect(
        tagOf(snippet({ variant, specularMode: "halo" })),
        variant,
      ).not.toContain("specularMode");
    }
    for (const variant of ["glass", "liquid-glass", "default"] as const) {
      expect(snippet({ variant, specularMode: "halo" }), variant).toContain(
        'specularMode="halo"',
      );
    }
  });

  it("prints nothing for an auto knob, because absent is the component's answer", () => {
    const tag = tagOf(snippet({ variant: "liquid-glass" }));
    expect(tag).not.toMatch(/transparency|specularMode|vibrancy|glassOpacity/);
  });

  it('keeps tone="none" out of the snippet, since it means untinted', () => {
    expect(tagOf(snippet())).not.toContain("tone");
    expect(snippet({ tone: "amber" })).toContain('tone="amber"');
  });
});

describe("content the controls own", () => {
  it("drops the title with the switch that owns it", () => {
    expect(snippet({ showTitle: false })).not.toContain("title=");
    expect(snippet({ showTitle: false })).not.toContain("showTitle");
    // `title` is a content lever over a prop the component has no default for,
    // so it prints even at its starting value — absent would be a different card.
    expect(snippet()).toContain('title="Why we ask for reviews"');
  });

  it("drops the icon with the chip that owns it", () => {
    expect(tagOf(snippet({ icon: "Info" }))).not.toMatch(/icon|showIcon/);
    const on = tagOf(snippet({ showIcon: true }));
    expect(on).toContain("showIcon");
    expect(on).not.toContain("icon="); // "Help" is the component's own default (:256)
    const named = tagOf(snippet({ showIcon: true, icon: "Info" }));
    expect(named).toContain("showIcon");
    expect(named).toContain('icon="Info"');
  });

  it("declares the markdown renderer it hands over", () => {
    const code = snippet({ renderMarkdown: true });
    expect(code).toContain("renderMarkdown={renderMarkdown}");
    expect(code).toContain("const renderMarkdown");
    // A renderer is only useful if the reader can see what it does.
    expect(code).toMatch(/const renderMarkdown = \(text: string\)/);
  });

  it("closes the element when there is nothing to put in it", () => {
    // An empty children string would still print an open/close pair and leave a
    // blank line where the content should be, so it is passed as undefined.
    const bare = snippet();
    expect(tagOf(bare)).toMatch(/\/>$/);
    expect(bare).not.toContain("</CollapsibleHelpText>");
    const withKids = snippet({ withChildren: true });
    expect(withKids).toContain(CHILDREN_TEXT);
    expect(withKids).toContain("</CollapsibleHelpText>");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { copy: "short" },
      { variant: "liquid-glass", vibrancy: "high", glassOpacity: "clear", specularMode: "halo" },
      { variant: "plain", showIcon: true, icon: "Info", maxLength: 100 },
      { tone: "amber", corner: "rounded-xl", padding: "lg", raisedSurface: true, transparency: "high" },
      { showTitle: false, withChildren: true, renderMarkdown: true },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, `${attribute} from ${JSON.stringify(state)}`).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      collapsibleHelpConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    for (const source of collapsibleHelpConfig.data ?? []) {
      if (source.prop !== null) printed.add(source.prop ?? source.id);
    }
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("keeps the playground's own vocabulary out of the source", () => {
    const code = snippet({
      copy: "short",
      showTitle: false,
      showIcon: true,
      withChildren: true,
    });
    // Levers, not props: they must never appear as attributes or consts.
    for (const lever of ["showTitle", "withChildren"]) {
      expect(code, lever).not.toContain(lever);
    }
    // The docs' captions are not strings in the reader's code.
    expect(code).not.toContain("Auto —");
  });
});
