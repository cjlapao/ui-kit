import { describe, it, expect } from "vitest";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("escapes raw HTML in text", () => {
    expect(renderMarkdown("<script>alert(1)</script>")).not.toContain("<script>");
    expect(renderMarkdown("<script>alert(1)</script>")).toContain("&lt;script&gt;");
  });

  it("renders a code block with the raw content escaped", () => {
    const out = renderMarkdown("```\nconst a = 1 < 2;\n```");
    expect(out).toContain("<pre class=\"md-code\">");
    expect(out).toContain("const a = 1 &lt; 2;");
    expect(out).not.toContain("<1");
  });

  it("supports code fences with a language tag", () => {
    const out = renderMarkdown("```js\nx\n```");
    expect(out).toContain('class="language-js"');
  });

  it("renders headings", () => {
    expect(renderMarkdown("# Title")).toBe("<h1>Title</h1>");
    expect(renderMarkdown("## Sub")).toBe("<h2>Sub</h2>");
  });

  it("renders lists", () => {
    const out = renderMarkdown("- one\n- two");
    expect(out).toBe("<ul><li>one</li><li>two</li></ul>");
  });

  it("renders horizontal rules as <hr>", () => {
    const out = renderMarkdown("before\n\n---\n\nafter");
    expect(out).toContain("<hr");
    expect(out).not.toContain("---");
    expect(out).toContain("before");
    expect(out).toContain("after");
  });

  it("accepts dashes, asterisks, and underscores for horizontal rules", () => {
    expect(renderMarkdown("a\n\n***\n\nb")).toContain("<hr");
    expect(renderMarkdown("a\n\n___\n\nb")).toContain("<hr");
    expect(renderMarkdown("a\n\n--------\n\nb")).toContain("<hr");
  });

  it("allows leading/trailing whitespace on a horizontal rule line", () => {
    expect(renderMarkdown("a\n\n   ---   \n\nb")).toContain("<hr");
  });

  it("does not treat a short dash as a horizontal rule", () => {
    expect(renderMarkdown("- item")).not.toContain("<hr");
    expect(renderMarkdown("-- item")).not.toContain("<hr");
  });

  it("treats dashes followed by content as a horizontal rule, not a list", () => {
    const out = renderMarkdown("one\n\n---\n\ntwo");
    expect(out).toContain("<hr");
    expect(out).not.toContain("<li>");
  });

  it("renders bold and inline code", () => {
    expect(renderMarkdown("**bold**")).toContain("<strong>bold</strong>");
    expect(renderMarkdown("`code`")).toContain("<code>code</code>");
  });

  it("allows http(s) links and rejects javascript: URLs", () => {
    const ok = renderMarkdown("[t](https://example.com)");
    expect(ok).toContain('<a href="https://example.com"');
    const bad = renderMarkdown("[t](javascript:alert(1))");
    expect(bad).not.toContain("<a");
    expect(bad).toContain("t");
  });

  it("renders GFM pipe tables", () => {
    const out = renderMarkdown("| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |");
    expect(out).toContain("<table>");
    expect(out).toContain("<thead><tr><th>A</th><th>B</th></tr></thead>");
    expect(out).toContain("<td>1</td>");
    expect(out).toContain("<td>4</td>");
  });

  it("escapes HTML inside table cells", () => {
    const out = renderMarkdown("| x |\n|---|\n| <b>bold</b> |");
    expect(out).toContain("<td>&lt;b&gt;bold&lt;/b&gt;</td>");
    expect(out).not.toContain("<td><b>");
  });

  it("supports table alignment and escaped pipes in cells", () => {
    const out = renderMarkdown("| h |\n|:-:|\n| a\\|b |");
    expect(out).toContain('class="ta-center"');
    expect(out).toContain("a|b</td>");
  });

  it("highlights fenced code for known languages", () => {
    const out = renderMarkdown("```js\nconst x = 1;\n```");
    expect(out).toContain('class="language-js"');
    // highlight.js wraps tokens in .hljs-* spans (e.g. keyword "const").
    expect(out).toMatch(/class="hljs-/);
    expect(out).toContain("const");
    expect(out).not.toContain("<const");
  });
});
