# ActivityFeed — sub-items with a collapsible disclosure (InfoRow animation)

Date: 2026-11-24
Components: `react/src/components/ActivityFeed.tsx`, `vue/src/components/ActivityFeed.vue` +
`vue/src/components/internal/ActivityFeedRow.vue` (dual kit, parity required)

## Problem

A feed row sometimes aggregates events that deserve their own lines — a deploy that
expanded into per-service rows, an audit entry with the individual actions behind it.
`ActivityFeedItem` has no way to say "this row carries children", and no way to fold
them away: the feed is a flat list of Panels, every row always fully drawn.

The kit already solved the *how* in `InfoRow`: a disclosure whose body reveals with the
canonical grid-rows gesture (`grid-template-rows: 0fr → 1fr` + opacity, 300ms
`ease-in-out`, `motion-reduce` opt-out, `inert` while collapsed, rotating `ArrowDown`
chevron). This feature gives `ActivityFeed` the same grammar, adapted to the fact that
feed rows are rendered from **data** inside one component and that a row can already
carry a card action (`item.onClick` via the row `Panel`).

## Requested behavior

From the request, as clarified in review:

- Each item can carry `subItems`. When present, the row grows a disclosure; clicking
  it reveals the sub-items under the main row line, animated exactly like InfoRow's.
- Each sub-item is either **the kit's standard sub-row** (dot + actor/title +
  description + code chip + timestamp, the feed's own template) or **a custom node**
  (`body`) — the same "type one or the custom one" split top-level rows have today.
- One level of nesting. Sub-items do not themselves disclose.

## Decisions taken in review

- **Hybrid toggle.** Rows can already be clickable (`item.onClick` is the row Panel's
  card action). So: the chevron always renders when `subItems` is non-empty and always
  toggles; **without** `item.onClick` the whole row is the toggle (InfoRow's model —
  the toggle is simply the row Panel's card action); **with** `item.onClick` the row
  keeps its action untouched and only the chevron — a real `<button>` — toggles. No
  click ever does both jobs.
- **Per-item, InfoRow-style state.** `defaultExpanded` / `expanded` / `onToggle` live
  on the *item* (rows are data, not components); the feed holds the uncontrolled
  open-set keyed by `item.id`. Rejected: a feed-level `expandedItemIds` array — two
  sources of truth for one concept while per-item is the InfoRow parity callers already
  know.
- **Inline disclosure, cloned gesture (approach A).** The grid markup is InfoRow's,
  class for class, inside a new `FeedRow` subcomponent. Rejected for now: extracting a
  shared internal `DisclosureRegion` used by InfoRow + CollapsiblePanel + ActivityFeed
  (regression risk on two green suites for a ~15-line shared wrapper; the inner content
  classes differ per component anyway). Re-visit as its own refactor once a third
  consumer has settled. Rejected outright: rendering sub-items through `InfoRow`
  (label/value/copy grammar, not the feed's dot/title/timestamp grammar).
- **Sub-items are read-only context rows.** No `onClick`, no `category`, no filter
  participation, no `active`/`attention` — the `body` escape hatch covers anything
  interactive (and the region's stopPropagation guard already keeps nested controls
  out of the toggle). Header count and filters stay top-level-only.
- **Kit-native activation.** The row toggle is handed to the row `Panel` as its
  `onClick` — so cursor, toned hover wash, focus ring, `role`/`tabIndex`/Enter/Space
  and the descendant-click guard come from the Panel API, not hand-rolled, which is
  the row's standing philosophy.

## Design

### API — React

```ts
/** One row nested under an item, revealed by the row's disclosure. */
export interface ActivityFeedSubItem {
  /** What happened, in one line — the standard sub-row's title. */
  title?: string;
  /** Supporting copy. */
  description?: string;
  /** A monospaced reference — same chip as the main row. */
  code?: string;
  /** Who did it. */
  actor?: string;
  /** Pre-formatted ("3m ago", "09:12"); optional — a sub-line is context, not a clock. */
  timestamp?: string;
  /** Sub-row dot tone. Unset follows the parent item's `tone`, then the card's. */
  tone?: TrueColor;
  /** Entries this sub-row aggregates — the same ×n pill grammar as the main row. */
  count?: number;
  /**
   * Replaces the sub-row's entire content — the same escape hatch the top-level
   * `body` is. Set and the fields above stop being drawn; the node renders inside
   * the region at the title's edge. `undefined` or `null` draws the standard row.
   */
  body?: ReactNode;
}

// on ActivityFeedItem:
/** Rows nested under this one; the disclosure exists iff non-empty. */
subItems?: ActivityFeedSubItem[];
/** Initial open state for uncontrolled use. @default false */
defaultExpanded?: boolean;
/** Controlled open state. Pair with `onToggle`. */
expanded?: boolean;
/** Called with the next open state whenever the disclosure toggles. */
onToggle?: (expanded: boolean) => void;
```

No `ActivityFeedProps` additions: the state vocabulary rides the items, as
`onClick`/`active`/`attention` already do. `ActivityFeedSubItem` is exported from the
package index alongside `ActivityFeedItem`.

### API — Vue

Same item interface minus callbacks (functions-in-data don't cross the template
boundary):

```ts
export interface ActivityFeedSubItem {
  title?: string;
  description?: string;
  code?: string;
  actor?: string;
  timestamp?: string;
  tone?: TrueColor;
  count?: number;
  body?: VNodeChild;
}

// on ActivityFeedItem: subItems?, defaultExpanded?, expanded?
// new emit: (event: "toggle", id: string, expanded: boolean): void
```

The app controls a row by setting `item.expanded` and handling `@toggle="onToggle"`
(`(id, expanded)`). `item.onClick` stays as today.

### Structure (React) — `FeedRow` subcomponent in `ActivityFeed.tsx`

One row component per item (it owns `useId` and the toggle wiring). A row without
`subItems` renders **exactly today's tree** — no chevron, no region, no new tab stops.

```
li
└─ Panel  rowVariant / rowTone ?? tone / rowCorner / padding="xs"
          active / pulse / borderColor (unchanged)
          onClick = item.onClick ?? (hasSubs ? toggle : undefined)   ← the hybrid
          aria-expanded + aria-controls when the ROW is the toggle
   ├─ div  id=headerId  "flex items-start gap-3"
   │    rowBody(item)                    ← today's template or item.body, unchanged
   │    {hasSubs && chevron}             ← after the timestamp
   └─ {hasSubs &&
      div  "grid cursor-auto transition-[grid-template-rows,opacity] duration-300
            ease-in-out motion-reduce:transition-none"  + opacity-0/100
           + inline { gridTemplateRows: open ? "1fr" : "0fr" }
           + onClick/onKeyDown stopPropagation (while the row is the toggle)
        div  id=contentId  role="region"  aria-labelledby=headerId
             aria-hidden when closed  inert when closed (React-18-typed spread cast)
             "min-h-0 overflow-hidden"
          div  "pl-5 flex flex-col gap-1.5"          ← dot (size-2) + gap-3 = 20px,
             sub.body ?? subRow(sub) per sub-item      the title's leading edge
```

- **The gesture is InfoRow's markup verbatim** (grid `0fr→1fr` + opacity, never
  `hidden`, `inert` while collapsed so the region is unfocusable and unannounced but
  still animatable). Ids from `useId()` per `FeedRow` — never hardcoded.
- **`subRow(sub)` reuses `rowBody`'s renderer**: dot (`sub.tone ?? item.tone ??` card
  accent ladder), `actor` bold + `title`, `×count` Pill (`count > 1`), `description`,
  `code` chip, `timestamp` (`<time>` rendered only when present). Standard sub-rows are
  the feed's own row grammar, one indent level in, without the row Panel's chrome —
  they're disclosure content, not top-level rows.
