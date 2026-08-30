import {
  Button,
  ToastProvider,
  ToastViewport,
  TOAST_POSITIONS,
  useToast,
  type ToastPosition,
} from "@cjlapao/ui-kit";

/**
 * All seven anchor points. Each position owns its own viewport here so the
 * corners stay independent — one viewport per position is the normal shape.
 */
export default function EveryPosition() {
  return (
    <ToastProvider>
      {TOAST_POSITIONS.map((position) => (
        <ToastViewport
          key={position}
          group={`ex-toast-pos-${position}`}
          position={position}
        />
      ))}
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  const showAt = (position: ToastPosition) => {
    toast.show({
      group: `ex-toast-pos-${position}`,
      intent: "neutral",
      title: position,
      detail: "this toast owns its corner",
      life: 6000,
    });
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {TOAST_POSITIONS.map((position) => (
          <Button
            key={position}
            size="sm"
            variant="outline"
            color="blue"
            onClick={() => showAt(position)}
          >
            {position}
          </Button>
        ))}
      </div>
      <p className="text-xs opacity-60">
        Two rem from every edge, exactly like the PrimeVue reference — the
        cards always slide in from the edge they sit on.
      </p>
    </div>
  );
}
