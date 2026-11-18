import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Panel from "./Panel.vue";

describe("Panel untinted surfaces", () => {
  it("keeps elevated as the default and defaults to none tone", () => {
    const wrapper = mount(Panel, { slots: { default: "Body" } });
    expect(wrapper.attributes("data-variant")).toBe("elevated");
    expect(wrapper.attributes("data-tone")).toBe("none");
  });

  it("renders a layout-only none surface", () => {
    const wrapper = mount(Panel, { props: { variant: "none" }, slots: { default: "Body" } });
    expect(wrapper.text()).toContain("Body");
    expect(wrapper.classes().filter(token => /^(?:dark:)?(?:bg-|border(?:-|$)|ring-|shadow|backdrop-)/.test(token))).toEqual([]);
  });

  it("supports explicit tint and explicit none overrides the legacy color", async () => {
    const wrapper = mount(Panel, { props: { variant: "none", tone: "rose" } });
    expect(wrapper.classes().join(" ")).toContain("--color-rose-50");
    await wrapper.setProps({ tone: "none", color: "rose" });
    expect(wrapper.attributes("data-tone")).toBe("none");
    expect(wrapper.classes().some(token => token.includes("bg-rose"))).toBe(false);
  });
  it("explicit none also overrides legacy tint on glass rims and hover", () => {
    const wrapper = mount(Panel, { props: { variant: "glass", tone: "none", color: "rose", hoverable: true } });
    expect(wrapper.classes().join(" ")).not.toContain("rose");
  });

});

/**
 * The Vue half of the same fix. The kit shipped `hover:bg-{c}-50
 * dark:hover:bg-{c}-900/20` here too — lighter than a `tonal` card's own fill in
 * light, darker than it in dark, and with the dark shape missing from the
 * safelist, so a clickable card gave no answer at all. See
 * `react/src/theme/surfaceHover.test.ts` for the measured steps.
 */
describe("Panel — hover, pressed and rim", () => {
  /** The step that will paint, in either the utility or the `ui-surface` variable
   *  spelling the transparency path rewrites it into. */
  const stepFor = (
    cls: string,
    mode: "light" | "dark",
    state: "hover" | "pressed",
  ): string | undefined => {
    const want = state === "hover" ? "hover" : "active";
    let colour: string | undefined;
    let alpha: string | undefined;
    for (const token of cls.split(/\s+/)) {
      const isDark = token.startsWith("dark:");
      const afterMode = isDark ? token.slice("dark:".length) : token;
      if (!afterMode.startsWith(`${want}:`)) continue;
      if (mode === "dark" ? !isDark : isDark) continue;
      const rest = afterMode.slice(want.length + 1);
      const utility = rest.match(/^bg-([a-z]+-\d+)(?:\/(\d+))?$/);
      const varColour = rest.match(/^\[--ui-surface-color:var\(--color-([a-z]+-\d+)\)\]$/);
      const varAlpha = rest.match(/^\[--ui-surface-alpha:(\d+)%\]$/);
      if (utility) {
        colour = utility[1];
        alpha = utility[2];
      } else if (varColour) colour = varColour[1];
      else if (varAlpha) alpha = varAlpha[1];
    }
    return colour ? `${colour}${alpha ? `/${alpha}` : ""}` : undefined;
  };

  const card = (props: Record<string, unknown>, withClick = true) =>
    mount(Panel, {
      props,
      ...(withClick ? { attrs: { onClick: () => {} } } : {}),
      slots: { default: "Body" },
    }).classes().join(" ");

  /**
   * The `hoverable` contract, both directions: `@click` alone makes the card
   * answer the pointer, and the only way to stop it is `:hoverable="false"`.
   * The opt-out keeps the pointer cursor — that has followed `onClick` since
   * before `hoverable` existed, so switching the tint off must not take it.
   */
  it("answers the pointer from @click alone; only an explicit false turns it off", () => {
    const auto = card({ variant: "tonal", tone: "blue" });
    expect(stepFor(auto, "dark", "hover")).toBe("blue-400/25");
    expect(auto).toContain("group");

    const off = card({ variant: "tonal", tone: "blue", hoverable: false });
    for (const mode of ["light", "dark"] as const)
      for (const state of ["hover", "pressed"] as const)
        expect(stepFor(off, mode, state)).toBeUndefined();
    expect(off).not.toMatch(/(?:^|\s)(?:dark:)?hover:ring-/);
    expect(off).toContain("cursor-pointer");
  });

  it("opts an untinted card out of the veil the same way", () => {
    const veil = (props: Record<string, unknown>) =>
      mount(Panel, {
        props,
        attrs: { onClick: () => {} },
        slots: { default: "Body" },
      })
        .findAll("div")
        .some((el) => el.classes().some((c) => c.startsWith("group-hover:bg-")));
    expect(veil({})).toBe(true);
    expect(veil({ hoverable: false })).toBe(false);
  });

  it("steps a tinted variant off its own fill, not off the top of the ramp", () => {
    const cls = card({ variant: "tonal", tone: "blue" });
    expect(stepFor(cls, "light", "hover")).toBe("blue-300/70");
    expect(stepFor(cls, "dark", "hover")).toBe("blue-400/25");
    expect(stepFor(cls, "dark", "pressed")).toBe("blue-400/35");
    expect(cls).not.toMatch(/(?:bg-|--color-)blue-900/);
  });

  it("answers the pointer from @click alone — the boolean cast must not eat it", () => {
    // A `boolean` prop the parent omits is cast to `false` by Vue unless the
    // option declares a default at all, and `hoverable` is read as
    // `props.hoverable ?? Boolean(onClick)`. With the cast in play the fallback
    // branch could never run, and a clickable card had no hover at all.
    const cls = card({ variant: "tonal", tone: "blue" });
    expect(cls).toContain("group");
    expect(cls).toContain("cursor-pointer");
    expect(stepFor(cls, "dark", "hover")).toBe("blue-400/25");
  });

  it("presses only for a card that can actually be pressed", () => {
    const cls = card({ variant: "tonal", tone: "blue", hoverable: true }, false);
    expect(stepFor(cls, "dark", "hover")).toBe("blue-400/25");
    expect(stepFor(cls, "dark", "pressed")).toBeUndefined();
  });

  it("ignites the rim this kit draws — a ring, where React draws a border", () => {
    const cls = card({ variant: "outlined", tone: "blue", hoverable: true }, false);
    expect(cls).toContain("hover:ring-1");
    expect(cls).toContain("hover:ring-blue-300/70");
    expect(cls).not.toContain("hover:border-blue");

    // `glass` is the one variant whose case adds a real `border` here.
    const glass = card({ variant: "glass", tone: "blue", hoverable: true }, false);
    expect(glass).toContain("border");
    expect(glass).toContain("hover:border-blue-500");
  });

  it("lifts an untinted card with the veil, at a step you can see", () => {
    const wrapper = mount(Panel, {
      props: { hoverable: true },
      attrs: { onClick: () => {} },
      slots: { default: "Body" },
    });
    const veil = wrapper
      .findAll("div")
      .find((el) => el.classes().some((c) => c.startsWith("group-hover:bg-")));
    expect(veil).toBeDefined();
    expect(veil!.classes()).toContain("dark:group-hover:bg-white/10");
    expect(veil!.classes().join(" ")).not.toContain("bg-white/[0.04]");
  });
});
