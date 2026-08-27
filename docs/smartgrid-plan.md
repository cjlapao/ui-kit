# SmartGridLayout — hardening plan

## 0. The finding that shapes everything else

`SmartGridLayout` is **not exported from the kit**. It is absent from `components/index.ts`, has zero importers in `react/src`, `react/demo/src` and `vue/src`, has no test file and no docs page. The Vue twin (`SmartGridLayout.vue`) is in the same state.

Two consequences:

- **There is no back-compat burden.** Every rename below is free — no call site can break, because there are no call sites. `editThemeColor` → `tone` needs no deprecated alias.
- **Nothing here has ever been exercised.** The bugs below are not regressions; they are the state the component has always been in. Expect more once it is under test.

The last step of this work is therefore also the most important one: export it, test it, document it.

---

## 1. Bugs

### 1.1 React state is mutated in place — three sites

```tsx
const newSection = { ...section };   // shallow: newSection.rows IS section.rows
const newRow = { ...row };           // shallow: newRow.items IS row.items
newRow.items.push(newItem);          // ← mutates the previous state
newSection.rows[rowIndex] = newRow;  // ← mutates the previous state
```

`addSpacerToRow` (972), `addItemToRow` (1078, 1114–1115). A shallow spread copies the object, not the arrays inside it, so both writes land on the object React is still holding as `prev`.

This is not cosmetic. It means the "did anything change?" comparison in `updateLayout` (`next !== prev`) can be true while `prev` has *already* been changed, so `onLayoutChange` fires with a snapshot that no longer matches what was saved — which will corrupt persistence the moment persistence exists. It also defeats `React.memo` anywhere downstream and makes undo impossible to add later.

`updateSectionRowOrders` (519–523) and `removeSection` (1271) mutate `order` on live objects for the same reason.

### 1.2 `moveItemToNewRow` copies instead of moving

```tsx
const movedItem: SmartGridItem = {
  ...sourceItem,
  id: createSlug(),   // ← a brand-new identity
  ...
};
```

Dragging an item into a new row gives it a new `id` while the original is removed. Anything keyed by item id — scroll position, per-tile state, a future undo stack — is silently orphaned. A `single: true` item dragged this way can also end up with two layout entries pointing at one definition, which is exactly what `single` exists to prevent. The other two `createSlug()` calls are correct: those create genuinely new items.

### 1.3 Stale closures — ten dependency arrays

`normalizedLayout`'s `useMemo` reads `items` but lists `[defaultLayout, persistedLayout, maxColumns]`. Nine `useCallback`s read `items` and/or `maxColumns` but list only `[updateLayout]`: `addItemToRow`, `reorderItems`, `moveItemToSectionEnd`, `moveItemToNewRow` and others. Change the item catalogue at runtime and the grid keeps placing items from the definitions it captured on first render.

`orderedSectionIds` has the opposite problem — `isEditMode` is in its dependency list and never read, so it recomputes on every edit-mode toggle for nothing.

### 1.4 `normalizeRowSpans` can leave a row overflowing

```tsx
while (diff < 0 && normalized.some((span) => span > 1)) { ... }
```

When every span is already `1` and the total still exceeds `maxColumns` — more items in a row than there are columns — the guard is false immediately and the function returns spans summing to more than the grid. The row overflows its container. Needs an explicit "more items than columns" branch that wraps rather than squeezes.

### 1.5 The initialisation effect is a hand-rolled sync that can loop

`hasInitializedLayout` + `layoutLoadCounter` reset themselves whenever `persistedLayout` changes identity. A caller passing an inline object (`persistedLayout={{...}}`) gives a new identity every render, so the flag resets every render and the layout is recomputed continuously. The effect also compares sections by a hand-written deep-equal that checks `id` and `length` but not spans, so a persisted layout differing only in column widths is treated as identical and discarded.

### 1.6 `onEditModeChange` is declared and never called

The prop exists on the interface and appears nowhere else in the file. `isEditMode` is computed as `Boolean(isEditModeProp)`, so edit mode is controlled-only with no way for the component to ask to leave it — and no uncontrolled default. There is currently no in-component affordance to exit edit mode at all.

