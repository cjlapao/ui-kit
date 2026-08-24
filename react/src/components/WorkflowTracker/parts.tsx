import React from "react";
import classNames from "classnames";

import Pill from "../Pill";
import WorkflowStatusNode from "./WorkflowStatusNode";
import type { TrueColor } from "../../theme/Theme";
import { getStatusTokens, type WorkflowPalette } from "./statusTokens";
import { getSurfaceTokens, type WorkflowSurfaceTokens } from "./surfaces";

/** Falls back to the opaque token set so every piece renders standalone. */
const resolve = (surfaces?: WorkflowSurfaceTokens) =>
  surfaces ?? getSurfaceTokens(false);
import type { WorkflowStatus } from "./types";

/**
 * Quiet placeholder for "nothing here yet". The icon is the tracker's own
 * not-started node, so an empty view still reads as part of the timeline.
 */
export const WorkflowPlaceholder: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  palette: WorkflowPalette;
  surfaces?: WorkflowSurfaceTokens;
  className?: string;
}> = ({ title, subtitle, palette, surfaces, className }) => (
  <div
    className={classNames(
      "flex flex-col items-center justify-center gap-3 px-6 py-10 text-center",
      className,
    )}
  >
    <WorkflowStatusNode status="not_started" palette={palette} size="lg" />
    <div className="space-y-1">
      <p
        className={classNames(
          "text-sm font-semibold",
          resolve(surfaces).mutedText,
        )}
      >
        {title}
      </p>
      {subtitle && (
        <p
          className={classNames(
            "max-w-xs text-xs leading-5",
            resolve(surfaces).faintText,
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

/** Uppercase, letter-spaced section title used across every card. */
export const SectionTitle: React.FC<{
  children: React.ReactNode;
  surfaces?: WorkflowSurfaceTokens;
  className?: string;
}> = ({ children, surfaces, className }) => (
  <span
    className={classNames(
      "text-[10px] font-semibold uppercase tracking-widest",
      resolve(surfaces).faintText,
      className,
    )}
  >
    {children}
  </span>
);

/** Muted counter line that sits opposite a `SectionTitle`. */
export const SectionMeta: React.FC<{
  children: React.ReactNode;
  surfaces?: WorkflowSurfaceTokens;
  className?: string;
}> = ({ children, surfaces, className }) => (
  <span className={classNames("text-xs", resolve(surfaces).mutedText, className)}>
    {children}
  </span>
);

export interface WorkflowBadgeProps {
  children: React.ReactNode;
  status: WorkflowStatus;
  palette: WorkflowPalette;
  /** Overrides the tint derived from `status`. */
  tone?: TrueColor;
}

/** Badge pill whose tint follows the meaning of the status it belongs to. */
export const WorkflowBadge: React.FC<WorkflowBadgeProps> = ({
  children,
  status,
  palette,
  tone,
}) => {
  const tokens = getStatusTokens(status, palette);
  return (
    <Pill
      size="xs"
      uppercase
      tone={tone ?? tokens.pillTone}
      variant="outline"
      className={classNames(
        "shrink-0 font-medium",
        tone ? `bg-${tone}-100 dark:bg-${tone}-900` : tokens.pillFill,
      )}
    >
      {children}
    </Pill>
  );
};

/** Tiny uppercase label above its value — the OWNER / STARTED / SLA row. */
export const MetaField: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
  surfaces?: WorkflowSurfaceTokens;
}> = ({ label, value, surfaces }) => (
  <div className="min-w-0">
    <SectionTitle surfaces={surfaces}>{label}</SectionTitle>
    <p className="mt-1 text-sm font-medium text-neutral-800 dark:text-neutral-100">
      {value}
    </p>
  </div>
);

/** A single `4 done` tally: bold count, muted label. */
export const Tally: React.FC<{
  count: number;
  label: string;
  surfaces?: WorkflowSurfaceTokens;
}> = ({ count, label, surfaces }) => (
  <span className="inline-flex items-center gap-1">
    <span className="font-semibold text-neutral-900 dark:text-white">
      {count}
    </span>
    <span className={resolve(surfaces).mutedText}>{label}</span>
  </span>
);
