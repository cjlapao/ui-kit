import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import classNames from "classnames";

import Panel, { type PanelProps } from "./Panel";
import Checkbox from "./Checkbox";
import Pill, { type PillVariant } from "./Pill";
import { GAP_CLASSES } from "./MultiSelectPills";
import { renderIcon } from "../utils/renderIcon";
import type {
  ControlSize,
  InputVariant,
  SurfaceTone,
  TrueColor,
} from "../theme/Theme";

/** A grid with more tracks than this is a table, not a card group. */
const MAX_COLUMNS = 6;

/**
 * Where the `labels` pills sit on the title row. `left` hugs the title — the
 * two read as one phrase; `right` pushes them to the trailing edge so a column
 * of cards lines its labels up in a ragged-free vertical rhythm.
 */
export const MULTI_SELECT_PANEL_LABEL_ALIGNS = ["left", "right"] as const;
export type MultiSelectPanelLabelAlign =
  (typeof MULTI_SELECT_PANEL_LABEL_ALIGNS)[number];

/**
 * The Panel surface the cards wear. Everything else on `PanelProps` is left
 * out on purpose: `title`/`subtitle`/`badge`/`media`/`actions`/`loading`
 * render as their own header and body blocks, which would fight the composed
 * row the card is built from. The card's copy comes from the option fields.
 */
export type MultiSelectPanelSurfaceProps = Pick<
  PanelProps,
  | "variant"
  | "tone"
  | "padding"
  | "corner"
  | "transparency"
  | "hoverable"
  | "hoverShadow"
  | "hoverColor"
  | "decoration"
  | "pulse"
  | "pulseTone"
  | "activeTone"
  | "borderColor"
  | "backgroundColor"
  | "glassOpacity"
  | "vibrancy"
  | "specularMode"
  | "raisedSurface"
>;

export interface MultiSelectPanelOption {
  /** The value this card contributes to the selection and to a form submit. */
  value: string;
  /** The only required field. Leads the title row, after the box and icon. */
  title: React.ReactNode;
  /** Muted line under the title. */
  subtitle?: React.ReactNode;
  /** Registry name (resolved through the kit icon registry) or any element. */
  icon?: React.ReactNode;
  /**
   * Label pills on the title row, placed by the group's `labelAlign` and
   * wrapping when they overflow. Strings render as pill children; any node is
   * passed through.
   */
  labels?: React.ReactNode[];
  /** Opts this card out: dimmed, unfocusable, never activates. */
  disabled?: boolean;

  /** Beats the group's `variant` for this card. */
  variant?: MultiSelectPanelSurfaceProps["variant"];
  /**
   * Beats the group's `tone`. The box accent and the selection rim follow it
   * unless they are given hues of their own, and so does the hover — though a
   * card that is the *selected* one answers the pointer in the group's selection
   * hue instead, so a card selected in amber hovers amber whatever this says.
   * `hoverColor` overrides that.
   */
  tone?: SurfaceTone;
  /**
   * Beats the group's `activeTone` — this card's selection hue, rim and wash
   * together. `undefined` follows the group, whose default is this card's tone.
   */
  activeTone?: TrueColor;
  /**
   * Beats the group's `pulseTone` — this card's attention glow. `undefined`
   * follows the group, whose default is the card's own selection hue.
   */
  pulseTone?: TrueColor;
  /**
   * Beats the group's `hoverColor` — this card's hover wash, pressed step and
   * hover rim. `undefined` follows the group, whose default is the hue the card
   * is selected in *while it is*, else its own tone: the selected card hovers in
   * the colour of its own state, and nobody else borrows it.
   */
  hoverColor?: TrueColor;
  /** Beats the group's `corner`. */
  corner?: MultiSelectPanelSurfaceProps["corner"];
  /** Beats the group's `padding`. */
  padding?: MultiSelectPanelSurfaceProps["padding"];
  /** Beats the group's `pulse`. */
  pulse?: boolean;
  /** Beats the group's `checkboxVariant` for this card's box. */
  checkboxVariant?: InputVariant;
  /**
   * Beats the group's `checkboxTone` for this card's box, letting the box wear
   * a hue the card does not.
   */
  checkboxTone?: TrueColor;
}

