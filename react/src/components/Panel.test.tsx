import { describe, it, expect, vi, beforeEach } from "vitest";
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
  it("stands on the shared scales: sm padding, medium corner, blue tone", () => {
    const { container } = render(<Panel variant="outlined">Body</Panel>);
    const panel = panelOf(container);

    // Padding sm, and the medium corner (DEFAULT_SURFACE_CORNER resolves
    // to `rounded-2xl`).
    expect(panel.className).toContain("p-4 sm:p-5");
    expect(panel.className).toContain("rounded-2xl");
    // Tone default blue — the outlined hairline picks up the tone.
    expect(panel.className).toContain("border-blue-200");
    expect(panel).toHaveAttribute("data-tone", "blue");
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
    expect(panelOf(container).className).toContain("dark:bg-neutral-900/70");
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
