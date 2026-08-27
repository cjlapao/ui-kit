import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import classNames from "classnames";
import IconButton from "./IconButton";
import CustomIcon from "./CustomIcon";
import Panel from "./Panel";
import {
  DEFAULT_SURFACE_CORNER,
  getPanelToneStyles,
  getSurfaceTextTokens,
  type ControlSize,
  type SurfaceCorner,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import type { IconName } from "../icons/registry";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type HelpButtonPlacement = "top" | "bottom" | "left" | "right" | "auto";

export interface HelpButtonProps {
  /**
   * Help content to display in the panel.
   * Pass a `string` to render as Markdown (tables and URLs supported).
   * Pass a `ReactNode` to render arbitrary JSX directly.
   */
  content: string | React.ReactNode;
  /** Optional title shown in the panel header. Defaults to "Help". */
  title?: React.ReactNode;
  /**
   * Preferred placement of the floating panel relative to the trigger button.
   * "auto" (default) picks the side with the most available space.
   */
  placement?: HelpButtonPlacement;
  /** Accent color for the trigger button and the panel header band. @default "sky" */
  color?: TrueColor;
  /**
   * Surface treatment of the floating panel — the shared container family the
   * `Panel` reference owns, so a help panel and a card beside it read the same.
   * @default "elevated"
   */
  variant?: SurfaceVariant;
  /** Corner radius of the panel, on the shared container scale. @default "rounded-md" */
  corner?: SurfaceCorner;
  /** Size of the trigger icon button, on the shared control scale. @default "xs" */
  size?: ControlSize;
  /** Icon for the trigger button. Defaults to "Help". */
  icon?: IconName;
  /** Maximum width of the floating panel in px. Defaults to 360. */
  maxWidth?: number;
  /**
   * When true the panel body is a pulsing skeleton shaped like the help copy,
   * so a slow help fetch does not flash empty text. @default false
   */
  loading?: boolean;
  /** Extra class applied to the root wrapper. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Header-band tone — generated from the shared panel palette          */
/* ------------------------------------------------------------------ */
/*
 * The header band's tint, top accent and copy colour all come from
 * `getPanelToneStyles(color)`, so every one of the 21 TrueColors is present
 * and a new tone in the theme reaches this component automatically. A
 * hand-written per-colour map is exactly the drift the hardening brief exists
 * to eliminate (§5.2): the previous 12-entry table fell through to a neutral
 * fallback for red, yellow, lime, purple, fuchsia, gray, zinc, neutral and
 * stone — so half the tone set rendered with no accent at all.
 */

/* ------------------------------------------------------------------ */
/*  Markdown component map                                              */
/* ------------------------------------------------------------------ */

const mdComponents: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-150"
    >
      {children}
    </a>
  ),
  p: ({ children }) => (
    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2 last:mb-0">
      {children}
    </p>
  ),
  h1: ({ children }) => (
    <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2 mt-3 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 mt-3 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1 mt-2 first:mt-0">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside text-sm text-neutral-700 dark:text-neutral-300 space-y-0.5 mb-2 pl-4">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside text-sm text-neutral-700 dark:text-neutral-300 space-y-0.5 mb-2 pl-4">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-[3px] border-neutral-300 dark:border-neutral-600 pl-3 my-2 text-neutral-500 dark:text-neutral-400 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-neutral-200 dark:border-neutral-700" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-neutral-600 dark:text-neutral-400">
      {children}
    </em>
  ),
  /**
   * Inline code has no className; fenced block code has a language-* class.
   * We style them differently — inline is a subtle chip, block is a scrollable box.
   */
  code: ({ className, children }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className="block bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded px-1.5 py-0.5 text-xs font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 rounded-lg overflow-hidden">{children}</pre>
  ),
  // remark-gfm table support
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-xs">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-neutral-100 dark:bg-neutral-800">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors duration-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">
      {children}
    </td>
  ),
};

/* ------------------------------------------------------------------ */
/*  Position computation                                                */
/* ------------------------------------------------------------------ */

const ESTIMATED_HEIGHT = 320;
const GAP = 8;

function computePopoverPosition(
  rect: DOMRect,
  placement: HelpButtonPlacement,
  maxWidth: number,
): {
  style: React.CSSProperties;
  resolvedPlacement: "top" | "bottom" | "left" | "right";
} {
  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  const W = Math.min(maxWidth, vpW - 16);

  const spaceBelow = vpH - rect.bottom - GAP;
  const spaceAbove = rect.top - GAP;

  let resolved: "top" | "bottom" | "left" | "right";
  if (placement === "auto" || placement === "bottom") {
    resolved =
      spaceBelow >= ESTIMATED_HEIGHT || spaceBelow >= spaceAbove
        ? "bottom"
        : "top";
  } else if (placement === "top") {
    resolved =
      spaceAbove >= ESTIMATED_HEIGHT || spaceAbove >= spaceBelow
        ? "top"
        : "bottom";
  } else {
    resolved = placement;
  }

  const style: React.CSSProperties = { width: W };

  if (resolved === "bottom") {
    style.top = rect.bottom + GAP;
    style.left = Math.max(
      8,
      Math.min(rect.left + rect.width / 2 - W / 2, vpW - W - 8),
    );
  } else if (resolved === "top") {
    // distance from bottom of viewport so it sits above the button
    style.bottom = vpH - rect.top + GAP;
    style.left = Math.max(
      8,
      Math.min(rect.left + rect.width / 2 - W / 2, vpW - W - 8),
    );
  } else if (resolved === "right") {
    style.left = Math.min(rect.right + GAP, vpW - W - 8);
    style.top = Math.max(
      8,
      Math.min(
        rect.top + rect.height / 2 - ESTIMATED_HEIGHT / 2,
        vpH - ESTIMATED_HEIGHT - 8,
      ),
    );
  } else {
    // left
    style.left = Math.max(8, rect.left - W - GAP);
    style.top = Math.max(
      8,
      Math.min(
        rect.top + rect.height / 2 - ESTIMATED_HEIGHT / 2,
        vpH - ESTIMATED_HEIGHT - 8,
      ),
    );
  }

  return { style, resolvedPlacement: resolved };
}

