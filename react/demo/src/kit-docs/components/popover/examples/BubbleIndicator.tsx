import { Button, Popover } from "@cjlapao/ui-kit";

/** The variants that best show the two indicator styles side by side. */
const VARIANTS = [
  { variant: "elevated", tone: "neutral" },
  { variant: "tonal", tone: "cyan" },
  { variant: "glass", tone: "cyan" },
  { variant: "liquid-glass", tone: "cyan" },
] as const;

const BubbleIndicator = () => (
  <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-4">
    {VARIANTS.map(({ variant, tone }) => (
      <div key={variant} className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          <Popover
            trigger={<Button color={tone} size="xs">arrow</Button>}
            variant={variant}
            tone={tone}
            padding="sm"
          >
            <p className="text-xs leading-5 text-neutral-700 dark:text-neutral-200">
              The speech-bubble arrow joins the panel to its trigger.
            </p>
          </Popover>
          <Popover
            trigger={<Button color={tone} size="xs">bubble</Button>}
            variant={variant}
            tone={tone}
            padding="sm"
            arrow="bubble"
          >
            <p className="text-xs leading-5 text-neutral-700 dark:text-neutral-200">
              The detached dot floats in the gap — the edge stays unbroken.
            </p>
          </Popover>
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {variant}
        </span>
      </div>
    ))}
  </div>
);

export default BubbleIndicator;
