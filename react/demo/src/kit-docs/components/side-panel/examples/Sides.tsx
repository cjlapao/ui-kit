import { SidePanel } from "@cjlapao/ui-kit";

/**
 * The panel docks to either edge. It is `position: absolute`, so it fills the
 * container it is placed in — the bordered boxes here — rather than the
 * viewport, and needs a positioned ancestor.
 *
 * Overlaying rather than occupying a column is the point: opening it never
 * reflows the content beside it, so nothing jumps.
 */
export default function Sides() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["right", "left"] as const).map((side) => (
        <div
          key={side}
          className="relative h-56 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700"
        >
          <div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">
            Docked {side}
          </div>
          <SidePanel isOpen side={side} title={side} width={180}>
            <div className="p-4 text-sm">Panel body</div>
          </SidePanel>
        </div>
      ))}
    </div>
  );
}
