import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import Input from "./Input";
import Panel from "./Panel";
import { ScrollArea } from "./ScrollArea";
import Spinner from "./Spinner";
import { useKitT } from "../i18n";
import { useIconRenderer } from "../contexts/IconContext";
import {
  PANEL_TONE_FOR_FIELD,
  SURFACE_VARIANT_FOR_FIELD,
  TRUE_COLORS,
  VALIDATION_STATUSES,
  type ControlSize,
  type InputVariant,
  type SurfaceCorner,
  type SurfaceVariant,
  type TrueColor,
  type ValidationStatus,
} from "../theme/Theme";
import { useAnchoredPopupPosition } from "../hooks/useAnchoredPopupPosition";

const PORTAL_ROOT = typeof document !== "undefined" ? document.body : null;

export const COMBOBOX_VALIDATION_STATUSES = VALIDATION_STATUSES;
export type ComboboxValidationStatus = ValidationStatus;
export type ComboboxSize = ControlSize;
export type ComboboxVariant = InputVariant;

export interface ComboboxOption {
  value: string;
  /** Falls back to `value`. */
  label?: string;
  /** Secondary line under the label. */
  description?: string;
  /** Registry icon name or a node. */
  icon?: string | React.ReactElement;
  disabled?: boolean;
}

/** A bare string is shorthand for `{ value }`. */
export type ComboboxOptionInput = string | ComboboxOption;

export const normaliseOption = (option: ComboboxOptionInput): ComboboxOption =>
  typeof option === "string" ? { value: option } : option;

/**
 * Option tones, generated rather than written out.
 *
 * The table this replaces had 21 hand-written entries in which `red` painted
 * rose and `green` painted emerald — the same drift found in `Input`,
 * `Select` and `MultiSelectPills`, four components deep before anyone noticed
 * two of the twenty-one were lying.
 */
export interface ComboboxToneClasses {
  /** The fill the keyboard cursor draws on the row it parks on. */
  wash: string;
  /** The wash under the mouse - the field's own tone, per the owner's
   * call: a suggestion list is the field's shadow, so it tints like the
   * field does. The keyboard cursor rules above stay as they were. */
  hover: string;
  /** The row matching the current value. */
  selected: string;
}

const buildToneClasses = (tone: TrueColor): ComboboxToneClasses => ({
  wash: `bg-${tone}-50 dark:bg-${tone}-500/15`,
  hover: `hover:bg-${tone}-50 hover:text-${tone}-700 dark:hover:bg-${tone}-500/15 dark:hover:text-${tone}-200`,
  selected: `text-${tone}-700 dark:text-${tone}-200`,
});

export const COMBOBOX_TONE_CLASSES: Record<TrueColor, ComboboxToneClasses> =
  Object.fromEntries(
    TRUE_COLORS.map((tone) => [tone, buildToneClasses(tone)]),
  ) as Record<TrueColor, ComboboxToneClasses>;

export const getComboboxToneClasses = (
  tone: TrueColor | undefined,
): ComboboxToneClasses =>
  COMBOBOX_TONE_CLASSES[tone ?? "blue"] ?? COMBOBOX_TONE_CLASSES.blue;

/** Row metrics per shared control size, so a row lines up with the field. */
const SIZE_ROW: Record<ComboboxSize, string> = {
  xs: "px-2.5 py-1 text-xs",
  sm: "px-3 py-1.5 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-3.5 py-2.5 text-base",
  xl: "px-4 py-3 text-base",
};

export interface ComboboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  // `onSelect` is also a DOM handler on an input; leaving it in would
  // silently widen this component's own callback to a SyntheticEvent one.
  "size" | "color" | "onChange" | "onSelect" | "value" | "className"
