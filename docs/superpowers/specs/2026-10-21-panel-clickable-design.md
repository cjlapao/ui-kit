# Panel clickable — design

Date: 2026-10-21
Status: approved by user (four design sections approved in order; all
recommended picks; approach A approved)
References: `StatCard` (the kit's existing clickable-card idiom),
`CollapsiblePanel` (div-with-button-role precedent), `getSurfaceTriggerTokens`
(hover wash + inset focus ring), `common/a11y/warn.ts` (dev-warning contract),
`Modal`'s focusable selector (deliberately not reused — see below)
Scope: **React kit only** (`@cjlapao/ui-kit`); the Vue panel stays as it is.

## Why

`Panel` already accepts `onClick`, and already turns `hoverable` on when it
sees one (`isHoverable = hoverable ?? Boolean(rest.onClick)`). So the click
works — and stops there. There is no `role`, no `tabIndex`, no Enter/Space,
no focus ring, and `cursor-pointer` is welded to `hoverable` rather than to
being clickable. A card you can click with a mouse cannot be activated from
the keyboard at all.

Worse, the click is wrong in the other direction too: every click inside the
card bubbles into the `<section>`, so **clicking one of the panel's own
`actions` fires the panel's `onClick` as well**. A card that opens something
and also holds a Delete button currently does both.

The ask is the missing half: an `onClick` makes the card properly clickable,
by default, without swallowing the controls inside it.

## Decisions taken in conversation

- **Semantics: button by default, with an escape hatch.** `onClick` gives
  `role="button"`, `tabIndex=0`, Enter/Space and the tone focus ring — the
  `StatCard` idiom at `react/src/components/StatCard.tsx:486-500`. A
  `clickable={false}` opt-out drops to a bare click surface for cards whose
  body owns the interaction. A dev warning names the ARIA-invalid case rather
  than shipping it silently. (Rejected: surface-only-by-default — keyboard
  users could not activate a plain clickable card without opting in;
  decide-from-content — the tab order would move as the body loads.)
- **The guard covers interactive descendants, plus two extras:** a drag
  selection in progress, and a `data-panel-no-click` escape hatch for custom
  widgets (a div with an onClick has no semantics for a selector to find).
- **No opt-out from the guard.** It is what makes a clickable Panel safe next
  to its own actions.
- **`onClick` only** — no `href`, no `as`. Callers navigate from the handler
  or wrap the card in a `RouterLink`.
- **`clickable` and `hoverable` stay independent.** `hoverable` is the tint
  and the decoration fade; `clickable` is activation. `onClick` turns both on
  and each can still be switched off alone.
- **Approach A: Panel owns a wrapped handler.** `onClick` is destructured out
  of `rest` and Panel attaches its own. Rejected: a capture-phase listener
  (capture behaviour is invisible in jsdom and would swallow a caller's own
  root `onClick`); a shared `ClickableSurface` extracted for Panel + StatCard
  (the honest end state, but refactoring a tested component to serve this
  request is the unrelated-refactor trap — backlog instead).
- **The action double-fire is fixed unconditionally** and gets a changelog
  line. It is a double-fire, not a feature.

## Public API

One new prop on `PanelProps`:

```ts
/**
 * Whether the card behaves as a single action: focusable, `role="button"`,
 * Enter/Space activate, and a tone-coloured inset focus ring.
 * @default true when an `onClick` handler is present, false otherwise.
 */
clickable?: boolean;
```

Derived, alongside the existing hoverable derivation:

```ts
const isClickable = clickable ?? Boolean(onClick);
const isHoverable = hoverable ?? Boolean(onClick);   // unchanged in effect
```

The section then carries, **after** `{...rest}` so a caller's explicit
`role` / `tabIndex` / `onKeyDown` still win:

| prop on the DOM | when |
| --- | --- |
| `role="button"` | `isClickable` (kept when `disabled`, like CollapsiblePanel) |
| `tabIndex` | `isClickable ? (disabled ? -1 : 0) : undefined` |
| `aria-disabled` | `isClickable && disabled` |
| `onClick` | `onClick` present, gated off by `disabled` |
| `onKeyDown` | `isClickable` only, gated off by `disabled` — without a tab stop the card is never the event target, so a keydown handler would be dead weight that a caller might mistake for working keyboard support |
| `cursor-pointer` | `isHoverable \|\| isClickable` |
| `trigger.focusRing` | `isClickable`, from `getSurfaceTriggerTokens(resolvedTone)` |

- **Stays a `<section>` with `role="button"`, never a native `<button>`** —
  `actions` render buttons, and a button inside a button is invalid. The same
  reasoning CollapsiblePanel carries at `CollapsiblePanel.tsx:112-113`.
- **The ring is the shared token, not a new class.** Its comment exists
  because an outer ring is clipped by any `overflow: hidden` ancestor, "which
  every Panel has". It is already in `dist/index.css` (CollapsiblePanel uses
  it), so no safelist work and no CSS rebuild.
