import React, { useId, useRef } from "react";
import classNames from "classnames";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Panel, { type PanelProps } from "./Panel";
import Pill from "./Pill";
import {
  DEFAULT_SURFACE_CORNER,
  getPillColorClasses,
  getSurfacePaddingClass,
  getSurfaceTriggerTokens,
  type ControlSize,
} from "../theme/Theme";
import { useAccordion, type UseAccordionOptions } from "../hooks/useAccordion";
import { useKitT } from "../i18n";
import { useIconRenderer } from "../contexts/IconContext";
import { useSurfaceText } from "../contexts/SurfaceContext";

/**
 * The affordance that tells you a row can expand. The old component also
 * offered a `caret`, which rendered the exact same `ArrowDown` glyph as
 * `chevron` — two names, one icon — so it is gone.
 */
export type AccordionIndicator = "chevron" | "plus-minus" | "none";
export type AccordionIndicatorPlacement = "left" | "right";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  icon?: string | React.ReactElement;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * A stacked disclosure list on the shared container surface.
 *
 * It renders `Panel` (like `CollapsiblePanel`), so `variant`, `tone`, `corner`,
 * `padding` and every glass prop come from the same scales as every other
 * card — there is no accordion-only variant family, and no per-tone class
 * table: hover/focus come from `getSurfaceTriggerTokens`, copy colour from
 * `useSurfaceText`, and the icon chip from `getPillColorClasses`.
 *
 * `size` is the shared control scale and only drives type, icons and the
 * indicator; the header/content inset is `padding`, one language with every
 * other Panel.
 */
export interface AccordionProps
  extends Omit<
      PanelProps,
      "title" | "subtitle" | "actions" | "children" | "onChange"
    >,
    UseAccordionOptions {
  items: AccordionItem[];
  /**
   * Density of each row's type, icon and indicator. @default "md"
   */
  size?: ControlSize;
  /** @default "chevron" */
  indicator?: AccordionIndicator;
  /** Where the indicator sits. @default "right" */
  indicatorPlacement?: AccordionIndicatorPlacement;
  /**
   * Animate expand/collapse. With `false` the rows switch instantly (and the
   * transition class is dropped, not just paused). @default true
   */
  animated?: boolean;
  onItemToggle?: (id: string, isOpen: boolean) => void;
  /** Accessible name for the list of items. */
  ariaLabel?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
}

const INDICATOR_ICON: Record<
  Exclude<AccordionIndicator, "none">,
  string
> = {
  chevron: "ArrowDown",
  "plus-minus": "Plus",
};

/**
 * Type/icon density only — the inset comes from the `padding` prop so the
 * header matches the Panel's own scale. Every class is a complete literal:
 * the previous version built `h-${n}` / `w-${n}` from a number, and Tailwind
 * has no `h-32`-meant-32px — it emitted `height: 8rem`.
 */
const SIZE_TOKENS: Record<
  ControlSize,
  {
    title: string;
    subtitle: string;
    description: string;
    content: string;
    chip: string;
    icon: ControlSize;
    indicator: ControlSize;
    pill: ControlSize;
  }
> = {
  xs: {
    title: "text-xs font-semibold",
    subtitle: "text-[11px] font-medium",
    description: "text-[11px]",
    content: "text-xs leading-5",
    chip: "h-6 w-6 rounded-md",
    icon: "xs",
    indicator: "xs",
    pill: "xs",
  },
  sm: {
    title: "text-sm font-semibold",
    subtitle: "text-xs font-medium",
    description: "text-xs",
    content: "text-xs leading-6",
    chip: "h-7 w-7 rounded-md",
    icon: "sm",
    indicator: "sm",
    pill: "sm",
  },
  md: {
    title: "text-sm font-semibold",
    subtitle: "text-xs font-medium",
    description: "text-sm",
    content: "text-sm leading-6",
    chip: "h-8 w-8 rounded-lg",
    icon: "md",
    indicator: "sm",
    pill: "sm",
  },
  lg: {
    title: "text-base font-semibold",
    subtitle: "text-sm font-medium",
    description: "text-sm",
    content: "text-sm leading-6",
    chip: "h-9 w-9 rounded-lg",
    icon: "lg",
    indicator: "md",
    pill: "md",
  },
  xl: {
    title: "text-lg font-semibold",
    subtitle: "text-sm font-medium",
    description: "text-base",
    content: "text-sm leading-7",
    chip: "h-11 w-11 rounded-xl",
    icon: "xl",
    indicator: "lg",
    pill: "lg",
  },
};

