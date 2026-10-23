import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  ColorSwatches,
  IconButton,
  Pill,
  TaskBoard,
  ViewGrid,
  createTaskBoardHistory,
  sampleTaskBoard,
  type ControlSize,
  type PanelLoaderType,
  type SurfaceCorner,
  type SurfacePadding,
  type TaskBoardCard,
  type TaskBoardCardLayout,
  type TaskBoardColumn,
  type TaskBoardLane,
  type TaskBoardLayout,
  type TaskBoardVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { ChoiceControl, Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  panelCornerOptions,
  panelLoaderTypeOptions,
  panelPaddingOptions,
  plainSurfaceVariantOptions,
  taskBoardCardLayoutOptions,
  taskBoardLayoutOptions,
} from "../../shared/options";

const roadmap = sampleTaskBoard.roadmap();
const fieldOps = sampleTaskBoard.fieldOps();

/** Each card coloured by its first tag — the playground's stand-in for status / type. */
const TAG_TONES: Record<string, TrueColor> = {
  activation: "sky", billing: "amber", enterprise: "violet", analytics: "teal", research: "fuchsia",
  checkout: "rose", mobile: "indigo", platform: "slate", quote: "sky", retail: "amber", access: "violet",
  "cold-chain": "cyan", security: "rose", handoff: "teal", crew: "lime", safety: "red", baggage: "orange",
};
function toneFor(card: TaskBoardCard): TrueColor | undefined {
  const first = card.tags?.[0];
  const label = typeof first === "string" ? first : first?.label;
  return label ? (TAG_TONES[label] ?? "emerald") : undefined;
}

/** Ready accepts only Discovery; Blocked is locked. */
function withRules(columns: TaskBoardColumn[], wip: boolean, rules: boolean): TaskBoardColumn[] {
  return columns.map((c) => ({
    ...c,
    wipLimit: wip && (c.id === "building" || c.id === "onsite") ? (c.id === "building" ? 4 : 5) : undefined,
    accepts: rules && c.id === "ready" ? ["discovery"] : undefined,
    locked: rules && (c.id === "blocked" || c.id === "closed") ? true : undefined,
  }));
}

