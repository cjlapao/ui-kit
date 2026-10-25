import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SidePanel, { SIDE_PANEL_VARIANTS } from "./SidePanel";
import { COLLAPSED_RAIL_WIDTH } from "../theme/Theme";

describe("SidePanel", () => {
  it("renders title and children when open", () => {
    render(
      <SidePanel isOpen title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    expect(screen.getByRole("heading", { name: "Details" })).toBeTruthy();
    expect(screen.getByText("Body copy")).toBeTruthy();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <SidePanel isOpen={false} title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not paint the dither-noise layer by default", () => {
    const { container } = render(
      <SidePanel isOpen title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    expect(container.querySelector("[data-sp-noise]")).toBeNull();
  });

  it("paints a decorative, click-through noise layer when noise is set", () => {
    const { container } = render(
      <SidePanel isOpen noise title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    const layer = container.querySelector("[data-sp-noise]") as HTMLElement;
    expect(layer).toBeTruthy();
    expect(layer.getAttribute("aria-hidden")).toBe("true");
    // multiply in light (overlay is a no-op on a white base), overlay in dark
    expect(layer.className).toContain("mix-blend-multiply");
    expect(layer.className).toContain("dark:mix-blend-overlay");
    expect(layer.style.backgroundImage).toContain("feTurbulence");
  });

  it("paints fill and blur on their own layer, carrying the radius", () => {
    // A backdrop-filtered box does not reliably clip to a rounded ancestor —
    // the blur paints into its own context and nicks each corner. The layer
    // being rounded has to know its own radius.
    const { container } = render(
      <SidePanel isOpen inset variant="glass" title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    const fill = container.querySelector("[data-sp-fill]") as HTMLElement;
    expect(fill.innerHTML).toContain("backdrop-blur");
    expect(fill.className).toContain("rounded-l-");

    // …and the content sits above it, transparent, so header/body/footer are
    // rounded by one container instead of each knowing about corners.
    const content = fill.nextElementSibling as HTMLElement;
    expect(content.className).not.toContain("backdrop-blur");
    expect(content.className).toContain("relative");
  });
});

describe("SidePanel — the shared design language", () => {
  it("renders every surface variant", async () => {
    const { SIDE_PANEL_VARIANTS } = await import("./SidePanel");
    for (const variant of SIDE_PANEL_VARIANTS) {
      const { unmount } = render(
        <SidePanel isOpen title="Panel" variant={variant}>
          body
        </SidePanel>,
      );
      expect(screen.getByText("body")).toBeTruthy();
      unmount();
    }
  });

  it("takes a surface instead of a hardcoded white box", () => {
    const { container } = render(
      <SidePanel isOpen title="Panel" variant="floating">
        body
      </SidePanel>,
    );
    expect(container.innerHTML).toContain("shadow");
  });

  it("shares the Panel and workflow rail variant family", async () => {
    const { SIDE_PANEL_VARIANTS } = await import("./SidePanel");
    const { SURFACE_VARIANTS } = await import("../theme/Theme");
    expect(SIDE_PANEL_VARIANTS).toBe(SURFACE_VARIANTS);
  });

  it.each(SIDE_PANEL_VARIANTS)("keeps docking, resizing and collapse behavior with %s", (variant) => {
    const { container } = render(
      <SidePanel isOpen title="Details" variant={variant} side="left"
        inset corner="rounded-lg" collapsible resizable width={420}>
        <input aria-label="Draft" defaultValue="Keep me" />
      </SidePanel>,
    );
    const shell = container.querySelector("[data-sp-shell]") as HTMLElement;
    expect(shell.className).toContain("left-0");
    expect(shell.className).toContain("inset-y-4");
    expect(shell.className).toContain("rounded-r-3xl");
    expect(container.querySelector("[data-sp-fill] section")?.getAttribute("data-variant")).toBe(variant);
    const separator = screen.getByRole("separator");
    fireEvent.keyDown(separator, { key: "ArrowRight" });
    expect(separator.getAttribute("aria-valuenow")).toBe("440");
    fireEvent.click(screen.getByRole("button", { name: /collapse/i }));
    expect(shell.style.width).toBe(`${COLLAPSED_RAIL_WIDTH}px`);
    expect(screen.queryByRole("separator")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(shell.style.width).toBe("440px");
    expect((screen.getByRole("textbox", { name: "Draft" }) as HTMLInputElement).value).toBe("Keep me");
  });

  // ── Inset ──────────────────────────────────────────────────────────────
  const shell = (container: HTMLElement) => container.firstChild as HTMLElement;

  it("sits flush and full-height by default", () => {
    const { container } = render(
      <SidePanel isOpen title="Panel">
        body
      </SidePanel>,
    );
    expect(shell(container).className).toContain("h-full");
    expect(shell(container).className).toContain("right-0");
  });

  it("floats off the top and bottom while staying flush to its edge", () => {
    const { container } = render(
      <SidePanel isOpen inset title="Panel">
        body
      </SidePanel>,
    );
    const cls = shell(container).className;
    // All of the float comes from the vertical gap. A gap on the docked edge
    // read as the panel having come loose, and at a size small enough not to,
    // it was not visible at all.
    expect(cls).toContain("inset-y-4");
    expect(cls).toContain("right-0");
    expect(cls).not.toContain("h-full");
  });

  it("rounds only the corners facing the content", () => {
    const right = render(
      <SidePanel isOpen inset title="Panel">
        body
      </SidePanel>,
    );
    // The docked-edge corners meet the container and have nothing to round
    // against, so a full `rounded-2xl` would cut two corners out of the wall.
    expect(shell(right.container).className).toContain("rounded-l-2xl");
    right.unmount();

    const left = render(
      <SidePanel isOpen inset side="left" title="Panel">
        body
      </SidePanel>,
    );
    expect(shell(left.container).className).toContain("rounded-r-2xl");
  });

  it("takes the corner from the kit's shared scale, as `Panel` does", async () => {
    const { SURFACE_CORNERS, DEFAULT_SURFACE_CORNER, getSurfaceCornerClass } =
      await import("../theme/Theme");

    // Same vocabulary and the same radii, so a panel and a side panel next to
    // each other cannot land on corners that nearly match.
    for (const corner of SURFACE_CORNERS) {
      const { container, unmount } = render(
        <SidePanel isOpen corner={corner} title="Panel">
          body
        </SidePanel>,
      );
      const full = getSurfaceCornerClass(corner); // e.g. "rounded-2xl"
      const expected =
        corner === "none" ? "" : full.replace("rounded-", "rounded-l-");
      if (expected) {
        expect(shell(container).className).toContain(expected);
      } else {
        expect(shell(container).className).not.toContain("rounded");
      }
      unmount();
    }

    const { container } = render(
      <SidePanel isOpen title="Panel">
        body
      </SidePanel>,
    );
    expect(shell(container).className).toContain(
      getSurfaceCornerClass(DEFAULT_SURFACE_CORNER).replace(
        "rounded-",
        "rounded-l-",
      ),
    );
  });

  it("insets the floating variants by default, like SideMenu does", () => {
    // `floating` carries the offset in its own tokens, so the default is read
    // from the variant rather than kept as a second list.
    const { container } = render(
      <SidePanel isOpen variant="floating" title="Panel">
        body
      </SidePanel>,
    );
    expect(shell(container).className).toContain("inset-y-4");
  });

  it("lets inset={false} override a floating variant", () => {
    const { container } = render(
      <SidePanel isOpen variant="floating" inset={false} title="Panel">
        body
      </SidePanel>,
    );
    expect(shell(container).className).toContain("h-full");
    expect(shell(container).className).not.toContain("inset-y-4");
  });

  it("matches the grip to the inset panel's height", () => {
    const { container } = render(
      <SidePanel isOpen inset resizable width={320} title="Panel" />,
    );
    const grip = container.querySelector('[role="separator"]') as HTMLElement;
    expect(grip.style.right).toBe("320px");
    // Or it would run past the panel into the container's own margin.
    expect(grip.className).toContain("inset-y-4");
  });

  it("docks to either edge", () => {
    const right = render(
      <SidePanel isOpen title="Panel">
        body
      </SidePanel>,
    );
    expect(right.container.firstElementChild!.className).toContain("right-0");
    right.unmount();

    const left = render(
      <SidePanel isOpen title="Panel" side="left">
        body
      </SidePanel>,
    );
    expect(left.container.firstElementChild!.className).toContain("left-0");
  });

  it("puts the border on the content-facing edge, when the variant has one", () => {
    // `sidebar` is borderless by design and casts a shadow toward the content
    // instead — so the edge test has to run on a variant that draws a rule.
    const right = render(
      <SidePanel isOpen title="Panel" variant="inset">
        body
      </SidePanel>,
    );
    expect(right.container.firstElementChild!.className).toContain("border-l");
    right.unmount();

    const left = render(
      <SidePanel isOpen title="Panel" variant="inset" side="left">
        body
      </SidePanel>,
    );
    expect(left.container.firstElementChild!.className).toContain("border-r");
  });

  it("outlines the three edges you can see once detached", () => {
    const { container } = render(
      <SidePanel isOpen inset title="Panel" variant="inset">
        body
      </SidePanel>,
    );
    const cls = (container.firstChild as HTMLElement).className;
    // The docked edge stays flush against the container, so a rule there would
    // double up with whatever the container draws.
    expect(cls).toContain("border-y");
    expect(cls).toContain("border-l");
    expect(cls).not.toMatch(/(^|\s)border($|\s)/);
  });

  it("scales its header with `size`", () => {
    const small = render(
      <SidePanel isOpen title="Panel" size="xs">
        body
      </SidePanel>,
    );
    const smallPad = small.container.innerHTML.match(/px-\d(?:\.\d)?/)?.[0];
    small.unmount();

    const large = render(
      <SidePanel isOpen title="Panel" size="xl">
        body
      </SidePanel>,
    );
    expect(large.container.innerHTML.match(/px-\d(?:\.\d)?/)?.[0]).not.toBe(
      smallPad,
    );
  });

  it("`tone` and its deprecated `color` alias agree", () => {
    const a = render(
      <SidePanel isOpen title="Panel" resizable tone="violet">
        body
      </SidePanel>,
    );
    const withTone = a.container.innerHTML;
    a.unmount();
    const b = render(
      <SidePanel isOpen title="Panel" resizable color="violet">
        body
      </SidePanel>,
    );
    expect(b.container.innerHTML).toBe(withTone);
  });
});

describe("SidePanel — the resize handle", () => {
  it("tints with a solid fill rather than an unsafelisted alpha", () => {
    // It used `group-hover:bg-{tone}-300/60` and three siblings, none of which
    // are emitted — the `/60` alpha variants do not exist in the built CSS, so
    // the handle highlighted in no tone at all. Opacity on a solid fill is
    // what SplitView's resizer uses, and those classes do exist.
    const { container } = render(
      <SidePanel isOpen title="Panel" resizable tone="violet">
        body
      </SidePanel>,
    );
    const handle = container.querySelector('[role="separator"]')!;
    expect(handle).not.toBeNull();
    const fill = handle.firstElementChild as HTMLElement;
    expect(fill.className).toContain("bg-violet-400");
    expect(fill.className).toContain("opacity-0");
    expect(container.innerHTML).not.toContain("/60");
  });

  it("names itself for a screen reader", () => {
    render(
      <SidePanel isOpen title="Panel" resizable>
        body
      </SidePanel>,
    );
    expect(
      screen.getByRole("separator", { name: "Resize panel" }),
    ).toBeTruthy();
  });

  it("has no handle unless resizable", () => {
    const { container } = render(
      <SidePanel isOpen title="Panel">
        body
      </SidePanel>,
    );
    expect(container.querySelector('[role="separator"]')).toBeNull();
  });

  // ── Resizing ───────────────────────────────────────────────────────────
  const startResize = (container: HTMLElement, from: number, to: number) => {
    const handle = container.querySelector('[role="separator"]')!;
    fireEvent.mouseDown(handle, { clientX: from });
    fireEvent.mouseMove(window, { clientX: to });
    fireEvent.mouseUp(window);
    // The handle is a sibling of the panel, not a child — read the panel.
    return (container.firstChild as HTMLElement).style.width;
  };

  it("grows a right-docked panel when the pointer moves left", () => {
    const { container } = render(
      <SidePanel isOpen resizable side="right" width={320} title="D" />,
    );
    expect(startResize(container, 500, 450)).toBe("370px");
  });

  it("grows a left-docked panel when the pointer moves right", () => {
    const { container } = render(
      <SidePanel isOpen resizable side="left" width={320} title="D" />,
    );
    // The delta used to be hardcoded for a right-docked panel, so dragging the
    // left panel's handle outward shrank it.
    expect(startResize(container, 500, 550)).toBe("370px");
  });

  it("shrinks a left-docked panel when the pointer moves inward", () => {
    const { container } = render(
      <SidePanel
        isOpen
        resizable
        side="left"
        minWidth={200}
        width={320}
        title="D"
      />,
    );
    expect(startResize(container, 500, 450)).toBe("270px");
  });

  it("clamps a resize to minWidth", () => {
    const { container } = render(
      <SidePanel isOpen resizable side="left" width={320} title="D" />,
    );
    expect(startResize(container, 500, 100)).toBe("280px");
  });

  // ── Open / close animation ─────────────────────────────────────────────
  const widthOf = (container: HTMLElement) =>
    (container.firstChild as HTMLElement).style.width;

  it("opens from zero width so the transition has somewhere to animate from", async () => {
    const { container, rerender } = render(
      <SidePanel isOpen={false} width={320} title="D" />,
    );
    rerender(<SidePanel isOpen width={320} title="D" />);
    // It must be mounted, but collapsed: mounting straight at 320px is what
    // made opening snap while closing animated correctly.
    expect(widthOf(container)).toBe("0px");
    await waitFor(() => expect(widthOf(container)).toBe("320px"));
  });

  it("shows an initially open panel at full width without animating in", () => {
    const { container } = render(<SidePanel isOpen width={320} title="D" />);
    expect(widthOf(container)).toBe("320px");
  });

  it("collapses to zero on close and unmounts once the transition ends", () => {
    const { container, rerender } = render(
      <SidePanel isOpen width={320} title="D" />,
    );
    rerender(<SidePanel isOpen={false} width={320} title="D" />);
    expect(widthOf(container)).toBe("0px");
    fireEvent.transitionEnd(container.firstChild as HTMLElement, {
      propertyName: "width",
    });
    expect(container.firstChild).toBeNull();
  });

  it("ignores transitions that bubble up from inside while closing", () => {
    const { container, rerender } = render(
      <SidePanel isOpen resizable width={320} title="D" />,
    );
    rerender(<SidePanel isOpen={false} resizable width={320} title="D" />);
    const panel = container.firstChild as HTMLElement;
    // The resize handle fades its opacity; that transitionend bubbles to the
    // panel and used to cut the closing animation short by unmounting it.
    fireEvent.transitionEnd(container.querySelector('[role="separator"]')!, {
      propertyName: "opacity",
    });
    expect(container.firstChild).not.toBeNull();
    fireEvent.transitionEnd(panel, { propertyName: "width" });
    expect(container.firstChild).toBeNull();
  });

  it("anchors a left panel to its own right edge so the reveal slides", () => {
    const { container } = render(
      <SidePanel isOpen side="left" width={320} title="D" />,
    );
    const inner = (container.firstChild as HTMLElement)
      .lastElementChild as HTMLElement;
    expect(inner.className).toContain("ml-auto");
  });

  it("draws the resize grip outside the panel, not clipped inside it", () => {
    const { container } = render(
      <SidePanel isOpen resizable side="right" width={320} title="D" />,
    );
    const panel = container.firstChild as HTMLElement;
    const handle = container.querySelector('[role="separator"]') as HTMLElement;
    // A child of the panel would be cut off by its `overflow-hidden`, so the
    // grip has to be a sibling parked at the panel's outer edge.
    expect(handle.parentElement).not.toBe(panel);
    expect(panel.contains(handle)).toBe(false);
    expect(handle.style.right).toBe("320px");
  });

  it("parks the grip on the outer edge for a left-docked panel", () => {
    const { container } = render(
      <SidePanel isOpen resizable side="left" width={320} title="D" />,
    );
    const handle = container.querySelector('[role="separator"]') as HTMLElement;
    expect(handle.style.left).toBe("320px");
    expect(handle.style.right).toBe("");
    // The bar sits on the panel's edge line (centred: 2px at -1px).
    expect((handle.firstElementChild as HTMLElement).className).toContain(
      "-left-px",
    );
  });

  it("runs the grip pill down almost the whole edge", () => {
    const { container } = render(
      <SidePanel isOpen resizable width={320} title="D" />,
    );
    const handle = container.querySelector('[role="separator"]') as HTMLElement;
    // The pointer can be anywhere down the edge, so the affordance has to be
    // there too — a short centred pill was only visible in the middle.
    expect(handle.className).toContain("inset-y-0");
    const pill = handle.firstElementChild as HTMLElement;
    // Default corner is rounded-md (2xl, 16px): the line stops where it curves.
    expect(pill.className).toContain("inset-y-4");
    expect(pill.className).toContain("rounded-full");
    expect(pill.className).toContain("group-hover:opacity-70");
  });

  it("insets the resize line by the corner radius on every side", () => {
    const cases = [
      ["right", "none", "inset-y-0"],
      ["left", "rounded-sm", "inset-y-2"],
      ["top", "rounded-lg", "inset-x-6"],
      ["bottom", "rounded-xl", "inset-x-8"],
    ] as const;
    for (const [side, corner, inset] of cases) {
      const { container, unmount } = render(
        <SidePanel isOpen resizable side={side} corner={corner} title="D" />,
      );
      const line = container.querySelector("[data-sp-handle]")!.firstElementChild as HTMLElement;
      expect(line.className).toContain(inset);
      unmount();
    }
  });

  it("deepens the grip while it is being dragged", () => {
    const { container } = render(
      <SidePanel isOpen resizable tone="blue" width={320} title="D" />,
    );
    const handle = container.querySelector('[role="separator"]') as HTMLElement;
    const pill = () => handle.firstElementChild as HTMLElement;
    expect(pill().className).toContain("bg-blue-400");
    expect(pill().className).toContain("opacity-0");

    // Dragging state lived only in a ref, so this styling never applied —
    // a ref change re-renders nothing.
    fireEvent.mouseDown(handle, { clientX: 500 });
    expect(pill().className).toContain("bg-blue-500");
    expect(pill().className).toContain("opacity-100");

    fireEvent.mouseUp(window);
    expect(pill().className).toContain("bg-blue-400");
  });

  it("slides the grip along with the panel while it opens", async () => {
    const { container, rerender } = render(
      <SidePanel isOpen={false} resizable width={320} title="D" />,
    );
    rerender(<SidePanel isOpen resizable width={320} title="D" />);
    const handle = container.querySelector('[role="separator"]') as HTMLElement;
    // Parked at the closed edge, or it would jump to its final position while
    // the panel was still animating out.
    expect(handle.style.right).toBe("0px");
    expect(handle.style.transition).toContain("right");
    await waitFor(() => expect(handle.style.right).toBe("320px"));
  });
});

describe("SidePanel — the overlay", () => {
  const panelOf = (container: HTMLElement) =>
    container.querySelector('[class*="z-40"]') as HTMLElement;

  it("draws no scrim until it is asked for", () => {
    const { container } = render(
      <SidePanel isOpen onClose={vi.fn()} title="D">
        body
      </SidePanel>,
    );
    expect(container.querySelector('[class*="bg-black"]')).toBeNull();
  });

  it("dims the container behind the panel and closes on a scrim click", () => {
    const onClose = vi.fn();
    const { container } = render(
      <SidePanel isOpen overlay onClose={onClose} title="D">
        body
      </SidePanel>,
    );
    const scrim = container.querySelector('[class*="bg-black"]') as HTMLElement;
    expect(scrim).not.toBeNull();
    // Under the panel (z-30 vs z-40), over the container's content.
    expect(scrim.className).toContain("inset-0");
    expect(panelOf(container).className).toContain("z-40");
    fireEvent.click(scrim);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps the scrim out of the accessibility tree and the tab order", () => {
    const { container } = render(
      <SidePanel isOpen overlay onClose={vi.fn()} title="D">
        body
      </SidePanel>,
    );
    const scrim = container.querySelector('[class*="bg-black"]') as HTMLElement;
    expect(scrim.getAttribute("aria-hidden")).toBe("true");
    expect(scrim.tabIndex).toBe(-1);
  });

  it("fades in with the panel and stays mounted through the close", () => {
    const { container, rerender } = render(
      <SidePanel isOpen overlay onClose={vi.fn()} title="D">
        body
      </SidePanel>,
    );
    const scrim = container.querySelector('[class*="bg-black"]') as HTMLElement;
    expect(scrim.style.opacity).toBe("1");
    expect(scrim.style.transition).toContain("opacity");
    rerender(
      <SidePanel isOpen={false} overlay onClose={vi.fn()} title="D">
        body
      </SidePanel>,
    );
    // Still mounted, fading: the unmount rides the panel's width transition.
    expect(container.querySelector('[class*="bg-black"]')).not.toBeNull();
    fireEvent.transitionEnd(panelOf(container), { propertyName: "width" });
    expect(container.firstChild).toBeNull();
  });
});

describe("SidePanel resize grip", () => {
  const parts = (c: HTMLElement) => {
    const handle = c.querySelector('[role="separator"]') as HTMLElement;
    return {
      bar: handle.firstElementChild as HTMLElement,
      grip: handle.querySelector("[data-sp-grip]") as HTMLElement,
      rest: handle.querySelector("[data-sp-grip-rest]") as HTMLElement,
      active: handle.querySelector("[data-sp-grip-active]") as HTMLElement,
    };
  };

  it("a resizable panel shows a faint grip centred on its edge", () => {
    const { container } = render(
      <SidePanel isOpen resizable title="Details">
        <p>Body</p>
      </SidePanel>,
    );
    const { grip, rest } = parts(container);
    expect(grip.getAttribute("aria-hidden")).toBe("true");
    // A short pill, centred vertically: a quiet neutral at rest, but solid.
    expect(grip.className).toContain("top-1/2");
    expect(grip.className).toContain("-translate-y-1/2");
    expect(grip.className).toContain("h-10");
    expect(rest.className).toContain("bg-neutral-300");
    expect(rest.className).toContain("opacity-100");
  });

  it("the bar is thinner than the grip, and both are centred on the panel edge", () => {
    const right = render(<SidePanel isOpen resizable title="R" />);
    let p = parts(right.container);
    // 2px bar at right:-1px and 4px grip at right:-2px share one centre: the edge.
    expect(p.bar.className).toContain("w-0.5");
    expect(p.bar.className).toContain("-right-px");
    expect(p.grip.className).toContain("w-1");
    expect(p.grip.className).toContain("-right-0.5");
    right.unmount();
    const left = render(<SidePanel isOpen resizable side="left" title="L" />);
    p = parts(left.container);
    expect(p.bar.className).toContain("-left-px");
    expect(p.grip.className).toContain("-left-0.5");
  });

  it("on hover the grip stays, taking the bar's colour — a bulge on the line", () => {
    const { container } = render(<SidePanel isOpen resizable tone="violet" title="V" />);
    const { bar, rest, active } = parts(container);
    // The neutral layer hands over to one in the bar's colour — but solid,
    // where the bar itself is a 70% line.
    expect(rest.className).toContain("group-hover:opacity-0");
    for (const cls of ["bg-violet-400", "opacity-0", "group-hover:opacity-70"]) {
      expect(bar.className).toContain(cls);
    }
    for (const cls of ["bg-violet-400", "opacity-0", "group-hover:opacity-100"]) {
      expect(active.className).toContain(cls);
    }
    expect(active.className).not.toContain("opacity-70");
  });

  it("while dragging the grip deepens with the bar", () => {
    const { container } = render(<SidePanel isOpen resizable tone="blue" title="D" />);
    fireEvent.mouseDown(container.querySelector('[role="separator"]')!, { clientX: 100 });
    const { bar, rest, active } = parts(container);
    expect(bar.className).toContain("bg-blue-500");
    expect(active.className).toContain("bg-blue-500");
    expect(active.className).toContain("opacity-100");
    expect(rest.className).toContain("opacity-0");
    fireEvent.mouseUp(window);
  });

  it("a fixed-width panel has no grip", () => {
    const { container } = render(<SidePanel isOpen title="Details" />);
    expect(container.querySelector("[data-sp-grip]")).toBeNull();
  });
});

describe("SidePanel collapse", () => {
  const shell = (c: HTMLElement) => c.querySelector("[data-sp-shell]") as HTMLElement;

  it("is not collapsible by default", () => {
    render(<SidePanel isOpen title="Inspector" />);
    expect(screen.queryByRole("button", { name: "Collapse panel" })).toBeNull();
  });

  it("collapses to the workflow rail's width with an expand button and the title running vertically", () => {
    const onCollapsedChange = vi.fn();
    const { container } = render(
      <SidePanel isOpen collapsible title="Inspector" onCollapsedChange={onCollapsedChange}>
        <p>Body</p>
      </SidePanel>,
    );
    const collapse = screen.getByRole("button", { name: "Collapse panel" });
    expect(collapse.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(collapse);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(shell(container).getAttribute("data-collapsed")).toBe("true");
    expect(shell(container).style.width).toBe(`${COLLAPSED_RAIL_WIDTH}px`);
    const expand = screen.getByRole("button", { name: "Expand panel" });
    expect(expand.getAttribute("aria-expanded")).toBe("false");
    const label = container.querySelector("[data-sp-collapsed-label]") as HTMLElement;
    expect(label.textContent).toBe("Inspector");
    expect(label.className).toContain("[writing-mode:vertical-rl]");
    // The full content stays mounted but out of reach while collapsed.
    expect(container.querySelector("[data-sp-content]")!.hasAttribute("inert")).toBe(true);
    fireEvent.click(expand);
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false);
    expect(shell(container).style.width).toBe("420px");
  });

  it("the collapsed width is the workflow rail's (56px)", () => {
    expect(COLLAPSED_RAIL_WIDTH).toBe(56);
  });

  it("controlled collapsed wins over clicks", () => {
    const { container } = render(<SidePanel isOpen collapsible collapsed title="Inspector" onCollapsedChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Expand panel" }));
    expect(shell(container).getAttribute("data-collapsed")).toBe("true");
  });

  it("defaultCollapsed starts collapsed", () => {
    const { container } = render(<SidePanel isOpen collapsible defaultCollapsed title="Inspector" />);
    expect(shell(container).getAttribute("data-collapsed")).toBe("true");
  });

  it("a collapsed panel cannot be resized and its scrim steps back", () => {
    const { container } = render(<SidePanel isOpen collapsible defaultCollapsed resizable overlay title="Inspector" />);
    expect(container.querySelector('[role="separator"]')).toBeNull();
    const scrim = container.querySelector(".bg-black\\/20") as HTMLElement;
    expect(scrim.style.pointerEvents).toBe("none");
  });

  it("a collapsed label can be set apart from the title", () => {
    const { container } = render(
      <SidePanel isOpen collapsible defaultCollapsed title={<span>Inspector</span>} collapsedLabel="Props" />,
    );
    expect(container.querySelector("[data-sp-collapsed-label]")!.textContent).toBe("Props");
  });
});

describe("SidePanel collapse replaces close", () => {
  it("a collapsible panel has no close button — it collapses and expands instead", () => {
    render(<SidePanel isOpen collapsible onClose={() => {}} title="Inspector" />);
    expect(screen.queryByRole("button", { name: "Close panel" })).toBeNull();
    expect(screen.getByRole("button", { name: "Collapse panel" })).toBeTruthy();
  });

  it("a panel that is not collapsible keeps its close button", () => {
    render(<SidePanel isOpen onClose={() => {}} title="Details" />);
    expect(screen.getByRole("button", { name: "Close panel" })).toBeTruthy();
  });

  it("the chevron is drawn on the close glyph's geometry, so the two buttons match", () => {
    // Close: 24-unit box, arms spanning 6.97→17.03 at 45°, 1.5 units thick.
    const { container } = render(<SidePanel isOpen collapsible title="Inspector" />);
    const svg = container.querySelector("[data-collapse-chevron]") as SVGElement;
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    const path = svg.querySelector("path")!;
    expect(path.getAttribute("stroke-width")).toBe("1.5");
    expect(path.getAttribute("d")).toBe("M9.5 6.97 14.53 12 9.5 17.03");
  });

  it("the collapse button is the same size as the close button would be", () => {
    const { container: a } = render(<SidePanel isOpen onClose={() => {}} title="A" size="lg" />);
    const close = a.querySelector('button[aria-label="Close panel"]') as HTMLElement;
    const { container: b } = render(<SidePanel isOpen collapsible title="B" size="lg" />);
    const collapse = b.querySelector('button[aria-label="Collapse panel"]') as HTMLElement;
    expect(collapse.className).toBe(close.className);
    // The glyph box: Close sizes a wrapper span around a full-size svg, the
    // chevron sizes its svg — compare the h-/w- tokens of whichever is sized.
    const box = (el: Element | null) =>
      (el?.getAttribute("class") ?? "").split(" ").filter((c) => /^[hw]-\d/.test(c)).sort();
    const closeBox = box(close.querySelector("[class*='h-']:not(svg)") ?? close.querySelector("svg"));
    expect(closeBox.length).toBe(2);
    expect(box(collapse.querySelector("svg"))).toEqual(closeBox);
  });

  it("the chevron is decorative — the button carries the name", () => {
    const { container } = render(<SidePanel isOpen collapsible title="Inspector" />);
    const svg = container.querySelector("[data-collapse-chevron]") as SVGElement;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("focusable")).toBe("false");
  });
});

describe("SidePanel header buttons stay neutral", () => {
  it("close and collapse ignore the accent — it belongs to the resize handle", () => {
    const { container: a } = render(<SidePanel isOpen onClose={() => {}} tone="violet" title="A" />);
    const close = a.querySelector('button[aria-label="Close panel"]') as HTMLElement;
    const { container: b } = render(<SidePanel isOpen collapsible tone="violet" title="B" />);
    const collapse = b.querySelector('button[aria-label="Collapse panel"]') as HTMLElement;
    for (const btn of [close, collapse]) {
      expect(btn.className).not.toContain("violet");
      expect(btn.className).toContain("neutral");
    }
  });
});

describe("SidePanel handle while collapsing", () => {
  it("stays mounted, parked on the rail edge and hidden, so expanding animates it with the panel", () => {
    const { container } = render(<SidePanel isOpen collapsible resizable width={320} title="Inspector" />);
    const handle = () => container.querySelector("[data-sp-handle]") as HTMLElement;
    const open = handle();
    expect(open.getAttribute("role")).toBe("separator");
    fireEvent.click(screen.getByRole("button", { name: "Collapse panel" }));
    const parked = handle();
    // Same node: a fresh mount would appear at its final spot with nothing to animate from.
    expect(parked).toBe(open);
    expect(parked.style.right).toBe(`${COLLAPSED_RAIL_WIDTH}px`);
    expect(parked.getAttribute("role")).toBeNull();
    expect(parked.getAttribute("aria-hidden")).toBe("true");
    expect(parked.getAttribute("tabindex")).toBe("-1");
    expect(parked.className).toContain("pointer-events-none");
    expect(parked.className).toContain("opacity-0");
    fireEvent.click(screen.getByRole("button", { name: "Expand panel" }));
    expect(handle()).toBe(open);
    expect(handle().style.right).toBe("320px");
    expect(handle().style.transition).toContain("right");
    expect(handle().className).not.toContain("opacity-0 ");
  });
});


it("sits in flow when docked, at its own width, and unmounts when closed", () => {
  const { container, rerender } = render(<SidePanel docked isOpen overlay width={300} title="Docked">Content</SidePanel>);
  const shell = container.querySelector("[data-sp-shell]") as HTMLElement;
  expect(container.firstChild).toHaveAttribute("data-sp-dock");
  expect(shell).toHaveClass("relative", "h-full", "shrink-0");
  expect(shell.style.width).toBe("300px");
  // No scrim in flow: there is nothing to cover.
  expect(container.querySelector(".bg-black\\/20")).toBeNull();
  rerender(<SidePanel docked isOpen={false} title="Docked" />);
  expect(container.firstChild).toBeNull();
});

it("resizes a docked panel with its own handle, on the edge facing the content", () => {
  render(<SidePanel docked isOpen resizable width={300} minWidth={200} maxWidth={400} title="Files">Content</SidePanel>);
  const handle = screen.getByRole("separator", { name: "Resize panel" });
  expect(handle.style.right).toBe("300px");
  fireEvent.keyDown(handle, { key: "ArrowLeft" });
  expect(handle).toHaveAttribute("aria-valuenow", "320");
  fireEvent.mouseDown(handle, { clientX: 500 });
  fireEvent.mouseMove(window, { clientX: 460 });
  fireEvent.mouseUp(window);
  expect(handle).toHaveAttribute("aria-valuenow", "360");
  expect(document.body.style.cursor).toBe("");
});

it("resizes a docked bottom panel upward by its top edge", () => {
  const { container } = render(<SidePanel docked side="bottom" isOpen resizable height={200} minHeight={120} maxHeight={300} title="Terminal">Out</SidePanel>);
  const shell = container.querySelector("[data-sp-shell]") as HTMLElement;
  expect(shell).toHaveClass("w-full");
  expect(shell.style.height).toBe("200px");
  const handle = screen.getByRole("separator", { name: "Resize panel" });
  expect(handle).toHaveAttribute("aria-orientation", "horizontal");
  expect(handle.style.bottom).toBe("200px");
  fireEvent.keyDown(handle, { key: "ArrowUp" });
  expect(shell.style.height).toBe("220px");
  fireEvent.mouseDown(handle, { clientY: 400 });
  fireEvent.mouseMove(window, { clientY: 300 });
  fireEvent.mouseUp(window);
  expect(handle).toHaveAttribute("aria-valuenow", "300");
  fireEvent.keyDown(handle, { key: "Home" });
  expect(shell.style.height).toBe("120px");
});

it("rounds every corner when docked, like the workflow rail", () => {
  const { container } = render(<SidePanel docked isOpen side="left" corner="rounded-md" title="Docked">Content</SidePanel>);
  expect(container.querySelector("[data-sp-shell]")).toHaveClass("rounded-2xl");
});

it("folds a docked bottom panel to a labelled strip and expands it upward", () => {
  const onCollapsedChange = vi.fn();
  const { container, rerender } = render(
    <SidePanel docked side="bottom" isOpen collapsible collapsed={false} onCollapsedChange={onCollapsedChange} title="Terminal"><p>Output</p></SidePanel>,
  );
  const toggle = screen.getByRole("button", { name: "Collapse panel" });
  expect(toggle.querySelector("[data-collapse-chevron]")).toHaveClass("rotate-90");
  fireEvent.click(toggle);
  expect(onCollapsedChange).toHaveBeenCalledWith(true);
  rerender(<SidePanel docked side="bottom" isOpen collapsible collapsed onCollapsedChange={onCollapsedChange} title="Terminal"><p>Output</p></SidePanel>);
  // Like the side rail: only the expand chevron and the label, laid along a
  // strip as tall as the rail is wide; the full panel stays mounted but inert.
  const shell = container.querySelector("[data-sp-shell]") as HTMLElement;
  expect(shell.style.height).toBe(`${COLLAPSED_RAIL_WIDTH}px`);
  const strip = container.querySelector("[data-sp-collapsed]") as HTMLElement;
  expect(strip).toHaveClass("flex-row");
  expect(strip.querySelector("[data-sp-collapsed-label]")).toHaveTextContent("Terminal");
  expect(strip.querySelector("[data-sp-collapsed-label]")?.className).not.toContain("vertical-rl");
  const expand = screen.getByRole("button", { name: "Expand panel" });
  expect(expand).toHaveAttribute("aria-expanded", "false");
  expect(expand.querySelector("[data-collapse-chevron]")).toHaveClass("-rotate-90");
  expect(container.querySelector("[data-sp-content]")).toHaveAttribute("inert");
  expect(screen.getByText("Output")).toBeInTheDocument();
});

describe("SidePanel — top and bottom", () => {
  it("slides a bottom overlay up from its edge at its own height", () => {
    const { container } = render(<SidePanel isOpen side="bottom" height={180} title="Logs">Out</SidePanel>);
    const shell = container.querySelector("[data-sp-shell]") as HTMLElement;
    expect(shell).toHaveClass("absolute", "bottom-0", "left-0", "w-full", "rounded-t-2xl");
    expect(shell.style.height).toBe("180px");
    expect(shell.style.transition).toContain("height");
  });

  it("floats an inset top overlay off its side edges", () => {
    const { container } = render(<SidePanel isOpen side="top" inset title="Search">Out</SidePanel>);
    expect(container.querySelector("[data-sp-shell]")).toHaveClass("top-0", "inset-x-4", "rounded-b-2xl");
  });

  it("folds a top panel to a labelled strip with an upward chevron, and grows it downward", () => {
    const { container } = render(<SidePanel docked side="top" isOpen collapsible resizable height={200} minHeight={100} maxHeight={300} title="Filters">Body</SidePanel>);
    const handle = screen.getByRole("separator", { name: "Resize panel" });
    expect(handle.style.top).toBe("200px");
    fireEvent.keyDown(handle, { key: "ArrowDown" });
    expect(handle).toHaveAttribute("aria-valuenow", "220");
    fireEvent.mouseDown(handle, { clientY: 300 });
    fireEvent.mouseMove(window, { clientY: 340 });
    fireEvent.mouseUp(window);
    expect(handle).toHaveAttribute("aria-valuenow", "260");
    const toggle = screen.getByRole("button", { name: "Collapse panel" });
    expect(toggle.querySelector("[data-collapse-chevron]")).toHaveClass("-rotate-90");
    fireEvent.click(toggle);
    expect(container.querySelector("[data-sp-collapsed-label]")).toHaveTextContent("Filters");
    expect(screen.getByRole("button", { name: "Expand panel" })).toBeInTheDocument();
    // A top panel's content hangs off its bottom edge, so opening slides it down.
    expect(container.querySelector("[data-sp-content]")).toHaveClass("absolute", "bottom-0");
  });
});

describe("SidePanel — inset", () => {
  it("keeps inset={true} at the original 16px gap", () => {
    const { container } = render(<SidePanel isOpen inset title="D">Out</SidePanel>);
    expect(container.querySelector("[data-sp-shell]")).toHaveClass("inset-y-4");
  });

  it("takes a size from the padding scale, on the axis beside the docked edge", () => {
    const { container, rerender } = render(<SidePanel isOpen resizable inset="sm" title="D">Out</SidePanel>);
    expect(container.querySelector("[data-sp-shell]")).toHaveClass("inset-y-2");
    expect(container.querySelector("[data-sp-handle]")).toHaveClass("inset-y-2");
    rerender(<SidePanel isOpen resizable side="bottom" inset="xl" title="D">Out</SidePanel>);
    expect(container.querySelector("[data-sp-shell]")).toHaveClass("inset-x-8");
    expect(container.querySelector("[data-sp-handle]")).toHaveClass("inset-x-8");
    rerender(<SidePanel isOpen inset="none" title="D">Out</SidePanel>);
    expect(container.querySelector("[data-sp-shell]")).toHaveClass("top-0", "h-full");
  });

  it("pads a docked panel's wrapper, so it is shorter than its zone", () => {
    const { container, rerender } = render(<SidePanel docked isOpen resizable inset="md" title="D">Out</SidePanel>);
    expect(container.querySelector("[data-sp-dock]")).toHaveClass("py-4");
    expect(container.querySelector("[data-sp-handle]")).toHaveClass("inset-y-4");
    rerender(<SidePanel docked isOpen side="bottom" inset="lg" title="D">Out</SidePanel>);
    expect(container.querySelector("[data-sp-dock]")).toHaveClass("px-6");
  });
});
