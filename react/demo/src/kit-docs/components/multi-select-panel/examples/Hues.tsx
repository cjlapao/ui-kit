import React, { useState } from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

/**
 * One group left alone, one group told what each of its hues is for.
 *
 * The top group is the default, and the look the component has always had:
 * `tone` is the card, the selection rim, the active wash and the checkbox box,
 * all of them blue. The bottom group is the same `tone="blue"` with opinions at
 * both levels — the group puts every box in emerald, one card takes its own
 * selection hue in amber and its attention call in rose, and another card
 * outvotes the group on its box alone.
 *
 * None of it is carried by colour alone. The selection is an outline plus the
 * tick and `aria-checked`, and the pulse survives `prefers-reduced-motion` as a
 * static inner glow, so a hue that disagrees still means what it meant.
 */
const OPTIONS: MultiSelectPanelOption[] = [
  {
    value: "fast",
    title: "Fast",
    subtitle: "One token stream, no tools",
    icon: "Gauge",
  },
  {
    value: "research",
    title: "Research",
    subtitle: "Searches, cites, takes its time",
    icon: "Search",
    labels: ["Beta"],
  },
  {
    value: "priority",
    title: "Priority queue",
    subtitle: "Runs ahead of the others",
    icon: "Rocket",
    labels: ["Paid"],
    // The card with opinions of its own: selected in amber, asking in rose. It
    // is the only card pulsing, so the call stays a single voice.
    activeTone: "amber",
    pulse: true,
    pulseTone: "rose",
  },
  {
    value: "endpoint",
    title: "Custom endpoint",
    subtitle: "Bring your own base URL",
    icon: "Globe",
    // Outvotes the group's `checkboxTone` for this box only.
    checkboxTone: "violet",
  },
];

export const HuesExample: React.FC = () => {
  const [auto, setAuto] = useState<string[]>(["research", "priority"]);
  const [own, setOwn] = useState<string[]>(["research", "priority"]);

  return (
    <div className="flex flex-col gap-6">
      <MultiSelectPanel
        name="hues_auto"
        label="One hue for everything"
        description="The default: tone is the card, its rim when selected, the wash and the box."
        options={OPTIONS}
        value={auto}
        onChange={setAuto}
        columns={2}
        variant="tonal"
        tone="blue"
      />
      <MultiSelectPanel
        name="hues_own"
        label="Each hue to its own job"
        description="Group checkboxTone emerald; the Priority card selected in amber and pulsing in rose; the last card keeping its own box."
        options={OPTIONS}
        value={own}
        onChange={setOwn}
        columns={2}
        variant="tonal"
        tone="blue"
        checkboxTone="emerald"
      />
    </div>
  );
};

export default HuesExample;
