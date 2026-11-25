import { getSurfaceAccentColor, getToggleVariantTokens } from "../../theme/Theme";
import React, { cloneElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Panel from "../Panel";
import ScrollArea from "../ScrollArea";
import CustomIcon from "../CustomIcon";
import { CollapseChevron } from "../CollapseToggleButton";
import { getSideMenuItemTokens, getSurfaceTriggerTokens, getSurfaceCornerClass } from "../../theme/Theme";
import { MenuPopup } from "./MenuPopup";
import type { MenuItem, MenuProps } from "./types";

export { SURFACE_VARIANTS as MENU_VARIANTS } from "../../theme/Theme";
export type { MenuItem, MenuProps } from "./types";
// Menus use a compact inset scale rather than the roomier card scale.
const menuPadding = {
  none: "p-0",
  xs: "p-1 sm:p-1.5",
  sm: "p-2 sm:p-2.5",
  md: "p-3 sm:p-4",
  lg: "p-4 sm:p-5",
  xl: "p-5 sm:p-6",
};
const rowSizes = { xs: "px-2 py-1 text-xs", sm: "px-2.5 py-1.5 text-xs", md: "px-3 py-2 text-sm", lg: "px-4 py-2.5 text-base", xl: "px-5 py-3 text-lg" };
interface State {
  owner: string;
  props: MenuProps;
  expanded: string[];
  toggle: (id: string) => void;
  path: string[];
  setPath: (path: string[]) => void;
  close: (restore?: boolean) => void;
  keyboard: React.MutableRefObject<boolean>;
  cancelLeave: () => void;
  scheduleLeave: () => void;
}
const text = (item: MenuItem) => item.textValue ?? (typeof item.label === "string" ? item.label : item.id);

/** The path from `items` down to the entry with `selectedKey`, or undefined. */
function findSelectedBranch(items: MenuItem[] | undefined, selectedKey: string): MenuItem[] | undefined {
  for (const item of items ?? []) {
    if (item.hidden) continue;
    if (item.id === selectedKey) return [item];
    const branch = findSelectedBranch(item.items, selectedKey);
    if (branch) return [item, ...branch];
  }
  return undefined;
}

function MenuList({ items, state, depth = 0, parentLabel, onBack, focusOnMount = false, grouped = false }: {
  items: MenuItem[]; state: State; depth?: number; parentLabel?: string; onBack?: () => void; focusOnMount?: boolean; grouped?: boolean;
}) {
  const list = useRef<HTMLUListElement>(null);
  const buffer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const actions = () => Array.from(list.current?.querySelectorAll<HTMLElement>("[data-menu-action]") ?? []).filter(el => el.closest('[role="menu"]') === list.current && el.getAttribute("aria-disabled") !== "true");
  useLayoutEffect(() => {
    if (grouped) return;
    const entries = actions();
    const selected = entries.find(el => el === document.activeElement) ?? entries[0];
    entries.forEach(el => { el.tabIndex = el === selected ? 0 : -1; });
  }, [items, grouped]);
  useLayoutEffect(() => {
    if (!focusOnMount) return;
    const frame = requestAnimationFrame(() => actions()[0]?.focus());
    return () => cancelAnimationFrame(frame);
  }, [focusOnMount]);
  useEffect(() => () => clearTimeout(timer.current), []);
  // The leading glyph gutter is only reserved when some row in this list
  // actually paints one — an icon, or a checkbox/radio check that lands in
  // the same slot. A text-only list starts flush at the menu padding.
  const gutter = items.some(other => !other.hidden && (other.icon != null || other.type === "checkbox" || other.type === "radio"));
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- menu/group list delegates keyboard navigation to native item controls
  return <ul ref={list} id={depth === 0 && !grouped ? `${state.owner}-menu` : undefined} role={grouped ? "group" : "menu"} aria-label={parentLabel ?? state.props["aria-label"] ?? "Menu"} className="m-0 list-none space-y-0.5 p-0"
    onFocusCapture={event => {
      const entries = actions();
      entries.forEach(el => { el.tabIndex = el === event.target ? 0 : -1; });
    }}
    onKeyDown={event => {
      if ((event.target as HTMLElement).closest('[role="menu"]') !== list.current) return;
      const entries = actions(); const index = entries.indexOf(document.activeElement as HTMLElement);
      let next: number | undefined;
      if (event.key === "ArrowDown") next = (index + 1) % entries.length;
      if (event.key === "ArrowUp") next = (index - 1 + entries.length) % entries.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = entries.length - 1;
      if (next !== undefined) { event.preventDefault(); event.stopPropagation(); entries[next]?.focus(); return; }
      if (event.key === "Escape" || event.key === "ArrowLeft") {
        if (onBack) { event.preventDefault(); event.stopPropagation(); onBack(); }
        else if (event.key === "Escape") { event.preventDefault(); state.close(true); }
        return;
      }
      if (event.key === "Tab") { state.close(false); return; }
      if (event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey) {
        clearTimeout(timer.current); buffer.current += event.key.toLocaleLowerCase();
        const ordered = [...entries.slice(index + 1), ...entries.slice(0, index + 1)];
        ordered.find(el => el.dataset.menuText?.toLocaleLowerCase().startsWith(buffer.current))?.focus();
        timer.current = setTimeout(() => { buffer.current = ""; }, 600);
      }
    }}>
    {items.filter(item => !item.hidden).map(item => <MenuRow key={item.id} item={item} state={state} depth={depth} gutter={gutter} />)}
  </ul>;
}

function MenuRow({ item, state, depth, gutter = true }: { item: MenuItem; state: State; depth: number; gutter?: boolean }) {
  const anchor = useRef<HTMLElement | null>(null);
  const { props } = state;
  const tiered = (item.submenuMode ?? props.submenuMode ?? "tiered") === "tiered";
  const nested = Boolean(item.items?.some(child => !child.hidden) || item.content != null);
  const expanded = tiered ? state.path[depth] === item.id : state.expanded.includes(item.id);
  const label = text(item);
  const id = useId();
  const open = (keyboard: boolean) => {
    if (item.disabled || !nested) return;
    state.keyboard.current = keyboard;
    if (tiered) state.setPath([...state.path.slice(0, depth), item.id]);
    else if (!expanded) state.toggle(item.id);
    else if (keyboard) document.getElementById(`${id}-submenu`)?.querySelector<HTMLElement>("[data-menu-action]:not([aria-disabled='true'])")?.focus();
  };
  const back = () => {
    if (tiered) state.setPath(state.path.slice(0, depth)); else state.toggle(item.id);
    anchor.current?.focus();
  };
  if (item.type === "separator") return <li role="separator" className="my-1.5 border-t border-neutral-200 dark:border-white/10" />;
  if (item.type === "group") return <li role="presentation">
    {item.label && <div className="px-3 pb-1 pt-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400">{item.label}</div>}
    {item.items && <MenuList items={item.disabled ? item.items.map(child => ({ ...child, disabled: true })) : item.items} state={state} depth={depth} parentLabel={label} grouped />}
  </li>;
  const itemTone = getSurfaceAccentColor(item.tone ?? props.itemTone ?? props.tone ?? "none");
  const itemPadding = item.padding ?? props.itemPadding;
  const tokens = getSideMenuItemTokens(itemTone);
  const checkable = item.type === "checkbox" || item.type === "radio" || item.type === "toggle";
  // `selectedKey` drives the right-aligned check and the parent-row value echo;
  // checkbox/radio rows keep their own left-side checks, so checkable wins.
  const selected = !checkable && props.selectedKey != null && item.id === props.selectedKey;
  const branch = !selected && nested && item.trailing == null && props.selectedKey != null
    ? findSelectedBranch(item.items, props.selectedKey)
    : undefined;
  const echo = branch ? branch[branch.length - 1] : undefined;
  // A selection inside a submenu ends the *branch*, not the menu: the chain
  // collapses back to the root list and focus lands on the row that opened
  // it. An author-set closeOnSelect true (or a click at the root) still closes
  // everything. Inline sections collapse through their ancestors' toggle.
  const collapseToRoot = () => {
    const chain = findSelectedBranch(state.props.items, item.id);
    if (tiered) state.setPath([]);
    else for (const ancestor of chain?.slice(0, -1) ?? []) if (state.expanded.includes(ancestor.id)) state.toggle(ancestor.id);
    state.cancelLeave();
    const rootParentId = chain?.[0]?.id;
    if (rootParentId != null) requestAnimationFrame(() => {
      const rows = document.getElementById(`${state.owner}-menu`)?.querySelectorAll<HTMLElement>("[data-menu-id]") ?? [];
      for (const row of rows) if (row.dataset.menuId === rootParentId) { row.focus(); break; }
    });
  };
  const activate = (event: React.MouseEvent<HTMLElement>) => {
    if (item.disabled) { event.preventDefault(); return; }
    if (nested) { event.preventDefault(); if (expanded) back(); else open(true); return; }
    if (checkable) item.onCheckedChange?.(item.type === "radio" ? true : !item.checked);
    item.command?.(item); props.onSelect?.(item);
    // Three tiers: explicit true closes everything at any depth; explicit
    // false (row-level) keeps the row exactly where it is — even its submenu.
    // Implicit: plain rows close, and from inside a submenu that means
    // collapsing the branch, never the menu. A menu-wide false only protects
    // the root list — selecting still collapses submenus.
    const closeEverything = item.closeOnSelect ?? props.closeOnSelect;
    if (closeEverything === true) state.close(true);
    else if (item.closeOnSelect == null && !checkable && depth > 0) collapseToRoot();
    else if (closeEverything == null && !checkable) state.close(true);
  };
  const content = props.renderItem?.(item, { expanded, checked: Boolean(item.checked) }) ?? <>
    {gutter && <span aria-hidden="true" className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
      {item.type === "checkbox" || item.type === "radio" ? item.checked && (item.type === "radio" ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : <CustomIcon icon="Check" size="sm" />)
        : React.isValidElement(item.icon) ? item.icon : typeof item.icon === "string" ? <CustomIcon icon={item.icon} size="sm" /> : null}
    </span>}
    <span className="min-w-0 flex-1"><span className="block truncate">{item.label}</span>{item.description && <span className="block text-xs font-normal opacity-70">{item.description}</span>}</span>
    {item.badge != null && <span className="shrink-0 text-xs">{item.badge}</span>}
    {item.shortcut != null && <span className="shrink-0 text-xs opacity-60">{item.shortcut}</span>}
    {item.trailing}
    {echo && <span className="shrink-0 text-xs font-normal opacity-70">{text(echo)}</span>}
    {selected && <span aria-hidden="true" className="inline-flex h-5 w-5 shrink-0 items-center justify-center"><CustomIcon icon="Check" size="sm" /></span>}
    {item.type === "toggle" && <MenuSwitch checked={Boolean(item.checked)} disabled={item.disabled} />}
    {nested && <CollapseChevron aria-hidden="true" className={classNames("h-3 w-3 shrink-0", !tiered && (expanded ? "-rotate-90" : "rotate-90"))} />}
  </>;
  const rowProps = {
    id, role: checkable ? item.type === "radio" ? "menuitemradio" : "menuitemcheckbox" : selected ? "menuitemradio" : "menuitem",
    "aria-label": label, "aria-disabled": item.disabled || undefined,
    "aria-checked": checkable ? Boolean(item.checked) : selected ? true : undefined,
    "aria-expanded": nested ? expanded : undefined, "aria-haspopup": nested && tiered ? "menu" as const : undefined,
    "aria-controls": nested && expanded ? `${id}-submenu` : undefined,
    "data-menu-action": "", "data-menu-text": label, "data-menu-id": item.id, tabIndex: -1,
    className: classNames("flex w-full items-center gap-2 text-left font-medium outline-none transition-colors", itemPadding === undefined ? rowSizes[props.size ?? "md"] : [rowSizes[props.size ?? "md"].split(" ").filter(token => token.startsWith("text-")), menuPadding[itemPadding]],
      getSurfaceCornerClass(item.corner ?? props.itemCorner ?? "rounded-sm"),
      getSurfaceTriggerTokens(itemTone).focusRing,
      item.disabled ? "cursor-not-allowed opacity-40" : item.danger ? "text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10" : [tokens.hoverBg, tokens.hoverText],
      expanded && !item.disabled && tokens.bg),
    onClick: activate,
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowRight" && nested) { event.preventDefault(); event.stopPropagation(); open(true); }
      if (event.key === " " && (item.href || item.to)) { event.preventDefault(); event.currentTarget.click(); }
    },
    onMouseEnter: () => { state.cancelLeave(); if (tiered && !item.disabled) { if (nested) open(false); else state.setPath(state.path.slice(0, depth)); } },
  };
  const row = item.to && !nested ? <Link {...rowProps} ref={el => { anchor.current = el; }} to={item.to}>{content}</Link>
    : item.href && !nested ? <a {...rowProps} ref={el => { anchor.current = el; }} href={item.href} target={item.target} rel={item.target === "_blank" ? "noopener noreferrer" : undefined}>{content}</a>
    : <button {...rowProps} type="button" ref={el => { anchor.current = el; }}>{content}</button>;
  const submenu = <div id={`${id}-submenu`}>
    {item.submenuHeader != null && <div className="px-3 py-1.5 text-xs font-normal opacity-70">{item.submenuHeader}</div>}
    {item.items && <MenuList items={item.items} state={state} depth={depth + 1} parentLabel={label} onBack={back} focusOnMount={state.keyboard.current} />}
    {item.content}
  </div>;
  return <li role="presentation">{row}{nested && expanded && (
    tiered ? <MenuPopup anchor={anchor} placement="right" width={props.width} maxWidth={props.maxWidth}>
      <MenuSurface state={state}>{submenu}</MenuSurface>
    </MenuPopup> : <div className="ml-4 border-l border-neutral-200 pl-1 dark:border-white/10">{submenu}</div>
  )}</li>;
}