### 1.7 Hygiene

- **34 `console.log` / `console.warn` calls** in shipping code, including one inside `normalizeColumnSpans` that fires per row per render.
- **Circular barrel import**: `import { Button, CustomIcon, IconButton } from "."`. This is the exact pattern that produced the "does not provide an export named 'default'" HMR failure in `StatCard` earlier in this session. Import the siblings directly.

### 1.8 Accessibility

- Drag-and-drop is HTML5 DnD only. **No keyboard path and no touch support** — `role=` appears 0 times, `tabIndex` 0 times, and there is 1 `onKeyDown` in 3136 lines. A dashboard editor that cannot be operated from a keyboard is unusable for a real class of users, and unusable on tablets.
- The add-item picker is a hand-rolled `fixed inset-0` overlay, not the kit's `Modal`: no focus trap, no Escape handling, no scroll lock, no restore-focus.
- Five raw `<button>` elements instead of `Button` / `IconButton`, so they miss the kit's focus rings and sizing.

---

## 2. Design-language alignment

### 2.1 `editThemeColor` → `tone`

`EDIT_THEME_COLORS` is a hand-written map of **10 tones out of 21**. Pass `teal`, `indigo`, `purple`, `pink`, `red`, `green`, `yellow`, `cyan`, `slate`, `gray`, `zinc` or `stone` and it silently falls back to blue. It also carries hardcoded `rgb: "59,130,246"` triplets that duplicate the palette in a third format.

This is the same defect class already fixed in `Picker`, `TagPicker`, `SplitView` and `StatTile`. Generate from `TRUE_COLORS`, take the classes from the theme, and drop the `rgb` strings in favour of `color-mix` / CSS variables.

### 2.2 `variant` and `size`

Neither exists. Add:

- **`variant`** — `SurfaceVariant`, the `Panel` family, for the section and tile chrome, via `getSurfaceVariantClasses`. As on `SplitView`, keep a separate `surfaceTone` defaulting to `neutral` so the accent stays legible against its own background.
- **`size`** — `ControlSize` driving the grid gap (currently a fixed `GRID_GAP_PX = 16`), tile padding, the row-span unit (fixed `ROW_SPAN_SIZE = 100`) and the type scale.

### 2.3 Hardcoded neutrals

~60 hardcoded `neutral-*` classes for headings, muted copy and dividers. These come from `getSurfaceTextTokens(variant)` and the tone palette, so copy tracks the surface — the same pass done on `SplitView`.

### 2.4 Kit primitives

Replace the hand-rolled modal with `Modal`, the raw buttons with `Button`/`IconButton`, and the "no items" copy with `EmptyState`. Add the kit's three loader treatments (`skeleton` default) for a dashboard whose tiles are still loading.

---

## 3. Persistence — the first thing to get right

Mirror `common/utils/tableStorage.ts`, which is already the right shape.

### 3.1 Extract the shared piece first

`createSafeLocalStorage` is generic — lazy `localStorage` resolution inside per-call try/catch, degrading to a no-op on SSR, private mode and quota errors. Move it to **`common/utils/safeStorage.ts`** and re-export from `tableStorage.ts` so `Table` is untouched. One implementation, two consumers.

### 3.2 `common/utils/gridStorage.ts`

Framework-agnostic, matching the table module beat for beat:

```ts
export const GRID_STORAGE_DEFAULT_PREFIX = "ui-kit:grid";
export const GRID_LAYOUT_STORAGE_VERSION = 1;

export interface GridStoredLayout { v: number; layout: SmartGridLayoutState }

export const buildGridStorageKey: (prefix: string, key: string) => string;
export const encodeStoredLayout: (layout: SmartGridLayoutState) => string;
export const decodeStoredLayout: (raw: string | null) => SmartGridLayoutState | null;
```

`decodeStoredLayout` must **validate structurally**, not just `JSON.parse`. A persisted layout is deeply nested and a half-corrupt one currently renders as a crash rather than a fallback. Drop malformed sections/rows/items individually and keep the rest, the way `sanitizeSettings` keeps valid fields.

