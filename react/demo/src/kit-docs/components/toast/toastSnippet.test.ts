import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import {
  TOAST_PLAYGROUND_GROUP,
  toastCode,
  toastConfig,
} from "./toastPlayground";
import {
  TOAST_INPUT_PROPS as TOAST_INPUT_DOC,
  TOAST_VIEWPORT_PROPS as TOAST_VIEWPORT_DOC,
} from "./ToastPage";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * The Toast snippet, tested as text.
 *
 * Toast is the page the engine was designed against: a message raised through a
 * hook, a viewport pinned to a corner, and one control (`Auto-dismiss`) that
 * owes the reader two different props. These are the promises that make that
 * trustworthy — that the snippet is runnable, that the two `set`s do not leak
 * into each other, and that every name it prints is a name the kit has.
 */

/** What the controls show on load: `ToastInput`'s and `ToastViewport`'s own defaults. */
const OPENING: PlaygroundState = {
  intent: "neutral",
  variant: "glass",
  size: "md",
  mode: "stacked",
  position: "top-right",
  width: "18.75rem",
  overrideTone: false,
  color: "emerald",
  life: "5000",
  closable: true,
  loading: false,
  withProgress: false,
  withActions: false,
  withGroup: true,
  icon: true,
  title: "Build 482 shipped",
  detail: "All 12 services are healthy.",
};

const render = (changes: Partial<PlaygroundState> = {}): string => {
  // `Partial` of a Record adds `undefined` to every member, which the engine
  // never sees: a change names a declared option or `set` throws.
  const state = Object.assign({}, OPENING, changes) as PlaygroundState;
  const h = createEmitter(toastConfig, state);
  return toastCode({ state, data: {}, h });
};

/**
 * The page's own API tables, not a copy of them: an attribute the Code view
 * prints without a row to live under is a prop nobody documented, and that is
 * the failure this file exists to catch.
 */
const TOAST_INPUT_PROPS = TOAST_INPUT_DOC.map((row) => row.name);
const VIEWPORT_PROPS = TOAST_VIEWPORT_DOC.map((row) => row.name).filter((name) =>
  /^[A-Za-z]+$/.test(name),
);

