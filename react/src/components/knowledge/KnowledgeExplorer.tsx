import { useEffect, useMemo, useRef, useState } from "react";
import MultiToggle from "../MultiToggle";
import { filterMemories } from "../../../../common/knowledge/model";
import { MemoryLibrary } from "./MemoryLibrary";
import { MemoryDetail } from "./MemoryDetail";
import { KnowledgeMap } from "./KnowledgeMap";
import { resolveControlChain, useKnowledgeCopy, useKnowledgeState } from "./shared";
import type { KnowledgeExplorerContext, KnowledgeExplorerProps, KnowledgeExplorerView, KnowledgeRegion } from "./types";

/** Inspector column geometry, mirroring NetworkGraph's docked inspector. */
const INSPECTOR_WIDTH_DEFAULT = 340;
const INSPECTOR_WIDTH_MIN = 180;
const INSPECTOR_WIDTH_MAX = 480;
const INSPECTOR_MIN_MAIN_WIDTH_DEFAULT = 360;

/** Only forward chrome the slot actually pins: an `undefined` key (an
 * `"auto"` with nothing to follow) would override the part's own panel
 * defaults with `undefined` if spread. */
function compact<T extends Record<string, unknown>>(props: T): Partial<T> {
  return Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as Partial<T>;
}
/** `"auto"` follows the main panel's resolved value; anything else pins it. */
function follow<V>(pinned: V | "auto", base: V | undefined): V | undefined {
  return pinned === "auto" ? base : pinned;
}

/**
 * The whole knowledge workspace in one component, laid out like NetworkGraph:
 * the main column on the left holds exactly one chosen view — the map or the
 * knowledge library, switched with a kit MultiToggle — the inspector column
 * on the right holds the memory detail (common to both views, never a third
 * option in the switch). Agent traces live in their own component, not here.
 *
 * Panels work like NetworkGraph's too: the explorer's own surface props
 * (tone, variant, padding, corner…) paint the panel of whichever view is
 * showing, the inspector mirrors tone, variant and corner while its `inspector*` chrome stays
 * `"auto"`, and the gap between the two columns is NetworkGraph's 16px. The
 * root is a plain structural container — one card per region, never a card
 * inside a card. While docked the inspector is measured to the view panel's
 * exact height and the detail scrolls inside its own panel.
 *
 * The aggregator composes the very same standalone parts the kit exports
 * individually — `MemoryLibrary`, `MemoryToolbar`, `MemoryFilterBar`,
 * `MemoryGrid`, `KnowledgeMap`, `MemoryDetail` — so using a part on its own
 * renders identically to the same region here, with its own click events
 * ready for integration.
 */