### 3.3 Props

**Decided: match `Table` exactly.** An optional `storageKey` enables built-in persistence; without it the component is fully manual through `persistedLayout` / `onLayoutChange`. One mental model across the kit, and no new required prop.

```ts
storageKey?: string;        // enables built-in persistence
storagePrefix?: string;     // default "ui-kit:grid"
storage?: GridStorageAdapter; // default safe localStorage
autoSave?: boolean;         // default true when storageKey is set
autoSaveDebounceMs?: number; // default ~400
```

`persistedLayout` and `onLayoutChange` stay for fully-manual control. **Precedence: an explicit `persistedLayout` prop wins over storage** — a caller who passes state is the source of truth, and storage is the fallback.

### 3.4 Debounce is required, not optional

Column and row resizing fire `setLayout` **per mousemove**. Writing to `localStorage` on every frame during a drag would serialise the entire layout dozens of times a second. The existing code already defers `onLayoutChange` to `mouseup` for resizes via `resizeChangedRef` — persistence must do at least as well, and a trailing debounce covers the paths that do not.

---

## 4. Improvements and new ideas

**Directly enabled by the fixes above**

- **Undo/redo within an edit session.** Only becomes possible once state stops being mutated in place (1.1). A bounded history stack, `Ctrl+Z` / `Ctrl+Shift+Z`, cleared on save.
- **Keyboard layout editing.** The accessibility fix doubles as a power-user feature: focus a tile, arrow keys to move it, `[` / `]` to resize its span.
- **Reset to default.** With persistence there must be a way back — a `resetLayout()` handle plus a UI action that clears the stored key.

**Worth considering**

- **Named presets.** Multiple `storageKey`s under one prefix; a switcher for "Overview" / "Ops" / "Finance" views of the same tiles.
- **Responsive `maxColumns`.** Currently a single number. A per-breakpoint map (`{ base: 4, md: 8, lg: 12 }`) would make dashboards usable on narrow screens, where today a 12-column layout is unreadable.
- **Export / import layout JSON.** Falls out of the storage envelope for free and makes layouts shareable between users.
- **`readOnly` mode.** A rendered dashboard with edit affordances compiled out, rather than relying on `isEditMode={false}`.
- **Per-tile loading and error states.** A tile whose data fails should not take the dashboard with it — an error boundary per tile.

---

## 5. Phasing

**Decided: phases 1–5 run straight through**, with the optional phase 6 held back for a separate call.

Each phase is independently shippable and leaves the component working.

| Phase | Work | Why this order |
|---|---|---|
| **1. Foundations** | Remove the 34 console calls; fix the three mutation sites; fix `moveItemToNewRow`'s identity bug; correct all ten dependency arrays; fix `normalizeRowSpans` overflow; replace the barrel import; **export from `index.ts`; add the first test file** | Everything else builds on correct state. Persistence on top of mutated state would persist corruption. Exporting is what makes the rest verifiable. |
| **2. Persistence** | `safeStorage.ts` extraction; `gridStorage.ts`; the five props; debounced autosave; `persistedLayout` precedence; reset | The stated first priority, and now safe to build. |
| **3. Design language** | `tone` (generated, all 21); `variant` + `surfaceTone`; `size`; theme text tokens; safelist shapes verified against built CSS | Cosmetic-only once state is correct, so it can land without risk. |
| **4. Primitives + a11y** | Kit `Modal`, `Button`, `IconButton`, `EmptyState`; roles and labels; keyboard reordering; uncontrolled edit mode with `onEditModeChange` actually fired | Largest behavioural surface; wants the test suite from phase 1 in place. |
| **5. Demo + docs** | Registry entry, page, playground, examples (variants, tones, sizes, persistence, keyboard editing) | The component has never been demonstrated; this is also how the rest gets visually verified. |
| **6. Optional** | Undo/redo, presets, responsive columns, export/import, per-tile error boundaries | Genuine additions rather than corrections. |

## 6. Out of scope

`vue/src/components/SmartGridLayout.vue` — the Vue twin, in the same unexported state. Per the standing decision on the Vue kit, that is its own project.

