import React from "react";
import { Pill } from "@cjlapao/ui-kit";

/**
 * The two things the Button playground mounts that are not props: the row the
 * buttons sit in, and the rich label that turns `children` from a string into
 * JSX. Both are built here so the preview and the printed snippet can never
 * drift apart — the code view prints this very node through `h.jsx`.
 */

/** The preview column's own layout: a stack, so `fullWidth` has something to fill. */
export const STAGE_CLASS = "flex w-full max-w-xl flex-col items-start gap-3";

/** The badge's text. Count-like, because that is what a badge is for. */
export const COUNT_TEXT = "3 queued";

/**
 * A `children` that is not a string: text plus a kit component. Worth hoisting
 * into a `const` in the snippet, and worth switching on in the preview, because
 * the sr-only fallback only reads a *string* child (:268-273).
 */
export const richLabelNode = (label: string): React.ReactNode => (
  <>
    {label} <Pill size="sm" tone="emerald" variant="soft">{COUNT_TEXT}</Pill>
  </>
);

/** What `h.jsx` may print verbatim: the printed name mapped to the component behind it. */
export const SLOT_NAMES: Record<string, unknown> = { Pill };