export interface MultiSelectPanelProps extends MultiSelectPanelSurfaceProps {
  /**
   * Form field name. Multiple mode submits a checkbox field per selection
   * (`name[]=…`); single mode submits a plain radio field (`name=…`).
   */
  name: string;
  /** The cards. */
  options: MultiSelectPanelOption[];

  /** Group heading above the grid. */
  label?: React.ReactNode;
  /** Helper under the heading, wired to the group via `aria-describedby`. */
  description?: React.ReactNode;

  /** Selected values, for controlled use. */
  value?: string[];
  /** Selected values at mount, for uncontrolled use. */
  defaultValue?: string[];
  onChange?: (selectedValues: string[]) => void;

  /**
   * `multiple` is a checkbox group, every card its own tab stop; `single` is a
   * radiogroup — one tab stop, arrows walk and pick.
   * @default "multiple"
   */
  selectionMode?: "multiple" | "single";
  /**
   * Single mode: whether clicking the selected card clears the group.
   * @default true
   */
  allowDeselect?: boolean;

  /** Disable the whole group. */
  disabled?: boolean;

  /** Grid tracks, clamped to 1–6. Every card is then the same width. @default 2 */
  columns?: number;
  /** Space between cards, on the shared control scale. @default "md" */
  gap?: ControlSize;
  /** Card typography, icon and box size, on the shared control scale. @default "md" */
  size?: ControlSize;
  /**
   * Surface treatment of the checkbox box, on the shared textbox scale — the
   * same `variant` `Input` and `Checkbox` wear. @default "flat"
   */
  checkboxVariant?: InputVariant;
  /**
   * Accent of the checkbox box, allowed to disagree with the card it sits on.
   *
   * Omitted, each box wears its own card's tone (blue where the card is
   * untinted), which is how a group looks when nobody has an opinion. The box
   * keeps the hue's own contrast pair — `-{tone}-700` filled, `-{tone}-500`
   * resting — so only the hue is yours, never the legibility.
   * @default the card's tone
   */
  checkboxTone?: TrueColor;

  /** Tone of the `labels` pills. @default the card's tone */
  labelTone?: TrueColor;
  /** Variant of the `labels` pills. @default "outline" */
  labelVariant?: PillVariant;
  /**
   * Alignment of the `labels` pills on the title row.
   *
   * `left` hugs the title; `right` pins them to the trailing edge of the card.
   * Either way the row wraps, so a long title never squeezes a pill out.
   * @default "left"
   */
  labelAlign?: MultiSelectPanelLabelAlign;

  className?: string;
}

const ARROWS_BACKWARD = ["ArrowUp", "ArrowLeft"];
const ARROWS_FORWARD = ["ArrowDown", "ArrowRight"];

/**
 * A grid of selectable cards, each one a `Panel` wearing the kit's `Checkbox`.
 *
 * The two components are used as they are, not reimplemented: `Panel` supplies
 * the surface (`variant`, `tone`, `padding`, `corner`, the glass pair), the
 * pointer answer and the sustained selection state — its `active` rim *is* the
 * selected card — and `Checkbox` supplies the drawn box, the form field, and
 * the card's whole text column through its `label`/`description` slots, so the
 * type scale of a card is `Checkbox`'s own and cannot drift from one.
 *
 * The card is the control and the Checkbox is the presentation: see the
 * `PRESENTATION_INPUT_PROPS` note below for why the input is inert.
 */
