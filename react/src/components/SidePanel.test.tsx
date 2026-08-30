import { describe, it, expect } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import SidePanel from "./SidePanel";

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
    expect(
      container.querySelector("[data-sp-noise]"),
    ).toBeNull();
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
    expect(fill.className).toContain("backdrop-blur");
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

  it("draws from SideMenu's surface family, not Panel's", async () => {
    // A docked panel and a docked menu are the same object; they used to be
    // dressed from different vocabularies.
    const { SIDE_PANEL_VARIANTS } = await import("./SidePanel");
    const { SIDEBAR_VARIANTS } = await import("../theme/Theme");
    expect([...SIDE_PANEL_VARIANTS]).toEqual([...SIDEBAR_VARIANTS]);
  });

  // ── Inset ──────────────────────────────────────────────────────────────
  const shell = (container: HTMLElement) => container.firstChild as HTMLElement;

  it("sits flush and full-height by default", () => {
    const { container } = render(<SidePanel isOpen title="Panel">body</SidePanel>);
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

    const { container } = render(<SidePanel isOpen title="Panel">body</SidePanel>);
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
      <SidePanel isOpen resizable side="left" minWidth={200} width={320} title="D" />,
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
    expect((handle.firstElementChild as HTMLElement).className).toContain(
      "left-0.5",
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
    expect(pill.className).toContain("inset-y-2");
    expect(pill.className).toContain("rounded-full");
    expect(pill.className).toContain("group-hover:opacity-70");
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