---

# Progress

## Phase 1 — Foundations ✅

- **34 `console.log`/`warn` removed.** Two `console.warn`s were deliberately *restored* afterwards: "item not in `items`" and "item is inactive". A tile silently missing from a dashboard is otherwise undiagnosable from outside.
- **Three state-mutation sites fixed** (`addSpacerToRow`, `addItemToRow` ×2). `{ ...section }` copies the object, not the `rows` array inside it, so `newSection.rows[i] = …` and `newRow.items.push(…)` were landing on the object React holds as `prev`. All three are now `map`-based.
- **`updateSectionRowOrders` → `withSectionRowOrders`**, pure. It was assigning `order` onto live objects mid-render. `removeSection` renumbered the same way.
- **`moveItemToNewRow` no longer mints a new id**, so dragging into a new row is a move rather than a copy — the bug that could give a `single: true` item two layout entries.
- **All dependency arrays corrected**, verified by parsing each `useCallback` body for bare identifier reads (object keys like `items:` excluded). `orderedSectionIds` lost the `isEditMode` it never read.
- **`normalizeRowSpans`** documents the more-items-than-columns floor rather than silently returning an overflowing row.
- **Barrel cycle removed** — `Button`, `CustomIcon`, `IconButton` imported directly.
- **Exported from `components/index.ts`** with its full public type surface, and `SmartGridLayoutProps` made public. This is the change that makes everything else reachable.
- **`data-sg-row-id`, `data-sg-section-id`, `data-sg-span`** added so a rendered layout can be inspected from the DOM.
- **First test file**, 10 tests, including a deep-frozen layout that turns any in-place write into a throw.

## Phase 2 — Persistence ✅

- **`common/utils/safeStorage.ts`** extracted from `tableStorage.ts`: the localStorage wrapper, key builder and `isRecord` guard. `tableStorage` re-exports them under their original names — **Table's 48 tests pass untouched**, which is the evidence the extraction is behaviour-preserving.
- **`common/utils/gridStorage.ts`**, following the table module beat for beat: `GRID_STORAGE_DEFAULT_PREFIX = "ui-kit:grid"`, a versioned envelope, `encodeStoredLayout` / `decodeStoredLayout`.
- **`decodeStoredLayout` validates structurally**, section → row → item. Malformed parts are dropped individually; an item without an id or a placement cannot render anywhere so it goes, while a bad `span` is repaired to `1` because the component renormalises spans on load anyway. A layout decoding to zero usable sections returns `null` so the default shows instead of an empty dashboard.
- **Props:** `storageKey`, `storagePrefix`, `storage`, `autoSave`, `autoSaveDebounceMs` — matching `Table`'s opt-in model as decided.
- **`persistedLayout` wins over storage.** A caller passing state is the source of truth; storage is the fallback beneath it.
- **Writes are debounced (400ms) and flushed on unmount.** Resizing updates the layout on every mousemove, so an unthrottled write would serialise the whole dashboard dozens of times a second. The two resize paths persist on mouseup alongside their existing `onLayoutChange` call.
- 6 more tests: key composition, restore-on-mount, no-key-no-writes, prop-beats-storage, and two on decode's defensiveness including a half-corrupt layout keeping its good parts.

**State: 108 files / 2560 tests passing, `tsc` clean.**

## Phase 3 — Design language ✅

- **`EDIT_THEME_COLORS` → `EDIT_TONE_TOKENS`, generated from `TRUE_COLORS`.** The hand-written map covered **10 tones out of 21**; `teal`, `indigo`, `purple`, `pink`, `red`, `green`, `yellow`, `cyan`, `slate`, `gray`, `zinc` and `stone` all silently rendered blue. The hardcoded `rgb: "59,130,246"` triplets — a third copy of the palette in a third format — are gone; the tint is a plain alpha utility.
- **`tone`** replaces `editThemeColor`, which is kept as a deprecated alias with `tone` winning.
- **`variant`** (the `Panel` surface family) and **`surfaceTone`**, split as on `SplitView`: a whole dashboard tinted in the edit accent is a lot of colour, and the accent's job is to stand out *against* the surface. `surfaceTone` defaults to `neutral`.
- **`size`** drives grid gap, row-height unit and type scale. `GRID_GAP_PX = 16` and `ROW_SPAN_SIZE = 100` were fixed constants, so a dense dashboard and a spacious one were the same dashboard.
- Hardcoded neutrals cut from ~60 to ~25, the remainder being inside the pieces phase 4 replaced.
- All five generated class shapes were already safelisted; verified against the built CSS.

