/**
 * The content the playground scrolls, in one place: the preview mounts these
 * elements and the Code view prints them, so what is on screen is what is
 * printed and nothing in between can drift.
 *
 * A `ScrollArea` has no height of its own (:101-104 of `ScrollArea.tsx`), so
 * every case here is sized by what it holds, not by the frame — the frame's
 * height is the reader's `className` knob.
 */

/** Tall enough to overflow an `h-56` frame, short enough to read at a glance. */
export const CITIES = [
  "Tokyo",
  "Delhi",
  "Shanghai",
  "Dhaka",
  "São Paulo",
  "Mexico City",
  "Cairo",
  "Beijing",
  "Mumbai",
  "Osaka",
  "New York",
  "Karachi",
  "Chongqing",
  "Kinshasa",
  "Lagos",
  "Bengaluru",
];

/** A row of the city list, measured for the virtual case (`ROW_HEIGHT` below). */
export const ROW_HEIGHT = 28;

export const TILES: Array<[string, string]> = [
  ["from-indigo-400 to-sky-400", "North shore"],
  ["from-fuchsia-400 to-rose-400", "Salt flats"],
  ["from-emerald-400 to-teal-500", "Pine ridge"],
  ["from-amber-400 to-orange-500", "Canyon rim"],
  ["from-violet-400 to-purple-500", "Lavender fields"],
];

/** One axis: sixteen rows, so the vertical bar is the only thing to earn. */
export const ROWS = (
  <div className="space-y-2 pr-2">
    {CITIES.map((city) => (
      <span key={city} className="block text-sm">
        {city}
      </span>
    ))}
  </div>
);

/** The other axis: a strip wider than any frame, short enough to fit. */
export const TILES_ROW = (
  <div className="flex gap-4 p-1">
    {TILES.map(([gradient, title]) => (
      <figure key={title} className="shrink-0">
        <div
          className={"h-28 w-56 rounded-lg bg-gradient-to-br " + gradient}
        />
        <figcaption className="mt-1 text-xs opacity-60">{title}</figcaption>
      </figure>
    ))}
  </div>
);

/** Both at once: eight strips of three tiles each. */
export const GRID = (
  <div className="flex flex-col gap-3 p-1">
    {Array.from({ length: 8 }, (_unused, row) => (
      <div key={`strip-${row}`} className="flex gap-4">
        {TILES.slice(0, 3).map(([gradient, title], column) => (
          <figure key={`${title}-${column}`} className="shrink-0">
            <div
              className={"h-16 w-56 rounded-lg bg-gradient-to-br " + gradient}
            />
            <figcaption className="mt-1 text-xs opacity-60">{title}</figcaption>
          </figure>
        ))}
      </div>
    ))}
  </div>
);

/** Neither: three rows in a frame that could hold eight — no bar, no tab stop. */
export const FIT = (
  <div className="space-y-2 p-1">
    {CITIES.slice(0, 3).map((city) => (
      <span key={city} className="block text-sm">
        {city}
      </span>
    ))}
  </div>
);

/** The tag names the Code view should print for the fixtures above. */
export const FIXTURE_NAMES: Record<string, unknown> = {};
