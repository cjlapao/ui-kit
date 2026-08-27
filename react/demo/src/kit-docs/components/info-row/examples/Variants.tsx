import { INFO_ROW_VARIANTS, InfoRow } from "@cjlapao/ui-kit";

/**
 * `plain` draws no surface of its own — just the hairline — which is what a row
 * inside a card the app already owns wants. Every other member renders a
 * `Panel`, so the row can also stand on its own.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {INFO_ROW_VARIANTS.map((variant) => (
        <InfoRow
          key={variant}
          variant={variant}
          tone="violet"
          label={variant}
          value="eu-west-1"
        />
      ))}
    </div>
  );
}