## Phase 4 — Primitives and accessibility ✅

- **The hand-rolled `fixed inset-0` overlay is now the kit's `Modal`** — it had no focus trap, no Escape handling, no scroll lock and no restore-focus. A dialog only in appearance.
- Raw `<button>`s → `Button`; the section-rename `<input>` → `Input`; the "nothing to add" copy → `EmptyState`.
- **The resize handles are keyboard operable.** They were `onMouseDown`-only, so column widths could not be changed without a pointer — and drag-and-drop has no keyboard story either, which together made the editor pointer-only. They now carry `role="separator"`, `aria-orientation`, `aria-valuenow/min/max`, a focus ring, and left/right arrow handling through a new `nudgeSpan`.
- **`onEditModeChange` is finally called.** Edit mode is controlled when `isEditMode` is passed and uncontrolled otherwise (`defaultEditMode`), with a toolbar that appears only when the component owns the state or the host asked to be told. There was previously no in-component way into or out of edit mode at all.
- **`resetLayout`** clears the stored key and returns to the shipped default — with persistence there has to be a way back.

## Phase 5 — Demo ✅

Registry entry, page, playground and two examples (`Persistence`, `Variants`). The playground uses a two-per-row layout because its preview pane is half the page and four tiles across twelve columns clips the labels; the full-width examples use all four.

**Final state: `tsc` clean, 108 files / 2572 tests passing, both builds green, `vue-tsc` clean, page renders with zero console errors.**

## Still open

- **Phase 6** — undo/redo, named presets, responsive `maxColumns`, export/import, per-tile error boundaries. Held back by agreement.
- **Drag-and-drop still has no keyboard path.** The resize handles do; moving a tile between rows does not. That is the larger half of the accessibility story and wants its own design pass.
- **`vue/src/components/SmartGridLayout.vue`** — untouched, still unexported.

## Phase 6 — plus one bug the earlier phases had left ✅

### The init sync (plan §1.5) — finally fixed

Flagged in the plan and *not* addressed in phase 1. It was worse than documented: when sections differed **while editing**, it skipped the update but still marked itself initialised, so the change was lost permanently rather than deferred.

Replaced with a **content signature** — a stable JSON string covering ids, titles, spans and row heights. This fixes all three of the original problems at once:

- inline `persistedLayout` / `items` props no longer retrigger it, because the signature is a string rather than an object identity;
- it covers spans and heights, where the old hand-written deep-equal compared ids and lengths only, so a layout differing purely in column widths was treated as identical;
- deferring while editing leaves the signature *unapplied*, so the update lands the moment edit mode ends instead of being dropped.

The two refs and the bespoke comparison are gone.

### Undo / redo

Only possible because phase 1 stopped the layout being mutated in place — a history of snapshots is worthless if the snapshots keep changing underneath you. Bounded stacks (`historyLimit`, default 50), toolbar buttons, and `Ctrl/Cmd+Z` / `Ctrl/Cmd+Shift+Z` bound only while editing. History is cleared when an edit session ends: undoing into a session the user already committed reads as the dashboard changing on its own.

### `readOnly`

Genuinely distinct from `isEditMode={false}`, which merely hides the chrome while leaving the machinery mounted and reachable. `readOnly` removes the toolbar, the drag handles and the resize grips, and edit mode cannot be entered at all.

### Per-tile error boundary

`SmartGridTileBoundary`, plus `onTileError`. Tiles are arbitrary consumer components; without a boundary one throwing tile unmounts the whole dashboard, so a single failed fetch costs the user every other tile *and* the layout editor.

