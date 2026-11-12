# Filter bar

## Purpose

Create a reusable filter bar matching the five supplied reference states: collapsed search, expanded search, filter categories, category options, and applied filter chips with a result summary. Preserve the kit's existing visual language and compose existing controls.

## Scope and architecture

Implement the React component and its documentation playground first, where SearchBar, ExpandableButton and Menu already exist. Share framework-independent filter types and motion tokens through common where useful. A Vue port is a separate follow-up because its existing menu capabilities differ; do not introduce a second menu implementation into this feature.

FilterBar owns presentation and filter selection, not dataset filtering or fetching. Consumers supply categories, selected values and result counts. Reuse SearchBar for search behavior, Menu for popup positioning and keyboard navigation, Button for actions, and existing badge styling for removable chips. Reuse shared spring presets rather than introduce an animation dependency. Preserve unrelated working-tree changes.

## Public API

- `searchProps: SearchBarProps` forwards the existing search API unchanged, including onSearch, onClear, debounceMs, autoSearch, initialValue, shouldClear, loading and search styling.
- `filters: FilterBarFilter[]` describes categories. Each has a unique id, label, optional count and disabled flag, and options with category-local unique value, label, optional count and disabled flag. Category count defaults to option count; option counts are supplied by the caller.
- `value?: Record<string, string[]>`, `defaultValue?: Record<string, string[]>`, and `onChange?: (value: Record<string, string[]>) => void` support controlled and uncontrolled filter selection. Empty categories are omitted from emitted values.
- `filteredCount` and `totalCount` are nonnegative caller-supplied numbers. `itemLabel` defaults to localized “items”. The summary displays “{filteredCount} of {totalCount} {itemLabel}”.
- Shared size, tone and surface options follow existing kit conventions. Search-specific overrides remain in searchProps. Provide className and accessible toolbar naming.
- Localize built-in labels through the existing kit translation engine, including Filters, No filters applied, Add filter, Clear, Done, Clear all, Back and removal labels.

## Search interaction

Search starts as an accessible icon button. Activating it expands and focuses SearchBar with the existing expandable-button spring timing. Keep the input mounted so collapsing cannot reset its query, debounce or abort state. A nonempty initialValue starts expanded.

An empty search collapses when focus leaves its search region. A nonempty search stays expanded. SearchBar retains its existing Enter, Escape, clear, loading and cancellation semantics. Collapse does not dispatch a search or clear the query. Disabled search cannot expand or receive focus. Hidden input is removed from keyboard navigation and accessibility exposure. Keyboard focus remains visible.

## Filter interaction

Add filter opens the category menu aligned with its trigger. Choosing a category replaces the menu content with that category's checkbox options, a Back action and Clear/Done footer, following the screenshots. Retain Menu positioning, outside-click dismissal and keyboard behavior; adapt its content composition only where required for this same-panel drill-down.

Opening a category copies its applied values into a draft. Checkbox changes and Clear affect only this draft. Done commits that category, calls onChange once, closes the popup and returns focus to its trigger. Back, Escape and outside dismissal discard uncommitted changes. Other categories retain their selections. Disabled options remain visible and cannot change. A zero count alone does not disable an option; callers decide availability.

Render one chip per applied category, displaying its label and selected option labels. Removing a chip immediately removes that category. Activating its main label opens that category for editing. Clear all immediately removes all filter selections and emits one change, while search keeps its existing independent clear API. Hide Clear all when no filters are applied. Unknown category or option identifiers are excluded from displayed chips and normalized on the next user change, without emitting changes during render.

## Layout and motion

Use a compact bordered surface: search, divider, Filters label, empty state or chips, flexible space, Add filter, conditional Clear all, divider and result summary. Wrap cleanly at narrow widths; allow long chip labels and menus to remain within viewport bounds.

Animate search width and opacity, menu appearance and drill-down transitions, and chip insertion/removal and resulting layout shifts. Apply the kit's shared motion presets and reduced-motion rules. Do not put a focusable SearchBar inside ExpandableButton's native button; reuse its motion primitives on a sibling wrapper.

## Validation

Add behavior tests for unchanged search callbacks and debounce, expansion/focus, retained query, empty blur collapse, draft isolation, Done commit, cancellation, category editing, multiple selections, chip removal, Clear all, controlled updates, disabled states and keyboard focus restoration. Check reduced-motion styling and responsive overflow visually in the documentation playground.

Document all five reference states, a working consumer-filtered dataset, controlled usage, search API forwarding and result counts. Run relevant React tests, React typecheck and documentation build. Broaden checks only if shared code changes affect another package.

## Review

The design contains no placeholders. Draft selections apply only on Done; chip removal and Clear all apply immediately. The caller remains responsible for filtering semantics, counts and asynchronous results. Existing search behavior remains delegated to SearchBar.


## Optional part visibility

Expose `showSearch`, `showFilterLabel`, `showEmptyState`, `showClearAll`, `showResultCount`, and `showMenuCounts`, all defaulting to true. The documentation playground has matching toggles under Visible parts. Hiding the trailing result summary removes its divider as well. Hiding search keeps SearchBar mounted but hidden and inert, preserving its query and search behavior. Visibility changes do not clear applied filters or emit selection changes. Chips and Add filter remain available so filter selection always has an entry point.


## Shared appearance properties

The bar exposes the usual surface `variant`, `tone`, `corner`, `padding`, `transparency`, `glassOpacity` and `vibrancy` properties. Use the shared surface paint and padding helpers; do not force a border on variants such as none. Defaults are outlined, neutral, rounded-sm and xs padding. Glass fill and vibrancy apply to liquid-glass, matching Toolbar.

Action styling is split by role: `buttonVariant` styles Add filter (outline), `secondaryButtonVariant` styles Clear all, Back and Clear (ghost), and `applyButtonVariant` styles Done (solid). `buttonTone` defaults to color, `buttonSize` defaults to size, `buttonWeight` defaults to normal, and optional `buttonCorner` overrides existing button shapes through the shared radius tokens. `buttonDashed` defaults to true and affects only outlined Add filter buttons. Search and chip-removal buttons retain icon treatment and follow buttonTone/buttonCorner; chip removal retains its compact size.

`menuVariant`, `menuTone`, `menuCorner` and `menuPadding` configure the popup independently. `chipVariant` and `chipTone` configure applied badges. Existing color remains the default search/chip accent and the fallback button tone. Search-specific styling remains in searchProps. The playground groups these controls into the existing ControlAccordion pattern and uses color swatches for tones.