> {
  value?: string;
  onChange: (value: string) => void;
  /** Fired only when a row is chosen, not on every keystroke. */
  onSelect?: (option: ComboboxOption) => void;
  options: ComboboxOptionInput[];

  /** @default "md" */
  size?: ComboboxSize;
  /** Accent colour for the focus ring and the highlighted row. */
  tone?: TrueColor;
  /** Alias for `tone`, matching `Input` and `Select`. */
  color?: TrueColor;
  /** Entry style. @default "flat" */
  variant?: ComboboxVariant;
  /** @default "none" */
  validationStatus?: ComboboxValidationStatus;
  /** @deprecated Use `validationStatus="error"`. */
  error?: boolean;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** Fetching options. The list shows a spinner instead of the empty message. */
  loading?: boolean;
  loadingMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  /** Show the clear button once there is something to clear. @default true */
  clearable?: boolean;
  leadingIcon?: string | React.ReactElement;
  /** Rows to show before the list scrolls. @default 6 */
  visibleRows?: number;
  /**
   * Surface of the popup. "auto" follows the field through
   * `SURFACE_VARIANT_FOR_FIELD` - a glass field opens a glass popup.
   * @default "auto"
   */
  panelVariant?: "auto" | SurfaceVariant;
  /** Corner scale of the popup. @default "auto" */
  panelCorner?: SurfaceCorner;
  /** Classes for the field box. */
  className?: string;
  /** Classes for the drop-down. */
  listClassName?: string;
}