- **Cursor is additive.** Today a `hoverable`-only panel shows a pointer; it
  keeps it (no regression for existing callers). A clickable panel with
  `hoverable={false}` gains one, which it does not have now.

## The guard

New shared module `common/a11y/interactive.ts` — framework-agnostic, imports
no React, mirroring `common/a11y/warn.ts`'s shape:

```ts
export const INTERACTIVE_SELECTOR = [
  "a[href]", "button", "input", "select", "textarea", "summary",
  '[contenteditable=""]', '[contenteditable="true"]',
  "audio[controls]", "video[controls]",
  '[role="button"]', '[role="link"]', '[role="checkbox"]', '[role="radio"]',
  '[role="switch"]', '[role="tab"]', '[role="menuitem"]', '[role="option"]',
  '[role="combobox"]', '[role="slider"]',
].join(",");

/** True when the click belongs to a control inside `root`, not to `root`. */
export function isClickOwnedByDescendant(
  root: HTMLElement | null,
  target: EventTarget | null,
): boolean;
```

`isClickOwnedByDescendant` returns true when `target.closest(INTERACTIVE_SELECTOR)`
**or** `target.closest("[data-panel-no-click]")` resolves to an element that
`root.contains()` and that is not `root` itself. The `contains` check is what
stops `closest` from escaping above the panel; the `!== root` check is what
lets a caller who puts `role="button"` on the section keep receiving clicks.

**Deliberately not shared with `Modal.tsx:68`.** That selector asks *what is
tabbable*, for focus trapping; this one asks *what is a control*. Merging
them would have the trap tab into `contenteditable` divs.

`Panel` forwards the caller's `ref` straight to the section today, and both
the guard and the keyboard target need the element themselves. So Panel gains
a callback ref that fills an internal `sectionRef` *and* the forwarded ref —
the pattern `ScrollArea` already uses in `setViewportRef`, for the same
reason: one ref of its own would make the component lose the caller's.

```tsx
const handleClick = (event: MouseEvent<HTMLElement>) => {
  if (isClickOwnedByDescendant(sectionRef.current, event.target)) return;
  if (window.getSelection()?.isCollapsed === false) return;  // dragging copy out is not a click
  onClick?.(event);
};

const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  if (event.target !== sectionRef.current) return;  // Enter stays in a nested textarea
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();                            // otherwise Space scrolls the page
  onClick?.(event);
};
```

- The guard runs **whenever Panel owns the handler**, not only when
  `clickable` is on: `clickable={false}` removes the role and the tab stop,
  but clicking a button inside the card must still not fire the card.
- `window.getSelection` is optional-chained — it does not exist during SSR.
- Nothing to write for press-in-card-release-outside: the browser does not
  fire `click` across differing down/up targets.

## Dev warning

An effect on the **body wrapper** (`Panel.tsx:728-743`, the div that holds
`children`) fires

```ts
devWarnA11yOnce(
  "Panel:clickable-nested-interactive",
  "Panel: a clickable Panel whose body contains controls is announced as a " +
  "single button named after all of its text, with those controls nested " +
  "inside it. Pass clickable={false} when the body owns the interaction, or " +
  "render the card's primary action as a real Button/Link.",
);
```

when `isClickable && bodyRef.current?.querySelector(INTERACTIVE_SELECTOR)`.

- Scoped to the body so the kit's own header `actions` never trigger it —
  those are chrome the component owns and already guards.
- Re-checked when `isClickable` or `loading` changes (a skeleton body swaps
  its content out).
- `devWarnA11yOnce` is dev-only (`isDev()`), never throws, and dedupes by id,
  so it prints **once per session**. Tests clear it with `resetA11yWarned()`.
