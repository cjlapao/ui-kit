import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import GlassBackground from "./GlassBackground";

const root = (c: HTMLElement) => c.firstElementChild as HTMLElement;

describe("GlassBackground — positioning", () => {
  it("defaults to absolute so it stays inside its parent", () => {
    const { container } = render(<GlassBackground />);
    // `fixed` escapes any scrolled container and covers the page; it is only
    // correct for a page-level backdrop, so it must be opted into.
    expect(root(container).className).toContain("absolute");
    expect(root(container).className).not.toContain("fixed");
  });

  it("still supports fixed when asked", () => {
    const { container } = render(<GlassBackground position="fixed" />);
    expect(root(container).className).toContain("fixed");
  });
});

describe("GlassBackground — shimmer", () => {
  it("renders nothing when off", () => {
    const { container } = render(<GlassBackground />);
    expect(container.querySelector(".shimmer-band")).toBeNull();
  });

  it("clips the band so it cannot paint outside the surface", () => {
    const { container } = render(<GlassBackground shimmer />);
    const band = container.querySelector(".shimmer-band")!;

    expect(band).not.toBeNull();
    // A full-width band translated past the edges used to bleed over whatever
    // sat next to the background, because nothing clipped it.
    expect(band.parentElement!.className).toContain("overflow-hidden");
  });
});

describe("GlassBackground — ambient glows", () => {
  it("renders two glows when on, none when off", () => {
    const { container: on } = render(<GlassBackground ambient />);
    expect(on.querySelectorAll(".ambient-glow")).toHaveLength(2);

    const { container: off } = render(<GlassBackground ambient={false} />);
    expect(off.querySelectorAll(".ambient-glow")).toHaveLength(0);
  });

  it("colours the glow from custom properties, not a dynamic class", () => {
    const { container } = render(<GlassBackground color="emerald" ambient />);
    const glow = container.querySelector(".ambient-glow") as HTMLElement;

    // `bg-{color}-400/12` was never safelisted, so the glows had no background
    // at all in light mode.
    expect(glow.className).not.toContain("bg-emerald");
    expect(glow.style.getPropertyValue("--glow-color")).toBe(
      "var(--color-emerald-400)",
    );
    expect(glow.style.getPropertyValue("--glow-color-dark")).toBe(
      "var(--color-emerald-500)",
    );
  });
});
