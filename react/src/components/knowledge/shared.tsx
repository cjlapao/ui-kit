import { useState } from "react";
import Button from "../Button";
import { useKitT } from "../../i18n";
import { getSurfaceAccentColor, INPUT_VARIANTS } from "../../theme";
import type { ControlSize, InputVariant, SurfaceTone, SurfaceVariant, TrueColor } from "../../theme";
import type { PanelAction } from "../Panel";
import type { KnowledgeLabels, MemoryActions, MemoryCardAction } from "./types";
import type { MemoryRecord } from "../../../../common/knowledge/model";

const MESSAGE_KEYS = {
  "library": "kit.knowledge.library",
  "map": "kit.knowledge.map",
  "details": "kit.knowledge.details",
  "inspector": "kit.knowledge.inspector",
  "search": "kit.knowledge.search",
  "kind": "kit.knowledge.kind",
  "status": "kit.knowledge.status",
  "topic": "kit.knowledge.topic",
  "all": "kit.knowledge.all",
  "cards": "kit.knowledge.cards",
  "list": "kit.knowledge.list",
  "empty": "kit.knowledge.empty",
  "noResults": "kit.knowledge.noResults",
  "loading": "kit.knowledge.loading",
  "selectMemory": "kit.knowledge.selectMemory",
  "sources": "kit.knowledge.sources",
  "noSources": "kit.knowledge.noSources",
  "related": "kit.knowledge.related",
  "edit": "kit.knowledge.edit",
  "pin": "kit.knowledge.pin",
  "unpin": "kit.knowledge.unpin",
  "archive": "kit.knowledge.archive",
  "retrievals": "kit.knowledge.retrievals",
  "lastRetrieved": "kit.knowledge.lastRetrieved",
  "feedback": "kit.knowledge.feedback",
  "retrievalNote": "kit.knowledge.retrievalNote",
  "fit": "kit.knowledge.fit",
  "zoomIn": "kit.knowledge.zoomIn",
  "zoomOut": "kit.knowledge.zoomOut",
  "zoom": "kit.knowledge.zoom",
  "reset": "kit.knowledge.reset",
  "topicLayout": "kit.knowledge.topicLayout",
  "projectionNote": "kit.knowledge.projectionNote",
  "relationships": "kit.knowledge.relationships",
  "previous": "kit.knowledge.previous",
  "next": "kit.knowledge.next",
  "clear": "kit.knowledge.clear",
  "ungrouped": "kit.knowledge.ungrouped",
  "selectAll": "kit.knowledge.selectAll",
  "mapHelp": "kit.knowledge.mapHelp",
  "pinned": "kit.knowledge.pinned",
  "loadMore": "kit.knowledge.loadMore",
  "loadingMore": "kit.knowledge.loadingMore",
  "loadMoreError": "kit.knowledge.loadMoreError",
  "retry": "kit.knowledge.retry",
  "limitReached": "kit.knowledge.limitReached",
  "view": "kit.knowledge.view",
  "kinds.lesson": "kit.knowledge.kinds.lesson",
  "kinds.decision": "kit.knowledge.kinds.decision",
  "kinds.convention": "kit.knowledge.kinds.convention",
  "kinds.pitfall": "kit.knowledge.kinds.pitfall",
  "kinds.code": "kit.knowledge.kinds.code",
  "kinds.documentation": "kit.knowledge.kinds.documentation",
  "statuses.active": "kit.knowledge.statuses.active",
  "statuses.needs-review": "kit.knowledge.statuses.needs-review",
  "statuses.superseded": "kit.knowledge.statuses.superseded",
  "statuses.archived": "kit.knowledge.statuses.archived"
} as const;
type KnowledgeCopyKey = keyof typeof MESSAGE_KEYS;

export function useKnowledgeCopy(labels?: KnowledgeLabels) {
  const t = useKitT();
  return (key: KnowledgeCopyKey, values?: Record<string, unknown>) => labels?.[key] ?? t(MESSAGE_KEYS[key], values);
}
export function useKnowledgeState<T>(value: T | undefined, initial: T, onChange?: (value: T) => void): [T, (value: T) => void] {
  const [internal, setInternal] = useState(initial);
  return [value === undefined ? internal : value, next => { if (value === undefined) setInternal(next); onChange?.(next); }];
}

