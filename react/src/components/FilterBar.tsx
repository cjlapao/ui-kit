import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import SearchBar, { type SearchBarProps } from "./SearchBar";
import Button, { type ButtonProps } from "./Button";
import Badge, { type BadgeVariant } from "./Badge";
import Menu, { type MenuItem } from "./Menu";
import CustomIcon from "./CustomIcon";
import type { ControlSize, TrueColor } from "../theme/Theme";
import { SkeletonBar, type PanelProps } from "./Panel";
import Loader from "./Loader";
import { getSurfaceVariantClasses, getSurfaceCornerClass, getSurfaceCornerRem, getSurfacePaddingClass } from "../theme";
import { getGlassVibrancyClass, getSurfaceGlassFillClass } from "../theme/glass";
import { CONTROL_SPRING_TOKENS, type ControlSpring } from "../../../common/theme/springs";
import { useKitT } from "../i18n";
import "./FilterBar.css";

export interface FilterBarOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}
export interface FilterBarFilter {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
  options: FilterBarOption[];
}
export type FilterBarValue = Record<string, string[]>;
/**
 * The three loading styles a bar can show, matching Table and ActivityFeed.
 * `"spinner"` and `"progress"` dim the live bar under a Loader overlay;
 * `"skeleton"` rewrites its pieces in pulsing placeholder ink.
 */
