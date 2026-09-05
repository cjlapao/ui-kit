import { ScrollArea } from "@cjlapao/ui-kit";

const CITIES: Array<[string, string, number, number]> = [
  ["New York", "NY", 8419600, 783.8],
  ["Los Angeles", "CA", 3980400, 1214.9],
  ["Chicago", "IL", 2716000, 589.6],
  ["Houston", "TX", 2328000, 1651.1],
  ["Phoenix", "AZ", 1690000, 1340.6],
  ["Philadelphia", "PA", 1584200, 369.6],
  ["San Antonio", "TX", 1547200, 1194.0],
  ["San Diego", "CA", 1423800, 964.5],
  ["Dallas", "TX", 1341100, 882.9],
  ["San Jose", "CA", 1035300, 469.7],
  ["Austin", "TX", 1010000, 704.0],
  ["Jacksonville", "FL", 949600, 2265.3],
  ["Columbus", "OH", 905700, 577.9],
  ["Charlotte", "NC", 885700, 771.0],
  ["Boston", "MA", 675600, 232.1],
];

/**
 * Content overflowing both axes gets both bars — and the corner square only
 * appears where they meet. The sticky header rides the vertical scroll while
 * the columns slide under it.
 */
export default function BothScrollbars() {
  return (
    <ScrollArea className="mx-auto h-80 w-full max-w-sm rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[36rem] text-sm">
        <thead className="sticky top-0 z-10 bg-neutral-100 dark:bg-neutral-800">
          <tr>
            {["City", "State", "Population", "Area (km²)"].map((label) => (
              <th
                key={label}
                className="whitespace-nowrap border-b border-neutral-200 px-4 py-2 text-left font-mono text-xs font-light uppercase dark:border-neutral-700"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CITIES.map(([city, state, population, area]) => (
            <tr key={city} className="odd:bg-neutral-50 dark:odd:bg-neutral-800/40">
              <td className="whitespace-nowrap border-b border-neutral-100 px-4 py-2 font-medium dark:border-neutral-800">{city}</td>
              <td className="border-b border-neutral-100 px-4 py-2 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">{state}</td>
              <td className="border-b border-neutral-100 px-4 py-2 tabular-nums dark:border-neutral-800">{population.toLocaleString()}</td>
              <td className="border-b border-neutral-100 px-4 py-2 tabular-nums dark:border-neutral-800">{area.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
