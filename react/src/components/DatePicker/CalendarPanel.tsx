import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import Panel, { SkeletonBar } from "../Panel";
import Button from "../Button";
import {
  MONTH_NAMES,
  MONTH_NAMES_SHORT,
  getDecadeRange,
  isDateSelectable,
  isValueEmpty,
  type DateConstraints,
  type DatePickerSelectionMode,
  type DatePickerValue,
  type DayCell,
} from "../../../../common/utils/dates";
import { useIconRenderer } from "../../contexts/IconContext";
import { useSurfaceText } from "../../contexts/SurfaceContext";
import {
  DEFAULT_SURFACE_CORNER,
  type SurfaceCorner,
  type SurfaceVariant,
  type TrueColor,
} from "../../theme/Theme";
import DayGrid from "./DayGrid";
import { useRovingGrid } from "./useRovingGrid";

export type CalendarView = "date" | "month" | "year";

export interface CalendarPanelProps {
  /** DOM id of the panel — the input's `aria-controls` target. */
  id: string;
  panelVariant: SurfaceVariant;
  panelTone: TrueColor;
  panelCorner: SurfaceCorner;
  panelClassName?: string;
  /** Field accent — selected cells and focus rings. */
  tone: TrueColor;
  view: CalendarView;
  viewMonth: number;
  viewYear: number;
  weekStartsOn: 0 | 1;
  showOtherMonths?: boolean;
  cells: DayCell[];
  constraints: DateConstraints;
  value: DatePickerValue;
  selectionMode: DatePickerSelectionMode;
  today: Date;
  disabled?: boolean;
  inline?: boolean;
  loading?: boolean;
  showButtonBar?: boolean;
  ariaLabel?: string;
  todayButtonLabel?: React.ReactNode;
  clearButtonLabel?: React.ReactNode;
  onMonthNav: (delta: number) => void;
  onYearNav: (delta: number) => void;
  /** Title buttons — switch between the date/month/year views. */
  onSwitchView: (view: CalendarView) => void;
  /** Month cell click — navigate to that month (v1: never selects). */
  onPickMonth: (month: number) => void;
  /** Year cell click — navigate to that year's month view (v1: never selects). */
  onPickYear: (year: number) => void;
  onPickDate: (date: Date) => void;
  onToday: () => void;
  onClear: () => void;
  onEscape: () => void;
}

const NavButton: React.FC<{
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  tone: TrueColor;
}> = ({ label, icon, onClick, disabled, tone }) => {
  const renderIcon = useIconRenderer();
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200",
        "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${tone}-400`,
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      {renderIcon(icon, "sm")}
    </button>
  );
};

/**
 * The calendar surface. The chrome is a real `Panel` (brief objective 1):
 * `panelVariant`/`panelTone`/`panelCorner` ride the surface family, and the
 * `SurfaceProvider` it publishes is what lets the weekday row and titles pick
 * copy that survives a glass or liquid-glass fill.
 */
