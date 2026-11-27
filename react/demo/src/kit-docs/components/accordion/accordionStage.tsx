import { Button } from "@cjlapao/ui-kit";
import type { AccordionItem } from "@cjlapao/ui-kit";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Fixtures and predicates for the Accordion playground.
 *
 * `items` is the one prop that carries most of what the reader sees, and it is
 * an array of objects rather than a control, so it lives here as a generated
 * fixture: the preview renders `buildItems(state)` and the Code view prints
 * `itemsSource(state)`, both from `ROWS` below. That is deliberate — a page
 * that hand-wrote the two would eventually print a list it never painted.
 */

export interface Row {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: string;
  content: string;
}

export const ROWS: Row[] = [
  {
    id: "us-east",
    title: "United States",
    subtitle: "us-east-1 · N. Virginia",
    description: "Low latency for east-coast workloads.",
    badge: "Primary",
    icon: "Globe",
    content:
      "Three availability zones. GPU instances and spot capacity are available in this region.",
  },
  {
    id: "eu-central",
    title: "Europe",
    subtitle: "eu-central-1 · Frankfurt",
    description: "GDPR-compliant workloads.",
    badge: "High demand",
    icon: "Globe",
    content:
      "Two availability zones. The maintenance window is Sundays 02:00–04:00 CET.",
  },
  {
    id: "ap-southeast",
    title: "Asia Pacific",
    subtitle: "ap-southeast-1 · Singapore",
    description: "Low-latency APIs for APAC traffic.",
    badge: "New",
    icon: "Globe",
    content: "Three availability zones. Private connectivity on request.",
  },
  {
    id: "sa-east",
    title: "South America",
    subtitle: "sa-east-1 · São Paulo",
    description: "In-country residency for Brazilian data.",
    badge: "Beta",
    icon: "Globe",
    content: "Two availability zones. Contact support to enable the region.",
  },
];

export const ARIA_LABEL = "Cloud regions";
export const ACTION_JSX = `<Button size="xs" variant="ghost">Refresh</Button>`;

export const itemCount = (state: PlaygroundState): number =>
  Math.max(0, Math.min(ROWS.length, Number(state.itemCount ?? 3)));

/** The ids the reader can actually open — what `defaultOpenIds`/`openIds` print. */
export const visibleIds = (state: PlaygroundState): string[] =>
  ROWS.slice(0, itemCount(state)).map((row) => row.id);

const quote = (value: string): string => JSON.stringify(value);

/** Field lines for one item, in the order a reader would write them. */
const itemLines = (
  row: Row,
  state: PlaygroundState,
  index: number,
): string[] => {
  const lines = [`id: ${quote(row.id)}`, `title: ${quote(row.title)}`];
  lines.push(`subtitle: ${quote(row.subtitle)}`);
  if ((state.withIcons ?? true) !== false) lines.push(`icon: ${quote(row.icon)}`);
  if ((state.withBadge ?? true) !== false)
    lines.push(`badge: ${quote(row.badge)}`);
  if ((state.withDescription ?? false) === true)
    lines.push(`description: ${quote(row.description)}`);
  if ((state.withActions ?? true) !== false) lines.push(`actions: ${ACTION_JSX}`);
  // One row each, so the two states are visible without a fourth control.
  if ((state.oneDisabled ?? false) === true && index === 1)
    lines.push("disabled: true");
  if ((state.oneLoading ?? false) === true && index === 0)
    lines.push("loading: true");
  lines.push(`content: ${quote(row.content)}`);
  return lines;
};

/** The Code view's `ITEMS` literal, generated from `ROWS`. */
export const itemsSource = (state: PlaygroundState): string => {
  const rows = ROWS.slice(0, itemCount(state));
  if (rows.length === 0) return "[]";
  return [
    "[",
    ...rows.map((row, index) =>
      [
        "  {",
        ...itemLines(row, state, index).map((line) => `    ${line},`),
        "  },",
      ].join("\n"),
    ),
    "]",
  ].join("\n");
};

/** The preview's array — same rows, same levers, real elements. */
export const buildItems = (state: PlaygroundState): AccordionItem[] =>
  ROWS.slice(0, itemCount(state)).map((row, index) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    icon: (state.withIcons ?? true) !== false ? row.icon : undefined,
    badge: (state.withBadge ?? true) !== false ? row.badge : undefined,
    description:
      (state.withDescription ?? false) === true ? row.description : undefined,
    actions:
      (state.withActions ?? true) === false ? undefined : (
        <Button size="xs" variant="ghost">
          Refresh
        </Button>
      ),
    disabled: (state.oneDisabled ?? false) === true && index === 1,
    loading: (state.oneLoading ?? false) === true && index === 0,
    content: row.content,
  }));

/** Which ids the snippet should say are open, for either mode. */
export const openSelection = (state: PlaygroundState): string[] => {
  const picked = String(state.startOpen ?? "first");
  const ids = visibleIds(state);
  if (picked === "none" || ids.length === 0) return [];
  if (picked === "all") return ids;
  return ids.slice(0, 1);
};

export const printIds = (ids: string[]): string =>
  `[${ids.map((id) => quote(id)).join(", ")}]`;

const GLASS_VARIANTS = ["glass", "liquid-glass", "default"];

/** The three variants Panel draws a specular layer on (Panel.tsx:391). */
export const isGlass = (state: PlaygroundState): boolean =>
  GLASS_VARIANTS.includes(String(state.variant ?? "elevated"));

/** The one variant that reads `vibrancy` and `glassOpacity` (Panel.tsx:1011-1012). */
export const isLiquid = (state: PlaygroundState): boolean =>
  String(state.variant ?? "elevated") === "liquid-glass";

/** `openIds` is read as `controlledOpenIds ?? internalOpenIds` (useAccordion.ts:29). */
export const isControlled = (state: PlaygroundState): boolean =>
  (state.mode ?? "uncontrolled") === "controlled";

/** An `auto`/empty control is the absent prop, not a value to pass. */
export const defined = (value: unknown): string | undefined => {
  const text = value === undefined || value === null ? "" : String(value);
  return text === "" || text === "auto" ? undefined : text;
};