- **Custom-body sub-items** render the node as given, inside the same indented column,
  so custom and standard sub-rows share one left edge.
- **Chevron** (both modes): muted `ArrowDown` at `sm`, `flex shrink-0 items-center
  transition-transform duration-300`, `rotate-0`/`rotate-180` — InfoRow's classes.
  - Row-is-the-toggle: an `aria-hidden` **span** (the Panel root carries
    `aria-expanded`/`aria-controls`; a span is not a control, so the Panel's
    descendant guard keeps its click bubbling to the card action).
  - Row-has-`onClick`: a **`<button type="button">`** with `aria-label` from the
    catalog, `aria-expanded`, `aria-controls`, and `onClick` that `stopPropagation`s
    and toggles (Panel's descendant guard already keeps it off the row action; the
    explicit stop keeps it off any caller wrapper too).
- **Keyboard**: nothing to hand-roll while the row is the toggle — the Panel's card
  keydown (Enter/Space, self-target guarded) activates the card action, which *is* the
  toggle. The chevron button is natively keyboard-operable.
- **Region clicks never fold the row**: while the row is the toggle, the grid wrapper
  stops click and keydown propagation (InfoRow's body rule — reading/selecting
  sub-item content is not an activation). When the row is not the toggle the wrapper
  stops nothing (there is nothing to misfire) — but it still `cursor-auto`s the
  disclosure pointer away.

### State (React)

Uncontrolled open-set in `ActivityFeed`:

```ts
const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
// per row: const isControlled = typeof item.expanded === "boolean";
//         const open = isControlled ? item.expanded : (openMap[item.id] ?? item.defaultExpanded ?? false);
// toggle: if (!isControlled) setOpenMap(m => ({ ...m, [item.id]: !open })); item.onToggle?.(!open);
```

`defaultExpanded` seeds only while the id is absent from the set, so a row a caller
never touched keeps honouring it even after load-more appends it. Ids are the feed's
existing React key, so the set survives filter switches (hiding a row keeps its open
state; filtering it out hides its sub-rows with it, since they render inside it).

### Vue mirror (`ActivityFeed.vue` + `internal/ActivityFeedRow.vue`)