export type FilterBarLoaderType = "spinner" | "progress" | "skeleton";
export interface FilterBarProps {
  /** Forwarded unchanged to the existing SearchBar. */
  searchProps: SearchBarProps;
  filters: FilterBarFilter[];
  value?: FilterBarValue;
  defaultValue?: FilterBarValue;
  onChange?: (value: FilterBarValue) => void;
  filteredCount: number;
  totalCount: number;
  itemLabel?: string;
  /** Show the expandable search control. Hidden search retains its query. @default true */
  showSearch?: boolean;
  /** Show the filter icon and heading. @default true */
  showFilterLabel?: boolean;
  /** Show the empty-selection message. @default true */
  showEmptyState?: boolean;
  /** Show the Clear all action when filters are applied. @default true */
  showClearAll?: boolean;
  /** Show the trailing filtered/total result summary and its divider. @default true */
  showResultCount?: boolean;
  /** Show counts beside categories and options in the filter menu. @default true */
  showMenuCounts?: boolean;
  size?: ControlSize;
  /** Search and chip accent; also the fallback for buttonTone. @default "blue" */
  color?: TrueColor;
  /** Shared surface treatment. @default "outlined" */
  variant?: PanelProps["variant"];
  /** Surface tint, independent of control accents. @default "neutral" */
  tone?: PanelProps["tone"];
  corner?: PanelProps["corner"];
  /** Shared container inset scale. @default "xs" */
  padding?: PanelProps["padding"];
  transparency?: PanelProps["transparency"];
  glassOpacity?: PanelProps["glassOpacity"];
  vibrancy?: PanelProps["vibrancy"];
  /** Add filter action treatment. @default "outline" */
  buttonVariant?: ButtonProps["variant"];
  /** Clear all, Back and menu Clear treatment. @default "ghost" */
  secondaryButtonVariant?: ButtonProps["variant"];
  /** Menu Done treatment. @default "solid" */
  applyButtonVariant?: ButtonProps["variant"];
  /**
   * Treatment of the expand-search trigger. It always keeps its compact
   * icon-only footprint (`iconOnly` sizing), so no variant widens the
   * collapsed control; the 2.5rem .fb-search box in FilterBar.css holds.
   * @default "icon"
   */
  searchButtonVariant?: ButtonProps["variant"];
  /** Tone of action buttons, search trigger and chip remove buttons. Defaults to color. */
  buttonTone?: TrueColor;
  /** Action button size. Defaults to size; chip remove buttons retain their compact size. */
  buttonSize?: ControlSize;
  /** Explicit shared corner override for buttons; omitted preserves each button's shape. */
  buttonCorner?: PanelProps["corner"];
  buttonWeight?: ButtonProps["weight"];
  /** Dashed border on the outline Add filter button. @default true */
  buttonDashed?: boolean;
  /** Filter popup treatment. @default "outlined" */
  menuVariant?: PanelProps["variant"];
  /** Filter popup tint. @default "none" */
  menuTone?: PanelProps["tone"];
  menuCorner?: PanelProps["corner"];
  menuPadding?: PanelProps["padding"];
  /** Applied-chip treatment. @default "soft" */
  chipVariant?: BadgeVariant;
  /** Applied-chip tone. Defaults to color. */
  chipTone?: TrueColor;
  /** Shared spring preset used for search, chips and menu transitions. */
  spring?: ControlSpring;
  /**
   * Draws the bar in placeholder ink (skeleton) or dims the live bar under
   * a Loader overlay (spinner/progress) while results are in flight — same
   * shape either way, nothing jumps when they land. The filter popup
   * closes the moment the bar goes busy.
   * @default false
   */
  loading?: boolean;
  /**
   * Style of the loading indicator, matching Table and ActivityFeed:
   * - `"skeleton"` (default) — the contents are replaced by pulsing
   *   placeholders shaped like the bar's own pieces.
   * - `"spinner"` / `"progress"` — a Loader overlay pinned to the bar;
   *   the real controls stay beneath it behind the scrim.
   * @default "skeleton"
   */
  loaderType?: FilterBarLoaderType;
  /** The bar fill for `loaderType="progress"`, 0–100. */
  loaderProgress?: number;
  /** The label the overlay publishes. @default the kit's "Loading" */
  loadingMessage?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

function normalize(filters: FilterBarFilter[], value: FilterBarValue): FilterBarValue {
  return Object.assign(Object.create(null) as FilterBarValue, Object.fromEntries(filters.flatMap(filter => {
    const selected = new Set(Object.prototype.hasOwnProperty.call(value, filter.id) ? value[filter.id] : []);
    const values = filter.options.filter(option => selected.has(option.value)).map(option => option.value);
    return values.length ? [[filter.id, values]] : [];
  })));
}

/** Caller-owned filtering with staged menu selections and the existing search API. */
export function FilterBar({
  searchProps, filters, value, defaultValue = {}, onChange,
  filteredCount, totalCount, itemLabel, size = "md", color = "blue",
  showSearch = true, showFilterLabel = true, showEmptyState = true,
  showClearAll = true, showResultCount = true, showMenuCounts = true,
  variant = "outlined", tone = "neutral", corner = "rounded-sm", padding = "xs",
  transparency, glassOpacity = "frosted", vibrancy = "medium",
  buttonVariant = "outline", secondaryButtonVariant = "ghost", applyButtonVariant = "solid",
  searchButtonVariant = "icon",
  buttonTone = color, buttonSize = size, buttonCorner, buttonWeight = "normal", buttonDashed = true,
  menuVariant = "outlined", menuTone = "none", menuCorner, menuPadding,
  chipVariant = "soft", chipTone = color, spring = "snappy",
  loading = false, loaderType = "skeleton", loaderProgress, loadingMessage,
  disabled = false, className, "aria-label": ariaLabel,
}: FilterBarProps) {
  const t = useKitT();
  const buttonStyle: React.CSSProperties | undefined = buttonCorner === undefined
    ? undefined : { borderRadius: getSurfaceCornerRem(buttonCorner) };
  const actionStyle = { color: buttonTone, size: buttonSize, weight: buttonWeight, style: buttonStyle };
  const surfaceClasses = getSurfaceVariantClasses(variant, tone, {
    transparency,
    liquidExtras: classNames(getGlassVibrancyClass(vibrancy), getSurfaceGlassFillClass(tone, glassOpacity)),
  });
  const [internal, setInternal] = useState(defaultValue);
  const applied = normalize(filters, value ?? internal);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [draft, setDraft] = useState<string[]>([]);
  const anchor = useRef<HTMLButtonElement>(null);
  const searchRegion = useRef<HTMLDivElement>(null);
  const searchId = useId();
  const [expanded, setExpanded] = useState(Boolean(searchProps.initialValue));
  const searchDisabled = disabled || searchProps.disabled;
  const active = filters.find(filter => filter.id === category);
  const motion = CONTROL_SPRING_TOKENS[spring];
  const style = { "--fb-duration": `${motion.duration}ms`, "--fb-easing": motion.easing } as React.CSSProperties;

  const commit = (next: FilterBarValue) => {
    const normalized = normalize(filters, next);
    if (value === undefined) setInternal(normalized);
    onChange?.(normalized);
  };
  const close = (restore = false) => {
    setOpen(false);
    setCategory(null);
    setDraft([]);
    if (restore) anchor.current?.focus();
  };
  const edit = (filter: FilterBarFilter) => {
    setDraft([...(applied[filter.id] ?? [])]);
    setCategory(filter.id);
    setOpen(true);
  };
  const previouslyExpanded = useRef(expanded);
  useLayoutEffect(() => {
    if (showSearch && expanded && !previouslyExpanded.current && !searchDisabled) searchRegion.current?.querySelector("input")?.focus();
    previouslyExpanded.current = expanded;
  }, [expanded, searchDisabled, showSearch]);
  useEffect(() => {
    // `loading` joins `disabled`: the overlay does not reach the portal, so
    // a checkbox popup must not float over a bar that has gone busy.
    if (loading || disabled || (category !== null && (!active || active.disabled))) {
      setOpen(false);
      setCategory(null);
      setDraft([]);
    }
  }, [loading, disabled, category, active]);

  const items: MenuItem[] = active ? active.options.map(option => ({
    id: option.value, label: option.label, type: "checkbox",
    checked: draft.includes(option.value), disabled: option.disabled,
    badge: showMenuCounts ? option.count : undefined,
    onCheckedChange: checked => setDraft(current => checked
      ? [...new Set([...current, option.value])]
      : current.filter(entry => entry !== option.value)),
  })) : filters.map(filter => ({
    id: filter.id, label: filter.label, badge: showMenuCounts ? filter.count ?? filter.options.length : undefined,
    disabled: filter.disabled, trailing: <CustomIcon icon="ChevronRight" size="sm" />,
    closeOnSelect: false, command: () => edit(filter),
  }));

  const chips = filters.filter(filter => applied[filter.id]?.length).map(filter => ({
    id: filter.id,
    label: `${filter.label}: ${filter.options.filter(option => applied[filter.id].includes(option.value)).map(option => option.label).join(", ")}`,
    disabled: disabled || filter.disabled,
    edit: () => edit(filter),
    remove: () => {
      const next = { ...applied };
      delete next[filter.id];
      commit(next);
      anchor.current?.focus();
    },
  }));

  // Only the skeleton mode rewrites the bar; spinner/progress keep the real
  // controls mounted beneath the overlay, so the bar holds its shape from the
  // first frame to the last.
  const showSkeleton = loading && loaderType === "skeleton";

  return <div role="group" aria-label={ariaLabel ?? t("kit.filterbar.filters")}
    aria-busy={loading || undefined}
    className={classNames("kit-filter-bar flex min-w-0 flex-wrap items-center gap-2 text-sm", surfaceClasses, getSurfaceCornerClass(corner), getSurfacePaddingClass(padding), loading && "relative", className)} style={style}
    onBlurCapture={event => {
      const menu = (event.target as HTMLElement).closest("[data-menu-owner]");
      const next = event.relatedTarget as Node | null;
      if (open && menu && !menu.contains(next) && !event.currentTarget.contains(next)) close();
    }}
    onKeyDownCapture={event => {
      // Let native Tab reach the footer instead of Menu closing on the first option.
      if (open && active && event.key === "Tab") event.stopPropagation();
      if (open && category && event.key === "ArrowLeft") {
        event.preventDefault(); event.stopPropagation(); setCategory(null); setDraft([]);
      }
      if (open && event.key === "Escape") {
        event.preventDefault(); event.stopPropagation(); close(true);
      }
    }}>
    {/* The search field stays mounted (hidden) under the skeleton exactly
        the way collapse keeps its query — unmounting SearchBar would drop
        what the user typed just because results are being refetched. */}
    <div ref={searchRegion} className="fb-search" data-expanded={expanded} hidden={!showSearch || showSkeleton} inert={!showSearch || showSkeleton}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)
          && !event.currentTarget.querySelector("input")?.value) setExpanded(false);
      }}>
      {/* iconOnly is deliberate for every variant: it pins the compact
          icon sizing so the trigger always fits the collapsed .fb-search
          footprint — the treatment may change, the footprint never does. */}
      <Button {...actionStyle} variant={searchButtonVariant} iconOnly leadingIcon="Search"
        aria-label={t("kit.filterbar.search")} aria-expanded={expanded} aria-controls={searchId}
        disabled={searchDisabled} className="fb-search-trigger" hidden={expanded}
        onClick={() => setExpanded(true)} />
      <div id={searchId} className="fb-search-input" inert={!expanded} aria-hidden={!expanded}>
        <SearchBar size={size} color={color} {...searchProps} disabled={searchDisabled} />
      </div>
    </div>
    {showSkeleton ? <FilterBarSkeleton /> : <>
    {showSearch && (showFilterLabel || chips.length > 0 || showEmptyState) && <span aria-hidden="true" className="h-5 border-l border-neutral-200 dark:border-neutral-700" />}
    {showFilterLabel && <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 4h18l-7 8v8l-4-2v-6Z" /></svg>{t("kit.filterbar.filters")}</span>}
    <FilterChips chips={chips} color={chipTone} variant={chipVariant} size={size} buttonTone={buttonTone} buttonStyle={buttonStyle} removeLabel={label => t("kit.filterbar.remove", { label })} />
    {showEmptyState && !chips.length && <span className="text-neutral-400">{t("kit.filterbar.empty")}</span>}
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      <Button {...actionStyle} ref={anchor} variant={buttonVariant} leadingIcon="Add"
        disabled={disabled || !filters.length} className={classNames(buttonCorner === undefined && "rounded-full", buttonDashed && buttonVariant === "outline" && "border-dashed")}
        aria-haspopup="menu" aria-expanded={open}
        onClick={() => { if (open) close(); else { setCategory(null); setOpen(true); } }}
        onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); setCategory(null); setOpen(true); } }}>
        {t("kit.filterbar.add")}
      </Button>
      {showClearAll && chips.length > 0 && <Button {...actionStyle} variant={secondaryButtonVariant} disabled={disabled} onClick={() => { commit({}); anchor.current?.focus(); }}>{t("kit.filterbar.clearAll")}</Button>}
      {showResultCount && <span className="border-l border-neutral-200 pl-2 text-neutral-400 dark:border-neutral-700" role="status">
        {t("kit.filterbar.summary", { filtered: filteredCount, total: totalCount, items: itemLabel ?? t("kit.filterbar.items") })}
      </span>}
    </div>
    <Menu key={category ?? "categories"} popup anchorRef={anchor} open={open && !disabled}
      onOpenChange={next => { if (!next) close(); }} items={items} width={320} size={size}
      variant={menuVariant} tone={menuTone} corner={menuCorner} padding={menuPadding}
      className="fb-menu" style={style} aria-label={active?.label ?? t("kit.filterbar.filterBy")}
      renderItem={active ? item => <>
        <span aria-hidden="true" className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-neutral-300 dark:border-neutral-600">{item.checked && <CustomIcon icon="Check" size="xs" />}</span>
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {item.badge != null && <span className="shrink-0 text-xs text-neutral-400">{item.badge}</span>}
      </> : undefined}
      header={active ? <Button {...actionStyle} variant={secondaryButtonVariant} leadingIcon="ChevronLeft" onClick={() => { setCategory(null); setDraft([]); }} aria-label={t("kit.filterbar.back")}><span className="uppercase tracking-wide">{active.label}</span></Button>
        : <span className="px-3 text-xs uppercase tracking-wide text-neutral-400">{t("kit.filterbar.filterBy")}</span>}
      footer={active ? <div className="flex items-center justify-between">
        <Button {...actionStyle} variant={secondaryButtonVariant} onClick={() => setDraft(current => current.filter(entry => active.options.some(option => option.value === entry && option.disabled)))}>{t("kit.filterbar.clear")}</Button>
        <Button {...actionStyle} variant={applyButtonVariant} onClick={() => { commit({ ...applied, [active.id]: draft }); close(true); }}>{t("kit.filterbar.done")}</Button>
      </div> : undefined} />
    </>}

    {/* The overlay pins to the root itself — no wrapper node: the root is
        the flex-wrap layout, and an extra box would sit between the flex
        container and its items. Being absolute, the Loader's own padding can
        neither stretch nor clip the strip, and its `rounded-[inherit]` picks
        up the bar's corner. The scrim node is also the interaction floor;
        `aria-busy` on the root carries the signal, so the controls are not
        inerted (same contract as Table and the feed). */}
    {loading && loaderType !== "skeleton" && (
      <Loader
        overlay
        variant={loaderType === "progress" ? "progress" : "spinner"}
        color={color}
        progress={loaderProgress}
        aria-label={loadingMessage ?? t("kit.spinner.loading")}
      />
    )}
  </div>;
}

