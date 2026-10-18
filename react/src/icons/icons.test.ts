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

/**
 * The drift guard for the generated registry. The components directory is the
 * source of truth; `registry.ts` and `index.ts` are generated. Adding an icon
 * is dropping a file — forgetting to run the generator must fail HERE, loudly,
 * not silently drop the icon from `CustomIcon` at runtime.
 */
describe("registry drift", () => {
  const dir = resolve(__dirname, "components");
  const names = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => {
      const m = readFileSync(resolve(dir, f), "utf8").match(
        /export const (\w+)/,
      );
      return { name: m ? m[1] : f.replace(/\.tsx$/, ""), file: f };
    });

  it("every component file declares exactly one export const", () => {
    for (const { name, file } of names) {
      const src = readFileSync(resolve(dir, file), "utf8");
      const exports = [...src.matchAll(/export const (\w+)/g)].map((m) => m[1]);
      expect(exports, file).toHaveLength(1);
      expect(exports[0], file).toBe(name);
    }
  });

  it("registry.ts knows every component", () => {
    const registry = readFileSync(resolve(__dirname, "registry.ts"), "utf8");
    const missing = names
      .map(({ name }) => name)
      .filter((n) => !registry.includes(`  ${n}: ${n},`));
    expect(
      missing,
      `registry.ts is out of date for: ${missing.join(", ")} — run \`node scripts/generate-icon-registry.mjs\``,
    ).toEqual([]);
  });

  it("index.ts re-exports every component file", () => {
    const index = readFileSync(resolve(__dirname, "index.ts"), "utf8");
    const missing = names
      .map(({ file }) => file.replace(/\.tsx$/, ""))
      .filter((f) => !index.includes(`"./components/${f}"`));
    expect(
      missing,
      `index.ts is out of date for: ${missing.join(", ")} — run \`node scripts/generate-icons-index.mjs\``,
    ).toEqual([]);
  });
});
