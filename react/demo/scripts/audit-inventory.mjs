/**
 * Regenerates the status table in `src/kit-docs/INVENTORY.md`.
 *
 *   npm --prefix react/demo run audit
 *
 * Reads the side-menu registry (`src/kit-docs/registry.ts`) — the single source
 * of truth for which pages exist — and reports, per page, how close it is to
 * the documentation standard described in `INVENTORY.md`.
 *
 * The `Done` column is hand-marked in the document, so it survives
 * regeneration: rows are matched up by slug and the mark is carried over.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEMO = path.resolve(HERE, "..");
const DOCS = path.join(DEMO, "src/kit-docs");
const DOC = path.join(DOCS, "INVENTORY.md");
const BEGIN = "<!-- BEGIN GENERATED TABLE — npm --prefix react/demo run audit -->";
const END = "<!-- END GENERATED TABLE -->";

const registry = fs.readFileSync(path.join(DOCS, "registry.ts"), "utf8");
const arrayBody = registry.slice(
  registry.indexOf("DOC_COMPONENTS: DocComponent[] = ["),
);

/** One `DOC_COMPONENTS` entry, whatever order its fields happen to be in. */
const blocks = [...arrayBody.matchAll(/\{\s*slug:\s*"([^"]+)"[\s\S]*?\n {2}\}/g)].map(
  (m) => m[0],
);

const quoted = (block, key) => {
  const m = block.match(
    new RegExp(`${key}:\\s*(?:\\n\\s*)?"((?:[^"\\\\]|\\\\.)*)"`),
  );
  return m ? m[1] : "";
};

/** `default:` on a field, and `docDefault:` if the page declared one. */
function fieldDeviations(source) {
  const ids = [...source.matchAll(/id:\s*"([^"]+)"/g)];
  let off = 0;
  return ids.map((match, index) => {
    const from = match.index;
    const to = ids[index + 1] ? ids[index + 1].index : source.length;
    const chunk = source.slice(from, to);
    const grab = (key) => {
      const m = chunk.match(new RegExp(`(?:^|[^a-zA-Z])${key}:\\s*(.+?)[,\\n]`));
      return m ? m[1].trim() : null;
    };
    off += 1;
    return { id: match[1], default: grab("default"), docDefault: grab("docDefault") };
  });
}

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");