export const MultiSelectPanel: React.FC<MultiSelectPanelProps> = ({
  name,
  options,
  label,
  description,
  value,
  defaultValue,
  onChange,
  selectionMode = "multiple",
  allowDeselect = true,
  disabled = false,
  columns = 2,
  gap = "md",
  size = "md",
  checkboxVariant = "flat",
  checkboxTone,
  labelTone,
  labelVariant = "outline",
  labelAlign = "left",
  variant = "elevated",
  tone = "blue",
  padding = "sm",
  corner = "rounded-sm",
  transparency,
  hoverable,
  hoverShadow,
  hoverColor,
  decoration,
  pulse,
  pulseTone,
  activeTone,
  borderColor,
  backgroundColor,
  glassOpacity,
  vibrancy,
  specularMode,
  raisedSurface = false,
  className,
}) => {
  const groupId = useId();
  const legendId = `${groupId}-label`;
  const helperId = `${groupId}-helper`;
  const isSingle = selectionMode === "single";

  const isControlled = value !== undefined;
  // `defaultValue` is the value *at mount* — re-rendering with a same-content
  // array of a different identity must not reset a group the user has been
  // clicking. Only the first render reads it.
  const [internalValue, setInternalValue] = useState<string[]>(
    () => defaultValue ?? [],
  );
  const selectedValues = isControlled ? (value ?? []) : internalValue;
  // The freshest selection, so a second click landing before the re-render
  // computes from the first click's result rather than from a stale render.
  const selectedRef = useRef<string[]>(selectedValues);
  selectedRef.current = selectedValues;
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const isOptionDisabled = useCallback(
    (option: MultiSelectPanelOption) => disabled || option.disabled === true,
    [disabled],
  );

  const commit = useCallback(
    (next: string[]) => {
      if (!isControlled) {
        selectedRef.current = next;
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const toggleOption = useCallback(
    (option: MultiSelectPanelOption) => {
      if (isOptionDisabled(option)) return;
      const current = selectedRef.current;
      const isSelected = current.includes(option.value);
      if (isSingle) {
        if (isSelected) {
          if (!allowDeselect) return;
          commit([]);
        } else {
          commit([option.value]);
        }
        return;
      }
      commit(
        isSelected
          ? current.filter((v) => v !== option.value)
          : [...current, option.value],
      );
    },
    [allowDeselect, commit, isOptionDisabled, isSingle],
  );

  const firstSelectableIndex = options.findIndex(
    (option) => !isOptionDisabled(option),
  );

  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  /** Next enabled card in `direction`, wrapping; -1 when the group is all off. */
  const stepFrom = useCallback(
    (from: number, direction: 1 | -1) => {
      const total = options.length;
      if (total === 0) return -1;
      for (let offset = 1; offset <= total; offset += 1) {
        const index = (((from + direction * offset) % total) + total) % total;
        if (!isOptionDisabled(options[index])) return index;
      }
      return -1;
    },
    [isOptionDisabled, options],
  );

  const focusCard = useCallback((index: number) => {
    cardRefs.current[index]?.focus();
  }, []);

  /**
   * The radiogroup's single tab stop: the selected card, or — with nothing
   * selected yet — the first usable one. Every other card stays reachable by
   * the arrow keys only, which is what makes the group read as one control.
   */
  const rovingTabIndex = useCallback(
    (option: MultiSelectPanelOption, index: number, isSelected: boolean) => {
      if (isOptionDisabled(option)) return -1;
      if (isSelected) return 0;
      return selectedValues.length === 0 && index === firstSelectableIndex
        ? 0
        : -1;
    },
    [firstSelectableIndex, isOptionDisabled, selectedValues.length],
  );

  /**
   * One key handler for every card, on the element that carries the role.
   * Target-guarded the way `Panel`'s own card handler is: a key that came from
   * something inside the card is not the card being pressed.
   */
  const handleCardKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, option: MultiSelectPanelOption, index: number) => {
      if (event.target !== event.currentTarget) return;
      if (isOptionDisabled(option)) return;
      const { key } = event;

      if (key === "Enter" || key === " ") {
        // Without this, Space scrolls the page instead of pressing the card.
        event.preventDefault();
        toggleOption(option);
        return;
      }

      if (!isSingle) return;

      let target = -1;
      if (ARROWS_FORWARD.includes(key)) {
        target = stepFrom(index, 1);
      } else if (ARROWS_BACKWARD.includes(key)) {
        target = stepFrom(index, -1);
      } else if (key === "Home") {
        target = options.findIndex((candidate) => !isOptionDisabled(candidate));
      } else if (key === "End") {
        for (let i = options.length - 1; i >= 0; i -= 1) {
          if (!isOptionDisabled(options[i])) {
            target = i;
            break;
          }
        }
      } else {
        return;
      }

      if (target === -1) return;
      event.preventDefault();
      focusCard(target);
      // A radiogroup picks as it moves — the pattern MultiSelectPills sets.
      toggleOption(options[target]);
    },
    [
      focusCard,
      isOptionDisabled,
      isSingle,
      options,
      stepFrom,
      toggleOption,
    ],
  );

  const trackCount = Number.isFinite(columns)
    ? Math.max(1, Math.min(MAX_COLUMNS, Math.round(columns)))
    : 2;

  return (
    <fieldset
      className={classNames("min-w-0 border-0 p-0", className)}
      disabled={disabled}
      role={isSingle ? "radiogroup" : undefined}
      aria-labelledby={label ? legendId : undefined}
      aria-describedby={description ? helperId : undefined}
      data-selection-mode={selectionMode}
    >
      {label && (
        <legend
          id={legendId}
          className={classNames(
            "mb-2 text-xs font-semibold uppercase tracking-widest",
            description ? "pb-0" : "pb-1",
            // The heading sits on the page, not on a card, so it takes the
            // muted end of the scale the way a form's group label does.
            "text-neutral-500 dark:text-neutral-400",
          )}
        >
          {label}
        </legend>
      )}
      {description && (
        <p
          id={helperId}
          className={classNames(
            "pb-3 text-xs",
            "text-neutral-500 dark:text-neutral-400",
          )}
        >
          {description}
        </p>
      )}

      <div
        className={classNames("grid", GAP_CLASSES[gap] ?? GAP_CLASSES.md)}
        style={{
          // Tracks are an inline style rather than an arbitrary Tailwind class,
          // so there is nothing new to safelist and nothing to rebuild.
          gridTemplateColumns: `repeat(${trackCount}, minmax(0, 1fr))`,
          // One row height for the whole group: a card with a subtitle and
          // three pills and a card with only a title are the same size.
          gridAutoRows: "1fr",
        }}
      >
        {options.map((option, index) => {
          const isSelected = selectedSet.has(option.value);
          const optionDisabled = isOptionDisabled(option);
          const cardId = `${groupId}-${option.value}`;
          // The card's hue, resolved once. The box rides it by default — the
          // look a group has when nobody has an opinion — and `checkboxTone`,
          // the group's or this card's, is the licence to split it loose.
          const cardTone = option.tone ?? tone;
          const boxTone: TrueColor =
            option.checkboxTone ??
            checkboxTone ??
            (cardTone === "none" ? "blue" : cardTone);
          // Roving tabindex for the radiogroup: the selected card is the tab
          // stop — or, with nothing selected, the first usable one. Multiple
          // mode leaves the order to Panel, which makes every enabled card a
          // tab stop and a disabled one unreachable.
          const tabIndex = isSingle
            ? rovingTabIndex(option, index, isSelected)
            : undefined;

          return (
            <Panel
              key={option.value}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              /* The card is the control. Panel defaults `role` to `button`
                 only when the caller passes none; a multi-select group of
                 cards is a checkbox group, so the role and its state come from
                 here, along with the tab order. */
              role={isSingle ? "radio" : "checkbox"}
              aria-checked={isSelected}
              aria-labelledby={`${cardId}-title`}
              aria-describedby={
                option.subtitle ? `${cardId}-input-description` : undefined
              }
              tabIndex={tabIndex}
              onClick={() => toggleOption(option)}
              onKeyDown={(event) => handleCardKeyDown(event, option, index)}
              clickable
              active={isSelected}
              disabled={optionDisabled}
              /* The dimmed `Checkbox` below is the card's disabled language —
                 the very one a lone disabled option speaks, so a card and an
                 option never disagree. Panel's sheet would say it a second way,
                 and on a flat `simple` or `tonal` body a `white/70` rectangle
                 inset by the padding reads as a stray panel inside the card
                 rather than as a state. */
              disabledVeil={false}
              variant={option.variant ?? variant}
              tone={cardTone}
              padding={option.padding ?? padding}
              corner={option.corner ?? corner}
              transparency={transparency}
              hoverable={hoverable}
              hoverShadow={hoverShadow}
              hoverColor={option.hoverColor ?? hoverColor}
              decoration={decoration}
              pulse={option.pulse ?? pulse}
              pulseTone={option.pulseTone ?? pulseTone}
              activeTone={option.activeTone ?? activeTone}
              borderColor={borderColor}
              backgroundColor={backgroundColor}
              glassOpacity={glassOpacity}
              vibrancy={vibrancy}
              specularMode={specularMode}
              raisedSurface={raisedSurface}
              className="h-full"
              data-multiselect-card={option.value}
            >
              <Checkbox
                id={`${cardId}-input`}
                className="w-full min-w-0"
                fullWidth
                checked={isSelected}
                disabled={optionDisabled}
                size={size}
                variant={option.checkboxVariant ?? checkboxVariant}
                tone={boxTone}
                descriptionPlacement="bottom"
                name={isSingle ? name : `${name}[]`}
                value={option.value}
                /* The card owns the interaction, so the input is presentation
                   and a form field only. Each of these is load-bearing:
                   `display: none` because the input is otherwise an invisible
                   overlay on the box — a dead zone inside a card that is
                   clickable everywhere else, since `Panel` hands a click that
                   resolves to a control to that control — and because it takes
                   the field out of axe's "nested interactive" set, which is
                   the machine-checkable version of "this is not a second
                   control". `pointerEvents` stays for anyone who later gives it
                   a display again; `onClick`'s `preventDefault` because the
                   label's forwarded activation must not flip the box to a state
                   `checked` does not carry; and the no-op `onChange` because
                   the field is controlled and React says so. The drawn box is
                   a sibling styled off `peer-checked`, and its wrapper carries
                   its own size, so hiding the input costs the card nothing. */
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: "none", pointerEvents: "none" }}
                onClick={(event) => event.preventDefault()}
                onChange={() => {}}
                label={
                  <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    {option.icon !== undefined && (
                      <span
                        aria-hidden="true"
                        className="shrink-0 opacity-80"
                      >
                        {typeof option.icon === "string" ||
                        React.isValidElement(option.icon)
                          ? // A registry name or an element is sized with the card;
                            // anything else — an `<img`, a hand-rolled node — is
                            // passed through untouched, exactly as `Pill` does with
                            // its adornments.
                            renderIcon(option.icon, size)
                          : option.icon}
                      </span>
                    )}
                    <span
                      id={`${cardId}-title`}
                      className="min-w-0 break-words"
                    >
                      {option.title}
                    </span>
                    {option.labels && option.labels.length > 0 && (
                      <span
                        className={classNames(
                          "flex flex-wrap items-center gap-1",
                          /* Logical, not `ml-auto`: pinned to the *end*, so an
                             RTL card pushes its labels to the left. `justify-end`
                             then keeps the pills together when they wrap onto a
                             line of their own. */
                          labelAlign === "right" && "ms-auto justify-end",
                        )}
                      >
                        {option.labels.map((pill, pillIndex) =>
                          typeof pill === "string" ? (
                            <Pill
                              key={pillIndex}
                              size="sm"
                              variant={labelVariant}
                              tone={
                                labelTone ??
                                ((option.tone ?? tone) === "none"
                                  ? "neutral"
                                  : (option.tone ?? tone) as TrueColor)
                              }
                            >
                              {pill}
                            </Pill>
                          ) : (
                            <React.Fragment key={pillIndex}>
                              {pill}
                            </React.Fragment>
                          ),
                        )}
                      </span>
                    )}
                  </span>
                }
                description={option.subtitle}
              />
            </Panel>
          );
        })}
      </div>
    </fieldset>
  );
};

MultiSelectPanel.displayName = "MultiSelectPanel";

export default MultiSelectPanel;