- **No warning about the accessible name.** A `role="button"` card taking its
  name from its content is how a card reads; warning there trains people to
  ignore the warnings that matter.

## Files touched

- `react/src/components/Panel.tsx` — `clickable` prop, the two handlers, the
  DOM attributes above, `bodyRef`, and a composed `sectionRef` callback ref.
- `common/a11y/interactive.ts` — new.
- `react/src/components/Panel.test.tsx` — new suites (19 tests today).
- `react/demo/src/kit-docs/components/panel/examples/Clickable.tsx` — new.
- `react/demo/src/kit-docs/components/panel/PanelPlayground.tsx` — a
  `clickable` toggle, and the event log distinguishes card vs action.
- `react/demo/src/kit-docs/components/panel/PanelPage.tsx` — document
  `clickable` and the guard, in that page's existing prose-API shape.
- `Learnings.md` — one section: a clickable container has to decide whose
  click it is, and the double-fire that follows when it does not.

## Out of scope

Vue parity (`Panel.vue` carries the same `hoverable`/`onClick` logic and will
keep the same gap until this crosses over). `href`/`as`. A shared
`ClickableSurface` primitive that `StatCard` would also adopt. Any change to
`loading`, `hoverable`'s tint, or the `actions` API.

## Acceptance

Semantics

1. `onClick` → `role="button"`, `tabIndex=0`, and the tone ring token on the section.
2. No `onClick`, no `clickable` → none of them appear.
3. `clickable={false}` + `onClick` → no role, no tab stop, **handler still
   fires on a card click and the guard still applies**.
4. A caller's own `role` / `tabIndex` / `onKeyDown` win over Panel's.
5. `disabled` + `onClick` → `aria-disabled`, `tabIndex={-1}`, and neither a
   click nor Enter activates.
6. `hoverable={false}` + `onClick` still has `cursor-pointer`; `hoverable`
   alone keeps it (regression guard).

Guard

7. Click a nested `Button` → the button fires, the card does not.
8. Click a `span` inside that button → same (`closest`, not direct children).
9. **Click a panel `action` → the action fires, the card's handler does not.**
10. Click plain body text → the card fires.
11. Click inside a `[data-panel-no-click]` wrapper → the card does not.
12. Click an `a[href]` → the card does not.
13. With `window.getSelection()` stubbed non-collapsed → the card does not.

Keyboard

14. Enter activates and `preventDefault` is called.
15. Space activates and `preventDefault` is called (no page scroll).
16. A keydown whose target is a nested input does not activate the card.
17. Unrelated keys are ignored.

Warning

18. A clickable card with a control in the body warns once, and the message
    names `clickable={false}`.
19. A clickable card whose only controls are its header `actions` does not warn.
20. Not clickable → no warning.

## Verification

- `cd react && npx tsc --noEmit`; `npx eslint src`; `npx vitest run
  src/components/Panel.test.tsx`.
- Full React suite — expected failures: the three pre-existing date-sensitive
  Gantt assertions and nothing else.
- Confirm the focus-ring utility is already in `react/dist/index.css`
  (`grep -o "focus-visible:ring-blue-400"`); rebuild with
  `npx @tailwindcss/cli -i ./src/styles.css -o ./dist/index.css` only if a
  genuinely new class appeared.
- jsdom proves bubbling and the handlers but not selection or hover, so the
  last check is headless Chrome over CDP against the running demo: click the
  card → one log line; click the action inside it → the action's line only.

## Behaviour change to note in the changelog

Clicking a `Panel` `action`, or any interactive element in the body, no
longer fires the panel's own `onClick`. This is a fix — the double-fire was
never intended — but it is a change for anyone who relied on it. A caller who
wants both invokes the card's handler from the action.

## Risks

- **Selection suppression could be over-eager**: a programmatic non-collapsed
  selection elsewhere on the page would suppress a genuine card click. A real
  click collapses the selection on `mousedown`, so it is collapsed by the time
  `click` fires; the case that survives is a host holding a selection open
  deliberately. Guarded by test 13, and the escape hatch is a normal click.
- **`role="button"` around content is only as good as the caller's intent.**
  The warning is advisory; a caller can ignore it. The alternative (surface
  only) was rejected for the keyboard cost.
- **A11y name from content** can produce a long button name on a text-heavy
  card. Accepted: documented, and the fix is `clickable={false}`.
