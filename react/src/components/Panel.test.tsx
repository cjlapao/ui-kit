import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Panel from "./Panel";
import { resetA11yWarned } from "../../../common/a11y/warn";

const panelOf = (container: HTMLElement) => container.querySelector("section")!;

describe("Panel — outlined border", () => {
  it("draws a hairline border instead of a currentColor ring", () => {
    const { container } = render(
      <Panel variant="outlined" tone="neutral">
        Body
      </Panel>,
    );
    const panel = panelOf(container);

    expect(panel.className).toContain("border");
    expect(panel.className).toContain("border-neutral-200");
    // `ring-1` with no ring colour resolved to currentColor — a near-black rule.
    expect(panel.className).not.toMatch(/(^|\s)ring-1(\s|$)/);
  });

  it("pairs the light hairline with a low-alpha dark one", () => {
    const { container } = render(
      <Panel variant="outlined" tone="blue">
        Body
      </Panel>,
    );

    expect(panelOf(container).className).toContain("border-blue-200");
    expect(panelOf(container).className).toContain("dark:border-blue-500/25");
  });

  it("still honours an explicit borderColor", () => {
    const { container } = render(
      <Panel variant="outlined" borderColor="rose">
        Body
      </Panel>,
    );

    expect(panelOf(container).className).toContain("border-rose-300");
    expect(panelOf(container).className).not.toContain("border-neutral-200");
  });
});

describe("Panel — common-property defaults", () => {
  it("stands on the shared scales: sm padding, medium corner, no tint", () => {
    const { container } = render(<Panel variant="outlined">Body</Panel>);
    const panel = panelOf(container);

    // Padding sm, and the medium corner (DEFAULT_SURFACE_CORNER resolves
    // to `rounded-2xl`).
    expect(panel.className).toContain("p-4 sm:p-5");
    expect(panel.className).toContain("rounded-2xl");
    // Untinted is the default; the outlined hairline stays neutral.
    expect(panel.className).toContain("border-neutral-200");
    expect(panel).toHaveAttribute("data-tone", "none");
  });

  it("honours the deprecated `color` prop as an alias of `tone`", () => {
    const { container } = render(
      <Panel variant="outlined" color="rose">
        Body
      </Panel>,
    );
    expect(panelOf(container).className).toContain("border-rose-200");
    expect(panelOf(container)).toHaveAttribute("data-tone", "rose");
  });

  it("loads with the skeleton by default, like every other loader surface", () => {
    const { container } = render(<Panel loading>Body</Panel>);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });
});

describe("Panel — glass variants", () => {
  it("gives liquid-glass a border width so its rim renders", () => {
    const { container } = render(
      <Panel variant="liquid-glass" tone="slate">
        Body
      </Panel>,
    );
    const panel = panelOf(container);

    expect(panel.className).toMatch(/(^|\s)border(\s|$)/);
    expect(panel.className).toContain("border-slate-300/50");
  });

  it("uses a neutral rim rather than a saturated tone edge", () => {
    const { container } = render(
      <Panel variant="glass" tone="blue">
        Body
      </Panel>,
    );
    const panel = panelOf(container);

    expect(panel.className).toContain("border-white/50");
    expect(panel.className).not.toContain("border-blue-500");
  });

  it("renders the specular highlight on every glass variant", () => {
    for (const variant of ["glass", "liquid-glass", "default"] as const) {
      const { container, unmount } = render(
        <Panel variant={variant}>Body</Panel>,
      );
      expect(container.querySelector(".via-white\\/60")).not.toBeNull();
      unmount();
    }
  });

  it("omits the highlight when specularMode is none", () => {
    const { container } = render(
      <Panel variant="glass" specularMode="none">
        Body
      </Panel>,
    );
    expect(container.querySelector(".via-white\\/60")).toBeNull();
  });

  it("draws halo as full-bleed layers, not fixed-size corner boxes", () => {
    const { container } = render(
      <Panel variant="liquid-glass" specularMode="halo">
        Body
      </Panel>,
    );

    // The old implementation used two `w-24 h-12` boxes whose linear gradients
    // cut off hard on the inner edges, reading as grey rectangles.
    expect(container.querySelector(".w-24.h-12")).toBeNull();

    const layers = Array.from(
      container.querySelectorAll<HTMLElement>("[aria-hidden='true']"),
    ).filter((el) => el.style.backgroundImage.includes("radial-gradient"));

    expect(layers.length).toBeGreaterThan(0);
    for (const layer of layers) {
      // Full-bleed, so a layer can never contribute an edge of its own.
      expect(layer.className).toContain("inset-0");
      // Every radial stop must reach zero alpha inside the box. jsdom
      // re-serialises rgba() with spaces, hence the loose match.
      expect(layer.style.backgroundImage).toMatch(
        /rgba\(255,\s*255,\s*255,\s*0\)/,
      );
    }
  });

  it("ships a light and a dark halo layer", () => {
    const { container } = render(
      <Panel variant="glass" specularMode="halo">
        Body
      </Panel>,
    );

    const layers = Array.from(
      container.querySelectorAll<HTMLElement>("[aria-hidden='true']"),
    ).filter((el) => el.style.backgroundImage.includes("radial-gradient"));

    expect(layers).toHaveLength(2);
    expect(layers.some((el) => el.className.includes("dark:hidden"))).toBe(
      true,
    );
    expect(layers.some((el) => el.className.includes("dark:block"))).toBe(true);
  });

  it("gives the default variant a dark-mode background", () => {
    const { container } = render(<Panel variant="default">Body</Panel>);
    expect(panelOf(container)).toHaveClass("ui-surface-transparency-none");
    expect(panelOf(container).className).toContain("dark:[--ui-surface-color:var(--color-neutral-900)]");
  });
});

