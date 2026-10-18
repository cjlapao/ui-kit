import {
  ALERT_VARIANTS,
  Button,
  ToastProvider,
  ToastViewport,
  useToast,
  type AlertVariant,
} from "@cjlapao/ui-kit";

/**
 * The same five surfaces as Alert — the same token table drives both, so a
 * toast never drifts from the callout language. The glass pair reads best
 * over a busy page.
 */
export default function Surfaces() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-surfaces" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  const show = (variant: AlertVariant) => {
    toast.show({
      group: "ex-toast-surfaces",
      intent: "success",
      variant,
      title: "Payment captured",
      detail: `$42.00 — order #10492`,
      life: 8000,
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {ALERT_VARIANTS.map((variant) => (
          <Button
            key={variant}
            size="sm"
            variant="soft"
            color="emerald"
            onClick={() => show(variant)}
          >
            {variant}
          </Button>
        ))}
      </div>
      <p className="text-xs opacity-60">
        Each button raises the same message on a different surface. Fire two
        quickly to see them stack — the deck geometry is identical across
        variants.
      </p>
    </div>
  );
}
