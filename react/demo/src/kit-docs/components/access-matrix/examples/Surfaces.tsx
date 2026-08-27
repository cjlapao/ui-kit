import React from "react";
import { AccessMatrix } from "@cjlapao/ui-kit";
import type { AccessMatrixPermission, TableVariant } from "@cjlapao/ui-kit";

const PERMISSIONS: AccessMatrixPermission[] = [
  { group: "Admin", resource: "VMs", action: "View", enabled: true },
  { group: "Admin", resource: "VMs", action: "Edit", enabled: true },
  { group: "Admin", resource: "VMs", action: "Delete", enabled: true },
  { group: "Admin", resource: "Users", action: "View", enabled: true },
  { group: "Admin", resource: "Users", action: "Edit", enabled: true },
  { group: "Admin", resource: "Users", action: "Delete", enabled: false },

  { group: "Developer", resource: "VMs", action: "View", enabled: true },
  { group: "Developer", resource: "VMs", action: "Edit", enabled: true },
  { group: "Developer", resource: "VMs", action: "Delete", enabled: false },
  { group: "Developer", resource: "Users", action: "View", enabled: false },
  { group: "Developer", resource: "Users", action: "Edit", enabled: false },
  { group: "Developer", resource: "Users", action: "Delete", enabled: false },
];

/** The matrix runs on the same panel family as the Table — the variant
 *  picks the surface and the tone tints it. */
const SURFACES: TableVariant[] = ["outlined", "tonal", "glass", "liquid-glass"];

export const Surfaces: React.FC = () => (
  <div
    className="w-full rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900"
    style={{ minHeight: 320 }}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      {SURFACES.map((variant) => (
        <div key={variant} className="flex min-w-0 flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {variant}
          </span>
          <AccessMatrix
            permissions={PERMISSIONS}
            variant={variant}
            tone="indigo"
            density="compact"
            striped={false}
            className="min-w-0"
          />
        </div>
      ))}
    </div>
  </div>
);

export default Surfaces;
