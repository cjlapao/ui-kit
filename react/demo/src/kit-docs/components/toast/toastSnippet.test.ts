import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import {
  TOAST_PLAYGROUND_GROUP,
  toastCode,
  toastConfig,
} from "./toastPlayground";
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

const OPENING: PlaygroundState = {
  intent: "success",
  variant: "glass",
  size: "md",
  mode: "stacked",
  position: "bottom-right",
  width: "22.5rem",
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

/** `ToastInput`, as `Toast/types.ts` declares it — the guard's source of truth. */
const TOAST_INPUT_PROPS = [
  "intent",
  "title",
  "detail",
  "variant",
  "color",
  "size",
  "icon",
  "vibrancy",
  "glassOpacity",
  "specularMode",
  "life",
  "sticky",
  "closable",
  "progress",
  "loading",
  "group",
  "onClick",
  "actions",
  "meta",
];

/** `ToastViewportProps`, as `ToastViewport.tsx` declares it. */
const VIEWPORT_PROPS = [
  "group",
  "position",
  "mode",
  "gap",
  "limit",
  "width",
  "zIndex",
  "breakpoints",
  "onClose",
  "onLifeEnd",
  "className",
  "style",
];

describe("the raised message", () => {
  it("prints the whole call the button makes", () => {
    const code = render();
    expect(code).toContain(`const GROUP = "${TOAST_PLAYGROUND_GROUP}";`);
    expect(code).toContain("const { toast } = useToast();");
    expect(code).toContain("toast.show({");
    expect(code).toContain(`group: GROUP,`);
    expect(code).toContain('intent: "success",');
    expect(code).toContain('title: "Build 482 shipped",');
    expect(code).toContain("export default function Demo() {");
    expect(code).toContain("<ToastProvider>");
  });

  it("leaves out what the kit already does by default", () => {
    const code = render();
    // variant: glass and size: md are the component's own defaults; the
    // 5-second timer is the documented one.
    expect(code).not.toContain("variant:");
    expect(code).not.toContain("size:");
    expect(code).not.toContain("life:");
    // ... and `closable` is on by default too.
    expect(code).not.toContain("closable:");
  });

  it("prints the width the deck is showing even though it is not the kit's", () => {
    expect(render()).toContain('width="22.5rem"');
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
