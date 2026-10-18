import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

/**
 * The signature behaviour: in `stacked` mode newer toasts pile up as a deck —
 * each card clipped to the front card's height, offset and scaled back. Hover
 * (or focus, or press) the deck and it fans out to full height. `expanded`
 * mode keeps the fan-out permanent.
 */
export default function StackedAndExpanded() {
  return (
    <ToastProvider>
      <ToastViewport
        group="ex-toast-stacked"
        position="bottom-left"
        mode="stacked"
      />
      <ToastViewport
        group="ex-toast-expanded"
        position="bottom-right"
        mode="expanded"
      />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  const raise = (group: string) => {
    toast.show({ group, intent: "info", title: "Job queued" });
    toast.show({ group, intent: "success", title: "Queue accepted" });
    toast.show({ group, intent: "warning", title: "Slow worker detected" });
    toast.show({ group, intent: "danger", title: "Worker timeout" });
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="soft"
          color="blue"
          onClick={() => raise("ex-toast-stacked")}
        >
          Stack toasts (bottom left)
        </Button>
        <Button
          size="sm"
          variant="soft"
          color="violet"
          onClick={() => raise("ex-toast-expanded")}
        >
          Expand toasts (bottom right)
        </Button>
      </div>
      <p className="text-xs opacity-60">
        Left: the deck folds back down when the pointer leaves. Right: the
        same deck, but `mode="expanded"` keeps every card at full height. The
        deck only shows the three newest — older ones stay hidden until the
        cards in front of them leave.
      </p>
    </div>
  );
}
