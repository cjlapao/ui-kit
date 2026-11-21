import type { ReactNode } from "react";
import type { GridBackgroundProps } from "../GridBackground";
import type { PanelAction, PanelProps } from "../Panel";
import type { ControlSize, InputVariant, SurfacePadding, SurfaceCorner, SurfaceTone, SurfaceVariant, TrueColor } from "../../theme";
import type { MemoryFilters, MemoryKind, MemoryStatus, MemoryRecord, KnowledgeDiagnostic, KnowledgePoint, KnowledgeRelationship } from "../../../../common/knowledge/model";
export type { MemoryRecord, MemorySource, MemoryKind, MemoryStatus, MemoryFilters, MemoryTraceLink, KnowledgePoint, KnowledgeRelationship, KnowledgeDiagnostic } from "../../../../common/knowledge/model";
export type { ControlSize, InputVariant, SurfaceTone, SurfaceVariant, TrueColor } from "../../theme";
export type { SurfacePadding, SurfaceCorner } from "../../theme";

export type KnowledgeLabels = Partial<Record<"library" | "map" | "details" | "inspector" | "search" | "kind" | "status" | "topic" | "all" | "cards" | "list" | "showMap" | "showLibrary" | "empty" | "noResults" | "loading" | "selectMemory" | "sources" | "noSources" | "related" | "edit" | "pin" | "unpin" | "archive" | "retrievals" | "lastRetrieved" | "feedback" | "retrievalNote" | "fit" | "zoomIn" | "zoomOut" | "zoom" | "reset" | "topicLayout" | "projectionNote" | "relationships" | "previous" | "next" | "clear" | "ungrouped" | "selectAll" | "mapHelp" | "pinned" | "loadMore" | "loadingMore" | "loadMoreError" | "retry" | "limitReached" | `kinds.${MemoryKind}` | `statuses.${MemoryStatus}`, string>>;
/** The Panel surface the knowledge components paint. `actions` is omitted:
 * in this family the name means the consumer's `MemoryCardAction[]`, which
 * the card resolves and hands to Panel's own slot — a raw PanelAction array
 * has no place on the surface. */
export interface KnowledgeSurfaceProps extends Omit<PanelProps, "children" | "onSelect" | "actions"> { labels?: KnowledgeLabels }
/**
 * One button in a card's or the detail's action row. The consumer owns the
 * whole row: which buttons exist, their kit `Button` type (`variant`), scale
 * (`size`) and accent (`color`) — the card only binds the record in. The
 * card renders these through its Panel's `actions` slot; the detail keeps
 * them as an inline row. `label`, `pressed` and `hidden` may be functions of
 * the record, so one shared array still reads per-card state (Pin/Unpin,
 * archive omitted once archived).
 */
export interface MemoryCardAction extends Pick<
  PanelAction,
  "variant" | "color" | "size" | "weight" | "leadingIcon" | "trailingIcon" | "loading" | "disabled"
> {
  /** Stable React key. */
  id: string;
  label: ReactNode | ((memory: MemoryRecord) => ReactNode);
  /** Toggle action state — renders `aria-pressed` on the button. */
  pressed?: boolean | ((memory: MemoryRecord) => boolean);
  /** Drop this action for this record. @default false */
  hidden?: boolean | ((memory: MemoryRecord) => boolean);
  /** Receives the card's record; the component never fires it when disabled. */
  onClick?: (memory: MemoryRecord) => void;
}
export interface MemoryActions {
  /** The card/detail action buttons — see `MemoryCardAction`.
   * Omitted or empty, no action row renders at all. */
  actions?: MemoryCardAction[];
}
export interface MemorySelection {
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectionChange?: (id: string | null) => void;
}
/** Shared control chrome for the action rows and map controls: one size and
 * one tone, `"auto"` following the hosting card's accent (the kit default
 * blue on an untinted card). */
