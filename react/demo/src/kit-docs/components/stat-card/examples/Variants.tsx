import { StatCard } from "@cjlapao/ui-kit";

const VARIANTS = ["elevated", "outlined", "glass", "liquid-glass"] as const;

export const Variants = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    {VARIANTS.map((variant) => (
      <StatCard
        key={variant}
        variant={variant}
        label={`variant="${variant}"`}
        value="$1.42M"
        icon="Shop"
        tone="violet"
      />
    ))}
  </div>
);

export default Variants;
