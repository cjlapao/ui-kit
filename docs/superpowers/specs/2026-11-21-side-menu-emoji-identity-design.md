# SideMenu — emoji identity on link rows (`emoji`)

Date: 2026-11-21
Component: `react/src/components/SideMenu.tsx` + `react/src/components/IdentityPicker/IdentityPicker.tsx`
(React only — the Vue port catches up later, as with the select item)

## Problem

`IdentityPicker` lets an app choose an identity for a workspace/project and returns
`IdentityValue` — one variant being `{ type: "emoji"; emoji: string }`. SideMenu rows have
no way to say "this row's icon *is* an emoji": passing the picked glyph anywhere leaves it
rendered as inline text, and the only icon-less treatment is the collapsed-rail initials
chip — a `rounded-md bg-black/5 dark:bg-white/10` square at `text-[10px]`, which is right
for two-letter monograms and wrong for a color emoji that should sit where the icon sits,
bare and at full slot size.

## Requested behavior

A way to indicate on the item that its icon is an emoji, rendered as the row's icon — no
background, large font using the full slot space — plus a playground example.

## Design

### API

```ts
export interface SideMenuItemLink extends … {
  // …
  /**
   * The row's identity is an emoji (e.g. picked with `IdentityPicker`):
   * rendered in the icon slot as a bare glyph at the slot's full size — no
   * background chip, no tint; the initials fallback stands down. Wins over
   * `icon`; a row's identity is one thing, not two.
   */
  emoji?: string;
}
```

Bridging the picker is one line, and it is the documented shape:

```ts
emoji: identity?.type === "emoji" ? identity.emoji : undefined
```

`emoji` lives on the item, not on a value object — the menu deals in plain render props,
and this mirrors how `icon` works. The `{ type: "emoji" }` discriminant belongs to
`IdentityPicker`'s world; by the time the app hands data to the menu it is a string.

### Rendering (leading slot, ternary chain)

The slot renders when `link.icon || link.emoji || link.loading || contentCollapsed` and
branches in precedence order:

1. `link.loading` → spinner takes the slot (unchanged; a spinner outranks identity).
2. `link.emoji` → the glyph:
   ```tsx
   <span
     data-sidemenu-emoji
     aria-hidden="true"
     className="inline-flex h-5 w-5 select-none items-center justify-center text-[20px] leading-none"
     style={{ fontFamily: IDENTITY_EMOJI_FONT_FAMILY }}
   >
     {link.emoji}
   </span>
   ```
   20px inside the `h-5 w-5` slot — the glyph fills the space a registry icon occupies.
   No `rounded-md`, no `bg-*`: the chip treatment belongs to the initials fallback alone.
   `aria-hidden` because the row's accessible name is its label, not the glyph.
3. `!link.icon` → initials chip (unchanged; suppressed when `emoji` is set, since branch 2
   fires first).
4. otherwise → `CustomIcon` (unchanged).

`hangingSpinner` (the icon-less nested row's hanging spinner) also stands down when
`emoji` is set — the row has a slot to take.

In the collapsed rail the emoji behaves like any icon: it replaces the initials and keeps
its slot; the badge dot still overlays the corner.

### Font stack — one definition

`IdentityPicker` renders its preview glyphs with
`"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif"`. That stack is
exported from the component module as `IDENTITY_EMOJI_FONT_FAMILY` (its `fontFamily` prop
now defaults to the constant) and SideMenu imports it, so a row always renders the glyph
the same way the picker previewed it. Side effects of sharing: nothing — it is a string
constant; the picker still allows overriding via its prop.

### Playground

"Workspaces section" group gains **Emoji identities (🤖 / 🎨)** (`WorkspaceSectionOptions.emojiIdentities`):
`new_agents` becomes 🤖 and `ui-kit` becomes 🎨, replacing their folder icons. Flipping it
with the rail collapsed compares the bare glyph against the icon-less sibling's initials
chip.

## Testing

`SideMenu.test.tsx` → `SideMenu emoji identities`:

- glyph in the slot, no `bg-*` class, carries the emoji font stack, `aria-hidden`.
- wins over the registry icon (row shows the glyph, renders no `svg`).
- collapsed rail keeps the emoji; only the icon-less sibling gets the initials chip.
- `loading` still takes the slot over the emoji.

## Rejected alternatives

- `icon?: IconName | { emoji: string }` union — single field, but widens every existing
  `icon` consumer's type for a rare variant, and muddies the registry-name contract.
- Reusing `media?: ReactNode` — free-form escape hatch already exists for images; the emoji
  case wants kit-owned sizing/font guarantees, which a raw node can't provide.
- A background chip "for consistency" — the request explicitly wants none; color emoji
  already read as tiles.
