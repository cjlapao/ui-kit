import React from "react";
import { AccessMatrix } from "@cjlapao/ui-kit";
import type { AccessMatrixPermission } from "@cjlapao/ui-kit";

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

/** group → resource → allowed actions (missing = nothing). */
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

/** With 7 groups and `limit={3}` the last four sit behind the "show more"
 *  button. Clicking a group header row collapses its resources. */
export const CollapseAndLimit: React.FC = () => (
  <AccessMatrix permissions={PERMISSIONS} limit={3} striped bordered />
);

export default CollapseAndLimit;
