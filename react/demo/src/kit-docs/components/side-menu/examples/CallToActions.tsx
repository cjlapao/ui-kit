import { useState } from "react";
import { SideMenu } from "@cjlapao/ui-kit";
import { DEMO_CTAS, MINI_ITEMS } from "../demoData";

export default function CallToActions() {
  // The kit only calls onDismiss — persistence is the app's. Here the
  // dismissed slugs live in component state.
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const ctas = DEMO_CTAS.filter((cta) => !dismissed.has(cta.slug)).map(
    (cta) =>
      cta.onDismiss
        ? {
            ...cta,
            onDismiss: () =>
              setDismissed((prev) => new Set(prev).add(cta.slug)),
          }
        : cta,
  );

  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="violet"
          title="Upgrades"
          items={MINI_ITEMS}
          ctas={ctas}
        />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Pitch cards — media, title, description and one action — are
            pinned under the navigation. The stack is taller than the
            zone&apos;s cap, so the zone scrolls on its own while the nav
            keeps its own scroll. The capacity card&apos;s ✕ opts in through{" "}
            <code>onDismiss</code>: dismissed slugs are kept in component
            state, so it is gone for good.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
