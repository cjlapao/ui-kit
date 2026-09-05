import React, { useState } from "react";
import { ScrollArea, type ScrollAreaVariant } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { scrollAreaVariantOptions } from "../../shared/options";

const CITIES = ["Tokyo", "Delhi", "Shanghai", "Dhaka", "São Paulo", "Mexico City", "Cairo", "Beijing", "Mumbai", "Osaka", "New York", "Karachi", "Chongqing", "Kinshasa", "Lagos", "Bengaluru"];

const TILES: Array<[string, string]> = [
  ["from-indigo-400 to-sky-400", "North shore"],
  ["from-fuchsia-400 to-rose-400", "Salt flats"],
  ["from-emerald-400 to-teal-500", "Pine ridge"],
  ["from-amber-400 to-orange-500", "Canyon rim"],
  ["from-violet-400 to-purple-500", "Lavender fields"],
];

export const ScrollAreaPlayground: React.FC = () => {
  const [variant, setVariant] = useState<ScrollAreaVariant>("auto");
  const [mask, setMask] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "surface",
                title: "Behaviour",
                controls: (
                  <>
                    <SelectControl label="Variant" options={scrollAreaVariantOptions} value={variant}
                      onChange={(v) => setVariant(v as ScrollAreaVariant)} />
                    <ToggleRow label="mask — edge fade" checked={mask} onChange={setMask} />
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Scrolling itself stays native — wheel, touch and the keyboard (the
            viewport is focusable only while content overflows) behave exactly
            as the browser does; only the bars are drawn. Try{" "}
            <code>auto</code> then drag inside, and the bar appears, lingers,
            and fades.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col items-center gap-6">
          <div className="w-full max-w-56">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
              Vertical
            </div>
            <ScrollArea className="h-56" variant={variant} mask={mask}>
              <div className="space-y-2 pr-2">
                {CITIES.map((city) => (
                  <span key={city} className="block text-sm">{city}</span>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
              Horizontal
            </div>
            <ScrollArea variant={variant} mask={mask} className="w-full">
              <div className="flex gap-4 p-1">
                {TILES.map(([gradient, title]) => (
                  <figure key={title} className="shrink-0">
                    <div className={`h-28 w-56 rounded-lg bg-gradient-to-br ${gradient}`} />
                    <figcaption className="mt-1 text-xs opacity-60">{title}</figcaption>
                  </figure>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      }
    />
  );
};
