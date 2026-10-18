import { StatCard, STAT_CARD_LOADERS } from "@cjlapao/ui-kit";

/**
 * The three loader treatments, `skeleton` by default. The skeleton is shaped
 * like the card's own header and figure, so the grid keeps its layout instead
 * of reflowing when the data lands — the spinner and progress types still
 * cover the card, which is right when you want the previous value to stay
 * readable underneath.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARD_LOADERS.map((loaderType) => (
        <StatCard
          key={loaderType}
          label={loaderType}
          value="1.42M"
          icon="Database"
          subtitle="loading"
          loading
          loaderType={loaderType}
          progress={40}
        />
      ))}
      <StatCard
        label="Failed"
        value="—"
        icon="Database"
        error={{ message: "Registry unreachable", onRetry: () => {} }}
      />
    </div>
  );
}
