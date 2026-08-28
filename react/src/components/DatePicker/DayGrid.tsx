import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import {
  WEEKDAY_LABELS,
  WEEKDAY_LABELS_SHORT,
  formatDateLabel,
  isDateBetween,
  isSameDayDate,
  isDateSelectable,
  type DateConstraints,
  type DatePickerSelectionMode,
  type DatePickerValue,
  type DayCell,
} from "../../../../common/utils/dates";
import { useSurfaceText } from "../../contexts/SurfaceContext";
import { useRovingGrid } from "./useRovingGrid";
import type { TrueColor } from "../../theme/Theme";

const ROWS = 6;
const COLS = 7;

/** The `data-key` for a cell — stable across re-renders, grid-shaped. */
const cellKey = (cell: DayCell): string =>
  `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;

export interface DayGridProps {
  cells: DayCell[];
  weekStartsOn: 0 | 1;
  /** Draw leading/trailing other-month days. @default true */
  showOtherMonths?: boolean;
  /** The field's accent — the selected day's fill. */
  tone: TrueColor;
  value: DatePickerValue;
  selectionMode: DatePickerSelectionMode;
  constraints: DateConstraints;
  /** Pick a day (mouse or Enter/Space). */
  onPickDate: (date: Date) => void;
  /** Move the visible month (grid edge, PageUp/Down). */
  onMonthNav: (delta: number) => void;
  /** Move the visible year (Shift+PageUp/Down). */
  onYearNav: (delta: number) => void;
  /** Escape from the grid: close the overlay and refocus the input. */
  onEscape: () => void;
}

/**
 * The day view — a 6×7 `role="grid"` table with a roving tabindex.
 *
 * Keyboard model (PrimeVue parity, verified against 4.5.5): arrows move one
 * step, skipping disabled cells; a horizontal arrow at the row edge and a
 * vertical arrow off the grid navigate the month instead; Home/End jump to
 * the row's first/last enabled cell; PageUp/PageDown step the month,
 * Shift does the year; Enter/Space pick.
 */
const DayGrid: React.FC<DayGridProps> = ({
  cells,
  weekStartsOn,
  showOtherMonths = true,
  tone,
  value,
  selectionMode,
  constraints,
  onPickDate,
  onMonthNav,
  onYearNav,
  onEscape,
}) => {
  const surfaceText = useSurfaceText();

  const isRange = selectionMode === "range";
  const rangeStart = isRange && Array.isArray(value) ? value[0] : null;
  const rangeEnd = isRange && Array.isArray(value) ? value[1] : null;

  const isSelected = (cell: DayCell): boolean => {
    if (isRange) {
      return Boolean(
        ((rangeStart && isSameDayDate(rangeStart, cell.date)) ||
          (rangeEnd && isSameDayDate(rangeEnd, cell.date))) &&
        cell.date,
      );
    }
    return !Array.isArray(value) && value !== null && isSameDayDate(value, cell.date);
  };

  /** Interior of a completed range — the soft tint between the endpoints. */
  const isInterior = (cell: DayCell): boolean =>
    isRange &&
    rangeStart !== null &&
    rangeEnd !== null &&
    !isSelected(cell) &&
    isDateBetween(rangeStart, rangeEnd, cell.date);

  const activeKey = (() => {
    const picked = cells.find((cell) => isSelected(cell));
    if (picked) return cellKey(picked);
    const todayCell = cells.find((cell) => cell.today);
    if (todayCell) return cellKey(todayCell);
    return null;
  })();

  const roving = useRovingGrid({
    keys: cells.map(cellKey),
    isDisabled: (key) => {
      const cell = cells.find((c) => cellKey(c) === key);
      return !cell?.selectable;
    },
    activeKey,
  });

  // After an edge navigation the month changes and the grid re-renders with a
  // fresh cell set; land focus on the new month's active cell.
  const navFocusPending = useRef(false);
  const cellsSignature = cells.map((cell) => cellKey(cell)).join("\u0000");
  useEffect(() => {
    if (!navFocusPending.current) return;
    navFocusPending.current = false;
    roving.focusActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellsSignature]);

  /** Step `from` by `step` up to `limit` times, landing on the first selectable cell. */
  const stepTo = (
    from: number,
    step: number,
    limit: number,
  ): number => {
    let index = from;
    for (let i = 0; i < limit; i += 1) {
      index += step;
      if (index < 0 || index >= cells.length) return -1;
      if (cells[index].selectable) return index;
    }
    return -1;
  };

  const moveTo = (index: number) => {
    if (index < 0 || index >= cells.length) return;
    roving.move(cellKey(cells[index]));
  };

  const handleCellKeyDown = (event: React.KeyboardEvent, index: number) => {
    const { key, shiftKey } = event;
    const column = index % COLS;

    if (key === "Escape") {
      event.preventDefault();
      onEscape();
      return;
    }
    if (key === "PageUp" || key === "PageDown") {
      event.preventDefault();
      const delta = key === "PageDown" ? 1 : -1;
      if (shiftKey) onYearNav(delta);
      else onMonthNav(delta);
      navFocusPending.current = true;
      return;
    }

    switch (key) {
      case "ArrowLeft": {
        event.preventDefault();
        if (column === 0) {
          onMonthNav(-1);
          navFocusPending.current = true;
          return;
        }
        moveTo(stepTo(index, -1, column));
        return;
      }
      case "ArrowRight": {
        event.preventDefault();
        if (column === COLS - 1) {
          onMonthNav(1);
          navFocusPending.current = true;
          return;
        }
        moveTo(stepTo(index, 1, COLS - column));
        return;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (index < COLS) {
          onMonthNav(-1);
          navFocusPending.current = true;
          return;
        }
        moveTo(stepTo(index, -COLS, ROWS));
        return;
      }
      case "ArrowDown": {
        event.preventDefault();
        if (index >= cells.length - COLS) {
          onMonthNav(1);
          navFocusPending.current = true;
          return;
        }
        moveTo(stepTo(index, COLS, ROWS));
        return;
      }
      case "Home": {
        event.preventDefault();
        moveTo(stepTo(index - column, 1, COLS - 1));
        return;
      }
      case "End": {
        event.preventDefault();
        moveTo(stepTo(index + (COLS - 1 - column), -1, COLS - 1));
        return;
      }
      default:
        return;
    }
  };

  const weekdayLabels = Array.from(
    { length: COLS },
    (_, i) => (weekStartsOn + i) % COLS,
  );

  const renderCell = (cell: DayCell, index: number) => {
    if (!showOtherMonths && cell.otherMonth) {
      // Keep the table geometry stable — an empty cell, not a missing one.
      return <td key={cellKey(cell)} className="p-0" />;
    }
    const key = cellKey(cell);
    const selected = isSelected(cell);
    const interior = isInterior(cell);
    const constraintDisabled = !isDateSelectable(cell.date, constraints);
    const disabled = !cell.selectable;
    // Synchronous marker of the active cell (selected → today → first
    // selectable) so the parent can focus it the moment the overlay renders —
    // the roving `tabIndex` state lands one commit later.
    const isActiveCell = key === activeKey;

    const cellClass = classNames(
      "flex h-8 w-8 items-center justify-center rounded-full text-sm leading-none transition-colors duration-200",
      // One focus class set — inset ring, tone colour, no `outline` beside it.
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${tone}-400`,
      selected
        ? `bg-${tone}-700 text-white dark:bg-${tone}-400 dark:text-neutral-950`
        : interior
          ? `bg-${tone}-500/15 text-neutral-800 dark:bg-${tone}-500/15 dark:text-neutral-100`
          : disabled
            ? constraintDisabled
              ? "cursor-not-allowed text-neutral-300 dark:text-neutral-700"
              : "cursor-not-allowed text-neutral-400 dark:text-neutral-600"
            : cell.today
              ? "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
      !selected && !interior && cell.today && "border border-neutral-300 dark:border-neutral-600",
    );

    return (
      <td key={key} className="p-0 text-center">
        <button
          ref={roving.registerRef(key)}
          type="button"
          data-index={index}
          data-dpk-active={isActiveCell || undefined}
          tabIndex={roving.tabIndexFor(index)}
          disabled={disabled}
          aria-label={formatDateLabel(cell.date)}
          aria-selected={selected || undefined}
          aria-disabled={disabled || undefined}
          onClick={() => {
            onPickDate(cell.date);
            roving.move(key);
          }}
          onKeyDown={(event) => handleCellKeyDown(event, index)}
          className={cellClass}
        >
          {cell.day}
        </button>
      </td>
    );
  };

  return (
    <table
      role="grid"
      className="w-full border-separate border-spacing-0"
      aria-label="Calendar"
    >
      <thead>
        <tr>
          {weekdayLabels.map((weekday) => (
            <th
              key={weekday}
              scope="col"
              abbr={WEEKDAY_LABELS[weekday]}
              className={classNames(
                "pb-1.5 text-center text-[11px] font-semibold uppercase tracking-wide",
                surfaceText.muted,
              )}
            >
              {WEEKDAY_LABELS_SHORT[weekday]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: ROWS }, (_, row) => (
          <tr key={row}>
            {cells.slice(row * COLS, row * COLS + COLS).map((cell, i) =>
              renderCell(cell, row * COLS + i),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DayGrid;
