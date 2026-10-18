import React from "react";
import classNames from "classnames";

import CustomIcon from "../CustomIcon";
import Pill, { type PillVariant } from "../Pill";
import Progress from "../Progress";
import ProgressSpinner from "../ProgressSpinner";
import { SkeletonBar } from "../Panel";
import {
  getHeaderSurface,
  headerGlyph,
  headerReservesGlyph,
  type ConnectionFlowProgressType,
} from "../../connectionFlow";
import {
  getSurfaceCornerClass,
  type SurfaceCorner,
  type SurfaceVariant,
  type TrueColor,
} from "../../theme/Theme";
import type { IconName } from "../../icons/registry";

export interface ConnectionFlowHeaderProps {
  variant: SurfaceVariant;
  tone: TrueColor;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** A registry name, or any node. */
  icon?: React.ReactNode;
  iconCorner: SurfaceCorner;
  tag?: React.ReactNode;
  tagTone?: TrueColor;
  tagVariant: PillVariant;
  /** 0–1, or undefined when nothing reports progress. */
  progress?: number;
  progressType: ConnectionFlowProgressType;
  animated: boolean;
  loading?: boolean;
}

/** The chip is the same box whatever is in it, so the title never shifts. */
const GLYPH_BOX = 44;

/**
 * The frame's header: eyebrow, icon, title, tag, and the flow's own progress
 * directly beneath them.
 *
 * Built here rather than handed to `Panel` for two reasons: Panel's header
 * carries no icon chip and no progress, and `variant="plain"` renders no Panel
 * at all — so the header has to belong to the flow either way.
 */
const ConnectionFlowHeader: React.FC<ConnectionFlowHeaderProps> = ({
  variant,
  tone,
  eyebrow,
  title,
  subtitle,
  icon,
  iconCorner,
  tag,
  tagTone,
  tagVariant,
  progress,
  progressType,
  animated,
  loading = false,
}) => {
  const surface = getHeaderSurface(variant);
  const hasIcon = Boolean(icon);
  const reserve = headerReservesGlyph(hasIcon, progressType);
  const glyph = headerGlyph(hasIcon, progressType, progress);
  const showBar = progressType === "bar" && progress !== undefined;

  const chip = reserve ? (
    <span
      className={classNames(
        "flex shrink-0 items-center justify-center overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover",
        // Only the icon sits on a chip; a spinner is its own shape and a
        // filled square behind it reads as a second, competing ring.
        glyph.kind === "icon" && getSurfaceCornerClass(iconCorner),
        glyph.kind === "icon" && surface.chip,
      )}
      style={{ width: GLYPH_BOX, height: GLYPH_BOX }}
    >
      {glyph.kind === "spinner" && (
        <ProgressSpinner
          size="lg"
          value={glyph.value * 100}
          color={tone === "neutral" ? "blue" : tone}
          showValue={false}
        />
      )}
      {glyph.kind === "icon" &&
        (typeof icon === "string" ? (
          <CustomIcon
            icon={icon as IconName}
            customSize={22}
            className={surface.muted}
          />
        ) : (
          icon
        ))}
    </span>
  ) : null;

  if (loading) {
    return (
      <div
        className="flex animate-pulse flex-col gap-3 motion-reduce:animate-none"
        aria-hidden="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {reserve && (
              <span
                className={classNames(
                  "block shrink-0",
                  getSurfaceCornerClass(iconCorner),
                  "bg-black/10 dark:bg-white/10",
                )}
                style={{ width: GLYPH_BOX, height: GLYPH_BOX }}
              />
            )}
            <div className="min-w-0 flex-1 space-y-2">
              {eyebrow !== undefined && <SkeletonBar width="7rem" className="h-2.5" />}
              <SkeletonBar width="14rem" className="h-5" />
              {subtitle !== undefined && <SkeletonBar width="9rem" className="h-3" />}
            </div>
          </div>
          {tag !== undefined && <SkeletonBar width="5rem" className="h-6" />}
        </div>
        {progressType === "bar" && <SkeletonBar width="100%" className="h-1.5" />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {chip}
          <div className="min-w-0">
            {eyebrow && (
              <p
                className={classNames(
                  "truncate text-[11px] font-semibold uppercase tracking-widest",
                  surface.eyebrow,
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className="truncate text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={classNames("truncate text-xs", surface.muted)}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {tag &&
          (typeof tag === "string" ? (
            <Pill size="sm" tone={tagTone ?? tone} variant={tagVariant}>
              {tag}
            </Pill>
          ) : (
            tag
          ))}
      </div>

      {/* Directly beneath the title and icon, at the header's full width. */}
      {showBar && (
        <Progress
          size="xs"
          color={tone === "neutral" ? "blue" : tone}
          value={(progress ?? 0) * 100}
          motion={animated && (progress ?? 0) < 1 ? "shimmer" : "none"}
          showValue
        />
      )}
    </div>
  );
};

ConnectionFlowHeader.displayName = "ConnectionFlowHeader";

export default ConnectionFlowHeader;
