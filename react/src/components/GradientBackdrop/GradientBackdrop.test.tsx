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
});
