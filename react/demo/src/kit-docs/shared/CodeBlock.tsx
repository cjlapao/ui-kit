import React, { useMemo, useState } from "react";
import { refractor } from "refractor/core";
import { toHtml } from "hast-util-to-html";
import tsx from "refractor/tsx";
import bash from "refractor/bash";
import { IconButton } from "@cjlapao/ui-kit";
import "./codeblock.css";

// `tsx` pulls in its own `jsx` + `typescript` dependencies on register.
refractor.register(tsx);
refractor.register(bash);

export type CodeBlockLanguage = "tsx" | "bash";

interface CodeBlockProps {
  /** Source to display, verbatim. */
  code: string;
  /** @default "tsx" */
  language?: CodeBlockLanguage;
  /** Shown in the header bar; falls back to the language name. */
  filename?: string;
}

const trimTrailingNewlines = (code: string): string => code.replace(/\s+$/, "");

const highlight = (code: string, language: CodeBlockLanguage): string | null => {
  try {
    return toHtml(refractor.highlight(code, language));
  } catch {
    // Unknown language or unregistered grammar — degrade to plain text.
    return null;
  }
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "tsx",
  filename,
}) => {
  const [copied, setCopied] = useState(false);
  const normalized = useMemo(() => trimTrailingNewlines(code), [code]);
  const html = useMemo(() => highlight(normalized, language), [normalized, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(normalized);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = normalized;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-neutral-200/70 bg-neutral-50 px-4 py-1.5 dark:border-neutral-800 dark:bg-neutral-900">
        <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          {filename ?? language}
        </span>
        <IconButton
          icon={copied ? "Check" : "CopyClipboard"}
          size="xs"
          variant="ghost"
          color="blue"
          srLabel={copied ? "Copied" : "Copy code"}
          tooltip={copied ? "Copied" : "Copy code"}
          onClick={handleCopy}
        />
      </div>
      <pre className="kit-codeblock overflow-x-auto p-4">
        {html ? (
          <code dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code>{normalized}</code>
        )}
      </pre>
    </div>
  );
};

export const CodeLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span className="font-mono text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
    {children}
  </span>
);
