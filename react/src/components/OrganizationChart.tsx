import React, {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import classNames from "classnames";

import { useIconRenderer } from "../contexts/IconContext";
import type { TrueColor } from "../theme/Theme";

export const ORG_CHART_SELECTION_MODES = [
  "none",
  "single",
  "multiple",
  "checkbox",
] as const;
export type OrgChartSelectionMode = (typeof ORG_CHART_SELECTION_MODES)[number];

export interface OrgChartNode {
  /** Unique key, used for expansion and selection. */
  id: string;
  label: string;
  /** Registry icon name, or a React element. */
  icon?: string | ReactElement;
  /** Secondary line under the label (e.g. a name under a role). */
  description?: string;
  children?: OrgChartNode[];
  disabled?: boolean;
}

/** The scope passed to `renderNode` custom content. */
export interface OrgChartRenderContext {
  node: OrgChartNode;
  /** 1-based hierarchy level — the same value as the card's `aria-level`. */
  level: number;
  selected: boolean;
  expanded: boolean;
  hasChildren: boolean;
}

export interface OrganizationChartProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "onSelect" | "onToggle"
  > {
  /** The hierarchical data; top-level entries render as roots. */
  nodes: OrgChartNode[];
  /**
   * Whether branches show a collapse toggle. Expansion itself is always
   * driven by the expanded state. @default true
   */
  collapsible?: boolean;
  /** Controlled expansion (ids of the expanded branches). */
  expandedIds?: string[];
  /** @default every branch — a fully expanded chart */
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Fired on every expand/collapse, with the node and its new state. */
  onToggle?: (node: OrgChartNode, expanded: boolean) => void;
  /** @default "none" */
  selectionMode?: OrgChartSelectionMode;
  /** Controlled selection (node ids). */
  selectedIds?: string[];
  /** @default [] */
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Selection highlight, checkbox and toggle-badge colour. @default "blue" */
  tone?: TrueColor;
  /**
   * Replace the default icon/label/description content. The card structure,
   * selection styling and the collapse toggle are still rendered by the
   * component.
   */
  renderNode?: (context: OrgChartRenderContext) => ReactNode;
  /** Shown when there are no nodes. */
  emptyMessage?: ReactNode;
  /** Accessible name for the chart. */
  ariaLabel?: string;
}

/** Every id that carries children, in tree order — handy for "expand all". */
const collectExpandable = (nodes: OrgChartNode[]): string[] => {
  const ids: string[] = [];
  const walk = (list: OrgChartNode[]): void => {
    for (const node of list) {
      if (node.children?.length) {
        ids.push(node.id);
        walk(node.children);
      }
    }
  };
  walk(nodes);
  return ids;
};

/**
 * Renders hierarchical data as a branching diagram: the root sits centred on
 * top, each level below it, connected by the classic elbow lines. Branches
 * expand and collapse from a toggle on the card, and nodes support single,
 * multiple and checkbox (cascading) selection.
 *
 * Expansion is controlled through `expandedIds` and selection through
 * `selectedIds`; without them the component keeps its own state, seeded from
 * the `default*` props (everything starts expanded).
 */
export const OrganizationChart: React.FC<OrganizationChartProps> = ({
  nodes,
  collapsible = true,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  onToggle,
  selectionMode = "none",
  selectedIds,
  defaultSelectedIds,
  onSelectionChange,
  tone = "blue",
  renderNode,
  emptyMessage,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  const renderIcon = useIconRenderer();
  const uid = useId().replace(/:/g, "");

  const [internalExpanded, setInternalExpanded] = useState<string[]>(
    () => defaultExpandedIds ?? collectExpandable(nodes),
  );
  const [internalSelected, setInternalSelected] = useState<string[]>(
    defaultSelectedIds ?? [],
  );

  const expandedSet = useMemo(
    () => new Set(expandedIds ?? internalExpanded),
    [expandedIds, internalExpanded],
  );
  const selectedSet = useMemo(
    () => new Set(selectedIds ?? internalSelected),
    [selectedIds, internalSelected],
  );

  const { nodeMap, descendantIds } = useMemo(() => {
    const map = new Map<string, OrgChartNode>();
    const descendants = new Map<string, Set<string>>();

    const collect = (list: OrgChartNode[]): Set<string> => {
      const out = new Set<string>();
      for (const node of list) {
        out.add(node.id);
        if (node.children?.length) {
          for (const id of collect(node.children)) out.add(id);
        }
      }
      return out;
    };

    const register = (list: OrgChartNode[]): void => {
      for (const node of list) {
        map.set(node.id, node);
        descendants.set(
          node.id,
          node.children?.length ? collect(node.children) : new Set(),
        );
        if (node.children?.length) register(node.children);
      }
    };
    register(nodes);
    return { nodeMap: map, descendantIds: descendants };
  }, [nodes]);

  const isExpanded = (node: OrgChartNode): boolean =>
    Boolean(node.children?.length) && expandedSet.has(node.id);

  /** A branch reads as checked once it (or every descendant) is selected. */
  const isFullyChecked = (branch: OrgChartNode): boolean => {
    if (selectedSet.has(branch.id)) return true;
    if (!branch.children?.length) return false;
    return branch.children.every((child) => isFullyChecked(child));
  };

  const emitExpanded = (next: string[]): void => {
    if (expandedIds === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  const toggleExpand = (node: OrgChartNode): void => {
    const expanded = expandedSet.has(node.id);
    emitExpanded(
      expanded
        ? [...expandedSet].filter((id) => id !== node.id)
        : [...expandedSet, node.id],
    );
    onToggle?.(node, !expanded);
  };

  const emitSelected = (next: string[]): void => {
    if (selectedIds === undefined) setInternalSelected(next);
    onSelectionChange?.(next);
  };

  const toggleSelect = (node: OrgChartNode): void => {
    if (selectionMode === "none") return;

    if (selectionMode === "single") {
      emitSelected([node.id]);
      return;
    }

    if (selectionMode === "multiple") {
      emitSelected(
        selectedSet.has(node.id)
          ? [...selectedSet].filter((id) => id !== node.id)
          : [...selectedSet, node.id],
      );
      return;
    }

    // Checkbox: the toggle cascades over the whole branch.
    const ids = new Set([node.id, ...(descendantIds.get(node.id) ?? [])]);
    const next = new Set(selectedSet);
    if (isFullyChecked(node)) {
      for (const id of ids) next.delete(id);
    } else {
      for (const id of ids) next.add(id);
    }
    emitSelected([...next]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const node = nodeMap.get(event.currentTarget.dataset.orgId ?? "");
    if (!node || node.disabled) return;
    event.preventDefault();
    toggleSelect(node);
  };

  if (nodes.length === 0 && emptyMessage) {
    return (
      <div
        role="tree"
        aria-label={ariaLabel}
        className={classNames("w-full", className)}
        style={style}
        {...rest}
      >
        <div className="px-2 py-6 text-center text-sm text-neutral-400 dark:text-neutral-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  const connector = "bg-neutral-300 dark:bg-neutral-700";
  const checkboxActive = `border-${tone}-500 bg-${tone}-700 dark:border-${tone}-400 dark:bg-${tone}-400`;
  const checkboxResting =
    "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900";
  const checkboxGlyph = "text-white dark:text-neutral-950";

  const renderBranch = (
    node: OrgChartNode,
    level: number,
    siblings: number,
    pos: number,
  ): ReactElement => {
    const kids = node.children ?? [];
    const hasChildren = kids.length > 0;
    const expanded = isExpanded(node);
    const isDisabled = Boolean(node.disabled);
    const cardId = `${uid}-node-${node.id}`;

    const checkboxState: "true" | "mixed" | "false" | undefined =
      selectionMode === "checkbox"
        ? isFullyChecked(node)
          ? "true"
          : [...(descendantIds.get(node.id) ?? [])].some((id) =>
              selectedSet.has(id),
            )
            ? "mixed"
            : "false"
        : undefined;
    const isSelected =
      selectionMode === "checkbox"
        ? checkboxState === "true"
        : selectedSet.has(node.id);
    const selectable = selectionMode !== "none" && !isDisabled;

    return (
      <div key={node.id} className="flex flex-col items-center">
        <div
          id={cardId}
          role="treeitem"
          data-org-id={node.id}
          aria-level={level + 1}
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
          tabIndex={isDisabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          onClick={() => {
            if (selectable) toggleSelect(node);
          }}
          className={classNames(
            "relative flex min-w-44 cursor-default flex-col items-center gap-1 rounded-lg border bg-white px-4 py-2.5 shadow-sm transition-colors focus:outline-none",
            "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:bg-neutral-900 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-950",
            isSelected
              ? `border-${tone}-500 bg-${tone}-50/80 dark:border-${tone}-400 dark:bg-${tone}-500/10`
              : "border-neutral-300 dark:border-neutral-700",
            selectionMode === "checkbox" && "pr-7",
            isDisabled && "cursor-not-allowed opacity-50",
            !isDisabled && selectionMode !== "none" && "cursor-pointer",
          )}
        >
          {selectionMode === "checkbox" && (
            <span
              aria-hidden="true"
              className={classNames(
                "absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded border transition-colors",
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
                  className={classNames("h-3 w-3", checkboxGlyph)}
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
          {renderNode ? (
            renderNode({
              node,
              level: level + 1,
              selected: isSelected,
              expanded,
              hasChildren,
            })
          ) : (
            <>
              {node.icon != null && (
                <span
                  className={classNames(
                    "flex items-center",
                    isSelected
                      ? `text-${tone}-600 dark:text-${tone}-400`
                      : "text-neutral-500 dark:text-neutral-400",
                  )}
                >
                  {renderIcon(node.icon, "sm")}
                </span>
              )}
              <span className="max-w-44 truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">
                {node.label}
              </span>
              {node.description && (
                <span className="max-w-44 truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {node.description}
                </span>
              )}
            </>
          )}
          {collapsible && hasChildren && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? `Collapse ${node.label}`
                  : `Expand ${node.label}`
              }
              onClick={(event) => {
                event.stopPropagation();
                if (isDisabled) return;
                toggleExpand(node);
              }}
              className="absolute -bottom-2.5 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-500 shadow-sm transition-colors hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:text-white"
            >
              <span
                className={classNames(
                  "flex items-center justify-center transition-transform duration-150",
                  expanded && "rotate-90",
                )}
              >
                {renderIcon("ChevronRight", "xs", "h-3 w-3")}
              </span>
              {!expanded && (
                <span className="absolute -right-1.5 -top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-neutral-200 px-0.5 text-[9px] font-semibold leading-none text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                  {kids.length}
                </span>
              )}
            </button>
          )}
        </div>
        {expanded && (
          <div role="group" aria-labelledby={cardId} className="flex flex-col items-center">
            <div
              aria-hidden="true"
              className={classNames("h-4 w-px", connector)}
            />
            <div className="flex items-start">
              {kids.map((child, i) => (
                <div
                  key={child.id}
                  className="relative flex flex-col items-center px-4"
                >
                  {kids.length > 1 && (
                    <div
                      aria-hidden="true"
                      className={classNames(
                        "absolute top-0 h-px",
                        connector,
                        i === 0
                          ? "left-1/2 right-0"
                          : i === kids.length - 1
                            ? "left-0 w-1/2"
                            : "left-0 right-0",
                      )}
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className={classNames("h-4 w-px", connector)}
                  />
                  {renderBranch(child, level + 1, kids.length, i + 1)}
                </div>
              ))}
            </div>
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
      className={classNames("w-full overflow-x-auto", className)}
      style={style}
      {...rest}
    >
      <div className="flex min-w-max items-start justify-center gap-10 px-6 py-8">
        {nodes.map((node, i) => renderBranch(node, 0, nodes.length, i + 1))}
      </div>
    </div>
  );
};

OrganizationChart.displayName = "OrganizationChart";

export default OrganizationChart;