const pages = blocks.map((block) => {
  const slug = quoted(block, "slug");
  const name = quoted(block, "name");
  const category = quoted(block, "category");
  const importPath = (block.match(/import\("([^"]+)"\)/) ?? [])[1] ?? "";
  const pageFile = path.join(DOCS, `${importPath.replace(/^\.\//, "")}.tsx`);
  const dir = path.dirname(pageFile);
  const pageSrc = read(pageFile);

  // The playground the page renders: an imported one, a conventional sibling,
  // or one drawn inline with `PlaygroundPanel`.
  const files = new Set();
  for (const m of pageSrc.matchAll(/from\s+"([^"]*[Pp]layground[^"]*)"/g)) {
    for (const ext of [".tsx", ".ts"]) {
      const candidate = path.resolve(dir, m[1] + ext);
      if (fs.existsSync(candidate)) files.add(candidate);
    }
  }
  const conventional = path.join(dir, `${path.basename(pageFile).replace(/Page\.tsx$/, "")}Playground.tsx`);
  if (fs.existsSync(conventional)) files.add(conventional);
  const siblings = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  for (const f of siblings) {
    if (/[Pp]layground\.ts$/.test(f) && !f.endsWith(".test.ts")) files.add(path.join(dir, f));
  }
  const playgroundFiles = [...files].filter((f) => f.endsWith(".tsx"));
  const configFiles = [...files].filter((f) => f.endsWith(".ts"));
  const playgroundSrc = [...files].map(read).join("\n");

  const usesEngine = /shared\/playground|<Playground\b/.test(pageSrc + playgroundSrc);
  const playground = !playgroundFiles.length
    ? /PlaygroundPanel/.test(pageSrc)
      ? "inline"
      : "none"
    : usesEngine
      ? "engine"
      : /PlaygroundPanel/.test(playgroundSrc)
        ? "panel"
        : "other";

  const titles = [...pageSrc.matchAll(/title="([^"]+)"/g)].map((m) => m[1].toLowerCase());
  const hasTopic = (needle) => titles.some((t) => t.includes(needle));
  const examplesDir = path.join(dir, "examples");
  const deviations = playground === "engine" ? fieldDeviations(playgroundSrc) : [];

  return {
    slug,
    name,
    category,
    page: path.relative(DOCS, pageFile),
    dir: path.relative(DOCS, dir),
    playground,
    playgroundFiles: [...files].map((f) => path.basename(f)),
    fields: (playgroundSrc.match(/kind:\s*"/g) ?? []).length,
    deviations: deviations.filter(
      (f) => f.default !== null && f.docDefault !== null && f.default !== f.docDefault,
    ),
    api: pageSrc.includes("PropsTable"),
    screenReader: hasTopic("screen reader"),
    keyboard: hasTopic("keyboard"),
    i18n: hasTopic("internationalization"),
    examples: fs.existsSync(examplesDir)
      ? fs.readdirSync(examplesDir).filter((f) => f.endsWith(".tsx")).length
      : 0,
    tests: siblings.filter((f) => /\.test\.tsx?$/.test(f)),
  };
});

/* The hand-marked column, carried over from the document being rewritten. */
const done = new Map();
if (fs.existsSync(DOC)) {
  for (const m of read(DOC).matchAll(/^\|\s*(✅|☐)\s*\|\s*\[[^\]]+\]\([^)]+\)\s*\|\s*`([a-z0-9-]+)`/gm)) {
    if (m[1] === "✅") done.set(m[2], true);
  }
}

const MARK = {
  engine: "🟢 engine",
  panel: "🟡 panel",
  inline: "🟠 inline",
  none: "🔴 none",
  other: "❓ other",
};
const tick = (value) => (value ? "✅" : "⬜");

const CATS = ["Layout", "Basics", "Forms", "Data", "Charts", "Feedback", "Overlays", "Utilities"];
const lines = [];
let completed = 0;
for (const category of CATS) {
  const list = pages.filter((p) => p.category === category);
  if (!list.length) continue;
  const finished = list.filter((p) => done.has(p.slug)).length;
  completed += finished;
  lines.push("", `### ${category} — ${finished}/${list.length} done`, "");
  lines.push("|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |");
  lines.push("|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|");
  for (const p of list) {
    const schema =
      p.playground === "engine"
        ? `${p.fields} fields${p.deviations.length ? ` · ⚠ ${p.deviations.length} default` : ""}`
        : "—";
    lines.push(
      `| ${done.has(p.slug) ? "✅" : "☐"} | [${p.name}](${p.page.replace("components/", "")}) | \`${p.slug}\` | ${MARK[p.playground]} | ${schema} | ${tick(p.api)} | ${tick(p.screenReader)} | ${tick(p.keyboard)} | ${tick(p.i18n)} | ${p.examples} | ${p.tests.length ? p.tests.map((t) => `\`${t}\``).join(" ") : "—"} |`,
    );
  }
}

const count = (f) => pages.filter(f).length;
const summary = [
  `- **${pages.length} pages** in the side menu, **${completed} fully done** — run \`npm --prefix react/demo run audit\` after every conversion to refresh this table.`,
  `- Playground: ${count((p) => p.playground === "engine")} on the engine · ${count((p) => p.playground === "panel")} legacy \`PlaygroundPanel\` · ${count((p) => p.playground === "inline")} inline · ${count((p) => p.playground === "none")} without one.`,
  `- Standard sections: API ${count((p) => p.api)} · Screen reader ${count((p) => p.screenReader)} · Keyboard ${count((p) => p.keyboard)} · i18n ${count((p) => p.i18n)}.`,
  `- Tests: ${count((p) => p.tests.length)} pages have one · examples missing on ${count((p) => !p.examples)} pages.`,
].join("\n");

const body = `${BEGIN}\n${summary}\n${lines.join("\n")}\n${END}`;

if (!fs.existsSync(DOC)) {
  console.error(`No INVENTORY.md at ${DOC} — write the guide first.`);
  process.exit(1);
}
const current = fs.readFileSync(DOC, "utf8");
const start = current.indexOf(BEGIN);
const end = current.indexOf(END);
if (start === -1 || end === -1) {
  console.error(`INVENTORY.md is missing its generated markers.`);
  process.exit(1);
}
fs.writeFileSync(DOC, `${current.slice(0, start)}${body}${current.slice(end + END.length)}`);
console.log(`Rewrote ${path.relative(process.cwd(), DOC)} — ${pages.length} pages, ${completed} done.`);