export function KnowledgeExplorer({ memories, points, relationships, selectedId,
  defaultSelectedId = null, onSelectionChange, query: queryProp, defaultQuery = "", onQueryChange,
  filters: filtersProp, defaultFilters = {}, onFiltersChange, library, view: viewProp, defaultView = "library",
  onViewChange, inspector = true, fullHeight = false, inspectorWidth, inspectorMinMainWidth, inspectorStackBelow,
  inspectorTone = "auto", inspectorVariant = "auto", inspectorPadding = "auto", inspectorCorner = "auto", inspectorTitle,
  map, controlsTone = "auto", size = "sm",
  regions, renderRegion, actions, labels, loading = false, disabled = false,
  // The parts keep their own `onError` semantics; the root is a structural
  // container now, so the React handler has no home here — drop it from the
  // panel spread.
  className = "", onError: _onError, ...surface }: KnowledgeExplorerProps) {
  const copy = useKnowledgeCopy(labels);
  const [selection, select] = useKnowledgeState(selectedId, defaultSelectedId, onSelectionChange);
  const [query, setQuery] = useKnowledgeState(queryProp, defaultQuery, onQueryChange);
  const [filters, setFilters] = useKnowledgeState(filtersProp, defaultFilters, onFiltersChange);
  const [innerView, setInnerView] = useKnowledgeState(viewProp, defaultView, onViewChange);
  const records = useMemo(() => new Map(memories.map(memory => [memory.id, memory])), [memories]);
  const selectedMemory = selection ? records.get(selection) ?? null : null;
  // Layout uses all records to stay stable; query/filter changes only alter highlights.
  const matchingIds = useMemo(() => filterMemories(memories, query, filters).map(memory => memory.id), [memories, query, filters]);
  const enabled = (["library", "map", "detail"] as const).filter(region => regions?.[region] !== false);
  const views: KnowledgeExplorerView[] = (["library", "map"] as const).filter(region => enabled.includes(region));
  const view: KnowledgeExplorerView | undefined = views.includes(innerView) ? innerView : views[0];
  // NetworkGraph's rule: the inspector column exists while the detail region
  // is enabled, but it only opens with a selected memory — nothing selected,
  // nothing shown. Loading hides it outright too: while the workspace is
  // busy, the loading view is the only story, even with a selection held.
  const inspectorVisible = inspector && enabled.includes("detail");
  const inspectorOpen = inspectorVisible && !loading && !!selectedMemory;
  const gridRef = useRef<HTMLDivElement | null>(null);
  // Dock or stack: a pure width switch on the main component alone — the
  // inspector docks while the component is at least the main view's floor
  // wide, and moves under the view below it. The inspector column's own
  // width never counts; `inspectorStackBelow` replaces the comparison outright.
  const width = Math.min(INSPECTOR_WIDTH_MAX, Math.max(INSPECTOR_WIDTH_MIN, inspectorWidth ?? INSPECTOR_WIDTH_DEFAULT));
  const threshold = inspectorStackBelow ?? (inspectorMinMainWidth ?? INSPECTOR_MIN_MAIN_WIDTH_DEFAULT);
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(entries => {
      const measured = entries[entries.length - 1]?.contentRect.width ?? el.clientWidth;
      setStacked(measured < threshold);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  // Docked height parity: NetworkGraph pins its inspector to the graph's
  // --cj-network-graph-height; the view here grows with its results, so the
  // height is measured and published for the inspector column to match.
  const viewSectionRef = useRef<HTMLElement | null>(null);
  const [viewHeight, setViewHeight] = useState<number | null>(null);
  useEffect(() => {
    const el = viewSectionRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(entries => setViewHeight(entries[entries.length - 1]?.contentRect.height ?? el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [view]);
  const context: KnowledgeExplorerContext = { selectedMemory, selectedId: selection, selectMemory: select, query, setQuery, filters, setFilters };
  const shared = { labels, disabled, loading };
  // One chain for the explorer's own header controls: `"auto"` follows the
  // explorer card's accent, with the kit's default blue as the floor.
  const chain = resolveControlChain({ tone: surface.tone, variant: surface.variant, controlsTone });
  // NetworkGraph's split: the surface spread paints the panel of whichever
  // view is showing (that is the card the user sees), and the inspector
  // mirrors it while its own chrome is `"auto"`.
  const inspectorChrome = compact({
    tone: follow(inspectorTone, surface.tone),
    variant: follow(inspectorVariant, surface.variant),
    corner: follow(inspectorCorner, surface.corner),
  });
  const content = (region: KnowledgeRegion) => {
    // Library and map are replaced whole; the detail override is narrower —
    // it owns only the inspector's body, inside the MemoryDetail shell. The
    // panel, its pinned title and the scroll area stay the shell's job.
    if (region !== "detail" && renderRegion?.[region]) return renderRegion[region]!(context);
    if (region === "library") return <MemoryLibrary {...surface} {...shared} actions={actions} {...library} {...(fullHeight ? { flexBody: true } : {})} onShowMap={views.includes("map") ? () => setInnerView("map") : undefined} memories={memories} query={query} onQueryChange={setQuery} filters={filters} onFiltersChange={setFilters} selectedId={selection} onSelectionChange={select} />;
    if (region === "map") return <KnowledgeMap {...surface} {...shared} {...(fullHeight ? { fullHeight: true } : {})} {...map} onShowLibrary={views.includes("library") ? () => setInnerView("library") : undefined} memories={memories} points={points} relationships={relationships} selectedId={selection} onSelectionChange={select} highlightedIds={query || filters.kind?.length || filters.status?.length ? matchingIds : []} selectedTopic={filters.topic} onTopicSelect={topics => setFilters({ ...filters, topic: topics })} />;
    if (region === "detail") return <MemoryDetail {...surface} {...inspectorChrome} actions={actions} padding={inspectorPadding === "auto" ? undefined : inspectorPadding} labels={labels} title={inspectorTitle ?? copy("inspector")} memory={selectedMemory} relatedMemories={(selectedMemory?.relatedIds ?? []).flatMap(id => { const record = records.get(id); return record ? [record] : []; })} onRelatedSelect={disabled ? undefined : select} renderBody={renderRegion?.detail ? () => renderRegion.detail!(context) : undefined} />;
    return null;
  };
  return <div className={`kit-knowledge kit-knowledge-explorer${fullHeight ? " kit-knowledge-explorer--full-height" : ""} ${className}`} aria-busy={loading || undefined} aria-disabled={disabled || undefined}>
    {views.length > 1 && <div className="kit-knowledge-toolbar">
      {/* The view switch: exactly one of map / library owns the main column.
          A kit MultiToggle, so it is one segmented radiogroup, not two tabs. */}
      <MultiToggle size={size} tone={chain.controlsTone} variant={chain.viewVariant} disabled={disabled} aria-label={copy("view")}
        options={views.map(region => ({ value: region, label: copy(region) }))}
        value={view} onChange={next => setInnerView(next as KnowledgeExplorerView)} />
    </div>}
    {(view || inspectorVisible) && <div ref={gridRef} className={`kit-knowledge-explorer-grid${inspectorOpen ? " kit-knowledge-explorer-grid--inspector-open" : ""}${stacked && inspectorVisible ? " kit-knowledge-explorer-grid--stacked" : ""}${view ? "" : " kit-knowledge-explorer-grid--inspector-only"}`}
      style={{ "--kit-knowledge-inspector-width": `${width}px`, ...(viewHeight ? { "--kit-knowledge-inspector-height": `${viewHeight}px` } : {}) } as React.CSSProperties}>
      {view && <section key={view} ref={viewSectionRef} className={`kit-knowledge-region kit-knowledge-region-${view}`} aria-label={copy(view)}>{content(view)}</section>}
      {/* Mounted like NetworkGraph's inspector column so the dock/stack and
          open/close transitions have something to animate; inert and the
          collapsed 0px column keep it out of sight and out of the tab order
          until a memory is selected. Loading unmounts it outright — while the
          workspace is busy the inspector never shows, not even collapsed. */}
      {inspectorVisible && !loading && <section className="kit-knowledge-region kit-knowledge-region-detail kit-knowledge-inspector" aria-label={copy("details")} inert={!inspectorOpen || undefined}>{content("detail")}</section>}
    </div>}
  </div>;
}
