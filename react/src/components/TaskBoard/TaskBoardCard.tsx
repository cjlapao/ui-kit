/**
 * TaskBoardCard — one card in a column × lane bucket.
 *
 * Two presets: `detailed` (tags, title, priority / checklist / due / notes
 * meta row, assignee bottom-right — the roadmap reference) and `compact`
 * (title with the assignee beside it, then priority, points and first tag —
 * the dispatch reference). `renderCard` replaces the body of either.
 */

import React from "react";
import classNames from "classnames";
import {
  getTaskBoardCardToneTokens,
  getTaskBoardChipTokens,
  getTaskBoardSelectionTokens,
  getTaskBoardPeerTokens,
  peerColor,
  type TaskBoardCard as Card,
  type TaskBoardTag,
  type TaskBoardUser,
} from "../../../../common/taskboard";
import { getSurfaceTriggerTokens } from "../../theme/Theme";
import UserAvatar from "../UserAvatar";
import { Calendar } from "../../icons/components/Calendar";
import { CheckCircle } from "../../icons/components/CheckCircle";
import { Details } from "../../icons/components/Details";
import { useTaskBoard, type TaskBoardCardState } from "./context";

export interface TaskBoardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: Card;
  column: string;
  lane: string | null;
  index: number;
  state: TaskBoardCardState;
}

const tagLabel = (t: TaskBoardTag) => (typeof t === "string" ? t : t.label);

function formatDue(due: Card["due"], locale: string): string | null {
  if (due === undefined || due === null || due === "") return null;
  // A bare ISO date is a calendar day, not midnight UTC — parse it locally so
  // "2026-10-30" never renders as Oct 29 west of Greenwich.
  const d =
    typeof due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(due)
      ? new Date(Number(due.slice(0, 4)), Number(due.slice(5, 7)) - 1, Number(due.slice(8, 10)))
      : new Date(due);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(d);
}

const Avatars: React.FC<{ users?: TaskBoardUser[] }> = ({ users }) => {
  if (!users?.length) return null;
  return (
    <div data-card-avatars className="flex shrink-0 -space-x-1.5">
      {users.slice(0, 3).map((u) => (
        <UserAvatar
          key={u.id}
          user={{ name: u.name, avatarUrl: u.avatarUrl }}
          tone={u.color ?? peerColor(u.id)}
          size="sm"
          className="ring-2 ring-white dark:ring-neutral-900"
        />
      ))}
    </div>
  );
};

export const TaskBoardCardBody: React.FC<{ card: Card }> = ({ card }) => {
  const { surface, size, cardLayout, priorities, locale, text } = useTaskBoard();
  const priority = card.priority ? priorities.get(card.priority) : undefined;
  const due = formatDue(card.due, locale);
  const plainChip = classNames("bg-black/5 dark:bg-white/10", surface.muted);
  const chip = "inline-flex items-center rounded px-1.5 py-0.5 font-medium leading-none";

  const tagChip = (t: TaskBoardTag, i: number) => (
    <span
      key={`${tagLabel(t)}-${i}`}
      className={classNames(
        chip,
        "text-[10px]",
        typeof t !== "string" && t.color ? getTaskBoardChipTokens(t.color).chip : plainChip,
      )}
    >
      {tagLabel(t)}
    </span>
  );

  const priorityChip = priority && (
    <span
      data-card-priority
      className={classNames(
        chip,
        "text-[10px]",
        cardLayout === "compact" && "uppercase tracking-wide",
        getTaskBoardChipTokens(priority.color).chip,
      )}
    >
      {priority.label}
    </span>
  );

  if (cardLayout === "compact") {
    const first = card.tags?.[0];
    return (
      <div className={classNames("flex flex-col", size.gap)}>
        <div data-card-title-row className="flex items-start gap-2">
          <div className={classNames("min-w-0 flex-1 font-semibold leading-snug", size.title, surface.heading)}>
            {card.title}
          </div>
          <Avatars users={card.assignees} />
        </div>
        <div className={classNames("flex flex-wrap items-center gap-1.5", size.meta)}>
          {priorityChip}
          {card.points !== undefined && (
            <span className={classNames(chip, "text-[10px]", plainChip)}>{card.points}p</span>
          )}
          {first !== undefined && (
            <span className={classNames("text-[10px]", surface.muted)}>#{tagLabel(first)}</span>
          )}
        </div>
      </div>
    );
  }

  const hasMeta = priority || card.description || card.checklist || due;
  return (
    <div className={classNames("flex flex-col", size.gap)}>
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">{card.tags.map(tagChip)}</div>
      )}
      <div className={classNames("font-semibold leading-snug", size.title, surface.heading)}>{card.title}</div>
      {(hasMeta || card.assignees?.length) && (
        <div className="flex items-end gap-2">
          <div className={classNames("flex min-w-0 flex-1 flex-wrap items-center gap-2", size.meta, surface.muted)}>
            {priorityChip}
            {card.description && (
              <span title={text("notes")} aria-label={text("notes")} role="img">
                <Details className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
            {card.checklist && (
              <span
                className="inline-flex items-center gap-1"
                title={text("checklist", { done: card.checklist.done, total: card.checklist.total })}
              >
                <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {card.checklist.done}/{card.checklist.total}
              </span>
            )}
            {due && (
              <span data-card-due className="inline-flex items-center gap-1" title={text("due", { date: due })}>
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {due}
              </span>
            )}
          </div>
          <Avatars users={card.assignees} />
        </div>
      )}
    </div>
  );
};

