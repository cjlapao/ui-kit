import React, { useMemo, useState } from "react";
import {
  Button,
  OrganizationChart,
  type OrgChartNode,
  type OrgChartSelectionMode,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  ORG_CHART_DEMO_NODES,
  orgSelectionModeOptions,
  trueColorOptions,
} from "../../shared/options";

const stripIcons = (nodes: OrgChartNode[]): OrgChartNode[] =>
  nodes.map((node) => ({
    ...node,
    icon: undefined,
    children: node.children ? stripIcons(node.children) : undefined,
  }));

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

export const OrgChartPlayground: React.FC = () => {
  const [selectionMode, setSelectionMode] =
    useState<OrgChartSelectionMode>("single");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [collapsible, setCollapsible] = useState(true);
  const [showIcons, setShowIcons] = useState(true);
  const [expanded, setExpanded] = useState<string[]>(() =>
    collectExpandable(ORG_CHART_DEMO_NODES),
  );
  const [selected, setSelected] = useState<string[]>([]);

  const nodes = useMemo(
    () => (showIcons ? ORG_CHART_DEMO_NODES : stripIcons(ORG_CHART_DEMO_NODES)),
    [showIcons],
  );
  const expandable = useMemo(
    () => collectExpandable(ORG_CHART_DEMO_NODES),
    [],
  );

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Selection mode"
            options={orgSelectionModeOptions}
            value={selectionMode}
            onChange={(value) => {
              setSelectionMode(value as OrgChartSelectionMode);
              setSelected([]);
            }}
          />
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(value) => setTone(value as TrueColor)}
          />
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow
              label="Collapsible"
              checked={collapsible}
              onChange={setCollapsible}
            />
            <ToggleRow label="Show icons" checked={showIcons} onChange={setShowIcons} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExpanded(expandable)}
            >
              Expand all
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExpanded([])}
            >
              Collapse all
            </Button>
          </div>
        </>
      }
      preview={
        <div className="flex w-full min-w-0 flex-col gap-3">
          <div className="w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
            <OrganizationChart
              nodes={nodes}
              selectionMode={selectionMode}
              tone={tone}
              collapsible={collapsible}
              expandedIds={expanded}
              onExpandedChange={setExpanded}
              selectedIds={selected}
              onSelectionChange={setSelected}
              ariaLabel="Organization"
            />
          </div>
          {selectionMode !== "none" && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Selected:{" "}
              <span className="font-medium text-neutral-600 dark:text-neutral-300">
                {selected.length ? selected.join(", ") : "none"}
              </span>
            </p>
          )}
        </div>
      }
    />
  );
};
