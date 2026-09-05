import { ScrollArea } from "@cjlapao/ui-kit";

const TILES: Array<[string, string]> = [
  ["from-indigo-400 to-sky-400", "North shore"],
  ["from-fuchsia-400 to-rose-400", "Salt flats"],
  ["from-emerald-400 to-teal-500", "Pine ridge"],
  ["from-amber-400 to-orange-500", "Canyon rim"],
  ["from-violet-400 to-purple-500", "Lavender fields"],
  ["from-cyan-400 to-blue-500", "Harbour fog"],
];

/**
 * Content wider than the frame brings the horizontal bar to life — it
 * appears on the same rules as the vertical one, and the two share the
 * corner square when both are up.
 */
export default function Horizontal() {
  return (
    <ScrollArea className="mx-auto w-full max-w-md">
      <div className="flex gap-4 p-3">
        {TILES.map(([gradient, title]) => (
          <figure key={title} className="shrink-0">
            <div className={`h-40 w-72 rounded-lg bg-gradient-to-br ${gradient}`} />
            <figcaption className="mt-2 text-xs">
              <span className="opacity-60">Shot at</span>{" "}
              <span className="font-medium">{title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </ScrollArea>
  );
}
