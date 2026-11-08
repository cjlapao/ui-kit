import { useState } from "react";
import { useKitT } from "../../i18n";
import type { KnowledgeLabels, MemoryActions } from "./types";
import type { MemoryRecord } from "../../../../common/knowledge/model";

const MESSAGE_KEYS = {
  "library": "kit.knowledge.library",
  "map": "kit.knowledge.map",
  "details": "kit.knowledge.details",
  "trace": "kit.knowledge.trace",
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
  "topicLayout": "kit.knowledge.topicLayout",
  "projectionNote": "kit.knowledge.projectionNote",
  "relationships": "kit.knowledge.relationships",
  "previous": "kit.knowledge.previous",
  "next": "kit.knowledge.next",
  "clear": "kit.knowledge.clear",
  "ungrouped": "kit.knowledge.ungrouped",
  "linkedTraces": "kit.knowledge.linkedTraces",
  "noTraceLinks": "kit.knowledge.noTraceLinks",
  "mapHelp": "kit.knowledge.mapHelp",
  "pinned": "kit.knowledge.pinned",
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
  return (key: KnowledgeCopyKey) => labels?.[key] ?? t(MESSAGE_KEYS[key]);
}
export function useKnowledgeState<T>(value: T | undefined, initial: T, onChange?: (value: T) => void): [T, (value: T) => void] {
  const [internal, setInternal] = useState(initial);
  return [value === undefined ? internal : value, next => { if (value === undefined) setInternal(next); onChange?.(next); }];
}
export function MemoryActionButtons({ memory, onEdit, onPinChange, onArchive, copy, disabled = false }: MemoryActions & { memory: MemoryRecord; disabled?: boolean; copy: (key: KnowledgeCopyKey) => string }) {
  if (!onEdit && !onPinChange && !onArchive) return null;
  return <div className="kit-knowledge-actions">
    {onEdit && <button type="button" disabled={disabled} onClick={() => onEdit(memory)}>{copy("edit")}</button>}
    {onPinChange && <button type="button" disabled={disabled} aria-pressed={!!memory.pinned} onClick={() => onPinChange(memory, !memory.pinned)}>{copy(memory.pinned ? "unpin" : "pin")}</button>}
    {onArchive && memory.status !== "archived" && <button type="button" disabled={disabled} onClick={() => onArchive(memory)}>{copy("archive")}</button>}
  </div>;
}
