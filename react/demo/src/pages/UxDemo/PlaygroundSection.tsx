import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { Button, Toggle, useTheme } from "@cjlapao/ui-kit";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";

interface PlaygroundSectionProps {
  title: string;
  label: string;
  description?: string;
  controls: ReactNode;
  preview: ReactNode;
  /**
   * Hide the header's background-image toggle for demos that supply their own
   * backdrop (GlassBackground draws one itself, so a second would fight it).
   */
  hideBackgroundToggle?: boolean;
}

export const PlaygroundSection: React.FC<PlaygroundSectionProps> = ({
  title,
  label,
  description,
  controls,
  preview,
  hideBackgroundToggle = false,
}) => {
  const isDomAvailable = typeof window !== "undefined";
  const { effectiveTheme } = useTheme();
  const [showBackground, setShowBackground] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsRatio, setControlsRatio] = useState(0.45);
  const [isWide, setIsWide] = useState(() =>
    isDomAvailable ? window.matchMedia("(min-width: 1024px)").matches : false,
  );
  const gridRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const updateRatio = (clientX: number) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const relative = (clientX - rect.left) / Math.max(rect.width, 1);
    const clamped = Math.min(0.75, Math.max(0.25, relative));
    setControlsRatio(clamped);
  };

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isWide) {
      return;
    }
    draggingRef.current = true;
    if ("touches" in event && event.touches[0]) {
      updateRatio(event.touches[0].clientX);
    } else if ("clientX" in event) {
      updateRatio(event.clientX);
    }
    event.preventDefault();
  };

  useEffect(() => {
    if (!isDomAvailable) {
      return undefined;
    }
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsWide(event.matches);
      draggingRef.current = false;
    };
    setIsWide(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [isDomAvailable]);

  useEffect(() => {
    if (!isDomAvailable) {
      return undefined;
    }
    const handleMouseMove = (event: MouseEvent) => {
      if (!draggingRef.current) return;
      updateRatio(event.clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!draggingRef.current || event.touches.length === 0) return;
      updateRatio(event.touches[0].clientX);
    };

    const stopDrag = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("touchcancel", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDrag);
      window.removeEventListener("touchcancel", stopDrag);
    };
  }, [isDomAvailable]);

  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      gridTemplateColumns: isWide
        ? `${controlsRatio * 100}% ${100 - controlsRatio * 100}%`
        : "1fr",
    }),
    [controlsRatio, isWide],
  );

  const showSplit = showControls && isWide;

  const previewBackgroundStyle = useMemo<React.CSSProperties | undefined>(
    () =>
      showBackground
        ? {
            backgroundImage: `url(${
              effectiveTheme === "dark" ? backdropDark : backdropLight
            })`,
          }
        : undefined,
    [showBackground, effectiveTheme],
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/60">
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-slate-900 dark:text-white">
              {title}
            </span>
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {label}
            </span>
          </div>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {!hideBackgroundToggle && (
            <Toggle
              size="sm"
              alignLabel="left"
              color="blue"
              label="Background image"
              checked={showBackground}
              onChange={(event) => setShowBackground(event.target.checked)}
            />
          )}
          <Button
            size="xs"
            variant="ghost"
            color="blue"
            onClick={() => setShowControls((visible) => !visible)}
            aria-expanded={showControls}
          >
            {showControls ? "Hide options" : "Show options"}
          </Button>
        </div>
      </header>
      <div
        ref={gridRef}
        className="relative grid gap-4"
        style={showControls ? gridStyle : { gridTemplateColumns: "1fr" }}
      >
        {showControls && (
          <div className="space-y-4 rounded-2xl border border-slate-100/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            {controls}
          </div>
        )}
        <div
          className={classNames(
            "rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-800",
            showBackground
              ? "overflow-hidden bg-cover bg-center bg-no-repeat"
              : "bg-white/60 dark:bg-slate-900/50",
          )}
          style={previewBackgroundStyle}
        >
          {preview}
        </div>
        {showSplit && (
          // Wide invisible grab area, thin visible bar.
          <button
            type="button"
            aria-label="Resize playground columns"
            className="group pointer-events-auto absolute top-4 bottom-4 flex w-4 -translate-x-1/2 cursor-col-resize items-stretch justify-center bg-transparent focus-visible:outline-none"
            style={{ left: `${controlsRatio * 100}%` }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <span className="h-full w-1 rounded-full bg-slate-200 transition group-hover:bg-slate-300 group-focus-visible:bg-blue-400 dark:bg-slate-700 dark:group-hover:bg-slate-600" />
          </button>
        )}
      </div>
    </section>
  );
};
