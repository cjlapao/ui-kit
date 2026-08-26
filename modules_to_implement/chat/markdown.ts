// Dependency-free, XSS-safe markdown renderer scoped to common chat content:
// fenced code (syntax-highlighted), GFM tables, headings, unordered lists, links,
// and inline code/bold/italic.
// User text is HTML-escaped BEFORE any markup is introduced, so the only HTML in
// the output comes from our own tags or highlight.js tokens (which also escape).

import hljs from "highlight.js/lib/common";

// Runtime NUL-prefixed sentinels: impossible in real content, but kept out of the
// source as control bytes. BLOCK marks extracted code blocks; ESC_PIPE protects an
// escaped pipe ("\|") inside a table cell from being treated as a column break.
const BLOCK = `${String.fromCharCode(0)}CB`;
const ESC_PIPE = `${String.fromCharCode(0)}P`;

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^https?:\/\/[^\s"'<>]+$/i.test(h)) return h;
  if (/^#[^\s"'<>]*$/.test(h)) return h;
  return null;
}

function inline(text: string): string {
  let out = text;
  out = out.replace(/`([^`]+)`/g, (_m, c: string) => `<code>${c}</code>`);
  out = out.replace(/\*\*([^*\n]+)\*\*/g, (_m, c: string) => `<strong>${c}</strong>`);
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, (_m, p: string, c: string) => `${p}<em>${c}</em>`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t: string, h: string) => {
    const href = safeHref(h);
    if (!href) return t;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  });
  return out;
}

/** Highlight a code block; falls back to plain escaping for unknown languages. */
function highlightCode(code: string, lang: string): string {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    } catch {
      /* fall through to escaping */
    }
  }
  return escapeHtml(code);
}

// --- GFM pipe tables ---

type Align = "left" | "center" | "right";

function splitRow(row: string): string[] {
  let r = row.trim();
  if (r.startsWith("|")) r = r.slice(1);
  if (r.endsWith("|")) r = r.slice(0, -1);
  r = r.replace(/\\\|/g, ESC_PIPE);
  return r
    .split("|")
    .map((c) => c.replace(ESC_PIPE, "|").trim());
}

function isDelimRow(row: string): boolean {
  const cells = splitRow(row);
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c.replace(/\s/g, "")));
}

function parseAlign(row: string): (Align | null)[] {
  return splitRow(row).map((c) => {
    const s = c.replace(/\s/g, "");
    const left = s.startsWith(":");
    const right = s.endsWith(":");
    if (left && right) return "center";
    if (right) return "right";
    if (left) return "left";
    return null;
  });
}

function renderTable(header: string[], align: (Align | null)[], body: string[][]): string {
  const style = (a: Align | null | undefined): string => (a ? ` class="ta-${a}"` : "");
  const head = `<tr>${header
    .map((h, i) => `<th${style(align[i])}>${inline(escapeHtml(h))}</th>`)
    .join("")}</tr>`;
  const rows = body
    .map(
      (row) =>
        `<tr>${header
          .map((_h, i) => `<td${style(align[i])}>${inline(escapeHtml(row[i] ?? ""))}</td>`)
          .join("")}</tr>`,
    )
    .join("");
  return `<div class="md-table-wrap"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
}

export function renderMarkdown(src: string): string {
  if (!src) return "";

  const blocks: { lang: string; code: string }[] = [];
  const stripped = src.replace(
    /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g,
    (_m, lang: string, code: string) => {
      const i = blocks.length;
      blocks.push({ lang, code });
      return `${BLOCK}${i}${BLOCK}`;
    },
  );

  const lines = stripped.split("\n");
  let html = "";
  let inList = false;
  const closeList = (): void => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.includes(BLOCK)) {
      closeList();
      html += line.trim();
      i++;
      continue;
    }
    // GFM table: a pipe row immediately followed by a delimiter row.
    if (line.includes("|") && i + 1 < lines.length && isDelimRow(lines[i + 1]!)) {
      closeList();
      const header = splitRow(line);
      const align = parseAlign(lines[i + 1]!);
      i += 2;
      const body: string[][] = [];
      while (i < lines.length && lines[i]!.includes("|")) {
        body.push(splitRow(lines[i]!));
        i++;
      }
      html += renderTable(header, align, body);
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html += `<h${level}>${inline(escapeHtml(heading[2]))}</h${level}>`;
      i++;
      continue;
    }
    // Horizontal rule: three or more dashes, asterisks, or underscores on a line by themselves.
    // Must come before the list check so `---` doesn't get parsed as a list item.
    if (/^\s*[-*_]{3,}\s*$/.test(line)) {
      closeList();
      html += `<hr class="my-4 border-white/10">`;
      i++;
      continue;
    }
    const li = /^\s*[-*]\s+(.*)$/.exec(line);
    if (li) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(escapeHtml(li[1]))}</li>`;
      i++;
      continue;
    }
    if (line.trim() === "") {
      closeList();
      i++;
      continue;
    }
    closeList();
    html += `<p>${inline(escapeHtml(line))}</p>`;
    i++;
  }
  closeList();

  return html.replace(
    new RegExp(`${BLOCK}(\\d+)${BLOCK}`, "g"),
    (_m, n: string) => {
      const b = blocks[Number(n)];
      if (!b) return "";
      const code = b.code.replace(/\n+$/, "");
      const lang = b.lang ? ` class="language-${b.lang}"` : "";
      const highlighted = highlightCode(code, b.lang);
      return `<pre class="md-code"><code${lang}>${highlighted}</code></pre>`;
    },
  );
}