interface AccordionBodyProps {
  items: AccordionItem[];
  size: ControlSize;
  tone: NonNullable<PanelProps["tone"]>;
  padding: NonNullable<PanelProps["padding"]>;
  indicator: AccordionIndicator;
  indicatorPlacement: AccordionIndicatorPlacement;
  animated: boolean;
  disabled: boolean;
  baseId: string;
  ariaLabel?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  isOpen: (id: string) => boolean;
  onToggle: (item: AccordionItem) => void;
}

/**
 * Split out so it can read the surface context `Panel` publishes — a component
 * cannot consume a provider it renders itself. That is how the copy and the
 * hairline adapt to glass and to light/dark without a hardcoded
 * `text-neutral-*` pair.
 */
const AccordionBody: React.FC<AccordionBodyProps> = ({
  items,
  size,
  tone,
  padding,
  indicator,
  indicatorPlacement,
  animated,
  disabled,
  baseId,
  ariaLabel,
  itemClassName,
  headerClassName,
  contentClassName,
  iconClassName,
  isOpen,
  onToggle,
}) => {
  const t = useKitT();
  const renderIcon = useIconRenderer();
  const surface = useSurfaceText();
  const trigger = getSurfaceTriggerTokens(tone);
  const chip = getPillColorClasses(tone, "soft");
  const inset = getSurfacePaddingClass(padding);
  const tokens = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const headerRefs = useRef(new Map<string, HTMLDivElement>());

  if (items.length === 0) {
    return (
      <div className={classNames("flex flex-col", inset, "pt-0")}>
        <EmptyState
          variant="plain"
          dashed={false}
          icon="ViewRows"
          title={t("kit.accordion.noItemsTitle")}
          tone={tone}
          size={size}
        />
      </div>
    );
  }

  const handleHeaderKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    item: AccordionItem,
    index: number,
  ) => {
    // Only when the header itself has focus. Without this check, activating
    // an action button with Enter bubbled up here and toggled the row too.
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle(item);
      return;
    }

    // APG accordion: arrow keys move between headers without toggling.
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();

    const enabled = items
      .map((candidate, candidateIndex) => ({ candidate, candidateIndex }))
      .filter(({ candidate }) => !candidate.disabled);
    if (enabled.length === 0) {
      return;
    }
    const current = enabled.findIndex(({ candidateIndex }) => candidateIndex === index);

    let next: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = (current + 1) % enabled.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = (current - 1 + enabled.length) % enabled.length;
        break;
      case "Home":
        next = 0;
        break;
      default:
        next = enabled.length - 1;
    }
    headerRefs.current.get(enabled[next].candidate.id)?.focus();
  };

  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-col">
      {items.map((item, index) => {
        const itemDisabled = disabled || Boolean(item.disabled);
        const itemOpen = isOpen(item.id);
        const headerId = `${baseId}-${item.id}-trigger`;
        const contentId = `${baseId}-${item.id}-content`;

        const indicatorElement =
          indicator === "none" ? null : (
            <span
              className={classNames(
                "mt-0.5 inline-flex flex-none items-center justify-center transition-transform duration-200 motion-reduce:transition-none",
                surface.muted,
                indicator === "chevron"
                  ? itemOpen
                    ? "rotate-180"
                    : "rotate-0"
                  : itemOpen
                    ? "rotate-45"
                    : "rotate-0",
              )}
              aria-hidden="true"
            >
              {renderIcon(INDICATOR_ICON[indicator], tokens.indicator)}
            </span>
          );

        return (
          <div
            key={item.id}
            data-item-id={item.id}
            className={classNames(
              "relative flex flex-col",
              // The hairline is the surface's own divider colour, not a
              // hardcoded neutral, and there is no second `divide-y` on top
              // of it (the old `divider` prop stacked both).
              index < items.length - 1 && classNames("border-b", surface.divider),
              itemDisabled && "opacity-60",
              itemClassName,
            )}
          >
            <div
              id={headerId}
              ref={(element) => {
                if (element) {
                  headerRefs.current.set(item.id, element);
                } else {
                  headerRefs.current.delete(item.id);
                }
              }}
              role="button"
              tabIndex={itemDisabled ? -1 : 0}
              aria-expanded={itemOpen}
              aria-controls={contentId}
              aria-disabled={itemDisabled || undefined}
              onClick={itemDisabled ? undefined : () => onToggle(item)}
              onKeyDown={
                itemDisabled ? undefined : (event) =>
                  handleHeaderKeyDown(event, item, index)
              }
              className={classNames(
                "flex w-full items-start gap-3 text-left transition-colors",
                inset,
                headerClassName,
                itemDisabled
                  ? "cursor-not-allowed"
                  : classNames("cursor-pointer", trigger.hover, trigger.focusRing),
              )}
            >
              {indicatorPlacement === "left" ? indicatorElement : null}
              <div className="flex min-w-0 flex-1 items-start gap-3">
                {item.icon ? (
                  <span
                    className={classNames(
                      "mt-0.5 inline-flex flex-none items-center justify-center",
                      tokens.chip,
                      // Generated per tone — the old table only had `neutral`
                      // and fell back to it for the other twenty.
                      chip.base,
                      iconClassName,
                    )}
                  >
                    {renderIcon(item.icon, tokens.icon)}
                  </span>
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={tokens.title}>{item.title}</span>
                    {item.badge ? (
                      <Pill
                        tone={tone}
                        variant="soft"
                        size={tokens.pill}
                        className="flex-none"
                      >
                        {item.badge}
                      </Pill>
                    ) : null}
                  </div>
                  {item.subtitle ? (
                    <span className={classNames(tokens.subtitle, surface.muted)}>
                      {item.subtitle}
                    </span>
                  ) : null}
                  {item.description ? (
                    <span className={classNames(tokens.description, surface.description)}>
                      {item.description}
                    </span>
                  ) : null}
                </div>
              </div>
              {item.actions ? (
                // Stops both activation paths, not just the pointer one.
                <div
                  className="flex flex-none items-center gap-2"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  {item.actions}
                </div>
              ) : null}
              {indicatorPlacement === "right" ? indicatorElement : null}
            </div>
            <div
              className={classNames(
                "grid overflow-hidden",
                animated &&
                  "transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none",
              )}
              style={{ gridTemplateRows: itemOpen ? "1fr" : "0fr" }}
              data-open={itemOpen}
            >
              <div
                id={contentId}
                role="region"
                aria-labelledby={headerId}
                aria-hidden={!itemOpen || undefined}
                // `hidden` would be `display: none` and kill the transition, so
                // the collapsed region is inert instead: not focusable, not
                // announced, still animatable. Spread rather than passed
                // directly so it type-checks against React 18, where `inert` is
                // not a known prop.
                {...(itemOpen ? {} : ({ inert: true } as Record<string, unknown>))}
                className="min-h-0 overflow-hidden"
              >
                <div
                  className={classNames(
                    "w-full",
                    tokens.content,
                    surface.body,
                    inset,
                    "pt-0",
                    contentClassName,
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
            {item.loading ? (
              <Loader
                overlay
                title={t("kit.accordion.loadingTitle")}
                className="rounded-none"
                size="md"
                color={tone}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  size = "md",
  indicator = "chevron",
  indicatorPlacement = "right",
  animated = true,
  onItemToggle,
  ariaLabel,
  itemClassName,
  headerClassName,
  contentClassName,
  iconClassName,
  defaultOpenIds,
  openIds,
  onChange,
  multiple,
  className,
  disabled,
  variant = "elevated",
  tone = "neutral",
  padding = "md",
  corner = DEFAULT_SURFACE_CORNER,
  hoverable = false,
  ...panelProps
}) => {
  const accordion = useAccordion({
    defaultOpenIds,
    openIds,
    onChange,
    multiple,
  });

  // `useId`, not a constant. The ids were derived from `item.id` alone, so two
  // accordions with the same item ids on one page produced duplicates and
  // every `aria-controls` pointed at the first accordion's content.
  const baseId = useId();

  const handleToggle = (item: AccordionItem) => {
    const wasOpen = accordion.isOpen(item.id);
    accordion.toggle(item.id);
    onItemToggle?.(item.id, !wasOpen);
  };

  return (
    <Panel
      className={classNames("w-full", className)}
      variant={variant}
      tone={tone}
      // The rows own their own inset (from `padding`); the card must not add
      // another. `scrollable={false}` keeps the list from growing a scrollbar
      // over its own content.
      padding="none"
      corner={corner}
      disabled={disabled}
      hoverable={hoverable}
      scrollable={false}
      {...panelProps}
    >
      <AccordionBody
        items={items}
        size={size}
        tone={tone}
        padding={padding}
        indicator={indicator}
        indicatorPlacement={indicatorPlacement}
        animated={animated}
        disabled={Boolean(disabled)}
        baseId={baseId}
        ariaLabel={ariaLabel}
        itemClassName={itemClassName}
        headerClassName={headerClassName}
        contentClassName={contentClassName}
        iconClassName={iconClassName}
        isOpen={accordion.isOpen}
        onToggle={handleToggle}
      />
    </Panel>
  );
};

Accordion.displayName = "Accordion";

export default Accordion;
