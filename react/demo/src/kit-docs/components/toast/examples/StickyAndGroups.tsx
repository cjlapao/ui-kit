import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

/**
 * `sticky` (or `life: 0`) opts a toast out of the auto-dismiss timer, and
 * `group` lets one action clear a whole batch — the classic "all downloads"
 * pattern.
 */
export default function StickyAndGroups() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-groups" position="bottom-right" />
      <ToastViewport position="top-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  const raiseGroup = () => {
    toast.show({
      group: "downloads",
      intent: "info",
      title: "design-specs.fig",
      detail: "18 MB",
      life: 8000,
    });
    toast.show({
      group: "downloads",
      intent: "info",
      title: "build-482.tar.zst",
      detail: "412 MB",
      life: 8000,
    });
    toast.show({
      group: "downloads",
      intent: "warning",
      title: "assets.zip — slow",
      detail: "11%",
      life: 8000,
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="soft"
          color="blue"
          onClick={() =>
            toast.neutral("Session note", "Sticky — it stays until dismissed.", {
              sticky: true,
            })
          }
        >
          Sticky toast
        </Button>
        <Button size="sm" variant="soft" color="violet" onClick={raiseGroup}>
          Three grouped downloads
        </Button>
        <Button
          size="sm"
          variant="outline"
          color="slate"
          onClick={() => toast.closeGroup("downloads")}
        >
          Clear the group
        </Button>
      </div>
      <p className="text-xs opacity-60">
        The sticky toast has no timer; the grouped batch disappears together
        when `closeGroup("downloads")` fires.
      </p>
    </div>
  );
}
