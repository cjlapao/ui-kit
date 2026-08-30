import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import Loader, { type LoaderProps } from "../Loader";
import { useIconRenderer } from "../../contexts/IconContext";
import {
  DEFAULT_SURFACE_CORNER,
  FIELD_STATUS_CLASSES,
  getFieldSizeTokens,
  getFieldToneTokens,
  getGlowTokens,
  getInputVariantTokens,
  resolveGlowGradient,
  stripBorderColor,
  stripTextColor,
  type TrueColor,
} from "../../theme/Theme";
import CalendarPanel, { type CalendarView } from "./CalendarPanel";
import { useKitEngine } from "../../i18n";
import { useOverlayPosition } from "./useOverlayPosition";
import type { DatePickerProps } from "./types";
import {
  DEFAULT_DATE_FORMAT,
  addMonthsToDate,
  addYearsToDate,
  buildMonthGrid,
  formatValue,
  getViewDate,
  isBeforeDay,
  isDateSelectable,
  isValueEmpty,
  normalizeDate,
  parseValueText,
  type DateConstraints,
  type DatePickerValue,
} from "../../../../common/utils/dates";

/** PrimeVue closes ~150 ms after a pick so the selection crossfade lands first. */
const CLOSE_DELAY_MS = 150;
const OVERLAY_ENTER_ANIMATION = "date-picker-overlay-enter";
const OVERLAY_LEAVE_ANIMATION = "date-picker-overlay-leave";

type OverlayPhase = "closed" | "entering" | "open" | "leaving";

/**
 * The date field with a calendar overlay (or an inline calendar).
 *
 * The input box is the exact `Input` field system — `InputVariant` surface,
 * `ControlSize` padding, `TrueColor` focus tokens, shared validation surfaces —
 * and the calendar panel is a real `Panel`, so the surface family (glass,
 * liquid-glass, tone, corner) rides in for free. Selection behaviour follows
 * PrimeVue 4.5.5; the deliberate deviations are listed in the design spec.
 */
