/**
 * Dependency-free, XSS-safe markdown for chat content: fenced code, GFM
 * tables, headings, lists, rules, links, inline code/bold/italic. User
 * text is HTML-escaped before any markup exists, so the only HTML in the
 * output is ours. Classes are literal Tailwind — the renderer styles its
 * own output, and both kits get it identically.
 */

const SENTINEL = `${String.fromCharCode(0)}CB`;

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const safeHref = (href: string): string | null => {
  const h = href.trim();
  if (/^https?:\/\/[^\s"'<>]+$/i.test(h)) return h;
  if (/^#[^\s"'<>]*$/.test(h)) return h;
  return null;
};

const inline = (text: string): string =>
  text
    .replace(/`([^`]+)`/g, (_m, c: string) => `<code class="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.85em] dark:bg-white/10">${c}</code>`)
    .replace(/\*\*([^*\n]+)\*\*/g, (_m, c: string) => `<strong>${c}</strong>`)
    .replace(/(^|[^*])\*([^*\n]+)\*/g, (_m, p: string, c: string) => `${p}<em>${c}</em>`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t: string, h: string) => {
      const href = safeHref(h);
      if (!href) return t;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline underline-offset-2 dark:text-blue-400">${t}</a>`;
    });

type Align = "left" | "center" | "right";

const ESC_PIPE = `${String.fromCharCode(0)}P`;

const splitRow = (row: string): string[] => {
  let r = row.trim();
  if (r.startsWith("|")) r = r.slice(1);
  if (r.endsWith("|")) r = r.slice(0, -1);
  r = r.replace(/\\\|/g, ESC_PIPE);
  return r.split("|").map((c) => c.replace(ESC_PIPE, "|").trim());
};

const isDelimRow = (row: string): boolean => {
  const cells = splitRow(row);
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c.replace(/\s/g, "")));
};

const parseAlign = (row: string): (Align | null)[] =>
  splitRow(row).map((c) => {
    const s = c.replace(/\s/g, "");
    const left = s.startsWith(":");
    const right = s.endsWith(":");
    if (left && right) return "center";
    if (right) return "right";
    if (left) return "left";
    return null;
  });

const ALIGN_CLASS = { left: "text-left", center: "text-center", right: "text-right" } as const;

const cell = (content: string, align: Align | null | undefined, tag: "th" | "td"): string => {
  const cls = align ? ` class="${ALIGN_CLASS[align]} px-2 py-1"` : ' class="px-2 py-1"';
  return `<${tag}${cls}>${inline(escapeHtml(content))}</${tag}>`;
};

export function renderChatMarkdown(src: string): string {
  if (!src) return "";

  const blocks: { lang: string; code: string }[] = [];
  const stripped = src.replace(
    /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g,
    (_m, lang: string, code: string) => {
      const i = blocks.length;
      blocks.push({ lang, code });
      return `${SENTINEL}${i}${SENTINEL}`;
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
    if (line.includes(SENTINEL)) {
      closeList();
      html += line.trim();
      i++;
      continue;
    }
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
      const head = `<tr>${header.map((h, c) => cell(h, align[c], "th")).join("")}</tr>`;
      const rows = body
        .map((row) => `<tr>${header.map((_h, c) => cell(row[c] ?? "", align[c], "td")).join("")}</tr>`)
        .join("");
      html += `<div class="my-2 overflow-x-auto"><table class="w-full border-collapse text-xs"><thead class="border-b border-neutral-200 dark:border-neutral-700">${head}</thead><tbody>${rows}</tbody></table></div>`;
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      closeList();
      html += `<h${heading[1].length} class="mb-1 mt-2 font-semibold">${inline(escapeHtml(heading[2]))}</h${heading[1].length}>`;
      i++;
      continue;
    }
    if (/^\s*[-*_]{3,}\s*$/.test(line)) {
      closeList();
      html += `<hr class="my-3 border-neutral-200 dark:border-neutral-700">`;
      i++;
      continue;
    }
    const li = /^\s*[-*]\s+(.*)$/.exec(line);
    if (li) {
      if (!inList) {
        html += '<ul class="my-1 list-disc space-y-0.5 pl-5">';
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
    html += `<p class="my-1">${inline(escapeHtml(line))}</p>`;
    i++;
  }
  closeList();

  return html.replace(
    new RegExp(`${SENTINEL}(\\d+)${SENTINEL}`, "g"),
    (_m, n: string) => {
      const b = blocks[Number(n)];
      if (!b) return "";
      const code = b.code.replace(/\n+$/, "");
      const lang = b.lang ? ` data-lang="${escapeHtml(b.lang)}"` : "";
      return `<pre class="my-2 overflow-x-auto rounded-lg bg-neutral-100 p-3 text-[12px] leading-5 dark:bg-neutral-800"${lang}><code class="font-mono">${escapeHtml(code)}</code></pre>`;
    },
  );
}
