import { Pill } from "@cjlapao/ui-kit";
import type { InfoRowSubItem } from "@cjlapao/ui-kit";

/**
 * The fixture the InfoRow page mounts and prints. Two rules hold here: nothing is
 * random (the Code view must be able to account for every pixel), and every value
 * is one a details panel really shows — the row is a *label/value* line, so the
 * value's type is the interesting part of the state.
 */

/** The preview column's frame — `.min-h-44` is what the tests scope their queries to. */
export const STAGE_CLASS = "flex w-full max-w-xl flex-col gap-3";

/**
 * What the row's `value` holds, one entry per shape `normaliseValue` knows
 * (:312-329): a string, a number, a boolean, a ReactNode, and nothing.
 */
export const VALUE_SOURCE: Record<string, string> = {
  digest: '"sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b"',
  count: "{3}",
  boolean: "{true}",
  node: "{<STATUS_NODE />}",
  empty: '""',
};

/**
 * The ReactNode shape — the one that suppresses the copy button, because there is
 * no string to put on the clipboard (:328,:436-437). Printed by name, so the
 * snippet says `<Pill>` rather than a minified identifier.
 */
export const STATUS_NODE = (
  <Pill size="sm" tone="emerald" variant="soft">
    healthy
  </Pill>
);

/** Names the printer may use for the components mounted above (:286-296 of `schema.ts`). */
export const SLOT_NAMES: Record<string, unknown> = { Pill };

/**
 * Secondary lines (:50-62,:798-844). The third is a `boolean`, which localises to
 * the catalog's Yes/No rather than painting "true" (:804-809); the last carries
 * neither text nor value and so renders nothing at all (:814).
 */
export const SUB_ITEMS: InfoRowSubItem[] = [
  { text: "Policy:", value: "trigger_access.all-agents.sdsd.allow", mono: true },
  { text: "Signed by:", value: "ci-bot@fleet" },
  { value: true },
  { text: "", value: "" },
];

/** The sub-items as the reader would type them — the printer's object form is fine too. */
export const SUB_ITEMS_SOURCE = `const SUB_ITEMS = [
  { text: "Policy:", value: "trigger_access.all-agents.sdsd.allow", mono: true },
  { text: "Signed by:", value: "ci-bot@fleet" },
  { value: true },
  { text: "", value: "" },
];`;

/** The disclosure's content (:853-899) — app content, so it keeps its own clicks. */
export const BODY_NODE = (
  <ul className="list-disc space-y-1 pl-4">
    <li>Pushed by the release pipeline at 14:32 UTC.</li>
    <li>Signed with the fleet key; rotation due in 12 days.</li>
  </ul>
);

/**
 * The host card a `plain` row needs — it draws no surface of its own (:980-990).
 * One list, so the preview and the printed snippet cannot drift apart.
 */
export const HOST_PROPS = ['variant="outlined"', 'padding="sm"', "scrollable={false}"];

export const HOST_PROPS_SOURCE = HOST_PROPS.join(" ");
