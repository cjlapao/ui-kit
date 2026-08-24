import { CollapsibleHelpText, Panel } from "@cjlapao/ui-kit";

const COPY =
  "Session keys rotate every 30 days. After a rotation, older sessions keep working until they expire, so no one is signed out mid-task.";

export default function InsideGlassPanel() {
  return (
    <div className="w-full">
      <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
        <Panel variant="liquid-glass" tone="emerald" padding="sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold">Session keys</p>
            <p className="text-sm opacity-80">
              A <code>liquid-glass</code> variant blends into the panel it
              lives in, while <code>plain</code> has no card of its own and
              inherits the surface — including its copy colours.
            </p>
            <CollapsibleHelpText
              text={COPY}
              tone="emerald"
              variant="liquid-glass"
              padding="sm"
            />
            <CollapsibleHelpText
              title="Plain, always-visible children below"
              text={COPY}
              tone="emerald"
              variant="plain"
            >
              <span>
                Extra content passed as <code>children</code> — always visible,
                whether or not the summary is expanded.
              </span>
            </CollapsibleHelpText>
          </div>
        </Panel>
      </div>
    </div>
  );
}