One subtlety worth recording: the first implementation did not work. `{def.render()}` is evaluated in the **parent's** render, before the boundary has mounted, and an error boundary only catches what its children throw. The call had to be deferred into a child component (`TileContent`) so the throw happens inside the boundary's subtree. The test caught it immediately.

### Responsive columns

`maxColumns` now takes a per-breakpoint map as well as a number. It measures the **container**, not the viewport — a grid inside a split pane or a modal is narrower than the window, and it is the container that decides how many columns fit. Resolution falls *down* the scale, so `{ base: 4, lg: 12 }` gives 4 below 1024px rather than nothing.

### Export / import

`exportGridLayout` / `importGridLayout` in the shared module, using the same envelope the storage path writes, so an exported file can be pasted straight back or dropped into a storage key by hand. Import also accepts a bare layout without the envelope, because that is what people paste after copying out of devtools, and runs the same validation so a hand-edited file degrades to `null`.

### Also found

`ArrowUturnLeft` / `ArrowUturnRight`, which I reached for on the undo buttons, **are not in the icon registry** — they would have rendered nothing. Swapped for `ArrowLeft` / `ArrowRight`. Worth a lint rule: icon names are strings, so a typo is invisible until someone looks at the screen.

**Final state: `tsc` clean, 108 files / 2585 tests passing, both builds green, `vue-tsc` clean, page renders with zero console errors.**

## Still open

- **Drag-and-drop has no keyboard path.** Resize handles do; moving a tile between rows does not. This is the larger half of the accessibility story and wants its own design pass — it needs a grab/move/drop interaction model, not just key handlers.
- **Named presets** — the one phase 6 idea not built. It is mostly a host concern (swap the `storageKey`), so it may not need component support at all.
- **`vue/src/components/SmartGridLayout.vue`** — untouched, still unexported.

## Section reordering ✅

Drag-and-drop for sections, using the same preview treatment as items.

### The mechanism

- A **grab handle** (`⠿`) beside each section title, in edit mode only. The handle carries the drag, not the `<section>` — a draggable section would swallow every item drag starting inside it.
- Sections drag with **their own MIME type** (`application/x-smartgrid-section`) rather than sharing `text/plain` with items. The item drop handlers read `text/plain` and look the value up as an item id; a section id arriving there would miss, and every item drop zone in the grid would light up while dragging a section.
- **`reorderSections`** renumbers `order` densely from the resulting array rather than patching it. `orderedSectionIds` sorts on `order` with ties broken by id, so a gap or a duplicate would reorder silently.
- **Keyboard path**: the handle is focusable and responds to ↑/↓, so it is not another focusable element that does nothing.

### The ghost, not a hairline

First version drew a thin insertion line. Replaced with the same treatment a row gives an incoming item: a **tinted, dashed placeholder that occupies real space**, so the sections below visibly move down and the user sees the result rather than a hint of it. The dragged section is `hidden` — taken out of the flow, not faded — which is what makes the rest close up behind it and reopen at the drop position.

The ghost's height is **measured from the section actually in flight**, so the space it reserves matches what will land there; a fixed height would make everything below jump again on drop.

### Two bugs found while verifying it

- **The ghost collapsed to a hairline.** The `ref` callback re-runs right after the drag hides the section, and a `display: none` element measures `0` — so the stored height was overwritten with zero on the very render the ghost needed it. It now measures only while the section is visible, with a floor for the never-measured case.
- **jsdom silently drops `clientY`.** There is no constructible `DragEvent`, so RTL falls back to a plain `Event` and discards `clientY` from the init. Every midpoint comparison was reading `undefined < n` — always false, so every drop resolved as "after" and two tests were passing for the wrong reason. The tests now build the event with `createEvent` and define `clientY` explicitly, and stub the target's rect since jsdom reports zero-size boxes.

A reorder composes with the rest: it is **undoable** and it **persists**, both covered.

11 tests. **108 files / 2596 tests passing, `tsc` clean.**

### Verification note

The demo build is currently broken by `react/demo/src/kit-docs/components/charts/ChartPlayground.tsx:1765` (`Unexpected ")"`), another agent's in-flight edit, so the production build could not be used. Verified instead against the dev server, which lazy-loads pages and so never touches that module, driving a real drag by dispatching the events into the live page.

