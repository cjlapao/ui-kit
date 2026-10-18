import { useRef } from "react";
import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

/**
 * A live toast: `loading` swaps the icon for a spinner, `progress` renders a
 * labelled progress bar under the copy, and `toast.update` moves both — no
 * remount, the card (and its position in the deck) is preserved.
 */
export default function ProgressAndLoading() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-progress" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();
  const timer = useRef<number | null>(null);

  const start = () => {
    const id = toast.show({
      intent: "info",
      title: "Downloading build",
      detail: "0%",
      loading: true,
      progress: 0,
      sticky: true,
    });

    let value = 0;
    timer.current = window.setInterval(() => {
      value = Math.min(100, value + Math.ceil(Math.random() * 18));
      if (value < 100) {
        toast.update(id, { progress: value, detail: `${value}%` });
        return;
      }
      if (timer.current !== null) window.clearInterval(timer.current);
      toast.update(id, {
        intent: "success",
        title: "Download complete",
        detail: "build-482.tar.zst",
        loading: false,
        progress: 100,
        life: 4000,
      });
    }, 500);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <Button variant="solid" color="blue" onClick={start}>
        Start a download
      </Button>
      <p className="text-xs opacity-60">
        The card shows a spinner and a progress bar while it works, then the
        same card turns green when the work finishes.
      </p>
    </div>
  );
}