export const TaskBoardPlayground: React.FC = () => {
  const [log, pushLog] = useEventLog();
  const [layout, setLayout] = useState<TaskBoardLayout>("columns");
  const [cardLayout, setCardLayout] = useState<TaskBoardCardLayout>("detailed");
  const [variant, setVariant] = useState<TaskBoardVariant>("elevated");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [columnCorner, setColumnCorner] = useState<SurfaceCorner>("rounded-md");
  const [toned, setToned] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [padding, setPadding] = useState<SurfacePadding>("none");
  const [color, setColor] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [editable, setEditable] = useState(true);
  const [wip, setWip] = useState(true);
  const [rules, setRules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<PanelLoaderType>("skeleton");
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);

  const source = layout === "lanes" ? fieldOps : roadmap;
  const [cards, setCards] = useState<TaskBoardCard[]>(roadmap.cards);
  const [columns, setColumns] = useState<TaskBoardColumn[]>(roadmap.columns);
  const [lanes, setLanes] = useState<TaskBoardLane[]>(fieldOps.lanes!);
  const history = useRef(createTaskBoardHistory()).current;
  const [undoCount, setUndoCount] = useState(0);

  // Switching layout swaps the sample: the roadmap has no lanes.
  useEffect(() => {
    setCards(source.cards);
    setColumns(source.columns);
    setCardLayout(layout === "lanes" ? "compact" : "detailed");
    history.clear();
    setUndoCount(0);
  }, [layout]); // eslint-disable-line react-hooks/exhaustive-deps

  const viewColumns = useMemo(() => withRules(columns, wip, rules), [columns, wip, rules]);

  const undo = () => {
    const prev = history.undo(cards, viewColumns, layout === "lanes" ? lanes : undefined);
    if (prev) {
      setCards(prev);
      setUndoCount(history.size);
      pushLog("undo");
    }
  };
  // Ctrl/⌘+Z — the history is the app's, so the shortcut is too.
  const undoRef = useRef(undo);
  undoRef.current = undo;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        const target = e.target as HTMLElement | null;
        if (target?.closest("input, textarea, [contenteditable]")) return;
        e.preventDefault();
        undoRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <ChoiceControl label="Layout" options={taskBoardLayoutOptions} value={layout} onChange={(v) => setLayout(v as TaskBoardLayout)} />
                    <ChoiceControl label="Cards" options={taskBoardCardLayoutOptions} value={cardLayout} onChange={(v) => setCardLayout(v as TaskBoardCardLayout)} />
                    <SelectControl label="Size" options={controlSizeOptions} value={size} onChange={(v) => setSize(v as ControlSize)} />
                  </>
                ),
              },
              {
                id: "surface",
                title: "Surface",
                controls: (
                  <>
                    <SelectControl label="Variant" options={plainSurfaceVariantOptions} value={variant} onChange={(v) => setVariant(v as TaskBoardVariant)} />
                    <SelectControl label="Corner" options={panelCornerOptions} value={corner} onChange={(v) => setCorner(v as SurfaceCorner)} />
                    <SelectControl label="Column corner" options={panelCornerOptions} value={columnCorner} onChange={(v) => setColumnCorner(v as SurfaceCorner)} />
                    <SelectControl label="Padding" options={panelPaddingOptions} value={padding} onChange={(v) => setPadding(v as SurfacePadding)} />
                    <Control label="Accent">
                      <ColorSwatches selectable size="sm" value={color} onSelect={setColor} defaultExpanded />
                    </Control>
                  </>
                ),
              },
              {
                id: "rules",
                title: "Rules",
                controls: (
                  <Control label="Rules">
                    <div className="space-y-1.5">
                      <ToggleRow label="Editable" checked={editable} onChange={setEditable} />
                      <ToggleRow label="Card tones" checked={toned} onChange={setToned} />
                      <ToggleRow label="Edit mode (columns)" checked={editMode} onChange={setEditMode} />
                      <ToggleRow label="WIP limits" checked={wip} onChange={setWip} />
                      <ToggleRow label="Transition rules + locks" checked={rules} onChange={setRules} />
                    </div>
                  </Control>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <Control label="State">
                      <div className="space-y-1.5">
                        <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                        <ToggleRow label="Error" checked={error} onChange={setError} />
                        <ToggleRow label="Empty" checked={empty} onChange={setEmpty} />
                      </div>
                    </Control>
                    {loading && (
                      <ChoiceControl label="Loader type" options={panelLoaderTypeOptions} value={loaderType} onChange={(v) => setLoaderType(v as PanelLoaderType)} />
                    )}
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Drag a card, or focus one and press <strong>Space</strong> to pick it up, the <strong>arrows</strong> to move it
            and <strong>Space</strong> again to drop. <strong>Ctrl/⌘+Z</strong> undoes the last move.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-2">
          <TaskBoard
            layout={layout}
            cardLayout={cardLayout}
            cards={empty ? [] : toned ? cards.map((c) => ({ ...c, tone: toneFor(c) })) : cards}
            columns={viewColumns}
            lanes={lanes}
            priorities={source.priorities}
            editable={editable}
            editMode={editMode}
            onCardsChange={(next, move) => {
              setCards(next);
              history.push(move);
              setUndoCount(history.size);
              pushLog(`onCardsChange → ${move.cardId}: ${move.from.column} → ${move.to.column}[${move.to.index}]`);
            }}
            onColumnsChange={(next) => {
              setColumns(next);
              pushLog(`onColumnsChange → [${next.map((c) => c.id).join(", ")}]`);
            }}
            onLanesChange={setLanes}
            onCardOpen={(card) => pushLog(`onCardOpen → ${card.id}`)}
            onCardContextMenu={({ card, x, y }) => pushLog(`onCardContextMenu → ${card.id} @ ${Math.round(x)},${Math.round(y)}`)}
            onAddCard={({ column, lane }) => pushLog(`onAddCard → ${column}${lane ? ` / ${lane}` : ""}`)}
            onSelectionChange={(ids) => pushLog(`onSelectionChange → [${ids.join(", ")}]`)}
            loading={loading}
            loaderType={loaderType}
            error={error || undefined}
            onRetry={() => {
              setError(false);
              pushLog("onRetry");
            }}
            variant={variant}
            corner={corner}
            columnCorner={columnCorner}
            padding={padding}
            color={color}
            size={size}
            icon={<ViewGrid className="h-5 w-5" />}
            title={layout === "lanes" ? "FieldOps Dispatch" : "Horizon Roadmap"}
            subtitle={layout === "lanes" ? "Regional service lanes · Today" : "Q3 launch command center"}
            summary={<Pill size="sm" variant="soft" tone="slate">{cards.length} cards</Pill>}
            actions={
              <span className="relative inline-flex">
                <IconButton icon="Revert" size="sm" variant="ghost" srLabel="Undo last move" onClick={undo} disabled={undoCount === 0} />
                {undoCount > 0 && (
                  <Badge count={undoCount} size="xs" tone="slate" className="pointer-events-none absolute -top-1 -right-1" />
                )}
              </span>
            }
            height={540}
          />
          <EventLogControl log={log} emptyText="No events yet — drag, click or right-click a card." />
        </div>
      }
    />
  );
};
