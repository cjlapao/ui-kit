# SideMenu — expand-on-click for link rows with sub-menus

Date: 2026-11-21
Component: `react/src/components/SideMenu.tsx` (React only — the Vue `SideMenu.vue`
has no submenu support at all, so it is out of scope)

## Problem

A `SideMenuItemLink` with `children` but **no** `path` is expand-only: the whole row
is the submenu toggle — click opens the sub-tree, click again closes it.

A row with **both** `path` and `children` has no such affordance: the row is a
`react-router` `Link` whose click only navigates, and opening the sub-tree is the
separate chevron button's job. There is no way to get "expand on select" behavior
for a parent that is also a page.

## Requested behavior

For a row that has a link and sub-items:

1. Clicked while its sub-tree is closed → **open the sub-tree and navigate**.
2. Clicked again while we are still on that row's own route and it is open →
   **contract the sub-tree, do not navigate** (we are already there).
3. Clicked while we are on one of its sub items and it is open → **navigate to the
   parent, do not contract**.

## Design

### API

One new field on `SideMenuItemLink`, documented next to `defaultOpen`:

```ts
/**
 * For rows that carry both a route and children: clicking the row opens
 * the sub-tree and navigates; clicking again while on the row's own route
 * contracts it without navigating (you are already there); clicking while
 * on a sub item navigates without contracting. The chevron stays for
 * toggling independently of the route. @default true
 */
expandOnClick?: boolean;
```

**Default: on.** Every link-with-children row gets the behavior; an item opts out
with `expandOnClick: false` and keeps the old navigate-only row. Rows without
children are unaffected; expand-only rows (no `path`) are untouched — they already
work this way.

### Implementation

Single interception point: the `onClick` of the `Link` branch of `renderLinkRow`.
When `hasChildren && link.expandOnClick !== false`, the click reads the **true**
toggle state (`openSubmenus.has(link.slug)`, not the visual `showChildren`, which
is force-open while searching) and branches:

| state | route | click does |
|---|---|---|
| closed | any | add slug to `openSubmenus`; navigate as usual (`onItemSelect`, mobile drawer / hover panel close) |
| open | row's own route | `event.preventDefault()`; remove slug; **no** `onItemSelect` call (pre-navigation copy — no navigation, no call); drawer / hover panel stay so the contraction is seen |
| open | anywhere else (sub item active, or elsewhere) | navigate to the parent; leave open |

Everything else — the chevron toggle button, `defaultOpen`, expand-only rows,
guards, paging — is untouched. The chevron remains the route-free toggle (e.g.
collapsing while on the parent's page without the row click's "already there"
contract).

### Refinements (deliberate)

- **"On that page" is an exact route match, not the existing prefix
  `isActivePath`.** Child routes like `/infra/hosts` sit under the parent's
  `/infra`; a prefix check would make rule 3 contract the tree instead of
  navigating. Tolerates a trailing slash on the live pathname.
- **Slug mode** (`activeItemSlug`, menus that switch local content instead of
  routing): "on that page" is `link.slug === activeItemSlug`; "on a sub item"
  is anything else, so the parent click calls `onItemSelect` (the app's
  preventDefault swaps the content) and stays open.

### Rail / hover / mobile

The rule is uniform regardless of surface. In the icon rail a contract click has
no visible effect (the sub-tree is hidden there) but is harmless; the hover panel
and the mobile drawer stay open on a contract click and close on navigating
clicks, matching the existing link behavior.

## Testing

`react/src/components/SideMenu.test.tsx` — the existing "keeps clicking the row of
a link with children as navigation" test gains an explicit `expandOnClick: false`
(the opt-out path). New cases, asserting navigation with `fireEvent.click`'s
return value (`false` iff prevented):

- collapsed row click opens the sub-tree and is not prevented (navigates);
- expanded + own route: second click is prevented, contracts, `onItemSelect` not
  called for it;
- expanded + child route (`/infra/hosts` under `/infra`): click is not prevented
  and the sub-tree stays open;
- opt-out (`expandOnClick: false`): row click stays navigate-only, chevron present;
- chevron still toggles independently on the parent's own route;
- slug mode: contract on `activeItemSlug === slug`, navigate on a child's slug.

## Out of scope

- Auto-expanding ancestor chains on deep links / route changes (a location-watch
  effect would fight rule 2 — it would re-open what the second click just
  contracted).
- Vue `SideMenu.vue` (no submenu support exists there).
