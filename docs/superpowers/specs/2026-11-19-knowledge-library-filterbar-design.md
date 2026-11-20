# Knowledge library: FilterBar section + icon view toggle

Approved 2026-11-19. Rebuild the library's control stack on the kit `FilterBar`.

## Decisions (user-confirmed)

1. **Search ownership**: the library's search IS the kit FilterBar's built-in
   SearchBar section. `showSearch` (FilterBar's own prop) is threaded through
   `MemoryFilterBar` and `MemoryLibrary` as the enable/disable. No separate
   search row.
2. **Multi-select filters**: `MemoryFilters` values become arrays —
   `kind?: MemoryKind[]`, `status?: MemoryStatus[]`, `topic?: string[]`.
   Matching is OR within a facet, AND across facets (`filterMemories`).
3. **View toggle row**: a slim row above the grid, right-aligned, holding a
   compact `size="sm"` `MultiToggle` with options
   `[{ value: "cards", icon: "ViewGrid" }, { value: "list", icon: "ViewRows" }]`.
   Labels kept as `sr-only` spans for accessible names.

## Component changes

- `common/knowledge/model.ts` — array `MemoryFilters`; `filterMemories` uses
  `filters.X?.length && !filters.X.includes(v)` per facet.
- `MemoryFilterBar` — rewritten as a thin kit `FilterBar` wrapper: builds
  `filters[]` (kind/status/topic, option counts from records), wires
  `searchProps` to `query`/`onQueryChange` (`initialValue`, debounced
  `onSearch`, placeholder `copy("search")`), maps `FilterBarValue` ↔
  `MemoryFilters` (empty → `undefined`), `showSearch` prop, `showResultCount`
  off by default (library keeps its aria-live `.kit-knowledge-results` line),
  chain via `resolveControlChain` (`color` = controlsTone, search variant =
  chain.searchVariant). Old Selects + Clear button deleted; `onClear` prop
  deleted (FilterBar's Clear all is filters-scoped, the SearchBar clears
  itself).
- `MemoryToolbar` — search field deleted; now only the right-aligned icon
  `MultiToggle` row (`.kit-memory-view-row`). `query`/`onQueryChange` props
  dropped.
- `MemoryLibrary` — composition: `[MemoryFilterBar]` →
  `[.kit-memory-view-row MemoryToolbar]` → `[.kit-knowledge-results]` →
  grid/ScrollArea; `showSearch?: boolean` prop (default `true`) forwarded;
  `resetKey` joins arrays.
- `KnowledgeExplorer` — map props: `selectedTopic` = single-element
  `filters.topic` else undefined; `onTopicSelect` wraps into `[topic]`;
  highlight truthiness uses `.length`.
- CSS — retire `.kit-memory-controls`, `.kit-memory-search`,
  `.kit-knowledge-filters`, `.kit-memory-filter-row` (keep map-search input
  reset); add `.kit-memory-filter-bar` section (bottom hairline) and
  `.kit-memory-view-row` (flex, justify-end).
- Demo — Standalone example matches() + toolbar usage; playground "Search"
  switch → `library.showSearch`; props-table rows updated (filters shape,
  showSearch, toolbar/filterbar descriptions, a11y topic).

## Testing

filterMemories unit tests to arrays; library search test opens the collapsed
search trigger (kit copy name) then types with waitFor on the debounce;
filter flows go through Add filter → category → menuitemcheckbox → Done;
standalone toolbar test clicks the `List` radio; showSearch=false hides the
trigger. Vitest + tsc (react, demo) + build, then Playwright screenshots of
the library: search shown/hidden, both view modes, filter chips applied.
