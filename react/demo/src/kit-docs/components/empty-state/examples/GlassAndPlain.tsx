import { EmptyState, Panel } from "@cjlapao/ui-kit";

const GlassAndPlain = () => (
  <div className="grid w-full gap-4 md:grid-cols-2">
    <div className="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <Panel variant="liquid-glass" tone="blue" padding="md">
        <EmptyState
          variant="glass"
          tone="blue"
          size="sm"
          icon="CloudOff"
          title="Connection lost"
          subtitle="The cluster is unreachable. Check the network and try again."
          actionLabel="Reconnect"
          onAction={() => undefined}
          vibrancy="high"
          specularMode="classic"
          fullWidth
        />
      </Panel>
    </div>
    <Panel variant="outlined" tone="neutral" padding="md">
      <EmptyState
        variant="plain"
        tone="emerald"
        size="sm"
        icon="Container"
        title="No containers yet"
        subtitle="This panel owns the surface — the empty state draws no card of its own."
        actionLabel="Pull image"
        actionColor="emerald"
        onAction={() => undefined}
        fullWidth
      />
    </Panel>
  </div>
);

export default GlassAndPlain;
