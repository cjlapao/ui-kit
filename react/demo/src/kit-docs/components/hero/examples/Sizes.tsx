import { CONTROL_SIZES, Hero } from "@cjlapao/ui-kit";

/**
 * Title, subtitle and the icon chip all move together on the shared control
 * scale. The subtitle's own scale used to stop at `md`, and the chip was
 * pinned at 48px whatever the type did.
 */
export default function Sizes() {
  return (
    <div className="flex w-full flex-col gap-3">
      {CONTROL_SIZES.map((size) => (
        <Hero
          key={size}
          tone="emerald"
          titleSize={size}
          subtitleSize={size}
          padding={size}
          title={`titleSize="${size}"`}
          subtitle="The chip scales with the type."
          icon="Rocket"
        />
      ))}
    </div>
  );
}
