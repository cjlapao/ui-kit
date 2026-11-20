import { AiRobot, GridBackground, Panel } from "@cjlapao/ui-kit";

/**
 * What `AgentMap` draws with `grid={{ pattern: "dots" }}`: the lattice is
 * atmosphere, not content — dots on the crossings read as a coordinate field
 * under the hubs, and stay out of the way of whatever floats above them.
 */
export default function BehindSurface() {
  return (
    <div className="relative h-56 w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <GridBackground
        pattern="dots"
        size={20}
        dotSize={1.25}
        lineColor="var(--color-cyan-500)"
        opacity={0.5}
        fade="radial"
        fadeStart={20}
      />
      <div className="relative flex h-full items-center justify-center gap-3 p-4">
        <Panel variant="elevated" corner="rounded-lg" padding="sm">
          <div className="flex items-center gap-3">
            <AiRobot size={28} tone="cyan" />
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Builder
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Implementing checkout
              </p>
            </div>
          </div>
        </Panel>
        <Panel variant="elevated" corner="rounded-lg" padding="sm">
          <div className="flex items-center gap-3">
            <AiRobot size={28} tone="amber" paused />
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Reviewer
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Waiting for approval
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
