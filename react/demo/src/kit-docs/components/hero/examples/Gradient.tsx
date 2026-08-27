import { GLOW_INTENSITIES, Hero } from "@cjlapao/ui-kit";

/**
 * The stops are overridable, and a halo sits behind the band at the chosen
 * intensity — inset within reserved padding so an ancestor with
 * `overflow: auto` cannot clip it, the same rule the gradient inputs follow.
 *
 * Overriding the stops opts out of the contrast floor, so keep white copy in
 * mind if you reach for a light pair.
 */
export default function Gradient() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Hero
        title="Custom stops"
        subtitle="gradientFrom / gradientTo"
        icon="Rocket"
        padding="md"
        gradientFrom="var(--color-fuchsia-700)"
        gradientTo="var(--color-sky-800)"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {GLOW_INTENSITIES.map((glowIntensity) => (
          <Hero
            key={glowIntensity}
            tone="indigo"
            title={`glow: ${glowIntensity}`}
            icon="Rocket"
            padding="md"
            glowIntensity={glowIntensity}
          />
        ))}
      </div>
    </div>
  );
}
