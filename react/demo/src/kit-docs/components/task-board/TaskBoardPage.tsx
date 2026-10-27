import React from "react";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TaskBoardPlayground } from "./TaskBoardPlayground";
import ProductRoadmap from "./examples/ProductRoadmap";
import productRoadmapCode from "./examples/ProductRoadmap.tsx?raw";
import FieldOperations from "./examples/FieldOperations";
import fieldOperationsCode from "./examples/FieldOperations.tsx?raw";
import Rules from "./examples/Rules";
import rulesCode from "./examples/Rules.tsx?raw";
import CustomCards from "./examples/CustomCards";
import customCardsCode from "./examples/CustomCards.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import EditMode from "./examples/EditMode";
import editModeCode from "./examples/EditMode.tsx?raw";
import CardTones from "./examples/CardTones";
import cardTonesCode from "./examples/CardTones.tsx?raw";
import LiveCollaboration from "./examples/LiveCollaboration";
import liveCollaborationCode from "./examples/LiveCollaboration.tsx?raw";

const TRANSPORT_CODE = `import type { TaskBoardTransport } from "@cjlapao/ui-kit";

// Any pub/sub room fits. A WebSocket room, for example:
function socketTransport(socket: WebSocket): TaskBoardTransport {
  return {
    publish: (event) => socket.send(JSON.stringify(event)),
    subscribe(handler) {
      const onMessage = (e: MessageEvent) => handler(JSON.parse(e.data));
      socket.addEventListener("message", onMessage);
      return () => socket.removeEventListener("message", onMessage);
    },
  };
}

<TaskBoard
  cards={cards}                 // your data — saved through your backend
  columns={columns}
  onCardsChange={save}
  transport={socketTransport(socket)}
  currentUser={{ id: me.id, name: me.name }}
/>`;

