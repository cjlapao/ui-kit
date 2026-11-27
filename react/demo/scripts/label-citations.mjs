/**
 * Shared definition of the one piece of playground prose a reader should never
 * see: a **source citation inside a control label**.
 *
 * `label:` is the text the controls column prints — and, for a toggle, the
 * `aria-label` of the switch itself. `(:44,:139)` is scaffolding for whoever
 * audits the page against `react/src`; it belongs in the PropsTable rows, the
 * hint and the a11y topics, where the reader is already being pointed at source,
 * not in the label of a knob they are trying to use.
 *
 * The test is deliberately narrow: a parenthesised run whose every comma-separated
 * piece is a line reference. `(best 3)`, `(100%)` and `(200 px)` are content and
 * stay; `(:44,:139)`, `(Button.tsx:166,:305)` and `(Menu:191-192,:498)` are
 * scaffolding and go.
 */

/** One parenthesised group, innermost, no nesting. */
const GROUP = /\(([^()]*)\)/g;

/** `:44` · `44-56` · `Button.tsx:166` · `Menu:191-192` · `~44` */
const LINE_REF =
  /^(?:(?:[A-Za-z0-9_.-]+\.tsx?:|[A-Za-z][A-Za-z0-9]*:)?\s*:?\d+(?:\s*-\s*\d+)?|~\d+)$/u;

/** True when the whole group is nothing but line references. */
const looksLikeLines = (inner) => {
  const body = inner.trim();
  if (body === "") return false;
  return body
    .split(",")
    .every((piece) => LINE_REF.test(piece.trim()) || /^\d+\s*-\s*\d+$/u.test(piece.trim()));
};

/** True when `text` carries at least one source citation. */
export const hasCitation = (text) =>
  [...String(text).matchAll(GROUP)].some((match) => looksLikeLines(match[1]));

/** `text` with every citation group removed and the dangling punctuation tidied. */
export const stripCitations = (text) => {
  const stripped = String(text).replace(GROUP, (group, inner) =>
    looksLikeLines(inner) ? " " : group,
  );
  if (stripped === String(text)) return stripped;
  return stripped
    .replace(/\(\s*\)/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([—–·:,])\s*$/u, "")
    .replace(/\s*[-—–·:,]\s*$/u, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
};