export const TaskBoardCard = React.forwardRef<HTMLDivElement, TaskBoardCardProps>(
  ({ card, column, lane, index, state, className, onClick, onContextMenu, onKeyDown, ...rest }, ref) => {
    const ctx = useTaskBoard();
    const { renderCard, onCardOpen, onCardContextMenu, cardSurface, size, color } = ctx;
    const selection = getTaskBoardSelectionTokens(color);
    const tone = card.tone ? getTaskBoardCardToneTokens(card.tone) : null;
    const heldTone = state.held ? (state.held.color ?? peerColor(state.held.id)) : null;
    const held = heldTone ? getTaskBoardPeerTokens(heldTone) : null;
    return (
      <div
        ref={ref}
        data-card-id={card.id}
        data-card-layout={ctx.cardLayout}
        data-card-index={index}
        data-tone={card.tone}
        data-selected={state.selected || undefined}
        data-dragging={state.dragging || undefined}
        data-grabbed={state.grabbed || undefined}
        data-pending={state.pending || undefined}
        data-held-by={state.held?.id}
        aria-disabled={state.held ? true : undefined}
        title={state.held ? ctx.text("held", { name: state.held.name }) : undefined}
        aria-busy={state.pending || undefined}
        role="button"
        tabIndex={0}
        aria-roledescription="card"
        aria-label={card.title}
        className={classNames(
          "relative cursor-pointer rounded-lg outline-none transition-shadow",
          getSurfaceTriggerTokens(color).focusRing,
          tone
            ? classNames("shadow-sm ring-1", ctx.surface.translucent ? classNames("backdrop-blur-md", tone.glass) : tone.solid)
            : cardSurface,
          size.cardPad,
          state.selected && selection.ring,
          state.grabbed && selection.clone,
          state.pending && "animate-pulse motion-reduce:animate-none",
          // In-flow placeholder for the card being dragged: it holds the
          // prospective slot while the clone follows the pointer.
          state.dragging &&
            "opacity-40 shadow-none outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30",
          ctx.editable && !card.locked && "touch-manipulation",
          // A teammate is moving this card: dimmed, ringed in their colour.
          held && classNames("cursor-not-allowed opacity-60 ring-2", held.ring),
          className,
        )}
        {...rest}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) onCardOpen?.(card);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented && e.key === "Enter") onCardOpen?.(card);
        }}
        onContextMenu={(e) => {
          onContextMenu?.(e);
          if (!onCardContextMenu || e.defaultPrevented) return;
          e.preventDefault();
          onCardContextMenu({ card, column, lane, index, x: e.clientX, y: e.clientY, event: e });
        }}
      >
        {renderCard ? renderCard(card, state) : <TaskBoardCardBody card={card} />}
        {state.held && heldTone && (
          <>
            <span className="sr-only">{ctx.text("held", { name: state.held.name })}</span>
            <span
              aria-hidden="true"
              className={classNames("absolute -top-2 right-2 rounded px-1.5 py-0.5 text-[10px] leading-none", held!.label)}
            >
              {state.held.name}
            </span>
          </>
        )}
        {state.notice && (
          <span
            role="status"
            data-card-notice
            className={classNames(
              "absolute -top-2 left-2 rounded px-1.5 py-0.5 text-[10px] leading-none",
              getTaskBoardPeerTokens(state.noticeColor ?? color).label,
            )}
          >
            {state.notice}
          </span>
        )}
      </div>
    );
  },
);
TaskBoardCard.displayName = "TaskBoardCard";
