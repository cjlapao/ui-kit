import { Button, Popover } from "@cjlapao/ui-kit";

const NonDismissable = () => (
  <div className="flex flex-col items-center gap-2">
    <Popover
      trigger={<Button color="amber" size="sm">Open</Button>}
      variant="elevated"
      tone="amber"
      dismissable={false}
    >
      <div className="space-y-1.5">
        <p className="text-sm font-semibold">Non-dismissable</p>
        <p className="text-xs leading-5 text-neutral-600 dark:text-neutral-300">
          Clicking outside leaves this panel open — only the trigger (or
          Escape) closes it. That is{" "}
          <code className="font-mono">dismissable={"{false}"}</code>, PrimeVue
          's non-dismissable popover.
        </p>
      </div>
    </Popover>
    <span className="text-xs opacity-70">outside clicks are ignored</span>
  </div>
);

export default NonDismissable;