/**
 * Placeholder drawn by `loaderType="skeleton"`: the bar's own pieces in
 * placeholder ink — search capsule, divider, "Filters" label bar, two chip
 * pills, the add-button ring and the summary bar — on fixed heights that sit
 * in the live strip's range at `size="md"`. One shape, no ladder; the row's
 * line box holds the strip height steady while results are in flight.
 */
const FilterBarSkeleton: React.FC = () => (
  <div aria-hidden="true" className="flex min-w-0 flex-1 flex-wrap items-center gap-2 animate-pulse motion-reduce:animate-none">
    <SkeletonBar width="2.5rem" height="h-7" />
    <SkeletonBar width="1px" height="h-5" />
    <SkeletonBar width="4rem" />
    <SkeletonBar width="5rem" height="h-7" />
    <SkeletonBar width="6rem" height="h-7" />
    <span className="flex-1" />
    <SkeletonBar width="6rem" height="h-7" />
    <SkeletonBar width="5rem" />
  </div>
);

interface Chip { id: string; label: string; disabled?: boolean; edit: () => void; remove: () => void }
function FilterChips({ chips, color, variant, size, buttonTone, buttonStyle, removeLabel }: { chips: Chip[]; color: TrueColor; variant: BadgeVariant; size: ControlSize; buttonTone: TrueColor; buttonStyle?: React.CSSProperties; removeLabel: (label: string) => string }) {
  const [visible, setVisible] = useState(chips);
  const region = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, number>());
  const signature = chips.map(chip => chip.id).join("\u0000");
  useEffect(() => {
    const timer = setTimeout(() => setVisible(current => current.filter(chip => signature.split("\u0000").includes(chip.id))), 900);
    return () => clearTimeout(timer);
  }, [signature]);
  useLayoutEffect(() => {
    setVisible(current => [...chips, ...current.filter(chip => !chips.some(next => next.id === chip.id))]);
  }, [signature]);
  useLayoutEffect(() => {
    if (typeof matchMedia === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const next = new Map<string, number>();
    region.current?.querySelectorAll<HTMLElement>("[data-chip]").forEach(element => {
      const key = element.dataset.chip!;
      const left = element.getBoundingClientRect().left;
      const previous = positions.current.get(key);
      if (previous !== undefined && previous !== left) element.animate?.([{ transform: `translateX(${previous - left}px)` }, { transform: "translateX(0)" }], { duration: 320, easing: "ease-out" });
      next.set(key, left);
    });
    positions.current = next;
  });
  return <div ref={region} className="contents">{visible.map(old => {
    const chip = chips.find(current => current.id === old.id);
    const entry = chip ?? old;
    return <span key={entry.id} data-chip={entry.id} className="fb-chip" data-exiting={!chip} inert={!chip} aria-hidden={!chip}>
      <Badge tone={color} variant={variant} size={size} ring={false} className="max-w-full py-1">
        <span className="flex min-w-0 items-center gap-1">
          <button type="button" disabled={entry.disabled} className="min-w-0 truncate rounded-full px-1 py-1 focus-visible:outline focus-visible:outline-2 disabled:opacity-50" onClick={entry.edit}>{entry.label}</button>
          <Button variant="icon" size="xs" color={buttonTone} style={buttonStyle} leadingIcon="Close" disabled={entry.disabled} aria-label={removeLabel(entry.label)} onClick={entry.remove} />
        </span>
      </Badge>
    </span>;
  })}</div>;
}
export default FilterBar;