export interface KnowledgeControlChromeProps {
  /** @default "xs" for action rows, "sm" for map controls */
  size?: ControlSize;
  /** @default "auto" */
  controlsTone?: TrueColor | "auto";
}
export interface MemoryCardProps extends KnowledgeSurfaceProps, MemoryActions, KnowledgeControlChromeProps {
  memory: MemoryRecord;
  layout?: "compact" | "expanded";
  selected?: boolean;
  highlighted?: boolean;
  onSelect?: (memory: MemoryRecord) => void;
}
export interface MemoryDetailProps extends KnowledgeSurfaceProps, MemoryActions, KnowledgeControlChromeProps {
  memory?: MemoryRecord | null;
  relatedMemories?: readonly MemoryRecord[];
  onRelatedSelect?: (id: string) => void;
  renderContent?: (memory: MemoryRecord) => ReactNode;
  /** Replaces the default body template inside the scroll area — the pinned
   * title and responsive padding remain the shell's job. */
  renderBody?: (memory: MemoryRecord) => ReactNode;
  /** Additional content at the end of the scrollable body. */
  bodyFooter?: ReactNode;
  /** Pinned eyebrow label above the scrollable body, as NetworkGraph's
   * inspector carries one — the explorer fills it from inspectorTitle. */
  title?: ReactNode;
  /** @default false — stretch the scroll body to a host-given height instead
   * of the standalone 26rem cap, the companion of KnowledgeMap's fullHeight:
   * pass it on both sides of a stretched two-column row so the detail card
   * fills the map's height and scrolls inside its own card, as the explorer's
   * docked inspector does. Without a defined-height host it stays content-sized. */
  fullHeight?: boolean;
}
/** Scroll and incremental loading shared by the library body and the explorer's library region. */
export interface MemoryScrollProps {
  /**
   * Caps the results body and lets it scroll — a px number or any CSS length.
   * Unset, the results grow to their full height and the Load-more button is
   * the only tail; set, the cards (and the empty state) scroll inside the
   * panel while the search, filters and result count stay pinned above.
   */
  maxHeight?: number | string;
  hasMore?: boolean;
  /** Append the next page of records before this promise resolves. */
  onLoadMore?: () => void | Promise<void>;
  /**
   * How the next page is requested. `"scroll"` (default) is infinite — the
   * kit's shared `useInfiniteScroll` watch, with a sentinel at the results'
   * end observed inside the capped `ScrollArea` — and needs `maxHeight` to
   * have a scroller to watch; without one it degrades to the button.
   * `"button"` is the explicit Load-more tail.
   * @default "scroll"
   */
  loadMode?: "scroll" | "button";
  /** How far below the fold the sentinel is watched, in px. @default 320 */
  rootMargin?: number;
  /** Keep fetching until at least this many rows are loaded. @default 0 */
  minItems?: number;
  /** Change when the underlying dataset is replaced wholesale (a refetch). */
  scrollResetKey?: string | number;
  /**
   * Caps how many records the library presents. Once the visible set reaches
   * it the paging tail stops — no sentinel watch, no Load-more button — and
   * a quiet note says at most {count} are shown. The consumer still owns the
   * dataset; this only bounds presentation.
   */
  limit?: number;
  /** Fires when a page fetch rejects, alongside the inline retry state. */
  onError?: (error: unknown) => void;
  /** @default "Load more" */
  loadMoreLabel?: string;
}
/** The appearance bundle shared by the library's control parts: the filter
 * bar (search included) and the view toggle share one size and one
 * tone/variant chain — `"auto"` falls back to `controlsTone` (or the card's
 * own variant), then to the card's accent, with the kit default blue as the
 * floor. Same layering ActivityFeed uses with `controlsTone` and
 * `filterTone`. */
