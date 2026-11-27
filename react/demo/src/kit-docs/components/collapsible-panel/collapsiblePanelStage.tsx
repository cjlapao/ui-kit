import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Fixtures and predicates for the Collapsible Panel playground.
 *
 * The one rule worth stating: the markup the preview paints and the markup the
 * Code view prints are generated from the same arrays below, so a reader who
 * copies the snippet gets the card they were looking at. Hand-writing the two
 * is how a docs page ends up printing a list it never rendered.
 */

export const TITLE_TEXT = "Deployment logs";
export const HEADER_LABEL = "Deployment logs";
export const SUBTITLE_TEXT = "Last updated 5 minutes ago";

/**
 * The same title as a node, which is the only situation `headerLabel` exists
 * for (:38-39): the header's accessible name is its content, and this content
 * is a status glyph and an environment tag as much as it is a name.
 */
export const RICH_TITLE_JSX =
  `<span className="inline-flex items-center gap-2">` +
  `<span aria-hidden="true">●</span>${TITLE_TEXT} ` +
  `<span className="text-[10px] uppercase tracking-wide text-neutral-400">prod</span>` +
  `</span>`;

/** The preview's half of `RICH_TITLE_JSX` — change one, change the other. */
export const RichTitle = () => (
  <span className="inline-flex items-center gap-2">
    <span aria-hidden="true">●</span>
    {TITLE_TEXT}{" "}
    <span className="text-[10px] uppercase tracking-wide text-neutral-400">
      prod
    </span>
  </span>
);

export const SHORT_BODY_TEXT =
  "Showing the latest deployment output. Errors and status logs appear here while we run automated checks against the new release.";

/** Twelve deterministic log lines — no `Math.random()` in a playground. */
export const LOG_LINES = Array.from(
  { length: 12 },
  (_, index) =>
    `[12:0${index % 10}:31] step ${index + 1} — pulling layer sha256:${(
      index * 7919
    )
      .toString(16)
      .padStart(6, "0")}`,
);

export const shortBodyJsx = (): string => `<p>${SHORT_BODY_TEXT}</p>`;

/** Printed form of the long content, generated from `LOG_LINES`. */
export const longBodyJsx = (): string =>
  [
    "<>",
    `  <p>${SHORT_BODY_TEXT}</p>`,
    '  <ul className="mt-2 space-y-1 font-mono text-xs text-neutral-500">',
    ...LOG_LINES.map((line) => `    <li>${line}</li>`),
    "  </ul>",
    "</>",
  ].join("\n");

/** The same content as elements, for the preview. */
export const ShortBody = () => <p>{SHORT_BODY_TEXT}</p>;

export const LongBody = () => (
  <>
    <p>{SHORT_BODY_TEXT}</p>
    <ul className="mt-2 space-y-1 font-mono text-xs text-neutral-500">
      {LOG_LINES.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  </>
);

export const ACTIONS_JSX = `<Button size="xs" variant="ghost">Refresh</Button>`;

const GLASS_VARIANTS = ["glass", "liquid-glass", "default"];

/** The three variants Panel draws a specular layer on (Panel.tsx:391,1431). */
export const isGlass = (state: PlaygroundState): boolean =>
  GLASS_VARIANTS.includes(String(state.variant ?? "elevated"));

/** The one variant that reads `vibrancy` and `glassOpacity` (:1011-1012). */
export const isLiquid = (state: PlaygroundState): boolean =>
  String(state.variant ?? "elevated") === "liquid-glass";

/** `typeof expanded === "boolean"` is the whole control test (:267). */
export const isControlled = (state: PlaygroundState): boolean =>
  (state.mode ?? "uncontrolled") === "controlled";

/** Whether the card is open, whichever mode is expressing it. */
export const isOpen = (state: PlaygroundState): boolean =>
  isControlled(state)
    ? (state.expanded ?? "open") === "open"
    : (state.defaultExpanded ?? false) === true;

/** An `auto`/empty control is the absent prop, not a value to pass. */
export const defined = (value: unknown): string | undefined => {
  const text = value === undefined || value === null ? "" : String(value);
  return text === "" || text === "auto" ? undefined : text;
};
