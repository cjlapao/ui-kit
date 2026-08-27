import React from "react";
import { AccessMatrix } from "@cjlapao/ui-kit";
import type { AccessMatrixPermission } from "@cjlapao/ui-kit";

/** One flat list is all the component needs: a row per
 *  (group, resource, action) triple. The action columns and the
 *  collapsible group rows are derived automatically. */
const PERMISSIONS: AccessMatrixPermission[] = [
  { group: "Owners", resource: "Documents", action: "View", enabled: true },
  { group: "Owners", resource: "Documents", action: "Edit", enabled: true },
  { group: "Owners", resource: "Documents", action: "Delete", enabled: true },
  { group: "Owners", resource: "Projects", action: "View", enabled: true },
  { group: "Owners", resource: "Projects", action: "Edit", enabled: true },
  { group: "Owners", resource: "Projects", action: "Delete", enabled: false },

  { group: "Editors", resource: "Documents", action: "View", enabled: true },
  { group: "Editors", resource: "Documents", action: "Edit", enabled: true },
  { group: "Editors", resource: "Documents", action: "Delete", enabled: false },
  { group: "Editors", resource: "Projects", action: "View", enabled: true },
  { group: "Editors", resource: "Projects", action: "Edit", enabled: false },
  { group: "Editors", resource: "Projects", action: "Delete", enabled: false },

  { group: "Viewers", resource: "Documents", action: "View", enabled: true },
  { group: "Viewers", resource: "Documents", action: "Edit", enabled: false },
  { group: "Viewers", resource: "Documents", action: "Delete", enabled: false },
  { group: "Viewers", resource: "Projects", action: "View", enabled: true },
  { group: "Viewers", resource: "Projects", action: "Edit", enabled: false },
  { group: "Viewers", resource: "Projects", action: "Delete", enabled: false },
];

export const Basic: React.FC = () => (
  <AccessMatrix permissions={PERMISSIONS} />
);

export default Basic;
