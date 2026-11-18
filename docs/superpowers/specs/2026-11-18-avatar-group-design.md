# AvatarGroup

A strip of identity chips — photos, icons or initials circles — condensed into
an overlapping stack with a `+N` chip and expanded by *unfolding*, exactly the
way `ColorSwatches` spreads its dots. The swatch's family member for people
and entities: same condense rules, same `CASCADE_EXPAND` rhythm, chip-scale
geometry borrowed from `UserAvatar`.

React only: `react/src/components/AvatarGroup.tsx` (+ `AvatarGroup.test.tsx`),
exported from `react/src/index.ts`. The Vue mirror is a deliberate follow-up,
not part of this change.

## Item model and resolution

Items carry no `kind` discriminator. A chip resolves content in the same
precedence `UserAvatar` uses: **image → icon → initials → User glyph**.

```ts
export interface AvatarGroupItem {
  /** Display name — the accessible name, and the source of derived initials. */
  name?: string;
  /** Explicit initials, max 2 chars — wins over the derivation from `name`. */
  initials?: string;
  /** Registry icon name or element, the UserAvatar `icon` parity prop. */
  icon?: IconName | ReactElement;
  /** Image URL — a broken URL falls back down the chain, never a dead frame. */
  image?: string;
  /** This chip's colour; falls back to the group's `tone` (blue). */
  tone?: TrueColor;
  /** Solid tone pad behind an image/icon chip. @default true for icons, false for images */
  background?: boolean;
  /** With a handler the chip becomes a real <button>, UserAvatar-style. */
  onClick?: React.MouseEventHandler<HTMLElement>;
}
```

Derived initials: the first letter of the first word plus the first letter of
the last word for a multi-word name (`"Ada Lovelace"` → `AL`); a single word
yields its first letter. Uppercased, capped at 2. An explicit `initials` is
trimmed, uppercased and truncated to 2 characters, and wins over the
derivation. An item with none of the four content fields renders the `User`
registry glyph on its resolved tone, and takes its accessible name from the
existing `kit.useravatar.fallback` string.

Icons render through `useIconRenderer()` at the group's resolved `ControlSize`,
as `UserAvatar` does. `onClick` (per item) is the only interactivity — there
is no `selectable` ring mode on this component.

## Group API

```ts
export interface AvatarGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  items: AvatarGroupItem[];
  /** Chip box, on the shared control ladder. @default "md" */
  size?: ControlSize;
  /** The global fallback colour. @default "blue" */
  tone?: TrueColor;
  /** One corner for every chip. @default "full" */
  rounded?: "full" | "lg" | "md" | "none";
  /** A 2px tone-neutral rim on every chip. @default true */
  border?: boolean;
  /** Chips shown before the +N chip. @default 5 */
  maxVisible?: number;
  /** @default "click" */
  expandOn?: "click" | "hover";
  /** @default false */
  defaultExpanded?: boolean;
  /** Cap the expansion at one row that scrolls sideways. @default false */
  singleRow?: boolean;
  /** Inset around the group, shared container scale. @default "none" */
  padding?: SurfacePadding;
  className?: string;
}
```

Tone resolution per item: `item.tone ?? tone ?? "blue"`. `rounded` maps
`full → rounded-full`, `lg → rounded-xl`, `md → rounded-md`,
`none → rounded-none`, and applies to the initials fill, the pad, the image
clip and the hover halo alike. `maxVisible` normalizes non-finite values to 5
and clamps finite ones to at least 1. An empty `items` array renders nothing.

## Chip skins and the theme addition

One resolved tone, one `rounded` corner, three skins:

| Item | Paint |
| --- | --- |
| Initials | `bg-{c}-700 dark:bg-{c}-400` + `text-white dark:text-{c}-950` — the kit's glyph-fill rule (the Stepper's pairing), so yellow/lime stay legible. |
| Icon | Pad `bg-{c}-100 dark:bg-{c}-900` behind the glyph — a solid quiet step, not a translucent wash, which read muddy on dark and bled through the overlap — glyph in `text-{c}-700 dark:text-{c}-100` (the pill-soft ink pair, ink alone). |
| Image | Art on transparent, `object-cover`, clipped to the `rounded` corner; with `background: true` the same pad paints *under* the img so it shows through transparent logos and PNGs. |

`background` is contextually defaulted: `true` for icon chips (a glyph
floating bare in a group looks unfinished), `false` for image chips — an
explicit value always wins. Initials chips ignore it.

The recipes above are not standalone exports today — pill `soft` welds fill
and ink together and the Stepper owns its copy. One addition to
`common/theme/Theme.ts`, beside `TRUE_COLOR_DOT_CLASSES`, literal per colour
so Tailwind's scanner always sees the classes:

```ts
export const TRUE_COLOR_CHIP_CLASSES: Record<TrueColor, {
  fill: string;   // bg-c-700 dark:bg-c-400
  ink: string;    // text-white dark:text-c-950
  wash: string;   // bg-c-100 dark:bg-c-900  (solid, not translucent)
  washInk: string;// text-c-700 dark:text-c-100
}>;
export const getTrueColorChipClasses = (tone: TrueColor) => …
```

A theme test asserts all 21 colours carry entries in the documented shape.

## Layout and behaviour

The `ColorSwatches` engine retargeted to chip geometry. A file-local `Chip`
subcomponent holds the image-error state; `AvatarGroup` owns the layout.

Geometry constants: chip boxes reuse `UserAvatar`'s ladder
(`xs 20 / sm 24 / md 32 / lg 40 / xl 48` px) with its text scale
(`text-[10px] … text-base`); `GAP_PX` (`4/6/8/12/16`), `OVERLAP_RATIO 0.3`,
the `+N` footprint (34 px), and inner `PAD_RATIO 0.25` carry over unchanged.
The `showNames` label block is dropped — condensed rows are pure
chip strips, and chips carry `title={name}`.

- Condensed when `count > maxVisible` **or** the measured row doesn't fit
  (`ResizeObserver` on the root, same width-fits math as the swatches; an
  unmeasured root condenses on count alone, which is also the jsdom path).
- Leading chips ride over by one overlap; the hidden rest stay mounted,
  zero-width behind the `+N` chip, so their layout never moves.
- The clip animates one line (`padPx*2 + chipPx + gapPx`) → the measured
  content height; nothing replaces anything.
- Expanding cascades chips in left→right at 20 ms/item; retracting is the 8 ms
  right→left ripple, the expanded layout held 300 ms before the condensed
  geometry commits, clip grows over 400 ms — all from `CASCADE_EXPAND`.
- Hover grammar as in the swatches: a halo (the item's tone dot step,
  500/400, scaled up to 1.45× at 40% opacity) behind a spring-eased 1.15× chip lift, `hover:z-10`.
- `expandOn: "hover"` reveals on pointer enter/leave of the group; the chip
  always toggles by click in both modes.
- `singleRow` caps the expansion at one line. Off (the default) the strip
  unfolds as above — chips wrap and the clip grows to the measured height.
  On, the whole roster stays on one non-wrapping row inside a `ScrollArea`
  (fixed one-row height, `mask` fading the reachable edge), scrolling
  sideways by wheel, touch or keyboard; the collapse chip is *pinned* outside
  the scroller so it never scrolls off-screen. Condensed, `singleRow` is
  pixel-identical to the natural stack — the inline `+N` still hugs the
  visible chips; a zero-width hidden chip also pays back its margin so it
  adds no phantom scroll lane. The row stretches to the viewport and centres
  its chips, so they always sit on the pinned toggle's centreline whatever
  the viewport padding; and when it overflows, its start and end are padded
  out to the mask's 24px reach — the first and last chip land just past the
  blur at the scroll ends, never faded mid-face, never stranded in space.

## Accessibility

The group is `role="group"` labelled `Avatars`, with the `regionId` wiring the
`+N` button (`aria-expanded`, `aria-controls`) shares with `ColorSwatches`.
A chip is `role="img"` with `aria-label={name}` and `title={name}` — or a real
`<button type="button">` with a tone focus ring (`focus-visible:ring-{tone}-400`,
offset included) when it has `onClick`; its artwork is `aria-hidden` so the
name is announced once. Images are `alt=""`. Condensed chips leave the tab
order (`tabIndex={-1}`). The `+N` chip reads `Show N more avatars` /
`Collapse avatars`, mirroring the swatch chip's strings.

## Demo docs and validation

`react/demo/src/kit-docs/components/avatar-group/`: an `AvatarGroupPage.tsx`
with a playground (knobs for `size`, `tone`, `rounded`, `maxVisible`,
`expandOn`, `defaultExpanded`, `singleRow` over a fixed demo roster) and examples —
`TeamInitials` (per-chip colours), `Integrations` (registry icons on tone pads),
`TransparentLogos` (images, pad as opt-in), `CondensedOverflow`,
`SingleRowScroll` (the scrolling row with its pinned collapse chip),
`ExpandOnHover` — registered in `registry.ts` beside the `color-swatches`
entry, matching its shape.

`AvatarGroup.test.tsx` mirrors the ColorSwatches suite: render and condense
counts, the `+N` unfold/retract, hover expand, tone resolution with the blue
fallback, initials derivation and truncation rules, the broken-image fallback
chain, icon-pad-on / image-pad-off defaults, `background` overrides,
keyboard reach and `aria-expanded`, and the `rounded` corner classes. The new
theme maps get a shape test over all 21 colours.

## Out of scope

The Vue mirror (follow-up change), a `selectable` ring mode, `showNames`,
per-chip tooltip popovers, and item-level `disabled` — none requested, each
addable without breaking the API above.