/** One resolution for every control chain in the knowledge family.
 * The family's surface floors to the kit's default blue — panels ignite,
 * kind badges and source links ink in it; an explicit `"none"` stays fully
 * untinted, and its controls still floor to that same kit default blue, the
 * floor Spinner, Progress and ActivityFeed controls sit on.
 * A control's own tone/variant wins, then the shared `controlsTone` /
 * card variant, then `"auto"` — the card's accent for tone and the card's
 * variant for surfaces.
 * Aggregators resolve once and hand concrete values to the parts; parts
 * resolve their own defaults so they render identically standalone. */
export function resolveControlChain(options: {
  tone?: SurfaceTone;
  variant?: SurfaceVariant;
  controlsTone?: TrueColor | "auto";
  searchTone?: TrueColor | "auto";
  searchVariant?: InputVariant | "auto";
  viewTone?: TrueColor | "auto";
  viewVariant?: SurfaceVariant | "auto";
}) {
  const { tone = "blue", variant, controlsTone = "auto", searchTone = "auto", searchVariant = "auto", viewTone = "auto", viewVariant = "auto" } = options;
  const accent = getSurfaceAccentColor(tone);
  const controls = controlsTone === "auto" ? (accent === "neutral" ? "blue" : accent) : controlsTone;
  const cardVariant: SurfaceVariant = variant ?? "outlined";
  // The card Panel's own surface: the main component's tone flows to it, so
  // Panel's `active` rim ignites in that hue.
  const cardTone: SurfaceTone = tone;
  return {
    controlsTone: controls,
    searchTone: (searchTone === "auto" ? controls : searchTone) as TrueColor,
    viewTone: (viewTone === "auto" ? controls : viewTone) as TrueColor,
    searchVariant: (searchVariant === "auto"
      ? (INPUT_VARIANTS.includes(cardVariant as InputVariant) ? cardVariant as InputVariant : "flat")
      : searchVariant) as InputVariant,
    viewVariant: viewVariant === "auto" ? cardVariant : viewVariant,
    cardTone,
    cardVariant,
  };
}

/** Resolve a consumer's action array against one record: drop hidden
 * entries, evaluate the per-record `label`/`pressed` functions and bind the
 * record into `onClick`. Unsupplied button type, scale and accent default to
 * the card's control chain, so one array can mix bespoke Buttons with ones
 * that simply follow the card. The output plugs straight into Panel's
 * `actions` slot — the card's own approach; the detail renders the same
 * shape as an inline row. */
export function resolveMemoryActions(actions: MemoryCardAction[] | undefined, memory: MemoryRecord, { disabled = false, size = "xs", tone = "blue" }: {
  disabled?: boolean;
  /** Resolved control scale/tone floor — pass `size` and `resolveControlChain().controlsTone`. */
  size?: ControlSize; tone?: TrueColor;
} = {}): PanelAction[] {
  return (actions ?? []).flatMap(({ hidden, label, pressed, onClick, ...surface }) => {
    if (typeof hidden === "function" ? hidden(memory) : hidden) return [];
    return [{
      ...surface,
      label: typeof label === "function" ? label(memory) : label,
      pressed: typeof pressed === "function" ? pressed(memory) : pressed,
      variant: surface.variant ?? "outline",
      size: surface.size ?? size,
      color: surface.color ?? tone,
      disabled: disabled || surface.disabled,
      onClick: () => onClick?.(memory),
    }];
  });
}

/** The detail's action row: the resolved actions as kit Buttons, inline in
 * the body — the card hands the same array to its Panel's `actions` slot. */
export function MemoryActionButtons({ memory, actions, disabled = false, size = "xs", tone = "blue" }: MemoryActions & {
  memory: MemoryRecord; disabled?: boolean;
  /** Resolved control accent — pass `resolveControlChain().controlsTone`. */
  tone?: TrueColor; size?: ControlSize;
}) {
  const resolved = resolveMemoryActions(actions, memory, { disabled, size, tone });
  if (!resolved.length) return null;
  return <div className="kit-knowledge-actions">{resolved.map(({ id, label, onClick, ...buttonProps }, index) =>
    <Button key={id ?? index} {...buttonProps} onClick={onClick}>{label}</Button>)}</div>;
}
