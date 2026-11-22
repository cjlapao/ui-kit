# CustomColorSwatches — saved custom colours & loaded extras

Date: 2026-11-21
Status: approved (React only; Vue port deferred)

## Purpose

Today the custom colour is a single slot: commit a colour from the “+” pill and
it lives only while selected — pick another swatch and it is gone. This change
makes every committed custom colour a **saved pill** that stays in the row:
clicking it selects it, clicking the selected pill re-opens its native picker
to edit it in place, and an × on the pill removes it. Separately, consumers can
**load extra colours** into the row via a prop. With `storageKey` set, the
saved list persists to storage using the kit's Table-style persistence idiom.

## Scope

- React package + shared `common/` logic. Files:
  - `common/utils/swatchStorage.ts` — envelope encode/decode + key builder.
  - `react/src/utils/swatchStorage.ts` — re-export mirror; barrel entry.
  - `react/src/components/CustomColorSwatches.tsx` — saved list, extras, edit.
  - Tests: `react/src/utils/swatchStorage.test.ts`, extended
    `CustomColorSwatches.test.tsx`.
  - Demo: playground controls + a “Saved & loaded” example card; API copy.
- No changes to single-vs-dual selection semantics, ink math, rings, or the
  text-override popover's tone list.

## API additions (both modes)

```ts
interface CustomColorSwatchesProps {
  // …existing props unchanged…
  /** Opts into persistence of the saved custom list, like Table. */
  storageKey?: string;
  /** Storage backend override (test doubles, sessionStorage). Default: safe localStorage. */
  storage?: KitStorageAdapter;
  /** Key namespace. Default "ui-kit:swatches". */
  storagePrefix?: string;
  /** Extra colours merged after `colors ?? TRUE_COLORS`, before saved pills and “+”. */
  extraColors?: Array<string | SwatchColor>;
  /** Observer for every save/delete: the full saved list, newest first. */
  onCustomColorsChange?: (hexes: string[]) => void;
}
```

- `extraColors` entries: hex strings render as user-colour pills (hex label,
  auto ink); `{ tone, hex }` objects render like palette entries. Deduped
  against the merge base by normalised hex. Never persisted — extras are the
  consumer's runtime list; saved colours are the user's own.
- The popover's tone dots stay palette-only (they need the tone's ink ladder);
  extras are reachable as text via the popover's own custom picker.

## Saved colours — behaviour

- **Save (auto, on commit):** committing a colour from the “+” pill (native
  `change`) adds it to the saved list and selects it — a real user commit,
  never the `defaultCustomHex` preset. The pill stays in the row when another
  swatch is selected; nothing is lost. The “+” pill itself then **resets to
  rainbow “+”** — the saved pill, not “+”, holds and represents the colour.
  Clicking “+” again re-opens the picker pre-filled with `defaultCustomHex`
  or, if unset, the most recently used hex, so adding variants is quick.
- **List shape:** newest first, deduped by normalised hex (re-adding moves to
  front), capped at `MAX_SAVED_COLORS = 12` oldest-out.
- **Select:** a saved pill emits `{ tone: "custom", hex }` like any custom pick
  and opens like one (hex reveal, computed ring in dual).
- **Edit:** clicking the already-selected saved pill opens its own hidden
  `<input type="color">` (the existing `HiddenColorInput` pattern), pre-filled.
  Dragging live-updates the pill (fill, ink, ring); commit saves the new hex
  in place (position preserved) and fires `onCustomColorsChange`. If the edit
  lands on another saved entry's hex, that duplicate is dropped — the edited
  pill keeps the hex and moves to front. Second-click
  editing mirrors the dual pills' popover trigger — one idiom.
- **Remove:** × button at the pill's trailing edge, faded in with the open
  state (hover/focus/selected), `aria-label="Remove {hex}"`, tabbable only
  while open. `contextmenu` on the pill and a 500 ms long-press (touch;
  cancelled by a pointer move beyond 8 px or early release) also
  remove. Removing the selected pill clears the internal selection without
  emitting — deleting a colour is not changing the value.
- **Rendering:** saved pills sit between the palette/extras and the “+” pill,
  indistinguishable from tone pills at rest. Each saved pill lives in a
  `relative inline-flex` wrapper span holding the pill button and the × button
  as siblings (no nested buttons).

## Storage (opt-in)

- Follows the Table idiom via `common/utils/safeStorage.ts`
  (`createSafeLocalStorage`, `buildStorageKey`, `KitStorageAdapter`).
- Envelope: `{"v":1,"colors":["#aabbcc",…]}` under
  `buildStorageKey(storagePrefix ?? "ui-kit:swatches", storageKey)`.
- Decode validates every entry with `isHexColor`; bad JSON or any junk entry →
  empty list (never a throw). Read exactly once on mount per (key, backend);
  writes on save/delete. Without `storageKey`, saves are session-only — the
  component keeps them in state and reports them via `onCustomColorsChange`;
  no silent global writes.

## Tests

- `swatchStorage.test.ts`: encode/decode round-trip, junk JSON → `[]`, junk
  entries dropped, key builder with prefix.
- Component (storage double injected; no real localStorage):
  commit “+” saves + persists; remount with same double restores the row;
  picking another swatch keeps the saved pill; re-click on selected opens the
  picker and commit edits in place; × removes; `contextmenu` removes; removing
  the selected pill clears selection silently; re-adding a hex moves to front;
  13th save evicts oldest; `extraColors` merge order + dedupe; observer fires
  on save/edit/remove.

## Demo & docs

- Playground: `storageKey` toggle (on → `"demo"`), extras chips row.
- New example card “Saved & loaded”: pre-seeded `extraColors` + persisted saves.
- API paragraph covers the four new props, save-on-commit, re-click-to-edit,
  ×/right-click removal, the 12-colour cap, and storage opt-in.
