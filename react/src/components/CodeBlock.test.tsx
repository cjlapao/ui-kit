import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import { createCodeBlockMarkdownComponents } from "../CodeBlockMarkdown";

const source = 'const text = "<script>alert(1)</script>";  \n\n';

describe("CodeBlock", () => {
  it("highlights source without interpreting markup or trimming whitespace", () => {
    const { container } = render(<CodeBlock value={source} language="typescript" showLineNumbers />);
    expect(container.querySelector("pre code")?.textContent).toBe(source);
    expect(container.querySelector(".token.keyword")).not.toBeNull();
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector(".ui-code-block-line-number")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".ui-code-block-line-number")).toHaveLength(3);
  });

  it("hides the title and divider while retaining the copy button", () => {
    const { container, rerender } = render(<CodeBlock value="text" filename="hidden.ts" showTitle={false} />);
    expect(screen.queryByText("hidden.ts")).toBeNull();
    expect(screen.getByRole("button", { name: "Copy code" })).toBeTruthy();
    const header = container.querySelector('[data-slot="code-block-header"]');
    expect(header).not.toHaveClass("border-b");
    // Hiding the visual title must not remove the code region's accessible name.
    expect(screen.getByRole("region", { name: "hidden.ts" })).toBeTruthy();
    rerender(<CodeBlock value="text" showTitle={false} showCopy={false} />);
    expect(container.querySelector('[data-slot="code-block-header"]')).toBeNull();
  });

  it("uses hover-only ScrollArea for display and editing", () => {
    const { container, rerender } = render(<CodeBlock value="long source" maxHeight={100} />);
    expect(container.querySelector('[data-slot="scrollarea"]')).toHaveAttribute("data-variant", "hover");
    expect(container.querySelector('[data-slot="scrollarea"]')).toHaveStyle({ maxHeight: "100px" });
    rerender(<CodeBlock value="long source" readOnly={false} />);
    expect(container.querySelector('[data-slot="scrollarea"]')).toHaveAttribute("data-variant", "hover");
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(container.querySelector(".ui-code-block-editor-mirror")).toHaveAttribute("aria-hidden", "true");
  });

  it("falls back to verbatim text for an unknown language", () => {
    const { container } = render(<CodeBlock value={source} language="unknown-lang" />);
    expect(container.querySelector("code")?.textContent).toBe(source);
  });

  it("edits controlled source using native textarea changes", () => {
    function Editor() {
      const [value, setValue] = useState("old");
      return <CodeBlock value={value} onChange={setValue} readOnly={false} editorLabel="Configuration" />;
    }
    render(<Editor />);
    const editor = screen.getByRole("textbox", { name: "Configuration" });
    fireEvent.change(editor, { target: { value: "new\n  " } });
    expect(editor).toHaveValue("new\n  ");
    expect(editor).toHaveAttribute("spellcheck", "false");
  });

  it("copies the exact source and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<CodeBlock value={source} showLineNumbers />);
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied"));
    expect(writeText).toHaveBeenCalledWith(source);
  });

  it("reports clipboard failure without claiming success", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    render(<CodeBlock value="text" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Could not copy code"));
    expect(screen.queryByRole("button", { name: "Copied" })).toBeNull();
  });

  it("ignores stale clipboard results after source changes", async () => {
    let resolve: () => void = () => {};
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => new Promise<void>((done) => { resolve = done; }) } });
    const { rerender } = render(<CodeBlock value="old" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    rerender(<CodeBlock value="new" />);
    resolve();
    await waitFor(() => expect(screen.getByRole("status")).toBeEmptyDOMElement());
  });

  it("adapts language and unlabeled fences while leaving inline code alone", () => {
    const { container } = render(<ReactMarkdown components={createCodeBlockMarkdownComponents({ showCopy: false })}>{'Inline `code`.\n\n```js\nconst n = 1;\n```\n\n```\nplain\n```'}</ReactMarkdown>);
    expect(container.querySelectorAll(".ui-code-block")).toHaveLength(2);
    expect(container.querySelector("p code")?.textContent).toBe("code");
    expect(container.querySelector("code.language-js")?.textContent).toBe("const n = 1;\n");
    expect(container.querySelectorAll("pre code")[1].textContent).toBe("plain\n");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