export interface MemoryControlsProps {
  /** The shared control size, so the filter bar and the view toggle line up. @default "sm" */
  size?: ControlSize;
  /**
   * The tone the filter bar's chips and buttons wear. `"auto"` (default)
   * follows the library's own tone, falling back to the kit's default blue
   * on an untinted card — the same floor Spinner and Progress sit on; name a
   * tone here to pick one for them all at once.
   * @default "auto"
   */
  controlsTone?: TrueColor | "auto";
  /** @default "auto" — accent for the filter bar's search field */
  searchTone?: TrueColor | "auto";
  /** @default "auto" — a valid Input surface from the card's variant, else `"flat"` */
  searchVariant?: InputVariant | "auto";
  /** @default "auto" — same as `controlsTone` */
  viewTone?: TrueColor | "auto";
  /** @default "auto" — the card's own variant, so the track reads as a slice of the panel */
  viewVariant?: SurfaceVariant | "auto";
}
export interface MemoryLibraryProps extends Omit<KnowledgeSurfaceProps, "onError">, MemorySelection, MemoryActions, MemoryScrollProps, MemoryControlsProps {
  memories: readonly MemoryRecord[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  filters?: MemoryFilters;
  defaultFilters?: MemoryFilters;
  onFiltersChange?: (filters: MemoryFilters) => void;
  /** Disable local search/filtering when the consumer supplies server-filtered records. */
  remote?: boolean;
  /** Show the filter bar's search section. @default true */
  showSearch?: boolean;
  /** Show the whole filter section — the SearchBar and the facet menus.
   * Off, the library starts at the view row; the query and filters survive.
   * @default true */
  showFilterBar?: boolean;
  view?: "cards" | "list";
  defaultView?: "cards" | "list";
  onViewChange?: (view: "cards" | "list") => void;
  /** Adds a third button — the kit's Path glyph — to the view toggle: a way
   * out of the library and into the map view, wired to whatever the host's
   * "show the map" action is (KnowledgeExplorer flips the main view). Omit
   * for a library with no map alongside — the toggle then keeps just its
   * cards/list pair. */
  onShowMap?: () => void;
  /** @default false — fill a host-given height: the filter bar and view row
   * keep their size, the results stretch into the rest of the card and
   * scroll there instead of overflowing a clipped panel — the standalone
   * companion of KnowledgeMap's and MemoryDetail's fullHeight, for a
   * stretched row beside them. Scroll-mode paging watches its sentinel
   * inside the scrolling results box; a `maxHeight` still wins when both
   * are given. Without a defined-height host it stays content-sized. */
  fullHeight?: boolean;
  groupByTopic?: boolean;
  highlightedIds?: readonly string[];
  renderMemory?: (memory: MemoryRecord, state: { selected: boolean; highlighted: boolean; select: () => void }) => ReactNode;
  emptyState?: ReactNode;
}
/** The map's camera: the pan offset and zoom the canvas draws through. */
export interface KnowledgeMapViewport { x: number; y: number; zoom: number }
export interface KnowledgeMapProps extends KnowledgeSurfaceProps, MemorySelection, KnowledgeControlChromeProps {
  memories: readonly MemoryRecord[];
  /** Omit for illustrative topic placement; supply coordinates for a real projection. */
  points?: readonly KnowledgePoint[];
  relationships?: readonly KnowledgeRelationship[];
  highlightedIds?: readonly string[];
  /**
   * The enabled topic set — the legend's checkbox state. `null` or
   * undefined means everything is on; an explicit array enables exactly
   * those clusters, and `[]` hides them all. Unselected clusters dim on
   * the canvas, and the legend writes back through `onTopicSelect`.
   */
  selectedTopic?: readonly string[] | null;
  /** Enables the topic legend (NetworkGraph's communities legend); receives the new enabled set. */
  onTopicSelect?: (topics: string[]) => void;
  /**
   * Where the topic legend sits — NetworkGraph's own grammar: `"auto"`
   * places it to the right of the canvas at ≥600px and below otherwise.
   * A legend taller than its column scrolls in the kit's ScrollArea, and it
   * always finishes clear of the camera pill's bottom-right corner.
   * @default "auto"
   */
  legendPosition?: "auto" | "right" | "bottom";
  /**
   * Renders the topic legend at all. True by default — the legend appears
   * whenever `onTopicSelect` is passed; hiding it leaves any enabled set
   * filtering the canvas, so a consumer that hides it owns its own control.
   * @default true
   */
  showLegend?: boolean;
  /**
   * Draws the hairline between the map title and the canvas. Off by
   * default — the elevated panel's own edge already separates the regions.
   * @default false
   */
  showTitleDivider?: boolean;
  height?: number;
  /**
   * Fill the height of a parent with a defined height (overrides `height`).
   * The panel stretches with the parent and the canvas fills it, measured
   * live, the NetworkGraph fullHeight contract.
   * @default false
   */
  fullHeight?: boolean;
  glow?: boolean;
  /**
   * The camera pill at the card's bottom-right corner — fit, the zoom steps,
   * the percent readout and reset, the NetworkGraph cluster's own approach.
   * It anchors to the map layout rather than the canvas box, so it holds the
   * true corner even with the legend docked in the right column — the legend
   * ends above the zone the pill owns. With `onShowLibrary` it also carries
   * the library button at the end.
   * @default true
   */
  showControls?: boolean;
  /** Appends a ViewRows button to the camera pill: a way back from the map
   * into the library view, wired to whatever the host's "show the library"
   * action is (KnowledgeExplorer flips the main view). Omit for a map
   * standing alone — the pill keeps just its camera controls. */
  onShowLibrary?: () => void;
  /**
   * Preview-highlight the point under the pointer — a soft cluster-tone
   * ring, its title label and full opacity even while the topic filter dims
   * the rest, the graph's own hoverHighlight. Purely visual: it never
   * selects, fires no callbacks or touches the inspector.
   * @default true
   */
  hoverHighlight?: boolean;
  /**
   * When a memory is selected — or the selected point falls out of sight
   * while the explorer's inspector dock animates — ease the canvas so the
   * point comes into view, the graph's own autoRevealSelected: centered
   * when autoCenterSelected (default), otherwise by the shortest pan.
   * Honors prefers-reduced-motion.
   * @default true
   */
  autoRevealSelected?: boolean;
  /**
   * Have the reveal center on the selected point instead of panning by the
   * minimum needed to show it, NetworkGraph's own autoCenterSelected. Only
   * applies together with autoRevealSelected.
   * @default true
   */
  autoCenterSelected?: boolean;
  /**
   * Additionally animate a fit of the whole scene into the shrunken canvas
   * box when the selection opens the inspector. Changes the zoom level, so
   * it is opt-in; the reveal choreography still runs afterwards.
   * @default false
   */
  autoFitOnInspector?: boolean;
  /**
   * Decorative lattice behind the canvas, NetworkGraph's own: a blue dot
   * pattern by default. Set false to hide it; pass an object to override the
   * GridBackground settings — `grid.lineColor` overrides `gridTone`.
   */
  grid?: boolean | Pick<GridBackgroundProps, "pattern" | "size" | "lineColor" | "dotSize" | "opacity" | "fade" | "fadeStart">;
  /** Theme color of the grid lattice. @default "blue" */
  gridTone?: TrueColor;
  onDiagnostics?: (diagnostics: readonly KnowledgeDiagnostic[]) => void;
  /** Notified with the camera on every pan/zoom commit, NetworkGraph's viewport callback. */
  onViewportChange?: (viewport: KnowledgeMapViewport) => void;
}
export type KnowledgeRegion = "library" | "map" | "detail";
/** Which region owns the main column. The inspector never competes for it —
 * the choice is always between the map and the knowledge library. */
export type KnowledgeExplorerView = Exclude<KnowledgeRegion, "detail">;
/** Geometry and control chrome for the explorer's map view. Its panel surface
 * is the shared one — the explorer's surface props paint whichever view is
 * showing, and the inspector follows it while its own chrome stays `"auto"`. */
export interface KnowledgeMapSurfaceProps {
  height?: number;
  /** @default false — fill a defined-height parent, overriding `height` (NetworkGraph's fullHeight) */
  fullHeight?: boolean;
  glow?: boolean;
  /** @default true — the camera pill at the card's bottom-right corner */
  showControls?: boolean;
  /** @default true — the graph's passive hover preview on points */
  hoverHighlight?: boolean;
  /** @default true — the animated pan that brings a selected point into view */
  autoRevealSelected?: boolean;
  /** @default true — the reveal centers on the point instead of panning by the minimum */
  autoCenterSelected?: boolean;
  /** @default false — animated fit into the shrunken canvas box when the inspector opens */
  autoFitOnInspector?: boolean;
  /** @default "auto" — the topic legend sits right at ≥600px, below otherwise */
  legendPosition?: "auto" | "right" | "bottom";
  /**
   * Renders the topic legend at all. True by default — the legend appears
   * whenever `onTopicSelect` is passed; hiding it leaves any enabled set
   * filtering the canvas, so a consumer that hides it owns its own control.
   * @default true
   */
  showLegend?: boolean;
  /**
   * Draws the hairline between the map title and the canvas. Off by
   * default — the elevated panel's own edge already separates the regions.
   * @default false
   */
  showTitleDivider?: boolean;
  /**
   * Decorative lattice behind the canvas, NetworkGraph's own: a blue dot
   * pattern by default. Set false to hide it; pass an object to override the
   * GridBackground settings — `grid.lineColor` overrides `gridTone`.
   */
  grid?: boolean | Pick<GridBackgroundProps, "pattern" | "size" | "lineColor" | "dotSize" | "opacity" | "fade" | "fadeStart">;
  /** Theme color of the grid lattice. @default "blue" */
  gridTone?: TrueColor;
  /** @default "auto" — the map's control chain tone */
  controlsTone?: TrueColor | "auto";
  /** @default "sm" */
  size?: ControlSize;
}
export interface KnowledgeExplorerContext {
  selectedMemory: MemoryRecord | null;
  selectedId: string | null;
  selectMemory: (id: string | null) => void;
  query: string;
  setQuery: (query: string) => void;
  filters: MemoryFilters;
  setFilters: (filters: MemoryFilters) => void;
}
export interface KnowledgeExplorerProps extends KnowledgeSurfaceProps, MemorySelection, MemoryActions {
  memories: readonly MemoryRecord[];
  points?: readonly KnowledgePoint[];
  relationships?: readonly KnowledgeRelationship[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  filters?: MemoryFilters;
  defaultFilters?: MemoryFilters;
  onFiltersChange?: (filters: MemoryFilters) => void;
  /**
   * The main column: exactly one view at a time. The parts switch in place —
   * the library's Show-map button opens the map, the map's Show library pill
   * comes back — and both hide themselves when only one view is enabled.
   * @default "library"
   */
  view?: KnowledgeExplorerView;
  defaultView?: KnowledgeExplorerView;
  onViewChange?: (view: KnowledgeExplorerView) => void;
  /**
   * Reveal the inspector column — the memory detail —
   * on the right of whichever view is showing. Same approach as NetworkGraph's
   * inspector: it appears only while a memory is selected, docks beside the
   * view while the component is at least the main view's floor wide, stacks
   * under it below that width, and matches the view panel's height while docked.
   * @default true
   */
  inspector?: boolean;
  /**
   * Fill the height of a parent with a defined height, the NetworkGraph
   * fullHeight contract: the view panel stretches to the parent — the
   * library results scroll inside the card, the map canvas fills it — and
   * the docked inspector keeps the same height.
   * @default false
   */
  fullHeight?: boolean;
  /** Inspector column width in CSS pixels. Never moves the dock/stack breakpoint. @default 340 */
  inspectorWidth?: number;
  /** The main view column's floor — the single width the dock/stack switch
   * measures against: the inspector docks while the component is at least
   * this wide, and moves under the view below it. The inspector's own column
   * width plays no part. @default 360 */
  inspectorMinMainWidth?: number;
  /** Escape hatch: stack while narrower than this many px. Overrides the main floor. */
  inspectorStackBelow?: number;
  /** Eyebrow above the selected memory's title inside the inspector card,
   * mirroring NetworkGraph's `inspectorTitle`. @default copy("inspector") — "Inspector" */
  inspectorTitle?: ReactNode;
  /** Inspector Panel tone; `"auto"` follows the main panel's. @default "auto" */
  inspectorTone?: SurfaceTone | "auto";
  /** Inspector Panel variant; `"auto"` follows the main panel's. @default "auto" */
  inspectorVariant?: SurfaceVariant | "auto";
  /** Inspector Panel padding; `"auto"` uses the Panel default. @default "auto" */
  inspectorPadding?: SurfacePadding | "auto";
  /** Inspector Panel corner radius; `"auto"` follows the main panel's. @default "auto" */
  inspectorCorner?: SurfaceCorner | "auto";
  /** Scroll, paging and toolbar options for the explorer's library view. */
  library?: MemoryScrollProps & MemoryControlsProps & Pick<MemoryLibraryProps, "groupByTopic" | "renderMemory" | "emptyState" | "showSearch" | "showFilterBar">;
  /** Surface and geometry for the explorer's map view. */
  map?: KnowledgeMapSurfaceProps;
  regions?: Partial<Record<KnowledgeRegion, boolean>>;
  /** Replace an enabled region. Library and map are replaced whole; the
   * `detail` override is narrower — it owns only the inspector's body,
   * rendered inside the MemoryDetail shell, so the panel, its pinned title
   * and the scroll area stay the shell's job. The custom body carries no
   * padding of its own; the shell's uniform inset wraps it. */
  renderRegion?: Partial<Record<KnowledgeRegion, (context: KnowledgeExplorerContext) => ReactNode>>;
}
