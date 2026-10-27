/**
 * TaskBoard — a kanban board with columns or swimlanes, real-time drag and
 * drop, and a collaboration layer that shows teammates' drags live.
 *
 * Built on the framework-agnostic engine in `common/taskboard`. Fully
 * controlled: `cards` / `columns` / `lanes` in, `onCardsChange` /
 * `onColumnsChange` / `onLanesChange` out. Editors, context menus and filters
 * stay in the app — the board emits the payloads they need.
 *
 * Usage:
 * ```tsx
 * <TaskBoard
 *   cards={cards}
 *   columns={columns}
 *   onCardsChange={(next) => setCards(next)}
 *   title="Horizon Roadmap"
 * />
 * ```
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import classNames from "classnames";
import {
  applyMove,
  uniqueColumnId,
  peerColor,
  bucketCards,
  bucketKey,
  columnCount,
  type TaskBoardCard,
  type TaskBoardCardLayout,
  type TaskBoardColumn,
  type TaskBoardLabels,
  type TaskBoardLane,
  type TaskBoardLayout,
  type TaskBoardMove,
  type TaskBoardPriority,
  type TaskBoardTransport,
  type TaskBoardUser,
  type TrueColor,
} from "../../../../common/taskboard";
import { getSurfaceCornerClass, type ControlSize, type PlainSurfaceVariant } from "../../theme/Theme";
import type { GlassOpacity, GlassVibrancy } from "../../theme/glass";
import { useSurfaceText } from "../../contexts/SurfaceContext";
import { useKitEngine } from "../../i18n";
import Panel, {
  type PanelCorner,
  type PanelLoaderType,
  type PanelPadding,
  type PanelSpecularMode,
} from "../Panel";
import Button from "../Button";
import { ScrollArea } from "../ScrollArea";
import { TaskBoardColumn as Column } from "./TaskBoardColumn";
import { TaskBoardHeader } from "./TaskBoardHeader";
import { TaskBoardLaneGrid } from "./TaskBoardLaneGrid";
import { TaskBoardDragLayer } from "./TaskBoardDragLayer";
import { useTaskBoardDrag } from "./useTaskBoardDrag";
import { useTaskBoardKeyboard } from "./useTaskBoardKeyboard";
import { useTaskBoardColumnDrag } from "./useTaskBoardColumnDrag";
import { useFlip } from "./useFlip";
import { TaskBoardAddColumn, TaskBoardColumnClone } from "./TaskBoardColumnEdit";
import { useTaskBoardCollab } from "./useTaskBoardCollab";
import { TaskBoardRemoteGhosts } from "./TaskBoardRemoteGhosts";
import { TaskBoardSkeleton } from "./TaskBoardSkeleton";
import { useTaskBoardText } from "./labels";
import {
  TASKBOARD_SIZES,
  TaskBoardContext,
  type TaskBoardCardState,
  type TaskBoardContextMenuPayload,
  type TaskBoardContextValue,
} from "./context";

/** The board's container surface — any Panel variant, or `plain` (no chrome). */
export type TaskBoardVariant = PlainSurfaceVariant;
export type TaskBoardCorner = PanelCorner;
export type TaskBoardPadding = PanelPadding;
export type TaskBoardColumnWidth = number | string;

export interface TaskBoardProps {
  /** The cards (controlled). Order inside a column × lane is array order. */
  cards: TaskBoardCard[];
  columns: TaskBoardColumn[];
  /** Swimlanes — used by `layout="lanes"`. */
  lanes?: TaskBoardLane[];
  priorities?: TaskBoardPriority[];
  /** @default "columns" */
  layout?: TaskBoardLayout;
  /** @default "detailed" */
  cardLayout?: TaskBoardCardLayout;
  /** Replace a card's body. The card shell (drag, focus, selection) stays. */
  renderCard?: (card: TaskBoardCard, state: TaskBoardCardState) => ReactNode;

