# SideMenu — embedded select item (`type: "select"`)

Date: 2026-11-21
Component: `react/src/components/SideMenu.tsx` (React only — the Vue port catches up later,
as with SlugInput and TaskBoard's `canAddCard`)

## Problem

`SideMenu` items are a closed union — `link | group | divider`. There is no way to place an
in-menu control (a workspace/context switcher, the "CURRENT CONTEXT" picker in the app
screenshot) in the navigation flow, and `children?: SideMenuItemLink[]` makes it impossible
to put anything but a link inside an expanded parent's sub-tree. Apps that need a context
picker outside the menu (`topItem`, a custom `footer`) lose the nesting and the row rhythm:
the picker must sit like a nav row, at the row's indent, slightly taller than its siblings.

## Requested behavior

A new item kind that renders a small section caption (like a group header's label) above a
full-width `Picker` control, usable both at the top level of `items` and inside a link's
`children`. Selection is fully controlled by the app; icons, tags, groups and search come
free from the `Picker` itself.

## Design

### API

```ts
export type SideMenuItemType = "link" | "group" | "divider" | "select";

export interface SideMenuItemSelect extends SideMenuItemBase {
  type: "select";
  /** Section caption above the control — same treatment as a group header's label. */
  label: string;
  /**
   * Drop the child indent: the row takes its parent row's width instead of
   * stepping one level in. @default false
   */
  fullWidth?: boolean;
  /** The control, passed through to `Picker`. */
  picker: SideMenuSelectPicker;
}

/** Everything `Picker` offers except what the row layout owns. */
export type SideMenuSelectPicker = Omit<
  PickerProps,
  "fullWidth" | "fullHeight" | "className"
>;

export type SideMenuChildItem = SideMenuItemLink | SideMenuItemSelect;
```

`SideMenuItem` joins the select variant; `SideMenuItemLink.children` widens from
`SideMenuItemLink[]` to `SideMenuChildItem[]`. Widening only accepts more, so existing
callers typecheck unchanged. Exported from `components/index.ts` beside the other item
types.

Example (the screenshot's expanded workspace):

```ts
{
  slug: "test-qa", label: "Test QA", icon: "Folder", defaultOpen: true,
  children: [
    {
      slug: "test-qa-context", type: "select", label: "Current context",
      picker: { items: ctxItems, selectedId: ctx, onSelect: setCtx,
                placeholder: "Pick a workspace" },
    },
  ],
}
```

### Rendering

Expanded only, one wrapper at the row's own indent (`indentClass(depth)` — `px-3` at depth
0, `pl-9 pr-3` as a child; `fullWidth` swaps in the parent's indent — see below), so the
block aligns with the labels around it:

- caption `<span>`: the group-header recipe verbatim — `text-xs font-semibold uppercase
  tracking-wider` + `surface.muted`;
- below it, `<Picker {...defaults} {...item.picker} fullWidth />`, where the menu injects
  nav-density defaults the caller can each override: `size="sm"`, `variant="flat"` (the
  bordered field treatment), `tone` = the menu's `color`.

Caption + control stack the block one step taller than a ~40px link row ("a bit higher than
the rest"); the `space-y-1` nav rhythm spaces it like any sibling row. No route, never
route-active: selection lives entirely in `picker.selectedId` / `picker.onSelect`.

`fullWidth: true` releases a nested row from the child indent — the wrapper takes
`indentClass(depth - 1)` (the parent row's own indent; the base at depth 1, where the
select spans the menu's full content width) instead of `indentClass(depth)`. Top-level
rows are unaffected; the caption rides along and the control keeps filling the row.

The popup rides the menu's stacking layer. The listbox is a portaled `<body>` child
(`position: fixed`), so the aside's `overflow-hidden` cannot clip it — its only enemy is
paint order, and a docked aside carries no z-index, so the chain-resolved default (21)
let any z-indexed content column paint over the popup where it left the sidebar.
SideMenu now wraps everything it renders in `MenuPopupContext` (tier **61** — one notch
above its tallest chrome, the `z-[60]` mobile drawer); Picker and DropdownMenu open at
`max(chainResolved, tier)`. Outside a menu the context is unset and behavior is
bit-for-bit unchanged (pickers in modals still stack via the chain walk).

### Behaves like an item, filters like chrome

- `hidden` / `guards` apply through the shared `passesGuard` gate, exactly as for links,
  groups and dividers.
- In the visibility pass, `select` joins `group` and `divider` in the non-link test (one
  extracted `isLinkItem` helper replaces the inline `type !== "group" && type !==
  "divider"` copies — the `visibleItems` pair, `hasVisibleLink` and the initial
  open-submenus seed): it never participates in the menu-search query and stays rendered
  while searching. It is context furniture, not a destination — vanishing mid-search would
  strand the user's context switch.
- In the collapsed rail it renders nothing, like a group header: a 68px rail has no room
  for a control.

### Code-path deltas (the "fits the API correctly" checklist)

| path | change |
|---|---|
| `isLinkItem` | new guard (`item is SideMenuItemLink`) shared by every non-link test |
| initial open-submenus walk | walk children of every type, recurse only into links |
| `visibleItems` / `groupsWithVisibleLinks` | select items gated by `passesGuard` only; a group holding only selects renders no header (no visible links) |
| `hasVisibleLink` (no-results row) | counts links only — a lone select during search still shows "no results" |
| `isActiveItem` / `hasActiveDescendant` | link-only guards; a select child can never light a parent |
| children rendering | branch per child: `select` renders the select row, links recurse |
| search-time child filtering | non-link children are always kept; links still match via `matchesSubtree` |
| children paging | a select counts as a row in a page (documented in the prop's docstring) |

### A11y

The wrapper carries `role="group"` + `aria-labelledby` pointing at the caption id, so the
Picker's combobox is announced under its caption. No new i18n strings — every visible
string is caller-supplied; `Picker` owns its own labels.

## Testing

`react/src/components/SideMenu.test.tsx` (same render/matchMedia helpers as the existing
suites):

- renders the caption and the picker trigger (placeholder; then the selected item's title);
- clicking the trigger opens the listbox and choosing an option calls `picker.onSelect`
  with the `PickerItem`;
- `hidden: true` and a failing `guards`/`guardEvaluator` remove the row;
- stays rendered while the menu search has no match for it;
- renders nothing in the collapsed icon rail;
- renders inside an open parent's children at the child indent;
- `fullWidth: true` moves a nested row to the parent's indent (`px-3` at depth 1, not
  `pl-9`);
- a parent whose only child is a select is expandable and never becomes route-active;
- a select counts toward a `childrenPageSize` page like any other child.

## Docs

- `react/demo/src/kit-docs/components/side-menu/examples/SelectItem.tsx` — a new example
  mirroring the screenshot (a workspace group, one expanded workspace with a
  "Current context" picker as its submenu item), plus its `ExampleCard` entry in
  `SideMenuPage.tsx` and a mention in the page description.
- `SideMenuPlayground.tsx` — a "Select item" group in the controls accordion: toggle for
  the top-level item, toggle for the nested one (inside the workspaces section's open
  `new_agents` parent), a picker `size` choice, `placeholder` text and a multiselect
  toggle; selection state is playground-owned so it behaves like an app would.

## Out of scope

- The Vue port.
- Select items inside group/divider-only placement rules — `groupName` is not consulted
  for select items; they are placement-independent furniture.
- Any search contribution from option titles, and any persistence of the selection —
  the app owns both, `Picker` already covers option-level search.
