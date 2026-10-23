import { useRef, useState } from "react";
import {
  Button,
  DropdownMenu,
  Input,
  Pill,
  Select,
  SidePanel,
  TaskBoard,
  ViewGrid,
  sampleTaskBoard,
  type DropdownMenuOption,
  type TaskBoardCard,
  type TaskBoardContextMenuPayload,
} from "@cjlapao/ui-kit";

/**
 * The columns view. The board renders cards; the app owns every surface
 * around them — here a SidePanel editor on click / Enter, and a DropdownMenu
 * anchored where the right-click (or Shift+F10) happened.
 */
const sample = sampleTaskBoard.roadmap();

export default function ProductRoadmap() {
  const [cards, setCards] = useState(sample.cards);
  const [editing, setEditing] = useState<TaskBoardCard | null>(null);
  const [menu, setMenu] = useState<TaskBoardContextMenuPayload | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const shipping = cards.filter((c) => c.column === "building").length;
  const blocked = cards.filter((c) => c.column === "blocked").length;

  const menuItems: DropdownMenuOption[] = menu
    ? [
        { value: "edit", label: "Edit card", icon: "Edit" },
        ...sample.columns
          .filter((c) => c.id !== menu.column)
          .map((c) => ({ value: `move:${c.id}`, label: `Move to ${c.title}`, icon: "ArrowRight" })),
        { value: "duplicate", label: "Duplicate", icon: "Copy" },
        { value: "delete", label: "Delete", icon: "Trash", danger: true },
      ]
    : [];

  const onMenu = (item: DropdownMenuOption) => {
    if (!menu) return;
    const { card } = menu;
    if (item.value === "edit") setEditing(card);
    if (item.value === "duplicate") setCards((cs) => [...cs, { ...card, id: `${card.id}-copy-${cs.length}`, title: `${card.title} (copy)` }]);
    if (item.value === "delete") setCards((cs) => cs.filter((c) => c.id !== card.id));
    if (item.value.startsWith("move:")) {
      const column = item.value.slice(5);
      setCards((cs) => [...cs.filter((c) => c.id !== card.id), { ...card, column }]);
    }
    setMenu(null);
  };

  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={sample.columns}
        priorities={sample.priorities}
        onCardsChange={setCards}
        onCardOpen={setEditing}
        onCardContextMenu={setMenu}
        onAddCard={({ column }) =>
          setCards((cs) => [...cs, { id: `new-${cs.length}`, title: "Untitled initiative", column }])
        }
        icon={<ViewGrid className="h-5 w-5" />}
        title="Horizon Roadmap"
        subtitle="Q3 launch command center"
        summary={
          <>
            <Pill size="sm" variant="soft" tone="slate">{cards.length} initiatives</Pill>
            <Pill size="sm" variant="soft" tone="emerald">{shipping} shipping</Pill>
            <Pill size="sm" variant="soft" tone="orange">{blocked} blocked</Pill>
          </>
        }
        height={560}
      />

      {/* Zero-size anchor parked where the menu was asked for. */}
      <div ref={anchorRef} className="fixed h-0 w-0" style={{ left: menu?.x ?? 0, top: menu?.y ?? 0 }} />
      <DropdownMenu anchorRef={anchorRef} open={menu !== null} onClose={() => setMenu(null)} items={menuItems} onSelect={onMenu} />

      <SidePanel
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit initiative"
        subtitle={editing?.id}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="soft" color="slate" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (editing) setCards((cs) => cs.map((c) => (c.id === editing.id ? editing : c)));
                setEditing(null);
              }}
            >
              Save
            </Button>
          </div>
        }
      >
        {editing && (
          <div className="flex flex-col gap-4 p-1">
            <Input
              aria-label="Title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
            <Select
              aria-label="Priority"
              value={editing.priority ?? ""}
              onChange={(e) => setEditing({ ...editing, priority: e.target.value || undefined })}
            >
              <option value="">No priority</option>
              {sample.priorities.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </Select>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