describe("Panel — skeleton loading", () => {
  it("replaces content with placeholders and skips the loader overlay", () => {
    const { container } = render(
      <Panel loading loaderType="skeleton" title="Real title">
        Real body
      </Panel>,
    );

    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.queryByText("Real title")).not.toBeInTheDocument();
    expect(screen.queryByText("Real body")).not.toBeInTheDocument();
    expect(panelOf(container)).toHaveAttribute("aria-busy", "true");
  });

  it("keeps the spinner overlay for the other loader types", () => {
    render(
      <Panel loading loaderType="spinner" title="Real title">
        Real body
      </Panel>,
    );

    expect(screen.getByText("Real title")).toBeInTheDocument();
  });

  it("only draws bars for the slots that were passed", () => {
    const { container: bare } = render(
      <Panel loading loaderType="skeleton" title="T" />,
    );
    const { container: full } = render(
      <Panel
        loading
        loaderType="skeleton"
        title="T"
        subtitle="S"
        description="D"
        badge="B"
        actions={[{ label: "One" }, { label: "Two" }]}
      >
        Body
      </Panel>,
    );

    expect(full.querySelectorAll("span").length).toBeGreaterThan(
      bare.querySelectorAll("span").length,
    );
  });

  it("gives the skeleton its own inset when the card carries padding none", () => {
    // Accordion/CollapsiblePanel render Panel with padding="none"; without a
    // self-inset the bars run flush with the rounded corners and read as
    // overflow (the bug the playground screenshot showed).
    const { container } = render(
      <Panel loading loaderType="skeleton" padding="none">
        <div>content</div>
      </Panel>,
    );
    const skeleton = container.querySelector(".animate-pulse")!;
    expect(skeleton.className).toContain("px-4");
    expect(skeleton.className).toContain("sm:px-5");
  });

  it("honours skeletonLines", () => {
    const { container: few } = render(
      <Panel loading loaderType="skeleton" skeletonLines={1}>
        Body
      </Panel>,
    );
    const { container: many } = render(
      <Panel loading loaderType="skeleton" skeletonLines={6}>
        Body
      </Panel>,
    );

    expect(many.querySelectorAll("span").length).toBe(
      few.querySelectorAll("span").length + 5,
    );
  });

  it("renders normally when not loading", () => {
    const { container } = render(
      <Panel loaderType="skeleton" title="Real title">
        Real body
      </Panel>,
    );

    expect(screen.getByText("Real title")).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });
});

/**
 * A Panel with an `onClick` is a card the user can act on — which means it
 * has to answer two questions the tint never had to: who is this card to a
 * screen reader, and whose click was that.
 */
