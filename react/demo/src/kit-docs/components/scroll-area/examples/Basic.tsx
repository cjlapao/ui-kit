import { ScrollArea } from "@cjlapao/ui-kit";

const CITIES: Array<[string, number]> = [
  ["Tokyo", 37.1], ["Delhi", 32.9], ["Shanghai", 29.2], ["Dhaka", 23.2],
  ["São Paulo", 22.6], ["Mexico City", 22.3], ["Cairo", 22.1], ["Beijing", 21.8],
  ["Mumbai", 21.3], ["Osaka", 19.0], ["New York", 18.9], ["Karachi", 17.1],
  ["Chongqing", 16.9], ["Kinshasa", 16.3], ["Lagos", 15.9], ["Bengaluru", 14.8],
  ["Istanbul", 15.8], ["Kolkata", 15.1], ["Manila", 14.2], ["Tianjin", 13.9],
  ["Rio de Janeiro", 13.5], ["Guangzhou", 13.9], ["Moscow", 12.6], ["Lima", 11.0],
  ["Jakarta", 11.2], ["London", 9.6], ["Paris", 9.0], ["Seoul", 9.4],
  ["Chicago", 8.9], ["Toronto", 6.3],
];

/**
 * A scrollable region whose bars are drawn by the component, not the
 * browser: the native scrollbar is hidden, and a thin virtual bar tracks
 * the visible fraction — identical in every browser, and shown only when
 * wanted. Give the area a height with `className`.
 */
export default function Basic() {
  return (
    <div className="w-full max-w-56">
      <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
        Metropolitan areas (millions)
      </div>
      <ScrollArea className="h-72">
        <div className="space-y-2 pr-2">
          {CITIES.map(([city, people]) => (
            <span key={city} className="flex items-end gap-0.5">
              <span className="text-sm">{city}</span>
              <span className="mb-px font-mono text-[11px] tracking-tighter text-neutral-400 dark:text-neutral-500">
                ({people})
              </span>
            </span>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
