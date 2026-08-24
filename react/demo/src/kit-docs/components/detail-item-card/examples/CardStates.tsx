import { useState } from "react";
import { DetailItemCard, Pill } from "@cjlapao/ui-kit";

export default function CardStates() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex w-full flex-col gap-4">
      <DetailItemCard
        variant="outlined"
        tone="emerald"
        title="clickable-row"
        subtitle="Selected when clicked"
        icon="Rocket"
        defaultExpanded
        onClick={() => setSelected("clickable-row")}
      >
        <p>
          With onClick the whole row is a keyboard-reachable button — tab to
          it and press Enter. Expanding never triggers it.
        </p>
      </DetailItemCard>
      {selected && (
        <p className="text-xs opacity-70">Last selected: {selected}.</p>
      )}
      <DetailItemCard
        variant="outlined"
        tone="slate"
        title="disabled-row"
        subtitle="Cannot be activated"
        icon="Container"
        disabled
        onClick={() => setSelected("disabled-row")}
      />
      <DetailItemCard
        variant="outlined"
        tone="blue"
        title="no-detail"
        subtitle="No children, so no toggle"
        icon="Database"
        badges={
          <Pill tone="emerald" size="xs">
            Healthy
          </Pill>
        }
      />
    </div>
  );
}
