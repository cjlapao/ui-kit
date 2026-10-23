# TaskBoard Component — Design

**Date:** 2026-10-23 · **Status:** draft for approval · **Scope:** `common/taskboard/` (shared
engine), `react/src/components/TaskBoard/` (React), kit-docs page
`react/demo/src/kit-docs/components/task-board/`. React only; Vue is a step behind (§11).

**Ask (Carlos):** _"Based on our Gantt component — its styles, properties, variants, tones — and
other complex components like ConnectionFlow, and looking at the design for
https://vue.primeuipro.dev/taskboard including the lane view, create our own component which
clones what they do, including loading and data contracts and real-time drag and drop, so we
could see others dragging stuff."_

**Why the real-time part:** a remote team in a meeting. Someone grabs a task on their screen; my
screen must show it being taken, *at once*, so I don't grab it too. Whoever grabs first holds it
until they drop.

**Demo (Carlos):** a kit-docs page in the same shape as `ComboboxPage` — playground, example
cards, a11y, API. No scripted fake teammate.

---

## 1. Goals, non-goals, anti-goals

**Goals**
- A kanban `TaskBoard` with two layouts from the reference: **columns** (Product Roadmap
  screenshot) and **swimlanes** (FieldOps Dispatch screenshot — columns × lane rows).
- Real-time pointer, keyboard and touch drag across columns and lanes, with a live drop indicator,
  a floating drag clone, and snap-to-slot.
- A **collaboration contract**: remote peers' drags render live on my board (their avatar on the
  card, a ghost following their target slot), and a card a peer holds is locked for me.
- A fully controlled data contract like Gantt's: data in, change events out; the board never
  mutates caller arrays.
- Loading (skeleton shaped like columns of cards), empty, and error states matching `Panel`'s.
- The full kit treatment (`docs/component-hardening-brief.md`): `Panel` container, every scale
  from `Theme.ts`, surface text via `useSurfaceText`, glass + background-image safe, light/dark,
  tests, demo page, `Learnings.md`.

**Non-goals (v1)** — see §10 for the deferred list.
- No server, persistence or CRDT. The board owns ephemeral drag/presence only; *card data* sync
  is the app's job (it feeds the new `cards` back in).
- No app-owned surfaces built in: editor dialog, context menu and filter UI are rendered by the
  app from emitted payloads (as the reference does). The demo shows how, using kit components.

**Anti-goals** — it fails even if it "works" when:
- Two people can both drop the same card (the lock must be arbitrated, not first-to-render).
- A peer who disconnects mid-drag leaves a card locked forever.
- My own drag stutters or jumps because remote events re-render the board.
- It ships with hand-written colour maps, hardcoded `text-slate-*`, or breaks on glass.

## 2. Architecture

Same split as Gantt and ConnectionFlow: the hard part is pure TS in `common/`, the React layer
renders and wires pointers.

```
common/taskboard/
├─ types.ts        data model, labels, event/payload types
├─ layout.ts       bucketCards (column × lane → ordered slots), counts, WIP state
├─ move.ts         applyMove, validateMove (transition rules, WIP, locked, permissions),
│                  resolveDropSlot (pointer → column/lane/index), keyboard move targets
├─ collab.ts       TaskBoardTransport interface, event protocol, presenceReducer
│                  (lock arbitration + TTL expiry), createBroadcastChannelTransport
├─ history.ts      pure undo/redo stack over moves
├─ tokens.ts       TrueColor → class maps (column accent, priority chip, tag, peer colour)
├─ sample.ts       roadmap fixture + field-ops fixture (the two screenshots)
└─ index.ts

react/src/components/TaskBoard/
  TaskBoard.tsx · TaskBoardHeader · TaskBoardColumn · TaskBoardLaneGrid · TaskBoardCard
  · TaskBoardDragLayer (own clone + remote ghosts) · useTaskBoardDrag · useTaskBoardCollab · index.ts
```

## 3. Data contract

```ts
interface TaskBoardCard {
  id: string;
  title: string;
  column: string;            // column id
  lane?: string;             // lane id (swimlane view)
  description?: string;      // shows the "has notes" glyph on the card
  tags?: (string | { label: string; color?: TrueColor })[];
  priority?: string;         // id into `priorities`
  assignees?: TaskBoardUser[];
  due?: string | Date | number;
  checklist?: { done: number; total: number };
  points?: number;
  locked?: boolean;          // per-card permission: cannot be moved
  color?: TrueColor;         // card accent
  data?: Record<string, unknown>; // app payload, passed back untouched
}
interface TaskBoardColumn { id; title; color?: TrueColor; wipLimit?: number; locked?: boolean;
                            collapsed?: boolean; accepts?: string[] /* allowed source column ids */ }
interface TaskBoardLane   { id; title; color?: TrueColor; collapsed?: boolean; wipLimit?: number }
interface TaskBoardPriority { id; label; color: TrueColor }
interface TaskBoardUser   { id; name; avatarUrl?; color?: TrueColor }
```

