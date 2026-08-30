import React, {
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import classNames from "classnames";

import { useIconRenderer } from "../contexts/IconContext";
import type { TrueColor } from "../theme/Theme";

export const TREE_SELECTION_MODES = [
  "none",
  "single",
  "multiple",
  "checkbox",
] as const;
export type TreeSelectionMode = (typeof TREE_SELECTION_MODES)[number];

export const TREE_SIZES = ["sm", "md"] as const;
export type TreeSize = (typeof TREE_SIZES)[number];

export interface TreeItem {
  /** Unique key, used for selection, expansion and keyboard navigation. */
  id: string;
  label: string;
  /** Registry icon name, or a React element. */
  icon?: string | ReactElement;
  children?: TreeItem[];
  disabled?: boolean;
}

export interface TreeProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "onSelect" | "onToggle" | "onFilter"
  > {
  /** The hierarchical data. */
  items: TreeItem[];
  /** @default "none" */
  selectionMode?: TreeSelectionMode;
  /** Controlled selection (node ids). */
  selectedIds?: string[];
  /** @default [] */
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Controlled expansion (node ids). */
  expandedIds?: string[];
  /** @default [] */
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Fired on every expand/collapse, with the node and its new state. */
  onToggle?: (node: TreeItem, expanded: boolean) => void;
  /**
   * Case-insensitive substring match on labels. Branches that contain a match
   * are shown and rendered expanded while the filter is active.
   */
  filter?: string;
  /** Selection highlight and checkbox colour. @default "blue" */
  tone?: TrueColor;
  /** @default "md" */
  size?: TreeSize;
  /** Shown when there are no items (or the filter matches nothing). */
  emptyMessage?: ReactNode;
  /** Accessible name for the tree. */
  ariaLabel?: string;
}

interface FlatNode {
  node: TreeItem;
  parent: TreeItem | null;
  depth: number;
  siblings: number;
  pos: number;
}

type TreeSizeTokens = {
  row: string;
  chevronBox: string;
  chevronIcon: "xs" | "sm";
  iconSize: "xs" | "sm";
  indent: number;
  basePad: number;
  checkbox: string;
  glyph: string;
};

const SIZES: Record<TreeSize, TreeSizeTokens> = {
  sm: {
    row: "h-8 gap-1.5 pr-2 text-xs",
    chevronBox: "h-5 w-5",
    chevronIcon: "xs",
    iconSize: "xs",
    indent: 16,
    basePad: 4,
    checkbox: "h-3.5 w-3.5 rounded-[3px]",
    glyph: "h-2.5 w-2.5",
  },
  md: {
    row: "h-9 gap-2 pr-2.5 text-sm",
    chevronBox: "h-6 w-6",
    chevronIcon: "sm",
    iconSize: "sm",
    indent: 20,
    basePad: 8,
    checkbox: "h-4 w-4 rounded",
    glyph: "h-3 w-3",
  },
};

/**
 * Every id that carries children, in tree order — handy for "expand all".
 */
export const collectExpandableIds = (items: TreeItem[]): string[] => {
  const ids: string[] = [];
  const walk = (list: TreeItem[]): void => {
    for (const item of list) {
      if (item.children?.length) {
        ids.push(item.id);
        walk(item.children);
      }
    }
  };
  walk(items);
  return ids;
};

/**
 * Displays hierarchical data with expand/collapse, single/multiple/checkbox
 * selection, a case-insensitive filter and full roving-keyboard navigation.
 *
 * State is controlled through `expandedIds` / `selectedIds`; without them the
 * component keeps its own state seeded from the `default*` props.
 */
export const Tree: React.FC<TreeProps> = ({
  items,
  selectionMode = "none",
  selectedIds,
  defaultSelectedIds,
  onSelectionChange,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  onToggle,
  filter,
  tone = "blue",
  size = "md",
  emptyMessage,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  const renderIcon = useIconRenderer();
  const uid = useId().replace(/:/g, "");
  const sizeTokens = SIZES[size];

  const [internalSelected, setInternalSelected] = useState<string[]>(
    defaultSelectedIds ?? [],
  );
  const [internalExpanded, setInternalExpanded] = useState<string[]>(
    defaultExpandedIds ?? [],
  );
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement | null>());

  const selectedSet = useMemo(
    () => new Set(selectedIds ?? internalSelected),
    [selectedIds, internalSelected],
  );
  const expandedSet = useMemo(
    () => new Set(expandedIds ?? internalExpanded),
    [expandedIds, internalExpanded],
  );

  const { nodeMap, descendantIds } = useMemo(() => {
    const nodeMap = new Map<string, TreeItem>();
    const descendantIds = new Map<string, Set<string>>();

    const collectDescendants = (list: TreeItem[]): Set<string> => {
      const out = new Set<string>();
      for (const item of list) {
        out.add(item.id);
        if (item.children?.length) {
          for (const id of collectDescendants(item.children)) out.add(id);
        }
      }
      return out;
    };

    const register = (list: TreeItem[]): void => {
      for (const item of list) {
        nodeMap.set(item.id, item);
        descendantIds.set(
          item.id,
          item.children?.length ? collectDescendants(item.children) : new Set(),
        );
        if (item.children?.length) register(item.children);
      }
    };
    register(items);
    return { nodeMap, descendantIds };
  }, [items]);

  const filterText = (filter ?? "").trim().toLowerCase();
  const filterActive = filterText.length > 0;

  const visibleIds = useMemo(() => {
    if (!filterActive) return null;
    const out = new Set<string>();
    const scan = (node: TreeItem): boolean => {
      const selfMatch = node.label.toLowerCase().includes(filterText);
      let childMatch = false;
      if (node.children?.length) {
        for (const child of node.children) {
          if (scan(child)) childMatch = true;
        }
      }
      if (selfMatch || childMatch) out.add(node.id);
      return selfMatch || childMatch;
    };
    for (const item of items) scan(item);
    return out;
  }, [items, filterActive, filterText]);

  const visibleChildrenOf = (node: TreeItem): TreeItem[] => {
    const children = node.children ?? [];
    if (!visibleIds) return children;
    return children.filter((child) => visibleIds.has(child.id));
  };

  const isExpandedForRender = (node: TreeItem): boolean => {
    if (!node.children?.length) return false;
    if (filterActive) return visibleChildrenOf(node).length > 0;
    return expandedSet.has(node.id);
  };

  const flat = useMemo(() => {
    const out: FlatNode[] = [];
    const walk = (
      list: TreeItem[],
      depth: number,
      parent: TreeItem | null,
    ): void => {
      const visible = visibleIds
        ? list.filter((node) => visibleIds.has(node.id))
        : list;
      visible.forEach((node, index) => {
        out.push({
          node,
          parent,
          depth,
          siblings: visible.length,
          pos: index + 1,
        });
        if (isExpandedForRender(node)) {
          walk(visibleChildrenOf(node), depth + 1, node);
        }
      });
    };
    walk(items, 0, null);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, visibleIds, expandedSet, filterActive]);

  const focusNode = (id: string): void => {
    setFocusedId(id);
    rowRefs.current.get(id)?.focus();
  };

  const rovingId = useMemo(() => {
    if (focusedId) {
      const known = flat.find((entry) => entry.node.id === focusedId);
      if (known && !known.node.disabled) return focusedId;
    }
    const firstSelected = flat.find(
      (entry) => selectedSet.has(entry.node.id) && !entry.node.disabled,
    );
    const firstEnabled = flat.find((entry) => !entry.node.disabled);
    return (firstSelected ?? firstEnabled)?.node.id ?? null;
  }, [focusedId, flat, selectedSet]);

  const emitSelected = (next: string[]): void => {
    if (selectedIds === undefined) setInternalSelected(next);
    onSelectionChange?.(next);
  };

  const toggleSelect = (id: string): void => {
    if (selectionMode === "none") return;
    const next =
      selectionMode === "single"
        ? [id]
        : selectedSet.has(id)
          ? [...selectedSet].filter((entry) => entry !== id)
          : [...selectedSet, id];
    emitSelected(next);
  };

  const emitExpanded = (next: string[]): void => {
    if (expandedIds === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  const expandNode = (id: string): void => {
    if (expandedSet.has(id)) return;
    emitExpanded([...expandedSet, id]);
    onToggle?.(nodeMap.get(id)!, true);
  };

  const collapseNode = (id: string): void => {
    if (!expandedSet.has(id)) return;
    emitExpanded([...expandedSet].filter((entry) => entry !== id));
    onToggle?.(nodeMap.get(id)!, false);
  };

  const toggleExpand = (id: string): void => {
    if (expandedSet.has(id)) {
      collapseNode(id);
    } else {
      expandNode(id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const list = flat.filter((entry) => !entry.node.disabled);
    if (!list.length) return;

    // The keydown came from whatever row holds focus, so prefer the event
    // target over the tracked focus state (which lags a beat in jsdom and
    // after rapid moves).
    const target = event.target as HTMLElement | null;
    const targetId =
      target && target !== event.currentTarget
        ? target.closest<HTMLElement>("[data-tree-id]")?.dataset.treeId ?? null
        : null;

    let index = targetId
      ? list.findIndex((entry) => entry.node.id === targetId)
      : -1;
    if (index === -1) {
      const currentId = focusedId ?? rovingId;
      index = list.findIndex((entry) => entry.node.id === currentId);
    }
    const current = index >= 0 ? list[index] : null;

    const focusIndex = (target: number): void => {
      const entry = list[target];
      if (entry) focusNode(entry.node.id);
    };

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (current) focusIndex(Math.min(index + 1, list.length - 1));
        else focusIndex(0);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (current) focusIndex(Math.max(index - 1, 0));
        else focusIndex(list.length - 1);
        break;
      case "Home":
        event.preventDefault();
        focusIndex(0);
        break;
      case "End":
        event.preventDefault();
        focusIndex(list.length - 1);
        break;
      case "ArrowRight": {
        event.preventDefault();
        if (!current) {
          focusIndex(0);
          break;
        }
        const node = current.node;
        if (node.children?.length && !isExpandedForRender(node)) {
          if (!filterActive) expandNode(node.id);
        } else if (node.children?.length) {
          const firstChild = visibleChildrenOf(node)[0];
          if (firstChild) focusNode(firstChild.id);
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (!current) break;
        const node = current.node;
        if (
          node.children?.length &&
          isExpandedForRender(node) &&
          !filterActive
        ) {
          collapseNode(node.id);
        } else if (current.parent) {
          focusNode(current.parent.id);
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        const id = current?.node.id ?? (targetId ?? focusedId ?? rovingId);
        if (id && selectionMode !== "none") toggleSelect(id);
        break;
      }
      default:
        break;
    }
  };

  const topVisible = visibleIds
    ? items.filter((node) => visibleIds.has(node.id))
    : items;

  const showEmpty = topVisible.length === 0;
  if (showEmpty && emptyMessage) {
    return (
      <div
        role="tree"
        aria-label={ariaLabel}
        className={classNames("flex w-full flex-col", className)}
        style={style}
        {...rest}
      >
        <div className="px-2 py-6 text-center text-sm text-neutral-400 dark:text-neutral-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  const checkboxActive = `border-${tone}-500 bg-${tone}-700 dark:border-${tone}-400 dark:bg-${tone}-400`;
  const checkboxResting =
    "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900";
  const checkboxGlyph = "text-white dark:text-neutral-950";

  const renderNode = (
    node: TreeItem,
    depth: number,
    siblings: number,
    pos: number,
  ): ReactElement => {
    const kids = visibleChildrenOf(node);
    const hasChildren = kids.length > 0;
    const expanded = isExpandedForRender(node);
    const isDisabled = Boolean(node.disabled);
    // A branch reads as fully checked once every child (transitively) is —
    // the same derived state PrimeVue shows, so checking the leaves checks
    // the parent visually without the parent key ever entering the value.
    const isFullyChecked = (branch: TreeItem): boolean => {
      if (selectedSet.has(branch.id)) return true;
      if (!branch.children?.length) return false;
      return branch.children.every((child) => isFullyChecked(child));
    };
    const hasCheckedDescendant = [...(descendantIds.get(node.id) ?? [])].some(
      (id) => selectedSet.has(id),
    );
    const checkboxState: "true" | "mixed" | "false" | undefined =
      selectionMode === "checkbox"
        ? isFullyChecked(node)
          ? "true"
          : hasCheckedDescendant
            ? "mixed"
            : "false"
        : undefined;
    const isSelected =
      selectionMode === "checkbox"
        ? checkboxState === "true"
        : selectedSet.has(node.id);
    const selectedByMode = selectionMode !== "none" && isSelected;
    const rowId = `${uid}-row-${node.id}`;

    return (
      <div key={node.id} role="presentation">
        <div
          ref={(el) => {
            if (el) {
              rowRefs.current.set(node.id, el);
            } else {
              rowRefs.current.delete(node.id);
            }
          }}
          role="treeitem"
          id={rowId}
          aria-level={depth + 1}
          aria-setsize={siblings}
          aria-posinset={pos}
          aria-expanded={hasChildren ? expanded : undefined}
          aria-selected={
            selectionMode === "single" || selectionMode === "multiple"
              ? selectedSet.has(node.id)
              : undefined
          }
          aria-checked={checkboxState}
          aria-disabled={isDisabled || undefined}
          aria-label={node.label}
          data-tree-id={node.id}
          tabIndex={rovingId === node.id ? 0 : -1}
          className={classNames(
            "flex w-full min-w-0 cursor-default items-center rounded-md transition-colors focus:outline-none",
            sizeTokens.row,
            selectedByMode
              ? `bg-${tone}-50/80 text-${tone}-800 dark:bg-${tone}-500/10 dark:text-${tone}-300`
              : "hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50",
            "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
            isDisabled && "cursor-not-allowed opacity-50",
          )}
          style={{ paddingLeft: sizeTokens.basePad + depth * sizeTokens.indent }}
          onClick={() => {
            if (isDisabled) return;
            setFocusedId(node.id);
            toggleSelect(node.id);
          }}
          onFocus={() => setFocusedId(node.id)}
        >
          {hasChildren ? (
            // Pointer-only affordance: hidden from assistive tech and out of
            // the tab order on purpose — the row exposes aria-expanded and
            // arrow keys (Left/Right) toggle expansion for keyboard users.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- pointer-only chevron; keyboard expansion lives on the row
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={(event) => {
                event.stopPropagation();
                if (isDisabled) return;
                setFocusedId(node.id);
                toggleExpand(node.id);
              }}
              className={classNames(
                "grid shrink-0 place-items-center rounded text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-700/50 dark:hover:text-neutral-300",
                sizeTokens.chevronBox,
              )}
            >
              <span
                className={classNames(
                  "transition-transform duration-150",
                  expanded && "rotate-90",
                )}
              >
                {renderIcon("ChevronRight", sizeTokens.chevronIcon)}
              </span>
            </button>
          ) : (
            <span
              aria-hidden="true"
              className={classNames("shrink-0", sizeTokens.chevronBox)}
            />
          )}
          {selectionMode === "checkbox" && (
            <span
              aria-hidden="true"
              className={classNames(
                "grid shrink-0 place-items-center border transition-colors",
                sizeTokens.checkbox,
                checkboxState === "true" || checkboxState === "mixed"
                  ? checkboxActive
                  : checkboxResting,
              )}
            >
              {(checkboxState === "true" || checkboxState === "mixed") && (
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={classNames(sizeTokens.glyph, checkboxGlyph)}
                >
                  {checkboxState === "mixed" ? (
                    <path d="M4 8h8" />
                  ) : (
                    <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                  )}
                </svg>
              )}
            </span>
          )}
          {node.icon != null && (
            <span
              className={classNames(
                "flex shrink-0 items-center",
                selectedByMode
                  ? `text-${tone}-600 dark:text-${tone}-400`
                  : "text-neutral-500 dark:text-neutral-400",
              )}
            >
              {renderIcon(node.icon, sizeTokens.iconSize)}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate">{node.label}</span>
        </div>
        {hasChildren && expanded && (
          <div role="group" aria-labelledby={rowId}>
            {kids.map((child, i) =>
              renderNode(child, depth + 1, kids.length, i + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      role="tree"
      aria-label={ariaLabel}
      aria-multiselectable={
        selectionMode === "multiple" || selectionMode === "checkbox"
          ? true
          : undefined
      }
      // Programmatic focus stop for the tree (the treeitems carry the roving
      // tabindex; the container is not a tab stop).
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={classNames("flex w-full flex-col", className)}
      style={style}
      {...rest}
    >
      {topVisible.map((node, i) =>
        renderNode(node, 0, topVisible.length, i + 1),
      )}
    </div>
  );
};

Tree.displayName = "Tree";

export default Tree;