// The on-state track reuses the kit Toggle's solid-blue token with the
// `peer-checked:` input prefixes peeled off — the menu switch has no input,
// it is painted directly from the `checked` prop.
const SWITCH_ON_TRACK = getToggleVariantTokens("blue", "solid").track
  .split(" ")
  .map(cls => cls.replace("dark:peer-checked:", "dark:").replace("peer-checked:", ""))
  .join(" ");

/**
 * The trailing switch of `type: "toggle"` rows — the kit Toggle's xs solid
 * treatment at menu density, presentational only: the row is the single
 * button (a `menuitemcheckbox` carries the state), so this mirrors the thumb
 * and stays `aria-hidden`. No input, no second control inside a control.
 */
function MenuSwitch({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return <span aria-hidden="true" data-menu-switch={checked ? "on" : "off"} className={classNames("relative inline-flex h-4 w-7 shrink-0 items-center overflow-hidden rounded-full border border-transparent transition-colors duration-200 ease-in-out", checked ? SWITCH_ON_TRACK : "bg-neutral-200 dark:bg-neutral-600", disabled && "opacity-40")}>
    <span className={classNames("pointer-events-none absolute top-1/2 left-0.5 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out dark:bg-neutral-200", checked && "translate-x-3")} />
  </span>;
}

function MenuSurface({ state, children, root = false }: { state: State; children: React.ReactNode; root?: boolean }) {
  const { props } = state;
  return <div data-menu-owner={state.owner} onMouseEnter={state.cancelLeave} onMouseLeave={state.scheduleLeave}>
    <Panel variant={props.variant ?? "outlined"} tone={props.tone ?? "none"} corner={props.corner ?? "rounded-sm"} padding="none"
      glassOpacity={props.glassOpacity} transparency={props.transparency} vibrancy={props.vibrancy} specularMode={props.specularMode}
      raisedSurface={root ? props.raisedSurface : undefined}
      style={root ? props.style : undefined}
      className={classNames(root ? props.className : undefined,
        (!root || props.popup || props.trigger || props.anchorRef) && "backdrop-blur-xl")}>
      <div data-menu-padding className={menuPadding[props.padding ?? "xs"]}>
      {root && props.header && <div className="mb-2 border-b border-neutral-200 pb-2 dark:border-white/10">{props.header}</div>}
      {/* The popup publishes --menu-popup-max-height (space to the viewport edge on the
          chosen side); inline menus have no such var and fall back to 100dvh. The cap
          rides the ScrollArea frame and the max-h-[inherit] viewport scrolls inside it;
          tabIndex -1 because the menu's roving focus already owns the keyboard.
          gutter false: the row's own trailing px-* (≥8px, and the bar's ink is a 4px
          thumb inside its 10px track) already clears the lane, so the content lane
          would only stack a second inset on the right — the rows then hung further
          from the panel edge on the right than on the left. */}
      <ScrollArea gutter={false} horizontal={false} tabIndex={-1} style={{ maxHeight: `min(${props.maxHeight ?? 400}px, calc(100dvh - 32px), var(--menu-popup-max-height, 100dvh))` }}>{children}</ScrollArea>
      {root && props.footer && <div className="mt-2 border-t border-neutral-200 pt-2 dark:border-white/10">{props.footer}</div>}
      </div>
    </Panel>
  </div>;
}

export function Menu(props: MenuProps) {
  const owner = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const anchor = props.anchorRef ?? triggerRef;
  const popup = props.popup ?? Boolean(props.trigger || props.anchorRef);
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false);
  const open = props.open ?? internalOpen;
  const [expanded, setExpanded] = useState(props.defaultExpandedKeys ?? []);
  const [path, setPath] = useState<string[]>([]);
  const keyboard = useRef(false);
  const leave = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelLeave = useCallback(() => clearTimeout(leave.current), []);
  const requestOpen = useCallback((value: boolean) => {
    if (props.open === undefined) setInternalOpen(value);
    props.onOpenChange?.(value);
    if (!value) setPath([]);
  }, [props.open, props.onOpenChange]);
  const close = (restore = false) => {
    setPath([]);
    if (popup) requestOpen(false);
    if (restore) {
      if (anchor.current) anchor.current.focus();
      else {
        const root = Array.from(document.querySelectorAll<HTMLElement>("[data-menu-owner]")).find(el => el.dataset.menuOwner === owner);
        root?.querySelector<HTMLElement>("[data-menu-action]:not([aria-disabled='true'])")?.focus();
      }
    }
  };
  useEffect(() => {
    if (popup ? !open : path.length === 0) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (anchor.current?.contains(target)) return;
      const owned = Array.from(document.querySelectorAll<HTMLElement>("[data-menu-owner]")).some(el => el.dataset.menuOwner === owner && el.contains(target));
      if (!owned) requestOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [popup, open, path.length, anchor, owner, requestOpen]);
  useEffect(() => () => clearTimeout(leave.current), []);
  const state: State = { owner, props, expanded: props.expandedKeys ?? expanded, path, setPath, close, keyboard, cancelLeave,
    scheduleLeave: () => { cancelLeave(); if (path.length && !keyboard.current) leave.current = setTimeout(() => setPath([]), 250); },
    toggle: id => { const current = props.expandedKeys ?? expanded; const next = current.includes(id) ? current.filter(key => key !== id) : [...current, id]; if (props.expandedKeys === undefined) setExpanded(next); props.onExpandedKeysChange?.(next); },
  };
  const surface = <MenuSurface state={state} root><MenuList items={props.items} state={state} focusOnMount={popup && open} /></MenuSurface>;
  let trigger: React.ReactNode = null;
  if (props.trigger) {
    const original = props.trigger.props as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
    const originalRef = Number(React.version.split(".")[0]) >= 19
      ? original.ref
      : (props.trigger as unknown as { ref?: React.Ref<HTMLElement> }).ref;
    trigger = cloneElement(props.trigger as React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>, {
      ref: el => { triggerRef.current = el; if (typeof originalRef === "function") originalRef(el); else if (originalRef) (originalRef as React.MutableRefObject<HTMLElement | null>).current = el; },
      "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? `${owner}-menu` : undefined,
      onClick: event => { original.onClick?.(event); if (!event.defaultPrevented) requestOpen(!open); },
      onKeyDown: event => { original.onKeyDown?.(event); if (!event.defaultPrevented && (event.key === "ArrowDown" || event.key === "ArrowUp")) { event.preventDefault(); requestOpen(true); } },
    });
  }
  return <>{trigger}{popup ? open && <MenuPopup anchor={anchor} placement={props.placement ?? "bottom"} width={props.width} maxWidth={props.maxWidth} align={props.align ?? "grow"}>{surface}</MenuPopup> : <div style={{ minWidth: props.width === "trigger" ? 256 : props.width ?? 256, maxWidth: props.maxWidth != null ? `min(${props.maxWidth}px, 100%)` : "100%" }}>{surface}</div>}</>;
}
export default Menu;