const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(
    {
      selectionMode = "single",
      value: valueProp,
      defaultValue,
      onChange,
      format = DEFAULT_DATE_FORMAT,
      minDate,
      maxDate,
      disabledDays,
      disabledDates,
      weekStartsOn = 1,
      showOtherMonths = true,
      selectOtherMonths = false,
      showClear = false,
      showButtonBar = false,
      inline = false,
      showOnFocus = true,
      appendTo = "body",
      hideOnSelect = true,
      hideOnRangeSelection = false,
      size = "md",
      tone,
      color,
      variant = "flat",
      glowIntensity = "soft",
      gradientFrom,
      gradientTo,
      validationStatus = "none",
      leadingIcon,
      className,
      inputClassName,
      unstyled = false,
      loading = false,
      loaderType = "spinner",
      readonly = false,
      disabled = false,
      panelVariant = "elevated",
      panelTone = "neutral",
      panelCorner = DEFAULT_SURFACE_CORNER,
      panelClassName,
      onShow,
      onHide,
      onInvalidInputChange,
      ariaLabel,
      panelAriaLabel,
      todayButtonLabel,
      clearButtonLabel,
      onFocus,
      onBlur,
      onKeyDown: restOnKeyDown,
      placeholder,
      ...rest
    },
    ref,
  ) {
    const i18n = useKitEngine();
    const renderIcon = useIconRenderer();

    // ── Value (controlled / uncontrolled) ───────────────────────────────────

    const isControlled = valueProp !== undefined;
    const initialValue: DatePickerValue = valueProp ?? defaultValue ?? null;
    const [internalValue, setInternalValue] =
      useState<DatePickerValue>(initialValue);
    const currentValue = isControlled ? (valueProp as DatePickerValue) : internalValue;

    const constraints: DateConstraints = useMemo(
      () => ({
        minDate: normalizeDate(minDate),
        maxDate: normalizeDate(maxDate),
        disabledDays,
        disabledDates,
      }),
      [minDate, maxDate, disabledDays, disabledDates],
    );

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const commit = useCallback(
      (next: DatePickerValue) => {
        if (!isControlled) setInternalValue(next);
        onChangeRef.current?.(next);
      },
      [isControlled],
    );

    /**
     * Mirror a calendar-driven commit into the input text. The value-sync
     * effect skips a focused input (the user's keystrokes win there), but a
     * pick/Today/clear should repaint the text even then — PrimeVue does the
     * same via its `inputFieldValue` watcher.
     */
    const syncText = useCallback(
      (next: DatePickerValue) => {
        setText(formatValue(next, format));
        setTextInvalid(false);
      },
      [format],
    );

    // ── Calendar view ───────────────────────────────────────────────────────

    const [viewDate, setViewDate] = useState<Date>(() =>
      getViewDate(initialValue, constraints),
    );
    const viewMonth = viewDate.getMonth();
    const viewYear = viewDate.getFullYear();
    const [currentView, setCurrentView] = useState<CalendarView>("date");
    const [today, setToday] = useState<Date>(() => new Date());

    const cells = useMemo(
      () =>
        buildMonthGrid(viewYear, viewMonth, {
          weekStartsOn,
          constraints,
          today,
          selectOtherMonths,
        }),
      [viewYear, viewMonth, weekStartsOn, constraints, today, selectOtherMonths],
    );

    // An externally changed value (controlled update, Today button in another
    // place, …) re-anchors the visible month — PrimeVue's rawValue watcher.
    const phaseRef = useRef<OverlayPhase>("closed");
    useEffect(() => {
      if (phaseRef.current === "closed") {
        setViewDate(getViewDate(currentValue, constraints));
      }
    }, [currentValue, constraints]);

    // ── Input text ──────────────────────────────────────────────────────────

    const [text, setText] = useState(() => formatValue(initialValue, format));
    const [textInvalid, setTextInvalid] = useState(false);
    const [focused, setFocused] = useState(false);
    const focusedRef = useRef(false);
    const currentValueRef = useRef(currentValue);
    currentValueRef.current = currentValue;
    const onInvalidRef = useRef(onInvalidInputChange);
    onInvalidRef.current = onInvalidInputChange;

    // While the input is not focused, the text always mirrors the value —
    // exactly what PrimeVue's `inputFieldValue` watcher does.
    useEffect(() => {
      if (!focusedRef.current) {
        setText(formatValue(currentValue, format));
        setTextInvalid(false);
      }
    }, [currentValue, format]);

    const isParseValid = useCallback(
      (parsed: DatePickerValue): boolean => {
        if (Array.isArray(parsed)) {
          if (parsed[0] && !isDateSelectable(parsed[0], constraints)) return false;
          if (parsed[1] && !isDateSelectable(parsed[1], constraints)) return false;
          return true;
        }
        return parsed !== null && isDateSelectable(parsed, constraints);
      },
      [constraints],
    );

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setText(next);
      if (!next.trim()) {
        setTextInvalid(false);
        return;
      }
      // Locale-aware parsing: normalize localized month/weekday spellings
      // (e.g. "août") before date-fns sees them.
      const parsed = parseValueText(
        next,
        selectionMode,
        format,
        new Date(),
        i18n.parseNames(i18n.locale),
      );
      if (parsed !== null && isParseValid(parsed)) {
        setTextInvalid(false);
        commit(parsed);
        setViewDate(getViewDate(parsed, constraints));
      } else {
        // PrimeVue swallows the failure silently; the kit flags it — a muted
        // rose cue on the text plus a hook for apps that lift it to a FormField.
        setTextInvalid(true);
        onInvalidRef.current?.(next);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      focusedRef.current = false;
      setFocused(false);
      // PrimeVue parity: blur force-resets the text to the formatted value —
      // an unparseable partial date is discarded.
      setText(formatValue(currentValueRef.current, format));
      setTextInvalid(false);
      onBlur?.(event);
    };

    // ── Overlay state machine ───────────────────────────────────────────────

    const panelId = useId();
    const [phase, setPhase] = useState<OverlayPhase>("closed");
    phaseRef.current = phase;
    const overlayVisible = phase !== "closed";

    const onShowRef = useRef(onShow);
    onShowRef.current = onShow;
    const onHideRef = useRef(onHide);
    onHideRef.current = onHide;

    const showFiredRef = useRef(false);
    const focusGridOnOpen = useRef(false);
    useEffect(() => {
      if (phase === "entering") {
        setToday(new Date());
        if (!showFiredRef.current) {
          showFiredRef.current = true;
          onShowRef.current?.();
        }
        // ArrowDown opened the overlay — land focus on the active cell now
        // that the grid is in the DOM.
        if (focusGridOnOpen.current) {
          focusGridOnOpen.current = false;
          document
            .getElementById(panelId)
            ?.querySelector<HTMLElement>("[data-dpk-active]")
            ?.focus();
        }
      }
      if (phase === "closed") showFiredRef.current = false;
    }, [phase, panelId]);

    const requestOpen = useCallback(() => {
      if (disabled || readonly) return;
      setPhase((p) => (p === "closed" ? "entering" : p));
    }, [disabled, readonly]);

    const requestClose = useCallback(() => {
      setPhase((p) => (p === "entering" || p === "open" ? "leaving" : p));
    }, []);

    const closeTimerRef = useRef<number | undefined>(undefined);
    useEffect(
      () => () => window.clearTimeout(closeTimerRef.current),
      [],
    );

    const handleOverlayAnimationEnd = (
      event: React.AnimationEvent<HTMLDivElement>,
    ) => {
      // Guard per Learnings: transition/animation events bubble from every
      // descendant — only the wrapper's own overlay animation ends the phase.
      if (event.target !== event.currentTarget) return;
      if (
        event.animationName !== OVERLAY_ENTER_ANIMATION &&
        event.animationName !== OVERLAY_LEAVE_ANIMATION
      ) {
        return;
      }
      if (phaseRef.current === "entering") {
        setPhase("open");
      } else if (phaseRef.current === "leaving") {
        setPhase("closed");
        setCurrentView("date");
        onHideRef.current?.();
      }
    };

    // ── Refs for the portal machinery ───────────────────────────────────────

    const fieldRef = useRef<HTMLSpanElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Hooks unconditionally, before any early return below.
    const overlayStyle = useOverlayPosition(
      fieldRef,
      overlayRef,
      overlayVisible && appendTo === "body",
    );

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const focusInput = useCallback(() => inputRef.current?.focus(), []);

    // Close on outside pointer-down. The field (trigger, clear and toggle
    // buttons) and the overlay itself are exempt.
    useEffect(() => {
      if (phase === "closed" || phase === "leaving") return;
      const handlePointer = (event: MouseEvent) => {
        const target = event.target as Node;
        if (overlayRef.current?.contains(target)) return;
        if (fieldRef.current?.contains(target)) return;
        requestClose();
      };
      document.addEventListener("pointerdown", handlePointer);
      return () => document.removeEventListener("pointerdown", handlePointer);
    }, [phase, requestClose]);

    const handlePanelEscape = useCallback(() => {
      requestClose();
      focusInput();
    }, [requestClose, focusInput]);

    // ── Input keyboard ──────────────────────────────────────────────────────

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (phaseRef.current === "closed") {
          // The overlay renders after this handler; the enter effect below
          // moves focus into the grid once the cells exist.
          focusGridOnOpen.current = true;
          requestOpen();
        } else {
          document
            .getElementById(panelId)
            ?.querySelector<HTMLElement>("[data-dpk-active]")
            ?.focus();
        }
        return;
      }
      if (phaseRef.current === "closed") return;
      if (event.key === "Escape") {
        requestClose();
        return;
      }
      if (event.key === "Tab") {
        // Tab out of the input closes the overlay and lets native tabbing go.
        requestClose();
        return;
      }
      if (event.key === "Enter") {
        const parsed = parseValueText(
          text,
          selectionMode,
          format,
          new Date(),
          i18n.parseNames(i18n.locale),
        );
        if (parsed !== null && isParseValid(parsed)) {
          event.preventDefault();
          requestClose();
        }
      }
      restOnKeyDown?.(event);
    };

    // ── Selection ───────────────────────────────────────────────────────────

    const scheduleClose = useCallback(() => {
      closeTimerRef.current = window.setTimeout(() => {
        requestClose();
      }, CLOSE_DELAY_MS);
    }, [requestClose]);

    const handlePickDate = (date: Date) => {
      if (selectionMode === "single") {
        commit(date);
        syncText(date);
        if (hideOnSelect) {
          focusInput();
          scheduleClose();
        }
      } else {
        const previous = Array.isArray(currentValueRef.current)
          ? currentValueRef.current
          : null;
        const start = previous?.[0] ?? null;
        const end = previous?.[1] ?? null;
        let next: DatePickerValue;
        if (!start) {
          next = [date, null];
        } else if (!end) {
          // A second pick before the start restarts the range (PrimeVue).
          next = isBeforeDay(date, start) ? [date, null] : [start, date];
          if (
            !isBeforeDay(date, start) &&
            hideOnRangeSelection
          ) {
            focusInput();
            scheduleClose();
          }
        } else {
          // Completed range — a further pick starts a new one.
          next = [date, null];
        }
        commit(next);
        syncText(next);
      }
      // Other-month picks (selectOtherMonths) move the visible month with them.
      if (date.getMonth() !== viewMonth || date.getFullYear() !== viewYear) {
        setViewDate(date);
      }
    };

    const handleMonthNav = (delta: number) =>
      setViewDate((d) => addMonthsToDate(d, delta));
    const handleYearNav = (delta: number) =>
      setViewDate((d) => addYearsToDate(d, delta));

    const handleToday = () => {
      const now = new Date();
      if (!isDateSelectable(now, constraints)) return;
      const atMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      commit(atMidnight);
      syncText(atMidnight);
    };

    const handleClear = () => {
      commit(null);
      // The input keeps focus after a clear, so the value-sync effect (which
      // skips a focused input) would not clear the text — do it directly.
      setText("");
      setTextInvalid(false);
      focusInput();
    };

    // ── Field tokens — the same box `Input` draws ───────────────────────────

    const effectiveTone: TrueColor = tone ?? color ?? "blue";
    const sizeToken = getFieldSizeTokens(size);
    const tokens = getFieldToneTokens(effectiveTone);
    const variantTokens = getInputVariantTokens(variant);
    const isUnderline = variant === "underline";
    const hasStatus = validationStatus !== "none";
    const glow = getGlowTokens(glowIntensity);
    const [glowFrom, glowTo] = resolveGlowGradient(
      effectiveTone,
      gradientFrom,
      gradientTo,
    );

    const hasValue = !isValueEmpty(currentValue);
    const showClearIcon = showClear && hasValue && !disabled && !inline;

    const toggleLabel =
      selectionMode === "range"
        ? i18n.t("kit.datepicker.panelAriaLabelRange")
        : i18n.t("kit.datepicker.panelAriaLabel");

    const trailingButtonClass = classNames(
      "ml-2 inline-flex shrink-0 items-center justify-center rounded transition-colors",
      "focus-visible:outline-none focus-visible:ring-2",
      sizeToken.button,
      tokens.buttonFocusRing,
      variantTokens.icon,
      !hasStatus && "hover:text-neutral-700 dark:hover:text-neutral-200",
      "disabled:cursor-not-allowed",
    );

    const renderLeading = (
      visual: string | React.ReactElement,
    ): React.ReactNode => {
      if (typeof visual === "string") {
        return renderIcon(visual, sizeToken.icon);
      }
      return visual;
    };

    const inputAccessibleName =
      ariaLabel ??
      (typeof placeholder === "string" && placeholder !== ""
        ? placeholder
        : i18n.t("kit.datepicker.accessibleNameFallback"));
    const hasExplicitName =
      rest["aria-label"] !== undefined || rest["aria-labelledby"] !== undefined;

    const calendarPanel = (
      <CalendarPanel
        id={panelId}
        panelVariant={panelVariant}
        panelTone={panelTone}
        panelCorner={panelCorner}
        panelClassName={panelClassName}
        tone={effectiveTone}
        view={currentView}
        viewMonth={viewMonth}
        viewYear={viewYear}
        weekStartsOn={weekStartsOn}
        showOtherMonths={showOtherMonths}
        cells={cells}
        constraints={constraints}
        value={currentValue}
        selectionMode={selectionMode}
        today={today}
        disabled={disabled}
        inline={inline}
        loading={loading && loaderType === "skeleton"}
        showButtonBar={showButtonBar}
        ariaLabel={panelAriaLabel ?? toggleLabel}
        todayButtonLabel={todayButtonLabel}
        clearButtonLabel={clearButtonLabel}
        onMonthNav={handleMonthNav}
        onYearNav={handleYearNav}
        onSwitchView={setCurrentView}
        onPickMonth={(month) => {
          setViewDate((d) => new Date(d.getFullYear(), month, 1));
          setCurrentView("date");
        }}
        onPickYear={(year) => {
          setViewDate((d) => new Date(year, d.getMonth(), 1));
          setCurrentView("month");
        }}
        onPickDate={handlePickDate}
        onToday={handleToday}
        onClear={handleClear}
        onEscape={handlePanelEscape}
      />
    );

    // ── Inline mode: the panel is the component ─────────────────────────────

    if (inline) {
      return (
        <div className="relative w-full">
          {calendarPanel}
        </div>
      );
    }

    // ── Overlay ─────────────────────────────────────────────────────────────

    const overlayClasses = classNames(
      "dp-date-picker-overlay",
      phase === "entering" && "dp-date-picker-overlay--enter",
      phase === "leaving" && "dp-date-picker-overlay--leave",
    );

    const overlay = overlayVisible ? (
      appendTo === "body" && typeof document !== "undefined" ? (
        createPortal(
          <div
            ref={overlayRef}
            className={overlayClasses}
            style={overlayStyle ?? { position: "fixed", visibility: "hidden" }}
            onAnimationEnd={handleOverlayAnimationEnd}
          >
            {calendarPanel}
          </div>,
          document.body,
        )
      ) : (
        // appendTo="self": below the field, in flow position — for callers
        // that manage stacking themselves (PrimeVue's relativePosition mode).
        <div
          ref={overlayRef}
          className={classNames(
            overlayClasses,
            "absolute left-0 top-full z-50 mt-1",
          )}
          onAnimationEnd={handleOverlayAnimationEnd}
        >
          {calendarPanel}
        </div>
      )
    ) : null;

    // ── Field ───────────────────────────────────────────────────────────────

    const field = (
      <span
        ref={fieldRef}
        aria-busy={loading || undefined}
        className={classNames(
          "group relative flex w-full items-center transition",
          !unstyled &&
            (hasStatus
              ? stripBorderColor(variantTokens.surface)
              : variantTokens.surface),
          isUnderline ? sizeToken.underlinePy : `${sizeToken.px} ${sizeToken.py}`,
          !unstyled && !hasStatus && tokens.focusBorder,
          !unstyled && !isUnderline && !hasStatus && tokens.focusRing,
          !unstyled && hasStatus && FIELD_STATUS_CLASSES[validationStatus],
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      >
        {leadingIcon && (
          <span
            className={classNames(
              "mr-2 inline-flex shrink-0 items-center transition-colors",
              variantTokens.icon,
              !hasStatus && tokens.icon,
            )}
          >
            {renderLeading(leadingIcon)}
          </span>
        )}
        <input
          ref={setInputRef}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
          inputMode="none"
          autoComplete="off"
          value={text}
          onChange={handleTextChange}
          onFocus={(event) => {
            focusedRef.current = true;
            setFocused(true);
            if (showOnFocus && !disabled && !readonly) requestOpen();
            onFocus?.(event);
          }}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
          className={classNames(
            "min-w-0 flex-1 border-none bg-transparent p-0 outline-none",
            sizeToken.text,
            // One text-colour set at a time: an invalid cue next to the
            // variant's own `text-*` is a same-specificity fight (§5.1).
            textInvalid
              ? classNames(
                  stripTextColor(variantTokens.text),
                  "text-rose-500 dark:text-rose-400",
                )
              : variantTokens.text,
            "disabled:cursor-not-allowed",
            inputClassName,
          )}
          {...rest}
          // The input is the dialog trigger (focus opens the calendar), so
          // aria-haspopup + aria-controls belong here — but aria-expanded is
          // not supported by the textbox role; the toggle button below carries
          // the expanded state.
          aria-haspopup="dialog"
          aria-controls={overlayVisible ? panelId : undefined}
          aria-label={hasExplicitName ? undefined : inputAccessibleName}
          aria-invalid={validationStatus === "error" ? true : rest["aria-invalid"]}
        />
        {showClearIcon && (
          <button
            type="button"
            className={trailingButtonClass}
            aria-label={
              selectionMode === "range" ? "Clear date range" : "Clear date"
            }
            disabled={disabled}
            onClick={handleClear}
            onMouseDown={(event) => event.preventDefault()}
          >
            {renderIcon("Close", sizeToken.icon)}
          </button>
        )}
        <button
          type="button"
          className={trailingButtonClass}
          aria-label={toggleLabel}
          aria-haspopup="dialog"
          aria-expanded={overlayVisible}
          aria-controls={overlayVisible ? panelId : undefined}
          disabled={disabled}
          onClick={() => {
            if (phaseRef.current === "closed") requestOpen();
            else requestClose();
          }}
          onMouseDown={(event) => event.preventDefault()}
        >
          {renderIcon("Calendar", sizeToken.icon)}
        </button>
        {loading && !unstyled && (
          <Loader
            overlay
            variant={
              loaderType === "skeleton" ? "spinner" : (loaderType as LoaderProps["variant"])
            }
            size="sm"
            color={effectiveTone}
          />
        )}
        {overlay}
      </span>
    );

    // The gradient variant is the same field with a coloured glow behind it.
    if (variant === "gradient" && !unstyled) {
      return (
        <span
          className={classNames("relative flex w-full", glow.pad)}
        >
          <span
            className={classNames(
              "absolute rounded-2xl leading-none transition-opacity duration-500",
              glow.inset,
              glow.blur,
            )}
            style={{
              background: `linear-gradient(to right, ${glowFrom}, ${glowTo})`,
              opacity: focused ? glow.focusOpacity : glow.idleOpacity,
            }}
            aria-hidden
          />
          {field}
        </span>
      );
    }

    return field;
  },
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
