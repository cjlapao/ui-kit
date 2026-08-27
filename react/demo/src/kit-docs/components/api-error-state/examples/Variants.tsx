import { EMPTY_STATE_VARIANTS, ApiErrorState } from "@cjlapao/ui-kit";

/**
 * It renders `EmptyState`, so it inherits every container surface plus
 * `plain` — for an error dropped inside a card the app already owns.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {EMPTY_STATE_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {variant}
          </span>
          <ApiErrorState
            variant={variant}
            kind="server"
            size="xs"
            subtitle="The server couldn't complete the request."
            onRetry={() => {}}
          />
        </div>
      ))}
    </div>
  );
}
