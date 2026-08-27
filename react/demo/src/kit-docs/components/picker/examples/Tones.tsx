import { useState } from "react";
import { Picker } from "@cjlapao/ui-kit";

/**
 * Open each one: the trigger ring, the selected row and the filter chip all
 * come from tokens generated off `TRUE_COLORS`.
 *
 * The literal map this replaced spelled `red` with **rose** and `green` with
 * **emerald**. Because those literals were also what Tailwind scanned,
 * `ring-red-500/20` had never been emitted — so fixing the map alone would
 * have rendered those tones with no colour at all until the safelist gained
 * the shape too.
 */
export default function Tones() {
  const [id, setId] = useState("a");
  const items = [
    { id: "a", title: "api-gateway" },
    { id: "b", title: "worker-pool" },
  ];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["red", "green", "blue", "violet"] as const).map((color) => (
        <div key={color} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide opacity-60">{color}</span>
          <Picker items={items} color={color} selectedId={id} onSelect={(i) => setId(i.id)} />
        </div>
      ))}
    </div>
  );
}