### Correction — section dragging did not actually work

Reported: "I tried to drag it and nothing happens." Correct, and my tests said otherwise because they dispatched synthetic events, which never exercise a real drag session. **Three separate defects**, each fatal on its own:

1. **The drag source was hidden synchronously on `dragstart`.** The browser needs the element it is dragging to stay rendered while it takes the drag image; hiding it in the same tick cancels the drag immediately. The hide is now deferred a frame via `requestAnimationFrame`, held in its own `hiddenSectionId` state rather than derived from `draggingSectionId`.

2. **The dragged section was unmounted once a `dragover` landed.** `sectionRenderOrder` filtered it out of the list to make room for the ghost — and unmounting the element a drag started from cancels the drag in every browser. It now stays in the list, `display: none` so it takes no space, and the ghost is inserted around the target instead.

3. **The item handlers swallowed the event.** Fifteen row and tile drag handlers call `stopPropagation()`, so a section drag crossing *any tile* never reached the section's own `dragover` — no ghost, and the drop was handled as an item lookup that missed. All fifteen now bail out early when `draggingSectionRef.current` is set.

A fourth, smaller one: `dragover` starts firing before React has flushed `dragstart`'s state, so a handler reading state alone saw `null`, returned early, and never called `preventDefault()` — the browser then refuses the drop for those frames. The handlers read a ref, which is set synchronously.

**Why the tests missed all of this.** They dispatched events directly at the `<section>` element, so nothing ever bubbled through a tile, nothing was ever really "in flight", and no browser was ever deciding whether to continue a drag. The new test dispatches at a **tile inside the target section** and lets it bubble — and it fails on the old code, which I verified by reverting the guards.

53 tests on the component; **108 files / 2597 passing.**

### Correction 2 — flicker, and the drop not saving

Reported: "I can not start dragging but then once I get on top of the other section it starts flickering between the ghost and the section there, eventually I can see the ghost but when I drop it it does not save."

Both symptoms came from **per-element hover handling**, and one more stale-closure bug underneath.

**The flicker was a feedback loop.** Inserting the ghost shifts the layout, which moves the target section out from under the pointer, which fires `dragleave`, which removes the ghost, which shifts it back, which fires `dragover` again. An insertion placeholder can never be driven by per-element enter/leave, because the placeholder itself changes what the pointer is over.

Replaced with a **snapshot** taken at `dragstart`: each section's midpoint in page coordinates, recorded once. Every `dragover` resolves the insertion point against that fixed snapshot, so the ghost cannot influence its own position. The handlers moved from each `<section>` to the container, which also means the pointer being over the ghost — as it usually is once the ghost is showing — no longer matters.

**The drop not saving was a stale closure.** `drop` fires immediately after `dragover`, before React re-renders, so the drop handler closed over the *previous* `sectionDragOver` — `null` on the first drop of a drag. It now mirrors into `sectionDragOverRef` and the drop reads the ref. (The same reason `draggingSectionId` already had a ref.)

Also: `event.dataTransfer.dropEffect = "move"` now guards for a missing `dataTransfer`. Synthetic events have none, and the throw killed the rest of the handler *silently* — which is what made four tests fail in a way that looked like a logic bug.

**Verified with a real drag this time.** A genuine `DragEvent` with a real `DataTransfer`, dispatched at a tile *inside* the target section and allowed to bubble, against the running dev server: `before=overview,detail` → ghost appears → `after=detail,overview`. Synthetic events at the section element would have missed all three defects.

53 component tests; **108 files / 2597 passing.**

## Editor chrome follows the surface; delete button fixed for dark

### The controls were the one part ignoring the component's own `variant`

Every editor button was pinned to `variant="outline"` or `"ghost"` with a hardcoded `color="slate"`, so the editing chrome looked identical on a glass dashboard and an elevated one — and its accent had no relationship to `tone`.

