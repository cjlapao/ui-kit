import classNames from "classnames";
import React from "react";
import {
  getStatusSpinnerSizeTokens,
  getStatusSpinnerToneTokens,
  type ControlSize,
  type TrueColor,
} from "../theme/Theme";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { useKitT } from "../i18n";

/**
 * The shared control scale, so the status circle lines up with the `Spinner`
 * and the Button beside it instead of speaking its own size language.
 */
export type StatusSpinnerSize = ControlSize;
export type StatusSpinnerTone = TrueColor;

export interface StatusSpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "blue" */
  tone?: StatusSpinnerTone;
  /** @default "md" */
  size?: StatusSpinnerSize;
  /** @default true */
  animated?: boolean;
  /** Visible text beside the circle. Also announced — the circle alone reads as "Loading". */
  label?: string;
}

/**
 * Split out so it can read `useSurfaceText()`. A component cannot consume a
 * provider it renders itself, so the label lives in a child.
 */
const StatusSpinnerLabel: React.FC<{ text: string }> = ({ text }) => {
  const surface = useSurfaceText();
  return (
    <span className={classNames("text-sm font-medium", surface.body)}>
      {text}
    </span>
  );
};

const StatusSpinner = React.forwardRef<HTMLSpanElement, StatusSpinnerProps>(
  (
    {
      tone = "blue",
      size = "md",
      animated = true,
      label,
      className,
      ...rest
    },
    ref,
  ) => {
    const t = useKitT();
    const toneTokens = getStatusSpinnerToneTokens(tone);
    const sizeTokens = getStatusSpinnerSizeTokens(size);

    // CSS colours, not classes: the four border sides carry four different
    // values, and `dark:` cannot reach an inline style.
    const ringStyle: React.CSSProperties = animated
      ? {
          borderTopColor: toneTokens.arc,
          borderRightColor: toneTokens.track,
          borderBottomColor: toneTokens.track,
          borderLeftColor: toneTokens.track,
        }
      : {
          borderColor: toneTokens.track,
        };

    return (
      <span
        ref={ref}
        className={classNames("inline-flex items-center gap-2", className)}
        role="status"
        {...rest}
      >
        <span
          className={classNames(
            "relative inline-flex shrink-0 items-center justify-center",
            sizeTokens.wrapper,
          )}
        >
          <span
            className={classNames(
              "absolute inset-0 rounded-full border-solid border-transparent transition-all duration-200 ease-out",
              sizeTokens.border,
              animated && "animate-spin motion-reduce:animate-none",
            )}
            style={ringStyle}
          />
          <span
            className={classNames(
              "relative rounded-full ring-1 ring-white/40 dark:ring-black/40",
              sizeTokens.dot,
              toneTokens.dot,
            )}
            style={{ boxShadow: `0 0 8px ${toneTokens.glow}` }}
          />
        </span>
        {/*
          With a visible label the text is already inside the status region —
          an sr-only copy beside it would be announced twice.
        */}
        {label ? (
          <StatusSpinnerLabel text={label} />
        ) : (
          <span className="sr-only">{t("kit.spinner.loading")}</span>
        )}
      </span>
    );
  },
);

StatusSpinner.displayName = "StatusSpinner";

export default StatusSpinner;
