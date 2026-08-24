import { describe, it, expect } from "vitest";
import { parseImageSource, sanitizeSvg } from "./sanitizeSvg";

const wrap = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`;

describe("sanitizeSvg — the vectors it exists to close", () => {
  it("strips <script>", () => {
    const out = sanitizeSvg(wrap('<script>alert(1)</script><path d="M0 0"/>'));
    expect(out).not.toBeNull();
    expect(out).not.toContain("script");
    expect(out).toContain("<path");
  });

  it("strips every on* handler, whatever its case", () => {
    const out = sanitizeSvg(
      wrap('<path d="M0 0" onload="alert(1)" ONCLICK="alert(2)" onMouseOver="x"/>'),
    );
    expect(out?.toLowerCase()).not.toContain("onload");
    expect(out?.toLowerCase()).not.toContain("onclick");
    expect(out?.toLowerCase()).not.toContain("onmouseover");
  });

  it("strips <foreignObject>, which can hold arbitrary HTML", () => {
    const out = sanitizeSvg(
      wrap("<foreignObject><body><script>alert(1)</script></body></foreignObject>"),
    );
    expect(out).not.toContain("foreignObject");
    expect(out).not.toContain("script");
  });

  it("strips SMIL animation, which can animate an attribute into a handler", () => {
    const out = sanitizeSvg(
      wrap('<set attributeName="onload" to="alert(1)"/><animate attributeName="fill"/>'),
    );
    expect(out).not.toContain("<set");
    expect(out).not.toContain("<animate");
  });

  it("strips <a href='javascript:'>", () => {
    const out = sanitizeSvg(
      wrap('<a href="javascript:alert(1)"><path d="M0 0"/></a>'),
    );
    expect(out?.toLowerCase()).not.toContain("javascript:");
    expect(out).not.toContain("<a ");
  });

  it("drops href unless it points inside the document", () => {
    const external = sanitizeSvg(wrap('<use href="https://evil.test/x.svg#a"/>'));
    expect(external).not.toContain("evil.test");

    const internal = sanitizeSvg(wrap('<use href="#icon"/>'));
    expect(internal).toContain('href="#icon"');
  });

  it("strips <image>, which fetches a remote URL", () => {
    const out = sanitizeSvg(wrap('<image href="https://evil.test/pixel.png"/>'));
    expect(out).not.toContain("image");
    expect(out).not.toContain("evil.test");
  });

  it("strips <style>, since CSS carries url() and @import", () => {
    const out = sanitizeSvg(
      wrap("<style>@import url(https://evil.test/x.css);</style>"),
    );
    expect(out).not.toContain("style>");
    expect(out).not.toContain("evil.test");
  });

  it("drops a style attribute carrying url() or javascript:", () => {
    const out = sanitizeSvg(
      wrap('<path d="M0 0" style="fill:url(https://evil.test/x)"/>'),
    );
    expect(out).not.toContain("evil.test");
  });

  it("keeps a harmless style attribute", () => {
    const out = sanitizeSvg(wrap('<path d="M0 0" style="fill-opacity:0.5"/>'));
    expect(out).toContain("fill-opacity:0.5");
  });

  it("is not fooled by a namespace prefix", () => {
    const out = sanitizeSvg(
      wrap('<svg:script xmlns:svg="http://www.w3.org/2000/svg">alert(1)</svg:script>'),
    );
    expect(out).not.toContain("alert");
  });

  it("drops a paint attribute pointing at an external url()", () => {
    const out = sanitizeSvg(wrap('<path d="M0 0" fill="url(https://evil.test/x)"/>'));
    expect(out).not.toContain("evil.test");
  });

  it("keeps a url() reference that stays in the document", () => {
    const out = sanitizeSvg(
      wrap('<path d="M0 0" fill="url(#grad)"/>'),
      {},
    );
    expect(out).toContain("url(#grad)");
  });

  describe("fails closed", () => {
    it.each([
      ["not markup at all", "hello"],
      ["HTML, not SVG", "<div>hi</div>"],
      ["an empty string", ""],
      ["malformed XML", "<svg><path d="],
    ])("rejects %s", (_label, input) => {
      expect(sanitizeSvg(input)).toBeNull();
    });
  });
});

describe("sanitizeSvg — recolouring", () => {
  it("recolours a fill", () => {
    const out = sanitizeSvg(wrap('<path d="M0 0" fill="#123456"/>'), {
      fill: "currentColor",
    });
    expect(out).toContain('fill="currentColor"');
    expect(out).not.toContain("#123456");
  });

  it("leaves fill=none alone", () => {
    // Rewriting `none` turns an outline-only shape into a solid blob — the old
    // regex did exactly that to every stroke-only icon.
    const out = sanitizeSvg(
      wrap('<path d="M0 0" fill="none" stroke="#000"/>'),
      { fill: "currentColor", stroke: "currentColor" },
    );
    expect(out).toContain('fill="none"');
    expect(out).toContain('stroke="currentColor"');
  });

  it("leaves gradient stops alone", () => {
    // Recolouring stops collapses a gradient to a flat block.
    const out = sanitizeSvg(
      wrap(
        '<defs><linearGradient id="g"><stop offset="0" stop-color="#f00"/></linearGradient></defs><path d="M0 0" fill="url(#g)"/>',
      ),
      { fill: "currentColor" },
    );
    expect(out).toContain('stop-color="#f00"');
  });

  it("adds no fill to an element that never had one", () => {
    const out = sanitizeSvg(wrap('<path d="M0 0"/>'), { fill: "currentColor" });
    expect(out).not.toContain("fill=");
  });
});

describe("parseImageSource", () => {
  it("requires the data URL at the start, not merely present", () => {
    // The old check was `value.includes("data:image/png;base64,")`.
    expect(parseImageSource("junk data:image/png;base64,AAA")).toBeNull();
  });

  it("recognises raster data URLs", () => {
    for (const type of ["png", "jpeg", "gif", "webp", "avif"]) {
      const parsed = parseImageSource(`data:image/${type};base64,AAAA`);
      expect(parsed?.kind).toBe("raster");
    }
  });

  it("decodes a base64 SVG data URL", () => {
    const svg = wrap('<path d="M0 0"/>');
    const parsed = parseImageSource(
      `data:image/svg+xml;base64,${btoa(svg)}`,
    );
    expect(parsed?.kind).toBe("svg");
    expect(parsed?.markup).toBe(svg);
  });

  it("decodes a URL-encoded SVG data URL", () => {
    const svg = wrap('<path d="M0 0"/>');
    const parsed = parseImageSource(
      `data:image/svg+xml,${encodeURIComponent(svg)}`,
    );
    expect(parsed?.markup).toBe(svg);
  });

  it("accepts raw markup", () => {
    const svg = wrap('<path d="M0 0"/>');
    expect(parseImageSource(svg)?.kind).toBe("svg");
  });

  it("survives malformed base64 instead of throwing", () => {
    // Unguarded `atob` took the whole render tree down.
    expect(() =>
      parseImageSource("data:image/svg+xml;base64,!!!not-base64!!!"),
    ).not.toThrow();
    expect(parseImageSource("data:image/svg+xml;base64,!!!not-base64!!!")).toBeNull();
  });
});
