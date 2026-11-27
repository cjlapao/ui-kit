import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { SIDE_MENU, sideMenuCode } from "./SideMenuPlayground";
import { SIDE_MENU_PROPS } from "./SideMenuPage";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * SideMenu's snippet.
 *
 * The page's claim is that the Code view says almost nothing on load: every
 * control opens on the value `SideMenu.tsx` destructures, so the reader's first
 * snippet is the menu they were handed, not a wall of props. Each assertion here
 * fails if a `default` drifts from the source, if a knob that the component only
 * reads in combination with another one prints while that combination is off, or
 * if the fixture the preview mounts and the fixture the snippet prints split
 * apart.
 */

/** What the controls show on load. */
const OPENING: PlaygroundState = {
  variant: "sidebar",
  side: "left",
  color: "blue",
  noise: false,
  noiseScale: "auto",
  collapsible: "none",
  flush: true,
  openOnHover: false,
  hoverTransitionMs: 250,
  responsive: true,
  fullHeight: true,
  search: false,
  searchScope: "all",
  loading: false,
  loaderType: "skeleton",
  skeletonLines: 4,
  showDetails: false,
  footerDetailsVariant: "none",
  footerDetailsTone: "none",
  raisedSurface: false,
  topItem: false,
  footerItem: false,
  ctaCards: false,
  ctaDismiss: false,
  expandable: false,
  workspaces: false,
  groupActions: false,
  actionsOnHover: false,
  groupTag: "none",
  loadingSession: false,
  childrenPageSize: "off",
  emojiIdentities: false,
  contextSelect: false,
  selectMultiple: false,
  selectFullWidth: false,
  selectHost: "new_agents",
  mobilePreview: false,
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign({}, OPENING, changes) as PlaygroundState;
  const h = createEmitter(SIDE_MENU, state);
  return sideMenuCode({ state, data: {}, h });
};

/** Attribute names on the printed `<SideMenu />`, in printed order. */
const attributes = (code: string): string[] => {
  const open = code.indexOf("<SideMenu");
  const element = code.slice(open, code.indexOf("/>", open) + 2);
  const named = [...element.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = element
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\}|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|\/>)/g)
    ?.map((flag) => flag.trim());
  return [...named, ...(flags ?? [])];
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  SIDE_MENU_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean),
  );

describe("the opening", () => {
  it("prints the tree and nothing the reader did not ask for", () => {
    const code = snippet();
    expect([...attributes(code)].sort()).toEqual(["fullHeight", "items"]);
    for (const untouched of [
      "variant",
      "side",
      "collapsible",
      "openOnHover",
      "search",
      "loading",
      "noise",
      "ctas",
      "footerDetails",
      "topItem",
      "footerItem",
    ]) {
      expect(code, untouched).not.toContain(`${untouched}=`);
    }
    expect(code).toContain('import { SideMenu } from "@cjlapao/ui-kit";');
  });

  it("opens on the values SideMenu.tsx destructures", () => {
    // SM:1082 color "blue" · :1083 variant "sidebar" · :1084 side "left" ·
    // :1085 collapsible "none" · :1086 openOnHover false · :1087 hoverTransitionMs
    // 250 · :1088 responsive true · :1097 noise false · :1099 loading false ·
    // :1100 loaderType "skeleton" · :1105 skeletonLines 4 · :1106 search false ·
    // :1110 searchScope "all". `fullHeight` is the one control that opens off the
    // component's default (false, SM:1078) so the stage shows a full panel —
    // declared with docDefault, and therefore printed.
    const field = (id: string) => SIDE_MENU.fields.find((f) => f.id === id);
    expect(field("color")?.default).toBe("blue");
    expect(field("variant")?.default).toBe("sidebar");
    expect(field("side")?.default).toBe("left");
    expect(field("collapsible")?.default).toBe("none");
    expect(field("flush")?.default).toBe(true);
    expect(field("openOnHover")?.default).toBe(false);
    expect(field("hoverTransitionMs")?.default).toBe(250);
    expect(field("responsive")?.default).toBe(true);
    expect(field("noise")?.default).toBe(false);
    expect(field("loading")?.default).toBe(false);
    expect(field("loaderType")?.default).toBe("skeleton");
    expect(field("skeletonLines")?.default).toBe(4);
    expect(field("search")?.default).toBe(false);
    expect(field("searchScope")?.default).toBe("all");
    expect(field("footerDetailsTone")?.default).toBe("none");
    expect(field("raisedSurface")?.default).toBe(false);
    const fullHeight = field("fullHeight");
    expect(fullHeight?.default).toBe(true);
    expect(fullHeight?.docDefault).toBe(false);
  });

  it("prints the tree it is mounting, not a placeholder", () => {
    const code = snippet();
    expect(code).toContain("const ITEMS = [");
    expect(code).toContain('label: "Overview"');
    expect(code).toContain('type: "group"');
    // The tree lives outside the tag; the element just names it.
    expect(code.slice(code.indexOf("<SideMenu"))).not.toContain("Overview");
  });
});

