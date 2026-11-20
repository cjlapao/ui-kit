import Panel from "../Panel";
import { getTrueColorTextClass, type TrueColor } from "../../theme";
import { resolveControlChain, resolveMemoryActions, useKnowledgeCopy } from "./shared";
import type { MemoryCardProps } from "./types";

export function MemoryCard({ memory, layout = "expanded", selected = false, highlighted = false, onSelect,
  size = "xs", controlsTone = "auto",
  actions, labels, disabled = false, className = "", ...surface }: MemoryCardProps) {
  const copy = useKnowledgeCopy(labels);
  // The action row rides the card's own chain and the Panel's own `actions`
  // slot — the consumer's array resolved against this record, the buttons
  // keeping their chosen type and size. The select button is the body hit
  // target, not chrome, so it stays a plain pressed button.
  const chain = resolveControlChain({ tone: surface.tone, variant: surface.variant, controlsTone });
  const cardActions = resolveMemoryActions(actions, memory, { disabled, size, tone: chain.controlsTone });
  // The kind word is the card's voice: a tinted card inks it in its own
  // tone, the same ink the kit's legends and LEDs wear; an untinted card
  // leaves it on the knowledge accent.
  const kindTone: TrueColor | undefined = chain.cardTone === "none" ? undefined : chain.cardTone;
  const body = <>
    <span className="kit-memory-meta"><span data-kind={memory.kind} data-tone={kindTone} className={kindTone ? getTrueColorTextClass(kindTone) : undefined}>{copy(`kinds.${memory.kind}`)}</span><span>{memory.topic ?? copy("ungrouped")}</span>{memory.pinned && <span>{copy("pinned")}</span>}</span>
    <strong className="kit-memory-title">{memory.title}</strong>
    <span className="kit-memory-summary">{memory.summary}</span>
    <span className="kit-memory-meta kit-memory-footer"><span>{copy(`statuses.${memory.status ?? "active"}`)}</span>{memory.scope && <span>{memory.scope}</span>}{layout === "expanded" && memory.usage?.retrievalCount !== undefined && <span>{copy("retrievals")}: {memory.usage.retrievalCount}</span>}</span>
  </>;
  // Selection is Panel's own `active` state — the tone-tinted fill and inset
  // rim it paints; the card only owns the ARIA, as the prop documents. The
  // explicit active after the spread keeps selection the card's own truth.
  // `hoverable` is the pointer answer: Panel washes and ignites the whole
  // card (tinted wash on tone, neutral veil untinted) — the select button
  // stays chrome-free so a hover never paints just the body slice.
  return <Panel variant="outlined" padding="none" disabled={disabled} {...surface} tone={chain.cardTone} hoverable={!!onSelect} active={selected} actions={cardActions.length ? cardActions : undefined} className={`kit-knowledge kit-memory-card ${className}`} data-layout={layout} data-highlighted={highlighted}>
    {onSelect ? <button className="kit-memory-select" type="button" disabled={disabled} aria-pressed={selected} onClick={() => onSelect(memory)}>{body}</button> : <div className="kit-memory-select">{body}</div>}
  </Panel>;
}
