import { GradientBackdrop, Panel, Pill } from "@cjlapao/ui-kit";

/**
 * The job it was made for: a page-sized backdrop that glass surfaces can be
 * read against. It follows the page's dark mode on its own (`scheme="auto"`).
 */
export default function BehindGlass() {
  return (
    <GradientBackdrop theme="fog" className="grid w-full gap-4 rounded-xl p-6 sm:grid-cols-2">
      <Panel variant="glass" title="Deploys" subtitle="Last 24 hours">
        <div className="flex gap-2">
          <Pill size="sm" variant="soft" tone="emerald">12 passed</Pill>
          <Pill size="sm" variant="soft" tone="rose">1 failed</Pill>
        </div>
      </Panel>
      <Panel variant="liquid-glass" title="Incidents" subtitle="None open">
        <p className="text-sm">All systems operational.</p>
      </Panel>
    </GradientBackdrop>
  );
}
