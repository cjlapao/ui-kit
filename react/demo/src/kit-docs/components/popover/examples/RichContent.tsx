import { Button, CustomIcon, Popover } from "@cjlapao/ui-kit";

const RichContent = () => (
  <div className="flex flex-col items-center gap-2">
    <Popover
      trigger={
        <Button color="violet" size="sm" variant="soft">
          Details
        </Button>
      }
      variant="elevated"
      tone="violet"
      maxWidth={340}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/20">
            <CustomIcon
              icon="Info"
              className="h-4 w-4 text-violet-600 dark:text-violet-300"
            />
          </span>
          <p className="text-sm font-semibold">Scheduled maintenance</p>
        </div>
        <p className="text-xs leading-5 text-neutral-600 dark:text-neutral-300">
          The API gateway will be briefly unavailable on Sunday 02:00–02:15
          UTC while we roll the new load balancer. No action is needed.
        </p>
        <div className="flex justify-end gap-2">
          <Button size="xs" variant="ghost" color="neutral">
            Dismiss
          </Button>
          <Button size="xs" variant="solid" color="violet">
            Notify me
          </Button>
        </div>
      </div>
    </Popover>
    <span className="text-xs opacity-70">
      icon, heading, copy and actions — all inside the panel
    </span>
  </div>
);

export default RichContent;
