import { Button, Popover } from "@cjlapao/ui-kit";

const Basic = () => (
  <Popover
    trigger={<Button color="blue" size="sm">Toggle</Button>}
    variant="elevated"
    tone="blue"
  >
    <div className="space-y-1.5">
      <p className="text-sm font-semibold">Popover</p>
      <p className="text-xs text-neutral-600 dark:text-neutral-300">
        A small panel anchored to the trigger, with an arrow pointing at it.
        Click outside or press Escape to close.
      </p>
    </div>
  </Popover>
);

export default Basic;