Added `EDITOR_BUTTON_FOR_SURFACE`, mapping each `SurfaceVariant` to the `ButtonVariant` that belongs on it (glass → `glass`, subtle/tonal/simple → `ghost`, the rest → `outline`), with a quieter twin for icon-only controls. Every control now takes that variant and `effectiveTone` instead of slate. Destructive actions keep `rose`, which is a semantic colour rather than a decorative one.

### The item delete button was invisible in dark mode

It was a **ghost** `IconButton` sitting on a hand-rolled chip: `bg-white/85 … dark:bg-neutral-900/85`. Measured in the browser with `html.dark` present, the computed background was still white at 0.85 alpha — the dark half never applied — so the control rendered as a pale disc with an invisible rose glyph inside it.

Rather than debug the hand-rolled chip, it is now a **solid** `IconButton` with no backdrop at all. A kit primitive carries its own light and dark treatment, and a filled rose button reads as chrome over any tile content. Verified in dark mode: clearly visible rose circles with a white glyph.

The lesson is the one already in `Learnings.md` about fills versus tints, in a new place: the moment a component needs a hand-written `dark:` pair to make a control legible, the control should be a kit primitive instead.

5 new tests. **108 files / 2602 passing, `tsc` clean.**

## `plain` — no surface at all, and now the default

Reported with a screenshot of the grid over a background image: the component's own panel drew a grey slab on top of it.

`variant` now accepts **`plain`** alongside the `Panel` family — no background, border, shadow, ring, radius **or padding** — and `plain` is the default. A dashboard is nearly always dropped into a page that already has a container of its own, so drawing a second one around it was the wrong default; asking for a surface is the exception, not the rule. `SMART_GRID_VARIANTS` is `PLAIN_SURFACE_VARIANTS`, the same list `InfoRow`, `DetailItemCard` and others already use.

Three details that follow from "the background is unknown":

- **Padding goes too.** With no surface there is nothing to inset from, so the host container owns the spacing.
- **The editor controls become `glass`.** Glass is the treatment built for an unknown backdrop — it reads on a white page and on a photograph. The other surfaces keep the mapping added in the previous pass.
- **The copy takes the translucent palette.** `getSurfaceTextTokens` is asked for `glass` rather than the solid muted one, because `neutral-500` disappears over an image.

The root `className` is composed from a filtered list rather than a template literal, so `plain` no longer leaves `class="relative   "` in the DOM.

6 new tests, plus two existing surface tests updated to request a variant explicitly now that there is no longer one by default. A `plain-by-default` example was added to the docs page showing the grid over a gradient with no panel of its own.

**108 files / 2608 passing, `tsc` clean.**

## Drop-to-delete replaces the per-tile delete button

Both per-item delete buttons are gone — the one on every tile and the one on every spacer. In their place, a drop zone in the **top-left corner, opposite the Undo / Redo / Done controls**.

Why this is better than what it replaced: a destructive control was sitting permanently on top of the user's own tile content, in the corner where a StatCard puts its icon chip. It had to be given a backdrop to be legible over arbitrary content, and that backdrop is what broke in dark mode. Moving the action to a zone removes the control from the content entirely.

- **Only present while an item is in flight.** An always-on delete target is a hazard, and there is nothing for it to say when nothing is being dragged. The toolbar row now renders when `showToolbar || (isEditMode && draggingId)`, with the right-hand controls hidden in the drag-only case.
- **Same ghost vocabulary as everywhere else** — dashed border and a tint — in rose rather than the edit accent, because this one is destructive.
- **It reacts on hover**: the border and fill intensify and the label changes from "Drop here to remove" to "Release to remove".
- **The dragged tile fades to `opacity-20` with `grayscale`** while it is over the zone, so the removal is signalled on the thing being removed as well as on the target.

`overDeleteZone` is mirrored into a ref for the same reason as the section drag state: `drop` fires before React re-renders, so a handler closing over state alone reads the value from before the last `dragover`.

7 tests replace the two that covered the old button, including the zone's absence when idle and outside edit mode, the wording change, and the dragged tile's treatment. Verified in the browser with a real `DragEvent`: the zone appears on drag, and reads "Release to remove" on hover.

**108 files / 2613 passing, `tsc` clean.**