describe("a knob that only works in combination", () => {
  it("keeps flush out of the source while collapsible is none", () => {
    expect(snippet()).not.toContain("flush");
    expect(snippet({ collapsible: "icon" })).not.toContain("flush");
    expect(snippet({ collapsible: "icon", flush: false })).toContain("flush={false}");
  });

  it("keeps the hover timings out until the rail can hover", () => {
    // openOnHover is only meaningful with a collapse mode to hover from.
    expect(snippet({ openOnHover: true })).not.toContain("openOnHover");
    expect(snippet({ collapsible: "icon", openOnHover: true })).toContain("openOnHover");
    expect(snippet({ collapsible: "icon", openOnHover: true })).not.toContain(
      "hoverTransitionMs",
    );
    expect(
      snippet({ collapsible: "icon", openOnHover: true, hoverTransitionMs: 400 }),
    ).toContain("hoverTransitionMs={400}");
  });

  it("only prints skeleton rows under a skeleton", () => {
    expect(snippet({ loading: true, loaderType: "spinner", skeletonLines: 7 })).not.toContain(
      "skeletonLines",
    );
    expect(snippet({ loading: true, loaderType: "spinner" })).toContain('loaderType="spinner"');
    expect(snippet({ loading: true, loaderType: "skeleton", skeletonLines: 7 })).toContain(
      "skeletonLines={7}",
    );
  });

  it("only prints the surface knobs once the detail box is a Panel", () => {
    expect(snippet({ showDetails: true })).toContain("footerDetails={DETAILS}");
    expect(snippet({ showDetails: true })).not.toContain("raisedSurface");
    expect(snippet({ showDetails: true, footerDetailsVariant: "outlined" })).toContain(
      'footerDetailsVariant="outlined"',
    );
    expect(
      snippet({ showDetails: true, footerDetailsVariant: "outlined", raisedSurface: true }),
    ).toContain("raisedSurface");
    // Tone has no effect on a flat box either.
    expect(snippet({ showDetails: true, footerDetailsTone: "blue" })).not.toContain(
      "footerDetailsTone",
    );
  });

  it("needs noise before it prints a scale", () => {
    expect(snippet({ noiseScale: "0.5" })).not.toContain("noiseScale");
    expect(snippet({ noise: true, noiseScale: "0.5" })).toContain('noiseScale={0.5}');
    expect(snippet({ noise: true })).toContain("noise");
    expect(snippet({ noise: true, noiseScale: "auto" })).not.toContain("noiseScale");
  });
});

describe("the fixture toggles", () => {
  it("bring their declaration with their attribute, and only together", () => {
    const cards = snippet({ ctaCards: true });
    expect(attributes(cards)).toEqual(expect.arrayContaining(["items", "ctas"]));
    expect(cards).toContain("const CTAS = [");
    expect(cards).toContain('"Used capacity"');
    // No onDismiss while the ✕ is off — the control simply is not there.
    expect(cards).not.toContain("onDismiss");
    expect(snippet({ ctaCards: true, ctaDismiss: true })).toContain("onDismiss");
    expect(snippet({ ctaCards: false })).not.toContain("const CTAS");
  });

  it("prints the dropdowns the same way", () => {
    const top = snippet({ topItem: true });
    expect(top).toContain("const TOP_ITEM =");
    expect(top).toContain("topItem={TOP_ITEM}");
    expect(top).toContain('label: "ACME Corp"');
    expect(top).toContain('menu: [');
    expect(snippet({ footerItem: true })).toContain("footerItem={FOOTER_ITEM}");
    expect(snippet({ footerItem: true })).not.toContain("topItem=");
  });

  it("names the picker options once an embedded select exists", () => {
    const deep = snippet({ workspaces: true, contextSelect: true });
    expect(deep).toContain("const CONTEXT_OPTIONS =");
    expect(deep).toContain('title: "Test QA · Workspace"');
    expect(deep).toContain("items: CONTEXT_OPTIONS");
    expect(snippet({ workspaces: true })).not.toContain("CONTEXT_OPTIONS");
  });

  it("says how a paged list names what it still owes you", () => {
    const paged = snippet({ workspaces: true, childrenPageSize: "3" });
    expect(paged).toContain("childrenPageSize: 3");
    expect(paged).toContain("moreChildrenLabel: (n) => `Show ${n} more sessions`");
    expect(snippet({ workspaces: true })).not.toContain("childrenPageSize");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const changes of [
      {},
      { collapsible: "icon", flush: false, openOnHover: true, hoverTransitionMs: 300 },
      { search: true, searchScope: "top", loading: true, loaderType: "spinner" },
      { variant: "floating-glass", side: "right", color: "violet", noise: true, noiseScale: "0.5" },
      { ctaCards: true, showDetails: true, topItem: true, footerItem: true, footerDetailsVariant: "subtle" },
    ]) {
      for (const name of attributes(snippet(changes))) {
        expect(rows, `printed attribute "${name}"`).toContain(name);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const rows = documented();
    for (const field of SIDE_MENU.fields) {
      if (field.prop === null) continue;
      expect(rows, `field "${field.id}"`).toContain(field.prop ?? field.id);
    }
  });

  it("keeps the levers out of the code entirely", () => {
    const code = snippet({
      workspaces: true,
      groupActions: true,
      actionsOnHover: true,
      groupTag: "amber",
      loadingSession: true,
      emojiIdentities: true,
      expandable: true,
      mobilePreview: true,
      contextSelect: true,
      selectMultiple: true,
    });
    for (const lever of [
      "workspaces=",
      "groupActions=",
      "mobilePreview=",
      "emojiIdentities=",
      "selectMultiple=",
      "ctaCards=",
    ]) {
      expect(code, lever).not.toContain(lever);
    }
    // …but the tree they describe is the tree being printed.
    expect(code).toContain('label: "Workspaces"');
    expect(code).toContain('emoji: "🤖"');
    expect(code).toContain("multi: true");
  });
});
