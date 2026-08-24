import { SideMenu, SIDEBAR_VARIANTS } from "@cjlapao/ui-kit";
import { MINI_ITEMS } from "../demoData";

const VARIANTS = SIDEBAR_VARIANTS;

export default function Variants() {
  return (
    <div className="flex w-full max-w-5xl flex-wrap items-start justify-center gap-4">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex w-56 flex-col gap-2">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {variant}
          </span>
          <div className="h-80 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <div className="flex h-full">
              <SideMenu
                fullHeight
                variant={variant}
                title={variant.charAt(0).toUpperCase() + variant.slice(1)}
                items={MINI_ITEMS}
              />
              <div className="flex-1 p-4">
                <div className="h-20 rounded-lg bg-white/50 dark:bg-neutral-800/50" />
                <div className="mt-3 h-10 rounded-lg bg-white/30 dark:bg-neutral-800/30" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