- **Card order = array order** within each column×lane bucket (Gantt's sibling-order rule).
  `bucketCards` derives the slots; the app stores one flat array.
- **Controlled:** `cards`, `columns`, `lanes` in. Out:
  - `onCardsChange(next: TaskBoardCard[], change: TaskBoardMove)` — the one commit event.
  - `onColumnsChange(next)` — collapse.
  - `onLanesChange(next)` — collapse.
  - `editable` is derived from the callbacks unless it is set (Gantt rule).
- **Guarded moves:** `onBeforeMove?(move) => boolean | Promise<boolean>`. While a promise is
  pending, the card shows in its new slot with a pending shimmer. On `false` or a rejection it
  animates back with no manual rollback. Engine validation (rules, WIP, locks) runs first and
  blocks the drop indicator itself, so an invalid slot never lights up.
- **App surfaces:**
  - `onCardOpen(card)` fires on click or Enter, for the editor.
  - `onCardContextMenu({ card, column, lane, index, x, y, event })` fires on right-click or the
    Menu key.
  - `onAddCard({ column, lane })` fires from the column's "+ Add card".
  - `onSelectionChange(ids)` fires for click, shift-click range and ctrl/cmd-click additive
    selection.
- **Filtering** stays in the app: it passes the visible cards. Focus and selection survive.
- **States:** `loading`, `error` (`ReactNode | true`) + `onRetry`, empty via `emptyState`. They
  reuse Panel's loader types (`loaderType`), so the playground follows the CONVENTIONS loading
  rule.

## 4. Layouts

- `layout="columns"` (default): horizontal row of columns. Each column has:
  - a coloured top edge in the column tone;
  - a header with the title, a count or `n / limit` WIP readout (in tone when full), and a
    collapse caret;
  - a vertically scrolling `ScrollArea` card list;
  - a footer with "+ Add card".

  A collapsed column becomes a narrow vertical strip with the rotated title and the count.
- `layout="lanes"`: a sticky header row of column titles with counts, then one row per lane.
  - The sticky left lane cell has a caret, the title and a count.
  - Each cell is a column×lane bucket and a drop target.
  - Lanes collapse independently, and cards cross lanes.
  - The body scrolls on both axes, and the lane cell and column header stay sticky (the Gantt
    sticky-left pattern).
- **Card presets** (`cardLayout`), each overridable with `renderCard(card, state)`:
  - `"detailed"` (roadmap): tags, title, priority chip, checklist, due date and notes glyph, with
    the avatar at bottom-right.
  - `"compact"` (field ops): title with the avatar at top-right, then the priority label, points
    and the first tag.
- **Header** (Gantt's header strip): `icon`, `title`, `subtitle`, `summary` (pills node — the app
  passes `Pill`s), presence avatar stack (`UserAvatar`, `+n` overflow, live from the transport),
  `actions` node.

## 5. Drag & drop (local)

Reuses the Gantt/SmartGrid drag system, so it feels identical across the kit:

- The pointer press lifts the card into a **floating clone** at the grab offset, with an accent
  ring and an opaque surface. Its origin slot becomes a **dashed placeholder** and the others
  close up.
- **The midpoint rule** picks the slot: above the hovered card's midpoint means before it, below
  means after it, and over the dragged card keeps the current target, so jitter shifts nothing.
  The live order re-derives, so cards slide in real time.
- Invalid targets (transition rule, full WIP, locked column or lane, `accepts`) show a
  not-allowed tint and no insertion line. Dropping there cancels.
- **Edge auto-scroll** works on the board's horizontal scroller and on the column or lane
  scroller.
- **Keyboard:**
  - Arrows move focus between cards and columns.
  - **Space grabs**; then arrows move the card through valid slots (left/right across columns,
    up/down within a column, Alt+up/down across lanes); Space drops; **Esc cancels**.
  - Enter opens.

  Every step is announced through a polite live region ("Moved to Ready, position 2 of 3").
- **Touch:** a long-press (250 ms) grabs, so scrolling still works.
- **Reduced motion:** clones and slides snap instead of animating.

## 6. Collaboration (real time)

The board talks to whatever transport the app hands it: `transport?: TaskBoardTransport` plus
`currentUser: TaskBoardUser`.

```ts
interface TaskBoardTransport {
  publish(event: TaskBoardCollabEvent): void;
  subscribe(handler: (event: TaskBoardCollabEvent) => void): () => void;
}
type TaskBoardCollabEvent =
  | { type: "presence"; user; at }                       // heartbeat every 5s
  | { type: "leave"; userId; at }
  | { type: "grab"; userId; cardId; at }                 // claim
  | { type: "hover"; userId; cardId; column; lane?; index; at } // throttled to 1 per frame / ≤20Hz
  | { type: "release"; userId; cardId; dropped: boolean; at };
```

- **Card data is not on this channel.** After a drop the app commits through its own backend and
  every client receives the new `cards`. The channel carries only *who holds what, and where it is
  heading*. Any WebSocket, Supabase Realtime, Firebase or Liveblocks room fits this
  publish/subscribe shape in a few lines.
- **Lock arbitration (`presenceReducer`, pure, deterministic on every client):**
  - A card is held by the earliest `grab` (`at`, tie broken by `userId`).
  - If I grab and a peer's earlier grab arrives within the race window, my drag is cancelled and
    the card springs back with a toast-free inline "Sam has this" chip. Both sides compute the same
    winner, so there is never a double drop.
  - A holder that goes quiet (no `hover`/`presence` for **8 s**) or sends `leave` loses the lock.
    That covers a closed laptop mid-drag.
- **What I see:**
  - The held card stays in place, dimmed, with the peer's avatar ring in their colour. It is not
    grabbable (cursor and `aria-disabled`).
  - A **ghost card** in the peer's colour sits in the slot they are hovering, labelled with their
    name, and slides as they move.
  - The header avatar stack lists who is online.

  Remote hovers are rendered in a separate overlay layer, so they never re-layout my own drag.
- **Reference transport:** `createBroadcastChannelTransport(roomId)` syncs browser tabs on one
  machine. It needs no server, so the feature is testable and demonstrable.
- `presenceReducer` is exported, so an app can show "who's on the board" elsewhere.

## 7. History

`createTaskBoardHistory()` in `history.ts` is a pure command stack of `TaskBoardMove`s, with
`undo(cards)`/`redo(cards)` returning new arrays. The board does not own it, because undo must go
through the app's backend too. The demo wires it to the header's undo button with a count badge
(screenshot) and to Ctrl/Cmd+Z / Shift+Z.

## 8. Theming

- **Container:** renders `Panel` and passes through `variant` (all eight `SURFACE_VARIANTS`,
  default `elevated`), `tone`, `corner`, `padding`, `glassOpacity`, `vibrancy` and `specularMode`.
  There is also a `plain` variant for embedding in an app's own card.
- **Columns, lanes and cards:**
  - Columns, lanes and card accents take `TrueColor`.
  - Column wells and cards use surface tokens, so they go translucent on glass.
  - Copy colour comes from `useSurfaceText()`, so the body is a child of Panel.
- **`size`** (`ControlSize` sm/md/lg) scales card padding, type and column width. **`color`** is
  the accent for focus, selection and the drop line.
- All token maps are generated from `TRUE_COLORS` in `tokens.ts`, and the dynamic classes are
  added to `scripts/generate-safelist.mjs`.
- **i18n:** every built-in string ("Add card", "Loading board", the live-region announcements and
  "{name} is moving this") goes through `useKitT` catalogs, and `labels` overrides them. RTL
  mirrors the columns and arrow keys.

## 9. Docs page (`kit-docs/components/task-board/`)

Same shape as `ComboboxPage`: `PageHeader`, then `TaskBoardPlayground`, then Examples, then Key
Accessibility, then API (`PropsTable`). Register it in `registry.ts`.

**Playground controls:**
- Selects over the runtime lists: variant, corner, padding, accent, size.
- `MultiToggle`s: layout (columns/lanes) and card layout.
- Toggles: editable, WIP limits, transition rules, loading (+ loader type), error, empty.
- A glass block for the see-through variants.

**Example cards:**
1. **Product roadmap:** the columns view from screenshot 1, with editor (`SidePanel`) and context
   menu (`DropdownMenu`: Edit, Move to, Duplicate, Delete) wired.
2. **Field operations:** the lanes view from screenshot 2.
3. **Rules:** WIP limits, `accepts` transitions, a locked column, and `onBeforeMove` with an async
   approval.
4. **Custom cards:** `renderCard`.
5. **States:** loading, empty and error.
6. **Live collaboration:** the BroadcastChannel transport. The card says "open this page in a
   second tab and drag". It is a real second session, not a scripted user.

## 10. Deferred to v2

- Column drag-reorder
- Column groups / phases with group WIP
- Multi-card drag
- Per-column virtualisation
- Drag-to-archive
- JSON/CSV/PDF export
- Generic `dataKey`/`columnField` mapping (v1 uses the fixed card shape above; apps map at the
  edge)

## 11. Vue

**React only for now (Carlos, 2026-10-23).** Vue is a step behind. The engine lives in `common/`
so a later Vue port renders against the same logic, as Gantt's does. Record this in
`Learnings.md` and the docs page.

## 12. Verification

- Engine unit tests:
  - `bucketCards`;
  - `applyMove` and `validateMove` across the rule matrix;
  - `resolveDropSlot` midpoint cases;
  - keyboard targets;
  - `presenceReducer` races, ties, TTL expiry and leave;
  - history.
- Component tests:
  - the variant/tone matrix;
  - controlled commits;
  - a guarded move that is rejected rolls back;
  - a remote-held card is not grabbable;
  - keyboard grab/move/drop and announcements;
  - the loading/empty/error states.
- A headless render over the demo backdrop in light and dark, glass included, plus a two-tab
  BroadcastChannel check in Chrome.