export const TaskBoardPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Task Board"
      description="A kanban board in two layouts — columns, or columns crossed with swimlanes — with real-time drag and drop by pointer, touch and keyboard. Locks, WIP limits and transition rules are enforced before a card moves, a guarded move can wait on your server, and a collaboration channel shows teammates' drags live: the card they hold is locked on your screen and a ghost shows where it is going. The board is a Panel, so every surface variant, corner and glass setting comes with it. React ships first; the Vue kit is a step behind."
    />
    <TaskBoardPlayground />

    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Product roadmap"
        description="The columns view with detailed cards. Click or press Enter to open the editor (a SidePanel the app owns); right-click or Shift+F10 for a menu anchored at the payload's x / y. Summary pills and the add-card buttons are plain props."
        code={productRoadmapCode}
        filename="ProductRoadmap.tsx"
      >
        <ProductRoadmap />
      </ExampleCard>
      <ExampleCard
        title="Field operations (swimlanes)"
        description={'`layout="lanes"` crosses the columns with `lanes`. Cards move across lanes as freely as across columns, each lane collapses on its own, and the column header and lane labels stay put while the grid scrolls.'}
        code={fieldOperationsCode}
        filename="FieldOperations.tsx"
      >
        <FieldOperations />
      </ExampleCard>
      <ExampleCard
        title="Rules and guarded moves"
        description="`accepts`, `wipLimit` and `locked` are checked by the engine, so a refused bucket turns red and never previews the card. `onBeforeMove` adds your own check — sync or async — and a refusal puts the card back with no rollback code."
        code={rulesCode}
        filename="Rules.tsx"
      >
        <Rules />
      </ExampleCard>
      <ExampleCard
        title="Edit the board"
        description="`editMode` unlocks the layout: every column header gets a grip to drag it to a new position (or Space, arrows, Space from the keyboard) and an edit button for its properties — name, colour, WIP limit, max items, lock, and which columns it accepts cards from — and an Add column slot follows the last column. Both report through `onColumnsChange`. Outside edit mode the layout is fixed — cards still move as usual."
        code={editModeCode}
        filename="EditMode.tsx"
      >
        <EditMode />
      </ExampleCard>
      <ExampleCard
        title="Card tones and corners"
        description="`tone` on a card tints its surface, so every card can carry its own colour — status, type, owner. It survives glass (a translucent tint) and the drag clone. `columnCorner` rounds the column wells on the same container scale as the board's `corner`; both default to md."
        code={cardTonesCode}
        filename="CardTones.tsx"
      >
        <CardTones />
      </ExampleCard>
      <ExampleCard
        title="Custom cards"
        description="`renderCard` swaps a card's body; the shell (drag, focus, selection, teammate ring) stays the board's, and the state argument tells the body what is happening to it."
        code={customCardsCode}
        filename="CustomCards.tsx"
      >
        <CustomCards />
      </ExampleCard>
      <ExampleCard
        title="Loading, empty and error"
        description="Loading draws a skeleton shaped like the board. Error replaces the columns with the message and a Retry. An empty board keeps its columns, so Add card is still there."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Live collaboration"
        description="Open this page in a second tab and drag a card. The other tab locks it, shows your name on it, and moves a ghost to wherever you are pointing; drop, and the card lands there. Whoever grabbed first wins, on every screen, and a tab that closes mid-drag lets go after eight seconds."
        code={liveCollaborationCode}
        filename="LiveCollaboration.tsx"
      >
        <LiveCollaboration />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The board is a <C>role="application"</C> region named by <C>kit.taskboard.root</C> with{" "}
          <C>aria-roledescription="task board"</C>. Each column (or column × lane cell) is a <C>role="group"</C> named
          by its title and card count, and each card is a <C>role="button"</C> with{" "}
          <C>aria-roledescription="card"</C>, named by its title.
        </p>
        <p>
          Moves are spoken through a polite live region: picking a card up, every step ("Moved to Discovery,
          position 1 of 4"), the drop and a cancel. A card a teammate holds gets <C>aria-disabled</C> and a
          visually hidden "{"{name}"} is moving this"; a pending guarded move sets <C>aria-busy</C> on the card.
        </p>
        <A11yCode code={TRANSPORT_CODE} filename="transport.tsx" />
      </A11yTopic>
      <KeyboardSupportTable
        bindings={[
          { keys: ["Tab"], action: "Moves into the board — one card is in the tab order at a time (roving tabindex)." },
          { keys: ["↑ / ↓"], action: "Moves focus to the previous / next card in the column." },
          { keys: ["← / →"], action: "Moves focus to the nearest card in the previous / next column (mirrored in RTL)." },
          { keys: ["Alt", "↑ / ↓"], action: "Moves focus to the previous / next lane." },
          { keys: ["Space"], action: "Picks the focused card up; with a card held, drops it." },
          { keys: ["Arrows (held)"], action: "Moves the held card through valid slots only — full, locked and refused columns are skipped. Alt+↑/↓ crosses lanes." },
          { keys: ["Esc"], action: "Cancels the move; the card goes back where it was." },
          { keys: ["Enter"], action: "Opens the card (onCardOpen)." },
          { keys: ["Shift", "F10"], action: "Opens the context menu (onCardContextMenu); the Menu key does the same." },
          { keys: ["Space (grip)"], action: "Edit mode: picks the column up; ← / → move it one position (mirrored in RTL); Space drops; Esc or Tab cancels." },
        ]}
      />
      <A11yTopic title="Internationalization">
        <p>
          Every built-in string — "Add card", the counts, the announcements, "{"{name}"} is moving this" — is a{" "}
          <C>kit.taskboard.*</C> key in the kit catalogs (en, de, es, fr, pt), and <C>labels</C> overrides any of
          them per board. Card titles, column titles and lane titles are your data. Due dates format with the kit
          locale. Inside a <C>dir="rtl"</C> container the columns run right to left and the arrow keys follow.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        { name: "cards / columns / lanes", type: "TaskBoardCard[] / TaskBoardColumn[] / TaskBoardLane[]", description: "The data, controlled. Order inside a column × lane is the order of the cards array — there is no second ordering to keep in sync." },
        { name: "onCardsChange", type: "(next, move) => void", description: "The single commit event: the next cards array, and the move that produced it (ready for your undo history or your API)." },
        { name: "onColumnsChange / onLanesChange", type: "(next) => void", description: "Collapse changes — and, in edit mode, column reorders and added columns. Omit one and its carets disappear." },
        { name: "maxItems", type: "number", description: "Board-wide hard cap on cards per column; a column's own `maxItems` overrides it. At the cap the column's Add card button disappears and drops into it are refused (the header reads count / max when there is no WIP limit)." },
        { name: "column.maxItems", type: "number", description: "Per column: overrides the board's maxItems. Editable in edit mode's column editor; empty falls back to the board default." },
        { name: "editMode", type: "boolean", default: "false", description: "Layout editing: a drag grip and an edit button (name, colour, WIP limit, lock, accepted sources) on every column header, and an Add column slot after the last column (columns and lanes layouts). Needs onColumnsChange; the new column's id is slugged from its name and kept unique." },
        { name: "onBeforeMove", type: "(move) => boolean | Promise<boolean>", description: "Guard a move after the engine rules pass. While it is pending the card waits in its new slot; false or a throw puts it back." },
        { name: "editable", type: "boolean", default: "!!onCardsChange", description: "Pointer and keyboard moves. Selection, focus and opening still work on a read-only board." },
        { name: "layout", type: "TaskBoardLayout", default: '"columns"', description: '"lanes" crosses the columns with `lanes`.' },
        { name: "cardLayout / renderCard", type: "TaskBoardCardLayout / (card, state) => ReactNode", default: '"detailed"', description: "A preset card body, or your own. The card shell stays the board's." },
        { name: "priorities", type: "TaskBoardPriority[]", description: "What `card.priority` ids resolve to: label and colour." },
        { name: "onCardOpen / onCardContextMenu / onAddCard", type: "callbacks", description: "App-owned surfaces. The context-menu payload carries the card, column, lane, index, x / y and the event." },
        { name: "selectedIds / onSelectionChange", type: "string[] / (ids) => void", description: "Click, Ctrl/⌘-click and Shift-click (range within a column). Uncontrolled when selectedIds is omitted." },
        { name: "transport / currentUser", type: "TaskBoardTransport / TaskBoardUser", description: "The collaboration channel: presence, grabs and drag targets only — never card data. Without both, nothing runs." },
        { name: "icon / title / subtitle / summary / actions", type: "ReactNode", description: "The header strip. Online teammates appear between summary and actions." },
        { name: "loading / loaderType", type: "boolean / PanelLoaderType", default: 'false / "skeleton"', description: "The skeleton is shaped like the board; any other type overlays Panel's loader." },
        { name: "error / onRetry / emptyState", type: "ReactNode | boolean / () => void / ReactNode", description: "true shows the built-in message. The empty state sits above the columns, which stay." },
        { name: "card.tone", type: "TrueColor", description: "Per card: tints that card's surface (a solid tint, or a translucent one on glass boards), so cards can be told apart by colour. Omitted keeps the neutral card." },
        { name: "columnCorner", type: "SurfaceCorner", default: '"rounded-md"', description: "Radius of the column wells, collapsed strips and skeleton included — the container scale `corner` uses." },
        { name: "variant", type: "TaskBoardVariant", default: '"elevated"', description: "Any Panel surface, or plain for no chrome. Translucent surfaces switch the wells, cards and sticky headers to glass." },
        { name: "tone / corner / padding / glassOpacity / vibrancy / specularMode", type: "Panel props", default: 'corner "rounded-md", padding "none"', description: "Passed to the Panel the board renders." },
        { name: "color", type: "TrueColor", default: '"blue"', description: "Accent for focus, selection, the drag clone, and the column edge when a column has no colour of its own." },
        { name: "size", type: "ControlSize", default: '"md"', description: "Column width and card density, from xs (232 px) to xl (352 px)." },
        { name: "columnWidth", type: 'number | string', default: '"auto"', description: "Overrides the shared expanded-column width. Numbers are pixels; CSS lengths such as `20rem` are accepted. `auto` keeps the width from size without changing card density." },
        { name: "labels", type: "Partial<TaskBoardLabels>", description: "Per-board overrides of the kit.taskboard strings." },
        { name: "height / className", type: "number | string / string", description: "The columns scroll inside the height." },
      ]}
    />
  </div>
);

export default TaskBoardPage;
