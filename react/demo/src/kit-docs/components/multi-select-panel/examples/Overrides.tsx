import React from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

const OPTIONS: MultiSelectPanelOption[] = [
  {
    value: "grouped",
    title: "Follows the group",
    subtitle: "Elevated, blue, small padding — the props on the group",
    icon: "File",
  },
  {
    value: "tonal",
    title: "Its own tone",
    subtitle: "tone=\"emerald\" moves the box accent, the rim and the wash together",
    icon: "Database",
    tone: "emerald",
    labels: ["Emerald"],
  },
  {
    value: "glass",
    title: "Its own surface, corner and box",
    subtitle:
      "variant=\"glass\" with a larger corner and a ghost checkbox box, chosen per option while the rest of the group stays elevated",
    icon: "Cache",
    variant: "glass",
    corner: "rounded-md",
    padding: "md",
    checkboxVariant: "ghost",
    labels: ["Glass", "Ghost box", "Wide padding"],
  },
  {
    value: "pulsing",
    title: "Pulsing and off",
    subtitle: "pulse glows from the rim; disabled beside it is inert and never submits",
    icon: "Shield",
    pulse: true,
    disabled: true,
  },
];

/**
 * Every card takes the group's surface props as defaults and may outvote them
 * one at a time: `variant`, `tone`, `corner`, `padding`, `pulse` and
 * `checkboxVariant` per option. The group's `tone` also drives the checkbox
 * box, so a card and its box never disagree. The fourth card is disabled —
 * dimmed, unfocusable, and absent from a submitted form.
 */
export const Overrides: React.FC = () => (
  <div className="w-full space-y-4">
    <MultiSelectPanel
      name="surfaces"
      label="Surfaces"
      description="Group defaults below; three cards override them."
      columns={2}
      variant="tonal"
      tone="blue"
      corner="rounded-sm"
      padding="sm"
      checkboxVariant="flat"
      labelVariant="outline"
      labelTone="amber"
      defaultValue={["tonal"]}
      options={OPTIONS}
    />
    <p className="text-xs opacity-70">
      The third card carries a subtitle long enough to wrap, and the row is
      still two cards of the same height — <code>grid-auto-rows</code> gives
      every row one height, so nothing hangs below its neighbours.
    </p>
  </div>
);

export default Overrides;
