# ActivityFeed per-item custom body — design

**Date:** 2026-11-19 · **Component:** `ActivityFeed` (React + Vue kits) · **Status:** approved

## Problem

The feed draws every row the same way: dot, actor + title, description, code
chip, timestamp. Some events deserve richer rows — a deploy with an inline
diff stat, a review request with avatar stack and action buttons. Today the
caller can't express that; the row layout is fixed by the component.

## API

```
// React
interface ActivityFeedItem { … body?: ReactNode }

// Vue
interface ActivityFeedItem { … body?: VNodeChild }
```

One optional field on the item, both kits. When it is present
(`!= null` — `undefined`/`null` fall back to the default row; anything else
renders as given), it **replaces the entire row content**: dot, title,
actor, description, code and timestamp all stop being drawn for that item.
Everything else about the row is owned by the feed, exactly as before:

- the `ol`/`li` list semantics and the header's event count;
- the dividers between rows;
- the row's surface and its affordances, which are now the template's own
  `Panel` rather than classes spelled out on the `li`: `rowVariant`
  (@default `none`), `rowTone` (@default: the feed's own `tone`, so rows
  wear the card's hue and its toned hover wash unless set apart) and
  `rowCorner` (@default `rounded` — the corner scale's xs step, since
  `SURFACE_CORNERS` has no literal `xs`), all on `padding="xs"`. On the shared `none` surface the list's
  own `divide-y` lines separate the rows; any other `rowVariant` gives
  each row a surface of its own, and the dividers — which would cut
  through it — make way for a small vertical gap (`space-y-2`, matching
  the `xs` inset). The playground exposes these as
  **Item variant** / **Item corner** / **Item tone** — the tone behind an
  *item tone follows card* toggle, since `none` is itself a tone and an
  "inherit" state needs its own switch. Rows also carry state through to
  that Panel: `item.active` becomes the Panel's `active` — the 2px inset
  selection rim on the row's hue (`borderColor ?? tone`, blue floor) plus a
  light tone-tinted fill — and `item.attention` becomes its `pulse`, the
  glow swelling inward from the row's own rim in the same hue; the Vue
  Panel ported both props to keep the feed's vocabulary whole.
  `item.attentionTone` is the Panel's own hue override handed to the row
  Panel's `borderColor` — `borderColor ?? tone` with the kit's blue as
  floor, one hue for rim and glow so a selected-and-pulsing row always
  agrees, and on bordered row variants the hairline follows it as it does
  on any Panel. The
  playground marks Ada active and Watchdog pulsing behind two toggles, with
  an **Attention tone** select (inherit plus every TrueColor) appearing
  beside the attention toggle.
- The header's count word is the caller's too. `countLabel` unset reads
  `N events` / `N event` with the noun agreeing with the count actually
  drawn; a string rides verbatim — the kit does not pluralise what it did
  not choose — so `countLabel="pod restart"` reads `2 pod restart`; `""`
  leaves the number alone and `false` drops the count span from the header
  entirely, invisible placeholder included. In Vue the prop carries an
  explicit `undefined` default: the `string | false` union compiles to
  `[String, Boolean]`, and Vue casts an absent Boolean-prop to `false`
  unless a default intervenes — which would hide the count for callers who
  never asked (the Panel's `hoverable` precedent). The playground offers a
  **count label** toggle and a **Count noun** field for all three shapes.
  Passing the item's `onClick` to
  that Panel hands the row the kit's guarded card action — cursor, hover
  wash, focus ring and (React) `role="button"`, `tabIndex` and the
  Enter/Space keyboard path — and a click on a control inside the row stays
  that control's, which the old hand-rolled `role="button"` li got wrong:
  it fired the row alongside;
- filtering, counts, skeleton and empty states — they all read item data,
  not the DOM, so custom rows keep working with them untouched.

## Implementation

**React** (`react/src/components/ActivityFeed.tsx`)
One `li` branch: the `li` is now a plain list item and its single child is
the row Panel, which wraps `rowBody(item)` in the `flex items-start gap-3`
row layout. `rowBody` early-returns `item.body` when present, so custom
rows inherit the row's surface and affordances for free.

**Vue** (`vue/src/components/ActivityFeed.vue`)
Same shape: inside each `li`, a `Panel` (`variant="none"`, the feed's own
`tone`, `corner="rounded"`, `padding="xs"`) wraps the row content, and the
item's `onClick` is handed to it as the card action. Inside,
`v-if="item.body != null"` renders `<VNodeRenderer :nodes="item.body" />`
(the kit's internal raw-VNode component, the SideMenu per-item `badge`
precedent) in place of the default dot/content/time markup. Callers build
items in setup, where `h()` and template refs produce the `VNodeChild`.
The Vue Panel's card action is click, cursor and wash only — it carries no
`role`/`tabIndex`/keyboard path, so the row does not either.

**Non-goals (YAGNI):** no feed-wide `renderItem` prop, no scoped slot, no
per-item body function. The item field is additive; a feed-wide override can
be layered on later without breaking this API.

## Tests

Both suites, mirrored:

1. an item with `body` renders the custom node and none of the default row
   parts (no dot, no `<time>`, no title);
2. an item without `body` renders exactly as before;
3. React: a `body` row with `onClick` keeps button semantics and fires the
   handler.

## Demo

A `CustomRows` example in the React kit-docs `activity-feed/examples/`,
registered on the page with the existing `?raw` code-import pattern — the
capability needs to be discoverable to be used.

## Update (same day) — loader types

Approved follow-up: `loading` grows the Table/Panel loading family.

```
loaderType?: "spinner" | "progress" | "skeleton"   // default "skeleton"
loaderProgress?: number   // the bar fill for "progress"
loadingMessage?: string   // the overlay label (Table's name, kept)
skeletonRows?: number     // pin the placeholder count; unset follows
                          // the pending page: min(max(items, 3), 6)
```

- `showSkeleton = loading && loaderType === "skeleton"`. Skeleton mode
  keeps today's rewrite (controls yield) with a richer placeholder: dot,
  title bar on the Table's width ladder, a description line on alternate
  rows, a code chip on every third, the time bar pinned right.
- `"spinner"` / `"progress"` pin a `Loader overlay` to a `relative`
  wrapper around the feed body — outside the `ScrollArea`, per Table's
  "an overlay inside a scroller scrolls away" rule. The real rows (or the
  empty state) stay beneath it behind the scrim; the overlay is `size="lg"`
  and always carries a label (`loadingMessage`, defaulting to the kit's
  "Loading"), so it is unmistakable on a dark card.
- Loading hides the card's controls in **every** mode — tag, count, link
  and filters all yield (`!loading` guards), so the card never reads as
  half-loaded regardless of which style is showing. The Load-more tail
  stays hidden for any `loading`.
- Vue mirrors all of it (its Table only has the two overlay modes; the
  feed is the three-mode citizen).
- The playground gains a Loader type select next to the `loading` toggle.
