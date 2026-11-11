import type { SurfaceTone } from "../theme/Theme";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { refractor } from "refractor";
import tsx from "refractor/tsx";

refractor.register(tsx);
import Panel from "./Panel";
import IconButton from "./IconButton";
import ScrollArea from "./ScrollArea";
import { useKitT } from "../i18n";
import type { SurfaceCorner, SurfaceVariant, TrueColor } from "../theme/Theme";

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "color" | "children"> {
  /** Source is displayed and copied verbatim. */
  value: string;
  onChange?: (value: string) => void;
  /** Set false to show a native, controlled textarea. @default true */
  readOnly?: boolean;
  language?: string;
  filename?: string;
  /** Hide the header label and divider while keeping the copy action. @default true */
  showTitle?: boolean;
  /** @default true */
  showCopy?: boolean;
  /** Decorative line numbers in display mode. @default false */
  showLineNumbers?: boolean;
  /** @default false */
  wrapLines?: boolean;
  maxHeight?: number | string;
  color?: TrueColor;
  /** Container tint; omitted means no tint. @default "none" */
  tone?: SurfaceTone;
  variant?: SurfaceVariant;
  corner?: SurfaceCorner;
  editorLabel?: string;
}

type SyntaxNode = ReturnType<typeof refractor.highlight>["children"][number];
type TokenRun = { text: string; className: string };

function tokenRuns(nodes: SyntaxNode[], inherited = ""): TokenRun[] {
  return nodes.flatMap((node): TokenRun[] => {
    if (node.type === "text") return [{ text: node.value, className: inherited }];
    if (node.type !== "element") return [];
    const classes = node.properties.className;
    const className = [inherited, Array.isArray(classes) ? classes.join(" ") : String(classes ?? "")].filter(Boolean).join(" ");
    return tokenRuns(node.children, className);
  });
}

function renderLines(runs: TokenRun[], numbered: boolean, value: string): React.ReactNode {
  const lines: React.ReactNode[][] = [[]];
  let key = 0;
  for (const run of runs) {
    run.text.split("\n").forEach((text, index) => {
      if (index) lines.push([]);
      if (text) lines[lines.length - 1].push(<span key={key++} className={run.className || undefined}>{text}</span>);
    });
  }
  const digits = String(value.split("\n").length).length;
  return lines.map((line, index) => <React.Fragment key={index}>
    {index > 0 ? "\n" : null}
    <span className="ui-code-block-line">
      {numbered && <span className="ui-code-block-line-number" aria-hidden="true" data-line={index + 1} style={{ width: `${digits}ch` }} />}
      <span className="ui-code-block-line-text">{line}</span>
    </span>
  </React.Fragment>);
}

/** Lightweight source display with optional native editing. */
export default function CodeBlock({
  value, onChange, readOnly = true, language, filename,
  showTitle = true, showCopy = true, showLineNumbers = false, wrapLines = false,
  maxHeight, tone = "none", color = "blue", variant = "subtle", corner = "rounded-md",
  editorLabel, className, ...rest
}: CodeBlockProps) {
  const t = useKitT();
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const generation = useRef(0);
  useEffect(() => {
    generation.current++;
    setCopyState("idle");
    clearTimeout(timer.current);
    return () => { generation.current++; clearTimeout(timer.current); };
  }, [value]);
  const highlighted = useMemo(() => {
    if (!readOnly || !language) return [{ text: value, className: "" }];
    try {
      return tokenRuns(refractor.highlight(value, language.toLowerCase()).children);
    } catch {
      return [{ text: value, className: "" }];
    }
  }, [value, language, readOnly]);
  const copy = async () => {
    const current = ++generation.current;
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      if (current !== generation.current) return;
      setCopyState("success");
    } catch {
      if (current !== generation.current) return;
      setCopyState("error");
    }
    timer.current = setTimeout(() => setCopyState("idle"), 2000);
  };
  const copyLabel = t(copyState === "success" ? "kit.codeBlock.copied" : "kit.codeBlock.copy");
  return (
    <div {...rest} className={["ui-code-block relative w-full min-w-0", className].filter(Boolean).join(" ")}>
      <Panel className="ui-code-block-surface" tone={tone} variant={variant} corner={corner} padding="none" bodyClassName="min-w-0 overflow-hidden">
        {(showTitle || showCopy) && (
          <div data-slot="code-block-header" className={`relative flex min-w-0 items-center gap-3 px-4 py-2 ${showTitle ? "justify-between border-b border-current/10" : "justify-end"}`}>
            {showTitle && <span className="truncate font-mono text-xs">{filename || language || t("kit.codeBlock.code")}</span>}
            {showCopy && <IconButton icon={copyState === "success" ? "Check" : "CopyClipboard"} color={color} variant="ghost" size="xs" srLabel={copyLabel} tooltip={copyLabel} onClick={copy} />}
          </div>
        )}
        <ScrollArea
          variant="hover"
          className="ui-code-block-scroll"
          data-wrap={wrapLines || undefined}
          style={{ maxHeight }}
          tabIndex={readOnly ? 0 : -1}
          role="region"
          aria-label={filename || t("kit.codeBlock.code")}
        >
          {readOnly ? (
            <pre className="ui-code-block-source" style={{ whiteSpace: wrapLines ? "pre-wrap" : "pre", overflowWrap: wrapLines ? "anywhere" : undefined }}><code className={language ? `language-${language}` : undefined}>{renderLines(highlighted, showLineNumbers, value)}</code></pre>
          ) : (
            <div className="ui-code-block-editor-layout" data-wrap={wrapLines || undefined}>
              {/* The mirror sizes the native editor so ScrollArea owns both scroll axes. */}
              <pre aria-hidden="true" className="ui-code-block-editor-mirror" style={{ whiteSpace: wrapLines ? "pre-wrap" : "pre", overflowWrap: wrapLines ? "anywhere" : undefined }}>{value + "\n"}</pre>
              <textarea className="ui-code-block-editor" aria-label={editorLabel || t("kit.codeBlock.edit")} value={value} onChange={(event) => onChange?.(event.target.value)} spellCheck={false} autoCapitalize="off" autoCorrect="off" wrap={wrapLines ? "soft" : "off"} />
            </div>
          )}
        </ScrollArea>
        <span className="sr-only" role="status">{copyState === "success" ? t("kit.codeBlock.copied") : copyState === "error" ? t("kit.codeBlock.copyFailed") : ""}</span>
        {copyState === "error" && <p className="px-4 pb-2 text-xs">{t("kit.codeBlock.copyFailed")}</p>}
      </Panel>
    </div>
  );
}
