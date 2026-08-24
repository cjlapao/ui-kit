import React from "react";
import { Panel } from "@cjlapao/ui-kit";
import { CodeBlock } from "./CodeBlock";

interface ExampleCardProps {
  title: string;
  description?: string;
  /** The generating source, shown verbatim beneath the live preview. */
  code: string;
  /** File name shown in the code header. Defaults to "<Title>.tsx". */
  filename?: string;
  /** The live, working preview. */
  children: React.ReactNode;
  /** Extra classes for the preview stage (e.g. a backdrop for glass demos). */
  previewClassName?: string;
}

/**
 * One docs example: a live demo on top, the code that generates it below.
 * The code is the example file's own source (imported with Vite's `?raw`),
 * so what you see and what you copy can never drift apart.
 */
export const ExampleCard: React.FC<ExampleCardProps> = ({
  title,
  description,
  code,
  filename,
  children,
  previewClassName = "",
}) => (
  <Panel variant="outlined" padding="none" scrollable={false}>
    <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
    <div
      className={`flex flex-wrap items-center justify-center gap-4 border-b border-neutral-100 px-5 py-6 dark:border-neutral-800 ${previewClassName}`}
    >
      {children}
    </div>
    <CodeBlock code={code} filename={filename} />
  </Panel>
);