/**
 * A text field that suggests, without preventing.
 *
 * Renders `Input` rather than a second field implementation, so the box, the
 * sizes, the entry variants and the validation ring are the ones every other
 * control in the kit uses — the previous version drew its own `border px-3
 * py-2 text-sm` box with a hand-written 21-tone map and no size prop at all,
 * so it could not line up with the `Button` beside it.
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  function Combobox(
    {
      value = "",
      onChange,
      onSelect,
      options = [],
      size = "md",
      tone,
      color,
      variant = "flat",
      validationStatus = "none",
      error = false,
      placeholder,
      disabled = false,
      readOnly = false,
      loading = false,
      loadingMessage,
      emptyMessage,
      clearable = true,
      leadingIcon,
      visibleRows = 6,
      panelVariant = "auto",
      panelCorner = "auto",
      className,
      listClassName,
      id,
      onKeyDown,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) {
    const t = useKitT();
    const renderIcon = useIconRenderer();
    const generatedId = useId();
    const fieldId = id ?? `${generatedId}-combobox`;
    const listId = `${fieldId}-listbox`;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const [activeIndex, setActiveIndex] = useState(-1);

    /**
     * Suppresses the next focus-driven open.
     *
     * Committing puts focus back in the field, and focus opens the list — so
     * choosing an option re-opened the very list it had just closed. Whether
     * that fires at all depends on where focus already was, which is exactly
     * the kind of thing that works in a browser and not in a test, or the
     * other way round.
     */
    const skipNextFocusOpen = useRef(false);
    // The cursor wash is keyboard-initiative: arrows move a caret, a
    // mouse sweep over rows should not light them in the accent.
    const [cursorByKeyboard, setCursorByKeyboard] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const accent = tone ?? color ?? "blue";
    const toneClasses = getComboboxToneClasses(accent);
    const resolvedPanelVariant =
      panelVariant === "auto"
        ? SURFACE_VARIANT_FOR_FIELD[variant]
        : panelVariant;
    // `error` predates `validationStatus`; the explicit status wins.
    const status: ComboboxValidationStatus =
      validationStatus !== "none" ? validationStatus : error ? "error" : "none";

    useEffect(() => setQuery(value), [value]);

    const normalised = useMemo(() => options.map(normaliseOption), [options]);

    const filtered = useMemo(() => {
      if (!query) return normalised;
      const needle = query.toLowerCase();
      return normalised.filter(
        (option) =>
          option.value.toLowerCase().includes(needle) ||
          (option.label ?? "").toLowerCase().includes(needle),
      );
    }, [normalised, query]);

    /** Rows a keyboard cursor may land on. A disabled row is skipped -
     * and while `loading` the list shows only a spinner, so there are no
     * rows to land on: stepping through option rows the eye cannot see
     * (and committing one with Enter) was the cursor outrunning the
     * screen. */
    const selectableIndexes = useMemo(
      () =>
        loading
          ? []
          : filtered
              .map((option, index) => (option.disabled ? -1 : index))
              .filter((index) => index >= 0),
      [filtered, loading],
    );

    const close = useCallback(() => {
      setOpen(false);
      setActiveIndex(-1);
    }, []);

    useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        // The popup lives in a portal, so "outside" has to name it too -
        // a click on a row is not a click outside.
        if (
          containerRef.current?.contains(target) ||
          popupRef.current?.contains(target)
        )
          return;
        close();
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open, close]);

    // Keep the cursor in view. A list that scrolls only with the mouse is not
    // keyboard-navigable, however correct its `aria-activedescendant` is.
    useEffect(() => {
      if (!open || activeIndex < 0) return;
      // Optional-called: `scrollIntoView` is not implemented everywhere a
      // component tree gets rendered, and an unguarded call throws rather
      // than merely failing to scroll.
      listRef.current
        ?.querySelector(`[data-index="${activeIndex}"]`)
        ?.scrollIntoView?.({ block: "nearest" });
    }, [open, activeIndex]);

    const commit = (option: ComboboxOption) => {
      if (option.disabled) return;
      setQuery(option.value);
      onChange(option.value);
      onSelect?.(option);
      close();
      skipNextFocusOpen.current = true;
      inputRef.current?.focus();
    };

    const step = (direction: 1 | -1) => {
      setCursorByKeyboard(true);
      if (selectableIndexes.length === 0) return;
      const position = selectableIndexes.indexOf(activeIndex);
      const next =
        position === -1
          ? direction === 1
            ? selectableIndexes[0]
            : selectableIndexes[selectableIndexes.length - 1]
          : selectableIndexes[
              (position + direction + selectableIndexes.length) %
                selectableIndexes.length
            ];
      setActiveIndex(next);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || readOnly) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!open) setOpen(true);
          step(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!open) setOpen(true);
          step(-1);
          break;
        case "Home":
          if (!open) break;
          event.preventDefault();
          setCursorByKeyboard(true);
          setActiveIndex(selectableIndexes[0] ?? -1);
          break;
        case "End":
          if (!open) break;
          event.preventDefault();
          setCursorByKeyboard(true);
          setActiveIndex(selectableIndexes[selectableIndexes.length - 1] ?? -1);
          break;
        case "Enter":
          if (open && activeIndex >= 0 && filtered[activeIndex]) {
            event.preventDefault();
            commit(filtered[activeIndex]);
          }
          break;
        case "Escape":
          if (open) {
            // Consume the key: a host with its own Escape ladder (a
            // modal, a docked SmartInput) must not close on the rung
            // that merely dismissed this list.
            event.preventDefault();
            event.stopPropagation();
            close();
          }
          break;
        case "Tab":
          close();
          break;
        default:
          break;
      }
    };

    const showClear =
      clearable && Boolean(query) && !disabled && !readOnly && !loading;

    const rowClass = SIZE_ROW[size] ?? SIZE_ROW.md;

    // The popup is a portal against the viewport - a combobox at the
    // bottom of a scroller used to push its own options off-screen.
    const { style: popupStyle, maxHeight: popupMaxHeight } =
      useAnchoredPopupPosition({
        open,
        anchorRef: containerRef,
        popupRef,
        maxHeight: visibleRows * 40,
      });

    const popup = PORTAL_ROOT
      ? createPortal(
          <div
            ref={popupRef}
            style={popupStyle ?? { visibility: "hidden" }}
            data-slot="combobox-popup"
            className={classNames(
              "fixed",
              !popupStyle && "invisible opacity-0",
            )}
          >
            {/* The card is a Panel from the container family, so a glass
                field opens a glass popup instead of an opaque slab. */}
            <Panel
              variant={resolvedPanelVariant}
              tone={PANEL_TONE_FOR_FIELD}
              corner={panelCorner}
              padding="none"
              scrollable={false}
              className={listClassName}
            >
              {/* The kit's own ScrollArea does the scrolling - the same
                  overlay bars every other kit list gets, instead of a
                  bare `overflow-auto` with the browser's native bar.
                  The listbox exists whenever the popup is open; its
                  message states are rows without the option role, so
                  the field's aria-controls never points at nothing. */}
              <ScrollArea
                style={{ maxHeight: popupMaxHeight }}
                variant="hover"
                tabIndex={-1}
              >
                <ul
                  ref={listRef}
                  id={listId}
                  role="listbox"
                  aria-label={rest["aria-label"] ?? placeholder ?? "Options"}
                  className="py-1"
                >
                  {loading ? (
                    <li
                      className={classNames(
                        "flex items-center gap-2 text-neutral-500 dark:text-neutral-400",
                        rowClass,
                      )}
                    >
                      <Spinner size="xs" color={accent} />
                      {loadingMessage ?? t("kit.combobox.loading")}
                    </li>
                  ) : filtered.length === 0 ? (
                    <li
                      className={classNames(
                        "italic text-neutral-500 dark:text-neutral-400",
                        rowClass,
                      )}
                    >
                      {emptyMessage ?? t("kit.combobox.emptyMessage")}
                    </li>
                  ) : (
                    filtered.map((option, index) => {
                      const selected = option.value === value;
                      const active = index === activeIndex && !option.disabled;
                      return (
                        <li
                          key={option.value}
                          id={`${listId}-${index}`}
                          data-index={index}
                          role="option"
                          aria-selected={selected}
                          aria-disabled={option.disabled || undefined}
                          // `onMouseDown` rather than `onClick`: the input's
                          // blur fires first otherwise and the list is gone
                          // before the click lands.
                          onMouseDown={(event) => {
                            event.preventDefault();
                            commit(option);
                          }}
                          onMouseEnter={() => {
                            if (option.disabled) return;
                            // Hover follows the mouse for aria, but it is
                            // not a cursor move - no wash from the cursor
                            // rules, just CSS hover.
                            setCursorByKeyboard(false);
                            setActiveIndex(index);
                          }}
                          className={classNames(
                            "flex items-center gap-2",
                            rowClass,
                            option.disabled
                              ? "cursor-not-allowed opacity-50"
                              : classNames("cursor-pointer", toneClasses.hover),
                            // The cursor wash only paints when the keyboard
                            // parked it: two same-specificity fills otherwise
                            // resolve by emission order, not by intent.
                            active &&
                              cursorByKeyboard &&
                              (selected
                                ? classNames(
                                    toneClasses.wash,
                                    "ring-1 ring-inset ring-neutral-400/40 dark:ring-white/25",
                                  )
                                : "bg-neutral-50 dark:bg-neutral-800/60"),
                            selected
                              ? classNames(toneClasses.selected, "font-medium")
                              : "text-neutral-900 dark:text-neutral-100",
                          )}
                        >
                          {option.icon && (
                            <span className="inline-flex shrink-0 items-center">
                              {typeof option.icon === "string"
                                ? renderIcon(option.icon, "sm", "h-4 w-4")
                                : option.icon}
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate">
                              {option.label ?? option.value}
                            </span>
                            {option.description && (
                              <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                                {option.description}
                              </span>
                            )}
                          </span>
                          {selected &&
                            renderIcon("Check", "sm", "h-4 w-4 shrink-0")}
                        </li>
                      );
                    })
                  )}
                </ul>
              </ScrollArea>
            </Panel>
          </div>,
          PORTAL_ROOT,
        )
      : null;

    return (
      <div ref={containerRef} className="relative w-full">
        <Input
          {...rest}
          ref={inputRef}
          id={fieldId}
          type="text"
          value={query}
          size={size}
          tone={accent}
          variant={variant}
          validationStatus={status}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={className}
          leadingIcon={leadingIcon}
          // One contextual affordance rather than two stacked glyphs in a
          // small field: clear while there is something to clear, otherwise
          // the caret. Rendered by `Input`, so it keeps the kit's focus ring
          // and hit area — the old version nested its own `IconButton` in a
          // `pointer-events-none` box.
          trailingIcon={
            showClear ? (
              "Close"
            ) : loading ? (
              <Spinner size="xs" color={accent} />
            ) : (
              "ArrowDown"
            )
          }
          trailingIconLabel={
            showClear
              ? t("kit.combobox.clear")
              : loading
                ? t("kit.combobox.loading")
                : t("kit.combobox.showOptions")
          }
          onTrailingIconClick={() => {
            if (showClear) {
              setQuery("");
              onChange("");
              inputRef.current?.focus();
              return;
            }
            if (disabled || readOnly) return;
            setOpen((current) => !current);
            inputRef.current?.focus();
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
          }
          autoComplete="off"
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            onChange(next);
            setActiveIndex(-1);
            if (!open) setOpen(true);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            if (skipNextFocusOpen.current) {
              skipNextFocusOpen.current = false;
              return;
            }
            if (!disabled && !readOnly) setOpen(true);
          }}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
        />

        {open && !disabled && !readOnly ? popup : null}
      </div>
    );
  },
);

Combobox.displayName = "Combobox";

export default Combobox;
