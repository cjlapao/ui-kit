import { TRUE_COLORS, Hero } from "@cjlapao/ui-kit";

/**
 * The gradient stops are the tone's own **700 and 800** shades, read from
 * Tailwind's palette variables. They used to be a hand-written table of 21
 * pairs in which every tone bled into its neighbour — `sky` painted
 * sky→indigo, `red` painted red→rose — and the light end sat at `-400`, where
 * the white copy this component insists on measures 2.94:1 on yellow.
 */
export default function Tones() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TRUE_COLORS.map((tone) => (
        <Hero key={tone} tone={tone} title={tone} subtitle="White on -700" icon="Rocket" />
      ))}
    </div>
  );
}
