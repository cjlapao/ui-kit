import Panel from "../Panel";
import { safeMemoryHref } from "../../../../common/knowledge/model";
import { MemoryActionButtons, useKnowledgeCopy } from "./shared";
import type { MemoryDetailProps } from "./types";

export function MemoryDetail({ memory, relatedMemories = [], onRelatedSelect, renderContent, onEdit, onPinChange,
  onArchive, labels, disabled = false, className = "", ...surface }: MemoryDetailProps) {
  const copy = useKnowledgeCopy(labels);
  return <Panel tone="none" variant="outlined" padding="none" disabled={disabled} {...surface} className={`kit-knowledge kit-memory-detail ${className}`}>
    {!memory ? <p className="kit-knowledge-empty">{copy("selectMemory")}</p> : <div className="kit-memory-detail-body">
      <div className="kit-memory-meta"><span>{copy(`kinds.${memory.kind}`)}</span><span>{copy(`statuses.${memory.status ?? "active"}`)}</span>{memory.scope && <span>{memory.scope}</span>}</div>
      <h3>{memory.title}</h3><p className="kit-memory-summary">{memory.summary}</p>
      {renderContent ? renderContent(memory) : memory.content && <div className="kit-memory-content">{memory.content}</div>}
      <MemoryActionButtons memory={memory} disabled={disabled} onEdit={onEdit} onPinChange={onPinChange} onArchive={onArchive} copy={copy} />
      <section><h4>{copy("sources")}</h4>{memory.sources?.length ? <ul className="kit-memory-sources">{memory.sources.map(source => {
        const href = safeMemoryHref(source.href);
        return <li key={source.id}>{href ? <a href={href}>{source.label}</a> : <span>{source.label}</span>}{source.location && <code>{source.location}</code>}</li>;
      })}</ul> : <p>{copy("noSources")}</p>}</section>
      {memory.usage && <section className="kit-memory-usage"><h4>{copy("retrievals")}</h4><dl>
        {memory.usage.retrievalCount !== undefined && <><dt>{copy("retrievals")}</dt><dd>{memory.usage.retrievalCount}</dd></>}
        {memory.usage.lastRetrievedAt && <><dt>{copy("lastRetrieved")}</dt><dd><time dateTime={memory.usage.lastRetrievedAt}>{memory.usage.lastRetrievedAt}</time></dd></>}
        {memory.usage.feedback && <><dt>{copy("feedback")}</dt><dd>{memory.usage.feedback}</dd></>}
      </dl><p className="kit-knowledge-note">{copy("retrievalNote")}</p></section>}
      {relatedMemories.length > 0 && <section><h4>{copy("related")}</h4><ul className="kit-memory-sources">{relatedMemories.map(related => <li key={related.id}>{onRelatedSelect ? <button type="button" disabled={disabled} onClick={() => onRelatedSelect(related.id)}>{related.title}</button> : related.title}</li>)}</ul></section>}
    </div>}
  </Panel>;
}
