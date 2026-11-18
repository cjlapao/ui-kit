# SideMenu search scope — design

**Date:** 2026-11-18 · **Component:** `SideMenu` (React kit) · **Status:** approved

## Problem

The menu search is recursive and has only ever been recursive. `matchesSubtree`
walks `children`, so one deep match drags its whole ancestor chain on screen
(`SideMenu.tsx:1218`). For a menu whose top level is the real vocabulary —
Dashboard, Reports, Settings — and whose children are instance names —
`S31: workspace-pod-7`, one session per row — that means typing a workspace
name floods the navigation with every parent it hangs under.

Apps want to say *search the navigation, not the contents of the navigation*.
Today they cannot: they would have to own the filtering, and `searchValue` plus
their own `items` is the only lever, which loses the built-in empty state, the
auto-expand and the description matching.

## API

```ts
export type SideMenuSearchScope = "all" | "top";

searchScope?: SideMenuSearchScope;   // default "all"
```

One optional prop, declared beside the rest of the search props
(`SideMenu.tsx:424`), and one exported union type — the same shape
`SideMenuLoaderType` and `SideMenuItemType` already use, so a demo playground
or an app can type its own state without spelling the literals.

- `"all"` — every depth is searched; a nested match keeps its parents visible.
  This is exactly today's behaviour, and it stays the default, so no existing
  caller changes.
- `"top"` — only the rows at depth 0 are searched.

The prop is inert without `search`, like `searchValue` and `searchPlaceholder`.

## Semantics

**Depth 0 is a link in the `items` array**, including one that carries a
`groupName`. A `group` entry is a header, not a level of nesting; only
`children` adds depth. This is the one sentence the whole feature rests on, so
it is stated here, in the prop's JSDoc, and in the test names.

**A matched row renders with its full child list.** Scope decides which rows a
query may *match*; it does not decide which rows a matched row *shows*. So in
`top` mode a hit on `Reports` renders `Reports` and every child it has, at every
depth, and the user can still click through into one. Search stops being a
subtree filter and becomes a top-level filter — which is what was asked for.

Consequence, intended: in `top` mode a query that matches only a deep child
yields no visible links, so `No results for "…"` shows. That is the honest
signal — a scope that hides the match but leaves the parent standing would look
like a broken search. `hasVisibleLink` already derives from `visibleItems`, so
this needs no extra wiring.

**Everything else is untouched:** the match rule itself (case-insensitive
substring over `label` and `description`), guards, the module-view veto,
controlled `searchValue`, `onSearchChange`, the rail's collapse (the field is
hidden while collapsed), and the `No results` copy. CTA cards are in that list
by the same argument: `visibleCtas` filters on `passesGuard` alone and has never
consulted the query, so `searchScope` has nothing to say about them.

## Implementation

Two forks, both keyed on one derived boolean — `const searchTopOnly =
searchScope === "top"` — so the filter pass and the render pass cannot drift
out of agreement about what `top` means:

1. `matchesItem` and `matchesSubtree` stay as written. A selector chooses
   between them — `top ? matchesItem : matchesSubtree` — and `visibleItems`
   calls the selector in **both** of its passes: the `groupsWithVisibleLinks`
   sweep and the filter itself (`SideMenu.tsx:1260-1285`). Group headers and
   standalone dividers therefore follow for free; a group holding only deep
   matches disappears in `top` mode, which is the point of the mode.
2. `renderLinkRow`'s `visibleChildren` (`SideMenu.tsx:1428`) stops filtering by
   subtree in `top` mode and takes `link.children` whole. The existing
   `showChildren = … && (searchActive || openSubmenus.has(slug))` already
   auto-expands a match, and paging is already suppressed while searching
   (`paged = !searchActive`), so the full child list is what renders — no
   third change is needed there.

`openSubmenus` is not written to, so clearing the query restores the tree the
user had opened.

No new state, no new UI, no new `kit.sidemenu.*` keys, no theme or safelist
touch. `SideMenu.vue` has no search prop at all, so the Vue kit is out of scope
rather than left behind.

## Tests

In the existing `SideMenu — search` block (`SideMenu.test.tsx:492`), reusing the
`NESTED` fixture the recursive case already uses:

- `top` hides a match that exists only at depth ≥ 1 — the inverse of the
  existing *"reveals nested matches by expanding their parents"*, and the two
  read as a pair.
- a `top` match renders its full child list (query the parent's own label;
  every child is present).
- omitting `searchScope` keeps the recursive behaviour — the default is a
  promise, so it gets a test.
- group headers track top-level matches only: a group whose links match
  exclusively in their children is dropped, together with its divider.

## Docs and demo

- **Props table** — a `searchScope` row beside the search row
  (`SideMenuPage.tsx:253`), naming both values and the default.
- **Example copy** — one clause on the search example's description
  (`SideMenuPage.tsx:113`), which today claims the search "auto-expands the
  parents of nested matches" and should say that is the `all` scope.
- **Playground** — a *Search scope* choice control revealed under the existing
  search toggle (`SideMenuPlayground.tsx:212`), following the `loading` →
  *Loader type* idiom in the same file rather than a greyed-out control, so the
  difference is legible without reading code. Its options join the SideMenu
  block in `shared/options.ts`.

## Out of scope

- A runtime control in the menu chrome itself (a filter button by the field).
  Rejected deliberately: it costs an icon, aria labels and five locales of
  strings for a decision the app already knows.
- Any global or theme-level default. One call site is the whole requirement.
- A `searchFilter` predicate escape hatch — it hands callers a
  re-implementation of the filtering and makes the default invisible.
- The Vue kit, which has no menu search.
