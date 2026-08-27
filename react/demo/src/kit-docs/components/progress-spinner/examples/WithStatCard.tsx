import { StatCard } from "@cjlapao/ui-kit";

export const WithStatCard = () => (
  // The PrimeVue showcase, straight from the kit: the dark `gradient` wash,
  // white copy, and a bottom-right `progress` spinner tinted by the tone.
  <StatCard
    gradient
    tone="emerald"
    size="xl"
    corner="rounded-xl"
    progress
    className="min-h-80 w-full max-w-xs"
    label="Game completed"
    value={
      <>
        100<span className="text-2xl align-baseline">%</span>
      </>
    }
  >
    <div className="text-sm">
      <div className="truncate text-white/90">
        The legend of <span className="font-semibold">Zelda</span>
      </div>
      <div className="text-white/60">Tears of the Kingdom</div>
    </div>
  </StatCard>
);

export default WithStatCard;
