import { SidePanel } from "@cjlapao/ui-kit";

/**
 * The surface family is `SideMenu`'s, not `Panel`'s — a docked panel and a
 * docked menu are the same object with different content, and dressing them
 * from two vocabularies made them look like unrelated components.
 *
 * `floating` and `floating-glass` bring the detached-card geometry: the panel
 * lifts off the top and bottom while staying flush to its own edge, and rounds
 * the two corners facing the content — the other two meet the container and
 * have nothing to round against. That comes from the variant's own tokens, so
 * they are inset by default exactly as they are on `SideMenu`; `inset` sets it
 * explicitly on any variant, in either direction, and `radius` sizes the
 * corners.
 */
export default function Floating() {
  const variants = ["sidebar", "floating", "floating-glass"] as const;

  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {variants.map((variant) => (
        <div
          key={variant}
          className="relative h-56 overflow-hidden rounded-lg border border-neutral-200 bg-gradient-to-br from-sky-100 to-violet-100 dark:border-neutral-700 dark:from-sky-950 dark:to-violet-950"
        >
          <div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">
            {variant}
          </div>
          <SidePanel isOpen variant={variant} title={variant} width={150}>
            <div className="p-4 text-sm">Panel body</div>
          </SidePanel>
        </div>
      ))}
    </div>
  );
}
