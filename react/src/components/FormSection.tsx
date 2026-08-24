import classNames from "classnames";
import React, { type ReactNode } from "react";
import Panel, {
  type PanelCorner,
  type PanelVariant,
  type PanelSpecularMode,
} from "./Panel";
import type { GlassOpacity, GlassVibrancy } from "../../../common/theme/glass";
import { getSurfaceTextTokens } from "../theme/Theme";
import type { ControlSize, TrueColor } from "../theme/Theme";

/** Header / body / footer padding, on the shared control scale. */
const paddingMap: Record<
  ControlSize,
  { body: string; header: string; footer: string }
> = {
  xs: { header: "px-3 py-3", body: "px-3 py-3", footer: "px-3 py-3" },
  sm: { header: "px-4 py-4", body: "px-4 py-4", footer: "px-4 py-4" },
  md: { header: "px-6 py-5", body: "px-6 py-6", footer: "px-6 py-4" },
  lg: { header: "px-8 py-6", body: "px-8 py-8", footer: "px-8 py-6" },
  xl: { header: "px-10 py-8", body: "px-10 py-10", footer: "px-10 py-8" },
};

export type { PanelVariant as FormSectionVariant };

export interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Header / body / footer padding. @default "md" */
  padding?: ControlSize;
  /**
   * Surface treatment. The full `Panel` set — a FormSection *is* a Panel with
   * a header, body and footer, so it takes Panel's variants rather than
   * hard-coding one card style.
   * @default "elevated"
   */
  variant?: PanelVariant;
  /** Tone for the tinted and translucent variants. @default "neutral" */
  tone?: TrueColor;
  /** Corner rounding. @default "rounded-md" */
  corner?: PanelCorner;
  /** Forwarded to `Panel` for the `liquid-glass` variant. */
  vibrancy?: GlassVibrancy;
  glassOpacity?: GlassOpacity;
  specularMode?: PanelSpecularMode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  footer,
  children,
  className,
  padding = "md",
  variant = "elevated",
  tone = "neutral",
  corner = "rounded-md",
  vibrancy,
  glassOpacity,
  specularMode,
}) => {
  const pad = paddingMap[padding] ?? paddingMap.md;
  // Heading, description and divider all come from the surface, so a glass
  // section darkens its copy instead of leaving it on the invisible end of the
  // neutral scale.
  const surface = getSurfaceTextTokens(variant);

  return (
    <Panel
      variant={variant}
      tone={tone}
      corner={corner}
      padding="none"
      scrollable={false}
      vibrancy={vibrancy}
      glassOpacity={glassOpacity}
      specularMode={specularMode}
      className={className}
      bodyClassName="!space-y-0"
    >
      {/* Panel publishes the SurfaceProvider for this variant already. */}
      {(title || description) && (
        <div className={classNames("border-b", surface.divider, pad.header)}>
          {title && (
            <h2
              className={classNames(
                "text-base font-semibold leading-6",
                surface.heading,
              )}
            >
              {title}
            </h2>
          )}
          {description && (
            <p className={classNames("mt-2 text-sm", surface.description)}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className={classNames("space-y-6", pad.body)}>{children}</div>
      {footer && (
        <div className={classNames("border-t", surface.divider, pad.footer)}>
          {footer}
        </div>
      )}
    </Panel>
  );
};

export default FormSection;
