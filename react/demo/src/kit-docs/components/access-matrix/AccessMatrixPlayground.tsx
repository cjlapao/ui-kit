import React, { useState } from "react";
import { AccessMatrix, MultiToggle } from "@cjlapao/ui-kit";
import type {
  AccessMatrixPermission,
  PanelTone,
  TableDensity,
  TableVariant,
  TableLoaderType,
  SurfaceCorner,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  panelCornerOptions,
  surfaceVariantOptions,
  tableDensityOptions,
  trueColorOptions,
} from "../../shared/options";

const GROUPS = [
  "Administrators",
  "Power Users",
  "Developers",
  "Read Only",
  "Support",
  "Auditors",
  "Guests",
];
const RESOURCES = ["VMs", "Users", "Logs"];
const ACTIONS = ["View", "Create", "Edit", "Delete", "Export"];

/** Who can do what — group → resource → the actions that are allowed. */
const GRANTS: Record<string, Record<string, string[]>> = {
  Administrators: { VMs: ACTIONS, Users: ACTIONS, Logs: ACTIONS },
  "Power Users": {
    VMs: ["View", "Create", "Edit"],
    Users: ["View"],
    Logs: ["View", "Export"],
  },
  Developers: { VMs: ["View", "Edit"], Users: [], Logs: ["View"] },
  "Read Only": { VMs: ["View"], Users: ["View"], Logs: ["View"] },
  Support: { VMs: ["View"], Users: [], Logs: ["View"] },
  Auditors: { VMs: [], Users: [], Logs: ["View", "Export"] },
};

/** The component takes one flat list — group rows, the Resource column and
 *  one column per action are all derived from it. */
const PERMISSIONS: AccessMatrixPermission[] = GROUPS.flatMap((group) =>
  RESOURCES.flatMap((resource) =>
    ACTIONS.map((action) => ({
      group,
      resource,
      action,
      enabled: (GRANTS[group]?.[resource] ?? []).includes(action),
    })),
  ),
);

export const AccessMatrixPlayground: React.FC = () => {
  const [variant, setVariant] = useState<TableVariant>("outlined");
  const [tone, setTone] = useState<PanelTone>("neutral");
  const [density, setDensity] = useState<TableDensity>("default");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-lg");
  const [limit, setLimit] = useState(3);
  const [striped, setStriped] = useState(true);
  const [bordered, setBordered] = useState(false);
  const [noBorders, setNoBorders] = useState(false);
  const [hoverable, setHoverable] = useState(true);
  const [fullHeight, setFullHeight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<TableLoaderType>("spinner");
  const [loaderProgress, setLoaderProgress] = useState(50);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <SelectControl
                      label="Surface (variant)"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as TableVariant)}
                    />
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(value) => setTone(value as PanelTone)}
                    />
                    <Control label="Density">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={tableDensityOptions}
                        value={density}
                        onChange={(value) => setDensity(value as TableDensity)}
                      />
                    </Control>
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(value) => setCorner(value as SurfaceCorner)}
                    />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label="Groups before expand">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={[
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "5", value: "5" },
                      ]}
                      value={String(limit)}
                      onChange={(value) => setLimit(Number(value))}
                    />
                  </Control>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <Control label="Loader (while loading)">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={[
                          { label: "Spinner", value: "spinner" },
                          { label: "Progress", value: "progress" },
                          { label: "Skeleton", value: "skeleton" },
                        ]}
                        value={loaderType}
                        onChange={(value) => setLoaderType(value as TableLoaderType)}
                      />
                    </Control>
                    {loaderType === "progress" && (
                      <SelectControl
                        label="Progress"
                        options={[
                          { label: "25%", value: "25" },
                          { label: "50%", value: "50" },
                          { label: "75%", value: "75" },
                        ]}
                        value={String(loaderProgress)}
                        onChange={(value) => setLoaderProgress(Number(value))}
                      />
                    )}
                  </>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                    <ToggleRow label="Striped rows" checked={striped} onChange={setStriped} />
                    <ToggleRow label="Bordered grid" checked={bordered} onChange={setBordered} />
                    <ToggleRow
                      label="Remove row borders"
                      checked={noBorders}
                      onChange={setNoBorders}
                    />
                    <ToggleRow label="Row hover" checked={hoverable} onChange={setHoverable} />
                    <ToggleRow label="Fill height, scroll inside" checked={fullHeight} onChange={setFullHeight} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            The matrix is read-only: it takes a flat{" "}
            <code>permissions</code> list and derives the columns itself.
            Group header rows collapse on click, and beyond{" "}
            <code>limit</code> the remaining groups sit behind a "show more"
            button. Toggle <code>Loading</code> to preview the three
            Panel-style loaders — the spinner/progress overlay stays pinned to
            the card while the content scrolls, and the skeleton replaces the
            matrix with pulsing placeholders.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <div className={fullHeight ? "h-96" : undefined}>
            <AccessMatrix
              permissions={PERMISSIONS}
              limit={limit}
              variant={variant}
              tone={tone}
              density={density}
              corner={corner}
              striped={striped}
              bordered={bordered}
              noBorders={noBorders}
              hoverable={hoverable}
              fullHeight={fullHeight}
              loading={loading}
              loadingMessage="Loading permissions…"
              loaderType={loaderType}
              loaderProgress={
                loaderType === "progress" ? loaderProgress : undefined
              }
            />
          </div>
        </div>
      }
    ></PlaygroundPanel>
  );
};
