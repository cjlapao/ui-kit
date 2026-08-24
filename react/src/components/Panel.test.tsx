import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Panel from "./Panel";

const panelOf = (container: HTMLElement) =>
  container.querySelector("section")!;

describe("Panel — outlined border", () => {
  it("draws a hairline border instead of a currentColor ring", () => {
    const { container } = render(<Panel variant="outlined">Body</Panel>);
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
      expect(layer.style.backgroundImage).toMatch(/rgba\(255,\s*255,\s*255,\s*0\)/);
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
    expect(layers.some((el) => el.className.includes("dark:hidden"))).toBe(true);
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
