import React, { type ReactNode } from "react";
import { Accordion, Button, useAccordion } from "@cjlapao/ui-kit";

export interface ControlGroup {
  /** Stable id, unique within one playground. */
  id: string;
  /** Group title, e.g. "Core", "States", "Icons", "Glass". */
  title: string;
  /** Open on mount. Groups start collapsed by default. */
  defaultOpen?: boolean;
  /** The group's controls — the usual Control/SelectControl/ChoiceControl/ToggleRow nodes. */
  controls: ReactNode;
}

interface ControlAccordionProps {
  groups: ControlGroup[];
  /** Accessible name for the accordion list. */
  ariaLabel?: string;
}

/**
 * Collapsible option groups for a playground's controls column.
 *
 * Every option block of the page lives in one group; groups start
 * collapsed so the playground stays small, and the "Expand all /
 * Collapse all" button reveals every option at once. Per-group clicks
 * keep working independently (`multiple`), so a user can open just the
 * groups they care about.
 *
 * Built on the kit's own `Accordion`, so it inherits the shared surface
 * scales — outlined variant, control size, theme and glass for free.
 *
 * Pages with conditional option blocks (e.g. glass-only controls)
 * compose the `groups` array conditionally; a stale open id of a group
 * that unmounted is harmless — ids not present in `items` are ignored,
 * and the all-open state computes against the current group list.
 */
export const ControlAccordion: React.FC<ControlAccordionProps> = ({
  groups,
  ariaLabel = "Playground options",
}) => {
  const accordion = useAccordion({
    defaultOpenIds: groups
      .filter((group) => group.defaultOpen)
      .map((group) => group.id),
    multiple: true,
  });

  const allOpen =
    groups.length > 0 &&
    groups.every((group) => accordion.openIds.includes(group.id));

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button
          size="xs"
          variant="ghost"
          color="blue"
          onClick={() =>
            accordion.setOpenIds(
              allOpen ? [] : groups.map((group) => group.id),
            )
          }
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </Button>
      </div>
      <Accordion
        items={groups.map((group) => ({
          id: group.id,
          title: group.title,
          content: <div className="space-y-4">{group.controls}</div>,
        }))}
        variant="outlined"
        size="sm"
        padding="sm"
        multiple
        openIds={accordion.openIds}
        onChange={accordion.setOpenIds}
        ariaLabel={ariaLabel}
      />
    </div>
  );
};
