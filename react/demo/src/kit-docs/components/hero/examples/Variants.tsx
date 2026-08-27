import { HERO_VARIANTS, Hero } from "@cjlapao/ui-kit";

/**
 * `gradient` is the saturated band the component exists for; every other
 * variant is a `Panel`, so it brings its own fill, ring and glass props — and
 * its copy comes from the surface rather than being forced to white, which is
 * what used to make the title vanish on a light card.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {HERO_VARIANTS.map((variant) => (
        <Hero
          key={variant}
          variant={variant}
          tone="violet"
          title={variant}
          subtitle="Icon, heading, supporting line"
          icon="Rocket"
          padding="md"
        />
      ))}
    </div>
  );
}
