# IdentityPicker — restrictable identity modes (`modes`)

Date: 2026-11-24
Component: `react/src/components/IdentityPicker/IdentityPicker.tsx`
(React only — there is no Vue port of IdentityPicker to catch up.)

## Problem

`IdentityPicker` always offers all three identity kinds. It builds three `Tabs` items —
emoji, image upload, monogram — and renders the segmented tab bar unconditionally. An app
that only supports emoji identities, or one that has no image storage and so cannot accept
an upload, has no way to say so: it gets a tab bar advertising choices it will discard or
reject downstream. Hiding a mode today means forking the component.

The degenerate case is the loudest. A picker with one real choice still shows a
three-tab bar, and even if the extra tabs were filtered out by hand, a one-tab segmented
bar reads as a broken control rather than as "there is nothing to switch between".

## Requested behavior

Let an app enable just the modes it supports — emoji only, image only, monogram only, or
any two — and when exactly one mode survives, drop the selector entirely instead of
showing a single-tab bar.

## Design

### API

```ts
/** One of the identity kinds `IdentityPicker` can offer. */
export type IdentityMode = "emoji" | "image" | "monogram";

export interface IdentityPickerProps extends … {
  /**
   * Identity kinds to offer, in the order to show them. Omit for all three;
   * pass an empty array for none. Unknown names and duplicates are dropped.
   * With one mode the tab bar disappears and that panel renders on its own.
   * @default ["emoji", "image", "monogram"]
   */
  modes?: IdentityMode[];
}
```

`modes` is an allowlist, not a denylist: it states what the app supports, and the array
order doubles as the tab order. `IdentityMode` is exported from the component barrel and
from `react/src/components/index.ts`.

Normalisation is defensive — `modes.filter(m => m in registry)` then a `Set` dedupe — so a
typo drops a mode rather than crashing the panel, and `["emoji", "emoji"]` yields one tab.
`undefined` means all three; `[]` means none.

### Panel registry

The three panels move out of the inline `items` literal into a `Record<IdentityMode, TabItem>`
built in-component, each closing over the same state it uses today. Rendering becomes
`modes.map(mode => registry[mode])`.

Filtering upstream of `Tabs` is what actually removes a hidden mode, and it matters:
`Tabs` keeps every panel mounted and merely applies `hidden` / `aria-hidden` to the
inactive ones. Filtering the array instead means a hidden mode's DOM is absent — no emoji
search box, no `Choose files` input, no `Initials` textbox in the page for an app that
does not offer that mode.

Tab ids stay `${tabsId}-emoji` / `${tabsId}-upload` / `${tabsId}-monogram`, so existing
styles, tests and the `panelIdPrefix` contract are untouched. The `image` mode keeps its
historical `-upload` id.

### Three render paths

The number of surviving modes picks the layout:

| modes | render |
| --- | --- |
| 2 or more | `Tabs`, exactly as today |
| exactly 1 | that panel node rendered directly under the header — no bar, no label |
| 0 | header, preview and reset only; the selector region is skipped entirely |

The single-mode case renders the panel flush against the header with no caption. The
control is self-explanatory — a search-and-grid, a dropzone, or an `Initials` field — and
a heading repeating "Emoji picker" above it is the label the tab bar used to carry, which
is precisely what the app asked to stop seeing.

The header, preview and reset button stay in all three paths. Reset still clears
app-owned state even when nothing is selectable.

### Active-tab fallback

Today the default tab derives straight from the current value: `selected?.type === "image"`
selects `-upload`, and so on. Under restricted modes that can name a tab that no longer
exists and leave `Tabs` with no active tab. The derived id now falls back to the first
allowed mode when the value's own type is not among `modes`.

### Stale values stay inert

A value whose mode is hidden — `value={{type:"image", src:"…"}}` with `modes={["emoji"]}` —
keeps rendering in the preview and never triggers `onChange`. The value is app-owned; the
picker does not reset behind the app's back, and the persisted identity stays visible
while simply not being selectable. The same holds for the empty `modes` case.

### Auto-derived subtitle

`labels.description` has a static default naming all three modes, so a restricted picker
would advertise modes it just hid. The default is now composed from the surviving modes
from verb phrases `"choose an emoji"` / `"upload an image"` / `"use monogram initials"`:

- `["emoji"]` → *Choose an emoji.*
- `["emoji", "image"]` → *Choose an emoji or upload an image.*
- `["emoji", "image", "monogram"]` → *Choose an emoji, upload an image, or use monogram initials.*

Two items join with "or", three or more take the Oxford comma, the first letter is
capitalised and the sentence ends with a period. The three-mode output is byte-identical
to today's default, so nothing currently rendering the picker sees a copy change. An
explicit `labels.description` still wins in every case.

## Out of scope

Per-mode `disabled` (dimming a tab the app supports but does not want offered right now)
and a denylist mirror of `modes`. Both are additive to this shape if a real caller needs
them; neither has one today.

## Testing

New cases in `IdentityPicker.test.tsx`, plus a regression case proving the untouched
default still renders three tabs:

1. `modes={["emoji"]}` — no `tab` role in the document, emoji grid present, and no
   `Initials` textbox or `Choose files` input.
2. `modes={["image"]}` — single panel, file input present, no tabs.
3. `modes={["emoji", "monogram"]}` — exactly those two tabs, no upload control.
4. `modes={[]}` — preview and reset survive, no selector controls at all.
5. Stale value (`image` value, `modes={["emoji"]}`) — preview still shows it, no tabs.
6. Stale value with 2+ modes — active tab falls back to the first allowed mode.
7. `modes={["monogram", "emoji"]}` — tab order follows the array.
8. Subtitle text for one, two and three modes.
9. Duplicates and unknown entries in `modes` collapse to the expected set.
