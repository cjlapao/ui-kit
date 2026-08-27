import React from "react";
import { AccessMatrix } from "@cjlapao/ui-kit";
import type { AccessMatrixPermission } from "@cjlapao/ui-kit";

const GROUPS = ["Admin", "Operator", "Developer", "Auditor", "Guest"];
const RESOURCES = ["Instances", "Networks", "Storage"];
const ACTIONS = ["View", "Edit", "Delete", "Export"];

/** group → allowed actions (the same grants for every resource here,
 *  which keeps the fixture short). */
const GRANTS: Record<string, string[]> = {
  Admin: ACTIONS,
  Operator: ["View", "Edit", "Export"],
  Developer: ["View", "Edit"],
  Auditor: ["View", "Export"],
  Guest: [],
};

const PERMISSIONS: AccessMatrixPermission[] = GROUPS.flatMap((group) =>
  RESOURCES.flatMap((resource) =>
    ACTIONS.map((action) => ({
      group,
      resource,
      action,
      enabled: (GRANTS[group] ?? []).includes(action),
    })),
  ),
);

/** A shorter fixture for the skeleton — two groups keep it compact. */
const LOADING_PERMS = PERMISSIONS.filter(
  (p) => p.group === "Admin" || p.group === "Operator",
);

export const States: React.FC = () => (
  <div className="grid w-full gap-4 lg:grid-cols-2">
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Loading — skeleton (try the spinner/progress loaders in the playground above)
      </span>
      <AccessMatrix
        permissions={LOADING_PERMS}
        loading
        loaderType="skeleton"
        striped
      />
    </div>
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Empty
      </span>
      <AccessMatrix permissions={[]} />
    </div>
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Full height — the header stays pinned while the body scrolls
      </span>
      <div className="h-56">
        <AccessMatrix permissions={PERMISSIONS} fullHeight striped />
      </div>
    </div>
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Transparent sticky column on a tinted surface
      </span>
      <AccessMatrix
        permissions={PERMISSIONS}
        variant="tonal"
        tone="indigo"
        striped
        stickyBackground="bg-transparent"
      />
    </div>
  </div>
);

export default States;
