import React from "react";
import classNames from "classnames";
import { Panel } from ".";
import { Pill } from "./Pill";
import { CustomIcon } from "./CustomIcon";
import EcgMonitor from "./EcgMonitor";
import { type IconName } from "../icons/registry";
import { getPillColorClasses, type TrueColor } from "../theme";
import type {
  PanelVariant,
  PanelCorner,
  PanelPadding,
} from "./Panel";
import type { EcgMonitorState } from "./EcgMonitor";

export type StatCardSize = "sm" | "md" | "lg";

export interface StatCardTrend {
  value: string | number;
  direction: "up" | "down" | "neutral";
}

export interface StatCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color"> {
  label?: React.ReactNode;
  value?: React.ReactNode;
  icon?: IconName;
  iconTone?: TrueColor;
  trend?: StatCardTrend;
  health?: EcgMonitorState;
  healthBpm?: number;
  size?: StatCardSize;
  tone?: TrueColor;
  variant?: PanelVariant;
  corner?: PanelCorner;
  padding?: PanelPadding;
}

const SIZE_TOKENS: Record<
  StatCardSize,
  {
    value: string;
    label: string;
    chip: string;
    icon: "sm" | "md" | "lg";
    pill: "xs" | "sm" | "md";
    ecg: number;
  }
> = {
  sm: {
    value: "text-xl",
    label: "text-xs",
    chip: "h-8 w-8 rounded-md",
    icon: "sm",
    pill: "xs",
    ecg: 44,
  },
  md: {
    value: "text-3xl",
    label: "text-sm",
    chip: "h-9 w-9 rounded-lg",
    icon: "md",
    pill: "sm",
    ecg: 60,
  },
  lg: {
    value: "text-4xl",
    label: "text-sm",
    chip: "h-11 w-11 rounded-lg",
    icon: "lg",
    pill: "md",
    ecg: 72,
  },
};

const TREND_TONES: Record<StatCardTrend["direction"], TrueColor> = {
  up: "emerald",
  down: "rose",
  neutral: "slate",
};

const TREND_ICONS: Record<StatCardTrend["direction"], IconName> = {
  up: "ArrowUp",
  down: "ArrowDown",
  neutral: "Equal",
};

const isEmpty = (node: React.ReactNode): boolean =>
  node == null || node === "" || node === false;

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconTone = "neutral",
  trend,
  health,
  healthBpm = 60,
  size = "md",
  tone,
  variant,
  corner = "rounded-lg",
  padding = "md",
  className,
  ...rest
}) => {
  const tokens = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const hasLabel = !isEmpty(label);
  const hasValue = !isEmpty(value);
  const hasIcon = !!icon;
  const hasTrend = !!trend;
  const hasHeader = hasLabel || hasIcon;

  const chipTokens = getPillColorClasses(iconTone, "soft");
  const trendTone = trend ? (TREND_TONES[trend.direction] ?? "slate") : "slate";

  return (
    <Panel
      variant={variant}
      tone={tone}
      corner={corner}
      padding={padding}
      flexBody
      className={classNames("flex flex-col", className)}
      {...rest}
    >
      <div className="flex h-full min-w-0 flex-col">
        {hasHeader && (
          <div className="flex items-start justify-between gap-3">
            {hasLabel ? (
              <span
                className={classNames(
                  "min-w-0 font-medium text-neutral-500 dark:text-neutral-400",
                  tokens.label,
                )}
              >
                {label}
              </span>
            ) : (
              <span />
            )}
            {hasIcon && (
              <span
                className={classNames(
                  "inline-flex flex-none items-center justify-center",
                  tokens.chip,
                  chipTokens.base,
                  chipTokens.border,
                )}
              >
                <CustomIcon icon={icon} size={tokens.icon} />
              </span>
            )}
          </div>
        )}

        {hasValue && (
          <div
            className={classNames(
              "flex-1 self-start pt-2 font-semibold tracking-tight text-neutral-900 dark:text-white",
              tokens.value,
            )}
          >
            {value}
          </div>
        )}

        {hasTrend && (
          <div
            className={classNames(
              "flex items-end justify-end pt-2",
              !hasValue && "mt-auto",
            )}
          >
            <Pill
              tone={trendTone}
              variant="soft"
              size={tokens.pill}
              icon={<CustomIcon icon={TREND_ICONS[trend!.direction]} size="xs" />}
            >
              {trend!.value}
            </Pill>
          </div>
        )}

        {health && (
          <EcgMonitor
            state={health}
            bpm={healthBpm}
            useFullWidth
            height={tokens.ecg}
            className="mt-3"
          />
        )}
      </div>
    </Panel>
  );
};

export default StatCard;
