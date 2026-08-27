import classNames from "classnames";
import React, {
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";
import {
  TRUE_COLORS,
  getFieldSizeTokens,
  getInputVariantTokens,
} from "../theme/Theme";
import type { ControlSize, InputVariant, TrueColor } from "../theme/Theme";

export const INPUT_GROUP_VALIDATION_STATUSES = [
  "none",
  "error",
  "success",
] as const;
export type InputGroupValidationStatus =
  (typeof INPUT_GROUP_VALIDATION_STATUSES)[number];

/** The shared control scale, so a group lines up with the Button beside it. */
export type InputGroupSize = ControlSize;

/**
 * The same surfaces `Input`, `SearchBar` and `Checkbox` offer. The group owns
 * the box now — its children render `unstyled` — so the variant has to live
 * here or a group could never be anything but an opaque white card.
 */
export type InputGroupVariant = InputVariant;

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list. The map this replaces had six
// entries — indigo, blue, emerald, amber, rose, slate — and fell back to
// `toneTokens.neutral`, which was not one of them. So for the other fifteen
// tones the lookup produced `undefined` and the next line threw
// `Cannot read properties of undefined (reading 'ring')`: a hard crash, not a
// wrong colour.

type InputGroupToneTokens = {
  /**
   * Resting edge around the whole group. An `outline`, not a `ring`: a ring is
   * painted in the element's own background layer, so the addons — which sit
   * flush against the group's edges with opaque fills of their own — paint
   * straight over it. The focus indicator was only visible in the gap between
   * them, reading as a bar across the middle rather than an edge around the
   * control. Outlines are painted after all descendants, so they survive.
   */
  ring: string;
  /** The same edge, thicker, while anything inside has focus. */
  focusRing: string;
  /**
   * `underline` has no box, so it takes the focus on its bottom rule instead —
   * a full rectangle around it would contradict the variant, and is what a
   * standalone underline `Input` deliberately avoids.
   */
  focusBorder: string;
  /** Addon fill, border and copy. */
  addon: string;
};

/**
 * These are *not* the shared field tone tokens, and deliberately so: the group
 * draws its edge with an `outline` rather than a `ring` (see the type above),
 * and it owns addon fills that no other field has. Only `focusBorder` is the
 * same idea, and it is spelled the same way.
 */
const buildToneTokens = (color: TrueColor): InputGroupToneTokens => ({
  ring: `outline-${color}-200/70 dark:outline-${color}-500/30`,
  focusRing: `focus-within:outline-${color}-400 dark:focus-within:outline-${color}-400`,
  focusBorder: `focus-within:border-${color}-400`,
  addon: [
    `bg-${color}-50/80 border-${color}-200 text-${color}-700`,
    `dark:bg-${color}-500/15 dark:border-${color}-500/40 dark:text-${color}-200`,
  ].join(" "),
});

const TONE_TOKENS: Record<TrueColor, InputGroupToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, InputGroupToneTokens>;

const getToneTokens = (color: TrueColor): InputGroupToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

// ── Sizing ────────────────────────────────────────────────────────────────────

// The addon padding and type scale come from the theme's field table, so the
// two halves of the group line up with the `Input` between them by
// construction rather than by a copy that has to be kept in step.

const STATUS_RING: Record<
  Exclude<InputGroupValidationStatus, "none">,
  string
> = {
  error:
    "outline-rose-400/70 focus-within:outline-rose-500 dark:outline-rose-400/40 dark:focus-within:outline-rose-400",
  success:
    "outline-emerald-400/70 focus-within:outline-emerald-500 dark:outline-emerald-400/40 dark:focus-within:outline-emerald-400",
};

/** The same states expressed on a bottom rule, for `underline`. */
const STATUS_BORDER: Record<
  Exclude<InputGroupValidationStatus, "none">,
  string
> = {
  error: "border-rose-500 dark:border-rose-400",
  success: "border-emerald-500 dark:border-emerald-400",
};

const isAttachableChild = (child: ReactNode) => {
  if (!isValidElement(child)) {
    return false;
  }
  const type = child.type as { __UI_INPUT?: boolean; __UI_SELECT?: boolean };
  return Boolean(type && (type.__UI_INPUT || type.__UI_SELECT));
};

const attachChildProps = (
  child: ReactNode,
  tone: TrueColor,
  size: InputGroupSize,
  disabled: boolean,
): ReactNode => {
  if (!isValidElement(child) || !isAttachableChild(child)) {
    return child;
  }

  const childProps = (child as ReactElement<Record<string, unknown>>).props;

  const props: Record<string, unknown> = {
    tone,
    size,
    unstyled: true,
    // `disabled` used to stop at the group's `opacity-60`, which dims a field
    // that is still perfectly editable. A child's own `disabled` still wins, so
    // one field in an enabled group can be locked on its own.
    disabled: disabled || childProps.disabled === true,
  };

  return React.cloneElement(child as ReactElement, props);
};

export interface InputGroupProps {
  leadingAddon?: ReactNode;
  trailingAddon?: ReactNode;
  children: ReactNode;
  /** @default "blue" */
  tone?: TrueColor;
  /** Alias for `tone`, matching `Input` and `SearchBar`. */
  color?: TrueColor;
  /** Surface treatment of the group box. @default "elevated" */
  variant?: InputGroupVariant;
  /** @default "md" */
  size?: InputGroupSize;
  className?: string;
  /** @default "none" */
  validationStatus?: InputGroupValidationStatus;
  disabled?: boolean;
}

const ADDON_BASE =
  "inline-flex min-w-0 shrink-0 items-center whitespace-nowrap border border-transparent font-medium";

const InputGroup: React.FC<InputGroupProps> = ({
  leadingAddon,
  trailingAddon,
  children,
  tone,
  color,
  variant = "elevated",
  size = "md",
  className,
  validationStatus = "none",
  disabled = false,
}) => {
  const effectiveTone = tone ?? color ?? "blue";
  const toneToken = getToneTokens(effectiveTone);
  const sizeToken = getFieldSizeTokens(size);
  const variantTokens = getInputVariantTokens(variant);
  const hasStatus = validationStatus !== "none";
  const isUnderline = variant === "underline";

  const addonClasses = classNames(
    ADDON_BASE,
    // The base used to carry a fixed `text-sm` next to the size token's own
    // `text-*`, so which one applied at `lg` was decided by emission order.
    sizeToken.text,
    sizeToken.px,
    toneToken.addon,
  );

  return (
    <div
      className={classNames(
        "flex w-full items-stretch overflow-hidden transition",
        variantTokens.surface,
        // `-outline-offset-*` keeps it inside the rounded corner rather than
        // squaring off around it.
        !isUnderline &&
          "outline outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2",
        !isUnderline &&
          (hasStatus
            ? STATUS_RING[validationStatus]
            : classNames(toneToken.ring, toneToken.focusRing)),
        isUnderline &&
          (hasStatus
            ? STATUS_BORDER[validationStatus]
            : toneToken.focusBorder),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
      data-disabled={disabled}
      data-status={validationStatus}
    >
      {leadingAddon !== undefined && (
        <span className={classNames(addonClasses, "border-r")}>
          {leadingAddon}
        </span>
      )}
      <div className="flex min-w-0 flex-1 items-center">
        {React.Children.map(children, (child) =>
          attachChildProps(child, effectiveTone, size, disabled),
        )}
      </div>
      {trailingAddon !== undefined && (
        <span className={classNames(addonClasses, "border-l")}>
          {trailingAddon}
        </span>
      )}
    </div>
  );
};

export default InputGroup;
