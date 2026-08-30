import { useState } from "react";
import {
  Button,
  ToastProvider,
  ToastViewport,
  useToast,
} from "@cjlapao/ui-kit";

/**
 * Toasts take the message as a first-class citizen: an `onClick` on the card
 * body, a row of action buttons, and a custom icon in place of the intent
 * glyph. Action clicks stop propagation, so a Retry does not also fire the
 * card's onClick.
 */
export default function ActionsAndCustom() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-actions" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();
  const [retries, setRetries] = useState(0);

  const show = () => {
    toast.show({
      group: "ex-toast-actions",
      intent: "warning",
      title: "Sync stalled",
      detail: `Last retry ${retries === 0 ? "never" : `#${retries}`}`,
      icon: "Chat",
      life: 10000,
      onClick: () => setRetries((n) => n + 1),
      actions: [
        {
          label: "Retry",
          onClick: () => setRetries((n) => n + 1),
        },
        {
          label: "Dismiss",
          onClick: () => toast.closeGroup("ex-toast-actions"),
        },
      ],
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <Button variant="solid" color="amber" onClick={show}>
        Raise a warning with actions
      </Button>
      <p className="text-xs opacity-60">
        The card body is clickable (it counts as a manual retry), the buttons
        are its own clicks, and the custom icon replaces the default warning
        glyph.
      </p>
    </div>
  );
}
