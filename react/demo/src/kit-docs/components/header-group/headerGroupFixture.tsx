import React from "react";
import { Badge, Button, CustomIcon, IconButton } from "@cjlapao/ui-kit";

/**
 * The four clusters the Header Group stage renders.
 *
 * One module, one copy: the preview mounts these elements and the Code view
 * prints them (`h.jsx` in the config's data source), so the snippet cannot drift
 * from the pixels. Each `label` becomes the group's `label` prop, which
 * `HeaderGroup.tsx:151` turns into `aria-label` under `role="group"` — the
 * clusters are named because an unnamed group is usually skipped.
 */
export interface Cluster {
  label: string;
  content: React.ReactNode;
}

export const CLUSTERS: Cluster[] = [
  {
    label: "Navigation",
    content: (
      <>
        <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
        <IconButton
          icon="ArrowRight"
          variant="ghost"
          size="xs"
          srLabel="Forward"
        />
      </>
    ),
  },
  {
    label: "View",
    content: (
      <>
        <CustomIcon icon="ViewGrid" size="sm" tone="blue" />
        <span className="text-sm font-medium">Grid</span>
      </>
    ),
  },
  {
    label: "Alerts",
    content: (
      <>
        <CustomIcon icon="Notification" size="sm" tone="blue" />
        <Badge count={4} tone="rose" size="xs" />
      </>
    ),
  },
  {
    label: "Actions",
    content: (
      <Button size="xs" variant="soft" color="blue">
        Deploy
      </Button>
    ),
  },
];

/** Components the clusters mount — the Code view's import list. */
export const CLUSTER_NAMES = { Badge, Button, CustomIcon, IconButton };