const originClass: Record<"top" | "bottom" | "left" | "right", string> = {
  bottom: "origin-top",
  top: "origin-bottom",
  left: "origin-right",
  right: "origin-left",
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

const HelpButton: React.FC<HelpButtonProps> = ({
  content,
  title,
  placement = "auto",
  color = "sky",
  variant = "elevated",
  corner = DEFAULT_SURFACE_CORNER,
  size = "xs",
  icon = "Help",
  maxWidth = 360,
  loading = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [resolvedPlacement, setResolvedPlacement] = useState<
    "top" | "bottom" | "left" | "right"
  >("bottom");

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const recompute = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const { style, resolvedPlacement: rp } = computePopoverPosition(
      rect,
      placement,
      maxWidth,
    );
    setPopoverStyle(style);
    setResolvedPlacement(rp);
  }, [placement, maxWidth]);

  const toggle = useCallback(() => {
    if (!open) recompute();
    setOpen((v) => !v);
  }, [open, recompute]);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  // Reposition on scroll or resize while open
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", recompute, true);
    window.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute, true);
      window.removeEventListener("resize", recompute);
    };
  }, [open, recompute]);

  // Generated from the theme — all 21 tones, no local map to drift.
  const palette = getPanelToneStyles(color);
  // Copy colour follows the surface, so a see-through (glass) panel gets the
  // higher-contrast ink instead of a hardcoded neutral pair (§4).
  const surfaceText = getSurfaceTextTokens(variant);
  const isMarkdown = typeof content === "string";

  return (
    <span className={classNames("inline-flex items-center", className)}>
      {/* Trigger */}
      <IconButton
        ref={buttonRef}
        icon={icon}
        size={size}
        variant="ghost"
        color={color}
        onClick={toggle}
        aria-label="Show help"
        aria-expanded={open}
        aria-haspopup="dialog"
      />

      {/* Floating panel — rendered in a portal to avoid overflow clipping */}
      {createPortal(
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={typeof title === "string" ? title : "Help"}
          aria-busy={loading}
          style={{ ...popoverStyle, position: "fixed" }}
          className={classNames(
            "z-[2000]",
            // Animation — opacity + scale, origin tracks resolved placement
            "transition-[opacity,transform] duration-200 ease-out",
            originClass[resolvedPlacement],
            open
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none",
          )}
        >
          {/* The surface is a real `Panel`, so the eight container variants,
              tone, corner and every glass prop read identically to a card.
              Padding is "none" — the accent band and body supply their own
              inset, and the panel's overflow-hidden clips the band's top
              corners to the shared corner radius. */}
          <Panel
            variant={variant}
            tone={color}
            corner={corner}
            padding="none"
            scrollable={false}
          >
            <div className="flex flex-col">
              {/* ---- Accent header band (tone generated, never hand-mapped) ---- */}
              <div
                className={classNames(
                  "flex items-center justify-between gap-2 px-3 py-2",
                  palette.subtleBg,
                )}
              >
                <div
                  className={classNames(
                    "flex items-center gap-2 min-w-0",
                    palette.heading,
                  )}
                >
                  <span
                    className={classNames(
                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
                      palette.subtleBg,
                    )}
                  >
                    <CustomIcon icon="Info" className="h-3 w-3" />
                  </span>
                  <span className="text-xs font-semibold truncate">
                    {title ?? "Help"}
                  </span>
                </div>
                <IconButton
                  icon="Close"
                  size="xs"
                  variant="ghost"
                  color="slate"
                  onClick={close}
                  aria-label="Close help"
                />
              </div>

              {/* ---- Content body ---- */}
              <div className="px-4 py-3 overflow-y-auto max-h-[55vh] scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
                {loading ? (
                  <div className="space-y-3" aria-hidden="true">
                    <span className="block h-3 w-24 animate-pulse rounded bg-black/10 dark:bg-white/10 motion-reduce:animate-none" />
                    <span className="block h-2.5 w-full animate-pulse rounded bg-black/10 dark:bg-white/10 motion-reduce:animate-none" />
                    <span className="block h-2.5 w-full animate-pulse rounded bg-black/10 dark:bg-white/10 motion-reduce:animate-none" />
                    <span className="block h-2.5 w-4/5 animate-pulse rounded bg-black/10 dark:bg-white/10 motion-reduce:animate-none" />
                    <span className="block h-2.5 w-2/3 animate-pulse rounded bg-black/10 dark:bg-white/10 motion-reduce:animate-none" />
                  </div>
                ) : isMarkdown ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={mdComponents}
                  >
                    {content as string}
                  </ReactMarkdown>
                ) : (
                  <div
                    className={classNames(
                      "text-sm leading-relaxed",
                      surfaceText.body,
                    )}
                  >
                    {content}
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </div>,
        document.body,
      )}
    </span>
  );
};

HelpButton.displayName = "HelpButton";

export default HelpButton;