const CalendarPanel: React.FC<CalendarPanelProps> = ({
  id,
  panelVariant,
  panelTone,
  panelCorner = DEFAULT_SURFACE_CORNER,
  panelClassName,
  tone,
  view,
  viewMonth,
  viewYear,
  weekStartsOn,
  showOtherMonths = true,
  cells,
  constraints,
  value,
  selectionMode,
  today,
  disabled = false,
  inline = false,
  loading = false,
  showButtonBar = false,
  ariaLabel,
  todayButtonLabel = "Today",
  clearButtonLabel = "Clear",
  onMonthNav,
  onYearNav,
  onSwitchView,
  onPickMonth,
  onPickYear,
  onPickDate,
  onToday,
  onClear,
  onEscape,
}) => {
  const surfaceText = useSurfaceText();
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Month view ────────────────────────────────────────────────────────────

  const monthCells = Array.from({ length: 12 }, (_, index) => ({
    index,
    selectable: isDateSelectable(new Date(viewYear, index, 15), constraints),
  }));
  const isMonthSelected = (index: number): boolean => {
    const months: Date[] = [];
    if (Array.isArray(value)) {
      if (value[0]) months.push(value[0]);
      if (value[1]) months.push(value[1]);
    } else if (value) {
      months.push(value);
    }
    return months.some(
      (d) => d.getFullYear() === viewYear && d.getMonth() === index,
    );
  };
  const monthActiveKey = monthCells.findIndex(
    (cell) => isMonthSelected(cell.index),
  );

  // ── Year view ─────────────────────────────────────────────────────────────

  const [decadeStart] = getDecadeRange(viewYear);
  const yearCells = Array.from({ length: 10 }, (_, i) => {
    const year = decadeStart + i;
    return {
      year,
      selectable: isDateSelectable(new Date(year, 5, 15), constraints),
    };
  });
  const isYearSelected = (year: number): boolean => {
    const years: number[] = [];
    if (Array.isArray(value)) {
      if (value[0]) years.push(value[0].getFullYear());
      if (value[1]) years.push(value[1].getFullYear());
    } else if (value) {
      years.push(value.getFullYear());
    }
    return years.includes(year);
  };
  const yearActiveKey = yearCells.findIndex((cell) =>
    isYearSelected(cell.year),
  );

  // Roving tabindex per view — one active cell each.
  const monthRoving = useRovingGrid({
    keys: monthCells.map((c) => String(c.index)),
    isDisabled: (key) => !monthCells[Number(key)]?.selectable,
    activeKey: monthActiveKey >= 0 ? String(monthActiveKey) : null,
  });
  const yearRoving = useRovingGrid({
    keys: yearCells.map((c) => String(c.year)),
    isDisabled: (key) => !yearCells[Number(key) - decadeStart]?.selectable,
    activeKey: yearActiveKey >= 0 ? String(yearCells[yearActiveKey].year) : null,
  });

  // Landing focus after a view switch (title button click) or a decade/year
  // nav from the keyboard.
  const pendingFocus = useRef<CalendarView | null>(null);
  useEffect(() => {
    if (!pendingFocus.current) return;
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === "month") monthRoving.focusActive();
    if (target === "year") yearRoving.focusActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, viewYear, viewMonth]);

  const handleMonthKeydown = (
    event: React.KeyboardEvent,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        const next = index + (event.key === "ArrowDown" ? 3 : -3);
        if (next < 0 || next > 11) {
          onYearNav(event.key === "ArrowDown" ? 1 : -1);
          pendingFocus.current = "month";
          return;
        }
        if (monthCells[next]?.selectable) monthRoving.move(String(next));
        return;
      }
      case "ArrowLeft":
      case "ArrowRight": {
        event.preventDefault();
        const next = index + (event.key === "ArrowRight" ? 1 : -1);
        if (next < 0 || next > 11) {
          onYearNav(event.key === "ArrowRight" ? 1 : -1);
          pendingFocus.current = "month";
          return;
        }
        if (monthCells[next]?.selectable) monthRoving.move(String(next));
        return;
      }
      case "PageUp":
      case "PageDown":
        event.preventDefault();
        onYearNav(event.key === "PageDown" ? 1 : -1);
        pendingFocus.current = "month";
        return;
      case "Escape":
        event.preventDefault();
        onEscape();
        return;
      default:
        return;
    }
  };

  const handleYearKeydown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        const next = index + (event.key === "ArrowDown" ? 2 : -2);
        if (next < 0 || next > 9) {
          onYearNav(event.key === "ArrowDown" ? 10 : -10);
          pendingFocus.current = "year";
          return;
        }
        if (yearCells[next]?.selectable) yearRoving.move(String(yearCells[next].year));
        return;
      }
      case "ArrowLeft":
      case "ArrowRight": {
        event.preventDefault();
        const next = index + (event.key === "ArrowRight" ? 1 : -1);
        if (next < 0 || next > 9) {
          onYearNav(event.key === "ArrowRight" ? 10 : -10);
          pendingFocus.current = "year";
          return;
        }
        if (yearCells[next]?.selectable) yearRoving.move(String(yearCells[next].year));
        return;
      }
      case "PageUp":
      case "PageDown":
        event.preventDefault();
        onYearNav(event.key === "PageDown" ? 10 : -10);
        pendingFocus.current = "year";
        return;
      case "Escape":
        event.preventDefault();
        onEscape();
        return;
      default:
        return;
    }
  };

  // Tab cycles inside the panel; Escape closes and refocuses the input.
  const handlePanelKeydown = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const panelEl = panelRef.current;
    if (!panelEl) return;
    const focusables = Array.from(
      panelEl.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex="0"]',
      ),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    event.preventDefault();
    if (event.shiftKey) {
      (active === first || !active ? last : active).focus();
    } else {
      const index = active ? focusables.indexOf(active) : -1;
      const next =
        index < 0 || index === focusables.length - 1
          ? first
          : focusables[index + 1];
      next.focus();
    }
  };

  // ── Cell class helpers (same state system as the day grid) ────────────────

  const toneFocusRing = `focus-visible:ring-${tone}-400`;

  const viewCellClass = (selected: boolean, selectable: boolean) =>
    classNames(
      "flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
      toneFocusRing,
      selected
        ? `bg-${tone}-700 text-white dark:bg-${tone}-400 dark:text-neutral-950`
        : selectable
          ? "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          : "cursor-not-allowed text-neutral-300 dark:text-neutral-700",
    );

  const decadeEnd = decadeStart + 9;
  const headerTitle =
    view === "date" ? (
      <>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onSwitchView("month");
            pendingFocus.current = "month";
          }}
          aria-label={`Choose month, now ${MONTH_NAMES[viewMonth]} ${viewYear}`}
          className={classNames(
            "rounded-md px-2 py-1 text-sm font-semibold transition-colors duration-200",
            surfaceText.heading,
            "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
            toneFocusRing,
          )}
        >
          {MONTH_NAMES[viewMonth]}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onSwitchView("year");
            pendingFocus.current = "year";
          }}
          aria-label={`Choose year, now ${viewYear}`}
          className={classNames(
            "rounded-md px-2 py-1 text-sm font-semibold transition-colors duration-200",
            surfaceText.heading,
            "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
            toneFocusRing,
          )}
        >
          {viewYear}
        </button>
      </>
    ) : view === "month" ? (
      <span className={classNames("px-2 text-sm font-semibold", surfaceText.heading)}>
        {viewYear}
      </span>
    ) : (
      <span className={classNames("px-2 text-sm font-semibold", surfaceText.heading)}>
        {decadeStart} – {decadeEnd}
      </span>
    );

  const empty = isValueEmpty(value);
  const todayDisabled = !isDateSelectable(today, constraints);

  const skeleton = loading ? (
    <div
      className="flex animate-pulse flex-col gap-3 p-3 motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between px-1">
        <SkeletonBar width="2rem" height="h-8" className="rounded-full" />
        <SkeletonBar width="5.5rem" height="h-5" />
        <SkeletonBar width="2rem" height="h-8" className="rounded-full" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }, (_, i) => (
          <SkeletonBar
            key={i}
            width="2rem"
            height="h-8"
            className="mx-auto rounded-full"
          />
        ))}
      </div>
    </div>
  ) : (
    <>
      {view === "date" && (
        <DayGrid
          cells={cells}
          weekStartsOn={weekStartsOn}
          showOtherMonths={showOtherMonths}
          tone={tone}
          value={value}
          selectionMode={selectionMode}
          constraints={constraints}
          onPickDate={onPickDate}
          onMonthNav={onMonthNav}
          onYearNav={onYearNav}
          onEscape={onEscape}
        />
      )}
      {view === "month" && (
        <div className="grid grid-cols-3 gap-1.5" role="grid" aria-label="Choose month">
          {monthCells.map((cell, index) => (
            <button
              key={cell.index}
              ref={monthRoving.registerRef(String(cell.index))}
              type="button"
              tabIndex={monthRoving.tabIndexFor(index)}
              disabled={disabled || !cell.selectable}
              aria-selected={isMonthSelected(cell.index) || undefined}
              aria-disabled={!cell.selectable || undefined}
              onClick={() => onPickMonth(cell.index)}
              onKeyDown={(event) => handleMonthKeydown(event, index)}
              className={viewCellClass(isMonthSelected(cell.index), cell.selectable)}
            >
              {MONTH_NAMES_SHORT[cell.index]}
            </button>
          ))}
        </div>
      )}
      {view === "year" && (
        <div className="grid grid-cols-2 gap-1.5" role="grid" aria-label="Choose year">
          {yearCells.map((cell, index) => (
            <button
              key={cell.year}
              ref={yearRoving.registerRef(String(cell.year))}
              type="button"
              tabIndex={yearRoving.tabIndexFor(index)}
              disabled={disabled || !cell.selectable}
              aria-selected={isYearSelected(cell.year) || undefined}
              aria-disabled={!cell.selectable || undefined}
              onClick={() => onPickYear(cell.year)}
              onKeyDown={(event) => handleYearKeydown(event, index)}
              className={viewCellClass(isYearSelected(cell.year), cell.selectable)}
            >
              {cell.year}
            </button>
          ))}
        </div>
      )}
    </>
  );

  const navDisabled = disabled;

  return (
    <Panel
      variant={panelVariant}
      tone={panelTone}
      corner={panelCorner}
      padding="none"
      scrollable={false}
      className={classNames("w-[max-content] min-w-[236px]", panelClassName)}
    >
      <div
        ref={panelRef}
        id={id}
        role={inline ? undefined : "dialog"}
        aria-label={ariaLabel}
        onKeyDown={handlePanelKeydown}
        className="w-full"
      >
        <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-1">
          <NavButton
            label={
              view === "date"
                ? "Previous month"
                : view === "month"
                  ? "Previous year"
                  : "Previous decade"
            }
            icon="ChevronLeft"
            disabled={navDisabled}
            tone={tone}
            onClick={() =>
              view === "date"
                ? onMonthNav(-1)
                : view === "month"
                  ? onYearNav(-1)
                  : onYearNav(-10)
            }
          />
          <div className="flex min-w-0 items-center gap-1">{headerTitle}</div>
          <NavButton
            label={
              view === "date"
                ? "Next month"
                : view === "month"
                  ? "Next year"
                  : "Next decade"
            }
            icon="ChevronRight"
            disabled={navDisabled}
            tone={tone}
            onClick={() =>
              view === "date"
                ? onMonthNav(1)
                : view === "month"
                  ? onYearNav(1)
                  : onYearNav(10)
            }
          />
        </div>
        <div className="px-3 pb-3">{skeleton}</div>
        {showButtonBar && !loading && (
          <div
            className={classNames(
              "flex items-center justify-between gap-2 border-t px-3 py-2",
              surfaceText.divider,
            )}
          >
            <Button
              variant="outline"
              size="sm"
              color="neutral"
              onClick={onToday}
              disabled={disabled || todayDisabled}
            >
              {todayButtonLabel}
            </Button>
            <Button
              variant="outline"
              size="sm"
              color="neutral"
              onClick={onClear}
              disabled={disabled || empty}
            >
              {clearButtonLabel}
            </Button>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default CalendarPanel;
