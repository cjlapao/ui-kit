import React from "react";
import classNames from "classnames";
import { CodeBlock } from "./CodeBlock";

/**
 * The documentation standard every component page ends with: a Key
 * Accessibility section (Screen reader · Keyboard support · Internationalization)
 * and an API props table. Pages that predate it get these sections when their
 * standardization pass comes around — see `kit-docs/CONVENTIONS.md`.
 *
 * Content rules (they keep the sections honest, not decorative):
 * - Document what the component ACTUALLY does. Native behaviour is fine to
 *   name, invented key bindings are not.
 * - Keyboard rows only for bindings that exist in the source — Tab and Enter
 *   included only because the element is genuinely in the tab order.
 * - The i18n topic answers one question: who owns the strings the component
 *   speaks, and what breaks in RTL or other locales.
 */

const sectionHeadingClass =
  "text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500";

export const A11ySection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <section className="flex flex-col gap-5">
    <h2 className={sectionHeadingClass}>Key Accessibility</h2>
    <div className="flex flex-col gap-6">{children}</div>
  </section>
);

export const A11yTopic: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
      {title}
    </h3>
    <div className="flex flex-col gap-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
      {children}
    </div>
  </div>
);

export const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
    {children}
  </kbd>
);

export interface KeyboardBinding {
  /** Keys as spoken in the docs — rendered with <kbd> styling. */
  keys: string[];
  action: React.ReactNode;
}

export const KeyboardSupportTable: React.FC<{
  bindings: KeyboardBinding[];
}> = ({ bindings }) => (
  <div className="flex flex-col gap-3">
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
          <th className="w-40 py-2 font-semibold">Key</th>
          <th className="py-2 font-semibold">Function</th>
        </tr>
      </thead>
      <tbody>
        {bindings.map(({ keys, action }) => (
          <tr
            key={keys.join("+")}
            className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60"
          >
            <td className="py-2 align-top">
              <span className="flex flex-wrap items-center gap-1">
                {keys.map((key, index) => (
                  <React.Fragment key={key}>
                    {index > 0 && (
                      <span className="text-neutral-400 dark:text-neutral-500">
                        +
                      </span>
                    )}
                    <Kbd>{key}</Kbd>
                  </React.Fragment>
                ))}
              </span>
            </td>
            <td className="py-2 align-top leading-6 text-neutral-600 dark:text-neutral-400">
              {action}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: React.ReactNode;
}

/**
 * Prop descriptions are written as plain strings, where `&rsquo;` is just
 * nine characters — HTML entities decode only inside JSX. Most pages learned
 * that the hard way and printed `group&rsquo;s` literally, so the decoder
 * lives here, at the one place the strings are rendered.
 */
const DOC_ENTITIES: Record<string, string> = {
  rsquo: "\u2019",
  lsquo: "\u2018",
  ldquo: "\u201c",
  rdquo: "\u201d",
  mdash: "\u2014",
  ndash: "\u2013",
  hellip: "\u2026",
  rarr: "\u2192",
  larr: "\u2190",
  harr: "\u2194",
  times: "\u00d7",
  middot: "\u00b7",
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
};

const decodeDocEntities = (text: string): React.ReactNode => {
  if (!text.includes("&")) return text;
  const parts = text.split(/&(\w+);/);
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 1) {
    if (i % 2 === 1) nodes.push(DOC_ENTITIES[parts[i]] ?? `&${parts[i]};`);
    else if (parts[i]) nodes.push(parts[i]);
  }
  return nodes;
};

export const PropsTable: React.FC<{ props: PropDoc[]; title?: string }> = ({
  props,
  title,
}) => (
  <section className="flex flex-col gap-5">
    <h2 className={sectionHeadingClass}>{title ? `API — ${title}` : "API"}</h2>
    <div className="overflow-x-auto">
      <table className="w-full min-w-150 text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
            <th className="py-2 pr-4 font-semibold">Prop</th>
            <th className="py-2 pr-4 font-semibold">Type</th>
            <th className="py-2 pr-4 font-semibold">Default</th>
            <th className="py-2 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map(({ name, type, default: fallback, description }) => (
            <tr
              key={name}
              className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60"
            >
              <td className="py-2 pr-4 align-top">
                <code className="font-mono text-[13px] text-neutral-800 dark:text-neutral-200">
                  {name}
                </code>
              </td>
              <td className="py-2 pr-4 align-top">
                <code className="font-mono text-[13px] text-neutral-500 dark:text-neutral-400">
                  {type}
                </code>
              </td>
              <td className="py-2 pr-4 align-top">
                {fallback ? (
                  <code className="font-mono text-[13px] text-neutral-500 dark:text-neutral-400">
                    {fallback}
                  </code>
                ) : (
                  <span className="text-neutral-300 dark:text-neutral-600">
                    —
                  </span>
                )}
              </td>
              <td className="py-2 align-top leading-6 text-neutral-600 dark:text-neutral-400">
                {typeof description === "string"
                  ? decodeDocEntities(description)
                  : description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

/**
 * A code sample inside an a11y topic — same treatment as the example cards,
 * minus the live preview, because screen-reader wiring is read, not run.
 */
export const A11yCode: React.FC<{ code: string; filename?: string }> = ({
  code,
  filename,
}) => (
  <div className="relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
    <CodeBlock code={code} filename={filename} />
  </div>
);

/** Inline `code` inside a11y prose. */
export const C: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <code
    className={classNames(
      "rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
      className,
    )}
  >
    {children}
  </code>
);
