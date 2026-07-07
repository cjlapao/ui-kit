import classNames from "classnames";
import React from "react";
import Button, {
  type ButtonVariant,
  type ButtonSize,
  type ButtonColor,
} from "./Button";
import { type IconSize } from "../types/Icon";
import { useIconRenderer } from "../contexts/IconContext";
import type { TrueColor, Size } from "../theme/Theme";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl";

const iconSizes: Record<IconSize, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const textSizes: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
};

export type EmptyStateTone = TrueColor;

type ToneConfig = { border: string; text: string; bg: string; icon: string };

// ── Neutral palette tones (static strings — Tailwind picks these up directly) ──

const neutralTones: Record<Extract<TrueColor, "neutral" | "slate" | "gray" | "zinc" | "stone">, ToneConfig> = {
  neutral: {
    border: "border-neutral-300/70 dark:border-neutral-700/60",
    text: "text-neutral-600 dark:text-neutral-300",
    bg: "bg-white/80 dark:bg-neutral-900/40",
    icon: "text-neutral-400 dark:text-neutral-500",
  },
  slate: {
    border: "border-slate-300/70 dark:border-slate-700/60",
    text: "text-slate-600 dark:text-slate-300",
    bg: "bg-slate-50/80 dark:bg-slate-900/40",
    icon: "text-slate-400 dark:text-slate-500",
  },
  gray: {
    border: "border-gray-300/70 dark:border-gray-700/60",
    text: "text-gray-600 dark:text-gray-300",
    bg: "bg-gray-50/80 dark:bg-gray-900/40",
    icon: "text-gray-400 dark:text-gray-500",
  },
  zinc: {
    border: "border-zinc-300/70 dark:border-zinc-700/60",
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-50/80 dark:bg-zinc-900/40",
    icon: "text-zinc-400 dark:text-zinc-500",
  },
  stone: {
    border: "border-stone-300/70 dark:border-stone-700/60",
    text: "text-stone-600 dark:text-stone-300",
    bg: "bg-stone-50/80 dark:bg-stone-900/40",
    icon: "text-stone-400 dark:text-stone-500",
  },
};

const sizes: Record<Size, string> = {
  xs: "h-[30%] w-[30%]",
  sm: "h-[35%] w-[35%]",
  md: "h-[40%] w-[40%]",
  lg: "h-[45%] w-[45%]",
  xl: "h-[50%] w-[50%]",
  xxl: "h-[55%] w-[55%]",
  xxxl: "h-[60%] w-[60%]",
  full: "h-full w-full",
  "2xl": "h-[65%] w-[65%]",
  "3xl": "h-[70%] w-[70%]",
};

// ── Dynamic builder for all TrueColor values ────────────────────────────────
// Uses only class patterns already declared in tailwind-safelist.ts:
//   border-{c}-200            (border200)
//   dark:border-{c}-500/40    (darkBorder500_40)
//   text-{c}-700              (text700)
//   dark:text-{c}-200         (darkText200)
//   bg-{c}-50/80              (bg50_80)
//   dark:bg-{c}-500/10        (darkBg500_10)
//   text-{c}-500              (text500)
//   dark:text-{c}-300         (darkText300)

function buildToneClasses(color: TrueColor): ToneConfig {
  // Static tones for neutral palettes
  if (color === "neutral") return neutralTones.neutral;
  if (color === "slate") return neutralTones.slate;
  if (color === "gray") return neutralTones.gray;
  if (color === "zinc") return neutralTones.zinc;
  if (color === "stone") return neutralTones.stone;

  // All other TrueColor values (red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose)
  return {
    border: `border-${color}-200 dark:border-${color}-500/40`,
    text: `text-${color}-700 dark:text-${color}-200`,
    bg: `bg-${color}-50/80 dark:bg-${color}-500/10`,
    icon: `text-${color}-500 dark:text-${color}-300`,
  };
}

// ── Props ───────────────────────────────────────────────────────────────────

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: ButtonVariant;
  actionColor?: ButtonColor;
  icon?: string | React.ReactElement;
  iconSize?: IconSize;
  iconColor?: TrueColor;
  textSize?: TextSize;
  showIcon?: boolean;
  tone?: EmptyStateTone;
  disableBorder?: boolean;
  transparentBackground?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  actionSize?: ButtonSize;
  actionLeadingIcon?: string | React.ReactElement;
  size?: Size;
}

// ── Component ───────────────────────────────────────────────────────────────

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionVariant = "soft",
  actionColor = "blue",
  icon = "Plus",
  iconSize = "xl",
  iconColor,
  textSize = "md",
  showIcon = true,
  tone = "neutral",
  fullWidth = false,
  fullHeight = false,
  actionSize = "sm",
  size = "md",
  actionLeadingIcon,
  className,
  disableBorder = false,
  transparentBackground = false,
  ...rest
}) => {
  const renderIcon = useIconRenderer();
  const palette = buildToneClasses(tone);

  // lets make the subtitle text size smaller than the title text size
  const subtitleTextSize =
    textSize === "xs"
      ? "xs"
      : textSize === "sm"
        ? "xs"
        : textSize === "md"
          ? "sm"
          : textSize === "lg"
            ? "md"
            : "lg";
  const iconPallete = !iconColor ? palette : buildToneClasses(iconColor);

  return (
    <section
      className={classNames(
        "flex flex-col items-center justify-center gap-1 rounded-3xl px-6 py-10 text-center transition",
        !disableBorder && "border-2 border-dashed shadow-sm",
        palette.border,
        !transparentBackground && palette.bg,
        sizes[size],
        fullWidth && "w-full",
        fullHeight && "h-full",
        className,
      )}
      {...rest}
    >
      {showIcon && (
        <div className={classNames("p-2 dark:bg-white/5", iconPallete.icon)}>
          {React.isValidElement(icon)
            ? icon
            : renderIcon(icon, iconSize, iconSizes[iconSize])}
        </div>
      )}
      <div className="space-y-1">
        <p
          className={classNames(
            textSizes[textSize],
            "font-semibold",
            palette.text,
          )}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className={classNames(
              textSizes[subtitleTextSize],
              "leading-relaxed break-all",
              palette.text,
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button
            size={actionSize}
            variant={actionVariant}
            color={actionColor}
            onClick={onAction}
            leadingIcon={actionLeadingIcon}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </section>
  );
};

export default EmptyState;
