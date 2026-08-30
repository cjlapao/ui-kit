import classNames from "classnames";
import React from "react";
import {
  getSpinnerColorTokens,
  type ControlSize,
  type TrueColor,
} from "../theme/Theme";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { useKitT } from "../i18n";

/**
 * The shared control scale, so a spinner lines up with the Button next to it
 * instead of speaking its own size language.
 */
export type SpinnerSize = ControlSize;
export type SpinnerColor = TrueColor;

export const SPINNER_VARIANTS = ["solid", "segments"] as const;
export type SpinnerVariant = (typeof SPINNER_VARIANTS)[number];

export const SPINNER_THICKNESSES = ["thin", "normal", "thick"] as const;
export type SpinnerThickness = (typeof SPINNER_THICKNESSES)[number];

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "md" */
  size?: SpinnerSize;
  /** @default "blue" */
  color?: SpinnerColor;
  /** @default "solid" */
  variant?: SpinnerVariant;
  /** @default "normal" */
  thickness?: SpinnerThickness;
  /** Visible text beside the ring. Also announced — the ring alone reads as "Loading". */
  label?: string;
}

const sizeTokens: Record<
  SpinnerSize,
  { diameter: string; border: Record<SpinnerThickness, string> }
> = {
  xs: {
    diameter: "h-4 w-4",
    border: { thin: "border", normal: "border-[2px]", thick: "border-[4px]" },
  },
  sm: {
    diameter: "h-5 w-5",
    border: {
      thin: "border-[1.5px]",
      normal: "border-2",
      thick: "border-[4px]",
    },
  },
  md: {
    diameter: "h-6 w-6",
    border: {
      thin: "border-3",
      normal: "border-[3.5px]",
      thick: "border-[4.5px]",
    },
  },
  lg: {
    diameter: "h-8 w-8",
    border: {
      thin: "border-[3.5px]",
      normal: "border-[4px]",
      thick: "border-[5px]",
    },
  },
  xl: {
    diameter: "h-10 w-10",
    border: {
      thin: "border-[4px]",
      normal: "border-[4.5px]",
      thick: "border-[5.5px]",
    },
  },
};

/**
 * Split out so it can read `useSurfaceText()`. A component cannot consume a
 * provider it renders itself, so the label lives in a child.
 */
const SpinnerLabel: React.FC<{ text: string }> = ({ text }) => {
  const surface = useSurfaceText();
  return (
    <span className={classNames("text-sm font-medium", surface.body)}>
      {text}
    </span>
  );
};

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      size = "md",
      color = "blue",
      variant = "solid",
      thickness = "normal",
      label,
      className,
      ...rest
    },
    ref,
  ) => {
    const t = useKitT();
    const sizeStyles = sizeTokens[size] ?? sizeTokens.md;
    const borderThickness =
      sizeStyles.border[thickness] ?? sizeStyles.border.thin;
    const colorStyles = getSpinnerColorTokens(color);

    const spinnerBase = classNames(
      "inline-flex rounded-full border-solid border-transparent",
      sizeStyles.diameter,
      borderThickness,
      className,
    );

    // `motion-reduce:animate-none` is a class, not an inline style, so the
    // reduced-motion media query can reach it.
    const spinnerClass = classNames(
      spinnerBase,
      "transition-all duration-150 ease-in-out motion-reduce:animate-none",
      variant === "segments"
        ? ["animate-[spin_1s_linear_infinite]", ...colorStyles]
        : ["animate-spin", colorStyles[0]],
    );

    return (
      <span className="inline-flex items-center gap-2" role="status">
        <span ref={ref} className={spinnerClass} {...rest} />
        {/*
          With a visible label the text is already inside the status region —
          an sr-only copy beside it would be announced twice.
        */}
        {label ? <SpinnerLabel text={label} /> : (
          <span className="sr-only">{t("kit.spinner.loading")}</span>
        )}
      </span>
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;
