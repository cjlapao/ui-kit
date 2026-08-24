import React, { useMemo } from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { parseImageSource, sanitizeSvg } from "../utils/sanitizeSvg";
import type { ControlSize, TrueColor } from "../theme/Theme";

export type DynamicImgSize = ControlSize;

const SIZE_CLASSES: Record<DynamicImgSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

export interface DynamicImgProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color" | "children"> {
  /**
   * A data URL (`data:image/svg+xml;base64,…`, PNG, JPEG, GIF, WebP, AVIF) or
   * raw `<svg>` markup.
   */
  src?: string;
  /** @deprecated Use `src`. Accepts the same values. */
  base64?: string;
  /**
   * Accessible name. Omit it and the image is treated as decoration and hidden
   * from assistive technology — the old `alt="Dynamic Image"` was neither a
   * useful name nor a way to opt out.
   */
  alt?: string;
  /** Icon shown when there is nothing to render, or the SVG is rejected. */
  fallbackIcon?: string;
  /** @default "md" */
  size?: DynamicImgSize;
  /** Theme colour for a recoloured SVG. */
  tone?: TrueColor;
  /** Raw fill colour for an SVG. Defaults to `currentColor`. */
  fill?: string;
  /** Raw stroke colour for an SVG. Defaults to `currentColor`. */
  stroke?: string;
  /** Keep the SVG's own colours instead of recolouring it. */
  colored?: boolean;
  title?: string;
  className?: string;
}

const DynamicImg: React.FC<DynamicImgProps> = ({
  src,
  base64,
  alt,
  fallbackIcon = "Image",
  size = "md",
  tone,
  fill,
  stroke,
  colored = false,
  title,
  className,
  style,
  ...rest
}) => {
  const renderIcon = useIconRenderer();
  const value = src ?? base64 ?? "";

  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;
  const toneClass = !colored && !fill && tone ? `text-${tone}-500 dark:text-${tone}-400` : undefined;

  const parsed = useMemo(() => parseImageSource(value), [value]);

  const markup = useMemo(() => {
    if (!parsed || parsed.kind !== "svg" || !parsed.markup) return null;
    // Every path here is caller data, so it goes through the allowlist
    // sanitiser before it can reach `dangerouslySetInnerHTML`.
    return sanitizeSvg(
      parsed.markup,
      colored
        ? {}
        : { fill: fill ?? "currentColor", stroke: stroke ?? "currentColor" },
    );
  }, [parsed, colored, fill, stroke]);

  const decorative = !alt;

  if (!parsed || (parsed.kind === "svg" && !markup)) {
    // Rejected markup falls back to the placeholder. It is never rendered raw.
    return <>{renderIcon(fallbackIcon, size)}</>;
  }

  if (parsed.kind === "raster") {
    return (
      <img
        src={parsed.src}
        // Was a hardcoded `alt="Dynamic Image"`, which is noise for a screen
        // reader and cannot be turned off.
        alt={alt ?? ""}
        aria-hidden={decorative || undefined}
        title={title}
        // The raster branch used to ignore `size` entirely, so a PNG rendered
        // at its natural dimensions while an SVG respected the scale.
        className={classNames("object-contain", sizeClass, className)}
        style={style}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  return (
    <span
      className={classNames(
        // No `text-current` here: it sets `color: currentColor`, which is what
        // inheritance already does, and it collides with the tone class at the
        // same specificity — so which one wins is decided by whichever Tailwind
        // happened to emit last. `text-blue-500` lost; `text-violet-500` won.
        "inline-flex select-none items-center justify-center",
        "[&>svg]:h-full [&>svg]:w-full",
        sizeClass,
        toneClass,
        className,
      )}
      style={style}
      title={title}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative || undefined}
      // Sanitised above: allowlisted elements and attributes only, no script,
      // no event handlers, no external references.
      dangerouslySetInnerHTML={{ __html: markup as string }}
      {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
    />
  );
};

DynamicImg.displayName = "DynamicImg";

export default DynamicImg;
