import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

/**
 * The minimal form: one provider, one viewport, one hook call. The toast
 * lands in the page corner and takes care of its own lifetime.
 */
export default function Basic() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-basic" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <Button
        variant="solid"
        color="blue"
        onClick={() =>
          toast.success("Deployment complete", "All 12 services are healthy.")
        }
      >
        Show a toast
      </Button>
      <p className="text-xs opacity-60">
        It appears in the corner, stays there for five seconds and slides
        itself away — nothing to track on your side.
      </p>
    </div>
  );
}
