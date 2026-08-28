import { Button, Popover } from "@cjlapao/ui-kit";

/**
 * The explicit sides always land on that side (clamped to the viewport).
 * The two `auto` triggers show the flip: the bottom one sits at the foot of
 * this 85 vh card, so when the section is in view there is never enough
 * room below it — it opens upward, and the arrow tracks it either way.
 */
const PlacementFlip = () => (
  <div className="flex h-[85vh] w-full max-w-md flex-col">
    <div className="flex flex-wrap justify-center gap-3">
      <Popover
        trigger={<Button color="blue" size="xs">top</Button>}
        placement="top"
        variant="outlined"
        tone="blue"
        padding="sm"
      >
        <p className="text-xs">Explicit top.</p>
      </Popover>
      <Popover
        trigger={<Button color="blue" size="xs">bottom</Button>}
        placement="bottom"
        variant="outlined"
        tone="blue"
        padding="sm"
      >
        <p className="text-xs">Explicit bottom.</p>
      </Popover>
      <Popover
        trigger={<Button color="blue" size="xs">left</Button>}
        placement="left"
        variant="outlined"
        tone="blue"
        padding="sm"
      >
        <p className="text-xs">Explicit left.</p>
      </Popover>
      <Popover
        trigger={<Button color="blue" size="xs">right</Button>}
        placement="right"
        variant="outlined"
        tone="blue"
        padding="sm"
      >
        <p className="text-xs">Explicit right.</p>
      </Popover>
      <Popover
        trigger={<Button color="emerald" size="xs">auto (top of card)</Button>}
        placement="auto"
        variant="outlined"
        tone="emerald"
        padding="sm"
      >
        <p className="text-xs">
          Auto: plenty of room below, so it opens downward.
        </p>
      </Popover>
    </div>
    <div className="mt-auto flex justify-center pb-2">
      <Popover
        trigger={<Button color="emerald" size="xs">auto (bottom of card)</Button>}
        placement="auto"
        variant="outlined"
        tone="emerald"
        padding="sm"
      >
        <p className="text-xs leading-5">
          Auto: there is almost no room below the card, so it flips up. The
          arrow keeps pointing at the trigger through the flip and the
          clamping — that is the placement geometry doing its job.
        </p>
      </Popover>
    </div>
  </div>
);

export default PlacementFlip;
