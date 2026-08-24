import classNames from "classnames";
import React, { type ReactNode } from "react";
import Spinner, {
  type SpinnerColor,
  type SpinnerProps,
  type SpinnerThickness,
  type SpinnerVariant,
} from "./Spinner";
import Progress from "./Progress";
import { getSurfaceGlassFillClass } from "../theme/glass";
import type { ControlSize } from "../theme/Theme";
import {
  SurfaceProvider,
  useSurfaceText,
} from "../contexts/SurfaceContext";

export const LOADER_VARIANTS = ["spinner", "progress"] as const;
export type LoaderVariant = (typeof LOADER_VARIANTS)[number];

/**
 * The shared control scale: it drives the spinner's diameter, the progress
 * bar's height, and the title/label type size together.
 */
export type LoaderSize = ControlSize;
export type LoaderColor = SpinnerColor;

export const LOADER_GLASS_BLURS = ["none", "low", "medium", "high"] as const;
export type GlassBlurIntensity = (typeof LOADER_GLASS_BLURS)[number];

export interface LoaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** @default "spinner" */
  variant?: LoaderVariant;
  /** @default "md" */
  size?: LoaderSize;
  /** @default "blue" */
  color?: LoaderColor;
  /** @default "segments" */
  spinnerVariant?: SpinnerVariant;
  /** @default "normal" */
  spinnerThickness?: SpinnerThickness;
  title?: ReactNode;
  label?: ReactNode;
  /** @default 0 */
  progress?: number;
  /**
   * Progress variant only — the bar sweeps instead of filling and no
   * `aria-valuenow` is published, which is what tells assistive technology
   * the extent is unknown.
   * @default false
   */
  indeterminate?: boolean;
  className?: string;
  /**
   * Cover the nearest positioned ancestor. Render the loader inside a
   * `relative` container for the overlay to fill.
   * @default false
   */
  overlay?: boolean;
  /** Overlay only — a see-through glass fill instead of a solid scrim. @default false */
  glass?: boolean;
  /** @default "medium" */
  glassBlurIntensity?: GlassBlurIntensity;
}

const sizeMap: Record<
  LoaderSize,
  {
    spinner: NonNullable<SpinnerProps["size"]>;
    title: string;
    label: string;
  }
> = {
  xs: { spinner: "xs", title: "text-xs", label: "text-xs" },
  sm: { spinner: "sm", title: "text-sm", label: "text-xs" },
  md: { spinner: "md", title: "text-base", label: "text-sm" },
  lg: { spinner: "lg", title: "text-lg", label: "text-base" },
  xl: { spinner: "xl", title: "text-xl", label: "text-base" },
};

const blurIntensityMap: Record<GlassBlurIntensity, string> = {
  none: "backdrop-blur-none",
  low: "backdrop-blur-md",
  medium: "backdrop-blur-lg",
  high: "backdrop-blur-2xl",
};

interface LoaderBodyProps {
  variant: LoaderVariant;
  size: LoaderSize;
  color: LoaderColor;
  spinnerVariant?: SpinnerVariant;
  spinnerThickness?: SpinnerThickness;
  title?: ReactNode;
  label?: ReactNode;
  progress: number;
  indeterminate: boolean;
}

/**
 * Split out so it can read `useSurfaceText()`. A component cannot consume a
 * provider it renders itself, so the copy lives in a child.
 */
const LoaderBody: React.FC<LoaderBodyProps> = ({
  variant,
  size,
  color,
  spinnerVariant,
  spinnerThickness,
  title,
  label,
  progress,
  indeterminate,
}) => {
  const resolvedSize = sizeMap[size] ?? sizeMap.md;
  const surface = useSurfaceText();

  return (
    <>
      {title && (
        <div
          className={classNames(
            "font-semibold",
            surface.heading,
            resolvedSize.title,
          )}
        >
          {title}
        </div>
      )}
      {variant === "progress" ? (
        <div className="w-full min-w-[12rem] space-y-3">
          <Progress
            value={progress}
            indeterminate={indeterminate}
            size={size}
            color={color}
          />
        </div>
      ) : (
        <Spinner
          size={resolvedSize.spinner}
          color={color}
          variant={spinnerVariant}
          thickness={spinnerThickness}
        />
      )}
      {label && (
        <div className={classNames(surface.description, resolvedSize.label)}>
          {label}
        </div>
      )}
    </>
  );
};

const Loader: React.FC<LoaderProps> = ({
  variant = "spinner",
  spinnerVariant = "segments",
  spinnerThickness = "normal",
  size = "md",
  color = "blue",
  title,
  label,
  progress = 0,
  indeterminate = false,
  className,
  overlay = false,
  glass = false,
  glassBlurIntensity = "medium",
  ...rest
}) => {
  const blur = blurIntensityMap[glassBlurIntensity] ?? blurIntensityMap.medium;
  const overlayClass = classNames(
    "absolute inset-0 z-50 rounded-[inherit] p-6",
    blur,
    // The glass fill comes from the shared container scale in theme/glass.ts,
    // tinted with the loader's own tone; the scrim stays a solid token.
    glass
      ? getSurfaceGlassFillClass(color, "light")
      : "bg-white/85 dark:bg-neutral-900/80",
  );

  const body = (
    <LoaderBody
      variant={variant}
      size={size}
      color={color}
      spinnerVariant={spinnerVariant}
      spinnerThickness={spinnerThickness}
      title={title}
      label={label}
      progress={progress}
      indeterminate={indeterminate}
    />
  );

  return (
    <div
      {...rest}
      className={classNames(
        "inline-flex flex-col items-center justify-center gap-3 text-center",
        overlay && overlayClass,
        className,
      )}
      role="status"
    >
      {/*
        Only the overlay publishes a surface: that is the surface it draws.
        Inline, it inherits the nearest real one (a Panel's, when nested in one).
      */}
      {overlay ? (
        <SurfaceProvider variant={glass ? "liquid-glass" : "elevated"}>
          {body}
        </SurfaceProvider>
      ) : (
        body
      )}
    </div>
  );
};

export default Loader;