The row grows large enough to warrant the `InfoRowContent.vue` precedent: an internal
SFC holding the row template, driven by a view object of resolved classes/ids (all
derivation stays in `ActivityFeed.vue`'s script), emitting `toggle`. The Vue Panel's
card action is click-only (as everywhere in this kit), so the row-is-the-toggle mode is
`onClick` on the row Panel; the chevron button carries the same aria pair as in React
(a native `<button>`, so no `tabindex` to hand-manage). Ids from Vue 3.5 `useId()`. Body nodes through `VNodeRenderer`, like
`item.body` today. Collapsed region `inert` via the same attrs-spread pattern as
`InfoRow.vue`.

### i18n

New `activityfeed` namespace in `common/i18n/builtIn/{en,de,es,fr,pt}.ts` (+ the
source-components header comment in `en.ts`):

| key | en |
|---|---|
| `kit.activityfeed.showSubitems` | "Show sub-items" |
| `kit.activityfeed.hideSubitems` | "Hide sub-items" |

Used only by the chevron **button** (the row-as-toggle case is named by the row
itself). The other locales get proper translations, not English passthrough; the
catalog-consistency test polices parity. No other new strings: the region is labelled
by the main row, the chevron span is `aria-hidden`.

### States that must not move

- **Skeleton / loading / empty**: unchanged. The skeleton draws its own placeholder
  rows (sub-structure is not skeletoned); spinner/progress overlays sit over whatever
  is drawn, disclosure included.
- **`maxHeight` / infinite scroll**: the region animates inside the `ScrollArea`; the
  sentinel watches the whole body as today.
- **`rowVariant` off `none`**: region lives inside the row's Panel either way; the
  list's dividers-vs-gap rule is untouched.
- **`active` / `attention` / `attentionTone`**: orthogonal, as today.

### Documentation — react demo only (Vue has no doc site)

- **`ActivityFeedPlayground`**: a **sub-items** toggle in the Parts group — on, two of
  the five items gain sub-items (one all-standard, one with a custom-body sub-row, so
  both flavors show), and a nested **expanded** toggle that feeds the controlled
  `expanded` + `onToggle` path so the controlled flow is playable. Playground footnote
  gains a disclosure sentence.
- **New example card** `examples/SubItems.tsx`: a deploy event expanding into
  per-service standard sub-rows plus one custom-body sub-row (the incident-progress
  idiom from `CustomRows.tsx`), wired into `ActivityFeedPage` with `?raw` code.
- **`ActivityFeedPage` API paragraph**: `subItems` on the item shape and the
  `defaultExpanded` / `expanded` / `onToggle` vocabulary, the hybrid toggle stated
  once ("with `onClick` the row keeps its action and the chevron toggles"), and the
  read-only sub-item contract.

## Testing

`react/src/components/ActivityFeed.test.tsx` (new describe) and
`vue/src/components/ActivityFeed.test.ts` mirroring it:

- **Standard sub-row**: all fields render (actor/title, description, code chip,
  `×count` pill at >1, `<time>` only when `timestamp`); dot tone resolves
  sub → parent → card; custom `body` sub renders the node and suppresses the fields.
- **Disclosure presence**: no chevron/region when `subItems` is absent or empty;
  rows without sub-items keep today's exact tree (no extra tab stops).
- **Row-is-the-toggle** (no `onClick`): row Panel carries `aria-expanded`/
  `aria-controls`; click anywhere and Enter/Space toggle; `onToggle` called with the
  next state; click on sub-row content does **not** fold; collapsed region is `inert`
  + `aria-hidden` + grid classes (`transition-[grid-template-rows,opacity]`,
  `motion-reduce:transition-none`, inline `0fr`), never `hidden`; chevron `rotate-180`
  when open.
- **Chevron-button mode** (`onClick` present): row click calls `onClick`, not the
  toggle; chevron `aria-label` localized, `aria-expanded` on the button; chevron click
  toggles without firing `onClick`.
- **State**: `defaultExpanded` starts open (even for rows appended after mount);
  controlled `expanded` ignores internal state and only calls `onToggle` / emits
  `toggle(id, expanded)`; uncontrolled open state survives a filter switch.
- **Filtering**: parent filtered out hides its sub-rows; sub-items never match a
  filter (no `category` on the type).
- Existing suites stay green (skeleton, empty, infinite, custom rows untouched).

## Rejected alternatives

- **Shared internal `DisclosureRegion` now** — rewires InfoRow + CollapsiblePanel
  internals and their green suites for a thin wrapper whose inner classes differ per
  component; a fine later extraction once this third consumer has settled.
- **Sub-items via `InfoRow`** — label/value/copy/truncation grammar against the feed's
  dot/title/timestamp grammar, plus a copy button nested in a disclosure toggle: the
  exact interaction pile InfoRow needed guards to escape.
- **Whole-row toggle always (both handlers fire)** — two intentions behind one click;
  rejected in favour of the hybrid.
- **Feed-level `expandedItemIds` + `onExpandedChange`** — a second, feed-wide source of
  truth for what InfoRow models per row; the per-item pair covers the controlled case.
- **Recursive sub-items** — one level, decided; widening later adds indent scales and
  state keys without breaking today's data shape.
- **`children` as the sub-items slot (React)** — `children` belongs to the spread
  attrs on the root; same reason InfoRow took a `body` prop.