describe("Panel — a clickable card", () => {
  it("becomes a button the keyboard can reach when given an onClick", () => {
    const { container } = render(<Panel onClick={vi.fn()}>Body</Panel>);
    const panel = panelOf(container);

    expect(panel).toHaveAttribute("role", "button");
    expect(panel).toHaveAttribute("tabindex", "0");
    // The shared trigger token, whose ring is inset because Panel clips with
    // `overflow: hidden`.
    expect(panel.className).toContain("focus-visible:ring-2");
    expect(panel.className).toContain("focus-visible:ring-inset");
  });

  it("stays out of the tab order when nothing handles the click", () => {
    const { container } = render(<Panel>Body</Panel>);
    const panel = panelOf(container);

    expect(panel.getAttribute("role")).toBeNull();
    expect(panel.getAttribute("tabindex")).toBeNull();
    expect(panel.className).not.toContain("focus-visible:ring-2");
  });

  it("keeps the click but drops the button when clickable is off", () => {
    const onClick = vi.fn();
    const { container } = render(
      <Panel clickable={false} onClick={onClick}>
        Body
      </Panel>,
    );
    const panel = panelOf(container);

    expect(panel.getAttribute("role")).toBeNull();
    expect(panel.getAttribute("tabindex")).toBeNull();
    fireEvent.click(panel);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("lets the caller's own role and tabIndex win", () => {
    const { container } = render(
      <Panel onClick={vi.fn()} role="group" tabIndex={3}>
        Body
      </Panel>,
    );

    expect(panelOf(container)).toHaveAttribute("role", "group");
    expect(panelOf(container)).toHaveAttribute("tabindex", "3");
  });

  it("stops being a control when disabled, without changing shape", () => {
    const onClick = vi.fn();
    const { container } = render(
      <Panel disabled onClick={onClick}>
        Body
      </Panel>,
    );
    const panel = panelOf(container);

    expect(panel).toHaveAttribute("aria-disabled", "true");
    expect(panel).toHaveAttribute("tabindex", "-1");
    fireEvent.click(panel);
    fireEvent.keyDown(panel, { key: "Enter" });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows a pointer for either switch, not only the hover one", () => {
    const flat = render(
      <Panel hoverable={false} onClick={vi.fn()}>
        Body
      </Panel>,
    );
    expect(panelOf(flat.container).className).toContain("cursor-pointer");

    // A hoverable-only panel has always shown a pointer; that stays.
    const hoverOnly = render(<Panel hoverable>Body</Panel>);
    expect(panelOf(hoverOnly.container).className).toContain("cursor-pointer");
  });
});

describe("Panel — whose click was that", () => {
  it("gives the click to a control in the body, not to the card", () => {
    const onCard = vi.fn();
    const onInner = vi.fn();
    const { container } = render(
      <Panel onClick={onCard}>
        <button type="button" onClick={onInner}>
          Delete
        </button>
      </Panel>,
    );

    // Queried by element, not by name: the card is a `role="button"` named
    // after all of its text, which is "Delete" here too — the very collision
    // the dev warning exists to point at.
    fireEvent.click(container.querySelector("button")!);
    expect(onInner).toHaveBeenCalledTimes(1);
    expect(onCard).not.toHaveBeenCalled();
    expect(panelOf(container)).toBeInTheDocument();
  });

  it("counts the control even when the click lands on its inner text", () => {
    const onCard = vi.fn();
    render(
      <Panel onClick={onCard}>
        <button type="button">
          <span>Delete</span>
        </button>
      </Panel>,
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(onCard).not.toHaveBeenCalled();
  });

  it("does not let the card's own actions fire the card", () => {
    const onCard = vi.fn();
    const onAction = vi.fn();
    render(
      <Panel
        title="Report"
        actions={[{ label: "Archive", onClick: onAction }]}
        onClick={onCard}
      >
        Body
      </Panel>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onCard).not.toHaveBeenCalled();
  });

  it("fires for a click on the card itself", () => {
    const onCard = vi.fn();
    const { container } = render(<Panel onClick={onCard}>Body</Panel>);

    fireEvent.click(screen.getByText("Body"));
    expect(onCard).toHaveBeenCalledTimes(1);
    expect(panelOf(container)).toBeInTheDocument();
  });

  it("honours the opt-out for widgets with no semantics", () => {
    const onCard = vi.fn();
    render(
      <Panel onClick={onCard}>
        <div data-panel-no-click role="presentation">
          <span className="fake-toggle">toggle</span>
        </div>
      </Panel>,
    );

    fireEvent.click(screen.getByText("toggle"));
    expect(onCard).not.toHaveBeenCalled();
  });

  it("does not count a drag across the copy as a click on the card", () => {
    const onCard = vi.fn();
    const { container } = render(<Panel onClick={onCard}>Body</Panel>);
    const panel = panelOf(container);

    fireEvent.mouseDown(panel, { clientX: 10, clientY: 10 });
    fireEvent.mouseUp(panel, { clientX: 180, clientY: 12 });
    fireEvent.click(panel);
    expect(onCard).not.toHaveBeenCalled();

    // A press that ends where it began is still a click.
    fireEvent.mouseDown(panel, { clientX: 10, clientY: 10 });
    fireEvent.mouseUp(panel, { clientX: 11, clientY: 10 });
    fireEvent.click(panel);
    expect(onCard).toHaveBeenCalledTimes(1);
  });

  it("still activates from the keyboard while text is selected", () => {
    // The regression this pins. The first cut asked `window.getSelection()`
    // instead of measuring the pointer, and a real browser showed what that
    // meant: drag-select some copy, press Enter on the focused card, and
    // nothing ever happens — a selection the user made two minutes ago, or
    // somewhere else on the page, holds the card hostage.
    const onCard = vi.fn();
    const spy = vi
      .spyOn(window, "getSelection")
      .mockReturnValue({ isCollapsed: false } as unknown as Selection);
    const { container } = render(<Panel onClick={onCard}>Body</Panel>);

    fireEvent.keyDown(panelOf(container), { key: "Enter" });
    expect(onCard).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe("Panel — activating from the keyboard", () => {
  it("activates on Enter and on Space, as a click", () => {
    const onCard = vi.fn();
    const { container } = render(<Panel onClick={onCard}>Body</Panel>);
    const panel = panelOf(container);

    fireEvent.keyDown(panel, { key: "Enter" });
    fireEvent.keyDown(panel, { key: " " });
    expect(onCard).toHaveBeenCalledTimes(2);
    // A native button produces a click, so the handler sees a mouse event.
    expect(onCard.mock.calls[0][0].type).toBe("click");
  });

  it("keeps Space from scrolling the page", () => {
    const { container } = render(<Panel onClick={vi.fn()}>Body</Panel>);

    // `fireEvent` returns false once the event has been cancelled.
    expect(fireEvent.keyDown(panelOf(container), { key: " " })).toBe(false);
  });

  it("leaves Enter alone when it was typed into a control in the card", () => {
    const onCard = vi.fn();
    render(
      <Panel onClick={onCard}>
        <input type="text" aria-label="Note" />
      </Panel>,
    );

    fireEvent.keyDown(screen.getByLabelText("Note"), { key: "Enter" });
    expect(onCard).not.toHaveBeenCalled();
  });

  it("ignores every other key", () => {
    const onCard = vi.fn();
    const { container } = render(<Panel onClick={onCard}>Body</Panel>);

    fireEvent.keyDown(panelOf(container), { key: "a" });
    expect(onCard).not.toHaveBeenCalled();
  });
});

describe("Panel — a clickable card that hosts controls", () => {
  beforeEach(() => resetA11yWarned());

  it("says so once, and says what to do about it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Panel onClick={vi.fn()}>
        <button type="button">Do it</button>
      </Panel>,
    );
    render(
      <Panel onClick={vi.fn()}>
        <button type="button">Also it</button>
      </Panel>,
    );

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("clickable={false}");
    warn.mockRestore();
  });

  it("stays silent when the only controls are the card's own actions", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Panel
        title="Report"
        actions={[{ label: "Archive", onClick: vi.fn() }]}
        onClick={vi.fn()}
      >
        Body copy with no controls
      </Panel>,
    );

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("stays silent when the card is not a button", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Panel clickable={false} onClick={vi.fn()}>
        <button type="button">Do it</button>
      </Panel>,
    );

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});


describe("Panel — untinted surfaces", () => {
  it("keeps elevated as the default and defaults to no tint", () => {
    const { container } = render(<Panel>Body</Panel>);
    expect(panelOf(container)).toHaveAttribute("data-variant", "elevated");
    expect(panelOf(container)).toHaveAttribute("data-tone", "none");
  });

  it("renders none as a layout-only container and preserves content and padding", () => {
    const { container } = render(<Panel variant="none" padding="md" title="Container">Body</Panel>);
    const panel = panelOf(container);
    expect(panel.className.split(/\s+/).filter(token => /^(?:dark:)?(?:bg-|border(?:-|$)|ring-|shadow|backdrop-)/.test(token))).toEqual([]);
    expect(panel.textContent).toContain("Body");
    expect(panel.textContent).toContain("Container");
    expect(panel.className).toContain("p-6");
  });

  it("tints a borderless container only when explicitly requested", () => {
    const { container } = render(<Panel variant="none" tone="rose">Body</Panel>);
    expect(panelOf(container).className).toContain("--color-rose-50");
    expect(panelOf(container).className).not.toMatch(/(?:^|\s)(?:border|ring-1|shadow-xl)(?:\s|$)/);
  });

  it("explicit none overrides the legacy color alias", () => {
    const { container } = render(<Panel variant="tonal" tone="none" color="rose">Body</Panel>);
    expect(panelOf(container)).toHaveAttribute("data-tone", "none");
    expect(panelOf(container).className).not.toContain("bg-rose");
  });
  it("explicit none overrides the legacy hover tint", () => {
    const { container } = render(<Panel variant="glass" tone="none" color="rose" hoverable>Body</Panel>);
    expect(panelOf(container).className).not.toContain("rose");
  });

});

describe("Panel — hover, pressed and rim", () => {
  /**
   * A clickable card's entire affordance is one background step. Panel wrote
   * `hover:bg-{c}-50 dark:hover:bg-{c}-900/20` regardless of the surface it was
   * laying that step on, so a `tonal` card went *paler* under the pointer in
   * light mode, took a darker wash in dark, and — because that dark shape was
   * never declared to the safelist generator — painted nothing at all.
   *
   * The step arrives in two spellings: the plain utility, or the
   * `--ui-surface-color` / `--ui-surface-alpha` pair that
   * `getSurfaceTransparencyClasses` rewrites it into for any panel whose fill
   * carries alpha, which is every tinted variant. These tests assert the step
   * that will *paint*, not the spelling it paints in.
   */
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

  const classes = (ui: ReactElement) =>
    panelOf(render(ui).container).className;

  /**
   * The `hoverable` contract, in both directions: an `onClick` is enough on its
   * own to make a card answer the pointer, and the only way to stop it is to
   * pass `hoverable={false}` by hand. The opt-out still leaves the pointer
   * cursor on, because that has followed `onClick` since before `hoverable`
   * existed — switching off the tint must not quietly take the cursor with it.
   */
  it("answers the pointer from onClick alone; only an explicit false turns it off", () => {
    const auto = classes(
      <Panel variant="tonal" tone="blue" onClick={vi.fn()}>
        Body
      </Panel>,
    );
    expect(stepFor(auto, "dark", "hover")).toBe("blue-400/25");
    expect(auto).toMatch(/(?:^|\s)group(?:\s|$)/);

    const off = classes(
      <Panel variant="tonal" tone="blue" hoverable={false} onClick={vi.fn()}>
        Body
      </Panel>,
    );
    for (const mode of ["light", "dark"] as const)
      for (const state of ["hover", "pressed"] as const)
        expect(stepFor(off, mode, state)).toBeUndefined();
    expect(off).not.toMatch(/(?:^|\s)(?:dark:)?hover:ring-/);
    expect(off).toMatch(/(?:^|\s)cursor-pointer(?:\s|$)/);
  });

  it("opts an untinted card out of the veil the same way", () => {
    const veilOf = (ui: ReactElement) =>
      Array.from(render(ui).container.querySelectorAll("div")).some((el) =>
        el.className.includes("group-hover:bg-"),
      );
    expect(veilOf(<Panel onClick={vi.fn()}>Body</Panel>)).toBe(true);
    expect(
      veilOf(
        <Panel hoverable={false} onClick={vi.fn()}>
          Body
        </Panel>,
      ),
    ).toBe(false);
  });

  it("steps a tinted variant off its own fill, not off the top of the ramp", () => {
    const cls = classes(
      <Panel variant="tonal" tone="blue" onClick={vi.fn()}>
        Body
      </Panel>,
    );
    // Rest is `blue-200/60` light, `blue-500/15` dark: deeper going in, lighter
    // coming out — which is 1.22:1 and 1.29:1, both measured.
    expect(stepFor(cls, "light", "hover")).toBe("blue-300/70");
    expect(stepFor(cls, "dark", "hover")).toBe("blue-400/25");
    expect(stepFor(cls, "light", "pressed")).toBe("blue-400/70");
    expect(stepFor(cls, "dark", "pressed")).toBe("blue-400/35");
    // The pair that shipped: `-50` is lighter than a `-200/60` card, and
    // `-900/20` is darker than a `-500/15` one.
    expect(cls).not.toMatch(/(?:bg-|--color-)blue-900/);
    expect(cls).not.toMatch(/(?:^|\s)hover:bg-blue-50(?:\s|$)/);
  });

  it("takes the depth from the variant, so sheer surfaces step less", () => {
    const sheer = classes(
      <Panel variant="glass" tone="blue" onClick={vi.fn()}>
        Body
      </Panel>,
    );
    const deep = classes(
      <Panel variant="tonal" tone="blue" onClick={vi.fn()}>
        Body
      </Panel>,
    );
    expect(stepFor(sheer, "light", "hover")).toBe("blue-200/70");
    expect(stepFor(deep, "light", "hover")).toBe("blue-300/70");
  });

  it("presses one step past the hover, and only when it can be pressed", () => {
    const clickable = classes(
      <Panel variant="tonal" tone="blue" onClick={vi.fn()}>
        Body
      </Panel>,
    );
    expect(stepFor(clickable, "dark", "pressed")).toBe("blue-400/35");

    // A card that cannot be pressed must not flinch under a held pointer.
    const hoverOnly = classes(
      <Panel variant="tonal" tone="blue" hoverable clickable={false}>
        Body
      </Panel>,
    );
    expect(stepFor(hoverOnly, "light", "hover")).toBe("blue-300/70");
    expect(stepFor(hoverOnly, "light", "pressed")).toBeUndefined();
    expect(stepFor(hoverOnly, "dark", "pressed")).toBeUndefined();
  });

  it("ignites the rim the variant actually wears", () => {
    // `tonal` rests on `ring-1 ring-transparent`, and a ring colour with no
    // width is inert — the hover has to bring the width with it.
    const ring = classes(
      <Panel variant="tonal" tone="blue" hoverable>
        Body
      </Panel>,
    );
    expect(ring).toMatch(/(?:^|\s)hover:ring-1(?:\s|$)/);
    expect(ring).toContain("hover:ring-blue-300/70");
    expect(ring).toContain("dark:hover:ring-blue-500/30");
    expect(ring).not.toContain("hover:border-blue");

    const border = classes(
      <Panel variant="outlined" tone="blue" hoverable>
        Body
      </Panel>,
    );
    expect(border).toContain("hover:border-blue-300");
    expect(border).toContain("dark:hover:border-blue-500/50");

    // Glass ignites in its own tone, the way the glass controls already do.
    const glass = classes(
      <Panel variant="glass" tone="blue" hoverable>
        Body
      </Panel>,
    );
    expect(glass).toContain("hover:border-blue-500");
    expect(glass).toContain("dark:hover:border-blue-400");
  });

  it("lifts an untinted card with the veil, at a step you can see", () => {
    const { container } = render(
      <Panel hoverable onClick={vi.fn()}>
        Body
      </Panel>,
    );
    const veil = Array.from(container.querySelectorAll("div")).find((el) =>
      el.className.includes("group-hover:bg-"),
    );
    expect(veil).toBeDefined();
    // 4% white on a dark page measured 1.10:1 — a change, not a hover.
    expect(veil!.className).toContain("dark:group-hover:bg-white/10");
    expect(veil!.className).not.toContain("bg-white/[0.04]");
    expect(veil!.className).toContain("group-active:bg-black/[0.07]");
    expect(veil!.className).toContain("dark:group-active:bg-white/[0.16]");
  });

  it("keeps the same step when the transparency path rewrites it", () => {
    // A panel whose fill carries alpha is painted through `ui-surface-fill`, so
    // the hover has to travel with it as variables — a plain utility beside
    // `ui-surface-fill` fights it for `background-color` instead of feeding it.
    const cls = classes(
      <Panel variant="tonal" tone="blue" transparency="none" onClick={vi.fn()}>
        Body
      </Panel>,
    );
    expect(cls).toContain("ui-surface-fill");
    expect(stepFor(cls, "light", "hover")).toBe("blue-300/70");
    expect(stepFor(cls, "dark", "hover")).toBe("blue-400/25");
    expect(stepFor(cls, "dark", "pressed")).toBe("blue-400/35");
  });

  it("goes quiet when it is disabled", () => {
    const cls = classes(
      <Panel variant="tonal" tone="blue" disabled onClick={vi.fn()}>
        Body
      </Panel>,
    );
    for (const mode of ["light", "dark"] as const)
      for (const state of ["hover", "pressed"] as const)
        expect(stepFor(cls, mode, state)).toBeUndefined();
    expect(cls).not.toMatch(/(?:^|\s)dark:hover:ring-/);
    expect(cls).toContain("cursor-not-allowed");
  });

  it("follows hoverColor for the hue and keeps the depth the theme's", () => {
    const cls = classes(
      <Panel variant="glass" tone="blue" hoverColor="rose" onClick={vi.fn()}>
        Body
      </Panel>,
    );
    expect(stepFor(cls, "light", "hover")).toBe("rose-200/70");
    expect(stepFor(cls, "dark", "hover")).toBe("rose-400/20");
    expect(cls).toContain("hover:border-rose-500");
    // The rest fill and the focus ring keep the Panel's own tone; only the
    // pointer states follow `hoverColor`.
    expect(cls).toContain("bg-blue-50/50");
    expect(cls).not.toMatch(/(?:hover|active):bg-blue-/);
  });

  it("eases the wash with one transition list, not two", () => {
    const tinted = classes(
      <Panel variant="tonal" tone="blue" onClick={vi.fn()}>
        Body
      </Panel>,
    );
    expect(tinted).toMatch(/(?:^|\s)transition-colors(?:\s|$)/);

    const both = classes(
      <Panel variant="tonal" tone="blue" hoverShadow onClick={vi.fn()}>
        Body
      </Panel>,
    );
    // Two `transition-*` utilities on one element leave the winner to the
    // stylesheet's order, and the one that loses snaps.
    expect(both).toContain("transition-[background-color,box-shadow,transform]");
    expect(both).not.toMatch(/(?:^|\s)transition-shadow(?:\s|$)/);
    expect(both).toContain("hover:shadow-xl");
  });
});

describe("Panel — active state", () => {
  /**
   * `active` is sustained selection, not the pointer: a 2px inset outline rim
   * in the active hue plus a light tone-tinted fill on the variant's own fill
   * scale. The rim is an outline — never a second `border`/`ring` — so it
   * cannot fight the variant's resting width classes for one property, and it
   * paints inside the edge instead of being clipped by `overflow-hidden`.
   *
   * Any fill that carries alpha arrives here already rewritten into the
   * `--ui-surface-color` / `--ui-surface-alpha` pair (see
   * `getSurfaceTransparencyClasses`), so the assertions name the hue the fill
   * paints in that spelling, and the plain-utility spelling for the variants
   * that keep their alpha.
   */
  const classesOf = (ui: ReactElement) =>
    panelOf(render(ui).container).className;
  const surfaceColourOf = (cls: string, mode: "light" | "dark") => {
    for (const token of cls.split(/\s+/)) {
      const isDark = token.startsWith("dark:");
      if (mode === "dark" ? !isDark : isDark) continue;
      const match = (isDark ? token.slice(5) : token).match(
        /^\[--ui-surface-color:var\(--color-([a-z]+-\d+|white|neutral-\d+)\)\]$/,
      );
      if (match) return match[1];
    }
    return undefined;
  };

  it("is off by default: no rim, no fill, no data-active", () => {
    const cls = classesOf(<Panel>Body</Panel>);
    expect(cls).not.toMatch(/(?:^|\s)outline-2(?:\s|$)/);
    expect(
      panelOf(render(<Panel>Body</Panel>).container),
    ).not.toHaveAttribute("data-active");
  });

  it("draws the inset rim and the tone fill at a tone", () => {
    const { container } = render(
      <Panel variant="elevated" tone="cyan" active>
        Body
      </Panel>,
    );
    const cls = panelOf(container).className;
    expect(cls).toMatch(/(?:^|\s)outline-2(?:\s|$)/);
    expect(cls).toMatch(/(?:^|\s)-outline-offset-2(?:\s|$)/);
    expect(cls).toContain("outline-cyan-500");
    expect(cls).toContain("dark:outline-cyan-400");
    // The elevated fill slot — `subtleBg` — precomposed into the surface pair.
    expect(surfaceColourOf(cls, "light")).toBe("cyan-50");
    expect(surfaceColourOf(cls, "dark")).toBe("cyan-500");
    // ...and the elevated shadow survives the fill swap.
    expect(cls).toContain("shadow-xl");
    expect(panelOf(container)).toHaveAttribute("data-active", "true");
  });

  it("falls to the kit blue when the card carries no hue at all", () => {
    const cls = classesOf(<Panel active>Body</Panel>);
    expect(cls).toContain("outline-blue-500");
    expect(cls).toContain("dark:outline-blue-400");
    expect(surfaceColourOf(cls, "light")).toBe("blue-50");
  });

  it("wears the borderColor hue over the tone hue", () => {
    const cls = classesOf(
      <Panel tone="cyan" borderColor="rose" active>
        Body
      </Panel>,
    );
    expect(cls).toContain("outline-rose-500");
    expect(cls).not.toContain("outline-cyan-500");
    expect(surfaceColourOf(cls, "light")).toBe("rose-50");
  });

  it("fills on each variant's own scale, not one shared wash", () => {
    // tonal deepens on the tonal step
    const tonal = classesOf(
      <Panel variant="tonal" tone="cyan" active>
        Body
      </Panel>,
    );
    expect(surfaceColourOf(tonal, "light")).toBe("cyan-200");
    expect(tonal).toContain("outline-cyan-500");

    // glass stays glass — high transparency keeps the plain alpha utilities
    const glass = classesOf(
      <Panel variant="glass" tone="cyan" active>
        Body
      </Panel>,
    );
    expect(glass).toContain("bg-cyan-50/50");
    expect(glass).toContain("dark:bg-cyan-500/15");

    // liquid-glass keeps its thinner liquid fill
    const liquid = classesOf(
      <Panel variant="liquid-glass" tone="cyan" active>
        Body
      </Panel>,
    );
    expect(liquid).toContain("bg-cyan-50/30");
    expect(liquid).toContain("dark:bg-cyan-500/10");

    // outlined swaps the white fill but keeps the hairline width
    const outlined = classesOf(
      <Panel variant="outlined" tone="cyan" active>
        Body
      </Panel>,
    );
    expect(outlined).toMatch(/(?:^|\s)border(?:\s|$)/);
    expect(outlined).not.toContain("bg-white/90");
    expect(surfaceColourOf(outlined, "light")).toBe("cyan-50");

    // subtle keeps its plain subtle step
    const subtle = classesOf(
      <Panel variant="subtle" tone="cyan" active>
        Body
      </Panel>,
    );
    expect(subtle).toContain("bg-cyan-50/80");
    expect(subtle).toContain("dark:bg-cyan-500/10");
  });

  it("lets an explicit backgroundColor beat the active fill; the rim still ignites", () => {
    const cls = classesOf(
      <Panel tone="cyan" active backgroundColor="rose">
        Body
      </Panel>,
    );
    // Caller's paint wins — `elevated` maps backgroundColor onto the tonal step.
    expect(surfaceColourOf(cls, "light")).toBe("rose-200");
    expect(cls).not.toContain("[--ui-surface-color:var(--color-cyan-50)]");
    // Selection is still legible.
    expect(cls).toContain("outline-cyan-500");
  });

  it("layers under the hover wash and the pressed step instead of blocking them", () => {
    const cls = classesOf(
      <Panel tone="cyan" active onClick={vi.fn()}>
        Body
      </Panel>,
    );
    expect(cls).toMatch(/(?:^|\s)outline-2(?:\s|$)/);
    // The pointer states still arrive, in either spelling.
    expect(cls).toMatch(
      /hover:(?:bg-cyan-|\[--ui-surface-color:var\(--color-cyan-)/,
    );
    expect(cls).toMatch(
      /active:(?:bg-cyan-|\[--ui-surface-color:var\(--color-cyan-)/,
    );
  });

  it("stays legible under the disabled veil", () => {
    const { container } = render(
      <Panel tone="cyan" active disabled onClick={vi.fn()}>
        Body
      </Panel>,
    );
    const panel = panelOf(container);
    expect(panel.className).toContain("outline-cyan-500");
    expect(panel.className).toMatch(/(?:^|\s)outline-2(?:\s|$)/);
    expect(panel).toHaveAttribute("data-active", "true");
  });
});

describe("Panel — attention pulse", () => {
  /**
   * The Pill's attention call at container scale: an inward box-shadow swell
   * from the section's own rim (the `---- Panel attention pulse ----` rules
   * in styles.css; `styles.contract.test.ts` guards the hook's rule). The
   * hue rides inline `--panel-glow`/`--panel-glow-dark` custom properties so
   * the keyframes stay colour-agnostic and the safelist untouched, and the
   * glow touches neither background nor outline properties — the hover wash,
   * the pressed step and the selection rim all still paint beside it.
   */
  const glowOf = (ui: ReactElement) => {
    const panel = panelOf(render(ui).container);
    return {
      cls: panel.className,
      glow: panel.style.getPropertyValue("--panel-glow"),
      glowDark: panel.style.getPropertyValue("--panel-glow-dark"),
    };
  };

  it("is off by default", () => {
    const { cls, glow, glowDark } = glowOf(<Panel>Body</Panel>);
    expect(cls).not.toContain("panel-pulse");
    expect(glow).toBe("");
    expect(glowDark).toBe("");
  });

  it("swells inward in the accent hue", () => {
    const { cls, glow, glowDark } = glowOf(<Panel tone="cyan" pulse>Body</Panel>);
    expect(cls).toContain("panel-pulse");
    // The hue travels as a custom property, not a class shape — the
    // stylesheet stays colour-agnostic and the safelist stays untouched.
    expect(glow).toBe("var(--color-cyan-500)");
    expect(glowDark).toBe("var(--color-cyan-300)");
  });

  it("follows the accent rule: borderColor, then tone, then the blue floor", () => {
    expect(glowOf(<Panel pulse>Body</Panel>).glow).toBe("var(--color-blue-500)");
    expect(
      glowOf(
        <Panel tone="cyan" borderColor="rose" pulse>
          Body
        </Panel>,
      ).glow,
    ).toBe("var(--color-rose-500)");
  });

  it("a disabled card does not call attention", () => {
    // An attention call on a card the app has dimmed is a contradiction —
    // unlike the selection rim, which stays legible under the veil.
    const { cls, glow } = glowOf(<Panel pulse disabled>Body</Panel>);
    expect(cls).not.toContain("panel-pulse");
    expect(glow).toBe("");
  });

  it("coexists with the selection rim — same hue, different paint layer", () => {
    const { cls, glow } = glowOf(<Panel tone="cyan" active pulse>Body</Panel>);
    expect(cls).toMatch(/(?:^|\s)outline-2(?:\s|$)/);
    expect(cls).toContain("panel-pulse");
    expect(glow).toBe("var(--color-cyan-500)");
  });

  it("pulses on glass — the glow is a box-shadow, so translucent fills suit it", () => {
    expect(
      glowOf(<Panel variant="glass" pulse>Body</Panel>).cls,
    ).toContain("panel-pulse");
    expect(
      glowOf(<Panel variant="liquid-glass" pulse>Body</Panel>).cls,
    ).toContain("panel-pulse");
  });

  it("pulses on a clickable card too — the focus ring is intact", () => {
    const { cls } = glowOf(<Panel pulse onClick={vi.fn()}>Body</Panel>);
    expect(cls).toContain("panel-pulse");
    // The keyframes re-composite the Tailwind shadow variables precisely so
    // this inset ring keeps firing; its classes must survive the glow.
    expect(cls).toContain("focus-visible:ring-2");
  });
});
