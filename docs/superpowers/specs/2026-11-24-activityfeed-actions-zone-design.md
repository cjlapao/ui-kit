# ActivityFeed — actions zone on rows and sub-rows

Date: 2026-11-24
Status: approved
Follows: sub-items disclosure (`88cb7c45`), tone hierarchy + toned hover (`fe1b3ff7`), depth step (`5f88288d`)

## Problem

Every feed row is a dead end on the right: the header ends with the chevron
(or nothing), so there is no place to hang per-row controls — a dots menu,
a quick action. Callers can bolt them into `body`, but that trades the whole
row template for the privilege. The playground needs it too: a `DotsVertical`
`IconButton` + `Menu` on a row and on a sub-row, without the menu toggling
the disclosure or firing the row action.

## Decisions (user-approved)

1. **Node slot on both types** — `actions?: ReactNode` / `VNodeChild` on
   `ActivityFeedItem` and `ActivityFeedSubItem`; the feed paints it, the
   consumer composes whatever (`body`-slot precedent). No structured action
   list, no real slots.
2. **Always visible** — the zone is not a hover-reveal affordance; it works
   with keyboard and touch alike.
3. **Right, before the caret** — in the row header the zone renders after the
   entry content/time and before the disclosure chevron; in a sub-row it is
   the last child, after `<time>`. Custom-`body` rows and subs get the zone
   too (it is a sibling of the body, not part of the template).

## Design

### API

- `ActivityFeedItem.actions?: ReactNode` (React) / `VNodeChild` (Vue) —
  drawn only when `!= null`.
- `ActivityFeedSubItem.actions?: ReactNode | VNodeChild` — same rule.

### Containment — the load-bearing part

The zone renders inside a wrapper — `flex shrink-0 items-start gap-1` —
that swallows `click` and `keydown` (`stopPropagation`, both kits, both
disclosure modes).

- Vue's Panel has **no descendant guard**: without the wrapper a dots-button
  click would fire the row's `onClick` *and* fold/unfold a row-toggle row.
- React's Panel guards `cardAction` clicks owned by nested controls, but the
  chevron-button mode and the keydown path are not covered by it; swallowing
  in the wrapper makes behaviour identical and deterministic across kits.
- Menu popups portal outside the row, so opening them is unaffected.

### Feed internals

- React `FeedRow`: the zone sits between the entry (`entryContent` or
  `item.body`) and `chevron` in the header div; per sub-row, after the
  entry inside the sub wrapper.
- Vue: `ActivityFeedRowView` gains `hasActions: boolean; actions?: VNodeChild`;
  `ActivityFeedSubRowView` gains the same. Templates place the wrapper with
  `@click.stop @keydown.stop` (the `regionHandlers` pattern) and render the
  node through `VNodeRenderer`. The feed settles the fields in `rowView`.

### Playground

- The deploy row (row-toggle mode — the interesting one) wears
  `actions: <Menu popup trigger={<IconButton icon="DotsVertical" srLabel="Row actions" />}>`
  with View details / Copy id / separator / Archive (`danger`).
- The "rolled 4 pods" sub-row gets its own dots menu (View logs / Restart) —
  the exact scenario to test: clicking dots neither toggles the row nor
  folds the disclosure.
- Playground is React (kit-docs); Vue parity is component-level plus tests.

### Docs

- API paragraph: `actions?` joins both inline prop literals; one sentence —
  right-aligned zone after the content, before the caret; clicks inside
  never activate the row or the disclosure. ExampleCard copy untouched
  (demo change is playground-only, per request). No i18n — consumers own
  the labels.

## Test matrix (both kits)

1. Zone renders in the header between entry and chevron (document order);
   sub-row zone renders last, after `<time>`.
2. Row-toggle immunity: clicking the zone and keying Enter inside it never
   opens/folds the row (React: grid stays `0fr`; Vue: no `toggle` emit).
3. Row `onClick` untouched by action clicks (Vue is the load-bearing one;
   React asserts the same).
4. Zone renders alongside custom `body` — row and sub-row.
5. No actions → no wrapper element at all (no empty flex children).

## Non-goals

- No hover-reveal, no i18n, no structured menu API (Menu/MenuButton exist),
  no positioning knobs.