  /** The single commit event: the next cards array and the move that made it. */
  onCardsChange?: (next: TaskBoardCard[], move: TaskBoardMove) => void;
  onColumnsChange?: (next: TaskBoardColumn[]) => void;
  onLanesChange?: (next: TaskBoardLane[]) => void;
  /**
   * Guard a move. Return / resolve `false` (or throw) to refuse it — the card
   * goes back without any rollback on your side. Engine rules (locks, WIP,
   * `accepts`) are checked before this is called.
   */
  onBeforeMove?: (move: TaskBoardMove) => boolean | Promise<boolean>;
  /** Pointer / keyboard moves. Defaults to `true` when `onCardsChange` is set. */
  editable?: boolean;
  /**
   * Board-wide cap on cards per column; a column's own `maxItems` overrides
   * it. At the cap the column's Add card button disappears and drops into it
   * are refused.
   */
  maxItems?: number;
  /**
   * Board layout editing: an "Add column" slot after the last column and a
   * drag grip on every column header (pointer and keyboard). Needs
   * `onColumnsChange`, which receives the new order / the added column.
   * Off by default — the layout is fixed until the app turns this on.
   */
  editMode?: boolean;

  /** Click or Enter on a card — open your editor. */
  onCardOpen?: (card: TaskBoardCard) => void;
  /** Right-click or the Menu key — render your menu at x / y. */
  onCardContextMenu?: (payload: TaskBoardContextMenuPayload) => void;
  /** Shows a column's "+ Add card" button when set. */
  onAddCard?: (target: { column: string; lane: string | null }) => void;
  /** Controlled selection. Uncontrolled when omitted. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;

  /** Collaboration channel — see `TaskBoardTransport`. */
  transport?: TaskBoardTransport;
  /** Who you are on the channel. Required for `transport` to do anything. */
  currentUser?: TaskBoardUser;

  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Summary pills between the title and the avatars. */
  summary?: ReactNode;
  actions?: ReactNode;

  loading?: boolean;
  /** `true` shows the built-in message; a node replaces it. */
  error?: ReactNode | boolean;
  onRetry?: () => void;
  /** Shown above the columns when there are no cards. */
  emptyState?: ReactNode;

  /** @default "elevated" */
  variant?: TaskBoardVariant;
  tone?: TrueColor;
  /** The board container's radius. @default "rounded-md" */
  corner?: TaskBoardCorner;
  /** Radius of the column wells — the same container scale as `corner`. @default "rounded-md" */
  columnCorner?: TaskBoardCorner;
  /** @default "none" */
  padding?: TaskBoardPadding;
  glassOpacity?: GlassOpacity;
  vibrancy?: GlassVibrancy;
  specularMode?: PanelSpecularMode;
  /** @default "skeleton" — a board-shaped skeleton; other types overlay Panel's loader. */
  loaderType?: PanelLoaderType;
  /** Accent for focus, selection and the drop line. @default "blue" */
  color?: TrueColor;
  /** Column width and card density. @default "md" */
  size?: ControlSize;
  /** Shared expanded-column width. `auto` keeps the width from `size`. @default "auto" */
  columnWidth?: TaskBoardColumnWidth;
  labels?: Partial<TaskBoardLabels>;
  className?: string;
  /** Board height (the columns scroll inside it). */
  height?: number | string;
}

/** How long the "Ben has this" note stays on a card after a lost grab race. */
const NOTICE_MS = 2000;
const SOLID_CARD = "bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10";
const GLASS_CARD = "bg-white/70 shadow-sm ring-1 ring-white/60 backdrop-blur-md dark:bg-white/10 dark:ring-white/10";
const SOLID_WELL = "bg-black/[0.03] dark:bg-white/[0.04]";
const GLASS_WELL = "bg-white/25 dark:bg-white/5";
const SOLID_STICKY = "bg-white dark:bg-neutral-900";
const GLASS_STICKY = "bg-white/80 backdrop-blur-md dark:bg-neutral-900/70";

type BodyProps = TaskBoardProps & { surfaceVariant: Exclude<TaskBoardVariant, "plain"> };

