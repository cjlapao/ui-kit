import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  MultiToggle,
  Tree,
  collectExpandableIds,
  type TreeItem,
  type TreeSelectionMode,
  type TreeSize,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  TREE_DEMO_ITEMS,
  treeSelectionModeOptions,
  treeSizeOptions,
  trueColorOptions,
} from "../../shared/options";

const stripIcons = (items: TreeItem[]): TreeItem[] =>
  items.map((item) => ({
    ...item,
    icon: undefined,
    children: item.children ? stripIcons(item.children) : undefined,
  }));

export const TreePlayground: React.FC = () => {
  const [selectionMode, setSelectionMode] =
    useState<TreeSelectionMode>("checkbox");
  const [size, setSize] = useState<TreeSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [filter, setFilter] = useState("");
  const [showIcons, setShowIcons] = useState(true);
  const [expanded, setExpanded] = useState<string[]>(["documents"]);
  const [selected, setSelected] = useState<string[]>([]);

  const items = useMemo(
    () => (showIcons ? TREE_DEMO_ITEMS : stripIcons(TREE_DEMO_ITEMS)),
    [showIcons],
  );
  const expandable = useMemo(() => collectExpandableIds(TREE_DEMO_ITEMS), []);

  return (
    <PlaygroundPanel
      controls={
        <ControlAccordion
          groups={[
            {
              id: "core",
              title: "Core",
              controls: (
                <>
                  <SelectControl
                    label="Selection mode"
                    options={treeSelectionModeOptions}
                    value={selectionMode}
                    onChange={(value) => {
                      setSelectionMode(value as TreeSelectionMode);
                      setSelected([]);
                    }}
                  />
                  <Control label="Size">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={treeSizeOptions}
                      value={size}
                      onChange={(value) => setSize(value as TreeSize)}
                    />
                  </Control>
                  <SelectControl
                    label="Tone"
                    options={trueColorOptions}
                    value={tone}
                    onChange={(value) => setTone(value as TrueColor)}
                  />
                </>
              ),
            },
            {
              id: "content",
              title: "Content",
              controls: (
                <Control label="Filter">
                  <Input
                    size="sm"
                    leadingIcon="Search"
                    placeholder="Filter nodes…"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  />
                </Control>
              ),
            },
            {
              id: "icons",
              title: "Icons",
              controls: (
                <div className="grid grid-cols-1 gap-2">
                  <ToggleRow label="Show icons" checked={showIcons} onChange={setShowIcons} />
                </div>
              ),
            },
            {
              id: "actions",
              title: "Actions",
              controls: (
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
              ),
            },
          ]}
        />
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <div className="w-full max-w-md">
            <Tree
              items={items}
              selectionMode={selectionMode}
              size={size}
              tone={tone}
              filter={filter}
              expandedIds={expanded}
              onExpandedChange={setExpanded}
              selectedIds={selected}
              onSelectionChange={setSelected}
              emptyMessage="No nodes match."
              ariaLabel="Files"
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
