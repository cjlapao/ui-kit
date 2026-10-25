import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  GradientBackdrop,
  GRADIENT_BACKDROP_TEMPLATES,
  gradientBackdropCss,
  resolveGradientBackdropTheme,
} from "./index";

const root = (c: HTMLElement) => c.querySelector("[data-gradient-backdrop]") as HTMLElement;
const css = (id: keyof typeof GRADIENT_BACKDROP_TEMPLATES, scheme: "light" | "dark") => {
  const t = GRADIENT_BACKDROP_TEMPLATES[id];
  return gradientBackdropCss(t[scheme], t.shape);
};

describe("GradientBackdrop", () => {
  it("defaults to Slate and follows the kit's dark mode through CSS variables", () => {
    const { container } = render(<GradientBackdrop />);
    const el = root(container);
    expect(el.getAttribute("data-theme")).toBe("slate");
    expect(el.style.getPropertyValue("--gradient-backdrop-light")).toBe(css("slate", "light"));
    expect(el.style.getPropertyValue("--gradient-backdrop-dark")).toBe(css("slate", "dark"));
    expect(el.className).toContain("[background:var(--gradient-backdrop-light)]");
    expect(el.className).toContain("dark:[background:var(--gradient-backdrop-dark)]");
  });

  it.each(Object.keys(GRADIENT_BACKDROP_TEMPLATES))("renders the %s template", (id) => {
    const { container } = render(<GradientBackdrop theme={id as keyof typeof GRADIENT_BACKDROP_TEMPLATES} />);
    expect(root(container).style.getPropertyValue("--gradient-backdrop-dark")).toBe(
      css(id as keyof typeof GRADIENT_BACKDROP_TEMPLATES, "dark"),
    );
  });

  it("a custom theme with only light colours gets a derived dark side", () => {
    const theme = { light: { glow: "#fde68a", from: "#fffbeb", via: "#fef3c7", to: "#fcd34d" } };
    const { container } = render(<GradientBackdrop theme={theme} />);
    const t = resolveGradientBackdropTheme(theme);
    expect(root(container).getAttribute("data-theme")).toBe("custom");
    expect(root(container).style.getPropertyValue("--gradient-backdrop-light")).toBe(gradientBackdropCss(theme.light, t.shape));
    expect(root(container).style.getPropertyValue("--gradient-backdrop-dark")).toBe(gradientBackdropCss(t.dark, t.shape));
  });

  it.each(["light", "dark"] as const)("scheme=%s pins that scheme with an inline background", (scheme) => {
    const { container } = render(<GradientBackdrop theme="mist" scheme={scheme} />);
    const el = root(container);
    expect(el.getAttribute("data-scheme")).toBe(scheme);
    expect(el.style.background).toBeTruthy();
    expect(el.className).not.toContain("var(--gradient-backdrop");
    expect(el.style.getPropertyValue("--gradient-backdrop-light")).toBe("");
  });

  it("renders children above the backdrop and forwards attributes", () => {
    const { container } = render(
      <GradientBackdrop className="min-h-40 p-6" data-testid="bd" aria-label="Preview">
        <p>On top</p>
      </GradientBackdrop>,
    );
    expect(screen.getByText("On top")).toBeTruthy();
    expect(root(container).className).toContain("min-h-40");
    expect(screen.getByTestId("bd").getAttribute("aria-label")).toBe("Preview");
  });

  it("a caller's style is kept alongside the backdrop", () => {
    const { container } = render(<GradientBackdrop style={{ borderRadius: 12 }} />);
    expect(root(container).style.borderRadius).toBe("12px");
    expect(root(container).style.getPropertyValue("--gradient-backdrop-light")).not.toBe("");
  });

  describe("noise", () => {
    const noise = (c: HTMLElement) => c.querySelector("[data-gradient-backdrop-noise]") as HTMLElement | null;

    it("is off by default", () => {
      const { container } = render(<GradientBackdrop />);
      expect(noise(container)).toBeNull();
    });

    it("paints a desaturated fractal-noise layer: decorative, behind the content", () => {
      const { container } = render(
        <GradientBackdrop noise>
          <p>Content</p>
        </GradientBackdrop>,
      );
      const layer = noise(container)!;
      expect(layer).toBeTruthy();
      expect(layer.getAttribute("aria-hidden")).toBe("true");
      expect(layer.className).toContain("pointer-events-none");
      expect(layer.style.backgroundImage).toContain("feTurbulence");
      expect(layer.style.backgroundImage).toContain("saturate");
      // Below the children without wrapping them: a negative z-index inside
      // the root's own stacking context.
      expect(layer.className).toContain("-z-10");
      expect(root(container).className).toContain("isolate");
      expect(screen.getByText("Content").parentElement).toBe(root(container));
    });

    it("scales a repeating tile without changing the backdrop or forwarding the prop", () => {
      const { container, rerender } = render(<GradientBackdrop noise noiseScale={0.5} />);
      expect(noise(container)!.style.backgroundSize).toBe("100px 100px");
      expect(noise(container)!.style.backgroundRepeat).toBe("repeat");
      expect(root(container).hasAttribute("noiseScale")).toBe(false);
      rerender(<GradientBackdrop noise noiseScale={2} />);
      expect(noise(container)!.style.backgroundSize).toBe("400px 400px");
      rerender(<GradientBackdrop noise />);
      expect(noise(container)!.style.backgroundSize).toBe("");
      for (const value of [0, -1, NaN, Infinity]) {
        rerender(<GradientBackdrop noise noiseScale={value} />);
        expect(noise(container)!.style.backgroundSize).toBe("");
      }
    });

    it("auto: multiply in light, overlay in dark (overlay is a no-op on a light base)", () => {
      const { container } = render(<GradientBackdrop noise />);
      const cls = noise(container)!.className;
      expect(cls).toContain("mix-blend-multiply");
      expect(cls).toContain("opacity-[0.08]");
      expect(cls).toContain("dark:mix-blend-overlay");
      expect(cls).toContain("dark:opacity-[0.4]");
    });

    it("follows a pinned scheme, not the page", () => {
      const { container: d } = render(<GradientBackdrop noise scheme="dark" />);
      expect(noise(d)!.className).toContain("mix-blend-overlay");
      expect(noise(d)!.className).not.toContain("mix-blend-multiply");
      const { container: l } = render(<GradientBackdrop noise scheme="light" />);
      expect(noise(l)!.className).toContain("mix-blend-multiply");
      expect(noise(l)!.className).not.toContain("dark:");
    });
  });
});

