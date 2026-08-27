import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * SVG attributes that are kebab-case in raw SVG markup and camelCase in JSX.
 *
 * These icons are pasted from exported SVG, so the kebab spellings come along
 * for the ride. React does not translate them: it logs
 * `Invalid DOM property "clip-rule". Did you mean "clipRule"?` and **drops the
 * attribute**, so the icon renders subtly wrong (a fill rule silently ignored
 * turns a donut into a disc) while looking fine at a glance.
 *
 * Nine icon components shipped with this — found only when a demo page finally
 * rendered one of them.
 */
const KEBAB_TO_CAMEL: Record<string, string> = {
  "clip-rule": "clipRule",
  "fill-rule": "fillRule",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "clip-path": "clipPath",
  "fill-opacity": "fillOpacity",
  "stroke-opacity": "strokeOpacity",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-miterlimit": "strokeMiterlimit",
  "text-anchor": "textAnchor",
  "dominant-baseline": "dominantBaseline",
  "paint-order": "paintOrder",
  "vector-effect": "vectorEffect",
};

const ICON_DIR = resolve(process.cwd(), "src/icons/components");

const iconFiles = readdirSync(ICON_DIR).filter((f) => f.endsWith(".tsx"));

describe("icon components", () => {
  it("finds icon files to check", () => {
    expect(iconFiles.length).toBeGreaterThan(50);
  });

  it("use JSX attribute names, not raw SVG kebab-case", () => {
    const offenders: string[] = [];
    for (const file of iconFiles) {
      const source = readFileSync(resolve(ICON_DIR, file), "utf8");
      for (const [kebab, camel] of Object.entries(KEBAB_TO_CAMEL)) {
        // Only JSX attribute positions: `name=` preceded by whitespace. This
        // deliberately does not match the same text inside a `d="…"` path.
        if (new RegExp(`\\s${kebab}=`).test(source)) {
          offenders.push(`${file}: ${kebab} → ${camel}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("use className, not class", () => {
    const offenders = iconFiles.filter((file) =>
      /\sclass=/.test(readFileSync(resolve(ICON_DIR, file), "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
