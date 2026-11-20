import IconToggleGroup from "../IconToggleGroup";
import { resolveControlChain, useKnowledgeCopy } from "./shared";
import type { MemoryControlsProps } from "./types";
import type { KnowledgeLabels, SurfaceTone, SurfaceVariant } from "./types";

export interface MemoryToolbarProps extends Omit<MemoryControlsProps, "searchTone" | "searchVariant"> {
  view: "cards" | "list";
  onViewChange: (view: "cards" | "list") => void;
  /** Results readout (e.g. `"12 / 20"`) sharing the row, on the left of the
   * toggle; `aria-live` so it announces on change. Omit for a bare toggle. */
  resultsLabel?: string;
  /** The hosting card's Panel tone/variant — what `"auto"` resolves against.
   * MemoryLibrary passes its own; standalone, `"auto"` sits on the kit's
   * default blue floor and an outlined surface. */
  cardTone?: SurfaceTone;
  cardVariant?: SurfaceVariant;
  disabled?: boolean;
  labels?: KnowledgeLabels;
}

/**
 * The library's view row: the results count on the left and, right-aligned
 * over the grid, the kit's IconToggleGroup carrying the cards/list switch —
 * one IconButton per mode on a single track, wearing the kit's ViewGrid/
 * ViewRows glyphs with their labels as accessible names and tooltips. A part
 * of MemoryLibrary; renders identically standalone.
 */
export function MemoryToolbar({ view, onViewChange, resultsLabel, cardTone, cardVariant, disabled = false, labels, ...controls }: MemoryToolbarProps) {
  const copy = useKnowledgeCopy(labels);
  const chain = resolveControlChain({ tone: cardTone, variant: cardVariant, ...controls });
  return (
    <div className={`kit-memory-view-row${resultsLabel !== undefined ? " kit-memory-view-row--counted" : ""}`}>
      {resultsLabel !== undefined && <span className="kit-memory-view-count" aria-live="polite">{resultsLabel}</span>}
      <IconToggleGroup size={controls.size ?? "sm"} tone={chain.viewTone} variant={chain.viewVariant} disabled={disabled} aria-label={copy("library")}
        options={[
          { value: "cards", icon: "ViewGrid", label: copy("cards") },
          { value: "list", icon: "ViewRows", label: copy("list") },
        ]}
        value={view} onChange={mode => onViewChange(mode as "cards" | "list")} />
    </div>
  );
}