/** Everything inside the container — a child of Panel so it reads Panel's surface. */
const TaskBoardBody: React.FC<BodyProps> = (props) => {
  const {
    cards,
    columns,
    lanes,
    layout = "columns",
    priorities,
    cardLayout = "detailed",
    renderCard,
    onCardsChange,
    onColumnsChange,
    onLanesChange,
    onBeforeMove,
    editable,
    editMode = false,
    maxItems,
    onCardOpen,
    onCardContextMenu,
    onAddCard,
    selectedIds,
    onSelectionChange,
    transport,
    currentUser,
    icon,
    title,
    subtitle,
    summary,
    actions,
    loading,
    loaderType = "skeleton",
    error,
    onRetry,
    emptyState,
    color = "blue",
    size = "md",
    columnWidth = "auto",
    labels,
    columnCorner = "rounded-md",
    surfaceVariant,
  } = props;
  const surface = useSurfaceText();
  const text = useTaskBoardText(labels);
  const { locale } = useKitEngine();
  const sizeTokens = TASKBOARD_SIZES[size] ?? TASKBOARD_SIZES.md;
  const normalizedColumnWidth =
    typeof columnWidth === "string" ? columnWidth.trim() : columnWidth;
  const resolvedColumnWidth =
    normalizedColumnWidth === "auto" || normalizedColumnWidth === "" ||
    (typeof normalizedColumnWidth === "number" &&
      (!Number.isFinite(normalizedColumnWidth) || normalizedColumnWidth <= 0))
      ? sizeTokens.columnWidth
      : normalizedColumnWidth;
  const wellSurface = surface.translucent ? GLASS_WELL : SOLID_WELL;
  const columnCornerClass = getSurfaceCornerClass(columnCorner);
  const rootRef = useRef<HTMLDivElement>(null);
  const isEditable = editable ?? Boolean(onCardsChange);
  const laneView = layout === "lanes" && Boolean(lanes?.length);
  const viewLanes = laneView ? lanes : undefined;

  // One commit path for pointer and keyboard moves: applied to the latest
  // cards, so a remote commit that landed mid-drag is never overwritten.
  const commitMove = (move: TaskBoardMove) => onCardsChange?.(applyMove(cards, move, columns, viewLanes), move);
  const collab = useTaskBoardCollab(transport, currentUser);
  const selfId = currentUser?.id;
  const { drag, pending, previewCards, cardHandlers, cancel, finish, keyboardGrab, keyboardMove } = useTaskBoardDrag({
    cards,
    columns,
    lanes: viewLanes,
    editable: isEditable,
    heldBy: collab.heldBy,
    selfId,
    maxItems,
    onBeforeMove,
    onCommit: commitMove,
    onDragStart: collab.grab,
    onDragTarget: (cardId, slot) => slot && collab.hover(cardId, slot),
    onDragEnd: collab.release,
  });

  // Lost a grab race: a peer's earlier grab arrived after ours started. Every
  // client computes the same winner, so we let go and say who has it.
  const [notice, setNotice] = useState<{ cardId: string; text: string; color: TrueColor } | null>(null);
  useEffect(() => {
    if (!drag || !selfId) return;
    const holder = collab.heldBy.get(drag.cardId);
    if (!holder || holder === selfId) return;
    const peer = collab.userById(holder);
    cancel("held");
    setNotice({ cardId: drag.cardId, text: text("heldShort", { name: peer.name }), color: peer.color ?? peerColor(peer.id) });
  }, [collab, drag, selfId, cancel, text]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), NOTICE_MS);
    return () => clearTimeout(t);
  }, [notice]);
  const keyboard = useTaskBoardKeyboard({
    rootRef,
    cards,
    viewCards: previewCards,
    columns,
    lanes: viewLanes,
    text,
    drag,
    keyboardGrab,
    keyboardMove,
    finish,
    cancel,
    heldBy: collab.heldBy,
    selfId,
    maxItems,
    onCardContextMenu,
    selectedIds,
    onSelectionChange,
  });
  const selected = useMemo(() => new Set(keyboard.selection), [keyboard.selection]);
  const columnEditing = Boolean(editMode && onColumnsChange);
  const columnDrag = useTaskBoardColumnDrag({
    rootRef,
    columns,
    enabled: columnEditing,
    text,
    announce: keyboard.announce,
    onCommit: (next) => onColumnsChange?.(next),
  });
  const viewColumns = columnDrag.previewColumns;
  useFlip(rootRef, viewColumns.map((c) => c.id).join("|"));
  const editColumn = useCallback(
    (next: TaskBoardColumn) => onColumnsChange?.(columns.map((c) => (c.id === next.id ? next : c))),
    [columns, onColumnsChange],
  );
  const addColumn = (title: string) => onColumnsChange?.([...columns, { id: uniqueColumnId(title, columns), title }]);
  const keyboardProps = keyboard.cardProps;

  const heldPeer = useCallback(
    (cardId: string) => {
      const holder = collab.heldBy.get(cardId);
      return holder && holder !== selfId ? collab.userById(holder) : undefined;
    },
    [collab, selfId],
  );

  const ctx = useMemo<TaskBoardContextValue>(
    () => ({
      text,
      surface,
      color,
      size: sizeTokens,
      columnWidth: resolvedColumnWidth,
      cardLayout,
      priorities: new Map((priorities ?? []).map((p) => [p.id, p])),
      locale,
      editable: isEditable,
      renderCard,
      onCardOpen,
      onCardContextMenu,
      onAddCard,
      cardSurface: surface.translucent ? GLASS_CARD : SOLID_CARD,
      wellSurface,
      columnCornerClass,
      columnGripProps: columnEditing ? columnDrag.gripProps : undefined,
      draggingColumnId: columnDrag.drag?.id ?? null,
      onEditColumn: columnEditing ? editColumn : undefined,
      allColumns: columns,
      boardMaxItems: maxItems,
      stickySurface: surface.translucent ? GLASS_STICKY : SOLID_STICKY,
      cardState: (card) => ({
        held: heldPeer(card.id),
        notice: notice?.cardId === card.id ? notice.text : undefined,
        noticeColor: notice?.cardId === card.id ? notice.color : undefined,
        dragging: drag?.cardId === card.id && !drag.keyboard,
        grabbed: drag?.cardId === card.id && Boolean(drag.keyboard),
        selected: selected.has(card.id),
        pending: pending?.cardId === card.id,
      }),
      cardProps: (card, slot) => ({ ...(isEditable ? cardHandlers(card, slot) : {}), ...keyboardProps(card, slot) }),
      dropTarget:
        drag?.to && !drag.valid
          ? { bucket: bucketKey(drag.to.column, drag.to.lane), index: drag.to.index, valid: false }
          : null,
    }),
    [text, surface, color, sizeTokens, resolvedColumnWidth, cardLayout, priorities, locale, isEditable, renderCard, onCardOpen, onCardContextMenu, onAddCard, wellSurface, columnCornerClass, columnEditing, columnDrag.gripProps, columnDrag.drag, editColumn, columns, maxItems, selected, drag, pending, cardHandlers, keyboardProps, heldPeer, notice],
  );

  // Buckets and counts follow the live preview, so WIP readouts move with the card.
  const buckets = useMemo(() => bucketCards(previewCards, columns, viewLanes), [previewCards, columns, viewLanes]);
  const draggedCard = drag ? cards.find((c) => c.id === drag.cardId) : undefined;
  const toggleColumn = onColumnsChange
    ? (id: string) => onColumnsChange(columns.map((c) => (c.id === id ? { ...c, collapsed: !c.collapsed } : c)))
    : undefined;
  const toggleLane =
    onLanesChange && lanes
      ? (id: string) => onLanesChange(lanes.map((l) => (l.id === id ? { ...l, collapsed: !l.collapsed } : l)))
      : undefined;
  const showSkeleton = loading && loaderType === "skeleton";
  const hasHeader =
    [icon, title, subtitle, summary, actions].some((v) => v != null && v !== false) || Boolean(transport && currentUser);

  let content: ReactNode;
  if (showSkeleton) {
    content = (
      <TaskBoardSkeleton
        columns={columns.length || 4}
        columnWidth={resolvedColumnWidth}
        wellSurface={wellSurface}
        cornerClass={columnCornerClass}
      />
    );
  } else if (error) {
    content = (
      <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
        <p className={classNames("text-sm font-medium", surface.body)}>{error === true ? text("error") : error}</p>
        {onRetry && (
          <Button size="sm" variant="outline" color={color} onClick={onRetry}>
            {text("retry")}
          </Button>
        )}
      </div>
    );
  } else {
    content = (
      <div className="flex min-h-0 flex-1 flex-col">
        {cards.length === 0 && (
          <div data-taskboard-empty className={classNames("px-4 pt-4 text-center text-sm", surface.muted)}>
            {emptyState ?? text("empty")}
          </div>
        )}
        {laneView ? (
          <TaskBoardLaneGrid
            cards={previewCards}
            columns={viewColumns}
            onAddColumn={columnEditing ? addColumn : undefined}
            lanes={lanes!}
            buckets={buckets}
            onToggleLane={toggleLane}
            onToggleColumn={toggleColumn}
          />
        ) : (
          <ScrollArea
            data-taskboard-scroll
            variant="hover"
            tabIndex={-1}
            className="min-h-0 flex-1"
            // ScrollArea's content box is display:table; the row needs a flex
            // parent of full height so every column stretches to the tallest.
            contentClassName="flex! h-full"
          >
            <div data-taskboard-columns className="flex w-max items-stretch gap-3 p-3">
            {viewColumns.map((col, index) => (
              <Column
                key={col.id}
                column={col}
                index={index}
                cards={buckets.get(bucketKey(col.id, null)) ?? []}
                count={columnCount(previewCards, col.id)}
                onToggle={toggleColumn && (() => toggleColumn(col.id))}
              />
            ))}
            {columnEditing && <TaskBoardAddColumn variant="column" onAdd={addColumn} />}
            </div>
          </ScrollArea>
        )}
      </div>
    );
  }

  return (
    <TaskBoardContext.Provider value={ctx}>
      <div
        ref={rootRef}
        data-taskboard
        role="application"
        aria-roledescription="task board"
        aria-busy={loading ? true : undefined}
        aria-label={text("root")}
        className="flex h-full min-h-0 flex-col"
      >
        <div data-taskboard-live aria-live="polite" aria-atomic="true" className="sr-only">
          {keyboard.message}
        </div>
        {hasHeader && (
          <TaskBoardHeader
            icon={icon}
            title={title}
            subtitle={subtitle}
            summary={summary}
            actions={actions}
            people={transport && currentUser ? [currentUser, ...collab.peers] : undefined}
            variant={surfaceVariant}
          />
        )}
        {content}
      </div>
      <TaskBoardDragLayer drag={drag} card={draggedCard} />
      <TaskBoardColumnClone
        drag={columnDrag.drag}
        column={columns.find((c) => c.id === columnDrag.drag?.id)}
        count={columnDrag.drag ? columnCount(cards, columnDrag.drag.id) : 0}
        cards={columnDrag.drag ? cards.filter((c) => c.column === columnDrag.drag!.id) : []}
      />
      {transport && (
        <TaskBoardRemoteGhosts
          rootRef={rootRef}
          holds={collab.presence.holds}
          selfId={selfId}
          cards={cards}
          userById={collab.userById}
        />
      )}
    </TaskBoardContext.Provider>
  );
};

export const TaskBoard: React.FC<TaskBoardProps> = (props) => {
  const {
    variant = "elevated",
    tone,
    corner = "rounded-md",
    padding = "none",
    glassOpacity,
    vibrancy,
    specularMode,
    loading,
    loaderType = "skeleton",
    className,
    height,
  } = props;

  if (variant === "plain") {
    return (
      <div className={classNames("flex min-h-0 flex-col", className)} style={{ height }}>
        <TaskBoardBody {...props} surfaceVariant="elevated" />
      </div>
    );
  }

  return (
    <Panel
      variant={variant}
      tone={tone}
      corner={corner}
      padding={padding}
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      specularMode={specularMode}
      loading={Boolean(loading) && loaderType !== "skeleton"}
      loaderType={loaderType}
      flexBody
      scrollable={false}
      className={className}
      style={{ height }}
    >
      <TaskBoardBody {...props} surfaceVariant={variant} />
    </Panel>
  );
};
