import Panel from "../Panel";
import { MemoryActionButtons, useKnowledgeCopy } from "./shared";
import type { MemoryCardProps } from "./types";

export function MemoryCard({ memory, layout = "expanded", selected = false, highlighted = false, onSelect,
  onEdit, onPinChange, onArchive, labels, disabled = false, className = "", ...surface }: MemoryCardProps) {
  const copy = useKnowledgeCopy(labels);
  const body = <>
    <span className="kit-memory-meta"><span data-kind={memory.kind}>{copy(`kinds.${memory.kind}`)}</span><span>{memory.topic ?? copy("ungrouped")}</span>{memory.pinned && <span>{copy("pinned")}</span>}</span>
    <strong className="kit-memory-title">{memory.title}</strong>
    <span className="kit-memory-summary">{memory.summary}</span>
    <span className="kit-memory-meta kit-memory-footer"><span>{copy(`statuses.${memory.status ?? "active"}`)}</span>{memory.scope && <span>{memory.scope}</span>}{layout === "expanded" && memory.usage?.retrievalCount !== undefined && <span>{copy("retrievals")}: {memory.usage.retrievalCount}</span>}</span>
  </>;
  return <Panel tone="none" variant="outlined" padding="none" disabled={disabled} {...surface} className={`kit-knowledge kit-memory-card ${className}`} data-layout={layout} data-selected={selected} data-highlighted={highlighted}>
    {onSelect ? <button className="kit-memory-select" type="button" disabled={disabled} aria-pressed={selected} onClick={() => onSelect(memory)}>{body}</button> : <div className="kit-memory-select">{body}</div>}
    <MemoryActionButtons memory={memory} disabled={disabled} onEdit={onEdit} onPinChange={onPinChange} onArchive={onArchive} copy={copy} />
  </Panel>;
}
