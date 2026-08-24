import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DynamicImg from "./DynamicImg";

const svg = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`;
const asDataUrl = (markup: string) =>
  `data:image/svg+xml;base64,${btoa(markup)}`;

const PNG = "data:image/png;base64,iVBORw0KGgo=";

describe("DynamicImg", () => {
  it("never injects a script, even from a valid data URL", () => {
    const { container } = render(
      <DynamicImg src={asDataUrl(svg('<script>alert(1)</script><path d="M0 0"/>'))} />,
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("path")).not.toBeNull();
  });

  it("falls back rather than rendering markup it cannot sanitise", () => {
    const { container } = render(<DynamicImg src="<div>not svg</div>" />);
    expect(container.innerHTML).not.toContain("not svg");
  });

  it("renders a raster data URL at the requested size", () => {
    // The raster branch used to ignore `size` entirely.
    render(<DynamicImg src={PNG} alt="A picture" size="lg" />);
    const img = screen.getByRole("img", { name: "A picture" });
    expect(img.className).toContain("h-8");
  });

  it("supports raster formats beyond PNG", () => {
    for (const type of ["jpeg", "gif", "webp", "avif"]) {
      const { container, unmount } = render(
        <DynamicImg src={`data:image/${type};base64,AAAA`} alt="x" />,
      );
      expect(container.querySelector("img")).not.toBeNull();
      unmount();
    }
  });

  it("accepts raw markup, not just a data URL", () => {
    const { container } = render(<DynamicImg src={svg('<circle r="4"/>')} />);
    expect(container.querySelector("circle")).not.toBeNull();
  });

  it("still accepts the deprecated base64 prop", () => {
    const { container } = render(
      <DynamicImg base64={asDataUrl(svg('<path d="M0 0"/>'))} />,
    );
    expect(container.querySelector("path")).not.toBeNull();
  });

  describe("accessibility", () => {
    it("is decoration without an alt", () => {
      const { container } = render(
        <DynamicImg src={svg('<path d="M0 0"/>')} />,
      );
      expect(
        (container.firstElementChild as HTMLElement).getAttribute("aria-hidden"),
      ).toBe("true");
    });

    it("is an image with one", () => {
      // The old code hardcoded `alt="Dynamic Image"` — noise for a screen
      // reader, with no way to opt out.
      render(<DynamicImg src={svg('<path d="M0 0"/>')} alt="Company logo" />);
      expect(screen.getByRole("img", { name: "Company logo" })).toBeTruthy();
    });

    it("hides a decorative raster too", () => {
      const { container } = render(<DynamicImg src={PNG} />);
      expect(container.querySelector("img")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
    });
  });

  describe("colour", () => {
    it("recolours by default", () => {
      const { container } = render(
        <DynamicImg src={svg('<path d="M0 0" fill="#123456"/>')} />,
      );
      expect(container.innerHTML).toContain("currentColor");
      expect(container.innerHTML).not.toContain("#123456");
    });

    it("keeps the original colours when colored", () => {
      const { container } = render(
        <DynamicImg src={svg('<path d="M0 0" fill="#123456"/>')} colored />,
      );
      expect(container.innerHTML).toContain("#123456");
    });

    it("applies a tone class", () => {
      const { container } = render(
        <DynamicImg src={svg('<path d="M0 0"/>')} tone="violet" />,
      );
      expect((container.firstElementChild as HTMLElement).className).toContain(
        "text-violet-500",
      );
    });
  });

  it("steps with size", () => {
    const seen = new Set<string>();
    for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
      const { container, unmount } = render(
        <DynamicImg src={svg('<path d="M0 0"/>')} size={size} />,
      );
      seen.add(
        (container.firstElementChild as HTMLElement).className.match(/h-\d+/)![0],
      );
      unmount();
    }
    expect(seen.size).toBe(5);
  });

  it("shows the fallback icon when there is nothing to render", () => {
    const { container } = render(<DynamicImg src="" />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
