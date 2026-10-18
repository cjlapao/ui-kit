import { ProgressSpinner } from "@cjlapao/ui-kit";

const TONES = [
  "blue",
  "emerald",
  "amber",
  "rose",
  "violet",
  "cyan",
  "orange",
] as const;

export const Tones = () => (
  <div className="flex flex-wrap items-center gap-4">
    {TONES.map((color) => (
      <ProgressSpinner key={color} color={color} size="lg" ariaLabel={`Tone ${color}`} />
    ))}
  </div>
);

export default Tones;
