import { useMemo } from "react";
import { MemoryCard } from "./MemoryCard";
import { useKnowledgeCopy } from "./shared";
import type { MemoryActions, MemoryRecord } from "./types";
import type { KnowledgeLabels } from "./types";
import type { SurfaceTone, SurfaceVariant } from "../../theme";

export interface MemoryGridProps extends MemoryActions {
  /** The already-filtered, already-capped records to draw. */
  records: readonly MemoryRecord[];
  view: "cards" | "list";
  /** Group under topic headings. @default true */
  groupByTopic?: boolean;
  selectedId?: string | null;
  /** The row/card click event — pass it to wire selection into your own state. */
  onSelect?: (memory: MemoryRecord) => void;
  highlightedIds?: readonly string[];
  /** Replace a card wholesale; the state bag mirrors what the built-in card gets. */
  renderMemory?: (memory: MemoryRecord, state: { selected: boolean; highlighted: boolean; select: () => void }) => React.ReactNode;
  disabled?: boolean;
  labels?: KnowledgeLabels;
  /** Concrete card surface handed down from the aggregator's chain — the
   * card Panel paints its `active` rim in this tone. @default "none" */
  cardTone?: SurfaceTone;
  /** @default "outlined" */
  cardVariant?: SurfaceVariant;
}

/**
 * The library's results body: records grouped under topic headings, rendered
 * as MemoryCards (compact in list view, expanded in cards view). A part of
 * MemoryLibrary; renders identically standalone — hand it a slice of records
 * and own the click events yourself.
 */
export function MemoryGrid({ records, view, groupByTopic = true, selectedId, onSelect, highlightedIds = [], renderMemory, disabled = false, labels, actions, cardTone = "none", cardVariant = "outlined" }: MemoryGridProps) {
  const copy = useKnowledgeCopy(labels);
  const highlighted = useMemo(() => new Set(highlightedIds), [highlightedIds]);
  const groups = useMemo(() => {
    const result = new Map<string, MemoryRecord[]>();
    for (const memory of records) { const key = groupByTopic ? memory.topic ?? "" : ""; const group = result.get(key) ?? []; group.push(memory); result.set(key, group); }
    return [...result];
  }, [records, groupByTopic]);
  return <div className="kit-memory-groups">{groups.map(([topic, items]) => <section key={topic}>
    {groupByTopic && <h3 className="kit-memory-group-title">{topic || copy("ungrouped")}<span>{items.length}</span></h3>}
    <div className="kit-memory-grid" data-view={view}>{items.map(memory => <div key={memory.id}>{renderMemory
      ? renderMemory(memory, { selected: selectedId === memory.id, highlighted: highlighted.has(memory.id), select: () => { if (!disabled) onSelect?.(memory); } })
      : <MemoryCard memory={memory} layout={view === "list" ? "compact" : "expanded"} selected={selectedId === memory.id} highlighted={highlighted.has(memory.id)} tone={cardTone} variant={cardVariant} onSelect={disabled ? undefined : onSelect} actions={disabled ? undefined : actions} labels={labels} />}</div>)}</div>
  </section>)}</div>;
}
