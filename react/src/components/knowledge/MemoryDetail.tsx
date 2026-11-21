import Button from "../Button";
import Panel from "../Panel";
import { ScrollArea } from "../ScrollArea";
import { DEFAULT_SURFACE_PADDING, getSurfacePaddingClass, getTrueColorTextClass, type TrueColor } from "../../theme";
import { safeMemoryHref } from "../../../../common/knowledge/model";
import { MemoryActionButtons, resolveControlChain, useKnowledgeCopy } from "./shared";
import type { MemoryDetailProps } from "./types";

export function MemoryDetail({ memory, relatedMemories = [], onRelatedSelect, renderContent, renderBody,
  actions, size = "xs", controlsTone = "auto", labels, disabled = false, className = "", title, bodyFooter, fullHeight = false, padding = DEFAULT_SURFACE_PADDING, ...surface }: MemoryDetailProps) {
  const copy = useKnowledgeCopy(labels);
  // Action row and related links share one chain on the detail card's surface.
  const chain = resolveControlChain({ tone: surface.tone, variant: surface.variant, controlsTone });
  // Split the Panel inset between the title and body, leaving the scroll frame
  // against the panel edge. Both parts use the responsive surface padding scale.
  const inset = getSurfacePaddingClass(padding);
  // Source links carry the card's own tone ink when it is tinted — the same
  // rule as the card kind badge; the teal accent is only the untinted floor.
  const linkTone: TrueColor | undefined = chain.cardTone === "none" ? undefined : chain.cardTone;
  return <Panel variant="elevated" disabled={disabled} {...surface} tone={chain.cardTone} padding="none" scrollable={false} flexBody className={`kit-knowledge kit-memory-detail${fullHeight ? " kit-memory-detail--full-height h-full" : ""} ${className}`}>
    {!memory ? <p className="kit-knowledge-empty">{copy("selectMemory")}</p> : <>
      {/* The title is pinned — the body scrolls under it in the kit
          ScrollArea, like NetworkGraph's inspector header. */}
      {title !== undefined && <div className={`kit-memory-detail-eyebrow ${inset}`}>{title}</div>}
      <ScrollArea variant="auto" horizontal={false} viewportClassName="[overscroll-behavior:contain]" className="kit-memory-detail-scroll" aria-label={copy("details")}>
      <div className={`kit-memory-detail-body ${title !== undefined ? "kit-memory-detail-body--titled " : ""}${inset}`}>
      {renderBody ? renderBody(memory) : <>
      <div className="kit-memory-meta"><span>{copy(`kinds.${memory.kind}`)}</span><span>{copy(`statuses.${memory.status ?? "active"}`)}</span>{memory.scope && <span>{memory.scope}</span>}</div>
      <h3>{memory.title}</h3><p className="kit-memory-summary">{memory.summary}</p>
      {renderContent ? renderContent(memory) : memory.content && <div className="kit-memory-content">{memory.content}</div>}
      <MemoryActionButtons memory={memory} actions={actions} disabled={disabled} size={size} tone={chain.controlsTone} />
      <section><h4>{copy("sources")}</h4>{memory.sources?.length ? <ul className="kit-memory-sources">{memory.sources.map(source => {
        const href = safeMemoryHref(source.href);
        return <li key={source.id}>{href ? <a href={href} data-tone={linkTone} className={linkTone ? getTrueColorTextClass(linkTone) : undefined}>{source.label}</a> : <span>{source.label}</span>}{source.location && <code>{source.location}</code>}</li>;
      })}</ul> : <p>{copy("noSources")}</p>}</section>
      {memory.usage && <section className="kit-memory-usage"><h4>{copy("retrievals")}</h4><dl>
        {memory.usage.retrievalCount !== undefined && <><dt>{copy("retrievals")}</dt><dd>{memory.usage.retrievalCount}</dd></>}
        {memory.usage.lastRetrievedAt && <><dt>{copy("lastRetrieved")}</dt><dd><time dateTime={memory.usage.lastRetrievedAt}>{memory.usage.lastRetrievedAt}</time></dd></>}
        {memory.usage.feedback && <><dt>{copy("feedback")}</dt><dd>{memory.usage.feedback}</dd></>}
      </dl><p className="kit-knowledge-note">{copy("retrievalNote")}</p></section>}
      {relatedMemories.length > 0 && <section><h4>{copy("related")}</h4><ul className="kit-memory-sources">{relatedMemories.map(related => <li key={related.id}>{onRelatedSelect ? <Button size={size} variant="link" color={chain.controlsTone} disabled={disabled} onClick={() => onRelatedSelect(related.id)}>{related.title}</Button> : related.title}</li>)}</ul></section>}
      </>}
      {bodyFooter}
    </div>
      </ScrollArea>
    </>}
  </Panel>;
}
