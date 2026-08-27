import { ApiErrorState } from "@cjlapao/ui-kit";

/**
 * Everything the kind decides is a *default*. `tone`, `icon`, `title` and
 * `subtitle` are ordinary props — they used to be hardcoded and hidden behind
 * the wrapper, so a permission error had to be painted rose and drawn as a
 * disconnected cloud.
 */
export default function Overrides() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <ApiErrorState
        kind="forbidden"
        size="sm"
        tone="violet"
        icon="Key"
        title="Workspace locked"
        subtitle="Ask an owner to grant you access to this workspace."
        buttonText="Request access"
        onRetry={() => {}}
      />
      <ApiErrorState
        kind="rateLimited"
        size="sm"
        variant="tonal"
        dashed={false}
        title="Slow down"
        subtitle="You've made too many requests. Try again in about a minute."
      />
    </div>
  );
}
