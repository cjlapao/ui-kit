import { GLOW_INTENSITIES, SearchBar } from "@cjlapao/ui-kit";

export default function GlowIntensities() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {GLOW_INTENSITIES.map((glowIntensity) => (
        <div key={glowIntensity} className="flex flex-col gap-2">
          <SearchBar
            variant="gradient"
            color="indigo"
            glowIntensity={glowIntensity}
            onSearch={() => {}}
          />
          <span className="text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {glowIntensity}
          </span>
        </div>
      ))}
    </div>
  );
}