describe("the raised message", () => {
  it("prints the whole call the button makes", () => {
    const code = render();
    expect(code).toContain(`const GROUP = "${TOAST_PLAYGROUND_GROUP}";`);
    expect(code).toContain("const { toast } = useToast();");
    expect(code).toContain("toast.show({");
    expect(code).toContain(`group: GROUP,`);
    expect(code).toContain('title: "Build 482 shipped",');
    expect(code).toContain("export default function Demo() {");
    expect(code).toContain("<ToastProvider>");
  });

  it("leaves out what the kit already does by default", () => {
    // The controls open on the component's own defaults, so the snippet the
    // reader sees first carries the routing and the copy and nothing else:
    // `neutral` intent, `glass` variant, `md` size, the 5-second timer,
    // `closable`, `top-right`, the 18.75rem column, the stacked deck.
    const code = render();
    for (const leftAlone of [
      "intent:",
      "variant:",
      "size:",
      "life:",
      "closable:",
      "position=",
      "width=",
      "mode=",
    ]) {
      expect(code, leftAlone).not.toContain(leftAlone);
    }
  });

  it("prints the width once the reader widens the column", () => {
    expect(render({ width: "22.5rem" })).toContain('width="22.5rem"');
    expect(render({ position: "bottom-left" })).toContain('position="bottom-left"');
    expect(render({ intent: "success" })).toContain('intent: "success",');
  });

  it("says sticky instead of life: 0", () => {
    const code = render({ life: "0" });
    expect(code).toContain("sticky: true,");
    expect(code).not.toContain("life:");
  });

  it("prints a non-default timer as a number, not a string", () => {
    expect(render({ life: "2000" })).toContain("life: 2000,");
  });

  it("keeps the colour silent until the tone is overridden", () => {
    expect(render()).not.toContain("color:");
    expect(render({ overrideTone: true })).toContain('color: "emerald",');
  });

  it("prints the progress the preview paints", () => {
    expect(render({ withProgress: true })).toContain("progress: 62,");
    expect(render({ withProgress: false })).not.toContain("progress:");
  });

  it("raises the action row where it can name the id, not hoisted above it", () => {
    const code = render({ withActions: true });
    expect(code).toContain("const id = toast.show({");
    expect(code).toContain("actions: [");
    expect(code).toContain("onClick: () => toast.close(id)");
    // One toast, no actions: no dangling `id` binding.
    expect(render()).not.toContain("const id =");
  });

  it("leads the call with the routing tag", () => {
    expect(render()).toMatch(/toast\.show\(\{\n\s+group: GROUP,/);
  });

  it("names only props the kit's ToastInput declares", () => {    const code = render({ overrideTone: true, withProgress: true, withActions: true });
    const call = code.slice(code.indexOf("toast.show({"), code.indexOf("})"));
    const names = [...call.matchAll(/^ {6}([A-Za-z]+):/gm)].map((match) => match[1]);
    expect(names.length).toBeGreaterThan(4);
    expect(names.filter((name) => !TOAST_INPUT_PROPS.includes(name))).toEqual([]);
  });
});

describe("the viewport that holds the deck", () => {
  it("prints the corner and the mode the deck is sitting in", () => {
    const code = render({ position: "top-center", mode: "expanded" });
    expect(code).toContain('position="top-center"');
    expect(code).toContain('mode="expanded"');
    expect(code).toContain("group={GROUP}");
  });

  it("takes the group off both sides together, or the card lands nowhere", () => {
    const ungrouped = render({ withGroup: false });
    expect(ungrouped).not.toContain("group:");
    expect(ungrouped).not.toContain("group={GROUP}");
    // Nothing declares what nothing uses.
    expect(ungrouped).not.toContain("const GROUP");
  });

  it("prints the glyph only when it is switched off", () => {
    expect(render()).not.toContain("icon:");
    expect(render({ icon: false })).toContain("icon: false,");
  });

  it("keeps viewport props out of the message and message props off the viewport", () => {
    const code = render({ overrideTone: true, withProgress: true });
    const viewport = code.slice(code.indexOf("<ToastViewport"), code.indexOf(">", code.indexOf("<ToastViewport")));
    const call = code.slice(code.indexOf("toast.show({"), code.indexOf("})"));
    expect(viewport).not.toContain("intent");
    expect(viewport).not.toContain("title");
    expect(viewport).not.toContain("progress");
    expect(call).not.toContain("position:");
    expect(call).not.toContain("width:");
  });

  it("names only props the kit's ToastViewport declares", () => {
    const code = render({ position: "bottom-left", mode: "stacked", width: "26rem" });
    const viewport = code.slice(code.indexOf("<ToastViewport"), code.indexOf(">", code.indexOf("<ToastViewport")));
    const names = [...viewport.matchAll(/ ([A-Za-z]+)=/g)].map((match) => match[1]);
    expect(names).toContain("group");
    expect(names.filter((name) => !VIEWPORT_PROPS.includes(name))).toEqual([]);
  });
});

describe("the snippet as a whole", () => {
  it("speaks only props the page has a row for", () => {
    // A field whose id is neither a prop nor an intentional lever (`prop: null`)
    // is a typo waiting to render nothing in the preview and nothing in the code.
    const documented = [...TOAST_INPUT_PROPS, ...VIEWPORT_PROPS];
    for (const field of toastConfig.fields) {
      if (field.prop === null) continue;
      expect(documented, `field "${field.id}"`).toContain(field.prop ?? field.id);
    }
  });

  it("imports everything it uses and nothing it does not", () => {
    const code = render();
    expect(code.split("\n")[0]).toBe(
      'import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";',
    );
  });

  it("is one statement per idea, in reading order", () => {
    const code = render();
    const order = [
      code.indexOf("import "),
      code.indexOf("const GROUP"),
      code.indexOf("function Corner()"),
      code.indexOf("toast.show("),
      code.indexOf("<ToastViewport"),
      code.indexOf("export default function Demo()"),
    ];
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(order.every((index) => index >= 0)).toBe(true);
  });
});
