# AvatarGroup chip tooltips become Popovers

The parent change ([2026-11-18-avatar-group-design.md](./2026-11-18-avatar-group-design.md))
delivered the strip and left each chip named by a native `title={item.name}`,
listing "per-chip tooltip popovers" as out of scope. This change takes that
item up: the chip's hover label is a `Popover`, not the browser's. It supersedes
the `title` mentions in that spec's *Layout and behaviour* and *Accessibility*
sections and the out-of-scope line itself.

React only, as before: `react/src/components/AvatarGroup.tsx`. No `Popover`
change, no Vue mirror.

## The shape

`Chip` already produces the trigger element — a `<button>` when the item has
`onClick`, a `role="img"` `<span>` otherwise. That element becomes the
`Popover`'s `trigger`; the popover body is the chip's **already-resolved name**,
the same string `aria-label` carries today (`item.name ?? initials ?? the kit's
User-avatar fallback`), rendered as one line:

```tsx
<Popover
  trigger={chipElement}
  visible={open}
  onOpenChange={requestOpen}
  triggerMode="hover"
  placement="top"
  variant="elevated"
  padding="xs"
  maxWidth={240}
>
  <span className="text-xs font-medium leading-normal">{name}</span>
</Popover>
```

- `placement="top"` is a preference; the shared geometry flips it below when
  the chip sits near the top edge and slides the caret so it keeps pointing.
- `maxWidth={240}` keeps a long name inside the screen by wrapping it.
- `padding="xs"` on the shared scale, because the body is a single label.
- The arrow stays at its default — the indicator is what ties a floating panel
  to the 32 px chip it belongs to.

**`title` is removed** from both chip branches, so a chip has exactly one
hover label. Nothing is lost: the accessible name rides `aria-label`, and the
native attribute would otherwise stack an OS tooltip on top of the panel.

**No new props.** The tooltips are unconditional. `AvatarGroupProps` and
`AvatarGroupItem` are unchanged, so every existing call site — including
TaskBoard's assignee and presence stacks — gets the better surface with no
edit. A future `tooltip?: boolean` opt-out is an addition, not a break.

## The dwell

`Popover`'s hover mode opens on `mouseenter`. Chips touch, and a condensed
strip puts eight of them inside ~200 px, so an instant open means a panel
flashing once per chip as the pointer crosses — worse than the native tooltip
it replaces, which waits. The chip therefore owns the open state and puts
**400 ms** of dwell on it (file-local `TOOLTIP_DWELL_MS`, the `Tooltip`
component's 500 ms convention at the tighter end of a dense row).

The chip keeps `triggerMode="hover"` and passes controlled `visible`, so
`Popover` still owns the hover plumbing that matters here: the portaled panel
carries its own `mouseenter`/`mouseleave`, and `leaveHover` debounces a close
request by 150 ms — that is what lets the pointer travel from chip into panel
without the panel vanishing under it. The chip only gates the *open*:

```tsx
const [open, setOpen] = useState(false);
const timer = useRef<ReturnType<typeof setTimeout>>();
useEffect(() => () => clearTimeout(timer.current), []);

const requestOpen = (next: boolean) => {
  clearTimeout(timer.current);
  if (next) timer.current = setTimeout(() => setOpen(true), TOOLTIP_DWELL_MS);
  else setOpen(false);
};
```

An open request (pointer enter, focus, or a click on a chip that has an
`onClick`) schedules; a close request cancels and closes at once, so a chip
never leaves a panel behind. A chip unmounting mid-dwell cancels it — the
cleanup effect, not a leak. Keyboard focus-open waits the same dwell, exactly
as `Tooltip`'s `delay` does.

The state lives in `Chip`, which already owns the per-chip `hasError` state:
`Chip` returns the `Popover` with its button/`img` element as `trigger`. The
only structural change to the row is that `Popover`'s `inline-flex` trigger
wrapper now sits between the flex item and the chip box — the chip's own inline
`width`/`height` in pixels sizes it, so the overlap, the clip maths and the
cascade are untouched.

`Popover` composes the trigger's own `onClick` rather than replacing it
(`handleTriggerClick` calls the existing handler first), so a clickable chip
still reports its click; it simply also surfaces its name.

## Interaction with the strip

- **Expansion dismisses.** The group passes `expanded` down to `Chip`, and a
  one-line effect closes the popover whenever it changes — `reveal()` and the
  chip's open state meet at that prop, no callback threaded through. A cascade
  moves chips for a few hundred milliseconds, and the popover's
  `ResizeObserver` on its trigger wrapper would re-measure every frame of it —
  the layout-animation-is-a-measurement-driver lesson from `ScrollArea`. The
  panel also has nothing to point at while its chip slides away.
- **Condensed chips need no special case.** The zero-width ones cannot be
  hovered, and the visible leading ones behave normally.
- **`singleRow` tracks the scroller.** `Popover` repositions on scroll rather
  than closing (the kit's deliberate deviation from PrimeVue), so a panel on a
  chip scrolls with it.
- **`expandOn="hover"` is unaffected**: the group expands on the root's pointer
  enter as it does today; the chip's dwell only decides when that chip's name
  appears.

## Accessibility

Roles, names and tab order are untouched. A chip stays a `role="img"` figure or
a real `<button>`; the roster gains no new tab stops, which matters — a 20-person
strip would otherwise become 20 stops for text every screen reader already
announces from `aria-label`. The popover replaces a pointer-only `title` with a
pointer-only panel, so it hides nothing from the keyboard: unlike a hover-shown
*control*, it carries no action.

`Popover` adds `aria-haspopup="dialog"`, `aria-expanded` and a conditional
`aria-controls` to every chip. Checked against axe-core's role table rather than
assumed: `img` lists `aria-expanded` in its allowed attributes, and axe's
`globalAttributes` includes `aria-haspopup`, so `aria-allowed-attr` stays quiet.
The axe case below is the guard, not the investigation.

## Demo docs

`react/demo/src/kit-docs/components/avatar-group/AvatarGroupPage.tsx` says a
chip is named by "`aria-label` plus a `title` tooltip". It becomes the popover:
named by `aria-label`, with its name surfaced on dwell in a `Popover`. The
`NAMING_CODE` snippet follows whatever the prose now claims. No new example is
needed — every existing example already shows a chip with a name; the
`TeamInitials` one is the natural place to see it.

## Tests

`AvatarGroup.test.tsx` with fake timers, plus one new axe case. The overlay
unmounts on `animationend`, which jsdom never fires on its own, so a close is
asserted on the chip's `aria-expanded` (which flips immediately) and an open on
the panel's text, the way `Popover.test.tsx`'s `completeOverlayPhase` helper
already splits the two:

- A chip carries **no** `title` attribute (both branches — a `role="img"` chip
  and one with `onClick`).
- `mouseEnter` on a chip opens nothing at once, and the popover text appears
  after `advanceTimersByTime(400)`; `mouseLeave` before the dwell elapses opens
  nothing at all.
- Leaving after it opened flips the chip's `aria-expanded` back to `false`.
- A chip with `onClick` still calls the handler on click (`Popover` composes
  it, so this is the guard against a regression there).
- Expanding the strip dismisses an open popover.
- `a11y/axe-scan.test.tsx`: an `AvatarGroup` with named chips, a clickable chip
  and a `+N`, expanded and collapsed, reports no violations.

## Out of scope

The Vue mirror (AvatarGroup has none), `delay`/`tooltip` props, richer popover
bodies (a secondary line, a link, an avatar), `aria-describedby` wiring, and the
`title` left on `ColorSwatches` dots — which is a tone name, not an identity,
and has no reason to become a panel.
