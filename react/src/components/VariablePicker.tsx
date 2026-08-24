import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import IconButton from "./IconButton";
import Panel from "./Panel";
import SearchBar from "./SearchBar";
import Tabs, { type TabItem } from "./Tabs";
import { SmartVariableBadge } from "./SmartVariableParts";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { getSurfaceTriggerTokens } from "../theme/Theme";
import { groupToVariables } from "../utils/smartVariables";
import type { TrueColor } from "../theme/Theme";
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolver,
} from "../types/Variables";

export interface VariablePickerProps {
  /** The groups to offer, one tab each. */
  groups: SmartVariableGroup[];
  onSelect: (variable: SmartVariable) => void;
  onClose?: () => void;
  /** Shows each variable's resolved value beside it. */
  resolve?: SmartVariableResolver;
  /** Accent colour. @default "blue" */
  tone?: TrueColor;
  /**
   * Scale of the search field, matched to the control that opened the picker
   * so the two do not look like different widgets stacked on each other.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** Pre-fills the search box — used when the picker is opened by typing. */
  initialSearch?: string;
  title?: string;
  className?: string;
}

const VariableRow: React.FC<{
  variable: SmartVariable;
  tone: TrueColor;
  resolve?: SmartVariableResolver;
  onSelect: (variable: SmartVariable) => void;
}> = ({ variable, tone, resolve, onSelect }) => {
  const surface = useSurfaceText();
  const trigger = getSurfaceTriggerTokens(tone);
  const resolution = resolve?.(variable);

  return (
    <button
      type="button"
      onClick={() => onSelect(variable)}
      className={classNames(
        "flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition",
        trigger.hover,
        trigger.focusRing,
      )}
    >
      <span className="flex w-full items-center gap-2">
        <span className={classNames("truncate text-sm font-medium", surface.heading)}>
          {variable.label || variable.name}
        </span>
        {resolution && (
          <span
            className={classNames(
              "ml-auto max-w-[45%] shrink-0 truncate font-mono text-xs",
              resolution.state === "missing" ? "text-rose-500" : surface.muted,
            )}
          >
            {variable.secret
              ? "••••••"
              : resolution.value || "—"}
          </span>
        )}
      </span>
      {variable.description && (
        <span className={classNames("line-clamp-2 text-xs", surface.muted)}>
          {variable.description}
        </span>
      )}
      <SmartVariableBadge variable={variable} mode="token" flagMissing={false} />
    </button>
  );
};

export const VariablePicker: React.FC<VariablePickerProps> = ({
  groups,
  onSelect,
  onClose,
  resolve,
  tone = "blue",
  size = "md",
  initialSearch = "",
  title = "Insert variable",
  className,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState(groups[0]?.id ?? "");

  // Reopening with a typed filter has to replace the previous search, and the
  // active tab has to survive the group list changing identity.
  useEffect(() => setSearch(initialSearch), [initialSearch]);
  useEffect(() => {
    if (!groups.some((group) => group.id === activeTab)) {
      setActiveTab(groups[0]?.id ?? "");
    }
  }, [groups, activeTab]);

  const tabs = useMemo<TabItem[]>(() => {
    const term = search.trim().toLowerCase();

    return groups.map((group) => {
      const variables = groupToVariables(group).filter((variable) => {
        if (!term) return true;
        return (
          variable.name.toLowerCase().includes(term) ||
          (variable.label ?? "").toLowerCase().includes(term) ||
          (variable.description ?? "").toLowerCase().includes(term)
        );
      });

      return {
        id: group.id,
        label: group.label,
        icon: group.icon,
        badge: variables.length ? String(variables.length) : undefined,
        panel: (
          <div className="max-h-64 overflow-y-auto p-2">
            {variables.length === 0 ? (
              <EmptyRow>
                {group.emptyMessage ??
                  (term
                    ? `Nothing matches “${search}”.`
                    : `No ${group.label.toLowerCase()} variables.`)}
              </EmptyRow>
            ) : (
              <div className="flex flex-col gap-0.5">
                {variables.map((variable) => (
                  <VariableRow
                    key={variable.fullToken}
                    variable={variable}
                    tone={group.tone ?? tone}
                    resolve={resolve}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
          </div>
        ),
      };
    });
  }, [groups, search, resolve, tone, onSelect]);

  return (
    // A Panel, so the picker is a card from the kit rather than a hard-coded
    // `bg-white border-slate-200` box with no dark mode.
    <Panel
      variant="elevated"
      tone="neutral"
      padding="none"
      scrollable={false}
      className={classNames("w-[26rem] max-w-[calc(100vw-2rem)]", className)}
    >
      <Header title={title} onClose={onClose} />

      <div className="px-4 py-3">
        <SearchBar
          size={size}
          color={tone}
          autoSearch
          debounceMs={0}
          initialValue={initialSearch}
          placeholder="Search variables..."
          onSearch={setSearch}
        />
      </div>

      {groups.length === 0 ? (
        <EmptyRow>No variables available.</EmptyRow>
      ) : (
        <div className="px-2 pb-2">
          <Tabs
            items={tabs}
            value={activeTab}
            onChange={setActiveTab}
            variant="minimal"
            color={tone}
          />
        </div>
      )}
    </Panel>
  );
};

const Header: React.FC<{ title: string; onClose?: () => void }> = ({
  title,
  onClose,
}) => {
  const surface = useSurfaceText();
  return (
    <div
      className={classNames(
        "flex items-center justify-between gap-2 border-b px-4 py-3",
        surface.divider,
      )}
    >
      <h3 className={classNames("text-sm font-semibold", surface.heading)}>
        {title}
      </h3>
      {onClose && (
        <IconButton
          icon="Close"
          size="xs"
          variant="ghost"
          color="neutral"
          onClick={onClose}
          srLabel="Close"
        />
      )}
    </div>
  );
};

const EmptyRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const surface = useSurfaceText();
  return (
    <div className={classNames("p-6 text-center text-sm", surface.muted)}>
      {children}
    </div>
  );
};

export default VariablePicker;
